import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const pastTirthankars = [
  { name: { en: "Nirvani", hi: "निर्वाणी" }, number: 1, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "First Tirthankara of Past Kaal.", hi: "अतीत काल के प्रथम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sagara", hi: "सागर" }, number: 2, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Second Tirthankara of Past Kaal.", hi: "अतीत काल के द्वितीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Mahabhadra", hi: "महाभद्र" }, number: 3, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Third Tirthankara of Past Kaal.", hi: "अतीत काल के तृतीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vimalanatha", hi: "विमलनाथ" }, number: 4, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Fourth Tirthankara of Past Kaal.", hi: "अतीत काल के चतुर्थ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sridhara", hi: "श्रीधर" }, number: 5, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Fifth Tirthankara of Past Kaal.", hi: "अतीत काल के पंचम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sridatta", hi: "श्रीदत्त" }, number: 6, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Sixth Tirthankara of Past Kaal.", hi: "अतीत काल के षष्ठ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Amanadhara", hi: "अमनधर" }, number: 7, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Seventh Tirthankara of Past Kaal.", hi: "अतीत काल के सप्तम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Uddhara", hi: "उद्धार" }, number: 8, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Eighth Tirthankara of Past Kaal.", hi: "अतीत काल के अष्टम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Devaraja", hi: "देवराज" }, number: 9, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Ninth Tirthankara of Past Kaal.", hi: "अतीत काल के नवम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Munisuvrata", hi: "मुनिसुव्रत" }, number: 10, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Tenth Tirthankara of Past Kaal.", hi: "अतीत काल के दशम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Amama", hi: "अमम" }, number: 11, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Eleventh Tirthankara of Past Kaal.", hi: "अतीत काल के ग्यारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkashaya", hi: "निष्कशाय" }, number: 12, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twelfth Tirthankara of Past Kaal.", hi: "अतीत काल के बारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishpulaka", hi: "निष्पुलक" }, number: 13, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Thirteenth Tirthankara of Past Kaal.", hi: "अतीत काल के तेरहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkampa", hi: "निष्कम्प" }, number: 14, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Fourteenth Tirthankara of Past Kaal.", hi: "अतीत काल के चौदहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkriya", hi: "निष्क्रिय" }, number: 15, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Fifteenth Tirthankara of Past Kaal.", hi: "अतीत काल के पंद्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nirmama", hi: "निर्मम" }, number: 16, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Sixteenth Tirthankara of Past Kaal.", hi: "अतीत काल के सोलहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkrodha", hi: "निष्क्रोध" }, number: 17, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Seventeenth Tirthankara of Past Kaal.", hi: "अतीत काल के सत्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishlobha", hi: "निर्लोभ" }, number: 18, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Eighteenth Tirthankara of Past Kaal.", hi: "अतीत काल के अठारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nirmoha", hi: "निर्मोह" }, number: 19, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Nineteenth Tirthankara of Past Kaal.", hi: "अतीत काल के उन्नीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkama", hi: "निष्काम" }, number: 20, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twentieth Tirthankara of Past Kaal.", hi: "अतीत काल के बीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishklesha", hi: "निष्क्लेश" }, number: 21, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twenty-first Tirthankara of Past Kaal.", hi: "अतीत काल के इक्कीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkrodha", hi: "निष्क्रोध" }, number: 22, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twenty-second Tirthankara of Past Kaal.", hi: "अतीत काल के बाईसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nirbhaya", hi: "निर्भय" }, number: 23, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twenty-third Tirthankara of Past Kaal.", hi: "अतीत काल के तेईसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nirvikalpa", hi: "निर्विकल्प" }, number: 24, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Twenty-fourth Tirthankara of Past Kaal.", hi: "अतीत काल के चौबीसवें तीर्थंकर।" }, kalyanaks: [] },
];

const futureTirthankars = [
  { name: { en: "Mahapadma", hi: "महापद्म" }, number: 1, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "First Tirthankara of Future Kaal.", hi: "भविष्य काल के प्रथम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Suradeva", hi: "सुरदेव" }, number: 2, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Second Tirthankara of Future Kaal.", hi: "भविष्य काल के द्वितीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Suparshva", hi: "सुपार्श्व" }, number: 3, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Third Tirthankara of Future Kaal.", hi: "भविष्य काल के तृतीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Svayamprabha", hi: "स्वयंप्रभ" }, number: 4, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Fourth Tirthankara of Future Kaal.", hi: "भविष्य काल के चतुर्थ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sarvanubhuti", hi: "सर्वानुभूति" }, number: 5, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Fifth Tirthankara of Future Kaal.", hi: "भविष्य काल के पंचम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Deveshruti", hi: "देवश्रुति" }, number: 6, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Sixth Tirthankara of Future Kaal.", hi: "भविष्य काल के षष्ठ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Udayanatha", hi: "उदयनाथ" }, number: 7, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Seventh Tirthankara of Future Kaal.", hi: "भविष्य काल के सप्तम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Pedhala", hi: "पेढाल" }, number: 8, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Eighth Tirthankara of Future Kaal.", hi: "भविष्य काल के अष्टम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Potila", hi: "पोटिल" }, number: 9, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Ninth Tirthankara of Future Kaal.", hi: "भविष्य काल के नवम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Shatakirti", hi: "शतकीर्ति" }, number: 10, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Tenth Tirthankara of Future Kaal.", hi: "भविष्य काल के दशम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Munisuvrata", hi: "मुनिसुव्रत" }, number: 11, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Eleventh Tirthankara of Future Kaal.", hi: "भविष्य काल के ग्यारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Amama", hi: "अमम" }, number: 12, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twelfth Tirthankara of Future Kaal.", hi: "भविष्य काल के बारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishkashaya", hi: "निष्कशाय" }, number: 13, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Thirteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के तेरहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nishpulaka", hi: "निष्पुलक" }, number: 14, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Fourteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के चौदहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nirmama", hi: "निर्मम" }, number: 15, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Fifteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के पंद्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Chitragupta", hi: "चित्रगुप्त" }, number: 16, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Sixteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के सोलहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Samadhinatha", hi: "समाधिनाथ" }, number: 17, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Seventeenth Tirthankara of Future Kaal.", hi: "भविष्य काल के सत्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Swayambhunatha", hi: "स्वयंभूनाथ" }, number: 18, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Eighteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के अठारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Anantanatha", hi: "अनंतनाथ" }, number: 19, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Nineteenth Tirthankara of Future Kaal.", hi: "भविष्य काल के उन्नीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vijayanatha", hi: "विजयनाथ" }, number: 20, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twentieth Tirthankara of Future Kaal.", hi: "भविष्य काल के बीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vimalanatha", hi: "विमलनाथ" }, number: 21, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twenty-first Tirthankara of Future Kaal.", hi: "भविष्य काल के इक्कीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sarvajnanatha", hi: "सर्वज्ञनाथ" }, number: 22, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twenty-second Tirthankara of Future Kaal.", hi: "भविष्य काल के बाईसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vishalanatha", hi: "विशालनाथ" }, number: 23, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twenty-third Tirthankara of Future Kaal.", hi: "भविष्य काल के तेईसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Bhadranatha", hi: "भद्रनाथ" }, number: 24, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Twenty-fourth Tirthankara of Future Kaal.", hi: "भविष्य काल के चौबीसवें तीर्थंकर।" }, kalyanaks: [] },
];

const videhTirthankars = [
  { name: { en: "Simandhar Swami", hi: "सीमंधर स्वामी" }, number: 1, symbol: { en: "Bull", hi: "बैल" }, color: "Golden", kaal: "Videh", details: { en: "First Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के प्रथम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Yugmandhar Swami", hi: "युगमंधर स्वामी" }, number: 2, symbol: { en: "Elephant", hi: "हाथी" }, color: "Golden", kaal: "Videh", details: { en: "Second Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के द्वितीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Bahu Swami", hi: "बाहु स्वामी" }, number: 3, symbol: { en: "Horse", hi: "घोड़ा" }, color: "Golden", kaal: "Videh", details: { en: "Third Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के तृतीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Subahu Swami", hi: "सुबाहु स्वामी" }, number: 4, symbol: { en: "Monkey", hi: "बंदर" }, color: "Golden", kaal: "Videh", details: { en: "Fourth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के चतुर्थ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sujat Swami", hi: "सुजात स्वामी" }, number: 5, symbol: { en: "Curlew", hi: "क्रौंच" }, color: "Golden", kaal: "Videh", details: { en: "Fifth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के पंचम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Swayamprabh Swami", hi: "स्वयंप्रभ स्वामी" }, number: 6, symbol: { en: "Lotus", hi: "कमल" }, color: "Golden", kaal: "Videh", details: { en: "Sixth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के षष्ठ तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Rishabhanan Swami", hi: "ऋषभानन स्वामी" }, number: 7, symbol: { en: "Swastika", hi: "स्वास्तिक" }, color: "Golden", kaal: "Videh", details: { en: "Seventh Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के सप्तम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Anantvirya Swami", hi: "अनंतवीर्य स्वामी" }, number: 8, symbol: { en: "Moon", hi: "चंद्रमा" }, color: "Golden", kaal: "Videh", details: { en: "Eighth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के अष्टम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Surprabh Swami", hi: "सूरप्रभ स्वामी" }, number: 9, symbol: { en: "Crocodile", hi: "मगरमच्छ" }, color: "Golden", kaal: "Videh", details: { en: "Ninth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के नवम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vishal Swami", hi: "विशाल स्वामी" }, number: 10, symbol: { en: "Srivatsa", hi: "श्रीवत्स" }, color: "Golden", kaal: "Videh", details: { en: "Tenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के दशम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Vajradhar Swami", hi: "वज्रधर स्वामी" }, number: 11, symbol: { en: "Rhinoceros", hi: "गैंडा" }, color: "Golden", kaal: "Videh", details: { en: "Eleventh Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के ग्यारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Chandranan Swami", hi: "चंद्रानन स्वामी" }, number: 12, symbol: { en: "Buffalo", hi: "भैंसा" }, color: "Golden", kaal: "Videh", details: { en: "Twelfth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के बारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Chandrabahu Swami", hi: "चंद्रबाहु स्वामी" }, number: 13, symbol: { en: "Boar", hi: "सूअर" }, color: "Golden", kaal: "Videh", details: { en: "Thirteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के तेरहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Bhujangam Swami", hi: "भुजंगम स्वामी" }, number: 14, symbol: { en: "Bear", hi: "भालू" }, color: "Golden", kaal: "Videh", details: { en: "Fourteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के चौदहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Ishwar Swami", hi: "ईश्वर स्वामी" }, number: 15, symbol: { en: "Porcupine", hi: "साही" }, color: "Golden", kaal: "Videh", details: { en: "Fifteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के पंद्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Nemiprabh Swami", hi: "नेमिप्रभ स्वामी" }, number: 16, symbol: { en: "Vajra", hi: "वज्र" }, color: "Golden", kaal: "Videh", details: { en: "Sixteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के सोलहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Veersen Swami", hi: "वीरसेन स्वामी" }, number: 17, symbol: { en: "Deer", hi: "हिरण" }, color: "Golden", kaal: "Videh", details: { en: "Seventeenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के सत्रहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Mahabhadra Swami", hi: "महाभद्र स्वामी" }, number: 18, symbol: { en: "Goat", hi: "बकरा" }, color: "Golden", kaal: "Videh", details: { en: "Eighteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के अठारहवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Devyash Swami", hi: "देवयश स्वामी" }, number: 19, symbol: { en: "Nandyavarta", hi: "नंद्यावर्त" }, color: "Golden", kaal: "Videh", details: { en: "Nineteenth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के उन्नीसवें तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Ajitvirya Swami", hi: "अजितवीर्य स्वामी" }, number: 20, symbol: { en: "Pitcher", hi: "कलश" }, color: "Golden", kaal: "Videh", details: { en: "Twentieth Tirthankara of Videh Kshetra.", hi: "विदेह क्षेत्र के बीसवें तीर्थंकर।" }, kalyanaks: [] },
];

async function seedTirthankars() {
  const batch = writeBatch(db);
  const tirthankarsCollection = collection(db, 'tirthankars');

  for (const t of pastTirthankars) {
    const docRef = doc(tirthankarsCollection);
    batch.set(docRef, t);
  }

  for (const t of futureTirthankars) {
    const docRef = doc(tirthankarsCollection);
    batch.set(docRef, t);
  }

  for (const t of videhTirthankars) {
    const docRef = doc(tirthankarsCollection);
    batch.set(docRef, t);
  }

  await batch.commit();
  console.log('Successfully seeded Tirthankars!');
}

seedTirthankars().catch(console.error);
