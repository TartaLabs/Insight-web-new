import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Zap, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { HistoryFilter } from '../../../types';
import { apiRecords } from '@/services/api';
import { RewardRecord, RecordType } from '@/services/model/types';

interface LedgerTabProps {
  onRetryClaim?: (record: RewardRecord) => void;
}

const LEDGER_PAGE_SIZE = 10;

// 根据 HistoryFilter 映射到 RecordType
const filterToRecordType: Record<HistoryFilter, RecordType> = {
  ISSUED: 'INVITE',
  CLAIMED: 'DAILY',
};

/**
 * 账本记录 Tab 组件
 * 显示发放和领取的交易历史
 */
export const LedgerTab: React.FC<LedgerTabProps> = ({ onRetryClaim }) => {
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ISSUED');
  const [ledgerPage, setLedgerPage] = useState(1);
  const [records, setRecords] = useState<RewardRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const ledgerTotalPages = Math.max(1, Math.ceil(total / LEDGER_PAGE_SIZE));

  // 获取记录数据
  const fetchRecords = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const offset = (ledgerPage - 1) * LEDGER_PAGE_SIZE;
      const recordType = filterToRecordType[historyFilter];

      const response = await apiRecords.getClaimedRecords(recordType, LEDGER_PAGE_SIZE, offset);

      setRecords(response.records ?? []);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setRecords([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [historyFilter, ledgerPage, loading]);

  // 当过滤器或页码变化时获取数据
  useEffect(() => {
    fetchRecords();
  }, []);

  // 切换过滤器时重置页码
  useEffect(() => {
    setLedgerPage(1);
  }, [historyFilter]);

  // Page bounds correction
  useEffect(() => {
    if (ledgerPage > ledgerTotalPages && ledgerTotalPages > 0) {
      setLedgerPage(ledgerTotalPages);
    }
  }, [ledgerPage, ledgerTotalPages]);

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['ISSUED', 'CLAIMED'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setHistoryFilter(filter)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              historyFilter === filter
                ? 'bg-tech-blue text-black border-tech-blue'
                : 'text-gray-500 border-white/10 hover:border-gray-400'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-2 font-mono">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs font-mono border border-dashed border-white/10 rounded flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-xs font-mono border border-dashed border-white/10 rounded">
            No records yet.
          </div>
        ) : (
          <>
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border-l-2 border-white/10 bg-white/5 hover:border-tech-blue transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded ${record.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : record.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}
                  >
                    {historyFilter === 'CLAIMED' ? <Wallet size={16} /> : <Zap size={16} />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{record.task_type}</div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(record.created_at * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white mb-1">
                    +{(record.amount / 1e9).toLocaleString()}{' '}
                    <span className="text-tech-blue">$mEMO</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {historyFilter === 'CLAIMED' && record.status === 'FAILED' && onRetryClaim && (
                      <button
                        onClick={() => onRetryClaim(record)}
                        className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-500 hover:text-white"
                      >
                        <RefreshCw size={8} /> RETRY
                      </button>
                    )}
                    {historyFilter === 'CLAIMED' && record.status === 'SUCCESS' && (
                      <a
                        href="#"
                        className="text-[9px] text-tech-blue flex items-center gap-1 hover:underline"
                      >
                        EXPLORER <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center gap-3 pt-2">
              <button
                onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}
                disabled={ledgerPage === 1 || loading}
                className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === 1 || loading ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
              >
                Prev
              </button>
              <div className="text-[11px] text-gray-400">
                Page <span className="text-white">{ledgerPage}</span> /{' '}
                <span className="text-white">{ledgerTotalPages}</span>
              </div>
              <button
                onClick={() => setLedgerPage((p) => Math.min(ledgerTotalPages, p + 1))}
                disabled={ledgerPage === ledgerTotalPages || loading}
                className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === ledgerTotalPages || loading ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
