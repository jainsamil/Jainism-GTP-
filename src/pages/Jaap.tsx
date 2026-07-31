import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Award, Play, Pause, Compass, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';

const MANTRAS = [
  { id: 'navkar', text: 'नमोकार महामंत्र', enText: 'Navkar Mahamantra', full: 'णमो अरिहंताणं णमो सिद्धाणं णमो आयरियाणं णमो उवज्झायाणं णमो लोए सव्वसाहूणं। एसा पंचणमोक्कारो सव्वपावप्पणासणो। मंगलाणं च सव्वेसिं पढमं हवइ मंगलं॥' },
  { id: 'om', text: 'ॐ नमः सिद्धम्', enText: 'Om Namah Siddham', full: 'ॐ नमः सिद्धम्' },
  { id: 'parshva', text: 'ॐ ह्रीं श्रीं पार्श्वनाथाय नमः', enText: 'Om Hreem Shreem Parshvanathaya Namah', full: 'ॐ ह्रीं श्रीं धरणीन्द्र पद्मावती सहित पार्श्वनाथाय नमः' },
  { id: 'mahavir', text: 'ॐ नमो भगवते महावीराय (वर्धमान)', enText: 'Om Namo Bhagavate Mahaviraya', full: 'ॐ ह्रीं श्रीं सन्मति वर्धमान जिनेन्द्राय नमः' },
];

export default function JaapPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0]);
  const [count, setCount] = useState(0);
  const [malas, setMalas] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingChant, setIsPlayingChant] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCounts, setTotalCounts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isAutoChanting, setIsAutoChanting] = useState(false);
  const [autoChantSpeed, setAutoChantSpeed] = useState(4); // seconds per bead interval
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    // Load persisted stats
    const savedCount = localStorage.getItem('jaap_total_count');
    const savedMalas = localStorage.getItem('jaap_total_malas');
    const savedStreak = localStorage.getItem('jaap_streak');
    const lastSession = localStorage.getItem('jaap_last_session');

    if (savedCount) setTotalCounts(parseInt(savedCount, 10));
    if (savedMalas) setMalas(parseInt(savedMalas, 10));
    
    // Calculate streak precisely by comparing dates
    if (savedStreak) {
      const parsedStreak = parseInt(savedStreak, 10);
      if (lastSession) {
        const todayStr = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastSession === todayStr || lastSession === yesterdayStr) {
          setStreak(parsedStreak);
        } else {
          setStreak(0); // Streak broken
        }
      } else {
        setStreak(0);
      }
    }
  }, []);

  // Audio synthethizer for meditative sound trigger without external assets
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Chime synthesize
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // High pitch pure bell tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("AudioContext failed or blocked by autoplay restrictions:", e);
    }
  };

  const playMalaCompleteSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Beautiful harmonic interval synthesizer for completion
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.4); // C5
      playTone(659.25, 0.15, 0.4); // E5
      playTone(783.99, 0.3, 0.6); // G5
      playTone(1046.50, 0.45, 0.8); // C6
    } catch (e) {
      console.warn(e);
    }
  };

  const incrementCount = (e?: React.MouseEvent<HTMLDivElement>) => {
    // Collect ripple coordinate
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
    } else {
      // Simulate central pulsing coordinates
      const newRipple = { id: Date.now(), x: 128, y: 128 };
      setRipples(prev => [...prev, newRipple]);
    }

    playBeep();

    const nextCount = count + 1;
    const nextTotal = totalCounts + 1;
    setCount(nextCount);
    setTotalCounts(nextTotal);
    localStorage.setItem('jaap_total_count', nextTotal.toString());

    // Streaks updates
    const todayStr = new Date().toDateString();
    localStorage.setItem('jaap_last_session', todayStr);
    
    if (streak === 0) {
      setStreak(1);
      localStorage.setItem('jaap_streak', '1');
    }

    // 108 Beads = 1 Mala complete
    if (nextCount >= 108) {
      const nextMalas = malas + 1;
      setMalas(nextMalas);
      localStorage.setItem('jaap_total_malas', nextMalas.toString());
      setCount(0);
      playMalaCompleteSound();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      // Update streak for active work
      const savedStreak = localStorage.getItem('jaap_streak') || '0';
      const parsedStreak = parseInt(savedStreak, 10) + 1;
      setStreak(parsedStreak);
      localStorage.setItem('jaap_streak', parsedStreak.toString());
    }
  };

  // Auto-Chant meditative companion loop
  useEffect(() => {
    let intervalId: any = null;
    if (isAutoChanting) {
      intervalId = setInterval(() => {
        incrementCount();
      }, autoChantSpeed * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoChanting, autoChantSpeed, count, totalCounts, malas, streak]);

  const handleReset = () => {
    setShowResetModal(true);
  };

  // Speaks out the mantra if enabled
  const toggleTTSChant = () => {
    if (isPlayingChant) {
      window.speechSynthesis.cancel();
      setIsPlayingChant(false);
    } else {
      window.speechSynthesis.cancel(); // Safety line to unblock any stuck synthesis
      setIsPlayingChant(true);
      const textToSpeak = selectedMantra.full;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.75;
      utterance.onend = () => setIsPlayingChant(false);
      
      // Auto-assign premium Google / neural / high-quality Hindi voice if available
      const allVoices = window.speechSynthesis.getVoices();
      const premiumVoice = allVoices.find(v => 
        (v.lang.startsWith('hi') || v.lang.startsWith('sa')) && 
        (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural'))
      ) || allVoices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
      
      if (premiumVoice) {
        utterance.voice = premiumVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-full pb-26 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 shadow-sm dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            {lang === 'en' ? 'JAAP COUNTER (MALA)' : 'जाप काउंटर (माला)'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Inline Translate / Language Switch button next to text as requested */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-9"
            title="Translate Language / भाषा बदलें"
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Symmetrical User Guide trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-350 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200 dark:border-white/10 h-9 w-9 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Jaap Section Guide' : 'जाप मार्गदर्शन पुस्तिका'}
          >
            ❓
          </button>

          {/* Sound enable button next to translator */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="p-2 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors cursor-pointer h-9 w-9 flex items-center justify-center shrink-0"
            title={soundEnabled ? "Mute Feedback" : "Enable Feedback"}
            id="btn-sound-toggle"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          {/* Reset/Retry button right after sound feedback */}
          <button 
            onClick={handleReset} 
            className="p-2 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer h-9 w-9 flex items-center justify-center shrink-0"
            title="Reset Current Mala"
            id="btn-reset-jaap"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/75 dark:bg-[#121212]/75 backdrop-blur-md rounded-2xl p-3 border border-gray-200/50 dark:border-white/5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{lang === 'en' ? 'Today Streak' : 'आज की निरंतरता'}</span>
          <div className="flex items-center justify-center gap-1">
            <Zap className="text-orange-500 fill-orange-500" size={14} />
            <span className="text-lg font-black text-gray-800 dark:text-white">{streak} {lang === 'en' ? 'Days' : 'दिन'}</span>
          </div>
        </div>
        
        <div className="bg-white/75 dark:bg-[#121212]/75 backdrop-blur-md rounded-2xl p-3 border border-gray-200/50 dark:border-white/5 text-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{lang === 'en' ? 'Mala Completes' : 'कुल पूर्ण माला'}</span>
          <div className="flex items-center justify-center gap-1">
            <Award className="text-yellow-500" size={14} />
            <span className="text-lg font-black text-orange-500 dark:text-yellow-400">{malas}</span>
          </div>
        </div>

        <div className="bg-white/75 dark:bg-[#121212]/75 backdrop-blur-md rounded-2xl p-3 border border-gray-200/50 dark:border-white/5 text-center shadow-sm relative group">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{lang === 'en' ? 'Total counts' : 'कुल जाप'}</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-lg font-black text-gray-800 dark:text-white">{totalCounts}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowResetModal(true);
              }}
              className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
              title={lang === 'en' ? "Reset Totals to 0" : "कुल जाप रीसेट करें"}
              id="btn-reset-totals"
            >
              <RotateCcw size={13} className="shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Mantra Selector */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md rounded-3xl p-5 border border-gray-200/50 dark:border-white/10 shadow-sm mb-6 relative overflow-hidden">
        <label className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest block mb-3">{lang === 'en' ? 'Select Spiritual Chanting Mantra' : 'आध्यात्मिक जाप मंत्र चुनें'}</label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {MANTRAS.map((m) => {
            const isSelected = selectedMantra.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMantra(m);
                  setCount(0);
                  window.speechSynthesis.cancel();
                  setIsPlayingChant(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black border-transparent shadow-[0_4px_12px_rgba(255,109,0,0.3)] scale-[1.03]' 
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {lang === 'en' ? m.enText : m.text}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#1A1A1A]/50 border border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[8px] font-black tracking-widest text-[#FF8A65] block mb-1 uppercase">{lang === 'en' ? 'MANTRA MEANING & PRONUNCIATION' : 'महामंत्र एवं अर्थ'}</span>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{selectedMantra.full}</p>
          </div>
          
          <button 
            onClick={toggleTTSChant}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md border ${
              isPlayingChant 
                ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                : 'bg-white dark:bg-[#121212] text-[#FF6D00] border-gray-100 dark:border-white/10 hover:scale-105'
            } transition-all`}
            title="Read Aloud"
          >
            {isPlayingChant ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Hands-Free Auto-Jaap Companion Control Centre */}
      <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 backdrop-blur-md rounded-3xl p-5 border border-orange-500/20 shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">
              {lang === 'en' ? 'HANDS-FREE AUTO-JAAP PILOT' : 'ऑटो-जाप सेवा (हैंड्स-फ्री)'}
            </span>
            <h3 className="text-base font-black text-gray-800 dark:text-white">
              {lang === 'en' ? 'Continuous Automatic Meditation' : 'निरंतर स्वचालित जाप सिम्युलेटर'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {lang === 'en' ? 'Chimes and increments virtual beads automatically at your chosen pace.' : 'आपके चुने अंतराल पर स्वचालित रूप से माला के मनके आगे बढ़ाता चलेगा।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Speed selection */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/5">
              {[2, 3, 4, 5, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setAutoChantSpeed(s)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                    autoChantSpeed === s
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={`${s} seconds interval`}
                >
                  {s}s
                </button>
              ))}
            </div>

            {/* Toggle State */}
            <button
              onClick={() => setIsAutoChanting(!isAutoChanting)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-sm border ${
                isAutoChanting
                  ? 'bg-red-500 hover:bg-red-600 text-white border-transparent animate-pulse'
                  : 'bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black border-transparent hover:scale-105'
              }`}
            >
              {isAutoChanting 
                ? (lang === 'en' ? 'STOP AUTO' : 'जाप रोकें') 
                : (lang === 'en' ? 'START AUTO' : 'ऑटो चालू करें')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Chanting Counter Dial */}
      <div className="flex flex-col items-center justify-center my-6 relative py-4">
        {/* Beads progress ring (108 golden beads - Sone K Moti) */}
        <div className="absolute inset-0 flex items-center justify-center max-w-full pointer-events-none">
          <div className="w-[310px] h-[310px] md:w-[350px] md:h-[350px] relative flex items-center justify-center">
            <svg 
              className="w-full h-full absolute transform -rotate-90 pointer-events-none" 
              viewBox="0 0 400 400"
            >
              <defs>
                {/* Inactive golden bead - rich brushed premium gold pearl texture */}
                <radialGradient id="gold-bead-inactive" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="40%" stopColor="#FFB300" />
                  <stop offset="75%" stopColor="#B38F00" />
                  <stop offset="100%" stopColor="#5D4037" />
                </radialGradient>

                {/* Active golden bead - highly polished, radiant shining gold pearl */}
                <radialGradient id="gold-bead-active" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="20%" stopColor="#FFF59D" />
                  <stop offset="50%" stopColor="#FFD54F" />
                  <stop offset="80%" stopColor="#FF8F00" />
                  <stop offset="100%" stopColor="#E65100" />
                </radialGradient>

                {/* Glowing aura filter for active/completed beads */}
                <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComponentTransfer in="blur" result="brightBlur">
                    <feFuncA type="linear" slope="2"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="brightBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* A beautiful solid golden thread connecting all the pearls (Suvarna Sutra) */}
              <circle 
                cx="200" 
                cy="200" 
                r="182" 
                fill="none" 
                stroke="url(#gold-bead-active)" 
                strokeWidth="2" 
                className="opacity-70" 
                filter="url(#gold-glow)"
              />

              {/* Render 108 auspicious golden beads */}
              {Array.from({ length: 108 }).map((_, idx) => {
                // To start from the top, our angle goes clockwise from 0 to 360
                const angle = (idx * 360) / 108;
                const angleRad = (angle * Math.PI) / 180;
                const cx = 200 + 182 * Math.cos(angleRad);
                const cy = 200 + 182 * Math.sin(angleRad);

                const isCompleted = idx < count;
                const isCurrent = idx === count;

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={isCurrent ? 7.5 : isCompleted ? 6 : 5}
                    fill={isCompleted || isCurrent ? "url(#gold-bead-active)" : "url(#gold-bead-inactive)"}
                    filter={isCompleted || isCurrent ? "url(#gold-glow)" : "none"}
                    stroke={isCurrent ? "#FF3D00" : isCompleted ? "#FFD54F" : "#AA7C11"}
                    strokeWidth={isCurrent ? 1.8 : 0.8}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Outer Circular Trigger */}
        <div 
          onClick={incrementCount}
          className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-white dark:bg-[#121212] flex flex-col items-center justify-center relative cursor-pointer border-4 border-orange-200 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(255,109,0,0.15)] active:scale-95 group overflow-hidden transition-all duration-300"
        >
          {/* Animated pulsing wave inside */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-orange-100/30 to-yellow-100/20 dark:from-[#FF6D00]/10 dark:to-[#FFD54F]/5 animate-pulse" />
          
          {/* Audio ripples rendering */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-orange-400/30 dark:bg-[#FF6D00]/30 rounded-full animate-ping pointer-events-none"
              style={{
                left: ripple.x - 40,
                top: ripple.y - 40,
                width: 80,
                height: 80,
                animationDuration: '0.8s'
              }}
              onAnimationEnd={() => {
                setRipples(prev => prev.filter(r => r.id !== ripple.id));
              }}
            />
          ))}

          {/* Core Content */}
          <div className="relative z-15 text-center flex flex-col items-center select-none px-6">
            <Sparkles className="text-orange-500 dark:text-[#FFD54F] animate-bounce mb-3 opacity-90" size={26} />
            
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#FF6D00]/80 dark:text-[#FFD54F]/80 mb-2">
              {lang === 'en' ? 'TAP TO CHANT' : 'जाप करने हेतु छुएं'}
            </p>
            
            <span className="text-5xl md:text-6xl font-display font-black text-gray-800 dark:text-white mb-2 leading-none">
              {count}
            </span>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                / 108 {lang === 'en' ? 'BEADS' : 'मनके'}
              </span>
            </div>
          </div>
        </div>

        {/* Mala Bead Visualization Ring (Progress circle mockup dots) */}
        <div className="mt-8 text-center bg-white/60 dark:bg-[#121212]/60 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-gray-200/50 dark:border-white/5 flex items-center gap-2">
          <Compass className="text-orange-500 animate-[spin_10s_linear_infinite]" size={16} />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {lang === 'en' ? `Bead ${count} of 108 on Virtual Mala ${malas + 1}` : `माला ${malas + 1} पर मणिका ${count}/108`}
          </span>
        </div>
      </div>

      {/* Completion Dialog Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-x-6 top-1/4 z-50 bg-[#121212] border-2 border-yellow-500 p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,213,79,0.3)] text-center text-white"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black shadow-lg">
              <Award size={36} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-white mb-1">
              {lang === 'en' ? 'MALA COMPLETED!' : 'माला समापन!'}
            </h2>
            <p className="text-xs text-orange-400 tracking-wider font-extrabold uppercase mb-4">
              108 Divine Mantras Chanted
            </p>
            <p className="text-sm text-gray-300 font-medium">
              {lang === 'en' 
                ? 'May this spiritual vibration bring peace, clarity, and karma-cleansing waves to your life.' 
                : 'यह दिव्य जाप आपके जीवन में शांति, स्पष्टता और कर्म-निक्षेपण लेकर आए।'}
            </p>
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
                {lang === 'en' ? 'Welcome to Sacred Jaap & Mala Room!' : 'पवित्र जाप कक्ष में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'A fully-featured self-meditation chamber with local persistence to track your spiritual commitments:' 
                  : 'यह आधुनिक जाप काउंटर आपको शुद्ध अंतःकरण से घर बैठे स्वाध्याय और जाप करने की सुविधा देता है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Tap To Count:' : 'जाप क्रिया:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Simply click or touch inside the large concentric central circle to advance the bead counter. Mechanical sound effects provide feedback.' 
                    : 'केंद्र में दिए गए आकर्षक "जाप करें" चक्र पर कहीं भी क्लिक या स्पर्श करें। मणिका अपने आप आगे बढ़ेगी।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Mala Completes:' : 'माला पूर्णता प्रणाली:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Reaching 108 beads will automatically reset your current bead and compile 1 complete Mala with a sweet chiming sound celebration.'
                    : 'प्रत्येक १०८ जाप पूर्ण होने पर एक माला (माला संख्या +१) दर्ज होगी और मधुर घंटा ध्वनि से पूर्णता घोषित होगी।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Text to Speech Chant:' : 'स्व-जाप स्वर सहायक (TTS):'}</strong>{' '}
                  {lang === 'en'
                    ? 'Click on the text speaker icon to hear high quality native Hindi vocalizations of the Navkar mantra and stay in sync.'
                    : 'ऊपर दिए स्पीकर आइकॉन का उपयोग कर मंत्र का शुद्ध आध्यात्मिक उच्चारण सुनें, तथा साथ-साथ जाप का अभ्यास बनाए रखें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Auto-Chant Timer:' : 'ऑटो-जाप गति विन्यास:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Enable Auto Chant block to simulate natural bead advancements automatically every few seconds.'
                    : 'जाप चक्र के नीचे "ऑटो-जाप प्रारंभ" का विकल्प खोलकर गति तय कर सकते हैं जिससे जाप चक्र स्वतः अंतराल पर आगे बढ़ेगा।'}
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

      {/* Dynamic Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-350 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2.5rem] w-full max-w-sm p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center shadow-lg">
              <RotateCcw size={28} className="animate-spin-slow" />
            </div>

            <h2 className="text-xl font-display font-black text-white mb-2 uppercase tracking-wide">
              {lang === 'en' ? 'RESET JAAP OPTIONS' : 'जाप रीसेट विकल्प'}
            </h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              {lang === 'en' 
                ? 'Please select the type of reset you want to perform on your spiritual chanting log.' 
                : 'कृपया उस रीसेट विकल्प को चुनें जिसे आप सक्रिय करना चाहते हैं।'}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setCount(0);
                  setShowResetModal(false);
                }}
                className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl text-xs font-semibold border border-white/10 cursor-pointer transition-all hover:scale-101 active:scale-99"
              >
                {lang === 'en' ? 'Reset Only Current Bead Count to 0' : 'केवल वर्तमान माला संख्या (Beads) रीसेट करें'}
              </button>

              <button
                onClick={() => {
                  setCount(0);
                  setTotalCounts(0);
                  setMalas(0);
                  setStreak(0);
                  localStorage.removeItem('jaap_total_count');
                  localStorage.removeItem('jaap_total_malas');
                  localStorage.removeItem('jaap_streak');
                  localStorage.removeItem('jaap_last_session');
                  setShowResetModal(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-101 active:scale-99 shadow-lg shadow-red-500/10"
              >
                {lang === 'en' ? 'Reset Everything (Totals, Malas, Streaks)' : 'सभी डेटा रीसेट करें (माला, कुल जाप, श्रृंखला)'}
              </button>

              <button
                onClick={() => setShowResetModal(false)}
                className="w-full bg-transparent hover:bg-white/5 text-gray-500 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
              >
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="jaap" />
    </div>
  );
}
