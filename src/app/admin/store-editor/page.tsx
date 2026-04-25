'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { ALL_PAGE_CONFIGS, PRODUCT_PAGE_SECTIONS, type SectionSchema, type PageConfig, type FieldDef } from './schemas';
import { useAdminEditLang } from '@/lib/i18n/AdminEditLang';
import { dictionaries } from '@/lib/i18n/translations';
import { memoTranslateHy } from '@/components/HyText';

/** Build the HY default value map for a section's translatable fields from the static dictionary. */
function buildHyDefaults(schema: SectionSchema): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of schema.fields) {
    if ((f.type === 'text' || f.type === 'textarea') && f.i18nKey) {
      const v = dictionaries.hy[f.i18nKey];
      if (v) out[f.key] = v;
    }
  }
  return out;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published';
  template: string;
  created_at: string;
  updated_at: string;
}

interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: Record<string, unknown>;
  sort_order: number;
  is_visible: boolean;
}

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEMAS imported from ./schemas.ts
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── HOMEPAGE_SECTIONS removed — all schemas are now in ./schemas.ts ── */

/* ═══════════════════════════════════════════════════════════════════════════
   IMAGE UPLOAD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function ImageField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all ${
          dragActive ? 'border-deep-green bg-deep-green/5' : 'border-gray-200 hover:border-gray-300'
        } ${value ? 'p-2' : 'p-4'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt={label}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">No preview</text></svg>'; }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={() => onChange('')}
                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-3 border-deep-green border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Drop image here or <span className="text-deep-green font-medium">browse</span>
                </p>
                <p className="text-[10px] text-gray-400">JPG, PNG, WebP, GIF up to 10MB</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {/* Manual URL input */}
      <div className="mt-1.5">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none text-gray-600 placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIST FIELD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function ListField({
  field,
  value,
  updateField,
}: {
  field: FieldDef;
  value: unknown;
  updateField: (key: string, value: unknown) => void;
}) {
  const items: string[] = Array.isArray(value) ? (value as string[]) : [];
  const [newItem, setNewItem] = useState('');

  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-2">{field.label}</label>
      <div className="space-y-1 mb-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                updateField(field.key, next);
              }}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none"
            />
            <button
              onClick={() => updateField(field.key, items.filter((_, j) => j !== i))}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              title="Remove"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-gray-400 italic px-1">No options yet — add one below</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newItem.trim()) {
              updateField(field.key, [...items, newItem.trim()]);
              setNewItem('');
            }
          }}
          placeholder={field.placeholder || 'Type and press Enter…'}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none"
        />
        <button
          onClick={() => {
            if (newItem.trim()) {
              updateField(field.key, [...items, newItem.trim()]);
              setNewItem('');
            }
          }}
          className="px-3 py-1.5 bg-deep-green text-white text-sm rounded-lg hover:bg-deep-green/90 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UPSELL MANAGER (inline for product pages)
   ═══════════════════════════════════════════════════════════════════════════ */

interface UpsellItem {
  id?: string;
  target_product_id: string;
  target_name: string;
  upsell_type: 'upsell' | 'cross_sell';
  title: string;
  description: string;
  discount_percentage: number;
  is_active: boolean;
}

function UpsellManager({ productSlug }: { productSlug: string }) {
  const [upsells, setUpsells] = useState<UpsellItem[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [savingUpsells, setSavingUpsells] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      // Get source product
      const { data: srcProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', productSlug)
        .single();
      if (!srcProduct) return;
      setSourceId(srcProduct.id);

      // Get all active products for picker
      const { data: allProducts } = await supabase
        .from('products')
        .select('id, name')
        .eq('status', 'active')
        .neq('id', srcProduct.id)
        .order('name');
      setProducts(allProducts || []);

      // Get existing upsells
      const { data: existing } = await supabase
        .from('upsells')
        .select('*, target_product:products!upsells_target_product_id_fkey(name)')
        .eq('source_product_id', srcProduct.id)
        .order('sort_order');
      if (existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUpsells(existing.map((u: any) => ({
          id: u.id,
          target_product_id: u.target_product_id,
          target_name: u.target_product?.name || 'Unknown',
          upsell_type: u.upsell_type,
          title: u.title || '',
          description: u.description || '',
          discount_percentage: u.discount_percentage || 0,
          is_active: u.is_active,
        })));
      }
      setLoaded(true);
    }
    load();
  }, [productSlug]);

  const addUpsell = (targetId: string) => {
    const prod = products.find(p => p.id === targetId);
    if (!prod || upsells.some(u => u.target_product_id === targetId)) return;
    setUpsells([...upsells, {
      target_product_id: targetId,
      target_name: prod.name,
      upsell_type: 'cross_sell',
      title: '',
      description: '',
      discount_percentage: 0,
      is_active: true,
    }]);
  };

  const removeUpsell = (idx: number) => {
    setUpsells(upsells.filter((_, i) => i !== idx));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateUpsell = (idx: number, key: keyof UpsellItem, value: any) => {
    const updated = [...upsells];
    updated[idx] = { ...updated[idx], [key]: value };
    setUpsells(updated);
  };

  const saveUpsells = async () => {
    if (!sourceId) return;
    setSavingUpsells(true);
    try {
      // Delete existing
      await supabase.from('upsells').delete().eq('source_product_id', sourceId);
      // Insert new
      if (upsells.length > 0) {
        const payloads = upsells.map((u, i) => ({
          source_product_id: sourceId,
          target_product_id: u.target_product_id,
          upsell_type: u.upsell_type,
          title: u.title || null,
          description: u.description || null,
          discount_percentage: u.discount_percentage,
          is_active: u.is_active,
          sort_order: i,
        }));
        await supabase.from('upsells').insert(payloads);
      }
    } catch (err) {
      console.error('Failed to save upsells:', err);
    } finally {
      setSavingUpsells(false);
    }
  };

  if (!loaded) return <div className="text-xs text-gray-400 py-2">Loading upsells...</div>;

  return (
    <div className="border-t border-gray-200 pt-4 mt-2">
      <h4 className="text-[13px] font-semibold text-gray-700 mb-3">Manage Upsells</h4>

      {/* Add upsell picker */}
      <select
        onChange={(e) => { if (e.target.value) { addUpsell(e.target.value); e.target.value = ''; } }}
        className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded-lg mb-3 bg-white"
        defaultValue=""
      >
        <option value="" disabled>+ Add product...</option>
        {products.filter(p => !upsells.some(u => u.target_product_id === p.id)).map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Upsell list */}
      {upsells.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No upsells added yet</p>
      ) : (
        <div className="space-y-3">
          {upsells.map((u, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{u.target_name}</span>
                <button onClick={() => removeUpsell(idx)} className="text-red-400 hover:text-red-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={u.upsell_type}
                  onChange={(e) => updateUpsell(idx, 'upsell_type', e.target.value)}
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded bg-white"
                >
                  <option value="cross_sell">Cross-sell</option>
                  <option value="upsell">Upsell</option>
                </select>
                <input
                  type="number"
                  value={u.discount_percentage}
                  onChange={(e) => updateUpsell(idx, 'discount_percentage', Number(e.target.value))}
                  placeholder="Discount %"
                  min="0"
                  max="100"
                  className="px-2 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
              <input
                type="text"
                value={u.title}
                onChange={(e) => updateUpsell(idx, 'title', e.target.value)}
                placeholder="Custom title (optional)"
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded mb-1"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={saveUpsells}
        disabled={savingUpsells}
        className="w-full mt-3 py-2 bg-gold text-deep-green rounded-lg text-xs font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
      >
        {savingUpsells ? 'Saving...' : 'Save Upsells'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EDITOR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function AdminStoreEditorPage() {
  // Core state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Multi-page support
  const [, setAllPages] = useState<Page[]>([]);
  const [activePageConfigIdx, setActivePageConfigIdx] = useState(0);
  const [productPages, setProductPages] = useState<PageConfig[]>([]);
  const allConfigs = [...ALL_PAGE_CONFIGS, ...productPages];
  const activePageConfig: PageConfig = allConfigs[activePageConfigIdx] || ALL_PAGE_CONFIGS[0];
  const activeSections: SectionSchema[] = activePageConfig.sections;

  // Data
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);

  // Editor state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});
  const [editValuesHy, setEditValuesHy] = useState<Record<string, unknown>>({});
  // Global admin-wide language toggle controls which language is being edited.
  const { editLang, setEditLang } = useAdminEditLang();
  const [hasChanges, setHasChanges] = useState(false);

  // All products for product_picker fields
  const [allProducts, setAllProducts] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    supabase.from('products').select('id, name').eq('status', 'active').order('name').then(({ data }) => {
      if (data) setAllProducts(data);
    });
  }, []);

  // Preview
  const [previewKey, setPreviewKey] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ─── Auto-clear messages ─────────────────────────────────────────────
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ─── Data Fetching ────────────────────────────────────────────────────
  const fetchAllPages = useCallback(async () => {
    try {
      const { data: pages } = await supabase.from('pages').select('*').order('created_at', { ascending: true });
      setAllPages(pages || []);
      return pages || [];
    } catch {
      return [];
    }
  }, []);

  const fetchPageSections = useCallback(async (pageSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      // Find the page by slug
      const slugWithSlash = pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`;
      const slugWithout = pageSlug.startsWith('/') ? pageSlug.slice(1) : pageSlug;

      let page: Page | null = null;
      if (pageSlug === '/' || pageSlug === 'home' || pageSlug === '') {
        const { data: pages } = await supabase.from('pages').select('*').or('slug.eq.home,slug.eq.homepage,slug.eq./,slug.eq.').limit(1);
        page = pages?.[0] || null;
        if (!page) {
          const { data: firstPage } = await supabase.from('pages').select('*').order('created_at', { ascending: true }).limit(1);
          page = firstPage?.[0] || null;
        }
      } else {
        const { data: pages } = await supabase.from('pages').select('*').or(`slug.eq.${slugWithSlash},slug.eq.${slugWithout}`).limit(1);
        page = pages?.[0] || null;
      }
      setCurrentPage(page);

      if (page) {
        const { data: sectionData, error: sectionsErr } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', page.id)
          .order('sort_order', { ascending: true });
        if (sectionsErr) throw sectionsErr;
        setSections(sectionData || []);
      } else {
        setSections([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load store data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch product list for product page editing
  const fetchProductPages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug')
        .eq('status', 'active')
        .order('name');
      if (data) {
        setProductPages(data.map(p => ({
          label: `Product: ${p.name}`,
          slug: `product-${p.slug}`,
          previewPath: `/products/${p.slug}`,
          indexKey: '_section_index',
          sections: PRODUCT_PAGE_SECTIONS,
        })));
      }
    } catch {
      // Silently fail — products just won't appear in dropdown
    }
  }, []);

  useEffect(() => {
    fetchAllPages();
    fetchProductPages();
    fetchPageSections(activePageConfig.slug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When page changes, refetch sections
  function handlePageChange(configIdx: number) {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
    }
    setActivePageConfigIdx(configIdx);
    setSelectedIndex(null);
    setEditValues({});
    setEditValuesHy({});
    setHasChanges(false);
    const configs = [...ALL_PAGE_CONFIGS, ...productPages];
    fetchPageSections(configs[configIdx]?.slug || '/');
    setPreviewKey(k => k + 1);
  }

  // ─── PostMessage from iframe ──────────────────────────────────────────
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'section-clicked') {
        handleSelectSection(e.data.index);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // ─── Section selection ────────────────────────────────────────────────
  function handleSelectSection(index: number) {
    if (hasChanges && selectedIndex !== null) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
    }

    setSelectedIndex(index);
    setHasChanges(false);

    // Load section data from Supabase if available, otherwise use defaults
    const sectionRecord = getSectionRecord(index);
    const schema = activeSections[index];

    const hyDefaults = buildHyDefaults(schema);
    if (sectionRecord) {
      const existing = sectionRecord.content as Record<string, unknown>;
      const hy = (existing?.hy as Record<string, unknown> | undefined) ?? {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hy: _omitHy, ...enOnly } = existing as Record<string, unknown>;
      setEditValues({ ...schema.defaultContent, ...enOnly });
      setEditValuesHy({ ...hyDefaults, ...hy });
    } else {
      setEditValues({ ...schema.defaultContent });
      setEditValuesHy({ ...hyDefaults });
    }

    // Tell iframe to highlight this section
    iframeRef.current?.contentWindow?.postMessage({ type: 'select-section', index }, '*');
  }

  function handleDeselectSection() {
    if (hasChanges) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
    }
    setSelectedIndex(null);
    setEditValues({});
    setEditValuesHy({});
    setHasChanges(false);
    iframeRef.current?.contentWindow?.postMessage({ type: 'deselect' }, '*');
  }

  // ─── Auto-translate empty HY fields when editor opens in HY mode ──────
  // For each translatable field where the admin hasn't saved Armenian yet
  // (and there's no static dictionary translation), fetch a machine
  // translation of the English default and pre-fill it. Admin sees Armenian
  // text to edit, not English.
  useEffect(() => {
    if (selectedIndex === null || editLang !== 'hy') return;
    const schema = activeSections[selectedIndex];
    if (!schema) return;
    let cancelled = false;
    (async () => {
      const updates: Record<string, string> = {};
      for (const f of schema.fields) {
        if (f.type !== 'text' && f.type !== 'textarea') continue;
        const existing = editValuesHy[f.key];
        if (typeof existing === 'string' && existing.length > 0) continue;
        if (f.i18nKey && dictionaries.hy[f.i18nKey]) continue;
        const en = editValues[f.key];
        if (typeof en !== 'string' || !en.trim()) continue;
        const tx = await memoTranslateHy(en);
        if (cancelled) return;
        if (tx) updates[f.key] = tx;
      }
      if (!cancelled && Object.keys(updates).length > 0) {
        setEditValuesHy(prev => ({ ...prev, ...updates }));
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, editLang, editValues]);

  // ─── Map section index to Supabase record ────────────────────────────
  function getSectionRecord(index: number): PageSection | null {
    const schema = activeSections[index];
    if (!schema) return null;
    const indexKey = activePageConfig.indexKey;
    // Try both the page-specific index key and fallback _homepage_index for legacy compat
    return sections.find(s => {
      const c = s.content as Record<string, unknown>;
      return c?.[indexKey] === index || c?._homepage_index === index || c?._section_index === index;
    }) || sections[index] || null;
  }

  // ─── Field change handler ─────────────────────────────────────────────
  // Writes to either the English store or the Armenian override store based on editLang.
  // Non-text fields (image, color, toggle, list, product_picker, url) always write to EN;
  // Armenian mode is only meaningful for text/textarea so those are the only ones swapped.
  function updateField(key: string, value: unknown) {
    if (editLang === 'hy') {
      setEditValuesHy(prev => ({ ...prev, [key]: value }));
    } else {
      setEditValues(prev => ({ ...prev, [key]: value }));
    }
    setHasChanges(true);
  }

  function getFieldValue(key: string, fieldType: string): unknown {
    // Only text-like fields use Armenian overrides; others always English store
    const translatable = fieldType === 'text' || fieldType === 'textarea';
    if (editLang === 'hy' && translatable) {
      const v = editValuesHy[key];
      if (v !== undefined && v !== null && v !== '') return v;
      // Static Armenian dictionary (when field has an i18nKey).
      const field = activeSections[selectedIndex ?? -1]?.fields.find(f => f.key === key);
      if (field?.i18nKey && dictionaries.hy[field.i18nKey]) return dictionaries.hy[field.i18nKey];
      // No HY value yet — return empty so the auto-translate effect can
      // populate it. The English source is shown via the placeholder so the
      // admin still has context for what they are translating.
      return '';
    }
    return editValues[key];
  }

  // ─── Ensure page exists (auto-create if needed) ───────────────────────
  async function ensurePageExists(slug: string): Promise<Page | null> {
    // Try to find existing page
    const { data: existing } = await supabase
      .from('pages')
      .select('*')
      .or(`slug.eq.${slug},slug.eq./${slug}`)
      .limit(1);
    if (existing?.[0]) return existing[0] as Page;

    // Create it
    const { data: created, error } = await supabase
      .from('pages')
      .insert([{
        title: activePageConfig.label,
        slug: slug,
        content: '{}',
        meta_title: activePageConfig.label,
        meta_description: '',
        status: 'published',
        template: 'default',
      }])
      .select()
      .single();
    if (error) throw error;
    return created as Page;
  }

  // ─── Save section ─────────────────────────────────────────────────────
  async function saveSection() {
    if (selectedIndex === null) return;
    setSaving(true);
    setError(null);

    try {
      let page = currentPage;
      if (!page) {
        page = await ensurePageExists(activePageConfig.slug);
        setCurrentPage(page);
      }

      const indexKey = activePageConfig.indexKey;
      // Strip empty Armenian values so we don't store "" blanks
      const hyClean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(editValuesHy)) {
        if (v !== undefined && v !== null && v !== '') hyClean[k] = v;
      }
      const contentToSave: Record<string, unknown> = {
        ...editValues,
        [indexKey]: selectedIndex,
      };
      if (Object.keys(hyClean).length > 0) {
        contentToSave.hy = hyClean;
      }
      // For homepage backward compat, also include _homepage_index
      if (indexKey !== '_homepage_index') {
        contentToSave._section_index = selectedIndex;
      }
      const schema = activeSections[selectedIndex];
      const existing = getSectionRecord(selectedIndex);

      if (existing) {
        const { error: err } = await supabase
          .from('page_sections')
          .update({ content: contentToSave })
          .eq('id', existing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('page_sections')
          .insert([{
            page_id: page!.id,
            section_type: schema.name,
            content: contentToSave,
            sort_order: selectedIndex,
            is_visible: true,
          }]);
        if (err) throw err;
      }

      // Refresh sections
      const { data } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page!.id)
        .order('sort_order', { ascending: true });
      setSections(data || []);

      setHasChanges(false);
      setSuccessMsg('Section saved');
      setPreviewKey(k => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    } finally {
      setSaving(false);
    }
  }

  // ─── Toggle visibility ────────────────────────────────────────────────
  async function toggleVisibility(index: number) {
    const record = getSectionRecord(index);
    if (!record) return;
    try {
      await supabase.from('page_sections').update({ is_visible: !record.is_visible }).eq('id', record.id);
      const { data } = await supabase.from('page_sections').select('*').eq('page_id', currentPage!.id).order('sort_order', { ascending: true });
      setSections(data || []);
      setPreviewKey(k => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Toggle failed');
    }
  }

  // ─── Loading state ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-deep-green border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading store editor...</p>
        </div>
      </div>
    );
  }

  const selectedSchema = selectedIndex !== null ? activeSections[selectedIndex] : null;

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', marginBottom: '-24px' }}>

      {/* ━━━ TOP BAR ━━━ */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-deep-green rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Online Store</h1>
              <p className="text-[10px] text-gray-400">{activePageConfig.label}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {(['mobile', 'tablet', 'desktop'] as PreviewDevice[]).map(device => (
              <button
                key={device}
                onClick={() => setPreviewDevice(device)}
                className={`p-1.5 rounded-md transition-all ${previewDevice === device ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                title={device === 'mobile' ? 'Mobile (390px)' : device === 'tablet' ? 'Tablet (768px)' : 'Desktop'}
              >
                {device === 'mobile' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                )}
                {device === 'tablet' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )}
                {device === 'desktop' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={() => setPreviewKey(k => k + 1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh preview">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          {/* View Store */}
          <a href={activePageConfig.previewPath} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View Store
          </a>
        </div>
      </div>

      {/* ━━━ NOTIFICATIONS ━━━ */}
      {(error || successMsg) && (
        <div className="flex-shrink-0 px-4 pt-2 z-10 absolute top-14 right-4 w-80">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 shadow-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2 shadow-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {successMsg}
            </div>
          )}
        </div>
      )}

      {/* ━━━ MAIN BODY ━━━ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ━━━ LEFT SIDEBAR ━━━ */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">

          {selectedIndex !== null && selectedSchema ? (
            /* ── SECTION SETTINGS PANEL ── */
            <div className="flex flex-col h-full">
              {/* Settings header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <button
                  onClick={handleDeselectSection}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <div className={`w-7 h-7 ${selectedSchema.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={selectedSchema.icon} />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900 truncate">{selectedSchema.name}</span>
              </div>

              {/* Language toggle for section content */}
              <div className="px-4 pt-3 pb-0 flex-shrink-0">
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setEditLang('en')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      editLang === 'en' ? 'bg-white text-deep-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => setEditLang('hy')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      editLang === 'hy' ? 'bg-white text-deep-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>🇦🇲</span>
                    <span>Հայերեն</span>
                  </button>
                </div>
                {editLang === 'hy' && (
                  <p className="mt-2 text-[11px] text-gray-500 leading-relaxed">
                    Editing Armenian translations. Only text fields are shown here — images, toggles and URLs are shared.
                    Placeholders show the English value.
                  </p>
                )}
              </div>

              {/* Settings fields */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {selectedSchema.fields.map(field => {
                  const value = getFieldValue(field.key, field.type);
                  const enValue = editValues[field.key];
                  // In Armenian mode, hide non-translatable fields to keep the UX focused
                  if (editLang === 'hy' && field.type !== 'text' && field.type !== 'textarea') return null;

                  if (field.type === 'image') {
                    return (
                      <ImageField
                        key={field.key}
                        label={field.label}
                        value={String(value || '')}
                        onChange={(url) => updateField(field.key, url)}
                      />
                    );
                  }

                  if (field.type === 'color') {
                    return (
                      <div key={field.key}>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{field.label}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={String(value || '#000000')}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={String(value || '')}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none font-mono"
                          />
                        </div>
                      </div>
                    );
                  }

                  if (field.type === 'toggle') {
                    return (
                      <div key={field.key}>
                        <div className="flex items-center justify-between">
                          <label className="text-[13px] font-medium text-gray-700">{field.label}</label>
                          <button
                            onClick={() => updateField(field.key, !value)}
                            className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-deep-green' : 'bg-gray-200'}`}
                          >
                            <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${value ? 'left-5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (field.type === 'number') {
                    return (
                      <div key={field.key}>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{field.label}</label>
                        <input
                          type="number"
                          value={String(value || '')}
                          onChange={(e) => updateField(field.key, Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none"
                        />
                      </div>
                    );
                  }

                  if (field.type === 'textarea') {
                    const hyPlaceholder = editLang === 'hy' && enValue ? String(enValue) : field.placeholder;
                    return (
                      <div key={field.key}>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                          <span>{field.label}</span>
                          {editLang === 'hy' && <span className="text-[10px] font-semibold text-deep-green/70 px-1.5 py-0.5 bg-deep-green/10 rounded">HY</span>}
                        </label>
                        <textarea
                          value={String(value || '')}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={hyPlaceholder}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none resize-y"
                        />
                      </div>
                    );
                  }

                  if (field.type === 'product_picker') {
                    const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
                    const toggle = (id: string) => {
                      const next = selected.includes(id)
                        ? selected.filter(s => s !== id)
                        : [...selected, id];
                      updateField(field.key, next);
                    };
                    return (
                      <div key={field.key}>
                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                          {field.label}
                          <span className="ml-1 text-gray-400 font-normal">({selected.length} selected)</span>
                        </label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                          {allProducts.length === 0 && (
                            <p className="px-3 py-2 text-xs text-gray-400">Loading products…</p>
                          )}
                          {allProducts.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => toggle(p.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${selected.includes(p.id) ? 'bg-deep-green/5' : 'hover:bg-gray-50'}`}
                            >
                              <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${selected.includes(p.id) ? 'bg-deep-green border-deep-green' : 'border-gray-300'}`}>
                                {selected.includes(p.id) && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                              <span className={selected.includes(p.id) ? 'font-medium text-deep-green' : 'text-gray-700'}>{p.name}</span>
                            </button>
                          ))}
                        </div>
                        {selected.length > 0 && (
                          <button
                            type="button"
                            onClick={() => updateField(field.key, [])}
                            className="mt-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Clear selection
                          </button>
                        )}
                      </div>
                    );
                  }

                  if (field.type === 'list') {
                    return (
                      <ListField
                        key={field.key}
                        field={field}
                        value={value}
                        updateField={updateField}
                      />
                    );
                  }

                  // text / url
                  const textHyPlaceholder = editLang === 'hy' && field.type === 'text' && enValue ? String(enValue) : field.placeholder;
                  return (
                    <div key={field.key}>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                        <span>{field.label}</span>
                        {editLang === 'hy' && field.type === 'text' && <span className="text-[10px] font-semibold text-deep-green/70 px-1.5 py-0.5 bg-deep-green/10 rounded">HY</span>}
                      </label>
                      <input
                        type={field.type === 'url' ? 'url' : 'text'}
                        value={String(value || '')}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={textHyPlaceholder}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none"
                      />
                    </div>
                  );
                })}

                {/* Inline Upsell Manager for Product Pages */}
                {selectedSchema.name === 'Upsells & Cross-sells' && activePageConfig.slug.startsWith('product-') && (
                  <UpsellManager productSlug={activePageConfig.slug.replace('product-', '')} />
                )}
              </div>

              {/* Settings footer */}
              <div className="border-t border-gray-200 px-4 py-3 flex-shrink-0 space-y-2">
                <button
                  onClick={saveSection}
                  disabled={saving || !hasChanges}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-deep-green text-white rounded-xl text-sm font-semibold hover:bg-deep-green/90 transition-colors disabled:opacity-50"
                >
                  {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {hasChanges ? 'Save changes' : 'No changes'}
                </button>
              </div>
            </div>
          ) : (
            /* ── SECTION LIST ── */
            <div className="flex flex-col h-full">
              {/* Page Selector */}
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Page</label>
                <select
                  value={activePageConfigIdx}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-full px-2.5 py-2 text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none cursor-pointer"
                >
                  <optgroup label="Pages">
                    {ALL_PAGE_CONFIGS.map((cfg, idx) => (
                      <option key={cfg.slug} value={idx}>{cfg.label}</option>
                    ))}
                  </optgroup>
                  {productPages.length > 0 && (
                    <optgroup label="Product Pages">
                      {productPages.map((cfg, idx) => (
                        <option key={cfg.slug} value={ALL_PAGE_CONFIGS.length + idx}>{cfg.label.replace('Product: ', '')}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
              {/* Sections Header */}
              <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sections</p>
              </div>

              {/* Section list */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
                {activeSections.map((schema, idx) => {
                  const record = getSectionRecord(idx);
                  const isHidden = record && !record.is_visible;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectSection(idx)}
                      className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all group border ${
                        selectedIndex === idx
                          ? 'bg-deep-green/5 border-deep-green/30'
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                      } ${isHidden ? 'opacity-40' : ''}`}
                    >
                      <div className={`w-7 h-7 ${schema.color} rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={schema.icon} />
                        </svg>
                      </div>
                      <span className="text-[13px] font-medium text-gray-700 truncate flex-1">{schema.name}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleVisibility(idx); }}
                          className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                          title={isHidden ? 'Show' : 'Hide'}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {isHidden
                              ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                            }
                          </svg>
                        </button>
                        <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

        {/* ━━━ RIGHT PANEL: LIVE PREVIEW ━━━ */}
        <div className="flex-1 bg-[#e8e8e8] flex flex-col overflow-hidden">
          {/* Device size label */}
          <div className="flex-shrink-0 flex items-center justify-center py-1.5 bg-[#d4d4d4] border-b border-[#c0c0c0]">
            <span className="text-[11px] font-medium text-gray-500">
              {previewDevice === 'mobile' && '390px — Mobile'}
              {previewDevice === 'tablet' && '768px — Tablet'}
              {previewDevice === 'desktop' && 'Full Width — Desktop'}
            </span>
          </div>

          {/* iframe container */}
          <div className="flex-1 overflow-auto flex justify-center items-start p-4">
            <div
              className="bg-white shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: previewDevice === 'mobile' ? 390 : previewDevice === 'tablet' ? 768 : '100%',
                minHeight: '100%',
                borderRadius: previewDevice !== 'desktop' ? 16 : 0,
                border: previewDevice !== 'desktop' ? '8px solid #1a1a1a' : 'none',
              }}
            >
              <iframe
                ref={iframeRef}
                key={`${previewKey}-${editLang}`}
                src={`${activePageConfig.previewPath}${activePageConfig.previewPath.includes('?') ? '&' : '?'}editor=true&lang=${editLang}`}
                className="w-full border-0 block"
                style={{ height: 'calc(100vh - 120px)', minHeight: 500 }}
                title="Live Store Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
