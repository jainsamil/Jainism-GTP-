import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Sparkles, Trophy, HelpCircle, Gamepad2, 
  ChevronRight, Users, Flame, Dice5, Grid3X3, Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

import JainTambolaGame from '../components/games/JainTambolaGame';
import GyanDeepakGame from '../components/games/GyanDeepakGame';
import MokshaPathGame from '../components/games/MokshaPathGame';
import JainPuzzleGame from '../components/games/JainPuzzleGame';

export default function JainGamesPage() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected game subview ('hub', 'tambola', 'gyan_deepak', 'moksha_path', 'puzzle')
  const [activeGame, setActiveGame] = useState<'hub' | 'tambola' | 'gyan_deepak' | 'moksha_path' | 'puzzle'>('hub');

  // Check URL query param e.g. /games?game=tambola
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const g = params.get('game');
    if (g && ['tambola', 'gyan_deepak', 'moksha_path', 'puzzle'].includes(g)) {
      setActiveGame(g as any);
    }
  }, [location.search]);

  const selectGame = (gameKey: 'tambola' | 'gyan_deepak' | 'moksha_path' | 'puzzle') => {
    setActiveGame(gameKey);
    navigate(`/games?game=${gameKey}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHub = () => {
    setActiveGame('hub');
    navigate('/games', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full p-4 sm:p-6 pb-28">
      {/* If playing a specific game, render that game component */}
      {activeGame === 'tambola' && <JainTambolaGame onBack={backToHub} />}
      {activeGame === 'gyan_deepak' && <GyanDeepakGame onBack={backToHub} />}
      {activeGame === 'moksha_path' && <MokshaPathGame onBack={backToHub} />}
      {activeGame === 'puzzle' && <JainPuzzleGame onBack={backToHub} />}

      {/* ==================== GAMES & FUN HUB (MATCHING SCREENSHOT 2) ==================== */}
      {activeGame === 'hub' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
          {/* Header Bar matching screenshot 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center transition-all cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
                  {language === 'en' ? 'Games & Fun' : 'जैन खेल एवं मनोरंजन'}
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {language === 'en' 
                    ? 'Play together — at home or at your sangh' 
                    : 'परिवार और संघ के साथ खेलें — ज्ञान, संस्कार एवं आनंद'}
                </p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center text-lg">
              🎲
            </div>
          </div>

          {/* ==================== GAME 1: JAIN TAMBOLA (HERO BANNER MATCHING SCREENSHOT 2) ==================== */}
          <div 
            onClick={() => selectGame('tambola')}
            className="bg-gradient-to-br from-[#8D4B18] via-[#75390F] to-[#592B0A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer hover:scale-101 active:scale-99 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                {/* Numbers badge preview 12 45 90 */}
                <div className="flex items-center gap-1.5">
                  <span className="w-9 h-9 rounded-full bg-amber-200/90 text-amber-950 font-serif font-black text-sm flex items-center justify-center shadow-md">
                    12
                  </span>
                  <span className="w-9 h-9 rounded-full bg-amber-200/90 text-amber-950 font-serif font-black text-sm flex items-center justify-center shadow-md">
                    45
                  </span>
                  <span className="w-9 h-9 rounded-full bg-amber-200/90 text-amber-950 font-serif font-black text-sm flex items-center justify-center shadow-md">
                    90
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-black tracking-tight">
                    {language === 'en' ? 'Jain Tambola' : 'जैन तंबोला (हौजी)'}
                  </h2>
                  <p className="text-xs text-amber-200/90 leading-relaxed mt-1">
                    {language === 'en'
                      ? 'The mandal-night classic — digital tickets, zero arguments'
                      : 'मंडल और संघ की पसंदीदा हौजी — डिजिटल टिकट, ६ जैन दावे (पंचपरमेष्ठी से मोक्ष तक)'}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-200 group-hover:text-white transition-colors">
                  <span>{language === 'en' ? 'Play with your sangh' : 'संघ के साथ खेलें'}</span>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== 2-COLUMN GRID (GYAN DEEPAK & MOKSHA PATH) ==================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GAME 2: GYAN DEEPAK (KBC STYLE MATCHING SCREENSHOT 2) */}
            <div
              onClick={() => selectGame('gyan_deepak')}
              className="bg-[#1C1814] text-white border border-amber-900/30 rounded-3xl p-5 shadow-lg flex flex-col justify-between group cursor-pointer hover:border-amber-500/50 hover:scale-101 active:scale-99 transition-all"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
                  🪔
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  ★ KBC-STYLE
                </span>

                <div>
                  <h3 className="text-lg font-serif font-black text-amber-100">
                    {language === 'en' ? 'Gyan Deepak' : 'ज्ञान दीपक'}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                    {language === 'en'
                      ? 'The Jain hot seat — 15 Qs, 2 lifelines • earn Namo Coins'
                      : 'जैन हॉट सीट — १५ सवाल, २ लाइफलाइन, सुरक्षित पड़ाव एवं ज्ञान अंक'}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                <span>{language === 'en' ? 'Take the hot seat' : 'हॉट सीट पर बैठिए'}</span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* GAME 3: MOKSHA PATH (MATCHING SCREENSHOT 2) */}
            <div
              onClick={() => selectGame('moksha_path')}
              className="bg-[#F2ECE1] dark:bg-[#1E1C18] border border-[#DDD5C5] dark:border-amber-950/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between group cursor-pointer hover:border-amber-600/50 hover:scale-101 active:scale-99 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 text-amber-800 dark:text-amber-300 font-black text-xl flex items-center justify-center shadow-sm">
                    🎲
                  </span>
                  <span className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 text-emerald-800 dark:text-emerald-300 font-black text-xl flex items-center justify-center shadow-sm">
                    🪜
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-black text-gray-900 dark:text-white">
                    {language === 'en' ? 'Moksha Path' : 'मोक्ष मार्ग (ज्ञान चौपड़)'}
                  </h3>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                    {language === 'en'
                      ? 'Ladders are virtues, snakes are kashayas — 84 squares'
                      : 'सीढ़ियाँ सद्गुण हैं, सर्प कषाय हैं — ८४ चौकियां, १ फोन पर १-४ खिलाड़ी'}
                  </p>
                </div>

                <div className="space-y-1 text-[10px] text-gray-500 font-medium">
                  <p>🏠 1 phone • 1–4 players</p>
                  <p>⏱️ ~15 min</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#75390F] dark:text-amber-400">
                <span>{language === 'en' ? 'A game for the whole family' : 'सपरिवार खेलें'}</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* ==================== GAME 4: JAIN PUZZLE (MATCHING SCREENSHOT 2) ==================== */}
          <div
            onClick={() => selectGame('puzzle')}
            className="bg-[#232938] text-white rounded-3xl p-5 shadow-lg flex items-center justify-between group cursor-pointer hover:bg-[#2A3144] hover:scale-101 active:scale-99 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner">
                🧩
              </div>
              <div>
                <h3 className="text-base font-serif font-black">
                  {language === 'en' ? 'Jain Puzzle' : 'जैन पहेली (तीर्थ चित्र संयोजन)'}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  {language === 'en'
                    ? 'Rearrange the tiles — Dilwara, Ranakpur, Palitana, 3×3 to 5×5'
                    : 'टुकड़ों को खिसका कर पवित्र तीर्थ चित्र पूर्ण करें — ३×३ से ५×५'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
