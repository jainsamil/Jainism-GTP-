export interface Tirthankar {
  id: string;
  name: { en: string; hi: string };
  kaal: 'Past' | 'Present' | 'Future';
  details: { en: string; hi: string };
  symbol: { en: string; hi: string };
  color: string;
  number?: number;
}

export const tirthankarData: Tirthankar[] = [
  // Present Era (Chauvisi)
  {
    id: '1',
    name: { en: 'Rishabhdev (Adinath) / भगवान आदिनाथ', hi: 'ऋषभदेव (प्रथम तीर्थंकर आदिनाथ)' },
    kaal: 'Present',
    details: {
      en: 'The first Tirthankar of the current Avasarpini era. Born in Ayodhya to King Nabhi Raja and Queen Marudevi. He ruled for millions of years, introducing the six main arts (Shatkarma) of physical livelihood, including agriculture, reading/writing, and defense, transforming humans into a civilized society. He renounced his kingdom to practice self-realization and underwent intense penance. He had 100 sons, including Emperor Bharata (after whom India, "Bharatvarsha", is named) and the great ascetic Lord Bahubali. He attained Nirvana at Mount Ashtapada.',
      hi: 'वर्तमान अवसर्पिणी काल के प्रथम तीर्थंकर। अयोध्या के राजा नाभिराज और माता मरुदेवी के यहाँ जन्म हुआ। मुनि दीक्षा से पूर्व उन्होंने मानव समाज को कृषि, लेखन, शिल्प, रक्षा और विद्या जैसे षट्कर्मों (छह व्यवसायों) की कला सिखाई और एक सभ्य समाज की स्थापना की। उनके ज्येष्ठ पुत्र चक्रवर्ती भरत के नाम पर ही हमारे देश का नाम "भारतवर्ष" पड़ा, और उनके दूसरे यशस्वी पुत्र वैरागी भगवान बाहुबली थे। उन्होंने कैलाश (अष्टापद) पर्वत से परम निर्वाण (मोक्ष) लाभ प्राप्त किया।'
    },
    symbol: { en: 'Bull / वृषभ', hi: 'बैल (वृषभ)' },
    color: 'Golden'
  },
  {
    id: '2',
    name: { en: 'Ajitnath / भगवान अजितनाथ', hi: 'अजितनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The second Tirthankar of the present era. Born in Ayodhya to King Jitasatru and Queen Vijaya Devi. His name means "The Invincible One," reflecting his absolute conquest over all inner desires, attachment, and external spiritual obstacles. He spent thousands of years in spiritual contemplation, establishing the second great Tirtha assembly of monks. He attained Nirvana at the holy mount of Sammed Shikharji.',
      hi: 'वर्तमान युग के द्वितीय तीर्थंकर। अयोध्या के इक्ष्वाकु वंश के राजा जितशत्रु और माता विजयादेवी के पुत्र के रूप में अवतरित हुए। "अजितनाथ" का अर्थ है जिसे कोई जीत न सके, जो राग-द्वेष और वासनाओं पर पूर्ण विजय प्राप्त कर चुके हों। उन्होंने भगवान आदिनाथ की शांत परंपरा को आगे बढ़ाया और अंत में श्री सम्मेद शिखरजी से निर्वाण प्राप्त किया।'
    },
    symbol: { en: 'Elephant / गज', hi: 'हाथी (गज)' },
    color: 'Golden'
  },
  {
    id: '3',
    name: { en: 'Sambhavnath / भगवान सम्भवनाथ', hi: 'सम्भवनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The third Tirthankar. Born in Shravasti to King Jitari and Queen Sena Devi. His birth brought a miraculous abundance of crops and end of social distress, which is why he was named Sambhavnath ("One who makes goodness possible"). He ruled with compassion, eventually embraced monkhood on Kartika Krisna Trayodashi, and attained omniscience (Kevala Jnana) under a Sal tree. He attained Moksha at Sammed Shikharji.',
      hi: 'तृतीय तीर्थंकर। श्रावस्ती नगरी के राजा जितारि और माता सेनादेवी के महान पुत्र। उनके जन्मकाल में हर तरफ उत्तम धान्य वृद्धि और मांगलिक संभवताओं का उदय हुआ। उन्होंने जीवों को संसार रूपी अरण्य से बाहर निकलने की सुगम राह दिखाई और सम्मेद शिखरजी पर्वत से मोक्ष प्राप्त किया।'
    },
    symbol: { en: 'Horse / अश्व', hi: 'घोड़ा (अश्व)' },
    color: 'Golden'
  },
  {
    id: '4',
    name: { en: 'Abhinandannath / भगवान अभिनंदननाथ', hi: 'अभिनंदननाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The fourth Tirthankar. Born in Ayodhya to King Sanvara and Queen Siddhartha Devi. His name implies the one who is greeted by both humans and gods because of his extreme purity of soul. He successfully preached the virtues of mind control and equanimity. He attained final liberation at Sammed Shikharji accompanied by thousands of pure ascetics.',
      hi: 'चौथे तीर्थंकर। अयोध्यापति महाराजा संवर और माता सिद्धार्थदेवी के यहाँ जन्म हुआ। इनके जन्म पर देवों और मनुष्यों ने हर्षोल्लासपूर्वक महाभिनंदन किया था। इन्होंने इंद्रियदमन और समताभाव की उत्कृष्ट साधना की और अनगिनत भव्य जीवों का कल्याण कर सम्मेद शिखरजी से मोक्ष पधारे।'
    },
    symbol: { en: 'Monkey / कपीश', hi: 'बंदर (कपि)' },
    color: 'Golden'
  },
  {
    id: '5',
    name: { en: 'Sumatinath / भगवान सुमतिनाथ', hi: 'सुमतिनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The fifth Tirthankar. Born in Ayodhya to King Megha Raja and Queen Mangala Devi. His name denotes "The Lord of Pure Intellect." Even as a prince, he solved highly complex legal and moral disputes of the kingdom using cosmic wisdom. He taught that deep discriminative wisdom (Samyak Mati) is the primary gateway to true spiritual realization. He attained Nirvana at Sammed Shikharji.',
      hi: 'पाँचवें तीर्थंकर। राजा मेघराज और माता मंगलादेवी के पुत्र। "सुमतिनाथ" का अर्थ है सुबुद्धि और पवित्र विचार के स्वामी। राज्यावस्था में ही जटिल विवादों को अपनी तीक्ष्ण प्रज्ञा से चुटकी में सुलझाने के लिए विख्यात थे। उन्होंने बताया कि कुमति त्याग कर सुमति (सच्ची बुद्धि) धारण करना ही कल्याणकारी है। निर्वाण क्षेत्र: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Curlew / क्रौंच', hi: 'चकवा (क्रौंच पक्षी)' },
    color: 'Golden'
  },
  {
    id: '6',
    name: { en: 'Padmaprabha / भगवान पद्मप्रभ', hi: 'पद्मप्रभ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The sixth Tirthankar. Born in Kausambi to King Dharana and Queen Susima Devi. Associated with the red lotus because of his mother’s wish to sleep on a bed of red lotuses during pregnancy. He represents deep devotion and soft, glowing, unattached mindfulness. His body shone like a fresh red lotus. He achieved omniscience and attained Nirvana at Sammed Shikharji.',
      hi: 'छठे तीर्थंकर। कौशाम्बी के राजा धरणराज और माता सुसीमादेवी के यहाँ जन्म लिया। जन्म से ही इनका वर्ण लाल कमल के समान दिव्य दीप्ति युक्त था। कमल के समान निष्कलंक और अनासक्त जीवन जीने का संदेश देने वाले इस देव ने भी जैन धर्म की मोक्ष परंपरा को पुष्ट किया। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Red Lotus / पद्म', hi: 'लाल कमल (पद्म)' },
    color: 'Red'
  },
  {
    id: '7',
    name: { en: 'Suparshvanath / भगवान सुपार्श्वनाथ', hi: 'सुपार्श्वनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The seventh Tirthankar. Born in Varanasi to King Pratishtha and Queen Prithvi Devi. His head was protected by a symbolic canopy of multi-hooded serpents. His name reflects his supreme protective nature and unmatched inner tranquility. He spent years in deep penance to clean all residual karmas, attaining Moksha at Sammed Shikharji.',
      hi: 'सातवें तीर्थंकर। शिवनगरी काशी (वाराणसी) के राजा प्रतिष्ठित और माता पृथ्वीदेवी के आँगन में जन्म हुआ। जैन न्याय, सिद्धांत और आचरण के महान उद्गाता। इनके सिर पर प्राकृतिक नागराज फणों की छाया सुशोभित थी। उन्होंने काशी क्षेत्र से अहिंसा की अमूर्त धारा बहाई और सम्मेद शिखरजी से मोक्ष पाया।'
    },
    symbol: { en: 'Swastika / स्वस्तिक', hi: 'स्वास्तिक' },
    color: 'Golden'
  },
  {
    id: '8',
    name: { en: 'Chandraprabha / भगवान चन्द्रप्रभ', hi: 'चन्द्रप्रभ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The eighth Tirthankar. Born in Chandrapuri to King Mahasena and Queen Lakshmana Devi. His body had a serene silver of the moon, and his birth brought unprecedented calmness and cooling environment in the entire country, which was plagued by warm droughts. He taught the importance of cooling the flames of anger and ego. He attained Moksha at Sammed Shikharji.',
      hi: 'आठवें तीर्थंकर। चंद्रपुरी के राजा महासेन और माता लक्ष्मणादेवी के पुत्र। इनका शरीर चंद्रमा के समान अनुपम श्वेत वर्णी था। क्रोध और मान रूपी तप्त दावाग्नि को शीतल करने के लिए उन्होंने धर्म रूपी सुधा-वृष्टि की। सम्मेद शिखरजी से ही इनका भी निर्वाण कल्यानक हुआ।'
    },
    symbol: { en: 'Moon / चन्द्र', hi: 'चंद्रमा (चन्द्र)' },
    color: 'White'
  },
  {
    id: '9',
    name: { en: 'Pushpadanta (Suvidhinath) / भगवान सुविधिनाथ', hi: 'पुष्पदन्त (सुविधिनाथ) स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The ninth Tirthankar. Born in Kakandi to King Sugriva and Queen Rama Devi. Highly revered for systemizing the daily moral conduct and duties (Suvidhi) of both monk and household life. Because of his sparkling, tooth-like speech purity, he was named Pushpadanta. He obtained final liberation after high penance at Sammed Shikharji.',
      hi: 'नौवें तीर्थंकर। काकन्दी नगरी के राजा सुग्रीव और माता रामादेवी के परम प्रतापी पुत्र। गृहस्थों और मुनियों के आचरण की उत्तम "सुविधि" (विधि-विधान) को पुनः प्रतिष्ठित करने के कारण इन्हें सुविधिनाथ भी कहा जाता है। सम्मेद शिखरजी से सिद्ध पद प्राप्त किया।'
    },
    symbol: { en: 'Crocodile / मकर', hi: 'मगरमच्छ (मकर)' },
    color: 'White'
  },
  {
    id: '10',
    name: { en: 'Sheetalnath / भगवान शीतलनाथ', hi: 'शीतलनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The tenth Tirthankar. Born in Bhaddilpura to King Dridharatha and Queen Sunanda Devi. Legend says his touch brought cooling comfort and instantly cured people of raging physical fevers. He preached the path of deep cooling of the soul (Vitaragata) from the toxic heat of worldly passions. He attained Moksha at Sammed Shikharji.',
      hi: 'दसवें तीर्थंकर। भद्दिलपुर के राजा दृढ़रथ और माता सुनंदादेवी के गृह में जन्म लिया। उनके जन्म लेते ही वहाँ के लोगों की गंभीर दैहिक बीमारियाँ तथा तीव्र ज्वर शांत हो गए। इनका संदेश था: संसार की वासना रूपी गर्मी से बचकर आत्मा में लीन होना ही मोक्ष का शीतल मार्ग है। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Shrivatsa / श्रीवत्स', hi: 'श्रीवत्स चिह्न (कल्पवृक्ष)' },
    color: 'Golden'
  },
  {
    id: '11',
    name: { en: 'Shreyansnath / भगवान श्रेयांसनाथ', hi: 'श्रेयांसनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The eleventh Tirthankar. Born in Simhapuri (modern Sarnath near Varanasi) to King Vishnu Raja and Queen Vishnu Devi. His aura represents complete spiritual progress and wellbeing (Shreyas). He attained omniscience under a Tumbara tree, preaching against cosmic ignorance. He attained Nirvana at Sammed Shikharji.',
      hi: 'ग्यारहवें तीर्थंकर। सारनाथ (सिंहपुरी, वाराणसी) के राजा विष्णुराज और माता विष्णुदेवी के यहाँ जन्मे। "श्रेयांस" का अर्थ है सर्वोच्च कल्याण और प्रगति। उन्होंने संसार के चक्रव्यूह से भ्रमित आत्माओं को आत्म-कल्याण का शाश्वत पथ समझाया। निर्वाण स्थल: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Rhinoceros / खड्गी', hi: 'गेंडा (खड्ग)' },
    color: 'Golden'
  },
  {
    id: '12',
    name: { en: 'Vasupujya / भगवान वासुपूज्य', hi: 'वासुपूज्य स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The twelfth Tirthankar. Born in Champapuri to King Vasupujya and Queen Jaya Devi. He is highly unique for refusing marriage and royalty from his youth, choosing lifelong celibacy and monkhood. His entire life-cycle of five auspicious events (Panch Kalyanaks) occurred in the single holy city of Champapuri, where he also attained his final Moksha. He rejected all worldly wealth (Vasu).',
      hi: 'बारहवें तीर्थंकर। चम्पापुर के राजा वासुपूज्य और माता जयादेवी के पुत्र। वे परम वीतरागी थे जिन्होंने युवावस्था में ही विवाह और राजपाट ठुकराकर बाल ब्रह्मचारी रहते हुए मुनि दीक्षा ली। इनके पाँचों कल्यानक चम्पापुर (बिहार) की पवित्र धरा पर घटित हुए, जहाँ से इन्होंने महान मोक्ष प्राप्त किया।'
    },
    symbol: { en: 'Buffalo / महिष', hi: 'भैंसा (महिष)' },
    color: 'Red'
  },
  {
    id: '13',
    name: { en: 'Vimalnath / भगवान विमलनाथ', hi: 'विमलनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The thirteenth Tirthankar. Born in Kampilaji (modern Kampilya) to King Kritavarman and Queen Syama Devi. His name denotes "Flawless Purity of Spirit and Intellect". He spent many years teaching the dynamic purification of thought, speech, and action. He attained Nirvana at Sammed Shikharji.',
      hi: 'तेरहवें तीर्थंकर। कंपिलाजी के राजा कृतवर्मा और माता श्यामादेवी के पुत्र। "विमल" का अर्थ है पूर्ण स्वच्छता—मन, वचन और काय की परम निर्मलता। उन्होंने आत्मा के कर्म मल को धोने के लिए सम्यक दर्शन, ज्ञान और चरित्र की त्रिवेणी का उपदेश दिया। मोक्ष क्षेत्र: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Boar / वराह', hi: 'सूअर (वराह)' },
    color: 'Golden'
  },
  {
    id: '14',
    name: { en: 'Anantnath / भगवान अनन्तनाथ', hi: 'अनन्तनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The fourteenth Tirthankar. Born in Ayodhya to King Simhasena and Queen Suyasa Devi. His birth unleashed infinite spiritual wisdom and energy in the universe. He spent countless hours in silent meditation, successfully destroying deep root-karmas which bind spirits to rebirths. He attained final liberation at Sammed Shikharji.',
      hi: 'चौदहवें तीर्थंकर। अयोध्यापति राजा सिंहसेन और माता सुयशादेवी के यहाँ अवतरित हुए। जीवन के मूल सत्य और आत्मा की "अनंत" शक्तियों का बोध कराने वाले इन प्रभु ने बताया कि भौतिक संपदा नाशवान है, परंतु आत्मिक सुख अनंत है। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Falcon / श्येन', hi: 'बाज (श्येन)' },
    color: 'Golden'
  },
  {
    id: '15',
    name: { en: 'Dharmanath / भगवान धर्मनाथ', hi: 'धर्मनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The fifteenth Tirthankar. Born in Ratnapuri to King Bhanu Raja and Queen Suvrata Devi. He focused heavily on the expansion of true religion (Dharma) based on compassion, logical inquiry, and non-violence. He clarified the ten main characteristics of religion (Dashalaksana Dharma). He attained Moksha at Sammed Shikharji.',
      hi: 'पंद्रहवें तीर्थंकर। रत्नपुरी के राजा भानुराज और माता सुव्रतादेवी के पुत्र। उन्होंने "दशलक्षण धर्म" (उत्तम क्षमा, मार्दव, आर्जव, शौच आदि) की दार्शनिक विवेचना की और संसार को धर्म के वास्तविक मर्म से परिचित कराया। निर्वाण स्थल: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Vajra / वज्र', hi: 'वज्र वज्रदंड' },
    color: 'Golden'
  },
  {
    id: '16',
    name: { en: 'Shantinath / भगवान शान्तिनाथ', hi: 'शान्तिनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The sixteenth Tirthankar, who also held the magnificent high title of a Chakravartin (World Sovereign Ruler) and Kamadeva (person of supreme beauty). Born in Hastinapur to King Visvasena and Queen Achira Devi. He successfully reconciled warring nations and brought universal peace (Shanti) to a distressed earth. He is worshiped for protection and global peace. He attained Nirvana at Sammed Shikharji.',
      hi: 'सोलहवें तीर्थंकर जो चक्रवर्ती और कामदेव भी थे। हस्तिनापुर के राजा विश्वसेन और माता अचिरादेवी के घर जन्म हुआ। उन्होंने न केवल गृहस्थों को अहिंसा का उपदेश दिया बल्कि चक्रवर्ती राजा के रूप में युद्धरत राज्यों में शांति स्थापित की। वे शांति के आदिप्रणेता माने जाते हैं। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Deer / मृग', hi: 'हिरण (मृग)' },
    color: 'Golden'
  },
  {
    id: '17',
    name: { en: 'Kunthunath / भगवान कुन्थुनाथ', hi: 'कुन्थुनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The seventeenth Tirthankar and also a Chakravartin. Born in Hastinapur to King Sura Raja and Queen Shridevi. He initiated monumental social reforms, ending the slaughter of animals for sacrificial food and promoting universal vegetarianism in kingdoms. He attained final liberation at Sammed Shikharji.',
      hi: 'सत्रहवें तीर्थंकर तथा हस्तिनापुर के दूसरे महान जैन चक्रवर्ती सम्राट। इनके समय में अहिंसा और प्राणिमात्र के प्रति दया भाव का पूरे आर्यावर्त में प्रसार हुआ। उन्होंने यज्ञों में पशुबलि के कुप्रथा को समाप्त कराया। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Goat / अजा', hi: 'बकरा (अज)' },
    color: 'Golden'
  },
  {
    id: '18',
    name: { en: 'Aranath / भगवान अरनाथ', hi: 'अरनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The eighteenth Tirthankar and a Chakravartin monarch. Born in Hastinapur to King Sudarsana and Queen Devi. He taught that even a sovereign ruler of six continents remains a servant of his desires until he surrenders worldly pursuits for self-realization. He attained Nirvana at Sammed Shikharji.',
      hi: 'अठारहवें तीर्थंकर तथा हस्तिनापुर के तीसरे जैन चक्रवर्ती सम्राट। राजा सुदर्शन और माता देवीदेवी के तेजस्वी पुत्र। सांसारिक सुखों को क्षणभंगुर समझकर उन्होंने राजपद त्यागा और तपोमय जीवन अपनाया। निर्वाण स्थल: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Nandyavarta / नंद्यावर्त', hi: 'नंद्यावर्त महामांगलिक चिह्न' },
    color: 'Golden'
  },
  {
    id: '19',
    name: { en: 'Mallinath / भगवान मल्लिनाथ', hi: 'मल्लिनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The nineteenth Tirthankar. Born in Mithila to King Kumbha and Queen Prabhavati Devi. Highly unique for his extreme spiritual intelligence and stunning external beauty. According to the Svetambara tradition, Mallinath was a female princess who chose the path of ascetic restraint, showing the high spiritual status of motherhood and femininity in the cosmos. In the Digambara tradition, he represents the natural ascetic yogi. He attained Nirvana at Sammed Shikharji.',
      hi: 'उन्नीसवें तीर्थंकर। मिथिला नगरी के जनक कुल के राजा कुंभराज और माता प्रभावतीदेवी के आँगन में अवतरण। श्वेतांबर परंपरा के अनुसार ये साक्षात स्त्री रत्न थे जिन्होंने साधना के शिखर को छूकर स्त्री मोक्ष को प्रमाणित किया, जबकि दिगंबर धर्म में इन्हें दिगंबर योगी माना गया है। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Kalasha / कलश', hi: 'कलश (घड़ा)' },
    color: 'Blue'
  },
  {
    id: '20',
    name: { en: 'Munisuvratnath / भगवान मुनिसुव्रतनाथ', hi: 'मुनिसुव्रतनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The twentieth Tirthankar of the present era. Born in Rajgriha to King Sumitra and Queen Padmavati Devi. Highly venerated as the contemporary saint of the Ramayana era; Lord Rama was a contemporary of Lord Munisuvratnath. His name indicates the one who practices perfect silence and highly dedicated vows (Vratas). He is sought for astrological peace from the negative planetary effect of Saturn (Shani). He attained Nirvana at Sammed Shikharji.',
      hi: 'बीसवें तीर्थंकर। मगध की प्राचीन राजधानी राजगृह के राजा सुमित्र और माता पद्मावतीदेवी के पुत्र। भगवान रामचन्द्रजी के समकालीन। "मुनिसुव्रत" अर्थात् मुनियों की तरह मौन और नियमों का दृढ़तापूर्वक पालन करने वाले। शनि ग्रह के क्रूर प्रभाव को दूर करने के लिए इनकी वंदना अद्भुत फलदायी मानी जाती है। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Tortoise / कूर्म', hi: 'कछुआ (कूर्म)' },
    color: 'Black'
  },
  {
    id: '21',
    name: { en: 'Naminath / भगवान नमिनाथ', hi: 'नमिनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The twenty-first Tirthankar. Born in Mithila to King Vijaya and Queen Vapra Devi. Legend says when his mother was pregnant, her calm energy instantly subdued a raging rebellion on the borders without shedding a single drop of blood, hence named Nami ("One whose presence causes all enemies to bow down"). He attained Moksha at Sammed Shikharji.',
      hi: 'इक्कीसवें तीर्थंकर। राजा विजय और माता वप्रादेवी के यहाँ जन्म हुआ। इनके गर्भावतरण काल में ही साम्राज्य की भीषण शत्रु बगावत बिना अस्त्र उठाए ही शांत मस्तक हो गई। इन्होंने आत्मसंयम और शत्रु-दमन की महान वीतराग विधि सिखाई। निर्वाण: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Blue Lotus / उत्पल', hi: 'नीलकमल (उत्पल)' },
    color: 'Golden'
  },
  {
    id: '22',
    name: { en: 'Neminath (Arishtanemi) / भगवान नेमिनाथ', hi: 'नेमिनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The twenty-second Tirthankar. Born in Dwaraka to King Samudravijaya and Queen Shiva Devi. He is the biological cousin of Lord Krishna, the ruler of Dwaraka. When Lord Neminath was driving his chariot to marry Princess Rajul, he heard the terrifying screams of thousands of animals locked in cages destined to be slaughtered for the wedding feast. Moved by supreme compassion (Karuna), he instantly turned his chariot back, abandoned the wedding, took initiation of Digambara monkhood, and went to Mount Girnar where he practiced extreme dhyana. Princess Rajul also became a nun. He attained omniscience and final Nirvana at Mount Girnar.',
      hi: 'बाईसवें तीर्थंकर। द्वारका के राजा समुद्रविजय (भगवान कृष्ण के ताऊ) और माता शिवादेवी के पुत्र। भगवान श्रीकृष्ण के चचेरे भाई। इनकी मंगनी जूनागढ़ की राजकुमारी राजुल (राजीमती) से हुई थी। बारात के समय जब उन्होंने विवाह भोज के लिए पिंजरों में कैद बेजुबान पशुओं की करुण चीख सुनी, तो दयावश उन्होंने रथ वापस मोड़ लिया, विवाह रद्द कर दिया और तुरंत गिरनार पर्वत पर जाकर दिगंबर मुनि दीक्षा ले ली। राजकुमारी राजुल भी आर्यिका बन गईं। उन्होंने गिरनार पर्वत (गुजरात) की पाँचवीं टोंक से मोक्ष प्राप्त किया।'
    },
    symbol: { en: 'Conch / शंख', hi: 'शंख' },
    color: 'Black'
  },
  {
    id: '23',
    name: { en: 'Parshvanath / भगवान पार्श्वनाथ', hi: 'पार्श्वनाथ स्वामी' },
    kaal: 'Present',
    details: {
      en: 'The twenty-third Tirthankar, who is highly praised as a historic savior. Born in Varanasi to King Asvasena and Queen Vama Devi. He saved a boiling serpent (Nag) trapped inside firewood by a corrupt ascetic named Kamath, reciting the sacred Navkar Mantra to the dying snake (who was reborn as King of Serpents, Dharanendra). Later, when Kamath (reborn as demon Samvara) attacked Parshvanath with horrific rock rains during his penance, Dharanendra spread a great multi-headed serpent hood to shelter the Lord. His legacy of establishing the four-fold path of restraint is globally recognized. He attained Nirvana at Sammed Shikharji atop the beautiful Parasnath Peak.',
      hi: 'तेईसवें तीर्थंकर, जिनका ऐतिहासिक अस्तित्व अकाट्य रूप से प्रमाणित है। काशीराज अश्वसेन और माता वामादेवी के पुत्र। उन्होंने छद्म मुनि कमठ की धूनी में जलते नाग-नागिन के जोड़े को बाहर निकाला और उन्हें मरणासन्न अवस्था में णमोकार मंत्र सुनाया (जो बाद में धरणेन्द्र और पद्मावती देवी बने)। जब कमठ (मेघमाली) ने तपस्यालीन भगवान पार्श्वनाथ पर मूसलाधार पत्थरों की बारिश का घोर उपसर्ग किया, तो धरणेन्द्र ने अपने फणों का छत्र फैलाकर रक्षा की। इन्होंने सत्य, अहिंसा, अचौर्य और अपरिग्रह का चातुर्याम धर्म सिखाया जो अत्यंत लोकप्रिय हुआ। निर्वाण स्थल: सम्मेद शिखरजी।'
    },
    symbol: { en: 'Serpent / फणीन्द्र', hi: 'सर्प (नाग फण)' },
    color: 'Blue'
  },
  {
    id: '24',
    name: { en: 'Mahavira (Vardhamana) / भगवान महावीर', hi: 'महावीर स्वामी (२४वें तीर्थंकर)' },
    kaal: 'Present',
    details: {
      en: 'The 24th and final Tirthankar of the current era. Born in Kundalpur (Bihar) to King Siddhartha and Queen Trishala Devi in 599 BCE. Renouncing crown, riches, and familial bonds, he entered deep asceticism at age 30, practicing absolute non-possession and enduring horrific physical abuses with unshakeable equanimity. He attained omniscience (Kevala Jnana) under a Sal tree. He spread the ultimate gospel of Ahimsa (Non-violence) and Anekantavada (multi-faceted logic), revolutionizing modern thought. He added the fifth vow of Brahmacharya (Celibacy) and attained Nirvana at Pawapuri, Bihar, in 527 BCE.',
      hi: 'वर्तमान युग के २४वें और अंतिम तीर्थंकर। ईसा पूर्व ५९९ में बिहार के विख्यात कुण्डलपुर साम्राज्य में राजा सिद्धार्थ और माता त्रिशला देवी के यहाँ जन्म हुआ। ३० वर्ष की आयु में राजमहलों के ऐश्वर्य को ठुकराकर उन्होंने दिगंबर दीक्षा ली और १२ वर्षों तक घोर तपस्या की, जिसमें चंडकौशिक सर्प डंस, शूलपाणि यक्ष और कानों में कीले ठोकने जैसे दारुण उपसर्ग सहे। ऋजुबालिका नदी तट पर उन्होंने केवलज्ञान प्राप्त किया और "जियो और जीने दो" का अहिंसक धर्मचक्र चलाया। अनेकांतवाद (सहिष्णुता का सिद्धांत) और ब्रह्मचर्य व्रत जोड़कर उन्होंने सामाजिक न्याय की पुनर्प्रतिष्ठा की। ईसा पूर्व ५२७ में पावापुरी (बिहार) के जल मंदिर से महामोक्ष प्राप्त किया।'
    },
    symbol: { en: 'Lion / सिंह', hi: 'सिंह (शेर)' },
    color: 'Golden'
  },

  // Past Era (Chauvisi)
  {
    id: 'P1',
    name: { en: 'Nirvan / निर्वाण देव', hi: 'निर्वाण देव' },
    kaal: 'Past',
    details: {
      en: 'The first Tirthankar of the past cosmic era of Avasarpini cycle. He initiated the moral civilization and preached early non-violent codes to souls of the ancient cycle.',
      hi: 'अतीत चौबीसी के प्रथम तीर्थंकर। पूर्व कालखंड की आदि बेला में अहिंसा और मोक्ष का आदि संदेश दिया।'
    },
    symbol: { en: 'Elephant / गज', hi: 'हाथी (गज)' },
    color: 'Golden'
  },
  {
    id: 'P2',
    name: { en: 'Sagar / सागर देव', hi: 'सागर देव' },
    kaal: 'Past',
    details: {
      en: 'The second Tirthankar of the past cosmic era. His life was celebrated for calming chaotic wars, establishing tranquility and early monastic institutions.',
      hi: 'अतीत काल के द्वितीय तीर्थंकर, जिनका शासन काल आध्यात्मिक संचेतना और शांति के लिए विख्यात है।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P3',
    name: { en: 'Mahasagar / महासागर देव', hi: 'महासागर देव' },
    kaal: 'Past',
    details: {
      en: 'The third Tirthankar of the past era. Preached the three jewels (Samyak Darshana, Samyak Jnana, Samyak Charitra) to millions of wandering spirits.',
      hi: 'अतीत काल के तीसरे तीर्थंकर। अनंत आत्माओं को भटकने से बचाने के लिए सम्यक दर्शन का मार्ग उद्घाटित किया।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P4',
    name: { en: 'Vimalprabha / विमलप्रभ देव', hi: 'विमलप्रभ देव' },
    kaal: 'Past',
    details: {
      en: 'The fourth Tirthankar of the past era. Celebrated for his absolute purity of soul and clearing massive misconceptions regarding karmic theory.',
      hi: 'अतीत काल के चौथे तीर्थंकर। कर्म सिद्धांत की भ्रांतियों का निवारण कर मोक्ष पद्धति को सुगम बनाया।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'P24',
    name: { en: 'Antah / अंतः देव', hi: 'अंतः देव' },
    kaal: 'Past',
    details: {
      en: 'The 24th and final Tirthankar of the past era. He concluded the past Chauvisi before a vast transition of cosmic ages, leaving an eternal footprint.',
      hi: 'अतीत काल के २४वें और अंतिम तीर्थंकर, जिन्होंने तत्कालीन मोक्ष संघ की व्यवस्था को उत्कृष्ट संबल प्रदान किया।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },

  // Future Era (Chauvisi)
  {
    id: 'F1',
    name: { en: 'Padmanabha (Soul of Shrenik) / पद्मनाभ', hi: 'पद्मनाभ देव (श्रेणिक की शुद्ध आत्मा)' },
    kaal: 'Future',
    details: {
      en: 'The first Tirthankar of the upcoming future era. He is currently the pure celestial soul of King Shrenik Bimbisara of Magadha (who was a contemporary devotee of Lord Mahavira). Because of his high devotion, he bound Tirthankar-nam-karma and will guide future humanity.',
      hi: 'आगामी भविष्य काल के प्रथम तीर्थंकर। मगध सम्राट राजा श्रेणिक बिम्बिसार (भगवान महावीर के प्रमुख समवशरण भक्त) की पवित्र आत्मा, जो आगामी काल में प्रथम तीर्थंकर "पद्मनाभ" के रूप में अवतरित होकर धर्म कल्याण करेंगी।'
    },
    symbol: { en: 'Lotus / पद्म', hi: 'पद्म (कमल)' },
    color: 'Golden'
  },
  {
    id: 'F2',
    name: { en: 'Surdev / सुरदेव', hi: 'सुरदेव' },
    kaal: 'Future',
    details: {
      en: 'The second Tirthankar of the future era. He is the pure soul of Suparshva (the loving uncle of Lord Mahavira), celebrated for deep self-restraint and spiritual potential.',
      hi: 'आगामी युग के द्वितीय तीर्थंकर। वर्तमान काल के भगवान महावीर के चाचा सुपार्श्व की पवित्र आत्मा भविष्य में संपूर्ण जीव दया का मर्म समझाने हेतु अवतरित होगी।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F3',
    name: { en: 'Suparshva (Soul of Konika) / सुपार्श्व', hi: 'सुपार्श्व देव (कोणिक की आत्मा)' },
    kaal: 'Future',
    details: {
      en: 'The third Tirthankar of the future era. The pure soul of Prince Konika (King Shreniks son), reincarnating to set an example of deep confession, inner cleanup, and eventual supreme enlightenment.',
      hi: 'आगामी युग के तीसरे तीर्थंकर। राजा श्रेणिक के पुत्र कुमार कोणिक की विशुद्ध आत्मा कषायों के विनाश के पश्चात् केवलज्ञान का उपदेश देगी।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F4',
    name: { en: 'Svayamprabha / स्वयंप्रभ', hi: 'स्वयंप्रभ देव' },
    kaal: 'Future',
    details: {
      en: 'The fourth Tirthankar of the future era. He will guide souls out of the illusions of materialistic dark Ages into the brilliant light of self-realization.',
      hi: 'आगामी भविष्य काल के चौथे तीर्थंकर, जो भविष्य के समाज को अहिंसक आचरण की क्रांतिकारी दीक्षा प्रदान करेंगे।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  },
  {
    id: 'F24',
    name: { en: 'Bhadrakirti / भद्रकीर्ति', hi: 'भद्रकीर्ति देव' },
    kaal: 'Future',
    details: {
      en: 'The 24th and last Tirthankar of the upcoming future era. He will conclude the future assembly of enlightened beings in the future cycle, attaining liberation.',
      hi: 'भविष्य चौबीसी के २४वें और अंतिम तीर्थंकर। यह देव मोक्ष के प्राचीनतम और कल्याणकारी मार्ग को भविष्य के जीवों के लिए पूर्णता प्रदान करेंगे।'
    },
    symbol: { en: 'Unknown', hi: 'अज्ञात' },
    color: 'Golden'
  }
];
