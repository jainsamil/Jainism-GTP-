import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, Heart, Calendar, Search, MapPin, 
  Users, HelpCircle, Star, ShieldCheck, CheckSquare, Plus, Check, 
  Globe, Info, Phone, MessageSquare, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  collection, doc, setDoc, updateDoc, onSnapshot, getDocs, 
  addDoc, deleteDoc, query, where
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: userId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FacilityTag {
  name: { en: string; hi: string };
  available: boolean;
}

interface Dharamshala {
  id: string;
  name: { en: string; hi: string };
  tirth: { en: string; hi: string };
  sect: 'Digambar' | 'Svetambar' | 'Unified';
  distanceToHillWalk: string; 
  roomsAvailable: number;
  totalRooms: number;
  pricePerDay: number; 
  rating: number;
  aharshalaStatus: { en: string; hi: string };
  contact: string;
  address: { en: string; hi: string };
  facilities: FacilityTag[];
}

const INITIAL_DHARMASHALAS: Dharamshala[] = [
  {
    id: 'db-1',
    name: { en: "Sri Digambar Jain Beespanthi Kothi", hi: "श्री दिगंबर जैन बीसपंथी कोठी धर्मशाला" },
    tirth: { en: "Siddhakshetra Sammed Shikharji (Jharkhand)", hi: "सिद्धक्षेत्र सम्मेद शिखरजी (झारखंड)" },
    sect: 'Digambar',
    distanceToHillWalk: "100m from mountain climbing base",
    roomsAvailable: 34,
    totalRooms: 120,
    pricePerDay: 450,
    rating: 4.8,
    aharshalaStatus: { en: "Ahar starts 11:00 AM, Evening Dinner closes 51 Mins before Sunset.", hi: "भोजनशाला दोपहर ११:०० से चालू, शाम सूर्यास्त से ५१ मिनट पहले रसोइया बंद।" },
    contact: "+91 94313 04514",
    address: { en: "Madhuban Road, near Main Temple base, Madhuban, Giridih, Jharkhand - 815351", hi: "मधुबन रोड, मुख्य मंदिर आधार के पास, मधुबन, गिरिडीह, झारखंड - 815351" },
    facilities: [
      { name: { en: 'Solar Hot Water', hi: 'सौर गरम जल' }, available: true },
      { name: { en: 'Elevator/Lift', hi: 'लिफ्ट सुविधा' }, available: true },
      { name: { en: 'Traditional Chouka', hi: 'मर्यादित चौका' }, available: true },
      { name: { en: 'Senior Assistant', hi: 'बुजुर्ग सेवादार' }, available: true }
    ]
  },
  {
    id: 'db-2',
    name: { en: "Anandji Kalyanji Trust Dharamshala Complex", hi: "आनंदजी कल्याणजी पेढ़ी श्वेतांबर धर्मशाला भवन" },
    tirth: { en: "Siddhakshetra Palitana (Shatrunjaya Hills, Gujarat)", hi: "सिद्धक्षेत्र पालिताना शत्रुंजय गिरिराज (गुजरात)" },
    sect: 'Svetambar',
    distanceToHillWalk: "250m near Taleti climbing trail",
    roomsAvailable: 25,
    totalRooms: 150,
    pricePerDay: 400,
    rating: 4.9,
    aharshalaStatus: { en: "Morning Navkarshi 7:15 AM, Choupati closes strictly at Sunset.", hi: "प्रात: नवकारसी ७:१५ बजे, सांय चौविहार सूर्यास्त समय पर बंद।" },
    contact: "+91 27825 21000",
    address: { en: "Taleti Road, near Palitana Base, Palitana, Bhavnagar, Gujarat - 364270", hi: "तलेटी रोड, पालिताना बेस के पास, पालिताना, भावनगर, गुजरात - 364270" },
    facilities: [
      { name: { en: 'Air Conditioning', hi: 'एसी कमरे' }, available: true },
      { name: { en: 'Lift / Wheelchair', hi: 'व्हीलचेयर सहायता' }, available: true },
      { name: { en: 'Navkarshi Hall', hi: 'नवकारसी हॉल' }, available: true },
      { name: { en: 'Sadharmik discount', hi: 'साधर्मिक छूट' }, available: true }
    ]
  },
  {
    id: 'db-3',
    name: { en: "Sri Shantinath Digambar Jain Atishay Kshetra", hi: "श्री शांतिनाथ दिगंबर जैन अतिशय क्षेत्र धर्मशाला" },
    tirth: { en: "Kundalpur (Damoh, Madhya Pradesh)", hi: "कुंडलपुर जी तीर्थ क्षेत्र (दमोह, मध्य प्रदेश)" },
    sect: 'Unified',
    distanceToHillWalk: "Opposite to historical Kundalpur Lake",
    roomsAvailable: 21,
    totalRooms: 50,
    pricePerDay: 300,
    rating: 4.7,
    aharshalaStatus: { en: "Free Prasad Bhojanalaya: Afternoon 11:00 - 1:30 PM", hi: "साधार्मिक निःशुल्क भोजनालय: दोपहर ११:०० से १:३० तक" },
    contact: "+91 76012 83022",
    address: { en: "Siddhakshetra Kundalpur Road, Kundalpur, Damoh, Madhya Pradesh - 470773", hi: "सिद्धक्षेत्र कुण्डलपुर मार्ग, कुण्डलपुर, दमोह, मध्य प्रदेश - 470773" },
    facilities: [
      { name: { en: 'Hot Geysers', hi: 'गीजर सुविधा' }, available: true },
      { name: { en: 'Library Books', hi: 'ज्ञान स्वाध्याय पुस्तकालय' }, available: true },
      { name: { en: 'Lake View rooms', hi: 'जलाशय सुंदर व्यू' }, available: false }
    ]
  },
  {
    id: 'db-4',
    name: { en: "Sri Digambar Jain Swarnagiri Dharamshala", hi: "श्री दिगंबर सिद्धक्षेत्र सोनागिरि स्वर्ण पर्वत धर्मशाला" },
    tirth: { en: "Siddhakshetra Sonagiri (Datia, Madhya Pradesh)", hi: "सिद्धक्षेत्र सोनागिरि (दतिया, मध्य प्रदेश)" },
    sect: 'Digambar',
    distanceToHillWalk: "Directly located at downhill primary arch (Gate 1)",
    roomsAvailable: 15,
    totalRooms: 80,
    pricePerDay: 250,
    rating: 4.6,
    aharshalaStatus: { en: "Authentic Bundelkhandi Shuddha Bhojan before sunset.", hi: "बुंदेलखंडी पारंपरिक शुद्ध मर्यादित भोजन सूर्यास्त पूर्व प्राप्त करें।" },
    contact: "+91 75222 62224",
    address: { en: "Sonagiri Hill Road, Near Temple Gate No. 1, Sonagiri, Datia, Madhya Pradesh - 475685", hi: "सोनागिरि पर्वत मार्ग, मंदिर गेट नंबर 1 के पास, सोनागिरि, दतिया, मध्य प्रदेश - 475685" },
    facilities: [
      { name: { en: 'Hot Water Geysers', hi: 'गर्म पानी गीजर' }, available: true },
      { name: { en: 'Washing Area', hi: 'मर्यादित वस्त्र प्रक्षालन' }, available: true },
      { name: { en: 'Temple inside yard', hi: 'परिसर जिनालय' }, available: true }
    ]
  },
  {
    id: 'db-5',
    name: { en: "Girnar Digambar Jain Dharamshala Bandha", hi: "गिरनारजी दिगंबर जैन धर्मशाला" },
    tirth: { en: "Girnarji Siddhakshetra (Junagadh, Gujarat)", hi: "गिरनारजी सिद्धक्षेत्र (जूनागढ़, गुजरात)" },
    sect: 'Unified',
    distanceToHillWalk: "300m near Girnar 1st Tonk base step count",
    roomsAvailable: 18,
    totalRooms: 90,
    pricePerDay: 500,
    rating: 4.9,
    aharshalaStatus: { en: "Pure raw-vessel standard lunch 11:00 AM - 1:00 PM.", hi: "काजू बादाम सूप युक्त मर्यादित भोजन दोपहर ११:०० से १:००।" },
    contact: "+91 28526 21453",
    address: { en: "Girnar Talati road, Near Girnar Hill Step 1 base, Junagadh, Gujarat - 362001", hi: "गिरनार तलती मार्ग, गिरनार पर्वत प्रथम टोंक चढ़ाई के पास, जूनागढ़, गुजरात - 362001" },
    facilities: [
      { name: { en: 'Senior Citizen Support', hi: 'वरिष्ठ जन व्हीलचेयर' }, available: true },
      { name: { en: 'Hot Geysers', hi: 'गीजर सुसज्जित' }, available: true },
      { name: { en: 'Aharshala adjacent', hi: 'भोजनशाला समीप' }, available: true }
    ]
  },
  {
    id: 'db-6',
    name: { en: "Sri Digambar Siddhakshetra Pavagiri Dharamshala", hi: "पावागिरी जैन धर्मशाला अतिशय क्षेत्र" },
    tirth: { en: "Pavagiri Siddhakshetra (Madhya Pradesh)", hi: "पावागिरी सिद्धक्षेत्र पाथरी (मध्य प्रदेश)" },
    sect: 'Digambar',
    distanceToHillWalk: "50m near mountain path layout",
    roomsAvailable: 45,
    totalRooms: 100,
    pricePerDay: 350,
    rating: 4.7,
    aharshalaStatus: { en: "Pure restricted kitchen, sunset dinner timing strict.", hi: "शुद्ध सात्विक मर्यादित रसोई, रात्रि भोजन वर्जित।" },
    contact: "+91 75430 11920",
    address: { en: "Pathari Town, Kurwai, Vidisha District, Madhya Pradesh - 464221", hi: "पठारी कसबा, कुरवाई, जिला विदिशा, मध्य प्रदेश - 464221" },
    facilities: [
      { name: { en: 'Double filtered water', hi: 'छने जल की टंकी' }, available: true },
      { name: { en: 'Doly booking assist', hi: 'डोली बुकिंग सहायता' }, available: true }
    ]
  }
];

export default function DharamshalaBookingPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSect, setSelectedSect] = useState<'All' | 'Digambar' | 'Svetambar'>('All');
  
  // Realtime Database lists
  const [dharamshalas, setDharamshalas] = useState<Dharamshala[]>(INITIAL_DHARMASHALAS);
  const [bookings, setBookings] = useState<any[]>([]);

  // Developer (Trustee Manager) States & Auth
  const [developerCode, setDeveloperCode] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [showPasscodeForm, setShowPasscodeForm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Booking Overlay states
  const [selectedDharamshala, setSelectedDharamshala] = useState<Dharamshala | null>(null);
  const [userName, setUserName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [roomType, setRoomType] = useState('AC Twin Luxury Deluxe');
  const [totalGuests, setTotalGuests] = useState(2);
  const [isBooked, setIsBooked] = useState(false);
  const [submittedBookingSlip, setSubmittedBookingSlip] = useState<any | null>(null);

  // Track user submissions locally in localStorage to read back real-time states
  const [myBookingIds, setMyBookingIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('my_dha_bookings') || '[]');
    } catch {
      return [];
    }
  });

  const saveBookingIdLocally = (id: string) => {
    const updated = [...myBookingIds, id];
    setMyBookingIds(updated);
    localStorage.setItem('my_dha_bookings', JSON.stringify(updated));
  };

  // 1. Auto developer unlock based on user metadata
  useEffect(() => {
    if (user?.email === 'samiljain0111@gmail.com' || role === 'admin') {
      setIsDeveloper(true);
    }
  }, [user, role]);

  const verifyPasscode = () => {
    if (developerCode === '1008') {
      setIsDeveloper(true);
      alert(language === 'en' ? '🔑 Trustee Dashboard Activated! You now have real-time booking confirmation and allocation controls.' : '🔑 क्रेडेंशियल स्वीकृत! आपके पास प्रबंधन और रसीद स्वकृति के पूर्ण अधिकार सक्रिय हो चुके हैं।');
    } else {
      alert(language === 'en' ? '❌ Invalid Passcode!' : '❌ अमान्य पासवर्ड क्रेडेंशियल!');
    }
  };

  // 2. Real-time synchronisation of Dharamshalas and seeding if empty
  useEffect(() => {
    const q = collection(db, 'dharamshalas');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log("Seeding dharamshalas snapshot...");
          for (const item of INITIAL_DHARMASHALAS) {
            await setDoc(doc(db, 'dharamshalas', item.id), item);
          }
        } else {
          const fetched: Dharamshala[] = [];
          snapshot.forEach(docSnap => {
            fetched.push(docSnap.data() as Dharamshala);
          });
          fetched.sort((a, b) => a.id.localeCompare(b.id));
          setDharamshalas(fetched);
        }
      } catch (err) {
        console.error("Error syncing dharamshalas:", err);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'dharamshalas', user?.uid || null);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Real-time synchronisation of dharamshala bookings (Manager sees all / pilgrim sees theirs matching local IDs)
  useEffect(() => {
    if (!isDeveloper && myBookingIds.length === 0) {
      setBookings([]);
      return;
    }

    const colRef = collection(db, 'dharamshala_bookings');
    let q = query(colRef);

    if (!isDeveloper) {
      // Query filters up to 10 matching booking IDs or falls back to local checking to satisfy firestore limit rules
      q = query(colRef, where('id', 'in', myBookingIds.slice(0, 10)));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: any[] = [];
      snapshot.forEach(docSnap => {
        fetched.push(docSnap.data());
      });
      fetched.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setBookings(fetched);
    }, (error) => {
      console.error("Bookings sync error:", error);
    });

    return () => unsubscribe();
  }, [isDeveloper, myBookingIds]);

  // Submit booking requests to owner trusts
  const executeReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !bookingDate) {
      alert(language === 'en' ? 'Please fill out pilgrim name and check-in date!' : 'कृपया मुख्य साधार्मिक यात्री का नाम और आगमन तारीख अवश्य दर्ज करें!');
      return;
    }

    const reservationNumber = 'DHA-' + Math.floor(100000 + Math.random() * 900000);
    const bookingDetails = {
      id: reservationNumber,
      dharamshalaId: selectedDharamshala?.id,
      dharamshalaName: selectedDharamshala?.name,
      tirth: selectedDharamshala?.tirth,
      pilgrimName: userName,
      checkInDate: bookingDate,
      roomType: roomType,
      guestsCount: totalGuests,
      priceCollected: selectedDharamshala?.pricePerDay || 450,
      contact: selectedDharamshala?.contact,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'dharamshala_bookings', reservationNumber), bookingDetails);
      saveBookingIdLocally(reservationNumber);
      setSubmittedBookingSlip(bookingDetails);
      setIsBooked(true);
    } catch (err) {
      console.error("Booking submission failed:", err);
      handleFirestoreError(err, OperationType.WRITE, 'dharamshala_bookings/' + reservationNumber, user?.uid || null);
    }
  };

  // Manager Approve request: decrement available rooms in Firestore
  const handleApproveBooking = async (booking: any) => {
    try {
      await updateDoc(doc(db, 'dharamshala_bookings', booking.id), {
        status: 'approved'
      });
      
      const matchedDha = dharamshalas.find(d => d.id === booking.dharamshalaId);
      if (matchedDha) {
        await updateDoc(doc(db, 'dharamshalas', booking.dharamshalaId), {
          roomsAvailable: Math.max(0, matchedDha.roomsAvailable - 1)
        });
      }
      alert(language === 'en' ? 'Booking approved successfully! Room quota updated live.' : 'स्थान आरक्षण सफलतापूर्वक स्वीकृत! उपलब्ध कमरे का कोटा अद्यतन कर दिया गया है।');
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // Manager Reject request
  const handleRejectBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'dharamshala_bookings', bookingId), {
        status: 'rejected'
      });
      alert(language === 'en' ? 'Request rejected.' : 'स्थान आरक्षण निरस्त कर दिया गया है।');
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  const launchBooking = (item: Dharamshala) => {
    setSelectedDharamshala(item);
    setIsBooked(false);
    setSubmittedBookingSlip(null);
  };

  // Reactive filters on searching query properties
  const filteredDhas = dharamshalas.filter(item => {
    const nameEn = item.name.en.toLowerCase();
    const nameHi = item.name.hi.toLowerCase();
    const tirthEn = item.tirth.en.toLowerCase();
    const tirthHi = item.tirth.hi.toLowerCase();
    const s = searchQuery.toLowerCase();

    const matchesSearch = nameEn.includes(s) || nameHi.includes(s) || tirthEn.includes(s) || tirthHi.includes(s);
    const matchesSect = selectedSect === 'All' ? true : item.sect === selectedSect;

    return matchesSearch && matchesSect;
  });

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      
      {/* Header and Controls aligned in a single line */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 -mt-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00C853] to-[#00E676] flex items-center gap-1.5 sm:gap-2 truncate">
              <Landmark className="text-[#00C853] shrink-0 fill-current w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="truncate">{language === 'en' ? 'JAIN DHARAMSHALA' : 'धर्मशाला बुकिंग'}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-555 font-black dark:text-gray-400 truncate hidden xs:block">
              {language === 'en' ? 'Unified Dharamshala Reservation & Food Timings' : 'तीर्थक्षेत्रों पर कमरों की बुकिंग खिड़की'}
            </p>
          </div>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isDeveloper ? (
            <button
              onClick={() => setIsDeveloper(false)}
              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00C853] rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 cursor-pointer shadow-sm shrink-0"
            >
              🛠️ <span className="hidden xs:inline">TRUST ACTIVE</span>
            </button>
          ) : (
            <button
              onClick={() => setShowPasscodeForm(true)}
              className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-650 dark:text-gray-350 hover:text-[#00C853] dark:hover:text-[#00C853] rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wide border border-dashed border-gray-200/50 dark:border-white/5 cursor-pointer shadow-sm shrink-0 h-8 sm:h-9"
            >
              🛠️ <span className="hidden xs:inline">{language === 'en' ? 'LOGIN' : 'लॉगिन'}</span>
            </button>
          )}

          {/* Help Action Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/11 text-gray-550 dark:text-gray-350 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={language === 'en' ? 'Dharamshala Section Guide' : 'धर्मशाला निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#00C853] text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[9px] sm:text-[10px] cursor-pointer border border-emerald-400/30 shrink-0 h-8 sm:h-9"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Trustee Passcode Form Dialog overlay */}
      {showPasscodeForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-display font-black text-normal text-gray-950 dark:text-white uppercase tracking-wider">
              {language === 'en' ? 'TRUSTEE / MANAGER LOGIN' : 'ट्रस्टी व कोठी प्रबंधक लॉग-इन'}
            </h3>
            <p className="text-[11px] text-gray-500 font-bold">
              {language === 'en' ? 'Enter trust passcode (Use default: 1008) to review booking files, update rooms, and approve digital requests.' : 'बुकिंग सूची समीक्षा, कमरा कोटा अद्यतन करने व आरक्षण रसीद पारित करने हेतु पासकोड प्रविष्ट करें (डिफ़ॉल्ट: 1008):'}
            </p>
            <input 
              type="password"
              placeholder="••••"
              value={developerCode}
              onChange={(e) => setDeveloperCode(e.target.value)}
              className="w-full text-center bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/10 p-3 rounded-2xl font-mono text-lg tracking-widest focus:outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowPasscodeForm(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 rounded-xl text-xs font-bold uppercase cursor-pointer">
                Cancel
              </button>
              <button onClick={() => { verifyPasscode(); setShowPasscodeForm(false); }} className="flex-1 px-4 py-2 bg-[#00C853] hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase cursor-pointer">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO BADGE WARNING DISCLAIMER */}
      <div className="mb-6 p-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-400 font-semibold space-y-2">
        <div className="flex items-center gap-2 text-[#00C853]">
          <ShieldCheck size={18} />
          <h3 className="font-extrabold uppercase tracking-wide text-xs">
            {language === 'en' ? 'Strict Co-Existence & Food Standard Warnings' : 'तीर्थ संवर्धन एवं कठोर शुचिता नियम प्रतिबद्धता'}
          </h3>
        </div>
        <p className="leading-relaxed text-[11px] text-gray-750 dark:text-gray-300">
          {language === 'en'
            ? 'All bookings are processed directly under respective Kothi/Temple trusts. Room allocations require holding true vegetarian pledges: Absolutely zero outside food, no leather articles allowed inside rooms, and strict adherence to silent sunset values of temple premises.'
            : 'सभी बुकिंग मंदिर कमिटी/कोठियों के स्वायत्त प्रबंधन के सहयोग से संचलित हैं। कमरे में ठहरने हेतु यात्री को मर्यादा वचन देना अनिवार्य है: लहसुन-प्याज निर्मित भोजन, अंडा, मांस अथवा मद्य का सेवन वर्जित है तथा धर्मशाला परिसर में चर्म (चमड़े) के जूते/पट्टे वर्जित रहेंगे।'}
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl p-5 mb-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-[#00C853]" size={18} />
            <input 
              type="text" 
              placeholder={language === 'en' ? "Search Pilgrim Peak Area... (e.g. Shikharji, Palitana, Sonagiri, Girnar)" : "तीर्थक्षेत्र खोजें (जैसे: सम्मेद शिखरजी, पालिताना, गिरनार, सोनागिरि)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00C853]"
            />
          </div>

          <div className="flex bg-gray-100 dark:bg-[#181818] p-1 rounded-2xl gap-1">
            {[
              { id: 'All', label: language === 'en' ? 'ALL SECTS' : 'सकल जैन' },
              { id: 'Digambar', label: language === 'en' ? 'DIGAMBAR' : 'दिगंबर कोठी' },
              { id: 'Svetambar', label: language === 'en' ? 'SVETAMBAR' : 'श्वेतांबर पेढ़ी' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSect(tab.id as any)}
                className={cn(
                  "px-4.5 py-2.5 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all",
                  selectedSect === tab.id 
                    ? "bg-[#00C853] text-white shadow-xs animate-pulse" 
                    : "text-gray-500 hover:text-gray-850 dark:hover:text-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MY BOOKINGS / LIVE RESERVATION STATUS / APPROVALS PANEL */}
      {bookings.length > 0 && (
        <div className="mb-6 bg-white dark:bg-[#000000] border-2 border-emerald-500 rounded-[2.5rem] p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-[#00C853] rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 h-9 w-9 bg-emerald-500/15 text-[#00C853] rounded-full flex items-center justify-center animate-pulse">
                <Landmark size={18} />
              </span>
              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-wide text-gray-900 dark:text-white">
                  {isDeveloper ? (language === 'en' ? '🛎️ TRUST ACCOUNT: LIVE NOTIFICATIONS' : '🛎️ कोठी प्रबंधक लाइव नोटिफिकेशन बोर्ड') : (language === 'en' ? '📍 LIVING RESERVATIONS STATUS (LIVE)' : '📍 आपके लाइव बुकिंग अनुरोध एवं स्थिति पत्रक')}
                </h3>
                <p className="text-[10px] font-black text-gray-400">
                  {isDeveloper ? (language === 'en' ? 'Confirm and authorize pending pilgrim allocations instantly.' : 'तीर्थ यात्रियों द्वारा लॉक किए कमरों के अनुरोधों को तत्काल स्वीकृत/अस्वीकृत करें') : (language === 'en' ? 'Booked rooms are sent to trusts; checkout real-time status.' : 'धर्मशाला व्यवस्थापक से रीयल-टाइम अनुमोदन प्राप्त रसीदें यहाँ देखें।')}
                </p>
              </div>
            </div>
            
            {isDeveloper && (
              <span className="text-[10px] bg-amber-500/10 text-amber-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Pending: {bookings.filter(b => b.status === "pending").length} requests
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
            {bookings.map((booking) => {
              const matchedDha = dharamshalas.find(d => d.id === booking.dharamshalaId);
              return (
                <div key={booking.id} className="relative bg-zinc-50 dark:bg-zinc-950 p-4 rounded-3xl border border-dashed border-gray-200 dark:border-white/10 flex flex-col justify-between space-y-3 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono text-[9px] font-black tracking-widest text-[#00C853] bg-[#00C853]/10 px-2.5 py-0.5 rounded-md">
                        🔒 ID: {booking.id}
                      </span>
                      
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1",
                        booking.status === 'approved' ? 'bg-emerald-500/10 text-[#00C853]' :
                        booking.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-500 animate-pulse'
                      )}>
                        {booking.status === 'approved' ? (language === 'en' ? 'APPROVED ✓' : 'स्वीकृत ✅') :
                         booking.status === 'rejected' ? (language === 'en' ? 'REJECTED ✕' : 'अस्वीकृत ❌') :
                         (language === 'en' ? 'PENDING 🕒' : 'प्रतिक्षारत 🕒')}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-xs text-gray-900 dark:text-white mt-1">
                      {booking.dharamshalaName[language] || booking.dharamshalaName?.en}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold">
                      📍 {booking.tirth[language] || booking.tirth?.en}
                    </p>
                  </div>

                  <div className="text-[10px] text-gray-500 font-semibold space-y-1 border-t border-gray-200/50 dark:border-white/5 pt-2">
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Pilgrim Head:' : 'मुख्य यात्री:'}</span>
                      <strong className="text-gray-950 dark:text-white font-black">{booking.pilgrimName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Check-In Arrival:' : 'आगमन तिथि:'}</span>
                      <strong className="text-gray-950 dark:text-white font-mono">{booking.checkInDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Room Category:' : 'कमरा श्रेणी:'}</span>
                      <strong className="text-teal-600 dark:text-teal-400 font-bold">{booking.roomType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Room Price:' : 'कमरा शुल्क/दान मूल्य:'}</span>
                      <strong className="text-[#00C853] font-bold">₹{booking.priceCollected} / दिन</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'en' ? 'Contact Desk:' : 'सत्यापित फोन नंबर:'}</span>
                      <a href={`tel:${booking.contact}`} className="text-blue-500 font-bold underline flex items-center gap-0.5">
                        <Phone size={10} /> {booking.contact}
                      </a>
                    </div>
                  </div>

                  {/* ADMIN ACTION CONTROLS */}
                  {isDeveloper && booking.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-gray-200/50 dark:border-white/5">
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-650 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                      >
                        {language === 'en' ? 'Reject' : 'निरस्त करें'}
                      </button>
                      <button
                        onClick={() => handleApproveBooking(booking)}
                        className="flex-grow py-2 bg-[#00C853] hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <Check size={12} className="stroke-[3.5px]" />
                        {language === 'en' ? 'Approve & Deduct Room' : 'स्वीकार करें'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOOKING DIALOG DIALOG OVERLAY */}
      {selectedDharamshala && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] border border-emerald-500/30 rounded-[2.5rem] max-w-lg w-full p-6 space-y-4 relative shadow-2xl animate-in scale-in duration-250 overflow-y-auto max-h-[90vh]">
            
            <button 
              onClick={() => setSelectedDharamshala(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full cursor-pointer text-gray-500 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>

            {!isBooked ? (
              <form onSubmit={executeReservation} className="space-y-4.5">
                <div className="border-b border-gray-100 dark:border-white/5 pb-3">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#00C853] bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    👑 Verified {selectedDharamshala.sect} Trust
                  </span>
                  <h3 className="font-display font-black text-base md:text-lg text-gray-900 dark:text-white mt-2 leading-tight">
                    {selectedDharamshala.name[language]}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    📍 {selectedDharamshala.tirth[language]}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    {language === 'en' ? 'Primary Pilgrim Name (Aadhar match) *' : 'साधार्मिक यात्री का नाम (आधार कार्ड के अनुसार) *'}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Samil Kumar Jain"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {language === 'en' ? 'Arrival check-in date *' : 'आगमन तारीख (Check-In) *'}
                    </label>
                    <input 
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {language === 'en' ? 'Room category' : 'कमरा श्रेणी चुनें *'}
                    </label>
                    <select 
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
                    >
                      <option value="AC Twin Luxury Deluxe">{language === 'en' ? 'AC Deluxe Luxury (₹800)' : 'एसी लग्जरी डबल रूम (₹800)'}</option>
                      <option value="Family Regular Non-AC">{language === 'en' ? 'Family Non-AC (₹400)' : 'पारिवारिक नॉन-एसी कमरा (₹400)'}</option>
                      <option value="Dormitory Single Bed Limit">{language === 'en' ? 'Dormitory Hall Bed (₹100)' : 'मर्यादित हॉल बेड बिस्तर (₹100)'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {language === 'en' ? 'Total pilgrims count' : 'कुल यात्रियों की संख्या *'}
                    </label>
                    <input 
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={totalGuests}
                      onChange={(e) => setTotalGuests(Number(e.target.value))}
                      className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-800 dark:text-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {language === 'en' ? 'Security Pledge status' : 'मर्यादा प्रतिज्ञा स्तर'}
                    </label>
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                      <ShieldCheck size={14} />
                      {language === 'en' ? 'Pure diet commitment' : 'लहसुन-प्याज रहित संकल्प सक्रिय'}
                    </div>
                  </div>
                </div>

                {/* Submit trigger */}
                <div className="flex justify-between items-center text-xs pt-4 border-t border-gray-150 dark:border-white/5 font-black">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-bold">{language === 'en' ? 'Approx. Donation per Day:' : 'सहयोग राशि मूल्य / दिन:'}</span>
                    <span className="text-[#00C853] text-sm font-extrabold">₹{selectedDharamshala.pricePerDay}</span>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00C853] hover:bg-emerald-600 text-white rounded-xl text-xs uppercase font-black tracking-wider transition-all"
                  >
                    {language === 'en' ? 'Lock Room Booking' : 'नियम स्वीकार कर लॉक करें'}
                  </button>
                </div>
              </form>
            ) : (
              /* High tech digital reservation slip output */
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={26} className="stroke-[3px]" />
                  </div>
                  <h3 className="font-display font-black text-[15px] text-gray-950 dark:text-white uppercase tracking-wider">
                    {language === 'en' ? 'RESERVATION SLIP LOCKED' : 'डिजिटल स्थान आरक्षण अनुरोध पर्ची'}
                  </h3>
                  <div className="px-3.5 py-1 bg-amber-500/10 rounded-md font-mono text-[10px] text-amber-600 dark:text-amber-400 font-extrabold inline-block">
                    ⏳ REQUEST SENT: {submittedBookingSlip.id}
                  </div>
                </div>

                {/* Slip Details and SVG QR Code Block */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-zinc-50 dark:bg-[#080808] border border-dashed border-gray-200 dark:border-white/10 rounded-2xl relative">
                  
                  {/* Detailed summary */}
                  <div className="md:col-span-8 space-y-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between gap-1">
                      <span className="text-gray-400">{language === 'en' ? 'Kothi name:' : 'धर्मशाला कोठी:'}</span>
                      <span className="text-gray-900 dark:text-white font-black text-right max-w-[170px] truncate">{submittedBookingSlip.dharamshalaName[language] || submittedBookingSlip.dharamshalaName?.en}</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      <span className="text-gray-400">{language === 'en' ? 'Pilgrim Center:' : 'पवित्र तीर्थक्षेत्र:'}</span>
                      <span className="text-gray-900 dark:text-white font-bold text-right">{submittedBookingSlip.tirth[language] || submittedBookingSlip.tirth?.en}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'en' ? 'Pilgrim Head:' : 'यात्री मुखिया:'}</span>
                      <span className="text-gray-900 dark:text-white font-black">{submittedBookingSlip.pilgrimName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'en' ? 'Arrival Date:' : 'आगमन चेक-इन:'}</span>
                      <span className="text-gray-900 dark:text-white font-mono">{submittedBookingSlip.checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'en' ? 'Category / Guests:' : 'कमरा श्रेणी / संख्या:'}</span>
                      <span className="text-emerald-500 font-extrabold">{submittedBookingSlip.roomType} (Guests: {submittedBookingSlip.guestsCount})</span>
                    </div>
                  </div>

                  {/* SVG QR Code Simulation */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-gray-150">
                    <svg className="w-18 h-18 text-black" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                      
                      <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                      
                      <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="10" y="75" width="15" height="15" fill="currentColor" />

                      <rect x="40" y="20" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="30" width="8" height="8" fill="currentColor" />
                      <rect x="40" y="45" width="12" height="6" fill="currentColor" />
                      <rect x="55" y="60" width="6" height="12" fill="currentColor" />
                      <rect x="35" y="75" width="18" height="8" fill="currentColor" />
                      <rect x="75" y="45" width="12" height="12" fill="currentColor" />
                      <rect x="70" y="75" width="20" height="10" fill="currentColor" />
                    </svg>
                    <span className="text-[7.5px] font-black uppercase text-gray-500 tracking-wider mt-1">Pending Approval</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[10px] text-amber-700 dark:text-amber-300 font-bold leading-relaxed flex items-start gap-1.5">
                  <Info size={12} className="shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    {language === 'en' 
                      ? 'Room booking request is locked and transmitted! Trustee is notified. Check live status panel at the top of the listings page.' 
                      : 'सूचना: कमरा लॉक कर कोठियों को रीयल-टाइम अनुमोदन हेतु प्रेषित है। अनुमोदन स्थिति इसी पृष्ठ के शीर्ष पर बनी रसीद सूचि पर अपडेट होगी।'}
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setSelectedDharamshala(null)}
                    className="px-6 py-2.5 bg-[#00C853] hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DHARAMSHALA CARDS GRID LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDhas.map(item => {
          const occupancyFilled = item.totalRooms - item.roomsAvailable;
          return (
            <div 
              key={item.id}
              className="bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl p-5 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-2 flex-wrap sm:flex-nowrap">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider",
                    item.sect === 'Digambar' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                    item.sect === 'Svetambar' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-[#00C853] dark:text-emerald-400' :
                    'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  )}>
                    Verified {item.sect} Trust
                  </span>
                  <span className="text-[10px] text-gray-550 dark:text-gray-400 font-bold bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    <MapPin size={11} className="text-[#00C853]" /> {item.distanceToHillWalk}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-display font-black text-gray-950 dark:text-white leading-tight">
                    {item.name[language]}
                  </h3>
                  <p className="text-[11.5px] text-[#00C853] font-extrabold flex items-center gap-1 mt-0.5">
                    ⭐ {item.rating} • {item.tirth[language]}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold italic">
                    📍 {language === 'en' ? 'Address:' : 'पता:'} {item.address[language]}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold block mt-0.5">
                    📞 {language === 'en' ? 'Verified Contact:' : 'सत्यापित फोन नंबर:'} {item.contact}
                  </p>
                </div>

                {/* Facility Tags Grid Box */}
                <div className="flex flex-wrap gap-1.5 my-2">
                  {item.facilities.map((fac, fIdx) => (
                    <span 
                      key={fIdx} 
                      className={cn(
                        "text-[9px] font-extrabold px-2.5 py-1 rounded-lg border",
                        fac.available 
                          ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' 
                          : 'bg-gray-100 text-gray-400 dark:bg-white/5 border-transparent line-through'
                      )}
                    >
                      {fac.available ? '✓' : '✕'} {language === 'en' ? fac.name.en : fac.name.hi}
                    </span>
                  ))}
                </div>

                {/* Bhojanalay timings box */}
                <div className="p-3 bg-zinc-50 dark:bg-[#161616]/70 border border-zinc-150/50 dark:border-white/5 rounded-2xl flex items-start gap-2.5 text-[10px] font-semibold">
                  <CheckSquare size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-gray-650 dark:text-gray-350">
                    <span className="font-bold uppercase tracking-wider text-[8px] text-[#00C853] block">{language === 'en' ? 'Choupati / Prasad Timings' : 'साधार्मिक भोजनालय नियम संहिता'}</span>
                    <p>{item.aharshalaStatus[language]}</p>
                  </div>
                </div>
              </div>

              {/* Room Availability Inventory Scale */}
              <div className="pt-4 mt-4 border-t border-gray-150/40 dark:border-white/5 space-y-2 text-xs">
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10.5px] font-semibold">
                    <span className="text-gray-400">
                      {language === 'en' 
                        ? `Filled: ${occupancyFilled} | Left: ${item.roomsAvailable}` 
                        : `आरक्षित कमरे: ${occupancyFilled} | खाली कमरे: ${item.roomsAvailable}`}
                    </span>
                    <span className={cn(
                      "font-black text-[10px] uppercase",
                      item.roomsAvailable <= 5 ? "text-red-500 animate-pulse" : "text-[#00C853]"
                    )}>
                      {item.roomsAvailable} / {item.totalRooms} available
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${(item.roomsAvailable / item.totalRooms) * 100}%` }}
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.roomsAvailable <= 5 ? "bg-red-500 shadow-[0_0_5px_currentColor]" : "bg-[#00C853]"
                      )}
                    />
                  </div>
                </div>

                {/* Pricing & Reservation action */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">{language === 'en' ? 'Base room fare:' : 'दैनिक कमरा दान:'}</span>
                    <strong className="text-gray-900 dark:text-gray-150 text-sm font-extrabold">₹{item.pricePerDay} / दिन</strong>
                  </div>
                  
                  <button
                    onClick={() => launchBooking(item)}
                    disabled={item.roomsAvailable <= 0}
                    className={cn(
                      "px-4 py-2.5 text-white font-black rounded-xl uppercase tracking-widest text-[9px] cursor-pointer shadow-sm transition-all",
                      item.roomsAvailable <= 0 
                        ? "bg-gray-300 dark:bg-neutral-800 text-gray-500 cursor-not-allowed" 
                        : "bg-[#00C853] hover:bg-emerald-600 active:scale-95"
                    )}
                  >
                    {item.roomsAvailable <= 0 
                     ? (language === 'en' ? 'HOUSE FULL' : 'कमरे समाप्त')
                     : (language === 'en' ? 'Book Room' : 'कमरा बुक करें')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10 inline-block mb-1.5">
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
                className="px-3.5 py-1.5 bg-[#00C853] text-white hover:bg-emerald-650 rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-emerald-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-355 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {language === 'en' ? 'Welcome to Dharamshala Reservation Portal!' : 'धर्मशाला कमरा बुकिंग पोर्टल में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'Reserve pure, clean, non-violent accommodations and order pious restricted meals (Ahar) at major pilgrimage centers easily:' 
                  : 'तीर्थ क्षेत्रों पर शुद्ध, मर्यादित और छने जल की व्यवस्था वाले विश्राम कक्ष तथा सात्विक साधार्मिक वात्सल्य भोजन की अग्रिम बुकिंग करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Book AC/Non-AC Rooms Online:' : 'कमरे का ऑनलाइन चयन एवं बुकिंग:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Explore and search room inventory, including AC Twin Luxury or Family Suites, complete with pricing and instant booking slip output.' 
                    : 'अपनी पसंद के कुण्डलपुर, सोनागिरि अथवा शिखरजी में कमरों की उपलब्धता सूची देखें, आवश्यक विवरण भरकर अग्रिम पर्ची जनरेट करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Verify Holy Amenities:' : 'धर्मशाला की सात्विक सुविधाएँ:'}</strong>{' '}
                  {language === 'en'
                    ? 'Every Dharamshala verifies filters for Double Filtered Water Tanks, Sunrise Food limitations (Chauvihar Rules), and nearby Temple proximity.'
                    : 'सुरक्षित निवास हेतु प्रत्येक स्थान पर छने जल का पृथक प्रबंध, मंदिर की समीपता तथा शुद्ध अहिंसक मर्यादा सुनिश्चित की जाती है।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Track Reservations Locally:' : 'बुकिंग हिस्ट्री की जाँच करें:'}</strong>{' '}
                  {language === 'en'
                    ? 'Access your generated receipt PDF-slips locally or print them out right from your screen to show on check-in counters.'
                    : 'आपके द्वारा आरक्षित पर्ची हमेशा लोकल डिवाइस पर सहेज ली जाती है, जिसे चेक-इन काउंटर पर दिखाकर कमरा प्राप्त कर सकते हैं।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Trustee / Manager Portal:' : 'धर्मशाला प्रबंधक (Trustee Login) पटल:'}</strong>{' '}
                  {language === 'en'
                    ? 'Authorized trustees can login using holy code to edit total room limits, declare status (House Full), and oversee guest registrations.'
                    : 'क्षेत्रीय प्रबंधकों अथवा कमेटी सदस्यों के लिए ट्रस्टी कोड द्वारा लॉगिन कर कमरों की अधिकतम मर्यादा बदलने की प्रशासनिक सुविधा उपलब्ध है।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#00C853] hover:bg-emerald-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {language === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <SectionAiAgent section="dharamshala-booking" />
      </div>
    </div>
  );
}
