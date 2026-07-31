import { FileText, ArrowLeft, ShieldAlert, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const termsContent = {
  en: {
    title: "Terms & Conditions",
    lastUpdated: "Last updated: May 2026 • For Jainism GPT",
    intro1: "Welcome to Jainism GPT! These terms and conditions outline the rules and regulations for the use of Jainism GPT's Application and website service.",
    intro2: "By accessing this website, we assume you accept these terms and conditions. Do not continue to use Jainism GPT if you do not agree to take all of the terms and conditions stated on this page.",
    sec1Title: "License",
    sec1Body: "Unless otherwise stated, Jainism GPT and/or its licensors own the intellectual property rights for all material on Jainism GPT. All intellectual property rights are reserved. You may access this from Jainism GPT for your own personal use subjected to restrictions set in these terms and conditions.",
    sec1ListHeader: "You must not:",
    list1: "Republish material from Jainism GPT",
    list2: "Sell, rent, or sub-license material from Jainism GPT",
    list3: "Reproduce, duplicate, or copy material from Jainism GPT",
    list4: "Redistribute content from Jainism GPT",
    sec2Title: "Divine Content Accuracy",
    sec2Body: "The content provided in Jainism GPT is sourced from traditional literature, including Aagams, Bhaktamar Stotras, Panchang, and authentic Jain scriptures. While we try our best to keep this divine wisdom authentic and accurate, the spiritual outputs provided by AI are simulated and should be benchmarked with senior scholars / Jain ascetics for critical practice.",
    sec3Title: "Hyperlinking to our Content",
    sec3Body: "Organizations may link to our home page or public sections so long as the link is not in any way deceptive, does not falsely imply sponsorship or endorsement, and fits within the context of the linking party’s site.",
    sec4Title: "Disclaimer",
    sec4Body: "To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury, fraud, or misrepresentation.",
    sec5Title: "Need Clarification?",
    sec5Body: "If you have any queries regarding any of our terms, please feel free to reach out to us:",
    contactBtn: "Contact Samil Jain",
  },
  hi: {
    title: "नियम एवं शर्तें (Terms & Conditions)",
    lastUpdated: "अंतिम संशोधन: मई 2026 • जैनिज़्म जीपीटी हेतु",
    intro1: "जैनिज़्म जीपीटी (Jainism GPT) पर आपका स्वागत है! ये नियम और शर्तें जैनिज़्म जीपीटी के एप्लिकेशन और वेबसाइट सेवा के उपयोग के नियमों और विनियमों को रेखांकित करती हैं।",
    intro2: "इस एप्लिकेशन या वेबसाइट का उपयोग करके, हम मानते हैं कि आप इन नियमों और शर्तों को स्वीकार करते हैं। यदि आप इस पृष्ठ पर बताए गए सभी नियमों और शर्तों से असहमत हैं, तो जैनिज़्म जीपीटी का उपयोग जारी न रखें।",
    sec1Title: "लाइसेंस एवं सर्वाधिकार (License)",
    sec1Body: "जब तक अन्यथा निर्दिष्ट न हो, जैनिज़्म जीपीटी और/या इसके लाइसेंसधारक जैनिज़्म जीपीटी पर सभी सामग्रियों के बौद्धिक संपदा अधिकारों के स्वामी हैं। सभी बौद्धिक संपदा अधिकार सुरक्षित हैं। आप इन नियमों और शर्तों में निर्धारित प्रतिबंधों के अधीन अपने व्यक्तिगत उपयोग के लिए जैनिज़्म जीपीटी से इस सामग्री को एक्सेस कर सकते हैं।",
    sec1ListHeader: "आपको निम्नलिखित नहीं करना चाहिए:",
    list1: "जैनिज़्म जीपीटी से सामग्री को पुनः प्रकाशित करना",
    list2: "जैनिज़्म जीपीटी से सामग्री बेचना, किराए पर देना या सब-लाइसेंस देना",
    list3: "जैनिज़्म जीपीटी से सामग्री का पुनरुत्पादन, डुप्लिकेट या कॉपी करना",
    list4: "जैनिज़्म जीपीटी से सामग्री को वितरित या साझा करना",
    sec2Title: "पवित्र आध्यात्मिक सामग्री की सत्यता",
    sec2Body: "जैनिज़्म जीपीटी में प्रदान की गई सामग्री पारंपरिक साहित्य, जिसमें जैन आगम, भक्तामर स्तोत्र, पंचांग, और प्रामाणिक जैन ग्रंथ शामिल हैं, से ली गई है। यद्यपि हम इस दिव्य ज्ञान को विश्वसनीय और सटीक रखने का सर्वोत्तम प्रयास करते हैं, एआई (AI) द्वारा उत्पन्न आध्यात्मिक उत्तर कृत्रिम सिमुलेशन हैं और गंभीर अभ्यास के लिए वरिष्ठ विद्वानों / जैन आचार्यों द्वारा सत्यापित किए जाने चाहिए।",
    sec3Title: "सामग्री का हाइपरलिंक (Hyperlinking)",
    sec3Body: "धार्मिक व सामाजिक संगठन हमारे होम पेज या सार्वजनिक अनुभागों से लिंक कर सकते हैं बशर्ते कि वह लिंक किसी भी तरह से भ्रामक न हो, और प्रायोजन या समर्थन का झूठा संकेत न देता हो।",
    sec4Title: "अस्वीकरण (Disclaimer)",
    sec4Body: "लागू कानून द्वारा अनुमत अधिकतम सीमा तक, हम इस वेबसाइट और इसके उपयोग से संबंधित सभी अभ्यावेदन, वारंटी और शर्तों को बाहर करते हैं। इस अस्वीकरण में कुछ भी व्यक्तिगत चोट, धोखाधड़ी या गलत बयानी के लिए हमारे दायित्व को सीमित नहीं करेगा।",
    sec5Title: "कोई सहायता या स्पष्टीकरण?",
    sec5Body: "यदि आपके पास हमारे नियमों और शर्तों के संबंध में कोई प्रश्न है, तो कृपया बेझिझक हमसे संपर्क करें:",
    contactBtn: "समिल जैन से संपर्क करें",
  }
};

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const terms = language === 'hi' ? termsContent.hi : termsContent.en;

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 pb-24 px-4 sm:px-6 font-sans selection:bg-[#FF6D00]/20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Sticky Header with inline controls */}
        <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
              <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
            </button>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate flex items-center gap-2">
              <ShieldAlert className="text-[#FF6D00] shrink-0" size={18} />
              <span className="truncate">{terms.title}</span>
            </h1>
          </div>

          <div className="flex items-center shrink-0">
            {/* Inline Header Translator Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
              title="Translate Language / भाषा बदलें"
            >
              <Globe size={11} className="animate-spin-slow shrink-0" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </header>

        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-8">{terms.lastUpdated}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>{terms.intro1}</p>
          <p>{terms.intro2}</p>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {terms.sec1Title}
            </h2>
            <p>{terms.sec1Body}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{terms.sec1ListHeader}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{terms.list1}</li>
              <li>{terms.list2}</li>
              <li>{terms.list3}</li>
              <li>{terms.list4}</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {terms.sec2Title}
            </h2>
            <p>{terms.sec2Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {terms.sec3Title}
            </h2>
            <p>{terms.sec3Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {terms.sec4Title}
            </h2>
            <p>{terms.sec4Body}</p>
          </section>

          <section className="space-y-4 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/10 border border-[#FF6D00]/20 p-6 rounded-2xl text-center">
            <h3 className="text-md font-bold text-gray-900 dark:text-white">{terms.sec5Title}</h3>
            <p className="text-sm">
              {terms.sec5Body}
            </p>
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-full hover:scale-105 transition-all shadow-md"
            >
              {terms.contactBtn}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
