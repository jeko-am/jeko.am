'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSignupUrl } from '@/lib/useSignupUrl';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MatchingModal({ content }: { content?: Record<string, any> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const enabled = content?.enabled !== false;
  const heading = content?.heading || 'Register Your Pet & Save!';
  const description = content?.description || 'Create a free account to unlock exclusive sales, personalised meal plans, and special care facilities for your furry friend.';
  const image = content?.image || '/WhatsApp Image 2026-04-11 at 09.54.12.jpeg';
  const ctaText = content?.cta_text || 'Register My Pet';
  const signupUrl = useSignupUrl();
  const ctaUrl = content?.cta_url || signupUrl;
  const closeText = content?.close_text || 'Maybe later';

  useEffect(() => {
    setIsMounted(true);
    // Check if user has dismissed this modal before
    const isDismissed = localStorage.getItem('matchingModal_dismissed');
    if (!isDismissed && enabled) {
      // Delay popup so visitors can explore the site first
      const t = setTimeout(() => setIsOpen(true), 6000);
      return () => clearTimeout(t);
    }
  }, [enabled]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('matchingModal_dismissed', 'true');
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-[85vw] max-w-[340px] sm:w-auto sm:max-w-4xl md:aspect-[2/1] overflow-hidden flex flex-col md:flex-row max-h-[75vh] sm:max-h-[90vh] md:max-h-none">
          {/* Image Section - 1:1 Square */}
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-off-white overflow-hidden flex-shrink-0">
            <img
              src={image}
              alt={heading}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-3 sm:p-6 md:p-8 flex flex-col justify-between relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-1.5 sm:top-4 right-1.5 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-4 sm:w-6 h-4 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-base sm:text-2xl font-bold text-deep-green mb-1 sm:mb-3 font-rubik">
                {heading}
              </h2>
              <p className="text-deep-green/60 text-[11px] sm:text-sm leading-tight sm:leading-relaxed mb-2 sm:mb-4">
                {description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-1 sm:gap-2">
              <Link
                href={ctaUrl}
                onClick={handleClose}
                className="w-full bg-gold hover:bg-yellow-500 text-deep-green font-bold py-1.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-center text-xs sm:text-base"
              >
                {ctaText}
              </Link>
              <button
                onClick={handleClose}
                className="w-full text-deep-green font-semibold py-1 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-2xl transition-colors duration-200 text-[11px] sm:text-sm hover:bg-gray-100"
              >
                {closeText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
