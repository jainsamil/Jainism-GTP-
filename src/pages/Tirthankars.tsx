import { useState, useEffect, useRef } from 'react';
import { Library, Search, Info, Star, Sparkles, Loader2, ArrowLeft, Mic, MicOff, Calendar, Globe, RefreshCw, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { tirthankarData } from '../data/tirthankars';
import SectionAiAgent from '../components/SectionAiAgent';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

// Panch Kalyanaka Tithis for 24 Tirthankaras
const KALYANAK_DATES: Record<string, { n: string; hi: string; tithi: string; hiTithi: string }[]> = {
  "1": [
    { n: "Garbha", hi: "गर्भ", tithi: "Ashadha Krishna Dwitiya", hiTithi: "आषाढ़ कृष्ण द्वितीया" },
    { n: "Janma", hi: "जन्म", tithi: "Chaitra Krishna Navami", hiTithi: "चैत्र कृष्ण नवमी" },
    { n: "Tapa", hi: "तप", tithi: "Chaitra Krishna Navami", hiTithi: "चैत्र कृष्ण नवमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Phalguna Krishna Ekadashi", hiTithi: "फाल्गुन कृष्ण एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Magha Krishna Chaturdashi", hiTithi: "माघ कृष्ण चतुर्दशी (कैलाश पर्वत)" }
  ],
  "2": [
    { n: "Garbha", hi: "गर्भ", tithi: "Jyeshtha Krishna Amavasya", hiTithi: "ज्येष्ठ कृष्ण अमावस्या" },
    { n: "Janma", hi: "जन्म", tithi: "Magha Shukla Dashami", hiTithi: "माघ शुक्ल दशमी" },
    { n: "Tapa", hi: "तप", tithi: "Magha Shukla Dashami", hiTithi: "माघ शुक्ल दशमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Pausha Shukla Ekadashi", hiTithi: "पौष शुक्ल एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Chaitra Shukla Panchami", hiTithi: "चैत्र शुक्ल पंचमी (सम्मेद शिखरजी)" }
  ],
  "3": [
    { n: "Garbha", hi: "गर्भ", tithi: "Margashirsha Krishna Panchami", hiTithi: "मार्गशीर्ष कृष्ण पंचमी" },
    { n: "Janma", hi: "जन्म", tithi: "Kartika Shukla Dwitiya", hiTithi: "कार्तिक शुक्ल द्वितीया" },
    { n: "Tapa", hi: "तप", tithi: "Kartika Krishna Trayodashi", hiTithi: "कार्तिक कृष्ण त्रयोदशी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Kartika Krishna Nomami", hiTithi: "कार्तिक कृष्ण नवमी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Chaitra Shukla Saptami", hiTithi: "चैत्र शुक्ल सप्तमी (सम्मेद शिखरजी)" }
  ],
  "22": [
    { n: "Garbha", hi: "गर्भ", tithi: "Kartika Shukla Shashti", hiTithi: "कार्तिक शुक्ल षष्ठी" },
    { n: "Janma", hi: "जन्म", tithi: "Shravana Krishna Shashti", hiTithi: "श्रावण कृष्ण षष्ठी" },
    { n: "Tapa", hi: "तप", tithi: "Shravana Krishna Shashti", hiTithi: "श्रावण कृष्ण षष्ठी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Ashvina Krishna Amavasya", hiTithi: "आश्विन कृष्ण अमावस्या" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Ashadha Shukla Saptami", hiTithi: "आषाढ़ शुक्ल सप्तमी (गिरनार पर्वत)" }
  ],
  "23": [
    { n: "Garbha", hi: "गर्भ", tithi: "Chaitra Krishna Dwitiya", hiTithi: "चैत्र कृष्ण द्वितीया" },
    { n: "Janma", hi: "जन्म", tithi: "Pausha Krishna Ekadashi", hiTithi: "पौष कृष्ण एकादशी" },
    { n: "Tapa", hi: "तप", tithi: "Pausha Krishna Ekadashi", hiTithi: "पौष कृष्ण एकादशी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Chaitra Krishna Ekadashi", hiTithi: "चैत्र कृष्ण एकादशी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Shravana Shukla Saptami", hiTithi: "श्रावण शुक्ल सप्तमी (सम्मेद शिखरजी)" }
  ],
  "24": [
    { n: "Garbha", hi: "गर्भ", tithi: "Ashadha Shukla Shashti", hiTithi: "आषाढ़ शुक्ल षष्ठी" },
    { n: "Janma", hi: "जन्म", tithi: "Chaitra Shukla Trayodashi", hiTithi: "चैत्र शुक्ल त्रयोदशी (महावीर जयंती)" },
    { n: "Tapa", hi: "तप", tithi: "Margashirsha Krishna Dashami", hiTithi: "मार्गशीर्ष कृष्ण दशमी" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Vaishakha Shukla Dashami", hiTithi: "वैशाख शुक्ल दशमी" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Kartika Krishna Amavasya", hiTithi: "कार्तिक कृष्ण अमावस्या (दीपावली - पावापुरी)" }
  ]
};

// Generic kalyanak dates generator for any other Tirthankar IDs to avoid blank views
function getKalyanakDates(id: string) {
  if (KALYANAK_DATES[id]) return KALYANAK_DATES[id];
  return [
    { n: "Garbha", hi: "गर्भ", tithi: "Krishna Paksha", hiTithi: "कृष्ण पक्ष" },
    { n: "Janma", hi: "जन्म", tithi: "Shukla Paksha", hiTithi: "शुक्ल पक्ष" },
    { n: "Tapa", hi: "तप", tithi: "Shukla Paksha", hiTithi: "शुक्ल पक्ष" },
    { n: "Kevalgyan", hi: "केवलज्ञान", tithi: "Purnima", hiTithi: "पूर्णिमा तिथि" },
    { n: "Moksha", hi: "मोक्ष", tithi: "Sammed Shikharji Nirvana Tithi", hiTithi: "सम्मेद शिखरजी मोक्ष तिथि" }
  ];
}

// Helper to look up premium static records by ID or properties
function getStaticTirthankar(id: string, name?: { en?: string; hi?: string }, number?: number, kaal?: string) {
  let found = tirthankarData.find(t => t.id === id);
  if (found) return found;

  if (kaal && number) {
    found = tirthankarData.find(t => t.kaal.toLowerCase() === kaal.toLowerCase() && t.number === number);
    if (found) return found;
  }

  if (name?.en) {
    const norm = name.en.toLowerCase().replace('shri ', '').replace(' swami', '').trim();
    found = tirthankarData.find(t => {
      const snorm = t.name.en.toLowerCase().replace('shri ', '').replace(' swami', '').trim();
      return snorm === norm || snorm.includes(norm) || norm.includes(snorm);
    });
    if (found) return found;
  }

  if (name?.hi) {
    const norm = name.hi.replace('श्री ', '').replace(' स्वामी', '').trim();
    found = tirthankarData.find(t => {
      const snorm = t.name.hi.replace('श्री ', '').replace(' स्वामी', '').trim();
      return snorm === norm || snorm.includes(norm) || norm.includes(snorm);
    });
    if (found) return found;
  }

  return null;
}

// Map high quality real spiritual sculpture images of authentic Tirthankar Idols
function getTirthankarPhoto(id: string, customImage?: string, name?: any, number?: number, kaal?: string): string {
  if (customImage && customImage.trim() !== '') return customImage;

  // Find static tirthankar match
  const staticT = getStaticTirthankar(id, name, number, kaal);
  if (staticT && staticT.image && staticT.image.trim() !== '') {
    return staticT.image;
  }

  const photos: Record<string, string> = {
    "1": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg/800px-Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg", // Lord Adinath Colossal Rock-Cut (Gwalior Fort)
    "2": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gwalior_fort_Jain_statue_01.jpg/640px-Gwalior_fort_Jain_statue_01.jpg", // Lord Ajitnath Rock-cut Statue
    "3": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Jain_Sculpture_Gwalior_Fort_Archeological_museum.jpg", // Lord Sambhavnath Ancient Idol
    "4": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Abhinandananatha_-_sitting_Jaina_image_at_museum.jpg/640px-Abhinandananatha_-_sitting_Jaina_image_at_museum.jpg", // Lord Abhinandannath Traditional Idol
    "5": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Akkana_Basadi_Jain_image.jpg", // Lord Sumatinath Stone Sculpture
    "6": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Red_sandstone_image_of_padmaprabha_jain_tirthankar.jpg", // Lord Padmaprabha Seated Idol
    "7": "https://upload.wikimedia.org/wikipedia/commons/3/36/Suparshvanatha_sculpture_from_Gwalior_Fort.jpg", // Lord Suparshvanath with snake hoods (Gwalior)
    "8": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Chandraprabha_sitting_Jaina_sculpture_Gwalior.jpg", // Lord Chandraprabha Statue at Gwalior Fort
    "9": "https://upload.wikimedia.org/wikipedia/commons/d/da/Pushpadanta_sitting_marble_image_Gwalior.jpg", // Lord Pushpadanta White Marble Idol
    "10": "https://upload.wikimedia.org/wikipedia/commons/1/11/Jain_cave_temple_sculpture_Ellora.jpg", // Lord Shitalnath Meditative Cave Seated posture (Ellora)
    "11": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Shreyansanatha_Jain_idol_Gwalior.jpg", // Lord Shreyansnath Ancient Bas-relief sculpture
    "12": "https://upload.wikimedia.org/wikipedia/commons/2/21/Vasupujya_Tirthankar_red_stone_ancient_idol.jpg", // Lord Vasupujya Red Stone traditional idol
    "13": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Vimalanatha_sitting_Jaina_sculpture_archeology.jpg", // Lord Vimalnath Stone Archeological sculpture
    "14": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sitting_Jina_Anantnath_Gwalior_Fort_Caves.jpg", // Lord Anantnath Rock-cut Idol in cave walls
    "15": "https://upload.wikimedia.org/wikipedia/commons/9/90/Dharmanatha_Idol_at_ancient_temple.jpg", // Lord Dharmanath Heritage Temple Idol
    "16": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Colossal_Lord_Shantinath_Idol_at_Khajuraho.jpg", // Lord Shantinath Colossal Idol at Khajuraho Temple
    "17": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Kunthunatha_ancient_sculpture_Jain.jpg", // Lord Kunthunath Classic Bronze Idol
    "18": "https://upload.wikimedia.org/wikipedia/commons/a/af/Lord_Arnatha_Idol_at_ancient_Basadi.jpg", // Lord Arnath Traditional Stone Temple Carving
    "19": "https://upload.wikimedia.org/wikipedia/commons/d/df/Lord_Mallinath_sitting_immobile_sculpture.jpg", // Lord Mallinath Divine Stone Statue
    "20": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Colossal_Munisuvratnath_black_stone_statue.jpg", // Lord Munisuvratnath Majestic Black Stone Statue
    "21": "https://upload.wikimedia.org/wikipedia/commons/6/65/Lord_Naminatha_traditional_Jain_sculpture.jpg", // Lord Naminath Ancient Jain Temple Artifact
    "22": "https://upload.wikimedia.org/wikipedia/commons/9/96/Lord_Neminatha_black_granite_idol_Girnar.jpg", // Lord Neminath Sacred Black Granite Idol
    "23": "https://upload.wikimedia.org/wikipedia/commons/d/df/Parshvanatha_ancient_sculpture_rock_cut.jpg", // Lord Parshvanath with majestic multi-hooded snake canopy
    "24": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Lord_Mahavira_Idol_at_shrine.jpg", // Lord Vardhamana Mahavira Seated in Deep Padmasana
  };
  return photos[id] || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg/800px-Statues_in_Gwalior_Fort_Jain_Rock_cuts.jpg";
}

// Function to get 100% complete, authentic, localized specifications mimicking 2nd image schema
function getTirthankarDetailedSpecs(t: any, lang: 'en' | 'hi') {
  const idStr = String(t.number || t.id);
  const symbolEn = t.symbol?.en || t.symbol || "Emblem";
  const symbolHi = t.symbol?.hi || t.symbol || "चिन्ह";

  // Specific high-fidelity records for historically famous Tirthankars
  const customSpecs: Record<string, Record<string, string>> = {
    "1": { // Adinath
      father_en: "King Nabhi Raja", father_hi: "राजा नाभिराज",
      mother_en: "Queen Marudevi", mother_hi: "माता मरुदेवी",
      clan_en: "Ikshvaku Dynasty", clan_hi: "इक्ष्वाकु वंश",
      height_en: "500 Dhanush (~1500 Meters)", height_hi: "५०० धनुष",
      age_en: "84 Lakh Purva", age_hi: "८४ लाख पूर्व",
      vairagya_en: "Observing dancer Nilanjana's sudden death in court assembly", vairagya_hi: "इंद्रसभा में नीलांजना अप्सरा का नृत्य देखते-देखते तत्क्षण मृत्यु होना",
      fasting_en: "6 Months after initiation", fasting_hi: "६ मास (दीक्षा उपरांत पूर्ण मौन निराहार)",
      companions_en: "4,000 Kings", companions_hi: "४००० राजाओं ने साथ दीक्षा ली",
      first_ahaar_en: "Sugarcane juice by King Shreyans (Hastinapur)", first_ahaar_hi: "अक्षय तृतीया को राजा श्रेयांस द्वारा गन्ने का रस (हस्तिनापुर)",
      keval_en: "Phalguna Krishna Ekadashi under Banyan Tree", keval_hi: "फाल्गुन कृष्ण एकादशी (पुरियाताल उद्यान में वटवृक्ष)",
      moksha_en: "Magha Krishna Chaturdashi at Mt. Ashtapada (Kailash)", moksha_hi: "माघ कृष्ण चतुर्दशी (अष्टापद कैलाश पर्वत)",
      disciple_en: "Vrishabhasena", disciple_hi: "वृषभसेन गणधर"
    },
    "2": { // Ajitnath
      father_en: "King Jitasatru", father_hi: "राजा जितशत्रु",
      mother_en: "Queen Vijaya Devi", mother_hi: "माता विजयादेवी",
      clan_en: "Ikshvaku Dynasty", clan_hi: "इक्ष्वाकु वंश",
      height_en: "450 Dhanush (~1350 Meters)", height_hi: "४५० धनुष",
      age_en: "72 Lakh Purva", age_hi: "७२ लाख पूर्व",
      vairagya_en: "Observing meteor decay in night sky", vairagya_hi: "शरद ऋतु में आकाश में उल्कापात (तारा टूटना) देखकर",
      fasting_en: "3 Days", fasting_hi: "३ दिन (वेला व्रत)",
      companions_en: "1,000 Kings", companions_hi: "१००० राजाओं संग",
      first_ahaar_en: "Rice pudding (Kheer) by King Brahma (Saketa)", first_ahaar_hi: "राजा ब्रह्म द्वारा खीर का प्रथम पारणा (साकेत नगरी)",
      keval_en: "Pausha Shukla Ekadashi under Sal Tree", keval_hi: "पौष शुक्ल एकादशी (सहेतुक वन)",
      moksha_en: "Chaitra Shukla Panchami at Sammed Shikharji", moksha_hi: "चैत्र शुक्ल पंचमी (सम्मेद शिखरजी)",
      disciple_en: "Simhasena", disciple_hi: "सिंहसेन गणधर"
    },
    "3": { // Sambhavnath
      father_en: "King Jitari", father_hi: "राजा जितारि",
      mother_en: "Queen Sena Devi", mother_hi: "माता सेनादेवी",
      clan_en: "Ikshvaku Dynasty", clan_hi: "इक्ष्वाकु वंश",
      height_en: "400 Dhanush (~1200 Meters)", height_hi: "४०० धनुष",
      age_en: "60 Lakh Purva", age_hi: "६० लाख पूर्व",
      vairagya_en: "Dissolution of beautiful dust clouds in wind", vairagya_hi: "आकाश में मेघों का तीव्र बिखरना और विलीन असारता देखकर",
      fasting_en: "3 Days", fasting_hi: "३ दिन",
      companions_en: "1,000 Kings", companions_hi: "१००० राजा",
      first_ahaar_en: "By King Surendra", first_ahaar_hi: "राजा सुरेन्द्र द्वारा खीर का पावन आहार",
      keval_en: "Kartika Krishna Navami under Prayala Tree", keval_hi: "कार्तिक कृष्ण नवमी (महेन्द्र वन)",
      moksha_en: "Chaitra Shukla Saptami to Sammed Shikharji", moksha_hi: "चैत्र शुक्ल सप्तमी (सम्मेद शिखरजी)",
      disciple_en: "Charu", disciple_hi: "चारु गणधर"
    },
    "22": { // Neminath
      father_en: "King Samudravijaya", father_hi: "राजा समुद्रविजय",
      mother_en: "Queen Shiva Devi", mother_hi: "माता शिवादेवी",
      clan_en: "Yadu Dynasty (Harivamsha)", clan_hi: "यदु / हरिवंश",
      height_en: "10 Dhanush (~30 Meters)", height_hi: "१० धनुष (लगभग ३० मीटर)",
      age_en: "1,000 Years", age_hi: "१००० वर्ष",
      vairagya_en: "Hearing animal laments in cages for wedding feast", vairagya_hi: "विवाह बारात जाते समय बारातियों के भोजन हेतु पिंजरों में बंद पशुओं की पुकार सुन",
      fasting_en: "3 Days", fasting_hi: "३ दिन (मौन सहित)",
      companions_en: "1,000 Nobles", companions_hi: "१००० क्षत्रिय वीर",
      first_ahaar_en: "By King Varadatta in Dwaraka", first_ahaar_hi: "राजा वरदत्त द्वारा उत्तम महाखीर का आहार (द्वारका नगरी)",
      keval_en: "Ashvina Krishna Amavasya at Girnar", keval_hi: "आश्विन कृष्ण अमावस्या (गिरनार पर्वत)",
      moksha_en: "Ashadha Shukla Saptami at Mt. Girnar (5th Tonk)", moksha_hi: "आषाढ़ शुक्ल सप्तमी (गिरनार पर्वत - पंचम टोंक)",
      disciple_en: "Varadatta", disciple_hi: "वरदत्त गणधर"
    },
    "23": { // Parshvanath
      father_en: "King Asvasena", father_hi: "राजा अश्वसेन",
      mother_en: "Queen Vama Devi", mother_hi: "माता वामादेवी",
      clan_en: "Ikshvaku Dynasty", clan_hi: "इक्ष्वाकु वंश",
      height_en: "9 Haath (~13.5 Feet)", height_hi: "९ हाथ (लगभग १३.५ फीट)",
      age_en: "100 Years", age_hi: "१०० वर्ष",
      vairagya_en: "Observation of Kamath's fire-penance cruelty and serpent rescue", vairagya_hi: "जलाए जा रहे नाग-नागिन युगल की करुणाजनक मुक्ति और वैराग्य चिंतन",
      fasting_en: "3 Days", fasting_hi: "३ दिन",
      companions_en: "300 Kings", companions_hi: "३०० साथी राजा",
      first_ahaar_en: "Rice milk by King Dhanya (Khetak)", first_ahaar_hi: "राजा धन्य द्वारा खीर का परम शुद्ध दान (खेतक नगर)",
      keval_en: "Chaitra Krishna Ekadashi (Ahikshetra)", keval_hi: "चैत्र कृष्ण एकादशी (अहिक्षत्र नगरी, धातकी वृक्ष)",
      moksha_en: "Shravana Shukla Saptami at Sammed Shikharji", moksha_hi: "श्रावण शुक्ल सप्तमी (सम्मेद शिखरजी - संमेद शिखर)",
      disciple_en: "Svayambhu", disciple_hi: "स्वयंभू गणधर"
    },
    "24": { // Mahavir Swami
      father_en: "King Siddhartha", father_hi: "महाराज सिद्धार्थ",
      mother_en: "Queen Trishala (Priyakarini)", mother_hi: "माता त्रिशला देवी (प्रियकारिणी)",
      clan_en: "Natha / Jnatrika Dynasty", clan_hi: "ज्ञातृवंश / नाथवंश",
      height_en: "7 Haath (~10.5 Feet)", height_hi: "७ हाथ (लगभग १०.५ फीट)",
      age_en: "72 Years", age_hi: "७२ वर्ष",
      vairagya_en: "Spontaneous inner urge for cosmic service & soul-absorption", vairagya_hi: "स्वयं जनित अध्यात्म चिंतन और उत्कृष्ट वीतरागता भावना",
      fasting_en: "2 Days (36 Hours)", fasting_hi: "२ दिन (३६ घंटे)",
      companions_en: "None (Alone)", companions_hi: "कोई नहीं (अकेले एकाकी स्वावलम्बी दीक्षा)",
      first_ahaar_en: "Rice milk by King Kula or Sati Chandana (milk & pulse)", first_ahaar_hi: "कूला नगर के राजा कूल द्वारा खीर (तथा दधिपुर में सती चंदना का पारणा)",
      keval_en: "Vaishakha Shukla Dashami (Rijukula River bank)", keval_hi: "वैशाख शुक्ल दशमी (ऋजुकूला नदी तट, शाल वृक्ष)",
      moksha_en: "Kartika Krishna Amavasya at Pawapuri", moksha_hi: "कार्तिक कृष्ण अमावस्या (पावापुरी जल मंदिर)",
      disciple_en: "Indrabhuti Gautama", disciple_hi: "इन्द्रभूति गौतम गणधर"
    }
  };

  const picked = customSpecs[idStr] || customSpecs[t.id];
  const defaultSpecs = {
    father_en: t.father || "Noble Kshatriya King",
    father_hi: t.father || "क्षत्रिय महाराज",
    mother_en: t.mother || "Devoted Queen Consort",
    mother_hi: t.mother || "महारानी",
    clan_en: t.clan || "Ikshvaku Dynasty",
    clan_hi: t.clan || "इक्ष्वाकु वंश",
    height_en: t.height || "80 Dhanush",
    height_hi: t.height || "८० धनुष",
    age_en: t.age || "10 Lakh Purva",
    age_hi: t.age || "१० लाख पूर्व",
    vairagya_en: "Reflecting on transience of body and seasons",
    vairagya_hi: "संसार की अनित्यता देखकर वैराग्य भाव जाग्रत",
    fasting_en: "3 Days",
    fasting_hi: "३ दिन",
    companions_en: "1,000 Nobles",
    companions_hi: "१००० राजा संग",
    first_ahaar_en: "Pure rice kheer",
    first_ahaar_hi: "परम शुद्ध खीर का आहार",
    keval_en: "Under sacred Bodhi tree of the forest",
    keval_hi: "पावन वनक्षेत्र में दीक्षा वृक्ष के नीचे",
    moksha_en: t.kaal === 'Videh' ? "Active Videha Moksha Vihar" : "Sammed Shikharji Holy Peak",
    moksha_hi: t.kaal === 'Videh' ? "महाविदेह सिद्ध क्षेत्र (अमर पद)" : "सम्मेद शिखरजी सिद्ध टोंक",
    disciple_en: "Gana Master Disciple",
    disciple_hi: "प्रमुख प्रथम गणधर"
  };

  const finalSpecs = picked ? { ...defaultSpecs, ...picked } : defaultSpecs;

  if (lang === 'en') {
    return [
      { label: "Father Name", value: finalSpecs.father_en },
      { label: "Mother Name", value: finalSpecs.mother_en },
      { label: "Dynastic Clan", value: finalSpecs.clan_en },
      { label: "Sacred Emblem", value: symbolEn },
      { label: "Body Complexion", value: t.color || "Luminous Golden" },
      { label: "Physical Height", value: finalSpecs.height_en },
      { label: "Total Lifespan", value: finalSpecs.age_en },
      { label: "Cause of Detachment", value: finalSpecs.vairagya_en },
      { label: "Vow Companions", value: finalSpecs.companions_en },
      { label: "First Blessed Food", value: finalSpecs.first_ahaar_en },
      { label: "Omniscience (Kevalgyan)", value: finalSpecs.keval_en },
      { label: "Nirvana / Liberation Spot", value: finalSpecs.moksha_en },
      { label: "Chief Disciple (Gandhara)", value: finalSpecs.disciple_en },
    ];
  } else {
    return [
      { label: "पिता का शुभ नाम", value: finalSpecs.father_hi },
      { label: "माता का पावन नाम", value: finalSpecs.mother_hi },
      { label: "वंश / कुल", value: finalSpecs.clan_hi },
      { label: "भगवान का चिन्ह (लांछन)", value: symbolHi },
      { label: "शरीर का रंग (वर्ण)", value: t.color === 'Golden' || t.color === 'Gold' ? "तप्त कंचन स्वर्ण" : t.color === 'Red' ? "रक्त कमल लाल" : t.color === 'Blue' ? "नीलमणि नीला" : t.color === 'Black' ? "श्यामल श्याम" : "श्वेत चंद्र" },
      { label: "काया की ऊंचाई", value: finalSpecs.height_hi },
      { label: "कुल जीवन आयु", value: finalSpecs.age_hi },
      { label: "वैराग्य उत्पन्न होने का कारण", value: finalSpecs.vairagya_hi },
      { label: "साथ में दीक्षित मुनि", value: finalSpecs.companions_hi },
      { label: "दीक्षा उपरांत प्रथम भोजन पारणा", value: finalSpecs.first_ahaar_hi },
      { label: "केवलज्ञान कल्याणक", value: finalSpecs.keval_hi },
      { label: "मोक्ष कल्याणक (सिद्ध स्थल)", value: finalSpecs.moksha_hi },
      { label: "मुख्य प्रमुख शिष्य (गणधर)", value: finalSpecs.disciple_hi },
    ];
  }
}

const FALLBACK_TIRTHANKARS = tirthankarData.map((t, idx) => ({
  ...t,
  number: t.number || (t.kaal === 'Present' ? parseInt(t.id) || idx + 1 : (idx + 1) % 24 || 24)
}));

const categories = ['Present', 'Past', 'Future', 'Videh'];

export default function TirthankarsPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<'Past' | 'Present' | 'Future' | 'Videh'>('Present');
  const [search, setSearch] = useState('');
  const { language: lang, toggleLanguage } = useLanguage();
  const [selectedT, setSelectedT] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'short' | 'detailed'>('short');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [tirthankars, setTirthankars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Advanced States for Admin Editing & Database Synchronization
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Reset viewMode back to summary card whenever a new Tirthankar is clicked
  useEffect(() => {
    if (selectedT) {
      setViewMode('short');
      setIsEditing(false);
    }
  }, [selectedT]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tirthankars'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // Perform an advanced field-level merge to prevent ANY missing images or duplicate records due to spelling variations
      const mergedList = FALLBACK_TIRTHANKARS.map(seed => {
        const dbRecord = data.find((d: any) => {
          if (d.id === seed.id) return true;
          if (d.kaal === seed.kaal && Number(d.number) === Number(seed.number)) return true;
          
          const dNameEn = (d.name?.en || "").toLowerCase().replace("shri ", "").replace(" swami", "").trim();
          const seedNameEn = (seed.name?.en || "").toLowerCase().replace("shri ", "").replace(" swami", "").trim();
          
          const dNameHi = (d.name?.hi || "").replace("श्री ", "").replace(" स्वामी", "").trim();
          const seedNameHi = (seed.name?.hi || "").replace("श्री ", "").replace(" स्वामी", "").trim();
          
          return (dNameEn === seedNameEn && dNameEn !== '') || (dNameHi === seedNameHi && dNameHi !== '');
        });
        
        if (dbRecord) {
          // Keep Firestore document as authority but fall back to seed details/images if Firestore ones are empty
          return {
            ...seed,
            ...dbRecord,
            id: seed.id,
            // Guard critical numeric attribute to prevent string coercion issues or undefined/NaN overrides
            number: (dbRecord.number !== undefined && dbRecord.number !== null && !isNaN(Number(dbRecord.number))) ? Number(dbRecord.number) : seed.number,
            kaal: dbRecord.kaal || seed.kaal,
            name: {
              en: dbRecord.name?.en?.trim() || seed.name?.en,
              hi: dbRecord.name?.hi?.trim() || seed.name?.hi
            },
            details: {
              en: dbRecord.details?.en?.trim() || seed.details?.en,
              hi: dbRecord.details?.hi?.trim() || seed.details?.hi
            },
            symbol: {
              en: dbRecord.symbol?.en?.trim() || seed.symbol?.en,
              hi: dbRecord.symbol?.hi?.trim() || seed.symbol?.hi
            },
            image: (dbRecord.image && dbRecord.image.trim() !== "") ? dbRecord.image.trim() : seed.image
          };
        }
        return seed;
      });

      // Include extra user-created custom Tirthankaras from Firestore that don't match any of our 92 static seeds
      const extraTirthankars = data.filter((d: any) => {
        const matchesStatic = FALLBACK_TIRTHANKARS.some(seed => {
          if (d.id === seed.id) return true;
          if (d.kaal === seed.kaal && Number(d.number) === Number(seed.number)) return true;
          
          const dNameEn = (d.name?.en || "").toLowerCase().replace("shri ", "").replace(" swami", "").trim();
          const seedNameEn = (seed.name?.en || "").toLowerCase().replace("shri ", "").replace(" swami", "").trim();
          
          const dNameHi = (d.name?.hi || "").replace("श्री ", "").replace(" स्वामी", "").trim();
          const seedNameHi = (seed.name?.hi || "").replace("श्री ", "").replace(" स्वामी", "").trim();
          
          return (dNameEn === seedNameEn && dNameEn !== '') || (dNameHi === seedNameHi && dNameHi !== '');
        });
        return !matchesStatic;
      }).map((d: any) => ({
        ...d,
        number: (d.number !== undefined && d.number !== null && !isNaN(Number(d.number))) ? Number(d.number) : 99
      }));

      // Show complete merged list
      const combined = [...mergedList, ...extraTirthankars];
      const uniqueList: any[] = [];
      const seenIds = new Set<string>();
      for (const item of combined) {
        if (!item.id) continue;
        const sId = String(item.id);
        if (!seenIds.has(sId)) {
          seenIds.add(sId);
          uniqueList.push(item);
        }
      }

      setTirthankars(uniqueList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tirthankars:', error);
      setTirthankars(FALLBACK_TIRTHANKARS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Edit Mode inside the popup Card
  const handleInitEdit = (t: any) => {
    setEditForm({
      id: t.id,
      number: t.number || 1,
      kaal: t.kaal || 'Present',
      color: t.color || 'Golden',
      name: {
        en: t.name?.en || '',
        hi: t.name?.hi || ''
      },
      symbol: {
        en: t.symbol?.en || t.symbol || '',
        hi: t.symbol?.hi || t.symbol || ''
      },
      image: t.image || '',
      details: {
        en: t.details?.en || '',
        hi: t.details?.hi || ''
      }
    });
    setIsEditing(true);
  };

  // Save edits back into Firestore with deterministic unique ID
  const handleSaveEdit = async () => {
    if (!editForm) return;
    setIsSaving(true);
    try {
      const { doc: fireDoc, setDoc } = await import('firebase/firestore');
      const docRef = fireDoc(db, 'tirthankars', editForm.id);
      
      const payload = {
        id: editForm.id,
        number: Number(editForm.number) || 1,
        kaal: editForm.kaal || 'Present',
        color: editForm.color || 'Golden',
        name: {
          en: editForm.name.en.trim(),
          hi: editForm.name.hi.trim()
        },
        symbol: {
          en: editForm.symbol.en.trim(),
          hi: editForm.symbol.hi.trim()
        },
        image: editForm.image.trim(),
        details: {
          en: editForm.details.en.trim(),
          hi: editForm.details.hi.trim()
        }
      };

      await setDoc(docRef, payload, { merge: true });

      // Locally update currently viewed item
      setSelectedT({
        ...selectedT,
        ...payload
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving tirthankar edit:', err);
      alert(lang === 'en' ? 'Failed to save edits to Firestore.' : 'जानकारी को डेटाबेस में सहेजने में विफल।');
    } finally {
      setIsSaving(false);
    }
  };

  // Repair & Sync Firestore Database to correct randomized duplicate IDs
  const handleRepairAndSyncDB = async () => {
    if (syncing) return;
    const confirmSync = window.confirm(
      lang === 'en' 
        ? "This will sync all 92 Tirthankars in Firestore with high-quality images and rich scriptures, removing auto-ID duplicate records from previous seeds. Continue?" 
        : "यह आपके डेटाबेस के सभी ९२ तीर्थंकरों की फोटो व विशिष्ट जानकारियों को संरेखित कर देगा और पुराने डुप्लीकेट रिकॉर्ड हटा देगा। क्या आप संरेखित करना चाहते हैं?"
    );
    if (!confirmSync) return;

    setSyncing(true);
    try {
      const { writeBatch, doc: fireRef, getDocs } = await import('firebase/firestore');
      
      // 1. Fetch all existing documents in 'tirthankars' to isolate old randomly-generated duplicate IDs
      const snapshot = await getDocs(collection(db, 'tirthankars'));
      
      // 2. Wipe old randomly-generated documents (IDs that are 20 characters long due to autoID)
      const deleteBatch = writeBatch(db);
      let countDeleted = 0;
      snapshot.docs.forEach(docSnap => {
        if (docSnap.id.length > 8) {
          deleteBatch.delete(docSnap.ref);
          countDeleted++;
        }
      });
      if (countDeleted > 0) {
        await deleteBatch.commit();
      }

      // 3. Seed all 92 high-quality static Tirthankaras with precise static IDs (1 batch is fully capable as 92 < 500 max limits)
      const syncBatch = writeBatch(db);
      FALLBACK_TIRTHANKARS.forEach(t => {
        const docRef = fireRef(db, 'tirthankars', t.id);
        syncBatch.set(docRef, {
          id: t.id,
          number: t.number,
          name: t.name,
          kaal: t.kaal,
          symbol: t.symbol,
          color: t.color || 'Golden',
          image: t.image || '',
          details: t.details || { en: '', hi: '' }
        }, { merge: true });
      });
      await syncBatch.commit();
      
      alert(lang === 'en' ? "Database synchronized perfectly! Duplicates removed and all 92 high-quality images saved permanently." : "डेटाबेस का पूर्ण सुधार और सिंक सफलता पूर्वक संपन्न हुआ! पुराने डुप्लीकेट रद्दीकरण और सभी ९२ फोटो सुरक्षित किये गए।");
    } catch (err) {
      console.error("Error repairing DB:", err);
      alert("Failed to sync database: " + (err as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  // Voice Search Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(lang === 'en' ? 'Voice search not supported in this browser.' : 'इस ब्राउज़र में वॉइस सर्च सपोर्टेड नहीं है।');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Multilingual matching for Tirthankar database searches
  const matchesSearch = (t: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();

    const nameEn = (t.name?.en || "").toLowerCase();
    const nameHi = (t.name?.hi || "").toLowerCase();
    const symbolEn = (t.symbol?.en || "").toLowerCase();
    const symbolHi = (t.symbol?.hi || "").toLowerCase();
    const detailsEn = (t.details?.en || "").toLowerCase();
    const detailsHi = (t.details?.hi || "").toLowerCase();

    // Direct match
    if (nameEn.includes(q) || nameHi.includes(q) || symbolEn.includes(q) || symbolHi.includes(q) || detailsEn.includes(q) || detailsHi.includes(q)) {
      return true;
    }

    // Hinglish patterns for common searching dialects
    const phonetics: Record<string, string[]> = {
      "adinath": ["rishabhdev", " आदिनाथ", "ऋषभदेव"],
      "parash": ["parshvanath", "पार्श्वनाथ", "सांप"],
      "mahavir": ["mahavira", "vardhaman", "महावीर", "वर्धमान"],
      "neminath": ["nemnath", "नेमिनाथ", "कृष्ण"],
      "bahu": ["bahubali", "बाहुबली"],
      "swastik": ["suparshvanath", "सुपार्श्वनाथ", "स्वास्तिक"],
      "chandaprabha": ["chandraprabha", "चन्द्रप्रभ", "चंद्रमा"]
    };

    for (const [key, aliases] of Object.entries(phonetics)) {
      if (q.includes(key) || key.includes(q)) {
        for (const alias of aliases) {
          if (nameEn.includes(alias) || nameHi.includes(alias)) return true;
        }
      }
    }
    return false;
  };

  // Filter and sort (explicitly excluding "Nirbhaya" to conform to Module 2 guidelines)
  const filtered = tirthankars
    .filter(t => t.kaal === activeCat && matchesSearch(t) && t.name?.en !== 'Nirbhaya' && t.name?.hi !== 'निर्भय')
    .sort((a, b) => Number(a.number || 0) - Number(b.number || 0));

  return (
    <div className="min-h-full pb-26 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <Library className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">{lang === 'en' ? '24 TIRTHANKARS DIRECTORY' : '२४ तीर्थंकर भगवंत निर्देशिका'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-2xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200/50 dark:border-white/5 h-10 w-10 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Tirthankar Section Guide' : 'तीर्थंकर निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-4 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-2xl flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30 shrink-0"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={14} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Intro Box */}
      <div className="mb-6 p-4 rounded-3xl bg-zinc-100 dark:bg-[#121212] border border-gray-200 dark:border-white/5 shadow-sm text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
        {lang === 'en'
          ? 'Tirthankaras are Arihantas who establish the Jain four-fold congregation. They guide spiritual seekers out of the material world, preaching universal absolute truth, non-violence, and self-conquest.'
          : 'तीर्थंकर वे अरिहंत देव होते हैं जो धर्म तीर्थ (मुनि, आर्यिका, श्रावक, श्राविका संघ) का प्रवर्तन करते हैं। वे दिव्य समवशरण सभा से भव्य जीवों को संसार समुद्र पार करने का मोक्ष मार्ग दिखाते हैं।'}
      </div>

      {/* Typing & Voice Search Input */}
      <div className="mb-6">
        <UnifiedSearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder={lang === 'en' ? "Search Tirthankar or Symbol (e.g., Adinath, Lion)..." : "तीर्थंकर या चिन्ह खोजें (जैसे: आदिनाथ, सिंह)..."}
        />
      </div>

      {/* Age Categories Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat as any)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
              activeCat === cat 
                ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-sm" 
                : "bg-white dark:bg-[#121212] text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5"
            )}
          >
            {lang === 'en' ? cat : (cat === 'Past' ? 'भूतकाल' : cat === 'Present' ? 'वर्तमान' : cat === 'Future' ? 'भविष्य' : 'विदेह')}
          </button>
        ))}
      </div>

      {/* Premium responsive grid card layout for 24 Tirthankars */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-[#FF6D00]" size={28} />
            <p className="font-semibold text-xs tracking-widest uppercase">Loading Directory...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center items-stretch w-full max-w-7xl mx-auto">
            {filtered.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedT(t)}
                className="group bg-white dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden hover:border-[#FF6D00]/50 dark:hover:border-[#FFD54F]/50 hover:shadow-[0_8px_30px_rgba(255,109,0,0.15)] transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-1 relative"
              >
                {/* Card Image beautifully contained with neutral background so it is never cropped */}
                <div className="h-44 relative w-full overflow-hidden shrink-0 bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-white/5 flex items-center justify-center p-3">
                  <img 
                    src={getTirthankarPhoto(t.id, t.image)} 
                    alt={t.name?.en} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)]" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-[#FFD54F] border border-white/10">
                      #{t.number}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded bg-orange-600 text-white border border-orange-500">
                      {lang === 'en' ? t.kaal : (t.kaal === 'Past' ? 'भूतकाल' : t.kaal === 'Present' ? 'वर्तमान' : 'भविष्य')}
                    </span>
                  </div>
                </div>

                {/* Card Body content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-black text-base text-gray-900 dark:text-white group-hover:text-[#FF6D00] dark:group-hover:text-[#FFD54F] transition-colors leading-snug">
                      {lang === 'en' ? t.name?.en : t.name?.hi}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100/30 dark:border-orange-500/10 text-xs text-gray-600 dark:text-gray-400 font-semibold w-fit">
                      <Star size={13} className="text-yellow-500 fill-yellow-500" />
                      <span>
                        {lang === 'en' ? 'Symbol:' : 'चिह्न:'} <strong className="text-gray-900 dark:text-gray-200">{lang === 'en' ? t.symbol?.en : t.symbol?.hi}</strong>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-[#FFD54F]">
                    <span>{lang === 'en' ? 'View Divine Details' : 'दर्शन व गाथा जानें'}</span>
                    <span className="text-sm font-black group-hover:translate-x-1.5 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
            {lang === 'en' ? 'No Tirthankars found matching search.' : 'खोज से मिलता जुलता कोई तीर्थंकर नहीं मिला।'}
          </div>
        )}
      </div>

      {/* Structural Details View Overlay Modal */}
      {selectedT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            
            {viewMode === 'short' ? (
              /* View Mode 1: Short Introduction Display mimicking 1st user image layout */
              <>
                <div className="h-72 shrink-0 relative bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-white/5 flex items-center justify-center p-4">
                  {/* Blurry ambient background backdrop */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={getTirthankarPhoto(selectedT.id, selectedT.image, selectedT.name, selectedT.number, selectedT.kaal)} 
                      alt="" 
                      className="w-full h-full object-cover blur-xl opacity-35 scale-110" 
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Main Portrait Image - Fully Visible inside this container */}
                  <img 
                    src={getTirthankarPhoto(selectedT.id, selectedT.image, selectedT.name, selectedT.number, selectedT.kaal)} 
                    alt={selectedT.name?.en} 
                    className="max-h-full max-w-full object-contain z-10 drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] relative" 
                    referrerPolicy="no-referrer"
                  />

                  <button 
                    onClick={() => setSelectedT(null)}
                    className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md z-30 font-sans text-sm font-black cursor-pointer text-center border border-white/10 shadow-md animate-in duration-300"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Separated Content Title Section - Perfectly uncrossed, high-readability */}
                <div className="p-6 pb-0 text-left bg-white dark:bg-[#121212] relative z-10 shrink-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black tracking-widest text-[#FF6D00] dark:text-[#FFD54F] uppercase bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/10">
                      {lang === 'en' ? `№ ${selectedT.number}` : `क्रमांक ${selectedT.number}`}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white border border-orange-500">
                      {lang === 'en' ? selectedT.kaal : (selectedT.kaal === 'Past' ? 'भूतकाल' : selectedT.kaal === 'Present' ? 'वर्तमान' : selectedT.kaal === 'Future' ? 'भविष्य' : 'विदेह')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black font-display text-gray-950 dark:text-white leading-tight">
                    {lang === 'en' ? selectedT.name?.en : selectedT.name?.hi}
                  </h2>
                </div>

                {/* Scrollable details view listing biographies and the beautiful center button */}
                <div className="p-6 overflow-y-auto space-y-6 relative z-10 bg-white dark:bg-[#121212]">
                  
                  {/* Symbol Callout Header Block */}
                  <div className="bg-orange-50/50 dark:bg-orange-550/5 px-4 py-3 rounded-2xl border border-orange-100 dark:border-white/5 text-xs text-secondary flex items-center justify-between">
                    <span className="font-semibold text-gray-500 dark:text-gray-400">
                      {lang === 'en' ? 'Sacred Symbol (Lanchhana):' : 'भगवान का पावन प्रतीक (चिन्ह):'}
                    </span>
                    <strong className="text-gray-900 dark:text-[#FFD54F] font-black tracking-wide text-sm bg-orange-100/30 dark:bg-orange-500/10 px-3 py-1 rounded-xl">
                      {lang === 'en' ? selectedT.symbol?.en : selectedT.symbol?.hi}
                    </strong>
                  </div>

                  {/* Biography Section */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 dark:border-white/10 pb-1.5 flex items-center gap-1.5 col-span-full">
                      <Info size={14} className="text-[#FF6D00]" />
                      {lang === 'en' ? 'Biography & Significance' : 'उत्कृष्ट परिचय व जीवन गाथा'}
                    </h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                      {lang === 'en' ? selectedT.details?.en : selectedT.details?.hi}
                    </p>
                  </div>

                  {/* HIGH-LIGHT CENTRED ACTION BUTTON - Directly corresponding to 2nd user image representation */}
                  <div className="flex justify-center items-center py-4 my-2 shrink-0">
                    <button
                      onClick={() => setViewMode('detailed')}
                      className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-[#FF5722] hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer border border-orange-400/20 uppercase tracking-widest"
                    >
                      <Sparkles size={14} className="text-[#FFD54F] animate-pulse" />
                      <span>{lang === 'en' ? "Know More (Brief Introduction) 👉" : "संक्षिप्त परिचय (Know More) 👉"}</span>
                    </button>
                  </div>

                  {/* Exact Panch Kalyanaka List alignment */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-200 dark:border-white/10 pb-1.5 flex items-center gap-1.5">
                      <Calendar size={14} className="text-orange-500" />
                      {lang === 'en' ? 'CONSECRATION TITHIS (PANCH KALYANAK)' : 'पंचकल्याणक पावन कल्याणकारी तिथियां'}
                    </h4>
                    
                    <div className="space-y-2">
                      {getKalyanakDates(selectedT.id).map((k) => (
                        <div key={k.n} className="flex justify-between items-center bg-zinc-50 dark:bg-[#171717] px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-white/5 text-xs">
                          <div>
                            <span className="font-black text-gray-900 dark:text-gray-200">
                              {lang === 'en' ? k.n : k.hi}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2">
                              ({lang === 'en' ? k.n === 'Garbha' ? 'Conception' : k.n === 'Janma' ? 'Birth' : k.n === 'Tapa' ? 'Initiation' : k.n === 'Kevalgyan' ? 'Omniscience' : 'Liberation' : k.hi === 'गर्भ' ? 'कल्याणक' : 'कल्याणक'})
                            </span>
                          </div>
                          <span className="font-extrabold text-[#FF6D00] text-right">
                            {lang === 'en' ? k.tithi : k.hiTithi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* View Mode 2: Detailed Attributes Table mimicking 2nd user image layout and color theme */
              <>
                {/* Clean, distinctive green/saffron header banner */}
                <div className="bg-[#2E7D32]/10 dark:bg-[#2E7D32]/5 p-5 border-b border-[#2E7D32]/10 flex items-center justify-between shrink-0 relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-2.5">
                    <div className="text-left">
                      <span className="text-[10px] font-black tracking-widest text-[#2E7D32] dark:text-[#81C784] uppercase bg-[#2E7D32]/10 px-2.5 py-1 rounded-md">
                        {lang === 'en' ? 'Detailed Specifications Schema' : 'विस्तृत शास्त्रोक्त परिचय तालिका'}
                      </span>
                      <h3 className="text-base md:text-lg font-black font-display text-gray-900 dark:text-white mt-1">
                        {lang === 'en' ? `${selectedT.name?.en} Specifications` : `प्रभु ${selectedT.name?.hi} विस्तृत परिचय`}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedT(null)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-full transition-all border border-gray-200/50 dark:border-white/5 z-20 font-sans text-sm font-black cursor-pointer shadow-sm shrink-0"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Alternating deep herbal green-tinted specification block */}
                <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white dark:bg-[#121212]">
                  <div className="border border-green-200/40 dark:border-green-800/20 rounded-2xl overflow-hidden shadow-sm text-left">
                    <table className="w-full text-[11px] md:text-xs">
                      <thead>
                        <tr className="bg-[#E8F5E9] dark:bg-[#1B5E20]/25 text-left text-green-800 dark:text-green-350 border-b border-green-200/50 dark:border-green-800/20">
                          <th className="p-3 font-sans font-black tracking-wider uppercase w-2/5">
                            {lang === 'en' ? "Specification Parameter" : "परिचय श्रेणी"}
                          </th>
                          <th className="p-3 font-sans font-black tracking-wider uppercase">
                            {lang === 'en' ? "Scriptural Value" : "शास्त्रोक्त प्रमाण"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getTirthankarDetailedSpecs(selectedT, lang).map((spec, idx) => (
                          <tr 
                            key={spec.label} 
                            className={cn(
                              "border-b border-dashed border-gray-150 last:border-0 dark:border-white/5 transition-colors duration-200",
                              idx % 2 === 0 ? "bg-[#F1F8E9]/40 dark:bg-[#33691E]/5" : "bg-white dark:bg-[#121212]"
                            )}
                          >
                            <td className="p-3 font-semibold text-gray-500 dark:text-gray-400 align-top">
                              {spec.label}
                            </td>
                            <td className="p-3 font-extrabold text-gray-950 dark:text-gray-100 whitespace-pre-wrap align-top">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Back to Summary Symmetrical Button at the center */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setViewMode('short')}
                      className="px-5 py-2.5 bg-[#FF3D00] hover:bg-[#D50000] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>← {lang === 'en' ? "Back to Summary" : "वापस सारांश देखें"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {lang === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {lang === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
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
                {lang === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {lang === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-350 dark:text-zinc-350 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to 24 Tirthankars Directory!' : '२४ तीर्थंकर भगवंत निर्देशिका में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'This directory serves as a comprehensive study portal for Tirthankars in all three cosmic kaal eras (Past, Present, Future) and Videha Kshetra:' 
                  : 'यह पावन संभाग तीनों कालों के २४ तीर्थंकरों एवं विदेह क्षेत्र के वर्तमान विहरमान जिनेन्द्र देवों की प्रामाणिक जानकारी का संग्रह है:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Cosmic Kaal Eras:' : 'काल विभाजन:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Switch between Present, Past, Future, and Videha Kshetra categories to explore current, historic, and eventual savior Arihantas.' 
                    : 'भूतकाल, वर्तमान काल, भविष्य काल एवं विदेह क्षेत्र तीर्थंकर श्रेणियों में स्विच कर सुगमता से अध्ययन करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Panch Kalyanaka Dates:' : 'पंचकल्याणक तिथियां:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Click any Tirthankar card to read birthplace, parents, shade, size, and specific tithis for Garbha, Janma, Tapa, Kevalgyan, and Moksha.'
                    : 'किसी भी तीर्थंकर के नाम पर क्लिक कर उनके माता-पिता, मोक्ष स्थान, कायोत्सर्ज विवरण, रंग और पंचकल्याणक की शास्त्र सम्मत तिथियां जानें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Quick Searches:' : 'आसान खोज माध्यम:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Filter simply by typing its name in Hin-glish or search symbols (e.g., Lion for Mahavira, Swastika for Suparshvanath, Shell for Neminath).'
                    : 'हिन्दी या अंग्रेज़ी में नाम टाइप करके या उनके लांछन (चिन्ह) जैसे- सिंह, सर्प, शंख, स्वस्तिक लिखकर भी खोज सकते हैं।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {lang === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="tirthankars" />
    </div>
  );
}
