# Scripts SQL

Ce dossier contient tous les scripts SQL pour la gestion de la base de données Supabase.

## Structure

```
sql/
├── README.md              # Ce fichier
├── supabase-schema.sql    # Schéma initial de la base de données
└── ...                    # Autres scripts SQL
```

## Scripts disponibles

- **supabase-schema.sql** : Script d'initialisation complet de la base de données
  - Création des tables
  - Index pour les performances
  - Données initiales (clubs, FAQ)
  - Configuration RLS

## Utilisation

1. Connectez-vous à votre instance Supabase
2. Allez dans l'éditeur SQL
3. Copiez-collez le contenu du script
4. Exécutez le script

## Environnements

Exécutez ces scripts sur :
- ✅ Base de développement
- ✅ Base de production

## Note importante

⚠️ **Ce dossier est exclu du versioning Git** pour éviter de commiter des scripts SQL contenant des informations sensibles.

## Sécurité

- Les scripts ne contiennent pas de données sensibles
- Ils sont conçus pour être réutilisables
- Aucune clé API ou mot de passe n'est inclus
