import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UnifiedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  id?: string;
}

export default function UnifiedSearchBar({
  value,
  onChange,
  placeholder,
  onClear,
  id = 'unified-search-bar',
}: UnifiedSearchBarProps) {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [supportSpeech, setSupportSpeech] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupportSpeech(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // If search matches well, update!
          onChange(transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [onChange]);

  // Adjust language dynamically based on app setting!
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }
  }, [language]);

  const toggleListening = () => {
    if (!supportSpeech) {
      alert(
        language === 'en'
          ? 'Voice search is not supported on this browser. Try Chrome, Safari, or Edge.'
          : 'इस ब्राउज़र में वॉयस सर्च समर्थित नहीं है। कृपया क्रोम, सफारी या एज का उपयोग करें।'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  const defaultPlaceholder = language === 'en' ? 'Search anything...' : 'कुछ भी खोजें...';

  return (
    <div className="w-full relative group">
      {/* Search Bar Inner Styling Glassmorphism container */}
      <div className={`relative flex items-center bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-2xl border-2 transition-all duration-300 ${
        isListening 
          ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] ring-2 ring-red-500/20' 
          : 'border-gray-250/50 dark:border-white/10 group-hover:border-orange-500/50 dark:group-hover:border-orange-500/40 focus-within:border-[#FF6D00] focus-within:ring-4 focus-within:ring-[#FF6D00]/10 focus-within:shadow-md'
      }`}>
        {/* Left Side Search Icon or Listening wave */}
        <div className="pl-4 pr-2 py-3 flex items-center justify-center shrink-0">
          {isListening ? (
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-650"></span>
            </span>
          ) : (
            <Search size={18} className="text-gray-400 dark:text-gray-500 transition-colors group-hover:text-orange-500" />
          )}
        </div>

        {/* Text Input */}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? (language === 'en' ? 'Listening carefully...' : 'सुन रहा हूँ... बोलिए...') : (placeholder || defaultPlaceholder)}
          className="w-full py-3 pr-2 bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />

        {/* Action icons on right */}
        <div className="flex items-center gap-2 pr-3 shrink-0">
          {/* Audio State text badge inside bar */}
          {isListening && (
            <span className="text-[10px] font-black tracking-widest text-red-500 animate-pulse hidden sm:inline uppercase">
              {language === 'en' ? 'Speak now' : 'कृप्या बोलें'}
            </span>
          )}

          {/* Clear button if has value */}
          {value && (
            <button
              onClick={handleClear}
              type="button"
              className="p-1 px-1.5 transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg whitespace-nowrap cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5"
              title={language === 'en' ? 'Clear search' : 'खोज साफ करें'}
            >
              <X size={15} />
            </button>
          )}

          {/* Divider line */}
          <div className="h-4 w-[1px] bg-gray-250/50 dark:bg-white/10" />

          {/* Microphone trigger */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#FF6D00]/10 hover:text-orange-500'
            }`}
            title={language === 'en' ? 'Voice Search' : 'वॉयस सर्च'}
          >
            {isListening ? (
              <MicOff size={16} className="animate-bounce" />
            ) : (
              <Mic size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
