import { useState, useRef, useEffect } from 'react';
import { PlaySquare, Headphones, BookOpen, Play, Heart, Pause, SkipForward, SkipBack, Search, Mic, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { fallbackMediaData } from '../data/mediaData';
import SectionAiAgent from '../components/SectionAiAgent';
import { useLanguage } from '../contexts/LanguageContext';

const tabs: { id: 'stories' | 'bhajans' | 'audiobooks', label: string, icon: any }[] = [
  { id: 'stories', label: 'Stories', icon: PlaySquare },
  { id: 'bhajans', label: 'Bhajans', icon: Headphones },
  { id: 'audiobooks', label: 'Audio Books', icon: BookOpen },
];

export default function MediaPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'bhajans' | 'audiobooks'>('stories');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mediaData, setMediaData] = useState<{stories: any[], bhajans: any[], audiobooks: any[]}>({
    stories: fallbackMediaData.stories,
    bhajans: fallbackMediaData.bhajans,
    audiobooks: fallbackMediaData.audiobooks,
  });
  const [loading, setLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [jumpMins, setJumpMins] = useState<string>('');
  const [jumpSecs, setJumpSecs] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousUrlRef = useRef<string>('');
  const currentTrackRef = useRef<any>(null);

  // Synchronize track reference and activeUrl safely when currentTrack changes
  useEffect(() => {
    currentTrackRef.current = currentTrack;
    if (currentTrack) {
      setActiveUrl(currentTrack.url);
      setAudioError(null);

      // Cleanly update browser tab document title so there's never any workspace reference
      document.title = `${currentTrack.title} • Play`;

      // Scrub out AI Studio workspace URLs from phone bluetooth, active play notifications, & lockscreen controls
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title || 'Jain Audio',
            artist: currentTrack.narrator || 'Samil Swadhyay',
            album: activeTab === 'bhajans' ? 'Jain Bhajanamrit' : activeTab === 'audiobooks' ? 'Jain Swadhyay' : 'Shravak Katha Path',
            artwork: [
              { src: 'https://images.unsplash.com/photo-1609137144813-f66fcc430f80?q=80&w=120&auto=format&fit=crop', sizes: '128x128', type: 'image/jpeg' },
              { src: 'https://images.unsplash.com/photo-1609137144813-f66fcc430f80?q=80&w=256&auto=format&fit=crop', sizes: '256x256', type: 'image/jpeg' }
            ]
          });
        } catch (err) {
          console.warn("MediaSession assignment failed or unsupported:", err);
        }
      }
    } else {
      document.title = "Jainism GPT";
    }
  }, [currentTrack, activeTab]);

  useEffect(() => {
    // Initialize with fallback first so user has immediate feedback
    if (!currentTrack && fallbackMediaData.stories.length > 0) {
      setCurrentTrack(fallbackMediaData.stories[0]);
    }
    
    const unsubscribe = onSnapshot(collection(db, 'media'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        const stories = data.filter((item: any) => item.type === 'stories');
        const bhajans = data.filter((item: any) => item.type === 'bhajans');
        const audiobooks = data.filter((item: any) => item.type === 'audiobooks');
      
      const updStories = stories.length > 0 ? stories : fallbackMediaData.stories;
      const updBhajans = bhajans.length > 0 ? bhajans : fallbackMediaData.bhajans;
      const updAudiobooks = audiobooks.length > 0 ? audiobooks : fallbackMediaData.audiobooks;

      setMediaData({
        stories: updStories,
        bhajans: updBhajans,
        audiobooks: updAudiobooks,
      });

      if (!currentTrack && updStories.length > 0) {
        setCurrentTrack(updStories[0]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching media, loading fallback data:', error);
      setMediaData({
        stories: fallbackMediaData.stories,
        bhajans: fallbackMediaData.bhajans,
        audiobooks: fallbackMediaData.audiobooks,
      });
      if (!currentTrack && fallbackMediaData.stories.length > 0) {
        setCurrentTrack(fallbackMediaData.stories[0]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Setup single Audio instance with event listeners on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => {
      setAudioLoading(true);
      setAudioError(null);
    };
    const handleCanPlay = () => {
      setAudioLoading(false);
      setAudioError(null);
    };
    const handleError = (e: any) => {
      console.error("Audio element error detected:", e);
      setAudioLoading(false);
      
      const track = currentTrackRef.current;
      if (track && !audio.src.includes("archive.org/")) {
        setAudioError("Primary audio stream unavailable. Retrying with stable standby source...");
        
        // Auto-fallback execution
        const backups: Record<string, string> = {
          fb_story_1: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_story_2: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_story_3: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_story_4: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3",
          fb_story_5: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_story_6: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_story_7: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3",
          fb_story_8: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_story_9: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_story_10: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3",
          fb_bhajan_1: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_bhajan_2: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_bhajan_3: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_bhajan_4: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_bhajan_5: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_bhajan_6: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3",
          fb_bhajan_7: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_bhajan_8: "https://archive.org/download/bhaktamar-stotra-hindi/bhaktamar_hindi.mp3",
          fb_bhajan_9: "https://archive.org/download/BhaktamarStotra_201306/Bhaktamar%20Stotra.mp3",
          fb_bhajan_10: "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3",
        };
        const fallbackUrl = backups[track.id] || "https://archive.org/download/NavkarMantra_201704/Navkar%20Mantra.mp3";
        
        setTimeout(() => {
          // Verify user is still listening to the same track that failed
          if (currentTrackRef.current && currentTrackRef.current.id === track.id) {
            console.log("Switching to fallback URL:", fallbackUrl);
            setActiveUrl(fallbackUrl);
          }
        }, 1000);
      } else {
        setAudioError("Failed to play track. Please check your internet connection.");
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current = null;
    };
  }, []);

  // Handle URL changes & Play/Pause states securely
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    if (previousUrlRef.current !== activeUrl) {
      setAudioError(null);
      // Proxy external audio urls to bypass sandboxed iframe redirect and CORS restrictions
      const proxiedUrl = activeUrl.startsWith('http') && !activeUrl.includes(window.location.host)
        ? `/api/audio-proxy?url=${encodeURIComponent(activeUrl)}`
        : activeUrl;
      audio.src = proxiedUrl;
      previousUrlRef.current = activeUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name === 'AbortError') {
            console.log("Playback interrupted by load or pause (expected behavior).");
          } else {
            console.error("Audio playback error:", err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [activeUrl, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJumpToTime = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const mins = parseInt(jumpMins) || 0;
    const secs = parseInt(jumpSecs) || 0;
    const totalSecs = (mins * 60) + secs;
    if (audioRef.current) {
      audioRef.current.currentTime = totalSecs;
      setCurrentTime(totalSecs);
      setIsPlaying(true);
    }
  };

  const jumpToOffset = (offsetInSecs: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = offsetInSecs;
      setCurrentTime(offsetInSecs);
      setIsPlaying(true);
    }
  };

  const getBookChaptersWithOffsets = (track: any) => {
    if (!track) return [];

    // Custom detailed chapters for specific books
    if (track.id === 'fb_book_2') {
      return [
        { number: 1, title: 'अध्याय १: दर्शन, ज्ञान तथा मोक्ष मार्ग', titleEn: 'Chapter 1: Darshan & Moksha Marg', offset: 0, duration: '05:30' },
        { number: 2, title: 'अध्याय २: संसारी जीव और उनके भेद', titleEn: 'Chapter 2: Jiva & Classifications', offset: 330, duration: '06:15' },
        { number: 3, title: 'अध्याय ३: तीन लोक (अधो-मध्य-उर्ध्व लोक)', titleEn: 'Chapter 3: Three Realms', offset: 705, duration: '06:45' },
        { number: 4, title: 'अध्याय ४: देव लोक और देवों के प्रकार', titleEn: 'Chapter 4: Celestials (Devas)', offset: 1110, duration: '05:15' },
        { number: 5, title: 'अध्याय ५: अजीव काय का विवेचन', titleEn: 'Chapter 5: Non-living (Ajiva)', offset: 1425, duration: '06:30' },
        { number: 6, title: 'अध्याय ६: आस्रव (कर्म आगमन के द्वार)', titleEn: 'Chapter 6: Influx (Asrava)', offset: 1815, duration: '07:00' },
        { number: 7, title: 'अध्याय ७: पंच महाव्रत एवं गृहस्थ शील', titleEn: 'Chapter 7: Vows & Conduct', offset: 2235, duration: '06:00' },
        { number: 8, title: 'अध्याय ८: बंध (कर्म बंधन के भेद)', titleEn: 'Chapter 8: Bondage (Bandha)', offset: 2595, duration: '05:50' },
        { number: 9, title: 'अध्याय ९: संवर और निर्जरा विधि', titleEn: 'Chapter 9: Stoppage & Shedding', offset: 2945, duration: '07:15' },
        { number: 10, title: 'अध्याय १०: मोक्ष (परम पद की प्राप्ति)', titleEn: 'Chapter 10: Liberation (Moksha)', offset: 3380, duration: '05:00' },
      ];
    }

    if (track.id === 'fb_book_7') {
      return [
        { number: 1, title: 'ढाल १: चारों गतियों के दुःख एवं संसार दशा', titleEn: 'Dhala 1: Condition of Wandering Souls', offset: 0, duration: '05:00' },
        { number: 2, title: 'ढाल २: मिथ्यादर्शन तथा अगृहीत अज्ञान भेद', titleEn: 'Dhala 2: Delusion & Ignorance', offset: 300, duration: '05:30' },
        { number: 3, title: 'ढाल ३: सम्यग्दर्शन की महिमा और आत्मज्ञान', titleEn: 'Dhala 3: Vision & Self Realization', offset: 630, duration: '05:45' },
        { number: 4, title: 'ढाल ४: सम्यग्ज्ञान तथा देशव्रत श्रावक धर्म', titleEn: 'Dhala 4: Sravaka Vows & Conduct', offset: 975, duration: '06:10' },
        { number: 5, title: 'ढाल ५: बारह भावनाएं (वैराग्य उत्पादक चिंतन)', titleEn: 'Dhala 5: 12 Contemplations (Bhavana)', offset: 1345, duration: '06:00' },
        { number: 6, title: 'ढाल ६: सकलचारित्र तथा मुनिराज का दिव्य स्वरूप', titleEn: 'Dhala 6: Ideal Digambara Ascetics', offset: 1705, duration: '05:50' },
      ];
    }

    if (track.id === 'fb_book_5') {
      return [
        { number: 1, title: 'अधिकार १: सम्यग्दर्शन अधिकार (सम्यक्त्व महिमा)', titleEn: 'Part 1: Right Belief (Samyaktva)', offset: 0, duration: '07:00' },
        { number: 2, title: 'अधिकार २: सम्यग्ज्ञान अधिकार (ज्ञान विवेक)', titleEn: 'Part 2: Right Knowledge', offset: 420, duration: '06:30' },
        { number: 3, title: 'अधिकार ३: सम्यक्चारित्र अधिकार (श्रावक व्रत)', titleEn: 'Part 3: Right Conduct (Charitra)', offset: 810, duration: '07:15' },
        { number: 4, title: 'अधिकार ४: देशव्रत अधिकार (अणुव्रत विचार)', titleEn: 'Part 4: Partial Vows (Anuvrats)', offset: 1245, duration: '07:30' },
        { number: 5, title: 'अधिकार ५: शिक्षाव्रत एवं गुणव्रत', titleEn: 'Part 5: Meditative & Purifying Vows', offset: 1695, duration: '06:45' },
        { number: 6, title: 'अधिकार ६: सल्लेखना अधिकार (समाधिमरण)', titleEn: 'Part 6: Holy Death (Sallekhana)', offset: 2100, duration: '07:20' },
        { number: 7, title: 'अधिकार ७: ग्यारह श्रावक प्रतिमा', titleEn: 'Part 7: 11 Householder Stages', offset: 2540, duration: '08:00' },
      ];
    }

    if (track.id === 'fb_book_9') {
      return [
        { number: 1, title: 'मंगल प्रवचन तथा जीवात्मा स्वरूप विवेक', titleEn: 'Part 1: Introduction & Jiva Nature', offset: 0, duration: '06:15' },
        { number: 2, title: 'मोह का अंधकार, भ्रम एवं अज्ञान निवारण', titleEn: 'Part 2: Darkness of Attachment', offset: 375, duration: '05:45' },
        { number: 3, title: 'परमार्थ चिंतन: शरीर और आत्मा का पृथकत्व', titleEn: 'Part 3: Soul and Body Separation', offset: 720, duration: '06:30' },
        { number: 4, title: 'आत्मलीनता तथा सम्यक सुख की अनुभूति', titleEn: 'Part 4: Pure Consciousness & Bliss', offset: 1110, duration: '07:00' },
        { number: 5, title: 'अंतिम उपदेश, ध्यान और समाधि धारणा', titleEn: 'Part 5: Final Samadhi Devotion', offset: 1530, duration: '06:20' },
      ];
    }

    if (track.id === 'fb_book_20') {
      return [
        { number: 1, title: 'देवाधिदेव परीक्षा एवं मंगलाचरण गाथाएं', titleEn: 'Part 1: Evaluation of True Divinity', offset: 0, duration: '06:00' },
        { number: 2, title: 'स्याद्वाद न्याय, सप्तभंगी एवं अनेकांत दर्शन', titleEn: 'Part 2: Non-one-sidedness & Syadvada', offset: 360, duration: '07:30' },
        { number: 3, title: 'प्रत्यक्ष और परोक्ष प्रमाण निर्णय', titleEn: 'Part 3: Direct and Indirect Proofs', offset: 810, duration: '06:45' },
        { number: 4, title: 'ज्ञान, ज्ञेय और सर्वज्ञता सिद्धि विवेचन', titleEn: 'Part 4: Omniscience & Perfect Logic', offset: 1215, duration: '07:15' },
        { number: 5, title: 'परम उपसंहार, मोक्ष मार्ग और एकांत खंडन', titleEn: 'Part 5: Liberation Path Conclusion', offset: 1650, duration: '07:00' },
      ];
    }

    // Fallback dynamic chapters mapping for other audiobooks based on track chapters count
    const count = track.chapters || 5;
    const list = [];
    const spacingInSec = 300; // 5 minutes standard chapter spacing
    for (let i = 1; i <= Math.min(count, 12); i++) {
      list.push({
        number: i,
        title: `स्वाध्याय भाग ${i}: ग्रन्थ सिद्धांत व्याख्यान`,
        titleEn: `Swadhyay Part ${i}: Granth Discourse`,
        offset: (i - 1) * spacingInSec,
        duration: '05:00'
      });
    }
    return list;
  };

  const playTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // Or 'hi-IN' based on preference
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const filteredContent: any[] = mediaData[activeTab].filter((item: any) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const playNextTrack = () => {
    const list = filteredContent.length > 0 ? filteredContent : mediaData[activeTab];
    if (list.length === 0) return;
    const currentIndex = list.findIndex((t: any) => t.id === currentTrackRef.current?.id);
    if (currentIndex === -1) {
      setCurrentTrack(list[0]);
    } else {
      const nextIndex = (currentIndex + 1) % list.length;
      setCurrentTrack(list[nextIndex]);
    }
    setIsPlaying(true);
  };

  const playPrevTrack = () => {
    const list = filteredContent.length > 0 ? filteredContent : mediaData[activeTab];
    if (list.length === 0) return;
    const currentIndex = list.findIndex((t: any) => t.id === currentTrackRef.current?.id);
    if (currentIndex === -1) {
      setCurrentTrack(list[list.length - 1]);
    } else {
      const prevIndex = (currentIndex - 1 + list.length) % list.length;
      setCurrentTrack(list[prevIndex]);
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title || 'Jainism Audio',
        artist: currentTrack.artist || currentTrack.author || 'Divine Wisdom',
        album: activeTab === 'stories' ? 'Stories & Kathaye' : activeTab === 'bhajans' ? 'Devotional Bhajans' : 'Jain Audio Books',
        artwork: [
          { src: currentTrack.thumbnail || "https://picsum.photos/seed/mahavir/512/512", sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('previoustrack', playPrevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', playNextTrack);
    }
  }, [currentTrack, isPlaying, activeTab, filteredContent]);

  return (
    <div className="min-h-full p-6 pb-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md -mx-6 px-6 pt-4 pb-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4 transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate flex items-center gap-2">
            <PlaySquare className="text-[#FF6D00] shrink-0" size={18} />
            <span className="truncate">{language === 'en' ? 'JAIN MULTIMEDIA' : 'जैन मल्टीमीडिया'}</span>
          </h1>
        </div>

        {/* Dynamic Controls Aligned in One Line on the Right */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 sm:p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0 shadow-sm animate-none"
            title={language === 'en' ? 'Multimedia Section Guide' : 'मल्टीमीडिया विभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Inline Header Translator Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[9px] sm:text-[10px] cursor-pointer border border-[#FF9100]/20 shrink-0 h-8 sm:h-9"
            title="Translate Language / भाषा बदलें"
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Now Playing Banner */}
      {currentTrack && (
        <div className="mb-8 bg-white/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-lg dark:shadow-[0_0_30px_rgba(255,109,0,0.15)] border border-gray-200 dark:border-[#FF6D00]/30 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          
          {/* Main Controls Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-150 dark:border-white/5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 shadow-[0_0_15px_rgba(255,109,0,0.3)] border border-gray-200 dark:border-white/10">
                <img src={currentTrack.thumbnail || "https://picsum.photos/seed/mahavir/100/100"} alt="Now Playing" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-0.5">
                    <div className="w-1 h-3 bg-[#FFD54F] animate-[bounce_1s_infinite_0ms] rounded-full" />
                    <div className="w-1 h-4 bg-[#FFD54F] animate-[bounce_1s_infinite_200ms] rounded-full" />
                    <div className="w-1 h-2 bg-[#FFD54F] animate-[bounce_1s_infinite_400ms] rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[#E65100] dark:text-[#FF8A65] mb-1">
                  <span className="text-[9px] font-black tracking-widest uppercase bg-orange-50 dark:bg-[#FF6D00]/15 px-2.5 py-0.5 rounded-full border border-orange-100 dark:border-[#FF6D00]/20 inline-block font-mono">
                    🎙️ {language === 'en' ? 'AUTHENTIC RECITAL ACTIVE' : 'प्रामाणिक स्वर स्वाध्याय सक्रिय'}
                  </span>
                  {audioLoading && (
                    <span className="text-[9px] font-bold bg-[#FF6D00]/20 text-[#FFD54F] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse font-sans">
                      <Loader2 size={10} className="animate-spin" /> {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-950 dark:text-white truncate drop-shadow-none dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentTrack.title}</h3>
                {audioError ? (
                  <p className="text-xs text-amber-500 font-bold animate-pulse truncate">{audioError}</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                    {currentTrack.artist || currentTrack.author || 'Swadhyay'} • {currentTrack.duration || `${currentTrack.chapters} chapters`}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions and Main Playback Buttons */}
            <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
              <button 
                onClick={playPrevTrack} 
                className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer active:scale-95 border border-transparent dark:hover:border-white/10 rounded-full" 
                title={language === 'en' ? 'Previous Track' : 'पिछला ट्रैक'}
              >
                <SkipBack size={22} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,109,0,0.6)] hover:scale-105 transition-transform cursor-pointer"
                title={isPlaying ? (language === 'en' ? 'Pause' : 'विराम दें') : (language === 'en' ? 'Play' : 'सुनें')}
              >
                {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
              </button>
              <button 
                onClick={playNextTrack} 
                className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer active:scale-95 border border-transparent dark:hover:border-white/10 rounded-full" 
                title={language === 'en' ? 'Next Track' : 'अगला ट्रैक'}
              >
                <SkipForward size={22} />
              </button>
            </div>
          </div>

          {/* Timeline & Progress Bar Row */}
          <div className="mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-150 dark:border-white/5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span className="text-[#FF6D00] font-sans text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                ⚡ {language === 'en' ? 'DRAG TO SEEK PROGRESS' : 'सुनने की प्रगति बदलें'}
              </span>
              <span>{formatTime(duration)}</span>
            </div>
            
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }} 
              className="w-full h-2 rounded-lg cursor-pointer accent-[#FF6D00] bg-gray-200 dark:bg-white/15 focus:outline-none" 
            />
          </div>

          {/* Time Jump / Seek inputs requested by user */}
          <div className="mb-6 bg-orange-50/50 dark:bg-[#FF6D00]/5 p-4 rounded-2xl border border-orange-100 dark:border-[#FF6D00]/10 text-left">
            <h4 className="text-xs font-black text-[#E65100] dark:text-[#FF8A65] uppercase tracking-wide mb-3 flex items-center gap-1.5 font-mono">
              ⏱️ {language === 'en' ? 'TIME TRAVELER (JUMP TO TIME)' : 'मनपसंद मिनट पर तुरंत कूदें (समय चुनें)'}
            </h4>
            <form onSubmit={handleJumpToTime} className="flex items-center gap-2 max-w-sm">
              <div className="flex items-center gap-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 shadow-inner">
                <input 
                  type="number" 
                  min={0} 
                  placeholder="Mins" 
                  value={jumpMins}
                  onChange={(e) => setJumpMins(e.target.value)}
                  className="w-14 bg-transparent outline-none border-none text-sm font-bold text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-400">{language === 'en' ? 'm' : 'मिनट'}</span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 shadow-inner">
                <input 
                  type="number" 
                  min={0} 
                  max={59}
                  placeholder="Secs" 
                  value={jumpSecs}
                  onChange={(e) => setJumpSecs(e.target.value)}
                  className="w-14 bg-transparent outline-none border-none text-sm font-bold text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none"
                />
                <span className="text-xs font-bold text-gray-400">{language === 'en' ? 's' : 'सेकंड'}</span>
              </div>

              <button 
                type="submit" 
                className="bg-gradient-to-r from-[#FF6D00] to-[#E65100] hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-orange-500/10 cursor-pointer"
              >
                📥 {language === 'en' ? 'GO' : 'जाएं'}
              </button>
            </form>
          </div>

          {/* Chapters of active audiobook */}
          <div className="border-t border-gray-200/50 dark:border-white/5 pt-5 text-left">
            <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5 font-mono">
              📚 {language === 'en' ? 'CHOOSE INHERENT GRANTH CHAPTERS' : 'ग्रन्थ के विषय अनुसार अध्याय चुनें (सीधे सुनें)'}
            </h4>
            
            <div className="grid gap-2.5 max-h-[170px] overflow-y-auto pr-1">
              {getBookChaptersWithOffsets(currentTrack).map((ch: any) => {
                const isCurrentChapter = currentTime >= ch.offset && (ch.offset === 0 || currentTime < (ch.offset + 300));
                
                return (
                  <button 
                    key={ch.number}
                    type="button"
                    onClick={() => jumpToOffset(ch.offset)}
                    className={cn(
                      "w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-300 cursor-pointer text-xs font-semibold",
                      isCurrentChapter 
                        ? "bg-[#FF6D00]/10 border-[#FF6D00]/40 text-[#E65100] dark:text-[#FFD54F]" 
                        : "bg-white hover:bg-gray-50 dark:bg-[#121212]/50 dark:hover:bg-white/5 border-gray-150 dark:border-white/5 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold truncate text-[13px] text-gray-900 dark:text-white">
                        {language === 'en' ? ch.titleEn : ch.title}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {language === 'en' ? `Starts around minute ${Math.floor(ch.offset / 60)}` : `लगभग मिनट ${Math.floor(ch.offset / 60)} से शुरू`}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md font-mono">
                        {ch.duration || '05:00'}
                      </span>
                      {isCurrentChapter && (
                        <span className="w-2 h-2 rounded-full bg-[#FFD54F] animate-ping" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-12 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6D00] transition-all shadow-sm"
        />
        <button
          onClick={startListening}
          className={cn(
            "absolute inset-y-0 right-4 flex items-center transition-colors",
            isListening ? "text-[#FF6D00] animate-pulse" : "text-gray-400 hover:text-gray-700 dark:hover:text-white"
          )}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-md dark:shadow-[0_0_15px_rgba(255,109,0,0.6)] scale-105" 
                  : "bg-white dark:bg-[#121212]/80 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/30"
              )}
            >
              <Icon size={18} className={cn(isActive && "drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'stories' && (
          <div className="grid gap-6">
            {filteredContent.map((story, idx) => (
              <div key={idx} onClick={() => playTrack(story)} className="bg-white dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 group cursor-pointer hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(255,109,0,0.2)] hover:border-[#FF6D00]/30 transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100/95 via-transparent to-transparent dark:from-[#050505] z-10" />
                  <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-transparent dark:bg-[#FF6D00]/10 group-hover:bg-black/10 dark:group-hover:bg-[#FF6D00]/20 transition-colors z-10 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pl-1.5 shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.5)] border border-white/20 transform group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                      {currentTrack?.id === story.id && isPlaying ? <Pause size={28} className="drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] -ml-1.5" /> : <Play size={28} className="drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] text-gray-800 dark:text-white" />}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-[#FFD54F] text-xs px-3 py-1.5 rounded-lg font-bold tracking-wider z-20 border border-gray-200 dark:border-white/10 shadow-sm">
                    {story.duration}
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center relative z-20 bg-white dark:bg-[#121212] text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-wide group-hover:text-[#E65100] dark:group-hover:text-[#FFD54F] transition-colors">{story.title}</h3>
                  <button onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-[#F50057] transition-colors hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(245,0,87,0.8)]">
                    <Heart size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bhajans' && (
          <div className="space-y-4">
            {filteredContent.map((bhajan, idx) => (
              <div key={idx} onClick={() => playTrack(bhajan)} className="bg-white dark:bg-[#121212]/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 flex items-center gap-5 cursor-pointer hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-orange-50 dark:bg-[#FF6D00]/10 text-[#FF8A65] rounded-2xl flex items-center justify-center shrink-0 border border-orange-100 dark:border-[#FF6D00]/20 group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                  {currentTrack?.id === bhajan.id && isPlaying ? <Pause size={24} className="group-hover:drop-shadow-none dark:group-hover:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" /> : <Play size={24} className="group-hover:drop-shadow-none dark:group-hover:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] ml-1" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate group-hover:text-[#E65100] dark:group-hover:text-white transition-colors">{bhajan.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{bhajan.artist}</p>
                </div>
                <div className="text-sm font-bold tracking-widest text-[#E65100] dark:text-[#FFD54F] shrink-0 bg-orange-50 dark:bg-[#FFD54F]/10 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-[#FFD54F]/20">
                  {bhajan.duration}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audiobooks' && (
          <div className="grid gap-5">
            {filteredContent.map((book, idx) => (
              <div key={idx} onClick={() => playTrack(book)} className="bg-white dark:bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 flex gap-6 cursor-pointer hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-20 h-28 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-xl shadow-md dark:shadow-[0_0_20px_rgba(255,109,0,0.4)] flex items-center justify-center text-black shrink-0 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <BookOpen size={32} className="drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] relative z-10" />
                </div>
                <div className="flex-1 flex flex-col justify-center text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-1.5 group-hover:text-[#E65100] dark:group-hover:text-[#FFD54F] transition-colors">{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">{book.author}</p>
                  <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#E65100] dark:text-[#FF8A65] uppercase flex-wrap">
                    <span className="bg-orange-50 dark:bg-[#FF6D00]/10 border border-orange-100 dark:border-[#FF6D00]/20 px-3 py-1.5 rounded-lg shadow-sm">{book.chapters} Chapters</span>
                    <span className="bg-orange-100 dark:bg-[#FF6D00]/10 border border-orange-100 dark:border-[#FF6D00]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#FF6D00] hover:text-black dark:hover:bg-[#FF6D00] dark:hover:text-black transition-colors shadow-sm">
                      {currentTrack?.id === book.id && isPlaying ? <Pause size={12} /> : <Play size={12} />} Listen
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SectionAiAgent section="media" />

      {/* JBT Premium Help Modal for Multimedia */}
       {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/25 inline-block mb-1.5 font-mono">
                  📁 {language === 'en' ? 'MULTIMEDIA USER GUIDE' : 'मल्टीमीडिया निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                  ℹ️ {language === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer border border-gray-200 dark:border-white/5 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch requested in help modal */}
            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10">
              <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4 text-left text-gray-650 dark:text-gray-300 text-xs leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {language === 'en' ? 'Welcome to Jain Multimedia Library!' : 'जैन मल्टीमीडिया ऑडियो लाइब्रेरी में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-500 dark:text-gray-400">
                {language === 'en' 
                  ? 'Listen to beautiful spiritual stories, divine musical Bhajans, and deep audiobooks easily on-the-go with stable backup media source streams:' 
                  : 'महान नैतिक कहानियों, संगीतबद्ध भजनों एवं ज्ञानवर्धक ऑडियो पुस्तकों का अमृतपान सुगमता से करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400 font-semibold font-sans font-sans">
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? 'Three Dedicated Formats:' : 'तीन विशेष विभाग:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Includes Shravak Katha stories, continuous rhythmic devotional Bhajans, and classic Swadhyay audiobooks.' 
                    : 'नैतिक बोध कराने वाली कहानियां, मंत्रमुग्ध करने वाले भजन आडियो व तत्वज्ञान की पुस्तकें उपलब्ध हैं।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? 'Integrated Player Bar:' : 'सक्रिय प्लेयर बार:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Easily play, pause, or switch tracks with our floating persistent audio controller bar.' 
                    : 'नीचे स्थित ऑडियो कंट्रोलर से सीधे गीत को रोकना, आगे बढ़ाना या पीछे करना आसान है।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FFD54F]">{language === 'en' ? 'Responsive Voice Search:' : 'आवाज आधारित खोज:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Click the Microphone button and state any keyword to filter your active media collection instantly.' 
                    : 'माइक्रोफोन बटन पर क्लिक करके किसी भी विषय को बोलकर तुरंत खोज सकते हैं।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-150 dark:border-white/10 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {language === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
