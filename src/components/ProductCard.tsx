'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { recordProductView } from '@/lib/product-history';
import { useT } from '@/lib/i18n/LangProvider';
import { localize } from '@/lib/i18n/localizeRecord';

// Per-session memo for machine translations so each EN string only hits the API once.
const __cardTranslationCache = new Map<string, string>();
async function memoTranslate(text: string): Promise<string | null> {
  if (!text) return null;
  const cached = __cardTranslationCache.get(text);
  if (cached) return cached;
  try {
    const r = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, target: 'hy' }),
    });
    const j = (await r.json()) as { translated?: string };
    if (r.ok && j.translated) { __cardTranslationCache.set(text, j.translated); return j.translated; }
  } catch { /* noop */ }
  return null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[] | null;
  status: string;
  review_rating_override?: number | null;
  review_count_override?: number | null;
  i18n?: { hy?: { name?: string; short_description?: string; description?: string } } | null;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useT();
  const [imgError, setImgError] = useState(false);
  const savedHyName = product.i18n?.hy?.name;
  const savedHyShort = product.i18n?.hy?.short_description;
  const [autoName, setAutoName] = useState<string | null>(null);
  const [autoShort, setAutoShort] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (lang === 'hy') {
      if (!savedHyName && product.name) memoTranslate(product.name).then(tx => { if (!cancelled && tx) setAutoName(tx); });
      if (!savedHyShort && product.short_description) memoTranslate(product.short_description).then(tx => { if (!cancelled && tx) setAutoShort(tx); });
    } else {
      setAutoName(null); setAutoShort(null);
    }
    return () => { cancelled = true; };
  }, [lang, product.name, product.short_description, savedHyName, savedHyShort]);
  // Extract valid Armenian text: if the string has Armenian chars but starts with Latin (partial translate), strip the Latin prefix
  const hyVal = (s?: string | null): string | null => {
    if (!s) return null;
    if (/[Ա-֏]/.test(s)) {
      if (/^[^a-zA-Z]*[Ա-֏]/.test(s.trimStart())) return s; // already starts with Armenian
      const m = s.match(/[Ա-֏].*/); // strip Latin prefix, keep from first Armenian char
      return m ? m[0].trim() : null;
    }
    return null; // no Armenian chars at all (e.g. English text saved in hy field)
  };
  const displayName = lang === 'hy' ? (hyVal(savedHyName) || hyVal(autoName) || product.name) : product.name;
  const displayShort = lang === 'hy'
    ? (hyVal(savedHyShort) || hyVal(autoShort) || '')
    : (product.short_description || '');
  void localize;
  const [isAdding, setIsAdding] = useState(false);
  const [reviewStats, setReviewStats] = useState<{ avg: number; count: number } | null>(null);
  const { addItem } = useCart();
  const { user } = useAuth();

  function handleProductClick() {
    if (user?.id) recordProductView(user.id, product.id);
  }

  useEffect(() => {
    async function fetchReviewStats() {
      const { data } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', product.id)
        .eq('status', 'approved');
      if (data && data.length > 0) {
        const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
        setReviewStats({ avg, count: data.length });
      } else {
        setReviewStats({ avg: 0, count: 0 });
      }
    }
    fetchReviewStats();
  }, [product.id]);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const hasImage = product.images?.[0] && !imgError;
  const imageUrl = hasImage ? product.images![0] : '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image: imageUrl,
      short_description: product.short_description,
    });
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full" data-testid="product-card" onClick={handleProductClick}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-gold/30 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-beige-light p-4">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-deep-green/20">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                <path d="M3 16l5-5 4 4 3-3 6 6" />
                <circle cx="15.5" cy="8.5" r="1.5" />
              </svg>
              <span className="text-xs font-medium">No image</span>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-orange-brand text-white text-xs font-bold px-3 py-1.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {/* Paw overlay on hover */}
          <div className="absolute inset-0 bg-deep-green/0 group-hover:bg-deep-green/10 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gold text-deep-green font-semibold text-sm px-5 py-2 rounded-full shadow-lg">
              {t("product.viewProduct")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="font-medium text-deep-green text-lg leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2 tracking-wide">
            {displayName}
          </h3>
          {displayShort && (
            <p className="text-sm text-deep-green/60 mb-3 line-clamp-2">{displayShort}</p>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold text-deep-green">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-deep-green/40 line-through">{formatPrice(product.compare_at_price!)}</span>
            )}
          </div>
          {/* Star rating - dynamic from reviews */}
          {reviewStats && reviewStats.count > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const displayRating = product.review_rating_override ?? reviewStats.avg;
                return (
                  <svg key={star} className={`w-4 h-4 ${star <= Math.round(displayRating) ? 'text-gold' : 'text-deep-green/15'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
              <span className="text-xs text-deep-green/50 ml-1">({product.review_count_override ?? reviewStats.count})</span>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full mt-4 bg-deep-green text-white py-2 px-4 rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("product.added")}
              </>
            ) : t("product.addToCartBtn")}
          </button>
        </div>
      </div>
    </Link>
  );
}
