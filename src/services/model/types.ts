// 基础响应类型定义
export interface ApiResponse<T> {
  data: T;
}

// 用户相关类型定义
export interface User {
  // 根据Dart的User类定义相应的字段
  uid: string;
  nickname: string;
  referralCode?: string;
  pro_version: string;
  login_streak?: number;
  last_login_at?: number;
  pro_version_id?: string;
  pro_version_expires_at?: number;
  referral_code?: string;
  token_amount?: number;
  wallet_address?: string;
}

export interface UserLoginRes {
  user: User;
  is_new: boolean;
  session: string;
}

// 广告相关类型定义
export interface AdInfo {
  // 根据Dart的AdInfo类定义相应的字段
  id: string;
  // 其他广告信息字段...
}

export interface AdStatus {
  // 根据Dart的AdStatus类定义相应的字段
  isAvailable: boolean;
  // 其他广告状态字段...
}

// 邀请相关类型定义
export interface InviteRecord {
  // 根据Dart的InviteRecord类定义相应的字段
  id: string;
  referredUser: string;
  createdAt: string;
  // 其他邀请记录字段...
}

export interface InviteResponese {
  total: number;
  users: InviteRecord[];
}

// 支付相关类型定义
export interface Product {
  // 根据Dart的Product类定义相应的字段
  id: string;
  name: string;
  price: number;
  // 其他产品字段...
}

// PRO相关类型定义
export interface Pro {
  benefits: {
    daily_free_points: number;
    daily_initial_annotation: number;
    points_per_annotation: number;
    daily_model_test: number;
    points_per_model_test: number;
    ad_free: boolean;
    future_airdrop_bonus: boolean;
    price: number;
    duration: number;
  };
  display_name: string;
  is_pro: boolean;
  pro_version: string;
}

// 奖励记录相关类型定义
export interface RewardRecord {
  // 根据Dart的RewardRecord类定义相应的字段
  id: string;
  amount: string;
  type: string;
  createdAt: string;
  // 其他奖励记录字段...
}

export interface RewardResponese {
  total: number;
  records: RewardRecord[];
}

// 任务相关类型定义
export interface Question {
  id: number;
  type: 'SINGLE_CHOICE' | 'RATING';
  title: string;
  description: string;
  options: string[] | null;
  required: boolean;
  order: number;
}

export interface Task {
  id: string;
  user_id: string;
  task_id: number;
  status: 'INIT' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  task_type: 'DAILY';
  media_nums: number;
  emotion_type: 'HAPPY' | 'SAD' | 'ANGRY' | 'FEAR' | 'SURPRISE' | 'DISGUST' | 'NEUTRAL';
  claimed_at: number;
  validation_failure_count: number;
  medias: Record<string, unknown>;
  created_at: number;
  updated_at: number;
  name: string;
  description: string;
  questions: Question[];
  media_type: 'IMAGE';
  reward_amount: number;
}

export interface DailyTasksResponse {
  status: number;
  data: {
    claimed_at: number;
    tasks: Task[];
  };
}
