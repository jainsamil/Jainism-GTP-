import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ScrollText, Calendar, Plus, Save, Trash2, Edit2, CheckCircle2, FileText, Bookmark, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

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

export default function SwadhyayPage() {
  const navigate = useNavigate();
  const { language: lang } = useLanguage();

  // States
  const [logs, setLogs] = useState<SwadhyayLog[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newLog, setNewLog] = useState({ textName: '', chapter: '', insight: '', resolution: '' });
  const [newGoal, setNewGoal] = useState('');
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

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
  }, [lang]);

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
    <div className="min-h-full p-6 pb-26 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#050505] dark:to-[#0d0d0d] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight drop-shadow-none dark:drop-shadow-[0_0_10px_rgba(255,109,0,0.4)]">
          SWADHYAY NOTEBOOK
        </h1>
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

            <div className="flex items-center gap-4 justify-end border-t border-gray-100 dark:border-white/5 pt-3 text-xs">
              <button 
                onClick={() => handleEditLog(item)} 
                className="text-gray-500 hover:text-orange-500 font-bold flex items-center gap-1"
                id={`btn-edit-log-${item.id}`}
              >
                <Edit2 size={12} />
                <span>{lang === 'en' ? 'Edit' : 'संशोधन'}</span>
              </button>
              <button 
                onClick={() => handleDeleteLog(item.id)} 
                className="text-gray-500 hover:text-red-500 font-bold flex items-center gap-1"
                id={`btn-del-log-${item.id}`}
              >
                <Trash2 size={12} />
                <span>{lang === 'en' ? 'Remove' : 'हटाएं'}</span>
              </button>
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
    </div>
  );
}
