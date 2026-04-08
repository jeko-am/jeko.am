import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Static routes that should always appear in sitemap
const staticRoutes = [
  { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
  { url: '/about', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/benefits', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/recipes', priority: 0.8, changeFrequency: 'weekly' as const },
  { url: '/reviews', priority: 0.7, changeFrequency: 'weekly' as const },
  { url: '/products', priority: 0.9, changeFrequency: 'daily' as const },
  { url: '/auth/signup', priority: 0.6, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/terms-of-use', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/delivery-information', priority: 0.4, changeFrequency: 'monthly' as const },
  { url: '/returns', priority: 0.4, changeFrequency: 'monthly' as const },
  { url: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/shipping-policy', priority: 0.4, changeFrequency: 'monthly' as const },
  { url: '/site-security', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/pure-policies', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/beyond-the-bowl', priority: 0.5, changeFrequency: 'weekly' as const },
  { url: '/community', priority: 0.5, changeFrequency: 'weekly' as const },
  { url: '/sitemap-page', priority: 0.2, changeFrequency: 'yearly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jeko.am';
  
  // Create sitemap entries for static routes
  const staticEntries = staticRoutes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch dynamic product pages from Supabase
  let productEntries: MetadataRoute.Sitemap = [];
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'active');
    
    if (products) {
      productEntries = products.map(product => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Combine all entries
  return [...staticEntries, ...productEntries];
}
