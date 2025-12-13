import React, { useEffect, useMemo, useState } from 'react';
import { Crown } from 'lucide-react';
import { LeaderboardEntry } from '../../../types';
import { useUserStore } from '@/store/userStore';

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
}

const PAGE_SIZE = 10;

/**
 * 排行榜 Tab 组件
 */
export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ leaderboard }) => {
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);

  const computedLeaderboard = useMemo(() => {
    let list = [...leaderboard];
    const hasSelf = list.some(
      (e) =>
        e.nickname.toLowerCase() === (user.nickname || '').toLowerCase() ||
        e.address === user.wallet_address,
    );
    if (!hasSelf && user.token_amount > 0 && user.nickname) {
      list.push({
        rank: list.length + 1,
        nickname: user.nickname,
        address: user.wallet_address || '0xUser',
        totalEarned: user.token_amount,
      });
    }
    list = list
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .map((e, idx) => ({ ...e, rank: idx + 1 }));
    return list;
  }, [leaderboard, user.token_amount, user.nickname, user.wallet_address]);

  const selfEntry = computedLeaderboard.find(
    (e) =>
      e.nickname.toLowerCase() === (user.nickname || '').toLowerCase() ||
      e.address === user.wallet_address,
  );
  const selfRank = selfEntry?.rank ?? '—';
  const otherEntries = computedLeaderboard.slice(3);
  const totalPages = Math.max(1, Math.ceil(otherEntries.length / PAGE_SIZE));

  // Page bounds correction
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-4 pt-8">
      {/* Top 3 Highlight */}
      <div className="grid grid-cols-3 gap-6 mb-8 items-end">
        {[1, 0, 2].map((idx) => {
          const entry = leaderboard[idx];
          if (!entry) return null;
          const isFirst = idx === 0;
          const ringColor = isFirst
            ? 'ring-yellow-400'
            : idx === 1
              ? 'ring-gray-300'
              : 'ring-amber-500/80';
          const glow = isFirst
            ? 'shadow-[0_0_25px_rgba(234,179,8,0.5)]'
            : idx === 1
              ? 'shadow-[0_0_20px_rgba(203,213,225,0.35)]'
              : 'shadow-[0_0_20px_rgba(255,191,71,0.35)]';
          return (
            <div
              key={idx}
              className={`relative flex flex-col items-center ${isFirst ? 'scale-110 z-10' : 'scale-95 opacity-90'}`}
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-black ring-4 ${isFirst ? 'border-yellow-500' : 'border-white/20'} ${ringColor} ${glow}`}
                >
                  <span className="text-xl font-bold text-white">{entry.address.slice(2, 4)}</span>
                </div>
                <div
                  className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold ${isFirst ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white'}`}
                >
                  #{idx + 1}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <Crown
                    className={`${isFirst ? 'text-yellow-400' : idx === 1 ? 'text-gray-200' : 'text-amber-400'} drop-shadow-lg`}
                    size={24}
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-white">{entry.nickname}</div>
                <div className="text-[10px] font-mono text-gray-500">{entry.address}</div>
                <div className="text-sm font-bold text-tech-blue mt-1">
                  {entry.totalEarned.toLocaleString()}{' '}
                  <span className="text-[10px] text-gray-400">$mEMO</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2">
        <div className="flex justify-end mb-3 pr-1">
          <div className="px-4 py-3 rounded border border-white/10 bg-white/5 text-xs font-mono text-gray-300 flex items-center gap-3 shadow-[0_0_12px_rgba(0,243,255,0.08)]">
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-tech-blue/20 text-tech-blue font-bold text-[11px] tracking-wide">
              <span>Your Rank</span>
              <span className="text-white text-sm">#{selfRank}</span>
            </div>
            <div className="text-[10px] text-gray-400">{user.nickname}</div>
            <div className="text-[10px] text-tech-blue">{user.wallet_address}</div>
            <div className="text-white font-bold text-sm">
              {user.token_amount?.toLocaleString()}{' '}
              <span className="text-[10px] text-gray-500">$mEMO</span>
            </div>
          </div>
        </div>
        {otherEntries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((entry) => {
          const isSelf = selfEntry && entry.rank === selfEntry.rank;
          return (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${isSelf ? 'bg-white/5 border border-tech-blue/30 rounded' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center font-bold font-mono text-gray-500">
                  #{entry.rank}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {entry.nickname}
                    {isSelf && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-tech-blue/20 text-tech-blue font-mono">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">{entry.address}</div>
                </div>
              </div>
              <div className="font-mono text-sm text-white font-bold">
                {entry.totalEarned.toLocaleString()}{' '}
                <span className="text-[10px] text-gray-500">$mEMO</span>
              </div>
            </div>
          );
        })}
        <div className="flex justify-center items-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${page === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
          >
            Prev
          </button>
          <div className="text-xs font-mono text-gray-400">
            Page <span className="text-white">{page}</span> /{' '}
            <span className="text-white">{totalPages}</span>
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${page === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
