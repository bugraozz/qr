-- Add slug column to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
