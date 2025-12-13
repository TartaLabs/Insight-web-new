import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, Zap, RefreshCw, ExternalLink } from 'lucide-react';
import { Transaction, HistoryFilter } from '../../../types';

interface LedgerTabProps {
  history: Transaction[];
  onRetryClaim: (tx: Transaction) => void;
}

const LEDGER_PAGE_SIZE = 10;

/**
 * 账本记录 Tab 组件
 * 显示发放和领取的交易历史
 */
export const LedgerTab: React.FC<LedgerTabProps> = ({
  history,
  onRetryClaim,
}) => {
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ISSUED');
  const [ledgerPage, setLedgerPage] = useState(1);

  const issuedTxs = useMemo(
    () => history.filter((tx) => tx.category === 'ISSUANCE'),
    [history],
  );
  const claimedTxs = useMemo(
    () => history.filter((tx) => tx.category === 'CLAIM'),
    [history],
  );
  const filteredLedger = historyFilter === 'ISSUED' ? issuedTxs : claimedTxs;
  const ledgerTotalPages = Math.max(
    1,
    Math.ceil(filteredLedger.length / LEDGER_PAGE_SIZE),
  );

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
        {filteredLedger.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-xs font-mono border border-dashed border-white/10 rounded">
            No records yet.
          </div>
        ) : (
          <>
            {filteredLedger
              .slice(
                (ledgerPage - 1) * LEDGER_PAGE_SIZE,
                ledgerPage * LEDGER_PAGE_SIZE,
              )
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 border-l-2 border-white/10 bg-white/5 hover:border-tech-blue transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {tx.category === 'CLAIM' ? (
                        <Wallet size={16} />
                      ) : (
                        <Zap size={16} />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">
                        {tx.source || tx.desc}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white mb-1">
                      +{tx.amount}{' '}
                      <span className="text-tech-blue">$mEMO</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {tx.cost && (
                        <span className="text-[9px] text-gray-500">
                          GAS: {tx.cost}
                        </span>
                      )}
                      {historyFilter === 'CLAIMED' &&
                        tx.status === 'FAILED' && (
                          <button
                            onClick={() => onRetryClaim(tx)}
                            className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-500 hover:text-white"
                          >
                            <RefreshCw size={8} /> RETRY
                          </button>
                        )}
                      {historyFilter === 'CLAIMED' &&
                        tx.status === 'SUCCESS' && (
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
                disabled={ledgerPage === 1}
                className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
              >
                Prev
              </button>
              <div className="text-[11px] text-gray-400">
                Page <span className="text-white">{ledgerPage}</span> /{' '}
                <span className="text-white">{ledgerTotalPages}</span>
              </div>
              <button
                onClick={() =>
                  setLedgerPage((p) => Math.min(ledgerTotalPages, p + 1))
                }
                disabled={ledgerPage === ledgerTotalPages}
                className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === ledgerTotalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
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

