import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, X, Sunrise, Sunset, Clock, Star, BookOpen, Users, Languages, ArrowLeft, Loader2 } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

type PanchangDetails = {
  tithi: string;
  paksha: string;
  festivals: string[];
  kalyanak: string[];
  acharyaDarpan: string[];
  shubhMuhurat: string[];
  vrat: string[];
  sunrise: string;
  sunset: string;
};

export default function PanchangPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [panchangData, setPanchangData] = useState<Record<string, Partial<PanchangDetails>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'panchang'), (snapshot) => {
      const data: Record<string, Partial<PanchangDetails>> = {};
      snapshot.docs.forEach(doc => {
        const docData = doc.data() as Partial<PanchangDetails> & { date?: string };
        if (docData.date) {
          data[docData.date] = docData;
        }
      });
      setPanchangData(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching panchang:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getPanchangDetails = (date: Date): PanchangDetails => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    if (panchangData[dateString]) {
      const special = panchangData[dateString];
      return {
        tithi: special.tithi || 'Pratipada',
        paksha: special.paksha || 'Shukla Paksha',
        festivals: special.festivals || [],
        kalyanak: special.kalyanak || [],
        acharyaDarpan: special.acharyaDarpan || [],
        shubhMuhurat: special.shubhMuhurat || ['08:30 AM - 10:00 AM', '12:15 PM - 02:00 PM'],
        vrat: special.vrat || [],
        sunrise: special.sunrise || '06:15 AM',
        sunset: special.sunset || '06:45 PM',
      };
    }

    // Algorithmic fallback for other dates to populate the calendar
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'];
    const pakshas = ['Shukla Paksha', 'Krishna Paksha'];
    
    const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear();
    const tithiIdx = seed % 15;
    const pakshaIdx = (seed % 30) < 15 ? 0 : 1;
    
    const vrat = [];
    if (tithiIdx === 7 || tithiIdx === 13) vrat.push('Ashtami/Chaturdashi Vrat');

    const acharyaDarpan = [];
    if (seed % 42 === 0) acharyaDarpan.push('Acharya Shri Vidyasagar Ji Maharaj Samadhi Divas');
    if (seed % 55 === 0) acharyaDarpan.push('Acharya Shri Shantisagar Ji Maharaj Janma Divas');

    const kalyanak = [];
    if (seed % 70 === 0) kalyanak.push('Lord Parshvanatha Moksha Kalyanak');

    return {
      tithi: tithis[tithiIdx],
      paksha: pakshas[pakshaIdx],
      festivals: [],
      kalyanak,
      acharyaDarpan,
      shubhMuhurat: ['07:30 AM - 09:00 AM', '01:30 PM - 03:00 PM'],
      vrat,
      sunrise: `06:${10 + (seed % 20)} AM`,
      sunset: `06:${30 + (seed % 20)} PM`,
    };
  };

const translations = {
  en: {
    title: 'JAIN PANCHANG',
    details: 'Jain Panchang Details',
    tithi: 'Tithi',
    paksha: 'Paksha',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    shubhMuhurat: 'Shubh Muhurat',
    festivals: 'Festivals',
    kalyanak: 'Tirthankar Darpan (Kalyanak)',
    acharyaDarpan: 'Acharya Darpan',
    pramukhVrat: 'Pramukh Vrat',
    askAi: 'Ask AI about this day',
    // Tithis
    'Pratipada': 'Pratipada',
    'Dwitiya': 'Dwitiya',
    'Tritiya': 'Tritiya',
    'Chaturthi': 'Chaturthi',
    'Panchami': 'Panchami',
    'Shashthi': 'Shashthi',
    'Saptami': 'Saptami',
    'Ashtami': 'Ashtami',
    'Navami': 'Navami',
    'Dashami': 'Dashami',
    'Ekadashi': 'Ekadashi',
    'Dwadashi': 'Dwadashi',
    'Trayodashi': 'Trayodashi',
    'Chaturdashi': 'Chaturdashi',
    'Purnima/Amavasya': 'Purnima/Amavasya',
    'Amavasya': 'Amavasya',
    // Pakshas
    'Shukla Paksha': 'Shukla Paksha',
    'Krishna Paksha': 'Krishna Paksha',
    // Events
    'Mahavir Janma Kalyanak (Mahavir Jayanti)': 'Mahavir Janma Kalyanak (Mahavir Jayanti)',
    'Lord Mahavira Janma Kalyanak': 'Lord Mahavira Janma Kalyanak',
    'Mahavir Jayanti Vrat': 'Mahavir Jayanti Vrat',
    'Paryushan Parva Begins': 'Paryushan Parva Begins',
    'Paryushan Vrat': 'Paryushan Vrat',
    'Anant Chaturdashi': 'Anant Chaturdashi',
    'Anant Chaturdashi Vrat': 'Anant Chaturdashi Vrat',
    'Deepawali (Nirvana Kalyanak of Lord Mahavira)': 'Deepawali (Nirvana Kalyanak of Lord Mahavira)',
    'Lord Mahavira Moksha Kalyanak': 'Lord Mahavira Moksha Kalyanak',
    'Diwali Vrat': 'Diwali Vrat',
    'Ashtami/Chaturdashi Vrat': 'Ashtami/Chaturdashi Vrat',
    'Acharya Shri Vidyasagar Ji Maharaj Samadhi Divas': 'Acharya Shri Vidyasagar Ji Maharaj Samadhi Divas',
    'Acharya Shri Shantisagar Ji Maharaj Janma Divas': 'Acharya Shri Shantisagar Ji Maharaj Janma Divas',
    'Lord Parshvanatha Moksha Kalyanak': 'Lord Parshvanatha Moksha Kalyanak',
  },
  hi: {
    title: 'जैन पंचांग',
    details: 'जैन पंचांग विवरण',
    tithi: 'तिथि',
    paksha: 'पक्ष',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    shubhMuhurat: 'शुभ मुहूर्त',
    festivals: 'त्यौहार',
    kalyanak: 'तीर्थंकर दर्पण (कल्याणक)',
    acharyaDarpan: 'आचार्य दर्पण',
    pramukhVrat: 'प्रमुख व्रत',
    askAi: 'एआई से इस दिन के बारे में पूछें',
    // Tithis
    'Pratipada': 'प्रतिपदा',
    'Dwitiya': 'द्वितीया',
    'Tritiya': 'तृतीया',
    'Chaturthi': 'चतुर्थी',
    'Panchami': 'पंचमी',
    'Shashthi': 'षष्ठी',
    'Saptami': 'सप्तमी',
    'Ashtami': 'अष्टमी',
    'Navami': 'नवमी',
    'Dashami': 'दशमी',
    'Ekadashi': 'एकादशी',
    'Dwadashi': 'द्वादशी',
    'Trayodashi': 'त्रयोदशी',
    'Chaturdashi': 'चतुर्दशी',
    'Purnima/Amavasya': 'पूर्णिमा/अमावस्या',
    'Amavasya': 'अमावस्या',
    // Pakshas
    'Shukla Paksha': 'शुक्ल पक्ष',
    'Krishna Paksha': 'कृष्ण पक्ष',
    // Events
    'Mahavir Janma Kalyanak (Mahavir Jayanti)': 'महावीर जन्म कल्याणक (महावीर जयंती)',
    'Lord Mahavira Janma Kalyanak': 'भगवान महावीर जन्म कल्याणक',
    'Mahavir Jayanti Vrat': 'महावीर जयंती व्रत',
    'Paryushan Parva Begins': 'पर्युषण पर्व प्रारंभ',
    'Paryushan Vrat': 'पर्युषण व्रत',
    'Anant Chaturdashi': 'अनंत चतुर्दशी',
    'Anant Chaturdashi Vrat': 'अनंत चतुर्दशी व्रत',
    'Deepawali (Nirvana Kalyanak of Lord Mahavira)': 'दीपावली (भगवान महावीर का निर्वाण कल्याणक)',
    'Lord Mahavira Moksha Kalyanak': 'भगवान महावीर मोक्ष कल्याणक',
    'Diwali Vrat': 'दिवाली व्रत',
    'Ashtami/Chaturdashi Vrat': 'अष्टमी/चतुर्दशी व्रत',
    'Acharya Shri Vidyasagar Ji Maharaj Samadhi Divas': 'आचार्य श्री विद्यासागर जी महाराज समाधि दिवस',
    'Acharya Shri Shantisagar Ji Maharaj Janma Divas': 'आचार्य श्री शांतिसागर जी महाराज जन्म दिवस',
    'Lord Parshvanatha Moksha Kalyanak': 'भगवान पार्श्वनाथ मोक्ष कल्याणक',
  }
};


  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "MMMM yyyy";

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  const handleAskAI = (date: Date, details: PanchangDetails) => {
    const prompt = `Tell me about the significance of ${details.tithi} in ${details.paksha} in Jainism. Are there any specific rituals or observances for this day?`;
    navigate('/chat', { state: { initialPrompt: prompt } });
  };

  if (loading) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">Loading Panchang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-300" />
          </button>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <CalendarIcon className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
            {translations[language as keyof typeof translations]?.title || translations.en.title}
          </h1>
        </div>
      </header>

      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_0_30px_rgba(255,109,0,0.1)] border border-white/10 p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF6D00]/10 to-transparent opacity-50 pointer-events-none" />
        
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 bg-white/5 hover:bg-[#FF6D00]/20 rounded-2xl text-[#FF8A65] hover:text-white border border-white/10 hover:border-[#FF6D00]/50 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,109,0,0.4)]">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-display font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {format(currentDate, dateFormat)}
          </h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 bg-white/5 hover:bg-[#FF6D00]/20 rounded-2xl text-[#FF8A65] hover:text-white border border-white/10 hover:border-[#FF6D00]/50 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,109,0,0.4)]">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4 relative z-10">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 relative z-10">
          {paddingDays.map((_, idx) => (
            <div key={`pad-${idx}`} className="h-12 rounded-xl bg-transparent" />
          ))}
          
          {days.map((day, idx) => {
            const details = getPanchangDetails(day);
            const hasEvents = details.festivals.length > 0 || details.kalyanak.length > 0 || details.acharyaDarpan.length > 0 || details.vrat.length > 0;
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "relative h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border",
                  isToday 
                    ? "bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] text-black shadow-[0_0_15px_rgba(255,109,0,0.6)] border-transparent scale-110 z-10 font-black" 
                    : "bg-[#1A1A1A] text-gray-300 border-white/5 hover:bg-white/10 hover:border-[#FF6D00]/30 hover:text-white font-bold"
                )}
              >
                <span className={cn("text-sm", isToday ? "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" : "")}>
                  {format(day, 'd')}
                </span>
                {hasEvents && (
                  <span className={cn(
                    "absolute bottom-1.5 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]",
                    isToday ? "bg-black" : "bg-[#F50057]"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(255,109,0,0.2)] border border-white/10 animate-in zoom-in-95 duration-300 relative max-h-[90vh] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF6D00]/5 to-transparent pointer-events-none" />
            
            <div className="bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] p-6 text-black relative shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start relative z-20">
                <div>
                  <h3 className="text-3xl font-display font-black mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {format(selectedDate, 'dd MMMM yyyy')}
                  </h3>
                  <p className="text-black/70 font-bold tracking-widest text-[10px] uppercase">
                    {translations[language as keyof typeof translations]?.details || translations.en.details}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button 
                    onClick={toggleLanguage}
                    className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-sm flex items-center justify-center"
                    title="Translate"
                  >
                    <Languages size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 relative z-10">
              {(() => {
                const details = getPanchangDetails(selectedDate);
                const t = translations[language as keyof typeof translations] || translations.en;
                
                const translateText = (text: string) => (t as any)[text] || text;

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-[#FF8A65] font-bold uppercase tracking-widest mb-1.5">{t.tithi}</p>
                        <p className="text-white font-bold text-lg">{translateText(details.tithi)}</p>
                      </div>
                      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-[#FF8A65] font-bold uppercase tracking-widest mb-1.5">{t.paksha}</p>
                        <p className="text-white font-bold text-lg">{translateText(details.paksha)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner flex items-center gap-3">
                        <Sunrise className="text-[#FFD54F]" size={24} />
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.sunrise}</p>
                          <p className="text-white font-bold">{details.sunrise}</p>
                        </div>
                      </div>
                      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner flex items-center gap-3">
                        <Sunset className="text-[#FF8A65]" size={24} />
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.sunset}</p>
                          <p className="text-white font-bold">{details.sunset}</p>
                        </div>
                      </div>
                    </div>

                    {details.shubhMuhurat.length > 0 && (
                      <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-[#FF8A65] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Clock size={14} /> {t.shubhMuhurat}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {details.shubhMuhurat.map((muhurat, i) => (
                            <span key={i} className="text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                              {muhurat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {details.festivals.length > 0 && (
                      <div className="bg-[#FF6D00]/10 p-4 rounded-2xl border border-[#FF6D00]/20 shadow-[0_0_15px_rgba(255,109,0,0.1)]">
                        <p className="text-[10px] text-[#FFD54F] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Sparkles size={14} /> {t.festivals}
                        </p>
                        <ul className="space-y-1.5">
                          {details.festivals.map((event, i) => (
                            <li key={i} className="text-white font-bold text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD54F] mt-1.5 shrink-0" />
                              {translateText(event)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.kalyanak.length > 0 && (
                      <div className="bg-[#2962FF]/10 p-4 rounded-2xl border border-[#2962FF]/20 shadow-[0_0_15px_rgba(41,98,255,0.1)]">
                        <p className="text-[10px] text-[#82B1FF] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Star size={14} /> {t.kalyanak}
                        </p>
                        <ul className="space-y-1.5">
                          {details.kalyanak.map((event, i) => (
                            <li key={i} className="text-white font-bold text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#82B1FF] mt-1.5 shrink-0" />
                              {translateText(event)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.acharyaDarpan.length > 0 && (
                      <div className="bg-[#00E676]/10 p-4 rounded-2xl border border-[#00E676]/20 shadow-[0_0_15px_rgba(0,230,118,0.1)]">
                        <p className="text-[10px] text-[#69F0AE] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Users size={14} /> {t.acharyaDarpan}
                        </p>
                        <ul className="space-y-1.5">
                          {details.acharyaDarpan.map((event, i) => (
                            <li key={i} className="text-white font-bold text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#69F0AE] mt-1.5 shrink-0" />
                              {translateText(event)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.vrat.length > 0 && (
                      <div className="bg-[#F50057]/10 p-4 rounded-2xl border border-[#F50057]/20 shadow-[0_0_15px_rgba(245,0,87,0.1)]">
                        <p className="text-[10px] text-[#FF80AB] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <BookOpen size={14} /> {t.pramukhVrat}
                        </p>
                        <ul className="space-y-1.5">
                          {details.vrat.map((event, i) => (
                            <li key={i} className="text-white font-bold text-sm flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F50057] mt-1.5 shrink-0" />
                              {translateText(event)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      onClick={() => handleAskAI(selectedDate, details)}
                      className="w-full mt-4 py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black tracking-wide shadow-[0_0_20px_rgba(255,109,0,0.4)] hover:shadow-[0_0_30px_rgba(255,109,0,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 uppercase text-sm"
                    >
                      <Sparkles size={20} className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />
                      {t.askAi}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
