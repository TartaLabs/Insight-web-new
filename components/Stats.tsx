import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Users } from 'lucide-react';

export const Stats: React.FC = () => {
  return (
    <div className="w-full bg-surface border-y border-white/5 overflow-hidden">
      <div className="flex">
         <div className="bg-tech-blue px-6 py-4 flex items-center gap-2 z-10">
            <Trophy size={16} className="text-black" />
            <span className="text-black font-bold text-xs tracking-widest">LEADERBOARD</span>
         </div>
         
         <div className="relative flex-1 overflow-hidden flex items-center">
            <motion.div 
               className="flex gap-12 whitespace-nowrap"
               animate={{ x: [0, -1000] }}
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
               {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-8 text-xs font-mono text-gray-400">
                     <span className="flex items-center gap-2">
                        <span className="text-white font-bold">#{i + 1} User{8492 + i}</span>
                        <span className="text-tech-blue">{(54320 - i * 1234).toLocaleString()} $mEMO</span>
                     </span>
                     <span className="w-1 h-1 bg-white/20 rounded-full" />
                  </div>
               ))}
            </motion.div>
         </div>

         <div className="hidden md:flex bg-deep-bg px-6 py-4 items-center gap-6 border-l border-white/10">
            <div className="flex items-center gap-2 text-xs">
               <Flame size={14} className="text-white" />
               <span className="text-gray-400">Longest Streak: <span className="text-white">142 Days</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
               <Users size={14} className="text-tech-blue" />
               <span className="text-gray-400">Invite Comm: <span className="text-white">5%</span></span>
            </div>
         </div>
      </div>
    </div>
  );
};