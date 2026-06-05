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
}

const INITIAL_ROUTES: ViharRoute[] = [
  {
    id: 'vr-1',
    saintName: { en: "108 Pujya Muni Shri Prasanna Sagar Ji Maharaj Sangh", hi: "१०८ पूज्य मुनि श्री प्रसन्न सागर जी महाराज संघ" },
    groupSize: { en: "Muni Shri + 3 walking escorts", hi: "मुनिश्री + ३ स्थानीय सेवादार पदयात्री" },
    currentRoute: { en: "NH-44 Salem Bypass to Krishnagiri Highway", hi: "एनएच-४४ सलेम बाईपास से कृष्णगिरि हाईवे, तमिल नाडु" },
    trafficSafety: 'vigilant',
    escortsRegistered: 18,
    upcomingHalt: { en: "Krishnagiri Digambar Jain Temple Dharamshala", hi: "कृष्णगिरि दिगंबर जैन चैत्यालय धर्मशाला" },
    contact: "+91 94440 22391",
    latLngDistance: "Within 10 km from your area",
    sanghSect: 'Digambar',
    activeMilestones: [
      { name: { en: 'Salem Bypass', hi: 'सलेम बाईपास प्रस्थान' }, distance: 'Start', cleared: true, haltName: { en: 'Chouka base', hi: 'प्रारंभिक चौका' } },
      { name: { en: 'Toll plaza NH-44', hi: 'टोल प्लाजा एनएच-४४' }, distance: '12 km', cleared: true, haltName: { en: 'Dharamshala halt', hi: 'धर्मशाला अल्पविश्राम' } },
      { name: { en: 'Dharmapuri Border', hi: 'धर्मपुरी जिला सीमा' }, distance: '28 km', cleared: false, haltName: { en: 'Aravind temple', hi: 'अरविन्द जैन मंदिर' } },
      { name: { en: 'Krishnagiri Vault', hi: 'कृष्णगिरि गंतव्य' }, distance: '45 km', cleared: false, haltName: { en: 'Digambar Temple', hi: 'दिगंबर चैत्यालय' } }
    ],
    hazards: [
      { id: 'h1', type: 'Fog', reportedBy: 'राजेश जैन', description: { hi: 'सुबह छाए घने कोहरे के कारण दृश्यता कम है।', en: 'Damp heavy morning fog reducing highway visibility.' }, timeReported: '06:00 AM' }
    ]
  },
  {
    id: 'vr-2',
    saintName: { en: "Aryika Shri 105 Vishuddha Mati Mataji Sangha (11 Aryikas)", hi: "आर्यिका १०५ विशुद्ध मति माताजी संघ (११ आर्यिका माताएं)" },
    groupSize: { en: "11 Mothers + 6 Shravaks on foot", hi: "११ संयमी आर्यिका माताएं + ६ सह-यात्री श्रावक" },
    currentRoute: { en: "State Highway 12, Mandar Hill to Deoghar Boundary", hi: "स्टेट हाईवे १२, मंदारगिरि से देवघर सीमा, झारखंड" },
    trafficSafety: 'safe',
    escortsRegistered: 34,
    upcomingHalt: { en: "Deoghar Digambar Jain Bhavan", hi: "देवघर दिगंबर जैन धर्मशाला" },
    contact: "+91 91700 88200",
    latLngDistance: "Within 45 km from your area",
    sanghSect: 'Digambar',
    activeMilestones: [
      { name: { en: 'Mandar Foothill', hi: 'मंदार गिरी तलहटी' }, distance: 'Start', cleared: true, haltName: { en: 'Temple base', hi: 'मंदिर परिसर' } },
      { name: { en: 'Dumka Border Road', hi: 'दुमका बॉर्डर मोड़' }, distance: '15 km', cleared: true, haltName: { en: 'Rural school', hi: 'प्राथमिक विद्यालय अल्पविश्राम' } },
      { name: { en: 'Deoghar Boundary', hi: 'देवघर पावन चौक सीमा' }, distance: '32 km', cleared: false, haltName: { en: 'Digambar Bhavan', hi: 'देवघर दिगंबर भवन' } }
    ],
    hazards: []
  },
  {
    id: 'vr-3',
    saintName: { en: "Acharya Shri 108 Vardhaman Sagar Ji Maharaj Assembly", hi: "आचार्य १०८ वर्धमान सागर जी महाराज संघ" },
    groupSize: { en: "Acharya Dev + 9 Digambar Monks", hi: "आचार्यश्री + ९ परम दिगंबर महामुनिराज" },
    currentRoute: { en: "NH-21 Agra-Jaipur Highway, Bharatpur Link Toll", hi: "एनएच-२१ आगरा-जयपुर हाईवे, भरतपुर बाईपास" },
    trafficSafety: 'critical',
    escortsRegistered: 7,
    upcomingHalt: { en: "Bharatpur Shravaka Niwas", hi: "भरतपुर जैन श्रावक निवास धर्मशाला" },
    contact: "+91 98290 11400",
    latLngDistance: "Within 3 km (Immediate Warning!)",
    sanghSect: 'Digambar',
    activeMilestones: [
      { name: { en: 'Agra Exit', hi: 'आगरा बाईपास निकास' }, distance: 'Start', cleared: true, haltName: { en: 'Ahar base', hi: 'आहारशाला क्षेत्र' } },
      { name: { en: 'Fatehpur Sikri cut', hi: 'फ़तेहपुर सीकरी कट' }, distance: '22 km', cleared: true, haltName: { en: 'Sikri kothi', hi: 'सीकरी कोठी धर्मशाला' } },
      { name: { en: 'Bharatpur Bypass Toll', hi: 'भरतपुर टोल नाका' }, distance: '40 km', cleared: false, haltName: { en: 'Highway temple', hi: 'हाईवे जैन जिनालय' } },
      { name: { en: 'Bharatpur Town', hi: 'भरतपुर जैन श्रावक निवास' }, distance: '48 km', cleared: false, haltName: { en: 'Shravak Bhavan', hi: 'श्रावक भवन' } }
    ],
    hazards: [
      { id: 'h2', type: 'Trucks', reportedBy: 'विपिन दोषी', description: { hi: 'भारी डंपर और कंटेनर गाड़ियों की तेज रफ़्तार।', en: 'High-speed heavy container trailers on narrow lanes.' }, timeReported: '05:30 AM' },
      { id: 'h3', type: 'Darkness', reportedBy: 'नीरज जैन', description: { hi: 'हाईवे पर स्ट्रीट लाइटें बंद हैं, घना अंधेरा है।', en: 'Street lights are completely broken, absolute dark spot.' }, timeReported: '05:45 AM' }
    ]
  }
];

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
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      
      {/* FIXED TOP RIGHT TRANSLATOR WIDGET */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 px-4.5 py-2.5 bg-[#2962FF] text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg rounded-full flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#29B6F6]/30"
        title="Translate Language / भाषा बदलें"
      >
        <Globe size={15} className="animate-spin-slow" />
        <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
      </button>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 -mt-6 px-6 pt-6 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#00E5FF] flex items-center gap-2">
              <Compass className="text-[#2962FF] shrink-0 animate-spin-slow" size={26} />
              {language === 'en' ? 'MONK VIHAR SAFETY' : 'मुनि विहार सेवा व सुरक्षा ट्रैकर'}
            </h1>
            <p className="text-[10px] text-gray-550 font-black dark:text-gray-400">
              {language === 'en' ? 'Live Highway Route Coordinator & Volunteer Pilot Network' : 'पैदल विहार कर रहे हमारे संतों की सुरक्षा और धर्मशाला समन्वय लाइव'}
            </p>
          </div>
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
              ? 'Click to turn your mobile screen into a high-visibility hazard beacon. Useful when walking directly behind monks at dark blind curves or during foggy rain conditions.' 
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

      {/* Control Actions buttons */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3.5 bg-[#2962FF] hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.02]"
        >
          <PlusCircle size={16} />
          {language === 'en' ? 'Report New active Vihar' : 'नया विहार मार्ग संकलन अपडेट करें'}
        </button>
      </div>

      {/* Collapsible Vihar entry Form */}
      {showForm && (
        <form onSubmit={handleCreateRoute} className="bg-white dark:bg-[#111] border border-[#2962FF]/20 p-6 rounded-[2rem] mb-8 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-display font-black text-sm text-[#2962FF] uppercase tracking-wider">
            {language === 'en' ? 'INPUT LIVE MARICHING MONK DETAILS' : 'नवीन पूज्य मुनि विहार मार्ग प्रविष्टि'}
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
        {routes.map(route => (
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
        ))}
      </div>

      <div className="mt-8">
        <SectionAiAgent section="vihar-tracker" />
      </div>
    </div>
  );
}
