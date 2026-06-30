import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Compass, ShieldAlert, Users, Navigation, AlertOctagon,
  Calendar, Phone, Bell, PlusCircle, AlertTriangle, CheckCircle, 
  Globe, ShieldCheck, MapPin, Eye, Activity, FlameKindling
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';
import UnifiedSearchBar from '../components/UnifiedSearchBar';
import { generateSadhus } from '../data/generatedSadhus';

interface Hazard {
  id: string;
  type: string;
  reportedBy: string;
  description: { hi: string; en: string };
  timeReported: string;
}

interface Milestone {
  name: { en: string; hi: string };
  distance: string;
  cleared: boolean;
  haltName: { en: string; hi: string };
}

interface ViharRoute {
  id: string;
  saintName: { en: string; hi: string };
  groupSize: { en: string; hi: string };
  currentRoute: { en: string; hi: string };
  trafficSafety: 'safe' | 'vigilant' | 'critical';
  escortsRegistered: number;
  upcomingHalt: { en: string; hi: string };
  contact: string;
  latLngDistance: string; 
  sanghSect: 'Digambar' | 'Svetambar';
  activeMilestones: Milestone[];
  hazards: Hazard[];
  saintType?: 'acharya' | 'muni' | 'aryika' | 'shraman';
}

const INITIAL_ROUTES: ViharRoute[] = generateSadhus();

export default function ViharTrackerPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<ViharRoute[]>(INITIAL_ROUTES);
  const [showForm, setShowForm] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState(false);

  // Highway Hazard Reporting Panel State
  const [activeHazardId, setActiveHazardId] = useState<string | null>(null);
  const [newHazardType, setNewHazardType] = useState('Heavy Traffic');
  const [newHazardDesc, setNewHazardDesc] = useState('');
  const [reportingName, setReportingName] = useState('');

  // PILOT SYNC SOS FLASHER SYSTEM
  const [showFlasher, setShowFlasher] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Form State for new route
  const [saintHi, setSaintHi] = useState('');
  const [saintEn, setSaintEn] = useState('');
  const [groupHi, setGroupHi] = useState('');
  const [routeHi, setRouteHi] = useState('');
  const [routeEn, setRouteEn] = useState('');
  const [safety, setSafety] = useState<'safe' | 'vigilant' | 'critical'>('safe');
  const [haltHi, setHaltHi] = useState('');
  const [haltEn, setHaltEn] = useState('');
  const [contact, setContact] = useState('');
  const [sect, setSect] = useState<'Digambar' | 'Svetambar'>('Digambar');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'acharya' | 'muni' | 'aryika' | 'Svetambar'>('all');
  const [selectedSafety, setSelectedSafety] = useState<'all' | 'safe' | 'vigilant' | 'critical'>('all');
  const [visibleCount, setVisibleCount] = useState(20);

  // Multi-dimensional Stats Counters for 200+ Sadhus / Matajis
  const totalCounts = routes.length;
  const acharyaCount = routes.filter(r => r.saintType === 'acharya').length;
  const muniCount = routes.filter(r => r.saintType === 'muni').length;
  const aryikaCount = routes.filter(r => r.saintType === 'aryika').length;
  const svetambarCount = routes.filter(r => r.sanghSect === 'Svetambar').length;
  const criticalCount = routes.filter(r => r.trafficSafety === 'critical').length;
  const totalEscorts = routes.reduce((acc, curr) => acc + curr.escortsRegistered, 0);

  // Dynamic filter function
  const filteredRoutes = routes.filter(route => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      route.saintName.hi.includes(searchQuery) ||
      route.saintName.en.toLowerCase().includes(query) ||
      route.currentRoute.hi.includes(searchQuery) ||
      route.currentRoute.en.toLowerCase().includes(query) ||
      route.upcomingHalt.hi.includes(searchQuery) ||
      route.upcomingHalt.en.toLowerCase().includes(query);
      
    const matchesType = 
      selectedType === 'all' ||
      (selectedType === 'acharya' && route.saintType === 'acharya') ||
      (selectedType === 'muni' && route.saintType === 'muni') ||
      (selectedType === 'aryika' && route.saintType === 'aryika') ||
      (selectedType === 'Svetambar' && route.sanghSect === 'Svetambar');
      
    const matchesSafety = 
      selectedSafety === 'all' || route.trafficSafety === selectedSafety;
      
    return matchesSearch && matchesType && matchesSafety;
  });

  // Emergency flashing timer effect
  useEffect(() => {
    let interval: any;
    if (showFlasher) {
      interval = setInterval(() => {
        setFlashOn(prev => !prev);
      }, 180); // ultra rapid safety blink
    }
    return () => clearInterval(interval);
  }, [showFlasher]);

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saintHi || !routeHi || !haltHi || !contact) {
      alert(language === 'en' ? 'Provide critical details: Name, Route, and Halt!' : 'कृपया सभी मुख्य जानकारियां (संत का नाम, मार्ग, आगामी विश्राम) अवश्य दर्ज करें!');
      return;
    }

    const newRoute: ViharRoute = {
      id: String(Date.now()),
      saintName: { en: saintEn || saintHi, hi: saintHi },
      groupSize: { 
        en: groupHi ? `${groupHi} (English)` : 'Walking pilgrims & volunteers', 
        hi: groupHi || 'मुनि संघ सेवादार एवं पदयात्री' 
      },
      currentRoute: { en: routeEn || routeHi, hi: routeHi },
      trafficSafety: safety,
      escortsRegistered: 1,
      upcomingHalt: { en: haltEn || haltHi, hi: haltHi },
      contact: contact,
      latLngDistance: 'Just Reported Live',
      sanghSect: sect,
      activeMilestones: [
        { name: { en: 'Starting Point', hi: 'प्रस्थान बिंदु' }, distance: 'Start', cleared: true, haltName: { en: 'Launch', hi: 'उद्घाटन' } },
        { name: { en: routeEn || routeHi, hi: routeHi }, distance: 'Current', cleared: true, haltName: { en: 'Halt', hi: 'अल्पविश्राम' } },
        { name: { en: haltEn || haltHi, hi: haltHi }, distance: 'Target', cleared: false, haltName: { en: haltHi, hi: haltHi } }
      ],
      hazards: []
    };

    setRoutes([newRoute, ...routes]);
    setShowForm(false);
    // resetting
    setSaintHi('');
    setSaintEn('');
    setGroupHi('');
    setRouteHi('');
    setRouteEn('');
    setHaltHi('');
    setContact('');
    alert(language === 'en' ? '🚀 Active Vihar route dispatched to all surrounding village youth squads!' : '🚀 विहार मार्ग सुरक्षा बुलेटिन सफलतापूर्वक जारी हुआ! आसपास के सभी स्थानीय जैन रक्षा दलों को चेतावनी भेज दी गई है।');
  };

  const incrementEscorts = (id: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, escortsRegistered: r.escortsRegistered + 1 };
      }
      return r;
    }));
    alert(language === 'en' ? '🙋 Wonderful! You are registered as an active escort pilot for this Vihar!' : '🙋 सप्रेम धन्यवाद! आप इस मंगल विहार यात्रा के सुरक्षा चक्र दल में आधिकारिक रूप से जुड़ चुके हैं।');
  };

  const toggleVolunteer = () => {
    setVolunteerStatus(!volunteerStatus);
    if (!volunteerStatus) {
      alert(language === 'en' ? '🟢 Registered! Your device will alarm when a sage crosses within 25km radius.' : '🟢 आप युवा दुर्घटना वाहिनी सुरक्षा नेटवर्क में पंजीकृत हो चुके हैं। क्षेत्र में विहार होने पर आपको लाइव जानकारी प्राप्त होगी।');
    }
  };

  // Add individual hazard point on a route
  const submitHazard = (routeId: string) => {
    if (!newHazardDesc.trim() || !reportingName.trim()) {
      alert(language === 'en' ? 'Please fill out your name and hazard explanation!' : 'कृपया अपना नाम और सड़क खतरे का सटीक विवरण अवश्य दर्ज करें!');
      return;
    }

    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        const added: Hazard = {
          id: String(Date.now()),
          type: newHazardType,
          reportedBy: reportingName,
          description: { hi: newHazardDesc, en: newHazardDesc },
          timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...r,
          hazards: [added, ...r.hazards],
          trafficSafety: 'critical' // push safety level upwards for caution
        };
      }
      return r;
    }));

    setNewHazardDesc('');
    setReportingName('');
    setActiveHazardId(null);
    alert(language === 'en' ? '⚠️ Highway caution updated! Emergency pilot sirens activated.' : '⚠️ राजमार्ग दुर्घटना खतरा अद्यतन हुआ! समीपवर्ती रक्षकों के मोबाइलों पर खतरा सूचक सचेतक भेज दिया गया है।');
  };

  return (
    <div className="min-h-full p-6 pb-26 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      
      {/* Aligned Single Row Header with Translate, Help in One Line */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 -mt-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-6 sm:h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#00E5FF] flex items-center gap-1.5 sm:gap-2 truncate">
              <Compass className="text-[#2962FF] w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 shrink-0" />
              <span className="truncate">{language === 'en' ? 'SADHU VIHAR TRACKER' : 'साधु विहार ट्रैकर'}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-550 font-black dark:text-gray-400 truncate hidden xs:block">
              {language === 'en' ? 'Live Sage Journeys & Escorts' : 'पूज्य दिगंबर/श्वेतांबर विहार रक्षक एवं संतों का लाइव विवरण'}
            </p>
          </div>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/11 text-gray-550 dark:text-gray-350 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={language === 'en' ? 'Vihar Section Guide' : 'विहार ट्रैकर निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-[#2962FF] text-white hover:bg-blue-750 active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[9px] sm:text-[10px] cursor-pointer border border-[#29B6F6]/30 shrink-0 h-8 sm:h-9"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* EMERGENCY PILOT SOS SYNC FLASHING MODULE */}
      <div className="mb-6 p-5 rounded-[2rem] bg-gradient-to-r from-red-600/10 via-amber-500/15 to-red-500/10 border border-red-500/30 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
        
        <div className="space-y-1 md:max-w-xl text-center md:text-left">
          <span className="bg-red-500 text-white font-black uppercase text-[8px] tracking-widest px-2.5 py-0.5 rounded-md animate-pulse inline-block">
            🚨 {language === 'en' ? 'ACTIVE PILOT SOS BEACON' : 'राजमार्ग रक्षक बीकन फ्लैशर'}
          </span>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">
            {language === 'en' ? 'Sync Display Flasher for Highway Guardians' : 'संतों के पीछे चलने वाले सुरक्षा पहरेदारों हेतु आपातकाल बीकन संकेत'}
          </h3>
          <p className="text-[11px] leading-relaxed text-gray-750 dark:text-gray-300">
            {language === 'en' 
              ? 'Click to turn your mobile screen into a high-visibility hazard beacon. Useful when walking directly behind Sadhus & Matajis at dark blind curves or during foggy rain conditions.' 
              : 'इस सुरक्षा मोड को चालू करके अपने मोबाइल स्क्रीन को बहुत तेज चमकीले लाल-नारंगी बीकन फ्लैशर में तब्दील करें। रात और अंधेरे में संतों के पीछे चलते समय यह दूर से ही तेज वाहनों को सतर्क करता है।'}
          </p>
        </div>

        <button
          onClick={() => setShowFlasher(!showFlasher)}
          className={cn(
            "px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all shrink-0 cursor-pointer",
            showFlasher 
              ? "bg-red-600 hover:bg-black text-white px-8" 
              : "bg-amber-500 hover:bg-amber-600 text-black font-extrabold"
          )}
        >
          {showFlasher ? 'STOP BEACON' : 'LAUNCH SOS BEACON'}
        </button>

      </div>

      {/* BEACON INTERACTIVE LIGHTBOX SIMULATOR overlay */}
      {showFlasher && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 relative select-none" style={{ backgroundColor: flashOn ? '#FF1744' : '#121212' }}>
          <div className="text-center space-y-6 max-w-sm">
            <FlameKindling size={64} className="mx-auto text-white animate-bounce" />
            <h2 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">
              ⚠️ HIGHWAY GUARD FLASHING
            </h2>
            <p className="text-xs font-bold text-white leading-relaxed drop-shadow-xs">
              {language === 'en' 
                ? 'Hold this device upright facing oncoming traffic behind the marching saints Sangh!' 
                : 'इस जलते-बुझते चमकदार स्क्रीन को पदविहार कर रहे मुनि संघ के पीछे आते वाहनों की दिशा में ऊंचा थामें!'}
            </p>
            
            <button
              onClick={() => setShowFlasher(false)}
              className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer hover:bg-gray-100"
            >
              STOP SOS FLASH
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE GUARD NETWORK INTEGRATION PANEL */}
      <div className="p-6 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl space-y-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[9px] font-black tracking-widest text-[#2962FF] block uppercase">{language === 'en' ? 'LOCAL EMERGENCY PILOT COMMAND' : 'युवा सुरक्षा वाहिनी सुरक्षा तंत्र'}</span>
            <h3 className="font-extrabold text-sm text-gray-850 dark:text-white mt-0.5">
              {language === 'en' ? 'Enable Automatic GPS Proximity Notifications' : 'समीपवर्ती संत दर्शन एवं आपात स्थिति कम्पन एलर्ट'}
            </h3>
          </div>
          <button
            onClick={toggleVolunteer}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer border transition-all shadow-xs",
              volunteerStatus 
                ? "bg-emerald-500 text-white border-transparent" 
                : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10"
            )}
          >
            {volunteerStatus 
              ? (language === 'en' ? '🟢 Guard Enabled' : '🟢 एस्कॉर्ट गार्ड सक्रिय')
              : (language === 'en' ? '⚪ Join Highway Guards' : '⚪ सुरक्षा दस्ता से जुड़ें')}
          </button>
        </div>
        <p className="text-[11px] text-gray-550 dark:text-gray-400 font-semibold leading-relaxed">
          {language === 'en'
            ? 'When switched ON, you will get SMS and real-time triggers to escort saints in your 20km highway radius with slow pilot vehicles.'
            : 'सक्रिय करने पर, आपके क्षेत्र के २०-३० किमी के हाईवे पर किसी मुनि संघ के पदविहार शुरू होने या अंधेरे में सघन यातायात की स्थिति होने पर सीधे आपके मोबाइल पर कॉल/एसएमएस अलर्ट प्राप्त होगा।'}
        </p>
      </div>

      {/* SAGE/SADHU STATS BENTO GRID - Rich Premium Visual Touch */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">{language === 'en' ? 'Total Active Sadhus' : 'कुल सक्रिय विहार संत'}</span>
          <p className="text-xl md:text-2xl font-black text-[#2962FF]">{totalCounts} {language === 'en' ? 'Sanghs' : 'पूज्य संघ'}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">{language === 'en' ? 'Aryika Mataji Sanghas' : 'आर्यिका माताजी संघ'}</span>
          <p className="text-xl md:text-2xl font-black text-pink-500">{aryikaCount} {language === 'en' ? 'Matajis' : 'आर्यिका माताजी'}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">{language === 'en' ? 'Critical Traffic Zones' : 'अत्यधिक खतरे का मार्ग'}</span>
          <p className="text-xl md:text-2xl font-black text-red-500 animate-pulse">{criticalCount} {language === 'en' ? 'Warnings' : 'अलर्ट मार्ग'}</p>
        </div>

        <div className="p-4 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider block">{language === 'en' ? 'Enrolled Volunteers' : 'विहार रक्षक पहरेदार'}</span>
          <p className="text-xl md:text-2xl font-black text-emerald-500">{totalEscorts} {language === 'en' ? 'Active Guards' : 'सक्रिय रक्षक'}</p>
        </div>
      </div>

      {/* ADVANCED DIALOG SEARCH & FILTER BAR */}
      <div className="p-5 bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-[2rem] space-y-4 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          {/* Quick Search Input */}
          <div className="w-full md:flex-1">
            <UnifiedSearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setVisibleCount(20); // reset page on search
              }}
              placeholder={language === 'en' ? 'Search Saint name, current route, halt location...' : 'संत का नाम, हाईवे मार्ग या गंतव्य धर्मशाला खोजें...'}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto shrink-0">
            {/* Safety status selector */}
            <select
              value={selectedSafety}
              onChange={(e) => {
                setSelectedSafety(e.target.value as any);
                setVisibleCount(20);
              }}
              className="w-full md:w-44 bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-2xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
            >
              <option value="all">🛡️ {language === 'en' ? 'All Safety States' : 'सभी सुरक्षा स्तर'}</option>
              <option value="safe">🟢 {language === 'en' ? 'Safe Routes' : 'सुरक्षित मार्ग (Safe)'}</option>
              <option value="vigilant">🟡 {language === 'en' ? 'Vigilant Zones' : 'सतर्कता क्षेत्र (Vigilant)'}</option>
              <option value="critical">🔴 {language === 'en' ? 'Critical Highway' : 'जोखिमपूर्ण मार्ग (Critical)'}</option>
            </select>
          </div>

        </div>

        {/* Sect and Saint Classification Tab Pills */}
        <div className="flex items-center gap-1.5 flex-wrap border-t border-gray-150/30 dark:border-white/5 pt-3">
          {[
            { id: 'all', label: language === 'en' ? 'All Saints / सभी संघ' : 'सभी संत संघ' },
            { id: 'acharya', label: language === 'en' ? 'Acharyas / आचार्य' : 'आचार्य संघ' },
            { id: 'muni', label: language === 'en' ? 'Muni Sanghs / मुनिराज' : 'मुनिराज संघ' },
            { id: 'aryika', label: language === 'en' ? 'Matajis / माताजी' : 'आर्यिका माताजी' },
            { id: 'Svetambar', label: language === 'en' ? 'Svetambar / श्वेतांबर' : 'श्वेतांबर श्रमण' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedType(tab.id as any);
                setVisibleCount(20);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border",
                selectedType === tab.id
                  ? "bg-[#2962FF] text-white border-transparent shadow-xs"
                  : "bg-gray-100 dark:bg-white/5 text-gray-650 dark:text-gray-350 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions buttons */}
      <div className="mb-6 flex justify-between items-center bg-white dark:bg-[#111] p-4 border border-gray-150/40 dark:border-white/5 rounded-3xl">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-550 dark:text-gray-400">
          👀 {language === 'en' ? `Showing ${Math.min(visibleCount, filteredRoutes.length)} of ${filteredRoutes.length} matching routes` : `प्रदर्शित: ${Math.min(visibleCount, filteredRoutes.length)} / कुल ${filteredRoutes.length} अनुकूल विहार मार्ग`}
        </span>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-[#2962FF] hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-[1.02]"
        >
          <PlusCircle size={14} />
          {language === 'en' ? 'Report New active Vihar' : 'नया विहार मार्ग संकलन अपडेट करें'}
        </button>
      </div>

      {/* Collapsible Vihar entry Form */}
      {showForm && (
        <form onSubmit={handleCreateRoute} className="bg-white dark:bg-[#111] border border-[#2962FF]/20 p-6 rounded-[2rem] mb-8 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-display font-black text-sm text-[#2962FF] uppercase tracking-wider">
            {language === 'en' ? 'INPUT LIVE MARCHING SADHU / MATAJI DETAILS' : 'नवीन पूज्य मुनि विहार मार्ग प्रविष्टि'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Saint/Sangh Name (Hindi) *' : 'पूज्य संत/संघ का नाम (हिंदी) *'}</label>
              <input 
                type="text" 
                required
                placeholder="उदा: पूज्य १०८ मुनि श्री विमद सागर महाराज महाराज" 
                value={saintHi}
                onChange={(e) => setSaintHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Saint Name (English)' : 'पूज्य संत का नाम (English)'}</label>
              <input 
                type="text" 
                placeholder="e.g. Acharya Dev 108 Vardhamansagarji Maharaj" 
                value={saintEn}
                onChange={(e) => setSaintEn(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Sangha Sect Classification' : 'मुनि संघ संप्रदाय मर्यादा *'}</label>
              <select
                value={sect}
                onChange={(e) => setSect(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="Digambar">{language === 'en' ? 'Digambara (परम तपस्वी दिगंबर साधु)' : 'दिगंबर जैन मुनि संघ'}</option>
                <option value="Svetambar">{language === 'en' ? 'Svetambara (श्वेतांबर संयमी श्रमण संघ)' : 'श्वेतांबर जैन श्रमण संघ'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Active highway road *' : 'वर्तमान लाइव हाईवे/सड़क लोकेशन *'}</label>
              <input 
                type="text" 
                required
                placeholder="उदा: जयपुर हाईवे बाईपास रोड़, मील का पत्थर ५२..." 
                value={routeHi}
                onChange={(e) => setRouteHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Upcoming Halt station *' : 'आगामी रात्रि विश्राम धर्मशाला / देवस्थान *'}</label>
              <input 
                type="text" 
                required
                placeholder="उदा: पार्श्वनाथ जिनालय, कोटपुतली..." 
                value={haltHi}
                onChange={(e) => setHaltHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Contact Mobile (Prabhandak/Sevak) *' : 'साथ चल रहे सेवक/विहार सेवक का मोबाइल *'}</label>
              <input 
                type="tel" 
                required
                placeholder="e.g. +91 91700 12345" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Traffic Hazard state' : 'राजमार्ग यातायात जोखिम रेटिंग'}</label>
              <select
                value={safety}
                onChange={(e) => setSafety(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="safe">🟢 {language === 'en' ? 'Safe Route (सुरक्षित चौड़ी सड़क)' : 'सुरक्षित सिंगल लेन / पर्याप्त सुरक्षा गार्ड उपलब्ध'}</option>
                <option value="vigilant">🟡 {language === 'en' ? 'Vigilant / Traffic (मध्यम भारी ट्रैफिक)' : 'भारी कोहरा / सड़क मरम्मत जारी - सावधानी अपेक्षित'}</option>
                <option value="critical">🔴 {language === 'en' ? 'CRITICAL RISK / BLACK SPOT (अत्यधिक जोखिम!' : 'घोर संकरा अंधकारमय हाईवे / पायलट पायलट गाड़ियां त्वरित अपेक्षित!'}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="px-4.5 py-2.5 bg-gray-200 dark:bg-white/5 rounded-xl text-xs font-bold"
            >
              {language === 'en' ? 'Cancel' : 'निरस्त'}
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#2962FF] text-white rounded-xl text-xs font-black uppercase tracking-wider"
            >
              {language === 'en' ? 'Broadcast Live Route' : 'विहार सुरक्षा चेतावनी जारी करें'}
            </button>
          </div>
        </form>
      )}

      {/* MUTI-CARD VIHAR PROGRESSIONS */}
      <div className="space-y-6">
        {filteredRoutes.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111] border border-dashed border-gray-200 dark:border-white/5 rounded-[2rem] space-y-2">
            <p className="text-xl">🔍</p>
            <p className="text-sm font-extrabold text-gray-800 dark:text-white">
              {language === 'en' ? 'No Matching Sadhus / Matajis Found' : 'कोई मेल खाता हुआ ससंघ मार्ग विवरण नहीं मिला'}
            </p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Try adjusting your search filters or text query, or report a new live march to let others know about an active Vihar.'
                : 'कृपया अपनी खोज अथवा फ़िल्टर बदलें, या नया लाइव विहार मार्ग संकलित करके समाज को सूचित करें।'}
            </p>
          </div>
        ) : (
          filteredRoutes.slice(0, visibleCount).map(route => (
          <div 
            key={route.id}
            className="bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-[2rem] p-5 hover:border-[#2962FF]/55 transition-all duration-300 space-y-4"
          >
            {/* Saint classification row */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                  route.sanghSect === 'Digambar' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-emerald-100 dark:bg-emerald-500/10 text-[#00E5FF]'
                )}>
                  {route.sanghSect} Sangh
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase",
                  route.trafficSafety === 'safe' && 'bg-emerald-500/10 text-emerald-500',
                  route.trafficSafety === 'vigilant' && 'bg-amber-500/10 text-amber-500',
                  route.trafficSafety === 'critical' && 'bg-red-500/10 text-red-500 animate-pulse'
                )}>
                  {route.trafficSafety === 'safe' && (language === 'en' ? '🟢 Safe' : '🟢 सुरक्षित मार्ग')}
                  {route.trafficSafety === 'vigilant' && (language === 'en' ? '🟡 Heavy Traffic' : '🟡 भारी ट्रैफिक')}
                  {route.trafficSafety === 'critical' && (language === 'en' ? '🔴 DANGER: NEEDS RAKSHAK PILOT' : '🔴 अत्यंत जोखिमपूर्ण अंधकार जोन')}
                </span>
              </div>
              <span className="text-[10px] text-gray-500 dark:text-gray-450 font-bold">
                👥 {language === 'en' ? route.groupSize.en : route.groupSize.hi}
              </span>
            </div>

            {/* Sangh details */}
            <div>
              <h3 className="text-base md:text-lg font-display font-black text-gray-950 dark:text-white leading-tight">
                {language === 'en' ? route.saintName.en : route.saintName.hi}
              </h3>
            </div>

            {/* LIVE RADAR DURATION PROGRESSION TRAIL STEPS */}
            <div className="p-4 bg-gray-50/70 dark:bg-[#161616]/70 border border-gray-150/30 dark:border-white/5 rounded-2xl">
              <span className="text-[8px] tracking-widest text-[#2962FF] font-black uppercase block mb-3">
                📍 {language === 'en' ? 'HIGHWAY TRACK MILESTONE PROFILES' : 'विहार मार्ग मील-पत्थर क्रमिक अवस्था लाइव'}
              </span>

              {/* Progress Stepper bars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {route.activeMilestones.map((mile, mIdx) => (
                  <div key={mIdx} className="relative space-y-1 pb-1">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-black shrink-0",
                        mile.cleared 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                      )}>
                        {mile.cleared ? '✓' : mIdx + 1}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{mile.distance}</span>
                    </div>
                    <div className="pl-6">
                      <p className="text-xs font-black text-gray-800 dark:text-gray-200 max-w-[120px] truncate leading-snug">
                        {language === 'en' ? mile.name.en : mile.name.hi}
                      </p>
                      <span className="text-[9px] text-[#2962FF] font-semibold block leading-tight">🏢 {language === 'en' ? mile.haltName.en : mile.haltName.hi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HAZARD WARNING BULLETINS (SIMULATION BOARD) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-red-500">
                <span className="flex items-center gap-1">⚠️ {language === 'en' ? 'HIGHWAY HAZARDS RECORD' : 'सड़क दुर्घटना चेतावनी सूचकांक'} ({route.hazards.length})</span>
                <button
                  onClick={() => setActiveHazardId(activeHazardId === route.id ? null : route.id)}
                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg cursor-pointer text-[9px] uppercase tracking-wider"
                >
                  + Report Hazard
                </button>
              </div>

              {/* Form to submit hazard */}
              {activeHazardId === route.id && (
                <div className="p-3 bg-red-650/5 dark:bg-[#1f0d0d] border border-red-500/15 rounded-xl space-y-3 animate-in slide-in-from-top-1">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <select
                      value={newHazardType}
                      onChange={(e) => setNewHazardType(e.target.value)}
                      className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="Heavy Trucks">🏎️ Heavy Trucks / High Speed</option>
                      <option value="Zero Lights">🌑 Zero Street Lights</option>
                      <option value="Fogs / Rains">🌧️ Dense Fog / Blind Curve</option>
                      <option value="Stray Animals">🐄 Stray Animals / Obstruction</option>
                    </select>
                    
                    <input 
                      type="text"
                      placeholder="Your Name (Sadharmik)"
                      value={reportingName}
                      onChange={(e) => setReportingName(e.target.value)}
                      className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-lg p-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g., Heavy sand trucks speeding on single lane Salem exit..."
                      value={newHazardDesc}
                      onChange={(e) => setNewHazardDesc(e.target.value)}
                      className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-lg p-2 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => submitHazard(route.id)}
                      className="px-4.5 bg-red-600 text-white rounded-lg text-xs uppercase font-extrabold"
                    >
                      Alert
                    </button>
                  </div>
                </div>
              )}

              {/* Hazard display scroll */}
              {route.hazards.length > 0 ? (
                <div className="space-y-2">
                  {route.hazards.map((h, hIdx) => (
                    <div key={h.id || hIdx} className="p-2.5 bg-red-500/5 dark:bg-[#1d0d0c] rounded-xl border border-red-500/10 text-xs flex items-start gap-2 text-red-750 dark:text-red-300 font-semibold leading-relaxed">
                      <AlertOctagon size={13} className="shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <strong>[{h.type}]</strong> {language === 'en' ? h.description.en : h.description.hi} 
                        <span className="text-[10px] text-gray-500 block">Reported by {h.reportedBy} at {h.timeReported}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 italic pl-1">
                  🟢 Clear Trail: No active hazards registered in last 3 hours.
                </p>
              )}
            </div>

            {/* Main Action Coordinator Bar */}
            <div className="pt-3.5 border-t border-gray-150/40 dark:border-white/5 flex flex-wrap gap-4 items-center justify-between text-xs font-semibold">
              <div className="text-gray-550 dark:text-gray-400 text-[10px] flex items-center gap-1">
                <Phone size={11} className="text-[#2962FF]" />
                <span>{language === 'en' ? 'Sevak Helpline Office:' : 'विहार सुरक्षा प्रमुख:'} <strong className="font-mono">{route.contact}</strong></span>
              </div>

              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => incrementEscorts(route.id)}
                  className="px-4 py-2 bg-[#2962FF] hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  🙋 {language === 'en' ? 'Escort Volunteer Pilot' : 'रक्षक दस्ते में शामिल हों'} (+{route.escortsRegistered})
                </button>
                
                <a 
                  href={`tel:${route.contact}`}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-black text-[9px] uppercase tracking-widest text-center"
                >
                  📞 {language === 'en' ? 'Helpline Voice' : 'कॉल संपर्क'}
                </a>
              </div>
            </div>

          </div>
        ))
      )}
      </div>

      {/* SAGE LOAD MORE PAGINATION BUTTON */}
      {visibleCount < filteredRoutes.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 25)}
            className="px-8 py-3.5 bg-white dark:bg-[#111] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-sm transition-transform active:scale-95"
          >
            ⏬ {language === 'en' ? 'LOAD MORE SAGE JOURNEYS' : 'अन्य विहार मार्ग प्रविष्ठियां लोड करें'}
          </button>
        </div>
      )}

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10 inline-block mb-1.5">
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
                className="px-3.5 py-1.5 bg-[#2962FF] text-white hover:bg-[#1565C0] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-blue-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-355 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {language === 'en' ? 'Welcome to Sadhu Vihar Safety & Escort Tracker!' : 'साधु विहार सेवा व राजमार्ग रक्षक पटल में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'Coordinate and secure pedestrian Jain saints (Munshree/Aryikaji) traveling bare-feet on high-speed national highways:' 
                  : 'हमारे पूज्य दिगंबर/श्वेतांबर पैदल विहार कर रहे संतों की राष्ट्रीय राजमार्गों पर सुरक्षा, सेवा मंडल, एवं धर्मशाला विश्राम के लिए समन्वय करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Report Live Route Details:' : 'विहार मार्ग सुरक्षा बुलेटिन जारी करें:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Submit new walking route schedules specifying Saint Name, Sangh Size, current location, and scheduled next stop (Halt).' 
                    : 'संत संघ का नाम, मार्ग का नक्शा, तथा आगामी अल्प-विश्राम का नाम भरें। तत्काल आसपास के जैन सुरक्षा वाहिनी को अलर्ट भेज दिया जाता है।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Highway Hazard Flagging:' : 'मार्ग के खतरों (कुत्ता, अंधेरा, डंपर) का अंकन:'}</strong>{' '}
                  {language === 'en'
                    ? 'Report live hazards (fog, high-speed container traffic, dark spots, absolute stray animal zones) to caution surrounding pilgrims.'
                    : 'मार्ग में कोहरा, स्ट्रीट लाइट का अभाव अथवा आवारा पशु बाहुल्यता का अंकन करें। समीपवर्ती सुरक्षाकर्मियों के फोन पर साइरन चला दिया जाएगा।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Register As Escort Pilot:' : 'विहार रक्षक सहयात्री बनें:'}</strong>{' '}
                  {language === 'en'
                    ? 'Tap "Join Escort Crew" to register your local vehicle or body to safeguard and navigate pedestrian saints safely.'
                    : 'साधार्मिक "रक्षक दल जुड़ें" पर क्लिक कर विहार संघ के आगे-पीछे लाल झंडी/रिफ्लेक्टर लेकर मार्ग सुरक्षा पायलट सुरक्षा चक्र में सहयोग कर सकते हैं।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Live Flashing Alarm Sync:' : 'लाइट फ़्लैशर आपातकालीन सिंक्रोनाइजेशन:'}</strong>{' '}
                  {language === 'en'
                    ? 'Use the screen red-beacon flashing system at early mornings (3 AM - 6 AM Vihar hours) using phone screens as high-visibility alerts to warning high-speed trucks.'
                    : 'भोर काल (३ से ६ बजे) में विहार पथ पर सुरक्षा बीकन चालू कर फ़ोन की चमकीली तीव्र लाल बत्ती का उपयोग कर राजमार्ग पर आ रहे ट्रकों को सचेत करें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#2962FF] hover:bg-[#1565C0] text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {language === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <SectionAiAgent section="vihar-tracker" />
      </div>
    </div>
  );
}
