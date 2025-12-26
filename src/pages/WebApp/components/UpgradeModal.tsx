import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, CreditCard, Loader2, X } from 'lucide-react';
import { Button } from './Button';
import { useProStore } from '@/store/proStore';
import { Pro } from '@/services/model/types';
import { useUserStore } from '@/store/userStore';
import { useAccount, useBalance } from 'wagmi';
import { formatBalance } from '@/utils';
import { useQueryConfig } from '@/services/useQueryConfig.ts';
import { useLocalStore } from '@/store/useLocalStore.ts';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: (proVersion: Pro) => void;
}

const getFeatures = (pro: Pro) => {
  return [
    `Daily Bonus: ${pro.benefits.daily_free_points} $mEMO`,
    `Task Limit: ${pro.benefits.daily_initial_annotation}x`,
    `Reward: ${pro.benefits.points_per_annotation} $mEMO`,
  ];
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState<Pro>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'approve' | 'pay' | 'done'>('select');
  const [error, setError] = useState<string | null>(null);
  const proVersionList = useProStore((state) => state.proVersionList);
  const getWalletAddress = useUserStore((state) => state.getWalletAddress);

  const { selectedChainId } = useLocalStore();

  const { data: nativeBalance } = useBalance({
    address: getWalletAddress() as `0x${string}`,
  });
  const { data: appConfig } = useQueryConfig();
  const [usdtAddress, setUsdtAddress] = useState<string>();
  const { chain } = useAccount();

  const { data: usdtBalance } = useBalance({
    address: getWalletAddress() as `0x${string}`,
    token: usdtAddress as `0x${string}`,
  });

  useEffect(() => {
    if (appConfig) {
      const usdt = appConfig.chains?.find(
        (chain) => chain.chain_id === selectedChainId.toString(),
      )?.usdt;
      setUsdtAddress(usdt);
    }
  }, [appConfig, selectedChainId]);

  const proList = proVersionList.filter((p) => p.is_pro);
  const resetState = () => {
    setStep('select');
    setIsProcessing(false);
    setError(null);
  };

  const isRecommend = (pro: Pro) => pro.pro_version === 'PRO_QUARTER';

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleProcess = () => {
    if (!selectedPlan) return;
    setError(null);
    setIsProcessing(true);

    setStep('approve');
    onUpgrade(selectedPlan);
  };

  const selectedPlanDetails = proList.find((p) => p.pro_version === selectedPlan?.pro_version);

  const canAfford = usdtBalance && usdtBalance.value > 0;
  const hasGas = nativeBalance.value > 5365440000000n;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="bg-[#0a0a0f] border border-white/10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="p-8">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h2 className="text-3xl font-bold">Upgrade to Pro</h2>
              <p className="text-gray-400 mt-2">
                Pay with <span className="text-green-400 font-bold">USDT</span> on {chain.name}{' '}
                Network
              </p>
              <div className="text-[11px] text-gray-500 font-mono mt-1">
                Wallet: {getWalletAddress() || 'Connected'}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Your Balance</div>
                <div
                  className={`font-mono font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}
                >
                  {usdtBalance ? formatBalance(usdtBalance?.value, usdtBalance?.decimals) : '0.00'}{' '}
                  USDT
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full border-white/15"
                aria-label="Close upgrade modal"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {step === 'select' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proList.map((pro) => (
                <div
                  key={pro.pro_version}
                  onClick={() => setSelectedPlan(pro)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                    selectedPlan?.pro_version === pro.pro_version
                      ? 'border-tech-blue bg-tech-blue/5'
                      : 'border-white/10 hover:border-white/30 bg-white/5'
                  }`}
                >
                  {isRecommend(pro) && (
                    <div className="absolute top-0 right-0 bg-tech-blue text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className="font-mono text-sm text-gray-400 mb-2">{pro.display_name}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{pro.benefits.price}</div>
                  <p className="text-xs text-gray-500 mb-4">{pro.benefits.duration} days</p>

                  <ul className="space-y-2 mb-4">
                    {getFeatures(pro).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check size={12} className="text-tech-blue" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'approve', label: 'Approve USDT' },
                  { id: 'pay', label: 'Pay with USDT' },
                  { id: 'done', label: 'Complete' },
                ].map((s) => {
                  const active = step === s.id;
                  const done =
                    (step === 'pay' && s.id === 'approve') ||
                    (step === 'done' && s.id !== 'select');
                  return (
                    <div
                      key={s.id}
                      className={`p-4 rounded border text-center ${active ? 'border-tech-blue bg-tech-blue/10 text-white' : done ? 'border-green-500/40 bg-green-500/10 text-green-200' : 'border-white/10 text-gray-400'}`}
                    >
                      <div className="text-sm font-bold">{s.label}</div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {active ? 'Waiting for wallet...' : done ? 'Done' : 'Pending'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-tech-blue animate-spin" />
                <div className="text-sm font-bold">
                  {step === 'approve' && 'Approving USDT allowance...'}
                  {step === 'pay' && 'Sending USDT payment...'}
                  {step === 'done' && 'Upgrade completed'}
                </div>
                {error && <div className="text-[11px] text-red-500">{error}</div>}
                {step === 'done' && (
                  <Button size="sm" onClick={handleClose}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {step === 'select' && (
          <div className="p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
            <div className="text-sm text-gray-400">
              Selected:{' '}
              <span className="text-white font-bold">
                {selectedPlanDetails?.display_name || 'None'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {selectedPlan && (!canAfford || !hasGas) && (
                <div className="flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle size={14} />
                  {!canAfford ? 'Insufficient USDT' : 'Insufficient MNT (Gas)'}
                </div>
              )}
              <Button
                disabled={!selectedPlan || isProcessing || !canAfford || !hasGas}
                onClick={handleProcess}
                className="min-w-[170px]"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <CreditCard size={18} />
                )}
                PAY WITH USDT
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
