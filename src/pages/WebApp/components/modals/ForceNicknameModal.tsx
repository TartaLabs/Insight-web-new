import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiUser } from '@/services/api';
import { useUserStore } from '@/store/userStore';

interface ForceNicknameModalProps {
  walletAddress?: string;
  onSuccess: () => void;
}

// 昵称校验正则：1-15个字母或数字
const nickPattern = /^[A-Za-z0-9]{1,15}$/;

/**
 * 强制昵称设置弹窗组件
 * 用于检测到用户昵称为默认值（地址缩写）时强制设置昵称，不可关闭
 */
export const ForceNicknameModal: React.FC<ForceNicknameModalProps> = ({
  walletAddress,
  onSuccess,
}) => {
  const { user, setUser } = useUserStore((state) => state);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNickValid = nickPattern.test(nickname.trim());

  const handleSubmit = async () => {
    const nick = nickname.trim();

    // 前端校验
    if (!nick) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }
    if (!nickPattern.test(nick)) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }

    setNicknameError('');

    try {
      setIsSubmitting(true);

      // 服务端校验昵称
      const exists = await apiUser.checkNickname(nick);
      if (exists) {
        setNicknameError('Nickname already exists.');
        setIsSubmitting(false);
        return;
      }

      // 更新昵称
      const updatedUser = await apiUser.updateUserData(nick);
      setUser({ ...user, ...updatedUser });
      onSuccess();
    } catch (error) {
      setNicknameError((error as Error).message || 'Failed to save nickname. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 relative shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Set Your Nickname</h2>
        <p className="text-gray-400 text-center mb-2 text-sm">
          Please set a unique nickname to continue.
        </p>
        {walletAddress && (
          <p className="text-gray-400 text-center mb-8 text-sm font-mono text-tech-blue bg-tech-blue/5 py-1 rounded">
            {walletAddress}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Nickname
            </label>
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameError('');
                }}
                maxLength={15}
                placeholder="Enter a display name"
                className="w-full bg-black/50 border border-white/10 focus:border-tech-blue rounded px-4 py-3 pr-14 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
                {nickname.length}/15
              </span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Use 1-15 letters or numbers. Must be unique.
            </div>
            {nicknameError && <div className="text-[11px] text-red-400 mt-1">{nicknameError}</div>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isNickValid || isSubmitting}
            className={`w-full py-4 rounded font-bold tracking-wide transition-all ${
              !isNickValid || isSubmitting
                ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-tech-blue text-white hover:shadow-lg hover:shadow-blue-500/20'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'CONTINUE'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
