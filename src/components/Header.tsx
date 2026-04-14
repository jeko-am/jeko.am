"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth";
import { useSignupUrl } from "@/lib/useSignupUrl";

const aboutDropdown = [
  { label: "Our story", href: "/about" },
];

const communityDropdown = [
  { label: "Social Feed", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "Swipe & Match", href: "/swipe" },
  { label: "My Matches", href: "/matches" },
  { label: "Find Owners", href: "/find-owners" },
  { label: "Messages", href: "/messages" },
];

const healthDropdown = [
  { label: "Colitis", href: "/benefits/colitis" },
  { label: "Digestion issues", href: "/benefits/digestion-issues" },
  { label: "Hypoallergenic", href: "/benefits/hypoallergenic" },
  { label: "Pancreatitis", href: "/benefits/pancreatitis" },
  { label: "Weight management", href: "/benefits/weight-management" },
];

const defaultNavItems = [
  { label: "About", href: "/about", hasDropdown: true, dropdown: aboutDropdown },
  { label: "Community", href: "/community", hasDropdown: true, dropdown: communityDropdown },
  { label: "Shop", href: "/products", hasDropdown: false, dropdown: [] },
  { label: "Reviews", href: "/reviews", hasDropdown: false, dropdown: [] },
  { label: "Health & breeds", href: "/benefits", hasDropdown: true, dropdown: healthDropdown },
];

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 48 48"
    style={{ fill: 'currentcolor' }}
    className="ml-1 inline-block"
  >
    <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6H21M3 12H21M3 18H21"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
      fill="currentColor"
    />
    <path
      d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
      fill="currentColor"
    />
    <path
      d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6924 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ content }: { content?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const logoText = content?.logo_text ?? "JEKO";
  const ctaText = content?.cta_text ?? "Sign up";
  const signupUrl = useSignupUrl();
  const ctaUrl = content?.cta_url ?? signupUrl;
  const helpUrl = content?.help_url ?? "/contact";
  const loginUrl = content?.login_url ?? "/login";

  const navItems = content
    ? [
        { label: content.nav_1_label ?? "About", href: content.nav_1_url ?? "/about", hasDropdown: true, dropdown: aboutDropdown },
        { label: content.nav_2_label ?? "Community", href: content.nav_2_url ?? "/community", hasDropdown: true, dropdown: communityDropdown },
        { label: content.nav_3_label ?? "Shop", href: content.nav_3_url ?? "/products", hasDropdown: false, dropdown: [] as { label: string; href: string }[] },
        { label: content.nav_4_label ?? "Reviews", href: content.nav_4_url ?? "/reviews", hasDropdown: false, dropdown: [] as { label: string; href: string }[] },
        { label: content.nav_5_label ?? "Health & breeds", href: content.nav_5_url ?? "/benefits", hasDropdown: true, dropdown: healthDropdown },
      ]
    : defaultNavItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Main header bar */}
      <div className="bg-deep-green h-[64px] lg:h-[80px] header-zigzag-bottom">
        <div className="max-w-[1400px] mx-auto h-full px-5 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span
              className="text-[36px] lg:text-[42px] leading-none select-none"
              style={{
                fontFamily: "'TR Frankfurter', 'Rubik', sans-serif",
                color: '#F2A900',
                transform: 'rotate(-6deg)',
                display: 'inline-block',
              }}
            >
              {logoText}
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="text-white text-[18px] font-rubik font-medium hover:opacity-80 transition-opacity flex items-center whitespace-nowrap py-6"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown />}
                </Link>
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-deep-green rounded-b-lg shadow-xl min-w-[220px] py-2 z-50">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-5 py-2.5 text-white text-[16px] hover:bg-white/10 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-white hover:opacity-80 transition-opacity"
              aria-label="Shopping cart"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-deep-green text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            
            {!scrolled && (
              <>
                <Link
                  href={helpUrl}
                  className="text-white text-[18px] font-rubik font-medium hover:opacity-80 transition-opacity"
                >
                  Help
                </Link>
                {user ? (
                  <div className="flex items-center gap-3">
                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        className="bg-white/10 backdrop-blur-sm text-white text-[16px] font-rubik font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Console
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        className="bg-white/10 backdrop-blur-sm text-white text-[16px] font-rubik font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="bg-red-500/20 backdrop-blur-sm text-white text-[16px] font-rubik font-medium px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      )}
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  <Link
                    href={loginUrl}
                    className="text-white text-[18px] font-rubik font-medium hover:opacity-80 transition-opacity"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
            {!user && (
              <Link
                href={ctaUrl}
                className="bg-gold text-deep-green text-[18px] font-rubik font-semibold px-6 py-2.5 rounded-lg hover:bg-[#d99500] transition-colors whitespace-nowrap"
              >
                {ctaText}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden flex items-center justify-center p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-deep-green border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-0">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setMobileActiveDropdown(mobileActiveDropdown === item.label ? null : item.label)}
                      className="w-full text-white text-[18px] font-rubik font-medium py-3 flex items-center justify-between border-b border-white/10 hover:opacity-80 transition-opacity text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronDown />
                    </button>
                    {mobileActiveDropdown === item.label && (
                      <div className="bg-deep-green/80 border-b border-white/10">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-6 py-2.5 text-white text-[16px] hover:bg-white/10 transition-colors border-b border-white/5"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileActiveDropdown(null);
                            }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white text-[18px] font-rubik font-medium py-3 flex items-center justify-between border-b border-white/10 hover:opacity-80 transition-opacity block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}

            <div className="border-b border-white/10" />

            <Link
              href={helpUrl}
              className="text-white text-[18px] font-rubik font-medium py-3 hover:opacity-80 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="text-white text-[18px] font-rubik font-medium py-3 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Console
                  </Link>
                ) : (
                  <Link
                    href="/profile"
                    className="text-white text-[18px] font-rubik font-medium py-3 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 px-4"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await signOut();
                    } finally {
                      setIsLoggingOut(false);
                      setMobileMenuOpen(false);
                    }
                  }}
                  disabled={isLoggingOut}
                  className="text-white text-[18px] font-rubik font-medium py-3 hover:bg-red-500/20 transition-all duration-200 flex items-center gap-3 px-4 w-full text-left disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <Link
                href={loginUrl}
                className="text-white text-[18px] font-rubik font-medium py-3 hover:opacity-80 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}

            {!user && (
              <Link
                href={ctaUrl}
                className="bg-gold text-deep-green text-[18px] font-rubik font-semibold px-6 py-3 rounded-lg hover:bg-[#d99500] transition-colors text-center mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaText}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
