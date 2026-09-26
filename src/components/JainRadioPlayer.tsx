import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio, Minimize2, Maximize2, Music, Sparkles, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface RadioStation {
  id: string;
  nameHi: string;
  nameEn: string;
  descHi: string;
  descEn: string;
  icon: string;
  ambientFreq: number; // Hz for harmonic meditation drone
  chimeNote: number; // Hz
}

const STATIONS: RadioStation[] = [
  {
    id: 'navkar',
    nameHi: 'णमोकार महामंत्र अखंड जाप',
    nameEn: 'Eternal Navkar Mahamantra',
    descHi: 'पंच परमेष्ठी स्मरण • सर्व विघ्न नाशक शांति धुन',
    descEn: 'Sacred chanting and harmonic meditation',
    icon: '🕉️',
    ambientFreq: 136.1, // Om vibration
    chimeNote: 432
  },
  {
    id: 'bhaktamar',
    nameHi: 'भक्तामर दिव्य तरंग (४८ श्लोक)',
    nameEn: 'Bhaktamar Divine Vibrations',
    descHi: 'आदिनाथ प्रभु स्तुति • रिद्धि-सिद्धि प्रदायक',
    descEn: 'Healing resonance of 48 Bhaktamar verses',
    icon: '✨',
    ambientFreq: 174, // Solfeggio healing
    chimeNote: 528
  },
  {
    id: 'veetrag',
    nameHi: 'वीतराग शांत रस ध्यान',
    nameEn: 'Veetrag Silent Meditation',
    descHi: 'आत्मलीनता • समयसार व जिनवाणी मधुर धुन',
    descEn: 'Deep inner peace and contemplation',
    icon: '🌸',
    ambientFreq: 108,
    chimeNote: 396
  }
];

export default function JainRadioPlayer() {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<any>(null);

  const currentStation = STATIONS[currentStationIndex];

  // Stop web audio synthesizer
  const stopAudio = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  };

  // Harmonious ambient synthesizer with temple bell chimes
  const startAudio = () => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Warm root drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(currentStation.ambientFreq, ctx.currentTime);
      osc1.connect(masterGain);
      osc1.start();
      osc1Ref.current = osc1;

      // Fifth harmonic drone (pure resonance)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(currentStation.ambientFreq * 1.5, ctx.currentTime);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.5, ctx.currentTime);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start();
      osc2Ref.current = osc2;

      // Gentle temple singing bowl chime every 7 seconds
      const playTempleBell = () => {
        if (!audioCtxRef.current || isMuted) return;
        const c = audioCtxRef.current;
        const bellOsc = c.createOscillator();
        const bellGain = c.createGain();
        bellOsc.type = 'triangle';
        bellOsc.frequency.setValueAtTime(currentStation.chimeNote, c.currentTime);
        bellOsc.frequency.exponentialRampToValueAtTime(currentStation.chimeNote * 0.99, c.currentTime + 3.5);
        bellGain.gain.setValueAtTime(volume * 0.25, c.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 4.5);
        bellOsc.connect(bellGain);
        bellGain.connect(c.destination);
        bellOsc.start();
        bellOsc.stop(c.currentTime + 4.5);
      };

      playTempleBell();
      timerRef.current = setInterval(playTempleBell, 7000);
    } catch (e) {
      console.warn("Jain Radio audio context:", e);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying, currentStationIndex]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  if (!showPlayer) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-[99] max-w-sm pointer-events-auto select-none print:hidden">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={cn(
            "p-3 rounded-full shadow-2xl border transition-all duration-300 flex items-center gap-2.5 backdrop-blur-md cursor-pointer",
            isPlaying 
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400/50 shadow-amber-600/30 animate-pulse" 
              : "bg-white/90 dark:bg-[#18181b]/90 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-amber-500/40"
          )}
          title={language === 'en' ? 'Jain Spiritual Radio' : '२४x७ जैन भक्ति रेडियो'}
        >
          <Radio size={18} className={isPlaying ? "animate-spin" : ""} />
          <span className="text-xs font-black tracking-wide pr-1">
            {isPlaying ? (language === 'en' ? 'Live Radio' : 'रेडियो चालू') : (language === 'en' ? 'Jain Radio' : 'जैन रेडियो')}
          </span>
          <span className="text-xs">{currentStation.icon}</span>
        </button>
      ) : (
        <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-xl border-2 border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl w-80 space-y-3.5 text-gray-900 dark:text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-150 dark:border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Radio size={16} />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                  २४x७ Live Radio
                </span>
                <h4 className="text-xs font-black">
                  {language === 'en' ? 'Jain Spiritual Radio' : 'वीतराग जिनवाणी रेडियो'}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 cursor-pointer"
                title="Minimize"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={() => {
                  stopAudio();
                  setIsPlaying(false);
                  setShowPlayer(false);
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-gray-400 cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Active Station Info */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentStation.icon}</span>
              <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                {language === 'en' ? currentStation.nameEn : currentStation.nameHi}
              </span>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium pl-6">
              {language === 'en' ? currentStation.descEn : currentStation.descHi}
            </p>
          </div>

          {/* Station Switcher Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {STATIONS.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setCurrentStationIndex(idx)}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-[10px] font-black whitespace-nowrap transition-all cursor-pointer border",
                  currentStationIndex === idx
                    ? "bg-amber-600 text-white border-transparent shadow-sm"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-transparent hover:border-amber-500/30"
                )}
              >
                {st.icon} {st.nameHi.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Controls: Play/Pause, Volume */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-150 dark:border-white/10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                "px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer",
                isPlaying
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/20 scale-102"
              )}
            >
              {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
              <span>{isPlaying ? (language === 'en' ? 'Pause' : 'विश्राम') : (language === 'en' ? 'Play' : 'प्रारंभ करें')}</span>
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:text-amber-600 cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
