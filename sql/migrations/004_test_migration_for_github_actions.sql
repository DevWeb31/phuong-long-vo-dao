-- Migration 004: test migration for github actions
-- Date: 2025-09-25
-- Description: Test de l'automatisation GitHub Actions - ajout d'une colonne test

-- Ajouter une colonne test à la table users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS github_actions_test BOOLEAN DEFAULT false;

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
INSERT INTO public.migrations (migration_name) VALUES ('004_test_migration_for_github_actions') ON CONFLICT (migration_name) DO NOTHING;