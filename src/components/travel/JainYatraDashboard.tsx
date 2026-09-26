import { useState } from 'react';
import { 
  Train, Bus, Plane, Ticket, Clock, Navigation, 
  Compass, User, ShieldCheck, Sparkles, MapPin, 
  ArrowRight, Info, Heart, Award, CheckCircle2 
} from 'lucide-react';
import TravelStatusBanner from './TravelStatusBanner';
import TrainSearchSection from './TrainSearchSection';
import TrainTimetableSection from './TrainTimetableSection';
import PnrStatusSection from './PnrStatusSection';
import BusSearchSection from './BusSearchSection';
import FlightSearchSection from './FlightSearchSection';
import RouteDistanceSection from './RouteDistanceSection';
import MyTripsSection from './MyTripsSection';
import BookingHistorySection from './BookingHistorySection';
import TravelProfileSection from './TravelProfileSection';
import TravelAdminDashboard from './TravelAdminDashboard';
import { cn } from '../../lib/utils';

export type YatraTabType = 
  | 'trains' 
  | 'timetable' 
  | 'pnr' 
  | 'buses' 
  | 'flights' 
  | 'routes' 
  | 'trips' 
  | 'bookings' 
  | 'profile' 
  | 'admin';

export default function JainYatraDashboard() {
  const [activeTab, setActiveTab] = useState<YatraTabType>('trains');
  const [selectedTimetableTrain, setSelectedTimetableTrain] = useState<string>('12802');

  const navItems: { id: YatraTabType; label: string; icon: any; badge?: string }[] = [
    { id: 'trains', label: 'Trains Search', icon: Train },
    { id: 'timetable', label: 'Route Timetable', icon: Clock },
    { id: 'pnr', label: 'PNR Tracker', icon: Ticket },
    { id: 'buses', label: 'Pilgrim Buses', icon: Bus },
    { id: 'flights', label: 'Air Flights', icon: Plane },
    { id: 'routes', label: 'Route & Distance', icon: Navigation },
    { id: 'trips', label: 'My Trips', icon: Compass },
    { id: 'bookings', label: 'E-Ticket Passes', icon: Award },
    { id: 'profile', label: 'Yatrik Profile', icon: User },
    { id: 'admin', label: 'API Gateway', icon: ShieldCheck, badge: 'Architecture' },
  ];

  const handleGoToTimetable = (trainNo: string) => {
    setSelectedTimetableTrain(trainNo);
    setActiveTab('timetable');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D0B0A] text-gray-900 dark:text-gray-100 transition-colors pb-16">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFF3E0]/70 via-[#FFF8E1]/30 to-transparent dark:from-[#20150F]/70 dark:via-[#15100D]/30 dark:to-transparent pt-8 pb-6 border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#FF6D00]/10 text-[#FF6D00] dark:text-[#FFAB40] border border-[#FF6D00]/20">
                <Sparkles size={14} />
                <span>Jain Yatra Sewa • Sacred Pilgrimage Transport Assistant</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                जैन तीर्थ यात्रा सेवा
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                Seamless travel to Sammed Shikharji, Palitana, Girnarji & Pawapuri. Comprehensive Railway, AC Bus, Flight & Sunset meal logistics.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-white/80 dark:bg-[#1A1614]/80 backdrop-blur-md p-2.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
              <div className="text-center px-2">
                <div className="text-xs font-mono font-black text-[#FF6D00]">100% Free</div>
                <div className="text-[10px] text-gray-400">Open Prototype</div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
              <div className="text-center px-2">
                <div className="text-xs font-mono font-black text-emerald-500">Chovisi</div>
                <div className="text-[10px] text-gray-400">Pure Jain Meals</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Mobile Scrollable) */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FFAB40] text-white shadow-lg shadow-[#FF6D00]/25 font-black scale-105"
                      : "bg-white/80 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Real API Status Banner (Ensures user knows whether it's Demo or Live API) */}
        <TravelStatusBanner />

        {/* Tab Content Body */}
        <div className="mt-4">
          {activeTab === 'trains' && (
            <TrainSearchSection 
              onGoToBookings={() => setActiveTab('bookings')}
              onGoToTimetable={handleGoToTimetable}
            />
          )}

          {activeTab === 'timetable' && (
            <TrainTimetableSection initialTrainNumber={selectedTimetableTrain} />
          )}

          {activeTab === 'pnr' && (
            <PnrStatusSection />
          )}

          {activeTab === 'buses' && (
            <BusSearchSection onGoToBookings={() => setActiveTab('bookings')} />
          )}

          {activeTab === 'flights' && (
            <FlightSearchSection onGoToBookings={() => setActiveTab('bookings')} />
          )}

          {activeTab === 'routes' && (
            <RouteDistanceSection />
          )}

          {activeTab === 'trips' && (
            <MyTripsSection onExploreRoutes={() => setActiveTab('routes')} />
          )}

          {activeTab === 'bookings' && (
            <BookingHistorySection />
          )}

          {activeTab === 'profile' && (
            <TravelProfileSection />
          )}

          {activeTab === 'admin' && (
            <TravelAdminDashboard />
          )}
        </div>
      </div>
    </div>
  );
}
