"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { MatchingPreferences as MatchPrefsType } from "@/lib/matching-types";
import { getBreedsByPetType, ARMENIAN_CITIES } from "@/lib/constants";
import { useT } from "@/lib/i18n/LangProvider";

interface MatchingPreferencesProps {
  petProfileId?: string;
  petType?: string;
  onPreferencesChange?: (preferences: MatchPrefsType) => void;
}

interface PreferencesState extends Partial<MatchPrefsType> {
  preferred_distance_km?: number;
  accept_any_city?: boolean;
  preferred_genders?: string[];
  preferred_breeds?: string[];
  preferred_age_min?: number;
  preferred_age_max?: number;
  preferred_weight_min?: number;
  preferred_weight_max?: number;
  preferred_temperaments?: string[];
  preferred_activity_levels?: string[];
  must_get_along_with_dogs?: boolean;
  looking_for_playmates?: boolean;
  looking_for_mate?: boolean;
  looking_for_walking_buddies?: boolean;
  exclude_already_seen?: boolean;
  exclude_already_liked?: boolean;
  exclude_already_disliked?: boolean;
}


const COMMON_CITIES = ARMENIAN_CITIES;

export default function MatchingPreferences({ petProfileId, petType, onPreferencesChange }: MatchingPreferencesProps) {
  const { t } = useT();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configOptions, setConfigOptions] = useState<{
    temperaments: string[];
    activityLevels: string[];
    genders: string[];
    walkPreferences: string[];
    favoriteActivities: string[];
  }>({
    temperaments: ['Friendly', 'Energetic', 'Calm', 'Playful', 'Protective', 'Shy'],
    activityLevels: ['Low', 'Moderate', 'High', 'Very High'],
    genders: ['Male', 'Female'],
    walkPreferences: ['Short walks', 'Long hikes', 'Off-lead runs', 'City strolls'],
    favoriteActivities: ['Fetch', 'Swimming', 'Agility', 'Socialising', 'Tug of war', 'Frisbee'],
  });
  const [preferences, setPreferences] = useState<PreferencesState>({
    preferred_distance_km: 50,
    accept_any_city: false,
    preferred_genders: [],
    preferred_breeds: [],
    preferred_age_min: 0,
    preferred_age_max: 20,
    preferred_weight_min: 0,
    preferred_weight_max: 100,
    preferred_temperaments: [],
    preferred_activity_levels: [],
    must_get_along_with_dogs: true,
    looking_for_playmates: true,
    looking_for_mate: false,
    looking_for_walking_buddies: false,
    exclude_already_seen: true,
    exclude_already_liked: false,
    exclude_already_disliked: true,
  });

  const [breedSearch, setBreedSearch] = useState("");
  const [breedDropdownOpen, setBreedDropdownOpen] = useState(false);
  const breedInputRef = useRef<HTMLInputElement>(null);

  const breedList = getBreedsByPetType(petType || 'Dog');
  const filteredBreeds = breedSearch.trim().length > 0
    ? breedList.filter(b =>
        b.toLowerCase().includes(breedSearch.toLowerCase()) &&
        !(preferences.preferred_breeds || []).includes(b)
      ).slice(0, 8)
    : [];

  useEffect(() => {
    if (user && petProfileId) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user, petProfileId]);

  useEffect(() => {
    async function loadConfig() {
      try {
        // Find the preferences-config page
        const { data: pages } = await supabase
          .from('pages')
          .select('id')
          .or('slug.eq.preferences-config,slug.eq./preferences-config')
          .limit(1);
        if (!pages?.[0]) return;

        const { data: sectionData } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_id', pages[0].id);
        if (!sectionData) return;

        const find = (name: string) => {
          const s = sectionData.find(s => s.section_type === name);
          const opts = (s?.content as Record<string, unknown>)?.options;
          return Array.isArray(opts) && opts.length > 0 ? (opts as string[]) : null;
        };

        setConfigOptions(prev => ({
          temperaments: find('Temperament Options') ?? prev.temperaments,
          activityLevels: find('Activity Levels') ?? prev.activityLevels,
          genders: find('Gender Options') ?? prev.genders,
          walkPreferences: find('Walk Preferences') ?? prev.walkPreferences,
          favoriteActivities: find('Favourite Activities') ?? prev.favoriteActivities,
        }));
      } catch {
        // silently keep defaults
      }
    }
    loadConfig();
  }, []);

  const fetchPreferences = async () => {
    try {
      // Load user's own pet profile so we can prefill preferences
      // (city, breed, gender, weight, age) from signup data.
      const { data: petProfile } = await supabase
        .from("pet_profiles")
        .select("breed, gender, city, weight_kg, dog_age_years")
        .eq("id", petProfileId)
        .maybeSingle();

      const { data } = await supabase
        .from("matching_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .eq("pet_profile_id", petProfileId)
        .maybeSingle();

      const weight = petProfile?.weight_kg ? Number(petProfile.weight_kg) : null;
      const age = petProfile?.dog_age_years ? Number(petProfile.dog_age_years) : null;

      if (data) {
        // Backfill fields from the pet profile when the saved preference row
        // left them empty — so returning users don't see blank selectors.
        setPreferences((prev) => {
          const merged = { ...prev, ...data } as PreferencesState;
          if (petProfile) {
            if ((!merged.preferred_cities || merged.preferred_cities.length === 0) && petProfile.city) {
              merged.preferred_cities = [petProfile.city];
            }
            if ((!merged.preferred_breeds || merged.preferred_breeds.length === 0) && petProfile.breed) {
              merged.preferred_breeds = [petProfile.breed];
            }
            if ((!merged.preferred_genders || merged.preferred_genders.length === 0) && petProfile.gender) {
              merged.preferred_genders = [petProfile.gender];
            }
            if ((!merged.preferred_weight_max || merged.preferred_weight_max === 100) && weight) {
              merged.preferred_weight_max = Math.min(100, Math.ceil(weight * 1.5));
            }
            if ((!merged.preferred_age_max || merged.preferred_age_max === 20) && age) {
              merged.preferred_age_max = Math.min(20, Math.ceil(age + 3));
            }
          }
          return merged;
        });
      } else if (petProfile) {
        // First time — seed entirely from pet profile.
        setPreferences((prev) => ({
          ...prev,
          preferred_cities: petProfile.city ? [petProfile.city] : prev.preferred_cities,
          preferred_breeds: petProfile.breed ? [petProfile.breed] : prev.preferred_breeds,
          preferred_genders: petProfile.gender ? [petProfile.gender] : prev.preferred_genders,
          preferred_weight_max: weight
            ? Math.min(100, Math.ceil(weight * 1.5))
            : prev.preferred_weight_max,
          preferred_age_max: age
            ? Math.min(20, Math.ceil(age + 3))
            : prev.preferred_age_max,
        }));
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user || !petProfileId) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("matching_preferences")
        .upsert({
          user_id: user.id,
          pet_profile_id: petProfileId,
          ...preferences,
        })
        .select()
        .single();

      if (error) throw error;
      
      setPreferences(data);
      onPreferencesChange?.(data);
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert(t("prefs.saveErr"));
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePreference = (key: keyof MatchPrefsType, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof MatchPrefsType, item: string) => {
    const currentArray = (preferences[key] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updatePreference(key, newArray);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 tracking-wide">{t("prefs.heading")}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {t("prefs.subtitle")}
        </p>
      </div>

      {/* Location Preferences */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">📍 {t("prefs.location.heading")}</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="accept-any-city"
              checked={preferences.accept_any_city}
              onChange={(e) => updatePreference("accept_any_city", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <label htmlFor="accept-any-city" className="text-sm text-gray-700">
              {t("prefs.location.anyCity")}
            </label>
          </div>

          {!preferences.accept_any_city && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Distance: {preferences.preferred_distance_km}km
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={preferences.preferred_distance_km}
                  onChange={(e) => updatePreference("preferred_distance_km", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("prefs.location.preferredCities")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_CITIES.map(city => (
                    <label key={city} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={(preferences.preferred_cities || []).includes(city)}
                        onChange={() => toggleArrayItem("preferred_cities", city)}
                        className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                      />
                      {city}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pet Preferences */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">🐕 {t("prefs.pet.heading")}</h4>
        
        <div className="space-y-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("prefs.pet.gender")}</label>
            <div className="space-x-4">
              {configOptions.genders.map(gender => (
                <label key={gender} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={(preferences.preferred_genders || []).includes(gender)}
                    onChange={() => toggleArrayItem("preferred_genders", gender)}
                    className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="text-sm">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Breeds */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("prefs.pet.breeds")}</label>
            {/* Selected breed tags */}
            {(preferences.preferred_breeds || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {(preferences.preferred_breeds || []).map(breed => (
                  <span key={breed} className="inline-flex items-center gap-1 bg-gold/20 border border-gold text-deep-green text-sm px-2.5 py-1 rounded-full">
                    {breed}
                    <button
                      type="button"
                      onClick={() => toggleArrayItem("preferred_breeds", breed)}
                      className="text-deep-green/60 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Search input */}
            <div className="relative">
              <input
                ref={breedInputRef}
                type="text"
                value={breedSearch}
                onChange={e => { setBreedSearch(e.target.value); setBreedDropdownOpen(true); }}
                onFocus={() => setBreedDropdownOpen(true)}
                onBlur={() => setTimeout(() => setBreedDropdownOpen(false), 150)}
                placeholder={t("prefs.pet.breedPh")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {breedDropdownOpen && filteredBreeds.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredBreeds.map(breed => (
                    <li
                      key={breed}
                      onMouseDown={() => {
                        toggleArrayItem("preferred_breeds", breed);
                        setBreedSearch("");
                        breedInputRef.current?.focus();
                      }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gold/10 hover:text-deep-green"
                    >
                      {breed}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("prefs.pet.maxAge")} <span className="text-gold font-semibold">{preferences.preferred_age_max} years</span>
            </label>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400">0</span>
              <input
                type="range"
                min={0}
                max={20}
                value={preferences.preferred_age_max}
                onChange={(e) => updatePreference("preferred_age_max", parseInt(e.target.value))}
                className="flex-1 accent-gold"
              />
              <span className="text-xs text-gray-400">20</span>
            </div>
          </div>

          {/* Weight Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("prefs.pet.maxWeight")} <span className="text-gold font-semibold">{preferences.preferred_weight_max} kg</span>
            </label>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-gray-400">0</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={preferences.preferred_weight_max}
                onChange={(e) => updatePreference("preferred_weight_max", parseInt(e.target.value))}
                className="flex-1 accent-gold"
              />
              <span className="text-xs text-gray-400">100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? t("prefs.saving") : t("prefs.saveBtn")}
        </button>
      </div>
    </div>
  );
}
