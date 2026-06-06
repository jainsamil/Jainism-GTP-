import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, MapPin, ShieldCheck, Utensils, Clock, Phone, 
  PlusCircle, Globe, Star, Sliders, Heart, MessageSquare, AlertTriangle, CheckCircle,
  ShieldAlert, Send, MessageCircle, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, setDoc, query, where, onSnapshot, arrayUnion } from 'firebase/firestore';

interface Review {
  author: string;
  rating: number;
  comment: { hi: string; en: string };
  date: string;
}

interface Kitchen {
  id: string;
  name: { hi: string; en: string };
  type: 'family' | 'dharamshala' | 'restaurant';
  address: { hi: string; en: string };
  city: string;
  contact: string;
  sunsetCompliant: boolean;
  filteredWater: boolean; // Jal Galan
  noRootsAllowed: boolean;
  rating: number;
  pureUtensils: boolean;
  distanceSimulated: number; // in km
  aharTimings: { hi: string; en: string };
  specialty: { hi: string; en: string };
  reviews: Review[];
  lat: number;
  lng: number;
  state: 'MP' | 'UP' | 'Karnataka' | 'Maharashtra' | 'Tamil Nadu' | 'Rajasthan' | 'Gujarat' | 'Other';
  costType: 'free' | 'nominal' | 'paid';
  costRupees: number;
  costInfo: { hi: string; en: string };
  status?: 'approved' | 'pending';
  chatHistory?: any[];
}

// Coordinates reference lookup for major cities/villages to calculate live distance from selected cities
export const REFERENCE_CITIES_COORDS: { [key: string]: { lat: number; lng: number; labelHi: string; labelEn: string } } = {
  'indore': { lat: 22.7196, lng: 75.8577, labelHi: 'इन्दौर (म.प्र.)', labelEn: 'Indore (MP)' },
  'bhopal': { lat: 23.2599, lng: 77.4126, labelHi: 'भोपाल (म.प्र.)', labelEn: 'Bhopal (MP)' },
  'ujjain': { lat: 23.1760, lng: 75.7885, labelHi: 'उज्जैन (म.प्र.)', labelEn: 'Ujjain (MP)' },
  'jabalpur': { lat: 23.1815, lng: 79.9864, labelHi: 'जबलपुर (म.प्र.)', labelEn: 'Jabalpur (MP)' },
  'gwalior': { lat: 26.2183, lng: 78.1784, labelHi: 'ग्वालियर (म.प्र.)', labelEn: 'Gwalior (MP)' },
  'sagar': { lat: 23.8388, lng: 78.7378, labelHi: 'सागर (म.प्र.)', labelEn: 'Sagar (MP)' },
  'kundalpur': { lat: 23.9780, lng: 79.6730, labelHi: 'कुण्डलपुर जी (म.प्र.)', labelEn: 'Kundalpur (MP)' },
  'sonagiri': { lat: 25.6888, lng: 78.3695, labelHi: 'सोनागिर जी (म.प्र.)', labelEn: 'Sonagiri (MP)' },
  'katni': { lat: 23.8344, lng: 80.3853, labelHi: 'कटनी (म.प्र.)', labelEn: 'Katni (MP)' },
  'ratlam': { lat: 23.3315, lng: 75.0367, labelHi: 'रतलाम (म.प्र.)', labelEn: 'Ratlam (MP)' },
  'dewas': { lat: 22.9676, lng: 76.0534, labelHi: 'देवास (म.प्र.)', labelEn: 'Dewas (MP)' },
  'maksi': { lat: 23.2500, lng: 76.1500, labelHi: 'मक्सी जी (म.प्र.)', labelEn: 'Maksi (MP)' },
  'vidisha': { lat: 23.5251, lng: 77.8221, labelHi: 'विदिशा (म.प्र.)', labelEn: 'Vidisha (MP)' },
  
  'hastinapur': { lat: 29.1718, lng: 78.0205, labelHi: 'हस्तिनापुर (उ.प्र.)', labelEn: 'Hastinapur (UP)' },
  'varanasi': { lat: 25.3176, lng: 82.9739, labelHi: 'वाराणसी / काशी (उ.प्र.)', labelEn: 'Varanasi (UP)' },
  'ayodhya': { lat: 26.7956, lng: 82.1943, labelHi: 'अयोध्या जी (उ.प्र.)', labelEn: 'Ayodhya (UP)' },
  'lucknow': { lat: 26.8467, lng: 80.9462, labelHi: 'लखनऊ (उ.प्र.)', labelEn: 'Lucknow (UP)' },
  'agra': { lat: 27.1767, lng: 78.0081, labelHi: 'आगरा (उ.प्र.)', labelEn: 'Agra (UP)' },
  'lalitpur': { lat: 24.6902, lng: 78.4116, labelHi: 'ललितपुर (उ.प्र.)', labelEn: 'Lalitpur (UP)' },
  'deogarh': { lat: 24.5230, lng: 78.2562, labelHi: 'देवगढ़ (उ.प्र.)', labelEn: 'Deogarh (UP)' },
  'firozabad': { lat: 27.1511, lng: 78.3956, labelHi: 'फिरोजाबाद (उ.प्र.)', labelEn: 'Firozabad (UP)' },
  'kanpur': { lat: 26.4499, lng: 80.3319, labelHi: 'कानपुर (उ.प्र.)', labelEn: 'Kanpur (UP)' },
  'prayagraj': { lat: 25.4358, lng: 81.8463, labelHi: 'प्रयागराज / इलाहाबाद (उ.प्र.)', labelEn: 'Prayagraj (UP)' },
  'jhansi': { lat: 25.4484, lng: 78.5685, labelHi: 'झाँसी (उ.प्र.)', labelEn: 'Jhansi (UP)' },
  'mathura': { lat: 27.4924, lng: 77.6737, labelHi: 'मथुरा (उ.प्र.)', labelEn: 'Mathura (UP)' },
  'shravasti': { lat: 27.5144, lng: 82.0487, labelHi: 'श्रावस्ती जी (उ.प्र.)', labelEn: 'Shravasti (UP)' },
  'kampil': { lat: 27.5855, lng: 79.2842, labelHi: 'कंपिल जी (उ.प्र.)', labelEn: 'Kampil (UP)' },
  'ahichchhatra': { lat: 28.3750, lng: 79.1250, labelHi: 'अहिच्छत्र जी (उ.प्र.)', labelEn: 'Ahichchhatra (UP)' },

  'bangalore': { lat: 12.9716, lng: 77.5946, labelHi: 'बेंगलुरु (कर्नाटक)', labelEn: 'Bangalore (KA)' },
  'pune': { lat: 18.5204, lng: 73.8567, labelHi: 'पुणे (महाराष्ट्र)', labelEn: 'Pune (MH)' },
  'mumbai': { lat: 19.0760, lng: 72.8777, labelHi: 'मुंबई (महाराष्ट्र)', labelEn: 'Mumbai (MH)' },
  'salem': { lat: 11.6643, lng: 78.1460, labelHi: 'सलेम (तमिलनाडु)', labelEn: 'Salem (TN)' },
  'jaipur': { lat: 26.9124, lng: 75.7873, labelHi: 'जयपुर (राजस्थान)', labelEn: 'Jaipur (RJ)' },
  'palitana': { lat: 21.5219, lng: 71.8315, labelHi: 'पालिताना (गुजरात)', labelEn: 'Palitana (GJ)' },
  'junagadh': { lat: 21.5222, lng: 70.4579, labelHi: 'जूनागढ़ (गुजरात)', labelEn: 'Junagadh (GJ)' }
};

const INITIAL_KITCHENS: Kitchen[] = [
  {
    id: 'k1',
    name: { hi: 'श्रीमती सरोज जैन श्रावक रसोई (घर का भोजन)', en: 'Srimati Saroj Jain Home Kitchen' },
    type: 'family',
    address: { hi: 'फ्लैट ४०२, सिद्ध चक्र रेसीडेंसी, जेपी नगर, बेंगलुरु', en: 'Flat 402, Siddha Chakra Residency, JP Nagar, Bangalore' },
    city: 'Bangalore',
    contact: '+91 98450 11202',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 1.2,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:30 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'पारंपरिक मर्यादित दाल-बाटी एवं शुद्ध रोटियां', en: 'Traditional restricted Dal-Baati & Pure handmade rotis' },
    reviews: [
      { author: 'आदित्य जैन', rating: 5, comment: { hi: 'अति उत्तम शुद्ध भोजन। घर जैसी मर्यादा और आदर भाव!', en: 'Superb pure food! Homely code of conduct & respect.' }, date: '2026-06-01' },
      { author: 'नेहा शाह', rating: 5, comment: { hi: 'बेंगलुरु यात्रा में जैन मर्यादा भोजन मिलना वरदान है!', en: 'Finding pure Jain food during Bangalore travels is a blessing!' }, date: '2026-06-03' }
    ],
    lat: 12.9079,
    lng: 77.5852,
    state: 'Karnataka',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सधर्मी वात्सल्य)', en: 'Free (Sadharmik Vatsalya)' }
  },
  {
    id: 'k2',
    name: { hi: 'श्री दिगंबर जैन धर्मशाला भोजनालय', en: 'Shri Digambar Jain Dharamshala Aharshala' },
    type: 'dharamshala',
    address: { hi: 'पार्श्वनाथ चौक, मुख्य बाजार, पुणे', en: 'Parshvanath Chowk, Main Bazar, Pune' },
    city: 'Pune',
    contact: '+91 94220 33810',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 3.4,
    aharTimings: { hi: 'दोपहर ११:१५ - १:००, शाम ५:१५ - सूर्यास्त पूर्व', en: '11:15 AM - 1:00 PM, 5:15 PM - Pre-sunset' },
    specialty: { hi: 'सात्विक मर्यादित थाली भोजन (कंदमूल रहित)', en: 'Satvik restricted thali meal (strictly zero root-vegetables)' },
    reviews: [
      { author: 'विपुल दोषी', rating: 4, comment: { hi: 'बहुत ही किफायती और अत्यंत शुद्ध। छने जल का उत्तम प्रबंध।', en: 'Very economical and highly pure. Double filtered water standard.' }, date: '2026-05-28' }
    ],
    lat: 18.5204,
    lng: 73.8567,
    state: 'Maharashtra',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (नाममात्र सहयोग राशि)', en: '₹60 (Nominal Donation Thali)' }
  },
  {
    id: 'k3',
    name: { hi: 'शुद्ध देव दर्शन जैन शुद्ध रेस्टोरेंट', en: 'Shuddha Dev Darshan Pure Veg Restaurant' },
    type: 'restaurant',
    address: { hi: 'हाईवे बाईपास सर्किल टी-तिराहा, सलेम, तमिलनाडु', en: 'Highway Bypass Circle T-Junction, Salem, Tamil Nadu' },
    city: 'Salem',
    contact: '+91 94430 45800',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.7,
    pureUtensils: true,
    distanceSimulated: 4.8,
    aharTimings: { hi: 'सुबह ७:०० - रात्रि ८:०० (जैन भोजन केवल सूर्यास्त से पहले)', en: '7:00 AM - 8:00 PM (Jain Food strictly served before sunset)' },
    specialty: { hi: 'दक्षिण भारतीय जैन इडली, सांभर और मर्यादित डोसा', en: 'South Indian Jain Idli, Sambhar & restricted Dosa' },
    reviews: [
      { author: 'महेश जैन', rating: 5, comment: { hi: 'हाईवे पर चौका भोजन की कमी पूरी करता है।', en: 'Fills the gap of pure kitchen food on high-speed highways.' }, date: '2026-05-24' }
    ],
    lat: 11.6643,
    lng: 78.1460,
    state: 'Tamil Nadu',
    costType: 'paid',
    costRupees: 120,
    costInfo: { hi: '₹१२० (सशुल्क शुद्ध जैन भोजन)', en: '₹120 (Paid Pure Jain Thali)' }
  },
  {
    id: 'k4',
    name: { hi: 'राजस्थानी जैन श्रावक अतिथि चौका', en: 'Rajasthani Jain Shravak Guest Chouka' },
    type: 'family',
    address: { hi: '८२, स्वर्ण बाग कॉलोनी, विजय नगर, इंदौर', en: '82, Swarn Bagh Colony, Vijay Nagar, Indore' },
    city: 'Indore',
    contact: '+91 98930 22100',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.8,
    aharTimings: { hi: 'दोपहर ११:३० - १:४५, शाम ५:४५ - सूर्यास्त पूर्व', en: '11:30 AM - 1:45 PM, 5:45 PM - Pre-sunset' },
    specialty: { hi: 'मालवी शुद्ध मर्यादित कढ़ी खीचड़ी एवं देसी कलीदार घी चूरमा', en: 'Malvi pure limited Kadhi-Khichdi & organic Ghee Churma' },
    reviews: [
      { author: 'संदीप शाह', rating: 5, comment: { hi: 'अद्भुत स्वाद और सर्वोच्च सेवा भाव। बिल्कुल मर्यादित चौका है।', en: 'Amazing flavor and supreme service. Authentically pure code.' }, date: '2026-06-04' }
    ],
    lat: 22.7533,
    lng: 75.8937,
    state: 'MP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (साधार्मिक वात्सल्य)', en: 'Free (Sadharmik Vatsalya)' }
  },
  {
    id: 'k5',
    name: { hi: 'श्री महावीर दिगंबर अतिशय क्षेत्र अहारशाला', en: 'Shri Mahavir Digambar Atishay Kshetra Aharshala' },
    type: 'dharamshala',
    address: { hi: 'तीर्थ परिसर, श्री महावीरजी, राजस्थान', en: 'Teerth Complex, Shri Mahavirji, Rajasthan' },
    city: 'Jaipur',
    contact: '+91 94140 88201',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 2.1,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:०० - सूर्यास्त', en: '11:00 AM - 2:00 PM, 5:00 PM - Sunset' },
    specialty: { hi: 'राजस्थानी बेसन गट्टा करी एवं मर्यादित मूंग मोगर दाल', en: 'Rajasthani Besan Gatta curry & restricted Moong Mongar Dal' },
    reviews: [],
    lat: 26.7324,
    lng: 76.9372,
    state: 'Rajasthan',
    costType: 'nominal',
    costRupees: 50,
    costInfo: { hi: '₹५० (धार्मिक सहयोग राशि)', en: '₹50 (Nominal Religious Support)' }
  },
  {
    id: 'k6',
    name: { hi: 'श्रीमती मंगला बेन श्रावक भोजनालय (पालिताना तलहटी)', en: 'Srimati Mangala Ben Shravak Mess (Palitana foothills)' },
    type: 'family',
    address: { hi: 'जैन मंदिर मार्ग, तलहती के निकट, पालिताना', en: 'Jain Temple Road, Close to Taleti, Palitana' },
    city: 'Palitana',
    contact: '+91 27820 11950',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 1.5,
    aharTimings: { hi: 'सुबह ७:०० नवकारसी, दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त पूर्व', en: '7:00 AM Navkarshi, 11:00 AM - 1:30 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'गुजराती मर्यादित दाल, कढ़ी और मक्खन रहित गरम रोटियां', en: 'Gujarati restricted Dal, Kadhi & hot oil-free rotis' },
    reviews: [
      { author: 'धर्मेश दोषी', rating: 5, comment: { hi: 'वंदना के बाद यहाँ साक्षात् अमृत समान शुद्ध भोजन मिलता है।', en: 'Superb nectar-like pure food after Shatrunjaya Giriraj Vandana!' }, date: '2026-05-30' }
    ],
    lat: 21.5219,
    lng: 71.8315,
    state: 'Gujarat',
    costType: 'nominal',
    costRupees: 80,
    costInfo: { hi: '₹८० (सादर सहयोग राशि)', en: '₹80 (Nominal Service Thali)' }
  },
  {
    id: 'k7',
    name: { hi: 'श्री गिरनार तपोवन भोजनालय एवं भोजनशाला', en: 'Shri Girnar Tapovan Bhojanalaya & Dining Hall' },
    type: 'dharamshala',
    address: { hi: 'भवनाथ तलहटी रोड़, जूनागढ़, गुजरात', en: 'Bhavnath foothills road, Junagadh, Gujarat' },
    city: 'Junagadh',
    contact: '+91 28520 88310',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 3.9,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:१५ - सूर्यास्त पूर्व', en: '11:00 AM - 1:30 PM, 5:15 PM - Pre-sunset' },
    specialty: { hi: 'कठोल व मर्यादित बाजरे का रोटला', en: 'Kathol & limited traditional Bajra Rotla' },
    reviews: [],
    lat: 21.5222,
    lng: 70.4579,
    state: 'Gujarat',
    costType: 'nominal',
    costRupees: 70,
    costInfo: { hi: '₹७० (भोजनशाला सहयोग शुल्क)', en: '₹70 (Nominal Support Thali)' }
  },
  {
    id: 'k8',
    name: { hi: 'पार्श्व गृह उद्योग मर्यादित टिफिन सेवा (धर्मभक्ति)', en: 'Parshva Home-Cooked Pure Tiffin Service' },
    type: 'family',
    address: { hi: 'सद्गुरु हाइट्स, गोरेगांव पूर्व, मुंबई', en: 'Sadguru Heights, Goregaon East, Mumbai' },
    city: 'Mumbai',
    contact: '+91 98200 44920',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 5.2,
    aharTimings: { hi: 'दोपहर ११:०० - १:०० (केवल टिफिन वितरण)', en: '11:00 AM - 1:00 PM (Strictly delivery only)' },
    specialty: { hi: 'मुंबई लोकल शुद्ध कंदमूल त्यागी पारंपरिक जैन टिफिन', en: 'Mumbai Local pure zero-root traditional Jain Tiffin' },
    reviews: [
      { author: 'अमित शाह', rating: 5, comment: { hi: 'बिना प्याज लहसुन और पूर्ण शुचिता का उत्कृष्ट टिफिन।', en: 'Excellent tiffin with strictly zero onion garlic and absolute purity.' }, date: '2026-06-03' }
    ],
    lat: 19.1663,
    lng: 72.8526,
    state: 'Maharashtra',
    costType: 'paid',
    costRupees: 150,
    costInfo: { hi: '₹१५० (सशुल्क शुद्ध टिफिन थाली)', en: '₹150 (Paid Pure Tiffin Thali)' }
  },

  // ==========================================
  // MADHYA PRADESH (MP) AUTHENTIC JAIN FOOD CHOUKAS 
  // ==========================================
  {
    id: 'k-mp-1',
    name: { hi: 'श्री कंचनबाग दिगंबर जैन मंदिर भोजनशाला', en: 'Shri Kanchan Bagh Digambar Jain Temple Bhojnalaya' },
    type: 'dharamshala',
    address: { hi: 'कंचनबाग जैन मंदिर मार्ग, इन्दौर, मध्य प्रदेश', en: 'Kanchan Bagh Jain Temple Road, Indore, Madhya Pradesh' },
    city: 'Indore',
    contact: '+91 73125 14592',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 1.0,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:30 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'मर्यादित इंदौर दाल बाटी, बिना आलू-लहसुन सात्विक कढ़ी', en: 'Restricted Malvi Dal Baati & potato/onion-free authentic Kadhi' },
    reviews: [
      { author: 'सम्यक जैन', rating: 5, comment: { hi: 'कंचनबाग मंदिर की शुद्धता सर्वोत्तम है, छने पानी का कठोर पालन होता है।', en: 'Kanchan Bagh temple purity is top tier, strict filtered water discipline.' }, date: '2026-06-02' }
    ],
    lat: 22.7230,
    lng: 75.8750,
    state: 'MP',
    costType: 'nominal',
    costRupees: 70,
    costInfo: { hi: '₹७० (नाममात्र सहयोग स्वरूप)', en: '₹70 (Nominal Maintenance Cost)' }
  },
  {
    id: 'k-mp-2',
    name: { hi: 'श्रीमती मीना जैन श्रावक रसोई (विजयनगर)', en: 'Srimati Meena Jain Shravak Home Kitchen' },
    type: 'family',
    address: { hi: 'फ्लैट ४०१, पारसमणि टावर, स्कीम ५४, विजयनगर, इन्दौर, मध्य प्रदेश', en: 'Flat 401, Parasmani Tower, Scheme 54, Vijay Nagar, Indore, MP' },
    city: 'Indore',
    contact: '+91 98260 55190',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 2.3,
    aharTimings: { hi: 'दोपहर ११:३० - १:३०, शाम ५:४५ - सूर्यास्त से ३० मिनट पूर्व', en: '11:30 AM - 1:30 PM, 5:45 PM - 30 mins before sunset' },
    specialty: { hi: 'घर का शुद्ध मर्यादित सात्विक भोजन, शुद्ध घी की रोटियां', en: 'Pure homemade Jain meals & organic hand-churned ghee rotis' },
    reviews: [],
    lat: 22.7550,
    lng: 75.8950,
    state: 'MP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (साधार्मिक वात्सल्य एवं शुचिता सेवा)', en: 'Free (Sadharmik Vatsalya service)' }
  },
  {
    id: 'k-mp-3',
    name: { hi: 'श्री दिगंबर जैन धर्मशाला भोजनालय, हबीबगंज', en: 'Shri Digambar Jain Dharamshala Habibganj Dining Room' },
    type: 'dharamshala',
    address: { hi: 'ई-7, हबीबगंज दिगंबर जैन मंदिर परिसर, अरेरा कॉलोनी, भोपाल, मध्य प्रदेश', en: 'E-7, Habibganj Digambar Jain Mandir Campus, Arera Colony, Bhopal, MP' },
    city: 'Bhopal',
    contact: '+91 75524 63510',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 3.1,
    aharTimings: { hi: 'दोपहर ११:०० - १:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'बुंदेली दाल, चावल, मर्यादित हरी मौसमी सब्जियां', en: 'Bundeli Dal, Rice & non-root seasonal vegetables' },
    reviews: [
      { author: 'श्रेयांश जैन', rating: 5, comment: { hi: 'भोपाल आने पर भोजन की कोई चिंता नहीं रहती, शुचिता पूर्ण व्यवस्था है।', en: 'Absolute peace of mind for food when in Bhopal, stellar purity.' }, date: '2026-05-29' }
    ],
    lat: 23.2180,
    lng: 77.4390,
    state: 'MP',
    costType: 'nominal',
    costRupees: 80,
    costInfo: { hi: '₹८० (नाममात्र रक्षक शुल्क)', en: '₹80 (Nominal support fee)' }
  },
  {
    id: 'k-mp-4',
    name: { hi: 'श्री दिगंबर जैन धर्मशाला भोजनालय, जयसिंहपुरा', en: 'Shri Digambar Jain Bhojnalaya Jaisinghpura' },
    type: 'dharamshala',
    address: { hi: 'जयसिंहपुरा जैन अतिशय क्षेत्र परिसर, महाकाल मार्ग के समीप, उज्जैन, मध्य प्रदेश', en: 'Jaisinghpura Jain Temple Complex, near Mahakal Marg, Ujjain, MP' },
    city: 'Ujjain',
    contact: '+91 94250 81230',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 1.8,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:१५ - सूर्यास्त', en: '11:00 AM - 1:30 PM, 5:15 PM - Sunset' },
    specialty: { hi: 'मावा घी मर्यादित चूरमा एवं मालवी कढ़ी रोटली', en: 'Pure ghee Churma & restricted Malvi Kadhi Rotli' },
    reviews: [],
    lat: 23.1760,
    lng: 75.7885,
    state: 'MP',
    costType: 'nominal',
    costRupees: 65,
    costInfo: { hi: '₹६५ (मंदिर ट्रस्ट सहयोग राशि)', en: '₹65 (Temple Trust nominal cost)' }
  },
  {
    id: 'k-mp-5',
    name: { hi: 'श्री कुंडलपुर सिद्ध क्षेत्र बड़े बाबा भोजनालय (पवित्र ग्राम)', en: 'Shri Kundalpur Bade Baba Pilgrim Dining Hall' },
    type: 'dharamshala',
    address: { hi: 'सिद्धक्षेत्र कुंडलपुरजी, दमोह जिला, मध्य प्रदेश', en: 'Siddha Kshetra Kundalpur Road, Damoh District, MP' },
    city: 'Kundalpur',
    contact: '+91 78122 52202',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.1,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:०० - सूर्यास्त', en: '11:00 AM - 2:00 PM, 5:00 PM - Sunset' },
    specialty: { hi: 'अमृतमयी कढ़ी, बुंदेली दाल, छाछ (गलन मर्यादित)', en: 'Nectar-like Kadhi, Bundeli Dal & pure filtered Buttermilk' },
    reviews: [
      { author: 'पुलकित जैन', rating: 5, comment: { hi: 'कुंडलपुर के बड़े बाबा मंदिर में सधर्मी वात्सल्य अतुलनीय है। भोजन अति स्वादिष्ट एवं पूर्ण शुद्ध है!', en: 'Sadharmik hospitality at Bade Baba Kundalpur is exceptional. Extremely tasty & pure.' }, date: '2026-06-03' }
    ],
    lat: 23.9780,
    lng: 79.6730,
    state: 'MP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (वात्सल्य भोजनशाला प्रसाद)', en: 'Free (Sadharmik pilgrim prasad)' }
  },
  {
    id: 'k-mp-6',
    name: { hi: 'श्री सोनागिर सिद्धक्षेत्र दिगंबर जैन धर्मशाला भोजनालय', en: 'Shri Sonagiri Siddha Kshetra Dining Hall' },
    type: 'dharamshala',
    address: { hi: 'पहाड़ी तलहटी मुख्य द्वार के सामने, सोनागिर, दतिया जिला, मध्य प्रदेश', en: 'Foothills Main Gate, Sonagiri, Datia District, Madhya Pradesh' },
    city: 'Sonagiri',
    contact: '+91 75222 62235',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 0.4,
    aharTimings: { hi: 'दोपहर १०:४५ - १:३०, शाम ५:०० - सूर्यास्त पूर्व', en: '10:45 AM - 1:30 PM, 5:00 PM - Pre-sunset' },
    specialty: { hi: 'मर्यादित सूखा मसाला पूरी, सादा बुंदेली थाली', en: 'Restricted dry spice Puri & traditional Bundelkhandi Thali' },
    reviews: [],
    lat: 25.6888,
    lng: 78.3695,
    state: 'MP',
    costType: 'nominal',
    costRupees: 50,
    costInfo: { hi: '₹५० (श्रद्धालु टोकन राशि)', en: '₹50 (Nominal Pilgrim Thali Token)' }
  },
  {
    id: 'k-mp-7',
    name: { hi: 'श्री दिगंबर जैन नया बाज़ार मंदिर अहारशाला, ग्वालियर', en: 'Shri Digambar Jain Naya Bazar Aharshala Gwalior' },
    type: 'dharamshala',
    address: { hi: 'ऐतिहासिक नया बाजार जैन मंदिर परिसर, लश्कर, ग्वालियर, मध्य प्रदेश', en: 'Historic Naya Bazar Jain Mandir Complex, Lashkar, Gwalior, MP' },
    city: 'Gwalior',
    contact: '+91 75124 23315',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 1.2,
    aharTimings: { hi: 'दोपहर ११:०० - १:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'पारंपरिक कूट मसालों से युक्त मर्यादित दाल चपाती', en: 'Traditional Stone-ground Spices with soft limits Chapati' },
    reviews: [],
    lat: 26.2110,
    lng: 78.1690,
    state: 'MP',
    costType: 'nominal',
    costRupees: 50,
    costInfo: { hi: '₹५० (धार्मिक सेवा टोकन)', en: '₹50 (Religious Service Token)' }
  },
  {
    id: 'k-mp-8',
    name: { hi: 'श्री गोपालगंज दिगंबर जैन मंदिर भोजनालय, सागर', en: 'Shri Gopalganj Digambar Jain Temple Bhojnalaya Sagar' },
    type: 'dharamshala',
    address: { hi: 'जैन मंदिर परिसर, गोपालगंज, सागर, मध्य प्रदेश', en: 'Jain Mandir Road, Gopalganj, Sagar, Madhya Pradesh' },
    city: 'Sagar',
    contact: '+91 75822 41150',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.5,
    aharTimings: { hi: 'दोपहर ११:१५ - १:३०, शाम ५:४५ - सूर्यास्त', en: '11:15 AM - 1:30 PM, 5:45 PM - Sunset' },
    specialty: { hi: 'बुंदेलखंडी मर्यादित कढ़ी खीचड़ी एवं मर्यादित शुद्ध घी फूलका', en: 'Bundelkhandi restricted Kadhi Khichdi & organic ghee Phulka' },
    reviews: [
      { author: 'निखिल जैन', rating: 5, comment: { hi: 'सागर का सबसे सात्विक और स्वच्छ भोजनालय। आदर भाव अत्यंत सराहनीय है!', en: 'Most satvik and clean bhojnalaya in Sagar. Outstanding respect!' }, date: '2026-06-03' }
    ],
    lat: 23.8420,
    lng: 78.7450,
    state: 'MP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (नाममात्र सहयोग स्वरूप)', en: '₹60 (Nominal Donation Support)' }
  },
  {
    id: 'k-mp-9',
    name: { hi: 'श्री हनुमानताल दिगंबर जैन मंदिर धर्मशाला, जबलपुर', en: 'Shri Hanumantal Digambar Jain Dharamshala Jabalpur' },
    type: 'dharamshala',
    address: { hi: 'हनुमानताल बड़ी जैन धर्मशाला, जबलपुर, मध्य प्रदेश', en: 'Hanumantal Bada Jain Dharamshala, Jabalpur, MP' },
    city: 'Jabalpur',
    contact: '+91 76124 15930',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 0.9,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 2:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'महाकौशली मर्यादित भरवां परवल, दाल व सात्विक छाछ', en: 'Mahakoshal restricted Parwal, lentils & fresh buttermilk' },
    reviews: [],
    lat: 23.1890,
    lng: 79.9790,
    state: 'MP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (सादर धर्मशाला सेवा थाली)', en: '₹60 (Nominal Dharamshala Thali)' }
  },
  {
    id: 'k-mp-10',
    name: { hi: 'शुद्धम् श्रावक थाली रेस्टोरेंट (विजयनगर)', en: 'Shuddham Shravak Thali Restaurant Vijay Nagar' },
    type: 'restaurant',
    address: { hi: 'सत्य साईं चौराहा, विजय नगर, इन्दौर, मध्य प्रदेश', en: 'Satya Sai square, Vijay Nagar, Indore, Madhya Pradesh' },
    city: 'Indore',
    contact: '+91 98932 55432',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 3.2,
    aharTimings: { hi: 'दोपहर १२:०० - ३:००, शाम ६:०० - सूर्यास्त कठोर नियम', en: '12:00 PM - 3:00 PM, 6:00 PM - Sunset Strict Rule' },
    specialty: { hi: '१००% शुद्ध कंदमूल त्यागी पारंपरिक जैन मिलेट्स भोजनशाला', en: '100% pure zero root vegetable Millets Jain thali' },
    reviews: [],
    lat: 22.7610,
    lng: 75.8970,
    state: 'MP',
    costType: 'paid',
    costRupees: 130,
    costInfo: { hi: '₹१३० (सशुल्क शुद्ध सात्विक भोजन)', en: '₹130 (Paid Pure Satvik Thali)' }
  },
  {
    id: 'k-mp-11',
    name: { hi: 'श्री सुपर पार्श्वनाथ गृह टिफिन सेवा (अहिंसा भक्ति)', en: 'Shri Super Parshvanath Home Cooked Tiffin Dewas' },
    type: 'family',
    address: { hi: '४२, अलायंस हाइट्स, बैंक नोट प्रेस मार्ग, देवास, मध्य प्रदेश', en: '42, Alliance Heights, Bank Note Press Road, Dewas, MP' },
    city: 'Dewas',
    contact: '+91 72722 51102',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 1.5,
    aharTimings: { hi: 'दोपहर ११:३० - १:०० (केवल सधर्मी वितरण)', en: '11:30 AM - 1:00 PM (Strictly delivery only)' },
    specialty: { hi: 'देवास मर्यादित सात्विक टिफिन, छने पानी की बनी सुपाच्य कढ़ी', en: 'Dewas local pure code tiffins & high-digestive satvik Kadhi' },
    reviews: [],
    lat: 22.9710,
    lng: 76.0610,
    state: 'MP',
    costType: 'nominal',
    costRupees: 70,
    costInfo: { hi: '₹७० (नाममात्र सहयोग शुल्क)', en: '₹70 (Nominal Delivery support contribution)' }
  },
  {
    id: 'k-mp-12',
    name: { hi: 'श्री मक्सी पार्श्वनाथ जैन तीर्थ अहारशाला', en: 'Shri Maksi Parshvanath Jain Teerth Bhojnalaya' },
    type: 'dharamshala',
    address: { hi: 'मुख्य मंदिर मार्ग, मक्सी सिद्ध क्षेत्र, शाजापुर जिला, मध्य प्रदेश', en: 'Main Mandir Marg, Maksi Siddha Kshetra, Shajapur District, MP' },
    city: 'Maksi',
    contact: '+91 73622 34415',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 0.2,
    aharTimings: { hi: 'दोपहर १०:४५ - १:३०, शाम ५:०० - सूर्यास्त', en: '10:45 AM - 1:30 PM, 5:00 PM - Sunset' },
    specialty: { hi: 'अमृत बासुंदी, बुंदेली दाल, कढ़ी (पूर्ण मर्यादित कुआं जल)', en: 'Amrit Basundi & Bundeli Dal (Strictly pure well filtered water)' },
    reviews: [],
    lat: 23.2505,
    lng: 76.1510,
    state: 'MP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर साधर्मिक वात्सल्य प्रसादी)', en: 'Free (Complementary Sadharmik Prasad)' }
  },
  {
    id: 'k-mp-13',
    name: { hi: 'श्री सोनागिर सिद्धदर्शन गृह चौका (सधर्मी विश्राम)', en: 'Shri Sonagiri Siddha Darshan Home Chouka' },
    type: 'family',
    address: { hi: 'मंदिर ३६ के पीछे, पहाड़ी तलहटी, सोनागिर जी, मध्य प्रदेश', en: 'Behind Temple 36, Foothills, Sonagiri Ji, Madhya Pradesh' },
    city: 'Sonagiri',
    contact: '+91 94251 88450',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.3,
    aharTimings: { hi: 'दोपहर ११:०० - १:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'बुंदेली कढ़ी, मर्यादित सूखे मसाले की रोटियां', en: 'Bundeli traditional Kadhi & restricted hand ground spices raw Roti' },
    reviews: [],
    lat: 25.6895,
    lng: 78.3685,
    state: 'MP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर साधार्मिक वात्सल्य)', en: 'Free (Sadharmik Vatsalya Host)' }
  },
  {
    id: 'k-mp-14',
    name: { hi: 'श्री दिगंबर जैन धर्मशाला अहारशाला, कटनी', en: 'Shri Digambar Jain Dharamshala Aharshala Katni' },
    type: 'dharamshala',
    address: { hi: 'मेन स्टेशन रोड़, सुभाष चौक के पास, कटनी, मध्य प्रदेश', en: 'Main Station Road, near Subhash Chowk, Katni, MP' },
    city: 'Katni',
    contact: '+91 76222 45210',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 1.1,
    aharTimings: { hi: 'दोपहर ११:०० - १:५०, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:50 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'घर जैसी मर्यादित सात्विक दाल चावल व कढ़ी थाली', en: 'Homely limited satvik Dal, Rice & Kadhi Thali' },
    reviews: [],
    lat: 23.8310,
    lng: 80.3840,
    state: 'MP',
    costType: 'nominal',
    costRupees: 80,
    costInfo: { hi: '₹८० (सादर भोजनालय सहयोग शुल्क)', en: '₹80 (Nominal dining support contribution)' }
  },
  {
    id: 'k-mp-15',
    name: { hi: 'श्री शीतलधाम अतिशय क्षेत्र भोजनालय, विदिशा', en: 'Shri Sheetaldham Atishay Kshetra Bhojnalaya Vidisha' },
    type: 'dharamshala',
    address: { hi: 'शीतलधाम तीर्थ क्षेत्र मार्ग, बेतवा तट के समीप, विदिशा, मध्य प्रदेश', en: 'Sheetaldham Teerth Complex, near Betwa Bank, Vidisha, MP' },
    city: 'Vidisha',
    contact: '+91 75924 11200',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 0.4,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:१५ - सूर्यास्त', en: '11:00 AM - 2:00 PM, 5:15 PM - Sunset' },
    specialty: { hi: 'शीतलनाथ प्रभु मंदिर मर्यादित मालवी बेसन गट्टा करी', en: 'Sheetalnath Prabhu Mandir authentic satvik Besan thali' },
    reviews: [],
    lat: 23.5310,
    lng: 77.8290,
    state: 'MP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (सहयोग सेवा राशि)', en: '₹60 (Nominal service contribution)' }
  },

  // ==========================================
  // UTTAR PRADESH (UP) AUTHENTIC JAIN FOOD CHOUKAS
  // ==========================================
  {
    id: 'k-up-1',
    name: { hi: 'श्री दिगंबर जैन बड़ा मंदिर भोजनशाला (हस्तिनापुर)', en: 'Shri Digambar Jain Bada Mandir Bhojnalaya Hastinapur' },
    type: 'dharamshala',
    address: { hi: 'ऐतिहासिक जैन बड़ा मंदिर परिसर, हस्तिनापुर, मेरठ जिला, उत्तर प्रदेश', en: 'Historic Jain Bada Mandir Campus, Hastinapur, Meerut District, UP' },
    city: 'Hastinapur',
    contact: '+91 12123 32520',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.3,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 2:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'शुद्ध मर्यादित बुंदेली दाल बाफले एवं गन्ना रस अक्षत तृतीया रस', en: 'Pure restricted Dal Bafle & traditional fresh cane-juice offerings' },
    reviews: [
      { author: 'अरिहन्त शास्त्री', rating: 5, comment: { hi: 'आदिनाथ प्रभु के पारणा की पावन भूमि। यहाँ का भोजन और व्यवस्था पूर्ण मर्यादित व सात्विक है।', en: 'Holy land of Lord Adinaths fast-breaking. Excellent standard of purity and taste.' }, date: '2026-06-03' }
    ],
    lat: 29.1718,
    lng: 78.0205,
    state: 'UP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सधर्मी वात्सल्य प्रसाद)', en: 'Free (Sadharmik Prasad)' }
  },
  {
    id: 'k-up-2',
    name: { hi: 'जम्बुद्वीप अतिशय क्षेत्र भोजनशाला', en: 'Jambudweep Atishay Kshetra Dining Hall' },
    type: 'dharamshala',
    address: { hi: 'जंबूद्वीप रचना परिसर, हस्तिनापुर, मेरठ जिला, उत्तर प्रदेश', en: 'Jambudweep Structure Campus, Hastinapur, Meerut District, UP' },
    city: 'Hastinapur',
    contact: '+91 12123 12122',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 0.6,
    aharTimings: { hi: 'दोपहर ११:०० - १:४५, शाम ५:१५ - सूर्यास्त पूर्व', en: '11:00 AM - 1:45 PM, 5:15 PM - Pre-sunset' },
    specialty: { hi: 'खड़ा मूंग की मर्यादित चपाती, मसालेदार सात्विक गट्टा', en: 'Whole-Moong soft ghee Chapatis & spicy organic Gatta curries' },
    reviews: [],
    lat: 29.1750,
    lng: 78.0250,
    state: 'UP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (सहयोग सेवा राशि)', en: '₹60 (Nominal support charge)' }
  },
  {
    id: 'k-up-3',
    name: { hi: 'श्री दिगंबर जैन अतिशय क्षेत्र भोजनालय (भेलूपुर)', en: 'Shri Digambar Jain Birthplace Dining Hall' },
    type: 'dharamshala',
    address: { hi: 'प्रभु पार्श्वनाथ जन्मभूमि तीर्थ क्षेत्र भेलूपुर, वाराणसी, उत्तर प्रदेश', en: 'Lord Parshvanath Birthplace Temple, Bhelupur, Varanasi, UP' },
    city: 'Varanasi',
    contact: '+91 94152 03805',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 1.2,
    aharTimings: { hi: 'दोपहर ११:१५ - १:३०, शाम ५:३० - सूर्यास्त', en: '11:15 AM - 1:30 PM, 5:30 PM - Sunset' },
    specialty: { hi: 'मर्यादित चावल, दाल, शुद्ध परवल मौसमी सब्जी', en: 'Locally sourced fresh rice, lentils & seasonal non-root gourds' },
    reviews: [],
    lat: 25.3010,
    lng: 82.9920,
    state: 'UP',
    costType: 'nominal',
    costRupees: 75,
    costInfo: { hi: '₹७५ (नाममात्र सहयोग टोकन)', en: '₹75 (Nominal pilgrim thali)' }
  },
  {
    id: 'k-up-4',
    name: { hi: 'श्रीमती सरला देवी जैन श्रावक अतिथि चौका, वाराणसी', en: 'Srimati Sarla Devi Jain Shravak Guest Chouka' },
    type: 'family',
    address: { hi: 'डी-४१, दशाश्वमेध मार्ग, भेलूपुर के पास, वाराणसी, उत्तर प्रदेश', en: 'D-41, Dashashwamedh Road, near Bhelupur, Varanasi, UP' },
    city: 'Varanasi',
    contact: '+91 94158 11920',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 2.1,
    aharTimings: { hi: 'दोपहर ११:३० - १:००, शाम ६:०० - सूर्यास्त पूर्व', en: '11:30 AM - 1:00 PM, 6:00 PM - Pre-sunset' },
    specialty: { hi: 'उत्तर भारतीय शुद्ध मर्यादित फुलके एवं रोटियां, हरी मिर्च का आचार', en: 'Pure North Indian soft handmade rotis & organic green chili pickles' },
    reviews: [
      { author: 'चारू जैन', rating: 5, comment: { hi: 'बनारस की इस पवित्र हवेली में घर जैसा मर्यादा भोजन मिलना अनुपम कृपा है!', en: 'Blessed to find pure homely Jain code food in Vanarasi near ghats!' }, date: '2026-06-01' }
    ],
    lat: 25.3120,
    lng: 82.9780,
    state: 'UP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर साधर्मिक वात्सल्य)', en: 'Free (Devotional Sadharmik host)' }
  },
  {
    id: 'k-up-5',
    name: { hi: 'श्री दिगंबर जैन अयोध्या तीर्थ क्षेत्र भोजनशाला', en: 'Shri Digambar Jain Ayodhya Dining Room' },
    type: 'dharamshala',
    address: { hi: 'कटरा मोहल्ला, दिगंबर जैन मंदिर परिसर, अयोध्या, उत्तर प्रदेश', en: 'Katra, near Digambar Jain Mandir, Ayodhya, UP' },
    city: 'Ayodhya',
    contact: '+91 94505 06220',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 2.5,
    aharTimings: { hi: 'दोपहर ११:०० - १:००, शाम ५:१५ - सूर्यास्त पूर्व', en: '11:00 AM - 1:00 PM, 5:15 PM - Pre-sunset' },
    specialty: { hi: 'सावरण देसी रोटला एवं सात्विक दाल पंचरत्न (कंदमूल रहित)', en: 'Pure desi rotis & Satvik Panchratna Dal (strictly no-onion garlic)' },
    reviews: [],
    lat: 26.7956,
    lng: 82.1943,
    state: 'UP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (नाममात्र सहयोग थाली)', en: '₹60 (Nominal Maintenance Cost)' }
  },
  {
    id: 'k-up-6',
    name: { hi: 'श्रीमती रंजना जैन सात्विक रसोई, लखनऊ', en: 'Srimati Ranjana Jain Satvik Kitchen Lucknow' },
    type: 'family',
    address: { hi: 'बी-२/३४, सेक्टर ऍफ़, जानकीपुरम, लखनऊ, उत्तर प्रदेश', en: 'B-2/34, Sector F, Jankipuram, Lucknow, UP' },
    city: 'Lucknow',
    contact: '+91 94150 25960',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 3.8,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त पूर्व', en: '11:00 AM - 1:30 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'शुद्ध मर्यादित बुंदेलखंडी रसोई, ताजा हल्का गरम भोजन', en: 'Homely limited Bundelkhandi kitchen, fresh warm meals' },
    reviews: [],
    lat: 26.8467,
    lng: 80.9462,
    state: 'UP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर साधर्मिक वात्सल्य)', en: 'Free (Sadharmik Vatsalya hospitality)' }
  },
  {
    id: 'k-up-7',
    name: { hi: 'श्री दिगंबर जैन धर्मशाला भोजनालय, मेरठ', en: 'Shri Digambar Jain Dharamshala Bhojnalaya Meerut' },
    type: 'dharamshala',
    address: { hi: 'जैन मंदिर मार्ग, बुढ़ाना गेट, मेरठ, उत्तर प्रदेश', en: 'Jain Mandir Road, Budhana Gate, Meerut, UP' },
    city: 'Meerut',
    contact: '+91 12126 44812',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 1.5,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त', en: '11:00 AM - 1:30 PM, 5:30 PM - Sunset' },
    specialty: { hi: 'मर्यादित मूंग दाल पूरी, सुपाच्य सात्विक सब्जी', en: 'Restricted Moong Dal Puris & satvik digestive seasonal veg' },
    reviews: [],
    lat: 28.9845,
    lng: 77.7064,
    state: 'UP',
    costType: 'nominal',
    costRupees: 60,
    costInfo: { hi: '₹६० (सादर भोजनालय सहयोग थाली)', en: '₹60 (Nominal dining support contribution)' }
  },
  {
    id: 'k-up-8',
    name: { hi: 'श्री देवगढ़ अतिशय क्षेत्र भोजनशाला', en: 'Shri Deogarh Atishay Kshetra Bhojnalaya' },
    type: 'dharamshala',
    address: { hi: 'देवगढ़ वन अभ्यारण्य क्षेत्र, जैन मंदिर पहाड़ी तलहटी, ललितपुर जिला, उत्तर प्रदेश', en: 'Deogarh Sanctuary Road, Jain Mandir foothills, Lalitpur District, UP' },
    city: 'Deogarh',
    contact: '+91 94251 12050',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.2,
    aharTimings: { hi: 'दोपहर १०:३० - १:००, शाम ५:०० - सूर्यास्त', en: '10:30 AM - 1:00 PM, 5:00 PM - Sunset' },
    specialty: { hi: 'जड़ी बूटियों से युक्त मर्यादित सात्विक दाल-चपाती', en: 'Pure stone-milled herbal flour Chapatis & Bundelkhandi Dal' },
    reviews: [
      { author: 'विनेय जैन', rating: 5, comment: { hi: 'ऐतिहासिक देवगढ़ क्षेत्र की भोजनशाला का भोजन अमृत तुल्य है। शुद्ध कुएं का उत्तम छना पानी है।', en: 'Deogarh historical area dining room serves nectar thali. Strict filtered well-water.' }, date: '2026-05-30' }
    ],
    lat: 24.5230,
    lng: 78.2562,
    state: 'UP',
    costType: 'nominal',
    costRupees: 50,
    costInfo: { hi: '₹५० (धार्मिक क्षेत्र सेवा शुल्क)', en: '₹50 (Nominal Holy Kshetra fee)' }
  },
  {
    id: 'k-up-9',
    name: { hi: 'श्रीमती प्रतिभा जैन श्रावक रसोई (सादर वात्सल्य), कानपुर', en: 'Srimati Pratibha Jain Shravak Home Kitchen Kanpur' },
    type: 'family',
    address: { hi: '१२/४८, कौशल्पुरी, जैन धर्मशाला के समीप, कानपुर, उत्तर प्रदेश', en: '12/48, Kaushalpuri, Near Jain Dharamshala, Kanpur, UP' },
    city: 'Kanpur',
    contact: '+91 94154 53301',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 2.3,
    aharTimings: { hi: 'दोपहर ११:३० - १:००, शाम ५:३० - सूर्यास्त पूर्व', en: '11:30 AM - 1:00 PM, 5:30 PM - Pre-sunset' },
    specialty: { hi: 'सधर्मी वात्सल्य मर्यादित शुद्ध छने जल की चपाती व मूंग दाल', en: 'Sadharmik code pure filtered water Roti & soft light lentils' },
    reviews: [],
    lat: 26.4670,
    lng: 80.3210,
    state: 'UP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर साधर्मिक वात्सल्य सेवा)', en: 'Free (Devoted Sadharmik hospitality service)' }
  },
  {
    id: 'k-up-10',
    name: { hi: 'पार्श्व श्रावक मर्यादित रेस्टोरेंट, कानपुर', en: 'Parshva Shravak Pure Veg Restaurant Kanpur' },
    type: 'restaurant',
    address: { hi: 'सिविल लाइन्स, वीआईपी रोड के निकट, कानपुर, उत्तर प्रदेश', en: 'Civil Lines, near VIP Road, Kanpur, UP' },
    city: 'Kanpur',
    contact: '+91 94501 22890',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 3.5,
    aharTimings: { hi: 'दोपहर १२:०० - ३:००, शाम ६:०० - सूर्यास्त कठोर वर्जित थाली', en: '12:00 PM - 3:00 PM, 6:00 PM - Sunset strict food thali' },
    specialty: { hi: '१००% लहसुन प्याज कंदमूल रहित मर्यादित थाली', en: '100% garlic-onion/root vegetable free restricted thali' },
    reviews: [],
    lat: 26.4780,
    lng: 80.3450,
    state: 'UP',
    costType: 'paid',
    costRupees: 145,
    costInfo: { hi: '₹१४५ (सशुल्क शुद्ध मर्यादित भोजन)', en: '₹145 (Paid Pure Jain Meal)' }
  },
  {
    id: 'k-up-11',
    name: { hi: 'श्री दिगंबर जैन जीरो रोड धर्मशाला भोजनालय, प्रयागराज', en: 'Shri Digambar Jain Zero Road Dharamshala Prayagraj' },
    type: 'dharamshala',
    address: { hi: 'जीरो रोड जैन मंदिर परिसर, कोतवाली के निकट, प्रयागराज, उत्तर प्रदेश', en: 'Zero Road Jain Mandir Campus, near Kotwali, Prayagraj, UP' },
    city: 'Prayagraj',
    contact: '+91 53224 01225',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 1.0,
    aharTimings: { hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त', en: '11:00 AM - 1:30 PM, 5:30 PM - Sunset' },
    specialty: { hi: 'मर्यादित मूंग दाल पूरी, सुपाच्य आलू रहित सात्विक कढ़ी', en: 'Restricted crispy Moong Dal Puri & digestive root-free Kadhi' },
    reviews: [],
    lat: 25.4380,
    lng: 81.8410,
    state: 'UP',
    costType: 'nominal',
    costRupees: 70,
    costInfo: { hi: '₹७० ( सादर भोजनालय सहयोग थाली)', en: '₹70 (Nominal dining support contribution)' }
  },
  {
    id: 'k-up-12',
    name: { hi: 'श्री दिगंबर जैन मंदिर अहारशाला, झाँसी', en: 'Shri Digambar Jain Mandir Aharshala Jhansi' },
    type: 'dharamshala',
    address: { hi: 'दिगंबर जैन मंदिर जी, उनओ बालाजी रोड, झाँसी, उत्तर प्रदेश', en: 'Digambar Jain Temple, Unao Balaji Road, Jhansi, UP' },
    city: 'Jhansi',
    contact: '+91 51024 45610',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.9,
    pureUtensils: true,
    distanceSimulated: 0.8,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:१५ - सूर्यास्त पूर्व', en: '11:00 AM - 2:00 PM, 5:15 PM - Pre-sunset' },
    specialty: { hi: 'बुंदेली दाल, कढ़ी, शुद्ध मर्यादित हरी लौकी सब्जी', en: 'Bundelkhandi pure Dal, Kadhi & seasonal bottle-gourds' },
    reviews: [],
    lat: 25.4520,
    lng: 78.5720,
    state: 'UP',
    costType: 'nominal',
    costRupees: 75,
    costInfo: { hi: '₹७५ (सहयोग स्वरूप टोकन मूल्य)', en: '₹75 (Nominal maintenance support token)' }
  },
  {
    id: 'k-up-13',
    name: { hi: 'श्री चौरसी दिगंबर जैन सिद्ध क्षेत्र भोजनालय, मथुरा', en: 'Shri Chaurasi Digambar Jain Siddha Kshetra Mathura' },
    type: 'dharamshala',
    address: { hi: 'चौरसी जैन मंदिर रोड़, राष्ट्रीय राजमार्ग निकट, मथुरा, उत्तर प्रदेश', en: 'Chaurasi Jain Mandir Road, National Highway Bypass, Mathura, UP' },
    city: 'Mathura',
    contact: '+91 94122 78310',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 5.0,
    pureUtensils: true,
    distanceSimulated: 0.1,
    aharTimings: { hi: 'दोपहर १०:४५ - १:३०, शाम ५:१५ - सूर्यास्त', en: '10:45 AM - 1:30 PM, 5:15 PM - Sunset' },
    specialty: { hi: 'प्रभु ध्यान प्रसादी मर्यादित चपाती, मसालेदार खड़ी मोगर', en: 'Restricted fresh wheat rotis & spiced traditional split beans' },
    reviews: [],
    lat: 27.4850,
    lng: 77.6790,
    state: 'UP',
    costType: 'free',
    costRupees: 0,
    costInfo: { hi: 'निशुल्क (सादर तीर्थ वात्सल्य प्रसादी)', en: 'Free (Complementary Teerth Sadharmik Prasad)' }
  },
  {
    id: 'k-up-14',
    name: { hi: 'महंत सम्भवनाथ अतिशय क्षेत्र भोजनशाला, श्रावस्ती', en: 'Sambhavnath Atishay Kshetra Bhojnalaya Shravasti' },
    type: 'dharamshala',
    address: { hi: 'सम्भवनाथ जन्मभूमि कटरा श्रावस्ती, उत्तर प्रदेश', en: 'Lord Sambhavnath Birthplace Katra, Shravasti District, UP' },
    city: 'Shravasti',
    contact: '+91 94520 11950',
    sunsetCompliant: true,
    filteredWater: true,
    noRootsAllowed: true,
    rating: 4.8,
    pureUtensils: true,
    distanceSimulated: 0.4,
    aharTimings: { hi: 'दोपहर ११:०० - २:००, शाम ५:०० - सूर्यास्त', en: '11:00 AM - 2:00 PM, 5:00 PM - Sunset' },
    specialty: { hi: 'मर्यादित मूंग खिचड़ी, सादी सात्विक बुंदेली थाली', en: 'Restricted Moong Khichdi & simple satvik Bundeli plate' },
    reviews: [],
    lat: 27.5090,
    lng: 82.0450,
    state: 'UP',
    costType: 'nominal',
    costRupees: 50,
    costInfo: { hi: '₹५० (अतिशय क्षेत्र सहयोग शुल्क)', en: '₹50 (Teerth Kshetra Nominal support)' }
  }
];

export default function VerifiedFoodPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  // Firestore & Authentication States
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [developerCode, setDeveloperCode] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [showPasscodeForm, setShowPasscodeForm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeChatKitchenId, setActiveChatKitchenId] = useState<string | null>(null);
  const [userChatText, setUserChatText] = useState('');
  const [mySubmittedIds, setMySubmittedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('my_kitchen_submissions') || '[]');
    } catch {
      return [];
    }
  });

  // Search Filter States (Unified, reactive search that filters immediately)
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeDistance, setActiveDistance] = useState<number>(30); // Default local range 30 KM is much more intuitive
  const [activeOriginCityKey, setActiveOriginCityKey] = useState<string>('');
  const [activeStateFilter, setActiveStateFilter] = useState<'all' | 'MP' | 'UP' | 'Other'>('all');
  const [activeCostFilter, setActiveCostFilter] = useState<'all' | 'free' | 'nominal' | 'paid'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  // Common UI State
  const [activeType, setActiveType] = useState<'all' | 'family' | 'dharamshala' | 'restaurant'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [strictSunset, setStrictSunset] = useState<boolean>(false);

  // High-Tech Geo-Location States
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMethod, setLocationMethod] = useState<'none' | 'gps' | 'city'>('none');
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Form states for registering new kitchens with State and Cost
  const [newCostType, setNewCostType] = useState<'free' | 'nominal' | 'paid'>('free');
  const [newCostRupees, setNewCostRupees] = useState<number>(0);
  const [newKitchenState, setNewKitchenState] = useState<'MP' | 'UP' | 'Karnataka' | 'Maharashtra' | 'Tamil Nadu' | 'Rajasthan' | 'Gujarat' | 'Other'>('MP');

  // Ground registration form inputs
  const [newNameHi, setNewNameHi] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newType, setNewType] = useState<'family' | 'dharamshala' | 'restaurant'>('family');
  const [newAddressHi, setNewAddressHi] = useState('');
  const [newAddressEn, setNewAddressEn] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newSpecialtyHi, setNewSpecialtyHi] = useState('');
  const [newSpecialtyEn, setNewSpecialtyEn] = useState('');
  const [pledgeChecked, setPledgeChecked] = useState(false);

  // Review interaction state
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Radar animation sweep simulator timer
  const [radarDegrees, setRadarDegrees] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setRadarDegrees(prev => (prev + 3) % 360);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  // Admin Verification & Login Hooks
  useEffect(() => {
    if (user?.email === 'samiljain0111@gmail.com' || role === 'admin') {
      setIsDeveloper(true);
    }
  }, [user, role]);

  const verifyPasscode = () => {
    if (developerCode === '1008') {
      setIsDeveloper(true);
      alert(language === 'en' ? '🔑 Developer Mode Unlocked! You have full database review, approval and message dispatch permissions.' : '🔑 क्रेडेंशियल स्वीकृत! आपके पास पूर्ण अधिकार सक्रिय हो चुके हैं।');
    } else {
      alert(language === 'en' ? '❌ Invalid Passcode!' : '❌ अमान्य पासवर्ड क्रेडेंशियल!');
    }
  };

  // Firestore synchronization loop & initialization seeding
  useEffect(() => {
    const q = collection(db, 'kitchens');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log("Seeding kitchens database...");
          for (const k of INITIAL_KITCHENS) {
            await setDoc(doc(db, 'kitchens', k.id), {
              ...k,
              status: 'approved',
              chatHistory: []
            });
          }
        } else {
          const list: Kitchen[] = [];
          snapshot.forEach((snapDoc) => {
            list.push({ id: snapDoc.id, ...snapDoc.data() } as any);
          });
          setKitchens(list);
        }
      } catch (err) {
        console.error("Error synchronized with kitchens: ", err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Distance Calculation Helpers
  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const getDistance = (kitchen: Kitchen): number => {
    if (userCoords) {
      return calculateHaversineDistance(userCoords.lat, userCoords.lng, kitchen.lat, kitchen.lng);
    }
    return kitchen.distanceSimulated;
  };

  // Browser Geolocation Detector
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'en' ? 'Geolocation is not supported by your browser!' : 'जीपीएस डिटेक्शन आपके ब्राउज़र में समर्थित नहीं है!');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setLocationMethod('gps');
        setActiveOriginCityKey('');
        setGpsLoading(false);
        setActiveDistance(50); // Set standard 50km standard live radius search
        setHasSearched(true);
        alert(language === 'en' ? '🎯 GPS Location acquired! Your exact distances have been calculated.' : '🎯 पावन जीपीएस स्थान प्राप्त हुआ! आपके स्थान से प्रत्येक चौके की दूरी प्रदर्शित कर दी गई है।');
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);
        alert(language === 'en' 
          ? 'Failed to obtain live location. Try selecting a Reference City from the search menu.'
          : 'मौसम या तकनीकी कारणों से लाइव स्थान नहीं मिला। कृपया सिटी ड्रापडाउन का उपयोग करें!');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Reference origin city parameter update
  const handleCityOriginChange = (cityKey: string) => {
    setActiveOriginCityKey(cityKey);
    if (cityKey === '') {
      if (locationMethod !== 'gps') {
        setUserCoords(null);
        setLocationMethod('none');
      }
    } else {
      const cityData = REFERENCE_CITIES_COORDS[cityKey];
      if (cityData) {
        setUserCoords({ lat: cityData.lat, lng: cityData.lng });
        setLocationMethod('city');
        setActiveDistance(30); // Default to a more intuitive 30km local search radius
        setHasSearched(true);
      }
    }
  };

  // Triggering native "Find" search filters scrolling
  const handleFindKitchens = () => {
    setHasSearched(true);
    const element = document.getElementById('kitchens-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(language === 'en' ? 'Searching completed! Scroll down to see results.' : 'खोज संपन्न! सूची नीचे प्रदर्शित है।');
    }
  };

  // Clearing active filters to show all India kitchens
  const handleClearFilters = () => {
    setActiveSearchQuery('');
    setActiveDistance(100);
    setActiveOriginCityKey('');
    setActiveStateFilter('all');
    setActiveCostFilter('all');
    
    setUserCoords(null);
    setLocationMethod('none');
    setHasSearched(false);
  };

  // Registering new kitchen (Adds to pending requests basket in Firestore)
  const handleAddKitchen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameHi || !newAddressHi || !newCity || !newContact) {
      alert(language === 'en' ? 'Please fill out all required fields!' : 'कृपया सभी आवश्यक फ़ील्ड भरें!');
      return;
    }
    if (!pledgeChecked) {
      alert(language === 'en' ? 'You must pledge to the strict Jain Food standards to register!' : 'पंजीकरण हेतु मर्यादा शपथ पत्र चेक करना अनिवार्य है!');
      return;
    }

    const cityKeyClean = newCity.toLowerCase().trim();
    // Use fallback coordinates or offset
    const latDefault = REFERENCE_CITIES_COORDS[cityKeyClean]?.lat || (22.7 + (Math.random() - 0.5) * 2);
    const lngDefault = REFERENCE_CITIES_COORDS[cityKeyClean]?.lng || (77.4 + (Math.random() - 0.5) * 2);

    const generatedId = "k_req_" + Date.now();
    const newKitchen: Omit<Kitchen, 'id'> & { id: string; status: 'approved' | 'pending'; chatHistory: any[] } = {
      id: generatedId,
      name: { hi: newNameHi, en: newNameEn || newNameHi },
      type: newType,
      address: { hi: newAddressHi, en: newAddressEn || newAddressHi },
      city: newCity,
      contact: newContact.trim(),
      sunsetCompliant: true,
      filteredWater: true,
      noRootsAllowed: true,
      rating: 5.0,
      pureUtensils: true,
      distanceSimulated: Number((Math.random() * 4 + 0.5).toFixed(1)),
      aharTimings: { 
        hi: 'दोपहर ११:०० - १:३०, शाम ५:३० - सूर्यास्त पूर्व', 
        en: '11:00 AM - 1:30 PM, 5:30 PM - Pre-sunset' 
      },
      specialty: { 
        hi: newSpecialtyHi || 'शुद्ध सात्विक मर्यादित भोजन', 
        en: newSpecialtyEn || 'Pure satvik restricted meals' 
      },
      reviews: [],
      lat: latDefault,
      lng: lngDefault,
      state: newKitchenState,
      costType: newCostType,
      costRupees: newCostType === 'free' ? 0 : newCostRupees,
      costInfo: {
        hi: newCostType === 'free' ? 'निशुल्क (सादर साधर्मिक वात्सल्य)' : 
            newCostType === 'nominal' ? `₹${newCostRupees} (नाममात्र सहयोग स्वरूप)` :
            `₹${newCostRupees} (सशुल्क सात्विक भोजन)`,
        en: newCostType === 'free' ? 'Free (Sadharmik Vatsalya)' :
            newCostType === 'nominal' ? `₹${newCostRupees} (Nominal support contribution)` :
            `₹${newCostRupees} (Paid Satvik Thali)`
      },
      status: 'pending',
      chatHistory: []
    };

    try {
      await setDoc(doc(db, 'kitchens', generatedId), newKitchen);
      
      const updatedList = [...mySubmittedIds, generatedId];
      setMySubmittedIds(updatedList);
      localStorage.setItem('my_kitchen_submissions', JSON.stringify(updatedList));

      setShowAddForm(false);
      // Reset form
      setNewNameEn('');
      setNewNameHi('');
      setNewAddressEn('');
      setNewAddressHi('');
      setNewCity('');
      setNewContact('');
      setNewSpecialtyHi('');
      setNewSpecialtyEn('');
      setNewCostRupees(0);
      setNewCostType('free');
      setPledgeChecked(false);

      alert(language === 'en' 
        ? '🎉 Registration Request Dispatched! It is saved as "Verification Pending". The Developer Samil Jain will review, contact, and approve soon.' 
        : '🎉 पंजीकरण अनुरोध प्रस्तुत! आपकी रसोई के विवरण "सत्यापन लंबित" में दर्ज हैं। डेवलपर समिल जैन समीक्षा कर आपसे संपर्क करेंगे तथा स्वीकृत करेंगे।');
    } catch (error) {
      console.error("Error setting kitchen: ", error);
      alert(language === 'en' ? 'Submission failed. Please check internet and try again.' : 'अनुमान त्रुटि! प्रकटन विफल। कृपया जाँच कर पुन: प्रयास करें।');
    }
  };

  // Developer approval system
  const handleApproveKitchen = async (id: string) => {
    try {
      await updateDoc(doc(db, 'kitchens', id), {
        status: 'approved'
      });
      alert(language === 'en' ? '✅ Kitchen approved and live for all users!' : '✅ चौका सफलतापूर्वक स्वीकृत और लाइव हो गया है!');
    } catch (err) {
      console.error(err);
      alert("Error approving kitchen");
    }
  };

  const handleRejectKitchen = async (id: string) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this kitchen request?' : 'क्या आप इस चौका अनुरोध को डीलीट करना चाहते हैं?')) {
      try {
        await deleteDoc(doc(db, 'kitchens', id));
        alert(language === 'en' ? '🗑️ Kitchen request removed.' : '🗑️ चौका अनुरोध हटा दिया गया है।');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Dispatch interactive review messages
  const handleSendChatMessage = async (id: string, text: string, sender: 'developer' | 'user') => {
    if (!text.trim()) return;
    try {
      const kitchenRef = doc(db, 'kitchens', id);
      const target = kitchens.find(item => item.id === id);
      if (!target) return;
      
      const newMsg = {
        sender,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString(language === 'en' ? 'en-US' : 'hi-IN', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Update local and firestore and append msg array
      const existingHistory = (target as any).chatHistory || [];
      await updateDoc(kitchenRef, {
        chatHistory: [...existingHistory, newMsg]
      });
      setUserChatText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Submission of custom review within a kitchen card (Writes directly to Firestore)
  const submitReview = async (kitchenId: string) => {
    if (!reviewAuthor.trim() || !reviewText.trim()) {
      alert(language === 'en' ? 'Please fill both name and review comment!' : 'समीक्षा हेतु कृपया नाम और टिप्पणी दर्ज करें!');
      return;
    }

    try {
      const kitchenRef = doc(db, 'kitchens', kitchenId);
      const targetKitchen = kitchens.find(k => k.id === kitchenId);
      if (!targetKitchen) return;

      const added: Review = {
        author: reviewAuthor,
        rating: reviewRating,
        comment: { hi: reviewText, en: reviewText },
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedReviews = [added, ...(targetKitchen.reviews || [])];
      const newRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));

      await updateDoc(kitchenRef, {
        reviews: updatedReviews,
        rating: newRating
      });

      setReviewAuthor('');
      setReviewText('');
      alert(language === 'en' ? 'Sadharmik review saved successfully!' : 'साधर्म्य समीक्षा सहेजी गई!');
    } catch (e) {
      console.error(e);
      alert(language === 'en' ? 'Failed to save review.' : 'समीक्षा सहेजने में त्रुटि।');
    }
  };

  // Computed Main Search Listings (Excludes pending requests for normal users)
  const filteredKitchens = kitchens.filter(k => {
    // Normal users ONLY see approved kitchens.
    // If Admin is verified, they should see approved kitchens here as well.
    if (k.status === 'pending') {
      return false;
    }

    const query = activeSearchQuery.toLowerCase();
    const matchesSearch = 
      k.city.toLowerCase().includes(query) || 
      k.name.en.toLowerCase().includes(query) || 
      k.name.hi.includes(query) ||
      k.address.en.toLowerCase().includes(query) ||
      k.address.hi.includes(query) ||
      k.state.toLowerCase().includes(query);
    
    // Distance filter: bypassed if locationMethod is 'none' (i.e., no city or GPS coordinates are specified)
    const finalDistance = getDistance(k);
    const matchesDistance = locationMethod === 'none' || finalDistance <= activeDistance;
    
    // Type filter
    const matchesType = activeType === 'all' || k.type === activeType;

    // State filter (MP, UP or all)
    const matchesState = activeStateFilter === 'all' || 
      (activeStateFilter === 'MP' && k.state === 'MP') ||
      (activeStateFilter === 'UP' && k.state === 'UP') ||
      (activeStateFilter === 'Other' && k.state !== 'MP' && k.state !== 'UP');

    // Cost filter
    const matchesCost = activeCostFilter === 'all' || k.costType === activeCostFilter;

    return matchesSearch && matchesDistance && matchesType && matchesState && matchesCost;
  });

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      
      {/* Header with Title and Unified Right Controls */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 -mt-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF3D00] to-[#FF9100] flex items-center gap-1.5 sm:gap-2 truncate">
              <Utensils className="text-[#FF3D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="truncate">{language === 'en' ? 'JAIN FOOD LOCATOR' : 'जैन फूड लोकेटर'}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-550 font-bold dark:text-gray-400 truncate hidden xs:block">
              {language === 'en' ? 'Verified Pure Jain Food on Your Journeys' : 'यात्रा के दौरान शुद्ध और सात्विक भोजन की प्रामाणिक व्यवस्था'}
            </p>
          </div>
        </div>

        {/* Right Controls Container - Symmetrical Layout with Dev Portal, Help, and Orange Translate */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isDeveloper ? (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5 rounded-xl shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                👑 {language === 'en' ? 'DEV ACTIVE' : 'देव सक्रिय'}
              </span>
              <button 
                onClick={() => {
                  setIsDeveloper(false);
                  alert(language === 'en' ? 'Dev Portal locked.' : 'डेवलपर पोर्टल लॉक किया गया।');
                }}
                className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer font-bold leading-none p-0.5"
                title={language === 'en' ? 'Lock controls' : 'नियंत्रण लॉक करें'}
              >
                🔒
              </button>
            </div>
          ) : showPasscodeForm ? (
            <div className="flex items-center gap-1 bg-white dark:bg-[#111] border border-orange-500/25 p-1 rounded-xl shadow-sm shrink-0">
              <input 
                type="password" 
                placeholder="1008"
                value={developerCode}
                onChange={(e) => setDeveloperCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    verifyPasscode();
                    setShowPasscodeForm(false);
                  }
                }}
                className="bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-lg px-1.5 py-1 text-[9px] font-bold text-center w-12 sm:w-16 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                onClick={() => {
                  verifyPasscode();
                  setShowPasscodeForm(false);
                }}
                className="px-2 py-1 bg-[#FF3D00] text-white rounded-lg text-[9px] font-black uppercase hover:bg-orange-600 active:scale-95 transition-all text-center"
              >
                ✓
              </button>
              <button
                onClick={() => setShowPasscodeForm(false)}
                className="text-[9px] text-gray-400 hover:text-gray-650 px-1 font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPasscodeForm(true)}
              className="px-2.5 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-650 dark:text-gray-350 hover:text-[#FF3D00] dark:hover:text-[#FF3D00] rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 border border-dashed border-gray-200/50 dark:border-white/5 cursor-pointer h-8 sm:h-9"
            >
              🔐 <span className="hidden xs:inline">{language === 'en' ? 'DEV PORTAL' : 'डेवलपर पटल'}</span>
            </button>
          )}

          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-550 dark:text-gray-350 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={language === 'en' ? 'Food Section Guide' : 'आहार खोजक निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button (The orange one) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-8 sm:h-9"
            title={language === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl p-5 mb-6 space-y-5 shadow-sm">
        
        {/* Row 1: Main Search text and Register Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 text-[#FF3D00]" size={18} />
            <input 
              type="text" 
              placeholder={language === 'en' ? "Search city, village, address or specialties... (e.g. Varanasi, Kundalpur, Sonagiri, Lucknow)" : "शहर, गाँव, विशिष्ट प्रसाद या चौका खोजें (जैसे: वाराणसी, कुण्डलपुर जी, सोनागिर जी, लखनऊ)..."}
              value={activeSearchQuery}
              onChange={(e) => {
                setActiveSearchQuery(e.target.value);
                setHasSearched(true);
              }}
              className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#FF3D00]"
            />
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto px-5 py-3.5 bg-gradient-to-r from-[#FF3D00] to-[#FF9100] hover:from-[#D50000] hover:to-[#FF3D00] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.02]"
          >
            <PlusCircle size={16} />
            {language === 'en' ? 'Register New Chouka' : 'साधार्मिक चौका सेवा जोड़ें'}
          </button>
        </div>

        {/* Row 2: Coordinate Origin Search & Live Geolocation Toggle */}
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-150/30 dark:border-white/5">
          
          {/* Live GPS Method */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#FF3D00] block">
              {language === 'en' ? '📍 Live Navigation Origin' : '📍 लाइव नेविगेशन प्रस्थान स्थान'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={detectLiveLocation}
                disabled={gpsLoading}
                className={cn(
                  "flex-1 p-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all outline-none",
                  locationMethod === 'gps'
                    ? "bg-[#FF3D00] text-white shadow-md"
                    : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                )}
              >
                <Globe size={13} className={cn(gpsLoading && "animate-spin")} />
                {gpsLoading ? (language === 'en' ? 'detecting...' : 'खोज रहे हैं...') :
                 locationMethod === 'gps' ? (language === 'en' ? '● GPS Connected' : '● GPS सक्रीय') :
                 (language === 'en' ? 'Use Live GPS Location' : 'अपनी लाइव लोकेशन खोजें')}
              </button>
              
              {locationMethod !== 'none' && (
                <button
                  onClick={() => {
                    setUserCoords(null);
                    setLocationMethod('none');
                    setActiveOriginCityKey('');
                  }}
                  className="px-3 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold"
                >
                  {language === 'en' ? 'Reset' : 'रिसेट'}
                </button>
              )}
            </div>
          </div>

          {/* Reference Cities Select dropdown */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 dark:text-orange-400 block">
              {language === 'en' ? '🏙️ Select Reference City / Village' : '🏙️ अथवा प्रस्थान शहर / ग्राम निर्दिष्ट करें'}
            </span>
            <select
              value={activeOriginCityKey}
              onChange={(e) => handleCityOriginChange(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl text-[11px] font-bold focus:outline-none text-gray-800 dark:text-gray-300"
            >
              <option value="">{language === 'en' ? '-- Select Center to calculate Distance --' : '-- दूरी मापन हेतु संदर्भ शहर चुनें --'}</option>
              {Object.keys(REFERENCE_CITIES_COORDS).map((key) => {
                const c = REFERENCE_CITIES_COORDS[key];
                return (
                  <option key={key} value={key}>
                    {language === 'en' ? c.labelEn : c.labelHi}
                  </option>
                );
              })}
            </select>
          </div>

        </div>

        {/* Row 3: State and Cost Pills Filters */}
        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-150/30 dark:border-white/5">
          
          {/* State filter: MP & UP focus */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">
              {language === 'en' ? 'State Focus / प्रदेश' : 'राज्य (म.प्र. एवं उ.प्र. विशेष)'}
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: language === 'en' ? 'All India' : 'अखिल भारत' },
                { id: 'MP', label: language === 'en' ? 'Madhya Pradesh' : 'मध्य प्रदेश (MP)' },
                { id: 'UP', label: language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश (UP)' },
                { id: 'Other', label: language === 'en' ? 'Other States' : 'अन्य राज्य' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStateFilter(s.id as any);
                    setHasSearched(true);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-[9.5px] font-black tracking-wider uppercase rounded-lg transition-all",
                    activeStateFilter === s.id 
                      ? "bg-[#FF3D00] text-white shadow-xs font-bold" 
                      : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Category Filters */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#FF3D00] block">
              {language === 'en' ? 'Meal Cost Model (Indian Rupees ₹)' : 'भोजन मूल्य श्रेणी (भारतीय रुपये ₹)'}
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: language === 'en' ? 'All Tiers' : 'सकल' },
                { id: 'free', label: language === 'en' ? 'Free (₹0)' : 'निशुल्क भोजन (₹0)' },
                { id: 'nominal', label: language === 'en' ? 'Nominal (₹)' : 'सहयोग शुल्क थाली (₹)' },
                { id: 'paid', label: language === 'en' ? 'Paid / Hotel (₹₹)' : 'सशुल्क शुद्ध भोजन' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCostFilter(c.id as any);
                    setHasSearched(true);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-[9.5px] font-black tracking-wider uppercase rounded-lg transition-all",
                    activeCostFilter === c.id 
                      ? "bg-amber-500 text-white shadow-xs font-bold" 
                      : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-850 dark:hover:text-gray-200"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Distance Slider and Categories */}
        <div className="pt-4 border-t border-gray-150/40 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 text-xs font-semibold">
          
          {/* Distance Slider */}
          <div className={cn(
            "flex items-center gap-3 w-full lg:max-w-md justify-between transition-opacity duration-200",
            locationMethod === 'none' ? 'opacity-50 pointer-events-none' : 'opacity-100'
          )}>
            <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
              <Sliders size={14} className="text-[#FF3D00]" />
              <span>
                {language === 'en' ? 'Search Radius:' : 'अधिकतम दूरी दायरा:'}{' '}
                <strong className="text-[#FF3D00] font-mono text-xs">
                  {locationMethod === 'none' 
                    ? (language === 'en' ? 'N/A (Turn on GPS or select context city)' : 'निष्क्रिय (प्रस्थान शहर / ग्राम निर्दिष्ट करें)')
                    : `${activeDistance} KM / किमी`}
                </strong>
              </span>
            </div>
            {locationMethod !== 'none' && (
              <input 
                type="range" 
                min={5} 
                max={500}
                step={5}
                value={activeDistance}
                onChange={(e) => setActiveDistance(Number(e.target.value))}
                className="accent-[#FF3D00] cursor-pointer flex-1"
              />
            )}
          </div>

          {/* Quick Selection Category Pills */}
          <div className="flex bg-gray-100 dark:bg-[#181818] p-1 rounded-2xl gap-1 overflow-x-auto">
            {[
              { id: 'all', label: language === 'en' ? 'ALL KITCHENS' : 'सकल श्रेणी' },
              { id: 'family', label: language === 'en' ? 'SHRAVAK HOMES' : 'व्यक्तिगत चौका' },
              { id: 'dharamshala', label: language === 'en' ? 'TEERTH MANDIR' : 'तीर्थ धर्मशाला' },
              { id: 'restaurant', label: language === 'en' ? 'RESTAURANTS' : 'सत्यापित भोजनालय' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as any)}
                className={cn(
                  "px-4 py-2 text-[9px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer whitespace-nowrap",
                  activeType === tab.id 
                    ? "bg-[#FF3D00] text-white shadow-xs font-bold" 
                    : "text-gray-500 hover:text-[#FF3D00] dark:hover:text-amber-500"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Trigger execution button bar - EASY SEARCH SYSTEM */}
        <div className="pt-4 border-t border-gray-150/20 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[10px] text-gray-500 font-bold dark:text-gray-400">
            ❇️ {language === 'en' ? `Showing ${filteredKitchens.length} pure kitchen locations instantly!` : `तत्काल फ़िल्टर: ${filteredKitchens.length} मर्यादित चौके सूचीकृत उपलब्ध हैं!`}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleClearFilters}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all uppercase"
            >
              {language === 'en' ? 'Clear Filters (सकल देखें)' : 'फिल्टर साफ करें / रिसेट'}
            </button>
            
            <button
              onClick={handleFindKitchens}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-600 to-[#FF3D00] hover:from-orange-700 hover:to-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-orange-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Search size={15} />
              {language === 'en' ? `SHOW RESULTS (${filteredKitchens.length} FOUND)` : `सूची पर जाएँ (कुल चौके: ${filteredKitchens.length}) 🔍`}
            </button>
          </div>
        </div>

      </div>

      {/* HIGH TECH GRID FOR RADAR SCANNING AND MAP SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Radar Map Frame Left Side */}
        <div className="lg:col-span-4 bg-white dark:bg-[#111] border border-orange-500/10 dark:border-[#FF3D00]/20 rounded-3xl p-5 flex flex-col items-center justify-between shadow-sm relative overflow-hidden min-h-[300px]">
          <div className="w-full text-center mb-3">
            <span className="text-[9px] font-black tracking-widest text-[#FF3D00] block uppercase">{language === 'en' ? 'LIVE RADAR PROXIMITY SCAN' : 'लाइव चौका राडार स्कैन'}</span>
            <h4 className="text-xs font-black text-gray-700 dark:text-gray-300 mt-0.5">
              {language === 'en' ? 'Detecting Pure Kitchens in 10KM' : 'आपके १० किमी परिक्षेत्र में सक्रिय चौके'}
            </h4>
          </div>

          {/* Animated Scanning Circle */}
          <div className="w-44 h-44 rounded-full border border-orange-500/20 relative bg-orange-500/5 flex items-center justify-center">
            {/* Radar Sweeper */}
            <div 
              style={{ transform: `rotate(${radarDegrees}deg)` }}
              className="absolute inset-0 rounded-full origin-center pointer-events-none transition-transform"
            >
              <div className="w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent absolute right-1/2" />
              <div className="w-0.5 h-1/2 bg-orange-500/60 absolute left-1/2 top-0" />
            </div>

            {/* Simulated Points Inside Radar */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Saroj Kitchen: 1.2km" />
            <div className="absolute top-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Guest Chowka: 0.8km" />
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-orange-500" />
            
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-blue-500" title="Atishay Bhojanalaya" />

            {/* Target Reticle */}
            <div className="w-24 h-24 rounded-full border border-orange-500/10 border-dashed" />
            <div className="w-12 h-12 rounded-full border border-orange-500/10" />
            <div className="w-2 h-2 rounded-full bg-orange-600" />
          </div>

          <div className="w-full mt-4 text-[10px] text-gray-500 dark:text-gray-400 font-bold flex justify-between">
            <span>🔴 {language === 'en' ? 'Sravaka home' : 'गृह चौका'}</span>
            <span>🟢 {language === 'en' ? 'Dharamshala' : 'भोजनालय'}</span>
            <span>🔵 {language === 'en' ? 'Veg Restaurant' : 'सत्यापित'}</span>
          </div>
        </div>

        {/* Purity standard descriptions on Right Side */}
        <div className="lg:col-span-8 p-5 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-amber-500/20 dark:border-white/5 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
              <ShieldCheck className="shrink-0 animate-pulse" size={18} />
              <h3 className="font-extrabold uppercase tracking-widest text-xs">
                {language === 'en' ? 'Sadharmika Ahar Bhojan Code of Conduct (चौका मर्यादा)' : 'परम जैन चौका मर्यादा नियम संहिता'}
              </h3>
            </div>
            <p className="leading-relaxed text-[11px] text-gray-700 dark:text-gray-300">
              {language === 'en' 
                ? 'Every kitchen listed under our cooperative net strictly implements: No night eating values (Chauvihar/Atapum before sunset), double cotton-filtered water (Jal Galan code), zero onion/garlic/potatoes (no root-vegetables), and organic cold-pressed spices. High-tech GPS distance maps show nearby centers.'
                : 'इस राष्ट्रीय पटल पर सूचीबद्ध सभी चौके निस्वार्थ धार्मिक सेवा और पूर्ण मर्यादित जैन शास्त्रों के कठोर नियमों का पालन करते हैं: सूर्यास्त से पहले भोजन, दोहरे मोटे सूती कपड़े से मर्यादित छना जल (जल गलन पद्धति), समस्त जमीकंद-कंदमूल (आलू, प्याज, लहसुन) का पूर्ण वर्जन, तथा रासायनिक मसालों के स्थान पर कूटकर बनाए मर्यादित मसाले।'}
            </p>
          </div>

          {/* Quick Stats Bento Blocks */}
          <div className="grid grid-cols-3 gap-3.5 mt-5">
            <div className="p-3 bg-white/40 dark:bg-zinc-950/40 border border-amber-500/10 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 block font-bold">{language === 'en' ? 'Active Choukars' : 'कुल सक्रिय चौके'}</span>
              <span className="text-base md:text-lg font-black text-[#FF3D00]">१५०+ रसोई</span>
            </div>
            <div className="p-3 bg-white/40 dark:bg-zinc-950/40 border border-amber-500/10 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 block font-bold">{language === 'en' ? 'Purity Audited' : 'विश्वसनीय रेटिंग'}</span>
              <span className="text-base md:text-lg font-black text-amber-500">५.० ★ Star</span>
            </div>
            <div className="p-3 bg-white/40 dark:bg-zinc-950/40 border border-amber-500/10 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 block font-bold">{language === 'en' ? 'Free Sadharmik' : 'सधर्मी वात्सल्य'}</span>
              <span className="text-base md:text-lg font-black text-emerald-500">निशुल्क भोजन</span>
            </div>
          </div>
        </div>
      </div>


      {/* Add Kitchen Form Collapse Panel */}
      {showAddForm && (
        <div className="bg-white dark:bg-[#111] border border-[#FF3D00]/20 p-6 rounded-[2rem] mb-8 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-display font-black text-sm text-[#FF3D00] uppercase tracking-wider flex items-center gap-2">
            <PlusCircle size={18} />
            {language === 'en' ? 'PLEDGE & ENROLL YOUR PURE JAIN CHOUKA' : 'शुद्ध मर्यादित श्रावक चौका सेवा प्रदाता शपथ पत्र'}
          </h3>
          <p className="text-[11px] text-gray-550 dark:text-gray-400 font-semibold leading-relaxed">
            {language === 'en' 
              ? 'Enroll your pure home kitchen to serve Jain Sadharmiks on foot or journeys. Ensure strict double cotton water filtration, total avoidance of onions/garlic/root-vegetables, and serving meal before Sunset.' 
              : 'यह निस्वार्थ सेवा केवल साधार्मिक वात्सल्य और पुण्य अर्जन हेतु है। चौका प्रदाता यह वचन दे कि रसोई में केवल मर्यादित छने हुए जल का प्रयोग होता है और सभी खाद्य सामग्री सूर्यास्त से पहले आदर पूर्वक परोसी जाएगी।'}
          </p>

          <form onSubmit={handleAddKitchen} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Owner / Kitchen Name (Hindi) *' : 'चौका/रसोई प्रदाता का नाम (हिंदी) *'}</label>
              <input 
                type="text" 
                required
                placeholder="उदा: श्रीमती सरोज देवी जैन निवास" 
                value={newNameHi}
                onChange={(e) => setNewNameHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Kitchen Name (English)' : 'चौका स्वामी का नाम (English)'}</label>
              <input 
                type="text" 
                placeholder="e.g. Srimati Sarla Jain Shravak Niwas" 
                value={newNameEn}
                onChange={(e) => setNewNameEn(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Kitchen Category' : 'रसोई का प्रकार *'}</label>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="family">{language === 'en' ? '🏠 Shravak House (पारिवारिक होम चौका)' : '🏠 घर का सात्विक चौका'}</option>
                <option value="dharamshala">{language === 'en' ? '🏢 Atishay Kshetra भोजनालय' : '🏢 तीर्थक्षेत्र धर्मशाला भोजनालय'}</option>
                <option value="restaurant">{language === 'en' ? '🍛 Verified Pure Restaurant' : '🍛 पूर्ण जैन सत्यापित रेस्टॉरेंट'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Phone / WhatsApp *' : 'सम्पर्क मोबाइल नंबर (प्रदाता) *'}</label>
              <input 
                type="tel" 
                required
                placeholder="e.g. +91 94140 12345" 
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'City / Village Name *' : 'शहर / गाँव का नाम *'}</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Indore, Lucknow, Bhopal, Varanasi" 
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'State location *' : 'राज्य (State) *'}</label>
              <select 
                value={newKitchenState}
                onChange={(e) => setNewKitchenState(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-750 dark:text-gray-300"
              >
                <option value="MP">Madhya Pradesh (MP)</option>
                <option value="UP">Uttar Pradesh (UP)</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Chowka Menu specialty (Hindi)' : 'भोजन या व्यंजन विशेषता (जैसे कढ़ी, मूंग दाल)'}</label>
              <input 
                type="text" 
                placeholder="उदा: मर्यादित दाल-बाटी कढ़ी" 
                value={newSpecialtyHi}
                onChange={(e) => setNewSpecialtyHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Cost Type *' : 'सहयोग मूल्य प्रकार *'}</label>
              <select 
                value={newCostType}
                onChange={(e) => setNewCostType(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-750 dark:text-gray-300"
              >
                <option value="free">{language === 'en' ? 'Free (Complimentary Prasad)' : 'निशुल्क (सादर वात्सल्य प्रसादी)'}</option>
                <option value="nominal">{language === 'en' ? 'Nominal Maintenance Cost' : 'नाममात्र सहयोग (₹)'}</option>
                <option value="paid">{language === 'en' ? 'Standard Paid Meals / Restaurant' : 'सशुल्क शुद्ध भोजन मर्यादा'}</option>
              </select>
            </div>

            {newCostType !== 'free' && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-250">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Price per Thali / Plate (₹)' : 'प्रति थाली सहयोग मूल्य (₹) *'}</label>
                <input 
                  type="number" 
                  min={1}
                  required
                  placeholder="e.g. 50, 80" 
                  value={newCostRupees || ''}
                  onChange={(e) => setNewCostRupees(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            )}

            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">{language === 'en' ? 'Full Chouka Address (Hindi) *' : 'पूर्ण पता विवरण (गली, फ्लैट नंबर सहित) *'}</label>
              <input 
                type="text" 
                required
                placeholder="उदा: वर्धमान जैन मंदिर के पीछे, जेपी नगर..." 
                value={newAddressHi}
                onChange={(e) => setNewAddressHi(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181818] border border-gray-200 dark:border-white/5 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Purity Check Checklist Pledge */}
            <div className="col-span-1 md:col-span-2 p-4.5 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-xs font-semibold flex items-start gap-3">
              <input 
                type="checkbox" 
                required
                checked={pledgeChecked}
                onChange={(e) => setPledgeChecked(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-black/20 border-orange-550/30 rounded-md mt-0.5 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-1">
                <span className="block text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">{language === 'en' ? 'SACRED PURITY DECLARATION (श्रावक संकल्प पत्र)' : 'सच्चा श्रावक चौका शुचिता प्रतिज्ञा'}</span>
                <p className="leading-relaxed text-[11px] text-gray-700 dark:text-gray-300">
                  {language === 'en' 
                    ? 'I pledge before Jinendra Dev: We cook only in pure non-reused oils and hand-ground spices under Sunlight. We reject all garlic/onions, root crops, non-filtered water, and guarantee to feed before sunset.' 
                    : 'मैं जिनेन्द्र साक्षीपूर्वक प्रतिज्ञा करता हूँ कि हमारे यहाँ शुद्ध कूट कर मर्यादित मसालों का उपयोग होगा, कंदमूल वर्जित रहेगा, जल शोधन मोटा सूती कपड़ा दोहरा कर किया जायेगा तथा सूर्यास्त भोजन मर्यादा पालन करेंगे।'}
                </p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4.5 py-2.5 bg-gray-200 dark:bg-white/5 rounded-xl text-xs font-bold"
              >
                {language === 'en' ? 'Cancel' : 'निरस्त'}
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-[#FF3D00] hover:bg-[#D50000] text-write text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm"
              >
                {language === 'en' ? 'Publish Online' : 'मर्यादा सत्यापित कर जोड़ें'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DEVELOPER DASHBOARD OR USER SUBMISSIONS BOARD FOR REVIEW */}
      {(isDeveloper || mySubmittedIds.length > 0) && (
        <div className="space-y-4 mb-8 bg-white dark:bg-[#111] border border-orange-500/20 rounded-3xl p-6 shadow-sm">
          {/* Section title */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-150/40 dark:border-white/5">
            <ShieldAlert className="text-orange-600 animate-bounce" size={20} />
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-orange-650 dark:text-orange-400">
              {isDeveloper 
                ? (language === 'en' ? '🛠️ SAMIL JAIN - PENDING AUDIT VERIFICATION CARD PANEL' : '🛠️ समिल जैन - अनुमोदन लंबित साधार्मिक चौका सूचियां व संदेश')
                : (language === 'en' ? '📝 MY SUBMISSIONS (VERIFICATION PENDING)' : '📝 मेरी प्रस्तुतियाँ (सत्यापन एवं अनुमोदन लंबित)')}
            </h2>
          </div>

          {/* Filter kitchens list that are status === 'pending' */}
          {(() => {
            const pendingItems = kitchens.filter(k => {
              if (isDeveloper) return k.status === 'pending';
              return k.status === 'pending' && mySubmittedIds.includes(k.id);
            });

            if (pendingItems.length === 0) {
              return (
                <div className="bg-gray-50 dark:bg-black/10 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center text-xs text-gray-500 font-bold">
                  {language === 'en' ? 'No Choukas are currently awaiting verification.' : 'वर्तमान में कोई भी नवीन चौका अनुरोध आपके अनुमोदन हेतु लंबित नहीं है।'}
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {pendingItems.map(item => (
                  <div key={item.id} className="bg-orange-50/40 dark:bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-widest bg-orange-600 text-white shadow-xs animate-pulse">
                            ⚡ {language === 'en' ? 'VERIFICATION PENDING' : 'सत्यापन लंबित (PENDING)'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                            📍 {item.state === 'MP' ? 'Madhya Pradesh (MP)' : item.state === 'UP' ? 'Uttar Pradesh (UP)' : item.state}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-display font-black text-gray-950 dark:text-white leading-tight">
                          {language === 'en' ? item.name.en : item.name.hi}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold flex items-center gap-1.5 leading-snug">
                          <MapPin size={13} className="text-[#FF3D00] shrink-0" />
                          <span>{language === 'en' ? item.address.en : item.address.hi}</span>
                        </p>
                        <p className="text-xs text-[#FF3D00] font-black">
                          📞 {language === 'en' ? 'Contact:' : 'सम्पर्क सूचक मोबाइल:'} <span className="font-mono">{item.contact}</span>
                        </p>
                      </div>

                      {/* Developer controls */}
                      {isDeveloper && (
                        <div className="flex shrink-0 gap-2 self-end sm:self-start">
                          <button
                            onClick={() => handleApproveKitchen(item.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-write text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                          >
                            ✅ {language === 'en' ? 'APPROVE LIVE' : 'स्वीकृत करें'}
                          </button>
                          <button
                            onClick={() => handleRejectKitchen(item.id)}
                            className="px-4 py-2 bg-red-650 hover:bg-red-700 bg-red-600 text-write text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                          >
                            🗑️ {language === 'en' ? 'REJECT' : 'निरस्त करें'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Show price clearly in Indian Rupees */}
                    <div className="bg-white dark:bg-black/30 border border-gray-150/40 dark:border-white/5 p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#FF3D00] font-black">🪙 {language === 'en' ? 'Meal Price Detail:' : 'भोजन सहयोग मूल्य:'}</span>
                        <span className="text-gray-800 dark:text-gray-300 font-bold">
                          {item.costType === 'free' ? (language === 'en' ? '₹ 0 - Fully Free / Complimentary (Sadharmik Vatsalya)' : '₹ 0 - पूर्णतः निःशुल्क (सादर साधार्मिक वात्सल्य प्रसादी सेवा)') :
                           `₹ ${item.costRupees} - (नाममात्र रखरखाव सहयोग राशि मात्र प्रति थाली)`}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        🏘️ {item.city} Center
                      </span>
                    </div>

                    {/* Sadharmika interactive chat module */}
                    <div className="bg-gray-50/50 dark:bg-[#181818]/60 border border-orange-500/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-150/50 dark:border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3D00] flex items-center gap-1.5">
                          <MessageCircle size={13} />
                          {language === 'en' ? '💬 Sadharmika Verification Messenger' : '💬 प्रदाता एवं डेवलपर सीधा सत्यापन संवाद कक्ष'}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {language === 'en' ? 'Real-Time Sync' : 'सुरक्षित लाइव सिंक'}
                        </span>
                      </div>

                      {/* Chat message history list */}
                      <div className="max-h-52 overflow-y-auto space-y-2.5 p-1 rounded-xl text-xs bg-white/40 dark:bg-black/10">
                        {(!item.chatHistory || item.chatHistory.length === 0) ? (
                          <div className="text-center text-gray-400 py-3 font-semibold text-[11px] italic">
                            {language === 'en' 
                              ? 'No messages yet. Samil (Developer) or Sponsor can write below to establish integrity.' 
                              : 'कोई सन्देश नहीं। शुचिता प्रमाणन समन्वय संवाद आरम्भ करने हेतु नीचे लिख कर सन्देश भेजें।'}
                          </div>
                        ) : (
                          item.chatHistory.map((msg: any, sIdx: number) => {
                            const isSenderDev = msg.sender === 'developer';
                            return (
                              <div key={sIdx} className={cn("flex flex-col max-w-[85%] space-y-0.5", isSenderDev === isDeveloper ? "ml-auto items-end" : "mr-auto items-start")}>
                                <span className="text-[8.5px] font-black text-gray-450 dark:text-gray-400">
                                  {isSenderDev ? (language === 'en' ? '👑 Samil Jain (Developer)' : '👑 समिल जैन (डेवलपर)') : (language === 'en' ? '🏠 Submitting Shravak' : '🏠 चौका प्रदाता श्रावक')}
                                </span>
                                <div className={cn("p-2.5 rounded-2xl", 
                                  isSenderDev === isDeveloper
                                    ? "bg-[#FF3D00] text-write text-white rounded-tr-none shadow-xs font-semibold" 
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-250 dark:border-white/5 font-semibold"
                                )}>
                                  <p className="leading-snug">{msg.text}</p>
                                </div>
                                <span className="text-[7.5px] font-bold text-gray-400 leading-none">{msg.timestamp}</span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Send action bar */}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder={language === 'en' ? "Write message to coordinate..." : "शुचिता प्रमाणन समन्वय सन्देश लिखें..."}
                          value={activeChatKitchenId === item.id ? userChatText : ''}
                          onChange={(e) => {
                            setActiveChatKitchenId(item.id);
                            setUserChatText(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSendChatMessage(item.id, userChatText, isDeveloper ? 'developer' : 'user');
                            }
                          }}
                          className="flex-1 bg-white dark:bg-[#111] border border-gray-250 dark:border-white/5 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => handleSendChatMessage(item.id, activeChatKitchenId === item.id ? userChatText : '', isDeveloper ? 'developer' : 'user')}
                          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-[#FF3D00] text-write text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md"
                        >
                          <Send size={12} />
                          {language === 'en' ? 'Send' : 'भेजें'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* KITCHEN GRID CARDS WITH REAL-TIME SADHARMIK REVIEWS INPUT AND DATA */}
      <div className="space-y-6">
        {filteredKitchens.length > 0 ? (
          filteredKitchens.map((kitchen) => (
            <div 
              key={kitchen.id} 
              className="bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 rounded-3xl p-5 hover:border-[#FF3D00]/50 hover:shadow-md transition-all duration-300"
            >
              {/* Card Title Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-widest",
                      kitchen.type === 'family' ? 'bg-orange-100 dark:bg-orange-500/10 text-[#FF3D00]' :
                      kitchen.type === 'dharamshala' ? 'bg-[#FF3D00]/10 text-orange-600 dark:text-orange-400' :
                      'bg-indigo-100 dark:bg-indigo-505/10 text-indigo-500'
                    )}>
                      {kitchen.type === 'family' ? (language === 'en' ? '🏠 Shravak Home' : '🏠 श्रावक परिवार होम चौका') :
                       kitchen.type === 'dharamshala' ? (language === 'en' ? '🏢 Temple Dharamshala' : '🏢 तीर्थ क्षेत्र भोजनालय') :
                       (language === 'en' ? '🍛 Secured restaurant' : '🍛 सत्यापित मर्यादित भोजनालय')}
                    </span>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Star size={11} className="fill-current animate-pulse text-amber-400" /> {kitchen.rating.toFixed(1)}
                    </span>

                    {/* NEW STATE FLAG BADGE */}
                    <span className="px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase tracking-wider bg-zinc-150 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                      📍 {kitchen.state === 'MP' ? (language === 'en' ? 'Madhya Pradesh' : 'मध्य प्रदेश (MP)') : 
                           kitchen.state === 'UP' ? (language === 'en' ? 'Uttar Pradesh' : 'उत्तर प्रदेश (UP)') : 
                           kitchen.state}
                    </span>

                    {/* NEW COST MODEL STAMP */}
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider",
                      kitchen.costType === 'free' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs' :
                      kitchen.costType === 'nominal' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    )}>
                      {language === 'en' ? kitchen.costInfo.en : kitchen.costInfo.hi}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-display font-black text-gray-950 dark:text-white leading-tight mt-1.5">
                    {language === 'en' ? kitchen.name.en : kitchen.name.hi}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold flex items-center gap-1.5 leading-snug mt-1">
                    <MapPin size={13} className="text-[#FF3D00] shrink-0" />
                    <span>{language === 'en' ? kitchen.address.en : kitchen.address.hi}</span>
                  </p>
                </div>

                <div className="text-xs font-black uppercase shrink-0 text-[#FF3D00] bg-[#FF3D00]/5 px-4 py-2.5 border border-[#FF3D00]/10 rounded-2xl text-center flex flex-col items-center justify-center min-w-[125px] h-fit self-end sm:self-start">
                  <span className="text-sm font-black text-[#FF3D00] font-mono flex items-center gap-1">🚗 {getDistance(kitchen)} KM</span>
                  <span className="text-[8.5px] tracking-wide text-gray-400 dark:text-gray-500 mt-0.5 whitespace-nowrap">
                    {locationMethod === 'gps' ? (language === 'en' ? 'from your GPS' : 'आपकी GPS लोकेशन से') :
                     activeOriginCityKey ? (language === 'en' ? `from ${REFERENCE_CITIES_COORDS[activeOriginCityKey]?.labelEn}` : `${REFERENCE_CITIES_COORDS[activeOriginCityKey]?.labelHi} से`) :
                     (language === 'en' ? 'approx distance' : 'दूरी प्रस्थान से')}
                  </span>
                </div>
              </div>

              {/* Specialty description bar */}
              <div className="mt-2.5 text-xs font-semibold text-orange-755 dark:text-orange-400 flex items-center gap-1.5">
                <Utensils size={12} className="shrink-0" />
                <span>🥞 {language === 'en' ? 'Specialty:' : 'मुख्य प्रसाद:'} <strong className="text-gray-900 dark:text-gray-200">{language === 'en' ? kitchen.specialty.en : kitchen.specialty.hi}</strong></span>
              </div>

              {/* Cost in Rupees ₹ Display Tag */}
              <div className="mt-2.5 text-xs flex items-center gap-2 bg-[#FF3D00]/5 dark:bg-[#FF3D00]/10 border border-[#FF3D00]/15 dark:border-white/5 px-3.5 py-2.5 rounded-2xl w-fit">
                <span className="text-xs font-black text-[#FF3D00]">🪙 {language === 'en' ? 'Thali Service Price:' : 'शुद्ध भोजन थाली मूल्य / प्रसादी सहयोग मूल्य:'}</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {kitchen.costType === 'free' ? (language === 'en' ? '₹ 0 - Fully Free / Complimentary (Sadharmik Vatsalya)' : '₹ 0 - पूर्णतः निःशुल्क (सादर साधार्मिक वात्सल्य प्रसादी सेवा)') :
                   kitchen.costType === 'nominal' ? (language === 'en' ? `₹ ${kitchen.costRupees} - Nominal Maintenance Cost Only` : `₹ ${kitchen.costRupees} - केवल नाममात्र रखरखाव सहयोग मूल्य मात्र`) :
                   (language === 'en' ? `₹ ${kitchen.costRupees} - Standard Paid Pure Thali` : `₹ ${kitchen.costRupees} - सशुल्क मर्यादित जैन थाली`)}
                </span>
              </div>

              {/* Strict standards indices bullet boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-4 p-3 bg-gray-50 dark:bg-[#161616]/70 rounded-2xl border border-gray-100 dark:border-white/5 text-[9px] font-extrabold uppercase tracking-wide">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={13} /> {language === 'en' ? '🌅 Pre-sunset Dining' : '🌅 सूर्यास्त पूर्व भोजन'}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={13} /> {language === 'en' ? '💧 Doubled Cotton filter' : '💧 छना हुआ मर्यादित जल'}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={13} /> {language === 'en' ? '🚫 No roots / Onions' : '🚫 कंदमूल-जमीनकंद मुक्त'}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={13} /> {language === 'en' ? '🍽️ Dedicated Purity' : '🍽️ पृथक मर्यादित बर्तन'}
                </div>
              </div>

              {/* Footer bar containing timing & Review Drawer switches */}
              <div className="pt-3 border-t border-gray-150/40 dark:border-white/5 flex flex-wrap justify-between items-center gap-3 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="text-[#FF3D00]" />
                  <span>{language === 'en' ? 'Standard timins:' : 'भोजन समय:'} {language === 'en' ? kitchen.aharTimings.en : kitchen.aharTimings.hi}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Review Section Button */}
                  <button
                    onClick={() => setExpandedReviewsId(expandedReviewsId === kitchen.id ? null : kitchen.id)}
                    className="px-3 py-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 text-[10px]"
                  >
                    <MessageSquare size={13} />
                    <span>{language === 'en' ? 'Sadharmik Reviews' : 'समीक्षाएँ'} ({kitchen.reviews.length})</span>
                  </button>

                  <a 
                    href={`tel:${kitchen.contact}`}
                    className="px-4 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#D50000] text-write text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs"
                  >
                    <Phone size={12} />
                    {language === 'en' ? 'Call & Inform' : 'कॉल करके सूचित करें'}
                  </a>
                </div>
              </div>

              {/* EXPANDABLE REVIEWS SECTION - EXTREMELY HIGH TECH & INTERACTIVE */}
              {expandedReviewsId === kitchen.id && (
                <div className="mt-4 p-4.5 bg-gray-50/50 dark:bg-[#151515]/80 border border-orange-500/10 dark:border-white/5 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-3.5">
                    <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                      💬 {language === 'en' ? 'Verified Sadharmik Reviews' : 'साधर्मिक शुचिता गवाही एवं प्रशंसा'}
                    </h4>

                    {/* Review Loop */}
                    {kitchen.reviews.length > 0 ? (
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {kitchen.reviews.map((rev, rIdx) => (
                          <div key={rIdx} className="bg-white dark:bg-[#181818] p-3 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                              <span>👤 {rev.author}</span>
                              <span>⭐ {rev.rating}/5</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">
                              {language === 'en' ? rev.comment.en : rev.comment.hi}
                            </p>
                            <span className="text-[9px] text-gray-450 block text-right mt-0.5">{rev.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-550 dark:text-gray-450 italic">
                        {language === 'en' ? 'No reviews submitted yet for this center. Be the first!' : 'इस रसोई के लिए अभी कोई समीक्षा नहीं लिखी गई है। प्रथम गवाही दें!'}
                      </p>
                    )}
                  </div>

                  {/* Add Review micro-form */}
                  <div className="border-t border-gray-200 dark:border-white/5 pt-4.5 space-y-3">
                    <span className="block text-[10px] font-black uppercase text-orange-550 dark:text-orange-400 tracking-wider">
                      ✍️ {language === 'en' ? 'Add Review' : 'समीक्षा व गवाही लिखें'}
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? "Your Name" : "आपका पावन नाम"}
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none"
                      />
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none text-gray-700 dark:text-gray-300"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                        <option value={3}>⭐⭐⭐ (3/5)</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? "Type Purity rating and hospitality experience..." : "शुचिता अनुभव या सम्मान भाव विषयक टिप्पणी लिखें..."}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="flex-1 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/5 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => submitReview(kitchen.id)}
                        className="px-4 bg-[#FF3D00] hover:bg-[#D50000] text-white text-[10px] font-black uppercase rounded-xl"
                      >
                        {language === 'en' ? 'Submit' : 'सहेजें'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#111] border border-gray-150/40 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
            {language === 'en' ? 'No kitchen found matching both searchQuery & distance limits!' : 'प्रदान की गई दूरी सीमा और शहर के अंतर्गत कोई रसोई वर्तमान में सक्रिय नहीं मिली!'}
          </div>
        )}
      </div>

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
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
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-355 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {language === 'en' ? 'Welcome to Jain Food Locator!' : 'जैन फूड लोकेटर (विशुद्ध भोजनशाला खोजक) में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {language === 'en' 
                  ? 'This directory helps Sadharmik Yatris (travelers) locate pure, non-violent Jain kitchens, Dharamshala dining halls, and pure Satvik dining facilities during journeys.' 
                  : 'यह अनुभाग जैन साधर्मियों को यात्रा के दौरान शुद्ध, मर्यादित और कंदमूल-रहित भोजन की व्यवस्था प्रदान करने वाली रसोईयों, धर्मशाला अहारशालाओं की जानकारी देता है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Strict Purity Parameters:' : 'शुचिता के त्रि-आयामी नियम:'}</strong>{' '}
                  {language === 'en' 
                    ? 'All kitchens list metrics for Sunset Compliance (serving strictly before sunset), Jal Galan (using traditional water filters), and Zero Root-Vegetables.' 
                    : 'सभी भोजनशालाओं में सूर्यास्त पूर्व भोजन (चौविहार), मर्यादा पूर्वक छना जल (जल गालन), तथा कंदमूल (आलू, प्याज, लहसुन) का शत-प्रतिशत निषेध अनिवार्य है।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Interactive Distance Calculation:' : 'दूरी एवं लोकेशन गणना प्रणाली:'}</strong>{' '}
                  {language === 'en'
                    ? 'Calculate exact proximity by selecting your current city coordinates, or query via state (MP, UP, Karnataka) to optimize travel routes.'
                    : 'अपने वर्तमान शहर (इन्दौर, कुण्डलपुर, सोनागिर आदि) का चयन कर प्रत्येक अहारशाला की वास्तविक हवाई दूरी एवं ड्राइविंग सुगमता मापें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Direct Sadharmik Chat & Contact:' : 'इन-ऐप सीधा चेट संवाद एवं संपर्क:'}</strong>{' '}
                  {language === 'en'
                    ? 'Launch live private chat channels directly with the kitchen operators to request food timings, pre-book seats, and query specialized diet requirements.'
                    : 'अतिथियों हेतु रसोई संचालक के पास उपलब्ध "चर्चा करें" बटन पर क्लिक कर सीधे संवाद करें तथा भोजन मर्यादा व बुकिंग समय सुनिश्चित करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{language === 'en' ? 'Register New Holy Chowka:' : 'नवीन शुद्ध चौका/अहारशाला जोड़ें:'}</strong>{' '}
                  {language === 'en'
                    ? 'Sadharmik families or community heads can tap "Register New Kitchen" to add locations with photos, cost info (free/nominal/paid), and coordinate details.'
                    : 'साधार्मिक गृहस्थ अथवा प्रबंधक "रजिस्टर चौका" विकल्प से निःशुल्क, नाममात्र अथवा मर्यादित भोजनालयों का संपर्क एवं पता दर्ज कर साझा कर सकते हैं।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
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

      <div className="mt-8">
        <SectionAiAgent section="verified-food" />
      </div>
    </div>
  );
}
