import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wallet, ArrowRight, Check } from 'lucide-react';
import { Logo } from '../Logo';

interface LoginProps {
  onLoginSuccess: (nickname: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Wallet Connect, 2: Onboarding
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setWalletAddress('0x71C...9A23');
      setIsConnecting(false);
      setStep(2);
    }, 1500);
  };

  const handleEnterApp = () => {
    if (nickname.trim() && agreed) {
      onLoginSuccess(nickname);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050509] relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tech-blue/5 rounded-full blur-[100px]" />

      <motion.div 
        className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-center mb-8">
           <Logo className="w-12 h-12" />
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Connect Wallet</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">Select your provider to access Insight Web.</p>

            <div className="space-y-3">
              <button 
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-white/5 border border-white/10 hover:border-tech-blue/50 p-4 rounded-lg flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Wallet size={16} className="text-orange-500" />
                   </div>
                   <span className="font-bold">MetaMask</span>
                </div>
                {isConnecting ? (
                   <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                   <ArrowRight size={16} className="text-gray-500 group-hover:text-tech-blue group-hover:translate-x-1 transition-all" />
                )}
              </button>

              <button disabled className="w-full bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Shield size={16} className="text-blue-500" />
                   </div>
                   <span className="font-bold">OKX Wallet</span>
                </div>
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-6 font-mono">
               Network: <span className="text-tech-blue">Mantle Mainnet</span>
            </p>
          </>
        ) : (
          <>
             <h2 className="text-2xl font-bold text-center mb-2">Welcome, Contributor</h2>
             <p className="text-gray-400 text-center mb-8 text-sm font-mono text-tech-blue bg-tech-blue/5 py-1 rounded">{walletAddress}</p>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nickname</label>
                   <input 
                      type="text" 
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter a display name"
                      className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 focus:border-tech-blue focus:outline-none transition-colors"
                   />
                </div>

                <div 
                   className="flex items-start gap-3 cursor-pointer group"
                   onClick={() => setAgreed(!agreed)}
                >
                   <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-tech-blue border-tech-blue' : 'border-gray-600 group-hover:border-gray-400'}`}>
                      {agreed && <Check size={12} className="text-black" />}
                   </div>
                   <p className="text-xs text-gray-400 leading-relaxed">
                      I agree to the <span className="text-white hover:underline">Privacy Policy</span> and <span className="text-white hover:underline">User Manual</span>. I understand my data will be used for AI training.
                   </p>
                </div>

                <button 
                  onClick={handleEnterApp}
                  disabled={!nickname.trim() || !agreed}
                  className={`w-full py-4 rounded font-bold tracking-wide transition-all ${
                     !nickname.trim() || !agreed 
                     ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                     : 'bg-gradient-to-r from-blue-600 to-tech-blue text-white hover:shadow-lg hover:shadow-blue-500/20'
                  }`}
                >
                   ENTER INSIGHT
                </button>
             </div>
          </>
        )}
      </motion.div>
    </div>
  );
};