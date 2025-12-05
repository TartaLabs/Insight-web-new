import React from 'react';
import { motion } from 'framer-motion';

interface CodeSnippetProps {
  code: string;
  label?: string;
  color?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, label = 'INSIGHT_KERNEL', color = 'text-neon-blue' }) => {
  return (
    <div className="font-mono text-xs md:text-sm bg-surface/80 border border-white/10 rounded-lg p-4 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-${color.replace('text-', '')} to-transparent opacity-50`} />
      
      <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
        <span className="text-gray-500">{label}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>

      <pre className={`whitespace-pre-wrap ${color} leading-relaxed opacity-90`}>
        {code}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 ml-1 bg-current align-middle"
        />
      </pre>
      
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-white border border-white/20 px-2 py-1 rounded">
          Copy
        </button>
      </div>
    </div>
  );
};