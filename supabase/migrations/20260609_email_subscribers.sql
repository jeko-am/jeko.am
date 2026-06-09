create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  is_subscribed boolean not null default true,
  subscribed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_subscribers_email_key unique (email),
  constraint email_subscribers_email_valid check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists email_subscribers_subscribed_at_idx
  on public.email_subscribers (subscribed_at desc);

alter table public.email_subscribers
  add column if not exists source text,
  add column if not exists is_subscribed boolean not null default true,
  add column if not exists subscribed_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.email_subscribers enable row level security;

drop policy if exists "email subscribers public insert" on public.email_subscribers;
create policy "email subscribers public insert"
  on public.email_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "email subscribers public resubscribe" on public.email_subscribers;
create policy "email subscribers public resubscribe"
  on public.email_subscribers
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "email subscribers authenticated read" on public.email_subscribers;
create policy "email subscribers authenticated read"
  on public.email_subscribers
  for select
  to authenticated
  using (true);
