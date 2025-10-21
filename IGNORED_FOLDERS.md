# 📁 Dossiers Non Commités

## 🚫 Pourquoi ces dossiers ne sont pas dans Git ?

### `/docs/` - Documentation de Développement
- **Contenu** : Guides de développement, résolution de problèmes, livrables
- **Raison** : Documentation interne qui n'est pas nécessaire en production
- **Alternative** : Documentation publique dans le README principal

### `/db/` - Scripts de Base de Données  
- **Contenu** : Migrations SQL, seeds, scripts de base de données
- **Raison** : Scripts de développement et données de test
- **Alternative** : Migrations gérées directement dans Supabase

### `/scripts/` - Scripts de Développement
- **Contenu** : Scripts utilitaires pour le développement local
- **Raison** : Outils de développement qui ne sont pas nécessaires en production
- **Alternative** : Scripts npm dans `package.json`

## ✅ Ce qui EST commité

- **Code source** : `/src/` avec tous les composants et logique
- **Configuration** : `package.json`, `tsconfig.json`, `next.config.ts`
- **Assets publics** : `/public/` pour les images et fichiers statiques
- **Internationalisation** : `/messages/` pour les traductions
- **Templates** : `.env.local.example` pour la configuration

## 🔧 Comment utiliser les dossiers ignorés

### Documentation
```bash
# Les fichiers docs/ sont disponibles localement pour le développement
ls docs/
cat docs/GETTING_STARTED.md
```

### Base de Données
```bash
# Les scripts SQL sont dans db/ pour référence locale
ls db/migrations/
cat db/seeds/001_demo_data.sql
```

### Scripts
```bash
# Les scripts utilitaires sont dans scripts/
node scripts/index.js
```

## 📋 Checklist de Déploiement

Avant de déployer en production, assurez-vous d'avoir :

- [ ] **Base de données** : Migrations exécutées dans Supabase
- [ ] **Variables d'environnement** : `.env.local` configuré avec les vraies clés
- [ ] **Documentation** : README principal à jour
- [ ] **Assets** : Images et fichiers dans `/public/`

Cette approche garde le repository Git propre et focalisé sur le code de production ! 🎯
