import React from 'react';
import { Clock, CreditCard, Crown, Share2, Wallet } from 'lucide-react';
import { NavLink } from 'react-router';
import { TabType } from '../../../types';
import { ContributionsTab } from './ContributionsTab';
import { LedgerTab } from './LedgerTab';
import { LeaderboardTab } from './LeaderboardTab';
import { InvitationTab } from './InvitationTab';
import { SubscriptionsTab } from './SubscriptionsTab';

// Tab 路由映射
const tabRoutes: Record<string, TabType> = {
  contributions: 'contributions',
  ledger: 'memo_history',
  leaderboard: 'leaderboard',
  invitation: 'invitation',
  subscriptions: 'subscriptions',
};

// 反向映射：TabType -> 路由路径
const tabToRoute: Record<TabType, string> = {
  contributions: 'contributions',
  memo_history: 'ledger',
  leaderboard: 'leaderboard',
  invitation: 'invitation',
  subscriptions: 'subscriptions',
};

const tabs = [
  { id: 'contributions' as TabType, route: 'contributions', icon: Clock, label: 'CONTRIBUTIONS' },
  { id: 'memo_history' as TabType, route: 'ledger', icon: Wallet, label: 'LEDGER' },
  { id: 'leaderboard' as TabType, route: 'leaderboard', icon: Crown, label: 'RANKING' },
  { id: 'invitation' as TabType, route: 'invitation', icon: Share2, label: 'INVITATION' },
  {
    id: 'subscriptions' as TabType,
    route: 'subscriptions',
    icon: CreditCard,
    label: 'SUBSCRIPTIONS',
  },
];

interface BottomTabsProps {
  activeTab: TabType;
  onClaimInvitationRewards: () => void;
}

/**
 * 底部多 Tab 面板容器
 * 支持路由化 Tab 导航
 */
export const BottomTabs: React.FC<BottomTabsProps> = ({ activeTab, onClaimInvitationRewards }) => {
  return (
    <div className="border border-white/10 bg-[#0a0a0f] min-h-[500px]">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-black/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <NavLink
              key={tab.id}
              to={`/webapp/${tab.route}`}
              className={`
                px-6 py-3 text-xs font-bold flex items-center gap-2 transition-all relative
                ${isActive ? 'text-tech-blue bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
              `}
            >
              <tab.icon size={14} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-blue shadow-[0_0_10px_#00f3ff]" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'contributions' && <ContributionsTab />}
        {activeTab === 'memo_history' && <LedgerTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'invitation' && (
          <InvitationTab onClaimInvitationRewards={onClaimInvitationRewards} />
        )}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
      </div>
    </div>
  );
};

// 导出路由映射工具函数
export const getTabFromRoute = (route: string): TabType => {
  return tabRoutes[route] || 'contributions';
};

export const getRouteFromTab = (tab: TabType): string => {
  return tabToRoute[tab] || 'contributions';
};

export { ContributionsTab } from './ContributionsTab';
export { LedgerTab } from './LedgerTab';
export { LeaderboardTab } from './LeaderboardTab';
export { InvitationTab } from './InvitationTab';
export { SubscriptionsTab } from './SubscriptionsTab';
