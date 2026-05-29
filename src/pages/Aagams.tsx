import { useState, useEffect, useRef } from 'react';
import { ScrollText, Search, BookOpen, Info, Loader2, Mic, MicOff, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Pujan', 'Stuti', 'Vidhan', 'Chalisa', 'Bhajan', 'Aarti'];

const FALLBACK_AAGAMS = [
  {
    id: "fb_pujan_1",
    title: "देव शास्त्र गुरु पूजा (Dev Shastra Guru Puja)",
    category: "Pujan",
    content: `स्थापना (Sthapna):
ॐ ह्रीं श्रीं देवशास्त्रगुरु-समूह! अत्र अवतर अवतर संवौषट्! (अत्र तिष्ठ तिष्ठ ठः ठः!)

अष्टक (Ashtak):
जल:
भागीरथी-जल-कलश-भरि, सुनिर्मल गंध मिलाय।
आनंद-कंद जिनेन्द्र आगे, पूजहूँ मन हरषाय॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः जन्म-जरा-मृत्यु-विनाशनाय जलं निर्वपामीति स्वाहा।

चंदन:
मलयगिरि को चोवा चंदन, केशर कुमकुम गाढ़े।
अनादि काल की दाह मिटावन, जिनवर के आगे ठाढ़े॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः संसार-ताप-विनाशनाय चंदनं निर्वपामीति स्वाहा।

अक्षत:
अक्षत चन्द्र-समान धवल अति, परम सुगन्धित प्यारो।
पुंज धरूँ जिननाथ-अग्र, भव-अक्षय-पद को धारो॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः अक्षयपद-प्राप्तये अक्षतान् निर्वपामीति स्वाहा।

पुष्प:
वर केतकी-गुलाब चमेली, फूले अनुपम बाग।
काम-बाण-विध्वंसन आये, जिनेन्द्र-चरण अनुराग॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः कामबाण-विध्वंसनाय पुष्पं निर्वपामीति स्वाहा।

नैवेद्य:
मधुर सुगन्धित सरस महा-रस, व्यंजन विविध बनाये।
क्षुधा-रोग-विध्वंसन कारन, थाल भरत ले आये॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः क्षुधारोग-निवारणाय नैवेद्यं निर्वपामीति स्वाहा।

दीप:
घृत का दीपक जोति जगावत, जगमगात अन्धियारो।
मोह-महा-तम-नाश करन को, जिनवर आगे धारो॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः मोहान्धकार-विनाशनाय दीपं निर्वपामीति स्वाहा।

धूप:
उत्तम कृष्णागुरु धूप सुहावन, अनल-मध्य धधकाये।
अष्ट-कर्म की धूपन कारन, जिनवर सन्मुख लाये॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः अष्टकर्म-दहनाय धूपं निर्वपामीति स्वाहा।

फल:
ऋतु-फल विविध प्रकार मँगाये, सरस सुगन्ध रसाले।
मोक्ष-महाफल प्राप्ति करन को, जिनवर-चरण चढ़ाले॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः मोक्षफल-प्राप्तये फलं निर्वपामीति स्वाहा।

अर्घ्य:
जल गन्धाक्षत-पुष्पक रचिके, दीप धूप फल न्यारे।
अर्घ्य चढ़ाय हरूँ भव-फेरा, जय जिन देव हमारे॥
ॐ ह्रीं श्रीं देव-शास्त्र-गुरु-चरणेभ्यः अनर्घ्यपद-प्राप्तये अर्घ्यं निर्वपामीति स्वाहा।`
  },
  {
    id: "fb_stuti_1",
    title: "मेरी भावना (Meri Bhavna)",
    category: "Stuti",
    content: `जिसने राग-द्वेष कामादिक, जीते सब जग जान लिया।
सब जीवों को मोक्ष-मार्ग का, निष्प्रह हो उपदेश दिया॥
बुद्ध, वीर, जिन, हरि, हर, ब्रह्मा, या उसको स्वाधीन कहो।
भक्ति-भाव से प्रेरित हो यह, चित्त उसी में लीन रहो॥१॥

विषयों की आशा वैश्णिक हो, वीर पुरुष जग में विचरें।
चौदह गुणस्थानों को पाकर, जो भव-सागर पार करें॥
राग-द्वेष भय-शोक मिटाकर, संकट में भी विचलित न हों।
ऐसे मंगलमयी संतों के, चरणों में नित शीश झुकें॥२॥

रहे सदा सत्संग उन्हीं का, ध्यान उन्हीं का नित्य रहे।
उन जैसा ही बनूँ निरन्तर, हृदय यही संकल्प बहे॥
नहीं किसी का बुरा विचारूँ, नहीं किसी से वैर करूँ।
सद्व्यवहार करूँ जग में सब, प्राणी-मात्र से प्रेम करूँ॥३॥

मैत्री-भाव जगत में मेरा, सब जीवों से नित्य रहे।
दीन-दुःखी जीवों पर मेरे, उर से करुणा-स्रोत बहे॥
दुर्जन-विघ्न-विनाशक जन पर, क्षोभ नहीं मुझको आये।
साम्य-भाव रक्खूँ मैं उन पर, ऐसी परिणति हो जाये॥४॥`
  },
  {
    id: "fb_stuti_2",
    title: "उवसग्गहरं स्तोत्र (Uvasaggaharam Stotra)",
    category: "Stuti",
    content: `उवसग्गहरं पासं, पासं वंदामि कम्म-घण-मुक्कम।
विसहर-विस-निन्नासं, मंगल कल्लाण आवासं ॥१॥

विसहर-फुलिंग मंतं, कंठे धारेइ जो सया मणुओ।
तस्स गह-रोग-मारी, दुट्ठ-जरा जंति उवसामं ॥२॥

चिट्ठउ दूरे मंतो, तुज्झ पणामो वि बहु-फलो होइ।
नरतिरिएसु वि जीवो, पावेइ न दुक्ख-दोगच्चं ॥३॥

तुह सम्मत्ते लद्धे, चिंतामणि-कप्पपायव-ब्भहिए।
पावंति अविग्घेणं, जीवा अयरामरं ठाणं ॥४॥

इअ संथुओ महायस!, भत्तिब्भर-निब्भरेण हिअएण।
ता देव! दिज्ज बोहिं, भवे भवे पासजिणचंद! ॥५॥`
  },
  {
    id: "fb_chalisa_1",
    title: "महावीर चालीसा (Mahavir Chalisa)",
    category: "Chalisa",
    content: `॥ दोहा ॥
शीश नवा अरिहंत को, सिद्धन करूँ प्रणाम।
वीर जिनेश्वर देव का, सुमिरूँ पावन नाम॥

॥ चौपाई ॥
जय महावीर दयाला, संकट-हरन हरदम प्रतिपाला।
कुण्डलपुर जनमे जग त्राता, त्रिशला नंदन जग-हित-दाता॥
सिद्धारथ के राज-दुलारे, नैनन-तारे प्राण-प्यारे।
दीक्षा ले सब राज गंवाया, बारह बरस घोर तप ठाया॥

काँटों का उपसर्ग सहा मुख, विचलित हुए न पाए सब सुख।
सिंह-वृत्ति धारण कर आये, केवलज्ञान परम पद पाये॥
दिव्यध्वनि खिरती सुखदायी, समवशरण रचना मन भायी।
अहिंसा का सन्देश दिया जग, मोक्ष-मार्ग दर्शाया पावन॥

जो जन वीर का ध्यान लगावे, कष्ट रोग सब दूर नसावे।
चालीसा पढ़ सुन मन लाये, महावीर वांछित फल पाये॥`
  },
  {
    id: "fb_chalisa_2",
    title: "पार्श्वनाथ चालीसा (Parshvanath Chalisa)",
    category: "Chalisa",
    content: `॥ दोहा ॥
पार्श्वनाथ भगवान को, बारम्बार प्रणाम।
जगत-तारक देव का, सुमिरूँ मंगल नाम॥

॥ चौपाई ॥
जय पार्श्वनाथ देवा, सुर-नर-मुनि कर रहे सेवा।
काशी नगरी जन्म लिया प्रभु, वामा देवी नंदन विभु॥
अश्वसेन के कुल उजियारे, कमठ मान-मर्दन अवतारे।
हाथी के जीव को तारा, नवकार महामन्त्र सुनाया॥

कमठ असुर ने मेह बरसाया, पाहन वृष्टि घोर कराया।
धरणेन्द्र ने फण फैलाया, प्रभु सर पर छत्र बनाया॥
अविचल ध्यान धरे जिनराया, केवलज्ञान परम पद पाया।
सम्मेद शिखर से शिव पधारे, पावन चरण पूजें जग सारे॥

जो पार्श्वनाथ का पाठ पढ़ेगा, संकट टरेगा रिद्धि बढ़ेगा।
चालीसा जो मन से गावे, पार्श्व प्रभु का आशीष पावे॥`
  },
  {
    id: "fb_aarti_1",
    title: "जिनेन्द्र देव आरती (Jinendra Dev Aarti)",
    category: "Aarti",
    content: `जय जिनेन्द्र देव, स्वामी जय जिनेन्द्र देव।
सुर-नर-मुनि-जन ध्यावें, सुर-नर-मुनि-जन ध्यावें, नित उठकर सहदेव॥
॥ जय जिनेन्द्र देव... ॥

ऋषभ देव जग-दाता, जग-हित उपकारी।
भरत बाहुबली जनक, भरत बाहुबली जनक, मोह-मल्ल hary॥
॥ जय जिनेन्द्र देव... ॥

पार्श्वनाथ दुःख-भंजन, धरणेन्द्र-पद्मावती।
संकट मोचन स्वामी, संकट मोचन स्वामी, सिद्ध-शिला वासी॥
॥ जय जिनेन्द्र देव... ॥

महावीर जिन स्वामी, शासन-नायक देवा।
गौतम गणधर वन्दित, गौतम गणधर वन्दित, हम चाहत सेवा॥
॥ जय जिनेन्द्र देव... ॥

पंच-परमेष्ठी आरती, जो जन मन-लाये।
कहे 'भक्त' अमर-पद, कहे 'भक्त' अमर-पद, साश्वत सुख पाये॥
॥ जय जिनेन्द्र देव... ॥`
  },
  {
    id: "fb_bhajan_1",
    title: "मईया मोहे ऐसा वर दे (Maiya Mohe Aisa Var De)",
    category: "Bhajan",
    content: `जिनवाणी मईया मोहे ऐसा वर दे,
ज्ञान का दीपक मेरे घट में धर दे॥
जिनवाणी मईया मोहे ऐसा वर दे...

राग और द्वेष की आंधी मिट जाये,
सत्य अहिंसा की ज्योति जल जाये।
मेरे मन मंदिर का अन्धेरा हर दे,
ज्ञान का दीपक मेरे घट में धर दे॥
जिनवाणी मईया मोहे ऐसा वर दे...

परम पदारथ समयसार पाऊँ,
आत्म-निधि पाकर तृप्त हो जाऊँ।
समता का रस मेरे जीवन में भर दे,
ज्ञान का दीपक मेरे घट में धर दे॥
जिनवाणी मईया मोहे ऐसा वर दे...`
  },
  {
    id: "fb_vidhan_1",
    title: "सिद्धचक्र महामण्डल विधान (Siddhachakra Vidhan)",
    category: "Vidhan",
    content: `सिद्धचक्र महामण्डल विधान जैन धर्म का एक महान और कल्याणकारी अनुष्ठान है। यह विधान विशेष रूप से अष्टान्हिका पर्व के दिनों में (कार्तिक, फाल्गुन और आषाढ़ मास के अंत में) श्रद्धापूर्वक आयोजित किया जाता है।

शास्त्रों में विधान का महत्त्व:
श्रीपाल और मैनासुन्दरी की कथा इस विधान से घनिष्ठ रूप से जुड़ी हुई है। राजा श्रीपाल का कुष्ठ रोग भगवान सिद्ध परमेष्ठी की भक्ति और सिद्ध चक्र महामण्डल विधान के पवित्र जल (गन्धोदक) के प्रभाव से पूर्णतः दूर हो गया था।

विधान की मूल रचना और अर्घ्य:
सिद्धचक्र मण्डल में मूल रूप से ९ पद होते हैं - पंचपरमेष्ठी (अरिहंत, सिद्ध, आचार्य, उपाध्याय, साधु) और चार अनुयोग/रत्नत्रय देव (दर्शन, ज्ञान, चारित्र, तप)।

विधान मंत्र:
ॐ ह्रीं अनादि-सिद्धपरमेष्ठी-समूह! अत्र अवतर अवतर संवौषट्!
ॐ ह्रीं श्रीं सिद्धपरमेष्ठीभ्यो अर्घ्यं निर्वपामीति स्वाहा।

इस विधान के अर्घ्यों में सिद्धों की पावन अवस्था, उनके आठ गुणों (सम्यक्त्व, ज्ञान, दर्शन, वीर्य, सूक्ष्मत्व, अवगाहनत्व, अगुरुलघुत्व, अव्याबाधत्व) का अत्यंत विस्तारपूर्वक और भक्तिपूर्ण काव्यात्मक वर्णन होता है।`
  }
];

export default function AagamsPage() {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Pujan');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [aagams, setAagams] = useState<any[]>(FALLBACK_AAGAMS);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef<any>(null);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTitle.trim()) return;
    setIsAiGenerating(true);
    setAiError('');
    try {
      const response = await fetch('/api/gemini/generate-scripture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: aiTitle, category: activeCat }),
      });
      const data = await response.json();
      if (response.ok && data.content) {
        const newDoc = {
          title: aiTitle,
          category: activeCat,
          content: data.content,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'aagams'), newDoc);
        setAiTitle('');
        setShowAiModal(false);
      } else {
        setAiError(data.error || 'Failed to generate scripture');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Connection failed. Please check setup.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
        setSpeechError('');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access denied. Please enable it in your browser settings.');
        } else {
          setSpeechError('Error with speech recognition. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const q = query(collection(db, 'aagams'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAagams(data.length > 0 ? data : FALLBACK_AAGAMS);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching aagams:', error);
      setAagams(FALLBACK_AAGAMS);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = 'hi-IN'; // Aagams are mostly Hindi
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [selectedItem]);

  const filtered = aagams.filter(item => 
    item.category === activeCat && 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full p-6 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <ScrollText className="text-[#FF6D00] drop-shadow-none dark:drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
            JIN VANI
          </h1>
        </div>
        <button
          onClick={toggleLanguage}
          className="w-10 h-10 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-[#FF8A65] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all shadow-sm"
        >
          <span className="text-xs font-bold">{language === 'en' ? 'A/अ' : 'अ/A'}</span>
        </button>
      </header>

      <div className="relative mb-8 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-[#FF8A65]" size={20} />
          <input
            type="text"
            placeholder="खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
          />
          <button 
            onClick={toggleListening}
            className={cn(
              "absolute right-4 p-2 rounded-full transition-all",
              isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-gray-400 hover:text-[#FF8A65] hover:bg-[#FF6D00]/10"
            )}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
        {speechError && (
          <p className="text-red-500 text-sm mt-2 ml-2">{speechError}</p>
        )}
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
              activeCat === cat 
                ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-md dark:shadow-[0_0_15px_rgba(255,109,0,0.6)] scale-105" 
                : "bg-white/80 dark:bg-[#121212]/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Aagams...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 flex items-center justify-between hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF6D00]/10 text-[#FF8A65] rounded-2xl flex items-center justify-center shrink-0 border border-[#FF6D00]/20 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">{item.title}</h3>
                  <span className="text-[10px] font-black tracking-widest text-[#FFD54F] bg-[#FFD54F]/10 border border-[#FFD54F]/20 px-2.5 py-1 rounded-md uppercase mt-1 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FF6D00] transition-colors">
                <Info size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            इस श्रेणी में कुछ नहीं मिला।
          </div>
        )}
      </div>

      {/* Divine AI Expansion Module */}
      <div className="mt-8 bg-gradient-to-br from-[#121212]/90 to-[#221C0F]/90 backdrop-blur-xl border border-[#FF6D00]/25 rounded-[2.5rem] p-8 text-center shadow-[0_0_30px_rgba(255,109,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD54F]/5 rounded-full blur-xl" />
        <h3 className="font-display font-black text-white text-lg tracking-wider mb-2 uppercase flex items-center justify-center gap-2">
          <BookOpen size={20} className="text-[#FFD54F] animate-pulse" />
          More {activeCat}s Needed?
        </h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4 leading-relaxed">
          Need a specific traditional pujan, stotra, chalisa, or aarti? Ask Jainism GPT to generate and add it live to the temple library.
        </p>
        <button
          onClick={() => setShowAiModal(true)}
          className="px-6 py-2.5 bg-[#FF6D00] hover:bg-[#FFD54F] text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6D00]/15"
        >
          ✨ AI Generate {activeCat}
        </button>
      </div>

      {/* Content Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl dark:shadow-[0_0_50px_rgba(255,109,0,0.2)] border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col relative">
            <div className="bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] p-8 text-black relative shrink-0">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-sm"
              >
                ✕
              </button>
              <div className="inline-block px-4 py-1.5 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase mb-3 border border-black/10">
                {selectedItem.category}
              </div>
              <h2 className="text-3xl font-display font-black">{selectedItem.title}</h2>
            </div>
            
            <div className="p-8 overflow-y-auto bg-white dark:bg-[#121212]">
              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-center font-medium">
                  {selectedItem.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Scripture Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121212] rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 p-8 flex flex-col relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setShowAiModal(false); setAiError(''); }}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] mb-2 uppercase tracking-wide">
              AI {activeCat} Generator
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed">
              Enter the title of the scripture you want to generate. Jainism GPT will research its traditional elements and write it beautifully in Hindi/English.
            </p>
            
            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-[#FF8A65] uppercase tracking-wider mb-2">Scripture Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. भगवान पार्श्वनाथ आरती"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#FF6D00]/50 outline-none text-sm font-bold"
                  required
                  disabled={isAiGenerating}
                />
              </div>
              
              {aiError && (
                <p className="text-red-500 text-xs font-semibold bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{aiError}</p>
              )}

              <button
                type="submit"
                disabled={isAiGenerating}
                className="w-full py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D00]/15"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    GENERATING HOLY TEXT...
                  </>
                ) : (
                  'ACTIVATE GENERATOR'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
