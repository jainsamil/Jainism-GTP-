export interface Vichaar {
  id?: string;
  hi: string;
  en: string;
  source: string;
  color: string;
}

export const FALLBACK_VICHAARS: Vichaar[] = [
  {
    hi: "अहिंसा ही सबसे बड़ा धर्म और कर्तव्य है।",
    en: "Non-violence is the highest religion.",
    source: "महान शास्त्र ग्रंथ",
    color: "from-orange-500 to-amber-600"
  },
  {
    hi: "संसार के सभी जीव एक-दूसरे की सेवा और सहायता करने के लिए बने हैं।",
    en: "Souls render service to one another.",
    source: "तत्त्वार्थ सूत्र (5.21)",
    color: "from-blue-500 to-indigo-600"
  },
  {
    hi: "जिसने अपने मन के मोह और भ्रम को जीत लिया है, उसने मानो मृत्यु को पराजित कर दिया।",
    en: "He who has conquered self-delusion has conquered death.",
    source: "भगवान महावीर",
    color: "from-emerald-500 to-teal-600"
  },
  {
    hi: "सत्य बोलना ही जीवन का सबसे उत्तम और श्रेष्ठ व्रत है।",
    en: "Truth indeed is the supreme vow.",
    source: "आचार्य कुन्दकुन्द",
    color: "from-purple-500 to-fuchsia-600"
  },
  {
    hi: "मेरी इस जगत के सभी जीवों के साथ मित्रता है, किसी भी जीव के प्रति मेरा कोई बैर या शत्रुता नहीं है।",
    en: "I have friendship with all beings and enmity with none.",
    source: "समण सुत्तं (सार)",
    color: "from-rose-500 to-pink-600"
  },
  {
    hi: "गहराई से देखा जाए तो स्वयं की जागृत आत्मा ही जीवन में हमारा सच्चा सहारा और रक्षक है।",
    en: "From the absolute standpoint, the soul indeed is its own refuge.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-amber-500 to-orange-600"
  },
  {
    hi: "सदा सावधान रहें और अपने जीवन में सुंदर आत्म-नियंत्रण (संयम) बनाए रखें।",
    en: "Remain vigilant and practice self-control at all times.",
    source: "आचार्य कुन्दकुन्द (नियमसार)",
    color: "from-indigo-500 to-cyan-600"
  },
  {
    hi: "राग और द्वेष (मोह और नफरत) से मुक्त होकर, हमेशा मन में समता का भाव बनाए रखें।",
    en: "Be free from attachment and aversion, anchored firmly in equanimity.",
    source: "आचार्य पूज्यपाद",
    color: "from-violet-500 to-purple-600"
  },
  {
    hi: "सांसारिक सुख वास्तव में कोई सच्चा सुख नहीं है, यह तो केवल दुखों का ही एक रूप है।",
    en: "Samsara's pleasure is no true pleasure; it is merely pain in disguise.",
    source: "आचार्य कुन्दकुन्द (प्रवचनसार)",
    color: "from-rose-600 to-orange-500"
  },
  {
    hi: "सच्ची श्रद्धा, शुद्ध ज्ञान और उत्तम आचरण मिलकर ही मोक्ष व परम सुख का सच्चा मार्ग बनाते हैं।",
    en: "Right belief, right knowledge, and right conduct together constitute the path to liberation.",
    source: "तत्त्वार्थ सूत्र (1.1)",
    color: "from-emerald-600 to-blue-500"
  },
  {
    hi: "परम यथार्थ में, संसार का प्रत्येक जीव स्वभाव से पूरी तरह शुद्ध और पवित्र है।",
    en: "In absolute reality, every living soul is pure and luminous.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-yellow-500 to-orange-600"
  },
  {
    hi: "ज्ञान और आनंद से भरपूर हमारी शुद्ध आत्मा कभी भी बाहरी सांसारिक प्रपंचों में नहीं बंधती।",
    en: "The pure consciousness is never identical to worldly affairs.",
    source: "आचार्य अमृतचन्द्र",
    color: "from-cyan-500 to-teal-600"
  },
  {
    hi: "केवल हमारी आत्मा ही इस सृष्टि की समस्त क्रियाओं को गहराई से देखने और जानने वाली शक्ति है।",
    en: "The soul alone genuinely perceives and knows all.",
    source: "आचार्य कुन्दकुन्द (नियमसार)",
    color: "from-pink-500 to-rose-600"
  },
  {
    hi: "इंद्रियों से मिलने वाले बाहरी सुख बहुत छोटे और क्षणभंगुर हैं, असली आनंद तो आत्मा के अनुभव में है।",
    en: "Sensual pleasures are utterly fleeting; soul-realization is eternal bliss.",
    source: "आचार्य पूज्यपाद (इष्टोपदेश)",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    hi: "क्रोध, मान, माया और लोभ जैसे विकारों से पूर्ण मुक्ति ही सबसे परम शांति प्रदान करती है।",
    en: "Freedom from passions (anger, pride, deceit, greed) yields absolute peace.",
    source: "भगवान महावीर",
    color: "from-blue-500 to-sky-600"
  },
  {
    hi: "अपरिग्रह यानी सांसारिक वस्तुओं के मोह का त्याग करना ही सबसे बड़ा सुख है।",
    en: "Non-possessiveness (Aparigraha) is the ultimate source of happiness.",
    source: "आचार्य समन्तभद्र",
    color: "from-orange-500 to-red-600"
  },
  {
    hi: "कठिन कर्मों का बंधन केवल हमारे मन में छिपे राग और द्वेष के भावों से ही जन्म लेता है।",
    en: "Bondage of karma arises solely from attachment and aversion.",
    source: "आचार्य अमृतचन्द्र (पुरुषार्थसिद्ध्युपाय)",
    color: "from-amber-600 to-yellow-500"
  },
  {
    hi: "यह समस्त संसार बाहरी है, केवल मेरी आंतरिक निर्मल दृष्टि ही मेरा सच्चा स्वरूप है।",
    en: "The entire outer universe is separate, my deep inner self is the sole sight.",
    source: "आचार्य कुन्दकुन्द",
    color: "from-teal-500 to-emerald-600"
  },
  {
    hi: "धर्म ही इस सृष्टि का सबसे शुभ आशीर्वाद है, जो अहिंसा, संयम और तप से पूर्ण होता है।",
    en: "Religion is the highest auspicious blessing; it consists of ahimsa, self-control, and austerity.",
    source: "समण सुत्तं",
    color: "from-rose-500 to-amber-500"
  },
  {
    hi: "क्रोध हमारे आपसी स्नेह और प्रेम का नाश करता है, और अहंकार व्यक्ति की विनम्रता को नष्ट कर देता है।",
    en: "Anger destroys love, while pride destroys modesty and humility.",
    source: "दशवैकालिक सूत्र",
    color: "from-emerald-500 to-cyan-500"
  },
  {
    hi: "विपत्ति के समय मेरी अपनी जागृत शुद्ध चेतना ही मेरी एकमात्र सच्ची शरण और रक्षक है।",
    en: "The pure consciousness is my only true refuge.",
    source: "भगवान महावीर के उपदेश",
    color: "from-purple-500 to-violet-600"
  },
  {
    hi: "सच्ची आत्मा ममता, अहंकार और राग-द्वेष के बंधनों से पूरी तरह परे और उदासीन होती है।",
    en: "The pure soul is entirely devoid of ownership and attachment.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-sky-500 to-blue-600"
  },
  {
    hi: "अज्ञान और जीवन की अवास्तविक समझ ही इस संसार के कष्टों का मूल कारण है।",
    en: "Ignorance is the root cause of the endless cycle of rebirth.",
    source: "आचार्य नेमिचन्द्र (द्रव्यसंग्रह)",
    color: "from-red-500 to-rose-600"
  },
  {
    hi: "प्रत्येक सुख-दुःख की परिस्थिति में मन का संतुलन (समता) रखना ही सबसे बड़ी साधना है।",
    en: "Equanimity toward all conditions is the highest meditation.",
    source: "आचार्य शुभचन्द्र (ज्ञानार्णव)",
    color: "from-indigo-600 to-violet-500"
  },
  {
    hi: "संसार के सभी जीवों के प्रति हमेशा एक मित्रवत और तटस्थता का पावन भाव रखना चाहिए।",
    en: "Maintain an attitude of friendly neutrality toward all beings.",
    source: "आचार्य अमृतचन्द्र",
    color: "from-amber-500 to-lime-600"
  },
  {
    hi: "यदि मनुष्य अपनी आत्मा को उसके शुद्ध स्वरूप में पहचान ले, तो वह इसी क्षण मोक्ष पा लेता है।",
    en: "If the soul is realized as pure, it experiences true freedom.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-teal-600 to-blue-600"
  },
  {
    hi: "मेरी आत्मा पूरी तरह एकाकी, अविनाशी और शाश्वत ज्ञान के दिव्य प्रकाश से परिपूर्ण है।",
    en: "My soul is completely singular, eternal, and full of pure knowing.",
    source: "आचार्य कुन्दकुन्द (द्वय्यानुप्रेक्षा)",
    color: "from-orange-500 to-amber-600"
  },
  {
    hi: "पवित्र संकल्प, उत्तम व्रत और तपस्या से हमारे पुराने बुरे कर्मों का क्षय हो जाता है।",
    en: "Through self-discipline and austerity, past karmic blockages dissolve.",
    source: "तत्त्वार्थ सूत्र (9.3)",
    color: "from-pink-500 to-red-600"
  },
  {
    hi: "यह जीव स्वयं ही अपने समस्त सुखों और दुखों का निर्माण करने वाला एकमात्र रचयिता है।",
    en: "The soul alone is the architect of its own happiness and misery.",
    source: "भगवान महावीर",
    color: "from-cyan-600 to-blue-500"
  },
  {
    hi: "सही आत्मज्ञान ही जीवन का वह परम प्रकाश है जो अज्ञान के गहरे अंधकार को मिटा देता है।",
    en: "Self-knowledge is the ultimate divine light that dispels darkness.",
    source: "आचार्य पूज्यपाद (samadhi tantra)",
    color: "from-orange-500 to-yellow-600"
  }
];

export function getDeterministicVichaar(list: Vichaar[]): Vichaar {
  const activeList = list && list.length > 0 ? list : FALLBACK_VICHAARS;
  
  // Calculate day-based index sequentially using UTC days since epoch to prevent timezone misalignment and guarantee 30-day non-repetition
  const now = new Date();
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  // Use timezone adjusted epoch days
  const localOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  const epochDays = Math.floor((now.getTime() - localOffsetMs) / millisecondsInDay);
  
  const index = epochDays % activeList.length;
  return activeList[index];
}
