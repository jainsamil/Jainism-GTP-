import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Calendar, Heart, Shield, CheckCircle2, Award, Info, RefreshCw, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
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
    id: "ayambil",
    title: { en: "Ayambil (आयंबिल)", hi: "आयंबिल तप प्रत्याख्यान" },
    desc: {
      en: "Eating once a day in one sitting, strictly dry food. Complete avoidance of the six vigai flavors (ghee, oil, milk, curd, sugar, and fried items). No green vegetables or fruits.",
      hi: "दिन में एक बार भोजन, वह भी सर्वथा रुखा-सूखा बिना घी, तेल, दूध, दही, शक्कर, हरी सब्जी, मेवा या मसालों के (छह विगय का पूर्ण त्याग)।"
    },
    sankalpa: {
      en: "I vow to consume only simple dry food once today, completely avoiding the six vigai flavors.",
      hi: "आयंबिलं पच्चकखामी; असणं पाणं खादिमं सादिमं एग असणं भुंजिस्सामि विगदिवर्जितं।"
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
  const [autoRing, setAutoRing] = useState(true);

  // Scheduler & Rules states
  const [scheduledFasts, setScheduledFasts] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('fasting_schedule_planner');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [rulesChecklist, setRulesChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fasting_rules_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Synthesized Web Audio Brass Bowl Bell
  const playSunsetBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(293.66, ctx.currentTime); // D4 fundamental
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 overtone
      
      gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + 3.6);
      osc2.stop(ctx.currentTime + 3.6);
    } catch (err) {
      console.warn("Audio Context blocked by browser auto-play policy or not supported:", err);
    }
  };

  const toggleFastingRule = (ruleId: string) => {
    const isCompleted = !rulesChecklist[ruleId];
    const updated = { ...rulesChecklist, [ruleId]: isCompleted };
    setRulesChecklist(updated);
    localStorage.setItem('fasting_rules_checklist', JSON.stringify(updated));

    // +5 Punya Points on completion, -5 on deselect
    const nextPunya = isCompleted ? punyaScore + 5 : Math.max(0, punyaScore - 5);
    setPunyaScore(nextPunya);
    localStorage.setItem('tapasya_punya_score', nextPunya.toString());
  };

  const getNextSevenDays = () => {
    const days = [];
    const weekdays = lang === 'en' 
      ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      : ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
      
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString();
      days.push({
        dateStr,
        dayName: weekdays[d.getDay()],
        dateNum: d.getDate(),
        monthName: d.toLocaleString(lang === 'en' ? 'en-US' : 'hi-IN', { month: 'short' }),
        isToday: i === 0
      });
    }
    return days;
  };

  const handleScheduleFast = (dateStr: string, fastType: string) => {
    const updated = { ...scheduledFasts, [dateStr]: fastType };
    setScheduledFasts(updated);
    localStorage.setItem('fasting_schedule_planner', JSON.stringify(updated));

    // Also add to active fasts if scheduled for today
    const todayStr = new Date().toLocaleDateString();
    if (dateStr === todayStr && fastType !== 'none') {
      if (!activeFasts.includes(fastType)) {
        const nextActive = [...activeFasts, fastType];
        setActiveFasts(nextActive);
        localStorage.setItem('active_fasts_logged', JSON.stringify(nextActive));
        
        const nextStreak = fastStreak + 1;
        setFastStreak(nextStreak);
        localStorage.setItem('fasting_streak', nextStreak.toString());

        const nextPunya = punyaScore + 20;
        setPunyaScore(nextPunya);
        localStorage.setItem('tapasya_punya_score', nextPunya.toString());
      }
    }
  };

  // New Interactive Feature: Auspicious Tithi Calendar and Punya Points state
  const [punyaScore, setPunyaScore] = useState(() => {
    try {
      const saved = localStorage.getItem('tapasya_punya_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [loggedObservances, setLoggedObservances] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('logged_tithi_observances');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [rasaTyaga, setRasaTyaga] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('logged_rasa_tyaga');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTithiObservance = (id: string) => {
    const isObserving = !loggedObservances[id];
    const updated = { ...loggedObservances, [id]: isObserving };
    setLoggedObservances(updated);
    localStorage.setItem('logged_tithi_observances', JSON.stringify(updated));

    // Update Punya Points: adding +50 points when observing a Tithi fast
    const nextPunya = isObserving ? punyaScore + 50 : Math.max(0, punyaScore - 50);
    setPunyaScore(nextPunya);
    localStorage.setItem('tapasya_punya_score', nextPunya.toString());
  };

  const toggleRasaTyaga = (id: string) => {
    const isObserving = !rasaTyaga[id];
    const updated = { ...rasaTyaga, [id]: isObserving };
    setRasaTyaga(updated);
    localStorage.setItem('logged_rasa_tyaga', JSON.stringify(updated));

    // Update Punya Points: adding +15 points for flavor sacrifice
    const nextPunya = isObserving ? punyaScore + 15 : Math.max(0, punyaScore - 15);
    setPunyaScore(nextPunya);
    localStorage.setItem('tapasya_punya_score', nextPunya.toString());
  };

  // Track if sunset bell already rung today to prevent duplicate chime
  const lastRungRef = useRef<string | null>(null);

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
          
          // Auto ring bell at exactly sunset
          const todayKey = now.toLocaleDateString();
          if (autoRing && lastRungRef.current !== todayKey && Math.abs(diffMs) < 60000) {
            lastRungRef.current = todayKey;
            playSunsetBell();
          }
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
  }, [selectedCity, lang, autoRing]);

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
    const isAdding = !activeFasts.includes(id);
    if (activeFasts.includes(id)) {
      updated = activeFasts.filter(x => x !== id);
    } else {
      updated = [...activeFasts, id];
    }
    setActiveFasts(updated);
    localStorage.setItem('active_fasts_logged', JSON.stringify(updated));

    // Update streak based on additions
    if (isAdding) {
      const nextStreak = fastStreak + 1;
      setFastStreak(nextStreak);
      localStorage.setItem('fasting_streak', nextStreak.toString());

      // Reward +20 Punya Points
      const nextPunya = punyaScore + 20;
      setPunyaScore(nextPunya);
      localStorage.setItem('tapasya_punya_score', nextPunya.toString());
    } else {
      // Cancel/refrain reduces score
      const nextPunya = Math.max(0, punyaScore - 20);
      setPunyaScore(nextPunya);
      localStorage.setItem('tapasya_punya_score', nextPunya.toString());
      
      if (updated.length === 0) {
        setFastStreak(0);
        localStorage.setItem('fasting_streak', '0');
      }
    }
  };

  return (
    <div className="min-h-full pb-26 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
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
        <div className="my-5 relative z-10 flex flex-col items-center justify-center">
          <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase block mb-1">
            {lang === 'en' ? 'TIME REMAINING UNTIL SUNSET' : 'सूर्यास्त में शेष समयावधि'}
          </span>
          <div className="flex items-center justify-center gap-3.5">
            <span className="text-3xl font-mono font-black text-red-500 tracking-wider block drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">
              {timeRemaining}
            </span>
            <button
              type="button"
              onClick={playSunsetBell}
              className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition-all cursor-pointer text-sm font-bold flex items-center justify-center h-8 w-8"
              title={lang === 'en' ? "Test Sunset Bell Sound" : "सूर्यास्त घंटी बजाकर देखें"}
            >
              🔔
            </button>
          </div>
          
          <label className="mt-3 flex items-center gap-2 cursor-pointer text-[10px] text-gray-500 dark:text-gray-400 font-bold justify-center select-none">
            <input 
              type="checkbox" 
              checked={autoRing} 
              onChange={(e) => setAutoRing(e.target.checked)} 
              className="accent-amber-500 h-3.5 w-3.5 rounded"
            />
            <span>{lang === 'en' ? 'Auto-ring bell at Sunset (Chauvihar Chime)' : 'सूर्यास्त पर स्वतः अलार्म घंटी बजाएं (चौविहार अलर्ट)'}</span>
          </label>
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

      {/* Dynamic Vrat & Fasting Planner */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-gray-150 dark:border-white/5 shadow-md mb-6 space-y-6">
        <div className="flex items-center gap-2.5 text-orange-600 dark:text-[#FFD54F]">
          <span className="text-xl">📅</span>
          <div className="text-left">
            <h3 className="font-display font-black text-sm uppercase tracking-wider">
              {lang === 'en' ? 'Jain Vrat & Fasting Planner' : 'जैन व्रत एवं तपस्या प्लानर'}
            </h3>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">
              {lang === 'en' ? 'Schedule Upvas, Ekasana, or Chauvihar' : 'आगामी दिनों के लिए उपवास, एकासन या चौविहार नियम की योजना बनाएं'}
            </span>
          </div>
        </div>

        {/* Horizontal Calendar Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
          {getNextSevenDays().map((day) => {
            const currentScheduled = scheduledFasts[day.dateStr] || 'none';
            return (
              <div 
                key={day.dateStr}
                className={cn(
                  "p-3 rounded-2xl border text-center flex flex-col justify-between gap-2.5 transition-all",
                  day.isToday 
                    ? "bg-orange-500/5 border-orange-500/35" 
                    : "bg-gray-50/50 dark:bg-white/[0.01] border-gray-150 dark:border-white/5"
                )}
              >
                <div>
                  <span className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-500 block">
                    {day.dayName}
                  </span>
                  <span className="text-lg font-black text-gray-800 dark:text-white block mt-0.5 leading-none">
                    {day.dateNum}
                  </span>
                  <span className="text-[9px] font-bold text-orange-500 block uppercase">
                    {day.monthName} {day.isToday && `(${lang === 'en' ? 'Today' : 'आज'})`}
                  </span>
                </div>

                <div className="space-y-1">
                  <select
                    value={currentScheduled}
                    onChange={(e) => handleScheduleFast(day.dateStr, e.target.value)}
                    className="w-full text-[9px] font-black uppercase tracking-wider text-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="none" className="dark:bg-[#121212]">{lang === 'en' ? 'No Vrat' : 'कोई नियम नहीं'}</option>
                    <option value="upvas" className="dark:bg-[#121212]">{lang === 'en' ? 'Upvas' : 'उपवास'}</option>
                    <option value="ekasana" className="dark:bg-[#121212]">{lang === 'en' ? 'Ekasana' : 'एकासन'}</option>
                    <option value="beasana" className="dark:bg-[#121212]">{lang === 'en' ? 'Beasana' : 'बेआसन'}</option>
                    <option value="chauvihar" className="dark:bg-[#121212]">{lang === 'en' ? 'Chauvihar' : 'चौविहार'}</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Fasting Rules Checklist */}
        <div className="border-t border-gray-100 dark:border-white/5 pt-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-450">
            <Shield size={16} />
            <h4 className="text-xs font-black uppercase tracking-wider text-left">
              {lang === 'en' ? 'Fasting Purity & Rules Checklist' : 'तपस्या शुद्धता एवं दैनिक नियम निर्देशिका'}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: "rule_sunset", en: "Strict Chauvihar: Finish all water & food before sunset.", hi: "दृढ़ चौविहार: सूर्यास्त पूर्व अन्न व जल का त्याग पूर्ण करें।" },
              { id: "rule_sachitta", en: "Sachitta Tyaga: Consume only boiled/warm water & cooked food.", hi: "सचित्त त्याग: केवल प्राशुक (उबला हुआ) जल एवं पके भोजन का सेवन करें।" },
              { id: "rule_rootveg", en: "Anantkay Abstinence: Avoid potatoes, onions, garlic & root veg.", hi: "अनंतकाय त्याग: आलू, प्याज, लहसुन, जमीकंद आदि का पूर्ण त्याग।" },
              { id: "rule_dharmic", en: "Dharmic Swadhyay: Spend 24+ mins reading scriptures or mantra.", hi: "धर्म आराधना: कम से कम २४ मिनट ग्रंथों का स्वाध्याय या सामायिक करें।" },
              { id: "rule_charitra", en: "Pure Conduct: Avoid anger, bad language or worldly gossips.", hi: "पवित्र आचरण: क्रोध, मान, माया, लोभ और कड़वे वचनों का त्याग रखें।" }
            ].map((rule) => {
              const isChecked = rulesChecklist[rule.id] || false;
              return (
                <div 
                  key={rule.id}
                  onClick={() => toggleFastingRule(rule.id)}
                  className={cn(
                    "p-3 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.01]",
                    isChecked 
                      ? "bg-emerald-500/[0.03] border-emerald-500/30" 
                      : "bg-gray-50/50 dark:bg-white/[0.01] border-gray-150 dark:border-white/5"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all shrink-0",
                    isChecked ? "bg-emerald-500 border-transparent text-black" : "border-gray-300 dark:border-white/10"
                  )}>
                    {isChecked && <CheckCircle2 size={11} className="fill-white text-emerald-600" />}
                  </div>
                  <div>
                    <p className={cn(
                      "text-[10px] font-bold leading-normal",
                      isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"
                    )}>
                      {lang === 'en' ? rule.en : rule.hi}
                    </p>
                    <span className="text-[8px] font-extrabold text-emerald-600 tracking-wider uppercase block mt-0.5">
                      {isChecked ? '✓ Rule Maintained (+5 Punya!)' : '+5 Punya Points'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tapasya Streaks and Punya Meter Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Fasting Streaks display */}
        <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-orange-500/10 text-[#FF6D00] rounded-2xl flex items-center justify-center font-black shrink-0">
              <Award size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase text-orange-500 tracking-wider block text-left">{lang === 'en' ? 'TAPASYA STREAK' : 'तपस्या निरंतरता'}</span>
              <span className="text-xs font-black text-gray-800 dark:text-white text-left block">
                {lang === 'en' ? `${fastStreak} Milestones` : `${fastStreak} नियम स्वीकृत`}
              </span>
            </div>
          </div>
          
          {fastStreak > 0 && (
            <div className="bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] px-2.5 py-1 rounded-xl font-black text-[10px] text-black shadow-sm">
              🔥 {fastStreak} {lang === 'en' ? 'Active' : 'सक्रिय'}
            </div>
          )}
        </div>

        {/* Punya Point Meter (GAMIFIED EXPERIENCE) */}
        <div className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center font-black shrink-0">
              <Award size={22} className="text-emerald-500" />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase text-emerald-500 tracking-wider block text-left">{lang === 'en' ? 'PUNYA POINTS' : 'साधना पुण्य अंक'}</span>
              <span className="text-xs font-black text-gray-800 dark:text-white text-left block">
                {lang === 'en' ? `${punyaScore} Tapasya points` : `${punyaScore} पुण्य अंक अर्जित`}
              </span>
            </div>
          </div>
          <div className="bg-emerald-500 text-black px-2.5 py-1 rounded-xl font-black text-[10px] uppercase shadow-sm shrink-0">
            ✨ {lang === 'en' ? 'Punya' : 'पुण्य'}
          </div>
        </div>
      </div>

      {/* samyak tithi calendar - EXCITING NEW FEATURE ADDED */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm mb-6 space-y-4">
        <div className="flex items-center gap-2.5 text-orange-600 dark:text-[#FFD54F]">
          <Calendar size={18} className="shrink-0" />
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-left">
              {lang === 'en' ? 'Sacred Monthly Parv Tithis' : 'शाश्वत जैन पर्व तिथियां एवं व्रत'}
            </h3>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold text-left">
              {lang === 'en' ? 'Auspicious days for practicing mental detachment' : 'अष्टमी व चतुर्दशी तिथियों को व्रत करने की गौरवशाली जैन परंपरा'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "ashtami_k", name: { en: "Krishna Ashtami (अष्टमी)", hi: "कृष्ण पक्ष अष्टमी व्रत" }, tithi: { en: "8th Waning Moon", hi: "अष्टमी तिथि" }, desc: { en: "Minimize business stress and focus on self-study.", hi: "इंद्रिय असंयम को टालने एवं स्वाध्याय हेतु सर्वश्रेष्ठ पर्व दिन।" } },
            { id: "chaturdashi_k", name: { en: "Krishna Chaturdashi (चतुर्दशी)", hi: "कृष्ण पक्ष चतुर्दशी व्रत" }, tithi: { en: "14th Waning Moon", hi: "चतुर्दशी तिथि" }, desc: { en: "Green vegetable abstinence, Ekasana or Upwas suggested.", hi: "हरी शाक-सब्जी का विवेकपूर्ण त्याग कर एकासन या उपवास की परम्परा।" } },
            { id: "ashtami_s", name: { en: "Shukla Ashtami (अष्टमी)", hi: "शुक्ल पक्ष अष्टमी व्रत" }, tithi: { en: "8th Waxing Moon", hi: "अष्टमी तिथि" }, desc: { en: "Observed through silences and continuous chanting.", hi: "मौनपूर्वक आत्म-तत्त्व चिंतन तथा ६ हजार श्वास प्रज्ञा मंत्र जप।" } },
            { id: "chaturdashi_s", name: { en: "Shukla Chaturdashi (चतुर्दशी)", hi: "शुक्ल पक्ष चतुर्दशी व्रत" }, tithi: { en: "14th Waxing Moon", hi: "चतुर्दशी तिथि" }, desc: { en: "Highest energetic phase for dissolving karmic loads.", hi: "साधना की सर्वोच्च तिथि। मन-वचन-काय को शुद्ध कर उपवास धारण करें।" } }
          ].map(item => {
            const isObserved = loggedObservances[item.id] || false;
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isObserved 
                    ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/40" 
                    : "bg-white/50 dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 hover:border-orange-500/25"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1 mb-1.5">
                    <span className="font-extrabold text-xs text-gray-900 dark:text-gray-100 leading-tight">
                      {item.name[lang]}
                    </span>
                    <span className="text-[8px] bg-orange-500/10 text-orange-600 dark:text-[#FFD54F] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 font-bold">
                      {item.tithi[lang]}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                    {item.desc[lang]}
                  </p>
                </div>

                <button
                  onClick={() => toggleTithiObservance(item.id)}
                  className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isObserved 
                      ? "bg-emerald-500 text-black shadow-sm" 
                      : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5"
                  }`}
                >
                  {isObserved ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>{lang === 'en' ? 'OBSERVED (+50 Punya!)' : 'व्रत पूर्ण स्वीकृत (+५० पुण्य!)'}</span>
                    </>
                  ) : (
                    <span>{lang === 'en' ? 'LOG TODAY AS MY PARV FAST' : 'आज मेरा पर्व व्रत नियम दर्ज करें'}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rasa Tyaga Section */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm mb-6 space-y-4">
        <div className="flex items-center gap-2.5 text-orange-600 dark:text-[#FFD54F]">
          <span className="text-xl">🧂</span>
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-left">
              {lang === 'en' ? 'Daily Rasa Tyaga (Flavor Renunciation)' : 'दैनिक रस त्याग एवं इन्द्रिय संयम'}
            </h3>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold text-left">
              {lang === 'en' ? 'Renounce specific flavors today for practicing physical self-control' : 'जीभ के स्वाद पर नियंत्रण और तपस्या हेतु आज की मर्यादा सहेजें'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: "lavan", name: { en: "Lavan Tyaga (No Salt)", hi: "नमक त्याग (अलौकिक तप)" }, icon: "🧂", points: 15, desc: { en: "Strictly avoid salt in any meal today to cool desires.", hi: "आज किसी भी आहार में नमक का पूर्ण त्याग (आचाम्ल भाव)।" } },
            { id: "madhur", name: { en: "Madhur Tyaga (No Sugar)", hi: "शर्करा/मीठा त्याग" }, icon: "🍬", points: 15, desc: { en: "Avoid sugar, sweets, or sweetened beverages.", hi: "आज मीठे पकवान, चीनी व शर्करा युक्त भोजन का पूर्ण त्याग।" } },
            { id: "ghee_oil", name: { en: "Sneh Tyaga (No Ghee/Oil)", hi: "घी एवं तेल त्याग" }, icon: "🏺", points: 15, desc: { en: "Avoid fats, butter, ghee, and oily substances.", hi: "आज चिकनाई, मक्खन, घी एवं तैलीय पदार्थों का पूर्ण त्याग।" } },
            { id: "milk_curd", name: { en: "Gorasa Tyaga (No Dairy)", hi: "गोरस (दूध-दही) त्याग" }, icon: "🥛", points: 15, desc: { en: "Avoid consumption of milk and curd today.", hi: "दूध, दही और मलाई जैसी स्वास्थ्यवर्धक विगय का त्याग।" } },
            { id: "shital_jal", name: { en: "Shital Jal Tyaga", hi: "शीतल जल त्याग" }, icon: "❄️", points: 15, desc: { en: "Avoid chilled carbonated or refrigerated water.", hi: "फ्रिज के ठंडे जल या बर्फ युक्त कृत्रिम पेयों का त्याग।" } },
            { id: "bahya_sanyam", name: { en: "Pramada Tyaga", hi: "प्रमाद त्याग संयम" }, icon: "📱", points: 15, desc: { en: "Avoid social scrolling or digital gossip today.", hi: "आज दिनभर व्यर्थ सोशल मीडिया व मनोरंजन स्क्रॉलिंग का त्याग।" } }
          ].map(item => {
            const isObserved = rasaTyaga[item.id] || false;
            return (
              <button
                key={item.id}
                onClick={() => toggleRasaTyaga(item.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all outline-none cursor-pointer ${
                  isObserved 
                    ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 shadow-sm" 
                    : "bg-white/50 dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 hover:border-amber-500/25"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider shrink-0 duration-300 ${isObserved ? 'bg-amber-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'}`}>
                    +{item.points} P
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-[11px] text-gray-900 dark:text-gray-100 leading-tight">
                    {item.name[lang]}
                  </h4>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium leading-normal mt-1">
                    {item.desc[lang]}
                  </p>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest mt-1 text-right ${isObserved ? 'text-amber-500' : 'text-gray-400 dark:text-gray-600'}`}>
                  {isObserved ? (lang === 'en' ? 'Renounced ✓' : 'त्याग स्वीकृत ✓') : (lang === 'en' ? 'Take Vow' : 'त्याग नियम')}
                </div>
              </button>
            );
          })}
        </div>
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
