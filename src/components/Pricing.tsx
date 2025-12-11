import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'BASIC',
    price: 'Free',
    period: 'Forever',
    dailyBonus: 0,
    dailyLimit: 2,
    rewardPerTask: 2,
    features: ['Access to all 7 emotions', 'Basic Airdrop Eligibility', 'Community Support'],
    usdtPrice: 0,
  },
  {
    id: 'monthly',
    name: 'PRO MONTHLY',
    price: '$3.99',
    period: '/ month',
    dailyBonus: 5,
    dailyLimit: 3,
    rewardPerTask: 3,
    features: [
      'Daily Login Bonus: 5 $mEMO',
      'Task Limit: 3x / Emotion',
      'Reward Multiplier: 3 $mEMO',
      'Priority Airdrop Weight',
    ],
    usdtPrice: 3.99,
  },
  {
    id: 'quarterly',
    name: 'PRO QUARTERLY',
    price: '$9.99',
    period: '/ 3 months',
    dailyBonus: 10,
    dailyLimit: 4,
    rewardPerTask: 4,
    features: [
      'Daily Login Bonus: 10 $mEMO',
      'Task Limit: 4x / Emotion',
      'Reward Multiplier: 4 $mEMO',
      'Enhanced Airdrop Weight',
    ],
    recommended: true,
    usdtPrice: 9.99,
  },
  {
    id: 'yearly',
    name: 'PRO YEARLY',
    price: '$32.99',
    period: '/ year',
    dailyBonus: 30,
    dailyLimit: 5,
    rewardPerTask: 5,
    features: [
      'Daily Login Bonus: 30 $mEMO',
      'Task Limit: 5x / Emotion',
      'Reward Multiplier: 5 $mEMO',
      'Max Airdrop Weight',
      'Future DAO Governance',
    ],
    usdtPrice: 32.99,
  },
];

export const Pricing: React.FC = () => {
  return (
    <div className="w-full py-24 container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl font-bold mb-4">Upgrade Your Node</h2>
          <p className="text-gray-400 text-lg">
            Maximize your contribution efficiency and $mEMO earnings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-6 rounded-2xl flex flex-col border ${plan.recommended ? 'bg-white/5 border-neon-purple/50 shadow-[0_0_30px_rgba(188,19,254,0.15)]' : 'bg-[#0a0a10] border-white/10'}`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-purple text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-widest">
                RECOMMENDED
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-mono text-gray-400 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-3xl font-bold ${plan.recommended ? 'text-neon-purple' : 'text-white'}`}
                >
                  {plan.price}
                </span>
                <span className="text-xs text-gray-500">{plan.period}</span>
              </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="bg-black/40 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase">Limit</div>
                <div className="text-lg font-bold text-white">
                  {plan.dailyLimit}x{' '}
                  <span className="text-[10px] font-normal text-gray-600">/emo</span>
                </div>
              </div>
              <div className="bg-black/40 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase">Earn</div>
                <div className="text-lg font-bold text-neon-blue">
                  {plan.rewardPerTask}{' '}
                  <span className="text-[10px] font-normal text-gray-600">$mEMO</span>
                </div>
              </div>
              <div className="col-span-2 bg-black/40 p-2 rounded border border-white/5 flex justify-between items-center">
                <div className="text-[10px] text-gray-500 uppercase">Daily Bonus</div>
                <div className="text-lg font-bold text-neon-pink">+{plan.dailyBonus}</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                  <Check
                    size={14}
                    className={plan.recommended ? 'text-neon-purple' : 'text-gray-500'}
                  />
                  {feat}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 text-xs font-bold tracking-widest rounded transition-all ${
                plan.recommended
                  ? 'bg-neon-purple text-white hover:bg-white hover:text-black'
                  : plan.id === 'basic'
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'border border-white/20 text-white hover:border-white'
              }`}
            >
              {plan.id === 'basic' ? 'CURRENT PLAN' : 'UPGRADE'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
