'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  user_id: string | null;
  author_name: string | null;
  caption: string | null;
  image_url: string | null;
  breed_tag: string | null;
  city_tag: string | null;
  likes_count: number;
  comments_count: number;
  report_count: number;
  share_count: number;
  is_flagged: boolean;
  is_deleted: boolean;
  i18n?: { hy?: { caption?: string } } | null;
  created_at: string;
}

type Tab = 'all' | 'flagged' | 'removed';

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [removed, setRemoved] = useState<Post[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const sel = 'id, user_id, author_name, caption, image_url, breed_tag, city_tag, likes_count, comments_count, report_count, share_count, is_flagged, is_deleted, i18n, created_at';

    const [activeRes, removedRes] = await Promise.all([
      supabase.from('posts').select(sel).eq('is_deleted', false).order('created_at', { ascending: false }),
      supabase.from('posts').select(sel).eq('is_deleted', true).order('created_at', { ascending: false }),
    ]);

    if (!activeRes.error && activeRes.data) setPosts(activeRes.data);
    if (!removedRes.error && removedRes.data) setRemoved(removedRes.data);
    setLoading(false);
  }

  async function saveHyTranslation(post: Post) {
    if (!editingText.trim()) return;
    setActionLoading(post.id + '-hy');
    const nextI18n = { ...(post.i18n ?? {}), hy: { ...(post.i18n?.hy ?? {}), caption: editingText.trim() } };
    const { error } = await supabase
      .from('posts')
      .update({ i18n: nextI18n })
      .eq('id', post.id);
    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, i18n: nextI18n } : p));
      setRemoved(prev => prev.map(p => p.id === post.id ? { ...p, i18n: nextI18n } : p));
      setEditingId(null);
      setEditingText('');
    }
    setActionLoading(null);
  }

  async function openEditor(post: Post) {
    const existing = post.i18n?.hy?.caption;
    setEditingId(post.id);
    if (existing) { setEditingText(existing); return; }
    if (!post.caption?.trim()) { setEditingText(''); return; }
    setEditingText('');
    setActionLoading(post.id + '-tx');
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: post.caption, target: 'hy' }),
      });
      const j = (await r.json()) as { translated?: string };
      if (r.ok && j.translated) setEditingText(j.translated);
    } catch { /* leave blank on error */ }
    setActionLoading(null);
  }

  async function retranslate(post: Post) {
    if (!post.caption?.trim()) return;
    setActionLoading(post.id + '-tx');
    try {
      const r = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: post.caption, target: 'hy' }),
      });
      const j = (await r.json()) as { translated?: string };
      if (r.ok && j.translated) setEditingText(j.translated);
    } catch { /* noop */ }
    setActionLoading(null);
  }

  async function removePost(post: Post) {
    setActionLoading(post.id + '-hide');
    const { error } = await supabase
      .from('posts')
      .update({ is_deleted: true })
      .eq('id', post.id);
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== post.id));
      setRemoved(prev => [{ ...post, is_deleted: true }, ...prev]);
    }
    setActionLoading(null);
  }

  async function restorePost(post: Post) {
    setActionLoading(post.id + '-hide');
    const { error } = await supabase
      .from('posts')
      .update({ is_deleted: false })
      .eq('id', post.id);
    if (!error) {
      setRemoved(prev => prev.filter(p => p.id !== post.id));
      setPosts(prev => [{ ...post, is_deleted: false }, ...prev]);
    }
    setActionLoading(null);
  }

  async function toggleFlagged(post: Post) {
    setActionLoading(post.id + '-flag');
    const { error } = await supabase
      .from('posts')
      .update({ is_flagged: !post.is_flagged })
      .eq('id', post.id);
    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_flagged: !post.is_flagged } : p));
    }
    setActionLoading(null);
  }

  const flaggedCount = posts.filter(p => p.is_flagged).length;

  const filtered = tab === 'removed'
    ? removed
    : tab === 'flagged'
      ? posts.filter(p => p.is_flagged)
      : posts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Community Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} active · {removed.length} removed</p>
        </div>
        <button
          onClick={fetchPosts}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {(['all', 'flagged', 'removed'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
            {t === 'flagged' && flaggedCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
                {flaggedCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400 text-sm">No posts in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(post => (
            <div
              key={post.id}
              className={`bg-white rounded-xl p-4 border ${post.is_flagged ? 'border-red-200 bg-red-50/30' : 'border-transparent'} ${tab === 'removed' ? 'opacity-60' : ''}`}
            >
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">
                          {post.author_name || 'Anonymous'}
                        </span>
                        {post.breed_tag && (
                          <span className="text-xs bg-deep-green/10 text-deep-green px-2 py-0.5 rounded-full">{post.breed_tag}</span>
                        )}
                        {post.city_tag && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{post.city_tag}</span>
                        )}
                        {post.is_flagged && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>
                        )}
                        {tab === 'removed' && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Removed</span>
                        )}
                      </div>
                      {post.caption && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.caption}</p>
                      )}
                      {post.i18n?.hy?.caption && (
                        <p className="text-sm text-deep-green mt-1 line-clamp-2">
                          <span className="inline-block mr-1.5 text-[10px] font-bold bg-deep-green/10 text-deep-green px-1.5 py-0.5 rounded">HY</span>
                          {post.i18n.hy.caption}
                        </p>
                      )}
                      {editingId === post.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            rows={3}
                            disabled={actionLoading === post.id + '-tx'}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green resize-y disabled:bg-gray-50"
                            placeholder={actionLoading === post.id + '-tx' ? 'Թարգմանվում է…' : 'Հայերեն թարգմանություն…'}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveHyTranslation(post)}
                              disabled={actionLoading === post.id + '-hy' || actionLoading === post.id + '-tx' || !editingText.trim()}
                              className="px-3 py-1.5 text-xs font-medium bg-deep-green text-white rounded-lg hover:bg-deep-green/90 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === post.id + '-hy' ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => retranslate(post)}
                              disabled={actionLoading === post.id + '-tx' || !post.caption}
                              className="px-3 py-1.5 text-xs font-medium border border-deep-green/30 text-deep-green rounded-lg hover:bg-deep-green/5 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === post.id + '-tx' ? 'Translating…' : 'Re-translate'}
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditingText(''); }}
                              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => openEditor(post)}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-deep-green/30 text-deep-green rounded-lg hover:bg-deep-green/5 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          {post.i18n?.hy?.caption ? 'Edit Armenian Translation' : 'Add Armenian Translation'}
                        </button>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>{new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                          {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          {post.comments_count}
                        </span>
                        {post.report_count > 0 && (
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {post.report_count} report{post.report_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {tab !== 'removed' && (
                        <button
                          onClick={() => toggleFlagged(post)}
                          disabled={actionLoading === post.id + '-flag'}
                          title={post.is_flagged ? 'Remove flag' : 'Flag post'}
                          className={`p-2 rounded-lg transition-colors text-sm ${post.is_flagged ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </button>
                      )}
                      {tab === 'removed' ? (
                        <button
                          onClick={() => restorePost(post)}
                          disabled={actionLoading === post.id + '-hide'}
                          title="Restore post"
                          className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs font-medium"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => removePost(post)}
                          disabled={actionLoading === post.id + '-hide'}
                          title="Remove post"
                          className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
