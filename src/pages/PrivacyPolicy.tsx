import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
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
            <Shield size={32} />
            <h1 className="text-3xl font-display font-black tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Last updated: May 2026 • For Jainism GPT</p>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            At <strong>Jainism GPT</strong>, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Jainism GPT and how we use it.
          </p>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Log Files
            </h2>
            <p>
              Jainism GPT follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Cookies and Web Beacons
            </h2>
            <p>
              Like any other website, Jainism GPT uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Google DoubleClick DART Cookie
            </h2>
            <p>
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to several websites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#FF6D00] dark:text-[#FF8A65] underline">google.com/technologies/ads</a>.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Advertising Partners Privacy Policies
            </h2>
            <p>
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Jainism GPT, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p className="text-xs text-gray-500">
              Note that Jainism GPT has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Third Party Privacy Policies
            </h2>
            <p>
              Jainism GPT's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Children's Information
            </h2>
            <p>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p>
              Jainism GPT does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </section>

          <section className="space-y-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Consent
            </h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
            </p>
          </section>

          <section className="space-y-4 bg-gradient-to-br from-[#FF6D00]/10 to-[#FFD54F]/10 border border-[#FF6D00]/20 p-6 rounded-2xl text-center">
            <h3 className="text-md font-bold text-gray-900 dark:text-white">Questions or Suggestions?</h3>
            <p className="text-sm">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
            </p>
            <a 
              href="https://instagram.com/_officialsamiljain_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-white dark:text-black font-bold uppercase tracking-wider text-xs rounded-full hover:scale-105 transition-all shadow-md"
            >
              Contact Samil Jain on Instagram
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
