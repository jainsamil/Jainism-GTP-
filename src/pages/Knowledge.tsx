import { useState, useEffect, useRef } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp, Lightbulb, Microscope, Sparkles, Loader2, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function KnowledgePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { language: lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
        setSpeechError('');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access denied. Please enable it in your browser settings.');
        } else {
          setSpeechError('Error with speech recognition. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const q = query(collection(db, 'knowledge'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setKnowledge(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching knowledge:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'hi-IN';
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const filteredKnowledge = knowledge.filter(item => 
    item.question?.en?.toLowerCase().includes(search.toLowerCase()) || 
    item.question?.hi?.includes(search)
  );

  return (
    <div className="min-h-full p-6 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <BookOpen className="text-[#FF6D00] drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          KNOWLEDGE
        </h1>
      </header>

      {/* Did you know banner */}
      <div className="mb-8 bg-gradient-to-br from-[#00E676]/10 to-[#69F0AE]/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-sm dark:shadow-[0_0_30px_rgba(0,230,118,0.1)] border border-[#00E676]/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00E676]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00E676]/20 transition-all duration-700" />
        
        <div className="flex items-center gap-2 text-[#00C853] dark:text-[#69F0AE] mb-3 relative z-10">
          <Lightbulb size={18} className="drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(105,240,174,0.8)] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Did You Know?</span>
        </div>
        
        <p className="text-gray-800 dark:text-white font-medium leading-relaxed relative z-10">
          {lang === 'en' 
            ? "Jainism is one of the oldest religions in the world, with roots tracing back to the Indus Valley Civilization." 
            : "जैन धर्म दुनिया के सबसे पुराने धर्मों में से एक है, जिसकी जड़ें सिंधु घाटी सभ्यता तक जाती हैं।"}
        </p>
      </div>

      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-[#FF8A65]" size={20} />
          <input
            type="text"
            placeholder={lang === 'en' ? "Search questions..." : "प्रश्न खोजें..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
          />
          <button 
            onClick={toggleListening}
            className={cn(
              "absolute right-4 p-2 rounded-full transition-all",
              isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-gray-400 hover:text-[#FF8A65] hover:bg-[#FF6D00]/10"
            )}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
        {speechError && (
          <p className="text-red-500 text-sm mt-2 ml-2">{speechError}</p>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Wisdom...</p>
          </div>
        ) : filteredKnowledge.length > 0 ? (
          filteredKnowledge.map((item) => {
            const isOpen = openIdx === item.id;
            return (
              <div 
                key={item.id}
                className={cn(
                  "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[1.5rem] border overflow-hidden shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300",
                  isOpen ? "border-[#FF6D00]/50 shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.2)]" : "border-gray-100 dark:border-white/5 hover:border-[#FF6D00]/30"
                )}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className={cn(
                    "font-bold pr-4 transition-colors duration-300",
                    isOpen ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}>
                    {lang === 'en' ? item.question?.en : item.question?.hi}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                    isOpen ? "bg-[#FF6D00]/20 text-[#FF8A65]" : "bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen ? "max-h-[1000px] pb-6 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-6">
                    {/* Jain Reason */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#FF6D00]">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Jain Reason</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {lang === 'en' ? item.jainReason?.en : item.jainReason?.hi}
                      </p>
                    </div>

                    {/* Science Reason */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[#2962FF]">
                        <Microscope size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Science Reason</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {lang === 'en' ? item.scienceReason?.en : item.scienceReason?.hi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="font-bold uppercase tracking-widest text-xs">No questions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
