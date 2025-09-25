#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

function showSetupGuide() {
  log('🚀 Guide de Configuration Initiale - Phuong Long Vo Dao', 'bright');
  log('');
  
  log('📋 Étapes à suivre pour initialiser vos bases de données:', 'bright');
  log('');
  
  // Base de développement
  log('1️⃣  BASE DE DÉVELOPPEMENT', 'cyan');
  log('   👉 Allez sur: https://vdetbcyixkunrtfdvzcp.supabase.co');
  log('   👉 Connectez-vous avec vos identifiants');
  log('   👉 Allez dans "SQL Editor" → "New query"');
  log('');
  
  // Afficher le contenu du fichier de migration
  const migrationPath = path.join(__dirname, '..', 'sql', 'migrations', '001_initial_schema.sql');
  if (fs.existsSync(migrationPath)) {
    log('   📄 Copiez-collez ce contenu dans l\'éditeur SQL:', 'yellow');
    log('');
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    console.log(colors.yellow + migrationContent + colors.reset);
    log('');
    log('   👉 Cliquez sur "Run" pour exécuter');
    log('');
  }
  
  // Données initiales
  const seederPath = path.join(__dirname, '..', 'sql', 'seeders', '001_initial_data.sql');
  if (fs.existsSync(seederPath)) {
    log('   📄 Puis copiez-collez ce contenu pour les données initiales:', 'yellow');
    log('');
    const seederContent = fs.readFileSync(seederPath, 'utf8');
    console.log(colors.yellow + seederContent + colors.reset);
    log('');
    log('   👉 Cliquez sur "Run" pour exécuter');
    log('');
  }
  
  // Base de production
  log('2️⃣  BASE DE PRODUCTION', 'cyan');
  log('   👉 Allez sur: https://takhrcuzmecaerwwimpf.supabase.co');
  log('   👉 Répétez les mêmes étapes que pour le développement');
  log('   👉 Utilisez les mêmes fichiers SQL');
  log('');
  
  // Vérification
  log('3️⃣  VÉRIFICATION', 'cyan');
  log('   👉 Une fois terminé, lancez: npm run db:check');
  log('   👉 Vous devriez voir "Configuration OK"');
  log('');
  
  // Prochaines étapes
  log('4️⃣  PROCHAINES ÉTAPES', 'cyan');
  log('   👉 Configurez les secrets GitHub (docs/GITHUB_SECRETS_SETUP.md)');
  log('   👉 Testez les migrations: npm run db:create "test migration"');
  log('   👉 Créez une PR pour tester l\'automatisation');
  log('');
  
  success('🎉 Une fois terminé, votre système de migration sera opérationnel !');
  log('');
  
  log('💡 Astuce: Gardez cette page ouverte pendant la configuration', 'bright');
}

// Exécuter le guide
showSetupGuide();
