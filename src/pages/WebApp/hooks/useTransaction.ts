import { useState, useCallback } from 'react';
import { TransactionModalState } from '../types';

export interface UseTransactionReturn {
  txModal: TransactionModalState;
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

  const closeTransaction = useCallback(() => {
    setTxModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    if (txModal.onSuccessCallback) {
      txModal.onSuccessCallback();
    }
    setTxModal((prev) => ({ ...prev, isOpen: false }));
  }, [txModal.onSuccessCallback]);

  return {
    txModal,
    openTransaction,
    closeTransaction,
    handleTransactionSuccess,
  };
}

