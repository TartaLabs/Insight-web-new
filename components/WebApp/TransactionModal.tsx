import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield, Key, Wifi } from 'lucide-react';

interface TransactionModalProps {
  type: 'CLAIM' | 'UPGRADE' | 'APPROVE';
  title: string;
  amount?: string;
  cost?: string; // Gas or Price
  onClose: () => void;
  onSuccess: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ title, amount, cost, onClose, onSuccess }) => {
  const [step, setStep] = useState<'review' | 'approve' | 'sign' | 'broadcast' | 'success'>('review');

  useEffect(() => {
    if (step === 'approve') {
        setTimeout(() => setStep('sign'), 1500);
    }
    if (step === 'sign') {
        setTimeout(() => setStep('broadcast'), 1500);
    }
    if (step === 'broadcast') {
        setTimeout(() => setStep('success'), 2000);
    }
    if (step === 'success') {
        setTimeout(() => onSuccess(), 1500);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = () => {
      setStep('approve');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0a0a0f] border border-tech-blue/30 relative overflow-hidden">
         {/* Cyberpunk Corners */}
         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tech-blue" />
         <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tech-blue" />
         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tech-blue" />
         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tech-blue" />

         <div className="p-1 bg-tech-blue/10 border-b border-tech-blue/20">
             <div className="flex justify-between items-center px-4 py-2">
                 <span className="text-[10px] font-mono text-tech-blue tracking-widest">SECURE_CHANNEL_ESTABLISHED</span>
                 <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
                     <div className="w-1.5 h-1.5 bg-tech-blue/50 rounded-full" />
                     <div className="w-1.5 h-1.5 bg-tech-blue/20 rounded-full" />
                 </div>
             </div>
         </div>

         <div className="p-8 text-center">
             <AnimatePresence mode="wait">
                 {step === 'review' && (
                     <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <div className="w-16 h-16 mx-auto bg-tech-blue/10 rounded-full flex items-center justify-center mb-6 border border-tech-blue/30">
                             <Shield size={32} className="text-tech-blue" />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                         <div className="space-y-4 my-8">
                             {amount && (
                                 <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                     <span className="text-gray-400">Receive</span>
                                     <span className="text-green-400 font-mono font-bold">{amount}</span>
                                 </div>
                             )}
                             {cost && (
                                 <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                     <span className="text-gray-400">Est. Cost</span>
                                     <span className="text-white font-mono">{cost}</span>
                                 </div>
                             )}
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-400">Network</span>
                                 <span className="text-tech-blue font-mono">Mantle Mainnet</span>
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <button onClick={onClose} className="flex-1 py-3 border border-white/20 text-gray-400 font-bold text-xs hover:bg-white/5 transition-colors uppercase">Cancel</button>
                             <button onClick={handleConfirm} className="flex-1 py-3 bg-tech-blue text-black font-bold text-xs hover:bg-white transition-colors uppercase">Confirm</button>
                         </div>
                     </motion.div>
                 )}

                 {(step === 'approve' || step === 'sign' || step === 'broadcast') && (
                     <motion.div key="process" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                         <div className="relative w-20 h-20 mx-auto mb-6">
                             <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                             <div className="absolute inset-0 border-4 border-t-tech-blue rounded-full animate-spin" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 {step === 'approve' && <Shield size={24} className="text-tech-blue" />}
                                 {step === 'sign' && <Key size={24} className="text-tech-blue" />}
                                 {step === 'broadcast' && <Wifi size={24} className="text-tech-blue" />}
                             </div>
                         </div>
                         <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">
                             {step === 'approve' ? 'Requesting Approval' : step === 'sign' ? 'Signing Transaction' : 'Broadcasting'}
                         </h3>
                         <p className="text-xs text-gray-500 font-mono">Please confirm in your wallet...</p>
                         
                         <div className="mt-8 flex justify-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${step === 'approve' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`} />
                             <div className={`w-2 h-2 rounded-full ${step === 'sign' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`} />
                             <div className={`w-2 h-2 rounded-full ${step === 'broadcast' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`} />
                         </div>
                     </motion.div>
                 )}

                 {step === 'success' && (
                     <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                         <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                             <CheckCircle2 size={40} className="text-green-500" />
                         </div>
                         <h3 className="text-2xl font-bold text-white mb-2">TRANSACTION CONFIRMED</h3>
                         <p className="text-sm text-gray-400 mb-8">Block #18293402</p>
                     </motion.div>
                 )}
             </AnimatePresence>
         </div>
      </div>
    </div>
  );
};