create table if not exists public.user_bans (
  id bigserial primary key,
  user_id uuid not null,
  banned_by uuid,
  reason text,
  banned_at timestamptz not null default now(),
  unbanned_at timestamptz,
  unbanned_by uuid
);

create index if not exists idx_user_bans_user_id on public.user_bans (user_id);
create index if not exists idx_user_bans_active
  on public.user_bans (user_id)
  where unbanned_at is null;

alter table public.user_bans enable row level security;

drop policy if exists user_bans_self_read on public.user_bans;
create policy user_bans_self_read on public.user_bans
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists user_bans_admin_all on public.user_bans;
create policy user_bans_admin_all on public.user_bans
  for all to authenticated
  using (
    exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
        and au.is_active = true
        and au.role in ('super_admin', 'admin', 'editor')
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
        and au.is_active = true
        and au.role in ('super_admin', 'admin', 'editor')
    )
  );
