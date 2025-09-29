-- Migration: add user management fields to public.users
-- Adds: is_active (boolean), permissions (text[]), club_access (text[])

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS permissions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS club_access TEXT[] NOT NULL DEFAULT '{}';

-- Update updated_at trigger if exists or rely on application to set updated_at


