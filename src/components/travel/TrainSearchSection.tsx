import { useState, useEffect } from 'react';
import { 
  Train, Search, ArrowRightLeft, Calendar, Users, Clock, 
  MapPin, CheckCircle2, AlertCircle, Sparkles, Utensils, 
  ChevronRight, Shield, Download, X, QrCode, Bookmark, 
  RefreshCw, Info 
} from 'lucide-react';
import { trainService, TrainSearchParams } from '../../services/travel/trainService';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { TrainSearchResult, TrainClassAvailability, TravelPassenger } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface TrainSearchSectionProps {
  onGoToBookings?: () => void;
  onGoToTimetable?: (trainNo: string) => void;
}

export default function TrainSearchSection({ onGoToBookings, onGoToTimetable }: TrainSearchSectionProps) {
  const { user } = useAuth();
  const [fromStation, setFromStation] = useState('New Delhi (NDLS)');
  const [toStation, setToStation] = useState('Parasnath - Sammed Shikharji (PNME)');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrainSearchResult[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Booking Modal State
  const [selectedTrain, setSelectedTrain] = useState<TrainSearchResult | null>(null);
  const [selectedClassOption, setSelectedClassOption] = useState<TrainClassAvailability | null>(null);
  const [passengerNames, setPassengerNames] = useState<string[]>(['']);
  const [mealPref, setMealPref] = useState<'jain_chovisi' | 'jain_navkarsi'>('jain_chovisi');
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await trainService.searchTrains({
        fromStation,
        toStation,
        journeyDate,
        classType: selectedClass,
        passengers
      });

      setResults(res.results);
      setIsDemo(res.isDemo);
      if (res.message) {
        setStatusMessage(res.message);
      }

      // Log search to Firestore for user history & analytics
      if (user?.uid) {
        travelStorageService.logSearch({
          userId: user.uid,
          travelMode: 'train',
          source: fromStation,
          destination: toStation,
          journeyDate
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error connecting to railway services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (train: TrainSearchResult, classOpt: TrainClassAvailability) => {
    setSelectedTrain(train);
    setSelectedClassOption(classOpt);
    setPassengerNames(Array.from({ length: passengers }, (_, i) => i === 0 ? (user?.displayName || 'Yatrik 1') : `Yatrik ${i + 1}`));
    setBookingSuccess(null);
  };

  const handleConfirmDemoBooking = async () => {
    if (!selectedTrain || !selectedClassOption) return;
    setBookingSubmitting(true);

    const passengerList: TravelPassenger[] = passengerNames.map((name, idx) => ({
      id: `p_${Date.now()}_${idx}`,
      name: name || `Passenger ${idx + 1}`,
      age: 30 + idx * 5,
      gender: idx % 2 === 0 ? 'male' : 'female',
      berthPreference: idx % 2 === 0 ? 'Lower' : 'Middle',
      mealPreference: mealPref === 'jain_chovisi' ? 'jain_sunset' : 'jain_navkarsi'
    }));

    const totalAmt = selectedClassOption.fare * passengerList.length;
    const fakePnr = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    try {
      const saved = await travelStorageService.saveBooking(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        travelType: 'train',
        serviceName: selectedTrain.trainName,
        serviceNumber: selectedTrain.trainNumber,
        source: selectedTrain.fromStationName,
        destination: selectedTrain.toStationName,
        journeyDate,
        travelClass: selectedClassOption.className,
        passengers: passengerList,
        seatNumbers: passengerList.map((_, i) => `Coach B3 - ${22 + i}`),
        totalAmount: totalAmt,
        status: 'CONFIRMED',
        pnrOrBookingId: fakePnr,
        paymentMethod: 'Demo Free Confirmation (No Payment Required)',
        jainFoodRequested: true,
        isDemo: true
      });

      // Also create a Trip record in My Trips
      await travelStorageService.saveTrip(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        tripTitle: `Pilgrimage to ${selectedTrain.toStationName}`,
        destinationTirth: selectedTrain.nearTirth || selectedTrain.toStationName,
        travelMode: 'train',
        startDate: journeyDate,
        passengers: passengerList,
        status: 'CONFIRMED',
        pnrOrTicketNo: fakePnr,
        totalCost: totalAmt,
        isDemoRecord: true,
        notes: `Train #${selectedTrain.trainNumber} - ${selectedTrain.trainName}. 100% Sunset Chovisi Meal pre-allocated.`
      });

      setBookingSuccess({ ...saved, pnr: fakePnr });
    } catch (err) {
      console.error('Booking save error:', err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Train size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Indian Railways Pilgrim Search
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Direct Superfast Trains to Sammed Shikharji, Palitana, Girnar & Kundalpur
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From Station */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                From Station / City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="text"
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  placeholder="e.g. New Delhi (NDLS), Mumbai Central (MMCT), Indore (INDB)"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwapStations}
                className="w-10 h-10 rounded-full bg-[#FF6D00]/10 dark:bg-white/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] dark:text-[#FFAB40] flex items-center justify-center transition-all cursor-pointer border border-[#FF6D00]/20"
                title="Swap From and To"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                To Station / Tirth Gateway
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  placeholder="e.g. Parasnath (PNME), Sihor (SOJN), Junagadh (JND)"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Journey Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Journey Date
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Travel Class */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Quota / Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
              >
                <option value="ALL">All Classes (1A, 2A, 3A, SL, CC)</option>
                <option value="3A">AC 3 Tier (3A)</option>
                <option value="2A">AC 2 Tier (2A)</option>
                <option value="1A">AC First Class (1A)</option>
                <option value="SL">Sleeper (SL)</option>
                <option value="CC">AC Chair Car (CC)</option>
              </select>
            </div>

            {/* Passengers */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Passengers (Yatrikas)
              </label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Quick Pilgrim Route Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Popular:</span>
              <button
                type="button"
                onClick={() => { setFromStation('New Delhi (NDLS)'); setToStation('Parasnath (PNME)'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Delhi → Shikharji
              </button>
              <button
                type="button"
                onClick={() => { setFromStation('Mumbai Central (MMCT)'); setToStation('Sihor / Palitana (SOJN)'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Mumbai → Palitana
              </button>
              <button
                type="button"
                onClick={() => { setFromStation('Ahmedabad (ADI)'); setToStation('Junagadh / Girnar (JND)'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Ahmedabad → Girnar
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-[#FF6D00]/25 flex items-center gap-2 transition-all cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Searching IRCTC...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Search Trains</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Status / Disclaimer Notice */}
      {statusMessage && (
        <div className={cn(
          "p-4 rounded-2xl text-xs flex items-start gap-2.5 border",
          isDemo 
            ? "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300"
            : "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300"
        )}>
          <Info size={16} className="shrink-0 mt-0.5" />
          <div>
            <div className="font-bold flex items-center gap-2">
              {isDemo ? '⭐ DEMO DATA — SIMULATED RAILWAY AVAILABILITY' : 'LIVE API STATUS'}
            </div>
            <p className="mt-0.5">{statusMessage}</p>
          </div>
        </div>
      )}

      {/* Train Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Available Trains ({results.length})
          </h3>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
              Simulated Data — Prototype
            </span>
          )}
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/50 dark:bg-[#12100E]/50 border border-gray-200 dark:border-white/10">
            <Train size={36} className="mx-auto text-gray-400 mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No Trains Found for Selected Query</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {!isDemo ? 'Live railway API is currently not connected.' : 'Try changing station names or searching popular routes like Delhi to Parasnath.'}
            </p>
          </div>
        )}

        {results.map((train) => (
          <div
            key={train.id}
            className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:border-[#FF6D00]/50 transition-all space-y-4"
          >
            {/* Top Row: Train Number, Name & Pilgrim Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-xl bg-[#FF6D00]/10 text-[#FF6D00] dark:text-[#FFAB40] font-mono font-black text-xs">
                  #{train.trainNumber}
                </span>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {train.trainName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    <span>Runs on: <strong>{train.runningDays.join(', ')}</strong></span>
                    <span>•</span>
                    <span>{train.stopsCount} Halt Stations</span>
                  </div>
                </div>
              </div>

              {train.nearTirth && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  ⛩️ {train.nearTirth}
                </span>
              )}
            </div>

            {/* Middle Row: Schedule & Duration Timeline */}
            <div className="grid grid-cols-3 gap-2 items-center text-center sm:text-left">
              <div>
                <div className="text-lg sm:text-xl font-mono font-black text-gray-900 dark:text-white">
                  {train.departureTime}
                </div>
                <div className="text-xs font-bold text-[#FF6D00]">{train.fromStationCode}</div>
                <div className="text-[11px] text-gray-500 truncate">{train.fromStationName}</div>
              </div>

              <div className="text-center">
                <div className="text-[11px] font-semibold text-gray-400 flex items-center justify-center gap-1">
                  <Clock size={12} />
                  {train.duration}
                </div>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-200 dark:bg-white/10" />
                  <Train size={14} className="absolute text-[#FF6D00] bg-white dark:bg-[#151210] px-0.5" />
                </div>
                <button
                  onClick={() => onGoToTimetable?.(train.trainNumber)}
                  className="text-[10px] text-[#FF8A65] hover:underline font-bold cursor-pointer"
                >
                  View Route Timetable
                </button>
              </div>

              <div className="text-right">
                <div className="text-lg sm:text-xl font-mono font-black text-gray-900 dark:text-white">
                  {train.arrivalTime}
                </div>
                <div className="text-xs font-bold text-emerald-500">{train.toStationCode}</div>
                <div className="text-[11px] text-gray-500 truncate">{train.toStationName}</div>
              </div>
            </div>

            {/* Jain Meal Service Tag */}
            {train.jainMealAvailable && (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <Utensils size={14} className="shrink-0 text-emerald-500" />
                <span>
                  <strong>Jain Pilgrim Catering:</strong> {train.jainMealType}
                </span>
              </div>
            )}

            {/* Classes Availability & Fares Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {train.classes.map((cls) => {
                const isAvail = cls.statusType === 'available';
                const isRac = cls.statusType === 'rac';
                return (
                  <button
                    key={cls.classCode}
                    type="button"
                    onClick={() => handleOpenBooking(train, cls)}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-[#FF6D00]/10 dark:hover:bg-[#FF6D00]/20 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 dark:text-white">
                        {cls.classCode}
                      </span>
                      <span className="text-xs font-black font-mono text-[#FF6D00]">
                        ₹{cls.fare}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {cls.className}
                    </div>
                    <div className={cn(
                      "text-[11px] font-bold mt-1.5 inline-block px-1.5 py-0.5 rounded-md",
                      isAvail ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                      isRac ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                      "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    )}>
                      {cls.status}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Review & Passenger Modal */}
      {selectedTrain && selectedClassOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#181412] rounded-3xl border border-gray-200 dark:border-white/15 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => { setSelectedTrain(null); setSelectedClassOption(null); setBookingSuccess(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6D00]/10 text-[#FF6D00] flex items-center justify-center">
                    <Train size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Reserve Train Berth (Demo Prototype)
                    </h3>
                    <p className="text-xs text-gray-500">
                      #{selectedTrain.trainNumber} - {selectedTrain.trainName} • {selectedClassOption.className}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  <strong>⭐ No-Cost Free Mode:</strong> This reservation generates a simulated confirmed pilgrim ticket into your <strong>My Trips</strong> & <strong>Booking History</strong>.
                </div>

                {/* Passenger Inputs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Yatrika Names ({passengerNames.length})
                  </label>
                  {passengerNames.map((name, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const copy = [...passengerNames];
                        copy[idx] = e.target.value;
                        setPassengerNames(copy);
                      }}
                      placeholder={`Yatrik #${idx + 1} Full Name`}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                      required
                    />
                  ))}
                </div>

                {/* Jain Meal Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Dietary Compliance (Bhojan)
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setMealPref('jain_chovisi')}
                      className={cn(
                        "p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer",
                        mealPref === 'jain_chovisi'
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] text-[#FF6D00]"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                      )}
                    >
                      🌅 100% Chovisi (Sunset)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMealPref('jain_navkarsi')}
                      className={cn(
                        "p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer",
                        mealPref === 'jain_navkarsi'
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] text-[#FF6D00]"
                          : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
                      )}
                    >
                      ☀️ Navkarsi Breakfast
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                  <span>Total Demo Fare ({passengerNames.length} Yatrik):</span>
                  <span className="text-base font-black font-mono text-[#FF6D00]">
                    ₹{selectedClassOption.fare * passengerNames.length} (Free in Demo)
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedTrain(null); setSelectedClassOption(null); }}
                    className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDemoBooking}
                    disabled={bookingSubmitting}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#FF6D00]/25 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {bookingSubmitting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>Confirm Demo Booking</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Pilgrim Berth Confirmed (Demo Pass)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    PNR: <strong className="font-mono text-[#FF6D00] text-sm">{bookingSuccess.pnr}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Train:</span>
                    <strong className="text-gray-900 dark:text-white">#{selectedTrain.trainNumber} {selectedTrain.trainName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <strong>{journeyDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">From → To:</span>
                    <strong>{selectedTrain.fromStationCode} → {selectedTrain.toStationCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seats Allocated:</span>
                    <strong className="text-emerald-500 font-mono">Coach B3, Berths 22, 23 (Lower/Middle)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jain Bhojan:</span>
                    <strong className="text-[#FF6D00]">{mealPref === 'jain_chovisi' ? '100% Chovisi (Sunset)' : 'Navkarsi'}</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedTrain(null); onGoToBookings?.(); }}
                    className="flex-1 py-2.5 rounded-2xl bg-[#FF6D00] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    View in Booking History
                  </button>
                  <button
                    onClick={() => setSelectedTrain(null)}
                    className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
