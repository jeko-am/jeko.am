'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DogChatbot, { type ChatbotContent } from './DogChatbot';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';

export default function ConditionalDogChatbot() {
  const pathname = usePathname();
  const { isOpen: isCartOpen } = useCart();
  const [content, setContent] = useState<ChatbotContent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: pages } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'global-chatbot')
          .limit(1);
        const pageId = pages?.[0]?.id;
        if (!pageId) { if (!cancelled) setLoaded(true); return; }
        const { data: secs } = await supabase
          .from('page_sections')
          .select('content, is_visible')
          .eq('page_id', pageId);
        const sec = secs?.find((s) => {
          const c = s.content as Record<string, unknown> | null;
          return c?._section_index === 0;
        });
        if (cancelled) return;
        if (sec && sec.is_visible !== false) {
          setContent(sec.content as ChatbotContent);
        }
        setLoaded(true);
      } catch {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Hide chatbot on auth pages, checkout page, and when side cart is open
  const isAuthPage = pathname.startsWith('/auth/') || pathname.startsWith('/admin/auth/');
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isSwipePage = pathname.startsWith('/swipe');

  if (isAuthPage || isCheckoutPage || isSwipePage || isCartOpen) {
    return null;
  }

  // Hide if explicitly disabled via admin
  if (loaded && content && content.enabled === false) return null;

  return <DogChatbot content={content || undefined} />;
}
