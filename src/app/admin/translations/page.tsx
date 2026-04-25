"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { en as staticEn, hy as staticHy } from "@/lib/i18n/translations";

type Row = {
  key: string;
  en: string;
  hy: string;
  enDefault: string;
  hyDefault: string;
  dirty: boolean;
};

export default function TranslationsAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "overridden" | "missing">("all");
  const [message, setMessage] = useState<{ type: "ok" | "err" | "warn"; text: string } | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const allKeys = Array.from(new Set([...Object.keys(staticEn), ...Object.keys(staticHy)])).sort();
      const base: Record<string, Row> = {};
      for (const key of allKeys) {
        base[key] = {
          key,
          en: staticEn[key] ?? "",
          hy: staticHy[key] ?? "",
          enDefault: staticEn[key] ?? "",
          hyDefault: staticHy[key] ?? "",
          dirty: false,
        };
      }

      try {
        const { data, error } = await supabase.from("translations").select("key, en, hy");
        if (error) {
          if (/relation .* does not exist|not found/i.test(error.message) || error.code === "PGRST205") {
            setTableMissing(true);
          } else {
            setMessage({ type: "err", text: error.message });
          }
        } else if (data) {
          for (const row of data as Array<{ key: string; en: string | null; hy: string | null }>) {
            if (!base[row.key]) {
              base[row.key] = {
                key: row.key,
                en: row.en ?? "",
                hy: row.hy ?? "",
                enDefault: "",
                hyDefault: "",
                dirty: false,
              };
            } else {
              if (row.en) base[row.key].en = row.en;
              if (row.hy) base[row.key].hy = row.hy;
            }
          }
        }
      } catch (err) {
        setMessage({ type: "err", text: err instanceof Error ? err.message : String(err) });
      }

      setRows(Object.values(base).sort((a, b) => a.key.localeCompare(b.key)));
      setLoading(false);
    })();
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "overridden") {
        if (r.en === r.enDefault && r.hy === r.hyDefault) return false;
      }
      if (filter === "missing") {
        if (r.hy.trim().length > 0) return false;
      }
      if (!q) return true;
      return (
        r.key.toLowerCase().includes(q) ||
        r.en.toLowerCase().includes(q) ||
        r.hy.toLowerCase().includes(q)
      );
    });
  }, [rows, search, filter]);

  function updateRow(key: string, field: "en" | "hy", value: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.key === key ? { ...r, [field]: value, dirty: true } : r
      )
    );
  }

  async function saveAll() {
    const dirty = rows.filter((r) => r.dirty);
    if (dirty.length === 0) {
      setMessage({ type: "warn", text: "No changes to save." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = dirty.map((r) => ({
        key: r.key,
        en: r.en,
        hy: r.hy,
      }));
      const { error } = await supabase
        .from("translations")
        .upsert(payload, { onConflict: "key" });
      if (error) throw error;
      setRows((prev) => prev.map((r) => ({ ...r, dirty: false })));
      setMessage({ type: "ok", text: `Saved ${dirty.length} translation${dirty.length === 1 ? "" : "s"}.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/relation .* does not exist|not found/i.test(msg)) {
        setTableMissing(true);
        setMessage({ type: "err", text: "The `translations` table doesn't exist yet. Run the migration SQL (shown below) in Supabase first." });
      } else {
        setMessage({ type: "err", text: msg });
      }
    } finally {
      setSaving(false);
    }
  }

  const dirtyCount = rows.filter((r) => r.dirty).length;
  const overriddenCount = rows.filter((r) => r.en !== r.enDefault || r.hy !== r.hyDefault).length;
  const missingHyCount = rows.filter((r) => !r.hy.trim()).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Translations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit the English and Armenian text shown across the site. Changes save to the database and override the built-in dictionary.
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving || dirtyCount === 0}
          className="px-5 py-2.5 bg-deep-green text-white font-medium rounded-lg hover:bg-deep-green/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : dirtyCount > 0 ? `Save ${dirtyCount} change${dirtyCount === 1 ? "" : "s"}` : "Save"}
        </button>
      </div>

      {tableMissing && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="font-semibold text-amber-900 mb-2">Database setup needed</div>
          <p className="text-sm text-amber-800 mb-2">
            The <code className="px-1 py-0.5 bg-amber-100 rounded">translations</code> table hasn&apos;t been created yet.
            Run this SQL in the Supabase SQL editor to enable saving:
          </p>
          <pre className="text-xs bg-white border border-amber-200 rounded p-3 overflow-x-auto">
{`create table if not exists public.translations (
  key text primary key,
  en text,
  hy text,
  updated_at timestamptz default now()
);

alter table public.translations enable row level security;

-- Anyone can read translations
create policy if not exists "Anyone can read translations"
  on public.translations for select
  using (true);

-- Only admins can write
create policy if not exists "Admins can upsert translations"
  on public.translations for insert
  with check (
    exists (select 1 from public.admin_users
            where user_id = auth.uid()
              and role in ('admin','super_admin')
              and is_active = true)
  );

create policy if not exists "Admins can update translations"
  on public.translations for update
  using (
    exists (select 1 from public.admin_users
            where user_id = auth.uid()
              and role in ('admin','super_admin')
              and is_active = true)
  );`}
          </pre>
        </div>
      )}

      {message && (
        <div
          className={`mb-5 p-3 rounded-lg text-sm ${
            message.type === "ok"
              ? "bg-green-50 text-green-800 border border-green-200"
              : message.type === "warn"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-5 flex gap-3 items-center flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by key or text..."
          className="flex-1 min-w-[260px] px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-deep-green"
        />
        <div className="flex gap-2 text-sm">
          {(["all", "overridden", "missing"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg border ${
                filter === f
                  ? "bg-deep-green text-white border-deep-green"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f === "all" && `All (${rows.length})`}
              {f === "overridden" && `Overridden (${overriddenCount})`}
              {f === "missing" && `Missing Armenian (${missingHyCount})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading translations...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[minmax(200px,1fr)_minmax(260px,2fr)_minmax(260px,2fr)] gap-3 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <div>Key</div>
            <div>English</div>
            <div>Armenian (Հայերեն)</div>
          </div>
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {visible.map((r) => (
              <div
                key={r.key}
                className={`grid grid-cols-[minmax(200px,1fr)_minmax(260px,2fr)_minmax(260px,2fr)] gap-3 px-4 py-2.5 hover:bg-gray-50 ${
                  r.dirty ? "bg-yellow-50" : ""
                }`}
              >
                <div className="text-[12px] font-mono text-gray-600 self-center break-all">{r.key}</div>
                <TextCell value={r.en} onChange={(v) => updateRow(r.key, "en", v)} placeholder={r.enDefault} />
                <TextCell value={r.hy} onChange={(v) => updateRow(r.key, "hy", v)} placeholder={r.hyDefault} highlight={!r.hy.trim()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TextCell({
  value,
  onChange,
  placeholder,
  highlight,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  highlight?: boolean;
}) {
  const multiline = (value?.length ?? 0) > 80 || (value ?? "").includes("\n");
  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={Math.min(6, Math.max(2, Math.ceil(value.length / 60)))}
      className={`px-3 py-2 text-sm border rounded-lg outline-none focus:border-deep-green ${
        highlight ? "border-red-300 bg-red-50/30" : "border-gray-200"
      }`}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-3 py-2 text-sm border rounded-lg outline-none focus:border-deep-green ${
        highlight ? "border-red-300 bg-red-50/30" : "border-gray-200"
      }`}
    />
  );
}
