import { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RefreshCcw, Award, Flame, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function QuizPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'quiz'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching quiz:', error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelected(idx);
    setHasAnswered(true);
    if (idx === questions[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setHasAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setHasAnswered(false);
  };

  if (showResult) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] flex flex-col items-center justify-center text-center text-gray-200">
        <div className="relative mb-8 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
          <div className="w-32 h-32 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,109,0,0.8)] relative z-10 border-4 border-[#121212]">
            <Award size={64} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
        
        <h1 className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          {language === 'hi' ? 'क्विज़ पूर्ण!' : 'Quiz Complete!'}
        </h1>
        <p className="text-2xl text-gray-400 mb-10 font-medium">
          {language === 'hi' ? 'आपका स्कोर' : 'You scored'} <span className="font-black text-[#FFD54F] drop-shadow-[0_0_8px_rgba(255,213,79,0.8)] text-4xl mx-2">{score}</span> {language === 'hi' ? 'में से' : 'out of'} {questions.length}
        </p>
        
        <div className="bg-[#121212]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-md mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <p className="text-gray-300 font-bold text-lg relative z-10 leading-relaxed">
            {score === questions.length 
              ? (language === 'hi' ? "उत्कृष्ट! आपको जैन धर्म का गहरा ज्ञान है।" : "Excellent! You have profound knowledge of Jainism.") 
              : score >= questions.length / 2 
                ? (language === 'hi' ? "अच्छा काम! सीखते रहें और मार्ग का अन्वेषण करते रहें।" : "Good job! Keep learning and exploring the path.") 
                : (language === 'hi' ? "एक शानदार शुरुआत! अधिक जानने के लिए ज्ञान अनुभाग पर जाएँ।" : "A great start! Visit the Knowledge section to learn more.")
            }
          </p>
        </div>

        <button 
          onClick={restart}
          className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-full font-black shadow-[0_0_20px_rgba(255,109,0,0.4)] hover:shadow-[0_0_30px_rgba(255,109,0,0.6)] transition-all active:scale-95 hover:scale-105 text-lg"
        >
          <RefreshCcw size={24} />
          {language === 'hi' ? 'पुनः प्रयास करें' : 'TRY AGAIN'}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4 text-[#FF6D00]" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">Loading Quiz...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200 flex flex-col items-center justify-center">
        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">No questions found.</p>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="min-h-full p-6 pb-24 bg-[#050505] text-gray-200">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-300" />
          </button>
          <h1 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">
            <HelpCircle className="text-[#FF6D00] drop-shadow-[0_0_8px_rgba(255,109,0,0.8)]" size={32} />
            {language === 'hi' ? 'दैनिक क्विज़' : 'DAILY QUIZ'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#121212]/80 px-4 py-1.5 rounded-full text-sm font-black text-[#FFD54F] shadow-[0_0_10px_rgba(255,213,79,0.1)] border border-[#FFD54F]/20 tracking-widest">
            {currentQ + 1} / {questions.length}
          </span>
        </div>
      </header>

      {/* Daily Challenge Banner */}
      {currentQ === 0 && !hasAnswered && (
        <div className="mb-8 bg-gradient-to-br from-[#2962FF]/20 to-[#82B1FF]/10 backdrop-blur-xl rounded-[2rem] p-5 shadow-[0_0_20px_rgba(41,98,255,0.15)] border border-[#2962FF]/30 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2962FF]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h3 className="text-lg font-black text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {language === 'hi' ? 'दैनिक चुनौती' : 'Daily Challenge'}
            </h3>
            <p className="text-xs text-[#82B1FF] font-bold tracking-widest uppercase">
              {language === 'hi' ? '50 बोनस अंक अर्जित करें' : 'Earn 50 Bonus Points'}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#2962FF]/20 rounded-full flex items-center justify-center border border-[#2962FF]/40 shadow-[0_0_15px_rgba(41,98,255,0.3)] relative z-10">
            <Award size={24} className="text-[#82B1FF] drop-shadow-[0_0_8px_rgba(130,177,255,0.8)]" />
          </div>
        </div>
      )}

      <div className="bg-[#121212]/80 backdrop-blur-xl rounded-[2rem] shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 p-8 mb-8 animate-in slide-in-from-right-8 duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <h2 className="text-2xl font-black text-white mb-8 leading-relaxed relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {q.q[language as 'en' | 'hi']}
        </h2>

        <div className="space-y-4 relative z-10">
          {q.options[language as 'en' | 'hi'].map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === q.answer;
            const showCorrect = hasAnswered && isCorrect;
            const showWrong = hasAnswered && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasAnswered}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between font-bold text-lg",
                  !hasAnswered && "border-white/10 text-gray-300 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,109,0,0.2)]",
                  showCorrect && "border-[#00E676] bg-[#00E676]/10 text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]",
                  showWrong && "border-[#FF1744] bg-[#FF1744]/10 text-[#FF1744] shadow-[0_0_20px_rgba(255,23,68,0.2)]",
                  hasAnswered && !isSelected && !isCorrect && "border-white/5 text-gray-600 opacity-50"
                )}
              >
                <span>{opt}</span>
                {showCorrect && <CheckCircle2 className="text-[#00E676] drop-shadow-[0_0_8px_rgba(0,230,118,0.8)]" size={24} />}
                {showWrong && <XCircle className="text-[#FF1744] drop-shadow-[0_0_8px_rgba(255,23,68,0.8)]" size={24} />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="mt-8 p-6 bg-[#2962FF]/10 rounded-2xl border border-[#2962FF]/30 animate-in fade-in duration-500 shadow-[0_0_20px_rgba(41,98,255,0.15)] relative z-10">
            <p className="text-base text-blue-100 font-medium leading-relaxed">
              <span className="font-black uppercase tracking-widest text-[10px] block mb-2 text-[#82B1FF]">
                {language === 'hi' ? 'स्पष्टीकरण' : 'Explanation'}
              </span>
              {q.explanation[language as 'en' | 'hi']}
            </p>
          </div>
        )}
      </div>

      {hasAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(255,109,0,0.4)] hover:shadow-[0_0_30px_rgba(255,109,0,0.6)] transition-all duration-300 active:scale-95 animate-in slide-in-from-bottom-4 hover:-translate-y-1"
        >
          {currentQ < questions.length - 1 
            ? (language === 'hi' ? 'अगला प्रश्न' : 'NEXT QUESTION') 
            : (language === 'hi' ? 'परिणाम देखें' : 'VIEW RESULTS')}
        </button>
      )}
    </div>
  );
}
