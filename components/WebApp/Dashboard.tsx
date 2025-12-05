import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, TaskCounts, EmotionType, LeaderboardEntry, Transaction, TaskRecord, Invitee } from '../../types';
import { Crown, Clock, Share2, Zap, Coins, Copy, Trash2, Edit2, CheckCircle2, XCircle, Timer, Wallet, ExternalLink, RefreshCw, Filter, Users, Calendar } from 'lucide-react';

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

  // Filter Transactions
  const issuedTxs = history.filter(tx => tx.category === 'ISSUANCE');
  const claimedTxs = history.filter(tx => tx.category === 'CLAIM');

  return (
    <div className="min-h-screen bg-[#050509] pt-20 pb-12 px-4 md:px-8">
      
      {/* 1. Profile & Assets */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {user.nickname}
                  {user.isPro && <span className="bg-neon-purple text-black text-xs px-2 py-0.5 rounded font-bold">PRO</span>}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 font-mono bg-black/30 px-3 py-1 rounded mt-2 w-fit">
                  {user.walletAddress} <Copy size={12} className="cursor-pointer hover:text-white" />
              </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="grid grid-cols-3 gap-2 bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="text-center px-6 border-r border-white/10">
                      <div className="text-[10px] text-gray-500 font-bold mb-1">MNT</div>
                      <div className="font-mono text-sm">{user.balanceMNT.toFixed(3)}</div>
                  </div>
                  <div className="text-center px-6 border-r border-white/10">
                      <div className="text-[10px] text-gray-500 font-bold mb-1">USDT</div>
                      <div className="font-mono text-sm">{user.balanceUSDT.toFixed(2)}</div>
                  </div>
                  <div className="text-center px-6">
                      <div className="text-[10px] text-tech-blue font-bold mb-1">$mEMO</div>
                      <div className="font-mono text-sm text-tech-blue">{user.balanceMEMO.toFixed(1)}</div>
                  </div>
              </div>

              <div className="bg-tech-blue/10 border border-tech-blue/30 p-3 rounded-xl flex items-center gap-4">
                  <div>
                      <div className="text-[10px] text-tech-blue font-bold">UNCLAIMED</div>
                      <div className="font-bold text-white">+{user.pendingRewards} $mEMO</div>
                  </div>
                  <button 
                    onClick={onClaimAll}
                    disabled={user.pendingRewards <= 0}
                    className={`text-xs font-bold px-6 py-3 rounded transition-colors ${
                        user.pendingRewards > 0 
                        ? 'bg-tech-blue text-black hover:bg-white' 
                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                      CLAIM
                  </button>
              </div>
          </div>
      </div>

      {/* 2. Pro & Bonus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 bg-[#0f0f15] border border-white/10 p-4 rounded-xl flex justify-between items-center">
              <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Current Plan</div>
                  <div className="text-white font-bold">{user.isPro ? 'PRO NODE' : 'BASIC NODE'}</div>
                  {user.isPro && user.proExpiryDate && (
                      <div className="text-[10px] text-gray-600 mt-1">Ends: {new Date(user.proExpiryDate).toLocaleDateString()}</div>
                  )}
              </div>
              {!user.isPro && (
                  <button onClick={onUpgradeClick} className="text-xs bg-white text-black px-4 py-2 rounded font-bold hover:bg-tech-blue transition-colors">
                      UPGRADE
                  </button>
              )}
          </div>

          <div className="col-span-1 bg-[#0f0f15] border border-white/10 p-4 rounded-xl flex justify-between items-center">
              <div>
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Reward Rate</div>
                  <div className="text-white font-bold">{rewardPerTask} $mEMO <span className="text-xs font-normal text-gray-500">/ task</span></div>
              </div>
              <Zap size={20} className="text-yellow-500" />
          </div>

          <div className="col-span-1 bg-[#0f0f15] border border-white/10 p-4 rounded-xl flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-1">Daily Pro Bonus</div>
                  <div className="text-white font-bold text-lg">
                      {user.isPro ? (user.proPlanId === 'monthly' ? '+5' : user.proPlanId === 'quarterly' ? '+10' : '+30') : '+0'}
                  </div>
              </div>
              {user.isPro ? (
                  <button 
                    onClick={onClaimBonus}
                    disabled={hasClaimedBonus}
                    className={`relative z-10 text-xs px-6 py-2 rounded font-bold shadow-lg transform active:scale-95 transition-all ${
                        hasClaimedBonus 
                        ? 'bg-white/10 text-gray-500 cursor-not-allowed' 
                        : 'bg-neon-purple text-white hover:bg-white hover:text-black hover:shadow-neon-purple/50'
                    }`}
                  >
                      {hasClaimedBonus ? 'CLAIMED' : 'CLAIM'}
                  </button>
              ) : (
                  <span className="text-[10px] text-gray-600 border border-gray-800 px-3 py-1 rounded">LOCKED</span>
              )}
          </div>
      </div>

      {/* 3. Tasks */}
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-tech-blue" /> Today's Tasks
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
         {emotions.map((emotion) => {
             const count = taskCounts[emotion] || 0;
             const isCompleted = count >= dailyLimit;
             
             return (
                 <button
                    key={emotion}
                    onClick={() => !isCompleted && onStartTask(emotion)}
                    disabled={isCompleted}
                    className={`relative p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                        isCompleted 
                        ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed' 
                        : 'bg-surface border-white/10 hover:border-tech-blue cursor-pointer'
                    }`}
                 >
                     <div className="text-2xl">{
                        emotion === 'Happy' ? '😊' : 
                        emotion === 'Anger' ? '😡' : 
                        emotion === 'Sad' ? '😢' : 
                        emotion === 'Fear' ? '😱' : 
                        emotion === 'Disgust' ? '🤢' : 
                        emotion === 'Surprise' ? '😲' : '😐'
                     }</div>
                     <div className="text-xs font-bold text-gray-300">{emotion}</div>
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                         <div 
                            className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-tech-blue'}`} 
                            style={{ width: `${(count / dailyLimit) * 100}%` }}
                         />
                     </div>
                     <div className="text-[10px] text-gray-500">{count}/{dailyLimit}</div>
                 </button>
             );
         })}
      </div>

      {/* 4. Main Panel */}
      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden min-h-[500px]">
          <div className="flex border-b border-white/10 overflow-x-auto">
              <button 
                  onClick={() => setActiveTab('contributions')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'contributions' ? 'border-tech-blue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                  <Clock size={16} className="inline mr-2 mb-1" />
                  My Contributions
              </button>
              <button 
                  onClick={() => setActiveTab('memo_history')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'memo_history' ? 'border-tech-blue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                  <Wallet size={16} className="inline mr-2 mb-1" />
                  $mEMO History
              </button>
              <button 
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'leaderboard' ? 'border-tech-blue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                  <Crown size={16} className="inline mr-2 mb-1" />
                  Leaderboard
              </button>
              <button 
                  onClick={() => setActiveTab('invitation')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'invitation' ? 'border-tech-blue text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                  <Share2 size={16} className="inline mr-2 mb-1" />
                  Invitation
              </button>
          </div>

          <div className="p-6">
              {activeTab === 'contributions' && (
                  <div>
                      {drafts.length > 0 && (
                          <div className="mb-8">
                              <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Drafts ({drafts.length})</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {drafts.map(draft => (
                                      <div key={draft.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex gap-3 items-center group hover:border-white/30 transition-colors">
                                          <div className="w-16 h-16 bg-black rounded overflow-hidden">
                                              <img src={draft.imageUrl} className="w-full h-full object-cover opacity-70" alt="Draft" />
                                          </div>
                                          <div className="flex-1">
                                              <div className="text-sm font-bold text-white mb-1">{draft.emotion}</div>
                                              <div className="text-[10px] text-gray-500">{new Date(draft.timestamp).toLocaleString()}</div>
                                          </div>
                                          <div className="flex flex-col gap-2">
                                              <button onClick={() => onResumeTask(draft)} className="p-2 bg-tech-blue/10 text-tech-blue rounded hover:bg-tech-blue hover:text-black transition-colors" title="Resume">
                                                  <Edit2 size={14} />
                                              </button>
                                              <button onClick={() => onDeleteTask(draft.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                                                  <Trash2 size={14} />
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Submission History</h4>
                          {submittedTasks.length === 0 ? (
                              <div className="text-center py-12 text-gray-500">No submissions yet. Start a task!</div>
                          ) : (
                              <div className="space-y-3">
                                  {submittedTasks.map(task => (
                                      <div key={task.id} className="bg-[#0f0f15] border border-white/5 rounded-lg p-4 flex items-center justify-between">
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 rounded bg-black overflow-hidden border border-white/10">
                                                  <img src={task.imageUrl} className="w-full h-full object-cover" alt="Task" />
                                              </div>
                                              <div>
                                                  <div className="font-bold text-sm text-white mb-1">{task.emotion} Task</div>
                                                  <div className="text-[10px] text-gray-500 font-mono">ID: {task.id.slice(-6)}</div>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                              {task.status === 'AUDITING' && (
                                                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
                                                      <Timer size={12} className="animate-spin" /> AUDITING
                                                  </div>
                                              )}
                                              {task.status === 'LABELED' && (
                                                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                                                      <CheckCircle2 size={12} /> LABELED
                                                  </div>
                                              )}
                                              {task.status === 'REJECTED' && (
                                                  <div className="flex flex-col items-end">
                                                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/20">
                                                          <XCircle size={12} /> ERROR
                                                      </div>
                                                      <span className="text-[10px] text-red-400 mt-1">{task.failReason}</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {/* $mEMO History Tab */}
              {activeTab === 'memo_history' && (
                  <div className="space-y-6">
                      <div className="flex gap-4 border-b border-white/5 pb-4">
                          <button 
                             onClick={() => setHistoryFilter('ISSUED')}
                             className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${historyFilter === 'ISSUED' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                          >
                             ISSUED (Off-Chain)
                          </button>
                          <button 
                             onClick={() => setHistoryFilter('CLAIMED')}
                             className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${historyFilter === 'CLAIMED' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                          >
                             CLAIMED (On-Chain)
                          </button>
                      </div>

                      <div className="space-y-4">
                          {(historyFilter === 'ISSUED' ? issuedTxs : claimedTxs).length === 0 ? (
                              <div className="text-center py-12 text-gray-500">No {historyFilter.toLowerCase()} records found.</div>
                          ) : (
                              (historyFilter === 'ISSUED' ? issuedTxs : claimedTxs).map(tx => (
                                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                              tx.source === 'Label Task' ? 'bg-blue-500/20 text-blue-500' :
                                              tx.source === 'Pro Daily' ? 'bg-purple-500/20 text-purple-500' :
                                              tx.category === 'CLAIM' ? 'bg-green-500/20 text-green-500' : 
                                              'bg-yellow-500/20 text-yellow-500'
                                          }`}>
                                              {tx.source === 'Label Task' && <Zap size={14} />}
                                              {tx.source === 'Pro Daily' && <Coins size={14} />}
                                              {tx.source === 'Invitation' && <Share2 size={14} />}
                                              {tx.category === 'CLAIM' && <Wallet size={14} />}
                                          </div>
                                          <div>
                                              <div className="text-sm font-bold text-white">
                                                  {historyFilter === 'ISSUED' ? tx.source : tx.desc}
                                              </div>
                                              <div className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</div>
                                          </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-6">
                                          <div className="text-right">
                                              <div className="font-mono text-sm text-green-400">+{tx.amount} $mEMO</div>
                                              {tx.cost && <div className="text-[10px] text-gray-500">{tx.cost}</div>}
                                          </div>

                                          {historyFilter === 'CLAIMED' && (
                                              <div className="w-24 text-right">
                                                  {tx.status === 'PENDING' && (
                                                      <span className="text-xs text-yellow-500 flex items-center justify-end gap-1"><Timer size={12} className="animate-spin"/> Pending</span>
                                                  )}
                                                  {tx.status === 'SUCCESS' && tx.txHash && (
                                                      <a href={`https://explorer.mantle.xyz/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="text-xs text-tech-blue hover:underline flex items-center justify-end gap-1">
                                                          Explorer <ExternalLink size={10} />
                                                      </a>
                                                  )}
                                                  {tx.status === 'FAILED' && (
                                                      <button 
                                                        onClick={() => onRetryClaim(tx)}
                                                        className="text-xs bg-red-500/10 border border-red-500/30 text-red-500 px-2 py-1 rounded flex items-center gap-1 hover:bg-red-500 hover:text-white transition-colors"
                                                      >
                                                          <RefreshCw size={10} /> Retry
                                                      </button>
                                                  )}
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}

              {/* Leaderboard View */}
              {activeTab === 'leaderboard' && (
                  <div className="space-y-2">
                      {leaderboard.map((entry, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded ${entry.address === user.walletAddress ? 'bg-tech-blue/10 border border-tech-blue/30' : 'hover:bg-white/5'}`}>
                              <div className="flex items-center gap-4">
                                  <span className={`w-6 text-center font-bold ${idx < 3 ? 'text-yellow-500' : 'text-gray-500'}`}>#{entry.rank}</span>
                                  <span className="text-sm font-mono text-gray-300">{entry.address}</span>
                                  {entry.address === user.walletAddress && <span className="text-[10px] bg-white/10 px-1 rounded text-gray-400">YOU</span>}
                              </div>
                              <div className="font-mono text-sm text-white">{entry.totalEarned.toLocaleString()}</div>
                          </div>
                      ))}
                  </div>
              )}

              {/* Invitation View (Replaced Referral) */}
              {activeTab === 'invitation' && (
                  <div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          {/* Invite Stats */}
                          <div className="bg-white/5 p-6 rounded-xl">
                              <div className="text-gray-400 text-sm mb-1 uppercase font-bold tracking-wider">Total Invites</div>
                              <div className="text-4xl font-bold text-white mb-6">{user.inviteCount} / 10</div>
                              
                              <p className="text-gray-400 text-sm mb-6">
                                  Earn <span className="text-white font-bold">5%</span> commission on every task your invitees complete.
                              </p>
                              
                              <button className="w-full py-3 bg-white text-black font-bold rounded hover:bg-tech-blue transition-colors flex items-center justify-center gap-2">
                                  <Copy size={16} /> Copy Invite Link
                              </button>
                          </div>

                          {/* Unclaimed Invitation Rewards */}
                          <div className="bg-tech-blue/10 border border-tech-blue/30 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10 text-tech-blue">
                                  <Share2 size={100} />
                              </div>
                              <div>
                                  <div className="text-tech-blue font-bold text-sm mb-1 uppercase tracking-wider">Unclaimed Commission</div>
                                  <div className="text-3xl font-bold text-white">+{user.invitationRewards.toFixed(1)} $mEMO</div>
                              </div>
                              <button 
                                  onClick={onClaimInvitationRewards}
                                  disabled={user.invitationRewards <= 0}
                                  className={`mt-6 w-full py-3 font-bold rounded transition-colors flex items-center justify-center gap-2 ${
                                      user.invitationRewards > 0 
                                      ? 'bg-tech-blue text-black hover:bg-white' 
                                      : 'bg-white/5 text-gray-500 cursor-not-allowed'
                                  }`}
                              >
                                  <Coins size={16} /> CLAIM REWARDS
                              </button>
                          </div>
                      </div>

                      {/* Invitee List */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                              <Users size={14} /> My Network
                          </h4>
                          <div className="space-y-3">
                              {invitees.map(invitee => (
                                  <div key={invitee.id} className="bg-[#0f0f15] border border-white/5 rounded-lg p-4 flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-gray-300 font-bold">
                                              {invitee.nickname.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-sm text-white">{invitee.nickname}</div>
                                              <div className="flex gap-4 text-[10px] text-gray-500 mt-1">
                                                  <span className="flex items-center gap-1"><Calendar size={10}/> {invitee.inviteDate}</span>
                                                  <span>Active: {invitee.lastActive}</span>
                                              </div>
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