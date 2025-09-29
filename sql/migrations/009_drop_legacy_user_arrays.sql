-- Migration: drop legacy array columns from public.users

ALTER TABLE public.users
  DROP COLUMN IF EXISTS permissions,
  DROP COLUMN IF EXISTS club_access;


