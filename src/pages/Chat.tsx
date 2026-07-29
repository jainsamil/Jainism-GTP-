import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { 
  Send, Sparkles, Loader2, Mic, Image as ImageIcon, Volume2, VolumeX, 
  Brain, Search, BookOpen, X, Plus, Camera, File, Lightbulb, Telescope, 
  Globe, ArrowLeft, FileText, Menu, Trash2, MessageSquare, PlusCircle, 
  LogOut, ShieldAlert, User, ShieldCheck, Languages, Compass, Music,
  Cpu, RefreshCw, Zap, CheckCircle2, Sliders, Activity, Eye, ClipboardCheck, Radio, Wifi,
  Edit, Check, Copy, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../firebase';
import { 
  collection, query, where, getDocs, doc, setDoc, 
  deleteDoc, onSnapshot, orderBy 
} from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

export default function ChatPage() {
  const { user, login, loginAsDemo, logout, error: authError, setError: setAuthError } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = location.state?.initialPrompt;

  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSmartTools, setShowSmartTools] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ data: string, mimeType: string, url?: string, name: string, isImage: boolean } | null>(null);
  const [activeContext, setActiveContext] = useState<'think' | 'research' | 'study' | 'web' | 'sutra' | 'muhurat' | 'chanting' | 'anekantavada' | 'verification' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Multi-select and chat deletion states
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());
  const [showClearChatModal, setShowClearChatModal] = useState(false);

  const toggleSelectMode = () => {
    setIsSelectMode((prev) => !prev);
    setSelectedMessageIds(new Set());
  };

  const toggleMessageSelection = (msgId: string) => {
    setSelectedMessageIds((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) {
        next.delete(msgId);
      } else {
        next.add(msgId);
      }
      return next;
    });
  };

  const handleSelectAllMessages = () => {
    if (selectedMessageIds.size === messages.length) {
      setSelectedMessageIds(new Set());
    } else {
      setSelectedMessageIds(new Set(messages.map(m => m.id)));
    }
  };

  const handleDeleteSelectedMessages = async () => {
    if (selectedMessageIds.size === 0) return;
    const updated = messages.filter(msg => !selectedMessageIds.has(msg.id));
    setMessages(updated);
    setSelectedMessageIds(new Set());
    setIsSelectMode(false);
    if (currentSessionId) {
      await saveSessionToFirestore(currentSessionId, updated);
    }
  };

  const handleClearCurrentChat = async () => {
    setMessages([]);
    setIsSelectMode(false);
    setSelectedMessageIds(new Set());
    setShowClearChatModal(false);
    if (currentSessionId) {
      await saveSessionToFirestore(currentSessionId, []);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  // New Jainism GPT Live Mode Voice-to-Voice States
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveState, setLiveState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [liveUserText, setLiveUserText] = useState('');
  const [liveModelText, setLiveModelText] = useState('');
  const [liveError, setLiveError] = useState('');

  const liveRecognitionRef = useRef<any>(null);
  const liveUtteranceRef = useRef<any>(null);

  // New High-Level System Controls (Locked dynamically to the latest upgrade model)
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-flash-latest' | 'gemini-3.1-pro-preview'>('gemini-flash-latest');
  const [toolsTab, setToolsTab] = useState<'modes' | 'dhyana'>('modes');
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out' | null>(null);
  const [breathTimer, setBreathTimer] = useState<number>(0);
  const [latencyStatus, setLatencyStatus] = useState<string>('Connected');

  // Breathing loop effect for dynamic Pranayama (Breath Timer)
  useEffect(() => {
    let interval: any;
    if (breathPhase) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Cycle phases: 4s IN, 4s HOLD, 4s OUT
            if (breathPhase === 'in') {
              setBreathPhase('hold');
              return 4;
            } else if (breathPhase === 'hold') {
              setBreathPhase('out');
              return 4;
            } else {
              setBreathPhase('in');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(0);
    }
    return () => clearInterval(interval);
  }, [breathPhase]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<any>(null);

  // Synthesizes a beautiful traditional brass temple gong sound using Web Audio API
  const playTempleGong = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      // Beautiful layered brass frequency cluster
      const frequencies = [293.66, 440.00, 587.33, 659.25]; // D4, A4, D5, E5
      const gains = [0.4, 0.2, 0.15, 0.1];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gainNode.gain.setValueAtTime(gains[idx], now);
        // Exponential decay for metal sustain finish
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.error("Audio context sound failed:", e);
    }
  };

  // Subscribe to user chats from Firestore
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('guest_sessions');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSessions(parsed);
        } catch (e) {
          console.error(e);
        }
      } else {
        setSessions([]);
      }
      setMessages([]);
      setCurrentSessionId(null);
      return;
    }

    const q = query(
      collection(db, 'user_chats'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parsedSessions = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: d.id,
          title: d.title,
          messages: d.messages || [],
          updatedAt: d.updatedAt || Date.now()
        } as ChatSession;
      });

      // Sort in-memory to bypass composite index constraints
      parsedSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      setSessions(parsedSessions);
    }, (err) => {
      console.error("Error reading private chats:", err);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle saving of active session to Firestore
  const saveSessionToFirestore = async (activeSessionId: string, msgs: Message[]) => {
    // Save empty sequence permitted on deletions
    if (!user) {
      try {
        const stored = localStorage.getItem('guest_sessions');
        let parsed: ChatSession[] = [];
        if (stored) {
          try {
            parsed = JSON.parse(stored);
          } catch (e) {
            parsed = [];
          }
        }
        const existingIdx = parsed.findIndex(s => s.id === activeSessionId);
        const firstUserMsg = msgs.find(m => m.role === 'user')?.text || 'New Chat';
        const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? '...' : '');
        
        const updatedSession = {
          id: activeSessionId,
          title,
          messages: msgs,
          updatedAt: Date.now()
        };

        if (existingIdx > -1) {
          parsed[existingIdx] = updatedSession;
        } else {
          parsed.unshift(updatedSession);
        }
        localStorage.setItem('guest_sessions', JSON.stringify(parsed));
        setSessions([...parsed]);
      } catch (e) {
        console.error("Error saving guest session:", e);
      }
      return;
    }

    try {
      const isNew = !sessions.some(s => s.id === activeSessionId);
      const firstUserMsg = msgs.find(m => m.role === 'user')?.text || 'New Chat';
      const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? '...' : '');
      
      const sessionRef = doc(db, 'user_chats', activeSessionId);
      await setDoc(sessionRef, {
        id: activeSessionId,
        userId: user.uid,
        title,
        messages: msgs,
        updatedAt: Date.now()
      }, { merge: true });
    } catch (e) {
      console.error("Error writing to Firestore:", e);
    }
  };

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowSidebar(false);
    chatRef.current = null;
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditValue(msg.text);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editValue.trim()) return;
    const updated = messages.map(msg => msg.id === msgId ? { ...msg, text: editValue } : msg);
    setMessages(updated);
    setEditingMessageId(null);
    if (currentSessionId) {
      await saveSessionToFirestore(currentSessionId, updated);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    const updated = messages.filter(msg => msg.id !== msgId);
    setMessages(updated);
    if (currentSessionId) {
      await saveSessionToFirestore(currentSessionId, updated);
    }
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setShowSidebar(false);
    chatRef.current = null;
  };

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) {
      try {
        const stored = localStorage.getItem('guest_sessions');
        if (stored) {
          const parsed: ChatSession[] = JSON.parse(stored);
          const filtered = parsed.filter(s => s.id !== id);
          localStorage.setItem('guest_sessions', JSON.stringify(filtered));
          setSessions(filtered);
          if (currentSessionId === id) {
            createNewChat();
          }
        }
      } catch (err) {
        console.error("Error deleting guest session:", err);
      }
      return;
    }

    try {
      await deleteDoc(doc(db, 'user_chats', id));
      if (currentSessionId === id) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleDeleteAccountChats = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      // Delete all private user chats
      const q = query(collection(db, 'user_chats'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Delete user settings doc if exists
      await deleteDoc(doc(db, 'users', user.uid));

      addToast("Your Jainism GPT Chat Account and entire History has been permanently deleted.");
      logout();
    } catch (err) {
      console.error("Error purging account:", err);
      alert("Error deleting account.");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const addToast = (msg: string) => {
    alert(msg); // Elegant default dialog constraint
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedFile({
        data: base64String,
        mimeType: file.type,
        url: isImage ? URL.createObjectURL(file) : undefined,
        name: file.name,
        isImage
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setShowSmartTools(false);
  };

  const setContext = (ctx: 'think' | 'research' | 'study' | 'web' | 'sutra' | 'muhurat' | 'chanting' | 'anekantavada' | 'verification' | null) => {
    setActiveContext(ctx);
    setShowSmartTools(false);
    if (ctx === 'chanting') {
      playTempleGong();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError('');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? prev + ' ' + transcript : transcript);
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setSpeechError('Microphone access denied. Please enable it in your browser settings.');
      } else {
        setSpeechError('Error with speech recognition. Please try again.');
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleListen = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start speech recognition for Live Mode
  const startLiveListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLiveError('Voice recognition is not supported in this browser.');
      setLiveState('idle');
      return;
    }

    try {
      if (liveRecognitionRef.current) {
        liveRecognitionRef.current.abort();
      }

      const rec = new SpeechRecognition();
      // Auto-detect dialect of Indian users (mix of Hindi & English)
      rec.lang = 'hi-IN'; 
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setLiveState('listening');
        setLiveError('');
      };

      rec.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript && transcript.trim()) {
          setLiveUserText(transcript);
          await handleLiveReply(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Live Recognition Error:", event);
        if (event.error === 'no-speech') {
          // Restart listening after a brief moment if silent
          setTimeout(() => {
            if (isLiveMode && liveState === 'listening') {
              startLiveListening();
            }
          }, 600);
        } else if (event.error === 'not-allowed') {
          setLiveError('Microphone or speech permission was denied.');
          setLiveState('idle');
        } else {
          // Recover gracefully
          setTimeout(() => {
            if (isLiveMode) startLiveListening();
          }, 1000);
        }
      };

      rec.onend = () => {
        // If we transitioned to thinking or speaking, don't restart immediately.
        // Otherwise (idle/silence), keep listening!
        if (isLiveMode && liveState === 'listening') {
          startLiveListening();
        }
      };

      liveRecognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  // Process Jainism GPT Live responses
  const handleLiveReply = async (userText: string) => {
    if (liveRecognitionRef.current) {
      try {
        liveRecognitionRef.current.abort();
      } catch (e) {}
    }

    try {
      setLiveState('thinking');
      setLiveModelText('');

      const history = messages.filter(m => m.id !== 'welcome').map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const newParts: any[] = [];
      const fileToSend = selectedFile;
      if (fileToSend) {
        newParts.push({
          inlineData: {
            data: fileToSend.data,
            mimeType: fileToSend.mimeType
          }
        });
        // Clear file upload so it is only sent once
        setSelectedFile(null);
      }
      newParts.push({ text: userText });

      const contents = [
        ...history,
        { role: 'user', parts: newParts }
      ];

      // Request short, spoken Jainism GPT response
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: 'You are Jainism GPT, a wise, compassionate, and extremely gentle spiritual guide on Jainism. You are in a live, real-time voice conversation session. If the user presents or uploads any image/video/relic, analyze it deeply and explain its relevance to Jainism, its spiritual meaning, or history, but keep your spoken voice responses brief, sweet, and concise (maximum 2-3 short sentences). Never mention that you are an AI, Gemini, Google, or a language model. You are strictly Jainism GPT. Speak to the user like a kind, warm companion. If they speak Hindi, respond in sweet Hindi. If English, respond in English. Always maintain a divine, peaceful, and respectful atmosphere with "Jai Jinendra".',
        }
      });

      const modelReply = response.text || "I apologize, could you repeat that please?";
      setLiveModelText(modelReply);

      // Now save the live interaction straight to the chat lists so it registers as part of their chat session!
      const activeSessionId = currentSessionId || Date.now().toString();
      if (!currentSessionId) {
        setCurrentSessionId(activeSessionId);
      }

      const uTextWithFile = fileToSend ? `[Uploaded ${fileToSend.name}] ${userText}` : userText;
      const uMsg: Message = { id: Date.now().toString(), role: 'user', text: uTextWithFile };
      const mMsg: Message = { id: (Date.now()+1).toString(), role: 'model', text: modelReply };
      const updatedList = [...messages, uMsg, mMsg];
      setMessages(updatedList);
      saveSessionToFirestore(activeSessionId, updatedList);

      // Transition to speaking and activate browser speech Synthesis
      speakLiveText(modelReply);
    } catch (err) {
      console.error("Live API Error:", err);
      setLiveState('idle');
      setLiveError('Live voice chat is currently on local fallback. "Jai Jinendra! Peace, non-violence, and self-restraint lead to ultimate liberation." Please try again shortly.');
    }
  };

  // Speech synthesizer for Live Mode
  const speakLiveText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setLiveState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    setLiveState('speaking');

    // Clean up text of markdown markers (like asterisks, hashtags etc.) for smoother pronunciation
    const cleanText = text.replace(/[\*#_`~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose voice: prefer sweet or Indian styled English/Hindi speakers if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find a nice Hindi-India/English-India speech voice
    const indVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi')) || voices.find(v => v.lang.includes('hi'));
    if (indVoice) {
      utterance.voice = indVoice;
    }
    utterance.lang = text.match(/[\u0900-\u097F]/) ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // slightly slower for a sweet, graceful guidance pace

    utterance.onend = () => {
      // Finished speaking! Immediately resume listening to enable hands-free dynamic convo loop
      if (isLiveMode) {
        setLiveState('listening');
        startLiveListening();
      }
    };

    utterance.onerror = (e: any) => {
      console.error("Speech Synthesis Error:", e);
      if (isLiveMode) {
        setLiveState('listening');
        startLiveListening();
      }
    };

    liveUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Exit Live Mode Cleanups
  const exitLiveMode = () => {
    setIsLiveMode(false);
    setLiveState('idle');
    setLiveUserText('');
    setLiveModelText('');
    setLiveError('');

    if (liveRecognitionRef.current) {
      try {
        liveRecognitionRef.current.abort();
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Trigger Live Listening loop on Mount/Toggle
  useEffect(() => {
    if (isLiveMode) {
      setLiveState('listening');
      const t = setTimeout(() => {
        startLiveListening();
      }, 500);
      return () => {
        clearTimeout(t);
        if (liveRecognitionRef.current) {
          try {
            liveRecognitionRef.current.abort();
          } catch (e) {}
        }
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [isLiveMode]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if ((!textToSend && !selectedFile) || isLoading) return;

    if (!textOverride) setInput('');
    const fileToSend = selectedFile;
    const contextToSend = activeContext;
    setSelectedFile(null);
    setActiveContext(null);
    setShowSmartTools(false);
    
    const userMsgId = Date.now().toString();
    const newUserMsg: Message = { id: userMsgId, role: 'user', text: textToSend || `Uploaded ${fileToSend?.name}` };
    const updatedMsgs = [...messages, newUserMsg];
    setMessages(updatedMsgs);
    setIsLoading(true);

    const activeSessionId = currentSessionId || Date.now().toString();
    if (!currentSessionId) {
      setCurrentSessionId(activeSessionId);
    }

    try {
      const modelMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      const history = messages.filter(m => m.id !== 'welcome').map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const newParts: any[] = [];
      if (fileToSend) {
        newParts.push({
          inlineData: {
            data: fileToSend.data,
            mimeType: fileToSend.mimeType
          }
        });
      }

      let finalPrompt = textToSend || 'Analyze this.';
      if (contextToSend === 'think') finalPrompt = `[Context: Please think deeply and provide an advanced philosophical reasoning with high-level references] ${finalPrompt}`;
      if (contextToSend === 'research') finalPrompt = `[Context: Provide precise traditional historical context and direct scriptural references from historical Jain Agamas] ${finalPrompt}`;
      if (contextToSend === 'study') finalPrompt = `[Context: Explain this moral concept or question step-by-step like a divine Pathshala lesson designed for a clear understanding, breaking it down cleanly with sub-headings] ${finalPrompt}`;
      if (contextToSend === 'sutra') finalPrompt = `[Context: Decode and translate ancient Sanskrit or Prakrit scriptures, verses, or mantras. Provide word-by-word meaning, pronunciation, elegant Hindi and English translations, and spiritual significance] ${finalPrompt}`;
      if (contextToSend === 'muhurat') finalPrompt = `[Context: Provide authentic advice on tithi calculations, historical fasting schedules, Pachkhan rules, and daily spiritually uplifting ritual steps from Jain scriptures] ${finalPrompt}`;
      if (contextToSend === 'chanting') finalPrompt = `[Context: Spiritual chanting assistance. Provide chanting guides, benefits of the specified mantra, proper pronunciation, and recommendations on chanting count and speed] ${finalPrompt}`;
      if (contextToSend === 'anekantavada') finalPrompt = `[Context: Analyze this metaphysical/spiritual question using the supreme Jain theory of Anekantavada & Syadvada. Dissect it with multiple Canonical standpoints (Nayas), specifically: 1. Dravyarthika Naya (Substantive standpoint), 2. Paryayarthika Naya (Modal standpoint), and other relevant linguistic/logical perspectives, highlighting the synthesis of contradictions] ${finalPrompt}`;
      if (contextToSend === 'verification') finalPrompt = `[Context: Strictly verify and cross-reference this spiritual doubt or practice against standard authentic Jain canonical texts/Agamas (Siddhant Shastra). Quote exact verses, sutras, or gathas if possible (under standard Digambaras/Shvetambaras traditions) with their original sources and structural cross-checks as references] ${finalPrompt}`;

      newParts.push({ text: finalPrompt });

      const contents = [...history, { role: 'user', parts: newParts }];

      const config: any = {
        systemInstruction: 'You are a knowledgeable, respectful, and insightful expert on Jainism. You provide accurate information about Jain philosophy, history, Tirthankaras, Agamas, ethics (Ahimsa, Anekantavada, Aparigraha), and practices. Answer questions clearly, compassionately, and objectively. Start your first response with "Jai Jinendra!" if appropriate.',
      };

      if (contextToSend === 'web') {
        config.tools = [{ googleSearch: {} }];
      }

      const responseStream = await ai.models.generateContentStream({
        model: selectedModel,
        contents,
        config
      });
      
      let fullResponse = '';
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        fullResponse += c.text;
        setMessages((prev) => {
          const loadedMsgs = prev.map((msg) =>
            msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
          );
          // Persist incremental generated content to Firestore
          saveSessionToFirestore(activeSessionId, loadedMsgs);
          return loadedMsgs;
        });
      }
      playTempleGong();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          role: 'model', 
          text: `Jai Jinendra! 🙏 It seems our live AI cloud is currently experiencing extremely high demand (Quota limit reached). Let me share a beautiful local reflection with you:

**'अहिंसा परमो धर्मः'** (Non-violence is the supreme religion) and **'परस्परोपग्रहो जीवानाम्'** (All life is bound together by mutual support) form the heart of Jain wisdom. Every soul has the potential to realize supreme consciousness. 

Please feel free to explore our sacred Aagams, Panchang, and Swadhyay commentary pages directly while the AI recovers!` 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, selectedFile, activeContext, messages, currentSessionId, selectedModel]);

  useEffect(() => {
    chatRef.current = ai.chats.create({
      model: selectedModel,
      config: {
        systemInstruction: 'You are a knowledgeable, respectful, and insightful expert on Jainism. You provide accurate information about Jain philosophy, history, Tirthankaras, Agamas, ethics (Ahimsa, Anekantavada, Aparigraha), and practices. Answer questions clearly, compassionately, and objectively. Start your first response with "Jai Jinendra!" if appropriate.',
      },
    });
  }, [selectedModel]);

  useEffect(() => {
    if (initialPrompt && !isLoading && messages.length === 0) {
      handleSend(initialPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [initialPrompt, handleSend, isLoading, messages.length, navigate, location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent p-6 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-3 bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/10 rounded-full text-gray-800 dark:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-gray-200 dark:border-white/10 w-full max-w-lg text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(255,109,0,0.05)_0%,transparent_65%) pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_40px_rgba(255,109,0,0.4)] border border-white/20 animate-bounce">
              <Sparkles size={44} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            </div>
            
            <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] mb-4 uppercase tracking-tighter">JAINISM GPT CHAT</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6 text-sm leading-relaxed font-semibold">
              Please authenticate via your Google Account to access secure spiritual guidance and save your private chat history.
            </p>

            {authError && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold text-left space-y-2">
                <p className="font-black flex items-center gap-1.5 uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>Authentication Notice</span>
                </p>
                <p className="leading-relaxed font-semibold text-gray-600 dark:text-gray-300">
                  {authError.includes('unauthorized-domain') 
                    ? `This domain (${window.location.hostname}) is not whitelisted in your Firebase console. To log in with Google, add this domain under Authentication > Settings > Authorized Domains. Alternately, use the Pathshala module's custom Username/Password registration.`
                    : authError}
                </p>
                <button
                  onClick={() => {
                    setAuthError(null);
                    navigate('/pathshala');
                  }}
                  className="w-full mt-1.5 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer text-center"
                >
                  Go to Pathshala & Custom Auth
                </button>
              </div>
            )}
            
            <button
              onClick={login}
              className="w-full py-4 bg-gray-100 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-100 text-gray-900 dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent relative text-gray-900 dark:text-gray-200 overflow-hidden">
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "absolute top-0 left-0 h-full w-72 bg-gradient-to-b from-white to-gray-50 dark:from-[#0d0a07] dark:to-[#17110d] border-r border-gray-200 dark:border-orange-950/20 z-50 transform transition-transform duration-300 flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.08)] dark:shadow-[10px_0_40px_rgba(0,0,0,0.9)]",
        showSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-gray-150/80 dark:border-orange-950/20 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2.5 uppercase tracking-wider">
            <MessageSquare size={20} className="text-[#FF5722] animate-pulse" />
            <span>Chat History</span>
          </h2>
          <button 
            onClick={() => setShowSidebar(false)} 
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#FF5722] via-[#FF3D00] to-[#FF8A65] text-white hover:brightness-110 hover:shadow-[0_4px_20px_rgba(255,87,34,0.3)] active:scale-[0.98] transition-all shadow-md rounded-2xl font-black text-[11px] uppercase tracking-widest cursor-pointer border border-[#FF9100]/30 h-12"
          >
            <Plus size={16} className="stroke-[3px]" />
            New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500 space-y-2">
              <MessageSquare size={32} className="opacity-20 animate-bounce" />
              <p className="text-xs font-bold uppercase tracking-wider">No saved chats</p>
            </div>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => loadSession(session)}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all group border",
                  currentSessionId === session.id 
                    ? "bg-[#FF5722]/10 dark:bg-[#FF5722]/15 border-[#FF5722]/30 shadow-sm" 
                    : "bg-white/45 dark:bg-[#1A1310]/30 hover:bg-white/85 dark:hover:bg-[#1A1310]/80 border-gray-150/40 dark:border-white/5"
                )}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className={cn(
                    "text-xs truncate font-black",
                    currentSessionId === session.id ? "text-[#FF5722] dark:text-[#FF8A65]" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}>
                    {session.title}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40" />
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* User Account Section inside sidebar */}
        <div className="p-4 border-t border-gray-150 dark:border-orange-950/20 bg-gray-50/80 dark:bg-[#100b08]/80 space-y-4">
          <div className="flex items-center gap-3 p-2 bg-white dark:bg-white/5 rounded-2xl border border-gray-150/40 dark:border-white/5">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-[#FF5722] shadow-sm shrink-0" />
            ) : (
              <img src="https://i.ibb.co/Myg19RW6/1000539584.jpg" alt="Samil Jain" className="w-10 h-10 rounded-full border-2 border-[#FF5722] object-cover shadow-sm shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-900 dark:text-white truncate">{user?.displayName || 'Samil Jain'}</p>
              <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                <ShieldCheck size={9} /> 
                <span>{user ? 'Private ID' : 'Guest Mode'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {user ? (
              <>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-200/50 dark:border-white/5 cursor-pointer active:scale-95 shrink-0"
                >
                  <LogOut size={12} /> Logout
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Trash2 size={12} /> Clear Account
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  localStorage.removeItem('guest_sessions');
                  setSessions([]);
                  setMessages([]);
                  setCurrentSessionId(null);
                }}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Trash2 size={12} /> Clear Guest History
              </button>
            )}
          </div>
        </div>
      </div>

      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="text-gray-500 hover:text-[#FF6D00] dark:text-gray-400 dark:hover:text-[#FF6D00] transition-colors drop-shadow-[0_0_5px_rgba(255,109,0,0.5)] cursor-pointer">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg sm:text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">JAINISM GPT</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <button
                onClick={toggleSelectMode}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border",
                  isSelectMode 
                    ? "bg-[#FF6D00] text-white border-[#FF6D00] shadow-sm" 
                    : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#FF6D00]"
                )}
                title={language === 'hi' ? 'संदेश चुनें' : 'Select messages'}
              >
                <CheckSquare size={14} />
                <span className="hidden sm:inline">{isSelectMode ? (language === 'hi' ? 'रद्द' : 'Cancel') : (language === 'hi' ? 'चुनें' : 'Select')}</span>
              </button>

              <button
                onClick={() => setShowClearChatModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-black transition-all cursor-pointer"
                title={language === 'hi' ? 'पूरी बातचीत साफ़ करें' : 'Clear Chat History'}
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">{language === 'hi' ? 'साफ़ करें' : 'Clear'}</span>
              </button>
            </>
          )}

          {/* Glowing Live Convo Trigger */}
          <button
            onClick={() => setIsLiveMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_0_15px_rgba(255,109,0,0.4)] animate-pulse cursor-pointer shrink-0"
            title="Start Live Voice Interaction"
          >
            <Radio size={14} className="text-white animate-bounce" />
            <span className="hidden xs:inline">Live</span>
          </button>

          <button onClick={() => setShowSidebar(true)} className="text-gray-550 hover:text-[#FF6D00] dark:text-gray-400 dark:hover:text-[#FF6D00] transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Multi-Select Action Banner */}
      {isSelectMode && messages.length > 0 && (
        <div className="shrink-0 bg-gradient-to-r from-[#FF6D00]/15 via-orange-500/10 to-[#FF8A65]/15 border-b border-[#FF6D00]/30 px-4 py-2.5 flex items-center justify-between backdrop-blur-md z-10 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAllMessages}
              className="flex items-center gap-1.5 text-xs font-black text-[#FF6D00] dark:text-[#FF8A65] hover:underline cursor-pointer"
            >
              <CheckSquare size={16} />
              <span>
                {selectedMessageIds.size === messages.length 
                  ? (language === 'hi' ? 'सभी अन-चुनें' : 'Deselect All') 
                  : (language === 'hi' ? 'सब चुनें' : 'Select All')}
              </span>
            </button>
            <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
              ({selectedMessageIds.size} {language === 'hi' ? 'चुने गए' : 'selected'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteSelectedMessages}
              disabled={selectedMessageIds.size === 0}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Trash2 size={13} />
              <span>{language === 'hi' ? `हटाएं (${selectedMessageIds.size})` : `Delete (${selectedMessageIds.size})`}</span>
            </button>
            <button
              onClick={toggleSelectMode}
              className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-black rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-all cursor-pointer"
            >
              {language === 'hi' ? 'रद्द' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-y-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,109,0,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white dark:bg-[#121212] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,109,0,0.1)] dark:shadow-[0_0_30px_rgba(255,109,0,0.2)] border border-[#FF6D00]/20 relative group shrink-0">
            <div className="absolute inset-0 bg-[#FF6D00] rounded-full blur-xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative z-10 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,109,0,0.4)] dark:shadow-[0_0_30px_rgba(255,109,0,0.8)] border-2 border-white/50 dark:border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={36} className="text-white dark:text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Jainism <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] drop-shadow-[0_0_15px_rgba(255,109,0,0.4)] dark:drop-shadow-[0_0_15px_rgba(255,109,0,0.8)]">GPT</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold tracking-wide uppercase mb-8">
            Speak to the Autonomous Wisdom Guide
          </p>

          {/* Quick Prompts Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full px-2">
            <button
              onClick={() => handleSend("What is the philosophy of Ahimsa (अहिंसा) in Jainism?")}
              className="group p-4 bg-white/40 dark:bg-[#121212]/40 hover:bg-[#FF6D00]/5 hover:border-[#FF5722]/30 border border-gray-200 dark:border-white/5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm duration-300 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF6D00]/10 flex items-center justify-center text-[#FF6D00] mb-3 group-hover:bg-[#FF6D00]/20 transition-colors">
                <BookOpen size={16} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-[#FF5722] transition-colors uppercase tracking-wider">Ahimsa (अहिंसा) Philosophy</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">Learn about the supreme vow of complete non-violence in mind, speech, and action.</p>
            </button>

            <button
              onClick={() => handleSend("Explain the Navkar Mantra word-by-word meaning and significance.")}
              className="group p-4 bg-white/40 dark:bg-[#121212]/40 hover:bg-[#FF6D00]/5 hover:border-[#FF5722]/30 border border-gray-200 dark:border-white/5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm duration-300 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FFD54F]/10 flex items-center justify-center text-[#FFA000] mb-3 group-hover:bg-[#FFD54F]/20 transition-colors">
                <Compass size={16} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-[#FF5722] transition-colors uppercase tracking-wider">Decode Navkar Mantra</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">Understand the universal salutation to the five supreme spiritual energies (Panch Parmesthi).</p>
            </button>

            <button
              onClick={() => handleSend("What is the concept of Karma (कर्म) according to Jain scriptures?")}
              className="group p-4 bg-white/40 dark:bg-[#121212]/40 hover:bg-[#FF6D00]/5 hover:border-[#FF5722]/30 border border-gray-200 dark:border-white/5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm duration-300 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FF8A65]/10 flex items-center justify-center text-[#FF5722] mb-3 group-hover:bg-[#FF8A65]/20 transition-colors">
                <Zap size={16} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-[#FF5722] transition-colors uppercase tracking-wider">Karma (कर्म) Science</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">Explore how karmic particles attract to the soul and how to purge them (Nirjara).</p>
            </button>

            <button
              onClick={() => handleSend("Explain Anekantavada (अनेकांतवाद) and Syadvada with real life examples.")}
              className="group p-4 bg-white/40 dark:bg-[#121212]/40 hover:bg-[#FF6D00]/5 hover:border-[#FF5722]/30 border border-gray-200 dark:border-white/5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm duration-300 backdrop-blur-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3 group-hover:bg-teal-500/20 transition-colors">
                <Brain size={16} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-[#FF5722] transition-colors uppercase tracking-wider">Anekantavada Theory</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">Dive into the deep doctrine of non-one-sidedness and multi-dimensional reality.</p>
            </button>
          </div>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto p-4 space-y-6 overscroll-contain">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                if (isSelectMode) toggleMessageSelection(msg.id);
              }}
              className={cn(
                "flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] transition-all",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto flex-row",
                isSelectMode && "cursor-pointer hover:opacity-90"
              )}
            >
              {/* Checkbox in select mode */}
              {isSelectMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMessageSelection(msg.id);
                  }}
                  className="mt-2.5 p-1 rounded-full text-gray-400 hover:text-[#FF6D00] transition-colors cursor-pointer shrink-0"
                >
                  {selectedMessageIds.has(msg.id) ? (
                    <CheckCircle2 size={22} className="text-[#FF6D00] fill-[#FF6D00]/20" />
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full border-2 border-gray-400 dark:border-gray-500 hover:border-[#FF6D00]" />
                  )}
                </button>
              )}

              <div
                className={cn(
                  "flex flex-col flex-1 min-w-0",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}
              >
                {editingMessageId === msg.id ? (
                  <div className="w-full min-w-[280px] sm:min-w-[400px] bg-white dark:bg-[#121212]/90 border border-[#FF8A65] rounded-3xl p-3.5 shadow-lg flex flex-col gap-2 backdrop-blur-md">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full min-h-[85px] bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-3 text-sm text-gray-905 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8A65]/50 resize-y font-semibold"
                      placeholder={language === 'hi' ? "संदेश सुधारें..." : "Edit message..."}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xs font-black rounded-xl transition-all"
                      >
                        {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => handleSaveEdit(msg.id)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-sm hover:opacity-90 cursor-pointer"
                      >
                        <Check size={12} />
                        {language === 'hi' ? 'सुरक्षित करें' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                         "px-5 py-3.5 rounded-3xl shadow-sm backdrop-blur-md",
                         msg.role === 'user'
                           ? "bg-gradient-to-br from-[#E65100] to-[#FF8A65] text-white rounded-tr-sm shadow-[0_0_20px_rgba(230,81,0,0.4)] border border-[#FF8A65]/50"
                           : "bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                         isSelectMode && selectedMessageIds.has(msg.id) && "ring-2 ring-[#FF6D00] ring-offset-2 ring-offset-black"
                      )}
                    >
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap leading-relaxed font-semibold">{msg.text}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-[#FF8A65] prose-strong:text-gray-900 dark:prose-strong:text-white">
                          {msg.text ? (
                            <Markdown>{msg.text}</Markdown>
                          ) : (
                            <div className="flex items-center gap-1 h-5">
                              <span className="w-1.5 h-1.5 bg-[#FF8A65] rounded-full animate-bounce [animation-delay:-0.3s] shadow-[0_0_5px_rgba(255,138,101,0.8)]"></span>
                              <span className="w-1.5 h-1.5 bg-[#FF8A65] rounded-full animate-bounce [animation-delay:-0.15s] shadow-[0_0_5px_rgba(255,138,101,0.8)]"></span>
                              <span className="w-1.5 h-1.5 bg-[#FF8A65] rounded-full animate-bounce shadow-[0_0_5px_rgba(255,138,101,0.8)]"></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {!isSelectMode && (
                      msg.role === 'user' ? (
                        <div className="flex items-center gap-3 mt-1.5 px-2">
                          <button
                            onClick={() => handleStartEdit(msg)}
                            className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#FF8A65] flex items-center gap-1 transition-colors cursor-pointer"
                            title={language === 'hi' ? 'संदेश सुधारें' : 'Edit message'}
                          >
                            <Edit size={11} />
                            {language === 'hi' ? 'सुधारें' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#FF1744] flex items-center gap-1 transition-colors cursor-pointer"
                            title={language === 'hi' ? 'संदेश हटाएं' : 'Delete message'}
                          >
                            <Trash2 size={11} />
                            {language === 'hi' ? 'हटाएं' : 'Delete'}
                          </button>
                        </div>
                      ) : (
                        msg.text && (
                          <div className="flex flex-wrap items-center gap-3.5 mt-1.5 px-2">
                            <button 
                              onClick={() => handleListen(msg.text)}
                              className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#FF8A65] flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              {isSpeaking ? <VolumeX size={12} className="text-[#FF1744] animate-pulse" /> : <Volume2 size={12} />} 
                              {isSpeaking ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'सुनें' : 'Listen')}
                            </button>
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#FF8A65] flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={language === 'hi' ? 'उत्तर कॉपी करें' : 'Copy response'}
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check size={12} className="text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">{language === 'hi' ? 'कॉपी हो गया' : 'Copied!'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>{language === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#FF1744] flex items-center gap-1 transition-colors cursor-pointer"
                              title={language === 'hi' ? 'उत्तर हटाएं' : 'Delete response'}
                            >
                              <Trash2 size={11} />
                              <span>{language === 'hi' ? 'हटाएं' : 'Delete'}</span>
                            </button>
                          </div>
                        )
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
      )}

      {/* Footer controls */}
      <footer className="shrink-0 relative w-full bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 p-4 pb-safe z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Smart Tools overlay */}
        {showSmartTools && (
          <div className="absolute bottom-[108%] left-4 right-4 w-[calc(100%-2rem)] max-w-lg mx-auto bg-white/98 dark:bg-[#080808]/98 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(255,109,0,0.25)] border-2 border-[#FF6D00]/40 p-5 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300">
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-gray-100 dark:border-white/5">
              <div>
                <h3 className="text-sm font-black text-[#FF6D00] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#FFD54F] animate-pulse" />
                  Jain Wisdom Engine Co-Pilot (स्मार्ट टूल्स)
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">High-Level Spiritual Swadhyay Helpers</p>
              </div>
              <button 
                onClick={() => setShowSmartTools(false)} 
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-[#FF6D00] transition-colors text-sm font-black"
              >
                ✕
              </button>
            </div>

            {/* Smart Tools Tabs */}
            <div className="flex gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl mb-4 border border-gray-200/50 dark:border-white/10">
              <button
                onClick={() => setToolsTab('modes')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5",
                  toolsTab === 'modes' 
                    ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white shadow-md shadow-[#FF6D00]/25" 
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Sliders size={12} /> Spiritual Modes
              </button>
              <button
                onClick={() => setToolsTab('dhyana')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5",
                  toolsTab === 'dhyana' 
                    ? "bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white shadow-md shadow-[#FF6D00]/25" 
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Brain size={12} /> Dhyana Room
              </button>
            </div>
            
            {/* TAB CONTENT: SPIRITUAL MODES */}
            {toolsTab === 'modes' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Multimedia Attachments */}
                <div>
                  <span className="text-[9px] font-black uppercase text-[#FF6D00]/85 tracking-widest block mb-2">Multimedia Attachments</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => { cameraInputRef.current?.click(); setShowSmartTools(false); }}
                      className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 hover:scale-[1.01] transition-all text-[11px] font-bold text-gray-700 dark:text-gray-300 shadow-sm"
                    >
                      <Camera size={13} className="text-[#FF8A65]" />
                      <span>Camera</span>
                    </button>
                    <button 
                      onClick={() => { fileInputRef.current?.click(); setShowSmartTools(false); }}
                      className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 hover:scale-[1.01] transition-all text-[11px] font-bold text-gray-700 dark:text-gray-300 shadow-sm"
                    >
                      <ImageIcon size={13} className="text-[#FF8A65]" />
                      <span>Photos</span>
                    </button>
                    <button 
                      onClick={() => { docInputRef.current?.click(); setShowSmartTools(false); }}
                      className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl bg-gray-50 dark:bg-white/5 border border-[#FF6D00]/15 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 hover:scale-[1.01] transition-all text-[11px] font-bold text-gray-700 dark:text-gray-300 shadow-sm"
                    >
                      <File size={13} className="text-[#FF8A65]" />
                      <span>Files</span>
                    </button>
                  </div>
                </div>

                {/* Grid of Spiritual Helper Modes */}
                <div>
                  <span className="text-[9px] font-black uppercase text-[#FF6D00]/85 tracking-widest block mb-1.5">Active Spiritual Modes (उच्चतम टूल्स)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    
                    <button 
                      onClick={() => setContext('think')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'think' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Think Longer</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Deep reasoning logic for absolute query analysis</span>
                    </button>

                    <button 
                      onClick={() => setContext('research')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'research' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Telescope size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Deep Research</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Scan & fetch scriptures and historical Aagams</span>
                    </button>

                    <button 
                      onClick={() => setContext('anekantavada')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'anekantavada' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Brain size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Anekantavada View</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Multi-perspective analytical view of thoughts</span>
                    </button>

                    <button 
                      onClick={() => setContext('verification')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'verification' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <ClipboardCheck size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Agama Verifier</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Fact-check queries against authentic historical canons</span>
                    </button>

                    <button 
                      onClick={() => setContext('study')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'study' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <BookOpen size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Pathshala Mode</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Interactive breakdowns with lessons & morals</span>
                    </button>

                    <button 
                      onClick={() => setContext('sutra')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'sutra' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Languages size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Sutra Decoder</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Sanskrit & Prakrit word translation & meaning</span>
                    </button>

                    <button 
                      onClick={() => setContext('muhurat')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'muhurat' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Compass size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Muhurat & Vrat</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Fast guides, Pachkhan, tithis and daily rules</span>
                    </button>

                    <button 
                      onClick={() => setContext('web')}
                      className={cn(
                        "flex flex-col items-start p-2 rounded-xl border text-left transition-all hover:scale-[1.01]",
                        activeContext === 'web' 
                          ? "bg-[#FF6D00]/15 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)]" 
                          : "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Globe size={13} className="text-[#FF8A65]" />
                        <span className="text-[10px] font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Real-Time Web</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-semibold leading-normal">Enable authentic Real-Time Web grounding context</span>
                    </button>
                    
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DHYANA ROOM */}
            {toolsTab === 'dhyana' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                
                {/* Pranayama Interactive Breathing Loop */}
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-black uppercase text-[#FF6D00] tracking-widest mb-3 block">Pranayama Shanti (प्राणायाम / श्वास नियंत्रण)</span>
                  
                  {breathPhase ? (
                    <div className="flex flex-col items-center justify-center space-y-3.5 py-2">
                      <div className={cn(
                        "w-20 h-20 rounded-full flex flex-col items-center justify-center relative border border-[#FF6D00]/40 transition-all duration-[4000ms] ease-in-out",
                        breathPhase === 'in' && "scale-125 bg-[#FF6D00]/10 shadow-[0_0_20px_rgba(255,109,0,0.4)] border-[#FF6D00]",
                        breathPhase === 'hold' && "scale-125 bg-amber-500/15 shadow-[0_0_25px_rgba(245,158,11,0.5)] border-amber-500",
                        breathPhase === 'out' && "scale-95 bg-white/5 border-gray-550"
                      )}>
                        <span className="text-[10px] font-black uppercase text-[#FF6D00] font-mono tracking-wider animate-pulse">
                          {breathTimer}s
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                          {breathPhase === 'in' && 'Breathe In (श्वास लें)'}
                          {breathPhase === 'hold' && 'Hold Breath (कुंभक)'}
                          {breathPhase === 'out' && 'Exhale (रेचक)'}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-widest font-semibold">Keep mind calm before philosophical discussion</p>
                      </div>

                      <button 
                        onClick={() => setBreathPhase(null)}
                        className="py-1 px-4 border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all"
                      >
                        Stop Practice
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 py-1 flex flex-col items-center">
                      <p className="text-[10px] text-gray-400 font-semibold max-w-xs leading-relaxed">
                        Practice 4-4-4 Pranayama (Inhale, Hold, Exhale) to stabilize concentration & cultivate pure spiritual mindfulness.
                      </p>
                      <button 
                        onClick={() => setBreathPhase('in')}
                        className="py-2 px-6 bg-gradient-to-r from-[#FF6D00] to-[#FF8A65] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        Start Breathing Lesson
                      </button>
                    </div>
                  )}
                </div>

                {/* Mantra Bell & Gong */}
                <div>
                  <span className="text-[9px] font-black uppercase text-[#FF6D00]/85 tracking-widest block mb-2">Spiritual Sound Chimes</span>
                  <button 
                    onClick={() => { playTempleGong(); }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/5 hover:scale-[1.01] transition-all text-xs font-bold text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <Music size={15} className="text-[#FF8A65] animate-bounce" />
                      <div className="text-left">
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider block">Navkar Mantra Spiritual Bell (कंस घंटा)</span>
                        <span className="text-[9px] text-gray-400 font-medium leading-normal block">Plays a sacred traditional high-vibration pure brass temple bell gong</span>
                      </div>
                    </div>
                    <span className="py-1 px-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-black text-amber-500 uppercase">Listen</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        <div className="absolute bottom-full left-0 w-full px-4 pb-2 flex flex-wrap items-end gap-2">
          {activeContext && (
            <div 
              onClick={activeContext === 'chanting' ? playTempleGong : undefined}
              className={cn(
                "flex items-center gap-2 bg-[#FF6D00]/10 dark:bg-[#FF6D00]/20 border border-[#FF6D00]/50 text-[#E65100] dark:text-[#FFD54F] px-3 py-1.5 rounded-full text-[10px] tracking-wider font-bold shadow-[0_0_10px_rgba(255,109,0,0.2)] dark:shadow-[0_0_10px_rgba(255,109,0,0.3)] animate-in fade-in slide-in-from-bottom-2",
                activeContext === 'chanting' && "cursor-pointer hover:bg-[#FF6D00]/30 active:scale-95 transition-all"
              )}
            >
              {activeContext === 'think' && <Lightbulb size={14} />}
              {activeContext === 'research' && <Telescope size={14} />}
              {activeContext === 'study' && <BookOpen size={14} />}
              {activeContext === 'sutra' && <Languages size={14} />}
              {activeContext === 'muhurat' && <Compass size={14} />}
              {activeContext === 'web' && <Globe size={14} />}
              {activeContext === 'anekantavada' && <Brain size={14} />}
              {activeContext === 'verification' && <ClipboardCheck size={14} />}
              {activeContext === 'chanting' && <Music size={14} className="animate-bounce" />}
              <span>
                {activeContext === 'think' && 'THINK LONGER'}
                {activeContext === 'research' && 'DEEP RESEARCH'}
                {activeContext === 'study' && 'STUDY & LEARN'}
                {activeContext === 'sutra' && 'SUTRA DECODER'}
                {activeContext === 'muhurat' && 'MUHURAT & VRAT'}
                {activeContext === 'web' && 'REAL-TIME WEB'}
                {activeContext === 'anekantavada' && 'ANEKANTAVADA VIEW'}
                {activeContext === 'verification' && 'AGAMA VERIFIER'}
                {activeContext === 'chanting' && 'DYNAMIC JAPA BELL (TAP)'}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveContext(null); }} 
                className="hover:text-red-500 text-gray-500 ml-1.5 transition-colors p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {selectedFile && (
            <div className="relative group animate-in fade-in slide-in-from-bottom-2">
              {selectedFile.isImage ? (
                <img src={selectedFile.url} alt="Selected" className="h-16 w-16 object-cover rounded-xl border-2 border-[#FF6D00]" />
              ) : (
                <div className="h-16 w-16 bg-white dark:bg-[#1A1A1A] rounded-xl border-2 border-[#FF6D00] flex flex-col items-center justify-center p-1 text-center font-semibold">
                  <FileText size={20} className="text-[#FF8A65] mb-1" />
                  <span className="text-[8px] text-gray-600 dark:text-gray-300 truncate w-full px-1">{selectedFile.name}</span>
                </div>
              )}
              <button onClick={() => setSelectedFile(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 text-white hover:scale-110 transition-transform">
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end gap-3 bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-2 focus-within:border-[#FF6D00]/50 transition-all relative">
          <button onClick={() => setShowSmartTools(!showSmartTools)} className="p-2.5 text-[#FF8A65] hover:bg-gray-200 dark:hover:bg-white/5 rounded-full transition-colors ml-1">
            <Plus size={24} className={cn("transition-transform", showSmartTools && "rotate-45")} />
          </button>
          
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileSelect} />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" ref={docInputRef} onChange={handleFileSelect} />
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }}
            onBlur={() => {
              setTimeout(() => {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }, 100);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={language === 'hi' ? 'जैन धर्म के बारे में कुछ भी पूछें...' : 'Ask anything about Jainism...'}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-2 text-base text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          
          <button 
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={cn(
              "p-2.5 rounded-full transition-all duration-300",
              isListening ? "text-rose-500 bg-rose-500/10 animate-pulse" : "text-gray-400 hover:text-[#FF8A65]"
            )}
          >
            <Mic size={24} />
          </button>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="w-12 h-12 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md shrink-0"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </div>
        {speechError && <p className="text-red-500 text-sm mt-2 ml-4">{speechError}</p>}
      </footer>

      {/* Purge Account Confirm Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-red-500/30 max-w-sm text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">DELETE CHAT ACCOUNT?</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This will permanently delete your authentication file, profile registration, and ALL saved private chat sessions in the database. This action is IRREVERSIBLE.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteAccountChats}
                disabled={isLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-colors"
              >
                {isLoading ? 'Purging...' : 'Yes, Purge'}
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jainism GPT Immersive Live Mode Voice Overlay */}
      <AnimatePresence>
        {isLiveMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0A0A] text-white z-[999] flex flex-col items-center justify-between p-6 overflow-hidden md:p-12 font-sans"
          >
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,109,0,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Top Bar */}
            <div className="w-full max-w-lg flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E676]"></span>
                </span>
                <p className="text-[10px] font-black tracking-widest uppercase text-[#00E676]">Jainism GPT Live</p>
              </div>
              <button 
                onClick={exitLiveMode}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur"
              >
                <X size={20} />
              </button>
            </div>

            {/* Immersive Voice Waves Visualizer */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 w-full max-w-lg">
              <div className="relative flex items-center justify-center w-56 h-56">
                {/* Ripples */}
                {liveState === 'speaking' && (
                  <>
                    <div className="absolute w-56 h-28 bg-[#FF6D00]/10 rounded-full animate-ping [animation-duration:2.5s]" />
                    <div className="absolute w-44 h-24 bg-[#FF6D00]/15 rounded-full animate-ping [animation-duration:2.0s]" />
                    <div className="absolute w-32 h-20 bg-[#FF6D00]/20 rounded-full animate-ping [animation-duration:1.5s]" />
                  </>
                )}
                {liveState === 'listening' && (
                  <>
                    <div className="absolute w-44 h-44 bg-[#00E676]/10 rounded-full animate-pulse [animation-duration:1.5s]" />
                    <div className="absolute w-32 h-32 bg-[#00E676]/15 rounded-full animate-pulse [animation-duration:1.0s]" />
                  </>
                )}
                {liveState === 'thinking' && (
                  <div className="absolute inset-x-0 inset-y-0 border-2 border-dashed border-[#FFD54F]/30 rounded-full animate-spin [animation-duration:6s]" />
                )}

                {/* Core Speaker Circle */}
                <div className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10",
                  liveState === 'listening' ? "bg-gradient-to-br from-[#00E676] to-[#00C853] text-black shadow-[#00E676]/30 scale-105" :
                  liveState === 'thinking' ? "bg-gradient-to-br from-[#FFD54F] to-[#FFB300] text-black shadow-[#FFD54F]/30 scale-100 animate-pulse" :
                  liveState === 'speaking' ? "bg-gradient-to-br from-[#FF6D00] to-[#FF8A65] text-white shadow-[#FF6D00]/40 scale-110" :
                  "bg-white/10 border border-white/20 text-white scale-90"
                )}>
                  {liveState === 'listening' && <Mic size={36} />}
                  {liveState === 'thinking' && <Activity size={36} className="animate-pulse" />}
                  {liveState === 'speaking' && <Volume2 size={36} className="animate-bounce" />}
                  {liveState === 'idle' && <Radio size={36} />}
                </div>
              </div>

              {/* Dynamic Subtitle/Caption Feedback */}
              <div className="text-center space-y-3 px-4 w-full h-32 flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-wider text-white/50">
                  {liveState === 'listening' ? 'Listening to your voice...' :
                   liveState === 'thinking' ? 'Deep Contemplation...' :
                   liveState === 'speaking' ? 'Jainism GPT' : 'Tap Mic to Speak'}
                </p>
                
                <AnimatePresence mode="wait">
                  {liveState === 'speaking' && liveModelText ? (
                    <motion.p
                      key={liveModelText}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-lg font-medium text-gray-200 line-clamp-3 leading-relaxed max-w-md mx-auto"
                    >
                      "{liveModelText}"
                    </motion.p>
                  ) : liveState === 'listening' && liveUserText ? (
                    <motion.p
                      key={liveUserText}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-base font-semibold text-gray-400 italic max-w-sm mx-auto"
                    >
                      "{liveUserText}"
                    </motion.p>
                  ) : (
                    <motion.p
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="text-sm text-gray-400 h-5"
                    >
                      {liveState === 'listening' ? 'Speak clearly now...' :
                       liveState === 'thinking' ? 'Consulting canonical structures...' :
                       liveState === 'speaking' ? 'Chanting verbal gatha...' : 'Hands-Free Loop Active'}
                    </motion.p>
                  )}
                </AnimatePresence>
                
                {liveError && (
                  <p className="text-xs font-black text-rose-500 uppercase tracking-widest leading-relaxed">{liveError}</p>
                )}
              </div>
            </div>

            {/* Multimodal Live Attachments for images and videos */}
            <div className="w-full max-w-lg flex flex-col items-center gap-4 relative z-10 shrink-0 mb-2">
              {selectedFile ? (
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
                  {selectedFile.isImage ? (
                    <img src={selectedFile.url} alt="Attached Preview" className="h-12 w-12 object-cover rounded-xl border border-white/10" />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-[9px] font-black uppercase text-gray-400">
                      File
                    </div>
                  )}
                  <div className="text-left">
                    <span className="text-[8px] font-black uppercase text-[#FF6D00] tracking-wider block leading-none mb-1">Attached to Live Guidance Room</span>
                    <span className="text-xs font-bold text-gray-200 block truncate max-w-[140px] leading-tight">{selectedFile.name}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="p-1 px-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 justify-center items-center">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all hover:scale-103"
                  >
                    <Camera size={13} className="text-[#FF8A65]" />
                    <span>Capture Photo</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all hover:scale-103"
                  >
                    <ImageIcon size={13} className="text-[#FF8A65]" />
                    <span>Upload Photo/Video</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Controls / Close Button */}
            <div className="w-full max-w-lg flex flex-col items-center gap-4 relative z-10 shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={liveState === 'listening' ? () => setLiveState('idle') : startLiveListening}
                  className={cn(
                    "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
                    liveState === 'listening' 
                      ? "bg-rose-600/20 text-rose-500 border border-rose-500/30" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {liveState === 'listening' ? 'Pause Mic' : 'Resume Mic'}
                </button>
                <button
                  onClick={exitLiveMode}
                  className="px-8 py-3 bg-[#FF6D00] hover:bg-[#FF8A65] text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#FF6D00]/25 transition-all cursor-pointer"
                >
                  End Live Session
                </button>
              </div>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                Hands-free voice loop enabled, auto-switches list states
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Clear Chat Confirmation Modal */}
      {showClearChatModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] border border-[#FF6D00]/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
                {language === 'hi' ? 'क्या आप पूरी चैट साफ़ करना चाहते हैं?' : 'Clear entire conversation?'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'hi' ? 'इस बातचीत के सभी संदेश हटा दिए जाएंगे।' : 'All messages in this session will be permanently removed.'}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowClearChatModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-black hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleClearCurrentChat}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black shadow-md hover:bg-red-700 transition-all cursor-pointer"
              >
                {language === 'hi' ? 'हाँ, साफ़ करें' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
