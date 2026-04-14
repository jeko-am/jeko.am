'use client';

import { usePathname } from 'next/navigation';
import DogChatbot from './DogChatbot';
import { useCart } from '@/lib/cart-context';

export default function ConditionalDogChatbot() {
  const pathname = usePathname();
  const { isOpen: isCartOpen } = useCart();

  // Hide chatbot on auth pages, checkout page, and when side cart is open
  const isAuthPage = pathname.startsWith('/auth/') || pathname.startsWith('/admin/auth/');
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isSwipePage = pathname.startsWith('/swipe');

  if (isAuthPage || isCheckoutPage || isSwipePage || isCartOpen) {
    return null;
  }

  return <DogChatbot />;
}
