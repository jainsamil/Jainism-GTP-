import { useState, useMemo, useEffect } from 'react';
import { Landmark, Clock, ArrowLeft, Search, Filter, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { historyData, HeritageItem } from '../data/historyData';
import SectionAiAgent from '../components/SectionAiAgent';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function HistoryPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(18);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Firestore dynamic sync state
  const [firestoreHistory, setFirestoreHistory] = useState<HeritageItem[]>([]);
  const [deletedHistoryIds, setDeletedHistoryIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const q = collection(db, 'history');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData: HeritageItem[] = [];
      const deletedIds = new Set<string>();
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.deleted === true) {
          deletedIds.add(docSnap.id);
        } else {
          docsData.push({
            id: docSnap.id,
            title: data.title || { en: '', hi: '' },
            desc: data.desc || { en: '', hi: '' },
            detailedText: data.detailedText || { en: '', hi: '' },
            era: data.era || { en: '', hi: '' },
            image: data.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
            category: data.category || 'Temple',
            state: data.state || 'Madhya Pradesh',
            period: data.period || 'Ancient'
          });
        }
      });
      setFirestoreHistory(docsData);
      setDeletedHistoryIds(deletedIds);
    }, (error) => {
      console.error("Firestore history subscription error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Reset page size on filter change
  useEffect(() => {
    setVisibleCount(18);
  }, [searchQuery, selectedCategory, selectedState]);

  // Separation of the 8 Main Epochs of Jinas vs the Generated Reference Library items
  const mainEpochs = useMemo(() => {
    const staticEpochs = historyData.slice(0, 8).filter(item => !deletedHistoryIds.has(item.id));
    const firestoreEpochs = firestoreHistory.filter(item => item.category === 'Event' || item.id?.startsWith('event'));
    
    const dataMap = new Map(firestoreEpochs.map(doc => [doc.id, doc]));
    const merged = staticEpochs.map(fallbackItem => {
      let matchedItem = dataMap.get(fallbackItem.id);
      if (!matchedItem) {
        const matchByTitle = firestoreEpochs.find((d: any) => 
          (d.title?.en && d.title.en === fallbackItem.title?.en) ||
          (d.title?.hi && d.title.hi === fallbackItem.title?.hi)
        );
        if (matchByTitle) {
          matchedItem = matchByTitle;
          dataMap.delete(matchByTitle.id);
        }
      } else {
        dataMap.delete(fallbackItem.id);
      }
      return matchedItem ? { ...fallbackItem, ...matchedItem } : fallbackItem;
    });
    
    return [...merged, ...Array.from(dataMap.values())];
  }, [firestoreHistory, deletedHistoryIds]);

  const repositoryItems = useMemo(() => historyData.slice(8), []);

  // Merge static list with Firestore live updates/additions
  const combinedHistoryItems = useMemo(() => {
    const firestoreRepo = firestoreHistory.filter(item => item.category !== 'Event' && !item.id?.startsWith('event'));
    
    const dataMap = new Map(firestoreRepo.map(doc => [doc.id, doc]));
    const merged = repositoryItems.filter(item => !deletedHistoryIds.has(item.id)).map(fallbackItem => {
      let matchedItem = dataMap.get(fallbackItem.id);
      if (!matchedItem) {
        const matchByTitle = firestoreRepo.find((d: any) => 
          (d.title?.en && d.title.en === fallbackItem.title?.en) ||
          (d.title?.hi && d.title.hi === fallbackItem.title?.hi)
        );
        if (matchByTitle) {
          matchedItem = matchByTitle;
          dataMap.delete(matchByTitle.id);
        }
      } else {
        dataMap.delete(fallbackItem.id);
      }
      return matchedItem ? { ...fallbackItem, ...matchedItem } : fallbackItem;
    });
    
    return [...merged, ...Array.from(dataMap.values())];
  }, [repositoryItems, firestoreHistory, deletedHistoryIds]);

  const statesList = useMemo(() => {
    const states = new Set<string>();
    combinedHistoryItems.forEach(item => {
      if (item.state) states.add(item.state);
    });
    return ['All', ...Array.from(states).sort()];
  }, [combinedHistoryItems]);

  const categoriesList = ['All', 'Temple', 'Monument', 'Inscription', 'Heritage Site'];

  const filteredItems = useMemo(() => {
    return combinedHistoryItems.filter(item => {
      const titleText = (item.title?.[language] || item.title?.en || '').toLowerCase();
      const descText = (item.desc?.[language] || item.desc?.en || '').toLowerCase();
      const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || descText.includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesState = selectedState === 'All' || item.state === selectedState;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [combinedHistoryItems, searchQuery, selectedCategory, selectedState, language]);

  const introText = {
    en: "Explore the ancient heritage, historical monuments, prehistoric caves, and scriptures testifying to the rich legacy of Jain history.",
    hi: "जैन धर्म भारत का एक गौरवमयी प्राचीन धर्म है। यह पवित्र इतिहास विभाग हमारी प्राचीन वीतराग संस्कृति, गुफाओं, शिलालेखों और देशव्यापी भव्य प्रतिमाओं की गवाही देता है। नीचे दी गई समय-सारणी ऐतिहासिक कालों को दर्शाती है, तथा डिजिटल गैलरी से आप प्राचीन धरोहरों की खोज कर सकते हैं।"
  };

  return (
    <div className="min-h-full p-6 pb-24 bg-transparent text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 px-6 py-4 mb-8 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4 transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 sm:w-10 sm:h-10 flex items-center justify-center transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-750 dark:text-gray-300" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)] truncate">
            <Landmark className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">{language === 'hi' ? 'जैन इतिहास व धरोहर' : 'HERITAGE & HISTORY'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm animate-none"
            title={language === 'en' ? 'History Section Guide' : 'इतिहास भाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Inline Symmetrical Translate Button matching line */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      <p className="text-gray-700 dark:text-gray-400 mb-10 leading-relaxed font-semibold bg-white dark:bg-[#121212]/85 p-5 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] text-sm transition-colors duration-300 text-left">
        {language === 'hi' ? introText.hi : introText.en}
      </p>

      {/* SECTION 1: Major Epochs Timeline */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-l-4 border-[#FF6D00] pl-3 tracking-wide text-left">
          {language === 'hi' ? 'ऐतिहासिक समय-सारिणी (मुख्य कालगणना)' : 'MAJOR HISTORICAL EPOCHS TIMELINE'}
        </h2>
        
        <div className="relative border-l-2 border-[#FF6D00]/30 ml-4 space-y-8 pb-4">
          {mainEpochs.map((item, idx) => (
            <div key={idx} className="relative pl-8 group">
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-gray-100 dark:border-[#050505] ${item.color || 'bg-orange-500'} shadow-[0_0_10px_rgba(255,109,0,0.8)] group-hover:scale-125 transition-transform duration-300`} />
              
              <div 
                onClick={() => setSelectedItem(item)}
                className="bg-white dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] cursor-pointer transition-all duration-500 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#FFD54F] font-bold text-[10px] uppercase tracking-widest mb-3 bg-[#FFD54F]/10 border border-[#FFD54F]/20 w-fit px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,213,79,0.1)]">
                    <Clock size={14} />
                    {item.period}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#FF6D00] dark:group-hover:text-[#FFD54F] transition-colors">
                    {item.title?.[language] || item.title?.en}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {item.desc?.[language] || item.desc?.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Search & Filter Curated Jain Monuments */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
              {language === 'hi' ? 'सत्यापित जैन धरोहर एवं तीर्थ दीर्घा' : 'CURATED JAIN HERITAGE & MONUMENTS'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {language === 'hi' ? 'श्रेणी, स्थान और राज्यों के अनुसार प्राचीन मंदिरों, प्रतिमाओं व अभिलेखों को खोजें' : 'Search & locate historical temples, grotto caves, inscriptions & relics'}
            </p>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-200 dark:border-white/5 shadow-inner mb-6 space-y-4 text-left">
          <UnifiedSearchBar
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder={language === 'hi' ? "इतिहास, मंदिर, स्थान, काल या शब्द खोजें..." : "Search temples, relics, structures, or centuries..."}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{language === 'hi' ? 'धरोहर प्रकार' : 'HERITAGE TYPE'}</label>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#FF6D00] text-black shadow-md' 
                        : 'bg-gray-100 dark:bg-[#181818] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {language === 'hi' 
                      ? (cat === 'All' ? 'सभी' : cat === 'Temple' ? 'मंदिर' : cat === 'Monument' ? 'स्मारक' : cat === 'Inscription' ? 'शिलालेख' : 'विरासत स्थल')
                      : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{language === 'hi' ? 'भारतीय राज्य' : 'INDIAN STATE'}</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2.5 bg-gray-100 dark:bg-[#181818] text-gray-700 dark:text-gray-300 text-xs rounded-xl border border-gray-200 dark:border-white/5 outline-none font-bold focus:border-[#FF6D00] transition-colors"
              >
                <option value="All">{language === 'hi' ? 'सभी राज्य (All States)' : 'All States'}</option>
                {statesList.filter(s => s !== 'All').map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic statistics ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'कुल संकलित कड़ियां' : 'TOTAL REGISTRY'}</span>
            <span className="text-lg font-black text-[#FFD54F]">{combinedHistoryItems.length} {language === 'hi' ? 'धरोहर' : 'Relics'}</span>
          </div>
          <div className="bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'भारतीय राज्य' : 'COVERED STATES'}</span>
            <span className="text-lg font-black text-[#FF6D00]">10 {language === 'hi' ? 'मुख्य राज्य' : 'Regions'}</span>
          </div>
          <div className="bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'काल निर्धारण' : 'CHRONOLOGY ERA'}</span>
            <span className="text-lg font-black text-amber-500">2500+ {language === 'hi' ? 'वर्ष का इतिहास' : 'Yrs History'}</span>
          </div>
          <div className="bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/5 p-4 rounded-2xl text-center shadow-sm dark:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-colors duration-300">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'शाश्वत स्वरूप' : 'ICONOGRAPHY'}</span>
            <span className="text-lg font-black text-yellow-500">Pure Digambar</span>
          </div>
        </div>

        {/* Grid displays filtered objects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, visibleCount).map((item, index) => (
            <div 
              key={index}
              onClick={() => setSelectedItem(item)}
              className="bg-white dark:bg-[#121212]/55 hover:bg-gray-50 dark:hover:bg-[#121212] border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm dark:shadow-lg flex flex-col justify-between"
            >
              <div className="p-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-mono font-black text-orange-500 uppercase bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                    {item.category}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin size={10} className="text-[#FFD54F]" />
                    {item.state}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1 mb-1.5">
                  {item.title?.[language] || item.title?.en}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {item.desc?.[language] || item.desc?.en}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#181818]/65 px-4 py-2 border-t border-gray-200 dark:border-white/5 flex justify-between items-center text-[9px] font-mono font-bold text-gray-500">
                <span>{language === 'hi' ? 'काल:' : 'Era:'} {item.period}</span>
                <span className="text-orange-500 uppercase font-black">{language === 'hi' ? 'विवरण' : 'Details'} ›</span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-600 font-bold tracking-wide">
            {language === 'hi' ? 'खोज मानदंडों से मेल खाती कोई धरोहर नहीं मिली।' : 'No heritage sites matched your criteria.'}
          </div>
        )}

        {filteredItems.length > visibleCount && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="px-6 py-3 bg-[#FF6D00] hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-[0_5px_15px_rgba(255,109,0,0.3)] transition-all"
            >
              {language === 'hi' ? `और २४ धरोहर देखें ( Load More - ${filteredItems.length - visibleCount} शेष)` : `Load More (${filteredItems.length - visibleCount} sites left)`}
            </button>
          </div>
        )}
      </div>

      {/* High Quality Detailed Overlay Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start mb-4 relative z-10 text-left">
              <div>
                <span className="text-[8px] font-mono font-black text-[#FF6D00] uppercase bg-[#FF6D00]/10 px-2.5 py-1 rounded-full border border-[#FF6D00]/20 inline-block mb-1">
                  {selectedItem.category}
                </span>
                <h2 className="text-xl font-display font-black text-gray-950 dark:text-white leading-tight">
                  {selectedItem.title?.[language] || selectedItem.title?.en}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Scroller */}
            <div className="overflow-y-auto pr-1 space-y-4 text-xs">
              {selectedItem.image && (
                <div className="rounded-xl overflow-hidden border border-gray-250 dark:border-white/10 shadow-lg relative aspect-video bg-gray-900">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title?.[language] || selectedItem.title?.en} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 px-2.5 py-1 rounded-md text-[9px] font-mono text-[#FFD54F]">
                    {selectedItem.era || selectedItem.period}
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-2xl space-y-3 font-semibold text-left">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="text-[#FFD54F]" />
                  <span>
                    <strong>{language === 'hi' ? 'स्थान व राज्य:' : 'State & Region:'}</strong> {selectedItem.state || "India (भारत)"}
                  </span>
                </div>
                {selectedItem.era && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Globe size={14} className="text-[#FFD54F]" />
                    <span>
                      <strong>{language === 'hi' ? 'ऐतिहासिक युग:' : 'Historical Dynasty/Era:'}</strong> {selectedItem.era}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-100/50 dark:bg-[#181818]/50 border border-gray-20s0 dark:border-white/5 rounded-2xl text-left">
                <span className="text-[9px] font-black text-orange-500 uppercase block mb-1.5 tracking-wider">{language === 'hi' ? 'ऐतिहासिक और आध्यात्मिक पुरालेख' : 'HISTORICAL & SPIRITUAL ANALYSIS'}</span>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400 font-medium font-sans">
                  {selectedItem.desc?.[language] || selectedItem.desc?.en}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full mt-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-2xl tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md"
            >
              {language === 'hi' ? 'गैलरी अवलोकन समाप्त करें' : 'Back to Archive'}
            </button>
          </div>
        </div>
      )}
      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10 text-left">
              <div>
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5 font-mono">
                  📁 {language === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                  ℹ️ {language === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-250 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-colors cursor-pointer active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch requested in help modal */}
            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10">
              <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400">
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
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-gray-700 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {language === 'en' ? 'Welcome to Jain History & Heritage Gallery!' : 'जैन इतिहास एवं प्राचीन धरोहर दीर्घा में स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-500 dark:text-gray-400">
                {language === 'en' 
                  ? 'This curated research module lets you explore thousands of years of non-violent history:' 
                  : 'यह अनुभाग भारत की श्रमण संस्कृति के गौरवमयी इतिहास व कला-कृतियों को खोजने में आपकी मदद करता है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400 font-semibold">
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? 'Major Epochs Timeline:' : 'मुख्य ऐतिहासिक कालगणना:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Explore the eight monumental epochs ranging from Lord Rishabhanatha’s pre-historic era to modern revivalism.' 
                    : 'भगवान आदिनाथ के कल्पवृक्ष काल से लेकर सम्राट चन्द्रगुप्त मौर्य एवं आधुनिक काल के स्वर्णिम इतिहास के आठ युगों को जानें।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? '350+ Monuments Library:' : '३५०+ कला व प्राचीन जैन मंदिरों की खोज:'}</strong>{' '}
                  {language === 'en'
                    ? 'Use the smart filter options to categorize monuments by state and type (e.g. Temples, Cave Grottos, Inscriptions).'
                    : 'भारत के विभिन्न राज्यों के प्राचीन जैन मंदिरों, एलीफेंटा/एलोरा गुफाओं तथा खंडगिरि-उदयगिरि के शिलालेखों को वर्गीकृत कर फ़िल्टर करें।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? 'Interactive Heritage Sheet:' : 'विस्तृत धरोहर विवरण पत्र:'}</strong>{' '}
                  {language === 'en'
                    ? 'Click on any heritage card to reveal detailed archaeological periods, coordinates, state, and historical analysis.'
                    : 'किसी भी धरोहर कार्ड पर क्लिक कर उस स्थान का कालखंड, निर्माता राजवंश, मुख्य विदेह मूर्ति एवं इतिहास स्वाध्याय करें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 text-center relative z-10">
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
      <SectionAiAgent section="history" />
    </div>
  );
}
