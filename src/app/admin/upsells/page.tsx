'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminEditLang } from '@/lib/i18n/AdminEditLang';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[] | null;
  short_description: string | null;
}

interface Upsell {
  id: string;
  source_product_id: string;
  target_product_id: string;
  upsell_type: 'upsell' | 'cross_sell';
  title: string | null;
  description: string | null;
  discount_percentage: number;
  is_active: boolean;
  sort_order: number;
  source_product: Product;
  target_product: Product;
  i18n?: { hy?: { title?: string; description?: string } } | null;
  created_at: string;
}

type UpsellFormData = {
  source_product_id: string;
  target_product_id: string;
  upsell_type: 'upsell' | 'cross_sell';
  title: string;
  description: string;
  discount_percentage: number;
  is_active: boolean;
  sort_order: number;
  i18n: { hy?: { title?: string; description?: string } } | null;
};

type Toast = { type: 'success' | 'error'; message: string } | null;

const EMPTY_FORM: UpsellFormData = {
  source_product_id: '',
  target_product_id: '',
  upsell_type: 'cross_sell',
  title: '',
  description: '',
  discount_percentage: 0,
  is_active: true,
  sort_order: 0,
  i18n: null,
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}

export default function UpsellsAdminPage() {
  const [upsells, setUpsells] = useState<Upsell[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUpsell, setEditingUpsell] = useState<Upsell | null>(null);
  const [formData, setFormData] = useState<UpsellFormData>(EMPTY_FORM);
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const { editLang } = useAdminEditLang();

  // Helper: read a translatable field based on editLang
  function getLocField(key: 'title' | 'description'): string {
    if (editLang === 'hy') {
      return (formData.i18n as { hy?: Record<string, string> } | null)?.hy?.[key] ?? '';
    }
    return (formData[key] as string) ?? '';
  }

  // Helper: write a translatable field into EN column or i18n.hy.field
  function setLocField(key: 'title' | 'description', value: string) {
    if (editLang === 'hy') {
      setFormData((prev) => {
        const i18n = (prev.i18n as { hy?: Record<string, string> } | null) ?? {};
        const hy = { ...(i18n.hy ?? {}) };
        if (value && value.length > 0) hy[key] = value;
        else delete hy[key];
        return { ...prev, i18n: { ...i18n, hy } } as UpsellFormData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [key]: value } as UpsellFormData));
    }
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: upsellData } = await supabase
      .from('upsells')
      .select(`
        *,
        source_product:products!source_product_id (id, name, slug, price, images, short_description),
        target_product:products!target_product_id (id, name, slug, price, images, short_description)
      `)
      .order('sort_order', { ascending: true });

    if (upsellData) setUpsells(upsellData as Upsell[]);

    const { data: productData } = await supabase
      .from('products')
      .select('id, name, slug, price, images, short_description')
      .eq('status', 'active')
      .order('name');

    if (productData) setProducts(productData as Product[]);
    setLoading(false);
  }

  function openModal(upsell?: Upsell) {
    setFormError(null);
    if (upsell) {
      setEditingUpsell(upsell);
      setFormData({
        source_product_id: upsell.source_product_id,
        target_product_id: upsell.target_product_id,
        upsell_type: upsell.upsell_type,
        title: upsell.title || '',
        description: upsell.description || '',
        discount_percentage: upsell.discount_percentage,
        is_active: upsell.is_active,
        sort_order: upsell.sort_order,
        i18n: upsell.i18n ?? null,
      });
    } else {
      setEditingUpsell(null);
      setFormData(EMPTY_FORM);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingUpsell(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  }

  async function saveUpsell() {
    if (!formData.source_product_id || !formData.target_product_id) {
      setFormError('Please select both source and target products.');
      return;
    }
    if (formData.source_product_id === formData.target_product_id) {
      setFormError('Source and target products must be different.');
      return;
    }

    // Duplicate check
    const isDuplicate = upsells.some(
      u =>
        u.source_product_id === formData.source_product_id &&
        u.target_product_id === formData.target_product_id &&
        u.upsell_type === formData.upsell_type &&
        (!editingUpsell || u.id !== editingUpsell.id)
    );
    if (isDuplicate) {
      setFormError('Duplicate entry — this source → target combination already exists for this type.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload: Record<string, unknown> = {
      source_product_id: formData.source_product_id,
      target_product_id: formData.target_product_id,
      upsell_type: formData.upsell_type,
      title: formData.title || null,
      description: formData.description || null,
      discount_percentage: formData.discount_percentage,
      is_active: formData.is_active,
      sort_order: formData.sort_order,
    };
    if (formData.i18n && Object.keys(formData.i18n).length > 0) {
      payload.i18n = formData.i18n;
    }

    if (editingUpsell) {
      const { data, error } = await supabase
        .from('upsells')
        .update(payload)
        .eq('id', editingUpsell.id)
        .select(`
          *,
          source_product:products!source_product_id (id, name, slug, price, images, short_description),
          target_product:products!target_product_id (id, name, slug, price, images, short_description)
        `)
        .single();

      if (error) {
        setFormError('Failed to update: ' + error.message);
        setSaving(false);
        return;
      }
      setUpsells(prev => prev.map(u => (u.id === editingUpsell.id ? (data as Upsell) : u)));
      showToast('success', 'Upsell updated successfully.');
    } else {
      const { data, error } = await supabase
        .from('upsells')
        .insert(payload)
        .select(`
          *,
          source_product:products!source_product_id (id, name, slug, price, images, short_description),
          target_product:products!target_product_id (id, name, slug, price, images, short_description)
        `)
        .single();

      if (error) {
        setFormError('Failed to create: ' + error.message);
        setSaving(false);
        return;
      }
      setUpsells(prev => [...prev, data as Upsell].sort((a, b) => a.sort_order - b.sort_order));
      showToast('success', 'Upsell created successfully.');
    }

    setSaving(false);
    closeModal();
  }

  async function deleteUpsell(id: string) {
    const { error } = await supabase.from('upsells').delete().eq('id', id);
    if (error) {
      showToast('error', 'Failed to delete: ' + error.message);
      return;
    }
    setUpsells(prev => prev.filter(u => u.id !== id));
    showToast('success', 'Upsell deleted.');
  }

  const filteredUpsells = upsells.filter(u => {
    if (!filterProduct) return true;
    return u.source_product_id === filterProduct;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-green">Upsells & Cross-sells</h1>
            <p className="text-deep-green/60 mt-1">Configure product recommendations and upgrades</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-deep-green hover:text-deep-green/70 transition"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => openModal()}
              className="px-6 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition"
            >
              + Add Upsell
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-deep-green">Filter by source product:</label>
          <select
            value={filterProduct}
            onChange={e => setFilterProduct(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
          >
            <option value="">All Products</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Upsells Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-deep-green">Source Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-deep-green">Recommendation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-deep-green">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-deep-green">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-deep-green">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-deep-green">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUpsells.map(upsell => (
                <tr key={upsell.id} className={upsell.is_active ? '' : 'opacity-60'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={upsell.source_product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop'}
                        alt={upsell.source_product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span className="text-sm text-deep-green font-medium">{upsell.source_product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={upsell.target_product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop'}
                        alt={upsell.target_product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm text-deep-green font-medium">{upsell.target_product.name}</p>
                        <p className="text-xs text-gray-500">{formatPrice(upsell.target_product.price)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      upsell.upsell_type === 'upsell'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {upsell.upsell_type === 'upsell' ? 'Upsell' : 'Cross-sell'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {upsell.discount_percentage > 0 ? (
                      <span className="text-sm font-medium text-gold">{upsell.discount_percentage}% off</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      upsell.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {upsell.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(upsell)}
                        className="p-2 text-deep-green hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteUpsell(upsell.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUpsells.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-deep-green mb-1">No upsells configured</h3>
              <p className="text-deep-green/60 mb-4">Add your first upsell or cross-sell recommendation</p>
              <button
                onClick={() => openModal()}
                className="px-6 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition"
              >
                Add Upsell
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-deep-green">
                {editingUpsell ? 'Edit Upsell' : 'Create Upsell'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Inline error */}
              {formError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}

              {/* Product Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-green mb-1">Source Product *</label>
                  <select
                    value={formData.source_product_id}
                    onChange={e => { setFormError(null); setFormData(prev => ({ ...prev, source_product_id: e.target.value })); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  >
                    <option value="">Select product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Product page where this will be shown</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-green mb-1">Target Product *</label>
                  <select
                    value={formData.target_product_id}
                    onChange={e => { setFormError(null); setFormData(prev => ({ ...prev, target_product_id: e.target.value })); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  >
                    <option value="">Select product...</option>
                    {products
                      .filter(p => p.id !== formData.source_product_id)
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Product being recommended</p>
                </div>
              </div>

              {/* Upsell Type */}
              <div>
                <label className="block text-sm font-medium text-deep-green mb-2">Recommendation Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="upsell_type"
                      value="cross_sell"
                      checked={formData.upsell_type === 'cross_sell'}
                      onChange={e => setFormData(prev => ({ ...prev, upsell_type: e.target.value as 'cross_sell' }))}
                      className="w-4 h-4 text-deep-green"
                    />
                    <span className="text-sm text-deep-green">Cross-sell (Perfect Pairings)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="upsell_type"
                      value="upsell"
                      checked={formData.upsell_type === 'upsell'}
                      onChange={e => setFormData(prev => ({ ...prev, upsell_type: e.target.value as 'upsell' }))}
                      className="w-4 h-4 text-deep-green"
                    />
                    <span className="text-sm text-deep-green">Upsell (Upgrade)</span>
                  </label>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-sm font-medium text-deep-green mb-1 flex items-center gap-2">
                  <span>Custom Title (optional)</span>
                  {editLang === 'hy' && <span className="text-[10px] font-semibold text-deep-green/70 px-1.5 py-0.5 bg-deep-green/10 rounded">HY</span>}
                </label>
                <input
                  type="text"
                  value={getLocField('title')}
                  onChange={e => setLocField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  placeholder={editLang === 'hy' ? (formData.title || 'e.g., Upgrade to Premium or Perfect Pairing') : 'e.g., Upgrade to Premium or Perfect Pairing'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-green mb-1 flex items-center gap-2">
                  <span>Custom Description (optional)</span>
                  {editLang === 'hy' && <span className="text-[10px] font-semibold text-deep-green/70 px-1.5 py-0.5 bg-deep-green/10 rounded">HY</span>}
                </label>
                <textarea
                  value={getLocField('description')}
                  onChange={e => setLocField('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  rows={2}
                  placeholder={editLang === 'hy' ? (formData.description || 'Why customers should consider this...') : 'Why customers should consider this...'}
                />
              </div>

              {/* Pricing & Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-green mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={e => setFormData(prev => ({ ...prev, discount_percentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  />
                  <p className="text-xs text-gray-500 mt-1">Applied to target product</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-green mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={e => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-deep-green rounded focus:ring-deep-green"
                    />
                    <span className="text-sm text-deep-green">Active</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              {formData.source_product_id && formData.target_product_id && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-deep-green mb-3">Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">
                      On <strong>{products.find(p => p.id === formData.source_product_id)?.name}</strong> page:
                    </p>
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg">
                      <img
                        src={products.find(p => p.id === formData.target_product_id)?.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop'}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-deep-green">
                          {formData.title || (formData.upsell_type === 'upsell' ? 'Upgrade Your Order' : 'Perfect Pairings')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.description || products.find(p => p.id === formData.target_product_id)?.short_description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-deep-green">
                            {formatPrice(products.find(p => p.id === formData.target_product_id)?.price || 0)}
                          </span>
                          {formData.discount_percentage > 0 && (
                            <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">
                              Save {formData.discount_percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 text-deep-green hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveUpsell}
                disabled={saving}
                className="px-6 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {editingUpsell ? 'Save Changes' : 'Create Upsell'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
