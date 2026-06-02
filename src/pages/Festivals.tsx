import { useState, useEffect, useMemo } from 'react';
import { PartyPopper, Calendar, Sparkles, Clock, Loader2, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { festivalsData as FALLBACK_FESTIVALS } from '../data/festivalsData';
import SectionAiAgent from '../components/SectionAiAgent';

export default function FestivalsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [festivals, setFestivals] = useState<any[]>(FALLBACK_FESTIVALS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming'>('all');

  useEffect(() => {
    const q = query(collection(db, 'festivals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const preparedSeed = FALLBACK_FESTIVALS.map((seed, idx) => ({ id: `seed_${idx}`, ...seed }));
      
      const merged = [...data];
      preparedSeed.forEach(seed => {
        const isDuplicate = data.some((d: any) => 
          (d.name?.en && d.name.en === seed.name?.en) || 
          (d.name?.hi && d.name.hi === seed.name?.hi)
        );
        if (!isDuplicate) {
          merged.push(seed);
        }
      });

      setFestivals(merged);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching festivals:', error);
      const preparedSeed = FALLBACK_FESTIVALS.map((seed, idx) => ({ id: `seed_${idx}`, ...seed }));
      setFestivals(preparedSeed);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAskAI = (festName: string) => {
    navigate('/chat', { state: { initialPrompt: `Tell me more about the Jain festival of ${festName}. What is its significance and how is it celebrated?` } });
  };

  const upcoming = useMemo(() => {
    if (festivals.length === 0) return null;
    return festivals.reduce((prev, curr) => ((prev.daysLeft || 0) < (curr.daysLeft || 0) ? prev : curr));
  }, [festivals]);

  const filteredFestivals = useMemo(() => {
    return festivals.filter(fest => {
      const name = (fest.name?.[language] || fest.name || '').toLowerCase();
      const desc = (fest.desc?.[language] || fest.desc || '').toLowerCase();
      const tithi = (fest.tithi || '').toLowerCase();
      const date = (fest.date || '').toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = name.includes(searchLower) || desc.includes(searchLower) || tithi.includes(searchLower) || date.includes(searchLower);
      
      if (filterType === 'upcoming') {
        return matchesSearch && (fest.daysLeft !== undefined && fest.daysLeft <= 90);
      }
      return matchesSearch;
    });
  }, [festivals, searchQuery, filterType, language]);

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4 pb-2 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <PartyPopper className="text-[#FF6D00]" size={32} />
            {language === 'hi' ? 'जैन पर्व एवं तिथि पत्रक' : 'JAIN FESTIVALS & CALENDAR'}
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-1 uppercase">
            {language === 'hi' ? '५०+ वार्षिक पर्व, अष्टान्हिका और व्रत तिथियों की ऐतिहासिक संदर्भ' : '50+ sacred annual kalyanaks, ashtahnika observances and vrat details'}
          </p>
        </div>
      </header>

      {/* Upcoming Banner */}
      {loading ? (
        <div className="mb-8 bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center justify-center border border-white/5">
          <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
          <p className="font-bold uppercase tracking-widest text-xs text-gray-500">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading Festivals...'}</p>
        </div>
      ) : upcoming ? (
        <div className="mb-8 bg-gradient-to-br from-[#FF6D00]/20 to-[#FFD54F]/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-[0_0_30px_rgba(255,109,0,0.2)] border border-[#FF6D00]/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6D00]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/30 transition-all duration-700" />
          
          <div className="flex items-center gap-2 text-[#FFD54F] mb-3 relative z-10">
            <Clock size={16} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">{language === 'hi' ? 'निकटतम पावन पर्व' : 'Nearest Holy Festival'}</span>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">{upcoming.name?.[language] || upcoming.name}</h2>
          
          <div className="flex items-end justify-between relative z-10 mt-4">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F]">{upcoming.daysLeft}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{language === 'hi' ? 'दिन शेष' : 'Days Left'}</span>
            </div>
            <button 
              onClick={() => handleAskAI(upcoming.name?.[language] || upcoming.name)}
              className="px-5 py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,109,0,0.4)] cursor-pointer"
            >
              {language === 'hi' ? 'तैयारी एवं पूजन विधान' : 'Prepare details'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Advanced Filter Toolbar */}
      <div className="bg-[#121212]/80 border border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3 text-gray-500" size={16} />
          <input 
            type="text"
            placeholder={language === 'hi' ? "पर्व का नाम, तिथि या विवरण खोजें..." : "Search festival, tithi, or month..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-xs font-bold text-white focus:outline-none focus:border-[#FF6D00]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              filterType === 'all' 
                ? 'bg-[#FF6D00] text-black shadow-md' 
                : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {language === 'hi' ? 'सभी त्योहार' : 'All Festivals'} ({(festivals || []).length})
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              filterType === 'upcoming' 
                ? 'bg-[#FF6D00] text-black shadow-md' 
                : 'bg-[#181818] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {language === 'hi' ? '९० दिनों के अंदर' : 'Within 90 Days'}
          </button>
        </div>
      </div>

      {/* Festivals List */}
      <div className="space-y-8">
        {!loading && filteredFestivals.length > 0 ? (
          filteredFestivals.map((fest, idx) => (
            <div key={idx} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 group hover:border-[#FF6D00]/50 hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500">
              <div className="h-48 relative overflow-hidden">
                <img src={fest.image} alt={fest.name?.[language] || fest.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 opacity-80" referrerPolicy="no-referrer" />
                <div className={`absolute inset-0 bg-gradient-to-t ${fest.color || 'from-orange-400 to-amber-500'} mix-blend-multiply opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] font-mono font-black tracking-wide text-[#FFD54F] uppercase bg-black/45 px-2.5 py-1 rounded-md mb-1.5 inline-block">
                      TITHI: {fest.tithi || 'N/A'}
                    </span>
                    <h2 className="text-2xl font-display font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">{fest.name?.[language] || fest.name}</h2>
                  </div>
                  {fest.daysLeft !== undefined && (
                    <div className="bg-black/45 px-3 py-1.5 rounded-xl border border-white/5 font-mono text-center">
                      <span className="text-xs font-black text-orange-400 block">{fest.daysLeft}</span>
                      <span className="text-[7px] text-gray-405 block uppercase font-bold">{language === 'hi' ? 'दिन शेष' : 'Days'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#FFD54F] font-bold text-xs mb-4 bg-[#FFD54F]/10 border border-[#FFD54F]/20 w-fit px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,213,79,0.1)] uppercase tracking-widest">
                    <Calendar size={14} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
                    {fest.date}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    {fest.desc?.[language] || fest.desc}
                  </p>
                  
                  <button 
                    onClick={() => handleAskAI(fest.name?.[language] || fest.name)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF6D00]/10 to-[#FFD54F]/10 hover:from-[#FF6D00] hover:to-[#FFD54F] text-[#FF8A65] hover:text-black rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-[#FF6D00]/25 hover:border-transparent cursor-pointer shadow-[0_0_15px_rgba(255,109,0,0.1)] hover:shadow-[0_0_20px_rgba(255,109,0,0.4)] group/btn"
                  >
                    <Sparkles size={18} className="group-hover/btn:animate-pulse" />
                    {language === 'hi' ? `${fest.name?.[language] || fest.name} के बारे में AI से पूछें` : `Ask AI about ${fest.name?.[language] || fest.name}`}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="text-center py-16 bg-[#121212]/50 border border-white/5 rounded-3xl text-gray-500 font-bold tracking-wide">
            {language === 'hi' ? 'कोई मेल खाता हुआ कल्याणक/त्योहार नहीं मिला।' : 'No matching festival found in the calendar.'}
          </div>
        )}
      </div>
      <SectionAiAgent section="festivals" />
    </div>
  );
}
