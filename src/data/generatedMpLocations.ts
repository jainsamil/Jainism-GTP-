export interface Review {
  author: string;
  rating: number;
  comment: { hi: string; en: string };
  date: string;
}

export interface Kitchen {
  id: string;
  name: { hi: string; en: string };
  type: 'family' | 'dharamshala' | 'restaurant';
  address: { hi: string; en: string };
  city: string;
  contact: string;
  sunsetCompliant: boolean;
  filteredWater: boolean;
  noRootsAllowed: boolean;
  rating: number;
  pureUtensils: boolean;
  distanceSimulated: number;
  aharTimings: { hi: string; en: string };
  specialty: { hi: string; en: string };
  reviews: Review[];
  lat: number;
  lng: number;
  state: 'MP' | 'UP' | 'Karnataka' | 'Maharashtra' | 'Tamil Nadu' | 'Rajasthan' | 'Gujarat' | 'Other';
  costType: 'free' | 'nominal' | 'paid';
  costRupees: number;
  costInfo: { hi: string; en: string };
  status: 'approved' | 'pending';
  chatHistory: any[];
}

const MP_CITIES_COORDS = {
  'indore': { lat: 22.7196, lng: 75.8577, nameHi: 'इन्दौर', nameEn: 'Indore' },
  'bhopal': { lat: 23.2599, lng: 77.4126, nameHi: 'भोपाल', nameEn: 'Bhopal' },
  'damoh': { lat: 23.8324, lng: 79.4442, nameHi: 'दमोद (दमोह)', nameEn: 'Damoh' },
  'jabalpur': { lat: 23.1815, lng: 79.9864, nameHi: 'जबलपुर', nameEn: 'Jabalpur' },
  'sagar': { lat: 23.8388, lng: 78.7378, nameHi: 'सागर', nameEn: 'Sagar' },
  'ujjain': { lat: 23.1760, lng: 75.7885, nameHi: 'उज्जैन', nameEn: 'Ujjain' },
  'gwalior': { lat: 26.2183, lng: 78.1784, nameHi: 'ग्वालियर', nameEn: 'Gwalior' },
  'katni': { lat: 23.8344, lng: 80.3853, nameHi: 'कटनी', nameEn: 'Katni' },
  'dewas': { lat: 22.9676, lng: 76.0534, nameHi: 'देवास', nameEn: 'Dewas' },
  'ratlam': { lat: 23.3315, lng: 75.0367, nameHi: 'रतलाम', nameEn: 'Ratlam' }
};

const NAMES_HI = {
  prefixes: [
    "श्री दिगंबर जैन शांतिनाथ", "श्रीमती चंद्राबाई जैन श्रावक", "श्री पार्श्वनाथ मर्यादित जैन", "परम पूज्य विद्यासागर महाराज", 
    "श्री श्वेतांबर संघ सात्विक", "श्री आदिनाथ जैन तीर्थ", "तपोवीर सन्मति जैन", "श्री चंद्रप्रभु स्वाध्याय भवन", 
    "सादर साधार्मिक जैन वात्सल्य", "मर्यादित जैन शुद्ध", "श्री जिनेन्द्र राजचंद्र", "श्रीमती कमला देवी श्रावक", 
    "श्री बाहुबली दिगंबर", "श्री महावीर स्वामी अतिशय", "कुंडलपुर सिद्धक्षेत्र प्रसादी"
  ],
  suffixes: [
    "भोजनशाला", "रसोई गृह", "अतिथि शाला भोजनालय", "धर्मशाला रसोई", "शुद्ध पाकशाला", "टिफिन सेंटर प्रसादी", "चैत्यालय भोजन पटल"
  ]
};

const NAMES_EN = {
  prefixes: [
    "Shri Digambar Jain Shantinath", "Smt Chandrabai Shravak", "Shri Parshvanath Restrictive", "Acharya Vidyasagar", 
    "Shri Svetambar Sangh Satvik", "Shri Adinath Jain Teerth", "Tapoveer Sanmati Jain", "Shri Chandraprabhu Swadhyay", 
    "Sadharmik Jain Vatsalya", "Maryadit Jain Shuddh", "Shri Jinendra Rajchandra", "Smt Kamala Devi Shravak", 
    "Shri Bahubali Digambar", "Shri Mahaveer Swami Atishay", "Kundalpur Siddhakshetra Prasad"
  ],
  suffixes: [
    "Bhojnalaya", "Kitchen", "Guest House Dining", "Dharamshala Kitchen", "Pure Dining Hall", "Tiffin Center", "Chaityalaya Food Hub"
  ]
};

const ROAD_PLACES_HI = [
  "जवाहर मार्ग, दिगंबर चौक के पास", "अरेरा कॉलोनी, जैन मंदिर परिसर", "घंटाघर के समीप, नसिया जी रोड", 
  "स्टेशन रोड, महावीर भवन के सामने", "कटरा बाजार, मुनि संघ भवन", "सर्वोदय नगर, दिगंबर जिनालय पथ", 
  "पीपल चौक, स्वाध्याय मंदिर मार्ग", "नई नसिया परिसर, पार्श्वनाथ मार्ग", "कंचन बाग, जैन धर्मशाला के पीछे", 
  "एम जी रोड, जैन मिलन हॉल के दाहिने", "शांति नगर, तारण तरण चैत्यालय रोड", "राजबाड़ा चौक, जैन धर्मशाला के पास",
  "कमला नेहरू मार्ग, जैन मंदिर के पास", "महावीर वार्ड, नेमीनाथ जिनालय परिसर"
];

const ROAD_PLACES_EN = [
  "Jawahar Marg, near Digambar Chowk", "Arera Colony, Jain Mandir Campus", "Near Ghantaghar, Nasiya Ji Road", 
  "Station Road, opposite Mahaveer Bhavan", "Katra Bazaar, Muni Sangh Building", "Sarvodaya Nagar, Digambar Chaitanya Path", 
  "Peepal Chowk, Swadhyay Mandir Lane", "New Nasiya Campus, Parshvanath Marg", "Kanchan Bagh, behind Jain Dharamshala", 
  "M.G. Road, next to Jain Milan Hall", "Shanti Nagar, Taran Taran Lane", "Rajwada Circle, near Dharamshala",
  "Kamla Nehru Marg, near Jain Temple", "Mahaveer Ward, Neminath Temple Road"
];

const SPECIALTIES_HI = [
  "मर्यादित दाल-बाटी चूरमा प्रसादी", "सादी सात्विक बुंदेली थाली", "मर्यादित रोटियां एवं मूंग खिचड़ी", 
  "शुद्ध मालवी जैन थाली", "अरिहंत मर्यादित भोजन प्रसादी", "मर्यादित दाल-चावल, शुद्ध चपाती और छाछ", 
  "सात्विक तवा रोटी और मर्यादित मौसमी सब्जी"
];

const SPECIALTIES_EN = [
  "Restricted Dal-Baati Churma", "Simple Satvik Bundeli Plate", "Maryadit Chapati & Moong Khichdi", 
  "Pure Malwi Jain Thali", "Arihant Restricted Meals", "Restricted Dal-Rice & Shuddh Chapati", 
  "Satvik Tawa Roti & seasonal vegetable"
];

const REVIEWERS = ["अमित जैन", "संजय सिंघई", "शिखर जैन", "निखिल चौधरी", "विवेक जैन दमोह", "रिंकू जैन", "आरती जैन भोपाल", "प्रिया शाह"];
const REVIEWS_COMMENT_HI = [
  "अत्यंत शुद्ध और सूर्यास्त से पूर्व मर्यादित भोजन मिला। धन्य है ऐसी श्रावक सेवा।",
  "यहां जल गालन (फिल्टर्ड वाटर) और शुद्ध मर्यादा का विशेष ध्यान रखा जाता है। भोजन बहुत स्वादिष्ट है।",
  "बिल्कुल घर जैसा सात्विक स्वाद। नि:शुलक सेवा भी अत्यंत आदरपूर्वक की जाती है।",
  "साधु विहार में चलने वाले सेवादारों के लिए विशेष अनुकूल व्यवस्था है। जय जिनेन्द्र।"
];
const REVIEWS_COMMENT_EN = [
  "Extremely pure and before sunset limited food. Blessed Shravak service here.",
  "Deep respect for filtered water (Jal Galan) and pure ingredients. Tasty satvik food.",
  "Feels exactly like home-cooked satvik food. Complimentary meals served with high respect.",
  "Excellent supportive arrangement for volunteers on Vihar duty. Jai Jinendra."
];

export function generateMpKitchens(): Kitchen[] {
  const list: Kitchen[] = [];
  const cities = Object.keys(MP_CITIES_COORDS) as Array<keyof typeof MP_CITIES_COORDS>;
  
  // Generate exactly 415 kitchens across Madhya Pradesh targeting user requested cities
  for (let i = 1; i <= 415; i++) {
    const cityKey = cities[(i - 1) % cities.length];
    const cityData = MP_CITIES_COORDS[cityKey];
    
    // Select naming parts by index
    const prefixIdx = (i * 3 + 7) % NAMES_HI.prefixes.length;
    const suffixIdx = (i * 7 + 11) % NAMES_HI.suffixes.length;
    
    const prefixHi = NAMES_HI.prefixes[prefixIdx];
    const suffixHi = NAMES_HI.suffixes[suffixIdx];
    const nameHi = `${prefixHi} ${suffixHi} - क्रमांक ${i}`;
    
    const prefixEn = NAMES_EN.prefixes[prefixIdx];
    const suffixEn = NAMES_EN.suffixes[suffixIdx];
    const nameEn = `${prefixEn} ${suffixEn} - #${i}`;
    
    // Choose address
    const addrIdx = (i * 13) % ROAD_PLACES_HI.length;
    const addressHi = `${ROAD_PLACES_HI[addrIdx]}, ${cityData.nameHi} (म.प्र.)`;
    const addressEn = `${ROAD_PLACES_EN[addrIdx]}, ${cityData.nameEn}, Madhya Pradesh`;
    
    // Choose type
    const typeInt = i % 3;
    const type: 'family' | 'dharamshala' | 'restaurant' = 
      typeInt === 0 ? 'family' : typeInt === 1 ? 'dharamshala' : 'restaurant';
      
    // Choose cost details
    const costInt = i % 4;
    let costType: 'free' | 'nominal' | 'paid' = 'free';
    let costRupees = 0;
    let costInfoHi = "निशुल्क (सादर साधार्मिक वात्सल्य प्रसादी)";
    let costInfoEn = "Complimentary (Jain Sadharmik Vatsalya Prasad)";
    
    if (costInt === 1) {
      costType = 'nominal';
      costRupees = 40;
      costInfoHi = "₹४० (केवल नाममात्र सहयोग राशि)";
      costInfoEn = "₹40 (Nominal raw material support charge)";
    } else if (costInt === 2) {
      costType = 'nominal';
      costRupees = 60;
      costInfoHi = "₹६० (रखरखाव सहयोग राशि)";
      costInfoEn = "₹60 (Nominal maintenance cost share)";
    } else if (costInt === 3) {
      costType = 'paid';
      costRupees = 90;
      costInfoHi = "₹९० (शुद्ध मर्यादित जैन थाली)";
      costInfoEn = "₹90 (Standard satvik pure Thali)";
    }
    
    const specIdx = (i * 11) % SPECIALTIES_HI.length;
    const rating = Number((4.5 + ((i * 17) % 6) * 0.1).toFixed(1));
    
    // generate slightly random offsets for lat/lng to show scatter around the city coordinate center
    const latOffset = ((i * 19) % 350 - 175) / 5000;
    const lngOffset = ((i * 23) % 350 - 175) / 5000;
    
    // create realistic reviews
    const reviews: Review[] = [];
    const revCount = i % 3 + 1;
    for (let r = 0; r < revCount; r++) {
      const parentIdx = (i + r) % REVIEWERS.length;
      const commIdx = (i * 2 + r * 3) % REVIEWS_COMMENT_HI.length;
      reviews.push({
        author: REVIEWERS[parentIdx],
        rating: Math.min(5, Math.max(4, 5 - (r % 2))),
        comment: {
          hi: REVIEWS_COMMENT_HI[commIdx],
          en: REVIEWS_COMMENT_EN[commIdx]
        },
        date: `2026-06-${String((10 + r) % 28).padStart(2, '0')}`
      });
    }
    
    list.push({
      id: `mp-gen-${i}`,
      name: { hi: nameHi, en: nameEn },
      type,
      address: { hi: addressHi, en: addressEn },
      city: cityData.nameEn,
      contact: `+91 94250 ${String(10000 + (i * 73) % 90000)}`,
      sunsetCompliant: true,
      filteredWater: true,
      noRootsAllowed: true,
      rating,
      pureUtensils: true,
      distanceSimulated: Number((0.5 + ((i * 3) % 19) * 0.4).toFixed(1)),
      aharTimings: {
        hi: "दोपहर ११:०० - १:३०, शाम ५:०० - सूर्यास्त",
        en: "11:00 AM - 1:30 PM, 5:00 PM - Sunset"
      },
      specialty: {
        hi: SPECIALTIES_HI[specIdx],
        en: SPECIALTIES_EN[specIdx]
      },
      reviews,
      lat: cityData.lat + latOffset,
      lng: cityData.lng + lngOffset,
      state: 'MP',
      costType,
      costRupees,
      costInfo: { hi: costInfoHi, en: costInfoEn },
      status: 'approved',
      chatHistory: []
    });
  }
  
  return list;
}
