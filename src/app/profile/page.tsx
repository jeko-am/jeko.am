"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import ImageUpload from "@/components/ImageUpload";
import PetPhotoGallery from "@/components/PetPhotoGallery";
import MatchingPreferences from "@/components/MatchingPreferences";
import BreedCombobox from "@/components/BreedCombobox";
import { useT } from "@/lib/i18n/LangProvider";

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
  pet_type: string | null;
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
  const { t } = useT();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"pet" | "profile" | "gallery" | "preferences">("pet");
  
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
  const [petDisabilities, setPetDisabilities] = useState<string[]>([]);
  const [petAllergies, setPetAllergies] = useState<string[]>([]);

  // Image upload states
  const [uploadingAvatar] = useState(false);
  const [uploadingPetPhoto] = useState(false);

  // Track whether we've already started fetching to avoid duplicate calls
  const fetchStartedRef = useRef(false);

  const loadProfiles = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      // Fetch user profile
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
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
        .eq("user_id", userId)
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
        const rawDisabilities = petData.disabilities;
        if (Array.isArray(rawDisabilities)) {
          setPetDisabilities(rawDisabilities);
        } else { setPetDisabilities([]); }
        const rawAllergies = petData.allergies;
        if (Array.isArray(rawAllergies)) {
          setPetAllergies(rawAllergies);
        } else { setPetAllergies([]); }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch profiles once auth is ready — uses ref to guarantee single execution
  useEffect(() => {
    if (authLoading || !user) return;
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;
    loadProfiles(user.id);
  }, [authLoading, user, loadProfiles]);

  // Safety net: if still loading after 3s and auth is done, force retry
  useEffect(() => {
    if (!loading || authLoading) return;
    const timer = setTimeout(() => {
      if (user && loading) {
        fetchStartedRef.current = false;
        loadProfiles(user.id);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading, authLoading, user, loadProfiles]);

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
        .update({
          display_name: displayName,
          bio,
          city,
          country,
        })
        .eq("user_id", user.id);

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
        .update({
          pet_name: petName,
          breed: petBreed,
          breed_normalized: petBreed.trim().toLowerCase(),
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
          city_normalized: petCity.trim().toLowerCase(),
          diet_preference: petDietPreference.length > 0 ? petDietPreference : null,
          disabilities: petDisabilities.length > 0 && !petDisabilities.includes('None') ? petDisabilities : null,
          allergies: petAllergies.length > 0 && !petAllergies.includes('None') ? petAllergies : null,
        })
        .eq("user_id", user.id);

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
            <h1 className="text-2xl font-medium text-gray-900 tracking-wide">{t('profile.page.title')}</h1>
            <p className="text-gray-600 mt-1">{t('profile.page.subtitle')}</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {(["pet","profile","gallery","preferences"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-gold text-gold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "profile" ? t('profile.tabs.profile') : tab === "pet" ? t('profile.tabs.pet') : tab === "gallery" ? t('profile.tabs.gallery') : t('profile.tabs.preferences')}
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
                          .update({ avatar_url: url })
                          .eq("user_id", user!.id);
                        setUserProfile(prev => prev ? { ...prev, avatar_url: url } : null);
                      } else {
                        await supabase
                          .from("user_profiles")
                          .update({ avatar_url: null })
                          .eq("user_id", user!.id);
                        setUserProfile(prev => prev ? { ...prev, avatar_url: null } : null);
                      }
                    }}
                    onUpload={async (file) => await uploadImage(file, "avatar")}
                    uploading={uploadingAvatar}
                    size="lg"
                    alt="Profile"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide">{t('profile.user.photoTitle')}</h3>
                    <p className="text-sm text-gray-500">{t('profile.user.photoSub')}</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.user.displayName')}</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.user.email')}</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.user.city')}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.user.country')}</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.user.bio')}</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder={t('profile.user.bioPlaceholder')}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveUserProfile}
                    disabled={saving}
                    className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? t('profile.user.saving') : t('profile.user.save')}
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
                      if (!petProfile) {
                        alert(t('profile.pet.photoAlertSaveFirst'));
                        return;
                      }
                      if (url) {
                        const { error } = await supabase
                          .from("pet_profiles")
                          .update({ profile_photo_url: url })
                          .eq("user_id", user!.id);
                        if (error) {
                          console.error("Error updating pet photo:", error);
                          alert(t('profile.pet.photoSaveFail'));
                          return;
                        }
                        setPetProfile(prev => prev ? { ...prev, profile_photo_url: url } : null);
                      } else {
                        await supabase
                          .from("pet_profiles")
                          .update({ profile_photo_url: null })
                          .eq("user_id", user!.id);
                        setPetProfile(prev => prev ? { ...prev, profile_photo_url: null } : null);
                      }
                    }}
                    onUpload={async (file) => await uploadImage(file, "pet")}
                    uploading={uploadingPetPhoto}
                    size="lg"
                    alt="Pet"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 tracking-wide">{t('profile.pet.photoTitle')}</h3>
                    <p className="text-sm text-gray-500">{t('profile.pet.photoSub')}</p>
                  </div>
                </div>

                {/* Pet Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.nameLabel')}</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.breedLabel')}</label>
                    <BreedCombobox
                      value={petBreed}
                      onChange={setPetBreed}
                      petType={petProfile?.pet_type || "Dog"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.cityLabel')}</label>
                    <input
                      type="text"
                      value={petCity}
                      onChange={(e) => setPetCity(e.target.value)}
                      placeholder={t('profile.pet.cityPlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.ageLabel')}</label>
                    <input
                      type="number"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.weightLabel')}</label>
                    <input
                      type="number"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.genderLabel')}</label>
                    <select
                      value={petGender}
                      onChange={(e) => setPetGender(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">{t('profile.pet.selectGender')}</option>
                      <option value="Male">{t('profile.pet.genderMale')}</option>
                      <option value="Female">{t('profile.pet.genderFemale')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.temperamentLabel')}</label>
                    <select
                      value={petTemperament}
                      onChange={(e) => setPetTemperament(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">{t('profile.pet.selectTemperament')}</option>
                      <option value="Calm">{t('profile.pet.temp.calm')}</option>
                      <option value="Playful">{t('profile.pet.temp.playful')}</option>
                      <option value="Energetic">{t('profile.pet.temp.energetic')}</option>
                      <option value="Shy">{t('profile.pet.temp.shy')}</option>
                      <option value="Protective">{t('profile.pet.temp.protective')}</option>
                      <option value="Friendly">{t('profile.pet.temp.friendly')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.activityLabel')}</label>
                    <select
                      value={petActivityLevel}
                      onChange={(e) => setPetActivityLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">{t('profile.pet.selectLevel')}</option>
                      <option value="Low">{t('profile.pet.activity.low')}</option>
                      <option value="Moderate">{t('profile.pet.activity.moderate')}</option>
                      <option value="High">{t('profile.pet.activity.high')}</option>
                      <option value="Very High">{t('profile.pet.activity.veryHigh')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.walkLabel')}</label>
                    <select
                      value={petWalkPreference}
                      onChange={(e) => setPetWalkPreference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">{t('profile.pet.selectPreference')}</option>
                      <option value="Morning">{t('profile.pet.walk.morning')}</option>
                      <option value="Evening">{t('profile.pet.walk.evening')}</option>
                      <option value="Both">{t('profile.pet.walk.both')}</option>
                      <option value="Anytime">{t('profile.pet.walk.anytime')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.activityFavLabel')}</label>
                    <select
                      value={petFavoriteActivity}
                      onChange={(e) => setPetFavoriteActivity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">{t('profile.pet.selectActivity')}</option>
                      <option value="Fetch">{t('profile.pet.fav.fetch')}</option>
                      <option value="Swimming">{t('profile.pet.fav.swimming')}</option>
                      <option value="Hiking">{t('profile.pet.fav.hiking')}</option>
                      <option value="Cuddling">{t('profile.pet.fav.cuddling')}</option>
                      <option value="Agility">{t('profile.pet.fav.agility')}</option>
                      <option value="Running">{t('profile.pet.fav.running')}</option>
                      <option value="Playing with other dogs">{t('profile.pet.fav.playOther')}</option>
                      <option value="Chasing squirrels">{t('profile.pet.fav.squirrels')}</option>
                      <option value="Napping">{t('profile.pet.fav.napping')}</option>
                      <option value="Car rides">{t('profile.pet.fav.carRides')}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.pet.dietLabel')}</label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.pet.disabilitiesLabel')}</label>
                    <div className="flex flex-wrap gap-2">
                      {['None', 'Blind', 'Deaf', 'Mobility Issues', 'Amputee', 'Epilepsy', 'Anxiety', 'Other'].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPetDisabilities(prev => {
                            if (item === 'None') return ['None'];
                            const without = prev.filter(d => d !== 'None');
                            return without.includes(item) ? without.filter(d => d !== item) : [...without, item];
                          })}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            petDisabilities.includes(item)
                              ? 'bg-gold/20 border-gold text-deep-green'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('profile.pet.allergiesLabel')}</label>
                    <div className="flex flex-wrap gap-2">
                      {['None', 'Chicken', 'Beef', 'Grain', 'Dairy', 'Eggs', 'Soy', 'Fish', 'Pollen', 'Dust', 'Flea', 'Other'].map(item => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPetAllergies(prev => {
                            if (item === 'None') return ['None'];
                            const without = prev.filter(a => a !== 'None');
                            return without.includes(item) ? without.filter(a => a !== item) : [...without, item];
                          })}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            petAllergies.includes(item)
                              ? 'bg-gold/20 border-gold text-deep-green'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.pet.bioLabel')}</label>
                  <textarea
                    value={petBio}
                    onChange={(e) => setPetBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder={t('profile.pet.bioPlaceholder')}
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
                    <span className="text-sm text-gray-700">{t('profile.pet.getsAlong')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={petLookingForMate}
                      onChange={(e) => setPetLookingForMate(e.target.checked)}
                      className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{t('profile.pet.lookingForMate')}</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={savePetProfile}
                    disabled={saving}
                    className="bg-gold hover:bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? t('profile.user.saving') : t('profile.pet.savePet')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h3 className="font-medium text-emerald-800 mb-1 tracking-wide">{t('profile.gallery.heading')}</h3>
                  <p className="text-sm text-emerald-600">{t('profile.gallery.body')}</p>
                </div>
                <PetPhotoGallery
                  petProfileId={petProfile?.id}
                />
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-medium text-amber-800 mb-1 tracking-wide">{t('profile.preferences.heading')}</h3>
                  <p className="text-sm text-amber-600">{t('profile.preferences.body')}</p>
                </div>
                <MatchingPreferences
                  petProfileId={petProfile?.id}
                  petType={petProfile?.pet_type ?? undefined}
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
