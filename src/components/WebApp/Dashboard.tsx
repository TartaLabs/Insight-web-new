import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  TaskCounts,
  EmotionType,
  LeaderboardEntry,
  Transaction,
  TaskRecord,
  Invitee,
  SubscriptionRecord,
} from '../../types';
import {
  Crown,
  Clock,
  Share2,
  Zap,
  Coins,
  Copy,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Timer,
  Wallet,
  ExternalLink,
  RefreshCw,
  Users,
  Calendar,
  Shield,
  Activity,
  X,
  CreditCard,
  Flame,
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  tasks: TaskRecord[];
  taskCounts: TaskCounts;
  dailyLimit: number;
  rewardPerTask: number;
  history: Transaction[];
  leaderboard: LeaderboardEntry[];
  invitees: Invitee[];
  ownInviteCode: string;
  inviteLink: string;
  subscriptions: SubscriptionRecord[];
  inviteCodeInfo: { code: string; invitedBy: string; locked: boolean; persisted: boolean };
  onRenameNickname: (nickname: string) => { ok: boolean; message?: string };
  onStartTask: (emotion: EmotionType) => void;
  onResumeTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
  onUpgradeClick: () => void;
  onClaimAll: () => void;
  onClaimBonus: () => void;
  onRetryClaim: (tx: Transaction) => void;
  onClaimInvitationRewards: () => void;
  onApplyInviteCode: (code: string) => { ok: boolean; message?: string; invitedBy?: string };
}

const emotions: EmotionType[] = ['Happy', 'Anger', 'Sad', 'Fear', 'Disgust', 'Surprise', 'Neutral'];

// Reusable GameFi Components
const HudPanel = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative bg-[#0a0a0f]/90 border border-tech-blue/20 ${className} overflow-hidden group`}
  >
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-tech-blue" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-tech-blue" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-tech-blue" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-tech-blue" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

interface GameButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'accent' | 'ghost' | 'default';
}

const GameButton = ({
  onClick,
  disabled,
  children,
  className = '',
  variant = 'primary',
}: GameButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative px-6 py-2 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200
      clip-path-polygon-[10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px]
      ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
      ${
        variant === 'primary'
          ? 'bg-tech-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]'
          : variant === 'accent'
            ? 'bg-neon-purple text-white hover:shadow-[0_0_15px_rgba(188,19,254,0.6)]'
            : variant === 'ghost'
              ? 'bg-transparent border border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
      }
      ${className}
    `}
    style={{
      clipPath:
        'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
    }}
  >
    {children}
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  tasks,
  taskCounts,
  dailyLimit,
  history,
  leaderboard,
  invitees,
  ownInviteCode,
  inviteLink,
  subscriptions,
  inviteCodeInfo,
  onRenameNickname,
  onStartTask,
  onResumeTask,
  onDeleteTask,
  onUpgradeClick,
  onClaimAll,
  onClaimBonus,
  onRetryClaim,
  onClaimInvitationRewards,
  onApplyInviteCode,
}) => {
  const formatAddress = (addr: string) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '');
  const [activeTab, setActiveTab] = useState<
    'contributions' | 'memo_history' | 'leaderboard' | 'invitation' | 'subscriptions'
  >('contributions');
  const [historyFilter, setHistoryFilter] = useState<'ISSUED' | 'CLAIMED'>('ISSUED');
  const [inviteInput, setInviteInput] = useState(inviteCodeInfo.code || '');
  const [inviteMessage, setInviteMessage] = useState('');
  const [toast, setToast] = useState('');
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user.nickname);
  const [nicknameError, setNicknameError] = useState('');

  // Sync invite input with prop changes
  const prevInviteCode = React.useRef(inviteCodeInfo.code);
  useEffect(() => {
    if (prevInviteCode.current !== inviteCodeInfo.code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInviteInput(inviteCodeInfo.code || '');
      prevInviteCode.current = inviteCodeInfo.code;
    }
  }, [inviteCodeInfo.code]);

  // Sync nickname input with prop changes
  const prevNickname = React.useRef(user.nickname);
  useEffect(() => {
    if (prevNickname.current !== user.nickname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNicknameInput(user.nickname);
      prevNickname.current = user.nickname;
    }
  }, [user.nickname]);
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const subscriptionsPageSize = 5;
  const [subPage, setSubPage] = useState(1);
  const UPLOAD_PAGE_SIZE = 10;
  const [uploadPage, setUploadPage] = useState(1);
  const LEDGER_PAGE_SIZE = 10;
  const [ledgerPage, setLedgerPage] = useState(1);

  const computedLeaderboard = useMemo(() => {
    let list = [...leaderboard];
    const hasSelf = list.some(
      (e) =>
        e.nickname.toLowerCase() === (user.nickname || '').toLowerCase() ||
        e.address === user.walletAddress,
    );
    if (!hasSelf && user.balanceMEMO > 0 && user.nickname) {
      list.push({
        rank: list.length + 1,
        nickname: user.nickname,
        address: user.walletAddress || '0xUser',
        totalEarned: user.balanceMEMO,
      });
    }
    list = list
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .map((e, idx) => ({ ...e, rank: idx + 1 }));
    return list;
  }, [leaderboard, user.balanceMEMO, user.nickname, user.walletAddress]);

  const selfEntry = computedLeaderboard.find(
    (e) =>
      e.nickname.toLowerCase() === (user.nickname || '').toLowerCase() ||
      e.address === user.walletAddress,
  );
  const selfRank = selfEntry?.rank ?? '—';
  const otherEntries = computedLeaderboard.slice(3);
  const totalPages = Math.max(1, Math.ceil(otherEntries.length / PAGE_SIZE));
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const issuedTxs = useMemo(() => history.filter((tx) => tx.category === 'ISSUANCE'), [history]);
  const claimedTxs = useMemo(() => history.filter((tx) => tx.category === 'CLAIM'), [history]);
  const filteredLedger = historyFilter === 'ISSUED' ? issuedTxs : claimedTxs;
  const ledgerTotalPages = Math.max(1, Math.ceil(filteredLedger.length / LEDGER_PAGE_SIZE));

  const today = new Date().toISOString().split('T')[0];
  const hasClaimedBonus = user.lastDailyBonusDate === today;

  const drafts = tasks.filter((t) => t.status === 'DRAFT');
  const submittedTasks = tasks.filter((t) => t.status !== 'DRAFT');
  const uploadTotalPages = Math.max(1, Math.ceil(submittedTasks.length / UPLOAD_PAGE_SIZE));

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  // Page bounds corrections - these are intentional synchronization effects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages && totalPages > 0) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ledgerPage > ledgerTotalPages && ledgerTotalPages > 0) setLedgerPage(ledgerTotalPages);
  }, [ledgerPage, ledgerTotalPages]);

  // Reset photo reveal when switching selection
  const prevSelectedTaskId = React.useRef(selectedTask?.id);
  useEffect(() => {
    if (prevSelectedTaskId.current !== selectedTask?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoRevealed(false);
      prevSelectedTaskId.current = selectedTask?.id;
    }
  }, [selectedTask?.id]);

  const copyToClipboard = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(successMsg);
    } catch {
      setToast('Copy failed. Please try again.');
    }
  };

  const inviteCodeDisplay = ownInviteCode || 'INV-XXXX';
  const inviteLinkDisplay =
    inviteLink ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?code=${inviteCodeDisplay}&inviter=${encodeURIComponent(user.nickname || 'user')}`
      : '');

  return (
    <div className="min-h-screen bg-[#020205] pt-24 pb-12 px-4 md:px-8 font-mono text-gray-300 bg-[radial-gradient(ellipse_at_top,rgba(16,24,60,0.4),transparent_70%)]">
      {/* --- TOP ROW: COMMANDER PROFILE & RESOURCES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <HudPanel className="col-span-1 lg:col-span-2 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 w-full">
            <div className="relative w-16 h-16 flex-shrink-0">
              <div className="absolute inset-0 border-2 border-tech-blue rounded-full animate-spin-slow border-dashed opacity-50" />
              <div className="absolute inset-2 bg-gradient-to-b from-blue-900 to-black rounded-full flex items-center justify-center border border-white/10">
                <span className="text-xl font-bold text-white">
                  {user.nickname ? user.nickname.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              {user.isPro && (
                <div className="absolute -bottom-1 -right-1 bg-neon-purple text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                  PRO
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                  {user.nickname}
                </h2>
                <button
                  onClick={() => {
                    setNicknameModalOpen(true);
                    setNicknameError('');
                  }}
                  className="text-gray-500 hover:text-tech-blue transition-colors"
                  aria-label="Edit nickname"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <code className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">
                  {formatAddress(user.walletAddress)}
                </code>
                <button
                  onClick={() => copyToClipboard(user.walletAddress, 'Address copied')}
                  className="text-gray-500 hover:text-tech-blue transition-colors"
                >
                  <Copy size={12} />
                </button>
              </div>
              <div className="mt-3 mb-4 flex gap-4 text-xs">
                <div className="flex items-center gap-1 text-gray-400">
                  <Flame size={12} className="text-red-500" />
                  Streak: <span className="text-white">{user.streakDays} Days</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Shield size={12} className="text-tech-blue" />
                  Role:{' '}
                  <span className="text-white">
                    {user.isPro ? 'Validating Node' : 'Light Node'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
              <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">MNT</div>
              <div className="text-sm font-bold text-white">{user.balanceMNT.toFixed(3)}</div>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
              <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">USDT</div>
              <div className="text-sm font-bold text-green-400">${user.balanceUSDT.toFixed(3)}</div>
            </div>
          </div>
        </HudPanel>

        <HudPanel className="col-span-1 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-[10px] text-tech-blue uppercase tracking-[0.2em] mb-1">
                TOTAL EARNINGS
              </div>
              <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                {user.balanceMEMO.toFixed(1)}{' '}
                <span className="text-sm font-normal text-gray-500">$mEMO</span>
              </div>
            </div>
            <div className="p-2 bg-tech-blue/10 rounded-full">
              <Wallet size={20} className="text-tech-blue" />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs text-gray-400">UNCLAIMED LOOT</div>
              <div className="text-sm font-bold text-tech-blue">
                +{user.pendingRewards.toFixed(1)}
              </div>
            </div>
            <GameButton
              onClick={onClaimAll}
              disabled={user.pendingRewards <= 0}
              className="w-full flex items-center justify-center gap-2"
            >
              <Coins size={14} /> EXTRACT LOOT
            </GameButton>
          </div>
        </HudPanel>
      </div>

      {/* --- MIDDLE ROW: PRO STATUS & MISSIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <HudPanel className="col-span-1 lg:col-span-1 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Crown size={16} className={user.isPro ? 'text-neon-purple' : 'text-gray-600'} />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Node Status
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-gray-400">Current Tier</div>
            <div
              className={`text-xl font-bold ${user.isPro ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]' : 'text-gray-500'}`}
            >
              {user.isPro ? 'PRO ACCESS' : 'BASIC ACCESS'}
            </div>
            {user.isPro && user.proExpiryDate && (
              <div className="text-[10px] text-gray-600">
                Sync Ends: {new Date(user.proExpiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="bg-white/5 p-3 rounded border border-white/10 mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase text-gray-400">Daily Drop</span>
              <span className="text-xs font-bold text-white">
                {user.isPro
                  ? user.proPlanId === 'monthly'
                    ? '+5'
                    : user.proPlanId === 'quarterly'
                      ? '+10'
                      : '+30'
                  : '+0'}
              </span>
            </div>
            {user.isPro ? (
              <GameButton
                onClick={onClaimBonus}
                disabled={hasClaimedBonus}
                className="w-full text-[10px] py-1.5"
              >
                {hasClaimedBonus ? 'RECEIVED' : 'CLAIM DROP'}
              </GameButton>
            ) : (
              <GameButton onClick={onUpgradeClick} className="w-full text-[10px] py-1.5">
                Unlock Pro
              </GameButton>
            )}
            {/* Change Button Text for Existing Pro Users */}
            {user.isPro && (
              <GameButton
                onClick={onUpgradeClick}
                variant="ghost"
                className="w-full mt-2 text-[9px] py-1.5"
              >
                Manage Plan
              </GameButton>
            )}
          </div>
        </HudPanel>

        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-tech-blue uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Active Missions
            </h3>
            <div className="text-[10px] text-gray-500 font-mono">REFRESH: 00:00 UTC</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {emotions.map((emotion) => {
              const count = taskCounts[emotion] || 0;
              const isCompleted = count >= dailyLimit;

              return (
                <button
                  key={emotion}
                  onClick={() => !isCompleted && onStartTask(emotion)}
                  disabled={isCompleted}
                  className={`
                             relative p-3 h-32 flex flex-col items-center justify-center gap-3 transition-all duration-300
                             border border-white/10 hover:border-tech-blue/50 bg-[#0f0f15] hover:bg-[#151520]
                             ${isCompleted ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
                          `}
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  }}
                >
                  <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {emotion === 'Happy'
                      ? '😊'
                      : emotion === 'Anger'
                        ? '😡'
                        : emotion === 'Sad'
                          ? '😢'
                          : emotion === 'Fear'
                            ? '😱'
                            : emotion === 'Disgust'
                              ? '🤢'
                              : emotion === 'Surprise'
                                ? '😲'
                                : '😐'}
                  </div>
                  <div className="w-full px-2">
                    <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
                      <span>{emotion.toUpperCase()}</span>
                      <span className={isCompleted ? 'text-green-500' : 'text-tech-blue'}>
                        {count}/{dailyLimit}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full shadow-[0_0_5px_currentColor] ${isCompleted ? 'bg-green-500 text-green-500' : 'bg-tech-blue text-tech-blue'}`}
                        style={{ width: `${(count / dailyLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: DATA --- */}
      <div className="border border-white/10 bg-[#0a0a0f] min-h-[500px]">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 bg-black/40">
          {[
            { id: 'contributions', icon: Clock, label: 'CONTRIBUTIONS' },
            { id: 'memo_history', icon: Wallet, label: 'LEDGER' },
            { id: 'leaderboard', icon: Crown, label: 'RANKING' },
            { id: 'invitation', icon: Share2, label: 'INVITATION' },
            { id: 'subscriptions', icon: CreditCard, label: 'SUBSCRIPTIONS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'contributions'
                    | 'memo_history'
                    | 'leaderboard'
                    | 'invitation'
                    | 'subscriptions',
                )
              }
              className={`
                        px-6 py-3 text-xs font-bold flex items-center gap-2 transition-all relative
                        ${activeTab === tab.id ? 'text-tech-blue bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                     `}
            >
              <tab.icon size={14} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-blue shadow-[0_0_10px_#00f3ff]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* CONTENT TABS */}
          {activeTab === 'contributions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Drafts */}
              <div className="lg:col-span-1 border-r border-white/5 pr-0 lg:pr-8">
                <h4 className="text-xs text-tech-blue font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
                  <Edit2 size={12} /> Staged Data (Drafts)
                </h4>
                {drafts.length === 0 ? (
                  <div className="text-xs text-gray-600 font-mono py-8 text-center border border-dashed border-white/10 rounded">
                    NO DRAFTS FOUND
                  </div>
                ) : (
                  <div className="space-y-3">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        className="bg-white/5 border border-white/10 p-3 flex gap-3 group hover:border-tech-blue/30 transition-colors"
                      >
                        <div className="w-12 h-12 bg-black border border-white/10 overflow-hidden relative">
                          <img
                            src={draft.imageUrl}
                            className="w-full h-full object-cover opacity-50 grayscale"
                            alt="Draft"
                          />
                          <div className="absolute inset-0 bg-tech-blue/10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white mb-1 truncate">
                            {draft.emotion} Sequence
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            {new Date(draft.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => onResumeTask(draft)}
                            className="p-1.5 bg-tech-blue/10 text-tech-blue hover:bg-tech-blue hover:text-black"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            onClick={() => onDeleteTask(draft.id)}
                            className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: History */}
              <div className="lg:col-span-2">
                <h4 className="text-xs text-tech-blue font-bold uppercase mb-4 tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={12} /> Upload Log
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[10px] text-gray-500 uppercase tracking-wider pb-2 border-b border-white/10 px-4">
                    <div className="col-span-2">Time</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-3">ID</div>
                    <div className="col-span-2 text-center">Details</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>
                  {submittedTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-600 text-xs font-mono">
                      AWAITING INPUT...
                    </div>
                  ) : (
                    submittedTasks
                      .slice(
                        (uploadPage - 1) * UPLOAD_PAGE_SIZE,
                        (uploadPage - 1) * UPLOAD_PAGE_SIZE + UPLOAD_PAGE_SIZE,
                      )
                      .map((task) => (
                        <div
                          key={task.id}
                          className="grid grid-cols-12 items-center text-xs px-4 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="col-span-2 font-mono text-gray-400">
                            {new Date(task.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="col-span-3 font-bold text-white">{task.emotion}</div>
                          <div className="col-span-3 font-mono text-gray-500 truncate">
                            {task.id}
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <button
                              onClick={() => setSelectedTask(task)}
                              className="px-3 py-1 text-[11px] font-mono rounded border border-white/15 text-white hover:border-tech-blue hover:text-tech-blue transition-colors"
                            >
                              View
                            </button>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            {task.status === 'AUDITING' && (
                              <span className="text-yellow-500 flex items-center gap-1">
                                <Timer size={10} className="animate-spin" /> VERIFYING
                              </span>
                            )}
                            {task.status === 'LABELED' && (
                              <span className="text-green-500 flex items-center gap-1">
                                <CheckCircle2 size={10} /> ACCEPTED
                              </span>
                            )}
                            {task.status === 'REJECTED' && (
                              <span className="text-red-500 flex items-center gap-1">
                                <XCircle size={10} /> REJECTED
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                  {submittedTasks.length > 0 && (
                    <div className="flex justify-center items-center gap-3 pt-2">
                      <button
                        onClick={() => setUploadPage((p) => Math.max(1, p - 1))}
                        disabled={uploadPage === 1}
                        className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${uploadPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
                      >
                        Prev
                      </button>
                      <div className="text-[11px] text-gray-400">
                        Page <span className="text-white">{uploadPage}</span> /{' '}
                        <span className="text-white">{uploadTotalPages}</span>
                      </div>
                      <button
                        onClick={() => setUploadPage((p) => Math.min(uploadTotalPages, p + 1))}
                        disabled={uploadPage === uploadTotalPages}
                        className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${uploadPage === uploadTotalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LEDGER TAB */}
          {activeTab === 'memo_history' && (
            <div>
              <div className="flex gap-2 mb-6">
                {(['ISSUED', 'CLAIMED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter)}
                    className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                      historyFilter === filter
                        ? 'bg-tech-blue text-black border-tech-blue'
                        : 'text-gray-500 border-white/10 hover:border-gray-400'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="space-y-2 font-mono">
                {filteredLedger.length === 0 ? (
                  <div className="text-center py-12 text-gray-600 text-xs font-mono border border-dashed border-white/10 rounded">
                    No records yet.
                  </div>
                ) : (
                  <>
                    {filteredLedger
                      .slice(
                        (ledgerPage - 1) * LEDGER_PAGE_SIZE,
                        (ledgerPage - 1) * LEDGER_PAGE_SIZE + LEDGER_PAGE_SIZE,
                      )
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 border-l-2 border-white/10 bg-white/5 hover:border-tech-blue transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}
                            >
                              {tx.category === 'CLAIM' ? <Wallet size={16} /> : <Zap size={16} />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white uppercase">
                                {tx.source || tx.desc}
                              </div>
                              <div className="text-[10px] text-gray-500">
                                {new Date(tx.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold text-white mb-1">
                              +{tx.amount} <span className="text-tech-blue">$mEMO</span>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              {tx.cost && (
                                <span className="text-[9px] text-gray-500">GAS: {tx.cost}</span>
                              )}
                              {historyFilter === 'CLAIMED' && tx.status === 'FAILED' && (
                                <button
                                  onClick={() => onRetryClaim(tx)}
                                  className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-500 hover:text-white"
                                >
                                  <RefreshCw size={8} /> RETRY
                                </button>
                              )}
                              {historyFilter === 'CLAIMED' && tx.status === 'SUCCESS' && (
                                <a
                                  href="#"
                                  className="text-[9px] text-tech-blue flex items-center gap-1 hover:underline"
                                >
                                  EXPLORER <ExternalLink size={8} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="flex justify-center items-center gap-3 pt-2">
                      <button
                        onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}
                        disabled={ledgerPage === 1}
                        className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
                      >
                        Prev
                      </button>
                      <div className="text-[11px] text-gray-400">
                        Page <span className="text-white">{ledgerPage}</span> /{' '}
                        <span className="text-white">{ledgerTotalPages}</span>
                      </div>
                      <button
                        onClick={() => setLedgerPage((p) => Math.min(ledgerTotalPages, p + 1))}
                        disabled={ledgerPage === ledgerTotalPages}
                        className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${ledgerPage === ledgerTotalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === 'subscriptions' && (
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
                  {subscriptions
                    .slice(
                      (subPage - 1) * subscriptionsPageSize,
                      (subPage - 1) * subscriptionsPageSize + subscriptionsPageSize,
                    )
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="grid grid-cols-12 items-center text-xs px-2 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="col-span-3 font-mono text-gray-400">
                          {new Date(sub.createdAt).toLocaleString()}
                        </div>
                        <div className="col-span-3 text-white font-bold truncate">
                          {sub.planName}
                        </div>
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
                          {sub.status === 'FAILED' && (
                            <span className="text-red-500 font-bold">FAILED</span>
                          )}
                          {sub.txHash && (
                            <div className="text-[9px] text-gray-500 truncate">
                              Tx: {sub.txHash}
                            </div>
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
                      <span className="text-white">
                        {Math.max(1, Math.ceil(subscriptions.length / subscriptionsPageSize))}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setSubPage((p) =>
                          Math.min(
                            Math.max(1, Math.ceil(subscriptions.length / subscriptionsPageSize)),
                            p + 1,
                          ),
                        )
                      }
                      disabled={subPage >= Math.ceil(subscriptions.length / subscriptionsPageSize)}
                      className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${subPage >= Math.ceil(subscriptions.length / subscriptionsPageSize) ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* LEADERBOARD TAB (UPDATED WITH PADDING FIX) */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 pt-8">
              {' '}
              {/* Added pt-8 to prevent overflow */}
              {/* Top 3 Highlight */}
              <div className="grid grid-cols-3 gap-6 mb-8 items-end">
                {[1, 0, 2].map((idx) => {
                  // Render 2nd, 1st, 3rd order
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
                          <span className="text-xl font-bold text-white">
                            {entry.address.slice(2, 4)}
                          </span>
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
                    <div className="text-[10px] text-tech-blue">{user.walletAddress}</div>
                    <div className="text-white font-bold text-sm">
                      {user.balanceMEMO.toLocaleString()}{' '}
                      <span className="text-[10px] text-gray-500">$mEMO</span>
                    </div>
                  </div>
                </div>
                {otherEntries
                  .slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
                  .map((entry) => {
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
                            <div className="text-[10px] font-mono text-gray-500">
                              {entry.address}
                            </div>
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
          )}

          {/* INVITATION TAB (GameFi Style) */}
          {activeTab === 'invitation' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <HudPanel className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] text-tech-blue uppercase tracking-widest">
                        Invitation
                      </div>
                      <div className="text-xl font-bold text-white">Bind Invite Code</div>
                      {user.invitedBy && (
                        <div className="text-xs text-gray-500 mt-1">
                          Invited by {user.invitedBy}
                        </div>
                      )}
                    </div>
                    {(inviteCodeInfo.locked || inviteCodeInfo.persisted) && (
                      <div className="px-2 py-1 rounded bg-tech-blue/10 text-tech-blue text-[10px] font-bold">
                        LOCKED
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={inviteInput}
                      onChange={(e) => {
                        if (inviteCodeInfo.locked || inviteCodeInfo.persisted) return;
                        setInviteInput(e.target.value);
                        setInviteMessage('');
                      }}
                      disabled={inviteCodeInfo.locked || inviteCodeInfo.persisted}
                      placeholder="Enter invite code"
                      className={`flex-1 bg-black/40 border ${inviteCodeInfo.locked || inviteCodeInfo.persisted ? 'border-white/10 text-gray-500' : 'border-white/10 focus:border-tech-blue'} rounded px-3 py-2 text-sm`}
                    />
                    <GameButton
                      onClick={() => {
                        const res = onApplyInviteCode(inviteInput.trim());
                        if (!res.ok) {
                          setInviteMessage(res.message || 'Invite code is invalid');
                        } else {
                          setInviteMessage(
                            `Bound. Inviter: ${res.invitedBy || 'Community Member'}`,
                          );
                        }
                      }}
                      disabled={
                        inviteCodeInfo.locked || inviteCodeInfo.persisted || !inviteInput.trim()
                      }
                      className="sm:w-40"
                    >
                      APPLY
                    </GameButton>
                  </div>
                  {inviteMessage && (
                    <div className="text-xs text-tech-blue mt-2">{inviteMessage}</div>
                  )}
                </HudPanel>

                <HudPanel className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Users size={32} className="text-gray-600" />
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                        Network Size
                      </div>
                      <div className="text-3xl font-bold text-white font-mono">
                        {user.inviteCount} / 10
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>Your Invite Code</span>
                      <button
                        onClick={() => copyToClipboard(inviteCodeDisplay, 'Invite code copied')}
                        className="text-tech-blue text-[11px] hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-sm text-white">
                      {inviteCodeDisplay}
                    </div>
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>Invite Link</span>
                      <button
                        onClick={() => copyToClipboard(inviteLinkDisplay, 'Invite link copied')}
                        className="text-tech-blue text-[11px] hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded px-3 py-2 font-mono text-xs text-white break-all">
                      {inviteLinkDisplay || 'Invite link unavailable'}
                    </div>
                  </div>
                </HudPanel>

                <HudPanel className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Share2 size={32} className="text-tech-blue" />
                    <div className="text-right">
                      <div className="text-[10px] text-tech-blue uppercase tracking-widest">
                        Commission Pool
                      </div>
                      <div className="text-3xl font-bold text-white font-mono">
                        +{user.invitationRewards.toFixed(1)} $mEMO
                      </div>
                    </div>
                  </div>
                  <GameButton
                    onClick={onClaimInvitationRewards}
                    disabled={user.invitationRewards <= 0}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Coins size={14} /> EXTRACT COMMISSION
                  </GameButton>
                </HudPanel>
              </div>

              <div className="border border-white/5 bg-black/20 p-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                  <Users size={14} /> Active Nodes
                </h4>
                <div className="space-y-3">
                  {invitees.map((invitee) => (
                    <div
                      key={invitee.id}
                      className="bg-white/5 border border-white/5 p-4 flex justify-between items-center hover:border-white/20 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-white text-sm mb-1">{invitee.nickname}</div>
                        <div className="text-[10px] text-gray-500 font-mono flex gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={8} /> {invitee.inviteDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity size={8} /> {invitee.lastActive}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-xs font-bold text-green-400 mb-1">
                          +{invitee.pendingReward.toFixed(1)}{' '}
                          <span className="text-gray-500 font-normal">Pending</span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Claimed:{' '}
                          <span className="text-white">{invitee.claimedReward.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/80 border border-tech-blue/40 text-white text-xs font-mono px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden border border-tech-blue/50 rounded-lg bg-[#0a0d14] shadow-[0_0_30px_rgba(0,243,255,0.25)]">
            <div className="absolute inset-3 border border-white/10 rounded pointer-events-none" />
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white z-10"
              aria-label="Close details modal"
            >
              <X size={16} />
            </button>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-tech-blue uppercase tracking-[0.2em]">
                    Submission Details
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-1">
                    ID: {selectedTask.id}
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  {new Date(selectedTask.timestamp).toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0c111a] border border-white/10 rounded-md p-5 shadow-inner space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                      Label Summary
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                      {selectedTask.status === 'LABELED' && (
                        <span className="text-green-500 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Accepted
                        </span>
                      )}
                      {selectedTask.status === 'AUDITING' && (
                        <span className="text-yellow-500 font-bold flex items-center gap-1">
                          <Timer size={12} className="animate-spin" /> Verifying
                        </span>
                      )}
                      {selectedTask.status === 'REJECTED' && (
                        <span className="text-red-500 font-bold flex items-center gap-1">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-white">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Emotion</div>
                      <div className="font-bold text-lg">{selectedTask.emotion}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Status</div>
                      <div className="text-[13px] font-bold">
                        {selectedTask.status === 'LABELED' && (
                          <span className="text-green-500">Accepted</span>
                        )}
                        {selectedTask.status === 'AUDITING' && (
                          <span className="text-yellow-500">Verifying</span>
                        )}
                        {selectedTask.status === 'REJECTED' && (
                          <span className="text-red-500">Rejected</span>
                        )}
                      </div>
                      {selectedTask.failReason && (
                        <div className="text-[11px] text-gray-400 mt-1">
                          Reason: {selectedTask.failReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-500 uppercase">User Labels</div>
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-300">
                      <div>
                        Face Clear:{' '}
                        <span className="text-white font-bold">
                          {selectedTask.draftData?.isClear === true
                            ? 'Yes'
                            : selectedTask.draftData?.isClear === false
                              ? 'No'
                              : 'N/A'}
                        </span>
                      </div>
                      <div>
                        Emotion Intensity:{' '}
                        <span className="text-white font-bold">
                          {selectedTask.draftData?.intensity ?? 'N/A'}
                        </span>
                      </div>
                      <div>
                        Natural or Pose:{' '}
                        <span className="text-white font-bold">
                          {selectedTask.draftData?.isStaged === true
                            ? 'Pose'
                            : selectedTask.draftData?.isStaged === false
                              ? 'Natural'
                              : 'N/A'}
                        </span>
                      </div>
                      <div>
                        Continuity:{' '}
                        <span className="text-white font-bold">
                          {selectedTask.draftData?.arousal ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-[#0c111a] border border-white/10 p-4 rounded-md shadow-inner flex flex-col gap-3">
                  <div className="text-[10px] text-gray-500 uppercase">Photo Preview</div>
                  <div
                    className={`flex-1 border border-dashed border-white/15 bg-black/40 rounded-md flex items-center justify-center min-h-[280px] text-gray-500 text-xs overflow-hidden relative ${selectedTask.imageUrl ? 'cursor-pointer' : ''}`}
                    onClick={() => setPhotoRevealed(true)}
                  >
                    {selectedTask.imageUrl ? (
                      <>
                        <img
                          src={selectedTask.imageUrl}
                          alt="Captured"
                          className={`w-full h-full object-contain rounded-md transition-all duration-300 ${photoRevealed ? 'blur-0 opacity-100' : 'blur-sm scale-105 opacity-80'}`}
                        />
                        {!photoRevealed && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white text-[11px] bg-black/30">
                            <div className="px-3 py-1 bg-black/60 rounded-full border border-white/15">
                              Blurred for privacy
                            </div>
                            <div className="text-gray-300">Tap to reveal full photo</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-10">
                        <div className="w-12 h-12 rounded-full border border-white/10" />
                        <span>Image loading...</span>
                      </div>
                    )}
                  </div>
                  {selectedTask.imageUrl && !photoRevealed && (
                    <button
                      onClick={() => setPhotoRevealed(true)}
                      className="text-[11px] text-tech-blue underline hover:text-white text-left"
                    >
                      Show full photo (current modal)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {nicknameModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setNicknameModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-white"
              aria-label="Close nickname modal"
            >
              <X size={16} />
            </button>
            <h3 className="text-lg font-bold mb-3">Edit Nickname</h3>
            <p className="text-xs text-gray-500 mb-3">
              Use 1-15 letters or numbers. Must be unique.
            </p>
            <input
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
                setNicknameError('');
              }}
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-tech-blue outline-none"
              placeholder="Enter nickname"
            />
            {nicknameError && <div className="text-xs text-red-500 mt-2">{nicknameError}</div>}
            <div className="flex justify-end gap-3 mt-4">
              <GameButton
                variant="ghost"
                onClick={() => setNicknameModalOpen(false)}
                className="px-4 py-2 text-[11px]"
              >
                Cancel
              </GameButton>
              <GameButton
                onClick={() => {
                  const res = onRenameNickname(nicknameInput);
                  if (!res.ok) {
                    setNicknameError(res.message || 'Nickname invalid');
                    return;
                  }
                  setNicknameModalOpen(false);
                }}
                className="px-4 py-2 text-[11px]"
              >
                Save
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
