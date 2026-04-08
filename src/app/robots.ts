import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/auth/',
        '/api/',
        '/checkout/',
        '/cart/',
        '/profile/',
        '/messages/',
        '/matches/',
        '/find-owners/',
        '/_next/',
        '/swipe/',
        '/*.json$',
        '/*.js$',
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jeko.am'}/sitemap.xml`,
  };
}
