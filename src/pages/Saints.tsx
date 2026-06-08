import { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Info, ArrowLeft, Loader2, Search, Mic, MicOff, Star, Compass, Network, ArrowDown, Sparkles, Shield, AlertTriangle, Bell, MapPin, Navigation, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { lineageData, LineageNode } from '../data/lineageData';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';

const FALLBACK_SAINTS = [
  {
    name: {
      en: "Acharya Kundakunda Dev",
      hi: "आचार्य कुंदकुंद देव"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    period: { en: "1st Century BC", hi: "ईसा पूर्व प्रथम शताब्दी" },
    color: "from-orange-500 to-[#FF6D00]",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "The highly revered philosopher-monk who authored foundational treatises like Samayasara, Pravachanasara, Niyamasara, and Panchastikayasara. He is considered the pillar of the Digambara sect, with his name invoked right after Lord Mahavira and Gautama Gandhara in daily spiritual prayers.",
      hi: "जैन धर्म के महानतम दार्शनिक और अध्यात्मवादी संत। उन्होंने समयसार, प्रवचनसार, नियमसार और पंचास्तिकायसार जैसे महान आध्यात्मिक ग्रंथों की रचना की। प्रतिदिन मंगलाचरण में महावीर भगवान और गौतम गणधर के तुरंत बाद इनका नाम आदरपूर्वक स्मरण किया जाता है।"
    }
  },
  {
    name: {
      en: "Acharya Samantabhadra",
      hi: "आचार्य समंतभद्र देव"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    period: { en: "2nd Century AD", hi: "द्वितीय शताब्दी" },
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "The master logician, debater, and creator of the Anekantavada logic school. Famous for composing the 'Ratnakaranda Sravakachara' (conduct code for householders) and the glorious 'Aptamimamsa', which established the concepts of the omniscient (Sarvajna).",
      hi: "जैन न्याय (न्यायशास्त्र) के महान आचार्य और अनेकांतवाद के प्रबल व्याख्याता। इन्होंने गृहस्थों के आचरण के लिए 'रत्नकरण्ड श्रावकाचार' और भगवान की परीक्षा करने वाले अद्वितीय ग्रंथ 'आप्तमीमांसा' (देवागम स्तोत्र) की रचना की।"
    }
  },
  {
    name: {
      en: "Acharya Pujyapada / Devanandi",
      hi: "आचार्य पूज्यपाद देव"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    period: { en: "5th Century AD", hi: "पंचम शताब्दी" },
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "A multi-faceted saint who was a master of Sanskrit grammar, ayurvedic medicine, and spiritual philosophy. Author of 'Sarvarthasiddhi' (the oldest commentary on Tattvartha Sutra), 'Samadhitantra', and 'Ishtopadesha'. Legend says devas worshiped his pure lotus feet.",
      hi: "व्याकरण, आयुर्वेद और अध्यात्म के अद्वितीय निष्णात महामुनि। इन्होंने तत्वार्थसूत्र पर सर्वप्रशंसित राजवार्तिक-सर्वार्थसिद्धि भाष्य लिखा, साथ ही 'समाधितंत्र' और 'इष्टोपदेश' जैसी कल्याणकारी आत्म-बोध रचनाएं रचीं।"
    }
  },
  {
    name: {
      en: "Acharya Haribhadra Suri",
      hi: "आचार्य हरिभद्र सूरी"
    },
    sect: { en: "Svetambara (श्वेतांबर)", hi: "श्वेतांबर परंपरा" },
    period: { en: "8th Century AD", hi: "अष्टम शताब्दी" },
    color: "from-red-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "A monumental Svetambara scholar who converted from Brahminism and penned 1448 distinct treatises. He integrated yoga into Jain frameworks in works like 'Yogabindu' and 'Yogadristisamuccaya', and wrote the encyclopedic narrative 'Samaraichcha Kaha'.",
      hi: "श्वेतांबर परंपरा के युगप्रवर्तक आचार्य जिन्होंने योग और दर्शन शास्त्र को अभूतपूर्व दिशा दी। इन्होंने संस्कृति और लोकभाषा में अनेकों ग्रंथ लिखे जिनमें 'षड्दर्शन समुच्चय' और 'योगविंशिका' प्रमुख हैं।"
    }
  },
  {
    name: {
      en: "Acharya Hemachandra Suri",
      hi: "आचार्य हेमचन्द्र सूरी"
    },
    sect: { en: "Svetambara (श्वेतांबर)", hi: "श्वेतांबर परंपरा" },
    period: { en: "12th Century AD (Kalaikal Sarvajna)", hi: "कलिकालसर्वज्ञ (१२वीं शताब्दी)" },
    color: "from-purple-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "Known as the 'Kalaikal Sarvajna' (All-knowing of the Iron Age). He was an advisor to King Kumarapala and wrote standard comprehensive grammar books, historical accounts (Trishashti-shalaka-purusha-charitra), and the 'Yogashastra' systemizing Jain life.",
      hi: "कलिकालसर्वज्ञ उपाधि से विभूषित। सिद्धराज जयसिंह और राजा कुमारपाल के परामर्शदाता। इन्होंने इतिहास (त्रिषष्टि शलाका पुरुष चरित्र), संस्कृत प्राकृत व्याकरण और जैन गृहस्थ चर्या पर 'योगशास्त्र' की वृहद रचना की।"
    }
  },
  {
    name: {
      en: "Prathamacharya Shri Shantisagar Ji Maharaj",
      hi: "प्रथमाचार्य श्री शांतिसागर जी महाराज"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    period: { en: "1872-1955 AD", hi: "१८७२-१९५५ ईस्वी" },
    color: "from-amber-600 to-red-700",
    image: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "The historic pioneer who revived the silent Digambara ascetic tradition, taking initial vows and traveling on foot thousands of miles across India to restore pilgrimage safety, organize texts, and re-establish standard monk assemblies.",
      hi: "बीसवीं शताब्दी के प्रथम दिगंबर जैन मुनिराज एवं आचार्य। जिन्होंने लुप्तप्राय हो चुकी दक्षिण भारत से उत्तर भारत तक दिगंबर मुनि चर्या को पुनः जीवित किया और देशभर में अहिंसा व संयम की अलख जगाई।"
    }
  },
  {
    name: {
      en: "Param Pujya Acharya Shri Vidyasagar Ji Maharaj",
      hi: "राष्ट्रसंत आचार्य श्री विद्यासागर जी महाराज"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    period: { en: "1946-2024 AD", hi: "१९४६-२०२४ ईस्वी" },
    color: "from-[#FF6D00] to-[#FFD54F]",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "The legendary, fully detached 21st-century Digambara Acharya. Famous for severe physical penance, absolute silence, and massive state-wide welfare schemes like jail inmate transformations, bio-fabrics (Hathkargha), and saving cows (Pratibha Sthali).",
      hi: "आधुनिक युग के महानतम तपोमूर्ति ज्ञानी आचार्यदेव। कठोर चर्या, मौन साधना, हिंदी राष्ट्रभाषा प्रेम और कैदियों के हृदय परिवर्तन, हतकरघा स्वावलंबन तथा गौशाला संरक्षण जैसे महाकार्यों के प्रणेता।"
    }
  },
  {
    name: {
      en: "Yugacharya Acharya Mahapragya Ji",
      hi: "युगाचार्य आचार्य महाप्रज्ञ जी"
    },
    sect: { en: "Svetambara Terapanth", hi: "तेरापंथ श्वेतांबर" },
    period: { en: "1920-2010 AD", hi: "१९२०-२०१० ईस्वी" },
    color: "from-cyan-600 to-blue-700",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
    desc: {
      en: "The tenth coordinate leader of Svetambara Terapanth sect. A spiritual seeker who designed Preksha Meditation (a scientific system of inner cleaning) and spearheaded non-violent 'Ahimsa Yatra' journeys across hundreds of villages.",
      hi: "तेरापंथ धर्मसंघ के १०वें आचार्य। प्रेक्षाध्यान साधना प्रणाली और जीवन विज्ञान के असाधारण प्रणेता। इन्होंने देश भर में हजारों किलोमीटर की अहिंसा यात्रा कर साक्षरता व शांति संदेश बांटा।"
    }
  }
];

export default function SaintsPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'directory' | 'lineage'>('directory');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [saints, setSaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('mahavira');

  const recognitionRef = useRef<any>(null);

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

  // Voice Search Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(language === 'en' ? 'Voice search not supported in this browser environment.' : 'इस ब्राउज़र में वॉइस सर्च काम नहीं करता है।');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const displaySaints = useMemo(() => {
    const combined = [...FALLBACK_SAINTS];
    saints.forEach((fs: any) => {
      const matchIdx = combined.findIndex(item => 
        (item.name?.en && fs.name?.en && item.name.en.toLowerCase() === fs.name.en.toLowerCase())
      );
      if (matchIdx !== -1) {
        combined[matchIdx] = { ...combined[matchIdx], ...fs };
      } else {
        combined.push(fs);
      }
    });
    return combined;
  }, [saints]);

  const matchesSearch = (saint: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();

    const nameEn = (saint.name?.en || "").toLowerCase();
    const nameHi = (saint.name?.hi || "").toLowerCase();
    const descEn = (saint.desc?.en || "").toLowerCase();
    const descHi = (saint.desc?.hi || "").toLowerCase();
    const sectEn = (saint.sect?.en || "").toLowerCase();
    const sectHi = (saint.sect?.hi || "").toLowerCase();

    if (nameEn.includes(q) || nameHi.includes(q) || descEn.includes(q) || descHi.includes(q) || sectEn.includes(q) || sectHi.includes(q)) {
      return true;
    }

    const phonetics: Record<string, string[]> = {
      "kunda": ["kundakunda", "kund", "कुंदकुंद", "कुन्दकुन्द"],
      "samanta": ["samantabhadra", "samant", "समंतभद्र", "समन्तभद्र"],
      "pujya": ["pujyapada", "pujyapad", "पूज्यपाद", "देवों द्वारा पूजित"],
      "hari": ["haribhadra", "हरिभद्र"],
      "hema": ["hemachandra", "hemchand", "हेमचन्द्र", "हेमचंद्र"],
      "shanti": ["shantisagar", "शांतिसागर", "शान्तिसागर"],
      "vidya": ["vidyasagar", "विद्यासागर", "विद्वान", "विद्या"],
      "maha": ["mahapragya", "महाप्रज्ञ", "प्राज्ञ"]
    };

    for (const [key, patterns] of Object.entries(phonetics)) {
      if (q.includes(key) || key.includes(q)) {
        for (const p of patterns) {
          if (nameEn.includes(p) || nameHi.includes(p)) return true;
        }
      }
    }
    return false;
  };

  const filteredSaints = displaySaints.filter(matchesSearch);

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 -mt-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <Users className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">{language === 'en' ? 'JAIN SAINTS & LINEAGE' : 'श्रमण निर्देशिका एवं गुरु परंपरा'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-2xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200/50 dark:border-white/5 h-10 w-10 flex items-center justify-center shrink-0"
            title={language === 'en' ? 'Saints Section Guide' : 'संत निर्देशिका निर्देशपुस्तिका'}
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

      {/* Switcher Tab */}
      <div className="flex p-1 mb-8 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-sm mx-auto shadow-sm gap-1">
        <button
          onClick={() => setActiveTab('directory')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'directory' 
              ? "bg-[#FF6D00] text-white shadow-md" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Users size={14} />
          {language === 'en' ? 'Directory' : 'संत निर्देशिका'}
        </button>
        <button
          onClick={() => setActiveTab('lineage')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'lineage' 
              ? "bg-[#FF6D00] text-white shadow-md" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Network size={14} />
          {language === 'en' ? 'Lineage' : 'गुरु परंपरा'}
        </button>
      </div>

      {activeTab === 'directory' ? (
        /* ==================== SAINTS DIRECTORY SECTION ==================== */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Intro info box */}
          <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-[#121212] border border-gray-200 dark:border-white/5 shadow-sm text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {language === 'en'
              ? 'Jain ascetics (Sadhus and Sadhvis) follow pristine vows of non-violence, truth, non-stealing, absolute celibacy, and complete non-attachment. They serve as living representations of liberation and high spiritual scholarship.'
              : 'जैन तीर्थंकरों की परंपरा में मुनिराज अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और पूर्ण अपरिग्रह के २८ मूलगुणों का कठिन पालन करते हैं। वे अध्यात्म, त्याग और आत्मज्ञान की जीवंत प्रतिमूर्ति हैं।'}
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500 animate-pulse"></div>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-[#FF6D00]" size={18} />
              <input 
                type="text" 
                placeholder={language === 'en' ? "Search Saint (e.g., Kundakunda, Vidyasagar)..." : "संत का नाम खोजें (जैसे: कुंदकुंद, विद्यासागर)..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
              />
              <button 
                onClick={toggleVoiceSearch}
                className={`absolute right-3.5 top-2.5 p-1.5 rounded-xl transition-all cursor-pointer ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-[#FF6D00]'}`}
                title="Voice Search"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          {/* Voice Status Alert */}
          {isListening && (
            <div className="text-xs bg-red-500/10 text-red-500 font-black tracking-wider uppercase border border-red-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between animate-pulse">
              <span>🎙️ Listening now... speak saint's name</span>
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            </div>
          )}

          {/* Directory List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Loader2 className="animate-spin mb-3 text-[#FF6D00]" size={28} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Loading Saints Database...</p>
              </div>
            ) : filteredSaints.length > 0 ? (
              filteredSaints.map((saint: any, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-3xl p-5 hover:border-[#FF6D00]/40 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-5"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shrink-0 shadow-sm relative group self-center md:self-start bg-zinc-100 dark:bg-zinc-900">
                    <img 
                      src={saint.image} 
                      alt={saint.name?.en} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-black text-lg md:text-xl text-gray-900 dark:text-white leading-tight">
                        {language === 'en' ? saint.name?.en : saint.name?.hi}
                      </h3>
                      {saint.period && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-orange-100 dark:bg-[#FF6D00]/10 text-orange-600 dark:text-[#FFD54F] font-bold">
                          {language === 'en' ? saint.period.en : saint.period.hi}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Star className="text-yellow-500 shrink-0" size={12} />
                      <span className={`text-[9px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${saint.color || 'from-orange-500 to-amber-600'}`}>
                        {language === 'en' ? saint.sect?.en : saint.sect?.hi}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                      {language === 'en' ? saint.desc?.en : saint.desc?.hi}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
                {language === 'en' ? 'No matching saints found.' : 'कोई मिलान मुनिराज नहीं मिले।'}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================== LINEAGE MAPS (GURU-PARAMPARA) ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-sm transition-all duration-300 animate-in fade-in">
          
          {/* Vertical Node Lineage Tracker Chain */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5 text-xs text-amber-800 dark:text-amber-400 font-bold flex items-start gap-2">
              <Sparkles className="shrink-0 mt-0.5 animate-pulse text-amber-600" size={15} />
              <div>
                <strong className="block uppercase text-[10px] tracking-wider mb-0.5 font-black">Digambar Monk Lineage (अनवरत गुरु परंपरा)</strong>
                {language === 'en' 
                  ? 'Click successive nodes to view the historical details & unbroken lineage connecting Mahavira to Gandharas down to the 21st century.'
                  : 'तीर्थंकर महावीर से लेकर वर्तमान आचार्यों तक की अक्षुण्ण गुरु परंपरा देखने के लिए चरणों पर क्लिक करें।'}
              </div>
            </div>

            <div className="relative pl-6 border-l-2 border-dashed border-[#FF6D00]/30 space-y-6">
              {lineageData.map((node, index) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div key={node.id} className="relative group">
                    
                    {/* Circle Node Pin */}
                    <div className={cn(
                      "absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                      isSelected 
                        ? "bg-[#FF6D00] border-[#FFD54F] scale-110 shadow-md shadow-[#FF6D00]/30" 
                        : "bg-white dark:bg-[#050505] border-[#FF6D00]/50 group-hover:border-[#FF6D00]"
                    )}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    {/* Step Card link */}
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={cn(
                        "w-full p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center justify-between",
                        isSelected
                          ? "bg-white dark:bg-[#151515] border-[#FF6D00] shadow-sm text-[#FF6D00] dark:text-[#FFD54F]"
                          : "bg-white/60 dark:bg-white/[0.02] border-transparent hover:bg-white dark:hover:bg-white/5"
                      )}
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 block mb-0.5">
                          {node.period[language]}
                        </span>
                        <h3 className="font-display font-black text-xs text-gray-800 dark:text-gray-200">
                          {node.name[language]}
                        </h3>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 rounded-md self-center">
                        {index + 1}
                      </span>
                    </button>

                    {/* succession arrow separator */}
                    {index < lineageData.length - 1 && (
                      <div className="absolute -bottom-4.5 left-[-23px] text-gray-400/50 pointer-events-none">
                        <ArrowDown size={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expanded Selected Node Detail Panel */}
          <div className="lg:col-span-7">
            {(() => {
              const node = lineageData.find(n => n.id === selectedNodeId);
              if (!node) return null;
              return (
                <div className="bg-white dark:bg-[#121212] border border-gray-250/20 dark:border-white/5 p-6 rounded-[2rem] shadow-sm relative overflow-hidden sticky top-6">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF6D00]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="mb-5 pb-3 border-b border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FF6D00]/10 text-[#FF6D00]">
                      {node.phase[language]}
                    </span>
                    <h2 className="text-xl font-display font-black text-gray-900 dark:text-white mt-1.5 leading-snug">
                      {node.name[language]}
                    </h2>
                    <p className="text-[11px] font-bold text-[#FF8A65] mt-0.5">
                      {node.period[language]}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                        {language === 'en' ? 'Position / Status' : 'पदवी / भूमिका'}
                      </h4>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 leading-relaxed">
                        {node.role[language]}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                        {language === 'en' ? 'Traditional Importance' : 'परंपरा सम्मत इतिहास'}
                      </h4>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed p-1">
                        {node.desc[language]}
                      </p>
                    </div>

                    {/* Unbroken Lineage Chain Info Seal */}
                    <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-white/[0.02] border border-gray-150/40 dark:border-white/5 flex items-start gap-3 mt-6">
                      <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 shrink-0 mt-0.5 border border-orange-500/10">
                        <Star size={14} className="fill-orange-600/20" />
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {language === 'en'
                          ? 'This unbroken Digambar chain guarantees that the original values of self-realization, absolute nudity (Nirgranthatva) and non-injury are preserved exactly as taught by Mahavira.'
                          : 'यह अखंड दिगंबर श्रमण परंपरा सुनिश्चित करती है कि आत्म-कल्याण, निर्ग्रंथता (दिगंबरत्व) एवं अपरिग्रह के प्राचीन पवित्र सिद्धांत आदि काल से सीधे आज तक आप तक पहुंचे हैं।'}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}
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
                {language === 'en' ? 'Welcome to Jain Saints Directory & Lineage!' : 'श्रमण निर्देशिका एवं गुरु परंपरा में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'This sacred education portal displays highly verified records of historical and contemporary Jain ascetics without unrequested trackers:' 
                  : 'यह पावन अनुभाग पूज्य ऐतिहासिक आचार्यों एवं वर्तमान विहरमान संतों के त्याग तपस्यामय जीवन का प्रामाणिक दिग्दर्शन है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Prisitin Ascetics Directory:' : 'श्रमण संत निर्देशिका:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Explore biography cards of revered Acharyas, their historical periods, and strict ascetical vows.' 
                    : 'महान आचार्यों (जैसे स्वामी कुन्दकुन्द, समन्तभद्र स्वामी) के दार्शनिक जीवन, दीक्षा काल एवं शास्त्र रचनाओं का अध्ययन करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Unbroken Lineage Trees (Patravali):' : 'अखंड गुरु पट्टावली:'}</strong>{' '}
                  {language === 'en'
                    ? 'Access dynamic lineage graphs representing direct master-disciple connections across modern centuries.'
                    : 'आचार्य आदिसागर अंकलीकर, आचार्य शांतिसागर जी प्रणीत दक्षिण-उत्तर भारत गुरु परंपरा के पट्ट संबंधों का सजीव आरेख देखें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Phonetic Voice Searches:' : 'नवीन स्वर इनपुट:'}</strong>{' '}
                  {language === 'en'
                    ? 'Search ascetics simply by using mic voice triggers in Hindi/English (e.g. Kundakunda, Vidyasagar).'
                    : 'खोज प्रक्रिया को आसान बनाने के लिए माइक्रोफोन बटन दबाकर सीधे संत का नाम बोलकर खोजें।'}
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

      <SectionAiAgent section="saints" />
    </div>
  );
}

