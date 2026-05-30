import { useState, useEffect } from 'react';
import { Quote, Share2, Heart, ChevronLeft, ChevronRight, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FALLBACK_VICHAARS, getDeterministicVichaar } from '../data/vichaarData';

export default function VichaarPage() {
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
      <header className="flex items-center justify-between mb-8 pt-4 shrink-0">
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <Quote className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          DAILY VICHAAR
        </h1>
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
    </div>
  );
}
