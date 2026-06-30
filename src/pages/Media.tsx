import { useState, useRef, useEffect } from 'react';
import { 
  PlaySquare, Headphones, BookOpen, Play, Heart, Pause, 
  SkipForward, SkipBack, Search, Mic, ArrowLeft, Loader2, 
  Globe, Film, Tv, Sparkles, Clock, Compass, Eye, ThumbsUp, 
  Volume2, Bookmark, Video, Flame, ChevronRight, Share2, 
  ExternalLink, ListVideo, MonitorPlay, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { fallbackMediaData } from '../data/mediaData';
import SectionAiAgent from '../components/SectionAiAgent';
import { useLanguage } from '../contexts/LanguageContext';

export default function MediaPage() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  
  // Tab/Category state
  // Supported views: 'all', 'movies', 'webseries', 'digital_stories', 'devotional_videos', 'bhajans', 'audiobooks'
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null); // Active video or audio item
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null); // For Webseries active episode
  const [theaterMode, setTheaterMode] = useState(false); // Cinema dark mode
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<string[]>([]);

  // Audio Playback internals
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
  const hasTriedFallbackRef = useRef<boolean>(false);

  // Firestore Media integration
  const [mediaData, setMediaData] = useState<any>({
    movies: fallbackMediaData.movies,
    webseries: fallbackMediaData.webseries,
    digital_stories: fallbackMediaData.digital_stories,
    devotional_videos: fallbackMediaData.devotional_videos,
    stories: fallbackMediaData.stories,
    bhajans: fallbackMediaData.bhajans,
    audiobooks: fallbackMediaData.audiobooks,
  });
  const [loading, setLoading] = useState(true);

  // Watchlist & History persistence on mount
  useEffect(() => {
    const storedWatchlist = localStorage.getItem('jbt_ott_watchlist');
    if (storedWatchlist) {
      try { setWatchlist(JSON.parse(storedWatchlist)); } catch(e){}
    }
    const storedHistory = localStorage.getItem('jbt_ott_history');
    if (storedHistory) {
      try { setWatchHistory(JSON.parse(storedHistory)); } catch(e){}
    }
  }, []);

  const saveWatchlistToLocalStorage = (list: string[]) => {
    localStorage.setItem('jbt_ott_watchlist', JSON.stringify(list));
  };

  const saveHistoryToLocalStorage = (history: string[]) => {
    localStorage.setItem('jbt_ott_history', JSON.stringify(history));
  };

  const toggleWatchlist = (id: string) => {
    let updated;
    if (watchlist.includes(id)) {
      updated = watchlist.filter(item => item !== id);
    } else {
      updated = [...watchlist, id];
    }
    setWatchlist(updated);
    saveWatchlistToLocalStorage(updated);
  };

  const addToHistory = (id: string) => {
    const filtered = watchHistory.filter(item => item !== id);
    const updated = [id, ...filtered].slice(0, 10); // Keep last 10 entries
    setWatchHistory(updated);
    saveHistoryToLocalStorage(updated);
  };

  // Synchronize track reference and activeUrl safely when currentTrack changes
  useEffect(() => {
    currentTrackRef.current = currentTrack;
    if (currentTrack) {
      // Add to history
      addToHistory(currentTrack.id);

      // Force update videoUrl and thumbnail for Bhagwan Mahavir Movie in currentTrack state
      const titleEn = (typeof currentTrack.title === 'object' ? currentTrack.title.en : currentTrack.title || '').toLowerCase();
      const titleHi = (typeof currentTrack.title === 'object' ? currentTrack.title.hi : currentTrack.title || '').toLowerCase();
       if (currentTrack.id === 'movie_1' || (currentTrack.type === 'movies' && (titleEn.includes('mahavir') || titleHi.includes('महावीर')))) {
        if (currentTrack.videoUrl !== "https://www.youtube.com/embed/3apHlQW5M2g") {
          currentTrack.videoUrl = "https://www.youtube.com/embed/3apHlQW5M2g";
          currentTrack.thumbnail = "https://img.youtube.com/vi/3apHlQW5M2g/hqdefault.jpg";
        }
        currentTrack.embedDisabled = true;
      }

      const isVideo = ['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack.type);
      if (isVideo) {
        // Stop audio engine if video is opened
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        if (currentTrack.type === 'webseries' && currentTrack.episodes && currentTrack.episodes.length > 0) {
          setSelectedEpisode(currentTrack.episodes[0]);
        } else {
          setSelectedEpisode(null);
        }
        document.title = `${language === 'en' ? currentTrack.title.en : currentTrack.title.hi} • Jain OTT`;
      } else {
        // Standard audio item URL initialization
        setActiveUrl(currentTrack.url);
        setAudioError(null);
        hasTriedFallbackRef.current = false;
        setSelectedEpisode(null);
        document.title = `${currentTrack.title} • Play`;

        if ('mediaSession' in navigator) {
          try {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: currentTrack.title || 'Jain Audio',
              artist: currentTrack.narrator || 'Samil Swadhyay',
              album: activeTab === 'bhajans' ? 'Jain Bhajanamrit' : activeTab === 'audiobooks' ? 'Jain Swadhyay' : 'Shravak Katha Path',
              artwork: [
                { src: currentTrack.thumbnail || 'https://images.unsplash.com/photo-1609137144813-f66fcc430f80?q=80&w=120&auto=format&fit=crop', sizes: '128x128', type: 'image/jpeg' },
              ]
            });
          } catch (err) {
            console.warn("MediaSession assignment failed:", err);
          }
        }
      }
    } else {
      document.title = "Jainism GPT";
    }
  }, [currentTrack, activeTab]);

  // Sync Firebase collections or fallbacks
  useEffect(() => {
    // Select default track on startup if available
    if (!currentTrack && fallbackMediaData.movies.length > 0) {
      setCurrentTrack(fallbackMediaData.movies[0]);
    }

    const cleanAndFilterItems = (items: any[]) => {
      return items
        .filter((item: any) => {
          if (item.deleted === true) return false;
          
          const titleEn = (typeof item.title === 'object' ? item.title.en : item.title || '').toLowerCase();
          const titleHi = (typeof item.title === 'object' ? item.title.hi : item.title || '').toLowerCase();
          
          // Remove "राजा श्रेणिक और अनाथी मुनि की प्रेरक कहानी"
          if ((titleEn.includes('shrenik') && titleEn.includes('anathi')) ||
              (titleHi.includes('श्रेणिक') && titleHi.includes('अनाथी'))) {
            return false;
          }
          return true;
        })
        .map((item: any) => {
          const copy = { ...item };
          const titleEn = typeof copy.title === 'object' ? copy.title.en : copy.title || '';
          const titleHi = typeof copy.title === 'object' ? copy.title.hi : copy.title || '';
          
          // Fix playlist thumbnails
          if (copy.id === 'pravachan_1' || titleEn.includes('Collection 1') || titleHi.includes('११६ प्रवचन')) {
            copy.thumbnail = 'https://img.youtube.com/vi/mG0w9p9Y6lY/hqdefault.jpg';
          } else if (copy.id === 'pravachan_2' || titleEn.includes('Collection 2') || titleHi.includes('१५७ प्रवचन')) {
            copy.thumbnail = 'https://img.youtube.com/vi/Y0rQ1I7lC0w/hqdefault.jpg';
          } else if (copy.id === 'pravachan_3' || titleEn.includes('Universal Jain') || titleHi.includes('२७९ प्रवचन')) {
            copy.thumbnail = 'https://img.youtube.com/vi/1B16N8X6i2w/hqdefault.jpg';
          }

          // Override Bhagwan Mahavir Movie link and thumbnail to ensure it always uses the correct working embed URL
          const lowerTitleEn = titleEn.toLowerCase();
          const lowerTitleHi = titleHi.toLowerCase();
          if (copy.id === 'movie_1' || (copy.type === 'movies' && (lowerTitleEn.includes('mahavir') || lowerTitleHi.includes('महावीर')))) {
            copy.videoUrl = "https://www.youtube.com/embed/3apHlQW5M2g";
            copy.thumbnail = "https://img.youtube.com/vi/3apHlQW5M2g/hqdefault.jpg";
          }
          
          // General extract thumbnail from youtube URL
          if (!copy.thumbnail || copy.thumbnail.trim() === '' || copy.thumbnail.includes('videoseries') || copy.thumbnail.includes('list=')) {
            if (copy.videoUrl) {
              const ytMatch = copy.videoUrl.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/|shorts\/)([^#\&\?]*)/);
              if (ytMatch && ytMatch[1] && ytMatch[1].length === 11) {
                copy.thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
              }
            }
          }
          
          return copy;
        });
    };

    const unsubscribe = onSnapshot(collection(db, 'media'), (snapshot) => {
      const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const deletedIds = new Set(rawData.filter((item: any) => item.deleted === true).map(item => item.id));
      const activeData = rawData.filter((item: any) => item.deleted !== true);
      
      const movies = activeData.filter((item: any) => item.type === 'movies');
      const webseries = activeData.filter((item: any) => item.type === 'webseries');
      const digitalStories = activeData.filter((item: any) => item.type === 'digital_stories' || item.type === 'digital-stories');
      const devotionalVideos = activeData.filter((item: any) => item.type === 'devotional_videos' || item.type === 'devotional-videos');
      const stories = activeData.filter((item: any) => item.type === 'stories');
      const bhajans = activeData.filter((item: any) => item.type === 'bhajans');
      const audiobooks = activeData.filter((item: any) => item.type === 'audiobooks');
      
      const mergeItems = (firebaseItems: any[], fallbackItems: any[]) => {
        const merged = [...firebaseItems];
        const firebaseIds = new Set(firebaseItems.map(item => item.id));
        fallbackItems.forEach(item => {
          if (!firebaseIds.has(item.id) && !deletedIds.has(item.id)) {
            merged.push(item);
          }
        });
        return cleanAndFilterItems(merged);
      };

      setMediaData({
        movies: mergeItems(movies, fallbackMediaData.movies),
        webseries: mergeItems(webseries, fallbackMediaData.webseries),
        digital_stories: mergeItems(digitalStories, fallbackMediaData.digital_stories),
        devotional_videos: mergeItems(devotionalVideos, fallbackMediaData.devotional_videos),
        stories: mergeItems(stories, fallbackMediaData.stories),
        bhajans: mergeItems(bhajans, fallbackMediaData.bhajans),
        audiobooks: mergeItems(audiobooks, fallbackMediaData.audiobooks),
      });

      setLoading(false);
    }, (error) => {
      console.error('Error fetching media, loading fallback data:', error);
      setMediaData({
        movies: cleanAndFilterItems(fallbackMediaData.movies),
        webseries: cleanAndFilterItems(fallbackMediaData.webseries),
        digital_stories: cleanAndFilterItems(fallbackMediaData.digital_stories),
        devotional_videos: cleanAndFilterItems(fallbackMediaData.devotional_videos),
        stories: cleanAndFilterItems(fallbackMediaData.stories),
        bhajans: cleanAndFilterItems(fallbackMediaData.bhajans),
        audiobooks: cleanAndFilterItems(fallbackMediaData.audiobooks),
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Setup single HTML5 Audio instance for Audiobooks & Bhajans
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
      console.warn("Audio element error detected:", e, audio.src);
      setAudioLoading(false);
      
      const currentAudio = audioRef.current;
      if (currentAudio && currentAudio.src && !currentAudio.src.includes("/api/audio-proxy") && currentAudio.src.startsWith("http")) {
        console.log("Direct play failed. Redirecting to proxy...");
        const proxiedUrl = `/api/audio-proxy?url=${encodeURIComponent(currentAudio.src)}`;
        currentAudio.src = proxiedUrl;
        currentAudio.load();
        
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            if (err.name === 'AbortError') {
              console.log("Playback interrupted.");
            } else {
              triggerStandbyFallback();
            }
          });
        }
        return;
      }
      triggerStandbyFallback();
    };

    const triggerStandbyFallback = () => {
      if (hasTriedFallbackRef.current) {
        setAudioError("Unable to load audio track due to network conditions.");
        return;
      }

      hasTriedFallbackRef.current = true;
      const track = currentTrackRef.current;
      if (track) {
        setAudioError("Primary stream unavailable. Activating stable backup track...");
        const backups: Record<string, string> = {
          fb_story_1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          fb_story_2: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          fb_story_3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
          fb_bhajan_1: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          fb_bhajan_2: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          fb_bhajan_3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        };
        const fallbackUrl = backups[track.id] || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        setTimeout(() => {
          if (currentTrackRef.current && currentTrackRef.current.id === track.id) {
            setActiveUrl(fallbackUrl);
          }
        }, 800);
      }
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);

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

  // Sync activeUrl with Audio Element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    const isVideo = ['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack?.type);
    if (isVideo) return; // Ignore for video types

    if (previousUrlRef.current !== activeUrl) {
      setAudioError(null);
      audio.src = activeUrl;
      previousUrlRef.current = activeUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [activeUrl, isPlaying, currentTrack]);

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

  // Audiobook Chapters generator
  const getBookChaptersWithOffsets = (track: any) => {
    if (!track) return [];
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

    const count = track.chapters || 5;
    const list = [];
    const spacingInSec = 300;
    for (let i = 1; i <= Math.min(count, 8); i++) {
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
    setCurrentTrack(track);
    const isVideo = ['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(track.type);
    if (!isVideo) {
      setIsPlaying(true);
    }
    // Scroll smoothly to player
    const playerEl = document.getElementById('ott-player-anchor');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-US' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert(language === 'en' ? 'Speech recognition is not supported in this browser.' : 'आपका ब्राउज़र वॉयस खोज का समर्थन नहीं करता है।');
    }
  };

  const playNextTrack = () => {
    // Collect all elements from current tab or overall
    const sourceList = getActiveTabContent();
    const currentIndex = sourceList.findIndex((t: any) => t.id === currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < sourceList.length - 1) {
      playTrack(sourceList[currentIndex + 1]);
    } else if (sourceList.length > 0) {
      playTrack(sourceList[0]);
    }
  };

  const playPrevTrack = () => {
    const sourceList = getActiveTabContent();
    const currentIndex = sourceList.findIndex((t: any) => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      playTrack(sourceList[currentIndex - 1]);
    } else if (sourceList.length > 0) {
      playTrack(sourceList[sourceList.length - 1]);
    }
  };

  // Filter and compile active list based on search/tabs
  const getActiveTabContent = () => {
    let items: any[] = [];
    if (activeTab === 'all') {
      items = [
        ...mediaData.movies,
        ...mediaData.webseries,
        ...mediaData.digital_stories,
        ...mediaData.devotional_videos,
        ...mediaData.stories,
        ...mediaData.bhajans,
        ...mediaData.audiobooks,
      ];
    } else {
      items = mediaData[activeTab] || [];
    }

    // Search query matching
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter((item: any) => {
        const titleMatch = typeof item.title === 'object' 
          ? (item.title.en.toLowerCase().includes(q) || item.title.hi.includes(q))
          : item.title.toLowerCase().includes(q);
        const descMatch = item.description 
          ? (item.description.en.toLowerCase().includes(q) || item.description.hi.includes(q))
          : false;
        const artistMatch = item.artist ? item.artist.toLowerCase().includes(q) : false;
        const authorMatch = item.author ? item.author.toLowerCase().includes(q) : false;
        return titleMatch || descMatch || artistMatch || authorMatch;
      });
    }
    return items;
  };

  const activeContent = getActiveTabContent();

  // Selected Featured Hero Spotlight Item
  const spotlightItem = mediaData.movies[0] || fallbackMediaData.movies[0];

  return (
    <div className={cn(
      "min-h-full p-4 md:p-8 pb-24 text-gray-900 dark:text-gray-100 transition-colors duration-300 bg-transparent",
      theaterMode && "dark:bg-[#000000] bg-zinc-950 text-white"
    )}>
      
      {/* Dynamic Theater Light Dimmer Overlay */}
      {theaterMode && (
        <div className="fixed inset-0 bg-black/90 pointer-events-none z-30 transition-opacity duration-500" />
      )}

      {/* STICKY MAIN OTT CONTROL BAR */}
      <header className={cn(
        "sticky top-0 z-40 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 pt-4 pb-4 mb-6 border-b flex items-center justify-between gap-4 transition-colors duration-300",
        theaterMode 
          ? "bg-black/80 border-white/5 text-white" 
          : "bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 border-gray-200/50 dark:border-white/5"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-2xl bg-white dark:bg-white/5 border border-gray-150 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E00] to-[#FF9F00] tracking-tight truncate flex items-center gap-2">
              <Film className="text-[#FF4E00] animate-pulse shrink-0" size={20} />
              <span className="truncate">{language === 'en' ? 'JAIN OTT PLATFORM' : 'जैन OTT - स्वाध्याय एवं मनोरंजन'}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold dark:text-gray-400 truncate hidden xs:block">
              {language === 'en' ? 'Authentic Jain Movies, Webseries, Stories & Audiobooks' : 'पवित्र सात्विक फिल्में, वेबसीरीज, सचित्र कहानियां एवं स्वाध्याय'}
            </p>
          </div>
        </div>

        {/* Dynamic Controls aligned on the right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Watchlist Quick Count Badge */}
          {watchlist.length > 0 && (
            <div className="hidden md:flex items-center gap-1 bg-[#FF4E00]/10 text-[#FF4E00] px-3 py-1.5 rounded-xl border border-[#FF4E00]/20 text-[10px] font-black uppercase font-mono">
              <Bookmark size={11} className="fill-[#FF4E00]" />
              <span>{watchlist.length} {language === 'en' ? 'Watchlist' : 'सूची'}</span>
            </div>
          )}

          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-white/10 h-9 w-9 flex items-center justify-center shrink-0 shadow-sm"
            title={language === 'en' ? 'OTT Section Guide' : 'OTT विभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Translator Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-2 bg-[#FF4E00] text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-bold text-[10px] cursor-pointer border border-[#FF9F00]/20 shrink-0 h-9"
          >
            <Globe size={11} className="shrink-0" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* CINEMATIC HERO SPOTLIGHT BANNER (Only shows when search is empty and tab is 'all') */}
      {searchQuery === '' && activeTab === 'all' && spotlightItem && (
        <div className="mb-8 rounded-[2.5rem] overflow-hidden relative border border-gray-200 dark:border-white/5 shadow-xl h-[280px] sm:h-[350px] md:h-[420px] group transition-all duration-500">
          {/* Backdrop Image */}
          <img 
            src={spotlightItem.thumbnail} 
            alt="Spotlight" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8000ms]"
            referrerPolicy="no-referrer"
          />
          
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />

          {/* Glowing particle effect behind logo */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-r from-[#FF4E00]/20 to-transparent blur-3xl pointer-events-none" />

          {/* Content container */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 text-left max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-2 items-center">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-[#FF4E00] text-white px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                <Flame size={10} className="fill-white" />
                {language === 'en' ? 'TRENDING RELEASE' : 'चर्चित रिलीज़'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold bg-white/20 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                ⭐ {spotlightItem.rating} Rating
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold bg-white/20 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-mono">
                📅 {spotlightItem.year}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-black text-white leading-tight mb-2 drop-shadow-md">
              {language === 'en' ? spotlightItem.title.en : spotlightItem.title.hi}
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 font-medium mb-5 line-clamp-2 leading-relaxed drop-shadow-sm max-w-2xl">
              {language === 'en' ? spotlightItem.description.en : spotlightItem.description.hi}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => playTrack(spotlightItem)}
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-[#FF4E00] to-[#FF9F00] hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <Play size={16} className="fill-white" />
                <span>{language === 'en' ? 'Start Watching' : 'अभी देखना शुरू करें'}</span>
              </button>

              <button 
                onClick={() => toggleWatchlist(spotlightItem.id)}
                className={cn(
                  "px-4.5 py-3 sm:px-5 sm:py-3.5 backdrop-blur-md border rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95",
                  watchlist.includes(spotlightItem.id) 
                    ? "bg-[#FF4E00]/20 border-[#FF4E00] text-[#FF4E00]" 
                    : "bg-white/10 hover:bg-white/25 border-white/20 text-white"
                )}
              >
                <Bookmark size={14} className={watchlist.includes(spotlightItem.id) ? "fill-[#FF4E00]" : ""} />
                <span>{watchlist.includes(spotlightItem.id) ? (language === 'en' ? 'Saved' : 'सुरक्षित') : (language === 'en' ? 'Watchlist' : 'सूची में जोड़ें')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE MOVIE / VIDEO / AUDIO PLAYER ANCHOR */}
      <div id="ott-player-anchor" className="scroll-mt-24" />
      {currentTrack && (
        <div className={cn(
          "mb-8 rounded-[2.5rem] p-4 md:p-6 shadow-xl relative overflow-hidden transition-all duration-500 border z-30",
          theaterMode 
            ? "bg-zinc-950/95 border-[#FF4E00]/40 shadow-[0_0_50px_rgba(255,78,0,0.25)]" 
            : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5"
        )}>
          {/* Top Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-gray-150 dark:border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4E00] animate-ping" />
              <span className="text-[10px] font-black tracking-widest uppercase text-[#FF4E00] font-mono bg-[#FF4E00]/10 px-3 py-1 rounded-full border border-[#FF4E00]/20">
                {['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack.type) ? '🎬 LIVE THEATER SCREEN' : '🎙️ ACTIVE AUDIO SWADHYAY'}
              </span>
              {audioLoading && (
                <span className="text-[9.5px] font-bold bg-[#FF4E00]/15 text-[#FF9F00] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                  <Loader2 size={11} className="animate-spin" /> {language === 'en' ? 'Connecting stream...' : 'कनेक्ट हो रहा है...'}
                </span>
              )}
            </div>

            {/* Theater Mode switch & Share */}
            <div className="flex items-center gap-1.5">
              {['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack.type) && (
                <button 
                  onClick={() => setTheaterMode(!theaterMode)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                    theaterMode 
                      ? "bg-[#FF4E00] border-transparent text-white shadow-md shadow-orange-500/20" 
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  )}
                >
                  <MonitorPlay size={12} />
                  <span>{theaterMode ? (language === 'en' ? 'Lights On 💡' : 'लाइट चालू 💡') : (language === 'en' ? 'Theater Dim 🎬' : 'सिनेमा मोड 🎬')}</span>
                </button>
              )}

              <button 
                onClick={() => {
                  toggleWatchlist(currentTrack.id);
                }}
                className={cn(
                  "p-1.5 rounded-xl border transition-all h-8 w-8 flex items-center justify-center cursor-pointer",
                  watchlist.includes(currentTrack.id) 
                    ? "bg-[#FF4E00]/10 border-[#FF4E00]/30 text-[#FF4E00]" 
                    : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500"
                )}
                title={language === 'en' ? 'Bookmark to Watchlist' : 'पसंदीदा सूची में जोड़ें'}
              >
                <Bookmark size={14} className={watchlist.includes(currentTrack.id) ? "fill-[#FF4E00]" : ""} />
              </button>
            </div>
          </div>

          {/* MAIN PLAYER LAYOUT PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / CENTER: Video Viewport or Audio Waveform */}
            <div className="lg:col-span-8 space-y-4">
              {['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack.type) ? (
                /* HIGH END VIDEO STREAM BOX */
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                  {currentTrack.embedDisabled ? (
                    /* COHESIVE ULTRA-PREMIUM CINEMATIC BANNER FOR EMBED-RESTRICTED VIDEOS */
                    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 text-white relative z-10">
                      {/* Blurred backdrop image of the movie poster */}
                      <div className="absolute inset-0 -z-10 overflow-hidden">
                        <img 
                          src={currentTrack.thumbnail} 
                          alt="Backdrop" 
                          className="w-full h-full object-cover scale-105 blur-md brightness-[0.35]" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/85 to-black/50" />
                      </div>

                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest uppercase text-[#FF4E00] font-mono bg-[#FF4E00]/10 px-3 py-1 rounded-full border border-[#FF4E00]/25 backdrop-blur-md">
                          🍿 {language === 'en' ? 'HIGH-DEFINITION CINEMA' : 'हाई-डेफिनिशन सिनेमा'}
                        </span>
                        <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold tracking-wide uppercase">
                          ⭐ {language === 'en' ? 'PURE STREAM' : 'शुद्ध प्रसारण'}
                        </div>
                      </div>

                      {/* Middle: Call to Action (Play Button & Watch link) */}
                      <div className="flex flex-col items-center justify-center text-center py-4 space-y-4">
                        <a 
                          href={selectedEpisode ? selectedEpisode.videoUrl.replace('embed/', 'watch?v=') : currentTrack.videoUrl.replace('embed/', 'watch?v=')} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group/btn flex flex-col items-center justify-center cursor-pointer"
                        >
                          {/* Pulsing Play Button */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FF4E00] hover:bg-[#FF6A00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,78,0,0.6)] group-hover/btn:scale-110 transition-all duration-300 relative mb-4">
                            <span className="absolute inset-0 rounded-full bg-[#FF4E00]/40 animate-ping" />
                            <Play size={28} className="fill-white text-white ml-1.5" />
                          </div>
                          
                          <div className="px-6 py-3.5 bg-gradient-to-r from-[#FF4E00] to-[#FF9F00] hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                            {language === 'en' ? 'Watch Directly on YouTube 🍿' : 'सीधे यूट्यूब पर देखें 🍿'}
                          </div>
                        </a>
                      </div>

                      {/* Footer/Notice text */}
                      <div className="text-center bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                        <p className="text-[11px] sm:text-xs text-gray-300 font-medium max-w-xl mx-auto leading-relaxed">
                          ⚠️ {language === 'en' 
                            ? "This spiritual movie's playback is restricted for embedding by its creator. Click the button above to watch it instantly in Full HD directly on YouTube!" 
                            : "इस पावन फिल्म का सीधा प्रसारण यूट्यूब क्रिएटर द्वारा प्रतिबंधित किया गया है। यूट्यूब पर पूर्ण HD में तुरंत देखने के लिए ऊपर दिए बटन पर क्लिक करें!"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <iframe
                        src={selectedEpisode ? selectedEpisode.videoUrl : currentTrack.videoUrl}
                        title={language === 'en' ? currentTrack.title.en : currentTrack.title.hi}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[10px] font-bold text-white tracking-wide uppercase pointer-events-none">
                        ⭐ 1080p Pure Stream
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* DELUXE AUDIO PLAYBACK VISUALIZER */
                <div className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-[#FF4E00]/5 dark:to-[#FF4E00]/15 border border-orange-100 dark:border-[#FF4E00]/10 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden h-[200px] sm:h-[240px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4E00]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-orange-200 dark:border-[#FF4E00]/20 mb-4 animate-spin-slow">
                      <img src={currentTrack.thumbnail || "https://picsum.photos/seed/mahavir/150/150"} alt="Music Disc" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {isPlaying && (
                      <div className="absolute -bottom-2 -right-2 bg-[#FF4E00] text-white p-1 rounded-full shadow-md animate-bounce">
                        <Volume2 size={12} />
                      </div>
                    )}
                  </div>

                  {/* Waveform Visualization Bars */}
                  <div className="flex gap-1 mb-4 h-8 items-end">
                    {[1,2,3,4,5,6,7,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1].map((bar, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1 bg-[#FF4E00] rounded-full transition-all duration-300",
                          isPlaying ? "animate-[bounce_0.8s_infinite]" : "h-1 opacity-40"
                        )}
                        style={{ 
                          height: isPlaying ? `${bar * 3.5}px` : '4px',
                          animationDelay: isPlaying ? `${i * 40}ms` : '0ms'
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-[11px] font-black uppercase text-[#FF4E00] tracking-wider mb-1 font-mono">
                    🎧 {language === 'en' ? 'SOUND DISCOURSE STREAM ACTIVE' : 'स्वर तरंगिणी प्रवाह सक्रिय'}
                  </p>
                </div>
              )}

              {/* TIMELINE PROGRESS & AUDIO CONTROLLER (Only shows for Audio Type) */}
              {!['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack.type) && (
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-150 dark:border-white/5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#FF4E00] font-sans text-[10px] font-black uppercase tracking-wider animate-pulse">
                      ⚡ {language === 'en' ? 'SWADHYAY PROGRESS ACTIVE' : 'स्वाध्याय श्रवण प्रगति सूचक'}
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
                    className="w-full h-2 rounded-lg cursor-pointer accent-[#FF4E00] bg-gray-200 dark:bg-white/10 focus:outline-none" 
                  />

                  {/* Playback Control Keys */}
                  <div className="flex items-center justify-center gap-6 pt-1">
                    <button 
                      onClick={playPrevTrack} 
                      className="p-2 text-gray-400 hover:text-[#FF4E00] hover:bg-orange-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer"
                      title={language === 'en' ? 'Previous Disc' : 'पिछला स्वाध्याय'}
                    >
                      <SkipBack size={22} />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-[#FF4E00] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-1" />}
                    </button>

                    <button 
                      onClick={playNextTrack} 
                      className="p-2 text-gray-400 hover:text-[#FF4E00] hover:bg-orange-50 dark:hover:bg-white/5 rounded-full transition-all cursor-pointer"
                      title={language === 'en' ? 'Next Disc' : 'अगला स्वाध्याय'}
                    >
                      <SkipForward size={22} />
                    </button>
                  </div>

                  {/* Time Travel Seek Panel */}
                  <div className="bg-orange-50/40 dark:bg-white/5 p-3 rounded-2xl border border-orange-100 dark:border-white/5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[10px] font-black uppercase text-orange-700 dark:text-[#FF9F00] font-mono flex items-center gap-1 shrink-0">
                      ⏱️ {language === 'en' ? 'JUMP TO MINUTE:' : 'सीधे मनपसंद मिनट पर जाएं:'}
                    </span>
                    <form onSubmit={handleJumpToTime} className="flex items-center gap-2 max-w-xs justify-end">
                      <input 
                        type="number" 
                        min={0} 
                        placeholder="Mins" 
                        value={jumpMins}
                        onChange={(e) => setJumpMins(e.target.value)}
                        className="w-14 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg py-1 px-2 text-xs font-bold focus:outline-none"
                      />
                      <input 
                        type="number" 
                        min={0} 
                        max={59}
                        placeholder="Secs" 
                        value={jumpSecs}
                        onChange={(e) => setJumpSecs(e.target.value)}
                        className="w-14 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg py-1 px-2 text-xs font-bold focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        className="bg-[#FF4E00] text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg uppercase cursor-pointer"
                      >
                        {language === 'en' ? 'GO' : 'जाएं'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Metadata panel, Episodes lists, or Audio Granth Chapters */}
            <div className="lg:col-span-4 text-left space-y-4">
              {/* Media Info Card */}
              <div className="bg-gray-50 dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-white/5 space-y-3.5">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[9px] font-bold bg-[#FF4E00]/10 text-[#FF4E00] px-2.5 py-1 rounded-full border border-[#FF4E00]/20 font-mono">
                    📂 {currentTrack.category || 'Spiritual Swadhyay'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    ⭐ {currentTrack.rating || '5.0'} / 5.0
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-950 dark:text-white leading-tight">
                  {typeof currentTrack.title === 'object' 
                    ? (language === 'en' ? currentTrack.title.en : currentTrack.title.hi)
                    : currentTrack.title
                  }
                </h3>

                <p className="text-xs text-gray-650 dark:text-gray-300 font-medium leading-relaxed">
                  {currentTrack.description 
                    ? (language === 'en' ? currentTrack.description.en : currentTrack.description.hi)
                    : (language === 'en' 
                        ? 'Listen to this deeply peaceful traditional recitative discourse, composed with high internal clarity and moral teachings for regular swadhyay practice.'
                        : 'इस अत्यंत शांत और मंगलकारी पावन प्रवचन का श्रवण करें, जो हमारे अंतःकरण को शुद्ध करने और जीवन में सात्विक नियमों को दृढ़ करने में सहायक है।'
                      )
                  }
                </p>

                {currentTrack.author || currentTrack.artist ? (
                  <div className="pt-2 border-t border-gray-150 dark:border-white/5 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    👨‍🏫 {language === 'en' ? 'Presented by:' : 'प्रवक्ता / स्वर:'}{' '}
                    <span className="text-gray-900 dark:text-[#FF9F00]">{currentTrack.author || currentTrack.artist}</span>
                  </div>
                ) : null}
              </div>

              {/* WEBSERIES EPISODE LIST (Displays only when track is Webseries) */}
              {currentTrack.type === 'webseries' && currentTrack.episodes && (
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-3xl border border-gray-150 dark:border-white/5 text-left">
                  <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono">
                    <ListVideo size={13} className="text-[#FF4E00]" />
                    {language === 'en' ? 'SERIES EPISODES' : 'वेबसीरीज के सभी एपिसोड'} ({currentTrack.episodes.length})
                  </h4>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {currentTrack.episodes.map((ep: any) => {
                      const isSelected = selectedEpisode?.episodeNumber === ep.episodeNumber;
                      return (
                        <button
                          key={ep.episodeNumber}
                          type="button"
                          onClick={() => setSelectedEpisode(ep)}
                          className={cn(
                            "w-full p-2.5 rounded-2xl border text-left transition-all duration-300 flex gap-3 cursor-pointer text-xs",
                            isSelected 
                              ? "bg-[#FF4E00]/10 border-[#FF4E00]/40 text-[#FF4E00] shadow-sm" 
                              : "bg-white hover:bg-gray-100 dark:bg-[#121212]/50 dark:hover:bg-white/5 border-gray-150 dark:border-white/5 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {/* Image thumbnail */}
                          <div className="w-16 aspect-video rounded-lg overflow-hidden shrink-0 bg-black relative border border-gray-150 dark:border-white/5">
                            <img src={ep.thumbnail} alt="Ep Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              <Play size={10} className="fill-white text-white" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-black truncate text-gray-900 dark:text-white">
                              {language === 'en' ? ep.title.en : ep.title.hi}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium line-clamp-1">
                              {language === 'en' ? ep.description.en : ep.description.hi}
                            </div>
                            <div className="text-[9px] text-[#FF4E00] font-black mt-1 uppercase font-mono tracking-wider">
                              ⏱️ {ep.duration} • Episode {ep.episodeNumber}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AUDIOBOOK DISCOURSE CHAPTERS (Displays only when track is Audiobook) */}
              {currentTrack.type === 'audiobooks' && (
                <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-3xl border border-gray-150 dark:border-white/5 text-left">
                  <h4 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono">
                    📚 {language === 'en' ? 'GRANTH DISCOURSE TOPICS' : 'ग्रन्थ विवेचना विषय सूची'}
                  </h4>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {getBookChaptersWithOffsets(currentTrack).map((ch: any) => {
                      const isCurrent = currentTime >= ch.offset && currentTime < (ch.offset + 300);
                      return (
                        <button
                          key={ch.number}
                          type="button"
                          onClick={() => jumpToOffset(ch.offset)}
                          className={cn(
                            "w-full p-2.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer text-xs font-semibold",
                            isCurrent 
                              ? "bg-[#FF4E00]/10 border-[#FF4E00]/40 text-[#FF4E00]" 
                              : "bg-white hover:bg-gray-100 dark:bg-[#121212]/50 dark:hover:bg-white/5 border-gray-150 dark:border-white/5 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold block truncate text-gray-950 dark:text-white">
                              {language === 'en' ? ch.titleEn : ch.title}
                            </span>
                            <span className="text-[9px] text-gray-400 block mt-0.5 font-mono">
                              {language === 'en' ? `Starts around minute ${Math.floor(ch.offset / 60)}` : `लगभग मिनट ${Math.floor(ch.offset / 60)} से शुरू`}
                            </span>
                          </div>
                          <span className="text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md shrink-0 font-mono">
                            {ch.duration || '05:00'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUDIO ALERTS */}
      {audioError && !['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(currentTrack?.type) && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-2xl text-left flex gap-2.5 items-center">
          <span className="text-lg">📢</span>
          <p>{audioError}</p>
        </div>
      )}

      {/* QUICK WATCH HISTORY / RECENTLY PLAYED SHELF */}
      {watchHistory.length > 0 && searchQuery === '' && (
        <div className="mb-8 text-left">
          <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 font-mono">
            ⏱️ {language === 'en' ? 'RECENTLY WATCHED' : 'हाल ही में देखा गया'}
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {watchHistory.map(id => {
              // Find matching item in catalog
              const items = [
                ...mediaData.movies,
                ...mediaData.webseries,
                ...mediaData.digital_stories,
                ...mediaData.devotional_videos,
                ...mediaData.stories,
                ...mediaData.bhajans,
                ...mediaData.audiobooks,
              ];
              const item = items.find(x => x.id === id);
              if (!item) return null;

              return (
                <div 
                  key={id}
                  onClick={() => playTrack(item)}
                  className="w-32 shrink-0 group cursor-pointer text-left space-y-1.5"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-gray-250 dark:border-white/10 group-hover:border-[#FF4E00] relative transition-all duration-300 shadow-sm">
                    <img src={item.thumbnail} alt="Hist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Play size={14} className="fill-white text-white" />
                    </div>
                  </div>
                  <h4 className="text-[11px] font-black truncate text-gray-800 dark:text-gray-200">
                    {typeof item.title === 'object' ? (language === 'en' ? item.title.en : item.title.hi) : item.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEARCH AND SPEECH INPUT FIELD */}
      <div className="mb-8 relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-4.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder={language === 'en' ? "Search movies, episodes, stories, bhajans, books..." : "सच्ची फिल्में, अध्याय, भजन, ग्रंथ या धर्म कथा खोजें..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl py-4.5 pl-12 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4E00] transition-all shadow-md shadow-gray-100/50 dark:shadow-none"
        />
        <button
          onClick={startListening}
          className={cn(
            "absolute inset-y-0 right-4 flex items-center transition-colors px-1",
            isListening ? "text-[#FF4E00] animate-pulse" : "text-gray-400 hover:text-gray-700 dark:hover:text-white"
          )}
          title={language === 'en' ? 'Voice Search' : 'बोलकर खोजें'}
        >
          <Mic size={18} />
        </button>
      </div>

      {/* OTT VIEW CHANNELS FILTER BAR */}
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth border-b border-gray-150/30 dark:border-white/5">
        {[
          { id: 'all', label: 'All OTT 📺', labelHi: 'सभी मीडिया 📺' },
          { id: 'movies', label: 'Movies 🎬', labelHi: 'जैन फिल्में 🎬' },
          { id: 'webseries', label: 'Web Series 🍿', labelHi: 'वेबसीरीज 🍿' },
          { id: 'digital_stories', label: 'Kids Stories 🧸', labelHi: 'बाल कथाएं 🧸' },
          { id: 'devotional_videos', label: 'Devotional 🌟', labelHi: 'भक्ति वीडियो 🌟' },
          { id: 'audiobooks', label: 'Audio Books 📚', labelHi: 'ऑडियो ग्रंथ 📚' },
          { id: 'bhajans', label: 'Bhajans 🎧', labelHi: 'संगीत भजन 🎧' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Clear selected episode when changing tabs
                setSelectedEpisode(null);
              }}
              className={cn(
                "px-5 py-2.5 rounded-full text-[11px] sm:text-xs font-black whitespace-nowrap transition-all duration-300 cursor-pointer uppercase tracking-wider",
                isActive 
                  ? "bg-gradient-to-r from-[#FF4E00] to-[#FF9F00] text-white shadow-md shadow-orange-500/10 scale-105" 
                  : "bg-white dark:bg-[#121212]/80 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10"
              )}
            >
              {language === 'en' ? tab.label : tab.labelHi}
            </button>
          );
        })}
      </div>

      {/* SIMULATED VIRTUAL LIVE THEATER STAGE (Only visible on 'all' or 'devotional_videos' channels) */}
      {(activeTab === 'all' || activeTab === 'devotional_videos') && searchQuery === '' && (
        <div className="mb-10 text-left bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent dark:from-red-500/5 dark:via-transparent border border-red-500/15 p-5 sm:p-6 rounded-[2.5rem]">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h3 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest font-mono">
                {language === 'en' ? 'LIVE JAIN CHANNELS' : 'लाइव जैन प्रसारण केन्द्र'}
              </h3>
            </div>
            <span className="text-[9px] font-black uppercase bg-red-600 text-white px-2.5 py-0.5 rounded-lg animate-pulse font-mono tracking-widest">
              {language === 'en' ? 'LIVE NOW' : 'सक्रिय'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: "live_chan_jinvani",
                title: { en: "Jinvani Channel Live", hi: "जिनवाणी लाइव टीवी" },
                desc: { en: "Live discourses, divine aarti, and daily continuous spiritual stream.", hi: "मंगल प्रवचन, अभिषेक, शांतिधारा और भक्ति भजनों का निरंतर लाइव प्रसारण।" },
                videoUrl: "https://www.youtube.com/embed/Ol9daUrzQwE",
                thumbnail: "https://images.unsplash.com/photo-1609137144813-f66fcc430f80?q=80&w=600&auto=format&fit=crop",
                viewers: "1.5K watching"
              },
              {
                id: "live_chan_aadinath",
                title: { en: "Aadinath Channel Live", hi: "आदिनाथ लाइव टीवी" },
                desc: { en: "Continuous spiritual path, Panch Kalyanaka katha, and interactive stotras.", hi: "अनादि कल्याणी आदिनाथ टीवी पर सतत भक्ति और प्राचीन शास्त्रों की पावन अमृतधारा।" },
                videoUrl: "https://www.youtube.com/embed/L-6fsrFneq4",
                thumbnail: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
                viewers: "980 watching"
              },
              {
                id: "live_chan_agamvani",
                title: { en: "Agamvani Channel Live", hi: "अगमवाणी लाइव टीवी" },
                desc: { en: "Swadhyay of sacred Jain Agams directly from learned munis and scholars.", hi: "प्राचीन जैन आगमों का गंभीर स्वाध्याय, मुनिवाणी और पूज्य संतों के प्रवचनों का सीधा प्रसारण।" },
                videoUrl: "https://www.youtube.com/embed/PMYs6SMaaOY",
                thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
                viewers: "1.1K watching"
              },
              {
                id: "live_chan_paras",
                title: { en: "Paras Channel Live", hi: "पारस टीवी लाइव" },
                desc: { en: "Popular devotional channels with stotras, bhajans, and live tirth yatra.", hi: "भक्ति स्तोत्र, तीर्थ वंदना, गुरु वाणी और देश-विदेश के पावन महोत्सवों का निरंतर सीधा प्रसारण।" },
                videoUrl: "https://www.youtube.com/embed/r8T4fHvLM14",
                thumbnail: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop",
                viewers: "2.1K watching"
              }
            ].map(chan => (
              <div 
                key={chan.id}
                onClick={() => {
                  playTrack({
                    id: chan.id,
                    type: "devotional_videos",
                    title: chan.title,
                    description: chan.desc,
                    category: "LIVE TV",
                    videoUrl: chan.videoUrl,
                    thumbnail: chan.thumbnail,
                    rating: 5.0,
                    year: "LIVE",
                    tags: ["Live", "TV"]
                  });
                }}
                className="bg-white dark:bg-[#121212] border border-gray-200/60 dark:border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-sm text-left group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] px-2 py-0.5 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-md font-mono font-black uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      {language === 'en' ? 'LIVE STREAM' : 'सीधा प्रसारण'}
                    </span>
                    <span className="text-[9.5px] font-bold text-gray-400 font-mono">
                      {chan.viewers}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white group-hover:text-red-500 transition-colors line-clamp-1">
                    {language === 'en' ? chan.title.en : chan.title.hi}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-1 line-clamp-2">
                    {language === 'en' ? chan.desc.en : chan.desc.hi}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-white/5 mt-3 flex items-center justify-between text-[9px] font-black text-[#FF4E00] uppercase tracking-wider">
                  <span>{language === 'en' ? 'Tune In Now' : 'चैनल चालू करें'}</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEDIA SHELF GRID RESULTS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4 text-left">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <MonitorPlay size={15} className="text-[#FF4E00]" />
            <span>
              {searchQuery !== '' 
                ? (language === 'en' ? `Search Results (${activeContent.length})` : `खोज परिणाम (${activeContent.length})`)
                : (language === 'en' ? 'Curated Shelf Catalog' : 'अनुशंसित सात्विक सूची')
              }
            </span>
          </h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
            {activeContent.length} items found
          </span>
        </div>

        {activeContent.length === 0 ? (
          <div className="bg-white dark:bg-[#121212] p-10 rounded-[2.5rem] border border-gray-250 dark:border-white/5 text-center space-y-3">
            <span className="text-3xl">🏜️</span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {language === 'en' ? 'No media titles match your filter' : 'आपकी खोज के अनुकूल कोई परिणाम नहीं मिला'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
              {language === 'en' 
                ? 'Try searching other keywords like "Mahavir", "Ahimsa", "Neminath", or select another OTT category above.'
                : 'कृपया दूसरे शब्दों का उपयोग करें जैसे "महावीर", "अहिंसा", "नेमिनाथ" या ऊपर दिए गए फ़िल्टर बटन बदलें।'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeContent.map((item, idx) => {
              const isVideo = ['movies', 'webseries', 'digital_stories', 'devotional_videos'].includes(item.type);
              const isActivePlaying = currentTrack?.id === item.id;
              
              return (
                <div 
                  key={idx} 
                  onClick={() => playTrack(item)} 
                  className={cn(
                    "bg-white dark:bg-[#121212]/80 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-sm border group cursor-pointer transition-all duration-500 hover:-translate-y-1 text-left flex flex-col justify-between",
                    isActivePlaying 
                      ? "border-[#FF4E00]/50 shadow-[0_0_20px_rgba(255,78,0,0.15)] ring-1 ring-[#FF4E00]/20" 
                      : "border-gray-200 dark:border-white/5 hover:border-[#FF4E00]/30 hover:shadow-md hover:shadow-orange-500/5"
                  )}
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-950 shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title.en || item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                    
                    {/* Visual Hover Play button */}
                    <div className="absolute inset-0 bg-black/30 dark:bg-[#FF4E00]/10 group-hover:bg-black/40 dark:group-hover:bg-[#FF4E00]/20 transition-colors z-10 flex items-center justify-center">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white pl-0.5 shadow-md border border-white/20 transition-all duration-300 transform group-hover:scale-110",
                        isActivePlaying 
                          ? "bg-[#FF4E00] text-white" 
                          : "bg-black/50 hover:bg-[#FF4E00] group-hover:bg-[#FF4E00]"
                      )}>
                        {isActivePlaying && isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-white" />}
                      </div>
                    </div>

                    {/* Left Tag Category indicator */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wider z-20 border border-white/10 uppercase font-mono">
                      {item.type === 'movies' ? '🎬 Movie' :
                       item.type === 'webseries' ? '🍿 Series' :
                       item.type === 'digital_stories' ? '🧸 Stories' :
                       item.type === 'devotional_videos' ? '📹 Video' :
                       item.type === 'stories' ? '📻 Story' :
                       item.type === 'bhajans' ? '🎵 Bhajan' : '📚 Granth'}
                    </div>

                    {/* Duration / Episodes Tag indicator */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[9.5px] px-2 py-0.5 rounded-md font-mono z-20">
                      {item.duration || (item.episodesCount ? `${item.episodesCount} episodes` : `${item.chapters} Chs`)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-950 dark:text-white text-xs sm:text-sm tracking-wide line-clamp-1 group-hover:text-[#FF4E00] transition-colors mb-1">
                        {typeof item.title === 'object' 
                          ? (language === 'en' ? item.title.en : item.title.hi)
                          : item.title
                        }
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed">
                        {item.description 
                          ? (language === 'en' ? item.description.en : item.description.hi)
                          : (item.artist || item.author || 'Jain Swadhyay Recitative')
                        }
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-150/30 dark:border-white/5 mt-3 flex items-center justify-between text-[9px] font-black uppercase text-gray-400 tracking-wider">
                      <span>⭐ {item.rating || '4.9'} • {item.year || '2024'}</span>
                      <span className="text-[#FF4E00] flex items-center gap-1 group-hover:underline">
                        {isVideo ? (language === 'en' ? 'Watch Now' : 'चलाएं') : (language === 'en' ? 'Listen Now' : 'सुनें')}
                        <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SectionAiAgent section="media" />

      {/* JBT PREMIUM OTT HELP USER GUIDE MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2.5rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4E00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF4E00] uppercase tracking-widest bg-[#FF4E00]/10 px-3 py-1 rounded-full border border-[#FF4E00]/20 inline-block mb-1.5 font-mono">
                  📁 {language === 'en' ? 'OTT THEATER COMPASS' : 'जैन OTT निर्देश पुस्तिका'}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                  ℹ️ {language === 'en' ? 'OTT Features & Guide' : 'OTT की मुख्य विशेषताएं'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200 dark:border-white/5"
              >
                ✕
              </button>
            </div>

            {/* Guide Language Translator */}
            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between gap-3 mb-4 relative z-10">
              <span className="text-[9.5px] font-black uppercase text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1.5 bg-[#FF4E00] text-white hover:bg-orange-600 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer"
              >
                {language === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Content */}
            <div className="overflow-y-auto pr-1 space-y-4 text-left text-gray-650 dark:text-gray-300 text-xs leading-relaxed relative z-10 max-h-[50vh]">
              <p className="font-bold text-gray-900 dark:text-white">
                {language === 'en' ? 'Welcome to JBT Premium Jain OTT Platform!' : 'जैनेन्द्र भव्य जैन सात्विक OTT पटल पर आपका स्वागत है!'}
              </p>
              
              <ul className="list-disc pl-5 space-y-2.5 text-gray-500 dark:text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-gray-900 dark:text-[#FF9F00]">{language === 'en' ? 'Cinema Theater Screen:' : 'सिनेमा थिएटर स्क्रीन:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Play 1080p moral movies, webseries with multiple episodes, kids animations, and direct drone darshans instantly.' 
                    : 'बिना किसी व्यवधान के १०८०p एचडी क्वालिटी में नैतिक फ़िल्में, वेबसीरीज, बच्चों की सचित्र कहानियां और क्षेत्रों के ड्रोन दर्शन चलाएं।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FF9F00]">{language === 'en' ? 'Interactive Theater Lights:' : 'लाइट बंद करें (थिएटर मोड):'}</strong>{' '}
                  {language === 'en' 
                    ? 'Click "Theater Dim" to focus purely on the video screen by turning surrounding layout elements dark.' 
                    : '"सिनेमा मोड" पर क्लिक करके बाकी स्क्रीन की लाइटें बुझाएं और ध्यानमग्न होकर भव्य वीडियो का आनंद लें।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FF9F00]">{language === 'en' ? 'Personalized Watchlist:' : 'पसंदीदा प्लेलिस्ट:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Bookmark your favorite videos or books to watch them easily in your next session.' 
                    : 'किसी भी वीडियो या स्वाध्याय को पसंदीदा बुकमार्क सूची में जोड़ें ताकि अगली बार आप सीधे वहीं से देख सकें।'}
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-[#FF9F00]">{language === 'en' ? '24/7 Virtual Channels:' : '२४/७ लाइव वर्चुअल चैनल्स:'}</strong>{' '}
                  {language === 'en' 
                    ? 'Tune in to virtual streaming channels such as non-stop Jinvaani Sermons and Namokar Mind chanting.' 
                    : 'अनादि णमोकार ध्यान धारा और २४ घंटे निरंतर जिनवाणी प्रवचन धारा में जुड़कर धर्म ध्यान का लाभ लें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-150 dark:border-white/10 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF4E00] hover:bg-orange-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.01] active:scale-95 transition-all text-center"
              >
                {language === 'en' ? 'UNDERSTOOD & CONTINUE' : 'आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
