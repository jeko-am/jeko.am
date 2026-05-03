'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { setCustomFonts, type CustomFontRow } from '@/lib/font-options';

const FORMAT_FROM_EXT: Record<string, string> = {
  woff2: 'woff2',
  woff: 'woff',
  ttf: 'truetype',
  otf: 'opentype',
};

function slugify(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extFromName(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export default function AdminFontsPage() {
  const [fonts, setFonts]           = useState<CustomFontRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [msg, setMsg]               = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Form state
  const [file, setFile]                       = useState<File | null>(null);
  const [label, setLabel]                     = useState('');
  const [family, setFamily]                   = useState('');
  const [supportsLatin, setSupportsLatin]     = useState(true);
  const [supportsArmenian, setSupportsArmenian] = useState(true);
  const [weight, setWeight]                   = useState('400');
  const [style, setStyle]                     = useState('normal');
  const [submitting, setSubmitting]           = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('custom_fonts')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      setMsg({ kind: 'err', text: `Could not load fonts: ${error.message}. Did you apply the migration in supabase/migrations/20260504_custom_fonts.sql?` });
      return;
    }
    const rows = (data || []) as CustomFontRow[];
    setFonts(rows);
    setCustomFonts(rows);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!file) {
      setMsg({ kind: 'err', text: 'Pick a font file first.' });
      return;
    }
    if (!label.trim()) {
      setMsg({ kind: 'err', text: 'Label is required.' });
      return;
    }
    if (!supportsLatin && !supportsArmenian) {
      setMsg({ kind: 'err', text: 'A font must support at least one writing system.' });
      return;
    }

    setSubmitting(true);
    try {
      const ext = extFromName(file.name);
      const format = FORMAT_FROM_EXT[ext];
      if (!format) {
        throw new Error(`Unsupported file extension .${ext}. Use .woff2, .woff, .ttf, or .otf.`);
      }

      const value = slugify(label);
      const familyName = family.trim() || label.trim();
      const objectPath = `${value}-${Date.now()}.${ext}`;

      // 1. Upload binary to storage bucket.
      const upload = await supabase.storage
        .from('custom-fonts')
        .upload(objectPath, file, {
          contentType: file.type || `font/${ext}`,
          cacheControl: '31536000',
          upsert: false,
        });
      if (upload.error) throw upload.error;

      const { data: urlData } = supabase.storage.from('custom-fonts').getPublicUrl(objectPath);
      const fileUrl = urlData.publicUrl;

      // 2. Insert metadata row.
      const insert = await supabase.from('custom_fonts').insert({
        label: label.trim(),
        value,
        family: familyName,
        file_url: fileUrl,
        supports_latin: supportsLatin,
        supports_armenian: supportsArmenian,
        font_weight: weight,
        font_style: style,
        format,
      });
      if (insert.error) throw insert.error;

      setMsg({ kind: 'ok', text: `Uploaded "${label}". It will appear in the font dropdown.` });
      setFile(null);
      setLabel('');
      setFamily('');
      setWeight('400');
      setStyle('normal');
      setSupportsLatin(true);
      setSupportsArmenian(true);
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMsg({ kind: 'err', text: `Upload failed: ${message}` });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(font: CustomFontRow) {
    if (!confirm(`Delete "${font.label}"? Pages using this font will fall back to defaults.`)) return;
    setMsg(null);
    try {
      // Try to clean up the storage object too. Best-effort: parse the path
      // out of the public URL.
      const m = font.file_url.match(/custom-fonts\/(.+)$/);
      if (m) {
        await supabase.storage.from('custom-fonts').remove([m[1]]);
      }
      const { error } = await supabase.from('custom_fonts').delete().eq('id', font.id);
      if (error) throw error;
      setMsg({ kind: 'ok', text: `Deleted "${font.label}".` });
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMsg({ kind: 'err', text: `Delete failed: ${message}` });
    }
  }

  return (
    <div className="admin-panel min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Custom Fonts</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload .woff2 / .woff / .ttf / .otf files. Mark which writing systems
              each font supports — Armenian text only sees Armenian-safe fonts in the editor.
            </p>
          </div>
          <Link href="/admin/store-editor" className="text-sm text-deep-green hover:underline">
            ← Back to Store Editor
          </Link>
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.kind === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Upload form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Upload a new font</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font file</label>
            <input
              type="file"
              accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label (shown in dropdown)</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Mariam Web"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CSS family name (optional)</label>
              <input
                type="text"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                placeholder="(defaults to Label)"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={supportsLatin} onChange={(e) => setSupportsLatin(e.target.checked)} />
              Supports Latin (English)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={supportsArmenian} onChange={(e) => setSupportsArmenian(e.target.checked)} />
              Supports Armenian
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font weight</label>
              <select value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
                <option value="100">100 Thin</option>
                <option value="300">300 Light</option>
                <option value="400">400 Regular</option>
                <option value="500">500 Medium</option>
                <option value="600">600 SemiBold</option>
                <option value="700">700 Bold</option>
                <option value="800">800 ExtraBold</option>
                <option value="900">900 Black</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !file}
            className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Uploading...' : 'Upload font'}
          </button>
        </form>

        {/* Existing fonts table */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Uploaded fonts</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : fonts.length === 0 ? (
            <p className="text-sm text-gray-500">No custom fonts yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {fonts.map((f) => (
                <li key={f.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: `'${f.family}', sans-serif` }}>
                      {f.label} <span className="text-gray-400 font-normal">— Aa Բբ</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      <code>{f.value}</code> · {f.format || 'unknown'} · w{f.font_weight} {f.font_style}
                      {f.supports_latin && <span className="ml-2 text-deep-green">Latin</span>}
                      {f.supports_armenian && <span className="ml-2 text-deep-green">Armenian</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(f)}
                    className="text-sm text-red-600 hover:text-red-800 hover:underline whitespace-nowrap"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
