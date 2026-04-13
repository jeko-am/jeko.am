'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/cart-context';
import { trackViewContent } from '@/lib/tracking';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  images: string[] | null;
  weight: number | null;
  weight_unit: string | null;
  status: string;
  category_id: string | null;
  created_at: string;
  review_rating_override?: number | null;
  review_count_override?: number | null;
}

interface ProductReview {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  review_text: string;
  images: string[];
  is_verified: boolean;
  created_at: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  discount_percentage: number;
  total_price: number;
  compare_at_price: number | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  products?: {
    product_id: string;
    quantity: number;
    product: Product;
  }[];
}

interface Upsell {
  id: string;
  source_product_id: string;
  target_product_id: string;
  upsell_type: 'upsell' | 'cross_sell';
  title: string | null;
  description: string | null;
  discount_percentage: number;
  sort_order: number;
  target_product: Product;
}

interface Variant {
  id: string;
  product_id: string;
  option_type: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  inventory_count: number;
  sort_order: number;
  is_active: boolean;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
}

/* ------------------------------------------------------------------ */
/* Accordion                                                          */
/* ------------------------------------------------------------------ */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-deep-green/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <h2 className="text-lg font-medium text-deep-green tracking-wide">{title}</h2>
        <svg className={`w-5 h-5 text-deep-green/50 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] pb-5' : 'max-h-0'}`}>
        <div className="text-deep-green/70 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vet Testimonial Card                                               */
/* ------------------------------------------------------------------ */
function VetCard({ vet }: { vet: { name: string; role: string; text: string; product: string; productSlug: string } }) {
  return (
    <div className="min-w-[340px] max-w-[340px] bg-beige-light rounded-2xl p-6 snap-start flex flex-col">
      <div className="mb-3">
        <h4 className="font-medium text-deep-green text-base tracking-wide">{vet.name}</h4>
        <span className="text-sm text-deep-green/50">{vet.role}</span>
      </div>
      <p className="text-sm text-deep-green/70 leading-relaxed flex-1 mb-4">{vet.text}</p>
      <Link href={`/products/${vet.productSlug}`} className="flex items-center mt-auto pt-4 border-t border-deep-green/10">
        <span className="text-xs font-medium text-deep-green line-clamp-2">{vet.product}</span>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Review Card                                                        */
/* ------------------------------------------------------------------ */
function ReviewCard({ review }: { review: { name: string; date: string; rating: number; text: string; title?: string; variant?: string; verified: boolean; images?: string[] }; }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Review" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
        </div>
      )}
      <div className="border border-deep-green/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-deep-green text-sm tracking-wide">{review.name}</span>
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-gold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified
            </span>
          )}
        </div>
        <div className="text-xs text-deep-green/40 mb-2">{review.date}</div>
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold' : 'text-deep-green/15'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {review.title && <p className="text-sm font-medium text-deep-green mb-1">{review.title}</p>}
        <p className="text-sm text-deep-green/70">{review.text}</p>
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {review.images.map((img, i) => (
              <button key={i} onClick={() => setLightbox(img)} className="w-16 h-16 rounded-lg overflow-hidden border border-deep-green/10 hover:border-deep-green/30 transition flex-shrink-0">
                <img src={img} alt={`Review image ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        {review.variant && <p className="text-xs text-deep-green/40 mt-2">Item type: {review.variant}</p>}
      </div>
    </>
  );
}

/* ================================================================== */
/* Main Page                                                          */
/* ================================================================== */
export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [upsells, setUpsells] = useState<Upsell[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customSections, setCustomSections] = useState<Map<number, Record<string, any>>>(new Map());
  const vetScrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Reviews state
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, title: '', text: '' });
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewUploading, setReviewUploading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const reviewFileRef = useRef<HTMLInputElement>(null);

  const fetchReviews = useCallback(async (productId: string) => {
    const { data } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (data) setProductReviews(data as ProductReview[]);
  }, []);

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setReviewUploading(true);
    const uploaded: string[] = [];
    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const json = await res.json();
        if (json.url) uploaded.push(json.url);
      } catch { /* skip failed uploads */ }
    }
    setReviewImages(prev => [...prev, ...uploaded].slice(0, 5));
    setReviewUploading(false);
    if (reviewFileRef.current) reviewFileRef.current.value = '';
  };

  const submitReview = async () => {
    if (!product || !reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setReviewSubmitting(true);
    const { error } = await supabase.from('product_reviews').insert({
      product_id: product.id,
      reviewer_name: reviewForm.name.trim(),
      reviewer_email: reviewForm.email.trim() || null,
      rating: reviewForm.rating,
      title: reviewForm.title.trim() || null,
      review_text: reviewForm.text.trim(),
      images: reviewImages,
      status: 'pending',
      is_verified: false,
    });
    setReviewSubmitting(false);
    if (error) { alert('Failed to submit review. Please try again.'); return; }
    setReviewSuccess(true);
    setShowReviewForm(false);
    setReviewForm({ name: '', email: '', rating: 5, title: '', text: '' });
    setReviewImages([]);
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('status', 'active').single();
      if (data) {
        setProduct(data);
        trackViewContent({ id: data.id, name: data.name, price: data.price, quantity: 1 });

        // Fetch related products
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .neq('id', data.id)
          .limit(4);
        if (rel) setRelated(rel as Product[]);
        
        // Fetch bundles that contain this product
        const { data: productBundleLinks } = await supabase
          .from('bundle_products')
          .select('bundle_id')
          .eq('product_id', data.id);
        const bundleIds = (productBundleLinks || []).map(l => l.bundle_id);
        if (bundleIds.length > 0) {
          const { data: bundleData } = await supabase
            .from('bundles')
            .select(`
              *,
              bundle_products (
                quantity,
                sort_order,
                product:products (*)
              )
            `)
            .in('id', bundleIds)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
          if (bundleData) {
            const bundlesWithProducts = bundleData.map(bundle => ({
              ...bundle,
              products: (bundle.bundle_products || [])
                .sort((a: { sort_order?: number }, b: { sort_order?: number }) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((bp: { product: Product; quantity: number }) => ({
                  product_id: bp.product.id,
                  quantity: bp.quantity,
                  product: bp.product
                }))
            }));
            setBundles(bundlesWithProducts as Bundle[]);
          }
        }
        
        // Fetch upsells for this product
        const { data: upsellData } = await supabase
          .from('upsells')
          .select(`
            *,
            target_product:products (*)
          `)
          .eq('source_product_id', data.id)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (upsellData) {
          const upsellsWithProducts = upsellData.map(upsell => ({
            ...upsell,
            target_product: upsell.target_product as Product
          }));
          setUpsells(upsellsWithProducts as Upsell[]);
        }

        // Fetch variants
        const { data: variantData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', data.id)
          .eq('is_active', true)
          .order('sort_order');
        if (variantData && variantData.length > 0) {
          setVariants(variantData as Variant[]);
        }

        // Fetch approved reviews
        fetchReviews(data.id);

        // Fetch custom page sections for this product
        const productPageSlug = `product-${data.slug}`;
        const { data: pages } = await supabase.from('pages').select('id').or(`slug.eq.${productPageSlug},slug.eq./${productPageSlug}`).limit(1);
        if (pages?.[0]) {
          const { data: secs } = await supabase.from('page_sections').select('content, is_visible').eq('page_id', pages[0].id);
          if (secs) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const map = new Map<number, Record<string, any>>();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            secs.forEach((s: any) => {
              if (s.is_visible !== false) {
                const idx = s.content?._section_index;
                if (idx !== undefined && idx !== null) map.set(Number(idx), s.content);
              }
            });
            setCustomSections(map);
          }
        }
      }
      setLoading(false);
    }
    if (slug) fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, fetchReviews]);

  const displayPrice = selectedVariant ? selectedVariant.price : (product?.price ?? 0);
  const displayCompareAt = selectedVariant ? selectedVariant.compare_at_price : (product?.compare_at_price ?? null);
  const hasDiscount = displayCompareAt && displayCompareAt > displayPrice;

  // Group variants by option_type
  const variantGroups = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.option_type]) acc[v.option_type] = [];
    acc[v.option_type].push(v);
    return acc;
  }, {});

  const getImageUrl = (idx: number) => {
    if (product?.images?.[idx] && !imgErrors.has(idx)) return product.images[idx];
    return '';
  };

  const images = product?.images?.length ? product.images : [];
  const hasImages = images.length > 0;

  /* Loading state */
  if (loading) {
    return (
      <><Header /><main className="pt-24"><div className="max-w-[1400px] mx-auto px-4 py-16"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" /><div className="space-y-4"><div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" /><div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" /><div className="h-4 bg-gray-200 rounded w-full animate-pulse" /><div className="h-12 bg-gray-200 rounded w-48 animate-pulse mt-8" /></div></div></div></main><Footer /></>
    );
  }

  /* 404 */
  if (!product) {
    return (
      <><Header /><main className="pt-24"><div className="max-w-[1200px] mx-auto px-4 py-20 text-center"><div className="text-6xl mb-4">🐾</div><h1 className="text-3xl font-bold text-deep-green mb-3">Product Not Found</h1><p className="text-deep-green/60 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p><Link href="/products" className="btn-gold">Browse Products</Link></div></main><Footer /></>
    );
  }

  // Build display reviews: use dynamic from DB, fallback to hardcoded if none yet
  const fallbackReviews = [
    { name: 'Russell M.', date: '21/03/2026', rating: 5, text: 'My dog absolutely devours this! Great quality and you can tell the ingredients are fresh. Very fine product!', variant: product.name, verified: true },
    { name: 'Trang H.', date: '20/03/2026', rating: 5, text: 'Quick delivery. My fussy eater actually finished the whole bowl. Will definitely order again.', variant: product.name, verified: true },
    { name: 'Kelly W.', date: '02/03/2026', rating: 5, text: 'I love finding a quality dog food that my pup actually enjoys. His coat is shinier and he has more energy since we switched.', variant: product.name, verified: true },
    { name: 'Susan S.', date: '28/02/2026', rating: 4, text: 'Doesn\'t upset my dog\'s sensitive stomach and the only food he can eat while on an elimination diet.', variant: product.name, verified: true },
    { name: 'S S.', date: '26/02/2026', rating: 5, text: 'Fast delivery and very delicious - my dog cleaned the bowl in seconds. Smooth texture, great product.', variant: product.name, verified: true },
  ];

  const dynamicReviews = productReviews.map(r => ({
    name: r.reviewer_name,
    date: new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    rating: r.rating,
    title: r.title || undefined,
    text: r.review_text,
    variant: product.name,
    verified: r.is_verified,
    images: r.images,
  }));

  const reviews = dynamicReviews.length > 0 ? dynamicReviews : fallbackReviews;

  // Rating display: use admin override or calculated from dynamic reviews
  const calcAvgRating = dynamicReviews.length > 0
    ? dynamicReviews.reduce((s, r) => s + r.rating, 0) / dynamicReviews.length
    : 4.8;
  const displayRating = product.review_rating_override ?? calcAvgRating;
  const displayReviewCount = product.review_count_override ?? (dynamicReviews.length > 0 ? dynamicReviews.length : 130);

  const vets = [
    { name: 'Dr. Sarah Wilson, BVSc', role: 'Veterinary Nutritionist', text: 'As a veterinary nutritionist, I emphasize the importance of choosing food that supports a dog\'s overall balance. This is why I trust and confidently recommend Jeko to my patients. Their commitment to natural ingredients and rigorous quality testing provides a clean, supportive feeding experience.', product: product.name, productSlug: product.slug },
    { name: 'Dr. James Chen, DVM', role: 'Veterinary Dermatologist', text: 'I\'ve seen remarkable improvements in skin and coat conditions since recommending Jeko to my patients. The natural, hypoallergenic recipes are a game-changer for dogs with sensitivities.', product: 'Salmon & Potato Grain-Free', productSlug: 'salmon-potato-grain-free' },
    { name: 'Emma Richards', role: 'Canine Behaviourist', text: 'As a canine behaviourist, I see the link between nutrition and behaviour daily. Dogs on Jeko are calmer, more focused, and have better energy regulation throughout the day. It makes a real difference.', product: product.name, productSlug: product.slug },
    { name: 'Dr. Hannah Brooks, MRCVS', role: 'Small Animal Vet', text: 'It is extremely important to me to recommend clean products. Jeko is a brand I can trust is clean and has the research to back it up. The flavour quality is outstanding — dogs genuinely love it. I recommend it to all my patients!', product: 'Puppy Growth Formula', productSlug: 'puppy-growth-formula' },
    { name: 'Dr. Oliver Patel, BVM&S', role: 'Holistic Veterinarian', text: 'As a holistic vet, I greatly appreciate having a food I can recommend to clients managing chronic conditions. Jeko\'s careful ingredient sourcing and gentle processing is exactly what these dogs need.', product: product.name, productSlug: product.slug },
  ];

  const scrollVets = (dir: 'left' | 'right') => {
    vetScrollRef.current?.scrollBy({ left: dir === 'left' ? -370 : 370, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* ============================================================ */}
        {/* SECTION 1 — Product Hero (Gallery + Info)                    */}
        {/* ============================================================ */}
        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto px-4 py-8 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
              {/* --- Gallery --- */}
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-beige-light mb-4 group">
                  {hasImages ? (
                    <>
                      <img src={getImageUrl(selectedImage)} alt={product.name} className="w-full h-full object-cover" onError={() => setImgErrors(p => new Set(p).add(selectedImage))} />
                      {images.length > 1 && (
                        <>
                          <button onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center hover:bg-white transition opacity-0 group-hover:opacity-100">
                            <svg className="w-5 h-5 text-deep-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <button onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center hover:bg-white transition opacity-0 group-hover:opacity-100">
                            <svg className="w-5 h-5 text-deep-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-deep-green/20">
                      <svg className="w-24 h-24 mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" />
                        <circle cx="15.5" cy="8.5" r="1.5" />
                      </svg>
                      <span className="text-sm font-medium">No image available</span>
                    </div>
                  )}
                </div>
                {hasImages && images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-deep-green shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={getImageUrl(i)} alt="" className="w-full h-full object-cover" onError={() => setImgErrors(p => new Set(p).add(i))} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* --- Product Info --- */}
              <div>
                <h1 className="text-3xl md:text-4xl font-medium text-deep-green mb-4 leading-snug tracking-wide">{product.name}</h1>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-2xl font-bold text-deep-green">{formatPrice(displayPrice)}</span>
                  {hasDiscount && <span className="text-base text-deep-green/40 line-through ml-2">{formatPrice(displayCompareAt!)}</span>}
                </div>
                <p className="text-sm text-deep-green/50 mb-5">Shipping calculated at checkout.</p>

                {/* Description */}
                {product.short_description && (
                  <div className="mb-6">
                    <p className="font-medium text-deep-green mb-1 tracking-wide">Premium nutrition — nothing hidden.</p>
                    <p className="text-deep-green/70 text-sm leading-relaxed">{product.short_description}</p>
                  </div>
                )}

                {/* --- Variant Selector --- */}
                {Object.keys(variantGroups).length > 0 && (
                  <div className="mb-6">
                    {Object.entries(variantGroups).map(([type, opts]) => (
                      <div key={type} className="mb-4">
                        <h3 className="text-sm font-semibold text-deep-green mb-2">{type}</h3>
                        <div className="flex flex-wrap gap-2">
                          {opts.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariant(selectedVariant?.id === v.id ? null : v)}
                              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                                selectedVariant?.id === v.id
                                  ? 'border-deep-green bg-deep-green text-white'
                                  : 'border-deep-green/20 text-deep-green hover:border-deep-green/40'
                              }`}
                            >
                              {v.name}
                              {v.price !== product.price && (
                                <span className="ml-1 text-xs opacity-70">
                                  ({formatPrice(v.price)})
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- Bundles --- */}
                {bundles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-deep-green mb-3 tracking-wide">Value Bundles</h3>
                    <div className="space-y-3">
                      {bundles.slice(0, 2).map((bundle) => (
                        <div key={bundle.id} className="border border-deep-green/10 rounded-xl p-4 hover:border-gold/30 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-beige-light">
                              {(() => {
                                const imgSrc = bundle.image_url || bundle.products?.[0]?.product?.images?.[0];
                                return imgSrc ? (
                                  <img src={imgSrc} alt={bundle.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-deep-green/20">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                      <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                                      <path d="M3 16l5-5 4 4 3-3 6 6" />
                                    </svg>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-deep-green text-sm mb-1 tracking-wide">{bundle.name}</h4>
                              <p className="text-xs text-deep-green/60 mb-2 line-clamp-2">{bundle.description}</p>
                              <div className="flex items-center justify-between">
                                <div>
                                  {bundle.compare_at_price && (
                                    <span className="text-xs text-deep-green/40 line-through mr-1">
                                      {formatPrice(bundle.compare_at_price)}
                                    </span>
                                  )}
                                  <span className="font-bold text-deep-green text-sm">{formatPrice(bundle.total_price)}</span>
                                  {bundle.discount_percentage > 0 && (
                                    <span className="ml-2 text-xs font-bold text-white bg-gold px-2 py-0.5 rounded-full">
                                      Save {bundle.discount_percentage}%
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    // Add all bundle products to cart
                                    bundle.products?.forEach((bp: { product: Product; quantity: number }) => {
                                      for (let i = 0; i < bp.quantity; i++) {
                                        addItem({
                                          id: bp.product.id,
                                          name: bp.product.name,
                                          slug: bp.product.slug,
                                          price: bp.product.price,
                                          compare_at_price: bp.product.compare_at_price,
                                          image: bp.product.images?.[0] || '',
                                          short_description: bp.product.short_description,
                                        });
                                      }
                                    });
                                  }}
                                  className="px-3 py-1.5 bg-deep-green text-white text-xs font-medium rounded-lg hover:bg-deep-green/90 transition-colors"
                                >
                                  Add Bundle
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center bg-beige-light rounded-xl">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-deep-green/50 hover:text-deep-green transition font-medium text-lg" disabled={quantity <= 1}>−</button>
                    <span className="px-4 py-3 font-semibold text-deep-green min-w-[48px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-deep-green/50 hover:text-deep-green transition font-medium text-lg">+</button>
                  </div>
                  <button
                    onClick={() => {
                      if (!product || isAddingToCart) return;
                      setIsAddingToCart(true);
                      const imageUrl = product.images?.[0] || '';
                      for (let i = 0; i < quantity; i++) {
                        addItem({
                          id: product.id,
                          name: selectedVariant ? `${product.name} — ${selectedVariant.name}` : product.name,
                          slug: product.slug,
                          price: displayPrice,
                          compare_at_price: displayCompareAt,
                          image: imageUrl,
                          short_description: product.short_description,
                          variant_id: selectedVariant?.id ?? null,
                          variant_name: selectedVariant ? `${selectedVariant.option_type}: ${selectedVariant.name}` : null,
                        });
                      }
                      setTimeout(() => {
                        setIsAddingToCart(false);
                        setQuantity(1);
                      }, 800);
                    }}
                    disabled={isAddingToCart}
                    className="flex-1 bg-deep-green text-white font-semibold py-3.5 rounded-full hover:bg-deep-green/90 transition text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      `Add to Cart${quantity > 1 ? ` (${quantity})` : ''}`
                    )}
                  </button>
                </div>

                {/* --- Upsells & Cross-sells --- */}
                {(upsells.length > 0 || related.length > 0) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-deep-green mb-3">
                      {upsells.some(u => u.upsell_type === 'upsell') ? 'Upgrade Your Order' : 'Perfect Pairings'}
                    </h3>
                    <div className="space-y-3">
                      {(upsells.length > 0 ? upsells : related.slice(0, 2)).map((item) => {
                        const isUpsell = 'target_product' in item;
                        const product = isUpsell ? item.target_product : item;
                        const title = isUpsell ? (item.title || 'Recommended for You') : product.name;
                        const description = isUpsell ? item.description : product.short_description;
                        const discount = isUpsell ? item.discount_percentage : 0;
                        
                        return (
                          <div key={isUpsell ? item.id : product.id} className="border border-deep-green/10 rounded-xl p-4 hover:border-gold/30 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-beige-light">
                                <img 
                                  src={product.images?.[0] || `https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=80&h=80&fit=crop`} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-deep-green text-sm mb-1 tracking-wide">{title}</h4>
                                <p className="text-xs text-deep-green/60 mb-2 line-clamp-2">{description}</p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-deep-green text-sm">{formatPrice(product.price)}</span>
                                    {discount > 0 && (
                                      <span className="ml-2 text-xs font-bold text-white bg-gold px-2 py-0.5 rounded-full">
                                        {discount}% off
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      addItem({
                                        id: product.id,
                                        name: product.name,
                                        slug: product.slug,
                                        price: product.price,
                                        compare_at_price: product.compare_at_price,
                                        image: product.images?.[0] || `https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop`,
                                        short_description: product.short_description,
                                      });
                                    }}
                                    className="px-3 py-1.5 bg-deep-green text-white text-xs font-medium rounded-lg hover:bg-deep-green/90 transition-colors"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lab tested badge */}
                <div className="border border-deep-green/10 rounded-xl p-4 flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-deep-green">Vet Approved & Lab Tested <span className="text-[10px] font-bold bg-gold/20 text-deep-green px-1.5 py-0.5 rounded ml-1">2026</span></p>
                    <p className="text-xs text-deep-green/50">All ingredients tested for quality & safety →</p>
                  </div>
                </div>

                {/* Custom: Feature Highlights (section index 1) */}
                {customSections.get(1)?.features_heading && (
                  <div className="mb-6 pt-4 border-t border-deep-green/10">
                    <h3 className="font-semibold text-deep-green mb-3">{customSections.get(1)?.features_heading}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[1, 2, 3].map(n => {
                        const sec = customSections.get(1);
                        const title = sec?.[`feature_${n}_title`];
                        const desc = sec?.[`feature_${n}_description`];
                        if (!title) return null;
                        return (
                          <div key={n} className="bg-beige-light rounded-xl p-4">
                            <h4 className="font-medium text-deep-green text-sm mb-1">{String(title)}</h4>
                            {desc && <p className="text-xs text-deep-green/60">{String(desc)}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Accordions */}
                <Accordion title={String(customSections.get(3)?.ingredients_heading || "Ingredients & Nutrition")} defaultOpen>
                  {customSections.get(3)?.ingredients_list ? (
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: String(customSections.get(3)!.ingredients_list).replace(/\n/g, '<br/>') }} />
                      {customSections.get(3)?.nutrition_info && (
                        <div className="mt-4 pt-3 border-t border-deep-green/10">
                          <h4 className="font-semibold text-deep-green text-sm mb-2">{String(customSections.get(3)?.nutrition_heading || 'Nutritional Information')}</h4>
                          <div dangerouslySetInnerHTML={{ __html: String(customSections.get(3)!.nutrition_info).replace(/\n/g, '<br/>') }} />
                        </div>
                      )}
                    </div>
                  ) : product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>Made with natural, human-grade ingredients carefully selected by veterinary nutritionists.</p>
                  )}
                </Accordion>
                <Accordion title={String(customSections.get(4)?.feeding_heading || "Feeding Guide")}>
                  {customSections.get(4)?.feeding_body ? (
                    <div dangerouslySetInnerHTML={{ __html: String(customSections.get(4)!.feeding_body).replace(/\n/g, '<br/>') }} />
                  ) : (
                    <>
                      <p className="mb-2">Serve based on your dog&apos;s weight:</p>
                      <ul className="space-y-1">
                        <li><strong>Small dogs (up to 10kg):</strong> 100-200g per day</li>
                        <li><strong>Medium dogs (10-25kg):</strong> 200-400g per day</li>
                        <li><strong>Large dogs (25kg+):</strong> 400-600g per day</li>
                      </ul>
                      <p className="mt-2">Always ensure fresh water is available. Transition gradually over 7-10 days.</p>
                    </>
                  )}
                </Accordion>
                <Accordion title="Shipping & Returns">
                  <p><strong>Free UK delivery</strong> on all orders. Orders placed before 2pm are dispatched same day.</p>
                  <p className="mt-2">Standard delivery: 2-3 working days. Express delivery available at checkout.</p>
                  <p className="mt-2">Not happy? Full refund within 30 days — no questions asked.</p>
                </Accordion>

                {/* Custom: Product FAQ (section index 6) */}
                {customSections.get(6)?.faq_1_q && (
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-deep-green mb-3 pt-4">{String(customSections.get(6)?.faq_heading || 'FAQ')}</h3>
                    {[1, 2, 3, 4].map(n => {
                      const q = customSections.get(6)?.[`faq_${n}_q`];
                      const a = customSections.get(6)?.[`faq_${n}_a`];
                      if (!q) return null;
                      return <Accordion key={n} title={String(q)}><p>{String(a || '')}</p></Accordion>;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2 — "The Jeko Difference" badge row                  */}
        {/* ============================================================ */}
        <section className="bg-off-white py-14 border-t border-b border-deep-green/5">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-green mb-10 italic">The Jeko Difference</h2>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                'Vet Approved', 'Natural Ingredients', 'Grain-Free Options', 'Lab Tested',
                'Human Grade', 'Gentle on Tummies', 'Nutrient-Rich'
              ].map(badge => (
                <div key={badge} className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-deep-green font-medium text-sm">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3 — Nutrition Highlights (image + text)              */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-deep-green">
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Image Left Side - ~43% with vertical zigzag right edge */}
            <div className="w-full md:w-[43%] relative min-h-[300px] md:min-h-[480px]">
              <img 
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&h=600&fit=crop" 
                alt="Fresh food in bowl" 
                className="w-full h-full object-cover"
              />
              {/* Vertical zigzag on right edge - deep-green teeth pointing LEFT into image */}
              <div
                className="hidden md:block absolute right-0 top-0 h-full z-10"
                style={{
                  width: '12px',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M12,0 L0,12 L12,24 Z' fill='%23274C46'/%3E%3C/svg%3E\")",
                  backgroundSize: '12px 24px',
                  backgroundRepeat: 'repeat-y',
                }}
              />
            </div>

            {/* Text Right Side - ~57% */}
            <div className="w-full md:w-[57%] flex items-center">
              <div className="px-8 md:px-16 lg:px-24 py-12">
                <h2 className="text-[32px] md:text-[40px] font-semibold text-white font-rubik leading-tight mb-6 italic">
                  Fresh. Balanced. Irresistible.
                </h2>
                <div className="space-y-4 text-white/80 text-[18px] leading-relaxed">
                  <p><strong className="text-gold">Protein Profile:</strong> High-quality, single-source animal protein for lean muscle maintenance and sustained energy.</p>
                  <p><strong className="text-gold">Nutrition Highlights:</strong> Rich in omega-3 fatty acids for a glossy coat, prebiotics for gut health, and essential vitamins for immune support.</p>
                  <p><strong className="text-gold">Preparation:</strong> Gently air-dried to lock in nutrients. Just add warm water, stir, and serve — ready in 10 seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4 — Customer Reviews                                 */}
        {/* ============================================================ */}
        <section className="bg-white py-16" id="reviews">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-green text-center mb-10 italic">Customer Reviews</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <svg key={i} className={`w-6 h-6 ${i < Math.round(displayRating) ? 'text-gold' : 'text-deep-green/15'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <span className="text-deep-green font-medium">{displayReviewCount} Reviews</span>
              </div>
              <button onClick={() => { setShowReviewForm(!showReviewForm); setReviewSuccess(false); }} className="btn-outline text-sm py-2 px-4">
                {showReviewForm ? 'Cancel' : 'Write a review'}
              </button>
            </div>

            {/* Success message */}
            {reviewSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-800 font-medium text-sm">Thank you for your review! It will appear once approved.</p>
              </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-beige-light rounded-2xl p-6 mb-8 border border-deep-green/10">
                <h3 className="text-lg font-semibold text-deep-green mb-4">Write a Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1">Your Name *</label>
                    <input value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full px-3 py-2.5 border border-deep-green/15 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none" placeholder="John D." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1">Email <span className="text-deep-green/40">(optional)</span></label>
                    <input type="email" value={reviewForm.email} onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })} className="w-full px-3 py-2.5 border border-deep-green/15 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none" placeholder="john@example.com" />
                  </div>
                </div>

                {/* Star rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-green mb-2">Rating *</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <svg className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-gold' : 'text-deep-green/15'} hover:text-gold/70 transition cursor-pointer`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-green mb-1">Title <span className="text-deep-green/40">(optional)</span></label>
                  <input value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} className="w-full px-3 py-2.5 border border-deep-green/15 rounded-lg text-sm bg-white focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none" placeholder="e.g. My dog loves it!" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-deep-green mb-1">Your Review *</label>
                  <textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} rows={4} className="w-full px-3 py-2.5 border border-deep-green/15 rounded-lg text-sm bg-white resize-none focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none" placeholder="Tell us about your experience..." />
                </div>

                {/* Image upload */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-deep-green mb-2">Add Photos <span className="text-deep-green/40">(up to 5)</span></label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {reviewImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-deep-green/10 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {reviewImages.length < 5 && (
                      <button onClick={() => reviewFileRef.current?.click()} disabled={reviewUploading} className="w-16 h-16 rounded-lg border-2 border-dashed border-deep-green/20 hover:border-deep-green/40 flex items-center justify-center transition disabled:opacity-50">
                        {reviewUploading ? (
                          <div className="w-5 h-5 border-2 border-deep-green/20 border-t-deep-green rounded-full animate-spin" />
                        ) : (
                          <svg className="w-6 h-6 text-deep-green/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                        )}
                      </button>
                    )}
                    <input ref={reviewFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleReviewImageUpload} />
                  </div>
                </div>

                <button onClick={submitReview} disabled={reviewSubmitting || !reviewForm.name.trim() || !reviewForm.text.trim()} className="bg-deep-green text-white font-semibold py-3 px-8 rounded-full hover:bg-deep-green/90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {reviewSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5 — "Learn The Science" CTA                         */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-off-white">
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Image Left Side - ~43% with vertical zigzag right edge */}
            <div className="w-full md:w-[43%] relative min-h-[300px] md:min-h-[480px]">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop" 
                alt="Science lab research" 
                className="w-full h-full object-cover"
              />
              {/* Vertical zigzag on right edge - off-white teeth pointing LEFT into image */}
              <div
                className="hidden md:block absolute right-0 top-0 h-full z-10"
                style={{
                  width: '12px',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M12,0 L0,12 L12,24 Z' fill='%23EAE5DC'/%3E%3C/svg%3E\")",
                  backgroundSize: '12px 24px',
                  backgroundRepeat: 'repeat-y',
                }}
              />
            </div>

            {/* Text Right Side - ~57% */}
            <div className="w-full md:w-[57%] flex items-center">
              <div className="px-8 md:px-16 lg:px-24 py-12">
                <h2 className="text-[32px] md:text-[40px] font-semibold text-deep-green font-rubik leading-tight mb-4">
                  Learn The Science Behind Jeko
                </h2>
                <p className="text-deep-green/70 text-[18px] leading-relaxed mb-6">
                  Developed with veterinary nutritionists, every recipe is backed by science to deliver optimal nutrition.
                </p>
                <Link href="/benefits" className="btn-gold inline-block">Learn More</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6 — Trusted by Vets (horizontal scroll)             */}
        {/* ============================================================ */}
        <section className="bg-beige-light py-16">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-deep-green italic">Trusted by Vets & Nutritionists</h2>
              <div className="hidden md:flex gap-2">
                <button onClick={() => scrollVets('left')} className="w-10 h-10 rounded-full border border-deep-green/20 flex items-center justify-center hover:bg-deep-green hover:text-white transition text-deep-green"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                <button onClick={() => scrollVets('right')} className="w-10 h-10 rounded-full border border-deep-green/20 flex items-center justify-center hover:bg-deep-green hover:text-white transition text-deep-green"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              </div>
            </div>
            <div ref={vetScrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {vets.map((v, i) => <VetCard key={i} vet={v} />)}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7 — "Food that fuels their best days" (image + text) */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Image Left Side - ~43% with vertical zigzag right edge */}
            <div className="w-full md:w-[43%] relative min-h-[300px] md:min-h-[480px]">
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop" 
                alt="Happy dog lifestyle" 
                className="w-full h-full object-cover"
              />
              {/* Vertical zigzag on right edge - off-white teeth pointing LEFT into image */}
              <div
                className="hidden md:block absolute right-0 top-0 h-full z-10"
                style={{
                  width: '12px',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M12,0 L0,12 L12,24 Z' fill='%23EAE5DC'/%3E%3C/svg%3E\")",
                  backgroundSize: '12px 24px',
                  backgroundRepeat: 'repeat-y',
                }}
              />
            </div>

            {/* Text Right Side - ~57% */}
            <div className="w-full md:w-[57%] bg-off-white flex items-center">
              <div className="px-8 md:px-16 lg:px-24 py-12">
                <h2 className="text-[32px] md:text-[40px] font-semibold text-deep-green font-rubik leading-tight mb-6 italic">
                  Food that fuels their best days
                </h2>
                <div className="space-y-3 text-deep-green/70 text-[18px] leading-relaxed">
                  <p><strong className="text-deep-green">At Jeko, the mission is simple:</strong></p>
                  <p>Create food that makes your dog feel as good as it tastes.</p>
                  <p>Always fresh, natural & vet-approved.</p>
                  <p>It&apos;s the kind they love, crave, and sprint to the bowl for every single time — for boundless energy, a shiny coat, and a happier, healthier life.</p>
                  <p>Jeko is for the devoted pet parents simply seeking more for their best friend.</p>
                </div>
                <Link href="/auth/signup" className="btn-gold mt-8 inline-block">Try Jeko</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 8 — "Why We Started Jeko" (image + text)            */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row min-h-[480px]">
            {/* Text Left Side - ~57% */}
            <div className="w-full md:w-[57%] flex items-center order-2 md:order-1">
              <div className="px-8 md:px-16 lg:px-24 py-12">
                <h2 className="text-[32px] md:text-[40px] font-semibold text-deep-green font-rubik leading-tight mb-6 italic">
                  Why We Started Jeko
                </h2>
                <div className="space-y-3 text-deep-green/70 text-[18px] leading-relaxed">
                  <p>We didn&apos;t start this brand for the trend.</p>
                  <p>We started Jeko because our own dogs deserved better — and so does yours.</p>
                  <p>When we looked at what was in most commercial dog food, we were shocked. Fillers, preservatives, mysterious &ldquo;meat derivatives&rdquo; — making our dogs worse, not better.</p>
                  <p>They needed a better option — so we created one.</p>
                </div>
                <Link href="/about" className="btn-outline mt-8 inline-block">Learn More</Link>
              </div>
            </div>

            {/* Image Right Side - ~43% with vertical zigzag left edge */}
            <div className="w-full md:w-[43%] relative min-h-[300px] md:min-h-[480px] order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" 
                alt="The Jeko team" 
                className="w-full h-full object-cover"
              />
              {/* Vertical zigzag on left edge - white teeth pointing RIGHT into image */}
              <div
                className="hidden md:block absolute left-0 top-0 h-full z-10"
                style={{
                  width: '12px',
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 24'%3E%3Cpath d='M0,0 L12,12 L0,24 Z' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
                  backgroundSize: '12px 24px',
                  backgroundRepeat: 'repeat-y',
                }}
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 9 — Our Mission quote                                */}
        {/* ============================================================ */}
        <section className="bg-deep-green py-20">
          <div className="max-w-[900px] mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 italic">Our Mission</h2>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed italic">&ldquo;To create food that helps your dog feel their best, so they can keep doing what they love — being your best friend.&rdquo;</p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 10 — Full-width lifestyle banner                     */}
        {/* ============================================================ */}
        <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1400&h=500&fit=crop" alt="Happy healthy dogs" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-green/70 to-transparent flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 w-full">
              <h2 className="text-3xl md:text-5xl font-bold text-white max-w-lg italic leading-tight">Boundless Energy, Shiny Coat, Happier Days</h2>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 11 — Related Products                                */}
        {/* ============================================================ */}
        {related.length > 0 && (
          <section className="bg-off-white py-16">
            <div className="max-w-[1200px] mx-auto px-4">
              <h2 className="text-2xl font-bold text-deep-green mb-8">You May Also Like</h2>
              {/* Mobile: horizontal scroll with 2 cards visible; Desktop: 4-column grid */}
              <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
                {related.map(p => (
                  <div key={p.id} className="flex-shrink-0 w-[47vw] max-w-[220px] snap-start lg:w-auto lg:max-w-none">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
