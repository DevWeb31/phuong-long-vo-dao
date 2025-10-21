# Phuong Long Vo Dao - Site Web Multi-Clubs

Site web professionnel Next.js pour la fédération Phuong Long Vo Dao, regroupant 5 clubs d'arts martiaux vietnamiens en France.

## 🎯 Fonctionnalités

- ✅ **Site public multi-clubs** avec présentation, cours, instructeurs, événements
- ✅ **Système d'authentification** avec magic link (Supabase Auth)
- ✅ **Dashboard administrateur** avec gestion RBAC (superadmin, admin_club, coach, membre)
- ✅ **Intégration Facebook** (Group Plugin & Page Plugin)
- ✅ **i18n** avec next-intl (FR prioritaire, EN disponible)
- ✅ **SEO optimisé** (Metadata API, sitemap, robots.txt, OpenGraph)
- ✅ **Design system** Tailwind CSS avec dark mode
- ✅ **Base de données sécurisée** Supabase avec RLS (Row Level Security)

## 📦 Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **i18n**: next-intl
- **Deployment**: Vercel
- **DNS**: Cloudflare

## 📁 Organisation du Projet

### ✅ Fichiers Commités
- `/src/` - Code source principal (composants, pages, logique)
- `/public/` - Assets statiques (images, icônes)
- `/messages/` - Fichiers de traduction (FR/EN)
- Configuration - `package.json`, `tsconfig.json`, `next.config.ts`
- Templates - `.env.local.example` pour la configuration

### 🚫 Fichiers Non Commités (voir `IGNORED_FOLDERS.md`)
- `/docs/` - Documentation de développement
- `/db/` - Scripts SQL (migrations, seeds)
- `/scripts/` - Scripts utilitaires de développement
- `.env.local` - Variables d'environnement locales

## 🚀 Installation & Développement Local

### Prérequis

- Node.js 20+ et npm
- Compte Supabase (gratuit)
- Compte Vercel (optionnel pour déploiement)

### Installation

```bash
# Cloner le repository
git clone <votre-repo>
cd phuong-long-vo-dao

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local

# Configurer les variables d'environnement (voir section suivante)
# Éditer .env.local avec vos valeurs Supabase
```

### Configuration Supabase

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)

2. **Récupérer les clés API**:
   - URL du projet: `Settings > API > Project URL`
   - Anon key: `Settings > API > anon public`
   - Service role key: `Settings > API > service_role` (⚠️ Secret)

3. **Configurer `.env.local`**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Exécuter les migrations SQL**:
   - Aller dans `SQL Editor` de Supabase
   - Exécuter dans l'ordre:
     1. `db/migrations/001_initial_schema.sql`
     2. `db/migrations/002_rls_policies.sql`
     3. `db/seeds/001_demo_data.sql` (données de démo)

5. **Configurer l'authentification**:
   - `Authentication > Providers > Email`
   - Activer "Enable Email Provider"
   - Configurer "Email Templates" si nécessaire
   - Optionnel: Activer OAuth (Google, Facebook, etc.)

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000/fr](http://localhost:3000/fr)

## 📁 Structure du Projet

```
phuong-long-vo-dao/
├── src/
│   ├── app/                      # App Router Next.js
│   │   ├── [locale]/            # Routes i18n
│   │   │   ├── (marketing)/     # Pages publiques
│   │   │   │   ├── page.tsx     # Accueil
│   │   │   │   ├── clubs/       # Liste et fiches clubs
│   │   │   │   ├── events/      # Événements
│   │   │   │   └── contact/     # Contact
│   │   │   ├── (auth)/          # Authentification
│   │   │   │   └── sign-in/
│   │   │   └── (dashboard)/     # Admin protégé
│   │   │       └── dashboard/
│   │   ├── api/                 # Route Handlers
│   │   │   ├── health/
│   │   │   └── revalidate/
│   │   ├── layout.tsx           # Root layout
│   │   ├── sitemap.ts           # Sitemap SEO
│   │   └── robots.ts            # Robots.txt
│   ├── components/
│   │   ├── ui/                  # Composants de base
│   │   ├── marketing/           # Composants publics
│   │   └── shared/              # Composants partagés
│   ├── lib/
│   │   ├── supabase/            # Clients Supabase
│   │   ├── auth/                # Helpers d'authentification
│   │   └── utils.ts             # Utilitaires
│   ├── types/                   # Types TypeScript
│   ├── i18n/                    # Configuration i18n
│   └── middleware.ts            # Middleware Next.js
├── db/
│   ├── migrations/              # Migrations SQL
│   └── seeds/                   # Données de seed
├── messages/                    # Fichiers de traduction
│   ├── fr.json
│   └── en.json
├── public/                      # Assets statiques
└── scripts/                     # Scripts utilitaires
```

## 🔒 Sécurité & RLS (Row Level Security)

Le projet utilise les Row Level Security policies de Supabase pour sécuriser l'accès aux données.

### Rôles

- **superadmin**: Accès complet à tout
- **admin_club**: Administration d'un club spécifique
- **coach**: Gestion des cours et événements de son club
- **membre**: Lecture seule, inscriptions aux événements

### Fonctions Helper

```sql
-- Vérifier si l'utilisateur est membre d'une organisation
is_member_of_org(org_id, user_id)

-- Vérifier si l'utilisateur a un rôle spécifique
has_role_in_org(org_id, user_id, roles[])

-- Vérifier si l'utilisateur est superadmin
is_superadmin(user_id)
```

### Exemples de Policies

```sql
-- Lecture publique des organisations actives
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations FOR SELECT
  USING (is_active = true);

-- Modification réservée aux admins
CREATE POLICY "Organizations can be updated by admins"
  ON organizations FOR UPDATE
  USING (
    is_superadmin(auth.uid()) OR
    has_role_in_org(id, auth.uid(), ARRAY['admin_club'])
  );
```

## 🌐 Internationalisation (i18n)

Le site utilise **next-intl** avec la structure `[locale]`.

### Locales supportées

- `fr` (Français - par défaut)
- `en` (Anglais)

### Structure des messages

```json
{
  "common": { ... },
  "marketing": {
    "hero": { ... },
    "clubs": { ... },
    "events": { ... }
  },
  "auth": { ... },
  "dashboard": { ... }
}
```

### Utilisation

```tsx
// Server Component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('marketing.hero');

// Client Component
import { useTranslations } from 'next-intl';
const t = useTranslations('marketing.hero');

// Affichage
<h1>{t('title')}</h1>
```

## 🎨 Design System

### Palette de couleurs

```css
/* Couleurs primaires - Rouge/Orange martial */
--primary: 0 72% 51%;
--primary-foreground: 0 0% 98%;

/* Couleurs secondaires - Or */
--secondary: 45 93% 47%;

/* Couleurs accent - Bleu nuit */
--accent: 220 70% 20%;
```

### Composants UI

- `Button` (variants: default, primary, secondary, outline, ghost, destructive)
- `Card` (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `Input`, `Textarea`, `Label`
- `Badge`

## 📱 Intégration Facebook

Le site intègre les plugins Facebook officiels via `FacebookEmbed`:

```tsx
// Group Plugin
<FacebookEmbed 
  type="group" 
  url="https://www.facebook.com/groups/..." 
/>

// Page Plugin
<FacebookEmbed 
  type="page" 
  url="https://www.facebook.com/..." 
/>
```

**Limitations**:
- Nécessite le chargement du SDK Facebook
- Peut être bloqué par les bloqueurs de publicités
- Fallback vers lien direct si échec

## 🚀 Déploiement

### Déploiement Vercel (Recommandé)

1. **Connecter le repository GitHub** à Vercel

2. **Configurer les variables d'environnement**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (auto-détecté par Vercel)

3. **Déployer**:
```bash
# Via CLI Vercel
vercel --prod

# Ou push sur main (auto-deploy)
git push origin main
```

### Configuration DNS Cloudflare

1. **Transférer les nameservers vers Cloudflare** (depuis OVH)

2. **Ajouter les records DNS**:
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: ✅ Proxied

Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: ✅ Proxied
```

3. **Sous-domaines par club** (optionnel):
```
paris.votredomaine.fr -> CNAME -> cname.vercel-dns.com
lyon.votredomaine.fr -> CNAME -> cname.vercel-dns.com
```

4. **Configurer SSL/TLS**:
   - Mode: Full (strict)
   - Always Use HTTPS: ✅
   - Auto HTTPS Rewrites: ✅

5. **Vérifier dans Vercel**:
   - `Settings > Domains`
   - Ajouter votre domaine
   - Suivre les instructions de vérification

## 🧪 Scripts npm

```bash
# Développement
npm run dev              # Lancer le serveur de développement

# Build & Production
npm run build            # Compiler pour la production
npm start                # Lancer le serveur de production

# Qualité du code
npm run lint             # ESLint
npm run typecheck        # TypeScript check
npm run format           # Prettier

# Base de données
npm run db:types         # Générer les types TypeScript depuis Supabase
```

## 📊 SEO

### Metadata API

Chaque page définit ses métadonnées:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mon titre",
    description: "Ma description",
    openGraph: { ... },
  };
}
```

### Sitemap & Robots

- **Sitemap**: `/sitemap.xml` (généré dynamiquement)
- **Robots**: `/robots.txt` (généré dynamiquement)

### Performance

- ✅ Server Components par défaut
- ✅ Images optimisées avec `next/image`
- ✅ Caching et revalidation appropriés
- ✅ Lazy loading des composants lourds

## 🔧 Maintenance

### Mettre à jour les types Supabase

Après modification du schéma SQL:

```bash
npm run db:types
```

### Revalider le cache

```bash
curl -X POST https://votresite.com/api/revalidate \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"path": "/clubs"}'
```

### Logs & Monitoring

- **Vercel Analytics**: Activé par défaut
- **Supabase Logs**: Dashboard > Logs
- **Error Tracking**: Configurer Sentry (optionnel)

## 📝 Checklist de Sécurité

- [x] RLS activé sur toutes les tables
- [x] Policies définies par rôle
- [x] Service role key en variable d'environnement (jamais côté client)
- [x] Middleware de protection des routes admin
- [x] Validation des inputs (Zod recommandé pour les forms)
- [x] HTTPS forcé (via Cloudflare)
- [x] CSP headers (à configurer si nécessaire)

## 🆘 Support & Contact

Pour toute question technique:

- **Email**: dev@votredomaine.fr
- **Documentation Supabase**: https://supabase.com/docs
- **Documentation Next.js**: https://nextjs.org/docs

## 📄 Licence

Propriétaire - Phuong Long Vo Dao © 2025

---

**Note**: Ce projet est configuré et prêt pour la production. Assurez-vous de:
1. Exécuter les migrations SQL
2. Configurer les variables d'environnement
3. Tester l'authentification
4. Vérifier les permissions RLS
5. Configurer le DNS avant le lancement
