'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function generateDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0] || 'User';
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export default function OAuthCompletePage() {
  const router = useRouter();
  const [status, setStatus] = useState('Saving your profile...');

  useEffect(() => {
    async function saveProfile() {
      try {
        // Get the authenticated user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          // Retry a few times — session might not be ready yet
          for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 500));
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession?.user) {
              await doSave(retrySession.user.id, retrySession.user.email || '', retrySession.user.user_metadata);
              return;
            }
          }
          setStatus('Session not found. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        await doSave(session.user.id, session.user.email || '', session.user.user_metadata);
      } catch (err) {
        console.error('Error saving profile:', err);
        setStatus('Something went wrong. Redirecting...');
        setTimeout(() => router.push('/community'), 2000);
      }
    }

    async function doSave(userId: string, userEmail: string, metadata: Record<string, unknown>) {
      // Read quiz data from sessionStorage
      const raw = sessionStorage.getItem('jeko-signup-quiz');
      if (!raw) {
        // No quiz data — user might have already completed signup or came directly
        router.push('/community');
        return;
      }

      const quiz = JSON.parse(raw);
      const displayName = generateDisplayName(quiz.fullName || (metadata?.full_name as string) || (metadata?.name as string) || 'User');
      const email = userEmail || quiz.email || '';

      setStatus('Saving your profile...');

      // Save user profile
      await supabase.from('user_profiles').upsert({
        user_id: userId,
        full_name: (quiz.fullName || (metadata?.full_name as string) || (metadata?.name as string) || '').trim(),
        email: email.trim().toLowerCase(),
        age: quiz.age ? parseInt(quiz.age) : null,
        city: (quiz.city || '').trim(),
        state: (quiz.state || '').trim(),
        country: quiz.country || '',
        phone: (quiz.phone || '').trim() || null,
      }, { onConflict: 'user_id' });

      setStatus('Saving pet profile...');

      // Save pet profile
      await supabase.from('pet_profiles').upsert({
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
        age_years: quiz.dogAge ? parseFloat(quiz.dogAge) : null,
        dog_age_years: quiz.dogAge ? parseFloat(quiz.dogAge) : null,
        weight_kg: quiz.weightKg ? parseFloat(quiz.weightKg) : null,
        gender: quiz.gender || 'Unknown',
        diet_preferences: quiz.dietPreferences?.length > 0 ? quiz.dietPreferences : null,
        activity_level: quiz.activityLevel || null,
        temperament: quiz.temperament || null,
        looking_for_mate: quiz.lookingForMatch === true ? quiz.lookingForMate : false,
        preferred_radius_km: quiz.lookingForMatch === true ? quiz.preferredRadiusKm : null,
        preferred_breed: quiz.lookingForMatch === true ? quiz.preferredBreed || null : null,
        same_breed_only: quiz.lookingForMatch === true ? quiz.sameBreedOnly : false,
        gets_along_with_dogs: quiz.getsAlongWithDogs ?? true,
        bio: (quiz.bio || '').trim() || null,
        profile_photo_url: quiz.uploadedPhotoUrl || null,
      }, { onConflict: 'user_id' });

      // Clear quiz data
      sessionStorage.removeItem('jeko-signup-quiz');

      setStatus('Welcome to Jeko!');
      setTimeout(() => router.push('/community'), 1000);
    }

    saveProfile();
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
