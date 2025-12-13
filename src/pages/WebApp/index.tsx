import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Workspace } from './components/Workspace';
import { TaskFlow } from './components/TaskFlow';
import { UpgradeModal } from './components/UpgradeModal';
import { TransactionModal } from './components/TransactionModal';
import { useWebAppState } from './hooks';
import { useUserStore } from '../../store/userStore';
import { useProStore } from '../../store/proStore';
import { useTaskStore } from '../../store/taskStore';

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
  const { fetchUserData, initialized: userInitialized } = useUserStore();
  const { fetchProVersion, initialized: proInitialized } = useProStore();
  const { fetchDailyTasks, initialized: taskInitialized } = useTaskStore();

  useEffect(() => {
    if (!userInitialized) {
      fetchUserData();
    }
    if (!proInitialized) {
      fetchProVersion();
    }
    if (!taskInitialized) {
      fetchDailyTasks();
    }
  }, [
    userInitialized,
    fetchUserData,
    proInitialized,
    fetchProVersion,
    taskInitialized,
    fetchDailyTasks,
  ]);

  // WebApp 核心状态
  const state = useWebAppState();

  // 升级弹窗状态
  const [showUpgrade, setShowUpgrade] = useState(false);

  // 登录页面
  if (!state.isLoggedIn) {
    const { locked, persisted } = state.inviteCode.inviteCodeInfo;
    const inviteLocked = locked || persisted;

    return (
      <Login
        onLoginSuccess={state.handleLogin}
        onBack={onExit}
        inviteCode={state.inviteCode.inviteCodeInfo.code}
        inviteLocked={inviteLocked}
        invitedBy={state.inviteCode.inviteCodeInfo.invitedBy}
        existingNicknames={state.existingNicknames}
        onInviteChange={(code) =>
          state.inviteCode.setInviteCodeInfo((prev) => ({
            ...prev,
            code,
            invitedBy: '',
            locked: false,
            persisted: false,
          }))
        }
        onValidateInvite={state.inviteCode.validateInviteCode}
        onPersistInvite={(code) =>
          state.inviteCode.bindInviteCode(code, { lock: true, persist: true })
        }
      />
    );
  }

  // 工作台页面
  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
      <Workspace
        user={state.user}
        tasks={state.tasks}
        taskCounts={state.taskCounts}
        dailyLimit={state.getDailyLimit()}
        rewardPerTask={state.getRewardPerTask()}
        history={state.history}
        leaderboard={state.leaderboard}
        invitees={state.invitees}
        inviteCodeInfo={state.inviteCode.inviteCodeInfo}
        ownInviteCode={state.inviteCode.ownInviteCode}
        inviteLink={state.inviteCode.inviteLink}
        subscriptions={state.subscriptions}
        onRenameNickname={state.handleRenameNickname}
        onApplyInviteCode={(code) =>
          state.inviteCode.bindInviteCode(code, { lock: true, persist: true })
        }
        onStartTask={state.handleStartTask}
        onResumeTask={state.handleResumeTask}
        onDeleteTask={state.handleDeleteTask}
        onUpgradeClick={() => setShowUpgrade(true)}
        onClaimAll={state.handleClaimAll}
        onClaimBonus={state.handleClaimDailyBonus}
        onRetryClaim={state.handleRetryClaim}
        onClaimInvitationRewards={state.handleClaimInvitationRewards}
        onExit={onExit}
      />

      {/* 任务流程弹窗 */}
      {state.activeTaskEmotion && (
        <TaskFlow
          emotion={state.activeTaskEmotion}
          initialTask={state.activeDraftTask}
          rewardAmount={state.getRewardPerTask()}
          onSave={state.handleSaveDraft}
          onSubmit={state.handleSubmitTask}
          onCancel={state.handleCancelTask}
        />
      )}

      {/* 升级弹窗 */}
      {showUpgrade && (
        <UpgradeModal
          user={state.user}
          onClose={() => setShowUpgrade(false)}
          onUpgrade={(plan) => {
            state.handleUpgrade(plan);
            setShowUpgrade(false);
          }}
        />
      )}

      {/* 交易模拟弹窗 */}
      {state.transaction.txModal.isOpen && (
        <TransactionModal
          type={state.transaction.txModal.type}
          title={state.transaction.txModal.title}
          amount={state.transaction.txModal.amount}
          cost={state.transaction.txModal.cost}
          onClose={state.transaction.closeTransaction}
          onSuccess={state.transaction.handleTransactionSuccess}
        />
      )}
    </div>
  );
};
