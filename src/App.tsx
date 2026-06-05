import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, BookOpen, PlaySquare, User, Sparkles, Languages, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import KnowledgePage from './pages/Knowledge';
import MediaPage from './pages/Media';
import ProfilePage from './pages/Profile';
import PanchangPage from './pages/Panchang';
import TirthankarsPage from './pages/Tirthankars';
import AagamsPage from './pages/Aagams';
import AdminPage from './pages/Admin';
import ComingSoonPage from './pages/ComingSoon';
import VichaarPage from './pages/Vichaar';
import QuizPage from './pages/Quiz';
import FestivalsPage from './pages/Festivals';
import PathshalaPage from './pages/Pathshala';
import SaintsPage from './pages/Saints';
import HistoryPage from './pages/History';

import JaapPage from './pages/Jaap';
import TirthPage from './pages/Tirth';
import FastingPage from './pages/Fasting';
import SwadhyayPage from './pages/Swadhyay';
import BhaktamarPage from './pages/Bhaktamar';
import DietPage from './pages/Diet';

import VerifiedFoodPage from './pages/VerifiedFood';
import ViharTrackerPage from './pages/ViharTracker';
import DharamshalaBookingPage from './pages/DharamshalaBooking';
import ManuscriptLibraryPage from './pages/ManuscriptLibrary';

import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsPage from './pages/Terms';
import ContactPage from './pages/Contact';
import Footer from './components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isChat = location.pathname === '/chat';
  const isAdmin = location.pathname === '/admin';

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: BookOpen, label: 'Knowledge', path: '/knowledge' },
    { icon: PlaySquare, label: 'Media', path: '/media' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans relative overflow-hidden selection:bg-[#FF6D00]/30 transition-colors duration-300">
      {/* Ambient Neon Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] bg-[#E65100] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none dark:opacity-20 opacity-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[50%] bg-[#FFD54F] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none dark:opacity-10 opacity-5" />

      {/* Global Toggles */}
      {!isAdmin && (
        <div className="fixed top-4 right-4 pt-safe flex items-center gap-2 z-50">
          {/* Language Toggle - Everywhere EXCEPT Home Screen, Admin, Media, Profile, Tirthankars, Panchang, Chat, Pathshala, Daily Vichaar, Aagams, Knowledge, History, Quiz, Festivals, Tirth, Fasting, Swadhyay, Bhaktamar, Diet */}
          {location.pathname !== '/' && 
           location.pathname !== '/chat' && 
           location.pathname !== '/media' && 
           location.pathname !== '/profile' && 
           location.pathname !== '/tirthankars' && 
           location.pathname !== '/panchang' && 
           location.pathname !== '/pathshala' && 
           location.pathname !== '/vichaar' && 
           location.pathname !== '/jaap' && 
           location.pathname !== '/aagams' && 
           location.pathname !== '/knowledge' && 
           location.pathname !== '/history' && 
           location.pathname !== '/quiz' && 
           location.pathname !== '/festivals' && 
           location.pathname !== '/tirth' && 
           location.pathname !== '/fasting' && 
           location.pathname !== '/swadhyay' && 
           location.pathname !== '/bhaktamar' && 
           location.pathname !== '/diet' && 
           location.pathname !== '/saints' && 
           location.pathname !== '/verified-food' && 
           location.pathname !== '/vihar-tracker' && 
           location.pathname !== '/dharamshala-booking' && 
           location.pathname !== '/manuscript-library' && (
            <button
              onClick={toggleLanguage}
              className="w-10 h-10 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-[#FF8A65] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all shadow-sm"
              title="Toggle Language"
            >
              <span className="text-xs font-bold">{language === 'en' ? 'A/अ' : 'अ/A'}</span>
            </button>
          )}
        </div>
      )}

      <main className={cn("flex-1 overflow-y-auto relative", (!isAdmin && !isChat) ? "pb-20" : "")}>
        {children}
        {!isAdmin && !isChat && <Footer />}
      </main>

      {/* Global Ask AI Button - Only on Homepage */}
      {location.pathname === '/' && (
        <button
          onClick={() => navigate('/chat')}
          className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F] rounded-full shadow-[0_0_20px_rgba(255,109,0,0.6)] flex items-center justify-center text-black animate-pulse hover:scale-110 transition-all z-50 border border-white/20 hover:cursor-pointer"
        >
          <Sparkles size={24} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
        </button>
      )}

      {/* Bottom Navigation */}
      {!isAdmin && !isChat && (
        <nav className="absolute bottom-0 w-full bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300",
                  isActive ? "text-[#FF8A65] drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)] scale-110" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <Icon size={22} className={cn("transition-transform", isActive && "stroke-[2.5px]")} />
                <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.getElementById('initial-splash');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 1000);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/knowledge" element={<KnowledgePage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/panchang" element={<PanchangPage />} />
                <Route path="/tirthankars" element={<TirthankarsPage />} />
                <Route path="/aagams" element={<AagamsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/saints" element={<SaintsPage />} />
                <Route path="/pathshala" element={<PathshalaPage />} />
                <Route path="/vichaar" element={<VichaarPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/festivals" element={<FestivalsPage />} />
                <Route path="/jaap" element={<JaapPage />} />
                <Route path="/tirth" element={<TirthPage />} />
                <Route path="/fasting" element={<FastingPage />} />
                <Route path="/swadhyay" element={<SwadhyayPage />} />
                <Route path="/bhaktamar" element={<BhaktamarPage />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/verified-food" element={<VerifiedFoodPage />} />
                <Route path="/vihar-tracker" element={<ViharTrackerPage />} />
                <Route path="/dharamshala-booking" element={<DharamshalaBookingPage />} />
                <Route path="/manuscript-library" element={<ManuscriptLibraryPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
