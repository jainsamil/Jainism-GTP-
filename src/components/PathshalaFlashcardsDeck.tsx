import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Search, Sparkles, CheckCircle2, Bookmark, RefreshCw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Flashcard {
  id: string;
  category: 'emblems' | 'principles' | 'symbols';
  title: { en: string; hi: string };
  pronunciation: { en: string; hi: string };
  image: string; // Emoji or visual representation
  color: string; // gradient classes
  description: { en: string; hi: string };
  detail: { en: string; hi: string };
}

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: "fc_1",
    category: "emblems",
    title: { en: "Adinath (Rishabhdev)", hi: "आदिनाथ (भगवान ऋषभदेव)" },
    pronunciation: { en: "Aadi-naath Rishabh-dev", hi: "आदिनाथ भगवान ऋषभदेव" },
    image: "🐂",
    color: "from-amber-500/10 to-orange-500/10 border-orange-500/20",
    description: { en: "The First Tirthankar of Jainism.", hi: "जैन धर्म के प्रथम तीर्थंकर।" },
    detail: { 
      en: "Emblem: Bull (वृषभ). Adinath established society, taught agriculture, writing, and arts before attaining absolute liberation (Nirvana) on Mt. Ashtapada.", 
      hi: "चिन्ह: बैल (वृषभ)। भगवान आदिनाथ ने मानव समाज को कृषि, लेखन, कला और शासन व्यवस्था सिखाई। अष्टापद पर्वत से मोक्ष पधारे।" 
    }
  },
  {
    id: "fc_2",
    category: "emblems",
    title: { en: "Mahavir Swami", hi: "भगवान महावीर स्वामी" },
    pronunciation: { en: "Bhag-waan Ma-ha-veer Swa-mee", hi: "भगवान महावीर स्वामी" },
    image: "🦁",
    color: "from-red-500/10 to-orange-500/10 border-red-500/20",
    description: { en: "The 24th and Final Tirthankar.", hi: "२४वें और अंतिम तीर्थंकर।" },
    detail: { 
      en: "Emblem: Lion (सिंह). Rejuvenated the path of absolute non-violence (Ahimsa), self-restraint, and multifaceted perspective (Anekantavada). Attained Nirvana at Pavapuri.", 
      hi: "चिन्ह: सिंह (शेर)। अहिंसा, संयम और अनेकांतवाद की पावन शिक्षाओं का प्रसार किया। पावापुरी जी से मोक्ष गमन हुआ।" 
    }
  },
  {
    id: "fc_3",
    category: "emblems",
    title: { en: "Parshvanath Swami", hi: "भगवान पार्श्वनाथ स्वामी" },
    pronunciation: { en: "Bhag-waan Paarsh-wa-naath Swa-mee", hi: "भगवान पार्श्वनाथ स्वामी" },
    image: "🐍",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    description: { en: "The 23rd Tirthankar of Jainism.", hi: "२३वें तीर्थंकर भगवान पार्श्वनाथ।" },
    detail: { 
      en: "Emblem: Serpent (सर्प). Renowned for extreme compassion, he saved a pair of snakes from a fire (who became Dharanendra Dev). Attained Nirvana on Mt. Sammed Shikharji.", 
      hi: "चिन्ह: सर्प (सांप)। दयालुता के सागर, अग्नि में जलते नाग-नागिन को बचाकर महामंत्र नवकार सुनाया। सम्मेद शिखरजी से मोक्ष पधारे।" 
    }
  },
  {
    id: "fc_4",
    category: "emblems",
    title: { en: "Shantinath Swami", hi: "भगवान शांतिनाथ स्वामी" },
    pronunciation: { en: "Bhag-waan Shaan-tee-naath Swa-mee", hi: "भगवान शांतिनाथ स्वामी" },
    image: "🦌",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    description: { en: "The 16th Tirthankar & Chakravartin.", hi: "१६वें तीर्थंकर एवं चक्रवर्ती सम्राट।" },
    detail: { 
      en: "Emblem: Deer (मृग). He brought supreme peace and prosperity to the world, cooling pandemics and war. Attained Nirvana on Sammed Shikharji.", 
      hi: "चिन्ह: हिरण (मृग)। जगत में परम शांति और सुभिक्ष की स्थापना करने वाले महान तीर्थंकर। सम्मेद शिखरजी पर्वत से मोक्ष पधारे।" 
    }
  },
  {
    id: "fc_5",
    category: "principles",
    title: { en: "Ahimsa Parmo Dharmah", hi: "अहिंसा परमो धर्मः" },
    pronunciation: { en: "A-him-saa Par-ma-haa Dhar-mah", hi: "अहिंसा परमो धर्मः" },
    image: "🕊️",
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    description: { en: "Supreme Principle: Non-Violence.", hi: "परम पावन जैन सिद्धांत: अहिंसा।" },
    detail: { 
      en: "Not hurting any living creature—whether tiny insects, plants, animals, or humans—by our thoughts (Man), speech (Vachan), or actions (Kaya).", 
      hi: "किसी भी जीव - चाहे वह कीड़े-मकोड़े हों, पेड़-पौधे हों या मनुष्य - को मन, वचन या काय (शरीर) से कष्ट न पहुंचाना और सब पर दया रखना।" 
    }
  },
  {
    id: "fc_6",
    category: "principles",
    title: { en: "Aparigraha", hi: "अपरिग्रह व्रत" },
    pronunciation: { en: "A-pa-ree-gra-ha", hi: "अपरिग्रह महाव्रत" },
    image: "📦",
    color: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20",
    description: { en: "Principle of Non-Possessiveness.", hi: "अनावश्यक संग्रह न करने का व्रत।" },
    detail: { 
      en: "Limiting our wants, desires, and worldly belongings. Sharing extra resources with needy souls instead of hoarding materials greedily.", 
      hi: "अपनी इच्छाओं और वस्तुओं के संचय को सीमित करना। लालच छोड़कर अपनी आवश्यकताओं से अधिक वस्तुओं को जरूरतमंदों में बांटना।" 
    }
  },
  {
    id: "fc_7",
    category: "principles",
    title: { en: "Anekantavada", hi: "अनेकांतवाद सिद्धांत" },
    pronunciation: { en: "A-nay-kaant-waad", hi: "अनेकांतवाद" },
    image: "🔮",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
    description: { en: "Multiplicity of Viewpoints.", hi: "सच्चाई को अलग-अलग दृष्टिकोण से देखना।" },
    detail: { 
      en: "Every truth has multiple dimensions. Just like the story of the blind men and the elephant, we must respect other peoples' perspectives with open minds.", 
      hi: "हर बात के अनेक पहलू होते हैं। अंधे हाथियों की कहानी की तरह, हमें दूसरों के विचारों को उदारता से समझकर आपसी मतभेदों को मिटाना चाहिए।" 
    }
  },
  {
    id: "fc_8",
    category: "symbols",
    title: { en: "Sacred Swastika", hi: "मंगलमय स्वस्तिक" },
    pronunciation: { en: "Swaas-tee-ka", hi: "मंगल स्वस्तिक चिन्ह" },
    image: "卐",
    color: "from-orange-500/10 to-yellow-500/10 border-orange-500/20",
    description: { en: "Jain symbol of four rebirth realms.", hi: "चार गतियों का निरूपण करने वाला मंगल चिन्ह।" },
    detail: { 
      en: "The 4 arms represent the 4 places where a soul can take birth: Heavenly beings, Human, Animal/Sub-human, and Hell. We aim to rise above these 4 paths.", 
      hi: "स्वस्तिक की ४ भुजाएँ आत्मा की ४ गतियों (देवगति, मनुष्यगति, तिर्यंचगति, नरकगति) को दर्शाती हैं। हमें इनके चक्र से छूटकर सिद्ध बनना है।" 
    }
  },
  {
    id: "fc_9",
    category: "symbols",
    title: { en: "Three Dots (Ratnatraya)", hi: "सम्यक रत्नत्रय तीन बिंदु" },
    pronunciation: { en: "Rat-na-tra-ya teen bin-doo", hi: "सम्यक रत्नत्रय" },
    image: "✨",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    description: { en: "The Three Jewels of Liberation.", hi: "मोक्ष मार्ग के तीन बहुमूल्य रत्न।" },
    detail: { 
      en: "Represent Samyak Darshan (Right Faith), Samyak Gyan (Right Knowledge), and Samyak Charitra (Right Conduct). Together they lead the soul to freedom.", 
      hi: "सभ्य श्रद्धा (सम्यक दर्शन), सम्यक ज्ञान और सम्यक आचरण (चारित्र)। यह तीनों मिलकर ही आत्मा को परमात्मा बनाते हैं।" 
    }
  },
  {
    id: "fc_10",
    category: "symbols",
    title: { en: "Siddhashila Crescent", hi: "सिद्धशिला चन्द्र" },
    pronunciation: { en: "Sid-dha-shee-laa cray-sent", hi: "सिद्धशिला" },
    image: "🌙",
    color: "from-violet-500/10 to-pink-500/10 border-violet-500/20",
    description: { en: "The Abode of Liberated Souls.", hi: "सिद्ध परमात्माओं का शाश्वत लोक।" },
    detail: { 
      en: "The crescent moon curve represents Siddhashila, located at the very top of the universe, where pure liberated souls rest in infinite happiness.", 
      hi: "स्वस्तिक के ऊपर का अर्धचन्द्र सिद्धशिला को दर्शाता है, जो ब्रह्मांड के सर्वोच्च शिखर पर है। यहाँ सभी सिद्ध आत्माएं अनंत सुख में विराजमान हैं।" 
    }
  },
  {
    id: "fc_11",
    category: "emblems",
    title: { en: "Neminath Swami", hi: "भगवान नेमिनाथ स्वामी" },
    pronunciation: { en: "Bhag-waan Ne-mee-naath Swa-mee", hi: "भगवान नेमिनाथ स्वामी" },
    image: "🐚",
    color: "from-sky-500/10 to-indigo-500/10 border-sky-500/20",
    description: { en: "The 22nd Tirthankar of Jainism.", hi: "२२वें तीर्थंकर भगवान नेमिनाथ।" },
    detail: { 
      en: "Emblem: Conch (शंख). Cousin of Lord Krishna. Renounced the world on his wedding day upon hearing the painful cries of animals to be slaughtered for the feast, preaching absolute compassion for all living beings.", 
      hi: "चिन्ह: शंख। भगवान श्री कृष्ण के अनुज (चचेरे भाई)। अपने विवाह के दिन पशुओं की करुण पुकार सुनकर राजसी वस्त्र त्याग दिए और गिरनार पर्वत से दीक्षा लेकर मोक्ष पधारे।" 
    }
  },
  {
    id: "fc_12",
    category: "emblems",
    title: { en: "Mallinath Swami", hi: "भगवान मल्लिनाथ स्वामी" },
    pronunciation: { en: "Bhag-waan Mal-lee-naath Swa-mee", hi: "भगवान मल्लिनाथ स्वामी" },
    image: "🏺",
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20",
    description: { en: "The 19th Tirthankar of Jainism.", hi: "१९वें तीर्थंकर भगवान मल्लिनाथ।" },
    detail: { 
      en: "Emblem: Water Pot (कलश). A symbol of purity, detachment, and supreme wisdom. Attained absolute omniscience and showed that all pure souls have equal potential for ultimate liberation.", 
      hi: "चिन्ह: कलश। पवित्रता और वैराग्य के प्रतीक भगवान मल्लिनाथ। उन्होंने सिद्ध किया कि सभी भव्य जीव पुरुषार्थ द्वारा मोक्ष प्राप्त कर सकते हैं।" 
    }
  },
  {
    id: "fc_13",
    category: "principles",
    title: { en: "Satya (Truthfulness)", hi: "सत्य महाव्रत" },
    pronunciation: { en: "Sat-ya Ma-haa-vrat", hi: "सत्य महाव्रत" },
    image: "🗣️",
    color: "from-teal-500/10 to-emerald-500/10 border-teal-500/20",
    description: { en: "Vow of Speaking Truth.", hi: "हित, मित और प्रिय वचन बोलना।" },
    detail: { 
      en: "Speaking what is true, beneficial, and pleasant. Avoiding false speech, rumors, or words that cause pain, anger, or misunderstanding to any living soul.", 
      hi: "सदैव सत्य, कल्याणकारी और मधुर बोलना। झूठ, निंदा, क्रोध या किसी जीव को ठेस पहुँचाने वाले कठोर वचनों का त्याग करना।" 
    }
  },
  {
    id: "fc_14",
    category: "principles",
    title: { en: "Asteya (Non-Stealing)", hi: "अचौर्य (अस्तेय) महाव्रत" },
    pronunciation: { en: "A-chaur-ya Ma-haa-vrat", hi: "अस्तेय महाव्रत" },
    image: "🤝",
    color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20",
    description: { en: "Vow of Non-Stealing.", hi: "बिना दी हुई वस्तु को ग्रहण न करना।" },
    detail: { 
      en: "Not taking anything that belongs to others without their explicit consent. Respecting other people's property, rights, and intellectual creations.", 
      hi: "किसी की भी अनुमति या सहमति के बिना उसकी कोई वस्तु ग्रहण न करना। दूसरों के अधिकारों, संपत्ति और श्रम का आदर करना।" 
    }
  },
  {
    id: "fc_15",
    category: "principles",
    title: { en: "Brahmacharya (Chastity)", hi: "ब्रह्मचर्य महाव्रत" },
    pronunciation: { en: "Brah-ma-char-ya Ma-haa-vrat", hi: "ब्रह्मचर्य महाव्रत" },
    image: "🧘",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    description: { en: "Vow of Self-Restraint.", hi: "मन, वचन और काय से पवित्र आचरण।" },
    detail: { 
      en: "Purity of mind, body, and senses. Directing our energy inwards toward spiritual growth rather than external sensory pleasures.", 
      hi: "इंद्रियों का संयम और काम वासनाओं का त्याग। अपनी ऊर्जा को बाहरी भोग-विलास से हटाकर आत्मा के शुद्ध स्वरूप के ध्यान में लगाना।" 
    }
  },
  {
    id: "fc_16",
    category: "principles",
    title: { en: "Namokar Mantra", hi: "महामंत्र नवकार" },
    pronunciation: { en: "Na-mo-kaar Man-tra", hi: "णमोकार महामंत्र" },
    image: "📿",
    color: "from-red-500/10 to-yellow-500/10 border-red-500/20",
    description: { en: "The Supreme Non-Sectarian Mantra.", hi: "जगत का सर्वोत्तम अनादि-निधन महामंत्र।" },
    detail: { 
      en: "Jainism's central prayer saluting the five supreme spiritual stations (Panch Parmeshthi): Arihants, Siddhas, Acharyas, Upadhyayas, and Sadhus. It seeks no worldly favors but bows to holy virtues.", 
      hi: "पंच परमेष्ठी (अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु) को समर्पित परम पावन महामंत्र। यह किसी व्यक्ति को नहीं, बल्कि उनके पावन गुणों को नमन करता है।" 
    }
  },
  {
    id: "fc_17",
    category: "symbols",
    title: { en: "Jinavani Saraswati", hi: "जिनवाणी माता (सरस्वती)" },
    pronunciation: { en: "Ji-na-vaa-nee Maa-taa", hi: "जिनवाणी माता सरस्वती" },
    image: "📖",
    color: "from-violet-500/10 to-indigo-500/10 border-violet-500/20",
    description: { en: "The Sacred Teachings of Tirthankars.", hi: "तीर्थंकरों की दिव्य देशना और जिनवाणी।" },
    detail: { 
      en: "The written scriptures holding the direct teachings of the omniscient lords. It is revered as a mother (Jinavani Mata) that guides souls from ignorance to absolute light.", 
      hi: "सर्वज्ञ तीर्थंकरों के मुखारविंद से खिरी दिव्य वाणी, जिसे गंधरों ने शास्त्रों में संकलित किया। यह आत्मा को अज्ञान से हटाकर ज्ञान प्रकाश की ओर ले जाती है।" 
    }
  },
  {
    id: "fc_18",
    category: "principles",
    title: { en: "Samayika (Equanimity Meditation)", hi: "सामायिक साधना" },
    pronunciation: { en: "Saa-maa-yee-ka Saadh-naa", hi: "सामायिक साधना" },
    image: "⏳",
    color: "from-blue-500/10 to-teal-500/10 border-blue-500/20",
    description: { en: "48-Minute Spiritual Practice.", hi: "४८ मिनट की समता और ध्यान साधना।" },
    detail: { 
      en: "A practice of sitting in complete silence, renouncing all worldly tasks and desires for 48 minutes to experience internal peace and treat all living beings with equal love (Samatva).", 
      hi: "सांसारिक राग-द्वेष और व्यापारों का त्याग कर ४८ मिनट तक आत्मा में लीन होना। सभी जीवों के प्रति शत्रु-मित्र का भेद मिटाकर समता भाव धारण करना।" 
    }
  },
  {
    id: "fc_19",
    category: "symbols",
    title: { en: "Jina Dhvaja (Jain Flag)", hi: "पंचरंगी जैन ध्वज" },
    pronunciation: { en: "Ji-na Dhwa-ja", hi: "पंचरंगी जैन ध्वज" },
    image: "🏳️‍🌈",
    color: "from-orange-500/10 to-emerald-500/10 border-orange-500/20",
    description: { en: "The Holy Five-Colored Flag.", hi: "पांच रंग का मंगलमय ध्वज।" },
    detail: { 
      en: "Five horizontal bands: Red (Arihant), Yellow (Siddha), White (Acharya), Green (Upadhyaya), and Dark Blue/Black (Sadhu). Represents the path of spiritual purity.", 
      hi: "लाल (अरिहंत), पीला (सिद्ध), सफेद (आचार्य), हरा (उपाध्याय) और नीला/काला (साधु) - ये पांच रंग पंच परमेष्ठी के प्रतीक हैं जो आत्मा की शुद्धि का मार्ग दर्शाते हैं।" 
    }
  },
  {
    id: "fc_20",
    category: "principles",
    title: { en: "Pratikraman (Self-Reflection)", hi: "प्रतिक्रमण क्रिया" },
    pronunciation: { en: "Pra-tee-kra-man", hi: "प्रतिक्रमण साधना" },
    image: "🌅",
    color: "from-pink-500/10 to-orange-500/10 border-pink-500/20",
    description: { en: "Daily Ritual of Forgiveness.", hi: "दैनिक पश्चाताप और शुद्धि क्रिया।" },
    detail: { 
      en: "Reflecting on one's daily thoughts and actions, repenting for any harm caused to living beings, and resolving to walk a path of pure compassion in the future.", 
      hi: "दिन भर में जाने-अनजाने हुए पापों, भूलों और जीवों को पहुंचाई गई क्षति के लिए क्षमा याचना करना और स्वयं को दोषों से मुक्त कर सन्मार्ग पर बढ़ना।" 
    }
  },
  {
    id: "fc_21",
    category: "principles",
    title: { en: "Sallekhana (Santhara)", hi: "सल्लेखना (संथारा व्रत)" },
    pronunciation: { en: "Sal-lay-kha-naa San-thaa-raa", hi: "सल्लेखना संथारा व्रत" },
    image: "🌌",
    color: "from-zinc-500/10 to-slate-500/10 border-zinc-500/20",
    description: { en: "The Vow of Peaceful Transition.", hi: "शांत समाधिमरण का पवित्र व्रत।" },
    detail: { 
      en: "A spiritual vow to voluntarily reduce intake of food and water under the guidance of gurus when death is near, maintaining complete peace and focus on the soul.", 
      hi: "जब जीवन का अंत निकट हो, तो गुरुओं के सानिध्य में क्रोध, मोह त्यागकर अन्न-जल का क्रमशः त्याग करना और शांत चित्त से समाधिमरण (मोक्ष की ओर कदम) धारण करना।" 
    }
  },
  {
    id: "fc_22",
    category: "symbols",
    title: { en: "Ashtamangala Symbols", hi: "अष्टमंगल चिन्ह" },
    pronunciation: { en: "Ash-ta-man-ga-la", hi: "अष्टमंगल" },
    image: "✨",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
    description: { en: "Eight Auspicious Symbols.", hi: "आठ परम कल्याणकारी शुभ चिन्ह।" },
    detail: { 
      en: "Eight sacred objects (Swastika, Srivatsa, Nandyavarta, Vardhamanaka, Bhadrasana, Kalasha, Minayugala, Darpana) representing prosperity, protection, and divine energy.", 
      hi: "आठ मंगलकारी प्रतीक (स्वस्तिक, श्रीवत्स, नंद्यावर्त, वर्धमानक, भद्रासन, कलश, मत्स्ययुगल, दर्पण) जो जैन पूजा और उत्सवों में पवित्रता लाते हैं।" 
    }
  },
  {
    id: "fc_23",
    category: "principles",
    title: { en: "Kashaya Tyaga (Conquering Anger)", hi: "कषाय त्याग" },
    pronunciation: { en: "Ka-shaa-ya Tya-ga", hi: "कषाय (क्रोध, मान, माया, लोभ) त्याग" },
    image: "⚔️",
    color: "from-rose-500/10 to-red-500/10 border-rose-500/20",
    description: { en: "Overcoming Four Passions.", hi: "क्रोध, मान, माया और लोभ पर विजय।" },
    detail: { 
      en: "Jainism teaches that anger (Krodh), pride (Maan), deceit (Maya), and greed (Lobha) bind the soul with karma. Conquering them reveals our true calm nature.", 
      hi: "आत्मा के चार बड़े शत्रु: क्रोध, मान (अहंकार), माया (छल-कपट) और लोभ। इन कषायों को शांत कर आत्मा के क्षमा और संतोष रूपी स्वभाव को जगाना।" 
    }
  },
  {
    id: "fc_24",
    category: "principles",
    title: { en: "Swadhyay (Self-Study)", hi: "स्वाध्याय साधना" },
    pronunciation: { en: "Swaadh-yaa-ya", hi: "स्वाध्याय परम तप" },
    image: "🕯️",
    color: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
    description: { en: "Self-Study is the Greatest Penance.", hi: "ज्ञान अर्जन और शास्त्रों का पठन-मनन।" },
    detail: { 
      en: "Contemplating and reading spiritual books to clear doubts, increase knowledge, and realize the true nature of the self. Regarded as a powerful internal austerity.", 
      hi: "संशय दूर करने और आत्मज्ञान बढ़ाने के लिए प्रतिदिन जिनवाणी का अध्ययन, मनन, चिंतन और प्रवचन सुनना। इसे जैन धर्म में सबसे बड़ा आंतरिक तप माना गया है।" 
    }
  },
  {
    id: "fc_25",
    category: "emblems",
    title: { en: "Ajitnath Swami", hi: "भगवान अजीतनाथ स्वामी" },
    pronunciation: { en: "Bhag-waan A-jeet-naath Swa-mee", hi: "भगवान अजीतनाथ स्वामी" },
    image: "🐘",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20",
    description: { en: "The Second Tirthankar of Jainism.", hi: "जैन धर्म के द्वितीय तीर्थंकर।" },
    detail: { 
      en: "Emblem: Elephant (गज). Symbol of immense strength, patience, and silent wisdom. He established deep spiritual calm and conquered all internal and external fear.", 
      hi: "चिन्ह: हाथी (गज)। अपार आत्मिक बल, गंभीर धैर्य और मौन ज्ञान के प्रतीक। उन्होंने आंतरिक विकारों पर विजय पाकर परम शांति स्थापित की।" 
    }
  },
  {
    id: "fc_26",
    category: "emblems",
    title: { en: "Chandraprabha Swami", hi: "भगवान चन्द्रप्रभ स्वामी" },
    pronunciation: { en: "Bhag-waan Chan-dra-prabh Swa-mee", hi: "भगवान चन्द्रप्रभ स्वामी" },
    image: "🌛",
    color: "from-blue-500/10 to-sky-500/10 border-blue-400/20",
    description: { en: "The Eighth Tirthankar of Jainism.", hi: "जैन धर्म के आठवें तीर्थंकर।" },
    detail: { 
      en: "Emblem: Crescent Moon (चन्द्र). A symbol of divine serenity, cool moonlight, and absolute peace of mind. Attained ultimate liberation on Mt. Sammed Shikharji.", 
      hi: "चिन्ह: अर्धचन्द्र (चंद्रमा)। शीतल चांदनी और मानसिक समता के दिव्य प्रतीक। सम्मेद शिखरजी की पावन भूमि से मोक्ष पधारे।" 
    }
  },
  {
    id: "fc_27",
    category: "principles",
    title: { en: "Parasparopagraho Jivanam", hi: "परस्परोपग्रहो जीवानाम्" },
    pronunciation: { en: "Pa-ras-pa-ro-pa-gra-ho Jee-wa-nam", hi: "परस्परोपग्रहो जीवानाम्" },
    image: "🤝",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    description: { en: "Motto: Souls Render Service to Each Other.", hi: "जैन धर्म का बोधवाक्य: जीव एक दूसरे के पूरक हैं।" },
    detail: { 
      en: "The foundational Jain sutra from Tattvartha Sutra stating that all living entities in the universe are interconnected and bound to support each other with love and harmlessness.", 
      hi: "तत्वार्थ सूत्र का महान सूत्र, जिसका अर्थ है कि सभी जीव आपस में जुड़े हुए हैं और उन्हें परस्पर प्रेम, दया और सहयोग के साथ जीवन जीना चाहिए।" 
    }
  },
  {
    id: "fc_28",
    category: "principles",
    title: { en: "Dashalakshan Dharma", hi: "दशलक्षण धर्म" },
    pronunciation: { en: "Da-sha-lak-shan Dhar-ma", hi: "दस लक्षण धर्म" },
    image: "🏆",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    description: { en: "Ten Divine Soul Virtues.", hi: "आत्मा के दस पावन धर्म गुण।" },
    detail: { 
      en: "The ten spiritual properties of a pure soul celebrated in Paryushan: Forgiveness (Kshama), Humility (Mardav), Honesty (Arjav), Purity (Shauch), Truth, Self-Restraint, Penance, Renunciation, Non-attachment, and Chastity.", 
      hi: "आत्मा के दस सहज स्वभाव गुण: उत्तम क्षमा, मार्दव (अहंकार मुक्ति), आर्जव (सरलता), शौच (पवित्रता), सत्य, संयम, तप, त्याग, आकिंचन्य और ब्रह्मचर्य।" 
    }
  },
  {
    id: "fc_29",
    category: "principles",
    title: { en: "Paryushan Mahaparv", hi: "पर्युषण महापर्व" },
    pronunciation: { en: "Par-yu-shan Ma-haa-parv", hi: "पर्युषण पर्वराज" },
    image: "👑",
    color: "from-red-500/10 to-orange-500/10 border-red-500/20",
    description: { en: "The King of Jain Festivals.", hi: "पर्वों का राजा महापर्व पर्युषण।" },
    detail: { 
      en: "An annual ten-day festival of spiritual reflection, intense fasting, swadhyay, and purification, culminating in Kshamavani (universal forgiveness to all souls).", 
      hi: "आत्म-निरीक्षण, उपवास, स्वाध्याय और तपस्या का पावन वार्षिक काल। इसके अंत में सभी जीवों से 'मिच्छामि दुक्कड़म्' कह कर हृदय से क्षमा मांगी जाती है।" 
    }
  },
  {
    id: "fc_30",
    category: "emblems",
    title: { en: "Bahubali Bhagwan", hi: "भगवान बाहुबली स्वामी" },
    pronunciation: { en: "Bhag-waan Baa-hu-ba-lee", hi: "भगवान बाहुबली स्वामी" },
    image: "🌳",
    color: "from-green-500/10 to-emerald-500/10 border-green-500/20",
    description: { en: "First Siddha of Current Time Cycle.", hi: "इस अवसर्पिणी काल के प्रथम मोक्षगामी कामदेव पुरुष।" },
    detail: { 
      en: "Son of Lord Adinath, who stood in deep Kayotsarga meditation for a year. Preached shattering the ego to attain supreme enlightenment and pure love for all.", 
      hi: "प्रथम तीर्थंकर ऋषभदेव के पुत्र। एक वर्ष तक निरंतर खड़े रहकर ध्यान किया, बेलें शरीर पर चढ़ गईं। अहंकार त्याग कर मन को शुद्ध कर कैवल्य ज्ञान पाया।" 
    }
  }
];

interface PathshalaFlashcardsDeckProps {
  isDark: boolean;
  language: 'hi' | 'en';
}

export default function PathshalaFlashcardsDeck({ isDark, language }: PathshalaFlashcardsDeckProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'emblems' | 'principles' | 'symbols'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [masteredCards, setMasteredCards] = useState<string[]>([]);
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  // Load mastered card list from localstorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pathshala_mastered_cards');
      if (saved) setMasteredCards(JSON.parse(saved));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleMastered = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flipping the card when checking got it
    const alreadyMastered = masteredCards.includes(id);
    let updated: string[];
    if (alreadyMastered) {
      updated = masteredCards.filter(cid => cid !== id);
    } else {
      updated = [...masteredCards, id];
    }
    setMasteredCards(updated);
    localStorage.setItem('pathshala_mastered_cards', JSON.stringify(updated));

    // Gamify: sync with Tapasya punya points
    try {
      const savedScore = localStorage.getItem('tapasya_punya_score');
      const currentScore = savedScore ? parseInt(savedScore, 10) : 0;
      // Gain 10 points for learning a card, lose 10 if unchecked
      const nextScore = alreadyMastered ? Math.max(0, currentScore - 10) : currentScore + 10;
      localStorage.setItem('tapasya_punya_score', nextScore.toString());
      // Dispatch storage event so other components (like FastingPage) hear about the update
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn(err);
    }
  };

  const speakCard = (card: Flashcard, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flipping the card when speaking
    if (speakingCardId === card.id) {
      window.speechSynthesis.cancel();
      setSpeakingCardId(null);
    } else {
      window.speechSynthesis.cancel();
      const speakText = language === 'hi' 
        ? `${card.title.hi}. ${card.detail.hi}` 
        : `${card.title.en}. ${card.detail.en}`;
      
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setSpeakingCardId(null);
      utterance.onerror = () => setSpeakingCardId(null);

      // Fetch premium voices
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => 
        v.lang.startsWith(language) && 
        (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural'))
      ) || voices.find(v => v.lang.startsWith(language));
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
      setSpeakingCardId(card.id);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Filter Cards
  const filteredCards = FLASHCARDS_DATA.filter(card => {
    if (selectedCategory !== 'all' && card.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        card.title.en.toLowerCase().includes(q) ||
        card.title.hi.toLowerCase().includes(q) ||
        card.description.en.toLowerCase().includes(q) ||
        card.description.hi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder={language === 'hi' ? "फ्लैशकार्ड खोजें (उदा. महावीर, अहिंसा)..." : "Search cards (e.g., Mahavir, Ahimsa)..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all border",
              isDark ? "bg-[#1A1A1A]/50 border-white/5 text-white" : "bg-white border-gray-200 text-gray-900 shadow-xs"
            )}
            id="search-pathshala-flashcards"
          />
        </div>

        {/* Categories list */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar whitespace-nowrap py-0.5 shrink-0">
          {[
            { id: 'all', label: { en: 'All Items', hi: 'सभी' } },
            { id: 'emblems', label: { en: 'Tirthankar Emblems', hi: 'तीर्थंकर चिन्ह' } },
            { id: 'principles', label: { en: 'Core Principles', hi: 'मुख्य सिद्धांत' } },
            { id: 'symbols', label: { en: 'Holy Symbols', hi: 'पवित्र चिन्ह' } }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={cn(
                "px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer",
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-orange-500 to-[#FFD54F] text-black border-transparent shadow-sm"
                  : isDark 
                    ? "bg-[#121212] text-gray-400 border-white/5 hover:text-white" 
                    : "bg-white text-gray-600 border-gray-250 hover:bg-gray-100"
              )}
            >
              {language === 'hi' ? cat.label.hi : cat.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Cards list grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card) => {
            const isFlipped = flippedCards[card.id] || false;
            const isMastered = masteredCards.includes(card.id);
            const isSpeaking = speakingCardId === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleFlip(card.id)}
                className="group relative h-80 w-full cursor-pointer rounded-[2rem] [perspective:1000px] outline-none"
              >
                {/* Dual-sided card structure */}
                <div 
                  className={cn(
                    "relative h-full w-full rounded-[2rem] border transition-all duration-500 [transform-style:preserve-3d]",
                    isFlipped ? "[transform:rotateY(180deg)]" : "",
                    isDark ? "bg-[#121212]/80" : "bg-white shadow-md",
                    isMastered ? "border-emerald-500/40 shadow-[0_4px_20px_rgba(16,185,129,0.1)]" : "border-gray-200 dark:border-white/5 hover:border-orange-500/30"
                  )}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 h-full w-full rounded-[2rem] p-6 [backface-visibility:hidden] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          card.category === 'emblems' ? "bg-amber-500/10 text-amber-500 border-amber-500/10" :
                          card.category === 'principles' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" :
                          "bg-purple-500/10 text-purple-500 border-purple-500/10"
                        )}>
                          {language === 'hi'
                            ? (card.category === 'emblems' ? 'तीर्थंकर चिन्ह' : card.category === 'principles' ? 'सिद्धांत' : 'पवित्र चिन्ह')
                            : card.category}
                        </span>

                        {isMastered && (
                          <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-550 px-2 py-0.5 rounded-lg flex items-center gap-1 font-black uppercase">
                            <CheckCircle2 size={10} className="fill-emerald-500 text-transparent" />
                            {language === 'hi' ? 'सीख लिया' : 'LEARNED'}
                          </span>
                        )}
                      </div>

                      {/* Display Illustration / Emoji */}
                      <div className={cn(
                        "w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-all shadow-inner",
                        card.color
                      )}>
                        {card.image}
                      </div>

                      <h3 className={cn("text-center font-display font-black text-base truncate", isDark ? "text-white" : "text-gray-900")}>
                        {language === 'hi' ? card.title.hi : card.title.en}
                      </h3>
                      <p className="text-center text-[10px] text-gray-550 dark:text-gray-400 font-bold mt-1 max-w-[200px] mx-auto line-clamp-2 leading-snug">
                        {language === 'hi' ? card.description.hi : card.description.en}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-3">
                      {/* Pronunciation Speaker */}
                      <button
                        onClick={(e) => speakCard(card, e)}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer h-9 w-9",
                          isSpeaking 
                            ? "bg-red-500 border-red-500 text-white animate-pulse" 
                            : isDark ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10" : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                        )}
                        title={language === 'hi' ? 'सुनें' : 'Listen Pronunciation'}
                      >
                        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>

                      <span className="text-[9px] text-[#FF6D00] font-black uppercase tracking-widest animate-pulse">
                        {language === 'hi' ? 'टैप करें (फ्लिप)' : 'TAP TO FLIP ↻'}
                      </span>

                      {/* Master Checkbox */}
                      <button
                        onClick={(e) => handleToggleMastered(card.id, e)}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer h-9 w-9",
                          isMastered 
                            ? "bg-emerald-500 border-transparent text-black" 
                            : isDark ? "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10" : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                        )}
                        title={language === 'hi' ? 'सीख लिया' : 'Mark as Learned'}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 h-full w-full rounded-[2rem] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[8px] font-black text-[#FF6D00] uppercase tracking-widest">
                          {language === 'hi' ? 'गहन सूत्र रहस्य' : 'SACRED INSIGHT'}
                        </span>
                        <span className="text-[8px] bg-white/5 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-bold uppercase">
                          {language === 'hi' ? 'उच्चारण:' : 'Speak:'} {language === 'hi' ? card.pronunciation.hi : card.pronunciation.en}
                        </span>
                      </div>

                      <h4 className={cn("font-display font-black text-sm", isDark ? "text-white" : "text-gray-900")}>
                        {language === 'hi' ? card.title.hi : card.title.en}
                      </h4>
                      <p className="text-[10px] text-gray-550 dark:text-gray-400 italic mt-0.5 font-bold">
                        "{language === 'hi' ? card.pronunciation.hi : card.pronunciation.en}"
                      </p>

                      <div className="mt-3 p-3 rounded-2xl bg-orange-500/[0.02] dark:bg-orange-500/[0.01] border border-orange-500/10 text-left max-h-[120px] overflow-y-auto">
                        <p className={cn("text-xs leading-relaxed font-bold", isDark ? "text-zinc-200" : "text-gray-700")}>
                          {language === 'hi' ? card.detail.hi : card.detail.en}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-white/5 pt-3">
                      {/* Audio listen */}
                      <button
                        onClick={(e) => speakCard(card, e)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl border flex items-center gap-1 cursor-pointer text-[10px] font-black uppercase transition-all",
                          isSpeaking 
                            ? "bg-red-500 text-white border-transparent" 
                            : isDark ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10" : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        <span>{language === 'hi' ? 'उच्चारण' : 'Speak'}</span>
                      </button>

                      {/* Got it toggle */}
                      <button
                        onClick={(e) => handleToggleMastered(card.id, e)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer text-[10px] font-black uppercase transition-all border",
                          isMastered 
                            ? "bg-emerald-500 border-transparent text-black font-black" 
                            : "bg-orange-500 hover:bg-orange-600 text-white border-transparent"
                        )}
                      >
                        <CheckCircle2 size={12} />
                        <span>{isMastered ? (language === 'hi' ? 'सीखा ✓' : 'Learned ✓') : (language === 'hi' ? 'कंठस्थ' : 'Got It!')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty view */}
      {filteredCards.length === 0 && (
        <div className="text-center py-12 bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-[2rem] p-6">
          <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">No matching flashcards found</p>
          <span className="text-[10px] text-gray-400 block mt-1">Try resetting search or category filters.</span>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
