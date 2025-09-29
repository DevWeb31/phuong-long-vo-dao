-- Migration 012: Ajouter la colonne phone à la table users
-- Date: 2025-01-27
-- Description: Ajoute une colonne phone optionnelle pour stocker les numéros de téléphone des utilisateurs

-- Ajouter la colonne phone à la table users
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20) DEFAULT NULL;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN users.phone IS 'Numéro de téléphone de l''utilisateur au format français (optionnel)';

-- Créer un index pour optimiser les recherches par téléphone (optionnel)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
