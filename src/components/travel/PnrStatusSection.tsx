import { useState } from 'react';
import { 
  Ticket, Search, CheckCircle2, AlertCircle, Clock, 
  Info, Shield, RefreshCw, Train, UserCheck, Utensils 
} from 'lucide-react';
import { pnrService } from '../../services/travel/pnrService';
import { PnrStatusResult } from '../../services/travel/types';
import { cn } from '../../lib/utils';

export default function PnrStatusSection() {
  const [pnrInput, setPnrInput] = useState('2458963214');
  const [loading, setLoading] = useState(false);
  const [pnrResult, setPnrResult] = useState<PnrStatusResult | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckPnr = async (customPnr?: string) => {
    const pnrToTest = customPnr || pnrInput;
    if (!pnrToTest) return;

    setLoading(true);
    setErrorMessage(null);
    setPnrResult(null);

    try {
      const res = await pnrService.checkPnrStatus(pnrToTest);
      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.result) {
        setPnrResult(res.result);
        setIsDemo(res.isDemo);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to connect to railway PNR gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & PNR Form */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Ticket size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Railway PNR Status Tracker
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Check live booking confirmation, coach/berth allocation & chart status
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleCheckPnr(); }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Ticket size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
              <input
                type="text"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-Digit PNR Number (e.g. 2458963214)"
                className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-mono font-bold tracking-wider text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || pnrInput.length !== 10}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] hover:brightness-110 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-[#FF6D00]/25 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm shrink-0"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
              <span>Check PNR Status</span>
            </button>
          </div>

          {/* Test PNR shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Quick Test PNRs:</span>
            <button
              type="button"
              onClick={() => { setPnrInput('2458963214'); handleCheckPnr('2458963214'); }}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-mono font-bold cursor-pointer"
            >
              2458963214 (Purushottam • Confirmed)
            </button>
            <button
              type="button"
              onClick={() => { setPnrInput('8745219630'); handleCheckPnr('8745219630'); }}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-mono font-bold cursor-pointer"
            >
              8745219630 (Saurashtra Mail • Tatkal)
            </button>
          </div>
        </form>
      </div>

      {/* Error / Live Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PNR Details Result Card */}
      {pnrResult && (
        <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">PNR Number:</span>
                <span className="text-lg font-mono font-black text-[#FF6D00] tracking-wider">
                  {pnrResult.pnrNumber}
                </span>
                {pnrResult.isDemo && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                    Demo Simulated Result
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                Train #{pnrResult.trainNumber} - {pnrResult.trainName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                pnrResult.chartPrepared 
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", pnrResult.chartPrepared ? "bg-emerald-500" : "bg-amber-500")} />
                {pnrResult.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
              </span>
            </div>
          </div>

          {/* Journey Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-200 dark:border-white/10">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Journey</span>
              <span className="font-bold text-gray-900 dark:text-white">{pnrResult.dateOfJourney}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">From → To</span>
              <span className="font-bold text-gray-900 dark:text-white truncate block">{pnrResult.fromStation} → {pnrResult.toStation}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Class & Quota</span>
              <span className="font-bold text-gray-900 dark:text-white">{pnrResult.className} ({pnrResult.quota})</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Boarding Station</span>
              <span className="font-bold text-gray-900 dark:text-white">{pnrResult.boardingStation}</span>
            </div>
          </div>

          {/* Passenger Status Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Passenger Status
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-2 px-3">Passenger</th>
                    <th className="py-2 px-3">Booking Status</th>
                    <th className="py-2 px-3">Current Status</th>
                    <th className="py-2 px-3">Coach / Berth</th>
                    <th className="py-2 px-3">Berth Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {pnrResult.passengers.map((p) => (
                    <tr key={p.passengerNo} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                        Passenger #{p.passengerNo}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-gray-600 dark:text-gray-300">
                        {p.bookingStatus}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {p.currentStatus}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#FF6D00]">
                        Coach {p.coach}, Berth {p.berthNo}
                      </td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                        {p.berthType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pnrResult.notes && (
            <div className="p-3 rounded-xl bg-[#FF6D00]/5 border border-[#FF6D00]/15 text-xs text-[#FF6D00] flex items-center gap-2">
              <Utensils size={14} className="shrink-0" />
              <span>{pnrResult.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
