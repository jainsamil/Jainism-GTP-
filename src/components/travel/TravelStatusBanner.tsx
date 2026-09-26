import { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, Info, Sparkles, ToggleLeft, ToggleRight, CheckCircle2, Server, ExternalLink } from 'lucide-react';
import { getApiStatus, isDemoModeEnabled, setDemoModeEnabled } from '../../services/travel/apiConfig';
import { ApiStatusInfo } from '../../services/travel/types';
import { cn } from '../../lib/utils';

export default function TravelStatusBanner() {
  const [status, setStatus] = useState<ApiStatusInfo>(getApiStatus());
  const [isDemo, setIsDemo] = useState<boolean>(isDemoModeEnabled());
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStatus(getApiStatus());
      setIsDemo(isDemoModeEnabled());
    };

    window.addEventListener('jain-travel-demo-mode-changed', handleUpdate);
    return () => window.removeEventListener('jain-travel-demo-mode-changed', handleUpdate);
  }, []);

  const handleToggleDemo = () => {
    const next = !isDemo;
    setIsDemo(next);
    setDemoModeEnabled(next);
    setStatus(getApiStatus());
  };

  const getStatusBadge = (state: 'connected' | 'demo' | 'unavailable', label: string) => {
    if (state === 'connected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {label}: Live Connected
        </span>
      );
    }
    if (state === 'demo') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          {label}: Demo Mode
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        {label}: API Pending
      </span>
    );
  };

  return (
    <div className="mb-6 rounded-2xl bg-white/70 dark:bg-[#151210]/80 backdrop-blur-xl border border-amber-500/20 shadow-sm p-4 text-gray-800 dark:text-gray-200 transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF6D00]/10 dark:bg-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00] shrink-0">
            <Server size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FF6D00] dark:text-[#FFAB40]">
                API Integration & Architecture Status
              </h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] text-gray-500 hover:text-gray-800 dark:hover:text-white underline cursor-pointer"
              >
                {showDetails ? 'Hide Status Matrix' : 'View Status Matrix'}
              </button>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-tight mt-0.5">
              {isDemo ? (
                <span>
                  <strong className="text-amber-600 dark:text-amber-400">Demo Prototype Active:</strong> All railway/bus/flight timetables and seats are simulated for free UI preview. No fake data presented as real.
                </span>
              ) : (
                <span>
                  <strong className="text-rose-600 dark:text-rose-400">Production Live Mode:</strong> Live APIs are disconnected. System safely shows unavailable notices rather than mock bookings.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Demo Mode Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl">
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Demo Mode</span>
          <button
            onClick={handleToggleDemo}
            className="flex items-center text-[#FF6D00] hover:scale-105 transition-all cursor-pointer"
            title="Toggle Demo Mode vs Live Production Mode"
          >
            {isDemo ? (
              <ToggleRight size={26} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={26} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded API Service Indicators */}
      {showDetails && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Service Provider Adapters (Zero-Cost Open Architecture):
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(status.train, '🚆 Train / IRCTC')}
            {getStatusBadge(status.bus, '🚌 Bus Booking')}
            {getStatusBadge(status.flight, '✈️ Airline GDS')}
            {getStatusBadge(status.pnr, '🎫 Railway PNR')}
            {getStatusBadge(status.maps, '📍 Satellite Maps')}
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-2">
            <Info size={14} className="text-[#FF6D00] shrink-0 mt-0.5" />
            <span>
              <strong>Provider Readiness:</strong> When authorized API keys (e.g. IRCTC API, redBus API, Amadeus GDS, Google Maps) are configured in backend environment variables, all adapters will switch to 🟢 Live Mode automatically without changing UI code.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
