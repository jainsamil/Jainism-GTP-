import React, { useState, useEffect } from 'react';
import { 
  Heart, Search, Filter, Plus, User, ArrowLeft, Phone, Mail, MapPin, 
  Sparkles, ShieldCheck, CheckCircle2, Globe, Star, Calendar, Briefcase, 
  GraduationCap, Eye, X, Send, Check, Bookmark, BookmarkCheck, ChevronRight, 
  MessageCircle, HelpCircle, Lock, Unlock, Crown, FileText, Download, Share2,
  ShieldAlert, Award, UserCheck, EyeOff, AlertCircle, AlertTriangle, 
  RefreshCw, Clock, Sliders, IndianRupee, Shield, UserX, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  MatrimonialProfile, 
  ProfileStatus, 
  VivahDashboardStats,
  VivahMembershipPlan,
  JainSampraday 
} from '../services/vivah/types';
import { 
  vivahService, 
  DEFAULT_MEMBERSHIP_PLANS, 
  DEFAULT_VIVAH_SETTINGS 
} from '../services/vivah/vivahService';
import { 
  MADHYA_PRADESH_CITIES, 
  OTHER_MAJOR_INDIAN_CITIES, 
  JAIN_COMMUNITIES, 
  JAIN_GOTRAS, 
  EDUCATION_LEVELS, 
  OCCUPATIONS, 
  calculateAgeFromDob 
} from '../data/communityLocationData';
import { VivahAdminSection } from '../components/vivah/VivahAdminSection';

export default function MatrimonialPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, role } = useAuth();
  const isHindi = language === 'hi';

  // Live Firestore State
  const [approvedProfiles, setApprovedProfiles] = useState<MatrimonialProfile[]>([]);
  const [myProfile, setMyProfile] = useState<MatrimonialProfile | null>(null);
  const [stats, setStats] = useState<VivahDashboardStats | null>(null);
  const [membershipPlans, setMembershipPlans] = useState<VivahMembershipPlan[]>(DEFAULT_MEMBERSHIP_PLANS);
  const [loading, setLoading] = useState(true);

  // View & Filter States
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my_profile' | 'shortlist' | 'membership' | 'admin'>('browse');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedMpCity, setSelectedMpCity] = useState<string>('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('all'); // '18-25', '26-30', '31-35', '36-40', '41-50', 'all'
  const [chovisiOnly, setChovisiOnly] = useState(false);
  const [mpPriorityOnly, setMpPriorityOnly] = useState(false);
  const [golapurvOnly, setGolapurvOnly] = useState(false);

  // Shortlist & Interests
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentInterests, setSentInterests] = useState<string[]>([]);
  const [selectedProfileDetail, setSelectedProfileDetail] = useState<MatrimonialProfile | null>(null);

  // Modals
  const [showContactModal, setShowContactModal] = useState<MatrimonialProfile | null>(null);
  const [showKundaliModal, setShowKundaliModal] = useState<MatrimonialProfile | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Registration Form State
  const [formFullName, setFormFullName] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female'>('male');
  const [formDob, setFormDob] = useState('');
  const [formHeight, setFormHeight] = useState("5'8\"");
  const [formSampraday, setFormSampraday] = useState<JainSampraday>('Digambar');
  const [formCommunity, setFormCommunity] = useState('Golapurv (गोलापूर्व)');
  const [formCustomCommunity, setFormCustomCommunity] = useState('');
  const [formGotra, setFormGotra] = useState('Gautam (गौतम)');
  const [formMaritalStatus, setFormMaritalStatus] = useState<'Never Married' | 'Divorced' | 'Widowed'>('Never Married');
  const [formEducation, setFormEducation] = useState('B.Tech / B.E. / Engineering');
  const [formProfession, setFormProfession] = useState('Software Engineer / IT Professional');
  const [formIncome, setFormIncome] = useState('₹18 LPA');
  const [formState, setFormState] = useState('Madhya Pradesh');
  const [formCity, setFormCity] = useState('Sagar');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formDietaryHabit, setFormDietaryHabit] = useState<'Pure Jain (Sunset Chovisi)' | 'Jain (No Root Veg)' | 'Vegetarian'>('Pure Jain (Sunset Chovisi)');
  const [formDailyRituals, setFormDailyRituals] = useState('Daily Dev Darshan & Jinendra Abhishek');
  const [formManglik, setFormManglik] = useState<'No' | 'Yes' | 'Partial / Anshik'>('No');
  const [formFather, setFormFather] = useState('');
  const [formMother, setFormMother] = useState('');
  const [formSiblings, setFormSiblings] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Calculated Age Indicator
  const liveCalculatedAge = calculateAgeFromDob(formDob);

  // Load Initial Data from Firestore
  const refreshVivahData = async () => {
    setLoading(true);
    try {
      const [approved, dashStats, plans] = await Promise.all([
        vivahService.getApprovedProfiles(),
        vivahService.getDashboardStats(),
        vivahService.getMembershipPlans()
      ]);
      setApprovedProfiles(approved);
      setStats(dashStats);
      setMembershipPlans(plans);

      if (user?.uid) {
        const myP = await vivahService.getUserProfile(user.uid);
        setMyProfile(myP);
      } else {
        // Check local demo profile
        const localUid = localStorage.getItem('vivah_local_user_id') || 'guest_user';
        const myP = await vivahService.getUserProfile(localUid);
        setMyProfile(myP);
      }

      // Load shortlisted and interests from storage
      const savedShortlist = localStorage.getItem('jain_vivah_shortlist');
      if (savedShortlist) setShortlistedIds(JSON.parse(savedShortlist));
      const savedInterests = localStorage.getItem('jain_vivah_interests');
      if (savedInterests) setSentInterests(JSON.parse(savedInterests));
    } catch (err) {
      console.error('Error fetching Vivah data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVivahData();
  }, [user]);

  // Form Pre-fill if user edits existing profile
  const loadProfileIntoForm = (prof: MatrimonialProfile) => {
    setFormFullName(prof.fullName || '');
    setFormGender(prof.gender || 'male');
    setFormDob(prof.dateOfBirth || '');
    setFormHeight(prof.height || "5'8\"");
    setFormSampraday(prof.sampraday || 'Digambar');
    setFormCommunity(prof.subCategory || 'Golapurv (गोलापूर्व)');
    setFormGotra(prof.gotra || 'Gautam (गौतम)');
    setFormMaritalStatus(prof.maritalStatus || 'Never Married');
    setFormEducation(prof.education || 'Graduate');
    setFormProfession(prof.profession || 'Business');
    setFormIncome(prof.annualIncome || '₹15 LPA');
    setFormState(prof.state || 'Madhya Pradesh');
    setFormCity(prof.city || 'Sagar');
    setFormPhone(prof.contactPhone || '');
    setFormEmail(prof.contactEmail || user?.email || '');
    setFormPhotoUrl(prof.photoUrl || '');
    setFormBio(prof.bio || '');
    setFormDietaryHabit(prof.dietaryHabit || 'Pure Jain (Sunset Chovisi)');
    setFormDailyRituals(prof.dailyRituals || 'Daily Dev Darshan');
    setFormManglik(prof.manglik || 'No');
    setFormFather(prof.fatherOccupation || '');
    setFormMother(prof.motherOccupation || '');
    setFormSiblings(prof.siblings || '');
    setActiveTab('create');
  };

  // Submit Profile (100% Free, Status: PENDING_APPROVAL)
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Validation 1: Date of Birth check (18+)
    if (!formDob) {
      setFormError(isHindi ? 'कृपया जन्मतिथि (DOB) दर्ज करें।' : 'Date of Birth (DOB) is required for adult verification.');
      return;
    }
    const age = calculateAgeFromDob(formDob);
    if (age < 18) {
      setFormError(
        isHindi 
          ? `आयु सीमा त्रुटि: जैन विवाह पोर्टल पर केवल 18 वर्ष या उससे अधिक आयु के वयस्क पंजीकरण कर सकते हैं (वर्तमान आयु: ${age} वर्ष)।`
          : `Underage Registration Prohibited: Only adults aged 18+ can register on Jain Vivah (Calculated age: ${age} yrs).`
      );
      return;
    }

    if (!formFullName.trim() || !formCity.trim() || !formPhone.trim()) {
      setFormError(isHindi ? 'कृपया नाम, शहर और फोन नंबर भरें।' : 'Please provide candidate name, city and contact phone.');
      return;
    }

    setFormSubmitting(true);
    const effectiveUid = user?.uid || localStorage.getItem('vivah_local_user_id') || `user_${Date.now()}`;
    localStorage.setItem('vivah_local_user_id', effectiveUid);

    const subCat = formCommunity === 'other' ? (formCustomCommunity || 'Other Jain') : formCommunity;

    try {
      if (myProfile) {
        // Update existing profile and reset to PENDING_APPROVAL for admin review
        await vivahService.updateUserProfile(effectiveUid, myProfile.id, {
          fullName: formFullName,
          gender: formGender,
          dateOfBirth: formDob,
          height: formHeight,
          sampraday: formSampraday,
          subCategory: subCat,
          gotra: formGotra,
          maritalStatus: formMaritalStatus,
          education: formEducation,
          profession: formProfession,
          annualIncome: formIncome,
          state: formState,
          city: formCity,
          contactPhone: formPhone,
          contactEmail: formEmail || user?.email || '',
          photoUrl: formPhotoUrl || (formGender === 'female' 
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' 
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'),
          bio: formBio,
          dietaryHabit: formDietaryHabit,
          dailyRituals: formDailyRituals,
          manglik: formManglik,
          fatherOccupation: formFather,
          motherOccupation: formMother,
          siblings: formSiblings,
          status: 'PENDING_APPROVAL' // Re-enter review queue
        });
        setFormSuccess(isHindi ? 'बायोडाटा सफलतापूर्वक अपडेट किया गया और समीक्षा के लिए भेजा गया।' : 'Biodata updated and sent for Admin verification.');
      } else {
        // Register brand new profile (₹0 Free)
        const res = await vivahService.registerProfile(effectiveUid, user?.email, {
          fullName: formFullName,
          gender: formGender,
          dateOfBirth: formDob,
          height: formHeight,
          sampraday: formSampraday,
          subCategory: subCat,
          gotra: formGotra,
          maritalStatus: formMaritalStatus,
          education: formEducation,
          profession: formProfession,
          annualIncome: formIncome,
          country: 'India',
          state: formState,
          city: formCity,
          contactPhone: formPhone,
          contactEmail: formEmail || user?.email || '',
          photoUrl: formPhotoUrl || (formGender === 'female' 
            ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' 
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'),
          bio: formBio || 'Devout Jain family seeking a cultured and spiritually inclined life partner.',
          dietaryHabit: formDietaryHabit,
          dailyRituals: formDailyRituals,
          manglik: formManglik,
          fatherOccupation: formFather || 'Business',
          motherOccupation: formMother || 'Homemaker',
          siblings: formSiblings || 'None',
          gunaMatchScore: 33,
          isConfidential: false
        });

        if (!res.success) {
          setFormError(res.error || 'Failed to submit registration.');
          setFormSubmitting(false);
          return;
        }

        setFormSuccess(
          isHindi 
            ? 'पंजीकरण सफल! आपका बायोडाटा ₹0 निःशुल्क जमा किया गया है। एडमिन द्वारा अनुमोदन के बाद यह सार्वजनिक खोज में दिखाई देगा।'
            : 'Registration Successful! Submitted for ₹0 Free. Profile is under Admin Review (PENDING_APPROVAL) before going live.'
        );
      }

      await refreshVivahData();
      setTimeout(() => {
        setActiveTab('my_profile');
        setFormSuccess(null);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Submission error. Please check your network connection.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Interactions
  const toggleShortlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShortlistedIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('jain_vivah_shortlist', JSON.stringify(updated));
      return updated;
    });
  };

  const expressInterest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSentInterests(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('jain_vivah_interests', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter Pipeline for Approved Candidates
  const filteredProfiles = approvedProfiles.filter(p => {
    // 1. Gender Filter
    if (genderFilter !== 'all' && p.gender !== genderFilter) return false;

    // 2. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        p.fullName?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q) ||
        p.gotra?.toLowerCase().includes(q) ||
        p.education?.toLowerCase().includes(q) ||
        p.profession?.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Community Filter
    if (selectedCommunity !== 'all') {
      if (selectedCommunity === 'golapurv' && !p.isGolapurv && !p.subCategory?.toLowerCase().includes('gola')) {
        return false;
      } else if (selectedCommunity !== 'golapurv' && !p.subCategory?.toLowerCase().includes(selectedCommunity.toLowerCase())) {
        return false;
      }
    }

    // 4. Golapurv Checkbox toggle
    if (golapurvOnly && !p.isGolapurv && !p.subCategory?.toLowerCase().includes('gola')) {
      return false;
    }

    // 5. Madhya Pradesh Filter
    if (mpPriorityOnly && !p.isMadhyaPradesh && p.state !== 'Madhya Pradesh' && !MADHYA_PRADESH_CITIES.includes(p.city)) {
      return false;
    }
    if (selectedState !== 'all' && p.state !== selectedState) return false;
    if (selectedMpCity !== 'all' && p.city !== selectedMpCity) return false;

    // 6. Age Range Filter (Calculated from DOB)
    if (ageRangeFilter !== 'all') {
      if (ageRangeFilter === '18-25' && (p.age < 18 || p.age > 25)) return false;
      if (ageRangeFilter === '26-30' && (p.age < 26 || p.age > 30)) return false;
      if (ageRangeFilter === '31-35' && (p.age < 31 || p.age > 35)) return false;
      if (ageRangeFilter === '36-40' && (p.age < 36 || p.age > 40)) return false;
      if (ageRangeFilter === '41-50' && (p.age < 41 || p.age > 50)) return false;
    }

    // 7. Sunset Chovisi
    if (chovisiOnly && !p.dietaryHabit?.includes('Chovisi')) return false;

    return true;
  });

  const shortlistedProfiles = approvedProfiles.filter(p => shortlistedIds.includes(p.id));

  // Check if current user is admin
  const isAdminUser = role === 'admin' || user?.email === 'samiljain0111@gmail.com' || user?.email === 'admin@jainism.com' || localStorage.getItem('adminAccess') === 'true';

  return (
    <div id="jain-vivah-page" className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner: ₹0 Free Registration & Anti-Fake Transparency Notice */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-slate-950 py-2.5 px-4 text-xs font-semibold shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            {isHindi 
              ? '✨ 100% निःशुल्क जैन विवाह मंच • ₹0 पंजीकरण शुल्क • एडमिन द्वारा सत्यापित वास्तविक प्रोफाइल • कोई फर्जी डेटा नहीं' 
              : '✨ 100% Free Jain Vivah • ₹0 Registration Fee • Admin Verified Real Profiles • Zero Fake Data Policy'}
          </span>
        </div>
        {isAdminUser && (
          <button 
            onClick={() => setActiveTab(activeTab === 'admin' ? 'browse' : 'admin')}
            className="hidden sm:flex items-center gap-1.5 bg-slate-950 text-amber-300 text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider hover:bg-slate-900 border border-amber-400"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{activeTab === 'admin' ? 'Exit Admin View' : 'Vivah Admin Portal'}</span>
          </button>
        )}
      </div>

      {/* Main Header / Hero */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  जैन विवाह सेवा
                </span>
                <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ₹0 Free Registration
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1 font-serif tracking-tight">
                {isHindi ? 'जैन विवाह मंडल एवं जीवनसाथी खोज' : 'Jain Matrimonial & Vivah Seva'}
              </h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'browse' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isHindi ? 'खोजें (स्वीकृत)' : 'Browse Profiles'}</span>
              <span className="bg-slate-950/40 px-1.5 py-0.5 rounded text-[11px]">
                {approvedProfiles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'create' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{myProfile ? (isHindi ? 'बायोडाटा संपादित करें' : 'Edit Biodata') : (isHindi ? 'निःशुल्क पंजीकरण (₹0)' : 'Register Profile (₹0)')}</span>
            </button>

            {myProfile && (
              <button
                onClick={() => setActiveTab('my_profile')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  activeTab === 'my_profile' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{isHindi ? 'मेरी स्थिति' : 'My Status'}</span>
                <span className={`w-2 h-2 rounded-full ${myProfile.status === 'APPROVED' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('shortlist')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'shortlist' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>{isHindi ? 'शॉर्टलिस्ट' : 'Shortlisted'} ({shortlistedIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'membership' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{isHindi ? 'सदस्यता (₹0)' : 'Membership (₹0)'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* User's Profile Review Status Banner (if user has submitted a profile) */}
        {myProfile && activeTab !== 'admin' && (
          <div className={`p-4 rounded-2xl border transition shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            myProfile.status === 'APPROVED' 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
              : myProfile.status === 'PENDING_APPROVAL'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : myProfile.status === 'CORRECTION_REQUIRED'
              ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-start gap-3">
              {myProfile.status === 'APPROVED' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : myProfile.status === 'PENDING_APPROVAL' ? (
                <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base">
                    {myProfile.status === 'APPROVED' && (isHindi ? 'आपकी प्रोफाइल स्वीकृत एवं लाइव है' : 'Your Profile is Verified & Live')}
                    {myProfile.status === 'PENDING_APPROVAL' && (isHindi ? 'प्रोफ़ाइल एडमिन समीक्षा में है (PENDING_APPROVAL)' : 'Profile Under Admin Review (PENDING_APPROVAL)')}
                    {myProfile.status === 'CORRECTION_REQUIRED' && (isHindi ? 'विवरण में सुधार आवश्यक है (Correction Required)' : 'Action Needed: Correction Requested by Admin')}
                    {myProfile.status === 'REJECTED' && (isHindi ? 'प्रोफ़ाइल अस्वीकृत (Rejected)' : 'Profile Submission Rejected')}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-900 border border-slate-700">
                    {myProfile.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {myProfile.status === 'PENDING_APPROVAL' && (isHindi 
                    ? 'सुरक्षा एवं प्रामाणिकता के लिए सभी नए बायोडाटा एडमिन समीक्षा के बाद ही खोज में दिखाई देते हैं। आपका पंजीकरण ₹0 पूर्णतः निःशुल्क है।' 
                    : 'For trust & privacy, newly submitted biodatas are verified by admin before appearing in public search. Registration is 100% free.')}
                  {myProfile.status === 'CORRECTION_REQUIRED' && `Admin Note: ${myProfile.correctionNote || 'Please update your details.'}`}
                  {myProfile.status === 'APPROVED' && (isHindi ? 'योग्य जैन परिवार एवं प्रत्याशी आपके स्वीकृत बायोडाटा को देख सकते हैं।' : 'Eligible Jain candidates can now discover and shortlist your approved profile.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => loadProfileIntoForm(myProfile)}
              className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-xl text-xs font-semibold transition border border-slate-700 whitespace-nowrap"
            >
              {isHindi ? 'बायोडाटा संपादित करें' : 'Edit / Update Biodata'}
            </button>
          </div>
        )}

        {/* REAL DYNAMIC COMMUNITY COUNTERS & GOAL TRACKER (ZERO FAKE PROFILES) */}
        {stats && activeTab === 'browse' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  {isHindi ? 'समुदाय लक्ष्य एवं वास्तविक डेटा स्थिति' : 'Community Goal & Authentic Database Metrics'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHindi 
                    ? 'हम केवल वास्तविक स्वीकृत प्रोफाइलों की सटीक संख्या दिखाते हैं। कोई स्वचालित डमी या फर्जी खाते नहीं बनाए जाते।' 
                    : 'Strict Data Honesty: We display live counts from verified database entries. Zero dummy or synthetic accounts.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Approved: <strong className="text-emerald-300">{stats.totalApprovedProfiles}</strong>
                </span>
              </div>
            </div>

            {/* Target Capacity Progress (Boys 300 / Girls 300) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-950/70 border border-blue-500/20 rounded-xl p-3">
                <div className="flex justify-between text-xs text-blue-300 font-semibold">
                  <span>{isHindi ? 'वर (Boys Approved)' : 'Boys Approved'}</span>
                  <span>{stats.approvedBoys} / {stats.targetBoys}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (stats.approvedBoys / stats.targetBoys) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{stats.targetBoys} Target Capacity Goal</div>
              </div>

              <div className="bg-slate-950/70 border border-pink-500/20 rounded-xl p-3">
                <div className="flex justify-between text-xs text-pink-300 font-semibold">
                  <span>{isHindi ? 'वधू (Girls Approved)' : 'Girls Approved'}</span>
                  <span>{stats.approvedGirls} / {stats.targetGirls}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-pink-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (stats.approvedGirls / stats.targetGirls) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{stats.targetGirls} Target Capacity Goal</div>
              </div>

              <div className="bg-slate-950/70 border border-orange-500/20 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-300 font-semibold">{isHindi ? 'मध्य प्रदेश प्रोफाइल' : 'Madhya Pradesh'}</div>
                  <div className="text-xl font-bold text-orange-400 mt-0.5">{stats.madhyaPradeshProfiles}</div>
                  <div className="text-[10px] text-slate-400">Sagar, Damoh, Jabalpur, etc.</div>
                </div>
                <MapPin className="w-6 h-6 text-orange-500/40" />
              </div>

              <div className="bg-slate-950/70 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-300 font-semibold">{isHindi ? 'गोलापूर्व समाज' : 'Golapurv Samaj'}</div>
                  <div className="text-xl font-bold text-purple-400 mt-0.5">{stats.golapurvProfiles}</div>
                  <div className="text-[10px] text-slate-400">Digambar Jain Community</div>
                </div>
                <Award className="w-6 h-6 text-purple-500/40" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BROWSE APPROVED PROFILES */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Search query input */}
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isHindi ? 'नाम, शहर, गोत्र, पेशा (CA, Engineer, Doctor), शिक्षा से खोजें...' : 'Search by name, city, Gotra, profession (Doctor, CA, Engineer), degree...'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Gender toggle */}
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setGenderFilter('all')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      genderFilter === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {isHindi ? 'सभी' : 'All'}
                  </button>
                  <button
                    onClick={() => setGenderFilter('male')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      genderFilter === 'male' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {isHindi ? 'वर (Boys)' : 'Boys'}
                  </button>
                  <button
                    onClick={() => setGenderFilter('female')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                      genderFilter === 'female' ? 'bg-pink-600 text-white shadow' : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {isHindi ? 'वधू (Girls)' : 'Girls'}
                  </button>
                </div>
              </div>

              {/* Advanced Filter Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
                {/* Age Filter */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{isHindi ? 'आयु वर्ग (Age Range)' : 'Age Range'}</label>
                  <select
                    value={ageRangeFilter}
                    onChange={e => setAgeRangeFilter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Ages (18+)</option>
                    <option value="18-25">18 - 25 Years</option>
                    <option value="26-30">26 - 30 Years</option>
                    <option value="31-35">31 - 35 Years</option>
                    <option value="36-40">36 - 40 Years</option>
                    <option value="41-50">41 - 50 Years</option>
                  </select>
                </div>

                {/* Jain Community */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{isHindi ? 'जैन उपजाति / समुदाय' : 'Jain Community'}</label>
                  <select
                    value={selectedCommunity}
                    onChange={e => setSelectedCommunity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Jain Communities</option>
                    <option value="golapurv">Golapurv (गोलापूर्व)</option>
                    <option value="parwar">Parwar (परवार)</option>
                    <option value="khandelwal">Khandelwal (खंडेलवाल)</option>
                    <option value="oswal">Oswal (ओसवाल)</option>
                    <option value="porwal">Porwal / Podwal (पोड़वाल)</option>
                    <option value="humad">Humad (हुम्मड़)</option>
                    <option value="saitwal">Saitwal (सैतवाल)</option>
                    <option value="jaiswal">Jaiswal (जायसवाल)</option>
                  </select>
                </div>

                {/* State Priority */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{isHindi ? 'राज्य (State)' : 'State'}</label>
                  <select
                    value={selectedState}
                    onChange={e => {
                      setSelectedState(e.target.value);
                      if (e.target.value !== 'Madhya Pradesh') setSelectedMpCity('all');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All States (India / Global)</option>
                    <option value="Madhya Pradesh">Madhya Pradesh (Priority)</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                {/* MP Cities dropdown */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{isHindi ? 'म.प्र. प्रमुख शहर' : 'MP City'}</label>
                  <select
                    value={selectedMpCity}
                    onChange={e => setSelectedMpCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All MP Cities</option>
                    {MADHYA_PRADESH_CITIES.slice(0, 15).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Toggle Checkboxes */}
                <div className="flex flex-col justify-end gap-1.5 pt-1">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mpPriorityOnly}
                      onChange={e => setMpPriorityOnly(e.target.checked)}
                      className="rounded text-amber-500 w-3.5 h-3.5"
                    />
                    <span>MP Native Only</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chovisiOnly}
                      onChange={e => setChovisiOnly(e.target.checked)}
                      className="rounded text-amber-500 w-3.5 h-3.5"
                    />
                    <span>Sunset Chovisi</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Loading verified Jain matrimonial records...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">
                  {isHindi ? 'कोई स्वीकृत प्रोफाइल नहीं मिली' : 'No Matching Approved Profiles Found'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  {isHindi 
                    ? 'हम कड़ाई से "शून्य फर्जी प्रोफाइल" नीति का पालन करते हैं। जैसे ही नए उम्मीदवार ₹0 में पंजीकरण करेंगे और एडमिन द्वारा सत्यापित होंगे, वे यहां प्रदर्शित होंगे।'
                    : 'We strictly follow a zero-fake-profile policy. Be among the first to register an authentic Jain candidate profile for ₹0 completely free.'}
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg transition"
                >
                  {isHindi ? 'पहला निःशुल्क बायोडाटा पंजीकृत करें (₹0)' : 'Register First Profile (100% Free)'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfiles.map(profile => {
                  const isFav = shortlistedIds.includes(profile.id);
                  const isSent = sentInterests.includes(profile.id);

                  return (
                    <div
                      key={profile.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top Photo & Identity Header */}
                        <div className="relative h-56 bg-slate-950 overflow-hidden">
                          <img
                            src={profile.photoUrl || (profile.gender === 'female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400')}
                            alt={profile.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = profile.gender === 'female' 
                                ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' 
                                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>

                          {/* Badges on top */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                              {profile.subCategory || 'Jain'}
                            </span>
                            {profile.isMadhyaPradesh && (
                              <span className="bg-orange-950/80 text-orange-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-orange-500/40">
                                MP Native
                              </span>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <button
                              onClick={(e) => toggleShortlist(profile.id, e)}
                              className={`p-2 rounded-full backdrop-blur-md transition ${
                                isFav ? 'bg-rose-500 text-white' : 'bg-slate-950/70 text-slate-300 hover:text-rose-400'
                              }`}
                              title={isFav ? 'Shortlisted' : 'Shortlist'}
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                            </button>
                          </div>

                          {/* Candidate Name & Age at bottom of image */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white drop-shadow-md truncate">
                                {profile.fullName}
                              </h4>
                              <span className="text-xs bg-slate-900/90 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                                {profile.age} Yrs • {profile.height}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">{profile.city}, {profile.state}</span>
                            </p>
                          </div>
                        </div>

                        {/* Bio & Details Body */}
                        <div className="p-4 space-y-3 text-xs text-slate-300">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-slate-200">
                              <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="truncate font-medium">{profile.education}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-200">
                              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="truncate font-medium">{profile.profession} ({profile.annualIncome})</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Gotra: <strong className="text-slate-200">{profile.gotra}</strong> • {profile.sampraday}</span>
                            </div>
                          </div>

                          {/* Dietary & Vow pill */}
                          <div className="bg-slate-950/80 rounded-xl p-2.5 text-[11px] space-y-1 border border-slate-800">
                            <div className="text-slate-400">
                              <strong className="text-amber-400">Diet & Rituals:</strong> {profile.dietaryHabit} ({profile.dailyRituals})
                            </div>
                            <div className="text-slate-400 truncate">
                              <strong className="text-slate-300">Family:</strong> Father: {profile.fatherOccupation}
                            </div>
                          </div>

                          {/* Short bio preview */}
                          {profile.bio && (
                            <p className="text-[11px] text-slate-400 italic line-clamp-2">
                              "{profile.bio}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedProfileDetail(profile)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'पूरा बायोडाटा' : 'View Biodata'}</span>
                        </button>

                        <button
                          onClick={(e) => expressInterest(profile.id, e)}
                          className={`text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow ${
                            isSent 
                              ? 'bg-emerald-700 text-white cursor-default'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                          }`}
                        >
                          {isSent ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'प्रस्ताव भेजा गया' : 'Interest Sent'}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'सम्पर्क प्रस्ताव' : 'Express Interest'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER OR EDIT PROFILE (100% FREE ₹0) */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold uppercase border border-emerald-500/30">
                  ₹0 Registration Fee
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                  Admin Verification Required
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 font-serif">
                {myProfile ? (isHindi ? 'बायोडाटा संपादित करें' : 'Update Jain Matrimonial Biodata') : (isHindi ? 'निशुल्क जैन विवाह पंजीकरण (₹0)' : 'Register Authentic Jain Matrimonial Profile (₹0)')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isHindi 
                  ? 'सभी पंजीकरण 100% निःशुल्क हैं। केवल 18+ वयस्क उम्मीदवार ही पंजीकरण के पात्र हैं। जमा करने के बाद एडमिन द्वारा सत्यापन किया जाएगा।' 
                  : 'Lifelong ₹0 free registration. Strictly for adult candidates (18+). Submitted profiles are verified by Admin before public search.'}
              </p>
            </div>

            {formError && (
              <div className="bg-rose-950/60 border border-rose-500/40 text-rose-200 p-4 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProfile} className="space-y-5 text-xs">
              {/* Section 1: Basic & Adult DOB Validation */}
              <div className="space-y-4">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                  1. Candidate Identity & Age Validation (DOB Mandate)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Candidate Full Name (उम्मीदवार का पूरा नाम) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formFullName}
                      onChange={e => setFormFullName(e.target.value)}
                      placeholder="e.g. Samyak Jain"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Gender (लिंग) *
                    </label>
                    <select
                      value={formGender}
                      onChange={e => setFormGender(e.target.value as 'male' | 'female')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="male">Male Candidate (वर / पुरुष)</option>
                      <option value="female">Female Candidate (वधू / महिला)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Date of Birth (जन्म तिथि) *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDob}
                      onChange={e => setFormDob(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <div className="mt-1 text-[11px]">
                      {formDob ? (
                        liveCalculatedAge >= 18 ? (
                          <span className="text-emerald-400 font-semibold">
                            ✓ Calculated Age: {liveCalculatedAge} Years (Adult Verified)
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold">
                            ✗ Calculated Age: {liveCalculatedAge} Years (Candidate must be 18+)
                          </span>
                        )
                      ) : (
                        <span className="text-slate-500">Age will be automatically verified from DOB.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Height (ऊंचाई) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formHeight}
                      onChange={e => setFormHeight(e.target.value)}
                      placeholder='e.g. 5&#39;9"'
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Jain Community, Sampraday & Gotra */}
              <div className="space-y-4">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                  2. Jain Community, Sampraday & Gotra (Voluntary Selection)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Jain Sampraday (संप्रदाय) *
                    </label>
                    <select
                      value={formSampraday}
                      onChange={e => setFormSampraday(e.target.value as JainSampraday)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Digambar">Digambar (दिगंबर)</option>
                      <option value="Swetambar Murtipujak">Swetambar Murtipujak</option>
                      <option value="Sthanakvasi">Sthanakvasi</option>
                      <option value="Terapanthi">Terapanthi</option>
                      <option value="Kanji Panth">Kanji Panth</option>
                      <option value="Other Jain">Other Jain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Jain Sub-caste / Community *
                    </label>
                    <select
                      value={formCommunity}
                      onChange={e => setFormCommunity(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      {JAIN_COMMUNITIES.map(c => (
                        <option key={c.id} value={c.labelEn}>{c.labelEn}</option>
                      ))}
                      <option value="other">Other / Custom</option>
                    </select>
                  </div>

                  {formCommunity === 'other' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Specify Community Name *
                      </label>
                      <input
                        type="text"
                        value={formCustomCommunity}
                        onChange={e => setFormCustomCommunity(e.target.value)}
                        placeholder="Enter sub-caste"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Self Gotra (गोत्र) *
                    </label>
                    <select
                      value={formGotra}
                      onChange={e => setFormGotra(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      {JAIN_GOTRAS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Education & Career */}
              <div className="space-y-4">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                  3. Education & Profession
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Education (शिक्षा) *</label>
                    <select
                      value={formEducation}
                      onChange={e => setFormEducation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    >
                      {EDUCATION_LEVELS.map(ed => (
                        <option key={ed} value={ed}>{ed}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Profession (व्यवसाय/नौकरी) *</label>
                    <select
                      value={formProfession}
                      onChange={e => setFormProfession(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    >
                      {OCCUPATIONS.map(occ => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Annual Income (वार्षिक आय)</label>
                    <input
                      type="text"
                      value={formIncome}
                      onChange={e => setFormIncome(e.target.value)}
                      placeholder="e.g. ₹20 LPA"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Location (Madhya Pradesh Priority) */}
              <div className="space-y-4">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                  4. Location & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">State (राज्य) *</label>
                    <select
                      value={formState}
                      onChange={e => setFormState(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    >
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City / Native Place (शहर) *</label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={e => setFormCity(e.target.value)}
                      placeholder="e.g. Sagar, Damoh, Jabalpur, Bhopal, Indore"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Contact Phone (गोपनीय / Private) *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="+91 98260 XXXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Not displayed publicly without mutual consent.</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      value={formPhotoUrl}
                      onChange={e => setFormPhotoUrl(e.target.value)}
                      placeholder="Paste image link (Unsplash or direct image URL)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Jain Values & Family */}
              <div className="space-y-4">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                  5. Jain Dietary Habits & Family Background
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Dietary Vow (आहार नियम)</label>
                    <select
                      value={formDietaryHabit}
                      onChange={e => setFormDietaryHabit(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    >
                      <option value="Pure Jain (Sunset Chovisi)">Pure Jain (Sunset Chovisi - सूर्यास्त पूर्व भोजन)</option>
                      <option value="Jain (No Root Veg)">Jain (No Root Veg - जमीकंद त्याग)</option>
                      <option value="Vegetarian">Vegetarian (शुद्ध शाकाहारी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Father's Occupation</label>
                    <input
                      type="text"
                      value={formFather}
                      onChange={e => setFormFather(e.target.value)}
                      placeholder="e.g. Agro Merchant in Sagar"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mother's Occupation</label>
                    <input
                      type="text"
                      value={formMother}
                      onChange={e => setFormMother(e.target.value)}
                      placeholder="e.g. Homemaker / Teacher"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Biodata Summary / Bio</label>
                  <textarea
                    rows={3}
                    value={formBio}
                    onChange={e => setFormBio(e.target.value)}
                    placeholder="Describe religious upbringing, family values, and partner expectations..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>₹0 Registration Fee • No Card Required • Strict Privacy</span>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting || liveCalculatedAge < 18}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm transition shadow-xl flex items-center justify-center gap-2"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{myProfile ? 'Update & Re-Submit Biodata' : 'Submit Profile for Admin Review (₹0)'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: USER'S OWN PROFILE DETAIL */}
        {activeTab === 'my_profile' && myProfile && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  myProfile.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                }`}>
                  Status: {myProfile.status}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-2">{myProfile.fullName}</h3>
                <p className="text-xs text-slate-400">{myProfile.gender === 'male' ? 'Boy Candidate' : 'Girl Candidate'} • {myProfile.age} Yrs (DOB: {myProfile.dateOfBirth})</p>
              </div>

              <button
                onClick={() => loadProfileIntoForm(myProfile)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 font-semibold"
              >
                Edit Biodata
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Community & Gotra</span>
                <span className="font-semibold text-slate-100">{myProfile.subCategory} ({myProfile.gotra})</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Location</span>
                <span className="font-semibold text-slate-100">{myProfile.city}, {myProfile.state}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Education</span>
                <span className="font-semibold text-slate-100">{myProfile.education}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Profession</span>
                <span className="font-semibold text-slate-100">{myProfile.profession}</span>
              </div>
            </div>

            {myProfile.status === 'CORRECTION_REQUIRED' && (
              <div className="bg-yellow-950/60 border border-yellow-500/40 text-yellow-200 p-4 rounded-xl text-xs space-y-1">
                <strong>Admin Correction Note:</strong>
                <p>{myProfile.correctionNote}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHORTLISTED PROFILES */}
        {activeTab === 'shortlist' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-serif">
              {isHindi ? 'आपकी शॉर्टलिस्ट की गई प्रोफाइल' : 'Your Shortlisted Candidates'} ({shortlistedProfiles.length})
            </h3>

            {shortlistedProfiles.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                No candidates shortlisted yet. Click the heart icon on any biodata to save for later.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shortlistedProfiles.map(p => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.photoUrl} 
                        alt={p.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="font-bold text-slate-100 text-sm">{p.fullName}</div>
                        <div className="text-xs text-slate-400">{p.age} yrs • {p.city}, {p.state}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleShortlist(p.id)}
                      className="p-2 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-xl"
                      title="Remove from shortlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MEMBERSHIP TIERS (₹0 FREE BY DEFAULT) */}
        {activeTab === 'membership' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs bg-emerald-950 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                100% Free Community Service
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-100">
                Jain Vivah Membership Tiers & Samaj Seva
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                All matrimonial registrations, biodata discovery, and partner searches are completely ₹0 free for all Jain families.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {membershipPlans.map(plan => (
                <div 
                  key={plan.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md uppercase">
                        {plan.tier}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complimentary (₹0)
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 mt-3">{plan.name}</h3>
                    <div className="text-3xl font-black text-amber-400 my-2">
                      ₹{plan.price} <span className="text-xs text-slate-400 font-normal">/ {plan.durationDays} Days</span>
                    </div>
                    <p className="text-xs text-slate-400">{plan.description}</p>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Plan is active and available complimentary to all Jain candidates.')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition border border-slate-700"
                  >
                    Active Tier (₹0 Free)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ADMIN SECTION EMBEDDED */}
        {activeTab === 'admin' && isAdminUser && (
          <VivahAdminSection 
            adminEmail={user?.email || 'admin@jainism.com'}
            adminId={user?.uid || 'admin_master'}
            onRefreshParent={refreshVivahData}
          />
        )}
      </div>

      {/* FULL DETAIL MODAL */}
      {selectedProfileDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedProfileDetail.photoUrl} 
                  alt={selectedProfileDetail.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{selectedProfileDetail.fullName}</h3>
                  <p className="text-xs text-slate-400">{selectedProfileDetail.age} yrs • {selectedProfileDetail.height} • {selectedProfileDetail.city}, {selectedProfileDetail.state}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProfileDetail(null)} 
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3.5 rounded-2xl">
                <div><strong className="text-slate-400">Samaj:</strong> {selectedProfileDetail.subCategory}</div>
                <div><strong className="text-slate-400">Gotra:</strong> {selectedProfileDetail.gotra}</div>
                <div><strong className="text-slate-400">Sampraday:</strong> {selectedProfileDetail.sampraday}</div>
                <div><strong className="text-slate-400">Marital Status:</strong> {selectedProfileDetail.maritalStatus}</div>
                <div><strong className="text-slate-400">Education:</strong> {selectedProfileDetail.education}</div>
                <div><strong className="text-slate-400">Profession:</strong> {selectedProfileDetail.profession}</div>
                <div><strong className="text-slate-400">Dietary Vow:</strong> {selectedProfileDetail.dietaryHabit}</div>
                <div><strong className="text-slate-400">Rituals:</strong> {selectedProfileDetail.dailyRituals}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl space-y-1">
                <h4 className="font-bold text-amber-300 text-[11px]">Family Background</h4>
                <div>Father: {selectedProfileDetail.fatherOccupation}</div>
                <div>Mother: {selectedProfileDetail.motherOccupation}</div>
                <div>Siblings: {selectedProfileDetail.siblings}</div>
              </div>

              {selectedProfileDetail.bio && (
                <div className="bg-slate-950 p-3 rounded-xl space-y-1">
                  <h4 className="font-bold text-amber-300 text-[11px]">About Candidate</h4>
                  <p className="text-slate-300">{selectedProfileDetail.bio}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedProfileDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  expressInterest(selectedProfileDetail.id);
                  setSelectedProfileDetail(null);
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Express Interest</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
