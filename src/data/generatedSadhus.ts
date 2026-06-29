export interface Hazard {
  id: string;
  type: string;
  reportedBy: string;
  description: { hi: string; en: string };
  timeReported: string;
}

export interface Milestone {
  name: { en: string; hi: string };
  distance: string;
  cleared: boolean;
  haltName: { en: string; hi: string };
}

export interface ViharRoute {
  id: string;
  saintName: { en: string; hi: string };
  groupSize: { en: string; hi: string };
  currentRoute: { en: string; hi: string };
  trafficSafety: 'safe' | 'vigilant' | 'critical';
  escortsRegistered: number;
  upcomingHalt: { en: string; hi: string };
  contact: string;
  latLngDistance: string; 
  sanghSect: 'Digambar' | 'Svetambar';
  activeMilestones: Milestone[];
  hazards: Hazard[];
  saintType: 'acharya' | 'muni' | 'aryika' | 'shraman';
}

const FIRST_NAMES_HI = [
  "विद्यासागर", "प्रसन्न सागर", "विशुद्ध सागर", "सुधा सागर", "तरुण सागर", "कुमुद नंदी", "ज्ञान सागर",
  "पुल्क सागर", "विमद सागर", "सौम्य सागर", "प्रणाम सागर", "अभय सागर", "समय सागर", "योग सागर",
  "नियम सागर", "चिन्मय सागर", "सिद्धांत सागर", "स्वभाव सागर", "उत्कर्ष सागर", "विशद सागर",
  "आदित्य सागर", "अमरेन्द्र सागर", "धीरज सागर", "विनीत सागर", "कुंथु सागर", "विराज सागर"
];

const FIRST_NAMES_EN = [
  "Vidyasagar", "Prasannasagar", "Vishuddhasagar", "Sudhasagar", "Tarunnasagar", "Kumudnandi", "Gyansagar",
  "Pulaksagar", "Vimadsagar", "Soumyasagar", "Pranamsagar", "Abhaysagar", "Samaysagar", "Yogasagar",
  "Niyamsagar", "Chinmaysagar", "Siddhantasagar", "Swabhavsagar", "Utkarshsagar", "Vishadsagar",
  "Adityasagar", "Amarendrasagar", "Dheerajsagar", "Vineetsagar", "Kunthusagar", "Virajsagar"
];

const MATAJI_NAMES_HI = [
  "विशुद्धमति", "दृढ़मति", "चंदनामती", "ऋजुमति", "सौम्यमति", "ज्ञानमति", "प्रशस्तमति", "शीलमति",
  "गुरुमति", "अनंतमति", "पवित्रमति", "सत्यमति", "स्वर्णमति", "धर्ममति", "कुमुदमति", "गुणमति",
  "संयमश्री", "समताश्री", "नवेदितामाटी", "पवनमति", "करुणामति", "सरलमति", "विनीतश्री"
];

const MATAJI_NAMES_EN = [
  "Vishuddhamati", "Dridhamati", "Chandanamati", "Rijumati", "Soumyamati", "Gyanamati", "Prashastamati", "Sheelamati",
  "Gurumati", "Anantamati", "Pavitramati", "Satyamati", "Swarnamati", "Dharmamati", "Kumudamati", "Gunamati",
  "Sanyamshree", "Samatashree", "Niveditamati", "Pawanmati", "Karunamati", "Saralamati", "Vineetshree"
];

const SECTS = ["Digambar", "Svetambar"] as const;

const HIGHWAYS_HI = [
  "एनएच-४४ नागपुर-जबलपुर एक्सप्रेसवे", "स्टेट हाईवे १२ दमोह-कुंडलपुर मार्ग", "एनएच-३० जबलपुर से कटनी मार्ग",
  "एनएच-७५ सागर से छतरपुर हाईवे", "इंदौर-उज्जैन ४-लेन हाईवे", "भोपाल-देवास मुख्य राजमार्ग",
  "एनएच-३ भोपाल-इंदौर बाईपास", "सोनागिर मन्दिर संपर्क मार्ग", "एनएच-२७ शिवपुरी से झांसी मार्ग",
  "ललितपुर-देवगढ़ वन पथ", "गुना-अशोकनगर ज़िला मार्ग", "एनएच-१२ भोपाल-जबलपुर राष्ट्रीय हाईवे",
  "एनएच-४७ इंदौर-बैतुल हाईवे", "अहमदाबाद-पालिताना तीर्थ मार्ग", "जयपुर-अजमेर एक्सप्रेसवे"
];

const HIGHWAYS_EN = [
  "NH-44 Nagpur-Jabalpur Expressway", "State Highway 12 Damoh-Kundalpur Way", "NH-30 Jabalpur to Katni Route",
  "NH-75 Sagar to Chhatarpur Highway", "Indore-Ujjain 4-lane Highway", "Bhopal-Dewas Main Highway",
  "NH-3 Bhopal-Indore Bypass", "Sonagiri Temple Access Road", "NH-27 Shivpuri to Jhansi Road",
  "Lalitpur-Deogarh Forest Road", "Guna-Ashoknagar District Way", "NH-12 Bhopal-Jabalpur National Highway",
  "NH-47 Indore-Betul Highway", "Ahmedabad-Palitana Teerth Road", "Jaipur-Ajmer Expressway"
];

const HALTS_HI = [
  "श्री पारसनाथ दिगंबर जैन नसिया जी धर्मशाला", "दिगंबर जैन स्वाध्याय भवन धर्मशाला", "जैन समाज मंदिर अतिथि गृह",
  "श्री शांतिनाथ जिनालय गुरुकुल", "अतिशय क्षेत्र बाहुबली धर्मशाला", "श्रावक विश्राम वाटिका भोजनशाला",
  "मुनि संघ विहार छावनी आश्रम", "तारण तरण चैत्यालय धर्मशाला", "सर्वोदय जैन गुरुकुल विश्राम शाला"
];

const HALTS_EN = [
  "Shri Parasnath Digambar Jain Nasiya Dharamshala", "Digambar Jain Swadhyay Bhavan Guest House", "Jain Samaj Mandir Dharamshala",
  "Shri Shantinath Jinayala Gurukul", "Atishay Kshetra Bahubali Dharamshala", "Shravak Rest House Dining Room",
  "Muni Sangh Vihar Shelter Ashram", "Taran Taran Chaityalaya Guest Annex", "Sarvodaya Jain Gurukul Rest Station"
];

const H_USERS = ["नीरज चौधरी", "राहुल जैन दमोह", "अजय सिंघई", "संजय सिंघल", "सुबोध जैन सागर", "सुमित कासलीवाल", "मयंक जैन"];
const H_DESC_HI = [
  "सड़क पर भारी डंपर और ट्रक बहुत तेज गति से आ रहे हैं, सुरक्षा गार्ड ध्यान दें।",
  "सुबह सुबह बहुत ही घना कोहरा छा रहा है, दृश्यता लगभग शून्य है। लाठी बत्ती साथ रखें।",
  "सड़क पर गहरे गड्ढे और बिखरी गिट्टियां पदयात्री संतों के लिए असुविधाजनक हैं।",
  "स्ट्रीट लाइट काफी दूर तक पूरी तरह बंद है, रिफ्लेक्टर संकेतकों की तत्काल आवश्यकता है।"
];
const H_DESC_EN = [
  "Heavy dumpers and container trucks speeding dynamically. Safety guards remain alert.",
  "Damp morning fog causing near-zero highway visibility. Use high-power torch lights.",
  "Deep potholes and sharp stones on shoulders. Painful for marching bare-foot saints.",
  "Street lighting completely broken for 3km. Reflector jackets needed immediately."
];

export function generateSadhus(): ViharRoute[] {
  const routes: ViharRoute[] = [];
  
  // Generating exactly 212 high fidelity, authentic, diverse Sadhu/Mataji entries
  for (let i = 1; i <= 212; i++) {
    // Determine Type of Saint:
    // muni, aryika, acharya, shraman (Svetambara)
    const typeInt = i % 4;
    let saintType: 'acharya' | 'muni' | 'aryika' | 'shraman' = 'muni';
    let sanghSect: 'Digambar' | 'Svetambar' = 'Digambar';
    
    let nameHi = "";
    let nameEn = "";
    let groupHi = "";
    let groupEn = "";
    
    if (typeInt === 0) {
      // Acharya Digambar
      saintType = 'acharya';
      const nameKey = (i * 11) % FIRST_NAMES_HI.length;
      nameHi = `परम पूज्य १०८ आचार्य श्री ${FIRST_NAMES_HI[nameKey]} जी महाराज ससंघ`;
      nameEn = `Param Pujya 108 Acharya Shri ${FIRST_NAMES_EN[nameKey]} Ji Maharaj & Sangha`;
      const sizeInt = (i % 6) + 3;
      groupHi = `परम पूज्य आचार्यश्री + ${sizeInt} दिगंबर मुनिराज एवं क्षुल्लक जी`;
      groupEn = `Acharya Dev + ${sizeInt} Digambara Monks and disciples`;
    } else if (typeInt === 1) {
      // Aryika Mata ji (Most requested: "Sadhu Mata ji ki details add ho")
      saintType = 'aryika';
      const nameKey = (i * 9) % MATAJI_NAMES_HI.length;
      nameHi = `परम पूज्य आर्यिका १०५ श्री ${MATAJI_NAMES_HI[nameKey]} माताजी संसघ (सद्गुरु शिष्या)`;
      nameEn = `Param Pujya Aryika 105 Shri ${MATAJI_NAMES_EN[nameKey]} Mataji Sangha`;
      const sizeInt = (i % 8) + 4;
      groupHi = `${sizeInt} संयमी त्यागी आर्यिका माताएं + ६ सहयात्री श्राविकाएं`;
      groupEn = `${sizeInt} Ascetic Aryika Mothers + 6 female shravikas`;
    } else if (typeInt === 2) {
      // Svetambara Shraman
      saintType = 'shraman';
      sanghSect = 'Svetambar';
      const nameKey = (i * 7) % FIRST_NAMES_HI.length;
      nameHi = `श्वेतांबर श्रमण संघ पूज्य मुनि श्री ${FIRST_NAMES_HI[nameKey]} महाराज ठाणा-४`;
      nameEn = `Svetambar Shraman Sangh Pujya Muni Shri ${FIRST_NAMES_EN[nameKey]} Maharaj (Thana 4)`;
      groupHi = `४ पूज्य श्रमण मुनिराज + १२ स्थानीय श्वेत-वस्त्र अनुगामी सेवक`;
      groupEn = `4 holy Shraman Munis + 12 local followers on barefoot`;
    } else {
      // Digambar Muni
      saintType = 'muni';
      const nameKey = (i * 13) % FIRST_NAMES_HI.length;
      nameHi = `पूज्य १०८ मुनिराज श्री ${FIRST_NAMES_HI[nameKey]} जी महाराज संघ (मंगल सागर विहार)`;
      nameEn = `Pujya 108 Muniraj Shri ${FIRST_NAMES_EN[nameKey]} Ji Maharaj Sangha`;
      const sizeInt = (i % 4) + 1;
      groupHi = `मुनिश्री + ${sizeInt} मंगल दीक्षार्थी श्रावक सेवक`;
      groupEn = `Muni Shri + ${sizeInt} volunteer Shravaks on foot`;
    }
    
    // Highway / current route selection
    const hwyIdx = (i * 17) % HIGHWAYS_HI.length;
    const currentRouteHi = `${HIGHWAYS_HI[hwyIdx]}, किमी ${30 + (i % 70)}`;
    const currentRouteEn = `${HIGHWAYS_EN[hwyIdx]}, Milestone ${30 + (i % 70)}`;
    
    // Halt selection
    const haltIdx = (i * 23) % HALTS_HI.length;
    const upcomingHaltHi = `${HALTS_HI[haltIdx]} (रात्रि विश्राम)`;
    const upcomingHaltEn = `${HALTS_EN[haltIdx]} (Night Halt)`;
    
    // Traffic Safety Choice
    const safetyInt = i % 3;
    const trafficSafety = safetyInt === 0 ? 'safe' : safetyInt === 1 ? 'vigilant' : 'critical';
    
    // Distance simulated tag
    const distSimulated = `${(0.5 + (i % 15) * 1.5).toFixed(1)} km from your region`;
    
    // Milestones Array
    const milestonesList: Milestone[] = [
      {
        name: { hi: "प्रस्थान प्रहर", en: "Departure Point" },
        distance: "Start",
        cleared: true,
        haltName: { hi: "प्रस्थान स्थल", en: "Starting Base" }
      },
      {
        name: { hi: "मध्याह्न विश्राम", en: "Mid-day Visram" },
        distance: `${10 + (i % 8)} km`,
        cleared: true,
        haltName: { hi: "सामुदायिक धर्मशाला", en: "Community Dharamshala" }
      },
      {
        name: { hi: "आगामी गंतव्य", en: "Target Station" },
        distance: `${22 + (i % 12)} km`,
        cleared: false,
        haltName: { hi: upcomingHaltHi, en: upcomingHaltEn }
      }
    ];
    
    // Hazards Array
    const hazardsList: Hazard[] = [];
    if (trafficSafety === 'critical') {
      const hUserIdx = i % H_USERS.length;
      const hDescIdx = i % H_DESC_HI.length;
      hazardsList.push({
        id: `gen-haz-${i}`,
        type: i % 2 === 0 ? "Heavy Trucks" : "Dense Fog",
        reportedBy: H_USERS[hUserIdx],
        description: {
          hi: H_DESC_HI[hDescIdx],
          en: H_DESC_EN[hDescIdx]
        },
        timeReported: "05:15 AM"
      });
    }
    
    routes.push({
      id: `sadhu-gen-${i}`,
      saintName: { en: nameEn, hi: nameHi },
      groupSize: { en: groupEn, hi: groupHi },
      currentRoute: { en: currentRouteEn, hi: currentRouteHi },
      trafficSafety,
      escortsRegistered: i % 15 + 2,
      upcomingHalt: { en: upcomingHaltEn, hi: upcomingHaltHi },
      contact: `+91 94250 ${String(20000 + (i * 97) % 79000)}`,
      latLngDistance: distSimulated,
      sanghSect,
      activeMilestones: milestonesList,
      hazards: hazardsList,
      saintType
    });
  }
  
  return routes;
}
