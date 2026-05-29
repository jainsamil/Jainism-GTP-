import { Link } from 'react-router-dom';
import { Shield, FileText, Send, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#121212]/30 backdrop-blur-md border-t border-gray-200 dark:border-white/5 py-8 px-6 mt-12 text-center text-gray-500 dark:text-gray-400 selection:bg-[#FF6D00]/20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-bold tracking-wider uppercase">
          <Link 
            to="/privacy-policy" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6D00] dark:hover:text-[#FF8A65] transition-colors"
          >
            <Shield size={14} />
            Privacy Policy
          </Link>
          <Link 
            to="/terms" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6D00] dark:hover:text-[#FF8A65] transition-colors"
          >
            <FileText size={14} />
            Terms & Conditions
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6D00] dark:hover:text-[#FF8A65] transition-colors"
          >
            <Send size={14} />
            Contact Us
          </Link>
        </div>

        <div className="h-[1px] w-1/4 bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent" />

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium tracking-wide">
            &copy; 2026 <span className="font-extrabold text-[#FF6D00] dark:text-[#FF8A65]">Jainism GPT</span>. All Rights Reserved.
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase">
            Designed & Developed by{" "}
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FF6D00] dark:text-[#FF9100] hover:underline inline-flex items-center gap-1 font-extrabold"
            >
              Samil Jain <Instagram size={12} className="inline" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
