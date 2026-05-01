-- Currency support: cached daily FX rates + site-wide currency selection.

create table if not exists public.currency_rates (
  id           int          primary key default 1,
  base         text         not null default 'GBP',
  rates        jsonb        not null default '{}'::jsonb,
  fetched_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now(),
  constraint currency_rates_singleton check (id = 1)
);

insert into public.currency_rates (id, base, rates, fetched_at, updated_at)
values (1, 'GBP', '{"GBP":1}'::jsonb, now() - interval '2 days', now() - interval '2 days')
on conflict (id) do nothing;

create table if not exists public.app_settings (
  key         text         primary key,
  value       jsonb        not null,
  updated_at  timestamptz  not null default now()
);

insert into public.app_settings (key, value)
values ('currency', '{"code":"GBP","symbol":"£","locale":"en-GB"}'::jsonb)
on conflict (key) do nothing;

alter table public.currency_rates enable row level security;
alter table public.app_settings   enable row level security;

drop policy if exists "currency_rates read"  on public.currency_rates;
drop policy if exists "currency_rates write" on public.currency_rates;
drop policy if exists "app_settings read"    on public.app_settings;
drop policy if exists "app_settings write"   on public.app_settings;

create policy "currency_rates read"
  on public.currency_rates for select
  using (true);

create policy "currency_rates write"
  on public.currency_rates for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "app_settings read"
  on public.app_settings for select
  using (true);

create policy "app_settings write"
  on public.app_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
