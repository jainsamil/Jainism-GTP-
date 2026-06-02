import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Volume2, Sparkles, Heart, HeartOff, HelpCircle, CheckCircle2, ChevronRight, Play, Pause, Bookmark, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { BHAKTAMAR_DATA, ShlokaData } from '../data/bhaktamarData';
import SectionAiAgent from '../components/SectionAiAgent';

export default function BhaktamarPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();

  const [selectedShloka, setSelectedShloka] = useState<ShlokaData>(BHAKTAMAR_DATA[0]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [completedList, setCompletedList] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState<'hindi' | 'english' | 'remedy' | 'jap'>('hindi');

  // Jap / Mala Counter States
  const [japTarget, setJapTarget] = useState<number>(9); // 9, 27, or 108 times
  const [japCount, setJapCount] = useState<number>(0);
  const [japCompleted, setJapCompleted] = useState<boolean>(false);

  // Load favorites and completed from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bhaktamar_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    const savedCompleted = localStorage.getItem('bhaktamar_completed');
    if (savedCompleted) {
      try {
        setCompletedList(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync to local storage on change
  const handleToggleFavorite = (num: number) => {
    const updated = favorites.includes(num)
      ? favorites.filter(id => id !== num)
      : [...favorites, num];
    setFavorites(updated);
    localStorage.setItem('bhaktamar_favorites', JSON.stringify(updated));
  };

  const handleToggleCompleted = (num: number) => {
    const updated = completedList.includes(num)
      ? completedList.filter(id => id !== num)
      : [...completedList, num];
    setCompletedList(updated);
    localStorage.setItem('bhaktamar_completed', JSON.stringify(updated));
  };

  // Authentic Audio Streaming Controller Setup
  useEffect(() => {
    const audio = new Audio();
    audioInstanceRef.current = audio;

    const handlePlay = () => setIsPlayingAudio(true);
    const handlePause = () => setIsPlayingAudio(false);
    const handleEnded = () => setIsPlayingAudio(false);
    const handleTimeUpdate = () => setAudioTime(audio.currentTime);
    const handleDurationChange = () => setAudioDuration(audio.duration || 0);
    const handleLoadStart = () => {
      setAudioLoading(true);
      setAudioError(null);
    };
    const handleCanPlay = () => {
      setAudioLoading(false);
    };
    const handleError = (e: any) => {
      console.error("Bhaktamar audio loading error:", e);
      setAudioLoading(false);
      setAudioError("Primary stotra stream offline. Switching to standby relaxation stream...");
      
      const standbyUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
      setTimeout(() => {
        if (audioInstanceRef.current) {
          audioInstanceRef.current.src = standbyUrl;
          audioInstanceRef.current.load();
          const playPromise = audioInstanceRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              if (err.name === 'AbortError') {
                console.log("Standby play aborted gracefully.");
              } else {
                console.error("Standby play failed:", err);
                setAudioError("Standby playback failed.");
              }
            });
          }
        }
      }, 1000);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Load authentic complete Bhaktamar Stotra audio
    audio.src = "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3";
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audioInstanceRef.current = null;
    };
  }, []);

  const toggleBhaktamarPlay = () => {
    const audio = audioInstanceRef.current;
    if (!audio) return;
    if (isPlayingAudio) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name === 'AbortError') {
            console.log("Bhaktamar play request aborted gracefully.");
          } else {
            console.error("Bhaktamar audio active trigger error:", err);
          }
        });
      }
    }
  };

  const handleSeek = (time: number) => {
    const audio = audioInstanceRef.current;
    if (audio) {
      audio.currentTime = time;
      setAudioTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            BHAKTAMAR HEALING
          </h1>
        </div>
      </header>

      {/* Intro info box */}
      <div className="mb-6 bg-[#FF6D00]/10 rounded-3xl p-5 border border-orange-200/50 dark:border-white/5 flex items-start gap-4">
        <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0 text-orange-500">
          <Sparkles className="animate-pulse" size={20} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase text-orange-500 tracking-wider block mb-0.5">{lang === 'en' ? 'HEALING STOTRA' : 'महाकल्याणकारी भक्तामर स्तोत्र'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {lang === 'en' 
              ? "Bhaktamar Stotra, composed by Acharya Manatunga, is respected for curing emotional, mental, and bodily ailments. Each stanza below contains active Riddhis and specific cosmic benefits."
              : "आचार्य मानतुंग विरचित ४८ काव्यों वाला यह स्तोत्र चमत्कारी आरोग्य शक्ति युक्त माना जाता है। सभी काव्यों के विशिष्ट लाभ एवं ऋद्धि मंत्र निम्न रूप में दिए गए हैं।"}
          </p>
        </div>
      </div>

      {/* Selector wheel / slider */}
      <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">{lang === 'en' ? 'Navigate High Healing Verses' : 'महाप्रभावकारी काव्य संख्या चुनें'}</label>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6 border-none shadow-none outline-none">
        {BHAKTAMAR_DATA.map(st => {
          const isSelected = selectedShloka.number === st.number;
          const isDone = completedList.includes(st.number);
          return (
            <button
              key={st.number}
              onClick={() => {
                setSelectedShloka(st);
              }}
              className={`px-4.5 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 border relative cursor-pointer ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black border-transparent shadow-[0_4px_15px_rgba(255,109,0,0.3)] scale-[1.05]' 
                  : 'bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5'
              }`}
            >
              <span>Verse {st.number}</span>
              {isDone && <CheckCircle2 size={12} className={isSelected ? "text-black fill-transparent" : "text-orange-500 fill-transparent"} />}
            </button>
          );
        })}
      </div>

      {/* Main Devotional Player Board */}
      <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-md mb-6 relative overflow-hidden">
        {/* Subtle mandala outline bg */}
        <div className="absolute inset-0 bg-mandala opacity-10 pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1 bg-orange-500/10 rounded-full px-3 py-1 font-black text-[#FF6D00] text-[9px] uppercase tracking-wider">
            <Bookmark size={10} />
            <span>{lang === 'en' ? `VERSE ${selectedShloka.number} ACTIVE` : `काव्य क्र. ${selectedShloka.number}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleToggleFavorite(selectedShloka.number)} 
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                favorites.includes(selectedShloka.number) 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                  : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500'
              }`}
              id="favorite-btn"
            >
              <Heart size={16} className={favorites.includes(selectedShloka.number) ? "fill-red-500" : ""} />
            </button>
            <button 
              onClick={() => handleToggleCompleted(selectedShloka.number)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                completedList.includes(selectedShloka.number)
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 font-bold'
                  : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 hover:text-orange-500'
              }`}
              id="completed-btn"
            >
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>

        {/* Sanskrit shloka reading panel */}
        <div className="text-center py-4 border-b border-gray-100 dark:border-white/5 relative z-10">
          <h2 className="text-xl md:text-2xl font-serif font-bold leading-relaxed text-gray-950 dark:text-gray-100 max-w-lg mx-auto italic select-text">
            {selectedShloka.sanskrit}
          </h2>

          <div className="mt-6 flex flex-col items-center justify-center p-4 bg-orange-500/5 dark:bg-orange-500/10 rounded-2xl border border-orange-500/10 max-w-md mx-auto relative z-10">
            <div className="flex items-center gap-3 w-full justify-between mb-3">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest flex items-center gap-1">
                <Volume2 size={12} className="animate-pulse" />
                {lang === 'en' ? 'Authentic Stotra Audio' : 'उच्च-गुणवत्ता वास्तविक स्वर पाठ'}
              </span>
              {audioLoading && (
                <span className="text-[9px] font-bold bg-[#FF6D00]/20 text-[#FFD54F] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Loader2 size={10} className="animate-spin" /> Loading...
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 w-full">
              <button 
                onClick={toggleBhaktamarPlay}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border cursor-pointer shrink-0 transition-transform hover:scale-105 ${
                  isPlayingAudio 
                    ? 'bg-orange-500 border-orange-400 text-white animate-pulse' 
                    : 'bg-white dark:bg-white/10 border-orange-500/20 text-[#FF6D00]'
                }`}
                id="shloka-play-btn"
              >
                {isPlayingAudio ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-[#FF6D00] ml-0.5" />}
              </button>

              <div className="flex-1">
                {audioError ? (
                  <p className="text-[11px] text-amber-500 font-bold animate-pulse leading-normal">{audioError}</p>
                ) : (
                  <div className="space-y-1">
                    <input 
                      type="range"
                      min={0}
                      max={audioDuration || 100}
                      value={audioTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF6D00] outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                      <span>{formatTime(audioTime)}</span>
                      <span>{formatTime(audioDuration)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translation tabs selector */}
        <div className="flex border-b border-gray-150 dark:border-white/5 gap-4 py-3 text-xs relative z-10 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('hindi')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
              activeTab === 'hindi' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-hindi"
          >
            {lang === 'en' ? 'Hindi translation' : 'हिंदी भावार्थ'}
          </button>
          <button 
            onClick={() => setActiveTab('english')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
              activeTab === 'english' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-english"
          >
            {lang === 'en' ? 'English Meaning' : 'अंग्रेजी अर्थ'}
          </button>
          <button 
            onClick={() => setActiveTab('remedy')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
              activeTab === 'remedy' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-remedy"
          >
            {lang === 'en' ? 'Healing & Riddhi' : 'ऋद्धि एवं सिद्धि लाभ'}
          </button>
          <button 
            onClick={() => setActiveTab('jap')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors cursor-pointer ${
              activeTab === 'jap' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-jap"
          >
            {lang === 'en' ? 'Jap Counter (Mala)' : 'जाप माला काउंटर'}
          </button>
        </div>

        {/* Tab content space */}
        <div className="py-4 relative z-10 text-xs leading-relaxed font-semibold text-gray-700 dark:text-gray-300">
          {activeTab === 'hindi' && (
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedShloka.hindi}</p>
          )}
          {activeTab === 'english' && (
            <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed font-medium">{selectedShloka.english}</p>
          )}
          {activeTab === 'remedy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1.5 uppercase">{lang === 'en' ? 'SPECIFIC HEALING REMEDY BENEFIT' : 'काव्य प्रभाव / चमत्कारी निवारण'}</span>
                <p className="font-bold text-gray-900 dark:text-white text-xs">
                  {lang === 'en' ? selectedShloka.benefit.en : selectedShloka.benefit.hi}
                </p>
              </div>

              <div className="p-3.5 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-2xl">
                <span className="text-[8px] font-black tracking-widest text-green-500 block mb-1.5 uppercase">{lang === 'en' ? 'ASSOCIATED RIDDHI MANTRA' : 'विशिष्ट ऋद्धि सिद्ध महामंत्र'}</span>
                <p className="font-bold text-green-600 dark:text-green-400 font-mono text-xs select-all">
                  {selectedShloka.riddhi}
                </p>
              </div>
            </div>
          )}
          {activeTab === 'jap' && (
            <div className="space-y-4 text-center animate-in duration-300">
              <span className="text-[9px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">
                {lang === 'en' ? 'Jap/Mala Repetitions Target' : 'जाप संख्या लक्ष्य चुनें'}
              </span>
              
              <div className="flex justify-center gap-3 mb-4">
                {[9, 27, 108].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setJapTarget(num);
                      setJapCount(0);
                      setJapCompleted(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      japTarget === num
                        ? 'bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-md'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5'
                    }`}
                  >
                    {num} {lang === 'en' ? 'reps' : 'जाप'}
                  </button>
                ))}
              </div>

              {/* Circular Jap Bead Progress Ring */}
              <div className="flex flex-col items-center justify-center my-6">
                <button
                  type="button"
                  onClick={() => {
                    if (japCount < japTarget) {
                      const nextCount = japCount + 1;
                      setJapCount(nextCount);
                      if (nextCount === japTarget) {
                        setJapCompleted(true);
                      }
                    }
                  }}
                  disabled={japCompleted}
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                    japCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_20px_rgba(76,175,80,0.4)] text-white'
                      : 'bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F]/80 hover:scale-105 active:scale-95 shadow-[0_6px_20px_rgba(255,109,0,0.3)] text-black'
                  }`}
                  id="bead-increment-btn"
                >
                  {japCompleted ? (
                    <div className="text-center">
                      <CheckCircle2 size={32} className="mx-auto mb-1 text-white fill-transparent font-black" />
                      <span className="text-[10px] font-black uppercase tracking-widest block">{lang === 'en' ? 'Completed' : 'जाप पूर्ण'}</span>
                    </div>
                  ) : (
                    <div className="text-center text-black">
                      <span className="text-3xl font-black">{japCount}</span>
                      <span className="text-[10px] font-bold block mt-1 uppercase text-black/70 flex items-center justify-center gap-0.5">/ {japTarget}</span>
                    </div>
                  )}
                </button>
                
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black tracking-wider mt-4 leading-relaxed uppercase">
                  {lang === 'en' ? 'Tap the bead to count your recitation.' : 'जाप मणी पर स्पर्श कर गिनती दर्ज करें।'}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setJapCount(0);
                    setJapCompleted(false);
                  }}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-gray-200 dark:border-white/5 cursor-pointer"
                  id="reset-jap-btn"
                >
                  {lang === 'en' ? 'Reset Counter' : 'पुनः सेट'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SectionAiAgent section="bhaktamar" />
    </div>
  );
}





