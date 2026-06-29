import { useState, useEffect } from 'react';
import { 
  Trophy, RotateCcw, HelpCircle, Star, CheckCircle2, AlertTriangle, 
  ArrowLeft, Brain, Sparkles, Smile, ShieldCheck, Heart, Trash2, 
  TrendingUp, Compass, Award, Gem, Flame, Lightbulb, Zap, Volume2, VolumeX
} from 'lucide-react';
import { cn } from '../lib/utils';

interface GameProps {
  language: string;
  onBack: () => void;
}

// Simple synthesizer sound generator using Web Audio API
const playSynthSound = (type: 'correct' | 'wrong' | 'win' | 'click') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'win') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    }
  } catch (e) {
    console.warn("Web Audio API disabled or blocked:", e);
  }
};

export default function JainKidsGames({ language: lang, onBack }: GameProps) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const handleSound = (type: 'correct' | 'wrong' | 'win' | 'click') => {
    if (!muted) playSynthSound(type);
  };

  const gamesList = [
    {
      id: 'memory_match',
      title: lang === 'en' ? 'Tirthankara Symbol Match' : 'तीर्थंकर और चिन्ह मिलान',
      description: lang === 'en' ? 'Flip cards to match holy Tirthankaras with their sacred animal symbols!' : 'तीर्थंकरों को उनके पवित्र पशु प्रतीकों और चिन्हों के साथ जोड़े और स्मरण शक्ति बढ़ाएं!',
      icon: '🧠',
      color: 'from-pink-500/15 to-purple-500/5 border-pink-500/20 text-pink-500',
      tag: lang === 'en' ? 'Memory Booster' : 'स्मरण शक्ति'
    },
    {
      id: 'punya_paap_buster',
      title: lang === 'en' ? 'Punya vs Paap Karma Sort' : 'पुण्य और पाप कर्मा सॉर्ट',
      description: lang === 'en' ? 'Categorize daily human actions into good (Punya) or bad (Paap) karma!' : 'सच्चाई, चोरी, अहिंसा आदि दैनिक कार्यों को पुण्य और पाप कर्मों के श्रेणी में डालें!',
      icon: '⚖️',
      color: 'from-amber-500/15 to-orange-500/5 border-amber-500/20 text-amber-500',
      tag: lang === 'en' ? 'Moral Ethics' : 'नैतिक आचरण'
    },
    {
      id: 'four_gatis_path',
      title: lang === 'en' ? 'Four Gatis Quest' : 'चार गति चक्र व्यूह',
      description: lang === 'en' ? 'Where do souls migrate? Sort devas, humans, animals, and hell beings!' : 'आत्मा का गमन! देव, मनुष्य, तिर्यंच और नारकीय जीवों को उनकी गति में व्यवस्थित करें!',
      icon: '🌀',
      color: 'from-blue-500/15 to-teal-500/5 border-blue-500/20 text-blue-500',
      tag: lang === 'en' ? 'Dravyashastra' : 'द्रव्य शास्त्र'
    },
    {
      id: 'jain_symbols_quiz',
      title: lang === 'en' ? 'Holy Symbols Identifier' : 'पवित्र जैन प्रतीक पहचान',
      description: lang === 'en' ? 'Learn the deep meanings of Swastika, Dharmachakra, Kalash, and more!' : 'स्वास्तिक, धर्मचक्र, कलश और तीन लोक के गहन अर्थों को चित्रों के माध्यम से समझें!',
      icon: '✨',
      color: 'from-rose-500/15 to-red-500/5 border-rose-500/20 text-rose-500',
      tag: lang === 'en' ? 'Symbolism' : 'प्रतीक चिन्ह'
    },
    {
      id: 'ahimsa_food_picker',
      title: lang === 'en' ? 'Ahimsa Compass Pure Meal' : 'अहिंसा शुद्ध भोजन थाली',
      description: lang === 'en' ? 'Build a 100% pure vegetarian plate. Reject night food and root veggies!' : 'कंदमूल, शहद, रात्रिभोजन त्याग कर बच्चों के लिए सर्वशुद्ध शाकाहारी भोजन थाली बनाएं!',
      icon: '🍏',
      color: 'from-emerald-500/15 to-green-500/5 border-emerald-500/20 text-emerald-500',
      tag: lang === 'en' ? 'Dietary Purity' : 'आहार शुद्धि'
    },
    {
      id: 'baal_bodh_trivia',
      title: lang === 'en' ? 'Pathshala Trivia Challenge' : 'पाठशाला प्रश्नमंच',
      description: lang === 'en' ? 'Show off your knowledge of the 6 substances, 5 sins, and 3 jewels!' : 'षट्द्रव्य, पंच पाप, तीन लोक और त्रिरत्न के विषय में बच्चों के ज्ञान की परीक्षा लें!',
      icon: '📖',
      color: 'from-yellow-500/15 to-amber-500/5 border-yellow-500/20 text-yellow-500',
      tag: lang === 'en' ? 'General Wisdom' : 'सामान्य ज्ञान'
    },
    {
      id: 'tirthankara_order',
      title: lang === 'en' ? 'Chronological Order Lineup' : 'तीर्थंकर क्रम संरेखण',
      description: lang === 'en' ? 'Can you arrange key Tirthankaras from 1st to 24th in perfect sequence?' : 'प्रथम तीर्थंकर श्री आदिनाथ जी से २४वें भगवान महावीर तक के क्रम को सही स्थान दें!',
      icon: '👑',
      color: 'from-cyan-500/15 to-blue-500/5 border-cyan-500/20 text-cyan-500',
      tag: lang === 'en' ? 'History Timeline' : 'काल चक्र क्रम'
    },
    {
      id: 'three_jewels_catch',
      title: lang === 'en' ? 'Ratnatraya Gem Collector' : 'रत्नत्रय संचय खेल',
      description: lang === 'en' ? 'Catch Right Faith, Knowledge, and Conduct. Avoid False beliefs!' : 'ऊपर से गिर रहे सम्यग्दर्शन, ज्ञान, चारित्र के रत्नों को बटोरे और मिथ्यात्व से बचें!',
      icon: '💎',
      color: 'from-violet-500/15 to-indigo-500/5 border-violet-500/20 text-violet-500',
      tag: lang === 'en' ? 'True Philosophy' : 'त्रिरत्न मार्ग'
    },
    {
      id: 'five_vows_unscramble',
      title: lang === 'en' ? '5 Great Vows Word Connect' : '५ महाव्रत शब्द जाल',
      description: lang === 'en' ? 'Unscramble alphabets to spell Ahimsa, Satya, Achaurya, and more!' : 'अक्षरों के हेरफेर को सुलझाकर अहिंसा, सत्य, अचौर्य आदि महाव्रतों के नाम खोजें!',
      icon: '📝',
      color: 'from-orange-500/15 to-yellow-500/5 border-orange-500/20 text-orange-500',
      tag: lang === 'en' ? 'Spelling Practice' : 'वर्तनी अभ्यास'
    },
    {
      id: 'eight_virtues_shield',
      title: lang === 'en' ? '8 Basic Virtues Shield' : '८ मूलगुण रक्षक ढाल',
      description: lang === 'en' ? 'Place the Shravak’s 8 basic virtues into the soul safety shield!' : 'श्रावक के ८ मूलगुण (मद्य, मांस, मधु त्याग आदि) को जीवन रक्षा कवच में स्थापित करें!',
      icon: '🛡️',
      color: 'from-indigo-500/15 to-purple-500/5 border-indigo-500/20 text-indigo-500',
      tag: lang === 'en' ? 'Self Control' : 'मूलगुण आचरण'
    },
    {
      id: 'namokar_connect',
      title: lang === 'en' ? 'Namokar Mantra Line Weaver' : 'णमोकार महामंत्र क्रम संयोजन',
      description: lang === 'en' ? 'Weave and stack the 5 supreme lines of Namokar Mantra in holy order!' : 'णमोकार मंत्र के पंच परमेष्ठी पदों को उनके सही पवित्र आध्यात्मिक क्रम में जोड़ें!',
      icon: '📿',
      color: 'from-amber-600/15 to-red-500/5 border-amber-600/20 text-amber-600',
      tag: lang === 'en' ? 'Divine Chant' : 'मंत्र साधना'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2" id="jain-games-main-view">
      {/* Title block */}
      {!selectedGameId && (
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#121212] border-2 border-indigo-500/20 rounded-[2.5rem] p-6 md:p-8 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
            <button 
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-[10px] uppercase hover:text-[#FF6D00] hover:border-[#FF6D00]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={12} /> {lang === 'en' ? 'Back to Pathshala' : 'पाठशाला वापस'}
            </button>
            <button 
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer"
              title={muted ? "Unmute sounds" : "Mute sounds"}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <h2 className="text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] via-orange-400 to-[#FF8A65] flex items-center justify-center gap-2 drop-shadow-md">
            <Award className="text-orange-500 animate-bounce" size={28} />
            <span>{lang === 'en' ? 'Samyak Jain Kids Playroom' : 'सम्यक् जैन किड्स क्रीड़ांगन'}</span>
          </h2>
          <p className="text-xs text-gray-300 font-bold mt-2.5 max-w-lg mx-auto leading-relaxed">
            {lang === 'en' 
              ? 'Play 10+ high-quality fully animated interactive games to learn core concepts of Jain shastras, symbols, values, and diet rules!'
              : '१०+ उच्च गुणवत्ता वाले मनोरंजक एवं शिक्षाप्रद गेम्स खेलें और खेल-खेल में पंचपरमेष्ठी, आहार शुद्धि और ६ द्रव्यों का ज्ञान बढ़ाएं!'}
          </p>
        </div>
      )}

      {/* Main Grid Selector or Active Game rendering */}
      {!selectedGameId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((g) => (
            <div 
              key={g.id}
              onClick={() => { handleSound('click'); setSelectedGameId(g.id); }}
              className={cn(
                "p-6 rounded-[2rem] border bg-gradient-to-br transition-all duration-300 cursor-pointer hover:scale-[1.02] flex flex-col justify-between h-[230px] shadow-sm relative group overflow-hidden",
                g.color
              )}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{g.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 dark:bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider">
                    {g.tag}
                  </span>
                </div>
                <h3 className="text-base font-serif font-black text-gray-900 dark:text-white leading-tight group-hover:text-orange-500 dark:group-hover:text-[#FF8A65] transition-colors text-left">
                  {g.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1.5 leading-relaxed text-left line-clamp-3">
                  {g.description}
                </p>
              </div>

              <div className="pt-3 text-[9px] font-black text-gray-500 dark:text-gray-400 group-hover:translate-x-1.5 flex items-center gap-1.5 transition-transform text-left">
                <span>{lang === 'en' ? 'TAP TO PLAY GAME' : 'खेलने के लिए क्लिक करें'}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-xl relative animate-in fade-in duration-300 text-left">
          {/* Back to games list button */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-4 mb-6">
            <button
              onClick={() => { handleSound('click'); setSelectedGameId(null); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-black uppercase text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>{lang === 'en' ? 'Back to Games' : 'सभी गेम्स देखें'}</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase text-orange-500 font-serif bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/10">
                🎮 {gamesList.find(g => g.id === selectedGameId)?.title}
              </span>
              <button 
                onClick={() => setMuted(!muted)}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-white"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>

          {/* Individual Game Engines */}
          <div className="min-h-[350px] flex items-center justify-center">
            {selectedGameId === 'memory_match' && <MemoryMatchGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'punya_paap_buster' && <KarmaSortGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'four_gatis_path' && <FourGatisGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'jain_symbols_quiz' && <SymbolsQuizGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'ahimsa_food_picker' && <FoodPickerGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'baal_bodh_trivia' && <TriviaRushGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'tirthankara_order' && <TirthankaraSequenceGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'three_jewels_catch' && <JewelCollectorGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'five_vows_unscramble' && <VowsSpellGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'eight_virtues_shield' && <VirtuesShieldGame lang={lang} onSound={handleSound} />}
            {selectedGameId === 'namokar_connect' && <NamokarConnectGame lang={lang} onSound={handleSound} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 1. TIRTHANKARA SYMBOL MEMORY MATCH ENGINE                                */
/* ========================================================================= */
function MemoryMatchGame({ lang, onSound }: { lang: string; onSound: any }) {
  const symbolPairs = [
    { nameEn: "Adinath", nameHi: "आदिनाथ जी", symEn: "Bull", symHi: "बैल", value: "adinath" },
    { nameEn: "Ajitnath", nameHi: "अजितनाथ जी", symEn: "Elephant", symHi: "हाथी", value: "ajitnath" },
    { nameEn: "Shantinath", nameHi: "शांतिनाथ जी", symEn: "Deer", symHi: "हिरण", value: "shantinath" },
    { nameEn: "Neminath", nameHi: "नेमिनाथ जी", symEn: "Conch", symHi: "शंख", value: "neminath" },
    { nameEn: "Parshvanath", nameHi: "पार्श्वनाथ जी", symEn: "Snake", symHi: "सर्प", value: "parshvanath" },
    { nameEn: "Mahaveer", nameHi: "महावीर जी", symEn: "Lion", symHi: "सिंह", value: "mahaveer" }
  ];

  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    onSound('click');
    let deck: any[] = [];
    symbolPairs.forEach((pair) => {
      deck.push({ id: `t_${pair.value}`, label: lang === 'en' ? pair.nameEn : pair.nameHi, value: pair.value, type: 'tirth' });
      deck.push({ id: `s_${pair.value}`, label: lang === 'en' ? pair.symEn : pair.symHi, value: pair.value, type: 'sym' });
    });
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, [lang]);

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(cards[idx].value)) return;
    onSound('click');
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];
      if (firstCard.value === secondCard.value) {
        setMatched(prev => [...prev, firstCard.value]);
        setFlipped([]);
        onSound('correct');
      } else {
        setTimeout(() => {
          setFlipped([]);
          onSound('wrong');
        }, 1200);
      }
    }
  };

  const isCompleted = matched.length === symbolPairs.length;
  if (isCompleted) onSound('win');

  return (
    <div className="w-full max-w-2xl text-center space-y-6">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
        <span className="text-xs font-black uppercase text-gray-500">{lang === 'en' ? 'Moves:' : 'चालें:'} {moves}</span>
        <span className="text-xs font-black uppercase text-orange-500">{lang === 'en' ? 'Matched:' : 'मिले हुए:'} {matched.length}/{symbolPairs.length}</span>
        <button onClick={initGame} className="p-2 bg-[#FF6D00] text-black rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer">
          <RotateCcw size={10} className="inline mr-1" /> {lang === 'en' ? 'Restart' : 'पुनः प्रारंभ'}
        </button>
      </div>

      {isCompleted ? (
        <div className="py-12 space-y-4 animate-bounce">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Excellent Memory!' : 'उत्कृष्ट स्मरण शक्ति!'}
          </h4>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {lang === 'en' ? 'All Tirthankaras mapped with symbols.' : 'सभी तीर्थंकरों के सही चिन्हों की जोड़ी बनी।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {cards.map((c, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(c.value);
            return (
              <div
                key={c.id}
                onClick={() => handleCardClick(i)}
                className={cn(
                  "h-24 rounded-2xl cursor-pointer flex flex-col items-center justify-center p-3 font-serif transition-all duration-300 text-xs border uppercase select-none text-center",
                  isFlipped 
                    ? "bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-pink-500/30 text-purple-600 dark:text-purple-400 font-black shadow-sm"
                    : "bg-gradient-to-b from-gray-50 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 border-gray-300/60 dark:border-white/5 text-gray-400 font-bold hover:scale-105 hover:bg-gray-300/40"
                )}
              >
                {isFlipped ? (
                  <>
                    <span className="text-[10px] opacity-60 font-sans block mb-1 font-bold">{c.type === 'tirth' ? 'Tirthankara' : 'Symbol'}</span>
                    <span className="leading-tight">{c.label}</span>
                  </>
                ) : (
                  <span className="text-xl">🕉️</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 2. PUNYA VS PAAP KARMAS BUSTER ENGINE                                    */
/* ========================================================================= */
function KarmaSortGame({ lang, onSound }: { lang: string; onSound: any }) {
  const karmaActions = [
    { textEn: "Helping an injured dog", textHi: "घायल कुत्ते की मरहम-पट्टी करना", type: "punya" },
    { textEn: "Telling false stories to hide mistakes", textHi: "गलती छुपाने के लिए झूठ बोलना", type: "paap" },
    { textEn: "Taking food items without permission", textHi: "बिना पूछे किसी की वस्तु उठाना", type: "paap" },
    { textEn: "Chanting Namokar Mantra before sleeping", textHi: "सोने से पूर्व नवकार मंत्र जपना", type: "punya" },
    { textEn: "Saving water while washing hands", textHi: "हाथ धोते समय जल बचाना (अहिंसा)", type: "punya" },
    { textEn: "Stepping on ants on purpose", textHi: "चींटियों को जानबूझकर कुचलना", type: "paap" },
    { textEn: "Respecting and listening to elders", textHi: "माता-पिता और गुरुओं का आदर करना", type: "punya" },
    { textEn: "Wasting food on the plate", textHi: "थाली में झूठा भोजन छोड़ना", type: "paap" }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  const handleChoice = (choice: string) => {
    if (answered !== null) return;
    const correct = karmaActions[idx].type === choice;
    setAnswered(correct);
    if (correct) {
      setScore(prev => prev + 1);
      onSound('correct');
    } else {
      onSound('wrong');
    }

    setTimeout(() => {
      setAnswered(null);
      if (idx + 1 < karmaActions.length) {
        setIdx(idx + 1);
      } else {
        setDone(true);
        onSound('win');
      }
    }, 1500);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setDone(false);
    setAnswered(null);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {done ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Karma Sort Complete!' : 'कर्म वर्गीकरण पूर्ण!'}
          </h4>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Your Score: ${score}/${karmaActions.length}` : `आपका स्कोर: ${score}/${karmaActions.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Play Again' : 'पुनः खेलें'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Action: ${idx + 1}/${karmaActions.length}` : `कार्य: ${idx + 1}/${karmaActions.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Score: ${score}` : `कुल स्कोर: ${score}`}</span>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] text-center min-h-[140px] flex flex-col justify-center relative">
            <h3 className="text-lg font-serif font-black text-gray-950 dark:text-white leading-relaxed">
              "{lang === 'en' ? karmaActions[idx].textEn : karmaActions[idx].textHi}"
            </h3>

            {answered !== null && (
              <div className={cn(
                "absolute inset-0 rounded-[2rem] flex items-center justify-center font-black uppercase tracking-widest text-lg text-white backdrop-blur-xs",
                answered ? "bg-emerald-500/90" : "bg-red-500/90"
              )}>
                {answered 
                  ? (lang === 'en' ? '🌟 CORRECT VIRTUE!' : '🌟 सही आचरण! +१ पुण्य') 
                  : (lang === 'en' ? '⚠️ ACCUMULATES PAAP!' : '⚠️ पाप कर्मा संचय!')}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleChoice('punya')}
              className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs rounded-2xl tracking-widest cursor-pointer shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-xl">☀️</span>
              <span>{lang === 'en' ? 'Punya (Virtue)' : 'पुण्य कर्म'}</span>
            </button>
            <button 
              onClick={() => handleChoice('paap')}
              className="py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-xs rounded-2xl tracking-widest cursor-pointer shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1"
            >
              <span className="text-xl">☁️</span>
              <span>{lang === 'en' ? 'Paap (Vice/Sin)' : 'पाप कर्म'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 3. FOUR GATIS QUEST ENGINE                                               */
/* ========================================================================= */
function FourGatisGame({ lang, onSound }: { lang: string; onSound: any }) {
  const gatis = [
    { id: 'dev', titleEn: "Dev Gati (Heaven)", titleHi: "देव गति", color: "border-sky-500/35 bg-sky-500/5 text-sky-500" },
    { id: 'manushya', titleEn: "Manushya Gati (Human)", titleHi: "मनुष्य गति", color: "border-emerald-500/35 bg-emerald-500/5 text-emerald-500" },
    { id: 'tiryanch', titleEn: "Tiryanch Gati (Animal)", titleHi: "तिर्यंच गति", color: "border-amber-500/35 bg-amber-500/5 text-amber-500" },
    { id: 'narak', titleEn: "Narak Gati (Hell)", titleHi: "नरक गति", color: "border-rose-500/35 bg-rose-500/5 text-rose-500" }
  ];

  const creatures = [
    { nameEn: "Devendra Indralok Resident", nameHi: "स्वर्ग लोक के देव", category: "dev" },
    { nameEn: "Samyak Shravak (Scholar)", nameHi: "दयालु धार्मिक श्रावक", category: "manushya" },
    { nameEn: "Forest Deer eating grass", nameHi: "शाकाहारी वन का हिरण", category: "tiryanch" },
    { nameEn: "Sinful being in darkness", nameHi: "अंधकार में डूबा क्रोधी जीव", category: "narak" },
    { nameEn: "Singing birds in temple gardens", nameHi: "मंदिर उद्यान की कोयल/पक्षी", category: "tiryanch" },
    { nameEn: "Aacharya traveling on foot", nameHi: "पदयात्री जैन दिगंबर मुनिराज", category: "manushya" },
    { nameEn: "Sparkling Deva in vimana", nameHi: "विमान में चमकता हुआ देवपुत्र", category: "dev" }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSort = (targetGati: string) => {
    if (feedback !== null) return;
    const isCorrect = creatures[idx].category === targetGati;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      onSound('correct');
    } else {
      setFeedback('wrong');
      onSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < creatures.length) {
        setIdx(idx + 1);
      } else {
        setFinished(true);
        onSound('win');
      }
    }, 1500);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  return (
    <div className="w-full max-w-2xl text-center space-y-6">
      {finished ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Quest Completed!' : 'चार गति सॉर्ट पूर्ण!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Successful alignments: ${score}/${creatures.length}` : `सफल संयोजन: ${score}/${creatures.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Retry Quest' : 'पुनः खेलें'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Soul State: ${idx + 1}/${creatures.length}` : `जीव अवस्था: ${idx + 1}/${creatures.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Score: ${score}` : `अंक: ${score}`}</span>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] text-center min-h-[120px] flex flex-col justify-center relative overflow-hidden">
            <span className="text-[9px] font-black tracking-widest text-orange-500 block uppercase mb-1">
              {lang === 'en' ? 'Where should this Soul go?' : 'इस आत्मा का गमन किस गति में होगा?'}
            </span>
            <h3 className="text-lg font-serif font-black text-gray-950 dark:text-white leading-relaxed">
              "{lang === 'en' ? creatures[idx].nameEn : creatures[idx].nameHi}"
            </h3>

            {feedback && (
              <div className={cn(
                "absolute inset-0 flex items-center justify-center font-black uppercase text-white tracking-widest text-sm",
                feedback === 'correct' ? "bg-emerald-500/90" : "bg-red-500/90"
              )}>
                {feedback === 'correct' ? '☀️ Perfect Sorting!' : '⚠️ Gati Misalignment! Check Tenets'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gatis.map((g) => (
              <button
                key={g.id}
                onClick={() => handleSort(g.id)}
                className={cn(
                  "py-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 hover:shadow-md text-center flex flex-col justify-center items-center gap-1",
                  g.color
                )}
              >
                <span>{lang === 'en' ? g.titleEn : g.titleHi}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 4. HOLY SYMBOLS IDENTIFIER                                               */
/* ========================================================================= */
function SymbolsQuizGame({ lang, onSound }: { lang: string; onSound: any }) {
  const symbolList = [
    {
      icon: "🕉️",
      titleEn: "Om (Supreme Sound)",
      titleHi: "ओम्",
      descEn: "Stands for the five supreme parameshthis: Arihant, Siddha, Acharya, Upadhya, Muni.",
      descHi: "पंचपरमेष्ठी (अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु) का संकलित अनादि वाचक स्वर चिन्ह।",
      optionsEn: ["Swastika", "Om", "Kalash", "Dharmachakra"],
      optionsHi: ["स्वास्तिक", "ओम्", "कलश", "धर्मचक्र"]
    },
    {
      icon: "📿",
      titleEn: "Chanting Mala (Mantra beads)",
      titleHi: "जप माला",
      descEn: "108 pure beads representing the virtues and attributes of supreme souls.",
      descHi: "१०८ गुणकारी मोतियों की माला, जिसका प्रयोग परमेष्ठियों के गुणों को स्मरण करने के लिए किया जाता है।",
      optionsEn: ["Chanting Mala", "Aura Wheel", "Prabhamandal", "Abhishek Plate"],
      optionsHi: ["जप माला", "आभामंडल", "चक्र", "अभिषेक थाली"]
    },
    {
      icon: "🏺",
      titleEn: "Mangal Kalash (Holy Vessel)",
      titleHi: "मंगल कलश",
      descEn: "Represents pure hydration, wellness, and holy initiation (Abhishek) of Jinendra.",
      descHi: "जिनेन्द्र देव के अभिषेक एवं पवित्र कार्यों के लिए जलपूरित शुद्ध कलश।",
      optionsEn: ["Thali", "Kalash", "Chawri", "Dhwaja"],
      optionsHi: ["थाली", "कलश", "चँवर", "ध्वजा"]
    }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);

  const checkAnswer = (opt: string) => {
    if (answered !== null) return;
    const correctVal = lang === 'en' ? symbolList[idx].titleEn : symbolList[idx].titleHi;
    const isCorrect = opt === correctVal;
    setAnswered(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + 1);
      onSound('correct');
    } else {
      onSound('wrong');
    }

    setTimeout(() => {
      setAnswered(null);
      if (idx + 1 < symbolList.length) {
        setIdx(idx + 1);
      } else {
        setFinished(true);
        onSound('win');
      }
    }, 2000);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {finished ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Symbols Identifier complete!' : 'जैन प्रतीक पहचान चक्र पूर्ण!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Identified: ${score}/${symbolList.length}` : `सही पहचान: ${score}/${symbolList.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Start Again' : 'पुनः प्रारंभ'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Symbol: ${idx + 1}/${symbolList.length}` : `प्रतीक: ${idx + 1}/${symbolList.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Score: ${score}` : `स्कोर: ${score}`}</span>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center relative min-h-[160px]">
            <span className="text-5xl mb-4 animate-pulse">{symbolList[idx].icon}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'en' ? 'Identify this Holy Icon' : 'इस पावन चिन्ह को पहचानो'}</span>

            {answered !== null && (
              <div className="absolute inset-0 bg-black/90 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-white text-center">
                <span className="text-sm font-black text-[#FF6D00] uppercase mb-1">
                  {answered ? '🌟 Correct Recognition!' : '⚠️ Incorrect choice! Learn below:'}
                </span>
                <p className="font-serif font-black text-base">{lang === 'en' ? symbolList[idx].titleEn : symbolList[idx].titleHi}</p>
                <p className="text-[11px] text-gray-300 mt-2 font-semibold leading-relaxed">{lang === 'en' ? symbolList[idx].descEn : symbolList[idx].descHi}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(lang === 'en' ? symbolList[idx].optionsEn : symbolList[idx].optionsHi).map((opt) => (
              <button
                key={opt}
                onClick={() => checkAnswer(opt)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 5. AHIMSA DIET FOOD PICKER ENGINE                                        */
/* ========================================================================= */
function FoodPickerGame({ lang, onSound }: { lang: string; onSound: any }) {
  const foodList = [
    { nameEn: "Fresh Apples", nameHi: "ताजे मीठे सेब", isPure: true, reasonEn: "Pure fruit plucked from tree without injury to plant", reasonHi: "पेड़ को नुकसान पहुँचाए बिना पका हुआ शुद्ध फल" },
    { nameEn: "Potatoes", nameHi: "आलू (कंदमूल)", isPure: false, reasonEn: "Underground roots contain infinite living organisms (Anantkaya)", reasonHi: "जमीन के नीचे उगने वाले कंदमूल में अनंत सूक्ष्म जीव होते हैं" },
    { nameEn: "Honey", nameHi: "शहद", isPure: false, reasonEn: "Obtained by crushing honeycomb causing violence to bees", reasonHi: "मधुमक्खियों के छत्ते को कुचलने से अत्यंत हिंसा पूर्वक बनता है" },
    { nameEn: "Wheat Grains", nameHi: "गेहूं के दाने", isPure: true, reasonEn: "Standard edible grain harvested under peak daylight", reasonHi: "सूर्य के प्रकाश में शुद्धता से तैयार मुख्य खाद्य अनाज" },
    { nameEn: "Onions", nameHi: "प्याज", isPure: false, reasonEn: "Root vegetable, forbidden under strict Shravak vows", reasonHi: "कंदमूल वर्ग की मुख्य निषेध सब्जी, अहिंसा विरोधी है" },
    { nameEn: "Night Cooked Food", nameHi: "रात्रि भोजन", isPure: false, reasonEn: "Breeds countless microbes in lack of sunlight", reasonHi: "सूर्यास्त के बाद अंधेरे में अनगिनत जीवों की उत्पत्ति होती है" },
    { nameEn: "Almonds & Raisins", nameHi: "बादाम एवं किशमिश", isPure: true, reasonEn: "Vetted dry fruits processed dry during daytime", reasonHi: "शुष्क शुद्ध मेवे जो दिन के प्रकाश में छाने और सुखाए जाते हैं" }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const pickFood = (userPick: boolean) => {
    if (feedback !== null) return;
    const isCorrect = foodList[idx].isPure === userPick;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      onSound('correct');
    } else {
      setFeedback('wrong');
      onSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < foodList.length) {
        setIdx(idx + 1);
      } else {
        setFinished(true);
        onSound('win');
      }
    }, 2200);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {finished ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Meal Checklist Pure!' : 'आहार शुद्धि थाली तैयार!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Pure Selections: ${score}/${foodList.length}` : `शुद्ध आहार विवेक: ${score}/${foodList.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Reset Plate' : 'पुनः थाली सजाएं'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Food Item: ${idx + 1}/${foodList.length}` : `खाद्य वस्तु: ${idx + 1}/${foodList.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Score: ${score}` : `अंक: ${score}`}</span>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col justify-center items-center relative min-h-[160px]">
            <span className="text-4xl mb-3">{foodList[idx].isPure ? '🥦' : '🚫'}</span>
            <h3 className="text-xl font-serif font-black text-gray-950 dark:text-white">
              {lang === 'en' ? foodList[idx].nameEn : foodList[idx].nameHi}
            </h3>

            {feedback && (
              <div className="absolute inset-0 bg-black/90 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-white text-center">
                <span className={cn("text-xs font-black uppercase tracking-wider mb-1", feedback === 'correct' ? "text-emerald-400" : "text-rose-400")}>
                  {feedback === 'correct' ? '🌟 CORRECT DIET VOW!' : '⚠️ IMPURE UNDER SHRAVAK DHARMA!'}
                </span>
                <p className="text-[11px] text-gray-300 font-semibold leading-relaxed mt-2">
                  {lang === 'en' ? foodList[idx].reasonEn : foodList[idx].reasonHi}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => pickFood(true)}
              className="py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs rounded-xl cursor-pointer transition-all active:scale-95"
            >
              ✅ {lang === 'en' ? 'Accept (Shuddh)' : 'स्वीकार (शुद्ध आहार)'}
            </button>
            <button 
              onClick={() => pickFood(false)}
              className="py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-xs rounded-xl cursor-pointer transition-all active:scale-95"
            >
              ❌ {lang === 'en' ? 'Reject (Abhakshya)' : 'त्याग (अभक्ष्य वस्तु)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 6. PATHSHALA TRIVIA CHALLENGE ENGINE                                     */
/* ========================================================================= */
function TriviaRushGame({ lang, onSound }: { lang: string; onSound: any }) {
  const triviaQas = [
    {
      qEn: "How many Dravyas (substances) make up the universe in Jainism?",
      qHi: "जैन दर्शन के अनुसार लोक में कुल कितने द्रव्य (Dravyas) होते हैं?",
      options: ["4", "5", "6", "7"],
      answer: "6",
      descEn: "The 6 Dravyas are Jiva, Pudgala, Dharma, Adharma, Akash, and Kala.",
      descHi: "६ द्रव्य: जीव, पुद्गल, धर्म, अधर्म, आकाश और काल हैं।"
    },
    {
      qEn: "Which of these is NOT one of the 3 Jewels (Ratnatraya)?",
      qHi: "इनमें से कौन सा रत्नत्रय (Ratnatraya) में शामिल नहीं है?",
      options: ["Samyak Darshan", "Samyak Tapas", "Samyak Gyan", "Samyak Charitra"],
      answer: "Samyak Tapas",
      descEn: "The 3 Jewels are Samyak Darshan (Faith), Samyak Gyan (Knowledge), and Samyak Charitra (Conduct).",
      descHi: "रत्नत्रय: सम्यग्दर्शन, सम्यग्ज्ञान और सम्यक्चारित्र हैं। तप इनमें अलग है।"
    },
    {
      qEn: "Who is the 24th and final Tirthankara of our present era?",
      qHi: "अविराम चौबीसी के २४वें और अंतिम तीर्थंकर कौन हैं?",
      options: ["Adinath", "Parshvanath", "Neminath", "Mahaveer"],
      answer: "Mahaveer",
      descEn: "Lord Mahaveer is the 24th, following Lord Parshvanath.",
      descHi: "भगवान महावीर हमारे अंतिम २४वें तीर्थंकर हैं।"
    }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const checkAnswer = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    const correct = triviaQas[idx].answer === opt;
    if (correct) {
      setScore(prev => prev + 1);
      onSound('correct');
    } else {
      onSound('wrong');
    }

    setTimeout(() => {
      setSelectedOpt(null);
      if (idx + 1 < triviaQas.length) {
        setIdx(idx + 1);
      } else {
        setCompleted(true);
        onSound('win');
      }
    }, 2500);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {completed ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Trivia Quest Accomplished!' : 'प्रश्नोत्तरी चक्र पूर्ण!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Final Score: ${score}/${triviaQas.length}` : `प्राप्त अंक: ${score}/${triviaQas.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Play Again' : 'पुनः प्रारंभ करें'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Question: ${idx + 1}/${triviaQas.length}` : `प्रश्न: ${idx + 1}/${triviaQas.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Score: ${score}` : `अंक: ${score}`}</span>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] relative min-h-[140px] flex flex-col justify-center">
            <h3 className="text-base font-serif font-black text-gray-900 dark:text-white leading-relaxed">
              {lang === 'en' ? triviaQas[idx].qEn : triviaQas[idx].qHi}
            </h3>

            {selectedOpt !== null && (
              <div className="absolute inset-0 bg-black/95 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-white text-center">
                <span className={cn("text-xs font-black uppercase tracking-wider mb-1", selectedOpt === triviaQas[idx].answer ? "text-emerald-400" : "text-rose-400")}>
                  {selectedOpt === triviaQas[idx].answer ? '🌟 CORRECT ANSWER!' : '⚠️ INCORRECT CHOICE!'}
                </span>
                <p className="text-[11px] text-gray-300 font-semibold leading-relaxed mt-2">
                  {lang === 'en' ? triviaQas[idx].descEn : triviaQas[idx].descHi}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {triviaQas[idx].options.map((opt) => (
              <button
                key={opt}
                onClick={() => checkAnswer(opt)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 7. CHRONOLOGICAL ORDER LINEUP ENGINE                                     */
/* ========================================================================= */
function TirthankaraSequenceGame({ lang, onSound }: { lang: string; onSound: any }) {
  const initialLineup = [
    { nameEn: "Ajitnath (2nd)", nameHi: "अजितनाथ जी (२)", order: 2 },
    { nameEn: "Adinath (1st)", nameHi: "आदिनाथ जी (१)", order: 1 },
    { nameEn: "Mahaveer (24th)", nameHi: "महावीर जी (२४)", order: 24 },
    { nameEn: "Parshvanath (23rd)", nameHi: "पार्श्वनाथ जी (२३)", order: 23 },
    { nameEn: "Neminath (22nd)", nameHi: "नेमिनाथ जी (२२)", order: 22 }
  ];

  const [items, setItems] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setItems([...initialLineup].sort(() => Math.random() - 0.5));
    setSuccess(null);
  }, [lang]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    onSound('click');
    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx - 1];
    newItems[idx - 1] = temp;
    setItems(newItems);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    onSound('click');
    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx + 1];
    newItems[idx + 1] = temp;
    setItems(newItems);
  };

  const checkOrder = () => {
    let sorted = true;
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].order > items[i + 1].order) {
        sorted = false;
        break;
      }
    }
    setSuccess(sorted);
    if (sorted) {
      onSound('win');
    } else {
      onSound('wrong');
    }
  };

  return (
    <div className="w-full max-w-lg text-center space-y-6">
      <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase block">
        {lang === 'en' ? 'Arrange Tirthankaras chronologically (Oldest to Final)' : 'तीर्थंकरों को उनके सही कालानुक्रम (१ से २४) में व्यवस्थित करें'}
      </span>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-3 rounded-xl justify-between">
            <span className="text-xs font-serif font-black text-gray-900 dark:text-white">{lang === 'en' ? item.nameEn : item.nameHi}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => moveUp(idx)} 
                disabled={idx === 0}
                className="px-2 py-1 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded text-[10px] font-bold disabled:opacity-30 cursor-pointer"
              >
                ▲
              </button>
              <button 
                onClick={() => moveDown(idx)} 
                disabled={idx === items.length - 1}
                className="px-2 py-1 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded text-[10px] font-bold disabled:opacity-30 cursor-pointer"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={checkOrder}
          className="py-3 bg-[#FF6D00] text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
        >
          {lang === 'en' ? 'Verify Lineup' : 'क्रम जांचें'}
        </button>

        {success !== null && (
          <div className={cn(
            "p-4 rounded-xl text-xs font-black uppercase tracking-wider text-white",
            success ? "bg-emerald-600" : "bg-rose-600"
          )}>
            {success 
              ? (lang === 'en' ? '🌟 Chronology Perfect! Lord Adinath led the lineup correctly!' : '🌟 अद्भुत! आदिनाथ जी से महावीर जी का क्रम एकदम सही है!')
              : (lang === 'en' ? '⚠️ Sequencing mismatch. Check Tirthankara numbers and rearrange!' : '⚠️ क्रम गलत है! कृपया तीर्थंकरों की संख्या को देखकर पुनः प्रयास करें।')}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 8. RATNATRAYA GEM COLLECTOR ENGINE                                       */
/* ========================================================================= */
function JewelCollectorGame({ lang, onSound }: { lang: string; onSound: any }) {
  const gems = [
    { nameEn: "Samyak Darshan (Right Faith)", nameHi: "सम्यग्दर्शन", isReal: true },
    { nameEn: "Samyak Gyan (Right Knowledge)", nameHi: "सम्यग्ज्ञान", isReal: true },
    { nameEn: "Samyak Charitra (Right Conduct)", nameHi: "सम्यक्चारित्र", isReal: true },
    { nameEn: "Mithyatva (False Belief)", nameHi: "मिथ्यात्व (झूठी श्रद्धा)", isReal: false },
    { nameEn: "Krodha (Anger)", nameHi: "क्रोध कषाय", isReal: false }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rounds, setRounds] = useState(0);

  const chooseGem = (pickReal: boolean) => {
    if (feedback !== null) return;
    const isCorrect = gems[activeIdx].isReal === pickReal;
    setRounds(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      onSound('correct');
    } else {
      setFeedback('wrong');
      onSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setActiveIdx(Math.floor(Math.random() * gems.length));
    }, 1500);
  };

  const restart = () => {
    setScore(0);
    setRounds(0);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      <div className="flex justify-between items-center text-xs font-black uppercase text-gray-500">
        <span>{lang === 'en' ? `Jewels: ${rounds}/8` : `दौर: ${rounds}/8`}</span>
        <span className="text-orange-500">{lang === 'en' ? `Ratnatraya Gems Collected: ${score}` : `रत्न संचय: ${score}`}</span>
      </div>

      {rounds >= 8 ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Ratnatraya Collector Complete!' : 'त्रिरत्न संचय खेल पूर्ण!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Successful gems gathered: ${score}/8` : `सफलतापूर्वक संचित रत्न: ${score}/8`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Restart Collector' : 'पुनः खेलें'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col justify-center items-center relative min-h-[160px]">
            <Gem className={cn("mb-3 animate-bounce", gems[activeIdx].isReal ? "text-cyan-400" : "text-rose-500")} size={36} />
            <span className="text-[9px] font-black tracking-widest uppercase text-gray-400">{lang === 'en' ? 'Identify True Ratnatraya Gem' : 'क्या यह सम्यक् रत्न मार्ग है?'}</span>
            <h3 className="text-lg font-serif font-black text-gray-950 dark:text-white mt-1">
              "{lang === 'en' ? gems[activeIdx].nameEn : gems[activeIdx].nameHi}"
            </h3>

            {feedback && (
              <div className="absolute inset-0 bg-black/95 rounded-[2.5rem] flex items-center justify-center font-black uppercase tracking-widest text-xs text-white">
                {feedback === 'correct' 
                  ? (gems[activeIdx].isReal ? '💎 True Gem collected! +1 Ratnatraya' : '🚫 Successfully avoided Mithyatva/Vices!') 
                  : '⚠️ Misidentified Gem! Remember the 3 Jewels of Soul.'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => chooseGem(true)}
              className="py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black uppercase text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              💎 {lang === 'en' ? 'Collect Gem (Ratna)' : 'संचय करें (सच्चा रत्न)'}
            </button>
            <button 
              onClick={() => chooseGem(false)}
              className="py-3 bg-gradient-to-r from-rose-600 to-red-600 text-white font-black uppercase text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              🚫 {lang === 'en' ? 'Reject (Mithyatva)' : 'त्याग करें (मिथ्यात्व कषाय)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 9. 5 GREAT VOWS WORD CONNECT ENGINE                                      */
/* ========================================================================= */
function VowsSpellGame({ lang, onSound }: { lang: string; onSound: any }) {
  const vows = [
    { scrambled: "SAHIAM", correct: "AHIMSA", descEn: "Non-violence towards all living beings.", descHi: "मन, वचन, काय से किसी जीव को कष्ट न देना।" },
    { scrambled: "YASTA", correct: "SATYA", descEn: "Truthfulness in speech and thought.", descHi: "सदा हित, मित, प्रिय और सत्य वचन बोलना।" },
    { scrambled: "CHRYAAUO", correct: "ACHAURYA", descEn: "Non-stealing; not taking un-given things.", descHi: "बिना दी हुई किसी की वस्तु को ग्रहण न करना।" },
    { scrambled: "PARHIARAGA", correct: "APARIGRAHA", descEn: "Non-possessiveness; limiting desires.", descHi: "बाहरी और आंतरिक परिग्रह एवं इच्छाओं का त्याग।" }
  ];

  const [idx, setIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [success, setSuccess] = useState<boolean | null>(null);

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = inputVal.trim().toUpperCase() === vows[idx].correct;
    setSuccess(correct);
    if (correct) {
      onSound('correct');
    } else {
      onSound('wrong');
    }

    setTimeout(() => {
      setSuccess(null);
      setInputVal('');
      if (correct) {
        if (idx + 1 < vows.length) {
          setIdx(idx + 1);
        } else {
          setIdx(0); // Loop
          onSound('win');
        }
      }
    }, 2200);
  };

  return (
    <div className="w-full max-w-md text-center space-y-6">
      <span className="text-[10px] font-black tracking-widest text-orange-500 uppercase block">
        {lang === 'en' ? 'Unscramble the letters to reveal the Mahavrata' : 'अक्षरों के हेरफेर को सुलझाकर सही महाव्रत का नाम लिखें'}
      </span>

      <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] space-y-4">
        <h4 className="text-3xl font-mono font-black text-[#FF6D00] tracking-widest">{vows[idx].scrambled}</h4>
        
        <form onSubmit={verify} className="space-y-3">
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={lang === 'en' ? 'Type unscrambled word...' : 'सही स्पेलिंग टाइप करें...'}
            className="w-full text-center py-3 px-4 bg-white dark:bg-black border border-gray-300 dark:border-white/10 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6D00] uppercase font-black text-gray-900 dark:text-white"
          />
          <button 
            type="submit"
            className="w-full py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer"
          >
            {lang === 'en' ? 'Submit' : 'जमा करें'}
          </button>
        </form>

        {success !== null && (
          <div className={cn(
            "p-4 rounded-xl text-xs font-black uppercase tracking-wider text-white",
            success ? "bg-emerald-600" : "bg-rose-600"
          )}>
            {success 
              ? (lang === 'en' ? `🌟 CORRECT! "${vows[idx].correct}" - ${vows[idx].descEn}` : `🌟 सही जवाब! "${vows[idx].correct}" - ${vows[idx].descHi}`)
              : (lang === 'en' ? '⚠️ Wrong spelling! Try looking at the letters again.' : '⚠️ गलत वर्तनी! अक्षरों को फिर से ध्यान से देखें।')}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 10. 8 BASIC VIRTUES SHIELD ENGINE                                        */
/* ========================================================================= */
function VirtuesShieldGame({ lang, onSound }: { lang: string; onSound: any }) {
  const items = [
    { nameEn: "Avoid Eating Honey", nameHi: "शहद त्याग (अहिंसा)", isVirtue: true },
    { nameEn: "Avoid 5 Audumbar fruits", nameHi: "पंच उदुम्बर फल त्याग", isVirtue: true },
    { nameEn: "Avoid alcohol (Madya)", nameHi: "मद्य (शराब) त्याग", isVirtue: true },
    { nameEn: "Stealing valuable items", nameHi: "चोरी का भाव रखना", isVirtue: false },
    { nameEn: "Telling lies to friends", nameHi: "मित्रों से झूठ बोलना", isVirtue: false },
    { nameEn: "Avoid non-veg (Maans)", nameHi: "मांस भक्षण त्याग", isVirtue: true }
  ];

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const selectItem = (userIsVirtue: boolean) => {
    if (feedback !== null) return;
    const isCorrect = items[idx].isVirtue === userIsVirtue;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      onSound('correct');
    } else {
      setFeedback('wrong');
      onSound('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 < items.length) {
        setIdx(idx + 1);
      } else {
        setCompleted(true);
        onSound('win');
      }
    }, 2000);
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      {completed ? (
        <div className="py-12 space-y-4">
          <Trophy className="mx-auto text-amber-500" size={54} />
          <h4 className="text-2xl font-serif font-black text-orange-500">
            {lang === 'en' ? 'Virtues Shield Activated!' : 'अष्ट मूलगुण रक्षा कवच तैयार!'}
          </h4>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {lang === 'en' ? `Successful shields: ${score}/${items.length}` : `सही ढाल स्थापना: ${score}/${items.length}`}
          </p>
          <button onClick={restart} className="px-5 py-2.5 bg-[#FF6D00] text-black font-black uppercase text-xs rounded-xl tracking-wider cursor-pointer">
            <RotateCcw size={12} className="inline mr-1.5" /> {lang === 'en' ? 'Start Shield Again' : 'पुनः कवच बनाएं'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
            <span>{lang === 'en' ? `Virtue Element: ${idx + 1}/${items.length}` : `गुण तत्व: ${idx + 1}/${items.length}`}</span>
            <span className="text-orange-500">{lang === 'en' ? `Shield Score: ${score}` : `अंक: ${score}`}</span>
          </div>

          <div className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2.5rem] flex flex-col justify-center items-center relative min-h-[160px]">
            <ShieldCheck className={cn("mb-3 animate-pulse text-indigo-500")} size={38} />
            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{lang === 'en' ? 'Place in Shravak Virtue Shield' : 'क्या यह अष्ट मूलगुण का हिस्सा है?'}</span>
            <h3 className="text-lg font-serif font-black text-gray-950 dark:text-white mt-1">
              "{lang === 'en' ? items[idx].nameEn : items[idx].nameHi}"
            </h3>

            {feedback && (
              <div className="absolute inset-0 bg-black/95 rounded-[2.5rem] flex items-center justify-center font-black uppercase tracking-widest text-xs text-white">
                {feedback === 'correct' 
                  ? '🛡️ Correct placement in Self-Protection Shield!' 
                  : '⚠️ Incorrect! Remember the 8 fundamental virtues of a Jain Shravak.'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => selectItem(true)}
              className="py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              🛡️ {lang === 'en' ? 'Place in Shield' : 'ढाल में स्थापित करें (मूलगुण)'}
            </button>
            <button 
              onClick={() => selectItem(false)}
              className="py-3.5 bg-gray-500 hover:bg-gray-400 text-white font-black uppercase text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              🚫 {lang === 'en' ? 'Discard' : 'अलग करें (अवगुण)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 11. NAMOKAR MANTRA LINE WEAVER ENGINE                                    */
/* ========================================================================= */
function NamokarConnectGame({ lang, onSound }: { lang: string; onSound: any }) {
  const mantraLines = [
    { text: "Namo Arihantanam", hi: "णमो अरिहंताणं", order: 1 },
    { text: "Namo Siddhanam", hi: "णमो सिद्धाणं", order: 2 },
    { text: "Namo Ayariyanam", hi: "णमो आयरियाणं", order: 3 },
    { text: "Namo Uvajjhayanam", hi: "णमो उवज्झायाणं", order: 4 },
    { text: "Namo Loe Savva Sahunam", hi: "णमो लोए सव्वसाहूणं", order: 5 }
  ];

  const [lines, setLines] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setLines([...mantraLines].sort(() => Math.random() - 0.5));
    setSuccess(null);
  }, [lang]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    onSound('click');
    const newLines = [...lines];
    const temp = newLines[idx];
    newLines[idx] = newLines[idx - 1];
    newLines[idx - 1] = temp;
    setLines(newLines);
  };

  const moveDown = (idx: number) => {
    if (idx === lines.length - 1) return;
    onSound('click');
    const newLines = [...lines];
    const temp = newLines[idx];
    newLines[idx] = newLines[idx + 1];
    newLines[idx + 1] = temp;
    setLines(newLines);
  };

  const verifyOrder = () => {
    let sorted = true;
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].order > lines[i + 1].order) {
        sorted = false;
        break;
      }
    }
    setSuccess(sorted);
    if (sorted) {
      onSound('win');
    } else {
      onSound('wrong');
    }
  };

  return (
    <div className="w-full max-w-xl text-center space-y-6">
      <span className="text-[10px] font-black tracking-widest text-[#FF6D00] uppercase block">
        {lang === 'en' ? 'Arrange the lines of Namokar Mantra in sacred order' : 'महामंत्र णमोकार के पदों को उनके पवित्र आध्यात्मिक क्रम में जमाएं'}
      </span>

      <div className="space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 items-center bg-[#FF6D00]/5 border border-[#FF6D00]/20 p-3 rounded-2xl justify-between">
            <span className="text-xs font-serif font-black text-gray-900 dark:text-white">{line.hi}</span>
            <div className="flex gap-1">
              <button 
                onClick={() => moveUp(idx)} 
                disabled={idx === 0}
                className="px-2.5 py-1 bg-[#FF6D00]/10 text-[#FF6D00] rounded-xl text-[10px] font-black disabled:opacity-30 cursor-pointer"
              >
                ▲
              </button>
              <button 
                onClick={() => moveDown(idx)} 
                disabled={idx === lines.length - 1}
                className="px-2.5 py-1 bg-[#FF6D00]/10 text-[#FF6D00] rounded-xl text-[10px] font-black disabled:opacity-30 cursor-pointer"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={verifyOrder}
          className="py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
        >
          {lang === 'en' ? 'Weave Holy Mantra' : 'महामंत्र की जांच करें'}
        </button>

        {success !== null && (
          <div className={cn(
            "p-4 rounded-xl text-xs font-black uppercase tracking-wider text-white",
            success ? "bg-emerald-600" : "bg-rose-600"
          )}>
            {success 
              ? (lang === 'en' ? '🌟 Mantra order Perfect! Chanting Namokar brings eternal peace!' : '🌟 अद्भुत! पंच परमेष्ठी के चरणों में नमन! णमोकार मंत्र का क्रम एकदम सही है!')
              : (lang === 'en' ? '⚠️ Sequence incorrect. Re-weave the sacred lines!' : '⚠️ पदों का क्रम सही नहीं है। परमेष्ठियों के क्रम को ध्यान में रखकर पुनः प्रयास करें।')}
          </div>
        )}
      </div>
    </div>
  );
}
