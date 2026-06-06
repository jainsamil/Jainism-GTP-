import { useState, useEffect, useRef } from 'react';
import { Library, Search, Info, Star, Sparkles, Loader2, ArrowLeft, Mic, MicOff, Calendar, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { tirthankarData } from '../data/tirthankars';
import SectionAiAgent from '../components/SectionAiAgent';

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

// Map high quality real spiritual sculpture images of authentic Tirthankar Idols
function getTirthankarPhoto(id: string): string {
  const photos: Record<string, string> = {
    "1": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg/800px-Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg", // Lord Adinath Colossal Rock-Cut (Gwalior Fort)
    "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gwalior_fort_Jain_statue_01.jpg/640px-Gwalior_fort_Jain_statue_01.jpg", // Lord Ajitnath Rock-cut Statue
    "3": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Jain_Sculpture_Gwalior_Fort_Archeological_museum.jpg", // Lord Sambhavnath Ancient Idol
    "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Abhinandananatha_-_sitting_Jaina_image_at_museum.jpg/640px-Abhinandananatha_-_sitting_Jaina_image_at_museum.jpg", // Lord Abhinandannath Traditional Idol
    "5": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Akkana_Basadi_Jain_image.jpg", // Lord Sumatinath Stone Sculpture
    "6": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Red_sandstone_image_of_padmaprabha_jain_tirthankar.jpg", // Lord Padmaprabha Seated Idol
    "7": "https://upload.wikimedia.org/wikipedia/commons/3/36/Suparshvanatha_sculpture_from_Gwalior_Fort.jpg", // Lord Suparshvanath with snake hoods (Gwalior)
    "8": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Chandraprabha_sitting_Jaina_sculpture_Gwalior.jpg", // Lord Chandraprabha Statue at Gwalior Fort
    "9": "https://upload.wikimedia.org/wikipedia/commons/d/da/Pushpadanta_sitting_marble_image_Gwalior.jpg", // Lord Pushpadanta White Marble Idol
    "10": "https://upload.wikimedia.org/wikipedia/commons/1/11/Jain_cave_temple_sculpture_Ellora.jpg", // Lord Shitalnath Meditative Cave Seated posture (Ellora)
    "11": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Shreyansanatha_Jain_idol_Gwalior.jpg", // Lord Shreyansnath Ancient Bas-relief sculpture
    "12": "https://upload.wikimedia.org/wikipedia/commons/2/21/Vasupujya_Tirthankar_red_stone_ancient_idol.jpg", // Lord Vasupujya Red Stone traditional idol
    "13": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Vimalanatha_sitting_Jaina_sculpture_archeology.jpg", // Lord Vimalnath Stone Archeological sculpture
    "14": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sitting_Jina_Anantnath_Gwalior_Fort_Caves.jpg", // Lord Anantnath Rock-cut Idol in cave walls
    "15": "https://upload.wikimedia.org/wikipedia/commons/9/90/Dharmanatha_Idol_at_ancient_temple.jpg", // Lord Dharmanath Heritage Temple Idol
    "16": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Colossal_Lord_Shantinath_Idol_at_Khajuraho.jpg", // Lord Shantinath Colossal Idol at Khajuraho Temple
    "17": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Kunthunatha_ancient_sculpture_Jain.jpg", // Lord Kunthunath Classic Bronze Idol
    "18": "https://upload.wikimedia.org/wikipedia/commons/a/af/Lord_Arnatha_Idol_at_ancient_Basadi.jpg", // Lord Arnath Traditional Stone Temple Carving
    "19": "https://upload.wikimedia.org/wikipedia/commons/d/df/Lord_Mallinath_sitting_immobile_sculpture.jpg", // Lord Mallinath Divine Stone Statue
    "20": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Colossal_Munisuvratnath_black_stone_statue.jpg", // Lord Munisuvratnath Majestic Black Stone Statue
    "21": "https://upload.wikimedia.org/wikipedia/commons/6/65/Lord_Naminatha_traditional_Jain_sculpture.jpg", // Lord Naminath Ancient Jain Temple Artifact
    "22": "https://upload.wikimedia.org/wikipedia/commons/9/96/Lord_Neminatha_black_granite_idol_Girnar.jpg", // Lord Neminath Sacred Black Granite Idol
    "23": "https://upload.wikimedia.org/wikipedia/commons/d/df/Parshvanatha_ancient_sculpture_rock_cut.jpg", // Lord Parshvanath with majestic multi-hooded snake canopy
    "24": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Lord_Mahavira_Idol_at_shrine.jpg", // Lord Vardhamana Mahavira Seated in Deep Padmasana
  };
  return photos[id] || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg/800px-Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg";
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
  const { language: lang, toggleLanguage } = useLanguage();
  const [selectedT, setSelectedT] = useState<any>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [tirthankars, setTirthankars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tirthankars'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const merged = [...data];
      FALLBACK_TIRTHANKARS.forEach(seed => {
        const isDuplicate = data.some((d: any) => 
          (d.name?.en && d.name.en === seed.name?.en) || 
          (d.name?.hi && d.name.hi === seed.name?.hi)
        );
        if (!isDuplicate) {
          merged.push(seed);
        }
      });

      setTirthankars(merged);
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
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <Library className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">{lang === 'en' ? '24 TIRTHANKARS DIRECTORY' : '२४ तीर्थंकर भगवंत निर्देशिका'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-2xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200/50 dark:border-white/5 h-10 w-10 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Tirthankar Section Guide' : 'तीर्थंकर निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-2xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30 shrink-0"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={14} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
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

      {/* Premium responsive grid card layout for 24 Tirthankars */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-[#FF6D00]" size={28} />
            <p className="font-semibold text-xs tracking-widest uppercase">Loading Directory...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center items-stretch w-full max-w-7xl mx-auto">
            {filtered.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedT(t)}
                className="group bg-white dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden hover:border-[#FF6D00]/50 dark:hover:border-[#FFD54F]/50 hover:shadow-[0_8px_30px_rgba(255,109,0,0.15)] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative"
              >
                {/* Card Image and Saffron overlay */}
                <div className="h-40 relative w-full overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                  <img 
                    src={getTirthankarPhoto(t.id)} 
                    alt={t.name?.en} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[#FFD54F] border border-white/10">
                      #{t.number}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-orange-600 text-white border border-orange-500">
                      {lang === 'en' ? t.kaal : (t.kaal === 'Past' ? 'भूतकाल' : t.kaal === 'Present' ? 'वर्तमान' : 'भविष्य')}
                    </span>
                  </div>
                </div>

                {/* Card Body content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-black text-base text-gray-900 dark:text-white group-hover:text-[#FF6D00] dark:group-hover:text-[#FFD54F] transition-colors leading-snug">
                      {lang === 'en' ? t.name?.en : t.name?.hi}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100/30 dark:border-orange-500/10 text-xs text-gray-600 dark:text-gray-400 font-semibold w-fit">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span>
                        {lang === 'en' ? 'Symbol:' : 'चिह्न:'} <strong className="text-gray-900 dark:text-gray-200">{lang === 'en' ? t.symbol?.en : t.symbol?.hi}</strong>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-[#FFD54F]">
                    <span>{lang === 'en' ? 'View Divine Details' : 'दर्शन व गाथा जानें'}</span>
                    <span className="text-sm font-black group-hover:translate-x-1.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
            {lang === 'en' ? 'No Tirthankars found matching search.' : 'खोज से मिलता जुलता कोई तीर्थंकर नहीं मिला।'}
          </div>
        )}
      </div>

      {/* Structural Details View Overlay Modal */}
      {selectedT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
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

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
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
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-350 dark:text-zinc-350 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to 24 Tirthankars Directory!' : '२४ तीर्थंकर भगवंत निर्देशिका में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'This directory serves as a comprehensive study portal for Tirthankars in all three cosmic kaal eras (Past, Present, Future) and Videha Kshetra:' 
                  : 'यह पावन संभाग तीनों कालों के २४ तीर्थंकरों एवं विदेह क्षेत्र के वर्तमान विहरमान जिनेन्द्र देवों की प्रामाणिक जानकारी का संग्रह है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Cosmic Kaal Eras:' : 'काल विभाजन:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Switch between Present, Past, Future, and Videha Kshetra categories to explore current, historic, and eventual savior Arihantas.' 
                    : 'भूतकाल, वर्तमान काल, भविष्य काल एवं विदेह क्षेत्र तीर्थंकर श्रेणियों में स्विच कर सुगमता से अध्ययन करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Panch Kalyanaka Dates:' : 'पंचकल्याणक तिथियां:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Click any Tirthankar card to read birthplace, parents, shade, size, and specific tithis for Garbha, Janma, Tapa, Kevalgyan, and Moksha.'
                    : 'किसी भी तीर्थंकर के नाम पर क्लिक कर उनके माता-पिता, मोक्ष स्थान, कायोत्सर्ज विवरण, रंग और पंचकल्याणक की शास्त्र सम्मत तिथियां जानें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Quick Searches:' : 'आसान खोज माध्यम:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Filter simply by typing its name in Hin-glish or search symbols (e.g., Lion for Mahavira, Swastika for Suparshvanath, Shell for Neminath).'
                    : 'हिन्दी या अंग्रेज़ी में नाम टाइप करके या उनके लांछन (चिन्ह) जैसे- सिंह, सर्प, शंख, स्वस्तिक लिखकर भी खोज सकते हैं।'}
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

      <SectionAiAgent section="tirthankars" />
    </div>
  );
}
