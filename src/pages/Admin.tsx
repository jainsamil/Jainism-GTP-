import { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Users, BookOpen, Settings, 
  PlusCircle, Trash2, Edit2, Save, X, ChevronRight,
  Database, HelpCircle, History, Calendar, Star,
  RefreshCw, CheckCircle2, ArrowLeft, LogOut, BarChart3,
  PlaySquare, Quote, MessageCircle, HelpCircle as QuizIcon,
  Sparkles, Hotel, Store, ShoppingBag, Package
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, getDocs, addDoc, updateDoc, onSnapshot,
  deleteDoc, doc, query, orderBy, writeBatch, setDoc
} from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { knowledgeData } from '../data/knowledgeBase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import AdminAiAgent from '../components/AdminAiAgent';

type CollectionType = 'dashboard' | 'analytics' | 'ai_agent' | 'knowledge' | 'tirthankars' | 'aagams' | 'history' | 'festivals' | 'classes' | 'exams' | 'saints' | 'vichaar' | 'quiz' | 'media' | 'panchang' | 'settings' | 'dharamshala_bookings' | 'jain_stores' | 'jain_products' | 'jain_orders';

import { tirthankarsData } from '../data/tirthankarsData';
import { aagamsData } from '../data/aagamsData';
import { historyData } from '../data/historyData';
import { festivalsData } from '../data/festivalsData';
import { fallbackMediaData } from '../data/mediaData';

const renderFieldVal = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'object') {
    return val.hi || val.en || Object.values(val)[0] || '';
  }
  return String(val);
};

export default function AdminPage() {
  const { user, role, loading, login } = useAuth();
  const navigate = useNavigate();
  const [activeCollection, setActiveCollection] = useState<CollectionType>('dashboard');
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [fetchLoading, setFetchLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: password })
      });
      const data = await response.json();
      if (response.ok && data.verified) {
        localStorage.setItem('adminAccess', 'true');
        setHasAdminAccess(true);
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid passcode. Access denied.');
      }
    } catch (err) {
      setLoginError('Security gateway offline. Please try again.');
    }
  };
  
  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<any>({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    recentSignups: []
  });

  const [hasAdminAccess, setHasAdminAccess] = useState(localStorage.getItem('adminAccess') === 'true');

  useEffect(() => {
    if (hasAdminAccess) {
      if (activeCollection === 'analytics') {
        fetchAnalytics();
      } else if (activeCollection !== 'dashboard' && activeCollection !== 'ai_agent') {
        setFetchLoading(true);
        const q = query(collection(db, activeCollection));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          const deletedIds = new Set(rawData.filter(item => item.deleted === true).map(item => item.id));
          const data = rawData.filter(item => item.deleted !== true);
          
          // Merge logic: ensure user sees all website data by default
          const fallback = getFallbackCollectionData(activeCollection).filter(fbItem => !deletedIds.has(fbItem.id));
          const dataMap = new Map(data.map(item => [item.id, item]));
          
          const mergedList = fallback.map(fbItem => {
            if (dataMap.has(fbItem.id)) {
              const docOverride = dataMap.get(fbItem.id);
              dataMap.delete(fbItem.id);
              return docOverride;
            }
            return fbItem;
          });
          
          const finalItems = [...mergedList, ...Array.from(dataMap.values())];
          setItems(finalItems);
          setFetchLoading(false);
        }, (error) => {
          console.error('Error fetching items:', error);
          setFetchLoading(false);
        });
        return () => unsubscribe();
      }
    }
  }, [role, activeCollection]);

  const fetchAnalytics = async () => {
    setFetchLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'pathshala_users'));
      const users = usersSnapshot.docs.map(doc => doc.data());
      
      const students = users.filter(u => (u.role === 'student' || !u.role)).length;
      const teachers = users.filter(u => u.role === 'teacher').length;
      
      setAnalyticsData({
        totalUsers: users.length,
        students,
        teachers,
        recentSignups: users.slice(0, 5)
      });
    } catch (error) {
      console.warn("Analytics fetch failed, using fallback:", error);
      // Clean fallback
      setAnalyticsData({
        totalUsers: 0,
        students: 0,
        teachers: 0,
        recentSignups: []
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeCollection === 'settings') {
        // Always use 'config' as the ID for settings
        const settingsRef = doc(db, 'settings', 'config');
        await setDoc(settingsRef, formData);
      } else if (isEditing) {
        // Strip the id field from the written payload to prevent duplicated fields
        const { id, ...cleanData } = formData;
        await setDoc(doc(db, activeCollection, isEditing), cleanData, { merge: true });
      } else {
        await addDoc(collection(db, activeCollection), formData);
      }
      setIsEditing(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Check console for details.');
    }
  };

  const seedData = async () => {
    if (!window.confirm('This will add sample data to your database. Continue?')) return;
    
    setSeeding(true);
    setSeedStatus('Seeding Knowledge...');
    
    try {
      const batch = writeBatch(db);
      
      // Sample Knowledge Data
      const knowledge = knowledgeData;

      for (const item of knowledge) {
        const docRef = doc(collection(db, 'knowledge'));
        batch.set(docRef, item);
      }

      setSeedStatus('Seeding Tirthankars...');
      for (const item of tirthankarsData) {
        const docRef = doc(collection(db, 'tirthankars'));
        batch.set(docRef, item);
      }

      setSeedStatus('Seeding Aagams...');
      for (const item of aagamsData) {
        const docRef = doc(collection(db, 'aagams'));
        batch.set(docRef, item);
      }

      setSeedStatus('Seeding History...');
      for (const item of historyData) {
        const docRef = doc(collection(db, 'history'));
        batch.set(docRef, item);
      }

      setSeedStatus('Seeding Festivals...');
      for (const item of festivalsData) {
        const docRef = doc(collection(db, 'festivals'));
        batch.set(docRef, item);
      }

      setSeedStatus('Seeding Settings...');
      const settings = {
        quizEnabled: true,
        mediaEnabled: true
      };
      const settingsRef = doc(db, 'settings', 'config');
      batch.set(settingsRef, settings);

      setSeedStatus('Seeding New Sections...');
      const sampleSaints = [
        { name: { hi: 'आचार्य श्री विद्यासागर जी', en: 'Acharya Shri Vidyasagar Ji' }, type: 'Acharya', desc: { hi: 'महान दिगंबर जैन आचार्य', en: 'Great Digambar Jain Acharya' }, image: 'https://picsum.photos/seed/saint1/400/400' },
        { name: { hi: 'आचार्य श्री शांतिसागर जी', en: 'Acharya Shri Shantisagar Ji' }, type: 'Acharya', desc: { hi: 'प्रथम दिगंबर जैन आचार्य (20वीं सदी)', en: 'First Digambar Jain Acharya (20th Century)' }, image: 'https://picsum.photos/seed/saint2/400/400' }
      ];
      for (const item of sampleSaints) {
        const docRef = doc(collection(db, 'saints'));
        batch.set(docRef, item);
      }

      const sampleVichaar = [
        { hi: 'अहिंसा परमो धर्मः।', en: 'Non-violence is the highest religion.', source: 'Jain Agamas' },
        { hi: 'जीयो और जीने दो।', en: 'Live and let live.', source: 'Lord Mahavira' }
      ];
      for (const item of sampleVichaar) {
        const docRef = doc(collection(db, 'vichaar'));
        batch.set(docRef, item);
      }

      const sampleMedia = [
        { title: 'Namokar Mantra', type: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', artist: 'Jain Singer', duration: '05:30', thumbnail: 'https://picsum.photos/seed/media1/400/400' },
        { title: 'Bhaktamar Stotra', type: 'bhajans', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', artist: 'Jain Singer', duration: '15:00', thumbnail: 'https://picsum.photos/seed/media2/400/400' }
      ];
      for (const item of sampleMedia) {
        const docRef = doc(collection(db, 'media'));
        batch.set(docRef, item);
      }

      const sampleQuiz = [
        { q: { hi: 'जैन धर्म के प्रथम तीर्थंकर कौन हैं?', en: 'Who is the first Tirthankara of Jainism?' }, options: { hi: ['भगवान महावीर', 'भगवान आदिनाथ', 'भगवान पार्श्वनाथ', 'भगवान शांतिनाथ'], en: ['Lord Mahavira', 'Lord Adinath', 'Lord Parshvanath', 'Lord Shantinath'] }, answer: 1, explanation: { hi: 'भगवान आदिनाथ (ऋषभदेव) जैन धर्म के प्रथम तीर्थंकर हैं।', en: 'Lord Adinath (Rishabhdev) is the first Tirthankara of Jainism.' } }
      ];
      for (const item of sampleQuiz) {
        const docRef = doc(collection(db, 'quiz'));
        batch.set(docRef, item);
      }

      await batch.commit();
      setSeedStatus('Success!');
      setTimeout(() => {
        setSeedStatus(null);
      }, 2000);
    } catch (error) {
      console.error('Error seeding data:', error);
      setSeedStatus('Error seeding data');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const fallback = getFallbackCollectionData(activeCollection);
      const isFallback = id.startsWith('fb_') || id.startsWith('mov') || id.startsWith('web') || id.startsWith('story') || id.startsWith('bhajan') || id.startsWith('book') || id.startsWith('seed_') || fallback.some(item => item.id === id);
      
      if (isFallback) {
        await setDoc(doc(db, activeCollection, id), { deleted: true });
      } else {
        await deleteDoc(doc(db, activeCollection, id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const startEdit = (item: any) => {
    setIsEditing(item.id);
    setFormData(item);
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData(getInitialFormData(activeCollection));
  };

  const getInitialFormData = (type: CollectionType) => {
    switch (type) {
      case 'knowledge':
        return { question: { hi: '', en: '' }, jainReason: { hi: '', en: '' }, scienceReason: { hi: '', en: '' }, category: '' };
      case 'tirthankars':
        return { name: { hi: '', en: '' }, kaal: 'Present', details: { hi: '', en: '' }, symbol: { hi: '', en: '' }, color: '', kalyanaks: [] };
      case 'aagams':
        return { category: 'Pujan', title: '', content: '' };
      case 'history':
        return { title: { hi: '', en: '' }, content: { hi: '', en: '' }, image: '' };
      case 'festivals':
        return { name: { hi: '', en: '' }, date: '', description: { hi: '', en: '' }, tithi: '' };
      case 'classes':
        return { title: '', subject: '', teacherName: '', link: '', active: true };
      case 'exams':
        return { title: '', duration: 30, questions: [] };
      case 'settings':
        return { quizEnabled: true, mediaEnabled: true };
      case 'saints':
        return { name: { hi: '', en: '' }, type: 'Acharya', details: { hi: '', en: '' }, image: '' };
      case 'vichaar':
        return { hi: '', en: '', source: '' };
      case 'quiz':
        return { question: { hi: '', en: '' }, options: { hi: ['', '', '', ''], en: ['', '', '', ''] }, correctOptionIndex: 0, explanation: { hi: '', en: '' } };
      case 'media':
        return { 
          title: { en: '', hi: '' }, 
          description: { en: '', hi: '' }, 
          type: 'movies', 
          url: '', 
          videoUrl: '', 
          artist: '', 
          author: '', 
          duration: '', 
          thumbnail: '', 
          category: '', 
          year: '2026', 
          rating: 4.9, 
          tags: [] 
        };
      case 'panchang':
        return { tithi: '', paksha: '', festivals: [], kalyanak: [], acharyaDarpan: [], shubhMuhurat: [], vrat: [], sunrise: '', sunset: '' };
      case 'dharamshala_bookings':
        return { pilgrimName: '', contact: '', checkInDate: '', roomType: 'Deluxe Room', guestsCount: 2, status: 'pending', priceCollected: 250, dharamshalaName: 'Shree Bees Panthi Kothi Dharamshala', createdAt: new Date().toISOString() };
      case 'jain_stores':
        return { storeName: '', vendorName: '', email: '', phone: '', description: '', status: 'pending', createdAt: new Date().toISOString() };
      case 'jain_products':
        return { title: '', description: '', price: 100, category: 'Books', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', status: 'approved', contactNo: '', storeName: 'Digambar Jin-Vani Prakashan', storeId: 'store_digambar_prakashan', createdAt: new Date().toISOString() };
      case 'jain_orders':
        return { customerName: '', customerPhone: '', customerAddress: '', shippingMethod: 'Standard Ahimsa Eco-Delivery', paymentMethod: 'UPI', upiTransactionId: '', totalAmount: 100, status: 'pending', items: [], createdAt: new Date().toISOString() };
      default:
        return {};
    }
  };

  const getFallbackCollectionData = (coll: CollectionType): any[] => {
    switch (coll) {
      case 'knowledge':
        return knowledgeData.map((item: any, idx: number) => ({ id: 'fb_kb_' + idx, ...item }));
      case 'tirthankars':
        return tirthankarsData.map((item: any, idx: number) => ({ id: 'fb_t_' + idx, ...item }));
      case 'aagams':
        return aagamsData.map((item: any, idx: number) => ({ id: 'fb_ag_' + idx, ...item }));
      case 'history':
        return historyData.map((item: any, idx: number) => ({ id: 'fb_h_' + idx, ...item }));
      case 'festivals':
        return festivalsData.map((item: any, idx: number) => ({ id: 'fb_f_' + idx, ...item }));
      case 'saints':
        return [
          {
            id: 'fb_saint_1',
            name: { en: "Acharya Kundakunda Dev", hi: "आचार्य कुंदकुंद देव" },
            sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
            type: "Acharya",
            desc: { en: "The highly revered philosopher-monk who authored foundational treatises like Samayasara.", hi: "समयसार, प्रवचनसार आदि ग्रंथों के प्रणेता।" },
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
          },
          {
            id: 'fb_saint_2',
            name: { en: "Acharya Samantabhadra", hi: "आचार्य समंतभद्र" },
            sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
            type: "Acharya",
            desc: { en: "The master logician, debater, and creator of the Anekantavada logic school.", hi: "रत्नकरंड श्रावकाचार के प्रणेता।" },
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
          },
          {
            id: 'fb_saint_3',
            name: { en: "Prathamacharya Shri Shantisagar Ji", hi: "आचार्य शांतिसागर जी" },
            sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
            type: "Acharya",
            desc: { en: "The historic pioneer who revived the Digambara ascetic tradition.", hi: "बीसвий सदी के प्रथमाचार्य।" },
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
          },
          {
            id: 'fb_saint_4',
            name: { en: "Acharya Shri Vidyasagar Ji Maharaj", hi: "आचार्य विद्यासागर जी" },
            sect: { en: "Digambara (दिगंबर)", hi: "दिगंबर परंपरा" },
            type: "Acharya",
            desc: { en: "The legendary, fully detached 21st-century Digambara Acharya.", hi: "महान तपोमुनि, संयम एवं अहिंसा के प्रतीक।" },
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300"
          }
        ];
      case 'vichaar':
        return [
          { id: 'fb_v_1', hi: "अहिंसा परमो धर्मः।", en: "Non-violence is the highest religion.", source: "महान शास्त्र ग्रंथ" },
          { id: 'fb_v_2', hi: "परस्परोपग्रहो जीवाणाम्।", en: "Souls render service to one another.", source: "तत्त्वार्थ सूत्र (5.21)" },
          { id: 'fb_v_3', hi: "जीयो और जीने दो।", en: "Live and let live.", source: "भगवान महावीर" }
        ];
      case 'media':
        return [
          ...fallbackMediaData.movies.map((m: any) => ({ ...m })),
          ...fallbackMediaData.webseries.map((w: any) => ({ ...w })),
          ...fallbackMediaData.digital_stories.map((ds: any) => ({ ...ds })),
          ...fallbackMediaData.devotional_videos.map((dv: any) => ({ ...dv })),
          ...fallbackMediaData.stories.map((s: any) => ({ ...s })),
          ...fallbackMediaData.bhajans.map((b: any) => ({ ...b })),
          ...fallbackMediaData.audiobooks.map((a: any) => ({ ...a }))
        ];
      case 'quiz':
        return [
          {
            id: 'fb_q_1',
            q: { hi: 'जैन धर्म के प्रथम तीर्थंकर कौन हैं?', en: 'Who is the first Tirthankara of Jainism?' },
            options: { 
              hi: ['भगवान महावीर', 'भगवान आदिनाथ', 'भगवान पार्श्वनाथ', 'भगवान शांतिनाथ'], 
              en: ['Lord Mahavira', 'Lord Adinath', 'Lord Parshvanath', 'Lord Shantinath'] 
            },
            answer: 1,
            explanation: { 
              hi: 'भगवान आदिनाथ (ऋषभदेव) वर्तमान चौबीसी के प्रथम तीर्थंकर हैं।', 
              en: 'Lord Adinath (Rishabhdev) is the first Tirthankara of current era.' 
            }
          }
        ];
      case 'classes':
        return [];
      case 'exams':
        return [];
      case 'settings':
        return [];
      case 'panchang':
        return [];
      default:
        return [];
    }
  };

    if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative transition-colors duration-300">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-3 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 rounded-full text-gray-800 dark:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-gray-200 dark:border-white/10 w-full max-w-md text-center shadow-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-lg">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4">ADMIN ACCESS</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-semibold">Enter admin password or sign-in to continue.</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-4 text-gray-900 dark:text-white focus:border-[#FF6D00]/50 outline-none text-center tracking-widest font-bold"
              required
            />
            {loginError && <p className="text-red-500 text-sm font-semibold">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-lg shadow-lg hover:scale-105 transition-transform"
            >
              LOGIN WITH PASSWORD
            </button>
          </form>
        </div>
      </div>
    );
  }

  const collections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai_agent', label: 'AI Developer Agent', icon: Sparkles },
    { id: 'knowledge', label: 'Knowledge (FAQs)', icon: HelpCircle },
    { id: 'tirthankars', label: 'Tirthankars', icon: Star },
    { id: 'aagams', label: 'Aagams', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'festivals', label: 'Festivals', icon: Calendar },
    { id: 'saints', label: 'Saints', icon: Users },
    { id: 'vichaar', label: 'Vichaar', icon: Quote },
    { id: 'quiz', label: 'Quiz', icon: QuizIcon },
    { id: 'media', label: 'Media', icon: PlaySquare },
    { id: 'panchang', label: 'Panchang', icon: Calendar },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'exams', label: 'Exams', icon: CheckCircle2 },
    { id: 'dharamshala_bookings', label: 'Dharamshala Bookings', icon: Hotel },
    { id: 'jain_stores', label: 'Store Vendors', icon: Store },
    { id: 'jain_products', label: 'Store Products', icon: ShoppingBag },
    { id: 'jain_orders', label: 'Store Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as { id: CollectionType; label: string; icon: any }[];

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 pb-24 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 pt-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3">
          <LayoutDashboard className="text-[#FF6D00]" size={28} />
          ADMIN DASHBOARD
        </h1>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <button 
            onClick={seedData}
            disabled={seeding}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[#FF6D00] dark:text-[#FFD54F] text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-50 shadow-sm"
          >
            {seeding ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
            <span className="hidden sm:inline">{seedStatus || 'Seed Sample Data'}</span>
            <span className="sm:hidden">{seedStatus || 'Seed Data'}</span>
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 p-2 px-4 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-xs font-black shadow-sm cursor-pointer"
              title="Back to App"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to App</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.displayName}</p>
              <p className="text-[10px] text-[#FFD54F] font-black uppercase tracking-widest">Administrator</p>
            </div>
            <img src={user?.photoURL || "https://i.ibb.co/Myg19RW6/1000539584.jpg"} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#FF6D00] object-cover" alt="Admin" />
            <button 
              onClick={() => {
                localStorage.removeItem('adminAccess');
                setHasAdminAccess(false);
                auth.signOut();
                navigate('/');
              }}
              className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 flex lg:flex-col snap-x">
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2 hidden lg:block">Collections</h2>
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => {
                setActiveCollection(col.id);
                setIsAdding(false);
                setIsEditing(null);
              }}
              className={cn(
                "shrink-0 lg:w-full flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold transition-all duration-300 group snap-start",
                activeCollection === col.id 
                  ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black shadow-lg scale-[1.02]" 
                  : "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md text-gray-700 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/5"
              )}
            >
              <col.icon size={18} className={cn(activeCollection === col.id ? "text-black" : "text-[#FF6D00]")} />
              <span className="whitespace-nowrap">{col.label}</span>
              <ChevronRight size={16} className={cn("ml-auto transition-transform hidden lg:block", activeCollection === col.id ? "rotate-90" : "group-hover:translate-x-1")} />
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {activeCollection === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] p-8 rounded-[2rem] text-black shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2">Welcome, {user?.displayName}!</h2>
                  <p className="font-bold opacity-80">Manage your Jainism GPT content and settings from here.</p>
                </div>
              </div>

              {collections.filter(c => c.id !== 'dashboard').map(col => (
                <button
                  key={col.id}
                  onClick={() => setActiveCollection(col.id)}
                  className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 transition-all group text-left relative overflow-hidden shadow-sm dark:shadow-none"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/10 transition-all" />
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center text-[#FF6D00] mb-6 group-hover:scale-110 transition-transform">
                    <col.icon size={28} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Manage {col.label}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Click to view and edit items</p>
                </button>
              ))}
            </div>
          ) : activeCollection === 'analytics' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center text-[#FF6D00] mb-4">
                      <Users size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{analyticsData.totalUsers}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Users</p>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFD54F]/10 flex items-center justify-center text-[#FFD54F] mb-4">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{analyticsData.students}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Students</p>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676] mb-4">
                      <Star size={24} />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{analyticsData.teachers}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Teachers</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">User Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Students', value: analyticsData.students || 1 },
                            { name: 'Teachers', value: analyticsData.teachers || 1 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#FFD54F" />
                          <Cell fill="#FF6D00" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest">Recent Activity</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Mon', users: 4 },
                        { name: 'Tue', users: 7 },
                        { name: 'Wed', users: 5 },
                        { name: 'Thu', users: 12 },
                        { name: 'Fri', users: 8 },
                        { name: 'Sat', users: 15 },
                        { name: 'Sun', users: 10 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(120,120,120,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(120,120,120,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="users" fill="#FF6D00" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : activeCollection === 'ai_agent' ? (
            <AdminAiAgent />
          ) : (
            <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md rounded-[2rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-wide flex items-center gap-2">
                  <Database size={20} className="text-[#FFD54F]" />
                  MANAGE {activeCollection.toUpperCase()}
                </h2>
                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">{items.length} Items Total</p>
              </div>
              <button 
                onClick={startAdd}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6D00] text-black rounded-xl font-black text-xs hover:bg-[#FFD54F] transition-colors shadow-lg"
              >
                <PlusCircle size={16} /> ADD NEW
              </button>
            </div>

            <div className="p-6">
              {fetchLoading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-[#FF6D00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Data...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between group hover:border-[#FF6D00]/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                          {activeCollection === 'aagams' ? renderFieldVal(item.title) : 
                           activeCollection === 'settings' ? 'Global App Settings' :
                           activeCollection === 'classes' ? renderFieldVal(item.title) :
                           activeCollection === 'exams' ? renderFieldVal(item.title) :
                           activeCollection === 'media' ? renderFieldVal(item.title) :
                           activeCollection === 'vichaar' ? renderFieldVal(item.hi) :
                           activeCollection === 'quiz' ? renderFieldVal(item.q?.hi) :
                           activeCollection === 'panchang' ? renderFieldVal(item.date) :
                           activeCollection === 'dharamshala_bookings' ? `${item.pilgrimName} (Rooms: ${item.guestsCount || 1})` :
                           activeCollection === 'jain_stores' ? renderFieldVal(item.storeName) :
                           activeCollection === 'jain_products' ? renderFieldVal(item.title) :
                           activeCollection === 'jain_orders' ? `Order ${item.id} - ${item.customerName}` :
                           (renderFieldVal(item.name?.hi || item.name) || renderFieldVal(item.question?.hi || item.question) || renderFieldVal(item.title?.hi || item.title) || 'Untitled Item')}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-widest">
                          {activeCollection === 'aagams' ? renderFieldVal(item.category) : 
                           activeCollection === 'classes' ? renderFieldVal(item.subject) :
                           activeCollection === 'exams' ? `${renderFieldVal(item.duration)} Mins` :
                           activeCollection === 'media' ? renderFieldVal(item.type) :
                           activeCollection === 'saints' ? renderFieldVal(item.type) :
                           activeCollection === 'vichaar' ? renderFieldVal(item.source) :
                           activeCollection === 'panchang' ? renderFieldVal(item.tithi) :
                           activeCollection === 'dharamshala_bookings' ? `CheckIn: ${renderFieldVal(item.checkInDate)} • Paid: ₹${renderFieldVal(item.priceCollected)} • [${renderFieldVal(item.status || 'pending')}]` :
                           activeCollection === 'jain_stores' ? `Vendor: ${renderFieldVal(item.vendorName)} • [${renderFieldVal(item.status || 'pending')}]` :
                           activeCollection === 'jain_products' ? `Price: ₹${renderFieldVal(item.price)} • Store: ${renderFieldVal(item.storeName || 'N/A')} • [${renderFieldVal(item.status || 'approved')}]` :
                           activeCollection === 'jain_orders' ? `Total: ₹${renderFieldVal(item.totalAmount)} • Phone: ${renderFieldVal(item.customerPhone)} • [${renderFieldVal(item.status || 'pending')}]` :
                           renderFieldVal(item.category || item.kaal || 'General')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => startEdit(item)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[#FF6D00] dark:hover:text-[#FFD54F] hover:bg-[#FF6D00]/10 dark:hover:bg-[#FFD54F]/10 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[#FF1744] dark:hover:text-[#FF1744] hover:bg-[#FF1744]/10 dark:hover:bg-[#FF1744]/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                      No items found in this collection
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="admin-modal bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-3">
                {isEditing ? <Edit2 className="text-[#FFD54F]" stroke="currentColor" /> : <PlusCircle className="text-[#00E676]" stroke="currentColor" />}
                {isEditing ? 'EDIT ITEM' : 'ADD NEW ITEM'}
              </h2>
              <button 
                onClick={() => { setIsAdding(false); setIsEditing(null); }}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleSave} className="space-y-8 admin-form">
                {/* Dynamic Form Fields based on activeCollection */}
                {activeCollection === 'knowledge' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Question</h3>
                      <input 
                        type="text" placeholder="Hindi" required
                        value={formData.question?.hi || ''}
                        onChange={e => setFormData({...formData, question: {...formData.question, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                      <input 
                        type="text" placeholder="English" required
                        value={formData.question?.en || ''}
                        onChange={e => setFormData({...formData, question: {...formData.question, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Category</h3>
                      <input 
                        type="text" placeholder="e.g. Daily Life"
                        value={formData.category || ''}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Jain Reason</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.jainReason?.hi || ''}
                        onChange={e => setFormData({...formData, jainReason: {...formData.jainReason, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.jainReason?.en || ''}
                        onChange={e => setFormData({...formData, jainReason: {...formData.jainReason, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Science Reason</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.scienceReason?.hi || ''}
                        onChange={e => setFormData({...formData, scienceReason: {...formData.scienceReason, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.scienceReason?.en || ''}
                        onChange={e => setFormData({...formData, scienceReason: {...formData.scienceReason, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'aagams' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest mb-2">Category</label>
                        <select 
                          value={formData.category || 'Pujan'}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        >
                          {['Pujan', 'Stuti', 'Vidhan', 'Chalisa', 'Bhajan', 'Aarti'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest mb-2">Title</label>
                        <input 
                          type="text" required
                          value={formData.title || ''}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest mb-2">Content</label>
                      <textarea 
                        required
                        value={formData.content || ''}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-64 font-mono"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'tirthankars' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Name</h3>
                      <input 
                        type="text" placeholder="Hindi" required
                        value={formData.name?.hi || ''}
                        onChange={e => setFormData({...formData, name: {...formData.name, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                      <input 
                        type="text" placeholder="English" required
                        value={formData.name?.en || ''}
                        onChange={e => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Era (Kaal)</h3>
                      <select 
                        value={formData.kaal || 'Present'}
                        onChange={e => setFormData({...formData, kaal: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      >
                        <option value="Past">Past (Bhoot)</option>
                        <option value="Present">Present (Vartaman)</option>
                        <option value="Future">Future (Bhavishya)</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Symbol</h3>
                      <input 
                        type="text" placeholder="Hindi" required
                        value={formData.symbol?.hi || ''}
                        onChange={e => setFormData({...formData, symbol: {...formData.symbol, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                      <input 
                        type="text" placeholder="English" required
                        value={formData.symbol?.en || ''}
                        onChange={e => setFormData({...formData, symbol: {...formData.symbol, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Color</h3>
                      <input 
                        type="text" placeholder="e.g. Gold, Blue, Red"
                        value={formData.color || ''}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Details</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.details?.hi || ''}
                        onChange={e => setFormData({...formData, details: {...formData.details, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-32"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.details?.en || ''}
                        onChange={e => setFormData({...formData, details: {...formData.details, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-32"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'history' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Title</h3>
                        <input 
                          type="text" placeholder="Hindi" required
                          value={formData.title?.hi || ''}
                          onChange={e => setFormData({...formData, title: {...formData.title, hi: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                        <input 
                          type="text" placeholder="English" required
                          value={formData.title?.en || ''}
                          onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Image URL</h3>
                        <input 
                          type="text" placeholder="https://..."
                          value={formData.image || ''}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Content</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.content?.hi || ''}
                        onChange={e => setFormData({...formData, content: {...formData.content, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-48"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.content?.en || ''}
                        onChange={e => setFormData({...formData, content: {...formData.content, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-48"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'festivals' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Name</h3>
                        <input 
                          type="text" placeholder="Hindi" required
                          value={formData.name?.hi || ''}
                          onChange={e => setFormData({...formData, name: {...formData.name, hi: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                        <input 
                          type="text" placeholder="English" required
                          value={formData.name?.en || ''}
                          onChange={e => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Date & Tithi</h3>
                        <input 
                          type="text" placeholder="Date (e.g. 14 April)" required
                          value={formData.date || ''}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                        <input 
                          type="text" placeholder="Tithi (e.g. Chaitra Shukla 13)"
                          value={formData.tithi || ''}
                          onChange={e => setFormData({...formData, tithi: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Description</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.description?.hi || ''}
                        onChange={e => setFormData({...formData, description: {...formData.description, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-48"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.description?.en || ''}
                        onChange={e => setFormData({...formData, description: {...formData.description, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-48"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'saints' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Name</h3>
                        <input 
                          type="text" placeholder="Hindi" required
                          value={formData.name?.hi || ''}
                          onChange={e => setFormData({...formData, name: {...formData.name, hi: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                        <input 
                          type="text" placeholder="English" required
                          value={formData.name?.en || ''}
                          onChange={e => setFormData({...formData, name: {...formData.name, en: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Sect</h3>
                        <input 
                          type="text" placeholder="Hindi" required
                          value={formData.sect?.hi || ''}
                          onChange={e => setFormData({...formData, sect: {...formData.sect, hi: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                        <input 
                          type="text" placeholder="English" required
                          value={formData.sect?.en || ''}
                          onChange={e => setFormData({...formData, sect: {...formData.sect, en: e.target.value}})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Description</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.desc?.hi || ''}
                        onChange={e => setFormData({...formData, desc: {...formData.desc, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-32"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.desc?.en || ''}
                        onChange={e => setFormData({...formData, desc: {...formData.desc, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-32"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Image URL</h3>
                      <input 
                        type="text" placeholder="https://..."
                        value={formData.image || ''}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'vichaar' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Quote</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.hi || ''}
                        onChange={e => setFormData({...formData, hi: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.en || ''}
                        onChange={e => setFormData({...formData, en: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Source</h3>
                      <input 
                        type="text" required
                        value={formData.source || ''}
                        onChange={e => setFormData({...formData, source: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'media' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-[#FF6D00]/10 border border-[#FF6D00]/20 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jain OTT Platform Media Entry</p>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Supports traditional audiobooks/bhajans/stories AND movies/webseries/devotional videos!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Media Title (English)</h3>
                        <input 
                          type="text" required
                          value={typeof formData.title === 'object' ? formData.title?.en || '' : formData.title || ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (typeof formData.title === 'object') {
                              setFormData({...formData, title: {...formData.title, en: val}});
                            } else {
                              setFormData({...formData, title: { en: val, hi: formData.title || '' }});
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                          placeholder="e.g. Lord Mahavira Life Epic"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Media Title (Hindi / देवनागरी)</h3>
                        <input 
                          type="text" required
                          value={typeof formData.title === 'object' ? formData.title?.hi || '' : ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (typeof formData.title === 'object') {
                              setFormData({...formData, title: {...formData.title, hi: val}});
                            } else {
                              setFormData({...formData, title: { en: formData.title || '', hi: val }});
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                          placeholder="उदा. भगवान महावीर जीवन गाथा"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Type</h3>
                        <select 
                          value={formData.type || 'movies'}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        >
                          <option value="movies">🎥 Movie</option>
                          <option value="webseries">📺 Web Series</option>
                          <option value="digital_stories">📖 Digital Video Story</option>
                          <option value="devotional_videos">🙏 Devotional Video</option>
                          <option value="stories">🎵 Audio Story</option>
                          <option value="bhajans">🎵 Bhajan (Audio)</option>
                          <option value="audiobooks">📖 Audiobook (Audio)</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Category / Genre</h3>
                        <input 
                          type="text" placeholder="e.g. Biography, Spiritual, Devotional"
                          value={formData.category || ''}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Duration</h3>
                        <input 
                          type="text" placeholder="e.g. 1h 45m or 15:30" required
                          value={formData.duration || ''}
                          onChange={e => setFormData({...formData, duration: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Artist / Author / Producer</h3>
                        <input 
                          type="text" placeholder="e.g. Swadhyay Mandal, Singer Name"
                          value={formData.artist || formData.author || ''}
                          onChange={e => setFormData({...formData, artist: e.target.value, author: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Release Year</h3>
                        <input 
                          type="text" placeholder="e.g. 2026"
                          value={formData.year || ''}
                          onChange={e => setFormData({...formData, year: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Rating (0.0 to 5.0)</h3>
                        <input 
                          type="number" step="0.1" min="1" max="5" placeholder="e.g. 4.9"
                          value={formData.rating || ''}
                          onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 5.0})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Description (English)</h3>
                        <textarea 
                          placeholder="Describe the media content..."
                          value={typeof formData.description === 'object' ? formData.description?.en || '' : formData.description || ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (typeof formData.description === 'object') {
                              setFormData({...formData, description: {...formData.description, en: val}});
                            } else {
                              setFormData({...formData, description: { en: val, hi: formData.description || '' }});
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Description (Hindi / देवनागरी)</h3>
                        <textarea 
                          placeholder="विवरण हिंदी में..."
                          value={typeof formData.description === 'object' ? formData.description?.hi || '' : ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (typeof formData.description === 'object') {
                              setFormData({...formData, description: {...formData.description, hi: val}});
                            } else {
                              setFormData({...formData, description: { en: formData.description || '', hi: val }});
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Media Stream URL or YouTube Embed Link</h3>
                      <input 
                        type="text" placeholder="https://www.youtube.com/embed/... or audio stream link" required
                        value={formData.url || formData.videoUrl || ''}
                        onChange={e => setFormData({...formData, url: e.target.value, videoUrl: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Poster / Thumbnail URL</h3>
                      <input 
                        type="text" placeholder="https://images.unsplash.com/... or any picture URL"
                        value={formData.thumbnail || ''}
                        onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Tags (comma-separated, e.g. Ahimsa, Mahavir, Meditation)</h3>
                      <input 
                        type="text" placeholder="e.g. Ahimsa, Meditation, Guru"
                        value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                        onChange={e => setFormData({...formData, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'quiz' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Question</h3>
                      <input 
                        type="text" placeholder="Hindi" required
                        value={formData.q?.hi || ''}
                        onChange={e => setFormData({...formData, q: {...formData.q, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none mb-2"
                      />
                      <input 
                        type="text" placeholder="English" required
                        value={formData.q?.en || ''}
                        onChange={e => setFormData({...formData, q: {...formData.q, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Options (Comma separated)</h3>
                      <input 
                        type="text" placeholder="Hindi Options (e.g. Option1, Option2, Option3, Option4)" required
                        value={formData.options?.hi?.join(', ') || ''}
                        onChange={e => setFormData({...formData, options: {...formData.options, hi: e.target.value.split(',').map(s => s.trim())}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none mb-2"
                      />
                      <input 
                        type="text" placeholder="English Options (e.g. Option1, Option2, Option3, Option4)" required
                        value={formData.options?.en?.join(', ') || ''}
                        onChange={e => setFormData({...formData, options: {...formData.options, en: e.target.value.split(',').map(s => s.trim())}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Correct Answer Index (0-3)</h3>
                      <input 
                        type="number" min="0" max="3" required
                        value={formData.answer ?? ''}
                        onChange={e => setFormData({...formData, answer: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Explanation</h3>
                      <textarea 
                        placeholder="Hindi" required
                        value={formData.explanation?.hi || ''}
                        onChange={e => setFormData({...formData, explanation: {...formData.explanation, hi: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24 mb-2"
                      />
                      <textarea 
                        placeholder="English" required
                        value={formData.explanation?.en || ''}
                        onChange={e => setFormData({...formData, explanation: {...formData.explanation, en: e.target.value}})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-24"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'panchang' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Date (YYYY-MM-DD)</h3>
                        <input 
                          type="text" placeholder="2026-03-30" required
                          value={formData.date || ''}
                          onChange={e => setFormData({...formData, date: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Tithi</h3>
                        <input 
                          type="text" placeholder="e.g. Trayodashi"
                          value={formData.tithi || ''}
                          onChange={e => setFormData({...formData, tithi: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Paksha</h3>
                        <input 
                          type="text" placeholder="e.g. Shukla Paksha"
                          value={formData.paksha || ''}
                          onChange={e => setFormData({...formData, paksha: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Festivals (Comma separated)</h3>
                        <input 
                          type="text" placeholder="e.g. Mahavir Jayanti"
                          value={formData.festivals?.join(', ') || ''}
                          onChange={e => setFormData({...formData, festivals: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Kalyanak (Comma separated)</h3>
                        <input 
                          type="text" placeholder="e.g. Lord Mahavira Janma Kalyanak"
                          value={formData.kalyanak?.join(', ') || ''}
                          onChange={e => setFormData({...formData, kalyanak: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Vrat (Comma separated)</h3>
                        <input 
                          type="text" placeholder="e.g. Mahavir Jayanti Vrat"
                          value={formData.vrat?.join(', ') || ''}
                          onChange={e => setFormData({...formData, vrat: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeCollection === 'classes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Title</h3>
                      <input 
                        type="text" required
                        value={formData.title || ''}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Subject</h3>
                      <input 
                        type="text" required
                        value={formData.subject || ''}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Teacher Name</h3>
                      <input 
                        type="text" required
                        value={formData.teacherName || ''}
                        onChange={e => setFormData({...formData, teacherName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">VC Link</h3>
                      <input 
                        type="text" required
                        value={formData.link || ''}
                        onChange={e => setFormData({...formData, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'exams' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Exam Title</h3>
                        <input 
                          type="text" required
                          value={formData.title || ''}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Duration (Mins)</h3>
                        <input 
                          type="number" required
                          value={formData.duration || ''}
                          onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-[#FFD54F] uppercase tracking-widest">Questions (JSON Array)</h3>
                      <textarea 
                        placeholder='[{"question": "...", "options": ["...", "..."], "correctAnswer": 0}]'
                        value={formData.questions ? JSON.stringify(formData.questions, null, 2) : ''}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setFormData({...formData, questions: parsed});
                          } catch (err) {
                            // Allow typing invalid JSON temporarily
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF6D00]/50 outline-none h-48 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <h3 className="font-bold text-white">Quiz Feature</h3>
                        <p className="text-xs text-gray-500">Enable or disable the Quiz section for users</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, quizEnabled: !formData.quizEnabled})}
                        className={cn("w-14 h-8 rounded-full relative transition-colors", formData.quizEnabled ? "bg-[#00E676]" : "bg-gray-700")}
                      >
                        <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full transition-all", formData.quizEnabled ? "left-7" : "left-1")} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <h3 className="font-bold text-white">Media Feature</h3>
                        <p className="text-xs text-gray-500">Enable or disable the Media section for users</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, mediaEnabled: !formData.mediaEnabled})}
                        className={cn("w-14 h-8 rounded-full relative transition-colors", formData.mediaEnabled ? "bg-[#00E676]" : "bg-gray-700")}
                      >
                        <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full transition-all", formData.mediaEnabled ? "left-7" : "left-1")} />
                      </button>
                    </div>
                  </div>
                )}

                {activeCollection === 'dharamshala_bookings' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Pilgrim (Name) *</label>
                      <input 
                        type="text" required
                        value={formData.pilgrimName || ''}
                        onChange={e => setFormData({...formData, pilgrimName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Contact Phone *</label>
                      <input 
                        type="tel" required
                        value={formData.contact || ''}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Check-In Date *</label>
                      <input 
                        type="date" required
                        value={formData.checkInDate || ''}
                        onChange={e => setFormData({...formData, checkInDate: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Room Type</label>
                      <select 
                        value={formData.roomType || 'Deluxe Room'}
                        onChange={e => setFormData({...formData, roomType: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="Standard Non-AC">Standard Non-AC (₹250)</option>
                        <option value="Standard AC">Standard AC (₹500)</option>
                        <option value="Deluxe Room">Deluxe AC Room (₹800)</option>
                        <option value="Samyak Family Suite">Samyak Family Suite (₹1200)</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Total Guests / Rooms count</label>
                      <input 
                        type="number" required
                        value={formData.guestsCount || 2}
                        onChange={e => setFormData({...formData, guestsCount: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Price Collected (₹)</label>
                      <input 
                        type="number" required
                        value={formData.priceCollected || 0}
                        onChange={e => setFormData({...formData, priceCollected: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Dharamshala Name</label>
                      <input 
                        type="text" required
                        value={formData.dharamshalaName || ''}
                        onChange={e => setFormData({...formData, dharamshalaName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Booking Status</label>
                      <select 
                        value={formData.status || 'pending'}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved & Booked</option>
                        <option value="completed">Completed / Stayed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeCollection === 'jain_stores' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Store/Organization Name *</label>
                      <input 
                        type="text" required
                        value={formData.storeName || ''}
                        onChange={e => setFormData({...formData, storeName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Vendor Contact Person *</label>
                      <input 
                        type="text" required
                        value={formData.vendorName || ''}
                        onChange={e => setFormData({...formData, vendorName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Email Address *</label>
                      <input 
                        type="email" required
                        value={formData.email || ''}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">WhatsApp/Phone No *</label>
                      <input 
                        type="tel" required
                        value={formData.phone || ''}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Store Description *</label>
                      <textarea 
                        required rows={3}
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none h-24 focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Store Status</label>
                      <select 
                        value={formData.status || 'pending'}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="pending">Pending Verification</option>
                        <option value="approved">Approved Store</option>
                        <option value="suspended">Suspended Store</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeCollection === 'jain_products' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Product Title *</label>
                      <input 
                        type="text" required
                        value={formData.title || ''}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Product Price (₹) *</label>
                      <input 
                        type="number" required
                        value={formData.price || 0}
                        onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Category</label>
                      <select 
                        value={formData.category || 'Books'}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="Books">Books & Literature</option>
                        <option value="Pooja Samagri">Pujan Dravyas</option>
                        <option value="Organic Foods">Organic Shuddh Foods</option>
                        <option value="Moral Games">Samyak Moral Games</option>
                        <option value="Clothing">Spiritual Clothing / Chawri</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Product Image URL</label>
                      <input 
                        type="text" required
                        value={formData.imageUrl || ''}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Vending Store Name</label>
                      <input 
                        type="text" required
                        value={formData.storeName || ''}
                        onChange={e => setFormData({...formData, storeName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Product Verification Status</label>
                      <select 
                        value={formData.status || 'approved'}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="pending">Pending review</option>
                        <option value="approved">Approved & Visible</option>
                        <option value="rejected">Rejected / Inappropriate</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Product Description *</label>
                      <textarea 
                        required rows={3}
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24 outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                  </div>
                )}

                {activeCollection === 'jain_orders' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Customer Name *</label>
                      <input 
                        type="text" required
                        value={formData.customerName || ''}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Customer Phone *</label>
                      <input 
                        type="tel" required
                        value={formData.customerPhone || ''}
                        onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Shipping Address *</label>
                      <textarea 
                        required rows={2}
                        value={formData.customerAddress || ''}
                        onChange={e => setFormData({...formData, customerAddress: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-20 outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Total Bill Amount (₹) *</label>
                      <input 
                        type="number" required
                        value={formData.totalAmount || 0}
                        onChange={e => setFormData({...formData, totalAmount: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Shipping Option</label>
                      <select 
                        value={formData.shippingMethod || 'Standard Ahimsa Eco-Delivery'}
                        onChange={e => setFormData({...formData, shippingMethod: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="Standard Ahimsa Eco-Delivery">Standard Ahimsa Eco-Delivery</option>
                        <option value="Express Post">Express speed post</option>
                        <option value="Direct Temple Trust Collection">Direct Temple Counter Pick</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Payment Mode</label>
                      <select 
                        value={formData.paymentMethod || 'UPI'}
                        onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="UPI">UPI Direct scan & pay</option>
                        <option value="COD">Cash on Delivery (COD)</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-[#FFD54F] uppercase tracking-widest">Order Status</label>
                      <select 
                        value={formData.status || 'pending'}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D00]/50"
                      >
                        <option value="pending">Pending Validation</option>
                        <option value="processing">Processing & Packing</option>
                        <option value="dispatched">Dispatched / Sent</option>
                        <option value="delivered">Delivered Successfully</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-[#00E676] to-[#69F0AE] text-black rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> SAVE CHANGES
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setIsEditing(null); }}
                    className="px-8 py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
