// Types for advanced matching system

export interface PetPhoto {
  id: number;
  user_id: string;
  pet_profile_id: string;
  photo_url: string;
  photo_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchingPreferences {
  id: number;
  user_id: string;
  pet_profile_id: string;
  
  // Location Preferences
  preferred_distance_km: number;
  preferred_cities: string[];
  accept_any_city: boolean;
  
  // Pet Preferences
  preferred_genders: string[];
  preferred_breeds: string[];
  preferred_age_min: number;
  preferred_age_max: number;
  preferred_weight_min: number;
  preferred_weight_max: number;
  
  // Compatibility Preferences
  preferred_temperaments: string[];
  preferred_activity_levels: string[];
  must_get_along_with_dogs: boolean;
  
  // Matching Goals
  looking_for_playmates: boolean;
  looking_for_mate: boolean;
  looking_for_walking_buddies: boolean;
  
  // Filter Settings
  exclude_already_seen: boolean;
  exclude_already_liked: boolean;
  exclude_already_disliked: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface MatchQuality {
  id: number;
  user_a_id: string;
  user_b_id: string;
  
  // Match Metrics
  compatibility_score: number;
  shared_preferences_count: number;
  distance_km: number;
  
  // Match Categories
  location_match: boolean;
  breed_match: boolean;
  temperament_match: boolean;
  activity_match: boolean;
  age_match: boolean;
  
  // User Feedback
  user_a_rating?: number;
  user_b_rating?: number;
  
  created_at: string;
}

export interface CompatibilityResult {
  score: number;
  reasons: string[];
  matches: {
    location?: boolean;
    gender?: boolean;
    breed?: boolean;
    age?: boolean;
    weight?: boolean;
    temperament?: boolean;
    activity?: boolean;
    goals?: boolean;
  };
  distance_km?: number;
}

export interface EnhancedPetCandidate {
  // Original pet profile fields
  id: number;
  user_id: string;
  pet_name: string;
  breed: string | null;
  pet_type: string | null;
  city: string | null;
  city_normalized: string | null;
  breed_normalized: string | null;
  display_name: string | null;
  avatar_url: string | null;
  profile_photo_url: string | null;
  dog_age_years: number | null;
  weight_kg: number | null;
  gender: string | null;
  temperament: string | null;
  activity_level: string | null;
  favorite_activity: string | null;
  walk_preference: string | null;
  gets_along_with_dogs: boolean | null;
  looking_for_mate: boolean | null;
  owner_name?: string | null;
  
  // Enhanced fields
  pet_photos: PetPhoto[];
  compatibility_score?: number;
  match_reasons?: string[];
  distance_km?: number;
  
  // Match categories
  location_match?: boolean;
  breed_match?: boolean;
  temperament_match?: boolean;
  activity_match?: boolean;
  age_match?: boolean;
}

// Helper functions for matching logic
export class MatchingEngine {
  
  static calculateCompatibility(
    candidate: EnhancedPetCandidate,
    preferences: MatchingPreferences,
    userLocation?: { city: string; country: string }
  ): CompatibilityResult {
    const result: CompatibilityResult = {
      score: 0,
      reasons: [],
      matches: {}
    };

    let totalScore = 0;
    let maxScore = 0;

    // Location Matching (25% weight)
    maxScore += 25;
    if (preferences.accept_any_city || this.checkLocationMatch(candidate, preferences, userLocation)) {
      totalScore += 25;
      result.matches.location = true;
      result.reasons.push("Location match");
    }

    // Gender Matching (15% weight)
    maxScore += 15;
    if (this.checkGenderMatch(candidate, preferences)) {
      totalScore += 15;
      result.matches.gender = true;
      result.reasons.push("Gender preference match");
    }

    // Breed Matching (20% weight)
    maxScore += 20;
    if (this.checkBreedMatch(candidate, preferences)) {
      totalScore += 20;
      result.matches.breed = true;
      result.reasons.push("Breed preference match");
    }

    // Age Matching (10% weight)
    maxScore += 10;
    if (this.checkAgeMatch(candidate, preferences)) {
      totalScore += 10;
      result.matches.age = true;
      result.reasons.push("Age preference match");
    }

    // Weight Matching (5% weight)
    maxScore += 5;
    if (this.checkWeightMatch(candidate, preferences)) {
      totalScore += 5;
      result.reasons.push("Weight preference match");
    }

    // Temperament Matching (15% weight)
    maxScore += 15;
    if (this.checkTemperamentMatch(candidate, preferences)) {
      totalScore += 15;
      result.matches.temperament = true;
      result.reasons.push("Temperament compatibility");
    }

    // Activity Level Matching (10% weight)
    maxScore += 10;
    if (this.checkActivityMatch(candidate, preferences)) {
      totalScore += 10;
      result.matches.activity = true;
      result.reasons.push("Activity level compatibility");
    }

    // Goals Matching (Bonus points)
    if (this.checkGoalsMatch(candidate, preferences)) {
      totalScore += 5;
      result.matches.goals = true;
      result.reasons.push("Matching goals");
      maxScore += 5;
    }

    result.score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) / 100 : 0;
    
    return result;
  }

  private static checkLocationMatch(
    candidate: EnhancedPetCandidate,
    preferences: MatchingPreferences,
    userLocation?: { city: string; country: string }
  ): boolean {
    if (preferences.accept_any_city) return true;
    if (preferences.preferred_cities.includes(candidate.city || "")) return true;
    if (userLocation && candidate.city === userLocation.city) return true;
    return false;
  }

  private static checkGenderMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    if (preferences.preferred_genders.length === 0) return true; // No preference
    return preferences.preferred_genders.includes(candidate.gender || "");
  }

  private static checkBreedMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    if (preferences.preferred_breeds.length === 0) return true; // No preference
    return preferences.preferred_breeds.some(breed => 
      candidate.breed?.toLowerCase().includes(breed.toLowerCase())
    );
  }

  private static checkAgeMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    const age = candidate.dog_age_years;
    if (age === null) return true; // No age data
    return age >= preferences.preferred_age_min && age <= preferences.preferred_age_max;
  }

  private static checkWeightMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    const weight = candidate.weight_kg;
    if (weight === null) return true; // No weight data
    return weight >= preferences.preferred_weight_min && weight <= preferences.preferred_weight_max;
  }

  private static checkTemperamentMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    if (preferences.preferred_temperaments.length === 0) return true; // No preference
    return preferences.preferred_temperaments.includes(candidate.temperament || "");
  }

  private static checkActivityMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    if (preferences.preferred_activity_levels.length === 0) return true; // No preference
    return preferences.preferred_activity_levels.includes(candidate.activity_level || "");
  }

  private static checkGoalsMatch(candidate: EnhancedPetCandidate, preferences: MatchingPreferences): boolean {
    // Check if candidate's goals align with user's preferences
    const candidateLookingForMate = candidate.looking_for_mate || false;
    const userLookingForMate = preferences.looking_for_mate;
    
    // If both are looking for mates, that's a strong match
    if (candidateLookingForMate && userLookingForMate) return true;
    
    // If user wants playmates and candidate gets along with dogs
    if (preferences.looking_for_playmates && candidate.gets_along_with_dogs) return true;
    
    // If user wants walking buddies and activity levels match
    if (preferences.looking_for_walking_buddies && this.checkActivityMatch(candidate, preferences)) return true;
    
    return false;
  }

  static getCompatibilityDescription(score: number): string {
    if (score >= 0.9) return "Excellent Match";
    if (score >= 0.8) return "Great Match";
    if (score >= 0.7) return "Good Match";
    if (score >= 0.6) return "Fair Match";
    if (score >= 0.5) return "Possible Match";
    return "Low Compatibility";
  }

  static getCompatibilityColor(score: number): string {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    if (score >= 0.4) return "text-orange-600";
    return "text-red-600";
  }
}
