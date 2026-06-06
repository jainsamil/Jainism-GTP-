import { useState, useEffect } from 'react';
import { Quote, Share2, Heart, ChevronLeft, ChevronRight, Copy, Check, Loader2, ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FALLBACK_VICHAARS, getDeterministicVichaar } from '../data/vichaarData';
import SectionAiAgent from '../components/SectionAiAgent';
import { useLanguage } from '../contexts/LanguageContext';

export default function VichaarPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [quotes, setQuotes] = useState<any[]>(FALLBACK_VICHAARS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'vichaar'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      const activeQuotes = data.length > 0 ? data : FALLBACK_VICHAARS;
      setQuotes(activeQuotes);
      
      // Determine daily quote and find its index to start synchronously from that quote
      const daily = getDeterministicVichaar(activeQuotes);
      const matchedIndex = activeQuotes.findIndex(q => q.hi === daily.hi);
      if (matchedIndex !== -1) {
        setCurrentIndex(matchedIndex);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching vichaar:', error);
      setQuotes(FALLBACK_VICHAARS);
      const daily = getDeterministicVichaar(FALLBACK_VICHAARS);
      const matchedIndex = FALLBACK_VICHAARS.findIndex(q => q.hi === daily.hi);
      if (matchedIndex !== -1) {
        setCurrentIndex(matchedIndex);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setCopied(false);
  };
  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setCopied(false);
  };

  const toggleLike = () => {
    setLiked(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleShare = async () => {
    const quote = quotes[currentIndex];
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Jain Vichaar',
          text: `${quote.hi}\n\n${quote.en}\n\n- ${quote.source}\n\nShared via Jainism GPT`,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    }
  };

  const handleCopy = () => {
    const quote = quotes[currentIndex];
    navigator.clipboard.writeText(`${quote.hi}\n\n${quote.en}\n\n- ${quote.source}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">Loading Vichaar...</p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200 flex flex-col items-center justify-center">
        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">No Vichaar found.</p>
      </div>
    );
  }

  const quote = quotes[currentIndex];

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] flex flex-col text-gray-200">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 pt-4 pb-4 mb-6 border-b border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 shadow-sm hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate flex items-center gap-2">
            <Quote className="text-[#FF6D00] shrink-0" size={18} />
            <span className="truncate">{language === 'en' ? 'DAILY JAIN VICHAAR' : 'दैनिक जैन विचार'}</span>
          </h1>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm animate-none"
            title={language === 'en' ? 'Vichaar Section Guide' : 'विचार विभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Inline Header Translator Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
            title="Translate Language / भाषा बदलें"
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6D00]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative group w-full max-w-md aspect-square">
          <div className={cn(
            "absolute -inset-1 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 bg-gradient-to-br",
            quote.color
          )} />
          
          <div className={cn(
            "w-full h-full rounded-[3rem] p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-700 border border-white/10",
            "bg-[#121212]/90 backdrop-blur-2xl"
          )}>
            {/* Decorative Elements */}
            <div className={cn("absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-br mix-blend-overlay", quote.color)} />
            <Quote size={160} className="absolute -top-10 -left-10 text-white/5 rotate-180 drop-shadow-2xl" />
            <Quote size={160} className="absolute -bottom-10 -right-10 text-white/5 drop-shadow-2xl" />
            
            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">
                "{quote.hi}"
              </h2>
              
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#FFD54F]/50 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#FFD54F] shadow-[0_0_10px_rgba(255,213,79,0.8)]" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#FFD54F]/50 rounded-full" />
              </div>
              
              <p className="text-lg sm:text-xl text-gray-300 font-bold drop-shadow-md leading-relaxed">
                "{quote.en}"
              </p>
              
              <div className="pt-4">
                <p className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[#FFD54F] font-black tracking-widest uppercase text-[10px] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {quote.source}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <button onClick={prevQuote} className="absolute left-0 sm:-left-4 p-4 bg-[#1A1A1A]/80 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 text-gray-400 hover:text-[#FFD54F] hover:border-[#FFD54F]/30 hover:scale-110 transition-all duration-300 z-20">
          <ChevronLeft size={28} />
        </button>
        <button onClick={nextQuote} className="absolute right-0 sm:-right-4 p-4 bg-[#1A1A1A]/80 backdrop-blur-xl rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 text-gray-400 hover:text-[#FFD54F] hover:border-[#FFD54F]/30 hover:scale-110 transition-all duration-300 z-20">
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="flex justify-center gap-8 mt-12 shrink-0 relative z-20">
        <button 
          onClick={toggleLike}
          className={cn(
            "w-16 h-16 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300 border",
            liked[currentIndex] 
              ? "bg-[#F50057]/10 border-[#F50057]/30 shadow-[0_0_20px_rgba(245,0,87,0.2)]" 
              : "bg-[#1A1A1A]/80 border-white/10 hover:border-white/30 backdrop-blur-xl"
          )}
        >
          <Heart size={28} className={cn("transition-colors duration-300", liked[currentIndex] ? "fill-[#F50057] text-[#F50057] drop-shadow-[0_0_8px_rgba(245,0,87,0.8)]" : "text-gray-400")} />
        </button>
        <button 
          onClick={handleCopy}
          className="w-16 h-16 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 hover:border-[#00E676]/30 hover:bg-[#00E676]/10 transition-all duration-300 text-gray-400 hover:text-[#69F0AE] group"
        >
          {copied ? <Check size={28} className="text-[#00E676] drop-shadow-[0_0_8px_rgba(0,230,118,0.8)]" /> : <Copy size={28} className="group-hover:drop-shadow-[0_0_8px_rgba(105,240,174,0.8)]" />}
        </button>
        <button 
          onClick={handleShare}
          className="w-16 h-16 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-110 hover:border-[#2962FF]/30 hover:bg-[#2962FF]/10 transition-all duration-300 text-gray-400 hover:text-[#82B1FF] group"
        >
          <Share2 size={28} className="group-hover:drop-shadow-[0_0_8px_rgba(130,177,255,0.8)]" />
        </button>
      </div>
      <SectionAiAgent section="vichaar" />

      {/* JBT Premium Help Modal for Vichaar */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {language === 'en' ? 'VICHAAR USER GUIDE' : 'विचार निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {language === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch requested in help modal */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10">
              <span className="text-[10px] font-black uppercase text-gray-400">
                {language === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4 text-left text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {language === 'en' ? 'Welcome to Daily Jain Vichaar!' : 'दैनिक जैन विचार पटल में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'Reflect deeply on teachings from great spiritual leaders and sacred scriptures, and share divine insights daily.' 
                  : 'महान आचार्यों, संतों और प्राचीन जैन दर्शन के दिव्य चिंतनशील विचारों का नित्य मनन करें और शेयर करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Daily Up-to-date Quotes:' : 'नित्य नए चिंतनशील विचार:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Get access to unique pure Jain thoughts synced beautifully across different spiritual lineages.' 
                    : 'नित्य प्रति अलग-अलग आगमों व संतों के दिव्य विचारों का मनन प्राप्त करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Copy & Share Instantly:' : 'कॉपी और सीधा साझा करें:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Simply click Copy to save standard quote text, or tap Share to distribute directly via WhatsApp, Instagram or social channels.' 
                    : 'कॉपी बटन द्वारा सीधा किसी को भी भेजें, या शेयर बटन से सीधे सोशल मीडिया पर फैलाएं।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Lineages Respect:' : 'सभी संप्रदायों का आदर:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Contains insights from across Digambara and Shvetambara canonical texts, promoting global peace.' 
                    : 'दिगंबर व श्वेतांबर दोनों परंपराओं के सुंदर आगम वचनों का अनूठा संग्रह।'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
