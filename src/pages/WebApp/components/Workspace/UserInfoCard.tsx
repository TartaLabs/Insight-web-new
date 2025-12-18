import React, { useEffect, useState } from 'react';
import { Copy, Edit2, Flame, Shield } from 'lucide-react';
import { GameButton, HudPanel } from '../ui';
import { useUserStore } from '@/store/userStore';
import { useProStore } from '@/store/proStore';
import { copyToClipboard, formatBalance, getAppChainId } from '@/utils';
import { NicknameEditModal } from '../modals/NicknameEditModal';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { useQueryConfig } from '@/services/useQueryConfig.ts';
import { tUSDTAbi } from '@/assets/tUSDT.ts';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';

/**
 * 用户信息卡片组件
 * 显示用户头像、昵称、钱包地址、连续登录天数和角色
 */
export const UserInfoCard: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const getWalletAddress = useUserStore((state) => state.getWalletAddress);
  const pro = useProStore((state) => state.pro);
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');

  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  const { chain } = useAccount();
  const { data: nativeBalance } = useBalance({
    address: getWalletAddress() as `0x${string}`,
  });
  const { data: appConfig } = useQueryConfig();

  const [usdtAddress, setUsdtAddress] = useState<string>();

  const { data: tokenBalance } = useBalance({
    address: getWalletAddress() as `0x${string}`,
    token: usdtAddress as `0x${string}`,
  });

  const [mintLoading, setMintLoading] = useState(false);

  const { writeContractAsync } = useWriteContract({});

  useEffect(() => {
    if (appConfig) {
      const usdt = appConfig.chains?.find((chain) => chain.chain_id === `${getAppChainId()}`)?.usdt;
      setUsdtAddress(usdt);
    }
  }, [appConfig]);

  async function mintUSDT() {
    setMintLoading(true);
    const wallet = getWalletAddress() as `0x${string}`;
    try {
      const tx = await writeContractAsync({
        abi: tUSDTAbi,
        address: usdtAddress as `0x${string}`,
        functionName: 'mint',
        args: [wallet, parseEther('100')],
        chain: undefined,
        account: wallet,
      });
      console.log(`mint tx: ${tx}`);
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
    }
    setMintLoading(false);
  }

  return (
    <>
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
            {pro.is_pro && (
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
                onClick={() => setNicknameModalOpen(true)}
                className="text-gray-500 hover:text-tech-blue transition-colors"
                aria-label="Edit nickname"
              >
                <Edit2 size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <code className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                {formatAddress(getWalletAddress() || '')}
              </code>
              <button
                onClick={() => copyToClipboard(getWalletAddress() || '', 'Address copied')}
                className="text-gray-500 hover:text-tech-blue transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
            <div className="mt-3 mb-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1 text-gray-400">
                <Flame size={12} className="text-red-500" />
                Streak: <span className="text-white">{user.login_streak} Days</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Shield size={12} className="text-tech-blue" />
                Role:{' '}
                <span className="text-white">{pro.is_pro ? 'Validating Node' : 'Light Node'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px] flex flex-col justify-between">
            <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
              {chain?.nativeCurrency?.symbol || 'ETH'}
            </div>
            <div className="text-sm font-bold text-white">
              {formatBalance(nativeBalance?.value, nativeBalance?.decimals)}
            </div>
          </div>
          <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
            <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">USDT</div>
            <div className="text-sm font-bold text-green-400 flex flex-row gap-4 items-center justify-between">
              {tokenBalance ? formatBalance(tokenBalance.value, tokenBalance.decimals, 2) : '0.00'}
              <GameButton
                loading={mintLoading}
                onClick={mintUSDT}
                className="text-[10px] py-0.5 px-[10px]"
              >
                Claim
              </GameButton>
            </div>
          </div>
        </div>
      </HudPanel>
      {nicknameModalOpen && (
        <NicknameEditModal
          currentNickname={user.nickname}
          onClose={() => setNicknameModalOpen(false)}
        />
      )}
    </>
  );
};
