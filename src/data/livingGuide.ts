export interface LivingGuideCategory {
  id: string;
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  iconName: string;
  targetAudience: { en: string; hi: string };
  practices: {
    title: { en: string; hi: string };
    type: 'do' | 'dont';
    desc: { en: string; hi: string };
    kidsTip: { en: string; hi: string };
  }[];
}

export const livingGuideData: LivingGuideCategory[] = [
  {
    id: 'dev_darshan',
    title: { en: "Daily Dev Darshan routine", hi: "दैनिक देव दर्शन विधि" },
    subtitle: { en: "The spiritual morning routine of visiting the Jinendra Temple", hi: "जिनेन्द्र जिनालय जाने की सरल एवं पवित्र दैनिक दिनचर्या" },
    iconName: "Home",
    targetAudience: { en: "All Ages / Kids to Elders", hi: "सभी आयु वर्ग के लिए" },
    practices: [
      {
        title: { en: "Bathe and wear clean, simple clothes", hi: "स्नान कर स्वच्छ व सादे वस्त्र धारण करें" },
        type: 'do',
        desc: {
          en: "Always take a bath and wear fresh, clean, simple clothes (preferably white or light light-colored cotton) before entering the temple. Avoid leather belts, wallets, or shoes.",
          hi: "मंदिर जी जाने से पहले हमेशा स्नान करें और पूजा के लिए धुले हुए पवित्र वस्त्र पहनें। चमड़े की बेल्ट, पर्स या जूते-चप्पल बाहर ही उतारें।"
        },
        kidsTip: {
          en: "Tip for kids: Keep a special set of simple cotton clothes just for temple visits!",
          hi: "बच्चों के लिए: मंदिर जाने के लिए अपने अलग साफ कपड़े रखें जिन्हें पहनकर आप केवल भगवान की पूजा करते हैं।"
        }
      },
      {
        title: { en: "Enter saying 'Nissahi' (निःसहि)", hi: "प्रवेश द्वार पर 'निःसहि' कहें" },
        type: 'do',
        desc: {
          en: "Say 'Nissahi' three times while entering. It means 'I am leaving all worldly thoughts and materials outside the temple.'",
          hi: "मंदिर जी में प्रवेश करते समय तीन बार 'निःसहि' कहें। इसका अर्थ है - 'मैं सांसारिक कार्यों और विचारों को मंदिर से बाहर ही त्यागता हूँ।'"
        },
        kidsTip: {
          en: "What to say: Say 'Nissahi, Nissahi, Nissahi' as you step in!",
          hi: "याद रखें: मुस्कुराकर कहें 'निःसहि, निःसहि, निःसहि' ताकि मन शांत हो सके।"
        }
      },
      {
        title: { en: "Do not gossip or use mobile phones inside", hi: "अनावश्यक बातें या मोबाइल का प्रयोग न करें" },
        type: 'dont',
        desc: {
          en: "The temple is a place of profound peace. Talking, laughing, joking, or using smartphones disrupts the spiritual environment.",
          hi: "जिनालय परम शांति का स्थान है। वहां सांसारिक चर्चा, हंसी-मजाक या मोबाइल का उपयोग करना अशांति फैलाता है।"
        },
        kidsTip: {
          en: "Remember: Keep your phone on silent and keep your voice whisper-quiet!",
          hi: "सीखें: मंदिरजी में दोस्तों से बातें न करें, केवल भगवान के दर्शन और मंत्र जाप पर ध्यान दें।"
        }
      },
      {
        title: { en: "Perform Charitra Shuddhi & Dravya Arpan", hi: "द्रव्य अर्पण और तीन परिक्रमा" },
        type: 'do',
        desc: {
          en: "Circumambulate the main sanctum (Pradakshina) 3 times clockwise, reminding yourself of the Three Jewels (Right Faith, Knowledge, Conduct). Offer clean, dry rice grains (Akshat).",
          hi: "भगवान वेदी के समक्ष तीन परिक्रमा (सम्यक दर्शन-ज्ञान-चारित्र के प्रतीक रूप) लगाएं और शुद्ध चावल या अष्टद्रव्य चढ़ाकर णमोकार मंत्र जपें।"
        },
        kidsTip: {
          en: "Fun activity: Gently place rice grains in the shape of a Swastika or Om on the offering table!",
          hi: "गतिविधि: चावल चढ़ाते समय थाली में सुंदर स्वस्तिक या ॐ की आकृति बनाएं।"
        }
      }
    ]
  },
  {
    id: 'ratribhojan_tyag',
    title: { en: "Abstinence from Night Eating", hi: "रात्रि भोजन त्याग नियम" },
    subtitle: { en: "Why avoiding meals after sunset is crucial for Ahimsa and health", hi: "सूर्यास्त के बाद भोजन न करने का वैज्ञानिक एवं आध्यात्मिक आधार" },
    iconName: "Sunset",
    targetAudience: { en: "Adults, Youth & Kids", hi: "युवाओं और बच्चों के लिए विशेष" },
    practices: [
      {
        title: { en: "Have dinner 48 minutes before sunset", hi: "सूर्यास्त से कम से कम ४८ मिनट पहले भोजन करें" },
        type: 'do',
        desc: {
          en: "Complete your final meal of the day during daylight. This prevents eating microscopic organisms that multiply rapidly in the absence of sunlight.",
          hi: "दिन छिपने से ४८ मिनट पूर्व ही भोजन पानी कर लें। सूर्य की किरणों के अभाव में हवा में अति-सूक्ष्म जीव उत्पन्न हो जाते हैं जो भोजन के साथ पेट में चले जाते हैं।"
        },
        kidsTip: {
          en: "Health Benefit: Eating early makes you feel super energetic and light the next morning!",
          hi: "स्वास्थ्य लाभ: शाम को जल्दी खाना खाने से सुबह पेट एकदम साफ और स्फूर्तिदायक महसूस होता है!"
        }
      },
      {
        title: { en: "Do not cook or heat food at night", hi: "रात में भोजन पकाना या गर्म करना वर्जित है" },
        type: 'dont',
        desc: {
          en: "Lighting fire/gas at night attracts and harms countless insects and bugs that fly towards light source.",
          hi: "रात के अंधेरे में आग या गैस जलाने से प्रकाश की ओर आकर्षित होकर असंख्य उड़ने वाले कीट-पतंगे जलकर मर जाते हैं। अतः रात में रसोइ बनाना सर्वथा वर्जित है।"
        },
        kidsTip: {
          en: "Why? Fire and light attract tiny flies who want to play but might accidentally fall into the hot food.",
          hi: "सोचें: हमारी जरा सी रोशनी के कारण बेचारे छोटे-छोटे पतंगे आग के संपर्क में आकर झुलस सकते हैं।"
        }
      },
      {
        title: { en: "Avoid drinking night-stored water", hi: "रात का रखा बासी पानी न पिएं" },
        type: 'dont',
        desc: {
          en: "Water stored without sunlight undergoes rapid microbial growth. Freshly filtered water must be consumed and boiled (Prasuk) during daylight hours.",
          hi: "बिना सूर्यप्रकाश के रखे पानी में रातभर में करोड़ों कीटाणु जमा हो जाते हैं। इसलिए हमेशा दिन में छाना और गरम किया हुआ प्रासुक जल ही उत्तम माना गया है।"
        },
        kidsTip: {
          en: "Rule of thumb: Drink fresh, filtered water that was treated during the daytime.",
          hi: "नियम: रात को सोने से पहले अपनी पानी की बोतल दिन में ही छानकर भर लें!"
        }
      }
    ]
  },
  {
    id: 'water_filtration',
    title: { en: "Chhani hui mitti & Chhana pani", hi: "जल छानने की विधि और मर्यादा" },
    subtitle: { en: "Using a proper double-fold cotton cloth to filter and save aquatic creatures", hi: "त्रस जीवों की रक्षा के लिए सादे सूती दोहरे कपड़े से पानी छानने का उत्तम ढंग" },
    iconName: "Droplet",
    targetAudience: { en: "Elders & Homekeepers", hi: "गृहणियों और बड़ों के लिए" },
    practices: [
      {
        title: { en: "Use a pure thick cotton cloth (Chhāna)", hi: "मोटे सूती दोहरे छानने के कपड़े का प्रयोग करें" },
        type: 'do',
        desc: {
          en: "Always use a specialized, clean, thick organic cotton cloth (double-folded) to filter tap water. Synthetic or thin plastic sieves are ineffective and cause violence to water-bodied Jivas.",
          hi: "पानी छानने के लिए हमेशा शुद्ध गाढ़ा सूती कपड़ा दोहरा (दो परतों वाला) इस्तेमाल करें। प्लास्टिक की चलनी या पतले नेट से सूक्ष्म जीव नहीं बच पाते।"
        },
        kidsTip: {
          en: "Fact: Thick cotton traps tiny living beings so we can safely return them to their home!",
          hi: "विज्ञान: सूती कपड़ा अत्यंत बारीक छिद्रों वाला होता है जिससे जल के जीव कपड़े में ही सुरक्षित रह जाते हैं।"
        }
      },
      {
        title: { en: "Perform 'Bilchhani' (Return of Organisms)", hi: "समय पर 'बिलछानी' (जीवानी) अवश्य करें" },
        type: 'do',
        desc: {
          en: "The trapped organisms on the filtering cloth must never be washed down the drain. Gently wash the cloth with some filtered water and return it to its source (wells or rivers) respectfully.",
          hi: "पानी छानने के बाद कपड़े पर टिके सूक्ष्म द्वीन्द्रिय-त्रीन्द्रिय जीवों को सिंक में न बहाएं। उन्हें पानी के बर्तन में धोकर (जीवानी बनाकर) सुरक्षित कुएं या तालाब वाले बहते पानी में डालें।"
        },
        kidsTip: {
          en: "Hero act: Returning little creatures safely to water makes you a true protector of life!",
          hi: "अहिंसा रक्षक: जीवों को उनके घर (जीवानी) लौटाना जैन बालक का सबसे उत्तम अहिंसक कर्म है।"
        }
      },
      {
        title: { en: "Do not keep filtered water beyond its 'Maryada' time", hi: "बिना मर्यादित समय के पानी का प्रयोग न करें" },
        type: 'dont',
        desc: {
          en: "Simple filtered water has a shelf-life (Maryada) of 48 minutes. If boiled, its Maryada extends to 24 hours. Consuming stale water causes infinite micro-organisms to enter your body.",
          hi: "सादे छाने पानी की मर्यादा केवल ४८ मिनट होती है। यदि उसे उबाल लिया जाए (प्रासुक कर लिया जाए) तो मर्यादा २४ घंटे हो जाती है। इसके बाद उसमें जीवाणु बढ़ जाते हैं।"
        },
        kidsTip: {
          en: "To remember: Boiled water stays clean and safe for a full night and day!",
          hi: "याद रखें: उबला हुआ पानी पीने से पेट दर्द नहीं होता और २४ घंटे तक मर्यादा बनी रहती है।"
        }
      }
    ]
  },
  {
    id: 'dietary_precautions',
    title: { en: "Kandmool (Root vegetable) rules", hi: "कंदमूल (जमीकंद) निषेध नियम" },
    subtitle: { en: "Avoiding underground tubers to avoid destroying life roots", hi: "आलू, प्याज, लहसुन, गाजर और अदरक के त्याग का कारण व विवेक" },
    iconName: "Apple",
    targetAudience: { en: "Cooking & Diet discipline", hi: "रसोई के नियम" },
    practices: [
      {
        title: { en: "Avoid potatoes, onions, garlic & ginger", hi: "आलू, प्याज, लहसुन और अदरक का पूर्ण त्याग" },
        type: 'dont',
        desc: {
          en: "Root vegetables grow underground and contain 'Anant Jivas' (infinite individual live cells in a single root). Uprooting them destroys the whole plant and home of countless earthworms and soil organisms.",
          hi: "जमीन के भीतर उगने वाले कंदों में अनंत जीव होते हैं। प्याज का एक कोना भी अनंत जीवों का पिंड होता है, इसलिए उनका सेवन त्याज्य है।"
        },
        kidsTip: {
          en: "Awesome substitutes: Use raw banana (Kachha Kela) to make delicious, pure Jain fries and curries!",
          hi: "स्वादिष्ट विकल्प: आलू की जगह कच्चे केले से बने समोसे, फ्रेंच फ्राइज और चिप्स बहुत ही स्वादिष्ट लगते हैं!"
        }
      },
      {
        title: { en: "Use healthy organic alternatives", hi: "पौष्टिक एवं सात्विक मौसमी सब्जियों का सेवन करें" },
        type: 'do',
        desc: {
          en: "Eat green vegetables grown above ground like bottle gourd (Lauki), ridge gourd (Torai), pumpkin, and spinach (except in Chaturmas or on Parva days). These vegetables are easily digestible and pure.",
          hi: "बेल पर उगने वाली घिया (लौकी), तोरई, कद्दू, और ताज़ा फल का सेवन करें। ये स्वास्थ्यवर्धक भी हैं और पूरी तरह अहिंसक भी।"
        },
        kidsTip: {
          en: "Yummy tips: Fresh dry fruits, apples, mangoes, and lentils are amazing power foods!",
          hi: "स्वादिष्ट टिप्स: बादाम, काजू, दालें, ताजे फल और सूखे मेवे आपके शरीर को शक्तिशाली और बुद्धिमान बनाते हैं।"
        }
      }
    ]
  }
];
