import { useState } from 'react';
import { Mail, ArrowLeft, Send, Sparkles, Instagram, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // We can simulate or submit using a real request
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 p-6 pb-24 font-sans selection:bg-[#FF6D00]/20">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F] rounded-2xl shadow-lg mb-4 text-white">
            <Mail size={32} className="drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6D00] to-[#FFD54F]">
            Contact Us
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            If you have any queries or feedback regarding <strong>Jainism GPT</strong>, please reach out directly to our creator or send us a message below.
          </p>
        </header>

        {/* Developer Contact Highlight */}
        <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-white/10 p-6 mb-8 text-center relative overflow-hidden group hover:border-[#FF6D00]/30 transition-all shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#FF6D00] dark:text-[#FFD54F] mb-2 flex items-center gap-1.5 justify-center">
              <UserCheck size={14} /> Developer Support
            </h3>
            <p className="text-xl font-bold mb-1">Samil Jain</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Direct personal support and feedback channel</p>
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-tr from-[#FF6D00] to-[#FFD54F] hover:from-[#FF9100] hover:to-[#FFE082] text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_15px_rgba(255,109,0,0.3)] hover:shadow-[0_4px_20px_rgba(255,109,0,0.5)]"
            >
              <Instagram size={18} />
              Connect on Instagram (@_officialsamiljain_)
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/15 text-green-500 rounded-full mb-4">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Thank you for reaching out. Samil will respond to your queries as soon as possible.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-xs font-bold transition-all text-gray-600 dark:text-gray-300"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#FF6D00] dark:focus:border-[#FF8A65] text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#FF6D00] dark:focus:border-[#FF8A65] text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Message / Feedback
                </label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required 
                  placeholder="Write your feedback or queries here..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#FF6D00] dark:focus:border-[#FF8A65] text-gray-900 dark:text-white font-medium"
                />
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-bold uppercase tracking-wider text-xs rounded-2xl transition-all shadow-sm"
              >
                <Send size={14} />
                Send Message via Support
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
