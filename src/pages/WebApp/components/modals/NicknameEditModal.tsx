import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GameButton } from '../ui';
import { apiUser } from '@/services/api';
import { useUserStore } from '@/store/userStore';

interface NicknameEditModalProps {
  currentNickname: string;
  onClose: () => void;
}

// 昵称校验正则：1-15个字母或数字
const nickPattern = /^[A-Za-z0-9]{1,15}$/;

/**
 * 昵称编辑弹窗组件
 */
export const NicknameEditModal: React.FC<NicknameEditModalProps> = ({
  currentNickname,
  onClose,
}) => {
  const { user, setUser } = useUserStore((state) => state);
  const [nicknameInput, setNicknameInput] = useState(currentNickname);
  const [nicknameError, setNicknameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSave = async () => {
    const nick = nicknameInput.trim();

    // 前端校验
    if (!nick) {
      setNicknameError('Nickname is required.');
      return;
    }
    if (!nickPattern.test(nick)) {
      setNicknameError('Use 1-15 letters or numbers only. No special characters.');
      return;
    }

    // 服务端校验
    try {
      setIsChecking(true);
      const exists = await apiUser.checkNickname(nick);
      if (exists) {
        setNicknameError('Nickname already exists.');
        setIsChecking(false);
        return;
      }
    } catch (error) {
      setNicknameError((error as Error).message || 'Nickname is not available.');
      setIsChecking(false);
      return;
    }

    // 校验通过，保存昵称
    try {
      const newUser = await apiUser.updateUserData(nick);
      setUser({ ...user, ...newUser });
      onClose();
    } catch (error) {
      setNicknameError((error as Error).message || 'Nickname invalid');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-white"
          aria-label="Close nickname modal"
        >
          <X size={16} />
        </button>
        <h3 className="text-lg font-bold mb-3">Edit Nickname</h3>
        <p className="text-xs text-gray-500 mb-3">Use 1-15 letters or numbers. Must be unique.</p>
        <input
          value={nicknameInput}
          onChange={(e) => {
            setNicknameInput(e.target.value);
            setNicknameError('');
          }}
          maxLength={15}
          className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-tech-blue outline-none"
          placeholder="Enter nickname"
        />
        {nicknameError && <div className="text-xs text-red-500 mt-2">{nicknameError}</div>}
        <div className="flex justify-end gap-3 mt-4">
          <GameButton variant="ghost" onClick={onClose} className="px-4 py-2 text-[11px]">
            Cancel
          </GameButton>
          <GameButton onClick={handleSave} disabled={isChecking} className="px-4 py-2 text-[11px]">
            {isChecking ? 'Checking...' : 'Save'}
          </GameButton>
        </div>
      </div>
    </div>
  );
};
