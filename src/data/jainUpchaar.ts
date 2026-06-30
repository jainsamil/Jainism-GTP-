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
    disease: { en: "Skin Itching & Rashes", hi: "त्वचा पर खुजली और लाल चकत्ते" },
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
  },
  {
    id: "sleep_insomnia",
    category: { en: "Sleep & Mind", hi: "नींद और मानसिक रोग" },
    disease: { en: "Insomnia & Lack of Sleep", hi: "अनिद्रा (नींद न आना)" },
    symptoms: { en: "Inability to fall asleep, restless mind, morning headache.", hi: "नींद न आना, मन की चंचलता, सुबह उठने पर सिर में भारीपन।" },
    jainMethod: {
      en: "Massage the soles of your feet with cold-pressed pure sesame oil (til taila) or mustard oil before sleeping. Soak a cotton cloth in cool Prasuk water and keep it on your forehead for 10 minutes to soothe your nervous system.",
      hi: "सोने से पहले पैरों के तलवों में शुद्ध तिल के तेल या सरसों के तेल की हल्की मालिश करें। गुनगुने पानी से पैरों को धोकर अच्छी तरह पोंछ लें। सोने से पहले ठंडे वातावरण में गहरी और लंबी सांस लें।"
    },
    dietRules: {
      en: "Avoid drinking tea, coffee, or hot cocoa in the evening. Keep your dinner extremely light (laghu ahar) and complete it strictly 3 hours before sleep. Avoid eating high-sugar, fermented, or spiced foods in the evening.",
      hi: "शाम के समय चाय या कॉफी का सेवन बिल्कुल न करें। रात्रि भोजन अत्यंत हल्का और सुपाच्य (जैसे दलिया या मूंग की दाल की खिचड़ी) रखें और सोने से कम से कम ३ घंटे पहले भोजन कर लें।"
    },
    spiritualHeal: {
      en: "Practice Kayotsarga (complete body-soul detachment meditation) for 15 minutes before sleeping. Chant 'Om Namah Siddhebhyah' 27 times or listen to the soothing Samayik Path recitation.",
      hi: "सोने से पहले १५ मिनट 'कायोत्सर्ग' (शरीर को शिथिल छोड़कर आत्मा पर ध्यान केंद्रित करना) करें। णमोकार मंत्र का शांत मानसिक स्मरण करें और 'ॐ नमः सिद्धेभ्यः' का २७ बार जाप करें।"
    }
  },
  {
    id: "mind_anxiety",
    category: { en: "Sleep & Mind", hi: "नींद और मानसिक रोग" },
    disease: { en: "Stress & Mental Anxiety", hi: "मानसिक तनाव और अत्यधिक चिंता" },
    symptoms: { en: "Restlessness, racing thoughts, high heart rate, mental fatigue.", hi: "बेचैनी, मन का भटकना, घबराहट, मानसिक थकान।" },
    jainMethod: {
      en: "Perform Pranayama (deep breathing exercises) in a clean, quiet place after sunrise. Drink lukewarm water slowly, sip by sip, sitting in a cross-legged Vajrasana posture.",
      hi: "सूर्योदय के बाद शांत वातावरण में बैठकर प्राणायाम (लंबी गहरी सांस लें और छोड़ें) करें। दिन भर में नियमित अंतराल पर बैठकर गुनगुना पानी घूंट-घूंट करके पीएं।"
    },
    dietRules: {
      en: "Strictly avoid non-vegetarian foods, stale meals, and chemical-heavy processed foods which contain Rajasic/Tamasic qualities that disturb mental peace. Consume fresh seasonal fruits (excluding root vegetables) and grains.",
      hi: "तले-भुने, खमीरयुक्त और तीखे मसालों से परहेज करें जो विचारों में उत्तेजना बढ़ाते हैं। ताजे और सात्विक आहार का सेवन करें, कंदमूल और बासी भोजन विचारों में तामसिकता बढ़ाते हैं।"
    },
    spiritualHeal: {
      en: "Meditate on the 'Anupreksha' (reflections on the twelve transient truths of life). Recite the Logassa Sutra 3 times daily to release karmic stress and invoke inner tranquility.",
      hi: "प्रतिदिन १२ भावनाओं (अनित्यादि अनुप्रेक्षा) का चिंतन करें। 'लोगस्स' सूत्र का ३ बार शांत चित्त से पाठ करें, जिससे मानसिक तरंगें शांत होती हैं और ध्यान की गहराई बढ़ती है।"
    }
  },
  {
    id: "head_migraine",
    category: { en: "Headaches & Nerves", hi: "सिरदर्द और तंत्रिका रोग" },
    disease: { en: "Migraine & Chronic Headache", hi: "माइग्रेन और पुराना सिरदर्द" },
    symptoms: { en: "Throbbing pain in one side of the head, sensitivity to light/sound.", hi: "सिर के एक तरफ तेज टीस मारता दर्द, रोशनी और आवाज से परेशानी।" },
    jainMethod: {
      en: "Inhale the steam of water boiled with fennel seeds and dry ginger. Apply a cold compress (using a pure cotton cloth soaked in cold Prasuk water) to the back of the neck and forehead.",
      hi: "सोंठ और सौंफ उबले हुए पानी की भाप लें। सूती कपड़े को ठंडे पानी में भिगोकर माथे और गर्दन के पिछले हिस्से पर १० मिनट रखें। तेज धूप और अत्यधिक शोर-शराबे वाले स्थानों से बचें।"
    },
    dietRules: {
      en: "Never skip meals, as fasting without proper hydration can trigger migraine attacks. Keep your body alkali-rich by consuming bottle gourd (Lauki) soup and avoiding stale food, citrus fruits, and tea.",
      hi: "भोजन का समय निश्चित रखें, भूखे पेट रहने से पित्त बढ़ता है जो सिरदर्द का कारण बनता है। लौकी का सूप लें। बासी भोजन, तीखे मिर्च-मसाले और अत्यधिक खट्टी चीजों से परहेज रखें।"
    },
    spiritualHeal: {
      en: "Chant the 36th Shloka of the Bhaktamar Stotra, which is historically recited to alleviate severe neural pains and headaches. Recite 'Om Hreem Namo Siddhanam' 108 times.",
      hi: "भक्तामर स्तोत्र के 36वें श्लोक का श्रद्धापूर्वक २१ बार पाठ करें। 'ॐ ह्रीं णमो सिद्धाणं' मंत्र का जाप करते हुए मस्तक पर सकारात्मक ऊर्जा का ध्यान करें।"
    }
  },
  {
    id: "oral_toothache",
    category: { en: "Dental & Oral Care", hi: "दांत और मुख रोग" },
    disease: { en: "Toothache & Gum Bleeding", hi: "दांत का दर्द और मसूड़ों से खून आना" },
    symptoms: { en: "Sharp dental pain, swollen gums, blood while brushing.", hi: "दांतों में तेज दर्द, मसूड़ों में सूजन, ब्रश करते समय खून आना।" },
    jainMethod: {
      en: "Gargle with warm saline water mixed with a pinch of pure alum (Phitkari). Place a single piece of dried clove (Laung) or dab a tiny drop of pure clove oil on the affected tooth. Clove is an ahimsak natural pain reliever.",
      hi: "गुनगुने पानी में थोड़ा सा सेंधा नमक और फिटकरी मिलाकर दिन में ३-४ बार कुल्ला करें। दर्द वाले दांत के नीचे एक अचित्त लौंग दबाकर रखें। मसूड़ों पर उंगली से हल्के हाथ से शुद्ध सरसों के तेल और फिटकरी के पाउडर की मालिश करें।"
    },
    dietRules: {
      en: "Avoid extremely hot or ice-cold food items that cause sensitivity. Completely avoid commercial candies containing animal gelatins or non-disclosed chemicals. Wash your mouth thoroughly after eating any meal.",
      hi: "अत्यधिक ठंडी या गर्म चीजों का सेवन बंद करें। चीनी वाली मिठाइयों और चॉकलेट का त्याग करें जो दांतों में चिपककर सड़न पैदा करती हैं। हर भोजन के बाद कुल्ला जरूर करें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Namo Jinendra Roopaya Namah' 108 times to direct mindful healing and positive waves toward physical comfort and dental relief.",
      hi: "'ॐ नमः श्री जिनेन्द्राय' मंत्र का १०८ बार जाप करें और अपने दांतों की पीड़ा को शांत होने की मानसिक भावना व्यक्त करें।"
    }
  },
  {
    id: "hair_fall",
    category: { en: "Hair & Scalp", hi: "केश और स्कैल्प स्वास्थ्य" },
    disease: { en: "Hair Fall & Dandruff", hi: "बालों का झड़ना और रूसी (डैंड्रफ)" },
    symptoms: { en: "Excessive hair shedding, itchy scalp, dry white flakes.", hi: "तेजी से बालों का टूटना, सिर में खुजली, सूखी सफेद पपड़ी निकलना।" },
    jainMethod: {
      en: "Apply pure, unperfumed cold-pressed coconut oil infused with dried curry leaves and dried gooseberry (Amla) powder. Massage gently with fingertips only after sunrise.",
      hi: "शुद्ध नारियल तेल में सूखे आंवले और करी पत्ते को मंद आंच पर पकाकर तेल तैयार करें। इस तेल से सिर की त्वचा पर हल्के हाथों से मालिश करें। प्राकृतिक रीठा और शिकाकाई से बाल धोएं।"
    },
    dietRules: {
      en: "Improve your gut health by avoiding processed sugars, white bread, and night meals. Increase intake of iron-rich black sesame seeds and pure pulses. Strictly avoid root vegetables and chemically-treated tap water.",
      hi: "मैदा, चीनी और बाहर के जंक फूड का त्याग करें। लोहे की कढ़ाई में पकाया हुआ सात्विक भोजन लें। काले तिल और अंकुरित अनाज (मर्यादित अवधि के भीतर) का सेवन करें।"
    },
    spiritualHeal: {
      en: "Recite the Bhaktamar Stotra's 11th Shloka daily, visualizing hair health and bodily rejuvenation through the radiance of the supreme Jain Tirthankars.",
      hi: "भक्तामर स्तोत्र के 11वें श्लोक का प्रतिदिन ११ बार शांत मन से पाठ करें। शारीरिक कांति और आरोग्यता के लिए णमोकार मंत्र का मानसिक ध्यान धरें।"
    }
  },
  {
    id: "eye_strain",
    category: { en: "Eye Care & Vision", hi: "नेत्र रोग और दृष्टि" },
    disease: { en: "Eye Strain & Weak Vision", hi: "आंखों की थकान और कमजोर दृष्टि" },
    symptoms: { en: "Dry eyes, blurry vision, headache after screen use, watery eyes.", hi: "आंखों में सूखापन, धुंधला दिखाई देना, लगातार मोबाइल/स्क्रीन देखने से दर्द।" },
    jainMethod: {
      en: "Splash your closed eyes gently with cool, pure Prasuk water multiple times a day. Practice the 'Tratak' meditation technique by focusing on a pure oil lamp's flame (Ahimsa cotton wick lamp) in a dark room.",
      hi: "सुबह उठकर मुंह में प्रासुक ठंडा पानी भरकर आंखों पर ठंडे पानी के छींटे मारें। रात्रि के समय शुद्ध घी या तिल के तेल के दीपक (अहिंसक बत्ती) की लौ पर २-३ मिनट त्राटक (बिना पलक झपकाए ध्यान) करें।"
    },
    dietRules: {
      en: "Incorporate non-root green vegetables like bottle gourd, ridge gourd, and pure cow ghee into your diet. Strictly avoid eating after dark which increases retinal strain and disturbs optical rest cycles.",
      hi: "जमीकंद (आलू, प्याज) का पूर्ण त्याग करें क्योंकि ये आंखों की ज्योति मंद करते हैं। हरी सब्जियां जैसे गिलकी, तौरी, लौकी खाएं। रात को देर से भोजन करने की आदत का पूर्ण त्याग करें।"
    },
    spiritualHeal: {
      en: "Recite 'Om Namo Chakkhudayanam' (Salutations to the Givers of Vision) 108 times daily. Focus on the third-eye chakra to elevate spiritual and sensory awareness.",
      hi: "'ॐ ह्रीं णमो चक्खुदयाणं' (नेत्र ज्योति प्रदाताओं को नमन) मंत्र की प्रतिदिन एक माला फेरें, जिससे नेत्र दोष दूर होने में सहायता मिलती है।"
    }
  },
  {
    id: "oral_ulcers",
    category: { en: "Dental & Oral Care", hi: "दांत और मुख रोग" },
    disease: { en: "Mouth Ulcers", hi: "मुंह के छाले" },
    symptoms: { en: "Painful sores inside the cheeks, lips, or tongue; difficulty eating.", hi: "गाल के अंदर, होठों या जीभ पर दर्दनाक घाव; खाने-पीने में जलन होना।" },
    jainMethod: {
      en: "Apply a tiny amount of pure ghee or coconut oil mixed with a pinch of licorice (Mulethi) powder directly on the ulcers. Rinse the mouth with warm, boiled water with added rock salt (Sendha Namak).",
      hi: "शुद्ध गाय के घी या नारियल के तेल में थोड़ी सी मुलेठी का चूर्ण मिलाकर छालों पर लगाएं। गुनगुने प्रासुक पानी में चुटकी भर सेंधा नमक मिलाकर दिन में २-३ बार कुल्ला करें।"
    },
    dietRules: {
      en: "Avoid spicy, sour, fried, and fermented foods which aggravate body heat (Pitta). Eat simple boiled rice or mung dal gruel cooled to room temperature.",
      hi: "तीखे मसालों, मिर्च, अचार, इमली और तले हुए गरिष्ठ भोजन का पूरी तरह परहेज करें। मूंग की दाल की पतली खिचड़ी या सादा दलिया (बिना गरम किए, गुनगुना) लें।"
    },
    spiritualHeal: {
      en: "Chant the 25th Shloka of the Bhaktamar Stotra to relieve internal heat and physical discomfort. Meditate on the coolness of Chandra (the Moon).",
      hi: "शरीर की आंतरिक तपन और वेदना को शांत करने के लिए भक्तामर स्तोत्र के 25वें श्लोक का २१ बार श्रद्धापूर्वक पाठ करें।"
    }
  },
  {
    id: "digestive_gas",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Indigestion & Flatulence", hi: "अपच और पेट की गैस" },
    symptoms: { en: "Bloating, stomach pain, gas release, loss of appetite.", hi: "पेट फूलना, पेट दर्द, लगातार गैस बनना, भूख न लगना।" },
    jainMethod: {
      en: "Drink lukewarm water infused with dry roasted carom seeds (Ajwain) and a pinch of black salt. Chew on a small piece of dry ginger (Sonth) after meals.",
      hi: "आधा चम्मच भुनी हुई अजवाइन और एक चुटकी काला नमक गुनगुने प्रासुक पानी के साथ लें। भोजन के उपरांत सूखी अदरक (सोंठ) के छोटे टुकड़े को मुंह में रखकर चूसें।"
    },
    dietRules: {
      en: "Avoid drinking water during or immediately after meals (wait for 48 minutes). Eliminate root vegetables and heavy lentils like Rajma or Chana at night.",
      hi: "भोजन के समय और भोजन के तुरंत बाद पानी न पीएं (भोजन के ४८ मिनट बाद पानी लें)। उड़द, राजमा, छोले जैसी भारी दालें और कंदमूल का त्याग करें।"
    },
    spiritualHeal: {
      en: "Recite the Uvasaggaharam Stotra daily to remove internal obstacles and restore energetic balance within the stomach's solar plexus.",
      hi: "शरीर के विकारों और कष्टों के निवारण हेतु प्रतिदिन तीन बार श्रद्धापूर्वक 'उवसग्गहरं स्तोत्र' का पाठ करें।"
    }
  },
  {
    id: "weight_obesity",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Obesity & Weight Management", hi: "मोटापा और वजन नियंत्रण" },
    symptoms: { en: "Excess body fat, sluggishness, shortness of breath on exertion.", hi: "शरीर का अत्यधिक वजन, आलस्य रहना, थोड़ी सी मेहनत में सांस फूलना।" },
    jainMethod: {
      en: "Practice regular brisk walking and gentle yoga before sunrise or after sunset (during daylight hours). Drink warm lemon-water (with non-root sweetener like organic jaggery) after sunrise.",
      hi: "सूर्योदय के बाद और सूर्यास्त के पहले नियमित रूप से तेज चलें या योगासन करें। सुबह खाली पेट गुनगुने पानी में नींबू निचोड़कर (बिना शहद के, गुड़ के साथ) सेवन करें।"
    },
    dietRules: {
      en: "Strictly implement Chauvihar (no food/water after sunset). Limit your grains and avoid deep-fried foods, white sugar, potatoes, and other starch-heavy root vegetables.",
      hi: "कठोरता से 'चौविहार' व्रत का पालन करें (सूर्यास्त के बाद पानी भी न पीएं)। चीनी, मैदा, घी, तेल और आलू जैसी कंदमूल वाली कैलोरी-युक्त चीजों का पूर्ण त्याग करें।"
    },
    spiritualHeal: {
      en: "Perform 'Ekasana' (eating only once a day in a single sitting) or 'Ayambil' tap once a week to burn physical impurities and dissolve heavy karmas.",
      hi: "सप्ताह में एक बार 'एकासन' (दिन में एक बार भोजन) या 'उपवास' तप करें, जिससे शारीरिक मेद घटता है और आध्यात्मिक बल बढ़ता है।"
    }
  },
  {
    id: "wellness_fatigue",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Chronic Fatigue & Weakness", hi: "थकान और शारीरिक कमजोरी" },
    symptoms: { en: "Lack of energy, constant sleepiness, muscle weakness, slow recovery.", hi: "शरीर में ऊर्जा की कमी, हर समय आलस्य आना, कमजोरी महसूस होना।" },
    jainMethod: {
      en: "Consume almonds, walnuts, and dates soaked overnight in boiled water (ensure they are physically checked for tiny pests to maintain Ahimsa). Take a daily dose of dry ginger and cardamom powder in warm plant milk.",
      hi: "रात को उबले पानी में भिगोए हुए बादाम और अखरोट (अच्छी तरह देखकर) सुबह चबाकर खाएं। सूखी अदरक (सोंठ) और इलायची के पाउडर का गुनगुने दूध के साथ सेवन करें।"
    },
    dietRules: {
      en: "Avoid eating stale, processed, or cold food. Stick to freshly cooked hot meals (prepared within 48 minutes). Stay hydrated with warm boiled water (Prasuk Jal).",
      hi: "बासी भोजन (४८ मिनट से पुराना पका भोजन) और फ्रिज की ठंडी चीजों का सर्वथा त्याग करें। ताजा, शुद्ध और गर्म भोजन ही ग्रहण करें जो ऊर्जा प्रदान करता है।"
    },
    spiritualHeal: {
      en: "Recite the Navkar Mantra 108 times daily facing East during sunrise to absorb cosmic solar energy and vitalize your spiritual and physical body.",
      hi: "सूर्योदय के समय पूर्व दिशा की ओर मुंह करके णमोकार महामंत्र की एक माला फेरें, जिससे शरीर में सकारात्मक प्राण ऊर्जा का प्रवाह होता है।"
    }
  },
  {
    id: "respiratory_cold",
    category: { en: "Respiratory Illnesses", hi: "श्वसन संबंधी रोग" },
    disease: { en: "Common Cold & Runny Nose", hi: "जुकाम और बहती नाक" },
    symptoms: { en: "Nasal congestion, watery eyes, sneezing, light head weight.", hi: "नाक बंद होना, छींकें आना, आंखों से पानी बहना, सिर में भारीपन।" },
    jainMethod: {
      en: "Inhale steam from water boiled with dried mint (Pudina) leaves and carom seeds (Ajwain). Drink warm water infused with dry ginger powder (Sonth) and black pepper.",
      hi: "उबलते हुए पानी में अजवाइन और सूखी पुदीना पत्ती डालकर उसकी भाप लें। सूखी अदरक (सोंठ), काली मिर्च और मिश्री का काढ़ा बनाकर गुनगुना पीएं।"
    },
    dietRules: {
      en: "Avoid cold dairy products, bananas, citrus juices, and heavy sweets. Keep dinner light and consume it warm before sunset. Avoid wet raw ginger (which has infinite lives), use dry ginger instead.",
      hi: "ठंडे पेय, फ्रिज का पानी, दही, केला और खट्टे फलों का परहेज करें। गीली अदरक की जगह मर्यादा के अनुसार सूखी अदरक (सोंठ) का ही प्रयोग करें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Hreem Namo Siddhanam' 108 times daily focusing on your sinus area, visualizing healing white divine light clearing the blockage.",
      hi: "'ॐ ह्रीं णमो सिद्धाणं' मंत्र का १०८ बार मानसिक जाप करें और सिर तथा नासिका क्षेत्र में पवित्र श्वेत प्रकाश का ध्यान करें।"
    }
  },
  {
    id: "urinary_stones",
    category: { en: "Kidney & Urinary", hi: "गुर्दे और मूत्र रोग" },
    disease: { en: "Kidney Stones", hi: "गुर्दे की पथरी (पथरी)" },
    symptoms: { en: "Severe pain in lower back or side, painful urination, pink/cloudy urine.", hi: "पीठ के निचले हिस्से या बगल में असहनीय दर्द, पेशाब में जलन या दर्द।" },
    jainMethod: {
      en: "Drink plenty of Prasuk lukewarm water. Drink water boiled with barley (Jau) seeds daily. Avoid calcium-heavy supplements unless advised by an ethical physician.",
      hi: "नियमित अंतराल पर भरपूर मात्रा में गुनगुना प्रासुक जल पीएं। जौ (यव) को पानी में उबालकर छाने हुए पानी का दिन में २-३ बार सेवन करें, जो पथरी को गलाता है।"
    },
    dietRules: {
      en: "Strictly avoid seeds of vegetables like tomatoes, cucumbers, and brinjal. Avoid spinach, root vegetables, and carbonated soft drinks completely.",
      hi: "टमाटर, बैंगन, भिंडी और खीरे जैसी बीज-युक्त सब्जियों का त्याग करें। आलू, शकरकंद जैसे जमीकंद और कोल्ड ड्रिंक्स का सेवन बिल्कुल न करें।"
    },
    spiritualHeal: {
      en: "Chant the 45th Shloka of the Bhaktamar Stotra, which is traditional for curing severe inner body aches and chronic ailments. Recite 'Om Hreem Arham Namah'.",
      hi: "भक्तामर स्तोत्र के 45वें श्लोक का प्रतिदिन २७ बार शांत आसन में बैठकर पाठ करें। मस्तक में भगवान पार्श्वनाथ का ध्यान धरें।"
    }
  },
  {
    id: "cardio_hypertension",
    category: { en: "Heart & Blood Pressure", hi: "हृदय और रक्तचाप" },
    disease: { en: "High Blood Pressure", hi: "उच्च रक्तचाप (हाइपरटेंशन)" },
    symptoms: { en: "Headache, dizziness, shortness of breath, chest discomfort, anxiety.", hi: "सिरदर्द, चक्कर आना, घबराहट, सांस फूलना, सीने में भारीपन।" },
    jainMethod: {
      en: "Drink lukewarm water from a pure clay pot (boiled first, then cooled). Practice slow deep breathing (Anulom Vilom) for 15 minutes in a calm, non-violent environment.",
      hi: "मिट्टी के मटके का उबला और ठंडा किया हुआ जल पीएं। शांत चित्त होकर रोज सुबह १५ मिनट अनुलोम-विलोम प्राणायाम का अभ्यास करें।"
    },
    dietRules: {
      en: "Strictly minimize white salt (use small quantities of rock salt/Sendha Namak). Avoid highly oily, spicy food and processed pickles. Completely eliminate root vegetables like onion and garlic which aggravate blood pressure.",
      hi: "भोजन में सफेद नमक की मात्रा कम करें, सेंधा नमक का ही प्रयोग करें। प्याज, लहसुन जैसे जमीकंद का पूर्ण त्याग करें, क्योंकि ये उत्तेजना बढ़ाते हैं और रक्तचाप को अनियंत्रित करते हैं।"
    },
    spiritualHeal: {
      en: "Listen to or chant the 'Bhaktamar Stotra' Shloka 20 daily. Cultivate 'Maître Bhav' (friendship towards all living beings) which chemically reduces stress hormones.",
      hi: "भक्तामर स्तोत्र के 20वें श्लोक का शांत भाव से पाठ करें। सभी जीवों के प्रति 'मैत्री भाव' का चिंतन करें, जिससे मन शांत होता है और रक्तचाप सामान्य होता है।"
    }
  },
  {
    id: "cardio_hypotension",
    category: { en: "Heart & Blood Pressure", hi: "हृदय और रक्तचाप" },
    disease: { en: "Low Blood Pressure", hi: "निम्न रक्तचाप (लो बीपी)" },
    symptoms: { en: "Dizziness, fainting, blurred vision, cold skin, fatigue.", hi: "चक्कर आना, कमजोरी से आंखों के आगे अंधेरा छाना, हाथ-पैर ठंडे पड़ना।" },
    jainMethod: {
      en: "Consume a drink of lukewarm water mixed with a pinch of rock salt and organic lemon juice. Chew on dry raisins (Kishmish - inspected carefully) daily.",
      hi: "गुनगुने प्रासुक पानी में नींबू का रस, चुटकी भर सेंधा नमक और थोड़ी मिश्री मिलाकर धीरे-धीरे पीएं। रात में भिगोए हुए १५ मुनक्के (साफ किए हुए) चबाकर खाएं।"
    },
    dietRules: {
      en: "Avoid fasting or skipping meals (observe mild, non-exhausting dietary penances only). Ensure timely meals before sunset. Eat nutrient-rich legumes and whole grains.",
      hi: "लंबे समय तक भूखे न रहें। भोजन नियमित समय पर, विशेषकर सूर्यास्त के पहले अवश्य करें। अनाज और दालों से युक्त सुपाच्य पोषक भोजन लें।"
    },
    spiritualHeal: {
      en: "Chant the Navkar Mahamantra 27 times daily with breath synchronization (inhale on 'Namo Arihantanam', exhale on 'Namo Siddhanam') to stabilize the nervous system.",
      hi: "सांसों के नियंत्रण के साथ २७ बार णमोकार मंत्र का जाप करें। सांस भरते हुए 'णमो अरिहंताणं' और छोड़ते हुए 'णमो सिद्धाणं' का ध्यान करें।"
    }
  },
  {
    id: "respiratory_asthma",
    category: { en: "Respiratory Illnesses", hi: "श्वसन संबंधी रोग" },
    disease: { en: "Asthma & Breathing Difficulty", hi: "दमा और सांस लेने में तकलीफ" },
    symptoms: { en: "Wheezing, coughing, shortness of breath, chest tightness.", hi: "सांस फूलना, छाती में जकड़न, सांस लेते समय सीटी जैसी आवाज आना।" },
    jainMethod: {
      en: "Take warm sesame oil massage on the chest followed by hot fermentation using a clean cotton cloth. Inhale steam of water boiled with carom seeds (Ajwain).",
      hi: "गुनगुने तिल के तेल से छाती और पीठ की मालिश करें। सूती कपड़े को गर्म तवे पर हल्का गर्म करके छाती की सिकाई करें। अजवाइन उबले पानी की भाप लें।"
    },
    dietRules: {
      en: "Avoid heavy, oily, and cold foods. Completely ban cold drinks, curd at night, ice creams, and highly processed foods. Eat light hot porridge or soup before sunset.",
      hi: "ठंडी तासीर वाले भोजन, ठंडे पानी, रात में दही, चावल और केले का सख्त परहेज रखें। शाम को सूर्यास्त के पहले मूंग दाल का सूप या पतला दलिया गर्म-गर्म लें।"
    },
    spiritualHeal: {
      en: "Recite the 43rd Shloka of the Bhaktamar Stotra, traditionally believed to cure severe chest and respiratory disorders. Meditate on the pure blue throat chakra.",
      hi: "भक्तामर स्तोत्र के 43वें श्लोक का २७ बार श्रद्धापूर्वक पाठ करें। फेफड़ों और श्वास नली में स्वस्थ प्राणवायु के संचार की भावना भाएं।"
    }
  },
  {
    id: "wellness_heatstroke",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Heat Stroke & Sun Exhaustion", hi: "लू लगना (ग्रीष्मकालीन बुखार)" },
    symptoms: { en: "High body temperature, dry skin, heavy headache, nausea, dizziness.", hi: "तेज बुखार, चक्कर आना, सिर में भयंकर दर्द, शरीर का तपना, अत्यधिक प्यास।" },
    jainMethod: {
      en: "Apply a cold compress using a clean cotton cloth soaked in cool Prasuk water onto the forehead, chest, and soles of the feet. Drink water infused with coriander seeds and cumin seeds.",
      hi: "पीड़ित व्यक्ति को छांव में लिटाकर माथे, छाती और हाथ-पैरों के तलवों पर ठंडे प्रासुक जल की पट्टी रखें। सौंफ, जीरा और धनिए के बीज का उबला और ठंडा किया पानी पिलाएं।"
    },
    dietRules: {
      en: "Drink freshly prepared buttermilk (Chhas - within 48 minutes of preparation to avoid micro-organism growth). Avoid heavy meals, fried snacks, and caffeine.",
      hi: "ताजा बनी छाछ (बिना फर्मेंटेड, ४८ मिनट के भीतर बनी हुई) में भुना जीरा और सेंधा नमक डालकर पीएं। खट्टे, तीखे और भारी भोजन का पूरी तरह त्याग करें।"
    },
    spiritualHeal: {
      en: "Recite the Coolant Mantra: 'Om Hreem Namo Siddhanam' while visualizing cool white lunar light descending upon your head and soothing your body.",
      hi: "'ॐ ह्रीं णमो सिद्धाणं' मंत्र का जाप करते हुए भावना भाएं कि मस्तक पर शीतल चन्द्रमा की किरणें बरस रही हैं और शरीर शांत हो रहा है।"
    }
  },
  {
    id: "endocrine_diabetes",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Diabetes & Blood Sugar Control", hi: "मधुमेह (डायबिटीज)" },
    symptoms: { en: "Frequent urination, increased thirst, unexplained weight loss, fatigue.", hi: "बार-बार पेशाब आना, अत्यधिक प्यास लगना, थकान रहना, वजन कम होना।" },
    jainMethod: {
      en: "Consume dry fenugreek seed (Methi) powder with lukewarm water daily before sunrise. Walk for 45 minutes daily. Practice yoga postures like Mandukasana.",
      hi: "रोज सुबह सूर्योदय के तुरंत बाद गुनगुने पानी के साथ आधा चम्मच सूखी मेथी दाने का चूर्ण लें। सुबह-शाम टहलने की आदत डालें और योग में मांडूकासन का अभ्यास करें।"
    },
    dietRules: {
      en: "Strictly avoid sugar, potatoes, sweet potato, carrots, and other root vegetables. Avoid heavy wheat flour; instead, use multi-grain flour consisting of barley, chickpeas, and millet.",
      hi: "मीठी चीजों, चीनी और आलू, शकरकंद जैसे जमीन के नीचे उगने वाले कंदमूल का पूर्ण त्याग करें। गेहूं की जगह जौ, चना और बाजरा मिश्रित आटे की चपाती लें।"
    },
    spiritualHeal: {
      en: "Chant the Navkar Mahamantra 108 times daily to balance bodily metabolic pathways. Practice self-control and mindfulness during food intake.",
      hi: "प्रतिदिन णमोकार मंत्र की माला फेरते हुए संयम और तप की भावना भाएं, क्योंकि मानसिक संयम रक्त शर्करा को संतुलित रखने में अत्यधिक सहायक है।"
    }
  },
  {
    id: "vocal_hoarseness",
    category: { en: "Respiratory Illnesses", hi: "श्वसन संबंधी रोग" },
    disease: { en: "Throat Hoarseness & Loss of Voice", hi: "गले का बैठना और आवाज रुकना" },
    symptoms: { en: "Difficulty speaking, raspy voice, sore vocal cords, dry throat.", hi: "बोलने में तकलीफ, आवाज में भारीपन, गले में सूखापन और चुभन।" },
    jainMethod: {
      en: "Suck slowly on a small piece of licorice root (Mulethi - checked for cleanliness) or chew a single black pepper with dry jaggery (Gur). Drink lukewarm Prasuk water.",
      hi: "मुलेठी की छोटी सी लकड़ी का टुकड़ा मुंह में रखकर चूसें, या एक काली मिर्च को गुड़ के साथ चबाएं। गुनगुने प्रासुक पानी से दिन में तीन बार गरारे करें।"
    },
    dietRules: {
      en: "Strictly avoid dry, fried foods, sour citrus fruits, cold water, and curd. Avoid any fermented batter. Consume warm, moist barley porridge.",
      hi: "ठंडी चीजों, खट्टी इमली, नींबू, दही, और तले हुए रूखे भोजन से पूरी तरह दूर रहें। भोजन में गर्म और सुपाच्य दलिया या खिचड़ी का ही सेवन करें।"
    },
    spiritualHeal: {
      en: "Chant the 25th Shloka of the Bhaktamar Stotra, associated with speech clarity and vocal healing. Recite 'Om Namo Jinaya' silently in your throat.",
      hi: "गले की ग्रंथियों और स्वर यंत्र की हीलिंग के लिए भक्तामर स्तोत्र के 25वें श्लोक का २१ बार पाठ करें। कंठ में सरस्वती चक्र का ध्यान धरें।"
    }
  },
  {
    id: "blood_anemia",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Anemia & Iron Deficiency", hi: "खून की कमी (एनीमिया)" },
    symptoms: { en: "Pale skin, fatigue, cold hands and feet, shortness of breath, dizziness.", hi: "त्वचा का पीलापन, हर समय कमजोरी और थकान, चक्कर आना, सांस फूलना।" },
    jainMethod: {
      en: "Drink water boiled and kept in iron vessels (Prasuk iron water). Consume pomegranate (Anar) juice prepared freshly under strict hygienic standards.",
      hi: "लोहे के पात्र में उबले हुए पानी का सेवन करें। ताजे लाल अनार के दाने निकालकर निकाला हुआ मर्यादित रस पीएं। भोजन बनाने के लिए लोहे की कढ़ाई का प्रयोग करें।"
    },
    dietRules: {
      en: "Avoid drinking tea or coffee with or after meals as it blocks iron absorption. Eat dark leafy vegetables (like spinach - properly washed and checked for caterpillars) and sesame seeds.",
      hi: "भोजन के तुरंत बाद चाय या कॉफी न पीएं क्योंकि यह शरीर में आयरन सोखने की क्षमता को रोकता है। चौलाई, बथुआ जैसी हरी पत्तेदार सब्जियां और तिल का सेवन बढ़ाएं।"
    },
    spiritualHeal: {
      en: "Recite the Navkar Mahamantra with visualization of radiant red light entering your bone marrow and spleen to stimulate blood production.",
      hi: "णमोकार महामंत्र का जाप करते हुए अपने हृदय क्षेत्र में उगते हुए लाल सूर्य के तेज का ध्यान करें, जिससे शरीर में नव-रक्त का संचार होता है।"
    }
  },
  {
    id: "muscular_cramps",
    category: { en: "Joint Pain & Arthritis", hi: "गठिया एवं जोड़ों का दर्द" },
    disease: { en: "Muscle Cramps & Spasms", hi: "मांसपेशियों में खिंचाव और ऐंठन (क्रैम्प्स)" },
    symptoms: { en: "Sudden sharp pain in calf muscles, stiffness, locked muscle.", hi: "पिंडलियों या पैरों की मांसपेशियों में अचानक तेज खिंचाव और भयंकर दर्द।" },
    jainMethod: {
      en: "Apply a warm compress using a salt bag (clean rock salt heated in a dry cloth pouch). Gently massage with pure warm sesame oil after the spasm subsides.",
      hi: "एक सूती पोटली में सेंधा नमक भरकर तवे पर गर्म करें और उससे प्रभावित मांसपेशियों की सिकाई करें। खिंचाव शांत होने पर गुनगुने तिल के तेल से मालिश करें।"
    },
    dietRules: {
      en: "Ensure adequate intake of magnesium-rich grains and rock salt in meals. Avoid dehydration; drink warm Prasuk water with a pinch of salt. Avoid sour curd and stale food.",
      hi: "शरीर में पानी की कमी न होने दें, नियमित गुनगुना प्रासुक जल पीएं। मैदे और डिब्बाबंद भोजन का सर्वथा त्याग करें। आहार में सेंधा नमक का ही प्रयोग करें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Namah Siddhebhyah' 27 times to release tension in physical fibers. Practice deep relaxation (Kayotsarga) to calm muscular tension.",
      hi: "आराम से लेटकर 'कायोत्सर्ग' मुद्रा में पूरे शरीर को ढीला छोड़ें और २७ बार णमोकार मंत्र का जाप करके मांसपेशियों को शिथिल होने का निर्देश दें।"
    }
  },
  {
    id: "skin_acne",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Skin Acne & Pimples", hi: "कील-मुंहासे (एक्ने) और फुंसियां" },
    symptoms: { en: "Red inflamed bumps on face, oily skin, blackheads.", hi: "चेहरे पर लाल सूजे हुए दाने होना, तैलीय त्वचा, दाग-धब्बे।" },
    jainMethod: {
      en: "Apply a paste of pure sandalwood (Chandan) powder mixed with rose water (made of dry rose petals) on acne. Sandalwood has a cooling, non-violent effect.",
      hi: "शुद्ध चंदन की लकड़ी को घिसकर या चंदन पाउडर को गुलाब जल में मिलाकर चेहरे पर लगाएं। चंदन की शीतलता मुंहासों की सूजन और बैक्टीरिया को शांत करती है।"
    },
    dietRules: {
      en: "Avoid greasy, heavy, fried foods and refined sugar. Eliminate root vegetables like potato, carrot, onion, and garlic. Take simple boiled and lightly spiced meals.",
      hi: "तले-भुने भोजन, घी, तेल और रिफाइंड चीनी का त्याग करें। आलू, शकरकंद जैसे जमीकंद का सेवन बंद कर दें, क्योंकि ये रक्त को अशुद्ध करते हैं और मुंहासे बढ़ाते हैं।"
    },
    spiritualHeal: {
      en: "Recite 'Om Namah Arham' focusing on beauty of the soul rather than physical illusion. Chant Shloka 1 of Bhaktamar Stotra for overall radiance.",
      hi: "'ॐ नमः अर्हं' मंत्र का जाप करें। मन में आत्मिक सुंदरता के प्रति आदर भाव रखें, जिससे मानसिक शांति मिलती है और त्वचा स्वतः कांतिमय होती है।"
    }
  },
  {
    id: "skin_burns",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Minor Burn Wounds", hi: "मामूली जलन या जलना" },
    symptoms: { en: "Redness, pain, minor blistering, heat sensation.", hi: "त्वचा का लाल होना, जलन होना, हल्के छाले पड़ना।" },
    jainMethod: {
      en: "Immediately pour cool Prasuk water continuously over the burn area. Apply pure virgin coconut oil or raw grated bottle gourd (Lauki) pulp (cooling agent).",
      hi: "जले हुए स्थान पर तत्काल ठंडा प्रासुक पानी लगातार डालें। इसके बाद शुद्ध नारियल का तेल लगाएं या ठंडी लौकी का गूदा घिसकर वहां रखें, जो तुरंत ठंडक देगा।"
    },
    dietRules: {
      en: "Eat coolant foods like barley, bottle gourd, and melon. Avoid sour, hot spices, chili, and garlic/onion, which increase internal body heat (Pitta).",
      hi: "तीखे मसालों, गर्म चाय-कॉफी और खट्टी चीजों का परहेज करें। भोजन में लौकी की सब्जी, जौ का दलिया और ठंडा सादा प्रासुक आहार लें।"
    },
    spiritualHeal: {
      en: "Chant the cooling 'Om Hreem Shanti-nathaya Namah' 108 times to immediately alleviate the burning pain and restore peace to the physical nervous system.",
      hi: "तीव्र पीड़ा को शांत करने के लिए 'ॐ ह्रीं शांतिनाथाय नमः' मंत्र का जाप करें। शांतिनाथ भगवान के शांत स्वरूप का हृदय में स्मरण करें।"
    }
  },
  {
    id: "digestive_vomiting",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Vomiting & Nausea", hi: "उल्टी और जी मिचलाना" },
    symptoms: { en: "Feeling of sickness in stomach, retching, vomiting.", hi: "पेट में बेचैनी, बार-बार उल्टी होना, जी घबराना।" },
    jainMethod: {
      en: "Chew a small dry cardamom (Elaichi) seed or a piece of dry ginger. Sip slowly on water boiled with fennel seeds and cooled.",
      hi: "एक छोटी इलायची के दानों को मुंह में रखकर धीरे-धीरे चूसें। सौंफ और सूखी अदरक (सोंठ) को पानी में उबालकर छाने हुए पानी को ठंडा करके एक-एक चम्मच पीएं।"
    },
    dietRules: {
      en: "Do not eat solid foods immediately after vomiting. Give rest to your stomach for at least 3-4 hours. Sip only lukewarm Prasuk water. Avoid milk, ghee, and oil.",
      hi: "उल्टी होने के तुरंत बाद ठोस भोजन न करें। पेट को आराम दें। केवल सादा गुनगुना प्रासुक पानी घूंट-घूंट करके पीएं। दूध और घी का सेवन तत्काल रोक दें।"
    },
    spiritualHeal: {
      en: "Chant the 40th Shloka of the Bhaktamar Stotra, which acts as a powerful healer for stomach pain and gastrointestinal disturbances.",
      hi: "पेट के विकारों और उल्टी को शांत करने के लिए भक्तामर स्तोत्र के 40वें श्लोक का मन ही मन पाठ करें। मन में शांति की तरंगों का ध्यान करें।"
    }
  },
  {
    id: "cardio_cholesterol",
    category: { en: "Heart & Blood Pressure", hi: "हृदय और रक्तचाप" },
    disease: { en: "High Cholesterol", hi: "उच्च कोलेस्ट्रॉल (वसा की अधिकता)" },
    symptoms: { en: "Chest tightness, fatigue, heavy breathing during mild physical walks.", hi: "छाती में भारीपन, सांस फूलना, धमनियों में वसा जमा होना।" },
    jainMethod: {
      en: "Consume a teaspoon of roasted flaxseeds (Alsi - clean and dry) daily. Drink water boiled with dry coriander seeds.",
      hi: "प्रतिदिन सुबह आधा चम्मच भुने हुए अलसी के बीजों को अच्छी तरह चबाकर खाएं। सूखा साबुत धनिया पानी में उबालकर छान लें, इस पानी का सुबह सेवन करें।"
    },
    dietRules: {
      en: "Avoid butter, pure oil, hydrogenated fats, and heavy cream. Completely eliminate root vegetables like potatoes, beetroot, onion, and garlic. Eat high-fiber grains like barley.",
      hi: "तेल, घी, मक्खन और बाजार के फ्रोजन भोजन का परहेज करें। आलू, प्याज, शकरकंद जैसे कंदमूल धमनियों को अवरुद्ध करते हैं, अतः इनका त्याग करें। भोजन में जौ और चने का आटा लें।"
    },
    spiritualHeal: {
      en: "Practice deep pranayama and recitation of Navkar Mantra to cleanse the body and mind of negative emotions, which also purifies arterial circulation.",
      hi: "सवेरे सूर्योदय के समय शांत मन से णमोकार मंत्र का जाप करें। प्राणायाम करने से रक्त संचार सुचारू होता है और धमनियों का अवरोध दूर होता है।"
    }
  },
  {
    id: "mind_memory",
    category: { en: "Sleep & Mind", hi: "नींद और मानसिक रोग" },
    disease: { en: "Memory & Concentration", hi: "स्मरण शक्ति और एकाग्रता की कमी" },
    symptoms: { en: "Forgetfulness, lack of focus, mental dispersion, fatigue.", hi: "भूलने की बीमारी, ध्यान न लगना, पढ़ाई या काम में मन भटकना।" },
    jainMethod: {
      en: "Massage your scalp with pure almond oil (Badam oil) at night. In the morning, consume 5 almonds soaked in Prasuk water, peeled (Ahimsa check).",
      hi: "रात को मस्तक पर बादाम के तेल से हल्की मालिश करें। सुबह उठकर रात में पानी में भिगोए हुए ५ बादाम का छिलका उतारकर खूब चबाकर सेवन करें।"
    },
    dietRules: {
      en: "Avoid heavy, oily, and stale foods that induce lethargy (Tamasic bhojan). Eat green leafy vegetables, light lentils, and complete your meal 2 hours before bedtime.",
      hi: "आलस्य बढ़ाने वाले गरिष्ठ, बासी और बहुत तीखे भोजन का त्याग करें। ताजा पका भोजन लें जो मानसिक सजगता बढ़ाता है। रात्रि भोजन सूर्यास्त से पहले अवश्य करें।"
    },
    spiritualHeal: {
      en: "Meditation on the white color (Shukla Dhyana) or chanting 'Om Namo Shrudhadayanam' 108 times, focusing on the crown of the head.",
      hi: "ललाट के मध्य भाग पर ध्यान केंद्रित करते हुए 'ॐ ह्रीं णमो सुदणाणस्स' मंत्र का जाप करें, जो ज्ञान और स्मरण शक्ति बढ़ाने में अत्यंत सहायक है।"
    }
  },
  {
    id: "endocrine_thyroid",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Thyroid Imbalance", hi: "थायराइड असंतुलन" },
    symptoms: { en: "Sudden weight gain or loss, swelling in neck, fatigue, hair loss.", hi: "अचानक वजन बढ़ना या घटना, गर्दन में भारीपन, थकान, बालों का झड़ना।" },
    jainMethod: {
      en: "Drink coriander-seed water daily (boil dry coriander seeds in water and strain). Practice 'Ujjayi' pranayama (gentle throat contraction breathing) for 5 minutes.",
      hi: "सूखे धनिए के बीजों को पानी में उबालकर आधा रहने तक पकाएं, फिर छानकर गुनगुना पीएं। प्रतिदिन सुबह ५ मिनट 'उज्जायी प्राणायाम' (कंठ को संकुचित कर श्वास लेना) करें।"
    },
    dietRules: {
      en: "Avoid cabbage, cauliflower, and processed soy products. Eliminate heavy starches and root vegetables completely. Consume gluten-light grains and fresh bottle gourd.",
      hi: "पत्तागोभी, फूलगोभी, सोयाबीन और कंदमूल का पूरी तरह परहेज रखें। भोजन में शुद्ध सेंधा नमक का प्रयोग करें। लौकी का सूप और हरी सब्जियां प्रचुर मात्रा में लें।"
    },
    spiritualHeal: {
      en: "Chant the 'Om Hreem Arham Namah' mantra focusing on the throat chakra (Vishuddha), visualizing a glowing blue light balancing thyroid secretions.",
      hi: "कंठ चक्र पर ध्यान लगाते हुए प्रतिदिन १०८ बार 'ॐ ह्रीं अर्हं नमः' मंत्र का जाप करें। मन में आरोग्यता और संतुलन की तीव्र भावना भाएं।"
    }
  },
  {
    id: "digestive_liver",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Liver Health & Detox", hi: "यकृत (लीवर) स्वास्थ्य और विषहरण" },
    symptoms: { en: "Indigestion, yellowing of skin/eyes, fatigue, upper stomach discomfort.", hi: "पाचन का अत्यंत मंद होना, आंखों में पीलापन, कमजोरी, पेट के ऊपरी हिस्से में भारीपन।" },
    jainMethod: {
      en: "Drink water boiled with dry gooseberry (Amla) powder and turmeric. Consume freshly boiled, warm gourd juice with cumin seed powder.",
      hi: "उबले पानी में आंवला चूर्ण और चुटकी भर हल्दी मिलाकर पीएं। ताजी लौकी का मर्यादित रस निकालकर उसमें भुना जीरा मिलाकर पीना लीवर को नवजीवन देता है।"
    },
    dietRules: {
      en: "Completely avoid alcohol, smoking, oily/spicy deep-fried foods, and processed white sugar. Avoid heavy root vegetables which slow liver metabolism.",
      hi: "मैदा, सफेद चीनी, तली-भुनी चीजें और मिर्च-मसालों का पूरी तरह त्याग करें। जमीन के नीचे उगने वाले कंदमूल लीवर पर दबाव बढ़ाते हैं, अतः कंदमूल का पूर्ण त्याग करें।"
    },
    spiritualHeal: {
      en: "Recite the 40th and 41st Shlokas of the Bhaktamar Stotra, known to detoxify the body and eradicate toxic karmic and physical impurities.",
      hi: "लीवर के विकारों को दूर करने के लिए भक्तामर स्तोत्र के 40वें और 41वें श्लोक का श्रद्धापूर्वक पाठ करें। अपने शरीर के भीतर शुद्धता की भावना करें।"
    }
  },
  {
    id: "joint_heel_pain",
    category: { en: "Joint Pain & Arthritis", hi: "गठिया एवं जोड़ों का दर्द" },
    disease: { en: "Heel Pain & Bone Spur", hi: "एड़ी का दर्द (हड्डी बढ़ना)" },
    symptoms: { en: "Sharp pain in the heel while taking the first steps in the morning.", hi: "सुबह बिस्तर से उठकर कदम रखते ही एड़ी में तीव्र सूई चुभने जैसा दर्द होना।" },
    jainMethod: {
      en: "Practice hot water fermentation: soak your heels in a tub of warm Prasuk water mixed with rock salt for 15 minutes. Stretch the calf muscles gently.",
      hi: "एक टब में गुनगुना प्रासुक पानी भरकर उसमें थोड़ा सेंधा नमक मिलाएं और १५ मिनट अपनी एड़ियों को उसमें रखकर बैठें। इसके बाद एड़ियों पर सरसों का तेल लगाकर सिकाई करें।"
    },
    dietRules: {
      en: "Avoid sour substances like tamarind, high-uric acid foods, and processed junk. Stay strictly hydrated. Avoid potatoes and starch heavy root vegetables.",
      hi: "इमली, दही, खट्टी चीजें और गरिष्ठ उड़द की दाल का परहेज करें। वजन को नियंत्रित रखें और कंदमूल का त्याग करें जो शरीर में वात बढ़ाते हैं।"
    },
    spiritualHeal: {
      en: "Chant 'Om Namo Bhagavati Gunavati Parshvanathaya Namah' and walk mindfully, keeping each step with gentleness and compassion (Iryasamiti).",
      hi: "'ॐ नमो भगवती गुणवती पार्श्वनाथाय नमः' मंत्र का जाप करते हुए अपनी चलने की क्रिया को अहिंसक और कोमल बनाएं, जिससे एड़ियों पर दबाव कम होता है।"
    }
  },
  {
    id: "skin_sunburn",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Sunburn & Skin Tan", hi: "धूप की कालिमा और झुलसन (सनबर्न)" },
    symptoms: { en: "Redness, burning skin, dark patches due to extreme sun exposure.", hi: "धूप में रहने से त्वचा पर लालिमा, जलन और कालापन पड़ना।" },
    jainMethod: {
      en: "Apply pure cucumber pulp or fresh rose water (made of dry rose petals) directly to the affected skin. Sandalwood paste is also highly recommended.",
      hi: "खीरे का रस या घर का बना गुलाब जल चेहरे पर लगाएं। शुद्ध चंदन पाउडर को पानी में घोलकर लेप करना धूप की झुलसन को तुरंत शांत करता है।"
    },
    dietRules: {
      en: "Drink coconut water (if collected in an ahimsak way) or plenty of cool Prasuk water. Avoid hot beverages, tea, and highly spiced dishes.",
      hi: "प्रचुर मात्रा में शीतल प्रासुक जल पीएं। अधिक गर्म तासीर वाले भोजन, चाय-कॉफी और गर्म मसालों का परहेज करें। भोजन में शीतलता प्रदाता सब्जियां लें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Hreem Sheetalnathaya Namah' to invoke inner cool energy and balance the hot Pitta energy in your body and skin cells.",
      hi: "भगवान शीतलनाथ का स्मरण करते हुए 'ॐ ह्रीं शीतलनाथाय नमः' मंत्र की एक माला फेरें, जो शरीर की तपन को आध्यात्मिक रूप से शांत करती है।"
    }
  },
  {
    id: "wellness_thirst",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Excessive Thirst", hi: "अत्यधिक प्यास लगना (तृषा)" },
    symptoms: { en: "Constant dry mouth, feeling thirsty even after drinking water.", hi: "गला बार-बार सूखना, बार-बार पानी पीने पर भी प्यास शांत न होना।" },
    jainMethod: {
      en: "Suck on a few dry fennel seeds mixed with dry coriander seeds. Drink water boiled with cardamom and cooled to room temperature.",
      hi: "मुंह में थोड़ी सी सौंफ और सूखा खड़ा धनिया रखकर चूसें। पानी में इलायची उबालकर ठंडा किया हुआ प्रासुक पानी घूंट-घूंट करके पीएं, जिससे गला सूखना बंद होता है।"
    },
    dietRules: {
      en: "Avoid excessively salty, spicy, and deep-fried foods. Strictly avoid processed white sugar, which dehydrates the cells. Avoid stale food.",
      hi: "अत्यधिक नमक वाले भोजन, अचार और पापड़ का सेवन बंद करें। बहुत तीखे मिर्च-मसालों और तली हुई चीजों का परहेज करें जो शरीर में पित्त और प्यास बढ़ाते हैं।"
    },
    spiritualHeal: {
      en: "Meditate on the coolness of snow (Him-giri) while chanting 'Om Namo Jinaya' with deep breathing, stabilizing the internal heat.",
      hi: "मस्तक पर शीतल बर्फ या हिमालय के शिखर का ध्यान करते हुए शांत चित्त से णमोकार मंत्र का स्मरण करें, जिससे मानसिक और शारीरिक प्यास शांत होती है।"
    }
  },
  {
    id: "sensory_earache",
    category: { en: "Headaches & Nerves", hi: "सिरदर्द और तंत्रिका रोग" },
    disease: { en: "Earache & Ear Infection", hi: "कान का दर्द" },
    symptoms: { en: "Sharp pain inside the ear, feeling of fullness, light discharge.", hi: "कान के अंदर तेज सुई जैसा दर्द होना, कान में भारीपन या आवाज गूंजना।" },
    jainMethod: {
      en: "Warm a teaspoon of pure mustard oil with a small clove (Laung - inspected). Cool to lukewarm temperature and put 1-2 drops in the affected ear (only if the eardrum is intact).",
      hi: "शुद्ध सरसों के तेल में एक लौंग डालकर हल्का गर्म करें। तेल गुनगुना होने पर उसकी १-२ बूंदें कान में डालें (सुनिश्चित करें कि कान का पर्दा फटा न हो)।"
    },
    dietRules: {
      en: "Avoid cold water, cold beverages, curd, and heavy sweets. Keep your throat warm by taking warm Prasuk soup and barley porridge before sunset.",
      hi: "ठंडी चीजों, फ्रिज का पानी, दही और खट्टी चीजों का सख्त परहेज रखें। कान को ठंडी हवा से बचाकर रखें। भोजन में गर्म सूप या सोंठ का पानी लें।"
    },
    spiritualHeal: {
      en: "Chant 'Om Namo Bhagavati Gunavati Parshvanathaya Namah' focusing your consciousness on the ear area to dissipate karmic pain vibrations.",
      hi: "'ॐ नमो भगवती गुणवती पार्श्वनाथाय नमः' मंत्र का जाप करें और भावना भाएं कि कान की पीड़ा पूर्णतः शांत हो रही है।"
    }
  },
  {
    id: "skin_cracked_heels",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Cracked Heels", hi: "फटी एड़ियां (बिवाइयां)" },
    symptoms: { en: "Deep cracks on heels, peeling skin, bleeding in severe cases, pain.", hi: "एड़ियों में गहरी दरारें पड़ना, त्वचा का फटना, चलने में तीव्र दर्द होना।" },
    jainMethod: {
      en: "Clean the heels thoroughly with warm water after sunset. Apply a natural paste made of pure wax (Mome) and coconut oil, or pure sesame oil directly to the cracks.",
      hi: "रात को सोने से पहले पैर धोकर एड़ियों को साफ करें। शुद्ध नारियल तेल या तिल के तेल में थोड़ा सा देसी मोम गर्म करके मलहम की तरह दरारों में भरें।"
    },
    dietRules: {
      en: "Stay thoroughly hydrated during the day with boiled water. Avoid raw root vegetables like potatoes. Include healthy fats like sesame seeds and almonds.",
      hi: "दिन भर में पर्याप्त मात्रा में गुनगुना प्रासुक पानी पीएं। भोजन में तिल, बादाम और शुद्ध तेल/घी की सीमित व आवश्यक मात्रा शामिल करें। कंदमूल का परहेज रखें।"
    },
    spiritualHeal: {
      en: "Perform mindful walking (Irya Samiti), watching the ground carefully, which naturally ensures gentleness of gait and reduces high mechanical stress on heels.",
      hi: "पैरों की आरोग्यता की भावना के साथ शांत चित्त से णमोकार मंत्र का स्मरण करें। चलने में कोमलता और सावधानी बरतें (ईर्यासमिति का पालन करें)।"
    }
  },
  {
    id: "wellness_fatigue_syndrome",
    category: { en: "General Wellness", hi: "सामान्य स्वास्थ्य" },
    disease: { en: "Chronic Fatigue Syndrome", hi: "जीर्ण थकान (कमजोरी)" },
    symptoms: { en: "Unrefreshing sleep, extreme fatigue lasting months, lack of enthusiasm.", hi: "सोकर उठने पर भी ताजगी न मिलना, महीनों तक रहने वाली भयंकर कमजोरी, उत्साहहीनता।" },
    jainMethod: {
      en: "Consume lukewarm water infused with dry ginger and basil daily. Practice light yoga like Surya Namaskar after sunrise (Ahimsa-compliant gentle movements).",
      hi: "प्रतिदिन सुबह सोंठ और तुलसी पत्ती का गुनगुना पानी पीएं। सूर्योदय के पश्चात खुली धूप में बैठकर हल्के योगासन और प्राणायाम करें जो प्राण शक्ति को जगाते हैं।"
    },
    dietRules: {
      en: "Avoid highly processed, chemically preserved, and stale foods. Eat fresh, high-prana organic meals cooked within 48 minutes. Observe complete night-fasting.",
      hi: "बाजार के पैकेटबंद भोजन, प्रिजर्वेटिव्स वाले पेय और बासी भोजन का सर्वथा त्याग करें। ताजा पका सात्विक भोजन ही ग्रहण करें। सूर्यास्त के बाद जल भी न लें।"
    },
    spiritualHeal: {
      en: "Practice Kayotsarga (corporeal detachment) for 15 minutes daily. Chant 'Om Namo Jinanam' 108 times to vitalize your chakras and awaken soul energy.",
      hi: "प्रतिदिन १५ मिनट 'कायोत्सर्ग' साधना करें, जिससे शारीरिक और मानसिक ऊर्जा का संरक्षण होता है। 'ॐ णमो जिणाणं' मंत्र की माला फेरें।"
    }
  },
  {
    id: "blood_purification",
    category: { en: "Skin Disorders", hi: "त्वचा रोग" },
    disease: { en: "Blood Purification", hi: "रक्त शुद्धि (खून साफ करना)" },
    symptoms: { en: "Frequent boils, skin eruptions, dark spots, dull skin complexion.", hi: "चेहरे और शरीर पर बार-बार फोड़े-फुंसियां होना, त्वचा का निस्तेज होना।" },
    jainMethod: {
      en: "Drink water boiled with dry Neem leaves (collected carefully after they fall naturally). Consume half a teaspoon of dry turmeric powder with lukewarm water.",
      hi: "प्राकृतिक रूप से गिरे हुए नीम के पत्तों को सुखाकर उबाले गए पानी का सुबह सेवन करें। गुनगुने पानी के साथ आधा चम्मच शुद्ध पीसी हल्दी का नियमित सेवन रक्त शोधक है।"
    },
    dietRules: {
      en: "Avoid Virudh Ahara (incompatible foods like milk with salt, fruits with dairy). Avoid heavy oily foods and strictly eliminate root vegetables like onions/garlic.",
      hi: "विरुद्ध आहार (जैसे दूध के साथ नमक या फल खाना) से बचें। तीखे मसालों, रिफाइंड तेल और प्याज, लहसुन जैसे तामसिक तथा रक्त को दूषित करने वाले कंदमूल का पूर्ण त्याग करें।"
    },
    spiritualHeal: {
      en: "Observe 'Ayambil' tap for 3 days to organically detoxify the bloodstream. Chant 'Om Hreem Arham Namah' with deep meditation.",
      hi: "रक्त की शुद्धि के लिए ३ से ९ दिनों का 'आयंबिल' तप करें (नमक, तेल, घी रहित भोजन)। 'ॐ ह्रीं अर्हं नमः' मंत्र का जाप करते हुए शरीर के भीतर पवित्रता का ध्यान करें।"
    }
  },
  {
    id: "head_vertigo",
    category: { en: "Headaches & Nerves", hi: "सिरदर्द और तंत्रिका रोग" },
    disease: { en: "Vertigo & Dizziness", hi: "चक्कर आना (वर्टीगो)" },
    symptoms: { en: "Sensation of spinning, unstable balance, lightheadedness.", hi: "सिर घूमना, आंखों के आगे अंधेरा छाना, संतुलन बिगड़ने जैसा लगना।" },
    jainMethod: {
      en: "Soak 1 teaspoon of coriander seeds and 1 teaspoon of fennel seeds in warm Prasuk water overnight. Strain and drink in the morning after sunrise.",
      hi: "रात को एक कप पानी में एक चम्मच खड़ा धनिया और सौंफ भिगो दें। सुबह सूर्योदय के पश्चात इसे छानकर धीरे-धीरे पीएं। अचानक झटके से उठने या बैठने से बचें।"
    },
    dietRules: {
      en: "Keep your body alkaline. Avoid skipping meals. Eat on time before sunset. Avoid coffee, tobacco, and high-salt processed snacks.",
      hi: "शरीर को हाइड्रेटेड रखें। भोजन का समय निश्चित रखें, भूखे पेट रहने से बचें। चाय-कॉफी, तंबाकू और अत्यधिक तीखे मिर्च-मसालों का पूर्ण परहेज करें।"
    },
    spiritualHeal: {
      en: "Sit in a comfortable Siddhasana posture, close your eyes, and focus on the deep stability of the Meru mountain while reciting the Logassa Sutra.",
      hi: "सिद्धासन में स्थिर बैठकर आंखें बंद करें और सुमेरु पर्वत की अडिग स्थिरता का ध्यान करते हुए ३ बार 'लोगस्स' सूत्र का पाठ करें।"
    }
  },
  {
    id: "digestive_hyperacidity",
    category: { en: "Digestive Disorders", hi: "पाचन संबंधी रोग" },
    disease: { en: "Hyperacidity (Severe Acid)", hi: "तीव्र अम्लता (हाइपर-एसिडिटी)" },
    symptoms: { en: "Burning in chest and throat, vomiting of acid, headache, flatulence.", hi: "गले और छाती में तीव्र जलन, खट्टा पानी मुंह में आना, गंभीर सिरदर्द।" },
    jainMethod: {
      en: "Drink coriander-infused cool Prasuk water. Consume half a teaspoon of dry gooseberry (Amla) powder with cool boiled water twice a day.",
      hi: "आंवला का चूर्ण आधा चम्मच ठंडे प्रासुक जल के साथ सुबह-शाम लें। सौंफ को चबाकर उसका रस चूसें। तरबूज के बीज (मर्यादित और शुद्ध) का सेवन पित्त को तुरंत शांत करता है।"
    },
    dietRules: {
      en: "Strictly avoid chili, pickles, vinegar, fermented foods, tea, and coffee. Complete your evening meal (Chauvihar) strictly before sunset. No late-night drinking.",
      hi: "लाल मिर्च, अचार, इमली, सिरका, खमीरयुक्त भोजन और चाय का तत्काल त्याग करें। सूर्यास्त के बाद भोजन और जल का पूर्ण त्याग (चौविहार) करें जो पित्त को शांत करने का एकमात्र अचूक मार्ग है।"
    },
    spiritualHeal: {
      en: "Chant the 40th Shloka of the Bhaktamar Stotra, visualizing cool green healing energy comforting your entire stomach and esophagus.",
      hi: "भक्तामर स्तोत्र के 40वें श्लोक का २१ बार पाठ करें। अपने मन में समता भाव का संचार करें, क्योंकि क्रोध और तनाव से एसिडिटी अत्यंत तीव्र होती है।"
    }
  }
];
