-- Matching Preferences and Photo Gallery Schema for Pure Pet

-- 1. Pet Photos Gallery Table
CREATE TABLE IF NOT EXISTS pet_photos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Matching Preferences Table
CREATE TABLE IF NOT EXISTS matching_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_profile_id UUID REFERENCES pet_profiles(id) ON DELETE CASCADE,
  
  -- Location Preferences
  preferred_distance_km INTEGER DEFAULT 50, -- Max distance in km
  preferred_cities TEXT[], -- Array of preferred cities
  accept_any_city BOOLEAN DEFAULT TRUE,
  
  -- Pet Preferences
  preferred_genders TEXT[], -- 'Male', 'Female', or empty for any
  preferred_breeds TEXT[], -- Array of preferred breeds
  preferred_age_min INTEGER DEFAULT 0,
  preferred_age_max INTEGER DEFAULT 20,
  preferred_weight_min DECIMAL(5,2) DEFAULT 0,
  preferred_weight_max DECIMAL(5,2) DEFAULT 100,
  
  -- Compatibility Preferences
  preferred_temperaments TEXT[], -- 'Friendly', 'Energetic', etc.
  preferred_activity_levels TEXT[], -- 'Low', 'Moderate', 'High', 'Very High'
  must_get_along_with_dogs BOOLEAN DEFAULT TRUE,
  
  -- Matching Goals
  looking_for_playmates BOOLEAN DEFAULT TRUE,
  looking_for_mate BOOLEAN DEFAULT FALSE,
  looking_for_walking_buddies BOOLEAN DEFAULT FALSE,
  
  -- Filter Settings
  exclude_already_seen BOOLEAN DEFAULT TRUE,
  exclude_already_liked BOOLEAN DEFAULT FALSE,
  exclude_already_disliked BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, pet_profile_id)
);

-- 3. Enhanced Swipe Actions Table (add compatibility scoring)
ALTER TABLE swipe_actions 
ADD COLUMN IF NOT EXISTS compatibility_score DECIMAL(3,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS match_reasons TEXT[], -- Why this was a good match
ADD COLUMN IF NOT EXISTS preference_matches TEXT[]; -- Which preferences matched

-- 4. Match Quality Table (for analytics)
CREATE TABLE IF NOT EXISTS match_quality (
  id SERIAL PRIMARY KEY,
  user_a_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Match Metrics
  compatibility_score DECIMAL(3,2) NOT NULL,
  shared_preferences_count INTEGER DEFAULT 0,
  distance_km DECIMAL(8,2),
  
  -- Match Categories
  location_match BOOLEAN DEFAULT FALSE,
  breed_match BOOLEAN DEFAULT FALSE,
  temperament_match BOOLEAN DEFAULT FALSE,
  activity_match BOOLEAN DEFAULT FALSE,
  age_match BOOLEAN DEFAULT FALSE,
  
  -- User Feedback
  user_a_rating INTEGER CHECK (user_a_rating >= 1 AND user_a_rating <= 5),
  user_b_rating INTEGER CHECK (user_b_rating >= 1 AND user_b_rating <= 5),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_pet_photos_user_id ON pet_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_pet_id ON pet_photos(pet_profile_id);
CREATE INDEX IF NOT EXISTS idx_pet_photos_primary ON pet_photos(is_primary) WHERE is_primary = TRUE;

CREATE INDEX IF NOT EXISTS idx_matching_preferences_user_id ON matching_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_matching_preferences_cities ON matching_preferences USING GIN(preferred_cities);
CREATE INDEX IF NOT EXISTS idx_matching_preferences_breeds ON matching_preferences USING GIN(preferred_breeds);

CREATE INDEX IF NOT EXISTS idx_swipe_actions_compatibility ON swipe_actions(compatibility_score);
CREATE INDEX IF NOT EXISTS idx_swipe_actions_preferences ON swipe_actions USING GIN(preference_matches);

CREATE INDEX IF NOT EXISTS idx_match_quality_score ON match_quality(compatibility_score);
CREATE INDEX IF NOT EXISTS idx_match_quality_users ON match_quality(user_a_id, user_b_id);

-- 6. Triggers for Updated Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pet_photos_updated_at BEFORE UPDATE ON pet_photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matching_preferences_updated_at BEFORE UPDATE ON matching_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Default Matching Preferences for Existing Users
INSERT INTO matching_preferences (user_id, pet_profile_id)
SELECT 
    u.id as user_id,
    pp.id as pet_profile_id
FROM auth.users u
JOIN pet_profiles pp ON u.id = pp.user_id
LEFT JOIN matching_preferences mp ON u.id = mp.user_id
WHERE mp.id IS NULL;

-- 8. Sample Data (for testing)
-- This would be removed in production
/*
INSERT INTO pet_photos (user_id, pet_profile_id, photo_url, photo_order, is_primary) VALUES
-- Add sample photos for testing
*/

COMMIT;
