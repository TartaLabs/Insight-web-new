import React from 'react';
import { Edit2, Copy, Flame, Shield } from 'lucide-react';
import { UserProfile } from '../../types';
import { HudPanel } from '../ui';

interface UserInfoCardProps {
  user: UserProfile;
  onEditNickname: () => void;
  onCopyAddress: () => void;
}

/**
 * 用户信息卡片组件
 * 显示用户头像、昵称、钱包地址、连续登录天数和角色
 */
export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  onEditNickname,
  onCopyAddress,
}) => {
  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <HudPanel className="col-span-1 lg:col-span-2 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-5 w-full">
        {/* Avatar */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="absolute inset-0 border-2 border-tech-blue rounded-full animate-spin-slow border-dashed opacity-50" />
          <div className="absolute inset-2 bg-gradient-to-b from-blue-900 to-black rounded-full flex items-center justify-center border border-white/10">
            <span className="text-xl font-bold text-white">
              {user.nickname ? user.nickname.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          {user.isPro && (
            <div className="absolute -bottom-1 -right-1 bg-neon-purple text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
              PRO
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">
              {user.nickname}
            </h2>
            <button
              onClick={onEditNickname}
              className="text-gray-500 hover:text-tech-blue transition-colors"
              aria-label="Edit nickname"
            >
              <Edit2 size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <code className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">
              {formatAddress(user.walletAddress)}
            </code>
            <button
              onClick={onCopyAddress}
              className="text-gray-500 hover:text-tech-blue transition-colors"
            >
              <Copy size={12} />
            </button>
          </div>
          <div className="mt-3 mb-4 flex gap-4 text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <Flame size={12} className="text-red-500" />
              Streak: <span className="text-white">{user.streakDays} Days</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Shield size={12} className="text-tech-blue" />
              Role:{' '}
              <span className="text-white">
                {user.isPro ? 'Validating Node' : 'Light Node'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div className="flex gap-2 w-full md:w-auto">
        <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">
            MNT
          </div>
          <div className="text-sm font-bold text-white">
            {user.balanceMNT.toFixed(3)}
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">
            USDT
          </div>
          <div className="text-sm font-bold text-green-400">
            ${user.balanceUSDT.toFixed(3)}
          </div>
        </div>
      </div>
    </HudPanel>
  );
};

