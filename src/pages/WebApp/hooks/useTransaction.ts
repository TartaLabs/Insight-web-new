import { useCallback, useState } from 'react';
import { TransactionModalState } from '../types';
import { Pro } from '@/services/model/types.ts';
import { queryClient } from '@/wallet/query.ts';
import { useUserStore } from '@/store/userStore.ts';
import { useProStore } from '@/store/proStore.ts';
import { useLocalStore } from '@/store/useLocalStore';

export interface UseTransactionReturn {
  txModal: TransactionModalState;
  handleClaimUSDT: (amount: number) => void;
  handleClaimAll: () => void;
  handleClaimInvitationRewards: () => void;
  handleClaimDailyBonus: () => void;
  handleRetryClaim: (taskNonce: number | undefined) => void;
  handleUpgrade: (proVersion: Pro) => void;
  openTransaction: (
    type: 'CLAIM_USDT' | 'CLAIM_PRO_DAILY' | 'CLAIM_TASK' | 'CLAIM_INVITE' | 'UPGRADE' | 'APPROVE',
    title: string,
    amount: string | undefined,
    symbol: string | undefined,
    proVersion: number | undefined,
    cost: string | undefined,
    taskNonce: number | undefined,
    onSuccess: () => void,
  ) => void;
  closeTransaction: () => void;
  handleTransactionSuccess: () => void;
}

export function useTransaction(): UseTransactionReturn {
  const [txModal, setTxModal] = useState<TransactionModalState>({
    isOpen: false,
    type: 'APPROVE',
    title: '',
  });

  const { fetchUserData } = useUserStore();
  const { fetchProVersion } = useProStore();
  const tokenSymbol = useLocalStore((state) => state.tokenSymbol);
  const symbol = `$${tokenSymbol}`;

  const openTransaction = useCallback(
    (
      type:
        | 'CLAIM_USDT'
        | 'CLAIM_PRO_DAILY'
        | 'CLAIM_TASK'
        | 'CLAIM_INVITE'
        | 'UPGRADE'
        | 'APPROVE',
      title: string,
      amount: string | undefined,
      symbol: string | undefined,
      proVersion: number | undefined,
      cost: string | undefined,
      taskNonce: number | undefined,
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
        taskNonce,
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
        undefined,
        () => {
          queryClient.invalidateQueries({ queryKey: ['balance'] }).catch(console.error);
        },
      );
    },
    [openTransaction],
  );

  // 领取全部任务奖励
  const handleClaimAll = useCallback(() => {
    openTransaction(
      'CLAIM_TASK',
      'Claim All Tasks',
      undefined,
      symbol,
      undefined,
      undefined,
      undefined,
      () => {
        queryClient
          .invalidateQueries({ queryKey: ['claimable-amount', 'DAILY'] })
          .catch(console.error);
        fetchUserData().catch(console.error);
      },
    );
  }, [fetchUserData, openTransaction, symbol]);

  // 领取邀请奖励
  const handleClaimInvitationRewards = useCallback(() => {
    openTransaction(
      'CLAIM_INVITE',
      'Claim Invitation Rewards',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      () => {
        queryClient
          .invalidateQueries({ queryKey: ['claimable-amount', 'INVITE'] })
          .catch(console.error);
        fetchUserData().catch(console.error);
      },
    );
  }, [fetchUserData, openTransaction]);

  // 领取每日奖励
  const handleClaimDailyBonus = useCallback(() => {
    openTransaction(
      'CLAIM_PRO_DAILY',
      'Claim Daily Bonus',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      () => {
        queryClient
          .invalidateQueries({ queryKey: ['claimable-amount', 'PRO'] })
          .catch(console.error);
        fetchUserData().catch(console.error);
      },
    );
  }, [fetchUserData, openTransaction]);

  // 领取记录，领取失败，二次领取
  const handleRetryClaim = useCallback(
    (taskNonce: number | undefined) => {
      openTransaction(
        'CLAIM_TASK',
        'Retry Claim',
        undefined,
        undefined,
        undefined,
        undefined,
        taskNonce,
        () => {},
      );
    },
    [openTransaction],
  );

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
        undefined,
        () => {
          fetchUserData()
            .then(() => fetchProVersion())
            .catch(console.error);
        },
      );
    },
    [fetchProVersion, fetchUserData, openTransaction],
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
