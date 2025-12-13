import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Wallet, ArrowRight, Check, X, ArrowLeft } from 'lucide-react';
import { Logo } from '../../../components/Logo';
import { PrivacyPolicyContent } from '../../Privacy';
import { TermsOfUseContent } from '../../Terms';

interface LoginProps {
  onLoginSuccess: (nickname: string) => void;
  onBack?: () => void;
  inviteCode: string;
  inviteLocked: boolean;
  invitedBy?: string;
  existingNicknames: string[];
  onInviteChange: (code: string) => void;
  onValidateInvite: (code: string) => { ok: boolean; message?: string; invitedBy?: string };
  onPersistInvite: (code: string, invitedBy?: string) => { ok: boolean; message?: string };
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onBack,
  inviteCode,
  inviteLocked,
  invitedBy,
  existingNicknames,
  onInviteChange,
  onValidateInvite,
  onPersistInvite,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // 1: Wallet Connect, 2: Onboarding
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [inviteInput, setInviteInput] = useState(inviteCode || '');
  const [inviteError, setInviteError] = useState('');
  const [inviteOwner, setInviteOwner] = useState(invitedBy || '');
  const [nicknameError, setNicknameError] = useState('');
  const [profileLocked, setProfileLocked] = useState(false);
  const nickPattern = /^[A-Za-z0-9]{1,15}$/;
  const isNickValid = nickPattern.test(nickname.trim());

  // Sync invite input with prop changes
  const prevInviteCode = React.useRef(inviteCode);
  const prevInvitedBy = React.useRef(invitedBy);
  useEffect(() => {
    if (prevInviteCode.current !== inviteCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInviteInput(inviteCode || '');
      prevInviteCode.current = inviteCode;
    }
    if (prevInvitedBy.current !== invitedBy) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInviteOwner(invitedBy || '');
      prevInvitedBy.current = invitedBy;
    }
  }, [inviteCode, invitedBy]);
  const [legalView, setLegalView] = useState<null | 'privacy' | 'terms'>(null);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setWalletAddress('0x71C...9A23');
      setIsConnecting(false);
      setStep(2);

      // Load existing profile for this wallet
      const stored = localStorage.getItem(`insight_profile_0x71C...9A23`);
      if (stored) {
        try {
          const data = JSON.parse(stored) as {
            nickname?: string;
            inviteCode?: string;
            invitedBy?: string;
          };
          if (data.nickname) {
            setNickname(data.nickname);
            setProfileLocked(true);
            setNicknameError('');
          }
          if (data.inviteCode) {
            setInviteInput(data.inviteCode);
            setInviteOwner(data.invitedBy || 'Community Member');
            setInviteError('');
            onInviteChange(data.inviteCode);
            onPersistInvite(data.inviteCode, data.invitedBy);
          }
        } catch {
          // ignore parse errors
        }
      }
    }, 1500);
  };

  const handleEnterApp = () => {
    const nick = nickname.trim();
    if (!nick) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }
    if (!profileLocked && !nickPattern.test(nick)) {
      setNicknameError('Use 1-15 characters. Letters and numbers only. Must be unique.');
      return;
    }
    if (!profileLocked) {
      const exists = existingNicknames.some((n) => n.toLowerCase() === nick.toLowerCase());
      if (exists) {
        setNicknameError('Nickname already taken. Choose another.');
        return;
      }
    }
    setNicknameError('');
    if (!agreed) return;

    if (inviteInput.trim() && !inviteLocked) {
      const result = onValidateInvite(inviteInput.trim());
      if (!result.ok) {
        setInviteError(result.message || 'Invite code is invalid');
        return;
      }
      setInviteOwner(result.invitedBy || '');
      setInviteError('');
      const persistRes = onPersistInvite(inviteInput.trim(), result.invitedBy);
      if (!persistRes.ok) {
        setInviteError(persistRes.message || 'Invite code is invalid');
        return;
      }
    }
    const finalInvite = inviteLocked || inviteInput.trim() ? inviteInput.trim() : '';
    if (walletAddress) {
      localStorage.setItem(
        `insight_profile_${walletAddress}`,
        JSON.stringify({
          nickname: nick,
          inviteCode: finalInvite,
          invitedBy: inviteOwner || '',
        }),
      );
    }
    onLoginSuccess(nick);
  };

  const effectiveNickValid = profileLocked ? !!nickname.trim() : isNickValid;

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
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-white/5 border border-white/10 hover:border-tech-blue/50 p-4 rounded-lg flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Wallet size={16} className="text-orange-500" />
                  </div>
                  <span className="font-bold">MetaMask</span>
                </div>
                {isConnecting ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-tech-blue group-hover:translate-x-1 transition-all"
                  />
                )}
              </button>

              <button
                disabled
                className="w-full bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-blue-500" />
                  </div>
                  <span className="font-bold">OKX Wallet</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Welcome, Contributor</h2>
            <p className="text-gray-400 text-center mb-8 text-sm font-mono text-tech-blue bg-tech-blue/5 py-1 rounded">
              {walletAddress}
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
                      if (profileLocked) return;
                      setNickname(e.target.value);
                    }}
                    maxLength={15}
                    placeholder="Enter a display name"
                    disabled={profileLocked}
                    className={`w-full bg-black/50 border ${profileLocked ? 'border-white/10 text-gray-500' : 'border-white/10 focus:border-tech-blue'} rounded px-4 py-3 pr-14 focus:outline-none transition-colors`}
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
                    if (inviteLocked) return;
                    setInviteInput(e.target.value);
                    onInviteChange(e.target.value);
                    setInviteError('');
                  }}
                  placeholder="Enter invite code (optional)"
                  disabled={inviteLocked}
                  className={`w-full bg-black/50 border ${inviteLocked ? 'border-white/10 text-gray-500' : 'border-white/10 focus:border-tech-blue'} rounded px-4 py-3 text-sm transition-colors`}
                />
                <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                  <span>
                    {inviteLocked ? 'Invite code locked for this session' : 'Optional'}
                    {inviteOwner && ` · Invited by ${inviteOwner}`}
                  </span>
                  {inviteError && <span className="text-red-400">{inviteError}</span>}
                </div>
              </div>

              <button
                onClick={handleEnterApp}
                disabled={!effectiveNickValid || !agreed}
                className={`w-full py-4 rounded font-bold tracking-wide transition-all ${
                  !effectiveNickValid || !agreed
                    ? 'bg-white/10 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-tech-blue text-white hover:shadow-lg hover:shadow-blue-500/20'
                }`}
              >
                ENTER INSIGHT
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
