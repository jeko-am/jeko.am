import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { MatchingPreferences as MatchPrefsType } from "@/lib/matching-types";
import { getBreedsByPetType } from "@/lib/constants";

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


const COMMON_CITIES = [
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Sheffield",
  "Bradford", "Liverpool", "Bristol", "Manchester", "Edinburgh", "Leicester"
];

export default function MatchingPreferences({ petProfileId, petType, onPreferencesChange }: MatchingPreferencesProps) {
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
      const { data } = await supabase
        .from("matching_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .eq("pet_profile_id", petProfileId)
        .maybeSingle();

      if (data) {
        setPreferences(data);
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
      alert("Failed to save preferences. Please try again.");
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
        <h3 className="text-lg font-medium text-gray-900 tracking-wide">Matching Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Set your preferences to find better matches for your pet
        </p>
      </div>

      {/* Location Preferences */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">📍 Location Preferences</h4>
        
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
              Accept pets from any city
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Cities</label>
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
        <h4 className="font-medium text-gray-900 mb-3">🐕 Pet Preferences</h4>
        
        <div className="space-y-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Breeds</label>
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
                placeholder="Type to search breeds..."
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
              Max Age: <span className="text-gold font-semibold">{preferences.preferred_age_max} years</span>
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
              Max Weight: <span className="text-gold font-semibold">{preferences.preferred_weight_max} kg</span>
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

      {/* Matching Goals */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">🎯 What are you looking for?</h4>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.looking_for_playmates}
              onChange={(e) => updatePreference("looking_for_playmates", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Playmates for my pet</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.looking_for_mate}
              onChange={(e) => updatePreference("looking_for_mate", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">A mate for my pet</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.looking_for_walking_buddies}
              onChange={(e) => updatePreference("looking_for_walking_buddies", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Walking buddies</span>
          </label>
        </div>
      </div>

      {/* Filter Settings */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">⚙️ Filter Settings</h4>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.exclude_already_seen}
              onChange={(e) => updatePreference("exclude_already_seen", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Hide pets I&apos;ve already seen</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.exclude_already_liked}
              onChange={(e) => updatePreference("exclude_already_liked", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Hide pets I&apos;ve already liked</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.exclude_already_disliked}
              onChange={(e) => updatePreference("exclude_already_disliked", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Hide pets I&apos;ve already disliked</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
