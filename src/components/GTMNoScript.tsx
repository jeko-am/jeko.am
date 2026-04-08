'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function GTMNoScript() {
  const [gtmId, setGtmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGTMId() {
      try {
        // Read from analytics_pixels table (managed in Settings > Pixels & Tags)
        const { data } = await supabase
          .from('analytics_pixels')
          .select('pixel_id')
          .eq('type', 'Google Tag Manager')
          .eq('is_active', true)
          .limit(1);
        if (data?.[0]?.pixel_id) {
          setGtmId(data[0].pixel_id);
        }
      } catch (error) {
        console.error('Error fetching GTM settings:', error);
      }
    }
    fetchGTMId();
  }, []);

  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
