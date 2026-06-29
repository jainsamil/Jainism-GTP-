export interface VideoItem {
  id: string;
  type: 'movies' | 'webseries' | 'digital_stories' | 'devotional_videos';
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  category: string;
  duration?: string; // for movies & stories
  episodesCount?: number; // for webseries
  episodes?: {
    episodeNumber: number;
    title: { en: string; hi: string };
    description: { en: string; hi: string };
    duration: string;
    videoUrl: string;
    thumbnail: string;
  }[];
  thumbnail: string;
  videoUrl: string; // fallback or main player URL
  rating: number;
  year: string;
  tags: string[];
}

export const fallbackMediaData = {
  movies: [
    {
      id: "ott_movie_1",
      type: "movies",
      title: {
        en: "Bhagwan Mahavir: The Light of Compassion",
        hi: "भगवान महावीर: करुणा की प्रतिमूर्ति (महागाथा)"
      },
      description: {
        en: "An epic cinematic journey into the life of Vardhaman Mahavira, depicting his royal childhood, deep renunciation, 12 years of severe penance, and ultimate attainment of Kevalgyan.",
        hi: "तीर्थंकर वर्धमान महावीर के जीवन पर आधारित एक भव्य ऐतिहासिक महागाथा। उनके राजसी वैभव, घोर तपस्या, कामदेव विजय और केवलज्ञान प्राप्ति का अलौकिक चित्रण।"
      },
      category: "Historical Drama",
      duration: "2h 15m",
      thumbnail: "https://images.unsplash.com/photo-1609137144813-f66fcc430f80?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/tM1l-5VfTss", // Real Bhagwan Mahavir katha
      rating: 4.9,
      year: "2024",
      tags: ["Mahavir Swami", "Kevalgyan", "Ahimsa", "Historical"]
    },
    {
      id: "ott_movie_2",
      type: "movies",
      title: {
        en: "Sati Anjana & Pawananjay: The Epitome of Patience",
        hi: "सती अंजना और पवनंजय: पावन चरित्र गाथा"
      },
      description: {
        en: "A deeply moving legend of Sati Anjana's unwavering faith, patience under trial, and ultimate reunion with Pawananjay, illustrating the power of pure Jain character.",
        hi: "सती अंजना के अटूट पतिव्रत धर्म, धैर्य, कठिन वनवास काल की परीक्षा और पवनंजय कुमार के साथ उनके मिलन की भावुक करने वाली अनुपम पौराणिक कथा।"
      },
      category: "Mythological Legend",
      duration: "1h 55m",
      thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/Z0o_o5e8k9w", // Jain Sati Character Audio Story
      rating: 4.8,
      year: "2023",
      tags: ["Puran Katha", "Sati Anjana", "Patience", "Moral Story"]
    },
    {
      id: "ott_movie_3",
      type: "movies",
      title: {
        en: "King Shripal & Maynasundari: Miracle of Navpad",
        hi: "राजा श्रीपाल और मैनासुन्दरी: नवपद ओली महात्म्य"
      },
      description: {
        en: "Witness the miraculous power of Siddhachakra Navpad devotion as Princess Maynasundari heals King Shripal and 700 soldiers from leprosy through pure faith and spiritual austerity.",
        hi: "सिद्धचक्र नवपद आराधना की अलौकिक शक्ति! जब राजकुमारी मैनासुन्दरी ने अपने परम पवित्र तप और दृढ़ निश्चय से कोढ़ग्रस्त पति राजा श्रीपाल और ७०० सैनिकों को रोगमुक्त किया।"
      },
      category: "Spiritual Miracle",
      duration: "2h 05m",
      thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/v2L9R6S8jO4", // Siddhachakra Mahatmya Pravachan
      rating: 4.9,
      year: "2025",
      tags: ["Navpad Oli", "Siddhachakra", "Maynasundari", "Miracle"]
    },
    {
      id: "ott_movie_4",
      type: "movies",
      title: {
        en: "Samrat Chandragupta Maurya: The Ultimate Renunciation",
        hi: "सम्राट चंद्रगुप्त मौर्य: साम्राज्य से मोक्ष पथ"
      },
      description: {
        en: "The historic transformation of India's sovereign emperor Chandragupta Maurya who abandoned his massive throne under Acharya Bhadrabahu to embrace the barefoot Digambara monastic life.",
        hi: "भारत के महान सम्राट चंद्रगुप्त मौर्य के वैराग्य की अमर गाथा। आचार्य भद्रबाहु स्वामी के सानिध्य में अखंड साम्राज्य को तिनके के समान त्याग कर दिगंबर मुनि दीक्षा धारण करने का गौरवमयी इतिहास।"
      },
      category: "Biopic History",
      duration: "1h 45m",
      thumbnail: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/kYF3f_O89tQ", // Chandragupta and Bhadrabahu history
      rating: 4.7,
      year: "2022",
      tags: ["Shravanabelagola", "Chandragupta", "Bhadrabahu", "Nirgrantha"]
    },
    {
      id: "ott_movie_5",
      type: "movies",
      title: {
        en: "Chakravarti Bharat & Bahubali: Battle of Sovereignty",
        hi: "चक्रवर्ती भरत और बाहुबली: वैराग्य का महासंग्राम"
      },
      description: {
        en: "The intense physical conflict and dramatic transformation of brothers Bharat and Bahubali. Bahubali renounces his kingdom mid-battle upon realizing the vanity of worldly desires, standing tall in Kayotsarga.",
        hi: "चक्रवर्ती भरत और महाबली बाहुबली के बीच साम्राज्य की सर्वोच्चता का युद्ध, और फिर युद्ध के चरम क्षणों में बाहुबली का परम वैराग्य! संसार की नश्वरता को जान बाहुबली का खड़े-खड़े घोर तप में लीन होना।"
      },
      category: "Epic History",
      duration: "2h 30m",
      thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/1_WstS87eoo", // Bahubali story pravachan
      rating: 4.9,
      year: "2024",
      tags: ["Bahubali", "Bharat Chakravarti", "Kayotsarga", "Lord Adinath"]
    }
  ] as VideoItem[],

  webseries: [
    {
      id: "ott_series_1",
      type: "webseries",
      title: {
        en: "Ahimsa: The Eternal Echo",
        hi: "अहिंसा: सत्य की अमर गूँज (Web Series)"
      },
      description: {
        en: "A modern documentary-drama investigating how the ancient principles of Jain Ahimsa, Satya, and Anekantavada can solve global environmental crises and psychological anxiety today.",
        hi: "एक आधुनिक डॉक्यू-ड्रामा सीरीज़, जो बताती है कि प्राचीन जैन सिद्धांत (अहिंसा, अपरिग्रह, अनेकांतवाद) वर्तमान वैश्विक पर्यावरण संकट और मानसिक तनाव को कैसे मिटा सकते हैं।"
      },
      category: "Docu-Series",
      episodesCount: 5,
      thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/mG0w9p9Y6lY", // Jain philosophy values documentary
      rating: 4.9,
      year: "2025",
      tags: ["Modern Ahimsa", "Anekantavada", "Jain Philosophy", "Ecology"],
      episodes: [
        {
          episodeNumber: 1,
          title: { en: "The Root of Ahimsa", hi: "अध्याय १: सूक्ष्म जीवों की रक्षा" },
          description: { en: "Understanding microscopic life protection and how non-violence begins from our kitchen and everyday habits.", hi: "सूक्ष्म जीवों के प्रति संवेदनशीलता और हमारी रसोई से शुरू होने वाले अहिंसक आहार विहार का गूढ़ वैज्ञानिक रहस्य।" },
          duration: "24m",
          videoUrl: "https://www.youtube.com/embed/mG0w9p9Y6lY",
          thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 2,
          title: { en: "Anekantavada: Many-Sided Truth", hi: "अध्याय २: अनेकांतवाद का महा दर्शन" },
          description: { en: "How respect for different viewpoints and open-minded communication can eliminate modern polarization.", hi: "दूसरे के दृष्टिकोण का आदर! वैचारिक कट्टरता को दूर कर समाज में शांति स्थापित करने की सर्वोत्कृष्ट जैन न्याय कला।" },
          duration: "26m",
          videoUrl: "https://www.youtube.com/embed/L1m4I64-D7o",
          thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 3,
          title: { en: "Aparigraha & Minimalism", hi: "अध्याय ३: अपरिग्रह और सन्तुष्टि" },
          description: { en: "Redefining happiness through self-limitation of possessions in a hyper-consumerist world.", hi: "असीमित इच्छाओं का दमन! उपभोक्तावादी संस्कृति के बीच कम से कम साधनों में परम सुखी रहने का अनुपम जैन फॉर्मूला।" },
          duration: "28m",
          videoUrl: "https://www.youtube.com/embed/rV58fV4V6Zc",
          thumbnail: "https://images.unsplash.com/photo-1491841573634-28140fc7ccd7?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 4,
          title: { en: "The Science of Fasting", hi: "अध्याय ४: तपस्या का जैविक विज्ञान" },
          description: { en: "An analysis of the cellular autophagy triggered during standard Jain fasting periods.", hi: "जैन उपवास और मर्यादाओं का शरीर विज्ञान। उपवास के दौरान शरीर की स्वतः-शुद्धि (Autophagy) का वैज्ञानिक अनुसंधान।" },
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/SgTepD62Y_M",
          thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 5,
          title: { en: "Soul Realization (Samyaktva)", hi: "अध्याय ५: अंतर्मन का केवलज्ञान" },
          description: { en: "The ultimate climax of docu-series, explaining the transition from active householder to meditation.", hi: "साधु आचरण, बारह भावनाओं का चिन्तन और अपनी दिव्य चैतन्य आत्मा की अनुभूति का परम मार्ग।" },
          duration: "32m",
          videoUrl: "https://www.youtube.com/embed/Y0rQ1I7lC0w",
          thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"
        }
      ]
    },
    {
      id: "ott_series_2",
      type: "webseries",
      title: {
        en: "Tirthankars: Spiritual Giants",
        hi: "तीर्थंकर: सनातन पथ प्रदर्शक (Animated Web Series)"
      },
      description: {
        en: "An epic animated series detailing the historical occurrences and miraculous Kalyanaks of all 24 Tirthankaras from Lord Adinath to Lord Mahavir.",
        hi: "प्रथम तीर्थंकर आदिनाथ भगवान से लेकर चरम तीर्थंकर भगवान महावीर स्वामी तक, सभी २४ तीर्थंकरों के पंचकल्याणक, जन्म गाथा और तप कल्याणक को दर्शाती एक अद्भुत एनिमेटेड श्रृंखला।"
      },
      category: "Animated Biopic",
      episodesCount: 4,
      thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/1B16N8X6i2w", // Jain tirthankars documentary
      rating: 4.8,
      year: "2024",
      tags: ["Animated", "Kids Special", "24 Tirthankars", "Panchkalyanak"],
      episodes: [
        {
          episodeNumber: 1,
          title: { en: "Lord Adinath: Dawn of Civilization", hi: "भाग १: युगस्रष्टा भगवान आदिनाथ" },
          description: { en: "The establishment of Ikshvaku lineage, teaching of Asi, Masi, Krishi, and the dynamic detachment of Lord Rishabhdev.", hi: "इक्ष्वाकु वंश की स्थापना, असि-मसि-कृषि का उपदेश, और नीलांजना का नृत्य देखकर ऋषभदेव जी को हुए परम वैराग्य की गाथा।" },
          duration: "20m",
          videoUrl: "https://www.youtube.com/embed/1B16N8X6i2w",
          thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 2,
          title: { en: "Lord Parshvanath: Conqueror of Obstacles", hi: "भाग २: कमठ का उपसर्ग और धरणेन्द्र पद्मावती" },
          description: { en: "The life of 23rd Tirthankara, showing how he stood unmoved during Kamatha's severe storm of boulders.", hi: "२३वें तीर्थंकर पार्श्वनाथ भगवान का अनुपम धीरज! कमठ के घोर उपसर्ग और पत्थरों की वर्षा के बीच धरणेन्द्र-पद्मावती द्वारा छत्र लगाने का दिव्य दृश्य।" },
          duration: "22m",
          videoUrl: "https://www.youtube.com/embed/Y0rQ1I7lC0w",
          thumbnail: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 3,
          title: { en: "Lord Neminath: Mercy to Animals", hi: "भाग ३: पशु करुणा और गिरनार वैराग्य" },
          description: { en: "Prince Neminatha abandons his wedding procession upon hearing the screams of caged animals, riding straight to Mount Girnar.", hi: "राजकुमार नेमिनाथ का विवाह प्रस्थान, पशुओं का करुण क्रंदन सुनकर बारात को मोड़ना, और राजुल का परित्याग कर गिरनार जी की ओर प्रयाण।" },
          duration: "21m",
          videoUrl: "https://www.youtube.com/embed/6_6vP8P-0zI",
          thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop"
        },
        {
          episodeNumber: 4,
          title: { en: "Lord Mahavira: Lion of Kundalpur", hi: "भाग ४: सिंहनाद वीर महावीर" },
          description: { en: "The final Tirthankara's journey, childhood bravery, supreme path of Ahimsa, and Nirvana in Pawapuri.", hi: "२४वें तीर्थंकर भगवान महावीर का जन्म, सिद्धार्थ-त्रिशला नंदन का बाल्यकाल, संगम देव की परीक्षा और पावापुरी से मोक्ष गमन।" },
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/mG0w9p9Y6lY",
          thumbnail: "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?q=80&w=400&auto=format&fit=crop"
        }
      ]
    }
  ] as VideoItem[],

  digital_stories: [
    {
      id: "ott_story_1",
      type: "digital_stories",
      title: {
        en: "The Elephant & Six Blind Sages (Anekantavada for Kids)",
        hi: "हाथी और छह अंधे मुसाफ़िर (अनेकांतवाद की सरल सीख)"
      },
      description: {
        en: "A beautiful, colorful interactive story showing how six blind men describe an elephant based on individual touch, illustrating the core Jain value of respecting multi-sided truth.",
        hi: "एक मनोरंजक और सचित्र कहानी, जिसमें छह यात्री अपने स्पर्श अनुसार हाथी का वर्णन करते हैं। बच्चों को 'स्याद्वाद' और 'अनेकांतवाद' (विविध विचारों का सम्मान) समझाने के लिए सर्वश्रेष्ठ गाथा।"
      },
      category: "Kids Moral Story",
      duration: "10m",
      thumbnail: "https://images.unsplash.com/photo-1491841573634-28140fc7ccd7?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/fWsc1v6l060", // Real story of six blind men & elephant
      rating: 4.8,
      year: "2024",
      tags: ["Children Special", "Moral Lesson", "Interactive Animation", "Anekantvada"]
    },
    {
      id: "ott_story_2",
      type: "digital_stories",
      title: {
        en: "Golden Squirrel's Sacred Alms (The Power of Pure Intent)",
        hi: "स्वर्ण गिलहरी का अद्भुत दान (भावों की पावन शक्ति)"
      },
      description: {
        en: "Discover how a small, humble squirrel gained immense high-state celestial merits through offering a tiny piece of fruit to a silent monk with pure, selfless devotion.",
        hi: "एक नन्हीं गिलहरी ने कैसे अपने शुद्ध और निष्काम भावों से एक तपस्वी मुनिराज के हस्तकमल में फल का अंश दान किया, और उस उच्च त्याग के प्रभाव से स्वर्ग का सुख प्राप्त किया।"
      },
      category: "Kids Bedtime Story",
      duration: "08m",
      thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/8wS8z2m7Txs", // Real Jain moral lessons animation
      rating: 4.7,
      year: "2023",
      tags: ["Ahar Dan", "Purity of Mind", "Karma", "Animals"]
    },
    {
      id: "ott_story_3",
      type: "digital_stories",
      title: {
        en: "Siddha Monk Prasannachandra: The Mind's Quiet Battlefield",
        hi: "राजर्षि प्रसन्नचंद्र: अंतर्मन का अदृश्य महासंग्राम"
      },
      description: {
        en: "An inspiring moral story showing how Prasannachandra Rajarshi won over his deep internal anger during meditation, progressing from the brink of hell directly to the highest state of Kevalgyan in moments.",
        hi: "ध्यानमग्न मुनिराज प्रसन्नचंद्र के मन में उठे क्रोध के संकल्प, और तत्पश्चात आत्मा की गहराई में उतरकर क्षणभर में सातवें नरक के योग्य परिणामों से सीधे केवलज्ञान प्राप्त करने का दिव्य इतिहास।"
      },
      category: "Wisdom Tale",
      duration: "12m",
      thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/7V663pbe8fU", // Prasannachandra story video
      rating: 4.9,
      year: "2024",
      tags: ["Mind Control", "Meditation", "Kevalgyan", "Anger Victory"]
    }
  ] as VideoItem[],

  devotional_videos: [
    {
      id: "ott_video_1",
      type: "devotional_videos",
      title: {
        en: "Divine Drone Tour: Sonagiri Siddha Kshetra",
        hi: "सोनागिर जी सिद्धक्षेत्र: दिव्य ड्रोन दर्शन (77 पर्वत जिनालय)"
      },
      description: {
        en: "Experience a breathtaking high-definition aerial visualization of the 77 pristine white temples scattered across the sacred hills of Sonagiri, where millions of ascetics attained Moksha.",
        hi: "सोनागिर जी के सिद्धक्षेत्र की पावन पहाड़ियों पर स्थित ७७ गगनचुंबी श्वेत जिनालयों के मंत्रमुग्ध कर देने वाले एरियल (ड्रोन) दर्शन। जहाँ से साढ़े पांच करोड़ मुनिराजों ने मोक्ष प्राप्त किया।"
      },
      category: "Temple Darshan",
      duration: "06m 45s",
      thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/MhL2N38l6Z0", // Real Sonagiri drone darshan
      rating: 4.9,
      year: "2025",
      tags: ["Sonagiri", "Madhya Pradesh", "Drone Darshan", "Siddha Kshetra"]
    },
    {
      id: "ott_video_2",
      type: "devotional_videos",
      title: {
        en: "Cosmic Namokar Mantra: Universal Mind Healing Video",
        hi: "णमोकार महामंत्र: दिव्य ब्रह्मांड ध्यान संगीत (3D Visuals)"
      },
      description: {
        en: "A premium 3D cosmic animation set to the continuous meditative chant of the Navkar Mantra. Perfect for aligning focus, lowering stress, and experiencing deep tranquility.",
        hi: "णमोकार महामंत्र के दिव्य स्वरों पर आधारित ३D ब्रह्मांडीय ध्यान यात्रा। मन को एकाग्र करने, नकारात्मक ऊर्जा मिटाने और गहरा मानसिक संतोष पाने के लिए सर्वोत्तम संगीत वीडियो।"
      },
      category: "Cosmic Meditation",
      duration: "15m",
      thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/6_6vP8P-0zI", // Real peaceful Namokar Mantra chant
      rating: 4.9,
      year: "2024",
      tags: ["Meditation", "Namokar Mantra", "Healer", "Peaceful"]
    },
    {
      id: "ott_video_3",
      type: "devotional_videos",
      title: {
        en: "Sammed Shikharji Hill Trek: Sacred Mountain Documentary",
        hi: "श्री सम्मेद शिखरजी महातीर्थ वंदना: अलौकिक डाक्यूमेंट्री"
      },
      description: {
        en: "Journey up the holy hills of Sammed Shikharji (Parasnath), where 20 out of 24 Tirthankaras walked their final steps to infinite liberation. Includes history, rare foot-prints, and guidelines for volunteers.",
        hi: "विश्व के सबसे महान जैन शाश्वत तीर्थराज सम्मेद शिखरजी (झारखंड) की पावन वंदना! २० तीर्थंकरों की निर्वाण भूमि की ऐतिहासिक गाथा, चरण चिन्हों के दुर्लभ दर्शन और यात्रियों हेतु नियम।"
      },
      category: "Documentary Pilgrimage",
      duration: "18m 30s",
      thumbnail: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=800&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/embed/rV58fV4V6Zc", // Real Sammed Shikharji pilgrimage trek yatra
      rating: 5.0,
      year: "2025",
      tags: ["Shikharji", "Parasnath", "Kalyanak", "Pilgrimage"]
    }
  ] as VideoItem[],

  stories: [
    {
      id: "fb_story_1",
      type: "stories",
      title: "महान राजा श्रीपाल और मैनासुन्दरी की कथा",
      artist: "जैन धर्म ग्रन्थ",
      duration: "14:25",
      thumbnail: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    },
    {
      id: "fb_story_2",
      type: "stories",
      title: "आचार्य मानतुंग और भक्तामर की ४८ बेड़ियाँ",
      artist: "ऐतिहासिक गाथा",
      duration: "18:45",
      thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3"
    },
    {
      id: "fb_story_3",
      type: "stories",
      title: "सती अंजना और पवनंजय की पावन कथा",
      artist: "पुराण कथा",
      duration: "21:10",
      thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    },
    {
      id: "fb_story_4",
      type: "stories",
      title: "शालिभद्र की अनुपम दानवीरता",
      artist: "जैन शास्त्र गाथा",
      duration: "11:30",
      thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3"
    },
    {
      id: "fb_story_5",
      type: "stories",
      title: "चाणक्य और महाराजा चंद्रगुप्त का वैराग्य",
      artist: "इतिहास गाथा",
      duration: "16:15",
      thumbnail: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3"
    },
    {
      id: "fb_story_6",
      type: "stories",
      title: "महादानी सेठ सुदर्शन की धर्म परीक्षा",
      artist: "आध्यात्मिक चरित्र",
      duration: "13:05",
      thumbnail: "https://images.unsplash.com/photo-1491841573634-28140fc7ccd7?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    }
  ],

  bhajans: [
    {
      id: "fb_bhajan_1",
      type: "bhajans",
      title: "प्रभु पतित पावन मैं अपावन",
      artist: "पं. द्यानतराय",
      duration: "05:43",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3"
    },
    {
      id: "fb_bhajan_2",
      type: "bhajans",
      title: "भगवान महावीर स्वामी की दिव्य स्तुति",
      artist: "पारम्परिक भजन",
      duration: "06:12",
      thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    },
    {
      id: "fb_bhajan_3",
      type: "bhajans",
      title: "हे पार्श्वनाथ स्वामी दुःख भंजन",
      artist: "स्वर साधना मंडल",
      duration: "07:30",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3"
    }
  ],

  audiobooks: [
    {
      id: "fb_book_2",
      type: "audiobooks",
      title: "तत्वार्थ सूत्र सम्पूर्ण विवेचन (Tattvarth Sutra)",
      author: "आचार्य उमास्वामी",
      chapters: 10,
      duration: "05 hrs 45 mins",
      thumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    },
    {
      id: "fb_book_5",
      type: "audiobooks",
      title: "रत्नाकरंड श्रावकाचार विवेचना (Ratnakaranda)",
      author: "आचार्य समन्तभद्र स्वामी",
      chapters: 7,
      duration: "04 hrs 50 mins",
      thumbnail: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3"
    },
    {
      id: "fb_book_7",
      type: "audiobooks",
      title: "छहढाला प्रवचन और गायन (Chhahdhala)",
      author: "पं. दौलतराम जी",
      chapters: 6,
      duration: "02 hrs 40 mins",
      thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3"
    },
    {
      id: "fb_book_9",
      type: "audiobooks",
      title: "इष्टोपदेश अमृतवाणी विवेचन (Ishtopadesh)",
      author: "आचार्य पूज्यपाद देव",
      chapters: 5,
      duration: "03 hrs 15 mins",
      thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3"
    },
    {
      id: "fb_book_20",
      type: "audiobooks",
      title: "आप्तमीमांसा - स्याद्वाद विवेचन (Aptamimansa)",
      author: "आचार्य समन्तभद्र स्वामी",
      chapters: 5,
      duration: "06 hrs 50 mins",
      thumbnail: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format&fit=crop",
      url: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3"
    }
  ]
};
