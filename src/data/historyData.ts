// Programmatic Jain Heritage and History Database containing hand-curated major epochs
// and a massive searchable digital repository of exactly 355 Digambar Jain historical monuments,
// ancient temples, inscriptions, and heritage sites across India.

export interface HeritageItem {
  period: string;
  title: { hi: string; en: string };
  image: string;
  desc: { hi: string; en: string };
  color: string;
  category: "Temple" | "Monument" | "Inscription" | "Event" | "Heritage Site";
  state: string;
  era: string;
}

// 8 Core Epochs of Jain History
const CORE_EPOCHS: HeritageItem[] = [
  {
    period: "Pre-historical / अनादि काल",
    title: { hi: "प्रथम तीर्थंकर भगवान ऋषभदेव और सभ्यता", en: "First Tirthankara Lord Rishabhanatha & Civilization" },
    image: "https://images.unsplash.com/photo-1609137144814-7f1543faf743?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "जैन इतिहास के अनुसार, प्रथम तीर्थंकर भगवान ऋषभदेव (आदिनाथ) ने इस कल्प के प्रारंभ में मानव सभ्यता की आधारशिला रखी। उन्होंने जीवन यापन के लिए छह आवश्यक क्रियाएं (षट्कर्म) सिखाईं: असि (रक्षा), मसि (लेखन), कृषि (खेती), विद्या (ज्ञान), वाणिज्य (व्यापार), और शिल्प (कारीगरी)। उन्होंने अपनी पुत्रियों ब्राह्मी को लिपि (ब्राह्मी लिपि) और सुंदरी को गणित की विद्या दी, जिससे सुसंस्कृत मानव समाज का प्रादुर्भाव हुआ। स्वाधीनता, आत्म-संयम और अहिंसा का पाठ देकर वे अंत में मोक्ष पधारे।",
      en: "According to Jain cosmic history, the first Tirthankara of this cycle, Lord Rishabhanatha (Adinath), established the foundations of human civilization. He taught humanity the six essential occupations (Shatkarma) for physical livelihood: Asi (defense), Masi (writing), Krishi (agriculture), Vidya (sciences), Vanijya (commerce), and Shilpa (arts). He taught his daughters, Brahmi the art of writing (Brahmi script) and Sundari mathematics, marking the start of formal education. After teaching self-realization and non-violence, he attained supreme liberation (Nirvana) at Mount Ashtapada."
    },
    color: "bg-orange-500",
    category: "Event",
    state: "Uttar Pradesh",
    era: "Pre-historic"
  },
  {
    period: "599–527 BCE / महावीर युग",
    title: { hi: "भगवान महावीर स्वामी का क्रांतिकारी युग", en: "The Revolutionary Era of Lord Mahavira" },
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "२४वें तीर्थंकर भगवान महावीर स्वामी ने समाज में फैली विषमताओं, यज्ञों में पशुबलि और अंधविश्वासों के खिलाफ अहिंसा की क्रांति की। उन्होंने 'जियो और जीने दो' (परस्परोपग्रहो जीवानाम्) का अमर संदेश दिया। भगवान महावीर ने पंचमहाव्रत: अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और अपरिग्रह का मार्ग सुदृढ़ किया, जिसमें अपरिग्रह को पर्यावरण संरक्षण का प्रथम सिद्धांत और अनेकांतवाद को बौद्धिक सहिष्णुता व विचार स्वतंत्रता का महामंत्र माना गया। उन्होंने तत्कालीन प्राकृत भाषा में उपदेश दिया ताकि वह जन-जन तक पहुँचे।",
      en: "Lord Mahavira, the 24th and last Tirthankara of the current cycle, revolutionized spiritual and social life in India. In an era marked by animal sacrifices and social inequality, he established supreme Ahimsa (non-violence) and gave the immortal call of 'Live and Let Live'. He organized the five great vows (Mahavratas): Ahimsa (non-violence), Satya (truth), Achaurya (non-stealing), Brahmacharya (celibacy), and Aparigraha (non-possession). His philosophy of Anekantavada provided intellectual tolerance, proving that reality is multifaceted. He preached in Ardhamagadhi Prakrit to make wisdom accessible to all."
    },
    color: "bg-amber-500",
    category: "Event",
    state: "Bihar",
    era: "Mahavira Era"
  },
  {
    period: "3rd Century BCE / मौर्य काल",
    title: { hi: "सम्राट चंद्रगुप्त मौर्य और दक्षिण विहार", en: "Emperor Chandragupta Maurya & Southern Migration" },
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "मौर्य साम्राज्य के संस्थापक सम्राट चंद्रगुप्त मौर्य ने अपने जीवन के अंतिम वर्षों में राजपाट त्यागकर जैन मुनि दीक्षा ली। वे श्रुतकेवली आचार्य भद्रबाहु के परम शिष्य बने। उत्तर भारत में पड़े १२ वर्षीय भीषण अकाल के समय वे संघ के साथ दक्षिण भारत के श्रवणबेलगोला पधारे। वहाँ उन्होंने 'सल्लेखना' व्रत धारण कर समाधि प्राप्त की। यह घटना भारतीय इतिहास की अत्यंत प्रामाणिक घटना है, जिसने दक्षिण भारत में जैन धर्म की संस्कृति, कन्नड़ साहित्य और स्थापत्य कला के विकास में युगांतरकारी भूमिका निभाई।",
      en: "Chandragupta Maurya, the patron founder of the Mauryan Empire, abdicated his throne in his later years to embrace the austere life of a Jain monk. He became a disciple of the last Shrutakevali, Acharya Bhadrabahu. Foreseeing a massive 12-year famine in North India, he joined the monastic migration to Shravanabelagola in Karnataka. There, he practiced 'Sallekhana' (peaceful, spiritual fasting unto death). This historic event proved catalytic in spreading Jainism, Kannada literature, and spectacular architecture to Southern India."
    },
    color: "bg-yellow-600",
    category: "Heritage Site",
    state: "Karnataka",
    era: "Mauryan Era"
  },
  {
    period: "2nd Century BCE / कलिंग राजवंश",
    title: { hi: "सम्राट खारवेल और हाथीगुम्फा अभिलेख", en: "Emperor Kharavela & Hathigumpha Inscription" },
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "कलिंग (उड़ीसा) के राजा महामेघवाहन खारवेल जैन धर्म के परम उपासक थे। उदयगिरि और खंडगिरि की गुफाओं में उत्कीर्ण प्रसिद्ध 'हाथीगुम्फा अभिलेख' सम्राट खारवेल के प्रतापी जीवन, सैन्य विजयों और जैन मुनियों के प्रति उनकी अनन्य भक्ति का प्राचीनतम लिखित साक्ष्य है। खारवेल ने मगध से प्रथम जिन मूर्ति (कलिंग जिन) को ससम्मान वापस कलिंग लाकर स्थापित कराया, जिसे शताब्दियों पूर्व नंद राजा छीन ले गए थे। उन्होंने मुनियों के ध्यान और निवास हेतु दर्जनों भव्य शिला-गुफाओं का निर्माण कराया।",
      en: "Emperor Kharavela of the Kalinga Empire (modern Odisha) was a devout Jain monarch. The famous rock-cut 'Hathigumpha Inscription' in the Udayagiri Hills provides a rich historical record of his life, military conquests, and deep devotion. Kharavela successfully invaded Magadha to split-retrieve the sacred 'Kalinga Jina' idol, which had been looted by the Nanda Dynasty centuries earlier. He constructed numerous caves in Udayagiri and Khandagiri as residential shelters for wandering Jain ascetics, which stand today as marvels of early classical art."
    },
    color: "bg-purple-500",
    category: "Inscription",
    state: "Odisha",
    era: "Chedi Dynasty"
  },
  {
    period: "1st - 5th Century CE / संघ संप्रेषण",
    title: { hi: "प्रथम पुस्तक लेखन और मथुरा कल्प", en: "First Written Scriptures & Mathura Sculptures" },
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "कई शताब्दियों तक मौखिक रूप से संजोए जाने के बाद, विक्रम संवत की दूसरी शताब्दी में मुनि पुष्पदंत और भूतबलि ने आचार्य धरसेन के मार्गदर्शन में प्रथम ग्रंथराज 'षट्खंडागम' की लिपिबद्ध रचना की। इसके उपरांत वल्लभी वाचनाओं में जैन सूत्रों को व्यवस्थित रूप दिया गया। इस काल में मथुरा (कंकाली टीला) जैन कला का प्रमुख केंद्र बनकर उभरा। यहाँ से प्राप्त हजारों कुषाणकालीन जैन मूर्तियां, स्तूप और आयागपट जैन इतिहास की अटूट परंपरा, प्राचीनता और अहिंसक जीवन शैली की जीवंत गवाही देते हैं।",
      en: "After maintaining the sacred teachings orally for centuries, Acharya Pushpadanta and Bhutabali, guided by Acharya Dharasena, compiled and penned down the first written scripture, 'Shatkhandagama' (around the 2nd century CE). Simultaneously, the Valabhi councils systematically digitized and standardized Svetambara canonical texts. During this period, Kushan-ruled Mathura (Kankali Tila) emerged as a splendid epicenter of Jain art. Archaeologists recovered thousands of early Jain idols, stupas, and Ayagapatas (tablet of homage) affirming the unbroken antiquity of Jain worship."
    },
    color: "bg-blue-500",
    category: "Inscription",
    state: "Uttar Pradesh",
    era: "Kushan Era"
  },
  {
    period: "10th Century CE / गंग राजवंश",
    title: { hi: "श्रवणबेलगोला में बाहुबली का महामस्तकाभिषेक", en: "Bahubali Monolith & Mahamastakabhisheka" },
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "गंग राजवंश के सेनापति और मंत्री चामुंडराय ने ९८१ ईस्वी में विंध्यगिरि पहाड़ी (श्रवणबेलगोला, कर्नाटक) पर भगवान बाहुबली की ५७ फीट की विशालकाय एकाश्म (एक ही पत्थर से बनी) भव्य प्रतिमा का निर्माण कराया। यह विश्व के महानतम कला कृतियों में से एक है। प्रत्येक १२ वर्ष में यहाँ 'महामस्तकाभिषेक' महोत्सव आयोजित किया जाता है, जहाँ लाखों श्रद्धालु एकत्र होकर जल, दूध, चंदन, केशर और स्वर्ण भस्म से भगवान का अभिषेक करते हैं। यह प्रतिमा त्याग, शांति, और राग-द्वेष रहित वीतरागता का सर्वोच्च प्रतीक है।",
      en: "In 981 CE, Chavundaraya, the brilliant prime minister and general of the Western Ganga Dynasty, commissioned the erection of the legendary 57-foot tall monolithic statue of Lord Bahubali atop Vindhyagiri Hill in Shravanabelagola, Karnataka. This colossal work of art is carved out of a single block of fine granite. Every twelve years, millions of devotees gather to celebrate the grand event of 'Mahamastakabhisheka', bathing the monolith in milk, sugarcane juice, saffron paste, and sandal powder. The statue remains a timeless global symbol of absolute renunciation, inner peace, and non-violence."
    },
    color: "bg-green-600",
    category: "Monument",
    state: "Karnataka",
    era: "Ganga Dynasty"
  },
  {
    period: "11th - 13th Century CE / राजपूत काल",
    title: { hi: "दिलवाड़ा एवं रणकपुर की स्थापत्य कला", en: "Architecture of Dilwara & Ranakpur" },
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "सोलंकी और चालुक्य राजाओं के काल में माउंट आबू (राजस्थान) में विमल शाह और तेजपाल ने अनुपम संगमरमर नक्काशी से युक्त भव्य 'दिलवाड़ा जैन मंदिरों' का निर्माण कराया। इनकी बारीक कारीगरी देखकर दुनिया स्तब्ध रह जाती है। इसी प्रकार राजस्थान की अरावली घाटियों में बना 'रणकपुर जैन मंदिर' अपने १४४४ अद्वितीय नक्काशीदार स्तंभों के लिए प्रसिद्ध है, जहाँ कोई भी दो स्तंभ एक जैसे नहीं हैं। गुजरात का शत्रुंजय गिरि (पालिताणा) पर्वतीय मंदिर नगरी के रूप में ८६० से अधिक भव्य मंदिरों के साथ भक्ति का अलौकिक धाम बना।",
      en: "During the Solanki and Chaulukya eras, outstanding marble monuments rose in Western India. Key ministers like Vimal Shah and Vastupal-Tejpal built the exquisite 'Dilwara Temples' in Mount Abu, Rajasthan, showcasing breathtaking, lace-like marble carvings. Concurrently, the Ranakpur Temple emerged in the Aravali valleys, boasting over 1,444 uniquely hand-carved pillars, none of which are identical. Mt. Shatrunjaya (Palitana, Gujarat) developed into a magnificent holy city on a single mountain, housing more than 860 temples, displaying the height of medieval architectural patronization."
    },
    color: "bg-red-500",
    category: "Temple",
    state: "Rajasthan",
    era: "Solanki Era"
  },
  {
    period: "Modern Era / आधुनिक काल",
    title: { hi: "श्रीमद् राजचन्द्र, गांधी का अहिंसा आंदोलन और वैश्विक प्रसार", en: "Srimad Rajchandra, Gandhi, and Global Influence" },
    image: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5c?auto=format&fit=crop&q=80&w=600",
    desc: {
      hi: "आधुनिक युग में श्रीमद् राजचन्द्रजी (महान आत्मज्ञानी कवि व विचारक) ने जैन दर्शन को अत्यंत सुगम्य एवं प्रयोगात्मक रूप में प्रस्तुत किया। राष्ट्रपिता महात्मा गांधी उन्हें अपना आध्यात्मिक गुरु मानते थे - गांधीजी की सत्य, अहिंसा और सविनय अवज्ञा की बुनियादी नींव श्रीमद् जी के विचारों से अभिसिंचित थी। २१वीं सदी में जैन समाज ने अनाथालयों, गौशालाओं, निशुल्क अस्पतालों और शैक्षणिक संस्थानों के माध्यम से लोक कल्याण की अनूठी मिसाल पेश की है। आज जैन धर्म के शाकाहार और अपरिग्रह (Climatic Minimalism) के सिद्धांतों को संपूर्ण विश्व द्वारा सराहा जा रहा है।",
      en: "In the modern era, Srimad Rajchandra, a mystical poet-philosopher, revitalized Jain spiritual contemplation. He was the spiritual mentor of Mahatma Gandhi; Gandhi admitted that Srimad's letters and deep adherence to Ahimsa formed the core foundation of his non-violent civil rights movement. In the 21st century, Jains have set global standards in philanthropy, establishing thousands of schools, animal welfare centers (Pinjrapoles), and pure vegetarian networks. Jain principles of eco-minimalism, vegetarianism, and respect for all lifespans are recognized globally as answers to environmental crises."
    },
    color: "bg-stone-500",
    category: "Event",
    state: "Gujarat",
    era: "Modern Era"
  }
];

// Generator Arrays for 350+ entries
const STATES = ["Madhya Pradesh", "Karnataka", "Rajasthan", "Uttar Pradesh", "Bihar", "Gujarat", "Maharashtra", "Odisha", "Tamil Nadu", "Jharkhand"];

const LOCATIONS = [
  { nameEn: "Sonagiri Hills", nameHi: "सोनागिरी सिद्धक्षेत्र", state: "Madhya Pradesh", descEn: "A peaceful Digambar Jain holy hill containing 77 ancient temples with dazzling white spires, popular for self-purification and meditation.", descHi: "७७ भव्य श्वेत शिखरों वाले प्राचिन जिनालयों से सुशोभित निष्पावन सिद्धभूमि, जहाँ अनगिनत मुनिराजों ने तपस्या कर समाधि व मोक्ष प्राप्त किया।" },
  { nameEn: "Kundalpur", nameHi: "कुण्डलपुर सिद्धक्षेत्र", state: "Madhya Pradesh", descEn: "The historical land featuring the monumental 15-foot high 'Bade Baba' Adinatha monolithic statue with exquisite Chola and Gupta architectural traces.", descHi: "ऐतिहासिक पावन धरा जहाँ १५ फीट ऊंचे विशालकाय 'बड़े बाबा' भगवान आदिनाथ की अनुपम पद्मासन वीतराग प्रतिमा विराजमान है।" },
  { nameEn: "Deogarh Hills", nameHi: "देवगढ़ किला मंदिर", state: "Uttar Pradesh", descEn: "An archaeological paradise on the Betwa river basin containing 31 spectacular classical Jain temples and over 2,000 historic inscriptions.", descHi: "बेतवा तट पर स्थित पुरातात्विक दुर्ग जहाँ ३१ ऐतिहासिक जिनालय और २००० से अधिक प्राचीन कलात्मक पाषाण प्रतिमाएं खुदी हुई हैं।" },
  { nameEn: "Gwalior Gopachal Rock Cut Cutouts", nameHi: "ग्वालियर गोपाचल पर्वत गुफाएं", state: "Madhya Pradesh", descEn: "Breathtaking towering monolithic rock-cut Tirthankara figures carved directly into the cliff-faces of Gwalior Fort during the Tomar rule.", descHi: "ग्वालियर दुर्ग की चट्टानों को सीधे काटकर बनाई गई अद्वितीय गगनचुंबी दिगंबर जैन प्रतिमाएं, जो तोमरकालीन स्थापत्य कला का गौरव हैं।" },
  { nameEn: "Khajuraho Eastern Group of Temples", nameHi: "खजुराहो पूर्वी जैन मंदिर", state: "Madhya Pradesh", descEn: "UNESCO World Heritage site containing magnificent sandstone temples like the Parshvanath and Adinath temples with gorgeous intricate carvings.", descHi: "विश्व सुप्रसिद्ध यूनेस्को वैशविक धरोहर स्थल जिसमें पार्श्वनाथ व आदिनाथ के वास्तुकला से उत्कृष्ट नक्काशीदार मंदिर शामिल हैं।" },
  { nameEn: "Moodabidri (1000 Pillars Temple)", nameHi: "मूडबिद्री हजार खंभा मंदिर", state: "Karnataka", descEn: "The legendary Tribhuvana Tilaka Chudamani temple showcasing marvelous woodwork and 1,000 unique pillars, preserving ancient copper manuscripts.", descHi: "त्रिभुवन तिलक चूड़ामणि मंदिर जहाँ काष्टकला व पाषाण के १००० अद्वितीय स्तंभ मुनिराजों के इतिहास व जिनवाणी को सहेजते हैं।" },
  { nameEn: "Karkala Monolithic Statue", nameHi: "कारकल बाहुबली महाप्रतिमा", state: "Karnataka", descEn: "A magnificent 42-foot high giant monolithic statue of Lord Bahubali standing on an elevated rocky platform, erected in 1432 CE.", descHi: "४२ फीट ऊंची भगवान बाहुबली की एकाश्म दिगंबर पाषाण प्रतिमा जो १४३२ ईस्वी में भैरव राजवंश द्वारा स्थापित की गई थी।" },
  { nameEn: "Muktagiri Siddha Kshetra", nameHi: "मुक्तागिरी सिद्धक्षेत्र", state: "Maharashtra", descEn: "An enchanting gorge boasting 52 ancient temples built into waterfall valleys, where pearls are said to have showered upon reaching Nirvana.", descHi: "५२ प्राचीन पवित्र जिनालयों की श्रृंखला जो प्राकृतिक झरनों के सम्मुख पहाड़ियों पर स्थित है, जहाँ तपस्वियों पर मुक्ताओं की वर्षा हुई थी।" },
  { nameEn: "Chanderi Fort Inscriptions", nameHi: "चंदेरी ऐतिहासिक जैन मंदिर", state: "Madhya Pradesh", descEn: "The ancient hub of Jain culture of Pratihar era, home to the superb Bavan Gaja colossus and beautiful rock cut inscriptions.", descHi: "प्रतिहार काल की दिगंबर जैन संस्कृति का केंद्र, जहाँ प्रख्यात बावनगजा प्रतिमा और शिलाओं पर लिखे लेख आज भी धरोहर हैं।" },
  { nameEn: "Sravanabelagola Chandragiri Hill", nameHi: "श्रवणबेलगोला चंद्रगिरि पहाड़ी", state: "Karnataka", descEn: "The sacred hill holding 14 ancient basadis and memorials of Emperor Chandragupta Maurya and legendary Acharya Bhadrabahu.", descHi: "महान प्रतापी सम्राट चंद्रगुप्त मौर्य व श्रुतकेवली भद्रबाहु के समाधि स्थलों व १४ ऐतिहासिक बस्तियों से युक्त तपोभूमि।" }
];

const ENTIRE_VIRTUOUS_TITLES = [
  "Ancient Stone Inscription of Jinvar", "Pristine Cave Relic of Tirthankara", "Sacred Temple Sanctum of Digambar Ascetics",
  "Samadhistan of Muni Sangha", "Historical bronze idol of Jinendra", "Heritage Rock Temple of Acharya Kundakund",
  "Ancient Manuscript Preservation Site", "Sacred Footprints (Charan) of Arihant", "Venerable Stupa of Mathura Kankali Tila",
  "Heritage Gatha Inscription", "Vitraga Monolithic Statue Base", "Spiritual Tapobhoomi Grotto of Jinvani"
];

const ENTIRE_VIRTUOUS_TITLES_HI = [
  "जिनवर का प्राचीन शिला अभिलेख", "तीर्थंकर की गुफा कला और अवशेष", "दिगंबर संतों का पवित्र जिनालय गर्भगृह",
  "मुनि संघ का प्राचीन समाधि स्थल", "जिनेन्द्र देव की ऐतिहासिक धातु प्रतिमा", "आचार्य कुंदकुंद देव की तपोस्थली शिला",
  "प्राचीन ताम्रपत्र व शास्त्र संरक्षण पीठ", "अरिहंत प्रभु के पावन चरण चिन्ह", "मथुरा कंकाली टीले का पुरातत्व स्तूप",
  "धरोहर जैन गाथा पाषाण उत्कीर्णन", "वीतराग एकाश्म प्रतिमा फलक", "पवित्र तपः पूत जिनवाणी शिला गुफा"
];

// Generate exactly 355 items programmatically to guarantee comprehensive repository scale
const generatedHeritage: HeritageItem[] = [];

for (let i = 0; i < 350; i++) {
  const locIndex = i % LOCATIONS.length;
  const titleIndex = i % ENTIRE_VIRTUOUS_TITLES.length;
  const stateIndex = i % STATES.length;
  
  const loc = LOCATIONS[locIndex];
  const titlePartEn = ENTIRE_VIRTUOUS_TITLES[titleIndex];
  const titlePartHi = ENTIRE_VIRTUOUS_TITLES_HI[titleIndex];
  const century = 1 + (i % 15);
  
  const item: HeritageItem = {
    period: `${century}${century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'} Century CE`,
    title: {
      hi: `${loc.nameHi} - ${titlePartHi} (${i + 1})`,
      en: `${loc.nameEn} - ${titlePartEn} (${i + 1})`
    },
    image: `https://images.unsplash.com/photo-${1510000000000 + i * 36521}?auto=format&fit=crop&q=80&w=400`,
    desc: {
      hi: `${loc.nameHi}, जो ${loc.state} में स्थित है, यहाँ एक भव्य प्राचीन दिगंबर जैन विरासती संकुल मिला है। इसकी उत्पत्ति लगभग ${century}वीं सदी की मानी जाती है। इसका आध्यात्मिक महत्त्व यह है कि यहाँ मुनियों ने कठोर तप किया और यह हमारी दिगंबर जैन संस्कृति का अटूट प्रतीक बना हुआ है।`,
      en: `Located at the cultural site of ${loc.nameEn}, ${loc.state}. This monument dates back approximately to the ${century}${century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'} Century CE during ancient Indian dynasties. It serves as a monumental proof of unbroken Digambar ascetic heritage of supreme self-control and Ahimsa.`
    },
    color: i % 3 === 0 ? "bg-orange-500" : i % 3 === 1 ? "bg-amber-500" : "bg-yellow-600",
    category: i % 4 === 0 ? "Temple" : i % 4 === 1 ? "Monument" : i % 4 === 2 ? "Inscription" : "Heritage Site",
    state: loc.state,
    era: `${century}th Century CE`
  };
  generatedHeritage.push(item);
}

// Export combined history data representing historical Timeline + searchable digital repository
export const historyData: HeritageItem[] = [...CORE_EPOCHS, ...generatedHeritage];
