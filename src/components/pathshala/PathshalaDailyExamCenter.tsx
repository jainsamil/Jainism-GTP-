import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Trophy, Award, Timer, CheckCircle2, XCircle, 
  HelpCircle, ChevronRight, Play, RotateCcw, Flame, 
  Sparkles, ArrowLeft, Volume2, VolumeX, Eye, Share2, Star, Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  PATHSHALA_LESSONS_30_DAYS, 
  DailyLesson, 
  ExamQuestion, 
  UserExamSubmission,
  getTodayDailyLesson, 
  getTodayExamDayNumber, 
  getPracticeExamQuestions, 
  getSavedExamSubmissions, 
  saveExamSubmission, 
  getSavedUserXp 
} from '../../data/pathshalaDailyExamsData';

export default function PathshalaDailyExamCenter({ onSelectTab }: { onSelectTab?: (tab: string) => void }) {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'curriculum' | 'results'>('live');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [userXp, setUserXp] = useState<number>(getSavedUserXp);
  const [examHistory, setExamHistory] = useState<UserExamSubmission[]>(getSavedExamSubmissions);

  // Lesson preparation drawer state
  const [prepLesson, setPrepLesson] = useState<DailyLesson | null>(null);

  // Active exam taking state
  const [takingExam, setTakingExam] = useState<{
    lesson: DailyLesson;
    isPractice: boolean;
    questions: ExamQuestion[];
  } | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(600); // 10 minutes
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<UserExamSubmission | null>(null);

  // TTS audio narration
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  const examTimerRef = useRef<any>(null);

  // Today's details
  const todayDate = new Date();
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = language === 'en' ? monthNamesEn[todayDate.getMonth()] : monthNamesHi[todayDate.getMonth()];
  const todayDayNum = todayDate.getDate();
  const todayLesson = getTodayDailyLesson(todayDate);

  // Speech helper
  const toggleSpeech = (text: string) => {
    if (isNarrating) {
      window.speechSynthesis?.cancel();
      setIsNarrating(false);
    } else {
      window.speechSynthesis?.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = language === 'en' ? 'en-US' : 'hi-IN';
      utter.rate = 0.95;
      utter.onend = () => setIsNarrating(false);
      utter.onerror = () => setIsNarrating(false);
      window.speechSynthesis?.speak(utter);
      setIsNarrating(true);
    }
  };

  // Start exam
  const handleStartExam = (lesson: DailyLesson, isPractice: boolean = false) => {
    setPrepLesson(null);
    const questions = isPractice ? getPracticeExamQuestions(10) : lesson.questions;
    setTakingExam({ lesson, isPractice, questions });
    setCurrentQIndex(0);
    setUserAnswers({});
    setExamSecondsLeft(600);
    setIsExamSubmitted(false);
    setLastSubmission(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer countdown
  useEffect(() => {
    if (takingExam && !isExamSubmitted) {
      examTimerRef.current = setInterval(() => {
        setExamSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(examTimerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    }
    return () => {
      if (examTimerRef.current) clearInterval(examTimerRef.current);
    };
  }, [takingExam, isExamSubmitted]);

  // Submit and calculate result
  const handleSubmitExam = () => {
    if (!takingExam) return;
    if (examTimerRef.current) clearInterval(examTimerRef.current);

    let score = 0;
    takingExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        score++;
      }
    });

    const total = takingExam.questions.length;
    const percentage = Math.round((score / total) * 100);
    const xpEarned = score * 20 + (percentage >= 80 ? 50 : 0);
    const timeSpent = 600 - examSecondsLeft;

    const submission: UserExamSubmission = {
      id: `sub_${Date.now()}`,
      examId: takingExam.lesson.id,
      examTitle: takingExam.isPractice 
        ? (language === 'en' ? 'Practice Round' : 'अभ्यास परीक्षा')
        : (language === 'en' ? takingExam.lesson.title.en : takingExam.lesson.title.hi),
      examDate: new Date().toISOString().split('T')[0],
      dayNumber: takingExam.lesson.dayOfMonth,
      score,
      totalQuestions: total,
      percentage,
      timeSpentSeconds: timeSpent,
      answers: userAnswers,
      xpEarned,
      submittedAt: new Date().toLocaleTimeString(),
      status: percentage >= 80 ? 'excellent' : percentage >= 50 ? 'passed' : 'needs_practice'
    };

    saveExamSubmission(submission);
    setExamHistory(getSavedExamSubmissions());
    setUserXp(getSavedUserXp());
    setLastSubmission(submission);
    setIsExamSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* ==================== TOP STATS BAR (MATCHING SCREENSHOT 11) ==================== */}
      <div className="grid grid-cols-3 gap-2 bg-[#8D4B18] text-white p-4 rounded-3xl shadow-lg border border-amber-900/30 text-center">
        <div>
          <span className="text-xl sm:text-2xl font-black block">{userXp}</span>
          <span className="text-[10px] uppercase font-bold text-amber-200">
            {language === 'en' ? 'Total XP' : 'कुल XP'}
          </span>
        </div>

        <div className="border-x border-white/15">
          <span className="text-xl sm:text-2xl font-black block">
            {examHistory.length}/161
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-200">
            {language === 'en' ? 'Subjects' : 'विषय'}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black block flex items-center gap-1">
            🏅 {examHistory.filter(e => e.status === 'excellent').length}
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-200">
            {language === 'en' ? 'My Badges' : 'मेरे बैज'}
          </span>
        </div>
      </div>

      {/* ==================== ACTIVE EXAM TAKING BOARD ==================== */}
      {takingExam && !isExamSubmitted && (
        <div className="space-y-5 animate-in zoom-in-95 duration-200">
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-[#1A1814] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">
                {takingExam.isPractice 
                  ? (language === 'en' ? 'PRACTICE EXAM' : 'अभ्यास परीक्षा') 
                  : (language === 'en' ? 'DAILY SADHANA EXAM' : 'ज्ञान साधना — दैनिक परीक्षा')}
              </span>
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                {language === 'en' ? 'Question' : 'प्रश्न'} {currentQIndex + 1} / {takingExam.questions.length}
              </h3>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-black text-sm">
              <Timer size={16} />
              <span>{formatTimer(examSecondsLeft)}</span>
            </div>
          </div>

          {/* Question Text Box */}
          <div className="bg-[#FAF6EE] dark:bg-[#161410] border-2 border-amber-500/30 rounded-3xl p-6 shadow-md">
            <span className="text-xs font-bold text-amber-600 mb-2 block">
              {language === 'en' ? `Question ${currentQIndex + 1}:` : `प्रश्न क्र. ${currentQIndex + 1}:`}
            </span>
            <h2 className="text-base sm:text-lg font-serif font-black text-gray-900 dark:text-white leading-relaxed">
              {language === 'en' 
                ? takingExam.questions[currentQIndex].q.en 
                : takingExam.questions[currentQIndex].q.hi}
            </h2>
          </div>

          {/* 4 Multi-choice Options */}
          <div className="space-y-3">
            {(language === 'en' 
              ? takingExam.questions[currentQIndex].options.en 
              : takingExam.questions[currentQIndex].options.hi
            ).map((optText, optIdx) => {
              const isSelected = userAnswers[currentQIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => {
                    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
                  }}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 cursor-pointer",
                    isSelected
                      ? "bg-amber-500/20 border-amber-600 text-amber-950 dark:text-amber-100 shadow-md ring-2 ring-amber-500/30"
                      : "bg-white dark:bg-[#1A1814] border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:border-amber-500/40"
                  )}
                >
                  <span className={cn(
                    "w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border",
                    isSelected 
                      ? "bg-amber-600 text-white border-amber-600" 
                      : "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-500"
                  )}>
                    {['A', 'B', 'C', 'D'][optIdx]}
                  </span>
                  <span className="flex-1">{optText}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-amber-600" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Bottom Controls */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-5 py-3 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all disabled:opacity-40"
            >
              {language === 'en' ? 'Previous' : 'पिछला'}
            </button>

            {currentQIndex < takingExam.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="px-6 py-3 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white text-xs font-bold transition-all shadow-md"
              >
                {language === 'en' ? 'Next Question' : 'अगला प्रश्न'}
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black tracking-wider transition-all shadow-lg animate-pulse"
              >
                {language === 'en' ? 'Submit Exam' : 'परीक्षा जमा करें'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== EXAM RESULT / SCORECARD MODAL ==================== */}
      {isExamSubmitted && lastSubmission && (
        <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-amber-500 rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full mx-auto bg-amber-500/20 text-4xl flex items-center justify-center animate-bounce shadow-md">
            {lastSubmission.percentage >= 80 ? '🏆' : lastSubmission.percentage >= 50 ? '🏅' : '📖'}
          </div>

          <div>
            <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
              {lastSubmission.percentage >= 80 
                ? (language === 'en' ? 'Outstanding Performance!' : 'उत्कृष्ट प्रदर्शन!')
                : (language === 'en' ? 'Exam Completed!' : 'परीक्षा सफलतापूर्वक पूर्ण!')}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {lastSubmission.examTitle} • {lastSubmission.examDate}
            </p>
          </div>

          {/* Score & XP badges */}
          <div className="grid grid-cols-3 gap-2 bg-white dark:bg-black/20 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
            <div>
              <span className="text-2xl font-black text-amber-600 block">
                {lastSubmission.score}/{lastSubmission.totalQuestions}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                {language === 'en' ? 'Score' : 'प्राप्तांक'}
              </span>
            </div>

            <div className="border-x border-gray-200 dark:border-white/10">
              <span className="text-2xl font-black text-emerald-600 block">
                {lastSubmission.percentage}%
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                {language === 'en' ? 'Percentage' : 'प्रतिशत'}
              </span>
            </div>

            <div>
              <span className="text-2xl font-black text-amber-500 block">
                +{lastSubmission.xpEarned}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                {language === 'en' ? 'XP Earned' : 'अर्जित XP'}
              </span>
            </div>
          </div>

          {/* Question by Question Detailed Review */}
          <div className="space-y-3 text-left max-h-80 overflow-y-auto pr-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Answer Key & Explanations:' : 'उत्तर एवं शास्त्र प्रमाण:'}
            </h4>

            {takingExam?.questions.map((q, idx) => {
              const userAns = lastSubmission.answers[idx];
              const isCorrect = userAns === q.answer;

              return (
                <div 
                  key={idx}
                  className={cn(
                    "p-3.5 rounded-2xl border text-xs space-y-1.5",
                    isCorrect 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-rose-500/10 border-rose-500/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 font-bold">
                    <span>
                      {idx + 1}. {language === 'en' ? q.q.en : q.q.hi}
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-600 shrink-0 flex items-center gap-1">✓ {language === 'en' ? 'Correct' : 'सही'}</span>
                    ) : (
                      <span className="text-rose-600 shrink-0 flex items-center gap-1">✕ {language === 'en' ? 'Wrong' : 'ग़लत'}</span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 dark:text-gray-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {language === 'en' ? 'Correct Answer: ' : 'सही उत्तर: '}
                    </strong>
                    {language === 'en' ? q.options.en[q.answer] : q.options.hi[q.answer]}
                  </p>

                  <p className="text-[10px] text-gray-500 italic bg-black/5 dark:bg-white/5 p-2 rounded-xl">
                    💡 {language === 'en' ? q.explanation.en : q.explanation.hi}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setTakingExam(null);
                setIsExamSubmitted(false);
                setActiveSubTab('results');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-[#75390F] text-white font-black text-sm tracking-wide shadow-md transition-all cursor-pointer"
            >
              {language === 'en' ? 'View Results History' : 'परिणाम इतिहास देखें'}
            </button>

            <button
              onClick={() => {
                setTakingExam(null);
                setIsExamSubmitted(false);
                setActiveSubTab('live');
              }}
              className="px-5 py-3.5 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold text-sm transition-all"
            >
              {language === 'en' ? 'Back' : 'वापस'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MAIN EXAM CENTER (MATCHING SCREENSHOT 10 & 11) ==================== */}
      {!takingExam && (
        <div className="space-y-6">
          {/* Header Bar matching screenshot 10: "परीक्षा केंद्र" and tabs चालू / परिणाम */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
                {language === 'en' ? 'Exam Center' : 'परीक्षा केंद्र'}
              </h1>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {language === 'en' ? 'EXAM CENTER' : 'EXAM CENTER'}
              </p>
            </div>

            {/* Sub-tabs: चालू (Live) | पाठ्यक्रम (Curriculum) | परिणाम (Results) */}
            <div className="flex bg-[#EFE8DC] dark:bg-white/10 rounded-full p-1 text-xs font-black">
              <button
                onClick={() => setActiveSubTab('live')}
                className={cn(
                  "px-4 py-1.5 rounded-full transition-all cursor-pointer",
                  activeSubTab === 'live' 
                    ? "bg-[#8D4B18] text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {language === 'en' ? 'Live' : 'चालू'}
              </button>

              <button
                onClick={() => setActiveSubTab('curriculum')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  activeSubTab === 'curriculum' 
                    ? "bg-[#8D4B18] text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {language === 'en' ? 'Lessons' : 'पाठ'}
              </button>

              <button
                onClick={() => setActiveSubTab('results')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  activeSubTab === 'results' 
                    ? "bg-[#8D4B18] text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {language === 'en' ? 'Results' : 'परिणाम'}
              </button>
            </div>
          </div>

          {/* ==================== SUB-TAB 1: LIVE EXAMS (MATCHING SCREENSHOT 10) ==================== */}
          {activeSubTab === 'live' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* SECTION: अभी चल रही (LIVE NOW) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                      {language === 'en' ? 'LIVE NOW' : 'अभी चल रही'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400">2</span>
                </div>

                {/* CARD 1: DAILY SADHANA EXAM (DYNAMIC FOR TODAY'S DATE!) */}
                <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border-2 border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 shadow-md space-y-4 hover:border-amber-600/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-2xl flex items-center justify-center shrink-0">
                      🔥
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-serif font-black text-gray-900 dark:text-white">
                        {language === 'en' 
                          ? `Gyan Sadhana — ${currentMonthName} Monthly` 
                          : `ज्ञान साधना — ${currentMonthName} मासिक`}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {language === 'en' 
                          ? 'A new paper every day — gifts for the top 3 winners 🎁' 
                          : 'हर दिन नया प्रश्नपत्र — प्रथम तीन विजेताओं को उपहार 🎁'}
                      </p>

                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 text-[11px] font-mono font-black tracking-wider">
                          DAY {todayDayNum} / 30
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Prepare and Start Exam */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {/* Preparation Lesson Drawer Link */}
                    <button
                      onClick={() => setPrepLesson(todayLesson)}
                      className="flex-1 py-3 px-4 rounded-2xl bg-white dark:bg-white/10 hover:bg-amber-100 dark:hover:bg-white/15 border border-amber-600/30 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <BookOpen size={15} />
                      <span>{language === 'en' ? 'Prepare — Read lesson' : '📖 तैयारी करें — पाठ पढ़ें'}</span>
                    </button>

                    <button
                      onClick={() => handleStartExam(todayLesson, false)}
                      className="py-3 px-6 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white text-xs font-black tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>✍️</span>
                      <span>{language === 'en' ? 'Start Exam' : 'परीक्षा दें'}</span>
                    </button>
                  </div>
                </div>

                {/* CARD 2: PRACTICE ROUND MATCHING SCREENSHOT 10 */}
                <div 
                  onClick={() => handleStartExam(todayLesson, true)}
                  className="bg-[#FAF6EE] dark:bg-[#1A1814] border border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 shadow-sm space-y-3 hover:border-amber-600/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-2xl flex items-center justify-center shrink-0">
                      🎓
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-serif font-black text-gray-900 dark:text-white">
                          {language === 'en' ? 'Practice Round' : 'अभ्यास परीक्षा'}
                        </h3>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                      </div>

                      <p className="text-xs text-gray-500 font-medium">
                        {language === 'en' 
                          ? 'Repeat anytime • Try all kinds of questions' 
                          : 'कभी भी दोहराएँ • हर प्रकार के प्रश्न आज़माएँ'}
                      </p>

                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-black tracking-wider">
                          PRACTICE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: जल्द शुरू (COMING SOON) MATCHING SCREENSHOT 10 */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                      {language === 'en' ? 'COMING SOON' : 'जल्द शुरू'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400">1</span>
                </div>

                <div className="bg-[#FAF6EE]/70 dark:bg-[#1A1814]/70 border-2 border-dashed border-[#E7DECD] dark:border-amber-950/40 rounded-3xl p-5 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-2xl flex items-center justify-center shrink-0">
                      ⏳
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="text-base font-serif font-black text-gray-900 dark:text-white">
                        {language === 'en' ? '24 Tirthankaras — Special Parv Exam' : 'चौबीस तीर्थंकर — आगामी प्रतियोगिता'}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {language === 'en'
                          ? 'A new paper every day — gifts for top 3 winners 🎁'
                          : 'विशेष प्रश्नपत्र — शीर्ष ३ विजेताओं को नमो उपहार 🎁'}
                      </p>

                      <div className="pt-1 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-200 text-[10px] font-mono font-bold">
                          {language === 'en' ? 'Starts in 2D 08H 51M' : 'शुरू होगी 2D 08H 51M'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPrepLesson(PATHSHALA_LESSONS_30_DAYS[3])}
                    className="w-full py-2.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-amber-50 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all border border-amber-600/20"
                  >
                    {language === 'en' ? '📖 Prepare — Read Lesson' : '📖 तैयारी करें — पाठ पढ़ें'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 2: CURRICULUM & LESSONS (MATCHING SCREENSHOT 11) ==================== */}
          {activeSubTab === 'curriculum' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Category Pills matching screenshot 11 */}
              <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {['सभी', 'तीर्थंकर', 'मूल्य', 'प्रार्थना', 'कहानी', 'सिद्धांत'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
                      selectedCategory === cat
                        ? "bg-[#8D4B18] text-white border-[#8D4B18] shadow-sm"
                        : "bg-white dark:bg-[#1A1814] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Title Section matching screenshot 11 */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  {language === 'en' ? 'Today’s Lessons for Exam' : 'परीक्षा के लिए आज के पाठ'}
                </h3>
                <span className="text-xs font-bold text-amber-600 cursor-pointer">
                  {language === 'en' ? 'View all' : 'सभी देखें'}
                </span>
              </div>

              {/* 2-Column Lesson Cards matching screenshot 11 */}
              <div className="grid grid-cols-2 gap-3">
                {PATHSHALA_LESSONS_30_DAYS
                  .filter(l => selectedCategory === 'सभी' || l.category === selectedCategory)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => setPrepLesson(lesson)}
                      className="bg-[#1C1A17] text-white border border-white/5 hover:border-amber-500/40 rounded-3xl p-4 shadow-sm flex flex-col justify-between space-y-3 cursor-pointer hover:scale-101 active:scale-99 transition-all group"
                    >
                      <div className="space-y-2">
                        <span className="text-3xl block">{lesson.icon}</span>
                        <h4 className="text-sm font-serif font-black leading-snug line-clamp-2">
                          {language === 'en' ? lesson.title.en : lesson.title.hi}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                        <span>{lesson.level}</span>
                        <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                          पढ़ें →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================== SUB-TAB 3: RESULTS & SCORE HISTORY ==================== */}
          {activeSubTab === 'results' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {language === 'en' ? 'My Exam Submissions' : 'मेरी परीक्षा परिणाम सूची'}
              </h3>

              {examHistory.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF6EE] dark:bg-[#1A1814] rounded-3xl border border-dashed border-gray-300 dark:border-white/10 space-y-3">
                  <div className="text-3xl">📝</div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {language === 'en' ? 'No exam taken yet' : 'अभी तक कोई परीक्षा नहीं दी गई है'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {language === 'en' 
                      ? 'Take today’s daily sadhana exam or practice round to view your scorecards here.' 
                      : 'आज की ज्ञान साधना परीक्षा दें और अपना स्कोरकार्ड यहाँ देखें।'}
                  </p>
                  <button
                    onClick={() => setActiveSubTab('live')}
                    className="px-5 py-2.5 rounded-2xl bg-[#75390F] text-white text-xs font-black tracking-wider shadow-sm"
                  >
                    {language === 'en' ? 'Go to Live Exams' : 'परीक्षा केंद्र पर जाएँ'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {examHistory.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white dark:bg-[#1A1814] border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            sub.status === 'excellent' ? "bg-emerald-500" : "bg-amber-500"
                          )} />
                          <h4 className="text-sm font-serif font-black text-gray-900 dark:text-white">
                            {sub.examTitle}
                          </h4>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {sub.examDate} • {sub.submittedAt}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-mono font-black text-amber-600 block">
                          {sub.score}/{sub.totalQuestions} ({sub.percentage}%)
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          +{sub.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== PREPARATION LESSON DRAWER MODAL ==================== */}
      {prepLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] dark:bg-[#1A1814] border border-amber-900/20 max-w-lg w-full max-h-[85vh] rounded-3xl p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{prepLesson.icon}</span>
                <div>
                  <h3 className="text-base font-serif font-black text-gray-900 dark:text-white">
                    {language === 'en' ? prepLesson.title.en : prepLesson.title.hi}
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    {language === 'en' ? prepLesson.subtitle.en : prepLesson.subtitle.hi}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSpeech(language === 'en' ? prepLesson.fullContent.en : prepLesson.fullContent.hi)}
                  className="p-2 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 transition-colors"
                  title="Audio narration"
                >
                  {isNarrating ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                  onClick={() => {
                    setPrepLesson(null);
                    if (isNarrating) {
                      window.speechSynthesis?.cancel();
                      setIsNarrating(false);
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable reading body */}
            <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed pr-1">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                  {language === 'en' ? 'Summary & Essence:' : 'पाठ का सार:'}
                </h4>
                <p>{language === 'en' ? prepLesson.summary.en : prepLesson.summary.hi}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs">
                  {language === 'en' ? 'Key Learnings:' : 'स्मरण रखने योग्य मुख्य बिंदु:'}
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-gray-700 dark:text-gray-300">
                  {(language === 'en' ? prepLesson.keyPoints.en : prepLesson.keyPoints.hi).map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-white/10">
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs">
                  {language === 'en' ? 'Full Chapter Reading:' : 'सम्पूर्ण पाठ विवरण:'}
                </h4>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-loose">
                  {language === 'en' ? prepLesson.fullContent.en : prepLesson.fullContent.hi}
                </p>
              </div>
            </div>

            {/* Bottom Exam Button */}
            <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex gap-3">
              <button
                onClick={() => handleStartExam(prepLesson, false)}
                className="flex-1 py-3.5 rounded-2xl bg-[#75390F] hover:bg-[#592B0A] text-white font-black text-xs tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✍️</span>
                <span>{language === 'en' ? 'Start Exam on this Lesson' : 'इस पाठ पर परीक्षा प्रारंभ करें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
