'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  title: string | null;
  review_text: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  product?: { name: string; slug: string; images: string[] | null };
}

interface ProductOption {
  id: string;
  name: string;
  slug: string;
  review_rating_override: number | null;
  review_count_override: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, title: '', review_text: '', reviewer_name: '', is_verified: false });
  const [editingProduct, setEditingProduct] = useState<ProductOption | null>(null);
  const [overrideForm, setOverrideForm] = useState({ rating: '', count: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [tab, setTab] = useState<'reviews' | 'product-settings'>('reviews');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    // Use raw query to bypass RLS (admin needs all reviews)
    let query = supabase.from('product_reviews').select('*, product:products(name, slug, images)');
    if (filter !== 'all') query = query.eq('status', filter);
    if (productFilter !== 'all') query = query.eq('product_id', productFilter);
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching reviews:', error);
      // Fallback: try without join
      const { data: fallback } = await supabase.from('product_reviews').select('*').order('created_at', { ascending: false });
      setReviews((fallback || []) as Review[]);
    } else {
      setReviews((data || []) as Review[]);
    }
    setLoading(false);
  }, [filter, productFilter]);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('id, name, slug, review_rating_override, review_count_override').order('name');
    if (data) setProducts(data as ProductOption[]);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('product_reviews').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { showToast('Failed to update status', 'error'); return; }
    showToast(`Review ${status}`);
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    const { error } = await supabase.from('product_reviews').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }
    showToast('Review deleted');
    fetchReviews();
  };

  const openEdit = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title || '',
      review_text: review.review_text,
      reviewer_name: review.reviewer_name,
      is_verified: review.is_verified,
    });
  };

  const saveEdit = async () => {
    if (!editingReview) return;
    const { error } = await supabase.from('product_reviews').update({
      rating: editForm.rating,
      title: editForm.title || null,
      review_text: editForm.review_text,
      reviewer_name: editForm.reviewer_name,
      is_verified: editForm.is_verified,
      updated_at: new Date().toISOString(),
    }).eq('id', editingReview.id);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast('Review updated');
    setEditingReview(null);
    fetchReviews();
  };

  const openProductOverride = (product: ProductOption) => {
    setEditingProduct(product);
    setOverrideForm({
      rating: product.review_rating_override?.toString() || '',
      count: product.review_count_override?.toString() || '',
    });
  };

  const saveProductOverride = async () => {
    if (!editingProduct) return;
    const rating = overrideForm.rating ? parseFloat(overrideForm.rating) : null;
    const count = overrideForm.count ? parseInt(overrideForm.count) : null;
    const { error } = await supabase.from('products').update({
      review_rating_override: rating,
      review_count_override: count,
    }).eq('id', editingProduct.id);
    if (error) { showToast('Failed to save', 'error'); return; }
    showToast('Product review settings updated');
    setEditingProduct(null);
    fetchProducts();
  };

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <div className="relative max-w-3xl max-h-[80vh]">
            <img src={lightboxImg} alt="Review" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button onClick={() => setLightboxImg(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer reviews and product rating settings
            {pendingCount > 0 && <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">{pendingCount} pending</span>}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setTab('reviews')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'reviews' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
          Reviews {pendingCount > 0 && <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
        </button>
        <button onClick={() => setTab('product-settings')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'product-settings' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
          Product Rating Settings
        </button>
      </div>

      {/* ===== REVIEWS TAB ===== */}
      {tab === 'reviews' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">All products</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-deep-green border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <p className="text-gray-500 text-sm">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Top row: name, product, status */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{review.reviewer_name}</span>
                        {review.is_verified && (
                          <span className="text-xs text-green-600 flex items-center gap-0.5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[review.status]}`}>{review.status}</span>
                        {review.product && (
                          <span className="text-xs text-gray-400">on <span className="font-medium text-gray-600">{review.product.name}</span></span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Title & text */}
                      {review.title && <p className="font-medium text-gray-800 text-sm mb-0.5">{review.title}</p>}
                      <p className="text-sm text-gray-600 leading-relaxed">{review.review_text}</p>

                      {/* Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img, i) => (
                            <button key={i} onClick={() => setLightboxImg(img)} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition flex-shrink-0">
                              <Image src={img} alt={`Review image ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Date & email */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{new Date(review.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        {review.reviewer_email && <span>{review.reviewer_email}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {review.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(review.id, 'approved')} className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition" title="Approve">
                            Approve
                          </button>
                          <button onClick={() => updateStatus(review.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition" title="Reject">
                            Reject
                          </button>
                        </>
                      )}
                      {review.status === 'approved' && (
                        <button onClick={() => updateStatus(review.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition">
                          Reject
                        </button>
                      )}
                      {review.status === 'rejected' && (
                        <button onClick={() => updateStatus(review.id, 'approved')} className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition">
                          Approve
                        </button>
                      )}
                      <button onClick={() => openEdit(review)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => deleteReview(review.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== PRODUCT RATING SETTINGS TAB ===== */}
      {tab === 'product-settings' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Override the displayed star rating and review count per product. Leave blank to use actual review data.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3 font-medium text-gray-500">Product</th>
                <th className="px-5 py-3 font-medium text-gray-500">Actual Reviews</th>
                <th className="px-5 py-3 font-medium text-gray-500">Override Rating</th>
                <th className="px-5 py-3 font-medium text-gray-500">Override Count</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const productReviews = reviews.filter(r => r.product_id === product.id && r.status === 'approved');
                const actualAvg = productReviews.length > 0
                  ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
                  : '—';
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {productReviews.length > 0 ? (
                        <span>{actualAvg} avg / {productReviews.length} reviews</span>
                      ) : (
                        <span className="text-gray-400">No reviews</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {product.review_rating_override != null ? (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.review_rating_override!) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">{product.review_rating_override}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Auto</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {product.review_count_override != null ? (
                        <span className="text-gray-700">{product.review_count_override}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Auto</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openProductOverride(product)} className="px-3 py-1.5 text-xs font-medium text-deep-green border border-deep-green/20 rounded-lg hover:bg-deep-green hover:text-white transition">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== EDIT REVIEW MODAL ===== */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingReview(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
                <input value={editForm.reviewer_name} onChange={e => setEditForm({ ...editForm, reviewer_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setEditForm({ ...editForm, rating: star })}>
                      <svg className={`w-7 h-7 ${star <= editForm.rating ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-300 transition`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                <textarea value={editForm.review_text} onChange={e => setEditForm({ ...editForm, review_text: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editForm.is_verified} onChange={e => setEditForm({ ...editForm, is_verified: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Verified purchase</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditingReview(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green/90 transition">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PRODUCT OVERRIDE MODAL ===== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rating Settings</h3>
            <p className="text-sm text-gray-500 mb-4">{editingProduct.name}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Rating (1.0 - 5.0)</label>
                <input type="number" step="0.1" min="1" max="5" value={overrideForm.rating} onChange={e => setOverrideForm({ ...overrideForm, rating: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Leave blank for auto" />
                <p className="text-xs text-gray-400 mt-1">Overrides the calculated average from actual reviews</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Review Count</label>
                <input type="number" min="0" value={overrideForm.count} onChange={e => setOverrideForm({ ...overrideForm, count: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Leave blank for auto" />
                <p className="text-xs text-gray-400 mt-1">Overrides the actual count of approved reviews</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={saveProductOverride} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green/90 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
