#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Configuration dotenv
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

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

// Fonction pour obtenir les informations de connexion Supabase
function getSupabaseConfig(environment) {
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
  
  // Extraire les informations de connexion PostgreSQL
  const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!urlMatch) {
    error('URL Supabase invalide');
    process.exit(1);
  }
  
  const projectRef = urlMatch[1];
  
  return {
    supabaseUrl,
    supabaseKey,
    projectRef,
    environment
  };
}

// Fonction pour vérifier si psql est installé
async function checkPsql() {
  try {
    await execAsync('psql --version');
    return true;
  } catch (err) {
    return false;
  }
}

// Fonction pour vérifier si Supabase CLI est installé
async function checkSupabaseCLI() {
  try {
    await execAsync('supabase --version');
    return true;
  } catch (err) {
    return false;
  }
}

// Fonction pour créer les tables via psql
async function createTablesViaPsql(config) {
  try {
    header(`Création automatique via psql pour ${config.environment}`);
    
    // Construire la commande psql
    const host = `${config.projectRef}.supabase.co`;
    const port = '5432';
    const database = 'postgres';
    const username = 'postgres';
    
    // Le mot de passe sera demandé interactivement
    const connectionString = `postgresql://${username}@${host}:${port}/${database}`;
    
    info(`Connexion à: ${host}:${port}/${database}`);
    warning('Vous devrez entrer le mot de passe de votre base de données');
    
    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, '..', 'sql', 'migrations', '001_initial_schema.sql');
    const dataFile = path.join(__dirname, '..', 'sql', 'seeders', '001_initial_data.sql');
    
    if (!fs.existsSync(sqlFile)) {
      error(`Fichier SQL non trouvé: ${sqlFile}`);
      return false;
    }
    
    // Exécuter la migration
    info('Exécution du schéma initial...');
    const migrationCmd = `psql "${connectionString}" -f "${sqlFile}"`;
    
    log(`Commande: ${migrationCmd}`, 'cyan');
    log('Entrez votre mot de passe PostgreSQL quand demandé', 'yellow');
    
    const { stdout, stderr } = await execAsync(migrationCmd);
    
    if (stderr && !stderr.includes('password')) {
      error(`Erreur migration: ${stderr}`);
      return false;
    }
    
    success('Migration exécutée avec succès');
    
    // Exécuter les données initiales
    if (fs.existsSync(dataFile)) {
      info('Insertion des données initiales...');
      const dataCmd = `psql "${connectionString}" -f "${dataFile}"`;
      
      const { stdout: dataStdout, stderr: dataStderr } = await execAsync(dataCmd);
      
      if (dataStderr && !dataStderr.includes('password')) {
        warning(`Avertissement données: ${dataStderr}`);
      } else {
        success('Données initiales insérées avec succès');
      }
    }
    
    return true;
    
  } catch (err) {
    error(`Erreur psql: ${err.message}`);
    return false;
  }
}

// Fonction pour créer les tables via Supabase CLI
async function createTablesViaSupabaseCLI(config) {
  try {
    header(`Création automatique via Supabase CLI pour ${config.environment}`);
    
    // Initialiser le projet Supabase
    info('Initialisation du projet Supabase...');
    
    const initCmd = `supabase init`;
    await execAsync(initCmd, { cwd: process.cwd() });
    
    // Lier le projet
    info(`Liaison avec le projet ${config.projectRef}...`);
    
    const linkCmd = `supabase link --project-ref ${config.projectRef}`;
    await execAsync(linkCmd);
    
    // Appliquer les migrations
    info('Application des migrations...');
    
    const migrateCmd = `supabase db push`;
    const { stdout, stderr } = await execAsync(migrateCmd);
    
    if (stderr && !stderr.includes('warning')) {
      error(`Erreur migration: ${stderr}`);
      return false;
    }
    
    success('Migration appliquée avec succès via Supabase CLI');
    return true;
    
  } catch (err) {
    error(`Erreur Supabase CLI: ${err.message}`);
    return false;
  }
}

// Fonction pour créer les tables via l'API REST (méthode alternative)
async function createTablesViaAPI(config) {
  try {
    header(`Création automatique via API REST pour ${config.environment}`);
    
    // Cette méthode utilise l'API Management de Supabase
    const url = `${config.supabaseUrl}/rest/v1/rpc/exec_sql`;
    
    // Lire le fichier SQL
    const sqlFile = path.join(__dirname, '..', 'sql', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Diviser le SQL en requêtes individuelles
    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q && !q.startsWith('--') && q.length > 0);
    
    let successCount = 0;
    
    for (const query of queries) {
      if (query.trim()) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.supabaseKey}`,
              'apikey': config.supabaseKey
            },
            body: JSON.stringify({ sql_query: query })
          });
          
          if (response.ok) {
            successCount++;
            info(`✅ Requête exécutée: ${query.substring(0, 50)}...`);
          } else {
            warning(`⚠️  Requête ignorée: ${query.substring(0, 50)}...`);
          }
        } catch (fetchErr) {
          warning(`⚠️  Erreur requête: ${fetchErr.message}`);
        }
      }
    }
    
    if (successCount > 0) {
      success(`${successCount} requêtes exécutées avec succès`);
      return true;
    } else {
      error('Aucune requête n\'a pu être exécutée');
      return false;
    }
    
  } catch (err) {
    error(`Erreur API: ${err.message}`);
    return false;
  }
}

// Fonction principale
async function main() {
  try {
    const environment = getEnvironment();
    const config = getSupabaseConfig(environment);
    
    log(`🎯 Environnement: ${environment}`, 'cyan');
    log(`🔗 Projet: ${config.projectRef}`, 'cyan');
    log('');
    
    // Vérifier les outils disponibles
    const hasPsql = await checkPsql();
    const hasSupabaseCLI = await checkSupabaseCLI();
    
    info(`Outils disponibles:`);
    log(`   psql: ${hasPsql ? '✅' : '❌'}`, hasPsql ? 'green' : 'red');
    log(`   Supabase CLI: ${hasSupabaseCLI ? '✅' : '❌'}`, hasSupabaseCLI ? 'green' : 'red');
    log('');
    
    let success = false;
    
    // Essayer les différentes méthodes dans l'ordre de préférence
    if (hasSupabaseCLI) {
      info('🚀 Tentative avec Supabase CLI...');
      success = await createTablesViaSupabaseCLI(config);
    }
    
    if (!success && hasPsql) {
      info('🚀 Tentative avec psql...');
      success = await createTablesViaPsql(config);
    }
    
    if (!success) {
      info('🚀 Tentative avec API REST...');
      success = await createTablesViaAPI(config);
    }
    
    if (success) {
      header('🎉 Tables créées avec succès !');
      log('Vérifiez avec: npm run db:check', 'cyan');
    } else {
      error('Impossible de créer les tables automatiquement');
      log('Utilisez: npm run db:sql:dev pour obtenir les scripts SQL', 'yellow');
    }
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
