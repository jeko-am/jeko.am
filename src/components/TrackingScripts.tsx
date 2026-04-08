'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';

interface AnalyticsPixel {
  id: string;
  name: string;
  type: string;
  pixel_id: string;
  script_head: string;
  script_body: string;
  is_active: boolean;
}

interface SeoSettings {
  custom_head_enabled?: boolean;
  custom_head_code?: string;
}

export default function TrackingScripts() {
  const [pixels, setPixels] = useState<AnalyticsPixel[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracking() {
      try {
        // Fetch active pixels from analytics_pixels table (managed in Settings > Pixels & Tags)
        const { data: pixelData } = await supabase
          .from('analytics_pixels')
          .select('*')
          .eq('is_active', true);
        if (pixelData) setPixels(pixelData as AnalyticsPixel[]);

        // Fetch custom head code from SEO page sections (managed in Store Editor > SEO)
        const { data: pages } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'seo-tracking')
          .limit(1);
        if (pages?.[0]) {
          const { data: sections } = await supabase
            .from('page_sections')
            .select('content')
            .eq('page_id', pages[0].id);
          if (sections) {
            const merged = sections.reduce((acc, s) => ({ ...acc, ...s.content }), {} as SeoSettings);
            setSeoSettings(merged);
          }
        }
      } catch (error) {
        console.error('Error fetching tracking settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, []);

  if (loading) return null;

  const ga = pixels.find(p => p.type === 'Google Analytics' && p.pixel_id);
  const fbPixel = pixels.find(p => p.type === 'Facebook Pixel' && p.pixel_id);
  const gtm = pixels.find(p => p.type === 'Google Tag Manager' && p.pixel_id);
  const tiktok = pixels.find(p => p.type === 'TikTok Pixel' && p.pixel_id);
  const hotjar = pixels.find(p => p.type === 'Hotjar' && p.pixel_id);
  const customPixels = pixels.filter(p => p.type === 'Custom' && p.script_head);

  return (
    <>
      {/* Google Tag Manager */}
      {gtm && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtm.pixel_id}');
            `,
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga.pixel_id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga.pixel_id}');
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {fbPixel && (
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixel.pixel_id}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* TikTok Pixel */}
      {tiktok && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${tiktok.pixel_id}');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {/* Hotjar */}
      {hotjar && (
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${hotjar.pixel_id},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}

      {/* Custom pixel scripts (from script_head field) */}
      {customPixels.map(pixel => (
        <Script
          key={pixel.id}
          id={`custom-pixel-${pixel.id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: pixel.script_head }}
        />
      ))}

      {/* Any pixel with a custom script_head override (non-standard types using raw scripts) */}
      {pixels.filter(p => p.type !== 'Custom' && p.script_head).map(pixel => (
        <Script
          key={`head-${pixel.id}`}
          id={`pixel-head-${pixel.id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: pixel.script_head }}
        />
      ))}

      {/* Custom Head Code from Store Editor SEO settings */}
      {seoSettings?.custom_head_enabled && seoSettings.custom_head_code && (
        <Script
          id="custom-head-code"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: seoSettings.custom_head_code }}
        />
      )}
    </>
  );
}
