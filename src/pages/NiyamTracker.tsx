import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Flame, Award, Volume2, Sparkles, Calendar, Shield, Heart, RotateCcw, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';

interface DailyNiyamItem {
  id: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  points: number;
  category: 'ahara' | 'puja' | 'swadhyay' | 'sanyam';
}

const DEFAULT_NIYAMS: DailyNiyamItem[] = [
  {
    id: 'niyam_night_food',
    titleHi: 'रात्रि भोजन त्याग (चौविहार)',
    titleEn: 'No Eating After Sunset (Chauvihar)',
    descHi: 'सूर्यास्त के पश्चात किसी भी प्रकार के अन्न, फल एवं गरिष्ठ आहार का सर्वथा त्याग।',
    points: 20,
    category: 'ahara'
  },
  {
    id: 'niyam_jamikand',
    titleHi: 'जमीकंद / कंदमूल त्याग',
    titleEn: 'Avoid Root Vegetables (Kandmool)',
    descHi: 'आलू, प्याज, लहसुन, गाजर, मूली, चुकंदर आदि अनंतकाय जीवों का पूर्ण त्याग।',
    points: 20,
    category: 'ahara'
  },
  {
    id: 'niyam_darshan',
    titleHi: 'नित्य जिनेन्द्र देव दर्शन',
    titleEn: 'Daily Jinendra Temple Visit',
    descHi: 'प्रातःकाल शुद्ध वस्त्रों में जिनालय जाकर वीतराग प्रभु का दर्शन एवं नमस्कार।',
    points: 15,
    category: 'puja'
  },
  {
    id: 'niyam_jaap',
    titleHi: 'प्रतिदिन १ माला णमोकार जाप',
    titleEn: '1 Mala Navkar Mantra Chanting',
    descHi: 'कम से कम १०८ बार णमोकार महामंत्र का एकाग्रचित्त होकर जाप करना।',
    points: 15,
    category: 'puja'
  },
  {
    id: 'niyam_water',
    titleHi: 'मर्यादित छने हुए जल का पान',
    titleEn: 'Drink Strained / Boiled Water',
    descHi: 'दोहरे छने वस्त्र से छना हुआ मर्यादित जल ही पीना।',
    points: 10,
    category: 'ahara'
  },
  {
    id: 'niyam_swadhyay',
    titleHi: '१० मिनट जिनवाणी स्वाध्याय',
    titleEn: '10 Mins Daily Scripture Reading',
    descHi: 'प्रतिदिन समयसार, तत्त्वार्थ सूत्र या किसी जिनवाणी ग्रंथ का अध्ययन।',
    points: 15,
    category: 'swadhyay'
  },
  {
    id: 'niyam_bazaar_food',
    titleHi: 'अशुद्ध एवं बाजारू खानपान त्याग',
    titleEn: 'Avoid Street / Unclean Food',
    descHi: 'होटल, रेस्टोरेंट के अशुद्ध खानपान, पैकेज्ड जंक फूड का त्याग कर घर का शुद्ध सात्विक भोजन।',
    points: 15,
    category: 'ahara'
  },
  {
    id: 'niyam_kashaya',
    titleHi: 'कषाय नियंत्रण (क्रोध व अहंकार त्याग)',
    titleEn: 'Control Anger & Ego',
    descHi: 'आज दिनभर किसी पर अकारण क्रोध न करना और क्षमा भाव धारण करना।',
    points: 10,
    category: 'sanyam'
  }
];

interface PachkhanItem {
  id: string;
  nameHi: string;
  nameEn: string;
  timeHi: string;
  prakritText: string;
  hindiArth: string;
}

const PACHKHAN_LIST: PachkhanItem[] = [
  {
    id: 'pach_navkarsi',
    nameHi: 'नवकारसी पचक्खान',
    nameEn: 'Navkarsi Pachkhan',
    timeHi: 'सूर्योदय से ४८ मिनट बाद तक',
    prakritText: `सूरउग्गए पच्चक्खामि, नमुक्कार-सहिअं, पोरिसिं, साड्ढ-पोरिसिं, मुट्ठिसहिअं पच्चक्खामि, अन्नत्थणाभोगेणं, सहसागारेणं, महत्तरागारेणं, सव्वसमाहि-वत्तियागारेणं, वोसिरामि॥`,
    hindiArth: 'सूर्योदय के पश्चात् १ मुहूर्त (४८ मिनट) तक चारों प्रकार के आहार (अन्न, जल, मुखवास) का त्याग करता हूँ।'
  },
  {
    id: 'pach_paurushi',
    nameHi: 'पौरुषी एवं सपाद पौरुषी',
    nameEn: 'Paurushi (Quarter Day Fast)',
    timeHi: 'सूर्योदय से ३ घंटे (दिन का १ पहर) तक',
    prakritText: `सूरउग्गए पच्चक्खामि, पोरिसिं पच्चक्खामि, चउव्विहं पि आहारं असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं, सहसागारेणं, वोसिरामि॥`,
    hindiArth: 'सूर्योदय के बाद दिन के पहले प्रहर (लगभग ३ घंटे) तक चारों प्रकार के आहार का सर्वथा त्याग।'
  },
  {
    id: 'pach_ekashan',
    nameHi: 'एकाशन पचक्खान',
    nameEn: 'Ekashan (One Meal Fast)',
    timeHi: 'दिन में केवल एक बार बैठकर भोजन',
    prakritText: `एगासणं पच्चक्खामि, तिविहं पि आहारं असणं, खाइमं, साइमं, अन्नत्थणाभोगेणं, सहसागारेणं, सागारिआगारेणं, वोसिरामि॥`,
    hindiArth: 'दिन में एक ही आसन पर बैठकर एक बार शुद्ध भोजन ग्रहण कर बाकी पूरे दिन-रात भोजन का त्याग।'
  },
  {
    id: 'pach_biyasan',
    nameHi: 'बियासन पचक्खान',
    nameEn: 'Biyasan (Two Meals Fast)',
    timeHi: 'दिन में दो बार बैठकर भोजन',
    prakritText: `बिआसणं पच्चक्खामि, तिविहं पि आहारं, सूरत्थमेइ जाव अन्नत्थणाभोगेणं वोसिरामि॥`,
    hindiArth: 'दिन में केवल दो बार बैठकर भोजन करना, बीच में कुछ भी न खाना।'
  },
  {
    id: 'pach_upvas',
    nameHi: 'उपवास पचक्खान (२४ घंटे)',
    nameEn: 'Upvas (Complete 24-hr Fast)',
    timeHi: 'सूर्योदय से अगले सूर्योदय तक',
    prakritText: `सूरउग्गए पच्चक्खामि, चउव्विहं पि आहारं-असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं, सहसागारेणं, पारिट्ठ्ठावणियागारेणं, महत्तरागारेणं, सव्वसमाहि-वत्तियागारेणं, वोसिरामि॥`,
    hindiArth: 'आज पूरे दिन एवं रात अन्न का पूर्ण त्याग। केवल दिन में आवश्यकतानुसार उबला प्रासुक जल ले सकते हैं।'
  },
  {
    id: 'pach_chauvihar',
    nameHi: 'चौविहार पचक्खान (रात्रि भोजन त्याग)',
    nameEn: 'Chauvihar (Sunset to Sunrise)',
    timeHi: 'सूर्यास्त से अगले दिन सूर्योदय तक',
    prakritText: `दिवस-चरमं पच्चक्खामि, चउव्विहं पि आहारं-असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं, सहसागारेणं, वोसिरामि॥`,
    hindiArth: 'सूर्यास्त होते ही अगले दिन सूर्योदय तक चारों प्रकार के आहार (अन्न, जल, मुखवास) का पूर्ण त्याग।'
  }
];

export default function NiyamTrackerPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'niyam' | 'pachkhan'>('niyam');

  // Loaded today's logged niyam IDs
  const getTodayKey = () => `niyam_log_${new Date().toISOString().split('T')[0]}`;
  const [completedNiyams, setCompletedNiyams] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(getTodayKey());
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('niyam_streak_days');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [totalPunya, setTotalPunya] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('niyam_total_punya');
      return saved ? parseInt(saved, 10) : 150;
    } catch {
      return 150;
    }
  });

  // Audio Speech Synthesis for Pachkhan
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleNiyam = (id: string, points: number) => {
    const isCompleted = completedNiyams.includes(id);
    const updated = isCompleted 
      ? completedNiyams.filter(item => item !== id)
      : [...completedNiyams, id];

    setCompletedNiyams(updated);
    localStorage.setItem(getTodayKey(), JSON.stringify(updated));

    // Update Punya Points
    const nextPoints = isCompleted ? Math.max(0, totalPunya - points) : totalPunya + points;
    setTotalPunya(nextPoints);
    localStorage.setItem('niyam_total_punya', nextPoints.toString());

    // Update streak if full set completed
    if (updated.length === DEFAULT_NIYAMS.length) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('niyam_streak_days', newStreak.toString());
      playChime();
    }
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // ignore
    }
  };

  const speakPachkhan = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'hi-IN';
      utter.rate = 0.85;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
    }
  };

  const completionPercent = Math.round((completedNiyams.length / DEFAULT_NIYAMS.length) * 100);

  return (
    <div className="min-h-full p-4 sm:p-6 pb-28 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-150 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 hover:border-amber-500/40 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {language === 'en' ? 'Daily Vow & Discipline Tracker' : 'श्रावक दैनिक नियम एवं पचक्खान'}
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white">
              {language === 'en' ? 'Daily Niyam & Pachkhan Diary' : 'दैनिक नियम एवं त्याग डायरी'}
            </h1>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 px-3 py-1.5 rounded-2xl">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-orange-600 dark:text-orange-400 font-black block leading-none">
              Streak
            </span>
            <span className="text-xs font-black text-gray-900 dark:text-white">
              {streak} {language === 'en' ? 'Days' : 'दिन'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('niyam')}
          className={cn(
            "flex-1 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border text-center",
            activeTab === 'niyam'
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-600/20"
              : "bg-white dark:bg-[#18181b] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
          )}
        >
          📋 {language === 'en' ? 'Today’s Niyam Checklist' : 'आज के दैनिक नियम (८ संकल्प)'}
        </button>
        <button
          onClick={() => setActiveTab('pachkhan')}
          className={cn(
            "flex-1 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border text-center",
            activeTab === 'pachkhan'
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-600/20"
              : "bg-white dark:bg-[#18181b] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
          )}
        >
          🕉️ {language === 'en' ? 'Sacred Pachkhan Vows' : 'सम्पूर्ण पचक्खान संग्रह (Audio)'}
        </button>
      </div>

      {/* TAB 1: NIYAM CHECKLIST */}
      {activeTab === 'niyam' && (
        <div className="space-y-5">
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-600/20 dark:to-transparent rounded-3xl p-5 sm:p-6 border-2 border-amber-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
              <span>{language === 'en' ? 'Today\'s Discipline Progress' : 'आज का साधना संकल्प'}</span>
              <span>{completedNiyams.length} / {DEFAULT_NIYAMS.length} {language === 'en' ? 'Done' : 'नियम संपन्न'} ({completionPercent}%)</span>
            </div>

            <div className="w-full h-3 bg-amber-500/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#00E676] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {completionPercent === 100 && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-2">
                <Award size={16} />
                <span>{language === 'en' ? 'Marvelous! Today\'s Ideal Shravak Vows Accomplished!' : 'उत्कृष्ट! आज के समस्त नियम सफलतापूर्वक पूर्ण हुए। धर्म लाभ!'}</span>
              </div>
            )}
          </div>

          {/* Checklist Items */}
          <div className="grid gap-3">
            {DEFAULT_NIYAMS.map((niyam) => {
              const isChecked = completedNiyams.includes(niyam.id);
              return (
                <div
                  key={niyam.id}
                  onClick={() => toggleNiyam(niyam.id, niyam.points)}
                  className={cn(
                    "p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none",
                    isChecked
                      ? "bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm"
                      : "bg-white dark:bg-[#18181b] border-gray-200 dark:border-white/10 hover:border-amber-500/40"
                  )}
                >
                  <button className="pt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">
                    {isChecked ? <CheckCircle2 size={20} className="fill-emerald-500 text-white" /> : <Circle size={20} className="text-gray-400" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn("text-sm font-bold text-gray-900 dark:text-white", isChecked && "line-through opacity-75")}>
                        {language === 'en' ? niyam.titleEn : niyam.titleHi}
                      </h4>
                      <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                        +{niyam.points} पुण्य
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {niyam.descHi}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SACRED PACHKHANS */}
      {activeTab === 'pachkhan' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-gray-700 dark:text-gray-300 font-medium">
            💡 <strong>पचक्खान का महत्व:</strong> पचक्खान का अर्थ है "प्रत्याख्यान" — किसी भी वस्तु या भोजन का निश्चित समय के लिए त्याग करना। बिना पचक्खान के भूखे रहने से केवल उपवास होता है, पर पचक्खान सहित त्याग करने से अनंत गुना कर्म निर्जरा होती है।
          </div>

          <div className="grid gap-4">
            {PACHKHAN_LIST.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#18181b] border-2 border-amber-500/25 rounded-3xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-150 dark:border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-black text-gray-900 dark:text-white">
                      {p.nameHi}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                      ⏱️ समय: {p.timeHi}
                    </span>
                  </div>

                  <button
                    onClick={() => speakPachkhan(p.prakritText + '. सरल अर्थ: ' + p.hindiArth)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Volume2 size={13} />
                    <span>{isSpeaking ? 'बन्द करें' : 'पचक्खान श्रवण'}</span>
                  </button>
                </div>

                {/* Prakrit formula */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/20 text-center">
                  <p className="font-serif font-bold text-amber-950 dark:text-amber-100 text-sm sm:text-base leading-relaxed">
                    {p.prakritText}
                  </p>
                </div>

                {/* Meaning */}
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                  <strong>सरल अर्थ:</strong> {p.hindiArth}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <SectionAiAgent
        section="aagams"
        customTriggerTitle={language === 'en' ? 'Ask Niyam Rules' : 'नियम व पचक्खान शंका समाधान'}
      />
    </div>
  );
}
