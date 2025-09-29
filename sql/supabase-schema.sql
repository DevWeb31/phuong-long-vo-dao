-- Script SQL pour initialiser les tables Supabase
-- À exécuter dans l'interface Supabase SQL Editor

-- Table pour gérer le mode maintenance
CREATE TABLE IF NOT EXISTS public.maintenance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_active BOOLEAN NOT NULL DEFAULT false,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Table pour les utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'club_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les clubs
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    department TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    member_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Table de liaison accès des utilisateurs aux clubs
CREATE TABLE IF NOT EXISTS public.user_club_access (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_user_club_access_user_id ON public.user_club_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_club_access_club_id ON public.user_club_access(club_id);

-- Table pour les adhérents/membres
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    membership_start_date DATE DEFAULT CURRENT_DATE,
    membership_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les événements
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les communications (newsletters, etc.)
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'newsletter' CHECK (type IN ('newsletter', 'announcement', 'event')),
    sent_at TIMESTAMP WITH TIME ZONE,
    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'members', 'clubs')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les médias (images, documents)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'events', 'members', 'clubs')),
    club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les FAQ
CREATE TABLE IF NOT EXISTS public.faq (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions (normalisées)
CREATE TABLE IF NOT EXISTS public.permissions (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_permissions (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    permission_id TEXT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission_id ON public.user_permissions(permission_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_maintenance_created_at ON public.maintenance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_club_id ON public.members(club_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_media_category ON public.media(category);
CREATE INDEX IF NOT EXISTS idx_faq_category ON public.faq(category);

-- RLS (Row Level Security) - À configurer selon vos besoins
-- Pour l'instant, on désactive RLS pour simplifier
ALTER TABLE public.maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_club_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions DISABLE ROW LEVEL SECURITY;

-- Données initiales
INSERT INTO public.clubs (name, city, department, member_count) VALUES
('Club Montaigut sur Save', 'Montaigut sur Save', '31', 45),
('Club Trégeux', 'Trégeux', '22', 32)
ON CONFLICT DO NOTHING;

INSERT INTO public.faq (question, answer, category, order_index) VALUES
('Quels sont les horaires des cours ?', 'Les cours ont lieu du lundi au vendredi de 18h à 20h.', 'general', 1),
('Comment s''inscrire ?', 'Vous pouvez vous inscrire directement au club ou nous contacter par téléphone.', 'inscription', 2),
('Quel équipement faut-il ?', 'Un kimono blanc et une ceinture blanche pour débuter.', 'equipement', 3)
ON CONFLICT DO NOTHING;

-- Permissions seed
INSERT INTO public.permissions (id, label) VALUES
('members', 'Gestion des adhérents'),
('clubs', 'Gestion des clubs'),
('content', 'Gestion des contenus'),
('events', 'Gestion des événements'),
('communications', 'Communications'),
('media', 'Gestion des médias'),
('faq', 'Gestion des FAQ'),
('users', 'Gestion des utilisateurs'),
('reports', 'Rapports'),
('settings', 'Paramètres'),
('all', 'Tous les droits')
ON CONFLICT (id) DO NOTHING;

-- Message de confirmation
SELECT 'Tables créées avec succès !' as message;
