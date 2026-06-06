import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Calendar, Heart, Shield, CheckCircle2, Award, Info, RefreshCw, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';

interface CityPreset {
  name: { en: string; hi: string };
  sunrise: string;
  sunset: string;
}

const CITIES: CityPreset[] = [
  { name: { en: "Mumbai", hi: "मुंबई" }, sunrise: "06:01 AM", sunset: "07:11 PM" },
  { name: { en: "New Delhi", hi: "नई दिल्ली" }, sunrise: "05:28 AM", sunset: "07:15 PM" },
  { name: { en: "Ahmedabad", hi: "अहमदाबाद" }, sunrise: "05:58 AM", sunset: "07:22 PM" },
  { name: { en: "Jaipur", hi: "जयपुर" }, sunrise: "05:41 AM", sunset: "07:19 PM" },
  { name: { en: "Bangalore", hi: "बेंगलुरु" }, sunrise: "06:03 AM", sunset: "06:44 PM" },
  { name: { en: "Kolkata", hi: "कोलकाता" }, sunrise: "04:59 AM", sunset: "06:21 PM" }
];

const PACHKHANS = [
  {
    id: "chauvihar",
    title: { en: "Chauvihar (चौविहार)", hi: "चौविहार प्रत्याख्यान" },
    desc: {
      en: "Abstaining from all types of food, water, and liquids from sunset today until 48 minutes after sunrise tomorrow.",
      hi: "सूर्यास्त के उपरांत चौविहार - सभी तरह के अन्न, फल, चाय, एवं जल का पूर्ण त्याग।"
    },
    sankalpa: {
      en: "I vow to consume no food or water from sunset today until tomorrow sunrise + 48 mins.",
      hi: "दिवस चरम पच्चकखामी; अन्न-पान-खादिम-स्वादिम चउविहारं आहारं पच्चकखामी।"
    }
  },
  {
    id: "upwas",
    title: { en: "Upwas (उपवास)", hi: "उपवास प्रत्याख्यान" },
    desc: {
      en: "A complete 24-hour fast. No food consumption. Water is taken only boiled, strictly between sunrise and sunset.",
      hi: "२४ घंटे का पूर्ण भोजन त्याग। केवल सूर्योदय और सूर्यास्त के बीच उबला हुआ जल मर्यादित समय में ग्रहण कर सकते हैं।"
    },
    sankalpa: {
      en: "I vow to fast for the next 24 hours, consuming only filtered boiled water during daylight hours.",
      hi: "सूरउग्गए पच्चकखामी; चउविहारं पि आहारं पच्चकखामी - असणं पाणं खादिमं सादिमं।"
    }
  },
  {
    id: "ekasana",
    title: { en: "Ekasana / Beasna (एकासन)", hi: "एकासन / बियासन" },
    desc: {
      en: "Consuming food only once (Ekasana) or twice (Beasna) in a single sitting at one place, adhering to Satvik boundaries.",
      hi: "एक ही आसन पर बैठकर दिन में एक बार (एकासन) या दो बार (बियासन) भोजन ग्रहण करने का नियम।"
    },
    sankalpa: {
      en: "I vow to sit in one place and consume food only once today, observing pure Satvik rules.",
      hi: "एकस्थानं पच्चकखामी; असणं पाणं खादिमं सादिमं एकस्थानं भुंजिस्सामि।"
    }
  },
  {
    id: "samayik",
    title: { en: "Samayik - 48 Mins (सामायिक)", hi: "सामायिक व्रत" },
    desc: {
      en: "Vow of absolute equanimity for 48 minutes, staying clear of worldly desires, phones, and negative speech.",
      hi: "४८ मिनट के लिए समता भाव धारण करना। इस काल में हिंसा, मोबाइल स्क्रीन, व्यापार चर्चा का पूर्ण त्याग कर ध्यान स्वाध्याय करना।"
    },
    sankalpa: {
      en: "I vow to engage in 48 minutes of quiet introspection, mantra reading, and peace.",
      hi: "करेमि भंते! सामाइयं सावज्जं जोगं पच्चकखामी; जाव नियमं पज्जुवासामि।"
    }
  }
];

export default function FastingPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES[0]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [activeFasts, setActiveFasts] = useState<string[]>([]);
  const [fastStreak, setFastStreak] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Parse sunset timers count down
  useEffect(() => {
    const calculateCountdown = () => {
      try {
        const now = new Date();
        const sunsetComponents = selectedCity.sunset.match(/(\d+):(\d+)\s+(AM|PM)/);
        if (!sunsetComponents) return;

        let [_, hoursStr, minutesStr, amp] = sunsetComponents;
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (amp === 'PM' && hours < 12) hours += 12;
        if (amp === 'AM' && hours === 12) hours = 0;

        const sunsetDate = new Date();
        sunsetDate.setHours(hours, minutes, 0, 0);

        // If sunset has passed today, show next day or complete
        let diffMs = sunsetDate.getTime() - now.getTime();
        if (diffMs < 0) {
          setTimeRemaining(lang === 'en' ? 'Sunset reached (Observing Chauvihar)' : 'सूर्यास्त हो चुका है (चौविहार नियम प्रभावी)');
        } else {
          const totalSecs = Math.floor(diffMs / 1000);
          const hrs = Math.floor(totalSecs / 3600);
          const mins = Math.floor((totalSecs % 3600) / 60);
          const secs = totalSecs % 60;
          setTimeRemaining(`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedCity, lang]);

  // Load streak state
  useEffect(() => {
    const savedStreak = localStorage.getItem('fasting_streak');
    const savedActive = localStorage.getItem('active_fasts_logged');
    if (savedStreak) setFastStreak(parseInt(savedStreak, 10));
    if (savedActive) {
      try {
        setActiveFasts(JSON.parse(savedActive));
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  const handleToggleFast = (id: string) => {
    let updated: string[];
    if (activeFasts.includes(id)) {
      updated = activeFasts.filter(x => x !== id);
    } else {
      updated = [...activeFasts, id];
    }
    setActiveFasts(updated);
    localStorage.setItem('active_fasts_logged', JSON.stringify(updated));

    // Update streak based on additions
    if (updated.length > activeFasts.length) {
      const nextStreak = fastStreak + 1;
      setFastStreak(nextStreak);
      localStorage.setItem('fasting_streak', nextStreak.toString());
    } else if (updated.length === 0) {
      setFastStreak(0);
      localStorage.setItem('fasting_streak', '0');
    }
  };

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            {lang === 'en' ? 'PACHKHAN & FASTING' : 'पचक्खाण और व्रत साधना'}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-350 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200 dark:border-white/10 h-9 w-9 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Fasting Section Guide' : 'व्रत अनुभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-9"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Geolocation Solar Dial Countdown Widget */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-2xl rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-md mb-6 relative overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FFD54F]/10 dark:bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <MapPin size={16} className="text-orange-500" />
            <select 
              value={selectedCity.name.en}
              onChange={(e) => {
                const target = CITIES.find(c => c.name.en === e.target.value);
                if (target) setSelectedCity(target);
              }}
              className="bg-transparent border-b border-gray-300 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-orange-500"
              id="city-select-fast"
            >
              {CITIES.map(c => (
                <option key={c.name.en} value={c.name.en} className="dark:bg-[#121212]">{lang === 'en' ? c.name.en : c.name.hi}</option>
              ))}
            </select>
          </div>

          <div className="bg-orange-500/10 px-3 py-1 rounded-full text-[10px] font-black text-[#FF6D00] uppercase tracking-wider flex items-center gap-1">
            <Clock size={12} />
            <span>{lang === 'en' ? 'CHAUVIHAR TIMER' : 'चौविहार उल्टी गिनती'}</span>
          </div>
        </div>

        {/* Sunrise / Sunset Times */}
        <div className="grid grid-cols-2 gap-4 my-2 border-b border-gray-100 dark:border-white/5 pb-4 relative z-10">
          <div className="text-center">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-orange-400 block mb-0.5">{lang === 'en' ? 'SUNRISE' : 'सूर्योदय'}</span>
            <span className="text-base font-black text-gray-800 dark:text-white">{selectedCity.sunrise}</span>
          </div>
          <div className="text-center border-l border-gray-100 dark:border-white/5">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-400 block mb-0.5">{lang === 'en' ? 'SUNSET' : 'सूर्यास्त'}</span>
            <span className="text-base font-black text-gray-800 dark:text-white">{selectedCity.sunset}</span>
          </div>
        </div>

        {/* Timer countdown readout */}
        <div className="my-5 relative z-10">
          <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase block mb-1">
            {lang === 'en' ? 'TIME REMAINING UNTIL SUNSET' : 'सूर्यास्त में शेष समयावधि'}
          </span>
          <span className="text-3xl font-mono font-black text-red-500 tracking-wider block drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">
            {timeRemaining}
          </span>
        </div>

        {/* Dynamic Warning Caution Banner */}
        <div className="p-3 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center gap-2 text-left relative z-10">
          <Info size={16} className="text-yellow-500 shrink-0" />
          <p className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 font-bold">
            {lang === 'en'
              ? "According to Jain principles, no water or food should be consumed after Sunset. Finish your Chauvihar meal at least 24 minutes prior."
              : "जैन सिद्धांत के अनुसार सूर्यास्त के बाद जल व भोजन ग्रहण न करें। कम से कम २४ मिनट पूर्व भोजन पूर्ण कर लें।"}
          </p>
        </div>
      </div>

      {/* Fasting Streaks display */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500/10 text-[#FF6D00] rounded-2xl flex items-center justify-center font-black">
            <Award size={24} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase text-orange-500 tracking-wider block">{lang === 'en' ? 'TAPASYA STREAK' : 'आज की तपस्या निरन्तरता'}</span>
            <span className="text-sm font-black text-gray-800 dark:text-white">
              {lang === 'en' ? `${fastStreak} Fasting Milestones Logged` : `${fastStreak} व्रत/प्रत्याख्यान नियम स्वीकृत`}
            </span>
          </div>
        </div>
        
        {fastStreak > 0 && (
          <div className="bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] px-3.5 py-1.5 rounded-xl font-bold text-xs text-black shadow-sm">
            🔥 {fastStreak} {lang === 'en' ? 'Active' : 'सक्रिय'}
          </div>
        )}
      </div>

      {/* Pachkhan List */}
      <h2 className="text-lg font-display font-black text-gray-800 dark:text-white mb-4 uppercase tracking-wide">
        {lang === 'en' ? 'TAKE DAILY PACHKHAN VOWS' : 'प्रत्याख्यान (पच्चखाण) व्रत संकल्प'}
      </h2>

      <div className="space-y-4">
        {PACHKHANS.map((p) => {
          const isTaken = activeFasts.includes(p.id);
          return (
            <div 
              key={p.id}
              className={`bg-white dark:bg-[#121212] rounded-3xl p-5 border shadow-sm transition-all duration-300 flex flex-col justify-between gap-4 ${
                isTaken 
                  ? 'border-orange-500/50 shadow-[0_4px_15px_rgba(255,109,0,0.1)] outline outline-1 outline-orange-500/20' 
                  : 'border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-gray-800 dark:text-white leading-snug">
                    {lang === 'en' ? p.title.en : p.title.hi}
                  </h3>
                  
                  {isTaken && (
                    <span className="bg-orange-500/15 text-orange-500 text-[10px] font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 border border-orange-500/20">
                      <CheckCircle2 size={12} />
                      {lang === 'en' ? 'TAKEN' : 'स्वीकृत संकल्प'}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-3">
                  {lang === 'en' ? p.desc.en : p.desc.hi}
                </p>
                
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1A1A1A]/80 border border-gray-100 dark:border-white/5">
                  <span className="text-[8px] font-black tracking-widest text-[#FF8A65] block mb-1.5 uppercase">
                    {lang === 'en' ? 'SANKALPA recitation mantra' : 'धारण पाठ मंत्र (पाठ बोलें)'}
                  </span>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed italic">
                    "{lang === 'en' ? p.sankalpa.en : p.sankalpa.hi}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleToggleFast(p.id)}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                  isTaken 
                    ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/15' 
                    : 'bg-orange-500 text-white border-transparent hover:bg-orange-600 shadow-sm shadow-orange-500/20'
                }`}
                id={`btn-fast-${p.id}`}
              >
                {isTaken 
                  ? (lang === 'en' ? 'REFRAIN / DISMISS VOW' : 'संकल्प मुक्त करें') 
                  : (lang === 'en' ? 'ACCEPT DISCIPLINE SANKALPA' : 'नियम स्वीकार करें')
                }
              </button>
            </div>
          );
        })}
      </div>

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
                {lang === 'en' ? 'Welcome to Pachkhan & Fasting Room!' : 'पचक्खाण और व्रत साधना कक्ष में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'Commit and track your sacred fasting schedules (Tapasya) directly linked with natural solar alignments:' 
                  : 'जैन धर्म में तपस्या (व्रत) की महत्ता व मानसिक शुद्धि हेतु प्रकृति व सौर चक्र से जुड़े प्रमुख व्रत नियम लें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Solar Sunrise/Sunset Tracker:' : 'सूर्योदय व सूर्यास्त समय सारिणी:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Track real-time solar alignment with the top dial. Select your local city to dynamically determine coordinates for sunrise and sunset.' 
                    : 'ऊपरी परिपत्र डायल प्रकृति के सौर परिवर्तन को दर्शाता है। अपने शहर के चुनाव अनुसार एकदम सटीक घड़ी देख संकल्प ग्रहण करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Accepting Sacred Sankalpa:' : 'नियम व प्रत्याख्यान संकल्प:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Recite the authentic prakrit/Sanskrit mantras associated with classical vows like Chauvihar, Upwas, Ekasana, or Ayambil, then tap Accept.'
                    : 'चौविहार, उपवास, बियासन या आयंबिल जैसे प्रमुख नियमों के शास्त्रोक्त प्राकृत पाठ को बोलें तथा नीचे "नियम स्वीकार करें" पर क्लिक करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Consistent Tapasya Streak:' : 'तपस्या निरंतरता (Streak):'}</strong>{' '}
                  {lang === 'en'
                    ? 'Successfully logging complete vows automatically triggers progress increments to log continuous spiritual health dedication.'
                    : 'नियमित रूप से व्रत संकल्प दर्ज करने पर आपकी साधना निरंतरता तथा आत्म बल की दृढ़ता हेतु गुणात्मक दिन प्रभाग बढ़ेगा।'}
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

      <SectionAiAgent section="fasting" />
    </div>
  );
}
