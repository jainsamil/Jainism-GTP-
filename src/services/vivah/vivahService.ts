import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  MatrimonialProfile, 
  ProfileStatus, 
  VivahMembershipPlan, 
  VivahAdminSettings, 
  VivahAuditLog, 
  VivahDashboardStats,
  VivahInterest
} from './types';
import { calculateAgeFromDob, MADHYA_PRADESH_CITIES } from '../../data/communityLocationData';

const LOCAL_PROFILES_KEY = 'jain_vivah_local_profiles';
const LOCAL_SETTINGS_KEY = 'jain_vivah_local_settings';
const LOCAL_MEMBERSHIP_KEY = 'jain_vivah_local_memberships';
const LOCAL_AUDIT_KEY = 'jain_vivah_local_audit_logs';

export const DEFAULT_VIVAH_SETTINGS: VivahAdminSettings = {
  registrationEnabled: true,
  minAge: 18,
  maxAge: 70,
  profileApprovalRequired: true,
  photoApprovalRequired: true,
  membershipEnabled: true,
  defaultMembershipPrice: 0, // ₹0 Free by default
  defaultMembershipDurationDays: 365,
  messagingRules: 'Direct messaging enabled upon mutual interest acceptance.',
  dailyInterestLimit: 20,
  locationPriority: 'Madhya Pradesh',
  targetBoysCount: 300,
  targetGirlsCount: 300,
  allowedCommunities: [
    'Golapurv (गोलापूर्व)',
    'Parwar (परवार)',
    'Khandelwal (खंडेलवाल)',
    'Oswal (ओसवाल)',
    'Porwal / Podwal (पोड़वाल)',
    'Humad (हुम्मड़)',
    'Saitwal (सैतवाल)',
    'Jaiswal (जायसवाल)',
    'Agarwal Jain',
    'Shrimal',
    'Other Jain'
  ]
};

export const DEFAULT_MEMBERSHIP_PLANS: VivahMembershipPlan[] = [
  {
    id: 'plan_free_standard',
    name: 'Shravak Free Registration',
    tier: 'FREE',
    price: 0, // ₹0
    durationDays: 365,
    features: [
      '₹0 Free Biodata Registration',
      'Verified Jain Profile Search',
      'Send & Receive Express Interests',
      'Shortlist Matching Biodatas',
      'Mutual Match Contact Reveal',
      'Privacy Shield & Bio Protection'
    ],
    isActive: true,
    displayOrder: 1,
    description: '100% Free lifelong access for all Jain youth & families.'
  },
  {
    id: 'plan_ratnam_premium',
    name: 'Shravak Ratnam Privileged',
    tier: 'PREMIUM',
    price: 0, // ₹0 initially free
    durationDays: 365,
    features: [
      'All Free Plan Inclusions',
      'Priority Admin Review & Fast Verification',
      'Featured Candidate in Search Results',
      'Direct WhatsApp Connect (upon mutual approval)',
      'Astakoot 36-Guna Kundali Compatibility Report',
      'Dedicated Samaj Relationship Coordinator Support'
    ],
    isActive: true,
    displayOrder: 2,
    description: 'Special privileged membership provided complimentary to community members.'
  }
];

export const vivahService = {
  // ==========================================
  // 1. USER PROFILE SUBMISSION & MANAGEMENT
  // ==========================================

  async registerProfile(
    userId: string, 
    userEmail: string | undefined, 
    data: Omit<MatrimonialProfile, 'id' | 'userId' | 'age' | 'status' | 'verificationStatus' | 'membershipTier' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; profile?: MatrimonialProfile; error?: string }> {
    // 1. Calculate Age server-side / strictly from Date of Birth
    const calculatedAge = calculateAgeFromDob(data.dateOfBirth);
    if (!data.dateOfBirth || calculatedAge < 18) {
      return { 
        success: false, 
        error: 'Underage registration not permitted. Candidate must be at least 18 years of age (DOB validation failed).' 
      };
    }

    const isMP = data.state === 'Madhya Pradesh' || MADHYA_PRADESH_CITIES.includes(data.city);
    const isGola = data.subCategory?.toLowerCase().includes('gola') || false;

    const newProfile: MatrimonialProfile = {
      ...data,
      id: 'vivah_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      userEmail: userEmail || data.contactEmail,
      age: calculatedAge,
      isMadhyaPradesh: isMP,
      isGolapurv: isGola,
      status: 'PENDING_APPROVAL', // Strict Admin Approval Mandate
      verificationStatus: userEmail ? 'EMAIL_VERIFIED' : 'UNVERIFIED',
      membershipTier: 'FREE',
      photoStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    try {
      if (userId && !userId.startsWith('demo_')) {
        await setDoc(doc(db, 'vivahProfiles', newProfile.id), newProfile);
      }
    } catch (err) {
      console.warn('Firestore vivah profile write fallback to local storage:', err);
    }

    // Sync to local state
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const filtered = existing.filter((p: MatrimonialProfile) => p.id !== newProfile.id && p.userId !== userId);
      filtered.unshift(newProfile);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(filtered));
    } catch (e) {}

    return { success: true, profile: newProfile };
  },

  async getUserProfile(userId: string): Promise<MatrimonialProfile | null> {
    try {
      if (userId && !userId.startsWith('demo_')) {
        const q = query(collection(db, 'vivahProfiles'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data() as MatrimonialProfile;
          return { id: snap.docs[0].id, ...docData };
        }
      }
    } catch (e) {}

    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const found = local.find((p: MatrimonialProfile) => p.userId === userId);
      if (found) return found;
    } catch (e) {}

    return null;
  },

  async updateUserProfile(userId: string, profileId: string, updates: Partial<MatrimonialProfile>): Promise<void> {
    let finalUpdates = { ...updates, updatedAt: new Date().toISOString() };
    
    if (updates.dateOfBirth) {
      finalUpdates.age = calculateAgeFromDob(updates.dateOfBirth);
    }
    if (updates.state || updates.city) {
      finalUpdates.isMadhyaPradesh = updates.state === 'Madhya Pradesh' || MADHYA_PRADESH_CITIES.includes(updates.city || '');
    }
    if (updates.subCategory) {
      finalUpdates.isGolapurv = updates.subCategory.toLowerCase().includes('gola');
    }

    try {
      if (userId && !userId.startsWith('demo_')) {
        await updateDoc(doc(db, 'vivahProfiles', profileId), finalUpdates);
      }
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => 
        p.id === profileId ? { ...p, ...finalUpdates } : p
      );
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  // ==========================================
  // 2. PUBLIC PROFILE SEARCH (ONLY APPROVED)
  // ==========================================

  async getApprovedProfiles(): Promise<MatrimonialProfile[]> {
    let firestoreList: MatrimonialProfile[] = [];
    try {
      const q = query(collection(db, 'vivahProfiles'), where('status', '==', 'APPROVED'));
      const snap = await getDocs(q);
      firestoreList = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatrimonialProfile));
    } catch (err) {
      console.warn('Firestore approved vivah profiles fetch error (using local storage fallback):', err);
    }

    let localList: MatrimonialProfile[] = [];
    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      localList = local.filter((p: MatrimonialProfile) => p.status === 'APPROVED');
    } catch (e) {}

    const map = new Map<string, MatrimonialProfile>();
    [...firestoreList, ...localList].forEach(p => map.set(p.id, p));

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.approvedAt || b.createdAt || 0).getTime() - new Date(a.approvedAt || a.createdAt || 0).getTime()
    );
  },

  // ==========================================
  // 3. ADMIN PROFILE APPROVAL & MANAGEMENT
  // ==========================================

  async getAllProfilesForAdmin(): Promise<MatrimonialProfile[]> {
    let firestoreList: MatrimonialProfile[] = [];
    try {
      const snap = await getDocs(collection(db, 'vivahProfiles'));
      firestoreList = snap.docs.map(d => ({ id: d.id, ...d.data() } as MatrimonialProfile));
    } catch (e) {}

    let localList: MatrimonialProfile[] = [];
    try {
      localList = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
    } catch (e) {}

    const map = new Map<string, MatrimonialProfile>();
    [...firestoreList, ...localList].forEach(p => map.set(p.id, p));

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  },

  async approveProfile(adminId: string, adminEmail: string, profile: MatrimonialProfile, notes?: string): Promise<void> {
    const patch: Partial<MatrimonialProfile> = {
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      approvedBy: adminEmail || adminId,
      photoStatus: 'APPROVED',
      adminNotes: notes || 'Verified authentic Jain candidate by Admin.',
      rejectionReason: undefined,
      correctionNote: undefined,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'vivahProfiles', profile.id), patch);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => p.id === profile.id ? { ...p, ...patch } : p);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_APPROVED',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'APPROVED',
      reason: notes || 'Profile and credentials approved for public search'
    });
  },

  async rejectProfile(adminId: string, adminEmail: string, profile: MatrimonialProfile, reason: string): Promise<void> {
    const patch: Partial<MatrimonialProfile> = {
      status: 'REJECTED',
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'vivahProfiles', profile.id), patch);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => p.id === profile.id ? { ...p, ...patch } : p);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_REJECTED',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'REJECTED',
      reason
    });
  },

  async requestCorrection(adminId: string, adminEmail: string, profile: MatrimonialProfile, correctionNote: string): Promise<void> {
    const patch: Partial<MatrimonialProfile> = {
      status: 'CORRECTION_REQUIRED',
      correctionNote,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'vivahProfiles', profile.id), patch);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => p.id === profile.id ? { ...p, ...patch } : p);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_CORRECTION_REQUESTED',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'CORRECTION_REQUIRED',
      reason: correctionNote
    });
  },

  async suspendProfile(adminId: string, adminEmail: string, profile: MatrimonialProfile, reason: string): Promise<void> {
    const patch: Partial<MatrimonialProfile> = {
      status: 'SUSPENDED',
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'vivahProfiles', profile.id), patch);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => p.id === profile.id ? { ...p, ...patch } : p);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_SUSPENDED',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'SUSPENDED',
      reason
    });
  },

  async hideProfile(adminId: string, adminEmail: string, profile: MatrimonialProfile): Promise<void> {
    const patch: Partial<MatrimonialProfile> = {
      status: 'HIDDEN',
      updatedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, 'vivahProfiles', profile.id), patch);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const updated = existing.map((p: MatrimonialProfile) => p.id === profile.id ? { ...p, ...patch } : p);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_HIDDEN',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'HIDDEN'
    });
  },

  async deleteProfile(adminId: string, adminEmail: string, profile: MatrimonialProfile, reason?: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'vivahProfiles', profile.id));
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_PROFILES_KEY) || '[]');
      const filtered = existing.filter((p: MatrimonialProfile) => p.id !== profile.id);
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(filtered));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'PROFILE_DELETED',
      profileId: profile.id,
      profileName: profile.fullName,
      previousStatus: profile.status,
      newStatus: 'DELETED',
      reason: reason || 'Permanently removed from database'
    });
  },

  // ==========================================
  // 4. LIVE DASHBOARD STATISTICS (ZERO FAKE DATA)
  // ==========================================

  async getDashboardStats(): Promise<VivahDashboardStats> {
    const allProfiles = await this.getAllProfilesForAdmin();

    const approved = allProfiles.filter(p => p.status === 'APPROVED');
    const pending = allProfiles.filter(p => p.status === 'PENDING_APPROVAL' || p.status === 'CORRECTION_REQUIRED');
    const rejected = allProfiles.filter(p => p.status === 'REJECTED');
    const suspended = allProfiles.filter(p => p.status === 'SUSPENDED');

    let approvedBoys = 0;
    let approvedGirls = 0;
    let madhyaPradeshProfiles = 0;
    let otherStateProfiles = 0;
    let golapurvProfiles = 0;
    let premiumMembers = 0;

    const ageDistribution = {
      '18-25': 0,
      '26-30': 0,
      '31-35': 0,
      '36-40': 0,
      '41-45': 0,
      '46+': 0
    };

    const cityCounts: { [city: string]: number } = {};

    approved.forEach(p => {
      if (p.gender === 'male') approvedBoys++;
      if (p.gender === 'female') approvedGirls++;

      if (p.isMadhyaPradesh || p.state === 'Madhya Pradesh' || MADHYA_PRADESH_CITIES.includes(p.city)) {
        madhyaPradeshProfiles++;
      } else {
        otherStateProfiles++;
      }

      if (p.isGolapurv || p.subCategory?.toLowerCase().includes('gola')) {
        golapurvProfiles++;
      }

      if (p.membershipTier === 'PREMIUM') {
        premiumMembers++;
      }

      // Age distribution
      if (p.age >= 18 && p.age <= 25) ageDistribution['18-25']++;
      else if (p.age >= 26 && p.age <= 30) ageDistribution['26-30']++;
      else if (p.age >= 31 && p.age <= 35) ageDistribution['31-35']++;
      else if (p.age >= 36 && p.age <= 40) ageDistribution['36-40']++;
      else if (p.age >= 41 && p.age <= 45) ageDistribution['41-45']++;
      else if (p.age >= 46) ageDistribution['46+']++;

      if (p.city) {
        cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
      }
    });

    return {
      totalApprovedProfiles: approved.length,
      approvedBoys,
      approvedGirls,
      pendingApproval: pending.length,
      rejectedProfiles: rejected.length,
      suspendedProfiles: suspended.length,
      madhyaPradeshProfiles,
      otherStateProfiles,
      golapurvProfiles,
      premiumMembers,
      targetBoys: 300,
      targetGirls: 300,
      ageDistribution,
      cityCounts
    };
  },

  // ==========================================
  // 5. MEMBERSHIP PLANS (ADMIN CONTROLLED, ₹0 BY DEFAULT)
  // ==========================================

  async getMembershipPlans(): Promise<VivahMembershipPlan[]> {
    try {
      const snap = await getDocs(collection(db, 'vivahMembershipPlans'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as VivahMembershipPlan))
          .sort((a, b) => a.displayOrder - b.displayOrder);
      }
    } catch (e) {}

    try {
      const local = localStorage.getItem(LOCAL_MEMBERSHIP_KEY);
      if (local) return JSON.parse(local);
    } catch (e) {}

    return DEFAULT_MEMBERSHIP_PLANS;
  },

  async saveMembershipPlan(adminId: string, adminEmail: string, plan: VivahMembershipPlan): Promise<void> {
    try {
      await setDoc(doc(db, 'vivahMembershipPlans', plan.id), plan);
    } catch (e) {}

    try {
      const existing = await this.getMembershipPlans();
      const idx = existing.findIndex(p => p.id === plan.id);
      if (idx >= 0) existing[idx] = plan;
      else existing.push(plan);
      localStorage.setItem(LOCAL_MEMBERSHIP_KEY, JSON.stringify(existing));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'MEMBERSHIP_PLAN_UPDATED',
      reason: `Updated plan: ${plan.name} (Price: ₹${plan.price}, Duration: ${plan.durationDays}d)`
    });
  },

  // ==========================================
  // 6. ADMIN SETTINGS
  // ==========================================

  async getSettings(): Promise<VivahAdminSettings> {
    try {
      const snap = await getDoc(doc(db, 'vivahSettings', 'config'));
      if (snap.exists()) {
        return { ...DEFAULT_VIVAH_SETTINGS, ...snap.data() as VivahAdminSettings };
      }
    } catch (e) {}

    try {
      const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (local) return JSON.parse(local);
    } catch (e) {}

    return DEFAULT_VIVAH_SETTINGS;
  },

  async updateSettings(adminId: string, adminEmail: string, settings: Partial<VivahAdminSettings>): Promise<VivahAdminSettings> {
    const updated = { ...DEFAULT_VIVAH_SETTINGS, ...settings };
    try {
      await setDoc(doc(db, 'vivahSettings', 'config'), updated, { merge: true });
    } catch (e) {}

    try {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {}

    await this.logAudit({
      adminId,
      adminEmail,
      action: 'SETTINGS_UPDATED',
      reason: 'Global Vivah settings updated by admin'
    });

    return updated;
  },

  // ==========================================
  // 7. AUDIT LOGGING
  // ==========================================

  async logAudit(log: Omit<VivahAuditLog, 'id' | 'timestamp'>): Promise<void> {
    const entry: VivahAuditLog = {
      ...log,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'vivahAuditLogs'), entry);
    } catch (e) {}

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_AUDIT_KEY) || '[]');
      existing.unshift(entry);
      localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(existing.slice(0, 200)));
    } catch (e) {}
  },

  async getAuditLogs(limitCount = 100): Promise<VivahAuditLog[]> {
    let firestoreLogs: VivahAuditLog[] = [];
    try {
      const q = query(collection(db, 'vivahAuditLogs'), orderBy('timestamp', 'desc'), limit(limitCount));
      const snap = await getDocs(q);
      firestoreLogs = snap.docs.map(d => ({ id: d.id, ...d.data() } as VivahAuditLog));
    } catch (e) {}

    let localLogs: VivahAuditLog[] = [];
    try {
      localLogs = JSON.parse(localStorage.getItem(LOCAL_AUDIT_KEY) || '[]');
    } catch (e) {}

    const map = new Map<string, VivahAuditLog>();
    [...firestoreLogs, ...localLogs].forEach(l => map.set(l.id, l));

    return Array.from(map.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limitCount);
  }
};
