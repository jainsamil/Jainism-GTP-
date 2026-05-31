import { useState, useEffect, useRef } from 'react';
import { 
  Search, BookOpen, ChevronDown, ChevronUp, Lightbulb, Microscope, 
  Sparkles, Loader2, Mic, MicOff, ArrowLeft, CheckCircle, XCircle, 
  Compass, ShieldCheck, Home, Sunset, Droplet, Apple 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { knowledgeData as FALLBACK_KNOWLEDGE } from '../data/knowledgeBase';
import { livingGuideData, LivingGuideCategory } from '../data/livingGuide';

const IconMap: Record<string, any> = {
  Home,
  Sunset,
  Droplet,
  Apple
};

export default function KnowledgePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState<'qa' | 'guide' | 'ai_agent'>('qa');
  const [search, setSearch] = useState('');
  const { language: lang } = useLanguage();
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  
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
      
      // Merge Firestore documents with offline seeds, avoiding duplicates
      const merged = [...data];
      preparedSeed.forEach(seed => {
        const isDuplicate = data.some((d: any) => 
          (d.question?.en && d.question.en === seed.question?.en) || 
          (d.question?.hi && d.question.hi === seed.question?.hi)
        );
        if (!isDuplicate) {
          merged.push(seed);
        }
      });

      setKnowledge(merged);
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
      setLogs(prev => [...prev, "[AI MASTER] Contacting Gemini 3.5 Flash server for content structuring..."]);
      
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
    <div className="min-h-full p-6 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header */}
      <header className="flex items-center justify-between gap-4 mb-6 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            <BookOpen className="text-[#FF6D00] shrink-0" size={26} />
            {lang === 'en' ? 'JAIN PATHSHALA & GYAN' : 'जैन पाठशाला एवं ज्ञान सागर'}
          </h1>
        </div>
      </header>

      {/* Main Mode / Tab Switcher */}
      <div className="flex p-1 mb-8 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-xl mx-auto overflow-hidden">
        <button
          onClick={() => { setActiveTab('qa'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'qa' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <BookOpen size={16} />
          {lang === 'en' ? 'Q&A Database' : 'जिज्ञासा समाधान'}
        </button>
        <button
          onClick={() => { setActiveTab('guide'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'guide' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Compass size={16} />
          {lang === 'en' ? 'Living Guide' : 'मूल जैन दिनचर्या'}
        </button>
        <button
          onClick={() => { setActiveTab('ai_agent'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'ai_agent' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Sparkles size={16} />
          {lang === 'en' ? 'AI Swadhyay' : 'एआई स्वाध्याय'}
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
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-[#FF8A65]" size={18} />
              <input
                type="text"
                placeholder={lang === 'en' ? "Search spiritual/scientific questions..." : "शंका समाधान खोजें (जैसे: रात्रि भोजन, पानी)..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
              />
              <button 
                onClick={toggleListening}
                className={cn(
                  "absolute right-4 p-2 rounded-full transition-all cursor-pointer",
                  isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-gray-400 hover:text-[#FF8A65] hover:bg-[#FF6D00]/10"
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            {speechError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{speechError}</p>
            )}
          </div>

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

      {activeTab === 'ai_agent' && (
        <div className="space-y-6">
          {!unlocked ? (
            <div className="max-w-md mx-auto p-8 bg-white dark:bg-[#121212]/90 border border-gray-100 dark:border-white/10 rounded-3xl shadow-xl text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F]" />
              <div className="mx-auto w-16 h-16 bg-orange-500/10 dark:bg-[#FF6D00]/5 rounded-2xl flex items-center justify-center text-[#FF6D00]">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 className="text-xl font-display font-black tracking-tight text-gray-900 dark:text-white">
                  {lang === 'en' ? 'DEVELOPER AI GATEWAY' : 'डेवलपर एआई प्रवेशद्वार'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-semibold">
                  {lang === 'en' 
                    ? 'Enter your master developer passcode to activate autonomous database generation controls.' 
                    : 'स्वायत्त डेटाबेस जनरेशन नियंत्रण सक्रिय करने के लिए मास्टर डेवलपर पासकोड दर्ज करें।'}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">
                  {lang === 'en' ? '(Passcode is highly secret and hidden from UI)' : '(पासकोड अत्यधिक गुप्त है और छुपा हुआ है)'}
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={lang === 'en' ? 'Enter Passcode' : 'गुप्त पासकोड दर्ज करें'}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6D00] text-gray-900 dark:text-white"
                />
                {errorMsg && (
                  <p className="text-red-500 text-xs font-black tracking-wide bg-red-500/10 py-2.5 px-3 rounded-xl border border-red-500/15">
                    🚨 {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF9100] text-white font-black text-xs tracking-wider uppercase shadow-md shadow-[#FF6D00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'AUTHENTICATE AI-CORE' : 'एआई-कोर प्रमाणित करें'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#121212]/95 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-6 max-w-3xl mx-auto backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F]" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-[#FF6D00] uppercase">Autonomous AI Swadhyay Agent</span>
                  </div>
                  <h2 className="text-lg font-display font-black text-gray-900 dark:text-white mt-1">
                    {lang === 'en' ? 'Jainism GPT Database Maker' : 'जैनिज्म जीपीटी डेटाबेस जनरेटर'}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 text-emerald-500 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                  <span className="font-extrabold">{lang === 'en' ? 'SHIELDED PORT CONNECTED' : 'सुरक्षित लिंक सक्रिय'}</span>
                </div>
              </div>

              <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/5 font-mono text-xs">
                {logs.map((log, lidx) => (
                  <div key={lidx} className="leading-relaxed whitespace-pre-wrap">
                    {log.startsWith('[SYSTEM]') && <span className="text-gray-400 font-medium">{log}</span>}
                    {log.startsWith('[STATUS]') && <span className="text-green-500 font-bold">{log}</span>}
                    {log.startsWith('[GUIDE]') && <span className="text-[#FF6D00] font-semibold">{log}</span>}
                    {log.startsWith('[COMMAND]') && <span className="text-blue-500 font-extrabold">{log}</span>}
                    {log.startsWith('[AI MASTER]') && <span className="text-amber-500 font-extrabold">{log}</span>}
                    {log.startsWith('[DB TRANSACTION]') && <span className="text-indigo-400 font-extrabold">{log}</span>}
                    {log.startsWith('[DB SUCCESS]') && <span className="text-emerald-500 font-black">{log}</span>}
                    {log.startsWith('[AI ERROR]') && <span className="text-red-500 font-black">{log}</span>}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-amber-500 italic animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Gemini AI is parsing details, creating structured schema, and pushing to Firebase...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleSendAgentPrompt} className="space-y-4">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    disabled={isProcessing}
                    placeholder={lang === 'en' ? "Tell AI what data to add (e.g. 'Add scientific details about Namokar Mantra recitation')" : "एआई को बताएं कि क्या डेटा जोड़ना है (जैसे: 'नवकार मंत्र पर वैज्ञानिक शोध जोड़ें')..."}
                    className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5 rounded-2xl pl-5 pr-14 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !agentPrompt.trim()}
                    className="absolute right-3.5 p-2.5 rounded-xl bg-[#FF6D00] text-white hover:bg-[#FF8F00] transition-colors disabled:opacity-40 disabled:hover:bg-[#FF6D00] cursor-pointer"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-[#FF6D00] uppercase block">
                    {lang === 'en' ? 'Try Quick Presets | त्वरित निर्देश' : 'त्वरित निर्देश आजमाएं'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {presets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setAgentPrompt(preset)}
                        className="p-3 text-left bg-gray-50 dark:bg-white/5 border border-gray-200/40 dark:border-white/5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#FF8F00]/5 dark:hover:bg-[#FF8F00]/5 hover:border-[#FF6D00]/30 transition-all cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
                      >
                        💡 {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

