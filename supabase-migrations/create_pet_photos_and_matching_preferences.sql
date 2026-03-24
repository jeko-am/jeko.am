-- Migration: Create pet_photos and matching_preferences tables
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/dzhtpnskezkrtfinntbi/sql)

-- ============================================================
-- 1. pet_photos table - stores multiple photos per pet profile
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pet_photos (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_profile_id BIGINT NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.pet_photos ENABLE ROW LEVEL SECURITY;

-- Users can read all pet photos (needed for swipe cards)
CREATE POLICY "Anyone can view pet photos"
  ON public.pet_photos FOR SELECT
  USING (true);

-- Users can insert their own pet photos
CREATE POLICY "Users can insert own pet photos"
  ON public.pet_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pet photos
CREATE POLICY "Users can update own pet photos"
  ON public.pet_photos FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own pet photos
CREATE POLICY "Users can delete own pet photos"
  ON public.pet_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_profile ON public.pet_photos(pet_profile_id, photo_order);

-- ============================================================
-- 2. matching_preferences table - stores user match filters
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matching_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_profile_id BIGINT NOT NULL REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  preferred_distance_km INTEGER DEFAULT 50,
  accept_any_city BOOLEAN DEFAULT TRUE,
  preferred_cities TEXT[] DEFAULT '{}',
  preferred_genders TEXT[] DEFAULT '{}',
  preferred_breeds TEXT[] DEFAULT '{}',
  preferred_age_min INTEGER DEFAULT 0,
  preferred_age_max INTEGER DEFAULT 20,
  preferred_weight_min INTEGER DEFAULT 0,
  preferred_weight_max INTEGER DEFAULT 100,
  preferred_temperaments TEXT[] DEFAULT '{}',
  preferred_activity_levels TEXT[] DEFAULT '{}',
  must_get_along_with_dogs BOOLEAN DEFAULT TRUE,
  looking_for_playmates BOOLEAN DEFAULT TRUE,
  looking_for_mate BOOLEAN DEFAULT FALSE,
  looking_for_walking_buddies BOOLEAN DEFAULT FALSE,
  exclude_already_seen BOOLEAN DEFAULT TRUE,
  exclude_already_liked BOOLEAN DEFAULT FALSE,
  exclude_already_disliked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_profile_id)
);

-- Enable RLS
ALTER TABLE public.matching_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.matching_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON public.matching_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON public.matching_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
  ON public.matching_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_matching_prefs_user ON public.matching_preferences(user_id, pet_profile_id);
