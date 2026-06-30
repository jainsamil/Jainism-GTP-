export interface VideoItem {
  id: string;
  type: 'movies' | 'webseries' | 'digital_stories' | 'devotional_videos' | 'stories' | 'bhajans' | 'audiobooks';
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  category: string;
  duration?: string;
  episodesCount?: number;
  episodes?: {
    episodeNumber: number;
    title: { en: string; hi: string };
    description: { en: string; hi: string };
    duration: string;
    videoUrl: string;
    thumbnail: string;
  }[];
  thumbnail: string;
  videoUrl: string;
  rating: number;
  year: string;
  tags: string[];
  embedDisabled?: boolean;
}

export const fallbackMediaData = {
  movies: [
    {
      id: "movie_1",
      type: "movies",
      title: { en: "Bhagwan Mahavir Movie", hi: "भगवान महावीर: संपूर्ण जीवन दर्शन" },
      description: { en: "A full detailed spiritual movie depicting the life, penance, and supreme teachings of Lord Mahavir.", hi: "भगवान महावीर स्वामी के त्याग, तपस्या और अहिंसा के अमर सिद्धांतों को दर्शाती दिव्य ऐतिहासिक फिल्म।" },
      category: "Biopic Drama",
      duration: "2h 10m",
      thumbnail: "https://img.youtube.com/vi/3apHlQW5M2g/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/3apHlQW5M2g",
      rating: 4.9,
      year: "2024",
      tags: ["Mahavir Swami", "Nirvana", "Historical"],
      embedDisabled: true
    },
    {
      id: "movie_2",
      type: "movies",
      title: { en: "Miracle of Siddhachakra Navpad Movie", hi: "सिद्धचक्र नवपद ओली महात्म्य फिल्म" },
      description: { en: "An inspiring spiritual movie on King Shripal and Maynasundari depicting the greatness of Navpad Oli.", hi: "राजा श्रीपाल और सती मैनासुन्दरी के पावन चरित्र तथा सिद्धचक्र महायंत्र आराधना के अलौकिक माहात्म्य की गाथा।" },
      category: "Spiritual Miracle",
      duration: "1h 45m",
      thumbnail: "https://img.youtube.com/vi/32wJgclK55Q/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/32wJgclK55Q",
      rating: 4.8,
      year: "2023",
      tags: ["Siddhachakra", "Navpad Oli", "Maynasundari"]
    },
    {
      id: "movie_3",
      type: "movies",
      title: { en: "Sati Anjana & Pawananjay Movie", hi: "सती अंजना और पवनंजय पावन गाथा" },
      description: { en: "The legend of Sati Anjana's supreme patience, pure faith, and unwavering character through testing times.", hi: "सती अंजना के अखंड पतिव्रत धर्म, असहनीय वनवास कष्टों के बीच उनके अप्रतिम धैर्य की अनुपम गाथा।" },
      category: "Puranic Legend",
      duration: "2h 05m",
      thumbnail: "https://img.youtube.com/vi/EyFfPzm7mSs/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/EyFfPzm7mSs",
      rating: 4.9,
      year: "2024",
      tags: ["Puran", "Sati Anjana", "Character"]
    },
    {
      id: "movie_4",
      type: "movies",
      title: { en: "Samrat Chandragupta Maurya Devotion Movie", hi: "सम्राट चंद्रगुप्त मौर्य वैराग्य फिल्म" },
      description: { en: "The historic renunciation of Emperor Chandragupta Maurya under Acharya Bhadrabahu to embrace Muni Diksha.", hi: "भारत के सम्राट चंद्रगुप्त द्वारा मुकुट त्याग कर आचार्य भद्रबाहु स्वामी से दिगंबर दीक्षा ग्रहण करने का स्वर्णिम इतिहास।" },
      category: "Historical Drama",
      duration: "1h 50m",
      thumbnail: "https://img.youtube.com/vi/alsULMbkmr4/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/alsULMbkmr4",
      rating: 4.7,
      year: "2022",
      tags: ["Chandragupta", "Bhadrabahu", "Muni Diksha"]
    },
    {
      id: "movie_5",
      type: "movies",
      title: { en: "Bharat Bahubali Epic Conflict Movie", hi: "चक्रवर्ती भरत और बाहुबली वैराग्य गाथा" },
      description: { en: "The epic conflict between brothers Bharat and Bahubali, leading to Bahubali standing tall in ultimate meditation.", hi: "भरत चक्रवर्ती और महाबली बाहुबली के युद्ध तथा चरम क्षणों में बाहुबली के परम वैराग्य का अलौकिक चित्रण।" },
      category: "Epic History",
      duration: "2h 15m",
      thumbnail: "https://img.youtube.com/vi/l0zMMdQLwtQ/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/l0zMMdQLwtQ",
      rating: 4.9,
      year: "2024",
      tags: ["Bahubali", "Bharat", "Renunciation"]
    },
    {
      id: "movie_6",
      type: "movies",
      title: { en: "Nirgrantha: The Path of Liberation Movie", hi: "निर्ग्रन्थ: जैन मुनि चर्या और मोक्ष पथ" },
      description: { en: "An authentic, heart-touching depiction of the highly rigorous barefoot path of Digambara Jain Monks.", hi: "कठिन २८ मूलगुणों का पालन करने वाले दिगंबर जैन संतों की चर्या और ध्यान साधना की जीवंत फिल्म।" },
      category: "Ascetic Journey",
      duration: "1h 55m",
      thumbnail: "https://img.youtube.com/vi/5pS0rnfsM5I/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/5pS0rnfsM5I",
      rating: 4.9,
      year: "2025",
      tags: ["Muni Charya", "Digambara", "Moksha Path"]
    }
  ] as VideoItem[],

  webseries: [
    {
      id: "webseries_1",
      type: "webseries",
      title: { en: "Jain Spiritual Journey Web Series", hi: "जैन धर्म आध्यात्मिक यात्रा - वेबसीरीज" },
      description: { en: "A beautiful 4-part series detailing the essence of Jain traditions, conduct, and soul realization.", hi: "आत्मा की गहराइयों, मुनि परंपरा और जैन धर्म के पवित्र आचरण को दर्शाती ४ भागों की अद्भुत श्रृंखला।" },
      category: "Spiritual Docu-Drama",
      episodesCount: 4,
      thumbnail: "https://img.youtube.com/vi/8vCEW7C2nK0/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/8vCEW7C2nK0",
      rating: 4.9,
      year: "2025",
      tags: ["Web Series", "Spiritual", "Pravachan", "Ahimsa"],
      episodes: [
        {
          episodeNumber: 1,
          title: { en: "Spiritual Journey - Part 1", hi: "आध्यात्मिक यात्रा - भाग १" },
          description: { en: "Introduction to the holy path of self-realization and purification of karmic bonds.", hi: "आत्म-कल्याण, कर्मों की निर्जरा और संयम पथ की शुरुआत का अलौकिक रहस्य।" },
          duration: "25m",
          videoUrl: "https://www.youtube.com/embed/8vCEW7C2nK0",
          thumbnail: "https://img.youtube.com/vi/8vCEW7C2nK0/hqdefault.jpg"
        },
        {
          episodeNumber: 2,
          title: { en: "Spiritual Journey - Part 2", hi: "आध्यात्मिक यात्रा - भाग २" },
          description: { en: "Deepening the spiritual focus, meditation, and developing steady self-awareness.", hi: "ध्यान योग की गहराई, आत्मा की जागृति और बाह्य आकर्षणों से विरक्ति का सुंदर अध्याय।" },
          duration: "28m",
          videoUrl: "https://www.youtube.com/embed/RvFyJfr_roQ",
          thumbnail: "https://img.youtube.com/vi/RvFyJfr_roQ/hqdefault.jpg"
        },
        {
          episodeNumber: 3,
          title: { en: "Spiritual Journey - Part 3", hi: "आध्यात्मिक यात्रा - भाग ३" },
          description: { en: "The power of self-restraint and internal silence for complete peace of mind.", hi: "इंद्रिय संयम, मानसिक मौन और मुनि चर्या की पावन परंपराओं का गहन स्वाध्याय।" },
          duration: "30m",
          videoUrl: "https://www.youtube.com/embed/lYLZBqNOZI0",
          thumbnail: "https://img.youtube.com/vi/lYLZBqNOZI0/hqdefault.jpg"
        },
        {
          episodeNumber: 4,
          title: { en: "Spiritual Journey - Part 4", hi: "आध्यात्मिक यात्रा - भाग ४" },
          description: { en: "The ultimate peak of self-realization and experiencing the infinite bliss of Kevalgyan.", hi: "केवलज्ञान की प्राप्ति, मुक्ति का परम पुरुषार्थ और सिद्ध अवस्था की अनुभूति।" },
          duration: "32m",
          videoUrl: "https://www.youtube.com/embed/RNKR48rdB-w",
          thumbnail: "https://img.youtube.com/vi/RNKR48rdB-w/hqdefault.jpg"
        }
      ]
    }
  ] as VideoItem[],

  digital_stories: [
    {
      id: "kids_story_1",
      type: "digital_stories",
      title: { en: "The Kind Prince & Sage's Blessing", hi: "दयालु राजकुमार और साधु का आशीर्वाद" },
      description: { en: "An engaging animated story about compassionate choices and the power of pure intentions.", hi: "जीव दया और अहिंसा की भावना पर आधारित बच्चों के लिए अत्यंत प्रेरणादायक कहानी।" },
      category: "Kids Moral Story",
      duration: "12m",
      thumbnail: "https://img.youtube.com/vi/jpgrzdJNFBQ/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/jpgrzdJNFBQ",
      rating: 4.8,
      year: "2024",
      tags: ["Kids", "Moral", "Compassion"]
    },
    {
      id: "kids_story_2",
      type: "digital_stories",
      title: { en: "Power of Pure Thoughts & Karma", hi: "मन के सुंदर विचारों की पावन शक्ति" },
      description: { en: "Learn how the vibration of our mind directly impacts our karma and future states of birth.", hi: "भावों की निर्मलता की सीख देती कहानी, जो बच्चों को अच्छे विचार रखने की प्रेरणा देती है।" },
      category: "Kids Moral Story",
      duration: "10m",
      thumbnail: "https://img.youtube.com/vi/QSpzgytJidE/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/QSpzgytJidE",
      rating: 4.8,
      year: "2024",
      tags: ["Moral", "Thoughts", "Karma"]
    },
    {
      id: "kids_story_3",
      type: "digital_stories",
      title: { en: "Moral Stories from Jain Panchatantra", hi: "जैन नीति और पंचतंत्र की सुंदर सीख" },
      description: { en: "A collection of beautiful short fables emphasizing non-violence and honesty for kids.", hi: "पशु-पक्षियों के माध्यम से अहिंसा, सत्य और संतोष की सरल शिक्षा देने वाली कहानी।" },
      category: "Kids Moral Story",
      duration: "11m",
      thumbnail: "https://img.youtube.com/vi/Zj_bRj3tFl4/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/Zj_bRj3tFl4",
      rating: 4.7,
      year: "2023",
      tags: ["Kids", "Fables", "Ahimsa"]
    },
    {
      id: "kids_story_4",
      type: "digital_stories",
      title: { en: "The Divine Power of Namokar Mantra", hi: "णमोकार महामंत्र की असीम महिमा" },
      description: { en: "Experience how the sacred five-fold mantra provides divine protection and cosmic strength.", hi: "णमोकार मंत्र के पाँचों पदों की वंदना और उसका उच्चारण करने से जीवन में आने वाले मंगल की कहानी।" },
      category: "Kids Devotional",
      duration: "15m",
      thumbnail: "https://img.youtube.com/vi/tT-wGeIRDJA/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/tT-wGeIRDJA",
      rating: 4.9,
      year: "2025",
      tags: ["Namokar", "Chanting", "Faith"]
    },
    {
      id: "kids_story_5",
      type: "digital_stories",
      title: { en: "Selfless Offerings & Virtuous Alms", hi: "सच्ची श्रद्धा और पवित्र मुनि आहार दान" },
      description: { en: "The spiritual beauty of offering pure food to silent ascetics with utmost respect and joy.", hi: "नवधा भक्ति पूर्वक मुनिराज को उत्तम प्राशुक आहार दान करने का सुंदर महत्व।" },
      category: "Kids Spiritual",
      duration: "13m",
      thumbnail: "https://img.youtube.com/vi/MUl2tDfOW_k/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/MUl2tDfOW_k",
      rating: 4.8,
      year: "2024",
      tags: ["Ahar Dan", "Respect", "Virtue"]
    },
    {
      id: "kids_story_6",
      type: "digital_stories",
      title: { en: "Triumph of Unwavering Truthfulness", hi: "सत्यव्रत की अनुपम विजय और शिक्षा" },
      description: { en: "A story highlighting how a commitment to truth acts as an invincible armor in difficult times.", hi: "हमेशा सत्य बोलने का दृढ़ निश्चय कैसे मनुष्य को सभी विपत्तियों से सुरक्षित रखता है।" },
      category: "Kids Moral Story",
      duration: "09m",
      thumbnail: "https://img.youtube.com/vi/8-eVjIeDSpE/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/8-eVjIeDSpE",
      rating: 4.7,
      year: "2023",
      tags: ["Truth", "Satya", "Courage"]
    },
    {
      id: "kids_story_7",
      type: "digital_stories",
      title: { en: "The Supreme Jewel of Forgiveness", hi: "क्षमा भाव: अंतर्मन का सबसे बड़ा आभूषण" },
      description: { en: "Discover how forgiving others heals our own soul and builds lasting inner peace.", hi: "दूसरों को क्षमा करने और स्वयं से गलती होने पर पश्चाताप करने का पावन उपदेश।" },
      category: "Kids Moral Story",
      duration: "10m",
      thumbnail: "https://img.youtube.com/vi/CvJ2DDAfCZg/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/CvJ2DDAfCZg",
      rating: 4.8,
      year: "2024",
      tags: ["Forgiveness", "Kshama", "Peace"]
    },
    {
      id: "kids_story_8",
      type: "digital_stories",
      title: { en: "Sacred Friendship and Spiritual Trust", hi: "सच्ची मित्रता और धार्मिक विश्वास" },
      description: { en: "An interactive story about friends who walk together on the path of pure values and support.", hi: "धर्म मार्ग पर साथ चलने वाले और एक दूसरे को सदा सुमार्ग दिखाने वाले सच्चे मित्रों की कहानी।" },
      category: "Kids Moral Story",
      duration: "08m",
      thumbnail: "https://img.youtube.com/vi/pP_VGbNgATg/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/pP_VGbNgATg",
      rating: 4.6,
      year: "2023",
      tags: ["Friendship", "Trust", "Values"]
    },
    {
      id: "kids_story_9",
      type: "digital_stories",
      title: { en: "Conquering Deep Anger with Peaceful Mind", hi: "क्रोध पर परम संयम और आंतरिक शांति" },
      description: { en: "Understanding the destructive nature of anger and how breathing and mindfulness calm the soul.", hi: "गुस्से के बुरे परिणामों को समझकर शांत भाव धारण करने की अत्यंत सुंदर एनिमेटेड सीख।" },
      category: "Kids Moral Story",
      duration: "12m",
      thumbnail: "https://img.youtube.com/vi/6PUv7Ga1wPs/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/6PUv7Ga1wPs",
      rating: 4.8,
      year: "2024",
      tags: ["Anger Control", "Mindfulness", "Kshama"]
    },
    {
      id: "kids_story_10",
      type: "digital_stories",
      title: { en: "The Dynamic Cycle of Karma", hi: "कर्मों का चक्रव्यूह और जीव का उदय" },
      description: { en: "A beautifully animated story simplifying the profound laws of cause and effect.", hi: "जैसी करनी वैसी भरनी! कर्म सिद्धांत को बच्चों के लिए आसान तरीके से समझाने वाली कथा।" },
      category: "Kids Philosophy",
      duration: "14m",
      thumbnail: "https://img.youtube.com/vi/ekg3NESaLa4/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/ekg3NESaLa4",
      rating: 4.9,
      year: "2024",
      tags: ["Karma", "Jain Philosophy", "Lessons"]
    },
    {
      id: "kids_story_11",
      type: "digital_stories",
      title: { en: "The Virtue of Humility and Respect", hi: "विनय भाव और गुरुओं के प्रति आदर" },
      description: { en: "How respect and sweet speech bring true wisdom and success in a child's life.", hi: "माता-पिता, गुरुजनों और बड़ों का आदर करने से प्राप्त होने वाले दिव्य गुणों की कहानी।" },
      category: "Kids Moral Story",
      duration: "11m",
      thumbnail: "https://img.youtube.com/vi/JtBPWztCRBU/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/JtBPWztCRBU",
      rating: 4.7,
      year: "2024",
      tags: ["Humility", "Respect", "Wisdom"]
    },
    {
      id: "kids_story_12",
      type: "digital_stories",
      title: { en: "Rajarshi Prasannachandra's Meditation Battle", hi: "ध्यानमग्न राजर्षि प्रसन्नचंद्र की अद्भुत कथा" },
      description: { en: "How a silent meditating monk won over his mental anger to achieve instantaneous liberation.", hi: "मन के विचारों के महायुद्ध से मुक्त होकर केवलज्ञान प्राप्त करने वाले तपस्वी मुनि की गाथा।" },
      category: "Kids Wisdom Tale",
      duration: "13m",
      thumbnail: "https://img.youtube.com/vi/83yCYhY03tQ/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/83yCYhY03tQ",
      rating: 4.9,
      year: "2025",
      tags: ["Prasannachandra", "Mind Control", "Austerity"]
    },
    {
      id: "kids_story_13",
      type: "digital_stories",
      title: { en: "The Devoted Merchant's Supreme Test", hi: "धर्मप्रेमी सेठ का सच्चा संकल्प और परीक्षा" },
      description: { en: "An inspiring tale of steadfast determination and unshakeable trust in dharma during severe adversity.", hi: "कठिन से कठिन परिस्थिति में भी अपने जैन धर्म के सिद्धांतों पर अडिग रहने वाले सेठ की कहानी।" },
      category: "Kids Moral Story",
      duration: "10m",
      thumbnail: "https://img.youtube.com/vi/iODZYKeJWbw/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/iODZYKeJWbw",
      rating: 4.8,
      year: "2024",
      tags: ["Dharma", "Determination", "Faith"]
    },
    {
      id: "kids_story_14",
      type: "digital_stories",
      title: { en: "Samyaktva: The Divine Eye of the Soul", hi: "सम्यक्त्व: आत्मा की पवित्र दृष्टि" },
      description: { en: "Understanding true faith in scriptures, deities, and pure teachers as the first step to liberation.", hi: "देव-शास्त्र-गुरु के प्रति अटूट आस्था और आत्मा की शुद्ध पहचान की पावन सीख।" },
      category: "Kids Spiritual",
      duration: "09m",
      thumbnail: "https://img.youtube.com/vi/pv0JLNFFU-c/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/pv0JLNFFU-c",
      rating: 4.8,
      year: "2024",
      tags: ["Samyaktva", "Soul", "Dharma"]
    },
    {
      id: "kids_story_15",
      type: "digital_stories",
      title: { en: "Faith of King Shripal & Maynasundari", hi: "राजा श्रीपाल और मैनासुन्दरी की भक्ति" },
      description: { en: "How pure devotion healed 700 diseased soldiers, demonstrating the spiritual power of Navpad.", hi: "सिद्धचक्र आराधना के प्रताप से कोढ़ रोग दूर होने और अटूट दाम्पत्य आचरण का आदर्श।" },
      category: "Kids Devotional",
      duration: "16m",
      thumbnail: "https://img.youtube.com/vi/7LJdyGxqVx4/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/7LJdyGxqVx4",
      rating: 4.9,
      year: "2024",
      tags: ["Navpad", "Oli", "Healing"]
    },
    {
      id: "kids_story_16",
      type: "digital_stories",
      title: { en: "The Miraculous Siddhachakra Mahayantra", hi: "सिद्धचक्र महायंत्र का अनुपम माहात्म्य" },
      description: { en: "Exploring the cosmic geometry and spiritual significance of the sacred Siddhachakra.", hi: "महायंत्र की पवित्र नौ शक्तियों (देव, गुरु, धर्म, सिद्ध, आचार्य, उपाध्याय, साधु, दर्शन, चरित्र) का पाठ।" },
      category: "Kids Devotional",
      duration: "14m",
      thumbnail: "https://img.youtube.com/vi/LqZHfOGofTA/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/LqZHfOGofTA",
      rating: 4.8,
      year: "2024",
      tags: ["Yantra", "Navpad", "Auspicious"]
    },
    {
      id: "kids_story_17",
      type: "digital_stories",
      title: { en: "The Swan of Peace & Compassion", hi: "शांतिदूत हंस और अहिंसा की सीख" },
      description: { en: "A sweet animal story about protecting the helpless and practicing active non-injury (Ahimsa).", hi: "घायल पक्षी की रक्षा करने वाले दयालु बालक की सुंदर प्रेरणादायक और करुणामयी कहानी।" },
      category: "Kids Moral Story",
      duration: "08m",
      thumbnail: "https://img.youtube.com/vi/FiO48vceA8k/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/FiO48vceA8k",
      rating: 4.8,
      year: "2024",
      tags: ["Ahimsa", "Animals", "Mercy"]
    },
    {
      id: "kids_story_18",
      type: "digital_stories",
      title: { en: "Aparigraha: Redefining True Wealth", hi: "अपरिग्रह और परम संतोष धन" },
      description: { en: "A delightful lesson showing that limiting greed is the absolute path to genuine happiness.", hi: "अधिक धन संचय की इच्छा का त्याग करके सुख और शांति पाने की शिक्षा।" },
      category: "Kids Moral Story",
      duration: "10m",
      thumbnail: "https://img.youtube.com/vi/M0QI9uNMDWg/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/M0QI9uNMDWg",
      rating: 4.7,
      year: "2024",
      tags: ["Aparigraha", "Minimalism", "Greed"]
    },
    {
      id: "kids_story_19",
      type: "digital_stories",
      title: { en: "The Saintly Monk & Gentle Lion", hi: "तपस्वी मुनिराज और हिंसक सिंह की कथा" },
      description: { en: "A legendary story of how the tranquil aura of a saint transformed a wild lion's heart.", hi: "मुनिराज की शांत और करुणामयी दृष्टि से एक खूंखार शेर का हृदय परिवर्तन होने का अद्भुत प्रसंग।" },
      category: "Kids Spiritual",
      duration: "12m",
      thumbnail: "https://img.youtube.com/vi/ENIhW_3flgI/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/ENIhW_3flgI",
      rating: 4.9,
      year: "2024",
      tags: ["Monk", "Lion", "Aura"]
    },
    {
      id: "kids_story_20",
      type: "digital_stories",
      title: { en: "The Legend of Sati Anjana's Patience", hi: "सती अंजना के धीरज की अमर पौराणिक गाथा" },
      description: { en: "How unwavering patience and faith during unjust exile turned hardships into celestial joy.", hi: "कठिन से कठिन समय में भी अपने शील धर्म और संयम पर अडिग रहने वाली सती अंजना का वर्णन।" },
      category: "Kids Mythological",
      duration: "15m",
      thumbnail: "https://img.youtube.com/vi/QlGn1FnW3w0/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/QlGn1FnW3w0",
      rating: 4.8,
      year: "2024",
      tags: ["Patience", "Character", "Faith"]
    },
    {
      id: "kids_story_21",
      type: "digital_stories",
      title: { en: "Chanting Navkar to Overcome Obstacles", hi: "णमोकार महामंत्र जप से संकट निवारण" },
      description: { en: "A moving story showing how reciting the holy syllables cures sickness and negative energies.", hi: "सच्चे मन से णमोकार मंत्र का स्मरण करने पर सभी भय और बाधाएं दूर होने की शिक्षा।" },
      category: "Kids Devotional",
      duration: "14m",
      thumbnail: "https://img.youtube.com/vi/iCdHo6u-FQI/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/iCdHo6u-FQI",
      rating: 4.9,
      year: "2024",
      tags: ["Navkar", "Chanting", "Obstacles"]
    },
    {
      id: "kids_story_22",
      type: "digital_stories",
      title: { en: "The Little Squirrel's Pure Alms Offering", hi: "नन्हीं गिलहरी का पवित्र मुनि आहार दान" },
      description: { en: "How a tiny forest creature gained infinite merits by offering wild fruit to an ascetic.", hi: "अपने निश्छल मन और परम भक्ति से मुनिराज को छोटा सा फल भेंट करने वाली गिलहरी का प्रसंग।" },
      category: "Kids Moral Story",
      duration: "09m",
      thumbnail: "https://img.youtube.com/vi/9ZKXhSaG8WQ/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/9ZKXhSaG8WQ",
      rating: 4.8,
      year: "2024",
      tags: ["Alms", "Squirrel", "Bhakti"]
    },
    {
      id: "kids_story_23",
      type: "digital_stories",
      title: { en: "The Wise Elephant & Multi-Sided Truth", hi: "बुद्धिमान गजराज का पूर्व जन्म और स्याद्वाद" },
      description: { en: "A simplified fable teaching children the value of looking at things from multiple perspectives.", hi: "दूसरों की बातों और विचारों को समझने तथा अनेकांतवाद की सीख देने वाली सुंदर कहानी।" },
      category: "Kids Moral Story",
      duration: "11m",
      thumbnail: "https://img.youtube.com/vi/AK3cSqUZITc/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/AK3cSqUZITc",
      rating: 4.7,
      year: "2024",
      tags: ["Anekantavada", "Perspective", "Wisdom"]
    },
    {
      id: "kids_story_24",
      type: "digital_stories",
      title: { en: "Soul: The Infinite Cosmic Mirror", hi: "चैतन्य आत्मा का उज्ज्वल और शुद्ध दर्पण" },
      description: { en: "An animation describing that our real identity is not the body, but the shining pure soul.", hi: "शरीर नश्वर है और आत्मा अमर है, इस परम सत्य को बाल मन के अनुकूल समझाने वाली गाथा।" },
      category: "Kids Philosophy",
      duration: "13m",
      thumbnail: "https://img.youtube.com/vi/RiqCfARdJ1o/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/RiqCfARdJ1o",
      rating: 4.9,
      year: "2024",
      tags: ["Soul", "Atma", "Awareness"]
    },
    {
      id: "kids_story_25",
      type: "digital_stories",
      title: { en: "Heroic Childhood of Lord Mahavira", hi: "बालक वर्धमान की अद्भुत वीरता और साहस" },
      description: { en: "Stories of young Vardhaman showing fearlessness when facing a mad elephant and fierce snake.", hi: "तीर्थंकर वर्धमान के बचपन की वीर गाथाएं, जो बच्चों में निर्भयता और धर्म बल का संचार करती हैं।" },
      category: "Kids Historical",
      duration: "15m",
      thumbnail: "https://img.youtube.com/vi/q7ulsYNlDc0/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/q7ulsYNlDc0",
      rating: 4.9,
      year: "2024",
      tags: ["Lord Mahavira", "Childhood", "Bravery"]
    },
    {
      id: "kids_story_26",
      type: "digital_stories",
      title: { en: "Ultimate Renunciation of Lord Bahubali", hi: "महाबली बाहुबली का परम त्याग और तप" },
      description: { en: "The history of Shravanabelagola and how Bahubali gave up his kingdom mid-battle for peace.", hi: "अखंड साम्राज्य और चक्रवर्ती पद को त्याग कर वर्षों तक घोर तपस्या में लीन रहने वाले बाहुबली स्वामी।" },
      category: "Kids Historical",
      duration: "16m",
      thumbnail: "https://img.youtube.com/vi/vlfxUhsIERY/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/vlfxUhsIERY",
      rating: 4.9,
      year: "2024",
      tags: ["Bahubali", "Shravanabelagola", "Renunciation"]
    },
    {
      id: "kids_story_27",
      type: "digital_stories",
      title: { en: "Lord Neminatha & Ultimate Animal Compassion", hi: "भगवान नेमिनाथ और मूक प्राणियों की करुणा" },
      description: { en: "The historic turning point where Prince Neminatha took Diksha upon hearing caged animals.", hi: "विवाह बारात से पशुओं के क्रंदन को सुनकर गिरनार पर्वत पर जाकर दीक्षा धारण करने वाले तीर्थंकर।" },
      category: "Kids Historical",
      duration: "14m",
      thumbnail: "https://img.youtube.com/vi/C0dHvluOOC8/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/C0dHvluOOC8",
      rating: 4.9,
      year: "2024",
      tags: ["Neminatha", "Animals", "Girnar"]
    },
    {
      id: "kids_story_28",
      type: "digital_stories",
      title: { en: "The Sacred Path of Renunciation - Part 1", hi: "वैराग्य पथ और संयम की पावन गाथा - भाग १" },
      description: { en: "Understanding the early life events that inspire great souls to take up the path of penance.", hi: "महापुरुषों को संसार की नश्वरता देखकर हुए परम वैराग्य का अद्भुत वर्णन।" },
      category: "Kids Spiritual",
      duration: "12m",
      thumbnail: "https://img.youtube.com/vi/XvktpzBujZc/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/XvktpzBujZc",
      rating: 4.8,
      year: "2024",
      tags: ["Renunciation", "Samyam", "Exclusion"]
    },
    {
      id: "kids_story_29",
      type: "digital_stories",
      title: { en: "The Sacred Path of Renunciation - Part 2", hi: "वैराग्य पथ और संयम की पावन गाथा - भाग २" },
      description: { en: "The continuous practice of meditation and purification of soul through rigorous control.", hi: "संयम और साधना के मार्ग पर निरंतर बढ़ने और आत्मा को कर्ममुक्त करने का द्वितीय अध्याय।" },
      category: "Kids Spiritual",
      duration: "12m",
      thumbnail: "https://img.youtube.com/vi/XvktpzBujZc/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/XvktpzBujZc",
      rating: 4.8,
      year: "2024",
      tags: ["Renunciation", "Meditation", "Samyam"]
    },
    {
      id: "kids_story_30",
      type: "digital_stories",
      title: { en: "Acharya Manatunga's Unshakable Devotion", hi: "आचार्य मानतुंग की अनन्य भक्ति और बेड़ियाँ" },
      description: { en: "How the legendary composer created Bhaktamar Stotra to break forty-eight iron chains.", hi: "राजा भोज के बन्दीगृह में ४८ तालों और जंजीरों को तोड़ने वाले महान भक्तामर स्तोत्र का इतिहास।" },
      category: "Kids Historical",
      duration: "13m",
      thumbnail: "https://img.youtube.com/vi/RO4F52Hnki8/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/RO4F52Hnki8",
      rating: 4.9,
      year: "2024",
      tags: ["Manatunga", "Bhaktamar", "Devotion"]
    },
    {
      id: "kids_story_31",
      type: "digital_stories",
      title: { en: "The Forty-Eight Verses of Bhaktamar Stotra", hi: "भक्तामर स्तोत्र की ४८ चमत्कारी गाथाएं" },
      description: { en: "A kid-friendly exploration of the meanings and benefits of chanting Bhaktamar daily.", hi: "भक्तामर जी की गाथाओं का सरल अर्थ और उसके नित्य पाठ से होने वाले सुखद लाभ।" },
      category: "Kids Devotional",
      duration: "15m",
      thumbnail: "https://img.youtube.com/vi/HqYvM22Qvuo/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/HqYvM22Qvuo",
      rating: 4.9,
      year: "2024",
      tags: ["Bhaktamar", "Stotra", "Lessons"]
    },
    {
      id: "kids_story_32",
      type: "digital_stories",
      title: { en: "Triumph over Materialistic Desires", hi: "सांसारिक मोह-माया और तृष्णा पर विजय" },
      description: { en: "An animation warning kids about greed and redirecting them to the wealth of satisfaction.", hi: "बाहरी चमक-धमक और वस्तुओं के प्रति लगाव कम कर सच्चे सुख को पाने की शिक्षा।" },
      category: "Kids Moral Story",
      duration: "11m",
      thumbnail: "https://img.youtube.com/vi/-BQLzIym0Ww/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/-BQLzIym0Ww",
      rating: 4.7,
      year: "2024",
      tags: ["Temptations", "Aparigraha", "Satisfaction"]
    },
    {
      id: "kids_story_33",
      type: "digital_stories",
      title: { en: "Girnar Hills: The Sacred Ascent", hi: "गिरनार की पावन सिद्ध तपोभूमि वंदना" },
      description: { en: "The historical and spiritual importance of Mount Girnar where millions gained Moksha.", hi: "जूनागढ़ स्थित भगवान नेमिनाथ की मोक्षस्थली गिरनार पर्वतराज की सुंदर महिमा।" },
      category: "Kids Spiritual",
      duration: "14m",
      thumbnail: "https://img.youtube.com/vi/rO-z348XLe8/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/rO-z348XLe8",
      rating: 4.8,
      year: "2024",
      tags: ["Girnar", "Neminath", "Siddha Kshetra"]
    },
    {
      id: "kids_story_34",
      type: "digital_stories",
      title: { en: "Moksha: The Ultimate Spiritual Goal", hi: "मोक्ष मार्ग: आत्मा का परम और अंतिम लक्ष्य" },
      description: { en: "A beautifully animated story summarizing the ultimate goal of Jainism - complete liberation.", hi: "सभी दुखों से मुक्त होकर सिद्धशिला पर अनंत काल तक अनंत ज्ञान और सुख पाने का पावन मार्ग।" },
      category: "Kids Philosophy",
      duration: "13m",
      thumbnail: "https://img.youtube.com/vi/PnI0XgzPpFo/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/PnI0XgzPpFo",
      rating: 4.9,
      year: "2024",
      tags: ["Moksha", "Liberation", "Siddha"]
    }
  ] as VideoItem[],

  devotional_videos: [
    {
      id: "pravachan_1",
      type: "devotional_videos",
      title: { en: "Jain Swadhyay & Divine Pravachan Collection 1 (116 Sermons)", hi: "पूज्य मुनिराज दिव्य देशना एवं स्वाध्याय धारा - ११६ प्रवचन" },
      description: { en: "A continuous rich playlist containing 116 high-quality discourses exploring the essence of Jain scriptures.", hi: "जैन धर्म के शास्त्रों, चारित्र और तत्वज्ञान पर आधारित ११६ पावन प्रवचनों का निरंतर प्रवाह।" },
      category: "Scriptural Swadhyay",
      duration: "Playlist (116 Videos)",
      thumbnail: "https://img.youtube.com/vi/mG0w9p9Y6lY/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/videoseries?list=PLfUIgFWDVdmnL4oeZQF-HqOgMfby8dqJ1",
      rating: 5.0,
      year: "2024",
      tags: ["Pravachan", "Playlist", "Swadhyay"]
    },
    {
      id: "pravachan_2",
      type: "devotional_videos",
      title: { en: "Jain Tatva Gyan Ganga Collection 2 (157 Sermons)", hi: "परम पावन आत्म तत्व ज्ञान गंगा - १५७ प्रवचन" },
      description: { en: "Deep dive into soul realization, non-self distinction, and spiritual liberation across 157 detailed lectures.", hi: "भेदज्ञान, आत्म-अनुभूति और सच्चे सुख की खोज पर आधारित १५७ दिव्य व्याख्यानों की सुंदर प्लेलिस्ट।" },
      category: "Tatva Chintan",
      duration: "Playlist (157 Videos)",
      thumbnail: "https://img.youtube.com/vi/Y0rQ1I7lC0w/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/videoseries?list=PLfUIgFWDVdmlLe8OPBaZtL7mtfTYVZ2KP",
      rating: 4.9,
      year: "2024",
      tags: ["Tatva Gyan", "Playlist", "Liberation"]
    },
    {
      id: "pravachan_3",
      type: "devotional_videos",
      title: { en: "Universal Jain Pravachan Amrit (279 Sermons)", hi: "जैन सिद्धांत स्वाध्याय अमृत कलश - २७९ प्रवचन" },
      description: { en: "An exhaustive collection of 279 sacred discourses on daily rituals, monk rules, and historical Tirthankaras.", hi: "दैनिक आचरण, संयम, श्रावक धर्म तथा सभी २४ तीर्थंकरों के कल्याणकों पर २७९ प्रवचनों का महासंग्रह।" },
      category: "Universal Teachings",
      duration: "Playlist (279 Videos)",
      thumbnail: "https://img.youtube.com/vi/1B16N8X6i2w/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/videoseries?list=PLWlQDuGw66WpKPOUEbRVC9CBTdBAeDodD",
      rating: 5.0,
      year: "2025",
      tags: ["Playlist", "Tirthankars", "Discourses"]
    }
  ] as VideoItem[],

  stories: [
    {
      id: "fb_story_1",
      type: "stories",
      title: { en: "The Legend of King Shrenik", hi: "राजा श्रेणिक और यशोधर मुनिराज की प्रेरक कथा" },
      description: { en: "The inspiring story of King Shrenik, his initial anger, and his ultimate surrender to Jain monk Yashodhar, paving his path to future Tirthankarhood.", hi: "महान मगध सम्राट राजा श्रेणिक के क्रोध, यशोधर मुनिराज के परम क्षमा भाव और उनके भावी तीर्थंकर बनने की पावन कथा।" },
      category: "Historical Story",
      duration: "14:30",
      thumbnail: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=400&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      author: "Aryika Gyanmati Vani",
      rating: 4.8,
      year: "2024",
      tags: ["King Shrenik", "Forgiveness", "Katha"]
    },
    {
      id: "fb_story_2",
      type: "stories",
      title: { en: "Sati Anjana & Unshakable Faith", hi: "सती अंजना और अखंड शील व्रत की कथा" },
      description: { en: "The narrative of Sati Anjana displaying supreme patience, moral conduct, and pure faith under false accusations.", hi: "झूठे कलंक के बावजूद शील व्रत पर अडिग रहने वाली और घोर जंगलों में भी धर्म ध्यान करने वाली सती अंजना की प्रेरणादायक कथा।" },
      category: "Moral Story",
      duration: "16:15",
      thumbnail: "https://images.unsplash.com/photo-1508243753517-5730389ee52e?q=80&w=400&auto=format&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      author: "Sadhvi Sangh Vani",
      rating: 4.9,
      year: "2024",
      tags: ["Sati Anjana", "Faith", "Inspiration"]
    }
  ] as any[],

  bhajans: [] as any[],
  audiobooks: [] as any[]
};
