"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { useSignupUrl } from "@/lib/useSignupUrl";
import { supabase } from "@/lib/supabase";

interface PetCandidate {
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
  photos?: string[];
}

const BATCH_SIZE = 10;
const PRELOAD_THRESHOLD = 3;
const SWIPE_THRESHOLD = 100;

const swipeCSS = `
@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
@keyframes confetti-sway {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(15px); }
  75% { transform: translateX(-15px); }
}
@keyframes card-fly-left {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  40% { transform: translateX(-30%) rotate(-6deg) scale(0.96); opacity: 1; }
  100% { transform: translateX(-110%) rotate(-14deg) scale(0.8); opacity: 0.2; }
}
@keyframes card-fly-right {
  0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; }
  40% { transform: translateX(30%) rotate(6deg) scale(0.96); opacity: 1; }
  100% { transform: translateX(110%) rotate(14deg) scale(0.8); opacity: 0.2; }
}
@keyframes card-enter {
  0% { transform: scale(0.9) translateY(10px); opacity: 0.6; }
  60% { opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes card-rise {
  0% { transform: scale(0.9) translateY(10px); opacity: 0.6; }
  60% { opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes pulse-match {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function ConfettiOverlay() {
  const colors = ["#F2A900","#274C46","#E65A1E","#5F295E","#ff6b6b","#48dbfb","#ff9ff3","#feca57","#54a0ff","#5f27cd"];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i, left: Math.random()*100, delay: Math.random()*3, duration: 2.5+Math.random()*2,
    size: 6+Math.random()*8, color: colors[Math.floor(Math.random()*colors.length)],
    shape: Math.random()>0.5?"circle":"rect",
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((p)=>(
        <div key={p.id} style={{
          position:"absolute",left:`${p.left}%`,top:"-10px",
          width:p.shape==="circle"?p.size:p.size*0.6, height:p.size,
          backgroundColor:p.color, borderRadius:p.shape==="circle"?"50%":"2px",
          animation:`confetti-fall ${p.duration}s ${p.delay}s ease-in forwards, confetti-sway ${p.duration*0.5}s ${p.delay}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

function PawIcon({ size=48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="opacity-40">
      <ellipse cx="8" cy="6.5" rx="2.2" ry="2.8"/>
      <ellipse cx="16" cy="6.5" rx="2.2" ry="2.8"/>
      <ellipse cx="4.5" cy="12" rx="2" ry="2.5"/>
      <ellipse cx="19.5" cy="12" rx="2" ry="2.5"/>
      <path d="M7.5 16.5C7.5 14 9.5 12.5 12 12.5C14.5 12.5 16.5 14 16.5 16.5C16.5 19 14.5 21 12 21C9.5 21 7.5 19 7.5 16.5Z"/>
    </svg>
  );
}

function MatchModal({ myPet, theirPet, onMessage, onKeepSwiping }: {
  myPet: PetCandidate|null; theirPet: PetCandidate; onMessage: ()=>void; onKeepSwiping: ()=>void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onKeepSwiping}/>
      <ConfettiOverlay/>
      <div className="relative z-10 bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl" style={{animation:"fade-in-up 0.5s ease-out"}}>
        <h2 className="font-medium text-3xl text-emerald-500 mb-2 tracking-wide" style={{animation:"pulse-match 1.5s ease-in-out infinite"}}>
          It&apos;s a Match! 🎉
        </h2>
        <p className="text-gray-500 mb-6">You and {theirPet.pet_name} like each other!</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-400 shadow-lg bg-gray-100">
              {(myPet?.profile_photo_url||myPet?.avatar_url) ? (
                <Image src={(myPet.profile_photo_url||myPet.avatar_url)!} alt={myPet.pet_name||"My pet"} width={96} height={96} className="w-full h-full object-cover" unoptimized/>
              ) : (<div className="w-full h-full flex items-center justify-center"><PawIcon size={40}/></div>)}
            </div>
            <span className="text-sm font-medium text-gray-700 mt-2 tracking-wide">{myPet?.pet_name||"Your pet"}</span>
          </div>
          <div className="text-3xl" style={{animation:"pulse-match 1s ease-in-out infinite"}}>❤️</div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-400 shadow-lg bg-gray-100">
              {(theirPet.profile_photo_url||theirPet.avatar_url) ? (
                <Image src={(theirPet.profile_photo_url||theirPet.avatar_url)!} alt={theirPet.pet_name||"Their pet"} width={96} height={96} className="w-full h-full object-cover" unoptimized/>
              ) : (<div className="w-full h-full flex items-center justify-center"><PawIcon size={40}/></div>)}
            </div>
            <span className="text-sm font-medium text-gray-700 mt-2 tracking-wide">{theirPet.pet_name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onMessage} className="w-full bg-emerald-500 text-white font-medium text-lg py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-md tracking-wide">
            Send a Message
          </button>
          <button onClick={onKeepSwiping} className="w-full bg-gray-100 text-gray-700 font-medium text-lg py-3 rounded-xl hover:bg-gray-200 transition-colors tracking-wide">
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SwipeCard = memo(function SwipeCard({ candidate, isTop, onSwipe, onLove: _onLove, likesToday: _likesToday }: {
  candidate: PetCandidate; isTop: boolean; onSwipe: (d:"left"|"right")=>void; onLove: ()=>void; likesToday: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState({isDragging:false, startX:0, currentX:0, dx:0});
  const [flyDirection, setFlyDirection] = useState<"left"|"right"|null>(null);
  const animatingRef = useRef(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Build photos array: gallery photos first, then fallback to profile photo
  const allPhotos = (() => {
    const photos: string[] = [];
    if (candidate.photos && candidate.photos.length > 0) photos.push(...candidate.photos);
    else if (candidate.profile_photo_url) photos.push(candidate.profile_photo_url);
    else if (candidate.avatar_url) photos.push(candidate.avatar_url);
    return photos;
  })();
  const photoUrl = allPhotos[photoIndex] || null;
  const sizeLabel = candidate.weight_kg ? (candidate.weight_kg<10?"Small":candidate.weight_kg<25?"Medium":"Large") : null;
  const distanceLabel = candidate.city||"Nearby";

  const handleStart = useCallback((clientX:number)=>{
    if(!isTop||animatingRef.current) return;
    setDragState({isDragging:true,startX:clientX,currentX:clientX,dx:0});
  },[isTop]);

  const handleMove = useCallback((clientX:number)=>{
    setDragState(prev=>{
      if(!prev.isDragging) return prev;
      return {...prev, currentX:clientX, dx:clientX-prev.startX};
    });
  },[]);

  const handleEnd = useCallback(()=>{
    setDragState(prev=>{
      if(!prev.isDragging) return prev;
      const dx=prev.dx;
      if(Math.abs(dx)>SWIPE_THRESHOLD){
        const dir=dx>0?"right":"left";
        setFlyDirection(dir); animatingRef.current=true;
        setTimeout(()=>{onSwipe(dir);animatingRef.current=false;setFlyDirection(null);},600);
      }
      return {isDragging:false,startX:0,currentX:0,dx:0};
    });
  },[onSwipe]);

  useEffect(()=>{
    if(!isTop) return;
    const card=cardRef.current; if(!card) return;
    const onTS=(e:TouchEvent)=>{e.preventDefault();e.stopPropagation();handleStart(e.touches[0].clientX);};
    const onTM=(e:TouchEvent)=>{e.preventDefault();e.stopPropagation();handleMove(e.touches[0].clientX);};
    const onTE=(e:TouchEvent)=>{e.preventDefault();e.stopPropagation();handleEnd();};
    card.addEventListener("touchstart",onTS,{passive:false});
    card.addEventListener("touchmove",onTM,{passive:false});
    card.addEventListener("touchend",onTE,{passive:false});
    return()=>{card.removeEventListener("touchstart",onTS);card.removeEventListener("touchmove",onTM);card.removeEventListener("touchend",onTE);};
  },[isTop,handleStart,handleMove,handleEnd]);

  useEffect(()=>{
    if(!isTop||!dragState.isDragging) return;
    const onMM=(e:MouseEvent)=>{e.preventDefault();e.stopPropagation();handleMove(e.clientX);};
    const onMU=(e:MouseEvent)=>{e.preventDefault();e.stopPropagation();handleEnd();};
    window.addEventListener("mousemove",onMM); window.addEventListener("mouseup",onMU);
    return()=>{window.removeEventListener("mousemove",onMM);window.removeEventListener("mouseup",onMU);};
  },[isTop,dragState.isDragging,handleMove,handleEnd]);

  const triggerSwipe = useCallback((dir:"left"|"right")=>{
    if(animatingRef.current) return;
    setFlyDirection(dir); animatingRef.current=true;
    setTimeout(()=>{onSwipe(dir);animatingRef.current=false;setFlyDirection(null);},600);
  },[onSwipe]);

  useEffect(()=>{
    const card=cardRef.current; if(!card||!isTop) return;
    (card as HTMLDivElement&{triggerSwipe?:(d:"left"|"right")=>void}).triggerSwipe=triggerSwipe;
  },[isTop,triggerSwipe]);

  const dx=dragState.isDragging?dragState.dx:0;
  const likeOpacity=Math.min(Math.max(dx/SWIPE_THRESHOLD,0),1);
  const nopeOpacity=Math.min(Math.max(-dx/SWIPE_THRESHOLD,0),1);

  let cardStyle: React.CSSProperties;
  if(flyDirection) cardStyle={animation:`card-fly-${flyDirection} 0.6s cubic-bezier(0.22,0.68,0.35,1) forwards`, willChange:"transform"};
  else if(dragState.isDragging) cardStyle={transform:`translateX(${dx}px) rotate(${dx*0.05}deg)`,transition:"none",cursor:"grabbing", willChange:"transform"};
  else if(isTop) cardStyle={transform:"translateX(0) rotate(0deg)",transition:"transform 0.2s ease-out",cursor:"grab",animation:"card-enter 0.5s cubic-bezier(0.22,0.68,0.35,1)", willChange:"transform"};
  else cardStyle={transform:"scale(0.9) translateY(10px)",opacity:0.6,transition:"all 0.5s cubic-bezier(0.22,0.68,0.35,1)", willChange:"transform"};

  return (
    <div ref={cardRef} className="absolute inset-0 select-none touch-none" style={{...cardStyle,zIndex:isTop?10:5}}
      onMouseDown={(e)=>{const t=e.target as HTMLElement;if(!t.closest('button')){e.preventDefault();handleStart(e.clientX);}}}
      onTouchStart={(e)=>{const t=e.target as HTMLElement;if(!t.closest('button')){e.preventDefault();handleStart(e.touches[0].clientX);}}}>
      <div className="w-full h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-white relative">
        {isTop && (
          <>
            <div className="absolute top-6 left-5 z-30 border-[3px] border-emerald-400 text-emerald-400 font-black text-2xl sm:text-3xl px-4 py-1 rounded-xl -rotate-12 bg-white/80 backdrop-blur-sm"
              style={{opacity:likeOpacity,transition:dragState.isDragging?"none":"opacity 0.15s ease-out"}}>LIKE</div>
            <div className="absolute top-6 right-5 z-30 border-[3px] border-red-400 text-red-400 font-black text-2xl sm:text-3xl px-4 py-1 rounded-xl rotate-12 bg-white/80 backdrop-blur-sm"
              style={{opacity:nopeOpacity,transition:dragState.isDragging?"none":"opacity 0.15s ease-out"}}>NOPE</div>
          </>
        )}
        <div className="relative flex-1 min-h-0 bg-gradient-to-br from-amber-100 to-orange-50">
          {photoUrl ? (
            <Image src={photoUrl} alt={candidate.pet_name||"Pet"} fill className="object-cover" unoptimized sizes="(max-width:640px) 95vw, 420px"
              onError={(e)=>{(e.target as HTMLImageElement).style.display="none";}}/>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center"><PawIcon size={80}/><p className="text-gray-400 text-sm mt-2">No photo yet</p></div>
            </div>
          )}
          {/* Tap zones for photo navigation */}
          {allPhotos.length > 1 && isTop && (
            <>
              <button className="absolute top-0 left-0 w-1/3 h-2/3 z-20" aria-label="Previous photo"
                onClick={(e)=>{e.stopPropagation();setPhotoIndex(i=>Math.max(0,i-1));}} />
              <button className="absolute top-0 right-0 w-1/3 h-2/3 z-20" aria-label="Next photo"
                onClick={(e)=>{e.stopPropagation();setPhotoIndex(i=>Math.min(allPhotos.length-1,i+1));}} />
            </>
          )}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
            {allPhotos.length > 0 ? allPhotos.map((_, i) => (
              <div key={i} className={`h-2 rounded-full shadow transition-all ${i === photoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`} />
            )) : (
              <div className="w-6 h-2 rounded-full bg-white/50 shadow"/>
            )}
            <div className="w-2 h-2 rounded-full bg-white/50"/>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10"/>
        </div>
        <div className="px-5 pt-1 pb-1">
          <h3 className="font-medium text-xl sm:text-2xl text-gray-900 text-center tracking-wide">{candidate.pet_name||candidate.breed}</h3>
          <p className="text-gray-400 text-sm text-center">{candidate.breed}</p>
          <div className="flex items-center justify-center gap-4 mt-1 text-gray-500 text-sm flex-wrap">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {distanceLabel}
            </span>
            {sizeLabel && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                {sizeLabel}
              </span>
            )}
            {candidate.dog_age_years !== null && candidate.dog_age_years !== undefined && (
              <span className="inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {candidate.dog_age_years} {candidate.dog_age_years === 1 ? "year" : "years"}
              </span>
            )}
          </div>
        </div>
        {isTop && (
          <div className="flex items-center justify-center gap-3 px-5 pb-4 pt-2">
            <button onClick={(e)=>{e.stopPropagation();triggerSwipe("left");}}
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 active:scale-90 transition-all shadow-lg" aria-label="Pass">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-5.12-2.12L3.46 8.3A2 2 0 003 9.74V18a2 2 0 002 2h7.12a2 2 0 001.94-1.5l1.88-7.5A1 1 0 0015 10h-1z"/></svg>
            </button>
            <button onClick={(e)=>{e.stopPropagation();triggerSwipe("right");}}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 flex items-center justify-center text-white shadow-lg transition-all" aria-label="Love">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
            <button onClick={(e)=>{e.stopPropagation();triggerSwipe("left");}}
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 active:scale-90 transition-all shadow-lg" aria-label="Next">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

function NotLoggedInCTA() {
  const signupUrl = useSignupUrl();
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center text-4xl">🐾</div>
        <h2 className="font-medium text-2xl sm:text-3xl text-gray-900 mb-4 tracking-wide">Find Playmates for Your Pup</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">Swipe through local pets, match with compatible playmates, and set up the perfect date!</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/login" className="flex-1 bg-emerald-500 text-white font-medium text-lg py-3 rounded-xl hover:bg-emerald-600 transition-colors text-center tracking-wide">Log In</Link>
          <Link href={signupUrl} className="flex-1 bg-gray-900 text-white font-medium text-lg py-3 rounded-xl hover:bg-gray-800 transition-colors text-center tracking-wide">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

function NotEnoughPhotosCTA({ photoCount }: { photoCount: number }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center text-4xl">📸</div>
        <h2 className="font-medium text-2xl sm:text-3xl text-gray-900 mb-3 tracking-wide">Add More Photos First</h2>
        <p className="text-gray-500 mb-4 leading-relaxed">
          You need at least <strong>1 photo</strong> of your pet before you can start matching. Go to your profile and upload a pet photo!
        </p>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium border-2 ${photoCount > 0 ? "bg-emerald-100 border-emerald-400 text-emerald-600" : "bg-gray-100 border-gray-300 text-gray-400"}`}>
            {photoCount > 0 ? "✓" : "1"}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-6">{photoCount}/1 photo added</p>
        <Link href="/profile" className="inline-block w-full bg-emerald-500 text-white font-medium text-lg py-3 rounded-xl hover:bg-emerald-600 transition-colors tracking-wide">
          Upload Photos in Profile →
        </Link>
      </div>
    </div>
  );
}

function NoPetProfileCTA() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center text-4xl">🐶</div>
        <h2 className="font-medium text-2xl sm:text-3xl text-gray-900 mb-4 tracking-wide">Complete Your Pet Profile</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">Before swiping, add photos and details about your pet. Go to your profile to upload swipe photos!</p>
        <Link href="/profile" className="inline-block bg-emerald-500 text-white font-medium text-lg px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors tracking-wide">Set Up Profile</Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-4xl">🐾</div>
        <h2 className="font-medium text-2xl sm:text-3xl text-gray-900 mb-4 tracking-wide">No More Pets Nearby!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">You&apos;ve seen all available pets. Check back later for new friends!</p>
        <Link href="/community" className="inline-block bg-emerald-500 text-white font-medium text-lg px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors tracking-wide">Explore Community</Link>
      </div>
    </div>
  );
}

export default function SwipePage() {
  const { user, loading: authLoading } = useAuth();
  const [myPetProfile, setMyPetProfile] = useState<PetCandidate|null>(null);
  const [hasProfile, setHasProfile] = useState<boolean|null>(null);
  const [photoCount, setPhotoCount] = useState<number|null>(null);
  const [candidates, setCandidates] = useState<PetCandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [allExhausted, setAllExhausted] = useState(false);
  const loadingMoreRef = useRef(false);
  // Tracks user_ids already swiped in this session so in-flight upserts don't
  // let already-swiped cards reappear when loadCandidates fires before the DB commits.
  const swipedIdsRef = useRef<Set<string>>(new Set());
  const [likesToday, setLikesToday] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [matchModalPet, setMatchModalPet] = useState<PetCandidate|null>(null);
  const topCardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      const {data}=await supabase.from("pet_profiles").select("*").eq("user_id",user.id).limit(1).maybeSingle();
      if(data){
        setMyPetProfile(data as PetCandidate);
        setHasProfile(true);
        // Count gallery photos; if none, profile_photo_url counts as 1
        const {count}=await supabase.from("pet_photos").select("*",{count:"exact",head:true}).eq("user_id",user.id);
        const galleryCount = count ?? 0;
        setPhotoCount(galleryCount > 0 ? galleryCount : (data.profile_photo_url ? 1 : 0));
      } else {
        setHasProfile(false);
        setPhotoCount(0);
      }
    })();
  },[user]);

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      const todayStart=new Date();todayStart.setHours(0,0,0,0);
      const {count:todayLikes}=await supabase.from("swipe_actions").select("*",{count:"exact",head:true}).eq("swiper_id",user.id).eq("action","like").gte("created_at",todayStart.toISOString());
      setLikesToday(todayLikes??0);
      const {count:totalMatches}=await supabase.from("matches").select("*",{count:"exact",head:true}).or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`).eq("is_active",true);
      setMatchCount(totalMatches??0);
    })();
  },[user]);

  const loadCandidates = useCallback(async(append=false)=>{
    if(!user||loadingMoreRef.current) return;
    loadingMoreRef.current=true;
    if(!append) setLoadingCandidates(true);
    try{
      // Fetch user's matching preferences
      const {data:prefs}=await supabase.from("matching_preferences").select("*").eq("user_id",user.id).maybeSingle();

      // Build exclude set based on preferences
      const {data:swipedRows}=await supabase.from("swipe_actions").select("swiped_id,action").eq("swiper_id",user.id);
      const excludeSet=new Set<string>([user.id]);
      for(const row of swipedRows||[]){
        const exSeen=prefs?.exclude_already_seen??true;
        const exLiked=prefs?.exclude_already_liked??false;
        const exDisliked=prefs?.exclude_already_disliked??true;
        if(exSeen||(exLiked&&row.action==="like")||(exDisliked&&row.action==="pass")){
          excludeSet.add(row.swiped_id);
        }
      }
      // Include in-flight swipes that haven't hit the DB yet
      for(const id of swipedIdsRef.current) excludeSet.add(id);
      const excludedIds=Array.from(excludeSet);

      // Build candidate query with preference filters
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query:any=supabase.from("pet_profiles").select("*").not("user_id","in",`(${excludedIds.join(",")})`);

      // "What are you looking for?" — if ONLY mate is selected, filter to looking_for_mate=true
      const wantsPlaymates=prefs?.looking_for_playmates??true;
      const wantsMate=prefs?.looking_for_mate??false;
      const wantsWalking=prefs?.looking_for_walking_buddies??false;
      if(wantsMate && !wantsPlaymates && !wantsWalking){
        query=query.eq("looking_for_mate",true);
      }

      // Gender filter
      if((prefs?.preferred_genders||[]).length>0){
        query=query.in("gender",prefs!.preferred_genders);
      }

      // Age range filter (only apply if non-default)
      const ageMin=prefs?.preferred_age_min??0;
      const ageMax=prefs?.preferred_age_max??20;
      if(ageMin>0) query=query.gte("dog_age_years",ageMin);
      if(ageMax<20) query=query.lte("dog_age_years",ageMax);

      // Weight range filter (only apply if non-default)
      const wMin=prefs?.preferred_weight_min??0;
      const wMax=prefs?.preferred_weight_max??100;
      if(wMin>0) query=query.gte("weight_kg",wMin);
      if(wMax<100) query=query.lte("weight_kg",wMax);

      // Location filter - respect user preferences
      const acceptAnyCity=prefs?.accept_any_city??false;
      const preferredCities=prefs?.preferred_cities??[];
      if(!acceptAnyCity){
        if(preferredCities.length>0){
          // Filter to only preferred cities (normalize for comparison)
          const preferredCitiesNorm=preferredCities.map((c:string)=>c.toLowerCase());
          query=query.in("city_normalized",preferredCitiesNorm);
        } else if(myPetProfile?.city_normalized){
          // If user doesn't accept any city but has no preferred list, default to same city
          query=query.eq("city_normalized",myPetProfile.city_normalized);
        }
      }

      // Breed filter - apply at database level if specified
      if((prefs?.preferred_breeds||[]).length>0){
        const preferredBreedsNorm=prefs!.preferred_breeds!.map((b:string)=>b.toLowerCase());
        query=query.in("breed_normalized",preferredBreedsNorm);
      }

      const {data:fetched}=await query.limit(BATCH_SIZE*3);
      const allCandidates:PetCandidate[]=(fetched||[]) as PetCandidate[];

      // Sort: same city first, then same breed, then random
      const myCity=myPetProfile?.city_normalized||"";
      const myBreed=myPetProfile?.breed_normalized||"";
      allCandidates.sort((a,b)=>{
        const ac=a.city_normalized===myCity?0:1;
        const bc=b.city_normalized===myCity?0:1;
        if(ac!==bc) return ac-bc;
        const ab2=a.breed_normalized===myBreed?0:1;
        const bb2=b.breed_normalized===myBreed?0:1;
        if(ab2!==bb2) return ab2-bb2;
        return Math.random()-0.5;
      });

      const batch=allCandidates.slice(0,BATCH_SIZE);
      if(batch.length>0){
        const userIds=batch.map(c=>c.user_id);
        const {data:profiles}=await supabase.from("user_profiles").select("user_id, full_name").in("user_id",userIds);
        if(profiles){
          const nameMap=new Map(profiles.map(p=>[p.user_id,p.full_name]));
          batch.forEach(c=>{c.owner_name=nameMap.get(c.user_id)||null;});
        }
        // Fetch gallery photos for each candidate
        const {data:allPhotos}=await supabase.from("pet_photos").select("user_id, photo_url, photo_order").in("user_id",userIds).order("photo_order",{ascending:true});
        if(allPhotos){
          const photoMap=new Map<string,string[]>();
          for(const p of allPhotos){
            if(!photoMap.has(p.user_id)) photoMap.set(p.user_id,[]);
            photoMap.get(p.user_id)!.push(p.photo_url);
          }
          batch.forEach(c=>{
            const gallery = photoMap.get(c.user_id) || [];
            // If no gallery photos, use profile_photo_url as primary
            c.photos = gallery.length > 0 ? gallery : (c.profile_photo_url ? [c.profile_photo_url] : []);
          });
        }
      }
      if(append) {
        setCandidates(prev=>{
          const existing=new Set(prev.map(c=>c.user_id));
          const deduped=batch.filter(c=>!existing.has(c.user_id)&&!swipedIdsRef.current.has(c.user_id));
          if(deduped.length===0) setAllExhausted(true);
          return [...prev,...deduped];
        });
      } else {
        if(batch.length===0) setAllExhausted(true);
        setCandidates(batch);
        setCurrentIndex(0);
      }
    }catch(err){console.error("Failed to load candidates:",err);}
    finally{setLoadingCandidates(false);loadingMoreRef.current=false;}
  },[user,myPetProfile]);

  useEffect(()=>{
    if(hasProfile===true) loadCandidates(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hasProfile]);

  useEffect(()=>{
    const remaining=candidates.length-currentIndex;
    if(remaining<=PRELOAD_THRESHOLD&&remaining>0&&!allExhausted) loadCandidates(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentIndex,candidates.length,allExhausted]);

  const handleSwipe = useCallback((direction:"left"|"right")=>{
    const candidate=candidates[currentIndex];
    if(!candidate||!user) return;
    swipedIdsRef.current.add(candidate.user_id);
    setCurrentIndex(prev=>prev+1);
    const action=direction==="right"?"like":"pass";
    if(action==="like") setLikesToday(prev=>prev+1);
    (async()=>{
      const {error:swipeErr}=await supabase.from("swipe_actions").upsert({swiper_id:user.id,swiped_id:candidate.user_id,action},{onConflict:"swiper_id,swiped_id"});
      if(swipeErr) console.error("Swipe insert failed:",swipeErr.message);
      if(action==="like"){
        const {data:mutual}=await supabase.from("swipe_actions").select("id").eq("swiper_id",candidate.user_id).eq("swiped_id",user.id).eq("action","like").maybeSingle();
        if(mutual){
          const [userA,userB]=user.id<candidate.user_id?[user.id,candidate.user_id]:[candidate.user_id,user.id];
          const {data:matchRow,error:matchErr}=await supabase.from("matches").insert({user_a_id:userA,user_b_id:userB,is_active:true}).select("id").single();
          if(matchErr) console.error("Match insert failed:",matchErr.message);
          if(matchRow){
            await supabase.from("conversations").insert({match_id:matchRow.id,participant_a:userA,participant_b:userB});
          }
          setMatchCount(prev=>prev+1);
          setMatchModalPet(candidate);
        }
      }
    })();
  },[candidates,currentIndex,user]);

  const handleLove = useCallback(()=>{
    const container=topCardContainerRef.current;
    if(!container) return;
    const topCard=container.querySelector("[style*='z-index: 10']") as (HTMLDivElement&{triggerSwipe?:(d:"left"|"right")=>void})|null;
    if(topCard?.triggerSwipe) topCard.triggerSwipe("right");
    else handleSwipe("right");
  },[handleSwipe]);

  const currentCandidate=candidates[currentIndex]||null;
  const nextCandidate=candidates[currentIndex+1]||null;
  const showEmptyState=!loadingCandidates&&(allExhausted||!currentCandidate)&&currentIndex>=candidates.length;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:swipeCSS}}/>
      <div className="min-h-screen flex flex-col bg-gray-50 pt-[64px] lg:pt-[80px]">
        <Header/>

        {!authLoading && user && hasProfile===true && photoCount!==null && photoCount>=1 && (
          <div className="sticky top-[64px] lg:top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
              <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-gray-500"><span>❤️</span><span className="font-medium text-gray-700 tracking-wide">{likesToday}</span></span>
                <span className="w-px h-4 bg-gray-200"/>
                <span className="flex items-center gap-1 text-gray-500"><span>🎯</span><span className="font-medium text-gray-700 tracking-wide">{matchCount}</span></span>
              </div>
              <Link href="/matches" className="relative flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span className="text-sm font-medium">Matches</span>
                {matchCount>0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center tracking-wide">{matchCount>9?"9+":matchCount}</span>
                )}
              </Link>
            </div>
          </div>
        )}

        {authLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"/>
          </div>
        )}

        {!authLoading && !user && <NotLoggedInCTA/>}
        {!authLoading && user && hasProfile===false && <NoPetProfileCTA/>}
        {!authLoading && user && hasProfile===true && photoCount!==null && photoCount<1 && <NotEnoughPhotosCTA photoCount={photoCount}/>}
        {!authLoading && user && (hasProfile===null || (hasProfile===true && photoCount===null)) && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"/>
          </div>
        )}

        {!authLoading && user && hasProfile===true && photoCount!==null && photoCount>=1 && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
            {loadingCandidates && candidates.length===0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                  <p className="text-gray-500 text-lg">Finding pets near you...</p>
                </div>
              </div>
            )}
            {showEmptyState && <EmptyState/>}
            {currentCandidate && (
              <div ref={topCardContainerRef}
                className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[420px]"
                style={{aspectRatio:"3/4.3", willChange:"transform"}}>
                {nextCandidate && (
                  <>
                    <div className="absolute -left-3 sm:-left-5 top-3 bottom-3 w-[calc(100%-1rem)] rounded-3xl bg-gray-300/40 shadow" style={{zIndex:1, willChange:"transform"}}/>
                    <div className="absolute -right-2 sm:-right-4 top-2 bottom-2 w-[calc(100%-0.5rem)] rounded-3xl bg-white/60 shadow-md overflow-hidden" style={{zIndex:2, willChange:"transform"}}>
                      {(nextCandidate.profile_photo_url||nextCandidate.avatar_url) && (
                        <Image src={(nextCandidate.profile_photo_url||nextCandidate.avatar_url)!} alt="" fill className="object-cover opacity-50" unoptimized/>
                      )}
                    </div>
                  </>
                )}
                {nextCandidate && (
                  <SwipeCard key={`card-${nextCandidate.user_id}`} candidate={nextCandidate} isTop={false} onSwipe={()=>{}} onLove={()=>{}} likesToday={0}/>
                )}
                <SwipeCard key={`card-${currentCandidate.user_id}`} candidate={currentCandidate} isTop={true} onSwipe={handleSwipe} onLove={handleLove} likesToday={likesToday}/>
              </div>
            )}
          </div>
        )}

        {matchModalPet && (
          <MatchModal myPet={myPetProfile} theirPet={matchModalPet}
            onMessage={()=>{setMatchModalPet(null);window.location.href="/matches";}}
            onKeepSwiping={()=>setMatchModalPet(null)}/>
        )}
        <Footer/>
      </div>
    </>
  );
}
