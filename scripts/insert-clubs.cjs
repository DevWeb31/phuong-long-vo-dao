const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Variables d\'environnement manquantes');
  console.log('Vérifiez que VITE_SUPABASE_URL et VITE_SUPABASE_SERVICE_ROLE_KEY sont définies dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const clubs = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Club Montaigut sur Save',
    city: 'Montaigut sur Save',
    department: '31',
    is_active: true,
    member_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Club Trégeux',
    city: 'Trégeux',
    department: '22',
    is_active: true,
    member_count: 32,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function insertClubs() {
  console.log('🚀 Insertion des clubs dans la base de données...');
  
  for (const club of clubs) {
    console.log(`📝 Insertion du club: ${club.name}`);
    
    const { data, error } = await supabase
      .from('clubs')
      .upsert([club], { onConflict: 'id' })
      .select();
    
    if (error) {
      console.error(`❌ Erreur lors de l'insertion du club ${club.name}:`, error);
    } else {
      console.log(`✅ Club ${club.name} inséré avec succès`);
    }
  }
  
  console.log('🎉 Insertion terminée !');
}

insertClubs().catch(console.error);
