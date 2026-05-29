import { useState, useEffect } from 'react';
import { Library, Search, Info, Star, Sparkles, Languages, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { tirthankarData } from '../data/tirthankars';

const FALLBACK_TIRTHANKARS = tirthankarData.map((t, idx) => ({
  ...t,
  number: t.number || (t.kaal === 'Present' ? parseInt(t.id) || idx + 1 : (idx + 1) % 24 || 24)
}));

const categories = ['Present', 'Past', 'Future', 'Videh'];

export default function TirthankarsPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<'Past' | 'Present' | 'Future' | 'Videh'>('Present');
  const [search, setSearch] = useState('');
  const { language: lang } = useLanguage();
  const [selectedT, setSelectedT] = useState<any>(null);
  const [tirthankars, setTirthankars] = useState<any[]>(FALLBACK_TIRTHANKARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tirthankars'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTirthankars(data.length > 0 ? data : FALLBACK_TIRTHANKARS);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tirthankars:', error);
      setTirthankars(FALLBACK_TIRTHANKARS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = tirthankars
    .filter(t => 
      t.kaal === activeCat && 
      (t.name?.en?.toLowerCase().includes(search.toLowerCase()) || 
       t.name?.hi?.includes(search) ||
       t.symbol?.en?.toLowerCase().includes(search.toLowerCase()) ||
       t.symbol?.hi?.includes(search))
    )
    .sort((a, b) => (a.number || 0) - (b.number || 0));

  const featured = tirthankars.find(t => t.id === '24') || tirthankars[0];

  return (
    <div className="min-h-full p-6 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <Library className="text-[#FF6D00] drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
            TIRTHANKARS
          </h1>
        </div>
      </header>

      {/* Featured Banner */}
      {loading ? (
        <div className="mb-8 bg-white/50 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center justify-center border border-gray-200 dark:border-white/5">
          <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
          <p className="font-bold uppercase tracking-widest text-xs text-gray-500">{lang === 'en' ? 'Loading Tirthankars...' : 'तीर्थंकर लोड हो रहे हैं...'}</p>
        </div>
      ) : featured ? (
        <div 
          onClick={() => setSelectedT(featured)}
          className="mb-8 bg-gradient-to-br from-[#FFD54F]/20 to-[#FF6D00]/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-sm dark:shadow-[0_0_30px_rgba(255,213,79,0.15)] border border-[#FFD54F]/30 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD54F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FFD54F]/30 transition-all duration-700" />
          
          <div className="flex items-center gap-2 text-[#FF6D00] dark:text-[#FFD54F] mb-3 relative z-10">
            <Sparkles size={18} className="drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Featured Tirthankar</span>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{lang === 'en' ? featured.name?.en : featured.name?.hi}</h2>
              <p className="text-sm font-bold text-[#FF6D00] dark:text-[#FFD54F] flex items-center gap-1.5">
                <Star size={14} /> Symbol: {lang === 'en' ? featured.symbol?.en : featured.symbol?.hi}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#FFD54F]/20 rounded-full flex items-center justify-center border border-[#FFD54F]/40 shadow-sm dark:shadow-[0_0_15px_rgba(255,213,79,0.3)] group-hover:scale-110 transition-transform">
              <Info size={24} className="text-[#FFD54F]" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8A65]" size={20} />
          <input
            type="text"
            placeholder={lang === 'en' ? "Search by name or symbol..." : "नाम या चिन्ह से खोजें..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat as any)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
              activeCat === cat 
                ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-md dark:shadow-[0_0_15px_rgba(255,109,0,0.6)] scale-105" 
                : "bg-white/80 dark:bg-[#121212]/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/30"
            )}
          >
            {lang === 'en' ? cat : (cat === 'Past' ? 'भूतकाल' : cat === 'Present' ? 'वर्तमान' : cat === 'Future' ? 'भविष्य' : 'विदेह')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Tirthankars...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(t => (
            <div 
              key={t.id} 
              onClick={() => setSelectedT(t)}
              className="bg-white dark:bg-[#121212] p-5 rounded-[2rem] shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 flex flex-col cursor-pointer hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF6D00]/10 to-transparent rounded-bl-[3rem] -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <span className="text-[10px] font-black tracking-widest text-[#FF6D00] dark:text-[#FFD54F] bg-[#FFD54F]/10 border border-[#FFD54F]/20 px-3 py-1 rounded-full uppercase">#{t.number}</span>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[#FF8A65] group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                  <Info size={20} />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-display font-black text-gray-900 dark:text-gray-100 text-xl mb-1 group-hover:text-[#FF6D00] transition-colors">{lang === 'en' ? t.name?.en : t.name?.hi}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <Star size={12} className="text-[#FFD54F]" />
                  <span>Symbol: {lang === 'en' ? t.symbol?.en : t.symbol?.hi}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.color === 'Golden' || t.color === 'Gold' ? '#FFD54F' : t.color === 'Red' ? '#F44336' : t.color === 'White' ? '#FFFFFF' : t.color === 'Blue' ? '#2196F3' : '#000000', border: t.color === 'White' ? '1px solid #ddd' : 'none' }} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t.color}</span>
                </div>
                <div className="text-[10px] font-black text-[#FF6D00] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">View Details →</div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 font-bold tracking-wide">
            {lang === 'en' ? 'No Tirthankars found in this category.' : 'इस श्रेणी में कोई तीर्थंकर नहीं मिला।'}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl dark:shadow-[0_0_50px_rgba(255,109,0,0.2)] border border-gray-200 dark:border-white/10 animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6D00]/5 to-transparent pointer-events-none" />
            
            <div className="bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] p-10 text-black relative shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <button 
                onClick={() => setSelectedT(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full transition-all backdrop-blur-md border border-black/5 z-20"
              >
                ✕
              </button>

              <div className="relative z-10 flex gap-6 items-center">
                <div className="w-24 h-24 shrink-0 rounded-full border-4 border-white/20 overflow-hidden shadow-xl">
                  <img src={`https://picsum.photos/seed/${selectedT.name?.en || 'tirthankar'}/200/200`} alt={selectedT.name?.en} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-2 border border-black/10">
                    <Sparkles size={12} />
                    {lang === 'en' ? selectedT.kaal : (selectedT.kaal === 'Past' ? 'भूतकाल' : selectedT.kaal === 'Present' ? 'वर्तमान' : 'भविष्य')} Tirthankar
                  </div>
                  <h2 className="text-3xl font-display font-black mb-2 tracking-tight leading-none">{lang === 'en' ? selectedT.name?.en : selectedT.name?.hi}</h2>
                  <div className="flex items-center gap-4">
                    <p className="text-black/70 font-bold flex items-center gap-2 text-sm">
                      <Star size={16} className="text-black/40" /> 
                      <span className="opacity-60 uppercase tracking-widest text-[10px]">Symbol:</span> {lang === 'en' ? selectedT.symbol?.en : selectedT.symbol?.hi}
                    </p>
                    <div className="w-px h-4 bg-black/10" />
                    <div className="text-black/70 font-bold flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: selectedT.color === 'Golden' ? '#000' : selectedT.color === 'Red' ? '#F44336' : selectedT.color === 'White' ? '#FFFFFF' : selectedT.color === 'Blue' ? '#2196F3' : '#000000', opacity: 0.3 }} />
                      <span className="opacity-60 uppercase tracking-widest text-[10px]">Color:</span> {selectedT.color}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-10 relative z-10 bg-white dark:bg-[#121212]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200 dark:to-white/10" />
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{lang === 'en' ? 'Biography' : 'जीवनी'}</h4>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200 dark:to-white/10" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium text-center italic px-4">
                  "{lang === 'en' ? selectedT.details?.en : selectedT.details?.hi}"
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#F50057] to-[#FF4081] rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
                  <div className="relative bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-3xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-black text-[#F50057] dark:text-[#FF80AB] uppercase tracking-[0.2em]">The 5 Kalyanaks</h4>
                      <Sparkles size={16} className="text-[#F50057] animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { n: lang === 'en' ? 'Garbha' : 'गर्भ', d: lang === 'en' ? 'Conception' : 'गर्भधारण', desc: lang === 'en' ? 'When the soul descended into the mother\'s womb.' : 'जब आत्मा ने माता के गर्भ में प्रवेश किया।' },
                        { n: lang === 'en' ? 'Janma' : 'जन्म', d: lang === 'en' ? 'Birth' : 'जन्म', desc: lang === 'en' ? 'The birth of the Tirthankara, celebrated by Indras.' : 'तीर्थंकर का जन्म, इन्द्रों द्वारा मनाया गया।' },
                        { n: lang === 'en' ? 'Tapa' : 'तप', d: lang === 'en' ? 'Renunciation' : 'दीक्षा', desc: lang === 'en' ? 'Renouncing worldly life to become an ascetic.' : 'सांसारिक जीवन का त्याग कर मुनि बनना।' },
                        { n: lang === 'en' ? 'Kevalgyan' : 'केवलज्ञान', d: lang === 'en' ? 'Omniscience' : 'केवलज्ञान', desc: lang === 'en' ? 'Attainment of infinite knowledge and enlightenment.' : 'अनंत ज्ञान और आत्मज्ञान की प्राप्ति।' },
                        { n: lang === 'en' ? 'Moksha' : 'मोक्ष', d: lang === 'en' ? 'Liberation' : 'निर्वाण', desc: lang === 'en' ? 'Final liberation from the cycle of birth and death.' : 'जन्म-मरण के चक्र से अंतिम मुक्ति।' }
                      ].map((k, i) => (
                        <div key={k.n} className="flex gap-4 group/item items-start">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-white dark:bg-black/20 flex items-center justify-center text-[10px] font-black text-[#F50057] border border-[#F50057]/20 shadow-sm group-hover/item:scale-110 transition-transform mt-1">
                            0{i + 1}
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{k.n}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">({k.d})</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{k.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
