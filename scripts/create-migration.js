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

// Fonction pour obtenir le prochain numéro de migration
function getNextMigrationNumber() {
  const migrationsDir = path.join(__dirname, '..', 'sql', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    return '001';
  }
  
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (files.length === 0) {
    return '001';
  }
  
  const lastFile = files[files.length - 1];
  const lastNumber = parseInt(lastFile.split('_')[0]);
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
  
  return nextNumber;
}

// Fonction pour créer le template de migration
function createMigrationTemplate(number, description) {
  const today = new Date().toISOString().split('T')[0];
  
  return `-- Migration ${number}: ${description}
-- Date: ${today}
-- Description: [Décrivez ici ce que fait cette migration]

-- [Ajoutez ici vos requêtes SQL]

-- Exemple de création de table:
-- CREATE TABLE IF NOT EXISTS public.example_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     name TEXT NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Exemple d'ajout d'index:
-- CREATE INDEX IF NOT EXISTS idx_example_table_name ON public.example_table(name);

-- Marquer cette migration comme exécutée
INSERT INTO public.migrations (migration_name) VALUES ('${number}_${description.toLowerCase().replace(/[^a-z0-9]/g, '_')}') ON CONFLICT (migration_name) DO NOTHING;`;
}

// Fonction pour créer le template de seeder
function createSeederTemplate(number, description) {
  const today = new Date().toISOString().split('T')[0];
  
  return `-- Seeder ${number}: ${description}
-- Date: ${today}
-- Description: [Décrivez ici les données que ce seeder insère]

-- [Ajoutez ici vos insertions de données]

-- Exemple d'insertion:
-- INSERT INTO public.example_table (name) VALUES
-- ('Exemple 1'),
-- ('Exemple 2')
-- ON CONFLICT DO NOTHING;`;
}

// Fonction principale
function createMigration() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('🔧 Créateur de migration Phuong Long Vo Dao', 'bright');
    log('');
    log('Usage:', 'bright');
    log('  node scripts/create-migration.js "<description>" [--seeder]');
    log('');
    log('Exemples:', 'bright');
    log('  node scripts/create-migration.js "add user preferences table"');
    log('  node scripts/create-migration.js "add user preferences table" --seeder');
    log('  node scripts/create-migration.js "update events table structure"');
    log('');
    process.exit(1);
  }
  
  const description = args[0];
  const createSeeder = args.includes('--seeder');
  
  // Validation de la description
  if (!description || description.trim().length === 0) {
    error('La description de la migration est requise');
    process.exit(1);
  }
  
  // Nettoyer la description pour le nom de fichier
  const cleanDescription = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
  
  if (cleanDescription.length === 0) {
    error('Description invalide pour le nom de fichier');
    process.exit(1);
  }
  
  // Obtenir le prochain numéro
  const number = getNextMigrationNumber();
  const fileName = `${number}_${cleanDescription}.sql`;
  
  // Créer les dossiers si nécessaire
  const migrationsDir = path.join(__dirname, '..', 'sql', 'migrations');
  const seedersDir = path.join(__dirname, '..', 'sql', 'seeders');
  
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  if (createSeeder && !fs.existsSync(seedersDir)) {
    fs.mkdirSync(seedersDir, { recursive: true });
  }
  
  // Créer le fichier de migration
  const migrationPath = path.join(migrationsDir, fileName);
  const migrationContent = createMigrationTemplate(number, description);
  
  try {
    fs.writeFileSync(migrationPath, migrationContent);
    success(`Migration créée: ${fileName}`);
    info(`Chemin: ${migrationPath}`);
  } catch (err) {
    error(`Erreur lors de la création de la migration: ${err.message}`);
    process.exit(1);
  }
  
  // Créer le seeder si demandé
  if (createSeeder) {
    const seederFileName = `${number}_${cleanDescription}.sql`;
    const seederPath = path.join(seedersDir, seederFileName);
    const seederContent = createSeederTemplate(number, description);
    
    try {
      fs.writeFileSync(seederPath, seederContent);
      success(`Seeder créé: ${seederFileName}`);
      info(`Chemin: ${seederPath}`);
    } catch (err) {
      error(`Erreur lors de la création du seeder: ${err.message}`);
      process.exit(1);
    }
  }
  
  // Instructions de suivi
  log('');
  log('📝 Prochaines étapes:', 'bright');
  log('1. Éditez le fichier de migration pour ajouter vos requêtes SQL');
  if (createSeeder) {
    log('2. Éditez le fichier de seeder pour ajouter vos données');
    log('3. Testez localement: npm run db:setup');
  } else {
    log('2. Testez localement: npm run db:migrate:dev');
  }
  log('3. Commitez vos changements');
  log('4. Poussez sur votre branche (migration automatique)');
}

// Exécuter le script
createMigration();
