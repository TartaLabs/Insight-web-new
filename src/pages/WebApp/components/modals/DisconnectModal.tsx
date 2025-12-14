import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../Button';

interface DisconnectModalProps {
  onConfirm: () => void;
}

/**
 * 钱包断连阻塞性弹窗
 * 用户必须点击确定才能继续操作
 */
export const DisconnectModal: React.FC<DisconnectModalProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        className="bg-[#0a0a0f] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="p-8 flex flex-col items-center text-center">
          {/* 图标 */}
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-white mb-3">Wallet Disconnected</h2>

          {/* 描述 */}
          <p className="text-gray-400 text-sm mb-8">
            Your wallet has been disconnected. Please reconnect to continue.
          </p>

          {/* 确认按钮 */}
          <Button onClick={onConfirm} className="w-full py-3 text-base font-semibold">
            OK
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
