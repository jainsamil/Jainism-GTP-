import { useState, useEffect } from 'react';
import { AlertTriangle, Copy, Check, ExternalLink, X, RefreshCw } from 'lucide-react';

export default function UnauthorizedDomainModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedPre, setCopiedPre] = useState(false);
  const [devUrl, setDevUrl] = useState('');
  const [preUrl, setPreUrl] = useState('');

  useEffect(() => {
    const host = window.location.hostname;
    setDevUrl(host);
    
    if (host.includes('ais-dev-')) {
      setPreUrl(host.replace('ais-dev-', 'ais-pre-'));
    } else if (host.includes('ais-pre-')) {
      setPreUrl(host);
      setDevUrl(host.replace('ais-pre-', 'ais-dev-'));
    } else {
      setPreUrl(host);
    }

    const handleUnauthorizedDomain = () => {
      setIsOpen(true);
    };

    window.addEventListener('firebase-auth-unauthorized-domain', handleUnauthorizedDomain);
    return () => {
      window.removeEventListener('firebase-auth-unauthorized-domain', handleUnauthorizedDomain);
    };
  }, []);

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen) return null;

  const projectId = "gen-lang-client-0252694331";
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-white dark:bg-[#120B08] border border-orange-200 dark:border-orange-950/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto font-sans text-gray-900 dark:text-[#FBEFE0]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-amber-500 mb-6">
          <AlertTriangle size={32} className="shrink-0 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-white">
            Authorized Domain Required
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
          Firebase Authentication requires app domains to be explicitly authorized to prevent unauthorized sign-in attempts. Since this is a temporary preview/development environment, you need to add this domain to your Firebase Console settings.
        </p>

        <div className="space-y-4 mb-6">
          {devUrl && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-950/50 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block mb-1">
                Development Domain
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono select-all break-all text-amber-900 dark:text-amber-300">
                  {devUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(devUrl, setCopiedDev)}
                  className="p-2 bg-white dark:bg-black/40 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl transition-all shrink-0 shadow-sm border border-amber-200/20 cursor-pointer"
                >
                  {copiedDev ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}

          {preUrl && preUrl !== devUrl && (
            <div className="bg-orange-50 dark:bg-orange-950/10 border border-orange-200/30 dark:border-orange-950/30 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-1">
                Production / Shared Domain
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono select-all break-all text-orange-900 dark:text-orange-300">
                  {preUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(preUrl, setCopiedPre)}
                  className="p-2 bg-white dark:bg-black/40 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl transition-all shrink-0 shadow-sm border border-orange-200/20 cursor-pointer"
                >
                  {copiedPre ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
          How to configure in Firebase:
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-8">
          <li>
            Go directly to your Firebase settings using the button below.
          </li>
          <li>
            Under the <strong className="text-gray-800 dark:text-white">Settings</strong> tab, scroll down to the <strong className="text-gray-800 dark:text-white">Authorized domains</strong> section.
          </li>
          <li>
            Click <strong className="text-gray-800 dark:text-white">Add domain</strong> and paste the domain(s) copied above.
          </li>
          <li>
            Click <strong className="text-gray-800 dark:text-white">Save</strong> and refresh this page.
          </li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-4 bg-gradient-to-tr from-[#FF6D00] to-[#FF9E00] text-black hover:from-[#FF9E00] hover:to-[#FFD54F] rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Open Firebase Console
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => window.location.reload()}
            className="py-3.5 px-6 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw size={14} />
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
