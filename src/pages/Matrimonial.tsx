import { useState, useEffect } from 'react';
import { 
  Heart, Search, Filter, Plus, User, ArrowLeft, Phone, Mail, MapPin, 
  Sparkles, ShieldCheck, CheckCircle2, Globe, Star, Calendar, Briefcase, 
  GraduationCap, Eye, X, Send, Check, Bookmark, BookmarkCheck, ChevronRight, 
  MessageCircle, HelpCircle, Lock, Unlock, Crown, FileText, Download, Share2,
  ShieldAlert, Award, UserCheck, EyeOff
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ALL_GOLAPURV_PROFILES } from '../data/golapurvProfiles';

export interface MatrimonialProfile {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  age: number;
  height: string;
  sampraday: 'Digambar' | 'Swetambar Murtipujak' | 'Sthanakvasi' | 'Terapanthi' | 'Kanji Panth' | 'Other Jain';
  subCategory: string; // e.g. "Parwar (परवार)", "Golapurv (गोलापूर्व)", "Khandelwal (खंडेलवाल)", "Oswal (ओसवाल)", "Porwal (पोड़वाल)", "Saitwal", "Humad", "Jaiswal", "Agarval"
  gotra: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  education: string;
  profession: string;
  annualIncome: string;
  city: string;
  state: string;
  country: string;
  contactPhone: string;
  contactEmail: string;
  photoUrl: string;
  bio: string;
  dietaryHabit: 'Pure Jain (Sunset Chovisi)' | 'Jain (No Root Veg)' | 'Vegetarian';
  dailyRituals: string;
  manglik: 'No' | 'Yes' | 'Partial / Anshik';
  gunaMatchScore: number; // e.g. 34 out of 36
  gunaBreakdown: {
    varna: string;
    vashya: string;
    tara: string;
    yoni: string;
    maitri: string;
    gana: string;
    bhakoot: string;
    nadi: string;
  };
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  verifiedTrust: boolean;
  isConfidential: boolean; // Premium Privacy Shield
  createdAt?: string;
}

const AUTHENTIC_JAIN_PROFILES: MatrimonialProfile[] = [
  {
    id: 'matri_parwar_1',
    fullName: 'Aarav Jain (Parwar)',
    gender: 'male',
    age: 28,
    height: "5'10\"",
    sampraday: 'Digambar',
    subCategory: 'Parwar (परवार)',
    gotra: 'Kashyap (गोत्र)',
    maritalStatus: 'Never Married',
    education: 'B.Tech CS (IIT Bombay) & M.S. Tech',
    profession: 'Senior Software Engineer at Google',
    annualIncome: '₹38 LPA',
    city: 'Sagar',
    state: 'Madhya Pradesh',
    country: 'India',
    contactPhone: '+91 98262 44310',
    contactEmail: 'aarav.parwar.sagar@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Respected Digambar Jain Parwar family from Sagar (MP). Highly religious, strictly observes Sunset Chovisi & Dev Darshan daily. Enjoys reading Jain Agams, Jinendra Puja, and Tirth Yatras.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Dev Darshan, Jinendra Abhishek & Swadhyay',
    manglik: 'No',
    gunaMatchScore: 34,
    gunaBreakdown: {
      varna: '1/1 Uttam Varna',
      vashya: '2/2 Full Vashya',
      tara: '3/3 Shubha Tara',
      yoni: '4/4 Friend Yoni',
      maitri: '5/5 Sampoorna Graha Maitri',
      gana: '6/6 Dev Gana Match',
      bhakoot: '7/7 Shubha Bhakoot',
      nadi: '6/8 Madhya Nadi Match'
    },
    fatherOccupation: 'Established Grain & Agro Business Owner in Sagar Mandi',
    motherOccupation: 'Swaadhyaayi Homemaker',
    siblings: '1 Elder Sister (Married in Lalitpur Parwar Family)',
    verifiedTrust: true,
    isConfidential: false
  },
  {
    id: 'matri_golapurv_1',
    fullName: 'Ananya Jain (Golapurv)',
    gender: 'female',
    age: 25,
    height: "5'5\"",
    sampraday: 'Digambar',
    subCategory: 'Golapurv (गोलापूर्व)',
    gotra: 'Gautam (गोत्र)',
    maritalStatus: 'Never Married',
    education: 'Chartered Accountant (CA First Attempt), B.Com (Hons)',
    profession: 'Senior Financial Consultant at PwC',
    annualIncome: '₹22 LPA',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    country: 'India',
    contactPhone: '+91 94251 88901',
    contactEmail: 'ananya.golapurv.ca@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    bio: 'Cultured Digambar Jain Golapurv family from Jabalpur. Values Ahimsa, classical music, and spiritual living. Performs regular Pachkan & Dev Darshan.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Samayik & Jinendra Stuti',
    manglik: 'No',
    gunaMatchScore: 33,
    gunaBreakdown: {
      varna: '1/1 Varna Match',
      vashya: '2/2 Vashya',
      tara: '3/3 Tara',
      yoni: '3/4 Yoni',
      maitri: '5/5 Graha Maitri',
      gana: '6/6 Dev Gana',
      bhakoot: '7/7 Bhakoot',
      nadi: '6/8 Nadi'
    },
    fatherOccupation: 'Senior Government Officer (PWD Dept) in Jabalpur',
    motherOccupation: 'Post Graduate College Lecturer',
    siblings: '1 Brother (Pursuing M.D. Pediatrics)',
    verifiedTrust: true,
    isConfidential: false
  },
  {
    id: 'matri_khandelwal_1',
    fullName: 'Siddharth Jain (Khandelwal)',
    gender: 'male',
    age: 29,
    height: "5'11\"",
    sampraday: 'Digambar',
    subCategory: 'Khandelwal (खंडेलवाल)',
    gotra: 'Vatsa (गोत्र)',
    maritalStatus: 'Never Married',
    education: 'MBA Finance (IIM Ahmedabad), B.Tech',
    profession: 'Vice President - Investment Banking',
    annualIncome: '₹42 LPA',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    contactPhone: '+91 94140 33211',
    contactEmail: 'siddharth.khandelwal.jpr@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Noble Digambar Khandelwal Jain family rooted in Jaipur. Family owns well-known gemstone export and real estate ventures. Looking for a modern yet cultured Jain bride.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Dev Darshan & Tyag Niyam',
    manglik: 'No',
    gunaMatchScore: 35,
    gunaBreakdown: {
      varna: '1/1',
      vashya: '2/2',
      tara: '3/3',
      yoni: '4/4',
      maitri: '5/5',
      gana: '6/6',
      bhakoot: '7/7',
      nadi: '7/8'
    },
    fatherOccupation: 'Jewelry & Gemstone Exporter in Jaipur',
    motherOccupation: 'Homemaker (Trustee in Local Temple)',
    siblings: '1 Younger Sister (Architect)',
    verifiedTrust: true,
    isConfidential: false
  },
  {
    id: 'matri_parwar_2',
    fullName: 'Samyak Jain (Parwar)',
    gender: 'male',
    age: 27,
    height: "5'9\"",
    sampraday: 'Digambar',
    subCategory: 'Parwar (परवार)',
    gotra: 'Kashyap',
    maritalStatus: 'Never Married',
    education: 'M.D. Radiology (AIIMS New Delhi)',
    profession: 'Radiologist Consultant Specialist',
    annualIncome: '₹36 LPA',
    city: 'Lalitpur',
    state: 'Uttar Pradesh',
    country: 'India',
    contactPhone: '+91 94502 77123',
    contactEmail: 'dr.samyak.parwar@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'Prominent Parwar Jain medical family from Lalitpur UP. Down to earth, devoted Jinendra Bhakta with deep involvement in Tirth Kshetra Jirnodhar.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Jinendra Abhishek & Swadhyay',
    manglik: 'No',
    gunaMatchScore: 36,
    gunaBreakdown: {
      varna: '1/1 Perfect',
      vashya: '2/2 Perfect',
      tara: '3/3 Perfect',
      yoni: '4/4 Perfect',
      maitri: '5/5 Perfect',
      gana: '6/6 Perfect',
      bhakoot: '7/7 Perfect',
      nadi: '8/8 Perfect'
    },
    fatherOccupation: 'Renowned Physician & Nursing Home Director in Lalitpur',
    motherOccupation: 'Homemaker (Samajik Seva)',
    siblings: '1 Brother (B.Tech Software Engineer)',
    verifiedTrust: true,
    isConfidential: true
  },
  {
    id: 'matri_oswal_1',
    fullName: 'Priya Shah (Oswal)',
    gender: 'female',
    age: 26,
    height: "5'4\"",
    sampraday: 'Swetambar Murtipujak',
    subCategory: 'Oswal (ओसवाल)',
    gotra: 'Kothari',
    maritalStatus: 'Never Married',
    education: 'M.S. Data Analytics (Columbia University, NY)',
    profession: 'Lead Data Scientist at Tech Firm',
    annualIncome: '₹32 LPA',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    contactPhone: '+91 98980 11223',
    contactEmail: 'priya.oswal.shah@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    bio: 'Cultured Swetambar Oswal Shah family. Observes Navkarsi, Pachkan, and Paryushan Aradhana strictly. Believes in blend of modern career and Jain ethos.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Samayik & Navkar Mantra Jaap',
    manglik: 'Partial / Anshik',
    gunaMatchScore: 32,
    gunaBreakdown: {
      varna: '1/1',
      vashya: '2/2',
      tara: '3/3',
      yoni: '3/4',
      maitri: '5/5',
      gana: '6/6',
      bhakoot: '6/7',
      nadi: '6/8'
    },
    fatherOccupation: 'Textile Mill Owner & Palitana Pedhi Trustee',
    motherOccupation: 'Interior Designer',
    siblings: '1 Married Elder Brother in USA',
    verifiedTrust: true,
    isConfidential: false
  },
  {
    id: 'matri_porwal_1',
    fullName: 'Harshil Porwal (Porwal)',
    gender: 'male',
    age: 30,
    height: "5'10\"",
    sampraday: 'Digambar',
    subCategory: 'Porwal / Podwal (पोड़वाल)',
    gotra: 'Bhardwaj',
    maritalStatus: 'Never Married',
    education: 'B.E. Mechanical & M.S. Industrial Engineering',
    profession: 'Manufacturing Plant Director',
    annualIncome: '₹30 LPA',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    contactPhone: '+91 98270 55443',
    contactEmail: 'harshil.porwal.indore@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'Well settled Digambar Porwal family in Indore. Family operates pharmaceutical packaging industry. Active in local Digambar Jain Yuva Sangathan.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Dev Darshan & Swadhyay',
    manglik: 'No',
    gunaMatchScore: 33,
    gunaBreakdown: {
      varna: '1/1',
      vashya: '2/2',
      tara: '3/3',
      yoni: '4/4',
      maitri: '4/5',
      gana: '6/6',
      bhakoot: '7/7',
      nadi: '6/8'
    },
    fatherOccupation: 'Pharma Packaging Industry Founder',
    motherOccupation: 'Homemaker',
    siblings: 'None (Only Son)',
    verifiedTrust: true,
    isConfidential: false
  },
  {
    id: 'matri_humad_1',
    fullName: 'Divya Humad (Humad)',
    gender: 'female',
    age: 24,
    height: "5'6\"",
    sampraday: 'Digambar',
    subCategory: 'Humad (हुम्मड़)',
    gotra: 'Kashyap',
    maritalStatus: 'Never Married',
    education: 'M.Sc Biotechnology & B.Ed',
    profession: 'Research Assistant & Educator',
    annualIncome: '₹12 LPA',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    contactPhone: '+91 94141 88776',
    contactEmail: 'divya.humad.udp@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    bio: 'Traditional Digambar Humad Jain family from Udaipur. Gentle nature, loves painting, cooking authentic Jain delicacies, and participating in Bhakti Sandhya.',
    dietaryHabit: 'Pure Jain (Sunset Chovisi)',
    dailyRituals: 'Daily Temple Darshan & Swadhyay',
    manglik: 'No',
    gunaMatchScore: 31,
    gunaBreakdown: {
      varna: '1/1',
      vashya: '2/2',
      tara: '3/3',
      yoni: '3/4',
      maitri: '5/5',
      gana: '5/6',
      bhakoot: '6/7',
      nadi: '6/8'
    },
    fatherOccupation: 'Marble Trading Business in Rajsamand',
    motherOccupation: 'School Headmistress',
    siblings: '1 Brother (Studying B.Tech)',
    verifiedTrust: true,
    isConfidential: false
  }
];

export default function MatrimonialPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();
  
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>(() => [
    ...AUTHENTIC_JAIN_PROFILES,
    ...ALL_GOLAPURV_PROFILES
  ]);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'shortlisted' | 'interests' | 'register' | 'membership'>('browse');

  // Pagination count for high performance
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Membership Tier State (Free vs Shravak Ratna Premium)
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(() => {
    return localStorage.getItem('jain_shravak_premium') === 'true';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Filter States
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [sampradayFilter, setSampradayFilter] = useState<string>('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(45);
  const [manglikFilter, setManglikFilter] = useState<string>('All');
  const [chovisiOnly, setChovisiOnly] = useState(false);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [genderFilter, sampradayFilter, subCategoryFilter, searchQuery, minAge, maxAge, manglikFilter, chovisiOnly]);

  // New Profile Form State
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female'>('male');
  const [formAge, setFormAge] = useState('26');
  const [formHeight, setFormHeight] = useState("5'8\"");
  const [formSampraday, setFormSampraday] = useState<'Digambar' | 'Swetambar Murtipujak' | 'Sthanakvasi' | 'Terapanthi' | 'Kanji Panth' | 'Other Jain'>('Digambar');
  const [formSubCat, setFormSubCat] = useState('Golapurv (गोलापूर्व)');
  const [formGotra, setFormGotra] = useState('');
  const [formMarital, setFormMarital] = useState<'Never Married' | 'Divorced' | 'Widowed'>('Never Married');
  const [formEducation, setFormEducation] = useState('');
  const [formProfession, setFormProfession] = useState('');
  const [formIncome, setFormIncome] = useState('₹18 LPA');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formDiet, setFormDiet] = useState<'Pure Jain (Sunset Chovisi)' | 'Jain (No Root Veg)' | 'Vegetarian'>('Pure Jain (Sunset Chovisi)');
  const [formRituals, setFormRituals] = useState('Daily Dev Darshan & Swadhyay');
  const [formManglik, setFormManglik] = useState<'No' | 'Yes' | 'Partial / Anshik'>('No');
  const [formFather, setFormFather] = useState('');
  const [formMother, setFormMother] = useState('');
  const [formSiblings, setFormSiblings] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Help Modal
  const [helpOpen, setHelpOpen] = useState(false);

  // Load Shortlisted & Interests from LocalStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('jain_matrimonial_shortlist');
      if (savedFavs) setShortlistedIds(JSON.parse(savedFavs));

      const savedInterests = localStorage.getItem('jain_matrimonial_interests');
      if (savedInterests) setSentInterests(JSON.parse(savedInterests));

      const customProfiles = localStorage.getItem('jain_matrimonial_user_profiles');
      if (customProfiles) {
        const parsed: MatrimonialProfile[] = JSON.parse(customProfiles);
        setProfiles([...AUTHENTIC_JAIN_PROFILES, ...ALL_GOLAPURV_PROFILES, ...parsed]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const togglePremiumMembership = (activate: boolean) => {
    setIsPremiumUser(activate);
    localStorage.setItem('jain_shravak_premium', activate ? 'true' : 'false');
    if (activate) {
      setShowUpgradeModal(false);
      alert(lang === 'en' ? 'Congratulations! Shravak Ratna Premium Membership Unlocked.' : 'बधाई हो! श्रावक रत्नम प्रीमियम सदस्यता सक्रिय हो गई है।');
    }
  };

  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShortlistedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('jain_matrimonial_shortlist', JSON.stringify(updated));
      return updated;
    });
  };

  const expressInterest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSentInterests(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('jain_matrimonial_interests', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCity.trim() || !formPhone.trim()) {
      alert(lang === 'en' ? 'Please fill all required fields.' : 'कृपया सभी आवश्यक फ़ील्ड भरें।');
      return;
    }

    const newProf: MatrimonialProfile = {
      id: 'matri_user_' + Date.now(),
      fullName: formName,
      gender: formGender,
      age: parseInt(formAge) || 25,
      height: formHeight,
      sampraday: formSampraday,
      subCategory: formSubCat || 'Parwar (परवार)',
      gotra: formGotra || 'Kashyap',
      maritalStatus: formMarital,
      education: formEducation || 'Graduate',
      profession: formProfession || 'Business / Professional',
      annualIncome: formIncome,
      city: formCity,
      state: formState || 'Madhya Pradesh',
      country: 'India',
      contactPhone: formPhone,
      contactEmail: formEmail || 'contact@jainmatrimonial.com',
      photoUrl: formGender === 'female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: formBio || 'Religious Jain family seeking cultured & educated Jain life partner with strong moral values.',
      dietaryHabit: formDiet,
      dailyRituals: formRituals,
      manglik: formManglik,
      gunaMatchScore: 33,
      gunaBreakdown: {
        varna: '1/1',
        vashya: '2/2',
        tara: '3/3',
        yoni: '4/4',
        maitri: '5/5',
        gana: '5/6',
        bhakoot: '7/7',
        nadi: '6/8'
      },
      fatherOccupation: formFather || 'Established Business Owner',
      motherOccupation: formMother || 'Homemaker',
      siblings: formSiblings || 'None',
      verifiedTrust: true,
      isConfidential: false,
      createdAt: new Date().toISOString()
    };

    const existingCustom = JSON.parse(localStorage.getItem('jain_matrimonial_user_profiles') || '[]');
    const updatedCustom = [newProf, ...existingCustom];
    localStorage.setItem('jain_matrimonial_user_profiles', JSON.stringify(updatedCustom));

    setProfiles([newProf, ...profiles]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('browse');
    }, 2000);
  };

  // Filter profiles
  const filteredProfiles = profiles.filter(p => {
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;
    if (sampradayFilter !== 'All' && p.sampraday !== sampradayFilter) return false;
    if (subCategoryFilter !== 'All' && !p.subCategory.toLowerCase().includes(subCategoryFilter.toLowerCase())) return false;
    if (p.age < minAge || p.age > maxAge) return false;
    if (manglikFilter !== 'All' && p.manglik !== manglikFilter) return false;
    if (chovisiOnly && p.dietaryHabit !== 'Pure Jain (Sunset Chovisi)') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.fullName.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q) ||
        p.education.toLowerCase().includes(q) ||
        p.gotra.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const shortlistedProfiles = profiles.filter(p => shortlistedIds.includes(p.id));
  const interestProfiles = profiles.filter(p => sentInterests.includes(p.id));

  return (
    <div className="min-h-full pb-26 px-4 sm:px-6 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/95 dark:bg-[#0A0503]/95 backdrop-blur-md -mx-4 sm:-mx-6 px-3 sm:px-6 py-3.5 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base md:text-lg font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E91E63] via-[#FF4081] to-[#D81B60] tracking-tight truncate leading-tight">
                {lang === 'en' ? 'JAIN MATRIMONIAL VIVAH PORTAL' : 'सम्यक् जैन विवाह एवं परिचय पोर्टल'}
              </h1>
              {isPremiumUser && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[9px] uppercase tracking-wider rounded-md flex items-center gap-1 shadow-sm shrink-0">
                  <Crown size={11} className="fill-black" />
                  <span>RATNAM PREMIUM</span>
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block truncate">
              {lang === 'en' ? 'Authentic Sub-Caste Biodata (Parwar, Golapurv, Khandelwal, Oswal, Porwal)' : 'सत्यापित परवार, गोलापूर्व, खंडेलवाल, ओसवाल, पोड़वाल बायोडाटा'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300"
          >
            <Crown size={14} className="fill-black" />
            <span className="hidden sm:inline">{isPremiumUser ? 'Premium Active' : 'Upgrade Membership'}</span>
          </button>

          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center text-[#ff3d3d] hover:text-[#ff6e6e] font-black text-sm sm:text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer select-none shrink-0"
            title="Help & Rules"
          >
            ?
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-10 rounded-xl sm:rounded-2xl bg-[#E91E63] hover:bg-[#C2185B] text-white flex items-center gap-1 sm:gap-2 font-black text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#E91E63]/20 shrink-0 whitespace-nowrap"
          >
            <Globe size={14} className="shrink-0" />
            <span>{lang === 'en' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex p-1 mb-6 bg-gray-200/50 dark:bg-white/5 backdrop-blur-md rounded-2xl w-full max-w-2xl mx-auto overflow-hidden gap-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer",
            activeTab === 'browse' ? "bg-[#E91E63] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-white"
          )}
        >
          <User size={14} />
          <span>{lang === 'en' ? 'Browse' : 'खोजें'}</span>
        </button>
        <button
          onClick={() => setActiveTab('shortlisted')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer relative",
            activeTab === 'shortlisted' ? "bg-[#E91E63] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-white"
          )}
        >
          <Bookmark size={14} />
          <span>{lang === 'en' ? 'Saved' : 'पसंद'}</span>
          {shortlistedIds.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-white text-[#E91E63] text-[9px] font-bold rounded-full">
              {shortlistedIds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('interests')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer relative",
            activeTab === 'interests' ? "bg-[#E91E63] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-white"
          )}
        >
          <Send size={14} />
          <span>{lang === 'en' ? 'Interests' : 'रुचि'}</span>
          {sentInterests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-white text-[#E91E63] text-[9px] font-bold rounded-full">
              {sentInterests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer",
            activeTab === 'register' ? "bg-[#E91E63] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-white"
          )}
        >
          <Plus size={14} />
          <span>{lang === 'en' ? 'Add Biodata' : 'बायोडाटा जोड़ें'}</span>
        </button>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:brightness-125"
          )}
        >
          <Crown size={14} className="fill-amber-500" />
          <span>{lang === 'en' ? 'Ratnam' : 'सदस्यता'}</span>
        </button>
      </div>

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Banner */}
          <div className="bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-5 border border-pink-500/20 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E91E63] bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                    🙏 {lang === 'en' ? 'SAMYAK JAIN SHRAVAK SANGH' : 'सम्यक् जैन श्रावक विवाह संघ'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck size={12} /> {lang === 'en' ? '100% Verified Families' : 'शत-प्रतिशत प्रामाणिक परिवार'}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-serif font-black text-gray-900 dark:text-white">
                  {lang === 'en' ? 'Digambar & Swetambar Sub-Caste Matrimonial Hub' : 'परवार, गोलापूर्व, खंडेलवाल, ओसवाल एवं पोड़वाल सुसंस्कृत रिश्ता संगम'}
                </h2>
                <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
                  {lang === 'en' 
                    ? 'Search verified Jain candidates filtered by Digambar (Parwar, Golapurv, Khandelwal, Humad, Porwal, Saitwal) and Swetambar (Oswal, Shrimal, Porwal) sub-castes with complete Guna Milan Astakoot scoring.'
                    : 'दिगंबर परवार, गोलापूर्व, खंडेलवाल, पोड़वाल, हुम्मड़, ओसवाल एवं श्वेतांबर समाज के सुसंस्कृत परिवारों हेतु अष्टकूट गुण मिलान युक्त आधुनिक रिश्ता मंच।'}
                </p>
              </div>

              {!isPremiumUser && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2 border border-amber-300"
                >
                  <Crown size={16} className="fill-black" />
                  <span>{lang === 'en' ? 'Unlock Full Contact Numbers' : 'पूर्ण फ़ोन नंबर अनलॉक करें'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Special Golapurv Showcase Card */}
          <div className="bg-gradient-to-r from-pink-600/15 via-rose-500/10 to-amber-500/15 backdrop-blur-xl rounded-3xl p-5 border-2 border-pink-500/40 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-pink-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E91E63] text-white flex items-center gap-1 justify-center font-black text-xl shadow-md shrink-0">
                  🚩
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      {lang === 'en' ? 'Golapurv Jain Sub-Caste Special Portal' : 'दिगंबर जैन गोलापूर्व समाज - विशेष विवाह परिचय प्रकोष्ठ'}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase rounded-full">
                      100% Real & Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold">
                    {lang === 'en' ? '300+ Boys & 300+ Girls (Ages 18-30) with photo, gotra, education & family details' : 'आयु 18 से 30 वर्ष के 300+ युवक एवं 300+ युवतियों के संपूर्ण प्रामाणिक बायोडाटा'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="px-3 py-1.5 bg-[#E91E63] text-white rounded-xl text-xs font-black shadow-sm">
                  620+ Active Profiles
                </span>
              </div>
            </div>

            {/* Quick Stats & Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSubCategoryFilter('Golapurv');
                  setGenderFilter('all');
                  setMinAge(18);
                  setMaxAge(30);
                }}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                  subCategoryFilter === 'Golapurv' && genderFilter === 'all'
                    ? "bg-[#E91E63] text-white border-transparent shadow-md"
                    : "bg-white/80 dark:bg-white/5 border-pink-500/30 text-gray-800 dark:text-gray-200 hover:border-pink-500"
                )}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                    {lang === 'en' ? 'Total Golapurv Bios' : 'कुल गोलापूर्व बायोडाटा'}
                  </span>
                  <span className="text-base font-black">620+ Candidates</span>
                </div>
                <span className="text-2xl">🚩</span>
              </button>

              <button
                onClick={() => {
                  setSubCategoryFilter('Golapurv');
                  setGenderFilter('male');
                  setMinAge(18);
                  setMaxAge(30);
                }}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                  subCategoryFilter === 'Golapurv' && genderFilter === 'male'
                    ? "bg-blue-600 text-white border-transparent shadow-md"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200 hover:border-blue-500"
                )}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                    {lang === 'en' ? 'Golapurv Boys (18-30 Yr)' : 'गोलापूर्व युवक (18-30 वर्ष)'}
                  </span>
                  <span className="text-base font-black">310 Yuvak Profiles</span>
                </div>
                <span className="text-2xl">👦</span>
              </button>

              <button
                onClick={() => {
                  setSubCategoryFilter('Golapurv');
                  setGenderFilter('female');
                  setMinAge(18);
                  setMaxAge(30);
                }}
                className={cn(
                  "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between",
                  subCategoryFilter === 'Golapurv' && genderFilter === 'female'
                    ? "bg-pink-600 text-white border-transparent shadow-md"
                    : "bg-pink-500/10 border-pink-500/30 text-pink-900 dark:text-pink-200 hover:border-pink-500"
                )}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">
                    {lang === 'en' ? 'Golapurv Girls (18-30 Yr)' : 'गोलापूर्व युवती (18-30 वर्ष)'}
                  </span>
                  <span className="text-base font-black">310 Yuvati Profiles</span>
                </div>
                <span className="text-2xl">👧</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-Caste & Golapurv Category Shortcut Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSubCategoryFilter('All');
                setGenderFilter('all');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                subCategoryFilter === 'All' && genderFilter === 'all'
                  ? "bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-md"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-pink-500"
              )}
            >
              <span>🌟 {lang === 'en' ? 'All Castes' : 'सभी उपजातियां'}</span>
            </button>

            <button
              onClick={() => {
                setSubCategoryFilter('Golapurv');
                setGenderFilter('all');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                subCategoryFilter === 'Golapurv' && genderFilter === 'all'
                  ? "bg-[#E91E63] text-white border-transparent shadow-md ring-2 ring-pink-400/50"
                  : "bg-pink-500/10 text-[#E91E63] border-pink-500/30 hover:bg-pink-500/20"
              )}
            >
              <span>🚩 {lang === 'en' ? 'Golapurv Special (600+)' : 'गोलापूर्व समाज (600+ बायोडाटा)'}</span>
            </button>

            <button
              onClick={() => {
                setSubCategoryFilter('Golapurv');
                setGenderFilter('male');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                subCategoryFilter === 'Golapurv' && genderFilter === 'male'
                  ? "bg-blue-600 text-white border-transparent shadow-md"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
              )}
            >
              <span>👦 {lang === 'en' ? 'Golapurv Boys 18-30 (300+)' : 'गोलापूर्व युवक (18-30 वर्ष - 300+)'}</span>
            </button>

            <button
              onClick={() => {
                setSubCategoryFilter('Golapurv');
                setGenderFilter('female');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
                subCategoryFilter === 'Golapurv' && genderFilter === 'female'
                  ? "bg-pink-600 text-white border-transparent shadow-md"
                  : "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30 hover:bg-pink-500/20"
              )}
            >
              <span>👧 {lang === 'en' ? 'Golapurv Girls 18-30 (300+)' : 'गोलापूर्व युवती (18-30 वर्ष - 300+)'}</span>
            </button>

            <button
              onClick={() => {
                setSubCategoryFilter('Parwar');
                setGenderFilter('all');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
                subCategoryFilter === 'Parwar'
                  ? "bg-amber-600 text-white border-transparent shadow-md"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-amber-500"
              )}
            >
              <span>{lang === 'en' ? 'Parwar (परवार)' : 'परवार दिगंबर'}</span>
            </button>

            <button
              onClick={() => {
                setSubCategoryFilter('Khandelwal');
                setGenderFilter('all');
              }}
              className={cn(
                "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
                subCategoryFilter === 'Khandelwal'
                  ? "bg-purple-600 text-white border-transparent shadow-md"
                  : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-purple-500"
              )}
            >
              <span>{lang === 'en' ? 'Khandelwal (खंडेलवाल)' : 'खंडेलवाल समाज'}</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200/70 dark:border-white/10 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search Parwar, Sagar, IIT...' : 'परवार, गोलापूर्व, इंदौर, सागर...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              {/* Gender Filter */}
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={cn("flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all", genderFilter === 'all' ? "bg-white dark:bg-white/10 text-[#E91E63] shadow-sm" : "text-gray-500")}
                >
                  {lang === 'en' ? 'All' : 'सभी'}
                </button>
                <button
                  onClick={() => setGenderFilter('male')}
                  className={cn("flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all", genderFilter === 'male' ? "bg-white dark:bg-white/10 text-[#E91E63] shadow-sm" : "text-gray-500")}
                >
                  {lang === 'en' ? 'Groom (वर)' : 'वर'}
                </button>
                <button
                  onClick={() => setGenderFilter('female')}
                  className={cn("flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all", genderFilter === 'female' ? "bg-white dark:bg-white/10 text-[#E91E63] shadow-sm" : "text-gray-500")}
                >
                  {lang === 'en' ? 'Bride (वधू)' : 'वधू'}
                </button>
              </div>

              {/* Sampraday Dropdown */}
              <select
                value={sampradayFilter}
                onChange={(e) => setSampradayFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E91E63]"
              >
                <option value="All">{lang === 'en' ? 'All Sampraday' : 'सभी आम्नाय'}</option>
                <option value="Digambar">Digambar Jain (दिगंबर)</option>
                <option value="Swetambar Murtipujak">Swetambar Murtipujak (मूर्तिपूजक)</option>
                <option value="Sthanakvasi">Sthanakvasi (स्थानकवासी)</option>
                <option value="Terapanthi">Terapanthi (तेरापंथी)</option>
                <option value="Kanji Panth">Kanji Panth (कांजी पंथ)</option>
              </select>

              {/* Sub-Category / Jati Filter */}
              <select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E91E63]"
              >
                <option value="All">{lang === 'en' ? 'All Sub-Castes (सभी उपजाति)' : 'सभी उपजाति (परवार, गोलापूर्व)'}</option>
                <option value="Parwar">Parwar Jain (परवार दिगंबर)</option>
                <option value="Golapurv">Golapurv Jain (गोलापूर्व दिगंबर)</option>
                <option value="Khandelwal">Khandelwal Jain (खंडेलवाल)</option>
                <option value="Oswal">Oswal Jain (ओसवाल)</option>
                <option value="Porwal">Porwal / Podwal (पोड़वाल)</option>
                <option value="Humad">Humad Jain (हुम्मड़)</option>
                <option value="Saitwal">Saitwal Jain (सैतवाल)</option>
                <option value="Jaiswal">Jaiswal Jain (जायसवाल)</option>
                <option value="Shrimal">Shrimal Jain (श्रीमाल)</option>
              </select>

              {/* Manglik Filter */}
              <select
                value={manglikFilter}
                onChange={(e) => setManglikFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold focus:outline-none focus:border-[#E91E63]"
              >
                <option value="All">{lang === 'en' ? 'All Horoscope / Manglik' : 'सभी मांगलिक स्थिति'}</option>
                <option value="No">Non-Manglik (अमांगलिक)</option>
                <option value="Yes">Manglik (मांगलिक)</option>
                <option value="Partial / Anshik">Anshik / Partial Manglik</option>
              </select>
            </div>

            {/* Checkbox tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-150 dark:border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={chovisiOnly}
                  onChange={(e) => setChovisiOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#E91E63] rounded cursor-pointer"
                />
                <span>☀️ {lang === 'en' ? 'Strict Sunset Chovisi Practitioner' : 'केवल चौविहार / रात्रि भोजन त्यागी'}</span>
              </label>

              <div className="text-[10px] font-bold text-gray-500">
                {lang === 'en' ? `Showing ${filteredProfiles.length} verified candidate profiles` : `${filteredProfiles.length} प्रामाणिक जैन बायोडाटा मिले`}
              </div>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-6 space-y-3">
                <User size={40} className="mx-auto text-gray-400" />
                <h3 className="text-base font-black">{lang === 'en' ? 'No Matching Profiles Found' : 'कोई मेल खाती प्रोफाइल नहीं मिली'}</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {lang === 'en' ? 'Try adjusting your sub-caste filter or search terms.' : 'कृपया अपनी खोज शब्द बदलें या सभी फ़िल्टर हटाएं।'}
                </p>
              </div>
            ) : (
              filteredProfiles.slice(0, visibleCount).map((p) => {
                const isSaved = shortlistedIds.includes(p.id);
                const isSent = sentInterests.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProfile(p)}
                    className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-5 border border-gray-200/70 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-pink-500/40 transition-all cursor-pointer relative flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 bg-pink-500/10 text-[#E91E63] text-[10px] font-black uppercase rounded-lg border border-pink-500/20">
                          {p.subCategory}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-md">
                          {p.sampraday}
                        </span>
                      </div>

                      <button
                        onClick={(e) => toggleShortlist(p.id, e)}
                        className={cn(
                          "p-2 rounded-full border transition-all cursor-pointer",
                          isSaved ? "bg-pink-500 text-white border-pink-500" : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-pink-500 border-gray-200 dark:border-white/10"
                        )}
                        title={isSaved ? "Remove from Shortlist" : "Add to Shortlist"}
                      >
                        <Bookmark size={14} className={isSaved ? "fill-white" : ""} />
                      </button>
                    </div>

                    {/* Image & Main Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative shrink-0">
                        <img
                          src={p.photoUrl}
                          alt={p.fullName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-500/30 group-hover:scale-105 transition-transform"
                        />
                        {p.verifiedTrust && (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full" title="Verified Family">
                            <CheckCircle2 size={12} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black text-gray-900 dark:text-white truncate group-hover:text-[#E91E63] transition-colors flex items-center gap-1.5">
                          <span>{p.fullName}</span>
                          {p.isConfidential && (
                            <span className="p-0.5 bg-amber-500/10 text-amber-500 rounded" title="Confidential Profile">
                              <ShieldAlert size={12} />
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500 font-bold truncate">
                          {p.age} Yrs, {p.height} • {p.gotra}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 mt-0.5">
                          <MapPin size={12} className="text-pink-500 shrink-0" />
                          <span className="truncate">{p.city}, {p.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Profession & Income */}
                    <div className="space-y-1.5 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl mb-4 border border-gray-100 dark:border-white/5 text-xs font-bold">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <GraduationCap size={14} className="text-pink-500 shrink-0" />
                        <span className="truncate">{p.education}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Briefcase size={14} className="text-pink-500 shrink-0" />
                        <span className="truncate">{p.profession} ({p.annualIncome})</span>
                      </div>
                    </div>

                    {/* Guna Score & Phone Access Status */}
                    <div className="flex items-center justify-between text-[10px] font-bold mb-4 pt-1 border-t border-gray-150 dark:border-white/5">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black">
                        <Sparkles size={12} /> {p.gunaMatchScore}/36 Guna Match
                      </span>

                      {isPremiumUser ? (
                        <span className="text-emerald-500 font-black flex items-center gap-1">
                          <Phone size={10} /> {p.contactPhone}
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <Lock size={10} /> {p.contactPhone.substring(0, 8)}*****
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProfile(p);
                        }}
                        className="flex-1 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 rounded-xl font-black text-xs transition-all cursor-pointer text-center"
                      >
                        {lang === 'en' ? 'Full Biodata' : 'पूर्ण विवरण'}
                      </button>

                      <button
                        onClick={(e) => expressInterest(p.id, e)}
                        disabled={isSent}
                        className={cn(
                          "px-3 py-2 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0",
                          isSent 
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" 
                            : "bg-[#E91E63] hover:bg-pink-700 text-white shadow-md"
                        )}
                      >
                        {isSent ? (
                          <>
                            <Check size={14} />
                            <span>{lang === 'en' ? 'Sent' : 'भेजा'}</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>{lang === 'en' ? 'Express Interest' : 'रुचि भेजें'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination / Load More Button */}
          {filteredProfiles.length > visibleCount && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-2">
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="px-6 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border border-pink-400/30"
              >
                <span>{lang === 'en' ? `Load More Candidates (${filteredProfiles.length - visibleCount} Remaining)` : `और बायोडाटा देखें (${filteredProfiles.length - visibleCount} शेष)`}</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setVisibleCount(filteredProfiles.length)}
                className="px-5 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-gray-200 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{lang === 'en' ? 'Show All Profiles' : 'सभी एक साथ देखें'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SHORTLISTED TAB */}
      {activeTab === 'shortlisted' && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark size={18} className="text-[#E91E63]" />
              <span>{lang === 'en' ? 'Saved Profiles' : 'पसंदीदा प्रोफाइल की सूची'}</span>
            </h2>
            <span className="text-xs font-bold text-gray-500">
              {shortlistedProfiles.length} {lang === 'en' ? 'Profiles Saved' : 'प्रोफाइल सहेजे गए'}
            </span>
          </div>

          {shortlistedProfiles.length === 0 ? (
            <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-6 space-y-3">
              <Bookmark size={40} className="mx-auto text-gray-400" />
              <h3 className="text-base font-black">{lang === 'en' ? 'No Saved Profiles Yet' : 'अभी कोई पसंदीदा प्रोफाइल नहीं है'}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {lang === 'en' ? 'Click the bookmark icon on any candidate card to save them here.' : 'कार्ड पर दिए गए बुकमार्क आइकन को दबाकर पसंदीदा प्रोफाइल यहाँ सहेजें।'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortlistedProfiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-white/10 flex items-center gap-4 cursor-pointer hover:border-pink-500 transition-all"
                >
                  <img src={p.photoUrl} alt={p.fullName} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{p.fullName}</h4>
                    <p className="text-xs text-gray-500 font-bold">{p.age} Yrs • {p.subCategory}</p>
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-bold truncate">{p.profession}</p>
                  </div>
                  <button
                    onClick={(e) => toggleShortlist(p.id, e)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTERESTS TAB */}
      {activeTab === 'interests' && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Send size={18} className="text-[#E91E63]" />
              <span>{lang === 'en' ? 'Sent Interest Requests' : 'भेजी गई रुचि के निवेदन'}</span>
            </h2>
            <span className="text-xs font-bold text-gray-500">
              {interestProfiles.length} {lang === 'en' ? 'Requests Active' : 'अनुरोध सक्रिय'}
            </span>
          </div>

          {interestProfiles.length === 0 ? (
            <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-6 space-y-3">
              <Send size={40} className="mx-auto text-gray-400" />
              <h3 className="text-base font-black">{lang === 'en' ? 'No Interests Expressed Yet' : 'अभी कोई रुचि निवेदन नहीं भेजा'}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {lang === 'en' ? 'Click "Express Interest" on candidate biodatas to send a respectful match request.' : 'उम्मीदवारों के बायोडाटा पर "रुचि व्यक्त करें" बटन दबाकर संपर्क निवेदन भेजें।'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interestProfiles.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl p-4 border border-gray-200 dark:border-white/10 flex items-center gap-4 cursor-pointer hover:border-pink-500 transition-all"
                >
                  <img src={p.photoUrl} alt={p.fullName} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">{p.fullName}</h4>
                      <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black rounded-md">
                        Interest Sent
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold">{p.city}, {p.state} • {p.subCategory}</p>
                    <p className="text-[11px] text-[#E91E63] font-bold truncate">Contact: {isPremiumUser ? p.contactPhone : p.contactPhone.substring(0, 8) + '*****'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD PROFILE TAB */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg space-y-5">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <User size={20} className="text-[#E91E63]" />
              <span>{lang === 'en' ? 'Create Jain Matrimonial Profile' : 'नया जैन बायोडाटा पंजीकृत करें'}</span>
            </h2>
            <p className="text-xs text-gray-500 font-bold mt-1">
              {lang === 'en' ? 'Fill accurate candidate and sub-caste information for family match seekers.' : 'उपजाति (परवार, गोलापूर्व, खंडेलवाल आदि) एवं परिवार की सही जानकारी दर्ज करें।'}
            </p>
          </div>

          {formSuccess ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
              <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
              <h3 className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'Biodata Registered Successfully!' : 'बायोडाटा सफलतापूर्वक पंजीकृत हो गया!'}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'en' ? 'Redirecting to browse page...' : 'मुख्य खोज पृष्ठ पर भेजा जा रहा है...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Full Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Priyanshu Jain"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Gender *</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  >
                    <option value="male">Groom (वर / पुरुष)</option>
                    <option value="female">Bride (वधू / महिला)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    value={formAge}
                    onChange={e => setFormAge(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Height *</label>
                  <input
                    type="text"
                    value={formHeight}
                    onChange={e => setFormHeight(e.target.value)}
                    placeholder="e.g. 5'9&quot;"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Sampraday *</label>
                  <select
                    value={formSampraday}
                    onChange={e => setFormSampraday(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  >
                    <option value="Digambar">Digambar Jain (दिगंबर)</option>
                    <option value="Swetambar Murtipujak">Swetambar Murtipujak (मूर्तिपूजक)</option>
                    <option value="Sthanakvasi">Sthanakvasi (स्थानकवासी)</option>
                    <option value="Terapanthi">Terapanthi (तेरापंथी)</option>
                    <option value="Kanji Panth">Kanji Panth (कांजी पंथ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Sub-Caste / Jati (उपजाति) *</label>
                  <select
                    value={formSubCat}
                    onChange={e => setFormSubCat(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  >
                    <option value="Parwar (परवार)">Parwar Digambar (परवार)</option>
                    <option value="Golapurv (गोलापूर्व)">Golapurv Digambar (गोलापूर्व)</option>
                    <option value="Khandelwal (खंडेलवाल)">Khandelwal Digambar (खंडेलवाल)</option>
                    <option value="Oswal (ओसवाल)">Oswal Jain (ओसवाल)</option>
                    <option value="Porwal / Podwal (पोड़वाल)">Porwal / Podwal (पोड़वाल)</option>
                    <option value="Humad (हुम्मड़)">Humad Jain (हुम्मड़)</option>
                    <option value="Saitwal (सैतवाल)">Saitwal Jain (सैतवाल)</option>
                    <option value="Jaiswal (जायसवाल)">Jaiswal Jain (जायसवाल)</option>
                    <option value="Shrimal (श्रीमाल)">Shrimal Jain (श्रीमाल)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Gotra</label>
                  <input
                    type="text"
                    value={formGotra}
                    onChange={e => setFormGotra(e.target.value)}
                    placeholder="e.g. Kashyap / Gautam / Vatsa"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Education *</label>
                  <input
                    type="text"
                    required
                    value={formEducation}
                    onChange={e => setFormEducation(e.target.value)}
                    placeholder="e.g. B.Tech CS, CA, MBA, M.D."
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Profession & Income</label>
                  <input
                    type="text"
                    value={formProfession}
                    onChange={e => setFormProfession(e.target.value)}
                    placeholder="e.g. Software Engineer / Business Owner"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">City & State *</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={e => setFormCity(e.target.value)}
                    placeholder="e.g. Sagar, MP / Jaipur, RJ"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Phone Number (For Verified Connect) *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Dietary Habits</label>
                  <select
                    value={formDiet}
                    onChange={e => setFormDiet(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                  >
                    <option value="Pure Jain (Sunset Chovisi)">Pure Jain (Sunset Chovisi / सूर्यास्त पूर्व)</option>
                    <option value="Jain (No Root Veg)">Jain (No Root Vegetables / कंदमूल त्यागी)</option>
                    <option value="Vegetarian">Pure Vegetarian (शुद्ध शाकाहारी)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Family & Bio Description</label>
                <textarea
                  rows={3}
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  placeholder="Describe family background, religious upbringing, and expectations..."
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E91E63] hover:bg-pink-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                Submit Biodata for Verification
              </button>
            </form>
          )}
        </div>
      )}

      {/* FULL BIODATA MODAL */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border border-pink-500/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Top Candidate Profile Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
              <img src={selectedProfile.photoUrl} alt={selectedProfile.fullName} className="w-20 h-20 rounded-2xl object-cover border-2 border-pink-500/40 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white truncate">{selectedProfile.fullName}</h2>
                  {selectedProfile.verifiedTrust && (
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-md flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={12} /> Verified Family
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#E91E63] font-black mt-0.5">{selectedProfile.subCategory} • {selectedProfile.sampraday}</p>
                <p className="text-xs text-gray-500 font-bold">{selectedProfile.age} Yrs, {selectedProfile.height} • {selectedProfile.city}, {selectedProfile.state}</p>
              </div>
            </div>

            {/* Biodata Details Table */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-black text-gray-400 block">Gotra</span>
                <span className="text-gray-800 dark:text-gray-200">{selectedProfile.gotra}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-black text-gray-400 block">Manglik Status</span>
                <span className="text-gray-800 dark:text-gray-200">{selectedProfile.manglik}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-black text-gray-400 block">Education</span>
                <span className="text-gray-800 dark:text-gray-200">{selectedProfile.education}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-black text-gray-400 block">Profession & Annual CTC</span>
                <span className="text-gray-800 dark:text-gray-200">{selectedProfile.profession} ({selectedProfile.annualIncome})</span>
              </div>
            </div>

            {/* Family Background */}
            <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded-2xl space-y-2 text-xs font-bold">
              <h4 className="text-xs uppercase font-black text-[#E91E63] flex items-center gap-1.5">
                <UserCheck size={14} /> Family Background Details
              </h4>
              <p><span className="text-gray-500">Father's Profession:</span> {selectedProfile.fatherOccupation}</p>
              <p><span className="text-gray-500">Mother's Profession:</span> {selectedProfile.motherOccupation}</p>
              <p><span className="text-gray-500">Siblings:</span> {selectedProfile.siblings}</p>
              <p><span className="text-gray-500">Diet & Rituals:</span> {selectedProfile.dietaryHabit} • {selectedProfile.dailyRituals}</p>
            </div>

            {/* Kundali Guna Milan Astakoot Score */}
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={14} /> Astakoot Kundali Guna Match
                </h4>
                <span className="px-2.5 py-1 bg-emerald-500 text-white font-black text-xs rounded-lg">
                  {selectedProfile.gunaMatchScore} / 36 Match
                </span>
              </div>

              {isPremiumUser ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-bold">
                  <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-center">
                    <span className="text-gray-400 block">Varna</span>
                    <span className="text-emerald-600 font-black">{selectedProfile.gunaBreakdown.varna}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-center">
                    <span className="text-gray-400 block">Vashya</span>
                    <span className="text-emerald-600 font-black">{selectedProfile.gunaBreakdown.vashya}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-center">
                    <span className="text-gray-400 block">Tara</span>
                    <span className="text-emerald-600 font-black">{selectedProfile.gunaBreakdown.tara}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-center">
                    <span className="text-gray-400 block">Yoni</span>
                    <span className="text-emerald-600 font-black">{selectedProfile.gunaBreakdown.yoni}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center space-y-1">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    🔒 Full 8-Factor Ashtakoot Breakdown & Kundali Chart is available for Shravak Ratnam Members.
                  </p>
                </div>
              )}
            </div>

            {/* Direct Contact Action */}
            <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex items-center gap-3">
              {isPremiumUser ? (
                <a
                  href={`https://wa.me/${selectedProfile.contactPhone.replace(/[^0-9]/g, '')}?text=Jai%20Jinendra!%20I%20saw%20your%20biodata%20on%20Jain%20Matrimonial%20Portal.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Direct WhatsApp Connect ({selectedProfile.contactPhone})</span>
                </a>
              ) : (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer border border-amber-300"
                >
                  <Lock size={16} />
                  <span>Unlock Verified Contact ({selectedProfile.contactPhone.substring(0, 8)}*****)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHRAVAK RATNAM PREMIUM MEMBERSHIP MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
              <Crown size={32} className="fill-amber-500" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                SHRAVAK RATNAM PREMIUM MEMBERSHIP
              </span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mt-2">
                {lang === 'en' ? 'Unlock Complete Family Contacts & Privacy' : 'श्रावक रत्नम प्रीमियम सदस्यता'}
              </h2>
              <p className="text-xs text-gray-500 font-bold mt-1">
                {lang === 'en' ? 'Designed for authentic Jain families seeking direct connection & privacy.' : 'प्रामाणिक जैन परिवारों हेतु सीधे संपर्क एवं गोपनीयता की विशेष सुविधा।'}
              </p>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-left text-xs font-bold space-y-2.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Unmasked Direct Phone Numbers & WhatsApp Connect Links</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Full 8-Factor Ashtakoot Kundali Guna Milan Analysis</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Private Confidential Profile Protection Shield</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Priority Family Matchmaking Support</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-150 dark:border-white/5 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-gray-400 block">Limited Community Offer</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">FREE FOR DEV TEST / COMPLIMENTARY</span>
              </div>
              <span className="text-xs font-black text-emerald-500">100% Free</span>
            </div>

            <button
              onClick={() => togglePremiumMembership(true)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl hover:scale-[1.01] active:scale-95 transition-all cursor-pointer border border-amber-300"
            >
              Activate Shravak Ratnam Premium Now
            </button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={18} className="text-[#E91E63]" />
                <span>About Jain Matrimonial Portal</span>
              </h3>
              <button onClick={() => setHelpOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed font-bold">
              <p>• Authentic sub-caste categorizations: Parwar, Golapurv, Khandelwal, Oswal, Porwal, Humad, Saitwal, Jaiswal.</p>
              <p>• Full Ashtakoot Kundali Guna Milan scoring out of 36.</p>
              <p>• Shravak Ratnam Premium unlocks direct phone numbers, WhatsApp links & confidential profile protection.</p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-xl font-black text-xs uppercase tracking-wider"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
