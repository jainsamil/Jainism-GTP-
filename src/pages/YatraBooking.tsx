import { useState, useMemo, useEffect } from 'react';
import { 
  Compass, MapPin, Calendar, Users, ArrowLeft, Globe, Search, Plus, 
  ShieldCheck, CheckCircle2, Ticket, Bus, Train, Phone, FileText, 
  Clock, Award, ChevronRight, X, QrCode, Printer, Heart, HelpCircle,
  ExternalLink, RefreshCw, CreditCard, Sparkles, Filter, 
  Check, ArrowRight, Share2, Smartphone, Download, AlertCircle,
  Trash2, Hotel, Tag, ArrowUpDown, Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ALL_INDIA_ORIGIN_CITIES, 
  JAIN_TIRTH_DESTINATIONS, 
  MAJOR_DESTINATION_CITIES,
  ALL_INDIA_VEHICLES, 
  getVehiclesForRoute,
  getDestinationDharamshalas,
  TransportVehicle, 
  SeatClassInfo,
  DestinationDharamshala
} from '../data/yatraTransportData';

export interface SanghYatra {
  id: string;
  title: string;
  organizer: string;
  destination: string;
  startDate: string;
  durationDays: number;
  modeOfTransport: 'AC Sleeper Bus' | 'Special Pilgrim Train' | 'Helicopter & AC Bus';
  foodType: '100% Pure Jain Chovisi (Sunset Compliance)' | 'Navkarsi & Sunset Dinner';
  totalSeats: number;
  bookedSeats: number;
  pricePerYatrik: number;
  imageUrl: string;
  pickupCities: string[];
  description: string;
  contactNo: string;
}

export interface PassengerDetail {
  id: string;
  name: string;
  age: string;
  gender: 'male' | 'female';
  berthPref: string;
}

export interface IssuedTicket {
  pnr: string;
  txnId: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: 'train' | 'bus';
  operator: string;
  originCity: string;
  originStation: string;
  destinationTirth: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  className: string;
  passengers: PassengerDetail[];
  seatCount: number;
  seatsAllocated: string;
  foodService: string;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

const DEFAULT_YATRAS: SanghYatra[] = [
  {
    id: 'yatra_1',
    title: 'Sammed Shikharji Mahateerth Pavitra Sangh Yatra',
    organizer: 'Shree Digambar Jain Siddha Kshetra Trust',
    destination: 'Sammed Shikharji (Parasnath, Jharkhand)',
    startDate: '2026-09-15',
    durationDays: 7,
    modeOfTransport: 'Special Pilgrim Train',
    foodType: '100% Pure Jain Chovisi (Sunset Compliance)',
    totalSeats: 120,
    bookedSeats: 84,
    pricePerYatrik: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    pickupCities: ['Indore', 'Bhopal', 'Agra', 'Kanpur', 'Varanasi', 'Delhi'],
    description: 'Special sacred pilgrimage to Sammed Shikharji where 20 Tirthankars attained Moksha. Includes free Dharamshala stay, pure Chovisi bhojan, and guided Tonk Vandana.',
    contactNo: '+91 98765 00112'
  },
  {
    id: 'yatra_2',
    title: 'Shatrunjay Palitana Chhe Gaau Giri Vandana Yatra',
    organizer: 'Shree Anandji Kalyanji Pedhi Sangh',
    destination: 'Shatrunjay Palitana',
    startDate: '2026-10-10',
    durationDays: 5,
    modeOfTransport: 'AC Sleeper Bus',
    foodType: 'Navkarsi & Sunset Dinner',
    totalSeats: 90,
    bookedSeats: 62,
    pricePerYatrik: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=600',
    pickupCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai', 'Indore'],
    description: 'Experience the divine atmosphere of Shatrunjay Giriraj. Special Doli assistance available for elderly yatriks with pure Navkarsi hall arrangement.',
    contactNo: '+91 98989 33445'
  },
  {
    id: 'yatra_3',
    title: 'Girnarji Neminath Bhagwan Tonk Vandana Sangh',
    organizer: 'Siddhachalam Yatra Samiti',
    destination: 'Girnarji Siddha Kshetra',
    startDate: '2026-11-01',
    durationDays: 4,
    modeOfTransport: 'Helicopter & AC Bus',
    foodType: '100% Pure Jain Chovisi (Sunset Compliance)',
    totalSeats: 60,
    bookedSeats: 48,
    pricePerYatrik: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    pickupCities: ['Rajkot', 'Ahmedabad', 'Indore', 'Jaipur', 'Mumbai'],
    description: 'Holy pilgrimage to 5th Tonk of Bhagwan Neminath at Girnar Hill. Ropeway ticket option included for senior citizens along with sunset dinner protocol.',
    contactNo: '+91 94140 88990'
  },
  {
    id: 'yatra_4',
    title: 'Pawapuri Jal Mandir & Champapuri Siddha Kshetra',
    organizer: 'Bihar Tirth Raksha Sangh',
    destination: 'Pawapuri & Champapuri',
    startDate: '2026-11-20',
    durationDays: 6,
    modeOfTransport: 'AC Sleeper Bus',
    foodType: '100% Pure Jain Chovisi (Sunset Compliance)',
    totalSeats: 100,
    bookedSeats: 35,
    pricePerYatrik: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600',
    pickupCities: ['Varanasi', 'Patna', 'Kolkata', 'Ranchi', 'Delhi'],
    description: 'Nirvana Bhumi of Bhagwan Mahavira at Pawapuri Jal Mandir and Bhagwan Vasupujya at Champapuri. Full security, pure filtered water, and AC bus convoy.',
    contactNo: '+91 93000 44556'
  }
];

export default function YatraBookingPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'search' | 'my_tickets' | 'sangh' | 'pnr'>('search');

  const [yatras] = useState<SanghYatra[]>(DEFAULT_YATRAS);

  // Search & Filter State
  const [originCity, setOriginCity] = useState<string>('All');
  const [selectedDestination, setSelectedDestination] = useState<string>('All');
  const [destinationCategory, setDestinationCategory] = useState<'all' | 'city' | 'tirth'>('all');
  const [travelDate, setTravelDate] = useState<string>('2026-09-15');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'train' | 'bus'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Additional Filter & Sort State
  const [departureTimeFilter, setDepartureTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [sortBy, setSortBy] = useState<'fastest' | 'price_low' | 'rating' | 'departure'>('departure');

  // Booked Tickets Persistence (Local State + LocalStorage Sync)
  const [myTickets, setMyTickets] = useState<IssuedTicket[]>(() => {
    try {
      const saved = localStorage.getItem('jain_yatra_booked_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved tickets", e);
    }
    return [];
  });

  // Save tickets to LocalStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('jain_yatra_booked_tickets', JSON.stringify(myTickets));
    } catch (e) {
      console.error("Error storing tickets", e);
    }
  }, [myTickets]);

  // Swap Origin and Destination
  const handleSwapOriginDestination = () => {
    const currentOrigin = originCity === 'All' ? '' : originCity;
    const currentDest = selectedDestination === 'All' ? '' : selectedDestination;
    
    setOriginCity(currentDest || 'All');
    setSelectedDestination(currentOrigin || 'All');
  };

  // Live PNR Checker State
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState<any | null>(null);

  // Direct Ticket Booking Modal State
  const [bookingVehicle, setBookingVehicle] = useState<TransportVehicle | null>(null);
  const [selectedClass, setSelectedClass] = useState<SeatClassInfo | null>(null);
  
  // Multi-passenger details
  const [passengers, setPassengers] = useState<PassengerDetail[]>([
    { id: 'p1', name: '', age: '32', gender: 'male', berthPref: 'Lower Berth / Window' }
  ]);
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [selectedBusSeats, setSelectedBusSeats] = useState<string[]>(['L1']);
  const [jainFoodPref, setJainFoodPref] = useState<'chovisi' | 'jain_no_onion' | 'navkarsi'>('chovisi');

  // Coupon / Discount Code State
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number; msg: string } | null>(null);

  // UPI Payment Modal State
  const [paymentStep, setPaymentStep] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'phonepe' | 'paytm' | 'upi_id' | 'qr'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('samiljain@okicici');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Issued Ticket E-Pass Modal State
  const [viewTicketModal, setViewTicketModal] = useState<IssuedTicket | null>(null);

  // Group Sangh Booking Modal State
  const [groupBookingModal, setGroupBookingModal] = useState<SanghYatra | null>(null);

  // Dharamshala View Modal State
  const [viewDharamshalaDest, setViewDharamshalaDest] = useState<string | null>(null);

  // Help & Organizer Modals
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helplineModal, setHelplineModal] = useState(false);

  // Filtered & Sorted Vehicles using Universal Route Engine
  const filteredVehicles = useMemo(() => {
    let list = getVehiclesForRoute(originCity, selectedDestination, vehicleFilter, searchQuery);

    // Filter by departure time slot if chosen
    if (departureTimeFilter !== 'all') {
      list = list.filter(v => {
        const hour = parseInt(v.departureTime.split(':')[0], 10);
        if (departureTimeFilter === 'morning') return hour >= 4 && hour < 12;
        if (departureTimeFilter === 'afternoon') return hour >= 12 && hour < 17;
        if (departureTimeFilter === 'evening') return hour >= 17 && hour < 21;
        if (departureTimeFilter === 'night') return hour >= 21 || hour < 4;
        return true;
      });
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'price_low') {
        const priceA = a.seatClasses[0]?.price || 0;
        const priceB = b.seatClasses[0]?.price || 0;
        return priceA - priceB;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'fastest') {
        const durA = parseInt(a.duration) || 10;
        const durB = parseInt(b.duration) || 10;
        return durA - durB;
      }
      // default: departure time
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [vehicleFilter, originCity, selectedDestination, searchQuery, departureTimeFilter, sortBy]);

  // Handle Multi-Passenger Management
  const handleAddPassenger = () => {
    if (passengers.length >= 6) {
      alert(lang === 'en' ? 'Maximum 6 passengers allowed per booking.' : 'एक बार में अधिकतम 6 यात्री ही जोड़े जा सकते हैं।');
      return;
    }
    setPassengers(prev => [
      ...prev,
      { id: `p_${Date.now()}_${prev.length}`, name: '', age: '30', gender: 'male', berthPref: 'Lower Berth / Window' }
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length <= 1) return;
    setPassengers(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePassenger = (id: string, field: keyof PassengerDetail, value: string) => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleApplyCoupon = () => {
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'JAIN10') {
      setCouponApplied({ code: 'JAIN10', discount: 150, msg: '🎉 10% Special Yatri Discount Applied (₹150 Saved)' });
    } else if (clean === 'SHIKHARJI' || clean === 'PALITANA') {
      setCouponApplied({ code: clean, discount: 200, msg: '🏛️ Tirth Special Discount Applied (₹200 Saved)' });
    } else if (clean === 'SENIOR') {
      setCouponApplied({ code: 'SENIOR', discount: 250, msg: '👵 Senior Citizen Yatri Discount Applied (₹250 Saved)' });
    } else {
      alert(lang === 'en' ? 'Invalid coupon code. Try JAIN10, SHIKHARJI, or SENIOR.' : 'अमान्य कूपन कोड। कृपया JAIN10, SHIKHARJI या SENIOR का प्रयोग करें।');
    }
  };

  const handleOpenBookingModal = (v: TransportVehicle, defaultClass?: SeatClassInfo) => {
    setBookingVehicle(v);
    setSelectedClass(defaultClass || v.seatClasses[0]);
    setPassengers([{ id: 'p1', name: '', age: '32', gender: 'male', berthPref: 'Lower Berth / Window' }]);
    setSelectedBusSeats(['L1']);
    setCouponApplied(null);
    setCouponCode('');
    setPaymentStep(false);
  };

  const handleToggleBusSeat = (seatNo: string) => {
    if (selectedBusSeats.includes(seatNo)) {
      if (selectedBusSeats.length > 1) {
        setSelectedBusSeats(prev => prev.filter(s => s !== seatNo));
      }
    } else {
      if (selectedBusSeats.length < passengers.length) {
        setSelectedBusSeats(prev => [...prev, seatNo]);
      } else {
        alert(lang === 'en' ? `You have selected ${passengers.length} passenger(s). Add more passengers to select additional seats.` : `आपने ${passengers.length} यात्री चुने हैं। अधिक सीटों के लिए और यात्री जोड़ें।`);
      }
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = passengers.some(p => !p.name.trim());
    if (invalid) {
      alert(lang === 'en' ? 'Please enter all passenger names.' : 'कृपया सभी यात्रियों के नाम दर्ज करें।');
      return;
    }
    if (!primaryPhone.trim()) {
      alert(lang === 'en' ? 'Please enter a primary contact mobile number.' : 'कृपया मुख्य संपर्क मोबाइल नंबर दर्ज करें।');
      return;
    }

    setPaymentStep(true);
  };

  const handleSimulateUpiPayment = () => {
    if (paymentMethod === 'upi_id' && !upiIdInput.trim()) {
      alert(lang === 'en' ? 'Please enter a valid UPI ID (e.g. name@upi)' : 'कृपया सही UPI ID दर्ज करें');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      if (!bookingVehicle || !selectedClass) return;

      const seatCount = passengers.length;
      const baseFare = seatCount * selectedClass.price;
      const discount = couponApplied ? couponApplied.discount : 0;
      const totalAmount = Math.max(0, baseFare - discount);

      const pnrCode = (bookingVehicle.type === 'train' ? 'IRCTC-PNR-' : 'REDBUS-TKT-') + Math.floor(100000000 + Math.random() * 900000000);
      const txnRef = 'UPI/' + Math.floor(100000000000 + Math.random() * 900000000000) + '/PAY';

      const seatsAllocated = bookingVehicle.type === 'bus' 
        ? selectedBusSeats.join(', ') 
        : `Coach B${Math.floor(Math.random() * 4 + 1)} / Seat ${Math.floor(Math.random() * 40 + 1)} to ${Math.floor(Math.random() * 40 + seatCount)}`;

      const newTicket: IssuedTicket = {
        pnr: pnrCode,
        txnId: txnRef,
        vehicleName: bookingVehicle.name,
        vehicleNumber: bookingVehicle.vehicleNumber,
        vehicleType: bookingVehicle.type,
        operator: bookingVehicle.operatorOrRail,
        originCity: bookingVehicle.originCity,
        originStation: bookingVehicle.originStation,
        destinationTirth: bookingVehicle.destinationTirth,
        destinationStation: bookingVehicle.destinationStation,
        departureTime: bookingVehicle.departureTime,
        arrivalTime: bookingVehicle.arrivalTime,
        travelDate: travelDate,
        className: selectedClass.className,
        passengers: passengers,
        seatCount: seatCount,
        seatsAllocated: seatsAllocated,
        foodService: jainFoodPref === 'chovisi' ? '☀️ 100% Pure Jain Chovisi (Sunset Compliant)' : jainFoodPref === 'navkarsi' ? '☕ Navkarsi Morning Thali' : '🌱 Jain No Garlic Onion',
        discountAmount: discount,
        totalAmount,
        paymentMethod: paymentMethod.toUpperCase(),
        bookedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        status: 'CONFIRMED'
      };

      // Save ticket to local state & LocalStorage
      setMyTickets(prev => [newTicket, ...prev]);

      setViewTicketModal(newTicket);
      setBookingVehicle(null);
      setPaymentStep(false);
      setActiveTab('my_tickets');
    }, 1800);
  };

  const handleCancelTicket = (pnr: string) => {
    if (confirm(lang === 'en' ? 'Are you sure you want to cancel this booking?' : 'क्या आप इस टिकट को रद्द करना चाहते हैं?')) {
      setMyTickets(prev => prev.map(t => t.pnr === pnr ? { ...t, status: 'CANCELLED' } : t));
      alert(lang === 'en' ? 'Ticket cancelled. Refund processed to your source UPI account.' : 'टिकट रद्द कर दिया गया है। रिफंड आपके मूल UPI खाते में भेज दिया गया है।');
    }
  };

  const handleShareWhatsAppTicket = (t: IssuedTicket) => {
    const passengerNames = t.passengers.map(p => p.name).join(', ');
    const message = `*Jain Yatra Sewa - Official E-Ticket*%0A` +
      `*PNR:* ${t.pnr}%0A` +
      `*Vehicle:* ${t.vehicleName} (${t.vehicleNumber})%0A` +
      `*Route:* ${t.originCity} ➔ ${t.destinationTirth}%0A` +
      `*Date:* ${t.travelDate} (${t.departureTime} - ${t.arrivalTime})%0A` +
      `*Class/Seats:* ${t.className} [${t.seatsAllocated}]%0A` +
      `*Passengers:* ${passengerNames}%0A` +
      `*Jain Food Voucher:* ${t.foodService}%0A` +
      `*Paid Amount:* ₹${t.totalAmount} (${t.paymentMethod})%0A` +
      `_Booked via Jain Yatra Sewa Portal_`;

    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleOfficialRedirect = (platform: 'irctc' | 'redbus' | 'makemytrip' | 'abhibus') => {
    let url = '';
    if (platform === 'irctc') url = 'https://www.irctc.co.in/nget/train-search';
    else if (platform === 'redbus') url = 'https://www.redbus.in';
    else if (platform === 'abhibus') url = 'https://www.abhibus.in';
    else if (platform === 'makemytrip') url = 'https://www.makemytrip.com/flights/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePNRCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) {
      alert(lang === 'en' ? 'Please enter a 10-digit IRCTC PNR or Train Number.' : 'कृपया 10-अंकों का IRCTC PNR या ट्रेन नंबर दर्ज करें।');
      return;
    }
    
    // Simulate real-time PNR confirmation result
    setPnrResult({
      pnr: pnrInput.trim(),
      trainName: '12962 - Avantika Express',
      chartStatus: 'CHART PREPARED',
      from: 'Indore Junction (INDB)',
      to: 'Mumbai Central (MMCT)',
      journeyDate: '15-Sep-2026',
      passengers: [
        { no: 1, bookingStatus: 'S3 - 42 (Lower)', currentStatus: 'CNF (Confirmed)' },
        { no: 2, bookingStatus: 'S3 - 43 (Middle)', currentStatus: 'CNF (Confirmed)' }
      ]
    });
  };

  return (
    <div className="min-h-full pb-28 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-3 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs sm:text-base md:text-lg font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] tracking-tight truncate leading-tight">
              {lang === 'en' ? 'JAIN YATRA SEWA • CITY & TIRTH TRAVEL PORTAL' : 'जैन यात्रा सेवा - शहर एवं तीर्थ यात्रा पोर्टल'}
            </h1>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block truncate">
              {lang === 'en' ? 'IRCTC Trains, AC Buses, Pure Sunset Chovisi Meals & E-Tickets' : 'आधिकारिक ट्रेन, AC बसें, 100% चौविहार भोजन एवं डिजिटल ई-टिकट'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setHelplineModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-black text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="24x7 Helpline"
          >
            <Phone size={14} />
            <span className="hidden sm:inline">Helpline</span>
          </button>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#ff3d3d] hover:text-[#ff6e6e] font-black text-sm sm:text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none shrink-0"
            title="About Portal"
          >
            ?
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FF6D00] hover:bg-[#E65100] text-white flex items-center gap-1 font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FF6D00]/20 shrink-0 whitespace-nowrap"
          >
            <Globe size={14} className="shrink-0" />
            <span>{lang === 'en' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-amber-500/20 max-w-6xl mx-auto mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6D00] bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
                <Train size={12} /> {lang === 'en' ? 'JAIN YATRA SEWA' : 'जैन यात्रा सेवा'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck size={12} /> {lang === 'en' ? '100% Pure Jain Chovisi' : 'सूर्यास्त पूर्व 100% शुद्ध चौविहार भोजन'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
                <CreditCard size={12} /> {lang === 'en' ? 'Instant UPI Payment' : 'GPay / PhonePe / Paytm UPI'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-black text-gray-900 dark:text-white">
              {lang === 'en' ? 'City-to-City & Tirth Travel with Live Seat Availability' : 'शहर से शहर अथवा तीर्थ यात्रा - लाइव सीटें एवं टिकट बुक करें'}
            </h2>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
              {lang === 'en' 
                ? 'Search IRCTC trains and AC sleeper buses for any city or sacred Tirth. Get instant digital E-Tickets with QR codes, WhatsApp share, and 100% Pure Jain Sunset Meal vouchers.'
                : 'इंदौर, मुंबई, दिल्ली, भोपाल, जयपुर, अहमदाबाद से सम्मेद शिखरजी, पालिताना, गिरनारजी, पावापुरी एवं कुंडलपुर की लाइव सीटें एवं किराया देखें।'}
            </p>
          </div>

          <button
            onClick={() => setShowOrganizerModal(true)}
            className="px-5 py-3 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} />
            <span>{lang === 'en' ? 'Register Group Sangh' : 'अपना संघ पंजीकृत करें'}</span>
          </button>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('search')}
          className={cn(
            "px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border",
            activeTab === 'search'
              ? "bg-[#FF6D00] text-white border-transparent shadow-md"
              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
          )}
        >
          <Search size={16} />
          <span>{lang === 'en' ? 'Find Trains & Buses' : 'ट्रेन एवं बस खोजें'}</span>
        </button>

        <button
          onClick={() => setActiveTab('my_tickets')}
          className={cn(
            "px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border relative",
            activeTab === 'my_tickets'
              ? "bg-[#FF6D00] text-white border-transparent shadow-md"
              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
          )}
        >
          <Ticket size={16} />
          <span>{lang === 'en' ? 'My E-Tickets & Passes' : 'मेरी बुक की गई टिकटें'}</span>
          {myTickets.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
              {myTickets.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sangh')}
          className={cn(
            "px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border",
            activeTab === 'sangh'
              ? "bg-[#FF6D00] text-white border-transparent shadow-md"
              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
          )}
        >
          <Compass size={16} />
          <span>{lang === 'en' ? 'Organized Group Sanghs' : 'आयोजित संघ यात्राएं'}</span>
        </button>

        <button
          onClick={() => setActiveTab('pnr')}
          className={cn(
            "px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border",
            activeTab === 'pnr'
              ? "bg-[#FF6D00] text-white border-transparent shadow-md"
              : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
          )}
        >
          <RefreshCw size={16} />
          <span>{lang === 'en' ? 'PNR & Live Train Status' : 'PNR स्टेटस'}</span>
        </button>
      </div>

      {/* TAB 1: ROUTE SEARCH ENGINE */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-gray-200 dark:border-white/10 shadow-lg space-y-4">
            
            {/* Header Title */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Compass size={22} className="text-[#FF6D00]" />
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white">
                    {lang === 'en' ? 'All-India Route Search Engine' : 'प्रस्थान नगर से शहर एवं तीर्थ रूट खोजें'}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold">
                    {lang === 'en' ? 'Travel City-to-City OR City-to-Tirth with live IRCTC trains & AC bus tickets' : 'शहर से शहर अथवा शहर से सिद्ध क्षेत्र - दोनों के लिए लाइव ट्रेन एवं बस देखें'}
                  </p>
                </div>
              </div>

              {/* Mode Filter Pills */}
              <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-black">
                <button
                  onClick={() => setVehicleFilter('all')}
                  className={cn("px-3 py-1.5 rounded-xl transition-all cursor-pointer", vehicleFilter === 'all' ? "bg-[#FF6D00] text-white shadow-sm" : "text-gray-500")}
                >
                  All Modes
                </button>
                <button
                  onClick={() => setVehicleFilter('train')}
                  className={cn("px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1", vehicleFilter === 'train' ? "bg-blue-600 text-white shadow-sm" : "text-gray-500")}
                >
                  <Train size={12} /> Trains
                </button>
                <button
                  onClick={() => setVehicleFilter('bus')}
                  className={cn("px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1", vehicleFilter === 'bus' ? "bg-red-600 text-white shadow-sm" : "text-gray-500")}
                >
                  <Bus size={12} /> Buses
                </button>
              </div>
            </div>

            {/* Popular Origin Shortcuts */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                {lang === 'en' ? 'Popular Origin Cities (प्रस्थान नगर):' : 'लोकप्रिय प्रस्थान नगर:'}
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setOriginCity('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer",
                    originCity === 'All'
                      ? "bg-[#FF6D00] text-white border-transparent shadow-sm"
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
                  )}
                >
                  🌟 {lang === 'en' ? 'All Origins' : 'सभी नगर'}
                </button>
                {ALL_INDIA_ORIGIN_CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setOriginCity(c.nameEn)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer",
                      originCity.toLowerCase() === c.nameEn.toLowerCase()
                        ? "bg-[#FF6D00] text-white border-transparent shadow-sm"
                        : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-orange-500"
                    )}
                  >
                    {c.nameEn} ({c.nameHi})
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Destinations Shortcuts */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                  {lang === 'en' ? 'Popular Destinations (गंतव्य चुनें - नगर व तीर्थ):' : 'लोकप्रिय गंतव्य (शहर अथवा तीर्थ):'}
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-black">
                  <button
                    onClick={() => setDestinationCategory('all')}
                    className={cn("px-2 py-0.5 rounded-md cursor-pointer transition-colors", destinationCategory === 'all' ? "bg-orange-500/20 text-[#FF6D00]" : "text-gray-400")}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setDestinationCategory('city')}
                    className={cn("px-2 py-0.5 rounded-md cursor-pointer transition-colors", destinationCategory === 'city' ? "bg-orange-500/20 text-[#FF6D00]" : "text-gray-400")}
                  >
                    🏙️ City to City
                  </button>
                  <button
                    onClick={() => setDestinationCategory('tirth')}
                    className={cn("px-2 py-0.5 rounded-md cursor-pointer transition-colors", destinationCategory === 'tirth' ? "bg-orange-500/20 text-[#FF6D00]" : "text-gray-400")}
                  >
                    🏛️ Sacred Tirths
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedDestination('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer",
                    selectedDestination === 'All'
                      ? "bg-emerald-600 text-white border-transparent shadow-sm"
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-emerald-500"
                  )}
                >
                  🌟 {lang === 'en' ? 'All Destinations' : 'सभी गंतव्य'}
                </button>
                {(destinationCategory === 'all' || destinationCategory === 'city') && MAJOR_DESTINATION_CITIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedDestination(c.nameEn)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1",
                      selectedDestination.toLowerCase() === c.nameEn.toLowerCase()
                        ? "bg-blue-600 text-white border-transparent shadow-sm"
                        : "bg-blue-500/10 dark:bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300 hover:border-blue-500"
                    )}
                  >
                    <span>🏙️</span>
                    <span>{c.nameEn} ({c.nameHi})</span>
                  </button>
                ))}
                {(destinationCategory === 'all' || destinationCategory === 'tirth') && JAIN_TIRTH_DESTINATIONS.map(td => (
                  <button
                    key={td.id}
                    onClick={() => setSelectedDestination(td.nameEn)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1",
                      selectedDestination.toLowerCase() === td.nameEn.toLowerCase()
                        ? "bg-[#FF6D00] text-white border-transparent shadow-sm"
                        : "bg-orange-500/10 dark:bg-orange-500/10 border-orange-500/20 text-orange-800 dark:text-orange-300 hover:border-orange-500"
                    )}
                  >
                    <span>🏛️</span>
                    <span>{td.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Search Inputs Grid with Swap Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 pt-1 items-end">
              {/* Origin Selection */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Start Location (प्रारंभिक स्थान / शहर)
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-[#FF6D00]" />
                  <input
                    type="text"
                    value={originCity === 'All' ? '' : originCity}
                    onChange={e => setOriginCity(e.target.value || 'All')}
                    placeholder="e.g. Indore, Delhi, Mumbai, Bhopal"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex items-center justify-center pb-0.5">
                <button
                  type="button"
                  onClick={handleSwapOriginDestination}
                  className="p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-[#FF6D00] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm flex items-center justify-center"
                  title="Swap From / To"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Destination Selection (Cities & Tirths) */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Target Destination (गंतव्य नगर / तीर्थ)
                </label>
                <div className="relative">
                  <Compass size={16} className="absolute left-3 top-3 text-[#FF6D00]" />
                  <select
                    value={selectedDestination}
                    onChange={e => setSelectedDestination(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                  >
                    <option value="All">🌟 All Destinations (सभी गंतव्य)</option>
                    <optgroup label="🏙️ Major Cities (शहर से शहर)">
                      {MAJOR_DESTINATION_CITIES.map(c => (
                        <option key={c.id} value={c.nameEn}>
                          🏙️ {c.nameEn} ({c.nameHi}) - {c.state}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏛️ Sacred Jain Tirth Kshetras (तीर्थ क्षेत्र)">
                      {JAIN_TIRTH_DESTINATIONS.map(td => (
                        <option key={td.id} value={td.nameEn}>
                          🏛️ {td.nameEn} - {td.nameHi}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Travel Date */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Travel Date (यात्रा दिनांक)
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-[#FF6D00]" />
                  <input
                    type="date"
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                  />
                </div>
              </div>

              {/* Keyword Search */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Train/Bus Name/No. (खोजें)
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="e.g. Avantika / Vande Bharat / 12802"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
                  />
                </div>
              </div>
            </div>

            {/* Departure Time & Sorting Sub-Bar */}
            <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-black">
              {/* Departure Slot Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Departure:</span>
                <button
                  onClick={() => setDepartureTimeFilter('all')}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors", departureTimeFilter === 'all' ? "bg-orange-500/20 text-[#FF6D00]" : "bg-gray-100 dark:bg-white/5 text-gray-500")}
                >
                  All Times
                </button>
                <button
                  onClick={() => setDepartureTimeFilter('morning')}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors", departureTimeFilter === 'morning' ? "bg-orange-500/20 text-[#FF6D00]" : "bg-gray-100 dark:bg-white/5 text-gray-500")}
                >
                  🌅 Morning (4am-12pm)
                </button>
                <button
                  onClick={() => setDepartureTimeFilter('afternoon')}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors", departureTimeFilter === 'afternoon' ? "bg-orange-500/20 text-[#FF6D00]" : "bg-gray-100 dark:bg-white/5 text-gray-500")}
                >
                  ☀️ Afternoon (12pm-5pm)
                </button>
                <button
                  onClick={() => setDepartureTimeFilter('evening')}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors", departureTimeFilter === 'evening' ? "bg-orange-500/20 text-[#FF6D00]" : "bg-gray-100 dark:bg-white/5 text-gray-500")}
                >
                  🌇 Evening (5pm-9pm)
                </button>
                <button
                  onClick={() => setDepartureTimeFilter('night')}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors", departureTimeFilter === 'night' ? "bg-orange-500/20 text-[#FF6D00]" : "bg-gray-100 dark:bg-white/5 text-gray-500")}
                >
                  🌙 Night (9pm-4am)
                </button>
              </div>

              {/* Sorting Options */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpDown size={12} /> Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[11px] font-black text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="departure">⏰ Departure Time</option>
                  <option value="price_low">💰 Price: Low to High</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="fastest">⚡ Fastest Duration</option>
                </select>
              </div>
            </div>

            {/* Quick External Links Bar */}
            <div className="pt-2 border-t border-gray-150 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <span>Direct Portals:</span>
                <button
                  onClick={() => handleOfficialRedirect('irctc')}
                  className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-black flex items-center gap-1"
                >
                  <span>IRCTC Official</span>
                  <ExternalLink size={10} />
                </button>
                <button
                  onClick={() => handleOfficialRedirect('redbus')}
                  className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-[11px] font-black flex items-center gap-1"
                >
                  <span>RedBus Official</span>
                  <ExternalLink size={10} />
                </button>
              </div>

              <div className="text-xs font-black text-[#FF6D00] flex items-center gap-1">
                <Sparkles size={14} />
                <span>Found {filteredVehicles.length} Vehicles Available</span>
              </div>
            </div>
          </div>

          {/* VEHICLE LISTING CARDS */}
          <div className="max-w-6xl mx-auto space-y-6">
            {filteredVehicles.length === 0 ? (
              <div className="p-12 text-center bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 space-y-3">
                <AlertCircle size={36} className="mx-auto text-amber-500" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {lang === 'en' ? 'No direct vehicles match this exact filter combination' : 'इस रूट के लिए कोई गाड़ी प्रदर्शित नहीं हुई'}
                </h3>
                <p className="text-xs text-gray-500 font-bold max-w-md mx-auto">
                  {lang === 'en' ? 'Try changing your origin city or selecting a different departure time filter.' : 'कृपया प्रस्थान नगर बदलकर या "सभी समय" चुनकर पुनः प्रयास करें।'}
                </p>
                <button
                  onClick={() => {
                    setOriginCity('All');
                    setSelectedDestination('All');
                    setDepartureTimeFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#FF6D00] text-white rounded-xl font-black text-xs uppercase cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredVehicles.map(v => (
                  <div
                    key={v.id}
                    className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-3xl p-5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all space-y-4"
                  >
                    {/* Header Row: Type, Number, Name, Rating */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-150 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-md",
                          v.type === 'train' ? "bg-blue-600" : "bg-red-600"
                        )}>
                          {v.type === 'train' ? <Train size={22} /> : <Bus size={22} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#FF6D00] uppercase tracking-wider">
                              {v.type === 'train' ? `IRCTC Train #${v.vehicleNumber}` : `Bus #${v.vehicleNumber}`}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/20">
                              ⭐ {v.rating}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-snug">
                            {v.name}
                          </h3>
                          <span className="text-[11px] font-bold text-gray-500">
                            {v.operatorOrRail} • Runs: {v.runsOn.join(', ')}
                          </span>
                        </div>
                      </div>

                      <div className="self-end sm:self-auto flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck size={13} />
                          <span>{v.foodService}</span>
                        </span>
                      </div>
                    </div>

                    {/* Timings & Route Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-150 dark:border-white/5">
                      {/* Origin */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase text-gray-400">Departure (प्रस्थान)</span>
                        <div className="text-lg font-black text-gray-900 dark:text-white">{v.departureTime}</div>
                        <div className="text-xs font-black text-gray-700 dark:text-gray-300">{v.originStation}</div>
                        <span className="text-[11px] font-bold text-gray-500">{v.originCity}</span>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col items-center justify-center my-auto space-y-1 text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-gray-200 dark:border-white/10">
                        <span className="text-[10px] font-black uppercase text-[#FF6D00]">{v.duration}</span>
                        <div className="w-full flex items-center justify-center gap-2 text-gray-300 dark:text-gray-600">
                          <div className="h-[2px] w-12 bg-gray-300 dark:bg-gray-700"></div>
                          <ArrowRight size={14} className="text-[#FF6D00]" />
                          <div className="h-[2px] w-12 bg-gray-300 dark:bg-gray-700"></div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">Direct Route</span>
                      </div>

                      {/* Destination */}
                      <div className="space-y-0.5 text-left sm:text-right">
                        <span className="text-[10px] font-black uppercase text-gray-400">Arrival (गंतव्य)</span>
                        <div className="text-lg font-black text-gray-900 dark:text-white">{v.arrivalTime}</div>
                        <div className="text-xs font-black text-gray-700 dark:text-gray-300">{v.destinationStation}</div>
                        <span className="text-[11px] font-black text-[#FF6D00]">{v.destinationTirth}</span>
                      </div>
                    </div>

                    {/* Seat Classes & Pricing */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                        Seat Availability & Fares per Class (श्रेणी एवं किराया चुनें):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {v.seatClasses.map((sc, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleOpenBookingModal(v, sc)}
                            className="p-3 rounded-2xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 hover:border-[#FF6D00] transition-all cursor-pointer space-y-1 shadow-sm group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-gray-900 dark:text-white group-hover:text-[#FF6D00]">
                                {sc.className}
                              </span>
                              <span className="text-xs font-black text-[#FF6D00]">
                                ₹{sc.price}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-black">
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {sc.availableSeats} Seats Left
                              </span>
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] rounded">
                                {sc.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="pt-2 border-t border-gray-150 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewDharamshalaDest(v.destinationTirth)}
                          className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Hotel size={14} />
                          <span>View Dharamshalas at {v.destinationTirth}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenBookingModal(v)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Ticket size={16} />
                        <span>{lang === 'en' ? 'Book Ticket Direct' : 'सीधा टिकट बुक करें'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKED E-TICKETS & PASSES */}
      {activeTab === 'my_tickets' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket size={22} className="text-[#FF6D00]" />
                <span>{lang === 'en' ? 'My Booked E-Tickets & Boarding Passes' : 'मेरी बुक की गई टिकटें एवं ई-पास'}</span>
              </h2>
              <p className="text-xs text-gray-500 font-bold">
                {lang === 'en' ? 'View digital boarding passes, share on WhatsApp, or print tickets' : 'अपने डिजिटल बोर्डिंग पास देखें, व्हाट्सएप पर शेयर करें या प्रिंट लें'}
              </p>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {myTickets.length} Issued
            </span>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-12 text-center bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 space-y-3">
              <Ticket size={48} className="mx-auto text-gray-400" />
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                {lang === 'en' ? 'No Booked E-Tickets Found' : 'कोई बुक की गई टिकट नहीं मिली'}
              </h3>
              <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto">
                {lang === 'en' ? 'Search available trains and buses to book your ticket with instant 100% Pure Sunset Chovisi meal vouchers.' : 'यात्रा के लिए ट्रेन एवं बस खोजें और त्वरित टिकट बुक करें।'}
              </p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-5 py-2.5 bg-[#FF6D00] text-white rounded-xl font-black text-xs uppercase cursor-pointer shadow-md"
              >
                Search Trains & Buses
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {myTickets.map((t, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-3xl p-5 border shadow-md space-y-4 relative overflow-hidden",
                    t.status === 'CANCELLED' ? "border-red-500/30 opacity-75" : "border-emerald-500/30"
                  )}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 dark:border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-0.5 text-[10px] font-black rounded-md uppercase",
                          t.status === 'CANCELLED' ? "bg-red-500/20 text-red-500" : "bg-emerald-500/10 text-emerald-600"
                        )}>
                          {t.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}
                        </span>
                        <span className="text-xs font-black text-[#FF6D00]">PNR: {t.pnr}</span>
                      </div>
                      <h3 className="text-base font-black text-gray-900 dark:text-white mt-1">
                        {t.vehicleName} ({t.vehicleNumber})
                      </h3>
                      <p className="text-xs font-bold text-gray-500">{t.operator} • Booked: {t.bookedAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-gray-900 dark:text-white">₹{t.totalAmount}</span>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">{t.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Route & Passenger Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-black">Route & Journey Date</span>
                      <p className="text-gray-900 dark:text-white font-black">{t.originCity} ➔ {t.destinationTirth}</p>
                      <p className="text-gray-500">Date: {t.travelDate} ({t.departureTime} - {t.arrivalTime})</p>
                      <p className="text-[#FF6D00]">Class: {t.className} [{t.seatsAllocated}]</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-black">Passengers ({t.passengers.length})</span>
                      {t.passengers.map((p, pidx) => (
                        <p key={pidx} className="text-gray-800 dark:text-gray-200">
                          • {p.name} ({p.age}y, {p.gender}) - <span className="text-gray-500">{p.berthPref}</span>
                        </p>
                      ))}
                      <p className="text-emerald-600 font-black text-[11px] pt-1">{t.foodService}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareWhatsAppTicket(t)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Share2 size={14} />
                        <span>Share on WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setViewTicketModal(t)}
                        className="px-3.5 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <QrCode size={14} />
                        <span>View E-Pass QR</span>
                      </button>

                      <button
                        onClick={() => setViewDharamshalaDest(t.destinationTirth)}
                        className="px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Hotel size={14} />
                        <span>Dharamshalas</span>
                      </button>
                    </div>

                    {t.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelTicket(t.pnr)}
                        className="px-3 py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Cancel Ticket</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORGANIZED GROUP SANGH YATRAS */}
      {activeTab === 'sangh' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Compass size={20} className="text-[#FF6D00]" />
              <span>{lang === 'en' ? 'Organized Group Sangh Pilgrimages' : 'आगामी आयोजित संघ यात्राएं (भोजन एवं आवास सहित)'}</span>
            </h2>
            <span className="text-xs font-bold text-gray-500">
              {yatras.length} {lang === 'en' ? 'Active Group Yatras' : 'सक्रिय संघ यात्राएं'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {yatras.map(y => {
              const seatsLeft = y.totalSeats - y.bookedSeats;

              return (
                <div
                  key={y.id}
                  className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-3xl p-5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-orange-500/10 text-[#FF6D00] text-[10px] font-black uppercase rounded-lg border border-orange-500/20">
                        {y.organizer}
                      </span>
                      <span className="text-[11px] font-black text-amber-600 dark:text-amber-400">
                        🗓️ {y.startDate} ({y.durationDays} Days)
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug">
                      {y.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                      <MapPin size={14} className="text-[#FF6D00] shrink-0" />
                      <span>Destination: {y.destination}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                    <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center gap-2">
                      <Bus size={14} className="text-[#FF6D00]" />
                      <span className="truncate">{y.modeOfTransport}</span>
                    </div>

                    <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="truncate">{y.foodType.includes('Chovisi') ? '☀️ Pure Sunset Chovisi' : 'Navkarsi Food'}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-gray-500">
                    <span>Pickups: </span>
                    <span className="text-gray-700 dark:text-gray-300">{y.pickupCities.join(', ')}</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-bold">
                    {y.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-150 dark:border-white/5">
                    <div>
                      <span className="text-lg font-black text-gray-900 dark:text-white">₹{y.pricePerYatrik}</span>
                      <span className="text-[10px] text-gray-500 block">per yatrik (stay + food)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                        {seatsLeft} seats left
                      </span>

                      <button
                        onClick={() => setGroupBookingModal(y)}
                        className="px-4 py-2.5 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Ticket size={14} />
                        <span>{lang === 'en' ? 'Reserve Sangh Seat' : 'संघ सीट आरक्षित करें'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PNR CHECKER & TRAIN STATUS */}
      {activeTab === 'pnr' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg space-y-5">
            <div className="flex items-center gap-3">
              <RefreshCw size={28} className="text-[#FF6D00]" />
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {lang === 'en' ? 'IRCTC Live PNR & Train Running Tracker' : 'IRCTC पीएनआर एवं लाइव ट्रेन स्टेटस जांचें'}
                </h3>
                <p className="text-xs text-gray-500 font-bold">
                  {lang === 'en' ? 'Check real-time chart status, coach position, and berth allocation for any 10-digit IRCTC PNR' : '10-अंकों का PNR नंबर दर्ज करके सीट पुष्टि एवं कोच नंबर देखें'}
                </p>
              </div>
            </div>

            <form onSubmit={handlePNRCheck} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={pnrInput}
                onChange={e => setPnrInput(e.target.value)}
                placeholder="Enter 10-digit IRCTC PNR (e.g. 2847592011)"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6D00]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer"
              >
                Check Status
              </button>
            </form>

            {pnrResult && (
              <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-3 animate-in fade-in duration-200 text-xs font-bold">
                <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                  <span className="text-[#FF6D00] font-black">PNR: {pnrResult.pnr}</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-600 rounded-md font-black">{pnrResult.chartStatus}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                  <p><span className="text-gray-400 font-normal">Train:</span> {pnrResult.trainName}</p>
                  <p><span className="text-gray-400 font-normal">Date:</span> {pnrResult.journeyDate}</p>
                  <p><span className="text-gray-400 font-normal">From:</span> {pnrResult.from}</p>
                  <p><span className="text-gray-400 font-normal">To:</span> {pnrResult.to}</p>
                </div>

                <div className="pt-2 border-t border-orange-500/20">
                  <span className="text-[10px] text-gray-400 font-black uppercase block mb-1">Passenger Status:</span>
                  {pnrResult.passengers.map((ps: any, i: number) => (
                    <div key={i} className="flex justify-between text-gray-900 dark:text-white py-0.5 font-black">
                      <span>Passenger {ps.no}: {ps.bookingStatus}</span>
                      <span className="text-emerald-600">{ps.currentStatus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIRECT TICKET BOOKING & UPI PAYMENT MODAL */}
      {bookingVehicle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-[#FF6D00] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setBookingVehicle(null);
                setPaymentStep(false);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header Info */}
            <div className="border-b border-gray-200 dark:border-white/10 pb-3">
              <span className="text-[10px] font-black uppercase text-[#FF6D00] tracking-widest block">
                {paymentStep ? 'Step 2 of 2: Direct Online UPI Payment' : 'Step 1 of 2: Multi-Passenger & Seat Selection'}
              </span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                {bookingVehicle.name} ({bookingVehicle.vehicleNumber})
              </h2>
              <p className="text-xs text-gray-500 font-bold">
                {bookingVehicle.originCity} ({bookingVehicle.departureTime}) ➔ {bookingVehicle.destinationTirth} ({bookingVehicle.arrivalTime})
              </p>
            </div>

            {!paymentStep ? (
              /* STEP 1: MULTI-PASSENGER & SEAT FORM */
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {/* Select Travel Class */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Select Travel Class (श्रेणी)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingVehicle.seatClasses.map((sc, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedClass(sc)}
                        className={cn(
                          "p-2.5 rounded-xl border text-left text-xs font-black transition-all cursor-pointer flex items-center justify-between",
                          selectedClass?.className === sc.className
                            ? "bg-[#FF6D00] text-white border-transparent shadow-md"
                            : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                        )}
                      >
                        <span>{sc.className}</span>
                        <span>₹{sc.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-Passenger Details Entry */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase text-gray-500">
                      Passenger Details ({passengers.length} Yatri):
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPassenger}
                      className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-[#FF6D00] rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add Passenger
                    </button>
                  </div>

                  {passengers.map((p, idx) => (
                    <div key={p.id} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                          Passenger {idx + 1}
                        </span>
                        {passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePassenger(p.id)}
                            className="text-red-500 hover:text-red-600 p-1 rounded-md"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={p.name}
                          onChange={e => handleUpdatePassenger(p.id, 'name', e.target.value)}
                          placeholder="Full Name *"
                          className="px-3 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={p.age}
                            onChange={e => handleUpdatePassenger(p.id, 'age', e.target.value)}
                            placeholder="Age"
                            className="w-16 px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                          />
                          <select
                            value={p.gender}
                            onChange={e => handleUpdatePassenger(p.id, 'gender', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                        <select
                          value={p.berthPref}
                          onChange={e => handleUpdatePassenger(p.id, 'berthPref', e.target.value)}
                          className="px-2 py-1.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                        >
                          <option value="Lower Berth / Window">Lower Berth (Senior Citizens)</option>
                          <option value="Middle Berth">Middle Berth</option>
                          <option value="Upper Berth">Upper Berth</option>
                          <option value="Side Lower">Side Lower</option>
                          <option value="Window Seat">Window Seat</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Contact Phone */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Primary Contact Mobile (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    value={primaryPhone}
                    onChange={e => setPrimaryPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                  />
                </div>

                {/* Bus Interactive Seat Map Layout if Bus Selected */}
                {bookingVehicle.type === 'bus' && (
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-gray-700 dark:text-gray-300">
                      <span>Interactive Bus Seat Map (सीट चुनें):</span>
                      <span className="text-[#FF6D00]">{selectedBusSeats.length} Selected ({selectedBusSeats.join(', ')})</span>
                    </div>

                    <div className="grid grid-cols-6 gap-2 pt-1">
                      {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'L7', 'L8', 'L9', 'U7', 'U8', 'U9'].map(st => {
                        const isSelected = selectedBusSeats.includes(st);
                        const isBooked = st === 'L3' || st === 'U2';

                        return (
                          <button
                            type="button"
                            key={st}
                            disabled={isBooked}
                            onClick={() => handleToggleBusSeat(st)}
                            className={cn(
                              "py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer border text-center",
                              isBooked
                                ? "bg-red-500/20 text-red-500 border-red-500/30 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#FF6D00] text-white border-transparent shadow-md scale-105"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            )}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pure Jain Meal Guarantee Option */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                    Jain Dietary & Meal Preference (शुद्ध जैन आहार)
                  </label>
                  <select
                    value={jainFoodPref}
                    onChange={e => setJainFoodPref(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                  >
                    <option value="chovisi">☀️ 100% Pure Sunset Chovisi Meal (सूर्यास्त पूर्व चौविहार भोजन)</option>
                    <option value="navkarsi">☕ Pure Navkarsi Morning Thali (नवकारसी नाश्ता एवं भोजन)</option>
                    <option value="jain_no_onion">🌱 Jain No Garlic No Onion (बिना कंदमूल शुद्ध जैन)</option>
                  </select>
                </div>

                {/* Promo Code & Discount System */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Yatri Coupon / Promo Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Try JAIN10, SHIKHARJI, SENIOR"
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black uppercase text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase shrink-0 hover:scale-105 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {couponApplied.msg}
                    </p>
                  )}
                </div>

                {/* Price Calculation Summary */}
                <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                    <span>Base Fare ({passengers.length} Yatri × ₹{selectedClass?.price || 0}):</span>
                    <span>₹{passengers.length * (selectedClass?.price || 0)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
                      <span>Yatri Discount ({couponApplied.code}):</span>
                      <span>-₹{couponApplied.discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-orange-500/20 text-sm font-black text-gray-900 dark:text-white">
                    <span>Total Amount Payable:</span>
                    <span className="text-[#FF6D00] text-base">
                      ₹{Math.max(0, passengers.length * (selectedClass?.price || 0) - (couponApplied ? couponApplied.discount : 0))}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Direct UPI Payment</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* STEP 2: DIRECT ONLINE UPI PAYMENT MODAL */
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400 block">Total Amount to Pay</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      ₹{Math.max(0, passengers.length * (selectedClass?.price || 0) - (couponApplied ? couponApplied.discount : 0))}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                    🔒 256-Bit Encrypted Secure UPI
                  </span>
                </div>

                <label className="block text-[11px] font-black uppercase text-gray-500">Choose Online UPI Payment Method:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={cn(
                      "p-3 rounded-2xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2",
                      paymentMethod === 'gpay'
                        ? "bg-blue-600 text-white border-transparent shadow-md"
                        : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                    )}
                  >
                    <span>🔵 Google Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('phonepe')}
                    className={cn(
                      "p-3 rounded-2xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2",
                      paymentMethod === 'phonepe'
                        ? "bg-purple-600 text-white border-transparent shadow-md"
                        : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                    )}
                  >
                    <span>🟣 PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paytm')}
                    className={cn(
                      "p-3 rounded-2xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2",
                      paymentMethod === 'paytm'
                        ? "bg-sky-500 text-white border-transparent shadow-md"
                        : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                    )}
                  >
                    <span>🔷 Paytm UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={cn(
                      "p-3 rounded-2xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2",
                      paymentMethod === 'qr'
                        ? "bg-[#FF6D00] text-white border-transparent shadow-md"
                        : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                    )}
                  >
                    <QrCode size={16} />
                    <span>Scan QR Code</span>
                  </button>
                </div>

                {paymentMethod !== 'qr' && (
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Verify UPI Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiIdInput}
                      onChange={e => setUpiIdInput(e.target.value)}
                      placeholder="e.g. 9876543210@ybl or samil@okicici"
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-black text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {paymentMethod === 'qr' && (
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 text-center space-y-2">
                    <QrCode size={120} className="mx-auto text-gray-900 dark:text-white p-2 bg-white rounded-xl shadow-md" />
                    <p className="text-xs font-black text-gray-700 dark:text-gray-300">
                      Scan with GPay / PhonePe / Paytm / BHIM app
                    </p>
                    <span className="text-[10px] font-bold text-gray-500 block">UPI ID: samiljain@okicici</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStep(false)}
                    className="px-4 py-3 bg-gray-200 dark:bg-white/10 rounded-xl text-xs font-black uppercase text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleSimulateUpiPayment}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Verifying UPI Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Pay ₹{Math.max(0, passengers.length * (selectedClass?.price || 0) - (couponApplied ? couponApplied.discount : 0))} & Generate Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ISSUED OFFICIAL TICKET E-PASS MODAL */}
      {viewTicketModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-center relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewTicketModal(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Official Booking Confirmed
              </span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mt-2">
                PNR: {viewTicketModal.pnr}
              </h2>
              <p className="text-xs text-gray-500 font-bold">{viewTicketModal.vehicleName} ({viewTicketModal.vehicleNumber})</p>
            </div>

            {/* Ticket Details Box */}
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 text-left text-xs font-bold space-y-2">
              <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-1.5">
                <span className="text-gray-500">Route:</span>
                <span className="text-gray-900 dark:text-white font-black">{viewTicketModal.originCity} ➔ {viewTicketModal.destinationTirth}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-1.5">
                <span className="text-gray-500">Timing & Date:</span>
                <span className="text-gray-900 dark:text-white font-black">{viewTicketModal.travelDate} ({viewTicketModal.departureTime} - {viewTicketModal.arrivalTime})</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-1.5">
                <span className="text-gray-500">Class & Seats:</span>
                <span className="text-[#FF6D00] font-black">{viewTicketModal.className} ({viewTicketModal.seatsAllocated})</span>
              </div>
              <div className="border-b border-gray-200 dark:border-white/10 pb-1.5 space-y-1">
                <span className="text-gray-500 block">Passengers ({viewTicketModal.passengers.length}):</span>
                {viewTicketModal.passengers.map((p, i) => (
                  <p key={i} className="text-gray-900 dark:text-white font-black">
                    • {p.name} ({p.age}y, {p.gender}) - <span className="text-gray-500">{p.berthPref}</span>
                  </p>
                ))}
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-1.5">
                <span className="text-gray-500">Jain Meal Voucher:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{viewTicketModal.foodService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid via UPI:</span>
                <span className="text-gray-900 dark:text-white font-black">₹{viewTicketModal.totalAmount} ({viewTicketModal.paymentMethod})</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
              <QrCode size={64} className="text-gray-800 dark:text-gray-200 shrink-0" />
              <div className="text-left text-[10px] font-bold text-gray-500">
                <p>Present this Digital Boarding Pass & QR Code during train/bus boarding.</p>
                <p className="text-emerald-600 font-black mt-1">Txn Ref: {viewTicketModal.txnId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShareWhatsAppTicket(viewTicketModal)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Share2 size={16} />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESTINATION DHARAMSHALA POPUP MODAL */}
      {viewDharamshalaDest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-blue-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewDharamshalaDest(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-white/10">
              <Hotel size={22} className="text-blue-500" />
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Verified Jain Dharamshalas at {viewDharamshalaDest}
                </h3>
                <p className="text-xs text-gray-500 font-bold">100% Pure Sunset Chovisi Bhojanalay & AC Rooms</p>
              </div>
            </div>

            <div className="space-y-3">
              {getDestinationDharamshalas(viewDharamshalaDest).map(ds => (
                <div key={ds.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 dark:text-white">{ds.name}</span>
                    <span className="text-xs font-black text-emerald-600">⭐ {ds.rating}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500">{ds.address}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {ds.hasACRooms && (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-black rounded-md">
                        ❄️ AC Deluxe Rooms
                      </span>
                    )}
                    {ds.hasChovisiBhojan && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-md">
                        ☀️ 100% Sunset Chovisi
                      </span>
                    )}
                    <a
                      href={`tel:${ds.contactNo}`}
                      className="ml-auto text-xs font-black text-[#FF6D00] hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} /> {ds.contactNo}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/dharamshalas')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase cursor-pointer"
            >
              Explore Full All-India Dharamshala Directory
            </button>
          </div>
        </div>
      )}

      {/* 24x7 HELPLINE MODAL */}
      {helplineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-red-500 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setHelplineModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-white/10">
              <Phone size={22} className="text-red-500" />
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white">24x7 Jain Yatri Sahayata Kendra</h3>
                <p className="text-xs text-gray-500 font-bold">Emergency travel, meal & medical assistance</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-bold">
              <a
                href="tel:18001235246"
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 flex items-center justify-between cursor-pointer"
              >
                <span>☎️ Toll-Free Yatri Sahayata</span>
                <span className="font-black">1800-123-JAIN</span>
              </a>

              <a
                href="tel:139"
                className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20 flex items-center justify-between cursor-pointer"
              >
                <span>🚆 Railway Emergency Helpline</span>
                <span className="font-black">139</span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=919826012345&text=Help%20needed%20for%20Jain%20Yatra"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 flex items-center justify-between cursor-pointer"
              >
                <span>💬 WhatsApp Sahayata Desk</span>
                <span className="font-black">+91 98260 12345</span>
              </a>
            </div>

            <button
              onClick={() => setHelplineModal(false)}
              className="w-full py-2.5 bg-gray-100 dark:bg-white/10 rounded-xl font-black text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* GROUP SANGH SEAT RESERVATION MODAL */}
      {groupBookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-[#FF6D00] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setGroupBookingModal(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-black uppercase text-[#FF6D00] tracking-widest block">Group Sangh Seat Reservation</span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{groupBookingModal.title}</h2>
              <p className="text-xs text-gray-500 font-bold">{groupBookingModal.organizer}</p>
            </div>

            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs font-bold space-y-1">
              <p><span className="text-gray-500">Destination:</span> {groupBookingModal.destination}</p>
              <p><span className="text-gray-500">Start Date:</span> {groupBookingModal.startDate} ({groupBookingModal.durationDays} Days)</p>
              <p><span className="text-gray-500">Charges:</span> ₹{groupBookingModal.pricePerYatrik} / Yatrik (Includes Dharamshala Stay + 100% Sunset Chovisi)</p>
            </div>

            <button
              onClick={() => {
                alert(lang === 'en' ? 'Seat request received! Organizer will contact you.' : 'सीट बुकिंग अनुरोध प्राप्त हुआ! आयोजक आपसे संपर्क करेंगे।');
                setGroupBookingModal(null);
              }}
              className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
            >
              Confirm Sangh Booking (₹{groupBookingModal.pricePerYatrik})
            </button>
          </div>
        </div>
      )}

      {/* ORGANIZER REGISTRATION MODAL */}
      {showOrganizerModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border border-orange-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Compass size={18} className="text-[#FF6D00]" />
                <span>Register New Sangh Yatra</span>
              </h3>
              <button onClick={() => setShowOrganizerModal(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              Jain trusts and Sanghavipatys can list upcoming pilgrim tours here. Contact developer support on Instagram (<span className="text-[#FF6D00] font-black">@_officialsamiljain_</span>) for instant verification.
            </p>

            <a
              href="https://instagram.com/_officialsamiljain_"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#FF6D00] hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <span>Contact Organizer Desk on Instagram</span>
            </a>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-[#FF6D00]" />
                <span>About Jain Yatra Sewa Portal</span>
              </h3>
              <button onClick={() => setHelpOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed font-bold">
              <p>• Search IRCTC trains and AC sleeper buses for all Indian cities and Jain Tirths.</p>
              <p>• Add multiple passengers, select berth preferences (Lower Berth for senior citizens), and apply promo discount coupons.</p>
              <p>• Pay instantly using Google Pay, PhonePe, Paytm, or BHIM QR code.</p>
              <p>• Receive digital E-Pass ticket with QR code, WhatsApp 1-click share, and 100% Pure Sunset Chovisi meal voucher.</p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-xl font-black text-xs uppercase tracking-wider"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
