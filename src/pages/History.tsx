import { useState, useMemo, useEffect } from 'react';
import { Landmark, Clock, ArrowLeft, Search, Filter, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { historyData, HeritageItem } from '../data/historyData';

export default function HistoryPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(18);

  // Reset page size on filter change
  useEffect(() => {
    setVisibleCount(18);
  }, [searchQuery, selectedCategory, selectedState]);

  // Separation of the 8 Main Epochs of Jinas vs the Generated Reference Library items
  const mainEpochs = useMemo(() => historyData.slice(0, 8), []);
  const repositoryItems = useMemo(() => historyData.slice(8), []);

  const statesList = useMemo(() => {
    const states = new Set<string>();
    repositoryItems.forEach(item => {
      if (item.state) states.add(item.state);
    });
    return ['All', ...Array.from(states).sort()];
  }, [repositoryItems]);

  const categoriesList = ['All', 'Temple', 'Monument', 'Inscription', 'Heritage Site'];

  const filteredItems = useMemo(() => {
    return repositoryItems.filter(item => {
      const titleText = (item.title?.[language] || item.title?.en || '').toLowerCase();
      const descText = (item.desc?.[language] || item.desc?.en || '').toLowerCase();
      const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || descText.includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesState = selectedState === 'All' || item.state === selectedState;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [repositoryItems, searchQuery, selectedCategory, selectedState, language]);

  const introText = {
    hi: "जैन धर्म भारत का एक गौरवमयी प्राचीन धर्म है। यह पवित्र इतिहास विभाग हमारी प्राचीन वीतराग संस्कृति, गुफाओं, शिलालेखों और देशव्यापी भव्य प्रतिमाओं की गवाही देता है। नीचे दी गई समय-सारणी ऐतिहासिक कालों को दर्शाती है, तथा डिजिटल गैलरी से आप संपूर्ण ३५०+ धरोहरों की खोज कर सकते हैं।",
    en: "Jainism is one of India's most ancient path of spiritual purification. This repository chronicles our sacred heritage, rock-cut inscriptions, caves, and towering monolithic colossuses representing absolute non-possession. Explore the core timeline below, or search the complete digital catalog of 350+ monumental relics."
  };

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <Landmark className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          {language === 'hi' ? 'जैन इतिहास व धरोहर' : 'HERITAGE & HISTORY'}
        </h1>
      </header>

      <p className="text-gray-400 mb-10 leading-relaxed font-medium bg-[#121212]/80 p-5 rounded-2xl border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)] text-sm">
        {introText[language]}
      </p>

      {/* SECTION 1: Major Epochs Timeline */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-white border-l-4 border-[#FF6D00] pl-3 tracking-wide">
          {language === 'hi' ? 'ऐतिहासिक समय-सारिणी (मुख्य कालगणना)' : 'MAJOR HISTORICAL EPOCHS TIMELINE'}
        </h2>
        
        <div className="relative border-l-2 border-[#FF6D00]/30 ml-4 space-y-8 pb-4">
          {mainEpochs.map((item, idx) => (
            <div key={idx} className="relative pl-8 group">
              <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-[#050505] ${item.color || 'bg-orange-500'} shadow-[0_0_10px_rgba(255,109,0,0.8)] group-hover:scale-125 transition-transform duration-300`} />
              
              <div 
                onClick={() => setSelectedItem(item)}
                className="bg-[#121212]/80 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 hover:border-[#FF6D00]/30 hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] cursor-pointer transition-all duration-500 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#FFD54F] font-bold text-[10px] uppercase tracking-widest mb-3 bg-[#FFD54F]/10 border border-[#FFD54F]/20 w-fit px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(255,213,79,0.1)]">
                    <Clock size={14} />
                    {item.period}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#FFD54F] transition-colors">
                    {item.title?.[language] || item.title?.en}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {item.desc?.[language] || item.desc?.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Search & Filter 350+ Jain Monuments */}
      <div className="mt-12 pt-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {language === 'hi' ? '३५०+ जैन धरोहर एवं तीर्थ दीर्घा' : '350+ HERITAGE SITES & MONUMENTS'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {language === 'hi' ? 'श्रेणी, स्थान और राज्यों के अनुसार प्राचीन मंदिरों, प्रतिमाओं व अभिलेखों को खोजें' : 'Search & locate historical temples, grotto caves, inscriptions & relics'}
            </p>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-[#121212] p-5 rounded-3xl border border-white/5 shadow-inner mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder={language === 'hi' ? "इतिहास, मंदिर, स्थान, काल या शब्द खोजें..." : "Search temples, relics, structures, or centuries..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] text-white rounded-2xl border border-white/15 focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00] transition-all text-xs font-bold font-mono outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Category Filter */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{language === 'hi' ? 'धरोहर प्रकार' : 'HERITAGE TYPE'}</label>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-[#FF6D00] text-black shadow-md' 
                        : 'bg-[#181818] text-gray-400 border border-white/5 hover:text-white'
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
                className="w-full p-2.5 bg-[#181818] text-gray-300 text-xs rounded-xl border border-white/5 outline-none font-bold focus:border-[#FF6D00]"
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
          <div className="bg-[#121212]/80 border border-white/5 p-4 rounded-2xl text-center shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'कुल संकलित कड़ियां' : 'TOTAL REGISTRY'}</span>
            <span className="text-lg font-black text-[#FFD54F]">355+ {language === 'hi' ? 'धरोहर' : 'Relics'}</span>
          </div>
          <div className="bg-[#121212]/80 border border-white/5 p-4 rounded-2xl text-center shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'भारतीय राज्य' : 'COVERED STATES'}</span>
            <span className="text-lg font-black text-[#FF6D00]">10 {language === 'hi' ? 'मुख्य राज्य' : 'Regions'}</span>
          </div>
          <div className="bg-[#121212]/80 border border-white/5 p-4 rounded-2xl text-center shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">{language === 'hi' ? 'काल निर्धारण' : 'CHRONOLOGY ERA'}</span>
            <span className="text-lg font-black text-amber-500">2500+ {language === 'hi' ? 'वर्ष का इतिहास' : 'Yrs History'}</span>
          </div>
          <div className="bg-[#121212]/80 border border-white/5 p-4 rounded-2xl text-center shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
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
              className="bg-[#121212]/50 hover:bg-[#121212] border border-white/5 hover:border-orange-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-mono font-black text-orange-500 uppercase bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                    {item.category}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-gray-400 flex items-center gap-1">
                    <MapPin size={10} className="text-[#FFD54F]" />
                    {item.state}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white line-clamp-1 mb-1.5">
                  {item.title?.[language] || item.title?.en}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                  {item.desc?.[language] || item.desc?.en}
                </p>
              </div>
              <div className="bg-white/5 px-4 py-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono font-bold text-gray-500">
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-[8px] font-mono font-black text-[#FF6D00] uppercase bg-[#FF6D00]/10 px-2.5 py-1 rounded-full border border-[#FF6D00]/20 inline-block mb-1">
                  {selectedItem.category}
                </span>
                <h2 className="text-xl font-display font-black text-white leading-tight">
                  {selectedItem.title?.[language] || selectedItem.title?.en}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Scroller */}
            <div className="overflow-y-auto pr-1 space-y-4 text-gray-300 text-xs">
              {selectedItem.image && (
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative aspect-video bg-gray-900">
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

              <div className="p-4 bg-[#181818] border border-white/5 rounded-2xl space-y-3 font-semibold">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} className="text-[#FFD54F]" />
                  <span>
                    <strong>{language === 'hi' ? 'स्थान व राज्य:' : 'State & Region:'}</strong> {selectedItem.state || "India (भारत)"}
                  </span>
                </div>
                {selectedItem.era && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe size={14} className="text-[#FFD54F]" />
                    <span>
                      <strong>{language === 'hi' ? 'ऐतिहासिक युग:' : 'Historical Dynasty/Era:'}</strong> {selectedItem.era}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#181818]/50 border border-white/5 rounded-2xl">
                <span className="text-[9px] font-black text-orange-500 uppercase block mb-1.5 tracking-wider">{language === 'hi' ? 'ऐतिहासिक और आध्यात्मिक पुरालेख' : 'HISTORICAL & SPIRITUAL ANALYSIS'}</span>
                <p className="leading-relaxed text-gray-400 font-medium">
                  {selectedItem.desc?.[language] || selectedItem.desc?.en}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)}
              className="w-full mt-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-2xl tracking-wider uppercase transition-colors shrink-s0"
            >
              {language === 'hi' ? 'गैलरी अवलोकन समाप्त करें' : 'Back to Archive'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
