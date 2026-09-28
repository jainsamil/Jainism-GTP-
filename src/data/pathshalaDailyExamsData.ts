/**
 * PATHSHALA DAILY EXAMS & CURRICULUM REPOSITORY (पाठशाला दैनिक परीक्षा एवं पाठ्यक्रम)
 * Dynamic daily exam generation, syllabus lessons, and exam results evaluation.
 */

export interface ExamQuestion {
  id: string;
  q: { hi: string; en: string };
  options: { hi: string[]; en: string[] };
  answer: number; // 0-indexed
  explanation: { hi: string; en: string };
}

export interface DailyLesson {
  id: string;
  dayOfMonth: number;
  title: { hi: string; en: string };
  subtitle: { hi: string; en: string };
  category: 'मूल्य' | 'तीर्थंकर' | 'प्रार्थना' | 'कहानी' | 'सिद्धांत';
  icon: string;
  level: string; // e.g., '0/2 स्तर'
  xpReward: number;
  readTimeMinutes: number;
  summary: { hi: string; en: string };
  keyPoints: { hi: string[]; en: string[] };
  fullContent: { hi: string; en: string };
  questions: ExamQuestion[];
}

export interface UserExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  examDate: string; // YYYY-MM-DD
  dayNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  answers: Record<number, number>; // questionIndex -> selectedOptionIndex
  xpEarned: number;
  submittedAt: string;
  status: 'passed' | 'excellent' | 'needs_practice';
}

export const PATHSHALA_LESSONS_30_DAYS: DailyLesson[] = [
  {
    id: 'lesson_day_1',
    dayOfMonth: 1,
    title: { hi: 'पाँच महाव्रत एवं अणुव्रत', en: 'Five Mahavratas and Anuvratas' },
    subtitle: { hi: 'अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य और अपरिग्रह का यथार्थ स्वरूप', en: 'Ahimsa, Satya, Asteya, Brahmacharya & Aparigraha' },
    category: 'मूल्य',
    icon: '✋',
    level: '0/2 स्तर',
    xpReward: 100,
    readTimeMinutes: 4,
    summary: {
      hi: 'जैन धर्म में आचरण की रीढ़ पाँच महाव्रत हैं। मुनियों के लिए ये पूर्ण (महाव्रत) और श्रावकों के लिए एकदेश (अणुव्रत) रूप होते हैं।',
      en: 'The five vows form the ethical backbone of Jainism: total for monks (Mahavratas) and partial for householders (Anuvratas).'
    },
    keyPoints: {
      hi: [
        '१. अहिंसा: मन, वचन, काय से किसी भी त्रस या स्थावर जीव को कष्ट न पहुँचाना।',
        '२. सत्य: अप्रिय, कर्कश और असत्य वचनों का त्याग कर मधुर-हितकारी वचन बोलना।',
        '३. अस्तेय: बिना दी हुई किसी भी वस्तु को कभी ग्रहण न करना (चोरी का सर्वथा त्याग)।',
        '४. ब्रह्मचर्य: अपनी इन्द्रियों पर संयम रखना और पवित्रता का पालन करना।',
        '५. अपरिग्रह: सांसारिक वस्तुओं में ममत्व और अत्यधिक संचय का त्याग करना।'
      ],
      en: [
        '1. Ahimsa: Non-violence towards all living beings in thought, word, and deed.',
        '2. Satya: Speaking truthful, kind, and beneficial words.',
        '3. Asteya: Non-stealing, never taking anything not given.',
        '4. Brahmacharya: Celibacy and restraint of all senses.',
        '5. Aparigraha: Non-possessiveness and limiting material attachments.'
      ]
    },
    fullContent: {
      hi: `पाँच महाव्रत जैन साधना का आधार स्तम्भ हैं। भगवान महावीर ने फरमाया है कि जब तक प्राणी अपनी वासनाओं और हिंसात्मक वृत्तियों पर अंकुश नहीं लगाता, तब तक आत्मा का कल्याण संभव नहीं है।
गृहस्थ श्रावक अपने जीवन में संकल्प पूर्वक पाँच अणुव्रत ग्रहण करते हैं: स्थूल प्राणातिपात विरमण (अहिंसा अणुव्रत), स्थूल मृषावाद विरमण (सत्याणुव्रत), स्थूल अदत्तादान विरमण (अचौर्याणुव्रत), स्वदार संतोष (ब्रह्मचर्याणुव्रत), और इच्छा परिमाण (अपरिग्रह अणुव्रत)।
महामुनिराज इन पाँचों का पूर्णतः त्रिकरण शुद्धि (कृत, कारित, अनुमोदना) से पालन करते हैं।`,
      en: `The five great vows are the foundation of Jain spiritual practice. Monks practice them unconditionally (Mahavratas), while householders practice them within practical bounds as Anuvratas. Limiting desires and causing no harm brings deep inner peace.`
    },
    questions: [
      {
        id: 'd1_q1',
        q: { hi: 'श्रावक द्वारा ग्रहण किए जाने वाले व्रतों को क्या कहा जाता है?', en: 'What are the vows taken by Jain householders called?' },
        options: { hi: ['महाव्रत', 'अणुव्रत', 'गुणस्थान', 'प्रतिमा'], en: ['Mahavratas', 'Anuvratas', 'Gunasthanas', 'Pratimas'] },
        answer: 1,
        explanation: { hi: 'गृहस्थ श्रावक मर्यादा सहित अल्प रूप में व्रत पालन करते हैं, जिन्हें "अणुव्रत" कहा जाता है।', en: 'Householders practice vows partially with limits, called Anuvratas.' }
      },
      {
        id: 'd1_q2',
        q: { hi: 'बिना दी हुई वस्तु को न लेना किस व्रत का लक्षण है?', en: 'Not taking anything without permission is which vow?' },
        options: { hi: ['सत्य', 'अहिंसा', 'अस्तेय (अचौर्य)', 'अपरिग्रह'], en: ['Satya', 'Ahimsa', 'Asteya (Achaurya)', 'Aparigraha'] },
        answer: 2,
        explanation: { hi: 'अस्तेय का अर्थ है चोरी का त्याग, अर्थात बिना दिए किसी की वस्तु न लेना।', en: 'Asteya means non-stealing, never taking anything that is not willingly offered.' }
      },
      {
        id: 'd1_q3',
        q: { hi: 'मुनिराजों द्वारा पाले जाने वाले पाँच व्रतों को क्या कहते हैं?', en: 'What are the five vows observed by Jain Digambar Monks called?' },
        options: { hi: ['अणुव्रत', 'महाव्रत', 'शिक्षाव्रत', 'गुणव्रत'], en: ['Anuvratas', 'Mahavratas', 'Shikshavratas', 'Gunavratas'] },
        answer: 1,
        explanation: { hi: 'मुनिराज सर्वथा रूप से पाँचों व्रतों का पालन करते हैं, अतः उन्हें "महाव्रत" कहते हैं।', en: 'Monks practice the vows completely and unconditionally, called Mahavratas.' }
      },
      {
        id: 'd1_q4',
        q: { hi: 'अपरिग्रह व्रत का वास्तविक अर्थ क्या है?', en: 'What is the true essence of the Aparigraha vow?' },
        options: { hi: ['वस्तुओं का अंधाधुंध संचय', 'मूर्च्छा (ममत्व) और अनावश्यक संचय का त्याग', 'केवल मौन रहना', 'भोजन छोड़ना'], en: ['Hoarding possessions', 'Abandoning attachment and excessive hoarding', 'Only observing silence', 'Giving up food'] },
        answer: 1,
        explanation: { hi: 'आगम में कहा गया है: "मूर्च्छा परिग्रहः" — वस्तुओं के प्रति ममत्व का त्याग ही अपरिग्रह है।', en: 'In Jain texts, "Murchha Parigrahah" means attachment to possessions is bondage.' }
      },
      {
        id: 'd1_q5',
        q: { hi: 'अहिंसा महाव्रत में किन जीवों की रक्षा का संकल्प होता है?', en: 'Which living beings are protected in Ahimsa Mahavrata?' },
        options: { hi: ['केवल मनुष्यों की', 'केवल पशुओं की', 'त्रस (२-५ इन्द्रिय) और स्थावर (१ इन्द्रिय) सभी जीवों की', 'किसी की नहीं'], en: ['Only humans', 'Only animals', 'All living beings (tras and sthavar)', 'None'] },
        answer: 2,
        explanation: { hi: 'जैन मुनि सूक्ष्म से सूक्ष्म स्थावर और त्रस सभी जीवों की यत्नपूर्वक रक्षा करते हैं।', en: 'Jain ascetics carefully protect all mobile and immobile living beings.' }
      },
      {
        id: 'd1_q6',
        q: { hi: 'त्रिकरण शुद्धि में कौन से तीन साधन आते हैं?', en: 'What are the three faculties in Trikaran Shuddhi?' },
        options: { hi: ['मन, वचन, काय', 'जल, फल, अक्षत', 'धूप, दीप, नैवेद्य', 'ज्ञान, दर्शन, चारित्र'], en: ['Mind, Speech, Body', 'Water, Fruit, Rice', 'Incense, Lamp, Sweets', 'Knowledge, Faith, Conduct'] },
        answer: 0,
        explanation: { hi: 'मन, वचन और काय (शरीर) की पवित्रता और संयम को त्रिकरण शुद्धि कहते हैं।', en: 'Mind (Mana), Speech (Vachana), and Body (Kaya) form the three faculties of action.' }
      },
      {
        id: 'd1_q7',
        q: { hi: 'श्रावक के १२ व्रतों में कितने गुणव्रत होते हैं?', en: 'How many Gunavratas are there in the 12 vows of a Shravak?' },
        options: { hi: ['३ गुणव्रत', '५ गुणव्रत', '४ गुणव्रत', '२ गुणव्रत'], en: ['3 Gunavratas', '5 Gunavratas', '4 Gunavratas', '2 Gunavratas'] },
        answer: 0,
        explanation: { hi: 'श्रावक के १२ व्रतों में: ५ अणुव्रत, ३ गुणव्रत (दिग्व्रत, देशव्रत, अनर्थदण्डव्रत) और ४ शिक्षाव्रत होते हैं।', en: 'The 12 vows include 5 Anuvratas, 3 Gunavratas, and 4 Shikshavratas.' }
      },
      {
        id: 'd1_q8',
        q: { hi: 'सत्याणुव्रत में किस प्रकार के वचन बोलने की प्रेरणा दी गई है?', en: 'What kind of speech is encouraged in Satyanuvrata?' },
        options: { hi: ['कड़वे वचन', 'हित, मित और प्रिय वचन', 'अहंकार भरे वचन', 'निंदा भरे वचन'], en: ['Harsh words', 'Beneficial, measured, and sweet words', 'Arrogant words', 'Slanderous words'] },
        answer: 1,
        explanation: { hi: 'जैन दर्शन में हितकारी, परिमित और मधुर सत्य बोलने का उपदेश है।', en: 'Jain philosophy advises speaking beneficial, concise, and truthful speech.' }
      },
      {
        id: 'd1_q9',
        q: { hi: 'ब्रह्मचर्य अणुव्रत का मुख्य उद्देश्य क्या है?', en: 'What is the primary objective of Brahmacharya Anuvrata?' },
        options: { hi: ['काम-वासना पर विजय और स्वदार संतोष', 'केवल वस्त्र त्यागना', 'उपवास न करना', 'विदेश न जाना'], en: ['Victory over passions and fidelity to spouse', 'Abandoning clothes only', 'Not fasting', 'Not traveling abroad'] },
        answer: 0,
        explanation: { hi: 'गृहस्थ के लिए स्वदार-संतोष (अपनी पत्नी में संतोष) और इन्द्रिय संयम ही ब्रह्मचर्याणुव्रत है।', en: 'For householders, marital fidelity and sensory restraint constitute Brahmacharya.' }
      },
      {
        id: 'd1_q10',
        q: { hi: 'पाँच व्रतों का पालन करने का अंतिम फल क्या है?', en: 'What is the ultimate fruit of observing the five vows?' },
        options: { hi: ['धन-दौलत की प्राप्ति', 'मोक्ष (सकल कर्मों से मुक्ति)', 'शत्रुओं पर विजय', 'संसार में प्रशंसा'], en: ['Material wealth', 'Moksha (Liberation from all karmas)', 'Victory over enemies', 'Fame in worldly life'] },
        answer: 1,
        explanation: { hi: 'व्रत और संयम आत्मा को कर्ममल से मुक्त कर सिद्धपद (मोक्ष) की प्राप्ति कराते हैं।', en: 'Observing vows purifies the soul from karmic bonds, leading to ultimate liberation (Moksha).' }
      }
    ]
  },
  {
    id: 'lesson_day_2',
    dayOfMonth: 2,
    title: { hi: 'अहिंसा और जीवन की सीढ़ी', en: 'Ahimsa & The Ladder of Life' },
    subtitle: { hi: 'सूक्ष्म जीवों की दया और दयालु जीवन शैली', en: 'Compassion for all beings and gentle living' },
    category: 'मूल्य',
    icon: '🐜',
    level: '0/1 स्तर',
    xpReward: 100,
    readTimeMinutes: 3,
    summary: {
      hi: 'अहिंसा परमो धर्मः — संसार के छोटे से छोटे कीट-पतंगे में भी वही चेतन आत्मा है जो हममें है।',
      en: 'Non-violence is the supreme virtue. Every living soul, small or large, has the same pure spark.'
    },
    keyPoints: {
      hi: [
        'छानकर पानी पीना जलकायिक जीवों की रक्षा करता है।',
        'सूर्यास्त के बाद भोजन न करना सूक्ष्म त्रस जीवों की हिंसा से बचाता है।',
        'जमीकंद (आलू, प्याज, लहसुन) में अनन्त जीव होते हैं, अतः इनका त्याग श्रेयस्कर है।',
        'जीव दया ही धर्म का मूल है।'
      ],
      en: [
        'Filtering water protects aquatic micro-organisms.',
        'Avoiding food after sunset protects nocturnal organisms.',
        'Root vegetables contain infinite microscopic lives (Anantkayik).',
        'Compassion for all beings is the root of spirituality.'
      ]
    },
    fullContent: {
      hi: `अहिंसा केवल किसी को न मारना ही नहीं है, अपितु किसी के प्रति मन में द्वेष, ईर्ष्या या कटुता न रखना भी अहिंसा है।
जैन आचार्यों ने जीवों को दो भागों में बांटा है: स्थावर (पृथ्वी, जल, अग्नि, वायु, वनस्पति) और त्रस (दो, तीन, चार, पाँच इन्द्रिय जीव)।
गृहस्थ अपनी दैनिक चर्या में कम से कम हिंसा का संकल्प लेता है। रात्रि भोजन त्याग और अभक्ष्य भक्षण से मुक्ति जीवन को सात्विक बनाती है।`,
      en: `Ahimsa extends beyond physical non-injury to purity of thoughts and emotions. Eliminating malice, envy, and anger constitutes true mental non-violence. Respecting food sources and daylight eating brings vitality and spiritual peace.`
    },
    questions: [
      {
        id: 'd2_q1',
        q: { hi: 'जैन धर्म का परम मूल सिद्धांत क्या है?', en: 'What is the supreme founding principle of Jainism?' },
        options: { hi: ['अहिंसा परमो धर्मः', 'कठोर तपस्या', 'यज्ञ-हवन', 'केवल दान'], en: ['Ahimsa Paramo Dharmah', 'Severe asceticism', 'Ritual sacrifices', 'Charity only'] },
        answer: 0,
        explanation: { hi: 'अहिंसा परमो धर्मः जैन संस्कृति का सर्वमान्य महामंत्र है।', en: 'Non-violence is supreme virtue (Ahimsa Paramo Dharmah) is the core motto.' }
      },
      {
        id: 'd2_q2',
        q: { hi: 'रात्रि भोजन त्याग का मुख्य वैज्ञानिक एवं आध्यात्मिक कारण क्या है?', en: 'What is the key spiritual reason for renouncing nighttime dining?' },
        options: { hi: ['रात में भोजन नहीं पचता', 'अंधेरे/प्रकाश में सूक्ष्म जीवों की हिंसा से बचाव और संयम', 'नींद अच्छी आती है', 'समय की बचत'], en: ['Digestion issue only', 'Protection of micro-organisms attracted to light and self-restraint', 'Better sleep only', 'Time saving'] },
        answer: 1,
        explanation: { hi: 'रात्रि में कीटाणु व त्रस जीव तेजी से उत्पन्न होते हैं, अतः दिन में भोजन करना अहिंसक है।', en: 'Night dining involves inadvertent harm to nocturnal insects attracted to lights and heat.' }
      },
      {
        id: 'd2_q3',
        q: { hi: 'जमीकंद (कंदमूल) का त्याग जैन धर्म में क्यों अनिवार्य माना गया है?', en: 'Why are root vegetables avoided in pure Jain diet?' },
        options: { hi: ['वे बहुत कड़वे होते हैं', 'एक सुई की नोक बराबर कंदमूल में अनन्त निगोदिया जीव होते हैं', 'वे महंगे होते हैं', 'वे जमीन में उगते हैं'], en: ['They taste bitter', 'A needle-tip portion contains infinite nigod micro-organisms', 'They are expensive', 'They grow in soil'] },
        answer: 1,
        explanation: { hi: 'आगम के अनुसार जमीकंद में अनन्तकायिक जीव विद्यमान होते हैं, अतः इनका त्याग महान अहिंसा है।', en: 'Root vegetables contain infinite souls (Anantkaya), multiplying rapidly upon harvesting.' }
      },
      {
        id: 'd2_q4',
        q: { hi: 'स्थावर जीव कितनी श्रेणियों में विभाजित हैं?', en: 'How many categories do immobile (Sthavar) living beings comprise?' },
        options: { hi: ['३ प्रकार', '५ प्रकार (पृथ्वी, जल, अग्नि, वायु, वनस्पति)', '७ प्रकार', '१० प्रकार'], en: ['3 types', '5 types (Earth, Water, Fire, Air, Plant)', '7 types', '10 types'] },
        answer: 1,
        explanation: { hi: 'स्थावर जीव ५ प्रकार के होते हैं: पृथ्वीकायिक, जलकायिक, अग्निकायिक, वायुकायिक, और वनस्पतिकायिक।', en: 'Sthavar (one-sensed) beings are categorized into five elemental bodies: Earth, Water, Fire, Air, and Flora.' }
      },
      {
        id: 'd2_q5',
        q: { hi: 'छने हुए पानी का उपयोग किस जीव की रक्षा हेतु किया जाता है?', en: 'Using filtered water protects which class of beings?' },
        options: { hi: ['अग्निकायिक', 'जलकायिक जीव', 'वायुकायिक', 'त्रस जीव केवल'], en: ['Fire-bodied', 'Water-bodied (Apkayika) souls', 'Air-bodied', 'Mobile souls only'] },
        answer: 1,
        explanation: { hi: 'मर्यादित छना हुआ पानी जलकायिक जीवों की विराधना रोकता है और स्वास्थ्य भी उत्तम रखता है।', en: 'Filtering water carefully avoids consuming and harming living water organisms.' }
      },
      {
        id: 'd2_q6',
        q: { hi: 'जैन दर्शन में त्रस जीव किसे कहते हैं?', en: 'In Jain philosophy, what is a Tras Jiva?' },
        options: { hi: ['केवल पौधों को', 'दो, तीन, चार एवं पाँच इन्द्रिय वाले चलायमान जीव', 'केवल पत्थरों को', 'केवल बादलों को'], en: ['Plants only', 'Mobile living beings with 2 to 5 senses', 'Stones only', 'Clouds only'] },
        answer: 1,
        explanation: { hi: 'जो भय से भाग सकते हैं और सुख-दुःख अनुभव करते हैं (२ से ५ इन्द्रिय जीव), वे त्रस जीव हैं।', en: 'Tras jivas are mobile beings possessing two or more senses capable of locomotion.' }
      },
      {
        id: 'd2_q7',
        q: { hi: 'मन में किसी का बुरा सोचने से कौन सी हिंसा होती है?', en: 'Harboring evil thoughts towards another constitutes what kind of violence?' },
        options: { hi: ['द्रव्य हिंसा', 'भाव हिंसा', 'दोनों नहीं', 'शारीरिक हिंसा'], en: ['Physical violence', 'Mental/Intentional violence (Bhava Himsa)', 'Neither', 'Bodily violence'] },
        answer: 1,
        explanation: { hi: 'राग, द्वेष, क्रोध आदि कलुष भाव उत्पन्न होना ही "भाव हिंसा" कहलाता है।', en: 'Negative emotional vibrations like malice, wrath, and greed constitute Bhava Himsa.' }
      },
      {
        id: 'd2_q8',
        q: { hi: 'ईर्या समिति का क्या तात्पर्य है?', en: 'What does Irya Samiti signify for a practitioner?' },
        options: { hi: ['आँखें बंद करके भागना', 'चार हाथ आगे की भूमि देखकर यत्नपूर्वक चलना', 'गाड़ी चलाना', 'बैठे रहना'], en: ['Running blindly', 'Carefully watching four paces ahead while walking to avoid harming bugs', 'Driving cars', 'Sitting still'] },
        answer: 1,
        explanation: { hi: 'भूमि पर सूक्ष्म जीवों की रक्षा करते हुए आगे देखकर चलना ही ईर्या समिति है।', en: 'Irya Samiti is the mindful discipline of walking while looking ahead to protect tiny insects.' }
      },
      {
        id: 'd2_q9',
        q: { hi: 'अहिंसा से व्यक्ति के भीतर कौन सा गुण जागृत होता है?', en: 'Which divine virtue awakens within through Ahimsa?' },
        options: { hi: ['क्रोध और गर्व', 'करुणा, मैत्री और आत्मीयता', 'आलस्य', 'भय'], en: ['Anger and pride', 'Compassion, universal friendliness (Maitri), and empathy', 'Lethargy', 'Fear'] },
        answer: 1,
        explanation: { hi: 'भगवान महावीर ने कहा: "मित्ती मे सव्वभूएसु" — मेरी सब जीवों से मैत्री है।', en: 'Ahimsa blossoms into universal friendship (Maitri) with all living forms.' }
      },
      {
        id: 'd2_q10',
        q: { hi: 'जैन भोजन में "अभक्ष्य" पदार्थों की संख्या कितनी मानी गई है?', en: 'How many primary categories of forbidden foods (Abhakshya) are traditionally taught?' },
        options: { hi: ['१०', '१५', '२२ अभक्ष्य', '५'], en: ['10', '15', '22 Abhakshya foods', '5'] },
        answer: 2,
        explanation: { hi: 'जैन शास्त्रों में २२ प्रकार के अभक्ष्य पदार्थों का त्याग करने का निर्देश है।', en: 'Traditional Jain codes enumerate 22 forbidden food categories harmful to soul and health.' }
      }
    ]
  },
  {
    id: 'lesson_day_3',
    dayOfMonth: 3,
    title: { hi: 'णमोकार महामंत्र की महिमा', en: 'Glory of Navkar Mahamantra' },
    subtitle: { hi: 'अनादि मूल मंत्र, पंचपरमेष्ठी का स्वरूप एवं जाप विधि', en: 'Eternal root mantra, Pancha Parameshthi and chanting' },
    category: 'प्रार्थना',
    icon: '🕉️',
    level: '0/2 स्तर',
    xpReward: 120,
    readTimeMinutes: 4,
    summary: {
      hi: 'णमोकार मंत्र अनादि निधन महामंत्र है। इसमें किसी व्यक्ति की नहीं बल्कि विशुद्ध गुणों की वंदना है।',
      en: 'Navkar Mantra is eternal and non-sectarian, revering the supreme virtues of the five divine orders.'
    },
    keyPoints: {
      hi: [
        'णमो अरिहंताणं — १२ गुणों से युक्त अरिहंत देव को नमस्कार।',
        'णमो सिद्धाणं — ८ गुणों से युक्त अशरीरी सिद्ध परमेष्ठी को नमस्कार।',
        'णमो आयरियाणं — ३६ गुणों से युक्त आचार्य परमेष्ठी को नमस्कार।',
        'णमो उवज्झायाणं — २५ गुणों से युक्त उपाध्याय परमेष्ठी को नमस्कार।',
        'णमो लोए सव्वसाहूणं — २८ मूलगुण धारी समस्त साधु परमेष्ठी को नमस्कार।'
      ],
      en: [
        'Namo Arihantanam - Obeisance to the omniscient Arihantas with 12 attributes.',
        'Namo Siddhanam - Obeisance to the liberated, bodiless Siddhas with 8 attributes.',
        'Namo Ayariyanam - Obeisance to the monastic leaders, Acharyas with 36 attributes.',
        'Namo Uvajjhayanam - Obeisance to the spiritual teachers, Upadhyayas with 25 attributes.',
        'Namo Loe Savvasahunam - Obeisance to all holy monks across the universe.'
      ]
    },
    fullContent: {
      hi: `णमोकार महामंत्र जैन धर्म का प्राण है। इसके स्मरण मात्र से आत्मा के समस्त पाप और विकारों का क्षय होता है।
इस महामंत्र में कुल पाँच पद मुख्य हैं तथा चार पद चूलिका के हैं (एसा पंचणमोक्कारो सव्वपावप्पणासणो, मंगलाणं च सव्वेसिं पढमं हवइ मंगलं)।
इसमें कुल ३५ अक्षर, ५८ मात्राएँ और ६८ पद-अक्षर की संरचना होती है। इसे किसी भी समय, पवित्र मन से जपा जा सकता है।`,
      en: `The Navkar Mantra is the quintessential Jain mantra. It venerates the supreme virtues rather than individual personalities. Chanting it with pure devotion dissipates karmic dust, instills peace, and elevates the consciousness towards liberation.`
    },
    questions: [
      {
        id: 'd3_q1',
        q: { hi: 'णमोकार मंत्र में कुल कितने परमेष्ठी की वंदना की गई है?', en: 'How many Parameshthis are revered in the Navkar Mantra?' },
        options: { hi: ['३ परमेष्ठी', '५ पंचपरमेष्ठी', '७ परमेष्ठी', '२४ परमेष्ठी'], en: ['3', '5 (Pancha Parameshthi)', '7', '24'] },
        answer: 1,
        explanation: { hi: 'णमोकार मंत्र में पंचपरमेष्ठी: अरिहंत, सिद्ध, आचार्य, उपाध्याय और साधु की वंदना है।', en: 'Navkar Mantra pays tribute to the Five Supreme Beings: Arihant, Siddha, Acharya, Upadhyaya, and Sadhu.' }
      },
      {
        id: 'd3_q2',
        q: { hi: 'अरिहंत परमेष्ठी के कितने मूल गुण होते हैं?', en: 'How many primary attributes (Mula Gunas) do Arihantas possess?' },
        options: { hi: ['८ गुण', '१२ मूलगुण (४ अनन्त चतुष्टय + ८ प्रातिहार्य)', '२८ गुण', '३६ गुण'], en: ['8', '12 attributes', '28', '36'] },
        answer: 1,
        explanation: { hi: 'अरिहंत भगवान ४ घातिया कर्मों का नाश कर १२ विशिष्ट मूलगुणों से सुशोभित होते हैं।', en: 'Arihantas possess 12 prime virtues including the Four Infinites and Eight Pratiharyas.' }
      },
      {
        id: 'd3_q3',
        q: { hi: 'सिद्ध परमेष्ठी के कितने गुण बताए गए हैं?', en: 'How many fundamental qualities do the Liberated Siddhas possess?' },
        options: { hi: ['८ आत्मिक गुण', '१२ गुण', '२४ गुण', '३६ गुण'], en: ['8 divine attributes', '12', '24', '36'] },
        answer: 0,
        explanation: { hi: 'आठों कर्मों के समूल विनाश से सिद्ध भगवान ८ विशुद्ध गुणों (अनन्तज्ञान, अनन्तदर्शन आदि) को प्राप्त होते हैं।', en: 'Siddhas embody the 8 supreme qualities of absolute liberation.' }
      },
      {
        id: 'd3_q4',
        q: { hi: 'आचार्य परमेष्ठी के कितने मूल गुण होते हैं?', en: 'How many attributes belong to Acharya Parameshthi?' },
        options: { hi: ['२५', '२८', '३६ मूलगुण', '५'], en: ['25', '28', '36 attributes', '5'] },
        answer: 2,
        explanation: { hi: 'संघ के नायक आचार्य देव ३६ मूलगुणों (१२ तप, १० धर्म, ५ आचार, ६ आवश्य, ३ गुप्ति) के धारक होते हैं।', en: 'Acharyas maintain 36 fundamental monastic virtues.' }
      },
      {
        id: 'd3_q5',
        q: { hi: 'दिगम्बर जैन साधु परमेष्ठी के कितने मूलगुण होते हैं?', en: 'How many Mula Gunas do Digambara Jain Monks (Sadhus) observe?' },
        options: { hi: ['२८ मूलगुण', '१८ मूलगुण', '११ मूलगुण', '३२ मूलगुण'], en: ['28 Mula Gunas', '18', '11', '32'] },
        answer: 0,
        explanation: { hi: 'साधु परमेष्ठी २८ मूलगुणों (५ महाव्रत, ५ समिति, ५ इन्द्रिय विजय, ६ आवश्यक, ७ शेष गुण) का निर्दोष पालन करते हैं।', en: 'Digambara ascetics strictly adhere to the 28 core monastic disciplines.' }
      },
      {
        id: 'd3_q6',
        q: { hi: 'णमोकार मंत्र के मूल ५ पदों में कुल कितने अक्षर होते हैं?', en: 'How many letters (Aksharas) are in the core 5 lines of Navkar Mantra?' },
        options: { hi: ['२४', '३५ अक्षर', '५०', '१०८'], en: ['24', '35 Aksharas', '50', '108'] },
        answer: 1,
        explanation: { hi: 'णमोकार मंत्र के पाँच पदों में कुल ३५ अक्षर और ५८ मात्राएँ होती हैं।', en: 'The five core lines consist of 35 sacred letters and 58 poetic matras.' }
      },
      {
        id: 'd3_q7',
        q: { hi: 'णमोकार मंत्र में किसे नमस्कार किया जाता है?', en: 'To whom is salutation offered in the Navkar Mantra?' },
        options: { hi: ['किसी विशेष व्यक्ति या जाति को', 'समस्त विकारों से रहित विशुद्ध आत्मिक गुणों को', 'केवल राजाओं को', 'धन-संपत्ति को'], en: ['A specific person or caste', 'Pure spiritual virtues freed from all worldly defilements', 'Kings only', 'Material riches'] },
        answer: 1,
        explanation: { hi: 'यह मंत्र व्यक्तिवादी नहीं बल्कि विशुद्ध गुणानुरागी है।', en: 'The mantra is non-sectarian, honoring divine virtues rather than individual personalities.' }
      },
      {
        id: 'd3_q8',
        q: { hi: 'उपाध्याय परमेष्ठी का मुख्य कर्तव्य क्या होता है?', en: 'What is the prime spiritual responsibility of Upadhyaya Parameshthi?' },
        options: { hi: ['मंदिर बनवाना', 'आगम शास्त्रों का पठन-पाठन और उपदेश देना', 'व्यापार करना', 'यात्रा करना'], en: ['Building temples', 'Studying and teaching the sacred scriptures (Agamas)', 'Engaging in trade', 'Traveling only'] },
        answer: 1,
        explanation: { hi: 'उपाध्याय परमेष्ठी २५ मूलगुणों से विभूषित होकर मुनि संघ एवं श्रावकों को जिनवाणी पढ़ाते हैं।', en: 'Upadhyayas are master scholars whose duty is teaching the holy Jinvani.' }
      },
      {
        id: 'd3_q9',
        q: { hi: 'णमोकार मंत्र की माला में सामान्यतः कितने मनके (Manka) होते हैं?', en: 'How many beads are typically on a traditional Navkar Japa mala?' },
        options: { hi: ['५१', '१०८ मनके', '१५०', '२१'], en: ['51', '108 beads', '150', '21'] },
        answer: 1,
        explanation: { hi: 'पंचपरमेष्ठी के कुल १०८ गुणों (१२+८+३६+२५+२८=१०८) के स्मरण हेतु माला में १०८ मनके होते हैं।', en: '108 beads correspond to the sum total of 108 supreme virtues of the Pancha Parameshthi.' }
      },
      {
        id: 'd3_q10',
        q: { hi: 'णमोकार मंत्र का पाठ करने से क्या फल मिलता है?', en: 'What is the auspicious fruit of sincerely chanting the Navkar Mantra?' },
        options: { hi: ['पापों का नाश और चित्त की परम विशुद्धि', 'अहंकार में वृद्धि', 'दूसरों को वश में करना', 'शत्रुओं को मारना'], en: ['Destruction of sins, mental equanimity, and spiritual elevation', 'Growth in ego', 'Hypnotizing others', 'Harming enemies'] },
        answer: 0,
        explanation: { hi: '"सव्वपावप्पणासणो" — यह महामंत्र समस्त पापों का नाश कर आत्मिक शांति प्रदान करता है।', en: 'The mantra dissolves karmic bondages and bestows profound inner peace and equanimity.' }
      }
    ]
  },
  {
    id: 'lesson_day_4',
    dayOfMonth: 4,
    title: { hi: 'चौबीस तीर्थंकर एवं उनके लांछन', en: '24 Tirthankaras & Their Symbols' },
    subtitle: { hi: 'प्रथम तीर्थंकर ऋषभदेव से अंतिम भगवान महावीर तक का परिचय', en: 'From Lord Rishabhdev to Lord Mahavira' },
    category: 'तीर्थंकर',
    icon: '🪷',
    level: '0/2 स्तर',
    xpReward: 110,
    readTimeMinutes: 4,
    summary: {
      hi: 'वर्तमान अवसर्पिणी काल में इस भरत क्षेत्र में २४ तीर्थंकर भगवान अवतरित हुए जिन्होंने संसार सागर से पार होने का तीर्थ प्रवर्तित किया।',
      en: '24 Tirthankaras arose in this era to re-establish the fourfold Jain sangha and show the path of liberation.'
    },
    keyPoints: {
      hi: [
        '१. भगवान ऋषभदेव (आदिनाथ) — चिन्ह: बैल (वृषभ)',
        '१६. भगवान शान्तिनाथ — चिन्ह: हिरण (मृग)',
        '२२. भगवान नेमिनाथ — चिन्ह: शंख',
        '२३. भगवान पार्श्वनाथ — चिन्ह: सर्प (फणीन्द्र)',
        '२४. भगवान महावीर स्वामी — चिन्ह: सिंह (केसरी)'
      ],
      en: [
        '1. Bhagwan Rishabhdev (Adinath) - Symbol: Bull',
        '16. Bhagwan Shantinath - Symbol: Deer',
        '22. Bhagwan Neminath - Symbol: Conch shell',
        '23. Bhagwan Parshvanath - Symbol: Serpent',
        '24. Bhagwan Mahavira Swami - Symbol: Lion'
      ]
    },
    fullContent: {
      hi: `तीर्थंकर वह महापुरुष होते हैं जो धर्म का तीर्थ (संघ: मुनि, आर्यिका, श्रावक, श्राविका) प्रवर्तित करते हैं।
प्रत्येक तीर्थंकर के पांच कल्याणक होते हैं: गर्भ, जन्म, तप, ज्ञान (केवलज्ञान), और मोक्ष कल्याणक।
भगवान ऋषभदेव ने असि, मसि, कृषि, विद्या, शिल्प और वाणिज्य की शिक्षा देकर समाज की रचना की।
भगवान महावीर स्वामी ने समवशरण में अनेकान्त, स्याद्वाद और अहिंसा का अमर संदेश दिया।`,
      en: `Tirthankaras establish the Ford across the ocean of worldly existence. They celebrate five auspicious life milestones (Panchakalyanaka). Their statues are recognized by distinctive sacred symbols (Lanchhanas) engraved on their pedestals.`
    },
    questions: [
      {
        id: 'd4_q1',
        q: { hi: 'वर्तमान चौबीसी के प्रथम तीर्थंकर कौन हैं?', en: 'Who is the first Tirthankara of the current era?' },
        options: { hi: ['भगवान महावीर', 'भगवान आदिनाथ (ऋषभदेव)', 'भगवान पार्श्वनाथ', 'भगवान नेमिनाथ'], en: ['Lord Mahavira', 'Lord Adinath (Rishabhdev)', 'Lord Parshvanath', 'Lord Neminath'] },
        answer: 1,
        explanation: { hi: 'भगवान ऋषभदेव (आदिनाथ जी) वर्तमान युग के प्रथम तीर्थंकर हैं।', en: 'Bhagwan Rishabhdev (Adinath) is the first Tirthankara of this cosmic cycle.' }
      },
      {
        id: 'd4_q2',
        q: { hi: '२४वें तीर्थंकर भगवान महावीर स्वामी का लांछन (चिन्ह) क्या है?', en: 'What is the sacred symbol (Lanchhana) of the 24th Tirthankara Lord Mahavira?' },
        options: { hi: ['बैल', 'सर्प', 'सिंह', 'हाथी'], en: ['Bull', 'Serpent', 'Lion', 'Elephant'] },
        answer: 2,
        explanation: { hi: 'भगवान महावीर का पावन चिन्ह "सिंह" है जो शौर्य, निर्भयता और आत्मबल का प्रतीक है।', en: 'The Lion symbol of Lord Mahavira symbolizes supreme courage, fearlessness, and self-conquest.' }
      },
      {
        id: 'd4_q3',
        q: { hi: '२३वें तीर्थंकर भगवान पार्श्वनाथ का लांछन क्या है?', en: 'What is the symbol of 23rd Tirthankara Bhagwan Parshvanath?' },
        options: { hi: ['सर्प', 'कमल', 'घोड़ा', 'चन्द्रमा'], en: ['Serpent', 'Lotus', 'Horse', 'Moon'] },
        answer: 0,
        explanation: { hi: 'भगवान पार्श्वनाथ का लांछन सर्प है और उनके सिर पर सात फणों का छत्र सुशोभित होता है।', en: 'Bhagwan Parshvanath is represented by the Serpent with a multi-hooded umbrella.' }
      },
      {
        id: 'd4_q4',
        q: { hi: 'भगवान नेमिनाथ (२२वें तीर्थंकर) का पावन चिन्ह क्या है?', en: 'What is the symbol of 22nd Tirthankara Lord Neminath?' },
        options: { hi: ['शंख', 'मृग', 'वज्र', 'मकर'], en: ['Conch shell', 'Deer', 'Thunderbolt', 'Crocodile'] },
        answer: 0,
        explanation: { hi: 'भगवान नेमिनाथ का लांछन शंख है। वे गिरनार जी से मोक्ष पधारे थे।', en: 'The Conch shell (Shankha) is the sacred emblem of Lord Neminath.' }
      },
      {
        id: 'd4_q5',
        q: { hi: 'तीर्थंकर के जीवन में कितने कल्याणक महोत्सव मनाए जाते हैं?', en: 'How many Kalyanaka festivals are celebrated in a Tirthankara’s life?' },
        options: { hi: ['३ कल्याणक', '५ कल्याणक (पंचकल्याणक)', '७ कल्याणक', '१२ कल्याणक'], en: ['3', '5 (Panchakalyanaka)', '7', '12'] },
        answer: 1,
        explanation: { hi: 'गर्भ, जन्म, तप, केवलज्ञान और मोक्ष — ये पांच महाकल्याणक देवों द्वारा मनाए जाते हैं।', en: 'The Five Auspicious Events are Conception, Birth, Renunciation, Omniscience, and Liberation.' }
      },
      {
        id: 'd4_q6',
        q: { hi: '१६वें तीर्थंकर भगवान शान्तिनाथ का चिन्ह क्या है?', en: 'What is the symbol of the 16th Tirthankara Lord Shantinath?' },
        options: { hi: ['हिरण (मृग)', 'सिंह', 'हाथी', 'कछुआ'], en: ['Deer (Mriga)', 'Lion', 'Elephant', 'Tortoise'] },
        answer: 0,
        explanation: { hi: 'भगवान शान्तिनाथ कामदेव, चक्रवर्ती और तीर्थंकर तीनों पदों के धारक थे, उनका चिन्ह हिरण है।', en: 'Lord Shantinath, who was Kamadeva, Chakravarti, and Tirthankara, has the Deer symbol.' }
      },
      {
        id: 'd4_q7',
        q: { hi: 'भगवान पार्श्वनाथ को कमठ के उपसर्ग से किसने बचाया था?', en: 'Who protected Bhagwan Parshvanath during Kamatha’s ferocious storm?' },
        options: { hi: ['इंद्र देव', 'धरणेन्द्र और पद्मावती', 'सुग्रीव', 'कुबेर'], en: ['Indra Deva', 'Dharanendra and Padmavati', 'Sugriva', 'Kubera'] },
        answer: 1,
        explanation: { hi: 'नागराज धरणेन्द्र ने फणों का छत्र लगाया और देवी पद्मावती ने कमल का आसन प्रदान किया।', en: 'Dharanendra spread his serpentine hoods and Devi Padmavati lifted a lotus throne.' }
      },
      {
        id: 'd4_q8',
        q: { hi: 'भगवान महावीर स्वामी का जन्म किस पावन नगरी में हुआ था?', en: 'In which holy city was Bhagwan Mahavira born?' },
        options: { hi: ['अयोध्या', 'कुण्डलपुर (कुण्डग्राम)', 'वाराणसी', 'हस्तिनापुर'], en: ['Ayodhya', 'Kundalpur (Kundagram)', 'Varanasi', 'Hastinapur'] },
        answer: 1,
        explanation: { hi: 'भगवान महावीर का जन्म चैत्र शुक्ल त्रयोदशी को कुण्डलपुर में राजा सिद्धार्थ और माता त्रिशला के यहाँ हुआ।', en: 'Lord Mahavira was born to King Siddhartha and Queen Trishala at Kundalpur.' }
      },
      {
        id: 'd4_q9',
        q: { hi: 'तीर्थंकर भगवान की दिव्य देशना किस विशेष सभा में होती है?', en: 'In which divine celestial assembly does a Tirthankara deliver sermons?' },
        options: { hi: ['राजदरबार', 'समवशरण', 'युद्धभूमि', 'स्वर्गलोक'], en: ['Royal court', 'Samavasarana', 'Battlefield', 'Heavenly realm'] },
        answer: 1,
        explanation: { hi: 'देवों द्वारा रचित दिव्य समवशरण में सभी प्राणी (मनुष्य, देव, तिर्यंच) वैरभाव भूलकर धर्मोपदेश सुनते हैं।', en: 'Samavasarana is the universal preaching assembly where all beings listen peacefully.' }
      },
      {
        id: 'd4_q10',
        q: { hi: '२० तीर्थंकरों की निर्वाण भूमि कौन सा परम पावन तीर्थ है?', en: 'Which supreme pilgrimage is the Nirvana land of 20 Tirthankaras?' },
        options: { hi: ['सम्मेद शिखरजी', 'गिरनार जी', 'पावापुरी', 'चंपापुर'], en: ['Sammed Shikharji', 'Girnar Ji', 'Pawapuri', 'Champapur'] },
        answer: 0,
        explanation: { hi: 'श्री सम्मेद शिखरजी (झारखंड) से २० तीर्थंकर और अनंतानंत मुनिराज मोक्ष पधारे हैं।', en: 'Shree Sammed Shikharji is the hallowed hill where 20 Tirthankaras attained Nirvana.' }
      }
    ]
  },
  {
    id: 'lesson_day_5',
    dayOfMonth: 5,
    title: { hi: 'जैन दर्शन के सात तत्त्व', en: 'Seven Fundamentals (Tattvas)' },
    subtitle: { hi: 'जीव, अजीव, आस्रव, बंध, संवर, निर्जरा एवं मोक्ष का स्वरूप', en: 'Jiva, Ajiva, Asrava, Bandha, Samvara, Nirjara & Moksha' },
    category: 'सिद्धांत',
    icon: '💎',
    level: '0/2 स्तर',
    xpReward: 120,
    readTimeMinutes: 5,
    summary: {
      hi: 'तत्त्वार्थ सूत्र के अनुसार इन सात तत्त्वों का यथार्थ श्रद्धान ही सम्यग्दर्शन है।',
      en: 'According to Tattvartha Sutra, right conviction in these seven fundamentals constitutes Samyag Darshan.'
    },
    keyPoints: {
      hi: [
        '१. जीव: जिसमें ज्ञान और दर्शन रूप चेतना हो।',
        '२. अजीव: जो चेतना रहित, जड़ द्रव्य हो (पुद्गल, धर्म, अधर्म, आकाश, काल)।',
        '३. आस्रव: कर्मों का आत्मा की ओर आना।',
        '४. बंध: कर्मों का आत्मा के साथ दूध-पानी की तरह बंध जाना।',
        '५. संवर: नवीन कर्मों के आने को पूर्णतः रोक देना।',
        '६. निर्जरा: पहले से बंधे हुए कर्मों को तप-साधना से आंशिक रूप से नष्ट करना।',
        '७. मोक्ष: समस्त कर्मों का सर्वथा नष्ट हो जाना और आत्मा का शुद्ध स्वरूप प्रकट होना।'
      ],
      en: [
        '1. Jiva: Conscious soul endowed with knowing and perceiving.',
        '2. Ajiva: Non-living insentient matter and substances.',
        '3. Asrava: Inflow of karmic matter into the soul.',
        '4. Bandha: Infiltration and bondage of karma with soul.',
        '5. Samvara: Stoppage of fresh karmic inflow.',
        '6. Nirjara: Shedding and burning of accumulated karmas.',
        '7. Moksha: Total liberation and pristine state of soul.'
      ]
    },
    fullContent: {
      hi: `आचार्य उमास्वामी ने तत्त्वार्थ सूत्र के प्रथम अध्याय में कहा है: "तत्त्वार्थश्रद्धानं सम्यग्दर्शनम्"।
संसार रूपी नाव में कर्मों का पानी आना "आस्रव" है, पानी का नाव में भर जाना "बंध" है, छेद को बंद करके पानी का आना रोक देना "संवर" है, नाव में भरे पानी को उलीचना "निर्जरा" है, और नाव का सकुशल पार हो जाना "मोक्ष" है।
यह सात तत्त्वों का ज्ञान ही आत्मोद्धार का राजमार्ग है।`,
      en: `The seven tattvas form the analytical framework of Jain metaphysics. Using the boat metaphor: water entering the boat is Asrava, water accumulating is Bandha, plugging the leak is Samvara, bailing water out is Nirjara, and reaching the destination safely is Moksha.`
    },
    questions: [
      {
        id: 'd5_q1',
        q: { hi: 'जैन दर्शन में मूल तत्त्वों की संख्या कितनी है?', en: 'How many fundamental Tattvas are there in Jain philosophy?' },
        options: { hi: ['५', '७ तत्त्व', '९', '१२'], en: ['5', '7 Tattvas', '9', '12'] },
        answer: 1,
        explanation: { hi: 'जीव, अजीव, आस्रव, बंध, संवर, निर्जरा और मोक्ष — ये सात मूल तत्त्व हैं।', en: 'The seven core tattvas are Jiva, Ajiva, Asrava, Bandha, Samvara, Nirjara, and Moksha.' }
      },
      {
        id: 'd5_q2',
        q: { hi: 'कर्मों का आत्मा की ओर आना किस तत्त्व के अंतर्गत आता है?', en: 'The inflow of karmic particles towards the soul is called which Tattva?' },
        options: { hi: ['संवर', 'आस्रव', 'निर्जरा', 'अजीव'], en: ['Samvara', 'Asrava', 'Nirjara', 'Ajiva'] },
        answer: 1,
        explanation: { hi: 'मन, वचन, काय के योग से कर्मों का आगमन "आस्रव" कहलाता है।', en: 'Asrava is the influx of karmic dust attracted by activities of mind, speech, and body.' }
      },
      {
        id: 'd5_q3',
        q: { hi: 'नए कर्मों के आने को रोकने की क्रिया को क्या कहते हैं?', en: 'What is the cessation or stoppage of new karmic influx called?' },
        options: { hi: ['संवर', 'बंध', 'आस्रव', 'पुण्य'], en: ['Samvara', 'Bandha', 'Asrava', 'Punya'] },
        answer: 0,
        explanation: { hi: 'गुप्ति, समिति, धर्म और अनुप्रेक्षा द्वारा कर्मों के द्वार को बंद करना "संवर" है।', en: 'Samvara is the stoppage of inflow of new karma through self-discipline and meditation.' }
      },
      {
        id: 'd5_q4',
        q: { hi: 'पूर्व में संचित कर्मों को तप के द्वारा सुखाकर नष्ट करना क्या कहलाता है?', en: 'The shedding and destruction of past accumulated karmas through penance is called?' },
        options: { hi: ['निर्जरा', 'आस्रव', 'बंध', 'पाप'], en: ['Nirjara', 'Asrava', 'Bandha', 'Papa'] },
        answer: 0,
        explanation: { hi: 'तपसा निर्जरा च — तप द्वारा कर्मों का झड़ना निर्जरा है।', en: 'Nirjara is the burning off and shedding of accumulated past karmas.' }
      },
      {
        id: 'd5_q5',
        q: { hi: 'समस्त आठों कर्मों से सर्वथा मुक्त होकर सिद्ध बन जाना क्या है?', en: 'Complete liberation from all eight karmic bondages is called?' },
        options: { hi: ['मोक्ष', 'स्वर्ग', 'नरक', 'संसार'], en: ['Moksha', 'Heaven', 'Hell', 'Samsara'] },
        answer: 0,
        explanation: { hi: 'सकल कर्ममल का नाश होकर आत्मा का सिद्धशिला पर विराजमान होना मोक्ष है।', en: 'Moksha is supreme eternal liberation, dwelling in bliss at Siddhashila.' }
      },
      {
        id: 'd5_q6',
        q: { hi: 'जीव तत्त्व का मुख्य लक्षण क्या है?', en: 'What is the essential defining characteristic of Jiva (Soul)?' },
        options: { hi: ['उपयोग (ज्ञान और दर्शन चेतना)', 'स्पर्श, रस, गंध, वर्ण', 'चलना और फिरना', 'आकार बदलना'], en: ['Upayoga (Consciousness of Knowledge and Perception)', 'Touch, taste, smell, color', 'Walking and wandering', 'Changing shape'] },
        answer: 0,
        explanation: { hi: 'तत्त्वार्थ सूत्र: "उपयोगो लक्षणम्" — चेतना ही आत्मा का असाधारण लक्षण है।', en: 'Consciousness (Upayoga), comprising knowing and perceiving, defines the soul.' }
      },
      {
        id: 'd5_q7',
        q: { hi: 'अजीव द्रव्य में कौन-सा द्रव्य रूपी (मूर्तिक) होता है?', en: 'Which among the non-living substances possesses physical form and touch/taste?' },
        options: { hi: ['पुद्गल', 'धर्म', 'अधर्म', 'आकाश'], en: ['Pudgala (Matter)', 'Dharma', 'Adharma', 'Akasha'] },
        answer: 0,
        explanation: { hi: 'पुद्गल द्रव्य ही स्पर्श, रस, गंध और वर्ण वाला रूपी द्रव्य है।', en: 'Pudgala (matter/energy) is the only substance possessing sensory form and color.' }
      },
      {
        id: 'd5_q8',
        q: { hi: 'कर्मों का आत्मा के प्रदेशों से एकीभाव हो जाना क्या कहलाता है?', en: 'The intermingling and binding of karma with the soul is termed?' },
        options: { hi: ['बंध तत्त्व', 'संवर', 'निर्जरा', 'अजीव'], en: ['Bandha Tattva', 'Samvara', 'Nirjara', 'Ajiva'] },
        answer: 0,
        explanation: { hi: 'कषायों के वशीभूत होकर कर्मों का आत्मा के साथ मिल जाना बंध है।', en: 'Bandha is the binding of karmic particles with soul due to passions (Kashayas).' }
      },
      {
        id: 'd5_q9',
        q: { hi: 'सात तत्त्वों में पुण्य और पाप जोड़ने पर क्या बन जाते हैं?', en: 'When Punya and Papa are added to the seven Tattvas, what do they become?' },
        options: { hi: ['नव पदार्थ (Nine Padarthas)', 'दस धर्म', 'बारह व्रत', 'चौदह गुणस्थान'], en: ['Nine Padarthas (Nav Padartha)', 'Ten Dharmas', 'Twelve Vows', 'Fourteen Gunasthanas'] },
        answer: 0,
        explanation: { hi: 'सात तत्त्व + पुण्य + पाप = नव पदार्थ कहलाते हैं।', en: 'The seven tattvas plus Punya (merit) and Papa (demerit) constitute the Nine Padarthas.' }
      },
      {
        id: 'd5_q10',
        q: { hi: '"तत्त्वार्थश्रद्धानं सम्यग्दर्शनम्" सूत्र किस आचार्य की अमर कृति है?', en: 'Who composed the immortal aphorism "Tattvarthashraddhanam Samyagdarshanam"?' },
        options: { hi: ['आचार्य उमास्वामी', 'आचार्य कुंदकुंद', 'आचार्य समंतभद्र', 'आचार्य विद्यासागर जी'], en: ['Acharya Umaswami', 'Acharya Kundakunda', 'Acharya Samantabhadra', 'Acharya Vidyasagar Ji'] },
        answer: 0,
        explanation: { hi: 'यह सूत्र आचार्य उमास्वामी विरचित तत्त्वार्थ सूत्र का सर्वप्रमुख प्रथम सूत्र है।', en: 'Acharya Umaswami penned this foundational aphorism in the revered Tattvartha Sutra.' }
      }
    ]
  }
];

// Helper to calculate deterministic day of month (1-30) for daily exam paper
export function getTodayExamDayNumber(date: Date = new Date()): number {
  const day = date.getDate();
  // Ensure day falls within available lessons range (1 to PATHSHALA_LESSONS_30_DAYS.length)
  const len = PATHSHALA_LESSONS_30_DAYS.length;
  const modDay = ((day - 1) % len) + 1;
  return modDay;
}

export function getTodayDailyLesson(date: Date = new Date()): DailyLesson {
  const dayNum = getTodayExamDayNumber(date);
  const found = PATHSHALA_LESSONS_30_DAYS.find(l => l.dayOfMonth === dayNum);
  return found || PATHSHALA_LESSONS_30_DAYS[0];
}

export function getPracticeExamQuestions(count: number = 10): ExamQuestion[] {
  const allQuestions: ExamQuestion[] = [];
  PATHSHALA_LESSONS_30_DAYS.forEach(l => {
    allQuestions.push(...l.questions);
  });
  
  // Shuffle array
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Local storage management for exam results
const LOCAL_STORAGE_EXAM_RESULTS_KEY = 'jainism_gpt_exam_submissions_v1';
const LOCAL_STORAGE_USER_XP_KEY = 'jainism_gpt_user_pathshala_xp';

export function getSavedExamSubmissions(): UserExamSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EXAM_RESULTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved exam submissions', e);
    return [];
  }
}

export function saveExamSubmission(submission: UserExamSubmission): void {
  try {
    const existing = getSavedExamSubmissions();
    const updated = [submission, ...existing.filter(s => s.id !== submission.id)];
    localStorage.setItem(LOCAL_STORAGE_EXAM_RESULTS_KEY, JSON.stringify(updated));
    
    // Add XP
    const currentXp = getSavedUserXp();
    localStorage.setItem(LOCAL_STORAGE_USER_XP_KEY, String(currentXp + submission.xpEarned));
  } catch (e) {
    console.error('Failed to save exam submission', e);
  }
}

export function getSavedUserXp(): number {
  try {
    const val = localStorage.getItem(LOCAL_STORAGE_USER_XP_KEY);
    return val ? parseInt(val, 10) || 0 : 350; // default starter XP
  } catch (e) {
    return 350;
  }
}
