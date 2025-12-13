import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LifeBuoy, Mail, MessageCircle, Book } from 'lucide-react';
import { Logo } from './Logo';

interface PageProps {
  onBack: () => void;
}

export const Support: React.FC<PageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openSection, setOpenSection] = useState<string | null>('getting');
  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-deep-bg text-white pt-24 pb-20 px-6">
      <nav className="fixed top-0 left-0 w-full bg-deep-bg/90 backdrop-blur-md border-b border-white/5 z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-tech-blue transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO INSIGHT
        </button>
        <Logo className="w-6 h-6" />
      </nav>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
             <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 mx-auto">
                <LifeBuoy size={32} className="text-blue-400" />
             </div>
             <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
             <p className="text-gray-400 text-lg">
                Welcome to the Insight Support Center.<br />
                Here you will find user guides, FAQ, token information, account rules, and data/privacy details.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
             <a 
               href="https://discord.gg/pfeaKXGkrK" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-surface border border-white/10 p-6 rounded-xl hover:border-tech-blue/50 transition-colors group w-full"
             >
                <MessageCircle className="text-tech-blue mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-white">Discord Community</h3>
                <p className="text-sm text-gray-400">Join our server for real-time support from mods and the community.</p>
             </a>
             <a 
               href="mailto:official@tartalabs.io"
               className="bg-surface border border-white/10 p-6 rounded-xl hover:border-tech-blue/50 transition-colors group w-full"
             >
                <Mail className="text-tech-blue mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-white">Email Support</h3>
                <p className="text-sm text-gray-400">For account-specific issues or business inquiries.</p>
             </a>
          </div>

          <div className="border-t border-white/10 pt-16 space-y-6 text-sm text-gray-300 leading-relaxed">
            <details open className="space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Getting Started</summary>
              <h3 className="text-lg md:text-xl font-extrabold text-white">What is Insight?</h3>
              <p>
                Insight is a platform designed for collecting and labeling facial emotion data. Users upload selfies, complete labeling tasks, and contribute to the training of our multi-modal Emotion AI model while earning on-chain contribution rewards. Insight supports iOS, Android, and Web (Mantle chain).
              </p>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Account & Security</summary>
              <h4 className="text-lg md:text-xl font-extrabold text-white">How do I create an account?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>iOS / Android:</strong> Login with email verification (an AA smart wallet will be created automatically).</li>
                <li><strong>Web (Mantle):</strong> Login via Web3 wallets such as MetaMask or OKX.</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">How do I delete my account?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>iOS / Android:</strong> Supported — Path: Me → Settings → Delete Account. Once deleted, the account cannot be recovered.</li>
                <li><strong>Web:</strong> Not supported — Web uses wallet-based authentication and does not create traditional accounts.</li>
              </ul>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Tokens & Rewards</summary>
              <h4 className="text-lg md:text-xl font-extrabold text-white">What rewards does Insight provide?</h4>
              <p>Insight distributes non-transferable contribution tokens:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>$bEMO (BNB Chain) — iOS / Android</strong></li>
                <li><strong>$mEMO (Mantle Chain) — Web</strong></li>
              </ul>
              <p>Both tokens are:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Non-transferable</li>
                <li>Not tradable on exchanges</li>
                <li>Not redeemable for cash</li>
                <li>Not investment products</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Can tokens be sold or withdrawn?</h4>
              <p>No. $bEMO and $mEMO cannot be exchanged for fiat or traded in secondary markets.</p>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Will there be future airdrops or benefits?</h4>
              <p>Insight may launch future reward or incentive programs, but nothing is guaranteed.</p>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Labeling Tasks & Review</summary>
              <h4 className="text-lg md:text-xl font-extrabold text-white">How to ensure your submission passes review?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Good lighting</li>
                <li>Face unobstructed</li>
                <li>Expression clearly matches the selected emotion</li>
                <li>Avoid heavy beautifying filters</li>
                <li>Avoid deliberate or unnatural posing</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Why was my submission rejected?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Emotion does not match the selected task</li>
                <li>Blurry or low-quality image</li>
                <li>Repetitive or spam submissions</li>
                <li>AI review deemed the expression inaccurate</li>
              </ul>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Insight Pro Subscription</summary>
              <h4 className="text-lg md:text-xl font-extrabold text-white">What are the benefits of becoming a Pro user?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Higher daily task limits</li>
                <li>Higher token rewards</li>
                <li>Additional daily bonuses</li>
                <li>Future benefit multipliers</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">How to cancel your subscription?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>iOS: Apple ID → Subscriptions</li>
                <li>Android: Google Play → Payments & Subscriptions</li>
                <li>Web: Not applicable (Web does not use subscription payments)</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Refund Policy</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mobile refunds are handled by Apple / Google according to their policies</li>
                <li>Web payments are non-refundable (due to on-chain transaction finality)</li>
              </ul>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Privacy & Data</summary>
              <p>Insight collects only the data you submit voluntarily (selfies + labels). Data may be used for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Training and improving our emotion AI models</li>
                <li>Research and analysis (anonymized or aggregated)</li>
                <li>System security and fraud prevention</li>
              </ul>
              <p>Insight does not sell user data.</p>
              <p>Full documents:<br />
                🔗 Privacy Policy: https://insight.tartalabs.io/#/privacy<br />
                🔗 Terms of Use: https://insight.tartalabs.io/#/terms
              </p>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Frequently Asked Questions</summary>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Why didn’t I receive my rewards?</h4>
              <p>Possible reasons:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Submission failed AI review</li>
                <li>Daily limit reached</li>
                <li>Abnormal activity detected</li>
              </ul>
              <h4 className="text-lg md:text-xl font-extrabold text-white">Why can’t I complete my subscription payment?</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>iOS: Region restrictions in App Store</li>
                <li>Android: Google Play not authorized</li>
                <li>Web: Insufficient wallet balance</li>
              </ul>
            </details>

            <details className="border-t border-white/5 pt-6 space-y-3">
              <summary className="text-2xl md:text-3xl font-extrabold text-white cursor-pointer select-none">📌 Contact Us</summary>
              <p>For support, feedback, or business inquiries, please reach out:</p>
              <p>📩 official@tartalabs.io<br />
              (Recommended subject format: Insight Support – Issue Type)</p>
              <p>We reply within 1–2 business days.</p>
            </details>
          </div>

        </motion.div>
      </div>
    </div>
  );
};
