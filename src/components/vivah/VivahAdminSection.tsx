import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, 
  Trash2, RefreshCw, Filter, Search, UserCheck, ShieldAlert,
  Clock, MapPin, Award, Settings, FileText, Sliders, 
  Sparkles, Check, X, ChevronRight, UserX, AlertCircle, 
  IndianRupee, Lock, Users, Calendar, ArrowRight, UserPlus, Save
} from 'lucide-react';
import { 
  MatrimonialProfile, 
  ProfileStatus, 
  VivahMembershipPlan, 
  VivahAdminSettings, 
  VivahAuditLog, 
  VivahDashboardStats 
} from '../../services/vivah/types';
import { vivahService, DEFAULT_VIVAH_SETTINGS } from '../../services/vivah/vivahService';

interface VivahAdminSectionProps {
  adminEmail?: string;
  adminId?: string;
  onRefreshParent?: () => void;
}

export const VivahAdminSection: React.FC<VivahAdminSectionProps> = ({ 
  adminEmail = 'admin@jainism.com', 
  adminId = 'admin_master',
  onRefreshParent 
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'analytics' | 'membership' | 'settings' | 'audit'>('pending');
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>([]);
  const [stats, setStats] = useState<VivahDashboardStats | null>(null);
  const [settings, setSettings] = useState<VivahAdminSettings>(DEFAULT_VIVAH_SETTINGS);
  const [plans, setPlans] = useState<VivahMembershipPlan[]>([]);
  const [auditLogs, setAuditLogs] = useState<VivahAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [communityFilter, setCommunityFilter] = useState<string>('ALL');

  // Modal states
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'correct' | 'suspend' | 'delete' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<VivahAdminSettings>(DEFAULT_VIVAH_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  // Editing plan
  const [editingPlan, setEditingPlan] = useState<VivahMembershipPlan | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allProfs, dashStats, appSettings, memPlans, logs] = await Promise.all([
        vivahService.getAllProfilesForAdmin(),
        vivahService.getDashboardStats(),
        vivahService.getSettings(),
        vivahService.getMembershipPlans(),
        vivahService.getAuditLogs(100)
      ]);
      setProfiles(allProfs);
      setStats(dashStats);
      setSettings(appSettings);
      setSettingsForm(appSettings);
      setPlans(memPlans);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Error loading Vivah Admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleActionSubmit = async () => {
    if (!selectedProfile || !actionType) return;
    setActionLoading(true);

    try {
      if (actionType === 'approve') {
        await vivahService.approveProfile(adminId, adminEmail, selectedProfile, actionReason);
        showToast(`Profile "${selectedProfile.fullName}" approved & published to live search!`);
      } else if (actionType === 'reject') {
        if (!actionReason.trim()) {
          alert('Please enter a rejection reason for the candidate.');
          setActionLoading(false);
          return;
        }
        await vivahService.rejectProfile(adminId, adminEmail, selectedProfile, actionReason);
        showToast(`Profile marked as Rejected with provided reason.`);
      } else if (actionType === 'correct') {
        if (!actionReason.trim()) {
          alert('Please specify what details need correction.');
          setActionLoading(false);
          return;
        }
        await vivahService.requestCorrection(adminId, adminEmail, selectedProfile, actionReason);
        showToast(`Correction request sent to user.`);
      } else if (actionType === 'suspend') {
        await vivahService.suspendProfile(adminId, adminEmail, selectedProfile, actionReason || 'Suspended by admin');
        showToast(`Profile suspended.`);
      } else if (actionType === 'delete') {
        await vivahService.deleteProfile(adminId, adminEmail, selectedProfile, actionReason || 'Deleted by admin');
        showToast(`Profile deleted.`);
      }

      setSelectedProfile(null);
      setActionType(null);
      setActionReason('');
      await loadAllData();
      if (onRefreshParent) onRefreshParent();
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to process admin action. Please check network/permissions.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await vivahService.updateSettings(adminId, adminEmail, settingsForm);
      setSettings(updated);
      showToast('Jain Vivah global rules and settings saved successfully!');
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await vivahService.saveMembershipPlan(adminId, adminEmail, editingPlan);
      setEditingPlan(null);
      const updatedPlans = await vivahService.getMembershipPlans();
      setPlans(updatedPlans);
      showToast(`Membership plan "${editingPlan.name}" updated!`);
    } catch (err) {
      console.error('Failed to save plan:', err);
    }
  };

  // Filtered profiles
  const pendingProfiles = profiles.filter(p => p.status === 'PENDING_APPROVAL' || p.status === 'CORRECTION_REQUIRED');

  const filteredAllProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.education?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCommunity = communityFilter === 'ALL' || 
      (communityFilter === 'GOLAPURV' ? (p.isGolapurv || p.subCategory?.toLowerCase().includes('gola')) : true);

    return matchesSearch && matchesStatus && matchesCommunity;
  });

  return (
    <div id="vivah-admin-section" className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-500/30">
              Admin Control Center
            </span>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Firestore Sync
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1 font-serif">
            Jain Vivah Central Administration & Approval Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Strict verification, zero fake accounts, ₹0 free registration enforcement & live audit logging.
          </p>
        </div>

        <button 
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition border border-slate-700 active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Quick Status Badges */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-800/80 border border-amber-500/20 rounded-xl p-3">
            <div className="text-xs text-amber-400 font-medium flex items-center justify-between">
              <span>Pending Review</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{stats.pendingApproval}</div>
            <div className="text-[10px] text-slate-400">Awaiting Admin Action</div>
          </div>

          <div className="bg-slate-800/80 border border-emerald-500/20 rounded-xl p-3">
            <div className="text-xs text-emerald-400 font-medium flex items-center justify-between">
              <span>Approved Live</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.totalApprovedProfiles}</div>
            <div className="text-[10px] text-slate-400">Searchable by public</div>
          </div>

          <div className="bg-slate-800/80 border border-blue-500/20 rounded-xl p-3">
            <div className="text-xs text-blue-400 font-medium flex items-center justify-between">
              <span>Boys Approved</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-blue-300 mt-1">
              {stats.approvedBoys} <span className="text-xs text-slate-500 font-normal">/ {stats.targetBoys}</span>
            </div>
            <div className="text-[10px] text-slate-400">Target capacity goal</div>
          </div>

          <div className="bg-slate-800/80 border border-pink-500/20 rounded-xl p-3">
            <div className="text-xs text-pink-400 font-medium flex items-center justify-between">
              <span>Girls Approved</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-pink-300 mt-1">
              {stats.approvedGirls} <span className="text-xs text-slate-500 font-normal">/ {stats.targetGirls}</span>
            </div>
            <div className="text-[10px] text-slate-400">Target capacity goal</div>
          </div>

          <div className="bg-slate-800/80 border border-orange-500/20 rounded-xl p-3">
            <div className="text-xs text-orange-400 font-medium flex items-center justify-between">
              <span>MP Profiles</span>
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-orange-300 mt-1">{stats.madhyaPradeshProfiles}</div>
            <div className="text-[10px] text-slate-400">Priority State</div>
          </div>

          <div className="bg-slate-800/80 border border-purple-500/20 rounded-xl p-3">
            <div className="text-xs text-purple-400 font-medium flex items-center justify-between">
              <span>Golapurv Samaj</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-1">{stats.golapurvProfiles}</div>
            <div className="text-[10px] text-slate-400">Community verified</div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Approval Queue</span>
          {pendingProfiles.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'pending' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'}`}>
              {pendingProfiles.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Profiles ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Target & Demographics</span>
        </button>

        <button
          onClick={() => setActiveTab('membership')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'membership'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Membership & Pricing (₹0)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Vivah Rules & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'audit'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-amber-300 font-semibold">Strict Admin Approval Mandate: </strong>
              Newly registered profiles remain in <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">PENDING_APPROVAL</code> and are NOT searchable publicly until you review and approve them. Verify that candidate is 18+ adult, details are genuine, and dietary/Jain values are stated.
            </div>
          </div>

          {pendingProfiles.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
              <h3 className="text-base font-semibold text-slate-200">No Pending Approvals</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                All submitted matrimonial candidates have been reviewed. As soon as a user submits a new profile, it will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingProfiles.map(profile => (
                <div 
                  key={profile.id}
                  className="bg-slate-800/90 border border-slate-700 hover:border-amber-500/50 rounded-xl p-4 transition shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={profile.photoUrl || (profile.gender === 'female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200')} 
                          alt={profile.fullName} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = profile.gender === 'female' 
                              ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
                              : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-slate-100 text-base">{profile.fullName}</h4>
                          <p className="text-xs text-slate-400">
                            {profile.gender === 'male' ? 'Male Candidate' : 'Female Candidate'} • <span className="text-amber-400 font-semibold">{profile.age} Yrs</span> (DOB: {profile.dateOfBirth})
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              {profile.subCategory || 'Jain'}
                            </span>
                            <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              {profile.city}, {profile.state}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                        profile.status === 'CORRECTION_REQUIRED'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {profile.status === 'CORRECTION_REQUIRED' ? 'Correction Sent' : 'Pending'}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 rounded-lg p-2.5 text-xs space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Education:</strong> {profile.education}</div>
                      <div><strong className="text-slate-400">Profession:</strong> {profile.profession} ({profile.annualIncome})</div>
                      <div><strong className="text-slate-400">Gotra & Samaj:</strong> {profile.gotra} • {profile.sampraday}</div>
                      <div><strong className="text-slate-400">Family:</strong> Father: {profile.fatherOccupation} | Mother: {profile.motherOccupation}</div>
                      <div><strong className="text-slate-400">Diet & Vow:</strong> {profile.dietaryHabit} ({profile.dailyRituals})</div>
                      {profile.contactPhone && (
                        <div className="text-amber-300 font-mono text-[11px]">
                          Private Contact: {profile.contactPhone} | {profile.contactEmail}
                        </div>
                      )}
                    </div>

                    {profile.correctionNote && (
                      <div className="text-xs bg-yellow-950/50 border border-yellow-500/30 text-yellow-300 p-2 rounded">
                        <strong>Previous Note:</strong> {profile.correctionNote}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60">
                    <button
                      onClick={() => {
                        setSelectedProfile(profile);
                        setActionType('approve');
                        setActionReason('Profile details, age and credentials verified by admin.');
                      }}
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProfile(profile);
                        setActionType('correct');
                        setActionReason('');
                      }}
                      className="flex items-center justify-center gap-1.5 bg-yellow-600/80 hover:bg-yellow-500 text-slate-950 text-xs font-semibold py-2 px-3 rounded-lg transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Correction</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProfile(profile);
                        setActionType('reject');
                        setActionReason('');
                      }}
                      className="flex items-center justify-center gap-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold py-2 px-3 rounded-lg transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL PROFILES DIRECTORY */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search candidates by name, city, profession, Gotra..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved Only</option>
                <option value="PENDING_APPROVAL">Pending Review</option>
                <option value="CORRECTION_REQUIRED">Correction Needed</option>
                <option value="REJECTED">Rejected</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="HIDDEN">Hidden</option>
              </select>

              <select
                value={communityFilter}
                onChange={e => setCommunityFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Communities</option>
                <option value="GOLAPURV">Golapurv Samaj Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Samaj / Gotra</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Education / Job</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredAllProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No matching matrimonial records found in the database.
                    </td>
                  </tr>
                ) : (
                  filteredAllProfiles.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={p.photoUrl || (p.gender === 'female' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100')} 
                            alt={p.fullName} 
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-100">{p.fullName}</div>
                            <div className="text-[11px] text-slate-400">{p.gender === 'male' ? 'Boy' : 'Girl'}, {p.age} yrs</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-slate-200">{p.subCategory || 'Jain'}</div>
                        <div className="text-[11px] text-slate-400">{p.gotra}</div>
                      </td>
                      <td className="p-3">
                        <div>{p.city}, {p.state}</div>
                        {p.isMadhyaPradesh && <span className="text-[10px] text-orange-400 font-medium">MP Native</span>}
                      </td>
                      <td className="p-3">
                        <div className="truncate max-w-[150px]">{p.education}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{p.profession}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          p.status === 'PENDING_APPROVAL' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                          p.status === 'CORRECTION_REQUIRED' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/30' :
                          p.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {p.verificationStatus || 'UNVERIFIED'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status !== 'APPROVED' && (
                            <button
                              onClick={() => {
                                setSelectedProfile(p);
                                setActionType('approve');
                                setActionReason('Approved in admin directory view.');
                              }}
                              title="Approve Profile"
                              className="p-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {p.status !== 'SUSPENDED' && (
                            <button
                              onClick={() => {
                                setSelectedProfile(p);
                                setActionType('suspend');
                                setActionReason('');
                              }}
                              title="Suspend Profile"
                              className="p-1.5 bg-yellow-900/60 hover:bg-yellow-800 text-yellow-300 rounded"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedProfile(p);
                              setActionType('delete');
                              setActionReason('');
                            }}
                            title="Delete Permanently"
                            className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TARGET CAPACITY & DEMOGRAPHICS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Community Goal & Target Capacity Tracking (No Fake Profiles)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              The platform target is 300+ approved boys and 300+ approved girls from the Jain community (especially Golapurv and Madhya Pradesh). Numbers below reflect <strong>live, real verified database entries only</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Boys Capacity Meter */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-blue-500/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-300">Adult Male Profiles</span>
                  <span className="text-slate-300">{stats.approvedBoys} / {stats.targetBoys} ({(stats.approvedBoys / stats.targetBoys * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (stats.approvedBoys / stats.targetBoys) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {stats.targetBoys - stats.approvedBoys > 0 
                    ? `${stats.targetBoys - stats.approvedBoys} more verified male registrations needed to achieve initial milestone.` 
                    : 'Target capacity achieved!'}
                </p>
              </div>

              {/* Girls Capacity Meter */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-pink-500/30 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-pink-300">Adult Female Profiles</span>
                  <span className="text-slate-300">{stats.approvedGirls} / {stats.targetGirls} ({(stats.approvedGirls / stats.targetGirls * 100).toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (stats.approvedGirls / stats.targetGirls) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {stats.targetGirls - stats.approvedGirls > 0 
                    ? `${stats.targetGirls - stats.approvedGirls} more verified female registrations needed to achieve initial milestone.` 
                    : 'Target capacity achieved!'}
                </p>
              </div>
            </div>
          </div>

          {/* Age Distribution & Geography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">Age Group Cohorts (Verified 18+)</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(stats.ageDistribution).map(([range, count]) => (
                  <div key={range} className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg">
                    <span className="text-slate-300">{range} Years</span>
                    <span className="font-bold text-amber-400">{count} profiles</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">State & Regional Priority</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg">
                  <span className="text-orange-300 font-medium">Madhya Pradesh (Priority)</span>
                  <span className="font-bold text-orange-400">{stats.madhyaPradeshProfiles} profiles</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg">
                  <span className="text-slate-300">Other Indian States</span>
                  <span className="font-bold text-slate-200">{stats.otherStateProfiles} profiles</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-3 py-2 rounded-lg">
                  <span className="text-purple-300 font-medium">Golapurv Community</span>
                  <span className="font-bold text-purple-400">{stats.golapurvProfiles} profiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MEMBERSHIP PLANS & PRICING (ADMIN CONTROLLED, ₹0) */}
      {activeTab === 'membership' && (
        <div className="space-y-5">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-emerald-300 font-semibold">100% Free Registration Guarantee: </strong>
              All Jain Vivah profiles are registered at ₹0 with zero mandatory payment. You can manage membership plan definitions and features below. Current pricing is controlled purely through this admin panel.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map(plan => (
              <div 
                key={plan.id}
                className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded uppercase">
                      {plan.tier}
                    </span>
                    <span className={`text-xs font-semibold ${plan.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {plan.isActive ? 'Active in App' : 'Disabled'}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 mt-2">{plan.name}</h4>
                  <div className="text-2xl font-black text-amber-400 my-1">
                    ₹{plan.price} <span className="text-xs text-slate-400 font-normal">/ {plan.durationDays} Days</span>
                  </div>
                  <p className="text-xs text-slate-400">{plan.description}</p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setEditingPlan(plan)}
                  className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-xs font-semibold transition"
                >
                  Edit Tier & Pricing
                </button>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-100 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-base text-amber-300">Edit Membership Tier</h3>
                  <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tier Name</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Price (₹ INR - keep 0 for free)</label>
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Validity (Days)</label>
                      <input
                        type="number"
                        value={editingPlan.durationDays}
                        onChange={e => setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={editingPlan.description}
                      onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="planActive"
                      checked={editingPlan.isActive}
                      onChange={e => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <label htmlFor="planActive" className="text-slate-300">Active and visible to candidates</label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: VIVAH RULES & SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Global Jain Vivah Rules & Age Validation Config
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-400">Minimum Registration Age (Years)</label>
              <input
                type="number"
                min="18"
                max="30"
                value={settingsForm.minAge}
                onChange={e => setSettingsForm({ ...settingsForm, minAge: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
              <span className="text-[10px] text-slate-500">Enforces adult registration check based on Date of Birth.</span>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400">Maximum Allowed Age (Years)</label>
              <input
                type="number"
                min="50"
                max="90"
                value={settingsForm.maxAge}
                onChange={e => setSettingsForm({ ...settingsForm, maxAge: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400">Target Adult Male Goal</label>
              <input
                type="number"
                value={settingsForm.targetBoysCount}
                onChange={e => setSettingsForm({ ...settingsForm, targetBoysCount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400">Target Adult Female Goal</label>
              <input
                type="number"
                value={settingsForm.targetGirlsCount}
                onChange={e => setSettingsForm({ ...settingsForm, targetGirlsCount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="approvalReq"
                checked={settingsForm.profileApprovalRequired}
                onChange={e => setSettingsForm({ ...settingsForm, profileApprovalRequired: e.target.checked })}
                className="rounded text-amber-500 w-4 h-4"
              />
              <label htmlFor="approvalReq" className="text-slate-200 font-medium">
                Mandatory Admin Approval before profile is publicly searchable (Recommended)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="regEnabled"
                checked={settingsForm.registrationEnabled}
                onChange={e => setSettingsForm({ ...settingsForm, registrationEnabled: e.target.checked })}
                className="rounded text-amber-500 w-4 h-4"
              />
              <label htmlFor="regEnabled" className="text-slate-200 font-medium">
                Allow New Candidate Registrations (Open Portal)
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Vivah Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Immutable log of all administrative profile actions & status transitions.</span>
            <span>{auditLogs.length} Records</span>
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-800/40 rounded-xl">
                No admin actions recorded yet.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    Admin: <span className="text-slate-400 font-mono">{log.adminEmail || log.adminId}</span>
                    {log.profileName && <span> • Candidate: <strong>{log.profileName}</strong></span>}
                  </div>
                  {log.reason && (
                    <div className="text-slate-400 text-[11px] bg-slate-900/60 p-1.5 rounded">
                      <strong>Reason / Note:</strong> {log.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADMIN ACTION DIALOG (APPROVE / REJECT / CORRECTION / DELETE) */}
      {selectedProfile && actionType && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-100 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-amber-300 uppercase tracking-wide">
                {actionType === 'approve' && 'Approve Candidate Profile'}
                {actionType === 'reject' && 'Reject Candidate Submission'}
                {actionType === 'correct' && 'Request Profile Correction'}
                {actionType === 'suspend' && 'Suspend Profile'}
                {actionType === 'delete' && 'Delete Profile Permanently'}
              </h3>
              <button onClick={() => { setSelectedProfile(null); setActionType(null); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 text-xs space-y-1">
              <div><strong>Candidate:</strong> {selectedProfile.fullName} ({selectedProfile.gender})</div>
              <div><strong>Age:</strong> {selectedProfile.age} yrs (DOB: {selectedProfile.dateOfBirth})</div>
              <div><strong>Location:</strong> {selectedProfile.city}, {selectedProfile.state}</div>
              <div><strong>Community:</strong> {selectedProfile.subCategory} • Gotra: {selectedProfile.gotra}</div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                {actionType === 'approve' && 'Approval Note (Optional):'}
                {actionType === 'reject' && 'Reason for Rejection (Required):'}
                {actionType === 'correct' && 'Correction instructions for user (Required):'}
                {actionType === 'suspend' && 'Suspension Reason:'}
                {actionType === 'delete' && 'Deletion Reason:'}
              </label>
              <textarea
                rows={3}
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                placeholder={
                  actionType === 'approve' ? 'e.g. Verified by Jain Samaj committee member.' :
                  actionType === 'reject' ? 'e.g. Invalid or underage profile details.' :
                  actionType === 'correct' ? 'e.g. Please upload clear photo and specify your Gotra.' :
                  'Enter reason...'
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setSelectedProfile(null); setActionType(null); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleActionSubmit}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                  actionType === 'reject' ? 'bg-rose-600 hover:bg-rose-500 text-white' :
                  actionType === 'correct' ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950' :
                  'bg-rose-700 hover:bg-rose-600 text-white'
                }`}
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {actionType === 'approve' && 'Confirm Approval'}
                  {actionType === 'reject' && 'Confirm Rejection'}
                  {actionType === 'correct' && 'Send Correction'}
                  {actionType === 'suspend' && 'Suspend'}
                  {actionType === 'delete' && 'Delete'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
