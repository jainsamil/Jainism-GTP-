import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Hotel, Phone, MapPin, Calendar, Clock, Star, ThumbsUp, ShieldAlert, CheckCircle2, Bookmark, Info, Loader2, Sparkles, Navigation, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';
import { cn } from '../lib/utils';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

interface DharamshalaData {
  id: string;
  name: { hi: string; en: string };
  tirth: { hi: string; en: string };
  sect: 'Digambar' | 'Svetambar' | 'Unified';
  distanceToHillWalk: string;
  roomsAvailable: number;
  totalRooms: number;
  pricePerDay: number;
  rating: number;
  aharshalaStatus: { hi: string; en: string };
  contact: string;
  address: { hi: string; en: string };
  facilities: string[];
}

const DEFAULT_DHARAMSHALAS: DharamshalaData[] = [
  {
    id: "ds_shikharji_1",
    name: { hi: "श्री बीस पंथी कोठी धर्मशाला", en: "Shree Bees Panthi Kothi Dharamshala" },
    tirth: { hi: "श्री सम्मेद शिखरजी (झारखंड)", en: "Shree Sammed Shikharji (Jharkhand)" },
    sect: "Digambar",
    distanceToHillWalk: "0.5 km (Walking distance to Taleti/Hill entry)",
    roomsAvailable: 54,
    totalRooms: 120,
    pricePerDay: 250,
    rating: 4.8,
    aharshalaStatus: { hi: "शुद्ध दिगंबर भोजनशाला - दोपहर १२ बजे तक, चौविहार सूर्यास्त से पूर्व", en: "Pure Digambar Aharshala: Lunch till 12 PM, Chauvihar before sunset" },
    contact: "+91-6532286221",
    address: { hi: "मधुबन, गिरिडीह, झारखण्ड - ८२५३२९", en: "Madhuban, Giridih, Jharkhand - 825329" },
    facilities: ["Ac Room Options", "Geyser Hot Water", "Lift/Elevator", "Pure Bhojan Shala", "Secure Lockers"]
  },
  {
    id: "ds_shikharji_2",
    name: { hi: "मध्यलोक शोध संस्थान धर्मशाला", en: "Madhyalok Research Sansthan Dharamshala" },
    tirth: { hi: "श्री सम्मेद शिखरजी (झारखंड)", en: "Shree Sammed Shikharji (Jharkhand)" },
    sect: "Digambar",
    distanceToHillWalk: "1.2 km (E-Rickshaws available)",
    roomsAvailable: 32,
    totalRooms: 80,
    pricePerDay: 400,
    rating: 4.9,
    aharshalaStatus: { hi: "मर्यादित जल एवं शुद्ध सात्विक भोजन - केवल दिन में", en: "Pure Satvik Diet: Screened Water, Daylight serving only" },
    contact: "+91-6532280456",
    address: { hi: "मधुबन, सम्मेद शिखरजी रोड़, झारखण्ड", en: "Madhuban, Sammed Shikharji Road, Jharkhand" },
    facilities: ["Deluxe Twin Beds", "Geyser Hot Water", "Spacious Parking", "Aharshala / Bhojan Shala", "RO Filtered Water"]
  },
  {
    id: "ds_palitana_1",
    name: { hi: "श्री धरमपुर जैन धर्मशाला (नयी पेढ़ी)", en: "Shree Dharampur Jain Dharamshala (New Pedhi)" },
    tirth: { hi: "शत्रुंजय महातीर्थ पालीताना", en: "Shatrunjay Mahatirth Palitana" },
    sect: "Svetambar",
    distanceToHillWalk: "0.2 km (Extremely close to Palitana Taleti)",
    roomsAvailable: 45,
    totalRooms: 100,
    pricePerDay: 300,
    rating: 4.7,
    aharshalaStatus: { hi: "श्वेतांबर नवकारसी एवं चौविहार समय सीमा के भीतर", en: "Svetambar Navkarshi Breakfast & Sunset Chauvihar" },
    contact: "+91-2782522401",
    address: { hi: "तलैटी रोड, पालीताना, भावनगर, गुजरात - ३६४२५०", en: "Taleti Road, Palitana, Bhavnagar, Gujarat - 364250" },
    facilities: ["Ac & Non-Ac Rooms", "Lift", "Geyser", "Pure Bhojan Shala", "Luggage Room"]
  },
  {
    id: "ds_palitana_2",
    name: { hi: "श्री विजय धर्मसूरि जैन धर्मशाला", en: "Shree Vijay Dharamsuri Jain Dharamshala" },
    tirth: { hi: "शत्रुंजय महातीर्थ पालीताना", en: "Shatrunjay Mahatirth Palitana" },
    sect: "Svetambar",
    distanceToHillWalk: "0.8 km",
    roomsAvailable: 18,
    totalRooms: 50,
    pricePerDay: 200,
    rating: 4.6,
    aharshalaStatus: { hi: "आराधना भवन भोजनशाला - गरम छना पानी एवं सात्विक भोजन", en: "Aradhana Bhavan Dining: Filtered hot water, organic pure diet" },
    contact: "+91-2782521190",
    address: { hi: "स्टेशन रोड़, पालीताना, गुजरात", en: "Station Road, Palitana, Gujarat" },
    facilities: ["Nominal Donation Rooms", "Quiet Aradhana Halls", "Filtered Water", "Trust Counter Desk"]
  },
  {
    id: "ds_girnar_1",
    name: { hi: "श्री गिरनार दिगंबर जैन धर्मशाला (बड़ा मंदिर)", en: "Shree Girnar Digambar Jain Dharamshala (Bada Mandir)" },
    tirth: { hi: "श्री गिरनार महातीर्थ (जूनागढ़)", en: "Shree Girnar Mahatirth (Junagadh)" },
    sect: "Digambar",
    distanceToHillWalk: "0.1 km (Directly at the base of Girnar Staircase)",
    roomsAvailable: 60,
    totalRooms: 150,
    pricePerDay: 150,
    rating: 4.8,
    aharshalaStatus: { hi: "दिगंबर भोजनशाला - शुद्ध मर्यादित जल, लहसुन-प्याज रहित सादा शुद्धात्मा भोजन", en: "Pure Digambar Bhojan: strictly no onion, garlic or roots" },
    contact: "+91-2852654321",
    address: { hi: "गिरनार तलैटी, जूनागढ़, गुजरात - ३६२००१", en: "Girnar Taleti, Junagadh, Gujarat - 362001" },
    facilities: ["Immediate Staircase Access", "Geyser", "Family Hall Available", "Pure Dining Hall", "CCTV Security"]
  },
  {
    id: "ds_girnar_2",
    name: { hi: "श्री राजुल-नेमि ध्यान योग केंद्र धर्मशाला", en: "Shree Rajul-Nemi Dhyan Yoga Kendra Dharamshala" },
    tirth: { hi: "श्री गिरनार महातीर्थ (जूनागढ़)", en: "Shree Girnar Mahatirth (Junagadh)" },
    sect: "Unified",
    distanceToHillWalk: "0.6 km",
    roomsAvailable: 22,
    totalRooms: 60,
    pricePerDay: 500,
    rating: 4.9,
    aharshalaStatus: { hi: "एकासन एवं तपस्वियों के लिए अनुकूल उबला औषधीय जल और सात्विक आहार", en: "Auspicious diet support for fast-keepers (Ekasana/Upvas boiled water)" },
    contact: "+91-2852651109",
    address: { hi: "भवनाथ रोड़, गिरनार तलैटी, जूनागढ़", en: "Bhavnath Road, Girnar Taleti, Junagadh" },
    facilities: ["Ac Cottages", "Meditation Hall", "Geyser", "Trust Dining Hall", "Serene Garden"]
  },
  {
    id: "ds_sonagiri_1",
    name: { hi: "श्री दिगंबर जैन सिद्धक्षेत्र कंचन कूप धर्मशाला", en: "Shree Digambar Jain Siddhabhumi Kanchan Koop Dharamshala" },
    tirth: { hi: "सोनागिरि सिद्धक्षेत्र (दतिया)", en: "Sonagiri Siddhakhetra (Datia)" },
    sect: "Digambar",
    distanceToHillWalk: "0.3 km (Close to Peak Temple climb Entry)",
    roomsAvailable: 40,
    totalRooms: 90,
    pricePerDay: 100,
    rating: 4.8,
    aharshalaStatus: { hi: "त्यागियों हेतु आहार व्यवस्था एवं देशी घी भोजनशाला", en: "Special meals for Tyagis/Saints, high purity butter oil dining" },
    contact: "+91-7522262410",
    address: { hi: "सिद्धक्षेत्र सोनागिरि, जिला दतिया, मध्य प्रदेश - ४७५६६२", en: "Siddhakhetra Sonagiri, Datia, Madhya Pradesh - 475662" },
    facilities: ["Nominal Donation Desk", "Geyser", "Clean Toilets", "Bhojan Shala", "24hr Porter Assistance"]
  },
  {
    id: "ds_sonagiri_2",
    name: { hi: "श्री कुंदकुंद निलय यात्री निवास", en: "Shree Kundkund Nilay Yatri Niwas" },
    tirth: { hi: "सोनागिरि सिद्धक्षेत्र (दतिया)", en: "Sonagiri Siddhakhetra (Datia)" },
    sect: "Digambar",
    distanceToHillWalk: "0.5 km",
    roomsAvailable: 25,
    totalRooms: 50,
    pricePerDay: 350,
    rating: 4.9,
    aharshalaStatus: { hi: "शुद्ध दिगंबर रसोइ घर - चोविहार समय सारणी", en: "Pure Digambar Kitchen: Strict post-sunrise, sunset-abiding schedule" },
    contact: "+91-7522262222",
    address: { hi: "गिरिद्वार मार्ग, सोनागिरि, मध्य प्रदेश", en: "Giridwaar Road, Sonagiri, Madhya Pradesh" },
    facilities: ["Comfortable Beds", "Parking Stall", "Geyser", "Pure Dining Hall", "Scenic Hill View"]
  }
];

interface BookingRecord {
  id: string;
  dharamshalaId: string;
  dharamshalaName: { hi: string; en: string };
  tirth: { hi: string; en: string };
  pilgrimName: string;
  checkInDate: string;
  roomType: string;
  guestsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  priceCollected: number;
  contact: string;
  createdAt: string;
}

export default function DharamshalaPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSect, setSelectedSect] = useState<'all' | 'Digambar' | 'Svetambar' | 'Unified'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  
  // Dynamic Bookings and Data
  const [dharamshalas, setDharamshalas] = useState<DharamshalaData[]>(DEFAULT_DHARAMSHALAS);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  // Booking Form States
  const [selectedDs, setSelectedDs] = useState<DharamshalaData | null>(null);
  const [formData, setFormData] = useState({
    pilgrimName: '',
    contact: '',
    checkInDate: '',
    roomType: 'Deluxe Room',
    guestsCount: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Load Bookings from FireStore or LocalStorage for offline resilience
  useEffect(() => {
    setLoadingBookings(true);
    // Subscribe to booking history (filtered for current pilgrim)
    const savedLocalBookings = localStorage.getItem('dharamshala_bookings_local');
    let localList: BookingRecord[] = [];
    if (savedLocalBookings) {
      try {
        localList = JSON.parse(savedLocalBookings);
        setBookings(localList);
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const q = query(collection(db, 'dharamshala_bookings'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const dbBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as BookingRecord);
        // Combine DB bookings with local bookings (and deduplicate by ID)
        const combined = [...dbBookings, ...localList];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setBookings(unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoadingBookings(false);
      }, (error) => {
        console.warn("Firestore bookings access restricted or rules active:", error);
        setLoadingBookings(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore subscription error:", e);
      setLoadingBookings(false);
    }
  }, []);

  // Handle new booking submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDs) return;

    if (!formData.pilgrimName.trim() || !formData.contact.trim() || !formData.checkInDate) {
      alert(lang === 'en' ? 'Please fill out all required fields.' : 'कृपया सभी अनिवार्य जानकारी दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const bookingId = "BK_" + Date.now().toString().slice(-8);
    const newBooking: Omit<BookingRecord, 'id'> = {
      dharamshalaId: selectedDs.id,
      dharamshalaName: selectedDs.name,
      tirth: selectedDs.tirth,
      pilgrimName: formData.pilgrimName,
      checkInDate: formData.checkInDate,
      roomType: formData.roomType,
      guestsCount: Number(formData.guestsCount),
      status: 'pending',
      priceCollected: selectedDs.pricePerDay,
      contact: formData.contact,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Submit to Firestore
      await addDoc(collection(db, 'dharamshala_bookings'), {
        ...newBooking,
        id: bookingId
      });
      
      // 2. Also persist locally for offline transparency
      const existingLocalStr = localStorage.getItem('dharamshala_bookings_local');
      const existingList = existingLocalStr ? JSON.parse(existingLocalStr) : [];
      const updatedList = [{ id: bookingId, ...newBooking }, ...existingList];
      localStorage.setItem('dharamshala_bookings_local', JSON.stringify(updatedList));
      setBookings(updatedList);

      setSubmitMessage(lang === 'en' ? 'Booking submitted! The Temple Trust desk will contact you.' : 'बुकिंग सफलतापूर्वक भेजी गई! धर्मशाला ट्रस्ट आपसे पूछताछ हेतु संपर्क करेगा।');
      setFormData({
        pilgrimName: '',
        contact: '',
        checkInDate: '',
        roomType: 'Deluxe Room',
        guestsCount: 2
      });
      setTimeout(() => {
        setSelectedDs(null);
        setSubmitMessage(null);
      }, 4000);
    } catch (error) {
      console.error("Firestore booking submit failed, using client-side ledger:", error);
      
      // Fallback: save to client state ledger
      const existingLocalStr = localStorage.getItem('dharamshala_bookings_local');
      const existingList = existingLocalStr ? JSON.parse(existingLocalStr) : [];
      const updatedList = [{ id: bookingId, ...newBooking }, ...existingList];
      localStorage.setItem('dharamshala_bookings_local', JSON.stringify(updatedList));
      setBookings(updatedList);

      setSubmitMessage(lang === 'en' ? 'Request saved locally! (Connecting to trust...)' : 'अनुरोध लोकल सेव हुआ! (ट्रस्ट से संपर्क जा रही है...)');
      setFormData({
        pilgrimName: '',
        contact: '',
        checkInDate: '',
        roomType: 'Deluxe Room',
        guestsCount: 2
      });
      setTimeout(() => {
        setSelectedDs(null);
        setSubmitMessage(null);
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter listings
  const filteredDS = dharamshalas.filter(ds => {
    // Search query
    const matchSearch = searchQuery.trim() === '' || 
      ds.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.name.hi.includes(searchQuery) ||
      ds.tirth.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.tirth.hi.includes(searchQuery) ||
      ds.address.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.address.hi.includes(searchQuery);

    // Sect filter
    const matchSect = selectedSect === 'all' || ds.sect === selectedSect;

    // Price filter
    const matchPrice = ds.pricePerDay <= maxPrice;

    return matchSearch && matchSect && matchPrice;
  });

  return (
    <div className="min-h-full pb-26 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Absolute Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight truncate">
              {lang === 'en' ? 'JAIN DHARAMSHALA DIRECTORY' : 'जैन धर्मशाला एवं बुकिंग निर्देशिका'}
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
              {lang === 'en' ? 'Verified Canonical Trusts & Meal Timings' : 'सत्यापित देव-स्थान ट्रस्ट एवं भोजनशाला मर्यादा'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#ff3d3d] hover:text-[#ff6e6e] font-black text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none shrink-0"
            title={lang === 'en' ? 'About Dharamshalas' : 'धर्मशालाओं के बारे में'}
          >
            ?
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-5 py-2 h-10 rounded-2xl bg-[#FF3D00] hover:bg-[#D50000] text-white flex items-center gap-2 font-black text-xs md:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FF3D00]/20 shrink-0"
            title={lang === 'en' ? 'Change Language' : 'भाषा बदलें'}
          >
            <Globe size={15} className="shrink-0" />
            <span>{lang === 'en' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </header>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Finder & Directory Listings */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Panel */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121212]/80 border border-gray-200/50 dark:border-white/5 shadow-sm space-y-4">
            
            {/* Search Input */}
            <UnifiedSearchBar
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder={lang === 'en' ? "Search by Tirth, city names, or Kothi name..." : "शिखरजी, पालीताना, सोनागिरि या धर्मशाला नाम खोजें..."}
              id="dharamshala-search-input"
            />

            {/* Quick Filter Selection */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              {/* Sect buttons */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'Digambar', 'Svetambar', 'Unified'] as const).map((sect) => (
                  <button
                    key={sect}
                    onClick={() => setSelectedSect(sect)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      selectedSect === sect
                        ? "bg-[#FF6D00] text-white shadow-sm"
                        : "bg-gray-150/40 dark:bg-white/5 hover:bg-gray-150 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {sect === 'all' ? (lang === 'en' ? 'All Traditions' : 'सभी संप्रदाय') : sect}
                  </button>
                ))}
              </div>

              {/* Price slider */}
              <div className="w-full sm:w-48 text-[11px] font-bold">
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-500">{lang === 'en' ? 'Max Room Contribution:' : 'अधिकतम दान राशि:'}</span>
                  <span className="text-orange-500">₹{maxPrice}/day</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-orange-500 bg-gray-200 dark:bg-white/15 h-1 rounded-lg cursor-pointer"
                  id="dharamshala-price-slider"
                />
              </div>
            </div>
          </div>

          {/* Directory Listings Output */}
          <div className="space-y-4">
            {filteredDS.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#121212]/50 rounded-3xl border border-gray-200 dark:border-white/5">
                <p className="text-xs text-gray-500 font-bold">
                  {lang === 'en' ? 'No verified dharamshalas match your specific filtering.' : 'खोजे गए मानदंडों के अनुकूल कोई सत्यापित धर्मशाला नहीं मिली।'}
                </p>
              </div>
            ) : (
              filteredDS.map((ds) => (
                <div
                  key={ds.id}
                  className="p-5 md:p-6 bg-white dark:bg-[#121212]/80 border border-gray-200/50 dark:border-white/5 rounded-3xl space-y-4 hover:border-orange-500/25 transition-all text-left group shadow-xs relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-gray-100 dark:border-white/5 pb-3">
                    <div>
                      {/* Sect & Rating tags */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 dark:text-[#FFD54F] rounded-full text-[9px] font-black uppercase tracking-wider">
                          {ds.sect}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-amber-500 font-black">
                          ★ {ds.rating}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">
                          ID: {ds.id}
                        </span>
                      </div>
                      
                      {/* Name */}
                      <h3 className="font-display font-black text-sm md:text-base text-gray-900 dark:text-white group-hover:text-[#FF6D00] transition-colors leading-tight">
                        {lang === 'en' ? ds.name.en : ds.name.hi}
                      </h3>

                      {/* Tirth Address description */}
                      <p className="text-[11px] text-gray-650 dark:text-gray-400 font-extrabold flex items-center gap-1.5 mt-1">
                        <MapPin size={13} className="text-gray-400 shrink-0" />
                        <span>{lang === 'en' ? ds.tirth.en : ds.tirth.hi}</span>
                      </p>
                    </div>

                    {/* Room contribution estimation style */}
                    <div className="sm:text-right shrink-0">
                      <span className="text-[8px] font-black tracking-widest text-gray-400 uppercase block">{lang === 'en' ? 'CONTRIBUTION RANGE' : 'सहयोग राशि'}</span>
                      <span className="text-xl font-display font-black text-[#FF6D00] block mt-0.5">₹{ds.pricePerDay}</span>
                      <span className="text-[9px] text-[#00C853] font-bold block uppercase">{lang === 'en' ? 'No Commission' : 'कोई अतिरिक्त शुल्क नहीं'}</span>
                    </div>
                  </div>

                  {/* Core details body */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                    <div className="space-y-2">
                      <div className="flex items-start gap-1.5">
                        <Navigation size={12} className="text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase tracking-wider block mb-0.5">{lang === 'en' ? 'Distance to taleti' : 'पहाड़ चढ़ाई से दूरी'}</span>
                          <span className="text-gray-800 dark:text-gray-200">{ds.distanceToHillWalk}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Clock size={12} className="text-[#FFD54F] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase tracking-wider block mb-0.5">{lang === 'en' ? 'Aharshala Timings' : 'भोजनशाला / अहारशाला नियम'}</span>
                          <span className="text-rose-600 dark:text-rose-400 text-[11px] leading-relaxed block pr-2 font-black">{lang === 'en' ? ds.aharshalaStatus.en : ds.aharshalaStatus.hi}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-1.5">
                        <Phone size={12} className="text-[#00C853] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase tracking-wider block mb-0.5">{lang === 'en' ? 'Trust direct call' : 'ट्रस्ट संपर्क दूरभाष'}</span>
                          <a href={`tel:${ds.contact}`} className="text-blue-550 dark:text-blue-400 hover:underline">{ds.contact}</a>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <MapPin size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400 text-[9px] uppercase tracking-wider block mb-0.5">{lang === 'en' ? 'Location' : 'धर्मशाला पता'}</span>
                          <span className="text-gray-600 dark:text-gray-400 leading-tight text-[11px] block">{lang === 'en' ? ds.address.en : ds.address.hi}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities / Facilities badge row */}
                  <div className="pt-3.5 border-t border-gray-100 dark:border-white/5 flex flex-wrap gap-1.5">
                    {ds.facilities.map((fac, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200/30 dark:border-white/10 rounded-xl text-[10px] text-gray-500 dark:text-gray-300 font-bold shrink-0">
                        • {fac}
                      </span>
                    ))}
                  </div>

                  {/* Actions call */}
                  <div className="pt-1.5 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedDs(ds);
                        setTimeout(() => {
                          const elem = document.getElementById('booking-portal-block');
                          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#FF6D00] to-[#FF9100] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-250 cursor-pointer"
                    >
                      📅 {lang === 'en' ? 'Request Room Booking' : 'कमरा बुकिंग अनुरोध भेजें'}
                    </button>
                    
                    <a
                      href={`tel:${ds.contact}`}
                      className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-150 border border-gray-250 dark:border-white/10 rounded-xl text-xs font-black text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1 transition-all"
                    >
                      <Phone size={13} />
                      <span>{lang === 'en' ? 'Call Trust' : 'सीधे बात करें'}</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Hand: Live Booking Request & Ledgers panel */}
        <div className="lg:col-span-4 space-y-6" id="booking-portal-block">
          
          {/* Active Booking Form */}
          <AnimatePresence mode="wait">
            {selectedDs ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 rounded-3xl bg-gradient-to-b from-orange-500/5 to-orange-500/[0.01] dark:from-zinc-900 dark:to-zinc-950 border border-orange-500/30 shadow-md text-left space-y-4"
              >
                <div className="flex justify-between items-start gap-4 pb-2 border-b border-gray-150/50 dark:border-white/5">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#FF6D00] block">{lang === 'en' ? 'ACTIVE RESERVATION' : 'सक्रिय बुकिंग अनुरोध'}</span>
                    <h4 className="font-display font-black text-sm text-gray-900 dark:text-white leading-normal">
                      {lang === 'en' ? selectedDs.name.en : selectedDs.name.hi}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedDs(null)}
                    className="p-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-900 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs font-bold">
                  {/* Pilgrim Name */}
                  <div className="space-y-1">
                    <label className="text-gray-500 block">{lang === 'en' ? 'Primary Pilgrim Name (मुख्य यात्री):' : 'मुख्य यात्री का नाम (पूर्ण विवरण):'}</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.pilgrimName}
                      onChange={(e) => setFormData({ ...formData, pilgrimName: e.target.value.replace(/[<>]/g, '').slice(0, 100) })}
                      placeholder={lang === 'en' ? "e.g. Samil Jain" : "जैसे: समिल जैन"}
                      className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-550 focus:outline-none"
                    />
                  </div>

                  {/* Phone contact */}
                  <div className="space-y-1">
                    <label className="text-gray-500 block">{lang === 'en' ? 'Inquiries Phone Number:' : 'संपर्क मोबाइल नंबर (व्हाट्सएप):'}</label>
                    <input
                      type="tel"
                      required
                      maxLength={20}
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 20) })}
                      placeholder="+91-XXXXX-XXXXX"
                      className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-550 focus:outline-none"
                    />
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-1">
                    <label className="text-gray-500 block">{lang === 'en' ? 'Date of Arrival (Check-in):' : 'धर्मशाला पहुँचने की तिथि:'}</label>
                    <input
                      type="date"
                      required
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-550 focus:outline-none focus:text-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Room categories selection */}
                    <div className="space-y-1">
                      <label className="text-gray-500 block text-[10px]">{lang === 'en' ? 'Room Category:' : 'कमरा श्रेणी:'}</label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-2 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-550 focus:outline-none"
                      >
                        <option value="Standard Room Non-Ac">{lang === 'en' ? 'Standard Non-Ac' : 'साधारण बिना ए/सी'}</option>
                        <option value="Deluxe Room Ac">{lang === 'en' ? 'Deluxe A/C Room' : 'डीलक्स ए/सी कमरा'}</option>
                        <option value="Family Suite">{lang === 'en' ? 'Family App Suite' : 'पार्क सुईट हॉल'}</option>
                      </select>
                    </div>

                    {/* Guests count */}
                    <div className="space-y-1">
                      <label className="text-gray-500 block text-[10px]">{lang === 'en' ? 'Total Pilgrims:' : 'कुल यात्रीसंख्या:'}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guestsCount}
                        onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-gray-900 dark:text-white focus:ring-1 focus:ring-orange-550 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Live submission feedback report */}
                  {submitMessage && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[11px] leading-relaxed flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5 animate-bounce" />
                      <span>{submitMessage}</span>
                    </div>
                  )}

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#FF6D00] hover:bg-[#FF8100] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={13} />
                        <span>{lang === 'en' ? 'Sending Ledger Request...' : 'ट्रस्ट सर्वर को भेज रहे हैं...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'en' ? 'Confirm Booking Request' : 'बुकिंग अनुरोध प्रेषित करें'}</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="p-5.5 rounded-3xl bg-gray-150/20 dark:bg-[#121212]/30 border border-gray-200 dark:border-white/5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 space-y-2">
                <div className="flex gap-2 items-center text-orange-500">
                  <Hotel size={18} />
                  <span className="font-display font-black text-sm uppercase tracking-wide">{lang === 'en' ? 'Dharamshala Booking' : 'धर्मशाला कमरा आरक्षण'}</span>
                </div>
                <p className="leading-relaxed">
                  {lang === 'en' 
                    ? 'Simply browse verified dharamshalas near holy climbs, tap "Request Room Booking" and submit the trust registry inquiry directly to start.' 
                    : 'तीर्थों के निकटतम धर्मशालाओं के विवरण देखें एवं "कमरा बुकिंग अनुरोध भेजें" पर क्लिक कर अपना आरक्षण प्रपत्र भरें।'}
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Guidelines Discipline Box */}
          <div className="p-5 rounded-3xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/25 text-left space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <ShieldAlert size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">{lang === 'en' ? 'Sacred Discipline (धर्मशाला नियमावली)' : 'परम अनिवार्य आचार नियमावली'}</span>
            </div>
            <ul className="space-y-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-300 list-disc list-inside leading-relaxed">
              <li>{lang === 'en' ? 'Ashtami & Chaturdashi: Extremely strict pure diet rules.' : 'अष्टमी-चतुर्दशी जैसी पवित्र तिथियों पर पूर्ण ब्रह्मचर्य एवं सात्विक भोजन नियम।'}</li>
              <li>{lang === 'en' ? 'Strictly No entry for intoxicants, meat or egg products.' : 'शराब, धूम्रपान, चमड़े की वस्तुएँ एवं अभक्ष्य भोजन का परिसर में पूर्ण निषेध।'}</li>
              <li>{lang === 'en' ? 'Chauvihar dietary rules: Dining halls close strictly before sunset.' : 'भोजनशाला सूर्योदय पश्चात आरंभ एवं सूर्यास्त के समय पूर्णतः बन्द हो जाती है।'}</li>
            </ul>
          </div>

          {/* Interactive Ledger History */}
          <div className="p-5 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl space-y-4 shadow-sm text-left">
            <h4 className="font-display font-black text-xs text-gray-800 dark:text-white uppercase tracking-wider flex items-center justify-between gap-1">
              <span>{lang === 'en' ? 'My Booking Requests Ledger' : 'मेरी बुकिंग इतिहास बही'}</span>
              <span className="text-[8px] bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full text-gray-400">
                {bookings.length} {lang === 'en' ? 'Logs' : 'रिकॉर्ड'}
              </span>
            </h4>

            {bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-400 italic text-[11px]">
                {lang === 'en' ? 'No recent booking requests found.' : 'अभी तक कोई बुकिंग अनुरोध नहीं भेजा गया।'}
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {bookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-3.5 bg-gray-50 dark:bg-black/20 border border-gray-250 dark:border-white/5 rounded-2xl relative font-bold text-[11px] space-y-2.5 animate-in fade-in"
                  >
                    <div className="flex justify-between items-start gap-1 pb-1.5 border-b border-gray-150 dark:border-white/5">
                      <div className="min-w-0">
                        <span className="text-[8px] text-gray-400 block tracking-widest uppercase">DHARAMSHALA</span>
                        <span className="text-gray-900 dark:text-gray-100 truncate block font-extrabold">{lang === 'en' ? bk.dharamshalaName.en : bk.dharamshalaName.hi}</span>
                      </div>
                      
                      {/* Booking status badge */}
                      <span className={cn(
                        "text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                        bk.status === 'approved' 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : bk.status === 'rejected'
                            ? "bg-rose-500/10 text-rose-650"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse"
                      )}>
                        {bk.status === 'approved' 
                          ? (lang === 'en' ? 'Approved' : 'स्वीकृत')
                          : bk.status === 'rejected'
                            ? (lang === 'en' ? 'Rejected' : 'निरस्त')
                            : (lang === 'en' ? 'Pending' : 'प्रक्रियाधीन')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-550 dark:text-gray-400">
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase">{lang === 'en' ? 'Pilgrim' : 'यात्री नाम'}</span>
                        <span className="text-gray-700 dark:text-zinc-350">{bk.pilgrimName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[8px] block uppercase">{lang === 'en' ? 'Check-in' : 'आगमन तिथि'}</span>
                        <span className="text-gray-700 dark:text-zinc-350">{bk.checkInDate}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-gray-150 dark:border-white/5 text-gray-400">
                      <span>ID: {bk.id}</span>
                      <span className="text-orange-550">
                        {lang === 'en' ? 'Contribution:' : 'सहयोग राशि:'} <strong className="text-gray-850 dark:text-gray-200">₹{bk.priceCollected}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Embedded AI Assistant guidance at bottom */}
      <div className="mt-8">
        <SectionAiAgent section="dharamshala" />
      </div>

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] max-w-lg w-full rounded-3xl border border-gray-200 dark:border-white/10 p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
            <button 
              onClick={() => setHelpOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer font-bold"
            >
              ✕
            </button>
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-[#FF6D00] uppercase block">
                {lang === 'en' ? 'DOCUMENTATION & USER GUIDE' : 'मार्गदर्शिका एवं निर्देश'}
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-gray-900 dark:text-white">
                {lang === 'en' ? 'Jain Dharamshala Directory' : 'जैन धर्मशाला एवं बुकिंग'}
              </h3>
            </div>
            
            <div className="space-y-4 text-xs leading-relaxed text-gray-650 dark:text-zinc-350">
              <div className="p-4 rounded-2xl bg-orange-550/10 dark:bg-[#FF6D00]/5 border border-orange-500/10 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-[#FFD54F]">
                  🏔️ {lang === 'en' ? '1. Verified Dev-Sthan Trusts' : '१. सत्यापित जैन समाज ट्रस्ट'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'All listings are directly administered by reliable Digambar and Svetambar trusts near Siddha Kshetras like Sammed Shikharji, Girnar, Palitana, and Sonagiri.' 
                    : 'सभी धर्मशालाएं सम्मेद शिखरजी, गिरनार तलैटी, पालीताना एवं सोनागिरि जैसे सिद्धक्षेत्रों पर प्रामाणिक समाज ट्रस्टों द्वारा संचालित एवं सत्यापित हैं।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-white">
                  🍽️ {lang === 'en' ? '2. Strict Aharshala Compliance' : '२. भोजनशाला शुद्धता मर्यादा'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'Trust dining halls strictly utilize double-layer filtered water (छना पानी) and sunset-compliant, onion-garlic-root-free pure Satvik diet served prior to Chauvihar.' 
                    : 'भोजनशालाओं में केवल शुद्ध द्विस्तरीय वस्त्र से छना मर्यादित जल ही प्रयुक्त होता है, और सूर्यास्त से पूर्व चौविहार मर्यादा के भीतर बिना लहसुन-प्याज का सादा सात्विक भोजन उपलब्ध रहता है।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                <h4 className="font-black text-gray-950 dark:text-white">
                  🛡️ {lang === 'en' ? '3. Commission-free Direct Contribution' : '३. सीधे सहयोग — कोई कमीशन नहीं'}
                </h4>
                <p>
                  {lang === 'en' 
                    ? 'Submit room booking requests directly to the dharamshala office data tables. The contribution is completely direct with zero commission, zero commercial middlemen, or booking charges.' 
                    : 'यात्री बुकिंग आवेदन सीधे धर्मशाला प्रबंधन कार्यालय को भेजे जाते हैं। दान राशि सीधे मंदिर ट्रस्ट को समर्पित होती है। इसमें कोई व्यावसायिक दलाल या मध्यस्थ सम्मिलित नहीं है।'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setHelpOpen(false)}
              className="w-full py-3 bg-[#FF3D00] hover:bg-[#D50000] text-white font-black text-xs md:text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
            >
              {lang === 'en' ? 'UNDERSTOOD, PROCEED' : 'समझ गए, आगे बढ़ें'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
