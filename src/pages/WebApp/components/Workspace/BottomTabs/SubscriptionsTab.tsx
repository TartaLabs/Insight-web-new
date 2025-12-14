import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { SubscriptionRecord } from '../../../types';

const PAGE_SIZE = 5;

/**
 * 订阅记录 Tab 组件
 */
export const SubscriptionsTab: React.FC = () => {
  const [subPage, setSubPage] = useState(1);
  const [subscriptions] = useState<SubscriptionRecord[]>([]); // TODO 缺接口
  const totalPages = Math.max(1, Math.ceil(subscriptions.length / PAGE_SIZE));

  return (
    <div className="space-y-3">
      <h4 className="text-xs text-tech-blue font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
        <CreditCard size={12} /> Subscription History
      </h4>
      {subscriptions.length === 0 ? (
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
          {subscriptions.slice((subPage - 1) * PAGE_SIZE, subPage * PAGE_SIZE).map((sub) => (
            <div
              key={sub.id}
              className="grid grid-cols-12 items-center text-xs px-2 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="col-span-3 font-mono text-gray-400">
                {new Date(sub.createdAt).toLocaleString()}
              </div>
              <div className="col-span-3 text-white font-bold truncate">{sub.planName}</div>
              <div className="col-span-2 text-right font-mono text-white">
                {sub.amountUSDT.toFixed(2)} USDT
              </div>
              <div className="col-span-2 text-center text-gray-400">{sub.chain}</div>
              <div className="col-span-2 text-right">
                {sub.status === 'SUCCESS' && (
                  <span className="text-green-500 font-bold">SUCCESS</span>
                )}
                {sub.status === 'PENDING' && (
                  <span className="text-yellow-500 font-bold">PENDING</span>
                )}
                {sub.status === 'FAILED' && <span className="text-red-500 font-bold">FAILED</span>}
                {sub.txHash && (
                  <div className="text-[9px] text-gray-500 truncate">Tx: {sub.txHash}</div>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center gap-3 pt-2">
            <button
              onClick={() => setSubPage((p) => Math.max(1, p - 1))}
              disabled={subPage === 1}
              className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${subPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
            >
              Prev
            </button>
            <div className="text-[11px] text-gray-400">
              Page <span className="text-white">{subPage}</span> /{' '}
              <span className="text-white">{totalPages}</span>
            </div>
            <button
              onClick={() => setSubPage((p) => Math.min(totalPages, p + 1))}
              disabled={subPage >= totalPages}
              className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${subPage >= totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
