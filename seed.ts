import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const knowledgeData = [
  {
    question: { en: "Why do Jains not eat root vegetables?", hi: "जैन कंदमूल क्यों नहीं खाते हैं?" },
    jainReason: { en: "Root vegetables contain countless microorganisms (nigoda). Uprooting them causes immense violence.", hi: "कंदमूल में अनगिनत सूक्ष्म जीव (निगोद) होते हैं। उन्हें उखाड़ने से भारी हिंसा होती है।" },
    scienceReason: { en: "Root vegetables are often the storage organs of plants and pulling them destroys the entire plant.", hi: "कंदमूल अक्सर पौधों के भंडारण अंग होते हैं और उन्हें खींचने से पूरा पौधा नष्ट हो जाता है।" },
    category: "Diet"
  },
  {
    question: { en: "Why do Jains drink filtered water?", hi: "जैन छना हुआ पानी क्यों पीते हैं?" },
    jainReason: { en: "To avoid consuming and killing microscopic living beings present in unfiltered water.", hi: "बिना छने पानी में मौजूद सूक्ष्म जीवों के सेवन और हत्या से बचने के लिए।" },
    scienceReason: { en: "Filtering water removes impurities and larger microorganisms, making it safer to drink.", hi: "पानी को छानने से अशुद्धियां और बड़े सूक्ष्म जीव दूर हो जाते हैं, जिससे यह पीने के लिए सुरक्षित हो जाता है।" },
    category: "Daily Life"
  }
];

const tirthankarsData = [
  {
    name: { en: "Rishabhanatha (Adinatha)", hi: "ऋषभनाथ (आदिनाथ)" },
    number: 1,
    symbol: { en: "Bull", hi: "बैल" },
    color: "Golden",
    kaal: "Present",
    details: { en: "The first Tirthankara of the present age.", hi: "वर्तमान युग के प्रथम तीर्थंकर।" },
    kalyanaks: []
  },
  {
    name: { en: "Parshvanatha", hi: "पार्श्वनाथ" },
    number: 23,
    symbol: { en: "Snake", hi: "सांप" },
    color: "Blue",
    kaal: "Present",
    details: { en: "The 23rd Tirthankara.", hi: "23वें तीर्थंकर।" },
    kalyanaks: []
  },
  {
    name: { en: "Mahavira", hi: "महावीर" },
    number: 24,
    symbol: { en: "Lion", hi: "शेर" },
    color: "Golden",
    kaal: "Present",
    details: { en: "The 24th and last Tirthankara of the present age.", hi: "वर्तमान युग के 24वें और अंतिम तीर्थंकर।" },
    kalyanaks: []
  },
  {
    name: { en: "Padmanabha", hi: "पद्मनाभ" },
    number: 1,
    symbol: { en: "Lotus", hi: "कमल" },
    color: "Golden",
    kaal: "Future",
    details: { en: "The first Tirthankara of the future age.", hi: "भविष्य के युग के प्रथम तीर्थंकर।" },
    kalyanaks: []
  },
  {
    name: { en: "Nirvani", hi: "निर्वाणी" },
    number: 1,
    symbol: { en: "Unknown", hi: "अज्ञात" },
    color: "Golden",
    kaal: "Past",
    details: { en: "A Tirthankara of the past age.", hi: "अतीत के युग के एक तीर्थंकर।" },
    kalyanaks: []
  }
];

const aagamsData = [
  {
    title: "Namokar Mantra",
    category: "Stuti",
    content: "णमो अरिहंताणं\nणमो सिद्धाणं\nणमो आइरियाणं\nणमो उवज्झायाणं\nणमो लोए सव्वसाहूणं\nएसो पंचणमुक्कारो\nसव्वपावप्पणासणो\nमंगलाणं च सव्वेसिं\nपढमं हवई मंगलं"
  },
  {
    title: "Bhaktamar Stotra",
    category: "Stuti",
    content: "भक्तामर प्रणत मौलि मणिप्रभाणां..."
  },
  {
    title: "Mahavir Chalisa",
    category: "Chalisa",
    content: "जय महावीर प्रभु..."
  }
];

async function seed() {
  try {
    // Clear existing data
    const cols = ['knowledge', 'tirthankars', 'aagams'];
    for (const col of cols) {
      const snap = await getDocs(collection(db, col));
      for (const d of snap.docs) {
        await deleteDoc(doc(db, col, d.id));
      }
    }

    const knowledgeSnap = await getDocs(collection(db, 'knowledge'));
    if (knowledgeSnap.empty) {
      for (const item of knowledgeData) await addDoc(collection(db, 'knowledge'), item);
      console.log('Seeded knowledge');
    }

    const tirthankarsSnap = await getDocs(collection(db, 'tirthankars'));
    if (tirthankarsSnap.empty) {
      for (const item of tirthankarsData) await addDoc(collection(db, 'tirthankars'), item);
      console.log('Seeded tirthankars');
    }

    const aagamsSnap = await getDocs(collection(db, 'aagams'));
    if (aagamsSnap.empty) {
      for (const item of aagamsData) await addDoc(collection(db, 'aagams'), item);
      console.log('Seeded aagams');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
