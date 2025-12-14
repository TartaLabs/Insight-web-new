import React, { useState, useEffect, useCallback } from 'react';
import { Users, Share2, Coins, Calendar, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { HudPanel, GameButton } from '../../ui';
import { copyToClipboard, formatTimestamp } from '@/utils';
import { useUserStore } from '@/store/userStore';
import { apiTask, apiUser, apiInvite } from '@/services/api';
import { InviteRecord } from '@/services/model/types';
import toast from 'react-hot-toast';

interface InvitationTabProps {
  onClaimInvitationRewards: () => void;
}

/**
 * 邀请 Tab 组件
 */
export const InvitationTab: React.FC<InvitationTabProps> = ({ onClaimInvitationRewards }) => {
  const [searchParams] = useSearchParams();
  const { user, setUser } = useUserStore();

  // 从 URL 参数获取邀请码
  const inviteCodeFromUrl = searchParams.get('inviteCode') || '';

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [inviteInput, setInviteInput] = useState(inviteCodeFromUrl);
  const [invitationRewards, setInvitationRewards] = useState(0);
  const [inviteRecords, setInviteRecords] = useState<InviteRecord[]>([]);
  const [inviteTotal, setInviteTotal] = useState(0);
  const [inviteLoading, setInviteLoading] = useState(false);

  const enableBind = !user.refer_user;

  useEffect(() => {
    const fetchInvitationRewards = async () => {
      const rewards = await apiTask.getClaimableAmount('INVITE');
      setInvitationRewards(rewards);
    };
    fetchInvitationRewards();
  }, []);

  useEffect(() => {
    const fetchInviteRecords = async () => {
      setInviteLoading(true);
      try {
        const res = await apiInvite.getInviteRecords(50, 0);
        setInviteRecords(res.users ?? []);
        setInviteTotal(res.total);
      } catch (error) {
        console.error('Failed to fetch invite records:', error);
      } finally {
        setInviteLoading(false);
      }
    };
    fetchInviteRecords();
  }, []);

  const inviteCodeDisplay = user.referral_code || '';
  const inviteLinkDisplay = `${window.location.origin}${window.location.pathname}?inviteCode=${inviteCodeDisplay}&inviter=${encodeURIComponent(user.nickname || '')}`;

  const verifyCode = useCallback(async () => {
    if (verifyLoading) return;
    try {
      setVerifyLoading(true);
      const res = await apiUser.verifyRefCode(inviteInput.trim());
      if (!res) {
        throw new Error('Failed to verify invite code');
      }
      const newUser = await apiUser.updateUserData(user.nickname, inviteInput.trim());
      setUser({ ...user, ...newUser });
      toast.success('Invite code verified');
    } catch (error) {
      console.log(error);
      toast.error('Failed to verify invite code');
    } finally {
      setVerifyLoading(false);
    }
  }, [inviteInput, verifyLoading, user.nickname]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Bind Invite Code */}
        <HudPanel className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] text-tech-blue uppercase tracking-widest">Invitation</div>
              <div className="text-xl font-bold text-white">Bind Invite Code</div>
              {user.refer_user && (
                <div className="text-xs text-gray-500 mt-1">Invited by {user.refer_user}</div>
              )}
            </div>
            {!enableBind && (
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
                if (!enableBind) return;
                setInviteInput(e.target.value);
              }}
              disabled={!enableBind}
              placeholder="Enter invite code"
              className={`flex-1 bg-black/40 border ${!enableBind ? 'border-white/10 text-gray-500' : 'border-white/10 focus:border-tech-blue'} rounded px-3 py-2 text-sm`}
            />
            <GameButton
              loading={verifyLoading}
              onClick={() => {
                verifyCode();
              }}
              disabled={!enableBind || !inviteInput.trim()}
              className="sm:w-40"
            >
              APPLY
            </GameButton>
          </div>
        </HudPanel>

        {/* Network Size */}
        <HudPanel className="p-6">
          <div className="flex justify-between items-start mb-6">
            <Users size={32} className="text-gray-600" />
            <div className="text-right">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                Network Size
              </div>
              <div className="text-3xl font-bold text-white font-mono">{user.refer_count} / 10</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-bold text-white flex items-center justify-between">
              <span>Your Invite Code</span>
              <button
                onClick={() => copyToClipboard(inviteCodeDisplay, 'Invite code copied')}
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
                onClick={() => copyToClipboard(inviteLinkDisplay, 'Invite link copied')}
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
                +{invitationRewards.toFixed(1)} $mEMO
              </div>
            </div>
          </div>
          <GameButton
            onClick={onClaimInvitationRewards}
            disabled={invitationRewards <= 0}
            className="w-full flex items-center justify-center gap-2"
          >
            <Coins size={14} /> EXTRACT COMMISSION
          </GameButton>
        </HudPanel>
      </div>

      {/* Active Nodes */}
      <div className="border border-white/5 bg-black/20 p-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest flex items-center gap-2">
          <Users size={14} /> Active Nodes ({inviteTotal})
        </h4>
        {inviteLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="text-tech-blue animate-spin" />
          </div>
        ) : inviteRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No invitations yet. Share your invite code to get started!
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {inviteRecords.map((record) => (
              <div
                key={record.user_id}
                className="bg-white/5 border border-white/5 p-4 flex justify-between items-center hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="font-bold text-white text-sm mb-1">{record.nickname}</div>
                  <div className="text-[10px] text-gray-500 font-mono flex gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={8} /> {formatTimestamp(record.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-xs font-bold text-green-400 mb-1">
                    +{record.pending_amount.toFixed(1)}{' '}
                    <span className="text-gray-500 font-normal">Pending</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Claimed: <span className="text-white">{record.claimed_amount.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
