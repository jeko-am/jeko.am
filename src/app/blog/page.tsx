'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image, author_name, category, tags, published_at, created_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false });

      setPosts(data || []);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const categories = Array.from(new Set(posts.map(p => p.category).filter(Boolean))) as string[];
  const filtered = selectedCategory
    ? posts.filter(p => p.category === selectedCategory)
    : posts;

  return (
    <>
      <Header />
      <main className="bg-off-white min-h-screen pt-[100px] lg:pt-[120px] pb-24 font-rubik">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
          {/* Title */}
          <div className="text-center mb-10 lg:mb-14">
            <h1 className="font-rubik font-bold text-deep-green text-3xl lg:text-5xl mb-3">
              Blog
            </h1>
            <p className="text-deep-green/60 text-[15px] lg:text-[17px] max-w-lg mx-auto leading-relaxed">
              Tips, stories, and insights for pet parents who want the best for their furry friends.
            </p>
          </div>

          {/* Category filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-deep-green text-white'
                    : 'bg-white text-deep-green border border-deep-green/20 hover:bg-deep-green/5'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? 'bg-deep-green text-white'
                      : 'bg-white text-deep-green border border-deep-green/20 hover:bg-deep-green/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-deep-green border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-deep-green/10 rounded-full flex items-center justify-center text-4xl">
                📝
              </div>
              <h2 className="font-medium text-xl text-deep-green mb-2">No blog posts yet</h2>
              <p className="text-deep-green/60 text-[15px]">
                Check back soon for tips, stories, and pet care insights.
              </p>
            </div>
          )}

          {/* Blog grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  {/* Featured image */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-deep-green/5">
                        <svg className="w-12 h-12 text-deep-green/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-deep-green/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[12px] text-deep-green/50 mb-2">
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                      {post.author_name && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-deep-green/30" />
                          <span>{post.author_name}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-rubik font-bold text-deep-green text-[17px] leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-deep-green/60 text-[14px] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-[11px] text-deep-green/50 bg-deep-green/5 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
