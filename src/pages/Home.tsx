import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, BookOpen, Users, GraduationCap, 
  Library, ScrollText, Calendar, Quote, 
  PlaySquare, Landmark, HelpCircle, PartyPopper
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, limit, doc, onSnapshot } from 'firebase/firestore';

export default function HomePage() {
  const [settings, setSettings] = useState({ quizEnabled: true, mediaEnabled: true });

  useEffect(() => {
    const docRef = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    }, (error) => {
      console.error('Error fetching settings:', error);
    });
    return () => unsubscribe();
  }, []);

  const cards = [
    { title: 'Jainism GPT', icon: MessageSquare, path: '/chat', color: 'from-[#FF6D00] to-[#FF9100]', shadow: 'shadow-[0_0_15px_rgba(255,109,0,0.3)]', enabled: true },
    { title: 'Knowledge', icon: BookOpen, path: '/knowledge', color: 'from-[#2962FF] to-[#448AFF]', shadow: 'shadow-[0_0_15px_rgba(41,98,255,0.3)]', enabled: true },
    { title: 'Saints', icon: Users, path: '/saints', color: 'from-[#00C853] to-[#69F0AE]', shadow: 'shadow-[0_0_15px_rgba(0,200,83,0.3)]', enabled: true },
    { title: 'Pathshala', icon: GraduationCap, path: '/pathshala', color: 'from-[#AA00FF] to-[#E040FB]', shadow: 'shadow-[0_0_15px_rgba(170,0,255,0.3)]', enabled: true },
    { title: 'Tirthankar', icon: Library, path: '/tirthankars', color: 'from-[#FFD600] to-[#FFFF00]', shadow: 'shadow-[0_0_15px_rgba(255,214,0,0.3)]', enabled: true },
    { title: 'Aagams', icon: ScrollText, path: '/aagams', color: 'from-[#D50000] to-[#FF5252]', shadow: 'shadow-[0_0_15px_rgba(213,0,0,0.3)]', enabled: true },
    { title: 'Panchang', icon: Calendar, path: '/panchang', color: 'from-[#304FFE] to-[#536DFE]', shadow: 'shadow-[0_0_15px_rgba(48,79,254,0.3)]', enabled: true },
    { title: 'Daily Vichaar', icon: Quote, path: '/vichaar', color: 'from-[#C51162] to-[#FF4081]', shadow: 'shadow-[0_0_15px_rgba(197,17,98,0.3)]', enabled: true },
    { title: 'Multimedia', icon: PlaySquare, path: '/media', color: 'from-[#00BFA5] to-[#64FFDA]', shadow: 'shadow-[0_0_15px_rgba(0,191,165,0.3)]', enabled: settings.mediaEnabled },
    { title: 'History', icon: Landmark, path: '/history', color: 'from-[#FF6D00] to-[#FFAB40]', shadow: 'shadow-[0_0_15_rgba(255,109,0,0.3)]', enabled: true },
    { title: 'Quiz', icon: HelpCircle, path: '/quiz', color: 'from-[#00E5FF] to-[#18FFFF]', shadow: 'shadow-[0_0_15px_rgba(0,229,255,0.3)]', enabled: settings.quizEnabled },
    { title: 'Festivals', icon: PartyPopper, path: '/festivals', color: 'from-[#F50057] to-[#FF80AB]', shadow: 'shadow-[0_0_15px_rgba(245,0,87,0.3)]', enabled: true },
  ];

  return (
    <div className="min-h-full p-6 pt-16 pb-24">
      <header className="text-center mb-6 relative flex justify-center items-center">
        <div>
          <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-[0_0_15px_rgba(255,109,0,0.5)]">
            JAINISM GPT
          </h1>
          <p className="text-[10px] text-[#FF8A65] mt-2 font-bold tracking-[0.2em] uppercase drop-shadow-[0_0_5px_rgba(255,138,101,0.5)]">Divine Wisdom • By Samil Jain</p>
        </div>
      </header>

      <Link to="/vichaar" className="block mb-8 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-3xl p-6 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_30px_rgba(255,109,0,0.15)] relative overflow-hidden group hover:border-[#FF6D00]/50 transition-all duration-500">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6D00]/10 dark:bg-[#FF6D00]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FF6D00]/20 dark:group-hover:bg-[#FF6D00]/40 group-hover:scale-150 transition-all duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <Quote size={16} className="text-[#FF6D00] dark:text-[#FFD54F] drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(255,213,79,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6D00] dark:text-[#FFD54F] drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(255,213,79,0.5)]">Daily Vichaar</span>
          </div>
          <p className="text-xl font-bold leading-snug mb-2 text-gray-900 dark:text-white drop-shadow-none dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">"अहिंसा परमो धर्मः।"</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Non-violence is the highest religion.</p>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-4">
        {cards.filter(c => c.enabled).map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.path}
              className="bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl p-5 rounded-3xl border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center gap-4 hover:bg-white dark:hover:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group shadow-sm dark:shadow-none"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${card.color} ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={26} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center tracking-wide group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {card.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
