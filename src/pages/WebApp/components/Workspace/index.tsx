import React, { useState } from 'react';
import { AppBar } from './AppBar';
import { UserInfoCard } from './UserInfoCard';
import { WalletCard } from './WalletCard';
import { MembershipCard } from './MembershipCard';
import { TaskListCard } from './TaskListCard';
import { BottomTabs } from './BottomTabs';
import { NicknameEditModal } from '../modals/NicknameEditModal';
import {
  UserProfile,
  TaskCounts,
  TaskRecord,
  Transaction,
  LeaderboardEntry,
  Invitee,
  SubscriptionRecord,
  EmotionType,
  InviteCodeInfo,
  RenameResult,
} from '../../types';

interface WorkspaceProps {
  user: UserProfile;
  tasks: TaskRecord[];
  taskCounts: TaskCounts;
  dailyLimit: number;
  rewardPerTask: number;
  history: Transaction[];
  leaderboard: LeaderboardEntry[];
  invitees: Invitee[];
  inviteCodeInfo: InviteCodeInfo;
  ownInviteCode: string;
  inviteLink: string;
  subscriptions: SubscriptionRecord[];
  onRenameNickname: (nickname: string) => RenameResult;
  onApplyInviteCode: (code: string) => RenameResult;
  onStartTask: (emotion: EmotionType) => void;
  onResumeTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
  onUpgradeClick: () => void;
  onClaimAll: () => void;
  onClaimBonus: () => void;
  onRetryClaim: (tx: Transaction) => void;
  onClaimInvitationRewards: () => void;
  onExit: () => void;
}

const getTodayUTC = () => new Date().toISOString().split('T')[0];

/**
 * 工作台容器组件
 * 组合各个卡片组件和底部 Tab 面板
 */
export const Workspace: React.FC<WorkspaceProps> = ({
  user,
  tasks,
  taskCounts,
  dailyLimit,
  history,
  leaderboard,
  invitees,
  inviteCodeInfo,
  ownInviteCode,
  inviteLink,
  subscriptions,
  onRenameNickname,
  onApplyInviteCode,
  onStartTask,
  onResumeTask,
  onDeleteTask,
  onUpgradeClick,
  onClaimAll,
  onClaimBonus,
  onRetryClaim,
  onClaimInvitationRewards,
  onExit,
}) => {
  const [toast, setToast] = useState('');
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);

  const today = getTodayUTC();
  const hasClaimedBonus = user.lastDailyBonusDate === today;

  const copyToClipboard = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(successMsg);
      setTimeout(() => setToast(''), 1800);
    } catch {
      setToast('Copy failed. Please try again.');
      setTimeout(() => setToast(''), 1800);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
      <AppBar onExit={onExit} />

      <div className="min-h-screen bg-[#020205] pt-24 pb-12 px-4 md:px-8 font-mono text-gray-300 bg-[radial-gradient(ellipse_at_top,rgba(16,24,60,0.4),transparent_70%)]">
        {/* TOP ROW: User Profile & Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UserInfoCard
            user={user}
            onEditNickname={() => setNicknameModalOpen(true)}
            onCopyAddress={() => copyToClipboard('TODO: wallet address', 'Address copied')}
          />
          <WalletCard user={user} onClaimAll={onClaimAll} />
        </div>

        {/* MIDDLE ROW: Membership & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <MembershipCard
            user={user}
            hasClaimedBonus={hasClaimedBonus}
            onClaimBonus={onClaimBonus}
            onUpgradeClick={onUpgradeClick}
          />
          <TaskListCard taskCounts={taskCounts} dailyLimit={dailyLimit} onStartTask={onStartTask} />
        </div>

        {/* BOTTOM ROW: Multi-Tab Panel */}
        <BottomTabs
          user={user}
          tasks={tasks}
          history={history}
          leaderboard={leaderboard}
          invitees={invitees}
          inviteCodeInfo={inviteCodeInfo}
          ownInviteCode={ownInviteCode}
          inviteLink={inviteLink}
          subscriptions={subscriptions}
          onRenameNickname={onRenameNickname}
          onApplyInviteCode={onApplyInviteCode}
          onResumeTask={onResumeTask}
          onDeleteTask={onDeleteTask}
          onRetryClaim={onRetryClaim}
          onClaimInvitationRewards={onClaimInvitationRewards}
          copyToClipboard={copyToClipboard}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/80 border border-tech-blue/40 text-white text-xs font-mono px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {/* Nickname Edit Modal */}
      {nicknameModalOpen && (
        <NicknameEditModal
          currentNickname={user.nickname}
          onSave={onRenameNickname}
          onClose={() => setNicknameModalOpen(false)}
        />
      )}
    </div>
  );
};

export { AppBar } from './AppBar';
export { UserInfoCard } from './UserInfoCard';
export { WalletCard } from './WalletCard';
export { MembershipCard } from './MembershipCard';
export { TaskListCard } from './TaskListCard';
