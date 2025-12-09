import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Users } from 'lucide-react';

export const Stats: React.FC = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto px-6 lg:px-8 xl:px-10 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-tech-blue/10 border border-tech-blue/30 px-4 py-2 flex items-center gap-2 rounded">
              <Trophy size={16} className="text-tech-blue" />
              <span className="text-tech-blue font-bold text-xs tracking-widest">LEADERBOARD</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-red-500" />
              <span className="text-gray-400">Longest Streak: <span className="text-white">142 Days</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-tech-blue" />
              <span className="text-gray-400">Referral Commission: <span className="text-white">5%</span></span>
            </div>
          </div>
        </div>
        <div className="relative flex overflow-hidden items-center py-4">
          <motion.div 
             className="flex gap-12 whitespace-nowrap"
             animate={{ x: [0, -1000] }}
             transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
             {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-8 text-xs font-mono text-gray-400">
                   <span className="flex items-center gap-2">
                      <span className="text-white font-bold">#{i + 1} User{8492 + i}</span>
                      <span className="text-tech-blue">{(54320 - i * 1234).toLocaleString()} $EMO</span>
                   </span>
                   <span className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
             ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
