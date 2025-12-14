import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAccount, useDisconnect } from 'wagmi';
import { Workspace } from './components/Workspace';
import { TaskFlow } from './components/TaskFlow';
import { UpgradeModal } from './components/UpgradeModal';
import { TransactionModal } from './components/TransactionModal';
import { DisconnectModal } from './components/modals/DisconnectModal';
import { useTransaction } from './hooks';
import { useUserStore } from '../../store/userStore';
import { useProStore } from '../../store/proStore';
import { useTaskStore } from '../../store/taskStore';
import { getTabFromRoute } from './components/Workspace/BottomTabs';
import type { TabType } from './types';

/**
 * WebApp 主容器组件
 * 负责：
 * 1. 解析路由参数决定当前 Tab
 * 2. 全局模态框管理
 * 3. 钱包断连处理
 */
export const WebApp: React.FC = () => {
  const navigate = useNavigate();
  const { tab } = useParams<{ tab?: string }>();
  const { isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  // 从路由参数解析当前 Tab
  const activeTab: TabType = getTabFromRoute(tab || 'contributions');

  // Store
  const { user, reset: resetUserStore } = useUserStore();
  const { reset: resetProStore } = useProStore();
  const { activeTaskFlow, reset: resetTaskStore } = useTaskStore();

  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // 监听钱包断开连接
  useEffect(() => {
    if (isDisconnected && user) {
      setShowDisconnectModal(true);
    }
  }, [isDisconnected, user]);

  // 处理断连弹窗确认
  const handleDisconnectConfirm = useCallback(() => {
    setShowDisconnectModal(false);
    resetUserStore();
    resetProStore();
    resetTaskStore();
    navigate('/', { replace: true });
  }, [resetUserStore, resetProStore, resetTaskStore, navigate]);

  // 交易逻辑
  const transaction = useTransaction();

  // 升级弹窗状态
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleExit = () => {
    disconnect();
    resetUserStore();
    resetProStore();
    resetTaskStore();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
      <Workspace
        activeTab={activeTab}
        onUpgradeClick={() => setShowUpgrade(true)}
        onClaimAll={transaction.handleClaimAll}
        onClaimBonus={transaction.handleClaimDailyBonus}
        onClaimInvitationRewards={transaction.handleClaimInvitationRewards}
        onExit={handleExit}
      />

      {/* 任务流程弹窗 */}
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
