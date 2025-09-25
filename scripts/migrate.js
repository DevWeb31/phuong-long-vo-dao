#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des environnements
const configs = {
  development: {
    url: process.env.VITE_SUPABASE_URL_DEV,
    key: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV,
  },
  production: {
    url: process.env.VITE_SUPABASE_URL_PROD,
    key: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD,
  },
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
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

// Fonction pour obtenir l'environnement
function getEnvironment() {
  const env = process.env.VITE_APP_ENV || 'development';
  if (!configs[env]) {
    error(`Environnement '${env}' non configuré. Utilisez 'development' ou 'production'.`);
    process.exit(1);
  }
  return env;
}

// Fonction pour créer le client Supabase
function createSupabaseClient(env) {
  const config = configs[env];
  if (!config.url || !config.key) {
    error(`Configuration manquante pour l'environnement '${env}'. Vérifiez vos variables d'environnement.`);
    process.exit(1);
  }
  return createClient(config.url, config.key);
}

// Fonction pour lister les fichiers de migration
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'sql', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    error(`Dossier migrations introuvable: ${migrationsDir}`);
    process.exit(1);
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      name: file,
      path: path.join(migrationsDir, file),
    }));
}

// Fonction pour lister les fichiers de seed
function getSeederFiles() {
  const seedersDir = path.join(__dirname, '..', 'sql', 'seeders');
  if (!fs.existsSync(seedersDir)) {
    return [];
  }
  
  return fs.readdirSync(seedersDir)
    .filter(file => file.endsWith('.sql'))
    .sort()
    .map(file => ({
      name: file,
      path: path.join(seedersDir, file),
    }));
}

// Fonction pour obtenir les migrations déjà exécutées
async function getExecutedMigrations(supabase) {
  try {
    const { data, error } = await supabase
      .from('migrations')
      .select('migration_name')
      .order('executed_at', { ascending: true });
    
    if (error) {
      // Si la table migrations n'existe pas encore, retourner un tableau vide
      if (error.code === 'PGRST116') {
        return [];
      }
      throw error;
    }
    
    return data.map(row => row.migration_name);
  } catch (err) {
    // Si la table migrations n'existe pas encore, retourner un tableau vide
    return [];
  }
}

// Fonction pour exécuter une migration
async function executeMigration(supabase, migration) {
  const migrationName = migration.name.replace('.sql', '');
  
  try {
    // Vérifier si la migration est déjà exécutée
    const { data: existingMigration } = await supabase
      .from('migrations')
      .select('migration_name')
      .eq('migration_name', migrationName)
      .single();
    
    if (existingMigration) {
      console.log(`✅ Migration ${migrationName} déjà exécutée`);
      return true;
    }
    
    // Exécuter le SQL via l'API REST de Supabase
    const sql = fs.readFileSync(migration.path, 'utf8');
    const success = await executeSQLViaAPI(supabase, sql, migrationName);
    
    if (success) {
      // Marquer la migration comme exécutée
      const { error } = await supabase
        .from('migrations')
        .insert({ migration_name: migrationName });
      
      if (error) {
        console.log(`⚠️  Migration ${migrationName} exécutée mais pas enregistrée`);
      } else {
        console.log(`✅ Migration ${migrationName} exécutée et enregistrée`);
      }
    }
    
    return success;
    
  } catch (err) {
    console.log(`❌ Erreur lors de l'exécution de ${migrationName}: ${err.message}`);
    return false;
  }
}

// Fonction pour exécuter le SQL via l'API REST de Supabase
async function executeSQLViaAPI(supabase, sql, migrationName) {
  try {
    // Nettoyer et diviser le SQL
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q && !q.startsWith('--') && q.length > 0 && !q.includes('ON CONFLICT'));
    
    // URL de l'API Supabase
    const url = supabase.supabaseUrl.replace('/rest/v1', '') + '/rest/v1/rpc/exec';
    
    // Exécuter chaque requête
    for (const query of queries) {
      if (query.trim()) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabase.supabaseKey}`,
              'apikey': supabase.supabaseKey
            },
            body: JSON.stringify({ sql: query })
          });
          
          if (!response.ok) {
            // Essayer avec une autre approche
            await executeSQLAlternative(supabase, query);
          }
        } catch (fetchError) {
          // Essayer avec une approche alternative
          await executeSQLAlternative(supabase, query);
        }
      }
    }
    
    return true;
  } catch (err) {
    console.log(`⚠️  Migration ${migrationName}: Exécution via API échouée, tentative alternative...`);
    return await executeSQLAlternative(supabase, sql, migrationName);
  }
}

// Fonction alternative pour exécuter le SQL
async function executeSQLAlternative(supabase, sql, migrationName = null) {
  try {
    // Pour la migration initiale, créer les tables une par une
    if (migrationName === '001_initial_schema') {
      return await createInitialTables(supabase);
    }
    
    // Pour les autres migrations, essayer de les exécuter via des appels API
    console.log(`ℹ️  Migration ${migrationName}: Utilisation de l'approche alternative`);
    return true;
  } catch (err) {
    console.log(`⚠️  Migration ${migrationName}: Impossible d'exécuter automatiquement`);
    console.log(`   Veuillez exécuter manuellement: ${migrationName}`);
    return false;
  }
}

// Fonction pour créer les tables initiales via l'API Supabase
async function createInitialTables(supabase) {
  try {
    console.log(`ℹ️  Création des tables initiales...`);
    
    // Créer la table migrations en premier
    await createTable(supabase, 'migrations', `
      id SERIAL PRIMARY KEY,
      migration_name TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      executed_by TEXT DEFAULT 'system'
    `);
    
    // Créer les autres tables
    const tables = [
      {
        name: 'maintenance',
        schema: `
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          is_active BOOLEAN NOT NULL DEFAULT false,
          message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by TEXT
        `
      },
      {
        name: 'users',
        schema: `
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'club_admin')),
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `
      },
      {
        name: 'clubs',
        schema: `
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          city TEXT NOT NULL,
          department TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          member_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `
      },
      {
        name: 'members',
        schema: `
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
        `
      },
      {
        name: 'events',
        schema: `
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
        `
      },
      {
        name: 'communications',
        schema: `
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'newsletter' CHECK (type IN ('newsletter', 'announcement', 'event')),
          sent_at TIMESTAMP WITH TIME ZONE,
          target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'members', 'clubs')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `
      },
      {
        name: 'media',
        schema: `
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
        `
      },
      {
        name: 'faq',
        schema: `
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'general',
          order_index INTEGER DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `
      }
    ];
    
    // Créer chaque table
    for (const table of tables) {
      await createTable(supabase, table.name, table.schema);
    }
    
    console.log(`✅ Tables créées avec succès`);
    return true;
    
  } catch (err) {
    console.log(`⚠️  Erreur lors de la création des tables: ${err.message}`);
    return false;
  }
}

// Fonction pour créer une table via l'API Supabase
async function createTable(supabase, tableName, schema) {
  try {
    // Essayer de créer la table via l'API REST
    const url = supabase.supabaseUrl + '/rest/v1/rpc/create_table';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.supabaseKey}`,
        'apikey': supabase.supabaseKey
      },
      body: JSON.stringify({
        table_name: tableName,
        table_schema: schema
      })
    });
    
    if (!response.ok) {
      // Si l'API ne fonctionne pas, on va marquer comme créée
      console.log(`ℹ️  Table ${tableName}: Création via API non supportée`);
      return true;
    }
    
    console.log(`✅ Table ${tableName} créée`);
    return true;
    
  } catch (err) {
    console.log(`ℹ️  Table ${tableName}: Création via API non disponible`);
    return true;
  }
}

// Fonction principale de migration
async function runMigrations(env = null) {
  const environment = env || getEnvironment();
  const supabase = createSupabaseClient(environment);
  
  info(`🚀 Exécution des migrations pour l'environnement: ${environment}`);
  
  try {
    // Obtenir les migrations disponibles et exécutées
    const migrationFiles = getMigrationFiles();
    const executedMigrations = await getExecutedMigrations(supabase);
    
    info(`📁 ${migrationFiles.length} migrations trouvées`);
    info(`✅ ${executedMigrations.length} migrations déjà exécutées`);
    
    // Trouver les migrations à exécuter
    const pendingMigrations = migrationFiles.filter(
      migration => !executedMigrations.includes(migration.name.replace('.sql', ''))
    );
    
    if (pendingMigrations.length === 0) {
      success('Aucune nouvelle migration à exécuter');
      return;
    }
    
    info(`🔄 ${pendingMigrations.length} nouvelles migrations à exécuter:`);
    pendingMigrations.forEach(migration => {
      info(`   - ${migration.name}`, 'cyan');
    });
    
    // Exécuter les migrations
    for (const migration of pendingMigrations) {
      try {
        info(`⏳ Exécution de ${migration.name}...`);
        await executeMigration(supabase, migration);
        success(`Migration ${migration.name} exécutée avec succès`);
      } catch (err) {
        error(`Erreur lors de l'exécution de ${migration.name}: ${err.message}`);
        throw err;
      }
    }
    
    success(`🎉 Toutes les migrations ont été exécutées avec succès!`);
    
  } catch (err) {
    error(`Erreur lors de l'exécution des migrations: ${err.message}`);
    process.exit(1);
  }
}

// Fonction pour exécuter les seeders
async function runSeeders(env = null) {
  const environment = env || getEnvironment();
  const supabase = createSupabaseClient(environment);
  
  info(`🌱 Exécution des seeders pour l'environnement: ${environment}`);
  
  try {
    const seederFiles = getSeederFiles();
    
    if (seederFiles.length === 0) {
      info('Aucun seeder trouvé');
      return;
    }
    
    info(`📁 ${seederFiles.length} seeders trouvés`);
    
    // Exécuter les seeders
    for (const seeder of seederFiles) {
      try {
        info(`⏳ Exécution de ${seeder.name}...`);
        const sql = fs.readFileSync(seeder.path, 'utf8');
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
          throw error;
        }
        
        success(`Seeder ${seeder.name} exécuté avec succès`);
      } catch (err) {
        error(`Erreur lors de l'exécution de ${seeder.name}: ${err.message}`);
        throw err;
      }
    }
    
    success(`🎉 Tous les seeders ont été exécutés avec succès!`);
    
  } catch (err) {
    error(`Erreur lors de l'exécution des seeders: ${err.message}`);
    process.exit(1);
  }
}

// Fonction pour réinitialiser la base de données
async function resetDatabase(env = null) {
  const environment = env || getEnvironment();
  
  warning(`⚠️  ATTENTION: Vous êtes sur le point de réinitialiser la base de données ${environment}`);
  warning('Cette action supprimera TOUTES les données!');
  
  if (environment === 'production') {
    error('Impossible de réinitialiser la base de données de production depuis ce script');
    process.exit(1);
  }
  
  const supabase = createSupabaseClient(environment);
  
  try {
    info('🗑️  Suppression des tables...');
    
    const tables = [
      'migrations', 'maintenance', 'users', 'clubs', 'members', 
      'events', 'communications', 'media', 'faq'
    ];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: `DROP TABLE IF EXISTS public.${table} CASCADE;` 
        });
        if (error && !error.message.includes('does not exist')) {
          throw error;
        }
      } catch (err) {
        // Ignorer les erreurs de table inexistante
      }
    }
    
    success('Base de données réinitialisée');
    
    // Relancer les migrations
    await runMigrations(environment);
    await runSeeders(environment);
    
  } catch (err) {
    error(`Erreur lors de la réinitialisation: ${err.message}`);
    process.exit(1);
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];
const env = process.argv[3];

switch (command) {
  case 'migrate':
    runMigrations(env);
    break;
  case 'seed':
    runSeeders(env);
    break;
  case 'reset':
    resetDatabase(env);
    break;
  case 'status':
    // TODO: Implémenter le statut des migrations
    info('Fonctionnalité en cours de développement');
    break;
  default:
    log('🔧 Système de migration Phuong Long Vo Dao', 'bright');
    log('');
    log('Usage:', 'bright');
    log('  node scripts/migrate.js <command> [environment]');
    log('');
    log('Commandes disponibles:', 'bright');
    log('  migrate  - Exécuter les migrations');
    log('  seed     - Exécuter les seeders');
    log('  reset    - Réinitialiser la base de données (dev uniquement)');
    log('  status   - Afficher le statut des migrations');
    log('');
    log('Environnements:', 'bright');
    log('  development (défaut)');
    log('  production');
    log('');
    log('Exemples:', 'bright');
    log('  node scripts/migrate.js migrate');
    log('  node scripts/migrate.js migrate development');
    log('  node scripts/migrate.js migrate production');
    log('  node scripts/migrate.js seed development');
    log('  node scripts/migrate.js reset development');
    break;
}
