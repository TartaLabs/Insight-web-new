import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Zap, Shield, ChevronRight } from 'lucide-react';

const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const GooglePlayLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
     <path d="M5 3v18l15-9-15-9z" />
  </svg>
);

interface PlatformShowcaseProps {
  onLaunch?: () => void;
}

export const PlatformShowcase: React.FC<PlatformShowcaseProps> = ({ onLaunch }) => {
  return (
    <div className="w-full py-12 container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          <span className="text-white">Choose Your Interface</span>
        </h2>
        <p className="text-tech-gray max-w-4xl mx-auto text-lg leading-relaxed">
          Insight is available wherever you are. Mobile users enjoy seamless onboarding via Sequence AA on BNB Chain, while Web users retain full control via EOA on Mantle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Mobile Platform */}
        <motion.div 
          className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-400/30 transition-colors duration-500"
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 pointer-events-none" />
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex items-center justify-between mb-8">
               <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                 <Smartphone size={32} />
               </div>
               <div className="px-4 py-1 rounded-full border border-blue-400/30 bg-blue-400/5 text-blue-400 text-xs font-mono tracking-widest">
                 BNB CHAIN
               </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">Insight Mobile</h3>
            <p className="text-gray-400 mb-8 h-12">Capture expressions on the go. Powered by Sequence AA for passwordless, seedless entry.</p>

            <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
               <div className="flex items-center gap-3 text-gray-300">
                  <Shield size={16} className="text-blue-400" />
                  <span>Sequence AA Wallet</span>
               </div>
               <div className="flex items-center gap-3 text-gray-300">
                  <Zap size={16} className="text-blue-400" />
                  <span>Earn $bEMO</span>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => alert('Coming Soon')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 rounded font-bold hover:opacity-90 transition-opacity shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
              >
                <AppleLogo height={18} width={18} />
                <span>Apple Store</span>
              </button>
              <a 
                href="https://play.google.com/store/apps/details?id=io.tartalabs.insight" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white py-4 rounded font-bold hover:bg-white/10 transition-colors"
              >
                 <GooglePlayLogo height={18} width={18} />
                 <span>Google Play</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Web Platform */}
        <motion.div 
          className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-tech-blue/30 transition-colors duration-500"
          whileHover={{ y: -5 }}
        >
          <div className="absolute inset-0 pointer-events-none" />
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex items-center justify-between mb-8">
               <div className="w-16 h-16 bg-tech-blue/10 rounded-xl flex items-center justify-center text-tech-blue">
                 <Monitor size={32} />
               </div>
               <div className="px-4 py-1 rounded-full border border-tech-blue/30 bg-tech-blue/5 text-tech-blue text-xs font-mono tracking-widest">
                 MANTLE CHAIN
               </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-2">Insight Web</h3>
            <p className="text-gray-400 mb-8 h-12">Professional labeling station. Connect your EOA wallet (MetaMask, etc) to contribute.</p>

            <div className="grid grid-cols-2 gap-4 mb-10 text-sm">
               <div className="flex items-center gap-3 text-gray-300">
                  <Shield size={16} className="text-tech-blue" />
                  <span>EOA Wallet Login</span>
               </div>
               <div className="flex items-center gap-3 text-gray-300">
                  <Zap size={16} className="text-tech-blue" />
                  <span>Earn $mEMO</span>
                </div>
            </div>

            <button 
              onClick={onLaunch}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded font-bold hover:bg-tech-blue hover:text-black transition-colors border border-white/20"
            >
                 <span>Launch Web App</span>
                 <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
