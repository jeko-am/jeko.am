-- Run this entire file in the Supabase SQL editor to enable Armenian
-- translations across the admin panel.
--
-- 1. Creates a `translations` table for the site-wide i18n override dictionary
--    edited at /admin/translations.
-- 2. Adds an `i18n` JSONB column to all content-bearing tables (products,
--    categories, blog, etc.) so admin can store Armenian alongside English.

-- ───────────────────────────────────────────────────────────────────────
-- 1. translations table (runtime overrides for static dictionary)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.translations (
  key text primary key,
  en text,
  hy text,
  updated_at timestamptz default now()
);

create or replace function public.translations_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists translations_set_updated_at on public.translations;
create trigger translations_set_updated_at
  before update on public.translations
  for each row execute function public.translations_set_updated_at();

alter table public.translations enable row level security;

drop policy if exists "Anyone can read translations" on public.translations;
create policy "Anyone can read translations"
  on public.translations for select
  using (true);

drop policy if exists "Admins can insert translations" on public.translations;
create policy "Admins can insert translations"
  on public.translations for insert
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
        and role in ('admin', 'super_admin')
        and is_active = true
    )
  );

drop policy if exists "Admins can update translations" on public.translations;
create policy "Admins can update translations"
  on public.translations for update
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
        and role in ('admin', 'super_admin')
        and is_active = true
    )
  );

drop policy if exists "Admins can delete translations" on public.translations;
create policy "Admins can delete translations"
  on public.translations for delete
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
        and role in ('admin', 'super_admin')
        and is_active = true
    )
  );

-- ───────────────────────────────────────────────────────────────────────
-- 2. Per-record i18n columns (Armenian overrides alongside English)
--    Convention: i18n -> { "hy": { "name": "...", "description": "..." } }
-- ───────────────────────────────────────────────────────────────────────
alter table if exists public.products         add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.categories       add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.collections      add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.bundles          add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.upsells          add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.brands           add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.blog_posts       add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.product_bundles  add column if not exists i18n jsonb not null default '{}'::jsonb;
