'use client';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  COMMON_BREEDS,
  PET_TYPES,
  DIET_PREFERENCES,
  ACTIVITY_LEVELS,
  TEMPERAMENTS,
  WALK_PREFERENCES,
  FAVORITE_ACTIVITIES,
  COUNTRIES,
} from '@/lib/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Quiz step definitions                                              */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 10;

const STEP_TITLES = [
  'What type of pet do you have?',
  "What's your pet's name?",
  'What breed?',
  'Tell us more about',
  'How active?',
  'What do they love?',
  'Social life',
  'Add a photo & bio',
  'Where are you located?',
  'Create your account',
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
  emoji,
  label,
  sublabel,
  selected,
  onClick,
}: {
  emoji: string;
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
        relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2
        transition-all duration-200 cursor-pointer min-h-[100px]
        ${selected
          ? 'border-deep-green bg-deep-green/5 shadow-md scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-gold/60 hover:shadow-sm'
        }
      `}
    >
      <span className="text-3xl">{emoji}</span>
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
/*  Breed Autocomplete                                                 */
/* ------------------------------------------------------------------ */

function BreedAutocomplete({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMON_BREEDS;
    const q = query.toLowerCase();
    return COMMON_BREEDS.filter((b) => b.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        placeholder={placeholder ?? 'Start typing a breed...'}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className={`w-full px-5 py-4 border-2 rounded-2xl text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow text-center ${
          error ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'
        }`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-48 w-full overflow-y-auto rounded-2xl bg-white border border-gray-200 shadow-lg">
          {filtered.map((breed) => (
            <li key={breed}>
              <button
                type="button"
                className="w-full text-left px-5 py-3 text-sm hover:bg-deep-green/5 transition-colors text-gray-800"
                onMouseDown={(e) => { e.preventDefault(); setQuery(breed); onChange(breed); setOpen(false); }}
              >
                {breed}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main quiz signup page                                              */
/* ------------------------------------------------------------------ */

export default function SignupPage() {
  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  /* ---------- quiz state ---------- */
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);

  /* ---------- form fields ---------- */
  const [petType, setPetType] = useState<string>('');
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [temperament, setTemperament] = useState('');
  const [dietPreference, setDietPreference] = useState('');
  const [favoriteActivity, setFavoriteActivity] = useState('');
  const [walkPreference, setWalkPreference] = useState('');
  const [getsAlongWithDogs, setGetsAlongWithDogs] = useState<boolean | null>(null);
  const [lookingForMate, setLookingForMate] = useState<boolean | null>(null);
  const [preferredBreed, setPreferredBreed] = useState('');
  const [preferredRadiusKm, setPreferredRadiusKm] = useState(25);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shareContact, setShareContact] = useState(true);

  /* ---------- validation & submission ---------- */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- redirect if already logged in ---------- */
  useEffect(() => {
    if (!authLoading && user) router.push('/community');
  }, [authLoading, user, router]);

  /* ---------- pet name for questions ---------- */
  const petName = dogName.trim() || 'your pet';

  /* ---------- photo upload ---------- */
  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploadedPhotoUrl(data.url);
    } catch (err) {
      setErrors((prev) => ({ ...prev, profilePhoto: err instanceof Error ? err.message : 'Photo upload failed' }));
      setUploadedPhotoUrl('');
    } finally {
      setUploadingPhoto(false);
    }
  }

  /* ---------- step validation ---------- */
  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};

    if (s === 0 && !petType) newErrors.petType = 'Please select your pet type';
    if (s === 1 && !dogName.trim()) newErrors.dogName = 'Please enter a name';
    if (s === 2 && !breed.trim()) newErrors.breed = 'Please select or type a breed';
    // Steps 3-7 are optional
    if (s === 8) {
      if (!city.trim()) newErrors.city = 'City is required';
      if (!state.trim()) newErrors.state = 'State is required';
      if (!country) newErrors.country = 'Please select a country';
    }
    if (s === 9) {
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
    if (!validateStep(step)) return;
    setDirection('forward');
    setAnimating(true);
    setTimeout(() => { setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); setAnimating(false); }, 300);
  }

  function goBack() {
    setErrors({});
    setDirection('backward');
    setAnimating(true);
    setTimeout(() => { setStep((s) => Math.max(s - 1, 0)); setAnimating(false); }, 300);
  }

  /* ---------- auto-advance on card selection for single-select steps ---------- */
  function selectAndAdvance(setter: (v: string) => void, value: string) {
    setter(value);
    setTimeout(() => {
      setDirection('forward');
      setAnimating(true);
      setTimeout(() => { setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); setAnimating(false); }, 300);
    }, 400);
  }

  /* ---------- generate display name ---------- */
  function generateDisplayName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }

  /* ---------- submit ---------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSubmitting(true);
    setSubmitError('');

    try {
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
        diet_preference: dietPreference || null,
        activity_level: activityLevel || null,
        temperament: temperament || null,
        looking_for_mate: lookingForMate ?? false,
        preferred_radius_km: lookingForMate ? preferredRadiusKm : null,
        preferred_breed: lookingForMate ? preferredBreed || null : null,
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

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const slideClass = animating
    ? direction === 'forward' ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12'
    : 'opacity-100 translate-x-0';

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      {/* -------- Top bar -------- */}
      <header className="bg-deep-green sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-5 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <div className="bg-gold text-deep-green rounded-lg px-2.5 py-1 flex items-center gap-0.5 font-rubik font-bold text-[18px] tracking-wide select-none hover:bg-yellow-400 transition-colors">
              <span>PURE</span>
              <PawIcon />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-white/60 text-xs sm:text-sm hidden sm:block">
              Already have an account?{' '}
              <Link href="/login" className="text-gold font-semibold hover:text-yellow-300 transition-colors underline underline-offset-2">
                Log in
              </Link>
            </p>
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={animating}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-deep-green/50">
          <div
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* -------- Main quiz area -------- */}
      <main className="flex-1 flex flex-col">
        <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
          <div className={`flex-1 flex flex-col items-center justify-center px-5 py-8 transition-all duration-300 ease-in-out ${slideClass}`}>

            {/* Step counter */}
            <p className="text-deep-green/40 text-xs font-medium mb-3 tracking-wider uppercase">
              Step {step + 1} of {TOTAL_STEPS}
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
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  {STEP_TITLES[0]}
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Let&apos;s get started with the basics</p>
                <div className="grid grid-cols-3 gap-4">
                  {PET_TYPES.map((pt) => {
                    const emojis: Record<string, string> = { Dog: '🐕', Cat: '🐱', Other: '🐾' };
                    return (
                      <QuizCard
                        key={pt}
                        emoji={emojis[pt] || '🐾'}
                        label={pt}
                        selected={petType === pt}
                        onClick={() => selectAndAdvance(setPetType, pt)}
                      />
                    );
                  })}
                </div>
                {errors.petType && <p className="text-red-500 text-sm mt-4">{errors.petType}</p>}
              </div>
            )}

            {/* ============ STEP 1: PET NAME ============ */}
            {step === 1 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  What&apos;s your {petType.toLowerCase() || 'pet'}&apos;s name?
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">We&apos;ll use this to personalise the experience</p>
                <input
                  type="text"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goNext(); } }}
                  placeholder="e.g. Buddy, Luna, Max..."
                  autoFocus
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-xl text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                    errors.dogName ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.dogName && <p className="text-red-500 text-sm mt-3">{errors.dogName}</p>}
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-6 bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ============ STEP 2: BREED ============ */}
            {step === 2 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  What breed is {petName}?
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Search or pick from popular breeds</p>
                <BreedAutocomplete
                  value={breed}
                  onChange={setBreed}
                  placeholder="Start typing a breed..."
                  error={errors.breed}
                />
                {/* Popular breeds quick-pick */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Labrador Retriever', 'Golden Retriever', 'French Bulldog', 'German Shepherd', 'Poodle', 'Beagle'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBreed(b)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        breed === b
                          ? 'bg-deep-green text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-deep-green/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
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

            {/* ============ STEP 3: AGE / WEIGHT / GENDER ============ */}
            {step === 3 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  Tell us more about {petName}
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">All fields are optional</p>

                {/* Gender */}
                <p className="text-sm font-medium text-deep-green mb-3">Gender</p>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
                  {[
                    { value: 'Male', emoji: '♂️', label: 'Boy' },
                    { value: 'Female', emoji: '♀️', label: 'Girl' },
                    { value: 'Unknown', emoji: '🤷', label: 'Not sure' },
                  ].map((g) => (
                    <QuizCard
                      key={g.value}
                      emoji={g.emoji}
                      label={g.label}
                      selected={gender === g.value}
                      onClick={() => setGender(g.value)}
                    />
                  ))}
                </div>

                {/* Age & Weight */}
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-2">Age (years)</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      step="0.5"
                      value={dogAge}
                      onChange={(e) => setDogAge(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      min={0}
                      max={150}
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent"
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
                <button type="button" onClick={goNext} className="block mx-auto mt-3 text-deep-green/40 text-sm hover:text-deep-green/60 transition-colors">
                  Skip this step
                </button>
              </div>
            )}

            {/* ============ STEP 4: ACTIVITY & TEMPERAMENT ============ */}
            {step === 4 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  How would you describe {petName}?
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Pick what fits best</p>

                <p className="text-sm font-medium text-deep-green mb-3">Activity Level</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {ACTIVITY_LEVELS.map((level) => {
                    const emojis: Record<string, string> = { Low: '🐌', Moderate: '🚶', High: '🏃', 'Very High': '🚀' };
                    return (
                      <QuizCard
                        key={level}
                        emoji={emojis[level] || '🐕'}
                        label={level}
                        selected={activityLevel === level}
                        onClick={() => setActivityLevel(level)}
                      />
                    );
                  })}
                </div>

                <p className="text-sm font-medium text-deep-green mb-3">Personality</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {TEMPERAMENTS.map((t) => {
                    const emojis: Record<string, string> = {
                      Calm: '😌', Playful: '🎾', Energetic: '⚡', Shy: '🙈', Protective: '🛡️', Friendly: '🤗',
                    };
                    return (
                      <QuizCard
                        key={t}
                        emoji={emojis[t] || '🐕'}
                        label={t}
                        selected={temperament === t}
                        onClick={() => setTemperament(t)}
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
                <button type="button" onClick={goNext} className="block mx-auto mt-3 text-deep-green/40 text-sm hover:text-deep-green/60 transition-colors">
                  Skip this step
                </button>
              </div>
            )}

            {/* ============ STEP 5: DIET & WALKS & ACTIVITIES ============ */}
            {step === 5 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  What does {petName} love?
                </h1>
                <p className="text-deep-green/50 text-sm mb-6">Help us find the perfect matches</p>

                <p className="text-sm font-medium text-deep-green mb-3">Diet</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {DIET_PREFERENCES.map((d) => {
                    const emojis: Record<string, string> = {
                      Raw: '🥩', Kibble: '🍖', Mixed: '🍽️', Homemade: '👨‍🍳', 'Jeko': '🌿',
                    };
                    return (
                      <QuizCard key={d} emoji={emojis[d] || '🍽️'} label={d} selected={dietPreference === d} onClick={() => setDietPreference(d)} />
                    );
                  })}
                </div>

                <p className="text-sm font-medium text-deep-green mb-3">Favorite Activity</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {FAVORITE_ACTIVITIES.map((f) => {
                    const emojis: Record<string, string> = {
                      Fetch: '🎾', Swimming: '🏊', Hiking: '🥾', Cuddling: '🤗', Agility: '🏅', Running: '🏃',
                      'Playing with other dogs': '🐕‍🦺', 'Chasing squirrels': '🐿️', Napping: '😴', 'Car rides': '🚗',
                    };
                    return (
                      <QuizCard key={f} emoji={emojis[f] || '🐕'} label={f} selected={favoriteActivity === f} onClick={() => setFavoriteActivity(f)} />
                    );
                  })}
                </div>

                <p className="text-sm font-medium text-deep-green mb-3">Walk Preference</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {WALK_PREFERENCES.map((w) => {
                    const emojis: Record<string, string> = { Morning: '🌅', Evening: '🌆', Both: '☀️', Anytime: '🕐' };
                    return (
                      <QuizCard key={w} emoji={emojis[w] || '🚶'} label={w} selected={walkPreference === w} onClick={() => setWalkPreference(w)} />
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
                <button type="button" onClick={goNext} className="block mx-auto mt-3 text-deep-green/40 text-sm hover:text-deep-green/60 transition-colors">
                  Skip this step
                </button>
              </div>
            )}

            {/* ============ STEP 6: SOCIAL ============ */}
            {step === 6 && (
              <div className="w-full max-w-lg text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  {petName}&apos;s social life
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Help us understand their social preferences</p>

                <p className="text-sm font-medium text-deep-green mb-3">Gets along with other dogs?</p>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
                  <QuizCard emoji="🤝" label="Yes!" selected={getsAlongWithDogs === true} onClick={() => setGetsAlongWithDogs(true)} />
                  <QuizCard emoji="😬" label="Not really" selected={getsAlongWithDogs === false} onClick={() => setGetsAlongWithDogs(false)} />
                </div>

                <p className="text-sm font-medium text-deep-green mb-3">Looking for a mate?</p>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
                  <QuizCard emoji="💕" label="Yes!" selected={lookingForMate === true} onClick={() => setLookingForMate(true)} />
                  <QuizCard emoji="🙅" label="No thanks" selected={lookingForMate === false} onClick={() => setLookingForMate(false)} />
                </div>

                {lookingForMate && (
                  <div className="bg-white border-2 border-deep-green/10 rounded-2xl p-5 max-w-sm mx-auto mb-6 text-left space-y-4">
                    <p className="text-sm font-semibold text-deep-green text-center">Mate Preferences</p>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Preferred Breed</label>
                      <BreedAutocomplete value={preferredBreed} onChange={setPreferredBreed} placeholder="Any breed..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Search Radius: <span className="text-gold font-semibold">{preferredRadiusKm} km</span>
                      </label>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={preferredRadiusKm}
                        onChange={(e) => setPreferredRadiusKm(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-deep-green"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>5 km</span>
                        <span>100 km</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
                <button type="button" onClick={goNext} className="block mx-auto mt-3 text-deep-green/40 text-sm hover:text-deep-green/60 transition-colors">
                  Skip this step
                </button>
              </div>
            )}

            {/* ============ STEP 7: PHOTO & BIO ============ */}
            {step === 7 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  Show off {petName}!
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Add a photo and tell us what makes them special</p>

                {/* Photo upload */}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group mx-auto block mb-6">
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
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handlePhotoSelect} />
                {errors.profilePhoto && <p className="text-red-500 text-xs mb-4">{errors.profilePhoto}</p>}

                {/* Bio */}
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={`What makes ${petName} one-of-a-kind? A fun fact, quirky habit, or special talent...`}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow resize-none text-sm"
                />
                <p className="text-xs text-gray-400 text-right mt-1 mb-6">{bio.length}/500</p>

                <button
                  type="button"
                  onClick={goNext}
                  className="bg-gold hover:bg-yellow-500 text-deep-green font-semibold py-3.5 px-10 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
                >
                  Continue
                </button>
                <button type="button" onClick={goNext} className="block mx-auto mt-3 text-deep-green/40 text-sm hover:text-deep-green/60 transition-colors">
                  Skip this step
                </button>
              </div>
            )}

            {/* ============ STEP 8: LOCATION ============ */}
            {step === 8 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  Where are you located?
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Connect with nearby pet owners and local events</p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">City <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="London"
                      className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                        errors.city ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">State / Province <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Greater London"
                      className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow ${
                        errors.state ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep-green mb-1.5">Country <span className="text-red-400">*</span></label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`w-full px-5 py-3.5 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent transition-shadow appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10 ${
                        errors.country ? 'border-red-400' : 'border-gray-200'
                      } ${!country ? 'text-gray-400' : ''}`}
                    >
                      <option value="" disabled>Select your country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
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

            {/* ============ STEP 9: ACCOUNT CREATION ============ */}
            {step === 9 && (
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl sm:text-3xl font-rubik font-bold text-deep-green mb-2">
                  Almost there! Create your account
                </h1>
                <p className="text-deep-green/50 text-sm mb-8">Last step to join the pack</p>

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
                      <p className="text-sm font-medium text-gray-700">Share my contact info with matches</p>
                      <p className="text-xs text-gray-400 mt-0.5">Other pet owners can see your info to arrange meetups</p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploadingPhoto}
                  className="mt-8 bg-deep-green hover:bg-deep-green/90 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto min-w-[220px]"
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
