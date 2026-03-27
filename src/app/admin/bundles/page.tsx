'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[] | null;
}

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  discount_percentage: number;
  total_price: number;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  products?: BundleProduct[];
}

interface BundleProduct {
  id: string;
  bundle_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

type BundleFormData = {
  name: string;
  description: string;
  image_url: string | null;
  discount_percentage: number;
  total_price: number;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  selectedProducts: { product_id: string; quantity: number }[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMPTY_FORM: BundleFormData = {
  name: '',
  description: '',
  image_url: null,
  discount_percentage: 0,
  total_price: 0,
  compare_at_price: null,
  is_active: true,
  is_featured: false,
  sort_order: 0,
  selectedProducts: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function BundlesAdminPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState<BundleFormData>(EMPTY_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch bundles and products
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch bundles with their products
      const { data: bundleData } = await supabase
        .from('bundles')
        .select(`
          *,
          bundle_products (
            id,
            bundle_id,
            product_id,
            quantity,
            product:products (id, name, slug, price, images)
          )
        `)
        .order('sort_order', { ascending: true });
      
      if (bundleData) {
        const formattedBundles = bundleData.map(bundle => ({
          ...bundle,
          products: bundle.bundle_products?.map((bp: { id: string; bundle_id: string; product_id: string; quantity: number; product: Product }) => ({
            id: bp.id,
            bundle_id: bp.bundle_id,
            product_id: bp.product_id,
            quantity: bp.quantity,
            product: bp.product
          })) || []
        }));
        setBundles(formattedBundles as Bundle[]);
      }

      // Fetch all active products
      const { data: productData } = await supabase
        .from('products')
        .select('id, name, slug, price, images')
        .eq('status', 'active')
        .order('name');
      
      if (productData) setProducts(productData as Product[]);
      
      setLoading(false);
    }
    
    fetchData();
  }, []);

  // Calculate total price based on selected products and discount
  const calculateTotals = useCallback((selectedProducts: { product_id: string; quantity: number }[], discount: number) => {
    const total = selectedProducts.reduce((sum, sp) => {
      const product = products.find(p => p.id === sp.product_id);
      return sum + (product?.price || 0) * sp.quantity;
    }, 0);
    
    const discountedTotal = total * (1 - discount / 100);
    
    return {
      compare_at_price: total > 0 ? total : null,
      total_price: discountedTotal
    };
  }, [products]);

  // Handle image upload
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `bundle-${Date.now()}.${fileExt}`;
    const filePath = `bundles/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      setUploadingImage(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, image_url: urlData.publicUrl }));
    setUploadingImage(false);
  }

  // Open modal for creating/editing
  function openModal(bundle?: Bundle) {
    if (bundle) {
      setEditingBundle(bundle);
      setFormData({
        name: bundle.name,
        description: bundle.description || '',
        image_url: bundle.image_url,
        discount_percentage: bundle.discount_percentage,
        total_price: bundle.total_price,
        compare_at_price: bundle.compare_at_price,
        is_active: bundle.is_active,
        is_featured: bundle.is_featured,
        sort_order: bundle.sort_order,
        selectedProducts: bundle.products?.map(p => ({ 
          product_id: p.product_id, 
          quantity: p.quantity 
        })) || [],
      });
    } else {
      setEditingBundle(null);
      setFormData(EMPTY_FORM);
    }
    setShowModal(true);
  }

  // Close modal
  function closeModal() {
    setShowModal(false);
    setEditingBundle(null);
    setFormData(EMPTY_FORM);
  }

  // Add product to bundle
  function addProductToBundle(productId: string) {
    if (formData.selectedProducts.find(sp => sp.product_id === productId)) return;
    
    setFormData(prev => {
      const newSelected = [...prev.selectedProducts, { product_id: productId, quantity: 1 }];
      const totals = calculateTotals(newSelected, prev.discount_percentage);
      return {
        ...prev,
        selectedProducts: newSelected,
        ...totals
      };
    });
  }

  // Remove product from bundle
  function removeProductFromBundle(productId: string) {
    setFormData(prev => {
      const newSelected = prev.selectedProducts.filter(sp => sp.product_id !== productId);
      const totals = calculateTotals(newSelected, prev.discount_percentage);
      return {
        ...prev,
        selectedProducts: newSelected,
        ...totals
      };
    });
  }

  // Update product quantity
  function updateProductQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    
    setFormData(prev => {
      const newSelected = prev.selectedProducts.map(sp => 
        sp.product_id === productId ? { ...sp, quantity } : sp
      );
      const totals = calculateTotals(newSelected, prev.discount_percentage);
      return {
        ...prev,
        selectedProducts: newSelected,
        ...totals
      };
    });
  }

  // Update discount
  function updateDiscount(discount: number) {
    setFormData(prev => {
      const totals = calculateTotals(prev.selectedProducts, discount);
      return {
        ...prev,
        discount_percentage: discount,
        ...totals
      };
    });
  }

  // Save bundle
  async function saveBundle() {
    if (!formData.name || formData.selectedProducts.length === 0) {
      alert('Please enter a bundle name and select at least one product');
      return;
    }

    const bundleData = {
      name: formData.name,
      description: formData.description || null,
      image_url: formData.image_url,
      discount_percentage: formData.discount_percentage,
      total_price: formData.total_price,
      compare_at_price: formData.compare_at_price,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      sort_order: formData.sort_order,
    };

    if (editingBundle) {
      // Update existing bundle
      const { error } = await supabase
        .from('bundles')
        .update(bundleData)
        .eq('id', editingBundle.id);

      if (error) {
        alert('Error updating bundle: ' + error.message);
        return;
      }

      // Delete existing bundle products
      await supabase
        .from('bundle_products')
        .delete()
        .eq('bundle_id', editingBundle.id);

      // Insert new bundle products
      const { error: bpError } = await supabase
        .from('bundle_products')
        .insert(
          formData.selectedProducts.map(sp => ({
            bundle_id: editingBundle.id,
            product_id: sp.product_id,
            quantity: sp.quantity
          }))
        );

      if (bpError) {
        alert('Error adding products to bundle: ' + bpError.message);
        return;
      }
    } else {
      // Create new bundle
      const { data: newBundle, error } = await supabase
        .from('bundles')
        .insert(bundleData)
        .select()
        .single();

      if (error || !newBundle) {
        alert('Error creating bundle: ' + error?.message);
        return;
      }

      // Insert bundle products
      const { error: bpError } = await supabase
        .from('bundle_products')
        .insert(
          formData.selectedProducts.map(sp => ({
            bundle_id: newBundle.id,
            product_id: sp.product_id,
            quantity: sp.quantity
          }))
        );

      if (bpError) {
        alert('Error adding products to bundle: ' + bpError.message);
        return;
      }
    }

    closeModal();
    window.location.reload();
  }

  // Delete bundle
  async function deleteBundle(id: string) {
    if (!confirm('Are you sure you want to delete this bundle?')) return;

    // Delete bundle products first
    await supabase.from('bundle_products').delete().eq('bundle_id', id);

    // Delete bundle
    const { error } = await supabase.from('bundles').delete().eq('id', id);

    if (error) {
      alert('Error deleting bundle: ' + error.message);
      return;
    }

    setBundles(prev => prev.filter(b => b.id !== id));
  }

  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !formData.selectedProducts.find(sp => sp.product_id === p.id)
  );

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-green">Bundles</h1>
            <p className="text-deep-green/60 mt-1">Create and manage product bundles</p>
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
              + Create Bundle
            </button>
          </div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map(bundle => (
            <div 
              key={bundle.id} 
              className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${
                bundle.is_active ? 'border-green-200' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Bundle Image */}
              <div className="aspect-video bg-gray-100 relative">
                {bundle.image_url ? (
                  <img 
                    src={bundle.image_url} 
                    alt={bundle.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {bundle.is_featured && (
                  <span className="absolute top-2 right-2 bg-gold text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Bundle Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-deep-green line-clamp-1">{bundle.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bundle.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {bundle.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {bundle.description || 'No description'}
                </p>

                {/* Products in bundle */}
                <div className="text-sm text-deep-green/70 mb-3">
                  {bundle.products?.length || 0} products
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-deep-green">
                    {formatPrice(bundle.total_price)}
                  </span>
                  {bundle.compare_at_price && bundle.compare_at_price > bundle.total_price && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(bundle.compare_at_price)}
                      </span>
                      <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full">
                        Save {bundle.discount_percentage}%
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(bundle)}
                    className="flex-1 px-3 py-2 text-sm bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBundle(bundle.id)}
                    className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bundles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-deep-green mb-1">No bundles yet</h3>
            <p className="text-deep-green/60 mb-4">Create your first bundle to get started</p>
            <button
              onClick={() => openModal()}
              className="px-6 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition"
            >
              Create Bundle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-deep-green">
                {editingBundle ? 'Edit Bundle' : 'Create Bundle'}
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
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-green mb-1">Bundle Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                    placeholder="e.g., Complete Nutrition Pack"
                  />
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
              </div>

              <div>
                <label className="block text-sm font-medium text-deep-green mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  rows={3}
                  placeholder="Describe what's included in this bundle..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-deep-green mb-1">Bundle Image</label>
                <div className="flex items-center gap-4">
                  {formData.image_url && (
                    <img 
                      src={formData.image_url} 
                      alt="Bundle" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-deep-green/30 transition text-center">
                    <span className="text-sm text-gray-500">
                      {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.image_url && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, image_url: null }))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Product Selection */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-deep-green mb-4">Select Products *</h3>
                
                {/* Search */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                />

                {/* Available Products */}
                {searchQuery && (
                  <div className="mb-4 max-h-48 overflow-y-auto border rounded-lg">
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => addProductToBundle(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop'} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-deep-green">{product.name}</p>
                          <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                        </div>
                        <span className="text-deep-green text-lg">+</span>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="p-3 text-sm text-gray-500">No products found</p>
                    )}
                  </div>
                )}

                {/* Selected Products */}
                <div className="space-y-3">
                  {formData.selectedProducts.map(sp => {
                    const product = products.find(p => p.id === sp.product_id);
                    if (!product) return null;
                    return (
                      <div key={sp.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-deep-green">{product.name}</p>
                          <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={sp.quantity}
                            onChange={e => updateProductQuantity(sp.product_id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                          />
                          <button
                            onClick={() => removeProductFromBundle(sp.product_id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {formData.selectedProducts.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Search and select products to add to this bundle
                  </p>
                )}
              </div>

              {/* Pricing & Settings */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-deep-green mb-4">Pricing & Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1">Discount %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={e => updateDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1">Original Price</label>
                    <input
                      type="text"
                      value={formData.compare_at_price ? formatPrice(formData.compare_at_price) : '-'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1">Bundle Price</label>
                    <input
                      type="text"
                      value={formatPrice(formData.total_price)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-deep-green rounded focus:ring-deep-green"
                    />
                    <span className="text-sm text-deep-green">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 text-deep-green rounded focus:ring-deep-green"
                    />
                    <span className="text-sm text-deep-green">Featured</span>
                  </label>
                </div>
              </div>
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
                onClick={saveBundle}
                className="px-6 py-2 bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition"
              >
                {editingBundle ? 'Save Changes' : 'Create Bundle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
