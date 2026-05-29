import { useState, useEffect } from 'react';
import { Users, Info, Quote, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const FALLBACK_SAINTS = [
  {
    name: {
      en: "Acharya Kundakunda Dev (आचार्य कुंदकुंद देव)",
      hi: "आचार्य कुंदकुंद देव (1st Century BC)"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    color: "from-[#FF6D00] to-[#FF3D00]",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "The highly revered philosopher-monk who authored foundational treatises like Samayasara, Pravachanasara, Niyamasara, and Panchastikayasara. He is considered the pillar of the Digambara sect, with his name invoked right after Lord Mahavira and Gautama Gandhara in daily prayers.",
      hi: "जैन धर्म के महानतम दार्शनिक और अध्यात्मवादी संत। उन्होंने समयसार, प्रवचनसार, नियमसार और पंचास्तिकायसार जैसे महान आध्यात्मिक ग्रंथों की रचना की। प्रतिदिन मंगलाचरण में महावीर भगवान और गौतम गणधर के तुरंत बाद इनका नाम आदरपूर्वक स्मरण किया जाता है।"
    }
  },
  {
    name: {
      en: "Acharya Samantabhadra (आचार्य समंतभद्र)",
      hi: "आचार्य समंतभद्र देव (2nd Century AD)"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "The master logician, debater, and creator of the Anekantavada logic school. Famous for composing the 'Ratnakaranda Sravakachara' (conduct code for householders) and the glorious 'Aptamimamsa', which established the concept of the omniscient (Sarvajna).",
      hi: "जैन न्याय (न्यायशास्त्र) के महान आचार्य और अनेकांतवाद के प्रबल व्याख्याता। इन्होंने गृहस्थों के आचरण के लिए 'रत्नकरण्ड श्रावकाचार' और भगवान की परीक्षा करने वाले अद्वितीय ग्रंथ 'आप्तमीमांसा' (देवागम स्तोत्र) की रचना की।"
    }
  },
  {
    name: {
      en: "Acharya Pujyapada / Devanandi (आचार्य पूज्यपाद)",
      hi: "आचार्य पूज्यपाद देव (5th Century AD)"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "A multi-faceted saint who was a master of Sanskrit grammar, ayurvedic medicine, and spiritual philosophy. Author of 'Sarvarthasiddhi' (the oldest commentary on Tattvartha Sutra), 'Samadhitantra', and 'Ishtopadesha'. Legend says devas worshiped his pure lotus feet.",
      hi: "व्याकरण, आयुर्वेद और अध्यात्म के अद्वितीय निष्णात महामुनि। इन्होंने तत्वार्थसूत्र पर सर्वप्रशंसित राजवार्तिक-सर्वार्थसिद्धि भाष्य लिखा, साथ ही 'समाधितंत्र' और 'इष्टोपदेश' जैसी कल्याणकारी आत्म-बोध रचनाएं रचीं।"
    }
  },
  {
    name: {
      en: "Acharya Haribhadra Suri (आचार्य हरिभद्र सूरी)",
      hi: "आचार्य हरिभद्र सूरी (8th Century AD)"
    },
    sect: { en: "Svetambara (श्वेतांबर)", hi: "श्वेतांबर परंपरा" },
    color: "from-red-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "A monumental Svetambara scholar who converted from Brahminism and penned 1448 distinct treatises. He integrated yoga into Jain frameworks in works like 'Yogabindu' and 'Yogadristisamuccaya', and wrote the encyclopedic narrative 'Samaraichcha Kaha'.",
      hi: "श्वेतांबर परंपरा के युगप्रवर्तक आचार्य जिन्होंने योग और दर्शन शास्त्र को अभूतपूर्व दिशा दी। इन्होंने संस्कृति और लोकभाषा में अनेकों ग्रंथ लिखे जिनमें 'षड्दर्शन समुच्चय' और 'योगविंशिका' प्रमुख हैं।"
    }
  },
  {
    name: {
      en: "Acharya Hemachandra Suri (आचार्य हेमचन्द्र सूरी)",
      hi: "आचार्य हेमचन्द्र सूरी - कलिकालसर्वज्ञ"
    },
    sect: { en: "Svetambara (श्वेतांबर)", hi: "श्वेतांबर परंपरा" },
    color: "from-purple-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "Known as the 'Kalaikal Sarvajna' (All-knowing of the Iron Age). He was an advisor to King Kumarapala and wrote standard comprehensive grammar books, historical accounts (Trishashti-shalaka-purusha-charitra), and the 'Yogashastra' systemizing Jain life.",
      hi: "कलिकालसर्वज्ञ उपाधि से विभूषित। सिद्धराज जयसिंह और राजा कुमारपाल के परामर्शदाता। इन्होंने इतिहास (त्रिषष्टि शलाका पुरुष चरित्र), संस्कृत प्राकृत व्याकरण और जैन गृहस्थ चर्या पर 'योगशास्त्र' की वृहद रचना की।"
    }
  },
  {
    name: {
      en: "Prathamacharya Shri Shantisagar Ji Maharaj (आचार्य शांतिसागर जी)",
      hi: "प्रथमाचार्य श्री शांतिसागर जी महाराज (1872-1955)"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    color: "from-amber-600 to-red-700",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "The historic pioneer who revived the silent Digambara ascetic tradition, taking initial vows and traveling on foot thousands of miles across India to restore pilgrimage safety, organize texts, and re-establish standard monk assemblies.",
      hi: "बीसवीं शताब्दी के प्रथम दिगंबर जैन मुनिराज एवं आचार्य। जिन्होंने लुप्तप्राय हो चुकी दक्षिण भारत से उत्तर भारत तक दिगंबर मुनि चर्या को पुनः जीवित किया और देशभर में अहिंसा व संयम की अलख जगाई।"
    }
  },
  {
    name: {
      en: "Param Pujya Acharya Shri Vidyasagar Ji Maharaj (आचार्य विद्यासागर जी)",
      hi: "राष्ट्रसंत आचार्य श्री विद्यासागर जी महाराज (1946-2024)"
    },
    sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
    color: "from-[#FF6D00] to-[#FFD54F]",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "The legendary, fully detached 21st-century Digambara Acharya. Famous for severe physical penance, absolute silence, and massive state-wide welfare schemes like jail inmate transformations, bio-fabrics (Hathkargha), and saving cows (Pratibha Sthali).",
      hi: "आधुनिक युग के महानतम तपोमूर्ति ज्ञानी आचार्यदेव। कठोर चर्या, मौन साधना, हिंदी राष्ट्रभाषा प्रेम और कैदियों के हृदय परिवर्तन, हतकरघा स्वावलंबन तथा गौशाला संरक्षण जैसे महाकार्यों के प्रणेता।"
    }
  },
  {
    name: {
      en: "Yugacharya Acharya Mahapragya Ji (आचार्य महाप्रज्ञ)",
      hi: "युगाचार्य आचार्य महाप्रज्ञ जी (1920-2010)"
    },
    sect: { en: "Svetambara Terapanth (श्वेतांबर तेरापंथ)", hi: "तेरापंथ श्वेतांबर" },
    color: "from-cyan-600 to-blue-700",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
    desc: {
      en: "The tenth coordinate leader of Svetambara Terapanth sect. A spiritual seeker who designed Preksha Meditation (a scientific system of inner cleaning) and spearheaded non-violent 'Ahimsa Yatra' journeys across hundreds of villages.",
      hi: "तेरापंथ धर्मसंघ के १०वें आचार्य। प्रेक्षाध्यान साधना प्रणाली और जीवन विज्ञान के असाधारण प्रणेता। इन्होंने देश भर में हजारों किलोमीटर की अहिंसा यात्रा कर साक्षरता व शांति संदेश बांटा।"
    }
  }
];

export default function SaintsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [saints, setSaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'saints'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSaints(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching saints:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displaySaints = saints.length > 0 ? saints : FALLBACK_SAINTS;

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <Users className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          {language === 'en' ? 'JAIN SAINTS' : 'जैन संत'}
        </h1>
      </header>

      {/* Quote Banner */}
      <div className="mb-8 bg-gradient-to-br from-[#FFD54F]/20 to-[#FF6D00]/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-[0_0_30px_rgba(255,213,79,0.15)] border border-[#FFD54F]/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD54F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FFD54F]/30 transition-all duration-700" />
        
        <div className="flex items-center gap-2 text-[#FFD54F] mb-4 relative z-10">
          <Quote size={18} className="drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,213,79,0.5)]">
            {language === 'en' ? 'Quote of the Day' : 'आज का विचार'}
          </span>
        </div>
        
        <p className="text-lg font-medium text-white italic leading-relaxed relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-4">
          {language === 'en' 
            ? '"Do not injure, abuse, oppress, enslave, insult, torment, torture, or kill any creature or living being."'
            : '"किसी भी प्राणी या जीव को चोट न पहुँचाएँ, दुर्व्यवहार न करें, अत्याचार न करें, गुलाम न बनाएँ, अपमान न करें, या न मारें।"'}
        </p>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FFD54F]/50 shadow-[0_0_10px_rgba(255,213,79,0.3)]">
            <img src="https://picsum.photos/seed/mahavir/100/100" alt="Lord Mahavira" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="text-sm font-bold text-[#FFD54F] tracking-wide">
            — {language === 'en' ? 'Lord Mahavira' : 'भगवान महावीर'}
          </span>
        </div>
      </div>

      <p className="text-gray-400 mb-8 leading-relaxed font-medium bg-[#121212]/80 p-5 rounded-2xl border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {language === 'en'
          ? 'Jain ascetics (Sadhus and Sadhvis) follow strict vows of non-violence, truth, non-stealing, celibacy, and non-attachment. They are the living embodiments of Jain philosophy.'
          : 'जैन मुनि (साधु और साध्वी) अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और अपरिग्रह के कठोर व्रतों का पालन करते हैं। वे जैन दर्शन के जीवित स्वरूप हैं।'}
      </p>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold uppercase tracking-widest text-xs">Loading Saints...</p>
          </div>
        ) : displaySaints.length > 0 ? (
          displaySaints.map((saint: any, idx) => (
          <div key={idx} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left group hover:border-[#FF6D00]/30 hover:shadow-[0_0_30px_rgba(255,109,0,0.15)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-4 border-[#1A1A1A] shadow-[0_0_20px_rgba(0,0,0,0.8)] relative group-hover:border-[#FF6D00]/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6D00]/20 to-transparent mix-blend-overlay z-10" />
              <img src={saint.image} alt={saint.name?.en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className="text-2xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#FFD54F] transition-colors overflow-hidden text-ellipsis">
                {language === 'en' ? saint.name?.en : saint.name?.hi}
              </h2>
              <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white bg-gradient-to-r ${saint.color} mb-4 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}>
                {language === 'en' ? saint.sect?.en : saint.sect?.hi}
              </span>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {language === 'en' ? saint.desc?.en : saint.desc?.hi}
              </p>
            </div>
          </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 font-bold tracking-wide">
            No saints found.
          </div>
        )}
      </div>
      
      <div className="mt-10 bg-[#FF6D00]/10 border border-[#FF6D00]/20 rounded-2xl p-5 flex gap-4 items-start shadow-[0_0_15px_rgba(255,109,0,0.1)]">
        <Info className="text-[#FF8A65] shrink-0 mt-0.5 drop-shadow-[0_0_5px_rgba(255,138,101,0.8)]" size={24} />
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          {language === 'en'
            ? 'This is a brief list of some prominent modern saints. The Jain tradition has been enriched by thousands of enlightened souls throughout history.'
            : 'यह कुछ प्रमुख आधुनिक संतों की संक्षिप्त सूची है। जैन परंपरा को पूरे इतिहास में हजारों प्रबुद्ध आत्माओं द्वारा समृद्ध किया गया है।'}
        </p>
      </div>

    </div>
  );
}
