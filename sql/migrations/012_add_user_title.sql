-- Ajouter la colonne 'titre' à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_title VARCHAR(100) DEFAULT NULL;

-- Commentaire pour la colonne
COMMENT ON COLUMN users.user_title IS 'Titre de l''utilisateur (ex: Trésorier, Professeur, etc.)';

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_user_title ON users(user_title);

-- Notification pour recharger le schéma
NOTIFY pgrst, 'reload schema';
