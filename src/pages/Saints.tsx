import { useState, useEffect } from 'react';
import { Users, Info, Quote, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function SaintsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [saints, setSaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'saints'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSaints(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching saints:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <Users className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          {language === 'en' ? 'JAIN SAINTS' : 'जैन संत'}
        </h1>
      </header>

      {/* Quote Banner */}
      <div className="mb-8 bg-gradient-to-br from-[#FFD54F]/20 to-[#FF6D00]/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-[0_0_30px_rgba(255,213,79,0.15)] border border-[#FFD54F]/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD54F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FFD54F]/30 transition-all duration-700" />
        
        <div className="flex items-center gap-2 text-[#FFD54F] mb-4 relative z-10">
          <Quote size={18} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,213,79,0.5)]">
            {language === 'en' ? 'Quote of the Day' : 'आज का विचार'}
          </span>
        </div>
        
        <p className="text-lg font-medium text-white italic leading-relaxed relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
          {language === 'en' 
            ? '"Do not injure, abuse, oppress, enslave, insult, torment, torture, or kill any creature or living being."'
            : '"किसी भी प्राणी या जीव को चोट न पहुँचाएँ, दुर्व्यवहार न करें, अत्याचार न करें, गुलाम न बनाएँ, अपमान न करें, या न मारें।"'}
        </p>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FFD54F]/50 shadow-[0_0_10px_rgba(255,213,79,0.3)]">
            <img src="https://picsum.photos/seed/mahavir/100/100" alt="Lord Mahavira" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-sm font-bold text-[#FFD54F] tracking-wide">
            — {language === 'en' ? 'Lord Mahavira' : 'भगवान महावीर'}
          </span>
        </div>
      </div>

      <p className="text-gray-400 mb-8 leading-relaxed font-medium bg-[#121212]/80 p-5 rounded-2xl border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {language === 'en'
          ? 'Jain ascetics (Sadhus and Sadhvis) follow strict vows of non-violence, truth, non-stealing, celibacy, and non-attachment. They are the living embodiments of Jain philosophy.'
          : 'जैन मुनि (साधु और साध्वी) अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और अपरिग्रह के कठोर व्रतों का पालन करते हैं। वे जैन दर्शन के जीवित स्वरूप हैं।'}
      </p>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Saints...</p>
          </div>
        ) : saints.length > 0 ? (
          saints.map((saint, idx) => (
          <div key={idx} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left group hover:border-[#FF6D00]/30 hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-4 border-[#1A1A1A] shadow-[0_0_20px_rgba(0,0,0,0.8)] relative group-hover:border-[#FF6D00]/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6D00]/20 to-transparent mix-blend-overlay z-10" />
              <img src={saint.image} alt={saint.name?.en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-2xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#FFD54F] transition-colors">
                {language === 'en' ? saint.name?.en : saint.name?.hi}
              </h2>
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white bg-gradient-to-r ${saint.color} mb-4 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                {language === 'en' ? saint.sect?.en : saint.sect?.hi}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {language === 'en' ? saint.desc?.en : saint.desc?.hi}
              </p>
            </div>
          </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            No saints found.
          </div>
        )}
      </div>
      
      <div className="mt-10 bg-[#FF6D00]/10 border border-[#FF6D00]/20 rounded-2xl p-5 flex gap-4 items-start shadow-[0_0_15px_rgba(255,109,0,0.1)]">
        <Info className="text-[#FF8A65] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(255,138,101,0.8)]" size={24} />
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          {language === 'en'
            ? 'This is a brief list of some prominent modern saints. The Jain tradition has been enriched by thousands of enlightened souls throughout history.'
            : 'यह कुछ प्रमुख आधुनिक संतों की संक्षिप्त सूची है। जैन परंपरा को पूरे इतिहास में हजारों प्रबुद्ध आत्माओं द्वारा समृद्ध किया गया है।'}
        </p>
      </div>

    </div>
  );
}
