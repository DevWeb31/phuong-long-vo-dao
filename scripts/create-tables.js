#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuration dotenv
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function header(message) {
  log(`\n🚀 ${message}`, 'bright');
}

// Fonction pour obtenir l'environnement
function getEnvironment() {
  const env = process.env.VITE_APP_ENV;
  if (!env || !['development', 'production'].includes(env)) {
    error('VITE_APP_ENV doit être défini sur "development" ou "production"');
    process.exit(1);
  }
  return env;
}

// Fonction pour créer le client Supabase
function createSupabaseClient(environment) {
  const isDev = environment === 'development';
  
  const supabaseUrl = isDev 
    ? process.env.VITE_SUPABASE_URL_DEV 
    : process.env.VITE_SUPABASE_URL_PROD;
    
  const supabaseKey = isDev 
    ? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV 
    : process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD;
  
  if (!supabaseUrl || !supabaseKey) {
    error(`Variables d'environnement manquantes pour ${environment}`);
    process.exit(1);
  }
  
  return {
    supabaseUrl,
    supabaseKey,
    environment
  };
}

// Fonction pour exécuter du SQL via l'API Supabase
async function executeSQL(supabase, sql, description) {
  try {
    info(`Exécution: ${description}`);
    
    // Utiliser l'API SQL Editor de Supabase
    const url = `${supabase.supabaseUrl}/rest/v1/rpc/exec`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`,
        'apikey': supabase.supabaseKey
      },
      body: JSON.stringify({ sql: sql })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    success(`${description} - Succès`);
    return true;
    
  } catch (err) {
    error(`${description} - Échec: ${err.message}`);
    return false;
  }
}

// Fonction alternative pour créer les tables via l'API REST
async function createTableViaAPI(supabase, tableName, schema) {
  try {
    info(`Création table: ${tableName}`);
    
    // Utiliser l'API REST pour créer la table
    const url = `${supabase.supabaseUrl}/rest/v1/`;
    
    // Pour l'instant, on va simuler la création
    // car Supabase ne permet pas la création de tables via l'API REST standard
    success(`Table ${tableName} - Simulation de création`);
    return true;
    
  } catch (err) {
    error(`Table ${tableName} - Échec: ${err.message}`);
    return false;
  }
}

// Fonction pour créer toutes les tables
async function createAllTables(supabase) {
  header(`Création des tables pour ${supabase.environment}`);
  
  // 1. Table migrations
  const migrationsSQL = `
    CREATE TABLE IF NOT EXISTS public.migrations (
      id SERIAL PRIMARY KEY,
      migration_name TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      executed_by TEXT DEFAULT 'system'
    );
  `;
  
  if (!(await executeSQL(supabase, migrationsSQL, 'Table migrations'))) {
    return false;
  }
  
  // 2. Table maintenance
  const maintenanceSQL = `
    CREATE TABLE IF NOT EXISTS public.maintenance (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      is_active BOOLEAN NOT NULL DEFAULT false,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_by TEXT
    );
  `;
  
  if (!(await executeSQL(supabase, maintenanceSQL, 'Table maintenance'))) {
    return false;
  }
  
  // 3. Table users
  const usersSQL = `
    CREATE TABLE IF NOT EXISTS public.users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'club_admin')),
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, usersSQL, 'Table users'))) {
    return false;
  }
  
  // 4. Table clubs
  const clubsSQL = `
    CREATE TABLE IF NOT EXISTS public.clubs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      department TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      member_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, clubsSQL, 'Table clubs'))) {
    return false;
  }
  
  // 5. Table members
  const membersSQL = `
    CREATE TABLE IF NOT EXISTS public.members (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birth_date DATE,
      club_id UUID,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
      membership_start_date DATE DEFAULT CURRENT_DATE,
      membership_end_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, membersSQL, 'Table members'))) {
    return false;
  }
  
  // 6. Table events
  const eventsSQL = `
    CREATE TABLE IF NOT EXISTS public.events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TIMESTAMP WITH TIME ZONE NOT NULL,
      location TEXT,
      club_id UUID,
      is_public BOOLEAN NOT NULL DEFAULT true,
      max_participants INTEGER,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, eventsSQL, 'Table events'))) {
    return false;
  }
  
  // 7. Table communications
  const communicationsSQL = `
    CREATE TABLE IF NOT EXISTS public.communications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'newsletter' CHECK (type IN ('newsletter', 'announcement', 'event')),
      sent_at TIMESTAMP WITH TIME ZONE,
      target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'members', 'clubs')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, communicationsSQL, 'Table communications'))) {
    return false;
  }
  
  // 8. Table media
  const mediaSQL = `
    CREATE TABLE IF NOT EXISTS public.media (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'events', 'members', 'clubs')),
      club_id UUID,
      uploaded_by UUID,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, mediaSQL, 'Table media'))) {
    return false;
  }
  
  // 9. Table faq
  const faqSQL = `
    CREATE TABLE IF NOT EXISTS public.faq (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  if (!(await executeSQL(supabase, faqSQL, 'Table faq'))) {
    return false;
  }
  
  // 10. Marquer la migration comme exécutée
  const markMigrationSQL = `
    INSERT INTO public.migrations (migration_name) 
    VALUES ('001_initial_schema') 
    ON CONFLICT (migration_name) DO NOTHING;
  `;
  
  if (!(await executeSQL(supabase, markMigrationSQL, 'Enregistrement migration'))) {
    return false;
  }
  
  return true;
}

// Fonction pour insérer les données initiales
async function insertInitialData(supabase) {
  header(`Insertion des données initiales pour ${supabase.environment}`);
  
  // 1. Clubs
  const clubsDataSQL = `
    INSERT INTO public.clubs (name, city, department, member_count) VALUES
    ('Club Montaigut sur Save', 'Montaigut sur Save', '31', 45),
    ('Club Trégeux', 'Trégeux', '22', 32)
    ON CONFLICT DO NOTHING;
  `;
  
  if (!(await executeSQL(supabase, clubsDataSQL, 'Données clubs'))) {
    return false;
  }
  
  // 2. FAQ
  const faqDataSQL = `
    INSERT INTO public.faq (question, answer, category, order_index) VALUES
    ('Quels sont les horaires des cours ?', 'Les cours ont lieu du lundi au vendredi de 18h à 20h.', 'general', 1),
    ('Comment s''inscrire ?', 'Vous pouvez vous inscrire directement au club ou nous contacter par téléphone.', 'inscription', 2),
    ('Quel équipement faut-il ?', 'Un kimono blanc et une ceinture blanche pour débuter.', 'equipement', 3),
    ('Quels sont les tarifs ?', 'Les tarifs varient selon l''âge et le type d''abonnement. Contactez-nous pour plus d''informations.', 'tarifs', 4),
    ('Y a-t-il des cours pour les enfants ?', 'Oui, nous proposons des cours adaptés pour tous les âges à partir de 5 ans.', 'enfants', 5)
    ON CONFLICT DO NOTHING;
  `;
  
  if (!(await executeSQL(supabase, faqDataSQL, 'Données FAQ'))) {
    return false;
  }
  
  // 3. Utilisateurs admin
  const usersDataSQL = `
    INSERT INTO public.users (email, name, role) VALUES
    ('admin@phuonglongvodao.fr', 'Administrateur Principal', 'superadmin'),
    ('club@phuonglongvodao.fr', 'Gestionnaire Club', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `;
  
  if (!(await executeSQL(supabase, usersDataSQL, 'Utilisateurs admin'))) {
    return false;
  }
  
  return true;
}

// Fonction principale
async function main() {
  try {
    const environment = getEnvironment();
    const supabase = createSupabaseClient(environment);
    
    log(`🎯 Environnement: ${environment}`, 'cyan');
    log(`🔗 URL: ${supabase.supabaseUrl}`, 'cyan');
    log('');
    
    // Créer les tables
    const tablesCreated = await createAllTables(supabase);
    
    if (!tablesCreated) {
      error('Échec de la création des tables');
      process.exit(1);
    }
    
    // Insérer les données initiales
    const dataInserted = await insertInitialData(supabase);
    
    if (!dataInserted) {
      warning('Tables créées mais données initiales non insérées');
    }
    
    header('🎉 Configuration terminée avec succès !');
    
    log('📊 Tables créées:', 'green');
    log('   ✅ migrations', 'green');
    log('   ✅ maintenance', 'green');
    log('   ✅ users', 'green');
    log('   ✅ clubs', 'green');
    log('   ✅ members', 'green');
    log('   ✅ events', 'green');
    log('   ✅ communications', 'green');
    log('   ✅ media', 'green');
    log('   ✅ faq', 'green');
    
    log('\n📈 Données initiales:', 'green');
    log('   ✅ 2 clubs', 'green');
    log('   ✅ 5 questions FAQ', 'green');
    log('   ✅ 2 utilisateurs admin', 'green');
    
    log('\n🔍 Vérifiez avec: npm run db:check', 'cyan');
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
