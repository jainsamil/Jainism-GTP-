import { useState, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, 
  HelpCircle, Trophy, BookOpen, Star, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  MOKSHA_PATH_LADDERS, 
  MOKSHA_PATH_SNAKES, 
  MokshaPathLadder, 
  MokshaPathSnake 
} from '../../data/jainGamesData';

interface Player {
  id: number;
  name: string;
  avatar: string;
  position: number; // 1 to 84
  color: string;
}

const PLAYER_TOKENS = [
  { avatar: '🪔', name: 'Player 1', color: '#D97706' },
  { avatar: '🪷', name: 'Player 2', color: '#2563EB' },
  { avatar: '🐚', name: 'Player 3', color: '#059669' },
  { avatar: '☸️', name: 'Player 4', color: '#9333EA' }
];

export default function MokshaPathGame({ onBack }: { onBack?: () => void }) {
  const { language } = useLanguage();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'winner'>('setup');
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastEventMsg, setLastEventMsg] = useState<string | null>(null);
  const [showGyanAlbum, setShowGyanAlbum] = useState<boolean>(false);
  const [collectedCards, setCollectedCards] = useState<string[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  // Sound effects
  const playTone = (freq: number, duration: number = 0.2) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleStartJourney = () => {
    const list: Player[] = [];
    for (let i = 0; i < numPlayers; i++) {
      list.push({
        id: i + 1,
        name: playerNames[i] || `Player ${i + 1}`,
        avatar: PLAYER_TOKENS[i].avatar,
        color: PLAYER_TOKENS[i].color,
        position: 1
      });
    }
    setPlayers(list);
    setCurrentPlayerIdx(0);
    setGameState('playing');
    setLastEventMsg(null);
    setWinner(null);
  };

  const handleRollDice = () => {
    if (isRolling || gameState !== 'playing') return;
    setIsRolling(true);
    playTone(400, 0.1);

    // Roll animation
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 7) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        processMove(finalRoll);
      }
    }, 80);
  };

  const processMove = (roll: number) => {
    const player = players[currentPlayerIdx];
    const targetPos = player.position + roll;

    let newPos = targetPos;
    let eventMsg = `${player.name} rolled ${roll}.`;

    // Exact roll required for Moksha (84)
    if (targetPos > 84) {
      const bounce = targetPos - 84;
      newPos = 84 - bounce;
      eventMsg = `${player.name} rolled ${roll} and bounced back to ${newPos}!`;
      playTone(300, 0.3);
    } else if (targetPos === 84) {
      // WON MOKSHA!
      playTone(1000, 0.8);
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIdx].position = 84;
      setPlayers(updatedPlayers);
      setWinner(player);
      setGameState('winner');
      return;
    }

    // Check if newPos landed on a Ladder (Virtue)
    const ladder = MOKSHA_PATH_LADDERS.find(l => l.start === newPos);
    if (ladder) {
      newPos = ladder.end;
      eventMsg = `✨ ${player.name} climbed ladder "${ladder.name.hi}" (${ladder.start} → ${ladder.end})!`;
      playTone(800, 0.4);
      if (!collectedCards.includes(ladder.name.hi)) {
        setCollectedCards(prev => [...prev, ladder.name.hi]);
      }
    }

    // Check if newPos landed on a Snake (Kashaya)
    const snake = MOKSHA_PATH_SNAKES.find(s => s.start === newPos);
    if (snake) {
      newPos = snake.end;
      eventMsg = `⚠️ ${player.name} bitten by kashaya snake "${snake.name.hi}" (${snake.start} → ${snake.end})!`;
      playTone(200, 0.5);
    }

    // Update position
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIdx].position = newPos;
    setPlayers(updatedPlayers);
    setLastEventMsg(eventMsg);

    // Turn handover (roll of 6 gives another turn!)
    if (roll === 6) {
      setLastEventMsg(prev => `${prev} 🎉 Rolled 6! Take another turn.`);
    } else {
      setCurrentPlayerIdx((currentPlayerIdx + 1) % numPlayers);
    }
  };

  // Generate 84 squares in authentic serpentine order
  // 12 columns per row, 7 rows total = 84 squares!
  const rows: number[][] = [];
  for (let r = 6; r >= 0; r--) {
    const rowNums: number[] = [];
    const startNum = r * 12 + 1;
    for (let c = 0; c < 12; c++) {
      rowNums.push(startNum + c);
    }
    // Alternate row directions for serpentine snakes & ladders board
    if (r % 2 === 1) {
      rowNums.reverse();
    }
    rows.push(rowNums);
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header matching screenshot 3 & 4 */}
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
          <div>
            <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
              🌙 {language === 'en' ? 'Moksha Path' : 'मोक्ष मार्ग (ज्ञान चौपड़)'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {language === 'en' ? 'The original snakes & ladders — a Jain game' : 'मूल जैन ज्ञान चौपड़ — 84 लाख योनियों से मुक्ति'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGyanAlbum(true)}
          className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/25 transition-all"
        >
          <span>🃏</span>
          <span className="hidden sm:inline">{language === 'en' ? 'Gyan Album' : 'ज्ञान एल्बम'}</span>
          <span className="text-[10px] font-mono">({collectedCards.length}/5)</span>
        </button>
      </div>

      {/* ==================== SETUP SCREEN (MATCHING SCREENSHOT 3) ==================== */}
      {gameState === 'setup' && (
        <div className="space-y-6">
          {/* History info banner */}
          <div className="bg-[#FAF6EE] dark:bg-[#161410] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed shadow-sm">
            {language === 'en'
              ? 'Snakes & ladders began as Gyan Chaupar — a Jain game where ladders are virtues, snakes are kashayas, and the goal is Moksha. You are not playing a copy. You are playing the original.'
              : 'साँप-सीढ़ी की उत्पत्ति प्राचीन जैन "ज्ञान चौपड़" से हुई है — जहाँ सीढ़ियाँ सम्यक्त्व और गुण हैं, और सर्प कषाय (क्रोध, मान, माया, लोभ) हैं। लक्ष्य 84 लाख योनियों से पार होकर सिद्धशिला (मोक्ष) पहुँचना है।'}
          </div>

          {/* Players count selector matching screenshot 3 */}
          <div className="bg-[#FAF6EE] dark:bg-[#161410] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-black text-gray-900 dark:text-white">
              {language === 'en' ? 'Players' : 'खिलाड़ी संख्या'}
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setNumPlayers(num)}
                  className={cn(
                    "py-3 rounded-2xl font-black text-base border-2 transition-all cursor-pointer",
                    numPlayers === num
                      ? "bg-amber-500/20 border-amber-600 text-amber-900 dark:text-amber-100 shadow-sm"
                      : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-amber-500/30"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Players input list matching screenshot 3 */}
            <div className="space-y-2.5 pt-2">
              {Array.from({ length: numPlayers }).map((_, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl"
                >
                  <span className="text-2xl w-8 text-center">{PLAYER_TOKENS[idx].avatar}</span>
                  <input
                    type="text"
                    value={playerNames[idx]}
                    onChange={(e) => {
                      const updated = [...playerNames];
                      updated[idx] = e.target.value;
                      setPlayerNames(updated);
                    }}
                    placeholder={`Player ${idx + 1}`}
                    className="flex-1 bg-transparent text-xs font-bold text-gray-900 dark:text-white outline-none"
                  />
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              {language === 'en'
                ? '84 squares • exact roll for moksha • 6 = extra turn • virtue ladders lift you, kashaya snakes drop you'
                : '८४ चौकियां • मोक्ष हेतु सटीक पासा • ६ आने पर पुनः बारी • सद्गुणों की सीढ़ी और कषायों के सर्प'}
            </p>

            <button
              onClick={handleStartJourney}
              className="w-full py-4 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white font-black text-sm tracking-wide shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🎲</span>
              <span>{language === 'en' ? 'Start the journey' : 'यात्रा प्रारंभ करें'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== ACTIVE PLAYING BOARD SCREEN (MATCHING SCREENSHOT 4) ==================== */}
      {gameState === 'playing' && players.length > 0 && (
        <div className="space-y-4">
          {/* Current Turn Notification Bar */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 font-bold">
              <span className="text-2xl">{players[currentPlayerIdx].avatar}</span>
              <div>
                <span className="text-gray-900 dark:text-white font-black">
                  {players[currentPlayerIdx].name}'s Turn
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {language === 'en' ? 'Square' : 'चौकी'} {players[currentPlayerIdx].position} / 84
                </span>
              </div>
            </div>

            {/* Event message alert */}
            {lastEventMsg && (
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 max-w-xs truncate text-right">
                {lastEventMsg}
              </span>
            )}
          </div>

          {/* ==================== 84 SQUARES CHESSBOARD ==================== */}
          <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-3 shadow-xl">
            <div className="grid grid-cols-12 gap-1 select-none">
              {rows.map((rowArr, rIdx) => (
                rowArr.map((sqNum) => {
                  const isMokshaSquare = sqNum === 84;
                  const ladder = MOKSHA_PATH_LADDERS.find(l => l.start === sqNum);
                  const snake = MOKSHA_PATH_SNAKES.find(s => s.start === sqNum);
                  const ladderEnd = MOKSHA_PATH_LADDERS.find(l => l.end === sqNum);
                  const snakeEnd = MOKSHA_PATH_SNAKES.find(s => s.end === sqNum);

                  const playersHere = players.filter(p => p.position === sqNum);

                  return (
                    <div
                      key={sqNum}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col justify-between p-0.5 text-[8px] sm:text-[9px] font-mono relative transition-all border",
                        isMokshaSquare
                          ? "bg-gradient-to-tr from-amber-400 to-amber-200 border-amber-500 text-amber-950 font-black shadow-md"
                          : ladder
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                            : snake
                              ? "bg-rose-500/15 border-rose-500/40 text-rose-800 dark:text-rose-300"
                              : "bg-white dark:bg-white/5 border-gray-150 dark:border-white/5 text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {/* Square Number */}
                      <span className="leading-none font-bold">
                        {isMokshaSquare ? '🌙 84' : sqNum}
                      </span>

                      {/* Icon of virtue ladder or kashaya snake */}
                      {ladder && <span className="text-[10px] leading-none self-end">{ladder.emoji}</span>}
                      {snake && <span className="text-[10px] leading-none self-end">{snake.emoji}</span>}
                      {ladderEnd && <span className="text-[8px] leading-none self-end text-emerald-600">▲</span>}
                      {snakeEnd && <span className="text-[8px] leading-none self-end text-rose-600">▼</span>}

                      {/* Players Tokens stationed on this square */}
                      {playersHere.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center gap-0.5 z-10">
                          {playersHere.map(p => (
                            <span 
                              key={p.id} 
                              className="text-xs sm:text-sm animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                              title={p.name}
                            >
                              {p.avatar}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {/* Bottom Action Bar: Dice & Roll Button matching screenshot 4 */}
          <div className="flex items-center gap-4 bg-[#FAF6EE] dark:bg-[#1A1814] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-4 shadow-lg">
            {/* 3D Dice Display */}
            <div className={cn(
              "w-16 h-16 rounded-2xl bg-white dark:bg-[#25221B] border-2 border-amber-600/40 flex items-center justify-center font-mono font-black text-3xl text-amber-600 shadow-md transition-transform",
              isRolling && "animate-spin"
            )}>
              {diceValue}
            </div>

            <div className="flex-1">
              <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>{players[currentPlayerIdx].avatar}</span>
                <span>{players[currentPlayerIdx].name}'s Turn</span>
              </span>
              <span className="text-[10px] text-gray-500 block">
                {language === 'en' ? 'Tap Roll dice to move forward' : 'पासा फेंक कर आगे बढ़ें'}
              </span>
            </div>

            <button
              onClick={handleRollDice}
              disabled={isRolling}
              className="px-6 py-3.5 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white font-black text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {language === 'en' ? 'Roll dice' : 'पासा फेंकें'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== WINNER MODAL ==================== */}
      {gameState === 'winner' && winner && (
        <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-amber-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full mx-auto bg-amber-500/20 text-4xl flex items-center justify-center animate-bounce shadow-md">
            🌙
          </div>

          <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
            {language === 'en' ? 'Attained Moksha / Siddhashila!' : 'सिद्धशिला (मोक्ष) की प्राप्ति!'}
          </h2>
          <p className="text-sm font-bold text-amber-600">
            🎉 {winner.name} ({winner.avatar}) has attained supreme liberation!
          </p>

          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'By climbing the ladders of Ahimsa, Satya, and Vinaya, you traversed the 84 lakh cycles of birth and attained the eternal state of Siddha.'
              : 'अहिंसा, सत्य और विनय की सीढ़ियों पर चढ़कर आपने ८४ लाख योनियों का अंत किया और अशरीरी सिद्ध पद को प्राप्त किया।'}
          </p>

          <button
            onClick={() => setGameState('setup')}
            className="w-full py-3.5 rounded-2xl bg-[#75390F] text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer"
          >
            {language === 'en' ? 'Play Again' : 'पुनः खेलें'}
          </button>
        </div>
      )}

      {/* ==================== GYAN ALBUM MODAL ==================== */}
      {showGyanAlbum && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border border-amber-900/20 max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-black text-gray-900 dark:text-white flex items-center gap-2">
                🃏 {language === 'en' ? 'Gyan Album (Virtue Cards)' : 'ज्ञान एल्बम (सद्गुण पत्र)'}
              </h3>
              <button 
                onClick={() => setShowGyanAlbum(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {MOKSHA_PATH_LADDERS.map((ladder, idx) => {
                const isCollected = collectedCards.includes(ladder.name.hi);
                return (
                  <div
                    key={idx}
                    className={cn(
                      "p-3 rounded-2xl border text-xs flex items-center gap-3 transition-all",
                      isCollected
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100"
                        : "bg-white/40 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400 opacity-60"
                    )}
                  >
                    <span className="text-2xl">{ladder.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-black">{ladder.name.hi}</h4>
                      <p className="text-[10px] text-gray-500">{ladder.virtue.hi}</p>
                    </div>
                    {isCollected ? (
                      <span className="text-[10px] font-bold text-emerald-600">✓ संकलित</span>
                    ) : (
                      <span className="text-[10px] text-gray-400">🔒 अप्रकट</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
