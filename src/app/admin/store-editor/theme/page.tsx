'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_PAGE_CONFIGS } from '../schemas';

const TEXT_PRESETS = [
  { label: 'Deep green (default)', hex: '#274C46' },
  { label: 'Charcoal',              hex: '#1F2937' },
  { label: 'Slate',                 hex: '#475569' },
  { label: 'Plum',                  hex: '#5F295E' },
  { label: 'Brick',                 hex: '#8B2E2E' },
  { label: 'Cocoa',                 hex: '#5A3C2A' },
  { label: 'Navy',                  hex: '#1E3A5F' },
  { label: 'Black',                 hex: '#000000' },
];

interface BrandKey {
  storeKey: keyof ThemeValue;
  cssVar: string;
  label: string;
  hint: string;
  defaultHex: string;
}

const BRAND_KEYS: BrandKey[] = [
  { storeKey: 'deep_green',   cssVar: '--deep-green',   label: 'Deep Green (primary brand)',           hint: 'Headers, footer, primary buttons, headings.', defaultHex: '#274C46' },
  { storeKey: 'gold',         cssVar: '--gold',         label: 'Gold (accent)',                        hint: 'CTAs, highlights, badges.',                   defaultHex: '#F2A900' },
  { storeKey: 'gold_hover',   cssVar: '--gold-hover',   label: 'Gold Hover',                           hint: 'Hover state for gold buttons.',               defaultHex: '#d99500' },
  { storeKey: 'off_white',    cssVar: '--off-white',    label: 'Off-White (page background)',          hint: 'Light page sections, neutral panels.',        defaultHex: '#EAE5DC' },
  { storeKey: 'beige_light',  cssVar: '--beige-light',  label: 'Beige Light',                          hint: 'Inline cards / soft surfaces.',               defaultHex: '#f5f1eb' },
  { storeKey: 'orange_brand', cssVar: '--orange-brand', label: 'Orange (secondary accent)',            hint: 'Notifications, badges, illustrations.',       defaultHex: '#E65A1E' },
  { storeKey: 'purple_brand', cssVar: '--purple-brand', label: 'Purple (secondary accent)',            hint: 'Comparison tables, special section blocks.',  defaultHex: '#5F295E' },
];

interface ThemeValue {
  text_color?: string;
  deep_green?: string;
  off_white?: string;
  gold?: string;
  gold_hover?: string;
  orange_brand?: string;
  purple_brand?: string;
  beige_light?: string;
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export default function AdminThemePage() {
  const [theme, setTheme]     = useState<ThemeValue>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [counts, setCounts]   = useState<{ rows: number | null }>({ rows: null });
  const [msg, setMsg]         = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const schemaTypeCount = ALL_PAGE_CONFIGS.reduce((acc, cfg) => acc + cfg.sections.length, 0);

  useEffect(() => {
    (async () => {
      const [{ data: themeRow }, sectionsRes] = await Promise.all([
        supabase.from('app_settings').select('value').eq('key', 'site_theme').maybeSingle(),
        supabase.from('page_sections').select('id', { count: 'exact', head: true }),
      ]);
      const v = (themeRow?.value as ThemeValue | null) || {};
      setTheme(v);
      setCounts({ rows: sectionsRes.count ?? null });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2500);
    return () => clearTimeout(t);
  }, [msg]);

  async function persist(next: ThemeValue) {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: 'site_theme', value: next, updated_at: new Date().toISOString() });
      if (error) throw error;
      setMsg({ kind: 'ok', text: 'Saved' });
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSaving(false);
    }
  }

  function update(key: keyof ThemeValue, value: string) {
    const next = { ...theme };
    if (value && HEX_RE.test(value)) next[key] = value;
    else delete next[key];
    setTheme(next);
    persist(next);
  }

  function reset() {
    setTheme({});
    persist({});
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/store-editor" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Store editor
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme — Brand Colours</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Live-edits the brand palette for the entire site. Changes apply immediately on every
            public page (no rebuild). Leave a colour blank to revert it to the original default.
          </p>
        </div>
        <button
          onClick={reset}
          disabled={saving}
          className="px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex-shrink-0"
        >
          Reset all to defaults
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          msg.kind === 'ok'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>{msg.text}</div>
      )}

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Stat label="Section types in editor" value={String(schemaTypeCount)} />
        <Stat label="Section instances in DB"  value={counts.rows  != null ? String(counts.rows)  : '—'} />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Brand palette</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BRAND_KEYS.map((b) => (
                  <ColorInput
                    key={b.storeKey}
                    label={b.label}
                    hint={b.hint}
                    defaultHex={b.defaultHex}
                    value={theme[b.storeKey] || ''}
                    onChange={(v) => update(b.storeKey, v)}
                    disabled={saving}
                  />
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Site text colour</h2>
              <p className="text-xs text-gray-500 mb-3">
                Body-copy and heading colour on neutral backgrounds. Independent of the brand
                palette so you can dim text without changing accents.
              </p>
              <ColorInput
                label="Text colour"
                hint="Empty = use brand default."
                defaultHex="#274C46"
                value={theme.text_color || ''}
                onChange={(v) => update('text_color', v)}
                disabled={saving}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {TEXT_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    disabled={saving}
                    onClick={() => update('text_color', p.hex)}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      (theme.text_color || '').toLowerCase() === p.hex.toLowerCase()
                        ? 'border-deep-green bg-deep-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-gray-200" style={{ background: p.hex }} />
                      <span className="text-xs font-mono">{p.hex}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-2">Live preview</h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4" style={{ backgroundColor: theme.deep_green || '#274C46' }}>
                  <div className="text-white font-bold">Deep green header sample</div>
                </div>
                <div className="p-5" style={{ backgroundColor: theme.off_white || '#EAE5DC' }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: theme.text_color || theme.deep_green || '#274C46' }}>
                    Body heading
                  </h3>
                  <p className="text-sm mb-3" style={{ color: theme.text_color || theme.deep_green || '#274C46' }}>
                    Body copy renders in the chosen text colour.
                  </p>
                  <button
                    className="px-4 py-2 rounded font-semibold"
                    style={{
                      backgroundColor: theme.gold || '#F2A900',
                      color: theme.deep_green || '#274C46',
                    }}
                  >
                    Gold CTA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ColorInput({
  label, hint, defaultHex, value, onChange, disabled,
}: {
  label: string;
  hint: string;
  defaultHex: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  const valid = local === '' || HEX_RE.test(local);
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <p className="text-[11px] text-gray-500 mb-2 leading-snug">{hint}</p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={HEX_RE.test(local) ? local : defaultHex}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-10 h-9 rounded border border-gray-200 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={local}
          placeholder={defaultHex}
          onChange={(e) => setLocal(e.target.value.trim())}
          onBlur={() => valid && onChange(local)}
          disabled={disabled}
          className={`flex-1 px-2 py-1.5 border rounded font-mono text-xs ${valid ? 'border-gray-200' : 'border-red-400'}`}
        />
      </div>
      {!valid && <p className="text-[11px] text-red-600 mt-1">Use 6-digit hex</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
