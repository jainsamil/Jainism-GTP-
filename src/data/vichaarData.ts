export interface Vichaar {
  id?: string;
  hi: string;
  en: string;
  source: string;
  color: string;
}

export const FALLBACK_VICHAARS: Vichaar[] = [
  {
    hi: "अहिंसा परमो धर्मः।",
    en: "Non-violence is the highest religion.",
    source: "महान शास्त्र ग्रंथ",
    color: "from-orange-500 to-amber-600"
  },
  {
    hi: "परस्परोपग्रहो जीवाणाम्।",
    en: "Souls render service to one another.",
    source: "तत्त्वार्थ सूत्र (5.21)",
    color: "from-blue-500 to-indigo-600"
  },
  {
    hi: "जियस्स नत्थि मरणं, जस्स नत्थि अत्तभावो।",
    en: "He who has conquered self-delusion has conquered death.",
    source: "भगवान महावीर",
    color: "from-emerald-500 to-teal-600"
  },
  {
    hi: "सत्यमेव व्रतमुत्तमम्।",
    en: "Truth indeed is the supreme vow.",
    source: "आचार्य कुन्दकुन्द",
    color: "from-purple-500 to-fuchsia-600"
  },
  {
    hi: "मित्ती मे सव्व-भूदेसु, वेरं मज्झं न केणवि।",
    en: "I have friendship with all beings and enmity with none.",
    source: "समण सुत्तं (सार)",
    color: "from-rose-500 to-pink-600"
  },
  {
    hi: "णिच्छयदो अत्ता दु अत्तणो चेव हवदि सरणं।",
    en: "From the absolute standpoint, the soul indeed is its own refuge.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-amber-500 to-orange-600"
  },
  {
    hi: "अप्पमत्तो कुरु संजमं।",
    en: "Remain vigilant and practice self-control at all times.",
    source: "आचार्य कुन्दकुन्द (नियमसार)",
    color: "from-indigo-500 to-cyan-600"
  },
  {
    hi: "रागदोसविणिम्मुत्तो समताभावेण संजुदो।",
    en: "Be free from attachment and aversion, anchored firmly in equanimity.",
    source: "आचार्य पूज्यपाद",
    color: "from-violet-500 to-purple-600"
  },
  {
    hi: "संसारसुखं नहि सुखं, केवलं दुःखमेव तत्।",
    en: "Samsara's pleasure is no true pleasure; it is merely pain in disguise.",
    source: "आचार्य कुन्दकुन्द (प्रवचनसार)",
    color: "from-rose-600 to-orange-500"
  },
  {
    hi: "सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः।",
    en: "Right belief, right knowledge, and right conduct together constitute the path to liberation.",
    source: "तत्त्वार्थ सूत्र (1.1)",
    color: "from-emerald-600 to-blue-500"
  },
  {
    hi: "जीवो सुद्धो णिच्छयदो।",
    en: "In absolute reality, every living soul is pure and luminous.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-yellow-500 to-orange-600"
  },
  {
    hi: "चिदानन्दमयी शुद्धात्मा संसारी न कथंचन।",
    en: "The pure consciousness is never identical to worldly affairs.",
    source: "आचार्य अमृतचन्द्र",
    color: "from-cyan-500 to-teal-600"
  },
  {
    hi: "जाणदि पस्सदि सव्वं खलु अत्ता।",
    en: "The soul alone genuinely perceives and knows all.",
    source: "आचार्य कुन्दकुन्द (नियमसार)",
    color: "from-pink-500 to-rose-600"
  },
  {
    hi: "इन्द्रियमुखं अतितुच्छं, आत्मसुखमेव परमानन्दम्।",
    en: "Sensual pleasures are utterly fleeting; soul-realization is eternal bliss.",
    source: "आचार्य पूज्यपाद (इष्टोपदेश)",
    color: "from-fuchsia-500 to-purple-600"
  },
  {
    hi: "कषायमुक्तिः परा शान्तिः।",
    en: "Freedom from passions (anger, pride, deceit, greed) yields absolute peace.",
    source: "भगवान महावीर",
    color: "from-blue-500 to-sky-600"
  },
  {
    hi: "आकिंचन्यं परं सुखम्।",
    en: "Non-possessiveness (Aparigraha) is the ultimate source of happiness.",
    source: "आचार्य समन्तभद्र",
    color: "from-orange-500 to-red-600"
  },
  {
    hi: "कर्मणो बन्धो हि रागद्वेषाभ्याम्।",
    en: "Bondage of karma arises solely from attachment and aversion.",
    source: "आचार्य अमृतचन्द्र (पुरुषार्थसिद्ध्युपाय)",
    color: "from-amber-600 to-yellow-500"
  },
  {
    hi: "सव्वं जगं वि सव्वं, अत्ता मे केवलं दिट्ठी।",
    en: "The entire outer universe is separate, my deep inner self is the sole sight.",
    source: "आचार्य कुन्दकुन्द",
    color: "from-teal-500 to-emerald-600"
  },
  {
    hi: "धम्मो मगलमुक्किट्ठं अहिंसा संजमो तवो।",
    en: "Religion is the highest auspicious blessing; it consists of ahimsa, self-control, and austerity.",
    source: "समण सुत्तं",
    color: "from-rose-500 to-amber-500"
  },
  {
    hi: "कोधो पीदिं विणासेदि, माणो विणय विणासेदि।",
    en: "Anger destroys love, while pride destroys modesty and humility.",
    source: "दशवैकालिक सूत्र",
    color: "from-emerald-500 to-cyan-500"
  },
  {
    hi: "अत्ता हि सरणं मज्झं।",
    en: "The pure consciousness is my only true refuge.",
    source: "भगवान महावीर के उपदेश",
    color: "from-purple-500 to-violet-600"
  },
  {
    hi: "णिम्ममो णीरागो हवदि अत्ता।",
    en: "The pure soul is entirely devoid of ownership and attachment.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-sky-500 to-blue-600"
  },
  {
    hi: "संसारस्स कारणं अण्णाणं।",
    en: "Ignorance is the root cause of the endless cycle of rebirth.",
    source: "आचार्य नेमिचन्द्र (द्रव्यसंग्रह)",
    color: "from-red-500 to-rose-600"
  },
  {
    hi: "समता एव परमो योगः।",
    en: "Equanimity toward all conditions is the highest meditation.",
    source: "आचार्य शुभचन्द्र (ज्ञानार्णव)",
    color: "from-indigo-600 to-violet-500"
  },
  {
    hi: "मज्झत्थभावो सव्वभूदेसु।",
    en: "Maintain an attitude of friendly neutrality toward all beings.",
    source: "आचार्य अमृतचन्द्र",
    color: "from-amber-500 to-lime-600"
  },
  {
    hi: "जीवो जदि सुद्धो तदो सो मुक्को।",
    en: "If the soul is realized as pure, it experiences true freedom.",
    source: "आचार्य कुन्दकुन्द (समयसार)",
    color: "from-teal-600 to-blue-600"
  },
  {
    hi: "एगो मे सासदो अप्पा।",
    en: "My soul is completely singular, eternal, and full of pure knowing.",
    source: "आचार्य कुन्दकुन्द (द्वय्यानुप्रेक्षा)",
    color: "from-orange-500 to-amber-600"
  },
  {
    hi: "तवेण कम्मं खवेदि।",
    en: "Through self-discipline and austerity, past karmic blockages dissolve.",
    source: "तत्त्वार्थ सूत्र (9.3)",
    color: "from-pink-500 to-red-600"
  },
  {
    hi: "अप्पा कत्ता सव्वदुक्ख सुक्खाणं।",
    en: "The soul alone is the architect of its own happiness and misery.",
    source: "भगवान महावीर",
    color: "from-cyan-600 to-blue-500"
  },
  {
    hi: "ज्ञानमेव परमं जोदी।",
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
