import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { Send, Sparkles, Loader2, Mic, Image as ImageIcon, Volume2, VolumeX, Brain, Search, BookOpen, X, Plus, Camera, File, Lightbulb, Telescope, Globe, ArrowLeft, FileText, Menu, Trash2, MessageSquare, PlusCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jainism_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0 && !currentSessionId && messages.length === 0) {
          // Don't auto-load the last session, let them start a new one or pick from sidebar
        }
      } catch (e) {
        console.error("Error parsing chat sessions", e);
      }
    }
  }, []);

  // Save current session to localStorage whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    
    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === currentSessionId);
      let newSessions = [...prev];
      
      if (existingIdx >= 0) {
        newSessions[existingIdx] = { ...newSessions[existingIdx], messages, updatedAt: Date.now() };
      } else {
        const newId = currentSessionId || Date.now().toString();
        if (!currentSessionId) setCurrentSessionId(newId);
        
        const firstUserMsg = messages.find(m => m.role === 'user')?.text || 'New Chat';
        const title = firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? '...' : '');
        
        newSessions = [{ id: newId, title, messages, updatedAt: Date.now() }, ...prev];
      }
      
      localStorage.setItem('jainism_chat_sessions', JSON.stringify(newSessions));
      return newSessions;
    });
  }, [messages, currentSessionId]);

  const createNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setShowSidebar(false);
    chatRef.current = null; // Reset chat context
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setShowSidebar(false);
    chatRef.current = null; // Reset chat context so it can be rebuilt if needed, or we just rely on history
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      localStorage.setItem('jainism_chat_sessions', JSON.stringify(newSessions));
      return newSessions;
    });
    if (currentSessionId === id) {
      createNewChat();
    }
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
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', text: textToSend || `Uploaded ${fileToSend?.name}` }]);
    setIsLoading(true);

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
        model: 'gemini-3-flash-preview',
        contents,
        config
      });
      
      let fullResponse = '';
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        fullResponse += c.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
          )
        );
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
  }, [input, isLoading, selectedFile, activeContext, messages]);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are a knowledgeable, respectful, and insightful expert on Jainism. You provide accurate information about Jain philosophy, history, Tirthankaras, Agamas, ethics (Ahimsa, Anekantavada, Aparigraha), and practices. Answer questions clearly, compassionately, and objectively. Start your first response with "Jai Jinendra!" if appropriate.',
        },
      });
    }

    if (initialPrompt && !isLoading && messages.length === 0) {
      handleSend(initialPrompt);
      // Clear state so it doesn't re-trigger on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [initialPrompt, handleSend, isLoading, messages.length, navigate, location.pathname]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const promptButtons = [
    { label: 'Think Longer', icon: Brain, prompt: 'Please think deeply and provide a comprehensive, detailed analysis of my previous question regarding Jain philosophy.' },
    { label: 'Deep Research', icon: Search, prompt: 'Can you provide historical context and scriptural references (Aagams) for this topic?' },
    { label: 'Study Mode', icon: BookOpen, prompt: 'Explain this concept as if you are teaching a student in a Jain Pathshala, breaking it down simply.' },
  ];

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

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">No chat history yet.</p>
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
                  <p className="text-[10px] text-gray-500 mt-1">
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
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">
            Your Spiritual AI Guide
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
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</p>
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
                  className="mt-2 text-[10px] uppercase tracking-wider font-bold text-gray-500 hover:text-[#FF8A65] flex items-center gap-1.5 px-2 transition-colors"
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

      <footer className="shrink-0 relative w-full bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 p-4 pb-safe z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {/* Smart Tools Modal Overlay */}
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">Apply smart context to your prompt</div>
                </div>
              </button>
              
              <button onClick={() => setActiveContext('research')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <Telescope className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">DEEP RESEARCH</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Apply smart context to your prompt</div>
                </div>
              </button>
              
              <button onClick={() => setActiveContext('study')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <BookOpen className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">STUDY AND LEARN</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Apply smart context to your prompt</div>
                </div>
              </button>

              <button onClick={() => setActiveContext('web')} className="w-full flex items-center gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 hover:border-[#FF6D00]/30 hover:bg-[#FF6D00]/5 dark:hover:bg-white/10 transition-all text-left group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6D00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FF6D00]/20 transition-colors border border-[#FF6D00]/20">
                  <Globe className="text-[#FF8A65] group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.4)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,138,101,0.8)]" size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm mb-0.5 tracking-wide">WEB SEARCH</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Apply smart context to your prompt</div>
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
              {activeContext === 'web' && <Globe size={14} />}
              <span>
                {activeContext === 'think' && 'THINK LONGER'}
                {activeContext === 'research' && 'DEEP RESEARCH'}
                {activeContext === 'study' && 'STUDY & LEARN'}
                {activeContext === 'web' && 'WEB SEARCH'}
              </span>
              <button onClick={() => setActiveContext(null)} className="hover:text-gray-900 dark:hover:text-white ml-1 transition-colors"><X size={14} /></button>
            </div>
          )}
          {selectedFile && (
            <div className="relative group animate-in fade-in slide-in-from-bottom-2">
              {selectedFile.isImage ? (
                <img src={selectedFile.url} alt="Selected" className="h-16 w-16 object-cover rounded-xl border-2 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)] dark:shadow-[0_0_15px_rgba(255,109,0,0.4)]" />
              ) : (
                <div className="h-16 w-16 bg-white dark:bg-[#1A1A1A] rounded-xl border-2 border-[#FF6D00] shadow-[0_0_15px_rgba(255,109,0,0.2)] dark:shadow-[0_0_15px_rgba(255,109,0,0.4)] flex flex-col items-center justify-center p-1 text-center">
                  <FileText size={20} className="text-[#FF8A65] mb-1" />
                  <span className="text-[8px] text-gray-600 dark:text-gray-300 truncate w-full px-1">{selectedFile.name}</span>
                </div>
              )}
              <button 
                onClick={() => setSelectedFile(null)}
                className="absolute -top-2 -right-2 bg-rose-500 dark:bg-rose-600 text-white rounded-full p-1 shadow-[0_0_10px_rgba(225,29,72,0.4)] dark:shadow-[0_0_10px_rgba(225,29,72,0.8)] hover:scale-110 transition-transform"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end gap-3 bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] p-2 shadow-inner focus-within:border-[#FF6D00]/50 focus-within:shadow-[0_0_20px_rgba(255,109,0,0.1)] dark:focus-within:shadow-[0_0_20px_rgba(255,109,0,0.2)] transition-all relative">
          
          <button onClick={() => setShowSmartTools(!showSmartTools)} className="p-2.5 text-[#FF8A65] hover:bg-gray-200 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors ml-1 drop-shadow-[0_0_5px_rgba(255,138,101,0.3)] dark:drop-shadow-[0_0_5px_rgba(255,138,101,0.5)]">
            <Plus size={24} className={cn("transition-transform", showSmartTools && "rotate-45")} />
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={cameraInputRef}
            onChange={handleFileSelect}
          />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.txt" 
            className="hidden" 
            ref={docInputRef}
            onChange={handleFileSelect}
          />
          
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
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-2 text-base text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:outline-none"
            rows={1}
            disabled={isLoading}
          />
          
          <button 
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={cn(
              "p-2.5 rounded-full transition-all duration-300",
              isListening 
                ? "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)] dark:shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse" 
                : "text-gray-400 hover:text-[#FF8A65] hover:bg-gray-200 dark:hover:bg-white/5"
            )}
          >
            <Mic size={24} />
          </button>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="w-12 h-12 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,109,0,0.4)] dark:shadow-[0_0_15px_rgba(255,109,0,0.5)] shrink-0 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
          </button>
        </div>
        {speechError && (
          <p className="text-red-500 text-sm mt-2 ml-4">{speechError}</p>
        )}
      </footer>
    </div>
  );
}
