import { useState, useEffect, useRef } from 'react';
import { 
  Search, BookOpen, ChevronDown, ChevronUp, Lightbulb, Microscope, 
  Sparkles, Loader2, Mic, MicOff, ArrowLeft, CheckCircle, XCircle, 
  Compass, ShieldCheck, Home, Sunset, Droplet, Apple, Volume2, VolumeX, Star, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { knowledgeData as FALLBACK_KNOWLEDGE } from '../data/knowledgeBase';
import { livingGuideData, LivingGuideCategory } from '../data/livingGuide';
import SectionAiAgent from '../components/SectionAiAgent';

const IconMap: Record<string, any> = {
  Home,
  Sunset,
  Droplet,
  Apple
};

const BAAL_BODH_BOOKS = [
  {
    id: 'baal1',
    title: { hi: 'बालबोध पाठमाला भाग १', en: 'Baal Bodh Bhag 1' },
    description: { hi: 'बुनियादी जैन संस्कार शिक्षा जैसे नवकार महामंत्र, देव-शास्त्र-गुरु, चार शरण एवं पांच पापों का वर्णन।', en: 'Basic Jainism habits, Dev-Shastra-Guru, four shelters, and five sins.' },
    color: 'from-[#FF6D00] to-[#FFAB40]',
    image: '🌸',
    chapters: [
      {
        title: { hi: '१. णमोकार महामंत्र महिमा', en: '1. Glory of Namokar Mantra' },
        content: {
          hi: `णमोकार मंत्र जैन धर्म का सबसे पवित्र और अनादि मूल मंत्र है। इसे नवकार मंत्र भी कहा जाता है। इसमें पंचपरमेष्ठी (पांच सर्वोच्च आत्माओं) को नमन किया गया है:\n\n**मंत्र और अर्थ:**\n१. **णमो अरिहंताणं।**\nअर्थ: जो राग-द्वेष और चार घातिया कर्मों का नाश कर समवशरण में विराजमान हैं, उन अरिहंत परमेष्ठी को मेरा नमस्कार हो।\n\n२. **णमो सिद्धाणं।**\nअर्थ: जिन्होंने अष्ट कर्मों का नाश कर सिद्धशिला पर परम विश्राम पाया है, उन अशरीरी सिद्ध परमेष्ठी को नमस्कार हो।\n\n३. **णमो आयरियाणं।**\nअर्थ: जो जैन संघ के नायक हैं, जो स्वयं छत्तीस मूलगुणों का पालन करते हैं और दीक्षा-शिक्षा देते हैं, उन आचार्य परमेष्ठी को नमस्कार हो।\n\n४. **णमो उवज्झायाणं।**\nअर्थ: जो शास्त्रों के ज्ञाता हैं और मुनिराजों को अध्ययन कराते हैं, उन पच्चीस मूलगुणों के धारी उपाध्याय परमेष्ठी को नमस्कार हो।\n\n५. **णमो लोए सव्वसाहूणं।**\nअर्थ: इस पूरे लोक में जितने भी सच्चे दिगंबर संत हैं, उन सभी तपस्वी साधु परमेष्ठी को नमस्कार हो।\n\n**महिमा श्लोक:**\n"एसो पंच णमोयारो, सव्व पावप्पणासणो।\nमंगलाणं च सव्वेसिं, पडमम हवइ मंगलं॥"\nअर्थ: यह पांच नमस्कार का समूह सभी पापों का नाश करने वाला है और संसार के समस्त मंगलों में सबसे पहला और महान श्रेष्ठ मंगल है।`,
          en: `Namokar Mantra is the supreme, eternal, and non-sectarian prayer of Jainism. It salutes the five supreme spiritual statuses (Panch Parameshthi):\n\n**Mantra & Meanings:**\n1. **Namo Arihantanam**\nSalutations to the Arihants (Conquerors of inner enemies who attained omniscience).\n\n2. **Namo Siddhanam**\nSalutations to the Siddhas (Liberated bodyless souls resting at the peak of the universe).\n\n3. **Namo Ayariyanam**\nSalutations to the Acharyas (The heads of the spiritual sangha practicing 36 primary virtues).\n\n4. **Namo Uvajjhayanam**\nSalutations to the Upadhyayas (The ascetic teachers who master and teach sacred texts).\n\n5. **Namo Loye Savva Sahunam**\nSalutations to all true, possession-less monks (Sadhus) across the universe.\n\n**Verse of Glory:**\n"Aeso Panch Namoyaro, Savva Pavappanasano...\nThis pentad of salutations eradicates all sins and is the first and foremost auspicious chant among all auspicious things.`
        },
        moral: { hi: 'णमोकार मंत्र में किसी चामत्कारिक व्यक्ति को नहीं, बल्कि उनकी वीतरागता, ज्ञान और पवित्र गुणों को पूजा गया है। हमें भी दूसरों के गुणों का सम्मान करना चाहिए।', en: 'The Namokar Mantra honors divine virtues instead of a physical body. We must always admire noble virtues.' }
      },
      {
        title: { hi: '२. देव, शास्त्र और गुरु की पहचान', en: '2. True Dev, Shastra, and Guru' },
        content: {
          hi: `जैन धर्म के अनुसार आत्म-कल्याण के लिए देव, शास्त्र और गुरु की सच्ची पहचान होना अनिवार्य है।\n\n१. **सच्चे देव (Arhat God):** जो 'वीतरागी' (जिनके मन में किसी जीव के प्रति न राग है, न द्वेष, न काम-क्रोध), 'सर्वज्ञ' (जो भूत, भविष्य और वर्तमान की हर चीज को एक साथ जानते हैं) और 'हितोपदेशी' (जो हमेशा जीवों की भलाई के लिए उपदेश देते हैं) होते हैं, वे सच्चे देव कहलाते हैं। जैसे २४ तीर्थंकर प्रभु।\n\n२. **सच्चा शास्त्र (Holy Scriptures):** सच्चे वीतरागी देवों की जो दिव्य वाणी खिरी, उसे सुनकर गणधरों ने 'शास्त्रों' (ग्रंथों) के रूप में संकलित किया। सच्चे शास्त्र कभी किसी जीव को दुःख नहीं देते, बल्कि हिंसा, झूठ और राग-द्वेष को छोड़ने का उपदेश देते हैं।\n\n३. **सच्चे गुरु (Righteous Ascetics):** जो सांसारिक सुखों को त्यागकर, कांचन-कामिनी (धन और वस्त्र) का परित्याग कर केवल दिगंबर मुनि दीक्षा लेते हैं और आत्म-लीन होकर वन में तपस्या करते हैं, वे ही सच्चे निर्ग्रंथ गुरु हैं।`,
          en: `To advance on the spiritual path, understanding True Dev, Shastra, and Guru is crucial:\n\n1. **True Dev (God):** The Tirthankara or Arihant who is extremely detached (Vitaragi), knows everything across time and space (Sarvajna), and delivers beneficial teachings (Hitopadeshi).\n\n2. **True Shastra (Scriptures):** The divine sermons composed by the immediate disciples (Gandharas) of the Arihant. They preach self-control, harmlessness, and spiritual liberation.\n\n3. **True Guru (Monks):** The highly austere, clothing-free (Digambara) saints who live in forests, possess nothing, do not cook or build houses, and meditate on the soul.`
        },
        moral: { hi: 'हमें कभी भी किसी राग-द्वेष करने वाले या हिंसा फैलाने वाले को देव या गुरु नहीं मानना चाहिए। शांतिप्रिय और वीतरागी आचरण का आदर करें।', en: 'Never fall for false, greedy, or violent entities. Respect peacefulness and absolute detachment.' }
      },
      {
        title: { hi: '३. चार शरण और चार उत्तम', en: '3. Four Shelters and Auspicious Entities' },
        content: {
          hi: `हम प्रतिदिन प्रात: और सायं देव पूजा करते समय यह मंगल पाठ पढ़ते हैं। इसमें चार सर्वोत्कृष्ट वस्तुओं का वर्णन है:\n\n**चार उत्तम (Four Supreme Ones):**\n१. **लोगुत्तमा अरिहंता लोगुत्तमा** - लोक में अरिहंत देव सबसे उत्तम हैं।\n२. **सिद्धा लोगुत्तमा** - लोक में सिद्ध परमात्मा सबसे उत्तम हैं।\n३. **साहू लोगुत्तमा** - लोक में सच्चे साधु संत सबसे उत्तम हैं।\n४. **केवली पण्णत्तो धम्मो लोगुत्तमो** - केवली भगवान द्वारा बताया गया वीतराग धर्म लोक में सबसे उत्तम है।\n\n**चार शरण (Four Shelters):**\n१. **अरिहंते सरणं पवज्जामि** - मैं अरिहंत देव की शरण ग्रहण करता हूँ।\n२. **सिद्धे सरणं पवज्जामि** - मैं सिद्ध परमात्मा की शरण ग्रहण करता हूँ।\n३. **साहू सरणं पवज्जामि** - मैं सच्चे गुरु की शरण ग्रहण करता हूँ।\n४. **केवली पण्णत्तं धम्मं सरणं पवज्जामि** - मैं केवली देव प्रणीत अहिंसक धर्म की शरण ग्रहण करता हूँ।\n\nसंसार में इनके अतिरिक्त कोई अन्य सच्चा रक्षक या शरण नहीं है।`,
          en: `In Jainism, we remind ourselves daily of the four ultimate sanctuaries and supreme elements:\n\n**Four supreme entities (Loguttama):**\n1. **Arihantas** are the supreme in the cosmos.\n2. **Siddhas** are the supreme in the cosmos.\n3. **Sadhus** (holy saints) are the supreme in the cosmos.\n4. **Kevali-Prannatto Dhammo** (detached religion) is the supreme in the cosmos.\n\n**Four shelters to seek (Saranam):**\n1. Seeking shelter of **Arihantas**.\n2. Seeking shelter of **Siddhas**.\n3. Seeking shelter of **Sadhus**.\n4. Seeking shelter of the **Ahimsa Dharma** (Non-violent religion) preached by omniscient Lords.`
        },
        moral: { hi: 'सांसारिक वस्तुएं, माता-पिता या धन संकट के समय हमें स्थाई सुरक्षा नहीं दे सकते। केवल आत्मा की शरण लेने से ही सब संकट दूर होते हैं।', en: 'Material belongings offer temporary security. Seek ultimate sanctuary only in spiritual wisdom and inner peace.' }
      },
      {
        title: { hi: '४. पांच पापों का त्याग', en: '4. The Five Sins to Avoid' },
        content: {
          hi: `पाप वह बुरा कार्य है जो हमें और दूसरों को अत्यंत दुःख देता है और आत्मा को मैला करता है। पाप पांच होते हैं:\n\n१. **हिंसा (Violence):** किसी भी जीव (चाहे मनुष्य, पशु या सूक्ष्म चींटी भी हो) को मन, वचन या शरीर से दुःख पहुँचाना, घायल करना या मारना हिंसा है।\n२. **झूठ (Falsehood):** जो बात जैसी न हो वैसी कहना, किसी को धोखा देने के लिए झूठ बोलना।\n३. **चोरी (Stealing):** किसी की गिरी या रखी हुई वस्तु को उसकी आज्ञा के बिना उठा लेना चोरी है।\n४. **कुशील (Unchastity):** गंदे और अश्लील विचार मन में रखना, वासना युक्त रहना।\n५. **परिग्रह (Possessiveness):** बहुत ज्यादा वस्तुओं (खिलौने, पैसे, मोबाइल) को अपना मानकर उनके पीछे लालची बने रहना।`,
          en: `Sin is that which harms our pure nature and inflicts immense suffering on other living beings. There are five basic sins:\n\n1. **Himsa (Violence):** Damaging or hurting any living creature through thoughts, actions, or words.\n2. **Jhoot (Lying):** Uttering untruthful, harmful, or misleading statements.\n3. **Chori (Stealing):** Taking possessions of another individual without their permission.\n4. **Kusheel (Immorality):** harbouring dirty thoughts, lack of sensory self-discipline.\n5. **Parigraha (Possessiveness):** Endlessly hoarding materialistic things with narrow possessive feelings.`
        },
        moral: { hi: 'सच्चा जैन श्रावक वही है जो जीवन में अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और अपरिग्रह का सदा अभ्यास करता है।', en: 'Cultivating mindfulness helps us reduce violence, greed, and dishonesty in our daily actions.' }
      }
    ]
  },
  {
    id: 'baal2',
    title: { hi: 'बालबोध पाठमाला भाग २', en: 'Baal Bodh Bhag 2' },
    description: { hi: 'चार कषाय का त्याग, जीव-अजीव की सुंदर पहचान, सप्त व्यसन त्याग एवं रात्रि भोजन का वैज्ञानिक निषेध।', en: 'Overcoming kashay, Jiva-Ajiva science, and night eating limits.' },
    color: 'from-[#2962FF] to-[#00B0FF]',
    image: '🌟',
    chapters: [
      {
        title: { hi: '१. चार कषाय का दुष्परिणाम', en: '1. Consequences of 4 Kashay' },
        content: {
          hi: `कषाय का अर्थ है - जो हमारी आत्मा को दुःख दे और मैला करे। कषाय चार प्रकार की होती हैं:\n\n१. **क्रोध (Anger):** गुस्सा करना, जिससे सबसे पहले हमारा खुद का मस्तिष्क और स्वभाव खराब होता है।\n२. **मान (Ego/Pride):** घमंड करना कि मैं ही सबसे बुद्धिमान, सुंदर या बलवान हूँ।\n३. **माया (Deceit):** छल-कपट करना, अंदर कुछ और बाहर कुछ दिखाना, बातें घुमाना।\n४. **लोभ (Greed):** बहुत ज्यादा लालच करना और दूसरों की चीजों पर बुरी नजर डालना।\n\nइन कषायों के वश में होकर कोई भी सुखी नहीं रह सकता।`,
          en: `Kashay represents harmful passions that bind our soul. They are of four categories:\n\n1. **Krodh (Anger):** Losing control over one's temper, hurting self-thought before anyone else.\n2. **Maan (Ego):** Excessive pride over one's knowledge, background or body.\n3. **Maya (Cheating):** Deceitful behavior, pretending to be someone else.\n4. **Lobh (Greed):** Always wanting more, not being appreciative of what we have.\n\nNo creature can live peacefully containing these negative passions.`
        },
        moral: { hi: 'गुस्से से नहीं बल्कि क्षमा से काम लें; सरल आचरण रखें, ईमानदार रहें और जो अपने पास है उसमें संतुष्ट रहें।', en: 'Defeat anger with forgiveness, be humble, always speak truth, and stay satisfied.' }
      },
      {
        title: { hi: '२. जीव और अजीव का भेद', en: '2. Science of Jiva & Ajiva' },
        content: {
          hi: `पूरी दुनिया मुख्य रूप से दो वस्तुओं से मिलकर बनी है:\n\n* **जीव (Jiva):** जो देखता-जानता है, जिसमें सोचने-समझने की शक्ति होती है और जो सुख-दुख का अनुभव करता है। जैसे - माता-पिता, मित्र, पशु-पक्षी, चींटी और यहाँ तक कि पेड़-पौधे भी।\n* **अजीव (Ajiva):** जिसमें कोई जान या ज्ञान नहीं होता, जो न कुछ महसूस कर सकता है और न सोच सकता है। जैसे - आपका पसंदीदा खिलौना, कंप्यूटर, पेंसिल, पानी की बोतल और पत्थर।`,
          en: `The entire universe is comprised of two core components:\n\n* **Jiva (Living Soul):** The one with consciousness, representing learning, feeling, and sensitivity (e.g. humans, birds, insects, plants).\n* **Ajiva (Non-Living Matter):** The physical objects without any feelings, thinking capacity or soul (e.g. toys, schoolbag, pencils, gadgets).`
        },
        moral: { hi: 'संसार के सभी जीवों में हमारे जैसी ही आत्मा है, इसलिए हमें चींटी-मच्छर समेत किसी भी जीव को चोट नहीं पहुँचानी चाहिए।', en: 'All living beings have a soul identical to ours; hence we must practice kindness (Ahimsa) towards everyone.' }
      },
      {
        title: { hi: '३. सप्त व्यसन - ७ बुरी आदतें', en: '3. Sapta Vyasan - Seven Vices' },
        content: {
          hi: `व्यसन का अर्थ है - वह अति बुरी आदत जो मनुष्य के आचरण और कुल मर्यादा का सर्वनाश कर दे। जैन शास्त्रों में ७ भयंकर व्यसन कहे गए हैं:\n\n१. **द्यूत क्रीडा (Gambling):** जुआ खेलना, पैसों की बाजी लगाना।\n२. **मांस भक्षण (Meat Eating):** बेजुबान पशु-पक्षी के अंगों को भोजन स्वरूप सड़ाकर खाना।\n३. **मद्यपान (Alcohol Consumption):** शराब पीना, जिससे इंसान के मस्तिष्क का होश खो जाता है।\n४. **वेश्यागमन (Prostitution):** अपवित्र संगति करना।\n५. **खेटक (Hunting):** अपनी क्रूर प्रसन्नता या मनोरंजन के लिए शिकार करना।\n६. **स्तेय (Theft):** दूसरों की संपत्ति को चुराना।\n७. **परस्त्री रमण (Adultery):** व्यभिचारी जीवन जीना।\n\nजो व्यक्ति इन ७ व्यसनों में फंसा रहता है, वह पशुओं से भी बदतर जीवन जीता है और भारी नरक गतियों को प्राप्त होता है।`,
          en: `Vyasan represents toxic habits that destroy character, reputation, and spiritual integrity. There are seven key vices:\n\n1. **Gambling (Dyuta):** Risking assets over dynamic luck or bet games.\n2. **Meat-Eating (Mansa):** Devouring body parts of innocent animals.\n3. **Alcoholism (Madya):** Consuming intoxicants that cloud human consciousness and sense of judgment.\n4. **Prostitution (Veshya):** Indulging in unclean relations.\n5. **Hunting (Khetaka):** Brutal target sports harming forest life.\n6. **Theft (Chori):** Plunder or piracy of public assets.\n7. **Adultery (Parastri):** Immoral marital lifestyle.\n\nA respectful and progressive individual stays entirely far away from these seven vices.`
        },
        moral: { hi: 'इंसानों का सबसे बड़ा आभूषण उनका सदाचार और चरित्र है। जीवन को सदा व्यसन-मुक्त रखना चाहिए।', en: 'Our pristine character is our greatest asset. Keep yourself entirely addiction-free.' }
      },
      {
        title: { hi: '४. अहिंसक खान-पान और रात्रि भोजन का निषेध', en: '4. Non-Violent Diet & Night Dining Ban' },
        content: {
          hi: `श्रावक का खान-पान अति शुद्ध और सात्विक होना चाहिए।\n\n**रात्रि भोजन निषेध का सत्य (Why Night Dining is Prohibited?):**\n१. **सूक्ष्म जीवों की उत्पत्ति:** सूर्य की अनुपस्थिति में हवा की नमी बढ़ने के कारण वायुमंडल में अत्यधिक सूक्ष्म त्रस (चलने फिरने वाले) जीव और कीटाणु पैदा हो जाते हैं जो कृत्रिम रोशनी (बल्ब, आग) की ओर आकर्षित होते हैं। रात में भोजन पकाने या खाने से वे भोजन में गिर जाते हैं और अनजाने में भारी हिंसा होती है।\n२. **स्वास्थ्य विज्ञान:** आधुनिक चिकित्सा विज्ञान भी पुष्टि करता है कि सूर्यास्त के बाद हमारा पाचन तंत्र मंद हो जाता है। रात में खाया गया भोजन ठीक से पचता नहीं है, जिससे मोटापा, मधुमेह और हृदय रोग जैसी बीमारियाँ होती हैं।`,
          en: `A Jain householder values immense purity in diet. Consuming foods must follow strict rules of compassion:\n\n**The prohibition on eating at night (Ratri Bhojan Tyag):**\n1. **Biological Protection:** In the absence of sunlight, moisture increases, causing quick multiplication of tiny multi-sensed bacteria and micro-bugs. They fly towards lit-up bulbs or cooking pots, drowning in foods which causes massive violence.\n2. **Digestive Science:** Modern medicine confirms human circadian rhythms where the metabolic fire slow down after sunset. Eating late accumulates undigested toxic fats and causes gastric problems.`
        },
        moral: { hi: 'भोजन केवल जीभ के स्वाद के लिए नहीं, बल्कि स्वास्थ्य और अहिंसा की भावना बनाए रखने के लिए केवल दिन के प्रकाश में ही करें।', en: 'Eat to support life and practice non-violence; night-eating is harmful for both body and soul.' }
      }
    ]
  },
  {
    id: 'baal3',
    title: { hi: 'बालबोध पाठमाला भाग ३', en: 'Baal Bodh Bhag 3' },
    description: { hi: 'देव दर्शन की अति उत्तम विधि, ८ कर्मों का परिचय, छह द्रव्य और चार गतियों का गहरा ज्ञान।', en: 'True worship methods, 8 karmas, six substances, and four realms.' },
    color: 'from-[#00C853] to-[#B9F6CA]',
    image: '📖',
    chapters: [
      {
        title: { hi: '१. देव दर्शन की उत्तम विधि', en: '1. Meaningful Method of Jinendra Darshan' },
        content: {
          hi: `जब हम मंदिर जाते हैं, तो वह केवल एक औपचारिक यात्रा नहीं होनी चाहिए। मंदिर प्रवेश करते समय 'निस्सही' (संसार के विकारों को छोड़कर प्रभु के पास आना) बोलना चाहिए।\n\n**विधि:**\n१. पैर धोकर, हाथ साफ कर मंदिर जी में प्रवेश करें।\n२. प्रभु की वेदी के सम्मुख खड़े होकर तीन प्रदक्षिणा (परिक्रमा) दें।\n३. अष्टद्रव्य या सूखे चावल से प्रभु के सम्मुख स्वस्तिक बनाएं। यह स्वस्तिक दर्शाता है कि हमें इन चार गतियों से निकलकर मोक्ष मार्ग पाना है।\n४. शांत मन से 'णमोकार मंत्र' का जाप करें या 'जिनेन्द्र स्तुति' पढ़ें। प्रभु की निर्मल, वीतरागी शांति को देखकर अपने भीतर भी वैसे ही विरक्त आनंद की कामना करें।`,
          en: `Visiting a Jain temple (Jinendra Darshan) is a highly transformative process, not a mechanical routine:\n\n**Steps:**\n1. Wash hands and feet, speak 'Nissahi' (excluding worldly problems) while crossing the entrance boundary.\n2. Stand in front of the detached idol, perform three circular circumambulations representing faith, knowledge, and conduct.\n3. Offer clean grains of dry rice styled as a Swastika, representing crossing the 4 realms of Samsara.\n4. Close eyes slightly, gaze at the serene face of the Tirthankara, and wish to unlock identical serene attributes within oneself.`
        },
        moral: { hi: 'मंदिर जाने का उद्देश्य प्रभु से खिलौने या धन मांगना नहीं है, बल्कि उनके जैसे ही निर्विकार होकर वीतरागता को सीखकर आना है।', en: 'The goal of temple visits is not to beg for worldly items, but to absorb the serenity of the detached Lord.' }
      },
      {
        title: { hi: '२. आठ कर्मों का परिचय', en: '2. The Eight Karmas binding the Soul' },
        content: {
          hi: `हमारी शुद्ध आत्मा पर जो अज्ञान, मोह और राग-द्वेष के कारण आवरण (धूल) जमा हो जाता है, उसे 'कर्म' कहते हैं। ये मुख्य रूप से आठ प्रकार के होते हैं:\n\n**४ घातिया कर्म (जो आत्मा के गुणों को सीधा नष्ट करते हैं):**\n१. **ज्ञानावरण:** जो हमारे सच्चे ज्ञान को प्रकट नहीं होने देता।\n२. **दर्शनावरण:** जो हमारी सच्ची देखने-जानने की श्रद्धा को रोकता है।\n३. **मोहनीय:** जो जीवात्मा को सांसारिक पदार्थों में अत्यंत मूर्छित (पागल) कर देता है।\n४. **अंतराय:** जो दान, लाभ, भोग आदि उत्कृष्ट कार्यों में बाधा डालता है।\n\n**४ अघातिया कर्म (जो शारीरिक स्थिति देते हैं):**\n५. **आयु:** जो तय करती है कि हम मनुष्य या देव योनि में कितने समय तक रहेंगे।\n६. **नाम:** जो हमें सुंदर/असुंदर शरीर, रंग और रूप प्रदान करता है।\n७. **गोत्र:** जो हमें उच्च या नीच कुल में जन्म दिलाता है।\n८. **वेदनीय:** जिससे हमें शारीरिक सुख या दुःख (बीमारी या निरोग अवस्था) का अनुभव होता है।`,
          en: `Our divine soul is layered with cosmic dust particles of passions and attachments known as Karmas. They are categorized into 8 types:\n\n**4 Ghatiya Karmas (Directly damaging inherent soul qualities):**\n1. **Gyanavarniya:** Veiling the inherent omniscience.\n2. **Darshanavarniya:** Blocking absolute perception.\n3. **Mohniya:** Deluding the soul with attachments/aversions (The king of all karmas).\n4. **Antaray:** Creating obstacles in donations, charity, or progress.\n\n**4 Aghatiya Karmas (Governing physical and environmental states):**\n5. **Ayu:** Determining lifespan in a birth.\n6. **Naam:** Crafting body features, organs, and species.\n7. **Gotra:** Allocating family status or social background.\n8. **Vedniya:** Bringing experiences of physical comfort and pain.`
        },
        moral: { hi: 'कर्म कोई बाहरी शक्ति नहीं है, वे हमारे खुद के किए हुए काम हैं। जब हम गुस्सा, लालच या बेईमानी छोड़ते हैं, तो ये कर्म अपने आप हमसे दूर चले जाते हैं।', en: 'Karma is not an external judge; it is the natural consequence of our own intent.' }
      },
      {
        title: { hi: '३. छह द्रव्यों का ज्ञान', en: '3. Six Cosmic Substances' },
        content: {
          hi: `जैन दर्शन के अनुसार यह सृष्टि अनादि है, इसे किसी ईश्वर ने नहीं बनाया। यह छह अविनाशी द्रव्यों से मिलकर बनी है:\n\n१. **जीव द्रव्य:** जिसमें ज्ञान, दर्शन और चेतना हो।\n२. **पुद्गल द्रव्य:** जिसमें स्पर्श, रस, गंध और वर्ण (रंग) हो। जैसे पत्थर, कपड़ा, शरीर, कंप्यूटर।\n३. **धर्म द्रव्य:** जो चलते हुए जीवों और पुद्गलों को चलने में ठीक वैसे सहायता करे जैसे मछली को तैरने में पानी।\n४. **अधर्म द्रव्य:** जो ठहरते हुए जीवों और पुद्गलों को रुकने में मदद करे जैसे थके राहगीर को वृक्ष की छाया।\n५. **आकाश द्रव्य:** जो समस्त द्रव्यों को रहने के लिए जगह (स्थान) देता है।\n६. **काल द्रव्य:** जो सभी द्रव्यों के निरंतर बदलने (नवीन से पुरातन होने) में सहायक होता है।`,
          en: `The cosmos is uncreated and eternal, running on natural physics comprised of six indestructible basic realities (Dravyas):\n\n1. **Jiva:** Living souls characterized by consciousness.\n2. **Pudgala:** Matter and energy possessing touch, taste, smell, and color (e.g. food, smartphones, bodies).\n3. **Dharma:** The medium of motion, assisting traveling items like water aids a swimming fish.\n4. **Adharma:** The medium of rest, aiding stationary items like shadow aids a resting traveler.\n5. **Akasha:** Universal space providing coordinates/accommodation for all elements.\n6. **Kala:** Time, facilitating continuous transformations (aging, changing, renewing).`
        },
        moral: { hi: 'संसार में कोई भी द्रव्य पूरी तरह नष्ट नहीं होता, केवल उसका रूप बदलता है। इसी तरह हमारी आत्मा अमर है, वह कभी मरती नहीं है।', en: 'No substance is ever completely destroyed; only forms change. Likewise, the soul is eternal and never dies.' }
      }
    ]
  },
  {
    id: 'chhahdhala',
    title: { hi: 'छहढाला (पवित्र ६ ढाल सीख)', en: 'Chhahdhala Lessons' },
    description: { hi: 'कविराज दौलतराम जी द्वारा रचित अनमोल ग्रंथ की सुंदर शिक्षाओं का संकलन।', en: 'Beautiful spiritual verses composed by Pandit Daulatram.' },
    color: 'from-[#00E676] to-[#00B0FF]',
    image: '📖',
    chapters: [
      {
        title: { hi: '१. प्रथम ढाल - चतुरगति के दुःख', en: '1. Pains of the Four Realms' },
        content: {
          hi: `**पंक्ति:**\n"जे त्रिभुवन में जीव अनन्त, सुख चाहत दुःख ते भयवन्त।\nताते दुःख-हारी सुख-कार, कहूँ सीख गुरु-करुणा धार॥"\n\n**अर्थ:** इस आकाश और ब्रह्मांड के तीनों लोकों में जितने भी अनगिनत जीव रहते हैं, वे सब केवल एक ही चीज चाहते हैं - सच्चा सुख। वे दुःख से हमेशा डरते और दूर भागते हैं। बच्चों! सच्चा सुख बाहर की चीजों में नहीं है, बल्कि अपने मन को बिल्कुल शांत, दयालु और कषाय-मुक्त रखने में है।`,
          en: `**Verse:**\n"Je tribhuvan me jiva anant, sukh chahat dukh te bhayavant..."\n\n**Meaning:** All infinite souls occupying the three structural worlds request supreme happiness and escape pain. Our supreme teachers teach that pure bliss comes from a quiet, forgiving, and pure conscious mind rather than modern toys.`
        },
        moral: { hi: 'यदि आप हमेशा खुश रहना चाहते हैं, तो दूसरों की भलाई करें और अपने मन में अच्छे विचार लाएं।', en: 'If you want to live a pleasant life, focus on helping others and keep your mind clean.' }
      },
      {
        title: { hi: '२. द्वितीय ढाल - मिथ्या दर्शन एवं कषाय', en: '2. Deluded Belief & Passion' },
        content: {
          hi: `**पंक्ति:**\n"आतम को अहित है असँयम, ताते कीजे संजम नियम।\nमिथ्या श्रद्धा त्यागि दृढ़ वीरा, गहि समकित होहु भवी सुधीरा॥"\n\n**अर्थ:** हमारी आत्मा का सबसे बड़ा अहित 'असंयम' (इन्द्रिय लोलुपता और स्वच्छंदता) है। इसलिए हमें जीवन में कुछ नियम, व्रत और आत्म-नियंत्रण अपनाना चाहिए। अज्ञान और झूठी धारणाओं का परित्याग कर सच्चा वीतरागी ज्ञान धारण करना ही हर बुद्धिमान इंसान का कर्तव्य है।`,
          en: `**Verse:**\n"Aatam ko ahit hai asanyam, taate keeje sanjam niyam..."\n\n**Meaning:** Sensory indiscipline is the greatest enemy of our inner alignment. One must adopt ethical boundaries, vows, and high self-control. Give up deluded views and follow the path of righteousness.`
        },
        moral: { hi: 'बिना नियम और अनुशासन का जीवन उस नदी की तरह है जो किनारे तोड़कर तबाही लाती है। जीवन में छोटे-छोटे व्रत नियम जरूर अपनाएं।', en: 'A life without discipline is like a wild river with broken banks. Cultivate tiny ethical commitments daily.' }
      },
      {
        title: { hi: '३. तृतीय ढाल - सच्चे सम्यग्दर्शन के अंग', en: '3. Components of Samyak Darshan' },
        content: {
          hi: `**पंक्ति:**\n"देव जिनेन्द्र गुरु परिग्रह-हीन, धरम दयामय जिनवर लीन।\nयातें विपरीतादि मति त्यागो, सम्यक दर्शन सन्मुख जागो॥"\n\n**अर्थ:** सच्चा सम्यग्दर्शन वही है जो वीतरागी जिनेन्द्र देव, निष्परिग्रही दिगंबर गुरु और दयामयी अहिंसक जैन धर्म पर दृढ़ विश्वास रखता है। अंधविश्वास, जादू-टोना या लालच में आकर विपरीत देवी-देवताओं के आगे सिर झुकाना सम्यक्त्व को मैला करता है। अपनी आत्मा को पहचानना ही सम्यक्त्व है।`,
          en: `**Verse:**\n"Dev jinendra guru parigrah-heen, dharam dayamay..."\n\n**Meaning:** True Faith consists of believing only in Kevali Dev (Tirthankaras), Digambara Munis who possess nothing, and the religion of absolute compassion. Discard superstition, greed, and fear-based beliefs.`
        },
        moral: { hi: 'सच्चा धर्म निडर बनाता है। हमें किसी डर या लालच में आकर अंधविश्वासों के जाल में नहीं फंसना चाहिए।', en: 'Wisdom eradicates fear. Never support superstition out of greed or fear.' }
      },
      {
        title: { hi: '४. चतुर्थ ढाल - सम्यग्ज्ञान का प्रकाश', en: '4. Light of Samyak Gyana' },
        content: {
          hi: `**पंक्ति:**\n"सम्यक सरधा धारि पुनि, गहो लखि सम्यक ज्ञान।\nभिन्न आराधन करौ, दोनों एक सुजान॥"\n\n**अर्थ:** सम्यग्दर्शन धारण करने के बाद हमें सम्यग्ज्ञान (सच्चे ज्ञान) का अभ्यास करना चाहिए। सम्यग्ज्ञान वह प्रकाश है जो हमें सच्चे सुख और मोक्ष की ओर ले जाता है। सच्चा ज्ञान केवल रटना नहीं है, बल्कि सत्य और असत्य का भेद समझना है।`,
          en: `**Verse:**\n"Samyak saradha dhaari puni, gaho lakhi samyak gyan..."\n\n**Meaning:** After cultivating Right Faith, ignite Right Knowledge. Right Knowledge acts like a torch in a dark room; it clarifies the true self versus illusion.`
        },
        moral: { hi: 'ज्ञान ही मनुष्य की सर्वश्रेष्ठ शक्ति है। हमें प्रतिदिन अच्छी पुस्तकें पढ़नी चाहिए और सदाचारी ज्ञान अर्जित करना चाहिए।', en: 'Knowledge is the real light of the soul. Study moral scriptures daily to cleanse your vision.' }
      }
    ]
  },
  {
    id: 'ratnakarandaka',
    title: { hi: 'रत्नकरण्ड श्रावकाचार सार', en: 'Ratnakarandaka Conduct' },
    description: { hi: 'सम्यक्त्व, अष्ट मूलगुण और दैनिक श्रावक जीवन की आचार संहिता पर सुगम सीख।', en: 'Samyaktva, 8 primary virtues, and peaceful rules of conduct.' },
    color: 'from-[#AA00FF] to-[#E040FB]',
    image: '💎',
    chapters: [
      {
        title: { hi: '१. सम्यग्दर्शन - जीवन का आधार', en: '1. Right Faith - The Foundation' },
        content: {
          hi: `**श्लोक:**\n"सद्दृष्टिज्ञानवृत्तानि धर्मं धर्मेश्वरा विदुः।\nयद्बन्धाद्ध्वंसते पुंसां संसारोऽयमनुत्तरः॥"\n\n**अर्थ:** सच्चा आचरण और ज्ञान तभी आता है जब हमारे पास "सम्यग्दर्शन" हो। इसका मतलब है - सत्य पर अटूट विश्वास रखना और गलत बातों या अंधविश्वासों से दूर रहना। जब हम सच और अच्छाई पर पूर्ण श्रद्धा रखते हैं, तभी हमारा जीवन सही दिशा में मुड़ता है।`,
          en: `**Sutra:**\n"Saddrishtigyanavrittani dharmam..."\n\n**Meaning:** Right Faith (Samyak Darshan) constitutes the very foundation of noble character. Believing in absolute truth and avoiding blind-beliefs is key to wisdom.`
        },
        moral: { hi: 'कभी भी बिना सोचे-समझे किसी गलत बात पर विश्वास न करें; हमेशा सच को जानने और परखने की आदत डालें।', en: 'Never accept wrong viewpoints blindly; cultivate a habit of looking for truth and moral values.' }
      },
      {
        title: { hi: '२. अष्ट मूलगुण - श्रावक के ८ नियम', en: '2. Asht Moolgun - Height of Purity' },
        content: {
          hi: `जैन गृहस्थ (श्रावक) बनने की शुरुआत इन आठ मूल गुणों के पालन से होती है:\n\n* **पांच अणुव्रत:** अहिंसा, सत्य, अचौर्य, ब्रह्मचर्य और अपरिग्रह का गृहस्थ स्तर पर संकल्प।\n* **मद्य त्याग:** शराब, बीयर या किसी भी तरह के नशीले पदार्थों का सेवन न करना।\n* **मांस त्याग:** पूर्ण शाकाहारी रहना, मांसाहार का स्वप्न में भी विचार न करना।\n* **मधु (शहद) त्याग:** शहद का त्याग, क्योंकि शहद बनाने की प्रक्रिया में लाखों मधुमक्खियों और उनके अंडों की निर्मम हत्या होती है।\n\nइन ८ मूलगुणों के बिना कोई भी मनुष्य धर्म मार्ग में प्रवेश नहीं कर सकता।`,
          en: `A practicing Jain householder must strictly observe the 8 primary virtues (Asht Moolgun):\n\n- **Five Minor Vows (Anuvratas):** Living with non-violence, truth, non-stealing, fidelity, and low greed.\n- **Abstaining from Honey (Madhu):** Honey collection destroys thousands of larvae and bees.\n- **Abstaining from Alcohol (Madya):** Intoxication damages self-awareness.\n- **Abstaining from Meat (Mansa):** Essential for unconditional non-violence (Ahimsa).`
        },
        moral: { hi: 'खान-पान की पवित्रता ही हमारे विचारों को सात्विक और दयालु बनाती है। जैसा अन्न खाएंगे वैसा ही हमारा मन बनेगा।', en: 'Dietary selection establishes your brain peace. Pure food yields pure peaceful thoughts.' }
      },
      {
        title: { hi: '३. अणुव्रतों की महत्ता - अहिंसा व्रत', en: '3. Virtues of the Ahimsa Anuvrata' },
        content: {
          hi: `**श्लोक:**\n"संकल्पात्कृतकारितमननाद्योगत्रयस्य चरसत्त्वान्।\nन हिनस्ति यत्तदहिंसाव्रतमाहुर्गृहपतेः श्रेष्ठम्॥"\n\n**अर्थ:** एक श्रेष्ठ गृहस्थ कभी भी संकल्पपूर्वक (जानबूझकर) त्रस (चलने-फिरने वाले २, ३, ४, ५ इन्द्रिय) जीवों की मन, वचन या काय से न तो स्वयं हिंसा करता है, न दूसरों से करवाता है और न ही हिंसा करने वाले की प्रशंसा या सम्मति देता है। यही गृहस्थों का अहिंसा अणुव्रत है।`,
          en: `**Sutra:**\n"Sankalpaat krit-kaarita-mananaat..."\n\n**Meaning:** A noble householder does not intentionally harm any moving life forms (insects, birds, humans) via thoughts, bodily motions, or words. This is the premier vow of Ahimsa.`
        },
        moral: { hi: 'संसार का सबसे बड़ा उपकार है दूसरों को निर्भयता देना। हमारे रहते किसी भी जीव को भय नहीं होना चाहिए।', en: 'The greatest gift you can offer is fearlessness to all living things around you.' }
      }
    ]
  },
  {
    id: 'istopadesh',
    title: { hi: 'इष्टोपदेश अमृतवाणी', en: 'Istopadesh Teachings' },
    description: { hi: 'आचार्य पूज्यपाद देव द्वारा संकलित आत्मा और शरीर के भेद-विज्ञान का अनुपम ज्ञान संग्रह।', en: 'Essential differences between body and soul by Acharya Pujyapada.' },
    color: 'from-[#FF1744] to-[#F50057]',
    image: '✨',
    chapters: [
      {
        title: { hi: '१. शरीर और आत्मा का भेद - मूल ज्ञान', en: '1. Soul and Body Discernment' },
        content: {
          hi: `**श्लोक:**\n"वपुर्गृहं धनं दाराः पुत्रा मित्राणि शत्रवः।\nसर्वथाऽन्ये स्वतो भिन्नाः मूर्खः संस्तन्मयीभवेत्॥"\n\n**अर्थ:** यह शरीर, मकान, धन, पत्नी, पुत्र, मित्र और शत्रु - ये सब आत्मा से बिल्कुल भिन्न (बाहर की) चीजें हैं। केवल अज्ञानी मनुष्य ही बहककर इन चीज़ों को अपनी आत्मा मानकर अहंकार करता है। ज्ञानी जानता है कि मैं केवल अविनाशी आत्मा हूँ, शरीर तो केवल कुछ समय का अस्थाई वस्त्र है।`,
          en: `**Sutra:**\n"Vapurgriham dhanam daraah..."\n\n**Meaning:** The physical body, house, money, relations, friends, and enemies are entirely distinct from the soul. Only an ignorant person considers them to be his real self. The soul is pure consciousness, whereas the body is merely temporary clothing.`
        },
        moral: { hi: 'शरीर को सुंदर बनाने से आत्मा सुंदर नहीं होती। आत्मा सुंदर बनती है परोपकार, सत्य और साधना से।', en: 'Decorating the outer body does not purify the soul. Cultivate inner beauty via truth and kindness.' }
      },
      {
        title: { hi: '२. संसार में सुख की झूठी कल्पना', en: '2. The Mirage of Wordly Comforts' },
        content: {
          hi: `**श्लोक:**\n"मृगतृष्णासमं सौख्यं संसारे दृश्यते बुधैः।\nतदर्थं खिद्यते बालः क्लेशैः विन्दति चापदम्॥"\n\n**अर्थ:** सांसारिक सुख केवल मृग-मरीचिका (रेत में पानी दिखने के भ्रम) की तरह है। अज्ञानी जीव भ्रम में फंसकर इन भौतिक भोगों (सुविधाओं, खिलौनों, मोबाइल) के पीछे दौड़ता है, मेहनत करता है और अंत में दुःख तथा क्लेश पाता है। सच्चा सुख अपनी आत्मा में संतोष पाने में है।`,
          en: `**Sutra:**\n"Mrigatrishnasamam saukhyam..."\n\n**Meaning:** Material happiness is like a desert mirage. An ignorant person runs after transient gadgets, properties, and transient honors only to experience exhaustion. True delight resides in soul satisfaction.`
        },
        moral: { hi: 'लालच करने से वस्तुओं का सुख बढ़ने की जगह तनाव और चिताएं बढ़ जाती हैं। संतोष ही असली अमृत है।', en: 'Uncontrolled greed yields stress and panic. Genuine contentment is the supreme nectar.' }
      },
      {
        title: { hi: '३. अंतर्मुखी दृष्टि ही कल्याणकारी है', en: '3. Inward Awakening' },
        content: {
          hi: `**श्लोक:**\n"बहिरात्मा कषायैश्च गृह्यते संसरत्ययम्।\nअन्तरात्मा विवेकी स्यात् परमात्मा निरुच्यते॥"\n\n**अर्थ:** जो मनुष्य केवल बाहर की चीजों, रंग और ठाठ-बाट में खोया रहता है, वह बहिरात्मा (अज्ञानी) है। जो अपने सच्चे आत्म-स्वरूप को पहचानता है, वह अन्तरात्मा (विवेकशील) है। और जो सब कर्मों को नष्ट कर सिद्ध बन जाता है, वह परमात्मा है। हमें बहिरात्मा छोड़कर अन्तरात्मा बनना चाहिए।`,
          en: `**Sutra:**\n"Bahiratma kashayaischa grihyate..."\n\n**Meaning:** One who identifies only with physical forms is an Outward-Soul. One who feels the eternal quiet observer within is an Inward-Soul. One who transcends all worldly chains is the Supreme-Soul.`
        },
        moral: { hi: 'दूसरों की बुराइयां देखना छोड़कर केवल अपने आचरण और दोषों को देखकर उन्हें सुधारना ही सच्ची साधना है।', en: 'Look inward to recognize your own mistakes and fix them; this is true spiritual alignment.' }
      }
    ]
  }
];

export default function KnowledgePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState<'qa' | 'guide' | 'baal_bodh'>('qa');
  const [search, setSearch] = useState('');
  const { language: lang, toggleLanguage } = useLanguage();
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  
  // Baal Bodh states
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [isSpeakingBook, setIsSpeakingBook] = useState(false);
  
  // Q&A Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Living Guide active category ID
  const [activeGuideCat, setActiveGuideCat] = useState<string>('dev_darshan');

  // AI Swadhyay Agent states
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Jain Swadhyay AI Agent active.",
    "[STATUS] Secure encrypted database port ready.",
    "[GUIDE] Tell me what knowledge or detailed Q&As to generate and add to our live database, or click a preset!"
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setIsListening(false);
        setSpeechError('');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError(lang === 'en' ? 'Microphone access denied.' : 'माइक्रोफ़ोन अनुमति अस्वीकृत।');
        } else {
          setSpeechError(lang === 'en' ? 'Error with speech recognition.' : 'वाणी पहचान में त्रुटि।');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    const q = query(collection(db, 'knowledge'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const preparedSeed = FALLBACK_KNOWLEDGE.map((item, index) => ({ id: `seed_${index}`, ...item }));
      
      // Merge Firestore documents with offline seeds, avoiding duplicates
      const merged = [...data];
      preparedSeed.forEach(seed => {
        const isDuplicate = data.some((d: any) => 
          (d.question?.en && d.question.en === seed.question?.en) || 
          (d.question?.hi && d.question.hi === seed.question?.hi)
        );
        if (!isDuplicate) {
          merged.push(seed);
        }
      });

      setKnowledge(merged);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching knowledge:', error);
      const preparedSeed = FALLBACK_KNOWLEDGE.map((item, index) => ({ id: `seed_${index}`, ...item }));
      setKnowledge(preparedSeed);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [lang]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'SAMIL_SWADHYAY_2026' || passcode === 'samil123') {
      setUnlocked(true);
      setErrorMsg('');
      setLogs(prev => [...prev, "[SYSTEM] Swadhyay Agent authenticated successfully! Core unlocked."]);
    } else {
      setErrorMsg(lang === 'en' ? 'Incorrect developer passcode' : 'गलत डेवलपर पासकोड');
    }
  };

  const handleSendAgentPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim() || isProcessing) return;

    const currentPrompt = agentPrompt;
    setAgentPrompt('');
    setIsProcessing(true);
    setLogs(prev => [...prev, `[COMMAND] Instruction: "${currentPrompt}"`]);

    try {
      setLogs(prev => [...prev, "[AI MASTER] Contacting Jainism Wisdom Server for content structuring..."]);
      
      const response = await fetch('/api/admin/nlp-agent-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Server error generating data');
      }

      const { action, targetCollection, payload, replyText } = result;

      if (action === 'add' && targetCollection === 'knowledge' && payload) {
        setLogs(prev => [...prev, `[DB TRANSACTION] Pushing payload into Firestore live...`]);
        await addDoc(collection(db, 'knowledge'), payload);
        setLogs(prev => [...prev, `[DB SUCCESS] Document added and indexed into Firestore collection 'knowledge' successfully!`]);
      } else {
        setLogs(prev => [...prev, `[AI MASTER] System replied: "${replyText || 'Processed successfully.'}"`]);
      }
    } catch (err: any) {
      console.error(err);
      setLogs(prev => [...prev, `[AI ERROR] Execution failed: ${err.message || 'Check network limits'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const presets = lang === 'en' ? [
    "Add detailed question & answers on Tirthankara landmark places",
    "Add scientific parallel of Jain cosmology (Lokakasha) vs modern physics",
    "Explain physiological cellular benefits of Namokar Mantra daily recitation",
    "Add detailed spiritual logic regarding Paryushan fasting benefits"
  ] : [
    "तीर्थंकर निर्माण और कल्याणक स्थलों पर प्रश्नोत्तर जोड़ें",
    "जैन ब्रह्मांड और क्वांटम भौतिकी के वैज्ञानिक समानांतर पर प्रश्नोत्तर जोड़ें",
    "प्रतिदिन नवकार मंत्र के निरंतर जाप के जैव-वैज्ञानिक लाभों का विश्लेषण जोड़ें",
    "पर्युषण पर्व पर उपवास के आध्यात्मिक और शारीरिक सफाई लाभों पर प्रश्नोत्तर जोड़ें"
  ];

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        setSpeechError(lang === 'en' ? 'Speech recognition not supported.' : 'इस ब्राउज़र में वाणी पहचान समर्थित नहीं है।');
        return;
      }
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'hi-IN';
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const filteredKnowledge = knowledge.filter(item => {
    const qMatches = (item.question?.en?.toLowerCase().includes(search.toLowerCase()) || 
                     item.question?.hi?.toLowerCase().includes(search.toLowerCase()));
    
    if (selectedCategory === 'All') return qMatches;
    return qMatches && item.category === selectedCategory;
  });

  // Extract unique categories for pill filter
  const categories = ['All', ...Array.from(new Set(knowledge.map(item => item.category).filter(Boolean)))];

  return (
    <div className="min-h-full p-6 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-50/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
            <BookOpen className="text-[#FF6D00] shrink-0" size={26} />
            {lang === 'en' ? 'JAIN PATHSHALA & GYAN' : 'जैन पाठशाला एवं ज्ञान सागर'}
          </h1>
        </div>
        
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-[#FF8A65] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all shadow-sm font-bold text-xs cursor-pointer"
          title="Toggle Language"
        >
          {lang === 'en' ? 'हिंदी (HI)' : 'English (EN)'}
        </button>
      </header>

      {/* Main Mode / Tab Switcher */}
      <div className="flex p-1 mb-8 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-xl mx-auto overflow-hidden">
        <button
          onClick={() => { setActiveTab('qa'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'qa' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <BookOpen size={16} />
          {lang === 'en' ? 'Q&A Database' : 'जिज्ञासा समाधान'}
        </button>
        <button
          onClick={() => { setActiveTab('guide'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'guide' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <Compass size={16} />
          {lang === 'en' ? 'Living Guide' : 'मूल जैन दिनचर्या'}
        </button>
        <button
          onClick={() => { setActiveTab('baal_bodh'); setSearch(''); setSelectedBook(null); setSelectedChapter(null); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] md:text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer",
            activeTab === 'baal_bodh' 
              ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
              : "text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
          )}
        >
          <BookOpen size={16} />
          {lang === 'en' ? 'Kids Baal Bodh' : 'बाल बोध संस्कार'}
        </button>
      </div>

      {activeTab === 'qa' && (
        /* ==================== Q&A SYSTEM TAB ==================== */
        <div className="space-y-6">
          {/* Did you know banner */}
          <div className="bg-gradient-to-br from-[#00E676]/10 to-[#69F0AE]/5 backdrop-blur-xl rounded-3xl p-5 border border-[#00E676]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00E676]/20 transition-all duration-700" />
            
            <div className="flex items-center gap-2 text-[#00C853] dark:text-[#69F0AE] mb-2 relative z-10">
              <Lightbulb size={16} className="animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase">Did You Know? | क्या आप जानते हैं?</span>
            </div>
            
            <p className="text-gray-800 dark:text-white font-semibold leading-relaxed text-sm relative z-10">
              {lang === 'en' 
                ? "Scientific analysis shows that water filtering methods stated in ancient Digambar texts perfectly match modern sterile precautions!" 
                : "वैज्ञानिक शोधों से पता चला है कि प्राचीन दिगंबर शास्त्रों में बताई गई जल छानने की विधि आधुनिक जीवाणु-मुक्त विज्ञान के पूर्णतः अनुकूल है!"}
            </p>
          </div>

          {/* Search bar specifically for Q&A */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-[#FF8A65]" size={18} />
              <input
                type="text"
                placeholder={lang === 'en' ? "Search spiritual/scientific questions..." : "शंका समाधान खोजें (जैसे: रात्रि भोजन, पानी)..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6D00]/50 shadow-sm transition-all"
              />
              <button 
                onClick={toggleListening}
                className={cn(
                  "absolute right-4 p-2 rounded-full transition-all cursor-pointer",
                  isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-gray-400 hover:text-[#FF8A65] hover:bg-[#FF6D00]/10"
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            {speechError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{speechError}</p>
            )}
          </div>

          {/* Categories Pill Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border whitespace-nowrap transition-all duration-300 cursor-pointer",
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#FF6D00] to-[#FFB300] text-white border-transparent shadow-sm"
                    : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {cat === 'All' ? (lang === 'en' ? 'All' : 'सभी श्रेणी') : cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={36} />
                <p className="font-bold uppercase tracking-widest text-xs">Loading Divine Q&As...</p>
              </div>
            ) : filteredKnowledge.length > 0 ? (
              filteredKnowledge.map((item) => {
                const isOpen = openIdx === item.id;
                return (
                  <div 
                    key={item.id}
                    className={cn(
                      "bg-white dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl border overflow-hidden shadow-sm transition-all duration-300",
                      isOpen ? "border-[#FF6D00]/50 shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.15)]" : "border-gray-200/50 dark:border-white/5 hover:border-[#FF6D00]/30"
                    )}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : item.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className={cn(
                        "font-bold text-sm pr-4 transition-colors duration-300 leading-snug",
                        isOpen ? "text-[#FF6D00] dark:text-[#FFD54F]" : "text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white"
                      )}>
                        {lang === 'en' ? item.question?.en : item.question?.hi}
                      </span>
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                        isOpen ? "bg-[#FF6D00]/10 text-[#FF8A65]" : "bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-white/10 group-hover:text-gray-900"
                      )}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    
                    <div 
                      className={cn(
                        "px-5 overflow-hidden transition-all duration-500 ease-in-out",
                        isOpen ? "max-h-[1000px] pb-5 opacity-100 border-t border-gray-100 dark:border-white/5" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="pt-4 space-y-4">
                        {/* Jain Reason */}
                        <div className="space-y-1.5 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-600/5 border border-orange-100 dark:border-orange-500/10">
                          <div className="flex items-center gap-2 text-[#FF6D00]">
                            <Sparkles size={14} className="fill-[#FF6D00]/20" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Jain Doctrine & Shastra Reason | आध्यात्मिक आधार</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.jainReason?.en : item.jainReason?.hi}
                          </p>
                        </div>

                        {/* Science Reason */}
                        <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-600/5 border border-blue-100 dark:border-blue-500/10">
                          <div className="flex items-center gap-2 text-[#2962FF]">
                            <Microscope size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Scientific Logic | वैज्ञानिक विश्लेषण</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-semibold">
                            {lang === 'en' ? item.scienceReason?.en : item.scienceReason?.hi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200/50 dark:border-white/5 text-gray-500 text-xs font-bold tracking-wider">
                {lang === 'en' ? 'No Q&A wisdom found.' : 'खोज परिणाम रिक्त है।'}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        /* ==================== LIVING GUIDE TAB ==================== */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Side categories switches */}
          <div className="md:col-span-4 space-y-2">
            {livingGuideData.map((category) => {
              const IconComp = IconMap[category.iconName] || Compass;
              const isSelected = activeGuideCat === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveGuideCat(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer",
                    isSelected 
                      ? "bg-white dark:bg-[#161616] border-[#FF6D00] shadow-[0_4px_20px_rgba(255,109,0,0.1)] text-[#FF6D00] dark:text-[#FFD54F]"
                      : "bg-white/80 dark:bg-[#121212]/80 border-gray-200/40 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#151515]"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                    isSelected 
                      ? "bg-[#FF6D00]/10 border-[#FF6D00]/20" 
                      : "bg-gray-50 dark:bg-white/5 border-transparent"
                  )}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      {lang === 'en' ? category.title.en : category.title.hi}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px] font-medium">
                      {lang === 'en' ? category.subtitle.en : category.subtitle.hi}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current selected category panel content */}
          <div className="md:col-span-8 space-y-6">
            {(() => {
              const cat = livingGuideData.find(c => c.id === activeGuideCat);
              if (!cat) return null;
              return (
                <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6D00]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Category Header */}
                  <div className="mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
                    <span className="text-[9px] px-2.5 py-0.5 font-black uppercase tracking-wider rounded-md bg-orange-600 text-white w-fit">
                      {cat.targetAudience[lang]}
                    </span>
                    <h2 className="text-xl font-display font-black text-gray-900 dark:text-white mt-2 leading-tight">
                      {lang === 'en' ? cat.title.en : cat.title.hi}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">
                      {lang === 'en' ? cat.subtitle.en : cat.subtitle.hi}
                    </p>
                  </div>

                  {/* Practices List (Do's & Don'ts structured gracefully) */}
                  <div className="space-y-6">
                    {cat.practices.map((practice, idx) => {
                      const isDo = practice.type === 'do';
                      return (
                        <div 
                          key={idx}
                          className={cn(
                            "p-5 rounded-2xl border transition-all duration-300 hover:shadow-sm flex flex-col gap-3.5 relative",
                            isDo 
                              ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-500/10 dark:border-emerald-500/20" 
                              : "bg-rose-50/30 dark:bg-rose-500/5 border-rose-500/10 dark:border-rose-500/20"
                          )}
                        >
                          {/* Badge tag */}
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              {isDo ? (
                                <CheckCircle size={16} className="text-emerald-500 shadow-sm" />
                              ) : (
                                <XCircle size={16} className="text-rose-500 shadow-sm" />
                              )}
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-wider",
                                isDo ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                              )}>
                                {isDo ? (lang === 'en' ? 'PRACTICE / DO' : 'आचरणीय (DO)') : (lang === 'en' ? 'RESTRICTION / DONT' : 'वर्जित (DONT)')}
                              </span>
                            </div>
                          </div>

                          {/* Content title and details */}
                          <div>
                            <h4 className="font-display font-black text-sm text-gray-900 dark:text-white leading-snug">
                              {lang === 'en' ? practice.title.en : practice.title.hi}
                            </h4>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                              {lang === 'en' ? practice.desc.en : practice.desc.hi}
                            </p>
                          </div>

                          {/* Kids and family friendly educational card box */}
                          <div className="p-3.5 rounded-xl bg-white/60 dark:bg-[#0c0c0c]/60 border border-amber-500/10 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed shadow-sm">
                            <span className="text-base leading-none shrink-0" role="img" aria-label="light">💡</span>
                            <div>
                              <strong className="text-gray-900 dark:text-gray-200 block text-[10px] uppercase tracking-wider font-black mb-0.5">
                                {lang === 'en' ? 'Kids & Family Tip' : 'बाल संस्कार एवं नैतिक सीख'}
                              </strong>
                              {lang === 'en' ? practice.kidsTip.en : practice.kidsTip.hi}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {activeTab === 'baal_bodh' && (
        <div className="space-y-6">
          {!selectedBook ? (
            /* ================= BOOK SELECTION GRID ================= */
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-[#FFAB40]/20 to-[#FFD54F]/5 backdrop-blur-md rounded-3xl p-6 border border-[#FFAB40]/30 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD54F]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-center gap-1.5 mb-2 text-amber-500">
                  <Star className="fill-current text-orange-500" size={16} />
                  <Star className="fill-current" size={20} />
                  <Star className="fill-current text-orange-500" size={16} />
                </div>
                <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FFD54F]">
                  {lang === 'en' ? 'BUDHI BAAL PATHSHALA' : 'बाल बोध संस्कार पाठशाला'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold mt-2 max-w-lg mx-auto leading-relaxed">
                  {lang === 'en' 
                    ? 'Explore premium high-quality Jain moral stories, sacred verses, and children-friendly teachings with natural high-quality voice narrator.' 
                    : 'सरल सुंदर हिंदी-अंग्रेजी अनुवाद, उत्तम संस्कृत श्लोक एवं सजीव आवाज वाचक के साथ छोटे बच्चों के लिए अनमोल जैन धर्म नैतिक ज्ञान।'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BAAL_BODH_BOOKS.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(book.chapters[0]);
                    }}
                    className="p-6 bg-white dark:bg-[#121212]/90 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-orange-400 dark:hover:border-orange-500/40 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.1)] transition-all duration-300 cursor-pointer flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className={cn("w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-sm", book.color)}>
                      {book.image}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-black text-base text-gray-900 dark:text-white truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                          {lang === 'en' ? book.title.en : book.title.hi}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 dark:text-orange-400 font-bold text-[9px] uppercase tracking-widest shrink-0">
                          {book.chapters.length} {lang === 'en' ? 'Chapters' : 'अध्याय'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {lang === 'en' ? book.description.en : book.description.hi}
                      </p>
                      <div className="pt-1 text-[10px] font-black text-gray-500 dark:text-gray-400 group-hover:text-orange-500 flex items-center gap-1.5 transition-all">
                        <span>{lang === 'en' ? 'Click to Start Reading' : 'पढ़ना शुरू करने के लिए क्लिक करें'}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ================= ACTIVE BOOK WRITER/READER ================= */
            <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
              <button 
                onClick={() => {
                  setSelectedBook(null);
                  setSelectedChapter(null);
                  window.speechSynthesis.cancel();
                  setIsSpeakingBook(false);
                }}
                className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold text-xs hover:text-[#FF6D00] hover:border-[#FF6D00]/25 transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{lang === 'en' ? 'Back to All Books' : 'सभी पुस्तकें देखें'}</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Book Index (Left Panel) */}
                <div className="md:col-span-4 bg-white dark:bg-[#121212]/90 border border-gray-100 dark:border-white/10 rounded-3xl p-5 space-y-4">
                  <div className="pb-3 border-b border-gray-100 dark:border-white/5 text-center sm:text-left">
                    <span className="text-[9px] font-black tracking-widest text-[#FF6D00] block uppercase">{lang === 'en' ? 'Active Book' : 'सक्रिय पुस्तक'}</span>
                    <h3 className="font-display font-black text-gray-900 dark:text-white mt-1">
                      {lang === 'en' ? selectedBook.title.en : selectedBook.title.hi}
                    </h3>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {selectedBook.chapters.map((chap: any, idx: number) => {
                      const isActive = selectedChapter?.title.hi === chap.title.hi;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedChapter(chap);
                            window.speechSynthesis.cancel();
                            setIsSpeakingBook(false);
                          }}
                          className={cn(
                            "w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer",
                            isActive 
                              ? "bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/35 text-orange-500 dark:text-orange-400"
                              : "bg-gray-50/70 dark:bg-black/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                          )}
                        >
                          <span className="truncate">{lang === 'en' ? chap.title.en : chap.title.hi}</span>
                          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-orange-500 animate-pulse" : "bg-transparent")} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chapter reader (Right Panel) */}
                <div className="md:col-span-8 bg-white dark:bg-[#121212]/90 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                  {selectedChapter && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex-1">
                          <span className="text-[9px] font-black tracking-widest text-[#FF6D00] uppercase flex items-center gap-1.5">
                            <Star className="fill-current text-yellow-500" size={10} />
                            {lang === 'en' ? 'Kids Pathshala Lesson' : 'बालबोध संस्कार पाठ'}
                          </span>
                          <h2 className="text-xl font-display font-black text-gray-900 dark:text-white mt-1 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FFD54F]">
                            {lang === 'en' ? selectedChapter.title.en : selectedChapter.title.hi}
                          </h2>
                        </div>
                        
                        <button
                          onClick={() => {
                            const speechText = `${selectedChapter.title.hi}. ${selectedChapter.content.hi}. नैतिक शिक्षा: ${selectedChapter.moral.hi}`;
                            if (isSpeakingBook) {
                              window.speechSynthesis.cancel();
                              setIsSpeakingBook(false);
                            } else {
                              window.speechSynthesis.cancel();
                              const cleanText = speechText.replace(/\*/g, '').replace(/॥/g, '').replace(/ॐ ह्रीं श्रीं/g, 'ओम ह्रीम श्रीम');
                              const utterance = new SpeechSynthesisUtterance(cleanText);
                              utterance.lang = 'hi-IN';
                              utterance.rate = 0.8;
                              utterance.onend = () => setIsSpeakingBook(false);
                              utterance.onerror = () => setIsSpeakingBook(false);

                              const allVoices = window.speechSynthesis.getVoices();
                              const premiumVoice = allVoices.find(v => 
                                (v.lang.startsWith('hi') || v.lang.startsWith('sa')) && 
                                (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural'))
                              ) || allVoices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
                              
                              if (premiumVoice) {
                                utterance.voice = premiumVoice;
                              }

                              window.speechSynthesis.speak(utterance);
                              setIsSpeakingBook(true);
                            }
                          }}
                          className={cn(
                            "px-4.5 py-2.5 rounded-full border text-xs font-black tracking-wide flex items-center justify-center gap-2.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none",
                            isSpeakingBook
                              ? "bg-red-500 text-white border-red-400 animate-pulse"
                              : "bg-[#FF6D00] text-white border-transparent hover:bg-[#FF8100]"
                          )}
                        >
                          {isSpeakingBook ? (
                            <>
                              <VolumeX size={15} />
                              <span>{lang === 'en' ? 'Stop Voice' : 'आवाज रोकें'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={15} />
                              <span>{lang === 'en' ? 'Listen Online' : 'सजीव आवाज सुनें'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Lesson Body Contents */}
                      <div className="space-y-6 text-gray-800 dark:text-gray-205 leading-relaxed font-sans text-sm md:text-base">
                        {/* Hindi block */}
                        <div className="p-5.5 rounded-2xl bg-orange-50/10 dark:bg-orange-500/[0.01] border border-orange-500/10 space-y-4">
                          <span className="text-[10px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest block pb-1 border-b border-orange-500/10">हिंदी पाठ</span>
                          <div className="whitespace-pre-line font-medium leading-relaxed dark:text-gray-200">
                            {selectedChapter.content.hi}
                          </div>
                        </div>

                        {/* English Block */}
                        <div className="p-5.5 rounded-2xl bg-blue-50/10 dark:bg-blue-500/[0.01] border border-blue-500/10 space-y-4">
                          <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest block pb-1 border-b border-blue-500/10">English Translation</span>
                          <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-400">
                            {selectedChapter.content.en}
                          </div>
                        </div>

                        {/* Moral advice highlight card */}
                        <div className="p-5 rounded-2xl bg-[#00E676]/10 dark:bg-[#00E676]/5 border border-[#00E676]/25 flex gap-4.5">
                          <div className="w-12 h-12 bg-white dark:bg-[#121212] rounded-xl flex items-center justify-center text-[#00C853] shrink-0 shadow-sm border border-[#00E676]/15">
                            <Star className="fill-[#00C853] text-[#00C853]" size={22} />
                          </div>
                          <div className="flex-1 space-y-1 min-w-0">
                            <span className="text-[10px] font-black tracking-widest text-[#00C853] dark:text-[#69F0AE] uppercase block">संस्करण सीख (Moral Lesson)</span>
                            <p className="font-extrabold text-[#00A13A] dark:text-emerald-450 text-sm leading-relaxed">
                              {lang === 'en' ? selectedChapter.moral.en : selectedChapter.moral.hi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <SectionAiAgent section="knowledge" />
    </div>
  );
}

