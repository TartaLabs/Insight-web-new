import React, { useState, useEffect } from 'react';
import { Users, Share2, Coins, Calendar, Activity } from 'lucide-react';
import { User, Invitee, InviteCodeInfo, RenameResult } from '../../../types';
import { HudPanel, GameButton } from '../../ui';

interface InvitationTabProps {
  user: User;
  invitees: Invitee[];
  inviteCodeInfo: InviteCodeInfo;
  ownInviteCode: string;
  inviteLink: string;
  onApplyInviteCode: (code: string) => RenameResult;
  onClaimInvitationRewards: () => void;
  copyToClipboard: (text: string, successMsg: string) => void;
}

/**
 * 邀请 Tab 组件
 */
export const InvitationTab: React.FC<InvitationTabProps> = ({
  user,
  invitees,
  inviteCodeInfo,
  ownInviteCode,
  inviteLink,
  onApplyInviteCode,
  onClaimInvitationRewards,
  copyToClipboard,
}) => {
  const [inviteInput, setInviteInput] = useState(inviteCodeInfo.code || '');
  const [inviteMessage, setInviteMessage] = useState('');

  // Sync invite input with prop changes
  const prevInviteCode = React.useRef(inviteCodeInfo.code);
  useEffect(() => {
    if (prevInviteCode.current !== inviteCodeInfo.code) {
      setInviteInput(inviteCodeInfo.code || '');
      prevInviteCode.current = inviteCodeInfo.code;
    }
  }, [inviteCodeInfo.code]);

  const inviteCodeDisplay = ownInviteCode || 'INV-XXXX';
  const inviteLinkDisplay =
    inviteLink ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?code=${inviteCodeDisplay}&inviter=${encodeURIComponent(user.nickname || 'user')}`
      : '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Bind Invite Code */}
        <HudPanel className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] text-tech-blue uppercase tracking-widest">
                Invitation
              </div>
              <div className="text-xl font-bold text-white">
                Bind Invite Code
              </div>
              {user.invitedBy && (
                <div className="text-xs text-gray-500 mt-1">
                  Invited by {user.invitedBy}
                </div>
              )}
            </div>
            {(inviteCodeInfo.locked || inviteCodeInfo.persisted) && (
              <div className="px-2 py-1 rounded bg-tech-blue/10 text-tech-blue text-[10px] font-bold">
                LOCKED
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => {
                if (inviteCodeInfo.locked || inviteCodeInfo.persisted) return;
                setInviteInput(e.target.value);
                setInviteMessage('');
              }}
              disabled={inviteCodeInfo.locked || inviteCodeInfo.persisted}
              placeholder="Enter invite code"
              className={`flex-1 bg-black/40 border ${inviteCodeInfo.locked || inviteCodeInfo.persisted ? 'border-white/10 text-gray-500' : 'border-white/10 focus:border-tech-blue'} rounded px-3 py-2 text-sm`}
            />
            <GameButton
              onClick={() => {
                const res = onApplyInviteCode(inviteInput.trim());
                if (!res.ok) {
                  setInviteMessage(res.message || 'Invite code is invalid');
                } else {
                  setInviteMessage(`Bound. Inviter: Community Member`);
                }
              }}
              disabled={
                inviteCodeInfo.locked ||
                inviteCodeInfo.persisted ||
                !inviteInput.trim()
              }
              className="sm:w-40"
            >
              APPLY
            </GameButton>
          </div>
          {inviteMessage && (
            <div className="text-xs text-tech-blue mt-2">{inviteMessage}</div>
          )}
        </HudPanel>

        {/* Network Size */}
        <HudPanel className="p-6">
          <div className="flex justify-between items-start mb-6">
            <Users size={32} className="text-gray-600" />
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                Network Size
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                {user.inviteCount} / 10
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>Your Invite Code</span>
              <button
                onClick={() =>
                  copyToClipboard(inviteCodeDisplay, 'Invite code copied')
                }
                className="text-tech-blue text-[11px] hover:underline"
              >
                Copy
              </button>
            </div>
            <div className="bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-sm text-white">
              {inviteCodeDisplay}
            </div>
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>Invite Link</span>
              <button
                onClick={() =>
                  copyToClipboard(inviteLinkDisplay, 'Invite link copied')
                }
                className="text-tech-blue text-[11px] hover:underline"
              >
                Copy
              </button>
            </div>
            <div className="bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-xs text-white break-all">
              {inviteLinkDisplay || 'Invite link unavailable'}
            </div>
          </div>
        </HudPanel>

        {/* Commission Pool */}
        <HudPanel className="p-6">
          <div className="flex justify-between items-start mb-6">
            <Share2 size={32} className="text-tech-blue" />
            <div className="text-right">
              <div className="text-[10px] text-tech-blue uppercase tracking-widest">
                Commission Pool
              </div>
              <div className="text-3xl font-bold text-white font-mono">
                +{user.invitationRewards.toFixed(1)} $mEMO
              </div>
            </div>
          </div>
          <GameButton
            onClick={onClaimInvitationRewards}
            disabled={user.invitationRewards <= 0}
            className="w-full flex items-center justify-center gap-2"
          >
            <Coins size={14} /> EXTRACT COMMISSION
          </GameButton>
        </HudPanel>
      </div>

      {/* Active Nodes */}
      <div className="border border-white/5 bg-black/20 p-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest flex items-center gap-2">
          <Users size={14} /> Active Nodes
        </h4>
        <div className="space-y-3">
          {invitees.map((invitee) => (
            <div
              key={invitee.id}
              className="bg-white/5 border border-white/5 p-4 flex justify-between items-center hover:border-white/20 transition-colors"
            >
              <div>
                <div className="font-bold text-white text-sm mb-1">
                  {invitee.nickname}
                </div>
                <div className="text-[10px] text-gray-500 font-mono flex gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={8} /> {invitee.inviteDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity size={8} /> {invitee.lastActive}
                  </span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-xs font-bold text-green-400 mb-1">
                  +{invitee.pendingReward.toFixed(1)}{' '}
                  <span className="text-gray-500 font-normal">Pending</span>
                </div>
                <div className="text-[10px] text-gray-500">
                  Claimed:{' '}
                  <span className="text-white">
                    {invitee.claimedReward.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

