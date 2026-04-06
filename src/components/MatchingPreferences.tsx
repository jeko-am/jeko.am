import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { MatchingPreferences as MatchPrefsType } from "@/lib/matching-types";

interface MatchingPreferencesProps {
  petProfileId?: string;
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

const COMMON_BREEDS = [
  "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Akita Inu", "Alaskan Klee Kai", "Alaskan Malamute", "American Akita", "American Cocker Spaniel", "American Eskimo Dog", "American Foxhound", "American Staffordshire Terrier", "Anatolian Shepherd", "Appenzell Mountain Dog", "Australian Shepherd", "Basenji", "Basset Bleu de Gascogne", "Basset Fauve de Bretagne", "Basset Hound", "Beagle", "Beagle-Harrier", "Bearded Collie", "Bedlington Terrier", "Belgian Malinois", "Belgian Shepherd", "Bernese Mountain Dog", "Bernedoodle", "Bichon Frise", "Black and Tan Coonhound", "Black Russian Terrier", "Bluetick Coonhound", "Boerboel", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Boxer", "Boxer Mix", "Bracco Italiano", "Brittany", "Brittany Spaniel", "Brussels Griffon", "Bulldog", "Bullmastiff", "Bull Terrier", "Cairn Terrier", "Cane Corso", "Cardigan Welsh Corgi", "Caucasian Shepherd Dog", "Cavalier King Charles Spaniel", "Cesky Terrier", "Chesapeake Bay Retriever", "Chihuahua", "Chinese Crested Dog", "Chow Chow", "Clumber Spaniel", "Cocker Spaniel", "Cockapoo", "Coton de Tulear", "Crossbreed", "Curly-Coated Retriever", "Dachshund", "Dalmatian", "Dandie Dinmont Terrier", "Deerhound", "Doberman Pinscher", "Dogo Argentino", "Doodle Mix", "Drever", "English Cocker Spaniel", "English Foxhound", "English Pointer", "English Setter", "English Sheepdog", "English Springer Spaniel", "English Water Spaniel", "Entlebucher Mountain Dog", "Field Spaniel", "Fawn Hound", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever", "French Bulldog", "French Mastiff", "German Longhaired Pointer", "German Shepherd", "German Shorthaired Pointer", "German Wirehaired Pointer", "Glen of Imaal Terrier", "Goldendoodle", "Golden Retriever", "Gordon Setter", "Greater Swiss Mountain Dog", "Great Dane", "Great Pyrenees", "Greyhound", "Griffon Bruxellois", "Harrier", "Havanese", "Hungarian Vizsla", "Hungarian Wirehaired Vizsla", "Husky Mix", "Ibizan Hound", "Icelandic Sheepdog", "Irish Red and White Setter", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Japanese Spitz", "Japanese Terrier", "Kangal Dog", "Keeshond", "Kerry Blue Terrier", "King Charles Spaniel", "Komondor", "Kuvasz", "Labradoodle", "Labrador Retriever", "Lagotto Romagnolo", "Lakeland Terrier", "Lhasa Apso", "Long-Haired Chihuahua", "Long-Haired Dachshund", "Maltese", "Maltipoo", "Manchester Terrier", "Miniature American Shepherd", "Miniature Australian Shepherd", "Miniature Bull Terrier", "Miniature Dachshund", "Miniature Pinscher", "Miniature Schnauzer", "Mi-Ki", "Mixed Breed", "Mongrel", "Morkie", "Mudi", "Neapolitan Mastiff", "Newfoundland", "Norfolk Terrier", "Norwegian Elkhound", "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Otterhound", "Papillon", "Parson Russell Terrier", "Patterdale Terrier", "Pekingese", "Pembroke Welsh Corgi", "Phalène", "Pharaoh Hound", "Pinscher", "Plott Hound", "Polish Lowland Sheepdog", "Pomeranian", "Pomsky", "Poodle", "Portuguese Mastiff", "Portuguese Water Dog", "Pug", "Puggle", "Rat Terrier", "Redbone Coonhound", "Retriever Mix", "Rhodesian Ridgeback", "Rottweiler", "St. Bernard", "Saluki", "Samoyed", "Schnauzer", "Schnoodle", "Scottish Deerhound", "Scottish Terrier", "Segugio Italiano", "Shar Pei", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Sheepadoodle", "Skye Terrier", "Smooth-Coated Chihuahua", "Smooth-Haired Dachshund", "Soft Coated Wheaten Terrier", "Spanish Mastiff", "Spaniel Mix", "Spinone Italiano", "Springer Spaniel", "Staffordshire Bull Terrier", "Standard Dachshund", "Standard Poodle", "Standard Schnauzer", "Staghound", "Sussex Spaniel", "Swedish Elkhound", "Swedish Lapphund", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Toy Australian Terrier", "Toy Fox Terrier", "Toy Manchester Terrier", "Toy Poodle", "Toy Spitz", "Tosa Inu", "Treeing Walker Coonhound", "Vizsla", "Welsh Corgi", "Welsh Springer Spaniel", "Weimaraner", "West Highland White Terrier", "Wheaten Terrier", "Whippet", "Wirehaired Dachshund", "Wirehaired Pointing Griffon", "Wire Fox Terrier", "Xoloitzcuintli", "Yorkshire Terrier", "Yorkie Poo"
];

const COMMON_CITIES = [
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Sheffield",
  "Bradford", "Liverpool", "Bristol", "Manchester", "Edinburgh", "Leicester"
];

export default function MatchingPreferences({ petProfileId, onPreferencesChange }: MatchingPreferencesProps) {
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
    genders: ['Male', 'Female', 'Unknown'],
    walkPreferences: ['Short walks', 'Long hikes', 'Off-lead runs', 'City strolls'],
    favoriteActivities: ['Fetch', 'Swimming', 'Agility', 'Socialising', 'Tug of war', 'Frisbee'],
  });
  const [preferences, setPreferences] = useState<PreferencesState>({
    preferred_distance_km: 50,
    accept_any_city: true,
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

  useEffect(() => {
    if (user && petProfileId) {
      fetchPreferences();
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
        .single();

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
        <h3 className="text-lg font-semibold text-gray-900">Matching Preferences</h3>
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
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {COMMON_BREEDS.map(breed => (
                <label key={breed} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={(preferences.preferred_breeds || []).includes(breed)}
                    onChange={() => toggleArrayItem("preferred_breeds", breed)}
                    className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  {breed}
                </label>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (years)</label>
            <div className="flex items-center gap-2">
              <select
                value={preferences.preferred_age_min}
                onChange={(e) => updatePreference("preferred_age_min", parseInt(e.target.value))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i} value={i}>{i} yr</option>
                ))}
              </select>
              <span className="text-gray-400 text-sm">to</span>
              <select
                value={preferences.preferred_age_max}
                onChange={(e) => updatePreference("preferred_age_max", parseInt(e.target.value))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i} value={i}>{i} yr</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight Range (kg)</label>
            <div className="flex items-center gap-2">
              <select
                value={preferences.preferred_weight_min}
                onChange={(e) => updatePreference("preferred_weight_min", parseInt(e.target.value))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {[0,1,2,3,4,5,7,10,15,20,25,30,40,50,60,70,80,90,100].map(w => (
                  <option key={w} value={w}>{w} kg</option>
                ))}
              </select>
              <span className="text-gray-400 text-sm">to</span>
              <select
                value={preferences.preferred_weight_max}
                onChange={(e) => updatePreference("preferred_weight_max", parseInt(e.target.value))}
                className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {[0,1,2,3,4,5,7,10,15,20,25,30,40,50,60,70,80,90,100].map(w => (
                  <option key={w} value={w}>{w} kg</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Compatibility Preferences */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">🤝 Compatibility</h4>
        
        <div className="space-y-3">
          {/* Temperament */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperament Preferences</label>
            <div className="space-x-4">
              {configOptions.temperaments.map(temperament => (
                <label key={temperament} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={(preferences.preferred_temperaments || []).includes(temperament)}
                    onChange={() => toggleArrayItem("preferred_temperaments", temperament)}
                    className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="text-sm">{temperament}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
            <div className="space-x-4">
              {configOptions.activityLevels.map(level => (
                <label key={level} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={(preferences.preferred_activity_levels || []).includes(level)}
                    onChange={() => toggleArrayItem("preferred_activity_levels", level)}
                    className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="must-get-along"
              checked={preferences.must_get_along_with_dogs}
              onChange={(e) => updatePreference("must_get_along_with_dogs", e.target.checked)}
              className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
            />
            <label htmlFor="must-get-along" className="text-sm text-gray-700">
              Must get along with other dogs
            </label>
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
