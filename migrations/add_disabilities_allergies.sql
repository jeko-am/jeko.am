-- Add disabilities and allergies columns to pet_profiles table
ALTER TABLE pet_profiles ADD COLUMN IF NOT EXISTS disabilities text[] DEFAULT NULL;
ALTER TABLE pet_profiles ADD COLUMN IF NOT EXISTS allergies text[] DEFAULT NULL;
