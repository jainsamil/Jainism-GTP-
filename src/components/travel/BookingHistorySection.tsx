import { useState, useEffect } from 'react';
import { 
  Ticket, Train, Bus, Plane, Calendar, Users, 
  MapPin, CheckCircle2, Clock, Trash2, Printer, 
  QrCode, X, RefreshCw, AlertCircle, Sparkles, Utensils 
} from 'lucide-react';
import { travelStorageService } from '../../services/travel/travelStorageService';
import { UserBookingRecord } from '../../services/travel/types';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export default function BookingHistorySection() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UserBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'train' | 'bus' | 'flight'>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<UserBookingRecord | null>(null);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await travelStorageService.getUserBookings(user?.uid || 'guest_user');
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking ticket?')) return;
    try {
      await travelStorageService.updateBookingStatus(user?.uid || 'guest_user', bookingId, 'CANCELLED');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'CANCELLED' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterType === 'ALL') return true;
    return b.travelType === filterType;
  });

  const getTravelIcon = (type: string) => {
    switch (type) {
      case 'train': return <Train size={16} className="text-[#FF6D00]" />;
      case 'bus': return <Bus size={16} className="text-amber-500" />;
      case 'flight': return <Plane size={16} className="text-purple-500" />;
      default: return <Ticket size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Ticket size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Yatra Booking Pass & E-Tickets
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              View confirmed tickets, PNR numbers, allocated berths & print pilgrim boarding passes
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
          {(['ALL', 'train', 'bus', 'flight'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                filterType === type 
                  ? "bg-white dark:bg-[#201C19] text-[#FF6D00] shadow-sm font-black" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              )}
            >
              {type === 'ALL' ? 'All Tickets' : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#FF6D00]" />
          Loading your travel passes...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/50 dark:bg-[#12100E]/50 border border-gray-200 dark:border-white/10 space-y-2">
          <Ticket size={36} className="mx-auto text-gray-400 opacity-50" />
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
            No Bookings Found in History
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Make a demo booking in Trains, Buses or Flights to generate simulated travel passes here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm hover:border-[#FF6D00]/50 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                  {getTravelIcon(b.travelType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {b.serviceName}
                    </h4>
                    <span className="font-mono text-xs font-black text-[#FF6D00]">
                      PNR: {b.pnrOrBookingId}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    <strong>{b.source}</strong> → <strong>{b.destination}</strong> • {b.journeyDate}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {b.passengers.length} Yatrik • {b.seatNumbers.join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-mono font-black text-gray-900 dark:text-white">
                    ₹{b.totalAmount}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5",
                    b.status === 'CONFIRMED' ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                    b.status === 'CANCELLED' ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" :
                    "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  )}>
                    {b.status} {b.isDemo ? '(Demo Pass)' : ''}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className="px-3.5 py-2 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  View Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Pass View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-[#181412] rounded-3xl border border-gray-200 dark:border-white/15 shadow-2xl p-6 relative my-8">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Boarding Pass Layout */}
            <div className="space-y-4 text-left">
              <div className="border-b border-dashed border-gray-200 dark:border-white/15 pb-4 text-center">
                <div className="text-[10px] font-mono uppercase font-black tracking-widest text-[#FF6D00]">
                  JAIN YATRA SEWA • SACRED BOARDING PASS
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">
                  {selectedBooking.serviceName}
                </h3>
                <div className="mt-1 font-mono text-xs font-bold text-gray-500">
                  PNR / TICKET: <span className="text-[#FF6D00]">{selectedBooking.pnrOrBookingId}</span>
                </div>
              </div>

              {/* Route & Date */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Origin</span>
                  <strong className="text-gray-900 dark:text-white">{selectedBooking.source}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Destination</span>
                  <strong className="text-emerald-500">{selectedBooking.destination}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Travel Date</span>
                  <strong className="text-gray-900 dark:text-white">{selectedBooking.journeyDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Seats / Berths</span>
                  <strong className="text-[#FF6D00]">{selectedBooking.seatNumbers.join(', ')}</strong>
                </div>
              </div>

              {/* Passengers Table */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-gray-400">Yatrika List:</span>
                {selectedBooking.passengers.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-white/5">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{p.name}</span>
                    <span className="text-[11px] text-emerald-500 font-mono font-bold">Pure Jain Meal</span>
                  </div>
                ))}
              </div>

              {/* QR & Barcode Section */}
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-gray-400">VERIFICATION CODE</div>
                  <div className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                    JYS-{selectedBooking.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="text-[9px] text-amber-600 dark:text-amber-400">
                    ⭐ Free Demo Boarding Pass
                  </div>
                </div>
                <div className="w-14 h-14 bg-white dark:bg-black p-1.5 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center">
                  <QrCode size={42} className="text-gray-900 dark:text-white" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selectedBooking.status !== 'CANCELLED' && (
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="py-2.5 px-4 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold cursor-pointer"
                  >
                    Cancel Ticket
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-2xl bg-[#FF6D00] hover:bg-[#FF8A65] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>Print Boarding Pass</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
