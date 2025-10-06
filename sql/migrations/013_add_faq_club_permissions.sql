-- Migration pour ajouter les permissions par club aux FAQ
-- Date: 2024-01-XX
-- Description: Ajoute les champs club_id et created_by à la table faq pour gérer les permissions

-- Ajouter les nouveaux champs à la table FAQ
ALTER TABLE public.faq 
ADD COLUMN IF NOT EXISTS club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Ajouter les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_faq_club_id ON public.faq(club_id);
CREATE INDEX IF NOT EXISTS idx_faq_created_by ON public.faq(created_by);

-- Mettre à jour les FAQ existantes pour les marquer comme générales (club_id = NULL)
UPDATE public.faq 
SET club_id = NULL, created_by = (SELECT id FROM public.users WHERE role = 'superadmin' LIMIT 1)
WHERE club_id IS NULL;

-- Ajouter un commentaire pour documenter la structure
COMMENT ON COLUMN public.faq.club_id IS 'ID du club propriétaire de la FAQ. NULL pour les FAQ générales.';
COMMENT ON COLUMN public.faq.created_by IS 'ID de l''utilisateur qui a créé la FAQ.';

-- Message de confirmation
SELECT 'Migration 013: Permissions par club ajoutées aux FAQ' as message;
