import { useState, useEffect, useRef } from 'react';
import { 
  Flame, Award, Timer, Trophy, RotateCcw, Volume2, 
  VolumeX, HelpCircle, ArrowRight, CheckCircle2, XCircle, 
  AlertTriangle, ShieldCheck, Star, Users, ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  GYAN_DEEPAK_QUESTIONS_POOL, 
  GYAN_DEEPAK_PRIZE_LADDER, 
  GyanDeepakQuestion 
} from '../../data/jainGamesData';

// Simulated authentic leaderboard matching screenshot 6
const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Chandanbala Jain', qLevel: 'Q12', date: '28 सित', score: 32000, avatar: 'C' },
  { rank: 2, name: 'Dinendra', qLevel: 'Q9', date: '28 सित', score: 1000, avatar: 'D' },
  { rank: 3, name: 'Alka Banakiya', qLevel: 'Q7', date: '28 सित', score: 1000, avatar: 'A' },
  { rank: 4, name: 'Gyani Shravak', qLevel: 'Q7', date: '28 सित', score: 1000, avatar: 'G' },
  { rank: 5, name: 'Aarti Mutha', qLevel: 'Q5', date: '28 सित', score: 1000, avatar: 'A' },
  { rank: 6, name: 'Praveen Jain', qLevel: 'Q5', date: '28 सित', score: 1000, avatar: 'P' },
];

export default function GyanDeepakGame({ onBack }: { onBack?: () => void }) {
  const { language } = useLanguage();
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'game_over' | 'won'>('welcome');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<GyanDeepakQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lockedOption, setLockedOption] = useState<number | null>(null);
  const [revealResult, setRevealResult] = useState<boolean>(false);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [safeHavenScore, setSafeHavenScore] = useState<number>(0);
  
  // Lifelines
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineSwapUsed, setLifelineSwapUsed] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Leaderboard tab
  const [leaderboardTab, setLeaderboardTab] = useState<'week' | 'month' | 'all'>('week');

  const timerRef = useRef<any>(null);

  // Audio synthesis for KBC vibes
  const playTone = (freq: number, duration: number = 0.2, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Pick question for level
  const pickQuestionForLevel = (lvl: number, excludeId?: string): GyanDeepakQuestion => {
    const pool = GYAN_DEEPAK_QUESTIONS_POOL[lvl] || GYAN_DEEPAK_QUESTIONS_POOL[1];
    const available = excludeId ? pool.filter(q => q.id !== excludeId) : pool;
    if (available.length === 0) return pool[0];
    return available[Math.floor(Math.random() * available.length)];
  };

  // Start new game
  const startGame = () => {
    setCurrentLevel(1);
    setEarnedScore(0);
    setSafeHavenScore(0);
    setLifeline5050Used(false);
    setLifelineSwapUsed(false);
    setEliminatedOptions([]);
    setSelectedOption(null);
    setLockedOption(null);
    setRevealResult(false);

    const q = pickQuestionForLevel(1);
    setCurrentQuestion(q);
    setTimeLeft(q.timeSeconds);
    setGameState('playing');
    playTone(523, 0.4); // C5 start chime
  };

  // Question Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || lockedOption !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 6) {
          playTone(440, 0.08, 'triangle'); // Urgent tick
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, lockedOption, currentLevel]);

  // Timeout handler
  const handleTimeOut = () => {
    playTone(220, 0.6, 'sawtooth');
    setGameState('game_over');
  };

  // Lock answer
  const handleSelectOption = (idx: number) => {
    if (lockedOption !== null || !currentQuestion) return;
    setSelectedOption(idx);
    setLockedOption(idx);
    playTone(587, 0.3); // Lock suspense chime

    // After 2.5 seconds of suspense, reveal result!
    setTimeout(() => {
      setRevealResult(true);
      const isCorrect = idx === currentQuestion.answer;

      if (isCorrect) {
        playTone(880, 0.5); // Success chime
        const currentPoints = GYAN_DEEPAK_PRIZE_LADDER.find(p => p.level === currentLevel)?.points || 0;
        setEarnedScore(currentPoints);

        // Update safe haven padav
        if (currentLevel === 5) setSafeHavenScore(1000);
        if (currentLevel === 10) setSafeHavenScore(32000);

        if (currentLevel === 15) {
          // WON 10 LAKH!
          setTimeout(() => {
            setGameState('won');
          }, 2000);
        } else {
          // Next level after 2 seconds
          setTimeout(() => {
            const nextLvl = currentLevel + 1;
            setCurrentLevel(nextLvl);
            setSelectedOption(null);
            setLockedOption(null);
            setRevealResult(false);
            setEliminatedOptions([]);
            const nextQ = pickQuestionForLevel(nextLvl);
            setCurrentQuestion(nextQ);
            setTimeLeft(nextQ.timeSeconds);
          }, 2200);
        }
      } else {
        // Wrong answer
        playTone(180, 0.7, 'sawtooth'); // Wrong buzzer
        setTimeout(() => {
          setGameState('game_over');
        }, 2200);
      }
    }, 2000);
  };

  // 50:50 Lifeline
  const handleUse5050 = () => {
    if (lifeline5050Used || lockedOption !== null || !currentQuestion) return;
    setLifeline5050Used(true);
    playTone(659, 0.2);

    const wrongIndices = [0, 1, 2, 3].filter(idx => idx !== currentQuestion.answer);
    // Pick 2 random wrong options to eliminate
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions([shuffledWrong[0], shuffledWrong[1]]);
  };

  // Swap Question Lifeline
  const handleUseSwap = () => {
    if (lifelineSwapUsed || lockedOption !== null || !currentQuestion) return;
    setLifelineSwapUsed(true);
    playTone(659, 0.2);

    const newQ = pickQuestionForLevel(currentLevel, currentQuestion.id);
    setCurrentQuestion(newQ);
    setTimeLeft(newQ.timeSeconds);
    setSelectedOption(null);
    setEliminatedOptions([]);
  };

  // Quit / Walk away with earned points
  const handleQuitGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('game_over');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Bar matching screenshot 5 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            {language === 'en' ? 'JAIN KBC' : 'ज्ञान दीपक'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* ==================== WELCOME SCREEN (MATCHING SCREENSHOT 5) ==================== */}
      {gameState === 'welcome' && (
        <div className="space-y-6">
          {/* Hero Diya Logo */}
          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-28 h-28 rounded-full bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center mb-4 relative">
              <div className="w-20 h-20 rounded-full bg-[#181510] border-2 border-amber-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="text-4xl animate-pulse">🪔</span>
              </div>
            </div>

            <h1 className="text-3xl font-serif font-black text-gray-900 dark:text-white">
              {language === 'en' ? 'Gyan Deepak' : 'ज्ञान दीपक'}
            </h1>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
              {language === 'en' ? 'Gyan Deepak • Who Will Become A Scholar?' : 'ज्ञान दीपक • कौन बनेगा ज्ञानी?'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {language === 'en' ? '15 Questions • Jain Wisdom • One Hot Seat' : '१५ सवाल • जैन ज्ञान • एक हॉट सीट'}
            </p>
          </div>

          {/* Hot Seat Button */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black dark:text-gray-950 font-black text-base tracking-wide shadow-xl hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            {language === 'en' ? 'Take the hot seat' : 'हॉट सीट पर बैठिए'}
          </button>

          <p className="text-center text-[11px] text-gray-500 dark:text-gray-400 italic">
            {language === 'en' ? 'Think carefully — climb up to 10,00,000 Gyan Points' : 'सोच-समझकर खेलें — १०,००,००० ज्ञान अंक तक की चढ़ाई'}
          </p>

          {/* Rules Card matching screenshot 5 */}
          <div className="bg-[#FAF6EE] dark:bg-[#161410] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {language === 'en' ? 'How the game works' : 'खेल कैसे चलता है'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  15
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? '15 Questions' : 'पंद्रह सवाल'}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    {language === 'en' ? 'From easy to scholar level — five stages of Jain wisdom.' : 'आसान से विद्वान स्तर तक — जैन ज्ञान के पाँच पड़ाव।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  ★
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Safe Havens at Q5 and Q10' : 'Q5 और Q10 पर पड़ाव'}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    {language === 'en' ? 'Wrong answer drops you to the last safe haven, not zero.' : 'ग़लत जवाब वहीं गिरता है, शून्य पर नहीं।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  ⏱️
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Clock on every question' : 'हर सवाल पर घड़ी'}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    {language === 'en' ? '20s initial, 45s on scholar level. Time up = wrong.' : '२० सेकंड शुरू में, ४५ विद्वान स्तर पर। समय बीता तो ग़लत।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Two Lifelines' : 'दो लाइफ़लाइन'}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    {language === 'en' ? '50:50 removes 2 wrong options. Swap gives a new question & fresh clock.' : '50:50 दो विकल्प हटाता है। Swap नया सवाल और नई घड़ी देता है।'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  →
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {language === 'en' ? 'Walk away anytime' : 'कभी भी रुक जाइए'}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    {language === 'en' ? 'Take all earned Gyan Points with you anytime.' : 'अब तक कमाए हर ज्ञान अंक साथ ले जाइए।'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== LEADERBOARD (MATCHING SCREENSHOT 6) ==================== */}
          <div className="bg-[#FAF6EE] dark:bg-[#161410] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 space-y-4">
            {/* Prize climb mini chart */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-2">
                <span>{language === 'en' ? 'Height of climb' : 'ऊँचाई की चढ़ाई'}</span>
                <span>★ = {language === 'en' ? 'Safe Haven' : 'पड़ाव'}</span>
              </div>
              <div className="flex items-end gap-1 h-14 bg-black/10 dark:bg-black/30 rounded-2xl p-2">
                {GYAN_DEEPAK_PRIZE_LADDER.map(p => (
                  <div key={p.level} className="flex-1 flex flex-col items-center h-full justify-end">
                    {p.isPadav && <span className="text-[9px] text-amber-400">★</span>}
                    <div 
                      className={cn(
                        "w-full rounded-t-sm transition-all",
                        p.isPadav ? "bg-amber-500" : "bg-amber-500/40"
                      )}
                      style={{ height: `${(p.level / 15) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-1">
                <span>100</span>
                <span>10,00,000 ज्ञान अंक</span>
              </div>
            </div>

            {/* Leaderboard tabs */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black flex items-center gap-2 text-gray-900 dark:text-white">
                  🏆 {language === 'en' ? 'Leaderboard' : 'लीडरबोर्ड'}
                </h3>
                <div className="flex bg-black/10 dark:bg-white/10 rounded-full p-0.5 text-[10px] font-bold">
                  {(['week', 'month', 'all'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setLeaderboardTab(tab)}
                      className={cn(
                        "px-2.5 py-1 rounded-full transition-all",
                        leaderboardTab === tab
                          ? "bg-amber-500 text-black"
                          : "text-gray-500 dark:text-gray-400 hover:text-white"
                      )}
                    >
                      {tab === 'week' ? 'इस हफ़्ते' : tab === 'month' ? 'इस महीने' : 'अब तक'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ranks list matching screenshot 6 */}
              <div className="space-y-2">
                {INITIAL_LEADERBOARD.map(item => (
                  <div
                    key={item.rank}
                    className="p-3 rounded-2xl bg-white dark:bg-[#1E1B15] border border-gray-150 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-600 text-sm w-4">
                        {item.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center">
                        {item.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-[10px] text-gray-400">{item.qLevel} • {item.date}</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-amber-500 text-sm">
                      {item.score.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ACTIVE PLAYING SCREEN ==================== */}
      {gameState === 'playing' && currentQuestion && (
        <div className="space-y-5 animate-in zoom-in-95 duration-200">
          {/* Header Stats */}
          <div className="flex items-center justify-between bg-black/40 border border-amber-500/30 rounded-2xl p-3 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                {language === 'en' ? 'QUESTION' : 'सवाल'}
              </span>
              <span className="font-serif font-black text-amber-400 text-base">
                {currentLevel} / 15
              </span>
            </div>

            {/* Countdown timer */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-black text-lg shadow-md",
                timeLeft <= 5 
                  ? "border-rose-500 text-rose-500 bg-rose-500/10 animate-ping" 
                  : "border-amber-400 text-amber-400 bg-amber-400/10"
              )}>
                {timeLeft}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                {language === 'en' ? 'CURRENT VALUE' : 'ज्ञान अंक'}
              </span>
              <span className="font-mono font-black text-amber-300 text-base">
                {(GYAN_DEEPAK_PRIZE_LADDER.find(p => p.level === currentLevel)?.points || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Lifelines Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleUse5050}
              disabled={lifeline5050Used || lockedOption !== null}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl border text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5",
                lifeline5050Used
                  ? "bg-black/20 border-white/5 text-gray-600 opacity-40 cursor-not-allowed"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
              )}
            >
              <span>50:50</span>
              {lifeline5050Used && <span className="text-[10px]">✕</span>}
            </button>

            <button
              onClick={handleUseSwap}
              disabled={lifelineSwapUsed || lockedOption !== null}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl border text-xs font-black tracking-wider transition-all flex items-center justify-center gap-1.5",
                lifelineSwapUsed
                  ? "bg-black/20 border-white/5 text-gray-600 opacity-40 cursor-not-allowed"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
              )}
            >
              <span>🔄 {language === 'en' ? 'Swap Q' : 'सवाल बदलें'}</span>
              {lifelineSwapUsed && <span className="text-[10px]">✕</span>}
            </button>

            <button
              onClick={handleQuitGame}
              disabled={lockedOption !== null}
              className="py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
            >
              {language === 'en' ? 'Quit' : 'रुकिए'}
            </button>
          </div>

          {/* Question Box */}
          <div className="bg-gradient-to-b from-[#1C1812] to-[#12100C] border-2 border-amber-500/40 rounded-3xl p-6 text-center shadow-xl min-h-32 flex items-center justify-center">
            <h2 className="text-base sm:text-lg font-serif font-black text-amber-100 leading-relaxed">
              {language === 'en' ? currentQuestion.question.en : currentQuestion.question.hi}
            </h2>
          </div>

          {/* Options Grid (4 Options) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(language === 'en' ? currentQuestion.options.en : currentQuestion.options.hi).map((opt, idx) => {
              const isEliminated = eliminatedOptions.includes(idx);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.answer;

              let btnStyle = "bg-[#181510] border-amber-500/30 text-gray-200 hover:border-amber-400";
              if (isSelected && !revealResult) {
                btnStyle = "bg-amber-500 text-black font-black border-amber-300 animate-pulse";
              } else if (revealResult) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-600 text-white font-black border-emerald-400 animate-bounce";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-600 text-white font-black border-rose-400";
                }
              }

              if (isEliminated) {
                return (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl border border-transparent bg-transparent opacity-0 pointer-events-none"
                  />
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={lockedOption !== null}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer shadow-md",
                    btnStyle
                  )}
                >
                  <span className="w-7 h-7 rounded-xl bg-white/10 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Safe Haven notification badge */}
          <div className="text-center">
            <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider">
              {language === 'en' 
                ? `Protected Padav: ${safeHavenScore.toLocaleString('en-IN')} points` 
                : `सुरक्षित पड़ाव: ${safeHavenScore.toLocaleString('en-IN')} अंक`}
            </span>
          </div>
        </div>
      )}

      {/* ==================== GAME OVER SCREEN ==================== */}
      {(gameState === 'game_over' || gameState === 'won') && (
        <div className="bg-[#FAF6EE] dark:bg-[#161410] border-2 border-amber-500/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full mx-auto bg-amber-500/20 text-amber-400 flex items-center justify-center text-4xl shadow-lg">
            {gameState === 'won' ? '👑' : '🪔'}
          </div>

          <div>
            <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
              {gameState === 'won' 
                ? (language === 'en' ? 'Ultimate Scholar Victory!' : 'परम सिद्ध ज्ञानी विजय!') 
                : (language === 'en' ? 'Game Over!' : 'खेल समाप्त!')}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'en' ? 'Thank you for testing your Jain knowledge' : 'जैन ज्ञान साधना में भाग लेने हेतु साधुवाद'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
              {language === 'en' ? 'POINTS SECURED' : 'सुरक्षित अर्जित ज्ञान अंक'}
            </span>
            <span className="text-3xl font-mono font-black text-amber-500">
              {(gameState === 'won' ? 1000000 : (safeHavenScore > 0 ? safeHavenScore : earnedScore)).toLocaleString('en-IN')}
            </span>
          </div>

          {currentQuestion && (
            <div className="p-4 rounded-2xl bg-black/10 dark:bg-black/30 text-left text-xs space-y-1">
              <span className="font-bold text-amber-600 block">
                {language === 'en' ? 'Knowledge Insight:' : 'ज्ञान रहस्य:'}
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {language === 'en' ? currentQuestion.explanation.en : currentQuestion.explanation.hi}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm tracking-wide shadow-md hover:scale-102 active:scale-98 transition-all"
            >
              {language === 'en' ? 'Play Again' : 'पुनः खेलें'}
            </button>

            <button
              onClick={() => setGameState('welcome')}
              className="px-5 py-3.5 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold text-sm transition-all"
            >
              {language === 'en' ? 'Leaderboard' : 'लीडरबोर्ड'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
