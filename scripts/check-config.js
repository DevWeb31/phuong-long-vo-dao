#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

// Configuration des environnements
const configs = {
  development: {
    url: process.env.VITE_SUPABASE_URL_DEV,
    key: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV,
    name: 'Développement',
  },
  production: {
    url: process.env.VITE_SUPABASE_URL_PROD,
    key: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD,
    name: 'Production',
  },
};

// Fonction pour tester la connexion
async function testConnection(config, envName) {
  try {
    info(`Test de connexion ${envName}...`);
    
    if (!config.url || !config.key) {
      error(`Configuration manquante pour ${envName}`);
      return false;
    }
    
    if (config.key === 'your_service_role_key_here' || config.key === 'your_anon_key_here') {
      error(`${envName}: Clé par défaut détectée, veuillez configurer votre vraie clé`);
      return false;
    }
    
    const supabase = createClient(config.url, config.key);
    
    // Test simple : récupérer les migrations
    const { data, error: supabaseError } = await supabase
      .from('migrations')
      .select('migration_name')
      .limit(1);
    
    if (supabaseError) {
      if (supabaseError.code === 'PGRST116' || supabaseError.message.includes('Could not find the table')) {
        warning(`${envName}: Tables non initialisées (normal si pas encore configuré)`);
        info(`   → Lancez 'npm run db:setup' pour initialiser`);
      } else {
        error(`${envName}: Erreur de connexion - ${supabaseError.message}`);
        return false;
      }
    } else {
      success(`${envName}: Connexion réussie`);
    }
    
    return true;
  } catch (err) {
    error(`${envName}: Erreur de connexion - ${err.message}`);
    return false;
  }
}

// Fonction pour vérifier les variables d'environnement
function checkEnvironmentVariables() {
  log('🔍 Vérification des variables d\'environnement...', 'bright');
  
  const requiredVars = [
    'VITE_APP_ENV',
    'VITE_SUPABASE_URL_DEV',
    'VITE_SUPABASE_SERVICE_ROLE_KEY_DEV',
    'VITE_SUPABASE_URL_PROD',
    'VITE_SUPABASE_SERVICE_ROLE_KEY_PROD',
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      error(`Variable manquante: ${varName}`);
      allPresent = false;
    } else if (value.includes('your_') || value.includes('here')) {
      warning(`Variable par défaut détectée: ${varName}`);
    } else {
      success(`Variable configurée: ${varName}`);
    }
  }
  
  return allPresent;
}

// Fonction principale
async function checkConfiguration() {
  log('🔧 Vérification de la configuration Supabase', 'bright');
  log('');
  
  // Vérifier les variables d'environnement
  const envVarsOk = checkEnvironmentVariables();
  
  if (!envVarsOk) {
    log('');
    error('Configuration incomplète. Veuillez configurer votre fichier .env.local');
    log('');
    log('Guide de configuration:', 'bright');
    log('1. Copiez le template: cp docs/env-template.txt .env.local');
    log('2. Éditez .env.local avec vos vraies clés Supabase');
    log('3. Relancez ce script');
    process.exit(1);
  }
  
  log('');
  
  // Tester les connexions
  const results = {};
  
  for (const [env, config] of Object.entries(configs)) {
    results[env] = await testConnection(config, config.name);
  }
  
  log('');
  
  // Résumé
  log('📊 Résumé de la configuration:', 'bright');
  
  for (const [env, isSuccess] of Object.entries(results)) {
    if (isSuccess) {
      success(`${configs[env].name}: Configuration OK`);
    } else {
      error(`${configs[env].name}: Configuration KO`);
    }
  }
  
  const allOk = Object.values(results).every(r => r);
  
  if (allOk) {
    log('');
    success('🎉 Configuration Supabase correcte !');
    log('');
    log('Prochaines étapes:', 'bright');
    log('1. Initialisez vos bases de données: npm run db:setup');
    log('2. Testez les migrations: npm run db:migrate:dev');
    log('3. Configurez les secrets GitHub (voir docs/GITHUB_SECRETS_SETUP.md)');
  } else {
    log('');
    warning('⚠️  Configuration Supabase détectée, mais bases de données non initialisées.');
    log('');
    log('Prochaines étapes:', 'bright');
    log('1. Initialisez vos bases de données: npm run db:setup');
    log('2. Puis relancez: npm run db:check');
  }
}

// Exécuter la vérification
checkConfiguration().catch(err => {
  error(`Erreur lors de la vérification: ${err.message}`);
  process.exit(1);
});
