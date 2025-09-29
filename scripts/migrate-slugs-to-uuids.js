#!/usr/bin/env node
/*
  Migration de données: convertir d’anciens slugs de clubs en UUID dans user_club_access
  - Dry-run par défaut: node scripts/migrate-slugs-to-uuids.js --env development --apply pour appliquer
*/

const { createClient } = require('@supabase/supabase-js');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
require('dotenv').config({ path: '.env.local' });

const argv = yargs(hideBin(process.argv))
  .option('env', { type: 'string', default: 'development' })
  .option('apply', { type: 'boolean', default: false })
  .argv;

const env = argv.env;
const isApply = argv.apply;

const url = env === 'production' ? process.env.VITE_SUPABASE_URL_PROD : process.env.VITE_SUPABASE_URL_DEV;
const key = env === 'production' ? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD : process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV;

if (!url || !key) {
  console.error('Variables Supabase manquantes pour', env);
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log(`🔧 Migration slugs -> UUID (${env}) ${isApply ? '[APPLY]' : '[DRY-RUN]'}`);

  // 1) Charger les clubs pour mapping nom -> id
  const { data: clubs, error: clubsErr } = await supabase
    .from('clubs')
    .select('id, name');
  if (clubsErr) throw clubsErr;
  const nameToId = new Map(clubs.map(c => [c.name, c.id]));

  // 2) Détecter les lignes user_club_access invalides (non-UUID)
  const { data: uca, error: ucaErr } = await supabase
    .from('user_club_access')
    .select('user_id, club_id');
  if (ucaErr) throw ucaErr;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const invalid = (uca || []).filter(r => !uuidRegex.test(r.club_id));

  if (invalid.length === 0) {
    console.log('✅ Aucune ligne à corriger.');
    return;
  }

  console.log(`📋 ${invalid.length} lignes à corriger`);

  // 3) Calculer corrections
  const corrections = [];
  for (const row of invalid) {
    const slugOrName = row.club_id;
    // Essayer par nom exact
    const maybeId = nameToId.get(slugOrName);
    if (maybeId) {
      corrections.push({ user_id: row.user_id, from: slugOrName, to: maybeId });
      continue;
    }
    console.warn('⚠️ Aucune correspondance trouvée pour', slugOrName);
  }

  if (!isApply) {
    console.log('🧪 Dry-run. Corrections proposées:');
    corrections.slice(0, 20).forEach(c => console.log(` - user:${c.user_id} ${c.from} -> ${c.to}`));
    if (corrections.length > 20) console.log(` ... et ${corrections.length - 20} de plus`);
    return;
  }

  // 4) Appliquer (delete + insert corrigés pour conserver PK composite)
  for (const c of corrections) {
    // Supprimer l’ancienne ligne
    const { error: delErr } = await supabase
      .from('user_club_access')
      .delete()
      .eq('user_id', c.user_id)
      .eq('club_id', c.from);
    if (delErr) {
      console.error('❌ Suppression échouée', c, delErr);
      continue;
    }
    // Insérer la corrigée
    const { error: insErr } = await supabase
      .from('user_club_access')
      .insert({ user_id: c.user_id, club_id: c.to });
    if (insErr) {
      console.error('❌ Insertion échouée', c, insErr);
      continue;
    }
    console.log('✅ Corrigé', c.user_id, ':', c.from, '->', c.to);
  }

  console.log('🎉 Migration terminée');
}

main().catch(err => { console.error(err); process.exit(1); });


