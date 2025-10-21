# 🔐 Variables d'Environnement Vercel - Phuong Long Vo Dao

## 📋 Variables Obligatoires

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://bgcmgnvevnogvbslqlhp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY21nbnZldm5vZ3Zic2xxbGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDI1NDUsImV4cCI6MjA3NjU3ODU0NX0._iEJriKFn9MOFpFgx_kPuhGOUotPZ-6NLFS3yVphuL0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY21nbnZldm5vZ3Zic2xxbGhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAwMjU0NSwiZXhwIjoyMDc2NTc4NTQ1fQ.JbE96cOWhHc5Bls_Gd52XOWzCsueqhCUGsDJh6FZxS4
```

### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=https://phuong-long-vo-dao.vercel.app
```

## 🔧 Variables Optionnelles

### Security
```bash
REVALIDATE_TOKEN=votre-token-secret-pour-revalidation
```

### Analytics (si ajouté plus tard)
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## 📝 Instructions de Configuration

### 1. Dans Vercel Dashboard
1. Aller dans **Project Settings** → **Environment Variables**
2. Ajouter chaque variable avec :
   - **Name** : Nom de la variable
   - **Value** : Valeur de la variable
   - **Environment** : Production, Preview, Development

### 2. Ordre de Priorité
1. **Production** : Variables pour le site en production
2. **Preview** : Variables pour les preview deployments
3. **Development** : Variables pour le développement local

### 3. Sécurité
- ✅ **Jamais** commiter les vraies valeurs
- ✅ **Utiliser** les placeholders dans le code
- ✅ **Rotater** les clés régulièrement
- ✅ **Monitorer** l'usage des clés

## 🚨 Configuration Supabase

### Authentication Settings
```
Site URL: https://phuong-long-vo-dao.vercel.app
Redirect URLs:
- https://phuong-long-vo-dao.vercel.app/fr/auth/callback
- https://phuong-long-vo-dao.vercel.app/en/auth/callback
```

### Database Settings
- ✅ **RLS activé** sur toutes les tables
- ✅ **Policies configurées** dans les migrations
- ✅ **Seeds exécutés** pour les données de démo

## 🔍 Vérification Post-Déploiement

### Tests à Effectuer
- [ ] **Authentification** : Connexion/déconnexion fonctionne
- [ ] **Base de données** : Requêtes réussies
- [ ] **API Routes** : Endpoints accessibles
- [ ] **Internationalisation** : FR/EN fonctionne
- [ ] **Thèmes** : Clair/sombre/système fonctionne
- [ ] **Animations** : ScrollAnimation fonctionne

### Monitoring
- **Vercel Analytics** : Activé automatiquement
- **Error Tracking** : Logs dans Vercel Dashboard
- **Performance** : Core Web Vitals monitorés

## 📊 Métriques de Succès

### Performance
- **Lighthouse Score** : > 90
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

### Sécurité
- **SSL Grade** : A+
- **Security Headers** : Configurés
- **HTTPS** : Forcé automatiquement

### Fonctionnalités
- **Uptime** : > 99.9%
- **Error Rate** : < 0.1%
- **Response Time** : < 200ms

Une fois ces variables configurées, le site sera prêt pour la production ! 🚀
