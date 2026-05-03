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
  },
  {
    question: { en: "Why do Jains not eat after sunset?", hi: "जैन सूर्यास्त के बाद क्यों नहीं खाते हैं?" },
    jainReason: { en: "After sunset, microscopic organisms increase in the atmosphere and can fall into food, causing violence if consumed.", hi: "सूर्यास्त के बाद, वातावरण में सूक्ष्म जीव बढ़ जाते हैं और भोजन में गिर सकते हैं, जिससे सेवन करने पर हिंसा होती है।" },
    scienceReason: { en: "Eating late at night can disrupt digestion and the body's natural circadian rhythm.", hi: "देर रात खाने से पाचन और शरीर की प्राकृतिक सर्कैडियन लय बाधित हो सकती है।" },
    category: "Diet"
  },
  {
    question: { en: "What is the significance of Ahimsa in Jainism?", hi: "जैन धर्म में अहिंसा का क्या महत्व है?" },
    jainReason: { en: "Ahimsa (non-violence) is the supreme principle (Ahimsa Paramo Dharma). It means not causing harm to any living being in thought, word, or deed.", hi: "अहिंसा सर्वोच्च सिद्धांत है (अहिंसा परमो धर्म)। इसका अर्थ है मन, वचन या कर्म से किसी भी जीवित प्राणी को नुकसान न पहुंचाना।" },
    scienceReason: { en: "Practicing non-violence promotes a peaceful coexistence and ecological balance.", hi: "अहिंसा का अभ्यास शांतिपूर्ण सह-अस्तित्व और पारिस्थितिक संतुलन को बढ़ावा देता है।" },
    category: "Philosophy"
  },
  {
    question: { en: "Why do Jain monks sweep the floor before walking?", hi: "जैन मुनि चलने से पहले फर्श क्यों बुहारते हैं?" },
    jainReason: { en: "To gently move away any small insects or living beings on the path to avoid stepping on them.", hi: "रास्ते में किसी भी छोटे कीड़े या जीवित प्राणियों को धीरे से हटाने के लिए ताकि उन पर पैर न पड़े।" },
    scienceReason: { en: "It reflects extreme mindfulness and care for all forms of life.", hi: "यह जीवन के सभी रूपों के लिए अत्यधिक दिमागीपन और देखभाल को दर्शाता है।" },
    category: "Daily Life"
  }
];

const historyData = [
  {
    period: "6th Century BCE",
    title: { en: "Life of Lord Mahavira", hi: "भगवान महावीर का जीवन" },
    desc: { en: "Lord Mahavira, the 24th Tirthankara, revived and reorganized the Jain religion.", hi: "24वें तीर्थंकर भगवान महावीर ने जैन धर्म को पुनर्जीवित और पुनर्गठित किया।" },
    color: "bg-amber-500",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mahavira_at_the_Met.jpg/800px-Mahavira_at_the_Met.jpg"
  },
  {
    period: "3rd Century BCE",
    title: { en: "Chandragupta Maurya", hi: "चंद्रगुप्त मौर्य" },
    desc: { en: "Emperor Chandragupta Maurya embraced Jainism and migrated to Shravanabelagola with Acharya Bhadrabahu.", hi: "सम्राट चंद्रगुप्त मौर्य ने जैन धर्म अपनाया और आचार्य भद्रबाहु के साथ श्रवणबेलगोला चले गए।" },
    color: "bg-orange-500",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Chandragupta_Maurya_at_Shravanabelagola.jpg/800px-Chandragupta_Maurya_at_Shravanabelagola.jpg"
  },
  {
    period: "1st Century CE",
    title: { en: "Schism: Digambara and Svetambara", hi: "विभाजन: दिगंबर और श्वेतांबर" },
    desc: { en: "The Jain community formally divided into two main sects: Digambara and Svetambara.", hi: "जैन समुदाय औपचारिक रूप से दो मुख्य संप्रदायों में विभाजित हो गया: दिगंबर और श्वेतांबर।" },
    color: "bg-yellow-500",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jain_monks_in_India.jpg/800px-Jain_monks_in_India.jpg"
  }
];

const festivalsData = [
  {
    name: { en: "Mahavir Jayanti", hi: "महावीर जयंती" },
    date: "30 March 2026",
    daysLeft: 368,
    desc: { en: "Celebrates the birth of Lord Mahavira, the 24th Tirthankara.", hi: "24वें तीर्थंकर भगवान महावीर के जन्म का जश्न मनाता है।" },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mahavira_at_the_Met.jpg/800px-Mahavira_at_the_Met.jpg",
    color: "from-orange-400 to-amber-500"
  },
  {
    name: { en: "Paryushan Parva", hi: "पर्युषण पर्व" },
    date: "September 2026",
    daysLeft: 520,
    desc: { en: "The most important annual holy event for Jains, focused on fasting, prayer, and meditation.", hi: "जैनियों के लिए सबसे महत्वपूर्ण वार्षिक पवित्र कार्यक्रम, उपवास, प्रार्थना और ध्यान पर केंद्रित है।" },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jain_monks_in_India.jpg/800px-Jain_monks_in_India.jpg",
    color: "from-yellow-400 to-orange-500"
  },
  {
    name: { en: "Diwali (Nirvana Kalyanak)", hi: "दीपावली (निर्वाण कल्याणक)" },
    date: "8 November 2026",
    daysLeft: 580,
    desc: { en: "Commemorates the Nirvana (liberation) of Lord Mahavira.", hi: "भगवान महावीर के निर्वाण (मुक्ति) की याद दिलाता है।" },
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Diwali_lamps.jpg/800px-Diwali_lamps.jpg",
    color: "from-amber-400 to-yellow-500"
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
  },
  {
    title: "Tattvartha Sutra",
    category: "Pujan",
    content: "सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः..."
  },
  {
    title: "Samayasara",
    category: "Vidhan",
    content: "वंदित्तु सव्वसिद्धे..."
  }
];

// 24 Tirthankars of Present Kaal
const presentTirthankars = [
  { name: { en: "Rishabhanatha (Adinatha)", hi: "ऋषभनाथ (आदिनाथ)" }, number: 1, symbol: { en: "Bull", hi: "बैल" }, color: "Golden", kaal: "Present", details: { en: "The first Tirthankara.", hi: "प्रथम तीर्थंकर।" }, kalyanaks: ["Chaitra Krishna 9", "Chaitra Krishna 9", "Phalguna Krishna 11", "Phalguna Krishna 11", "Magha Krishna 14"] },
  { name: { en: "Ajitanatha", hi: "अजितनाथ" }, number: 2, symbol: { en: "Elephant", hi: "हाथी" }, color: "Golden", kaal: "Present", details: { en: "The 2nd Tirthankara.", hi: "द्वितीय तीर्थंकर।" }, kalyanaks: ["Magha Shukla 10", "Magha Shukla 10", "Magha Shukla 10", "Pausha Shukla 11", "Chaitra Shukla 5"] },
  { name: { en: "Sambhavanatha", hi: "संभवनाथ" }, number: 3, symbol: { en: "Horse", hi: "घोड़ा" }, color: "Golden", kaal: "Present", details: { en: "The 3rd Tirthankara.", hi: "तृतीय तीर्थंकर।" }, kalyanaks: ["Phalguna Shukla 8", "Margashirsha Purnima", "Margashirsha Purnima", "Kartik Krishna 4", "Chaitra Shukla 5"] },
  { name: { en: "Abhinandananatha", hi: "अभिनंदननाथ" }, number: 4, symbol: { en: "Monkey", hi: "बंदर" }, color: "Golden", kaal: "Present", details: { en: "The 4th Tirthankara.", hi: "चतुर्थ तीर्थंकर।" }, kalyanaks: ["Vaishakha Shukla 6", "Magha Shukla 2", "Magha Shukla 2", "Pausha Shukla 14", "Vaishakha Shukla 6"] },
  { name: { en: "Sumatinatha", hi: "सुमतिनाथ" }, number: 5, symbol: { en: "Goose", hi: "हंस" }, color: "Golden", kaal: "Present", details: { en: "The 5th Tirthankara.", hi: "पंचम तीर्थंकर।" }, kalyanaks: ["Shravana Shukla 2", "Chaitra Shukla 11", "Chaitra Shukla 11", "Chaitra Shukla 11", "Chaitra Shukla 11"] },
  { name: { en: "Padmaprabha", hi: "पद्मप्रभ" }, number: 6, symbol: { en: "Lotus", hi: "कमल" }, color: "Red", kaal: "Present", details: { en: "The 6th Tirthankara.", hi: "छठे तीर्थंकर।" }, kalyanaks: ["Magha Krishna 6", "Kartik Krishna 13", "Kartik Krishna 13", "Chaitra Purnima", "Phalguna Krishna 4"] },
  { name: { en: "Suparshvanatha", hi: "सुपार्श्वनाथ" }, number: 7, symbol: { en: "Swastika", hi: "स्वास्तिक" }, color: "Golden", kaal: "Present", details: { en: "The 7th Tirthankara.", hi: "सातवें तीर्थंकर।" }, kalyanaks: ["Bhadrapada Shukla 8", "Jyeshtha Shukla 12", "Jyeshtha Shukla 12", "Phalguna Krishna 6", "Phalguna Krishna 7"] },
  { name: { en: "Chandraprabha", hi: "चंद्रप्रभ" }, number: 8, symbol: { en: "Crescent Moon", hi: "अर्धचंद्र" }, color: "White", kaal: "Present", details: { en: "The 8th Tirthankara.", hi: "आठवें तीर्थंकर।" }, kalyanaks: ["Chaitra Krishna 5", "Pausha Krishna 11", "Pausha Krishna 11", "Phalguna Krishna 7", "Bhadrapada Krishna 7"] },
  { name: { en: "Pushpadanta (Suvidhinatha)", hi: "पुष्पदंत (सुविधिनाथ)" }, number: 9, symbol: { en: "Crocodile", hi: "मगरमच्छ" }, color: "White", kaal: "Present", details: { en: "The 9th Tirthankara.", hi: "नौवें तीर्थंकर।" }, kalyanaks: ["Phalguna Krishna 9", "Margashirsha Krishna 1", "Margashirsha Krishna 1", "Kartik Shukla 2", "Bhadrapada Shukla 9"] },
  { name: { en: "Shitalanatha", hi: "शीतलनाथ" }, number: 10, symbol: { en: "Kalpavriksha", hi: "कल्पवृक्ष" }, color: "Golden", kaal: "Present", details: { en: "The 10th Tirthankara.", hi: "दसवें तीर्थंकर।" }, kalyanaks: ["Chaitra Krishna 8", "Magha Krishna 12", "Magha Krishna 12", "Pausha Krishna 14", "Ashvina Shukla 8"] },
  { name: { en: "Shreyansanatha", hi: "श्रेयांसनाथ" }, number: 11, symbol: { en: "Rhinoceros", hi: "गैंडा" }, color: "Golden", kaal: "Present", details: { en: "The 11th Tirthankara.", hi: "ग्यारहवें तीर्थंकर।" }, kalyanaks: ["Jyeshtha Krishna 6", "Phalguna Krishna 11", "Phalguna Krishna 11", "Magha Krishna 15", "Shravana Krishna 3"] },
  { name: { en: "Vasupujya", hi: "वासुपूज्य" }, number: 12, symbol: { en: "Buffalo", hi: "भैंस" }, color: "Red", kaal: "Present", details: { en: "The 12th Tirthankara.", hi: "बारहवें तीर्थंकर।" }, kalyanaks: ["Ashadha Krishna 6", "Phalguna Krishna 14", "Phalguna Krishna 14", "Magha Shukla 2", "Bhadrapada Shukla 14"] },
  { name: { en: "Vimalanatha", hi: "विमलनाथ" }, number: 13, symbol: { en: "Boar", hi: "वराह" }, color: "Golden", kaal: "Present", details: { en: "The 13th Tirthankara.", hi: "तेरहवें तीर्थंकर।" }, kalyanaks: ["Jyeshtha Shukla 10", "Magha Shukla 4", "Magha Shukla 4", "Magha Shukla 6", "Ashadha Krishna 8"] },
  { name: { en: "Anantanatha", hi: "अनंतनाथ" }, number: 14, symbol: { en: "Porcupine", hi: "साही" }, color: "Golden", kaal: "Present", details: { en: "The 14th Tirthankara.", hi: "चौदहवें तीर्थंकर।" }, kalyanaks: ["Kartik Krishna 1", "Jyeshtha Krishna 12", "Jyeshtha Krishna 12", "Chaitra Krishna 15", "Chaitra Krishna 5"] },
  { name: { en: "Dharmanatha", hi: "धर्मनाथ" }, number: 15, symbol: { en: "Vajra", hi: "वज्र" }, color: "Golden", kaal: "Present", details: { en: "The 15th Tirthankara.", hi: "पंद्रहवें तीर्थंकर।" }, kalyanaks: ["Vaishakha Shukla 13", "Magha Shukla 13", "Magha Shukla 13", "Pausha Purnima", "Jyeshtha Shukla 4"] },
  { name: { en: "Shantinatha", hi: "शांतिनाथ" }, number: 16, symbol: { en: "Deer", hi: "हिरण" }, color: "Golden", kaal: "Present", details: { en: "The 16th Tirthankara.", hi: "सोलहवें तीर्थंकर।" }, kalyanaks: ["Bhadrapada Krishna 7", "Jyeshtha Krishna 14", "Jyeshtha Krishna 14", "Pausha Shukla 9", "Jyeshtha Krishna 14"] },
  { name: { en: "Kunthunatha", hi: "कुंथुनाथ" }, number: 17, symbol: { en: "Goat", hi: "बकरा" }, color: "Golden", kaal: "Present", details: { en: "The 17th Tirthankara.", hi: "सत्रहवें तीर्थंकर।" }, kalyanaks: ["Shravana Krishna 10", "Vaishakha Shukla 1", "Vaishakha Shukla 1", "Chaitra Shukla 3", "Vaishakha Shukla 1"] },
  { name: { en: "Aranatha", hi: "अरनाथ" }, number: 18, symbol: { en: "Nandyavarta", hi: "नंद्यावर्त" }, color: "Golden", kaal: "Present", details: { en: "The 18th Tirthankara.", hi: "अठारहवें तीर्थंकर।" }, kalyanaks: ["Phalguna Shukla 2", "Margashirsha Shukla 10", "Margashirsha Shukla 10", "Kartik Shukla 12", "Margashirsha Shukla 10"] },
  { name: { en: "Mallinatha", hi: "मल्लिनाथ" }, number: 19, symbol: { en: "Water Jug", hi: "कलश" }, color: "Blue", kaal: "Present", details: { en: "The 19th Tirthankara.", hi: "उन्नीसवें तीर्थंकर।" }, kalyanaks: ["Chaitra Shukla 1", "Margashirsha Shukla 11", "Margashirsha Shukla 11", "Pausha Krishna 2", "Phalguna Shukla 5"] },
  { name: { en: "Munisuvrata", hi: "मुनिसुव्रत" }, number: 20, symbol: { en: "Tortoise", hi: "कछुआ" }, color: "Black", kaal: "Present", details: { en: "The 20th Tirthankara.", hi: "बीसवें तीर्थंकर।" }, kalyanaks: ["Shravana Shukla 15", "Vaishakha Krishna 10", "Vaishakha Krishna 10", "Phalguna Krishna 12", "Phalguna Krishna 12"] },
  { name: { en: "Naminatha", hi: "नमिनाथ" }, number: 21, symbol: { en: "Blue Lotus", hi: "नीलकमल" }, color: "Golden", kaal: "Present", details: { en: "The 21st Tirthankara.", hi: "इक्कीसवें तीर्थंकर।" }, kalyanaks: ["Ashvina Krishna 2", "Ashadha Krishna 10", "Ashadha Krishna 10", "Margashirsha Shukla 11", "Vaishakha Krishna 14"] },
  { name: { en: "Neminatha", hi: "नेमिनाथ" }, number: 22, symbol: { en: "Conch", hi: "शंख" }, color: "Black", kaal: "Present", details: { en: "The 22nd Tirthankara.", hi: "बाईसवें तीर्थंकर।" }, kalyanaks: ["Kartik Shukla 6", "Shravana Shukla 6", "Shravana Shukla 6", "Ashvina Shukla 1", "Ashadha Shukla 8"] },
  { name: { en: "Parshvanatha", hi: "पार्श्वनाथ" }, number: 23, symbol: { en: "Snake", hi: "सांप" }, color: "Blue", kaal: "Present", details: { en: "The 23rd Tirthankara.", hi: "तेईसवें तीर्थंकर।" }, kalyanaks: ["Chaitra Krishna 4", "Pausha Krishna 11", "Pausha Krishna 11", "Chaitra Krishna 4", "Shravana Shukla 7"] },
  { name: { en: "Mahavira", hi: "महावीर" }, number: 24, symbol: { en: "Lion", hi: "शेर" }, color: "Golden", kaal: "Present", details: { en: "The 24th Tirthankara.", hi: "चौबीसवें तीर्थंकर।" }, kalyanaks: ["Ashadha Shukla 6", "Chaitra Shukla 13", "Margashirsha Krishna 10", "Vaishakha Shukla 10", "Kartik Krishna 15"] }
];

const pastTirthankars = [
  { name: { en: "Nirvani", hi: "निर्वाणी" }, number: 1, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "First Tirthankara of Past Kaal.", hi: "अतीत काल के प्रथम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Sagara", hi: "सागर" }, number: 2, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Second Tirthankara of Past Kaal.", hi: "अतीत काल के द्वितीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Mahabhadra", hi: "महाभद्र" }, number: 3, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Past", details: { en: "Third Tirthankara of Past Kaal.", hi: "अतीत काल के तृतीय तीर्थंकर।" }, kalyanaks: [] },
];

const futureTirthankars = [
  { name: { en: "Padmanabha", hi: "पद्मनाभ" }, number: 1, symbol: { en: "Lotus", hi: "कमल" }, color: "Golden", kaal: "Future", details: { en: "First Tirthankara of Future Kaal.", hi: "भविष्य काल के प्रथम तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Suradeva", hi: "सुरदेव" }, number: 2, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Second Tirthankara of Future Kaal.", hi: "भविष्य काल के द्वितीय तीर्थंकर।" }, kalyanaks: [] },
  { name: { en: "Suparshva", hi: "सुपार्श्व" }, number: 3, symbol: { en: "Unknown", hi: "अज्ञात" }, color: "Golden", kaal: "Future", details: { en: "Third Tirthankara of Future Kaal.", hi: "भविष्य काल के तृतीय तीर्थंकर।" }, kalyanaks: [] },
];

const tirthankarsData = [...presentTirthankars, ...pastTirthankars, ...futureTirthankars];

async function seed() {
  try {
    // Clear existing data
    const cols = ['knowledge', 'tirthankars', 'aagams', 'history', 'festivals'];
    for (const col of cols) {
      const snap = await getDocs(collection(db, col));
      for (const d of snap.docs) {
        await deleteDoc(doc(db, col, d.id));
      }
    }

    const knowledgeSnap = await getDocs(collection(db, 'knowledge'));
    if (knowledgeSnap.empty) {
      console.log('Seeding knowledge...');
      for (const item of knowledgeData) await addDoc(collection(db, 'knowledge'), item);
      console.log('Seeded knowledge');
    }

    const tirthankarsSnap = await getDocs(collection(db, 'tirthankars'));
    if (tirthankarsSnap.empty) {
      console.log('Seeding tirthankars...');
      for (const item of tirthankarsData) await addDoc(collection(db, 'tirthankars'), item);
      console.log('Seeded tirthankars');
    }

    const aagamsSnap = await getDocs(collection(db, 'aagams'));
    if (aagamsSnap.empty) {
      console.log('Seeding aagams...');
      for (const item of aagamsData) await addDoc(collection(db, 'aagams'), item);
      console.log('Seeded aagams');
    }

    const historySnap = await getDocs(collection(db, 'history'));
    if (historySnap.empty) {
      console.log('Seeding history...');
      for (const item of historyData) await addDoc(collection(db, 'history'), item);
      console.log('Seeded history');
    }

    const festivalsSnap = await getDocs(collection(db, 'festivals'));
    if (festivalsSnap.empty) {
      console.log('Seeding festivals...');
      for (const item of festivalsData) await addDoc(collection(db, 'festivals'), item);
      console.log('Seeded festivals');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
