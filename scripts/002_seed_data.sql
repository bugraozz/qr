-- Compatibility patch for older schemas
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

UPDATE public.categories
SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

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

UPDATE public.menu_items
SET is_available = true
WHERE is_available IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_categories_slug ON public.categories(slug);

-- Seed categories
INSERT INTO public.categories (id, name, slug, icon, image, sort_order) VALUES
  (gen_random_uuid(), 'Sicak Icecekler', 'sicak-icecekler', 'coffee', '/images/hot-drinks.jpg', 0),
  (gen_random_uuid(), 'Soguk Icecekler', 'soguk-icecekler', 'glass-water', '/images/cold-drinks.jpg', 1),
  (gen_random_uuid(), 'Kahvalti', 'kahvalti', 'egg', '/images/breakfast.jpg', 2),
  (gen_random_uuid(), 'Atistirmaliklar', 'atistirmaliklar', 'sandwich', '/images/snacks.jpg', 3),
  (gen_random_uuid(), 'Tatlilar', 'tatlilar', 'cake', '/images/desserts.jpg', 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order;

-- Seed menu items for Sicak Icecekler
INSERT INTO public.menu_items (name, description, price, badge, is_popular, sort_order, category_id)
SELECT val.name, val.description, val.price, val.badge, val.is_popular, val.sort_order, c.id
FROM (VALUES
  ('Turk Kahvesi', 'Geleneksel yontemle pisirilmis, ince cekilmis ozel harman', 65, NULL, true, 0),
  ('Espresso', 'Tek shot, yogun ve kremali espresso', 55, NULL, false, 1),
  ('Double Espresso', 'Cift shot espresso, ekstra yogun aroma', 70, NULL, false, 2),
  ('Americano', 'Espresso ve sicak su, yumusak tat', 65, NULL, false, 3),
  ('Caffe Latte', 'Espresso, buharla isitilmis sut ve ince sut kopugu', 80, NULL, true, 4),
  ('Cappuccino', 'Espresso, sut ve yogun sut kopugu', 80, NULL, false, 5),
  ('Flat White', 'Cift shot espresso ve kadifemsi sut', 85, NULL, false, 6),
  ('Mocha', 'Espresso, cikolata sosu ve buharlanmis sut', 90, NULL, false, 7),
  ('Chai Latte', 'Baharatli cay konsantresi ve kremali sut', 75, NULL, false, 8),
  ('Sicak Cikolata', 'Belcika cikolatasi ile hazirlanan ozel recete', 85, 'Ozel', false, 9),
  ('Demlik Cay', 'Rizeden ozel secilmis yapraklar, iki kisilik demlik', 40, NULL, false, 10),
  ('Bitki Cayi', 'Ihlamur, adacayi, papatya veya nane-limon', 50, NULL, false, 11)
) AS val(name, description, price, badge, is_popular, sort_order)
CROSS JOIN public.categories c
WHERE c.slug = 'sicak-icecekler'
  AND NOT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.category_id = c.id
      AND mi.name = val.name
  );

-- Seed menu items for Soguk Icecekler
INSERT INTO public.menu_items (name, description, price, badge, is_popular, sort_order, category_id)
SELECT val.name, val.description, val.price, val.badge, val.is_popular, val.sort_order, c.id
FROM (VALUES
  ('Iced Latte', 'Soguk sut, buz ve espresso shot', 90, NULL, true, 0),
  ('Iced Americano', 'Buzlu su ve espresso, ferahlatici lezzet', 75, NULL, false, 1),
  ('Cold Brew', '18 saat soguk demlenmis, puruzsuz ve aroma dolu', 95, 'Yeni', false, 2),
  ('Frappe', 'Buzlu, kopuklu ve serinletici kahve icecegi', 85, NULL, false, 3),
  ('Iced Mocha', 'Buzlu espresso, cikolata ve soguk sut', 95, NULL, false, 4),
  ('Ev Yapimi Limonata', 'Taze sikilmis limon, nane ve bal', 60, NULL, true, 5),
  ('Meyve Smoothie', 'Mevsim meyveleri, yogurt ve bal', 80, NULL, false, 6),
  ('Buzlu Cay', 'Seftali veya limon aromali, ev yapimi', 55, NULL, false, 7)
) AS val(name, description, price, badge, is_popular, sort_order)
CROSS JOIN public.categories c
WHERE c.slug = 'soguk-icecekler'
  AND NOT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.category_id = c.id
      AND mi.name = val.name
  );

-- Seed menu items for Kahvalti
INSERT INTO public.menu_items (name, description, price, badge, is_popular, sort_order, category_id)
SELECT val.name, val.description, val.price, val.badge, val.is_popular, val.sort_order, c.id
FROM (VALUES
  ('Serpme Kahvalti', 'Peynir cesitleri, zeytin, bal, kaymak, recel, yumurta, simit ve taze ekmek (2 kisilik)', 320, 'En Cok Satan', true, 0),
  ('Kahvalti Tabagi', 'Beyaz peynir, kasar, zeytin, domates, salatalik, yumurta, bal ve ekmek', 180, NULL, false, 1),
  ('Menemen', 'Domates, biber ve yumurta ile geleneksel tarif, yaninda ekmek', 120, NULL, true, 2),
  ('Avocado Toast', 'Ezilmis avokado, cherry domates, feta ve eksi mayali ekmek', 140, 'Populer', false, 3),
  ('French Toast', 'Tarifimize ozel, mevsim meyveleri, akca agac surubu ve krema', 130, NULL, false, 4),
  ('Karisik Omlet', 'Mantar, peynir, biber ve domates ile dolu omlet', 110, NULL, false, 5)
) AS val(name, description, price, badge, is_popular, sort_order)
CROSS JOIN public.categories c
WHERE c.slug = 'kahvalti'
  AND NOT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.category_id = c.id
      AND mi.name = val.name
  );

-- Seed menu items for Atistirmaliklar
INSERT INTO public.menu_items (name, description, price, badge, is_popular, sort_order, category_id)
SELECT val.name, val.description, val.price, val.badge, val.is_popular, val.sort_order, c.id
FROM (VALUES
  ('Club Sandwich', 'Tavuk, pastirma, marul, domates ve mayonez, patates kizartmasi ile', 160, NULL, true, 0),
  ('Karisik Tost', 'Kasar, sucuk, domates ve biber ile citir tost', 90, NULL, false, 1),
  ('Tavuklu Wrap', 'Izgara tavuk, marul, domates, sos ve lavas', 130, NULL, false, 2),
  ('Sezar Salata', 'Marul, parmesan, kruton ve ozel sezar sosu ile', 120, NULL, false, 3),
  ('Fettuccine Alfredo', 'Kremali parmesan sosu ve mantar', 140, NULL, false, 4),
  ('Truffle Patates', 'Citir patates, truffle yagi ve parmesan', 100, 'Favorimiz', false, 5)
) AS val(name, description, price, badge, is_popular, sort_order)
CROSS JOIN public.categories c
WHERE c.slug = 'atistirmaliklar'
  AND NOT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.category_id = c.id
      AND mi.name = val.name
  );

-- Seed menu items for Tatlilar
INSERT INTO public.menu_items (name, description, price, badge, is_popular, sort_order, category_id)
SELECT val.name, val.description, val.price, val.badge, val.is_popular, val.sort_order, c.id
FROM (VALUES
  ('Tiramisu', 'Klasik Italyan tarifi, mascarpone ve espresso ile', 120, NULL, true, 0),
  ('San Sebastian Cheesecake', 'Kremali ve yanik yuzeylu, mevsim meyveleri ile', 130, 'Imza', true, 1),
  ('Sicak Brownie', 'Cikolata parcali brownie, vanilya dondurmasi ile', 110, NULL, false, 2),
  ('Cikolata Sufle', 'Sicak akan cikolata, vanilya dondurmasi esliginde', 120, 'Ozel', false, 3),
  ('Belcika Waffle', 'Citir waffle, mevsim meyveleri, cikolata sosu ve krema', 110, NULL, false, 4),
  ('Magnolia', 'Kremali puding, biskuvi tabani ve karamel sos', 90, NULL, false, 5),
  ('Kunefe', 'Hatay usulu, antep fistigi ve kaymak ile', 140, NULL, true, 6)
) AS val(name, description, price, badge, is_popular, sort_order)
CROSS JOIN public.categories c
WHERE c.slug = 'tatlilar'
  AND NOT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.category_id = c.id
      AND mi.name = val.name
  );
