-- Translations table: runtime overrides for static i18n dictionary.
-- Store editor admin page (/admin/translations) upserts rows here.
-- Client loads all rows on bootstrap and merges on top of static dict.

create table if not exists public.translations (
  key text primary key,
  en text,
  hy text,
  updated_at timestamptz default now()
);

-- Bump updated_at on any write
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

-- RLS: public read (for all visitors), admin-only write
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
