'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useT } from '@/lib/i18n/LangProvider';

function generateDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] || 'User';
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function OAuthCompleteInner() {
  const { t } = useT();
  const FUN_MESSAGES = [
    t('auth.callback.msg1'),
    t('auth.callback.msg2'),
    t('auth.callback.msg3'),
    t('auth.callback.msg4'),
    t('auth.callback.msg5'),
    t('auth.callback.msg6'),
    t('auth.callback.msg7'),
    t('auth.callback.msg8'),
  ];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(FUN_MESSAGES[0]);

  useEffect(() => {
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % FUN_MESSAGES.length;
      setStatus(FUN_MESSAGES[msgIndex]);
    }, 1500);

    async function handleOAuthComplete() {
      try {
        const code = searchParams.get('code');
        const next = searchParams.get('next') || 'signup';

        /* ---- Step 1: Exchange the OAuth code for a session (client-side) ---- */
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('Code exchange failed:', error);
            clearInterval(msgInterval);
            setStatus(t('auth.callback.authFailed'));
            setTimeout(() => router.push('/auth/signup'), 2000);
            return;
          }
        }

        /* ---- Step 2: Get the session via getUser (avoids getSession deadlock) ---- */
        let userId: string | null = null;
        let userEmail = '';
        let metadata: Record<string, unknown> = {};

        for (let i = 0; i < 20; i++) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            userId = user.id;
            userEmail = user.email || '';
            metadata = user.user_metadata || {};
            break;
          }
          await new Promise(r => setTimeout(r, 500));
        }

        if (!userId) {
          clearInterval(msgInterval);
          setStatus(t('auth.callback.sessionNotFound'));
          setTimeout(() => router.push('/auth/signup'), 2000);
          return;
        }

        /* ---- Step 3: Handle login vs signup ---- */
        if (next === 'login') {
          // Check pet_profiles (not user_profiles) because the DB trigger
          // auto-creates a bare user_profiles row on every auth.users insert.
          // A user who skipped signup will have user_profiles but no pet_profiles.
          const { data: petProfile } = await supabase
            .from('pet_profiles')
            .select('user_id')
            .eq('user_id', userId)
            .single();

          clearInterval(msgInterval);

          if (!petProfile) {
            await supabase.auth.signOut();
            router.push('/login?error=not_signed_up');
            return;
          }
          router.push('/');
          return;
        }

        /* ---- Step 4: Save profiles from quiz data ---- */
        const raw = sessionStorage.getItem('jeko-signup-quiz');
        console.log('[OAuth] sessionStorage jeko-signup-quiz:', raw ? `found (${raw.length} chars)` : 'NOT FOUND');
        if (!raw) {
          // No quiz data in sessionStorage. Check if this user already
          // completed signup before (has a pet_profiles row). If not,
          // sign them out and send them to signup — they skipped the quiz.
          const { data: existingPet } = await supabase
            .from('pet_profiles')
            .select('user_id')
            .eq('user_id', userId)
            .single();

          clearInterval(msgInterval);

          if (existingPet) {
            // Returning user who already completed signup — let them in
            router.push('/community');
          } else {
            // New user who bypassed the quiz — sign out and redirect to signup
            await supabase.auth.signOut();
            router.push('/auth/signup?error=incomplete_signup');
          }
          return;
        }

        const quiz = JSON.parse(raw);
        console.log('[OAuth] Quiz data loaded from sessionStorage:', Object.keys(quiz));
        const email = userEmail || quiz.email || '';
        const emailUsername = email.split('@')[0] || '';
        const displayName = generateDisplayName(
          quiz.fullName || (metadata?.full_name as string) || (metadata?.name as string) || emailUsername || 'User'
        );

        // Save user profile with retry
        let userProfileSaved = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { error } = await supabase.from('user_profiles').upsert({
            user_id: userId,
            full_name: (quiz.fullName || (metadata?.full_name as string) || (metadata?.name as string) || emailUsername || '').trim(),
            email: email.trim().toLowerCase(),
            display_name: displayName,
            age: quiz.age ? parseInt(quiz.age) : null,
            city: (quiz.city || '').trim(),
            state: (quiz.state || '').trim(),
            country: quiz.country || '',
            phone: (quiz.phone || '').trim() || null,
          }, { onConflict: 'user_id' });
          if (!error) {
            userProfileSaved = true;
            console.log('[OAuth] user_profiles saved successfully');
            break;
          }
          console.error(`[OAuth] user_profiles save attempt ${attempt + 1} failed:`, error);
          await new Promise(r => setTimeout(r, 1000));
        }

        if (!userProfileSaved) {
          console.error('[OAuth] All user_profiles save attempts failed');
          clearInterval(msgInterval);
          setStatus(t('auth.callback.failedProfile'));
          await supabase.auth.signOut().catch(() => {});
          setTimeout(() => router.push('/auth/signup'), 2000);
          return;
        }

        // Save pet profile with retry
        let petProfileSaved = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { error } = await supabase.from('pet_profiles').upsert({
            user_id: userId,
            pet_name: (quiz.dogName || '').trim(),
            breed: (quiz.breed || '').trim(),
            pet_type: quiz.petType || 'Dog',
            city: (quiz.city || '').trim(),
            city_normalized: (quiz.city || '').trim().toLowerCase(),
            breed_normalized: (quiz.breed || '').trim().toLowerCase(),
            contact_email: email.trim().toLowerCase(),
            contact_phone: (quiz.phone || '').trim() || null,
            share_contact: quiz.shareContact ?? true,
            display_name: displayName,
            dog_age_years: quiz.dogAge ? parseFloat(quiz.dogAge) : null,
            weight_kg: quiz.weightKg ? parseFloat(quiz.weightKg) : null,
            gender: quiz.gender || 'Unknown',
            diet_preference: quiz.dietPreferences?.length > 0 ? quiz.dietPreferences : null,
            disabilities: quiz.disabilities?.length > 0 && !quiz.disabilities?.includes('None') ? quiz.disabilities : null,
            allergies: quiz.allergies?.length > 0 && !quiz.allergies?.includes('None') ? quiz.allergies : null,
            activity_level: quiz.activityLevel || null,
            walk_preference: quiz.walkPreference || null,
            favorite_activity: quiz.favoriteActivity || null,
            temperament: quiz.temperament || null,
            looking_for_mate: quiz.lookingForMatch === true ? quiz.lookingForMate : false,
            preferred_radius_km: quiz.lookingForMatch === true ? quiz.preferredRadiusKm : null,
            preferred_breed: quiz.lookingForMatch === true ? quiz.preferredBreed || null : null,
            gets_along_with_dogs: quiz.getsAlongWithDogs ?? true,
            bio: (quiz.bio || '').trim() || null,
            profile_photo_url: quiz.uploadedPhotoUrl || null,
          }, { onConflict: 'user_id' });
          if (!error) {
            petProfileSaved = true;
            console.log('[OAuth] pet_profiles saved successfully');
            break;
          }
          console.error(`[OAuth] pet_profiles save attempt ${attempt + 1} failed:`, error);
          await new Promise(r => setTimeout(r, 1000));
        }

        if (!petProfileSaved) {
          console.error('[OAuth] All pet_profiles save attempts failed');
          clearInterval(msgInterval);
          setStatus(t('auth.callback.failedPet'));
          await supabase.auth.signOut().catch(() => {});
          setTimeout(() => router.push('/auth/signup'), 2000);
          return;
        }

        sessionStorage.removeItem('jeko-signup-quiz');
        clearInterval(msgInterval);
        setStatus(t('auth.callback.welcome'));
        setTimeout(() => router.push('/community'), 1200);
      } catch (err) {
        console.error('OAuth completion error:', err);
        clearInterval(msgInterval);
        // Sign out to prevent incomplete profiles from persisting
        await supabase.auth.signOut().catch(() => {});
        setStatus(t('auth.callback.wentWrong'));
        setTimeout(() => router.push('/auth/signup'), 2000);
      }
    }

    handleOAuthComplete();
    return () => clearInterval(msgInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-deep-green border-t-transparent rounded-full animate-spin" />
        <p className="text-deep-green font-medium">{status}</p>
      </div>
    </div>
  );
}

export default function OAuthCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-deep-green border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OAuthCompleteInner />
    </Suspense>
  );
}
