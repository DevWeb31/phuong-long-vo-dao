-- Migration: Ajout du champ season aux membres
-- Description: Remplace membership_start_date et membership_end_date par un système de saisons (ex: "2025-2026")

-- Ajouter le champ season
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS season TEXT;

-- Créer un index sur season pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_members_season ON public.members(season);

-- Migrer les données existantes (si membership_start_date existe, créer une saison basée sur l'année)
UPDATE public.members
SET season = CASE 
    WHEN membership_start_date IS NOT NULL THEN
        EXTRACT(YEAR FROM membership_start_date)::TEXT || '-' || (EXTRACT(YEAR FROM membership_start_date) + 1)::TEXT
    ELSE
        NULL
END
WHERE season IS NULL;

-- Note: On garde membership_start_date et membership_end_date pour compatibilité descendante
-- Ils peuvent être supprimés plus tard si nécessaire
-- ALTER TABLE public.members DROP COLUMN membership_start_date;
-- ALTER TABLE public.members DROP COLUMN membership_end_date;

