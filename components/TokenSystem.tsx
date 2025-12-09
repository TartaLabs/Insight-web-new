import React from 'react';
import { Share2, Gift, History } from 'lucide-react';

export const TokenSystem: React.FC = () => {
  return (
    <div className="w-full container mx-auto px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-white">
            The Dual-Chain Economy
          </span>
        </h2>
        <p className="text-tech-gray text-center max-w-2xl text-base md:text-lg">
          A unified incentive layer. Earn <span className="text-blue-400">$aEMO</span> on Arbitrum via Mobile, or <span className="text-tech-blue">$mEMO</span> on Mantle via Web. Both serve as your soulbound proof of contribution to Emotion AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Referral Card */}
         <div className="bg-black/40 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-tech-blue/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-tech-blue">
               <Share2 size={100} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Referral Program</h3>
            <p className="text-sm text-gray-400 mb-6">Invite up to 10 friends and build your passive data income stream.</p>
            <div className="text-4xl font-bold text-tech-blue mb-2">5%</div>
            <p className="text-xs font-mono text-gray-500">COMMISSION ON INVITEES' EARNINGS</p>
         </div>

         {/* Airdrop Card */}
         <div className="bg-black/40 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-white/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
               <Gift size={100} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Future Airdrops</h3>
            <p className="text-sm text-gray-400 mb-6">Your token balance is the key to unlocking future governance rights.</p>
            <div className="text-xl font-bold text-white mb-2">Soulbound</div>
            <p className="text-xs font-mono text-gray-500">NON-TRANSFERABLE PROOF OF WORK</p>
         </div>

         {/* History Card */}
         <div className="bg-black/40 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-blue-400/30 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
               <History size={100} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Transparent Ledger</h3>
            <p className="text-sm text-gray-400 mb-6">Track every earned token from Tasks, Invites, and Bonuses.</p>
            <div className="space-y-2">
               <div className="flex justify-between text-xs text-gray-500 border-b border-white/5 pb-1">
                  <span>Task Reward</span>
                  <span className="text-tech-blue">+2 Tokens</span>
               </div>
               <div className="flex justify-between text-xs text-gray-500 border-b border-white/5 pb-1">
                  <span>Invite Bonus</span>
                  <span className="text-blue-400">+0.5 Tokens</span>
               </div>
               <div className="flex justify-between text-xs text-gray-500">
                  <span>Pro Daily</span>
                  <span className="text-[#FFD700] font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">+30 Tokens</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
