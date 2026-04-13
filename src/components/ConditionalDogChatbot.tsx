'use client';

import { usePathname } from 'next/navigation';
import DogChatbot from './DogChatbot';

export default function ConditionalDogChatbot() {
  const pathname = usePathname();

  // Hide chatbot on auth pages
  const isAuthPage = pathname.startsWith('/auth/') || pathname.startsWith('/admin/auth/');

  if (isAuthPage) {
    return null;
  }

  return <DogChatbot />;
}
