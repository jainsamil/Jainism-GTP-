import { useState, useRef, useEffect } from 'react';
import { User, Camera, Instagram, Award, Settings, LogOut, BookOpen, ShieldAlert, Info, Edit2, Check, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProfilePage() {
  const { user, role, login, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [profilePic, setProfilePic] = useState<string | null>('https://i.ibb.co/Myg19RW6/1000539584.jpg');
  const [name, setName] = useState('Samil Jain');
  const [bio, setBio] = useState('Lead Developer & Spiritual Seeker');
  const [isEditing, setIsEditing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    // Permanently locks Samil Jain's developer profile info
    setName('Samil Jain');
    setProfilePic('https://i.ibb.co/Myg19RW6/1000539584.jpg');
    setBio('Lead Developer & Spiritual Seeker');
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        if (user) {
          try {
            await updateProfile(user, { photoURL: base64String });
            await updateDoc(doc(db, 'users', user.uid), { photoURL: base64String });
          } catch (error) {
            console.error("Error updating profile picture:", error);
          }
        } else {
          localStorage.setItem('profilePic', base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        await updateDoc(doc(db, 'users', user.uid), { displayName: name, bio });
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      localStorage.setItem('profileName', name);
      localStorage.setItem('profileBio', bio);
    }
    setIsEditing(false);
    setIsSaving(false);
  };

  return (
    <div className="min-h-full p-6 pb-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <header className="flex items-center justify-between mb-8 pt-4">
        <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
          <User className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
          PROFILE
        </h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2.5 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-full border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#FF6D00]/50 hover:shadow-[0_0_15px_rgba(255,109,0,0.3)] transition-all"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Profile Header */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm dark:shadow-[0_0_30px_rgba(255,109,0,0.1)] border border-gray-200 dark:border-white/10 flex flex-col items-center mb-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FF6D00]/10 dark:from-[#FF6D00]/20 to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6D00]/5 dark:bg-[#FF6D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/10 dark:group-hover:bg-[#FF6D00]/20 transition-all duration-700" />
        
        <div className="relative mb-6 mt-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] p-1 shadow-[0_0_20px_rgba(255,109,0,0.3)] dark:shadow-[0_0_20px_rgba(255,109,0,0.5)] group-hover:shadow-[0_0_30px_rgba(255,109,0,0.5)] dark:group-hover:shadow-[0_0_30px_rgba(255,109,0,0.8)] transition-shadow duration-500">
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0A0A0A] overflow-hidden flex items-center justify-center text-gray-400 dark:text-gray-600 border-4 border-white dark:border-[#0A0A0A]">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-[#FF8A65]" />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-wide drop-shadow-none dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{name}</h2>
          </div>
          <p className="text-[#FF8A65] font-bold tracking-widest text-[10px] uppercase mb-6 drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(255,138,101,0.5)]">{bio}</p>
        </div>

        <a 
          href="https://instagram.com/_officialsamiljain_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 dark:from-pink-600 dark:to-orange-500 text-white rounded-full text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.3)] dark:shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 transition-all uppercase"
        >
          <Instagram size={18} />
          Connect on Instagram
        </a>
      </div>

      {/* Menu */}
      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/10 overflow-hidden">
        <button 
          onClick={() => {
            if (deferredPrompt) {
              handleInstallClick();
            } else {
              setShowInstallModal(true);
            }
          }} 
          className="w-full flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#00B0FF]/10 text-[#0091EA] dark:text-[#40C4FF] flex items-center justify-center border border-[#00B0FF]/20 group-hover:scale-110 transition-transform">
              <Download size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(64,196,255,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(64,196,255,0.8)]" />
            </div>
            <span className="font-bold text-[#0091EA] dark:text-[#40C4FF] tracking-wide">Install App</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">›</span>
        </button>

        <button onClick={() => setShowAbout(true)} className="w-full flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#00E676]/10 text-[#00C853] dark:text-[#69F0AE] flex items-center justify-center border border-[#00E676]/20 group-hover:scale-110 transition-transform">
              <Info size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(105,240,174,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(105,240,174,0.8)]" />
            </div>
            <span className="font-bold text-[#00C853] dark:text-[#69F0AE] tracking-wide">About Us</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">›</span>
        </button>
        <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD54F]/10 text-[#FFB300] dark:text-[#FFD54F] flex items-center justify-center border border-[#FFD54F]/20 group-hover:scale-110 transition-transform">
              <ShieldAlert size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,213,79,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,213,79,0.8)]" />
            </div>
            <span className="font-bold text-[#FFB300] dark:text-[#FFD54F] tracking-wide">Admin Panel</span>
          </div>
          <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">›</span>
        </button>
      </div>

      {/* About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_40px_rgba(255,109,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="text-[#FF6D00]" />
                ABOUT US
              </h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 relative z-10">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-[#FF6D00] dark:text-[#FFD54F] font-bold mb-2">Jainism GPT</h3>
                <p className="text-sm leading-relaxed">
                  A comprehensive platform for spiritual seekers to explore Jainism through AI-powered chat, multimedia, knowledge base, and interactive learning.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Created By</span>
                  <span className="font-bold text-gray-900 dark:text-white">Samil Jain</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Version</span>
                  <span className="font-bold text-gray-900 dark:text-white">1.0.0</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Creation Date</span>
                <span className="font-bold text-gray-900 dark:text-white">March 2026</span>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">Key Features</span>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00]"></span> AI Chat Assistant</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00]"></span> Multimedia (Bhajans, Stories)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00]"></span> Jain Knowledge Base</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6D00]"></span> Pathshala & Quizzes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Install App Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_40px_rgba(0,176,255,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B0FF]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Download className="text-[#0091EA] dark:text-[#40C4FF]" />
                INSTALL APP
              </h2>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-300 relative z-10">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                To install Jainism GPT on your device for the best native experience, follow these steps:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h3 className="text-[#00C853] dark:text-[#00E676] font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#00C853]/10 dark:bg-[#00E676]/20 flex items-center justify-center text-xs">1</span>
                    For Android (Chrome)
                  </h3>
                  <p className="text-sm">Tap the 3-dots menu (⋮) in your browser and select <strong className="text-gray-900 dark:text-white">"Add to Home screen"</strong> or <strong className="text-gray-900 dark:text-white">"Install app"</strong>.</p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <h3 className="text-[#0091EA] dark:text-[#40C4FF] font-bold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0091EA]/10 dark:bg-[#40C4FF]/20 flex items-center justify-center text-xs">2</span>
                    For iOS (Safari)
                  </h3>
                  <p className="text-sm">Tap the Share button (square with arrow pointing up) at the bottom and select <strong className="text-gray-900 dark:text-white">"Add to Home Screen"</strong>.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-4 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-2xl font-black tracking-wide hover:bg-gray-200 dark:hover:bg-white/20 transition-colors uppercase text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_40px_rgba(255,109,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="text-[#FF6D00]" />
                SETTINGS
              </h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 relative z-10">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-bold">Push Notifications</h3>
                  <p className="text-xs text-gray-500">Receive daily vichaar and updates</p>
                </div>
                <div 
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", pushEnabled ? "bg-[#FF6D00]" : "bg-gray-300 dark:bg-white/10")}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", pushEnabled ? "right-1" : "left-1 bg-gray-400")}></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900 dark:text-white font-bold">Offline Mode</h3>
                  <p className="text-xs text-gray-500">Download content for offline use</p>
                </div>
                <div 
                  onClick={() => setOfflineEnabled(!offlineEnabled)}
                  className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", offlineEnabled ? "bg-[#FF6D00]" : "bg-gray-300 dark:bg-white/10")}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", offlineEnabled ? "right-1" : "left-1 bg-gray-400")}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Language Preference</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={cn("flex-1 py-2 font-bold rounded-xl text-sm transition-colors", language === 'en' ? "bg-[#FF6D00] text-white dark:text-black" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20")}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('hi')}
                    className={cn("flex-1 py-2 font-bold rounded-xl text-sm transition-colors", language === 'hi' ? "bg-[#FF6D00] text-white dark:text-black" : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20")}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
