import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, X, Sunrise, Sunset, Clock, Star, BookOpen, Users, ArrowLeft, Loader2, Info, Moon, Sun } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { hi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

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
    1: { tithi: 'वैशाख शुक्ल 15', festivals: ['श्री वर्धमान उपदेश दिवस'] },
    4: { tithi: 'ज्येष्ठ कृष्ण 4', acharyaDarpan: ['आचार्य श्री भरतसागरजी - संयम प्र.'] },
    10: { tithi: 'ज्येष्ठ कृष्ण 10', festivals: ['महोत्सव महा पूजा दिवस'] },
    11: { tithi: 'ज्येष्ठ कृष्ण 11', kalyanak: ['भग. शांतिनाथजी - जन्म, तप', 'भग. आदिनाथजी - गर्भ'], festivals: ['अपरा एकादशी'] },
    12: { tithi: 'ज्येष्ठ कृष्ण 12', festivals: ['श्री कुन्थुनाथ मोक्ष उत्सव'] },
    13: { tithi: 'ज्येष्ठ कृष्ण 13', kalyanak: ['भग. कुन्थुनाथजी - जन्म, तप', 'भग. अरनाथजी - जन्म, तप'], festivals: ['वट सावित्री व्रत'] },
    14: { tithi: 'ज्येष्ठ कृष्ण 14', acharyaDarpan: ['आर्यिका श्री रत्नमतिजी - दीक्षा स्मृति'], vrat: ['रोहिणी व्रत'] },
    15: { tithi: 'ज्येष्ठ कृष्ण 30 (अमावस्या)', kalyanak: ['भग. शीतलनाथजी - मोक्ष', 'भग. सुपार्श्वनाथजी - ज्ञान'], festivals: ['शनि जयंती'] },
    18: { tithi: 'ज्येष्ठ शुक्ल 2', festivals: ['वृष संक्रांति'] },
    19: { tithi: 'ज्येष्ठ शुक्ल 3', kalyanak: ['भग. सुपार्श्वनाथजी - जन्म, तप'] },
    21: { tithi: 'ज्येष्ठ शुक्ल 5', festivals: ['श्रुत पंचमी'], vrat: ['शास्त्र पूजन'] },
    26: { tithi: 'ज्येष्ठ शुक्ल 10', kalyanak: ['भग. महावीरस्वामी - ज्ञान'], festivals: ['गंगा दशमी'] },
    27: { tithi: 'ज्येष्ठ शुक्ल 11', festivals: ['निर्जला एकादशी'] },
    28: { tithi: 'ज्येष्ठ शुक्ल 12', festivals: ['स्वाध्याय दिवस'] },
    29: { tithi: 'ज्येष्ठ शुक्ल 13', festivals: ['स्वाध्याय दिवस दिन 2'] },
    30: { tithi: 'ज्येष्ठ शुक्ल 14', festivals: ['स्वाध्याय दिवस दिन 3'] },
    31: { tithi: 'शुक्ल 15 (पूर्णिमा)', festivals: ['ज्येष्ठ पूर्णिमा'], vrat: ['रोहिणी व्रत'] }
  },
  5: { // Jun
    1: { tithi: 'आषाढ़ कृष्ण 1', acharyaDarpan: ['आचार्य श्री विमलसागरजी - आचार्य पद'] },
    5: { tithi: 'आषाढ़ कृष्ण 5', festivals: ['मुनि विहार दिवस'] },
    10: { tithi: 'आषाढ़ कृष्ण 10', kalyanak: ['भग. मुनिसुव्रतनाथजी - जन्म, तप'] },
    11: { tithi: 'आषाढ़ कृष्ण 11', festivals: ['योगिनी एकादशी'], vrat: ['रोहिणी व्रत'] },
    14: { tithi: 'आषाढ़ कृष्ण 14', festivals: ['आषाढ़ अमावस्या पूर्व संध्या'] },
    15: { tithi: 'आषाढ़ शुक्ल 1', festivals: ['मिथुन संक्रांति'] },
    18: { tithi: 'आषाढ़ शुक्ल 4', acharyaDarpan: ['मुनि श्री भरतसागरजी - दीक्षा स्मृति'] },
    24: { tithi: 'आषाढ़ शुक्ल 10', kalyanak: ['भग. नेमिनाथजी - गर्भ'] },
    25: { tithi: 'आषाढ़ शुक्ल 11', festivals: ['देवशयनी एकादशी'] },
    28: { tithi: 'आषाढ़ शुक्ल 14', festivals: ['चातुर्मास व्रत प्रारंभ पूर्व संध्या'] },
    30: { tithi: 'आषाढ़ शुक्ल 15 (पूर्णिमा)', festivals: ['गुरु पूर्णिमा', 'चातुर्मास कलश स्थापना', 'व्यास पूर्णिमा', 'कोकिला व्रत'] }
  },
  6: { // Jul
    1: { tithi: 'श्रावण कृष्ण 1', festivals: ['वीर शासन जयंती', 'चातुर्मास व्रत नियम प्रारंभ'] },
    5: { tithi: 'श्रावण कृष्ण 5', festivals: ['मुनि आराधना दिवस'] },
    8: { tithi: 'श्रावण कृष्ण 8', vrat: ['रोहिणी व्रत'] },
    10: { tithi: 'श्रावण कृष्ण 10', festivals: ['वीर शासन जयंती'] },
    11: { tithi: 'श्रावण कृष्ण 11', festivals: ['कामिका एकादशी'] },
    14: { tithi: 'श्रावण कृष्ण 14', kalyanak: ['भग. पारसनाथजी - जन्म, तप', 'भग. मल्लिनाथजी - गर्भ'] },
    15: { tithi: 'श्रावण कृष्ण 30 (अमावस्या)', festivals: ['हरियाली अमावस्या'] },
    17: { tithi: 'श्रावण शुक्ल 2', festivals: ['कर्क संक्रांति'] },
    18: { tithi: 'श्रावण शुक्ल 3', festivals: ['हरियाली तीज'] },
    20: { tithi: 'श्रावण शुक्ल 5', festivals: ['नाग पंचमी'] },
    24: { tithi: 'श्रावण शुक्ल 9', kalyanak: ['भग. नेमिनाथजी - मोक्ष'] },
    28: { tithi: 'श्रावण शुक्ल 15 (पूर्णिमा)', festivals: ['रक्षाबंधन'], vrat: ['श्रावणी पूर्णिमा'] }
  },
  7: { // Aug
    1: { tithi: 'श्रावण शुक्ल 15', festivals: ['रक्षाबंधन पर्व उल्लास'] },
    4: { tithi: 'भाद्रपद कृष्ण 4', vrat: ['रोहिणी व्रत'] },
    7: { tithi: 'भाद्रपद कृष्ण 7', kalyanak: ['भग. पारसनाथजी - मोक्ष'], festivals: ['श्री कृष्ण जन्माष्टमी'] },
    10: { tithi: 'भाद्रपद कृष्ण 10', kalyanak: ['भग. आदिनाथजी - गर्भ कल्याणक'] },
    12: { tithi: 'भाद्रपद कृष्ण 12', festivals: ['सिंह संक्रांति'] },
    13: { tithi: 'भाद्रपद कृष्ण 13', festivals: ['भाद्रपद अमावस्या', 'पर्युषण महापर्व पूर्व संध्या'] },
    15: { tithi: 'भाद्रपद शुक्ल 1', festivals: ['स्वतंत्रता दिवस', 'पर्युषण पर्व प्रारंभ'] },
    18: { tithi: 'भाद्रपद शुक्ल 5', festivals: ['ऋषि पंचमी'] },
    21: { tithi: 'भाद्रपद शुक्ल 8', festivals: ['दशलक्षण महापर्व प्रारंभ', 'राधा अष्टमी'] },
    23: { tithi: 'भाद्रपद शुक्ल 10', festivals: ['सुगंध दशमी'], vrat: ['सुगंध दशमी व्रत'] },
    27: { tithi: 'भाद्रपद शुक्ल 14', festivals: ['अनंत चतुर्दशी'], vrat: ['अनंत चतुर्दशी व्रत'] },
    28: { tithi: 'भाद्रपद शुक्ल 15 (पूर्णिमा)', festivals: ['क्षमावाणी महापर्व', 'सुगंध दशमी'], vrat: ['भाद्रपद पूर्णिमा'] },
    31: { tithi: 'आश्विन कृष्ण 4', vrat: ['रोहिणी व्रत'] }
  },
  8: { // Sep
    5: { tithi: 'आश्विन कृष्ण 9', festivals: ['मुनि स्वाध्याय दिन'] },
    11: { tithi: 'आश्विन कृष्ण 14', festivals: ['आश्विन अमावस्या', 'सर्वपितृ अमावस्या'] },
    13: { tithi: 'आश्विन शुक्ल 1', festivals: ['शारदीय नवरात्रि प्रारंभ'] },
    17: { tithi: 'आश्विन शुक्ल 5', festivals: ['कन्या संक्रांति'] },
    22: { tithi: 'आश्विन शुक्ल 10', festivals: ['विजयादशमी', 'दशहरा'] },
    26: { tithi: 'आश्विन शुक्ल 14', festivals: ['शरद पूर्णिमा पूर्व'] },
    27: { tithi: 'आश्विन शुक्ल 15', festivals: ['शरद पूर्णिमा', 'महावीर निर्वाण लाडू स्मृति'] },
    28: { tithi: 'कार्तिक कृष्ण 1', vrat: ['रोहिणी व्रत'] }
  },
  9: { // Oct
    1: { tithi: 'कार्तिक कृष्ण 5', festivals: ['मुनि विहार व्रत'] },
    9: { tithi: 'कार्तिक कृष्ण 13', festivals: ['धनतेरस'] },
    10: { tithi: 'कार्तिक कृष्ण 14', festivals: ['दीपावली', 'रूप चतुर्दशी'], kalyanak: ['भगवान महावीर निर्वाण'] },
    11: { tithi: 'कार्तिक शुक्ल 1', festivals: ['वीर निर्वाण संवत नववर्ष', 'गोवर्धन पूजा'], vrat: ['गौतम गणधर केवलज्ञान'] },
    12: { tithi: 'कार्तिक शुक्ल 2', festivals: ['भाई दूज'] },
    15: { tithi: 'कार्तिक शुक्ल 5', festivals: ['ज्ञान पंचमी', 'पाण्डव पंचमी'] },
    18: { tithi: 'कार्तिक शुक्ल 8', festivals: ['गोपाष्टमी'] },
    24: { tithi: 'कार्तिक शुक्ल 14', festivals: ['तुलसी विवाह'], vrat: ['रोहिणी व्रत'] },
    25: { tithi: 'कार्तिक शुक्ल 15 (पूर्णिमा)', festivals: ['कार्तिक पूर्णिमा', 'रथयात्रा', 'देव दीपावली'] },
    31: { tithi: 'मार्गशीर्ष कृष्ण 6', festivals: ['स्वाध्याय एकाग्रता दिन'] }
  },
  10: { // Nov
    1: { tithi: 'मार्गशीर्ष कृष्ण 7', festivals: ['जैन संस्कृति प्रचार दिन'] },
    10: { tithi: 'मार्गशीर्ष कृष्ण 10', kalyanak: ['भग. नेमिनाथजी - जन्म, तप'], festivals: ['मार्गशीर्ष अमावस्या'] },
    16: { tithi: 'मार्गशीर्ष शुक्ल 1', festivals: ['वृश्चिक संक्रांति'] },
    20: { tithi: 'मार्गशीर्ष शुक्ल 5', festivals: ['विवाह पंचमी'], vrat: ['रोहिणी व्रत'] },
    24: { tithi: 'मार्गशीर्ष शुक्ल 9', kalyanak: ['भग. मल्लिनाथजी - जन्म, तप'] },
    25: { tithi: 'मार्गशीर्ष शुक्ल 10', kalyanak: ['भग. शांतिनाथजी - मोक्ष', 'भग. कुन्थुनाथजी - मोक्ष', 'भग. अरनाथजी - मोक्ष'], festivals: ['गीता जयंती'] },
    30: { tithi: 'मार्गशीर्ष शुक्ल 15 (पूर्णिमा)', festivals: ['अनंग त्रयोदशी स्मृति'] }
  },
  11: { // Dec
    1: { tithi: 'पौष कृष्ण 7', festivals: ['शीतकालीन संयम दिन'] },
    5: { tithi: 'पौष कृष्ण 11', kalyanak: ['भग. पारसनाथजी - जन्म स्मृति'], festivals: ['पौष कृष्ण एकादशी'] },
    10: { tithi: 'पौष कृष्ण 30 (अमावस्या)', festivals: ['पौष अमावस्या'] },
    16: { tithi: 'पौष शुक्ल 1', festivals: ['धनु संक्रांति'] },
    18: { tithi: 'पौष शुक्ल 10', kalyanak: ['भग. पारसनाथजी - जन्म, तप'] },
    19: { tithi: 'पौष शुक्ल 11', vrat: ['रोहिणी व्रत'] },
    24: { tithi: 'पौष शुक्ल 16', acharyaDarpan: ['मुनि श्री धीरसागरजी - समाधि स्मृति'] },
    25: { tithi: 'पौष शुक्ल 17', festivals: ['बड़ा दिन (Christmas)'] },
    31: { tithi: 'पौष शुक्ल 23', festivals: ['नवीन वर्ष पूर्व संध्या पूजा'] }
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

// Fortnight starters for 2026
const PAKSHA_STARTERS_2026 = [
  { start: '2025-12-20', name: 'पौष शुक्ल' },
  { start: '2026-01-04', name: 'माघ कृष्ण' },
  { start: '2026-01-18', name: 'माघ शुक्ल' },
  { start: '2026-02-01', name: 'फाल्गुन कृष्ण' },
  { start: '2026-02-16', name: 'फाल्गुन शुक्ल' },
  { start: '2026-03-02', name: 'चैत्र कृष्ण' },
  { start: '2026-03-18', name: 'चैत्र शुक्ल' },
  { start: '2026-04-02', name: 'वैशाख कृष्ण' },
  { start: '2026-04-15', name: 'वैशाख शुक्ल' },
  { start: '2026-05-01', name: 'ज्येष्ठ कृष्ण' },
  { start: '2026-05-16', name: 'ज्येष्ठ शुक्ल' },
  { start: '2026-06-01', name: 'आषाढ़ कृष्ण' },
  { start: '2026-06-15', name: 'आषाढ़ शुक्ल' },
  { start: '2026-07-01', name: 'श्रावण कृष्ण' },
  { start: '2026-07-16', name: 'श्रावण शुक्ल' },
  { start: '2026-07-29', name: 'भाद्रपद कृष्ण' },
  { start: '2026-08-15', name: 'भाद्रपद शुक्ल' },
  { start: '2026-08-29', name: 'आश्विन कृष्ण' },
  { start: '2026-09-13', name: 'आश्विन शुक्ल' },
  { start: '2026-09-28', name: 'कार्तिक कृष्ण' },
  { start: '2026-10-11', name: 'कार्तिक शुक्ल' },
  { start: '2026-10-26', name: 'मार्गशीर्ष कृष्ण' },
  { start: '2026-11-16', name: 'मार्गशीर्ष शुक्ल' },
  { start: '2026-11-26', name: 'पौष कृष्ण' },
  { start: '2026-12-11', name: 'पौष शुक्ल' },
  { start: '2026-12-26', name: 'माघ कृष्ण' }
];

const getCalculatedTithi = (date: Date): { tithi: string; paksha: string } => {
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

  let tithiStr = '';
  if (activeStarter.name === 'माघ कृष्ण') {
    if (tithiNum === 2) tithiStr = 'माघ कृष्ण 2/3';
    else if (tithiNum > 2) tithiStr = `माघ कृष्ण ${tithiNum}`;
  } else if (activeStarter.name === 'माघ शुक्ल' && tithiNum === 12) {
    tithiStr = 'माघ शुक्ल 12-13';
  } else if (activeStarter.name === 'चैत्र कृष्ण' && tithiNum === 6) {
    tithiStr = 'चैत्र कृष्ण 6-7';
  } else if (activeStarter.name === 'चैत्र कृष्ण' && tithiNum === 10) {
    tithiStr = 'चैत्र कृष्ण 10-11';
  }

  if (!tithiStr) {
    if (tithiNum >= 15) {
      tithiStr = isKrishna ? `${baseName} कृष्ण 30 (अमावस्या)` : `${baseName} शुक्ल 15 (पूर्णिमा)`;
    } else {
      tithiStr = `${activeStarter.name} ${tithiNum}`;
    }
  }

  return {
    tithi: tithiStr,
    paksha: pakshaName
  };
};

const getGenericTithi = (date: Date) => {
  const day = date.getDate();
  const tithiNum = (day % 15) === 0 ? 15 : day % 15;
  const isSud = day <= 15;
  const paksha = isSud ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const monthNames = ["माघ", "फाल्गुन", "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष"];
  const mName = monthNames[date.getMonth()];
  const tithiName = `${mName} ${isSud ? 'शुक्ल' : 'कृष्ण'} ${tithiNum === 15 ? (isSud ? '15 (पूर्णिमा)' : '30 (अमावस्या)') : tithiNum}`;
  return {
    tithi: tithiName,
    paksha: paksha
  };
};

export default function PanchangPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getPanchangDetails = (date: Date): PanchangDetails => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    if (year === 2026) {
      const monthData = JAIN_DATA_2026[month] || {};
      const dayData = monthData[day] || {};
      const sun = getSunTime(date);
      const calculated = getCalculatedTithi(date);

      return {
        tithi: calculated.tithi,
        paksha: calculated.paksha,
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
    }

    // Fallback for other years (Approximate calculation)
    const fallback = getGenericTithi(date);
    const sunFallback = getSunTime(date);

    return {
      tithi: fallback.tithi,
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#FF6D00] mb-4" size={48} />
        <p className="text-gray-500 font-bold tracking-[0.2em] animate-pulse uppercase text-xs">Awaiting Cosmic Alignment...</p>
      </div>
    );
  }

  const selectedDetails = selectedDate ? getPanchangDetails(selectedDate) : null;

  return (
    <div className="min-h-screen bg-[#080808] text-white p-4 pb-24 overflow-x-hidden">
      <header className="flex items-center gap-4 mb-6 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F]">
            {t.title}
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.subtitle}</p>
        </div>
      </header>

      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#FF6D00] rounded-[3rem] blur-[60px] opacity-10 pointer-events-none" />
        
        <div className="bg-[#121111] rounded-[3rem] border-2 border-[#FF6D00]/20 p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={28} />
            </button>
            <div className="text-center">
              <h2 className="text-4xl font-display font-black text-[#FF6D00] drop-shadow-[0_0_15px_rgba(255,109,0,0.4)]">
                {format(currentDate, 'MMMM yyyy', { locale: language === 'hi' ? hi : undefined })}
              </h2>
              <div className="flex gap-4 justify-center mt-2">
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  {language === 'hi' ? `वि.सं. ${currentDate.getFullYear() + 57}` : `V.S. ${currentDate.getFullYear() + 57}`}
                </span>
                <span className="text-[10px] text-gray-700">|</span>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  {language === 'hi' ? `वी.नि.सं. ${currentDate.getFullYear() + 527}` : `V.N.S. ${currentDate.getFullYear() + 527}`}
                </span>
              </div>
            </div>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-8 relative z-10">
            {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat].map((day) => (
              <div key={day} className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
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
                      ? "bg-gradient-to-br from-[#FFD54F] to-[#FFB300] shadow-[0_0_20px_rgba(255,213,79,0.4)] scale-110 border-2 border-white/20" 
                      : isToday 
                        ? "bg-[#FFD54F]/20 border-2 border-[#FFD54F] animate-pulse" 
                        : "group-hover:bg-white/10"
                  )}>
                    <span className="text-xl font-bold">
                      {format(day, 'd')}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-tighter opacity-60",
                    isSelected ? "text-[#FFD54F] opacity-100" : "text-gray-400"
                  )}>
                    {details.tithi}
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

      {selectedDate && selectedDetails && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10 line-height-normal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-black flex items-center gap-2">
              <Sparkles className="text-[#FFD54F]" size={20} />
              {t.details} — {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'hi' ? hi : undefined })}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-[#121212] rounded-[2rem] p-6 border border-white/5 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{t.tithi}</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black text-white">{selectedDetails.tithi}</h4>
                  <span className="text-xs text-[#FF6D00] font-bold">{selectedDetails.paksha}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{language === 'hi' ? 'समय' : 'Time'}</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <Sunrise size={16} className="text-[#FFD54F]" />
                    <span className="text-xs font-bold">{selectedDetails.sunrise}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sunset size={16} className="text-[#FF8A65]" />
                    <span className="text-xs font-bold">{selectedDetails.sunset}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-[#121212] rounded-[2rem] p-6 border border-white/5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] flex items-center justify-center border border-white/20">
                  <Clock className="text-black" size={20} />
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-wide uppercase">{t.muhurat}</h4>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 relative z-10">
                {selectedDetails.shubhMuhurat.map((m, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 flex justify-between items-center border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-[#00E676]" : "bg-[#FFD54F]")} />
                      <span className="text-sm font-bold text-gray-300">{m}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#448AFF]/10 flex items-center justify-center border border-[#448AFF]/20">
                  <Star className="text-[#448AFF]" size={20} />
                </div>
                <h4 className="font-black text-sm tracking-wide uppercase leading-tight">{t.tirthankar}</h4>
              </div>
              {selectedDetails.kalyanak.length > 0 ? (
                <ul className="space-y-3">
                  {selectedDetails.kalyanak.map((k, i) => (
                    <li key={i} className="text-xs font-bold text-gray-200 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#448AFF] mt-1 shrink-0" />
                      {k}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[10px] text-gray-600 italic">{language === 'hi' ? 'आज कोई मुख्य कल्याणक नहीं है।' : 'No major kalyanaks today.'}</p>
              )}
            </div>

            <div className="bg-[#121212] rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20">
                  <Users className="text-[#00E676]" size={20} />
                </div>
                <h4 className="font-black text-sm tracking-wide uppercase leading-tight">{t.acharya}</h4>
              </div>
              {selectedDetails.acharyaDarpan.length > 0 ? (
                <ul className="space-y-3">
                  {selectedDetails.acharyaDarpan.map((a, i) => (
                    <li key={i} className="text-xs font-bold text-gray-200 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] mt-1 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[10px] text-gray-600 italic">{language === 'hi' ? 'आज कोई विशेष स्मृति नहीं है।' : 'No special memories today.'}</p>
              )}
            </div>

            {selectedDetails.festivals && selectedDetails.festivals.length > 0 && (
              <div className="col-span-2 bg-[#121212] rounded-[2rem] p-6 border border-[#FFD54F]/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="text-amber-400" size={20} />
                  </div>
                  <h4 className="font-black text-lg tracking-wide uppercase">{language === 'hi' ? 'महत्वपूर्ण त्योहार और दिवस' : 'Important Festivals & Days'}</h4>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {selectedDetails.festivals.map((f, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-300 px-4 py-2 rounded-xl text-xs font-black border border-amber-500/20 shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="col-span-2 bg-[#121212] rounded-[2rem] p-6 border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F50057]/10 flex items-center justify-center border border-[#F50057]/20">
                  <BookOpen className="text-[#F50057]" size={20} />
                </div>
                <h4 className="font-black text-lg tracking-wide uppercase">{t.vrat}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDetails.vrat.length > 0 ? (
                  selectedDetails.vrat.map((v, i) => (
                    <span key={i} className="bg-[#F50057]/10 text-[#F50057] px-4 py-2 rounded-xl text-xs font-black border border-[#F50057]/20 shadow-sm">
                      {v}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-600 italic">{language === 'hi' ? 'आज कोई विशेष व्रत नहीं है।' : 'No specific vrats listed for this day.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
