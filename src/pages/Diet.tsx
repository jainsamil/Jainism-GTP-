import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ShieldAlert, CheckCircle2, Apple, Utensils, HelpCircle, Heart, Search, ListFilter, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

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
  }
];

export default function DietPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'rules' | 'recipes' | 'audit'>('rules');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Satvik Audit State
  const [auditScores, setAuditScores] = useState({
    rootVegs: false, // Onion/Garlic/Potato
    sunsetTime: false, // Eaten after sunset?
    filteredWater: true, // Standard filter limit?
    yeastFoods: false // Bread, yeast, alcohol?
  });
  const [auditResult, setAuditResult] = useState<string | null>(null);

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
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
          AHAR VIDHI (आहार नियम)
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-[#121212] p-1 border border-gray-200/50 dark:border-white/5 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'rules' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
          id="btn-tab-rules"
        >
          {lang === 'en' ? 'Diet Rules' : 'आहार नियम'}
        </button>
        <button 
          onClick={() => setActiveTab('recipes')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'recipes' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
          id="btn-tab-recipes"
        >
          {lang === 'en' ? 'Recipes' : 'व्यंजन विधि'}
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
            activeTab === 'audit' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
          id="btn-tab-audit"
        >
          {lang === 'en' ? 'Satvik Audit' : 'शुद्धता परीक्षक'}
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
        </div>
      )}

      {/* Tab 2: Satvik Recipes */}
      {activeTab === 'recipes' && (
        <div className="space-y-4 animate-in fade-in duration-300">
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

          {/* Details Dialog overlay */}
          <AnimatePresence>
            {selectedRecipe && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center"
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="bg-white dark:bg-[#0d0d0d] w-full max-w-2xl rounded-t-[2.5rem] border-t border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[85vh] p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                    <div>
                      <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">JAIN SATVIK DELICACY</span>
                      <h2 className="text-xl font-display font-black text-gray-900 dark:text-white">
                        {lang === 'en' ? selectedRecipe.name.en : selectedRecipe.name.hi}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setSelectedRecipe(null)}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 text-xs font-bold rounded-full text-gray-500 hover:bg-gray-200"
                      id="close-recipe-btn"
                    >
                      {lang === 'en' ? 'Close' : 'बंद करें'}
                    </button>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1.5">
                      <Utensils size={14} />
                      {lang === 'en' ? 'Ingredients List' : 'आवश्यक खाद्य सामग्री'}
                    </h4>
                    <ul className="text-xs text-gray-700 dark:text-gray-300 font-medium space-y-1.5 list-disc list-inside">
                      {lang === 'en' 
                        ? selectedRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                        : selectedRecipe.ingredientsHi.map((ing, i) => <li key={i}>{ing}</li>)
                      }
                    </ul>
                  </div>

                  {/* Preparation Instructions */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-orange-500 tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen size={14} />
                      {lang === 'en' ? 'Step-by-step Instructions' : 'बनाने की सरल विधि'}
                    </h4>
                    <ol className="text-xs text-gray-600 dark:text-gray-300 font-medium space-y-2 list-decimal list-inside">
                      {lang === 'en' 
                        ? selectedRecipe.instructions.map((ins, i) => <li key={i} className="pl-1">{ins}</li>)
                        : selectedRecipe.instructionsHi.map((ins, i) => <li key={i} className="pl-1">{ins}</li>)
                      }
                    </ol>
                  </div>

                  {/* Satvik Tip box */}
                  <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                    <span className="text-[8px] font-black tracking-widest text-[#FF6D00] block mb-1 uppercase">{lang === 'en' ? 'SATVIK JAIN COOKING ADVICE' : 'सात्विक पाक कला रहस्य'}</span>
                    <p className="text-xs text-gray-700 dark:text-gray-200 font-bold leading-relaxed">
                      {lang === 'en' ? selectedRecipe.tips.en : selectedRecipe.tips.hi}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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
    </div>
  );
}
