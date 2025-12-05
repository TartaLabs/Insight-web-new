import React, { useState } from 'react';
import { UserProfile, TaskCounts, EmotionType, LeaderboardEntry, Transaction, TaskRecord, Invitee } from '../../types';
import { Crown, Clock, Share2, Zap, Coins, Copy, Trash2, Edit2, CheckCircle2, XCircle, Timer, Wallet, ExternalLink, RefreshCw, Filter, Users, Calendar, Terminal, Shield, Activity, Medal } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  tasks: TaskRecord[];
  taskCounts: TaskCounts;
  dailyLimit: number;
  rewardPerTask: number;
  history: Transaction[];
  leaderboard: LeaderboardEntry[];
  invitees: Invitee[];
  onStartTask: (emotion: EmotionType) => void;
  onResumeTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
  onUpgradeClick: () => void;
  onClaimAll: () => void;
  onClaimBonus: () => void;
  onRetryClaim: (tx: Transaction) => void;
  onClaimInvitationRewards: () => void;
}

const emotions: EmotionType[] = ['Happy', 'Anger', 'Sad', 'Fear', 'Disgust', 'Surprise', 'Neutral'];

// Reusable GameFi Components
const HudPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-[#0a0a0f]/90 border border-tech-blue/20 ${className} overflow-hidden group`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-tech-blue" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-tech-blue" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-tech-blue" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-tech-blue" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const GameButton = ({ onClick, disabled, children, className = "", variant = 'primary' }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative px-6 py-2 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-200
      clip-path-polygon-[10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px]
      ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'}
      ${variant === 'primary' 
        ? 'bg-tech-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.6)]' 
        : variant === 'accent'
        ? 'bg-neon-purple text-white hover:shadow-[0_0_15px_rgba(188,19,254,0.6)]'
        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
      }
      ${className}
    `}
    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
  >
    {children}
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
    user, tasks, taskCounts, dailyLimit, rewardPerTask, history, leaderboard, invitees,
    onStartTask, onResumeTask, onDeleteTask, onUpgradeClick, onClaimAll, onClaimBonus, onRetryClaim, onClaimInvitationRewards
}) => {
  const [activeTab, setActiveTab] = useState<'contributions' | 'memo_history' | 'leaderboard' | 'invitation'>('contributions');
  const [historyFilter, setHistoryFilter] = useState<'ISSUED' | 'CLAIMED'>('ISSUED');

  const today = new Date().toISOString().split('T')[0];
  const hasClaimedBonus = user.lastDailyBonusDate === today;

  const drafts = tasks.filter(t => t.status === 'DRAFT');
  const submittedTasks = tasks.filter(t => t.status !== 'DRAFT');

  const issuedTxs = history.filter(tx => tx.category === 'ISSUANCE');
  const claimedTxs = history.filter(tx => tx.category === 'CLAIM');

  return (
    <div className="min-h-screen bg-[#020205] pt-24 pb-12 px-4 md:px-8 font-mono text-gray-300 bg-[radial-gradient(ellipse_at_top,rgba(16,24,60,0.4),transparent_70%)]">
      
      {/* --- TOP ROW: COMMANDER PROFILE & RESOURCES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <HudPanel className="col-span-1 lg:col-span-2 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-5 w-full">
              <div className="relative w-16 h-16 flex-shrink-0">
                 <div className="absolute inset-0 border-2 border-tech-blue rounded-full animate-spin-slow border-dashed opacity-50" />
                 <div className="absolute inset-2 bg-gradient-to-b from-blue-900 to-black rounded-full flex items-center justify-center border border-white/10">
                    <span className="text-xl font-bold text-white">{user.nickname.charAt(0).toUpperCase()}</span>
                 </div>
                 {user.isPro && (
                    <div className="absolute -bottom-1 -right-1 bg-neon-purple text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20">
                       PRO
                    </div>
                 )}
              </div>

              <div className="flex-1">
                 <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase">{user.nickname}</h2>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-tech-blue border border-tech-blue/30">Lvl {Math.floor(user.streakDays / 7) + 1}</span>
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                    <code className="text-xs text-gray-500 bg-black/50 px-2 py-1 rounded border border-white/5">{user.walletAddress}</code>
                    <Copy size={12} className="cursor-pointer hover:text-tech-blue" />
                 </div>
                 <div className="mt-3 flex gap-4 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                       <Activity size={12} className="text-green-500" /> 
                       Streak: <span className="text-white">{user.streakDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                       <Shield size={12} className="text-tech-blue" /> 
                       Role: <span className="text-white">{user.isPro ? 'Validating Node' : 'Light Node'}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-2 w-full md:w-auto">
              <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
                 <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">MNT GAS</div>
                 <div className="text-sm font-bold text-white">{user.balanceMNT.toFixed(3)}</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-3 rounded flex-1 min-w-[80px]">
                 <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">USDT</div>
                 <div className="text-sm font-bold text-green-400">${user.balanceUSDT.toFixed(2)}</div>
              </div>
           </div>
        </HudPanel>

        <HudPanel className="col-span-1 p-6 flex flex-col justify-between">
           <div className="flex justify-between items-start mb-4">
              <div>
                 <div className="text-[10px] text-tech-blue uppercase tracking-[0.2em] mb-1">TOTAL EARNINGS</div>
                 <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                    {user.balanceMEMO.toFixed(1)} <span className="text-sm font-normal text-gray-500">$mEMO</span>
                 </div>
              </div>
              <div className="p-2 bg-tech-blue/10 rounded-full">
                 <Wallet size={20} className="text-tech-blue" />
              </div>
           </div>

           <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-3">
                 <div className="text-xs text-gray-400">UNCLAIMED LOOT</div>
                 <div className="text-sm font-bold text-tech-blue">+{user.pendingRewards.toFixed(1)}</div>
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
               <Crown size={16} className={user.isPro ? "text-neon-purple" : "text-gray-600"} />
               <span className="text-xs font-bold uppercase tracking-wider text-white">Node Status</span>
            </div>
            
            <div className="space-y-1">
               <div className="text-sm text-gray-400">Current Tier</div>
               <div className={`text-xl font-bold ${user.isPro ? "text-neon-purple drop-shadow-[0_0_5px_rgba(188,19,254,0.5)]" : "text-gray-500"}`}>
                  {user.isPro ? 'PRO ACCESS' : 'BASIC ACCESS'}
               </div>
               {user.isPro && user.proExpiryDate && (
                  <div className="text-[10px] text-gray-600">Sync Ends: {new Date(user.proExpiryDate).toLocaleDateString()}</div>
               )}
            </div>

            <div className="bg-white/5 p-3 rounded border border-white/10 mt-auto">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] uppercase text-gray-400">Daily Drop</span>
                  <span className="text-xs font-bold text-white">{user.isPro ? (user.proPlanId === 'monthly' ? '+5' : user.proPlanId === 'quarterly' ? '+10' : '+30') : '+0'}</span>
               </div>
               {user.isPro ? (
                  <GameButton 
                     onClick={onClaimBonus} 
                     disabled={hasClaimedBonus} 
                     variant="accent"
                     className="w-full text-[10px] py-1.5"
                  >
                     {hasClaimedBonus ? 'RECEIVED' : 'CLAIM DROP'}
                  </GameButton>
               ) : (
                  <button onClick={onUpgradeClick} className="w-full text-[10px] py-1.5 border border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors uppercase">
                     Unlock Pro
                  </button>
               )}
               {/* Change Button Text for Existing Pro Users */}
               {user.isPro && (
                   <button onClick={onUpgradeClick} className="w-full mt-2 text-[9px] text-gray-500 hover:text-white uppercase tracking-widest text-center">
                       Manage Plan
                   </button>
               )}
            </div>
         </HudPanel>

         <div className="col-span-1 lg:col-span-3">
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="text-sm font-bold text-tech-blue uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} /> Active Missions
               </h3>
               <div className="text-[10px] text-gray-500 font-mono">
                  REFRESH: 00:00 UTC
               </div>
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
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
                       >
                           <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                              {emotion === 'Happy' ? '😊' : 
                               emotion === 'Anger' ? '😡' : 
                               emotion === 'Sad' ? '😢' : 
                               emotion === 'Fear' ? '😱' : 
                               emotion === 'Disgust' ? '🤢' : 
                               emotion === 'Surprise' ? '😲' : '😐'}
                           </div>
                           <div className="w-full px-2">
                               <div className="flex justify-between text-[10px] mb-1 font-bold text-gray-400">
                                   <span>{emotion.toUpperCase()}</span>
                                   <span className={isCompleted ? 'text-green-500' : 'text-tech-blue'}>{count}/{dailyLimit}</span>
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

      {/* --- BOTTOM ROW: DATA TERMINAL --- */}
      <div className="border border-white/10 bg-[#0a0a0f] min-h-[500px]">
          <div className="flex items-center border-b border-white/10 bg-black/40">
              <div className="px-4 py-3 flex items-center gap-2 text-gray-500 border-r border-white/10">
                 <Terminal size={14} />
                 <span className="text-xs font-mono">TERMINAL_V1.0</span>
              </div>
              
              <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'contributions', icon: Clock, label: 'CONTRIBUTIONS' },
                    { id: 'memo_history', icon: Wallet, label: 'LEDGER' },
                    { id: 'leaderboard', icon: Crown, label: 'RANKING' },
                    { id: 'invitation', icon: Share2, label: 'NETWORK' }
                  ].map((tab) => (
                      <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id as any)}
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
                             <div className="text-xs text-gray-600 font-mono py-8 text-center border border-dashed border-white/10 rounded">NO DRAFTS FOUND</div>
                          ) : (
                             <div className="space-y-3">
                                {drafts.map(draft => (
                                   <div key={draft.id} className="bg-white/5 border border-white/10 p-3 flex gap-3 group hover:border-tech-blue/30 transition-colors">
                                      <div className="w-12 h-12 bg-black border border-white/10 overflow-hidden relative">
                                         <img src={draft.imageUrl} className="w-full h-full object-cover opacity-50 grayscale" alt="Draft" />
                                         <div className="absolute inset-0 bg-tech-blue/10" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                         <div className="text-xs font-bold text-white mb-1 truncate">{draft.emotion} Sequence</div>
                                         <div className="text-[10px] text-gray-500 font-mono">{new Date(draft.timestamp).toLocaleTimeString()}</div>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                         <button onClick={() => onResumeTask(draft)} className="p-1.5 bg-tech-blue/10 text-tech-blue hover:bg-tech-blue hover:text-black">
                                            <Edit2 size={10} />
                                         </button>
                                         <button onClick={() => onDeleteTask(draft.id)} className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white">
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
                                  <div className="col-span-4">ID</div>
                                  <div className="col-span-3 text-right">Status</div>
                              </div>
                              {submittedTasks.length === 0 ? (
                                  <div className="text-center py-12 text-gray-600 text-xs font-mono">AWAITING INPUT...</div>
                              ) : (
                                  submittedTasks.map(task => (
                                      <div key={task.id} className="grid grid-cols-12 items-center text-xs px-4 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                          <div className="col-span-2 font-mono text-gray-400">{new Date(task.timestamp).toLocaleTimeString()}</div>
                                          <div className="col-span-3 font-bold text-white">{task.emotion}</div>
                                          <div className="col-span-4 font-mono text-gray-500 truncate">{task.id}</div>
                                          <div className="col-span-3 flex justify-end">
                                              {task.status === 'AUDITING' && <span className="text-yellow-500 flex items-center gap-1"><Timer size={10} className="animate-spin" /> VERIFYING</span>}
                                              {task.status === 'LABELED' && <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={10} /> ACCEPTED</span>}
                                              {task.status === 'REJECTED' && <span className="text-red-500 flex items-center gap-1"><XCircle size={10} /> REJECTED</span>}
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {/* LEDGER TAB */}
              {activeTab === 'memo_history' && (
                  <div>
                      <div className="flex gap-2 mb-6">
                          {['ISSUED', 'CLAIMED'].map((filter) => (
                              <button 
                                 key={filter}
                                 onClick={() => setHistoryFilter(filter as any)}
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
                          {(historyFilter === 'ISSUED' ? issuedTxs : claimedTxs).map(tx => (
                              <div key={tx.id} className="flex items-center justify-between p-4 border-l-2 border-white/10 bg-white/5 hover:border-tech-blue transition-colors">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-2 rounded ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                                          {tx.category === 'CLAIM' ? <Wallet size={16} /> : <Zap size={16} />}
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-white uppercase">{tx.source || tx.desc}</div>
                                          <div className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</div>
                                      </div>
                                  </div>
                                  
                                  <div className="text-right">
                                      <div className="text-sm font-bold text-white mb-1">+{tx.amount} <span className="text-tech-blue">$mEMO</span></div>
                                      <div className="flex items-center justify-end gap-2">
                                          {tx.cost && <span className="text-[9px] text-gray-500">GAS: {tx.cost}</span>}
                                          {historyFilter === 'CLAIMED' && tx.status === 'FAILED' && (
                                              <button onClick={() => onRetryClaim(tx)} className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-500 hover:text-white">
                                                  <RefreshCw size={8} /> RETRY
                                              </button>
                                          )}
                                          {historyFilter === 'CLAIMED' && tx.status === 'SUCCESS' && (
                                              <a href="#" className="text-[9px] text-tech-blue flex items-center gap-1 hover:underline">
                                                  EXPLORER <ExternalLink size={8} />
                                              </a>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* LEADERBOARD TAB (UPDATED WITH PADDING FIX) */}
              {activeTab === 'leaderboard' && (
                  <div className="space-y-4 pt-8"> {/* Added pt-8 to prevent overflow */}
                      {/* Top 3 Highlight */}
                      <div className="grid grid-cols-3 gap-4 mb-8 items-end">
                          {[1, 0, 2].map((idx) => { // Render 2nd, 1st, 3rd order
                              const entry = leaderboard[idx];
                              if (!entry) return null;
                              const isFirst = idx === 0;
                              return (
                                  <div key={idx} className={`relative flex flex-col items-center ${isFirst ? 'scale-110 z-10' : 'scale-95 opacity-80'}`}>
                                      <div className="relative">
                                          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center bg-black ${isFirst ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'border-white/20'}`}>
                                              <span className="text-xl font-bold text-white">{entry.address.slice(2, 4)}</span>
                                          </div>
                                          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold ${isFirst ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white'}`}>
                                              #{idx + 1}
                                          </div>
                                          {isFirst && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce" size={24} />}
                                      </div>
                                      <div className="mt-4 text-center">
                                          <div className="text-sm font-bold text-white">{entry.nickname}</div>
                                          <div className="text-[10px] font-mono text-gray-500">{entry.address}</div>
                                          <div className="text-sm font-bold text-tech-blue mt-1">{entry.totalEarned.toLocaleString()}</div>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>

                      {/* List */}
                      <div className="space-y-2">
                          {/* User Self Rank (Highlight) */}
                          <div className="bg-tech-blue/10 border border-tech-blue/50 p-4 flex items-center justify-between mb-4 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-tech-blue/5 animate-pulse" />
                              <div className="relative flex items-center gap-4">
                                  <div className="w-8 h-8 flex items-center justify-center font-bold font-mono text-white bg-tech-blue/20 rounded">
                                      #42
                                  </div>
                                  <div>
                                      <div className="font-bold text-white text-sm">YOU ({user.nickname})</div>
                                      <div className="text-[10px] text-tech-blue font-mono">{user.walletAddress}</div>
                                  </div>
                              </div>
                              <div className="relative font-mono text-sm text-white font-bold">{user.balanceMEMO.toLocaleString()} <span className="text-[10px] text-gray-500">$mEMO</span></div>
                          </div>

                          {leaderboard.slice(3).map((entry, idx) => (
                              <div key={idx + 3} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 flex items-center justify-center font-bold font-mono text-gray-500">
                                          #{entry.rank}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-white">{entry.nickname}</div>
                                          <div className="text-[10px] font-mono text-gray-500">{entry.address}</div>
                                      </div>
                                  </div>
                                  <div className="font-mono text-sm text-white font-bold">{entry.totalEarned.toLocaleString()}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* INVITATION TAB (GameFi Style) */}
              {activeTab === 'invitation' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                          <HudPanel className="p-6">
                              <div className="flex justify-between items-start mb-6">
                                  <Users size={32} className="text-gray-600" />
                                  <div className="text-right">
                                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">Network Size</div>
                                      <div className="text-3xl font-bold text-white font-mono">{user.inviteCount} / 10</div>
                                  </div>
                              </div>
                              <GameButton className="w-full flex items-center justify-center gap-2">
                                  <Copy size={14} /> COPY UPLINK CODE
                              </GameButton>
                          </HudPanel>

                          <HudPanel className="p-6">
                              <div className="flex justify-between items-start mb-6">
                                  <Share2 size={32} className="text-tech-blue" />
                                  <div className="text-right">
                                      <div className="text-[10px] text-tech-blue uppercase tracking-widest">Commission Pool</div>
                                      <div className="text-3xl font-bold text-white font-mono">+{user.invitationRewards.toFixed(1)} $mEMO</div>
                                  </div>
                              </div>
                              <GameButton 
                                  variant="accent" 
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
                              {invitees.map(invitee => (
                                  <div key={invitee.id} className="bg-white/5 border border-white/5 p-4 flex justify-between items-center hover:border-white/20 transition-colors">
                                      <div>
                                          <div className="font-bold text-white text-sm mb-1">{invitee.nickname}</div>
                                          <div className="text-[10px] text-gray-500 font-mono flex gap-3">
                                              <span className="flex items-center gap-1"><Calendar size={8} /> {invitee.inviteDate}</span>
                                              <span className="flex items-center gap-1"><Activity size={8} /> {invitee.lastActive}</span>
                                          </div>
                                      </div>
                                      <div className="text-right flex flex-col items-end">
                                          <div className="text-xs font-bold text-green-400 mb-1">
                                              +{invitee.pendingReward.toFixed(1)} <span className="text-gray-500 font-normal">Pending</span>
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                              Claimed: <span className="text-white">{invitee.claimedReward.toFixed(1)}</span>
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
    </div>
  );
};