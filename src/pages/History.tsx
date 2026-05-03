import { useState, useEffect } from 'react';
import { Landmark, Clock, Loader2, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'history'), orderBy('period', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTimeline(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching history:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const introText = {
    hi: "जैन धर्म भारत का एक प्राचीन धर्म है जो सिखाता है कि मुक्ति और आनंद का मार्ग अहिंसा और त्याग का जीवन जीना है।",
    en: "Jainism is an ancient religion from India that teaches that the way to liberation and bliss is to live lives of harmlessness and renunciation."
  };

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <Landmark className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          {language === 'hi' ? 'इतिहास' : 'HISTORY'}
        </h1>
      </header>

      <p className="text-gray-400 mb-10 leading-relaxed font-medium bg-[#121212]/80 p-5 rounded-2xl border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {introText[language]}
      </p>

      <div className="relative border-l-2 border-[#FF6D00]/30 ml-4 space-y-10 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading History...'}</p>
          </div>
        ) : timeline.length > 0 ? (
          timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 group">
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-[#050505] ${item.color || 'bg-orange-500'} shadow-[0_0_10px_rgba(255,109,0,0.8)] group-hover:scale-125 transition-transform duration-300`} />
              
              <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 group-hover:border-[#FF6D00]/30 group-hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#FFD54F] font-bold text-[10px] uppercase tracking-widest mb-3 bg-[#FFD54F]/10 border border-[#FFD54F]/20 w-fit px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,213,79,0.1)]">
                    <Clock size={14} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
                    {item.period}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#FFD54F] transition-colors">
                    {item.title?.[language] || item.title}
                  </h3>
                  {item.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title?.[language] || item.title} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    {item.desc?.[language] || item.desc || item.content?.[language] || item.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            {language === 'hi' ? 'कोई इतिहास डेटा नहीं मिला।' : 'No history data found.'}
          </div>
        )}
      </div>
    </div>
  );
}
