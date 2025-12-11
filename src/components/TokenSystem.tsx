import React from 'react';

export const TokenSystem: React.FC = () => {
  const titleClass =
    'text-xl font-bold text-[#f8fbff] drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] leading-tight relative z-10';

  return (
    <div className="w-full container mx-auto px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tech-blue to-white">
            The Dual-Chain Economy
          </span>
        </h2>
        <p className="text-tech-gray text-center max-w-4xl text-base md:text-lg leading-relaxed mx-auto">
          A unified incentive layer. Earn <span className="text-blue-400">$aEMO</span> on Arbitrum
          via Mobile, or <span className="text-tech-blue">$mEMO</span> on Mantle via Web. Both serve
          as your soulbound proof of contribution to Emotion AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Referral Card */}
        <div className="bg-black/30 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-tech-blue/30 transition-all duration-300">
          <h3 className={titleClass}>Referral Program</h3>
          <p className="text-sm text-gray-400 mb-6">
            Invite up to 10 friends and build your passive data income stream.
          </p>
          <div className="text-4xl font-bold text-tech-blue mb-2">5%</div>
          <p className="text-xs font-mono text-gray-500">COMMISSION ON INVITEES' EARNINGS</p>
        </div>

        {/* Airdrop Card */}
        <div className="bg-black/30 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-white/30 transition-all duration-300">
          <h3 className={titleClass}>Future Airdrops</h3>
          <p className="text-sm text-gray-400 mb-6">
            Your token balance is the key to unlocking future governance rights.
          </p>
          <div className="text-xl font-bold text-white mb-2">Soulbound</div>
          <p className="text-xs font-mono text-gray-500">NON-TRANSFERABLE PROOF OF WORK</p>
        </div>

        {/* History Card */}
        <div className="bg-black/30 border border-white/10 p-8 rounded-xl relative overflow-hidden group hover:border-blue-400/30 transition-all duration-300">
          <h3 className={titleClass}>Transparent Ledger</h3>
          <p className="text-sm text-gray-400 mb-6">
            Track every earned token from Tasks, Invites, and Bonuses.
          </p>
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
              <span className="text-[#FFD700] font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                +30 Tokens
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
