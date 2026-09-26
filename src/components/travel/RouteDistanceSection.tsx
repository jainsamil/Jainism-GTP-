import { useState, useEffect } from 'react';
import { 
  Navigation, Search, MapPin, Clock, ArrowRightLeft, 
  Train, Bus, Car, Plane, Mountain, Compass, Shield, 
  Info, RefreshCw, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { routeService } from '../../services/travel/routeService';
import { RouteDistanceResult } from '../../services/travel/types';
import { cn } from '../../lib/utils';

export default function RouteDistanceSection() {
  const [sourceCity, setSourceCity] = useState('Delhi');
  const [destCity, setDestCity] = useState('Sammed Shikharji (Parasnath)');
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteDistanceResult | null>(null);
  const [isDemo, setIsDemo] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    handleCalculateRoute();
  }, []);

  const handleSwap = () => {
    const temp = sourceCity;
    setSourceCity(destCity);
    setDestCity(temp);
  };

  const handleCalculateRoute = async (src?: string, dst?: string) => {
    const s = src || sourceCity;
    const d = dst || destCity;
    if (!s || !d) return;

    setLoading(true);
    setNotice(null);

    try {
      const res = await routeService.calculateRoute(s, d);
      setRouteResult(res.result);
      setIsDemo(res.isDemo);
      if (res.message) setNotice(res.message);
    } catch (err) {
      console.error(err);
      setNotice('Could not calculate pilgrim route.');
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train': return <Train size={18} className="text-[#FF6D00]" />;
      case 'bus': return <Bus size={18} className="text-amber-500" />;
      case 'car': return <Car size={18} className="text-blue-500" />;
      case 'flight': return <Plane size={18} className="text-purple-500" />;
      default: return <Navigation size={18} className="text-[#FF6D00]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Route Calculator Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-[#12100E]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6D00] to-[#FFAB40] flex items-center justify-center text-white shadow-md shadow-[#FF6D00]/20">
            <Navigation size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black text-gray-900 dark:text-white">
              Pilgrim Route & Distance Calculator
            </h2>
            <p className="text-xs text-[#FF8A65] font-bold">
              Compare Road, Train & Air travel with mountain climb guides & sunset meal rest stops
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleCalculateRoute(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Origin */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Starting Location
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF6D00]" />
                <input
                  type="text"
                  value={sourceCity}
                  onChange={(e) => setSourceCity(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Ahmedabad, Indore"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>

            {/* Swap */}
            <div className="md:col-span-2 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-[#FF6D00]/10 dark:bg-white/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] flex items-center justify-center transition-all cursor-pointer border border-[#FF6D00]/20"
                title="Swap Cities"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Destination */}
            <div className="md:col-span-5 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Sacred Tirth Destination
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="text"
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  placeholder="e.g. Sammed Shikharji, Palitana, Girnarji, Ranakpur"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#FF6D00]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Popular Pilgrimages:</span>
              <button
                type="button"
                onClick={() => { setSourceCity('Delhi'); setDestCity('Sammed Shikharji'); handleCalculateRoute('Delhi', 'Sammed Shikharji'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Delhi → Shikharji
              </button>
              <button
                type="button"
                onClick={() => { setSourceCity('Mumbai'); setDestCity('Palitana'); handleCalculateRoute('Mumbai', 'Palitana'); }}
                className="px-2.5 py-1 rounded-full text-[11px] bg-[#FF6D00]/10 hover:bg-[#FF6D00]/20 text-[#FF6D00] font-bold cursor-pointer"
              >
                Mumbai → Palitana
              </button>
              <button
                type="button"
                onClick={() => { setSourceCity('Ahmedabad'); setDestCity('Girnar'); handleCalculateRoute('Ahmedabad', 'Girnar'); }}
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
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Navigation size={16} />}
              <span>Calculate Distance & Route</span>
            </button>
          </div>
        </form>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>{notice}</span>
        </div>
      )}

      {/* Result Card */}
      {routeResult && (
        <div className="space-y-6">
          {/* Main Highlights Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Distance</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-[#FF6D00] mt-1">
                {routeResult.distanceKm} <span className="text-sm font-sans font-bold">km</span>
              </div>
            </div>
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">Est. Road Drive Time</span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-gray-900 dark:text-white mt-1">
                {routeResult.estimatedDriveTime}
              </div>
            </div>
            <div className="p-4 rounded-3xl bg-white/80 dark:bg-[#151210]/80 border border-gray-200 dark:border-white/10 shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">Connected Highways</span>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                {routeResult.highways.join(' • ')}
              </div>
            </div>
          </div>

          {/* Sacred Significance & Mountain Climb Guide */}
          <div className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-[#FF6D00]" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Pilgrimage Corridor & Mountain Vandana Guidelines
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
              <p>
                <strong>Route Corridor:</strong> {routeResult.suggestedRoute}
              </p>
              {routeResult.sacredSignificance && (
                <p>
                  <strong>Sacred Tirth Significance:</strong> {routeResult.sacredSignificance}
                </p>
              )}
              {routeResult.mountainClimbInfo && (
                <p className="text-[#FF6D00] font-semibold">
                  <strong>Mountain Climb & Doli Service:</strong> {routeResult.mountainClimbInfo}
                </p>
              )}
            </div>
          </div>

          {/* Multimodal Transport Options Comparison */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Travel Modes Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routeResult.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-5 shadow-sm space-y-3 hover:border-[#FF6D00]/50 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                        {getModeIcon(opt.mode)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                          {opt.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          {opt.distanceKm} km
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#FF6D00] block">
                        {opt.approxFare}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {opt.estimatedTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    💡 <strong>Pilgrim Advice:</strong> {opt.jainPilgrimTips}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
