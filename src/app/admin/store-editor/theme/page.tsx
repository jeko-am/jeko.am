'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_PAGE_CONFIGS } from '../schemas';

const PRESETS = [
  { label: 'Deep green (default)', hex: '#274C46' },
  { label: 'Charcoal',              hex: '#1F2937' },
  { label: 'Slate',                 hex: '#475569' },
  { label: 'Plum',                  hex: '#5F295E' },
  { label: 'Brick',                 hex: '#8B2E2E' },
  { label: 'Cocoa',                 hex: '#5A3C2A' },
  { label: 'Navy',                  hex: '#1E3A5F' },
  { label: 'Black',                 hex: '#000000' },
];

interface ThemeValue {
  text_color?: string;
}

export default function AdminThemePage() {
  const [color, setColor]     = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [counts, setCounts]   = useState<{ rows: number | null; types: number | null }>({ rows: null, types: null });
  const [msg, setMsg]         = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Total schema-defined section types in the store editor across every page.
  const schemaTypeCount = ALL_PAGE_CONFIGS.reduce((acc, cfg) => acc + cfg.sections.length, 0);

  useEffect(() => {
    (async () => {
      const [{ data: themeRow }, sectionsRes] = await Promise.all([
        supabase.from('app_settings').select('value').eq('key', 'site_theme').maybeSingle(),
        supabase.from('page_sections').select('section_type', { count: 'exact', head: false }),
      ]);
      const v = (themeRow?.value as ThemeValue | null) || {};
      setColor(v.text_color || '');
      const rows  = sectionsRes.count ?? sectionsRes.data?.length ?? null;
      const types = sectionsRes.data ? new Set(sectionsRes.data.map(r => (r as { section_type: string }).section_type)).size : null;
      setCounts({ rows, types });
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

  function setColorAndSave(hex: string) {
    setColor(hex);
    persist({ text_color: hex || undefined });
  }

  function reset() {
    setColor('');
    persist({});
  }

  const valid = color === '' || /^#[0-9a-fA-F]{6}$/.test(color);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/store-editor" className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Store editor
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-vag">Theme — Site Text Colour</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sets the primary text colour used across every section of the public site. Headers and
          accent buttons keep their existing colours; only body copy and headings on neutral
          backgrounds are affected.
        </p>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          msg.kind === 'ok'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>{msg.text}</div>
      )}

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Section types in editor" value={String(schemaTypeCount)} />
        <Stat label="Section instances in DB"  value={counts.rows  != null ? String(counts.rows)  : '—'} />
        <Stat label="Distinct section types"   value={counts.types != null ? String(counts.types) : '—'} />
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-2 block">Custom colour</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : '#274C46'}
                  onChange={e => setColor(e.target.value)}
                  onBlur={e => setColorAndSave(e.target.value)}
                  className="w-14 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value.trim())}
                  onBlur={() => valid && setColorAndSave(color)}
                  placeholder="#274C46"
                  className={`flex-1 px-3 py-2 border rounded-lg font-mono text-sm ${
                    valid ? 'border-gray-200' : 'border-red-400'
                  }`}
                />
                <button
                  onClick={reset}
                  disabled={saving}
                  className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Reset to default
                </button>
              </div>
              {!valid && (
                <p className="text-xs text-red-600 mt-2">Use 6-digit hex like <code>#274C46</code>.</p>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-800 mb-2">Presets</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map(p => {
                  const selected = color.toLowerCase() === p.hex.toLowerCase();
                  return (
                    <button
                      key={p.hex}
                      disabled={saving}
                      onClick={() => setColorAndSave(p.hex)}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        selected ? 'border-deep-green bg-deep-green/5' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-gray-200" style={{ background: p.hex }} />
                        <span className="text-xs font-mono">{p.hex}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{p.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-800 mb-2">Live preview</div>
              <div
                className="rounded-xl border border-gray-200 p-5 bg-off-white"
                style={{ ['--site-text-color' as string]: color || '#274C46' }}
              >
                <div data-site-text>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--site-text-color)' }}>
                    Heading sample
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--site-text-color)' }}>
                    Body copy will render in this colour across every section of the public site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
