export interface SeatClassInfo {
  className: string; // e.g. "Sleeper (SL)", "3AC (3A)", "2AC (2A)", "1AC (1A)", "AC Sleeper", "Volvo Seater"
  classCode: 'SL' | '3A' | '2A' | '1A' | 'AC_SLEEPER' | 'VOLVO_SEATER' | 'NON_AC_SLEEPER';
  availableSeats: number;
  totalSeats: number;
  status: 'AVAILABLE' | 'WAITLIST' | 'TATKAL';
  price: number;
}

export interface TransportVehicle {
  id: string;
  type: 'train' | 'bus';
  vehicleNumber: string; // e.g., "12802" or "MP09-TA-5588"
  name: string; // e.g., "Purushottam Express" or "Hans Travels AC Volvo Sleeper"
  operatorOrRail: string; // e.g., "Indian Railways (IRCTC)" or "Shree Mahavir Travels"
  originCity: string;
  originStation: string;
  destinationTirth: string;
  destinationStation: string;
  departureTime: string; // e.g., "22:25"
  arrivalTime: string; // e.g., "11:40"
  duration: string; // e.g., "13h 15m"
  runsOn: string[]; // e.g., ["Mon", "Wed", "Fri", "Sun"] or ["Daily"]
  foodService: string; // e.g., "100% Pure Jain Chovisi Meal Available"
  rating: number;
  seatClasses: SeatClassInfo[];
}

export interface TirthDestination {
  id: string;
  nameEn: string;
  nameHi: string;
  state: string;
  mainStationCode: string;
  nearestAirport: string;
  topAttraction: string;
  dharamshalaCount: number;
  type?: 'tirth' | 'city';
}

export const ALL_INDIA_ORIGIN_CITIES = [
  { id: 'indore', nameEn: 'Indore', nameHi: 'इंदौर' },
  { id: 'delhi', nameEn: 'Delhi / NCR', nameHi: 'दिल्ली / एनसीआर' },
  { id: 'mumbai', nameEn: 'Mumbai', nameHi: 'मुंबई' },
  { id: 'bhopal', nameEn: 'Bhopal', nameHi: 'भोपाल' },
  { id: 'ahmedabad', nameEn: 'Ahmedabad', nameHi: 'अहमदाबाद' },
  { id: 'surat', nameEn: 'Surat', nameHi: 'सूरत' },
  { id: 'jaipur', nameEn: 'Jaipur', nameHi: 'जयपुर' },
  { id: 'kolkata', nameEn: 'Kolkata', nameHi: 'कोलकाता' },
  { id: 'pune', nameEn: 'Pune', nameHi: 'पुणे' },
  { id: 'bengaluru', nameEn: 'Bengaluru', nameHi: 'बेंगलुरु' },
  { id: 'hyderabad', nameEn: 'Hyderabad', nameHi: 'हैदराबाद' },
  { id: 'chennai', nameEn: 'Chennai', nameHi: 'चेन्नई' },
  { id: 'kanpur', nameEn: 'Kanpur', nameHi: 'कानपुर' },
  { id: 'varanasi', nameEn: 'Varanasi', nameHi: 'वाराणसी' },
  { id: 'agra', nameEn: 'Agra', nameHi: 'आगरा' },
  { id: 'gwalior', nameEn: 'Gwalior', nameHi: 'ग्वालियर' },
  { id: 'jabalpur', nameEn: 'Jabalpur', nameHi: 'जबलपुर' },
  { id: 'sagar', nameEn: 'Sagar', nameHi: 'सागर (म.प्र.)' },
  { id: 'ujain', nameEn: 'Ujjain', nameHi: 'उज्जैन' },
  { id: 'vadodara', nameEn: 'Vadodara', nameHi: 'वडोदरा' },
  { id: 'rajkot', nameEn: 'Rajkot', nameHi: 'राजकोट' },
  { id: 'nagpur', nameEn: 'Nagpur', nameHi: 'नागपुर' },
  { id: 'raipur', nameEn: 'Raipur', nameHi: 'रायपुर' },
  { id: 'patna', nameEn: 'Patna', nameHi: 'पटना' },
  { id: 'ranchi', nameEn: 'Ranchi', nameHi: 'राँची' },
  { id: 'kota', nameEn: 'Kota', nameHi: 'कोटा' },
  { id: 'udaipur', nameEn: 'Udaipur', nameHi: 'उदयपुर' },
  { id: 'lucknow', nameEn: 'Lucknow', nameHi: 'लखनऊ' },
];

export const MAJOR_DESTINATION_CITIES: TirthDestination[] = [
  { id: 'mumbai_city', nameEn: 'Mumbai', nameHi: 'मुंबई', state: 'Maharashtra', mainStationCode: 'BCT / BDTS / CSTM', nearestAirport: 'BOM', topAttraction: 'Financial Hub, Marine Drive & Jain Derasars', dharamshalaCount: 15, type: 'city' },
  { id: 'delhi_city', nameEn: 'Delhi / NCR', nameHi: 'दिल्ली / एनसीआर', state: 'Delhi', mainStationCode: 'NDLS / DLI / NZM', nearestAirport: 'DEL', topAttraction: 'Lal Mandir Chandni Chowk & Capital Hub', dharamshalaCount: 18, type: 'city' },
  { id: 'indore_city', nameEn: 'Indore', nameHi: 'इंदौर', state: 'Madhya Pradesh', mainStationCode: 'INDB / LMNR', nearestAirport: 'IDR', topAttraction: 'Kanch Mandir, Bada Ganpati & Cleanest City', dharamshalaCount: 22, type: 'city' },
  { id: 'ahmedabad_city', nameEn: 'Ahmedabad', nameHi: 'अहमदाबाद', state: 'Gujarat', mainStationCode: 'ADI / GNC', nearestAirport: 'AMD', topAttraction: 'Hutheesing Jain Temple & Sabarmati Ashram', dharamshalaCount: 25, type: 'city' },
  { id: 'jaipur_city', nameEn: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', mainStationCode: 'JP / DPA', nearestAirport: 'JAI', topAttraction: 'Pink City, Amer Fort & Sanganer Derasar', dharamshalaCount: 20, type: 'city' },
  { id: 'bhopal_city', nameEn: 'Bhopal', nameHi: 'भोपाल', state: 'Madhya Pradesh', mainStationCode: 'BPL / RKMP', nearestAirport: 'BHO', topAttraction: 'City of Lakes & Manua Bhan Tekri Jain Temple', dharamshalaCount: 12, type: 'city' },
  { id: 'surat_city', nameEn: 'Surat', nameHi: 'सूरत', state: 'Gujarat', mainStationCode: 'ST / UDN', nearestAirport: 'STV', topAttraction: 'Diamond City & Heritage Jain Derasars', dharamshalaCount: 18, type: 'city' },
  { id: 'pune_city', nameEn: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', mainStationCode: 'PUNE / CMF', nearestAirport: 'PNQ', topAttraction: 'Cultural Capital & Katraj Jain Temple', dharamshalaCount: 14, type: 'city' },
  { id: 'kolkata_city', nameEn: 'Kolkata', nameHi: 'कोलकाता', state: 'West Bengal', mainStationCode: 'HWH / SDAH / KOAA', nearestAirport: 'CCU', topAttraction: 'Pareshnath Jain Temple & Cultural Heritage', dharamshalaCount: 10, type: 'city' },
  { id: 'bengaluru_city', nameEn: 'Bengaluru', nameHi: 'बेंगलुरु', state: 'Karnataka', mainStationCode: 'SBC / YPR', nearestAirport: 'BLR', topAttraction: 'Silicon Valley & Chamrajpet Jain Mandir', dharamshalaCount: 8, type: 'city' },
  { id: 'hyderabad_city', nameEn: 'Hyderabad', nameHi: 'हैदराबाद', state: 'Telangana', mainStationCode: 'HYB / SC', nearestAirport: 'HYD', topAttraction: 'Charminar & Kulpakji Tirth nearby', dharamshalaCount: 9, type: 'city' },
  { id: 'varanasi_city', nameEn: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', mainStationCode: 'BSB / DDU', nearestAirport: 'VNS', topAttraction: 'Birthplace of 4 Tirthankars (Suparshvanath, Parshvanath, Shreyansnath, Bhashkar)', dharamshalaCount: 15, type: 'city' },
  { id: 'udaipur_city', nameEn: 'Udaipur', nameHi: 'उदयपुर', state: 'Rajasthan', mainStationCode: 'UDZ', nearestAirport: 'UDR', topAttraction: 'City of Lakes & Ranakpur Link', dharamshalaCount: 16, type: 'city' },
  { id: 'kota_city', nameEn: 'Kota', nameHi: 'कोटा', state: 'Rajasthan', mainStationCode: 'KOTA', nearestAirport: 'JAI', topAttraction: 'Chambal Riverfront & Jain Mandir Complex', dharamshalaCount: 8, type: 'city' },
];

export const JAIN_TIRTH_DESTINATIONS: TirthDestination[] = [
  {
    id: 'shikharji',
    nameEn: 'Sammed Shikharji (Parasnath)',
    nameHi: 'सम्मेद शिखरजी (पारसनाथ - झारखंड)',
    state: 'Jharkhand',
    mainStationCode: 'Parasnath (PNME) / Koderma / Gaya',
    nearestAirport: 'Ranchi (IXR) / Deoghar (DGH)',
    topAttraction: '20 Tirthankar Moksha Bhumi - 27 Km Tonk Parikrama',
    dharamshalaCount: 48
  },
  {
    id: 'palitana',
    nameEn: 'Shatrunjay Palitana',
    nameHi: 'शत्रुंजय पालिताना (गुजरात)',
    state: 'Gujarat',
    mainStationCode: 'Palitana (PIT) / Bhavnagar (BVC)',
    nearestAirport: 'Bhavnagar (BHU) / Ahmedabad (AMD)',
    topAttraction: '3500+ Ancient Temples Giri Raj Vandana',
    dharamshalaCount: 62
  },
  {
    id: 'girnarji',
    nameEn: 'Girnarji Siddha Kshetra',
    nameHi: 'गिरनारजी सिद्ध क्षेत्र (जूनागढ़)',
    state: 'Gujarat',
    mainStationCode: 'Junagadh (JND) / Rajkot (RJT)',
    nearestAirport: 'Rajkot (RJT) / Keshod',
    topAttraction: 'Bhagwan Neminath 5th Tonk Nirvana Bhumi',
    dharamshalaCount: 24
  },
  {
    id: 'pawapuri',
    nameEn: 'Pawapuri & Champapuri',
    nameHi: 'पावापुरी जल मंदिर एवं चम्पापुरी',
    state: 'Bihar',
    mainStationCode: 'Gaya (GAYA) / Patna (PNBE) / Bakhtiyarpur',
    nearestAirport: 'Gaya (GAY) / Patna (PAT)',
    topAttraction: 'Bhagwan Mahavir Nirvana Bhumi Jal Mandir',
    dharamshalaCount: 18
  },
  {
    id: 'hastinapur',
    nameEn: 'Hastinapur Mahateerth',
    nameHi: 'हस्तिनापुर महातीर्थ (मेरठ, उ.प्र.)',
    state: 'Uttar Pradesh',
    mainStationCode: 'Meerut City (MTC) / Delhi (NDLS)',
    nearestAirport: 'Delhi (DEL)',
    topAttraction: 'Jambudweep, Bada Mandir & Kailash Parvat',
    dharamshalaCount: 22
  },
  {
    id: 'kundalpur',
    nameEn: 'Kundalpur Siddha Kshetra',
    nameHi: 'कुंडलपुर सिद्ध क्षेत्र (दमोह, म.प्र.)',
    state: 'Madhya Pradesh',
    mainStationCode: 'Damoh (DMO) / Katni (KTE) / Patharia',
    nearestAirport: 'Jabalpur (JLR)',
    topAttraction: 'Bade Baba Bhagwan Adinath 15 Feet Idol',
    dharamshalaCount: 35
  },
  {
    id: 'sonagiri',
    nameEn: 'Sonagiri Siddha Kshetra',
    nameHi: 'सोनागिरि सिद्ध क्षेत्र (दतिया, म.प्र.)',
    state: 'Madhya Pradesh',
    mainStationCode: 'Sonagir (SOR) / Datia / Gwalior (GWL)',
    nearestAirport: 'Gwalior (GWL)',
    topAttraction: '77 White Marble Temples Hill & Chandraprabhu Temple',
    dharamshalaCount: 28
  },
  {
    id: 'mahavirji',
    nameEn: 'Shri Mahavirji Atishay Kshetra',
    nameHi: 'श्री महावीरजी अतिशय क्षेत्र (राजस्थान)',
    state: 'Rajasthan',
    mainStationCode: 'Shri Mahabirji (SMBJ) / Hindaun City (HAN)',
    nearestAirport: 'Jaipur (JAI)',
    topAttraction: 'Miraculous Red Coral Idol of Bhagwan Mahavira',
    dharamshalaCount: 40
  },
  {
    id: 'shravanabelagola',
    nameEn: 'Shravanabelagola Gommateshwara',
    nameHi: 'श्रवणबेलगोला गोम्मटेश्वर (कर्नाटक)',
    state: 'Karnataka',
    mainStationCode: 'Shravanabelagola (SBGA) / Hassan (HAS)',
    nearestAirport: 'Bengaluru (BLR) / Mysuru (MYQ)',
    topAttraction: '57 Feet Monolithic Bhagwan Bahubali Statue',
    dharamshalaCount: 16
  },
  {
    id: 'ranakpur_mountabu',
    nameEn: 'Ranakpur & Mount Abu Dilwara',
    nameHi: 'राणाकपुर एवं माउंट आबू दिलवाड़ा (राजस्थान)',
    state: 'Rajasthan',
    mainStationCode: 'Falna (FA) / Abu Road (ABR)',
    nearestAirport: 'Udaipur (UDR)',
    topAttraction: '1444 Carved Marble Pillars & Dilwara Temples',
    dharamshalaCount: 30
  }
];

export const ALL_INDIA_VEHICLES: TransportVehicle[] = [
  // --- PARASNATH / SHIKHARJI ROUTES ---
  {
    id: 'train_12802',
    type: 'train',
    vehicleNumber: '12802',
    name: 'Purushottam Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Delhi / NCR',
    originStation: 'New Delhi (NDLS)',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Parasnath (PNME)',
    departureTime: '22:25',
    arrivalTime: '11:40',
    duration: '13h 15m',
    runsOn: ['Daily'],
    foodService: '100% Pure Jain Chovisi Food Pantry Available',
    rating: 4.8,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 58, totalSeats: 120, status: 'AVAILABLE', price: 520 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 24, totalSeats: 64, status: 'AVAILABLE', price: 1350 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 8, totalSeats: 32, status: 'AVAILABLE', price: 1950 },
      { className: '1AC (1A)', classCode: '1A', availableSeats: 2, totalSeats: 16, status: 'AVAILABLE', price: 3100 },
    ]
  },
  {
    id: 'train_22911',
    type: 'train',
    vehicleNumber: '22911',
    name: 'Shipra Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Indore',
    originStation: 'Indore Junction (INDB)',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Parasnath (PNME)',
    departureTime: '23:30',
    arrivalTime: '21:15',
    duration: '21h 45m',
    runsOn: ['Tue', 'Thu', 'Sat'],
    foodService: 'Jain Meal Special Order Available',
    rating: 4.7,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 42, totalSeats: 110, status: 'AVAILABLE', price: 620 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 18, totalSeats: 56, status: 'AVAILABLE', price: 1580 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 6, totalSeats: 28, status: 'AVAILABLE', price: 2280 },
    ]
  },
  {
    id: 'train_12312',
    type: 'train',
    vehicleNumber: '12312',
    name: 'Netaji Express (Kalka Mail)',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Kanpur',
    originStation: 'Kanpur Central (CNB)',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Parasnath (PNME)',
    departureTime: '13:50',
    arrivalTime: '02:15',
    duration: '12h 25m',
    runsOn: ['Daily'],
    foodService: 'E-Catering Pure Jain Thali',
    rating: 4.6,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 34, totalSeats: 90, status: 'AVAILABLE', price: 480 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 14, totalSeats: 48, status: 'AVAILABLE', price: 1240 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 5, totalSeats: 24, status: 'AVAILABLE', price: 1780 },
    ]
  },
  {
    id: 'train_12810',
    type: 'train',
    vehicleNumber: '12810',
    name: 'Howrah - Mumbai Mail',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Kolkata',
    originStation: 'Howrah Junction (HWH)',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Parasnath (PNME)',
    departureTime: '20:05',
    arrivalTime: '01:25',
    duration: '5h 20m',
    runsOn: ['Daily'],
    foodService: 'Jain Snacks & Tea Service',
    rating: 4.9,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 72, totalSeats: 120, status: 'AVAILABLE', price: 290 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 36, totalSeats: 72, status: 'AVAILABLE', price: 760 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 12, totalSeats: 32, status: 'AVAILABLE', price: 1120 },
    ]
  },
  {
    id: 'bus_hans_shikhar',
    type: 'bus',
    vehicleNumber: 'MP-09-FA-8899',
    name: 'Hans Travels Multi-Axle AC Sleeper',
    operatorOrRail: 'Hans Travels (Jain Special)',
    originCity: 'Indore',
    originStation: 'Navlakha / AICTSL Bus Stand',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Madhuban Bus Stand (Shikharji Base)',
    departureTime: '17:00',
    arrivalTime: '14:30',
    duration: '21h 30m',
    runsOn: ['Daily'],
    foodService: '100% Sunset Chovisi Halts at Pure Jain Bhojanalay',
    rating: 4.9,
    seatClasses: [
      { className: 'AC Sleeper (Upper/Lower)', classCode: 'AC_SLEEPER', availableSeats: 18, totalSeats: 36, status: 'AVAILABLE', price: 1450 },
      { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 12, totalSeats: 24, status: 'AVAILABLE', price: 1150 },
    ]
  },
  {
    id: 'bus_kundu_shikhar',
    type: 'bus',
    vehicleNumber: 'WB-02-CB-1122',
    name: 'Kundu Special Tirth Express Bus',
    operatorOrRail: 'Kundu Tirth Yatra Bureau',
    originCity: 'Kolkata',
    originStation: 'Esplanade Bus Terminus',
    destinationTirth: 'Sammed Shikharji (Parasnath)',
    destinationStation: 'Madhuban Bus Stand',
    departureTime: '21:30',
    arrivalTime: '05:30',
    duration: '8h 00m',
    runsOn: ['Daily'],
    foodService: 'Free Navkarsi Morning Tea & Chovisi Packets',
    rating: 4.8,
    seatClasses: [
      { className: 'AC Sleeper (2+1)', classCode: 'AC_SLEEPER', availableSeats: 16, totalSeats: 30, status: 'AVAILABLE', price: 850 },
      { className: 'Non-AC Sleeper', classCode: 'NON_AC_SLEEPER', availableSeats: 10, totalSeats: 20, status: 'AVAILABLE', price: 650 },
    ]
  },

  // --- PALITana & SHATRUNJAY ROUTES ---
  {
    id: 'train_12972',
    type: 'train',
    vehicleNumber: '12972',
    name: 'Bhavnagar Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Mumbai',
    originStation: 'Bandra Terminus (BDTS)',
    destinationTirth: 'Shatrunjay Palitana',
    destinationStation: 'Palitana (PIT) / Bhavnagar (BVC)',
    departureTime: '19:25',
    arrivalTime: '07:10',
    duration: '11h 45m',
    runsOn: ['Daily'],
    foodService: 'Jain Food Available at Ahmedabad / Vadodara Halt',
    rating: 4.8,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 52, totalSeats: 120, status: 'AVAILABLE', price: 440 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 22, totalSeats: 64, status: 'AVAILABLE', price: 1180 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 9, totalSeats: 32, status: 'AVAILABLE', price: 1680 },
    ]
  },
  {
    id: 'train_19217',
    type: 'train',
    vehicleNumber: '19217',
    name: 'Shatrunjay Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Surat',
    originStation: 'Surat Station (ST)',
    destinationTirth: 'Shatrunjay Palitana',
    destinationStation: 'Palitana Station (PIT)',
    departureTime: '06:10',
    arrivalTime: '14:20',
    duration: '8h 10m',
    runsOn: ['Daily'],
    foodService: 'Navkarsi Breakfast & Jain Lunch Pack',
    rating: 4.7,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 64, totalSeats: 110, status: 'AVAILABLE', price: 310 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 28, totalSeats: 56, status: 'AVAILABLE', price: 820 },
    ]
  },
  {
    id: 'bus_mahavir_palitana',
    type: 'bus',
    vehicleNumber: 'GJ-01-XX-9900',
    name: 'Shree Mahavir Travels Scania Multi-Axle AC Sleeper',
    operatorOrRail: 'Shree Mahavir Travels',
    originCity: 'Ahmedabad',
    originStation: 'Paldi / Iscon Circle',
    destinationTirth: 'Shatrunjay Palitana',
    destinationStation: 'Palitana Taleti Bus Stand',
    departureTime: '22:00',
    arrivalTime: '03:30',
    duration: '5h 30m',
    runsOn: ['Daily'],
    foodService: 'Bottled Mineral Water & Jain Snacks',
    rating: 4.9,
    seatClasses: [
      { className: 'AC Sleeper (2+1)', classCode: 'AC_SLEEPER', availableSeats: 20, totalSeats: 36, status: 'AVAILABLE', price: 650 },
      { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 15, totalSeats: 24, status: 'AVAILABLE', price: 450 },
    ]
  },

  // --- GIRNARJI ROUTES ---
  {
    id: 'train_19221',
    type: 'train',
    vehicleNumber: '19221',
    name: 'Somnath Intercity Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Ahmedabad',
    originStation: 'Ahmedabad Junction (ADI)',
    destinationTirth: 'Girnarji Siddha Kshetra',
    destinationStation: 'Junagadh Junction (JND)',
    departureTime: '22:10',
    arrivalTime: '05:45',
    duration: '7h 35m',
    runsOn: ['Daily'],
    foodService: 'Jain Dinner Options at Viramgam Junction',
    rating: 4.7,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 48, totalSeats: 100, status: 'AVAILABLE', price: 360 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 20, totalSeats: 48, status: 'AVAILABLE', price: 920 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 7, totalSeats: 24, status: 'AVAILABLE', price: 1320 },
    ]
  },
  {
    id: 'bus_eagle_girnar',
    type: 'bus',
    vehicleNumber: 'GJ-03-BT-7744',
    name: 'Eagle Executive Bharat Benz AC Sleeper',
    operatorOrRail: 'Eagle Connect Travels',
    originCity: 'Surat',
    originStation: 'Kadaodara / Sahara Darwaja',
    destinationTirth: 'Girnarji Siddha Kshetra',
    destinationStation: 'Junagadh Girnar Taleti Stop',
    departureTime: '20:30',
    arrivalTime: '06:00',
    duration: '9h 30m',
    runsOn: ['Daily'],
    foodService: 'Pure Jain Halt at Jetpur Highway',
    rating: 4.8,
    seatClasses: [
      { className: 'AC Sleeper', classCode: 'AC_SLEEPER', availableSeats: 14, totalSeats: 32, status: 'AVAILABLE', price: 980 },
    ]
  },

  // --- PAWAPURI & CHAMPAPURI ROUTES ---
  {
    id: 'train_12295',
    type: 'train',
    vehicleNumber: '12295',
    name: 'Sanghamitra Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Bengaluru',
    originStation: 'KSR Bengaluru (SBC)',
    destinationTirth: 'Pawapuri & Champapuri',
    destinationStation: 'Gaya Junction (GAYA) / Patna (PNBE)',
    departureTime: '09:00',
    arrivalTime: '22:10',
    duration: '37h 10m',
    runsOn: ['Daily'],
    foodService: 'Pure Jain Bhojan Special Counter',
    rating: 4.6,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 38, totalSeats: 120, status: 'AVAILABLE', price: 820 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 16, totalSeats: 64, status: 'AVAILABLE', price: 2150 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 4, totalSeats: 32, status: 'AVAILABLE', price: 3100 },
    ]
  },
  {
    id: 'train_15018',
    type: 'train',
    vehicleNumber: '15018',
    name: 'Kashi Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Varanasi',
    originStation: 'Varanasi Junction (BSB)',
    destinationTirth: 'Pawapuri & Champapuri',
    destinationStation: 'Gaya Junction (GAYA)',
    departureTime: '04:30',
    arrivalTime: '09:15',
    duration: '4h 45m',
    runsOn: ['Daily'],
    foodService: 'Morning Pure Navkarsi Pantry',
    rating: 4.5,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 80, totalSeats: 120, status: 'AVAILABLE', price: 210 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 32, totalSeats: 64, status: 'AVAILABLE', price: 580 },
    ]
  },

  // --- KUNDALPUR & SONAGIRI ROUTES ---
  {
    id: 'train_22163',
    type: 'train',
    vehicleNumber: '22163',
    name: 'Mahamana Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Bhopal',
    originStation: 'Bhopal Junction (BPL)',
    destinationTirth: 'Kundalpur Siddha Kshetra',
    destinationStation: 'Damoh Station (DMO)',
    departureTime: '06:30',
    arrivalTime: '11:15',
    duration: '4h 45m',
    runsOn: ['Daily'],
    foodService: 'Jain Breakfast Pack Available',
    rating: 4.9,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 65, totalSeats: 120, status: 'AVAILABLE', price: 220 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 28, totalSeats: 64, status: 'AVAILABLE', price: 590 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 10, totalSeats: 32, status: 'AVAILABLE', price: 840 },
    ]
  },
  {
    id: 'train_12197',
    type: 'train',
    vehicleNumber: '12197',
    name: 'Bhopal - Gwalior Intercity',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Bhopal',
    originStation: 'Rani Kamlapati (RKMP)',
    destinationTirth: 'Sonagiri Siddha Kshetra',
    destinationStation: 'Sonagir Station (SOR)',
    departureTime: '15:15',
    arrivalTime: '19:40',
    duration: '4h 25m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    foodService: 'Jain Snacks Onboard',
    rating: 4.8,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 70, totalSeats: 120, status: 'AVAILABLE', price: 195 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 30, totalSeats: 64, status: 'AVAILABLE', price: 520 },
    ]
  },

  // --- SHRI MAHAVIRJI & HASTINAPUR & MOUNT ABU ROUTES ---
  {
    id: 'train_12963',
    type: 'train',
    vehicleNumber: '12963',
    name: 'Mewar Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Delhi / NCR',
    originStation: 'Hazrat Nizamuddin (NZM)',
    destinationTirth: 'Shri Mahavirji Atishay Kshetra',
    destinationStation: 'Shri Mahabirji (SMBJ)',
    departureTime: '18:25',
    arrivalTime: '22:10',
    duration: '3h 45m',
    runsOn: ['Daily'],
    foodService: 'Jain Sunset Dinner Options at Mathura',
    rating: 4.9,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 85, totalSeats: 120, status: 'AVAILABLE', price: 240 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 40, totalSeats: 64, status: 'AVAILABLE', price: 620 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 15, totalSeats: 32, status: 'AVAILABLE', price: 880 },
    ]
  },
  {
    id: 'train_12916',
    type: 'train',
    vehicleNumber: '12916',
    name: 'Ashram Superfast Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Jaipur',
    originStation: 'Jaipur Junction (JP)',
    destinationTirth: 'Ranakpur & Mount Abu Dilwara',
    destinationStation: 'Falna (FA) / Abu Road (ABR)',
    departureTime: '20:25',
    arrivalTime: '03:15',
    duration: '6h 50m',
    runsOn: ['Daily'],
    foodService: 'Pure Filtered Jain Meal Counter',
    rating: 4.8,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 55, totalSeats: 110, status: 'AVAILABLE', price: 340 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 25, totalSeats: 56, status: 'AVAILABLE', price: 890 },
    ]
  },
  {
    id: 'train_16579',
    type: 'train',
    vehicleNumber: '16579',
    name: 'Gommateshwara Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Bengaluru',
    originStation: 'KSR Bengaluru (SBC)',
    destinationTirth: 'Shravanabelagola Gommateshwara',
    destinationStation: 'Shravanabelagola (SBGA)',
    departureTime: '07:00',
    arrivalTime: '09:20',
    duration: '2h 20m',
    runsOn: ['Daily'],
    foodService: 'Jain South Indian Breakfast',
    rating: 4.9,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 90, totalSeats: 120, status: 'AVAILABLE', price: 140 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 45, totalSeats: 64, status: 'AVAILABLE', price: 420 },
    ]
  },
  {
    id: 'bus_royal_hastinapur',
    type: 'bus',
    vehicleNumber: 'UP-15-BT-4455',
    name: 'Royal Jain Yatra AC Bus',
    operatorOrRail: 'Royal Jain Express Services',
    originCity: 'Delhi / NCR',
    originStation: 'Anand Vihar ISBT',
    destinationTirth: 'Hastinapur Mahateerth',
    destinationStation: 'Hastinapur Bada Mandir Bus Stand',
    departureTime: '06:30',
    arrivalTime: '09:30',
    duration: '3h 00m',
    runsOn: ['Daily'],
    foodService: 'Morning Pure Navkarsi Halt at Highway Dhaba',
    rating: 4.8,
    seatClasses: [
      { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 22, totalSeats: 40, status: 'AVAILABLE', price: 350 },
    ]
  },

  // --- CITY TO CITY TRAVEL ROUTES (शहर से शहर यात्रा) ---
  // Indore -> Mumbai
  {
    id: 'train_12962',
    type: 'train',
    vehicleNumber: '12962',
    name: 'Avantika Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Indore',
    originStation: 'Indore Junction (INDB)',
    destinationTirth: 'Mumbai',
    destinationStation: 'Mumbai Central (MMCT)',
    departureTime: '17:40',
    arrivalTime: '06:40',
    duration: '13h 00m',
    runsOn: ['Daily'],
    foodService: '100% Pure Jain Dinner & Navkarsi Breakfast Pantry',
    rating: 4.9,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 64, totalSeats: 120, status: 'AVAILABLE', price: 420 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 32, totalSeats: 64, status: 'AVAILABLE', price: 1120 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 12, totalSeats: 32, status: 'AVAILABLE', price: 1610 },
      { className: '1AC (1A)', classCode: '1A', availableSeats: 4, totalSeats: 16, status: 'AVAILABLE', price: 2720 },
    ]
  },
  {
    id: 'bus_hans_ind_mumbai',
    type: 'bus',
    vehicleNumber: 'MP-09-TA-7788',
    name: 'Hans Travels Multi-Axle Volvo AC Sleeper',
    operatorOrRail: 'Hans Travels',
    originCity: 'Indore',
    originStation: 'Navlakha / Pipliyahana Square',
    destinationTirth: 'Mumbai',
    destinationStation: 'Borivali East / Dadar Asiad',
    departureTime: '18:30',
    arrivalTime: '07:30',
    duration: '13h 00m',
    runsOn: ['Daily'],
    foodService: 'Highway Pure Jain Bhojanalay Halt at Dhule',
    rating: 4.8,
    seatClasses: [
      { className: 'AC Sleeper (2+1)', classCode: 'AC_SLEEPER', availableSeats: 14, totalSeats: 36, status: 'AVAILABLE', price: 1250 },
      { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 10, totalSeats: 24, status: 'AVAILABLE', price: 950 },
    ]
  },

  // Indore -> Delhi
  {
    id: 'train_12919',
    type: 'train',
    vehicleNumber: '12919',
    name: 'Malwa Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Indore',
    originStation: 'Indore Junction (INDB)',
    destinationTirth: 'Delhi / NCR',
    destinationStation: 'New Delhi (NDLS)',
    departureTime: '12:15',
    arrivalTime: '04:20',
    duration: '16h 05m',
    runsOn: ['Daily'],
    foodService: 'Jain Meal Special Counter Available',
    rating: 4.8,
    seatClasses: [
      { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 58, totalSeats: 120, status: 'AVAILABLE', price: 480 },
      { className: '3AC (3A)', classCode: '3A', availableSeats: 26, totalSeats: 64, status: 'AVAILABLE', price: 1280 },
      { className: '2AC (2A)', classCode: '2A', availableSeats: 10, totalSeats: 32, status: 'AVAILABLE', price: 1850 },
    ]
  },

  // Delhi -> Jaipur
  {
    id: 'train_20978',
    type: 'train',
    vehicleNumber: '20978',
    name: 'Ajmer Vande Bharat Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Delhi / NCR',
    originStation: 'New Delhi (NDLS)',
    destinationTirth: 'Jaipur',
    destinationStation: 'Jaipur Junction (JP)',
    departureTime: '18:40',
    arrivalTime: '22:35',
    duration: '3h 55m',
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    foodService: 'Executive Class Hot Jain Meal & Snacks',
    rating: 4.9,
    seatClasses: [
      { className: 'AC Chair Car (CC)', classCode: '3A', availableSeats: 48, totalSeats: 78, status: 'AVAILABLE', price: 890 },
      { className: 'Executive Chair (EC)', classCode: '2A', availableSeats: 18, totalSeats: 40, status: 'AVAILABLE', price: 1650 },
    ]
  },
  {
    id: 'bus_goldline_del_jp',
    type: 'bus',
    vehicleNumber: 'DL-01-PC-9911',
    name: 'IntrCity SmartBus Scania AC Sleeper',
    operatorOrRail: 'IntrCity SmartBus',
    originCity: 'Delhi / NCR',
    originStation: 'Dhaula Kuan / Kashmiri Gate',
    destinationTirth: 'Jaipur',
    destinationStation: 'Sindhi Camp / 200 Ft Bypass',
    departureTime: '23:00',
    arrivalTime: '04:30',
    duration: '5h 30m',
    runsOn: ['Daily'],
    foodService: 'Complimentary Water & Jain Snack Box',
    rating: 4.8,
    seatClasses: [
      { className: 'AC Sleeper', classCode: 'AC_SLEEPER', availableSeats: 16, totalSeats: 36, status: 'AVAILABLE', price: 550 },
    ]
  },

  // Mumbai -> Ahmedabad
  {
    id: 'train_20901',
    type: 'train',
    vehicleNumber: '20901',
    name: 'Vande Bharat Express (Mumbai - Gandhinagar)',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Mumbai',
    originStation: 'Mumbai Central (MMCT)',
    destinationTirth: 'Ahmedabad',
    destinationStation: 'Ahmedabad Junction (ADI)',
    departureTime: '06:00',
    arrivalTime: '11:25',
    duration: '5h 25m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    foodService: 'Pure Jain Navkarsi & High Tea',
    rating: 5.0,
    seatClasses: [
      { className: 'AC Chair Car (CC)', classCode: '3A', availableSeats: 62, totalSeats: 100, status: 'AVAILABLE', price: 1380 },
      { className: 'Executive Chair (EC)', classCode: '2A', availableSeats: 22, totalSeats: 52, status: 'AVAILABLE', price: 2500 },
    ]
  },

  // Bhopal -> Indore
  {
    id: 'train_20904',
    type: 'train',
    vehicleNumber: '20904',
    name: 'Bhopal - Indore Vande Bharat Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Bhopal',
    originStation: 'Rani Kamlapati (RKMP)',
    destinationTirth: 'Indore',
    destinationStation: 'Indore Junction (INDB)',
    departureTime: '19:25',
    arrivalTime: '22:30',
    duration: '3h 05m',
    runsOn: ['Daily'],
    foodService: 'Pure Jain Evening Snacks',
    rating: 4.9,
    seatClasses: [
      { className: 'AC Chair Car (CC)', classCode: '3A', availableSeats: 54, totalSeats: 78, status: 'AVAILABLE', price: 620 },
    ]
  },
  {
    id: 'bus_verma_bhopal_indore',
    type: 'bus',
    vehicleNumber: 'MP-04-FA-5566',
    name: 'Verma Travels Mercedes Benz AC Bus',
    operatorOrRail: 'Verma Travels',
    originCity: 'Bhopal',
    originStation: 'ISBT Bhopal / Lalghati',
    destinationTirth: 'Indore',
    destinationStation: 'Star Square / Sarwate Bus Stand',
    departureTime: '07:30',
    arrivalTime: '11:00',
    duration: '3h 30m',
    runsOn: ['Daily'],
    foodService: 'Pure Filtered Water & Snacks',
    rating: 4.8,
    seatClasses: [
      { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 18, totalSeats: 40, status: 'AVAILABLE', price: 380 },
    ]
  },

  // Ahmedabad -> Surat
  {
    id: 'train_12932',
    type: 'train',
    vehicleNumber: '12932',
    name: 'Ahmedabad - Mumbai Double Decker Express',
    operatorOrRail: 'Indian Railways (IRCTC)',
    originCity: 'Ahmedabad',
    originStation: 'Ahmedabad Junction (ADI)',
    destinationTirth: 'Surat',
    destinationStation: 'Surat Railway Station (ST)',
    departureTime: '06:00',
    arrivalTime: '08:35',
    duration: '2h 35m',
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    foodService: 'Pure Jain Navkarsi Packet',
    rating: 4.7,
    seatClasses: [
      { className: 'AC Chair Car (CC)', classCode: '3A', availableSeats: 88, totalSeats: 150, status: 'AVAILABLE', price: 380 },
    ]
  }
];

/**
 * Universal Route Search Engine: Returns both static exact vehicles and 
 * dynamically generated realistic route options for ANY origin city & destination city/Tirth!
 */
export function getVehiclesForRoute(
  origin: string,
  destination: string,
  vehicleFilter: 'all' | 'train' | 'bus' = 'all',
  searchQuery: string = ''
): TransportVehicle[] {
  const normOrigin = origin.trim().toLowerCase();
  const normDest = destination.trim().toLowerCase();

  // 1. First find direct matches in static array
  let results = ALL_INDIA_VEHICLES.filter(v => {
    if (vehicleFilter !== 'all' && v.type !== vehicleFilter) return false;

    if (normOrigin !== 'all' && normOrigin !== '') {
      const matchOrig = v.originCity.toLowerCase().includes(normOrigin) || normOrigin.includes(v.originCity.toLowerCase());
      if (!matchOrig) return false;
    }

    if (normDest !== 'all' && normDest !== '') {
      const matchDest = v.destinationTirth.toLowerCase().includes(normDest) || normDest.includes(v.destinationTirth.toLowerCase());
      if (!matchDest) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = v.name.toLowerCase().includes(q) ||
                     v.vehicleNumber.toLowerCase().includes(q) ||
                     v.destinationTirth.toLowerCase().includes(q) ||
                     v.originCity.toLowerCase().includes(q) ||
                     v.operatorOrRail.toLowerCase().includes(q);
      if (!matchQ) return false;
    }

    return true;
  });

  // 2. If origin and destination are specific cities/tirths and results are few, 
  // dynamically generate options so user ALWAYS gets exact route schedules!
  if (normOrigin !== 'all' && normDest !== 'all' && normOrigin !== '' && normDest !== '' && results.length < 2) {
    const origTitle = origin.charAt(0).toUpperCase() + origin.slice(1);
    const destTitle = destination.charAt(0).toUpperCase() + destination.slice(1);

    const generatedTrain: TransportVehicle = {
      id: `gen_train_${normOrigin}_${normDest}`,
      type: 'train',
      vehicleNumber: `${Math.floor(Math.random() * 80000 + 12000)}`,
      name: `${origTitle} - ${destTitle} Superfast Express`,
      operatorOrRail: 'Indian Railways (IRCTC)',
      originCity: origTitle,
      originStation: `${origTitle} Central / Junction`,
      destinationTirth: destTitle,
      destinationStation: `${destTitle} Junction / Main`,
      departureTime: '21:15',
      arrivalTime: '07:45',
      duration: '10h 30m',
      runsOn: ['Daily'],
      foodService: '100% Pure Jain Chovisi Meal Pantry',
      rating: 4.8,
      seatClasses: [
        { className: 'Sleeper (SL)', classCode: 'SL', availableSeats: 45, totalSeats: 120, status: 'AVAILABLE', price: 480 },
        { className: '3AC (3A)', classCode: '3A', availableSeats: 22, totalSeats: 64, status: 'AVAILABLE', price: 1250 },
        { className: '2AC (2A)', classCode: '2A', availableSeats: 8, totalSeats: 32, status: 'AVAILABLE', price: 1780 },
      ]
    };

    const generatedBus: TransportVehicle = {
      id: `gen_bus_${normOrigin}_${normDest}`,
      type: 'bus',
      vehicleNumber: `MP-${Math.floor(Math.random() * 80 + 10)}-TA-${Math.floor(Math.random() * 8999 + 1000)}`,
      name: `Shree Mahavir ${origTitle}-${destTitle} Volvo AC Sleeper`,
      operatorOrRail: 'Shree Mahavir Travels (Jain Special)',
      originCity: origTitle,
      originStation: `${origTitle} Main Bus Terminus`,
      destinationTirth: destTitle,
      destinationStation: `${destTitle} Central Bus Stand`,
      departureTime: '20:30',
      arrivalTime: '06:30',
      duration: '10h 00m',
      runsOn: ['Daily'],
      foodService: 'Pure Jain Sunset Meal Stop at Highway Bhojanalay',
      rating: 4.9,
      seatClasses: [
        { className: 'AC Sleeper (2+1)', classCode: 'AC_SLEEPER', availableSeats: 18, totalSeats: 36, status: 'AVAILABLE', price: 950 },
        { className: 'Volvo Seater (2+2)', classCode: 'VOLVO_SEATER', availableSeats: 14, totalSeats: 24, status: 'AVAILABLE', price: 750 },
      ]
    };

    if (vehicleFilter === 'all' || vehicleFilter === 'train') {
      if (!results.some(r => r.id === generatedTrain.id)) results.push(generatedTrain);
    }
    if (vehicleFilter === 'all' || vehicleFilter === 'bus') {
      if (!results.some(r => r.id === generatedBus.id)) results.push(generatedBus);
    }
  }

  return results;
}

export interface DestinationDharamshala {
  id: string;
  name: string;
  type: 'Dharamshala' | 'Bhojanalay' | 'Tirth Ashram';
  address: string;
  contactNo: string;
  hasACRooms: boolean;
  hasChovisiBhojan: boolean;
  rating: number;
}

export function getDestinationDharamshalas(destination: string): DestinationDharamshala[] {
  const destLower = destination.toLowerCase();

  if (destLower.includes('shikhar') || destLower.includes('parasnath')) {
    return [
      { id: 'ds_shikhar_1', name: 'Shree Digambar Jain Nitya Yatra Kothi', type: 'Dharamshala', address: 'Madhuban, Parasnath Hill Base, Giridih', contactNo: '+91 94311 23456', hasACRooms: true, hasChovisiBhojan: true, rating: 4.9 },
      { id: 'ds_shikhar_2', name: 'Shree Bharatvarshiya Digambar Jain Swetambar Kothi', type: 'Dharamshala', address: 'Main Road Madhuban', contactNo: '+91 94311 88990', hasACRooms: true, hasChovisiBhojan: true, rating: 4.8 },
      { id: 'ds_shikhar_3', name: 'Swetambar Kothi Bhojanalay (100% Chovisi)', type: 'Bhojanalay', address: 'Near Bus Stand, Madhuban', contactNo: '+91 94311 11223', hasACRooms: false, hasChovisiBhojan: true, rating: 5.0 },
    ];
  }

  if (destLower.includes('palitana') || destLower.includes('shatrunjay')) {
    return [
      { id: 'ds_pali_1', name: 'Shree Anandji Kalyanji Pedhi Dharamshala', type: 'Dharamshala', address: 'Taleti Road, Palitana', contactNo: '+91 2796 22001', hasACRooms: true, hasChovisiBhojan: true, rating: 4.9 },
      { id: 'ds_pali_2', name: 'Jain Yatri Niwas & Bhojanshala', type: 'Dharamshala', address: 'Station Road, Palitana', contactNo: '+91 2796 22500', hasACRooms: true, hasChovisiBhojan: true, rating: 4.8 },
    ];
  }

  if (destLower.includes('indore')) {
    return [
      { id: 'ds_ind_1', name: 'Shree Digambar Jain Kanch Mandir Yatri Niwas', type: 'Dharamshala', address: 'Itwaria Bazar, Indore', contactNo: '+91 731 2456789', hasACRooms: true, hasChovisiBhojan: true, rating: 4.8 },
      { id: 'ds_ind_2', name: 'Bada Ganpati Digambar Jain Atithi Bhavan', type: 'Dharamshala', address: 'Ganpati Square, Indore', contactNo: '+91 731 2548899', hasACRooms: true, hasChovisiBhojan: true, rating: 4.7 },
    ];
  }

  if (destLower.includes('mumbai')) {
    return [
      { id: 'ds_mum_1', name: 'Shree Godiji Jain Temple Dharamshala', type: 'Dharamshala', address: 'Paydhonie, Kalbadevi, Mumbai', contactNo: '+91 22 2342 5566', hasACRooms: true, hasChovisiBhojan: true, rating: 4.9 },
      { id: 'ds_mum_2', name: 'Dadar Swetambar Jain Atithi Griha', type: 'Dharamshala', address: 'Dadar West, Mumbai', contactNo: '+91 22 2414 8822', hasACRooms: true, hasChovisiBhojan: true, rating: 4.8 },
    ];
  }

  // Default fallback for any other City or Tirth
  return [
    { id: 'ds_gen_1', name: `Shree Digambar & Swetambar Jain Bhavan (${destination})`, type: 'Dharamshala', address: `Central Jain Temple Campus, ${destination}`, contactNo: '+91 98260 99887', hasACRooms: true, hasChovisiBhojan: true, rating: 4.8 },
    { id: 'ds_gen_2', name: `Shree Jain Shuddh Bhojanalay (${destination})`, type: 'Bhojanalay', address: `Near Railway Station / Main Bus Terminus, ${destination}`, contactNo: '+91 98260 11223', hasACRooms: false, hasChovisiBhojan: true, rating: 4.9 }
  ];
}

