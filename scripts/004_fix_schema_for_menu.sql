CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure base tables exist
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  icon TEXT NOT NULL DEFAULT 'coffee',
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  badge TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bring categories columns to expected shape
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN;

ALTER TABLE public.categories ALTER COLUMN icon SET DEFAULT 'coffee';
ALTER TABLE public.categories ALTER COLUMN sort_order SET DEFAULT 0;
ALTER TABLE public.categories ALTER COLUMN is_active SET DEFAULT true;

UPDATE public.categories
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Avoid duplicate slugs before adding unique index
WITH ranked_slugs AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at, id) AS rn
  FROM public.categories
  WHERE slug IS NOT NULL AND slug <> ''
)
UPDATE public.categories c
SET slug = c.slug || '-' || substr(c.id::text, 1, 8)
FROM ranked_slugs r
WHERE c.id = r.id AND r.rn > 1;

UPDATE public.categories
SET is_active = true
WHERE is_active IS NULL;

ALTER TABLE public.categories ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.categories ALTER COLUMN is_active SET NOT NULL;

-- Bring menu_items columns to expected shape
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN;
ALTER TABLE public.menu_items ALTER COLUMN is_popular SET DEFAULT false;
ALTER TABLE public.menu_items ALTER COLUMN is_available SET DEFAULT true;
ALTER TABLE public.menu_items ALTER COLUMN sort_order SET DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'menu_items' AND column_name = 'is_active'
  ) THEN
    UPDATE public.menu_items
    SET is_available = COALESCE(is_available, is_active)
    WHERE is_available IS NULL;
  ELSE
    UPDATE public.menu_items
    SET is_available = true
    WHERE is_available IS NULL;
  END IF;
END $$;

ALTER TABLE public.menu_items ALTER COLUMN is_available SET NOT NULL;

-- Sync indexes
CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON public.menu_items(sort_order);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'categories_public_read'
  ) THEN
    CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'menu_items_public_read'
  ) THEN
    CREATE POLICY "menu_items_public_read" ON public.menu_items FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'categories_auth_insert'
  ) THEN
    CREATE POLICY "categories_auth_insert" ON public.categories
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'categories_auth_update'
  ) THEN
    CREATE POLICY "categories_auth_update" ON public.categories
      FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'categories_auth_delete'
  ) THEN
    CREATE POLICY "categories_auth_delete" ON public.categories
      FOR DELETE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'menu_items_auth_insert'
  ) THEN
    CREATE POLICY "menu_items_auth_insert" ON public.menu_items
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'menu_items_auth_update'
  ) THEN
    CREATE POLICY "menu_items_auth_update" ON public.menu_items
      FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'menu_items' AND policyname = 'menu_items_auth_delete'
  ) THEN
    CREATE POLICY "menu_items_auth_delete" ON public.menu_items
      FOR DELETE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;
