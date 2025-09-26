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
  cyan: '\x1b[36m'
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

// Fonction pour obtenir les informations Supabase
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
  
  return {
    supabaseUrl,
    supabaseKey,
    environment
  };
}

// Fonction pour générer le guide de configuration
function generateAuthSetupGuide(config) {
  header(`Configuration de l'authentification Supabase pour ${config.environment}`);
  
  log(`🎯 Environnement: ${config.environment}`, 'cyan');
  log(`🔗 URL: ${config.supabaseUrl}`, 'cyan');
  log('');
  
  info('📋 Étapes de configuration dans Supabase :');
  log('');
  
  log('1️⃣  Activer l\'authentification par email :', 'green');
  log('   • Allez dans Authentication > Settings', 'yellow');
  log('   • Activez "Enable email confirmations"', 'yellow');
  log('   • Configurez "Site URL" : http://localhost:5173/admin', 'yellow');
  log('');
  
  log('2️⃣  Configurer les utilisateurs admin :', 'green');
  log('   • Allez dans Authentication > Users', 'yellow');
  log('   • Cliquez sur "Add user"', 'yellow');
  log('   • Email : [votre email admin]', 'yellow');
  log('   • Mot de passe : [votre mot de passe sécurisé]', 'yellow');
  log('   • Confirmez l\'email automatiquement', 'yellow');
  log('');
  
  log('3️⃣  Vérifier la table users :', 'green');
  log('   • Allez dans Table Editor > users', 'yellow');
  log('   • Vérifiez que l\'utilisateur admin existe', 'yellow');
  log('   • Role : superadmin', 'yellow');
  log('');
  
  log('4️⃣  Configurer les politiques RLS (optionnel) :', 'green');
  log('   • Allez dans Authentication > Policies', 'yellow');
  log('   • Créez des politiques pour la table users', 'yellow');
  log('   • Ou désactivez RLS pour simplifier', 'yellow');
  log('');
  
  success('🎉 Configuration terminée !');
  log('');
  log('📝 Prochaines étapes :', 'cyan');
  log('   • Testez la connexion avec vos identifiants', 'cyan');
  log('   • Vérifiez que l\'accès admin fonctionne', 'cyan');
  log('   • Configurez d\'autres utilisateurs si nécessaire', 'cyan');
}

// Fonction principale
async function main() {
  try {
    const environment = getEnvironment();
    const config = getSupabaseConfig(environment);
    
    generateAuthSetupGuide(config);
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
