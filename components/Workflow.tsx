import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Camera, CheckCircle2, Coins, BrainCircuit } from 'lucide-react';

const steps = [
  { id: 1, title: 'Connect', desc: 'Mobile (Sequence AA) or Web (EOA)', icon: <Wallet size={24} /> },
  { id: 2, title: 'Capture', desc: 'Select Emotion & Take Selfie', icon: <Camera size={24} /> },
  { id: 3, title: 'Label', desc: 'Answer 5 Quality Questions', icon: <CheckCircle2 size={24} /> },
  { id: 4, title: 'Audit', desc: 'AI Verification Process', icon: <BrainCircuit size={24} /> },
  { id: 5, title: 'Earn', desc: 'Receive Token Rewards', icon: <Coins size={24} /> },
];

export const Workflow: React.FC = () => {
  return (
    <div className="w-full relative">
      <div className="container mx-auto px-6 lg:px-8 xl:px-10 relative">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-white">Contribution Pipeline</h2>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden md:block">
             <motion.div 
               className="h-full bg-gradient-to-r from-tech-blue via-white to-tech-blue"
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 2, ease: "linear" }}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[#111116] border border-white/10 flex items-center justify-center mb-6 group-hover:border-tech-blue group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all duration-300">
                  <div className="text-gray-400 group-hover:text-tech-blue transition-colors">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-gray-500 max-w-[140px]">{step.desc}</p>
                
                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                   <div className="md:hidden w-1 h-8 bg-white/10 my-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
            <div className="inline-block bg-white/5 border border-white/10 rounded-lg px-6 py-4">
                <p className="text-xs font-mono text-tech-blue mb-1">SYSTEM RESET</p>
                <p className="text-sm text-gray-300">Tasks reset daily at <span className="text-white font-bold">00:00 (UTC)</span></p>
            </div>
        </div>
      </div>
    </div>
  );
};
