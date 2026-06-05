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
    const resetBeads = window.confirm(lang === 'en' ? 'Do you want to reset current Mala beads count?' : 'क्या आप वर्तमान माला जाप संख्या (Beads Count) रीसेट करना चाहते हैं?');
    if (resetBeads) {
      setCount(0);
      
      const resetAll = window.confirm(lang === 'en' ? 'Do you also want to completely clear and reset all lifetime totals and completed malas to 0?' : 'क्या आप कुल सामूहिक जाप (All Lifetime Totals - 13) और माला संख्या को भी बिल्कुल शून्य (0) करना चाहते हैं?');
      if (resetAll) {
        setCount(0);
        setTotalCounts(0);
        setMalas(0);
        setStreak(0);
        localStorage.removeItem('jaap_total_count');
        localStorage.removeItem('jaap_total_malas');
        localStorage.removeItem('jaap_streak');
        localStorage.removeItem('jaap_last_session');
      }
    }
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
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* FIXED TOP RIGHT TRANSLATOR WIDGET */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 px-4.5 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-lg rounded-full flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30"
        title="Translate Language / भाषा बदलें"
      >
        <Globe size={15} className="animate-spin-slow" />
        <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
      </button>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 shadow-sm dark:shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            {lang === 'en' ? 'JAAP COUNTER (MALA)' : 'जाप काउंटर (माला)'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="p-2.5 rounded-full bg-white/80 dark:bg-[#121212]/80 border border-gray-200 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
            title={soundEnabled ? "Mute Feedback" : "Enable Feedback"}
            id="btn-sound-toggle"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <button 
            onClick={handleReset} 
            className="p-2.5 rounded-full bg-white/80 dark:bg-[#121212]/80 border border-gray-200 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Reset Current Mala"
            id="btn-reset-jaap"
          >
            <RotateCcw size={18} />
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
                const resetAll = window.confirm(lang === 'en' ? 'Do you want to completely reset and clear your total counts and malas back to 0?' : 'क्या आप अपने कुल जाप (Total counts) और मालाओं की संख्या को पूर्ण रूप से शून्य (0) करना चाहते हैं?');
                if (resetAll) {
                  setCount(0);
                  setTotalCounts(0);
                  setMalas(0);
                  setStreak(0);
                  localStorage.removeItem('jaap_total_count');
                  localStorage.removeItem('jaap_total_malas');
                  localStorage.removeItem('jaap_streak');
                  localStorage.removeItem('jaap_last_session');
                }
              }}
              className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
              title={lang === 'en' ? "Reset Totals to 0" : "कुल जाप शून्य करें"}
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
        {/* Beads progress ring (108 beads) */}
        <div className="absolute inset-0 flex items-center justify-center max-w-full pointer-events-none">
          <div className="w-[310px] h-[310px] md:w-[350px] md:h-[350px] rounded-full border-4 border-dashed border-gray-200 dark:border-white/10 animate-[spin_120s_linear_infinite]" />
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

      <SectionAiAgent section="jaap" />
    </div>
  );
}
