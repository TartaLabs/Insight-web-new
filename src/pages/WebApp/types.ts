/**
 * WebApp 模块专用类型定义
 * 从全局 types 导出常用类型，并定义 WebApp 特有的类型
 */

// Re-export common types from global types
export type {
  UserProfile,
  TaskCounts,
  Transaction,
  LeaderboardEntry,
  EmotionType,
  PricingPlan,
  TaskRecord,
  Invitee,
  SubscriptionRecord,
  TaskStatus,
  TransactionStatus,
  RewardSource,
} from '../../types';

// WebApp-specific types

export interface InviteCodeInfo {
  code: string;
  invitedBy: string;
  locked: boolean;
  persisted: boolean;
}

export interface InviteUsageRecord {
  owner: string;
  used: number;
}

export type InviteUsageMap = Record<string, InviteUsageRecord>;

export interface TransactionModalState {
  isOpen: boolean;
  type: 'CLAIM' | 'UPGRADE' | 'APPROVE';
  title: string;
  amount?: string;
  cost?: string;
  onSuccessCallback?: () => void;
}

export interface ValidateInviteResult {
  ok: boolean;
  message?: string;
  invitedBy?: string;
}

export interface BindInviteOptions {
  lock?: boolean;
  persist?: boolean;
}

export interface RenameResult {
  ok: boolean;
  message?: string;
}

export type TabType =
  | 'contributions'
  | 'memo_history'
  | 'leaderboard'
  | 'invitation'
  | 'subscriptions';

export type HistoryFilter = 'ISSUED' | 'CLAIMED';

