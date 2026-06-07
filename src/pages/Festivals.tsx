import { useState, useEffect, useMemo } from 'react';
import { PartyPopper, Calendar, Sparkles, Clock, Loader2, ArrowLeft, Search, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { festivalsData as FALLBACK_FESTIVALS } from '../data/festivalsData';
import SectionAiAgent from '../components/SectionAiAgent';

// Comprehensive authentic mapping of major & minor Jain festivals for 2026 & 2027
const FESTIVAL_DATE_MAP: Record<string, { [key: string]: string }> = {
  "Mahavir Janma Kalyanak": { "2026": "2026-03-31", "2027": "2027-04-19" },
  "Paryushan Parva / Das Lakshana": { "2026": "2026-09-07", "2027": "2027-08-28" },
  "Akshaya Tritiya": { "2026": "2026-04-20", "2027": "2027-05-09" },
  "Diwali (Nirvana Kalyanak)": { "2026": "2026-11-08", "2027": "2027-10-29" },
  "Shrut Panchami": { "2026": "2026-06-20", "2027": "2027-06-09" },
  "Raksha Bandhan": { "2026": "2026-08-28", "2027": "2027-08-17" },
  "Ashtahnika Parva": { "2026": "2026-07-22", "2027": "2027-07-11" },
  "Kshamavani Parva": { "2026": "2026-09-16", "2027": "2027-09-06" },
  "Veer Shasan Jayanti": { "2026": "2026-08-09", "2027": "2027-07-29" },
  "Lord Adinatha Janma Kalyanak": { "2026": "2026-03-12", "2027": "2027-03-31" },
  "Lord Adinatha Nirvana (Meru Trayodashi)": { "2026": "2026-02-06", "2027": "2027-01-25" },
  "Lord Parshvanath Janma Kalyanak": { "2026": "2026-01-03", "2027": "2027-01-02" },
  "Lord Parshvanath Moksha Kalyanak": { "2026": "2026-08-19", "2027": "2027-08-09" },
  "Lord Mahavira Deeksha Kalyanak": { "2026": "2026-12-04", "2027": "2027-11-24" },
  "Lord Mahavira Kevalgyan Kalyanak": { "2026": "2026-04-26", "2027": "2027-05-15" },
  "Gyan Panchami": { "2026": "2026-11-14", "2027": "2027-11-03" },
  "Moun Ekadashi": { "2026": "2026-12-19", "2027": "2027-12-09" },
  "Lord Neminatha Moksha Kalyanak": { "2026": "2026-07-21", "2027": "2027-07-11" },
  "Lord Neminatha-Rajul Detachment Day": { "2026": "2026-08-19", "2027": "2027-08-09" },
  "Sugandh Dashami": { "2026": "2026-09-21", "2027": "2027-09-10" },
  "Anant Chaturdashi Vrat": { "2026": "2026-09-25", "2027": "2027-09-14" },
  "Siddhachakra Mahavidhan Festival": { "2026": "2026-10-21", "2027": "2027-10-10" },
  "Kartiki Purnima (Girnar Pilgrimage)": { "2026": "2026-11-24", "2027": "2027-11-13" },
  "Phalguni Purnima": { "2026": "2026-03-03", "2027": "2027-03-22" },
  "Lord Shantinatha Janma & Moksha Parva": { "2026": "2026-06-14", "2027": "2027-06-03" },
  "Lord Vasupujya Nirvana Kalyanak": { "2026": "2026-09-25", "2027": "2027-09-14" },
  "Lord Chandraprabha Janma Kalyanak": { "2026": "2026-01-05", "2027": "2027-01-04" },
  "Varshi Tapa Commencement": { "2026": "2026-02-05", "2027": "2027-02-24" },
  "Jain Cosmic New Year": { "2026": "2026-11-09", "2027": "2027-10-30" },
  "Ashadh Nandishwar Ashtahnika": { "2026": "2026-07-22", "2027": "2027-07-11" },
  "Kartik Nandishwar Ashtahnika": { "2026": "2026-11-17", "2027": "2027-11-06" },
  "Phalgun Nandishwar Ashtahnika": { "2026": "2026-03-17", "2027": "2027-03-06" },
  "Samavasarana Composition Celebration": { "2026": "2026-04-28", "2027": "2027-05-17" },
  "Solahkaran Vrat Commencement": { "2026": "2026-08-29", "2027": "2027-08-18" },
  "Solahkaran Vrat Culmination": { "2026": "2026-09-26", "2027": "2027-09-15" },
  "Lord Munisuvratnath Janma Kalyanak": { "2026": "2026-06-09", "2027": "2027-05-29" },
  "Lord Munisuvratnath Moksha Kalyanak": { "2026": "2026-03-15", "2027": "2027-03-04" },
  "Acharya Kundakunda Dev Anniversary": { "2026": "2026-03-23", "2027": "2027-04-11" },
  "Acharya Vidyasagar Deeksha Diwas": { "2026": "2026-07-19", "2027": "2027-07-09" },
  "Bharat-Bahubali Peace Anniversary": { "2026": "2026-10-26", "2027": "2027-10-16" },
  "Sammed Shikharji Pilgrimage Festival": { "2026": "2026-12-25", "2027": "2027-12-14" },
  "Siddha Shila Adoration Day": { "2026": "2026-02-13", "2027": "2027-02-02" },
  "Ratnatraya Vrat Initiation": { "2026": "2026-11-22", "2027": "2027-11-11" },
  "Jinwani Compilation Festival": { "2026": "2026-06-25", "2027": "2027-06-15" },
  "Lord Parshvanatha Deeksha Parva": { "2026": "2026-01-04", "2027": "2027-12-24" },
  "Lord Adinatha Deeksha Parva": { "2026": "2026-03-12", "2027": "2027-03-31" },
  "Panch Parmeshti Aradhana Days": { "2026": "2026-04-19", "2027": "2027-05-08" },
  "Shatrunjaya Mountain Circling": { "2026": "2026-04-02", "2027": "2027-04-21" },
  "Lord Bahubali Nirvana Kalyanak": { "2026": "2026-03-04", "2027": "2027-03-23" },
  "24 Tirthankara Consolidated Salvation Day": { "2026": "2026-12-22", "2027": "2027-12-12" }
};

const ROHINI_DATES_LIST = [
  "2026-01-29", "2026-02-25", "2026-03-24", "2026-04-21", "2026-05-18", "2026-06-22", "2026-07-19", "2026-08-16", "2026-09-12", "2026-10-09", "2026-11-06", "2026-12-03",
  "2027-01-29", "2027-02-25", "2027-03-24", "2027-04-21", "2027-05-18", "2027-06-14", "2027-07-11", "2027-08-08", "2027-09-04", "2027-10-01", "2027-10-28", "2027-11-25", "2027-12-22"
];

const getNextRohiniVratDate = (today: Date): Date => {
  const todayStr = today.toISOString().split('T')[0];
  const upcoming = ROHINI_DATES_LIST.find(d => d >= todayStr);
  return upcoming ? new Date(upcoming + "T00:00:00") : new Date("2027-12-22T00:00:00");
};

const formatFestivalDate = (date: Date, lang: 'en' | 'hi'): string => {
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  
  const day = date.getDate();
  const monthIdx = date.getMonth();
  const year = date.getFullYear();
  
  if (lang === 'hi') {
    return `${day} ${monthsHi[monthIdx]} ${year}`;
  }
  return `${monthsEn[monthIdx]} ${day}, ${year}`;
};

const calculateDaysLeftAndTargetDate = (enName: string, today: Date) => {
  let targetDate: Date;
  
  if (enName === "Rohini Vrat") {
    targetDate = getNextRohiniVratDate(today);
  } else {
    const dates = FESTIVAL_DATE_MAP[enName];
    if (dates) {
      const date2026Str = dates["2026"];
      const date2027Str = dates["2027"];
      
      const parsed2026 = new Date(date2026Str + "T00:00:00");
      const parsed2027 = new Date(date2027Str + "T00:00:00");
      
      const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (parsed2026 >= todayZero) {
        targetDate = parsed2026;
      } else {
        targetDate = parsed2027;
      }
    } else {
      // Fallback
      targetDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }
  }
  
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = targetDate.getTime() - todayZero.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    daysLeft: daysLeft >= 0 ? daysLeft : 0,
    enDateStr: formatFestivalDate(targetDate, 'en'),
    hiDateStr: formatFestivalDate(targetDate, 'hi'),
    targetMonth: targetDate.getMonth(),
    targetYear: targetDate.getFullYear()
  };
};

export default function FestivalsPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [rawFestivals, setRawFestivals] = useState<any[]>(FALLBACK_FESTIVALS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'this_month'>('all');
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'festivals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const preparedSeed = FALLBACK_FESTIVALS.map((seed, idx) => ({ id: `seed_${idx}`, ...seed }));
      
      const merged = [...data];
      preparedSeed.forEach(seed => {
        const isDuplicate = data.some((d: any) => 
          (d.name?.en && d.name.en === seed.name?.en) || 
          (d.name?.hi && d.name.hi === seed.name?.hi)
        );
        if (!isDuplicate) {
          merged.push(seed);
        }
      });

      setRawFestivals(merged);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching festivals:', error);
      const preparedSeed = FALLBACK_FESTIVALS.map((seed, idx) => ({ id: `seed_${idx}`, ...seed }));
      setRawFestivals(preparedSeed);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const festivals = useMemo(() => {
    const today = new Date();
    const mapped = rawFestivals.map(fest => {
      const enName = fest.name?.en || (typeof fest.name === 'string' ? fest.name : '');
      const calc = calculateDaysLeftAndTargetDate(enName, today);
      return {
        ...fest,
        daysLeft: calc.daysLeft,
        calculatedDateStr: {
          en: calc.enDateStr,
          hi: calc.hiDateStr
        },
        targetMonth: calc.targetMonth,
        targetYear: calc.targetYear
      };
    });
    
    // Sort ascending, so the closest upcoming is on the top!
    return mapped.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [rawFestivals]);

  const handleAskAI = (festName: string) => {
    navigate('/chat', { state: { initialPrompt: `Tell me more about the Jain festival of ${festName}. What is its significance and how is it celebrated?` } });
  };

  const upcoming = useMemo(() => {
    if (festivals.length === 0) return null;
    return festivals[0]; // First item is always the mathematically closest upcoming festival
  }, [festivals]);

  const filteredFestivals = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return festivals.filter(fest => {
      const name = (fest.name?.[language] || fest.name || '').toLowerCase();
      const desc = (fest.desc?.[language] || fest.desc || '').toLowerCase();
      const tithi = (fest.tithi || '').toLowerCase();
      const date = (fest.date || '').toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = name.includes(searchLower) || desc.includes(searchLower) || tithi.includes(searchLower) || date.includes(searchLower);
      
      if (!matchesSearch) return false;
       if (filterType === 'this_month') {
        return fest.targetMonth === currentMonth && fest.targetYear === currentYear;
      }
      return true;
    });
  }, [festivals, searchQuery, filterType, language]);

  return (
    <div className="min-h-full p-6 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-905 dark:text-gray-200 relative transition-colors duration-300">
      
      {/* Unified Single Row Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-8 border-b border-gray-200 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4 transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-150 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 text-gray-700 dark:text-gray-300">
            <ArrowLeft size={18} className="sm:w-6 sm:h-6" />
          </button>
          <div className="min-w-0 text-left">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 truncate drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
               <PartyPopper className="text-[#FF6D00] w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 shrink-0" />
              <span className="truncate">{language === 'hi' ? 'जैन पर्व तिथि' : 'FESTIVALS & VRAT'}</span>
            </h1>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 font-mono tracking-wider mt-0.5 uppercase truncate hidden xs:block">
              {language === 'hi' ? '५०+ वार्षिक पर्व तथा व्रत विवरण' : '50+ sacred kalyanaks & vrat details'}
            </p>
          </div>
        </div>

        {/* Right Aligned Controls - Help and Translate in One line */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={language === 'en' ? 'Festivals Section Guide' : 'पर्व अनुभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-8 sm:h-9"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Upcoming Banner */}
      {loading ? (
        <div className="mb-8 bg-white dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center justify-center border border-gray-200 dark:border-white/5 shadow-sm">
          <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
          <p className="font-bold uppercase tracking-widest text-xs text-gray-500">{language === 'hi' ? 'लोड हो रहा है...' : 'Loading Festivals...'}</p>
        </div>
      ) : upcoming ? (
        <div className="mb-8 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/5 dark:from-[#FF6D00]/20 dark:to-[#FFD54F]/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-sm dark:shadow-[0_0_30px_rgba(255,109,0,0.2)] border border-[#FF6D00]/20 dark:border-[#FF6D00]/30 relative overflow-hidden group text-left">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6D00]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/30 transition-all duration-700" />
          
          <div className="flex items-center gap-2 text-[#FFD54F] mb-3 relative z-10">
            <Clock size={16} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">{language === 'hi' ? 'निकटतम पावन पर्व' : 'Nearest Holy Festival'}</span>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 drop-shadow-none dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">{upcoming.name?.[language] || upcoming.name}</h2>
          
          <div className="flex items-end justify-between relative z-10 mt-4">
            <div className="flex flex-col">
              {upcoming.daysLeft === 0 ? (
                <span className="text-2xl font-black text-rose-500 animate-pulse uppercase">
                  {language === 'hi' ? 'आज है!' : 'Today!'}
                </span>
              ) : upcoming.daysLeft === 1 ? (
                <span className="text-2xl font-black text-amber-500 uppercase">
                  {language === 'hi' ? 'कल है!' : 'Tomorrow'}
                </span>
              ) : (
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] font-mono">
                  {upcoming.daysLeft} {language === 'hi' ? 'दिन शेष' : 'Days Left'}
                </span>
              )}
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-mono">
                {language === 'hi' ? `दिनांक: ${upcoming.calculatedDateStr?.hi}` : `Date: ${upcoming.calculatedDateStr?.en}`}
              </span>
            </div>
            <button 
              onClick={() => handleAskAI(upcoming.name?.[language] || upcoming.name)}
              className="px-5 py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-lg cursor-pointer"
            >
              {language === 'hi' ? 'तैयारी एवं पूजन विधान' : 'Prepare details'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/5 p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3 text-gray-450 dark:text-gray-500" size={16} />
          <input 
            type="text"
            placeholder={language === 'hi' ? "पर्व का नाम, तिथि या विवरण खोजें..." : "Search festival, tithi, or month..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-11 pr-4 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-350 cursor-pointer ${
              filterType === 'all' 
                ? 'bg-[#FF6D00] text-black shadow-md' 
                : 'bg-gray-100 dark:bg-[#181818] text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
            }`}
          >
            {language === 'hi' ? 'सभी त्योहार' : 'All'} ({(festivals || []).length})
          </button>
          <button
            onClick={() => setFilterType('this_month')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-350 cursor-pointer ${
              filterType === 'this_month' 
                ? 'bg-[#FF6D00] text-black shadow-md' 
                : 'bg-gray-100 dark:bg-[#181818] text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
            }`}
          >
            {language === 'hi' ? 'इसी माह के पर्व' : 'This Month'}
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-350 cursor-pointer ${
              filterType === 'upcoming' 
                ? 'bg-[#FF6D00] text-black shadow-md' 
                : 'bg-gray-100 dark:bg-[#181818] text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5'
            }`}
          >
            {language === 'hi' ? '९० दिनों के अंदर' : 'Within 90 Days'}
          </button>
        </div>
      </div>

      {/* Festivals List */}
      <div className="space-y-8">
        {!loading && filteredFestivals.length > 0 ? (
          filteredFestivals.map((fest, idx) => (
            <div key={idx} className="bg-white dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 group hover:border-[#FF6D00]/50 hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500 text-left">
              <div className="h-48 relative overflow-hidden">
                <img src={fest.image} alt={fest.name?.[language] || fest.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 opacity-80" referrerPolicy="no-referrer" />
                <div className={`absolute inset-0 bg-gradient-to-t ${fest.color || 'from-orange-400 to-amber-500'} mix-blend-multiply opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent to-transparent opacity-95" />
                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] font-mono font-black tracking-wide text-[#FFD54F] uppercase bg-black/60 px-2.5 py-1 rounded-md mb-1.5 inline-block">
                      TITHI: {fest.tithi || 'N/A'}
                    </span>
                    <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white drop-shadow-none dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">{fest.name?.[language] || fest.name}</h2>
                  </div>
                  {fest.daysLeft !== undefined && (
                    <div className="bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-center min-w-[75px] cursor-default">
                      {fest.daysLeft === 0 ? (
                        <span className="text-xs font-black text-rose-500 block animate-pulse">
                          {language === 'hi' ? 'आज है!' : 'TODAY!'}
                        </span>
                      ) : fest.daysLeft === 1 ? (
                        <span className="text-xs font-black text-amber-500 block">
                          {language === 'hi' ? 'कल है!' : 'TOMORROW'}
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-black text-orange-400 block">{fest.daysLeft}</span>
                          <span className="text-[7px] text-gray-400 block uppercase font-bold">{language === 'hi' ? 'दिन शेष' : 'Days Left'}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#FFD54F] font-bold text-xs mb-4 bg-amber-500/10 border border-amber-500/20 w-fit px-3.5 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                    <Calendar size={14} className="drop-shadow-none" />
                    {fest.calculatedDateStr?.[language] || fest.date}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium font-sans">
                    {fest.desc?.[language] || fest.desc}
                  </p>
                  
                  <button 
                    onClick={() => handleAskAI(fest.name?.[language] || fest.name)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF6D00]/10 to-[#FFD54F]/10 hover:from-[#FF6D00] hover:to-[#FFD54F] text-[#FF8A65] hover:text-black rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-[#FF6D00]/25 hover:border-transparent cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(255,109,0,0.4)] group/btn"
                  >
                    <Sparkles size={18} className="group-hover/btn:animate-pulse" />
                    {language === 'hi' ? `${fest.name?.[language] || fest.name} के बारे में AI से पूछें` : `Ask AI about ${fest.name?.[language] || fest.name}`}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="text-center py-16 bg-white dark:bg-[#121212]/50 border border-gray-200 dark:border-white/5 rounded-3xl text-gray-500 font-bold tracking-wide shadow-inner">
            {language === 'hi' ? 'कोई मेल खाता हुआ कल्याणक/त्योहार नहीं मिला।' : 'No matching festival found in the calendar.'}
          </div>
        )}
      </div>

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5 font-mono">
                  📁 {language === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                  ℹ️ {language === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer border border-gray-200 dark:border-white/5 active:scale-95"
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
                type="button"
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-gray-600 dark:text-gray-300 text-xs leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {language === 'en' ? 'Welcome to Jain Festivals & Kalyanakat Portal!' : 'जैन पर्व, त्योहार व व्रत पटल में स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-500 dark:text-gray-450">
                {language === 'en' 
                  ? 'Stay aligned with major Tirthankar Kalyanaks, Dashlakshan Parv, Astahnika, and monthly fasts with live real-time countdown trackers:' 
                  : 'प्रमुख चौबीस तीर्थंकरों के पंचकल्याणक, दशलक्षण पर्व, अष्टान्हिका तथा महत्वपूर्ण मासिक व्रतों की तिथियों और सांस्कृतिक महत्व को जानें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-650 dark:text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-gray-800 dark:text-[#FFD54F]">{language === 'en' ? 'Dynamic Countdown Trackers:' : 'कल्याणक लाइव काउंटडाउन ट्रैकर:'}</strong>{' '}
                  {language === 'en' 
                    ? 'View precise remaining days left for upcoming fasts or festivals, calculated dynamically corresponding to Lunar calendars.' 
                    : 'आगामी पर्वों और कल्याणकों के लिए शेष बचे दिनों की स्वचालित सटीक गणना तुरंत देखें।'}
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-[#FFD54F]">{language === 'en' ? 'Search and Date Filtering:' : 'पर्व खोज एवं मासिक छँटनी:'}</strong>{' '}
                  {language === 'en'
                    ? 'Search through 50+ sacred parameters, or instantly narrow down to vrat occurring during "this month" or within 90 days.'
                    : '५० से अधिक पवित्र पर्वों की सूची में खोजें अथवा "इस महीने" आने वाले व्रत तथा "आगामी पर्व" का त्वरित फिल्टर लगाएँ।'}
                </li>
                <li>
                  <strong className="text-gray-800 dark:text-[#FFD54F]">{language === 'en' ? 'Spiritual AI Guidance:' : 'पर्वों के धार्मिक व पौराणिक अर्थ की AI व्याख्या:'}</strong>{' '}
                  {language === 'en'
                    ? 'Click on the "Ask AI about Festival" shortcut to launch a guided chat about the historical, botanical, and ascetical code of conduct of the festival.'
                    : 'किसी भी पर्व अथवा तीर्थंकर कल्याणक के नीचे "AI से पूछें" पर क्लिक कर कथा, पूजन विधि और धार्मिक रहस्य जानें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-150 dark:border-white/10 text-center relative z-10">
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

      <SectionAiAgent section="festivals" />
    </div>
  );
}
