"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const MIGRATION_SQL = `-- Copy this file: supabase/migrations/20260424_i18n_all.sql
-- Paste into Supabase Dashboard → SQL Editor → Run

-- 1) Translations override table (for /admin/translations)
create table if not exists public.translations (
  key text primary key,
  en text,
  hy text,
  updated_at timestamptz default now()
);
alter table public.translations enable row level security;
create policy if not exists "Anyone can read translations"
  on public.translations for select using (true);
create policy if not exists "Admins can upsert translations"
  on public.translations for insert
  with check (exists (select 1 from public.admin_users
    where user_id = auth.uid() and role in ('admin','super_admin') and is_active = true));
create policy if not exists "Admins can update translations"
  on public.translations for update
  using (exists (select 1 from public.admin_users
    where user_id = auth.uid() and role in ('admin','super_admin') and is_active = true));

-- 2) Armenian JSONB on content tables
alter table if exists public.products    add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.categories  add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.collections add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.bundles     add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.upsells     add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.brands      add column if not exists i18n jsonb not null default '{}'::jsonb;
alter table if exists public.blog_posts  add column if not exists i18n jsonb not null default '{}'::jsonb;`;

export default function MigrationNotice() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("jeko-migration-notice-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    (async () => {
      try {
        const res = await supabase.from("translations").select("key").limit(1);
        if (res.error && /does not exist|not found|PGRST205/i.test(res.error.message)) {
          setShow(true);
          return;
        }
      } catch {
        setShow(true);
      }
      // Also check products has i18n
      try {
        const { error } = await supabase.from("products").select("i18n").limit(1);
        if (error && /i18n/i.test(error.message)) setShow(true);
      } catch {
        // ignore
      }
    })();
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">Armenian translation support needs one SQL migration</p>
          <p className="text-xs text-amber-800 mt-0.5">
            Copy the SQL below → paste into <a className="underline font-medium" href="https://supabase.com/dashboard/project/dzhtpnskezkrtfinntbi/sql/new" target="_blank" rel="noopener">Supabase SQL editor</a> → Run. Admin can still save English; Armenian overrides just need these columns.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(MIGRATION_SQL);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-md hover:bg-amber-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy migration SQL"}
            </button>
            <button
              onClick={() => {
                localStorage.setItem("jeko-migration-notice-dismissed", "1");
                setDismissed(true);
              }}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 text-xs font-medium rounded-md hover:bg-amber-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
