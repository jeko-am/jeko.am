'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Pages with no header nav — always show the button regardless of scroll
const HEADERLESS_PATHS = ['/auth/login', '/auth/signup', '/login', '/forgot-password'];

export default function DesktopHomeButton() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHeaderless = HEADERLESS_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Don't show on home page or admin
  if (pathname === '/' || pathname.startsWith('/admin')) return null;

  const visible = isHeaderless || scrolled;

  return (
    <Link
      href="/"
      className={`hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-2 bg-deep-green text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-deep-green/90 transition-all duration-300 text-sm font-medium ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      Home
    </Link>
  );
}
