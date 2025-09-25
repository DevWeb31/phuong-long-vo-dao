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

// Fonction pour créer les tables via l'API Supabase Management
async function createTablesViaManagementAPI(config) {
  try {
    header(`Création via API Management pour ${config.environment}`);
    
    // URL de l'API Management de Supabase
    const managementUrl = config.supabaseUrl.replace('/rest/v1', '');
    
    // Créer les tables une par une via l'API REST
    const tables = [
      {
        name: 'migrations',
        schema: {
          id: { type: 'serial', primary_key: true },
          migration_name: { type: 'text', unique: true, not_null: true },
          executed_at: { type: 'timestamptz', default: 'now()' },
          executed_by: { type: 'text', default: "'system'" }
        }
      },
      {
        name: 'maintenance',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          is_active: { type: 'boolean', not_null: true, default: false },
          message: { type: 'text' },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' },
          created_by: { type: 'text' }
        }
      },
      {
        name: 'users',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          email: { type: 'text', unique: true, not_null: true },
          name: { type: 'text', not_null: true },
          role: { type: 'text', not_null: true, default: "'admin'" },
          last_login: { type: 'timestamptz' },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'clubs',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          name: { type: 'text', not_null: true },
          city: { type: 'text', not_null: true },
          department: { type: 'text', not_null: true },
          is_active: { type: 'boolean', not_null: true, default: true },
          member_count: { type: 'integer', not_null: true, default: 0 },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'members',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          first_name: { type: 'text', not_null: true },
          last_name: { type: 'text', not_null: true },
          email: { type: 'text' },
          phone: { type: 'text' },
          birth_date: { type: 'date' },
          club_id: { type: 'uuid' },
          status: { type: 'text', not_null: true, default: "'active'" },
          membership_start_date: { type: 'date', default: 'current_date' },
          membership_end_date: { type: 'date' },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'events',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          title: { type: 'text', not_null: true },
          description: { type: 'text' },
          date: { type: 'timestamptz', not_null: true },
          location: { type: 'text' },
          club_id: { type: 'uuid' },
          is_public: { type: 'boolean', not_null: true, default: true },
          max_participants: { type: 'integer' },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'communications',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          title: { type: 'text', not_null: true },
          content: { type: 'text', not_null: true },
          type: { type: 'text', not_null: true, default: "'newsletter'" },
          sent_at: { type: 'timestamptz' },
          target_audience: { type: 'text', not_null: true, default: "'all'" },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'media',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          filename: { type: 'text', not_null: true },
          original_name: { type: 'text', not_null: true },
          mime_type: { type: 'text', not_null: true },
          size: { type: 'integer', not_null: true },
          url: { type: 'text', not_null: true },
          category: { type: 'text', not_null: true, default: "'general'" },
          club_id: { type: 'uuid' },
          uploaded_by: { type: 'uuid' },
          created_at: { type: 'timestamptz', default: 'now()' }
        }
      },
      {
        name: 'faq',
        schema: {
          id: { type: 'uuid', default: 'gen_random_uuid()', primary_key: true },
          question: { type: 'text', not_null: true },
          answer: { type: 'text', not_null: true },
          category: { type: 'text', not_null: true, default: "'general'" },
          order_index: { type: 'integer', default: 0 },
          is_active: { type: 'boolean', not_null: true, default: true },
          created_at: { type: 'timestamptz', default: 'now()' },
          updated_at: { type: 'timestamptz', default: 'now()' }
        }
      }
    ];
    
    let successCount = 0;
    
    for (const table of tables) {
      try {
        info(`Création de la table: ${table.name}`);
        
        // Créer la table via l'API REST
        const response = await fetch(`${config.supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.supabaseKey}`,
            'apikey': config.supabaseKey
          },
          body: JSON.stringify({
            table: table.name,
            schema: table.schema
          })
        });
        
        if (response.ok) {
          success(`Table ${table.name} créée`);
          successCount++;
        } else {
          const errorText = await response.text();
          if (errorText.includes('already exists') || errorText.includes('duplicate')) {
            info(`Table ${table.name} existe déjà`);
            successCount++;
          } else {
            warning(`Table ${table.name}: ${errorText}`);
          }
        }
      } catch (err) {
        warning(`Table ${table.name}: ${err.message}`);
      }
    }
    
    if (successCount > 0) {
      success(`${successCount} tables créées/vérifiées`);
      return true;
    } else {
      error('Aucune table n\'a pu être créée');
      return false;
    }
    
  } catch (err) {
    error(`Erreur API Management: ${err.message}`);
    return false;
  }
}

// Fonction pour insérer les données initiales
async function insertInitialData(config) {
  try {
    header(`Insertion des données initiales pour ${config.environment}`);
    
    // Données des clubs
    const clubsData = [
      { name: 'Club Montaigut sur Save', city: 'Montaigut sur Save', department: '31', member_count: 45 },
      { name: 'Club Trégeux', city: 'Trégeux', department: '22', member_count: 32 }
    ];
    
    for (const club of clubsData) {
      try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/clubs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.supabaseKey}`,
            'apikey': config.supabaseKey
          },
          body: JSON.stringify(club)
        });
        
        if (response.ok) {
          success(`Club "${club.name}" inséré`);
        } else {
          const errorText = await response.text();
          if (errorText.includes('duplicate') || errorText.includes('already exists')) {
            info(`Club "${club.name}" existe déjà`);
          } else {
            warning(`Club "${club.name}": ${errorText}`);
          }
        }
      } catch (err) {
        warning(`Club "${club.name}": ${err.message}`);
      }
    }
    
    // Données FAQ
    const faqData = [
      { question: 'Quels sont les horaires des cours ?', answer: 'Les cours ont lieu du lundi au vendredi de 18h à 20h.', category: 'general', order_index: 1 },
      { question: 'Comment s\'inscrire ?', answer: 'Vous pouvez vous inscrire directement au club ou nous contacter par téléphone.', category: 'inscription', order_index: 2 },
      { question: 'Quel équipement faut-il ?', answer: 'Un kimono blanc et une ceinture blanche pour débuter.', category: 'equipement', order_index: 3 },
      { question: 'Quels sont les tarifs ?', answer: 'Les tarifs varient selon l\'âge et le type d\'abonnement. Contactez-nous pour plus d\'informations.', category: 'tarifs', order_index: 4 },
      { question: 'Y a-t-il des cours pour les enfants ?', answer: 'Oui, nous proposons des cours adaptés pour tous les âges à partir de 5 ans.', category: 'enfants', order_index: 5 }
    ];
    
    for (const faq of faqData) {
      try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/faq`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.supabaseKey}`,
            'apikey': config.supabaseKey
          },
          body: JSON.stringify(faq)
        });
        
        if (response.ok) {
          success(`FAQ "${faq.question.substring(0, 30)}..." insérée`);
        } else {
          const errorText = await response.text();
          if (errorText.includes('duplicate') || errorText.includes('already exists')) {
            info(`FAQ existe déjà`);
          } else {
            warning(`FAQ: ${errorText}`);
          }
        }
      } catch (err) {
        warning(`FAQ: ${err.message}`);
      }
    }
    
    // Utilisateurs admin
    const usersData = [
      { email: 'admin@phuonglongvodao.fr', name: 'Administrateur Principal', role: 'superadmin' },
      { email: 'club@phuonglongvodao.fr', name: 'Gestionnaire Club', role: 'admin' }
    ];
    
    for (const user of usersData) {
      try {
        const response = await fetch(`${config.supabaseUrl}/rest/v1/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.supabaseKey}`,
            'apikey': config.supabaseKey
          },
          body: JSON.stringify(user)
        });
        
        if (response.ok) {
          success(`Utilisateur "${user.name}" inséré`);
        } else {
          const errorText = await response.text();
          if (errorText.includes('duplicate') || errorText.includes('already exists')) {
            info(`Utilisateur "${user.name}" existe déjà`);
          } else {
            warning(`Utilisateur "${user.name}": ${errorText}`);
          }
        }
      } catch (err) {
        warning(`Utilisateur "${user.name}": ${err.message}`);
      }
    }
    
    return true;
    
  } catch (err) {
    error(`Erreur insertion données: ${err.message}`);
    return false;
  }
}

// Fonction principale
async function main() {
  try {
    const environment = getEnvironment();
    const config = getSupabaseConfig(environment);
    
    log(`🎯 Environnement: ${environment}`, 'cyan');
    log(`🔗 URL: ${config.supabaseUrl}`, 'cyan');
    log('');
    
    // Créer les tables
    const tablesCreated = await createTablesViaManagementAPI(config);
    
    if (tablesCreated) {
      // Insérer les données initiales
      await insertInitialData(config);
      
      header('🎉 Configuration terminée !');
      log('Vérifiez avec: npm run db:check', 'cyan');
    } else {
      error('Échec de la création des tables');
      log('Utilisez: npm run db:sql:dev pour obtenir les scripts SQL', 'yellow');
    }
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
