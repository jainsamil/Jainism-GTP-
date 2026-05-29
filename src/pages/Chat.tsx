import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { 
  Send, Sparkles, Loader2, Mic, Image as ImageIcon, Volume2, VolumeX, 
  Brain, Search, BookOpen, X, Plus, Camera, File, Lightbulb, Telescope, 
  Globe, ArrowLeft, FileText, Menu, Trash2, MessageSquare, PlusCircle, 
  LogOut, ShieldAlert, User, ShieldCheck
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = location.state?.initialPrompt;

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSmartTools, setShowSmartTools] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ data: string, mimeType: string, url?: string, name: string, isImage: boolean } | null>(null);
  const [activeContext, setActiveContext] = useState<'think' | 'research' | 'study' | 'web' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<any>(null);

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
    if (msgs.length === 0) return;

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

  const setContext = (ctx: 'think' | 'research' | 'study' | 'web') => {
    setActiveContext(ctx);
    setShowSmartTools(false);
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
      if (contextToSend === 'think') finalPrompt = `[Context: Please think deeply and provide a comprehensive, detailed analysis] ${finalPrompt}`;
      if (contextToSend === 'research') finalPrompt = `[Context: Provide historical context and scriptural references (Aagams)] ${finalPrompt}`;
      if (contextToSend === 'study') finalPrompt = `[Context: Explain this concept as if you are teaching a student in a Jain Pathshala, breaking it down simply] ${finalPrompt}`;

      newParts.push({ text: finalPrompt });

      const contents = [...history, { role: 'user', parts: newParts }];

      const config: any = {
        systemInstruction: 'You are a knowledgeable, respectful, and insightful expert on Jainism. You provide accurate information about Jain philosophy, history, Tirthankaras, Agamas, ethics (Ahimsa, Anekantavada, Aparigraha), and practices. Answer questions clearly, compassionately, and objectively. Start your first response with "Jai Jinendra!" if appropriate.',
      };

      if (contextToSend === 'web') {
        config.tools = [{ googleSearch: {} }];
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash', // Automatically updated to latest high performance flash model
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
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: 'I apologize, but I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, selectedFile, activeContext, messages, currentSessionId]);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a knowledgeable, respectful, and insightful expert on Jainism. You provide accurate information about Jain philosophy, history, Tirthankaras, Agamas, ethics (Ahimsa, Anekantavada, Aparigraha), and practices. Answer questions clearly, compassionately, and objectively. Start your first response with "Jai Jinendra!" if appropriate.',
        },
      });
    }

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
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#050505] p-6 relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="bg-[#121212] p-10 rounded-[2.5rem] border border-white/10 w-full max-w-lg text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(255,109,0,0.05)_0%,transparent_65%) pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_40px_rgba(255,109,0,0.4)] border border-white/20 animate-bounce">
              <Sparkles size={44} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
            </div>
            
            <h1 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] mb-4 uppercase tracking-tighter">JAINISM GPT CHAT</h1>
            <p className="text-gray-400 max-w-sm mx-auto mb-10 text-sm leading-relaxed font-semibold">
              Please authenticate via your Google Account to access secure spiritual guidance and save your private chat history.
            </p>
            
            <button
              onClick={login}
              className="w-full py-4 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#050505] relative text-gray-900 dark:text-gray-200 overflow-hidden">
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "absolute top-0 left-0 h-full w-72 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-white/10 z-50 transform transition-transform duration-300 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,0,0,0.8)]",
        showSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-[#FF6D00]" />
            Chat History
          </h2>
          <button onClick={() => setShowSidebar(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white font-medium transition-colors"
          >
            <PlusCircle size={18} className="text-[#FF6D00]" />
            New Chat
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">No saved chats.</p>
          ) : (
            sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => loadSession(session)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group",
                  currentSessionId === session.id ? "bg-[#FF6D00]/10 dark:bg-[#FF6D00]/20 border border-[#FF6D00]/30" : "hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className={cn(
                    "text-sm truncate font-medium",
                    currentSessionId === session.id ? "text-[#FF8A65]" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  )}>
                    {session.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-mono">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={(e) => deleteSession(e, session.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* User Account Section inside sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 space-y-3">
          <div className="flex items-center gap-2.5">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border-2 border-[#FF6D00]" />
            ) : (
              <img src="https://i.ibb.co/Myg19RW6/1000539584.jpg" alt="Samil Jain" className="w-9 h-9 rounded-full border-2 border-[#FF6D00] object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.displayName || 'Samil Jain'}</p>
              <p className="text-[9px] text-[#00E676] font-bold flex items-center gap-0.5 uppercase tracking-widest">
                <ShieldCheck size={10} /> {user ? 'Private ID' : 'Guest Mode'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {user ? (
              <>
                <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-1.5 py-2 hover:bg-rose-500/10 hover:text-red-500 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  <LogOut size={12} /> Logout
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-1.5 py-2 hover:bg-rose-500/10 text-rose-500 bg-rose-500/5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
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
                className="col-span-2 flex items-center justify-center gap-1.5 py-2 hover:bg-rose-500/10 hover:text-rose-500 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
              >
                <Trash2 size={12} /> Clear Guest History
              </button>
            )}
          </div>
        </div>
      </div>

      <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-gray-500 hover:text-[#FF6D00] dark:text-gray-400 dark:hover:text-[#FF6D00] transition-colors drop-shadow-[0_0_5px_rgba(255,109,0,0.5)]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] drop-shadow-[0_0_10px_rgba(255,109,0,0.5)]">JAINISM GPT</h1>
        </div>
        <button onClick={() => setShowSidebar(true)} className="text-gray-500 hover:text-[#FF6D00] dark:text-gray-400 dark:hover:text-[#FF6D00] transition-colors">
          <Menu size={24} />
        </button>
      </header>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,109,0,0.05)_0%,transparent_60%)] pointer-events-none" />
          <div className="w-40 h-40 bg-white dark:bg-[#121212] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,109,0,0.1)] dark:shadow-[0_0_30px_rgba(255,109,0,0.2)] border border-[#FF6D00]/20 relative group">
            <div className="absolute inset-0 bg-[#FF6D00] rounded-full blur-xl opacity-10 dark:opacity-20 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,109,0,0.4)] dark:shadow-[0_0_30px_rgba(255,109,0,0.8)] border-2 border-white/50 dark:border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={48} className="text-white dark:text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Jainism <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] drop-shadow-[0_0_15px_rgba(255,109,0,0.4)] dark:drop-shadow-[0_0_15px_rgba(255,109,0,0.8)]">GPT</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide prose prose-invert">
            Speak to the Autonomous Wisdom Guide
          </p>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                   "px-5 py-3.5 rounded-3xl shadow-sm backdrop-blur-md",
                   msg.role === 'user'
                     ? "bg-gradient-to-br from-[#E65100] to-[#FF8A65] text-white rounded-tr-sm shadow-[0_0_20px_rgba(230,81,0,0.4)] border border-[#FF8A65]/50"
                     : "bg-white dark:bg-[#121212]/80 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
              {msg.role === 'model' && msg.text && (
                <button 
                  onClick={() => handleListen(msg.text)}
                  className="mt-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-[#FF8A65] flex items-center gap-1.5 px-2 transition-colors"
                >
                  {isSpeaking ? <VolumeX size={14} className="text-[#FF1744] animate-pulse" /> : <Volume2 size={14} />} 
                  {isSpeaking ? 'Stop' : 'Listen'}
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
      )}

      {/* Footer controls */}
      <footer className="shrink-0 relative w-full bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 p-4 pb-safe z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Smart Tools overlay */}
        {showSmartTools && (
          <div className="absolute bottom-full left-0 w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-3xl rounded-t-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.8)] p-6 z-50 border-t border-gray-200 dark:border-white/10 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-wide">SMART TOOLS</h3>
              <button onClick={() => setShowSmartTools(false)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <button onClick={() => { cameraInputRef.current?.click(); setShowSmartTools(false); }} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
                <Camera className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)] transition-all" size={28} />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 tracking-widest group-hover:text-gray-900 dark:group-hover:text-white">CAMERA</span>
              </button>
              <button onClick={() => { fileInputRef.current?.click(); setShowSmartTools(false); }} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
                <ImageIcon className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)] transition-all" size={28} />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 tracking-widest group-hover:text-gray-900 dark:group-hover:text-white">PHOTOS</span>
              </button>
              <button onClick={() => { docInputRef.current?.click(); setShowSmartTools(false); }} className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FF6D00]/50 hover:bg-[#FF6D00]/10 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] group">
                <File className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)] transition-all" size={28} />
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-300 tracking-widest group-hover:text-gray-900 dark:group-hover:text-white">FILES</span>
              </button>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => setActiveContext('think')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <Lightbulb className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">THINK LONGER</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Apply deep analytical search to your prompt</div>
                </div>
              </button>
              
              <button onClick={() => setActiveContext('research')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <Telescope className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">DEEP RESEARCH</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Consult scriptures and historical Agamas context</div>
                </div>
              </button>
              
              <button onClick={() => setActiveContext('study')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <BookOpen className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">STUDY AND LEARN</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Enable Pathshala mode for simple breakdowns</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-full left-0 w-full px-4 pb-2 flex flex-wrap items-end gap-2">
          {activeContext && (
            <div className="flex items-center gap-2 bg-[#FF6D00]/10 dark:bg-[#FF6D00]/20 border border-[#FF6D00]/50 text-[#E65100] dark:text-[#FFD54F] px-3 py-1.5 rounded-full text-[10px] tracking-wider font-bold shadow-[0_0_10px_rgba(255,109,0,0.2)] dark:shadow-[0_0_10px_rgba(255,109,0,0.3)] animate-in fade-in slide-in-from-bottom-2">
              {activeContext === 'think' && <Lightbulb size={14} />}
              {activeContext === 'research' && <Telescope size={14} />}
              {activeContext === 'study' && <BookOpen size={14} />}
              <span>
                {activeContext === 'think' && 'THINK LONGER'}
                {activeContext === 'research' && 'DEEP RESEARCH'}
                {activeContext === 'study' && 'STUDY & LEARN'}
              </span>
              <button onClick={() => setActiveContext(null)} className="hover:text-gray-900 dark:hover:text-white ml-1 transition-colors"><X size={14} /></button>
            </div>
          )}
          {selectedFile && (
            <div className="relative group animate-in fade-in slide-in-from-bottom-2">
              {selectedFile.isImage ? (
                <img src={selectedFile.url} alt="Selected" className="h-16 w-16 object-cover rounded-xl border-2 border-[#FF6D00]" />
              ) : (
                <div className="h-16 w-16 bg-white dark:bg-[#1A1A1A] rounded-xl border-2 border-[#FF6D00] flex flex-col items-center justify-center p-1 text-center">
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about Jainism..."
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
    </div>
  );
}
