import { FileText, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 p-6 pb-24 font-sans selection:bg-[#FF6D00]/20">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <header className="mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-3 text-[#FF6D00] dark:text-[#FF8A65] mb-2">
            <ShieldAlert size={32} />
            <h1 className="text-3xl font-display font-black tracking-tight">Terms & Conditions</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Last updated: May 2026 • For Jainism GPT</p>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            Welcome to <strong>Jainism GPT</strong>! These terms and conditions outline the rules and regulations for the use of Jainism GPT's Application and website service.
          </p>

          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Jainism GPT if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              License
            </h2>
            <p>
              Unless otherwise stated, Jainism GPT and/or its licensors own the intellectual property rights for all material on Jainism GPT. All intellectual property rights are reserved. You may access this from Jainism GPT for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Republish material from Jainism GPT</li>
              <li>Sell, rent, or sub-license material from Jainism GPT</li>
              <li>Reproduce, duplicate, or copy material from Jainism GPT</li>
              <li>Redistribute content from Jainism GPT</li>
            </ul>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Divine Content Accuracy
            </h2>
            <p>
              The content provided in Jainism GPT is sourced from traditional literature, including Aagams, Bhaktamar Stotras, Panchang, and authentic Jain scriptures. While we try our best to keep this divine wisdom authentic and accurate, the spiritual outputs provided by AI are simulated and should be benchmarked with senior scholars / Jain ascetics for critical practice.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Hyperlinking to our Content
            </h2>
            <p>
              Organizations may link to our home page or public sections so long as the link is not in any way deceptive, does not falsely imply sponsorship or endorsement, and fits within the context of the linking party’s site.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Disclaimer
            </h2>
            <p>
              To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury, fraud, or misrepresentation.
            </p>
          </section>

          <section className="space-y-4 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/10 border border-[#FF6D00]/20 p-6 rounded-2xl text-center">
            <h3 className="text-md font-bold text-gray-900 dark:text-white">Need Clarification?</h3>
            <p className="text-sm">
              If you have any queries regarding any of our terms, please feel free to reach out to us:
            </p>
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-full hover:scale-105 transition-all shadow-md"
            >
              Contact Samil Jain
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
