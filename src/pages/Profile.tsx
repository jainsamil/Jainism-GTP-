import { useState, useRef, useEffect } from 'react';
import { User, Camera, Instagram, Award, Settings, LogOut, BookOpen, ShieldAlert, Info, Edit2, Check, X, Download, Compass, Code, Milestone, Sparkles, Database, ArrowLeft, Users, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, collection, setDoc, getDoc, onSnapshot, query, orderBy, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function ProfilePage() {
  const { user, role, login, loginWithEmail, registerWithEmail, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [profilePic, setProfilePic] = useState<string | null>('https://i.ibb.co/Myg19RW6/1000539584.jpg');
  const [name, setName] = useState('Samil Jain');
  const [bio, setBio] = useState('Lead Developer & Spiritual Seeker');
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

  // Jain Community state definitions
  const [communityMembers, setCommunityMembers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserCommunity, setCurrentUserCommunity] = useState<any>(null);
  const [whatsappInput, setWhatsappInput] = useState('');
  const [instaInput, setInstaInput] = useState('');
  const [isUpdatingCommunity, setIsUpdatingCommunity] = useState(false);
  const [communityStatusMsg, setCommunityStatusMsg] = useState('');

  // Inline Secure Custom Auth states
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [showEditLinksModal, setShowEditLinksModal] = useState(false);

  // Load and subscribe to community directory
  useEffect(() => {
    const q = query(collection(db, 'jain_community'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members: any[] = [];
      snapshot.forEach((docSnap) => {
        members.push({ id: docSnap.id, ...docSnap.data() });
      });
      
      const samilEmail = 'samiljain0111@gmail.com';
      const samilIndex = members.findIndex(m => m.email?.toLowerCase() === samilEmail);
      let sortedMembers = [...members];
      
      let samilMember: any = null;
      if (samilIndex > -1) {
        samilMember = sortedMembers.splice(samilIndex, 1)[0];
      } else {
        samilMember = {
          uid: 'samil_dev_id',
          displayName: 'Samil Jain',
          photoURL: 'https://i.ibb.co/Myg19RW6/1000539584.jpg',
          email: samilEmail,
          bio: 'Lead Developer & Spiritual Seeker',
          whatsapp: '',
          instagram: '_officialsamiljain_',
          isDeveloper: true,
          updatedAt: Date.now()
        };
      }
      
      sortedMembers.unshift(samilMember);
      setCommunityMembers(sortedMembers);
      setTotalCount(sortedMembers.length);
    }, (error) => {
      console.error("Error loading community:", error);
    });

    return () => unsubscribe();
  }, []);

  // Fetch current user community card details
  useEffect(() => {
    if (user) {
      const getCommunityDoc = async () => {
        try {
          const docRef = doc(db, 'jain_community', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUserCommunity(data);
            setWhatsappInput(data.whatsapp || '');
            setInstaInput(data.instagram || '');
          } else {
            const isDev = user.email === 'samiljain0111@gmail.com';
            const newDoc = {
              uid: user.uid,
              displayName: user.displayName || 'Jain Soul',
              photoURL: user.photoURL || '',
              email: user.email || '',
              whatsapp: '',
              instagram: '',
              isDeveloper: isDev,
              updatedAt: Date.now()
            };
            await setDoc(docRef, newDoc);
            setCurrentUserCommunity(newDoc);
          }
        } catch (err) {
          console.error("Error fetching community document:", err);
        }
      };
      getCommunityDoc();
    } else {
      setCurrentUserCommunity(null);
      setWhatsappInput('');
      setInstaInput('');
    }
  }, [user]);

  // Handle community link updates
  const handleUpdateCommunityCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingCommunity(true);
    setCommunityStatusMsg('');
    try {
      const communityRef = doc(db, 'jain_community', user.uid);
      await setDoc(communityRef, {
        whatsapp: whatsappInput.trim(),
        instagram: instaInput.trim(),
        displayName: user.displayName || name,
        photoURL: user.photoURL || profilePic || '',
        updatedAt: Date.now()
      }, { merge: true });
      
      setCommunityStatusMsg('success');
      setTimeout(() => {
        setCommunityStatusMsg('');
        setShowEditLinksModal(false);
      }, 1500);
    } catch (error) {
      console.error("Error updating community links:", error);
      setCommunityStatusMsg('error');
    } finally {
      setIsUpdatingCommunity(false);
    }
  };

  // Handle account and community card deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account, saved chats, and remove your card from the Jain Community? This action cannot be undone."
    );
    
    if (!confirmDelete) return;
    
    setIsUpdatingCommunity(true);
    const userId = user.uid;
    try {
      // 1. Delete from firebase auth first to guarantee deletion before cleanup
      await user.delete();
      
      // 2. Since auth deletion succeeded, clean up Firestore collections
      await deleteDoc(doc(db, 'jain_community', userId));
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete user_chats
      try {
        const q = query(collection(db, 'user_chats'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
      } catch (chatErr) {
        console.error("Error deleting user chats:", chatErr);
      }
      
      alert("Your account and community card have been successfully deleted.");
      await logout();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error?.code === 'auth/requires-recent-login') {
        alert("For security reasons, this action requires you to sign in again before deleting your account.");
      } else {
        alert("Failed to delete account. Please try logging out and logging back in, then try again.");
      }
    } finally {
      setIsUpdatingCommunity(false);
    }
  };

  const handleCustomAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setAuthLoading(true);
    
    if (!emailInput || !passwordInput) {
      setAuthError('Email and Password are required.');
      setAuthLoading(false);
      return;
    }
    
    try {
      if (authTab === 'signup') {
        if (!displayNameInput) {
          setAuthError('Display Name is required.');
          setAuthLoading(false);
          return;
        }
        await registerWithEmail(emailInput.trim(), passwordInput, displayNameInput.trim());
        setAuthSuccessMsg('Account created successfully! Welcome to Jainism GPT.');
      } else {
        await loginWithEmail(emailInput.trim(), passwordInput);
        setAuthSuccessMsg('Logged in successfully!');
      }
      
      // Clear fields
      setEmailInput('');
      setPasswordInput('');
      setDisplayNameInput('');
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMsg = 'Authentication failed. Please try again.';
      if (error?.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already in use.';
      } else if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      } else if (error?.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.';
      }
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

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
    if (user) {
      const loadProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.displayName || user.displayName || 'Jain Soul');
            setProfilePic(data.photoURL || user.photoURL || '');
            setBio(data.bio || 'Sadharmik Devotee');
          } else {
            setName(user.displayName || 'Jain Soul');
            setProfilePic(user.photoURL || '');
            setBio('Sadharmik Devotee');
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setName(user.displayName || 'Jain Soul');
          setProfilePic(user.photoURL || '');
          setBio('Sadharmik Devotee');
        }
      };
      
      if (user.email === 'samiljain0111@gmail.com') {
        setName('Samil Jain');
        setProfilePic('https://i.ibb.co/Myg19RW6/1000539584.jpg');
        setBio('Lead Developer & Spiritual Seeker');
      } else {
        loadProfile();
      }
    } else {
      const localName = localStorage.getItem('profileName') || 'Guest Jain Soul';
      const localBio = localStorage.getItem('profileBio') || 'Sadharmik Devotee';
      const localPic = localStorage.getItem('profilePic') || '';
      setName(localName);
      setBio(localBio);
      setProfilePic(localPic);
    }
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
            await setDoc(doc(db, 'jain_community', user.uid), {
              photoURL: base64String,
              updatedAt: Date.now()
            }, { merge: true });
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
        await setDoc(doc(db, 'jain_community', user.uid), {
          displayName: name,
          updatedAt: Date.now()
        }, { merge: true });
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
            <div className="w-full h-full rounded-full bg-white dark:bg-[#0A0A0A] overflow-hidden flex items-center justify-center border-4 border-white dark:border-[#0A0A0A]">
              <img src="https://i.ibb.co/Myg19RW6/1000539584.jpg" alt="Developer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-wide drop-shadow-none dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Samil Jain</h2>
          </div>
          <p className="text-[#FF8A65] font-bold tracking-widest text-[10px] uppercase mb-6 drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(255,138,101,0.5)]">Lead Developer & Spiritual Seeker</p>
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

      {/* Our Jain Community Section */}
      <div id="jain-community-section" className="mt-8 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 shadow-sm dark:shadow-[0_0_30px_rgba(255,109,0,0.05)] border border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Section title, subtitle & total count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-6 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-wide flex items-center gap-2 drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
              <Users size={24} className="text-[#FF6D00]" />
              OUR JAIN COMMUNITY
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">Connecting Sadharmik Devotees Worldwide • जैन समाज डायरेक्टरी</p>
          </div>
          <div className="bg-[#FF6D00]/10 border border-[#FF6D00]/20 rounded-2xl px-4 py-2 text-center sm:text-right shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6D00] block">Connected Souls</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">{totalCount} Devotees</span>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search community members by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]/50 transition-colors placeholder-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Grid of members */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
          {communityMembers
            .filter(m => m.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((member) => {
              const isDev = member.isDeveloper || member.email?.toLowerCase() === 'samiljain0111@gmail.com';
              return (
                <div 
                  key={member.uid || member.id}
                  className={cn(
                    "p-4 rounded-3xl border flex items-center justify-between gap-4 transition-all relative overflow-hidden group",
                    isDev 
                      ? "bg-gradient-to-r from-amber-50/95 to-amber-100/95 dark:from-amber-950/20 dark:to-transparent border-amber-300 dark:border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                      : "bg-white dark:bg-[#181818] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                  )}
                >
                  {isDev && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black tracking-widest px-2.5 py-1 rounded-bl-xl uppercase select-none">
                      Developer
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-white/5 shrink-0 border-2",
                      isDev ? "border-amber-400 dark:border-amber-500" : "border-gray-200 dark:border-white/10"
                    )}>
                      {member.photoURL ? (
                        <img referrerPolicy="no-referrer" src={member.photoURL} alt={member.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-[#FF6D00] font-black text-base select-none">
                          {(member.displayName || 'J')[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                          {member.displayName}
                        </span>
                        {isDev && (
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shrink-0 font-bold select-none" title="Developer & Founder">👑</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold truncate mt-0.5">
                        {isDev ? 'Lead Developer & Creator' : 'Sadharmik Companion'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Connection links */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(() => {
                      const isMe = user && (member.uid === user.uid || member.id === user.uid);
                      return (
                        <>
                          {isMe && (
                            <button 
                              onClick={() => {
                                setWhatsappInput(member.whatsapp || '');
                                setInstaInput(member.instagram || '');
                                setShowEditLinksModal(true);
                              }}
                              className="px-3 py-1.5 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] dark:text-[#FFD54F] border border-[#FF6D00]/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
                              title="Edit WhatsApp & Instagram Links"
                            >
                              <Edit2 size={12} />
                              Edit Links
                            </button>
                          )}
                          
                          {member.whatsapp && (
                            <a 
                              href={`https://wa.me/${member.whatsapp}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 hover:scale-110 transition-transform flex items-center justify-center"
                              title="Connect on WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </a>
                          )}
                          {member.instagram && (
                            <a 
                              href={`https://instagram.com/${member.instagram}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 hover:scale-110 transition-transform flex items-center justify-center"
                              title="Connect on Instagram"
                            >
                              <Instagram size={16} />
                            </a>
                          )}
                          {!isMe && !member.whatsapp && !member.instagram && (
                            <span className="text-[9px] font-bold text-gray-300 dark:text-gray-600 italic select-none">
                              No links
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
        </div>
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

      {/* Edit Community Card Links Modal */}
      {showEditLinksModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_50px_rgba(255,109,0,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-5 relative z-10 border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-[#FF6D00]" />
                  Edit My Connection Links
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
                  Configure WhatsApp or Instagram links on your card
                </p>
              </div>
              <button 
                onClick={() => setShowEditLinksModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCommunityCard} className="space-y-4 relative z-10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+</span>
                  <input 
                    type="tel" 
                    placeholder="919876543210" 
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-6 pr-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
                  />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Include country code (e.g. 91 for India) without '+' or spaces</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Instagram Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">@</span>
                  <input 
                    type="text" 
                    placeholder="username" 
                    value={instaInput}
                    onChange={(e) => setInstaInput(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                    className="w-full pl-7 pr-4 py-2.5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <button 
                    type="submit" 
                    disabled={isUpdatingCommunity}
                    className="flex-1 py-2.5 bg-[#FF6D00] text-white rounded-xl text-xs font-black tracking-wider hover:bg-[#FF8A00] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm uppercase"
                  >
                    {isUpdatingCommunity ? 'Saving...' : 'Save Changes'}
                    <Check size={14} />
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEditLinksModal(false);
                      handleDeleteAccount();
                    }}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-[11px] font-extrabold tracking-wider transition-colors uppercase border border-rose-500/20"
                  >
                    Delete Card
                  </button>
                </div>

                {communityStatusMsg === 'success' && (
                  <span className="text-xs font-bold text-emerald-500 text-center animate-pulse mt-1">
                    ✓ Saved successfully!
                  </span>
                )}
                {communityStatusMsg === 'error' && (
                  <span className="text-xs font-bold text-rose-500 text-center mt-1">
                    ✕ Failed to save links
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 w-full max-w-md shadow-xl dark:shadow-[0_0_40px_rgba(255,109,0,0.2)] relative overflow-hidden my-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-gray-100 dark:border-white/5 pb-3">
              <h2 className="text-xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                <Settings className="text-[#FF6D00]" />
                {user ? 'Account & Settings' : 'Settings & Login'}
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
                  <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">Push Notifications</h3>
                  <p className="text-[10px] text-gray-500">Receive daily vichaar and updates</p>
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
                  <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider">Offline Mode</h3>
                  <p className="text-[10px] text-gray-500">Download content for offline use</p>
                </div>
                <div 
                  onClick={() => setOfflineEnabled(!offlineEnabled)}
                  className={cn("w-12 h-6 rounded-full relative cursor-pointer transition-colors", offlineEnabled ? "bg-[#FF6D00]" : "bg-gray-300 dark:bg-white/10")}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", offlineEnabled ? "right-1" : "left-1 bg-gray-400")}></div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-2">Language Preference</h3>
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

              {/* Secure Login & Account Creation when NOT Logged In */}
              {!user ? (
                <div className="p-5 bg-gradient-to-br from-[#FF6D00]/5 to-[#FFD54F]/5 dark:from-[#FF6D00]/10 dark:to-transparent rounded-[2rem] border border-[#FF6D00]/20 text-left relative overflow-hidden">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-[#FF6D00]" />
                    Join Jain Community
                  </h3>
                  
                  {/* Auth Method Tabs */}
                  <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-white/5 pb-3">
                    <button
                      type="button"
                      onClick={() => { setAuthTab('signin'); setAuthError(''); setAuthSuccessMsg(''); }}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                        authTab === 'signin'
                          ? "bg-[#FF6D00] text-white shadow-sm"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-700 bg-transparent"
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthTab('signup'); setAuthError(''); setAuthSuccessMsg(''); }}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                        authTab === 'signup'
                          ? "bg-[#FF6D00] text-white shadow-sm"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-700 bg-transparent"
                      )}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Error or Success Messages */}
                  {authError && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-bold leading-relaxed">
                      ✕ {authError}
                    </div>
                  )}
                  {authSuccessMsg && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold leading-relaxed">
                      ✓ {authSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleCustomAuthSubmit} className="space-y-4">
                    {authTab === 'signup' && (
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Your Full Name (नाम)</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your name"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Email Address (ईमेल)</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Password (पासवर्ड)</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00] transition-colors"
                      />
                    </div>

                    <div className="pt-2 flex flex-col items-stretch justify-between gap-4">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 bg-[#FF6D00] hover:bg-[#FF8A00] text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all disabled:opacity-50 text-center"
                      >
                        {authLoading ? 'Please Wait...' : authTab === 'signup' ? 'Create & Join' : 'Sign In Now'}
                      </button>
                      
                      {/* Google Sign-in Alternative */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={async () => {
                            setAuthError('');
                            setAuthSuccessMsg('');
                            try {
                              await login();
                              setShowSettings(false);
                            } catch (err) {
                              // Handled inside AuthContext
                            }
                          }}
                          className="text-[10px] font-bold text-[#FF6D00] hover:underline uppercase tracking-wider block mx-auto"
                        >
                          Or Login with Google (Popup)
                        </button>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 block mt-1 leading-tight">
                          *Google uses secure auth proxy. Use Email above to keep address-bar completely private.
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Logout Row */}
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-extrabold text-sm">Logout</h3>
                      <p className="text-[10px] text-gray-500">Sign out of your session</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        logout();
                      }}
                      className="px-3.5 py-1.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors shrink-0"
                    >
                      Logout
                    </button>
                  </div>

                  {/* Delete Account Row */}
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-950/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-rose-600 dark:text-rose-400 font-extrabold text-sm">Delete Account</h3>
                      <p className="text-[10px] text-gray-500">Erase profile & remove from directory</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        handleDeleteAccount();
                      }}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
