-- Migration: create permissions and user_permissions tables

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

ALTER TABLE public.user_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;

-- Seed initial permissions matching UI labels
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


