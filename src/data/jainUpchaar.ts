export interface JainTreatment {
  id: string;
  category: {
    en: string;
    hi: string;
  };
  disease: {
    en: string;
    hi: string;
  };
  symptoms: {
    en: string;
    hi: string;
  };
  jainMethod: {
    en: string;
    hi: string;
  };
  dietRules: {
    en: string;
    hi: string;
  };
  spiritualHeal: {
    en: string;
    hi: string;
  };
}

export const jainUpchaarData: JainTreatment[] = [
  {
    id: "digestive_acidity",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Acidity & Heartburn", hi: "अम्लता (एसिडिटी) और सीने में जलन" },
    symptoms: { en: "Burning sensation in stomach, sour belching, indigestion.", hi: "पेट में जलन, खट्टी डकारें आना, अपच।" },
    jainMethod: {
      en: "Drink warm, boiled water (Prasuk Jal) cooled down within 24 hours. Avoid drinking water immediately after meals. Consume half a teaspoon of roasted fennel seeds (saunf) with warm water. Fennel seeds are non-root seeds and highly pure.",
      hi: "प्रासुक जल (विधिपूर्वक उबला हुआ और छना हुआ पानी) का सेवन करें। भोजन के तुरंत बाद पानी न पीएं। भोजन के बाद आधा चम्मच भुनी हुई सौंफ गुनगुने पानी के साथ लें। सौंफ पवित्र और कंद-रहित औषधि है जो पित्त को शांत करती है।"
    },
    dietRules: {
      en: "Strictly avoid eating after sunset (Chauvihar) as night dining slows digestion and increases acid production. Completely avoid raw or cooked root vegetables (onion, garlic, potato) which are heavy to digest and carry infinite microorganisms. Avoid tamarind and vinegar.",
      hi: "सूर्यास्त के बाद भोजन (चौविहार नियम) का पूर्ण त्याग करें, क्योंकि रात्रि में पाचन मंद होता है। आलू, प्याज, लहसुन जैसे जमीकंद का पूर्ण त्याग करें। तीखे, तले हुए और खट्टे खाद्य पदार्थों से दूर रहें।"
    },
    spiritualHeal: {
      en: "Chant the 40th Shloka of the Bhaktamar Stotra, which is traditionally associated with relieving stomach disorders. Recite 'Om Hreem Namah' 108 times daily in a calm posture.",
      hi: "भक्तामर स्तोत्र के 40वें श्लोक का प्रतिदिन श्रद्धापूर्वक पाठ करें, जो पेट के समस्त रोगों को शांत करने में सहायक माना जाता है। 'ॐ ह्रीं नमः' मंत्र की एक माला फेरें।"
    }
  },
  {
    id: "digestive_constipation",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Chronic Constipation", hi: "कब्ज (कोष्ठबद्धता)" },
    symptoms: { en: "Difficulty in bowel movements, bloating, heavy stomach.", hi: "पेट साफ न होना, गैस बनना, पेट में भारीपन।" },
    jainMethod: {
      en: "Drink lukewarm filtered water early in the morning after sunrise. Consume soaked figs (Anjeer) - ensuring they are thoroughly inspected for any small insects (Ahimsa check) - or raisins soaked in boiled water.",
      hi: "सूर्योदय के बाद सुबह-सुबह खाली पेट गुनगुना प्रासुक पानी पीएं। रात में उबले पानी में भिगोए हुए मुनक्के या अच्छी तरह जाँचे हुए अंजीर का सुबह सेवन करें।"
    },
    dietRules: {
      en: "Increase natural fiber by eating pure grains like barley and wheat bran. Avoid Maida (refined flour) and stale food (Basi bhojan), which breeds bacteria within 48 minutes of preparation. Dinner must be completed 2 hours before sleeping, strictly before sunset.",
      hi: "अपने भोजन में चोकरयुक्त आटे की रोटी, हरी सब्जियां (बिना जमीकंद) शामिल करें। मैदा और बासी भोजन का त्याग करें। भोजन बनने के 48 मिनट के भीतर ही ताजा भोजन करें, क्योंकि इसके बाद सूक्ष्म जीवों की उत्पत्ति होने लगती है।"
    },
    spiritualHeal: {
      en: "Recite the Navkar Mahamantra 9 times calmly before sleeping and upon waking up to bring mental peace and balance the body's internal bio-rythms.",
      hi: "सोने से पहले और उठने के तुरंत बाद शांतचित्त होकर 9 बार णमोकार महामंत्र का ध्यान करें, जिससे शरीर की आंतरिक प्रणालियां संतुलित होती हैं।"
    }
  },
  {
    id: "respiratory_cough",
    category: { en: "Respiratory Illnesses", hi: "श्वसन संबंधी रोग" },
    disease: { en: "Cough & Sore Throat", hi: "खांसी और गले में खराश" },
    symptoms: { en: "Throat irritation, dry or wet cough, hoarseness.", hi: "गले में खुजली, सूखी या बलगम वाली खांसी, आवाज बैठना।" },
    jainMethod: {
      en: "Gargle with warm salt water. Brew a mild tea using dry ginger powder (Sonth), dry basil leaves (Tulsi - dry leaves collected without hurting the living plant), and black pepper. Since honey is strictly forbidden (carrying infinite lives and violative of Ahimsa), use dry jaggery (Gur) as a sweetener.",
      hi: "सेंधा नमक मिले गुनगुने पानी से गरारे करें। सूखी अदरक (सोंठ), सूखी तुलसी (गिरे हुए पत्तों से एकत्रित) और काली मिर्च का काढ़ा बनाएं। जैन धर्म में शहद (मधु) महापाप और अनंत जीवों की हिंसा का कारण होने से वर्जित है, अतः मिठास के लिए शुद्ध गुड़ का प्रयोग करें।"
    },
    dietRules: {
      en: "Do not consume cold beverages, ice-creams, or heavy curd. Avoid yogurt entirely at night, as curfew on dairy combinations (Virudh Ahara) is recommended. Avoid wet ginger, use dry ginger (Sonth) which is considered dry and free from continuous living matter.",
      hi: "ठंडी चीजों, फ्रिज के पानी, आइसक्रीम का पूर्ण परहेज रखें। रात में दही का सेवन बिल्कुल न करें। गीली अदरक (सच्चित्त) की जगह सूखी अदरक (अचित्त/सोंठ) का प्रयोग करें, जो जैन मर्यादा के अनुकूल है।"
    },
    spiritualHeal: {
      en: "Chant 'Om Hreem Arham Namah' focusing on the throat chakra, visualizing a pure blue light. Recite the 45th Shloka of Bhaktamar Stotra, renowned for overcoming fears and physical ailments.",
      hi: "कंठ चक्र पर ध्यान केंद्रित करते हुए 'ॐ ह्रीं अर्हं नमः' का जाप करें। भक्तामर स्तोत्र के 45वें श्लोक का पाठ करें जो समस्त असाध्य रोगों और भय से मुक्ति दिलाता है।"
    }
  },
  {
    id: "joint_arthritis",
    category: { en: "Joint Pain & Arthritis", hi: "गठिया एवं जोड़ों का दर्द" },
    disease: { en: "Joint Pain & Arthritis", hi: "जोड़ों का दर्द और यूरिक एसिड" },
    symptoms: { en: "Pain, stiffness, and swelling in joints, difficulty walking.", hi: "जोड़ों में दर्द, अकड़न, सूजन, चलने-फिरने में तकलीफ।" },
    jainMethod: {
      en: "Warm massage with pure sesame oil (til oil) infused with fenugreek seeds (Methi). Drink warm water cooked with dry fenugreek seeds daily. Avoid heavy physical strain but engage in gentle joint movements.",
      hi: "शुद्ध तिल के तेल में मेथी दाना पकाकर जोड़ों की गुनगुनी मालिश करें। प्रतिदिन सुबह खाली पेट रात में भिगोई हुई मेथी का पानी पीएं और मेथी चबाएं।"
    },
    dietRules: {
      en: "Avoid sour substances like tamarind, citrus fruits in excess, and fermented items (such as idli/dosa batter left overnight, which breeds high microbial life). Avoid root vegetables completely as starch from potatoes worsens joint pain and inflammation.",
      hi: "इमली, खट्टी चीजों और खमीर (फर्मेंटेड) वाले भोजन का त्याग करें क्योंकि खमीर में असंख्यात त्रस जीव उत्पन्न होते हैं। आलू और अन्य कंदों का सेवन बंद कर दें, क्योंकि ये वात बढ़ाते हैं और जोड़ों के दर्द को तीव्र करते हैं।"
    },
    spiritualHeal: {
      en: "Chant 'Om Namo Bhagavati Gunavati Parshvanathaya Namah' 108 times daily while visualizing divine golden energy healing the painful joints.",
      hi: "'ॐ नमो भगवती गुणवती पार्श्वनाथाय नमः' मंत्र की एक माला प्रतिदिन फेरें और भावना भाएं कि सभी वेदनीय कर्मों का क्षय हो रहा है।"
    }
  },
  {
    id: "skin_rashes",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Skin Itching & Rashes", hi: "त्वचा में खुजली और चकत्ते" },
    symptoms: { en: "Redness, dry skin, constant itching, irritation.", hi: "त्वचा पर लालिमा, सूखापन, लगातार खुजली और जलन।" },
    jainMethod: {
      en: "Apply pure coconut oil mixed with a tiny pinch of pure dry turmeric (Haldi). Wash the affected area with cooled neem-infused water (prepared by boiling dried neem leaves).",
      hi: "शुद्ध नारियल के तेल में थोड़ी सी पिसी हुई हल्दी मिलाकर प्रभावित स्थान पर लगाएं। उबाले हुए नीम के पानी (अचित्त जल) को ठंडा करके उससे त्वचा को साफ करें।"
    },
    dietRules: {
      en: "Observe Ayambil (eating simple food without oil, ghee, sugar, salt, milk, curd, or green/root vegetables) for 3-5 days to naturally purify the blood. Avoid Virudh Ahara (opposing foods like eating fruits with milk, or salt with milk).",
      hi: "रक्त की शुद्धि के लिए ३ से ५ दिन का 'आयंबिल' तप करें (बिना तेल, घी, शक्कर, नमक, दूध, दही का सादा भोजन)। विरुद्ध आहार (जैसे दूध के साथ नमकीन चीजें या फल खाना) का तत्काल त्याग करें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Rishabhdevaya Namah' or the first stanza of Bhaktamar Stotra to align spiritual energies for healing and physical purification.",
      hi: "'ॐ ऋषभाय नमः' मंत्र का जाप करें। भक्तामर स्तोत्र के प्रथम श्लोक का एकाग्रता से २१ बार पाठ करें।"
    }
  },
  {
    id: "wellness_immunity",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Low Immunity & Seasonal Fever", hi: "कमजोर रोग प्रतिरोधक क्षमता और मौसमी बुखार" },
    symptoms: { en: "Frequent infections, fatigue, low-grade seasonal fever.", hi: "बार-बार बीमार पड़ना, थकान, हल्का बुखार रहना।" },
    jainMethod: {
      en: "Consume a decoction of Giloy dry stems (Guduchi - dry herbs are preferred over wet fresh ones to observe Ahimsa and minimize cellular life injury). Take a light meal of roasted puffed rice (Khila) or simple barley porridge.",
      hi: "सूखी गिलोय का काढ़ा बनाकर गुनगुना पीएं। बुखार की स्थिति में हल्का सुपाच्य भोजन जैसे धान की खीलें या जौ का दलिया लें। शरीर को विश्राम दें।"
    },
    dietRules: {
      en: "Drink only Prasuk Jal (properly boiled water) which remains sterile for 24 hours. Eat fresh meals prepared within 48 minutes. Completely avoid any non-vegetarian traces, gelatin (found in capsules/sweets), and honey. Strict sunset-before dinner is mandatory.",
      hi: "केवल प्रासुक (उबला हुआ) पानी पीएं जो २४ घंटे के लिए जीवाणु-मुक्त रहता है। भोजन बनने के ४८ मिनट के अंदर ताजा और गरम ही ग्रहण करें। शहद, बाजार की मिठाइयां (जिनमें जिलेटिन या केमिकल हो) और रात्रि भोजन का सर्वथा त्याग करें।"
    },
    spiritualHeal: {
      en: "Chant the Navkar Mahamantra with deep meditation on each of the 5 supreme souls (Panch Parmesthi). Cultivate positive thoughts (Bhav Samta) to reduce stress and boost the healing hormones in the body.",
      hi: "णमोकार महामंत्र की ३ या ५ माला 'णमो अरिहंताणं' पद पर विशेष ध्यान देते हुए फेरें। मन में समता भाव रखें क्योंकि राग-द्वेष घटने से शरीर की रोग-प्रतिरोधक क्षमता अत्यंत तीव्र होती है।"
    }
  }
];
