import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, 
  HelpCircle, Trophy, Users, Sparkles, X, ChevronRight, ShieldCheck, Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface TambolaTicket {
  // 3 rows, 9 columns. null represents empty space (4 blanks per row, 5 numbers per row)
  grid: (number | null)[][];
  marked: boolean[][];
}

// Generate an authentic 3x9 Tambola ticket with 15 numbers (5 per row)
function generateValidTicket(): TambolaTicket {
  const grid: (number | null)[][] = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null]
  ];
  const marked: boolean[][] = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false]
  ];

  // Column boundaries:
  // col 0: 1-9, col 1: 10-19, col 2: 20-29, col 3: 30-39, col 4: 40-49,
  // col 5: 50-59, col 6: 60-69, col 7: 70-79, col 8: 80-90
  const columnRanges = [
    [1, 9], [10, 19], [20, 29], [30, 39], [40, 49],
    [50, 59], [60, 69], [70, 79], [80, 90]
  ];

  // Pick random numbers for each column
  const colNumbers: number[][] = [];
  for (let c = 0; c < 9; c++) {
    const [min, max] = columnRanges[c];
    const available: number[] = [];
    for (let n = min; n <= max; n++) available.push(n);
    // pick 1 to 2 numbers
    available.sort(() => 0.5 - Math.random());
    colNumbers.push(available);
  }

  // Ensure each row has exactly 5 numbers
  for (let r = 0; r < 3; r++) {
    // pick 5 distinct columns for row r
    const cols = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 5);
    for (const c of cols) {
      if (colNumbers[c].length > 0) {
        grid[r][c] = colNumbers[c].pop()!;
      }
    }
  }

  // Sort numbers in each column top-to-bottom
  for (let c = 0; c < 9; c++) {
    const present: { row: number; val: number }[] = [];
    for (let r = 0; r < 3; r++) {
      if (grid[r][c] !== null) {
        present.push({ row: r, val: grid[r][c]! });
      }
    }
    present.sort((a, b) => a.val - b.val);
    for (let i = 0; i < present.length; i++) {
      grid[present[i].row][c] = present[i].val;
    }
  }

  return { grid, marked };
}

export default function JainTambolaGame({ onBack }: { onBack?: () => void }) {
  const { language } = useLanguage();
  const [ticket, setTicket] = useState<TambolaTicket>(generateValidTicket);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoMark, setAutoMark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [claimedPrizes, setClaimedPrizes] = useState<Record<string, boolean>>({});
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const timerRef = useRef<any>(null);

  // Sound synthesis
  const playBeep = (freq: number = 600, duration: number = 0.15) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext fallback
    }
  };

  const playSpeech = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech fallback
    }
  };

  // Next number caller
  const callNextNumber = () => {
    if (calledNumbers.length >= 90) {
      setIsPlaying(false);
      return;
    }
    const uncalled: number[] = [];
    for (let i = 1; i <= 90; i++) {
      if (!calledNumbers.includes(i)) uncalled.push(i);
    }
    if (uncalled.length === 0) return;

    const next = uncalled[Math.floor(Math.random() * uncalled.length)];
    const updated = [...calledNumbers, next];
    setCalledNumbers(updated);
    setCurrentNumber(next);
    playBeep(750, 0.2);
    playSpeech(String(next));

    // If auto-mark is enabled, mark it on the ticket
    if (autoMark) {
      setTicket(prev => {
        const nextMarked = prev.marked.map(row => [...row]);
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 9; c++) {
            if (prev.grid[r][c] === next) {
              nextMarked[r][c] = true;
            }
          }
        }
        return { ...prev, marked: nextMarked };
      });
    }
  };

  // Auto-caller effect (every 5 seconds)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        callNextNumber();
      }, 5000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, calledNumbers, autoMark]);

  // Handle manual marking
  const toggleMarkNumber = (r: number, c: number) => {
    const val = ticket.grid[r][c];
    if (val === null) return;
    // Can only mark if it has been called
    if (!calledNumbers.includes(val)) {
      setClaimMessage(language === 'en' ? `Number ${val} has not been called yet!` : `संख्या ${val} अभी तक नहीं बोली गई है!`);
      setTimeout(() => setClaimMessage(null), 2500);
      return;
    }
    setTicket(prev => {
      const nextMarked = prev.marked.map(row => [...row]);
      nextMarked[r][c] = !nextMarked[r][c];
      return { ...prev, marked: nextMarked };
    });
    playBeep(900, 0.1);
  };

  // Check how many numbers are marked / left for each prize pattern
  const totalMarkedCount = ticket.grid.reduce((acc, row, r) => {
    return acc + row.filter((val, c) => val !== null && ticket.marked[r][c]).length;
  }, 0);

  // Top line count
  const topLineTotal = ticket.grid[0].filter(v => v !== null).length;
  const topLineMarked = ticket.grid[0].filter((v, c) => v !== null && ticket.marked[0][c]).length;
  const topLineLeft = topLineTotal - topLineMarked;

  // Middle line count
  const midLineTotal = ticket.grid[1].filter(v => v !== null).length;
  const midLineMarked = ticket.grid[1].filter((v, c) => v !== null && ticket.marked[1][c]).length;
  const midLineLeft = midLineTotal - midLineMarked;

  // Bottom line count
  const btmLineTotal = ticket.grid[2].filter(v => v !== null).length;
  const btmLineMarked = ticket.grid[2].filter((v, c) => v !== null && ticket.marked[2][c]).length;
  const btmLineLeft = btmLineTotal - btmLineMarked;

  // Four corners (first & last non-null of row 0 and row 2)
  const getRowCornerIndices = (r: number): [number, number] => {
    let first = -1;
    let last = -1;
    for (let c = 0; c < 9; c++) {
      if (ticket.grid[r][c] !== null) {
        if (first === -1) first = c;
        last = c;
      }
    }
    return [first, last];
  };
  const [t0First, t0Last] = getRowCornerIndices(0);
  const [t2First, t2Last] = getRowCornerIndices(2);
  const cornersTotal = 4;
  let cornersMarked = 0;
  if (t0First !== -1 && ticket.marked[0][t0First]) cornersMarked++;
  if (t0Last !== -1 && ticket.marked[0][t0Last]) cornersMarked++;
  if (t2First !== -1 && ticket.marked[2][t2First]) cornersMarked++;
  if (t2Last !== -1 && ticket.marked[2][t2Last]) cornersMarked++;
  const cornersLeft = cornersTotal - cornersMarked;

  const earlyFiveLeft = Math.max(0, 5 - totalMarkedCount);
  const fullHouseLeft = Math.max(0, 15 - totalMarkedCount);

  // Claim logic
  const handleClaim = (prizeKey: string, prizeName: string, isValid: boolean) => {
    if (claimedPrizes[prizeKey]) {
      setClaimMessage(language === 'en' ? `You already claimed ${prizeName}!` : `आप ${prizeName} पहले ही जीत चुके हैं!`);
      setTimeout(() => setClaimMessage(null), 2500);
      return;
    }
    if (!isValid) {
      setClaimMessage(language === 'en' ? `Bogey! ${prizeName} condition is not complete yet.` : `बोजी (अमान्य)! ${prizeName} अभी पूरा नहीं हुआ है।`);
      setTimeout(() => setClaimMessage(null), 3000);
      playBeep(250, 0.4);
      return;
    }

    // Valid claim celebration
    setClaimedPrizes(prev => ({ ...prev, [prizeKey]: true }));
    setCoinsEarned(prev => prev + 50);
    setClaimMessage(language === 'en' ? `🎉 Congratulations! You claimed ${prizeName} (+50 Namo Coins)!` : `🎉 बधाई हो! आपने ${prizeName} जीता (+५० नमो सिक्के)!`);
    playBeep(1200, 0.3);
    setTimeout(() => setClaimMessage(null), 4000);
  };

  const handleResetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCalledNumbers([]);
    setCurrentNumber(null);
    setTicket(generateValidTicket());
    setClaimedPrizes({});
    setClaimMessage(null);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Bar matching screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center transition-all cursor-pointer"
            >
              ←
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white">
                {language === 'en' ? 'Jain Tambola' : 'जैन तंबोला (हौजी)'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                🎓 {language === 'en' ? 'PRACTICE' : 'अभ्यास'}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              👥 12 • Host: Namo Buddy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <span className="text-[11px] font-semibold">{language === 'en' ? 'Auto-mark' : 'ऑटो-मार्क'}</span>
            <button 
              onClick={() => setAutoMark(!autoMark)}
              className={cn(
                "w-10 h-6 rounded-full transition-colors p-0.5 flex items-center",
                autoMark ? "bg-amber-600 justify-end" : "bg-gray-300 dark:bg-gray-700 justify-start"
              )}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="w-9 h-9 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center"
            title="How to play"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* Practice Hall Hero Card matching screenshot 8 */}
      <div className="bg-gradient-to-br from-[#8D4B18] via-[#75390F] to-[#592B0A] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <p className="text-sm font-medium opacity-90 leading-relaxed">
            {language === 'en' 
              ? 'This is a practice hall — numbers auto-call every 5 seconds once you start.' 
              : 'यह अभ्यास कक्ष है — शुरू करने पर प्रत्येक ५ सेकंड में नई संख्या स्वतः बोली जाएगी।'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                if (!isPlaying && calledNumbers.length === 0) {
                  callNextNumber();
                }
                setIsPlaying(!isPlaying);
              }}
              className="px-6 py-3 rounded-2xl bg-white text-[#75390F] hover:bg-amber-50 font-black text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause size={16} /> {language === 'en' ? 'Pause Game' : 'विराम दें'}
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" /> {language === 'en' ? 'Start practice' : 'अभ्यास प्रारंभ करें'}
                </>
              )}
            </button>

            <button
              onClick={callNextNumber}
              disabled={isPlaying || calledNumbers.length >= 90}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs tracking-wider transition-all disabled:opacity-40"
            >
              {language === 'en' ? 'Next number' : 'अगला नंबर'}
            </button>

            <button
              onClick={handleResetGame}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Reset ticket & caller"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>

        {/* Current called number circle */}
        {currentNumber !== null && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
              {language === 'en' ? 'CURRENT' : 'ताज़ा नंबर'}
            </span>
            <div className="w-16 h-16 rounded-full bg-amber-400 text-[#592B0A] font-serif font-black text-3xl flex items-center justify-center shadow-xl animate-bounce">
              {currentNumber}
            </div>
          </div>
        )}
      </div>

      {/* Claim notification alert */}
      {claimMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold text-center text-sm animate-in slide-in-from-top duration-200">
          {claimMessage}
        </div>
      )}

      {/* ==================== THE TAMBOLA TICKET ==================== */}
      <div className="bg-[#FAF6EE] dark:bg-[#1D1B16] rounded-3xl p-5 border-2 border-[#E7DECD] dark:border-amber-900/30 shadow-md space-y-6">
        {/* Ticket grid: 3 rows x 9 cols */}
        <div className="space-y-2">
          {ticket.grid.map((row, r) => (
            <div key={r} className="grid grid-cols-9 gap-1.5 sm:gap-2">
              {row.map((val, c) => {
                const isMarked = ticket.marked[r][c];
                const isCalled = val !== null && calledNumbers.includes(val);

                if (val === null) {
                  return (
                    <div 
                      key={c} 
                      className="h-11 sm:h-13 rounded-xl bg-transparent"
                    />
                  );
                }

                return (
                  <button
                    key={c}
                    onClick={() => toggleMarkNumber(r, c)}
                    className={cn(
                      "h-11 sm:h-13 rounded-xl font-mono font-black text-base sm:text-lg flex items-center justify-center transition-all cursor-pointer select-none border-2",
                      isMarked
                        ? "bg-gradient-to-tr from-amber-700 to-amber-600 text-white border-amber-800 shadow-md scale-102"
                        : isCalled
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-400/50 hover:border-amber-500"
                          : "bg-white dark:bg-[#2A2720] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/5 hover:border-amber-500/40"
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ==================== 6 JAIN PRIZE CLAIMS (MATCHING SCREENSHOT 8) ==================== */}
        <div className="space-y-2.5 pt-2">
          {/* 1. Panch Parmeshthi */}
          <button
            onClick={() => handleClaim('early_five', 'Panch Parmeshthi (Early Five)', earlyFiveLeft === 0)}
            disabled={claimedPrizes['early_five']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['early_five']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : earlyFiveLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>🌸 Panch Parmeshthi (Early Five) {earlyFiveLeft > 0 ? `(${earlyFiveLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['early_five'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* 2. Char Sharan */}
          <button
            onClick={() => handleClaim('char_sharan', 'Char Sharan (Four Corners)', cornersLeft === 0)}
            disabled={claimedPrizes['char_sharan']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['char_sharan']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : cornersLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>🛡️ Char Sharan (Four Corners) {cornersLeft > 0 ? `(${cornersLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['char_sharan'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* 3. Samyak Darshan (Top Line) */}
          <button
            onClick={() => handleClaim('top_line', 'Samyak Darshan (Top Line)', topLineLeft === 0)}
            disabled={claimedPrizes['top_line']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['top_line']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : topLineLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>👁️ Samyak Darshan (Top Line) {topLineLeft > 0 ? `(${topLineLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['top_line'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* 4. Samyak Gyan (Middle Line) */}
          <button
            onClick={() => handleClaim('mid_line', 'Samyak Gyan (Middle Line)', midLineLeft === 0)}
            disabled={claimedPrizes['mid_line']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['mid_line']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : midLineLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>📖 Samyak Gyan (Middle Line) {midLineLeft > 0 ? `(${midLineLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['mid_line'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* 5. Samyak Charitra (Bottom Line) */}
          <button
            onClick={() => handleClaim('btm_line', 'Samyak Charitra (Bottom Line)', btmLineLeft === 0)}
            disabled={claimedPrizes['btm_line']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['btm_line']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : btmLineLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>🧘 Samyak Charitra (Bottom Line) {btmLineLeft > 0 ? `(${btmLineLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['btm_line'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>

          {/* 6. Moksha (Full House) */}
          <button
            onClick={() => handleClaim('full_house', 'Moksha (Full House)', fullHouseLeft === 0)}
            disabled={claimedPrizes['full_house']}
            className={cn(
              "w-full py-3 px-4 rounded-2xl border text-left flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer",
              claimedPrizes['full_house']
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : fullHouseLeft === 0
                  ? "bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-100 animate-pulse font-black"
                  : "bg-white dark:bg-[#2A2720] border-amber-700/30 text-amber-900 dark:text-amber-200 hover:border-amber-600"
            )}
          >
            <span>🌙 Moksha (Full House) {fullHouseLeft > 0 ? `(${fullHouseLeft} left)` : '✨ READY!'}</span>
            {claimedPrizes['full_house'] && <CheckCircle2 size={16} className="text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Called Numbers Board (1-90 drawer) */}
      <div className="bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-gray-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'Called Numbers' : 'बोली गई संख्याएँ'} ({calledNumbers.length}/90)
          </h4>
          <span className="text-[10px] text-amber-600 font-bold">
            {language === 'en' ? 'Yellow = Called' : 'पीला रंग = घोषित नंबर'}
          </span>
        </div>

        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 max-h-48 overflow-y-auto p-1 bg-gray-50 dark:bg-black/30 rounded-2xl border border-gray-150 dark:border-white/5">
          {Array.from({ length: 90 }, (_, i) => i + 1).map(num => {
            const isCalled = calledNumbers.includes(num);
            const isCurrent = currentNumber === num;
            return (
              <div
                key={num}
                className={cn(
                  "h-7 sm:h-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all",
                  isCurrent
                    ? "bg-amber-500 text-black font-black scale-110 shadow-md ring-2 ring-amber-300"
                    : isCalled
                      ? "bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100"
                      : "bg-white/60 dark:bg-white/5 text-gray-400 dark:text-gray-600"
                )}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== HOW TO PLAY MODAL (MATCHING SCREENSHOT 9) ==================== */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] dark:bg-[#1D1B16] border border-amber-900/20 max-w-sm w-full rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
                🎓 {language === 'en' ? 'How to play' : 'खेलने का नियम'}
              </h3>
              <button 
                onClick={() => setShowHowToPlay(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  {language === 'en' 
                    ? 'Mark each called number on your ticket (or turn on Auto-mark).' 
                    : 'घोषित संख्या को अपने टिकट पर टैप करके चिह्नित करें (या ऑटो-मार्क चालू रखें)।'}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  {language === 'en'
                    ? 'The moment a prize pattern completes, TAP its button on the ticket — fastest claim wins in a real game!'
                    : 'जैसे ही कोई पुरस्कार पैटर्न (जैसे पंच परमेष्ठी, चार शरण, सम्यक्त्व या मोक्ष) पूर्ण हो, तुरंत उस बटन को टैप करें!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer"
            >
              {language === 'en' ? 'Got it — start!' : 'समझ गया — शुरू करें!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
