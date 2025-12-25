import React from 'react';
import { Wallet, Coins } from 'lucide-react';
import { HudPanel, GameButton } from '../ui';
import { useUserStore } from '@/store/userStore';
import { useQueryClaimableAmount } from '@/services/useQueryClaimableAmount.ts';
import { formatUnits } from 'viem';

interface WalletCardProps {
  onClaimAll: () => void;
}

/**
 * 钱包卡片组件
 * 显示总收益、待领取奖励和领取按钮
 */
export const WalletCard: React.FC<WalletCardProps> = ({ onClaimAll }) => {
  const { user } = useUserStore((state) => ({
    user: state.user,
    pendingRewards: state.pendingRewards,
  }));

  const { data } = useQueryClaimableAmount('DAILY');
  const claimableAmount = BigInt(data?.claimable_amount ?? 0);

  return (
    <HudPanel className="col-span-1 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[10px] text-tech-blue uppercase tracking-[0.2em] mb-1">
            TOTAL EARNINGS
          </div>
          <div className="text-3xl font-bold text-white flex items-baseline gap-1">
            {user.token_amount ? formatUnits(BigInt(user.token_amount), 9) : '0'}{' '}
            <span className="text-sm font-normal text-gray-500">$mEMO</span>
          </div>
        </div>
        <div className="p-2 bg-tech-blue/10 rounded-full">
          <Wallet size={20} className="text-tech-blue" />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-gray-400">UNCLAIMED LOOT</div>
          <div
            className={`text-sm font-bold  ${claimableAmount > 0 ? 'text-tech-blue' : 'text-gray-400'}`}
          >
            +{formatUnits(claimableAmount, 9)}
          </div>
        </div>
        <GameButton
          onClick={onClaimAll}
          disabled={claimableAmount <= 0}
          className="w-full flex items-center justify-center gap-2"
        >
          <Coins size={14} /> EXTRACT LOOT
        </GameButton>
      </div>
    </HudPanel>
  );
};
