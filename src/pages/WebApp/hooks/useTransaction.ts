import { useState, useCallback } from 'react';
import { TransactionModalState } from '../types';

export interface UseTransactionReturn {
  txModal: TransactionModalState;
  handleClaimAll: () => void;
  handleClaimInvitationRewards: () => void;
  handleClaimDailyBonus: () => void;
  handleRetryClaim: () => void;
  handleUpgrade: (proVersion: string) => void;
  openTransaction: (
    type: 'CLAIM' | 'UPGRADE' | 'APPROVE',
    title: string,
    amount: string | undefined,
    cost: string | undefined,
    onSuccess: () => void,
  ) => void;
  closeTransaction: () => void;
  handleTransactionSuccess: () => void;
}

export function useTransaction(): UseTransactionReturn {
  const [txModal, setTxModal] = useState<TransactionModalState>({
    isOpen: false,
    type: 'CLAIM',
    title: '',
  });

  const openTransaction = useCallback(
    (
      type: 'CLAIM' | 'UPGRADE' | 'APPROVE',
      title: string,
      amount: string | undefined,
      cost: string | undefined,
      onSuccess: () => void,
    ) => {
      setTxModal({
        isOpen: true,
        type,
        title,
        amount,
        cost,
        onSuccessCallback: onSuccess,
      });
    },
    [],
  );

  // 领取全部任务奖励
  const handleClaimAll = useCallback(() => {
    openTransaction('CLAIM', 'Claim All Tasks', undefined, undefined, () => {});
  }, [openTransaction]);

  // 领取邀请奖励
  const handleClaimInvitationRewards = useCallback(() => {
    openTransaction('CLAIM', 'Claim Invitation Rewards', undefined, undefined, () => {});
  }, [openTransaction]);

  // 领取每日奖励
  const handleClaimDailyBonus = useCallback(() => {
    openTransaction('CLAIM', 'Claim Daily Bonus', undefined, undefined, () => {});
  }, [openTransaction]);

  // 领取记录，领取失败，二次领取
  const handleRetryClaim = useCallback(() => {
    openTransaction('CLAIM', 'Retry Claim', undefined, undefined, () => {});
  }, [openTransaction]);

  // 购买升级Pro
  const handleUpgrade = useCallback((_proVersion: string) => {
    console.log('handleUpgrade', _proVersion);
    openTransaction('UPGRADE', 'Upgrade to Pro', undefined, undefined, () => {});
  }, []);

  const closeTransaction = useCallback(() => {
    setTxModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleTransactionSuccess = () => {
    if (txModal.onSuccessCallback) {
      txModal.onSuccessCallback();
    }
    setTxModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    txModal,
    openTransaction,
    closeTransaction,
    handleTransactionSuccess,
    handleClaimAll,
    handleClaimInvitationRewards,
    handleClaimDailyBonus,
    handleRetryClaim,
    handleUpgrade,
  };
}
