import { useState, useEffect } from 'react';
import { 
  Plane, Search, Calendar, Users, MapPin, Clock, 
  CheckCircle2, AlertCircle, Utensils, Luggage, 
  ArrowRightLeft, RefreshCw, X, Info, Sparkles 
} from 'lucide-react';
import { flightService, FlightSearchParams } from '../../services/travel/flightService';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { FlightSearchResult, TravelPassenger } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface FlightSearchSectionProps {
  onGoToBookings?: () => void;
}

export default function FlightSearchSection({ onGoToBookings }: FlightSearchSectionProps) {
  const { user } = useAuth();
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [fromAirport, setFromAirport] = useState('DEL - New Delhi');
  const [toAirport, setToAirport] = useState('DGH - Deoghar (Shikharji)');
  const [departDate, setDepartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [cabinClass, setCabinClass] = useState('Economy');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FlightSearchResult[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Booking Modal
  const [selectedFlight, setSelectedFlight] = useState<FlightSearchResult | null>(null);
  const [passengerNames, setPassengerNames] = useState<string[]>(['']);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSwapAirports = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await flightService.searchFlights({
        tripType,
        fromAirport,
        toAirport,
        departDate,
        returnDate: tripType === 'roundTrip' ? returnDate : undefined,
        passengers,
        cabinClass
      });

      setResults(res.results);
      setIsDemo(res.isDemo);
      if (res.message) {
        setStatusMessage(res.message);
      }

      if (user?.uid) {
        travelStorageService.logSearch({
          userId: user.uid,
          travelMode: 'flight',
          source: fromAirport,
          destination: toAirport,
          journeyDate: departDate
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Error searching flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFlightBooking = (flight: FlightSearchResult) => {
    setSelectedFlight(flight);
    setPassengerNames(Array.from({ length: passengers }, (_, i) => i === 0 ? (user?.displayName || 'Yatrik 1') : `Yatrik ${i + 1}`));
    setBookingSuccess(null);
  };

  const handleConfirmFlightBooking = async () => {
    if (!selectedFlight) return;
    setBookingSubmitting(true);

    const passengerList: TravelPassenger[] = passengerNames.map((name, idx) => ({
      id: `p_fl_${Date.now()}_${idx}`,
      name: name || `Passenger ${idx + 1}`,
      age: 32 + idx * 5,
      gender: idx % 2 === 0 ? 'male' : 'female',
      mealPreference: 'jain_sunset'
    }));

    const totalAmt = selectedFlight.fare * passengerList.length;
    const fakePnr = `FL-${selectedFlight.airlineCode}-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const saved = await travelStorageService.saveBooking(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        travelType: 'flight',
        serviceName: `${selectedFlight.airline} (${selectedFlight.flightNumber})`,
        serviceNumber: selectedFlight.flightNumber,
        source: selectedFlight.fromAirportCode,
        destination: selectedFlight.toAirportCode,
        journeyDate: departDate,
        travelClass: selectedFlight.cabinClass,
        passengers: passengerList,
        seatNumbers: passengerList.map((_, i) => `${12 + i}A`),
        totalAmount: totalAmt,
        status: 'CONFIRMED',
        pnrOrBookingId: fakePnr,
        paymentMethod: 'Demo Confirmation (Free Prototype Mode)',
        jainFoodRequested: true,
        isDemo: true
      });

      await travelStorageService.saveTrip(user?.uid || 'guest_user', {
        userEmail: user?.email || 'pilgrim@jainismgpt.com',
        userName: user?.displayName || passengerList[0].name,
        tripTitle: `Pilgrimage Flight to ${selectedFlight.toAirportName}`,
        destinationTirth: selectedFlight.nearTirth || selectedFlight.toAirportName,
        travelMode: 'flight',
        startDate: departDate,
        endDate: tripType === 'roundTrip' ? returnDate : undefined,
        passengers: passengerList,
        status: 'CONFIRMED',
        pnrOrTicketNo: fakePnr,
        totalCost: totalAmt,
        isDemoRecord: true,
        notes: `Flight: ${selectedFlight.airline} #${selectedFlight.flightNumber}. Special Jain Meal (AVML) requested.`
      });

      setBookingSuccess({ ...saved, pnr: fakePnr });
    } catch (err) {
      console.error(err);
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Flight Search Card */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Plane size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Pilgrim Air Travel Assistant
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Fast flights to Deoghar (Shikharji), Bhavnagar (Palitana), Udaipur & Indore
            </p>
          </div>
        </div>

        {/* One Way / Round Trip Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTripType('oneWay')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
              tripType === 'oneWay' 
                ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            )}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('roundTrip')}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
              tripType === 'roundTrip' 
                ? "bg-[#FF6D00] text-white shadow-md shadow-[#FF6D00]/20" 
                : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            )}
          >
            Round Trip
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From Airport */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Departure Airport
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="text"
                  value={fromAirport}
                  onChange={(e) => setFromAirport(e.target.value)}
                  placeholder="e.g. DEL (Delhi), BOM (Mumbai), AMD (Ahmedabad)"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwapAirports}
                className="w-10 h-10 rounded-full bg-[#FF6D00]/10 dark:bg-white/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] flex items-center justify-center transition-all cursor-pointer border border-[#FF6D00]/20"
                title="Swap Airports"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* To Airport */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Arrival Airport / Tirth Gateway
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  value={toAirport}
                  onChange={(e) => setToAirport(e.target.value)}
                  placeholder="e.g. DGH (Deoghar), BHU (Bhavnagar), IXR (Ranchi)"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Depart Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Departure Date
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Return Date (if round trip) */}
            {tripType === 'roundTrip' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  />
                </div>
              </div>
            )}

            {/* Cabin Class */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Cabin Class
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1C1815] border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
              >
                <option value="Economy">Economy Class</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
              </select>
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
              <span className="text-[10px] text-gray-400 font-bold uppercase">Nearest Tirth Airports:</span>
              <button
                type="button"
                onClick={() => { setFromAirport('DEL (Delhi)'); setToAirport('DGH (Deoghar - Shikharji)'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Delhi → Deoghar (Shikharji)
              </button>
              <button
                type="button"
                onClick={() => { setFromAirport('BOM (Mumbai)'); setToAirport('BHU (Bhavnagar - Palitana)'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Mumbai → Bhavnagar (Palitana)
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
                  <span>Searching Airline GDS...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Search Flights</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Flight Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Available Flights ({results.length})
          </h3>
          {isDemo && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
              Simulated Airline Data (Demo Mode)
            </span>
          )}
        </div>

        {results.map((fl) => (
          <div
            key={fl.id}
            className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:border-[#FF6D00]/50 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black font-mono text-xs">
                  {fl.airlineCode}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {fl.airline} <span className="text-xs text-gray-500">({fl.flightNumber})</span>
                  </h4>
                  <div className="text-[11px] text-gray-400">
                    {fl.cabinClass} • {fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-mono font-black text-[#FF6D00]">
                  ₹{fl.fare}
                </div>
                <div className="text-[10px] text-gray-400">per yatrik</div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div>
                <div className="text-lg font-mono font-black text-gray-900 dark:text-white">
                  {fl.departureTime}
                </div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{fl.fromAirportCode}</div>
                <div className="text-[10px] text-gray-400 truncate">{fl.fromAirportName}</div>
              </div>

              <div className="text-center">
                <div className="text-[11px] font-semibold text-gray-400 flex items-center justify-center gap-1">
                  <Clock size={12} />
                  {fl.duration}
                </div>
                <div className="relative my-1.5 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-200 dark:bg-white/10" />
                  <Plane size={14} className="absolute text-[#FF6D00] bg-white dark:bg-[#151210] px-0.5" />
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-mono font-black text-gray-900 dark:text-white">
                  {fl.arrivalTime}
                </div>
                <div className="text-xs font-bold text-emerald-500">{fl.toAirportCode}</div>
                <div className="text-[10px] text-gray-400 truncate">{fl.toAirportName}</div>
              </div>
            </div>

            {/* Baggage & Tirth Link */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] flex items-center gap-1">
                  <Luggage size={11} /> {fl.baggage}
                </span>
                {fl.jainMealAvailable && (
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <Utensils size={11} /> Pure Jain Meal (AVML)
                  </span>
                )}
                {fl.nearTirth && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                    ⛩️ {fl.nearTirth}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenFlightBooking(fl)}
                className="px-4 py-2 bg-[#FF6D00] hover:bg-[#FF8A65] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6D00]/20 transition-all cursor-pointer"
              >
                Book Flight (Demo)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Flight Booking Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#181412] rounded-3xl border border-gray-200 dark:border-white/15 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => { setSelectedFlight(null); setBookingSuccess(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF6D00]/10 text-[#FF6D00] flex items-center justify-center">
                    <Plane size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Confirm Flight Booking (Demo)
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedFlight.airline} #{selectedFlight.flightNumber} • {selectedFlight.fromAirportCode} → {selectedFlight.toAirportCode}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  <strong>⭐ No-Cost Free Mode:</strong> Free simulated flight reservation with AVML Pure Jain In-Flight Meal.
                </div>

                {/* Passenger Form */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Yatrika Names
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
                      placeholder={`Yatrik #${idx + 1} Name as on Govt ID`}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                      required
                    />
                  ))}
                </div>

                {/* Fare Summary */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                  <span>Total Amount ({passengerNames.length} Yatrik):</span>
                  <span className="text-base font-black font-mono text-[#FF6D00]">
                    ₹{selectedFlight.fare * passengerNames.length} (Free in Demo)
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedFlight(null)}
                    className="flex-1 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmFlightBooking}
                    disabled={bookingSubmitting}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#FF6D00]/25 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {bookingSubmitting ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                    <span>Confirm Flight Demo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Flight E-Ticket Issued (Demo)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    PNR: <strong className="font-mono text-[#FF6D00] text-sm">{bookingSuccess.pnr}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flight:</span>
                    <strong>{selectedFlight.airline} ({selectedFlight.flightNumber})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route:</span>
                    <strong>{selectedFlight.fromAirportCode} → {selectedFlight.toAirportCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Special Meal:</span>
                    <strong className="text-emerald-500">AVML (Pure Jain Vegetarian Meal)</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedFlight(null); onGoToBookings?.(); }}
                    className="flex-1 py-2.5 rounded-2xl bg-[#FF6D00] text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    View in Booking History
                  </button>
                  <button
                    onClick={() => setSelectedFlight(null)}
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
