export interface Tirthankar {
  id: string;
  name: { en: string; hi: string };
  kaal: 'Past' | 'Present' | 'Future';
  details: { en: string; hi: string };
  symbol: { en: string; hi: string };
  color: string;
}

export const tirthankarData: Tirthankar[] = [
  // Present Era (Chauvisi)
  {
    id: '1',
    name: { en: 'Rishabhdev (Adinath)', hi: 'ऋषभदेव (आदिनाथ)' },
    kaal: 'Present',
    details: {
      en: 'The first Tirthankar of the current era. He taught the world the arts of agriculture, writing, and social organization.',
      hi: 'वर्तमान युग के पहले तीर्थंकर। उन्होंने दुनिया को कृषि, लेखन और सामाजिक संगठन की कलाएँ सिखाईं।'
    },
    symbol: { en: 'Bull', hi: 'बैल' },
    color: 'Golden'
  },
  {
    id: '2',
    name: { en: 'Ajitnath', hi: 'अजितनाथ' },
    kaal: 'Present',
    details: {
      en: 'The second Tirthankar. His name means "The Invincible One".',
      hi: 'द्वितीय तीर्थंकर। उनके नाम का अर्थ है "अजेय"।'
    },
    symbol: { en: 'Elephant', hi: 'हाथी' },
    color: 'Golden'
  },
  {
    id: '3',
    name: { en: 'Sambhavnath', hi: 'सम्भवनाथ' },
    kaal: 'Present',
    details: {
      en: 'The third Tirthankar. He was born in Shravasti.',
      hi: 'तृतीय तीर्थंकर। उनका जन्म श्रावस्ती में हुआ था।'
    },
    symbol: { en: 'Horse', hi: 'घोड़ा' },
    color: 'Golden'
  },
  {
    id: '4',
    name: { en: 'Abhinandannath', hi: 'अभिनंदननाथ' },
    kaal: 'Present',
    details: {
      en: 'The fourth Tirthankar. His name means "The One who is Greeted".',
      hi: 'चौथे तीर्थंकर। उनके नाम का अर्थ है "वह जिसका अभिनंदन किया जाता है"।'
    },
    symbol: { en: 'Monkey', hi: 'बंदर' },
    color: 'Golden'
  },
  {
    id: '5',
    name: { en: 'Sumatinath', hi: 'सुमतिनाथ' },
    kaal: 'Present',
    details: {
      en: 'The fifth Tirthankar. He represents pure intelligence and wisdom.',
      hi: 'पाँचवें तीर्थंकर। वह शुद्ध बुद्धि और ज्ञान का प्रतिनिधित्व करते हैं।'
    },
    symbol: { en: 'Curlew', hi: 'चकवा' },
    color: 'Golden'
  },
  {
    id: '6',
    name: { en: 'Padmaprabha', hi: 'पद्मप्रभ' },
    kaal: 'Present',
    details: {
      en: 'The sixth Tirthankar. He is associated with the red lotus.',
      hi: 'छठे तीर्थंकर। वे लाल कमल से जुड़े हैं।'
    },
    symbol: { en: 'Red Lotus', hi: 'लाल कमल' },
    color: 'Red'
  },
  {
    id: '7',
    name: { en: 'Suparshvanath', hi: 'सुपार्श्वनाथ' },
    kaal: 'Present',
    details: {
      en: 'The seventh Tirthankar. He was born in Varanasi.',
      hi: 'सातवें तीर्थंकर। उनका जन्म वाराणसी में हुआ था।'
    },
    symbol: { en: 'Swastika', hi: 'स्वास्तिक' },
    color: 'Golden'
  },
  {
    id: '8',
    name: { en: 'Chandraprabha', hi: 'चन्द्रप्रभ' },
    kaal: 'Present',
    details: {
      en: 'The eighth Tirthankar. He is associated with the moon.',
      hi: 'आठवें तीर्थंकर। वे चंद्रमा से जुड़े हैं।'
    },
    symbol: { en: 'Moon', hi: 'चंद्रमा' },
    color: 'White'
  },
  {
    id: '9',
    name: { en: 'Pushpadanta', hi: 'पुष्पदन्त' },
    kaal: 'Present',
    details: {
      en: 'The ninth Tirthankar, also known as Suvidhinath.',
      hi: 'नौवें तीर्थंकर, जिन्हें सुविधिनाथ के नाम से भी जाना जाता है।'
    },
    symbol: { en: 'Crocodile', hi: 'मगरमच्छ' },
    color: 'White'
  },
  {
    id: '10',
    name: { en: 'Sheetalnath', hi: 'शीतलनाथ' },
    kaal: 'Present',
    details: {
      en: 'The tenth Tirthankar. He brought coolness and peace to the world.',
      hi: 'दसवें तीर्थंकर। उन्होंने दुनिया में शीतलता और शांति लाई।'
    },
    symbol: { en: 'Shrivatsa', hi: 'श्रीवत्स' },
    color: 'Golden'
  },
  {
    id: '11',
    name: { en: 'Shreyansnath', hi: 'श्रेयांसनाथ' },
    kaal: 'Present',
    details: {
      en: 'The eleventh Tirthankar. He was born in Simhapuri.',
      hi: 'ग्यारहवें तीर्थंकर। उनका जन्म सिंहपुरी में हुआ था।'
    },
    symbol: { en: 'Rhinoceros', hi: 'गेंडा' },
    color: 'Golden'
  },
  {
    id: '12',
    name: { en: 'Vasupujya', hi: 'वासुपूज्य' },
    kaal: 'Present',
    details: {
      en: 'The twelfth Tirthankar. He remained a celibate throughout his life.',
      hi: 'बारहवें तीर्थंकर। वे जीवन भर ब्रह्मचारी रहे।'
    },
    symbol: { en: 'Buffalo', hi: 'भैंसा' },
    color: 'Red'
  },
  {
    id: '13',
    name: { en: 'Vimalnath', hi: 'विमलनाथ' },
    kaal: 'Present',
    details: {
      en: 'The thirteenth Tirthankar. His name means "The Pure One".',
      hi: 'तेरहवें तीर्थंकर। उनके नाम का अर्थ है "निर्मल"।'
    },
    symbol: { en: 'Boar', hi: 'सूअर' },
    color: 'Golden'
  },
  {
    id: '14',
    name: { en: 'Anantnath', hi: 'अनन्तनाथ' },
    kaal: 'Present',
    details: {
      en: 'The fourteenth Tirthankar. He represents infinite knowledge.',
      hi: 'चौदहवें तीर्थंकर। वे अनंत ज्ञान का प्रतिनिधित्व करते हैं।'
    },
    symbol: { en: 'Falcon', hi: 'बाज' },
    color: 'Golden'
  },
  {
    id: '15',
    name: { en: 'Dharmanath', hi: 'धर्मनाथ' },
    kaal: 'Present',
    details: {
      en: 'The fifteenth Tirthankar. He established the true path of Dharma.',
      hi: 'पंद्रहवें तीर्थंकर। उन्होंने धर्म के सच्चे मार्ग की स्थापना की।'
    },
    symbol: { en: 'Vajra', hi: 'वज्र' },
    color: 'Golden'
  },
  {
    id: '16',
    name: { en: 'Shantinath', hi: 'शान्तिनाथ' },
    kaal: 'Present',
    details: {
      en: 'The sixteenth Tirthankar. He was also a Chakravartin (Universal Monarch).',
      hi: 'सोलहवें तीर्थंकर। वे एक चक्रवर्ती (सार्वभौमिक सम्राट) भी थे।'
    },
    symbol: { en: 'Deer', hi: 'हिरण' },
    color: 'Golden'
  },
  {
    id: '17',
    name: { en: 'Kunthunath', hi: 'कुन्थुनाथ' },
    kaal: 'Present',
    details: {
      en: 'The seventeenth Tirthankar. He was also a Chakravartin.',
      hi: 'सत्रहवें तीर्थंकर। वे भी एक चक्रवर्ती थे।'
    },
    symbol: { en: 'Goat', hi: 'बकरा' },
    color: 'Golden'
  },
  {
    id: '18',
    name: { en: 'Aranath', hi: 'अरनाथ' },
    kaal: 'Present',
    details: {
      en: 'The eighteenth Tirthankar. He was also a Chakravartin.',
      hi: 'अठारहवें तीर्थंकर। वे भी एक चक्रवर्ती थे।'
    },
    symbol: { en: 'Nandyavarta', hi: 'नंद्यावर्त' },
    color: 'Golden'
  },
  {
    id: '19',
    name: { en: 'Mallinath', hi: 'मल्लिनाथ' },
    kaal: 'Present',
    details: {
      en: 'The nineteenth Tirthankar. According to Shvetambara tradition, Mallinath was a woman.',
      hi: 'उन्नीसवें तीर्थंकर। श्वेतांबर परंपरा के अनुसार, मल्लिनाथ एक महिला थीं।'
    },
    symbol: { en: 'Kalasha', hi: 'कलश' },
    color: 'Blue'
  },
  {
    id: '20',
    name: { en: 'Munisuvratnath', hi: 'मुनिसुव्रतनाथ' },
    kaal: 'Present',
    details: {
      en: 'The twentieth Tirthankar. He is considered the contemporary of Lord Rama.',
      hi: 'बीसवें तीर्थंकर। उन्हें भगवान राम का समकालीन माना जाता है।'
    },
    symbol: { en: 'Tortoise', hi: 'कछुआ' },
    color: 'Black'
  },
  {
    id: '21',
    name: { en: 'Naminath', hi: 'नमिनाथ' },
    kaal: 'Present',
    details: {
      en: 'The twenty-first Tirthankar. He was born in Mithila.',
      hi: 'इक्कीसवें तीर्थंकर। उनका जन्म मिथिला में हुआ था।'
    },
    symbol: { en: 'Blue Lotus', hi: 'नीलकमल' },
    color: 'Golden'
  },
  {
    id: '22',
    name: { en: 'Neminath', hi: 'नेमिनाथ' },
    kaal: 'Present',
    details: {
      en: 'The twenty-second Tirthankar. He was a cousin of Lord Krishna.',
      hi: 'बाईसवें तीर्थंकर। वे भगवान कृष्ण के चचेरे भाई थे।'
    },
    symbol: { en: 'Conch', hi: 'शंख' },
    color: 'Black'
  },
  {
    id: '23',
    name: { en: 'Parshvanath', hi: 'पार्श्वनाथ' },
    kaal: 'Present',
    details: {
      en: 'The twenty-third Tirthankar. He lived 250 years before Mahavira.',
      hi: 'तेईसवें तीर्थंकर। वे महावीर से 250 वर्ष पहले जीवित थे।'
    },
    symbol: { en: 'Serpent', hi: 'सर्प' },
    color: 'Blue'
  },
  {
    id: '24',
    name: { en: 'Mahavira', hi: 'महावीर' },
    kaal: 'Present',
    details: {
      en: 'The 24th and last Tirthankar of the current era. He emphasized non-violence (Ahimsa) and spiritual liberation.',
      hi: 'वर्तमान युग के 24वें और अंतिम तीर्थंकर। उन्होंने अहिंसा और आध्यात्मिक मुक्ति पर जोर दिया।'
    },
    symbol: { en: 'Lion', hi: 'सिंह' },
    color: 'Golden'
  },

  // Past Era (Chauvisi)
  {
    id: 'P1',
    name: { en: 'Nirvan', hi: 'निर्वाण' },
    kaal: 'Past',
    details: {
      en: 'The first Tirthankar of the past era.',
      hi: 'पिछले युग के पहले तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P2',
    name: { en: 'Sagar', hi: 'सागर' },
    kaal: 'Past',
    details: {
      en: 'The second Tirthankar of the past era.',
      hi: 'पिछले युग के दूसरे तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P3',
    name: { en: 'Mahasagar', hi: 'महासागर' },
    kaal: 'Past',
    details: {
      en: 'The third Tirthankar of the past era.',
      hi: 'पिछले युग के तीसरे तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P4',
    name: { en: 'Vimalprabha', hi: 'विमलप्रभ' },
    kaal: 'Past',
    details: {
      en: 'The fourth Tirthankar of the past era.',
      hi: 'पिछले युग के चौथे तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P24',
    name: { en: 'Antah', hi: 'अंतः' },
    kaal: 'Past',
    details: {
      en: 'The 24th Tirthankar of the past era.',
      hi: 'पिछले युग के 24वें तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },

  // Future Era (Chauvisi)
  {
    id: 'F1',
    name: { en: 'Padmanabha', hi: 'पद्मनाभ' },
    kaal: 'Future',
    details: {
      en: 'The first Tirthankar of the future era (Soul of King Shrenik).',
      hi: 'आने वाले युग के पहले तीर्थंकर (राजा श्रेणिक की आत्मा)।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F2',
    name: { en: 'Surdev', hi: 'सुरदेव' },
    kaal: 'Future',
    details: {
      en: 'The second Tirthankar of the future era (Soul of Mahavira\'s uncle Suparshva).',
      hi: 'आने वाले युग के दूसरे तीर्थंकर (महावीर के चाचा सुपार्श्व की आत्मा)।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F3',
    name: { en: 'Suparshva', hi: 'सुपार्श्व' },
    kaal: 'Future',
    details: {
      en: 'The third Tirthankar of the future era (Soul of King Konika).',
      hi: 'आने वाले युग के तीसरे तीर्थंकर (राजा कोणिक की आत्मा)।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F4',
    name: { en: 'Svayamprabha', hi: 'स्वयंप्रभ' },
    kaal: 'Future',
    details: {
      en: 'The fourth Tirthankar of the future era.',
      hi: 'आने वाले युग के चौथे तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F24',
    name: { en: 'Bhadrakirti', hi: 'भद्रकीर्ति' },
    kaal: 'Future',
    details: {
      en: 'The 24th Tirthankar of the future era.',
      hi: 'आने वाले युग के 24वें तीर्थंकर।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  }
];
