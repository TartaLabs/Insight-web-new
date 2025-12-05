import { ReactNode } from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  details: string[];
  color: string;
  visual: ReactNode;
}

export interface NavLink {
  label: string;
  href: string;
}

export enum ChainType {
  ARBITRUM = 'Arbitrum',
  MANTLE = 'Mantle'
}

export interface TokenStats {
  name: string;
  chain: ChainType;
  symbol: string;
  color: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  dailyBonus: number;
  dailyLimit: number;
  rewardPerTask: number;
  features: string[];
  recommended?: boolean;
  usdtPrice: number;
}

export type EmotionType = 'Happy' | 'Anger' | 'Sad' | 'Fear' | 'Disgust' | 'Surprise' | 'Neutral';

// --- Web App Types ---

export type TaskStatus = 'DRAFT' | 'AUDITING' | 'LABELED' | 'REJECTED';

export interface TaskRecord {
  id: string;
  emotion: EmotionType;
  imageUrl: string; 
  status: TaskStatus;
  reward: number;
  timestamp: number;
  failReason?: string;
  draftData?: {
    isClear?: boolean;
    intensity?: number;
    isStaged?: boolean;
    arousal?: number;
  };
}

export interface Invitee {
  id: string;
  nickname: string;
  inviteDate: string;
  pendingReward: number;
  claimedReward: number;
  lastActive: string;
}

export interface UserProfile {
  walletAddress: string;
  nickname: string;
  isPro: boolean;
  proPlanId?: string; 
  proExpiryDate?: string; 
  
  balanceMEMO: number;       // On-chain Balance
  pendingRewards: number;    // Off-chain Pending Pool
  invitationRewards: number; // Specific Pending Pool for Invites
  balanceMNT: number;        
  balanceUSDT: number;       
  
  streakDays: number;
  inviteCount: number;
  lastResetDate: string;     
  lastDailyBonusDate?: string; 
}

export interface TaskCounts {
  [key: string]: number;
}

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type RewardSource = 'Label Task' | 'Pro Daily' | 'Invitation';

export interface Transaction {
  id: string;
  category: 'ISSUANCE' | 'CLAIM' | 'SPEND'; 
  source?: RewardSource;
  amount: number;
  cost?: string; // Gas or USDT
  timestamp: number;
  status: TransactionStatus;
  txHash?: string;
  desc?: string;
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string; // Added nickname
  address: string;
  totalEarned: number;
}