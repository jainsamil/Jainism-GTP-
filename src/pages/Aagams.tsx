import { useState, useEffect, useRef } from 'react';
import { 
  ScrollText, 
  Search, 
  BookOpen, 
  Info, 
  Loader2, 
  Mic, 
  MicOff, 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  Music, 
  Compass, 
  Settings, 
  Star,
  Globe 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import SectionAiAgent from '../components/SectionAiAgent';

import { aagamsData } from '../data/aagamsData';

const categories = ['Pujan', 'Stuti', 'Vidhan', 'Chalisa', 'Bhajan', 'Aarti'];

const FALLBACK_AAGAMS = aagamsData;

export default function AagamsPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Pujan');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [aagams, setAagams] = useState<any[]>(FALLBACK_AAGAMS);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);

  // New features
  const [favorites, setFavorites] = useState<string[]>([]);
  const [chantedLog, setChantedLog] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(20); // default 20px
  const [readerTheme, setReaderTheme] = useState<'parchment' | 'light' | 'dark' | 'midnight'>('parchment');
  const [autoscroll, setAutoscroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);

  const [showAiModal, setShowAiModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const readerRef = useRef<HTMLDivElement>(null);

  // Load Bookmarks & Chanted status from LocalStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('aagam_bookmarks');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedChants = localStorage.getItem('aagam_chanted_log');
    if (savedChants) {
      setChantedLog(JSON.parse(savedChants));
    }
  }, []);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = favorites.includes(id) 
      ? favorites.filter(fav => fav !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('aagam_bookmarks', JSON.stringify(updated));
  };

  const handleToggleChanted = (id: string) => {
    const updated = chantedLog.includes(id) 
      ? chantedLog.filter(c => c !== id) 
      : [...chantedLog, id];
    setChantedLog(updated);
    localStorage.setItem('aagam_chanted_log', JSON.stringify(updated));
  };

  // Hands-Free Autoscroll engine
  useEffect(() => {
    let intervalId: any;
    if (autoscroll && selectedItem) {
      const ms = scrollSpeed === 'slow' ? 70 : scrollSpeed === 'medium' ? 40 : 20;
      intervalId = setInterval(() => {
        if (readerRef.current) {
          readerRef.current.scrollTop += 1;
        }
      }, ms);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoscroll, selectedItem, scrollSpeed]);

  // Handle Speech Synthesis TTS Chanting
  const toggleTTSChant = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!selectedItem) return;
      window.speechSynthesis.cancel();
      // clean content of formatting markers
      const cleanText = selectedItem.content
        .replace(/॥/g, '')
        .replace(/ॐ ह्रीं श्रीं/g, 'ओम ह्रीम श्रीम')
        .replace(/ॐ ह्रीं/g, 'ओम ह्रीम')
        .replace(/स्वाहा/g, 'स्वाहा');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'hi-IN';
      utterance.rate = speechRate;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Auto-assign premium Google / neural / high-quality Hindi voice if available
      const allVoices = window.speechSynthesis.getVoices();
      const premiumVoice = allVoices.find(v => 
        (v.lang.startsWith('hi') || v.lang.startsWith('sa')) && 
        (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural'))
      ) || allVoices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
      
      if (premiumVoice) {
        utterance.voice = premiumVoice;
      }

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Update speech speed live
  useEffect(() => {
    if (isSpeaking && selectedItem) {
      // restart with updated speed
      toggleTTSChant();
      toggleTTSChant();
    }
  }, [speechRate]);

  // Cleanup speech on modal close / navigate
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTitle.trim()) return;
    if (!adminPassword.trim()) {
      setAiError(language === 'en' ? 'Admin passcode is required.' : 'प्रशासक पासवर्ड आवश्यक है।');
      return;
    }
    setIsAiGenerating(true);
    setAiError('');
    try {
      const response = await fetch('/api/gemini/generate-scripture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: aiTitle, category: activeCat, adminPassword }),
      });
      const data = await response.json();
      if (response.ok && data.content) {
        const newDoc = {
          title: aiTitle,
          category: activeCat,
          content: data.content,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'aagams'), newDoc);
        setAiTitle('');
        setAdminPassword('');
        setShowAiModal(false);
      } else {
        setAiError(data.error || 'Failed to generate scripture');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Connection failed. Please check setup.');
    } finally {
      setIsAiGenerating(false);
    }
  };

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
      const firebaseDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const merged = [...FALLBACK_AAGAMS];
      // append unique user-created documents
      firebaseDocs.forEach((doc: any) => {
        if (!merged.some(item => item.id === doc.id || item.title === doc.title)) {
          merged.push(doc);
        }
      });
      setAagams(merged);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching aagams:', error);
      setAagams(FALLBACK_AAGAMS);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = 'hi-IN'; // Aagams are mostly Hindi
        recognitionRef.current.start();
        setIsListening(true);
      }
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

  // Helper variables and handlers for Next / Previous item navigation inside the Jinvani reader
  const activeList = selectedItem ? aagams.filter(item => item.category === selectedItem.category) : [];

  const currentIndex = selectedItem ? activeList.findIndex(item => item.id === selectedItem.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < activeList.length - 1;

  const handlePrevItem = () => {
    if (hasPrev) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSelectedItem(activeList[currentIndex - 1]);
      if (readerRef.current) {
        readerRef.current.scrollTop = 0;
      }
    }
  };

  const handleNextItem = () => {
    if (hasNext) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSelectedItem(activeList[currentIndex + 1]);
      if (readerRef.current) {
        readerRef.current.scrollTop = 0;
      }
    }
  };

  return (
    <div className="min-h-full p-4 md:p-6 pb-28 bg-gray-50 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header with language switcher and help inline */}
      <header className="sticky top-0 z-45 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-4 -mt-4 px-4 py-4 md:-mx-6 md:-mt-6 md:px-6 md:py-4 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4 mb-6 pt-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-saffron to-coral flex items-center gap-1.5 sm:gap-2 truncate">
              <ScrollText className="text-saffron shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="truncate">JINVANI LIBRARY</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-[#FF806A] font-black uppercase tracking-widest truncate hidden xs:block">
              {language === 'en' ? 'Authentic Digambar Jain Shastras' : 'परम पूज्य दिगंबर जैन जिनवाणी भंडार'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-2xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200/50 dark:border-white/5 h-10 w-10 flex items-center justify-center shrink-0 animate-in fade-in"
            title={language === 'en' ? 'Jinvani Section Guide' : 'जिनवाणी निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-2xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30 shrink-0"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={14} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Intro info box */}
      <div className="mb-6 bg-gradient-to-r from-saffron/10 to-coral/5 rounded-3xl p-5 border border-saffron/10 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center shrink-0 border border-saffron/10">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase text-saffron tracking-wider block mb-0.5">
            {language === 'en' ? 'Sacred Jinvani Repository' : 'परम पावन मन्दिर स्वाध्याय'}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {language === 'en' 
              ? "All holy Pujans, Stutis, Vidhans and Chalisas are provided in full detail without any missing verses. Enable the Full-Screen reader below to start chanting."
              : "समस्त पूजा, भक्ति, चालीसा एवं दशलक्षण/सिद्धचक्र विधान मंत्र यहाँ पूर्ण रूप में उपलब्ध हैं। स्वाध्याय या मंदिर जी में पाठ हेतु पूर्ण स्क्रीन रीडर सक्रिय करें।"}
          </p>
        </div>
      </div>

      {/* Bookmarked / Pin Section */}
      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-black text-saffron uppercase tracking-widest block mb-2.5 flex items-center gap-1.5">
            <Star size={12} className="fill-saffron text-saffron" />
            {language === 'en' ? 'Your Bookmarked Prayers' : 'आपके प्रिय पाठ / चालीसा'}
          </h2>
          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
            {aagams
              .filter(item => favorites.includes(item.id))
              .map(item => (
                <button
                  key={`fav-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  className="px-4.5 py-3 rounded-2xl text-xs font-black bg-white dark:bg-[#121212] hover:bg-saffron/10 border border-saffron/20 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm hover:scale-102"
                >
                  <BookOpen size={13} className="text-saffron" />
                  <span className="max-w-[150px] truncate">{item.title}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-6 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-saffron to-coral rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-saffron" size={18} />
          <input
            type="text"
            placeholder={language === 'en' ? "Search Pujans, Stotra, Bhajan..." : "पूजन, भक्ति, चालीसा खोजें..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-gray-150 dark:border-white/5 rounded-2xl pl-11 pr-11 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron/50 shadow-sm transition-all"
          />
          <button 
            onClick={toggleListening}
            className={cn(
              "absolute right-4 p-1.5 rounded-full transition-all cursor-pointer",
              isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-gray-400 hover:text-saffron hover:bg-saffron/10"
            )}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>
        {speechError && (
          <p className="text-red-500 text-xs mt-1.5 ml-2">{speechError}</p>
        )}
      </div>

      {/* Category selector slider */}
      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2.5">
        {language === 'en' ? 'Filter by Category' : 'श्रेणी अनुसार ग्रंथ चयन'}
      </h2>
      <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCat(cat);
              setSearch('');
            }}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-300 pointer-events-auto cursor-pointer",
              activeCat === cat 
                ? "bg-gradient-to-r from-saffron to-coral text-white shadow-md shadow-saffron/20 scale-103" 
                : "bg-white dark:bg-[#121212] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:border-saffron/30"
            )}
          >
            {language === 'en' ? cat : (
              cat === 'Pujan' ? 'देव देव पूजा' :
              cat === 'Stuti' ? 'स्तुति पाठ' :
              cat === 'Vidhan' ? 'विधान संग्रह' :
              cat === 'Chalisa' ? 'चालीसा संग्रह' :
              cat === 'Bhajan' ? 'मधुर भजन' : 'मंगल आरती'
            )}
          </button>
        ))}
      </div>

      {/* Aagams list */}
      <div className="grid gap-3.5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4 text-saffron" size={40} />
            <p className="font-bold tracking-widest text-[10px] uppercase text-saffron">Loading jin vani library...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item, idx) => {
            const isBookmarked = favorites.includes(item.id);
            const isRead = chantedLog.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="bg-white dark:bg-[#121212] p-4.5 rounded-2xl shadow-sm border border-gray-150 dark:border-white/5 flex items-center justify-between hover:border-saffron/40 hover:scale-[1.01] hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                {/* Visual marker */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-saffron to-coral rounded-r-md opacity-20 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 relative z-10 w-[80%]">
                  <div className="w-11 h-11 bg-saffron/5 text-saffron rounded-xl flex items-center justify-center shrink-0 border border-saffron/10 group-hover:scale-105 transition-all">
                    {activeCat === 'Bhajan' ? <Music size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div className="truncate">
                    <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-base leading-snug truncate group-hover:text-saffron transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black tracking-wider text-saffron bg-saffron/10 px-2 py-0.5 rounded uppercase">
                        {idx + 1}. {item.category}
                      </span>
                      {isRead && (
                        <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 size={9} />
                          {language === 'en' ? 'Read' : 'पठित'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => handleToggleBookmark(item.id, e)}
                    className="p-2.5 rounded-full bg-gray-50 dark:bg-white/5 hover:text-saffron transition-colors cursor-pointer"
                  >
                    <Heart size={16} className={cn("transition-all", isBookmarked ? "fill-saffron text-saffron" : "text-gray-400")} />
                  </button>
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 group-hover:text-saffron transition-colors">
                    <Info size={16} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-3xl border border-dashed border-gray-200 dark:border-white/10 p-8">
            <BookOpen className="mx-auto text-gray-300 dark:text-white/10 mb-4" size={44} />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
              {language === 'en' ? 'No scriptures found in this category' : 'इस श्रेणी में वर्तमान में कोई पाठ उपलब्ध नहीं है।'}
            </p>
            <p className="text-xs text-gray-400">
              {language === 'en' 
                ? "Try searching for different keywords or categories." 
                : "कृपया अन्य कीवर्ड या श्रेणियों के माध्यम से खोजें।"}
            </p>
          </div>
        )}
      </div>

      {/* Full-Screen Reading Modal View */}
      {selectedItem && (
        <div className={cn(
          "fixed inset-0 z-[120] flex flex-col justify-center items-center transition-all",
          isFullscreen ? "bg-[#FAF4E8]" : "bg-black/75 backdrop-blur-md p-3 sm:p-4"
        )}>
          <div className={cn(
            "flex flex-col w-full shadow-2xl relative transition-all overflow-hidden border",
            isFullscreen 
              ? "h-full rounded-none border-transparent" 
              : "h-full sm:h-[88dvh] max-w-3xl rounded-[2rem] border-gray-200 dark:border-white/10",
            // Reader theme selectors
            readerTheme === 'parchment' ? "bg-[#FAF4E8] text-amber-950" :
            readerTheme === 'light' ? "bg-white text-gray-900" :
            readerTheme === 'dark' ? "bg-[#161618] text-gray-200" : 
            "bg-[#070709] text-gray-100" // midnight
          )}>
            
            {/* Modal/Reader Header bar */}
            <div className={cn(
              "flex items-center justify-between gap-2.5 p-4 md:p-5 border-b shrink-0 min-w-0 w-full",
              readerTheme === 'parchment' ? "border-amber-200/50" :
              readerTheme === 'light' ? "border-gray-150" :
              readerTheme === 'dark' ? "border-white/5" : "border-saffron/10"
            )}>
              <div className="flex items-center gap-2 md:gap-3.5 min-w-0 flex-1">
                <button 
                  onClick={() => {
                    setSelectedItem(null);
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }}
                  className="p-1.5 md:p-2 rounded-full border border-current/10 hover:bg-current/5 transition-transform shrink-0 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="min-w-0 truncate">
                  <span className="text-[9px] font-black uppercase tracking-widest border border-current/20 px-1.5 py-0.5 rounded">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-sm md:text-base lg:text-lg font-display font-black truncate mt-1" title={selectedItem.title}>
                    {selectedItem.title}
                  </h2>
                </div>
              </div>

              {/* Bookmark & Chanted Indicators */}
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <button 
                  onClick={() => handleToggleBookmark(selectedItem.id)}
                  className="p-1.5 md:p-2 rounded-full border border-current/10 hover:bg-current/5 transition-colors cursor-pointer shrink-0"
                  title="Bookmark"
                >
                  <Heart size={15} className={favorites.includes(selectedItem.id) ? "fill-saffron text-saffron stroke-saffron" : "text-current"} />
                </button>
                <button 
                  onClick={() => handleToggleChanted(selectedItem.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-[10px] md:text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm",
                    chantedLog.includes(selectedItem.id) 
                      ? "bg-green-600 border-transparent text-white hover:bg-green-700 scale-[1.03]" 
                      : "bg-[#00C853]/10 border-[#00C853]/30 text-green-700 dark:text-green-400 hover:bg-[#00C853]/20"
                  )}
                >
                  <CheckCircle2 size={12} className={chantedLog.includes(selectedItem.id) ? "text-white" : "text-[#00C853] shrink-0"} />
                  <span>{chantedLog.includes(selectedItem.id) ? (language === 'en' ? 'Chanted' : 'पूरा हुआ') : (language === 'en' ? 'Done' : 'चढ़ाया')}</span>
                </button>
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 md:p-2 rounded-full border border-current/10 hover:bg-current/5 transition-colors cursor-pointer shrink-0"
                  title="Fullscreen Reader"
                >
                  {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>
              </div>
            </div>

            {/* Typography Controls Panel */}
            <div className={cn(
              "p-4 px-5 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs",
              readerTheme === 'parchment' ? "bg-amber-500/5 border-amber-200/40" :
              readerTheme === 'light' ? "bg-gray-50 border-gray-150" :
              readerTheme === 'dark' ? "bg-white/5 border-white/5" : "bg-saffron/5 border-saffron/10"
            )}>
              {/* Size & Themes */}
              <div className="flex items-center gap-3.5 flex-wrap">
                <div className="flex items-center gap-1.5 border border-current/10 rounded-lg p-0.5">
                  <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-1 px-2.5 rounded hover:bg-current/10 font-black cursor-pointer"><ZoomOut size={13} /></button>
                  <span className="text-[10px] font-black px-1">{fontSize}px</span>
                  <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-1 px-2.5 rounded hover:bg-current/10 font-black cursor-pointer"><ZoomIn size={13} /></button>
                </div>

                <div className="flex gap-1 border border-current/10 rounded-lg p-0.5">
                  {(['parchment', 'light', 'dark', 'midnight'] as const).map(th => (
                    <button 
                      key={th}
                      onClick={() => setReaderTheme(th)}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-bold rounded-md uppercase transition-colors shrink-0 cursor-pointer",
                        readerTheme === th 
                          ? "bg-saffron text-white" 
                          : "text-current hover:bg-current/5"
                      )}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hands-free Scrolling & Speech Control */}
              <div className="flex items-center gap-3.5 flex-wrap">
                {/* Auto Scroll toggle */}
                <div className="flex items-center gap-2 border border-current/10 rounded-lg p-1.5 px-3">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={autoscroll} 
                      onChange={(e) => setAutoscroll(e.target.checked)}
                      className="accent-saffron cursor-pointer"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider">Auto-Scroll</span>
                  </label>
                  {autoscroll && (
                    <select 
                      value={scrollSpeed} 
                      onChange={(e: any) => setScrollSpeed(e.target.value)}
                      className="bg-transparent font-bold text-[10px] outline-none ml-1 cursor-pointer border-l border-current/10 pl-2 focus:ring-0"
                    >
                      <option value="slow" className="text-black">Slow</option>
                      <option value="medium" className="text-black">Medium</option>
                      <option value="fast" className="text-black">Fast</option>
                    </select>
                  )}
                </div>

                {/* TTS Reader */}
                <div className="flex items-center gap-1.5 bg-saffron/10 border border-saffron/20 rounded-lg p-1 px-2.5 text-saffron shrink-0">
                  <button 
                    onClick={toggleTTSChant}
                    className="flex items-center gap-1.5 font-bold text-[10px] uppercase cursor-pointer"
                  >
                    {isSpeaking ? <Pause size={12} className="animate-spin" /> : <Play size={12} />}
                    <span>{isSpeaking ? (language === 'en' ? 'Stop Reciting' : 'पाठ बन्द करें') : (language === 'en' ? 'Listen Chanting' : 'पाठ श्रवण करें')}</span>
                  </button>
                  {isSpeaking && (
                    <select 
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="bg-transparent text-[10px] font-bold text-saffron outline-none cursor-pointer p-0 ml-1.5 border-l border-saffron/20 pl-2"
                    >
                      <option value="0.75" className="text-black">0.75x</option>
                      <option value="0.9" className="text-black">0.9x</option>
                      <option value="1.0" className="text-black">1.0x</option>
                      <option value="1.2" className="text-black">1.2x</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Holy Scripture Reading Board */}
            <div 
              ref={readerRef}
              className="flex-1 overflow-y-auto p-6 md:p-10 leading-relaxed font-serif text-center relative select-text"
            >
              {/* Subtle visual aura illustration */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-mandala pointer-events-none opacity-5 dark:opacity-10 scale-[1.3]" />
              
              <div 
                className="max-w-xl mx-auto space-y-6 relative z-10 transition-all text-center"
                style={{ fontSize: `${fontSize}px` }}
              >
                {selectedItem.content.split('\n').map((line: string, index: number) => {
                  const cleaned = line.trim();
                  if (!cleaned) return <div key={`empty-${index}`} className="h-4" />;
                  
                  // Style headers differently
                  const isTitleMarker = cleaned.startsWith('॥') || cleaned.startsWith('[') || cleaned.endsWith('॥');
                  return (
                    <p 
                      key={`line-${index}`} 
                      className={cn(
                        "transition-all leading-loose break-words whitespace-pre-wrap select-text hover:text-saffron cursor-default",
                        isTitleMarker 
                          ? "text-saffron dark:text-saffron-light font-black tracking-wide my-4 text-center block uppercase text-base sm:text-lg border-y border-current/5 py-2.5" 
                          : "font-semibold block"
                      )}
                    >
                      {cleaned}
                    </p>
                  );
                })}
              </div>

              {/* End of chapter visual flourish */}
              <div className="mt-14 mb-8 flex flex-col items-center justify-center text-current/30 pointer-events-none">
                <div className="w-16 h-0.5 bg-current/25 rounded mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF806A]">इति शुभम् - धर्मो रक्षति रक्षितः</span>
              </div>
            </div>

            {/* Jinvani Reader Next/Previous Navigation Footer */}
            <div className={cn(
              "p-4 sm:p-5 pb-safe border-t flex items-center justify-between gap-4 shrink-0 font-medium",
              readerTheme === 'parchment' ? "bg-amber-500/5 border-amber-200/40 text-amber-950" :
              readerTheme === 'light' ? "bg-gray-50 border-gray-150 text-gray-900" :
              readerTheme === 'dark' ? "bg-white/5 border-white/5 text-gray-200" :
              "bg-saffron/5 border-saffron/10 text-gray-100" // midnight
            )}>
              <button
                onClick={handlePrevItem}
                disabled={!hasPrev}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase transition-all cursor-pointer",
                  hasPrev
                    ? "border-current/15 hover:bg-current/10 active:scale-95 text-current"
                    : "opacity-35 cursor-not-allowed text-current/30 border-current/5"
                )}
              >
                <ArrowLeft size={14} />
                {language === 'en' ? 'Previous' : 'पिछला पाठ'}
              </button>

              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-saffron">
                {currentIndex + 1} / {activeList.length}
              </span>

              <button
                onClick={handleNextItem}
                disabled={!hasNext}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer",
                  hasNext
                    ? "bg-gradient-to-r from-saffron to-coral text-white select-none hover:scale-103 active:scale-97 shadow-md shadow-saffron/10"
                    : "bg-current/5 text-current/30 cursor-not-allowed opacity-35"
                )}
              >
                {language === 'en' ? 'Next' : 'अगला पाठ'}
                <ArrowLeft size={14} className="rotate-180" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AI Scripture Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 p-6 sm:p-8 flex flex-col relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setShowAiModal(false); setAiError(''); }}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-saffron to-coral mb-2.5 uppercase tracking-wide">
              {activeCat} AI Generator
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-semibold leading-relaxed">
              {language === 'en'
                ? `Provide the title of the Digambar ${activeCat} you want to retrieve. Jainism GPT will fetch standard verses, translations and chants instantly.`
                : `जिस ${activeCat} को आप चाहते हैं उसका नाम लिखें। जैन धर्म AI प्राचीन पाण्डुलिपियों से शुद्ध देवनागरी पाठ संकलित कर आपके समक्ष प्रस्तुत करेगा।`}
            </p>
            
            <form onSubmit={handleAiGenerate} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-saffron uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Scripture Name / Title' : 'ग्रंथ / पाठ का शीर्षक'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? "e.g. आदिनाथ भगवान आरती" : "जैसे: श्री पार्श्वनाथ अष्टक पूजा"}
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-saffron/50 outline-none text-sm font-bold"
                  required
                  disabled={isAiGenerating}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-saffron uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Admin Access Passcode' : 'प्रशासक पासवर्ड (Admin Passcode)'}
                </label>
                <input
                  type="password"
                  placeholder={language === 'en' ? "Enter Access Passcode" : "पासकोड दर्ज करें"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-saffron/50 outline-none text-sm font-bold"
                  required
                  disabled={isAiGenerating}
                />
              </div>
              
              {aiError && (
                <p className="text-red-500 text-xs font-semibold bg-red-500/10 border border-red-500/20 p-3 rounded-lg leading-relaxed">{aiError}</p>
              )}

              <button
                type="submit"
                disabled={isAiGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-saffron to-coral text-white font-black uppercase text-xs tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-saffron/10 cursor-pointer"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="animate-spin text-white" size={16} />
                    {language === 'en' ? 'GENERATING HOLY TEXT...' : 'पवित्र पाठ संकलित हो रहा है...'}
                  </>
                ) : (
                  language === 'en' ? 'ACTIVATE GENERATOR' : ' AI पाठ देववाणी सृजन करें'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {language === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
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
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-350 dark:text-zinc-350 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {language === 'en' ? 'Welcome to Jinvani Library (Holy Shastras)!' : 'परम पावनी जिनवाणी जिनबिम्ब सागर में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'This sacred repository lets you search, read and listen to the divine, unattached teachings of the Arihantas and Jain Acharyas:' 
                  : 'यहाँ आप जिनेन्द्र देव की परम कल्याणकारी वीतराग वाणी का पवित्र अनुशीलन, पठन एवं श्रवण कर सकते हैं:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Sacred Classifications:' : 'पावन वर्गीकरण:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Explore and study scriptures classified into Dev Pujan (Worship booklets), Stuti (Bhakti), Vidhan, Chalisa, elegant Bhajans, and Aarti.' 
                    : 'मर्यादित श्रेणियों में स्वाध्याय करें: देव पूजन, देवभक्ति स्तुति, विशाल महामंडल विधान, मंगल चालीसा, मधुर भजन और धूप आरती संकलन।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Custom Reader Themes:' : 'पठन सुविधा अनुकूलता:'}</strong>{' '}
                  {language === 'en'
                    ? 'Adjust the font scale (using +/-) and choose reader background themes such as Classic Parchment, Light, Dark, or Midnight.'
                    : 'अपने नेत्रों की सुविधा हेतु अक्षर का आकार (फॉन्ट साइज +/-) बदलें और अनुकूल पार्श्व थीम (पर्चमेंट पत्र, श्वेत, श्याम या अर्धरात्रि) चुनें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Autoscrolling & Audio recitation:' : 'ऑटो-स्क्रॉल और ध्वनि स्वाध्याय:'}</strong>{' '}
                  {language === 'en'
                    ? 'Enable hands-free scrolling at custom speeds. Play active audio recitation to chant along with exact phonetics.'
                    : 'हाथों को मुक्त रखकर पढ़ने के लिए ऑटो-स्क्रॉलिंग गति निर्धारित करें। शुद्ध उच्चारण संग पाठ का आनंद लेने के लिए ऑडियो प्ले करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Universal Searches:' : 'सरल और सुलभ खोज:'}</strong>{' '}
                  {language === 'en'
                    ? 'Search terms instantly in Hindi or English (e.g. Parshvanath, Abhishek, Stotra).'
                    : 'सर्च बॉक्स के द्वारा किसी भी पूज्य पाठ या स्तुति को सीधे हिन्दी या अंग्रेज़ी टाइप करके तुरंत ढूंढें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {language === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="aagams" />
    </div>
  );
}
