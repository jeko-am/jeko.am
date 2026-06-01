'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useT } from '@/lib/i18n/LangProvider';
import { dynFontClass, dynFontStyle } from '@/lib/dynamic-font-size';
import { localizedContentText } from '@/lib/content-field';
import { useSectionVisibility } from '@/lib/use-section-visibility';

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
  i18n?: { hy?: { name?: string; short_description?: string } } | null;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const { t, lang } = useT();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState<Record<number, Record<string, unknown>>>({});
  const visibilityCss = useSectionVisibility('/products');

  useEffect(() => {
    async function fetchEditorSections() {
      const { data: pages } = await supabase
        .from('pages')
        .select('id')
        .or('slug.eq./products,slug.eq.products')
        .limit(1);
      const pageId = pages?.[0]?.id;
      if (!pageId) return;

      const { data } = await supabase
        .from('page_sections')
        .select('content, sort_order')
        .eq('page_id', pageId);
      const next: Record<number, Record<string, unknown>> = {};
      data?.forEach((section) => {
        const content = (section.content || {}) as Record<string, unknown>;
        const idx = Number(content._section_index ?? section.sort_order);
        if (Number.isFinite(idx)) next[idx] = content;
      });
      setSections(next);
    }
    fetchEditorSections();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('id, name, slug, short_description, price, compare_at_price, images, status, i18n, review_rating_override, review_count_override')
        .eq('status', 'active');

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      if (search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data } = await query.limit(50);
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, sortBy, search]);

  const contentText = (sectionIndex: number, key: string, fallback: string) => {
    return localizedContentText(sections[sectionIndex], key, lang, fallback);
  };
  const textStyle = (sectionIndex: number, key: string, colorKey?: string) => {
    const content = sections[sectionIndex];
    return {
      ...(dynFontStyle(content, key, lang) || {}),
      ...(colorKey && typeof content?.[colorKey] === 'string' && content[colorKey] ? { color: content[colorKey] as string } : {}),
    };
  };
  const bgStyle = (sectionIndex: number, colorKey = 'background_color') => {
    const value = sections[sectionIndex]?.[colorKey];
    return typeof value === 'string' && value ? { backgroundColor: value } : undefined;
  };
  const resultsLabel = loading
    ? contentText(2, 'loading_text', t("products.loading"))
    : contentText(
      2,
      'results_label',
      t(products.length === 1 ? "products.resultsFound.one" : "products.resultsFound.many", { n: products.length })
    ).replace('{n}', String(products.length));

  return (
    <>
      {visibilityCss && <style dangerouslySetInnerHTML={{ __html: visibilityCss }} />}
      <Header />
      <main className="pt-[80px]">
        {/* Hero Banner */}
        <section className="bg-deep-green py-16 text-center relative zigzag-bottom" data-section-index="0" data-section-name="Collection Hero" style={bgStyle(0)}>
          <div className="max-w-[1200px] mx-auto px-4">
            <h1
              className={`[font-family:'Rubik',Helvetica,Arial,sans-serif] text-3xl font-semibold leading-tight text-white md:text-5xl md:font-medium ${dynFontClass(sections[0], 'title_prefix')}`}
              style={textStyle(0, 'title_prefix', 'title_prefix_color')}
            >
              {contentText(0, 'title_prefix', t("products.hero.titlePrefix"))}{' '}
              <span
                className={`text-gold ${dynFontClass(sections[0], 'title_highlight')}`}
                style={textStyle(0, 'title_highlight', 'title_highlight_color')}
              >
                {contentText(0, 'title_highlight', t("products.hero.titleHighlight"))}
              </span>
            </h1>
            <p
              className={`mx-auto mt-4 max-w-xl [font-family:'Rubik',Helvetica,Arial,sans-serif] text-base font-normal leading-7 text-white/75 md:text-lg ${dynFontClass(sections[0], 'subtitle')}`}
              style={textStyle(0, 'subtitle', 'subtitle_color')}
            >
              {contentText(0, 'subtitle', t("products.hero.subtitle"))}
            </p>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-16 bg-off-white" data-section-index="1" data-section-name="Filters & Sorting" style={bgStyle(1)}>
          <div className="max-w-[1200px] mx-auto px-4">
            {/* Filter Bar */}
            <div
              className="bg-white rounded-2xl shadow-md p-4 md:p-6 mb-10 flex flex-col md:flex-row gap-4 items-center"
              style={bgStyle(1, 'filter_background_color')}
            >
              {/* Search */}
              <div className="relative flex-1 w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={contentText(1, 'search_placeholder', t("products.search.placeholder"))}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-beige-light border-2 border-transparent focus:border-gold focus:outline-none text-sm ${dynFontClass(sections[1], 'search_placeholder')}`}
                  style={textStyle(1, 'search_placeholder', 'filter_text_color')}
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${dynFontClass(sections[1], 'all_filter')} ${
                    !selectedCategory
                      ? 'bg-deep-green text-white'
                      : 'bg-beige-light text-deep-green hover:bg-deep-green/10'
                  }`}
                  style={textStyle(1, 'all_filter', selectedCategory ? 'filter_text_color' : undefined)}
                >
                  {contentText(1, 'all_filter', t("products.filter.all"))}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${dynFontClass(sections[1], 'all_filter')} ${
                      selectedCategory === cat.id
                        ? 'bg-deep-green text-white'
                        : 'bg-beige-light text-deep-green hover:bg-deep-green/10'
                    }`}
                    style={textStyle(1, 'all_filter', selectedCategory === cat.id ? undefined : 'filter_text_color')}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-2.5 rounded-xl bg-beige-light border-2 border-transparent focus:border-gold focus:outline-none text-sm text-deep-green cursor-pointer ${dynFontClass(sections[1], 'sort_newest')}`}
                style={textStyle(1, 'sort_newest', 'filter_text_color')}
              >
                <option value="newest">{contentText(1, 'sort_newest', t("products.sort.newest"))}</option>
                <option value="price-asc">{contentText(1, 'sort_price_asc', t("products.sort.priceAsc"))}</option>
                <option value="price-desc">{contentText(1, 'sort_price_desc', t("products.sort.priceDesc"))}</option>
                <option value="name">{contentText(1, 'sort_name', t("products.sort.nameAsc"))}</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6" data-section-index="2" data-section-name="Products Grid & Cards">
              <p
                className={`text-sm text-deep-green/60 ${dynFontClass(sections[2], loading ? 'loading_text' : 'results_label')}`}
                style={textStyle(2, loading ? 'loading_text' : 'results_label', 'results_text_color')}
              >
                {resultsLabel}
              </p>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🐾</div>
                <h3
                  className={`text-xl font-semibold text-deep-green mb-2 ${dynFontClass(sections[2], 'empty_title')}`}
                  style={textStyle(2, 'empty_title', 'empty_text_color')}
                >
                  {contentText(2, 'empty_title', t("products.empty.title"))}
                </h3>
                <p
                  className={`text-deep-green/60 ${dynFontClass(sections[2], 'empty_body')}`}
                  style={textStyle(2, 'empty_body', 'empty_text_color')}
                >
                  {contentText(2, 'empty_body', t("products.empty.body"))}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} content={sections[2]} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
