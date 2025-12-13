import { useState, useCallback, useEffect } from 'react';
import {
  InviteCodeInfo,
  InviteUsageMap,
  ValidateInviteResult,
  BindInviteOptions,
} from '../types';

const INVITE_LIMIT = 10;

const INITIAL_INVITE_USAGE: InviteUsageMap = {
  TARTA10: { owner: 'Tarta Labs', used: 10 },
  ALICE99: { owner: 'Alice_99', used: 3 },
  BASIC01: { owner: 'Community Member', used: 0 },
};

export interface UseInviteCodeReturn {
  inviteCodeInfo: InviteCodeInfo;
  inviteUsage: InviteUsageMap;
  ownInviteCode: string;
  inviteLink: string;
  validateInviteCode: (code: string) => ValidateInviteResult;
  bindInviteCode: (
    code: string,
    options?: BindInviteOptions,
  ) => ValidateInviteResult;
  initializeOwnInviteCode: (wallet: string, nickname: string) => void;
  setInviteCodeInfo: React.Dispatch<React.SetStateAction<InviteCodeInfo>>;
}

export function useInviteCode(): UseInviteCodeReturn {
  const [inviteCodeInfo, setInviteCodeInfo] = useState<InviteCodeInfo>({
    code: '',
    invitedBy: '',
    locked: false,
    persisted: false,
  });

  const [inviteUsage, setInviteUsage] =
    useState<InviteUsageMap>(INITIAL_INVITE_USAGE);

  const [ownInviteCode, setOwnInviteCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  // Create validateInviteCode based on current inviteUsage
  const validateInviteCode = useCallback(
    (code: string): ValidateInviteResult => {
      const trimmed = code.trim();
      if (!trimmed) return { ok: true, invitedBy: '' };
      const record = inviteUsage[trimmed];
      if (!record) {
        return { ok: false, message: 'Invite code is invalid or expired' };
      }
      if (record.used >= INVITE_LIMIT) {
        return {
          ok: false,
          message: 'Invite code has reached the limit (10/10)',
          invitedBy: record.owner,
        };
      }
      return { ok: true, invitedBy: record.owner };
    },
    [inviteUsage],
  );

  const bindInviteCode = useCallback(
    (code: string, options?: BindInviteOptions): ValidateInviteResult => {
      const trimmed = code.trim();
      if (!trimmed) {
        setInviteCodeInfo({
          code: '',
          invitedBy: '',
          locked: false,
          persisted: false,
        });
        return { ok: true };
      }

      const { ok, message, invitedBy } = validateInviteCode(trimmed);
      if (!ok) return { ok, message };

      const owner = invitedBy || 'Community Member';
      const shouldPersist = options?.persist ?? false;
      const shouldLock = options?.lock ?? false;

      setInviteCodeInfo((prev) => ({
        code: trimmed,
        invitedBy: owner,
        locked: shouldLock || prev.locked,
        persisted: prev.persisted || shouldPersist,
      }));

      if (
        shouldPersist &&
        (!inviteCodeInfo.persisted || inviteCodeInfo.code !== trimmed)
      ) {
        setInviteUsage((prev) => {
          const current = prev[trimmed] || { owner, used: 0 };
          const updatedUsed = Math.min(INVITE_LIMIT, current.used + 1);
          return {
            ...prev,
            [trimmed]: { owner: current.owner || owner, used: updatedUsed },
          };
        });
        localStorage.setItem('insight_invite_code', trimmed);
        localStorage.setItem('insight_invited_by', owner);
      }

      return { ok: true, invitedBy: owner };
    },
    [validateInviteCode, inviteCodeInfo.persisted, inviteCodeInfo.code],
  );

  const initializeOwnInviteCode = useCallback(
    (wallet: string, nickname: string) => {
      const code = `INV-${
        wallet
          .replace(/[^0-9a-zA-Z]/g, '')
          .slice(-6)
          .toUpperCase() || 'NODE'
      }`;
      setOwnInviteCode(code);

      if (typeof window !== 'undefined') {
        const link = `${window.location.origin}${window.location.pathname}?code=${code}&inviter=${encodeURIComponent(nickname || 'user')}`;
        setInviteLink(link);
      }

      setInviteUsage((prev) => ({
        ...prev,
        [code]: { owner: nickname || 'You', used: prev[code]?.used || 0 },
      }));
    },
    [],
  );

  // Prefill invite code from storage or URL on mount
  useEffect(() => {
    const storedCode = localStorage.getItem('insight_invite_code') || '';
    const storedBy = localStorage.getItem('insight_invited_by') || '';
    if (storedCode) {
      const res = validateInviteCode(storedCode);
      if (res.ok) {
        setInviteCodeInfo({
          code: storedCode,
          invitedBy: res.invitedBy || storedBy || 'Community Member',
          locked: true,
          persisted: true,
        });
      } else {
        localStorage.removeItem('insight_invite_code');
        localStorage.removeItem('insight_invited_by');
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code') || '';
      const inviter = params.get('inviter') || '';
      if (code) {
        const res = validateInviteCode(code);
        if (res.ok) {
          const owner =
            res.invitedBy ||
            inviteUsage[code]?.owner ||
            inviter ||
            'Community Member';
          setInviteCodeInfo({
            code,
            invitedBy: owner,
            locked: true,
            persisted: false,
          });
        } else {
          setInviteCodeInfo({
            code: '',
            invitedBy: '',
            locked: false,
            persisted: false,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inviteCodeInfo,
    inviteUsage,
    ownInviteCode,
    inviteLink,
    validateInviteCode,
    bindInviteCode,
    initializeOwnInviteCode,
    setInviteCodeInfo,
  };
}

