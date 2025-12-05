import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { TaskFlow } from './TaskFlow';
import { UpgradeModal } from './UpgradeModal';
import { TransactionModal } from './TransactionModal';
import { Logo } from '../Logo';
import { UserProfile, TaskCounts, Transaction, LeaderboardEntry, EmotionType, PricingPlan, TaskRecord, Invitee } from '../../types';
import { LogOut } from 'lucide-react';

interface WebAppProps {
  onExit: () => void;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, nickname: 'Neo_X', address: '0x71...9A23', totalEarned: 54200 },
    { rank: 2, nickname: 'CyberPunk', address: '0x8A...22B1', totalEarned: 48100 },
    { rank: 3, nickname: 'Glitch01', address: '0xCC...1102', totalEarned: 32050 },
    { rank: 4, nickname: 'DataMiner', address: '0x1D...5599', totalEarned: 28000 },
    { rank: 5, nickname: 'ZeroCool', address: '0xEE...9911', totalEarned: 15400 },
];

const INITIAL_INVITEES: Invitee[] = [
    { id: '1', nickname: 'Alice_99', inviteDate: '2024-11-01', pendingReward: 4.5, claimedReward: 40.5, lastActive: '2h ago' },
    { id: '2', nickname: 'Bob_Eth', inviteDate: '2024-11-15', pendingReward: 1.0, claimedReward: 11.0, lastActive: '5m ago' },
    { id: '3', nickname: 'CryptoDave', inviteDate: '2024-10-20', pendingReward: 10.0, claimedReward: 78.0, lastActive: '1d ago' },
];

export const WebApp: React.FC<WebAppProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTaskEmotion, setActiveTaskEmotion] = useState<EmotionType | null>(null);
  const [activeDraftTask, setActiveDraftTask] = useState<TaskRecord | undefined>(undefined);

  // Transaction Modal State
  const [txModal, setTxModal] = useState<{
      isOpen: boolean;
      type: 'CLAIM' | 'UPGRADE' | 'APPROVE';
      title: string;
      amount?: string;
      cost?: string;
      onSuccessCallback?: () => void;
  }>({ isOpen: false, type: 'CLAIM', title: '' });

  const [user, setUser] = useState<UserProfile>({
      walletAddress: '',
      nickname: '',
      isPro: false,
      balanceMEMO: 0,
      pendingRewards: 0,
      invitationRewards: 15.5,
      balanceMNT: 0,
      balanceUSDT: 0,
      streakDays: 1,
      inviteCount: 3,
      lastResetDate: new Date().toISOString().split('T')[0],
  });

  const [taskCounts, setTaskCounts] = useState<TaskCounts>({});
  const [history, setHistory] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [invitees, setInvitees] = useState<Invitee[]>(INITIAL_INVITEES);
  
  // Simulation: Invitee activity
  useEffect(() => {
      const interval = setInterval(() => {
          if (Math.random() > 0.6) {
              const amount = 0.5;
              const randomInviteeIndex = Math.floor(Math.random() * invitees.length);
              
              setInvitees(prev => {
                  const newInvitees = [...prev];
                  newInvitees[randomInviteeIndex] = {
                      ...newInvitees[randomInviteeIndex],
                      pendingReward: newInvitees[randomInviteeIndex].pendingReward + amount
                  };
                  return newInvitees;
              });

              setUser(prev => ({
                  ...prev,
                  invitationRewards: prev.invitationRewards + amount
              }));
              
              setHistory(prev => [{
                  id: `inv-${Date.now()}`,
                  category: 'ISSUANCE',
                  source: 'Invitation',
                  amount: amount,
                  timestamp: Date.now(),
                  status: 'SUCCESS',
                  desc: `Commission from ${invitees[randomInviteeIndex].nickname}`
              }, ...prev]);
          }
      }, 8000); 
      return () => clearInterval(interval);
  }, [invitees]);

  useEffect(() => {
      const checkReset = () => {
          const now = new Date();
          const todayISO = now.toISOString().split('T')[0];
          if (todayISO !== user.lastResetDate) {
              setTaskCounts({});
              setUser(prev => ({ ...prev, lastResetDate: todayISO }));
          }
      };
      const interval = setInterval(checkReset, 60000);
      checkReset();
      return () => clearInterval(interval);
  }, [user.lastResetDate]);

  const handleLogin = (nickname: string) => {
      setUser(prev => ({ 
          ...prev, 
          nickname, 
          walletAddress: '0x71C...9A23',
          balanceMNT: 5.0,
          balanceUSDT: 100.0,
          balanceMEMO: 100
      }));
      setIsLoggedIn(true);
  };

  const handleSaveDraft = (record: TaskRecord) => {
      setTasks(prev => {
          const existing = prev.findIndex(t => t.id === record.id);
          if (existing !== -1) {
              const updated = [...prev];
              updated[existing] = record;
              return updated;
          }
          return [record, ...prev];
      });
      setActiveTaskEmotion(null);
      setActiveDraftTask(undefined);
  };

  const handleSubmitTask = (record: TaskRecord) => {
      // 1. DEDUCT COUNT IMMEDIATELY
      setTaskCounts(c => ({ ...c, [record.emotion]: (c[record.emotion] || 0) + 1 }));

      setTasks(prev => {
          const filtered = prev.filter(t => t.id !== record.id);
          return [{ ...record, status: 'AUDITING' }, ...filtered];
      });
      
      setActiveTaskEmotion(null);
      setActiveDraftTask(undefined);

      setTimeout(() => {
          const passed = Math.random() > 0.2; 
          
          setTasks(prev => prev.map(t => {
              if (t.id === record.id) {
                  return {
                      ...t,
                      status: passed ? 'LABELED' : 'REJECTED',
                      failReason: passed ? undefined : 'Blurry or Incorrect Emotion'
                  };
              }
              return t;
          }));

          if (passed) {
              setUser(u => ({ ...u, pendingRewards: u.pendingRewards + record.reward }));
              
              setHistory(h => [{
                  id: Date.now().toString(),
                  category: 'ISSUANCE',
                  source: 'Label Task',
                  amount: record.reward,
                  timestamp: Date.now(),
                  status: 'SUCCESS',
                  desc: 'Reward Issued'
              }, ...h]);
          }
      }, 5000);
  };

  const handleDeleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleResumeTask = (task: TaskRecord) => {
      setActiveDraftTask(task);
      setActiveTaskEmotion(task.emotion);
  };

  // --- TRIGGER TRANSACTION MODAL ---
  const triggerTransaction = (
      type: 'CLAIM' | 'UPGRADE' | 'APPROVE', 
      title: string, 
      amount: string | undefined,
      cost: string | undefined,
      action: () => void
  ) => {
      setTxModal({
          isOpen: true,
          type,
          title,
          amount,
          cost,
          onSuccessCallback: action
      });
  };

  const handleTxSuccess = () => {
      if (txModal.onSuccessCallback) {
          txModal.onSuccessCallback();
      }
      setTxModal(prev => ({ ...prev, isOpen: false }));
  };

  // --- ACTIONS ---

  const handleClaimAll = () => {
      const gasCost = 0.005;
      if (user.balanceMNT < gasCost) {
          alert('Insufficient MNT for Gas!');
          return;
      }
      if (user.pendingRewards <= 0) return;

      triggerTransaction('CLAIM', 'Claim Task Rewards', `+${user.pendingRewards} $mEMO`, `~${gasCost} MNT`, () => {
          const amount = user.pendingRewards;
          setUser(prev => ({ 
              ...prev, 
              balanceMNT: prev.balanceMNT - gasCost,
              balanceMEMO: prev.balanceMEMO + amount,
              pendingRewards: 0 
          }));

          setHistory(prev => [{
            id: Date.now().toString(),
            category: 'CLAIM',
            source: 'Label Task',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xabc...123',
            desc: 'Batch Claim Tasks'
          }, ...prev]);
      });
  };

  const handleClaimInvitationRewards = () => {
      const gasCost = 0.005;
      if (user.balanceMNT < gasCost) {
          alert('Insufficient MNT for Gas!');
          return;
      }
      if (user.invitationRewards <= 0) return;

      triggerTransaction('CLAIM', 'Claim Commissions', `+${user.invitationRewards.toFixed(1)} $mEMO`, `~${gasCost} MNT`, () => {
          const amount = user.invitationRewards;
          setUser(prev => ({ 
              ...prev, 
              balanceMNT: prev.balanceMNT - gasCost,
              balanceMEMO: prev.balanceMEMO + amount,
              invitationRewards: 0 
          }));
          
          setInvitees(prev => prev.map(inv => ({
              ...inv,
              claimedReward: inv.claimedReward + inv.pendingReward,
              pendingReward: 0
          })));

          setHistory(prev => [{
            id: Date.now().toString(),
            category: 'CLAIM',
            source: 'Invitation',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xdef...456',
            desc: 'Claimed Commissions'
          }, ...prev]);
      });
  };

  const handleClaimDailyBonus = () => {
      const gasCost = 0.002;
      if (user.balanceMNT < gasCost) {
          alert('Insufficient MNT for Gas!');
          return;
      }
      
      let amount = 0;
      if (user.proPlanId === 'monthly') amount = 5;
      if (user.proPlanId === 'quarterly') amount = 10;
      if (user.proPlanId === 'yearly') amount = 30;

      triggerTransaction('CLAIM', 'Claim Daily Bonus', `+${amount} $mEMO`, `~${gasCost} MNT`, () => {
          const today = new Date().toISOString().split('T')[0];
          setUser(prev => ({ 
            ...prev, 
            balanceMNT: prev.balanceMNT - gasCost,
            balanceMEMO: prev.balanceMEMO + amount,
            lastDailyBonusDate: today
          }));

          setHistory(prev => [{
              id: Date.now().toString(),
              category: 'ISSUANCE',
              source: 'Pro Daily',
              amount: amount,
              timestamp: Date.now(),
              status: 'SUCCESS',
              desc: 'Daily Bonus Issued'
          }, ...prev]);

          setHistory(prev => [{
            id: Date.now().toString() + '_claim',
            category: 'CLAIM',
            source: 'Pro Daily',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xghi...789',
            desc: 'Claimed Bonus'
          }, ...prev]);
      });
  };

  const handleRetryClaim = (tx: Transaction) => {
      const gasCost = 0.005; 
      if (user.balanceMNT < gasCost) {
          alert('Insufficient MNT for Gas!');
          return;
      }

      triggerTransaction('CLAIM', 'Retry Claim', `+${tx.amount} $mEMO`, `~${gasCost} MNT`, () => {
          setUser(prev => ({ ...prev, balanceMNT: prev.balanceMNT - gasCost }));
          
          setHistory(prev => prev.map(t => {
              if (t.id === tx.id) {
                  return { ...t, status: 'SUCCESS', txHash: '0xretry...999', timestamp: Date.now() };
              }
              return t;
          }));
      });
  };

  const handleUpgrade = (plan: PricingPlan) => {
     if (user.balanceUSDT < plan.usdtPrice) {
         alert('Insufficient USDT');
         return;
     }
     const gasCost = 0.01;
     if (user.balanceMNT < gasCost) {
         alert('Insufficient MNT for Gas');
         return;
     }

     triggerTransaction('UPGRADE', `Upgrade to ${plan.name}`, undefined, `-${plan.usdtPrice} USDT`, () => {
         const now = new Date();
         let daysToAdd = 30;
         if (plan.id === 'quarterly') daysToAdd = 90;
         if (plan.id === 'yearly') daysToAdd = 365;
         now.setDate(now.getDate() + daysToAdd);

         setUser(prev => ({ 
             ...prev, 
             isPro: true, 
             proPlanId: plan.id,
             proExpiryDate: now.toISOString(),
             balanceUSDT: prev.balanceUSDT - plan.usdtPrice,
             balanceMNT: prev.balanceMNT - gasCost,
         }));
         
         setHistory(prev => [{
            id: Date.now().toString(),
            category: 'SPEND',
            amount: 0,
            cost: `-${plan.usdtPrice} USDT`,
            timestamp: Date.now(),
            desc: `Upgraded to ${plan.name}`,
            status: 'SUCCESS',
            txHash: '0xplan...buy'
        }, ...prev]);
        setShowUpgrade(false);
     });
  };

  const getDailyLimit = () => {
      if (!user.isPro) return 2;
      if (user.proPlanId === 'monthly') return 3;
      if (user.proPlanId === 'quarterly') return 4;
      return 5;
  };

  const getRewardPerTask = () => {
      if (!user.isPro) return 2;
      if (user.proPlanId === 'monthly') return 3;
      if (user.proPlanId === 'quarterly') return 4;
      return 5;
  };

  if (!isLoggedIn) {
      return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
        {/* App Bar */}
        <div className="fixed top-0 w-full z-40 bg-[#020205]/90 backdrop-blur-md border-b border-tech-blue/20 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <Logo className="w-8 h-8" />
                <div className="hidden md:block">
                    <div className="font-bold tracking-tight font-mono text-tech-blue">INSIGHT_PROTOCOL</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-tech-blue/5 rounded border border-tech-blue/20 px-3 py-1">
                    <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-tech-blue tracking-widest">MANTLE_MAINNET</span>
                </div>
                
                <button 
                   onClick={onExit}
                   className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest group"
                >
                    <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Disconnect</span>
                </button>
            </div>
        </div>

        <Dashboard 
            user={user}
            tasks={tasks}
            taskCounts={taskCounts}
            dailyLimit={getDailyLimit()}
            rewardPerTask={getRewardPerTask()}
            history={history}
            leaderboard={MOCK_LEADERBOARD}
            invitees={invitees}
            onStartTask={(emo) => {
                setActiveDraftTask(undefined);
                setActiveTaskEmotion(emo);
            }}
            onResumeTask={handleResumeTask}
            onDeleteTask={handleDeleteTask}
            onUpgradeClick={() => setShowUpgrade(true)}
            onClaimAll={handleClaimAll}
            onClaimBonus={handleClaimDailyBonus}
            onRetryClaim={handleRetryClaim}
            onClaimInvitationRewards={handleClaimInvitationRewards}
        />

        {/* Overlays */}
        {activeTaskEmotion && (
            <TaskFlow 
                emotion={activeTaskEmotion}
                initialTask={activeDraftTask}
                rewardAmount={getRewardPerTask()}
                onSave={handleSaveDraft}
                onSubmit={handleSubmitTask}
                onCancel={() => {
                    setActiveTaskEmotion(null);
                    setActiveDraftTask(undefined);
                }}
            />
        )}

        {showUpgrade && (
            <UpgradeModal 
                user={user}
                onClose={() => setShowUpgrade(false)}
                onUpgrade={handleUpgrade}
            />
        )}

        {/* Transaction Simulation Modal */}
        {txModal.isOpen && (
            <TransactionModal 
                type={txModal.type}
                title={txModal.title}
                amount={txModal.amount}
                cost={txModal.cost}
                onClose={() => setTxModal(prev => ({ ...prev, isOpen: false }))}
                onSuccess={handleTxSuccess}
            />
        )}
    </div>
  );
};