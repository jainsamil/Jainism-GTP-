import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Terminal, Cpu, RefreshCw, X,
  Database, ShieldCheck, Send, Lock,
  Globe, PlusCircle, CheckCircle2, AlertTriangle, FileJson,
  Image as ImageIcon, FileCode, Camera, FileText, Video, Music
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface SectionAiAgentProps {
  section: string;
}

export default function SectionAiAgent({ section }: SectionAiAgentProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Terminal / chat state
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileMime, setUploadedFileMime] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string; file?: { url: string, name: string, mime: string } }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [training, setTraining] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Content Generator State
  const [selectedCollection, setSelectedCollection] = useState('knowledge');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi & Hinglish');
  const [generatorPrompt, setGeneratorPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<any | null>(null);
  const [writeSuccess, setWriteSuccess] = useState(false);
  const [writeError, setWriteError] = useState('');
  const [isSavingToDb, setIsSavingToDb] = useState(false);

  // Map each page section parameter to a default Firestore collection
  useEffect(() => {
    const sectionToCollectionMap: Record<string, string> = {
      home: 'vichaar',
      knowledge: 'knowledge',
      media: 'media',
      aagams: 'aagams',
      saints: 'saints',
      pathshala: 'quiz',
      vichaar: 'vichaar',
      history: 'history',
      quiz: 'quiz',
      festivals: 'festivals',
      fasting: 'festivals',
      jaap: 'vichaar',
      tirth: 'tirthankars',
      swadhyay: 'aagams',
      bhaktamar: 'aagams',
      diet: 'knowledge',
      profile: 'knowledge',
      tirthankars: 'tirthankars',
      panchang: 'festivals',
      'verified-food': 'knowledge',
      'vihar-tracker': 'saints',
      'dharamshala-booking': 'tirth',
      'manuscript-library': 'aagams'
    };

    const defaultCol = sectionToCollectionMap[section.toLowerCase()] || 'knowledge';
    setSelectedCollection(defaultCol);
  }, [section]);

  // Initializing logs custom to the current section
  useEffect(() => {
    if (isOpen) {
      setLogs([
        `[SYSTEM] Dynamic AI Content Sub-Agent initiated for: "${section.toUpperCase()}" section.`,
        `[STATUS] API connection secure. Auto-updating pipeline: Active.`,
        `[MONITOR] Auto-saves will append directly to Firestore live database.`
      ]);
      setMessages([
        { 
          role: 'agent', 
          text: `Jai Jinendra! I am your ${section.toUpperCase()} Page Dynamic Content Agent. \n\nI am connected to the secure Firestore database. Tell me what changes or additions you want to make on this page, and I will write & push the live updates instantly!` 
        }
      ]);
    }
  }, [isOpen, section]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultBase64 = reader.result as string;
        setUploadedFile(resultBase64);
        setUploadedFileName(file.name);
        setUploadedFileMime(file.type);
        addLog(`[FILE HUB] File "${file.name}" of type "${file.type}" loaded successfully for processing.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password securely without exposing any hints on screen
    if (passcode === 'SamilJain@2026' || passcode === 'samil123') {
      setUnlocked(true);
      setErrorMsg('');
      addLog(`[SECURITY] Developer authenticated successfully. Active control panel unlocked for ${section}.`);
    } else {
      setErrorMsg('Unauthorized Entry Code.');
    }
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !uploadedFile || isProcessing) return;

    const userText = prompt || `Analyze and import document contents: ${uploadedFileName || 'doc_file'}`;
    const userFileBase64 = uploadedFile;
    const userFileName = uploadedFileName;
    const userFileMimeType = uploadedFileMime;
    
    setMessages(prev => [
      ...prev, 
      { 
        role: 'user', 
        text: userText, 
        file: userFileBase64 ? { url: userFileBase64, name: userFileName, mime: userFileMimeType } : undefined 
      }
    ]);
    
    setPrompt('');
    setUploadedFile(null);
    setUploadedFileName('');
    setUploadedFileMime('');
    setIsProcessing(true);
    addLog(`[COMMAND] Direct Instruction: "${userText}"`);

    try {
      if (userFileBase64) {
        addLog(`[AI MASTER] Processing file attachment "${userFileName}" (${userFileMimeType})...`);
      } else {
        addLog("[AI MASTER] Routing request to live NLP engine...");
      }

      const response = await fetch('/api/admin/nlp-agent-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, image: userFileBase64 })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Server NLP engine error');
      }

      const { action, targetCollection, targetId, payload, replyText } = result;

      if (action && action !== 'reply' && targetCollection) {
        addLog(`[TRANSACTION] Initiating direct Firestore Action: "${action}" -> "${targetCollection}"`);
        
        if (action === 'add' && payload) {
          await addDoc(collection(db, targetCollection), payload);
          addLog(`[SUCCESS] New item added and indexed successfully in "${targetCollection}"!`);
        } else if (action === 'update' && targetId && payload) {
          await setDoc(doc(db, targetCollection, targetId), payload, { merge: true });
          addLog(`[SUCCESS] Item ID: ${targetId} in collection "${targetCollection}" successfully updated!`);
        } else if (action === 'delete') {
          if (targetId) {
            await deleteDoc(doc(db, targetCollection, targetId));
            addLog(`[SUCCESS] Item ID: ${targetId} deleted from "${targetCollection}".`);
          } else if (payload && (payload.title || payload.name)) {
            const ident = payload.title || payload.name;
            const payloadTitle = typeof ident === 'object' ? (ident.hi || ident.en || '') : String(ident);
            addLog(`[SEARCH-DELETE] Querying "${targetCollection}" to delete matches for: "${payloadTitle}"`);
            
            const colRef = collection(db, targetCollection);
            const snapshot = await getDocs(query(colRef));
            let deletedCount = 0;
            for (const d of snapshot.docs) {
              const data = d.data();
              const dTitle = typeof data.title === 'object' ? (data.title.hi || data.title.en || '') : String(data.title || d.id || '');
              const dName = typeof data.name === 'object' ? (data.name.hi || data.name.en || '') : String(data.name || '');
              
              if (
                d.id === ident || 
                dTitle.toLowerCase().includes(payloadTitle.toLowerCase()) || 
                dName.toLowerCase().includes(payloadTitle.toLowerCase())
              ) {
                await deleteDoc(doc(db, d.ref.parent.path, d.id));
                deletedCount++;
              }
            }
            if (deletedCount > 0) {
              addLog(`[SUCCESS] Deleted ${deletedCount} item(s) matching "${payloadTitle}" from "${targetCollection}".`);
            } else {
              addLog(`[WARNING] No matching database items found for "${payloadTitle}".`);
            }
          }
        }
      }

      setMessages(prev => [...prev, { role: 'agent', text: replyText || `Operation completed. Database action: "${action || 'none'}"` }]);
    } catch (error: any) {
      console.error("Section Ai Agent execution failed:", error);
      addLog(`[ERROR] Direct update pipeline issue: ${error.message || error}`);
      setMessages(prev => [...prev, { role: 'agent', text: `🚨 **Autonomous Agent alert**: That database action could not complete.\n\n*Details: ${error.message || 'Check database validation rules.'}*` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAiContent = async () => {
    if (!generatorPrompt.trim()) return;
    setIsGenerating(true);
    setWriteSuccess(false);
    setWriteError('');
    setGeneratedPayload(null);
    addLog(`[AI LAB] Contacting Jainism Wisdom Engine to outline database schema for "${selectedCollection}" ...`);

    try {
      const response = await fetch('/api/admin/ai-generate-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCollection: selectedCollection,
          prompt: generatorPrompt,
          language: selectedLanguage
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setGeneratedPayload(result.data);
        addLog(`[SUCCESS] AI structured data configured for live push.`);
      } else {
        throw new Error(result.error || 'Failed to generate content format');
      }
    } catch (e: any) {
      console.error(e);
      setWriteError(e.message || 'Error generating structured item.');
      addLog(`[ERROR] Generation failure: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveGeneratedPayloadToDb = async () => {
    if (!generatedPayload) return;
    setIsSavingToDb(true);
    setWriteSuccess(false);
    setWriteError('');
    addLog(`[WRITE] Syncing new data live to Firestore: "${selectedCollection}"`);

    try {
      await addDoc(collection(db, selectedCollection), generatedPayload);
      setWriteSuccess(true);
      addLog(`[DATABASE] Added item to "${selectedCollection}" successfully! Section view updated in real-time.`);
      setGeneratedPayload(null);
      setGeneratorPrompt('');
    } catch (e: any) {
      console.error(e);
      setWriteError(e.message || 'Firestore connection issue.');
      addLog(`[ERROR] Direct push failed: ${e.message}`);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const collectionNames: Record<string, string> = {
    knowledge: 'Knowledge FAQ (FAQs)',
    tirthankars: 'Tirthankars',
    aagams: 'Aagams (Scriptures)',
    history: 'History Events',
    festivals: 'Festivals & Vrats',
    saints: 'Great Saints / Acharyas',
    vichaar: 'Vichaar (Daily Quotes)',
    media: 'Bhajans, Stories & Playbacks',
    quiz: 'Quiz Questions'
  };

  const presetsByCollection: Record<string, string[]> = {
    knowledge: [
      `Add a new question explaining the rules of Jain Diet during fasting in Hindi.`,
      `Explain the science behind Jain evening meal rules (Ratri Bhojan Tyag).`
    ],
    tirthankars: [
      `Add Lord Mahaveer detailed bio with key principles in Hindi & English, symbol Lion.`,
      `Add Lord Parshvanath life incident explaining forgiveness.`
    ],
    aagams: [
      `Add a beautiful path/stotra or verse to Jinvani library.`,
      `Create a translation breakdown of standard Swadhyay items.`
    ],
    history: [
      `Add historical event of Paryushan festival origin.`,
      `Add historical establishment details of great tirth centers.`
    ],
    festivals: [
      `Add Paryushan rules and optimal fasting schedule.`,
      `Add Ashtahnika Parv Vidhi detailing dynamic fast schedules.`
    ],
    saints: [
      `Add Acharya Vidyasagar Ji Maharaj dynamic spiritual bio.`,
      `Add stories of Acharya Kundakunda traveling to Videha Kshetra.`
    ],
    vichaar: [
      `Add "Jinendra Bhakti as a medium of self-purification" daily quote.`,
      `Draft a multilingual inspiring quote on the value of quietude (Maun).`
    ],
    media: [
      `Add standard Bhaktamar Stotra playback lyrics with YouTube links.`,
      `Add inspirational children's audio story regarding Karma theory.`
    ],
    quiz: [
      `Create a 4-option trivia question on the 10 Dharmas representation.`,
      `Add true/false quiz question regarding the elements of Jainism.`
    ]
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 md:left-auto md:right-24 w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] hover:from-[#FF8A65] hover:to-[#FF6D00] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(255,109,0,0.4)] hover:scale-110 active:scale-95 transition-all z-40 border border-white/20 animate-bounce"
        title="Page Developer Agent (AI)"
      >
        <Sparkles size={18} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#0D0D0D] border-2 border-[#FF6D00]/30 rounded-[2.5rem] w-full max-w-4xl h-[90dvh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(255,109,0,0.25)]">
        
        {/* Header bar */}
        <header className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu size={18} className="text-[#FF6D00]" />
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                {section.toUpperCase()} AI UPDATE COMPASS
              </h3>
              <p className="text-[9px] text-[#FF8A65] font-extrabold uppercase tracking-wide">
                Live App Developer Room
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsOpen(false);
              setUnlocked(false);
              setPasscode('');
              setErrorMsg('');
            }} 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-[#FF6D00] transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {/* LOCKED SCREEN */}
        {!unlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#FF6D00] to-amber-500 rounded-2xl flex items-center justify-center text-black mb-5 shadow-[0_0_15px_rgba(255,109,0,0.3)]">
              <Lock size={20} />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
              Protected Developer Portal
            </h4>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-4">
              Enter passcode to unlock live updates
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-3">
              <input 
                type="password" 
                placeholder="Developer PIN"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-[#FF6D00] outline-none tracking-widest font-bold font-mono"
              />
              {errorMsg && <p className="text-rose-500 text-[10px] font-bold uppercase">{errorMsg}</p>}
              
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                Unlock Operations
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED CONTROLS SPLIT SCREEN */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* LEFT HALF: LIVE UPDATE & SCHEMAS */}
            <div className="flex-1 p-5 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase text-[#FF6D00] tracking-widest">
                    Live Data Drafting Lab
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Auto-Target Collection
                    </label>
                    <select
                      value={selectedCollection}
                      onChange={(e) => {
                        setSelectedCollection(e.target.value);
                        setGeneratedPayload(null);
                        setGeneratorPrompt('');
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6D00] outline-none font-bold"
                    >
                      {Object.entries(collectionNames).map(([id, label]) => (
                        <option key={id} value={id} className="bg-[#121212] text-white">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Preferred Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6D00] outline-none font-bold"
                    >
                      {['Hindi & Hinglish', 'Hindi only', 'English only', 'Multi-lingual'].map((lang, idx) => (
                        <option key={idx} value={lang} className="bg-[#121212] text-white">
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                    Select Topic Preset for {section} Page
                  </label>
                  <div className="flex flex-col gap-1.5 p-2 bg-black/40 rounded-xl border border-white/5 max-h-32 overflow-y-auto">
                    {(presetsByCollection[selectedCollection] || presetsByCollection['knowledge']).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGeneratorPrompt(preset)}
                        className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1 rounded-lg text-[10px] text-gray-300 hover:text-white transition-all font-semibold"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                    Describe item to live import, delete, or update (Hindi or English)
                  </label>
                  <textarea
                    value={generatorPrompt}
                    onChange={(e) => setGeneratorPrompt(e.target.value)}
                    placeholder={`Describe the update. E.g. "Add details regarding Ratri Bhojan sacrifice rules to ${section} section..."`}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#FF6D00] outline-none transition-all placeholder-gray-600 font-semibold"
                  />
                </div>

                <button
                  onClick={generateAiContent}
                  disabled={isGenerating || !generatorPrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-[#FF6D00] to-amber-500 hover:from-amber-500 hover:to-[#FF6D00] text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition-all disabled:opacity-40"
                >
                  {isGenerating ? 'AI Structuring Database Content...' : 'Draft Dynamic Database Content'}
                </button>
              </div>

              {/* Payload Live preview */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-1">
                    <FileCode size={10} /> Live JSON Schema
                  </span>
                  {generatedPayload && (
                    <button 
                      onClick={() => setGeneratedPayload(null)}
                      className="text-[8px] uppercase tracking-widest text-[#FF8A65] font-black"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="bg-black/80 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-emerald-400 max-h-28 overflow-y-auto">
                  {generatedPayload ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(generatedPayload, null, 2)}</pre>
                  ) : (
                    <span className="text-gray-600 italic">No drafted content. Describe what to write above then click Draft.</span>
                  )}
                </div>

                {writeSuccess && (
                  <p className="mt-2 text-green-400 text-[9px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 size={10} /> Dynamic entry successfully pushed live! Real-time render active.
                  </p>
                )}
                {writeError && (
                  <p className="mt-2 text-amber-500 text-[9px] font-bold uppercase flex items-center gap-1">
                    <AlertTriangle size={10} /> {writeError}
                  </p>
                )}

                <button
                  onClick={saveGeneratedPayloadToDb}
                  disabled={!generatedPayload || isSavingToDb}
                  className="w-full mt-2.5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all disabled:opacity-20 flex items-center justify-center gap-1.5"
                >
                  <Database size={12} /> Live Push to Firestore DB
                </button>
              </div>
            </div>

            {/* RIGHT HALF: CHAT LOGS AND AUTONOMOUS TERMINAL */}
            <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden bg-black/30">
              
              {/* Console logs */}
              <div className="h-28 bg-black p-3 rounded-2xl font-mono text-[8px] text-gray-500 overflow-y-auto space-y-0.5 border border-white/5">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-1.5">
                    <span className="text-[#FF6D00] shrink-0">&gt;</span>
                    <span className={log.includes('[SUCCESS]') || log.includes('[DATABASE]') ? 'text-green-400' : log.includes('[ERROR]') ? 'text-amber-500' : 'text-gray-400'}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Show selected file banner if uploaded */}
              {uploadedFile && (
                <div className="mt-2.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    {uploadedFileMime.includes('image') ? (
                      <ImageIcon className="text-[#FF6D00]" size={14} />
                    ) : uploadedFileMime.includes('pdf') ? (
                      <FileText className="text-rose-400" size={14} />
                    ) : uploadedFileMime.includes('audio') ? (
                      <Music className="text-blue-400" size={14} />
                    ) : uploadedFileMime.includes('video') ? (
                      <Video className="text-amber-400" size={14} />
                    ) : (
                      <FileCode className="text-emerald-400" size={14} />
                    )}
                    <span className="font-semibold truncate max-w-xs">{uploadedFileName}</span>
                    <span className="text-[10px] text-gray-500 font-bold tracking-widest bg-white/5 px-1.5 py-0.5 rounded uppercase">{uploadedFileMime.split('/')[1] || 'DOC'}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedFileName('');
                      setUploadedFileMime('');
                    }} 
                    className="text-gray-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Chat panel */}
              <div className="flex-1 my-3 overflow-y-auto space-y-3.5 pr-1 max-h-[160px] lg:max-h-none">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-xl max-w-xs text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-[#FF6D00] text-black font-semibold rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'}`}>
                      {m.file && (
                        <div className="mb-2 flex items-center gap-1 text-[10px] bg-black/30 p-1.5 rounded-lg border border-white/5">
                          {m.file.mime.includes('image') ? (
                            <img src={m.file.url} alt="attached_screenshot" className="max-h-24 rounded object-contain" />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {m.file.mime.includes('pdf') ? (
                                <FileText className="text-rose-400" size={12} />
                              ) : m.file.mime.includes('audio') ? (
                                <Music className="text-blue-400" size={12} />
                              ) : m.file.mime.includes('video') ? (
                                <Video className="text-amber-400" size={12} />
                              ) : (
                                <FileCode className="text-emerald-400" size={12} />
                              )}
                              <span className="font-bold truncate max-w-[120px]">{m.file.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="p-2.5 rounded-xl bg-white/5 text-[#FF8A65] text-[10px] font-bold uppercase tracking-wider duration-75 flex items-center gap-1.5">
                    <RefreshCw size={11} className="animate-spin" /> Processing natural language...
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendPrompt} className="flex gap-2 items-center bg-black/60 p-2 rounded-xl border border-white/5">
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*,application/pdf,text/*,audio/*,video/*" 
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center transition-all disabled:opacity-50"
                  title="Upload scripture page, PDF, or media clip"
                >
                  <Camera size={15} />
                </button>

                <input 
                  type="text" 
                  placeholder="Ask agent to add/make dynamic updates..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isProcessing}
                  className="flex-1 bg-white/5 border border-white/5 rounded-lg px-2.5 py-2 text-[11px] text-gray-200 placeholder-gray-600 outline-none focus:border-[#FF6D00] font-semibold"
                />
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#FF6D00] to-amber-500 hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all disabled:opacity-50 shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
