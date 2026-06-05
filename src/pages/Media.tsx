import { useState, useRef, useEffect } from 'react';
import { PlaySquare, Headphones, BookOpen, Play, Heart, Pause, SkipForward, SkipBack, Search, Mic, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { fallbackMediaData } from '../data/mediaData';
import SectionAiAgent from '../components/SectionAiAgent';

const tabs: { id: 'stories' | 'bhajans' | 'audiobooks', label: string, icon: any }[] = [
  { id: 'stories', label: 'Stories', icon: PlaySquare },
  { id: 'bhajans', label: 'Bhajans', icon: Headphones },
  { id: 'audiobooks', label: 'Audio Books', icon: BookOpen },
];

export default function MediaPage() {
  const navigate = useNavigate();
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

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  // Handle URL changes & Play/Pause states securely
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    if (previousUrlRef.current !== activeUrl) {
      setAudioError(null);
      audio.src = activeUrl;
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
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <PlaySquare className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          MULTIMEDIA
        </h1>
      </header>

      {/* Now Playing Banner */}
      {currentTrack && (
        <div className="mb-8 bg-[#121212]/90 backdrop-blur-xl rounded-[2.5rem] p-5 shadow-[0_0_30px_rgba(255,109,0,0.15)] border border-[#FF6D00]/30 relative overflow-hidden group flex items-center gap-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/20 transition-all duration-700" />
          
          <div className="w-16 h-16 rounded-2xl overflow-hidden relative shrink-0 shadow-[0_0_15px_rgba(255,109,0,0.3)] border border-white/10 group-hover:scale-105 transition-transform">
            <img src={currentTrack.thumbnail || "https://picsum.photos/seed/mahavir/100/100"} alt="Now Playing" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                <div className="w-1 h-3 bg-[#FFD54F] animate-[bounce_1s_infinite_0ms] rounded-full shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
                <div className="w-1 h-4 bg-[#FFD54F] animate-[bounce_1s_infinite_200ms] rounded-full shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
                <div className="w-1 h-2 bg-[#FFD54F] animate-[bounce_1s_infinite_400ms] rounded-full shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 relative z-10">
            <div className="flex items-center gap-2 text-[#FF8A65] mb-1">
              <span className="text-[9px] font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,138,101,0.5)]">Now Playing</span>
              {audioLoading && (
                <span className="text-[9px] font-bold bg-[#FF6D00]/20 text-[#FFD54F] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Loader2 size={10} className="animate-spin" /> Load...
                </span>
              )}
            </div>
            <h3 className="text-base font-black text-white truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentTrack.title}</h3>
            {audioError ? (
              <p className="text-xs text-amber-400 font-bold animate-pulse truncate">{audioError}</p>
            ) : (
              <p className="text-xs text-gray-400 font-medium truncate">{currentTrack.artist || currentTrack.author || 'Story'} • {currentTrack.duration || `${currentTrack.chapters} chapters`}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button onClick={playPrevTrack} className="text-gray-400 hover:text-white transition-colors cursor-pointer" title="Previous Track">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,109,0,0.5)] hover:scale-110 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-1" />}
            </button>
            <button onClick={playNextTrack} className="text-gray-400 hover:text-white transition-colors cursor-pointer" title="Next Track">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#121212] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6D00] transition-all"
        />
        <button
          onClick={startListening}
          className={cn(
            "absolute inset-y-0 right-4 flex items-center transition-colors",
            isListening ? "text-[#FF6D00] animate-pulse" : "text-gray-400 hover:text-white"
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
                  ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-[0_0_15px_rgba(255,109,0,0.6)] scale-105" 
                  : "bg-[#121212]/80 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-[#FF6D00]/30"
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
              <div key={idx} onClick={() => playTrack(story)} className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 group cursor-pointer hover:shadow-[0_0_25px_rgba(255,109,0,0.2)] hover:border-[#FF6D00]/30 transition-all duration-500 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                  <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-[#FF6D00]/10 group-hover:bg-[#FF6D00]/20 transition-colors z-10 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white pl-1.5 shadow-[0_0_20px_rgba(255,109,0,0.5)] border border-white/20 transform group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                      {currentTrack?.id === story.id && isPlaying ? <Pause size={28} className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] -ml-1.5" /> : <Play size={28} className="drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-[#FFD54F] text-xs px-3 py-1.5 rounded-lg font-bold tracking-wider z-20 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    {story.duration}
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center relative z-20 bg-[#121212]">
                  <h3 className="font-bold text-white text-lg tracking-wide group-hover:text-[#FFD54F] transition-colors">{story.title}</h3>
                  <button onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-[#F50057] transition-colors hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(245,0,87,0.8)]">
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
              <div key={idx} onClick={() => playTrack(bhajan)} className="bg-[#121212]/80 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 flex items-center gap-5 cursor-pointer hover:shadow-[0_0_20px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-[#FF6D00]/10 text-[#FF8A65] rounded-2xl flex items-center justify-center shrink-0 border border-[#FF6D00]/20 group-hover:scale-110 group-hover:bg-[#FF6D00] group-hover:text-black transition-all duration-300">
                  {currentTrack?.id === bhajan.id && isPlaying ? <Pause size={24} className="group-hover:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" /> : <Play size={24} className="group-hover:drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] ml-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-100 text-lg truncate group-hover:text-white transition-colors">{bhajan.title}</h3>
                  <p className="text-sm text-gray-400 font-medium truncate">{bhajan.artist}</p>
                </div>
                <div className="text-sm font-bold tracking-widest text-[#FFD54F] shrink-0 bg-[#FFD54F]/10 px-3 py-1.5 rounded-lg border border-[#FFD54F]/20">
                  {bhajan.duration}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audiobooks' && (
          <div className="grid gap-5">
            {filteredContent.map((book, idx) => (
              <div key={idx} onClick={() => playTrack(book)} className="bg-[#121212]/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 flex gap-6 cursor-pointer hover:shadow-[0_0_25px_rgba(255,109,0,0.15)] hover:border-[#FF6D00]/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-20 h-28 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-xl shadow-[0_0_20px_rgba(255,109,0,0.4)] flex items-center justify-center text-black shrink-0 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <BookOpen size={32} className="drop-shadow-[0_0_8px_rgba(0,0,0,0.3)] relative z-10" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-white text-xl mb-1.5 group-hover:text-[#FFD54F] transition-colors">{book.title}</h3>
                  <p className="text-sm text-gray-400 font-medium mb-4">{book.author}</p>
                  <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#FF8A65] uppercase">
                    <span className="bg-[#FF6D00]/10 border border-[#FF6D00]/20 px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(255,109,0,0.1)]">{book.chapters} Chapters</span>
                    <span className="bg-[#FF6D00]/10 border border-[#FF6D00]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-[#FF6D00] hover:text-black transition-colors shadow-[0_0_10px_rgba(255,109,0,0.1)]">
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
    </div>
  );
}
