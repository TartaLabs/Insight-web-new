import React, { useState, useEffect, useCallback } from 'react';
import { Login } from './components/Login';
import { Workspace } from './components/Workspace';
import { TaskFlow } from './components/TaskFlow';
import { UpgradeModal } from './components/UpgradeModal';
import { TransactionModal } from './components/TransactionModal';
import { LoadingScreen } from './components/LoadingScreen';
import { DisconnectModal } from './components/modals/DisconnectModal';
import { useTransaction } from './hooks';
import { useUserStore } from '../../store/userStore';
import { useProStore } from '../../store/proStore';
import { useTaskStore } from '../../store/taskStore';
import type { User } from '../../services/model/types';
import { useAccount, useDisconnect } from 'wagmi';

interface WebAppProps {
  onExit: () => void;
}

/**
 * WebApp 应用骨架组件
 * 负责：
 * 1. Store 数据初始化
 * 2. 登录/工作台状态切换
 * 3. 全局模态框管理
 */
export const WebApp: React.FC<WebAppProps> = ({ onExit }) => {
  // Store 初始化
  const {
    fetchUserData,
    fetchPendingRewards,
    initialized: userInitialized,
    user,
    setUser,
    reset,
    reset: resetUserStore,
  } = useUserStore();
  const {
    fetchProVersion,
    fetchProVersionList,
    initialized: proInitialized,
    reset: resetProStore,
  } = useProStore();
  const {
    fetchDailyTasks,
    initialized: taskInitialized,
    activeTaskFlow,
    reset: resetTaskStore,
  } = useTaskStore();

  const [showLogin, setShowLogin] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const { isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  // 并行初始化所有需要认证的数据
  const initializeAuthenticatedData = useCallback(async () => {
    await Promise.all([
      fetchPendingRewards(),
      fetchProVersion(),
      fetchProVersionList(),
      fetchDailyTasks(),
    ]);
  }, [fetchPendingRewards, fetchProVersion, fetchProVersionList, fetchDailyTasks]);

  // 首次加载时，尝试通过 token 获取用户数据
  useEffect(() => {
    const initApp = async () => {
      if (!userInitialized) {
        try {
          await fetchUserData();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          reset();
          setShowLogin(true);
        }
      }
    };
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当用户登录成功后（user 从 null 变为有值），拉取其他数据
  useEffect(() => {
    if (user && userInitialized) {
      // 用户已登录，并行拉取其他依赖数据
      if (!proInitialized || !taskInitialized) {
        initializeAuthenticatedData();
      }
    }
  }, [user, userInitialized, proInitialized, taskInitialized, initializeAuthenticatedData]);

  // 监听钱包断开连接
  useEffect(() => {
    // 只有在用户已登录且钱包断开时才显示弹窗
    if (isDisconnected && user && userInitialized && !showLogin) {
      setShowDisconnectModal(true);
    }
  }, [isDisconnected, user, userInitialized, showLogin]);

  // 处理断连弹窗确认
  const handleDisconnectConfirm = useCallback(() => {
    setShowDisconnectModal(false);
    // 清空本地登录态
    reset();
    resetProStore();
    resetTaskStore();
    // 回到首页
    onExit();
  }, [reset, resetProStore, resetTaskStore, onExit]);

  // 登录成功回调：设置用户并触发数据重新加载
  const handleLoginSuccess = useCallback(
    async (loggedInUser: User) => {
      // 重置其他 store 的 initialized 状态，确保重新拉取
      resetProStore();
      resetTaskStore();
      setShowLogin(false); // 登录成功后，隐藏登录页面

      // 设置用户
      setUser(loggedInUser);

      // 并行拉取所有需要认证的数据
      await initializeAuthenticatedData();
    },
    [setUser, resetProStore, resetTaskStore, initializeAuthenticatedData],
  );

  // 交易逻辑
  const transaction = useTransaction();

  // 升级弹窗状态
  const [showUpgrade, setShowUpgrade] = useState(false);

  // 判断是否仍在初始化中（任一 store 未完成初始化）
  const isInitializing = !userInitialized || !proInitialized || !taskInitialized;

  const handleExit = () => {
    onExit();
    // 断开钱包
    disconnect();
    // 清空本地缓存
    resetUserStore();
    resetProStore();
    resetTaskStore();
    // 重制登录状态
    setShowLogin(true);
  };

  // 登录页面
  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} onBack={onExit} />;
  }

  // 阻塞式加载页面
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // 工作台页面
  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
      <Workspace
        onUpgradeClick={() => setShowUpgrade(true)}
        onClaimAll={transaction.handleClaimAll}
        onClaimBonus={transaction.handleClaimDailyBonus}
        onClaimInvitationRewards={transaction.handleClaimInvitationRewards}
        onExit={handleExit}
      />

      {/* 任务流程弹窗 - 所有数据从 store 的 activeTaskFlow 中获取 */}
      {activeTaskFlow && <TaskFlow />}

      {/* 升级弹窗 */}
      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          onUpgrade={(plan) => {
            transaction.handleUpgrade(plan);
            setShowUpgrade(false);
          }}
        />
      )}

      {/* 交易模拟弹窗 */}
      {transaction.txModal.isOpen && (
        <TransactionModal
          type={transaction.txModal.type}
          title={transaction.txModal.title}
          amount={transaction.txModal.amount}
          cost={transaction.txModal.cost}
          onClose={transaction.closeTransaction}
          onSuccess={transaction.handleTransactionSuccess}
        />
      )}

      {/* 钱包断连阻塞性弹窗 */}
      {showDisconnectModal && <DisconnectModal onConfirm={handleDisconnectConfirm} />}
    </div>
  );
};
