import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Compass, ShieldAlert, Navigation, Landmark, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface TirthItem {
  id: string;
  name: { en: string; hi: string };
  region: { en: string; hi: string };
  significance: { en: string; hi: string };
  history: { en: string; hi: string };
  bestVisible: { en: string; hi: string };
  rules: string[];
  rulesHi: string[];
  coordinates: string;
  image: string;
}

const TIRTHS_DATA: TirthItem[] = [
  {
    id: "shikharji",
    name: { en: "Sammed Shikharji (समेद शिखरजी)", hi: "श्री सम्मेद शिखरजी" },
    region: { en: "Giridih, Jharkhand", hi: "गिरिडीह, झारखंड" },
    significance: {
      en: "The most sacred salvation hill where 20 of the 24 Tirthankars attained final liberation (Moksha).",
      hi: "परम पावन निर्वाण भूमि जहां २४ में से २० जैन तीर्थंकरों ने मोक्ष प्राप्त किया।"
    },
    history: {
      en: "Known as Parasnath hill, climbing the 27km mountain track on foot is traditionally believed to wash away negative karmas. Every peak is dedicated to a specific liberated Tirthankar.",
      hi: "पारसनाथ पहाड़ी के रूप में प्रसिद्ध, २७ किमी की इस वंदना को पैदल करने से सात जन्मों का पाप धुल जाता है। प्रत्येक कूट (शिखर) एक-एक तीर्थंकर को समर्पित है।"
    },
    bestVisible: { en: "October to March (Pleasant cold weather)", hi: "अक्टूबर से मार्च (सुखद शीत ऋतु और कोहरा)" },
    rules: [
      "No leather items whatsoever (wallets, belts) on the mountain track.",
      "Vandana track starts early morning at 3:00 AM.",
      "Strict silence and cleanliness should be maintained near the Tonks (shrines).",
      "Avoid plastics or throwing litter on the sacred hill trail."
    ],
    rulesHi: [
      "पहाड़ ट्रैक पर चमड़े की वस्तुएं (बटुआ, बेल्ट) ले जाना पूरी तरह वर्जित है।",
      "वंदना तड़के सुबह ३:०० बजे प्रारंभ हो जाती है।",
      "टोंकों (चरण चरण पादुकाओं) के समीप पूर्ण मौन एवं पवित्रता बनाए रखें।",
      "पवित्र पहाड़ी पर प्लास्टिक या कचरा फैलाना निषेध है।"
    ],
    coordinates: "https://maps.google.com/?q=Sammed+Shikharji+Jharkhand",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "palitana",
    name: { en: "Palitana Shatrunjaya (पालीताना)", hi: "शत्रुंजय महातीर्थ पालीताना" },
    region: { en: "Bhavnagar, Gujarat", hi: "भावनगर, गुजरात" },
    significance: {
      en: "The divine mountain containing over 863 stunning marble-carved Jain temples on a single hill range.",
      hi: "विश्व का एकमात्र अद्भुत पर्वत जहाँ एक ही पहाड़ी श्रृंखला पर ८६३ से अधिक भव्य संगमरमर मंदिर हैं।"
    },
    history: {
      en: "Shatrunjaya mountain was visited by Lord Adinath, the first Tirthankar. Climbing 3,500 stone steps takes you to the apex. It is believed that millions of saints achieved Moksha on this hill.",
      hi: "शत्रुंजय पर्वत प्रथम तीर्थंकर भगवान आदिनाथ की पावन ध्यान स्थली रहा है। करीब ३५०० सीढ़ियां चढ़कर आदिनाथ मंदिर पहुंचा जाता है। अनंत मुनिराज यहां से मोक्ष गए हैं।"
    },
    bestVisible: { en: "November to March (Mountain remains closed in Monsoon)", hi: "नवंबर से मार्च (चौमासे में पहाड़ वंदना पूर्णतः बंद रहती है)" },
    rules: [
      "Nobody can stay on the mountain top after sunset. Downward journey is mandatory.",
      "Do not eat, drink, or spit while climbing the sacred steps of Shatrunjaya.",
      "Strict white dress protocol is highly appreciated for entering the main shrine.",
      "Leather products and electronic cameras are completely barred."
    ],
    rulesHi: [
      "सूर्यास्त के बाद कोई भी पहाड़ी के ऊपर नहीं ठहर सकता। नीचे आना अनिवार्य है।",
      "पवित्र सीढ़ियों पर चढ़ते समय खाना, पीना या थूकना पूरी तरह वर्जित है।",
      "मुख्य जिनालय में प्रवेश हेतु पारंपरिक सफेद कुर्ता-पायजामा श्रेष्ठ माना जाता है।",
      "चमड़े के सामान तथा इलेक्ट्रॉनिक कैमरों का उपयोग प्रतिबंधित है।"
    ],
    coordinates: "https://maps.google.com/?q=Shatrunjaya+Palitana+Gujarat",
    image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "dilwara",
    name: { en: "Dilwara Marble Temples (दिलवाड़ा)", hi: "दिलवाड़ा देवल मंदिर" },
    region: { en: "Mount Abu, Rajasthan", hi: "माउंट आबू, राजस्थान" },
    significance: {
      en: "World-renowned marble masterpieces built between 11th and 13th centuries, demonstrating surreal architectural carvings.",
      hi: "११वीं से १३वीं शताब्दी के बीच निर्मित विश्व प्रसिद्ध संगमरमर के उत्कृष्ट मंदिर जो शिल्प कला का बेजोड़ नमूना हैं।"
    },
    history: {
      en: "Constructed by Vimal Shah and Vastupal-Tejpal, these five legendary temples feature translucent stone ceiling carvings that defy gravity. The carvings of 'Luna Vasahi' temple are legendary.",
      hi: "विमल शाह और वास्तुपाल-तेजपाल द्वारा निर्मित ये पांच भव्य मंदिर हैं। इनकी छतों और खंभों पर संगमरमर की ऐसी महीन नक्काशी है कि पत्थर भी पानी सा सजीव प्रतीत होता है।"
    },
    bestVisible: { en: "Throughout the year (Cool hill station climate)", hi: "साल भर (माउंट आबू के ठंडे वातावरण के कारण सदैव उत्तम)" },
    rules: [
      "Strict modest clothing required (no shorts, sleeveless tops).",
      "Photography is prohibited within the temple complex to protect the heritage.",
      "Silence must be maintained inside the garbhagriha (inner sanctum).",
      "Leather belongings must be deposited at the cloak counter outside."
    ],
    rulesHi: [
      "शालीन कपड़े पहनना अनिवार्य है (हाफ पैंट, बिना आस्तीन वाले टी-शर्ट वर्जित)।",
      "मंदिर परिसर के भीतर फोटोग्राफी पूरी तरह प्रतिबंधित है ताकि धरोहर सुरक्षित रहे।",
      "गर्भगृह के भीतर शांतचित्त होकर प्रभु दर्शन करें।",
      "चमड़े का सारा सामान बाहर क्लॉक रूम पर जमा करना होता है।"
    ],
    coordinates: "https://maps.google.com/?q=Dilwara+Temples+Mount+Abu",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "girnar",
    name: { en: "Girnarji Siddha Kshetra (गिरनारजी)", hi: "श्री गिरनारजी सिद्ध क्षेत्र" },
    region: { en: "Junagadh, Gujarat", hi: "जूनागढ़, गुजरात" },
    significance: {
      en: "Salvation place of Lord Neminath, the 22nd Tirthankara, nestled atop ancient volcanic peaks.",
      hi: "२२वें तीर्थंकर भगवान नेमिनाथ की दीक्षा, केवलज्ञान और मोक्ष कल्याणक की पवित्र भूमि।"
    },
    history: {
      en: "Climbing nearly 10,000 stone steps takes you past magnificent historical architectures. The 5th peak is highly revered as the spot where Lord Neminath spent solitary tapasyas and reached infinite bliss.",
      hi: "लगभग १०,००० प्राचीन सीढ़ियों को चढ़कर जूनागढ़ की भव्य वनस्पति के बीच इस चोटी पर पहुँचा जाता है। पांचवीं टोंक स्वयं भगवान नेमिनाथ की मोक्ष स्थली मानी जाती है।"
    },
    bestVisible: { en: "November to February", hi: "नवंबर से फरवरी (मानसून के बाद की हरियाली दर्शनीय होती है)" },
    rules: [
      "Avoid carry bag littering; monkeys are active and seek foodstuffs.",
      "Wear strong grip hiking shoes; steps can be extremely steep.",
      "Night treks are highly popular to avoid the intense daytime sun.",
      "Be respectful to all monks and ascetics meditating along the path."
    ],
    rulesHi: [
      "कचरा फैलाना रोकें; बंदर अत्यधिक सक्रिय हैं और खाने का सामान छीन सकते हैं।",
      "मजबूत पकड़ वाले जूते पहनें क्योंकि चढ़ाई बहुत तीव्र और खड़ी है।",
      "तेज धूप से बचने के लिए आधी रात या भोर में चढ़ाई शुरू करना बहुत लोकप्रिय है।",
      "पहाड़ी के रास्ते में मौन तपस्या करते दिगंबर साधुओं का आदर करें।"
    ],
    coordinates: "https://maps.google.com/?q=Girnar+Jain+Temples+Junagadh",
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "ranakpur",
    name: { en: "Ranakpur Pillar Palace (रणकपुर)", hi: "रणकपुर चतुर्मुख जैन मंदिर" },
    region: { en: "Pali, Rajasthan", hi: "पाली, राजस्थान" },
    significance: {
      en: "A massive marble temple with 1,444 uniquely carved pillars, designed like a divine celestial vehicle (Vimana).",
      hi: "१,४४४ खंभों वाला विशाल संगमरमर मंदिर। आश्चर्य है कि कोई भी दो खंभे समान नक्काशी के नहीं हैं।"
    },
    history: {
      en: "Built in the 15th century by Dharani Shah, a wealthy Jain merchant, after a dream of a heavenly flight. Dedicated to Lord Adinath, it features a grand four-faced (Chaumukha) idol and light filters beautifully.",
      hi: "१५वीं शताब्दी में धरणी शाह नामक जैन श्रेष्ठी ने स्वप्न में देवविमान देखने के बाद राणा कुंभा की देखरेख में इसे बनवाया था। इसमें आदिनाथ भगवान की चार मुखों वाली भव्य मूर्ति है।"
    },
    bestVisible: { en: "September to March", hi: "सितंबर से मार्च (मरुस्थलीय सीमा होने से सर्दी सुखद होती है)" },
    rules: [
      "Shorts, mini-skirts, and sleeveless clothing are strictly prohibited inside.",
      "No food items or leather allowed within outer gates.",
      "Ensure silence while listening to the audio guides.",
      "Strict worship entry timings for non-Jains (typically 12:00 PM to 5:00 PM)."
    ],
    rulesHi: [
      "हाफ पैंट या छोटे कपड़े पहने पर्यटकों को भीतर प्रवेश की अनुमति नहीं है।",
      "बाहरी सिंहद्वार के अंदर कोई भी खाद्य पदार्थ या चमड़े की वस्तुएं वर्जित हैं।",
      "मंदिर परिसर की शांति भंग न करें।"
    ],
    coordinates: "https://maps.google.com/?q=Ranakpur+Jain+Temple+Rajasthan",
    image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "shravanabelagola",
    name: { en: "Shravanabelagola (श्रवणबेलगोला)", hi: "श्रवणबेलगोला महामस्तकाभिषेक" },
    region: { en: "Hassan, Karnataka", hi: "हासन, कर्नाटक" },
    significance: {
      en: "Home to the colossal 57-foot continuous monolithic statue of Lord Bahubali (Gomateshwara), carved in 981 AD.",
      hi: "९८१ ईस्वी में निर्मित भगवान बाहुबली (गोमटेश्वर) की ५७ फीट ऊंची विशालकाय एकाश्म (एक ही पत्थर से बनी) मूर्ति।"
    },
    history: {
      en: "Carved under Chavundaraya, prime minister of Ganga Dynasty, atop Vindhyagiri hill. Once every 12 years, the spectacular 'Mahamastakabhisheka' ceremony bathes the statue in milk, saffron, turmeric, and gold coins.",
      hi: "गंगा राजवंश के मंत्री चामुंडराय द्वारा विंध्यगिरि पहाड़ी पर निर्मित। प्रत्येक १२ वर्ष में यहाँ महामस्तकाभिषेक आयोजित होता है, जिससे भगवान बाहुबली की मूर्ति का अद्भुत अभिषेक होता है।"
    },
    bestVisible: { en: "October to February", hi: "अक्टूबर से फरवरी (पहाड़ी ग्रेनाइट पत्थरों पर धूप कम तीखी होती है)" },
    rules: [
      "Ascend the 600+ stone steps barefoot. Socks are allowed for elderly.",
      "Worshipers can carry pure floral plates to offer at the top.",
      "Keep yourself fully hydrated before starting the climb.",
      "Photography has localized charge ticket and restricted angles."
    ],
    rulesHi: [
      "६०० से अधिक चट्टानी सीढ़ियों की चढ़ाई नंगे पैर करनी होती है। बुजुर्गों के लिए मोजे अनुमत हैं।",
      "पीने का पानी साथ रखें क्योंकि चढ़ाई से थकान हो सकती है।",
      "मुख्य चोटी के आस पास पवित्रता एवं मर्यादा का उल्लंघन न करें।"
    ],
    coordinates: "https://maps.google.com/?q=Gomateshwara+Shravanabelagola+Karnataka",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
  }
];

export default function TirthPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedTirth, setSelectedTirth] = useState<TirthItem | null>(null);

  const filtered = TIRTHS_DATA.filter(t => 
    t.name.en.toLowerCase().includes(search.toLowerCase()) ||
    t.name.hi.toLowerCase().includes(search) ||
    t.region.en.toLowerCase().includes(search)
  );

  return (
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
          {lang === 'en' ? 'JAIN TIRTH DIRECTORY' : 'जैन तीर्थ एवं दर्शन गाइड'}
        </h1>
      </header>

      {/* Intro Card */}
      <div className="mb-6 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/5 backdrop-blur-md rounded-3xl p-5 border border-orange-200/50 dark:border-white/5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FF6D00]/20 rounded-2xl flex items-center justify-center text-[#FF6D00]">
          <Compass className="animate-[spin_12s_linear_infinite]" size={24} />
        </div>
        <div className="flex-1">
          <span className="text-[9px] font-black tracking-wider text-orange-500 uppercase block mb-0.5">{lang === 'en' ? 'SPIRITUAL TRAVELS' : 'परम पावन यात्रा'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {lang === 'en' 
              ? "Discover the major Jain Siddha and Atishya Kshetras, containing ancient architectures, holy histories, and yatra protocols."
              : "प्रमुख सिद्ध और अतिशय क्षेत्रों की वंदना करें, जिसमें प्राचीन शिल्प शास्त्र, धार्मिक इतिहास और आवश्यक नियम शामिल हैं।"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 text-[#FF8A65]" size={20} />
        <input 
          type="text" 
          placeholder={lang === 'en' ? "Search sacred places..." : "पवित्र तीर्थ खोजें..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
        />
      </div>

      {/* Main Grid Checklist of items */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(tirth => (
          <div 
            key={tirth.id}
            onClick={() => setSelectedTirth(tirth)}
            className="bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-orange-300 dark:hover:border-white/20 transition-all duration-300 cursor-pointer group"
          >
            {/* Image Placeholder Frame */}
            <div className="h-40 bg-gray-200 dark:bg-[#1A1A1A] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <img 
                src={tirth.image} 
                alt={tirth.name.en} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="flex items-center gap-1 bg-[#FF6D00]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase mb-1.5">
                  <MapPin size={10} />
                  {lang === 'en' ? 'HOLY SITE' : 'सिद्ध क्षेत्र'}
                </div>
                <h3 className="font-display font-black text-white text-lg tracking-wide drop-shadow-md">
                  {lang === 'en' ? tirth.name.en : tirth.name.hi}
                </h3>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mb-2">
                <MapPin size={14} className="text-orange-500" />
                <span>{lang === 'en' ? tirth.region.en : tirth.region.hi}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-4 line-clamp-2">
                {lang === 'en' ? tirth.significance.en : tirth.significance.hi}
              </p>
              <div className="flex items-center justify-between text-xs font-black text-[#FF6D00] uppercase tracking-wider">
                <span>{lang === 'en' ? 'KNOW VISITOR GUIDELINES' : 'दर्शन नियमावली देखें'}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large details popup */}
      <AnimatePresence>
        {selectedTirth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center pt-8"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white dark:bg-[#0d0d0d] w-full max-w-2xl rounded-t-[2.5rem] border-t border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="sticky top-0 bg-white/90 dark:bg-[#0d0d0d]/90 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="text-[#FF6D00]" size={20} />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{lang === 'en' ? 'Tirth Information' : 'तीर्थ विवरण'}</span>
                </div>
                <button 
                  onClick={() => setSelectedTirth(null)}
                  className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-xs font-bold transition-all"
                  id="btn-close-tirth-pop"
                >
                  {lang === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white leading-tight">
                    {lang === 'en' ? selectedTirth.name.en : selectedTirth.name.hi}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#FF6D00] font-bold mt-1">
                    <MapPin size={14} />
                    <span>{selectedTirth.region.en}</span>
                  </div>
                </div>

                {/* Banner image */}
                <div className="h-48 rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-white/5">
                  <img src={selectedTirth.image} alt={selectedTirth.name.en} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Significance Section */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#121212] border border-orange-200/30 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[#FF6D00] mb-2">
                    <Compass size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Significance' : 'विशेष महत्व'}</span>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
                    {lang === 'en' ? selectedTirth.significance.en : selectedTirth.significance.hi}
                  </p>
                </div>

                {/* Legend History */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#2962FF]">
                    <BookOpen size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Divine History & Legend' : 'पावन इतिहास एवं कथा वर्णन'}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {lang === 'en' ? selectedTirth.history.en : selectedTirth.history.hi}
                  </p>
                </div>

                {/* Optimal Season */}
                <div className="flex items-center gap-3 p-3.5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-xs">
                  <Calendar size={18} className="text-yellow-500 shrink-0" />
                  <div>
                    <span className="font-extrabold block text-[8px] tracking-wider text-yellow-600 uppercase mb-0.5">{lang === 'en' ? 'Best Time of Year to Visit' : 'यात्रा का सर्वोत्तम मौसम'}</span>
                    <span className="font-black text-gray-700 dark:text-gray-200">{lang === 'en' ? selectedTirth.bestVisible.en : selectedTirth.bestVisible.hi}</span>
                  </div>
                </div>

                {/* Protocols and Discipline */}
                <div className="p-5 rounded-3xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">{lang === 'en' ? 'Mandatory Discipline (नियमावली)' : 'अनिवार्य दर्शन आचार संहिता'}</span>
                  </div>
                  <ul className="space-y-2 text-xs font-bold text-gray-600 dark:text-gray-300 list-disc list-inside">
                    {lang === 'en' 
                      ? selectedTirth.rules.map((r, i) => <li key={i}>{r}</li>)
                      : selectedTirth.rulesHi.map((r, i) => <li key={i}>{r}</li>)
                    }
                  </ul>
                </div>

                {/* Route maps navigation button */}
                <a 
                  href={selectedTirth.coordinates}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FF6D00] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 font-bold shadow-lg shadow-orange-500/20 active:scale-98 transition-transform"
                >
                  <Navigation size={18} className="fill-white" />
                  <span>{lang === 'en' ? 'GET GPS NAVIGATION ROUTE' : 'गूगल मैप नेविगेशन मार्ग खोलें'}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
