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
  MANTLE = 'Mantle',
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

export type SubscriptionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface SubscriptionRecord {
  id: string;
  planId: string;
  planName: string;
  amountUSDT: number;
  chain: string;
  wallet: string;
  txHash?: string;
  createdAt: number;
  status: SubscriptionStatus;
  expiry?: string;
}

// 使用 API 定义的情绪类型，统一数据源
export type EmotionType = 'HAPPY' | 'SAD' | 'ANGRY' | 'FEAR' | 'SURPRISE' | 'DISGUST' | 'NEUTRAL';

// --- Web App Types ---

import type { Task } from './services/model/types';

export type TaskStatus = 'DRAFT' | 'AUDITING' | 'LABELED' | 'REJECTED';

/**
 * 本地草稿数据，存放用户未提交的本地状态
 */
export interface TaskDraftData {
  imageUrl?: string; // 用户拍摄的图片
  answers?: Record<number, string | number>; // question_id -> answer
}

/**
 * 任务记录
 * - task_id: 服务端任务ID，作为唯一标识
 * - task: 服务端任务实例，包含 emotion_type, questions, reward_amount 等
 * - draft: 用户本地未提交的数据（图片、答案等）
 * - status: 本地状态（DRAFT 表示未提交，其他状态从服务端同步）
 */
export interface TaskRecord {
  task_id: string; // 服务端任务ID，作为唯一标识
  task: Task; // 持有服务端任务实例
  draft: TaskDraftData; // 用户本地未提交的数据
  status: TaskStatus; // 本地状态
  timestamp: number; // 创建/更新时间
  failReason?: string;
}

export interface Invitee {
  id: string;
  nickname: string;
  inviteDate: string;
  pendingReward: number;
  claimedReward: number;
  lastActive: string;
}

export interface User {
  walletAddress: string;
  nickname: string;
  isPro: boolean;
  proPlanId?: string;
  proExpiryDate?: string;

  balanceMEMO: number; // On-chain Balance
  pendingRewards: number; // Off-chain Pending Pool
  invitationRewards: number; // Specific Pending Pool for Invites
  balanceMNT: number;
  balanceUSDT: number;

  streakDays: number;
  inviteCount: number;
  lastResetDate: string;
  lastDailyBonusDate?: string;

  inviteCodeApplied?: string;
  invitedBy?: string;
  inviteLocked?: boolean;
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
