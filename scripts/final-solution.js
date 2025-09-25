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

// Fonction pour ouvrir automatiquement le navigateur
async function openBrowser(url) {
  const { exec } = await import('child_process');
  const platform = process.platform;
  
  let command;
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  
  exec.default(command, (error) => {
    if (error) {
      info(`Ouvrez manuellement: ${url}`);
    }
  });
}

// Fonction pour générer un script SQL optimisé
function generateOptimizedSQL() {
  return `-- ========================================
-- SCRIPT SQL OPTIMISÉ - PHUONG LONG VO DAO
-- ========================================
-- Ce script crée toutes les tables en une seule fois
-- Copiez-collez tout ce contenu dans l'éditeur SQL de Supabase

-- Table pour suivre les migrations (créée en premier)
CREATE TABLE IF NOT EXISTS public.migrations (
    id SERIAL PRIMARY KEY,
    migration_name TEXT UNIQUE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    executed_by TEXT DEFAULT 'system'
);

-- Table pour gérer le mode maintenance
CREATE TABLE IF NOT EXISTS public.maintenance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT false,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Table pour les utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'club_admin')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les clubs
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

-- Table pour les adhérents/membres
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

-- Table pour les événements
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

-- Table pour les communications (newsletters, etc.)
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

-- Table pour les médias (images, documents)
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

-- Table pour les FAQ
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

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_maintenance_created_at ON public.maintenance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_club_id ON public.members(club_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_media_category ON public.media(category);
CREATE INDEX IF NOT EXISTS idx_faq_category ON public.faq(category);

-- Désactiver RLS (Row Level Security) pour simplifier
ALTER TABLE public.maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq DISABLE ROW LEVEL SECURITY;

-- Marquer cette migration comme exécutée
INSERT INTO public.migrations (migration_name) VALUES ('001_initial_schema') ON CONFLICT (migration_name) DO NOTHING;

-- Message de confirmation
SELECT 'Tables créées avec succès !' as message;`;
}

// Fonction pour générer le script des données initiales
function generateInitialDataSQL() {
  return `-- ========================================
-- DONNÉES INITIALES - PHUONG LONG VO DAO
-- ========================================
-- Copiez-collez ce contenu dans une nouvelle requête SQL

-- Données initiales pour les clubs
INSERT INTO public.clubs (name, city, department, member_count) VALUES
('Club Montaigut sur Save', 'Montaigut sur Save', '31', 45),
('Club Trégeux', 'Trégeux', '22', 32)
ON CONFLICT DO NOTHING;

-- Données initiales pour les FAQ
INSERT INTO public.faq (question, answer, category, order_index) VALUES
('Quels sont les horaires des cours ?', 'Les cours ont lieu du lundi au vendredi de 18h à 20h.', 'general', 1),
('Comment s''inscrire ?', 'Vous pouvez vous inscrire directement au club ou nous contacter par téléphone.', 'inscription', 2),
('Quel équipement faut-il ?', 'Un kimono blanc et une ceinture blanche pour débuter.', 'equipement', 3),
('Quels sont les tarifs ?', 'Les tarifs varient selon l''âge et le type d''abonnement. Contactez-nous pour plus d''informations.', 'tarifs', 4),
('Y a-t-il des cours pour les enfants ?', 'Oui, nous proposons des cours adaptés pour tous les âges à partir de 5 ans.', 'enfants', 5)
ON CONFLICT DO NOTHING;

-- Données initiales pour les utilisateurs admin
INSERT INTO public.users (email, name, role) VALUES
('admin@phuonglongvodao.fr', 'Administrateur Principal', 'superadmin'),
('club@phuonglongvodao.fr', 'Gestionnaire Club', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Message de confirmation
SELECT 'Données initiales insérées avec succès !' as message;`;
}

// Fonction principale
async function main() {
  try {
    const environment = getEnvironment();
    const config = getSupabaseConfig(environment);
    
    header(`Solution finale pour ${environment}`);
    
    log(`🎯 Environnement: ${environment}`, 'cyan');
    log(`🔗 URL: ${config.supabaseUrl}`, 'cyan');
    log('');
    
    // Générer les scripts SQL
    const tablesSQL = generateOptimizedSQL();
    const dataSQL = generateInitialDataSQL();
    
    // Sauvegarder les fichiers
    const outputDir = path.join(__dirname, '..', 'sql', 'final');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, `001_tables_${environment}.sql`), tablesSQL);
    fs.writeFileSync(path.join(outputDir, `002_data_${environment}.sql`), dataSQL);
    
    success('📁 Scripts SQL générés et sauvegardés');
    log(`   📄 sql/final/001_tables_${environment}.sql`, 'cyan');
    log(`   📄 sql/final/002_data_${environment}.sql`, 'cyan');
    log('');
    
    // Ouvrir automatiquement le navigateur
    info('🌐 Ouverture de l\'interface Supabase...');
    openBrowser(config.supabaseUrl);
    
    // Instructions détaillées
    header('📋 Instructions étape par étape :');
    
    log('1️⃣  Interface Supabase ouverte automatiquement', 'green');
    log('   Si le navigateur ne s\'ouvre pas:', 'yellow');
    log(`   👉 ${config.supabaseUrl}`, 'yellow');
    log('');
    
    log('2️⃣  Dans l\'interface Supabase :', 'green');
    log('   • Cliquez sur "SQL Editor" dans le menu de gauche', 'yellow');
    log('   • Cliquez sur "New query"', 'yellow');
    log('');
    
    log('3️⃣  Copiez-collez le premier script :', 'green');
    log('   • Ouvrez le fichier sql/final/001_tables_[environment].sql', 'yellow');
    log('   • Copiez tout le contenu', 'yellow');
    log('   • Collez-le dans l\'éditeur SQL', 'yellow');
    log('   • Cliquez sur "Run"', 'yellow');
    log('');
    
    log('4️⃣  Copiez-collez le deuxième script :', 'green');
    log('   • Créez une nouvelle requête', 'yellow');
    log('   • Ouvrez le fichier sql/final/002_data_[environment].sql', 'yellow');
    log('   • Copiez tout le contenu', 'yellow');
    log('   • Collez-le dans l\'éditeur SQL', 'yellow');
    log('   • Cliquez sur "Run"', 'yellow');
    log('');
    
    log('5️⃣  Vérification :', 'green');
    log('   • Allez dans "Table Editor"', 'yellow');
    log('   • Vous devriez voir toutes les tables', 'yellow');
    log('   • Lancez: npm run db:check', 'yellow');
    log('');
    
    // Afficher les scripts directement
    header('📄 SCRIPT 1 - Création des tables :');
    console.log(colors.yellow + tablesSQL + colors.reset);
    
    log('\n' + '='.repeat(80), 'cyan');
    
    header('📄 SCRIPT 2 - Données initiales :');
    console.log(colors.yellow + dataSQL + colors.reset);
    
    header('🎉 Prêt à exécuter !');
    log('Copiez-collez les scripts ci-dessus dans Supabase', 'cyan');
    log('Ou utilisez les fichiers sauvegardés dans sql/final/', 'cyan');
    
  } catch (err) {
    error(`Erreur: ${err.message}`);
    process.exit(1);
  }
}

// Exécuter le script
main();
