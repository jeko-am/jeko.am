"use client";

import { useState, useEffect } from "react";
// import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import ImageUpload from "@/components/ImageUpload";
import PetPhotoGallery from "@/components/PetPhotoGallery";
import MatchingPreferences from "@/components/MatchingPreferences";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface PetProfile {
  id: string;
  user_id: string;
  pet_name: string;
  breed: string | null;
  dog_age_years: number | null;
  weight_kg: number | null;
  gender: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  temperament: string | null;
  activity_level: string | null;
  walk_preference: string | null;
  favorite_activity: string | null;
  gets_along_with_dogs: boolean;
  looking_for_mate: boolean;
  created_at: string;
}

/* ─── Profile Page Component ─────────────────────────────────────────────── */

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "pet" | "gallery" | "preferences">("profile");
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petBio, setPetBio] = useState("");
  const [petTemperament, setPetTemperament] = useState("");
  const [petActivityLevel, setPetActivityLevel] = useState("");
  const [petWalkPreference, setPetWalkPreference] = useState("");
  const [petFavoriteActivity, setPetFavoriteActivity] = useState("");
  const [petGetsAlongWithDogs, setPetGetsAlongWithDogs] = useState(true);
  const [petLookingForMate, setPetLookingForMate] = useState(false);
  const [petCity, setPetCity] = useState("");
  const [petDietPreference, setPetDietPreference] = useState<string[]>([]);

  // Image upload states
  const [uploadingAvatar] = useState(false);
  const [uploadingPetPhoto] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      fetchProfiles();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (userData) {
        setUserProfile(userData);
        setDisplayName(userData.display_name || userData.full_name || "");
        setBio(userData.bio || "");
        setCity(userData.city || "");
        setCountry(userData.country || "");
      }

      // Fetch pet profile
      const { data: petData } = await supabase
        .from("pet_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (petData) {
        setPetProfile(petData);
        setPetName(petData.pet_name || "");
        setPetBreed(petData.breed || "");
        setPetAge(petData.dog_age_years?.toString() || "");
        setPetWeight(petData.weight_kg?.toString() || "");
        setPetGender(petData.gender || "");
        setPetBio(petData.bio || "");
        setPetTemperament(petData.temperament || "");
        setPetActivityLevel(petData.activity_level || "");
        setPetWalkPreference(petData.walk_preference || "");
        setPetFavoriteActivity(petData.favorite_activity || "");
        setPetGetsAlongWithDogs(petData.gets_along_with_dogs ?? true);
        setPetLookingForMate(petData.looking_for_mate ?? false);
        setPetCity(petData.city || "");
        const rawDiet = petData.diet_preference;
        if (Array.isArray(rawDiet)) {
          setPetDietPreference(rawDiet);
        } else if (typeof rawDiet === 'string') {
          try { setPetDietPreference(JSON.parse(rawDiet)); } catch { setPetDietPreference([]); }
        } else {
          setPetDietPreference([]);
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, type: "avatar" | "pet") => {
    if (!user) return null;

    try {
      const folder = type === "avatar" ? "pure-pet/avatars" : "pure-pet/pets";
      const publicId = `${user.id}-${type}-${Date.now()}`;
      
      const result = await uploadToCloudinary(file, {
        folder,
        publicId,
        resourceType: 'image'
      });

      return result?.secure_url || null;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  // handleAvatarUpload removed - now using ImageUpload component directly

  // handlePetPhotoUpload removed - now using ImageUpload component directly

  const saveUserProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          display_name: displayName,
          bio,
          city,
          country,
        });

      setUserProfile(prev => prev ? {
        ...prev,
        display_name: displayName,
        bio,
        city,
        country,
      } : null);
    } catch (error) {
      console.error("Error saving user profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const savePetProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from("pet_profiles")
        .upsert({
          user_id: user.id,
          pet_name: petName,
          breed: petBreed,
          dog_age_years: petAge ? parseInt(petAge) : null,
          weight_kg: petWeight ? parseFloat(petWeight) : null,
          gender: petGender,
          bio: petBio,
          temperament: petTemperament,
          activity_level: petActivityLevel,
          walk_preference: petWalkPreference,
          favorite_activity: petFavoriteActivity,
          gets_along_with_dogs: petGetsAlongWithDogs,
          looking_for_mate: petLookingForMate,
          city: petCity,
          city_normalized: petCity.toLowerCase(),
          diet_preference: petDietPreference.length > 0 ? petDietPreference : null,
        });

      setPetProfile(prev => prev ? {
        ...prev,
        pet_name: petName,
        breed: petBreed,
        dog_age_years: petAge ? parseInt(petAge) : null,
        weight_kg: petWeight ? parseFloat(petWeight) : null,
        gender: petGender,
        bio: petBio,
        temperament: petTemperament,
        activity_level: petActivityLevel,
        walk_preference: petWalkPreference,
        favorite_activity: petFavoriteActivity,
        gets_along_with_dogs: petGetsAlongWithDogs,
        looking_for_mate: petLookingForMate,
      } : null);
    } catch (error) {
      console.error("Error saving pet profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 lg:pt-28 pb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-medium text-gray-900 tracking-wide">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and pet profile</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {(["profile","pet","gallery","preferences"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-gold text-gold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "profile" ? "Your Profile" : tab === "pet" ? "Pet Profile" : tab === "gallery" ? "Swipe Photos" : "Match Preferences"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-2">
                  <ImageUpload
                    inputId="avatar-upload"
                    currentImage={userProfile?.avatar_url}
                    onImageChange={async (url) => {
                      if (url) {
                        await supabase
                          .from("user_profiles")
                          .upsert({
                            user_id: user!.id,
                            avatar_url: url,
                          });
                        setUserProfile(prev => prev ? { ...prev, avatar_url: url } : null);
                      } else {
                        await supabase
                          .from("user_profiles")
                          .upsert({
                            user_id: user!.id,
                            avatar_url: null,
                          });
                        setUserProfile(prev => prev ? { ...prev, avatar_url: null } : null);
                      }
                    }}
                    onUpload={async (file) => await uploadImage(file, "avatar")}
                    uploading={uploadingAvatar}
                    size="lg"
                    alt="Profile"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide">Profile Photo</h3>
                    <p className="text-sm text-gray-500">Upload a photo to help others recognize you</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveUserProfile}
                    disabled={saving}
                    className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "pet" && (
              <div className="space-y-6">
                {/* Pet Photo */}
                <div className="flex items-center gap-6 pb-2">
                  <ImageUpload
                    inputId="pet-photo-upload"
                    currentImage={petProfile?.profile_photo_url}
                    onImageChange={async (url) => {
                      if (url) {
                        await supabase
                          .from("pet_profiles")
                          .upsert({
                            user_id: user!.id,
                            profile_photo_url: url,
                          });
                        setPetProfile(prev => prev ? { ...prev, profile_photo_url: url } : null);
                      } else {
                        await supabase
                          .from("pet_profiles")
                          .upsert({
                            user_id: user!.id,
                            profile_photo_url: null,
                          });
                        setPetProfile(prev => prev ? { ...prev, profile_photo_url: null } : null);
                      }
                    }}
                    onUpload={async (file) => await uploadImage(file, "pet")}
                    uploading={uploadingPetPhoto}
                    size="lg"
                    alt="Pet"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide">Pet Photo</h3>
                    <p className="text-sm text-gray-500">Add a photo of your furry friend</p>
                  </div>
                </div>

                {/* Pet Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                    <input
                      type="text"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={petCity}
                      onChange={(e) => setPetCity(e.target.value)}
                      placeholder="e.g. Yerevan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                    <input
                      type="number"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={petGender}
                      onChange={(e) => setPetGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperament</label>
                    <select
                      value={petTemperament}
                      onChange={(e) => setPetTemperament(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select temperament</option>
                      <option value="Calm">Calm</option>
                      <option value="Playful">Playful</option>
                      <option value="Energetic">Energetic</option>
                      <option value="Shy">Shy</option>
                      <option value="Protective">Protective</option>
                      <option value="Friendly">Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select
                      value={petActivityLevel}
                      onChange={(e) => setPetActivityLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select level</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Walk Preference</label>
                    <select
                      value={petWalkPreference}
                      onChange={(e) => setPetWalkPreference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select preference</option>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Both">Both</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Activity</label>
                    <select
                      value={petFavoriteActivity}
                      onChange={(e) => setPetFavoriteActivity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select activity</option>
                      <option value="Fetch">Fetch</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Hiking">Hiking</option>
                      <option value="Cuddling">Cuddling</option>
                      <option value="Agility">Agility</option>
                      <option value="Running">Running</option>
                      <option value="Playing with other dogs">Playing with other dogs</option>
                      <option value="Chasing squirrels">Chasing squirrels</option>
                      <option value="Napping">Napping</option>
                      <option value="Car rides">Car rides</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Preference</label>
                    <div className="flex flex-wrap gap-2">
                      {['Raw', 'Kibble', 'Mixed', 'Homemade', 'Natural', 'Chicken', 'Beef', 'Lamb', 'Vegetables'].map(diet => (
                        <button
                          key={diet}
                          type="button"
                          onClick={() => setPetDietPreference(prev =>
                            prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
                          )}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            petDietPreference.includes(diet)
                              ? 'bg-gold/20 border-gold text-deep-green'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {diet}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pet Bio</label>
                  <textarea
                    value={petBio}
                    onChange={(e) => setPetBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Tell us about your pet..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={petGetsAlongWithDogs}
                      onChange={(e) => setPetGetsAlongWithDogs(e.target.checked)}
                      className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">My pet gets along with other dogs</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={petLookingForMate}
                      onChange={(e) => setPetLookingForMate(e.target.checked)}
                      className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Looking for a mate for my pet</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={savePetProfile}
                    disabled={saving}
                    className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Pet Profile"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-medium text-emerald-800 mb-1 tracking-wide">Swipe Card Photos</h3>
                  <p className="text-sm text-emerald-600">Upload up to 6 photos that will appear on your pet&apos;s swipe card. The primary photo shows first.</p>
                </div>
                <PetPhotoGallery
                  petProfileId={petProfile?.id}
                />
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-medium text-amber-800 mb-1 tracking-wide">Matching Preferences</h3>
                  <p className="text-sm text-amber-600">Set your preferences to find the best matches. These filters help us show you more relevant pets.</p>
                </div>
                <MatchingPreferences
                  petProfileId={petProfile?.id}
                  onPreferencesChange={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
