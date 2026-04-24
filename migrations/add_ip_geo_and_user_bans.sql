-- Migration: IP/geo tracking for analytics_sessions + user_bans table
-- Run this against Supabase (SQL editor or `supabase db push`).

-- ─── 1. Extend analytics_sessions with IP + geolocation ────────────────
ALTER TABLE public.analytics_sessions
  ADD COLUMN IF NOT EXISTS ip_address text,
  ADD COLUMN IF NOT EXISTS city       text,
  ADD COLUMN IF NOT EXISTS region     text,
  ADD COLUMN IF NOT EXISTS country    text;

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_city    ON public.analytics_sessions (city);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_country ON public.analytics_sessions (country);

-- ─── 2. user_bans table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_bans (
  id          bigserial PRIMARY KEY,
  user_id     uuid        NOT NULL,
  banned_by   uuid,
  reason      text,
  banned_at   timestamptz NOT NULL DEFAULT now(),
  unbanned_at timestamptz,
  unbanned_by uuid
);

CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON public.user_bans (user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_active
  ON public.user_bans (user_id) WHERE unbanned_at IS NULL;

ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- Users can see their own ban record (so the client can detect it and sign out)
DROP POLICY IF EXISTS user_bans_self_read ON public.user_bans;
CREATE POLICY user_bans_self_read ON public.user_bans
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admins (rows in admin_users with an active admin/editor role) can read + write
DROP POLICY IF EXISTS user_bans_admin_all ON public.user_bans;
CREATE POLICY user_bans_admin_all ON public.user_bans
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role IN ('super_admin','admin','editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid()
        AND au.is_active = true
        AND au.role IN ('super_admin','admin','editor')
    )
  );
