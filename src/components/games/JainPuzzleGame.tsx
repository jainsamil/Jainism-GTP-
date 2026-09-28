import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, RotateCcw, Timer, Trophy, Eye, EyeOff, 
  Sparkles, CheckCircle2, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { JAIN_PUZZLE_GALLERY, JainPuzzleImage } from '../../data/jainGamesData';

export default function JainPuzzleGame({ onBack }: { onBack?: () => void }) {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<JainPuzzleImage>(JAIN_PUZZLE_GALLERY[0]);
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Sound synthesis
  const playSlideSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio fallback
    }
  };

  // Generate a solvable shuffled tile permutation
  // 0 represents the empty space, 1..(N-1) are the numbered tiles
  const generateSolvableTiles = (size: number): number[] => {
    const total = size * size;
    const initial = Array.from({ length: total }, (_, i) => (i + 1) % total);
    // Shuffle by making valid random moves from solved state to guarantee solvability!
    let emptyIdx = total - 1;
    for (let step = 0; step < size * size * 15; step++) {
      const neighbors: number[] = [];
      const row = Math.floor(emptyIdx / size);
      const col = emptyIdx % size;

      if (row > 0) neighbors.push(emptyIdx - size);
      if (row < size - 1) neighbors.push(emptyIdx + size);
      if (col > 0) neighbors.push(emptyIdx - 1);
      if (col < size - 1) neighbors.push(emptyIdx + 1);

      const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      initial[emptyIdx] = initial[swapIdx];
      initial[swapIdx] = 0;
      emptyIdx = swapIdx;
    }
    return initial;
  };

  const handleStartPuzzle = () => {
    const shuffled = generateSolvableTiles(gridSize);
    setTiles(shuffled);
    setMoves(0);
    setTimerSeconds(0);
    setIsWon(false);
    setShowHint(false);
    setIsPlaying(true);
  };

  // Timer effect
  useEffect(() => {
    if (isPlaying && !isWon) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isWon]);

  // Handle tile click
  const handleTileClick = (idx: number) => {
    if (!isPlaying || isWon) return;
    const emptyIdx = tiles.indexOf(0);
    if (emptyIdx === -1) return;

    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const emptyRow = Math.floor(emptyIdx / gridSize);
    const emptyCol = emptyIdx % gridSize;

    // Check if adjacent to empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const nextTiles = [...tiles];
      nextTiles[emptyIdx] = tiles[idx];
      nextTiles[idx] = 0;
      setTiles(nextTiles);
      setMoves(prev => prev + 1);
      playSlideSound();

      // Check win condition
      const total = gridSize * gridSize;
      let won = true;
      for (let i = 0; i < total - 1; i++) {
        if (nextTiles[i] !== i + 1) {
          won = false;
          break;
        }
      }
      if (won && nextTiles[total - 1] === 0) {
        setIsWon(true);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Bar matching screenshot 1 */}
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
              🧩 {language === 'en' ? 'Jain Puzzle' : 'जैन पहेली (चित्र संयोजन)'}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {language === 'en' ? 'Rearrange the tiles to complete the image' : 'टुकड़ों को खिसका कर पवित्र तीर्थ चित्र पूर्ण करें'}
            </p>
          </div>
        </div>
      </div>

      {/* ==================== SELECTION VIEW (MATCHING SCREENSHOT 1) ==================== */}
      {!isPlaying && (
        <div className="space-y-6">
          {/* Main Selected Temple Image Hero Card matching screenshot 1 */}
          <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-md">
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.name.en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-lg font-serif font-black text-white">
                    {language === 'en' ? selectedImage.name.en : selectedImage.name.hi}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {language === 'en' ? selectedImage.location.en : selectedImage.location.hi}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-center font-serif font-bold text-sm text-gray-800 dark:text-gray-200">
              {selectedImage.name.en} ({selectedImage.location.en})
            </p>
          </div>

          {/* Picture Selector row matching screenshot 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-500">
              <span>{language === 'en' ? 'CHOOSE A PICTURE' : 'पवित्र तीर्थ चित्र चुनें'}</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {JAIN_PUZZLE_GALLERY.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-2 transition-all relative group cursor-pointer shadow-sm",
                    selectedImage.id === img.id
                      ? "border-amber-600 ring-2 ring-amber-500/50 scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img.imageUrl} alt={img.name.en} className="w-full h-full object-cover" />
                  {selectedImage.id === img.id && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black shadow-md">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selector matching screenshot 1 */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-gray-500 block">
              {language === 'en' ? 'DIFFICULTY' : 'कठिनाई स्तर'}
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { size: 3, label: '3×3 (सरल / Easy)' },
                { size: 4, label: '4×4 (मध्यम / Medium)' },
                { size: 5, label: '5×5 (कठिन / Hard)' }
              ].map(d => (
                <button
                  key={d.size}
                  onClick={() => setGridSize(d.size)}
                  className={cn(
                    "py-3 rounded-2xl font-bold text-xs border-2 transition-all cursor-pointer",
                    gridSize === d.size
                      ? "bg-amber-500/15 border-amber-600 text-amber-900 dark:text-amber-100"
                      : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 hover:border-amber-500/30"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Puzzle Button matching screenshot 1 */}
          <button
            onClick={handleStartPuzzle}
            className="w-full py-4 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white font-black text-sm tracking-wide shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            {language === 'en' ? `Start puzzle • ${gridSize}×${gridSize}` : `पहेली प्रारंभ करें • ${gridSize}×${gridSize}`}
          </button>
        </div>
      )}

      {/* ==================== ACTIVE PLAYING PUZZLE GRID ==================== */}
      {isPlaying && (
        <div className="space-y-4">
          {/* Game Stats Bar */}
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-amber-600" />
              <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                {formatTime(timerSeconds)}
              </span>
            </div>

            <div className="text-center font-bold text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Moves' : 'चाल'}: <span className="font-mono font-black text-amber-600">{moves}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-1 hover:bg-amber-100 transition-colors"
                title="Toggle picture hint"
              >
                {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="text-[10px]">{language === 'en' ? 'Hint' : 'संकेत'}</span>
              </button>

              <button
                onClick={handleStartPuzzle}
                className="p-1.5 rounded-xl bg-white dark:bg-white/10 text-gray-600 hover:text-black dark:hover:text-white"
                title="Restart shuffle"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Hint Overlay (if open) */}
          {showHint && (
            <div className="rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-md">
              <img src={selectedImage.imageUrl} alt="Hint" className="w-full h-36 object-cover" />
            </div>
          )}

          {/* ==================== THE SLIDING TILES GRID ==================== */}
          <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-4 shadow-xl select-none">
            <div 
              className="grid gap-2 aspect-square w-full"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {tiles.map((tileNum, idx) => {
                const isEmpty = tileNum === 0;

                if (isEmpty) {
                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl bg-black/5 dark:bg-black/30 border border-dashed border-gray-300 dark:border-white/10"
                    />
                  );
                }

                // Calculate background slice position for image puzzle
                const originalRow = Math.floor((tileNum - 1) / gridSize);
                const originalCol = (tileNum - 1) % gridSize;
                const posX = (originalCol / (gridSize - 1)) * 100;
                const posY = (originalRow / (gridSize - 1)) * 100;

                return (
                  <button
                    key={idx}
                    onClick={() => handleTileClick(idx)}
                    className="relative rounded-2xl overflow-hidden border-2 border-white/60 dark:border-white/10 shadow-md hover:scale-102 active:scale-98 transition-transform cursor-pointer flex items-center justify-center group"
                    style={{
                      backgroundImage: `url(${selectedImage.imageUrl})`,
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${posX}% ${posY}%`
                    }}
                  >
                    {/* Number badge on tile */}
                    <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-sm text-white font-mono font-black text-xs flex items-center justify-center shadow-sm">
                      {tileNum}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsPlaying(false)}
              className="flex-1 py-3 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold text-xs transition-all"
            >
              {language === 'en' ? 'Choose another temple' : 'अन्य तीर्थ चुनें'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== WIN CELEBRATION MODAL ==================== */}
      {isWon && (
        <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-amber-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full mx-auto bg-amber-500/20 text-4xl flex items-center justify-center animate-bounce shadow-md">
            🏆
          </div>

          <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
            {language === 'en' ? 'Puzzle Solved!' : 'पहेली पूर्ण हुई!'}
          </h2>
          <p className="text-xs text-gray-500">
            {language === 'en' 
              ? `You completed ${selectedImage.name.en} in ${moves} moves (${formatTime(timerSeconds)})!` 
              : `आपने ${moves} चालों में (${formatTime(timerSeconds)}) ${selectedImage.name.hi} को पूर्ण किया!`}
          </p>

          <div className="rounded-2xl overflow-hidden border border-amber-500/40 shadow-lg">
            <img src={selectedImage.imageUrl} alt="Completed" className="w-full h-44 object-cover" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartPuzzle}
              className="flex-1 py-3.5 rounded-2xl bg-[#75390F] text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer"
            >
              {language === 'en' ? 'Play Again' : 'पुनः खेलें'}
            </button>

            <button
              onClick={() => setIsPlaying(false)}
              className="px-5 py-3.5 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold text-sm transition-all"
            >
              {language === 'en' ? 'Choose Image' : 'अन्य चित्र'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
