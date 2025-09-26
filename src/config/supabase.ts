import { createClient } from '@supabase/supabase-js';

// Configuration pour les environnements
const configs = {
  development: {
    url: import.meta.env.VITE_SUPABASE_URL_DEV || 'your_supabase_url_dev_here',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_DEV || 'your_anon_key_here',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_DEV || 'your_service_role_key_here',
  },
  production: {
    url: import.meta.env.VITE_SUPABASE_URL_PROD || 'your_supabase_url_prod_here',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_PROD || 'your_anon_key_here',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY_PROD || 'your_service_role_key_here',
  },
};

// Déterminer l'environnement actuel
const currentEnv = (import.meta.env.VITE_APP_ENV || 'development') as keyof typeof configs;
const config = configs[currentEnv];

// Créer le client Supabase
export const supabase = createClient(config.url, config.anonKey);

// Client avec service role (pour les opérations admin)
export const supabaseAdmin = createClient(config.url, config.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Export de la configuration actuelle
export const supabaseConfig = {
  env: currentEnv,
  url: config.url,
  isDevelopment: currentEnv === 'development',
  isProduction: currentEnv === 'production',
};

export default supabase;
