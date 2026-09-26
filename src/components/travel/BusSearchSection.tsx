import { useState, useEffect } from 'react';
import { 
  Bus, Search, Calendar, Users, MapPin, Clock, 
  CheckCircle2, AlertCircle, Utensils, Star, Shield, 
  ArrowRightLeft, RefreshCw, X, Info, Sparkles 
} from 'lucide-react';
import { busService, BusSearchParams } from '../../services/travel/busService';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { BusSearchResult, BusSeat, TravelPassenger } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface BusSearchSectionProps {
  onGoToBookings?: () => void;
}

export default function BusSearchSection({ onGoToBookings }: BusSearchSectionProps) {
  const { user } = useAuth();
  const [fromCity, setFromCity] = useState('Indore');
  const [toCity, setToCity] = useState('Sammed Shikharji (Madhuban)');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BusSearchResult[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Seat Selection Modal State
  const [selectedBus, setSelectedBus] = useState<BusSearchResult | null>(null);
  const [seatLayout, setSeatLayout] = useState<{ lowerDeck: BusSeat[]; upperDeck: BusSeat[] } | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerNames, setPassengerNames] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await busService.searchBuses({
        fromCity,
        toCity,
        journeyDate,
        passengers
      });

      setResults(res.results);
      setIsDemo(res.isDemo);
      if (res.message) {
        setStatusMessage(res.message);
      }

      if (user?.uid) {
        travelStorageService.logSearch({
          userId: user.uid,
          travelMode: 'bus',
          source: fromCity,
          destination: toCity,
          journeyDate
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error searching bus routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSeatModal = (bus: BusSearchResult) => {
    setSelectedBus(bus);
    const layout = busService.generateSeatLayout(bus.id, bus.fareStartingFrom);
    setSeatLayout(layout);
    setSelectedSeats([]);
    setPassengerNames([]);
    setBookingSuccess(null);
  };

  const handleToggleSeat = (seat: BusSeat) => {
    if (!seat.isAvailable) return;
    let updated: string[];
    if (selectedSeats.includes(seat.seatNo)) {
      updated = selectedSeats.filter(s => s !== seat.seatNo);
    } else {
      if (selectedSeats.length >= 6) return;
      updated = [...selectedSeats, seat.seatNo];
    }
    setSelectedSeats(updated);
    setPassengerNames(updated.map((_, i) => passengerNames[i] || (i === 0 ? (user?.displayName || 'Yatrik 1') : `Yatrik ${i + 1}`)));
  };

  const handleConfirmBusBooking = async () => {
    if (!selectedBus || selectedSeats.length === 0) return;
    setBookingSubmitting(true);

    const passengerList: TravelPassenger[] = passengerNames.map((name, idx) => ({
      id: `p_bus_${Date.now()}_${idx}`,
      name: name || `Passenger ${idx + 1}`,
      age: 28 + idx * 4,
      gender: idx % 2 === 0 ? 'male' : 'female',
      berthPreference: selectedSeats[idx],
      mealPreference: 'jain_sunset'
    }));

    const totalAmt = selectedBus.fareStartingFrom * selectedSeats.length;
    const fakeBookingId = `BUS-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const saved = await travelStorageService.saveBooking(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        travelType: 'bus',
        serviceName: selectedBus.operatorName,
        serviceNumber: selectedBus.busType,
        source: selectedBus.fromCity,
        destination: selectedBus.toCity,
        journeyDate,
        travelClass: 'AC Sleeper 2+1',
        passengers: passengerList,
        seatNumbers: selectedSeats,
        totalAmount: totalAmt,
        status: 'CONFIRMED',
        pnrOrBookingId: fakeBookingId,
        paymentMethod: 'Demo Confirmation (Free Prototype Mode)',
        jainFoodRequested: true,
        isDemo: true
      });

      await travelStorageService.saveTrip(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        tripTitle: `Pilgrim Bus to ${selectedBus.toCity}`,
        destinationTirth: selectedBus.nearTirth || selectedBus.toCity,
        travelMode: 'bus',
        startDate: journeyDate,
        passengers: passengerList,
        status: 'CONFIRMED',
        pnrOrTicketNo: fakeBookingId,
        totalCost: totalAmt,
        isDemoRecord: true,
        notes: `Bus: ${selectedBus.operatorName} (${selectedBus.busType}). Boarding: ${selectedBus.boardingPoint}`
      });

      setBookingSuccess({ ...saved, bookingId: fakeBookingId });
    } catch (err) {
      console.error(err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Bus size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Pilgrim AC Bus & Sangh Transport
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Direct Volvo & Sleeper Buses with Sunset Bhojan Stops
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From City */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Departure City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Mumbai, Indore, Ahmedabad, Delhi, Bhopal"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwapCities}
                className="w-10 h-10 rounded-full bg-[#FF6D00]/10 dark:bg-white/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] flex items-center justify-center transition-all cursor-pointer border border-[#FF6D00]/20"
                title="Swap Cities"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Destination Tirth / City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Sammed Shikharji, Palitana, Girnarji, Kundalpur"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {/* Passengers */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Yatrikas
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
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Popular:</span>
              <button
                type="button"
                onClick={() => { setFromCity('Indore'); setToCity('Sammed Shikharji'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Indore → Shikharji
              </button>
              <button
                type="button"
                onClick={() => { setFromCity('Mumbai'); setToCity('Palitana'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Mumbai → Palitana
              </button>
              <button
                type="button"
                onClick={() => { setFromCity('Ahmedabad'); setToCity('Girnarji'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Ahmedabad → Girnar
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-[#FF6D00]/25 flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Searching Buses...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Search Buses</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Bus Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Available Pilgrim Buses ({results.length})
          </h3>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
              Simulated Bus Operators (Demo Mode)
            </span>
          )}
        </div>

        {results.map((bus) => (
          <div
            key={bus.id}
            className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:border-[#FF6D00]/50 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {bus.operatorName}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 font-bold text-gray-700 dark:text-gray-300">
                    {bus.busType}
                  </span>
                  <span>•</span>
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star size={12} className="fill-amber-500 inline mr-0.5" /> {bus.rating}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-mono font-black text-[#FF6D00]">
                  ₹{bus.fareStartingFrom}
                </div>
                <div className="text-[10px] text-emerald-500 font-bold">
                  {bus.availableSeats} Seats Available
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <div className="text-lg font-mono font-black text-gray-900 dark:text-white">
                  {bus.departureTime}
                </div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{bus.fromCity}</div>
                <div className="text-[10px] text-gray-400 truncate">{bus.boardingPoint}</div>
              </div>

              <div className="text-center">
                <div className="text-[11px] font-semibold text-gray-400 flex items-center justify-center gap-1">
                  <Clock size={12} />
                  {bus.duration}
                </div>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-200 dark:bg-white/10" />
                  <Bus size={14} className="absolute text-[#FF6D00] bg-white dark:bg-[#151210] px-0.5" />
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-mono font-black text-gray-900 dark:text-white">
                  {bus.arrivalTime}
                </div>
                <div className="text-xs font-bold text-emerald-500">{bus.toCity}</div>
                <div className="text-[10px] text-gray-400 truncate">{bus.droppingPoint}</div>
              </div>
            </div>

            {/* Amenities & Jain Bhojan Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {bus.jainMealFacility && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <Utensils size={11} /> 100% Chovisi Dinner Stop
                  </span>
                )}
                {bus.amenities.slice(0, 2).map((am, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px]">
                    {am}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleOpenSeatModal(bus)}
                className="px-4 py-2 bg-[#FF6D00] hover:bg-[#FF8A65] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6D00]/20 transition-all cursor-pointer"
              >
                Select Seats ({bus.availableSeats} Left)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Seat Selection Modal */}
      {selectedBus && seatLayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-[#181412] rounded-3xl border border-gray-200 dark:border-white/15 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => { setSelectedBus(null); setSeatLayout(null); setBookingSuccess(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6D00]/10 text-[#FF6D00] flex items-center justify-center">
                    <Bus size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Select Sleeper Berths
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedBus.operatorName} • {selectedBus.busType}
                    </p>
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="flex items-center justify-center gap-4 text-xs py-2 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-6 rounded border border-gray-300 dark:border-white/20 bg-white dark:bg-[#201C19]" />
                    <span className="text-[11px] text-gray-500">Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-6 rounded bg-[#FF6D00] text-white" />
                    <span className="text-[11px] text-gray-500">Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-6 rounded bg-gray-300 dark:bg-white/10 opacity-50" />
                    <span className="text-[11px] text-gray-500">Booked</span>
                  </div>
                </div>

                {/* Sleeper Layout Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lower Deck */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
                    <div className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                      Lower Deck (Sleeper)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {seatLayout.lowerDeck.map((seat) => {
                        const isSel = selectedSeats.includes(seat.seatNo);
                        return (
                          <button
                            key={seat.seatNo}
                            type="button"
                            disabled={!seat.isAvailable}
                            onClick={() => handleToggleSeat(seat)}
                            className={cn(
                              "p-2.5 rounded-xl border text-center font-mono font-bold text-xs transition-all cursor-pointer",
                              isSel ? "bg-[#FF6D00] border-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/30" :
                              seat.isAvailable ? "bg-white dark:bg-[#201C19] border-gray-200 dark:border-white/15 text-gray-800 dark:text-gray-200 hover:border-[#FF6D00]" :
                              "bg-gray-200 dark:bg-white/5 border-transparent text-gray-400 cursor-not-allowed opacity-40"
                            )}
                          >
                            <div>{seat.seatNo}</div>
                            <div className="text-[9px] opacity-75">₹{seat.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upper Deck */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2">
                    <div className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                      Upper Deck (Sleeper)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {seatLayout.upperDeck.map((seat) => {
                        const isSel = selectedSeats.includes(seat.seatNo);
                        return (
                          <button
                            key={seat.seatNo}
                            type="button"
                            disabled={!seat.isAvailable}
                            onClick={() => handleToggleSeat(seat)}
                            className={cn(
                              "p-2.5 rounded-xl border text-center font-mono font-bold text-xs transition-all cursor-pointer",
                              isSel ? "bg-[#FF6D00] border-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/30" :
                              seat.isAvailable ? "bg-white dark:bg-[#201C19] border-gray-200 dark:border-white/15 text-gray-800 dark:text-gray-200 hover:border-[#FF6D00]" :
                              "bg-gray-200 dark:bg-white/5 border-transparent text-gray-400 cursor-not-allowed opacity-40"
                            )}
                          >
                            <div>{seat.seatNo}</div>
                            <div className="text-[9px] opacity-75">₹{seat.price}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Selected Seats & Passenger Name Form */}
                {selectedSeats.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Selected Berths: <strong className="text-[#FF6D00]">{selectedSeats.join(', ')}</strong>
                    </div>
                    {selectedSeats.map((seatNo, idx) => (
                      <input
                        key={seatNo}
                        type="text"
                        value={passengerNames[idx] || ''}
                        onChange={(e) => {
                          const copy = [...passengerNames];
                          copy[idx] = e.target.value;
                          setPassengerNames(copy);
                        }}
                        placeholder={`Yatrik for Seat ${seatNo}`}
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                      />
                    ))}
                  </div>
                )}

                {/* Total and Action */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                  <span>Total Amount ({selectedSeats.length} Seats):</span>
                  <span className="text-base font-black font-mono text-[#FF6D00]">
                    ₹{selectedBus.fareStartingFrom * selectedSeats.length} (Free in Demo)
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedBus(null); setSeatLayout(null); }}
                    className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={selectedSeats.length === 0 || bookingSubmitting}
                    onClick={handleConfirmBusBooking}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#FF6D00]/25 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {bookingSubmitting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>Confirm Demo Seats</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bus Sleeper Confirmed (Demo Pass)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Booking ID: <strong className="font-mono text-[#FF6D00] text-sm">{bookingSuccess.bookingId}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operator:</span>
                    <strong>{selectedBus.operatorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route:</span>
                    <strong>{selectedBus.fromCity} → {selectedBus.toCity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Berths Allocated:</span>
                    <strong className="text-emerald-500 font-mono">{selectedSeats.join(', ')}</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedBus(null); onGoToBookings?.(); }}
                    className="flex-1 py-2.5 rounded-2xl bg-[#FF6D00] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    View in Booking History
                  </button>
                  <button
                    onClick={() => setSelectedBus(null)}
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
