import { useState, useCallback } from 'react';
import { TransactionModalState } from '../types';
import { Pro } from '@/services/model/types.ts';

export interface UseTransactionReturn {
  txModal: TransactionModalState;
  handleClaimUSDT: (amount: number) => void;
  handleClaimAll: () => void;
  handleClaimInvitationRewards: () => void;
  handleClaimDailyBonus: () => void;
  handleRetryClaim: () => void;
  handleUpgrade: (proVersion: Pro) => void;
  openTransaction: (
    type: 'CLAIM_USDT' | 'CLAIM' | 'UPGRADE' | 'APPROVE',
    title: string,
    amount: string | undefined,
    symbol: string | undefined,
    proVersion: number | undefined,
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
      type: 'CLAIM_USDT' | 'CLAIM' | 'UPGRADE' | 'APPROVE',
      title: string,
      amount: string | undefined,
      symbol: string | undefined,
      proVersion: number | undefined,
      cost: string | undefined,
      onSuccess: () => void,
    ) => {
      setTxModal({
        isOpen: true,
        type,
        title,
        amount,
        symbol,
        proVersion,
        cost,
        onSuccessCallback: onSuccess,
      });
    },
    [],
  );

  // 领取 USDT
  const handleClaimUSDT = useCallback(
    (amount: number) => {
      openTransaction(
        'CLAIM_USDT',
        'Claim tUSDT',
        amount.toString(),
        'tUSDT',
        undefined,
        undefined,
        () => {},
      );
    },
    [openTransaction],
  );

  // 领取全部任务奖励
  const handleClaimAll = useCallback(() => {
    openTransaction('CLAIM', 'Claim All Tasks', undefined, '$mEMO', undefined, undefined, () => {});
  }, [openTransaction]);

  // 领取邀请奖励
  const handleClaimInvitationRewards = useCallback(() => {
    openTransaction(
      'CLAIM',
      'Claim Invitation Rewards',
      undefined,
      undefined,
      undefined,
      undefined,
      () => {},
    );
  }, [openTransaction]);

  // 领取每日奖励
  const handleClaimDailyBonus = useCallback(() => {
    openTransaction(
      'CLAIM',
      'Claim Daily Bonus',
      undefined,
      undefined,
      undefined,
      undefined,
      () => {},
    );
  }, [openTransaction]);

  // 领取记录，领取失败，二次领取
  const handleRetryClaim = useCallback(() => {
    openTransaction('CLAIM', 'Retry Claim', undefined, undefined, undefined, undefined, () => {});
  }, [openTransaction]);

  function getProVersionValue(proVersion: string) {
    switch (proVersion) {
      case 'PRO_MONTH':
        return 0;
      case 'PRO_QUARTER':
        return 1;
      case 'PRO_YEAR':
        return 2;
      default:
        return 0;
    }
  }

  // 购买升级Pro
  const handleUpgrade = useCallback(
    (_proVersion: Pro) => {
      openTransaction(
        'UPGRADE',
        'Upgrade to ' + _proVersion.display_name,
        undefined,
        'tUSDT',
        getProVersionValue(_proVersion.pro_version),
        _proVersion.benefits.price.toString(),
        () => {},
      );
    },
    [openTransaction],
  );

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
    handleClaimUSDT,
    handleClaimAll,
    handleClaimInvitationRewards,
    handleClaimDailyBonus,
    handleRetryClaim,
    handleUpgrade,
  };
}
