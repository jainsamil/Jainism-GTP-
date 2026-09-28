/**
 * JAIN GAMES & FUN REPOSITORY (जैन खेल एवं मनोरंजन डेटा)
 * Supports Jain Tambola, Gyan Deepak (KBC Style), Moksha Path (Gyan Chaupar), and Jain Puzzle.
 */

// ==================== GYAN DEEPAK (KBC HOT SEAT) DATA ====================
export interface GyanDeepakQuestion {
  id: string;
  level: number; // 1 to 15
  points: number;
  timeSeconds: number;
  question: { hi: string; en: string };
  options: { hi: string[]; en: string[] };
  answer: number; // 0-3
  explanation: { hi: string; en: string };
}

export const GYAN_DEEPAK_PRIZE_LADDER = [
  { level: 1, points: 100, label: '100', isPadav: false },
  { level: 2, points: 200, label: '200', isPadav: false },
  { level: 3, points: 300, label: '300', isPadav: false },
  { level: 4, points: 500, label: '500', isPadav: false },
  { level: 5, points: 1000, label: '1,000', isPadav: true }, // PADAV 1
  { level: 6, points: 2000, label: '2,000', isPadav: false },
  { level: 7, points: 4000, label: '4,000', isPadav: false },
  { level: 8, points: 8000, label: '8,000', isPadav: false },
  { level: 9, points: 16000, label: '16,000', isPadav: false },
  { level: 10, points: 32000, label: '32,000', isPadav: true }, // PADAV 2
  { level: 11, points: 64000, label: '64,000', isPadav: false },
  { level: 12, points: 125000, label: '1,25,000', isPadav: false },
  { level: 13, points: 250000, label: '2,50,000', isPadav: false },
  { level: 14, points: 500000, label: '5,00,000', isPadav: false },
  { level: 15, points: 1000000, label: '10,00,000', isPadav: true }, // ULTIMATE WIN
];

export const GYAN_DEEPAK_QUESTIONS_POOL: Record<number, GyanDeepakQuestion[]> = {
  1: [
    {
      id: 'gd_1_a',
      level: 1,
      points: 100,
      timeSeconds: 20,
      question: { hi: 'जैन धर्म में कुल कितने तीर्थंकर हुए हैं?', en: 'How many Tirthankaras are there in Jainism?' },
      options: { hi: ['१२ (12)', '२४ (24)', '१०८ (108)', '१०० (100)'], en: ['12', '24', '108', '100'] },
      answer: 1,
      explanation: { hi: 'वर्तमान अवसर्पिणी काल में कुल २४ तीर्थंकर हुए हैं।', en: 'There are 24 Tirthankaras in the current cosmic cycle.' }
    },
    {
      id: 'gd_1_b',
      level: 1,
      points: 100,
      timeSeconds: 20,
      question: { hi: 'णमोकार मंत्र का प्रथम पद क्या है?', en: 'What is the first line of the Navkar Mantra?' },
      options: { hi: ['णमो सिद्धाणं', 'णमो अरिहंताणं', 'णमो आयरियाणं', 'णमो लोए सव्वसाहूणं'], en: ['Namo Siddhanam', 'Namo Arihantanam', 'Namo Ayariyanam', 'Namo Loe Savvasahunam'] },
      answer: 1,
      explanation: { hi: 'णमो अरिहंताणं णमोकार महामंत्र का प्रथम और प्रधान पद है।', en: 'Namo Arihantanam is the first salutation.' }
    }
  ],
  2: [
    {
      id: 'gd_2_a',
      level: 2,
      points: 200,
      timeSeconds: 20,
      question: { hi: 'भगवान महावीर स्वामी का लांछन (चिन्ह) क्या है?', en: 'What is the sacred symbol of Lord Mahavira?' },
      options: { hi: ['हाथी', 'बैल', 'सिंह', 'सर्प'], en: ['Elephant', 'Bull', 'Lion', 'Serpent'] },
      answer: 2,
      explanation: { hi: 'भगवान महावीर स्वामी का लांछन सिंह (केसरी) है।', en: 'The Lion is the sacred emblem of Lord Mahavira.' }
    }
  ],
  3: [
    {
      id: 'gd_3_a',
      level: 3,
      points: 300,
      timeSeconds: 20,
      question: { hi: 'जैन धर्म का सर्वोच्च सिद्धांत क्या है?', en: 'What is the supreme principle of Jainism?' },
      options: { hi: ['अहिंसा परमो धर्मः', 'सत्यमेव जयते', 'वसुधैव कुटुम्बकम्', 'कर्म ही पूजा है'], en: ['Ahimsa Paramo Dharmah', 'Satyameva Jayate', 'Vasudhaiva Kutumbakam', 'Work is Worship'] },
      answer: 0,
      explanation: { hi: 'अहिंसा परमो धर्मः जैन संस्कृति का मूल प्राण है।', en: 'Non-violence is the supreme virtue.' }
    }
  ],
  4: [
    {
      id: 'gd_4_a',
      level: 4,
      points: 500,
      timeSeconds: 25,
      question: { hi: 'भगवान आदिनाथ (ऋषभदेव) का निर्वाण (मोक्ष) किस पर्वत से हुआ था?', en: 'From which holy mountain did Lord Adinath attain Nirvana?' },
      options: { hi: ['सम्मेद शिखरजी', 'कैलाश पर्वत (अष्टापद)', 'गिरनार जी', 'पावापुरी'], en: ['Sammed Shikharji', 'Kailash Parvat (Ashtapad)', 'Girnar Ji', 'Pawapuri'] },
      answer: 1,
      explanation: { hi: 'प्रथम तीर्थंकर ऋषभदेव कैलाश पर्वत (अष्टापद) से मोक्ष पधारे थे।', en: 'Lord Adinath attained Nirvana from Mount Ashtapad (Kailash).' }
    }
  ],
  5: [
    {
      id: 'gd_5_a',
      level: 5,
      points: 1000,
      timeSeconds: 25,
      question: { hi: 'रत्नत्रय (तीन रत्न) में कौन-कौन शामिल हैं?', en: 'What constitutes the Three Jewels (Ratnatraya) in Jainism?' },
      options: { hi: ['दान, शील, तप', 'सम्यग्दर्शन, सम्यग्ज्ञान, सम्यक्चारित्र', 'मन, वचन, काय', 'अरिहंत, सिद्ध, साधु'], en: ['Charity, Conduct, Penance', 'Right Faith, Right Knowledge, Right Conduct', 'Mind, Speech, Body', 'Arihant, Siddha, Sadhu'] },
      answer: 1,
      explanation: { hi: 'सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः — सम्यग्दर्शन, ज्ञान, चारित्र ही मुक्ति का मार्ग हैं।', en: 'Samyag Darshan, Samyag Jnana, and Samyak Charitra constitute the path to liberation.' }
    }
  ],
  6: [
    {
      id: 'gd_6_a',
      level: 6,
      points: 2000,
      timeSeconds: 30,
      question: { hi: 'भक्तामर स्तोत्र के रचयिता कौन हैं?', en: 'Who composed the sacred Bhaktamara Stotra?' },
      options: { hi: ['आचार्य मानतुंग', 'आचार्य कुंदकुंद', 'आचार्य समंतभद्र', 'आचार्य विद्यासागर जी'], en: ['Acharya Manatunga', 'Acharya Kundakunda', 'Acharya Samantabhadra', 'Acharya Vidyasagar Ji'] },
      answer: 0,
      explanation: { hi: 'आचार्य मानतुंग ने ४८ तालों की बेड़ियों को तोड़ते हुए भक्तामर स्तोत्र की रचना की थी।', en: 'Acharya Manatunga composed Bhaktamara Stotra while bound by 48 iron chains.' }
    }
  ],
  7: [
    {
      id: 'gd_7_a',
      level: 7,
      points: 4000,
      timeSeconds: 30,
      question: { hi: 'भगवान पार्श्वनाथ को केवलज्ञान किस वृक्ष के नीचे हुआ था?', en: 'Under which tree did Lord Parshvanath attain Kevalajnana?' },
      options: { hi: ['वट वृक्ष', 'धैव (धातकी) वृक्ष', 'साल वृक्ष', 'अशोक वृक्ष'], en: ['Banyan tree', 'Dhaiva tree', 'Sal tree', 'Ashoka tree'] },
      answer: 1,
      explanation: { hi: 'भगवान पार्श्वनाथ को धैव वृक्ष के नीचे परम केवलज्ञान की प्राप्ति हुई थी।', en: 'Lord Parshvanath attained Kevalajnana under a Dhaiva tree.' }
    }
  ],
  8: [
    {
      id: 'gd_8_a',
      level: 8,
      points: 8000,
      timeSeconds: 30,
      question: { hi: 'जैन दर्शन में मूल द्रव्यों की कुल संख्या कितनी है?', en: 'How many fundamental substances (Dravyas) exist according to Jainism?' },
      options: { hi: ['४', '५', '६ (षट्द्रव्य)', '९'], en: ['4', '5', '6 (Shaddravya)', '9'] },
      answer: 2,
      explanation: { hi: 'जीव, पुद्गल, धर्म, अधर्म, आकाश और काल — ये ६ शाश्वत द्रव्य हैं।', en: 'The six eternal substances are Jiva, Pudgala, Dharma, Adharma, Akasha, and Kala.' }
    }
  ],
  9: [
    {
      id: 'gd_9_a',
      level: 9,
      points: 16000,
      timeSeconds: 35,
      question: { hi: 'दसलक्षण महापर्व में प्रथम धर्म कौन सा होता है?', en: 'What is the first virtue celebrated during the Das Lakshana Parva?' },
      options: { hi: ['उत्तम क्षमा', 'उत्तम मार्दव', 'उत्तम आर्जव', 'उत्तम शौच'], en: ['Uttama Kshama (Forgiveness)', 'Uttama Mardava (Humility)', 'Uttama Aarjava (Straightforwardness)', 'Uttama Saucha (Purity)'] },
      answer: 0,
      explanation: { hi: 'उत्तम क्षमा दसलक्षण पर्व का पहला और आधारभूत धर्म है।', en: 'Supreme Forgiveness (Uttama Kshama) is the first of the ten divine virtues.' }
    }
  ],
  10: [
    {
      id: 'gd_10_a',
      level: 10,
      points: 32000,
      timeSeconds: 35,
      question: { hi: 'आचार्य कुंदकुंद देव ने किस पवित्र ग्रन्थ की रचना की जिसमें आत्मा को शुद्ध ज्ञायक बताया गया?', en: 'Which sacred treatise did Acharya Kundakunda compose proclaiming the soul as pure pure knower?' },
      options: { hi: ['समयसार', 'तत्त्वार्थ सूत्र', 'रत्नकरण्ड श्रावकाचार', 'गोम्मटसार'], en: ['Samayasara', 'Tattvartha Sutra', 'Ratnakaranda Shravakachara', 'Gommateshvara'] },
      answer: 0,
      explanation: { hi: 'समयसार आचार्य कुंदकुंद देव की सर्वोत्कृष्ट आध्यात्मिक रचना है।', en: 'Samayasara is the crowning spiritual text of Acharya Kundakunda.' }
    }
  ],
  11: [
    {
      id: 'gd_11_a',
      level: 11,
      points: 64000,
      timeSeconds: 40,
      question: { hi: 'जैन कर्म सिद्धान्त में घातिया कर्मों की संख्या कितनी है?', en: 'How many Ghatiya (soul-obscuring) karmas are there in Jain Karma theory?' },
      options: { hi: ['२', '४ घातिया कर्म', '६', '८'], en: ['2', '4 Ghatiya Karmas', '6', '8'] },
      answer: 1,
      explanation: { hi: 'ज्ञानावरणीय, दर्शनावरणीय, मोहनीय और अंतराय — ये ४ घातिया कर्म हैं।', en: 'The four Ghatiya karmas are Jnanavaraniya, Darshanavaraniya, Mohaniya, and Antaraya.' }
    }
  ],
  12: [
    {
      id: 'gd_12_a',
      level: 12,
      points: 125000,
      timeSeconds: 40,
      question: { hi: 'गोमटेश्वर बाहुबली स्वामी की विश्व प्रसिद्ध ५७ फीट ऊंची एकाश्म प्रतिमा किस राज्य में स्थित है?', en: 'In which Indian state is the 57-ft monolithic Gommateshwara Bahubali statue located?' },
      options: { hi: ['राजस्थान', 'कर्नाटक (श्रवणबेलगोला)', 'मध्य प्रदेश', 'गुजरात'], en: ['Rajasthan', 'Karnataka (Shravanabelagola)', 'Madhya Pradesh', 'Gujarat'] },
      answer: 1,
      explanation: { hi: 'कर्नाटक के श्रवणबेलगोला में विन्ध्यगिरि पर्वत पर चामुण्डराय द्वारा यह विशाल प्रतिमा स्थापित कराई गई थी।', en: 'It was consecrated by minister Chavundaraya in Shravanabelagola, Karnataka.' }
    }
  ],
  13: [
    {
      id: 'gd_13_a',
      level: 13,
      points: 250000,
      timeSeconds: 45,
      question: { hi: 'अष्टाह्निका महापर्व वर्ष में कितनी बार आता है?', en: 'How many times a year does the Ashtahnika Parva occur?' },
      options: { hi: ['१ बार', '२ बार', '३ बार (कार्तिक, फाल्गुन, आषाढ़)', '४ बार'], en: ['Once', 'Twice', '3 times (Kartik, Falgun, Ashadh)', '4 times'] },
      answer: 2,
      explanation: { hi: 'अष्टाह्निका पर्व वर्ष में तीन बार (कार्तिक, फाल्गुन और आषाढ़ शुक्ल अष्टमी से पूर्णिमा) आता है।', en: 'Ashtahnika occurs thrice yearly, during which heavenly devas worship Nandishwar Dweep.' }
    }
  ],
  14: [
    {
      id: 'gd_14_a',
      level: 14,
      points: 500000,
      timeSeconds: 45,
      question: { hi: 'जैन भूगोल के अनुसार नन्दीश्वर द्वीप में कुल कितने अकृत्रिम जिनालय हैं?', en: 'According to Jain cosmology, how many Akritrim Jinalayas are in Nandishwar Dweep?' },
      options: { hi: ['२४', '५२ अकृत्रिम चैत्यालय', '१०८', '४५८'], en: ['24', '52 Akritrim Chaityalayas', '108', '458'] },
      answer: 1,
      explanation: { hi: 'नन्दीश्वर द्वीप के चार अंजनगिरि, सोलह दधिमुख और बत्तीस रतिकर पर्वतों पर कुल ५२ जिनमंदिर हैं।', en: 'There are 52 natural, non-man-made temples located across the mountains of Nandishwar Dweep.' }
    }
  ],
  15: [
    {
      id: 'gd_15_a',
      level: 15,
      points: 1000000,
      timeSeconds: 45,
      question: { hi: 'दिगम्बर जैन आगम का प्रथम लिपिबद्ध ग्रंथ "षट्खण्डागम" किन आचार्यों द्वारा रचा गया था?', en: 'Which revered Acharyas inscribed the premier Digambara text "Shatkhandagama"?' },
      options: { hi: ['आचार्य धरसेन के शिष्य पुष्पदंत एवं भूतबली', 'आचार्य समंतभद्र एवं पूज्यपाद', 'आचार्य नेमिचन्द्र एवं जिनसेन', 'आचार्य भद्रबाहु एवं स्थूलभद्र'], en: ['Acharyas Pushpadanta & Bhutabali', 'Acharyas Samantabhadra & Pujyapada', 'Acharyas Nemichandra & Jinasena', 'Acharyas Bhadrabahu & Sthulabhadra'] },
      answer: 0,
      explanation: { hi: 'आचार्य धरसेन के आदेश पर आचार्य पुष्पदंत और आचार्य भूतबली ने ईसा पूर्व द्वितीय शताब्दी में षट्खण्डागम की रचना की थी।', en: 'Acharyas Pushpadanta and Bhutabali inscribed the sacred Shatkhandagama upon learning from Dharasenacharya.' }
    }
  ]
};

// ==================== JAIN PUZZLE DATA ====================
export interface JainPuzzleImage {
  id: string;
  name: { hi: string; en: string };
  location: { hi: string; en: string };
  imageUrl: string;
  credit: string;
}

export const JAIN_PUZZLE_GALLERY: JainPuzzleImage[] = [
  {
    id: 'dilwara',
    name: { hi: 'देलवाड़ा जैन मंदिर', en: 'Dilwara Temples' },
    location: { hi: 'माउंट आबू, राजस्थान', en: 'Mount Abu, Rajasthan' },
    imageUrl: 'https://images.unsplash.com/photo-1599831104648-527c33971439?auto=format&fit=crop&w=800&q=80',
    credit: 'Vimal Vasahi & Luna Vasahi Marble Architecture'
  },
  {
    id: 'ranakpur',
    name: { hi: 'राणकपुर चौमुखा तीर्थ', en: 'Ranakpur Chaumukha Temple' },
    location: { hi: 'पाली, राजस्थान', en: 'Pali, Rajasthan' },
    imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=800&q=80',
    credit: '1444 Carved Marble Pillars dedicated to Lord Adinath'
  },
  {
    id: 'palitana',
    name: { hi: 'शत्रुंजय पालिताना तीर्थ', en: 'Shatrunjaya Palitana Tirth' },
    location: { hi: 'भावनगर, गुजरात', en: 'Bhavnagar, Gujarat' },
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    credit: 'Sacred Hill of Countless Tirthankara Mokshas'
  },
  {
    id: 'shikharji',
    name: { hi: 'श्री सम्मेद शिखरजी', en: 'Shree Sammed Shikharji' },
    location: { hi: 'गिरिडीह, झारखंड', en: 'Giridih, Jharkhand' },
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    credit: 'Nirvana land of 20 Tirthankaras'
  }
];

// ==================== MOKSHA PATH (GYAN CHAUPAR) DATA ====================
export interface MokshaPathLadder {
  start: number;
  end: number;
  name: { hi: string; en: string };
  virtue: { hi: string; en: string };
  emoji: string;
}

export interface MokshaPathSnake {
  start: number;
  end: number;
  name: { hi: string; en: string };
  kashaya: { hi: string; en: string };
  emoji: string;
}

export const MOKSHA_PATH_LADDERS: MokshaPathLadder[] = [
  { start: 2, end: 19, name: { hi: 'विनय (नम्रता)', en: 'Vinaya (Humility)' }, virtue: { hi: 'अहंकार त्याग कर बड़ों का आदर', en: 'Humility and respect' }, emoji: '🙏' },
  { start: 41, end: 62, name: { hi: 'सत्य (सच्चाई)', en: 'Satya (Truthfulness)' }, virtue: { hi: 'सदा मधुर और हितकारी सत्य बोलना', en: 'Sweet and beneficial truth' }, emoji: '☀️' },
  { start: 52, end: 77, name: { hi: 'अहिंसा (करुणा)', en: 'Ahimsa (Compassion)' }, virtue: { hi: 'सभी प्राणियों पर दया भाव रखना', en: 'Compassion for all beings' }, emoji: '🕊️' },
  { start: 59, end: 83, name: { hi: 'सम्यक्त्व (पवित्र दृष्टि)', en: 'Samyaktva (Right Faith)' }, virtue: { hi: 'सच्चे देव-शास्त्र-गुरु पर दृढ़ विश्वास', en: 'Unshakable faith in Truth' }, emoji: '🪷' },
  { start: 70, end: 81, name: { hi: 'तप एवं ध्यान', en: 'Tapas & Dhyana' }, virtue: { hi: 'इन्द्रिय संयम और आत्मलीनता', en: 'Self-restraint and meditation' }, emoji: '🔥' }
];

export const MOKSHA_PATH_SNAKES: MokshaPathSnake[] = [
  { start: 25, end: 8, name: { hi: 'प्रमाद (आलस्य व असावधानी)', en: 'Pramada (Carelessness)' }, kashaya: { hi: 'आलस्य साधना को नष्ट कर देता है', en: 'Carelessness drops spiritual progress' }, emoji: '😴' },
  { start: 32, end: 12, name: { hi: 'क्रोध (गुस्सा)', en: 'Krodha (Anger)' }, kashaya: { hi: 'क्रोध अपने ही पुण्य को जला देता है', en: 'Anger incinerates one’s virtues' }, emoji: '🗡️' },
  { start: 37, end: 21, name: { hi: 'ईर्ष्या व द्वेष', en: 'Irshya (Jealousy)' }, kashaya: { hi: 'दूसरों के गुणों से जलना आत्मा का पतन करता है', en: 'Jealousy causes spiritual ruin' }, emoji: '🎭' },
  { start: 43, end: 30, name: { hi: 'माया (कपट व छल)', en: 'Maya (Deceit)' }, kashaya: { hi: 'छल-कपट दुर्गति का कारण है', en: 'Deceit leads to low rebirths' }, emoji: '🕸️' },
  { start: 55, end: 45, name: { hi: 'लोभ (अति तृष्णा)', en: 'Lobha (Greed)' }, kashaya: { hi: 'लोभ समस्त पापों का बाप है', en: 'Greed is the root of all sins' }, emoji: '🪱' }
];
