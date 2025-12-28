// 基础响应类型定义
export interface ApiResponse<T> {
  data: T;
}

export interface ReferUser {
  nickname: string;
  avatar: string;
  uid: string;
}

// 用户相关类型定义
export interface User {
  // 根据Dart的User类定义相应的字段
  uid: string;
  nickname: string;
  pro_version: string;
  login_streak?: number;
  last_login_at?: number;
  pro_version_id?: string;
  pro_version_expires_at?: number;
  referral_code?: string;
  token_amount?: number;
  refer_user?: ReferUser;
  refer_count?: number;
  oauth_info?: {
    wallet?: {
      oauth_user: {
        id?: string;
      };
    };
  };
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
  user_id: string;
  nickname: string;
  total_amount: number;
  claimed_amount: number;
  pending_amount: number;
  created_at: number;
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

// 奖励记录状态：SUCCESS 为已领取，INIT 为未领取
export type RewardRecordStatus = 'SUCCESS' | 'INIT';

// 奖励记录相关类型定义
export interface RewardRecord {
  nonce: number; // 交易 nonce
  total_amount: number; // 奖励金额
  status: RewardRecordStatus; // 记录状态：SUCCESS 已领取，INIT 未领取
  record_count: number; // 记录数量
  mint_expire_at: number; // 铸造过期时间戳
  task_type: string; // 任务类型
  created_at: number; // 创建时间戳
  tx_hash: string; // 交易哈希
  chain_id: string;
}

export interface RewardResponese {
  total: number;
  records: RewardRecord[];
}

// 排行榜用户条目（根据 mock.json 结构）
export interface LeaderboardUser {
  user_id: string; // 用户唯一标识
  nickname: string; // 用户昵称
  avatar: string; // 头像 URL
  token_amount: number; // 代币数量
  rank: number; // 排名
}

// 排行榜响应类型
export interface LeaderboardResponse {
  users: LeaderboardUser[]; // 排行榜用户列表
  my_rank: number; // 当前用户排名
  my_amount: number; // 当前用户代币数量
  total_users: number; // 总用户数
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

// 问题答案类型
export interface QuestionAnswer {
  question_id: number;
  answer: string | number; // SINGLE_CHOICE 为 string，RATING 为 number
}

export interface MediaInfo {
  submit_time: number;
  validate_time: number;
  status?: 'PENDING' | 'INVALID' | 'VALID';
  claim_status?: 'INIT' | 'CLAIMED';
  answers?: QuestionAnswer[];
}

export type RecordType = 'DAILY' | 'INVITE' | 'PRO';

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
  medias: Record<string, MediaInfo>;
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

export interface AppConfig {
  chains: {
    chain_id: string;
    name: string;
    multi_call_contract: string;
    insight_reward_contract: string;
    eomo: string;
    is_mainnet: boolean;
    pro_version_contract: string;
    usdt: string;
  }[];
}

export interface MintSigReq {
  chain_id: string;
  nonce?: number;
}

export interface MintSigRes {
  uuid: string;
  nonce: number;
  timestamp: number;
  amount: string;
  tasks: string;
  signature: string;
}

export interface SubmitClaimTxHashReq {
  chain_id: string;
  nonce: number;
  tx_hash: string;
}

export interface SubmitClaimTxHashRes {
  task_uuids: string[];
  tx_hash: string;
  status: string;
  message: string;
}

export type ClaimableAmountRes = {
  task_type: string;
  claimable_amount: number;
  record_count: number;
};

// 支付记录状态
export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

// 支付记录类型
export interface Payment {
  id: string;
  user_id: string;
  provider: string;
  type: string;
  product_id: string;
  transaction_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  purchase_time: number;
  expires_time: number;
  auto_renewing: boolean;
  created_at: number;
  updated_at: number;
}

// 支付列表响应
export interface PaymentListResponse {
  limit: number;
  offset: number;
  payments: Payment[];
  total: number;
}
