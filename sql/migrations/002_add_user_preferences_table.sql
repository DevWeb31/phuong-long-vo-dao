-- Migration 002: add user preferences table
-- Date: 2025-09-24
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
INSERT INTO public.migrations (migration_name) VALUES ('002_add_user_preferences_table') ON CONFLICT (migration_name) DO NOTHING;