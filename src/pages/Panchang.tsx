import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, X, Sunrise, Sunset, Clock, Star, BookOpen, Users, ArrowLeft, Loader2, Info, Moon, Sun, Globe } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { hi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import SectionAiAgent from '../components/SectionAiAgent';
import { collection, onSnapshot } from 'firebase/firestore';

type PanchangDetails = {
  tithi: string;
  shortTithi?: string;
  paksha: string;
  festivals: string[];
  kalyanak: string[];
  acharyaDarpan: string[];
  shubhMuhurat: string[];
  vrat: string[];
  sunrise: string;
  sunset: string;
  samvat: string;
  vns: string;
};

// Precise Suryodaya-Suryast Data for 2026
const SUN_DATA: Record<number, Array<{ day: number, sunrise: string, sunset: string }>> = {
  0: [ // Jan
    { day: 1, sunrise: '07:07', sunset: '17:53' }, { day: 6, sunrise: '07:08', sunset: '17:57' }, { day: 11, sunrise: '07:09', sunset: '18:00' }, { day: 16, sunrise: '07:09', sunset: '18:04' }, { day: 21, sunrise: '07:09', sunset: '18:07' }, { day: 26, sunrise: '07:08', sunset: '18:11' }, { day: 31, sunrise: '07:06', sunset: '18:14' },
  ],
  1: [ // Feb
    { day: 5, sunrise: '07:04', sunset: '18:17' }, { day: 10, sunrise: '07:02', sunset: '18:20' }, { day: 15, sunrise: '06:59', sunset: '18:23' }, { day: 20, sunrise: '06:55', sunset: '18:26' }, { day: 25, sunrise: '06:52', sunset: '18:28' },
  ],
  2: [ // Mar
    { day: 2, sunrise: '06:48', sunset: '18:31' }, { day: 7, sunrise: '06:44', sunset: '18:33' }, { day: 12, sunrise: '06:39', sunset: '18:36' }, { day: 17, sunrise: '06:34', sunset: '18:39' }, { day: 22, sunrise: '06:29', sunset: '18:41' }, { day: 27, sunrise: '06:24', sunset: '18:44' },
  ],
  3: [ // Apr
    { day: 1, sunrise: '06:20', sunset: '18:46' }, { day: 6, sunrise: '06:14', sunset: '18:49' }, { day: 11, sunrise: '06:09', sunset: '18:52' }, { day: 16, sunrise: '06:05', sunset: '18:55' }, { day: 21, sunrise: '06:00', sunset: '18:58' }, { day: 26, sunrise: '05:56', sunset: '19:01' },
  ],
  4: [ // May
    { day: 1, sunrise: '05:52', sunset: '19:04' }, { day: 6, sunrise: '05:49', sunset: '19:08' }, { day: 11, sunrise: '05:46', sunset: '19:11' }, { day: 16, sunrise: '05:43', sunset: '19:14' }, { day: 21, sunrise: '05:42', sunset: '19:17' }, { day: 26, sunrise: '05:40', sunset: '19:20' }, { day: 31, sunrise: '05:40', sunset: '19:22' },
  ],
  5: [ // Jun
    { day: 5, sunrise: '05:39', sunset: '19:25' }, { day: 10, sunrise: '05:39', sunset: '19:27' }, { day: 15, sunrise: '05:40', sunset: '19:29' }, { day: 20, sunrise: '05:41', sunset: '19:30' }, { day: 25, sunrise: '05:42', sunset: '19:30' }, { day: 30, sunrise: '05:44', sunset: '19:30' },
  ],
  6: [ // Jul
    { day: 5, sunrise: '05:46', sunset: '19:30' }, { day: 10, sunrise: '05:49', sunset: '19:28' }, { day: 15, sunrise: '05:51', sunset: '19:26' }, { day: 20, sunrise: '05:54', sunset: '19:23' }, { day: 25, sunrise: '05:57', sunset: '19:20' }, { day: 30, sunrise: '06:00', sunset: '19:16' },
  ],
  7: [ // Aug
    { day: 4, sunrise: '06:03', sunset: '19:12' }, { day: 9, sunrise: '06:06', sunset: '19:07' }, { day: 14, sunrise: '06:08', sunset: '19:02' }, { day: 19, sunrise: '06:11', sunset: '18:57' }, { day: 24, sunrise: '06:13', sunset: '18:51' }, { day: 29, sunrise: '06:16', sunset: '18:45' },
  ],
  8: [ // Sep
    { day: 3, sunrise: '06:19', sunset: '18:39' }, { day: 8, sunrise: '06:21', sunset: '18:32' }, { day: 13, sunrise: '06:24', sunset: '18:26' }, { day: 18, sunrise: '06:27', sunset: '18:20' }, { day: 23, sunrise: '06:30', sunset: '18:13' }, { day: 28, sunrise: '06:33', sunset: '18:07' },
  ],
  9: [ // Oct
    { day: 3, sunrise: '06:36', sunset: '18:01' }, { day: 8, sunrise: '06:39', sunset: '17:55' }, { day: 13, sunrise: '06:42', sunset: '17:50' }, { day: 18, sunrise: '06:46', sunset: '17:45' }, { day: 23, sunrise: '06:50', sunset: '17:40' }, { day: 28, sunrise: '06:54', sunset: '17:36' },
  ],
  10: [ // Nov
    { day: 2, sunrise: '06:58', sunset: '17:33' }, { day: 7, sunrise: '07:02', sunset: '17:30' }, { day: 12, sunrise: '07:06', sunset: '17:29' }, { day: 17, sunrise: '07:11', sunset: '17:28' }, { day: 22, sunrise: '07:15', sunset: '17:27' }, { day: 27, sunrise: '07:19', sunset: '17:28' },
  ],
  11: [ // Dec
    { day: 2, sunrise: '07:23', sunset: '17:29' }, { day: 7, sunrise: '07:27', sunset: '17:31' }, { day: 12, sunrise: '07:30', sunset: '17:33' }, { day: 17, sunrise: '07:33', sunset: '17:36' }, { day: 22, sunrise: '07:35', sunset: '17:39' }, { day: 27, sunrise: '07:37', sunset: '17:43' },
  ]
};

export interface JainTirth {
  id: string;
  nameHi: string;
  nameEn: string;
  location: string;
  state: string;
  sunriseOffsetMin: number;
  sunsetOffsetMin: number;
  significanceHi: string;
  significanceEn: string;
}

export const JAIN_TIRTHS: JainTirth[] = [
  {
    id: 'shikharji',
    nameHi: 'श्री सम्मेद शिखरजी',
    nameEn: 'Shree Sammed Shikharji',
    location: 'मधुबन, गिरिडीह',
    state: 'झारखण्ड',
    sunriseOffsetMin: -22,
    sunsetOffsetMin: -22,
    significanceHi: '२० तीर्थंकरों एवं अनंत मुनियों की पावन मोक्ष निर्वाण भूमि (पारसनाथ पर्वत)',
    significanceEn: 'Holy Moksha Nirvana land of 20 Tirthankaras & countless ascetics'
  },
  {
    id: 'girnar',
    nameHi: 'श्री गिरनार महातीर्थ',
    nameEn: 'Shree Girnar Ji',
    location: 'जूनागढ़',
    state: 'गुजरात',
    sunriseOffsetMin: 32,
    sunsetOffsetMin: 32,
    significanceHi: '२२वें तीर्थंकर भगवान नेमिनाथ जी की दीक्षा, केवलज्ञान व मोक्ष स्थली (५वीं टोंक)',
    significanceEn: 'Diksha, Gyan & Moksha of 22nd Tirthankara Neminath (5th Tonk)'
  },
  {
    id: 'palitana',
    nameHi: 'श्री शत्रुंजय महातीर्थ (पालीताना)',
    nameEn: 'Shree Shatrunjaya (Palitana)',
    location: 'भावनगर',
    state: 'गुजरात',
    sunriseOffsetMin: 28,
    sunsetOffsetMin: 28,
    significanceHi: 'प्रथम तीर्थंकर भगवान आदिनाथ जी का शाश्वत महातीर्थ एवं कोटि-कोटि मुनियों की निर्वाण भूमि',
    significanceEn: 'Eternal Tirth of Bhagwan Rishabhdev & countless ascetics'
  },
  {
    id: 'pavapuri',
    nameHi: 'श्री पावापुरी जी',
    nameEn: 'Shree Pavapuri Ji',
    location: 'नालंदा',
    state: 'बिहार',
    sunriseOffsetMin: -20,
    sunsetOffsetMin: -20,
    significanceHi: '२४वें तीर्थंकर भगवान महावीर स्वामी की पावन निर्वाण स्थली (कमल सरोवर जल मंदिर)',
    significanceEn: 'Holy Nirvana land of 24th Tirthankara Bhagwan Mahavira (Jal Mandir)'
  },
  {
    id: 'kundalpur',
    nameHi: 'श्री कुण्डलपुर जी',
    nameEn: 'Shree Kundalpur Ji',
    location: 'दमोह',
    state: 'मध्य प्रदेश',
    sunriseOffsetMin: 2,
    sunsetOffsetMin: 2,
    significanceHi: 'अतिशयकारी बड़े बाबा भगवान आदिनाथ जी का दिव्य महातीर्थ',
    significanceEn: 'Miraculous Bade Baba Bhagwan Adinath Divine Tirth'
  },
  {
    id: 'shravanabelagola',
    nameHi: 'श्री श्रवणबेलगोला महातीर्थ',
    nameEn: 'Shree Shravanabelagola',
    location: 'हासन',
    state: 'कर्नाटक',
    sunriseOffsetMin: 8,
    sunsetOffsetMin: 12,
    significanceHi: 'भगवान बाहुबली स्वामी (गोमटेश्वर) की ५७ फीट विश्वप्रसिद्ध अखण्ड पाषाण प्रतिमा',
    significanceEn: '57ft world-famous monolithic statue of Bhagwan Bahubali'
  },
  {
    id: 'hastinapur',
    nameHi: 'श्री हस्तिनापुर जी',
    nameEn: 'Shree Hastinapur Ji',
    location: 'मेरठ',
    state: 'उत्तर प्रदेश',
    sunriseOffsetMin: 5,
    sunsetOffsetMin: 6,
    significanceHi: 'भगवान शांतिनाथ, कुन्थुनाथ, अरहनाथ जी की कल्याणक भूमि व अक्षय तृतीया इक्षु रस आहार स्थली',
    significanceEn: 'Kalyanaks of 3 Tirthankaras & Akshaya Tritiya Ikshu Ras Ahar site'
  },
  {
    id: 'mahavirji',
    nameHi: 'श्री महावीर जी',
    nameEn: 'Shree Mahavir Ji',
    location: 'करौली',
    state: 'राजस्थान',
    sunriseOffsetMin: 12,
    sunsetOffsetMin: 12,
    significanceHi: 'अतिशय क्षेत्र भगवान महावीर स्वामी का चमत्कारी धाम',
    significanceEn: 'Atishay Kshetra miraculous abode of Bhagwan Mahavira'
  },
  {
    id: 'tijara',
    nameHi: 'श्री तिजारा जी',
    nameEn: 'Shree Tijara Ji',
    location: 'अलवर',
    state: 'राजस्थान',
    sunriseOffsetMin: 10,
    sunsetOffsetMin: 10,
    significanceHi: '८वें तीर्थंकर भगवान चन्द्रप्रभ जी का पावन दिगंबर अतिशय क्षेत्र',
    significanceEn: 'Holy Digambar Atishay Kshetra of 8th Tirthankara Chandraprabhu'
  },
  {
    id: 'ayodhya',
    nameHi: 'श्री अयोध्या जी तीर्थ',
    nameEn: 'Shree Ayodhya Ji',
    location: 'अयोध्या',
    state: 'उत्तर प्रदेश',
    sunriseOffsetMin: -12,
    sunsetOffsetMin: -12,
    significanceHi: 'भगवान ऋषभदेव, अजितनाथ, अभिनन्दननाथ, सुमतिनाथ व अनंतनाथ की पवित्र जन्मभूमि',
    significanceEn: 'Birthplace of 5 Tirthankaras including Bhagwan Rishabhdev'
  },
  {
    id: 'standard',
    nameHi: 'अखिल भारतीय मानक (IST)',
    nameEn: 'All India Standard (IST)',
    location: 'केन्द्रीय भारत',
    state: 'भारत',
    sunriseOffsetMin: 0,
    sunsetOffsetMin: 0,
    significanceHi: 'भारतीय मानक समय (IST) आधारित औसत जैन पंचांग समय',
    significanceEn: 'Standard Indian calculation basis for general Jain Panchang'
  }
];

export function adjustTimeString(timeStr: string, offsetMinutes: number): string {
  if (!timeStr) return '';
  const clean = timeStr.replace(/(AM|PM)/gi, '').trim();
  const parts = clean.split(':');
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const isPM = timeStr.toUpperCase().includes('PM');
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12 && timeStr.toUpperCase().includes('AM')) h = 0;

  let totalMins = h * 60 + m + offsetMinutes;
  if (totalMins < 0) totalMins += 24 * 60;
  totalMins = totalMins % (24 * 60);

  const newH24 = Math.floor(totalMins / 60);
  const newM = totalMins % 60;
  const suffix = newH24 >= 12 ? 'PM' : 'AM';
  const newH12 = (newH24 % 12) === 0 ? 12 : newH24 % 12;
  return `${String(newH12).padStart(2, '0')}:${String(newM).padStart(2, '0')} ${suffix}`;
}

export function addMinutesToTimeString(timeStr: string, addMins: number): string {
  return adjustTimeString(timeStr, addMins);
}

const getSunTime = (date: Date) => {
  const m = date.getMonth();
  const d = date.getDate();
  const data = SUN_DATA[m];
  if (!data) return { sunrise: '06:30 AM', sunset: '06:30 PM' };
  
  let closest = data[0];
  for (const entry of data) {
    if (d >= entry.day) closest = entry;
  }
  return { sunrise: `${closest.sunrise} AM`, sunset: `${closest.sunset} PM` };
};

// Data for 2026 based on images and Jain Panchang records
const JAIN_DATA_2026: Record<number, Record<number, any>> = {
  0: { // Jan
    1: { tithi: 'पौष शुक्ल 13', acharyaDarpan: ['मुनि श्री धीरसागरजी - समाधि'], vrat: ['रोहिणी व्रत'], festivals: ['अंग्रेजी नववर्ष'] },
    2: { tithi: 'पौष शुक्ल 14', kalyanak: ['भग. अभिनंदनजी - ज्ञान'], vrat: ['षोडशकारण व्रत प्रारंभ'] },
    3: { tithi: 'पौष शुक्ल 15 (पूर्णिमा)', kalyanak: ['भग. धर्मनाथजी - ज्ञान'], festivals: ['शाकंभरी पूर्णिमा'] },
    4: { tithi: 'माघ कृष्ण 1', acharyaDarpan: ['आचार्य श्री वासुपूज्य सागरजी - मुनि दीक्षा'] },
    5: { tithi: 'माघ कृष्ण 2/3', acharyaDarpan: ['आचार्य श्री विमलसागरजी - आचार्य पद'] },
    6: { tithi: 'माघ कृष्ण 4', acharyaDarpan: ['ग. प्र. विज्ञानामतिजी - गणिनी पद'] },
    7: { tithi: 'माघ कृष्ण 5', acharyaDarpan: ['मुनि श्री सुयशसागरजी - संयम स्मृति'] },
    8: { tithi: 'माघ कृष्ण 6', kalyanak: ['भग. पद्मप्रभु - गर्भ'], acharyaDarpan: ['आचार्य श्री महावीरकीर्तिजी - समाधि', 'आर्यिका श्री संयतमतिजी - समाधि'] },
    9: { tithi: 'माघ कृष्ण 7', acharyaDarpan: ['मुनि श्री श्रुतसागरजी - व्रत स्मृति'] },
    10: { tithi: 'माघ कृष्ण 8', acharyaDarpan: ['मुनि श्री विमलसागरजी - दीक्षा स्मृति'] },
    11: { tithi: 'माघ कृष्ण 9', kalyanak: ['भग. ऋषभदेव - तप स्मृति'] },
    12: { tithi: 'माघ कृष्ण 10', acharyaDarpan: ['मुनि श्री ज्ञानसागरजी - दीक्षा स्मृति'], vrat: ['रोहिणी व्रत'] },
    13: { tithi: 'माघ कृष्ण 11', festivals: ['देव दर्शन दिन'] },
    14: { tithi: 'माघ कृष्ण 12', vrat: ['देवदर्शन प्रतिज्ञा'], festivals: ['मकर संक्रांति', 'लोहड़ी'] },
    15: { tithi: 'माघ कृष्ण 13', kalyanak: ['भग. शीतलनाथजी - जन्म, तप'], festivals: ['मकर संक्रांति उत्सव'] },
    16: { tithi: 'माघ कृष्ण 14', festivals: ['मुनि साधना दिन'] },
    17: { tithi: 'माघ कृष्ण 30 (अमावस्या)', kalyanak: ['भग. आदिनाथजी - मोक्ष'], acharyaDarpan: ['आचार्य श्री अभिनन्दनसागरजी - समाधि', 'आचार्य श्री धर्मभूषणसागरजी - मुनि दीक्षा'], festivals: ['मौनी अमावस्या'], vrat: ['मोक्ष दिवस'] },
    18: { tithi: 'माघ शुक्ल 1', kalyanak: ['भग. श्रेयांसनाथजी - ज्ञान'] },
    19: { tithi: 'माघ शुक्ल 2', vrat: ['लब्धि विधान व्रत प्रारंभ'] },
    20: { tithi: 'माघ शुक्ल 3', kalyanak: ['भग. वासुपूज्यजी - ज्ञान'] },
    21: { tithi: 'माघ शुक्ल 4', acharyaDarpan: ['मुनि श्री सुयशसागरजी - मुनि दीक्षा', 'आर्यिका श्री सिद्धान्तमतिजी - आर्यिका दीक्षा'], vrat: ['लब्धि विधान व्रत पूर्ण'] },
    22: { tithi: 'माघ शुक्ल 5', kalyanak: ['भग. विमलनाथजी - जन्म, तप'], festivals: ['वसंत पंचमी', 'सरस्वती पूजा'], vrat: ['दशलक्षण व्रत प्रारंभ'] },
    23: { tithi: 'माघ शुक्ल 6', acharyaDarpan: ['मुनि श्री मलिंदसागरजी - मुनि दीक्षा स्मृति'], vrat: ['पुष्यांजलि व्रत प्रारंभ'] },
    24: { tithi: 'माघ शुक्ल 7', kalyanak: ['भग. विमलनाथजी - ज्ञान'], festivals: ['रथ सप्तमी'] },
    25: { tithi: 'माघ शुक्ल 8', acharyaDarpan: ['आचार्यकल्प श्री ज्ञानभूषणजी - मुनि दीक्षा'], festivals: ['भीष्म अष्टमी'] },
    26: { tithi: 'माघ शुक्ल 9', festivals: ['गणतंत्र दिवस राष्ट्रीय पर्व'] },
    27: { tithi: 'माघ शुक्ल 10', kalyanak: ['भग. अजितनाथजी - तप'], acharyaDarpan: ['आचार्य श्री विमलसागरजी - समाधि'], vrat: ['पुष्यांजलि व्रत पूर्ण'] },
    28: { tithi: 'माघ शुक्ल 11', kalyanak: ['भग. अजितनाथजी - जन्म'], acharyaDarpan: ['आचार्य श्री भरतसागरजी - मुनि दीक्षा'], festivals: ['जया एकादशी'], vrat: ['रोहिणी व्रत'] },
    29: { tithi: 'माघ शुक्ल 12-13', vrat: ['रोहिणी व्रत'] },
    30: { tithi: 'माघ शुक्ल 14', kalyanak: ['भग. अभिनंदनजी - जन्म, तप', 'भग. धर्मनाथजी - जन्म, तप'], acharyaDarpan: ['मुनि श्री धर्मसागरजी - मुनि दीक्षा', 'आर्यिका श्री विज्ञानमतिजी - आर्यिका दीक्षा', 'आर्यिका श्री गुणमतिजी - आर्यिका दीक्षा', 'आर्यिका श्री दृढमतिजी - आर्यिका दीक्षा'], vrat: ['रत्नत्रय व्रत प्रारंभ'] },
    31: { tithi: 'माघ शुक्ल 15 (पूर्णिमा)', festivals: ['माघ पूर्णिमा'], vrat: ['दशलक्षण व्रत पूर्ण'] },
  },
  1: { // Feb
    1: { tithi: 'फाल्गुन कृष्ण 1', acharyaDarpan: ['आचार्य श्री विमलसागरजी - मुनि दीक्षा', 'आर्यिका श्री श्रुतमतिजी - समाधि'], vrat: ['रत्नत्रय व्रत पूर्ण'] },
    2: { tithi: 'फाल्गुन कृष्ण 2', acharyaDarpan: ['आचार्य श्री भरतसागरजी - आचार्य पद'], vrat: ['रोहिणी व्रत'] },
    3: { tithi: 'फाल्गुन कृष्ण 3', acharyaDarpan: ['मुनि श्री भावनासागरजी - व्रत स्मृति'] },
    4: { tithi: 'फाल्गुन कृष्ण 4', acharyaDarpan: ['मुनि श्री पावनसागरजी - मुनि दीक्षा'] },
    5: { tithi: 'फाल्गुन कृष्ण 5', kalyanak: ['भग. संभवनाथजी - गर्भ'] },
    6: { tithi: 'फाल्गुन कृष्ण 6', acharyaDarpan: ['आर्यिका श्री उपशान्तमतिजी - समाधि'] },
    7: { tithi: 'फाल्गुन कृष्ण 7', kalyanak: ['भग. मल्लिनाथजी - मोक्ष'] },
    8: { tithi: 'फाल्गुन कृष्ण 8', kalyanak: ['भग. चंद्रप्रभजी - ज्ञान', 'भग. सुविधिनाथजी - ज्ञान'], acharyaDarpan: ['आचार्य श्री विमलसागरजी - मुनि संयम प्र.', 'आचार्य श्री भरतसागरजी - मुनि दीक्षा स्मृति', 'मुनि श्री प्रशांतसागरजी - मुनि दीक्षा'] },
    9: { tithi: 'फाल्गुन कृष्ण 9', acharyaDarpan: ['आचार्य श्री भरतसागरजी - आचार्य पद स्मृति'] },
    10: { tithi: 'फाल्गुन कृष्ण 10', kalyanak: ['भग. आदिनाथजी - दीक्षा स्मृति'] },
    11: { tithi: 'फाल्गुन कृष्ण 11', festivals: ['व्रत चिंतन दिवस'] },
    12: { tithi: 'फाल्गुन कृष्ण 12', acharyaDarpan: ['आर्यिका श्री सिद्धान्तमतिजी - समाधि'] },
    13: { tithi: 'फाल्गुन कृष्ण 13', kalyanak: ['भग. पद्मप्रमुजी - जन्म, तप'], acharyaDarpan: ['आर्यिका श्री विज्ञानामतिजी - गणिनी पद स्मृति'], festivals: ['कुंभ संक्रांति'] },
    14: { tithi: 'फाल्गुन कृष्ण 14', kalyanak: ['भग. मुनिसुव्रतनाथजी - गर्भ'], festivals: ['महाशिवरात्रि'] },
    15: { tithi: 'फाल्गुन कृष्ण 30 (अमावस्या)', acharyaDarpan: ['मुनि श्री भावसागरजी - समाधि', 'मुनि श्री धर्मसागरजी - समाधि स्मृति'] },
    16: { tithi: 'फाल्गुन शुक्ल 1', kalyanak: ['भग. शांतिनाथजी - गर्भ'], acharyaDarpan: ['आर्यिका श्री चन्द्रमतिजी - आर्यिका दीक्षा'] },
    17: { tithi: 'फाल्गुन शुक्ल 2', acharyaDarpan: ['मुनि श्री धीरसागरजी - मुनि दीक्षा'] },
    18: { tithi: 'फाल्गुन शुक्ल 3', acharyaDarpan: ['मुनि श्री संभवसागरजी - मुनि दीक्षा स्मृति'] },
    19: { tithi: 'फाल्गुन शुक्ल 4', festivals: ['मुनि ध्यान व्रत'] },
    20: { tithi: 'फाल्गुन शुक्ल 5', kalyanak: ['भग. कुन्थुनाथजी - गर्भ'], acharyaDarpan: ['मुनि श्री सुखसागरजी - समाधि'] },
    21: { tithi: 'फाल्गुन शुक्ल 6', kalyanak: ['भगवान नेमिनाथजी - गर्भ (वि.सं. काल)'], acharyaDarpan: ['मुनि श्री धर्मसागरजी - मुनि दीक्षा'] },
    22: { tithi: 'फाल्गुन शुक्ल 7', kalyanak: ['भग. अजितनाथजी - मोक्ष'] },
    23: { tithi: 'फाल्गुन शुक्ल 8', kalyanak: ['भग. पद्मप्रभु - ज्ञान'], acharyaDarpan: ['मुनि श्री विशिष्ठसागरजी - मुनि दीक्षा'] },
    24: { tithi: 'फाल्गुन शुक्ल 9', kalyanak: ['भग. सुमतिनाथजी - गर्भ'], acharyaDarpan: ['मुनि श्री धीरसागरजी - समाधि स्मृति', 'आर्यिका श्री सरलमतिजी - समाधि', 'आर्यिका श्री जिनमतिजी - आर्यिका दीक्षा'], vrat: ['दशधर्म व्रत प्रारंभ', 'रोहिणी व्रत'] },
    25: { tithi: 'फाल्गुन शुक्ल 10', vrat: ['पुष्यांजलि व्रत प्रारंभ'] },
    26: { tithi: 'फाल्गुन शुक्ल 11', festivals: ['श्री मल्लिनाथ स्तुति दिवस'] },
    27: { tithi: 'फाल्गुन शुक्ल 12', acharyaDarpan: ['आचार्य श्री विमलसागरजी - समाधि स्मृति'] },
    28: { tithi: 'फाल्गुन शुक्ल 13', acharyaDarpan: ['आचार्य श्री भरतसागरजी - समाधि'] }
  },
  2: { // Mar
    1: { tithi: 'फाल्गुन शुक्ल 14', kalyanak: ['भग. श्रेयांसनाथजी - गर्भ'] },
    2: { tithi: 'चैत्र कृष्ण 1', festivals: ['होली', 'वसंतोत्सव'], vrat: ['पुष्यांजलि व्रत पूर्ण'] },
    3: { tithi: 'चैत्र कृष्ण 2', acharyaDarpan: ['मुनि श्री पावनसागरजी - समाधि स्मृति'], vrat: ['दशधर्म व्रत पूर्ण'] },
    4: { tithi: 'चैत्र कृष्ण 3', acharyaDarpan: ['आचार्य श्री वासुपूज्य सागरजी - समाधि स्मृति', 'आर्यिका श्री रत्नमतिजी - समाधि'] },
    5: { tithi: 'चैत्र कृष्ण 4', acharyaDarpan: ['आचार्य श्री निर्मलसागरजी - समाधि'] },
    6: { tithi: 'चैत्र कृष्ण 5', festivals: ['श्री अनंतनाथ पूजा दिवस'] },
    7: { tithi: 'चैत्र कृष्ण 6-7', kalyanak: ['भग. संभवनाथजी - ज्ञान'] },
    8: { tithi: 'चैत्र कृष्ण 8', kalyanak: ['भग. सुमतिनाथजी - जन्म, तप'], festivals: ['शीतला अष्टमी'] },
    9: { tithi: 'चैत्र कृष्ण 9', acharyaDarpan: ['आचार्य श्री विमलसागरजी - आचार्य पद स्मृति'] },
    10: { tithi: 'चैत्र कृष्ण 10', acharyaDarpan: ['मुनि श्री भरतसागरजी - स्मृति दिवस'] },
    11: { tithi: 'चैत्र कृष्ण 10-11', kalyanak: ['भग. आदिनाथजी - जन्म, तप स्मृति'], acharyaDarpan: ['ग. प्र. विज्ञानामतिजी - गणिनी पद स्मृति'] },
    12: { tithi: 'चैत्र कृष्ण 12', kalyanak: ['भग. श्रेयांसनाथजी - जन्म, तप'], vrat: ['रोहिणी व्रत'] },
    13: { tithi: 'चैत्र कृष्ण 13', acharyaDarpan: ['आचार्य श्री अक्षय सागरजी - समाधि स्मृति'] },
    14: { tithi: 'चैत्र कृष्ण 14', festivals: ['श्री आदिनाथ मोक्ष पूर्व दिवस'] },
    15: { tithi: 'चैत्र कृष्ण 30 (अमावस्या)', festivals: ['मीन संक्रांति'] },
    16: { tithi: 'चैत्र शुक्ल 1', festivals: ['गुड़ी पड़वा', 'चैत्र नवरात्रि प्रारंभ'] },
    17: { tithi: 'चैत्र शुक्ल 2', kalyanak: ['भग. मुनिसुव्रतनाथजी - जन्म, तप स्मृति'], festivals: ['चैत्र नवरात्रि द्वितीया'] },
    18: { tithi: 'चैत्र शुक्ल 3', festivals: ['नवरात्रि तृतीया'] },
    19: { tithi: 'चैत्र शुक्ल 4', kalyanak: ['भग. मुनिसुव्रतनाथजी - जन्म, तप स्मृति'], vrat: ['षोडशकारण व्रत प्रारंभ'] },
    21: { tithi: 'चैत्र शुक्ल 4', kalyanak: ['भग. सुपार्श्वनाथजी - गर्भ स्मृति'], vrat: ['अष्टान्हिका व्रत प्रारंभ'] },
    22: { tithi: 'चैत्र शुक्ल 5', vrat: ['पुष्यांजलि व्रत प्रारंभ'] },
    23: { tithi: 'चैत्र शुक्ल 6', kalyanak: ['भग. चंद्रप्रभजी - गर्भ'], vrat: ['रत्नत्रय व्रत प्रारंभ'] },
    24: { tithi: 'चैत्र शुक्ल 7', kalyanak: ['भग. सुविधिनाथजी - गर्भ स्मृति'], acharyaDarpan: ['मुनि श्री मलिंदसागरजी - मुनि दीक्षा स्मृति'], vrat: ['दशलक्षण व्रत प्रारंभ'] },
    25: { tithi: 'चैत्र शुक्ल 8', festivals: ['श्री संभवनाथ गर्भ कल्याणक'] },
    26: { tithi: 'चैत्र शुक्ल 9', festivals: ['राम नवमी'], acharyaDarpan: ['आर्यिका श्री विज्ञानमतिजी - आर्यिका दीक्षा स्मृति'] },
    27: { tithi: 'चैत्र शुक्ल 10', vrat: ['पुष्यांजलि व्रत पूर्ण'] },
    28: { tithi: 'चैत्र शुक्ल 11', kalyanak: ['भग. श्रेयांसनाथजी - गर्भ स्मृति'] },
    29: { tithi: 'चैत्र शुक्ल 12', festivals: ['भगवान महावीर गर्भ कल्याणक पूर्व संध्या'] },
    30: { tithi: 'चैत्र शुक्ल 13', festivals: ['भगवान महावीर स्वामी जयंती पूर्व तैयारी'] },
    31: { tithi: 'चैत्र शुक्ल 14', kalyanak: ['भगवान महावीरस्वामीजी - जन्म'], festivals: ['महावीर जयंती'], vrat: ['वीर शासन जयंती', 'अष्टान्हिका व्रत पूर्ण', 'दशलक्षण व्रत पूर्ण', 'रत्नत्रय व्रत पूर्ण'], acharyaDarpan: ['आचार्य श्री ज्ञानसागरजी - मुनि दीक्षा स्मृति'] },
  },
  3: { // Apr
    1: { tithi: 'चैत्र शुक्ल 15 (पूर्णिमा)', festivals: ['हनुमान जयंती', 'चैत्र पूर्णिमा'], vrat: ['रोहिणी व्रत', 'षोडशकारण व्रत पूर्ण'] },
    2: { tithi: 'बैशाख कृष्ण 1', vrat: ['देवदर्शन प्रतिज्ञा'], festivals: ['ग्रीष्म शरद ऋतु संधि'] },
    3: { tithi: 'बैशाख कृष्ण 2', kalyanak: ['भग. चंद्रप्रभजी - ज्ञान'] },
    4: { tithi: 'बैशाख कृष्ण 3', acharyaDarpan: ['आचार्य श्री विमलसागरजी - दीक्षा स्मृति'] },
    5: { tithi: 'बैशाख कृष्ण 4', festivals: ['श्री सुपार्श्वनाथ दीक्षित दिवस'] },
    6: { tithi: 'बैशाख कृष्ण 5', festivals: ['मुनि संयम आराधना'] },
    10: { tithi: 'बैशाख कृष्ण 10', kalyanak: ['भग. आदिनाथजी - दीक्षा स्मृति'], festivals: ['आदिनाथ तप जयंती'] },
    11: { tithi: 'बैशाख कृष्ण 11', festivals: ['आचार्य पावनसागरजी दीक्षा दिवस'] },
    12: { tithi: 'बैशाख कृष्ण 12', vrat: ['रोहिणी व्रत'] },
    13: { tithi: 'बैशाख कृष्ण 13', acharyaDarpan: ['मुनि समाधि दिवस स्मृति'] },
    14: { tithi: 'बैशाख कृष्ण 30 (अमावस्या)', festivals: ['सौर बैशाख प्रारंभ'] },
    15: { tithi: 'बैशाख शुक्ल 1', kalyanak: ['भग. पारसनाथजी - गर्भ'], festivals: ['मेष संक्रांति'] },
    16: { tithi: 'बैशाख शुक्ल 2', festivals: ['लब्धि विधान आराधना'] },
    18: { tithi: 'बैशाख शुक्ल 3', festivals: ['अक्षय तृतीया'], vrat: ['आदिनाथ आहार स्मृति', 'लब्धि विधान प्रारंभ'] },
    21: { tithi: 'बैशाख शुक्ल 4', kalyanak: ['भग. विमलनाथजी - ज्ञान'] },
    25: { tithi: 'बैशाख शुक्ल 8', kalyanak: ['भग. अनन्तनाथजी - ज्ञान कल्याणक'] },
    28: { tithi: 'बैशाख शुक्ल 12', vrat: ['रोहिणी व्रत'] },
    30: { tithi: 'बैशाख शुक्ल 15 (पूर्णिमा)', festivals: ['बुद्ध पूर्णिमा', 'कूर्म जयंती'] }
  },
  4: { // May
    1: { festivals: ['वैशाख पूर्णिमा', 'बुद्ध पूर्णिमा', 'श्री वर्धमान उपदेश दिवस'] },
    4: { acharyaDarpan: ['आचार्य श्री भरतसागरजी - संयम प्र.'] },
    11: { kalyanak: ['भग. शांतिनाथजी - जन्म, तप', 'भग. आदिनाथजी - गर्भ'], festivals: ['अपरा एकादशी'] },
    13: { kalyanak: ['भग. कुन्थुनाथजी - जन्म, तप', 'भग. अरनाथजी - जन्म, तप'], festivals: ['वट सावित्री व्रत'] },
    16: { kalyanak: ['भग. शीतलनाथजी - मोक्ष', 'भग. सुपार्श्वनाथजी - ज्ञान'], festivals: ['ज्येष्ठ अमावस्या', 'शनि जयंती'] },
    17: { festivals: ['अधिक मास (पुरुषोत्तम मास) प्रारंभ', 'अधिक ज्येष्ठ शुक्ल प्रतिपदा'] },
    27: { festivals: ['परमा एकादशी'] },
    31: { festivals: ['अधिक मास पूर्णिमा'] }
  },
  5: { // Jun
    11: { festivals: ['पद्मिनी एकादशी'] },
    15: { festivals: ['अधिक मास समापन', 'सोमवती अमावस्या'] },
    16: { festivals: ['निज ज्येष्ठ शुक्ल प्रतिपदा', 'मिथुन संक्रांति'] },
    20: { festivals: ['श्रुत पंचमी (जिनवाणी पूजन महापर्व)'], vrat: ['शास्त्र स्वाध्याय एवं पूजन'] },
    25: { festivals: ['निर्जला एकादशी'] },
    29: { festivals: ['ज्येष्ठ पूर्णिमा', 'कबीर जयंती'] },
    30: { festivals: ['आषाढ़ कृष्ण प्रतिपदा'] }
  },
  6: { // Jul
    10: { festivals: ['योगिनी एकादशी'] },
    14: { festivals: ['आषाढ़ अमावस्या'] },
    15: { festivals: ['गुप्त नवरात्रि प्रारंभ', 'कर्क संक्रांति'] },
    24: { kalyanak: ['भग. पारसनाथजी - जन्म, तप', 'भग. मल्लिनाथजी - गर्भ'] },
    25: { festivals: ['देवशयनी एकादशी'] },
    29: { festivals: ['गुरु पूर्णिमा', 'चातुर्मास कलश स्थापना महापर्व', 'व्यास पूर्णिमा'] },
    30: { festivals: ['वीर शासन जयंती (भगवान महावीर की प्रथम देशना)', 'चातुर्मास व्रत प्रारंभ'], vrat: ['वीर शासन जयंती व्रत'] }
  },
  7: { // Aug
    12: { festivals: ['श्रावण हरियाली अमावस्या'] },
    13: { festivals: ['श्रावण शुक्ल प्रतिपदा'] },
    15: { festivals: ['स्वतंत्रता दिवस', 'हरियाली तीज'] },
    17: { festivals: ['नाग पंचमी'] },
    25: { kalyanak: ['भगवान नेमिनाथजी - मोक्ष कल्याणक (ऊर्जयंत गिरनार)'] },
    27: { festivals: ['रक्षाबंधन (अकंपनाचार्य आदि 700 मुनिराज रक्षा पर्व)', 'श्रावणी पूर्णिमा'] },
    28: { festivals: ['भाद्रपद कृष्ण प्रतिपदा'] }
  },
  8: { // Sep
    4: { festivals: ['श्री कृष्ण जन्माष्टमी'] },
    7: { festivals: ['अजा एकादशी'] },
    8: { festivals: ['श्वेतांबर पर्युषण महापर्व प्रारंभ'], vrat: ['पर्युषण व्रत प्रारंभ'] },
    11: { festivals: ['भाद्रपद अमावस्या (पिठोरी अमावस्या)'] },
    12: { festivals: ['भाद्रपद शुक्ल प्रतिपदा'] },
    14: { festivals: ['हरितालिका तीज'] },
    15: { festivals: ['श्वेतांबर संवत्सरी महापर्व (विश्व क्षमापना दिन)', 'गणेश चतुर्थी'], vrat: ['संवत्सरी उपवास'] },
    16: { festivals: ['दिगंबर दशलक्षण महापर्व प्रारंभ (दिन 1: उत्तम क्षमा धर्म)', 'ऋषि पंचमी'], vrat: ['दशलक्षण व्रत प्रारंभ'] },
    17: { festivals: ['दशलक्षण महापर्व (दिन 2: उत्तम मार्दव धर्म)'] },
    18: { festivals: ['दशलक्षण महापर्व (दिन 3: उत्तम आर्जव धर्म)'] },
    19: { festivals: ['दशलक्षण महापर्व (दिन 4: उत्तम शौच धर्म)', 'राधा अष्टमी'] },
    20: { festivals: ['दशलक्षण महापर्व (दिन 5: उत्तम सत्य धर्म)'] },
    21: { festivals: ['दशलक्षण महापर्व (दिन 6: उत्तम संयम धर्म)', 'सुगंध दशमी (धूप दशमी)'], kalyanak: ['भगवान वासुपूज्य स्वामी - मोक्ष कल्याणक (मंदारगिरि)'], vrat: ['सुगंध दशमी व्रत', 'धूप घट पूजन'] },
    22: { festivals: ['दशलक्षण महापर्व (दिन 7: उत्तम तप धर्म)', 'परिवर्तिनी / जलझूलनी एकादशी'], vrat: ['उत्तम तप आराधना', 'एकादशी व्रत'] },
    23: { festivals: ['दशलक्षण महापर्व (दिन 8: उत्तम त्याग धर्म) - द्वादशी'], vrat: ['उत्तम त्याग आराधना', 'द्वादशी व्रत'] },
    24: { festivals: ['दशलक्षण महापर्व (दिन 9: उत्तम आकिंचन्य धर्म)'], vrat: ['उत्तम आकिंचन्य आराधना'] },
    25: { festivals: ['दशलक्षण महापर्व समापन (दिन 10: उत्तम ब्रह्मचर्य धर्म)', 'अनंत चतुर्दशी'], vrat: ['अनंत चतुर्दशी व्रत', 'चौदस उपवास'] },
    26: { festivals: ['क्षमावाणी महापर्व (मिच्छामि दुक्कड़म)', 'विश्व मैत्री दिवस', 'भाद्रपद पूर्णिमा'], vrat: ['क्षमापना दिवस', 'रत्नत्रय व्रत पूर्ण'] },
    27: { festivals: ['पितृ पक्ष प्रारंभ (आश्विन कृष्ण प्रतिपदा)'] }
  },
  9: { // Oct
    10: { festivals: ['आश्विन अमावस्या', 'सर्वपितृ अमावस्या', 'महालया'] },
    11: { festivals: ['शारदीय नवरात्रि प्रारंभ', 'घटस्थापना'] },
    17: { festivals: ['महा सप्तमी', 'सरस्वती आवाहन'] },
    18: { festivals: ['महा अष्टमी', 'दुर्गा अष्टमी'] },
    19: { festivals: ['महानवमी', 'आयुध पूजा'] },
    20: { festivals: ['विजयादशमी', 'दशहरा'] },
    21: { festivals: ['पापांकुशा एकादशी'] },
    25: { festivals: ['शरद पूर्णिमा', 'कोजागरी पूर्णिमा', 'शरद उत्सव'] },
    26: { festivals: ['कार्तिक कृष्ण प्रतिपदा'] }
  },
  10: { // Nov
    2: { festivals: ['अहोई अष्टमी व्रत'] },
    6: { festivals: ['धनतेरस', 'धनत्रयोदशी', 'धन्वंतरि जयंती'] },
    7: { festivals: ['रूप चतुर्दशी', 'नरक चतुर्दशी', 'छोटी दिवाली'] },
    8: { festivals: ['दीपावली महापर्व', 'महालक्ष्मी पूजन', 'भगवान महावीर निर्वाण लाडू अर्पण'], kalyanak: ['भगवान महावीर स्वामी - मोक्ष कल्याणक (पावापुरी जी)'], vrat: ['महावीर निर्वाण दिवस'] },
    9: { festivals: ['वीर निर्वाण संवत 2553 नूतन वर्ष प्रारंभ', 'गौतम गणधर केवलज्ञान दिवस', 'गोवर्धन पूजा', 'अन्नकूट महोत्सव'], vrat: ['वीर संवत नववर्ष व्रत'] },
    10: { festivals: ['भाई दूज', 'यम द्वितीया'] },
    13: { festivals: ['ज्ञान पंचमी', 'सौभाग्य पंचमी', 'जिनवाणी स्वाध्याय दिवस'], vrat: ['ज्ञान पंचमी व्रत'] },
    14: { festivals: ['छठ पूजा (सूर्य षष्ठी)'] },
    19: { festivals: ['देवउठनी एकादशी', 'प्रबोधिनी एकादशी', 'तुलसी विवाह प्रारंभ'] },
    24: { festivals: ['कार्तिक पूर्णिमा', 'देव दीपावली', 'रथयात्रा महोत्सव'], vrat: ['कार्तिक पूर्णिमा व्रत'] },
    25: { festivals: ['मार्गशीर्ष कृष्ण प्रतिपदा'] }
  },
  11: { // Dec
    8: { festivals: ['मार्गशीर्ष अमावस्या'] },
    9: { festivals: ['मार्गशीर्ष शुक्ल प्रतिपदा'] },
    19: { festivals: ['मोक्षदा एकादशी', 'गीता जयंती'] },
    23: { festivals: ['मार्गशीर्ष पूर्णिमा', 'दत्तात्रेय जयंती'] },
    24: { festivals: ['पौष कृष्ण प्रतिपदा'] },
    25: { festivals: ['बड़ा दिन (Christmas)'] },
    31: { festivals: ['वर्ष 2026 की पूर्व संध्या'] }
  }
};

const getMUHURAT_2026 = (date: Date) => {
  const m = date.getMonth();
  const d = date.getDate();
  const muhurats: string[] = [];
  
  // General Subh Muhurats for 2026 (Common Dates)
  if (m === 0) { // Jan
    if ([1, 2, 5, 8, 10, 15, 21, 23, 29].includes(d)) muhurats.push('वाहन खरीदी/मशीनरी');
    if ([5, 12, 14, 21, 28].includes(d)) muhurats.push('गृह प्रवेश');
  } else if (m === 1) { // Feb
    if ([2, 4, 8, 12, 16, 22, 25].includes(d)) muhurats.push('व्यापार प्रारंभ');
    if ([5, 7, 10, 15, 21].includes(d)) muhurats.push('वाहन खरीदी');
  } else if (m === 2) { // Mar
    if ([2, 6, 9, 13, 20, 27, 30].includes(d)) muhurats.push('मकान/भूमि पूजन');
    if ([4, 8, 12, 18, 24, 31].includes(d)) muhurats.push('विद्यारंभ/शिक्षा');
  } else if (m === 3) { // Apr
    if ([2, 5, 10, 16, 20, 25, 29].includes(d)) muhurats.push('गृह प्रवेश (किराया)');
    if ([8, 14, 21, 28].includes(d)) muhurats.push('वाहन खरीदी');
  } else if (m === 4) { // May
    if ([4, 7, 11, 15, 20, 26].includes(d)) muhurats.push('नामकरण संस्कार');
    if ([2, 10, 20, 25, 30].includes(d)) muhurats.push('मुण्डन/संस्कार');
  } else if (m === 5) { // Jun
    if ([3, 8, 14, 21, 25, 29].includes(d)) muhurats.push('दुकान उद्घाटन');
    if ([5, 12, 19, 27].includes(d)) muhurats.push('अक्षरांभ');
  } else if (m === 6) { // Jul
    if ([2, 9, 15, 20, 26, 31].includes(d)) muhurats.push('भूमि क्रय');
    if ([4, 11, 18, 25].includes(d)) muhurats.push('वाहन खरीदी');
  } else if (m === 7) { // Aug
    if ([4, 10, 15, 22, 28].includes(d)) muhurats.push('गृह नवीनीकरण');
    if ([6, 13, 20, 27].includes(d)) muhurats.push('विद्यारंभ');
  } else if (m === 8) { // Sep
    if ([2, 7, 12, 19, 25, 30].includes(d)) muhurats.push('मशीनरी/फैक्ट्री');
    if ([4, 11, 18, 24].includes(d)) muhurats.push('नया व्यापार');
  } else if (m === 9) { // Oct
    if ([1, 8, 15, 21, 28].includes(d)) muhurats.push('गृह प्रवेश');
    if ([5, 10, 17, 24, 31].includes(d)) muhurats.push('वाहन खरीदी');
  } else if (m === 10) { // Nov
    if ([2, 7, 14, 20, 26, 30].includes(d)) muhurats.push('भूमि पूजन');
    if ([4, 11, 18, 25].includes(d)) muhurats.push('नामकरण');
  } else if (m === 11) { // Dec
    if ([3, 10, 17, 24, 31].includes(d)) muhurats.push('शिशु देवदर्शन');
    if ([5, 12, 19, 27].includes(d)) muhurats.push('मुण्डन मुहूर्त');
  }

  return muhurats.length > 0 ? muhurats : ['सामान्य शुभ दिन'];
};

// Fortnight starters for 2026 (Reflecting standard Hindu/Jain Purnimanta Panchang with Adhik Maas in 2026)
const PAKSHA_STARTERS_2026 = [
  { start: '2025-12-20', name: 'पौष शुक्ल' },
  { start: '2026-01-04', name: 'माघ कृष्ण' },
  { start: '2026-01-19', name: 'माघ शुक्ल' },
  { start: '2026-02-02', name: 'फाल्गुन कृष्ण' },
  { start: '2026-02-18', name: 'फाल्गुन शुक्ल' },
  { start: '2026-03-04', name: 'चैत्र कृष्ण' },
  { start: '2026-03-20', name: 'चैत्र शुक्ल' },
  { start: '2026-04-02', name: 'वैशाख कृष्ण' },
  { start: '2026-04-18', name: 'वैशाख शुक्ल' },
  { start: '2026-05-02', name: 'ज्येष्ठ कृष्ण' },
  { start: '2026-05-17', name: 'अधिक ज्येष्ठ शुक्ल' },
  { start: '2026-06-01', name: 'अधिक ज्येष्ठ कृष्ण' },
  { start: '2026-06-16', name: 'ज्येष्ठ शुक्ल' },
  { start: '2026-06-30', name: 'आषाढ़ कृष्ण' },
  { start: '2026-07-15', name: 'आषाढ़ शुक्ल' },
  { start: '2026-07-30', name: 'श्रावण कृष्ण' },
  { start: '2026-08-13', name: 'श्रावण शुक्ल' },
  { start: '2026-08-28', name: 'भाद्रपद कृष्ण' },
  { start: '2026-09-12', name: 'भाद्रपद शुक्ल' },
  { start: '2026-09-27', name: 'आश्विन कृष्ण' },
  { start: '2026-10-11', name: 'आश्विन शुक्ल' },
  { start: '2026-10-26', name: 'कार्तिक कृष्ण' },
  { start: '2026-11-09', name: 'कार्तिक शुक्ल' },
  { start: '2026-11-25', name: 'मार्गशीर्ष कृष्ण' },
  { start: '2026-12-09', name: 'मार्गशीर्ष शुक्ल' },
  { start: '2026-12-24', name: 'पौष कृष्ण' }
];

const TITHI_NAMES_HI = [
  '',
  'प्रतिपदा',
  'द्वितीया',
  'तृतीया',
  'चतुर्थी',
  'पंचमी',
  'षष्ठी',
  'सप्तमी',
  'अष्टमी',
  'नवमी',
  'दशमी',
  'एकादशी',
  'द्वादशी',
  'त्रयोदशी',
  'चतुर्दशी',
  'पूर्णिमा'
];

const getCalculatedTithi = (date: Date): { tithi: string; shortTithi: string; paksha: string } => {
  const targetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  
  let activeStarter = PAKSHA_STARTERS_2026[0];
  for (const starter of PAKSHA_STARTERS_2026) {
    const sParts = starter.start.split('-');
    const starterTime = new Date(parseInt(sParts[0]), parseInt(sParts[1]) - 1, parseInt(sParts[2])).getTime();
    if (targetTime >= starterTime) {
      activeStarter = starter;
    }
  }

  const sParts = activeStarter.start.split('-');
  const starterTime = new Date(parseInt(sParts[0]), parseInt(sParts[1]) - 1, parseInt(sParts[2])).getTime();
  const diffDays = Math.round((targetTime - starterTime) / (1000 * 60 * 60 * 24));
  const tithiNum = diffDays + 1;

  const isKrishna = activeStarter.name.includes('कृष्ण');
  const baseName = activeStarter.name.split(' ')[0];
  const pakshaName = isKrishna ? 'कृष्ण पक्ष' : 'शुक्ल पक्ष';
  const pakshaShort = isKrishna ? 'कृष्ण' : 'शुक्ल';

  let tithiNameWord = TITHI_NAMES_HI[tithiNum] || '';
  if (isKrishna && tithiNum >= 15) {
    tithiNameWord = 'अमावस्या';
  }

  let tithiStr = '';
  let shortTithiStr = '';

  if (activeStarter.name === 'माघ कृष्ण' && tithiNum === 2) {
    tithiStr = 'माघ कृष्ण 2/3 (द्वितीया)';
    shortTithiStr = 'कृष्ण 2/3';
  } else if (activeStarter.name === 'माघ शुक्ल' && tithiNum === 12) {
    tithiStr = 'माघ शुक्ल 12-13 (द्वादशी)';
    shortTithiStr = 'शुक्ल 12-13';
  } else if (activeStarter.name === 'चैत्र कृष्ण' && tithiNum === 6) {
    tithiStr = 'चैत्र कृष्ण 6-7 (षष्ठी)';
    shortTithiStr = 'कृष्ण 6-7';
  }

  if (!tithiStr) {
    if (tithiNum >= 15) {
      if (isKrishna) {
        tithiStr = `${baseName} कृष्ण 30 (अमावस्या)`;
        shortTithiStr = 'अमावस्या';
      } else {
        tithiStr = `${baseName} शुक्ल 15 (पूर्णिमा)`;
        shortTithiStr = 'पूर्णिमा';
      }
    } else {
      tithiStr = `${activeStarter.name} ${tithiNum} (${tithiNameWord})`;
      shortTithiStr = `${pakshaShort} ${tithiNum}`;
    }
  }

  return {
    tithi: tithiStr,
    shortTithi: shortTithiStr,
    paksha: pakshaName
  };
};

const getGenericTithi = (date: Date): { tithi: string; shortTithi: string; paksha: string } => {
  const day = date.getDate();
  const tithiNum = (day % 15) === 0 ? 15 : day % 15;
  const isSud = day <= 15;
  const paksha = isSud ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const pakshaShort = isSud ? 'शुक्ल' : 'कृष्ण';
  const monthNames = ["माघ", "फाल्गुन", "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष"];
  const mName = monthNames[date.getMonth()];
  const tithiNameWord = TITHI_NAMES_HI[tithiNum] || '';
  const tithiName = `${mName} ${pakshaShort} ${tithiNum === 15 ? (isSud ? '15 (पूर्णिमा)' : '30 (अमावस्या)') : `${tithiNum} (${tithiNameWord})`}`;
  return {
    tithi: tithiName,
    shortTithi: `${pakshaShort} ${tithiNum === 15 ? (isSud ? '15' : '30') : tithiNum}`,
    paksha: paksha
  };
};

export default function PanchangPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);
  const [dbUpdates, setDbUpdates] = useState<Record<string, any>>({});
  const [selectedTirthId, setSelectedTirthId] = useState<string>(() => {
    return localStorage.getItem('preferred_jain_tirth') || 'shikharji';
  });

  const selectedTirth = JAIN_TIRTHS.find(t => t.id === selectedTirthId) || JAIN_TIRTHS[0];

  const handleSelectTirth = (id: string) => {
    setSelectedTirthId(id);
    localStorage.setItem('preferred_jain_tirth', id);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'panchang'), (snapshot) => {
      const updates: Record<string, any> = {};
      snapshot.forEach((doc) => {
        updates[doc.id] = doc.data();
      });
      setDbUpdates(updates);
      setLoading(false);
    }, (err) => {
      console.error("Error reading live panchang overrides:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getPanchangDetails = (date: Date): PanchangDetails => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const override = dbUpdates[dateKey];

    let baseDetails: PanchangDetails;

    if (year === 2026) {
      const monthData = JAIN_DATA_2026[month] || {};
      const dayData = monthData[day] || {};
      const sun = getSunTime(date);
      const calculated = getCalculatedTithi(date);

      baseDetails = {
        tithi: dayData.tithi || calculated.tithi,
        shortTithi: dayData.shortTithi || calculated.shortTithi,
        paksha: dayData.paksha || calculated.paksha,
        festivals: dayData.festivals || [],
        kalyanak: dayData.kalyanak || [],
        acharyaDarpan: dayData.acharyaDarpan || [],
        shubhMuhurat: getMUHURAT_2026(date),
        vrat: dayData.vrat || [],
        sunrise: sun.sunrise,
        sunset: sun.sunset,
        samvat: 'विक्रम संवत 2083',
        vns: 'वीर निर्वाण संवत 2552-53'
      };
    } else {
      // Fallback for other years (Approximate calculation)
      const fallback = getGenericTithi(date);
      const sunFallback = getSunTime(date);

      baseDetails = {
        tithi: fallback.tithi,
        shortTithi: fallback.shortTithi,
        paksha: fallback.paksha,
        festivals: [],
        kalyanak: [],
        acharyaDarpan: [],
        shubhMuhurat: ['सामान्य दिन'],
        vrat: [],
        sunrise: sunFallback.sunrise,
        sunset: sunFallback.sunset,
        samvat: `विक्रम संवत ${year + 57}`,
        vns: `वीर निर्वाण संवत ${year + 527}`
      };
    }

    if (override) {
      const parseStrVal = (val: any): string[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return String(val).split(',').map(s => s.trim()).filter(Boolean);
      };

      return {
        ...baseDetails,
        tithi: override.tithi || baseDetails.tithi,
        shortTithi: override.shortTithi || override.tithi || baseDetails.shortTithi,
        paksha: override.paksha || baseDetails.paksha,
        festivals: override.festivals ? parseStrVal(override.festivals) : baseDetails.festivals,
        kalyanak: override.kalyanak ? parseStrVal(override.kalyanak) : baseDetails.kalyanak,
        acharyaDarpan: override.acharyaDarpan ? parseStrVal(override.acharyaDarpan) : baseDetails.acharyaDarpan,
        shubhMuhurat: override.shubhMuhurat ? parseStrVal(override.shubhMuhurat) : baseDetails.shubhMuhurat,
        vrat: override.vrat ? parseStrVal(override.vrat) : baseDetails.vrat,
        sunrise: override.sunrise || baseDetails.sunrise,
        sunset: override.sunset || baseDetails.sunset,
        samvat: override.samvat || baseDetails.samvat,
        vns: override.vns || baseDetails.vns
      };
    }

    return baseDetails;
  };

  const translations = {
    en: {
      title: 'JAIN PANCHANG 2026',
      subtitle: 'Your spiritual calendar guide',
      tithi: 'Tithi',
      paksha: 'Paksha',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      muhurat: 'Shubh Muhurat',
      tirthankar: 'Tirthankar Darpan',
      acharya: 'Acharya Darpan',
      vrat: 'Monthly Vrat',
      details: 'Day Details',
      close: 'Close',
      sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
    },
    hi: {
      title: 'जैन पंचांग 2026',
      subtitle: 'आपका आध्यात्मिक कैलेंडर गाइड',
      tithi: 'तिथि',
      paksha: 'पक्ष',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      muhurat: 'शुभ मुहूर्त',
      tirthankar: 'तीर्थंकर दर्पण',
      acharya: 'आचार्य दर्पण',
      vrat: 'माह के प्रमुख व्रत',
      details: 'दिन का सम्पूर्ण विवरण',
      close: 'बंद करें',
      sun: 'रवि', mon: 'सोम', tue: 'मंगल', wed: 'बुध', thu: 'गुरु', fri: 'शुक्र', sat: 'शनि',
    }
  };

  const t = translations[language as keyof typeof translations] || translations.hi;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#FF6D00] mb-4" size={48} />
        <p className="text-gray-500 font-bold tracking-[0.2em] animate-pulse uppercase text-xs">Awaiting Cosmic Alignment...</p>
      </div>
    );
  }

  const selectedDetails = selectedDate ? getPanchangDetails(selectedDate) : null;

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white pb-24 px-4 sm:px-6 overflow-x-hidden transition-colors duration-300">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight truncate">
              {t.title}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-[#FF806A] font-black uppercase tracking-widest truncate hidden xs:block">{t.subtitle}</p>
          </div>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Inline Header Translator Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
            title="Translate Language / भाषा बदलें"
          >
            <Globe size={11} className="shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#FF6D00] rounded-[3rem] blur-[60px] opacity-10 pointer-events-none" />
        
        <div className="bg-white dark:bg-[#121111] rounded-[3rem] border-2 border-orange-500/20 dark:border-[#FF6D00]/20 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Previous Month">
              <ChevronLeft size={28} />
            </button>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl sm:text-4xl font-display font-black text-[#FF6D00] drop-shadow-[0_0_15px_rgba(255,109,0,0.4)]">
                  {format(currentDate, 'MMMM yyyy', { locale: language === 'hi' ? hi : undefined })}
                </h2>
                <button
                  onClick={() => {
                    const now = new Date();
                    setCurrentDate(now);
                    setSelectedDate(now);
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-[#FFD54F]/20 text-amber-900 dark:text-[#FFD54F] border border-amber-300 dark:border-[#FFD54F]/40 hover:bg-amber-200 transition-colors shadow-xs"
                >
                  {language === 'hi' ? 'आज' : 'Today'}
                </button>
              </div>
              <div className="flex gap-4 justify-center mt-2">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                  {language === 'hi' ? `वि.सं. ${currentDate.getFullYear() + 57}` : `V.S. ${currentDate.getFullYear() + 57}`}
                </span>
                <span className="text-[10px] text-gray-300 dark:text-gray-700">|</span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                  {language === 'hi' ? `वी.नि.सं. ${currentDate.getFullYear() + 527}` : `V.N.S. ${currentDate.getFullYear() + 527}`}
                </span>
              </div>
            </div>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Next Month">
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-8 relative z-10">
            {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat].map((day) => (
              <div key={day} className="text-center text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-6 gap-x-2 relative z-10">
            {calendarDays.map((day, idx) => {
              const details = getPanchangDetails(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative flex flex-col items-center group transition-all duration-300",
                    !isCurrentMonth && "opacity-20 pointer-events-none"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all duration-500",
                    isSelected 
                      ? "bg-gradient-to-br from-[#FFD54F] to-[#FFB300] text-black shadow-[0_0_20px_rgba(255,213,79,0.4)] scale-110 border-2 border-orange-300 dark:border-white/20" 
                      : isToday 
                        ? "bg-amber-100 dark:bg-[#FFD54F]/20 border-2 border-amber-500 dark:border-[#FFD54F] animate-pulse text-gray-900 dark:text-white" 
                        : "text-gray-800 dark:text-white group-hover:bg-gray-100 dark:group-hover:bg-white/10"
                  )}>
                    <span className="text-xl font-bold">
                      {format(day, 'd')}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-tighter opacity-70 truncate max-w-[50px] text-center",
                    isSelected ? "text-[#FF6D00] dark:text-[#FFD54F] opacity-100 font-extrabold" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {details.shortTithi || details.tithi}
                  </span>
                  
                  {(details.festivals.length > 0 || details.kalyanak.length > 0) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#F50057] rounded-full shadow-[0_0_8px_rgba(245,0,87,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && selectedDetails && (() => {
        const tirthSunrise = adjustTimeString(selectedDetails.sunrise, selectedTirth.sunriseOffsetMin);
        const tirthSunset = adjustTimeString(selectedDetails.sunset, selectedTirth.sunsetOffsetMin);
        const tirthNavkarsi = addMinutesToTimeString(tirthSunrise, 48);
        const tirthPorsi = addMinutesToTimeString(tirthSunrise, 180);
        const tirthSadhPorsi = addMinutesToTimeString(tirthSunrise, 270);
        const tirthChauvihar = tirthSunset;

        return (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10 line-height-normal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-black flex items-center gap-2">
              <Sparkles className="text-[#FFD54F]" size={20} />
              {t.details} — {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'hi' ? hi : undefined })}
            </h3>
          </div>

          {/* Jain Tirth Selector Card */}
          <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border-2 border-[#FF6D00]/25 shadow-xl relative overflow-hidden transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-150 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center border border-[#FF6D00]/30 text-[#FF6D00]">
                  <Sun size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-display font-black text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{language === 'hi' ? 'तीर्थ अनुसार पंचांग एवं चौविहार समय' : 'Jain Tirth Timings & Chauvihar'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 font-black">
                      {language === 'hi' ? 'नवीनतम' : 'Latest'}
                    </span>
                  </h4>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                    {language === 'hi' 
                      ? 'अपने पूज्य तीर्थ का चयन करें — सूर्योदय, सूर्यास्त व नवकारसी स्वतः समायोजित होंगे'
                      : 'Select your revered Tirth — Sunrise, Sunset & Navkarsi adjust automatically'}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-[#FF6D00]/15 text-[#FF6D00] border border-[#FF6D00]/30 inline-block">
                  📍 {language === 'hi' ? selectedTirth.nameHi : selectedTirth.nameEn}
                </span>
              </div>
            </div>

            {/* Tirth Switcher Pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {JAIN_TIRTHS.map(tirth => {
                const isSelected = tirth.id === selectedTirthId;
                return (
                  <button
                    key={tirth.id}
                    onClick={() => handleSelectTirth(tirth.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white shadow-md shadow-[#FF6D00]/25 scale-102"
                        : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5"
                    )}
                  >
                    <span>{language === 'hi' ? tirth.nameHi : tirth.nameEn}</span>
                    {tirth.sunriseOffsetMin !== 0 && (
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-md font-mono",
                        isSelected ? "bg-black/20 text-white" : "bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                      )}>
                        {tirth.sunriseOffsetMin > 0 ? `+${tirth.sunriseOffsetMin}m` : `${tirth.sunriseOffsetMin}m`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tirth Significance Note */}
            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 mb-4 border border-amber-200 dark:border-amber-500/20 flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                <strong className="font-black">{language === 'hi' ? selectedTirth.nameHi : selectedTirth.nameEn} ({selectedTirth.location}, {selectedTirth.state}): </strong>
                {language === 'hi' ? selectedTirth.significanceHi : selectedTirth.significanceEn}
              </p>
            </div>

            {/* 4-Box Sacred Jain Timings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3.5 border border-gray-150 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                  <Sunrise size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t.sunrise}</span>
                </div>
                <h5 className="text-lg font-black text-gray-900 dark:text-white">{tirthSunrise}</h5>
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                  {selectedTirth.sunriseOffsetMin !== 0 ? `${selectedTirth.sunriseOffsetMin > 0 ? '+' : ''}${selectedTirth.sunriseOffsetMin} min offset` : 'IST Standard'}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-3.5 border border-gray-150 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                  <Sunset size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{t.sunset}</span>
                </div>
                <h5 className="text-lg font-black text-gray-900 dark:text-white">{tirthSunset}</h5>
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                  {language === 'hi' ? 'संध्या प्रतिक्रमण' : 'Evening Pratikraman'}
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-3.5 border border-emerald-200 dark:border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                  <Clock size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{language === 'hi' ? 'नवकारसी' : 'Navkarsi'}</span>
                </div>
                <h5 className="text-lg font-black text-emerald-700 dark:text-emerald-300">{tirthNavkarsi}</h5>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {language === 'hi' ? 'सूर्योदय + 48 मि. त्याग' : '+48m after Sunrise'}
                </p>
              </div>

              <div className="bg-rose-50 dark:bg-rose-500/10 rounded-2xl p-3.5 border border-rose-200 dark:border-rose-500/20">
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 mb-1">
                  <Moon size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{language === 'hi' ? 'चौविहार समय' : 'Chauvihar'}</span>
                </div>
                <h5 className="text-lg font-black text-rose-700 dark:text-rose-300">{tirthChauvihar}</h5>
                <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                  {language === 'hi' ? 'रात्रि भोजन/जल त्याग' : 'Sunset Fasting Begins'}
                </p>
              </div>
            </div>

            {/* Additional Porsi Details */}
            <div className="mt-3 pt-3 border-t border-gray-150 dark:border-white/5 flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="font-bold text-gray-800 dark:text-gray-200">{language === 'hi' ? 'पोरसी (1 प्रहर):' : 'Porsi (1 Prahar):'}</span>
                <span>{tirthPorsi}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="font-bold text-gray-800 dark:text-gray-200">{language === 'hi' ? 'साढ़ पोरसी (1.5 प्रहर):' : 'Sadh Porsi:'}</span>
                <span>{tirthSadhPorsi}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                <span>✦ {language === 'hi' ? 'सूर्यास्त से 24 मि. पूर्व जल-आहार ग्रहण नियम श्रेयस्कर है' : 'Finish dinner 24m before Sunset'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 flex items-center justify-between shadow-sm dark:shadow-xl transition-all duration-300">
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">{t.tithi}</p>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{selectedDetails.tithi}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF6D00]/10 text-[#FF6D00] dark:text-[#FFD54F] font-bold border border-[#FF6D00]/20">{selectedDetails.paksha}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1">{language === 'hi' ? 'समय' : 'Time'}</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Sunrise size={16} className="text-[#FFD54F]" />
                    <span className="text-xs font-bold">{tirthSunrise}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Sunset size={16} className="text-[#FF8A65]" />
                    <span className="text-xs font-bold">{tirthSunset}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-xl relative overflow-hidden transition-all duration-300">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] flex items-center justify-center border border-white/20">
                  <Clock className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-wide uppercase text-gray-900 dark:text-white">{t.muhurat}</h4>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 relative z-10">
                {selectedDetails.shubhMuhurat.map((m, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 flex justify-between items-center border border-gray-150 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-[#00E676]" : "bg-[#FFD54F]")} />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{m}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#448AFF]/10 flex items-center justify-center border border-[#448AFF]/20">
                  <Star className="text-[#448AFF]" size={20} />
                </div>
                <h4 className="font-black text-sm tracking-wide uppercase leading-tight text-gray-900 dark:text-white">{t.tirthankar}</h4>
              </div>
              {selectedDetails.kalyanak.length > 0 ? (
                <ul className="space-y-3">
                  {selectedDetails.kalyanak.map((k, i) => (
                    <li key={i} className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#448AFF] mt-1 shrink-0" />
                      {k}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">{language === 'hi' ? 'आज कोई मुख्य कल्याणक नहीं है।' : 'No major kalyanaks today.'}</p>
              )}
            </div>

            <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20">
                  <Users className="text-[#00E676]" size={20} />
                </div>
                <h4 className="font-black text-sm tracking-wide uppercase leading-tight text-gray-900 dark:text-white">{t.acharya}</h4>
              </div>
              {selectedDetails.acharyaDarpan.length > 0 ? (
                <ul className="space-y-3">
                  {selectedDetails.acharyaDarpan.map((a, i) => (
                    <li key={i} className="text-xs font-bold text-gray-700 dark:text-gray-200 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] mt-1 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">{language === 'hi' ? 'आज कोई विशेष स्मृति नहीं है।' : 'No special memories today.'}</p>
              )}
            </div>

            {selectedDetails.festivals && selectedDetails.festivals.length > 0 && (
              <div className="col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-orange-200 dark:border-[#FFD54F]/20 shadow-sm dark:shadow-xl relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="text-amber-500 dark:text-amber-400" size={20} />
                  </div>
                  <h4 className="font-black text-lg tracking-wide uppercase text-gray-900 dark:text-white">{language === 'hi' ? 'महत्वपूर्ण त्योहार और दिवस' : 'Important Festivals & Days'}</h4>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {selectedDetails.festivals.map((f, i) => (
                    <span key={i} className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-xl text-xs font-black border border-amber-300 dark:border-amber-500/20 shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="col-span-2 bg-white dark:bg-[#121212] rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F50057]/10 flex items-center justify-center border border-[#F50057]/20">
                  <BookOpen className="text-[#F50057]" size={20} />
                </div>
                <h4 className="font-black text-lg tracking-wide uppercase text-gray-900 dark:text-white">{t.vrat}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDetails.vrat.length > 0 ? (
                  selectedDetails.vrat.map((v, i) => (
                    <span key={i} className="bg-[#F50057]/10 text-[#F50057] px-4 py-2 rounded-xl text-xs font-black border border-[#F50057]/20 shadow-sm">
                      {v}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">{language === 'hi' ? 'आज कोई विशेष व्रत नहीं है।' : 'No specific vrats listed for this day.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        );
      })()}
      <SectionAiAgent section="panchang" />
    </div>
  );
}
