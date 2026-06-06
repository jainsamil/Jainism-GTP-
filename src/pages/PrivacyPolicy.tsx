import { Shield, ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const policyContent = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: May 2026 • For Jainism GPT",
    intro: "At Jainism GPT, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Jainism GPT and how we use it.",
    sec1Title: "Log Files",
    sec1Body: "Jainism GPT follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.",
    sec2Title: "Cookies and Web Beacons",
    sec2Body: "Like any other website, Jainism GPT uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.",
    sec3Title: "Google DoubleClick DART Cookie",
    sec3Body: "Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to several websites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.",
    sec4Title: "Advertising Partners Privacy Policies",
    sec4Body: "Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Jainism GPT, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.",
    sec4Note: "Note that Jainism GPT has no access to or control over these cookies that are used by third-party advertisers.",
    sec5Title: "Third Party Privacy Policies",
    sec5Body: "Jainism GPT's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.",
    sec6Title: "Children's Information",
    sec6Body: "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Jainism GPT does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.",
    sec7Title: "Consent",
    sec7Body: "By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.",
    sec8Title: "Questions or Suggestions?",
    sec8Body: "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:",
    contactBtn: "Contact Samil Jain on Instagram",
  },
  hi: {
    title: "गोपनीयता नीति (Privacy Policy)",
    lastUpdated: "अंतिम संशोधन: मई 2026 • जैनिज़्म जीपीटी हेतु",
    intro: "जैनिज़्म जीपीटी (Jainism GPT) पर, जो हमारे ऐप के माध्यम से सुलभ है, हमारे आगंतुकों की गोपनीयता हमारी सबसे बड़ी प्राथमिकताओं में से एक है। इस गोपनीयता नीति दस्तावेज़ में विभिन्न प्रकार की जानकारी शामिल है जो जैनिज़्म जीपीटी द्वारा एकत्र और रिकॉर्ड की जाती है तथा हम इसका उपयोग कैसे करते हैं।",
    sec1Title: "लॉग फ़ाइलें (Log Files)",
    sec1Body: "जैनिज़्म जीपीटी लॉग फाइलों का उपयोग करने की एक मानक प्रक्रिया का पालन करता है। जब आगंतुक वेबसाइटों पर जाते हैं तो ये फाइलें आगंतुकों को लॉग करती हैं। सभी होस्टिंग कंपनियां होस्टिंग सेवाओं के विश्लेषण के हिस्से के रूप में ऐसा करती हैं। लॉग फ़ाइलों द्वारा एकत्र की गई जानकारी में इंटरनेट प्रोटोकॉल (आईपी) पते, ब्राउज़र प्रकार, इंटरनेट सेवा प्रदाता (आईएसपी), दिनांक और समय टिकट, प्रेषण/निकास पृष्ठ, और संभवतः क्लिकों की संख्या शामिल है। ये किसी भी ऐसी जानकारी से जुड़े नहीं हैं जो व्यक्तिगत रूप से पहचान योग्य हो। इस जानकारी का उद्देश्य रुझानों का विश्लेषण करना, साइट का संचालन करना, वेबसाइट पर उपयोगकर्ताओं की गतिविधियों को ट्रैक करना और जनसांख्यिकीय जानकारी एकत्र करना है।",
    sec2Title: "कुकीज़ और वेब बीकन (Cookies)",
    sec2Body: "किसी भी अन्य वेबसाइट की तरह, जैनिज़्म जीपीटी 'कुकीज़' का उपयोग करता है। इन कुकीज़ का उपयोग आगंतुकों की प्राथमिकताओं और वेबसाइट पर उन पृष्ठों सहित अन्य जानकारी को संग्रहीत करने के लिए किया जाता है जिन पर आगंतुक ने एक्सेस किया या दौरा किया। जानकारी का उपयोग आगंतुकों के ब्राउज़र प्रकार और/या अन्य जानकारी के आधार पर हमारे वेब पेज की सामग्री को कस्टमाइज़ करके उपयोगकर्ताओं के अनुभव को अनुकूलित करने के लिए किया जाता है।",
    sec3Title: "गूगल डबलक्लिक डार्ट कुकी (Google DART Cookie)",
    sec3Body: "गूगल हमारी साइट पर एक तृतीय-पक्ष विक्रेता है। यह हमारी साइट के आगंतुकों को इंटरनेट पर विभिन्न वेबसाइटों पर उनकी यात्रा के आधार पर विज्ञापन देने के लिए कुकीज़ का उपयोग करता है, जिन्हें डार्ट कुकीज़ के रूप में जाना जाता है। हालांकि, आगंतुक गूगल विज्ञापन और सामग्री नेटवर्क गोपनीयता नीति पर जाकर डार्ट कुकीज़ के उपयोग को अस्वीकार करना चुन सकते हैं।",
    sec4Title: "विज्ञापन भागीदार गोपनीयता नीतियां",
    sec4Body: "तृतीय-पक्ष विज्ञापन सर्वर या विज्ञापन नेटवर्क कुकीज़, जावास्क्रिप्ट, या वेब बीकन जैसी तकनीकों का उपयोग करते हैं जो उनके संबंधित विज्ञापनों और लिंक में उपयोग की जाती हैं जो जैनिज़्म जीपीटी पर दिखाई देती हैं, जो सीधे उपयोगकर्ताओं के ब्राउज़र पर भेजी जाती हैं। जब ऐसा होता है तो वे स्वचालित रूप से आपका आईपी पता प्राप्त कर लेते हैं। इन तकनीकों का उपयोग उनके विज्ञापन अभियानों की प्रभावशीलता को मापने और/या आपके द्वारा देखी जाने वाली वेबसाइटों पर दिखाई देने वाली विज्ञापन सामग्री को व्यक्तिगत बनाने के लिए किया जाता है।",
    sec4Note: "ध्यान दें कि जैनिज़्म जीपीटी के पास इन कुकीज़ पर कोई पहुंच या नियंत्रण नहीं है जो कि तृतीय-पक्ष विज्ञापनदाताओं द्वारा उपयोग की जाती हैं।",
    sec5Title: "तृतीय पक्ष गोपनीयता नीतियां (Third Party Policies)",
    sec5Body: "जैनिज़्म जीपीटी की गोपनीयता नीति अन्य विज्ञापनदाताओं या वेबसाइटों पर लागू नहीं होती है। इस प्रकार, हम आपको अधिक विस्तृत जानकारी के लिए इन तृतीय-पक्ष विज्ञापन सर्वरों की संबंधित गोपनीयता नीतियों से परामर्श करने की सलाह दे रहे हैं। इसमें उनकी प्रथाएं और कुछ विकल्पों से बाहर निकलने के निर्देश शामिल हो सकते हैं।",
    sec6Title: "बच्चों की सुरक्षा और जानकारी",
    sec6Body: "हमारी प्राथमिकता का एक अन्य हिस्सा इंटरनेट का उपयोग करते समय बच्चों के लिए सुरक्षा जोड़ना है। हम माता-पिता और अभिभावकों को उनकी ऑनलाइन गतिविधि का निरीक्षण करने, भाग लेने और/या निगरानी करने और मार्गदर्शन करने के लिए प्रोत्साहित करते हैं। जैनिज़्म जीपीटी जानबूझकर 13 वर्ष से कम उम्र के बच्चों से कोई व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करता है। यदि आपको लगता है कि आपके बच्चे ने हमारी वेबसाइट पर इस तरह की जानकारी प्रदान की है, तो हम आपको तुरंत हमसे संपर्क करने के लिए दृढ़ता से प्रोत्साहित करते हैं और हम अपने रिकॉर्ड से ऐसी जानकारी को तुरंत हटाने के लिए सर्वोत्तम प्रयास करेंगे।",
    sec7Title: "सहमति (Consent)",
    sec7Body: "हमारी वेबसाइट या ऐप का उपयोग करके, आप हमारी गोपनीयता नीति पर सहमति देते हैं और इसके नियमों और शर्तों से सहमत होते हैं।",
    sec8Title: "कोई प्रश्न या सुझाव?",
    sec8Body: "यदि आपके पास हमारी गोपनीयता नीति के बारे में कोई प्रश्न या सुझाव है, तो हमसे संपर्क करने में संकोच न करें:",
    contactBtn: "इंस्टाग्राम पर समिल जैन से संपर्क करें",
  }
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const policy = language === 'hi' ? policyContent.hi : policyContent.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 p-6 pb-24 font-sans selection:bg-[#FF6D00]/20 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Sticky Header with inline controls */}
        <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
              <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
            </button>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate flex items-center gap-2">
              <Shield className="text-[#FF6D00] shrink-0" size={18} />
              <span className="truncate">{policy.title}</span>
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

        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-8">{policy.lastUpdated}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>{policy.intro}</p>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec1Title}
            </h2>
            <p>{policy.sec1Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec2Title}
            </h2>
            <p>{policy.sec2Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec3Title}
            </h2>
            <p>{policy.sec3Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec4Title}
            </h2>
            <p>{policy.sec4Body}</p>
            <p className="text-xs text-gray-500">
              {policy.sec4Note}
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec5Title}
            </h2>
            <p>{policy.sec5Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec6Title}
            </h2>
            <p>{policy.sec6Body}</p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {policy.sec7Title}
            </h2>
            <p>{policy.sec7Body}</p>
          </section>

          <section className="space-y-4 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/10 border border-[#FF6D00]/20 p-6 rounded-2xl text-center">
            <h3 className="text-md font-bold text-gray-900 dark:text-white">{policy.sec8Title}</h3>
            <p className="text-sm">
              {policy.sec8Body}
            </p>
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-full hover:scale-105 transition-all shadow-md"
            >
              {policy.contactBtn}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
