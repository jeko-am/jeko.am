"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/LangProvider";

/* ─── Types ──────────────────────────────────────────────────────────── */

type MatchStatus =
  | 'matched'
  | 'liked_by_me'
  | 'liked_by_them'
  | 'passed_by_me'
  | 'passed_by_them'
  | 'suggestion';

interface MatchWithProfile {
  id: number;
  user_a_id: string;
  user_b_id: string;
  is_active: boolean;
  created_at: string;
  conversation_id: number | null;
  status: MatchStatus;
  otherPet: {
    user_id: string;
    pet_name: string;
    breed: string | null;
    display_name: string | null;
    profile_photo_url: string | null;
    avatar_url: string | null;
    city: string | null;
    temperament: string | null;
    activity_level: string | null;
    dog_age_years: number | null;
    gender: string | null;
    bio: string | null;
  } | null;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

function timeAgo(dateStr: string, justNowLabel = "just now"): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return justNowLabel;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function petPhoto(pet: MatchWithProfile["otherPet"]): string | null {
  return pet?.profile_photo_url || pet?.avatar_url || null;
}

function petInitial(pet: MatchWithProfile["otherPet"]): string {
  return pet?.pet_name?.charAt(0).toUpperCase() || "?";
}

/* ─── Auth Modal ─────────────────────────────────────────────────────── */

function AuthModal() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const signupUrl = useSignupUrl();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError(t("matches.login.passwordTooShort"));
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gold/20 rounded-full flex items-center justify-center text-4xl">
            🐾
          </div>
          <h2 className="font-medium text-2xl text-deep-green mb-2 tracking-wide">
            {t("matches.login.title")}
          </h2>
          <p className="text-deep-green/50 text-[15px]">
            {t("matches.login.subtitle")}
          </p>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-deep-green/70 text-sm font-medium mb-1.5">
              {t("matches.login.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("matches.login.emailPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-deep-green/15 text-deep-green text-[15px] placeholder-deep-green/30 outline-none focus:border-gold transition-colors bg-off-white/40"
            />
          </div>
          <div>
            <label className="block text-deep-green/70 text-sm font-medium mb-1.5">
              {t("matches.login.password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("matches.login.passwordPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-deep-green/15 text-deep-green text-[15px] placeholder-deep-green/30 outline-none focus:border-gold transition-colors bg-off-white/40"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center bg-green-50 rounded-lg py-2 px-3">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-deep-green font-medium text-[16px] py-3.5 rounded-xl hover:bg-[#d99500] transition-colors disabled:opacity-50 tracking-wide"
          >
            {loading ? t("matches.login.pleaseWait") : t("matches.login.submit")}
          </button>
        </form>

        <p className="text-center text-deep-green/50 text-[13px] mt-4">
          {t("matches.login.noAccount")}{" "}
          <Link href={signupUrl} className="text-gold font-medium hover:underline">
            {t("matches.login.createOne")}
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────── */

function EmptyState() {
  const { t } = useT();
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-off-white rounded-full flex items-center justify-center text-5xl">
          💔
        </div>
        <h2 className="font-medium text-2xl text-deep-green mb-4 tracking-wide">
          {t("matches.empty.titleAlt")}
        </h2>
        <p className="text-deep-green/60 mb-8 leading-relaxed">
          {t("matches.empty.bodyFull")}
        </p>
        <Link
          href="/swipe"
          className="inline-block bg-gold text-deep-green font-medium text-lg px-8 py-3 rounded-xl hover:bg-[#d99500] transition-colors tracking-wide"
        >
          {t("matches.empty.startSwiping")}
        </Link>
      </div>
    </div>
  );
}

/* ─── Match Card ─────────────────────────────────────────────────────── */

function MatchCard({ match }: { match: MatchWithProfile }) {
  const { t } = useT();
  const pet = match.otherPet;
  const photo = petPhoto(pet);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      {/* Photo */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-deep-green/10 to-gold/10">
        {photo ? (
          <Image
            src={photo}
            alt={pet?.pet_name || t("matches.petFallback")}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-deep-green/10 flex items-center justify-center">
              <span className="text-3xl font-medium text-deep-green/40 tracking-wide">
                {petInitial(pet)}
              </span>
            </div>
          </div>
        )}
        {/* Status badge */}
        {match.status === "matched" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-deep-green flex items-center gap-1 tracking-wide">
            <span className="text-sm">🎉</span> {t("matches.badge.matched")}
          </div>
        )}
        {match.status === "liked_by_me" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-amber-600 flex items-center gap-1 tracking-wide">
            <span className="text-sm">⏳</span> {t("matches.badge.waiting")}
          </div>
        )}
        {match.status === "liked_by_them" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-rose-500 flex items-center gap-1 tracking-wide">
            <span className="text-sm">💗</span> {t("matches.badge.likesYou")}
          </div>
        )}
        {match.status === "passed_by_me" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-500 flex items-center gap-1 tracking-wide">
            <span className="text-sm">🚫</span> {t("matches.badge.rejectedByYou")}
          </div>
        )}
        {match.status === "passed_by_them" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-500 flex items-center gap-1 tracking-wide">
            <span className="text-sm">🚫</span> {t("matches.badge.theyPassedBadge")}
          </div>
        )}
        {match.status === "suggestion" && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-deep-green/70 flex items-center gap-1 tracking-wide">
            <span className="text-sm">✨</span> {t("matches.badge.suggested")}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-lg text-deep-green tracking-wide">
              {pet?.pet_name || t("matches.unknown")}
            </h3>
            <p className="text-sm text-deep-green/50">
              {pet?.breed || t("matches.mixedBreed")}
              {pet?.dog_age_years ? ` · ${pet.dog_age_years}y` : ""}
              {pet?.gender && pet.gender !== "Unknown" ? ` · ${pet.gender}` : ""}
            </p>
          </div>
          {pet?.city && (
            <span className="text-xs bg-deep-green/5 text-deep-green/60 px-2 py-1 rounded-full">
              📍 {pet.city}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pet?.temperament && (
            <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">
              {pet.temperament}
            </span>
          )}
          {pet?.activity_level && (
            <span className="text-xs bg-deep-green/5 text-deep-green/70 px-2 py-0.5 rounded-full font-medium">
              {pet.activity_level}
            </span>
          )}
        </div>

        {/* Bio preview */}
        {pet?.bio && (
          <p className="text-sm text-deep-green/50 mb-3 line-clamp-2">{pet.bio}</p>
        )}

        {/* Time & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-deep-green/40">
            {match.status === "matched"
              ? `${t("matches.badge.matched")} ${timeAgo(match.created_at, t("matches.time.justNow"))}`
              : match.status === "liked_by_me"
              ? t("matches.status.waiting")
              : match.status === "liked_by_them"
              ? t("matches.status.theyLike")
              : match.status === "passed_by_me"
              ? t("matches.status.youRejected")
              : match.status === "passed_by_them"
              ? t("matches.status.theyPassedOn")
              : t("matches.status.suggested")}
          </span>
          {match.status === "matched" ? (
            <Link
              href={`/messages${match.conversation_id ? `?chat=${match.conversation_id}` : ""}`}
              className="bg-gold text-deep-green font-medium text-sm px-5 py-2 rounded-xl hover:bg-[#d99500] transition-colors flex items-center gap-1.5 tracking-wide"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {t("matches.messageAction")}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              title={t("matches.messageDisabled")}
              className="bg-gold/50 text-deep-green/60 font-medium text-sm px-5 py-2 rounded-xl flex items-center gap-1.5 tracking-wide opacity-60 blur-[0.5px] cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {t("matches.messageAction")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Main Page                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function MatchesPage() {
  const { t } = useT();
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      // 1. Get current user's pet profile + matching preferences
      const [{ data: myPet }, { data: prefs }] = await Promise.all([
        supabase
          .from("pet_profiles")
          .select("breed_normalized, city_normalized, gender")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("matching_preferences")
          .select("preferred_cities, preferred_breeds, accept_any_city")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      // 2. Resolve target cities + breeds (prefer saved preferences, fall back to pet's own)
      const prefCities: string[] = (prefs?.preferred_cities || [])
        .filter(Boolean)
        .map((c: string) => c.trim().toLowerCase());
      const prefBreeds: string[] = (prefs?.preferred_breeds || [])
        .filter(Boolean)
        .map((b: string) => b.trim().toLowerCase());
      const myCityNorm = myPet?.city_normalized?.trim().toLowerCase() || null;
      const myBreedNorm = myPet?.breed_normalized?.trim().toLowerCase() || null;

      const targetCities = prefCities.length > 0
        ? prefCities
        : myCityNorm ? [myCityNorm] : [];
      const targetBreeds = prefBreeds.length > 0
        ? prefBreeds
        : myBreedNorm ? [myBreedNorm] : [];

      // 3. Fetch all pet profiles matching city AND breed, excluding self only —
      //    liked / passed / seen profiles must still appear here.
      let query = supabase
        .from("pet_profiles")
        .select(
          "user_id, pet_name, breed, display_name, profile_photo_url, avatar_url, city, temperament, activity_level, dog_age_years, gender, bio"
        )
        .neq("user_id", user.id);

      // Hard gender filter: always show only opposite gender (case-insensitive)
      const myGender = (myPet?.gender || "").toLowerCase();
      if (myGender === "male") {
        query = query.ilike("gender", "female");
      } else if (myGender === "female") {
        query = query.ilike("gender", "male");
      }

      if (!prefs?.accept_any_city && targetCities.length > 0) {
        query = query.in("city_normalized", targetCities);
      }
      if (targetBreeds.length > 0) {
        query = query.in("breed_normalized", targetBreeds);
      }

      const { data } = await query.limit(200);
      const candidates = (data || []) as NonNullable<MatchWithProfile["otherPet"]>[];
      const candidateIds = candidates.map((c) => c.user_id);

      // Fetch swipe actions in both directions to determine per-candidate status
      const [mineRes, theirsRes] = await Promise.all([
        candidateIds.length > 0
          ? supabase
              .from("swipe_actions")
              .select("swiped_id, action")
              .eq("swiper_id", user.id)
              .in("swiped_id", candidateIds)
          : Promise.resolve({ data: [] as { swiped_id: string; action: string }[] }),
        candidateIds.length > 0
          ? supabase
              .from("swipe_actions")
              .select("swiper_id, action")
              .eq("swiped_id", user.id)
              .in("swiper_id", candidateIds)
          : Promise.resolve({ data: [] as { swiper_id: string; action: string }[] }),
      ]);
      const mineArr = (mineRes.data || []) as { swiped_id: string; action: string }[];
      const theirsArr = (theirsRes.data || []) as { swiper_id: string; action: string }[];
      const myLikes = new Set(mineArr.filter((r) => r.action === "like").map((r) => r.swiped_id));
      const myPasses = new Set(mineArr.filter((r) => r.action === "pass").map((r) => r.swiped_id));
      const theirLikes = new Set(theirsArr.filter((r) => r.action === "like").map((r) => r.swiper_id));
      const theirPasses = new Set(theirsArr.filter((r) => r.action === "pass").map((r) => r.swiper_id));

      // 3. Lookup existing mutual matches + conversations for the "Message" button
      const { data: matchRows } = await supabase
        .from("matches")
        .select("id, user_a_id, user_b_id, is_active, matched_at")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("is_active", true);

      const matchByOtherUser = new Map<
        string,
        { id: number; matched_at: string; user_a_id: string; user_b_id: string; is_active: boolean }
      >();
      (matchRows as { id: number; matched_at: string; user_a_id: string; user_b_id: string; is_active: boolean }[] | null)?.forEach((m) => {
        const otherId = m.user_a_id === user.id ? m.user_b_id : m.user_a_id;
        matchByOtherUser.set(otherId, m);
      });

      const matchIds = (matchRows || []).map((m) => m.id);
      const { data: convos } = await supabase
        .from("conversations")
        .select("id, match_id")
        .in("match_id", matchIds.length > 0 ? matchIds : [-1]);
      const convoMap = new Map<number, number>();
      convos?.forEach((c) => convoMap.set(c.match_id, c.id));

      // 4. Assemble — one card per candidate (same-breed + same-city)
      const assembled: MatchWithProfile[] = candidates.map((pet, idx) => {
        const existingMatch = matchByOtherUser.get(pet.user_id);
        const iLiked = myLikes.has(pet.user_id);
        const iPassed = myPasses.has(pet.user_id);
        const theyLiked = theirLikes.has(pet.user_id);
        const theyPassed = theirPasses.has(pet.user_id);
        const status: MatchStatus = existingMatch
          ? "matched"
          : iLiked && theyLiked
          ? "matched"
          : iPassed
          ? "passed_by_me"
          : iLiked
          ? "liked_by_me"
          : theyLiked
          ? "liked_by_them"
          : theyPassed
          ? "passed_by_them"
          : "suggestion";
        return {
          id: existingMatch?.id ?? -(idx + 1),
          user_a_id: existingMatch?.user_a_id ?? user.id,
          user_b_id: existingMatch?.user_b_id ?? pet.user_id,
          is_active: existingMatch?.is_active ?? true,
          created_at: existingMatch?.matched_at ?? new Date().toISOString(),
          conversation_id: existingMatch ? convoMap.get(existingMatch.id) ?? null : null,
          status,
          otherPet: pet,
        };
      });

      setMatches(assembled);
      setLoading(false);
    })();
  }, [user]);

  /* ─── Loading state ─────────────────────────────────────────────────── */

  if (authLoading || (user && loading)) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-[76px] lg:pt-[92px]">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  /* ─── Render ────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <Header />

      <div className="flex-1 pt-[76px] lg:pt-[92px]">
        {!user ? (
          <>
            {/* Community promo banner */}
            <div className="bg-deep-green text-white py-16 px-6 text-center relative overflow-hidden">
              {/* Decorative paw prints */}
              <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-wrap gap-12 p-8">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="text-5xl">🐾</span>
                ))}
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🐶</div>
                <h1
                  className="text-4xl md:text-5xl text-gold mb-4"
                  style={{ fontFamily: "'TR Frankfurter', 'Rubik', sans-serif" }}
                >
                  {t("matches.hero.title")}
                </h1>
                <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed mb-8 tracking-wide">
                  {t("matches.hero.body")}
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {[
                    { icon: "🐾", label: t("matches.hero.findPlaymates") },
                    { icon: "💬", label: t("matches.hero.chatOwners") },
                    { icon: "❤️", label: t("matches.hero.makeMatches") },
                    { icon: "📍", label: t("matches.hero.nearYou") },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2.5">
                      <span className="text-xl">{f.icon}</span>
                      <span className="font-medium text-white text-[15px] tracking-wide">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <AuthModal />
          </>
        ) : matches.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="font-medium text-3xl md:text-4xl text-deep-green tracking-wide">
                {t("matches.titleAlt")}
              </h1>
              <p className="text-deep-green/50 mt-2">
                {(() => {
                  const mutual = matches.filter((m) => m.status === "matched").length;
                  const waiting = matches.filter((m) => m.status === "liked_by_me").length;
                  return `${matches.length} ${matches.length === 1 ? "profile" : "profiles"} — ${mutual} mutual match${mutual === 1 ? "" : "es"}${waiting > 0 ? `, ${waiting} waiting for response` : ""}`;
                })()}
              </p>
            </div>

            {/* Match Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>

            {/* CTA at bottom */}
            <div className="text-center mt-10">
              <Link
                href="/swipe"
                className="inline-flex items-center gap-2 text-deep-green/60 hover:text-deep-green font-medium transition-colors tracking-wide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {t("matches.findMore")}
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
