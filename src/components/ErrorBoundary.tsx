import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, RotateCcw, Home, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear demo or corrupted state if any
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleHardReload = () => {
    try {
      // Clear cache-related items if needed
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F] flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(255,109,0,0.6)]">
            <AlertCircle size={32} className="text-black" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] tracking-tight mb-2">
            जय जिनेंद्र!
          </h1>
          <p className="text-sm text-gray-300 max-w-md mb-6 leading-relaxed">
            ऐप लोड करने में एक तकनीकी समस्या आई है। कृपया नीचे दिए गए बटन पर क्लिक करके ऐप को पुनः आरंभ करें।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#FF6D00] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFD54F] text-black font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm"
            >
              <Home size={18} />
              मुख्य पृष्ठ (Home)
            </button>

            <button
              onClick={this.handleHardReload}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm"
            >
              <RefreshCw size={18} />
              पुनः लोड करें (Reload)
            </button>
          </div>

          <p className="text-[11px] text-gray-500 mt-8 font-semibold">
            Jainism GPT • Divine Wisdom by Samil Jain
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
