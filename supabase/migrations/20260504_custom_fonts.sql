-- Custom font uploads for the store editor.
-- Lets admins upload Latin/Armenian-compatible fonts and use them across the site.

create table if not exists public.custom_fonts (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null unique,
  family text not null,
  file_url text not null,
  supports_latin boolean not null default true,
  supports_armenian boolean not null default false,
  font_weight text not null default '400',
  font_style text not null default 'normal',
  format text,
  created_at timestamptz not null default now()
);

alter table public.custom_fonts enable row level security;

drop policy if exists "custom_fonts public read" on public.custom_fonts;
create policy "custom_fonts public read"
  on public.custom_fonts for select
  to anon, authenticated
  using (true);

drop policy if exists "custom_fonts authenticated write" on public.custom_fonts;
create policy "custom_fonts authenticated write"
  on public.custom_fonts for all
  to authenticated
  using (true) with check (true);

-- Public bucket for the font binary files. They need to load on the live
-- site without auth, and they are not sensitive.
insert into storage.buckets (id, name, public)
  values ('custom-fonts', 'custom-fonts', true)
  on conflict (id) do update set public = true;

drop policy if exists "custom-fonts public read" on storage.objects;
create policy "custom-fonts public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'custom-fonts');

drop policy if exists "custom-fonts authenticated write" on storage.objects;
create policy "custom-fonts authenticated write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'custom-fonts')
  with check (bucket_id = 'custom-fonts');
