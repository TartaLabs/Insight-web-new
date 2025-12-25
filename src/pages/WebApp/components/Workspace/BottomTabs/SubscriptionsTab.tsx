import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { apiPayment } from '../../../../../services/api';
import { Payment } from '../../../../../services/model/types';

const PAGE_SIZE = 5;

/**
 * 订阅记录 Tab 组件
 */
export const SubscriptionsTab: React.FC = () => {
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchPayments = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const response = await apiPayment.getPaymentList(PAGE_SIZE, offset);
      setPayments(response.payments || []);
      setTotal(response.total || 0);
    } catch (err) {
      setError('Failed to load subscription records.');
      console.error('Failed to fetch payment list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(page);
  }, [page, fetchPayments]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-500';
      case 'PENDING':
        return 'text-yellow-500';
      case 'FAILED':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'SUCCESS';
      default:
        return status;
    }
  };

  const truncateTxHash = (hash: string) => {
    if (!hash) return '';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs text-tech-blue font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
        <CreditCard size={12} /> Subscription History
      </h4>

      {loading && payments.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-xs font-mono">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-xs text-red-500 font-mono py-8 text-center border border-dashed border-red-500/30 rounded">
          {error}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-xs text-gray-600 font-mono py-8 text-center border border-dashed border-white/10 rounded">
          No subscription records yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 text-[10px] text-gray-500 uppercase tracking-wider pb-2 border-b border-white/10 px-2">
            <div className="col-span-3">Time</div>
            <div className="col-span-3">Plan</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-center">Chain</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="grid grid-cols-12 items-center text-xs px-2 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="col-span-3 font-mono text-gray-400">
                {formatDate(payment.purchase_time)}
              </div>
              <div className="col-span-3 text-white font-bold truncate" title={payment.product_id}>
                {payment.type}
              </div>
              <div className="col-span-2 text-right font-mono text-white">
                {payment.amount.toFixed(2)} {payment.currency}
              </div>
              <div
                className="col-span-2 text-center text-gray-400 truncate"
                title={payment.provider}
              >
                {payment.provider}
              </div>
              <div className="col-span-2 text-right">
                <span className={`font-bold ${getStatusColor(payment.status)}`}>
                  {getDisplayStatus(payment.status)}
                </span>
                {payment.transaction_id && (
                  <div className="text-[9px] text-gray-500 truncate" title={payment.transaction_id}>
                    Tx: {truncateTxHash(payment.transaction_id)}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${page === 1 || loading ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
            >
              Prev
            </button>
            <div className="text-[11px] text-gray-400">
              Page <span className="text-white">{page}</span> /{' '}
              <span className="text-white">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${page >= totalPages || loading ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
