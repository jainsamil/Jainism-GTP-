export interface KnowledgeItem {
  id: string;
  question: { en: string; hi: string };
  jainReason: { en: string; hi: string };
  scienceReason: { en: string; hi: string };
}

export const knowledgeData: KnowledgeItem[] = [
  {
    id: '1',
    question: {
      en: "Why do Jains avoid eating after sunset?",
      hi: "जैन सूर्यास्त के बाद भोजन क्यों नहीं करते?"
    },
    jainReason: {
      en: "To avoid 'Hinsa' (violence) towards microorganisms that become active in the dark and to maintain self-discipline.",
      hi: "अंधेरे में सक्रिय होने वाले सूक्ष्मजीवों के प्रति 'हिंसा' से बचने और आत्म-अनुशासन बनाए रखने के लिए।"
    },
    scienceReason: {
      en: "Eating before sunset aligns with the body's circadian rhythm, allowing better digestion and metabolism before sleep.",
      hi: "सूर्यास्त से पहले भोजन करना शरीर की सर्कैडियन लय के साथ संरेखित होता है, जिससे सोने से पहले बेहतर पाचन और चयापचय होता है।"
    }
  },
  {
    id: '2',
    question: {
      en: "Why is water filtered before use in Jainism?",
      hi: "जैन धर्म में उपयोग से पहले पानी को क्यों छाना जाता है?"
    },
    jainReason: {
      en: "To protect small organisms (Trasa Jiva) living in water and to return them safely to their source.",
      hi: "पानी में रहने वाले छोटे जीवों (त्रस जीव) की रक्षा करने और उन्हें सुरक्षित रूप से उनके स्रोत पर वापस भेजने के लिए।"
    },
    scienceReason: {
      en: "Filtering water removes physical impurities and many harmful parasites, ensuring cleaner and safer consumption.",
      hi: "पानी को छानने से शारीरिक अशुद्धियाँ और कई हानिकारक परजीवी निकल जाते हैं, जिससे स्वच्छ और सुरक्षित उपभोग सुनिश्चित होता है।"
    }
  },
  {
    id: '3',
    question: {
      en: "Why do Jains avoid root vegetables like onions and potatoes?",
      hi: "जैन प्याज और आलू जैसी कंदमूल सब्जियों से क्यों बचते हैं?"
    },
    jainReason: {
      en: "Root vegetables are 'Anantkaya' (containing infinite souls). Pulling them kills the entire plant and many microorganisms living in the roots.",
      hi: "कंदमूल 'अनंतकाय' होते हैं (एक शरीर में अनंत जीव)। उन्हें उखाड़ने से पूरा पौधा और जड़ों में रहने वाले कई सूक्ष्मजीव मर जाते हैं।"
    },
    scienceReason: {
      en: "Root vegetables grow underground and pulling them disturbs the soil ecosystem. They are also high in starch and can be difficult to digest for some.",
      hi: "कंदमूल जमीन के नीचे उगते हैं और उन्हें उखाड़ने से मिट्टी का पारिस्थितिकी तंत्र बाधित होता है। वे स्टार्च में भी उच्च होते हैं।"
    }
  },
  {
    id: '4',
    question: {
      en: "Why do some Jain monks wear a 'Muhapatti' (mouth mask)?",
      hi: "कुछ जैन मुनि 'मुहपत्ती' (मुंह का मुखौटा) क्यों पहनते हैं?"
    },
    jainReason: {
      en: "To avoid killing tiny organisms in the air while speaking and to maintain mindfulness in every word spoken.",
      hi: "बोलते समय हवा में मौजूद नन्हे जीवों की रक्षा करने और बोले गए हर शब्द में जागरूकता बनाए रखने के लिए।"
    },
    scienceReason: {
      en: "It prevents the spread of respiratory droplets and protects the wearer from inhaling dust and airborne pathogens.",
      hi: "यह श्वसन बूंदों के प्रसार को रोकता है और पहनने वाले को धूल और हवा से होने वाले रोगजनकों से बचाता है।"
    }
  },
  {
    id: '5',
    question: {
      en: "Why is 'Pratikraman' performed daily or periodically?",
      hi: "'प्रतिक्रमण' प्रतिदिन या समय-समय पर क्यों किया जाता है?"
    },
    jainReason: {
      en: "To repent for sins committed knowingly or unknowingly and to purify the soul from accumulated negative karma.",
      hi: "जानते या अनजाने में किए गए पापों का पश्चाताप करने और संचित नकारात्मक कर्मों से आत्मा को शुद्ध करने के लिए।"
    },
    scienceReason: {
      en: "It is a form of self-reflection and meditation that reduces stress, improves mental clarity, and promotes emotional well-being.",
      hi: "यह आत्म-चिंतन और ध्यान का एक रूप है जो तनाव को कम करता है, मानसिक स्पष्टता में सुधार करता है।"
    }
  },
  {
    id: '6',
    question: {
      en: "Why do Jains practice fasting (Upvas)?",
      hi: "जैन उपवास क्यों करते हैं?"
    },
    jainReason: {
      en: "To control physical desires, practice self-discipline, and shed karma by detaching from bodily needs.",
      hi: "शारीरिक इच्छाओं को नियंत्रित करने, आत्म-अनुशासन का अभ्यास करने और शारीरिक जरूरतों से अलग होकर कर्मों को काटने के लिए।"
    },
    scienceReason: {
      en: "Intermittent fasting helps in detoxification, cellular repair, and improves insulin sensitivity and brain function.",
      hi: "रुक-रुक कर उपवास करने से विषहरण, कोशिकीय मरम्मत में मदद मिलती है और इंसुलिन संवेदनशीलता में सुधार होता है।"
    }
  },
  {
    id: '7',
    question: {
      en: "Why is honey avoided in a strict Jain diet?",
      hi: "सख्त जैन आहार में शहद से क्यों बचा जाता है?"
    },
    jainReason: {
      en: "Collecting honey involves the death of many bees and is considered stealing the food stored by them for their survival.",
      hi: "शहद इकट्ठा करने में कई मधुमक्खियों की मृत्यु होती है और इसे उनके जीवित रहने के लिए उनके द्वारा जमा किए गए भोजन की चोरी माना जाता है।"
    },
    scienceReason: {
      en: "Honey is an animal product, and its commercial collection can disrupt bee colonies and local ecosystems.",
      hi: "शहद एक पशु उत्पाद है, और इसका व्यावसायिक संग्रह मधुमक्खियों की कॉलोनियों और स्थानीय पारिस्थितिकी तंत्र को बाधित कर सकता है।"
    }
  },
  {
    id: '8',
    question: {
      en: "Why are green vegetables avoided on 'Parva' days like Ashtami?",
      hi: "अष्टमी जैसे 'पर्व' के दिनों में हरी सब्जियों से क्यों बचा जाता है?"
    },
    jainReason: {
      en: "To practice higher levels of self-restraint and avoid even minor 'Hinsa' (violence) on holy days by eating simpler, dry foods.",
      hi: "आत्म-संयम के उच्च स्तर का अभ्यास करने और पवित्र दिनों में सूखे भोजन खाकर मामूली 'हिंसा' से भी बचने के लिए।"
    },
    scienceReason: {
      en: "It encourages the consumption of grains and pulses, providing a balanced diet and a break from high-moisture vegetables.",
      hi: "यह अनाज और दालों के सेवन को प्रोत्साहित करता है, एक संतुलित आहार प्रदान करता है।"
    }
  },
  {
    id: '9',
    question: {
      en: "Why is the 'Namokar Mantra' considered the supreme mantra?",
      hi: "'णमोकार मंत्र' को सर्वोच्च मंत्र क्यों माना जाता है?"
    },
    jainReason: {
      en: "It salutes the qualities of the five supreme beings (Panch Parmeshti) rather than any specific individual, promoting humility.",
      hi: "यह किसी विशिष्ट व्यक्ति के बजाय पांच सर्वोच्च संस्थाओं (पंच परमेष्ठी) के गुणों को नमन करता है, जो विनम्रता को बढ़ावा देता है।"
    },
    scienceReason: {
      en: "Chanting mantras creates positive sound frequencies that calm the nervous system and improve focus and concentration.",
      hi: "मंत्रों का जाप सकारात्मक ध्वनि आवृत्तियाँ पैदा करता है जो तंत्रिका तंत्र को शांत करती हैं और एकाग्रता में सुधार करती हैं।"
    }
  },
  {
    id: '10',
    question: {
      en: "Why do Jains avoid wearing silk clothes?",
      hi: "जैन रेशमी कपड़े पहनने से क्यों बचते हैं?"
    },
    jainReason: {
      en: "Silk production involves boiling silkworms alive in their cocoons, which is a form of extreme violence (Hinsa).",
      hi: "रेशम उत्पादन में रेशम के कीड़ों को उनके कोकून में जिंदा उबालना शामिल है, जो अत्यधिक हिंसा का एक रूप है।"
    },
    scienceReason: {
      en: "It is an unethical practice towards living beings; plant-based fibers like cotton or linen are more sustainable and humane.",
      hi: "यह जीवित प्राणियों के प्रति एक अनैतिक प्रथा है; कपास या लिनन जैसे पौधे-आधारित फाइबर अधिक मानवीय हैं।"
    }
  },
  {
    id: '11',
    question: {
      en: "Why is 'Anant Chaturdashi' celebrated in Jainism?",
      hi: "जैन धर्म में 'अनंत चतुर्दशी' क्यों मनाई जाती है?"
    },
    jainReason: {
      en: "It marks the day when the 12th Tirthankar Vasupujya attained Moksha and is a day for deep meditation and 'Vrat'.",
      hi: "यह वह दिन है जब 12वें तीर्थंकर वासुपूज्य ने मोक्ष प्राप्त किया था और यह गहरे ध्यान और 'व्रत' का दिन है।"
    },
    scienceReason: {
      en: "It falls at the end of the monsoon, a time for seasonal transition and body detoxification through fasting.",
      hi: "यह मानसून के अंत में आता है, जो मौसमी संक्रमण और उपवास के माध्यम से शरीर के विषहरण का समय है।"
    }
  },
  {
    id: '12',
    question: {
      en: "Why do Jains strictly avoid 'Ratri Bhojan' (eating at night)?",
      hi: "जैन 'रात्रि भोजन' (रात में खाना) से सख्ती से क्यों बचते हैं?"
    },
    jainReason: {
      en: "To avoid killing microorganisms that thrive in the dark and to maintain a disciplined, mindful lifestyle.",
      hi: "अंधेरे में पनपने वाले सूक्ष्मजीवों को मारने से बचने और एक अनुशासित, जागरूक जीवन शैली बनाए रखने के लिए।"
    },
    scienceReason: {
      en: "Digestion slows down at night; eating early allows the body to focus on repair and recovery during sleep.",
      hi: "रात में पाचन धीमा हो जाता है; जल्दी खाने से शरीर को नींद के दौरान मरम्मत और रिकवरी पर ध्यान केंद्रित करने में मदद मिलती है।"
    }
  },
  {
    id: '13',
    question: {
      en: "Why is 'Ahimsa' (Non-violence) the core of Jainism?",
      hi: "जैन धर्म का मूल 'अहिंसा' क्यों है?"
    },
    jainReason: {
      en: "Every living being has a soul and the right to live; causing harm to others directly harms one's own spiritual progress.",
      hi: "प्रत्येक जीवित प्राणी की एक आत्मा और जीने का अधिकार है; दूसरों को नुकसान पहुँचाना सीधे अपनी आध्यात्मिक प्रगति को नुकसान पहुँचाता है।"
    },
    scienceReason: {
      en: "Promoting non-violence leads to a more peaceful, sustainable, and cooperative society, ensuring the survival of all.",
      hi: "अहिंसा को बढ़ावा देने से अधिक शांतिपूर्ण, टिकाऊ और सहकारी समाज बनता है, जो सभी के अस्तित्व को सुनिश्चित करता है।"
    }
  },
  {
    id: '14',
    question: {
      en: "Why do Jains perform 'Abhishek' (ritual bath) of Tirthankar idols?",
      hi: "जैन तीर्थंकर मूर्तियों का 'अभिषेक' क्यों करते हैं?"
    },
    jainReason: {
      en: "It is a way to express devotion and to remind oneself of the pure, detached qualities of the Tirthankars.",
      hi: "यह भक्ति व्यक्त करने और तीर्थंकरों के शुद्ध, वैराग्यपूर्ण गुणों की खुद को याद दिलाने का एक तरीका है।"
    },
    scienceReason: {
      en: "The process of cleaning and caring for an object of focus helps in mental grounding, discipline, and community bonding.",
      hi: "ध्यान की वस्तु की सफाई और देखभाल की प्रक्रिया मानसिक आधार, अनुशासन और सामुदायिक जुड़ाव में मदद करती है।"
    }
  },
  {
    id: '15',
    question: {
      en: "Why is 'Sallekhana' (Santhara) practiced by some Jains?",
      hi: "कुछ जैनियों द्वारा 'सल्लेखना' (संथारा) का अभ्यास क्यों किया जाता है?"
    },
    jainReason: {
      en: "It is the voluntary thinning of the body through fasting when death is imminent, to leave the body with a peaceful, detached mind.",
      hi: "यह मृत्यु के निकट होने पर उपवास के माध्यम से शरीर को स्वेच्छा से त्यागना है, ताकि शांत मन से शरीर छोड़ा जा सके।"
    },
    scienceReason: {
      en: "It is a form of spiritual palliative care that focuses on psychological readiness and acceptance of mortality.",
      hi: "यह आध्यात्मिक उपशामक देखभाल का एक रूप है जो मनोवैज्ञानिक तत्परता और मृत्यु दर की स्वीकृति पर केंद्रित है।"
    }
  },
  {
    id: '16',
    question: {
      en: "Why is 'Paryushan' considered the most important Jain festival?",
      hi: "'पर्युषण' को सबसे महत्वपूर्ण जैन त्योहार क्यों माना जाता है?"
    },
    jainReason: {
      en: "It is a time for intensive self-purification, seeking forgiveness (Kshamapana), and deepening spiritual practices.",
      hi: "यह गहन आत्म-शुद्धि, क्षमा याचना (क्षमापना) और आध्यात्मिक प्रथाओं को गहरा करने का समय है।"
    },
    scienceReason: {
      en: "It provides a structured period for mental reset, community reconciliation, and physical detoxification through dietary changes.",
      hi: "यह मानसिक रीसेट, सामुदायिक सुलह और आहार परिवर्तन के माध्यम से शारीरिक विषहरण के लिए एक समय प्रदान करता है।"
    }
  },
  {
    id: '17',
    question: {
      en: "Why do Jains use 'Dhoop' (incense) during worship?",
      hi: "पूजा के दौरान जैन 'धूप' का उपयोग क्यों करते हैं?"
    },
    jainReason: {
      en: "It symbolizes the burning of karma and creates a fragrant, holy atmosphere that aids in concentration during prayer.",
      hi: "यह कर्मों के जलने का प्रतीक है और एक सुगंधित, पवित्र वातावरण बनाता है जो प्रार्थना के दौरान एकाग्रता में मदद करता है।"
    },
    scienceReason: {
      en: "Certain natural incenses have antimicrobial properties and can improve mood and cognitive focus through aromatherapy.",
      hi: "कुछ प्राकृतिक धूप में रोगाणुरोधी गुण होते हैं और अरोमाथेरेपी के माध्यम से मूड और संज्ञानात्मक फोकस में सुधार कर सकते हैं।"
    }
  },
  {
    id: '18',
    question: {
      en: "Why is 'Jiv-Daya' (compassion for all life) so emphasized?",
      hi: "'जीव-दया' (सभी जीवों के प्रति करुणा) पर इतना जोर क्यों दिया जाता है?"
    },
    jainReason: {
      en: "Compassion is the highest religion (Dharma); helping and protecting all living beings is the path to spiritual growth.",
      hi: "करुणा सर्वोच्च धर्म है; सभी जीवित प्राणियों की मदद करना और उनकी रक्षा करना आध्यात्मिक विकास का मार्ग है।"
    },
    scienceReason: {
      en: "Empathy and compassion are essential for social cohesion, environmental protection, and the overall survival of life on Earth.",
      hi: "सामाजिक सामंजस्य, पर्यावरण संरक्षण और पृथ्वी पर जीवन के समग्र अस्तित्व के लिए सहानुभूति और करुणा आवश्यक है।"
    }
  },
  {
    id: '19',
    question: {
      en: "Why do Jains strictly avoid alcohol and intoxicants?",
      hi: "जैन शराब और नशीले पदार्थों से सख्ती से क्यों बचते हैं?"
    },
    jainReason: {
      en: "Intoxicants cloud the mind, lead to loss of self-control, and involve the death of many microorganisms during fermentation.",
      hi: "नशीले पदार्थ मन को धुंधला कर देते हैं, आत्म-नियंत्रण खो देते हैं और किण्वन के दौरान कई सूक्ष्मजीवों की मृत्यु होती है।"
    },
    scienceReason: {
      en: "Alcohol is a neurotoxin that can damage the liver and brain, and lead to various health, social, and behavioral issues.",
      hi: "शराब एक न्यूरोटॉक्सिन है जो यकृत और मस्तिष्क को नुकसान पहुंचा सकती है, और विभिन्न स्वास्थ्य और सामाजिक मुद्दों का कारण बन सकती है।"
    }
  },
  {
    id: '20',
    question: {
      en: "Why is 'Aparigraha' (Non-possessiveness) practiced?",
      hi: "'अपरिग्रह' (अपरिग्रह) का अभ्यास क्यों किया जाता है?"
    },
    jainReason: {
      en: "Attachment to material possessions leads to greed and suffering; limiting needs helps in achieving spiritual freedom.",
      hi: "भौतिक संपदा के प्रति लगाव लालच और दुख की ओर ले जाता है; जरूरतों को सीमित करने से आध्यात्मिक स्वतंत्रता प्राप्त करने में मदद मिलती है।"
    },
    scienceReason: {
      en: "Minimalism reduces stress, decreases environmental impact, and promotes a focus on experiences and relationships over objects.",
      hi: "न्यूनतमवाद तनाव कम करता है, पर्यावरणीय प्रभाव को कम करता है और वस्तुओं पर अनुभवों और रिश्तों पर ध्यान केंद्रित करने को बढ़ावा देता है।"
    }
  }
];
