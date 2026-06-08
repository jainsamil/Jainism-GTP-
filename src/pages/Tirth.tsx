import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MapPin, Compass, ShieldAlert, 
  Navigation, Landmark, Calendar, BookOpen, Compass as MapIcon,
  Sparkles, CheckCircle, Loader2, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { TIRTHS_DATA, ALL_60_TIRTHS, TirthItem, NearbyTemple } from '../data/tirthsData';

const SIMULATED_CITIES = [
  { name: { en: "Indore (MP)", hi: "इन्दौर (म.प्र.)" }, lat: 22.7196, lng: 75.8577 },
  { name: { en: "Delhi NCR", hi: "दिल्ली-एनसीआर" }, lat: 28.7041, lng: 77.1025 },
  { name: { en: "Mumbai (MH)", hi: "मुंबई" }, lat: 19.0760, lng: 72.8777 },
  { name: { en: "Jaipur (RJ)", hi: "जयपुर (राज.)" }, lat: 26.9124, lng: 75.7873 },
  { name: { en: "Bangalore (KA)", hi: "बेंगलुरु" }, lat: 12.9716, lng: 77.5946 },
  { name: { en: "Ahmedabad (GJ)", hi: "अहमदाबाद" }, lat: 23.0225, lng: 72.5714 }
];

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
}

export default function TirthPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedTirth, setSelectedTirth] = useState<TirthItem | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Firestore dynamic sync state
  const [firestoreTirths, setFirestoreTirths] = useState<TirthItem[]>([]);

  useEffect(() => {
    // Subscribe to Firestore 'tirth' collection for live updates/additions
    const q = collection(db, 'tirth');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData: TirthItem[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        docsData.push({
          id: docSnap.id,
          name: data.name || { en: '', hi: '' },
          region: data.region || { en: '', hi: '' },
          significance: data.significance || { en: '', hi: '' },
          history: data.history || { en: '', hi: '' },
          bestVisible: data.bestVisible || { en: '', hi: '' },
          rules: data.rules || [],
          rulesHi: data.rulesHi || [],
          coordinates: data.coordinates || '',
          image: data.image || 'https://images.unsplash.com/photo-1609137144814-7f1543faf743?auto=format&fit=crop&q=80&w=800',
          lat: data.lat || 20.0,
          lng: data.lng || 75.0,
          nearby: data.nearby || [],
          whatToVisit: data.whatToVisit || { en: '', hi: '' },
          howToReach: data.howToReach || { en: '', hi: '' },
          bestSpotsToVisit: data.bestSpotsToVisit || { en: [], hi: [] }
        });
      });
      setFirestoreTirths(docsData);
    }, (error) => {
      console.error("Firestore 'tirth' subscription error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Merge static 60+ Tirths with dynamic live Firestore items
  const combinedTirths = useMemo(() => {
    const base = [...ALL_60_TIRTHS];
    const merged = [...base];
    
    firestoreTirths.forEach(ft => {
      // Find matching item by ID or name
      const matchIdx = merged.findIndex(item => item.id === ft.id || item.name.en.toLowerCase() === ft.name.en.toLowerCase());
      if (matchIdx !== -1) {
        // Replace/update
        merged[matchIdx] = { ...merged[matchIdx], ...ft };
      } else {
        // Append new custom added place
        merged.push(ft);
      }
    });
    return merged;
  }, [firestoreTirths]);

  // New interactive states
  const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [useLiveGeo, setUseLiveGeo] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<string | null>(null);

  // Dharamshala booking states
  const [bookingCheckIn, setBookingCheckIn] = useState('2026-06-15');
  const [bookingCheckOut, setBookingCheckOut] = useState('2026-06-17');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [selectedRoomType, setSelectedRoomType] = useState('standard');
  const [bookingReceipt, setBookingReceipt] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Custom city input states
  const [customCityInput, setCustomCityInput] = useState('');
  const [isLocatingCustom, setIsLocatingCustom] = useState(false);
  const [customLocateError, setCustomLocateError] = useState('');
  const [customLocationName, setCustomLocationName] = useState('');
  const [useCustomLoc, setUseCustomLoc] = useState(false);

  // Vandana Target Tracker State
  const [vandanaCounters, setVandanaCounters] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tirth_vandana_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleIncrementVandana = (tirthId: string) => {
    const updated = {
      ...vandanaCounters,
      [tirthId]: (vandanaCounters[tirthId] || 0) + 1
    };
    setVandanaCounters(updated);
    localStorage.setItem('tirth_vandana_counts', JSON.stringify(updated));
  };

  const calculateDistanceTo = (tirth: TirthItem) => {
    let baseLat = SIMULATED_CITIES[selectedCityIdx].lat;
    let baseLng = SIMULATED_CITIES[selectedCityIdx].lng;
    let sourceName = lang === 'en' ? SIMULATED_CITIES[selectedCityIdx].name.en : SIMULATED_CITIES[selectedCityIdx].name.hi;

    if (useLiveGeo && geoCoords) {
      baseLat = geoCoords.lat;
      baseLng = geoCoords.lng;
      sourceName = lang === 'en' ? "Your Live Geolocation" : "आपकी वास्तविक लोकेशन";
    } else if (useCustomLoc && geoCoords && customLocationName) {
      baseLat = geoCoords.lat;
      baseLng = geoCoords.lng;
      sourceName = customLocationName;
    }

    const dist = calculateHaversineDistance(baseLat, baseLng, tirth.lat, tirth.lng);
    setDistanceInfo(`${dist} km from ${sourceName}`);
  };

  const handleCustomCityLocate = async () => {
    if (!customCityInput.trim()) {
      setCustomLocateError(lang === 'en' ? 'Please enter a city name' : 'कृपया शहर का नाम दर्ज करें');
      return;
    }
    setIsLocatingCustom(true);
    setCustomLocateError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(customCityInput.trim())}, India`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      if (data && data.length > 0) {
        const found = data[0];
        const newCoords = { lat: parseFloat(found.lat), lng: parseFloat(found.lon) };
        const displayName = found.display_name.split(',')[0] || customCityInput;
        setGeoCoords(newCoords);
        setCustomLocationName(displayName);
        setUseCustomLoc(true);
        setUseLiveGeo(false);
        setCustomLocateError('');
        
        if (selectedTirth) {
          const dist = calculateHaversineDistance(newCoords.lat, newCoords.lng, selectedTirth.lat, selectedTirth.lng);
          setDistanceInfo(`${dist} km from ${displayName}`);
        }
      } else {
        setCustomLocateError(lang === 'en' ? 'Location not found in India. Check spelling.' : 'भारत में स्थान नहीं मिला। वर्तनी की जाँच करें।');
      }
    } catch (err) {
      console.error(err);
      setCustomLocateError(lang === 'en' ? 'Could not geocode city. Try again.' : 'स्थान खोजने में विफलता। पुनः प्रयास करें।');
    } finally {
      setIsLocatingCustom(false);
    }
  };

  const handleFetchLiveGeo = () => {
    if (!navigator.geolocation) {
      alert(lang === 'en' ? "Geolocation is not supported by your browser." : "आपका ब्राउज़र वास्तविक लोकेशन का समर्थन नहीं करता है।");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUseLiveGeo(true);
        setUseCustomLoc(false);
        if (selectedTirth) {
          const dist = calculateHaversineDistance(pos.coords.latitude, pos.coords.longitude, selectedTirth.lat, selectedTirth.lng);
          setDistanceInfo(`${dist} km from ${lang === 'en' ? 'Your Live Geolocation' : 'आपकी वास्तविक लोकेशन'}`);
        }
      },
      (err) => {
        console.warn("Geolocation API error:", err);
        alert(lang === 'en' ? "Unable to retrieve position. Please use manual selection or simulated lists." : "लोकेशन प्राप्त करने में असमर्थ। कृपया सूची अथवा मैनुअल सर्च का उपयोग करें।");
      }
    );
  };

  const filtered = combinedTirths.filter(t => 
    t.name.en.toLowerCase().includes(search.toLowerCase()) ||
    t.name.hi.toLowerCase().includes(search) ||
    t.region.en.toLowerCase().includes(search)
  );

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header with Help and Translate in One line */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            {lang === 'en' ? 'JAIN TIRTH DIRECTORY' : 'जैन तीर्थ गाइड'}
          </h1>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/11 text-gray-550 dark:text-gray-350 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={lang === 'en' ? 'Tirth Section Guide' : 'तीर्थ मार्गदर्शिका निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Inline Header Translator Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
            title="Translate Language / भाषा बदलें"
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Intro Card */}
      <div className="mb-6 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/5 backdrop-blur-md rounded-3xl p-5 border border-orange-200/50 dark:border-white/5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FF6D00]/20 rounded-2xl flex items-center justify-center text-[#FF6D00]">
          <Compass className="animate-[spin_12s_linear_infinite]" size={24} />
        </div>
        <div className="flex-1">
          <span className="text-[9px] font-black tracking-wider text-orange-500 uppercase block mb-0.5">{lang === 'en' ? 'SPIRITUAL TRAVELS' : 'परम पावन यात्रा'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {lang === 'en' 
              ? "Discover major Jain Siddha and Atishya Kshetras, containing ancient architectures, holy histories, distance calculations and yatra protocols."
              : "प्रमुख सिद्ध और अतिशय क्षेत्रों की वंदना करें, जिसमें प्राचीन शिल्प शास्त्र, वास्तविक दूरी गणक, धार्मिक इतिहास और नियम शामिल हैं।"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-[#FF8A65]" size={20} />
        <input 
          type="text" 
          placeholder={lang === 'en' ? "Search sacred places..." : "पवित्र तीर्थ खोजें..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
        />
      </div>

      {/* Main Grid Checklist of items */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(tirth => (
          <div 
            key={tirth.id}
            onClick={() => {
              setSelectedTirth(tirth);
              setDistanceInfo(null);
            }}
            className="bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-orange-300 dark:hover:border-white/20 transition-all duration-300 cursor-pointer group"
          >
            {/* Image Placeholder Frame */}
            <div className="h-40 bg-gray-200 dark:bg-[#1A1A1A] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={tirth.image} 
                alt={tirth.name.en} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="flex items-center gap-1 bg-[#FF6D00]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase mb-1.5">
                  <MapPin size={10} />
                  {lang === 'en' ? 'HOLY SITE' : 'सिद्ध क्षेत्र'}
                </div>
                <h3 className="font-display font-black text-white text-lg tracking-wide drop-shadow-md">
                  {lang === 'en' ? tirth.name.en : tirth.name.hi}
                </h3>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                  <MapPin size={14} className="text-orange-500" />
                  <span>{lang === 'en' ? tirth.region.en : tirth.region.hi}</span>
                </div>
                {vandanaCounters[tirth.id] > 0 && (
                  <span className="text-[10px] bg-[#00E676]/15 text-[#00E676] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    {lang === 'en' ? `${vandanaCounters[tirth.id]}x Visited` : `${vandanaCounters[tirth.id]} बार वंदना`}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-4 line-clamp-2">
                {lang === 'en' ? tirth.significance.en : tirth.significance.hi}
              </p>
              <div className="flex items-center justify-between text-xs font-black text-[#FF6D00] uppercase tracking-wider">
                <span>{lang === 'en' ? 'KNOW VISITOR GUIDELINES' : 'दर्शन नियमावली देखें'}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large details popup */}
      <AnimatePresence>
        {selectedTirth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end justify-center pt-8 pointer-events-auto"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white dark:bg-[#0d0d0d] w-full max-w-2xl rounded-t-[2.5rem] border-t border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] pb-32"
            >
              <div className="sticky top-0 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="text-[#FF6D00]" size={20} />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{lang === 'en' ? 'Tirth Information' : 'तीर्थ विवरण'}</span>
                </div>
                <button 
                  onClick={() => setSelectedTirth(null)}
                  className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-xs font-bold transition-all cursor-pointer"
                  id="btn-close-tirth-pop"
                >
                  {lang === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white leading-tight">
                    {lang === 'en' ? selectedTirth.name.en : selectedTirth.name.hi}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#FF6D00] font-bold mt-1">
                    <MapPin size={14} />
                    <span>{selectedTirth.region.en}</span>
                  </div>
                </div>

                {/* Banner image */}
                <div className="h-48 rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-white/5">
                  <img src={selectedTirth.image} alt={selectedTirth.name.en} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Interactive Feature 1: Living/Simulated Distance Calculator */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#FF6D00]/5 to-transparent border border-[#FF6D00]/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#FF6D00]">
                      <Compass size={18} className="animate-[pulse_1.5s_infinite]" />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {lang === 'en' ? 'Distance Calculator' : 'पावन दूरी गणक'}
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Haversine Method</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block">
                        {lang === 'en' ? 'Select Base City' : 'अपना मुख्य शहर चुनें'}
                      </label>
                      <select 
                        disabled={useLiveGeo || useCustomLoc}
                        value={selectedCityIdx}
                        onChange={(e) => {
                          setSelectedCityIdx(Number(e.target.value));
                          setDistanceInfo(null);
                        }}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6D00]"
                      >
                        {SIMULATED_CITIES.map((c, idx) => (
                          <option key={idx} value={idx}>
                            {lang === 'en' ? c.name.en : c.name.hi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <button
                        onClick={handleFetchLiveGeo}
                        className="w-full bg-white dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-[#FF6D00]/10 text-orange-600 dark:text-[#FFD54F] border border-[#FF6D00]/20 rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles size={12} /> {lang === 'en' ? 'Use Your Live Geolocation' : 'वास्तविक लाइव जीपीएस का उपयोग करें'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-gray-100 dark:border-white/5 pt-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block">
                      {lang === 'en' ? 'Or Enter Custom Indian City / Town' : 'या भारत का कोई भी शहर / गाव खोजें'}
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder={lang === 'en' ? "e.g., Kolkata, Pune, Jabalpur..." : "जैसे: कोलकाता, पुणे, जबलपुर..."}
                        value={customCityInput}
                        onChange={(e) => setCustomCityInput(e.target.value)}
                        className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6D00] text-gray-900 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCustomCityLocate();
                        }}
                      />
                      <button
                        onClick={handleCustomCityLocate}
                        disabled={isLocatingCustom}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black uppercase rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLocatingCustom ? '...' : (lang === 'en' ? 'Locate' : 'खोजें')}
                      </button>
                    </div>
                    {customLocateError && (
                      <p className="text-red-500 text-[10px] font-bold">{customLocateError}</p>
                    )}
                  </div>

                  {(useLiveGeo || useCustomLoc) && (
                    <div className="flex items-center justify-between text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                      <span>✓ {useLiveGeo ? (lang === 'en' ? 'GPS Tracking Active' : 'लाइव जीपीएस सक्रिय') : `${lang === 'en' ? 'Located' : 'खोजा गया'}: ${customLocationName}`}</span>
                      <button 
                        onClick={() => {
                          setUseLiveGeo(false);
                          setUseCustomLoc(false);
                          setDistanceInfo(null);
                        }}
                        className="font-black text-red-500 hover:text-red-600 uppercase"
                      >
                        {lang === 'en' ? 'Reset' : 'रीसेट'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => calculateDistanceTo(selectedTirth)}
                    className="w-full bg-[#121212] dark:bg-white text-white dark:text-black hover:scale-[1.01] active:scale-95 py-2.5 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    🔍 {lang === 'en' ? 'CALCULATE ACCURATE DISTANCE' : 'दूरी की गणना करें'}
                  </button>

                  {distanceInfo && (
                    <div className="animate-[fadeIn_0.5s_ease-out] bg-gradient-to-r from-orange-500 to-amber-500 text-black rounded-xl p-3.5 text-center font-black tracking-wide text-xs flex flex-col gap-0.5 shadow-md">
                      <span className="text-[9px] uppercase tracking-widest opacity-80">{lang === 'en' ? 'Calculated Distance' : 'आकलन दूरी'}</span>
                      <span className="text-lg">{distanceInfo}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Feature 2: Curated Must-Visit Nearby Temples */}
                <div className="p-5 rounded-2xl bg-[#2962FF]/5 border border-[#2962FF]/10 space-y-3">
                  <div className="flex items-center gap-2 text-[#2962FF]">
                    <Landmark size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'Recommended Nearby Shrines & Temples' : 'आसपास के प्राचीन और सिद्ध जिनालय'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedTirth.nearby.map((n, idx) => (
                      <div key={idx} className="flex justify-between items-center px-4 py-2 bg-white/60 dark:bg-white/5 border border-white/10 rounded-xl text-xs font-bold shadow-sm">
                        <span className="text-gray-800 dark:text-gray-100">{lang === 'en' ? n.name.en : n.name.hi}</span>
                        <span className="text-[10px] text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">{n.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Feature 3: Personal Vandana Log Tracker */}
                <div className="p-5 rounded-2xl bg-[#00E676]/5 border border-[#00E676]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[9px] text-[#00E676] font-black uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <CheckCircle size={12} /> {lang === 'en' ? 'Your Spiritual Travel Diary' : 'आपकी पावन यात्रा डायरी'}
                    </span>
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-snug">
                      {lang === 'en' ? 'Log your sacred pilgrim visits to boost your spiritual stats' : 'इस तीर्थ की कितनी बार वन्दना पूर्ण की है, उसका रिकॉर्ड रखें।'}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleIncrementVandana(selectedTirth.id)}
                    className="shrink-0 bg-[#00E676] hover:bg-[#00C853] text-black font-black uppercase tracking-widest text-[10px] px-4 py-2.5 rounded-xl border border-[#00E676]/30 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    + {lang === 'en' ? 'ADD VISITED LOG' : 'वंदना रिकॉर्ड जोड़ें'}
                  </button>
                </div>

                {/* Significance Section */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#121212] border border-orange-200/30 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[#FF6D00] mb-2">
                    <Compass size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Significance' : 'विशेष महत्व'}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
                    {lang === 'en' ? selectedTirth.significance.en : selectedTirth.significance.hi}
                  </p>
                </div>

                {/* Legend History */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-[#2962FF]">
                    <BookOpen size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Divine History & Legend' : 'पावन इतिहास एवं कथा वर्णन'}</span>
                  </div>
                  <p className="text-xs text-gray-650 dark:text-gray-300 font-semibold leading-relaxed">
                    {lang === 'en' ? selectedTirth.history.en : selectedTirth.history.hi}
                  </p>
                </div>

                {/* What to Visit Guide */}
                <div className="p-4 rounded-2xl bg-orange-550/5 dark:bg-emerald-500/5 border border-emerald-500/10 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Landmark size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'Major attractions / what to visit' : 'प्रमुख दर्शनीय स्थल / क्या-क्या देखें'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-250 font-bold leading-relaxed">
                    {lang === 'en' ? selectedTirth.whatToVisit.en : selectedTirth.whatToVisit.hi}
                  </p>
                </div>

                {/* CURATED TOP 20 VISITING SPOTS (REQUESTED BY USER) */}
                <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-[#FF6D00]/10 via-[#FFD54F]/5 to-transparent border border-orange-500/20 space-y-4 text-left">
                  <div className="flex items-center gap-2.5 text-orange-600 dark:text-[#FFD54F]">
                    <Sparkles size={20} className="animate-pulse" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-left">
                        {lang === 'en' ? 'Top 20 Best Spots to Visit' : 'शीर्ष २० सर्वोत्तम दर्शनीय स्थल'}
                      </h4>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold text-left">
                        {lang === 'en' ? 'Curated Pilgrimage Checklist' : 'अनुशंसित यात्रा सूची'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                    {(selectedTirth.bestSpotsToVisit?.[lang] || selectedTirth.bestSpotsToVisit?.en || []).map((spot: string, i: number) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 dark:bg-zinc-900/40 border border-gray-100 dark:border-white/5 shadow-sm hover:border-orange-500/30 transition-all group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black shrink-0 text-[10px]">
                          {i + 1}
                        </div>
                        <span className="text-gray-800 dark:text-zinc-200 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {spot.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Reach Guide */}
                <div className="p-4 rounded-2xl bg-amber-550/5 dark:bg-amber-500/5 border border-amber-500/10 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Navigation size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {lang === 'en' ? 'How to Reach / Travel Guide' : 'पहुंचने का मार्ग / यात्रा निर्देश'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-250 font-bold leading-relaxed flex flex-col gap-1">
                    {lang === 'en' ? selectedTirth.howToReach.en : selectedTirth.howToReach.hi}
                  </p>
                </div>

                {/* Optimal Season */}
                <div className="flex items-center gap-3 p-3.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-xs">
                  <Calendar size={18} className="text-yellow-500 shrink-0" />
                  <div>
                    <span className="font-extrabold block text-[8px] tracking-wider text-yellow-600 uppercase mb-0.5">{lang === 'en' ? 'Best Time of Year to Visit' : 'यात्रा का सर्वोत्तम मौसम'}</span>
                    <span className="font-black text-gray-700 dark:text-gray-200">{lang === 'en' ? selectedTirth.bestVisible.en : selectedTirth.bestVisible.hi}</span>
                  </div>
                </div>

                {/* INTERACTIVE DHARAMSHALA BOOKING DESK */}
                <div className="p-6 rounded-[2rem] bg-amber-500/5 dark:bg-[#1A1A1A]/50 border border-amber-500/20 space-y-5">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-[#FFD54F]">
                    <Sparkles size={20} className="animate-pulse" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-left">
                        {lang === 'en' ? 'Dharamshala Room Finder & Reservation' : 'धर्मशाला कमरा आरक्षित करें'}
                      </h4>
                      <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold text-left">
                        {lang === 'en' ? 'Unified Non-Profit Trust Bookings' : 'अप्रतिबंधित जैन ट्रस्ट धर्मशाला बुकिंग'}
                      </span>
                    </div>
                  </div>

                  {bookingReceipt ? (
                    <div className="bg-emerald-500/10 border-2 border-dashed border-emerald-500 text-emerald-800 dark:text-emerald-400 p-5 rounded-2xl relative space-y-4 animate-[fadeIn_0.4s_ease-out]">
                      {/* Ticket Cut holes left & right */}
                      <div className="absolute top-[48%] -left-3.5 w-6 h-6 bg-white dark:bg-[#121212] rounded-full border border-emerald-500/20" />
                      <div className="absolute top-[48%] -right-3.5 w-6 h-6 bg-white dark:bg-[#121212] rounded-full border border-emerald-500/20" />
                      
                      <div className="text-center pb-3 border-b border-dashed border-emerald-500/40">
                        <span className="text-[10px] bg-emerald-500 text-white font-black px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-1">
                          {lang === 'en' ? 'RESERVATION CONFIRMED' : 'आरक्षण सुरक्षित'}
                        </span>
                        <h5 className="font-extrabold text-[11px] text-gray-500 dark:text-gray-400">PNR: {bookingReceipt.pnr}</h5>
                      </div>

                      <div className="space-y-3.5 text-xs font-bold text-gray-800 dark:text-zinc-200">
                        <div className="flex justify-between">
                          <span>{lang === 'en' ? 'Pilgrim Center' : 'तीर्थ क्षेत्र'}</span>
                          <span className="text-right text-black dark:text-white font-extrabold">{selectedTirth.name[lang]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'en' ? 'Selected Room' : 'कमरा श्रेणी'}</span>
                          <span className="text-right text-black dark:text-white font-extrabold">{bookingReceipt.roomName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'en' ? 'Check-In' : 'प्रवेश तिथि'}</span>
                          <span>{bookingReceipt.checkIn} (12:00 PM)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'en' ? 'Check-Out' : 'निकास तिथि'}</span>
                          <span>{bookingReceipt.checkOut} (11:00 AM)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{lang === 'en' ? 'Total Guests' : 'कुल तीर्थयात्री'}</span>
                          <span>{bookingReceipt.guests} Bed slots</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black">
                          <span>{lang === 'en' ? 'Dharamshala Contribution (Total)' : 'धर्मशाला दान सहयोग (कुल)'}</span>
                          <span>₹{bookingReceipt.totalBill}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white/50 dark:bg-black/20 rounded-xl text-[10px] text-gray-500 dark:text-gray-400 leading-snug space-y-1">
                        <p className="font-black text-amber-600 dark:text-amber-500">⚠️ IMPORTANT INSTRUCTIONS (नियम):</p>
                        <p>1. {lang === 'en' ? 'Dinner/Ahar is served between 11:30 AM to 1:00 PM. No dining after sunset.' : 'भोजनशाला समयावधि: सुबह ११:०० से दोपहर १:०० बजे तक। सूर्यास्त के बाद भोजन सर्वथा निषेध है।'}</p>
                        <p>2. {lang === 'en' ? 'Carry valid Government ID cards matching reservation names.' : 'चेक-इन के समय सभी तीर्थयात्रियों का सरकारी पहचान पत्र अनिवार्य है।'}</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setBookingReceipt(null);
                            alert(lang === 'en' ? 'Booking cancelled successfully.' : 'आपका धर्मशाला आरक्षण सफलतापूर्वक निरस्त कर दिया गया है। कोई शुल्क नहीं कटेगा।');
                          }}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer text-center"
                        >
                          {lang === 'en' ? 'Cancel Booking' : 'आरक्षण रद्द करें'}
                        </button>
                        <button
                          onClick={() => {
                            alert(lang === 'en' ? 'Receipt PDF downloaded to device downloads.' : 'पक्की रसीद (PDF) आपके फ़ोन या पीसी में सेव हो गई है।');
                          }}
                          className="flex-1 bg-emerald-500 text-black py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer text-center"
                        >
                          📥 {lang === 'en' ? 'Download PDF' : 'रसीद डाउनलोड'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Inputs Date Selectors */}
                      <div className="grid grid-cols-2 gap-3.5 text-xs font-bold">
                        <div className="text-left">
                          <label className="text-gray-500 block mb-1.5 text-left">{lang === 'en' ? 'Check-In' : 'चेक-इन तिथि'}</label>
                          <input 
                            type="date" 
                            value={bookingCheckIn}
                            onChange={(e) => setBookingCheckIn(e.target.value)}
                            className="bg-white dark:bg-[#151515] p-2.5 rounded-xl border border-gray-200 dark:border-white/15 text-gray-800 dark:text-white text-xs w-full focus:outline-none"
                          />
                        </div>
                        <div className="text-left">
                          <label className="text-gray-500 block mb-1.5 text-left">{lang === 'en' ? 'Check-Out' : 'चेक-आउट तिथि'}</label>
                          <input 
                            type="date" 
                            value={bookingCheckOut}
                            onChange={(e) => setBookingCheckOut(e.target.value)}
                            className="bg-white dark:bg-[#151515] p-2.5 rounded-xl border border-gray-200 dark:border-white/15 text-gray-800 dark:text-white text-xs w-full focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Guest Count Slider and pricing options */}
                      <div className="space-y-2 text-xs font-bold text-left">
                        <div className="flex justify-between items-center text-left">
                          <span className="text-gray-500">{lang === 'en' ? 'Number of Pilgrims' : 'तीर्थयात्रियों की संख्या'}</span>
                          <span className="text-[#FF6D00]">{bookingGuests} {lang === 'en' ? 'Guests' : 'यात्री'}</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="8" 
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(Number(e.target.value))}
                          className="w-full accent-[#FF6D00]"
                        />
                      </div>

                      {/* Room options grid layout */}
                      <div className="space-y-2 text-left">
                        <span className="text-xs font-bold text-gray-500 block mb-2 text-left">{lang === 'en' ? 'Select Room Type' : 'कमरा श्रेणी चयन करें'}</span>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: 'satvik_kutir', nameShow: { en: 'Standard Satvik Kutir (Non AC)', hi: 'सादा सात्विक कुटीर (Non AC)' }, descShow: { en: '2 Beds, clean bathroom, cooler, organic cotton sheets', hi: '२ बेड, शुद्ध जल व्यवस्था, सादा गद्देदार पलंग।' }, price: 250 },
                            { id: 'standard', nameShow: { en: 'Standard Air-Ventilated AC Room', hi: 'स्टैण्डर्ड वातानुकूलित (AC) रूम' }, descShow: { en: '2 Beds, hot water tap, safety locker, clean linen', hi: '२ बेड, २४ घंटे गर्म पानी नल, सुरक्षा लॉकर।' }, price: 400 },
                            { id: 'deluxe_ac', nameShow: { en: 'VIP Trust Parivar AC Suite', hi: 'वीआईपी गृहस्थ परिवार AC सूइट' }, descShow: { en: '4 Beds, spacious lounge, modern bath, balcony access', hi: '४ बेड, हॉल अटैच, सोफा, निजी बालकोनी।' }, price: 700 }
                          ].map(room => {
                            const isChosen = selectedRoomType === room.id;
                            return (
                              <button
                                key={room.id}
                                onClick={() => setSelectedRoomType(room.id)}
                                className={cn(
                                  "w-full text-left p-3.5 rounded-2xl border text-xs flex justify-between items-start transition-all cursor-pointer",
                                  isChosen 
                                    ? "bg-white dark:bg-[#222] border-[#FF6D00] shadow-sm text-gray-950 dark:text-white" 
                                    : "bg-white/60 dark:bg-white/[0.02] border-transparent hover:bg-white dark:hover:bg-white/5"
                                )}
                              >
                                <div className="text-left">
                                  <span className="font-extrabold block text-gray-800 dark:text-gray-200 text-left">
                                    {room.nameShow[lang]}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5 text-left">
                                    {room.descShow[lang]}
                                  </span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-black text-[#FF6D00] block text-sm">₹{room.price}</span>
                                  <span className="text-[9px] text-gray-400 font-medium font-bold block">{lang === 'en' ? 'per night' : 'प्रति रात्रि'}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Final Reservation confirmation submission */}
                      <button
                        onClick={() => {
                          setBookingLoading(true);
                          setTimeout(() => {
                            setBookingLoading(false);
                            const pickedRoom = [
                              { id: 'satvik_kutir', nameShow: { en: 'Standard Satvik Kutir (Non AC)', hi: 'सादा सात्विक कुटीर (Non AC)' }, price: 250 },
                              { id: 'standard', nameShow: { en: 'Standard Air-Ventilated AC Room', hi: 'स्टैण्डर्ड वातानुकूलित (AC) रूम' }, price: 400 },
                              { id: 'deluxe_ac', nameShow: { en: 'VIP Trust Parivar AC Suite', hi: 'वीआईपी गृहस्थ परिवार AC सूइट' }, price: 700 }
                            ].find(r => r.id === selectedRoomType);
                            
                            const oneDay = 24 * 60 * 60 * 1000;
                            const firstDate = new Date(bookingCheckIn);
                            const secondDate = new Date(bookingCheckOut);
                            const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)) || 1;
                            const billAmount = (pickedRoom?.price || 400) * diffDays;
                            
                            setBookingReceipt({
                              pnr: "JBT-" + Math.floor(100000 + Math.random() * 900000),
                              roomName: pickedRoom?.nameShow[lang],
                              checkIn: bookingCheckIn,
                              checkOut: bookingCheckOut,
                              guests: bookingGuests,
                              totalBill: billAmount
                            });
                          }, 1200);
                        }}
                        disabled={bookingLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-md cursor-pointer hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2 className="animate-spin text-black" size={16} />
                            <span>{lang === 'en' ? 'ALLOCATING ROOM SLOT...' : 'धर्मशाला आवंटन किया जा रहा है...'}</span>
                          </>
                        ) : (
                          <span>🏢 {lang === 'en' ? 'REQUEST CONFIRMED BOOKING' : 'धर्मशाला कमरा आवंटन अनुरोध भेजें'}</span>
                        )}
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">
                    {lang === 'en' 
                      ? '✓ No prepayment required. Room contribution/donation will be collected by Temple Cashier.' 
                      : '✓ किसी पूर्व भुगतान की आवश्यकता नहीं है। रसीद दान सहयोग राशि सीधे धर्मशाला ट्रस्ट काउंटर पर जमा होगी।'}
                  </p>
                </div>

                {/* Protocols and Discipline */}
                <div className="p-5 rounded-3xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">{lang === 'en' ? 'Mandatory Discipline (नियमावली)' : 'अनिवार्य दर्शन आचार संहिता'}</span>
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-gray-600 dark:text-gray-300 list-disc list-inside">
                    {lang === 'en' 
                      ? selectedTirth.rules.map((r, i) => <li key={i}>{r}</li>)
                      : selectedTirth.rulesHi.map((r, i) => <li key={i}>{r}</li>)
                    }
                  </ul>
                </div>

                {/* Route maps navigation button */}
                <a 
                  href={selectedTirth.coordinates}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FF6D00] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold shadow-lg shadow-orange-500/20 active:scale-98 transition-transform cursor-pointer"
                >
                  <Navigation size={18} className="fill-white" />
                  <span>{lang === 'en' ? 'GET GPS NAVIGATION ROUTE' : 'गूगल मैप नेविगेशन मार्ग खोलें'}</span>
                </a>

                {/* Viewport safety bottom spacer */}
                <div className="h-10 w-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {lang === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {lang === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch requested in help modal */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10">
              <span className="text-[10px] font-black uppercase text-gray-400">
                {lang === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {lang === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-355 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to Jain Tirth Directory!' : 'जैन तीर्थ निर्देशिका एवं मार्गदर्शक पटल में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'Explore, calculate real physical distance, and plan stays at sacred Atishya or Siddha Jain holy land coordinates seamlessly:' 
                  : 'प्राचीन चमत्कारी अतिशय क्षेत्रों तथा सिद्ध क्षेत्रों का इतिहास, दूरी मानचित्र एवं उपलब्ध धर्मशालाओं की संपूर्ण जानकारी प्राप्त करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Explore Siddha & Atishya Kshetras:' : 'सिद्ध एवं अतिशय क्षेत्रों का संपूर्ण परिचय:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Learn deep history, historical importance, and holy legends behind kshetras like Shikharji, Kundalpur, Girnar, and Palitana.' 
                    : 'शिखरजी, कुण्डलपुर, गिरनार जी व सोनागिरि की निर्माण गाथा और वैज्ञानिक रहस्यों को जानें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Inter-City Distance Grid:' : 'दूरी मापन एवं जीपीएस नेвиगेशन:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Select your base city (simulated or via browser GPS location) to instantly estimate direct distances to all listed holy lands.'
                    : 'अपने वर्तमान क्षेत्र या जीपीएस पोजीशन से प्रत्येक तीर्थ की वास्तविक दूरी तुरंत पता करें और सीधे गूगल मैप मार्ग खोलें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Local Room Reservation Simulator:' : 'स्थानीय कमरा आरक्षण पर्ची सिमुलेटर:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Simulate dynamic guestroom options, selecting rooms, and outputting local vouchers for immediate pilgrimage planning.'
                    : 'तीर्थों पर कमरों की बुकिंग संबंधी योजना तैयार करने हेतु सिमुलेटर पर्ची जनरेट करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Vandana Target Counter:' : 'पावन वंदना संकल्प काउंटर:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Track your pilgrimage counters (how many times you climbed or visited the holy hills) stored persistently in your local browser storage.'
                    : 'आपने प्रत्येक पावन पर्वत की यात्रा कितनी बार संपन्न की है, उसका संकल्प काउंटर चालू कर अपनी रिकॉर्ड सूची सहेजें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {lang === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="tirth" />
    </div>
  );
}
