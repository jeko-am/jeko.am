"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomNavBar from "./BottomNavBar";
import { useIsMobile } from "@/lib/useIsMobile";

// Pages where the fixed mobile app nav should not render.
const EXCLUDED_PATHS = ["/admin"];
// Full-screen flows keep the nav, but should not add extra scrollable space below it.
const NO_PADDING_PATHS = ["/auth", "/login", "/signup", "/checkout"];

export default function MobileNavWrapper() {
  const { isMobile, isLoaded } = useIsMobile();
  const pathname = usePathname();
  const excluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  const showNav = isLoaded && isMobile && !excluded;
  const reserveSpace = showNav && !NO_PADDING_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    document.body.classList.toggle("mobile-bottom-nav-visible", reserveSpace);
    return () => document.body.classList.remove("mobile-bottom-nav-visible");
  }, [reserveSpace]);

  if (!isLoaded || !isMobile) return null;
  if (excluded) return null;

  return <BottomNavBar />;
}
