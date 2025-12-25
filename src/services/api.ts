// 从request.ts导入request实例
import { request } from './request';

// 从model文件夹导入所有类型定义
import {
  AdInfo,
  AdStatus,
  ApiResponse,
  AppConfig,
  ClaimableAmountRes,
  DailyTasksResponse,
  InviteRecord,
  InviteResponese,
  LeaderboardResponse,
  MintSigReq,
  MintSigRes,
  PaymentListResponse,
  Pro,
  Product,
  RecordType,
  RewardRecord,
  RewardResponese,
  SubmitClaimTxHashReq,
  SubmitClaimTxHashRes,
  User,
  UserLoginRes,
} from './model/types';

// 用户相关接口
export const apiUser = {
  /**
   * 用户登录
   */
  login: async (address: string, signature: string, message: string): Promise<UserLoginRes> => {
    const response = await request.post<ApiResponse<UserLoginRes>>('/api/1/user/sign_wallet', {
      data: { address, signature, message },
    });
    return response.data;
  },

  /**
   * 获取用户数据
   */
  getUserData: async (): Promise<User> => {
    const response =
      await request.get<ApiResponse<{ user: User; refer_user: string; refer_count: number }>>(
        '/api/1/user/data',
      );

    return {
      ...response.data.user,
      refer_user: response.data.refer_user,
      refer_count: response.data.refer_count,
    };
  },

  /**
   * 验证推荐码
   */
  verifyRefCode: async (code: string): Promise<boolean> => {
    const response = await request.get<ApiResponse<boolean>>('/api/1/user/verify_ref', {
      params: { referral_code: code },
    });
    return response.data;
  },

  /**
   * 更新用户数据
   */
  updateUserData: async (nickname: string, refCode?: string): Promise<User> => {
    const response = await request.post<ApiResponse<User>>('/api/1/user/update', {
      data: { nickname, referral: refCode },
    });
    return response.data;
  },

  /**
   * 获取应用配置
   */
  getAppConfig: async () => {
    return await request.get<ApiResponse<AppConfig>>('/api/1/config', {});
  },

  getClaimableAmount: async (type: string) => {
    return await request.get<ApiResponse<ClaimableAmountRes>>('/api/1/user/task/claimable-amount', {
      params: {
        task_type: type,
      },
    });
  },

  getTaskMintSig: async (req: MintSigReq) => {
    return await request.post<ApiResponse<MintSigRes>>('/api/1/user/task/mint-signature', {
      data: req,
    });
  },

  getInviteMintSig: async (req: MintSigReq) => {
    return await request.post<ApiResponse<MintSigRes>>('/api/1/user/task/mint-invite-signature', {
      data: req,
    });
  },

  getProMintSig: async (req: MintSigReq) => {
    return await request.post<ApiResponse<MintSigRes>>('/api/1/user/task/mint-pro-signature', {
      data: req,
    });
  },

  submitClaimTxHash: async (req: SubmitClaimTxHashReq) => {
    return await request.post<ApiResponse<SubmitClaimTxHashRes>>(
      '/api/1/user/task/submit-tx-hash',
      { data: req },
    );
  },

  /**
   * 校验昵称是否可用
   */
  checkNickname: async (nickname: string): Promise<boolean> => {
    const response = await request.get<ApiResponse<{ exists: boolean }>>(
      '/api/1/user/check-nickname',
      {
        params: { nickname },
      },
    );

    return response.data.exists;
  },
};

// 广告相关接口
export const apiAd = {
  /**
   * 观看广告
   */
  watchedAd: async (): Promise<AdInfo> => {
    const response = await request.post<ApiResponse<AdInfo>>('/api/1/user/task/watch-ad');
    return response.data;
  },

  /**
   * 获取广告状态
   */
  getAdStatus: async (): Promise<AdStatus> => {
    const response = await request.get<ApiResponse<AdStatus>>('/api/1/user/task/ad-watch-status');
    return response.data;
  },
};

// 邀请相关接口
export const apiInvite = {
  /**
   * 获取邀请记录
   */
  getInviteRecords: async (limit: number, offset: number): Promise<InviteResponese> => {
    const response = await request.get<ApiResponse<{ total: number; users: InviteRecord[] }>>(
      '/api/1/user/task/invite-list',
      {
        params: { limit, offset },
      },
    );
    return {
      total: response.data.total,
      users: response.data.users,
    };
  },

  /**
   * 获取邀请铸造签名
   */
  getInviteMint: async (): Promise<string> => {
    const response = await request.post<ApiResponse<{ uuid: string }>>(
      '/api/1/user/task/mint-invite-signature',
    );
    return response.data.uuid;
  },
};

// 排行榜相关接口
export const apiLeaderboard = {
  /**
   * 获取用户代币余额排行榜
   */
  getTokenLeaderboard: async (
    limit: number = 50,
    offset: number = 0,
  ): Promise<LeaderboardResponse> => {
    const response = await request.get<ApiResponse<LeaderboardResponse>>(
      '/api/1/user/task/token-leaderboard',
      {
        params: { limit, offset },
      },
    );
    return response.data;
  },
};

// 支付相关接口
export const apiPayment = {
  /**
   * 获取产品列表
   */
  getProductList: async (): Promise<Product[]> => {
    const response = await request.get<ApiResponse<Product[]>>('/api/1/user/payment/products');
    return response.data;
  },

  /**
   * 上报购买交易 Hash
   */
  updatePayResult: async (hash: string) => {
    return await request.post('/api/1/user/payment/submit-chain-proversion', {
      data: { tx_hash: hash },
    });
  },

  /**
   * 获取支付记录列表
   */
  getPaymentList: async (limit: number = 10, offset: number = 0): Promise<PaymentListResponse> => {
    const response = await request.post<ApiResponse<PaymentListResponse>>(
      '/api/1/user/payment/list',
      {
        data: { limit, offset },
      },
    );
    return response.data;
  },
};

// PRO相关接口
export const apiPro = {
  /**
   * 获取PRO版本信息
   */
  getProVersion: async (): Promise<Pro> => {
    const response = await request.get<ApiResponse<Pro>>('/api/1/user/pro-version');
    return response.data;
  },

  /**
   * 获取PRO版本列表
   */
  getProVersionList: async (): Promise<Pro[]> => {
    const response = await request.get<ApiResponse<Pro[]>>('/api/1/user/pro-version/list');
    return response.data;
  },

  /**
   * 更新PRO版本
   */
  updateProVersion: async (proVersion: string): Promise<Pro> => {
    const response = await request.post<ApiResponse<Pro>>('/api/1/user/pro-version/update', {
      data: { pro_version: proVersion },
    });
    return response.data;
  },
};

// 奖励记录相关接口
export const apiRecords = {
  /**
   * 获取奖励记录
   */
  getRewardRecords: async (limit: number, offset: number): Promise<RewardResponese> => {
    const response = await request.get<ApiResponse<{ total: number; records: RewardRecord[] }>>(
      '/api/1/user/task/reward-records',
      {
        params: { limit, offset },
      },
    );
    return {
      total: response.data.total,
      records: response.data.records,
    };
  },

  getClaimedRecords: async (
    type: RecordType,
    limit: number,
    offset: number,
  ): Promise<RewardResponese> => {
    const response = await request.get<ApiResponse<{ total: number; records: RewardRecord[] }>>(
      '/api/1/user/task/claimed-records',
      {
        params: { limit, offset, task_type: type },
      },
    );
    return response.data;
  },
};

// 任务相关接口
export const apiTask = {
  /**
   * 获取每日任务
   */
  getDailyTasks: async (): Promise<DailyTasksResponse> => {
    return await request.post<DailyTasksResponse>('/api/1/user/task/claim');
  },

  /**
   * 提交任务
   */
  submissionTask: async (
    taskId: number,
    medias: Array<Record<string, unknown>>,
  ): Promise<unknown> => {
    return request.post('/api/1/user/task/submit', {
      data: { task_id: taskId, medias },
    });
  },

  /**
   * 获取媒体文件上传URL
   */
  getUploadUrl: async (taskId: number): Promise<unknown> => {
    return request.post('/api/1/user/task/upload-url', {
      data: { task_id: taskId },
    });
  },

  /**
   * 上传任务图片
   */
  uploadTaskImage: async (taskId: number, file: File): Promise<string> => {
    const urlRes = await request.post<ApiResponse<{ upload_url: string; file_url: string }>>(
      '/api/1/user/task/upload-url',
      {
        data: { task_id: taskId },
      },
    );
    const uploadUrl = urlRes.data.upload_url;
    const fileUrl = urlRes.data.file_url;
    await request.uploadImage(uploadUrl, file);
    return fileUrl;
  },

  /**
   * 获取可领取金额
   */
  getClaimableAmount: async (type: string): Promise<number> => {
    const response = await request.get<ApiResponse<{ claimable_amount: number }>>(
      '/api/1/user/task/claimable-amount',
      {
        params: { task_type: type },
      },
    );
    return response.data.claimable_amount || 0;
  },
};

// 导出所有API模块
export default {
  user: apiUser,
  ad: apiAd,
  invite: apiInvite,
  leaderboard: apiLeaderboard,
  payment: apiPayment,
  pro: apiPro,
  records: apiRecords,
  task: apiTask,
};
