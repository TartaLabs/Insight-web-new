import React, { useState } from 'react';
import { Clock, CreditCard, Crown, Share2, Wallet } from 'lucide-react';
import { TabType } from '../../../types';
import { ContributionsTab } from './ContributionsTab';
import { LedgerTab } from './LedgerTab';
import { LeaderboardTab } from './LeaderboardTab';
import { InvitationTab } from './InvitationTab';
import { SubscriptionsTab } from './SubscriptionsTab';

interface BottomTabsProps {
  onClaimInvitationRewards: () => void;
}

const tabs = [
  { id: 'contributions' as TabType, icon: Clock, label: 'CONTRIBUTIONS' },
  { id: 'memo_history' as TabType, icon: Wallet, label: 'LEDGER' },
  { id: 'leaderboard' as TabType, icon: Crown, label: 'RANKING' },
  { id: 'invitation' as TabType, icon: Share2, label: 'INVITATION' },
  { id: 'subscriptions' as TabType, icon: CreditCard, label: 'SUBSCRIPTIONS' },
];

/**
 * 底部多 Tab 面板容器
 */
export const BottomTabs: React.FC<BottomTabsProps> = ({ onClaimInvitationRewards }) => {
  const [activeTab, setActiveTab] = useState<TabType>('contributions');

  return (
    <div className="border border-white/10 bg-[#0a0a0f] min-h-[500px]">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-black/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 text-xs font-bold flex items-center gap-2 transition-all relative
              ${activeTab === tab.id ? 'text-tech-blue bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
            `}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-blue shadow-[0_0_10px_#00f3ff]" />
            )}
          </button>
        ))}
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

export { ContributionsTab } from './ContributionsTab';
export { LedgerTab } from './LedgerTab';
export { LeaderboardTab } from './LeaderboardTab';
export { InvitationTab } from './InvitationTab';
export { SubscriptionsTab } from './SubscriptionsTab';
