import { useState, useEffect, useRef } from 'react';
import { ScrollText, Search, BookOpen, Info, Loader2, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Pujan', 'Stuti', 'Vidhan', 'Chalisa', 'Bhajan', 'Aarti'];

export default function AagamsPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Pujan');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [aagams, setAagams] = useState<any[]>([]);
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

    const q = query(collection(db, 'aagams'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAagams(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching aagams:', error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = 'hi-IN'; // Aagams are mostly Hindi
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItem]);

  const filtered = aagams.filter(item => 
    item.category === activeCat && 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full p-6 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <ScrollText className="text-[#FF6D00] drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
            JIN VANI
          </h1>
        </div>
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-[#FF8A65] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all shadow-sm"
        >
          <span className="text-xs font-bold">{language === 'en' ? 'A/अ' : 'अ/A'}</span>
        </button>
      </header>

      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-[#FF8A65]" size={20} />
          <input
            type="text"
            placeholder="खोजें..."
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

      <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
              activeCat === cat 
                ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-md dark:shadow-[0_0_15px_rgba(255,109,0,0.6)] scale-105" 
                : "bg-white/80 dark:bg-[#121212]/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Aagams...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 flex items-center justify-between hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF6D00]/10 text-[#FF8A65] rounded-2xl flex items-center justify-center shrink-0 border border-[#FF6D00]/20 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">{item.title}</h3>
                  <span className="text-[10px] font-black tracking-widest text-[#FFD54F] bg-[#FFD54F]/10 border border-[#FFD54F]/20 px-2.5 py-1 rounded-md uppercase mt-1 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FF6D00] transition-colors">
                <Info size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            इस श्रेणी में कुछ नहीं मिला।
          </div>
        )}
      </div>

      {/* Content Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl dark:shadow-[0_0_50px_rgba(255,109,0,0.2)] border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            <div className="bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] p-8 text-black relative shrink-0">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-sm"
              >
                ✕
              </button>
              <div className="inline-block px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase mb-3 border border-black/10">
                {selectedItem.category}
              </div>
              <h2 className="text-3xl font-display font-black">{selectedItem.title}</h2>
            </div>
            
            <div className="p-8 overflow-y-auto bg-white dark:bg-[#121212]">
              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-center font-medium">
                  {selectedItem.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
