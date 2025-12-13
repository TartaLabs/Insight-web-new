import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  TaskCounts,
  Transaction,
  LeaderboardEntry,
  TaskRecord,
  Invitee,
  SubscriptionRecord,
  EmotionType,
  PricingPlan,
  RenameResult,
} from '../types';
import { useInviteCode } from './useInviteCode';
import { useTransaction } from './useTransaction';

const getTodayUTC = () => new Date().toISOString().split('T')[0];

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

const INITIAL_USER: UserProfile = {
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
  lastResetDate: getTodayUTC(),
  inviteCodeApplied: '',
  invitedBy: '',
  inviteLocked: false,
};

export interface UseWebAppStateReturn {
  // Login state
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

  // User data
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;

  // Task data
  tasks: TaskRecord[];
  taskCounts: TaskCounts;
  activeTaskEmotion: EmotionType | null;
  activeDraftTask: TaskRecord | undefined;

  // Other data
  history: Transaction[];
  leaderboard: LeaderboardEntry[];
  invitees: Invitee[];
  subscriptions: SubscriptionRecord[];

  // Invite code hook exports
  inviteCode: ReturnType<typeof useInviteCode>;

  // Transaction hook exports
  transaction: ReturnType<typeof useTransaction>;

  // Handlers
  handleLogin: (nickname: string) => void;
  handleSaveDraft: (record: TaskRecord) => void;
  handleSubmitTask: (record: TaskRecord) => void;
  handleDeleteTask: (id: string) => void;
  handleResumeTask: (task: TaskRecord) => void;
  handleRenameNickname: (nextName: string) => RenameResult;
  handleStartTask: (emotion: EmotionType) => void;
  handleCancelTask: () => void;

  // Claim handlers
  handleClaimAll: () => void;
  handleClaimInvitationRewards: () => void;
  handleClaimDailyBonus: () => void;
  handleRetryClaim: (tx: Transaction) => void;

  // Upgrade handler
  handleUpgrade: (plan: PricingPlan) => void;

  // Computed values
  getDailyLimit: () => number;
  getRewardPerTask: () => number;
  existingNicknames: string[];
}

export function useWebAppState(): UseWebAppStateReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({});
  const [history, setHistory] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [invitees, setInvitees] = useState<Invitee[]>(INITIAL_INVITEES);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [activeTaskEmotion, setActiveTaskEmotion] = useState<EmotionType | null>(null);
  const [activeDraftTask, setActiveDraftTask] = useState<TaskRecord | undefined>(undefined);

  const inviteCode = useInviteCode();
  const transaction = useTransaction();

  const leaderboard = MOCK_LEADERBOARD;

  const existingNicknames = [
    ...MOCK_LEADERBOARD.map((l) => l.nickname),
    ...invitees.map((i) => i.nickname),
  ];

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

        setUser((prev) => ({
          ...prev,
          invitationRewards: prev.invitationRewards + amount,
        }));

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

  // Daily reset check
  useEffect(() => {
    const checkReset = () => {
      const todayISO = getTodayUTC();
      if (todayISO !== user.lastResetDate) {
        setTaskCounts({});
        setUser((prev) => ({ ...prev, lastResetDate: todayISO }));
      }
    };
    const interval = setInterval(checkReset, 60000);
    checkReset();
    return () => clearInterval(interval);
  }, [user.lastResetDate]);

  // --- Handlers ---

  const handleLogin = useCallback(
    (nickname: string) => {
      if (inviteCode.inviteCodeInfo.code) {
        const bindResult = inviteCode.bindInviteCode(inviteCode.inviteCodeInfo.code, {
          lock: true,
          persist: !inviteCode.inviteCodeInfo.persisted,
        });
        if (!bindResult.ok) return;
      }

      const wallet = '0x71c1234567890abcdef1234567890abcd9a23';
      setUser((prev) => ({
        ...prev,
        nickname,
        walletAddress: wallet,
        balanceMNT: 5.0,
        balanceUSDT: 100.0,
        balanceMEMO: 100,
        inviteCodeApplied: inviteCode.inviteCodeInfo.code || prev.inviteCodeApplied,
        invitedBy: inviteCode.inviteCodeInfo.invitedBy || prev.invitedBy,
        inviteLocked: inviteCode.inviteCodeInfo.code ? true : prev.inviteLocked,
      }));

      inviteCode.initializeOwnInviteCode(wallet, nickname);

      if (inviteCode.inviteCodeInfo.code && !inviteCode.inviteCodeInfo.persisted) {
        inviteCode.setInviteCodeInfo((prev) => ({
          ...prev,
          locked: true,
          persisted: true,
        }));
      }
      setIsLoggedIn(true);
    },
    [inviteCode],
  );

  const handleSaveDraft = useCallback((record: TaskRecord) => {
    setTasks((prev) => {
      const existing = prev.findIndex((t) => t.id === record.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = record;
        return updated;
      }
      return [record, ...prev];
    });
    setActiveTaskEmotion(null);
    setActiveDraftTask(undefined);
  }, []);

  const handleRenameNickname = useCallback(
    (nextName: string): RenameResult => {
      const trimmed = nextName.trim();
      const valid = /^[A-Za-z0-9]{1,15}$/.test(trimmed);
      if (!valid) return { ok: false, message: 'Use 1-15 letters or numbers.' };

      const taken = existingNicknames.some((n) => n.toLowerCase() === trimmed.toLowerCase());
      if (taken && trimmed.toLowerCase() !== (user.nickname || '').toLowerCase()) {
        return { ok: false, message: 'Nickname already taken.' };
      }

      setUser((prev) => ({ ...prev, nickname: trimmed }));

      if (inviteCode.ownInviteCode && typeof window !== 'undefined') {
        const link = `${window.location.origin}${window.location.pathname}?code=${inviteCode.ownInviteCode}&inviter=${encodeURIComponent(trimmed)}`;
        // Update invite link in inviteCode hook would need additional method
      }

      return { ok: true };
    },
    [existingNicknames, user.nickname, inviteCode.ownInviteCode],
  );

  const handleSubmitTask = useCallback((record: TaskRecord) => {
    setTaskCounts((c) => ({
      ...c,
      [record.emotion]: (c[record.emotion] || 0) + 1,
    }));

    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== record.id);
      return [{ ...record, status: 'AUDITING' }, ...filtered];
    });

    setActiveTaskEmotion(null);
    setActiveDraftTask(undefined);

    setTimeout(() => {
      const passed = Math.random() > 0.2;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === record.id) {
            return {
              ...t,
              status: passed ? 'LABELED' : 'REJECTED',
              failReason: passed ? undefined : 'Blurry or Incorrect Emotion',
            };
          }
          return t;
        }),
      );

      if (passed) {
        setUser((u) => ({
          ...u,
          pendingRewards: u.pendingRewards + record.reward,
        }));

        setHistory((h) => [
          {
            id: Date.now().toString(),
            category: 'ISSUANCE',
            source: 'Label Task',
            amount: record.reward,
            timestamp: Date.now(),
            status: 'SUCCESS',
            desc: 'Reward Issued',
          },
          ...h,
        ]);
      }
    }, 5000);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleResumeTask = useCallback((task: TaskRecord) => {
    setActiveDraftTask(task);
    setActiveTaskEmotion(task.emotion);
  }, []);

  const handleStartTask = useCallback((emotion: EmotionType) => {
    setActiveDraftTask(undefined);
    setActiveTaskEmotion(emotion);
  }, []);

  const handleCancelTask = useCallback(() => {
    setActiveTaskEmotion(null);
    setActiveDraftTask(undefined);
  }, []);

  // --- Claim handlers ---

  const handleClaimAll = useCallback(() => {
    const gasCost = 0.005;
    if (user.balanceMNT < gasCost) {
      alert('Insufficient MNT for Gas!');
      return;
    }
    if (user.pendingRewards <= 0) return;

    transaction.openTransaction(
      'CLAIM',
      'Claim Task Rewards',
      `+${user.pendingRewards} $mEMO`,
      `~${gasCost} MNT`,
      () => {
        const amount = user.pendingRewards;
        setUser((prev) => ({
          ...prev,
          balanceMNT: prev.balanceMNT - gasCost,
          balanceMEMO: prev.balanceMEMO + amount,
          pendingRewards: 0,
        }));

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            category: 'CLAIM',
            source: 'Label Task',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xabc...123',
            desc: 'Batch Claim Tasks',
          },
          ...prev,
        ]);
      },
    );
  }, [user.balanceMNT, user.pendingRewards, transaction]);

  const handleClaimInvitationRewards = useCallback(() => {
    const gasCost = 0.005;
    if (user.balanceMNT < gasCost) {
      alert('Insufficient MNT for Gas!');
      return;
    }
    if (user.invitationRewards <= 0) return;

    transaction.openTransaction(
      'CLAIM',
      'Claim Commissions',
      `+${user.invitationRewards.toFixed(1)} $mEMO`,
      `~${gasCost} MNT`,
      () => {
        const amount = user.invitationRewards;
        setUser((prev) => ({
          ...prev,
          balanceMNT: prev.balanceMNT - gasCost,
          balanceMEMO: prev.balanceMEMO + amount,
          invitationRewards: 0,
        }));

        setInvitees((prev) =>
          prev.map((inv) => ({
            ...inv,
            claimedReward: inv.claimedReward + inv.pendingReward,
            pendingReward: 0,
          })),
        );

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            category: 'CLAIM',
            source: 'Invitation',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xdef...456',
            desc: 'Claimed Commissions',
          },
          ...prev,
        ]);
      },
    );
  }, [user.balanceMNT, user.invitationRewards, transaction]);

  const handleClaimDailyBonus = useCallback(() => {
    const gasCost = 0.002;
    if (user.balanceMNT < gasCost) {
      alert('Insufficient MNT for Gas!');
      return;
    }

    let amount = 0;
    if (user.proPlanId === 'monthly') amount = 5;
    if (user.proPlanId === 'quarterly') amount = 10;
    if (user.proPlanId === 'yearly') amount = 30;

    transaction.openTransaction(
      'CLAIM',
      'Claim Daily Bonus',
      `+${amount} $mEMO`,
      `~${gasCost} MNT`,
      () => {
        const today = getTodayUTC();
        setUser((prev) => ({
          ...prev,
          balanceMNT: prev.balanceMNT - gasCost,
          balanceMEMO: prev.balanceMEMO + amount,
          lastDailyBonusDate: today,
        }));

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            category: 'ISSUANCE',
            source: 'Pro Daily',
            amount: amount,
            timestamp: Date.now(),
            status: 'SUCCESS',
            desc: 'Daily Bonus Issued',
          },
          ...prev,
        ]);

        setHistory((prev) => [
          {
            id: Date.now().toString() + '_claim',
            category: 'CLAIM',
            source: 'Pro Daily',
            amount: amount,
            cost: `-${gasCost} MNT`,
            timestamp: Date.now(),
            status: 'SUCCESS',
            txHash: '0xghi...789',
            desc: 'Claimed Bonus',
          },
          ...prev,
        ]);
      },
    );
  }, [user.balanceMNT, user.proPlanId, transaction]);

  const handleRetryClaim = useCallback(
    (tx: Transaction) => {
      const gasCost = 0.005;
      if (user.balanceMNT < gasCost) {
        alert('Insufficient MNT for Gas!');
        return;
      }

      transaction.openTransaction(
        'CLAIM',
        'Retry Claim',
        `+${tx.amount} $mEMO`,
        `~${gasCost} MNT`,
        () => {
          setUser((prev) => ({
            ...prev,
            balanceMNT: prev.balanceMNT - gasCost,
          }));

          setHistory((prev) =>
            prev.map((t) => {
              if (t.id === tx.id) {
                return {
                  ...t,
                  status: 'SUCCESS',
                  txHash: '0xretry...999',
                  timestamp: Date.now(),
                };
              }
              return t;
            }),
          );
        },
      );
    },
    [user.balanceMNT, transaction],
  );

  const handleUpgrade = useCallback(
    (plan: PricingPlan) => {
      if (user.balanceUSDT < plan.usdtPrice) {
        alert('Insufficient USDT');
        return;
      }
      const gasCost = 0.01;
      if (user.balanceMNT < gasCost) {
        alert('Insufficient MNT for Gas');
        return;
      }

      transaction.openTransaction(
        'UPGRADE',
        `Upgrade to ${plan.name}`,
        undefined,
        `-${plan.usdtPrice} USDT`,
        () => {
          const now = new Date();
          let daysToAdd = 30;
          if (plan.id === 'quarterly') daysToAdd = 90;
          if (plan.id === 'yearly') daysToAdd = 365;
          now.setDate(now.getDate() + daysToAdd);

          setUser((prev) => ({
            ...prev,
            isPro: true,
            proPlanId: plan.id,
            proExpiryDate: now.toISOString(),
            balanceUSDT: prev.balanceUSDT - plan.usdtPrice,
            balanceMNT: prev.balanceMNT - gasCost,
          }));

          const record: SubscriptionRecord = {
            id: `sub-${Date.now()}`,
            planId: plan.id,
            planName: plan.name,
            amountUSDT: plan.usdtPrice,
            chain: 'Mantle',
            wallet: user.walletAddress || '0x71C...9A23',
            txHash: `0x${Date.now().toString(16)}DEMO`,
            createdAt: Date.now(),
            status: 'SUCCESS',
            expiry: now.toISOString(),
          };
          setSubscriptions((prev) => [record, ...prev]);

          setHistory((prev) => [
            {
              id: Date.now().toString(),
              category: 'SPEND',
              amount: 0,
              cost: `-${plan.usdtPrice} USDT`,
              timestamp: Date.now(),
              desc: `Upgraded to ${plan.name}`,
              status: 'SUCCESS',
              txHash: '0xplan...buy',
            },
            ...prev,
          ]);
        },
      );
    },
    [user.balanceUSDT, user.balanceMNT, user.walletAddress, transaction],
  );

  // --- Computed values ---

  const getDailyLimit = useCallback(() => {
    if (!user.isPro) return 2;
    if (user.proPlanId === 'monthly') return 3;
    if (user.proPlanId === 'quarterly') return 4;
    return 5;
  }, [user.isPro, user.proPlanId]);

  const getRewardPerTask = useCallback(() => {
    if (!user.isPro) return 2;
    if (user.proPlanId === 'monthly') return 3;
    if (user.proPlanId === 'quarterly') return 4;
    return 5;
  }, [user.isPro, user.proPlanId]);

  return {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    tasks,
    taskCounts,
    activeTaskEmotion,
    activeDraftTask,
    history,
    leaderboard,
    invitees,
    subscriptions,
    inviteCode,
    transaction,
    handleLogin,
    handleSaveDraft,
    handleSubmitTask,
    handleDeleteTask,
    handleResumeTask,
    handleRenameNickname,
    handleStartTask,
    handleCancelTask,
    handleClaimAll,
    handleClaimInvitationRewards,
    handleClaimDailyBonus,
    handleRetryClaim,
    handleUpgrade,
    getDailyLimit,
    getRewardPerTask,
    existingNicknames,
  };
}
