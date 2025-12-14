import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Wallet, X } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { apiUser } from '@/services/api.ts';
import { Logo } from '@/components/Logo.tsx';
import { PrivacyPolicyContent } from '../../Privacy';
import { TermsOfUseContent } from '../../Terms';
import { User } from '@/services/model/types.ts';
import toast from 'react-hot-toast';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const [step, setStep] = useState<1 | 2>(1); // 1: Wallet Connect, 2: Onboarding
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const nickPattern = /^[A-Za-z0-9]{1,15}$/;
  const isNickValid = nickPattern.test(nickname.trim());

  const [legalView, setLegalView] = useState<null | 'privacy' | 'terms'>(null);

  // Handle wallet connection via RainbowKit
  useEffect(() => {
    if (isConnected && address) {
      // 连接成功后执行签名
      handleSignMessage(address).catch(console.error);
    }
  }, [isConnected, address]);

  // 签名并调用登录接口
  const handleSignMessage = async (walletAddress: string) => {
    try {
      setIsSigning(true);

      // 签名消息
      const message = 'Sign in Insight Web';
      const signature = await signMessageAsync({
        account: walletAddress as `0x${string}`,
        message,
      });

      // 调用登录接口
      const userLoginRes = await apiUser.login(address, signature, message);
      localStorage.setItem('auth_token', userLoginRes.session);
      if (userLoginRes.is_new) {
        // 新用户登录后, 弹出编辑资料弹框
        setStep(2);
      } else {
        console.log('Login success:', userLoginRes);
        onLoginSuccess(userLoginRes.user);
      }
    } catch (error) {
      console.error('Sign message or login failed:', error);
      disconnect();
    } finally {
      setIsSigning(false);
    }
  };

  const handleConnectMetaMask = () => {
    // 尝试直接连接 MetaMask (injected connector)
    const metaMaskConnector = connectors.find((c) => c.id === 'injected' || c.name === 'MetaMask');
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    } else if (openConnectModal) {
      // 如果找不到 MetaMask connector，则打开通用连接弹窗
      openConnectModal();
    }
  };

  const handleConnect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const verifyInviteCode = async (code: string) => {
    try {
      const res = await apiUser.verifyRefCode(code);
      if (!res) {
        throw new Error('Failed to verify invite code');
      }
      toast.success('Invite code verified');
      return res;
    } catch (error) {
      console.log(error);
      toast.error('Failed to verify invite code');
      return false;
    }
  };

  const handleEnterApp = async () => {
    const nick = nickname.trim();
    if (!nick) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }
    if (!nickPattern.test(nick)) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }

    setNicknameError('');
    if (!agreed) return;

    try {
      setIsSubmitting(true);

      let verifyResult = false;
      if (inviteInput.trim()) {
        verifyResult = await verifyInviteCode(inviteInput.trim());
      }

      const finalInvite = verifyResult ? inviteInput.trim() : undefined;
      // 调用 API 更新用户信息（nickname 和 referral code）
      const updatedUser = await apiUser.updateUserData(nick, finalInvite || undefined);

      // 保存到 localStorage
      if (address) {
        localStorage.setItem(
          `insight_profile_${address}`,
          JSON.stringify({
            nickname: nick,
            inviteCode: finalInvite,
          }),
        );
      }

      // 使用服务端返回的完整 User 对象
      onLoginSuccess(updatedUser);
    } catch (error) {
      console.error('Failed to update user data:', error);
      setNicknameError('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050509] relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tech-blue/5 rounded-full blur-[100px]" />

      <motion.div
        className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-xs font-mono text-gray-500 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
        )}
        <div className="flex justify-center mb-8">
          <Logo className="w-12 h-12" />
        </div>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Connect Wallet</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">
              Select your provider to access Insight Web.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleConnectMetaMask}
                disabled={isPending || isSigning}
                className="w-full bg-white/5 border border-white/10 hover:border-tech-blue/50 p-4 rounded-lg flex items-center justify-between group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Wallet size={16} className="text-orange-500" />
                  </div>
                  <span className="font-bold">{isSigning ? 'Signing...' : 'MetaMask'}</span>
                </div>
                {isPending || isSigning ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-tech-blue group-hover:translate-x-1 transition-all"
                  />
                )}
              </button>

              <button
                onClick={handleConnect}
                disabled={isSigning}
                className="w-full bg-white/5 border border-white/10 hover:border-tech-blue/50 p-4 rounded-lg flex items-center justify-between group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-tech-blue/20 flex items-center justify-center">
                    <Wallet size={16} className="text-tech-blue" />
                  </div>
                  <span className="font-bold">Other Wallets</span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-500 group-hover:text-tech-blue group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Welcome, Contributor</h2>
            <p className="text-gray-400 text-center mb-8 text-sm font-mono text-tech-blue bg-tech-blue/5 py-1 rounded">
              {address}
            </p>

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
                    }}
                    maxLength={15}
                    placeholder="Enter a display name"
                    className={`w-full bg-black/50 border border-white/10 focus:border-tech-blue rounded px-4 py-3 pr-14 focus:outline-none transition-colors`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
                    {nickname.length}/15
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Use 1-15 letters or numbers. Must be unique.
                </div>
                {nicknameError && (
                  <div className="text-[11px] text-red-400 mt-1">{nicknameError}</div>
                )}
              </div>

              <div
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => setAgreed(!agreed)}
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreed ? 'bg-tech-blue border-tech-blue' : 'border-gray-600 group-hover:border-gray-400'}`}
                >
                  {agreed && <Check size={12} className="text-black" />}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLegalView('privacy');
                    }}
                    className="text-white hover:underline"
                  >
                    Privacy Policy
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLegalView('terms');
                    }}
                    className="text-white hover:underline"
                  >
                    Terms of Use
                  </button>
                  . I understand my data will be used for AI training.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Invitation Code
                </label>
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => {
                    setInviteInput(e.target.value);
                    setInviteError('');
                  }}
                  placeholder="Enter invite code (optional)"
                  className={`w-full bg-black/50 border border-white/10 focus:border-tech-blue rounded px-4 py-3 text-sm transition-colors`}
                />
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                  <span>Optional</span>
                  {inviteError && <span className="text-red-400">{inviteError}</span>}
                </div>
              </div>

              <button
                onClick={handleEnterApp}
                disabled={!isNickValid || !agreed || isSubmitting}
                className={`w-full py-4 rounded font-bold tracking-wide transition-all ${
                  !isNickValid || !agreed || isSubmitting
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
                  'ENTER INSIGHT'
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {legalView && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl bg-[#0b0b10] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Legal Notice
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    {legalView === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
                  </h3>
                </div>
                <button
                  onClick={() => setLegalView(null)}
                  className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-6">
                {legalView === 'privacy' ? <PrivacyPolicyContent /> : <TermsOfUseContent />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
