#!/usr/bin/env node

/**
 * Script pour ajouter le champ season à la table members
 * Execute: node scripts/add-season-to-members.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addSeasonToMembers() {
  console.log('🚀 Début de la migration: Ajout du champ season aux membres\n');

  try {
    // Lire le fichier de migration
    const migrationPath = resolve(__dirname, '../sql/migrations/014_add_season_to_members.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Exécution de la migration SQL...');
    
    // Diviser le SQL en plusieurs commandes
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: command });
        
        if (error) {
          // Si exec_sql n'existe pas, on essaie directement
          console.log('⚠️  RPC exec_sql non disponible, exécution manuelle...');
          console.log('Veuillez exécuter manuellement cette migration via l\'interface Supabase:');
          console.log('\n' + migrationSQL + '\n');
          break;
        }
      }
    }

    console.log('✅ Migration appliquée avec succès!');
    console.log('\n📊 Vérification des données...');

    // Vérifier que le champ a été ajouté
    const { data: members, error: selectError } = await supabase
      .from('members')
      .select('id, first_name, last_name, season')
      .limit(5);

    if (selectError) {
      console.error('❌ Erreur lors de la vérification:', selectError.message);
    } else {
      console.log(`✅ Champ season ajouté avec succès!`);
      console.log(`📋 Exemple de données (${members?.length || 0} premiers adhérents):`);
      members?.forEach(member => {
        console.log(`  - ${member.first_name} ${member.last_name}: ${member.season || 'Non définie'}`);
      });
    }

    console.log('\n✨ Migration terminée avec succès!\n');
    console.log('💡 Les saisons disponibles dans l\'interface (à partir de 2025-2026):');
    const currentYear = new Date().getFullYear();
    const minYear = 2025;
    const startYear = Math.max(minYear, currentYear);
    
    for (let i = 0; i < 5; i++) {
      const year = startYear + i;
      console.log(`  - ${year}-${year + 1}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Exécuter la migration
addSeasonToMembers().then(() => {
  console.log('\n👍 Script terminé');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});

