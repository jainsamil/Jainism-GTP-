import { useState, useEffect } from 'react';
import { 
  User, Users, Plus, Trash2, Save, Utensils, 
  MapPin, Phone, Shield, Sparkles, CheckCircle2, 
  RefreshCw, Heart 
} from 'lucide-react';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { TravelUserProfile, TravelPassenger } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export default function TravelProfileSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TravelUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form Fields
  const [homeCity, setHomeCity] = useState('Indore');
  const [favoriteTirths, setFavoriteTirths] = useState<string>('Sammed Shikharji, Palitana, Girnarji, Kundalpur');
  const [mealPref, setMealPref] = useState<'jain_chovisi' | 'jain_navkarsi' | 'jain_general' | 'regular_veg'>('jain_chovisi');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 43210');
  const [frequentPassengers, setFrequentPassengers] = useState<TravelPassenger[]>([]);

  // Add passenger inline state
  const [newPassName, setNewPassName] = useState('');
  const [newPassAge, setNewPassAge] = useState(30);
  const [newPassGender, setNewPassGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const p = await travelStorageService.getProfile(user?.uid || 'guest_user');
      setProfile(p);
      setHomeCity(p.homeCity || 'Indore');
      setFavoriteTirths((p.favoriteTirths || ['Sammed Shikharji', 'Palitana']).join(', '));
      setMealPref(p.dietaryPreference || 'jain_chovisi');
      setEmergencyContact(p.emergencyContact || '');
      setFrequentPassengers(p.frequentPassengers || [
        { id: '1', name: user?.displayName || 'Chief Pilgrim', age: 35, gender: 'male', mealPreference: 'jain_sunset' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const tirthList = favoriteTirths.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const updated = await travelStorageService.saveProfile(user?.uid || 'guest_user', {
        email: user?.email || 'pilgrim@jainismgpt.com',
        displayName: user?.displayName || 'Pilgrim',
        homeCity,
        favoriteTirths: tirthList,
        dietaryPreference: mealPref,
        emergencyContact,
        frequentPassengers
      });

      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPassenger = () => {
    if (!newPassName.trim()) return;
    const newP: TravelPassenger = {
      id: `fp_${Date.now()}`,
      name: newPassName.trim(),
      age: newPassAge,
      gender: newPassGender,
      mealPreference: 'jain_sunset'
    };
    setFrequentPassengers([...frequentPassengers, newP]);
    setNewPassName('');
  };

  const handleRemovePassenger = (id: string) => {
    setFrequentPassengers(frequentPassengers.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Pilgrim Traveler Profile & Directory
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Manage frequent yatrik list, sunset meal requirements & mountain emergency contacts
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Core Preferences Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* General & Home */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <MapPin size={16} className="text-[#FF6D00]" />
              Home Location & Favorite Tirths
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Home City (Starting Base)
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. Mumbai, Indore, Delhi, Ahmedabad"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Frequent Sacred Tirth Destinations
              </label>
              <input
                type="text"
                value={favoriteTirths}
                onChange={(e) => setFavoriteTirths(e.target.value)}
                placeholder="Comma separated: Shikharji, Palitana, Girnar"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Pahad Vandana Emergency Mobile
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                />
              </div>
            </div>
          </div>

          {/* Dietary Compliance */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Utensils size={16} className="text-emerald-500" />
              Jain Bhojan & Dietary Rule
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setMealPref('jain_chovisi')}
                className={cn(
                  "w-full p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer",
                  mealPref === 'jain_chovisi'
                    ? "bg-[#FF6D00]/10 border-[#FF6D00] text-[#FF6D00] font-bold shadow-sm"
                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                )}
              >
                <div className="font-bold flex items-center gap-1.5">
                  🌅 100% Sunset Chovisi (Strict Sunset Rule)
                </div>
                <div className="text-[11px] opacity-75 mt-0.5">
                  Pre-books meal stops strictly before astronomical sunset; no root vegetables (kandmool).
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMealPref('jain_navkarsi')}
                className={cn(
                  "w-full p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer",
                  mealPref === 'jain_navkarsi'
                    ? "bg-[#FF6D00]/10 border-[#FF6D00] text-[#FF6D00] font-bold shadow-sm"
                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                )}
              >
                <div className="font-bold flex items-center gap-1.5">
                  ☀️ Navkarsi Morning Breakfast
                </div>
                <div className="text-[11px] opacity-75 mt-0.5">
                  Morning bhojanshala timing 48 minutes after sunrise with warm boiled water.
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Frequent Yatrik Passengers Directory */}
        <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Users size={16} className="text-[#FF6D00]" />
              Saved Frequent Yatrikas ({frequentPassengers.length})
            </h3>
          </div>

          <div className="space-y-2">
            {frequentPassengers.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="text-gray-900 dark:text-white">{p.name}</strong>
                  <span className="text-gray-500 ml-2">
                    {p.age} yrs • {p.gender} • Pure Jain Meal
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePassenger(p.id)}
                  className="text-gray-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Passenger Row */}
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={newPassName}
              onChange={(e) => setNewPassName(e.target.value)}
              placeholder="Yatrik Full Name (e.g. Shanti Lal Jain)"
              className="flex-1 min-w-[160px] px-3 py-2 bg-white dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
            />
            <input
              type="number"
              value={newPassAge}
              onChange={(e) => setNewPassAge(parseInt(e.target.value) || 30)}
              min={1}
              max={110}
              placeholder="Age"
              className="w-16 px-2 py-2 bg-white dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-center text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
            />
            <select
              value={newPassGender}
              onChange={(e) => setNewPassGender(e.target.value as any)}
              className="px-2 py-2 bg-white dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <button
              type="button"
              onClick={handleAddPassenger}
              className="px-3.5 py-2 bg-[#FF6D00] hover:bg-[#FF8A65] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={14} />
              <span>Add Yatrik</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 size={16} /> Saved into Firestore!
            </span>
          ) : <div />}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#FF6D00]/25 flex items-center gap-2 cursor-pointer"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Traveler Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
