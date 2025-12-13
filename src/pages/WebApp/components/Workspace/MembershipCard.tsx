import React from 'react';
import { Crown } from 'lucide-react';
import { HudPanel, GameButton } from '../ui';
import { useProStore } from '@/store/proStore';
import { useUserStore } from '@/store/userStore';

interface MembershipCardProps {
  hasClaimedBonus: boolean;
  onClaimBonus: () => void;
  onUpgradeClick: () => void;
}

/**
 * 会员等级卡片组件
 * 显示会员状态、每日奖励和升级按钮
 */
export const MembershipCard: React.FC<MembershipCardProps> = ({
  hasClaimedBonus,
  onClaimBonus,
  onUpgradeClick,
}) => {
  const pro = useProStore((state) => state.pro);
  const user = useUserStore((state) => state.user);

  return (
    <HudPanel className="col-span-1 lg:col-span-1 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Crown size={16} className={pro.is_pro ? 'text-neon-purple' : 'text-gray-600'} />
        <span className="text-xs font-bold uppercase tracking-wider text-white">Node Status</span>
      </div>

      <div className="space-y-1">
        <div className="text-sm text-gray-400">Current Tier</div>
        <div
          className={`text-xl font-bold ${pro.is_pro ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]' : 'text-gray-500'}`}
        >
          {pro.is_pro ? 'PRO ACCESS' : 'BASIC ACCESS'}
        </div>
        {pro.is_pro && user.pro_version_expires_at && (
          <div className="text-[10px] text-gray-600">
            Sync Ends: {new Date(user.pro_version_expires_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="bg-white/5 p-3 rounded border border-white/10 mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase text-gray-400">Daily Drop</span>
          <span className="text-xs font-bold text-white">+{pro.benefits.daily_free_points}</span>
        </div>
        {pro.is_pro ? (
          <GameButton
            onClick={onClaimBonus}
            disabled={hasClaimedBonus}
            className="w-full text-[10px] py-1.5"
          >
            {hasClaimedBonus ? 'RECEIVED' : 'CLAIM DROP'}
          </GameButton>
        ) : (
          <GameButton onClick={onUpgradeClick} className="w-full text-[10px] py-1.5">
            Unlock Pro
          </GameButton>
        )}
        {pro.is_pro && (
          <GameButton
            onClick={onUpgradeClick}
            variant="ghost"
            className="w-full mt-2 text-[9px] py-1.5"
          >
            Manage Plan
          </GameButton>
        )}
      </div>
    </HudPanel>
  );
};
