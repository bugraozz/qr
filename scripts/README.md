# Supabase SQL scripts

Use these scripts from Supabase SQL Editor.

## Fresh database

1. Run `scripts/001_create_tables.sql`
2. Run `scripts/002_seed_data.sql`

## Existing/broken database

If menu is empty or columns are mismatched, run:

1. `scripts/004_fix_schema_for_menu.sql`
2. `scripts/002_seed_data.sql`

## About `supabase_migrations.schema_migrations` error

If you see `relation "supabase_migrations.schema_migrations" does not exist`, you are usually running SQL from a migration-history flow that expects Supabase CLI migration metadata.

For this project, run scripts directly in SQL Editor in the order above.

## Quick verification

Run these queries after scripts:

```sql
select count(*) as categories_count from public.categories;
select count(*) as menu_items_count from public.menu_items;
select id, name, slug, is_active from public.categories order by sort_order;
select id, name, is_available, is_popular from public.menu_items order by sort_order limit 10;
```
