export interface LineageNode {
  id: string;
  name: { en: string; hi: string };
  period: { en: string; hi: string };
  role: { en: string; hi: string };
  desc: { en: string; hi: string };
  phase: { en: string; hi: string };
}

export const lineageData: LineageNode[] = [
  {
    id: 'mahavira',
    name: { en: "Tirthankar Bhagwan Mahavira", hi: "चर्म तीर्थंकर भगवान महावीर" },
    period: { en: "599 - 527 BCE", hi: "ईसा पूर्व ५९९ - ५२७" },
    role: { en: "The 24th sovereign spiritual teacher", hi: "२४वें तीर्थंकर (शासन नायक)" },
    desc: {
      en: "The supreme teacher who attained Kevalgyan (omniscience) and re-established the standard four-fold order (Sravaka, Sravika, Muni, Aryika) of Jainism.",
      hi: "जैन धर्म के २४वें तीर्थंकर जिन्होंने संपूर्ण आत्मज्ञान (केवलज्ञान) प्राप्त कर अहिंसा, अपरिग्रह और अनेकांत का पावन मार्ग प्रशस्त किया।"
    },
    phase: { en: "The Root Tirthankar", hi: "मूल शासन काल" }
  },
  {
    id: 'gautama',
    name: { en: "Ganadhara Gautama Swami", hi: "प्रथम गणधर गौतम स्वामी" },
    period: { en: "527 BCE succession", hi: "भगवान के प्रमुख शिष्य" },
    role: { en: "Chief disciple and organizer of divine speech", hi: "प्रथम गणदेव (प्रमुख गणधर)" },
    desc: {
      en: "The highly advanced direct disciple who captured the divine word (Divya-Dhvani) of Lord Mahavira and systemized it into the primary scriptures (Dwadasanga). Attained Kevalgyan on the evening of Mahavira's Nirvana.",
      hi: "भगवान महावीर की दिव्यध्वनि को द्वादशांग वाणी में लिपिबद्ध करने वाले साक्षात् बुद्धिऋद्धिधारी गणधर देव। उन्हें भगवान के निर्वाण दिवस पर केवलज्ञान हुआ।"
    },
    phase: { en: "Gandhara Succession", hi: "गणधर परंपरा" }
  },
  {
    id: 'sudharma',
    name: { en: "Acharya Sudharma Swami", hi: "गणधर सुधर्मा स्वामी" },
    period: { en: "Attained Kevalgyan 12 years after Gautama", hi: "द्वितीय केवलज्ञानी" },
    role: { en: "Second Kevali (omniscent teacher)", hi: "द्वितीय पट्टाचार्य एवं केवलज्ञani" },
    desc: {
      en: "One of the direct Gandharas of Lord Mahavira who succeeded Gautama Swami and kept the flame of omniscience alive, delivering standard spiritual discourses.",
      hi: "गौतम स्वामी के पश्चात केवलज्ञान प्राप्त कर संघ का नेतृत्व करने वाले द्वितीय केवलज्ञानी आचार्यदेव।"
    },
    phase: { en: "Gandhara Succession", hi: "गणधर परंपरा" }
  },
  {
    id: 'jambu',
    name: { en: "Acharya Jambu Swami", hi: "अंतिम केवलज्ञानी जम्बू स्वामी" },
    period: { en: "Attained Kevalgyan 62 years post-Nirvana", hi: "अंतिम केवलज्ञानी मुनिराज" },
    role: { en: "The Last Kevali (Omniscient) of this era", hi: "अंतिम प्रत्यक्ष केवलज्ञानी" },
    desc: {
      en: "The absolute last person in this world cycle (Era of decline) to attain complete, pure Omniscience (Kevalgyan) and ascend to absolute liberation (Moksha).",
      hi: "इस युग (पंचम काल) के अंतिम प्रत्यक्ष केवलज्ञानी महामुनि। इनके मोक्ष जाने के बाद प्रत्यक्ष केवलज्ञान का मार्ग बंद हो गया।"
    },
    phase: { en: "Last Kevali Era", hi: "केवलज्ञानी काल समाप्ति" }
  },
  {
    id: 'shruta_kevalis',
    name: { en: "The Five Shruta Kevalis", hi: "पंच श्रुतकेवली (विष्णु-नंदि-भद्रबाहु)" },
    period: { en: "Up to 162 years after Mahavira", hi: "महावीर निर्वाण के १६२ वर्ष तक" },
    role: { en: "Masters of the complete unwritten scriptures", hi: "पूर्ण द्वादशांग के ज्ञाता" },
    desc: {
      en: "Including Acharya Bhadrabahu (who predicted the 12-year famine and led the grand migration south). They had complete mastery over all 14 Purvas and 12 Angas (holy lore).",
      hi: "आचार्य भद्रबाहू स्वामी सहित वे पांच महान दिगंबर संत जो बिना लिखे संपूर्ण शास्त्रों (श्रुत केवल) के कंठस्थ ज्ञाता थे।"
    },
    phase: { en: "Shruta Kevali Period", hi: "श्रुतकेवली परंपरा" }
  },
  {
    id: 'kundakunda',
    name: { en: "Acharya Kundakunda Dev", hi: "कलिकालसर्वज्ञ आचार्य कुंदकुंद देव" },
    period: { en: "1st Century BCE", hi: "ईसा पूर्व प्रथम शताब्दी" },
    role: { en: "Pillar of spiritual self-realization (Samayasar)", hi: "मूल अध्यात्म परम्परा नायक" },
    desc: {
      en: "Inventor of the visual 'Two-Truths' perspective (Nishchaya and Vyavahara Nayas). He visited Videha Kshetra (the pure realm) and brought back pristine teachings from Lord Simandhar.",
      hi: "दार्शनिक अध्यात्म के प्रणेता। इन्होंने निश्चय और व्यवहार नय के संतुलन से समयसार जी ग्रंथ लिखकर जीवंत आत्म-अनुभूति का मार्ग दिखाया।"
    },
    phase: { en: "Pristine Digambara Acharyas", hi: "दिगंबर नायक युग" }
  },
  {
    id: 'shantisagar',
    name: { en: "Acharya Shantisagar Ji Maharaj", hi: "प्रथमाचार्य चारित्र चक्रवर्ती शांतिसागर जी" },
    period: { en: "1872 - 1955 CE", hi: "१८७२ - १९५५ ईस्वी" },
    role: { en: "The 20th-century revivalist pioneer", hi: "बीसवीं सदी के पथ-प्रदर्शक" },
    desc: {
      en: "Known as 'Charitra Chakravarti'. He revived the forgotten Digambar monk conduct, walking across India on foot, resisting colonial restrictions, and initiating a global wave of spiritual purity.",
      hi: "बीसवीं सदी के प्रथमाचार्य जिन्होंने घोर उपसर्ग और विषम परिस्थितियों के बीच दिगंबर मुनि चर्या को पुनः जीवित कर भारत भ्रमण किया।"
    },
    phase: { en: "Modern Renaissance", hi: "आधुनिक पुनरुद्धार काल" }
  },
  {
    id: 'vidyasagar',
    name: { en: "Acharya Vidyasagar Ji Maharaj", hi: "तपोमूर्ति आचार्य श्री विद्यासागर जी महाराज" },
    period: { en: "1946 - 2024 CE", hi: "१९४६ - २०२४ ईस्वी" },
    role: { en: "The silent legend of absolute detachment", hi: "यशी-संत एवं तपोनिधि" },
    desc: {
      en: "A monumental master of penance, who initiated over 500 pure Digambara monks and nuns (Aryikas), championing Hathkargha (bio-clothing), Swadeshi, and preservation of sacred cows.",
      hi: "राष्ट्रसंत एवं ज्ञानाधिराज। इन्होंने निस्पृह भाव से कठोर तपस्या की और सैकड़ों मुनि संघ को दीक्षित कर सेवा, ज्ञान व मोक्ष मार्ग को शिखर पर पहुंचाया।"
    },
    phase: { en: "Modern Renaissance", hi: "आधुनिक पुनरुद्धार काल" }
  },
  {
    id: 'disciples',
    name: { en: "Modern Disciples & Sangha Leaders", hi: "वर्तमान मुनि संघ एवं शिष्य परंपरा" },
    period: { en: "2024 CE onwards", hi: "वर्तमान समय तक अनवरत" },
    role: { en: "Carrying the torch of continuous self-realization", hi: "सच्चे मुनि धर्म के अग्रदूत" },
    desc: {
      en: "Dozens of highly learned Acharyas and Muni-Sangha (like Acharya Samaysagar Ji, Acharya Prashastsagar Ji, and others) continue to practice the ancient strict code of Digambara asceticism.",
      hi: "आचार्य समयसागर जी महाराज एवं मुनिराजों का विशाल संघ जो आज भी भगवान महावीर के उसी २८ मूलगुण रूपी कठोर दिगंबर मार्ग पर आगे बढ़ रहे हैं।"
    },
    phase: { en: "Living Legacy", hi: "अक्षुण्ण जीवंत विरासत" }
  }
];
