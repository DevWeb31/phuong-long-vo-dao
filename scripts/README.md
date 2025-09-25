# Scripts de Migration

Ce dossier contient les scripts pour gérer les migrations de base de données.

## Scripts disponibles

### `migrate.js`
Script principal pour exécuter les migrations et seeders.

**Usage :**
```bash
node scripts/migrate.js <command> [environment]
```

**Commandes :**
- `migrate` - Exécuter les migrations
- `seed` - Exécuter les seeders
- `reset` - Réinitialiser la base de données (dev uniquement)

### `create-migration.js`
Script pour créer de nouvelles migrations facilement.

**Usage :**
```bash
node scripts/create-migration.js "<description>" [--seeder]
```

**Exemples :**
```bash
node scripts/create-migration.js "add user preferences table"
node scripts/create-migration.js "add user preferences table" --seeder
```

## Scripts npm disponibles

```bash
# Créer une migration
npm run db:create

# Migrations
npm run db:migrate:dev
npm run db:migrate:prod

# Seeders
npm run db:seed:dev
npm run db:seed:prod

# Utilitaires
npm run db:setup
npm run db:reset
npm run db:deploy
```

## Structure des migrations

Les migrations sont organisées dans `sql/migrations/` avec la convention :
```
{numero}_{description}.sql
```

Exemple : `001_initial_schema.sql`, `002_add_user_preferences.sql`

## Sécurité

⚠️ **Important** : Les scripts utilisent les variables d'environnement pour se connecter aux bases de données. Assurez-vous que votre fichier `.env.local` est configuré correctement.
