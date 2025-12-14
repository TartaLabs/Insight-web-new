import React, { useCallback, useEffect, useState } from 'react';
import { Invitee, LeaderboardEntry, SubscriptionRecord, Transaction } from '../types';
import { useInviteCode } from './useInviteCode';
import { useTransaction } from './useTransaction';
import { User } from '@/services/model/types.ts';

// Mock data generators
const generateLeaderboard = (): LeaderboardEntry[] => {
  const base: LeaderboardEntry[] = [
    { rank: 1, nickname: 'Neo_X', address: '0x71...9A23', totalEarned: 54200 },
    {
      rank: 2,
      nickname: 'CyberPunk',
      address: '0x8A...22B1',
      totalEarned: 48100,
    },
    {
      rank: 3,
      nickname: 'Glitch01',
      address: '0xCC...1102',
      totalEarned: 32050,
    },
  ];
  let total = 28000;
  for (let i = 4; i <= 1000; i++) {
    total = Math.max(100, total - Math.floor(Math.random() * 80 + 20));
    base.push({
      rank: i,
      nickname: `User${1000 + i}`,
      address: `0x${(Math.random() * 10 ** 6).toFixed(0)}...${(Math.random() * 10 ** 6).toFixed(0)}`,
      totalEarned: total,
    });
  }
  return base;
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = generateLeaderboard();

const INITIAL_INVITEES: Invitee[] = [
  {
    id: '1',
    nickname: 'Alice_99',
    inviteDate: '2024-11-01',
    pendingReward: 4.5,
    claimedReward: 40.5,
    lastActive: '2h ago',
  },
  {
    id: '2',
    nickname: 'Bob_Eth',
    inviteDate: '2024-11-15',
    pendingReward: 1.0,
    claimedReward: 11.0,
    lastActive: '5m ago',
  },
  {
    id: '3',
    nickname: 'CryptoDave',
    inviteDate: '2024-10-20',
    pendingReward: 10.0,
    claimedReward: 78.0,
    lastActive: '1d ago',
  },
];

export interface UseWebAppStateReturn {
  // Login state
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  // User data
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;

  // Other data
  history: Transaction[];
  setHistory: React.Dispatch<React.SetStateAction<Transaction[]>>;
  leaderboard: LeaderboardEntry[];
  invitees: Invitee[];
  subscriptions: SubscriptionRecord[];

  // Invite code hook exports
  inviteCode: ReturnType<typeof useInviteCode>;

  // Transaction hook exports
  transaction: ReturnType<typeof useTransaction>;

  // Handlers
  handleLogin: (user: User) => void;

  // Claim handlers
  handleClaimAll: () => void;
  handleClaimInvitationRewards: () => void;
  handleClaimDailyBonus: () => void;
  handleRetryClaim: (tx: Transaction) => void;

  // Upgrade handler
  handleUpgrade: (proVersion: string) => void;

  // Computed values
  getDailyLimit: () => number;
  getRewardPerTask: () => number;
}

export function useWebAppState(): UseWebAppStateReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<User>();
  const [history, setHistory] = useState<Transaction[]>([]);
  const [invitees, setInvitees] = useState<Invitee[]>(INITIAL_INVITEES);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);

  const inviteCode = useInviteCode();
  const transaction = useTransaction();

  const leaderboard = MOCK_LEADERBOARD;

  // Simulation: Invitee activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const amount = 0.5;
        const randomInviteeIndex = Math.floor(Math.random() * invitees.length);

        setInvitees((prev) => {
          const newInvitees = [...prev];
          newInvitees[randomInviteeIndex] = {
            ...newInvitees[randomInviteeIndex],
            pendingReward: newInvitees[randomInviteeIndex].pendingReward + amount,
          };
          return newInvitees;
        });

        // setUser((prev) => ({
        //   ...prev,
        //   invitationRewards: prev.invitationRewards + amount,
        // }));

        setHistory((prev) => [
          {
            id: `inv-${Date.now()}`,
            category: 'ISSUANCE',
            source: 'Invitation',
            amount: amount,
            timestamp: Date.now(),
            status: 'SUCCESS',
            desc: `Commission from ${invitees[randomInviteeIndex].nickname}`,
          },
          ...prev,
        ]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [invitees]);

  // --- Handlers ---

  const handleLogin = useCallback((user: User) => {
    setUser(user);
    setIsLoggedIn(true);
  }, []);

  // --- Claim handlers ---

  const handleClaimAll = useCallback(() => {
    // const gasCost = 0.005;
    // if (user.balanceMNT < gasCost) {
    //   alert('Insufficient MNT for Gas!');
    //   return;
    // }
    // if (user.pendingRewards <= 0) return;
    // transaction.openTransaction(
    //   'CLAIM',
    //   'Claim Task Rewards',
    //   `+${user.pendingRewards} $mEMO`,
    //   `~${gasCost} MNT`,
    //   () => {
    //     const amount = user.pendingRewards;
    //     setUser((prev) => ({
    //       ...prev,
    //       balanceMNT: prev.balanceMNT - gasCost,
    //       balanceMEMO: prev.balanceMEMO + amount,
    //       pendingRewards: 0,
    //     }));
    //
    //     setHistory((prev) => [
    //       {
    //         id: Date.now().toString(),
    //         category: 'CLAIM',
    //         source: 'Label Task',
    //         amount: amount,
    //         cost: `-${gasCost} MNT`,
    //         timestamp: Date.now(),
    //         status: 'SUCCESS',
    //         txHash: '0xabc...123',
    //         desc: 'Batch Claim Tasks',
    //       },
    //       ...prev,
    //     ]);
    //   },
    // );
  }, [user, transaction]);

  const handleClaimInvitationRewards = useCallback(() => {
    // const gasCost = 0.005;
    // if (user.balanceMNT < gasCost) {
    //   alert('Insufficient MNT for Gas!');
    //   return;
    // }
    // if (user.invitationRewards <= 0) return;
    //
    // transaction.openTransaction(
    //   'CLAIM',
    //   'Claim Commissions',
    //   `+${user.invitationRewards.toFixed(1)} $mEMO`,
    //   `~${gasCost} MNT`,
    //   () => {
    //     const amount = user.invitationRewards;
    //     setUser((prev) => ({
    //       ...prev,
    //       balanceMNT: prev.balanceMNT - gasCost,
    //       balanceMEMO: prev.balanceMEMO + amount,
    //       invitationRewards: 0,
    //     }));
    //
    //     setInvitees((prev) =>
    //       prev.map((inv) => ({
    //         ...inv,
    //         claimedReward: inv.claimedReward + inv.pendingReward,
    //         pendingReward: 0,
    //       })),
    //     );
    //
    //     setHistory((prev) => [
    //       {
    //         id: Date.now().toString(),
    //         category: 'CLAIM',
    //         source: 'Invitation',
    //         amount: amount,
    //         cost: `-${gasCost} MNT`,
    //         timestamp: Date.now(),
    //         status: 'SUCCESS',
    //         txHash: '0xdef...456',
    //         desc: 'Claimed Commissions',
    //       },
    //       ...prev,
    //     ]);
    //   },
    // );
  }, [user, transaction]);

  const handleClaimDailyBonus = useCallback(() => {
    // const gasCost = 0.002;
    // if (user.balanceMNT < gasCost) {
    //   alert('Insufficient MNT for Gas!');
    //   return;
    // }
    //
    // let amount = 0;
    // if (user.proPlanId === 'monthly') amount = 5;
    // if (user.proPlanId === 'quarterly') amount = 10;
    // if (user.proPlanId === 'yearly') amount = 30;
    //
    // transaction.openTransaction(
    //   'CLAIM',
    //   'Claim Daily Bonus',
    //   `+${amount} $mEMO`,
    //   `~${gasCost} MNT`,
    //   () => {
    //     const today = getTodayUTC();
    //     setUser((prev) => ({
    //       ...prev,
    //       balanceMNT: prev.balanceMNT - gasCost,
    //       balanceMEMO: prev.balanceMEMO + amount,
    //       lastDailyBonusDate: today,
    //     }));
    //
    //     setHistory((prev) => [
    //       {
    //         id: Date.now().toString(),
    //         category: 'ISSUANCE',
    //         source: 'Pro Daily',
    //         amount: amount,
    //         timestamp: Date.now(),
    //         status: 'SUCCESS',
    //         desc: 'Daily Bonus Issued',
    //       },
    //       ...prev,
    //     ]);
    //
    //     setHistory((prev) => [
    //       {
    //         id: Date.now().toString() + '_claim',
    //         category: 'CLAIM',
    //         source: 'Pro Daily',
    //         amount: amount,
    //         cost: `-${gasCost} MNT`,
    //         timestamp: Date.now(),
    //         status: 'SUCCESS',
    //         txHash: '0xghi...789',
    //         desc: 'Claimed Bonus',
    //       },
    //       ...prev,
    //     ]);
    //   },
    // );
  }, [user, transaction]);

  const handleRetryClaim = useCallback(
    (tx: Transaction) => {
      // const gasCost = 0.005;
      // if (user.balanceMNT < gasCost) {
      //   alert('Insufficient MNT for Gas!');
      //   return;
      // }
      //
      // transaction.openTransaction(
      //   'CLAIM',
      //   'Retry Claim',
      //   `+${tx.amount} $mEMO`,
      //   `~${gasCost} MNT`,
      //   () => {
      //     setUser((prev) => ({
      //       ...prev,
      //       balanceMNT: prev.balanceMNT - gasCost,
      //     }));
      //
      //     setHistory((prev) =>
      //       prev.map((t) => {
      //         if (t.id === tx.id) {
      //           return {
      //             ...t,
      //             status: 'SUCCESS',
      //             txHash: '0xretry...999',
      //             timestamp: Date.now(),
      //           };
      //         }
      //         return t;
      //       }),
      //     );
      //   },
      // );
    },
    [user, transaction],
  );

  const handleUpgrade = useCallback(
    (proVersion: string) => {
      // if (user.balanceUSDT < plan.usdtPrice) {
      //   alert('Insufficient USDT');
      //   return;
      // }
      // const gasCost = 0.01;
      // if (user.balanceMNT < gasCost) {
      //   alert('Insufficient MNT for Gas');
      //   return;
      // }
      //
      // transaction.openTransaction(
      //   'UPGRADE',
      //   `Upgrade to ${plan.name}`,
      //   undefined,
      //   `-${plan.usdtPrice} USDT`,
      //   () => {
      //     const now = new Date();
      //     let daysToAdd = 30;
      //     if (plan.id === 'quarterly') daysToAdd = 90;
      //     if (plan.id === 'yearly') daysToAdd = 365;
      //     now.setDate(now.getDate() + daysToAdd);
      //
      //     setUser((prev) => ({
      //       ...prev,
      //       isPro: true,
      //       proPlanId: plan.id,
      //       proExpiryDate: now.toISOString(),
      //       balanceUSDT: prev.balanceUSDT - plan.usdtPrice,
      //       balanceMNT: prev.balanceMNT - gasCost,
      //     }));
      //
      //     const record: SubscriptionRecord = {
      //       id: `sub-${Date.now()}`,
      //       planId: plan.id,
      //       planName: plan.name,
      //       amountUSDT: plan.usdtPrice,
      //       chain: 'Mantle',
      //       wallet: user.walletAddress || '0x71C...9A23',
      //       txHash: `0x${Date.now().toString(16)}DEMO`,
      //       createdAt: Date.now(),
      //       status: 'SUCCESS',
      //       expiry: now.toISOString(),
      //     };
      //     setSubscriptions((prev) => [record, ...prev]);
      //
      //     setHistory((prev) => [
      //       {
      //         id: Date.now().toString(),
      //         category: 'SPEND',
      //         amount: 0,
      //         cost: `-${plan.usdtPrice} USDT`,
      //         timestamp: Date.now(),
      //         desc: `Upgraded to ${plan.name}`,
      //         status: 'SUCCESS',
      //         txHash: '0xplan...buy',
      //       },
      //       ...prev,
      //     ]);
      //   },
      // );
    },
    [user, transaction],
  );

  // --- Computed values ---

  const getDailyLimit = useCallback(() => {
    // if (!user.isPro) return 2;
    // if (user.proPlanId === 'monthly') return 3;
    // if (user.proPlanId === 'quarterly') return 4;
    return 5;
  }, [user]);

  const getRewardPerTask = useCallback(() => {
    // if (!user.isPro) return 2;
    // if (user.proPlanId === 'monthly') return 3;
    // if (user.proPlanId === 'quarterly') return 4;
    return 5;
  }, [user]);

  return {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    history,
    setHistory,
    leaderboard,
    invitees,
    subscriptions,
    inviteCode,
    transaction,
    handleLogin,
    handleClaimAll,
    handleClaimInvitationRewards,
    handleClaimDailyBonus,
    handleRetryClaim,
    handleUpgrade,
    getDailyLimit,
    getRewardPerTask,
  };
}
