export type ProfileStatus = 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SUSPENDED' 
  | 'HIDDEN' 
  | 'DELETED' 
  | 'CORRECTION_REQUIRED';

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'PHONE_VERIFIED' 
  | 'EMAIL_VERIFIED' 
  | 'ADMIN_REVIEWED' 
  | 'VERIFIED';

export type MembershipTier = 'FREE' | 'PREMIUM' | 'CUSTOM';

export type JainSampraday = 
  | 'Digambar' 
  | 'Swetambar Murtipujak' 
  | 'Sthanakvasi' 
  | 'Terapanthi' 
  | 'Kanji Panth' 
  | 'Other Jain';

export interface GunaBreakdown {
  varna: string;
  vashya: string;
  tara: string;
  yoni: string;
  maitri: string;
  gana: string;
  bhakoot: string;
  nadi: string;
}

export interface MatrimonialProfile {
  id: string;
  userId: string;
  userEmail?: string;
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string; // YYYY-MM-DD required for age calculation
  age: number; // Server-side calculated from DOB
  height: string;
  sampraday: JainSampraday;
  subCategory: string; // e.g. "Golapurv (गोलापूर्व)", "Parwar (परवार)", "Khandelwal", "Oswal", etc.
  isGolapurv?: boolean;
  gotra: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  education: string;
  profession: string;
  annualIncome: string;
  country: string;
  state: string;
  city: string;
  isMadhyaPradesh?: boolean;
  
  // Privacy Protected Fields - Not public without mutual consent / verification
  contactPhone: string;
  contactEmail: string;
  whatsappNumber?: string;
  addressSummary?: string;

  photoUrl: string;
  additionalPhotos?: string[];
  photoStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';

  bio: string;
  dietaryHabit: 'Pure Jain (Sunset Chovisi)' | 'Jain (No Root Veg)' | 'Vegetarian';
  dailyRituals: string;
  manglik: 'No' | 'Yes' | 'Partial / Anshik';

  // Partner Preferences
  partnerPrefMinAge?: number;
  partnerPrefMaxAge?: number;
  partnerPrefCommunity?: string;
  partnerPrefState?: string;
  partnerPrefEducation?: string;

  // Family details
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  nativePlace?: string;

  // Astakoot Guna Match (Optional reference)
  gunaMatchScore?: number;
  gunaBreakdown?: GunaBreakdown;

  // Administrative Lifecycle
  status: ProfileStatus;
  rejectionReason?: string;
  correctionNote?: string;
  verificationStatus: VerificationStatus;
  membershipTier: MembershipTier;
  isConfidential: boolean; // Privacy shield
  
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  adminNotes?: string;

  isDemoRecord?: boolean;
}

export interface VivahMembershipPlan {
  id: string;
  name: string;
  tier: MembershipTier;
  price: number; // Initially ₹0
  durationDays: number; // e.g. 365
  features: string[];
  isActive: boolean;
  displayOrder: number;
  description: string;
  isPaymentGatewayReady?: boolean;
}

export interface VivahAdminSettings {
  registrationEnabled: boolean;
  minAge: number; // 18 minimum
  maxAge: number; // e.g. 70
  profileApprovalRequired: boolean;
  photoApprovalRequired: boolean;
  membershipEnabled: boolean;
  defaultMembershipPrice: number; // ₹0
  defaultMembershipDurationDays: number;
  messagingRules: string;
  dailyInterestLimit: number;
  locationPriority: string;
  targetBoysCount: number; // 300
  targetGirlsCount: number; // 300
  allowedCommunities: string[];
}

export interface VivahAuditLog {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: 
    | 'PROFILE_APPROVED'
    | 'PROFILE_REJECTED'
    | 'PROFILE_CORRECTION_REQUESTED'
    | 'PROFILE_SUSPENDED'
    | 'PROFILE_HIDDEN'
    | 'PROFILE_DELETED'
    | 'MEMBERSHIP_PLAN_UPDATED'
    | 'SETTINGS_UPDATED'
    | 'PHOTO_STATUS_CHANGED';
  profileId?: string;
  profileName?: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface VivahDashboardStats {
  totalApprovedProfiles: number;
  approvedBoys: number;
  approvedGirls: number;
  pendingApproval: number;
  rejectedProfiles: number;
  suspendedProfiles: number;
  madhyaPradeshProfiles: number;
  otherStateProfiles: number;
  golapurvProfiles: number;
  premiumMembers: number;
  targetBoys: number;
  targetGirls: number;
  ageDistribution: {
    '18-25': number;
    '26-30': number;
    '31-35': number;
    '36-40': number;
    '41-45': number;
    '46+': number;
  };
  cityCounts: { [city: string]: number };
}

export interface VivahInterest {
  id: string;
  fromUserId: string;
  fromProfileId: string;
  fromName: string;
  toUserId: string;
  toProfileId: string;
  toName: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface VivahMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}
