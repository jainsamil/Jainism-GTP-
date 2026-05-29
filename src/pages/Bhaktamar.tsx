import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Volume2, Sparkles, Heart, HeartOff, HelpCircle, CheckCircle2, ChevronRight, Play, Pause, Bookmark } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface ShlokaData {
  number: number;
  sanskrit: string;
  hindi: string;
  english: string;
  benefit: { en: string; hi: string };
  riddhi: string;
}

const BHAKTAMAR_DATA: ShlokaData[] = [
  {
    number: 1,
    sanskrit: "भक्तामर-प्रणत-मौलि-मणि-प्रभाणा-मुद्योतकं दलित-पाप-तमो-वितानम्। सम्यक्-प्रणम्य जिन-पाद-युगं युगादा-वालम्बनं भव-जले पततां जनानाम्॥ १ ॥",
    hindi: "भक्तों के मुकुट मणियों की कांति को विकसित करने वाले, पाप अंधकार को नष्ट करने वाले भगवान आदिनाथ के युगल चरणों को बारम्बार नमस्कार हो।",
    english: "Bowing down to the pair of lotus feet of the first Tirthankar Adinath, which illuminate the dark layers of sin like shining crown gems of deep worshipers.",
    benefit: {
      en: "Destruction of obstacles, removal of sudden life blockages and negative vibrations.",
      hi: "सभी विघ्न-बाधाओं और संकटों का शमन, मन की शुद्धि एवं समृद्धि।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो जिणाणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 2,
    sanskrit: "यः संस्तुतः सकल-वाङ् मय-तत्त्व-बोधा-दुद्भूत-बुद्धि-पटुभिः सुर-लोक-नाथैः। स्तोत्रैर्जगत्-त्रितय-चित्त-हरैरुदारैः, स्तोष्ये किलाहमपि तं प्रथमं जिनेन्द्रम्॥ २ ॥",
    hindi: "देवराज इन्द्रों द्वारा उत्कृष्ट बुद्धियुक्त स्तोत्रों से स्तुत आदि जिनेन्द्र की मैं तुच्छ बुद्धिधारी भी स्तुति करने का संकल्प करता हूँ।",
    english: "Praised by celestial kings possessing immense intellectual depth, I, with my modest intellect, proceed to sing worship of the first Adinath Lord.",
    benefit: {
      en: "Enhancement of cognitive memory, wisdom, and success in educational affairs.",
      hi: "स्मरण शक्ति की वृद्धि, बुद्धिमत्ता का विकास, एकाग्रता प्राप्ति।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो सिद्धानं णमो ओहिजिणाणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 3,
    sanskrit: "बुद्ध्या विनापि विबुध-अर्च्य-पाद-पीठ, स्तोतुं समुद्यत-मतिर्विगत-त्रपोऽहम्। बालं विहाय जल-संस्थित-मिन्दु-बिम्ब-मन्यः क इच्छति जनः सहसा ग्रहीतुम्॥ ३ ॥",
    hindi: "हे देव! बुद्धिहीन होने पर भी मैं आपके पूज्य चरणकमल की स्तुति करने के लिए उद्यत हुआ हूँ; जैसे कोई बालक जल में पड़ने वाले चंद्रमा के बिम्ब को पकड़ने के लिए अनायास मचल पड़ता है।",
    english: "Even without adequate intellect, my mind is driven to praise your worshiped feet; just as an innocent child reaches out to catch the reflection of the moon in water.",
    benefit: {
      en: "Curing legal battles, getting justice, and releasing negative emotional burdens of guilt.",
      hi: "मुकदमे-विवाद में न्याय एवं विजय प्राप्ति, मन से अपराध-बोध व आशंका का निवारण।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो केवलनाणाणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 4,
    sanskrit: "वक्तुं गुणान् गुण-समुद्र शशांक-कान्तान्, कस्ते क्षमः सुर-गुरु-प्रतिमोऽपि बुद्ध्या। कल्पान्त-काल-पवनोद्धत-नक्र-चक्रं, को वा तरीतुमलमम्बुनिधिं भुजाभ्याम्॥ ४ ॥",
    hindi: "गुणों के समुद्र! साक्षात् बृहस्पति के समान बुद्धिमान पुरुष भी आपके चंद्र समान निष्पाप गुणों का वर्णन नहीं कर सकता। प्रलय काल की आंधी से उछलते मगरमच्छों वाले महासमुद्र को कौन अपनी भुजाओं से तैरकर पार कर सकता है?",
    english: "Deep ocean of virtues! Even Brihaspati (the preceptor of gods) cannot describe your spotless glory. Who indeed can cross a storm-tossed ocean infested with crocodiles by raw arm power?",
    benefit: {
      en: "Freedom from water phobias, deep travel protections, and overcoming anxiety of natural disasters.",
      hi: "जल के भय से मुक्ति, सुरक्षित यात्रा, बाढ़ व प्राकृतिक आपदाओं से रक्षा।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो विउल मतीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 5,
    sanskrit: "सोऽहं तथापि तव भक्ति-वशान्मुनीश, कर्तुं स्तवं विगत-शक्तिरपि प्रवृत्तः। प्रीत्यात्म-वीर्यमविचार्य मृगो मृगेन्द्रं, नाभ्येति किं निज-शिशोः परिपालनार्थम्॥ ५ ॥",
    hindi: "हे मुनीश! यद्यपि मैं शक्तिहीन हूँ, फिर भी आपकी भक्ति मुझे आपकी चर्चा करने को प्रेरित करती है। क्या एक कोमल हिरणी अपने नन्हे बच्चे की रक्षा के लिए अपनी शक्ति को भूलकर महाबलवान सिंह के सामने नहीं खड़ी हो जाती?",
    english: "Though powerless, I enter your praise purely by the force of my love. Does not a gentle deer step forward and face a lion to protect her newborn fawn?",
    benefit: {
      en: "Prevention of accidents, driving away bad dreams, and protection of children.",
      hi: "दुस्वप्नों का नाश, अकाल व आकस्मिक दुर्घटनाओं से सुरक्षा एवं संतान की रक्षा।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो विउल बुद्धीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 6,
    sanskrit: "अल्प-श्रुतं श्रुतवतां परिहास-धाम, त्वद्-भक्तिरेव मुखरी-कुरुते बलान्माम्। यत्कोकिलः किल मधौ मधुरं विरौति, तच्चाम्र-चारु-कलिका-निकरैक-हेतुः॥ ६ ॥",
    hindi: "मेरी अल्पावस्था की बुद्धि का लोग परिहास करेंगे, किंतु देव! आपकी अगाध भक्ति मुझे बलपूर्वक स्तुति करने को विवश कर रही है; ठीक वैसे ही जैसे वसंत में कोयल आम की कली देख मधु स्वर उठाती है।",
    english: "Though my words appear simple, my devotion pushes me to speak, just as the black cuckoo is compelled to sing sweet melodies upon seeing the tender mango buds.",
    benefit: {
      en: "Enhancement of speech power, overcoming stuttering, and clearing sound and throat issues.",
      hi: "वाक् शुद्धि, जिह्वा की स्पष्टता, संगीत और भाषण कला में सफलता।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो आयरियाणं णमो केवलजिणाणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 7,
    sanskrit: "नास्तं कदाचिदुपयाति न राहु-गम्यः, स्पष्टी-करोति सहसा युगपज्जगन्ति। नाम्भोधरोदर-निरुद्ध-महाप्रभावः, सूर्यातिशायि-महिमा जगदीश्वरोऽसौ॥ ७ ॥",
    hindi: "जगत के स्वामी! आपके महिमामयी दिव्य प्रकाश को मेघ नहीं रोक सकते, राहु ग्रसित नहीं कर सकता। आपका ज्ञान सूर्य एक साथ पूरे लोकालोक को प्रकाशित करता है, यह सामान्य सूर्य से अनंत गुना महान है।",
    english: "O Lord of the Universe! Your infinite wisdom shines unblocked by clouds or swallowed by Rahu. It illuminates all realms simultaneously, possessing majesty far exceeding the physical sun.",
    benefit: {
      en: "Removal of eyesight disorders, gaining dynamic leadership, and absolute charisma.",
      hi: "नेत्र रोगों से आराम, मान-सम्मान व प्रभाव में वृद्धि, प्रशासनिक सफलता।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो मणपज्जवनाणाणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 10,
    sanskrit: "नाश्चर्यमत्र यदि नाम गुणैर्विशेषात्, त्वं संश्रितो निरवकाशतया मुनीश। यस्तैरुताश्रयतयोदित-मान-भूपैः, दोषैरसज्जन-हृदाश्रयिभिः प्रपन्ने॥ १० ॥",
    hindi: "हे मुनीश! इसमें कोई आश्चर्य नहीं कि सभी परम गुण अन्य कहीं स्थान न पाकर आप में ही समाहित हो गए हैं, क्योंकि दोष तो दुर्जनों के हृदय के वशीभूत होकर आपसे कोसों दूर भाग चुके हैं।",
    english: "O Lord! It is no wonder that all divine virtues found refuge in you because there was no shelf space left elsewhere, while all vices were chased away by your flawless brilliance.",
    benefit: {
      en: "Neutralizing black magic, toxic environments, and removing physical poisons.",
      hi: "विषैले प्रभावों, तंत्र-मंत्र बाधाओं का शमन, बुरी संगत एवं विष के प्रभाव का नाश।/प्रकोप निवारण।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो पमोयपत्ताणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 26,
    sanskrit: "बुद्धस्त्वमेव विबुध-अर्च्य-बुद्धि-बोधात्, त्वं शंकरोऽसि जगतां त्रय-शंकरत्वात्। धातासि धीर शिव-मार्ग-विधेर्विधानात्, व्यक्तं त्वमेव पुरुषोत्तम-आदिदेवः॥ २६ ॥",
    hindi: "देव! आप ही बुद्ध हैं क्योंकि आपकी बुद्धि अत्यंत निर्मल ज्ञानमयी है; त्रिलोकी को परम शांति देने के कारण आप ही शंकर हैं; मोक्ष मार्ग का विधान करने के कारण आप ही विधाता हैं और आप ही आदिदेव पुरुषोत्तम हैं।",
    english: "You are indeed the Buddha because of your ultimate pure wisdom; you are Shankara because you bestow eternal peace upon the three worlds; you are the Creator (Dhata) because you establish the path of salvation; and you are Purushottama.",
    benefit: {
      en: "Securing higher positions, clearing job promotion obstacles, and mental peace.",
      hi: "राज्य व राजकीय कार्यों में सफलता, पदोन्नति, बौद्धिक शांति एवं मानसिक तनाव की मुक्ति।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो केवलदंसणीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 29,
    sanskrit: "सिंहासनं मणि-मयूख-शिखा-विचित्र-मुद्याजितं कनक-पंकज-कान्तमुच्चैः। आराजते तव वपुः कनकावदातं, बिम्बं वियद्विलसतोंऽशुमतो यथार्के॥ २९ ॥",
    hindi: "मणियों और किरणों की चमक से सुशोभित ऊंचे सुवर्ण सिंहासन पर विराजमान आपका परम कांतिवान सुवर्ण शरीर वैसा ही शोभायमान हो रहा है जैसे आकाश में सूर्य का बिम्ब देदीप्यमान होता है।",
    english: "Seated on a grand throne adorned with blazing gems and golden lotuses, your pure, glowing body shines with golden majesty, resembling the radiant solar disc rising in the sky.",
    benefit: {
      en: "Attracting wealth, solving debt crises, and resolving administrative blocks.",
      hi: "आर्थिक संपन्नता, ऋण मुक्ति, राजकीय व प्रशासनिक अड़चनों का अंत।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो केवलणाणीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 36,
    sanskrit: "विक्षोभितोऽपि न जहाति रस-गम्भीरतां, कल्पान्त-काल-मकरालय-वन्मुनीश। कोऽपि विस्मय-नदी-प्रभवोऽपि लोके, त्वत्सदृशं गुण-निधिं लभते न कश्चित्॥ ३६ ॥",
    hindi: "हे मुनीश! प्रलयकाल की आंधी से विक्षोभित महासमुद्र के समान गंभीर होने पर भी आप अपनी मन की शांति एवं समता कभी नहीं छोड़ते। इस जगत में आपके समान गंभीर और उत्कृष्ट गुणों का सागर कोई दूसरा नहीं है।",
    english: "O Lord! Even if shaken by cataclysmic events, you never lose your deep tranquility, just like the vast ocean at the end of an era. Your mountain-like composure cannot be found in anyone else.",
    benefit: {
      en: "Conquering fear of wild beasts, snakes, deep forest paths, and heavy phobias.",
      hi: "जहरीले साँपों, हिंसक पशुओं के भय से मुक्ति, निर्जन स्थानों में पूर्ण अभय।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो अरिहंताणं णमो दिट्ठिविहीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 45,
    sanskrit: "उद्भूत-भीषण-जलोदर-भार-भुग्नाः, शोच्यां दशां उपगताश्च्युत-जीविताशाः। त्वत्पाद-पंकज-रजोऽमृत-दिग्ध-देहा, मर्त्या भवन्ति मकर-ध्वज-तुल्य-रूपाः॥ ४५ ॥",
    hindi: "अति भयानक जलोदर (गंभीर असाध्य बीमारी) रोग से पीड़ित मनुष्य भी आपके पवित्र चरणकमल की धूल रूपी अमृत को लगाकर कामदेव स्वरूप स्वस्थ हो जाते हैं।",
    english: "Mortals suffering from chronic, dreadful ailments, who have lost all hope of survival, are instantly cured and restored to beautiful radiant health by applying the nectar chest dust from your holy feet.",
    benefit: {
      en: "Unparalleled physical healing, curing chronic diseases, and regaining vitality.",
      hi: "गंभीर असाध्य शारीरिक रोगों का निवारण, शारीरिक आरोग्य एवं कांति की प्राप्ति।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो उवज्झायाणं णमो सव्वसामीणं ह्रीं नमः स्वाहा।"
  },
  {
    number: 48,
    sanskrit: "स्तोत्र-स्रजं तव जिनेन्द्र गुणैर्निबद्धां, भक्त्या मया विविध-वर्ण-विचित्र-पुष्पाम्। धत्ते जनो य इह कण्ठ-गतामजस्रं, तं मानतुंगमवशा समुपैति लक्ष्मीः॥ ४८ ॥",
    hindi: "जो पुरुष विविध गुणों से युक्त इस स्तोत्र रूपी पुष्पमाला को कंठस्थ कर आदरपूर्वक धारण करता है, उस मानतुंग पुरुष के पास स्वर्गिक लक्ष्मी स्वयं खिंची चली आती है।",
    english: "He who holds this divine garland of verses close in his throat and repeats it daily with pure devotion, receives supreme bliss and abundance effortlessly.",
    benefit: {
      en: "Liberation from fear, release from prison or court boundaries, and worldly abundance.",
      hi: "भयमुक्ति, बंधन व कारागार से मुक्ति, यश तथा लक्ष्मी की पूर्ण प्राप्ति।"
    },
    riddhi: "ॐ ह्रीं अर्हं णमो लोए सव्वसाहूणं णमो अणंत विज्जाणं ह्रीं नमः स्वाहा।"
  }
];

export default function BhaktamarPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();

  const [selectedShloka, setSelectedShloka] = useState<ShlokaData>(BHAKTAMAR_DATA[0]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [completedList, setCompletedList] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'hindi' | 'english' | 'remedy'>('hindi');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('bhaktamar_favorites');
    const savedCompleted = localStorage.getItem('bhaktamar_completed');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCompleted) setCompletedList(JSON.parse(savedCompleted));
  }, []);

  const handleToggleFavorite = (num: number) => {
    let updated: number[];
    if (favorites.includes(num)) {
      updated = favorites.filter(n => n !== num);
    } else {
      updated = [...favorites, num];
    }
    setFavorites(updated);
    localStorage.setItem('bhaktamar_favorites', JSON.stringify(updated));
  };

  const handleToggleCompleted = (num: number) => {
    let updated: number[];
    if (completedList.includes(num)) {
      updated = completedList.filter(n => n !== num);
    } else {
      updated = [...completedList, num];
    }
    setCompletedList(updated);
    localStorage.setItem('bhaktamar_completed', JSON.stringify(updated));
  };

  const playTTSChant = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = selectedShloka.sanskrit;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.75;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            BHAKTAMAR HEALING
          </h1>
        </div>
      </header>

      {/* Intro info box */}
      <div className="mb-6 bg-[#FF6D00]/10 rounded-3xl p-5 border border-orange-200/50 dark:border-white/5 flex items-start gap-4">
        <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0 text-orange-500">
          <Sparkles className="animate-pulse" size={20} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase text-orange-500 tracking-wider block mb-0.5">{lang === 'en' ? 'HEALING STOTRA' : 'महाकल्याणकारी भक्तामर स्तोत्र'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            {lang === 'en' 
              ? "Bhaktamar Stotra, composed by Acharya Manatunga, is respected for curing emotional, mental, and bodily ailments. Each stanza below contains active Riddhis and specific cosmic benefits."
              : "आचार्य मानतुंग विरचित ४८ काव्यों वाला यह स्तोत्र चमत्कारी आरोग्य शक्ति युक्त माना जाता है। सभी काव्यों के विशिष्ट लाभ एवं ऋद्धि मंत्र निम्न रूप में दिए गए हैं।"}
          </p>
        </div>
      </div>

      {/* Selector wheel / slider */}
      <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-2">{lang === 'en' ? 'Navigate High Healing Verses' : 'महाप्रभावकारी काव्य संख्या चुनें'}</label>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {BHAKTAMAR_DATA.map(st => {
          const isSelected = selectedShloka.number === st.number;
          const isDone = completedList.includes(st.number);
          return (
            <button
              key={st.number}
              onClick={() => {
                setSelectedShloka(st);
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              className={`px-4.5 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 border relative ${
                isSelected 
                  ? 'bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black border-transparent shadow-[0_4px_15px_rgba(255,109,0,0.3)] scale-[1.05]' 
                  : 'bg-white dark:bg-[#121212] text-gray-700 dark:text-gray-300 border-gray-100 dark:border-white/5'
              }`}
            >
              <span>Verse {st.number}</span>
              {isDone && <CheckCircle2 size={12} className={isSelected ? "text-black fill-transparent" : "text-orange-500 fill-transparent"} />}
            </button>
          );
        })}
      </div>

      {/* Main Devotional Player Board */}
      <div className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-md mb-6 relative overflow-hidden">
        {/* Subtle mandala outline bg */}
        <div className="absolute inset-0 bg-mandala opacity-10 pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1 bg-orange-500/10 rounded-full px-3 py-1 font-black text-[#FF6D00] text-[9px] uppercase tracking-wider">
            <Bookmark size={10} />
            <span>{lang === 'en' ? `VERSE ${selectedShloka.number} ACTIVE` : `काव्य क्र. ${selectedShloka.number}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleToggleFavorite(selectedShloka.number)} 
              className={`p-2 rounded-full border transition-colors ${
                favorites.includes(selectedShloka.number) 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                  : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500'
              }`}
              id="favorite-btn"
            >
              <Heart size={16} className={favorites.includes(selectedShloka.number) ? "fill-red-500" : ""} />
            </button>
            <button 
              onClick={() => handleToggleCompleted(selectedShloka.number)}
              className={`p-2 rounded-full border transition-all ${
                completedList.includes(selectedShloka.number)
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 font-bold'
                  : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 hover:text-orange-500'
              }`}
              id="completed-btn"
            >
              <CheckCircle2 size={16} />
            </button>
          </div>
        </div>

        {/* Sanskrit shloka reading panel */}
        <div className="text-center py-4 border-b border-gray-100 dark:border-white/5 relative z-10">
          <h2 className="text-xl md:text-2xl font-serif font-bold leading-relaxed text-gray-950 dark:text-gray-100 max-w-lg mx-auto italic select-text">
            {selectedShloka.sanskrit}
          </h2>

          <button 
            onClick={playTTSChant}
            className={`mt-4 mx-auto px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-xs shadow-sm transition-all border ${
              isSpeaking 
                ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                : 'bg-gray-100 dark:bg-white/10 text-[#FF6D00] border-[#FF6D00]/20 hover:scale-103'
            }`}
            id="tts-play-btn"
          >
            {isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}
            <span>{isSpeaking ? (lang === 'en' ? 'Stop Listening' : 'श्रवण रोकें') : (lang === 'en' ? 'Listen Recitation' : 'काव्य पाठ श्रवण करें')}</span>
          </button>
        </div>

        {/* Translation tabs selector */}
        <div className="flex border-b border-gray-150 dark:border-white/5 gap-4 py-3 text-xs relative z-10 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('hindi')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors ${
              activeTab === 'hindi' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-hindi"
          >
            {lang === 'en' ? 'Hindi translation' : 'हिंदी भावार्थ'}
          </button>
          <button 
            onClick={() => setActiveTab('english')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors ${
              activeTab === 'english' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-english"
          >
            {lang === 'en' ? 'English Meaning' : 'अंग्रेजी अर्थ'}
          </button>
          <button 
            onClick={() => setActiveTab('remedy')} 
            className={`font-black uppercase tracking-wider pb-1 transition-colors ${
              activeTab === 'remedy' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'
            }`}
            id="tab-remedy"
          >
            {lang === 'en' ? 'Healing & Riddhi' : 'ऋद्धि एवं सिद्धि लाभ'}
          </button>
        </div>

        {/* Tab content space */}
        <div className="py-4 relative z-10 text-xs leading-relaxed font-semibold text-gray-700 dark:text-gray-300">
          {activeTab === 'hindi' && (
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedShloka.hindi}</p>
          )}
          {activeTab === 'english' && (
            <p className="text-sm text-gray-600 dark:text-gray-200 leading-relaxed font-medium">{selectedShloka.english}</p>
          )}
          {activeTab === 'remedy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1.5 uppercase">{lang === 'en' ? 'SPECIFIC HEALING REMEDY BENEFIT' : 'काव्य प्रभाव / चमत्कारी निवारण'}</span>
                <p className="font-bold text-gray-900 dark:text-white text-xs">
                  {lang === 'en' ? selectedShloka.benefit.en : selectedShloka.benefit.hi}
                </p>
              </div>

              <div className="p-3.5 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-2xl">
                <span className="text-[8px] font-black tracking-widest text-green-500 block mb-1.5 uppercase">{lang === 'en' ? 'ASSOCIATED RIDDHI MANTRA' : 'विशिष्ट ऋद्धि सिद्ध महामंत्र'}</span>
                <p className="font-bold text-green-600 dark:text-green-400 font-mono text-xs select-all">
                  {selectedShloka.riddhi}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
