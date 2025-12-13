import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Workspace } from './components/Workspace';
import { TaskFlow } from './components/TaskFlow';
import { UpgradeModal } from './components/UpgradeModal';
import { TransactionModal } from './components/TransactionModal';
import { LoadingScreen } from './components/LoadingScreen';
import { useWebAppState } from './hooks';
import { useUserStore } from '../../store/userStore';
import { useProStore } from '../../store/proStore';
import { useTaskStore, getEmotionFromTaskFlow } from '../../store/taskStore';
import type { QuestionAnswer } from '../../services/model/types';
import type { TaskRecord } from '../../types';

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
  } = useUserStore();
  const { fetchProVersion, fetchProVersionList, initialized: proInitialized } = useProStore();
  const {
    fetchDailyTasks,
    initialized: taskInitialized,
    activeTaskFlow,
    saveDraft,
    submitTask,
    cancelTask,
    tasks,
  } = useTaskStore();

  useEffect(() => {
    if (!userInitialized) {
      fetchUserData();
      fetchPendingRewards();
    }
    if (!proInitialized) {
      fetchProVersion();
      fetchProVersionList();
    }
    if (!taskInitialized) {
      fetchDailyTasks();
    }
  }, []);

  // WebApp 核心状态
  const state = useWebAppState();

  // 升级弹窗状态
  const [showUpgrade, setShowUpgrade] = useState(false);

  // 判断是否所有初始化完成
  const isInitializing = !userInitialized || !proInitialized || !taskInitialized;

  // Handle reward issued from task submission
  const handleTaskSubmit = (record: TaskRecord, answers: QuestionAnswer[]) => {
    // TODO: 在实际提交时，可以将 answers 发送到后端
    console.log('Submitting answers:', answers);

    submitTask(record, (amount) => {
      // Update user pending rewards and add history record
      state.setUser((prev) => ({
        ...prev,
        pendingRewards: prev.pendingRewards + amount,
      }));

      state.setHistory((prev) => [
        {
          id: Date.now().toString(),
          category: 'ISSUANCE',
          source: 'Label Task',
          amount: amount,
          timestamp: Date.now(),
          status: 'SUCCESS',
          desc: 'Reward Issued',
        },
        ...prev,
      ]);
    });
  };

  // 获取当前任务的 questions
  const getQuestionsFromTaskFlow = () => {
    if (!activeTaskFlow) return [];
    if (activeTaskFlow.apiTask) return activeTaskFlow.apiTask.questions;
    // 如果是从草稿恢复，根据 draft.emotion 从 tasks 中找到对应任务的 questions
    if (activeTaskFlow.draft) {
      const matchingTask = tasks.find((t) => t.emotion_type === activeTaskFlow.draft?.emotion);
      return matchingTask?.questions || [];
    }
    return [];
  };

  // 阻塞式加载页面
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // 登录页面
  if (!user) {
    const { locked, persisted } = state.inviteCode.inviteCodeInfo;
    const inviteLocked = locked || persisted;

    return (
      <Login
        onLoginSuccess={(u) => setUser(u)}
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
        rewardPerTask={state.getRewardPerTask()}
        history={state.history}
        leaderboard={state.leaderboard}
        invitees={state.invitees}
        inviteCodeInfo={state.inviteCode.inviteCodeInfo}
        ownInviteCode={state.inviteCode.ownInviteCode}
        inviteLink={state.inviteCode.inviteLink}
        subscriptions={state.subscriptions}
        onApplyInviteCode={(code) =>
          state.inviteCode.bindInviteCode(code, { lock: true, persist: true })
        }
        onUpgradeClick={() => setShowUpgrade(true)}
        onClaimAll={state.handleClaimAll}
        onClaimBonus={state.handleClaimDailyBonus}
        onRetryClaim={state.handleRetryClaim}
        onClaimInvitationRewards={state.handleClaimInvitationRewards}
        onExit={onExit}
      />

      {/* 任务流程弹窗 */}
      {activeTaskFlow && (
        <TaskFlow
          emotion={getEmotionFromTaskFlow(activeTaskFlow)}
          questions={getQuestionsFromTaskFlow()}
          initialTask={activeTaskFlow.draft}
          rewardAmount={state.getRewardPerTask()}
          onSave={saveDraft}
          onSubmit={handleTaskSubmit}
          onCancel={cancelTask}
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
