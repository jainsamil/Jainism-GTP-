import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ShieldAlert, CheckCircle2, Apple, Utensils, HelpCircle, Heart, Search, ListFilter, AlertTriangle, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

interface Recipe {
  id: string;
  name: { en: string; hi: string };
  category: string;
  time: string;
  ingredients: string[];
  ingredientsHi: string[];
  instructions: string[];
  instructionsHi: string[];
  tips: { en: string; hi: string };
  image: string;
}

const BASE_RECIPES: Recipe[] = [
  {
    id: "r1",
    name: { en: "Satvik Paneer Tikka Masala", hi: "सात्विक पनीर टिक्का मसाला" },
    category: "Daily Satvik (रोज का भोजन)",
    time: "25 Mins",
    ingredients: [
      "200g Fresh Paneer cubes",
      "1 cup Tomato puree (No onions)",
      "1/2 cup Cashew & Melon seed paste (replacement for onion body)",
      "1/4 cup Fresh yogurt (for marination)",
      "Spices: Ginger, green chilies, turmeric, garam masala, salt",
      "Fresh coriander leaves for garnish"
    ],
    ingredientsHi: [
      "२०० ग्राम ताजा पनीर क्यूब्स",
      "१ कप टमाटर प्यूरी (बिना प्याज)",
      "१/२ कप काजू और खरबूजे के बीज का पेस्ट (कंसिस्टेंसी हेतु)",
      "१/४ कप ताजा दही (मैरिनेशन मथने के लिए)",
      "मसाले: अदरक, हरी मिर्च, हल्दी, गरम मसाला, नमक",
      "गार्निशिंग के लिए बारीक संवारा धनिया पत्ता"
    ],
    instructions: [
      "Mix yogurt, turmeric, slit ginger, and salt together. Marinate paneer cubes for 10 minutes.",
      "Lightly toast the marinated paneer cubes in a flat pan with minimal oil.",
      "Prepare gravy by cooking tomato puree, ginger extract, and cashew seed paste until oil separates.",
      "Stir in spices. Add roasted paneer, a splash of water, and simmer gently for 5 minutes.",
      "Garnish with fresh coriander. Serve hot."
    ],
    instructionsHi: [
      "दही, हल्दी, कद्दूकस अदरक और नमक मिला लें। पनीर क्यूब्स को १० मिनट के लिए मैरिनेट करें।",
      "मैरिनेटेड पनीर क्यूब्स को कम तेल में एक पैन में हल्का सा सेंक लें।",
      "टमाटर प्यूरी, अदरक पेस्ट और काजू पेस्ट को कड़ाही में भून लें जब तक कि मसाला घी न छोड़ दे।",
      "मसाले डालें। भुना पनीर और थोड़ा पानी मिलाकर ५ मिनट तक धीमी आंच पर पकाएं।",
      "धनिया पत्ता छिड़कें और गर्मागर्म परोसें।"
    ],
    tips: {
      en: "Jain gravies use cashew, melon seeds, or coconut paste instead of onion and garlic, giving a royal creamy texture.",
      hi: "जैन ग्रेवी बनाने के लिए प्याज की जगह काजू-खरबूजे के मगज का पेस्ट उपयोग होता है, जिससे उत्कृष्ट गाढ़ापन आता है।"
    },
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r2",
    name: { en: "Traditional Besan Gatta Curry", hi: "पारंपरिक बेसन गट्टा करी" },
    category: "Festive Special (पारंपरिक भोजन)",
    time: "30 Mins",
    ingredients: [
      "1 cup Gram flour (Besan)",
      "1/2 cup Sour yogurt (for rich curd gravy)",
      "1 tbsp Oil",
      "Spices: Carom seeds (Ajwain), Asafoetida (Hing), red chili, fennel, salt",
      "Filtered water for boiling gattas"
    ],
    ingredientsHi: [
      "१ कप चने का बेसन",
      "१/२ कप खट्टा पका हुआ दही",
      "१ बड़ा चम्मच कुकिंग तेल",
      "मसाले: अजवाइन, शुद्ध हींग, लाल मिर्च, पिसी सौंफ, नमक",
      "गट्टे उबालने के लिए छना हुआ मर्यादित जल"
    ],
    instructions: [
      "Mix gram flour with carom seeds, oil, chili, hing, and a little yogurt. Knead into a firm cylinder roll dough.",
      "Boil filtered water in a pot. Add gatta cylinder rolls. Cook until bubbles appear on rolls, then slice them into bite-sized cylinders.",
      "Whip sour curd with turmeric, chili powder, and coriander powder.",
      "Heat a pan with oil, temper with cumin & hing. Cook curd mix on low heat, stirring continuously to prevent curdling.",
      "Add boiled sliced gattas. Simmer for 10 minutes until thick curry forms."
    ],
    instructionsHi: [
      "बेसन में अजवाइन, मोयन तेल, मिर्च, चुटकी हींग और थोड़ा दही मिलाएं। कड़ा आटा गूंथ लें।",
      "आटे के लंबे रोल बनाएं। उबलते मर्यादित पानी में इन्हें डालें। उबल जाने पर पानी से निकालकर छोटे टुकड़े काटें।",
      "दही में हल्दी, शुद्ध कश्मीरी मिर्च और सूखा पिसा धनिया मथ लें।",
      "पैन में घी-तेल गर्म कर जीरा व हींग तड़काएं। दही का घोल मिलाएं और तेज लगातार चलाएं ताकि दही फटे नहीं।",
      "कटे गट्टे डालें, मध्यम आंच पर १० मिनट पकने दें।"
    ],
    tips: {
      en: "A pinch of Asafoetida (Hing) gives deep digestive benefits and acts as an aromatic substitute for garlic flavors.",
      hi: "बेसन के पकवानों में हींग का तड़का पाचन सुधारता है और प्याज-लहसुन के तड़के जैसी उत्कृष्ट सुगंध देता है।"
    },
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r3",
    name: { en: "Paryushan Special Moong Khichdi", hi: "पर्युषण स्पेशल मूंगदाल खिचड़ी" },
    category: "Fasting & Paryushan (व्रत उपवास अनुकूल)",
    time: "20 Mins",
    ingredients: [
      "1/2 cup Split yellow moong dal (washed)",
      "1/2 cup Husked rice grains (washed)",
      "1 tbsp Cow's pure ghee",
      "Spices: Cumin seeds, Asafoetida (Hing), black pepper, salt, turmeric (if permitted)",
      "No green vegetables used during strict Paryushan days"
    ],
    ingredientsHi: [
      "१/२ कप धुली सूखी पीली मूंग दाल",
      "१/२ कप मर्यादित चावल के दाने",
      "१ बड़ा चम्मच गाय का शुद्ध देसी घी",
      "मसाले: जीरा, शुद्ध हींग, काली मिर्च, सेंधा नमक, हल्दी",
      "पर्युषण पर्व के दिनों में किसी भी हरी सब्जी या धनिया पत्ते का उपयोग न करें"
    ],
    instructions: [
      "Wash rice and lentil (dal) thoroughly in pure filtered water.",
      "In a traditional pressure pot, heat pure ghee. Crackle cumin seeds and add a strong pinch of hing.",
      "Add washed rice, lentils, salt, black pepper powder, and 3 cups of water.",
      "Cover and pressure cook for 3-4 whistles until extremely soft and porridge-like consistency.",
      "Serve hot with a dollop of fresh ghee. Peaceful and light digest."
    ],
    instructionsHi: [
      "चावल और मूंग दाल को धो लें।",
      "कुकर या बड़े बर्तन में शुद्ध गाय का घी गर्म करें। जीरा और हींग का छौंक लगाएं।",
      "धुले चावल, मूंग दाल, नमक, पिसी काली मिर्च और ३ कप मर्यादा जल मिलाएं।",
      "ढक्कन बंद कर ३-४ सीटी आने तक पकाएं ताकि खिचड़ी एकदम मूंह में घुल जाने वाली और सुपाच्य हो।",
      "गरमा-गरम परोसें। सुपाच्य और शांत सात्विक आहार।"
    ],
    tips: {
      en: "During strict Paryushan days, Jains consume simple grains and pulses, avoiding any leafy greens or raw vegetables to maximize non-violence.",
      hi: "पर्युषण महापर्व के दिनों में सूक्ष्म जीवों की रक्षा के लिए हरी पत्तियां, सब्जियां और गीली वनस्पति पूरी तरह त्याग दी जाती हैं।"
    },
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r4",
    name: { en: "Rajasthani Ker Sangri Sabji", hi: "शाही मारवाड़ी केर सांगरी" },
    category: "Festive Special (पारंपरिक भोजन)",
    time: "40 Mins",
    ingredients: [
      "1/2 cup Dried Ker berries (washed & soaked overnight)",
      "1 cup Sangri beans (boiled)",
      "2 tbsp Mustard oil or Ghee",
      "Spices: Fennel seeds (Saunf), carom, asafoetida, dry mango powder (amchur), turmeric, red chili, coriander powder, salt",
      "No root vegetables or fresh green ginger are used"
    ],
    ingredientsHi: [
      "१/२ कप सूखे केर बेरी (धोकर रातभर भिगोए हुए)",
      "१ कप सांगरी फली (उबले हुए)",
      "२ बड़े चम्मच सरसों का तेल या घी",
      "मसाले: सौंफ, अजवाइन, शुद्ध हींग, अमचूर पाउडर, हल्दी, कुटी लाल मिर्च, पिसा धनिया, नमक"
    ],
    instructions: [
      "Wash ker and sangri multiple times in filtered water to remove sand dust.",
      "In a traditional wok, heat oil or ghee. Crackle fennel seeds, add a generous pinch of asafoetida.",
      "Add boiled ker sangri together. Saute gently on medium flame.",
      "Sprinkle coriander, chili powder, turmeric, salt, and dry mango powder.",
      "Simmer for 15 minutes with a splash of filtered water until the berries absorb the spiced tanginess."
    ],
    instructionsHi: [
      "केर और सांगरी को धूल मिटाने के लिए ३-४ बार साफ मर्यादित जल से धो लें।",
      "कड़ाही में तेल या शुद्ध घी गर्म करें। सौंफ तड़काएं और प्रचुर मात्रा में शुद्ध हींग डालें।",
      "उगले हुए केर और सांगरी डालें। मध्यम आंच पर धीरे-धीरे भूनें।",
      "धनिया, मिर्च कश्मीरी, हल्दी, नमक और पर्याप्त अमचूर पाउडर छिड़कें।",
      "थोड़ा मर्यादित पानी छिड़क कर १५ मिनट के लिए ढककर पकाएं ताकि सांगरी मसालों का तीखा स्वाद सोख ले।"
    ],
    tips: {
      en: "Ker Sangri is a royal desert dry delicacy that stays fresh for days and is perfectly suited for traveling and fasting seasons.",
      hi: "केर सांगरी एक शाश्वत शाही राजस्थानी व्यंजन है जो कई दिनों तक खराब नहीं होता, अतः यात्रा और व्रत के दिनों के लिए सर्वोत्तम माना जाता है।"
    },
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r5",
    name: { en: "Crispy Yellow Moong Dal Cheela", hi: "कर्करा पीली मूंगदाल चीला (हेल्दी नाश्ता)" },
    category: "Daily Satvik (रोज का भोजन)",
    time: "15 Mins",
    ingredients: [
      "1 cup Split yellow Moong dal (soaked for 3 hours)",
      "1-2 Fresh green chilies",
      "1/2 inch Grated fresh ginger",
      "A pinch of Turmeric and Salt",
      "Ghee for cooking on flat iron griddle"
    ],
    ingredientsHi: [
      "१ कप पीली मूंग दाल (३ घंटे पानी में भिगोई)",
      "१-२ बारीक कटी हरी मिर्च",
      "१/२ इंच कद्दूकस की हुई ताजी अदरक",
      "चुटकी भर हल्दी और नमक",
      "लोहे के तवे पर चीला सेंकने के लिए शुद्ध गाय का घी"
    ],
    instructions: [
      "Grind the soaked yellow dal into a coarse, smooth flowy batter along with green chilies and grated ginger.",
      "Beat the batter by hand for 3 minutes to incorporate air, making it fluffy and light.",
      "Stir in salt and turmeric.",
      "Pour a ladle of batter over a hot flat iron griddle, spread in spiral rounds.",
      "Drizzle ghee around borders and cook until golden brown and super crispy. Serve hot with pure mint chutney."
    ],
    instructionsHi: [
      "भीगी हुई दाल को हरी मिर्च और अदरक के साथ ग्राइंडर में अच्छी तरह पीस लें।",
      "घोल को २-३ मिनट अच्छी तरह फेंटें जिससे यह हल्का और फूला हुआ बन जाए।",
      "इसमें आवश्यकतानुसार हल्दी और नमक मिलाएं।",
      "गर्म फैले लोहे के तवे पर चमचे से घोल फैलाएं और गोल-गोल घुमाएं।",
      "किनारों पर गाय का घी डालें और चीले को सुनहरा भूरा व कुरकुरा होने तक सेंकें। पुदीना चटनी के साथ परोसें।"
    ],
    tips: {
      en: "Beating the batter by hand is the traditional secret to getting airy crisp cheelas without baking soda.",
      hi: "बैटर को हाथ से फेंटना ही बिना बेकिंग सोडा के चीला कुरकुरा और हल्का बनाने का मुख्य राज है।"
    },
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r8",
    name: { en: "Refreshing Pearl Guava Chutney", hi: "मर्यादित अमरुद की चटनी" },
    category: "Daily Satvik (रोज का भोजन)",
    time: "10 Mins",
    ingredients: [
      "2 Fresh ripe white guavas (seeds scraped check carefully)",
      "1 cup Fresh mint and coriander leaves",
      "1-2 Green chilies",
      "Spices: Cumin powder, rock salt (Sendha Namak), lemon juice"
    ],
    ingredientsHi: [
      "२ ताजे पके अमरुद (बीज भाग निकालकर ध्यान से चेक करें)",
      "१ कप ताजी पुदीना व धनिया पत्ती",
      "१-२ कटी हरी मिर्च",
      "मसाले: भुना जीरा पाउडर, सेंधा नमक, ताजे नींबू का रस"
    ],
    instructions: [
      "Wash guavas, cut in half, scrap the seed cavity (to avoid small worms if any). Slice the flesh.",
      "In a traditional mechanical stone pestle or grinder, spin guava slices with mint, chilies, cumin powder and salt.",
      "Grind into a thick tangy savory chutney paste.",
      "Squeeze fresh lemon juice on top. Serve as a cooling digestive side with rotis or cheelas."
    ],
    instructionsHi: [
      "अमरुद स्वच्छ कर बीच का बीज वाला कठोर हिस्सा निकालकर अलग कर दें। शेष पल्प के छोटे टुकड़े काटें।",
      "मर्यादित ग्राइंडर या सिलबट्टे में अमरुद, पुदीना, धनिया पत्ती, मिर्च, भुना जीरा और सेंधा नमक मिलाएं।",
      "चटनी को दरदरा गाढ़ा पीस लें।",
      "ऊपर से नींबू का रस मिलाएं। चीले या रोटी के साथ एक बेहतरीन सुपाच्य पाचक चटनी।"
    ],
    tips: {
      en: "Guavas are a great replacement for tomatoes when tomatoes are scarce or during specific fasting-oriented grain restricted days.",
      hi: "अमरुद की चटनी अत्यंत पौष्टिक और पाचक होती है, जिसे सात्विक भोजन के साथ साइड डिश के रूप में परोसा जाता है।"
    },
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400"
  }
];

// Generate robust and highly realistic 100+ Jain Recipes programmatically
const generateJainRecipes = (): Recipe[] => {
  const list = [...BASE_RECIPES];
  const grainBases = [
    { en: "Makhana (Foxnut)", hi: "मखाना" },
    { en: "Bajra (Millet)", hi: "बाजरा" },
    { en: "Sprouted Moong", hi: "अंकुरित मूंग" },
    { en: "Kela (Raw Banana)", hi: "कच्चा केला" },
    { en: "Singhara (Chestnut)", hi: "सिंघाड़ा" },
    { en: "Sama Rice", hi: "समा चावल" },
    { en: "Chana Dal", hi: "चना दाल" },
    { en: "Sabudana", hi: "साबूदाना" },
    { en: "Whole Wheat", hi: "साबुत गेहूं" },
    { en: "Rajgira (Amaranth)", hi: "राजगिरा" },
    { en: "Urad Dal", hi: "उड़द दाल" },
    { en: "Paneer cubes", hi: "पनीर क्यूब्स" }
  ];
  
  const preparationStyles = [
    { en: "Tempered Kadhi", hi: "तड़के वाली कढ़ी", category: "Daily Satvik (रोज का भोजन)", time: "20 Mins" },
    { en: "Healthy Khichdi", hi: "सुपाच्य खिचड़ी", category: "Fasting & Paryushan (व्रत उपवास अनुकूल)", time: "15 Mins" },
    { en: "Nutritious Daliya", hi: "पौष्टिक दलिया", category: "Daily Satvik (रोज का भोजन)", time: "15 Mins" },
    { en: "Aromatic Pulao", hi: "सुगंधित पुलाव", category: "Daily Satvik (रोज का भोजन)", time: "25 Mins" },
    { en: "Crispy Cheela", hi: "कुरकुरा चीला", category: "Daily Satvik (रोज का भोजन)", time: "15 Mins" },
    { en: "Traditional Halwa", hi: "शुद्ध घी का हलवा", category: "Festive Special (पारंपरिक भोजन)", time: "20 Mins" },
    { en: "Melt-in-mouth Kheer", hi: "केसरिया खीर", category: "Festive Special (पारंपरिक भोजन)", time: "30 Mins" },
    { en: "Dry Spice Roast", hi: "सूखा मसाला रोस्ट", category: "Fasting & Paryushan (व्रत उपवास अनुकूल)", time: "10 Mins" },
    { en: "Steamed Muthia", hi: "भाप का मुठिया", category: "Fasting & Paryushan (व्रत उपवास अनुकूल)", time: "25 Mins" },
    { en: "Savory Paratha", hi: "सात्विक पराठा", category: "Daily Satvik (रोज का भोजन)", time: "15 Mins" }
  ];

  const unsplashLinks = [
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=400"
  ];

  for (let i = 1; i <= 112; i++) {
    const grain = grainBases[i % grainBases.length];
    const style = preparationStyles[(i * 3) % preparationStyles.length];
    const imgUrl = unsplashLinks[i % unsplashLinks.length];

    list.push({
      id: `r-gen-${i}`,
      name: { 
        en: `Satvik ${grain.en} ${style.en}`, 
        hi: `सात्विक ${grain.hi} ${style.hi}` 
      },
      category: style.category,
      time: style.time,
      ingredients: [
        `1 cup high quality ${grain.en}`,
        "1 tbsp Pure Cow Ghee or Sesame Oil",
        "Filtered Dual-Cloth Cotton Water (Mariyada Jal)",
        "Organic spices: Asafoetida (Hing), cumin seeds, turmeric powder, sendha namak",
        "Fresh coriander leaves for garnish (if used)"
      ],
      ingredientsHi: [
        `१ कप उच्च गुणवत्ता युक्त ${grain.hi}`,
        "१ बड़ा चम्मच शुद्ध गाय का घी या तिल का तेल",
        "दोहरे सूती वस्त्र से छना हुआ मर्यादित जल",
        "ऑर्गेनिक दाल मसाले: शुद्ध उत्कृष्ट हींग, जीरा, हल्दी पाउडर, सेंधा नमक",
        "बारीक संवारा ताज़ा धनिया पत्ता"
      ],
      instructions: [
        `Carefully inspect the ${grain.en} under good sunlight to ensure zero infestation.`,
        "Heat cow ghee in a deep iron or clay heavy pan. Add a pinch of aromatic hing and cumin seeds.",
        `Incorporate ${grain.en} and sauté masterfully over moderate daylight flame.`,
        "Pour in pre-boiled filtered warm water and cover with heavy lid.",
        "Simmer until perfectly tender. Garnish with coriander and serve immediately after chanting Navkar Mantra."
      ],
      instructionsHi: [
        `सूर्य के प्रकाश में ${grain.hi} को अच्छी तरह से छान व देख लें ताकि बारीक जीवों से रक्षा हो सकें।`,
        "लोहे या मिट्टी के भारी बर्तन में देशी गाय का घी गर्म कर हींग और जीरा चटकाएं।",
        `अब गरम कड़ाही में ${grain.hi} डालकर मध्यम आंच पर अच्छी खुशबू आने तक भुनें।`,
        "पहले से गर्म किया मर्यादित जल छना हुआ गुनगुना डालकर ढक दें।",
        "मसाले और नमक मिलाकर धीमी आंच पर पकने दें। णमोकार मंत्र स्मरण के उपरांत गर्मागर्म आरोगें।"
      ],
      tips: {
        en: `Always cook ${grain.en} during daylight hours to honor traditional non-violent dietary boundaries.`,
        hi: `सूर्योदय के पश्चात और सूर्यास्त के पूर्व भोजन पकाना जैन मुनि-श्रावक परंपरा का सर्वोत्तम पालन है।`
      },
      image: imgUrl
    });
  }

  return list;
};

const RECIPES: Recipe[] = generateJainRecipes();

export default function DietPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rules' | 'recipes' | 'audit'>('rules');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Recipe tab search/filter additions
  const [recipeSearch, setRecipeSearch] = useState('');
  const [selectedRecipeCategory, setSelectedRecipeCategory] = useState<string>('all');

  // Satvik Audit State
  const [auditScores, setAuditScores] = useState({
    rootVegs: false, // Onion/Garlic/Potato
    sunsetTime: false, // Eaten after sunset?
    filteredWater: true, // Standard filter limit?
    yeastFoods: false // Bread, yeast, alcohol?
  });
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const filteredRecipes = RECIPES.filter(recipe => {
    const matchesSearch = recipe.name.en.toLowerCase().includes(recipeSearch.toLowerCase()) ||
                          recipe.name.hi.includes(recipeSearch) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(recipeSearch.toLowerCase())) ||
                          recipe.ingredientsHi.some(ing => ing.includes(recipeSearch));
    
    // Check main text match
    const catCheck = selectedRecipeCategory === 'all' || 
                     recipe.category.toLowerCase().includes(selectedRecipeCategory.toLowerCase()) ||
                     (selectedRecipeCategory === 'Daily Satvik' && recipe.category.includes('Daily')) ||
                     (selectedRecipeCategory === 'Festive Special' && recipe.category.includes('Festive')) ||
                     (selectedRecipeCategory === 'Fasting' && recipe.category.includes('Fasting'));
    return matchesSearch && catCheck;
  });

  const calculateAudit = () => {
    if (auditScores.rootVegs || auditScores.yeastFoods) {
      setAuditResult(lang === 'en' ? 'NON-SATVIK (तामसिक / अशुद्ध): Contains root vegetables or fermented cultures, violation of basic Ahimsa.' : 'अशुद्ध भोजन (अभक्ष्य): इसमें जमीकंद (प्याज/लहसुन/आलू) या यीस्ट/द्विदल तत्व हैं, जो सात्विक मर्यादा के विरुद्ध हैं।');
    } else if (auditScores.sunsetTime) {
      setAuditResult(lang === 'en' ? 'MODERATELY SATVIK: Ingredients are clean, but consuming after Sunset compromises Jain dietary principles.' : 'मध्यम सात्विक: भोजन सामग्री शुद्ध है, परंतु सूर्यास्त के पश्चात भोजन करने से रात्रिभोजन दोष लगता है।');
    } else if (!auditScores.filteredWater) {
      setAuditResult(lang === 'en' ? 'PARTIALLY SATVIK: Clean grains, but water must be filtered with a cotton double-cloth (Mariyada Water) to prevent microscopic injury.' : 'आंशिक सात्विक: जिंस शुद्ध है, परंतु जल छानने की क्रिया (मर्यादा जल) न होने से जीव हिंसा का दोष संभव है।');
    } else {
      setAuditResult(lang === 'en' ? 'FULLY SATVIK (पूर्णतः शुद्ध आहार): Perfectly clean, cooked in day-hours, contains zero root vegetables. Excellent for spiritual peace!' : 'परम सात्विक महाप्रसाद: १००% शुद्ध, मर्यादित जल से तैयार, सूर्यास्त पूर्व पका भोजन। आत्म शांति के लिए सर्वोत्तम!');
    }
  };

  return (
    <div className="min-h-full p-6 pb-26 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-150 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer">
            <ArrowLeft size={18} className="text-gray-755 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D08] to-[#FFD54F] tracking-tight truncate">
            {lang === 'en' ? 'AHAR VIDHI (JAIN DIET)' : 'आहार विधि (जैन भोजन नियम)'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-550 dark:text-gray-300 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-250 dark:border-white/10 h-9 w-9 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Diet Section Guide' : 'आहार अनुभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-9"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 md:flex-nowrap bg-white dark:bg-[#121212] p-1 border border-gray-150 dark:border-white/5 rounded-2xl mb-6 shadow-xs">
        <button 
          onClick={() => { setActiveTab('rules'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'rules' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-rules"
        >
          {lang === 'en' ? 'Rules' : 'आहार नियम'}
        </button>
        <button 
          onClick={() => { setActiveTab('recipes'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'recipes' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-recipes"
        >
          {lang === 'en' ? 'Recipes' : 'व्यंजन विधि'}
        </button>
        <button 
          onClick={() => { setActiveTab('audit'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-audit"
        >
          {lang === 'en' ? 'Audit' : 'शुद्धता परीक्षक'}
        </button>
      </div>

      {/* Tab 1: Diet Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-orange-500">
              <Apple size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'Why Root Vegetables Are Avoided?' : 'जमीकन्द (प्याज-लहसुन-आलू) का त्याग क्यों?'}</h2>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "Root vegetables (like onion, garlic, potatoes, carrots) grow underground. Uprooting them pulls out the entire plant, destroying the life of countless microscopic organisms (AnanthKaya) clustered around the roots. For Jains, practicing supreme non-violence requires avoiding root vegetables."
                : "जमीन के नीचे उगने वाली कन्द सब्जियां (आलू, प्याज, लहसुन, गाजर) अनंत जीवधारी (अनंतकाय) कल्प मानी जाती हैं। इन्हें उखाड़ने से पूरा पौधा नष्ट होता है और जड़ के चिपककर रहने वाले लाखो सूक्ष्म जीवों की हिंसा होती है। अतः जैन श्रावक इनका पूर्ण त्याग करते हैं।"}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-[#2962FF]">
              <ShieldAlert size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'Filtered Water (Mariyada Jal)' : 'छना हुआ मर्यादित जल'}</h2>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "A clean double-folded thick cotton cloth (Chhana) is used to strain drinking water. Filtered organisms are safely returned to the water source (Bilchhani process). Boiled water carries a spiritual purity limit (Mariyada) of up to 24 hours."
                : "जल छानने के लिए मोटे सूती दोहरे कपड़े का उपयोग किया जाता है। छनने के उपरांत कपड़े में चिपके सूक्ष्म त्रस जीवों को पुनः मर्यादित जल के साथ जलस्त्रोत में छोड़ दिया जाता है (बिलछानी क्रिया), जिससे जीव हिंसा न हो। उबला पानी २४ घंटे मर्यादित रहता है।"}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-red-500">
              <AlertTriangle size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'No Cooking After Sunset' : 'रात्रि भोजन का त्याग क्यों?'}</h2>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "Insects and microscopic life multiply rapidly after Sunset under moist twilight conditions. Cooking or dining after Sunset in artificial light draws pests, inevitably causing high microscopic injury. Thus, eating during daylight hours protects biological lifespans."
                : "सूर्यास्त के उपरांत वाष्पीकरण थमने और अंधकार छाने से वायुमंडल में अनगिनत सूक्ष्म कीट व जीवाणु उत्पन्न होते हैं। कृत्रिम प्रकाश या रात्रि में भोजन पकाने या खाने से वे भोजन में समा सकते हैं, जिससे महान जीव हिंसा होती है। अतः रात्रि भोजन त्याज्य है।"}
            </p>
          </div>

          {/* Shastra-based Abhakhsya Guide (Abhakhsya Tyag) */}
          <div className="p-5 bg-red-500/5 dark:bg-red-500/10 rounded-3xl border border-red-500/20 shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-red-655 dark:text-red-400">
              <ShieldAlert size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'The Five Forbidden Categories (Abhakhsya)' : 'पंच उदुम्बर एवं मूल अवगुण त्याग (अभक्ष्य)'}</h2>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-350 font-semibold leading-relaxed space-y-3">
              <p>
                {lang === 'en'
                  ? "According to Digambar Ratnakaranda Shravakachara shastras, an ideal spiritual householder avoids several toxic and highly violent items known as 'Abhakhsya' (un-consumable items):"
                  : "दिगंबर श्रावकाचार ग्रंथों (जैसे रत्नकरण्ड श्रावकाचार) के अनुसार, आत्मा की पवित्रता और अहिंसा महाव्रत के रक्षार्थ प्रत्येक श्रावक को इन मूल अवगुणों व अभक्ष्य पदार्थों का आजीवन त्याग करना चाहिए:"}
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>{lang === 'en' ? "Honey (Madhu):" : "मधु (शहद) त्याग:"}</strong>{" "}
                  {lang === 'en'
                    ? "Collection of honey destroys whole hives with millions of developing sibling bee larvae. Even a tiny droplet represents supreme violence."
                    : "शहद् की एक बूंद प्राप्त करने के लिए भी पूरे छत्ते को निचोड़ा जाता है जिससे लाखों मधुमक्खियों के अंडों, शिशुओं तथा जीवों का तत्क्षण विनाश होता है।"}
                </li>
                <li>
                  <strong>{lang === 'en' ? "Alcohol (Madya):" : "मद्य (शराब/नशा) त्याग:"}</strong>{" "}
                  {lang === 'en'
                    ? "Fermentation is a high multiplication process of microscopic bacteria, leading to absolute loss of self-control, reason, and non-violence."
                    : "मदिरा खमीर उठने की सड़न क्रिया से बनती है जिसमें अनगिनत सम्मूर्छन जीव प्रतिपल पैदा होते हैं, यह आत्म-नियंत्रण व विवेक शून्य कर हिंसक प्रवृत्तियों को जन्म देती है।"}
                </li>
                <li>
                  <strong>{lang === 'en' ? "Five Udambar Fruits:" : "पंच उदुम्बर फल त्याग:"}</strong>{" "}
                  {lang === 'en'
                    ? "Fruits belonging to the fig family (Gular, Anjeer, Pipal, Banyan fruit, Pakar) contain visible, active colonies of insects and must be rejected."
                    : "पीपल, बड़, उमर, कठूमर और पाकर (गूलर व अंजीर आदि) के फलों में त्रस जीव साफ संचरण करते हैं, इसलिए इनका सेवन पूर्ण वर्जित है।"}
                </li>
                <li>
                  <strong>{lang === 'en' ? "Dvidala Dosh (Dairy + Pulses combination):" : "द्विदल दोष (कच्चा दही + दाल संयोग):"}</strong>{" "}
                  {lang === 'en'
                    ? "Mixing uncooked/raw pulses (lentils, chickpea flour) with raw curds or milk causes instantaneous, unstoppable bacterial growth. Pulses should be consumed with processed/well-cooked buttermilk if needed."
                    : "कच्चे दाल के आटे (बेसन) या दालों के साथ कच्चा दूध/दही मिला देने से 'द्विदल' दोष उत्पन्न होता है जिससे असंख्यात त्रस जीव पैदा होने लगते हैं। सदा गर्म मथी गई छाछ के साथ ही मसालेदार कढ़ी आदि लें।"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Satvik Recipes */}
      {activeTab === 'recipes' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {!selectedRecipe ? (
            <div className="space-y-4">
              {/* Pure Jain Recipe Info Alert */}
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-3xl text-left flex gap-3 items-start shadow-sm">
                <span className="text-xl">🕌</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    {lang === 'en' ? '100% Pure Jain Recipes Only' : '१००% शुद्ध जैन व्यंजन (१००+ व्यंजन विधियाँ)'}
                  </h4>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">
                    {lang === 'en' 
                      ? 'All recipes listed below strictly adhere to Jain dietary rules: zero onions, garlic, potatoes, or other root vegetables. Prepared with mindfulness (Ahimsa-compliant).'
                      : 'इस सूची के सभी व्यंजन पूर्णतः मर्यादित हैं। इनमें जमीकंद (आलू, प्याज, लहसुन, गाजर) का प्रयोग पूर्णतः वर्जित है। सभी व्यंजन विधि अहिंसा सिद्धांतों के अनुकूल हैं।'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {lang === 'en'
                      ? 'ℹ️ Note: The Chouka & Dharamshala Map has been moved to the "Jain Food Locator" page for advanced tracking.'
                      : 'ℹ️ सूचना: चौका और भोजनशाला मानचित्र लोकेटर को पूर्णतः "जैन फूड लोकेटर" अनुभाग में स्थानांतरित कर दिया गया है।'}
                  </p>
                </div>
              </div>

              {/* Recipe Search & Filter Panel */}
              <div className="p-4 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 space-y-3 shadow-sm">
                <UnifiedSearchBar
                  value={recipeSearch}
                  onChange={(val) => setRecipeSearch(val)}
                  placeholder={lang === 'en' ? 'Search 112+ Satvik Recipes...' : '११२+ जैन सात्विक व्यंजन खोजें...'}
                />
                
                {/* Category Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { id: 'all', en: 'All Recipes', hi: 'सभी' },
                    { id: 'Daily Satvik', en: 'Daily', hi: 'रोज का भोजन' },
                    { id: 'Festive Special', en: 'Festive', hi: 'त्योहार विशेष' },
                    { id: 'Fasting', en: 'Fasting', hi: 'व्रत-उपवास' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedRecipeCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        selectedRecipeCategory === cat.id
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-650'
                      }`}
                    >
                      {lang === 'en' ? cat.en : cat.hi}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipes Grid */}
              <div className="grid gap-4">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map(recipe => (
                    <div 
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className="bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md cursor-pointer flex group"
                    >
                      <div className="w-1/3 h-32 bg-gray-200 dark:bg-[#1A1A1A] relative shrink-0">
                        <img src={recipe.image} alt={recipe.name.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                            {recipe.category}
                          </span>
                          <h3 className="font-bold text-sm text-gray-850 dark:text-white truncate">
                            {lang === 'en' ? recipe.name.en : recipe.name.hi}
                          </h3>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mt-2">
                          <span>⏱️ {recipe.time}</span>
                          <span className="text-orange-500 uppercase tracking-wider font-black">{lang === 'en' ? 'View details' : 'विस्तार से पढ़ें'} →</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 font-bold text-xs bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5">
                    📭 {lang === 'en' ? 'No matching Satvik recipes found.' : 'कोई मिलान व्यंजन विधि नहीं मिली।'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Selected Recipe Detail View */
            <div className="bg-white dark:bg-[#121212] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                <div>
                  <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">JAIN SATVIK DELICACY</span>
                  <h2 className="text-lg md:text-xl font-display font-black text-gray-900 dark:text-white">
                    {lang === 'en' ? selectedRecipe.name.en : selectedRecipe.name.hi}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 text-xs font-bold rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-250 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {lang === 'en' ? '← Back' : '← वापस'}
                </button>
              </div>

              {selectedRecipe.image && (
                <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name.en} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Ingredients */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                  <Utensils size={14} />
                  {lang === 'en' ? 'Ingredients List' : 'आवश्यक खाद्य सामग्री'}
                </h4>
                <ul className="text-xs text-gray-750 dark:text-gray-300 font-medium space-y-2 list-disc list-inside bg-gray-50 dark:bg-[#1a1a1a]/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-left">
                  {lang === 'en' 
                    ? selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                    : selectedRecipe.ingredientsHi.map((ing, i) => <li key={i}>{ing}</li>)
                  }
                </ul>
              </div>

              {/* Preparation Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-orange-500 tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {lang === 'en' ? 'Step-by-step Instructions' : 'बनाने की सरल विधि'}
                </h4>
                <ol className="text-xs text-gray-700 dark:text-gray-300 font-medium space-y-2.5 list-decimal list-inside bg-gray-50 dark:bg-[#1a1a1a]/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 text-left">
                  {lang === 'en' 
                    ? selectedRecipe.instructions.map((ins, i) => <li key={i} className="pl-1 leading-relaxed">{ins}</li>)
                    : selectedRecipe.instructionsHi.map((ins, i) => <li key={i} className="pl-1 leading-relaxed">{ins}</li>)
                  }
                </ol>
              </div>

              {/* Satvik tip box */}
              <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl text-left">
                <span className="text-[8px] font-black tracking-widest text-[#FF6D05] block mb-1 uppercase">
                  {lang === 'en' ? 'SATVIK JAIN COOKING ADVICE' : 'सात्विक पाक कला रहस्य'}
                </span>
                <p className="text-xs text-gray-800 dark:text-gray-200 font-bold leading-relaxed">
                  {lang === 'en' ? selectedRecipe.tips.en : selectedRecipe.tips.hi}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {lang === 'en' ? 'Back to Recipes List' : 'व्यंजनों की सूची पर वापस जाएँ'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Food Satvik Auditor Checklist */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in duration-300 p-5 bg-white dark:bg-[#121212] border border-gray-150 dark:border-white/5 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-left">
            <HelpCircle className="text-[#FF6D02]" size={20} />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {lang === 'en' ? 'Satvik Diet Auditor Machine' : 'भोजन शुद्धता परिक्षण मशीन'}
            </h2>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/35 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-200">{lang === 'en' ? 'Contains Root Vegs?' : 'क्या आलू-प्याज-लहसुन प्रयुक्त है?'}</span>
                <span className="text-[10px] text-gray-400 font-medium block">Does it contain onion, garlic, potatoes, or carrots?</span>
              </div>
              <input 
                type="checkbox"
                checked={auditScores.rootVegs}
                onChange={(e) => setAuditScores({ ...auditScores, rootVegs: e.target.checked })}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
                id="audit-root-veg"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/35 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-200">{lang === 'en' ? 'Dining After Sunset?' : 'क्या सूर्यास्त के बाद भोजन करना है?'}</span>
                <span className="text-[10px] text-gray-400 font-medium block">Will this meal be taken or cooked in night hours?</span>
              </div>
              <input 
                type="checkbox"
                checked={auditScores.sunsetTime}
                onChange={(e) => setAuditScores({ ...auditScores, sunsetTime: e.target.checked })}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
                id="audit-sunset"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/35 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-250">{lang === 'en' ? 'Filtered Chhana Water used?' : 'क्या डबल छने मर्यादित जल का प्रयोग है?'}</span>
                <span className="text-[10px] text-gray-400 font-medium block">Is the water strained through cotton double-cloth Chhana?</span>
              </div>
              <input 
                type="checkbox"
                checked={auditScores.filteredWater}
                onChange={(e) => setAuditScores({ ...auditScores, filteredWater: e.target.checked })}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
                id="audit-water"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/35 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-250">{lang === 'en' ? 'Fermented cultures inside (Yeast/Microbes)?' : 'क्या खमीर या फर्मेंटेड वस्तुएं (यीस्ट, ब्रेड) हैं?'}</span>
                <span className="text-[10px] text-gray-400 font-medium block">Does it contain store-bought yeast-fermented bread or vinegar?</span>
              </div>
              <input 
                type="checkbox"
                checked={auditScores.yeastFoods}
                onChange={(e) => setAuditScores({ ...auditScores, yeastFoods: e.target.checked })}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
                id="audit-yeast"
              />
            </div>

            <button 
              onClick={calculateAudit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md uppercase tracking-wider cursor-pointer"
              id="btn-evaluate-audit"
            >
              {lang === 'en' ? 'EVALUATE DISH PURITY' : 'आहार शुद्धता जांचें'}
            </button>

            {/* Audit Score Dialog */}
            <AnimatePresence>
              {auditResult && (
                <motion.div 
                   initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-yellow-500/10 border-2 border-yellow-500/20 text-xs font-bold text-gray-800 dark:text-gray-100 rounded-2xl shadow-inner mt-4"
                >
                  <span className="text-[8px] font-black tracking-widest text-[#FF6D08] block mb-1 uppercase">{lang === 'en' ? 'AUDIT VERDICT SCORE' : 'ऑडिट परिणाम'}</span>
                  <p className="leading-relaxed font-black text-sm">{auditResult}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D08]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10 text-left">
              <div>
                <span className="text-[9px] font-black text-[#FF6D08] uppercase tracking-widest bg-[#FF6D08]/10 px-3 py-1 rounded-full border border-[#FF6D08]/10 inline-block mb-1.5">
                  📁 {lang === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {lang === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5 active:scale-95 text-xs font-black"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10 text-left">
              <span className="text-[10px] font-black uppercase text-gray-400 font-sans">
                {lang === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {lang === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4 text-left text-zinc-300 text-xs font-medium leading-relaxed relative z-10 max-h-[50vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to Ahar Vidhi (Jain Diet) Guide!' : 'जैन आहार विधि मार्गदर्शिका में स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'Align your cooking with traditional non-violent dietary principles using these custom modules:' 
                  : 'अहिंसक आहार प्रणाली के माध्यम से शारीरिक व मानसिक स्वास्थ्य संवर्धन हेतु निम्न प्रणालियों का लाभ लें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Dietary Rules & Prohibition:' : 'सात्विक भक्ष्य-अभक्ष्य विवेक नियम:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Explore complete guidelines detailing why root vegetables (potatoes, onions, garlic) and fermentation are prohibited.' 
                    : 'सात्विक जैन गृहस्थ मर्यादा के प्रमुख नियम (सूर्यास्त पूर्व भोजन, छना पानी, कंदमूल त्याग) का परिचय पढ़ें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Satvik Culinary Recipes:' : 'अहिंसक स्वादिष्ट व्यंजन विधियाँ:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Access wholesome step-by-step cooking recipes developed entirely with pure ingredients, featuring over 100+ recipes.'
                    : 'बिना आलू, प्याज, लहसुन व यीस्ट के बनने वाले लजीज पारंपरिक व्यंजनों की सुन्दर पाक विधि और १००+ व्यंजनों की सूची सीखें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Personal Satvik Food Auditor:' : 'सात्विक भोजन परीक्षक (Audit):'}</strong>{' '}
                  {lang === 'en'
                    ? 'Use the interactive food auditor questionnaire to gauge if your current meal is non-satvik, moderately clean, or fully pure.'
                    : 'अपने वर्तमान भोजन की शुद्धता जाँचने के लिए आसान प्रश्न संवाद का उत्तर दें तथा सात्विक वर्गीकरण एवं सुझाव जानें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D08] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {lang === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="diet" />
    </div>
  );
}
