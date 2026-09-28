import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, Award, CheckCircle2, RotateCcw, Volume2, Printer, Star, Gamepad2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

import MokshaPathGame from './games/MokshaPathGame';
import GyanDeepakGame from './games/GyanDeepakGame';
import JainTambolaGame from './games/JainTambolaGame';
import JainPuzzleGame from './games/JainPuzzleGame';

interface CardItem {
  id: number;
  matchId: number;
  text: string;
  sub: string;
  type: 'tirthankar' | 'symbol';
  isFlipped: boolean;
  isMatched: boolean;
}

const GAME_CARDS_INITIAL = [
  { matchId: 1, tirthankar: 'भगवान ऋषभदेव (आदिनाथ)', symbol: 'बैल (Bull)' },
  { matchId: 2, tirthankar: 'भगवान अजितनाथ', symbol: 'हाथी (Elephant)' },
  { matchId: 3, tirthankar: 'भगवान सम्भवनाथ', symbol: 'घोड़ा (Horse)' },
  { matchId: 4, tirthankar: 'भगवान शान्तिनाथ', symbol: 'हिरण (Deer)' },
  { matchId: 5, tirthankar: 'भगवान पार्श्वनाथ', symbol: 'सर्प (Serpent)' },
  { matchId: 6, tirthankar: 'भगवान महावीर स्वामी', symbol: 'सिंह (Lion)' }
];

export interface JainKidsGamesProps {
  language?: string;
  onBack?: () => void;
}

export default function JainKidsGames({ language: propLanguage, onBack }: JainKidsGamesProps = {}) {
  const navigate = useNavigate();
  const { language: ctxLanguage } = useLanguage();
  const language = propLanguage || ctxLanguage;
  const [activeGameTab, setActiveGameTab] = useState<'match' | 'moksha' | 'gyan' | 'tambola' | 'puzzle' | 'navkar' | 'certificate'>('match');

  // GAME 1: MATCHING CARDS
  const generateDeck = (): CardItem[] => {
    const deck: CardItem[] = [];
    let id = 1;
    GAME_CARDS_INITIAL.forEach(item => {
      deck.push({
        id: id++,
        matchId: item.matchId,
        text: item.tirthankar,
        sub: 'तीर्थंकर प्रभु',
        type: 'tirthankar',
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: id++,
        matchId: item.matchId,
        text: item.symbol,
        sub: 'पवित्र लांछन (चिन्ह)',
        type: 'symbol',
        isFlipped: false,
        isMatched: false
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<CardItem[]>(generateDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedIds.length === 2) return;

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const card1 = cards.find(c => c.id === nextFlipped[0]);
      const card2 = card;

      if (card1 && card1.matchId === card2.matchId) {
        // MATCH!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.matchId === card1.matchId ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setMatchedPairs(p => p + 1);
        }, 500);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            nextFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(generateDeck());
    setFlippedIds([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  // GAME 2: NAVKAR MANTRA FOR KIDS
  const NAVKAR_LINES = [
    { pada: "णमो अरिहंताणं", meaning: "अरिहंत भगवान को मेरा नमस्कार हो (जिन्होंने ४ घातिया कर्मों का नाश किया है)।", icon: "☀️" },
    { pada: "णमो सिद्धाणं", meaning: "सिद्ध भगवान को मेरा नमस्कार हो (जो ८ कर्मों से मुक्त होकर मोक्ष में विराजमान हैं)।", icon: "⭐" },
    { pada: "णमो आयरियाणं", meaning: "आचार्य महाराज को मेरा नमस्कार हो (जो ३६ मूलगुणों से सुशोभित साधु संघ के नायक हैं)।", icon: "📜" },
    { pada: "णमो उवज्झायाणं", meaning: "उपाध्याय महाराज को मेरा नमस्कार हो (जो २५ मूलगुणों के धारक एवं जिनवाणी के शिक्षक हैं)।", icon: "📖" },
    { pada: "णमो लोए सव्वसाहूणं", meaning: "संसार के समस्त साधु-मुनिराजों को मेरा नमस्कार हो (जो २८ मूलगुणों का अखंड पालन करते हैं)।", icon: "🌸" },
    { pada: "एसा पंचणमोक्कारो", meaning: "यह पाँचों पदों को किया गया नमस्कार...", icon: "🕉️" },
    { pada: "सव्वपावप्पणासणो", meaning: "समस्त पापों का सर्वथा नाश करने वाला है।", icon: "🔥" },
    { pada: "मंगलाणं च सव्वेसिं", meaning: "और संसार के समस्त मंगलों में...", icon: "✨" },
    { pada: "पढमं हवइ मंगलं", meaning: "सर्वप्रथम एवं सबसे बड़ा मंगलकारी महामंत्र है!", icon: "👑" },
  ];

  const playSpeech = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'hi-IN';
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  // GAME 3: CERTIFICATE
  const [kidName, setKidName] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [certIssued, setCertIssued] = useState(false);

  const handleGenerateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidName.trim()) {
      alert('कृपया अपना नाम दर्ज करें!');
      return;
    }
    if (q1 === '1' && q2 === '2' && q3 === '1') {
      setCertIssued(true);
    } else {
      alert('कुछ उत्तर सही नहीं हैं। कृपया प्रश्नों को ध्यान से पढ़कर पुनः प्रयास करें!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Games Hub Launcher Banner */}
      <div 
        onClick={() => navigate('/games')}
        className="bg-gradient-to-r from-[#8D4B18] via-[#75390F] to-[#D97706] text-white p-4 sm:p-5 rounded-3xl shadow-lg flex items-center justify-between gap-4 cursor-pointer hover:scale-101 active:scale-99 transition-all group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
            🎲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-serif font-black">
                {language === 'en' ? 'Jain Games & Fun Hub' : 'जैन खेल एवं मनोरंजन हब'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 font-black text-[9px] uppercase tracking-wider">
                NEW
              </span>
            </div>
            <p className="text-xs text-amber-100/90 mt-0.5">
              {language === 'en' 
                ? 'Play Jain Tambola, Gyan Deepak (KBC), Moksha Path & Jain Puzzle' 
                : 'तंबोला (हौजी), ज्ञान दीपक (KBC), मोक्ष मार्ग (ज्ञान चौपड़) एवं तीर्थ पहेली'}
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
          <ArrowRight size={16} />
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'match', hi: '🎯 तीर्थंकर मिलान', en: '🎯 Symbol Match' },
          { id: 'moksha', hi: '🎲 मोक्ष पथ (साँप-सीढ़ी)', en: '🎲 Moksha Path' },
          { id: 'gyan', hi: '💡 ज्ञान दीपक क्विज़', en: '💡 Gyan Deepak' },
          { id: 'tambola', hi: '🎟️ जैन तंबोला', en: '🎟️ Jain Tambola' },
          { id: 'puzzle', hi: '🧩 तीर्थंकर पहेली', en: '🧩 Jigsaw Puzzle' },
          { id: 'navkar', hi: '🕉️ णमोकार सीखो', en: '🕉️ Learn Navkar' },
          { id: 'certificate', hi: '🏆 संस्कार प्रमाण-पत्र', en: '🏆 Certificate' },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveGameTab(tb.id as any)}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
              activeGameTab === tb.id
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-600/20 scale-102"
                : "bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
            )}
          >
            {language === 'en' ? tb.en : tb.hi}
          </button>
        ))}
      </div>

      {/* NEW INTEGRATED GAMES */}
      {activeGameTab === 'moksha' && <MokshaPathGame />}
      {activeGameTab === 'gyan' && <GyanDeepakGame />}
      {activeGameTab === 'tambola' && <JainTambolaGame />}
      {activeGameTab === 'puzzle' && <JainPuzzleGame />}

      {/* 1. MATCHING GAME */}
      {activeGameTab === 'match' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 sm:p-5">
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                तीर्थंकर एवं उनके लांछन (चिन्ह) का मिलान करें!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                कार्ड्स को पलटें और तीर्थंकर प्रभु के साथ उनके सही चिन्ह की जोड़ी बनाएं।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-black bg-white dark:bg-black/30 px-3 py-1.5 rounded-xl border border-amber-500/20">
                जोड़ी: {matchedPairs} / 6
              </span>
              <span className="text-xs font-bold text-gray-500">
                चालें: {moves}
              </span>
              <button
                onClick={resetGame}
                className="p-2 rounded-xl bg-white dark:bg-black/30 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 cursor-pointer"
                title="Restart"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {matchedPairs === 6 && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/40 text-center space-y-2">
              <Trophy size={36} className="mx-auto text-amber-500 animate-bounce" />
              <h4 className="text-lg font-black text-emerald-800 dark:text-emerald-300">
                शानदार! आपने सभी ६ तीर्थंकरों के चिन्ह पहचान लिए!
              </h4>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                कुल चालें: {moves} • धर्म लाभ!
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={cn(
                  "h-28 rounded-2xl p-3 border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none shadow-sm",
                  card.isMatched
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
                    : card.isFlipped
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-950 dark:text-amber-100 scale-102"
                    : "bg-white dark:bg-[#18181b] border-gray-200 dark:border-white/10 hover:border-amber-500/40 hover:scale-102"
                )}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 block tracking-wider">
                      {card.sub}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm leading-tight">
                      {card.text}
                    </h5>
                    {card.isMatched && (
                      <CheckCircle2 size={14} className="text-emerald-500 mx-auto mt-1" />
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <span className="text-2xl opacity-60">🪷</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                      क्लिक करें
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. NAVKAR MANTRA FOR KIDS */}
      {activeGameTab === 'navkar' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            🌸 <strong>णमोकार महामंत्र की महिमा:</strong> यह जैन धर्म का सबसे पावन अनादि मूल मंत्र है। इसमें किसी व्यक्ति विशेष को नहीं, बल्कि उनके विशुद्ध गुणों (पंच परमेष्ठी) को नमस्कार किया गया है।
          </div>

          <div className="grid gap-3">
            {NAVKAR_LINES.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#18181b] border-2 border-amber-500/20 hover:border-amber-500/40 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h4 className="font-serif font-black text-base sm:text-lg text-amber-950 dark:text-amber-100">
                      {item.pada}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => playSpeech(`${item.pada}. अर्थ: ${item.meaning}`)}
                  className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 transition-colors shrink-0 cursor-pointer"
                  title="Listen"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CERTIFICATE GENERATOR */}
      {activeGameTab === 'certificate' && (
        <div className="space-y-6">
          {!certIssued ? (
            <form onSubmit={handleGenerateCert} className="bg-white dark:bg-[#18181b] border-2 border-amber-500/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  🏆 जैन बाल संस्कार प्रश्नोत्तरी एवं सम्मान पत्र
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  नीचे ३ प्रश्नों के सही उत्तर दें और अपने नाम का डिजिटल सम्मान पत्र प्राप्त करें!
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-amber-800 dark:text-amber-300 block mb-1">
                  आपका शुभ नाम (Full Name):
                </label>
                <input
                  type="text"
                  required
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="उदा. आरव जैन"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Q1 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-gray-900 dark:text-white">१. जैन धर्म के प्रथम तीर्थंकर कौन हैं?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q1" value="1" onChange={(e) => setQ1(e.target.value)} />
                    <span>भगवान ऋषभदेव</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q1" value="2" onChange={(e) => setQ1(e.target.value)} />
                    <span>भगवान महावीर</span>
                  </label>
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-gray-900 dark:text-white">२. जैन धर्म का सर्वोच्च मूल मंत्र कौन सा है?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q2" value="1" onChange={(e) => setQ2(e.target.value)} />
                    <span>गायत्री मंत्र</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q2" value="2" onChange={(e) => setQ2(e.target.value)} />
                    <span>णमोकार महामंत्र</span>
                  </label>
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-gray-900 dark:text-white">३. जैन धर्म का सबसे मुख्य सिद्धांत क्या है?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q3" value="1" onChange={(e) => setQ3(e.target.value)} />
                    <span>अहिंसा परमो धर्मः (सभी जीवों पर दया)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q3" value="2" onChange={(e) => setQ3(e.target.value)} />
                    <span>हिंसा करना</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs shadow-md cursor-pointer hover:scale-101 transition-all"
              >
                प्रमाण-पत्र प्राप्त करें (Generate Certificate) →
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* PRINTABLE CERTIFICATE */}
              <div 
                id="jain-cert-frame"
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#18181b] dark:to-[#0f0f10] border-8 border-double border-amber-600 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-4 text-gray-900 dark:text-white relative overflow-hidden"
              >
                <div className="flex justify-center items-center gap-2 text-amber-600">
                  <Star className="fill-current" size={20} />
                  <span className="font-serif font-black text-xl tracking-widest uppercase">
                    ॥ ॐ अर्हं नमः ॥
                  </span>
                  <Star className="fill-current" size={20} />
                </div>

                <h2 className="text-xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
                  जैन बाल संस्कार गौरव प्रमाण-पत्र
                </h2>

                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  Certificate of Jain Values & Excellence
                </p>

                <div className="w-24 h-0.5 bg-amber-500 mx-auto my-2" />

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                  यह प्रमाणित किया जाता है कि
                </p>

                <h3 className="text-2xl sm:text-4xl font-display font-black text-amber-900 dark:text-amber-200 border-b-2 border-amber-500/30 inline-block pb-1 px-6">
                  {kidName}
                </h3>

                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-lg mx-auto font-medium leading-relaxed">
                  ने जैन धर्म के मूल संस्कारों, तीर्थंकरों के ज्ञान एवं णमोकार महामंत्र का ज्ञान प्राप्त कर इस बाल संस्कार परीक्षा को सफलतापूर्वक उत्तीर्ण किया है। हम इनके उज्ज्वल आध्यात्मिक भविष्य की मंगल कामना करते हैं।
                </p>

                <div className="pt-6 flex items-center justify-between text-[10px] sm:text-xs font-black uppercase text-amber-800 dark:text-amber-400 border-t border-amber-500/20">
                  <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                  <span>शुभकामनाएं: जैनिज्म जीपीटी पाठशाला</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-2xl bg-amber-600 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer hover:bg-amber-500"
                >
                  <Printer size={15} />
                  <span>प्रमाण-पत्र प्रिंट / PDF सेव करें</span>
                </button>

                <button
                  onClick={() => setCertIssued(false)}
                  className="px-4 py-2.5 rounded-2xl border border-gray-300 dark:border-white/10 font-bold text-xs cursor-pointer hover:bg-gray-100"
                >
                  पुनः नया प्रमाण-पत्र बनाएं
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
