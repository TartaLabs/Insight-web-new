import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Zap, RefreshCw, ExternalLink, Loader2 } from 'lucide-react';
import { apiRecords } from '@/services/api';
import { RewardRecord, RewardRecordStatus } from '@/services/model/types';
import { useLocalStore } from '@/store/useLocalStore';

// 过滤类型：UNCLAIMED 未领取(INIT)，CLAIMED 已领取(SUCCESS)
type LedgerFilter = 'ISSUED' | 'CLAIMED';

interface LedgerTabProps {
  onRetryClaim?: (record: RewardRecord) => void;
}

const LEDGER_PAGE_SIZE = 10;

// 过滤器映射到状态
const filterToStatus: Record<LedgerFilter, RewardRecordStatus> = {
  ISSUED: 'INIT',
  CLAIMED: 'SUCCESS',
};

/**
 * 账本记录 Tab 组件
 * 显示已领取和未领取的奖励记录
 */
export const LedgerTab: React.FC<LedgerTabProps> = ({ onRetryClaim }) => {
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>('ISSUED');
  const [ledgerPage, setLedgerPage] = useState(1);
  const [allRecords, setAllRecords] = useState<RewardRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const tokenSymbol = useLocalStore((state) => state.tokenSymbol);
  const symbol = `$${tokenSymbol}`;

  // 根据当前过滤器筛选记录
  const filteredRecords = allRecords.filter(
    (record) => record.status === filterToStatus[ledgerFilter],
  );
  const filteredTotal = filteredRecords.length;
  const ledgerTotalPages = Math.max(1, Math.ceil(filteredTotal / LEDGER_PAGE_SIZE));

  // 当前页的记录
  const paginatedRecords = filteredRecords.slice(
    (ledgerPage - 1) * LEDGER_PAGE_SIZE,
    ledgerPage * LEDGER_PAGE_SIZE,
  );

  // 获取记录数据
  const fetchRecords = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      // 获取所有记录，前端进行状态筛选
      const response = await apiRecords.getRewardRecords(100, 0);

      setAllRecords(response.records ?? []);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // 初始加载数据
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换过滤器时重置页码
  useEffect(() => {
    setLedgerPage(1);
  }, [ledgerFilter]);

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
            onClick={() => setLedgerFilter(filter)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              ledgerFilter === filter
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
        ) : paginatedRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-xs font-mono border border-dashed border-white/10 rounded">
            No records yet.
          </div>
        ) : (
          <>
            {paginatedRecords.map((record) => (
              <div
                key={record.nonce}
                className="flex items-center justify-between p-4 border-l-2 border-white/10 bg-white/5 hover:border-tech-blue transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded ${record.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}
                  >
                    {ledgerFilter === 'CLAIMED' ? <Wallet size={16} /> : <Zap size={16} />}
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
                    +{(record.total_amount / 1e9).toLocaleString()}{' '}
                    <span className="text-tech-blue">
                      {ledgerFilter === 'ISSUED' ? 'Reward' : symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {ledgerFilter === 'ISSUED' && onRetryClaim && (
                      <button
                        onClick={() => onRetryClaim(record)}
                        className="text-[9px] bg-tech-blue/20 text-tech-blue px-2 py-0.5 rounded flex items-center gap-1 hover:bg-tech-blue hover:text-black"
                      >
                        <RefreshCw size={8} /> CLAIM
                      </button>
                    )}
                    {ledgerFilter === 'CLAIMED' && record.tx_hash && (
                      <a
                        href={'#'}
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
