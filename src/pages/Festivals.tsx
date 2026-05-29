import { useState, useEffect } from 'react';
import { PartyPopper, Calendar, Sparkles, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { festivalsData as FALLBACK_FESTIVALS } from '../data/festivalsData';

export default function FestivalsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [festivals, setFestivals] = useState<any[]>(FALLBACK_FESTIVALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'festivals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFestivals(data.length > 0 ? data : FALLBACK_FESTIVALS);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching festivals:', error);
      setFestivals(FALLBACK_FESTIVALS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAskAI = (festName: string) => {
    navigate('/chat', { state: { initialPrompt: `Tell me more about the Jain festival of ${festName}. What is its significance and how is it celebrated?` } });
  };

  const upcoming = festivals.length > 0 
    ? festivals.reduce((prev, curr) => ((prev.daysLeft || 0) < (curr.daysLeft || 0) ? prev : curr))
    : null;

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <PartyPopper className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          {language === 'hi' ? 'त्योहार' : 'FESTIVALS'}
        </h1>
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
            <span className="text-[10px] font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,213,79,0.5)]">{language === 'hi' ? 'आगामी त्योहार' : 'Upcoming Festival'}</span>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">{upcoming.name?.[language] || upcoming.name}</h2>
          
          <div className="flex items-end justify-between relative z-10 mt-4">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">{upcoming.daysLeft}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{language === 'hi' ? 'दिन शेष' : 'Days Left'}</span>
            </div>
            <button 
              onClick={() => handleAskAI(upcoming.name?.[language] || upcoming.name)}
              className="px-5 py-2.5 bg-[#FF6D00]/20 hover:bg-[#FF6D00]/40 text-[#FFD54F] rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-[#FF6D00]/30 shadow-[0_0_15px_rgba(255,109,0,0.2)]"
            >
              {language === 'hi' ? 'तैयारी करें' : 'Prepare'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        {!loading && festivals.length > 0 ? (
          festivals.map((fest, idx) => (
            <div key={idx} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 group hover:border-[#FF6D00]/30 hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500">
              <div className="h-48 relative overflow-hidden">
                <img src={fest.image} alt={fest.name?.[language] || fest.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 opacity-80" referrerPolicy="no-referrer" />
                <div className={`absolute inset-0 bg-gradient-to-t ${fest.color || 'from-orange-400 to-amber-500'} mix-blend-multiply opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <h2 className="text-2xl font-display font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">{fest.name?.[language] || fest.name}</h2>
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
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF6D00]/10 to-[#FFD54F]/10 hover:from-[#FF6D00] hover:to-[#FFD54F] text-[#FF8A65] hover:text-black rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-[#FF6D00]/20 hover:border-transparent shadow-[0_0_15px_rgba(255,109,0,0.1)] hover:shadow-[0_0_20px_rgba(255,109,0,0.4)] group/btn"
                  >
                    <Sparkles size={18} className="group-hover/btn:animate-pulse" />
                    {language === 'hi' ? `${fest.name?.[language] || fest.name} के बारे में AI से पूछें` : `Ask AI about ${fest.name?.[language] || fest.name}`}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            {language === 'hi' ? 'कोई त्योहार नहीं मिला।' : 'No festivals found.'}
          </div>
        )}
      </div>
    </div>
  );
}
