#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

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

// Fonction pour détecter le système d'exploitation
function getOS() {
  const platform = os.platform();
  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows';
  if (platform === 'linux') return 'linux';
  return 'unknown';
}

// Fonction pour vérifier si Homebrew est installé (macOS)
async function checkHomebrew() {
  try {
    await execAsync('brew --version');
    return true;
  } catch (err) {
    return false;
  }
}

// Fonction pour installer PostgreSQL (psql)
async function installPostgreSQL() {
  const os = getOS();
  
  try {
    switch (os) {
      case 'macos':
        const hasHomebrew = await checkHomebrew();
        if (hasHomebrew) {
          info('Installation de PostgreSQL via Homebrew...');
          await execAsync('brew install postgresql');
          success('PostgreSQL installé avec succès');
        } else {
          error('Homebrew non trouvé. Installez PostgreSQL manuellement depuis: https://postgresapp.com/');
          return false;
        }
        break;
        
      case 'linux':
        info('Installation de PostgreSQL via apt...');
        await execAsync('sudo apt update && sudo apt install -y postgresql-client');
        success('PostgreSQL installé avec succès');
        break;
        
      case 'windows':
        info('Téléchargez PostgreSQL depuis: https://www.postgresql.org/download/windows/');
        info('Ou utilisez Chocolatey: choco install postgresql');
        return false;
        
      default:
        error('Système d\'exploitation non supporté');
        return false;
    }
    
    return true;
  } catch (err) {
    error(`Erreur installation PostgreSQL: ${err.message}`);
    return false;
  }
}

// Fonction pour installer Supabase CLI
async function installSupabaseCLI() {
  const os = getOS();
  
  try {
    switch (os) {
      case 'macos':
        const hasHomebrew = await checkHomebrew();
        if (hasHomebrew) {
          info('Installation de Supabase CLI via Homebrew...');
          await execAsync('brew install supabase/tap/supabase');
          success('Supabase CLI installé avec succès');
        } else {
          info('Installation de Supabase CLI via npm...');
          await execAsync('npm install -g supabase');
          success('Supabase CLI installé avec succès');
        }
        break;
        
      case 'linux':
        info('Installation de Supabase CLI...');
        await execAsync('curl -fsSL https://supabase.com/install.sh | sh');
        success('Supabase CLI installé avec succès');
        break;
        
      case 'windows':
        info('Téléchargez Supabase CLI depuis: https://github.com/supabase/cli/releases');
        info('Ou utilisez Chocolatey: choco install supabase');
        return false;
        
      default:
        error('Système d\'exploitation non supporté');
        return false;
    }
    
    return true;
  } catch (err) {
    error(`Erreur installation Supabase CLI: ${err.message}`);
    return false;
  }
}

// Fonction pour vérifier les outils
async function checkTools() {
  try {
    await execAsync('psql --version');
    return { psql: true, supabase: false };
  } catch (err) {
    try {
      await execAsync('supabase --version');
      return { psql: false, supabase: true };
    } catch (err2) {
      return { psql: false, supabase: false };
    }
  }
}

// Fonction principale
async function main() {
  try {
    header('Installation des outils pour l\'automatisation Supabase');
    
    const os = getOS();
    log(`🖥️  Système: ${os}`, 'cyan');
    
    // Vérifier les outils existants
    const tools = await checkTools();
    
    if (tools.psql && tools.supabase) {
      success('Tous les outils sont déjà installés !');
      return;
    }
    
    if (!tools.psql) {
      info('PostgreSQL (psql) non trouvé');
      const installed = await installPostgreSQL();
      if (!installed) {
        error('Installation de PostgreSQL échouée');
        return;
      }
    }
    
    if (!tools.supabase) {
      info('Supabase CLI non trouvé');
      const installed = await installSupabaseCLI();
      if (!installed) {
        error('Installation de Supabase CLI échouée');
        return;
      }
    }
    
    header('🎉 Installation terminée !');
    log('Vous pouvez maintenant utiliser:', 'green');
    log('   npm run db:auto-create:dev', 'green');
    log('   npm run db:auto-create:prod', 'green');
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
