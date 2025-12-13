import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { PricingPlan, UserProfile } from '../../../types';
import { Button } from './Button';

interface UpgradeModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpgrade: (plan: PricingPlan) => void;
}

const plans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'PRO MONTHLY',
    price: '$3.99',
    usdtPrice: 3.99,
    period: '/ month',
    dailyBonus: 5,
    dailyLimit: 3,
    rewardPerTask: 3,
    features: ['Daily Bonus: 5 $mEMO', 'Task Limit: 3x', 'Reward: 3 $mEMO'],
  },
  {
    id: 'quarterly',
    name: 'PRO QUARTERLY',
    price: '$9.99',
    usdtPrice: 9.99,
    period: '/ 3 months',
    dailyBonus: 10,
    dailyLimit: 4,
    rewardPerTask: 4,
    features: ['Daily Bonus: 10 $mEMO', 'Task Limit: 4x', 'Reward: 4 $mEMO'],
    recommended: true,
  },
  {
    id: 'yearly',
    name: 'PRO YEARLY',
    price: '$32.99',
    usdtPrice: 32.99,
    period: '/ year',
    dailyBonus: 30,
    dailyLimit: 5,
    rewardPerTask: 5,
    features: ['Daily Bonus: 30 $mEMO', 'Task Limit: 5x', 'Reward: 5 $mEMO', 'Airdrop Multiplier'],
  },
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ user, onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'approve' | 'pay' | 'done'>('select');
  const [error, setError] = useState<string | null>(null);
  const resetState = () => {
    setStep('select');
    setIsProcessing(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleProcess = () => {
    if (!selectedPlan) return;
    setError(null);
    setIsProcessing(true);

    // Simulate a realistic approve -> pay flow
    setStep('approve');
    setTimeout(() => {
      // mock allowance success
      setStep('pay');
      setTimeout(() => {
        const plan = plans.find((p) => p.id === selectedPlan);
        if (plan) onUpgrade(plan);
        setStep('done');
        setIsProcessing(false);
      }, 1800);
    }, 1500);
  };

  const selectedPlanDetails = plans.find((p) => p.id === selectedPlan);
  const canAfford = selectedPlanDetails ? user.balanceUSDT >= selectedPlanDetails.usdtPrice : false;
  const hasGas = user.balanceMNT > 0.002;

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
                Pay with <span className="text-green-400 font-bold">USDT</span> on Mantle Network
              </p>
              <div className="text-[11px] text-gray-500 font-mono mt-1">
                Wallet: {user.walletAddress || 'Connected'}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Your Balance</div>
                <div
                  className={`font-mono font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}
                >
                  {user.balanceUSDT.toFixed(3)} USDT
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
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-tech-blue bg-tech-blue/5'
                      : 'border-white/10 hover:border-white/30 bg-white/5'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-tech-blue text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      BEST VALUE
                    </div>
                  )}
                  <h3 className="font-mono text-sm text-gray-400 mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{plan.price}</div>
                  <p className="text-xs text-gray-500 mb-4">{plan.period}</p>

                  <ul className="space-y-2 mb-4">
                    {plan.features.map((f, i) => (
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
              <span className="text-white font-bold">{selectedPlanDetails?.name || 'None'}</span>
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
