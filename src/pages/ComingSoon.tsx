import { Sparkles } from 'lucide-react';

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/5 blur-3xl opacity-50 pointer-events-none" />
      
      <div className="w-24 h-24 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_40px_rgba(255,109,0,0.6)] animate-pulse relative z-10 border-4 border-[#121212]">
        <Sparkles size={48} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>
      <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] relative z-10 uppercase tracking-wider">{title}</h1>
      <p className="text-[#FFD54F] font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_5px_rgba(255,213,79,0.8)] max-w-xs mx-auto relative z-10">
        This divine feature is currently being crafted. Please check back soon.
      </p>
    </div>
  );
}
