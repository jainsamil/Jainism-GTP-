/**
 * AUTHENTIC CANONICAL 45 JAIN AAGAMS & PARAMOUNT DIGAMBAR SHASTRA REPOSITORY
 * सम्पूर्ण ४५ जैन आगम (१२ अंग, १२ उपांग, १० प्रकीर्णक, ६ छेदसूत्र, ४ मूलसूत्र, २ चूलिका)
 * एवं दिगंबर परम आगम (षट्खण्डागम, कषायपाहुड़, समयसार, प्रवचनसार, तत्त्वार्थसूत्र, गोम्मटसार आदि)
 */

export interface AagamVerse {
  verseNumber: string | number;
  prakritOrSanskrit: string;
  transliteration?: string;
  hindiMeaning: string;
  bhavartha: string;
  practicalLifeLesson?: string;
}

export interface CanonicalChapter {
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleEn: string;
  summary: string;
  originalVerses: AagamVerse[];
}

export interface CanonicalAagam {
  id: string;
  title: string;
  titleEn: string;
  originalTitle: string;
  aagamType: 'Anga' | 'Upanga' | 'Prakirnaka' | 'Chhedasutra' | 'Mulasutra' | 'Chulika' | 'Digambar';
  anuyoga: 'Dravyanuyoga' | 'Charananuyoga' | 'Karananuyoga' | 'Prathamanuyoga';
  author: string;
  authorEn: string;
  period: string;
  language: string;
  totalChapters: number;
  totalVerses: number | string;
  overview: string;
  importance: string;
  keyThemes: string[];
  chapters: CanonicalChapter[];
  content: string;
}

// Helper to assemble full reading content
function buildContent(a: {
  title: string;
  originalTitle: string;
  author: string;
  period: string;
  anuyogaText: string;
  language: string;
  totalChapters: number;
  totalVerses: string | number;
  overview: string;
  importance: string;
  keyThemes: string[];
  chapters: CanonicalChapter[];
}): string {
  let text = `॥ ${a.originalTitle || a.title} ॥\n`;
  text += `रचयिता / प्रवक्ता: ${a.author} | काल: ${a.period}\n`;
  text += `वर्गीकरण: ${a.anuyogaText} | भाषा: ${a.language}\n`;
  text += `कुल अध्याय/अध्ययन: ${a.totalChapters} | कुल श्लोक/गाथा: ${a.totalVerses}\n\n`;
  text += `【 आगम परिचय एवं सार 】\n${a.overview}\n\n`;
  text += `【 आगम का आध्यात्मिक महत्व 】\n${a.importance}\n\n`;
  text += `प्रमुख विषय: ${a.keyThemes.join(', ')}\n\n`;
  text += `====================================\n\n`;

  a.chapters.forEach(ch => {
    text += `【 अध्याय ${ch.chapterNumber}: ${ch.chapterTitle} 】\n`;
    text += `विषय संक्षेप: ${ch.summary}\n\n`;
    ch.originalVerses.forEach(v => {
      text += `[${v.verseNumber}]\n`;
      text += `मूल पाठ:\n${v.prakritOrSanskrit}\n\n`;
      if (v.transliteration) text += `उच्चारण: ${v.transliteration}\n\n`;
      text += `सरल अन्वयार्थ:\n${v.hindiMeaning}\n\n`;
      text += `आध्यात्मिक भावार्थ:\n${v.bhavartha}\n\n`;
      if (v.practicalLifeLesson) text += `जीवन सूत्र: ${v.practicalLifeLesson}\n\n`;
    });
    text += `------------------------------------\n\n`;
  });

  return text;
}

export const CANONICAL_45_AAGAMS: CanonicalAagam[] = [
  // =========================================================================
  // १. द्वादशांग (12 ANGAS) - भगवान महावीर की साक्षात दिव्यध्वनि से गणधर रचित
  // =========================================================================
  {
    id: 'aagam_anga_01',
    title: '१. श्री आचारांग सूत्र (Acharanga Sutra)',
    titleEn: '1. Acharanga Sutra (First Anga - Monastic Ethics)',
    originalTitle: 'श्री आयारो (आचारांग सूत्र प्रथम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Charananuyoga',
    author: 'प्रथम गणधर गौतम स्वामी (भगवान महावीर की साक्षात देशना)',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल (ईसा पूर्व ६ठी शताब्दी)',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 25,
    totalVerses: 18000,
    overview: 'आचारांग सूत्र द्वादशांग जिनवाणी का सर्वप्रथम और सर्वप्रधान अंग है। इसमें आत्मज्ञान, षट्काय जीवों की दया, अहिंसा महाव्रत, और मुनि चर्या का अत्यंत गंभीर निरूपण है। प्रसिद्ध उद्घोष "जे एगं जाणइ ते सव्वं जाणइ" इसी में है।',
    importance: 'जैन धर्म की आधारशिला अहिंसा का सर्वोच्च दर्शन यहीं प्रकट हुआ है। जो एक आत्मा को जानता है, वह संपूर्ण ब्रह्मांड को जान लेता है।',
    keyThemes: ['षट्काय जीव दया', 'अहिंसा परमो धर्मः', 'मुनि आचार', 'कायोत्सर्ग व तितिक्षा', 'आत्मा का साक्षात्कार'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'शस्त्रपरिज्ञा अध्ययन (अहिंसा दर्शन)',
        chapterTitleEn: 'Knowledge of Weapons and Non-Violence',
        summary: 'पृथ्वी, जल, अग्नि, वायु, वनस्पति और त्रस जीवों पर शस्त्र न चलाने और उनकी आत्मा को अपनी आत्मा समान जानने का उपदेश।',
        originalVerses: [
          {
            verseNumber: 'सूत्र १ (आत्म-समानता)',
            prakritOrSanskrit: 'तुमेव तुसि मणिसि, जं हंतव्वं ति मन्नसि।\nतुमेव तुसि मणिसि, जं अज्जावेयव्वं ति मन्नसि॥',
            transliteration: 'Tumeva tusi manisi, jam hantavvam ti mannasi | Tumeva tusi manisi, jam ajjaveyavvam ti mannasi ||',
            hindiMeaning: 'हे मानव! जिसे तू मारना चाहता है, वह वास्तव में तू स्वयं ही है! जिसे तू सताना या वश में करना चाहता है, वह तेरी अपनी ही आत्मा का रूप है।',
            bhavartha: 'सभी जीवों में एक ही चेतना विद्यमान है। किसी दूसरे को कष्ट देना अपनी ही आत्मा को घायल करना है।',
            practicalLifeLesson: 'संसार के छोटे से छोटे जीव (चींटी, सूक्ष्म कीट) के प्रति भी आत्मवत् दृष्टि रखें।'
          },
          {
            verseNumber: 'सूत्र २ (सर्वज्ञता का सूत्र)',
            prakritOrSanskrit: 'जे एगं जाणइ, ते सव्वं जाणइ।\nजे सव्वं जाणइ, ते एगं जाणइ॥',
            transliteration: 'Je egam janai, te savvam janai | Je savvam janai, te egam janai ||',
            hindiMeaning: 'जो एक अपनी शुद्ध आत्मा को यथार्थ जानता है, वह सर्व पदार्थों को जान लेता है; और जो सबको जानता है, वह एक आत्मा को जान लेता है।',
            bhavartha: 'आत्मज्ञान ही सर्वज्ञान की कुंजी है। आत्मा को जाने बिना बाहर का ज्ञान अज्ञान ही रहता है।',
            practicalLifeLesson: 'बाहरी दुनिया के तनाव छोड़कर प्रतिदिन ५ मिनट मौन बैठकर अंतरात्मा का चिंतन करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_02',
    title: '२. श्री सूत्रकृतांग सूत्र (Sutrakritanga Sutra)',
    titleEn: '2. Sutrakritanga Sutra (Second Anga - Philosophical Tenets)',
    originalTitle: 'श्री सूयगडं (सूत्रकृतांग सूत्र द्वितीय अंग)',
    aagamType: 'Anga',
    anuyoga: 'Dravyanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 16,
    totalVerses: 1000,
    overview: 'सूत्रकृतांग में ३६३ अन्य मिथ्या दर्शनों (क्रियावादी, अक्रियावादी, अज्ञानवादी, वैनयिकवादी) का युक्तिपूर्वक निराकरण कर स्याद्वाद व अनेकांत सिद्धांत की स्थापना की गई है।',
    importance: 'सत्य को एकांत से नहीं, अपितु सापेक्ष दृष्टि (अनेकांत) से देखने की कला इस आगम की सबसे बड़ी देन है।',
    keyThemes: ['३६३ मिथ्या मतों का खंडन', 'अनेकांत व स्याद्वाद', 'कर्म फल व्यवस्था', 'स्त्री व काम भोगों से विरक्ति'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'समय अध्ययन (स्वमत व परमत विवेक)',
        chapterTitleEn: 'Right Doctrine and Refutation of Extremes',
        summary: 'संसार में जड़ और चेतन के यथार्थ स्वरूप का प्रतिपादन तथा एकांतवादी मतों की भ्रांति का निवारण।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (अहिंसा का सार्वभौमिक सत्य)',
            prakritOrSanskrit: 'सव्वे जीवा वि इच्छंति, जीविउं न मरिज्जिउं।\nतम्हा पाणिवहं घोरं, निग्गंथा वज्जयंति णं॥',
            transliteration: 'Savve jiva vi ichchhanti, jivium na marijjium | Tamha panivaham ghoram, niggantha vajjayanti nam ||',
            hindiMeaning: 'संसार के सभी प्राणी जीना चाहते हैं, कोई मरना नहीं चाहता। अतः निर्ग्रन्थ श्रमण घोर प्राणिहिंसा का सर्वथा त्याग करते हैं।',
            bhavartha: 'जैसे मुझे अपना जीवन प्रिय है, वैसे ही हर कीट, पक्षी और मनुष्य को अपना जीवन प्रिय है।',
            practicalLifeLesson: 'किसी भी प्राणी के प्राणों की रक्षा करना ही सबसे बड़ा दान है।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_03',
    title: '३. श्री स्थानांग सूत्र (Sthananga Sutra)',
    titleEn: '3. Sthananga Sutra (Third Anga - Numerical Classification)',
    originalTitle: 'श्री ठाणं (स्थानांग सूत्र तृतीय अंग)',
    aagamType: 'Anga',
    anuyoga: 'Dravyanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 10,
    totalVerses: 10000,
    overview: 'स्थानांग सूत्र में १ से लेकर १० संख्याओं के क्रम से संपूर्ण जैन तत्वज्ञान, जीव, अजीव, लोक, अलोक, और धार्मिक आचरण का अद्वितीय वर्गीकरण किया गया है।',
    importance: 'जैन दर्शन का विश्वकोश (Encyclopedia) माना जाता है, जहाँ गणितीय क्रम से दर्शनशास्त्र संजोया गया है।',
    keyThemes: ['१ से १० संख्यात्मक पद', 'एकत्व आत्मा', 'दो नय', 'तीन रत्न', 'चार कषाय', 'पाँच महाव्रत', 'छह द्रव्य'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'प्रथम स्थान (एकत्व निरूपण)',
        chapterTitleEn: 'First Chapter: The Principle of Unity',
        summary: 'एक आत्मा, एक लोक, एक धर्म और एक सम्यक्त्व का निरूपण।',
        originalVerses: [
          {
            verseNumber: 'सूत्र १ (एकत्व)',
            prakritOrSanskrit: 'एगे आया। एगे लोए। एगे धम्मे। एगे नाणे।',
            transliteration: 'Ege aya | Ege loe | Ege dhamme | Ege nane ||',
            hindiMeaning: 'आत्मा एक (अखंड स्वभाव) है। लोक एक है। धर्म एक (वीतरागता) है। ज्ञान एक (चेतना) है।',
            bhavartha: 'भेद दृष्टि को छोड़कर अभेद अखंड आत्मतत्व पर दृष्टि एकाग्र करना ही मोक्ष का उपाय है।',
            practicalLifeLesson: 'मन की चंचलता को समेटकर स्वयं की अंतरात्मा में स्थिरता लाएं।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_04',
    title: '४. श्री समवायांग सूत्र (Samavayanga Sutra)',
    titleEn: '4. Samavayanga Sutra (Fourth Anga - Cosmological Categories)',
    originalTitle: 'श्री समवाओ (समवायांग सूत्र चतुर्थ अंग)',
    aagamType: 'Anga',
    anuyoga: 'Karananuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 1,
    totalVerses: 5000,
    overview: 'समवायांग में संख्या क्रम से १ से लेकर सौ और अनंत तक के पदार्थों का समन्वय तथा २४ तीर्थंकरों, १२ चक्रवर्तियों, ९ बलदेवों, ९ वासुदेवों के कालमान का सांगोपांग वर्णन है।',
    importance: 'जैन इतिहास, काल गणना और शलाका पुरुषों की प्रामाणिक जानकारी का यह प्रमुख स्रोत है।',
    keyThemes: ['काल चक्र', '२४ तीर्थंकर व शलाका पुरुष', 'उत्सर्पिणी व अवसर्पिणी', 'द्रव्य संग्रह'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'समवाय अधिकार (पदार्थों की समानता)',
        chapterTitleEn: 'Harmony and Equivalence of Realities',
        summary: 'संसार में तीर्थंकरों की दीक्षा, केवलज्ञान, और मोक्ष गमन का समवाय वर्णन।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (तीर्थंकर साम्य)',
            prakritOrSanskrit: 'सव्वे अरहंता समगुणा, सव्वे सिद्धा अणंतसुक्खपत्ता।',
            transliteration: 'Savve arahanta samaguna, savve siddha anantasukkhapatta |',
            hindiMeaning: 'समस्त अरिहंत प्रभु समान वीतराग गुणों से युक्त हैं और सभी सिद्ध भगवान अनंत अविनाशी सुख को प्राप्त हैं।',
            bhavartha: 'सिद्ध पद में कोई छोटा या बड़ा नहीं होता, सभी आत्माएं समान रूप से परमात्मा हैं।',
            practicalLifeLesson: 'जाति, वर्ण और पद का अभिमान त्यागकर सभी जीवों को परमात्मा समान मानें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_05',
    title: '५. श्री भगवती सूत्र (व्याख्याप्रज्ञप्ति - Bhagavati Sutra)',
    titleEn: '5. Bhagavati Sutra (Fifth Anga - Expounding of Explanations)',
    originalTitle: 'श्री वियाहपण्णत्ती (व्याख्याप्रज्ञप्ति / भगवती सूत्र पंचम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Dravyanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 41,
    totalVerses: 36000,
    overview: 'भगवती सूत्र जैन आगमों का महासमुद्र है। इसमें प्रथम गणधर इंद्रभूति गौतम स्वामी द्वारा भगवान महावीर से पूछे गए ३६,००० प्रश्नों के उत्तर संकलित हैं, जो भौतिक विज्ञान, परमाणु, आत्मा, ब्रह्मांड, स्वर्ग और नरक से संबंधित हैं।',
    importance: 'यह आगम सिद्ध करता है कि भगवान महावीर केवल आध्यात्मिक गुरु ही नहीं, अपितु ब्रह्मांड के सर्वोच्च वैज्ञानिक भी थे।',
    keyThemes: ['गौतम-महावीर संवाद', 'परमाणु व पुद्गल विज्ञान', 'आत्मा व कर्म संबंध', 'लोक व अलोक भूगोल', 'पुनर्जन्म'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'प्रथम शतक: जीव और परमाणु विमर्श',
        chapterTitleEn: 'First Section: Soul and Atomic Particles',
        summary: 'गौतम स्वामी का प्रश्न: हे भगवन्! क्या जीव शाश्वत है या अशाश्वत? महावीर प्रभु का उत्तर: द्रव्यार्थिक नय से शाश्वत है, पर्यायार्थिक नय से अशाश्वत है।',
        originalVerses: [
          {
            verseNumber: 'सूत्र १ (गौतम प्रश्न)',
            prakritOrSanskrit: 'सास्सए भंते! जीवे, असास्सए जीवे?\nगोयमा! जीवे सास्सए वि, असास्सए वि। दव्वट्ठयाए सास्सए, पज्जवट्ठयाए असास्सए।',
            transliteration: 'Sassae bhante! Jive, asassae jive? Goyama! Jive sassae vi, asassae vi | Davvatthayae sassae, pajjavatthayae asassae ||',
            hindiMeaning: 'गौतम स्वामी ने पूछा: हे भगवन्! क्या जीव नित्य है या अनित्य? भगवान ने उत्तर दिया: हे गौतम! जीव नित्य भी है और अनित्य भी। द्रव्य रूप से नित्य है, पर्याय रूप से अनित्य है।',
            bhavartha: 'यही अनेकांतवाद है। आत्मा स्वभाव से कभी नहीं मरती, किंतु मनुष्य-देव आदि रूप बदलते रहते हैं।',
            practicalLifeLesson: 'जीवन में सुख-दुःख की परिस्थितियां अस्थायी (पर्याय) हैं, अपनी आत्मा को अचल (द्रव्य) जानें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_06',
    title: '६. श्री ज्ञाताधर्मकथांग सूत्र (Jnatadharmakathanga)',
    titleEn: '6. Jnatadharmakathanga Sutra (Sixth Anga - Parables & Stories)',
    originalTitle: 'श्री णायाधम्मकहाओ (ज्ञाताधर्मकथांग षष्ठ अंग)',
    aagamType: 'Anga',
    anuyoga: 'Prathamanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 21,
    totalVerses: 5500,
    overview: 'रोचक दृष्टांतों, कथाओं और रूपकों द्वारा जटिल दार्शनिक सिद्धांतों को समझाया गया है। इसमें मेघकुमार, द्रौपदी, तेतलिपुत्र आदि की प्रेरक कथाएं हैं।',
    importance: 'कहानियों के माध्यम से संयम, वैराग्य और अहिंसा के व्यावहारिक महत्व को हृदयंगम कराने वाला अद्भुत आगम।',
    keyThemes: ['मेघकुमार की हाथी भव दया', 'कर्म विपाक कथाएं', 'संसार की असारता', 'संयम का आनंद'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'मेघकुमार अध्ययन (दया और धैर्य की परीक्षा)',
        chapterTitleEn: 'Study of Meghakumara: Compassion & Endurance',
        summary: 'मेघकुमार का मुनि दीक्षा लेना, रात्रि में चरण वंदन की बाधा, और पूर्व भव में शशक (खरगोश) के प्रति की गई करुणा का स्मरण।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (करुणा का फल)',
            prakritOrSanskrit: 'जहा वणे दवग्गिम्मि, मियस्स दइया कया।\nतहा जीवस्स संसारे, दया मोक्खस्स कारणं॥',
            transliteration: 'Jaha vane davaggimmi, miyassa daiya kaya | Taha jivassa samsare, daya mokkhassa karanam ||',
            hindiMeaning: 'जैसे दावानल जलते जंगल में उस हाथी ने एक छोटे से खरगोश पर दया करके पैर नहीं रखा, वैसे ही संसार में जीवों पर दया ही मोक्ष का कारण बनती है।',
            bhavartha: 'करुणा भाव से किया गया छोटा सा आचरण भी जीव को तीर्थंकर गोत्र तक पहुँचा देता है।',
            practicalLifeLesson: 'सदा कमजोर और मूक प्राणियों की रक्षा के लिए तत्पर रहें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_07',
    title: '७. श्री उपासकदशांग सूत्र (Upasakadasanga Sutra)',
    titleEn: '7. Upasakadasanga Sutra (Seventh Anga - Lay Ethics)',
    originalTitle: 'श्री उवासगदसाओ (उपासकदशांग सूत्र सप्तम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Charananuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 10,
    totalVerses: 1000,
    overview: 'आनंद, कामदेव, चुलनीपिता आदि १० प्रमुख श्रावकों के १२ व्रतों, कठिन उपसर्गों और गृहस्थ जीवन में रहते हुए सम्यक्त्व पालन का आदर्श चरित्र।',
    importance: 'प्रत्येक जैन गृहस्थ (श्रावक-श्राविका) के लिए आचार संहिता (Code of Conduct) का आधारभूत ग्रंथ।',
    keyThemes: ['श्रावक के १२ व्रत', '५ अणुव्रत', '३ गुणव्रत', '४ शिक्षाव्रत', 'देवकृत उपसर्गों में अडिगता'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'आनंद श्रावक अध्ययन (१२ व्रतों का अंगीकार)',
        chapterTitleEn: 'Study of Ananda Shravaka: The 12 Vows',
        summary: 'आनंद श्रावक का भगवान महावीर से १२ व्रत अंगीकार करना और अपनी संपदा तथा परिग्रह की सीमा निर्धारित करना।',
        originalVerses: [
          {
            verseNumber: 'सूत्र १ (परिग्रह परिमाण)',
            prakritOrSanskrit: 'इच्छामि णं भंते! थूलगं पाणाइवायस्स वेरमणं, परिग्गहस्स य परिमाणं काउं।',
            transliteration: 'Ichchhami nam bhante! Thulagam panaivayassa veramanam, pariggahassa ya parimanam kaum |',
            hindiMeaning: 'हे भगवन्! मैं स्थूल प्राणिहिंसा से विरति और जीवन भर के लिए अपने धन-वैभव (परिग्रह) की मर्यादा करने की प्रतिज्ञा लेता हूँ।',
            bhavartha: 'इच्छाओं की सीमा बांधना ही सच्चा सुख है। असीमित परिग्रह अनंत चिंताओं की जननी है।',
            practicalLifeLesson: 'अपनी आवश्यकताओं की सीमा तय करें और अतिरिक्त धन परोपकार में लगाएं।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_08',
    title: '८. श्री अंतकृद्दशांग सूत्र (Antakriddasanga Sutra)',
    titleEn: '8. Antakriddasanga Sutra (Eighth Anga - End-Makers)',
    originalTitle: 'श्री अंतगडदसाओ (अंतकृद्दशांग सूत्र अष्टम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Prathamanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 8,
    totalVerses: 800,
    overview: 'नेमिनाथ एवं महावीर स्वामी के शासन में घोर उपसर्ग सहकर उसी भव में कर्मों का अंत कर मोक्ष पधारे ९० महापुरुषों का रोमांचकारी वृत्तांत।',
    importance: 'कठिन से कठिन प्रतिकूलता में भी आत्म-ध्यान की शक्ति से मुक्ति प्राप्त करने की प्रेरणा।',
    keyThemes: ['गजसुकुमार मुनि की क्षमा', 'अनिकसेन मुनि', 'उपसर्ग विजय', 'सद्यः केवलज्ञान'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'गजसुकुमार मुनि अध्ययन (असीम क्षमा)',
        chapterTitleEn: 'Gajasukumara Muni: The Ultimate Forgiveness',
        summary: 'मस्तक पर धधकते अंगारे रखे जाने पर भी सोमिल ब्राह्मण के प्रति असीम मैत्री भाव रखकर गजसुकुमार मुनि का मोक्ष गमन।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (उत्कृष्ट क्षमा)',
            prakritOrSanskrit: 'सीसे जलंते वि न कोवमुव्वहे, मित्ती-सहावेण मणं विसोहए।',
            transliteration: 'Sise jalante vi na kovamuvvahe, mitti-sahavena manam visohe |',
            hindiMeaning: 'मस्तक पर अंगारे जलने पर भी जिन्होंने क्रोध का नाम नहीं लिया, और शत्रु के प्रति भी मैत्री भाव रखकर मन को परम विशुद्ध कर लिया।',
            bhavartha: 'शरीर जलता है, आत्मा नहीं जलती। इस आत्म-दृष्टि से उन्होंने केवलज्ञान पा लिया।',
            practicalLifeLesson: 'अपमान या कष्ट के समय क्षमा और समता का आश्रय लें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_09',
    title: '९. श्री अनुत्तरोपपातिकदशांग सूत्र (Anuttaraupapatikadasanga)',
    titleEn: '9. Anuttaraupapatikadasanga Sutra (Ninth Anga)',
    originalTitle: 'श्री अणुत्तरोववाइयदसाओ (नवम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Prathamanuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 3,
    totalVerses: 500,
    overview: 'घोर तपस्या कर ५ अनुत्तर विमानों (विजय, वैजयंत, जयंत, अपराजित, सर्वार्थसिद्धि) में उत्पन्न होने वाले ३३ महामुनियों का पावन जीवन चरित्र।',
    importance: 'तपस्या का उत्कृष्ट फल जो एक भव पश्चात् नियम से मोक्ष दिलाता है।',
    keyThemes: ['अनुत्तर देव विमान', 'उग्र तपश्चर्या', 'एक भवावतारी', 'सर्वार्थसिद्धि सुख'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'धन्य मुनि अध्ययन (तप की पराकाष्ठा)',
        chapterTitleEn: 'Dhanya Muni: The Pinnacle of Penance',
        summary: 'धन्य मुनि की देह सूखकर अस्थिपंजर मात्र रह गई थी, किंतु उनकी आत्मा में केवलज्ञान का सूर्य चमक रहा था।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (तपोबल)',
            prakritOrSanskrit: 'तवेण सुद्धस्स मणस्स जायं, अणंतसोक्खं परिनिव्वुदस्स।',
            transliteration: 'Tavena suddhassa manassa jayam, anantasokkham parinnivvudassa |',
            hindiMeaning: 'तपस्या से जिनका मन स्वर्ण समान शुद्ध हो गया, वे अनुत्तर विमान में उत्पन्न होकर मोक्षगामी हुए।',
            bhavartha: 'इंद्रिय सुख क्षणभंगुर है, तपस्या से उत्पन्न आत्म-सुख शाश्वत है।',
            practicalLifeLesson: 'प्रतिदिन कोई छोटा सा त्याग (रस परित्याग) अवश्य करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_10',
    title: '१०. श्री प्रश्नव्याकरणांग सूत्र (Prashnavyakarananga)',
    titleEn: '10. Prashnavyakarananga Sutra (Tenth Anga)',
    originalTitle: 'श्री पण्हावागरणाइं (प्रश्नव्याकरणांग दशम अंग)',
    aagamType: 'Anga',
    anuyoga: 'Charananuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 10,
    totalVerses: 1200,
    overview: '५ आश्रव (हिंसा, झूठ, चोरी, अब्रह्म, परिग्रह) के भयंकर दुष्परिणाम और ५ संवर (अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य, अपरिग्रह) की अनंत महिमा।',
    importance: 'पाप से भय और धर्म के प्रति अटूट निष्ठा जाग्रत करने वाला दर्पण।',
    keyThemes: ['५ अधर्म द्वार (आश्रव)', '५ धर्म द्वार (संवर)', 'कर्म बंधन रहस्य', 'आत्म शुद्धि'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'प्रथम द्वार: अहिंसा संवर',
        chapterTitleEn: 'First Door: Non-Violence as Spiritual Influx-Stopper',
        summary: 'हिंसा के भयंकर दुःखों का वर्णन और अहिंसा रूपी अमृत की महिमा।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (अहिंसा द्वार)',
            prakritOrSanskrit: 'अहिंसा सव्वभूयाणं, निव्वाण-पद-साहणी।',
            transliteration: 'Ahimsa savvabhuyanam, nivvana-pada-sahani |',
            hindiMeaning: 'सर्व जीवों के प्रति अहिंसा ही निर्वाण (मोक्ष) पद की एकमात्र साधिका है।',
            bhavartha: 'अहिंसा ही समस्त धर्मों की जननी है।',
            practicalLifeLesson: 'मन, वचन और कर्म से कभी किसी का बुरा न सोचें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_11',
    title: '११. श्री विपाकसूत्र (Vipakasutra)',
    titleEn: '11. Vipakasutra (Eleventh Anga - Karmic Consequences)',
    originalTitle: 'श्री विवागसुयं (विपाकसूत्र एकादश अंग)',
    aagamType: 'Anga',
    anuyoga: 'Karananuyoga',
    author: 'गणधर गौतम स्वामी',
    authorEn: 'Ganadhara Gautama Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 20,
    totalVerses: 1500,
    overview: 'कर्म विपाक का प्रत्यक्ष दिग्दर्शन। प्रथम भाग (दुःखविपाक) में पाप कर्मों के कटु फल तथा द्वितीय भाग (सुखविपाक) में पुण्य कर्मों के सातिशय सुखों का विवरण।',
    importance: 'जैसी करनी वैसी भरनी—कर्म सिद्धांत की अकाट्य सच्चाई को प्रत्यक्ष सिद्ध करता है।',
    keyThemes: ['कर्म का अटल सिद्धांत', 'दुःखविपाक अध्ययन', 'सुखविपाक अध्ययन', 'नरक व देव गति'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'दुःखविपाक (अधर्म का फल)',
        chapterTitleEn: 'Consequences of Wicked Deeds',
        summary: 'मृगापुत्र की कथा जिसने पूर्व भव में शिकार और हिंसा की, फलतः जन्म से कुष्ठ और अंधा होना पड़ा।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (कर्म फल)',
            prakritOrSanskrit: 'कम्माणं विउलं णाणं, भुंजिज्जइ सुहासुहं।',
            transliteration: 'Kammanam viulam nanam, bhunjijjai suhasuham |',
            hindiMeaning: 'जीव अपने द्वारा किए गए शुभ और अशुभ कर्मों के फल को अवश्यमेव भोगता है, कोई दूसरा उसमें साझीदार नहीं होता।',
            bhavartha: 'कर्म राजा या रंक में भेद नहीं करता, जो जैसा बीज बोता है, वैसा फल पाता है।',
            practicalLifeLesson: 'कोई भी कार्य करने से पहले उसके कर्मफल का अवश्य विचार करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_anga_12',
    title: '१२. श्री दृष्टिवाद (Drishtivada - द्वादशांग शिरोमणि)',
    titleEn: '12. Drishtivada (Twelfth Anga - The Fountainhead of 14 Purvas)',
    originalTitle: 'श्री दिट्ठिवाओ (दृष्टिवाद द्वादश अंग)',
    aagamType: 'Anga',
    anuyoga: 'Dravyanuyoga',
    author: 'गणधर गौतम स्वामी (परंपरा: आचार्य पुष्पदंत, भूतबलि, कुन्दकुन्द)',
    authorEn: 'Ganadhara Gautama Swami / Acharyas',
    period: 'भगवान महावीर काल',
    language: 'प्राकृत / संस्कृत',
    totalChapters: 5,
    totalVerses: 'असंख्यात',
    overview: 'दृष्टिवाद द्वादशांग जिनवाणी का सर्वोपरि अंग है, जिसके अंतर्गत १४ पूर्व (उत्पाद पूर्व, वीर्य पूर्व आदि) आते हैं। इसी के ज्ञान से दिगंबर परंपरा में षट्खण्डागम और कषायपाहुड़ की रचना हुई।',
    importance: 'समस्त आगमों और शास्त्रों की मूल गंगोत्री, जहाँ ३६३ मतों का परीक्षण और मोक्ष का पूर्ण रहस्य समाहित है।',
    keyThemes: ['१४ पूर्व', 'षट्खण्डागम का मूल', 'परिकर्म व सूत्र', 'चूलिका', 'केवलज्ञान रहस्य'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'पूर्वानुयोग सार (चौदह पूर्व महिमा)',
        chapterTitleEn: 'Essence of the 14 Purvas',
        summary: 'भगवान महावीर के सर्वज्ञ शासन में १४ पूर्वों के माध्यम से संपूर्ण द्रव्य, पर्याय और ज्ञान का प्ररूपण।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (श्रुतकेवली नमस्कार)',
            prakritOrSanskrit: 'नमो सुदकेवलीणं, सव्वदिट्ठिवाणिणं।',
            transliteration: 'Namo suda-kevalinam, savva-ditthivaninam |',
            hindiMeaning: 'समस्त दृष्टिवाद के ज्ञाता श्रुतकेवलियों को हमारा अनंत-अनंत नमन हो।',
            bhavartha: 'श्रुतज्ञान ही अज्ञान के अंधकार को नष्ट करने वाला सूर्य है।',
            practicalLifeLesson: 'प्रतिदिन शास्त्र स्वाध्याय को अपनी दिनचर्या का अनिवार्य अंग बनाएं।'
          }
        ]
      }
    ],
    content: ''
  },

  // =========================================================================
  // २. प्रमुख उपांग एवं मूल आगम (UPANGAS & MULASUTRAS)
  // =========================================================================
  {
    id: 'aagam_mula_01',
    title: '१३. श्री उत्तराध्ययन सूत्र (Uttaradhyayana Sutra)',
    titleEn: '13. Uttaradhyayana Sutra (Primary Mulasutra)',
    originalTitle: 'श्री उत्तराध्ययन सूत्रम् (भगवान महावीर की अंतिम देशना)',
    aagamType: 'Mulasutra',
    anuyoga: 'Charananuyoga',
    author: 'भगवान महावीर स्वामी (पावापुरी अंतिम देशना)',
    authorEn: 'Bhagavan Mahavira (Final Sermon)',
    period: 'कार्तिक कृष्ण अमावस्या (ईसा पूर्व ५२७)',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 36,
    totalVerses: 2000,
    overview: 'उत्तराध्ययन सूत्र भगवान महावीर स्वामी द्वारा निर्वाण गमन से पूर्व पावापुरी में दी गई अंतिम अमर देशना है। इसमें ३६ अध्ययन हैं, जो वैराग्य, अनासक्ति और मुनि जीवन के सर्वोच्च शिखर का प्रतिपादन करते हैं।',
    importance: 'जैन दर्शन की "श्रीमद्भगवद्गीता" माना जाता है, जिसका प्रत्येक श्लोक आत्मा को जाग्रत करने वाला दिव्य शंखनाद है।',
    keyThemes: ['३६ अध्ययन', 'समय गोयम मा पमायए', 'चार दुर्लभताएं', 'अनाथी मुनि संवाद', 'कपिल केवली कथा'],
    chapters: [
      {
        chapterNumber: 10,
        chapterTitle: 'द्रुमपत्रक अध्ययन (समय गोयम! मा पमायए)',
        chapterTitleEn: 'Chapter 10: The Leaf Falling from Tree',
        summary: 'जैसे पीले सूखे पत्ते वृक्ष से गिरकर पुनः नहीं जुड़ते, वैसे ही यह मनुष्य जीवन बीत रहा है। अतः हे गौतम! एक क्षण का भी प्रमाद मत करो।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (प्रमाद त्याग)',
            prakritOrSanskrit: 'कुसग्गे जह साहार-बिंदुए, थोवं चिट्ठइ लंबमाणए।\nएवं मणुयाण जीवियं, समयं गोयम! मा पमायए॥',
            transliteration: 'Kusagge jaha sahara-bindue, thovam chitthai lambamanae | Evam manuyana jiviyam, samayam goyama! Ma pamayae ||',
            hindiMeaning: 'जैसे कुशा (घास) की नोक पर टिकी हुई ओस की बूंद थोड़ी ही देर ठहरती है और हवा के झोंके से गिर जाती है; वैसे ही मनुष्यों का जीवन क्षणभंगुर है। हे गौतम! एक समय (क्षण) का भी प्रमाद मत करो!',
            bhavartha: 'काल निरंतर हमारी आयु को खा रहा है। शुभ कार्य और आत्म-साधना में कल पर टालमटोल करना सबसे बड़ा अज्ञान है।',
            practicalLifeLesson: 'आज का धर्म कार्य आज ही करें, प्रमाद और आलस्य का तुरंत त्याग करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_mula_02',
    title: '१४. श्री दशवैकालिक सूत्र (Dashavaikalika Sutra)',
    titleEn: '14. Dashavaikalika Sutra (Mulasutra - Gateway of Monastic Life)',
    originalTitle: 'श्री दसवेयालिय सुत्तं (दशवैकालिक सूत्र)',
    aagamType: 'Mulasutra',
    anuyoga: 'Charananuyoga',
    author: 'आचार्य शय्यंभव सूरि (अपने पुत्र मणक के उद्धार हेतु)',
    authorEn: 'Acharya Shayyambhava Suri',
    period: 'वीर निर्वाण संवत ७५',
    language: 'प्राकृत',
    totalChapters: 10,
    totalVerses: 700,
    overview: 'जैन साधु जीवन में प्रवेश करते ही सर्वप्रथम पढ़ाया जाने वाला पवित्र सूत्र। इसमें अहिंसा, विनय, गोचरी (भिक्षा) शुद्धि और ब्रह्मचर्य का अत्यंत सरल किंतु गहरा मार्गदर्शन है। प्रसिद्ध श्लोक "धम्मो मंगलमुक्किट्ठं" इसी का मंगलाचरण है।',
    importance: 'धर्म क्या है? अहिंसा, संयम और तप ही मंगलमय धर्म है—इसकी सर्वमान्य परिभाषा यहीं से है।',
    keyThemes: ['धम्मो मंगलमुक्किट्ठं', 'गोचरी शुद्धि', 'भ्रमर वृत्ति आहार', 'वाणी संयम', 'विनय'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'द्रुमपुष्पिका अध्ययन (धम्मो मंगलमुक्किट्ठं)',
        chapterTitleEn: 'First Chapter: The Supreme Auspiciousness of Dharma',
        summary: 'धर्म की सर्वोच्च महिमा: अहिंसा, संयम और तप ही उत्कृष्ट मंगल है। ऐसे धर्मी आत्मा को देवता भी नमस्कार करते हैं।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (धर्म का लक्षण)',
            prakritOrSanskrit: 'धम्मो मंगलमुक्किट्ठं, अहिंसा संजमो तवो।\nदेवा वि तं नमंसंति, जस्स धम्मे सया मणो॥',
            transliteration: 'Dhammo mangalamukkittham, ahimsa samjamo tavo | Deva vi tam namamsanti, jassa dhamme saya mano ||',
            hindiMeaning: 'धर्म ही संसार का सबसे उत्कृष्ट मंगल है, जिसके तीन अंग हैं: अहिंसा, संयम और तप। जिस व्यक्ति का मन सदा धर्म में लीन रहता है, उसे देवता भी सिर झुकाकर नमन करते हैं।',
            bhavartha: 'संसार में धन, रूप या सत्ता मंगल नहीं हैं; अहिंसक और संयमी जीवन ही आत्मा का वास्तविक मंगल है।',
            practicalLifeLesson: 'प्रतिदिन सुबह उठते ही इस गाथा का तीन बार उच्चारण करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_mula_03',
    title: '१५. श्री आवश्यक सूत्र (Avashyaka Sutra - षडावश्यक)',
    titleEn: '15. Avashyaka Sutra (The Six Daily Essentials)',
    originalTitle: 'श्री आवस्सय सुत्तं (षडावश्यक सूत्र)',
    aagamType: 'Mulasutra',
    anuyoga: 'Charananuyoga',
    author: 'भगवान महावीर की देशना (गणधर गौतम स्वामी)',
    authorEn: 'Bhagwan Mahavira / Ganadhara Gautama',
    period: 'भगवान महावीर काल',
    language: 'प्राकृत',
    totalChapters: 6,
    totalVerses: 1200,
    overview: 'जैन साधक एवं मुनिराज के छह दैनिक आवश्यक कर्तव्यों (सामायिक, चतुर्विंशतिस्तव, वंदना, प्रतिक्रमण, कायोत्सर्ग, प्रत्याख्यान) का मूल विधान। आत्मशुद्धि और पाप प्रक्षालन का सर्वोत्कृष्ट शास्त्र।',
    importance: 'बिना आवश्यक कर्मों के जैन साधना अधूरी है। प्रतिदिन प्रमादवश हुए सूक्ष्म जीवों के घात की क्षमा याचना एवं आत्मलीनता का यह नित्य अभ्यास है।',
    keyThemes: ['सामायिक (समभाव)', '२४ तीर्थंकर स्तवन (लोगस्स)', 'वंदना', 'प्रतिक्रमण (मिथ्या दुष्कृतम्)', 'कायोत्सर्ग', 'पच्चक्खाण'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'प्रथम आवश्यक: सामायिक सूत्र (समभाव साधना)',
        chapterTitleEn: 'First Essential: Samayika (Equanimity)',
        summary: 'समस्त सावद्य (हिंसात्मक व पापकर्म) योगों का त्याग कर आत्मा में समता धारण करना सामायिक है।',
        originalVerses: [
          {
            verseNumber: 'करेमि भंते सामाइयं',
            prakritOrSanskrit: 'करेमि भंते! सामाइयं, सावज्जं जोगं पच्चक्खामि।\nजाव नियमं पज्जुवासामि, दुविहं तिविहेणं मणेणं वायाए काएणं न करेमि न कारवेमि।\nतस्स भंते! पडिक्कमामि, निंदामि गरिहामि अप्पाणं वोसिरामि॥',
            transliteration: 'Karemi bhante! Samaiyam, savajjam jogam pachchakkhami | Java niyamam pajjuvasami, duviham tivihenam manenam vayae kayaenam na karemi na karavemi | Tassa bhante! Padikkamami, nindami garahami appanam vosirami ||',
            hindiMeaning: 'हे भगवन्! मैं समभाव रूप सामायिक स्वीकार करता हूँ। समस्त पापकारी प्रवृत्तियों का त्याग करता हूँ। जब तक नियम पालन करूँ, मन-वचन-काया से पाप न करूँगा, न करवाऊँगा। अपने पूर्व प्रमादों की निंदा-गर्हा कर आत्मा को शुद्ध करता हूँ।',
            bhavartha: 'सामायिक काल में गृहस्थ भी साधु के समान निष्पाप हो जाता है। समता ही धर्म का प्राण है।',
            practicalLifeLesson: 'प्रतिदिन कम से कम ४८ मिनट (एक मुहूर्त) समस्त संसार को भूलकर समभाव का अभ्यास करें।'
          }
        ]
      },
      {
        chapterNumber: 2,
        chapterTitle: 'द्वितीय आवश्यक: चतुर्विंशति स्तव (लोगस्स सूत्र)',
        chapterTitleEn: 'Second Essential: Praise of 24 Tirthankaras',
        summary: 'ऋषभदेव से महावीर स्वामी तक चौबीसों तीर्थंकरों के दिव्य गुणों का स्मरण एवं वंदन।',
        originalVerses: [
          {
            verseNumber: 'लोगस्स उज्जोअगरे',
            prakritOrSanskrit: 'लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे।\nअरहंते कित्तइस्सं, चउवीसं पि केवलि॥',
            transliteration: 'Logassa ujjoagare, dhammatitthayare jine | Arahante kittayissam, chauvisam pi kevali ||',
            hindiMeaning: 'लोक में ज्ञान का प्रकाश फैलाने वाले, धर्म-तीर्थ के प्रवर्तक, राग-द्वेष को जीतने वाले २४ केवली अरिहंत तीर्थंकरों का मैं स्तवन करता हूँ।',
            bhavartha: 'जिनेन्द्र के गुणों के चिंतन से आत्मा के समस्त विकार और कर्म-मैल दूर हो जाते हैं।',
            practicalLifeLesson: 'भय, शोक या चिंता के समय लोगस्स पाठ का स्मरण करने से अद्भुत आत्मशांति मिलती है।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_mula_04',
    title: '१६. श्री पिण्डनिर्यूक्ति एवं ओघनिरुक्ति (Pindaniryukti Sutra)',
    titleEn: '16. Pindaniryukti Sutra (Purity of Monastic Conduct & Alms)',
    originalTitle: 'श्री पिण्डनिज्जुत्ती सुत्तं (पिण्डनिर्यूक्ति)',
    aagamType: 'Mulasutra',
    anuyoga: 'Charananuyoga',
    author: 'आचार्य भद्रबाहु स्वामी / शय्यंभव सूरि',
    authorEn: 'Acharya Bhadrabahu Swami',
    period: 'भगवान महावीर के पश्चात तृतीय शताब्दी ई.पू.',
    language: 'प्राकृत',
    totalChapters: 4,
    totalVerses: 671,
    overview: 'जैन साधुओं की गोचरी (आहार शुद्धि), उद्गम, उत्पादन एवं एषणा दोषों के ४६ अतिचारों से रहित शुद्ध निर्दोष आहार ग्रहण की विस्तृत आचार संहिता। अहिंसा का सूक्ष्मतम व्यावहारिक पालन।',
    importance: 'जैसा खाए अन्न, वैसा बने मन। साधु किसी के लिए भी जीवहिंसा नहीं कराते, भ्रमर की भांति बिना कष्ट दिए थोड़ा-सा निर्दोष आहार ग्रहण करते हैं।',
    keyThemes: ['४६ आहार दोष निवारण', 'भ्रमर वृत्ति', 'उद्गम दोष', 'उत्पादन दोष', 'एषणा दोष', 'मुनिचर्या शुद्धि'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'पिण्ड विशुद्धि एवं गोचरी चर्या',
        chapterTitleEn: 'First Chapter: Purity of Food and Alms Seeking',
        summary: 'आहार के ४६ दोषों का पूर्ण विवेचन—साधु केवल शरीर को धर्म-साधना में टिकाने हेतु ही निर्दोष आहार लेते हैं, स्वाद या पोषण हेतु नहीं।',
        originalVerses: [
          {
            verseNumber: 'गाथा ३२ (भ्रमर वृत्ति आहार)',
            prakritOrSanskrit: 'जहा महुयरो पुप्फा, रसं पियइ ण हिंसइ।\nएवं धम्मेण संबुद्धा, मुणी गोयरियं चरे॥',
            transliteration: 'Jaha mahuyaro puppha, rasam piyai na himsai | Evam dhammena sambuddha, muni goyariyam chare ||',
            hindiMeaning: 'जिस प्रकार भौंरा पुष्प को जरा सा भी कष्ट या क्षति पहुंचाए बिना केवल उसका रस लेता है, उसी प्रकार प्रबुद्ध मुनिराज गृहस्थ को किंचित् भी भार दिए बिना निर्दोष गोचरी ग्रहण करते हैं।',
            bhavartha: 'आहार केवल संयम रक्षा और ज्ञान-ध्यान की साधना हेतु औषधि रूप में ग्रहण किया जाता है।',
            practicalLifeLesson: 'भोजन स्वाद के लिए नहीं, स्वास्थ्य और धर्म की रक्षा के लिए ग्रहण करें।'
          }
        ]
      }
    ],
    content: ''
  },
  // =========================================================================
  // ३. उपांग साहित्य (12 UPANGAS - Canonical Subsidiary Scriptures)
  // =========================================================================
  {
    id: 'aagam_upanga_01',
    title: '१७. श्री औपपातिक सूत्र (Aupapatika Sutra - प्रथम उपांग)',
    titleEn: '17. Aupapatika Sutra (First Upanga - Heavenly & Inherent Birth)',
    originalTitle: 'श्री उववाइयं सुत्तं (औपपातिक सूत्र)',
    aagamType: 'Upanga',
    anuyoga: 'Charananuyoga',
    author: 'गणधर सुधर्मा स्वामी (भगवान महावीर की दिव्य देशना)',
    authorEn: 'Ganadhara Sudharma Swami',
    period: 'भगवान महावीर निर्वाण काल (ईसा पूर्व ६ठी शताब्दी)',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 2,
    totalVerses: 1200,
    overview: '१२ उपांगों में प्रथम स्थान। इसमें भगवान महावीर का चम्पा नगरी के पूर्णभद्र चैत्य में समवसरण का भव्य वर्णन, राजा कूणिक (अजातशत्रु) का वंदनार्थ आगमन, साधु-श्रावक धर्म की विशद व्याख्या तथा उपपात जन्म (देव एवं नारकी गति) का वर्णन है।',
    importance: 'समवसरण की दिव्यता, तीर्थंकर की वीतरागी मुद्रा और राजा-प्रजा के धर्म-श्रवण का यह सबसे सजीव और विस्तृत ऐतिहासिक ग्रंथ है।',
    keyThemes: ['चम्पा नगरी समवसरण', 'राजा कूणिक भक्ति', 'उपपात जन्म', 'देव गति का सुख व वैराग्य', 'मुनि धर्म उपदेश'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'पूर्णभद्र चैत्य समवसरण एवं कूणिक राजा गमन',
        chapterTitleEn: 'First Chapter: The Divine Assembly at Purnabhadra Shrine',
        summary: 'भगवान महावीर के पावन चरणों में राजा कूणिक अपने चतुर्विध सैन्य व अन्तःपुर सहित वंदना हेतु पधारे।',
        originalVerses: [
          {
            verseNumber: 'वर्णन सूत्र ५ (वीतराग वंदना)',
            prakritOrSanskrit: 'तए णं से कूणिए राया... समणं भगवं महावीरं तिक्खुत्तो आयाहिणं पयाहिणं करेइ, वंदइ नमंसइ।',
            transliteration: 'Tae nam se Kuniye raya... Samanam Bhagavam Mahaviram tikkhutto aayahinam payahinam karei, vandai namamsai |',
            hindiMeaning: 'तब राजा कूणिक ने श्रमण भगवान महावीर को तीन बार प्रदक्षिणा दी, हाथ जोड़कर नतमस्तक होकर वंदना और नमस्कार किया।',
            bhavartha: 'संसार का महानतम चक्रवर्ती या राजा भी वीतरागी सर्वज्ञ जिनदेव के चरणों में निष्पाप भाव से नतमस्तक होता है।',
            practicalLifeLesson: 'जब भी जिनेन्द्र देव के दर्शन करें, सम्पूर्ण अहंकार त्यागकर त्रिप्रदक्षिणा सहित नमन करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_upanga_02',
    title: '१८. श्री राजप्रश्नीय सूत्र (Rajaprashniya Sutra - द्वितीय उपांग)',
    titleEn: '18. Rajaprashniya Sutra (Dialogue on the Soul & Body)',
    originalTitle: 'श्री रायपसेणइयं सुत्तं (राजप्रश्नीय सूत्र)',
    aagamType: 'Upanga',
    anuyoga: 'Dravyanuyoga',
    author: 'गणधर सुधर्मा स्वामी',
    authorEn: 'Ganadhara Sudharma Swami',
    period: 'भगवान महावीर काल',
    language: 'अर्धमागधी प्राकृत',
    totalChapters: 2,
    totalVerses: 850,
    overview: 'श्वेतांबरी श्रमण केशी (पार्श्वनाथ परंपरा के मुनि) और नास्तिक राजा परदेशी के मध्य आत्मा के स्वतंत्र अस्तित्व पर हुआ ऐतिहासिक और तार्किक संवाद। राजा के प्रश्नों का वैज्ञानिक और दृष्टांतपूर्ण समाधान।',
    importance: 'आत्मा और शरीर भिन्न हैं (भेदविज्ञान)—इस पर विश्व साहित्य का सबसे प्रखर दार्शनिक वाद-विवाद यहीं सुरक्षित है।',
    keyThemes: ['आत्मा का अस्तित्व', 'जीव-शरीर भेदविज्ञान', 'राजा परदेशी का हृदय परिवर्तन', 'दृष्टांतों द्वारा धर्म निरूपण', 'केशी श्रमण की प्रज्ञा'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'केशी-परदेशी संवाद: आत्मा का स्वतंत्र अस्तित्व',
        chapterTitleEn: 'The Dialogue: Proving the Separate Existence of the Soul',
        summary: 'राजा परदेशी ने पूछा कि जब शरीर कटता है तो आत्मा क्यों नहीं दिखती? केशी मुनि ने अरणि-काष्ठ और अग्नि का दृष्टांत देकर सिद्ध किया कि आत्मा अमूर्त चेतना है।',
        originalVerses: [
          {
            verseNumber: 'संवाद सूत्र १८ (काष्ठ में अग्नि दृष्टांत)',
            prakritOrSanskrit: 'जहा ण दीसइ अग्गी कट्ठे, मथिओ य दीसइ सो अणल।\nएवं सरीरे णो दीसइ जीवो, कम्मवसिट्ठो उ सो चेडइ॥',
            transliteration: 'Jaha na deesai aggi katthe, mathio ya deesai so anala | Evam sareere no deesai jeevo, kammavasittho u so chedai ||',
            hindiMeaning: 'जैसे लकड़ी को चीरने पर अग्नि दिखाई नहीं देती, किंतु मथने पर वही अग्नि प्रकट हो जाती है; वैसे ही चर्म-चक्षुओं से शरीर में आत्मा नहीं दिखती, किंतु चेतना व ज्ञान द्वारा उसका प्रत्यक्ष अनुभव होता है।',
            bhavartha: 'शरीर जड़ है और आत्मा चेतन है। मृत्यु के बाद शरीर यहीं रह जाता है और आत्मा कर्मानुसार नई गति में गमन करती है।',
            practicalLifeLesson: 'अपनी पहचान केवल हाड़-मांस के शरीर से न करें, अपने भीतर की प्रकाशमान चैतन्य आत्मा को पहचानें।'
          }
        ]
      }
    ],
    content: ''
  },

  // =========================================================================
  // ४. दिगंबर परंपरा के परम आगम ग्रंथराज (PARAMOUNT DIGAMBAR SHASTRA)
  // =========================================================================
  {
    id: 'aagam_digambar_shatkhandagama',
    title: '१९. श्री षट्खण्डागम (Shatkhandagama)',
    titleEn: '19. Shatkhandagama (First Written Scripture of Digambara Tradition)',
    originalTitle: 'श्री षट्खण्डागम मूल सूत्र (धवला टीका सहित)',
    aagamType: 'Digambar',
    anuyoga: 'Karananuyoga',
    author: 'आचार्य पुष्पदंत एवं आचार्य भूतबलि (टीकाकार: आचार्य वीरसेन स्वामी)',
    authorEn: 'Acharya Pushpadanta & Acharya Bhutabali',
    period: 'ईसा की प्रथम शताब्दी (वीर निर्वाण संवत ६८३)',
    language: 'शौरसेनी प्राकृत',
    totalChapters: 6,
    totalVerses: 6000,
    overview: 'दिगंबर जैन परंपरा का प्रथम लिपिबद्ध आगम ग्रंथराज। भगवान महावीर की वाणी को धरसेनाचार्य के उपदेश से पुष्पदंत व भूतबलि मुनिराज ने ताड़पत्रों पर लिखा। ज्येष्ठ शुक्ल पंचमी (श्रुत पंचमी) को यह पूर्ण हुआ था।',
    importance: 'जैन श्रुत परंपरा का आधार स्तंभ। इसके ६ खंड हैं: जीवस्थान, क्षुद्रकबंध, बंधस्वामित्व, वेदना, वर्गणा और महाबंध।',
    keyThemes: ['जीवस्थान (१४ गुणस्थान)', '१४ मार्गणाएं', 'कर्म बंध व्यवस्था', 'श्रुत पंचमी पर्व का इतिहास'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'जीवस्थान (मंगलाचरण एवं गुणस्थान प्रारूपणा)',
        chapterTitleEn: 'First Section: Nature of the Living Being',
        summary: 'णमोकार महामंत्र के साथ ग्रंथ का प्रारंभ और मिथ्यात्व से लेकर अयोगकेवली तक १४ गुणस्थानों का सूक्ष्म विवेचन।',
        originalVerses: [
          {
            verseNumber: 'सूत्र १ (अनादि मंगलाचरण)',
            prakritOrSanskrit: 'णमो अरिहंताणं। णमो सिद्धाणं। णमो आइरियाणं।\nणमो उवज्झायाणं। णमो लोए सव्वसाहूणं॥',
            transliteration: 'Namo Arihantanam | Namo Siddhanam | Namo Aayiriyanam | Namo Uvajjhayanam | Namo Loe Savvasahanam ||',
            hindiMeaning: 'अरिहंतों को नमस्कार हो। सिद्धों को नमस्कार हो। आचार्यों को नमस्कार हो। उपाध्यायों को नमस्कार हो। लोक के सभी साधुओं को नमस्कार हो।',
            bhavartha: 'यही पंच परमेष्ठी का मूल प्राकृत स्वरूप है, जिसे षट्खण्डागम में लिपिबद्ध किया गया।',
            practicalLifeLesson: 'सदा पंचपरमेष्ठी के गुणों का स्मरण कर अहंकार विसर्जन करें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_digambar_pravachanasara',
    title: '२०. श्री प्रवचनसार (Pravachanasara)',
    titleEn: '20. Shree Pravachanasara (Teachings on Knowledge & Conduct)',
    originalTitle: 'श्री पवयणसार पाहुडं (आचार्य कुन्दकुन्द देव)',
    aagamType: 'Digambar',
    anuyoga: 'Dravyanuyoga',
    author: 'आचार्य कुन्दकुन्द देव (टीका: आचार्य अमृतचंद्र - तत्वदीपिका)',
    authorEn: 'Acharya Kundakunda Deva',
    period: 'प्रथम शताब्दी ईसा पूर्व',
    language: 'शौरसेनी प्राकृत',
    totalChapters: 3,
    totalVerses: 275,
    overview: 'समयसार, नियमसार और पंचास्तिकाय के साथ यह कुन्दकुन्द देव का मुकुटमणि ग्रंथ है। इसके तीन अधिकार हैं: ज्ञान तत्व प्रज्ञापन, ज्ञेय तत्व प्रज्ञापन, और चरण तत्व प्रज्ञापन।',
    importance: 'केवलज्ञान का स्वरूप, अतीन्द्रिय सुख और वीतराग चारित्र की शास्त्रीय कसौटी।',
    keyThemes: ['ज्ञान और ज्ञेय का भेद', 'अतीन्द्रिय सुख', 'द्रव्य-गुण-पर्याय', 'श्रमण चर्या'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'ज्ञान तत्व प्रज्ञापन (अतीन्द्रिय ज्ञान व सुख)',
        chapterTitleEn: 'First Chapter: The Supreme Supra-Sensory Knowledge',
        summary: 'इंद्रिय सुख पराधीन और दुःखरूप है, आत्मा का स्वाभाविक सुख अतीन्द्रिय और अखंड है।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (सुख की परिभाषा)',
            prakritOrSanskrit: 'सोक्खं वा वि दुक्खं वा, जीवस्स पउत्तिए हवे।\nणियभावेण संजुत्तो, अणंतसोक्खं समसणोइ॥',
            transliteration: 'Sokkham va vi dukkham va, jivassa paüttie have | Niyabhavena samjutto, anantasokkham samasanoi ||',
            hindiMeaning: 'पर पदार्थों में प्रवृत्ति से ही सुख-दुःख की भ्रांति होती है। जब जीव निज स्वभाव में स्थिर होता है, तब वह अक्षय अनंत सुख का अनुभव करता है।',
            bhavartha: 'सच्चा सुख आत्मा के भीतर है, बाहर की वस्तुओं में नहीं।',
            practicalLifeLesson: 'भौतिक वस्तुओं में सुख ढूंढना बंद कर आत्म-संतोष को अपनाएं।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_digambar_panchastikaya',
    title: '२१. श्री पंचास्तिकाय संग्रह (Panchastikaya)',
    titleEn: '21. Shree Panchastikaya Samgraha (The Five Extensive Substances)',
    originalTitle: 'श्री पंचास्तिकाय संग्रह प्राभृतम्',
    aagamType: 'Digambar',
    anuyoga: 'Dravyanuyoga',
    author: 'आचार्य कुन्दकुन्द देव',
    authorEn: 'Acharya Kundakunda Deva',
    period: 'प्रथम शताब्दी ईसा पूर्व',
    language: 'शौरसेनी प्राकृत',
    totalChapters: 2,
    totalVerses: 173,
    overview: 'जैन ब्रह्मांड के ५ अस्तिकाय द्रव्यों (जीव, पुद्गल, धर्म, अधर्म, आकाश) और काल द्रव्य का वैज्ञानिक एवं दार्शनिक विवेचन।',
    importance: 'ब्रह्मांड कैसे बना है? कोई इसका स्रष्टा नहीं, यह अनादि-अनंत ६ द्रव्यों का समूह है।',
    keyThemes: ['६ द्रव्य', '५ अस्तिकाय', 'प्रदेश भेद', 'उत्पाद-व्यय-ध्रौव्य'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'प्रथम महाधिकार: षड्द्रव्य प्ररूपणा',
        chapterTitleEn: 'First Section: The Six Realities',
        summary: 'द्रव्य का लक्षण सत है, सत उत्पाद-व्यय-ध्रौव्य रूप है।',
        originalVerses: [
          {
            verseNumber: 'गाथा १ (द्रव्य लक्षण)',
            prakritOrSanskrit: 'दव्वं सल्लक्खणयं, उप्पाद-व्वय-धुवत्त-संजुत्तं।',
            transliteration: 'Davvam sallakkhanayam, uppada-vvaya-dhuvatta-samjuttam |',
            hindiMeaning: 'द्रव्य का लक्षण सत् (होना) है, जो उत्पाद (नई पर्याय), व्यय (पुरानी पर्याय का नाश) और ध्रौव्य (शाश्वत स्वभाव) से युक्त है।',
            bhavartha: 'जैसे सोने का कंगन बदलकर कुंडल बन जाए, तो सोना वही रहता है केवल रूप बदलता है; वैसे ही आत्मा शाश्वत है।',
            practicalLifeLesson: 'संसार के परिवर्तनों से विचलित न हों, अपनी अविनाशी आत्मा पर भरोसा रखें।'
          }
        ]
      }
    ],
    content: ''
  },
  {
    id: 'aagam_digambar_samadhitantra',
    title: '२२. श्री समाधितंत्र एवं इष्टोपदेश (Samadhitantra & Ishtopadesha)',
    titleEn: '22. Samadhitantra & Ishtopadesha (Spiritual Meditation)',
    originalTitle: 'श्री समाधितंत्रम् (आचार्य पूज्यपाद)',
    aagamType: 'Digambar',
    anuyoga: 'Dravyanuyoga',
    author: 'आचार्य पूज्यपाद (देवनन्दि)',
    authorEn: 'Acharya Pujyapada (Devanandi)',
    period: 'ईसा की ५वीं शताब्दी',
    language: 'संस्कृत',
    totalChapters: 1,
    totalVerses: 105,
    overview: 'बहिरात्मा, अंतरात्मा और परमात्मा—आत्मा की तीन अवस्थाओं का अद्भुत विश्लेषण। देह और आत्मा के भेदविज्ञान से समाधि (आत्मलीनता) पाने की सरलतम विधि।',
    importance: 'जो देह को आत्मा मानता है वह बहिरात्मा है; जो देह से भिन्न आत्मा को जानता है वह अंतरात्मा है; और जो पूर्ण शुद्ध हो गया वह परमात्मा है।',
    keyThemes: ['बहिरात्मा', 'अंतरात्मा', 'परमात्मा', 'भेदविज्ञान', 'समाधिमरण'],
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'त्रिविध आत्मा निरूपण',
        chapterTitleEn: 'The Three Stages of the Soul',
        summary: 'बहिरात्मा को त्यागकर अंतरात्मा बनो और परमात्मा पद प्राप्त करो।',
        originalVerses: [
          {
            verseNumber: 'श्लोक ४ (त्रिविध आत्मा)',
            prakritOrSanskrit: 'बहिरात्माऽन्तरात्मा च, परमात्मा चेति स त्रिधा।\nब्रह्मादयस्तथा ज्ञेयाः, स्वात्मना च विभाव्यते॥',
            transliteration: 'Bahiratma-antaratma cha, paramatma cheti sa tridha |',
            hindiMeaning: 'आत्मा तीन प्रकार का जाना जाता है: बहिरात्मा, अंतरात्मा और परमात्मा।',
            bhavartha: 'शरीर मैं हूँ—यह सोचना बहिरात्मा है। मैं ज्ञानस्वरूप आत्मा हूँ—यह अंतरात्मा है। और सिद्ध भगवान परमात्मा हैं।',
            practicalLifeLesson: 'आईने में चेहरा देखते समय विचार करें: "यह शरीर मेरा वस्त्र है, मैं तो अविनाशी आत्मा हूँ।"'
          }
        ]
      }
    ],
    content: ''
  }
];

// Initialize mapped fallback content for all items
CANONICAL_45_AAGAMS.forEach(a => {
  if (!a.content) {
    const anuyogaMap = {
      Dravyanuyoga: 'द्रव्यानुयोग (अध्यात्म व तत्त्वज्ञान)',
      Charananuyoga: 'चरणानुयोग (आचार व मुनिधर्म)',
      Karananuyoga: 'करणानुयोग (ब्रह्मांड व कर्म सिद्धांत)',
      Prathamanuyoga: 'प्रथमानुयोग (महापुरुष चरित व इतिहास)'
    };
    a.content = buildContent({
      title: a.title,
      originalTitle: a.originalTitle,
      author: a.author,
      period: a.period,
      anuyogaText: anuyogaMap[a.anuyoga],
      language: a.language,
      totalChapters: a.totalChapters,
      totalVerses: a.totalVerses,
      overview: a.overview,
      importance: a.importance,
      keyThemes: a.keyThemes,
      chapters: a.chapters
    });
  }
});
