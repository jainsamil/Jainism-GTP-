import { useState, useRef, useEffect } from 'react';
import { User, Camera, Instagram, Award, Settings, LogOut, BookOpen, ShieldAlert, Info, Edit2, Check, X, Download, Compass, Code, Milestone, Sparkles, Database, ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProfilePage() {
  const { user, role, login, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [profilePic, setProfilePic] = useState<string | null>('https://i.ibb.co/Myg19RW6/1000539584.jpg');
  const [name, setName] = useState('Samil Jain');
  const [bio, setBio] = useState('Lead Developer & Spiritual Seeker');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [aboutTab, setAboutTab] = useState<'origin' | 'tech' | 'features'>('origin');
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

  // Load user profile from firestore
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (user.email === 'samiljain0111@gmail.com') {
              setName('Samil Jain');
              setProfilePic('https://i.ibb.co/Myg19RW6/1000539584.jpg');
              setBio('Lead Developer & Spiritual Seeker');
            } else {
              setName(data.name || data.displayName || user.displayName || 'Spiritual Devotee');
              setProfilePic(data.photoURL || user.photoURL || 'https://i.ibb.co/Myg19RW6/1000539584.jpg');
              setBio(data.bio || 'Spiritual Seeker');
            }
            setInstagram(data.instagram || '');
            setWhatsapp(data.whatsapp || '');
            setIsPublic(data.isPublic !== false);
          } else {
            if (user.email === 'samiljain0111@gmail.com') {
              setName('Samil Jain');
              setProfilePic('https://i.ibb.co/Myg19RW6/1000539584.jpg');
              setBio('Lead Developer & Spiritual Seeker');
            } else {
              setName(user.displayName || 'Spiritual Devotee');
              setProfilePic(user.photoURL || 'https://i.ibb.co/Myg19RW6/1000539584.jpg');
              setBio('Spiritual Seeker');
            }
            setInstagram('');
            setWhatsapp('');
            setIsPublic(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    } else {
      setName('Samil Jain');
      setProfilePic('https://i.ibb.co/Myg19RW6/1000539584.jpg');
      setBio('Lead Developer & Spiritual Seeker');
      setInstagram('');
      setWhatsapp('');
      setIsPublic(true);
    }
  }, [user]);

  // Subscribe to public community members
  useEffect(() => {
    const q = query(collection(db, 'users'), where('isPublic', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMembers: any[] = [];
      snapshot.forEach((doc) => {
        fetchedMembers.push({ id: doc.id, ...doc.data() });
      });
      setMembers(fetchedMembers);
      setLoadingMembers(false);
    }, (error) => {
      console.error("Error fetching community members:", error);
      setLoadingMembers(false);
    });

    return () => unsubscribe();
  }, []);

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
        await updateDoc(doc(db, 'users', user.uid), { 
          name: name,
          displayName: name, 
          bio,
          instagram: instagram,
          whatsapp: whatsapp,
          isPublic: isPublic
        });
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    } else {
      localStorage.setItem('profileName', name);
      localStorage.setItem('profileBio', bio);
      localStorage.setItem('profileInstagram', instagram);
      localStorage.setItem('profileWhatsapp', whatsapp);
    }
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("क्या आप वाकई अपना खाता हटाना चाहते हैं? यह आपके सभी डेटा को पूरी तरह से हटा देगा। / Are you sure you want to permanently delete your account? This will wipe all your data.");
    if (confirmDelete) {
      try {
        setIsSaving(true);
        await deleteDoc(doc(db, 'users', user.uid));
        await user.delete();
        await logout();
        alert("Account successfully deleted / खाता सफलतापूर्वक हटा दिया गया है।");
        navigate('/');
      } catch (error: any) {
        console.error("Error deleting account:", error);
        if (error.code === 'auth/requires-recent-login') {
          alert("For security reasons, please log out and log in again before deleting your account. / सुरक्षा कारणों से, कृपया खाता हटाने से पहले एक बार लॉग आउट करके फिर से लॉग इन करें।");
        } else {
          alert("An error occurred. Please try again. / एक त्रुटि हुई। कृपया पुनः प्रयास करें।");
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const developerMember = members.find(m => m.role === 'developer' || m.email === 'samiljain0111@gmail.com');
  const normalMembers = members.filter(m => m.role !== 'developer' && m.email !== 'samiljain0111@gmail.com');
  const sortedMembers = developerMember ? [developerMember, ...normalMembers] : normalMembers;
  const totalCommunityCount = normalMembers.length;

  return (
    <div className="min-h-full p-6 pb-24 bg-transparent text-gray-900 dark:text-gray-200 transition-colors duration-300">
      
      {/* Sticky Header with inline controls */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 -mt-6 px-6 pt-4 pb-4 mb-8 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-1.5 sm:gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            <User className="text-[#FF6D00] shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="truncate">PROFILE</span>
          </h1>
        </div>

        <button 
          onClick={() => setShowSettings(true)}
          className="p-1.5 sm:p-2 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-full border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-[#FF6D00]/50 hover:shadow-[0_0_15px_rgba(255,109,0,0.3)] transition-all h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center shrink-0"
        >
          <Settings size={18} />
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

      {/* PROFILE SETTINGS (Privacy & Social Inputs) */}
      <div className="mt-6 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="text-[#FF6D00] w-4 h-4 sm:w-5 sm:h-5" />
            PROFILE SETTINGS (प्रोफाइल सेटिंग्स)
          </h3>
          {user ? (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF6D00]/10 text-[#FF6D00] hover:bg-[#FF6D00]/20 transition-all"
            >
              {isEditing ? <X size={12} /> : <Edit2 size={12} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          ) : (
            <button
              onClick={login}
              className="px-3 py-1 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center gap-1"
            >
              <User size={12} />
              Login with Google
            </button>
          )}
        </div>

        {!user ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 leading-relaxed">
              Login with Google to join the Jain Community Directory and update your social profiles!
            </p>
          </div>
        ) : !isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-1">Name (नाम)</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">{name}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-1">Bio (विवरण)</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">{bio}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-1">Instagram</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">
                  {instagram ? `@${instagram}` : <span className="text-gray-400 italic font-medium">Not added</span>}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-1">WhatsApp</span>
                <span className="text-xs font-bold text-gray-800 dark:text-white">
                  {whatsapp ? whatsapp : <span className="text-gray-400 italic font-medium">Not added</span>}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div>
                <span className="text-xs font-bold text-gray-800 dark:text-white">Directory Visibility (विजिबिलिटी)</span>
                <span className="text-[9px] text-gray-400 font-medium block">Show profile in Jain Community Directory</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isPublic 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
              }`}>
                {isPublic ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Full Name (पूरा नाम)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-xs focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
              />
            </div>

            <div>
              <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Bio / Status (विवरण)</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Lead Developer & Spiritual Seeker"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-xs focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Add Instagram Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-xs focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Add WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-xs focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div>
                <span className="text-xs font-bold text-gray-800 dark:text-white">Public Profile</span>
                <span className="text-[9px] text-gray-400 font-medium block">Show me in the public directory list</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/10'}`}
              >
                <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${isPublic ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-[#FF6D00] hover:bg-[#FF8F00] text-white rounded-xl text-[10px] font-black tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-bold tracking-wider uppercase hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="border-t border-red-500/10 pt-4 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">Delete Account Permanently</span>
                  <span className="text-[9px] text-gray-400 font-medium block">Irreversible account wipe</span>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black tracking-wider uppercase transition-all shadow-md"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JAIN COMMUNITY DIRECTORY */}
      <div className="mt-6 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="text-[#FF6D00] w-4 h-4 sm:w-5 sm:h-5" />
              JAIN COMMUNITY DIRECTORY (जैन कम्युनिटी डायरेक्टरी)
            </h3>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-1">
              Connect with Sadharmik Devotees Around the World
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF6D00]/10 text-[#FF6D00] border border-[#FF6D00]/20">
            Members: {totalCommunityCount}
          </span>
        </div>

        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-t-[#FF6D00] border-gray-200 dark:border-white/10 animate-spin" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Devotees...</span>
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No Public Members Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedMembers.map((member) => {
              const isDev = member.role === 'developer' || member.email === 'samiljain0111@gmail.com';
              return (
                <div 
                  key={member.id} 
                  className={cn(
                    "relative rounded-3xl p-4 flex flex-col items-center bg-white dark:bg-[#1c1c1e] border shadow-sm transition-all hover:scale-[1.03] duration-300 text-center overflow-hidden",
                    isDev 
                      ? "border-[#FF6D00]/50 dark:border-[#FF6D00]/80 shadow-[0_0_15px_rgba(255,109,0,0.15)] bg-gradient-to-b from-white to-[#FF6D00]/5 dark:from-[#1c1c1e] dark:to-[#FF6D00]/10" 
                      : "border-gray-100 dark:border-white/5"
                  )}
                >
                  {/* Developer Badge */}
                  {isDev && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white">
                      Developer
                    </span>
                  )}

                  {/* Profile Pic */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-white/10 mb-3 bg-gray-50 flex items-center justify-center shrink-0">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate w-full px-1 mb-1">
                    {member.name || member.displayName || 'Spiritual Devotee'}
                  </h4>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium line-clamp-1 w-full px-1 mb-2">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Icons */}
                  <div className="flex items-center justify-center gap-2 mt-auto">
                    {member.instagram && (
                      <a 
                        href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title={`Instagram: @${member.instagram}`}
                      >
                        <Instagram size={14} />
                      </a>
                    )}
                    {member.whatsapp && (
                      <a 
                        href={`https://wa.me/${member.whatsapp.replace('+', '').replace(/\s+/g, '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title={`WhatsApp: ${member.whatsapp}`}
                      >
                        <MessageCircle size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* About Us Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-6 w-full max-w-xl shadow-xl dark:shadow-[0_0_50px_rgba(255,109,0,0.25)] relative overflow-hidden my-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-gray-100 dark:border-white/5 pb-4">
              <div>
                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-wide">
                  <Sparkles className="text-[#FF6D00]" />
                  JAINISM GPT
                </h2>
                <div className="text-[10px] uppercase tracking-widest text-[#FF6D00] dark:text-[#FFD54F] font-black mt-1">
                  Version 2.4.0 (Divinity Edition)
                </div>
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Segmented Controller inside the About Us Dialog */}
            <div className="flex border-b border-gray-100 dark:border-white/5 mb-6 overflow-x-auto gap-2 pb-2 scrollbar-none relative z-10">
              <button
                onClick={() => setAboutTab('origin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shrink-0 ${
                  aboutTab === 'origin'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF9100] text-white shadow-sm'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-white/5'
                }`}
              >
                <Compass size={12} />
                About & Genesis
              </button>
              
              <button
                onClick={() => setAboutTab('features')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shrink-0 ${
                  aboutTab === 'features'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF9100] text-white shadow-sm'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-white/5'
                }`}
              >
                <Milestone size={12} />
                Feature Almanac
              </button>

              <button
                onClick={() => setAboutTab('tech')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shrink-0 ${
                  aboutTab === 'tech'
                    ? 'bg-gradient-to-r from-[#FF6D00] to-[#FF9100] text-white shadow-sm'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-white/5'
                }`}
              >
                <Code size={12} />
                Tech & Stack
              </button>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 relative z-10 max-h-[350px] overflow-y-auto pr-1">
              
              {/* TAB 1: ORIGIN & GENESIS DETAILS */}
              {aboutTab === 'origin' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Compass size={14} className="text-[#FF6D00]" />
                      Main Motive & Core Need
                    </h4>
                    <p className="text-xs leading-relaxed font-semibold text-gray-500 dark:text-gray-400">
                      We identified a critical need for an authentic, structured, and completely secure autonomous digital ecosystem for exploring pure Jain canonical wisdom. **Jainism GPT** is built for daily Swadhyay, ensuring pristine traditional knowledge remains untampered and freely accessible to everyone worldwide, regardless of geographical distance or lineage constraints.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Developer</span>
                      <span className="font-extrabold text-sm text-gray-900 dark:text-white block">Samil Jain</span>
                    </div>
                    <div className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-1">Creation Year</span>
                      <span className="font-extrabold text-sm text-[#FF6D00] dark:text-[#FFD54F] block">2024</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <table className="text-xs font-semibold w-full text-gray-500 dark:text-gray-400">
                      <tbody>
                        <tr className="border-b border-gray-100 dark:border-white/5">
                          <td className="py-2 text-gray-400 font-bold">Official Launch Date:</td>
                          <td className="py-2 text-gray-900 dark:text-white text-right font-black">25 July 2024</td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-white/5">
                          <td className="py-2 text-gray-400 font-bold">Auspicious Launch Day:</td>
                          <td className="py-2 text-[#FF6D00] dark:text-[#FFD54F] text-right font-bold">Thursday (गुरुवार)</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-400 font-bold">Primary Target:</td>
                          <td className="py-2 text-[#00C853] dark:text-[#69F0AE] text-right font-black">Universal Spiritual Swadhyay</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVATED FEATURES ALMANAC */}
              {aboutTab === 'features' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-wider mb-3.5 flex items-center gap-1.5 text-[#FF6D00]">
                      <Milestone size={14} />
                      Explain Features One by One (काम और विवरण)
                    </h4>
                    
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">1. Autonomous AI Jain Chatbot</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Spiritual doubts resolution & canonical companion guide.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Lets users ask questions about deep Jain philosophy, rules, and daily habits. The AI scans theological references to construct authentic scriptural answers, aiding pure self-motivated Swadhyay.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">2. Divine Pathshala (Chapters & Quizzes)</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Educational moral reading & self-assessment loops.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Guides users through beautiful slides on Jain pillars, moral scriptures, historical Tirthankaras information, and ends with live high-contrast multiple-choice quizzes to evaluate spiritual growth.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">3. Jain Scriptures & Agamas Library</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-200">काम (Function):</strong> Interactive digitized scripture browser.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Implements a responsive read-only search and look-up index of traditional compilations like the Tattvartha Sutra, Bhaktamar Stotra, and Namokar Mantra, providing standard daily chanting verses.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">4. Live India Time, Panchang & Vrat Clock</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Auspicious timing calculation & reminders.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Features an active clock synced securely to India Standard Time (IST) indicating tithis, historical events, fasting calendars (such as Pachkhan and Parvadhiraj Paryushan), and daily spiritually uplifting thoughts.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">5. Jaap (Chanting) Counter</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Devotional chanting assistance tracker.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Tracks Navkar Mantra chanting with interactive click actions, sound triggers, and a persistent stats history system stored safely to track your focus streaks.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">6. Tapas (Fasting) Tracker</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Penance logging & wellness diary.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Allows devotees to keep record books of standard fast days like Upvas, Ekasana, Biyasana, or Ayambil with customized feedback notes on inner peace and mindfulness.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">7. Tirth Dharamshala Directory</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Verified dharamshala listings, room capacity details, and trust inquiries.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Allows users to discover verified canonical Jain dharamshalas near holy shrines, check room capacities, access direct Trust contact numbers, and trace early meal service timings for pure diets.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">8. Pure Jain Food Locator</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Finding pure vegetarian food on-the-go.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Helps travelers discover verified pure Jain sweet shops, restaurants, and sadharmik kitchens with customizable filter controls.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">9. Bhaktamar Stotra Healing</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Playback and translation of chanting verses.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Details each Shloka's specific benefits, supporting loop playbacks, rhythmic tuning, and authentic Sanskrit/Hindi translation views.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">10. Sage Vihar Safety Support</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Tracking safety paths of Jain ascetics (Munishris).
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Features emergency help alert relays, direct path mapping, and group notifications for food/water tasks while saints are walking.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">11. Manuscript AI Digital Library</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Scanning and translating holy scripts.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Provides scanning capabilities to convert handwritten manuscripts into translated digital copy, preserving the sacred canonical context.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">12. Interactive Daily Jain Quiz</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Spiritual trivia assessments & self-assessment loops.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Provides a clean, fun, and high-contrast Multiple-Choice Question (MCQ) quiz interface covering historical occurrences, Jain tenets, and general spiritual vocabulary to elevate youth literacy.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">13. Section-Wise Live AI Specialists (AI Agents)</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Section-level interactive guides & smart helpers.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Integrates highly specialized local AI guides under each critical module (such as Panchang, Vichaar, Scriptures, and Media) to help users discover content, ask contextual questions, and perform direct digital search query actions effortlessly.
                        </p>
                      </div>

                      <div className="p-3 bg-gray-100/50 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <div className="font-extrabold text-[#FF6D00] text-[13px] mb-1">14. Chronological Jain History Overview</div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-300">काम (Function):</strong> Historical milestones explorer & timeline index.
                          <br />
                          <strong className="text-gray-800 dark:text-gray-300">विवरण (Description):</strong> Details landmark events in Jainism history from deep antiquity through recent historical excavations and modern standardizations, plotted on a responsive historical timeline.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ADVANCED TECHNOLOGY STACK */}
              {aboutTab === 'tech' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                      <Code size={14} />
                      Programming Language & UI Framework
                    </h4>
                    
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2.5 gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">TypeScript 5.x</p>
                          <p className="text-gray-400 font-medium text-[10px]">Strict Static Type Safety</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Features strict interfaces and type protection across all scriptures, profiles, and pathshala assets to protect against any unexpected runtime failures or system halts.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2.5 gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">React 18</p>
                          <p className="text-gray-400 font-medium text-[10px]">Dynamic Hook & Context States</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Utilizes native functional state machines and custom contexts to power instant user-interface renders, route controls, active quizzes, and sound playbacks.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2.5 gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">Tailwind CSS</p>
                          <p className="text-gray-400 font-medium text-[10px]">Utility Utility-First Design Engine</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Adopts customized responsive layouts styled in pristine saffron hues, containing unified spacing rhythms and beautiful, glare-free dark / light mode transitions.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">Vite Bundler</p>
                          <p className="text-gray-400 font-medium text-[10px]">High-efficiency Build Compiler</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Triggers specialized tree-shaking and compiles typescript files to optimize browser memory and load times.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <Database size={14} />
                      Data Storage & Spiritual AI Intelligence
                    </h4>
                    
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2.5 gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">Jainism GPT Secure Cloud</p>
                          <p className="text-gray-400 font-medium text-[10px]">Persistent NoSQL Database Connection</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Provides stable, remote cloud record-keeping for your high-score quizzes, customized notes, profile data, jaap counters, and vrat plans.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <p className="text-gray-900 dark:text-white font-black">Jainism Wisdom Engine V5</p>
                          <p className="text-gray-400 font-medium text-[10px]">Deep Philosophical Context Processing</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 sm:text-right text-[11px] leading-relaxed max-w-sm">
                          Acts as the cognitive core to evaluate scripture documents and reply back to spiritual queries with genuine scriptures context server-side.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Redirection to Samil's Instagram */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-3 relative z-10">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wider text-center font-bold uppercase select-none">
                Connect Directly with the Developer of Jainism GPT
              </p>
              <a 
                href="https://instagram.com/_officialsamiljain_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-amber-500 text-white rounded-2xl text-xs font-black tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transform transition-all uppercase"
              >
                <Instagram size={16} />
                Follow @_officialsamiljain_
              </a>
              <div className="text-[9px] uppercase tracking-widest text-[#FF6D00] dark:text-[#FFD54F] font-black mt-2 select-none">
                Jai Jinendra - जय जिनेन्द्र
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Install App Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_40px_rgba(0,176,255,0.2)] relative overflow-hidden">
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
