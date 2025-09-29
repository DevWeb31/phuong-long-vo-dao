-- Migration: create user_club_access relation table

CREATE TABLE IF NOT EXISTS public.user_club_access (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, club_id)
);

-- Optional helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_club_access_user_id ON public.user_club_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_club_access_club_id ON public.user_club_access(club_id);

-- RLS policy disabled for now (aligns with existing tables setting)
ALTER TABLE public.user_club_access DISABLE ROW LEVEL SECURITY;


