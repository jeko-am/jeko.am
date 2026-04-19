'use client';

import { useAuth } from '@/lib/auth';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import {
  getBreedsByPetType,
  PET_TYPES,
  DIET_PREFERENCES,
  TEMPERAMENTS,
  DISABILITIES,
  ALLERGIES,
} from '@/lib/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Quiz step definitions                                              */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 9;

const STEP_TITLES = [
  'What type of pet do you have?',
  'What breed?',
  'Personality',
  'Health & special needs',
  'What do they love?',
  'Looking for a match?',
  'Add a photo & bio',
  'Where are you located?',
  'Create your account',
];

const STEP_MESSAGES = [
  '🚀 Let\'s get started!',
  '✨ Great start!',
  '🎯 You\'re on a roll!',
  '💪 Halfway there!',
  '🔥 Getting warmer!',
  '💕 One more thing...',
  '✅ Getting close now!',
  '🏁 Last lap!',
  '🎊 Final step!',
];

/* ------------------------------------------------------------------ */
/*  Tiny icons                                                         */
/* ------------------------------------------------------------------ */

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline-block ml-0.5">
      <ellipse cx="8" cy="6.5" rx="2.2" ry="2.8" />
      <ellipse cx="16" cy="6.5" rx="2.2" ry="2.8" />
      <ellipse cx="4.5" cy="12" rx="2" ry="2.5" />
      <ellipse cx="19.5" cy="12" rx="2" ry="2.5" />
      <path d="M7.5 16.5C7.5 14 9.5 12.5 12 12.5C14.5 12.5 16.5 14 16.5 16.5C16.5 19 14.5 21 12 21C9.5 21 7.5 19 7.5 16.5Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Quiz option card                                                   */
/* ------------------------------------------------------------------ */

function QuizCard({
  icon,
  label,
  sublabel,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl border-2
        transition-all duration-200 cursor-pointer min-h-[100px]
        ${selected
          ? 'border-deep-green bg-deep-green/5 shadow-md scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-gold/60 hover:shadow-sm'
        }
      `}
    >
      <div className={`${selected ? 'text-deep-green' : 'text-gray-400'} transition-colors`}>{icon}</div>
      <span className={`text-sm font-semibold ${selected ? 'text-deep-green' : 'text-gray-700'}`}>{label}</span>
      {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-deep-green rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG icons for quiz cards                                           */
/* ------------------------------------------------------------------ */

const QIcon = {
  dog: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.855-1.53 1.844-3.063" />
      <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.53-1.844-3.063" />
      <path d="M12 12c-2.5 0-5 2-5 5 0 2 1.5 4 5 4s5-2 5-4c0-3-2.5-5-5-5z" />
      <circle cx="10" cy="16" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="16" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  cat: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4.97 0 9-2.686 9-6v-1.5c0-2.5-1-4-2.5-5L20 3l-4 3h-8L4 3l1.5 6.5C4 10.5 3 12 3 14.5V16c0 3.314 4.03 6 9 6z" />
      <circle cx="9.5" cy="14" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14" r="0.75" fill="currentColor" stroke="none" />
      <path d="M10 17.5c.5.5 1.5 1 2 1s1.5-.5 2-1" />
    </svg>
  ),
  paw: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="16" cy="6.5" rx="2" ry="2.5" />
      <ellipse cx="5" cy="12" rx="1.8" ry="2.2" />
      <ellipse cx="19" cy="12" rx="1.8" ry="2.2" />
      <path d="M8 16.5C8 14.5 9.5 13 12 13s4 1.5 4 3.5S14.5 20 12 20s-4-1.5-4-3.5z" />
    </svg>
  ),
  male: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10.5" cy="14.5" r="5.5" />
      <path d="M15 9l5-5m0 0h-4.5M20 4v4.5" />
    </svg>
  ),
  female: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <path d="M12 14.5V21m-3-3h6" />
    </svg>
  ),
  calm: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14.5c1 1.5 2.5 2 4 2s3-.5 4-2" />
      <path d="M9 9h0M15 9h0" strokeWidth="2" />
    </svg>
  ),
  playful: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="7" />
      <path d="M9 6l-1.5-3M15 6l1.5-3" />
      <circle cx="10" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="12" r="0.75" fill="currentColor" stroke="none" />
      <path d="M9.5 15c.8 1 1.5 1.2 2.5 1.2s1.7-.2 2.5-1.2" />
    </svg>
  ),
  energetic: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  shy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" />
      <path d="M9.5 10c-.2-.4-.8-.8-1.5-.8s-1.3.4-1.5.8" />
      <path d="M17.5 10c-.2-.4-.8-.8-1.5-.8s-1.3.4-1.5.8" />
    </svg>
  ),
  protective: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7.794 3.897A1 1 0 0120.5 7.82v4.13c0 4.5-3.5 8.05-8.5 9.55-5-1.5-8.5-5.05-8.5-9.55V7.82a1 1 0 01.706-.923L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  friendly: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  yes: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v4a5 5 0 0010 0v-4" />
      <path d="M12 14v4m-3 0h6" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <path d="M4.5 7C5 4.5 7 3 9 3c1 0 2 .5 3 1.5C13 3.5 14 3 15 3c2 0 4 1.5 4.5 4" />
      <path d="M10 17.5c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
    </svg>
  ),
  no: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  heart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  raw: (
    /* Meat cut on bone — T-bone shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 9.5C4.5 6 7 3.5 10.5 3.5c2.5 0 4.5 1 5.5 3l1 2c.5 1.5.5 3-.5 4.5-1.5 2-4 3-7 3C6 16 4.5 13 4.5 9.5z" />
      <line x1="14" y1="16" x2="17" y2="21" />
      <circle cx="17.5" cy="21.5" r="1" />
    </svg>
  ),
  kibble: (
    /* Bag of kibble with paw */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M6 8l1-4h10l1 4" />
      <path d="M9 4v-1M15 4v-1" />
      <circle cx="10.5" cy="13" r="0.9" fill="currentColor" opacity="0.4" />
      <circle cx="13.5" cy="13" r="0.9" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  mixed: (
    /* Fork and knife crossed */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v5c0 1.7 1.3 3 3 3v9" />
      <line x1="7" y1="3" x2="7" y2="8" />
      <line x1="10" y1="3" x2="10" y2="8" />
      <line x1="8.5" y1="3" x2="8.5" y2="8" />
      <path d="M17 3c0 0-2 1-2 5s2 4 2 4v8" />
    </svg>
  ),
  homemade: (
    /* Cooking pot with steam */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h12v6a3 3 0 01-3 3H9a3 3 0 01-3-3v-6z" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="3" y1="15" x2="6" y2="15" />
      <line x1="18" y1="15" x2="21" y2="15" />
      <path d="M8 9c.5-1.5 1-3 1-3" />
      <path d="M12 8c.5-2 1-4 1-4" />
      <path d="M16 9c.5-1.5 1-3 1-3" />
    </svg>
  ),
  plant: (
    /* Leaf — Jeko natural brand */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-4 0-7-3-7-7 0-5 5-10 7-11 2 1 7 6 7 11 0 4-3 7-7 7z" />
      <line x1="12" y1="10" x2="12" y2="21" />
      <path d="M9 14l3-3 3 3" />
    </svg>
  ),
  chicken: (
    /* Drumstick — clear poultry leg shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="14" cy="7" rx="5" ry="4" />
      <path d="M10 10l-3 5" />
      <rect x="5.5" y="14.5" width="3" height="6" rx="1.5" transform="rotate(-30 7 17.5)" />
    </svg>
  ),
  beef: (
    /* Steak — thick cut of meat */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10c0-3 3.5-6 8-6s8 3 8 6-3.5 5-8 5-8-2-8-5z" />
      <path d="M4 10c0 2 0 4 0 5 0 3 3.5 5 8 5s8-2 8-5c0-1 0-3 0-5" />
      <ellipse cx="12" cy="10" rx="3" ry="2" />
    </svg>
  ),
  lamb: (
    /* Lamb chop — rack of ribs shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6c0-1.5 2.5-3 6-3s6 1.5 6 3c0 2-1 5-2 7l-1 3H9l-1-3c-1-2-2-5-2-7z" />
      <line x1="9" y1="16" x2="8" y2="21" />
      <line x1="15" y1="16" x2="16" y2="21" />
      <line x1="10" y1="7" x2="10" y2="12" />
      <line x1="14" y1="7" x2="14" y2="12" />
    </svg>
  ),
  vegetables: (
    /* Broccoli — clear tree shape */
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" />
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <circle cx="9.5" cy="12" r="2.5" />
      <circle cx="14.5" cy="12" r="2.5" />
      <rect x="11" y="14" width="2" height="7" rx="1" />
    </svg>
  ),
  low: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 13h8" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  moderate: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v2l2 2-2 4h3l-4 8v-5H9l4-7V4z" />
    </svg>
  ),
  high: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  veryHigh: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  /* Disability & allergy icons */
  none: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  blind: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  deaf: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 00-9.33-5" />
      <path d="M2 2l20 20" />
      <path d="M6 8v1a6 6 0 006 6h0" />
      <path d="M17 14a3 3 0 01-3 3" />
      <path d="M9 21h6" />
    </svg>
  ),
  mobility: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="2" />
      <path d="M15 22v-4h-2l-1-4-4 1v4" />
      <path d="M9.5 10l3.5-1 2 4" />
      <path d="M6 14l3-1" />
    </svg>
  ),
  amputee: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20a6 6 0 00-12 0" />
      <circle cx="12" cy="10" r="4" />
      <path d="M8 14v6" />
    </svg>
  ),
  epilepsy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  anxiety: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 15s1.5-2 4-2 4 2 4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
    </svg>
  ),
  other: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  allergyNone: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  grain: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-9" />
      <path d="M8 8c0 0 0 4 4 4s4-4 4-4" />
      <path d="M6 5c0 0 1 3 3 3" />
      <path d="M15 8c2 0 3-3 3-3" />
      <path d="M10 4c0 0 0 2 2 2s2-2 2-2" />
    </svg>
  ),
  dairy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l1 5H7l1-5z" />
      <path d="M7 7h10v3a8 8 0 01-1 4l-1 2v4H9v-4L8 14a8 8 0 01-1-4V7z" />
    </svg>
  ),
  eggs: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4.418 0 8-4.03 8-9S16.418 2 12 2 4 6.03 4 13s3.582 9 8 9z" />
      <circle cx="12" cy="14" r="3" />
    </svg>
  ),
  soy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="9" cy="12" rx="3" ry="4" />
      <ellipse cx="15" cy="12" rx="3" ry="4" />
      <path d="M12 8V3" />
      <path d="M10 5l2-2 2 2" />
    </svg>
  ),
  fish: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c3-6 10-6 14-2-4 4-11 4-14-2 0 0 3 6 0 12" />
      <circle cx="16" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  ),
  pollen: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  dust: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="10" r="1" />
      <circle cx="12" cy="16" r="2" />
      <circle cx="6" cy="14" r="1" />
      <circle cx="18" cy="16" r="1.5" />
    </svg>
  ),
  flea: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14" rx="4" ry="6" />
      <circle cx="12" cy="6" r="3" />
      <path d="M5 10l3 2M19 10l-3 2M5 18l3-1M19 18l-3-1" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Breed Autocomplete                                                 */
/* ------------------------------------------------------------------ */

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  allowFreeText = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  allowFreeText?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (allowFreeText && query.trim() && !value) {
          onChange(query.trim());
        }
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [allowFreeText, query, value, onChange]);

  // Free text mode: show a text input when no options available
  if (allowFreeText && options.length === 0) {
    return (
      <div className="w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow bg-white ${
            error ? 'border-red-400' : 'border-gray-200'
          }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery(''); }}
        className={`w-full px-5 py-3.5 border-2 rounded-xl text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow bg-white flex items-center justify-between ${
          error ? 'border-red-400' : 'border-gray-200'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {(options.length > 6 || allowFreeText) && (
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (allowFreeText && e.key === 'Enter' && query.trim()) {
                    e.preventDefault();
                    onChange(query.trim());
                    setOpen(false);
                    setQuery('');
                  }
                }}
                placeholder={allowFreeText ? "Search or type your own..." : "Search..."}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-deep-green"
              />
            </div>
          )}
          <ul className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && !allowFreeText && (
              <li className="px-5 py-3 text-sm text-gray-400">No results</li>
            )}
            {filtered.length === 0 && allowFreeText && query.trim() && (
              <li>
                <button
                  type="button"
                  className="w-full text-left px-5 py-2.5 text-sm text-deep-green hover:bg-deep-green/5 transition-colors"
                  onMouseDown={(e) => { e.preventDefault(); onChange(query.trim()); setOpen(false); setQuery(''); }}
                >
                  Use &quot;{query.trim()}&quot;
                </button>
              </li>
            )}
            {filtered.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                    opt === value ? 'bg-deep-green/10 text-deep-green font-medium' : 'hover:bg-deep-green/5 text-gray-800'
                  }`}
                  onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); setQuery(''); }}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function BreedAutocomplete({
  value,
  onChange,
  error,
  petType = 'Dog',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  petType?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const breeds = getBreedsByPetType(petType);
    if (!search.trim()) return breeds;
    const q = search.toLowerCase();
    return breeds.filter((b) => b.toLowerCase().includes(q));
  }, [search, petType]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Scroll selected breed into view when dropdown opens
  useEffect(() => {
    if (open && value && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) selected.scrollIntoView({ block: 'nearest' });
    }
  }, [open, value]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(''); }}
        className={`w-full px-5 py-4 border-2 rounded-2xl text-lg text-center transition-shadow flex items-center justify-between ${
          error ? 'border-red-400 ring-1 ring-red-400' : open ? 'border-deep-green ring-2 ring-deep-green' : 'border-gray-200'
        } ${value ? 'text-gray-900' : 'text-gray-400'}`}
      >
        <span className="flex-1">{value || 'Select a breed...'}</span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search breeds..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Results list */}
          <ul ref={listRef} className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length > 0 ? filtered.map((breed) => (
              <li key={breed}>
                <button
                  type="button"
                  data-selected={value === breed}
                  className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${
                    value === breed
                      ? 'bg-deep-green/10 text-deep-green font-medium'
                      : 'text-gray-800 hover:bg-deep-green/5'
                  }`}
                  onMouseDown={(e) => { e.preventDefault(); onChange(breed); setOpen(false); setSearch(''); }}
                >
                  {breed}
                  {value === breed && (
                    <svg className="w-4 h-4 text-deep-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            )) : (
              <li className="px-5 py-4 text-sm text-gray-400 text-center">No breeds found</li>
            )}
          </ul>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main quiz signup page                                              */
/* ------------------------------------------------------------------ */

function SignupPageInner() {
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------- quiz state ---------- */
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);

  /* ---------- form fields ---------- */
  const [petType, setPetType] = useState<string>('');
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [gender, setGender] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activityLevel, setActivityLevel] = useState(''); // Moved to preferences (editable after login)
  // walkPreference & favoriteActivity: saved to DB from profile page, not collected in signup
  const [walkPreference] = useState('');
  const [favoriteActivity] = useState('');
  const [temperament, setTemperament] = useState('');
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [getsAlongWithDogs, setGetsAlongWithDogs] = useState<boolean | null>(null); // Moved to preferences (editable after login)
  const [lookingForMatch, setLookingForMatch] = useState<boolean | null>(null);
  const [lookingForPlaymates, setLookingForPlaymates] = useState(false);
  const [lookingForMate, setLookingForMate] = useState(false);
  const [lookingForWalkingBuddies, setLookingForWalkingBuddies] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [preferredBreed, setPreferredBreed] = useState(''); // Moved to preferences (editable after login)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sameBreedOnly, setSameBreedOnly] = useState(false); // Moved to preferences (editable after login)
  const [preferredRadiusKm] = useState(25);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');
  const uploadPromiseRef = useRef<Promise<string | null> | null>(null);
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Armenia');

  // Dynamic states/cities fetched from API
  const [apiStates, setApiStates] = useState<string[]>([]);
  const [apiCities, setApiCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // States/provinces per country (only countries that need a state field)
  const countryStates: Record<string, string[]> = {
    'United States': ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
    'Canada': ['Alberta','British Columbia','Manitoba','New Brunswick','Newfoundland and Labrador','Nova Scotia','Ontario','Prince Edward Island','Quebec','Saskatchewan','Northwest Territories','Nunavut','Yukon'],
    'Australia': ['New South Wales','Queensland','South Australia','Tasmania','Victoria','Western Australia','Australian Capital Territory','Northern Territory'],
    'India': ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi'],
    'Brazil': ['Acre','Alagoas','Amapa','Amazonas','Bahia','Ceara','Distrito Federal','Espirito Santo','Goias','Maranhao','Mato Grosso','Mato Grosso do Sul','Minas Gerais','Para','Paraiba','Parana','Pernambuco','Piaui','Rio de Janeiro','Rio Grande do Norte','Rio Grande do Sul','Rondonia','Roraima','Santa Catarina','Sao Paulo','Sergipe','Tocantins'],
    'Mexico': ['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Coahuila','Colima','Durango','Guanajuato','Guerrero','Hidalgo','Jalisco','Mexico City','Mexico State','Michoacan','Morelos','Nayarit','Nuevo Leon','Oaxaca','Puebla','Queretaro','Quintana Roo','San Luis Potosi','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatan','Zacatecas'],
    'United Kingdom': ['England','Scotland','Wales','Northern Ireland'],
    'Russia': ['Moscow','Saint Petersburg','Novosibirsk Oblast','Sverdlovsk Oblast','Tatarstan','Krasnodar Krai','Chelyabinsk Oblast','Nizhny Novgorod Oblast','Samara Oblast','Rostov Oblast'],
    'Germany': ['Baden-Wurttemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg','Hesse','Lower Saxony','Mecklenburg-Vorpommern','North Rhine-Westphalia','Rhineland-Palatinate','Saarland','Saxony','Saxony-Anhalt','Schleswig-Holstein','Thuringia'],
    'China': ['Beijing','Shanghai','Guangdong','Zhejiang','Jiangsu','Sichuan','Hubei','Hunan','Fujian','Shandong','Henan','Hebei','Liaoning','Shaanxi','Yunnan'],
    'Argentina': ['Buenos Aires','Catamarca','Chaco','Chubut','Cordoba','Corrientes','Entre Rios','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones','Neuquen','Rio Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucuman'],
    'Italy': ['Abruzzo','Basilicata','Calabria','Campania','Emilia-Romagna','Friuli Venezia Giulia','Lazio','Liguria','Lombardy','Marche','Molise','Piedmont','Puglia','Sardinia','Sicily','Trentino-Alto Adige','Tuscany','Umbria','Veneto'],
    'Spain': ['Andalusia','Aragon','Asturias','Balearic Islands','Basque Country','Canary Islands','Cantabria','Castile and Leon','Castile-La Mancha','Catalonia','Extremadura','Galicia','La Rioja','Madrid','Murcia','Navarre','Valencia'],
    'Japan': ['Hokkaido','Aomori','Iwate','Miyagi','Akita','Tokyo','Osaka','Kyoto','Kanagawa','Aichi','Fukuoka','Hyogo','Saitama','Chiba','Hiroshima','Okinawa'],
  };

  // Cities per country (for countries without states) or per state
  const countryCities: Record<string, string[]> = {
    // Armenia cities (no state needed)
    'Armenia': ['Yerevan','Gyumri','Vanadzor','Vagharshapat','Hrazdan','Abovyan','Kapan','Armavir','Artashat','Goris','Charentsavan','Gavar','Sevan','Artik','Ijevan','Masis','Ashtarak','Ararat','Sisian','Dilijan','Alaverdi','Stepanavan','Martuni','Berd','Yeghegnadzor','Tashir','Spitak','Noyemberyan','Meghri','Byureghavan','Aparan','Vedi','Jermuk','Vayk','Talin','Nor Hachn'],
    // Georgia
    'Georgia': ['Tbilisi','Batumi','Kutaisi','Rustavi','Zugdidi','Gori','Poti','Samtredia','Khashuri','Senaki','Telavi','Ozurgeti','Marneuli','Kaspi','Tskhinvali'],
    // Iran
    'Iran': ['Tehran','Isfahan','Mashhad','Karaj','Tabriz','Shiraz','Ahvaz','Qom','Kermanshah','Rasht','Kerman','Zahedan','Hamadan','Arak','Yazd'],
    // Turkey
    'Turkey': ['Istanbul','Ankara','Izmir','Bursa','Antalya','Adana','Gaziantep','Konya','Mersin','Diyarbakir','Kayseri','Eskisehir','Trabzon','Samsun','Denizli'],
    // France
    'France': ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg','Montpellier','Bordeaux','Lille','Rennes','Reims','Toulon','Saint-Etienne','Le Havre'],
    // UAE
    'United Arab Emirates': ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain','Al Ain'],
    // Lebanon
    'Lebanon': ['Beirut','Tripoli','Sidon','Tyre','Byblos','Jounieh','Zahle','Baalbek'],
    // Netherlands
    'Netherlands': ['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven','Groningen','Tilburg','Almere','Breda','Nijmegen'],
    // Belgium
    'Belgium': ['Brussels','Antwerp','Ghent','Charleroi','Liege','Bruges','Namur','Leuven'],
    // Switzerland
    'Switzerland': ['Zurich','Geneva','Basel','Bern','Lausanne','Winterthur','Lucerne','St. Gallen'],
    // Austria
    'Austria': ['Vienna','Graz','Linz','Salzburg','Innsbruck','Klagenfurt'],
    // Poland
    'Poland': ['Warsaw','Krakow','Lodz','Wroclaw','Poznan','Gdansk','Szczecin','Bydgoszcz','Lublin','Katowice'],
    // Sweden
    'Sweden': ['Stockholm','Gothenburg','Malmo','Uppsala','Vasteras','Orebro','Linkoping','Helsingborg'],
    // Norway
    'Norway': ['Oslo','Bergen','Trondheim','Stavanger','Drammen','Fredrikstad','Kristiansand','Tromso'],
    // Denmark
    'Denmark': ['Copenhagen','Aarhus','Odense','Aalborg','Frederiksberg','Esbjerg'],
    // Finland
    'Finland': ['Helsinki','Espoo','Tampere','Vantaa','Oulu','Turku','Jyvaskyla','Lahti'],
    // Czech Republic
    'Czech Republic': ['Prague','Brno','Ostrava','Plzen','Liberec','Olomouc'],
    // Greece
    'Greece': ['Athens','Thessaloniki','Patras','Heraklion','Larissa','Volos','Ioannina','Kavala'],
    // South Korea
    'South Korea': ['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Suwon','Ulsan','Changwon','Goyang'],
    // Singapore
    'Singapore': ['Singapore'],
    // Egypt
    'Egypt': ['Cairo','Alexandria','Giza','Shubra El Kheima','Port Said','Suez','Luxor','Mansoura','Tanta','Aswan'],
    // South Africa
    'South Africa': ['Johannesburg','Cape Town','Durban','Pretoria','Port Elizabeth','Bloemfontein','Nelspruit','Polokwane','Kimberley','Pietermaritzburg'],
    // Ukraine
    'Ukraine': ['Kyiv','Kharkiv','Odesa','Dnipro','Lviv','Zaporizhzhia','Vinnytsia','Poltava','Chernihiv','Ivano-Frankivsk'],
    // Azerbaijan
    'Azerbaijan': ['Baku','Ganja','Sumgait','Mingachevir','Shirvan','Nakhchivan','Sheki','Lankaran'],
    // New Zealand
    'New Zealand': ['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Napier','Palmerston North'],
    // Philippines
    'Philippines': ['Manila','Quezon City','Davao','Caloocan','Cebu City','Zamboanga','Antipolo','Pasig','Taguig','Makati'],
    // Thailand
    'Thailand': ['Bangkok','Chiang Mai','Pattaya','Phuket','Nakhon Ratchasima','Udon Thani','Khon Kaen','Hat Yai'],
    // US states -> cities
    'US-Alabama': ['Birmingham','Montgomery','Huntsville','Mobile','Tuscaloosa'],
    'US-Alaska': ['Anchorage','Fairbanks','Juneau','Sitka','Ketchikan'],
    'US-Arizona': ['Phoenix','Tucson','Mesa','Chandler','Scottsdale','Tempe'],
    'US-Arkansas': ['Little Rock','Fort Smith','Fayetteville','Springdale','Jonesboro'],
    'US-California': ['Los Angeles','San Francisco','San Diego','San Jose','Sacramento','Oakland','Fresno','Long Beach','Irvine','Santa Monica'],
    'US-Colorado': ['Denver','Colorado Springs','Aurora','Fort Collins','Boulder','Lakewood'],
    'US-Connecticut': ['Hartford','New Haven','Bridgeport','Stamford','Waterbury'],
    'US-Delaware': ['Wilmington','Dover','Newark','Middletown','Smyrna'],
    'US-Florida': ['Miami','Orlando','Tampa','Jacksonville','Fort Lauderdale','St. Petersburg','Tallahassee'],
    'US-Georgia': ['Atlanta','Savannah','Augusta','Columbus','Macon','Athens'],
    'US-Hawaii': ['Honolulu','Hilo','Kailua','Pearl City','Kapolei'],
    'US-Idaho': ['Boise','Meridian','Nampa','Idaho Falls','Pocatello'],
    'US-Illinois': ['Chicago','Aurora','Naperville','Rockford','Springfield','Peoria'],
    'US-Indiana': ['Indianapolis','Fort Wayne','Evansville','South Bend','Carmel'],
    'US-Iowa': ['Des Moines','Cedar Rapids','Davenport','Sioux City','Iowa City'],
    'US-Kansas': ['Wichita','Overland Park','Kansas City','Olathe','Topeka'],
    'US-Kentucky': ['Louisville','Lexington','Bowling Green','Owensboro','Covington'],
    'US-Louisiana': ['New Orleans','Baton Rouge','Shreveport','Lafayette','Lake Charles'],
    'US-Maine': ['Portland','Lewiston','Bangor','South Portland','Auburn'],
    'US-Maryland': ['Baltimore','Columbia','Germantown','Silver Spring','Annapolis'],
    'US-Massachusetts': ['Boston','Worcester','Springfield','Cambridge','Lowell'],
    'US-Michigan': ['Detroit','Grand Rapids','Ann Arbor','Lansing','Flint','Kalamazoo'],
    'US-Minnesota': ['Minneapolis','Saint Paul','Rochester','Duluth','Bloomington'],
    'US-Mississippi': ['Jackson','Gulfport','Southaven','Hattiesburg','Biloxi'],
    'US-Missouri': ['Kansas City','St. Louis','Springfield','Columbia','Independence'],
    'US-Montana': ['Billings','Missoula','Great Falls','Bozeman','Helena'],
    'US-Nebraska': ['Omaha','Lincoln','Bellevue','Grand Island','Kearney'],
    'US-Nevada': ['Las Vegas','Henderson','Reno','North Las Vegas','Sparks'],
    'US-New Hampshire': ['Manchester','Nashua','Concord','Dover','Rochester'],
    'US-New Jersey': ['Newark','Jersey City','Paterson','Elizabeth','Edison','Trenton'],
    'US-New Mexico': ['Albuquerque','Las Cruces','Rio Rancho','Santa Fe','Roswell'],
    'US-New York': ['New York City','Buffalo','Rochester','Yonkers','Syracuse','Albany'],
    'US-North Carolina': ['Charlotte','Raleigh','Greensboro','Durham','Winston-Salem'],
    'US-North Dakota': ['Fargo','Bismarck','Grand Forks','Minot','West Fargo'],
    'US-Ohio': ['Columbus','Cleveland','Cincinnati','Toledo','Akron','Dayton'],
    'US-Oklahoma': ['Oklahoma City','Tulsa','Norman','Broken Arrow','Edmond'],
    'US-Oregon': ['Portland','Salem','Eugene','Gresham','Hillsboro','Bend'],
    'US-Pennsylvania': ['Philadelphia','Pittsburgh','Allentown','Erie','Reading','Harrisburg'],
    'US-Rhode Island': ['Providence','Warwick','Cranston','Pawtucket','East Providence'],
    'US-South Carolina': ['Charleston','Columbia','Greenville','Rock Hill','Mount Pleasant'],
    'US-South Dakota': ['Sioux Falls','Rapid City','Aberdeen','Brookings','Watertown'],
    'US-Tennessee': ['Nashville','Memphis','Knoxville','Chattanooga','Clarksville'],
    'US-Texas': ['Houston','San Antonio','Dallas','Austin','Fort Worth','El Paso','Arlington'],
    'US-Utah': ['Salt Lake City','West Valley City','Provo','West Jordan','Orem','Sandy'],
    'US-Vermont': ['Burlington','South Burlington','Rutland','Essex Junction','Barre'],
    'US-Virginia': ['Virginia Beach','Norfolk','Chesapeake','Richmond','Newport News','Alexandria'],
    'US-Washington': ['Seattle','Spokane','Tacoma','Vancouver','Bellevue','Olympia'],
    'US-West Virginia': ['Charleston','Huntington','Morgantown','Parkersburg','Wheeling'],
    'US-Wisconsin': ['Milwaukee','Madison','Green Bay','Kenosha','Racine','Appleton'],
    'US-Wyoming': ['Cheyenne','Casper','Laramie','Gillette','Rock Springs'],
    // Canada provinces -> cities
    'CA-Alberta': ['Calgary','Edmonton','Red Deer','Lethbridge','Medicine Hat'],
    'CA-British Columbia': ['Vancouver','Victoria','Surrey','Burnaby','Kelowna','Kamloops'],
    'CA-Manitoba': ['Winnipeg','Brandon','Steinbach','Thompson','Portage la Prairie'],
    'CA-New Brunswick': ['Moncton','Saint John','Fredericton','Dieppe','Miramichi'],
    'CA-Newfoundland and Labrador': ["St. John's",'Mount Pearl','Corner Brook','Conception Bay South'],
    'CA-Nova Scotia': ['Halifax','Dartmouth','Sydney','Truro','New Glasgow'],
    'CA-Ontario': ['Toronto','Ottawa','Mississauga','Hamilton','Brampton','London','Markham','Kitchener'],
    'CA-Prince Edward Island': ['Charlottetown','Summerside','Stratford','Cornwall'],
    'CA-Quebec': ['Montreal','Quebec City','Laval','Gatineau','Longueuil','Sherbrooke'],
    'CA-Saskatchewan': ['Saskatoon','Regina','Prince Albert','Moose Jaw','Swift Current'],
    'CA-Northwest Territories': ['Yellowknife','Hay River','Inuvik'],
    'CA-Nunavut': ['Iqaluit','Rankin Inlet','Arviat'],
    'CA-Yukon': ['Whitehorse','Dawson City','Watson Lake'],
    // Australia states -> cities
    'AU-New South Wales': ['Sydney','Newcastle','Wollongong','Central Coast','Coffs Harbour'],
    'AU-Queensland': ['Brisbane','Gold Coast','Sunshine Coast','Townsville','Cairns','Toowoomba'],
    'AU-South Australia': ['Adelaide','Mount Gambier','Whyalla','Murray Bridge'],
    'AU-Tasmania': ['Hobart','Launceston','Devonport','Burnie'],
    'AU-Victoria': ['Melbourne','Geelong','Ballarat','Bendigo','Shepparton'],
    'AU-Western Australia': ['Perth','Mandurah','Bunbury','Geraldton','Kalgoorlie'],
    'AU-Australian Capital Territory': ['Canberra'],
    'AU-Northern Territory': ['Darwin','Alice Springs','Katherine'],
    // UK regions -> cities
    'UK-England': ['London','Manchester','Birmingham','Liverpool','Leeds','Bristol','Sheffield','Newcastle','Nottingham','Southampton','Oxford','Cambridge','Brighton','York'],
    'UK-Scotland': ['Edinburgh','Glasgow','Aberdeen','Dundee','Inverness','Stirling'],
    'UK-Wales': ['Cardiff','Swansea','Newport','Bangor','Wrexham'],
    'UK-Northern Ireland': ['Belfast','Derry','Lisburn','Newry','Bangor'],
    // Germany states -> cities
    'DE-Baden-Wurttemberg': ['Stuttgart','Mannheim','Karlsruhe','Freiburg','Heidelberg'],
    'DE-Bavaria': ['Munich','Nuremberg','Augsburg','Regensburg','Wurzburg'],
    'DE-Berlin': ['Berlin'],
    'DE-Brandenburg': ['Potsdam','Cottbus','Brandenburg an der Havel'],
    'DE-Bremen': ['Bremen','Bremerhaven'],
    'DE-Hamburg': ['Hamburg'],
    'DE-Hesse': ['Frankfurt','Wiesbaden','Kassel','Darmstadt','Offenbach'],
    'DE-Lower Saxony': ['Hanover','Braunschweig','Osnabruck','Oldenburg','Gottingen'],
    'DE-Mecklenburg-Vorpommern': ['Rostock','Schwerin','Neubrandenburg'],
    'DE-North Rhine-Westphalia': ['Cologne','Dusseldorf','Dortmund','Essen','Duisburg','Bonn'],
    'DE-Rhineland-Palatinate': ['Mainz','Ludwigshafen','Koblenz','Trier'],
    'DE-Saarland': ['Saarbrucken'],
    'DE-Saxony': ['Dresden','Leipzig','Chemnitz'],
    'DE-Saxony-Anhalt': ['Magdeburg','Halle'],
    'DE-Schleswig-Holstein': ['Kiel','Lubeck','Flensburg'],
    'DE-Thuringia': ['Erfurt','Jena','Weimar'],

    // India states -> cities
    'IN-Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Tirupati','Rajahmundry','Kakinada','Anantapur','Kadapa'],
    'IN-Arunachal Pradesh': ['Itanagar','Naharlagun','Tawang','Ziro','Pasighat'],
    'IN-Assam': ['Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur'],
    'IN-Bihar': ['Patna','Gaya','Bhagalpur','Muzaffarpur','Purnia','Darbhanga','Arrah','Begusarai'],
    'IN-Chhattisgarh': ['Raipur','Bhilai','Bilaspur','Korba','Durg','Rajnandgaon'],
    'IN-Goa': ['Panaji','Margao','Vasco da Gama','Mapusa','Ponda'],
    'IN-Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Gandhinagar','Junagadh','Anand','Navsari'],
    'IN-Haryana': ['Gurugram','Faridabad','Panipat','Ambala','Karnal','Hisar','Rohtak','Sonipat'],
    'IN-Himachal Pradesh': ['Shimla','Manali','Dharamshala','Solan','Mandi','Kullu'],
    'IN-Jharkhand': ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Hazaribagh','Deoghar'],
    'IN-Karnataka': ['Bangalore','Mysore','Hubli','Mangalore','Belgaum','Gulbarga','Davangere','Shimoga','Tumkur','Udupi'],
    'IN-Kerala': ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Palakkad','Alappuzha','Kannur','Kottayam'],
    'IN-Madhya Pradesh': ['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Rewa','Satna','Dewas'],
    'IN-Maharashtra': ['Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur','Kolhapur','Amravati','Navi Mumbai','Sangli','Jalgaon','Akola','Latur','Ahmednagar'],
    'IN-Manipur': ['Imphal','Thoubal','Bishnupur','Churachandpur'],
    'IN-Meghalaya': ['Shillong','Tura','Jowai','Nongpoh'],
    'IN-Mizoram': ['Aizawl','Lunglei','Champhai','Serchhip'],
    'IN-Nagaland': ['Kohima','Dimapur','Mokokchung','Tuensang'],
    'IN-Odisha': ['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore'],
    'IN-Punjab': ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Hoshiarpur','Pathankot'],
    'IN-Rajasthan': ['Jaipur','Jodhpur','Udaipur','Kota','Bikaner','Ajmer','Bhilwara','Alwar','Sikar','Pushkar'],
    'IN-Sikkim': ['Gangtok','Namchi','Pelling','Ravangla'],
    'IN-Tamil Nadu': ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore','Thoothukudi','Thanjavur'],
    'IN-Telangana': ['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Mahbubnagar','Secunderabad'],
    'IN-Tripura': ['Agartala','Udaipur','Dharmanagar','Kailashahar'],
    'IN-Uttar Pradesh': ['Lucknow','Kanpur','Agra','Varanasi','Meerut','Prayagraj','Ghaziabad','Noida','Bareilly','Aligarh','Moradabad','Gorakhpur'],
    'IN-Uttarakhand': ['Dehradun','Haridwar','Rishikesh','Haldwani','Roorkee','Nainital','Mussoorie'],
    'IN-West Bengal': ['Kolkata','Howrah','Asansol','Siliguri','Durgapur','Bardhaman','Malda','Kharagpur'],
    'IN-Delhi': ['New Delhi','Delhi'],

    // Brazil states -> cities
    'BR-Sao Paulo': ['Sao Paulo','Campinas','Santos','Guarulhos','Osasco','Ribeirao Preto'],
    'BR-Rio de Janeiro': ['Rio de Janeiro','Niteroi','Petropolis','Nova Iguacu'],
    'BR-Minas Gerais': ['Belo Horizonte','Uberlandia','Juiz de Fora','Ouro Preto'],
    'BR-Bahia': ['Salvador','Feira de Santana','Ilheus','Porto Seguro'],
    'BR-Parana': ['Curitiba','Londrina','Maringa','Foz do Iguacu'],
    'BR-Rio Grande do Sul': ['Porto Alegre','Caxias do Sul','Pelotas','Gramado'],
    'BR-Distrito Federal': ['Brasilia'],
    'BR-Ceara': ['Fortaleza','Juazeiro do Norte','Sobral'],
    'BR-Pernambuco': ['Recife','Olinda','Caruaru','Petrolina'],
    'BR-Amazonas': ['Manaus','Parintins'],
    'BR-Para': ['Belem','Santarem','Maraba'],
    'BR-Goias': ['Goiania','Anapolis','Aparecida de Goiania'],
    'BR-Santa Catarina': ['Florianopolis','Joinville','Blumenau','Balneario Camboriu'],

    // Mexico states -> cities
    'MX-Mexico City': ['Mexico City'],
    'MX-Jalisco': ['Guadalajara','Puerto Vallarta','Zapopan','Tlaquepaque'],
    'MX-Nuevo Leon': ['Monterrey','San Pedro Garza Garcia','Apodaca'],
    'MX-Puebla': ['Puebla','Cholula','Tehuacan'],
    'MX-Quintana Roo': ['Cancun','Playa del Carmen','Tulum','Cozumel'],
    'MX-Guanajuato': ['Leon','Guanajuato','San Miguel de Allende','Irapuato'],
    'MX-Yucatan': ['Merida','Valladolid','Progreso'],
    'MX-Baja California': ['Tijuana','Mexicali','Ensenada'],
    'MX-Chihuahua': ['Chihuahua','Ciudad Juarez'],
    'MX-Oaxaca': ['Oaxaca','Huatulco','Puerto Escondido'],
    'MX-Veracruz': ['Veracruz','Xalapa','Coatzacoalcos'],

    // Russia states -> cities
    'RU-Moscow': ['Moscow'],
    'RU-Saint Petersburg': ['Saint Petersburg'],
    'RU-Novosibirsk Oblast': ['Novosibirsk'],
    'RU-Sverdlovsk Oblast': ['Yekaterinburg','Nizhny Tagil'],
    'RU-Tatarstan': ['Kazan','Naberezhnye Chelny'],
    'RU-Krasnodar Krai': ['Krasnodar','Sochi','Novorossiysk'],
    'RU-Nizhny Novgorod Oblast': ['Nizhny Novgorod'],
    'RU-Samara Oblast': ['Samara','Tolyatti'],
    'RU-Rostov Oblast': ['Rostov-on-Don','Taganrog'],

    // China provinces -> cities
    'CN-Beijing': ['Beijing'],
    'CN-Shanghai': ['Shanghai'],
    'CN-Guangdong': ['Guangzhou','Shenzhen','Dongguan','Foshan','Zhuhai'],
    'CN-Zhejiang': ['Hangzhou','Ningbo','Wenzhou'],
    'CN-Jiangsu': ['Nanjing','Suzhou','Wuxi'],
    'CN-Sichuan': ['Chengdu','Mianyang','Leshan'],
    'CN-Hubei': ['Wuhan','Yichang'],
    'CN-Hunan': ['Changsha','Zhuzhou'],
    'CN-Fujian': ['Fuzhou','Xiamen','Quanzhou'],
    'CN-Shandong': ['Jinan','Qingdao','Yantai'],

    // Argentina provinces -> cities
    'AR-Buenos Aires': ['Buenos Aires','La Plata','Mar del Plata','Bahia Blanca'],
    'AR-Cordoba': ['Cordoba','Villa Carlos Paz','Rio Cuarto'],
    'AR-Santa Fe': ['Rosario','Santa Fe'],
    'AR-Mendoza': ['Mendoza','San Rafael'],
    'AR-Tucuman': ['San Miguel de Tucuman'],

    // Italy regions -> cities
    'IT-Lombardy': ['Milan','Bergamo','Brescia','Como','Monza'],
    'IT-Lazio': ['Rome','Viterbo','Latina'],
    'IT-Campania': ['Naples','Salerno','Caserta'],
    'IT-Veneto': ['Venice','Verona','Padua','Vicenza'],
    'IT-Emilia-Romagna': ['Bologna','Parma','Modena','Rimini'],
    'IT-Tuscany': ['Florence','Pisa','Siena','Lucca','Arezzo'],
    'IT-Piedmont': ['Turin','Novara','Alessandria'],
    'IT-Sicily': ['Palermo','Catania','Messina','Syracuse'],
    'IT-Puglia': ['Bari','Lecce','Taranto','Foggia'],
    'IT-Sardinia': ['Cagliari','Sassari','Olbia'],

    // Spain communities -> cities
    'ES-Madrid': ['Madrid','Alcala de Henares','Getafe'],
    'ES-Catalonia': ['Barcelona','Girona','Tarragona','Lleida'],
    'ES-Andalusia': ['Seville','Malaga','Granada','Cordoba','Cadiz'],
    'ES-Valencia': ['Valencia','Alicante','Castellon'],
    'ES-Basque Country': ['Bilbao','San Sebastian','Vitoria-Gasteiz'],
    'ES-Galicia': ['Santiago de Compostela','Vigo','A Coruna'],
    'ES-Canary Islands': ['Las Palmas','Santa Cruz de Tenerife'],
    'ES-Balearic Islands': ['Palma de Mallorca','Ibiza'],

    // Japan prefectures -> cities
    'JP-Tokyo': ['Tokyo','Shinjuku','Shibuya','Minato'],
    'JP-Osaka': ['Osaka','Sakai','Higashiosaka'],
    'JP-Kyoto': ['Kyoto','Uji'],
    'JP-Hokkaido': ['Sapporo','Asahikawa','Hakodate'],
    'JP-Kanagawa': ['Yokohama','Kawasaki','Sagamihara'],
    'JP-Aichi': ['Nagoya','Toyota','Okazaki'],
    'JP-Fukuoka': ['Fukuoka','Kitakyushu'],
    'JP-Hyogo': ['Kobe','Himeji','Nishinomiya'],
    'JP-Hiroshima': ['Hiroshima','Fukuyama'],
    'JP-Okinawa': ['Naha','Okinawa City'],
  };

  // Helper to get the prefix for state-based city lookup
  const statePrefix: Record<string, string> = {
    'United States': 'US', 'Canada': 'CA', 'Australia': 'AU', 'United Kingdom': 'UK', 'Germany': 'DE',
    'India': 'IN', 'Brazil': 'BR', 'Mexico': 'MX', 'Russia': 'RU', 'China': 'CN',
    'Argentina': 'AR', 'Italy': 'IT', 'Spain': 'ES', 'Japan': 'JP',
  };

  // Get states: prefer API data, fall back to hardcoded
  const getStatesForCountry = (): string[] => {
    if (apiStates.length > 0) return apiStates;
    return countryStates[country] || [];
  };

  // Get cities: prefer API data, fall back to hardcoded
  const getAvailableCities = (): string[] => {
    if (apiCities.length > 0) return apiCities;
    const prefix = statePrefix[country];
    if (prefix && state) {
      return countryCities[`${prefix}-${state}`] || [];
    }
    return countryCities[country] || [];
  };

  const worldCountries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
    'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
    'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
    'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
    'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
  ];
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [completingOAuth] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shareContact, setShareContact] = useState(true);

  /* ---------- validation & submission ---------- */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(
    searchParams.get('error') === 'incomplete_signup'
      ? 'Please complete the signup quiz before continuing.'
      : ''
  );

  /* ---------- redirect if already logged in (unless completing OAuth) ---------- */
  useEffect(() => {
    if (!authLoading && user && !completingOAuth && searchParams.get('completing') !== '1') {
      router.push('/community');
    }
  }, [authLoading, user, completingOAuth, router, searchParams]);

  /* ---------- keep stepRef in sync ---------- */
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  /* ---------- fetch states from API when country changes ---------- */
  useEffect(() => {
    if (!country) return;
    // If we already have hardcoded states, use those as initial and still try API
    setApiStates([]);
    setState('');
    setCity('');
    setApiCities([]);

    let cancelled = false;
    setLoadingStates(true);
    fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(country)}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled && !data.error && data.data?.states) {
          const names = data.data.states.map((s: { name: string }) => s.name).sort();
          if (names.length > 0) setApiStates(names);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingStates(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  /* ---------- fetch cities from API when country+state changes ---------- */
  useEffect(() => {
    if (!country) return;
    setApiCities([]);

    // For countries without states, fetch cities by country
    const hasStates = getStatesForCountry().length > 0;
    if (hasStates && !state) return;

    let cancelled = false;
    setLoadingCities(true);

    const url = hasStates && state
      ? `https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`
      : `https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(country)}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (!cancelled && !data.error && data.data) {
          const cities = Array.isArray(data.data) ? data.data : [];
          if (cities.length > 0) setApiCities(cities.sort());
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingCities(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, state]);

  /* ---------- sync step with browser history via hash ---------- */
  useEffect(() => {
    // Set initial hash
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#step-0');
    }

    function handleHashChange() {
      const match = window.location.hash.match(/^#step-(\d+)$/);
      if (!match) return;
      const targetStep = parseInt(match[1], 10);
      const current = stepRef.current;
      if (targetStep === current) return;
      setDirection(targetStep < current ? 'backward' : 'forward');
      setAnimating(true);
      setTimeout(() => {
        stepRef.current = targetStep;
        setStep(targetStep);
        setAnimating(false);
      }, 300);
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /* ---------- pet name for questions ---------- */
  const petName = dogName.trim() || 'your pet';

  /* ---------- photo upload ---------- */
  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setErrors((prev) => { const { profilePhoto, ...rest } = prev; return rest; });
    const promise = (async (): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setUploadedPhotoUrl(data.url);
        return data.url;
      } catch (err) {
        setErrors((prev) => ({ ...prev, profilePhoto: err instanceof Error ? err.message : 'Photo upload failed' }));
        setUploadedPhotoUrl('');
        return null;
      } finally {
        setUploadingPhoto(false);
      }
    })();
    uploadPromiseRef.current = promise;
  }

  /* ---------- step validation ---------- */
  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};

    // Step 0: Pet type & name
    if (s === 0) {
      if (!petType) newErrors.petType = 'Please select your pet type';
      if (!dogName.trim()) newErrors.dogName = 'Please enter a name';
    }
    // Step 1: Breed & details
    if (s === 1) {
      if (!breed.trim()) newErrors.breed = 'Please select or type a breed';
      if (!gender) newErrors.gender = 'Please select a gender';
      if (!dogAge) newErrors.dogAge = 'Please enter your pet\'s age';
      if (!weightKg) newErrors.weightKg = 'Please enter your pet\'s weight';
    }
    if (s === 2 && !temperament) newErrors.activityLevel = 'Please select a personality or skip this step';
    // Step 3: disabilities & allergies — no required validation, user can skip
    if (s === 4 && dietPreferences.length === 0) newErrors.diet = 'Please select at least one diet option or skip this step';
    if (s === 5 && lookingForMatch === null) newErrors.match = 'Please select Yes or No';
    if (s === 6) {
      if (!uploadedPhotoUrl && !uploadingPhoto && !profilePhotoPreview) newErrors.profilePhoto = 'Please upload a photo of your pet';
    }
    if (s === 7) {
      if (!country) newErrors.country = 'Please select a country';
      if (!city.trim()) newErrors.city = 'City is required';
      if (getStatesForCountry().length > 0 && !state.trim()) newErrors.state = 'State / Province is required';
    }
    if (s === 8) {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'At least 6 characters';
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password';
      else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';
      if (age && (isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120)) newErrors.age = 'Invalid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ---------- navigation ---------- */
  function goNext() {
    if (!validateStep(stepRef.current)) return;
    const nextStep = Math.min(stepRef.current + 1, TOTAL_STEPS - 1);
    stepRef.current = nextStep;
    setDirection('forward');
    setAnimating(true);
    window.location.hash = `step-${nextStep}`;
    setTimeout(() => { setStep(nextStep); setAnimating(false); }, 300);
  }


  /* ---------- toggle disabilities ---------- */
  function toggleDisability(item: string) {
    setDisabilities(prev => {
      if (item === 'None') return ['None'];
      const without = prev.filter(d => d !== 'None');
      if (without.includes(item)) return without.filter(d => d !== item);
      return [...without, item];
    });
  }

  /* ---------- toggle allergies ---------- */
  function toggleAllergy(item: string) {
    setAllergies(prev => {
      if (item === 'None') return ['None'];
      const without = prev.filter(a => a !== 'None');
      if (without.includes(item)) return without.filter(a => a !== item);
      return [...without, item];
    });
  }

  /* ---------- toggle diet preference (max 3) ---------- */
  function toggleDietPreference(diet: string) {
    setDietPreferences(prev => {
      if (prev.includes(diet)) {
        return prev.filter(d => d !== diet);
      }
      return [...prev, diet];
    });
  }

  /* ---------- generate display name ---------- */
  function generateDisplayName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }

  /* ---------- Google OAuth signup ---------- */
  async function handleGoogleSignup() {
    setGoogleLoading(true);
    // Save quiz data to sessionStorage so we can restore after OAuth redirect
    const quizData = {
      petType, dogName, breed, dogAge, weightKg, gender, activityLevel,
      walkPreference, favoriteActivity,
      temperament, disabilities, allergies, dietPreferences, getsAlongWithDogs, lookingForMatch,
      lookingForPlaymates, lookingForMate, lookingForWalkingBuddies,
      preferredBreed, sameBreedOnly, preferredRadiusKm,
      profilePhotoPreview, uploadedPhotoUrl, bio,
      city, state, country, fullName, age, phone, shareContact,
    };
    sessionStorage.setItem('jeko-signup-quiz', JSON.stringify(quizData));
    await signInWithGoogle();
  }

  /* ---------- submit ---------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      // Wait for any in-progress photo upload to finish
      if (uploadPromiseRef.current) {
        await uploadPromiseRef.current;
      }
      const { error: signUpError } = await signUp(email, password, { full_name: fullName });
      if (signUpError) {
        setSubmitError(signUpError.message || 'Signup failed. Please try again.');
        setSubmitting(false);
        return;
      }

      let userId: string | null = null;
      for (let attempt = 0; attempt < 20; attempt++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) { userId = session.user.id; break; }
        await new Promise((r) => setTimeout(r, 500));
      }

      if (!userId) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setSubmitError('Account created! Please check your email to verify, then log in.');
          setSubmitting(false);
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id ?? null;
      }

      if (!userId) {
        setSubmitError('Unable to retrieve session. Please try logging in.');
        setSubmitting(false);
        return;
      }

      const displayName = generateDisplayName(fullName);
      await new Promise((r) => setTimeout(r, 1000));

      for (let attempt = 0; attempt < 3; attempt++) {
        const { error } = await supabase.from('user_profiles').upsert({
          user_id: userId,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          age: age ? parseInt(age) : null,
          city: city.trim(),
          state: state.trim(),
          country,
          phone: phone.trim() || null,
        }, { onConflict: 'user_id' });
        if (!error) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      const petPayload = {
        user_id: userId,
        pet_name: dogName.trim(),
        breed: breed.trim(),
        pet_type: petType || 'Dog',
        city: city.trim(),
        city_normalized: city.trim().toLowerCase(),
        breed_normalized: breed.trim().toLowerCase(),
        contact_email: email.trim().toLowerCase(),
        contact_phone: phone.trim() || null,
        share_contact: shareContact,
        display_name: displayName,
        dog_age_years: dogAge ? parseFloat(dogAge) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        gender: gender || 'Unknown',
        diet_preference: dietPreferences.length > 0 ? dietPreferences : null,
        disabilities: disabilities.length > 0 && !disabilities.includes('None') ? disabilities : null,
        allergies: allergies.length > 0 && !allergies.includes('None') ? allergies : null,
        activity_level: activityLevel || null,
        temperament: temperament || null,
        looking_for_mate: lookingForMatch === true ? lookingForMate : false,
        preferred_radius_km: lookingForMatch === true ? preferredRadiusKm : null,
        preferred_breed: lookingForMatch === true ? preferredBreed || null : null,
        favorite_activity: favoriteActivity || null,
        walk_preference: walkPreference || null,
        gets_along_with_dogs: getsAlongWithDogs ?? true,
        bio: bio.trim() || null,
        profile_photo_url: uploadedPhotoUrl || null,
      };

      for (let attempt = 0; attempt < 3; attempt++) {
        const { error } = await supabase.from('pet_profiles').upsert(petPayload, { onConflict: 'user_id' });
        if (!error) break;
        await new Promise((r) => setTimeout(r, 1000));
      }

      router.push('/community');
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  }

  /* ---------- loading guard ---------- */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================================================================ */
  /*  Render                                                          */
  /* ================================================================ */

  const slideClass = animating
    ? direction === 'forward' ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12'
    : 'opacity-100 translate-x-0';

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <Header />

      {/* -------- Main quiz area -------- */}
      <main className="flex-1 flex flex-col pt-[64px] lg:pt-[80px]">
        <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
          <div className={`flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-8 transition-all duration-300 ease-in-out ${slideClass}`}>

            {/* Segmented progress bar */}
            <div className="w-full max-w-md mb-8">
              <div className="flex gap-1">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full bg-deep-green/15 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        i <= step ? 'bg-gold w-full' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational message */}
            <p className="text-deep-green text-2xl font-semibold mb-6">
              {STEP_MESSAGES[step]}
            </p>

            {/* Submit error */}
            {submitError && (
              <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm max-w-md w-full">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{submitError}</span>
              </div>
            )}

            {/* ============ STEP 0: PET TYPE ============ */}
            {step === 0 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-6">
                  {STEP_TITLES[0]}
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Let&apos;s get started with the basics</p>

                {/* Pet Type Selection */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {PET_TYPES.map((pt) => {
                    const icons: Record<string, React.ReactNode> = { Dog: QIcon.dog, Cat: QIcon.cat, Other: QIcon.paw };
                    return (
                      <QuizCard
                        key={pt}
                        icon={icons[pt] || QIcon.paw}
                        label={pt}
                        selected={petType === pt}
                        onClick={() => setPetType(pt)}
                      />
                    );
                  })}
                </div>
                {errors.petType && <p className="text-red-500 text-sm mt-2">{errors.petType}</p>}

                {/* Pet Name Input */}
                {petType && (
                  <div className="mt-8 max-w-md mx-auto">
                    <label className="block text-sm font-medium text-deep-green mb-3">What&apos;s your {petType.toLowerCase()}&apos;s name?</label>
                    <input
                      type="text"
                      value={dogName}
                      onChange={(e) => { if (e.target.value.length <= 30) setDogName(e.target.value); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goNext(); } }}
                      placeholder="e.g. Buddy, Luna, Max..."
                      maxLength={30}
                      autoFocus
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-lg text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                        errors.dogName ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    <p className="text-gray-400 text-xs mt-2">{dogName.length}/30</p>
                    {errors.dogName && <p className="text-red-500 text-sm mt-1">{errors.dogName}</p>}
                  </div>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!petType || !dogName.trim()}
                  className="mt-8 bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 2: BREED ============ */}
            {step === 1 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  Tell us more about {petName}
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Breed, gender, age & weight</p>

                {/* Breed */}
                <div className="bg-white/80 border-2 border-deep-green/20 rounded-2xl p-5 max-w-md mx-auto mb-6">
                  <p className="text-sm font-semibold text-deep-green mb-3">What breed is {petName}?</p>
                  <BreedAutocomplete
                    value={breed}
                    onChange={setBreed}
                    placeholder="Start typing a breed..."
                    error={errors.breed}
                    petType={petType}
                  />
                  {/* Popular breeds quick-pick */}
                  <p className="text-xs font-medium text-deep-green/70 mt-4 mb-2">Popular breeds</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(petType === 'Cat'
                      ? ['Maine Coon', 'Ragdoll', 'British Shorthair', 'Siamese', 'Persian', 'Bengal']
                      : ['Labrador Retriever', 'Golden Retriever', 'French Bulldog', 'German Shepherd', 'Poodle', 'Beagle']
                    ).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBreed(b)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          breed === b
                            ? 'bg-deep-green text-white shadow-sm'
                            : 'bg-white border border-deep-green/20 text-deep-green/80 hover:border-gold/60 hover:bg-gold/5'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <p className="text-sm font-medium text-deep-green mb-3">Gender</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
                  {[
                    { value: 'Male', icon: QIcon.male, label: 'Boy' },
                    { value: 'Female', icon: QIcon.female, label: 'Girl' },
                  ].map((g) => (
                    <QuizCard
                      key={g.value}
                      icon={g.icon}
                      label={g.label}
                      selected={gender === g.value}
                      onClick={() => setGender(g.value)}
                    />
                  ))}
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}

                {/* Age & Weight */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-2">Age (years) <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={dogAge}
                      onChange={(e) => { const v = e.target.value; if (v === '' || /^\d{0,2}(\.\d{0,1})?$/.test(v)) setDogAge(v); }}
                      placeholder="e.g. 3"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent ${errors.dogAge ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.dogAge && <p className="text-red-500 text-xs mt-1">{errors.dogAge}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-2">Weight (kg) <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={weightKg}
                      onChange={(e) => { const v = e.target.value; if (v === '' || /^\d{0,3}(\.\d{0,1})?$/.test(v)) setWeightKg(v); }}
                      placeholder="e.g. 12"
                      className={`w-full px-4 py-3 border-2 rounded-xl text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent ${errors.weightKg ? 'border-red-400' : 'border-gray-200'}`}
                    />
                    {errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={!breed.trim()}
                  className="mt-8 bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 2: PERSONALITY ============ */}
            {step === 2 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  How would you describe {petName}?
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Pick what fits best</p>

                <p className="text-sm font-medium text-deep-green mb-3">Personality</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {TEMPERAMENTS.map((t) => {
                    const icons: Record<string, React.ReactNode> = {
                      Calm: QIcon.calm, Playful: QIcon.playful, Energetic: QIcon.energetic, Shy: QIcon.shy, Protective: QIcon.protective, Friendly: QIcon.friendly,
                    };
                    return (
                      <QuizCard
                        key={t}
                        icon={icons[t] || QIcon.paw}
                        label={t}
                        selected={temperament === t}
                        onClick={() => setTemperament(t)}
                      />
                    );
                  })}
                </div>

                {errors.activityLevel && <p className="text-red-500 text-sm mt-4">{errors.activityLevel}</p>}
                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 5: DISABILITIES & ALLERGIES ============ */}
            {step === 3 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  {petName}&apos;s health & special needs
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Help us understand any special considerations</p>

                <p className="text-sm font-medium text-deep-green mb-3">Any disabilities?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {DISABILITIES.map((d) => {
                    const icons: Record<string, React.ReactNode> = {
                      None: QIcon.none, Blind: QIcon.blind, Deaf: QIcon.deaf, 'Mobility Issues': QIcon.mobility,
                      Amputee: QIcon.amputee, Epilepsy: QIcon.epilepsy, Anxiety: QIcon.anxiety, Other: QIcon.other,
                    };
                    return (
                      <QuizCard
                        key={d}
                        icon={icons[d] || QIcon.other}
                        label={d}
                        selected={disabilities.includes(d)}
                        onClick={() => toggleDisability(d)}
                      />
                    );
                  })}
                </div>

                <p className="text-sm font-medium text-deep-green mb-3">Any allergies?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {ALLERGIES.map((a) => {
                    const icons: Record<string, React.ReactNode> = {
                      None: QIcon.allergyNone, Chicken: QIcon.chicken, Beef: QIcon.beef, Grain: QIcon.grain,
                      Dairy: QIcon.dairy, Eggs: QIcon.eggs, Soy: QIcon.soy, Fish: QIcon.fish,
                      Pollen: QIcon.pollen, Dust: QIcon.dust, Flea: QIcon.flea, Other: QIcon.other,
                    };
                    return (
                      <QuizCard
                        key={a}
                        icon={icons[a] || QIcon.other}
                        label={a}
                        selected={allergies.includes(a)}
                        onClick={() => toggleAllergy(a)}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 6: DIET & WALKS & ACTIVITIES ============ */}
            {step === 4 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  What does {petName} love?
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Help us find the perfect matches</p>

                <p className="text-sm font-medium text-deep-green mb-3">Diet</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {DIET_PREFERENCES.map((d) => {
                    const icons: Record<string, React.ReactNode> = {
                      Raw: QIcon.raw, Kibble: QIcon.kibble, Mixed: QIcon.mixed, Homemade: QIcon.homemade, 'Jeko': QIcon.plant,
                      Chicken: QIcon.chicken, Beef: QIcon.beef, Lamb: QIcon.lamb, Vegetables: QIcon.vegetables,
                    };
                    return (
                      <QuizCard
                        key={d}
                        icon={icons[d] || QIcon.mixed}
                        label={d}
                        selected={dietPreferences.includes(d)}
                        onClick={() => toggleDietPreference(d)}
                      />
                    );
                  })}
                </div>

                {errors.diet && <p className="text-red-500 text-sm mt-4">{errors.diet}</p>}
                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 7: SOCIAL ============ */}
            {/* ============ STEP 5: LOOKING FOR A MATCH? ============ */}
            {step === 5 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  Looking for a match?
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Would you like {petName} to appear in matches with other pets?</p>

                {/* Illustration */}
                <div className="mb-8 flex justify-center">
                  <img
                    src="/WhatsApp_Image_2026-04-11_at_09.54.12-removebg-preview.png"
                    alt="Pets looking for a match"
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
                  <QuizCard icon={QIcon.heart} label="Yes!" selected={lookingForMatch === true} onClick={() => setLookingForMatch(true)} />
                  <QuizCard icon={QIcon.no} label="No thanks" selected={lookingForMatch === false} onClick={() => { setLookingForMatch(false); setLookingForPlaymates(false); setLookingForMate(false); setLookingForWalkingBuddies(false); }} />
                </div>

                {lookingForMatch === false && (
                  <p className="text-sm text-deep-green/40 mb-6">{petName} won&apos;t appear in match results. You can change this and customize match preferences later.</p>
                )}

                {errors.match && <p className="text-red-500 text-sm mt-4">{errors.match}</p>}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={lookingForMatch === null}
                  className="mt-6 bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 9: PHOTO & BIO ============ */}
            {step === 6 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  Show off {petName}!
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Add a photo and tell us what makes them special</p>

                {/* Photo upload — opens native file picker on click */}
                <div
                  role="button"
                  tabIndex={0}
                  data-mount-time={Date.now()}
                  onClick={(e) => {
                    // Ignore clicks within 600ms of mount to prevent ghost triggers during step transitions
                    const mountTime = parseInt(e.currentTarget.getAttribute('data-mount-time') || '0');
                    if (Date.now() - mountTime < 600) return;
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
                    input.onchange = (ev) => {
                      const file = (ev.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handlePhotoSelect({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                      }
                    };
                    input.click();
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
                  className="relative group mx-auto flex justify-center mb-3 cursor-pointer w-fit"
                >
                  <div className={`w-36 h-36 rounded-full border-3 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200 ${
                    profilePhotoPreview ? 'border-deep-green border-solid' : 'border-gray-300 hover:border-gold group-hover:border-gold'
                  }`}>
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Pet preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <CameraIcon />
                        <span className="text-xs text-gray-400">Tap to add photo</span>
                      </div>
                    )}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-deep-green border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  {profilePhotoPreview && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-deep-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Photo guidance */}
                <p className="text-xs text-deep-green/50 mb-1">📸 Please upload a clear photo of your pet — pets only, no humans! <span className="text-red-400">*Required</span></p>
                <p className="text-xs text-gray-400 mb-3">Best size: at least 400×400px · JPG, PNG or WebP · max 5MB</p>

                {/* URL input for photo (alternative to file upload) */}
                <div className="max-w-sm mx-auto mb-5">
                  <p className="text-xs text-deep-green/40 mb-1.5">Or paste an image URL:</p>
                  <input
                    type="url"
                    placeholder="https://example.com/my-pet.jpg"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
                    onBlur={(e) => {
                      const url = e.target.value.trim();
                      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                        setProfilePhotoPreview(url);
                        setUploadedPhotoUrl(url);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const url = (e.target as HTMLInputElement).value.trim();
                        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                          setProfilePhotoPreview(url);
                          setUploadedPhotoUrl(url);
                        }
                      }
                    }}
                  />
                </div>
                {errors.profilePhoto && <p className="text-red-500 text-xs mb-4">{errors.profilePhoto}</p>}

                {/* Bio */}
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={`Anything special about ${petName} you think Jeko should know?`}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow resize-none text-sm"
                />
                <p className="text-xs text-gray-400 text-right mt-1 mb-6">{bio.length}/500</p>

                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 10: LOCATION ============ */}
            {step === 7 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  Where are you located?
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Connect with nearby pet owners and local events</p>

                <div className="space-y-4 text-left">
                  {/* Country Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Country <span className="text-red-400">*</span></label>
                    <SearchableSelect
                      value={country}
                      onChange={(v) => { setCountry(v); setState(''); setCity(''); }}
                      options={worldCountries}
                      placeholder="Select country"
                      error={errors.country}
                    />
                  </div>

                  {/* State/Province - shown when states are available (hardcoded or API) */}
                  {getStatesForCountry().length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-deep-green mb-1.5">State / Province <span className="text-red-400">*</span></label>
                      <SearchableSelect
                        value={state}
                        onChange={(v) => { setState(v); setCity(''); setApiCities([]); }}
                        options={getStatesForCountry()}
                        placeholder={loadingStates ? "Loading states..." : "Select state / province"}
                        error={errors.state}
                        allowFreeText
                      />
                    </div>
                  )}

                  {/* City Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">City <span className="text-red-400">*</span></label>
                    <SearchableSelect
                      value={city}
                      onChange={setCity}
                      options={getAvailableCities()}
                      placeholder={loadingCities ? "Loading cities..." : getAvailableCities().length > 0 ? "Select or type city" : "Type your city"}
                      error={errors.city}
                      allowFreeText
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="mt-8 bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 11: ACCOUNT CREATION ============ */}
            {step === 8 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-gold mb-2">
                  Almost there! Create your account
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Last step to join the pack</p>

                {/* Google OAuth — primary option */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading || submitting}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border-2 border-gray-200 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  Continue with Google
                </button>

                {/* Divider */}
                {!showEmailForm ? (
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(true)}
                    className="text-sm text-deep-green/50 hover:text-deep-green transition-colors mb-6"
                  >
                    or sign up with email instead
                  </button>
                ) : (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-off-white px-3 text-gray-400">or sign up with email</span>
                    </div>
                  </div>
                )}

                {/* Email/password form — shown when user clicks "sign up with email" */}
                {showEmailForm && (
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sarah Miller"
                      className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                        errors.fullName ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Email <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className={`w-full px-5 py-3.5 pr-12 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                          errors.password ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1" tabIndex={-1}>
                        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Confirm Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className={`w-full px-5 py-3.5 pr-12 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                          errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1" tabIndex={-1}>
                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Optional fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep-green mb-1.5">Age <span className="text-gray-400 text-xs">(optional)</span></label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                          errors.age ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-deep-green mb-1.5">Phone <span className="text-gray-400 text-xs">(optional)</span></label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow"
                      />
                    </div>
                  </div>

                  {/* Share contact toggle */}
                  <label className="flex items-start gap-3 cursor-pointer py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={shareContact}
                      onChange={(e) => setShareContact(e.target.checked)}
                      className="mt-0.5 w-5 h-5 text-deep-green border-gray-300 rounded focus:ring-deep-green accent-deep-green"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Share pet info with matches</p>
                      <p className="text-xs text-gray-400 mt-0.5">Other pet owners can see your info to arrange meetups</p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full bg-deep-green hover:bg-deep-green/90 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Join the Pack
                        <PawIcon />
                      </>
                    )}
                  </button>
                </div>
                )}

                <p className="text-center text-deep-green/30 text-xs mt-6">
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            )}

          </div>
        </form>
      </main>
    </div>
  );
}

import { Suspense } from 'react';
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-off-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <SignupPageInner />
    </Suspense>
  );
}
