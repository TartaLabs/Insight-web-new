import React, { useEffect } from 'react';
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
                Need assistance with your tasks or wallet connection? We're here to help.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
             <a href="#" className="bg-surface border border-white/10 p-6 rounded-xl hover:border-tech-blue/50 transition-colors group">
                <MessageCircle className="text-tech-blue mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-white">Discord Community</h3>
                <p className="text-sm text-gray-400">Join our server for real-time support from mods and the community.</p>
             </a>
             <a href="#" className="bg-surface border border-white/10 p-6 rounded-xl hover:border-tech-blue/50 transition-colors group">
                <Mail className="text-tech-blue mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-white">Email Support</h3>
                <p className="text-sm text-gray-400">For account-specific issues or business inquiries.</p>
             </a>
             <a href="#" className="bg-surface border border-white/10 p-6 rounded-xl hover:border-tech-blue/50 transition-colors group">
                <Book className="text-tech-blue mb-4" size={32} />
                <h3 className="font-bold text-lg mb-2 text-white">Documentation</h3>
                <p className="text-sm text-gray-400">Read the detailed guides on how to label data efficiently.</p>
             </a>
          </div>

          <div className="border-t border-white/10 pt-16">
             <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
             
             <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                   <h3 className="font-bold text-white mb-2">Why didn't I receive my $mEMO tokens?</h3>
                   <p className="text-gray-400 text-sm">
                      Tokens are distributed via the Mantle network. Please ensure your EOA wallet (MetaMask) is connected to the Mantle Mainnet. Transactions can take up to 2 minutes to index.
                   </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                   <h3 className="font-bold text-white mb-2">Can I transfer my tokens?</h3>
                   <p className="text-gray-400 text-sm">
                      No. $aEMO and $mEMO are Soulbound Tokens (SBTs) tied to your contribution history. They cannot be sent to other wallets.
                   </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                   <h3 className="font-bold text-white mb-2">My photo was rejected during audit. Why?</h3>
                   <p className="text-gray-400 text-sm">
                      Common reasons include: poor lighting, face not fully visible, or the expression does not match the selected emotion label. Please review the Data Specs guide.
                   </p>
                </div>
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};