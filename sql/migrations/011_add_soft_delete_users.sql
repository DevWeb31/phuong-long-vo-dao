-- Migration: add soft delete support to users table

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT false;

-- Index pour améliorer les performances des requêtes filtrées
CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON public.users(is_deleted);

-- Mettre à jour la contrainte pour éviter les doublons d'email avec les utilisateurs actifs
-- (on garde les emails des utilisateurs supprimés)
