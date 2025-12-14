import React from 'react';
import { AppBar } from './AppBar';
import { UserInfoCard } from './UserInfoCard';
import { WalletCard } from './WalletCard';
import { MembershipCard } from './MembershipCard';
import { TaskListCard } from './TaskListCard';
import { BottomTabs } from './BottomTabs';
import { TabType } from '../../types';

interface WorkspaceProps {
  activeTab: TabType;
  onUpgradeClick: () => void;
  onClaimAll: () => void;
  onClaimBonus: () => void;
  onClaimInvitationRewards: () => void;
  onExit: () => void;
}

/**
 * 工作台容器组件
 * 组合各个卡片组件和底部 Tab 面板
 */
export const Workspace: React.FC<WorkspaceProps> = ({
  activeTab,
  onUpgradeClick,
  onClaimAll,
  onClaimBonus,
  onClaimInvitationRewards,
  onExit,
}) => {
  return (
    <div className="relative min-h-screen bg-[#020205] text-white">
      <AppBar onExit={onExit} />

      <div className="min-h-screen bg-[#020205] pt-24 pb-12 px-4 md:px-8 font-mono text-gray-300 bg-[radial-gradient(ellipse_at_top,rgba(16,24,60,0.4),transparent_70%)]">
        {/* TOP ROW: User Profile & Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UserInfoCard />
          <WalletCard onClaimAll={onClaimAll} />
        </div>

        {/* MIDDLE ROW: Membership & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <MembershipCard onClaimBonus={onClaimBonus} onUpgradeClick={onUpgradeClick} />
          <TaskListCard />
        </div>

        {/* BOTTOM ROW: Multi-Tab Panel */}
        <BottomTabs activeTab={activeTab} onClaimInvitationRewards={onClaimInvitationRewards} />
      </div>
    </div>
  );
};

export { AppBar } from './AppBar';
export { UserInfoCard } from './UserInfoCard';
export { WalletCard } from './WalletCard';
export { MembershipCard } from './MembershipCard';
export { TaskListCard } from './TaskListCard';
