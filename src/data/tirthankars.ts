export interface Tirthankar {
  id: string;
  name: { en: string; hi: string };
  kaal: 'Past' | 'Present' | 'Future' | 'Videh';
  details: { en: string; hi: string };
  symbol: { en: string; hi: string };
  color: string;
  number?: number;
  image?: string;
}

// Full array of Tirthankaras across all eras with correct symbols, numbers, names, and images
export const tirthankarData: Tirthankar[] = [
  // ==================== PRESENT ERA (24) ====================
  {
    id: '1',
    number: 1,
    name: { en: 'Rishabhdev (Adinath)', hi: 'ऋषभदेव (आदिनाथ)' },
    kaal: 'Present',
    symbol: { en: 'Bull / वृषभ', hi: 'बैल' },
    color: 'Golden',
    image: 'https://i.ibb.co/B20V9MYM/IMG-20250907-213554.jpg',
    details: {
      en: 'The first Tirthankar of the current Avasarpini era. Born in Ayodhya to King Nabhi Raja and Queen Marudevi. He ruled for millions of years, introducing the six main arts (Shatkarma) of physical livelihood, including agriculture, reading/writing, and defense, transforming humans into a civilized society. He renounced his kingdom to practice self-realization and underwent intense penance. He had 100 sons, including Emperor Bharata (after whom India, "Bharatvarsha", is named) and the great ascetic Lord Bahubali. He attained Nirvana at Mount Ashtapada.',
      hi: 'प्रथम तीर्थंकर आदिनाथ को ऋषभनाथ भी कहा जाता है और हिंदू इन्हें वृषभनाथ कहते हैं। आपके पिता का नाम राजा नाभिराज था और माता का नाम मरुदेवी था। आपका जन्म चैत्र कृष्ण पक्ष की नवमी को अयोध्या में हुआ। चैत्र माह के कृष्ण पक्ष की नवमी को आपने दीक्षा ग्रहण की तथा फाल्गुन कृष्ण पक्ष की एकादशी के दिन आपको कैवल्य की प्राप्ती हुई। कैलाश पर्वत क्षेत्र के अष्टापद में आपको माघ कृष्ण चौदस को निर्वाण प्राप्त हुआ।'
    }
  },
  {
    id: '2',
    number: 2,
    name: { en: 'Ajitnath', hi: 'अजितनाथ' },
    kaal: 'Present',
    symbol: { en: 'Elephant / गज', hi: 'हाथी' },
    color: 'Golden',
    image: 'https://i.ibb.co/s94SpnyV/IMG-20250907-213629.jpg',
    details: {
      en: 'The second Tirthankar of the present era. Born in Ayodhya to King Jitasatru and Queen Vijaya Devi. His name means "The Invincible One," reflecting his absolute conquest over all inner desires, attachment, and external spiritual obstacles. He spent thousands of years in spiritual contemplation, establishing the second great Tirtha assembly of monks. He attained Nirvana at the holy mount of Sammed Shikharji.',
      hi: 'द्वितीय तीर्थंकर अजितनाथ का जन्म अयोध्या नगरी के इक्ष्वाकु वंश के राजा जितशत्रु और माता विजयादेवी के गृह में माघ शुक्ल दशमी को हुआ। आपकी काया कंचन के समान कान्तिमान स्वरूप वाली थी। आपने राग-द्वेष और वासनाओं पर पूर्ण और अजेय विजय प्राप्त की, इसी कारण आपका मंगल नाम अजितनाथ हुआ। सम्मेद शिखरजी पर्वत से आपका कल्याणमय निर्वाण हुआ।'
    }
  },
  {
    id: '3',
    number: 3,
    name: { en: 'Sambhavnath', hi: 'संभवनाथ' },
    kaal: 'Present',
    symbol: { en: 'Horse / अश्व', hi: 'घोड़ा' },
    color: 'Golden',
    image: 'https://i.ibb.co/5XN7Sjbn/IMG-20250907-213713.jpg',
    details: {
      en: 'The third Tirthankar. Born in Shravasti to King Jitari and Queen Sena Devi. His birth brought a miraculous abundance of crops and end of social distress, which is why he was named Sambhavnath ("One who makes goodness possible"). He ruled with compassion, eventually embraced monkhood on Kartika Krisna Trayodashi, and attained omniscience (Kevala Jnana) under a Sal tree. He attained Moksha at Sammed Shikharji.',
      hi: 'तृतीय तीर्थंकर संभवनाथ स्वामी का जन्म श्रावस्ती नगरी के महाराज जितारि और महारानी सेनादेवी के यहाँ कार्तिक शुक्ल द्वितीया को हुआ। आपके अवतरण से सर्वत्र उत्तम धान्य समृद्धि और शुभ क्रियाशीलता का सुखद उदय हुआ। वैराग्य की पावन भावना जाग्रत होने पर आपने सम्मेद शिखरजी की पुण्य धरा से निर्वाण प्राप्त कर परम अमर पद पाया।'
    }
  },
  {
    id: '4',
    number: 4,
    name: { en: 'Abhinandannath', hi: 'अभिनंदननाथ' },
    kaal: 'Present',
    symbol: { en: 'Monkey / कपि', hi: 'बंदर' },
    color: 'Golden',
    image: 'https://i.ibb.co/4x5d6xL/IMG-20250907-213742.jpg',
    details: {
      en: 'The fourth Tirthankar. Born in Ayodhya to King Sanvara and Queen Siddhartha Devi. His name implies the one who is greeted by both humans and gods because of his extreme purity of soul. He successfully preached the virtues of mind control and equanimity. He attained final liberation at Sammed Shikharji accompanied by thousands of pure ascetics.',
      hi: 'चतुर्थ तीर्थंकर अभिनंदननाथ स्वामी का प्राकट्य अयोध्या के क्षत्रिय राजा संवर और माता सिद्धार्थदेवी के आँगन में माघ शुक्ल द्वितीया को हुआ। आपका अलौकिक आभामंडल देखकर स्वर्ग के देवों और धरा के समस्त जीवों ने अभिनन्दन किया। आत्मसंयम और वीतराग धर्म का महान मार्ग प्रशस्त करते हुए आपने सम्मेद शिखरजी से निर्वाण प्राप्त किया।'
    }
  },
  {
    id: '5',
    number: 5,
    name: { en: 'Sumatinath', hi: 'सुमतिनाथ' },
    kaal: 'Present',
    symbol: { en: 'Curlew / क्रौंच', hi: 'चकवा' },
    color: 'Golden',
    image: 'https://i.ibb.co/BH7mWdxs/IMG-20250907-213811.jpg',
    details: {
      en: 'The fifth Tirthankar. Born in Ayodhya to King Megha Raja and Queen Mangala Devi. His name denotes "The Lord of Pure Intellect." Even as a prince, he solved highly complex legal and moral disputes of the kingdom using cosmic wisdom. He taught that deep discriminative wisdom (Samyak Mati) is the primary gateway to true spiritual realization. He attained Nirvana at Sammed Shikharji.',
      hi: 'पंचम तीर्थंकर सुमतिनाथ का पावन जन्म अयोध्या के राजा मेघराज एवं माता मंगलादेवी के दिव्य गृह में वैशाख शुक्ल अष्टमी को हुआ। सुमति (पवित्र सुबुद्धि) के प्रदाता जिनेन्द्र देव ने सांसारिक अज्ञान को नष्ट करने का उत्तम उपदेश दिया। आत्म-विशुद्धि की कठिन तप आराधना के पश्चात् सम्मेद शिखरजी से आपका दिव्य मोक्ष गमन हुआ।'
    }
  },
  {
    id: '6',
    number: 6,
    name: { en: 'Padmaprabha', hi: 'पद्मप्रभ' },
    kaal: 'Present',
    symbol: { en: 'Red Lotus / पद्म', hi: 'लाल कमल' },
    color: 'Red',
    image: 'https://i.ibb.co/HLLMRYw3/IMG-20250907-213847.jpg',
    details: {
      en: 'The sixth Tirthankar. Born in Kausambi to King Dharana and Queen Susima Devi. Associated with the red lotus because of his mother’s wish to sleep on a bed of red lotuses during pregnancy. He represents deep devotion and soft, glowing, unattached mindfulness. His body shone like a fresh red lotus. He achieved omniscience and attained Nirvana at Sammed Shikharji.',
      hi: 'षष्ठम तीर्थंकर पद्मप्रभ स्वामी का जन्म कौशाम्बी के राजा धर और माता सुसीमादेवी के यहाँ कार्तिक कृष्ण द्वादशी को हुआ। माता को गर्भकाल में लाल कमलों की शय्या की अभिलाषा थी एवं प्रभु का वर्ण भी लाल कमल सदृश कांतिमान था। कमल की भांति संसार रूपी कीचड़ से पूर्णतः निर्लेप रहने की शिक्षा देकर आप सम्मेद शिखरजी से मोक्ष पधारे।'
    }
  },
  {
    id: '7',
    number: 7,
    name: { en: 'Suparshvanath', hi: 'सुपार्श्वनाथ' },
    kaal: 'Present',
    symbol: { en: 'Swastika / स्वास्तिक', hi: 'स्वास्तिक' },
    color: 'Golden',
    image: 'https://i.ibb.co/W412zy8q/IMG-20250907-214059.jpg',
    details: {
      en: 'The seventh Tirthankar. Born in Varanasi to King Pratishtha and Queen Prithvi Devi. His head was protected by a symbolic canopy of multi-hooded serpents. His name reflects his supreme protective nature and unmatched inner tranquility. He spent years in deep penance to clean all residual karmas, attaining Moksha at Sammed Shikharji.',
      hi: 'सप्तम तीर्थंकर सुपार्श्वनाथ प्रभु का अवतरण वाराणसी के राजा प्रतिष्ठित और माता पृथ्वीदेवी के आँगन में ज्येष्ठ शुक्ल द्वादशी को हुआ। इनके भाल पर जन्म से ही सर्पफणों का प्राकृतिक छत्र सुशोभित था, जो उनकी रक्षक प्रकृति को दर्शाता है। संपूर्ण आर्यावर्त को अहिंसा का मर्म समझाकर उन्होंने सिद्ध क्षेत्र सम्मेद शिखरजी से मुक्ति पाई।'
    }
  },
  {
    id: '8',
    number: 8,
    name: { en: 'Chandraprabha', hi: 'चंद्रप्रभ' },
    kaal: 'Present',
    symbol: { en: 'Moon / चन्द्र', hi: 'चंद्रमा' },
    color: 'White',
    image: 'https://i.ibb.co/934Gcq1R/IMG-20250907-214116.jpg',
    details: {
      en: 'The eighth Tirthankar. Born in Chandrapuri to King Mahasena and Queen Lakshmana Devi. His body had a serene silver of the moon, and his birth brought unprecedented calmness and cooling environment in the entire country, which was plagued by warm droughts. He taught the importance of cooling the flames of anger and ego. He attained Moksha at Sammed Shikharji.',
      hi: 'अष्टम तीर्थंकर चंद्रप्रभ स्वामी का जन्म चंद्रपुरी के महाराजा महासेन और महारानी लक्ष्मणादेवी के यहाँ पौष कृष्ण एकादशी को हुआ। आपका शरीर पूर्ण चंद्रमा के समान शीतल और अति उज्ज्वल श्वेत वर्णी था। इंद्रिय कषाय के तप्त संताप को शांत कर आपने सुधा मार्ग निरूपित किया। सम्मेद शिखरजी पर्वत से आपका निर्वाण कल्याणक संपन्न हुआ।'
    }
  },
  {
    id: '9',
    number: 9,
    name: { en: 'Pushpadant', hi: 'पुष्पदंत' },
    kaal: 'Present',
    symbol: { en: 'Crocodile / मगर', hi: 'मगरमच्छ' },
    color: 'White',
    image: 'https://i.ibb.co/vxH7JmJY/IMG-20250907-214139.jpg',
    details: {
      en: 'The ninth Tirthankar. Born in Kakandi to King Sugriva and Queen Rama Devi. Highly revered for systemizing the daily moral conduct and duties (Suvidhi) of both monk and household life. Because of his sparkling, tooth-like speech purity, he was named Pushpadanta. He obtained final liberation after high penance at Sammed Shikharji.',
      hi: 'नवम तीर्थंकर पुष्पदंत (जिन्हें सुविधिनाथ भी कहा जाता है) का जन्म काकंदी के राजा सुग्रीव और माता रामादेवी के यहाँ मार्गशीर्ष कृष्ण द्वितीया को हुआ। गृहस्थ तथा मुनियों के आचरण की उत्तम मर्यादा एवं "सुविधि" का पुनः प्रवर्तन करने के कारण आप विख्यात हुए। कठिन तपस्या के उपरांत सम्मेद शिखरजी की पुण्यभूमि से सिद्ध पद पाया।'
    }
  },
  {
    id: '10',
    number: 10,
    name: { en: 'Sheetalnath', hi: 'शीतलनाथ' },
    kaal: 'Present',
    symbol: { en: 'Shrivatsa / श्रीवत्स', hi: 'श्रीवत्स चिह्न (कल्पवृक्ष)' },
    color: 'Golden',
    image: 'https://i.ibb.co/Mx4DxmhD/IMG-20250907-214157.jpg',
    details: {
      en: 'The tenth Tirthankar. Born in Bhaddilpura to King Dridharatha and Queen Sunanda Devi. Legend says his touch brought cooling comfort and instantly cured people of raging physical fevers. He preached the path of deep cooling of the soul (Vitaragata) from the toxic heat of worldly passions. He attained Moksha at Sammed Shikharji.',
      hi: 'दशम तीर्थंकर शीतलनाथ स्वामी का जन्म भद्दिलपुर नगरी के राजा दृढ़रथ और माता सुनंदादेवी के गृह में माघ कृष्ण द्वादशी को हुआ। इनके गर्भकाल से ही प्रजा के सभी दाहक रोग शांत हो गए थे। संसारी जीवों को कषायों की तपिश से मुक्त कर आत्म-शांति का मार्ग बताने के पश्चात सम्मेद शिखरजी से मोक्ष प्राप्त किया।'
    }
  },
  {
    id: '11',
    number: 11,
    name: { en: 'Shreyansnath', hi: 'श्रेयांसनाथ' },
    kaal: 'Present',
    symbol: { en: 'Rhinoceros / खड्ग', hi: 'गेंडा' },
    color: 'Golden',
    image: 'https://i.ibb.co/WN0FxvgJ/IMG-20250907-214233.jpg',
    details: {
      en: 'The eleventh Tirthankar. Born in Simhapuri (modern Sarnath near Varanasi) to King Vishnu Raja and Queen Vishnu Devi. His aura represents complete spiritual progress and wellbeing (Shreyas). He attained omniscience under a Tumbara tree, preaching against cosmic ignorance. He attained Nirvana at Sammed Shikharji.',
      hi: 'ग्यारहवें तीर्थंकर श्रेयांसनाथ का पावन जन्म सिंहपुरी (काशी निकट) के राजा विष्णु और माता विष्णुदेवी के महापुण्य आँगन में फाल्गुन कृष्ण एकादशी को हुआ। "श्रेयांस" का अर्थ है सर्वकल्याण कारी आत्मसुधार। सांसारिक कषाय चक्र से भ्रमित भव्य जीवों को सन्मार्ग की देशना देकर सम्मेद शिखरजी से महान मोक्ष पाया।'
    }
  },
  {
    id: '12',
    number: 12,
    name: { en: 'Vasupujya', hi: 'वासुपूज्य' },
    kaal: 'Present',
    symbol: { en: 'Buffalo / महिष', hi: 'भैंसा' },
    color: 'Red',
    image: 'https://i.ibb.co/21CQDyr5/IMG-20250907-214252.jpg',
    details: {
      en: 'The twelfth Tirthankar. Born in Champapuri to King Vasupujya and Queen Jaya Devi. He is highly unique for refusing marriage and royalty from his youth, choosing lifelong celibacy and monkhood. His entire life-cycle of five auspicious events (Panch Kalyanaks) occurred in the single holy city of Champapuri, where he also attained his final Moksha. He rejected all worldly wealth (Vasu).',
      hi: 'बारहवें तीर्थंकर वासुपूज्य स्वामी बाल ब्रह्मचारी और परम तपस्वी थे। आपका जन्म चम्पापुर के राजा वासुपूज्य और माता जयादेवी के यहाँ फाल्गुन कृष्ण चतुर्दशी को हुआ। राजपद और वैवाहिक ऐश्वर्य को यौवनकाल में ही ठुकरा कर प्रभु ने चम्पापुर की धरा पर ही तपस्या कर वहीं से निर्वाण पाया। आपके पांचों कल्याणक इसी पावन भूमि पर हुए।'
    }
  },
  {
    id: '13',
    number: 13,
    name: { en: 'Vimalnath', hi: 'विमलनाथ' },
    kaal: 'Present',
    symbol: { en: 'Boar / वराह', hi: 'सूअर' },
    color: 'Golden',
    image: 'https://i.ibb.co/2YWpnjHr/IMG-20250907-214312.jpg',
    details: {
      en: 'The thirteenth Tirthankar. Born in Kampilaji (modern Kampilya) to King Kritavarman and Queen Syama Devi. His name denotes "Flawless Purity of Spirit and Intellect". He spent many years teaching the dynamic purification of thought, speech, and action. He attained Nirvana at Sammed Shikharji.',
      hi: 'तेरहवें तीर्थंकर विमलनाथ का अवतरण कंपिला नगरी के राजा कृतवर्मा और माता श्यामादेवी के पवित्र गृह में माघ शुक्ल चतुर्थी को हुआ। "विमल" का अर्थ है कर्म रहित परम निर्मल विशुद्धि। मन, वचन और काय की त्रिवेणी शुद्धि का मार्ग उद्घाटित कर प्रभु ने सम्मेद शिखरजी से मोक्ष साम्राज्य प्राप्त किया।'
    }
  },
  {
    id: '14',
    number: 14,
    name: { en: 'Anantnath', hi: 'अनंतनाथ' },
    kaal: 'Present',
    symbol: { en: 'Falcon / श्येन', hi: 'बाज' },
    color: 'Golden',
    image: 'https://i.ibb.co/RkNQmmGZ/IMG-20250907-214334.jpg',
    details: {
      en: 'The fourteenth Tirthankar. Born in Ayodhya to King Simhasena and Queen Suyasa Devi. His birth unleashed infinite spiritual wisdom and energy in the universe. He spent countless hours in silent meditation, successfully destroying deep root-karmas which bind spirits to rebirths. He attained final liberation at Sammed Shikharji.',
      hi: 'चौदहवें तीर्थंकर अनंतनाथ स्वामी का जन्म अयोध्या के महाराजा सिंहसेन और माता सुयशादेवी के यहाँ वैशाख कृष्ण त्रयोदशी को हुआ। अनंत आत्मशक्तियों का रहस्य उजागर करने वाले कल्याणकारी जिनेन्द्र देव ने सांसारिक कषाय बन्धन को छिन्न-भिन्न करने की अनुपम दीक्षा दी और सम्मेद शिखरजी से मोक्ष पधारे।'
    }
  },
  {
    id: '15',
    number: 15,
    name: { en: 'Dharmanath', hi: 'धर्मनाथ' },
    kaal: 'Present',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र वज्रदंड' },
    color: 'Golden',
    image: 'https://i.ibb.co/0RnzKF6v/IMG-20250907-214355.jpg',
    details: {
      en: 'The fifteenth Tirthankar. Born in Ratnapuri to King Bhanu Raja and Queen Suvrata Devi. He focused heavily on the expansion of true religion (Dharma) based on compassion, logical inquiry, and non-violence. He clarified the ten main characteristics of religion (Dashalaksana Dharma). He attained Moksha at Sammed Shikharji.',
      hi: 'पंद्रहवें तीर्थंकर धर्मनाथ स्वामी का पावन प्राकट्य रत्नपुरी के राजा भानुराज और माता सुव्रतादेवी के निमित्त माघ शुक्ल तृतीया को हुआ। धर्मनाथ प्रभु ने दशलक्षण धर्म (उत्तम क्षमा, मार्दव, आर्जव, शौच आदि) की अमूल्य विवेचना प्रस्तुत की। धर्मचक्र का प्रवर्तन कर सम्मेद शिखरजी से वीतराग अवस्था पाकर निर्विकार मोक्ष पाया।'
    }
  },
  {
    id: '16',
    number: 16,
    name: { en: 'Shantinath', hi: 'शांतिनाथ' },
    kaal: 'Present',
    symbol: { en: 'Deer / मृग', hi: 'हिरण' },
    color: 'Golden',
    image: 'https://i.ibb.co/d0kJ9nq8/IMG-20250907-214410.jpg',
    details: {
      en: 'The sixteenth Tirthankar, who also held the magnificent high titles of a Chakravartin (World Sovereign Ruler) and Kamadeva (person of supreme beauty). Born in Hastinapur to King Visvasena and Queen Achira Devi. He successfully reconciled warring nations and brought universal peace (Shanti) to a distressed earth. He is worshiped for protection and global peace. He attained Nirvana at Sammed Shikharji.',
      hi: 'सोलहवें तीर्थंकर शांतिनाथ हस्तिनापुर के प्रतिष्ठित राजा विश्वसेन और माता अचिरादेवी के यशस्वी पुत्र थे, जो चक्रवर्ती सम्राट और कामदेव पद के भी धारी थे। आपका जन्म ज्येष्ठ कृष्ण चतुर्दशी को हुआ। समस्त चराचर जगत को शांति का पाठ पढ़ाकर एवं युद्ध उन्माद विनिष्ट कर आपने सम्मेद शिखरजी से महामोक्ष प्राप्त किया।'
    }
  },
  {
    id: '17',
    number: 17,
    name: { en: 'Kunthunath', hi: 'कुंथुनाथ' },
    kaal: 'Present',
    symbol: { en: 'Goat / अज', hi: 'बकरा' },
    color: 'Golden',
    image: 'https://i.ibb.co/27pWGmSc/IMG-20250907-214424.jpg',
    details: {
      en: 'The seventeenth Tirthankar and also a Chakravartin. Born in Hastinapur to King Sura Raja and Queen Shridevi. He initiated monumental social reforms, ending the slaughter of animals for sacrificial food and promoting universal vegetarianism in kingdoms. He attained final liberation at Sammed Shikharji.',
      hi: 'सत्रहवें तीर्थंकर कुंथुनाथ स्वामी हस्तिनापुर के द्वितीय जैन चक्रवर्ती सम्राट थे। आपका जन्म वैशाख शुक्ल प्रतिपदा को राजा सूर्यसेन और माता श्रीदेवी के पावन महल में हुआ। जीवहिंसा और संकीर्ण कुप्रथाओं को अपनी अद्भुत धर्मसभा से निरुत्साहित कर मोक्ष मार्ग दृढ़ किया और सम्मेद शिखरजी से निर्वाण प्राप्त किया।'
    }
  },
  {
    id: '18',
    number: 18,
    name: { en: 'Aranath', hi: 'अरनाथ' },
    kaal: 'Present',
    symbol: { en: 'Nandyavarta / नंद्यावर्त', hi: 'नंद्यावर्त' },
    color: 'Golden',
    image: 'https://i.ibb.co/YTX7Ztyf/IMG-20250907-214835.jpg',
    details: {
      en: 'The eighteenth Tirthankar and a Chakravartin monarch. Born in Hastinapur to King Sudarsana and Queen Devi. He taught that even a sovereign ruler of six continents remains a servant of his desires until he surrenders worldly pursuits for self-realization. He attained Nirvana at Sammed Shikharji.',
      hi: 'अठारहवें तीर्थंकर अरनाथ स्वामी हस्तिनापुर के तृतीय चक्रवर्ती सम्राट थे। आपका जन्म मार्गशीर्ष शुक्ल दशमी को राजा सुदर्शन और माता महादेवी के यहाँ हुआ। अनंत ऐश्वर्य और राज वैभव तिनके के समान त्याग कर दिगंबर मुद्रा धारी बन आत्म ध्यान में लीन हो गए और सम्मेद शिखरजी से शाश्वत मोक्ष पद प्राप्त किया।'
    }
  },
  {
    id: '19',
    number: 19,
    name: { en: 'Mallinath', hi: 'मल्लिनाथ' },
    kaal: 'Present',
    symbol: { en: 'Kalasha / कलश', hi: 'कलश' },
    color: 'Blue',
    image: 'https://i.ibb.co/CSzWHVB/IMG-20250907-214857.jpg',
    details: {
      en: 'The nineteenth Tirthankar. Born in Mithila to King Kumbha and Queen Prabhavati Devi. Highly unique for his extreme spiritual intelligence and stunning external beauty. According to the Svetambara tradition, Mallinath was a female princess who chose the path of ascetic restraint, showing the high spiritual status of motherhood and femininity in the cosmos. In the Digambara tradition, he represents the natural ascetic yogi. He attained Nirvana at Sammed Shikharji.',
      hi: 'उन्नीसवें तीर्थंकर मल्लिनाथ का जन्म मिथिला नगरी के राजा कुंभराज और माता प्रभावतीदेवी के आँगन में मार्गशीर्ष शुक्ल एकादशी को हुआ। निष्कलंक चारित्र निष्ठा के कारण आपका प्रतीक कलश सुसज्जित हुआ। राग-मोह और मायाचारी रूपी बंधनों को काट वीतराग योग धारण कर आपने सम्मेद शिखरजी से निर्वाण पाया।'
    }
  },
  {
    id: '20',
    number: 20,
    name: { en: 'Munisuvratnath', hi: 'मुनिसुव्रतनाथ' },
    kaal: 'Present',
    symbol: { en: 'Tortoise / कूर्म', hi: 'कछुआ' },
    color: 'Black',
    image: 'https://i.ibb.co/v4L77L7N/IMG-20250907-214912.jpg',
    details: {
      en: 'The twentieth Tirthankar of the present era. Born in Rajgriha to King Sumitra and Queen Padmavati Devi. Highly venerated as the contemporary saint of the Ramayana era; Lord Rama was a contemporary of Lord Munisuvratnath. His name indicates the one who practices perfect silence and highly dedicated vows (Vratas). He is sought for astrological peace from the negative planetary effect of Saturn (Shani). He attained Nirvana at Sammed Shikharji.',
      hi: 'बीसवें तीर्थंकर मुनिसुव्रतनाथ स्वामी का प्राकट्य राजगृह के राजा सुमित्र और माता पद्मावतीदेवी के निमित्त ज्येष्ठ कृष्ण दशमी को हुआ। मुनियों की भांति कठोर मौन व्रत और संयम नियमों का दृढ़तापूर्वक पालन करने के कारण आपका नाम मुनिसुव्रतनाथ हुआ। शनि देव के क्रूर प्रभाव को दूर करने के लिए आपकी आराधना अति फलदायी है। निर्वाण क्षेत्र: सम्मेद शिखरजी।'
    }
  },
  {
    id: '21',
    number: 21,
    name: { en: 'Naminath', hi: 'नमिनाथ' },
    kaal: 'Present',
    symbol: { en: 'Blue Lotus / नीलकमल', hi: 'नीलकमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/N6wK770f/IMG-20250907-214926.jpg',
    details: {
      en: 'The twenty-first Tirthankar. Born in Mithila to King Vijaya and Queen Vapra Devi. Legend says when his mother was pregnant, her calm energy instantly subdued a raging rebellion on the borders without shedding a single drop of blood, hence named Nami ("One whose presence causes all enemies to bow down"). He attained Moksha at Sammed Shikharji.',
      hi: 'इक्कीसवें तीर्थंकर नमिनाथ का प्रादुर्भाव मिथिला नगरी के राजा विजय और माता वप्रादेवी के गृह आषाढ़ कृष्ण द्वितीया को हुआ। इनके गर्भावतरण काल में सीमांत विद्रोह बिना रक्त बहाए शत्रुओं के मस्तक झुकने से शांत हुआ, अतः इनका नाम नमिनाथ विख्यात हुआ। सम्मेद शिखरजी की शिखर चोटी से आपने सिद्धि पद पाया।'
    }
  },
  {
    id: '22',
    number: 22,
    name: { en: 'Neminath', hi: 'नेमिनाथ' },
    kaal: 'Present',
    symbol: { en: 'Conch / शंख', hi: 'शंख' },
    color: 'Black',
    image: 'https://i.ibb.co/PG43F4HT/IMG-20250907-214941.jpg',
    details: {
      en: 'The twenty-second Tirthankar. Born in Dwaraka to King Samudravijaya and Queen Shiva Devi. He is the biological cousin of Lord Krishna, the ruler of Dwaraka. When Lord Neminath was driving his chariot to marry Princess Rajul, he heard the terrifying screams of thousands of animals locked in cages destined to be slaughtered for the wedding feast. Moved by supreme compassion (Karuna), he instantly turned his chariot back, abandoned the wedding, took initiation of Digambara monkhood, and went to Mount Girnar where he practiced extreme dhyana. Princess Rajul also became a nun. He attained omniscience and final Nirvana at Mount Girnar.',
      hi: 'बाईसवें तीर्थंकर नेमिनाथ द्वारका के राजा समुद्रविजय के ज्येष्ठ पुत्र और भगवान श्रीकृष्ण के सगे चचेरे भ्राता थे। आपका जन्म श्रावण कृष्ण षष्ठी को हुआ। राजमती से विवाह हेतु जाते समय पशुशाला में मूक पशुओं की करुण चीख सुन दया से द्रवित होकर आपने गिरनार के वनों में जाकर दीक्षा ग्रहण की और गिरनार पर्वत की पंचम टोंक से मोक्ष पधारे।'
    }
  },
  {
    id: '23',
    number: 23,
    name: { en: 'Parshvanath', hi: 'पार्श्वनाथ' },
    kaal: 'Present',
    symbol: { en: 'Serpent / सर्प', hi: 'सर्प' },
    color: 'Blue',
    image: 'https://i.ibb.co/35J6gQ3T/IMG-20250907-214954.jpg',
    details: {
      en: 'The twenty-third Tirthankar, who is highly praised as a historic savior. Born in Varanasi to King Asvasena and Queen Vama Devi. He saved a boiling serpent (Nag) trapped inside firewood by a corrupt ascetic named Kamath, reciting the sacred Navkar Mantra to the dying snake (who was reborn as King of Serpents, Dharanendra). Later, when Kamath (reborn as demon Samvara) attacked Parshvanath with horrific rock rains during his penance, Dharanendra spread a great multi-headed serpent hood to shelter the Lord. His legacy of establishing the four-fold path of restraint is globally recognized. He attained Nirvana at Sammed Shikharji atop the beautiful Parasnath Peak.',
      hi: 'तेईसवें तीर्थंकर पार्श्वनाथ महाराज काशीराज अश्वसेन और माता वामादेवी के पुत्र थे। आपका जन्म पौष कृष्ण एकादशी को वाराणसी में हुआ। आपने तापस कमठ द्वारा जलाए जा रहे नाग युगल की रक्षा की, जिन्हें मरणासन्न अवस्था में णमोकार महामंत्र सुनाकर धरणेन्द्र व पद्मावती के सुखद देव स्वरूप का कारण बनाया। सम्मेद शिखरजी के पारस शिखर से निर्वाण पाया।'
    }
  },
  {
    id: '24',
    number: 24,
    name: { en: 'Mahavir Swami', hi: 'महावीर स्वामी' },
    kaal: 'Present',
    symbol: { en: 'Lion / सिंह', hi: 'सिंह' },
    color: 'Golden',
    image: 'https://i.ibb.co/q3bxh7kY/IMG-20250907-215010.jpg',
    details: {
      en: 'The 24th and final Tirthankar of the current era. Born in Kundalpur (Bihar) to King Siddhartha and Queen Trishala Devi in 599 BCE. Renouncing crown, riches, and familial bonds, he entered deep asceticism at age 30, practicing absolute non-possession and enduring horrific physical abuses with unshakeable equanimity. He attained omniscience (Kevala Jnana) under a Sal tree. He spread the ultimate gospel of Ahimsa (Non-violence) and Anekantavada (multi-faceted logic), revolutionizing modern thought. He added the fifth vow of Brahmacharya (Celibacy) and attained Nirvana at Pawapuri, Bihar, in 527 BCE.',
      hi: '२४वें अंतिम तीर्थंकर महावीर स्वामी (वर्धमान) का जन्म कुण्डलपुर (बिहार) के महाराजा सिद्धार्थ और माता त्रिशला देवी के आँगन चैत्र शुक्ल त्रयोदशी को हुआ। ३० वर्ष की आयु में राजभोग त्याग कर दिगंबर तप धारण किया और चंडकौशिक डंस, कानों में कीलन जैसे उपसर्ग समतापूर्वक झेले। पावापुरी नगरी के जल मंदिर से दीपावली पर्व को मोक्ष प्राप्त किया।'
    }
  },

  // ==================== PAST ERA (24) ====================
  {
    id: 'P1',
    number: 1,
    name: { en: 'Shri Nirvan', hi: 'श्री निर्वाण' },
    kaal: 'Past',
    symbol: { en: 'Elephant / गज', hi: 'हाथी' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The first Tirthankar of the past cosmic era. He set the foundation of spiritual discipline and preached the principles of Right Faith, Knowledge, and Conduct in the previous Avasarpini cycle.',
      hi: 'अतीत काल के प्रथम तीर्थंकर श्री निर्वाणजी ने अनंत काल पूर्व धर्म संघ की स्थापना की तथा प्रथम भव्य आत्माओं को आत्मिक सम्यक रत्नत्रय की पावन देशना से विभूषित किया।'
    }
  },
  {
    id: 'P2',
    number: 2,
    name: { en: 'Shri Sagar', hi: 'श्री सागर' },
    kaal: 'Past',
    symbol: { en: 'Ocean / सागर', hi: 'सागर' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The second Tirthankar of the past era. His vast spiritual knowledge was compared to the depth of the cosmic oceans, helping infinite souls cross the ocean of life and death.',
      hi: 'अतीत चौबीसी के द्वितीय तीर्थंकर श्री सागरजी का आचरण और प्रशांत अंतःकरण क्षीर सागर के समान विस्तीर्ण था। आपके भव्य उपदेशों से संसारी ताप सदा के लिए विलीन हुआ।'
    }
  },
  {
    id: 'P3',
    number: 3,
    name: { en: 'Shri Mahasagar', hi: 'श्री महासागर' },
    kaal: 'Past',
    symbol: { en: 'Great Ocean / महासागर', hi: 'महासागर' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The third Tirthankar of the past cosmic era. He established vast communities of pure monks, leading millions to spiritual liberation.',
      hi: 'अतीत युग के तृतीय तीर्थंकर श्री महासागर महाराज ने भव्य जीवों को आत्म ध्यान और अपरिग्रह का उत्कृष्ट उपदेश दिया तथा मोक्ष के लिए विशाल मुनि संघ का संचालन किया।'
    }
  },
  {
    id: 'P4',
    number: 4,
    name: { en: 'Shri Vimalprabh', hi: 'श्री विमलप्रभ' },
    kaal: 'Past',
    symbol: { en: 'Boar / वराह', hi: 'सूअर' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The fourth Tirthankar of the past era. Famous for his glowing, flawless halo (Prabha) which represented the absolute purity (Vimala) of his non-attached soul.',
      hi: 'चतुर्थ अतीत तीर्थंकर श्री विमलप्रभजी अपनी निष्कलंक काया और पूर्ण विमल (मैलापन रहित) आत्मिक आभामंडल के लिए प्रसिद्ध थे। आपने जीवों को अहिंसा का वास्तविक रहस्य समझाया।'
    }
  },
  {
    id: 'P5',
    number: 5,
    name: { en: 'Shri Shridhar', hi: 'श्री श्रीधर' },
    kaal: 'Past',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The fifth Tirthankar of the past era. Possessed supreme spiritual wealth (Shri) which he distributed freely through his divine sermons (Samavasarana).',
      hi: 'पंचम अतीत तीर्थंकर श्री श्रीधर स्वामी महान आध्यात्मिक संपत्ति और ऋद्धि के धारक थे। आपकी दिव्य देशना ने असंख्य भ्रमित आत्माओं को आत्मसंयम की अमृत दीक्षा प्रदान की।'
    }
  },
  {
    id: 'P6',
    number: 6,
    name: { en: 'Shri Sudatt', hi: 'श्री सुदत्त' },
    kaal: 'Past',
    symbol: { en: 'Lotus / पद्म', hi: 'कमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The sixth Tirthankar of the past era. Emphasized charity, self-discipline, and the supreme gift of non-fear (Abhayadan).',
      hi: 'षष्ठम अतीत तीर्थंकर श्री सुदत्तजी महाविशुद्ध पुरुष थे। आपने समस्त भव्य जीवों को भयमुक्त अहिंसक जीवन जीने तथा संसारी वासना का दान करने का मुख्य उपदेश दिया।'
    }
  },
  {
    id: 'P7',
    number: 7,
    name: { en: 'Shri Amalgun', hi: 'श्री अमलगुण' },
    kaal: 'Past',
    symbol: { en: 'Swastika / स्वास्तिक', hi: 'स्वास्तिक' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The seventh Tirthankar of the past era. He exemplified how to remain entirely spot-free (Amal) and gather the purest attributes (Guna) of the soul.',
      hi: 'सप्तम अतीत तीर्थंकर श्री अमलगुण स्वामी निष्कलंक गुणों के पुंज थे। वासना और मोह राग से परे रहने का आपका सिद्धांत आज भी आत्मा की स्वाभाविक शुद्धि का प्रमाण है।'
    }
  },
  {
    id: 'P8',
    number: 8,
    name: { en: 'Shri Uddhar', hi: 'श्री उद्धर' },
    kaal: 'Past',
    symbol: { en: 'Moon / चन्द्र', hi: 'चंद्रमा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The eighth Tirthankar of the past era. His divine presence acted as a pure vehicle of uplifting (Uddhara) for infinite suffering beings across the worlds.',
      hi: 'अष्टम अतीत तीर्थंकर श्री उद्धर देव ने संसार रूपी कीचड़ में आकंठ डूबे प्राणियों को मोक्ष मार्ग के उद्धार हेतु करुणावर्णी नाव की भांति पार उतारने का उपकार किया था।'
    }
  },
  {
    id: 'P9',
    number: 9,
    name: { en: 'Shri Angir', hi: 'श्री अङ्गिर' },
    kaal: 'Past',
    symbol: { en: 'Crocodile / मगर', hi: 'मगरमच्छ' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The ninth Tirthankar of the past era. A renowned teacher of absolute non-attachment to bodily pleasures and high mental concentration.',
      hi: 'नवम अतीत तीर्थंकर श्री अङ्गिरजी ने शरीर और भौतिक वासना के प्रति राग नष्ट करने तथा अंतरंग आत्मा में लीन होने की परम गुप्त वीतराग समाधि साधना सिखाई।'
    }
  },
  {
    id: 'P10',
    number: 10,
    name: { en: 'Shri Sanmati', hi: 'श्री सन्मति' },
    kaal: 'Past',
    symbol: { en: 'Shrivatsa / श्रीवत्स', hi: 'कल्पवृक्ष' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The tenth Tirthankar of the past era. His name represents supreme intellect (Sanmati). He cleared major philosophical delusions regarding creation and cosmic law.',
      hi: 'दशम अतीत तीर्थंकर श्री सन्मतिजी अपनी अगाध बुद्धि और प्रज्ञा से विख्यात थे। आपने सृष्टिवाद के मिथ्या संशय मिटाकर भव्य आत्माओं को स्वतंत्र कर्मवाद का सत्य समझाया।'
    }
  },
  {
    id: 'P11',
    number: 11,
    name: { en: 'Shri Sindhu', hi: 'श्री सिन्धु' },
    kaal: 'Past',
    symbol: { en: 'Rhinoceros / खड्ग', hi: 'गेंडा' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The eleventh Tirthankar of the past era. Established a flowing river (Sindhu) of compassional truth, enabling wanderers to safely quench spiritual thirst.',
      hi: 'ग्यारहवें अतीत तीर्थंकर श्री सिन्धु स्वामी ने करुणा और सत्य की ऐसी अविरल आध्यात्मिक गंगा (सिन्धू) बहाई जिससे अनंत जीवों की प्यास सर्वदा के लिए शांत हुई।'
    }
  },
  {
    id: 'P12',
    number: 12,
    name: { en: 'Shri Kusumanjali', hi: 'श्री कुसुमाञ्जलि' },
    kaal: 'Past',
    symbol: { en: 'Buffalo / महिष', hi: 'भैंसा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twelfth Tirthankar of the past era. Associated with incredible gentility and flower-like (Kusuma) soft compassion towards all living beings.',
      hi: 'बारहवें अतीत तीर्थंकर श्री कुसुमाञ्जलि स्वामी पुष्प के समान कोमल एवं वीतराग स्वभाव के धारी थे। आपके संसर्ग में आने वाले शत्रु प्राणी भी जन्मजात ईर्ष्या भूल जाते थे।'
    }
  },
  {
    id: 'P13',
    number: 13,
    name: { en: 'Shri Shivagana', hi: 'श्री शिवगण' },
    kaal: 'Past',
    symbol: { en: 'Boar / वराह', hi: 'सूअर' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The thirteenth Tirthankar of the past era. Directed the entire group (Gana) of his followers towards the final state of auspiciousness and liberation (Shiva).',
      hi: 'तेरहवें अतीत तीर्थंकर श्री शिवगण स्वामी ने अपने चतुरविध संघ (मुनि, आर्यिका, श्रावक, श्राविका) को सदा उत्तम मोक्ष और शिव पद की ओर अग्रसर रहने का दिव्य उपदेश दिया।'
    }
  },
  {
    id: 'P14',
    number: 14,
    name: { en: 'Shri Utsaha', hi: 'श्री उत्साह' },
    kaal: 'Past',
    symbol: { en: 'Falcon / श्येन', hi: 'बाज' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The fourteenth Tirthankar of the past era. His sermons filled suffering souls with divine energy and dynamic spiritual enthusiasm (Utsaha) to conquer karmas.',
      hi: 'चौदहवें अतीत तीर्थंकर श्री उत्साहदेव ने संसारी बंधनों से दुखी जीवों के मंद पुरुषार्थ को अपनी ओजस्वी अमृतवाणी से जाग्रत कर उन्हें कषाय जय विजय का उत्तम उत्साह प्रदान किया।'
    }
  },
  {
    id: 'P15',
    number: 15,
    name: { en: 'Shri Gyaneshwar', hi: 'श्री ज्ञानेश्वर' },
    kaal: 'Past',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The fifteenth Tirthankar of the past era. Regarded as the Emperor of infinite supreme wisdom (Gyaneshwar), dismantling massive darkness of dogmatism.',
      hi: 'पंद्रहवें अतीत तीर्थंकर श्री ज्ञानेश्वर स्वामी साक्षात केवलज्ञान के पुंज और अधिपति थे। आपके उपदेशों ने स्याद्वाद के प्रकाश से ब्रह्मांड का तिमिर नष्ट किया था।'
    }
  },
  {
    id: 'P16',
    number: 16,
    name: { en: 'Shri Parameshwar', hi: 'श्री परमेश्वर' },
    kaal: 'Past',
    symbol: { en: 'Deer / मृग', hi: 'हिरण' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The sixteenth Tirthankar of the past era. Fully realized the highest supreme-soul state, preaching absolute freedom from dependencies.',
      hi: 'सोलहवें अतीत तीर्थंकर श्री परमेश्वर भगवान ने अपनी इंद्रियों और बाहरी उपाधि का विसर्जन करके सर्वोच्च "परमेष्ठी" पद पाया तथा भव्य जीवों को अनासक्ति का कल्याणक दिया।'
    }
  },
  {
    id: 'P17',
    number: 17,
    name: { en: 'Shri Vimleshwar', hi: 'श्री विमलेश्वर' },
    kaal: 'Past',
    symbol: { en: 'Goat / अज', hi: 'बकरा' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The seventeenth Tirthankar of the past era. Possessed clean and spotless attributes, establishing high codes of moral conduct and monastic cleanliness.',
      hi: 'सत्रहवें अतीत तीर्थंकर श्री विमलेश्वरदेव का चरित्र और ध्यान सर्वथा मल रहित (विमल) था। आपने मुनियों के उत्तम निरतिचार व्रत पालन की आधारशिला रखी थी।'
    }
  },
  {
    id: 'P18',
    number: 18,
    name: { en: 'Shri Yashodhar', hi: 'श्री यशोधर' },
    kaal: 'Past',
    symbol: { en: 'Nandyavarta / नंद्यावर्त', hi: 'नंद्यावर्त' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The eighteenth Tirthankar of the past era. His glorious name and spiritual success (Yashas) resonated through all directions, guiding souls to the harbor of self-mastery.',
      hi: 'अठारहवें अतीत तीर्थंकर श्री यशोधर स्वामी की यश कीर्ति सुरमंडल और अमरावती तक गुंजायमान थी। आपने तप के कठिन तेज से कर्मों को जलाकर भस्म कर दिया था।'
    }
  },
  {
    id: 'P19',
    number: 19,
    name: { en: 'Shri Krishna', hi: 'श्री कृष्ण' },
    kaal: 'Past',
    symbol: { en: 'Kalasha / कलश', hi: 'कलश' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The nineteenth Tirthankar of the past cosmic era. He is not to be confused with the contemporary Lord Krishna, but rather represents a distinct historic savior of past times.',
      hi: 'उन्नीसवें अतीत तीर्थंकर श्री कृष्ण भगवान (यह वर्तमान अर्धचक्र के वासुदेव कृष्ण से भिन्न अति प्राचीन सिद्ध तीर्थंकर हैं) ने अहिंसक धर्म का शंखनाद किया था।'
    }
  },
  {
    id: 'P20',
    number: 20,
    name: { en: 'Shri Sumati', hi: 'श्री सुमति' },
    kaal: 'Past',
    symbol: { en: 'Tortoise / कूर्म', hi: 'कछुआ' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twentieth Tirthankar of the past era. Initiated early codes of wisdom and logical investigation, helping seekers overcome existential doubt.',
      hi: 'बीसवें अतीत तीर्थंकर श्री सुमतिनाथ देव ने सुबुद्धि का अलौकिक प्रसाद भव्य जीवों को दिया, जिससे प्राणियों ने कुमति संताप छोड़कर समता रूपी संपदा अंगीकार की।'
    }
  },
  {
    id: 'P21',
    number: 21,
    name: { en: 'Shri Shivadatt', hi: 'श्री शिवदत्त' },
    kaal: 'Past',
    symbol: { en: 'Blue Lotus / नीलकमल', hi: 'नीलकमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The twenty-first Tirthankar of the past era. Directed the focus of humanity to noble acts (Datta) which support absolute spiritual benevolence (Shiva).',
      hi: 'इक्कीसवें अतीत तीर्थंकर श्री शिवदत्त स्वामी ने मानव कल्याण और सर्वोदय धर्म के पावन सिद्धांतों का विस्तार कर मोक्ष की विशुद्ध वीथि का निर्माण कार्य किया।'
    }
  },
  {
    id: 'P22',
    number: 22,
    name: { en: 'Shri Shribharat', hi: 'श्री श्रीभरत' },
    kaal: 'Past',
    symbol: { en: 'Conch / शंख', hi: 'शंख' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twenty-second Tirthankar of the past era. Encouraged seekers to realize the vastness (Bharat) of their internal consciousness, freeing them from narrow attachments.',
      hi: 'बाईसवें अतीत तीर्थंकर श्री श्रीभरतजी ने उपदेश दिया कि आत्मा की असीम विशालता (भरत) को पहचानो, संकीर्ण देह आसक्ति में अपनी चैतन्य आभा नष्ट मत करो।'
    }
  },
  {
    id: 'P23',
    number: 23,
    name: { en: 'Shri Shrikay', hi: 'श्री श्रीकय' },
    kaal: 'Past',
    symbol: { en: 'Serpent / सर्प', hi: 'सर्प' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The twenty-third Tirthankar of the past era. Preached the non-violence of thought, clarifying how the body (Kaya) can be treated as a pure vessel for liberation.',
      hi: 'तेईसवें अतीत तीर्थंकर श्री श्रीकयदेव ने सिखाया कि यह नाशवान काय (शरीर) केवल आत्म ध्यान का साधन है, इसे भोगों से हटाकर तप में संलग्न करना ही बुद्धिमता है।'
    }
  },
  {
    id: 'P24',
    number: 24,
    name: { en: 'Shri Ajit', hi: 'श्री अजित' },
    kaal: 'Past',
    symbol: { en: 'Lion / सिंह', hi: 'सिंह' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twenty-fourth and last Tirthankar of the past cosmic era. He concluded the past Chauvisi with supreme victory over all cosmic desires, leaving a great legacy.',
      hi: 'चौबीसवें अंतिम अतीत तीर्थंकर श्री अजितनाथ देव ने तत्कालीन अवसर्पिणी काल की चौबीसी की पूर्णता की तथा आत्मविजय का अंतिम पावन संदेश देकर मोक्ष धाम पधारे।'
    }
  },

  // ==================== FUTURE ERA (24) ====================
  {
    id: 'F1',
    number: 1,
    name: { en: 'Shri Mahapadma', hi: 'श्री महापद्म' },
    kaal: 'Future',
    symbol: { en: 'Lotus / पद्म', hi: 'कमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The first Tirthankar of the upcoming future era. He is currently the pure celestial soul of King Shrenik Bimbisara of Magadha (who was a contemporary devotee of Lord Mahavira). Because of his high devotion, he bound Tirthankar-nam-karma and will guide future humanity.',
      hi: 'आगामी भविष्य काल के प्रथम तीर्थंकर। मगध सम्राट राजा श्रेणिक बिम्बिसार (भगवान महावीर के परम समवशरण भक्त) की विशुद्ध आत्मा आगामी कालखंड में प्रथम भविष्य तीर्थंकर "महापद्म" बनकर कल्याणी गंगा बहाएगी।'
    }
  },
  {
    id: 'F2',
    number: 2,
    name: { en: 'Shri Surdev', hi: 'श्री सुरदेव' },
    kaal: 'Future',
    symbol: { en: 'Elephant / गज', hi: 'हाथी' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The second Tirthankar of the future era. He is the pure soul of Suparshva (the loving uncle of Lord Mahavira), celebrated for deep self-restraint and spiritual potential.',
      hi: 'द्वितीय भविष्य तीर्थंकर श्री सुरदेव स्वामी वर्तमान काल के भगवान महावीर के पावन ज्येष्ठ चाचा सुपार्श्व की पवित्र चैतन्य आत्मा का मंगलकारी मोक्ष-अवतार है।'
    }
  },
  {
    id: 'F3',
    number: 3,
    name: { en: 'Shri Suparshva', hi: 'श्री सुपार्श्व' },
    kaal: 'Future',
    symbol: { en: 'Swastika / स्वास्तिक', hi: 'स्वास्तिक' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The third Tirthankar of the future era. The pure soul of Prince Konika (King Shreniks son), reincarnating to set an example of deep confession, inner cleanup, and eventual supreme enlightenment.',
      hi: 'तृतीय भविष्य तीर्थंकर श्री सुपार्श्वदेव (राजा श्रेणिक के पुत्र कुमार कोणिक की विशुद्ध चेतना) कषाय विनाश और पश्चाताप की महान शक्ति से दीक्षा ग्रहण कर केवलज्ञान पाएगी।'
    }
  },
  {
    id: 'F4',
    number: 4,
    name: { en: 'Shri Svayamprabh', hi: 'श्री स्वयंप्रभ' },
    kaal: 'Future',
    symbol: { en: 'Horse / अश्व', hi: 'घोड़ा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The fourth Tirthankar of the future era. He will guide souls out of the illusions of materialistic dark Ages into the brilliant light of self-realization.',
      hi: 'चतुर्थ भविष्य तीर्थंकर श्री स्वयंप्रभदेव जड़वादी संशय संताप के अंधकार युग को विनिष्ट कर आगामी प्रजा को आत्मनिर्मलता की अमर दिव्य देशना प्रदान करेंगे।'
    }
  },
  {
    id: 'F5',
    number: 5,
    name: { en: 'Shri Sarvatnubhuti', hi: 'श्री सर्वात्नुभूति' },
    kaal: 'Future',
    symbol: { en: 'Swastika / स्वास्तिक', hi: 'स्वास्तिक' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The fifth Tirthankar of the future era. His name indicates "Universal Realization of Spirit." He will teach that the ultimate experience is the direct experience of soul.',
      hi: 'पंचम भविष्य तीर्थंकर श्री सर्वात्नुभूतिजी सबके अंतरंग चैतन्य की जागृति करने वाले होंगे। आपका सिद्धांत होगा: प्रत्यक्ष अनुभव ही परम सत्य है।'
    }
  },
  {
    id: 'F6',
    number: 6,
    name: { en: 'Shri Devputra', hi: 'श्री देवपुत्र' },
    kaal: 'Future',
    symbol: { en: 'Curlew / क्रौंच', hi: 'चकवा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The sixth Tirthankar of the future era. He will exemplify the pure conversion of earthly ego into simple divine traits of spiritual service.',
      hi: 'षष्ठम भविष्य तीर्थंकर श्री देवपुत्र राजा कार्तिकेय की विशुद्ध आत्मा होगी, जो भोगवादी अहंकार मिटाकर वीतराग चारित्र की महिमा का गुणगान करेगी।'
    }
  },
  {
    id: 'F7',
    number: 7,
    name: { en: 'Shri Kulputra', hi: 'श्री कुलपुत्र' },
    kaal: 'Future',
    symbol: { en: 'Lotus / पद्म', hi: 'कमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The seventh Tirthankar of the future era. Demonstrates the ultimate rise from familial lineages (Kula) to the high status of global universal motherhood.',
      hi: 'सप्तम भविष्य तीर्थंकर श्री कुलपुत्र देव संसारी कुल और वंश की संकीर्ण सीमाओं से ऊपर उठकर वसुधैव कुटुम्बकम् के अहिंसक साम्राज्य का निर्माण करने वाले होंगे।'
    }
  },
  {
    id: 'F8',
    number: 8,
    name: { en: 'Shri Udak', hi: 'श्री उदक' },
    kaal: 'Future',
    symbol: { en: 'Moon / चन्द्र', hi: 'चंद्रमा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The eighth Tirthankar of the future era. His serene cooling nature will be like clean water (Udaka), curing the burning thirst of materialistic illusion.',
      hi: 'अष्टम भविष्य तीर्थंकर श्री उदक स्वामी अपनी अत्यंत शीतल देशना से वासना की तप्त अग्नि बुझाकर जीवों को अमृत (उदक/जल) की भांति नवीन जीवन जीवन दान करेंगे।'
    }
  },
  {
    id: 'F9',
    number: 9,
    name: { en: 'Shri Prosthila', hi: 'श्री प्रोष्ठिल' },
    kaal: 'Future',
    symbol: { en: 'Crocodile / मगर', hi: 'मगरमच्छ' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The ninth Tirthankar of the future era. Re-establishes the deep structures of spiritual laws, enabling seekers to maintain extreme focus.',
      hi: 'नवम भविष्य तीर्थंकर श्री प्रोष्ठिलजी परम प्रतापी आचार्य चेतक की विशुद्ध चैतन्य आत्मा होंगे, जो चारित्र नियमों को पुनः दृढ़ संगति प्रदान करेंगे।'
    }
  },
  {
    id: 'F10',
    number: 10,
    name: { en: 'Shri Jay', hi: 'श्री जय' },
    kaal: 'Future',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The tenth Tirthankar of the future era. Preaches the complete victory (Jaya) of internal consciousness over planetary dependencies and bodily attachments.',
      hi: 'दशम भविष्य तीर्थंकर श्री जयदेव कषाय रिपुओं पर अंतिम और पूर्ण "जय" (विजय) पाने का अचूक स्याद्वाद अस्त्र संसारी जगत को देने के लिए अवतरित होंगे।'
    }
  },
  {
    id: 'F11',
    number: 11,
    name: { en: 'Shri Vimal', hi: 'श्री विमल' },
    kaal: 'Future',
    symbol: { en: 'Rhinoceros / खड्ग', hi: 'गेंडा' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The eleventh Tirthankar of the future era. Preaches the essential purification of thought, clearing layers of non-violence misconceptions.',
      hi: 'ग्यारहवें भविष्य तीर्थंकर श्री विमलदेव आत्मा को कषाय मल रज से पूर्णतया स्वतंत्र (विमल) करने की परम तपस्या पद्धति का मंगल विधान प्रजा को समझाएंगे।'
    }
  },
  {
    id: 'F12',
    number: 12,
    name: { en: 'Shri Jayeshwar', hi: 'श्री जयेश्वर' },
    kaal: 'Future',
    symbol: { en: 'Goat / अज', hi: 'बकरा' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twelfth Tirthankar of the future era. Possesses unmatched tranquility and willpower, illustrating how supreme detachment ensures inner mastery.',
      hi: 'बारहवें भविष्य तीर्थंकर श्री जयेश्वरदेव वीतरागी शांत ध्यान समाधि के महान सेनानायक होंगे। आपके दिव्य समवशरण से जीव दया का महान उद्घोष होगा।'
    }
  },
  {
    id: 'F13',
    number: 13,
    name: { en: 'Shri Munipungava', hi: 'श्री मुनिपुङ्गव' },
    kaal: 'Future',
    symbol: { en: 'Boar / वराह', hi: 'सूअर' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The thirteenth Tirthankar of the future era. Representing the supreme bull/chief among monks, demonstrating flawless monastic disciplines.',
      hi: 'तेरहवें भविष्य तीर्थंकर श्री मुनिपुङ्गवजी (मुनियों में श्रेष्ठतम) बाल्यकाल से ही तपस्वी स्वभाव के होंगे तथा दिगंबर मुद्रा के महानतम आदर्शों की प्रतिष्ठा करेंगे।'
    }
  },
  {
    id: 'F14',
    number: 14,
    name: { en: 'Shri Arishta', hi: 'श्री अरिष्ट' },
    kaal: 'Future',
    symbol: { en: 'Falcon / श्येन', hi: 'बाज' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The fourteenth Tirthankar of the future era. Destroys all negative spiritual obstacles (Arishta), establishing tranquility in kingdoms.',
      hi: 'चौदहवें भविष्य तीर्थंकर श्री अरिष्टदेव संसारी जीवों के दारुण संकट, आध्यात्मिक आधि-व्याधि और अमंगलों (अरिष्ट) को हरने के लिए वीतराग देशना देंगे।'
    }
  },
  {
    id: 'F15',
    number: 15,
    name: { en: 'Shri Nishpulak', hi: 'श्री निष्पुलाक' },
    kaal: 'Future',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The fifteenth Tirthankar of the future era. Exemplifies how to remain entirely steady, unwavering, and flawless like a solid diamond of focus.',
      hi: 'पंद्रहवें भविष्य तीर्थंकर श्री निष्पुलाक भगवान संसारी हर्ष-विषाद से सदा विरक्त और अप्रकंपित रहने की "ग्यारहवीं प्रतिमा" सदृश तप साधना का मार्ग बताएंगे।'
    }
  },
  {
    id: 'F16',
    number: 16,
    name: { en: 'Shri Nirmam', hi: 'श्री निर्मम' },
    kaal: 'Future',
    symbol: { en: 'Deer / मृग', hi: 'हिरण' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The sixteenth Tirthankar of the future era. Embodies absolute "Nirmamata" - the complete devoid of "my-ness" or possessive attachment towards material things.',
      hi: 'सोलहवें भविष्य तीर्थंकर श्री निर्ममदेव का एक ही मुख्य उपदेश होगा: "यह देह और संसार पराए हैं, ममत्व (मेरापन) ही कषाय की उत्पत्ति का मुख्य कारण है।"'
    }
  },
  {
    id: 'F17',
    number: 17,
    name: { en: 'Shri Chitragupt', hi: 'श्री चित्रगुप्त' },
    kaal: 'Future',
    symbol: { en: 'Goat / अज', hi: 'बकरा' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The seventeenth Tirthankar of the future era. Teaches how to protect the mind (Gupta) from external dark pictures (Chitra) of worldly temptation.',
      hi: 'सत्रहवें भविष्य तीर्थंकर श्री चित्रगुप्तदेव गुप्त (छिपे हुए) आत्मिक स्वरूप को समझने और बाह्य चंचल चित्रों के मोहक आकर्षण से बचने का उपाय बताएंगे।'
    }
  },
  {
    id: 'F18',
    number: 18,
    name: { en: 'Shri Samadhi', hi: 'श्री समाधि' },
    kaal: 'Future',
    symbol: { en: 'Nandyavarta / नंद्यावर्त', hi: 'नंद्यावर्त' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The eighteenth Tirthankar of the future era. Guides humanity into the deep ocean of constant soul-absorption and supreme meditation (Samadhi).',
      hi: 'अठारहवें भविष्य तीर्थंकर श्री समाधिनाथदेव कषाय निवृत्ति और ध्यान सुख की पावन समाधि रूपी अनंत साम्राज्य का मार्ग प्रशस्त करेंगे।'
    }
  },
  {
    id: 'F19',
    number: 19,
    name: { en: 'Shri Sanvar', hi: 'श्री संवर' },
    kaal: 'Future',
    symbol: { en: 'Kalasha / कलश', hi: 'कलश' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The nineteenth Tirthankar of the future era. Highlights the vital process of Sanvara - blocking new karmic particles from entering the spiritual self.',
      hi: 'उन्नीसवें भविष्य तीर्थंकर श्री संवरनाथजी कर्मों के आने के द्वारों को बंद (संवर) करने की उत्तम गुप्ति और अहिंसक क्रियाविधि का सच्चा रहस्य समझाएंगे।'
    }
  },
  {
    id: 'F20',
    number: 20,
    name: { en: 'Shri Yashodhar', hi: 'श्री यशोधर' },
    kaal: 'Future',
    symbol: { en: 'Tortoise / कूर्म', hi: 'कछुआ' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twentieth Tirthankar of the future era. Re-establishes the golden codes of spiritual fame and pure, untamed, independent monastic vows.',
      hi: 'बीसवें भविष्य तीर्थंकर श्री यशोधर स्वामी अपनी अनुपम कीर्ति और दिगंबर तेज से सम्पूर्ण आगामी युग के संतापों को सर्वथा विलीन कर शांत करेंगे।'
    }
  },
  {
    id: 'F21',
    number: 21,
    name: { en: 'Shri Vijay', hi: 'श्री विजय' },
    kaal: 'Future',
    symbol: { en: 'Blue Lotus / नीलकमल', hi: 'नीलकमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The twenty-first Tirthankar of the future era. Possesses unshakeable victory (Vijaya) over existential wandering and delusions.',
      hi: 'इक्कीसवें भविष्य तीर्थंकर श्री विजयदेव अनादि काल के चार गति रूपी चक्रव्यूह से भव्य जीवों को निकाल कर सिद्ध पद की अनंत "विजय" प्रदान करेंगे।'
    }
  },
  {
    id: 'F22',
    number: 22,
    name: { en: 'Shri Malla', hi: 'श्री मल्ल' },
    kaal: 'Future',
    symbol: { en: 'Conch / शंख', hi: 'शंख' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The twenty-second Tirthankar of the future era. A powerful spiritual champion (Malla) who wrestles down and completely uproots core karmas.',
      hi: 'बाईसवें भविष्य तीर्थंकर श्री मल्लदेव कषायों और बाह्य संसार रूपी शत्रुओं को मल युद्ध (कुश्ती) की भांति धराशायी करने वाले वज्र तपस्वी होंगे।'
    }
  },
  {
    id: 'F23',
    number: 23,
    name: { en: 'Shri Dev', hi: 'श्री देव' },
    kaal: 'Future',
    symbol: { en: 'Serpent / सर्प', hi: 'सर्प' },
    color: 'Golden',
    image: 'https://i.ibb.co/hxpNxjhq/Screenshot-20250909-141519.jpg',
    details: {
      en: 'The twenty-third Tirthankar of the future era. Possesses beautiful divine traits, redirecting seekers to worship none but the unattached self.',
      hi: 'तेईसवें भविष्य तीर्थंकर श्री देव स्वामी साक्षात सिद्धों के देव होंगे जो बाह्य आडंबर छुड़ाकर केवल आत्म देव की उपासना का मर्म सिखाएंगे।'
    }
  },
  {
    id: 'F24',
    number: 24,
    name: { en: 'Shri Anantvirya', hi: 'श्री अनन्तवीर्य' },
    kaal: 'Future',
    symbol: { en: 'Lion / सिंह', hi: 'सिंह' },
    color: 'Golden',
    image: 'https://i.ibb.co/Z1V5LLkZ/Screenshot-20250909-143012.jpg',
    details: {
      en: 'The 24th and final Tirthankar of the upcoming future era. He will conclude the future assembly of enlightened beings, possessing infinite potency (Anantavirya) of soul.',
      hi: '२४वें अंतिम भविष्य तीर्थंकर श्री अनन्तवीर्य स्वामी भविष्य चौबीसी की निर्मल पूर्णाहुति करेंगे तथा जगत को अनंत वीर पुरुषार्थ का मार्ग सिखाकर सिद्धशिला गमन करेंगे।'
    }
  },

  // ==================== VIDEH / VIDHMAAN ERA (20) ====================
  {
    id: 'V1',
    number: 1,
    name: { en: 'Shri Seemandhar Swami', hi: 'श्री सीमन्धर स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Bull / वृषभ', hi: 'बैल' },
    color: 'Golden',
    image: 'https://i.ibb.co/B20V9MYM/IMG-20250907-213554.jpg',
    details: {
      en: 'The first currently living (Vihraman) Tirthankar in the Videha Kshetra. He is spreading the pure gospel of non-violence and omniscience to billions of seekers right now.',
      hi: 'महाविदेह क्षेत्र में वर्तमान समय में विहरमान (जीवित) प्रथम तीर्थंकर देव। आपके दिव्य समवशरण से वर्तमान समय में भी भव्य आत्माओं को सीधा मोक्ष प्राप्त हो रहा है।'
    }
  },
  {
    id: 'V2',
    number: 2,
    name: { en: 'Shri Yugmandhar Swami', hi: 'श्री युग्मन्धर स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Elephant / गज', hi: 'हाथी' },
    color: 'Golden',
    image: 'https://i.ibb.co/s94SpnyV/IMG-20250907-213629.jpg',
    details: {
      en: 'The second currently existing Tirthankar in Videha Kshetra. Preaches the flawless system of Anekantavada, reconciling different viewpoints securely.',
      hi: 'महाविदेह क्षेत्र के द्वितीय वर्तमान विहरमान जिनेन्द्र देव श्री युग्मन्धर स्वामी। आप स्याद्वाद और अनेकान्त के सिद्धांत द्वारा परस्पर द्वेष मिटा रहे हैं।'
    }
  },
  {
    id: 'V3',
    number: 3,
    name: { en: 'Shri Bahu Swami', hi: 'श्री बाहु स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Horse / अश्व', hi: 'घोड़ा' },
    color: 'Golden',
    image: 'https://i.ibb.co/5XN7Sjbn/IMG-20250907-213713.jpg',
    details: {
      en: 'The third living Tirthankar in the Videha world. Guides millions of seekers towards complete self-restraint and early monkhood.',
      hi: 'तृतीय विहरमान तीर्थंकर श्री बाहु स्वामी। आपकी दिव्य वीतरागी देशना भव्य मुमुक्षु जीवों को आत्म-सुधार और मुनि चारित्र ग्रहण करने की अमर प्रेरणा दे रही है।'
    }
  },
  {
    id: 'V4',
    number: 4,
    name: { en: 'Shri Subahu Swami', hi: 'श्री सुबाहु स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Monkey / कपि', hi: 'बंदर' },
    color: 'Golden',
    image: 'https://i.ibb.co/4x5d6xL/IMG-20250907-213742.jpg',
    details: {
      en: 'The fourth living Tirthankar in Videha Kshetra. His presence subdues external obstacles, enabling pure spiritual focus.',
      hi: 'चतुर्थ विहरमान तीर्थंकर श्री सुबाहु स्वामी। आपके पावन दर्शन मात्र से ही भव्य जीवों के अंतरंग व बाह्य विघ्न तत्काल शांत हो जाते हैं।'
    }
  },
  {
    id: 'V5',
    number: 5,
    name: { en: 'Shri Sujat Swami', hi: 'श्री सुजात स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Curlew / क्रौंच', hi: 'चकवा' },
    color: 'Golden',
    image: 'https://i.ibb.co/BH7mWdxs/IMG-20250907-213811.jpg',
    details: {
      en: 'The fifth living Tirthankar in the pristine lands of Videha. Teaches the utmost gentle behavior and soft mental purification.',
      hi: 'पंचम विहरमान तीर्थंकर श्री सुजात स्वामी। आप जीवों को मृदुलता, सरलता और अंतरंग विकारों के त्याग की दिव्य देशना से कृतार्थ कर रहे हैं।'
    }
  },
  {
    id: 'V6',
    number: 6,
    name: { en: 'Shri Svayamprabh Swami', hi: 'श्री स्वयंप्रभ स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Red Lotus / पद्म', hi: 'लाल कमल' },
    color: 'Golden',
    image: 'https://i.ibb.co/HLLMRYw3/IMG-20250907-213847.jpg',
    details: {
      en: 'The sixth living Tirthankar of Videha. Possesses a naturally radiant halo, illustrating the highest state of self-knowledge.',
      hi: 'षष्ठम विहरमान तीर्थंकर श्री स्वयंप्रभ स्वामी। आपकी स्वाभाविक केवलज्ञान की दिव्य दीप्ति करोड़ों आत्माओं का भ्रम तिमिर नष्ट कर रही है।'
    }
  },
  {
    id: 'V7',
    number: 7,
    name: { en: 'Shri Rishabhanan Swami', hi: 'श्री ऋषभानन स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Swastika / स्वास्तिक', hi: 'स्वास्तिक' },
    color: 'Golden',
    image: 'https://i.ibb.co/W412zy8q/IMG-20250907-214059.jpg',
    details: {
      en: 'The seventh living Tirthankar of Videha. Emphasizes the ancient standard codes of non-violence and complete vegetarianism.',
      hi: 'सप्तम विहरमान तीर्थंकर श्री ऋषभानन स्वामी। आप मूक पशुओं की रक्षा और उत्तम जीव दया की पावन मर्यादा को पुनः सुशोभित कर रहे हैं।'
    }
  },
  {
    id: 'V8',
    number: 8,
    name: { en: 'Shri Anantavirya Swami', hi: 'श्री अनन्तवीर्य स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Moon / चन्द्र', hi: 'चंद्रमा' },
    color: 'Golden',
    image: 'https://i.ibb.co/934Gcq1R/IMG-20250907-214116.jpg',
    details: {
      en: 'The eighth living Tirthankar of Videha. Guides souls to awaken their sleeping divine potential and infinite willpower (Virya).',
      hi: 'अष्टम विहरमान तीर्थंकर श्री अनन्तवीर्य स्वामी। आप प्राणियों के सोए हुए अनन्त पुरुषार्थ को जाग्रत कर दिव्य मोक्ष प्राप्ति का विधान समझा रहे हैं।'
    }
  },
  {
    id: 'V9',
    number: 9,
    name: { en: 'Shri Suraprabh Swami', hi: 'श्री सूरप्रभ स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Crocodile / मगर', hi: 'मगरमच्छ' },
    color: 'Golden',
    image: 'https://i.ibb.co/vxH7JmJY/IMG-20250907-214139.jpg',
    details: {
      en: 'The ninth living Tirthankar of Videha. Preaches the deep, systematic process of cleaning residual past karmas through dhyana.',
      hi: 'नवम विहरमान तीर्थंकर श्री सूरप्रभ स्वामी। आपकी तप तेजस्या सुर समाजपति देवों द्वारा भी वंदनीय है, आप कर्म रज विनाशी साधना के अधिपति हैं।'
    }
  },
  {
    id: 'V10',
    number: 10,
    name: { en: 'Shri Vishalprabh Swami', hi: 'श्री विशालप्रभ स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Shrivatsa / श्रीवत्स', hi: 'कल्पवृक्ष' },
    color: 'Golden',
    image: 'https://i.ibb.co/Mx4DxmhD/IMG-20250907-214157.jpg',
    details: {
      en: 'The tenth living Tirthankar of Videha. Known for his wide, compassionate vision (Vishala) which welcomes searchers of all scales.',
      hi: 'दशम विहरमान तीर्थंकर श्री विशालप्रभ स्वामी। आपकी असीम दृष्टि संसारी जीवों के सुखद मोक्ष मार्ग के उत्कर्ष को ही सर्वदा सुगम बनाती है।'
    }
  },
  {
    id: 'V11',
    number: 11,
    name: { en: 'Shri Vajradhar Swami', hi: 'श्री वज्रधर स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Rhinoceros / खड्ग', hi: 'गेंडा' },
    color: 'Golden',
    image: 'https://i.ibb.co/WN0FxvgJ/IMG-20250907-214233.jpg',
    details: {
      en: 'The eleventh living Tirthankar of Videha. Employs the diamond-like weapon (Vajra) of Syadvada logic to cleave spiritual ignorance.',
      hi: 'ग्यारहवें विहरमान तीर्थंकर श्री वज्रधर स्वामी। आप सम्यक रत्नत्रय रूपी श्रेष्ठ वज्र स्तंभ बनाकर मिथ्या मत संताप का तात्कालिक दमन कर रहे हैं।'
    }
  },
  {
    id: 'V12',
    number: 12,
    name: { en: 'Shri Chandranan Swami', hi: 'श्री चन्द्रानन स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Buffalo / महिष', hi: 'भैंसा' },
    color: 'Golden',
    image: 'https://i.ibb.co/21CQDyr5/IMG-20250907-214252.jpg',
    details: {
      en: 'The twelfth living Tirthankar of Videha. His moon-like peaceful face (Chandra) automatically dissolves anger and hatred in his assembly.',
      hi: 'बारहवें विहरमान तीर्थंकर श्री चन्द्रानन स्वामी। आपके पूर्णिमा चन्द्रमा सदृश शांत मुखारविंद के दर्शन मात्र से प्राणियों का जन्मजात रोष मिट जाता है।'
    }
  },
  {
    id: 'V13',
    number: 13,
    name: { en: 'Shri Chandrabahu Swami', hi: 'श्री चन्द्रबाहु स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Boar / वराह', hi: 'सूअर' },
    color: 'Golden',
    image: 'https://i.ibb.co/2YWpnjHr/IMG-20250907-214312.jpg',
    details: {
      en: 'The thirteenth living Tirthankar of Videha. Teaches the utmost importance of maintaining clean thoughts and performing self-criticism (Pratikramana).',
      hi: 'तेरहवें विहरमान तीर्थंकर श्री चन्द्रबाहु स्वामी। आपके पावन उपदेशों से जीवों को प्रतिक्रमण और संवर साधना की उत्कृष्ट शिक्षा मिल रही है।'
    }
  },
  {
    id: 'V14',
    number: 14,
    name: { en: 'Shri Bhujanga Swami', hi: 'श्री भुजङ्ग स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Falcon / श्येन', hi: 'बाज' },
    color: 'Golden',
    image: 'https://i.ibb.co/RkNQmmGZ/IMG-20250907-214334.jpg',
    details: {
      en: 'The fourteenth living Tirthankar of Videha. Directs focused yogis to protect the core attributes of the soul from external temptation.',
      hi: 'चौदहवें विहरमान तीर्थंकर श्री भुजङ्ग स्वामी। आप योगियों की गुप्त समाधि और उत्तम ध्यान प्रणाली का मार्ग अपने समवशरण से स्पष्ट कर रहे हैं।'
    }
  },
  {
    id: 'V15',
    number: 15,
    name: { en: 'Shri Ishwar Swami', hi: 'श्री ईश्वर स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र' },
    color: 'Golden',
    image: 'https://i.ibb.co/0RnzKF6v/IMG-20250907-214355.jpg',
    details: {
      en: 'The fifteenth living Tirthankar of Videha. Exemplifies how to hold perfect and independent mastership (Ishwaratvam) of the inner infinite space.',
      hi: 'पंद्रहवें विहरमान तीर्थंकर श्री ईश्वर स्वामी। आप आत्मा के अखंड ऐश्वर्य और स्वतंत्रता को सिद्ध कर संसारी दीनता का सदा के लिए सर्वनाश कर रहे हैं।'
    }
  },
  {
    id: 'V16',
    number: 16,
    name: { en: 'Shri Nemiprabh Swami', hi: 'श्री नेमिप्रभ स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Deer / मृग', hi: 'हिरण' },
    color: 'Golden',
    image: 'https://i.ibb.co/d0kJ9nq8/IMG-20250907-214410.jpg',
    details: {
      en: 'The sixteenth living Tirthankar of Videha. Promotes the glorious monastic boundaries and clean principles of right character.',
      hi: 'सोलहवें विहरमान तीर्थंकर श्री नेमिप्रभ स्वामी। आपकी वीतराग आचरण नियमावली सम्पूर्ण विदेह के संतों को मोक्ष की सच्ची दिशा देने वाली है।'
    }
  },
  {
    id: 'V17',
    number: 17,
    name: { en: 'Shri Veersen Swami', hi: 'श्री वीरसेन स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Goat / अज', hi: 'बकरा' },
    color: 'Golden',
    image: 'https://i.ibb.co/27pWGmSc/IMG-20250907-214424.jpg',
    details: {
      en: 'The seventeenth living Tirthankar of Videha. Encourages the monk warrior traits in seekers, enabling them to fearlessly smash any internal blocks.',
      hi: 'सत्रहवें विहरमान तीर्थंकर श्री वीरसेन स्वामी। आप अध्यात्मिक योद्धा की भांति कषायों के विरुद्ध उठ खड़े होने की निर्भीक वीरता का संचार कर रहे हैं।'
    }
  },
  {
    id: 'V18',
    number: 18,
    name: { en: 'Shri Mahabhadra Swami', hi: 'श्री महाभद्र स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Nandyavarta / नंद्यावर्त', hi: 'नंद्यावर्त' },
    color: 'Golden',
    image: 'https://i.ibb.co/YTX7Ztyf/IMG-20250907-214835.jpg',
    details: {
      en: 'The eighteenth living Tirthankar of Videha. Possesses complete moral auspiciousness, removing layers of dark karmic stains from souls.',
      hi: 'अठारहवें विहरमान तीर्थंकर श्री महाभद्र स्वामी। आप कल्याणकारी (भद्र) मंगल के दाता तथा भव्य जीवों के अज्ञान जनित संकट समाप्त करने के परम स्रोत हैं।'
    }
  },
  {
    id: 'V19',
    number: 19,
    name: { en: 'Shri Devyas Swami', hi: 'श्री देवयश स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Kalasha / कलश', hi: 'कलश' },
    color: 'Golden',
    image: 'https://i.ibb.co/CSzWHVB/IMG-20250907-214857.jpg',
    details: {
      en: 'The nineteenth living Tirthankar of Videha. Revered by high heavenly devas, his beautiful fame spans across the whole cosmos.',
      hi: 'उन्नीसवें विहरमान तीर्थंकर श्री देवयश स्वामी। आपका दिव्य सुयश और प्रभाव स्वर्ग के इंद्रों और चतुर चतुरविध मानव जगत में विख्यात है।'
    }
  },
  {
    id: 'V20',
    number: 20,
    name: { en: 'Shri Ajitavirya Swami', hi: 'श्री अजितवीर्य स्वामी' },
    kaal: 'Videh',
    symbol: { en: 'Tortoise / कूर्म', hi: 'कछुआ' },
    color: 'Golden',
    image: 'https://i.ibb.co/v4L77L7N/IMG-20250907-214912.jpg',
    details: {
      en: 'The twentieth currently living Tirthankar of Videha. Preaches the absolute invincible power of right faith over materialistic dark elements.',
      hi: 'बीसवें विहरमान तीर्थंकर श्री अजितवीर्य स्वामी। आपकी अजेय वीर्य (आत्म बल) देशना से महामुमुक्षु भव्य जीवों को चरम मोक्ष कल्यानक मिल रहा है।'
    }
  }
];
