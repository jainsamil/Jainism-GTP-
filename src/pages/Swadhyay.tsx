import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ScrollText, Calendar, Plus, Save, Trash2, Edit2, CheckCircle2, FileText, Bookmark, Target, Timer, Play, Pause, RotateCcw, Sparkles, Globe, Volume2, VolumeX, Star, Search, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import SectionAiAgent from '../components/SectionAiAgent';
import { cn } from '../lib/utils';
import UnifiedSearchBar from '../components/UnifiedSearchBar';

import { BAAL_BODH_BOOKS } from '../data/baalBodhData';

interface SwadhyayLog {
  id: string;
  date: string;
  textName: string;
  chapter: string;
  insight: string;
  resolution: string;
}

interface StudyGoal {
  id: string;
  title: string;
  completed: boolean;
}

interface HighlightedVerse {
  id: string;
  bookTitle: string;
  chapterTitle: string;
  text: string;
  langType: 'hi' | 'en';
  createdAt: string;
}

export default function SwadhyayPage() {
  const navigate = useNavigate();
  const { language: lang, toggleLanguage } = useLanguage();

  // States
  const [logs, setLogs] = useState<SwadhyayLog[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [highlights, setHighlights] = useState<HighlightedVerse[]>([]);
  const [newLog, setNewLog] = useState({ textName: '', chapter: '', insight: '', resolution: '' });
  const [newGoal, setNewGoal] = useState('');
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Toggle Highlight Helper
  const toggleHighlight = (text: string, langType: 'hi' | 'en') => {
    if (!selectedBook || !selectedChapter) return;
    const isHighlighted = highlights.some(h => h.text === text);
    let updated: HighlightedVerse[];
    if (isHighlighted) {
      updated = highlights.filter(h => h.text !== text);
    } else {
      updated = [
        ...highlights,
        {
          id: Date.now().toString(),
          bookTitle: selectedBook.title[lang],
          chapterTitle: selectedChapter.title[lang],
          text,
          langType,
          createdAt: new Date().toLocaleDateString()
        }
      ];
    }
    setHighlights(updated);
    localStorage.setItem('swadhyay_highlights', JSON.stringify(updated));
  };

  // Book Reading states inside notebook
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [isSpeakingBook, setIsSpeakingBook] = useState(false);
  const [searchBookQuery, setSearchBookQuery] = useState('');
  const [bookCategory, setBookCategory] = useState<'all' | 'swadhyay' | 'pathshala'>('swadhyay');

  // Swadhyay Commentary AI States
  const [commentaryContent, setCommentaryContent] = useState<string>('');
  const [isCommentaryLoading, setIsCommentaryLoading] = useState<boolean>(false);
  const [commentaryError, setCommentaryError] = useState<string>('');

  // Markdown parser for premium traditional manuscript layout
  const renderCommentaryMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      
      // Headings
      if (trimmed.startsWith('***') && trimmed.endsWith('***')) {
        const title = trimmed.replace(/\*/g, '');
        return <h5 key={idx} className="text-[#FF6D00] dark:text-[#FFAB40] font-black text-xs tracking-wide uppercase mt-4 mb-2">{title}</h5>;
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const title = trimmed.replace(/\*/g, '');
        return <h5 key={idx} className="text-[#FF6D00] dark:text-[#FFAB40] font-black text-xs tracking-wide uppercase mt-4 mb-2">{title}</h5>;
      }
      if (trimmed.startsWith('#') || trimmed.toLowerCase().includes('मंगलाचरण') || trimmed.toLowerCase().includes('गाथा श्लोक') || trimmed.toLowerCase().includes('टीका') || trimmed.toLowerCase().includes('संकल्प')) {
        const cleanHeading = trimmed.replace(/#/g, '').replace(/\*/g, '');
        return (
          <h5 key={idx} className="text-[#FF6D00] dark:text-[#FFAB40] font-black text-xs tracking-wider uppercase border-b border-orange-500/10 dark:border-white/5 pb-1 mt-5 mb-3 flex items-center gap-1.5">
            <ScrollText size={12} className="text-[#FF6D00]" />
            <span>{cleanHeading}</span>
          </h5>
        );
      }
      
      // Verses / Quotes (often inside * or starting with Sanskrit characters like || or ॥)
      const isVerse = (trimmed.startsWith('*') && trimmed.endsWith('*')) || trimmed.includes('॥') || trimmed.includes('|') || trimmed.includes('ॐ');
      if (isVerse) {
        const cleanVerse = trimmed.replace(/\*/g, '');
        return (
          <div key={idx} className="my-3 p-3 bg-orange-500/5 dark:bg-orange-500/[0.02] border-l-2 border-orange-550 dark:border-orange-400 rounded-r-xl text-center italic text-xs font-semibold leading-relaxed text-orange-850 dark:text-orange-300 whitespace-pre-line">
            {cleanVerse}
          </div>
        );
      }

      // Bullets
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const cleanBullet = trimmed.slice(1).trim().replace(/\*/g, '');
        return (
          <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-700 dark:text-gray-300 pl-4 py-0.5">
            <span className="text-[#FF6D00] mt-1">•</span>
            <span>{cleanBullet}</span>
          </div>
        );
      }

      // Plain paragraphs
      const cleanPara = trimmed.replace(/\*/g, '');
      return (
        <p key={idx} className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed tracking-wide font-medium whitespace-pre-line text-justify">
          {cleanPara}
        </p>
      );
    });
  };

  // Swadhyay Timer States
  const [timerDuration, setTimerDuration] = useState(10 * 60); // Default 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Fetch full details / commentaries dynamically from Gemini
  const fetchChapterCommentary = async () => {
    if (!selectedBook || !selectedChapter) return;
    setIsCommentaryLoading(true);
    setCommentaryError('');
    setCommentaryContent('');
    
    try {
      const response = await fetch('/api/gemini/swadhyay-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookTitle: selectedBook.title.hi + " (" + selectedBook.title.en + ")",
          chapterTitle: selectedChapter.title.hi + " (" + selectedChapter.title.en + ")",
          context: selectedChapter.content.hi
        })
      });
      const data = await response.json();
      if (response.ok && data.content) {
        setCommentaryContent(data.content);
      } else {
        setCommentaryError(data.error || 'Failed to fetch scripture commentary. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setCommentaryError('Server connectivity error. Please make sure the server is online.');
    } finally {
      setIsCommentaryLoading(false);
    }
  };

  // Load persisted study notes
  useEffect(() => {
    const savedLogs = localStorage.getItem('swadhyay_logs');
    const savedGoals = localStorage.getItem('swadhyay_goals');
    
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Default initial logs
      const defaultLogs: SwadhyayLog[] = [
        {
          id: "1",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
          textName: "Tattvartha Sutra (तत्त्वार्थ सूत्र)",
          chapter: "Chapter 1 (Sutra 1-4)",
          insight: "Studied Right Faith (Samyak Darshana). Realized how belief in true deities, spiritual masters, and holy scriptures shapes our liberation path.",
          resolution: "I will read 2 stanzas daily."
        }
      ];
      setLogs(defaultLogs);
      localStorage.setItem('swadhyay_logs', JSON.stringify(defaultLogs));
    }

    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Default goals
      const defaultGoals: StudyGoal[] = [
        { id: "g1", title: lang === 'en' ? "Read 5 Shlokas of Tattvartha Sutra" : "तत्त्वार्थ सूत्र के ५ श्लोक पढ़ें", completed: false },
        { id: "g2", title: lang === 'en' ? "Take 10 minutes Silent contemplation (Swadhyay)" : "१० मिनट मौन स्वाध्याय करें", completed: true },
        { id: "g3", title: lang === 'en' ? "Write downstream insights in Notebook" : "स्वाध्याय से प्राप्त विचारों को दर्ज करें", completed: false }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('swadhyay_goals', JSON.stringify(defaultGoals));
    }

    const savedHighlights = localStorage.getItem('swadhyay_highlights');
    if (savedHighlights) {
      try {
        setHighlights(JSON.parse(savedHighlights));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [lang]);

  // Timer system countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setTimerCompleted(false);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = (seconds = 10 * 60) => {
    setIsTimerRunning(false);
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setTimerCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Sync to localStorage helpers
  const saveLogsToLocal = (updated: SwadhyayLog[]) => {
    setLogs(updated);
    localStorage.setItem('swadhyay_logs', JSON.stringify(updated));
  };

  const saveGoalsToLocal = (updated: StudyGoal[]) => {
    setGoals(updated);
    localStorage.setItem('swadhyay_goals', JSON.stringify(updated));
  };

  // Add Log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.textName || !newLog.insight) {
      alert(lang === 'en' ? "Please fill text name and insight." : "कृपया ग्रंथ नाम एवं चिंतन विचार अवश्य दर्ज करें।");
      return;
    }

    if (editingLogId) {
      const updated = logs.map(l => l.id === editingLogId ? {
        ...l, 
        textName: newLog.textName,
        chapter: newLog.chapter,
        insight: newLog.insight,
        resolution: newLog.resolution
      } : l);
      saveLogsToLocal(updated);
      setEditingLogId(null);
    } else {
      const added: SwadhyayLog = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        textName: newLog.textName,
        chapter: newLog.chapter,
        insight: newLog.insight,
        resolution: newLog.resolution
      };
      saveLogsToLocal([added, ...logs]);
    }

    setNewLog({ textName: '', chapter: '', insight: '', resolution: '' });
    setIsAddingLog(false);
  };

  // Edit Log
  const handleEditLog = (item: SwadhyayLog) => {
    setNewLog({
      textName: item.textName,
      chapter: item.chapter,
      insight: item.insight,
      resolution: item.resolution
    });
    setEditingLogId(item.id);
    setIsAddingLog(true);
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    if (confirm(lang === 'en' ? "Delete this study note?" : "क्या आप इसे हटाना चाहते हैं?")) {
      const filtered = logs.filter(l => l.id !== id);
      saveLogsToLocal(filtered);
    }
  };

  // Add Study Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const added: StudyGoal = {
      id: Date.now().toString(),
      title: newGoal,
      completed: false
    };
    saveGoalsToLocal([...goals, added]);
    setNewGoal('');
  };

  // Toggle Goal
  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    saveGoalsToLocal(updated);
  };

  // Delete Goal
  const handleDeleteGoal = (id: string) => {
    const filtered = goals.filter(g => g.id !== id);
    saveGoalsToLocal(filtered);
  };

  return (
    <div className="min-h-full p-6 pb-26 bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCF8F2]/90 dark:bg-[#0A0503]/90 backdrop-blur-md -mx-6 px-6 py-4 mb-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-700 dark:text-gray-300 sm:w-[22px] sm:h-[22px]" />
          </button>
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)] truncate">
            {lang === 'en' ? 'SWADHYAY NOTEBOOK' : 'स्वाध्याय दैनिक डायरी'}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Section User Guide Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 bg-white dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-350 rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer shadow-sm border border-gray-200 dark:border-white/10 h-9 w-9 flex items-center justify-center shrink-0"
            title={lang === 'en' ? 'Swadhyay Section Guide' : 'स्वाध्याय अनुभाग निर्देशपुस्तिका'}
          >
            ❓
          </button>

          {/* Symmetrical Inline Translate Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] active:scale-95 transition-all shadow-sm rounded-xl flex items-center justify-center gap-1.5 font-black text-[10px] cursor-pointer border border-[#FF9100]/30 shrink-0 h-9"
            title={lang === 'en' ? 'Translate / भाषा बदलें' : 'अंग्रेज़ी में बदलें'}
          >
            <Globe size={11} className="animate-spin-slow shrink-0" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Quote banner */}
      <div className="mb-6 bg-gradient-to-br from-[#00C853]/10 to-[#69F0AE]/5 rounded-3xl p-5 border border-[#00C853]/20 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0 text-[#00C853]">
          <Bookmark size={20} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase text-[#00C853] tracking-widest block mb-0.5">{lang === 'en' ? 'SWADHYAY PARMAM TAPA' : 'स्वाध्याय परमं तपः'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
            {lang === 'en' 
              ? "Self-study cleanses karmic layers. Make reading positive books and writing insights a part of your daily spiritual schedule."
              : "स्वाध्याय अंतरंग तप का सर्वोत्तम अंग है। महान ग्रंथों को पढ़कर चिंतन-मनन करना आत्मशुद्धि का महामार्ग है।"}
          </p>
        </div>
      </div>

      {/* Interactive Swadhyay Meditation/Study Timer */}
      <div className="mb-6 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Timer className="text-[#FF6D00] animate-pulse" size={18} />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {lang === 'en' ? 'Swadhyay & Contemplation Timer' : 'स्वाध्याय एवं ध्यान घड़ी'}
            </h2>
          </div>
          {isTimerRunning && (
            <span className="text-[10px] bg-[#FF6D00]/10 text-[#FF6D00] border border-[#FF6D00]/20 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full animate-bounce">
              {lang === 'en' ? 'In Contemplation' : 'स्वाध्याय ध्यान जारी'}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="text-4xl font-mono font-black text-[#FF6D00] tracking-wider mb-2">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-2 mb-4">
            {[5, 10, 20, 30].map(minutes => {
              const seconds = minutes * 60;
              const isActive = timerDuration === seconds;
              return (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => handleResetTimer(seconds)}
                  disabled={isTimerRunning}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6D00] text-black shadow-sm'
                      : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-150 dark:border-white/5'
                  }`}
                >
                  {minutes}m
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Play size={12} className="fill-white" />
                {lang === 'en' ? 'Start' : 'प्रारंभ'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="px-6 py-2.5 bg-yellow-500 dark:bg-yellow-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Pause size={12} className="fill-white" />
                {lang === 'en' ? 'Pause' : 'विराम'}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleResetTimer(timerDuration)}
              className="px-6 py-2.5 bg-gray-250 dark:bg-white/10 text-gray-750 dark:text-gray-200 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all border border-gray-200 dark:border-white/5 active:scale-95 cursor-pointer"
            >
              <RotateCcw size={12} />
              {lang === 'en' ? 'Reset' : 'पुनः सेट'}
            </button>
          </div>
        </div>

        {timerCompleted && (
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-center text-xs font-bold animate-in duration-300">
            🎉 {lang === 'en' ? 'Swadhyay Meditation session complete!' : 'स्वाध्याय चिंतन सत्र पूर्ण! अपने विचारों को नीचे अंकित करें।'}
          </div>
        )}
      </div>

      {/* Study Targets Checklist Widget */}
      <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-[#FF6D00]" size={18} />
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
            {lang === 'en' ? 'Daily Study Objectives' : 'आज के स्वाध्याय लक्ष्य'}
          </h2>
        </div>

        {/* Input for goal */}
        <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
          <input 
            type="text" 
            placeholder={lang === 'en' ? "E.g. Read 2 pages of Dravyasgrah..." : "उदा. २ पेज समयसार जी पढ़ें..."}
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-[#1A1A1A]/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            id="input-swadhyay-goal"
          />
          <button 
            type="submit" 
            className="px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs uppercase"
            id="btn-add-goal"
          >
            {lang === 'en' ? 'Add' : 'जोड़ें'}
          </button>
        </form>

        {/* Goals Checklist */}
        <div className="space-y-2">
          {goals.map(g => (
            <div 
              key={g.id}
              className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1A1A1A]/20 border border-gray-100 dark:border-white/5 rounded-2xl"
            >
              <div 
                onClick={() => handleToggleGoal(g.id)}
                className="flex items-center gap-3 cursor-pointer flex-1"
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  g.completed 
                    ? 'bg-orange-500 border-transparent text-white' 
                    : 'border-gray-300 dark:border-white/10'
                }`}>
                  {g.completed && <CheckCircle2 size={12} className="fill-white text-orange-500" />}
                </div>
                <span className={`text-xs font-bold ${g.completed ? 'line-through text-gray-400 dark:text-gray-500 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
                  {g.title}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteGoal(g.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                id={`btn-del-goal-${g.id}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Highlighted Verses & Key Insights Widget */}
      <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={18} />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 dark:text-gray-200">
              {lang === 'en' ? 'My Highlighted Verses' : 'मेरे मुख्य श्लोक व चिंतन'}
            </h2>
          </div>
          <span className="text-[9px] font-black text-gray-400 bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/5">
            {highlights.length} {lang === 'en' ? 'Highlighted' : 'चिह्नित'}
          </span>
        </div>

        {highlights.length === 0 ? (
          <div className="text-center py-6 px-4 bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/5 rounded-2xl">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {lang === 'en' ? 'No highlights yet' : 'कोई मुख्य श्लोक चिह्नित नहीं है'}
            </p>
            <p className="text-[9px] text-gray-400 mt-1 max-w-[220px] mx-auto leading-relaxed">
              {lang === 'en' ? 'Click the star icon next to any verse inside the scripture reader below to save it!' : 'नीचे ग्रन्थ स्वाध्याय में किसी भी श्लोक या अनुवाद के पास वाले स्टार (★) बटन को दबाकर सहेजें!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {highlights.map((h) => (
              <div 
                key={h.id}
                className="p-3.5 bg-amber-500/[0.02] dark:bg-amber-500/[0.01] border border-amber-500/15 rounded-2xl space-y-1.5 hover:border-amber-500/30 transition-all text-left"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 block uppercase tracking-wider">
                      📚 {h.bookTitle}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 block mt-0.5">
                      📍 {h.chapterTitle}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = highlights.filter(item => item.id !== h.id);
                      setHighlights(updated);
                      localStorage.setItem('swadhyay_highlights', JSON.stringify(updated));
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 shrink-0 cursor-pointer"
                    title={lang === 'en' ? 'Remove Bookmark' : 'हटाएं'}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <p className="text-xs font-semibold leading-relaxed text-gray-750 dark:text-gray-200 bg-amber-500/[0.01] p-2 rounded-xl border border-amber-500/5 whitespace-pre-line italic font-sans">
                  "{h.text}"
                </p>

                <div className="flex justify-between items-center text-[8px] text-gray-400">
                  <span className="font-bold uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {h.langType === 'hi' ? 'Hindi / हिन्दी' : 'English / A'}
                  </span>
                  <span className="font-medium">
                    📅 {h.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== SACRED SCRIPTURES & SWADHYAY BOOKS ==================== */}
      <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-6 mb-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <ScrollText className="text-[#FF6D00]" size={22} />
            <div>
              <h2 className="text-base font-display font-black text-gray-900 dark:text-white uppercase tracking-wide">
                {lang === 'en' ? 'Jain Swadhyay Shastras' : 'जैन स्वाध्याय ग्रन्थमाला'}
              </h2>
              <p className="text-[10px] text-gray-500 font-semibold">
                {lang === 'en' ? 'Direct reading, Hindi-English Translation & Voice narration' : 'समयसार, तत्वार्थसूत्र आदि दिगंबर ग्रन्थ स्वाध्याय, अनुवाद एवं वाचक आवाज'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'swadhyay', label: { en: 'Scriptures', hi: 'महाग्रन्थ' } },
              { id: 'pathshala', label: { en: 'Moral/Pathshala', hi: 'बाल संस्कार' } },
              { id: 'all', label: { en: 'All Books', hi: 'सभी' } }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setBookCategory(cat.id as any);
                  setSelectedBook(null);
                  setSelectedChapter(null);
                  window.speechSynthesis.cancel();
                  setIsSpeakingBook(false);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer border transition-all",
                  bookCategory === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-[#FFD54F] text-black border-transparent"
                    : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
                )}
              >
                {lang === 'en' ? cat.label.en : cat.label.hi}
              </button>
            ))}
          </div>
        </div>

        {!selectedBook ? (
          /* ================= BOOKS INDEX GRID ================= */
          <div className="space-y-4">
            {/* Search Input */}
            <UnifiedSearchBar
              value={searchBookQuery}
              onChange={(val) => setSearchBookQuery(val)}
              placeholder={lang === 'en' ? 'Search scriptures (e.g. Samaysar, Dravya)...' : 'ग्रन्थ खोजें (उदा. समयसार, तत्वार्थसूत्र)...'}
              id="search-swadhyay-books"
            />

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
              {BAAL_BODH_BOOKS.filter((book) => {
                // Category filter
                const isPathshala = ['baal1', 'baal2', 'baal3', 'baal_stories', 'baal_conduct'].includes(book.id);
                if (bookCategory === 'swadhyay') {
                  if (isPathshala) return false;
                } else if (bookCategory === 'pathshala') {
                  if (!isPathshala) return false;
                }
                // Search filter
                if (searchBookQuery.trim() !== '') {
                  const query = searchBookQuery.toLowerCase();
                  const hiTitle = book.title.hi.toLowerCase();
                  const enTitle = book.title.en.toLowerCase();
                  return hiTitle.includes(query) || enTitle.includes(query);
                }
                return true;
              }).map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(book.chapters[0]);
                  }}
                  className="p-4 bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-orange-500/30 hover:shadow-md cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 group animate-in fade-in"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0 shadow-xs", book.color)}>
                      {book.image}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-black text-xs text-gray-800 dark:text-gray-100 truncate group-hover:text-orange-500 transition-colors">
                        {lang === 'en' ? book.title.en : book.title.hi}
                      </h3>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold truncate max-w-[200px] mt-0.5 animate-pulse">
                        {lang === 'en' ? book.description.en : book.description.hi}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      {book.chapters.length} {lang === 'en' ? 'Ch' : 'अध्याय'}
                    </span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ================= INLINE ACTIVE BOOK READER ================= */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Navigation Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 dark:bg-black/25 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
              <button
                onClick={() => {
                  setSelectedBook(null);
                  setSelectedChapter(null);
                  window.speechSynthesis.cancel();
                  setIsSpeakingBook(false);
                }}
                className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 dark:text-gray-400 hover:text-orange-500 uppercase tracking-wider transition-colors cursor-pointer"
              >
                ← {lang === 'en' ? 'Back to Library' : 'लाइब्रेरी पर लौटें'}
              </button>
              
              <div className="text-right sm:text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-wider block">स्वाध्याय ग्रन्थ</span>
                <span className="font-display font-black text-xs text-gray-800 dark:text-white leading-tight">
                  {lang === 'en' ? selectedBook.title.en : selectedBook.title.hi}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Chapters List Menu */}
              <div className="md:col-span-4 bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 rounded-2xl p-3.5 space-y-2">
                <span className="text-[9px] font-black tracking-widest text-[#FF6D00] uppercase block pb-1 border-b border-gray-100 dark:border-white/5">विषय सूची (INDEX)</span>
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {selectedBook.chapters.map((chap: any, idx: number) => {
                    const isActive = selectedChapter?.title.hi === chap.title.hi;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedChapter(chap);
                          window.speechSynthesis.cancel();
                          setIsSpeakingBook(false);
                          setCommentaryContent('');
                          setCommentaryError('');
                        }}
                        className={cn(
                          "w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-between gap-1.5 cursor-pointer",
                          isActive
                            ? "bg-orange-500/10 border-orange-500/25 text-orange-500 dark:text-orange-400"
                            : "bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                        )}
                      >
                        <span className="truncate">{lang === 'en' ? chap.title.en : chap.title.hi}</span>
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-orange-500 animate-pulse" : "bg-transparent")} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lesson Viewer */}
              <div className="md:col-span-8 bg-gray-50/50 dark:bg-black/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4.5 space-y-4">
                {selectedChapter && (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase block">ACTIVE CHAPTER</span>
                        <h4 className="font-display font-black text-sm text-gray-900 dark:text-white">
                          {lang === 'en' ? selectedChapter.title.en : selectedChapter.title.hi}
                        </h4>
                      </div>

                      {/* Text-To-Speech Narrator Toggle */}
                      <button
                        onClick={() => {
                          const speechText = `${selectedChapter.title.hi}. ${selectedChapter.content.hi}. नैतिक शिक्षा: ${selectedChapter.moral.hi}`;
                          if (isSpeakingBook) {
                            window.speechSynthesis.cancel();
                            setIsSpeakingBook(false);
                          } else {
                            window.speechSynthesis.cancel();
                            const cleanText = speechText.replace(/\*/g, '').replace(/॥/g, '').replace(/ॐ ह्रीं श्रीं/g, 'ओम ह्रीम श्रीम');
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            utterance.lang = 'hi-IN';
                            utterance.rate = 0.8;
                            utterance.onend = () => setIsSpeakingBook(false);
                            utterance.onerror = () => setIsSpeakingBook(false);

                            const allVoices = window.speechSynthesis.getVoices();
                            const premiumVoice = allVoices.find(v => 
                              (v.lang.startsWith('hi') || v.lang.startsWith('sa')) && 
                              (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('natural'))
                            ) || allVoices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa'));
                            
                            if (premiumVoice) {
                              utterance.voice = premiumVoice;
                            }

                            window.speechSynthesis.speak(utterance);
                            setIsSpeakingBook(true);
                          }
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-[10px] font-black tracking-wide flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none shrink-0 w-fit",
                          isSpeakingBook
                            ? "bg-red-500 text-white border-red-400 animate-pulse"
                            : "bg-[#FF6D00] text-white border-transparent hover:bg-[#FF8100]"
                        )}
                      >
                        {isSpeakingBook ? (
                          <>
                            <VolumeX size={12} />
                            <span>{lang === 'en' ? 'Stop Voice' : 'आवाज रोकें'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} />
                            <span>{lang === 'en' ? 'Listen Online' : 'सजीव आवाज'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick study helpers shortcuts! */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const taskTitle = `${lang === 'en' ? 'Study' : 'स्वाध्याय'}: ${selectedBook.title[lang]} - ${selectedChapter.title[lang]}`;
                          const gId = Date.now().toString();
                          const updated = [...goals, { id: gId, title: taskTitle, completed: false }];
                          setGoals(updated);
                          localStorage.setItem('swadhyay_goals', JSON.stringify(updated));
                        }}
                        className="px-2.5 py-1 bg-orange-500/5 text-orange-600 dark:text-orange-400 border border-orange-500/10 rounded-lg text-[9px] font-black uppercase hover:bg-orange-500/10 transition-all cursor-pointer"
                      >
                        🎯 {lang === 'en' ? 'Add to Study Targets' : 'लक्ष्य में जोड़ें'}
                      </button>

                      <button
                        onClick={() => {
                          setNewLog({
                            textName: selectedBook.title[lang],
                            chapter: selectedChapter.title[lang],
                            insight: '',
                            resolution: ''
                          });
                          setIsAddingLog(true);
                          setTimeout(() => {
                            const elem = document.getElementById('swadhyay-form-block');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="px-2.5 py-1 bg-green-500/5 text-green-600 dark:text-green-400 border border-green-500/10 rounded-lg text-[9px] font-black uppercase hover:bg-green-500/10 transition-all cursor-pointer"
                      >
                        📝 {lang === 'en' ? 'Write Study Insights' : 'चिंतन पत्रक भरें'}
                      </button>
                    </div>

                    {/* Book context */}
                    <div className="space-y-3.5 text-xs text-gray-800 dark:text-gray-200">
                      {/* Hindi block */}
                      <div className="p-4 rounded-xl bg-orange-50/10 dark:bg-orange-500/[0.01] border border-orange-500/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black tracking-widest text-orange-500 uppercase">मूल हिन्दी अनुवाद</span>
                          <button
                            type="button"
                            onClick={() => toggleHighlight(selectedChapter.content.hi, 'hi')}
                            className={cn(
                              "p-1.5 rounded-lg border transition-colors cursor-pointer",
                              highlights.some(h => h.text === selectedChapter.content.hi)
                                ? "bg-amber-500/10 border-amber-500/25 text-amber-500"
                                : "bg-white/5 border-white/5 text-gray-400 hover:text-amber-500"
                            )}
                            title={lang === 'en' ? "Highlight Verse" : "श्लोक हाईलाइट करें"}
                          >
                            <Star size={11} className={highlights.some(h => h.text === selectedChapter.content.hi) ? "fill-amber-500 text-amber-500" : ""} />
                          </button>
                        </div>
                        <p className="whitespace-pre-line font-medium leading-relaxed">
                          {selectedChapter.content.hi}
                        </p>
                      </div>

                      {/* English block */}
                      <div className="p-4 rounded-xl bg-blue-50/10 dark:bg-blue-500/[0.01] border border-[#FF6D00]/10 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-black tracking-widest text-blue-550 uppercase">English Translation</span>
                          <button
                            type="button"
                            onClick={() => toggleHighlight(selectedChapter.content.en, 'en')}
                            className={cn(
                              "p-1.5 rounded-lg border transition-colors cursor-pointer",
                              highlights.some(h => h.text === selectedChapter.content.en)
                                ? "bg-amber-500/10 border-amber-500/25 text-amber-500"
                                : "bg-white/5 border-white/5 text-gray-400 hover:text-amber-500"
                            )}
                            title={lang === 'en' ? "Highlight Verse" : "श्लोक हाईलाइट करें"}
                          >
                            <Star size={11} className={highlights.some(h => h.text === selectedChapter.content.en) ? "fill-amber-500 text-amber-500" : ""} />
                          </button>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed text-gray-600 dark:text-gray-400">
                          {selectedChapter.content.en}
                        </p>
                      </div>

                      {/* Moral summary block */}
                      <div className="p-3 bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl flex gap-2.5 items-start">
                        <Star className="fill-emerald-550 text-emerald-555 shrink-0 mt-0.5" size={14} />
                        <div>
                          <span className="text-[8px] font-black tracking-widest text-emerald-600 uppercase block">संक्षिप्त संस्करण सीख (Moral)</span>
                          <p className="font-extrabold text-emerald-700 dark:text-emerald-450 leading-relaxed text-[11px] mt-0.5">
                            {lang === 'en' ? selectedChapter.moral.en : selectedChapter.moral.hi}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Advanced Commentary card (satisfies 'full details' / 'full content') */}
                      <div className="mt-5 border border-dashed border-orange-500/20 dark:border-white/10 rounded-2xl p-4 bg-[#FF6D00]/[0.01] space-y-3.5 shadow-sm animate-in fade-in">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="text-orange-500 animate-pulse shrink-0" size={15} />
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6D00] dark:text-[#FFAB40] block">
                                {lang === 'en' ? 'Detailed Spiritual Commentary' : 'विस्तृत ग्रन्थ रहस्य एवं टीका'}
                              </span>
                              <span className="text-[9px] text-gray-550 dark:text-gray-400 block font-bold leading-tight">
                                {lang === 'en' ? 'Sanskrit verses, word-by-word interpretation & Acharya analyses' : 'मूल संस्कृत गाथा श्लोक, सूक्ष्म शब्दार्थ एवं आचार्य गाथा देव-रहस्य'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {!commentaryContent && !isCommentaryLoading && (
                          <div className="text-center py-4 bg-white/50 dark:bg-black/10 border border-orange-500/5 rounded-xl p-4">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold mb-3">
                              {lang === 'en' 
                                ? 'Retrieve authentic traditional commentaries, Prakrit/Sanskrit verses, and word meanings from sacred libraries.' 
                                : 'स्वाध्याय के लिए आचार्य-सहमत प्राचीन टीका, मूल प्राकृत/संस्कृत गाथा, शब्दार्थ एवं गूढ़ अर्थ जिनवाणी ज्ञान सागर से उद्घाटित करें।'}
                            </p>
                            <button
                              onClick={fetchChapterCommentary}
                              className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                            >
                              <ScrollText size={12} />
                              <span>{lang === 'en' ? 'Generate Full Book Details' : 'टीका और मूल श्लोक खोलें ✨'}</span>
                            </button>
                          </div>
                        )}

                        {isCommentaryLoading && (
                          <div className="text-center py-8 bg-white/50 dark:bg-black/10 border border-orange-500/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                            <p className="text-[10px] font-black text-orange-650 dark:text-orange-400 animate-pulse tracking-wide">
                              {lang === 'en' ? 'CONSULTING SACRED LIBRARIES...' : 'शास्त्र भण्डार व जिनवाणी का मंथन चल रहा है...'}
                            </p>
                            <span className="text-[9px] text-gray-450 italic">
                              {lang === 'en' ? 'Generating Sanskrit verse and commentary' : 'मूल श्लोक, शब्द विश्लेषण और आचार्य देव टीका संकलित की जा रही है'}
                            </span>
                          </div>
                        )}

                        {commentaryError && (
                          <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-655 dark:text-red-400 text-[10px] font-bold rounded-xl text-center">
                            {commentaryError}
                            <button 
                              onClick={fetchChapterCommentary}
                              className="block mx-auto mt-2 text-[#FF6D00] hover:underline"
                            >
                              {lang === 'en' ? 'Retry Action' : 'पुनः प्रयास करें'}
                            </button>
                          </div>
                        )}

                        {commentaryContent && (
                          <div className="bg-white/80 dark:bg-[#121212]/85 border border-orange-500/10 rounded-2xl p-4 space-y-4 shadow-inner max-h-[350px] overflow-y-auto">
                            <div className="flex items-center justify-between border-b pb-1 dark:border-white/5">
                              <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-wider block">
                                {lang === 'en' ? 'Ancient Manuscript Commentary' : 'प्राचीन जिनवाणी टीका पत्रक'}
                              </span>
                              <button
                                onClick={fetchChapterCommentary}
                                className="text-[8px] font-black text-[#FF6D00] hover:underline uppercase"
                              >
                                {lang === 'en' ? 'Regenerate' : 'पुनः मंथन करें'}
                              </button>
                            </div>
                            <div className="space-y-3 text-justify">
                              {renderCommentaryMarkdown(commentaryContent)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adding Reflection Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-black text-gray-800 dark:text-white uppercase tracking-wide">
          {lang === 'en' ? 'My Contemplative Insights' : 'स्वाध्याय चिंतन पत्रक'}
        </h2>
        
        {!isAddingLog && (
          <button 
            onClick={() => {
              setEditingLogId(null);
              setNewLog({ textName: '', chapter: '', insight: '', resolution: '' });
              setIsAddingLog(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black font-extrabold text-xs tracking-wider uppercase shadow-md hover:scale-103 active:scale-98 transition-transform"
            id="btn-new-swadhyay-note"
          >
            <Plus size={14} />
            <span>{lang === 'en' ? 'Write entry' : 'चिंतन लिखें'}</span>
          </button>
        )}
      </div>

      {/* New Log form */}
      <AnimatePresence>
        {isAddingLog && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-[#121212] rounded-3xl p-5 border border-orange-200/50 dark:border-white/10 shadow-md mb-6"
          >
            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest block mb-1.5">
                  {lang === 'en' ? 'Sacred Text Name' : 'ग्रंथ राज का नाम'}
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Samayasara, Tatvartha Sutra..."
                  value={newLog.textName}
                  onChange={(e) => setNewLog({ ...newLog, textName: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a]/55 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  id="log-input-name"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                  {lang === 'en' ? 'Chapter / Shloka / Gatha details' : 'अध्याय / गाथा / श्लोक क्रमांक'}
                </label>
                <input 
                  type="text"
                  placeholder="Gatha 1-5, Page 40..."
                  value={newLog.chapter}
                  onChange={(e) => setNewLog({ ...newLog, chapter: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a]/55 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  id="log-input-chapter"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest block mb-1.5">
                  {lang === 'en' ? 'What insights did you gain today?' : 'स्वाध्याय से आज क्या आत्म-बोध हुआ?'}
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Today we learned that non-injury (Ahimsa) is..."
                  value={newLog.insight}
                  onChange={(e) => setNewLog({ ...newLog, insight: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a]/55 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  id="log-input-insight"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                  {lang === 'en' ? 'Spiritual resolution taken from text' : 'स्वाध्याय के बाद गृहीत त्याग/नियम'}
                </label>
                <input 
                  type="text"
                  placeholder="Avoid speaking untruths for 2 hours..."
                  value={newLog.resolution}
                  onChange={(e) => setNewLog({ ...newLog, resolution: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a]/55 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  id="log-input-resolution"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase py-3 rounded-2xl shadow-sm tracking-wider"
                  id="btn-log-save-submit"
                >
                  <Save size={14} className="inline mr-1" />
                  {lang === 'en' ? 'Save Note' : 'टिप्पणी सहेजें'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="px-5 bg-gray-100 dark:bg-white/5 font-extrabold text-xs text-gray-500 uppercase rounded-2xl"
                  id="btn-cancel-note"
                >
                  {lang === 'en' ? 'Cancel' : 'निरस्त'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log list elements */}
      <div className="space-y-4">
        {logs.map((item) => (
          <div 
            key={item.id}
            className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="text-orange-500 shrink-0" size={16} />
                <h3 className="font-bold text-base text-gray-800 dark:text-white leading-tight">{item.textName}</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-bold bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
                {item.date}
              </span>
            </div>

            {item.chapter && (
              <span className="inline-block text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded-md mb-3">
                {item.chapter}
              </span>
            )}

            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-4">
              {item.insight}
            </p>

            {item.resolution && (
              <div className="p-3 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-2xl mb-4">
                <span className="text-[8px] font-black tracking-widest text-[#00C853] uppercase block mb-0.5">RESOLVED ACTION (संकल्पित नियम)</span>
                <p className="text-xs font-bold text-[#00C853] leading-relaxed">
                  "{item.resolution}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3 text-xs">
              <button 
                onClick={() => {
                  navigate('/chat', { state: { initialPrompt: `Jai Jinendra! I am doing स्वाध्याय of ${item.textName} (${item.chapter || "general study"}). I wrote this insight: "${item.insight}". Let's discuss this according to Digambar Jain tradition. What are standard commentaries, Acharyas' views, or deep spiritual meanings for this insight, and what can be further resolutions?` } });
                }} 
                className="text-[#FF6D00] hover:text-[#FFD54F] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                id={`btn-ai-discuss-${item.id}`}
              >
                <Sparkles size={12} className="text-[#FF6D00] animate-pulse" />
                <span>{lang === 'en' ? 'Discuss with AI' : 'AI से चर्चा करें'}</span>
              </button>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleEditLog(item)} 
                  className="text-gray-500 hover:text-orange-500 font-bold flex items-center gap-1 cursor-pointer"
                  id={`btn-edit-log-${item.id}`}
                >
                  <Edit2 size={12} />
                  <span>{lang === 'en' ? 'Edit' : 'संशोधन'}</span>
                </button>
                <button 
                  onClick={() => handleDeleteLog(item.id)} 
                  className="text-gray-500 hover:text-red-500 font-bold flex items-center gap-1 cursor-pointer"
                  id={`btn-del-log-${item.id}`}
                >
                  <Trash2 size={12} />
                  <span>{lang === 'en' ? 'Remove' : 'हटाएं'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ScrollText className="mx-auto mb-3 opacity-30" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">
              {lang === 'en' ? 'No Swadhyay logs yet' : 'कोई स्वाध्याय प्रविष्टियां नहीं हैं'}
            </p>
          </div>
        )}
      </div>

      {/* Dynamic JBT Premium Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="text-left">
                <span className="text-[9px] font-black text-[#FF6D00] uppercase tracking-widest bg-[#FF6D00]/10 px-3 py-1 rounded-full border border-[#FF6D00]/10 inline-block mb-1.5">
                  📁 {lang === 'en' ? 'SECTION USER GUIDE' : 'अनुभाग निर्देश पुस्तिका'}
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ℹ️ {lang === 'en' ? 'Help & Features' : 'सहायता एवं सुविधाएँ'}
                </h2>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5 active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* Modal Translator switch requested in help modal */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 mb-5 relative z-10">
              <span className="text-[10px] font-black uppercase text-gray-400">
                {lang === 'en' ? 'Translate guide language' : 'निर्देश निर्देश भाषा बदलें'}
              </span>
              <button
                onClick={toggleLanguage}
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white hover:bg-[#D50000] rounded-xl text-[10px] font-black uppercase transition-all ring-1 ring-orange-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Globe size={11} className="animate-spin-slow" />
                {lang === 'en' ? 'HINDI / हिन्दी' : 'ENGLISH / A'}
              </button>
            </div>

            {/* Help Scrollable Content */}
            <div className="overflow-y-auto pr-1 space-y-4.5 text-left text-zinc-355 dark:text-zinc-300 text-xs text-medium leading-relaxed relative z-10 max-h-[55vh]">
              <p className="font-bold text-white text-sm">
                {lang === 'en' ? 'Welcome to Swadhyay Notebook Room!' : 'स्वाध्याय दैनिक डायरी में आपका स्वागत है!'}
              </p>
              <p className="font-semibold text-gray-400">
                {lang === 'en' 
                  ? 'Keep daily self-study logs, study scripture goals, and contemplate with our focused utility engines:' 
                  : 'जिनवाणी माता के स्वाध्याय, मनन, चिंतन और ज्ञानवर्धन की क्रिया को दैनिक डायरी द्वारा व्यवस्थित करें:'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-semibold font-sans">
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Contemplation Zen Timer:' : 'सजग स्वाध्याय टाइमर (Zen Timer):'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Use the micro-timer to schedule focus intervals of 10, 20 or 30 minutes, keeping notifications off to enable peaceful study loops.' 
                    : 'बिना विक्षेप पूर्ण एकाग्रता से स्वाध्याय करने के लिए ऊपर स्वाध्याय टाइमर (१०, २० या ३० मिनट) का चुनाव कर शांत चिंतन करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Daily Vows & Study Targets:' : 'साधना लक्ष्य सूचक:'}</strong>{' '}
                  {lang === 'en' 
                    ? 'Check off specific daily study tasks or quickly log customized targets (e.g. read Tattvartha Sutra).' 
                    : 'अपने दैनिक लक्ष्यों (जैसे "५ श्लोक का मनन") की सूची बनाकर अपनी प्रगति का स्व-मूल्यांकन (चेक मार्क) दर्ज करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Interactive Insight Logs:' : 'विचारधारा एवं संकल्प डायरी:'}</strong>{' '}
                  {lang === 'en'
                    ? 'Record the name of holy books, specific chapter levels, and write the custom spiritual insights and rules of restraint (Niyams) gained.'
                    : 'पढ़े गए ग्रंथ का नाम, विशिष्ट प्रकरण और उनसे प्राप्त गूढ़ चिंतन विचारों को सुरक्षित रूप से भविष्य हेतु डायरी में दर्ज करें।'}
                </li>
                <li>
                  <strong className="text-[#FFD54F]">{lang === 'en' ? 'Deep Contemplative Chat with AI:' : 'AI गुरुवर से गहन चर्चा (Discuss with AI):'}</strong>{' '}
                  {lang === 'en'
                    ? 'Trigger the "Discuss with AI" button on any note to deep dive into commentaries, historical Contexts, and philosophy with our customized chat agent.'
                    : 'किसी भी स्वाध्याय विचार के नीचे "AI से चर्चा करें" पर क्लिक कर जैन दर्शन के गहन सिद्धांत, अर्थ और अर्थभेद पर विस्तार से संवाद करें।'}
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center relative z-10">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full bg-[#FF6D00] hover:bg-orange-600 text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {lang === 'en' ? 'UNDERSTOOD & CONTINUE' : 'पूर्ण समझ आया, आगे बढ़ें'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionAiAgent section="swadhyay" />
    </div>
  );
}
