# 🚀 Guide de Déploiement Vercel - Phuong Long Vo Dao

## 📋 Prérequis

- ✅ Repository GitHub : [https://github.com/DevWeb31/phuong-long-vo-dao](https://github.com/DevWeb31/phuong-long-vo-dao)
- ✅ Compte Vercel : [https://vercel.com](https://vercel.com)
- ✅ Compte Supabase : [https://supabase.com](https://supabase.com)
- ✅ Variables d'environnement préparées

## 🎯 Étapes de Déploiement

### 1. Connexion GitHub → Vercel

1. **Aller sur Vercel** : [https://vercel.com](https://vercel.com)
2. **Se connecter** avec votre compte GitHub
3. **Cliquer sur "New Project"**
4. **Importer le repository** : `DevWeb31/phuong-long-vo-dao`
5. **Configurer le projet** :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next` (automatique)

### 2. Configuration des Variables d'Environnement

Dans Vercel Dashboard → Project Settings → Environment Variables :

```bash
# Variables Supabase (OBLIGATOIRES)
NEXT_PUBLIC_SUPABASE_URL=https://bgcmgnvevnogvbslqlhp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Variables Site (OBLIGATOIRES)
NEXT_PUBLIC_SITE_URL=https://phuong-long-vo-dao.vercel.app

# Variables Optionnelles
REVALIDATE_TOKEN=votre-token-secret-pour-revalidation
```

### 3. Configuration du Domaine

#### Option A : Domaine Vercel (Gratuit)
- **URL** : `https://phuong-long-vo-dao.vercel.app`
- **SSL** : Automatique
- **CDN** : Global (Edge Network)

#### Option B : Domaine Personnalisé
1. **Ajouter un domaine** dans Vercel Dashboard
2. **Configurer les DNS** :
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```
3. **Attendre la propagation** DNS (jusqu'à 24h)

### 4. Configuration Supabase

#### A. Base de Données
1. **Aller dans Supabase Dashboard**
2. **SQL Editor** → Exécuter les migrations :
   ```sql
   -- 1. Exécuter db/migrations/001_initial_schema.sql
   -- 2. Exécuter db/migrations/002_rls_policies.sql
   -- 3. Exécuter db/seeds/001_demo_data.sql
   ```

#### B. Authentification
1. **Authentication** → **Settings**
2. **Site URL** : `https://phuong-long-vo-dao.vercel.app`
3. **Redirect URLs** : 
   ```
   https://phuong-long-vo-dao.vercel.app/fr/auth/callback
   https://phuong-long-vo-dao.vercel.app/en/auth/callback
   ```

#### C. RLS Policies
- ✅ **Déjà configurées** dans les migrations SQL
- ✅ **Sécurité activée** sur toutes les tables

### 5. Déploiement

1. **Cliquer sur "Deploy"** dans Vercel
2. **Attendre le build** (2-3 minutes)
3. **Vérifier les logs** de déploiement
4. **Tester le site** sur l'URL générée

## 🔧 Configuration Avancée

### Performance
```json
// vercel.json (déjà configuré)
{
  "regions": ["cdg1"],  // Europe (Paris)
  "framework": "nextjs"
}
```

### Monitoring
- **Vercel Analytics** : Activé par défaut
- **Web Vitals** : Monitoring automatique
- **Error Tracking** : Logs dans Vercel Dashboard

### CI/CD
- ✅ **Déploiement automatique** sur push vers main
- ✅ **Preview deployments** sur pull requests
- ✅ **Rollback** facile en cas de problème

## 🧪 Tests Post-Déploiement

### 1. Tests Fonctionnels
- [ ] **Page d'accueil** : Animations et thèmes
- [ ] **Navigation** : Toutes les pages accessibles
- [ ] **Authentification** : Connexion/déconnexion
- [ ] **Dashboard** : Interface administrateur
- [ ] **Responsive** : Mobile et desktop

### 2. Tests Techniques
- [ ] **Performance** : Lighthouse score > 90
- [ ] **SEO** : Meta tags et sitemap
- [ ] **Accessibilité** : WCAG compliance
- [ ] **Sécurité** : HTTPS et headers

### 3. Tests Supabase
- [ ] **Base de données** : Connexion et requêtes
- [ ] **Authentification** : Magic link fonctionnel
- [ ] **RLS** : Permissions correctes
- [ ] **Storage** : Upload d'images (si utilisé)

## 🚨 Résolution de Problèmes

### Erreurs Courantes

#### Build Failed
```bash
# Vérifier les logs Vercel
# Problèmes possibles :
- Variables d'environnement manquantes
- Erreurs TypeScript
- Dépendances incompatibles
```

#### Authentification Ne Fonctionne Pas
```bash
# Vérifier dans Supabase :
- Site URL correcte
- Redirect URLs configurées
- Clés API correctes
```

#### Base de Données Vide
```bash
# Exécuter les migrations SQL :
- 001_initial_schema.sql
- 002_rls_policies.sql
- 001_demo_data.sql
```

## 📊 Monitoring et Maintenance

### Métriques Importantes
- **Uptime** : > 99.9%
- **Performance** : Core Web Vitals
- **Erreurs** : 0 erreur 500
- **Sécurité** : A+ sur SSL Labs

### Maintenance Régulière
- **Mises à jour** : Dépendances npm
- **Sécurité** : Audit des vulnérabilités
- **Performance** : Optimisation des images
- **Backup** : Sauvegarde Supabase

## 🎉 Succès !

Une fois déployé, votre site sera disponible sur :
- **URL Vercel** : `https://phuong-long-vo-dao.vercel.app`
- **Domaine personnalisé** : `https://votre-domaine.com`

Le site Phuong Long Vo Dao sera alors **vivant et accessible** au monde entier ! 🥋✨
