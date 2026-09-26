import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2, Info, BookOpen, Clock, Heart, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';
import SectionAiAgent from '../components/SectionAiAgent';

interface SamayikStep {
  stepNumber: number;
  titleHi: string;
  titleEn: string;
  descHi: string;
  originalText: string;
  transliteration?: string;
  hindiMeaning: string;
  bhavartha: string;
}

const SAMAYIK_STEPS: SamayikStep[] = [
  {
    stepNumber: 1,
    titleHi: 'चरण १: ईर्यापथ शुद्धि (गमनागमन प्रतिक्रमण)',
    titleEn: 'Step 1: Iryapath Shuddhi (Repentance for path movement)',
    descHi: 'सामायिक में बैठने से पूर्व मार्ग में चलते हुए हुए सूक्ष्म जीवों के कष्ट के लिए क्षमा याचना।',
    originalText: `इच्छामि खमासमणो! वंदिउं जावणिज्जाए निसीहिआए, मत्थएण वंदामि।
इच्छाकारेण संदिसह भगवन्! इरियावहियं पडिक्कमामि? इच्छं, इच्छामि पडिक्कमिउं।
इरियावहियाए, विराहणाए, गमणागमणे, पाण-अक्कवणे, बीय-अक्कवणे, हरिय-अक्कवणे, ओसा-उत्तिंग-पणग-दगमट्टी-मक्कड़ा-संताणा-संकमणे।
जे मे जीवा विराहिया, एगिंदिया, बेइंदिया, तेइंदिया, चउरिंदिया, पंचेन्दिया, अभिहया, वत्तिया, लेसिया, संघाइया, संघट्टिया, परियाविया, किलामिया, उद्दविया, ठाणाओ ठाणं संकामिया, जीवियाओ ववरोविया, तस्स मिच्छा मि दुक्कडं॥`,
    transliteration: 'Ichchhami khamasamano! Vandium javanijjae nisihiyae, matthaena vandami | Ichchhakarena sandisaha bhagavan! Iriyavahiyam padikkamami? Ichchham, ichchhami padikkamium...',
    hindiMeaning: 'हे भगवन्! मार्ग में आते-जाते समय यदि मेरे पैरों के नीचे आकर एकेंद्रिय, द्वीन्द्रिय, त्रीन्द्रिय, चतुरिन्द्रिय अथवा पंचेन्द्रिय जीवों की विराधना हुई हो, वे दब गए हों या उन्हें कष्ट हुआ हो, तो मेरा वह सारा दुष्कृत्य (पाप) मिथ्या हो।',
    bhavartha: 'सामायिक का पहला नियम यह है कि मन से संपूर्ण हिंसा और वैर का त्याग कर समस्त जीवों के प्रति मैत्री भाव प्रकट किया जाए।'
  },
  {
    stepNumber: 2,
    titleHi: 'चरण २: तीन आवर्त और चार शिरोनति (गुरु एवं जिन वंदना)',
    titleEn: 'Step 2: Three Avartas & Four Shironatis',
    descHi: 'दोनों हाथों को चक्राकार घुमाकर मस्तक झुकाकर जिनेन्द्र देव और गुरुदेव को त्रिकाल वंदना।',
    originalText: `नमोऽस्तु वर्धमानाय स्पर्धमानाय तेजसा ।
ऋद्ध्या जिताखिलर्द्धीश-महर्द्धेऽमिततेजसे ॥
तीर्थंकराय नमः, सिद्धात्मने नमः, निर्ग्रन्थ मुनिभ्यो नमः।`,
    transliteration: 'Namostu vardhamanaya spardhamanaya tejasa | Riddhi jita-khilarddhisha-maharddhe-amit-tejase ||',
    hindiMeaning: 'अपने तेज से संपूर्ण संसार के अंधकार को नष्ट करने वाले भगवान महावीर स्वामी, समस्त सिद्धों और निर्ग्रन्थ गुरुओं के चरणों में बारंबार नमस्कार हो।',
    bhavartha: 'अहंकार को शून्य करके वीतराग प्रभु के चरणों में समर्पित होना ही वंदना का सच्चा मर्म है।'
  },
  {
    stepNumber: 3,
    titleHi: 'चरण ३: सामायिक संकल्प दंडक पाठ (करेमि भंते)',
    titleEn: 'Step 3: Karemi Bhamte (The Sacred Samayik Vow)',
    descHi: '४८ मिनट तक मन, वचन और काया से समस्त सावद्य (पाप) व्यापार त्यागने का पावन संकल्प।',
    originalText: `करेमि भंते! सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि, दुविहं तिविहेणं-मणेणं, वायाए, काएणं, न करेमि, न कारवेमि, तस्स भंते! पडिक्कमामि, निंदामि, गरिहामि, अप्पाणं वोसिरामि॥`,
    transliteration: 'Karemi bhante! Samaiyam, savajjam jogam pachchakkhami, java niyamam pajjuvasami, duviham tivihenam - manenam, vayae, kaenam, na karemi, na karavemi, tassa bhante! Padikkamami, nindami, garihami, appanam vosirami ||',
    hindiMeaning: 'हे भगवन्! मैं सामायिक ग्रहण करता हूँ। जब तक मेरी यह सामायिक रहेगी, तब तक मैं मन, वचन और काया से न तो कोई पाप करूँगा और न दूसरों से कराऊँगा। मैं अपने पूर्व पापों की निंदा करता हूँ और आत्मा को दोषों से अलग करता हूँ।',
    bhavartha: 'सामायिक काल में श्रावक मुनिराज के तुल्य वीतराग अवस्था का आस्वादन करता है। इस समय वह सांसारिक प्रपंचों से पूर्णतः मुक्त हो जाता है।'
  },
  {
    stepNumber: 4,
    titleHi: 'चरण ४: कायोत्सर्ग एवं नवकार महामंत्र ध्यान',
    titleEn: 'Step 4: Kayotsarga & Navkar Meditation',
    descHi: 'शरीर को स्थिर रखकर श्वास-प्रश्वास के साथ ९ बार अथवा २७ उच्छ्वास में णमोकार महामंत्र का मौन ध्यान।',
    originalText: `तस्स उत्तरी-करणेणं, पायच्छित्त-करणेणं, विसोही-करणेणं, विसल्ली-करणेणं, पावाणं कम्माणं निग्घायणट्ठाए, ठामि काउस्सग्गं।
अन्नत्थ ऊससिएणं, नीससिएणं, खाएणं, छीएणं, जंभाइएणं, उड्डुएणं, वायनिसग्गेणं, भमलिए, पित्तमुच्छाए।
सुहुमेहिं अंग-संचालेहिं, सुहुमेहिं खेल-संचालेहिं, सुहुमेहिं दिट्ठि-संचालेहिं।
एवमाइएसु आगाcategoryरेसु, अभग्गो अविराहिओ, हुज्ज मे काउस्सग्गो।
जाव अरिहंताणं भगवंताणं नमुक्कारेणं न पारेमि, ताव कायं ठाणेणं मोणेणं झाणेणं अप्पाणं वोसिरामि॥`,
    transliteration: 'Tassa uttari-karanenam, payachchhitta-karanenam, visohi-karanenam, visalli-karanenam, pavanam kammanam nigghayanatthae, thami kaussaggam...',
    hindiMeaning: 'पापों के प्रायश्चित्त और शुद्धि के लिए मैं कायोत्सर्ग (शरीर से मोह त्यागकर ध्यान) में स्थित होता हूँ। जब तक णमोकार महामंत्र का ध्यान पूरा न हो, तब तक मैं स्थिर रहूँगा।',
    bhavartha: 'शरीर जड़ है और आत्मा चेतन—इस भेदविज्ञान को प्रत्यक्ष अनुभव करने की यह अनुपम जैन ध्यान पद्धति है।'
  },
  {
    stepNumber: 5,
    titleHi: 'चरण ५: सामायिक पारणा विधि (कृतकृत्यता पाठ)',
    titleEn: 'Step 5: Completion & Parana Vidhi',
    descHi: '४८ मिनट पूर्ण होने पर सामायिक व्रत की विधिपूर्वक पूर्णाहुति एवं क्षमा याचना।',
    originalText: `सामाइयं सम्मं काएणं न फासियं, पालिएणं न सोहियं, तीए विराहणाए जे कोइ अइयारो जाओ, तस्स मिच्छा मि दुक्कडं।
दस मण-दुक्कडा, बारस वय-दुक्कडा, सत्त काय-दुक्कडा, सव्वेसिं अइचाराणं तस्स मिच्छा मि दुक्कडं॥
जय वीतराग! जगद्गुरु! संसार-समुद्र-तारक! धर्म-रक्षक! नमोऽस्तु ते।`,
    transliteration: 'Samaiyam sammam kaenam na fasiyam, palienam na sohiyam, tie virahanae je koi aiyaro jao, tassa michchha mi dukkadam...',
    hindiMeaning: 'सामायिक पालन करते समय मन, वचन या काया से यदि कोई प्रमाद अथवा दोष हुआ हो, तो मेरा वह सब दुष्कृत्य मिथ्या हो। वीतराग प्रभु को बारंबार नमस्कार हो।',
    bhavartha: 'सामायिक से उठने पर भी समता का भाव पूरे दिन बना रहे—यही सामायिक की सच्ची सफलता है।'
  }
];

export default function SamayikPratikramanPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Active Tab: 'samayik' | 'pratikraman' | 'bhavna'
  const [activeTab, setActiveTab] = useState<'samayik' | 'pratikraman' | 'bhavna'>('samayik');

  // 48-minute Samayik Timer State (48 * 60 = 2880 seconds)
  const TOTAL_SECONDS = 48 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Audio Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio Context Bell Synthesizer
  const playTibetanSingingBowl = (freq: number = 432) => {
    if (!soundAlerts) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.995, ctx.currentTime + 4);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 5);
    } catch (e) {
      console.warn("Singing bowl audio error:", e);
    }
  };

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          // Halfway chime at 24 minutes (1440 seconds)
          if (prev === 1440) {
            playTibetanSingingBowl(528);
          }
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            playTibetanSingingBowl(650); // Finish chime
            alert(language === 'en' ? '48-Minute Samayik Completed! Peace and Punya attained.' : '४८ मिनट की पावन सामायिक साधना संपन्न हुई! धर्म लाभ।');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, soundAlerts]);

  const handleStartTimer = () => {
    if (!isTimerRunning && timeLeft === TOTAL_SECONDS) {
      playTibetanSingingBowl(432); // Initial bell
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(TOTAL_SECONDS);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((TOTAL_SECONDS - timeLeft) / TOTAL_SECONDS) * 100;

  // TTS Read current text
  const toggleTTS = (text: string) => {
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
              {language === 'en' ? 'Sacred Equanimity & Repentance' : 'समता एवं आत्मशुद्धि साधना'}
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white">
              {language === 'en' ? 'Samayik & Pratikraman' : 'सामायिक एवं प्रतिक्रमण विधि'}
            </h1>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/20"
          title="Print or Save PDF"
        >
          <Printer size={14} />
          <span className="hidden sm:inline">{language === 'en' ? 'Print / PDF' : 'प्रिंट / PDF'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'samayik', hi: '🧘 ४८ मिनट सामायिक विधि', en: '🧘 48-min Samayik' },
          { id: 'pratikraman', hi: '📜 दैनिक प्रतिक्रमण पाठ', en: '📜 Pratikraman Path' },
          { id: 'bhavna', hi: '✨ १२ भावना (चिंतन पाठ)', en: '✨ 12 Bhavnas' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
              activeTab === t.id
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-600/20 scale-102"
                : "bg-white dark:bg-[#18181b] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
            )}
          >
            {language === 'en' ? t.en : t.hi}
          </button>
        ))}
      </div>

      {/* TAB 1: 48-MINUTE SAMAYIK */}
      {activeTab === 'samayik' && (
        <div className="space-y-6">
          {/* 48-Min Timer Card */}
          <div className="bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-600/20 dark:to-transparent rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-lg text-center space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300">
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                <span>{language === 'en' ? '48-Minute Meditation Clock' : 'सामायिक काल (४८ मिनट)'}</span>
              </span>
              <button
                onClick={() => setSoundAlerts(!soundAlerts)}
                className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white/70 dark:bg-black/30 border border-amber-500/20 cursor-pointer"
              >
                {soundAlerts ? '🔔 घंटी ऑन' : '🔕 घंटी मूक'}
              </button>
            </div>

            {/* Huge Clock */}
            <div className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-amber-950 dark:text-amber-100">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-amber-500/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#00E676] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Timer Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartTimer}
                className={cn(
                  "px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer",
                  isTimerRunning
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30 scale-103"
                )}
              >
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
                <span>{isTimerRunning ? (language === 'en' ? 'Pause Meditation' : 'साधना विराम') : (language === 'en' ? 'Start 48-min Samayik' : 'सामायिक प्रारंभ करें')}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-3 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium max-w-lg mx-auto">
              {language === 'en'
                ? 'During these 48 minutes, sit facing East or North on a pure mat (Aasan). Read scriptures, chant Navkar Mantra, and practice equanimity toward all living beings.'
                : 'सामायिक के ४८ मिनट तक शुद्ध आसन पर पूर्व या उत्तर दिशा की ओर मुख करके बैठें। मन से वैर-विरोध त्यागकर स्वाध्याय, णमोकार जाप एवं आत्म-चिंतन करें।'}
            </p>
          </div>

          {/* Step-by-Step Samayik Guide */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              <span>{language === 'en' ? 'Complete Step-by-Step Samayik Vidhi' : 'क्रमबद्ध ५ पावन चरण विधि'}</span>
            </h3>

            {/* Step selector pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {SAMAYIK_STEPS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border",
                    currentStepIndex === idx
                      ? "bg-amber-600 text-white border-transparent shadow-sm"
                      : "bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-amber-500/30"
                  )}
                >
                  चरण {s.stepNumber}
                </button>
              ))}
            </div>

            {/* Selected Step Card */}
            {SAMAYIK_STEPS[currentStepIndex] && (
              <div className="bg-white dark:bg-[#18181b] border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-150 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      चरण {SAMAYIK_STEPS[currentStepIndex].stepNumber} of 5
                    </span>
                    <h4 className="text-base font-black text-gray-900 dark:text-white mt-1">
                      {SAMAYIK_STEPS[currentStepIndex].titleHi}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleTTS(SAMAYIK_STEPS[currentStepIndex].originalText + '. सरल अर्थ: ' + SAMAYIK_STEPS[currentStepIndex].hindiMeaning)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Volume2 size={14} />
                    <span>{isSpeaking ? 'पाठ बन्द करें' : 'पाठ श्रवण करें'}</span>
                  </button>
                </div>

                {/* Original Prakrit / Sanskrit */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/20 text-center">
                  <p className="font-serif text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 leading-relaxed whitespace-pre-line">
                    {SAMAYIK_STEPS[currentStepIndex].originalText}
                  </p>
                </div>

                {/* Meaning */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider">
                    📖 सरल अर्थ:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {SAMAYIK_STEPS[currentStepIndex].hindiMeaning}
                  </p>
                </div>

                {/* Bhavartha */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>आध्यात्मिक भावार्थ:</span>
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {SAMAYIK_STEPS[currentStepIndex].bhavartha}
                  </p>
                </div>

                {/* Step navigation buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    ← पिछला चरण
                  </button>
                  <button
                    disabled={currentStepIndex === SAMAYIK_STEPS.length - 1}
                    onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    अगला चरण →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRATIKRAMAN */}
      {activeTab === 'pratikraman' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#18181b] border-2 border-amber-500/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-gray-150 dark:border-white/10 pb-3">
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                सर्वोत्तम आत्मशुद्धि पाठ
              </span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">
                श्री दैवसिक एवं संवत्सरी प्रतिक्रमण सूत्र
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="font-bold text-amber-950 dark:text-amber-200 text-base mb-2">
                  ॥ मिच्छामि दुक्कडं - क्षमावाणी महामंत्र ॥
                </p>
                <p className="italic font-bold">
                  खामेमि सव्वजीवे, सव्वे जीवा खमंतु मे।<br />
                  मित्ती मे सव्वभूएसु, वेरं मज्झं न केणइ॥
                </p>
                <p className="mt-2 text-xs font-sans text-gray-700 dark:text-gray-300 font-medium">
                  सरल अर्थ: मैं संसार के समस्त जीवों से क्षमा मांगता हूँ, सब जीव मुझे क्षमा करें। मेरा प्राणिमात्र से मैत्री भाव है, किसी से भी मेरा लेशमात्र वैर नहीं है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-2 font-sans">
                <h4 className="font-black text-amber-800 dark:text-amber-300 text-xs uppercase">
                  प्रतिक्रमण के आवश्यक अंग:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <li><strong>सामायिक:</strong> समता भाव धारण करना।</li>
                  <li><strong>चतुर्विंशति स्तव:</strong> २४ तीर्थंकर भगवान की स्तुति।</li>
                  <li><strong>वंदना:</strong> पंच परमेष्ठी एवं गुरु की वंदना।</li>
                  <li><strong>प्रतिक्रमण:</strong> दिन या रात में हुए प्रमाद, असत्य, कषाय की आत्म-निंदा।</li>
                  <li><strong>कायोत्सर्ग:</strong> शरीर से ममत्व छोड़कर आत्म-ध्यान।</li>
                  <li><strong>प्रत्याख्यान:</strong> भविष्य में पापों से बचने का दृढ़ संकल्प।</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 12 BHAVNAS */}
      {activeTab === 'bhavna' && (
        <div className="space-y-3">
          {[
            { name: "१. अनित्य भावना", shlok: "राजा राणा छत्रपति हाथिन के असवार, मरना सबको एक दिन अपनी अपनी बार।", arth: "संसार में देह, यौवन, धन-वैभव सब बिजली की चमक के समान क्षणभंगुर हैं; केवल आत्मा ही नित्य शाश्वत है।" },
            { name: "२. अशरण भावना", shlok: "दल-बल देवी-देवता मात-पिता परिवार, मरती विरिया जीव को कोई न राखनहार।", arth: "मृत्यु आने पर कोई भी बाह्य शक्ति जीव की रक्षा नहीं कर सकती; केवल धर्म ही सच्चा शरण है।" },
            { name: "३. संसार भावना", shlok: "दाम बिना निर्धन दुखी तृष्णावश धनवान, कहुं न सुख संसार में सब जग देख्यो छान।", arth: "चारों गतियों में भटकते हुए जीव ने अनंत कष्ट भोगे हैं, संसार में सच्चा सुख लेशमात्र नहीं है।" },
            { name: "४. एकत्व भावना", shlok: "आप अकेला अवतरे मरे अकेला होय, यों कबहूँ इस जीव को साथी सगा न कोय।", arth: "जीव अकेला ही जन्म लेता है और अकेला ही कर्मफल भोगता है।" },
            { name: "५. अन्यत्व भावना", shlok: "मेरी आत्मा शुद्ध है देह अशुद्ध विनास, भिन्न-भिन्न दोनों लखे सो पावे भव पार।", arth: "आत्मा ज्ञानमयी चैतन्य है और शरीर पुद्गल जड़ है। मैं शरीर नहीं, शुद्ध आत्मा हूँ।" },
            { name: "६. अशुचि भावना", shlok: "पल रुधिर राध मल थैली, कीकस वसा ते मैली। नवद्वार बहें घिनकारी, अस देह करे किमि यारी।", arth: "यह शरीर नौ द्वारों से मल बहाने वाला अशुद्ध है, अतः इसके प्रति मोह त्यागें।" },
            { name: "७. आस्रव भावना", shlok: "आस्रव दुःखकार घनेरे, बुधिवंत तिन्हें नहिं सेवे।", arth: "मन-वचन-काया के योग से कर्मों का आना ही समस्त दुःखों की जड़ है।" },
            { name: "८. संवर भावना", shlok: "संवर सुखकार घनेरे, बुधिवंत तिन्हें नित सेवे।", arth: "गुप्ति, समिति, धर्म और अनुप्रेक्षा से नवीन कर्मों के आने को रोकना संवर है।" },
            { name: "९. निर्जरा भावना", shlok: "तप बल सो कर्म विनाशे, निज आत्म रूप प्रकाशे।", arth: "तपस्या की अग्नि से संचित कर्मों को जलाकर भस्म कर देना निर्जरा है।" },
            { name: "१०. लोक भावना", shlok: "लोक अकृत्रिम जानिये, पुरुष आकार बखान।", arth: "यह चौदह राजू प्रमाण लोक अनादि-अनंत है, किसी ने इसे बनाया या बिगाड़ा नहीं है।" },
            { name: "११. बोधिदुर्लभ भावना", shlok: "दुर्लभ है निगोद से थावर अरु त्रस रूप, त्यों दुर्लभ नर जनम अरु सम्यक दर्शन भूप।", arth: "अनंत कालों में दुर्लभ मनुष्य जन्म और सम्यग्दर्शन प्राप्त हुआ है, इसे व्यर्थ न गंवाएं।" },
            { name: "१२. धर्म भावना", shlok: "धर्म जहाज चढो भव पार, उत्तम सुख पावो सुखकार।", arth: "दशलक्षण अहिंसा मय वीतराग धर्म ही इस भवसागर से पार उतारने वाला सच्चा जहाज है।" },
          ].map((b, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 shadow-sm space-y-1.5">
              <h4 className="font-black text-amber-700 dark:text-amber-400 text-xs sm:text-sm">
                {b.name}
              </h4>
              <p className="font-serif font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                "{b.shlok}"
              </p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                भावार्थ: {b.arth}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* AI Assistant */}
      <SectionAiAgent
        section="aagams"
        customTriggerTitle={language === 'en' ? 'Ask Samayik Guide' : 'सामायिक व प्रतिक्रमण शंका समाधान'}
      />
    </div>
  );
}
