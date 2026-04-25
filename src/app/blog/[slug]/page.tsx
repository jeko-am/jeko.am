'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useT } from '@/lib/i18n/LangProvider';
import { localize } from '@/lib/i18n/localizeRecord';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  i18n?: { hy?: { title?: string; body?: string; excerpt?: string } } | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const { t, lang } = useT();
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!data) {
        setNotFound(true);
      } else {
        setPost(data as BlogPost);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-off-white min-h-screen pt-[100px] lg:pt-[120px] pb-24 font-rubik">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-deep-green border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !post) {
    return (
      <>
        <Header />
        <main className="bg-off-white min-h-screen pt-[100px] lg:pt-[120px] pb-24 font-rubik">
          <div className="max-w-[700px] mx-auto px-4 text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-deep-green/10 rounded-full flex items-center justify-center text-4xl">
              🔍
            </div>
            <h1 className="font-rubik font-bold text-deep-green text-2xl mb-3">{t("blog.post.notFound.heading")}</h1>
            <p className="text-deep-green/60 mb-6">{t("blog.post.notFound.body")}</p>
            <Link href="/blog" className="inline-block bg-gold text-deep-green font-semibold px-6 py-3 rounded-lg hover:bg-[#d99500] transition-colors">
              {t("blog.post.backButton")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-off-white min-h-screen pt-[100px] lg:pt-[120px] pb-24 font-rubik">
        {/* Hero image */}
        {post.featured_image && (
          <div className="relative w-full max-w-[1100px] mx-auto aspect-[21/9] mb-8 rounded-xl overflow-hidden mx-4 lg:mx-auto">
            <Image
              src={post.featured_image}
              alt={localize(post as unknown as Record<string, unknown>, 'title', lang) || post.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="max-w-[700px] mx-auto px-4 lg:px-0">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-deep-green/50 hover:text-deep-green text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("blog.post.backButton")}
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-deep-green/50 mb-4">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {post.author_name && (
              <>
                <span className="w-1 h-1 rounded-full bg-deep-green/30" />
                <span>{post.author_name}</span>
              </>
            )}
            {post.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-deep-green/30" />
                <span className="bg-deep-green/10 text-deep-green px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider">
                  {post.category}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-rubik font-bold text-deep-green text-3xl lg:text-4xl leading-tight mb-6">
            {localize(post as unknown as Record<string, unknown>, 'title', lang) || post.title}
          </h1>

          {/* Excerpt */}
          {(localize(post as unknown as Record<string, unknown>, 'excerpt', lang) || post.excerpt) && (
            <p className="text-deep-green/70 text-[17px] leading-relaxed mb-8 border-l-4 border-gold pl-4">
              {localize(post as unknown as Record<string, unknown>, 'excerpt', lang) || post.excerpt}
            </p>
          )}

          {/* Body */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-rubik prose-headings:text-deep-green prose-headings:font-bold
              prose-p:text-deep-green/80 prose-p:leading-relaxed prose-p:text-[16px]
              prose-a:text-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-deep-green
              prose-ul:text-deep-green/80 prose-ol:text-deep-green/80
              prose-li:text-[16px] prose-li:leading-relaxed
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-gold prose-blockquote:text-deep-green/70"
            dangerouslySetInnerHTML={{ __html: localize(post as unknown as Record<string, unknown>, 'body', lang) || post.body }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[12px] text-deep-green/60 bg-deep-green/5 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
