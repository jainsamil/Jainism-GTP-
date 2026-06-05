import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ShieldAlert, CheckCircle2, Apple, Utensils, HelpCircle, Heart, Search, ListFilter, AlertTriangle, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';

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

const RECIPES: Recipe[] = [
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
      "ढक्कन बंद कर ३-४ सीटी आने तक पकाएं ताकि खिचड़ी एकदम मुलायम दलिया समान सुपाच्य हो।",
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
      "धनिया, मिर्च पाउडर, हल्दी, नमक और पर्याप्त अमचूर पाउडर छिड़कें।",
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
      "भीगी हुई मूंग दाल को हरी मिर्च और अदरक के साथ ग्राइंडर में दरदरा पीस लें।",
      "बैटर को हाथ से ३ मिनट तक अच्छी तरह फेंटें ताकि वह हल्का और हवादार हो जाए।",
      "स्वादानुसार नमक और हल्दी मिलाएं।",
      "गर्म तवे पर एक चमचा बैटर डालकर गोलाई में फैलाएं।",
      "किनारों पर शुद्ध घी लगाएं और सुनहरा व कुरकुरा होने तक दोनों तरफ से अच्छी तरह सेकें। ताजी पुदीना-धनिया चटनी संग परोसें।"
    ],
    tips: {
      en: "This is an instant protein-rich breakfast option that contains zero fermentations or unhealthy root products.",
      hi: "बिना खमीर उठाए बनने वाला यह एक सुपाच्य प्रोटीन युक्त पौष्टिक नाश्ता है, जिसमें किसी भी कंद का अंश नहीं होता।"
    },
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r6",
    name: { en: "Traditional Dal Baati (Panchmel Style)", hi: "पारंपरिक दाल बाती (सात्विक पंचमेल)" },
    category: "Festive Special (पारंपरिक भोजन)",
    time: "45 Mins",
    ingredients: [
      "2 cups Coarse whole wheat flour (Atta)",
      "1/2 cup Semolina (Suji)",
      "1/4 cup Melted cow ghee (for shortening)",
      "1 cup Mixed lentils (Moong, Toor, Chana)",
      "Spices: Fennel seeds, carom seeds, ginger, hing, salt, lemon juice"
    ],
    ingredientsHi: [
      "२ कप दरदरा गेहूं का आटा",
      "१/२ कप महीन सूजी",
      "१/४ कप गाय का घी (मोयन हेतु)",
      "१ कप पंचमेल मिक्स दाल",
      "मसाले: सौंफ, अजवाइन, अदरक, शुद्ध हींग, नमक, नींबू का रस"
    ],
    instructions: [
      "Mix wheat flour, semolina, ghee, carom seeds, and salt. Knead tightly using warm filtered water.",
      "Shape into round dumplings (Baati). Bake in a clay tandoor or oven until cracks appear on the crust.",
      "Boil the mixed lentils. Temper with ghee, cumin seeds, grated ginger, and a strong pinch of hing.",
      "Bath the roasted hot baatis in melted pure ghee until soft.",
      "Serve the rich ghee baati with thick hot Panchmel Dal."
    ],
    instructionsHi: [
      "गेहूं का आटा, सूजी, मोयन का घी, अजवाइन और नमक को मिला लें। गुनगुने मर्यादित जल की सहायता से कड़ा आटा गूंथ लें।",
      "मध्यम आकार के गोल गोले (बाती) बनाएं। बाटी कंडे की आंच या आवन पर दरारें आने तक अच्छी तरह सेकें।",
      "पंचमेल अरहर-मूंग दाल को उबालें। घी में जीरा, बारीक घिसा अदरक और हींग तड़काकर दाल को छौंकें।",
      "सिकी बाटी को दबाकर पिघले गरम घी में डुबोएं।",
      "गर्मागर्म घी लगी बाटी को गाढ़ी सात्विक दाल संग परोसें।"
    ],
    tips: {
      en: "Always crush the baked wheat dumplings slightly before dipping in ghee; this helps absorb ghee deeply into core layers.",
      hi: "सिकी हुई बाटी को हमेशा बीच से हल्का फोड़कर घी में डुबोना चाहिए ताकि घी अंदरूनी परत तक भली-भांति समा जाए।"
    },
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r7",
    name: { en: "Aromatic Almond Cardamom Halwa", hi: "शाही बादाम इलायची शीरा" },
    category: "Festive Special (पारंपरिक भोजन)",
    time: "20 Mins",
    ingredients: [
      "1 cup Sweet almonds (soaked, skins removed & ground)",
      "1/2 cup Thick cream milk (or almond milk if dairy-free)",
      "1/2 cup Cow's pure ghee",
      "2/3 cup Organic cane sugar or Mishri powder",
      "Spices: Ground green cardamom seeds, saffron strings"
    ],
    ingredientsHi: [
      "१ कप मीठी बादाम (भिगोकर, छिलका उतरे और दरदरे पिसे हुए)",
      "१/२ कप मलाईदार दूध",
      "१/२ कप शुद्ध देसी घी",
      "२/३ कप पिसी मिश्री या गन्ने की खांड",
      "मसाले: पिसी हरी इलायची, केसर के धागे"
    ],
    instructions: [
      "Soak almonds in warm water, peel off skin and grind into rough thick paste.",
      "Heat pure ghee in a thick-bottom pan. Fry the almond paste on very low heat.",
      "Stir constantly for 10-12 minutes until it turns pale pink and releases a warm toasted aroma.",
      "Pour milk and organic sugar. Simmer until the ghee separates from side borders.",
      "Stir cardamom powder and saffron. Serve warm during daytime festive treats."
    ],
    instructionsHi: [
      "बादाम को गुनगुने मर्यादित पानी में भिगोकर छिलका उतारें और दरदरा पेस्ट बना लें।",
      "कड़ाही में शुद्ध देसी घी गर्म करें। बादाम पेस्ट को एकदम धीमी लौ पर भूनना शुरू करें।",
      "लगातार १०-१२ मिनट चलाएं जब तक कि बादाम का पेस्ट हल्का गुलाबी न हो जाए और घी न छोड़ दे।",
      "दूध और मिश्री पाउडर मिलाएं। मध्यम आंच पर तब तक पकाएं जब तक सारा शीरा कड़ाही के किनारों को छोड़ने न लगे।",
      "इलायची पाउडर और केसर छिड़कें। सात्विक प्रसाद तैयार है।"
    ],
    tips: {
      en: "Roasting the almond paste on low flame is the secret to preventing bitterness and obtaining a uniform velvety grain.",
      hi: "बादाम के शीरे को हमेशा धीमी-मध्यम आंच पर ही सेकें, जिससे वह जले नहीं और उसका दानेदार रेशमी स्वाद खिलकर आये।"
    },
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "r8",
    name: { en: "Refreshing Pearl Guava Chutney", hi: "मर्यादित अमरुद की चटनी" },
    category: "Daily Satvik (रोज का भोजन)",
    time: "10 Mins",
    ingredients: [
      "2 Fresh ripe white guavas (seeds scrapped check carefully)",
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

export default function DietPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rules' | 'recipes' | 'audit' | 'chouka'>('rules');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Satvik Audit State
  const [auditScores, setAuditScores] = useState({
    rootVegs: false, // Onion/Garlic/Potato
    sunsetTime: false, // Eaten after sunset?
    filteredWater: true, // Standard filter limit?
    yeastFoods: false // Bread, yeast, alcohol?
  });
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Chouka Navigator State
  const [choukaSearchStr, setChoukaSearchStr] = useState('');
  const [choukaDistanceFilter, setChoukaDistanceFilter] = useState<number>(10); // max default km
  const [selectedChoukaType, setSelectedChoukaType] = useState<'all' | 'family' | 'dharamshala' | 'restaurant'>('all');

  const choukaData = [
    {
      id: "chk-1",
      name: { en: "Kothari Jain Kutumb Home Rasoi", hi: "कोठारी जैन परिवार गृह चौका" },
      type: "family" as const,
      address: { en: "12, Near Digamabar Jain Mandir, Sector 3, Pune", hi: "१२, दिगंबर जैन मंदिर के पास, सेक्टर ३, पुणे" },
      distance: 1.8,
      timing: { en: "Ahar (Lunch): 11:30 AM - 1:00 PM | Sunset Dinner: 5:00 PM - 6:00 PM", hi: "दुपहर आहार: ११:३० से १:०० | सूर्यास्त पूर्व भोजन: ५:०० से ६:००" },
      contact: "+91 98451 22312",
      verifiedBy: "Pune Digambar Jain Samaj Committee",
      facilities: {
        sunsetRules: true,
        waterFiltration: true,
        uncontaminatedUtensils: true,
        zeroRootVegs: true
      },
      desc: { en: "Strict home kitchen prepared exclusively by temple-going Shravaks. Cleanliness and absolute purity guaranteed.", hi: "मंदिर जाने वाले शुद्ध सात्विक श्रावकों द्वारा तैयार घर की रसोई। पूर्ण मर्यादा का पालन किया जाता है।" }
    },
    {
      id: "chk-2",
      name: { en: "Shri Bahubali Bhojana Sala & Dharamshala", hi: "श्री बाहुबली भोजनशाला एवं धर्मशाला" },
      type: "dharamshala" as const,
      address: { en: "Jain Tirth Kshetra Complex, Bypass Highway, Madurai", hi: "जैन तीर्थ क्षेत्र परिसर, बाईपास हाईवे, मदुरै" },
      distance: 3.2,
      timing: { en: "Lunch: 11:00 AM - 1:30 PM | Dinner: 5:15 PM - Sunset", hi: "दुपहर भोजन: ११:०० से १:३० | शाम भोजन: ५:१५ से सूर्यास्त पूर्व" },
      contact: "+91 88701 54390",
      verifiedBy: "South India Jain Association Trustee",
      facilities: {
        sunsetRules: true,
        waterFiltration: true,
        uncontaminatedUtensils: true,
        zeroRootVegs: true
      },
      desc: { en: "Traditional dharamshala kitchen using dual thick cotton filtration (Chhana Jal) and wood-fired organic stoves.", hi: "दोहरे मोटे सूती वस्त्र से छाने जल और लकड़ी के चूल्हे से तैयार प्राचीन शैली की शुद्ध धर्मशाला भोजनशाला।" }
    },
    {
      id: "chk-3",
      name: { en: "Vardhman Shudh Marwari Rasoi", hi: "वर्धमान शुद्ध सात्विक मारवाड़ी रसोई" },
      type: "restaurant" as const,
      address: { en: "Srinagar Hill Road, Opp Railway Station, Guwahati", hi: "श्रीनगर हिल रोड, रेलवे स्टेशन के सामने, गुवाहाटी" },
      distance: 4.5,
      timing: { en: "Lunch: 11:30 AM - 2:00 PM | Sunset Dinner: 4:30 PM - 5:45 PM", hi: "दुपहर का भोजन: ११:३० से २:०० | संध्या भोजन: ४:३० से ५:४५" },
      contact: "+91 70023 99871",
      verifiedBy: "Guwahati Shravak Parishad",
      facilities: {
        sunsetRules: true,
        waterFiltration: true,
        uncontaminatedUtensils: true,
        zeroRootVegs: true
      },
      desc: { en: "Certified hotel segment with completely isolated Jain counter, serving no onion/garlic/potatoes under strict CCTV supervision.", hi: "सत्यापित जैन रसोई काउंटर जहाँ प्याज-लहसुन-आलू सर्वथा वर्जित है। खाना बनाने का कमरा बिल्कुल पृथक है।" }
    },
    {
      id: "chk-4",
      name: { en: "Singhal Kutumb Satvik Home Catering", hi: "सिंघल कुटुंब सात्विक होम टिफिन" },
      type: "family" as const,
      address: { en: "A-402, Royal Residency, Near Metro Station, Bangalore", hi: "ए-४०२, रॉयल रेजीडेंसी, मेट्रो स्टेशन के पास, बेंगलुरु" },
      distance: 8.2,
      timing: { en: "Day Hours Delivery only. Last dispatch at 4:30 PM.", hi: "केवल दिन के समय होम डिलीवरी। अंतिम डिस्पैच ४:३० बजे।" },
      contact: "+91 91108 55432",
      verifiedBy: "Sakal Jain Sangh East Zone",
      facilities: {
        sunsetRules: true,
        waterFiltration: true,
        uncontaminatedUtensils: true,
        zeroRootVegs: true
      },
      desc: { en: "Home cooked tiffin service for traveling single professionals and elders. Uses double-boiled मर्यादित water.", hi: "यात्री युवाओं और बुजुर्गों के लिए घर से चलने वाली टिफिन सेवा। इसमें मर्यादित गुनगुने जल का प्रयोग होता है।" }
    },
    {
      id: "chk-5",
      name: { en: "Shri Adinath Swadhyay Mandir Community Kitchen", hi: "श्री आदिनाथ स्वाध्याय मंदिर सामुदायिक रसोई" },
      type: "dharamshala" as const,
      address: { en: "Jain Colony Lane 2, Near Ram Mandir Cross Road, Salem", hi: "जैन कॉलोनी लेन २, राम मंदिर क्रॉस रोड के पास, सेलम" },
      distance: 2.1,
      timing: { en: "Only Noon Prasad: 11:30 AM - 12:45 PM", hi: "केवल दुपहर साधु संग प्रसादी: ११:३० से १२:४५" },
      contact: "+91 42724 49200",
      verifiedBy: "Salem Shaktivardan Trust",
      facilities: {
        sunsetRules: true,
        waterFiltration: true,
        uncontaminatedUtensils: true,
        zeroRootVegs: true
      },
      desc: { en: "Run by local vows followers. Best for visiting pilgrims seeking the highest level of nutritional hygiene and non-violence.", hi: "स्थानीय श्रावकों द्वारा सेवाभाव से संचालित। यात्रियों के लिए परम अहिंसक शुद्धता और सादगीपूर्ण भोजन की व्यवस्था।" }
    }
  ];

  const filteredChoukas = choukaData.filter(ch => {
    const matchesSearch = ch.name.en.toLowerCase().includes(choukaSearchStr.toLowerCase()) || 
                          ch.name.hi.includes(choukaSearchStr) ||
                          ch.address.en.toLowerCase().includes(choukaSearchStr.toLowerCase()) ||
                          ch.address.hi.includes(choukaSearchStr);
    const matchesType = selectedChoukaType === 'all' || ch.type === selectedChoukaType;
    const matchesDist = ch.distance <= choukaDistanceFilter;
    return matchesSearch && matchesType && matchesDist;
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
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* FIXED TOP RIGHT TRANSLATOR WIDGET */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 px-4.5 py-2.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-lg rounded-full flex items-center justify-center gap-2 font-black text-xs cursor-pointer border border-[#FF9100]/30"
        title="Translate Language / भाषा बदलें"
      >
        <Globe size={15} className="animate-spin-slow" />
        <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
      </button>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            {lang === 'en' ? 'AHAR VIDHI (JAIN DIET)' : 'आहार विधि (जैन भोजन नियम)'}
          </h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 md:flex-nowrap bg-white dark:bg-[#121212] p-1 border border-gray-200/50 dark:border-white/5 rounded-2xl mb-6 shadow-xs">
        <button 
          onClick={() => { setActiveTab('rules'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'rules' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-rules"
        >
          {lang === 'en' ? 'Rules' : 'आहार नियम'}
        </button>
        <button 
          onClick={() => { setActiveTab('recipes'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'recipes' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-recipes"
        >
          {lang === 'en' ? 'Recipes' : 'व्यंजन विधि'}
        </button>
        <button 
          onClick={() => { setActiveTab('audit'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[75px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'audit' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-audit"
        >
          {lang === 'en' ? 'Audit' : 'शुद्धता परीक्षक'}
        </button>
        <button 
          onClick={() => { setActiveTab('chouka'); setSelectedRecipe(null); }}
          className={`flex-1 min-w-[100px] text-center py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'chouka' ? 'bg-orange-500 text-white shadow-xs' : 'text-gray-400 hover:text-gray-650 dark:hover:text-gray-200'
          }`}
          id="btn-tab-chouka"
        >
          {lang === 'en' ? 'Chouka Map' : 'चौका नेविगेटर'}
        </button>
      </div>

      {/* Tab 1: Diet Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-orange-500">
              <Apple size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'Why Root Vegetables Are Avoided?' : 'जमीकन्द (प्याज-लहसुन-आलू) का त्याग क्यों?'}</h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "Root vegetables (like onion, garlic, potatoes, carrots) grow underground. Uprooting them pulls out the entire plant, destroying the life of countless microscopic organisms (AnanthKaya) clustered around the roots. For Jains, practicing supreme non-violence requires avoiding root vegetables."
                : "जमीन के नीचे उगने वाली कन्द सब्जियां (आलू, प्याज, लहसुन, गाजर) अनंत जीवधारी (अनंतकाय) कल्प मानी जाती हैं। इन्हें उखाड़ने से पूरा पौधा नष्ट होता है और जड़ के चिपककर रहने वाले लाखो सूक्ष्म जीवों की हिंसा होती है। अतः जैन श्रावक इनका पूर्ण त्याग करते हैं।"}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#2962FF]">
              <ShieldAlert size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'Filtered Water (Mariyada Jal)' : 'छना हुआ मर्यादित जल'}</h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "A clean double-folded thick cotton cloth (Chhana) is used to strain drinking water. Filtered organisms are safely returned to the water source (Bilchhani process). Boiled water carries a spiritual purity limit (Mariyada) of up to 24 hours."
                : "जल छानने के लिए मोटे सूती दोहरे कपड़े का उपयोग किया जाता है। छनने के उपरांत कपड़े में चिपके सूक्ष्म त्रस जीवों को पुनः मर्यादित जल के साथ जलस्त्रोत में छोड़ दिया जाता है (बिलछानी क्रिया), जिससे जीव हिंसा न हो। उबला पानी २४ घंटे मर्यादित रहता है।"}
            </p>
          </div>

          <div className="p-5 bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-red-500">
              <AlertTriangle size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'No Cooking After Sunset' : 'रात्रि भोजन का त्याग क्यों?'}</h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
              {lang === 'en' 
                ? "Insects and microscopic life multiply rapidly after Sunset under moist twilight conditions. Cooking or dining after Sunset in artificial light draws pests, inevitably causing high microscopic injury. Thus, eating during daylight hours protects biological lifespans."
                : "सूर्यास्त के उपरांत वाष्पीकरण थमने और अंधकार छाने से वायुमंडल में अनगिनत सूक्ष्म कीट व जीवाणु उत्पन्न होते हैं। कृत्रिम प्रकाश या रात्रि में भोजन पकाने या खाने से वे भोजन में समा सकते हैं, जिससे महान जीव हिंसा होती है। अतः रात्रि भोजन त्याज्य है।"}
            </p>
          </div>

          {/* Shastra-based Abhakhsya Guide (Abhakhsya Tyag) */}
          <div className="p-5 bg-red-500/5 dark:bg-red-500/10 rounded-3xl border border-red-500/20 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
              <ShieldAlert size={20} />
              <h2 className="text-base font-black uppercase tracking-wider">{lang === 'en' ? 'The Five Forbidden Categories (Abhakhsya)' : 'पंच उदुम्बर एवं मूल अवगुण त्याग (अभक्ष्य)'}</h2>
            </div>
            <div className="text-xs text-gray-650 dark:text-gray-300 font-semibold leading-relaxed space-y-3">
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
                    : "शहद की एक बूंद प्राप्त करने के लिए भी पूरे छत्ते को निचोड़ा जाता है जिससे लाखों मधुमक्खियों के अंडों, शिशुओं तथा जीवों का तत्क्षण विनाश होता है।"}
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
            <div className="grid gap-4">
              {RECIPES.map(recipe => (
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
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white truncate">
                        {lang === 'en' ? recipe.name.en : recipe.name.hi}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mt-2">
                      <span>⏱️ {recipe.time}</span>
                      <span className="text-orange-500 uppercase tracking-wider font-black">{lang === 'en' ? 'View details' : 'विस्तार से पढ़ें'} →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Recipe Detail View inside the flowing layout */
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

              {/* Optional Recipe Large Image */}
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
                <ul className="text-xs text-gray-700 dark:text-gray-300 font-medium space-y-2 list-disc list-inside bg-gray-50 dark:bg-[#1a1a1a]/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
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
                <ol className="text-xs text-gray-650 dark:text-gray-300 font-medium space-y-2.5 list-decimal list-inside bg-gray-50 dark:bg-[#1a1a1a]/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  {lang === 'en' 
                    ? selectedRecipe.instructions.map((ins, i) => <li key={i} className="pl-1 leading-relaxed">{ins}</li>)
                    : selectedRecipe.instructionsHi.map((ins, i) => <li key={i} className="pl-1 leading-relaxed">{ins}</li>)
                  }
                </ol>
              </div>

              {/* Satvik Tip box */}
              <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">
                  {lang === 'en' ? 'SATVIK JAIN COOKING ADVICE' : 'सात्विक पाक कला रहस्य'}
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
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
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="text-[#FF6D00]" size={20} />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {lang === 'en' ? 'Satvik Diet Auditor Machine' : 'भोजन शुद्धता परिक्षण मशीन'}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/30 border border-gray-200/50 dark:border-white/5 rounded-2xl">
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

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/30 border border-gray-200/50 dark:border-white/5 rounded-2xl">
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

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/30 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-200">{lang === 'en' ? 'Filtered Chhana Water used?' : 'क्या डबल छने मर्यादित जल का प्रयोग है?'}</span>
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

            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/30 border border-gray-200/50 dark:border-white/5 rounded-2xl">
              <div>
                <span className="font-extrabold text-xs block text-gray-800 dark:text-gray-200">{lang === 'en' ? 'Fermented cultures inside (Yeast/Microbes)?' : 'क्या खमीर या फर्मेंटेड वस्तुएं (यीस्ट, ब्रेड) हैं?'}</span>
                <span className="text-[10px] text-gray-400 font-medium block">Does it use store-bought yeast-fermented bread or vinegar?</span>
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md uppercase tracking-wider"
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
                  <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">{lang === 'en' ? 'AUDIT VERDICT SCORE' : 'ऑडिट परिणाम'}</span>
                  <p className="leading-relaxed font-black text-sm">{auditResult}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Tab 4: Verified Jain Chouka & Food Locator Navigator */}
      {activeTab === 'chouka' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-5 bg-white dark:bg-[#121212] border border-gray-200/60 dark:border-white/5 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-500 flex items-center gap-2">
                <Utensils size={18} />
                {lang === 'en' ? 'Jain Food Locator' : 'जैन फूड लोकेटर (शुद्ध चौका व आहार)'}
              </h3>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                {lang === 'en' 
                  ? 'Identify verified Jain kitchens, pious local family cooks, and dharamshalas serving pure dietary meals within custom distance radius.'
                  : 'तीर्थ यात्रियों के लिए ५ किमी के दायरे में छने जल, सूर्योदय-सूर्यास्त मर्यादा और बिना ज़मीकंद (आलू-प्याज) वाले प्रामाणिक जैन चौके एवं रसोई स्थल।'}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-3 pt-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 text-gray-450 dark:text-gray-500" size={16} />
                <input 
                  type="text"
                  placeholder={lang === 'en' ? 'Search by location, family name, road...' : 'शहर, सोसाइटी या मंदिर का नाम खोजें...'}
                  value={choukaSearchStr}
                  onChange={(e) => setChoukaSearchStr(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200/80 dark:border-white/5 rounded-2xl text-xs font-bold leading-normal focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>

              {/* Distance Slider Selector */}
              <div className="bg-gray-50 dark:bg-[#1A1A1A]/30 p-3.5 border border-gray-100 dark:border-white/5 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-gray-500">{lang === 'en' ? 'Max Distance Radius' : 'अधिकतम दूरी दायरा'}</span>
                  <span className="text-orange-500">{choukaDistanceFilter} km</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  value={choukaDistanceFilter}
                  onChange={(e) => setChoukaDistanceFilter(Number(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-extrabold uppercase">
                  <span>2 km</span>
                  <span>5 km {lang === 'en' ? '(Near Me)' : '(निकटतम)'}</span>
                  <span>15 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Quick Type Tags */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', en: 'All Kitchens', hi: 'सभी रसोई' },
                  { id: 'family', en: '🏡 Pious Families', hi: '🏡 श्रावक चौका' },
                  { id: 'dharamshala', en: '🏛️ Dharamshalas', hi: '🏛️ भोजनशाला' },
                  { id: 'restaurant', en: '🍛 Verified Hotels', hi: '🍛 सत्यापित होटल' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedChoukaType(t.id as any)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedChoukaType === t.id 
                        ? 'bg-orange-500 text-white shadow-xs' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {lang === 'en' ? t.en : t.hi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'en' ? 'CHOUKAS DISCOVERED' : 'प्राप्त सात्विक चौके'} ({filteredChoukas.length})</span>
              {choukaDistanceFilter <= 5 && <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{lang === 'en' ? 'LOCAL RADIUS ACTIVE' : 'स्थानीय दायरा एक्टिव'}</span>}
            </div>

            {filteredChoukas.length === 0 ? (
              <div className="p-10 text-center bg-white dark:bg-[#121212] rounded-3xl border border-gray-150 dark:border-white/5">
                <p className="text-xs text-gray-400 font-black uppercase mb-1">{lang === 'en' ? 'No Verified Choukas Found' : 'कोई प्रामाणिक चौका नहीं मिला'}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{lang === 'en' ? 'Try widening your distance slider or resetting keywords.' : 'कृपया दूरी का किलोमीटर बढ़ाएं या कीवर्ड बदलें।'}</p>
              </div>
            ) : (
              filteredChoukas.map((chk) => (
                <div key={chk.id} className="p-5 bg-white dark:bg-[#121212] border border-gray-150 dark:border-white/5 rounded-3xl shadow-xs space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase mb-1.5 bg-orange-500/10 text-orange-500">
                        {chk.type === 'family' && (lang === 'en' ? 'Noble Shravak Family' : 'श्रावक पारिवारिक चौका')}
                        {chk.type === 'dharamshala' && (lang === 'en' ? 'Tirth Dharamshala Rasoi' : 'तीर्थ धर्मशाला रसोई')}
                        {chk.type === 'restaurant' && (lang === 'en' ? 'Verified Satvik Restaurant' : 'सत्यापित सात्विक होटल')}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-850 dark:text-white leading-tight">
                        {lang === 'en' ? chk.name.en : chk.name.hi}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1">
                        📍 {lang === 'en' ? chk.address.en : chk.address.hi}
                      </p>
                    </div>
                    <span className="text-xs font-black text-orange-500 bg-orange-500/5 px-2.5 py-1 rounded-xl shrink-0">
                      ⚡ {chk.distance} km
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-650 dark:text-gray-300 font-medium leading-relaxed bg-gray-50/50 dark:bg-[#1A1A1A]/30 p-3 rounded-2xl border border-gray-100/50 dark:border-white/5">
                    {lang === 'en' ? chk.desc.en : chk.desc.hi}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[8px] font-black tracking-widest text-gray-400 block uppercase">{lang === 'en' ? 'GUARANTEED SANCTITY CODES' : 'चौका शुचिता व नियम कोड'}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-300">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>{lang === 'en' ? 'Sunset Rules' : 'सूर्यास्त पूर्व पाक क्रिया'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-300">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>{lang === 'en' ? 'Chhana Cotton Filter' : 'मर्यादित छना जल'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-300">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>{lang === 'en' ? 'Separate Untouched Pots' : 'पृथक वैष्णव बर्तन'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-650 dark:text-gray-300">
                        <CheckCircle2 size={13} className="text-emerald-500" />
                        <span>{lang === 'en' ? 'Zero Root Vegs' : 'आलू-प्याज सर्वथा वर्जित'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px]">
                    <div className="font-extrabold text-[#757575]">
                      ⏰ {lang === 'en' ? chk.timing.en : chk.timing.hi}
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${chk.contact}`}
                        className="px-3.5 py-2 bg-orange-500 text-white font-black rounded-xl uppercase tracking-wider text-[9px] hover:bg-orange-600 shadow-xs cursor-pointer text-center flex-1 sm:flex-initial"
                      >
                        📞 {lang === 'en' ? 'Contact' : 'संपर्क करें'}
                      </a>
                      <button 
                        onClick={() => alert(lang === 'en' ? `Opening directions for ${chk.name.en} using map coordinates.` : `${chk.name.hi} के लिए लाइव नक्शा मार्गनिर्देशन लोड हो रहा है...`)}
                        className="px-3.5 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-black rounded-xl uppercase tracking-wider text-[9px] hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer text-center flex-1 sm:flex-initial border border-gray-200/50 dark:border-white/5"
                      >
                        🗺️ {lang === 'en' ? 'Navigate' : 'रास्ता देखें'}
                      </button>
                    </div>
                  </div>

                  <div className="text-[8px] font-extrabold text-emerald-500 flex items-center gap-1 bg-emerald-500/5 px-2.5 py-1.5 rounded-xl border border-emerald-500/10">
                    🛡️ {lang === 'en' ? 'VERIFIED STAMP:' : 'सत्यापन:'} {chk.verifiedBy}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <SectionAiAgent section="diet" />
    </div>
  );
}
