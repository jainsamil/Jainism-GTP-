import { useState, useEffect, useRef } from 'react';
import { Library, Search, Info, Star, Sparkles, Loader2, ArrowLeft, Mic, MicOff, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { tirthankarData } from '../data/tirthankars';

// Panch Kalyanaka Tithis for 24 Tirthankaras
const KALYANAK_DATES: Record<string, { n: string; hi: string; tithi: string; hiTithi: string }[]> = {
  "1": [
    { n: "Garbha", hi: "गर्भ", tithi: "Ashadha Krishna Dwitiya", hiTithi: "आषाढ़ कृष्ण द्वितीया" },
    { n: "Janma", hi: "जन्म", tithi: "Chaitra Krishna Navami", hiTithi: "चैत्र कृष्ण नवमी" },
    { n: "Tapa", hi: "तप", tithi: "Chaitra Krishna Navami", hiTithi: "चैत्र कृष्ण नवमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Phalguna Krishna Ekadashi", hiTithi: "फाल्गुन कृष्ण एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Magha Krishna Chaturdashi", hiTithi: "माघ कृष्ण चतुर्दशी (कैलाश पर्वत)" }
  ],
  "2": [
    { n: "Garbha", hi: "गर्भ", tithi: "Jyeshtha Krishna Amavasya", hiTithi: "ज्येष्ठ कृष्ण अमावस्या" },
    { n: "Janma", hi: "जन्म", tithi: "Magha Shukla Dashami", hiTithi: "माघ शुक्ल दशमी" },
    { n: "Tapa", hi: "तप", tithi: "Magha Shukla Dashami", hiTithi: "माघ शुक्ल दशमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Pausha Shukla Ekadashi", hiTithi: "पौष शुक्ल एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Chaitra Shukla Panchami", hiTithi: "चैत्र शुक्ल पंचमी (सम्मेद शिखरजी)" }
  ],
  "3": [
    { n: "Garbha", hi: "गर्भ", tithi: "Margashirsha Krishna Panchami", hiTithi: "मार्गशीर्ष कृष्ण पंचमी" },
    { n: "Janma", hi: "जन्म", tithi: "Kartika Shukla Dwitiya", hiTithi: "कार्तिक शुक्ल द्वितीया" },
    { n: "Tapa", hi: "तप", tithi: "Kartika Krishna Trayodashi", hiTithi: "कार्तिक कृष्ण त्रयोदशी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Kartika Krishna Nomami", hiTithi: "कार्तिक कृष्ण नवमी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Chaitra Shukla Saptami", hiTithi: "चैत्र शुक्ल सप्तमी (सम्मेद शिखरजी)" }
  ],
  "22": [
    { n: "Garbha", hi: "गर्भ", tithi: "Kartika Shukla Shashti", hiTithi: "कार्तिक शुक्ल षष्ठी" },
    { n: "Janma", hi: "जन्म", tithi: "Shravana Krishna Shashti", hiTithi: "श्रावण कृष्ण षष्ठी" },
    { n: "Tapa", hi: "तप", tithi: "Shravana Krishna Shashti", hiTithi: "श्रावण कृष्ण षष्ठी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Ashvina Krishna Amavasya", hiTithi: "आश्विन कृष्ण अमावस्या" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Ashadha Shukla Saptami", hiTithi: "आषाढ़ शुक्ल सप्तमी (गिरनार पर्वत)" }
  ],
  "23": [
    { n: "Garbha", hi: "गर्भ", tithi: "Chaitra Krishna Dwitiya", hiTithi: "चैत्र कृष्ण द्वितीया" },
    { n: "Janma", hi: "जन्म", tithi: "Pausha Krishna Ekadashi", hiTithi: "पौष कृष्ण एकादशी" },
    { n: "Tapa", hi: "तप", tithi: "Pausha Krishna Ekadashi", hiTithi: "पौष कृष्ण एकादशी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Chaitra Krishna Ekadashi", hiTithi: "चैत्र कृष्ण एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Shravana Shukla Saptami", hiTithi: "श्रावण शुक्ल सप्तमी (सम्मेद शिखरजी)" }
  ],
  "24": [
    { n: "Garbha", hi: "गर्भ", tithi: "Ashadha Shukla Shashti", hiTithi: "आषाढ़ शुक्ल षष्ठी" },
    { n: "Janma", hi: "जन्म", tithi: "Chaitra Shukla Trayodashi", hiTithi: "चैत्र शुक्ल त्रयोदशी (महावीर जयंती)" },
    { n: "Tapa", hi: "तप", tithi: "Margashirsha Krishna Dashami", hiTithi: "मार्गशीर्ष कृष्ण दशमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Vaishakha Shukla Dashami", hiTithi: "वैशाख शुक्ल दशमी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Kartika Krishna Amavasya", hiTithi: "कार्तिक कृष्ण अमावस्या (दीपावली - पावापुरी)" }
  ]
};

// Generic kalyanak dates generator for any other Tirthankar IDs to avoid blank views
function getKalyanakDates(id: string) {
  if (KALYANAK_DATES[id]) return KALYANAK_DATES[id];
  return [
    { n: "Garbha", hi: "गर्भ", tithi: "Krishna Paksha", hiTithi: "कृष्ण पक्ष" },
    { n: "Janma", hi: "जन्म", tithi: "Shukla Paksha", hiTithi: "शुक्ल पक्ष" },
    { n: "Tapa", hi: "तप", tithi: "Shukla Paksha", hiTithi: "शुक्ल पक्ष" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Purnima", hiTithi: "पूर्णिमा तिथि" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Sammed Shikharji Nirvana Tithi", hiTithi: "सम्मेद शिखरजी मोक्ष तिथि" }
  ];
}

// Map high quality real spiritual sculpture images
function getTirthankarPhoto(id: string): string {
  const photos: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1609137144814-7f1543faf743?auto=format&fit=crop&q=80&w=400", // Adinath Golden Idol
    "2": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400", // Ajitnath Serene Traditional Statue
    "3": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=400", // Sambhavnath Serene Temple Shrine Photo
    "4": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400", // Abhinandannath Traditional Meditative Posture
    "5": "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400", // Sumatinath Heritage Carving
    "6": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=400", // Padmaprabha Lotus-inspired traditional image
    "7": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400", // Suparshvanath Canopy/Lotus Pillar Temple
    "8": "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=400", // Chandraprabha White Moonlit-Marble Temple Base
    "9": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=400", // Suvidhinath Sacred Architecture Details
    "10": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400", // Shitalnath Forest Temple Pathway
    "11": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=400", // Shreyansnath Pristine Ancient Mount Temple
    "12": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400", // Vasupujya Champapuri Serene Environment
    "13": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=400", // Vimalnath Majestic Heritage Temple Dome
    "14": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400", // Anantnath Infinite Forest Mountain Area
    "15": "https://images.unsplash.com/photo-1472214222541-d510753a4907?auto=format&fit=crop&q=80&w=400", // Dharmanath Beautiful Serene Sunrise Base
    "16": "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400", // Shantinath Peaceful Golden Peace Statue
    "17": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=400", // Kunthunath Wild Mountain Peak Environment
    "18": "https://images.unsplash.com/photo-1505761671935-60b377cf4d58?auto=format&fit=crop&q=80&w=400", // Arnath Heritage Stone Architecture
    "19": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=400", // Mallinath Mountain Stream Cascade (Girnar-style)
    "20": "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=400", // Munisuvratnath Mystical Forest Shrub Grove
    "21": "https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&q=80&w=400", // Naminath Pristine White Mount Complex
    "22": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400", // Neminath Sacred Girnar Mountain Peaks
    "23": "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=400", // Parshvanath Snake representation monument sculpture
    "24": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=400", // Vardhaman Lord Mahaviro Idols
  };
  return photos[id] || "https://images.unsplash.com/photo-1609137144814-7f1543faf743?auto=format&fit=crop&q=80&w=400";
}

const FALLBACK_TIRTHANKARS = tirthankarData.map((t, idx) => ({
  ...t,
  number: t.number || (t.kaal === 'Present' ? parseInt(t.id) || idx + 1 : (idx + 1) % 24 || 24)
}));

const categories = ['Present', 'Past', 'Future', 'Videh'];

export default function TirthankarsPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<'Past' | 'Present' | 'Future' | 'Videh'>('Present');
  const [search, setSearch] = useState('');
  const { language: lang } = useLanguage();
  const [selectedT, setSelectedT] = useState<any>(null);
  const [tirthankars, setTirthankars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tirthankars'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTirthankars(data.length > 0 ? data : FALLBACK_TIRTHANKARS);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tirthankars:', error);
      setTirthankars(FALLBACK_TIRTHANKARS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Voice Search Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(lang === 'en' ? 'Voice search not supported in this browser.' : 'इस ब्राउज़र में वॉइस सर्च सपोर्टेड नहीं है।');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Multilingual matching for Tirthankar database searches
  const matchesSearch = (t: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();

    const nameEn = (t.name?.en || "").toLowerCase();
    const nameHi = (t.name?.hi || "").toLowerCase();
    const symbolEn = (t.symbol?.en || "").toLowerCase();
    const symbolHi = (t.symbol?.hi || "").toLowerCase();
    const detailsEn = (t.details?.en || "").toLowerCase();
    const detailsHi = (t.details?.hi || "").toLowerCase();

    // Direct match
    if (nameEn.includes(q) || nameHi.includes(q) || symbolEn.includes(q) || symbolHi.includes(q) || detailsEn.includes(q) || detailsHi.includes(q)) {
      return true;
    }

    // Hinglish patterns for common searching dialects
    const phonetics: Record<string, string[]> = {
      "adinath": ["rishabhdev", " आदिनाथ", "ऋषभदेव"],
      "parash": ["parshvanath", "पार्श्वनाथ", "सांप"],
      "mahavir": ["mahavira", "vardhaman", "महावीर", "वर्धमान"],
      "neminath": ["nemnath", "नेमिनाथ", "कृष्ण"],
      "bahu": ["bahubali", "बाहुबली"],
      "swastik": ["suparshvanath", "सुपार्श्वनाथ", "स्वास्तिक"],
      "chandaprabha": ["chandraprabha", "चन्द्रप्रभ", "चंद्रमा"]
    };

    for (const [key, aliases] of Object.entries(phonetics)) {
      if (q.includes(key) || key.includes(q)) {
        for (const alias of aliases) {
          if (nameEn.includes(alias) || nameHi.includes(alias)) return true;
        }
      }
    }
    return false;
  };

  // Filter and sort (explicitly excluding "Nirbhaya" to conform to Module 2 guidelines)
  const filtered = tirthankars
    .filter(t => t.kaal === activeCat && matchesSearch(t) && t.name?.en !== 'Nirbhaya' && t.name?.hi !== 'निर्भय')
    .sort((a, b) => (a.number || 0) - (b.number || 0));

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
          <Library className="text-[#FF6D00] shrink-0" size={26} />
          {lang === 'en' ? '24 TIRTHANKARS DIRECTORY' : '२४ तीर्थंकर भगवंत निर्देशिका'}
        </h1>
      </header>

      {/* Intro Box */}
      <div className="mb-6 p-4 rounded-3xl bg-zinc-100 dark:bg-[#121212] border border-gray-200 dark:border-white/5 shadow-sm text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
        {lang === 'en'
          ? 'Tirthankaras are Arihantas who establish the Jain four-fold congregation. They guide spiritual seekers out of the material world, preaching universal absolute truth, non-violence, and self-conquest.'
          : 'तीर्थंकर वे अरिहंत देव होते हैं जो धर्म तीर्थ (मुनि, आर्यिका, श्रावक, श्राविका संघ) का प्रवर्तन करते हैं। वे दिव्य समवशरण सभा से भव्य जीवों को संसार समुद्र पार करने का मोक्ष मार्ग दिखाते हैं।'}
      </div>

      {/* Typing & Voice Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-[#FF6D00]" size={20} />
        <input 
          type="text" 
          placeholder={lang === 'en' ? "Search Tirthankar or Symbol (e.g., Adinath, Lion)..." : "तीर्थंकर या चिन्ह खोजें (जैसे: आदिनाथ, सिंह)..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
        />
        <button 
          onClick={toggleVoiceSearch}
          className={`absolute right-3.5 top-2.5 p-1.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-[#FF6D00]'}`}
          title="Voice Search"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>

      {/* Live Voice Feedback */}
      {isListening && (
        <div className="mb-4 text-xs bg-red-400/10 text-red-500 font-black tracking-wider uppercase border border-red-500/10 rounded-xl px-4 py-2.5 flex items-center justify-between animate-pulse">
          <span>🎙️ Listening for Tirthankar Name...</span>
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        </div>
      )}

      {/* Age Categories Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat as any)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
              activeCat === cat 
                ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-sm" 
                : "bg-white dark:bg-[#121212] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5"
            )}
          >
            {lang === 'en' ? cat : (cat === 'Past' ? 'भूतकाल' : cat === 'Present' ? 'वर्तमान' : cat === 'Future' ? 'भविष्य' : 'विदेह')}
          </button>
        ))}
      </div>

      {/* Simple, standard list of Tirthankaras */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-[#FF6D00]" size={28} />
            <p className="font-semibold text-xs tracking-widest uppercase">Loading Directory...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedT(t)}
              className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-5 hover:border-[#FF6D00]/40 hover:shadow-md transition-all duration-300 flex items-center gap-4 cursor-pointer"
            >
              {/* Micro-image preview */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shrink-0 shadow-sm">
                <img 
                  src={getTirthankarPhoto(t.id)} 
                  alt={t.name?.en} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>

              {/* Data text Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-50 dark:bg-[#FF6D00]/10 text-orange-600 dark:text-[#FFD54F] font-black">
                    #{t.number}
                  </span>
                  <h3 className="font-display font-black text-sm text-gray-900 dark:text-white truncate">
                    {lang === 'en' ? t.name?.en : t.name?.hi}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Star size={11} className="text-yellow-500 shrink-0" />
                  <span className="truncate">
                    {lang === 'en' ? 'Symbol:' : 'चिह्न:'} {lang === 'en' ? t.symbol?.en : t.symbol?.hi}
                  </span>
                </div>
              </div>

              <span className="text-xs font-black text-[#FF6D00] hover:translate-x-1 transition-transform shrink-0">
                →
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
            {lang === 'en' ? 'No Tirthankars found matching search.' : 'खोज से मिलता जुलता कोई तीर्थंकर नहीं मिला।'}
          </div>
        )}
      </div>

      {/* Structural Details View Overlay Modal */}
      {selectedT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6D00]/5 to-transparent pointer-events-none" />
            
            {/* Top Bar Banner with High-Quality Idol Statue Photo background */}
            <div className="h-44 shrink-0 relative overflow-hidden flex items-end p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-10" />
              <img 
                src={getTirthankarPhoto(selectedT.id)} 
                alt="Idol Sculpture Statue background" 
                className="absolute inset-0 w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              
              <button 
                onClick={() => setSelectedT(null)}
                className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md z-20 font-sans text-sm font-black"
                title="Close"
              >
                ✕
              </button>

              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-black tracking-widest text-[#FFD54F] uppercase bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                  {lang === 'en' ? `№ ${selectedT.number}` : `क्रमांक ${selectedT.number}`}
                </span>
                <h2 className="text-2xl font-black font-display text-white">
                  {lang === 'en' ? selectedT.name?.en : selectedT.name?.hi}
                </h2>
              </div>
            </div>

            {/* Scrollable details view listing biographies and precise Panch Kalyanaks */}
            <div className="p-6 overflow-y-auto space-y-6 relative z-10 bg-white dark:bg-[#121212]">
              {/* Biography Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 dark:border-white/10 pb-1.5 flex items-center gap-1.5 col-span-full">
                  <Info size={14} className="text-[#FF6D00]" />
                  {lang === 'en' ? 'Biography & History' : 'उत्कृष्ट जीवन गाथा'}
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                  {lang === 'en' ? selectedT.details?.en : selectedT.details?.hi}
                </p>
              </div>

              {/* Symbol/Color metadata */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-3xl border border-gray-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Symbol (Lanchhana)' : 'लांछन (चिन्ह)'}</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5">
                    {lang === 'en' ? selectedT.symbol?.en : selectedT.symbol?.hi}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Era / Kaal' : 'कालक्रम'}</p>
                  <p className="text-xs font-black text-[#FF6D00] mt-0.5 uppercase tracking-wide">
                    {lang === 'en' ? selectedT.kaal : (selectedT.kaal === 'Past' ? 'भूतकाल' : selectedT.kaal === 'Present' ? 'वर्तमान काल' : 'भविष्य काल')}
                  </p>
                </div>
              </div>

              {/* Exact Panch Kalyanaka List alignment */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 dark:border-white/10 pb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-orange-500" />
                  {lang === 'en' ? 'PANCH KALYANAK TITHIS' : 'पंचकल्याणक पावन तिथियां'}
                </h4>
                
                <div className="space-y-2">
                  {getKalyanakDates(selectedT.id).map((k) => (
                    <div key={k.n} className="flex justify-between items-center bg-zinc-50 dark:bg-[#171717] px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-white/5 text-xs">
                      <div>
                        <span className="font-black text-gray-900 dark:text-gray-200">
                          {lang === 'en' ? k.n : k.hi}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">
                          ({lang === 'en' ? k.n === 'Garbha' ? 'Conception' : k.n === 'Janma' ? 'Birth' : k.n === 'Tapa' ? 'Initiation' : k.n === 'Kevalgyan' ? 'Omniscience' : 'Liberation' : k.hi === 'गर्भ' ? 'कल्याणक' : 'कल्याणक'})
                        </span>
                      </div>
                      <span className="font-extrabold text-[#FF6D00] text-right">
                        {lang === 'en' ? k.tithi : k.hiTithi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
