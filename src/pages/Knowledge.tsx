import { useState, useEffect, useRef } from 'react';
import { 
  Search, BookOpen, ChevronDown, ChevronUp, Lightbulb, Microscope, 
  Sparkles, Loader2, Mic, MicOff, ArrowLeft, CheckCircle, XCircle, 
  Compass, ShieldCheck, Home, Sunset, Droplet, Apple, Volume2, VolumeX, Star, HelpCircle, Globe,
  Newspaper, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { knowledgeData as FALLBACK_KNOWLEDGE } from '../data/knowledgeBase';
import { livingGuideData, LivingGuideCategory } from '../data/livingGuide';
import SectionAiAgent from '../components/SectionAiAgent';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

const IconMap: Record<string, any> = {
  Home,
  Sunset,
  Droplet,
  Apple
};

import { BAAL_BODH_BOOKS } from '../data/baalBodhData';
import JainKidsGames from '../components/JainKidsGames';
import { jainUpchaarData } from '../data/jainUpchaar';

export default function KnowledgePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab ] = useState<'qa' | 'guide' | 'baal_bodh' | 'games' | 'upchaar'>('qa');
  const [search, setSearch] = useState('');
  const [selectedUpchaarCat, setSelectedUpchaarCat] = useState<string>('All');
  const [openUpchaarId, setOpenUpchaarId] = useState<string | null>(null);
  const { language: lang, toggleLanguage } = useLanguage();
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  
  // Baal Bodh / Swadhyay states
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [isSpeakingBook, setIsSpeakingBook] = useState(false);
  const [baalBodhSubTab, setBaalBodhSubTab] = useState<'books' | 'games'>('books');
  
  // Q&A Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Living Guide active category ID
  const [activeGuideCat, setActiveGuideCat] = useState<string>('dev_darshan');

  // AI Swadhyay Agent states
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Jain Swadhyay AI Agent active.",
    "[STATUS] Secure encrypted database port ready.",
    "[GUIDE] Tell me what knowledge or detailed Q&As to generate and add to our live database, or click a preset!"
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  // Extracted Pathshala Quiz states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [kidName, setKidName] = useState('');
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  // Help Modal State
  const [showHelpModal, setShowHelpModal] = useState(false);

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
          setSpeechError(lang === 'en' ? 'Microphone access denied.' : 'माइक्रोफ़ोन अनुमति अस्वीकृत।');
        } else {
          setSpeechError(lang === 'en' ? 'Error with speech recognition.' : 'वाणी पहचान में त्रुटि।');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const q = query(collection(db, 'knowledge'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const preparedSeed = FALLBACK_KNOWLEDGE.map((item, index) => ({ id: `seed_${index}`, ...item }));
      
      // Merge: Keep all seeds, but if firestore overrides any by matching the question or ID, replace them.
      // Also include any brand new items from Firestore.
      const dataMap = new Map(data.map(item => [item.id, item]));
      
      const merged = preparedSeed.map(seedItem => {
        let matchedItem = dataMap.get(seedItem.id);
        if (!matchedItem) {
          const matchByQuestion = data.find((d: any) => 
            (d.question?.en && d.question.en === seedItem.question?.en) || 
            (d.question?.hi && d.question.hi === seedItem.question?.hi)
          );
          if (matchByQuestion) {
            matchedItem = matchByQuestion;
            dataMap.delete(matchByQuestion.id);
          }
        } else {
          dataMap.delete(seedItem.id);
        }
        return matchedItem ? { ...seedItem, ...matchedItem } : seedItem;
      });
      
      const finalKnowledge = [...merged, ...Array.from(dataMap.values())];
      setKnowledge(finalKnowledge);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching knowledge:', error);
      const preparedSeed = FALLBACK_KNOWLEDGE.map((item, index) => ({ id: `seed_${index}`, ...item }));
      setKnowledge(preparedSeed);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [lang]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const bookIdParam = params.get('bookId');
    if (tabParam === 'swadhyay_books') {
      navigate(`/swadhyay?bookId=${bookIdParam || ''}`);
      return;
    }
    if (tabParam === 'baal_bodh') {
      setActiveTab('baal_bodh');
      if (bookIdParam) {
        const isPathshala = ['baal1', 'baal2', 'baal3', 'baal_stories', 'baal_conduct'].includes(bookIdParam);
        if (!isPathshala) {
          navigate(`/swadhyay?bookId=${bookIdParam}`);
          return;
        }
        const matchingBook = BAAL_BODH_BOOKS.find(b => b.id === bookIdParam);
        if (matchingBook) {
          setSelectedBook(matchingBook);
          setSelectedChapter(matchingBook.chapters[0]);
        }
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'SAMIL_SWADHYAY_2026' || passcode === 'samil123') {
      setUnlocked(true);
      setErrorMsg('');
      setLogs(prev => [...prev, "[SYSTEM] Swadhyay Agent authenticated successfully! Core unlocked."]);
    } else {
      setErrorMsg(lang === 'en' ? 'Incorrect developer passcode' : 'गलत डेवलपर पासकोड');
    }
  };

  const handleSendAgentPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim() || isProcessing) return;

    const currentPrompt = agentPrompt;
    setAgentPrompt('');
    setIsProcessing(true);
    setLogs(prev => [...prev, `[COMMAND] Instruction: "${currentPrompt}"`]);

    try {
      setLogs(prev => [...prev, "[AI MASTER] Contacting Jainism Wisdom Server for content structuring..."]);
      
      const response = await fetch('/api/admin/nlp-agent-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Server error generating data');
      }

      const { action, targetCollection, payload, replyText } = result;

      if (action === 'add' && targetCollection === 'knowledge' && payload) {
        setLogs(prev => [...prev, `[DB TRANSACTION] Pushing payload into Firestore live...`]);
        await addDoc(collection(db, 'knowledge'), payload);
        setLogs(prev => [...prev, `[DB SUCCESS] Document added and indexed into Firestore collection 'knowledge' successfully!`]);
      } else {
        setLogs(prev => [...prev, `[AI MASTER] System replied: "${replyText || 'Processed successfully.'}"`]);
      }
    } catch (err: any) {
      console.error(err);
      setLogs(prev => [...prev, `[AI ERROR] Execution failed: ${err.message || 'Check network limits'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const presets = lang === 'en' ? [
    "Add detailed question & answers on Tirthankara landmark places",
    "Add scientific parallel of Jain cosmology (Lokakasha) vs modern physics",
    "Explain physiological cellular benefits of Namokar Mantra daily recitation",
    "Add detailed spiritual logic regarding Paryushan fasting benefits"
  ] : [
    "तीर्थंकर निर्माण और कल्याणक स्थलों पर प्रश्नोत्तर जोड़ें",
    "जैन ब्रह्मांड और क्वांटम भौतिकी के वैज्ञानिक समानांतर पर प्रश्नोत्तर जोड़ें",
    "प्रतिदिन नवकार मंत्र के निरंतर जाप के जैव-वैज्ञानिक लाभों का विश्लेषण जोड़ें",
    "पर्युषण पर्व पर उपवास के आध्यात्मिक और शारीरिक सफाई लाभों पर प्रश्नोत्तर जोड़ें"
  ];

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        setSpeechError(lang === 'en' ? 'Speech recognition not supported.' : 'इस ब्राउज़र में वाणी पहचान समर्थित नहीं है।');
        return;
      }
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'hi-IN';
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const filteredKnowledge = knowledge.filter(item => {
    const qMatches = (item.question?.en?.toLowerCase().includes(search.toLowerCase()) || 
                     item.question?.hi?.toLowerCase().includes(search.toLowerCase()));
    
    if (selectedCategory === 'All') return qMatches;
    return qMatches && item.category === selectedCategory;
  });

  // Extract unique categories for pill filter
  const categories = ['All', ...Array.from(new Set(knowledge.map(item => item.category).filter(Boolean)))];

  return (
    <div className="min-h-full p-6 pb-24 bg-transparent text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header with inline controls */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <BookOpen className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">{lang === 'en' ? 'JAIN PATHSHALA & GYAN' : 'जैन पाठशाला एवं ज्ञान सागर'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Custom Section Help Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-2xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200/50 dark:border-white/5 h-10 w-10 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Section Help Guide' : 'अनुभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-2xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30 shrink-0"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={14} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Mode / Tab Switcher */}
      <div className="flex flex-wrap p-1 mb-8 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-3xl mx-auto overflow-hidden gap-1 justify-center md:flex-nowrap">
        <button
          onClick={() => { setActiveTab('qa'); setSearch(''); }}
          className={cn(
            "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 text-[9px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'qa' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <BookOpen size={14} />
          {lang === 'en' ? 'Q&A' : 'जिज्ञासा समाधान'}
        </button>
        <button
          onClick={() => { setActiveTab('guide'); setSearch(''); }}
          className={cn(
            "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 text-[9px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'guide' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Compass size={14} />
          {lang === 'en' ? 'Living' : 'दिनचर्या'}
        </button>
        <button
          onClick={() => { setActiveTab('baal_bodh'); setSearch(''); setSelectedBook(null); setSelectedChapter(null); }}
          className={cn(
            "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 text-[9px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'baal_bodh' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <BookOpen size={14} />
          {lang === 'en' ? 'Baal Bodh' : 'बालबोध पाठशाला'}
        </button>
        <button
          onClick={() => { setActiveTab('games'); setSearch(''); }}
          className={cn(
            "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 text-[9px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'games' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Sparkles size={14} />
          {lang === 'en' ? 'Jain Games' : 'जैन गेम्स'}
        </button>
        <button
          onClick={() => { setActiveTab('upchaar'); setSearch(''); }}
          className={cn(
            "flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-3 text-[9px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'upchaar' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Activity size={14} />
          {lang === 'en' ? 'Jain Upchaar' : 'जैन उपचार'}
        </button>
      </div>

      {activeTab === 'qa' && (
        /* ==================== Q&A SYSTEM TAB ==================== */
        <div className="space-y-6">
          {/* Did you know banner */}
          <div className="bg-gradient-to-br from-[#00E676]/10 to-[#69F0AE]/5 backdrop-blur-xl rounded-3xl p-5 border border-[#00E676]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00E676]/20 transition-all duration-700" />
            
            <div className="flex items-center gap-2 text-[#00C853] dark:text-[#69F0AE] mb-2 relative z-10">
              <Lightbulb size={16} className="animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">Did You Know? | क्या आप जानते हैं?</span>
            </div>
            
            <p className="text-gray-800 dark:text-white font-semibold leading-relaxed text-sm relative z-10">
              {lang === 'en' 
                ? "Scientific analysis shows that water filtering methods stated in ancient Digambar texts perfectly match modern sterile precautions!" 
                : "वैज्ञानिक शोधों से पता चला है कि प्राचीन दिगंबर शास्त्रों में बताई गई जल छानने की विधि आधुनिक जीवाणु-मुक्त विज्ञान के पूर्णतः अनुकूल है!"}
            </p>
          </div>

          {/* Search bar specifically for Q&A */}
          <UnifiedSearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder={lang === 'en' ? "Search spiritual/scientific questions..." : "शंका समाधान खोजें (जैसे: रात्रि भोजन, पानी)..."}
          />

          {/* Categories Pill Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border whitespace-nowrap transition-all duration-300 cursor-pointer",
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#FF6D00] to-[#FFB300] text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {cat === 'All' ? (lang === 'en' ? 'All' : 'सभी श्रेणी') : cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={36} />
                <p className="font-bold uppercase tracking-widest text-xs">Loading Divine Q&As...</p>
              </div>
            ) : filteredKnowledge.length > 0 ? (
              filteredKnowledge.map((item) => {
                const isOpen = openIdx === item.id;
                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl border overflow-hidden shadow-sm transition-all duration-300",
                      isOpen ? "border-[#FF6D00]/50 shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.15)]" : "border-gray-200/50 dark:border-white/5 hover:border-[#FF6D00]/30"
                    )}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : item.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className={cn(
                        "font-bold text-sm pr-4 transition-colors duration-300 leading-snug",
                        isOpen ? "text-[#FF6D00] dark:text-[#FFD54F]" : "text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white"
                      )}>
                        {lang === 'en' ? item.question?.en : item.question?.hi}
                      </span>
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                        isOpen ? "bg-[#FF6D00]/10 text-[#FF8A65]" : "bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-900"
                      )}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    
                    <div 
                      className={cn(
                        "px-5 overflow-hidden transition-all duration-500 ease-in-out",
                        isOpen ? "max-h-[1000px] pb-5 opacity-100 border-t border-gray-100 dark:border-white/5" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pt-4 space-y-4">
                        {/* Jain Reason */}
                        <div className="space-y-1.5 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-600/5 border border-orange-100 dark:border-orange-500/10">
                          <div className="flex items-center gap-2 text-[#FF6D00]">
                            <Sparkles size={14} className="fill-[#FF6D00]/20" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Jain Doctrine & Shastra Reason | आध्यात्मिक आधार</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.jainReason?.en : item.jainReason?.hi}
                          </p>
                        </div>

                        {/* Science Reason */}
                        <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-600/5 border border-blue-100 dark:border-blue-500/10">
                          <div className="flex items-center gap-2 text-[#2962FF]">
                            <Microscope size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Scientific Logic | वैज्ञानिक विश्लेषण</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.scienceReason?.en : item.scienceReason?.hi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200/50 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
                {lang === 'en' ? 'No Q&A wisdom found.' : 'खोज परिणाम रिक्त है।'}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        /* ==================== LIVING GUIDE TAB ==================== */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Side categories switches */}
          <div className="md:col-span-4 space-y-2">
            {livingGuideData.map((category) => {
              const IconComp = IconMap[category.iconName] || Compass;
              const isSelected = activeGuideCat === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveGuideCat(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer",
                    isSelected 
                      ? "bg-white dark:bg-[#161616] border-[#FF6D00] shadow-[0_4px_20px_rgba(255,109,0,0.1)] text-[#FF6D00] dark:text-[#FFD54F]"
                      : "bg-white/80 dark:bg-[#121212]/80 border-gray-200/40 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#151515]"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                    isSelected 
                      ? "bg-[#FF6D00]/10 border-[#FF6D00]/20" 
                      : "bg-gray-50 dark:bg-white/5 border-transparent"
                  )}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      {lang === 'en' ? category.title.en : category.title.hi}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px] font-medium">
                      {lang === 'en' ? category.subtitle.en : category.subtitle.hi}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current selected category panel content */}
          <div className="md:col-span-8 space-y-6">
            {(() => {
              const cat = livingGuideData.find(c => c.id === activeGuideCat);
              if (!cat) return null;
              return (
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6D00]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Category Header */}
                  <div className="mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                    <span className="text-[9px] px-2.5 py-0.5 font-black uppercase tracking-wider rounded-md bg-orange-600 text-white w-fit">
                      {cat.targetAudience[lang]}
                    </span>
                    <h2 className="text-xl font-display font-black text-gray-900 dark:text-white mt-2 leading-tight">
                      {lang === 'en' ? cat.title.en : cat.title.hi}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">
                      {lang === 'en' ? cat.subtitle.en : cat.subtitle.hi}
                    </p>
                  </div>

                  {/* Practices List (Do's & Don'ts structured gracefully) */}
                  <div className="space-y-6">
                    {cat.practices.map((practice, idx) => {
                      const isDo = practice.type === 'do';
                      return (
                        <div 
                          key={idx}
                          className={cn(
                            "p-5 rounded-2xl border transition-all duration-300 hover:shadow-sm flex flex-col gap-3.5 relative",
                            isDo 
                              ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/20" 
                              : "bg-rose-50/30 dark:bg-rose-500/5 border-rose-500/10 dark:border-rose-500/20"
                          )}
                        >
                          {/* Badge tag */}
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              {isDo ? (
                                <CheckCircle size={16} className="text-emerald-500 shadow-sm" />
                              ) : (
                                <XCircle size={16} className="text-rose-500 shadow-sm" />
                              )}
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-wider",
                                isDo ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                              )}>
                                {isDo ? (lang === 'en' ? 'PRACTICE / DO' : 'आचरणीय (DO)') : (lang === 'en' ? 'RESTRICTION / DONT' : 'वर्जित (DONT)')}
                              </span>
                            </div>
                          </div>

                          {/* Content title and details */}
                          <div>
                            <h4 className="font-display font-black text-sm text-gray-900 dark:text-white leading-snug">
                              {lang === 'en' ? practice.title.en : practice.title.hi}
                            </h4>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                              {lang === 'en' ? practice.desc.en : practice.desc.hi}
                            </p>
                          </div>

                          {/* Kids and family friendly educational card box */}
                          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-[#0c0c0c]/60 border border-amber-500/10 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed shadow-sm">
                            <span className="text-base leading-none shrink-0" role="img" aria-label="light">💡</span>
                            <div>
                              <strong className="text-gray-900 dark:text-gray-200 block text-[10px] uppercase tracking-wider font-black mb-0.5">
                                {lang === 'en' ? 'Kids & Family Tip' : 'बाल संस्कार एवं नैतिक सीख'}
                              </strong>
                              {lang === 'en' ? practice.kidsTip.en : practice.kidsTip.hi}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {activeTab === 'baal_bodh' && (
        <div className="space-y-6">
          {!selectedBook ? (
            /* ================= BOOK SELECTION GRID ================= */
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#FFAB40]/20 to-[#FFD54F]/5 backdrop-blur-md rounded-3xl p-6 border border-[#FFAB40]/30 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD54F]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-center gap-1.5 mb-2 text-amber-500">
                  <Star className="fill-current text-orange-500" size={16} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current text-orange-500" size={16} />
                </div>
                <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FFD54F]">
                  {lang === 'en' ? 'BUDHI BAAL PATHSHALA' : 'बाल बोध संस्कार पाठशाला'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold mt-2 max-w-lg mx-auto leading-relaxed">
                  {lang === 'en' 
                    ? 'Explore premium high-quality Jain moral stories, sacred verses, and children-friendly teachings with natural high-quality voice narrator.' 
                    : 'सरल सुंदर हिंदी-अंग्रेजी अनुवाद, उत्तम संस्कृत श्लोक एवं सजीव आवाज वाचक के साथ छोटे बच्चों के लिए अनमोल जैन धर्म नैतिक ज्ञान।'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BAAL_BODH_BOOKS.filter((book) => {
                  const isPathshala = ['baal1', 'baal2', 'baal3', 'baal_stories', 'baal_conduct'].includes(book.id);
                  return isPathshala;
                }).map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(book.chapters[0]);
                    }}
                    className="p-6 bg-white dark:bg-[#121212]/90 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-orange-400 dark:hover:border-orange-500/40 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.1)] transition-all duration-300 cursor-pointer flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className={cn("w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-sm", book.color)}>
                      {book.image}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-black text-base text-gray-900 dark:text-white truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                          {lang === 'en' ? book.title.en : book.title.hi}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 dark:text-orange-400 font-bold text-[9px] uppercase tracking-widest shrink-0">
                          {book.chapters.length} {lang === 'en' ? 'Chapters' : 'अध्याय'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {lang === 'en' ? book.description.en : book.description.hi}
                      </p>
                      <div className="pt-1 text-[10px] font-black text-gray-500 dark:text-gray-400 group-hover:text-orange-500 flex items-center gap-1.5 transition-all">
                        <span>{lang === 'en' ? 'Click to Start Reading' : 'पढ़ना शुरू करने के लिए क्लिक करें'}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ================= ACTIVE BOOK WRITER/READER ================= */
            <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
              <button 
                onClick={() => {
                  setSelectedBook(null);
                  setSelectedChapter(null);
                  window.speechSynthesis.cancel();
                  setIsSpeakingBook(false);
                }}
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-xs hover:text-[#FF6D00] hover:border-[#FF6D00]/25 transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{lang === 'en' ? 'Back to All Books' : 'सभी पुस्तकें देखें'}</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Book Index (Left Panel) */}
                <div className="md:col-span-4 bg-white dark:bg-[#121212]/90 border border-gray-100 dark:border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="pb-3 border-b border-gray-100 dark:border-white/5 text-center sm:text-left">
                    <span className="text-[9px] font-black tracking-widest text-[#FF6D00] block uppercase">{lang === 'en' ? 'Active Book' : 'सक्रिय पुस्तक'}</span>
                    <h3 className="font-display font-black text-gray-900 dark:text-white mt-1">
                      {lang === 'en' ? selectedBook.title.en : selectedBook.title.hi}
                    </h3>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {selectedBook.chapters.map((chap: any, idx: number) => {
                      const isActive = selectedChapter?.title.hi === chap.title.hi;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedChapter(chap);
                            window.speechSynthesis.cancel();
                            setIsSpeakingBook(false);
                          }}
                          className={cn(
                            "w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer",
                            isActive 
                              ? "bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/35 text-orange-500 dark:text-orange-400"
                              : "bg-gray-50/70 dark:bg-black/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                          )}
                        >
                          <span className="truncate">{lang === 'en' ? chap.title.en : chap.title.hi}</span>
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-orange-500 animate-pulse" : "bg-transparent")} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter reader (Right Panel) */}
                <div className="md:col-span-8 bg-white dark:bg-[#121212]/90 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                  {selectedChapter && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex-1">
                          <span className="text-[9px] font-black tracking-widest text-[#FF6D00] uppercase flex items-center gap-1.5">
                            <Star className="fill-current text-yellow-500" size={10} />
                            {lang === 'en' ? 'Kids Pathshala Lesson' : 'बालबोध संस्कार पाठ'}
                          </span>
                          <h2 className="text-xl font-display font-black text-gray-900 dark:text-white mt-1 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FFD54F]">
                            {lang === 'en' ? selectedChapter.title.en : selectedChapter.title.hi}
                          </h2>
                        </div>
                        
                        <button
                          onClick={() => {
                            const speechText = `${selectedChapter.title.hi}. ${selectedChapter.content.hi}. नैतिक शिक्षा: ${selectedChapter.moral.hi}`;
                            if (isSpeakingBook) {
                              window.speechSynthesis.cancel();
                              setIsSpeakingBook(false);
                            } else {
                              window.speechSynthesis.cancel();
                              const cleanText = speechText.replace(/\*/g, '').replace(/॥/g, '').replace(/ॐ ह्रीं श्रीं/g, 'ओम ह्रीम श्रीम');
                              const utterance = new SpeechSynthesisUtterance(cleanText);
                              utterance.lang = 'hi-IN';
                              utterance.rate = 0.8;
                              utterance.onend = () => setIsSpeakingBook(false);
                              utterance.onerror = () => setIsSpeakingBook(false);

                              const allVoices = window.speechSynthesis.getVoices();
                              const premiumVoice = allVoices.find(v => 
                                (v.lang.startsWith('hi') || v.lang.startsWith('sa')) && 
                                (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural'))
                              ) || allVoices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
                              
                              if (premiumVoice) {
                                utterance.voice = premiumVoice;
                              }

                              window.speechSynthesis.speak(utterance);
                              setIsSpeakingBook(true);
                            }
                          }}
                          className={cn(
                            "px-4.5 py-2.5 rounded-full border text-xs font-black tracking-wide flex items-center justify-center gap-2.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none",
                            isSpeakingBook
                              ? "bg-red-500 text-white border-red-400 animate-pulse"
                              : "bg-[#FF6D00] text-white border-transparent hover:bg-[#FF8100]"
                          )}
                        >
                          {isSpeakingBook ? (
                            <>
                              <VolumeX size={15} />
                              <span>{lang === 'en' ? 'Stop Voice' : 'आवाज रोकें'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={15} />
                              <span>{lang === 'en' ? 'Listen Online' : 'सजीव आवाज सुनें'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Lesson Body Contents */}
                      <div className="space-y-6 text-gray-800 dark:text-gray-205 leading-relaxed font-sans text-sm md:text-base">
                        {/* Hindi block */}
                        <div className="p-5.5 rounded-2xl bg-orange-50/10 dark:bg-orange-500/[0.01] border border-orange-500/10 space-y-4">
                          <span className="text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest block pb-1 border-b border-orange-500/10">हिंदी पाठ</span>
                          <div className="whitespace-pre-line font-medium leading-relaxed dark:text-gray-200">
                            {selectedChapter.content.hi}
                          </div>
                        </div>

                        {/* English Block */}
                        <div className="p-5.5 rounded-2xl bg-blue-50/10 dark:bg-blue-500/[0.01] border border-blue-500/10 space-y-4">
                          <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest block pb-1 border-b border-blue-500/10">English Translation</span>
                          <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-400">
                            {selectedChapter.content.en}
                          </div>
                        </div>

                        {/* Moral advice highlight card */}
                        <div className="p-5 rounded-2xl bg-[#00E676]/10 dark:bg-[#00E676]/5 border border-[#00E676]/25 flex gap-4.5">
                          <div className="w-12 h-12 bg-white dark:bg-[#121212] rounded-xl flex items-center justify-center text-[#00C853] shrink-0 shadow-sm border border-[#00E676]/15">
                            <Star className="fill-[#00C853] text-[#00C853]" size={22} />
                          </div>
                          <div className="flex-1 space-y-1 min-w-0">
                            <span className="text-[10px] font-black tracking-widest text-[#00C853] dark:text-[#69F0AE] uppercase block">संस्करण सीख (Moral Lesson)</span>
                            <p className="font-extrabold text-[#00A13A] dark:text-emerald-450 text-sm leading-relaxed">
                              {lang === 'en' ? selectedChapter.moral.en : selectedChapter.moral.hi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== JAIN KIDS GAMES TAB ==================== */}
      {activeTab === 'games' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
          <JainKidsGames language={lang} onBack={() => setActiveTab('baal_bodh')} />



        </div>
      )}

      {/* ==================== JAIN UPCHAAR TAB ==================== */}
      {activeTab === 'upchaar' && (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
          {/* Intro banner */}
          <div className="bg-gradient-to-br from-[#FF3D00]/10 to-[#FFD54F]/5 backdrop-blur-xl rounded-3xl p-6 border border-[#FF3D00]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3D00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF3D00]/10 transition-all duration-700" />
            
            <div className="flex items-center gap-2 text-[#FF3D00] dark:text-[#FF8A65] mb-2.5 relative z-10">
              <Activity size={18} className="animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">Jain Pathological Treatment & Holistic Health | जैन स्वास्थ्य एवं अहिंसक उपचार पद्धति</span>
            </div>
            
            <h2 className="text-xl font-display font-black text-gray-900 dark:text-white leading-tight">
              {lang === 'en' ? 'Holistic Healing with Jain Dharma Principles' : 'जैन आचार और अहिंसा आधारित प्राकृतिक स्वास्थ्य उपचार'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold mt-2 leading-relaxed">
              {lang === 'en' 
                ? "Jain Upchaar blends spiritual vibrations (Bhaktamar slokas & Navkar mantra) with scientific biological purification (boiled water, eating before sunset, and avoiding root vegetables) to heal body, mind, and soul in complete alignment with Ahimsa (non-violence)." 
                : "जैन उपचार पद्धति अध्यात्म (णमोकार महामंत्र एवं भक्तामर स्तोत्र प्रभाव) और प्राकृतिक शुद्धता (मर्यादित छना जल, कंदमूल त्याग और चौविहार) का पावन संगम है। यह अहिंसा के पथ पर चलते हुए तन और मन को पूर्ण स्वस्थ व निरोगी बनाने में अत्यंत सहायक है।"}
            </p>
          </div>

          {/* Search bar specifically for Upchaar */}
          <UnifiedSearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder={lang === 'en' ? "Search diseases or treatments (e.g., acidity, joints)..." : "बीमारी या उपचार खोजें (जैसे: एसिडिटी, कब्ज, खांसी, दर्द)..."}
          />

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Digestive Disorders', 'Respiratory Illnesses', 'Joint Pain & Arthritis', 'Skin Disorders', 'General Wellness'].map((cat) => {
              const displayName = lang === 'en' ? cat : (
                cat === 'All' ? 'सभी श्रेणी' :
                cat === 'Digestive Disorders' ? 'पाचन रोग' :
                cat === 'Respiratory Illnesses' ? 'श्वसन रोग' :
                cat === 'Joint Pain & Arthritis' ? 'जोड़ों का दर्द' :
                cat === 'Skin Disorders' ? 'त्वचा रोग' : 'सामान्य स्वास्थ्य'
              );
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedUpchaarCat(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border whitespace-nowrap transition-all duration-300 cursor-pointer",
                    selectedUpchaarCat === cat
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FFB300] text-white border-transparent shadow-sm"
                      : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          {/* Treatments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jainUpchaarData
              .filter(item => {
                const matchesSearch = (
                  item.disease.en.toLowerCase().includes(search.toLowerCase()) ||
                  item.disease.hi.toLowerCase().includes(search.toLowerCase()) ||
                  item.category.en.toLowerCase().includes(search.toLowerCase()) ||
                  item.category.hi.toLowerCase().includes(search.toLowerCase()) ||
                  item.jainMethod.en.toLowerCase().includes(search.toLowerCase()) ||
                  item.jainMethod.hi.toLowerCase().includes(search.toLowerCase())
                );
                const matchesCat = selectedUpchaarCat === 'All' || item.category.en === selectedUpchaarCat;
                return matchesSearch && matchesCat;
              })
              .map((item) => {
                const isOpen = openUpchaarId === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl border overflow-hidden shadow-sm transition-all duration-300",
                      isOpen ? "border-[#FF6D00]/50 shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.15)]" : "border-gray-200/50 dark:border-white/5 hover:border-[#FF6D00]/30"
                    )}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setOpenUpchaarId(isOpen ? null : item.id)}
                      className="w-full p-5 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0 pr-4">
                        <span className="text-[9px] font-black tracking-wider text-[#FF6D00] uppercase bg-[#FF6D00]/10 px-2.5 py-0.5 rounded-full">
                          {lang === 'en' ? item.category.en : item.category.hi}
                        </span>
                        <h3 className="font-display font-black text-base text-gray-800 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors mt-2">
                          {lang === 'en' ? item.disease.en : item.disease.hi}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 mt-0.5">
                          {lang === 'en' ? item.symptoms.en : item.symptoms.hi}
                        </p>
                      </div>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                        isOpen ? "bg-[#FF6D00]/10 text-[#FF8A65]" : "bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-white/10"
                      )}>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {/* Expandable Section */}
                    {isOpen && (
                      <div className="px-5 pb-6 border-t border-gray-100 dark:border-white/5 pt-4 space-y-4">
                        {/* Symptoms block */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block">
                            {lang === 'en' ? 'Key Symptoms / Indicators' : 'प्रमुख लक्षण'}
                          </span>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {lang === 'en' ? item.symptoms.en : item.symptoms.hi}
                          </p>
                        </div>

                        {/* Jain Method block */}
                        <div className="p-4 rounded-2xl bg-orange-50/50 dark:bg-orange-600/5 border border-orange-100 dark:border-orange-500/10 space-y-1.5">
                          <div className="flex items-center gap-2 text-[#FF6D00]">
                            <Activity size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Jain Method & Natural Remedies | जैन पद्धति उपचार</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.jainMethod.en : item.jainMethod.hi}
                          </p>
                        </div>

                        {/* Dietary Rules block */}
                        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-600/5 border border-emerald-100 dark:border-emerald-500/10 space-y-1.5">
                          <div className="flex items-center gap-2 text-[#00C853]">
                            <Apple size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Strict Dietary Codes (Ahimsa Ahara) | आहार मर्यादा नियम</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.dietRules.en : item.dietRules.hi}
                          </p>
                        </div>

                        {/* Spiritual Chanting block */}
                        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-600/5 border border-blue-100 dark:border-blue-500/10 space-y-1.5">
                          <div className="flex items-center gap-2 text-[#2962FF]">
                            <Sparkles size={14} className="fill-[#2962FF]/10" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Spiritual & Mantra Healing | आध्यात्मिक एवं मंत्र ध्वनि</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.spiritualHeal.en : item.spiritualHeal.hi}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* News Tab Removed */}

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {lang === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {lang === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
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
                {lang === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {lang === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-350 dark:text-zinc-350 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to Jain Pathshala & Gyan Sagar!' : 'जैन पाठशाला एवं ज्ञान सागर में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'This specialized education portal hosts authentic Digambar Jain teachings, daily householder practices, and a gamified learning platform:' 
                  : 'यह विशेष अनुभाग जैन सिद्धांतों, दैनिक सदाचार चर्या और बच्चों की सुसंस्कार पाठशाला की प्रामाणिक प्रस्तुति है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Q&A Solutions:' : 'जिज्ञासा समाधान:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Read and search comprehensive theological answers touching basic karma, universe biology, and soul.' 
                    : 'कर्म सिद्धांत, जीव-अजीव भेद, पंच-अणुव्रत और देव-शास्त्र-गुरु चर्या के रहस्यों को सुगम भाषा में समझें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Living Conduct Code:' : 'मर्यादित जीवन शैली:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Explore mandatory householders guidelines like dev darshan, filtered-water codes, and sunset-dinner restrictions.'
                    : 'रात्रि भोजन त्याग, छना जल उपयोग, अष्ट मूलगुण और दैनिक देवदर्शन की पावन वैज्ञानिक महत्ता को आत्मसात करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Bal Bodh Textbooks:' : 'बालबोध पाठशाला:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Access fully digitized copies of classic Bal Sanskar books 1, 2, and 3 with real voice synthesizers.'
                    : 'सदाचार और सुसंस्कार की नीव रखने वाले बालबोध भाग १, २, ३ का साक्षात अध्ययन करें, जिसमें आवाज़ स्वाध्याय सुविधा भी है।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Interactive Jain Games:' : 'जैन सुसंस्कार गेम्स:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Play world-class Jain moral and philosophical games designed to learn and review values interactively.'
                    : 'मनोरंजक एवं ज्ञानवर्धक विश्वस्तरीय जैन गेम्स खेलें और सुसंस्कार चर्या व जीवन मूल्यों को खेल-खेल में सीखें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {lang === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="knowledge" />
    </div>
  );
}

