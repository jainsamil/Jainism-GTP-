import { useState, useEffect } from 'react';
import { 
  Clock, Search, Train, MapPin, Calendar, CheckCircle2, 
  Info, AlertCircle, RefreshCw, ChevronRight, Navigation 
} from 'lucide-react';
import { trainService } from '../../services/travel/trainService';
import { TrainTimetableResult } from '../../services/travel/types';
import { cn } from '../../lib/utils';

interface TrainTimetableSectionProps {
  initialTrainNumber?: string;
}

export default function TrainTimetableSection({ initialTrainNumber = '12802' }: TrainTimetableSectionProps) {
  const [trainQuery, setTrainQuery] = useState(initialTrainNumber);
  const [loading, setLoading] = useState(false);
  const [timetable, setTimetable] = useState<TrainTimetableResult | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    handleSearchTimetable(initialTrainNumber);
  }, [initialTrainNumber]);

  const handleSearchTimetable = async (queryToSearch?: string) => {
    const q = queryToSearch || trainQuery;
    if (!q) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await trainService.getTrainTimetable(q);
      setTimetable(res.timetable);
      setIsDemo(res.isDemo);
      if (res.message) {
        setMessage(res.message);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error loading train timetable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Clock size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Indian Railways Train Timetable & Route
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Check intermediate halts, arrival/departure timings & nearest Jain Tirth links
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSearchTimetable(); }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Train size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
              <input
                type="text"
                value={trainQuery}
                onChange={(e) => setTrainQuery(e.target.value)}
                placeholder="Enter 5-digit Train Number (e.g. 12802, 22945) or Train Name"
                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-[#FF6D00]/25 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm shrink-0"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
              <span>Get Timetable</span>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Pilgrim Expresses:</span>
            <button
              type="button"
              onClick={() => { setTrainQuery('12802'); handleSearchTimetable('12802'); }}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
            >
              12802 (Purushottam Express • Shikharji)
            </button>
            <button
              type="button"
              onClick={() => { setTrainQuery('22945'); handleSearchTimetable('22945'); }}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
            >
              22945 (Saurashtra Mail • Palitana & Girnar)
            </button>
          </div>
        </form>
      </div>

      {/* Status Notice */}
      {message && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Timetable Station Matrix */}
      {timetable && (
        <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#FF6D00]/10 text-[#FF6D00] font-mono font-black text-xs">
                  Train #{timetable.trainNumber}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {timetable.trainName}
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Route: <strong>{timetable.fromStation}</strong> → <strong>{timetable.toStation}</strong> • {timetable.routeType}
              </p>
            </div>
            {timetable.isDemo && (
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                ⭐ Verified Sacred Route Reference (Demo Mode)
              </span>
            )}
          </div>

          {/* Timeline Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-3">Station Code & Name</th>
                  <th className="py-2.5 px-3">Arrival</th>
                  <th className="py-2.5 px-3">Departure</th>
                  <th className="py-2.5 px-3">Halt</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Jain Pilgrimage Connection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {timetable.halts.map((halt) => (
                  <tr
                    key={halt.srNo}
                    className={cn(
                      "hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                      halt.nearJainTirth ? "bg-[#FF6D00]/5 font-semibold" : ""
                    )}
                  >
                    <td className="py-3 px-2 font-mono text-gray-400">{halt.srNo}</td>
                    <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[#FF6D00]">{halt.stationCode}</span>
                        <span>- {halt.stationName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700 dark:text-gray-300">{halt.arrival}</td>
                    <td className="py-3 px-3 font-mono text-gray-700 dark:text-gray-300">{halt.departure}</td>
                    <td className="py-3 px-3 font-mono text-gray-500">
                      {halt.haltMinutes > 0 ? `${halt.haltMinutes}m` : '--'}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-500">{halt.distanceKm} km</td>
                    <td className="py-3 px-3 font-mono text-gray-500">Day {halt.day}</td>
                    <td className="py-3 px-3">
                      {halt.nearJainTirth ? (
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                          {halt.nearJainTirth}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
