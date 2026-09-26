import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Server, Key, Activity, Users, 
  Ticket, Train, Bus, Plane, RefreshCw, CheckCircle2, 
  AlertTriangle, Settings, Database, Sparkles, ExternalLink 
} from 'lucide-react';
import { getApiStatus, isDemoModeEnabled, setDemoModeEnabled } from '../../services/travel/apiConfig';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { UserBookingRecord, UserTripRecord } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export default function TravelAdminDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(getApiStatus());
  const [isDemo, setIsDemo] = useState(isDemoModeEnabled());
  const [bookings, setBookings] = useState<UserBookingRecord[]>([]);
  const [trips, setTrips] = useState<UserTripRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const b = await travelStorageService.getUserBookings(user?.uid || 'guest_user');
      const t = await travelStorageService.getUserTrips(user?.uid || 'guest_user');
      setBookings(b);
      setTrips(t);
      setStatus(getApiStatus());
      setIsDemo(isDemoModeEnabled());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDemo = () => {
    const next = !isDemo;
    setIsDemo(next);
    setDemoModeEnabled(next);
    setStatus(getApiStatus());
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FF6D00] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Server size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Jain Yatra Sewa • Admin & API Architecture Gateway
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Monitor microservice health, simulated prototype states & live provider connectivity
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Yatra Bookings</span>
          <div className="text-2xl font-mono font-black text-[#FF6D00] mt-1">
            {bookings.length}
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Active Pilgrimage Plans</span>
          <div className="text-2xl font-mono font-black text-emerald-500 mt-1">
            {trips.length}
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">System Environment</span>
          <div className="text-xs font-bold text-amber-500 mt-2">
            {isDemo ? '⭐ Free Demo (Safe)' : '🟢 Live APIs'}
          </div>
        </div>
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-gray-400">Database Layer</span>
          <div className="text-xs font-bold text-blue-500 mt-2">
            Firebase Firestore
          </div>
        </div>
      </div>

      {/* API Adapters Matrix */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key size={16} className="text-[#FF6D00]" />
            Provider Adapters & Live Gateway Architecture
          </h3>
          <button
            onClick={handleToggleDemo}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 cursor-pointer"
          >
            Switch to {isDemo ? 'Production (Live API)' : 'Demo (Simulated)'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* IRCTC Adapter */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5"><Train size={14} className="text-[#FF6D00]" /> IRCTC Indian Railways</span>
              <span className="text-[10px] font-mono text-amber-500">{status.train.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Ready for authorized IRCTC / RailYatri / ConfirmTkt API integration.
            </p>
          </div>

          {/* Bus Adapter */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5"><Bus size={14} className="text-amber-500" /> redBus / AbhiBus GDS</span>
              <span className="text-[10px] font-mono text-amber-500">{status.bus.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Seat layout JSON matrix ready for direct real-time seat inventory mapping.
            </p>
          </div>

          {/* Airline GDS */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5"><Plane size={14} className="text-purple-500" /> Amadeus / Sabre Airline GDS</span>
              <span className="text-[10px] font-mono text-amber-500">{status.flight.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Airlines search and AVML special meal code pre-configured for instant handoff.
            </p>
          </div>
        </div>

        {/* Integration Instructions Card */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <Settings size={15} className="text-blue-500" />
            Zero Cost Architecture Guarantee:
          </div>
          <p className="leading-relaxed">
            All code in <code>/src/services/travel/</code> has been written using an open decoupled provider adapter pattern. You do not need to purchase any paid APIs now. When an authorized booking partner is ready, configure the environment keys in <code>.env</code> and the system will stream live data with zero changes to frontend UI or components.
          </p>
        </div>
      </div>

      {/* Real-time Firestore Booking Stream */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 p-5 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database size={16} className="text-emerald-500" />
          Firestore Stored Reservations ({bookings.length})
        </h3>

        {bookings.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">
            No booking records yet. Create a test booking in Trains or Buses to inspect the database record here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Yatrik</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">PNR / ID</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="py-2.5 px-2 uppercase font-bold text-[10px] text-[#FF6D00]">
                      {b.travelType}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[140px]">
                      {b.serviceName}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 dark:text-gray-300">
                      {b.userName} ({b.passengers.length})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                      {b.source} → {b.destination}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{b.journeyDate}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#FF6D00]">{b.pnrOrBookingId}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
