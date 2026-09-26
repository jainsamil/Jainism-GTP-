import { useState, useEffect } from 'react';
import { 
  Compass, Plus, Calendar, MapPin, Users, Train, 
  Bus, Plane, Car, CheckCircle2, Clock, Trash2, 
  ExternalLink, Sparkles, X, RefreshCw, AlertCircle 
} from 'lucide-react';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { UserTripRecord, TravelPassenger } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface MyTripsSectionProps {
  onExploreRoutes?: () => void;
}

export default function MyTripsSection({ onExploreRoutes }: MyTripsSectionProps) {
  const { user } = useAuth();
  const [trips, setTrips] = useState<UserTripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  // Plan New Yatra Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Shri Sammed Shikharji Bhav Yatra');
  const [newTirth, setNewTirth] = useState('Sammed Shikharji');
  const [newMode, setNewMode] = useState<'train' | 'bus' | 'flight' | 'car' | 'sangh'>('train');
  const [newStartDate, setNewStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d.toISOString().split('T')[0];
  });
  const [newYatrikCount, setNewYatrikCount] = useState(2);
  const [newNotes, setNewNotes] = useState('Dharamshala room requested in Madhuban. Morning 4 AM Pahad Vandana planned.');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await travelStorageService.getUserTrips(user?.uid || 'guest_user');
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const passengerList: TravelPassenger[] = Array.from({ length: newYatrikCount }, (_, i) => ({
      id: `p_trip_${Date.now()}_${i}`,
      name: i === 0 ? (user?.displayName || 'Chief Pilgrim') : `Yatrik ${i + 1}`,
      age: 30 + i * 5,
      gender: 'male' as const,
      mealPreference: 'jain_sunset'
    }));

    try {
      await travelStorageService.saveTrip(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || 'Pilgrim',
        tripTitle: newTitle,
        destinationTirth: newTirth,
        travelMode: newMode,
        startDate: newStartDate,
        endDate: newEndDate,
        passengers: passengerList,
        status: 'UPCOMING',
        totalCost: 0,
        notes: newNotes,
        isDemoRecord: true
      });

      setShowAddModal(false);
      await loadTrips();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Remove this planned Yatra from your list?')) return;
    try {
      await travelStorageService.deleteTrip(user?.uid || 'guest_user', tripId);
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = trips.filter(t => {
    if (activeTab === 'UPCOMING') return t.status === 'UPCOMING' || t.status === 'CONFIRMED';
    return t.status === activeTab;
  });

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train': return <Train size={16} className="text-[#FF6D00]" />;
      case 'bus': return <Bus size={16} className="text-amber-500" />;
      case 'flight': return <Plane size={16} className="text-purple-500" />;
      default: return <Car size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              My Pilgrimage Plans (Yatra Sangrah)
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Organize sacred tirth itineraries, yatrika lists & dharamshala stay details
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold text-xs rounded-2xl shadow-md shadow-[#FF6D00]/25 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} />
          <span>Plan New Sacred Yatra</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer",
              activeTab === tab 
                ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
                : "bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100"
            )}
          >
            {tab === 'UPCOMING' ? 'Active & Upcoming' : tab === 'COMPLETED' ? 'Completed Yatras' : 'Cancelled'}
          </button>
        ))}
      </div>

      {/* Trips List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#FF6D00]" />
          Loading your sacred trips...
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/50 dark:bg-[#12100E]/50 border border-gray-200 dark:border-white/10 space-y-3">
          <Compass size={36} className="mx-auto text-gray-400 opacity-50" />
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
            No {activeTab.toLowerCase()} pilgrimage trips yet
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Plan your holy visit to Sammed Shikharji, Palitana, Girnarji, or Kundalpur.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] text-xs font-bold rounded-xl cursor-pointer"
          >
            + Create Pilgrimage Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:border-[#FF6D00]/50 transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    {getModeIcon(trip.travelMode)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {trip.tripTitle}
                    </h4>
                    <span className="text-[11px] text-[#FF6D00] font-semibold">
                      ⛩️ {trip.destinationTirth}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                  title="Remove Trip"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Dates & Passengers */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Dates</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {trip.startDate} {trip.endDate ? `→ ${trip.endDate}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Yatrikas</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {trip.passengers.length} Persons
                  </span>
                </div>
              </div>

              {trip.notes && (
                <p className="text-xs text-gray-600 dark:text-gray-400 bg-[#FF6D00]/5 p-2.5 rounded-xl border border-[#FF6D00]/10">
                  📝 {trip.notes}
                </p>
              )}

              {trip.pnrOrTicketNo && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Ticket / PNR:</span>
                  <span className="font-mono font-bold text-[#FF6D00]">{trip.pnrOrTicketNo}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Plan New Sacred Yatra Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#181412] rounded-3xl border border-gray-200 dark:border-white/15 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6D00]/10 text-[#FF6D00] flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Plan New Sacred Pilgrimage
                  </h3>
                  <p className="text-xs text-gray-500">
                    Save to your private Firestore profile
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Trip Name / Sankalp
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sammed Shikharji Parikrama Yatra"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Destination Tirth
                  </label>
                  <input
                    type="text"
                    value={newTirth}
                    onChange={(e) => setNewTirth(e.target.value)}
                    placeholder="e.g. Palitana, Girnarji"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Primary Transport
                  </label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  >
                    <option value="train">Train (IRCTC)</option>
                    <option value="bus">Pilgrim AC Bus</option>
                    <option value="flight">Flight</option>
                    <option value="car">Personal Car / Taxi</option>
                    <option value="sangh">Sangh Yatra Bus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Dharamshala & Vandana Notes
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Booking in Digambar / Shwetambar Kothi, Doli booking contact, etc."
                  className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#FF6D00]/25 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {submitting ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Save Pilgrimage Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
