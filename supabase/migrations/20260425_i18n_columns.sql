-- Adds an `i18n` JSONB column to content-bearing tables so admin can store
-- Armenian translations alongside the canonical English values.
-- Convention: i18n -> { "hy": { "name": "...", "description": "...", ... } }

alter table if exists public.products            add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.categories          add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.collections         add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.bundles             add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.upsells             add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.brands              add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.blog_posts          add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.product_bundles     add column if not exists i18n jsonb not null default '{}'::jsonb;
