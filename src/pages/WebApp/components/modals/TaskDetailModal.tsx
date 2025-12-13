import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Timer, XCircle } from 'lucide-react';
import { TaskRecord } from '../../types';

interface TaskDetailModalProps {
  task: TaskRecord;
  onClose: () => void;
}

/**
 * 任务详情弹窗组件
 */
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
}) => {
  const [photoRevealed, setPhotoRevealed] = useState(false);

  // Reset photo reveal when task changes
  const prevTaskId = useRef(task.id);
  useEffect(() => {
    if (prevTaskId.current !== task.id) {
      setPhotoRevealed(false);
      prevTaskId.current = task.id;
    }
  }, [task.id]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden border border-tech-blue/50 rounded-lg bg-[#0a0d14] shadow-[0_0_30px_rgba(0,243,255,0.25)]">
        <div className="absolute inset-3 border border-white/10 rounded pointer-events-none" />
        <button
          onClick={onClose}
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
                ID: {task.id}
              </div>
            </div>
            <div className="text-[11px] text-gray-500 font-mono">
              {new Date(task.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Label Summary */}
            <div className="lg:col-span-2 bg-[#0c111a] border border-white/10 rounded-md p-5 shadow-inner space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Label Summary
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                  {task.status === 'LABELED' && (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Accepted
                    </span>
                  )}
                  {task.status === 'AUDITING' && (
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                      <Timer size={12} className="animate-spin" /> Verifying
                    </span>
                  )}
                  {task.status === 'REJECTED' && (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <XCircle size={12} /> Rejected
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-white">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">
                    Emotion
                  </div>
                  <div className="font-bold text-lg">{task.emotion}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase mb-1">
                    Status
                  </div>
                  <div className="text-[13px] font-bold">
                    {task.status === 'LABELED' && (
                      <span className="text-green-500">Accepted</span>
                    )}
                    {task.status === 'AUDITING' && (
                      <span className="text-yellow-500">Verifying</span>
                    )}
                    {task.status === 'REJECTED' && (
                      <span className="text-red-500">Rejected</span>
                    )}
                  </div>
                  {task.failReason && (
                    <div className="text-[11px] text-gray-400 mt-1">
                      Reason: {task.failReason}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] text-gray-500 uppercase">
                  User Labels
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-300">
                  <div>
                    Face Clear:{' '}
                    <span className="text-white font-bold">
                      {task.draftData?.isClear === true
                        ? 'Yes'
                        : task.draftData?.isClear === false
                          ? 'No'
                          : 'N/A'}
                    </span>
                  </div>
                  <div>
                    Emotion Intensity:{' '}
                    <span className="text-white font-bold">
                      {task.draftData?.intensity ?? 'N/A'}
                    </span>
                  </div>
                  <div>
                    Natural or Pose:{' '}
                    <span className="text-white font-bold">
                      {task.draftData?.isStaged === true
                        ? 'Pose'
                        : task.draftData?.isStaged === false
                          ? 'Natural'
                          : 'N/A'}
                    </span>
                  </div>
                  <div>
                    Continuity:{' '}
                    <span className="text-white font-bold">
                      {task.draftData?.arousal ?? 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="w-full bg-[#0c111a] border border-white/10 p-4 rounded-md shadow-inner flex flex-col gap-3">
              <div className="text-[10px] text-gray-500 uppercase">
                Photo Preview
              </div>
              <div
                className={`flex-1 border border-dashed border-white/15 bg-black/40 rounded-md flex items-center justify-center min-h-[280px] text-gray-500 text-xs overflow-hidden relative ${task.imageUrl ? 'cursor-pointer' : ''}`}
                onClick={() => setPhotoRevealed(true)}
              >
                {task.imageUrl ? (
                  <>
                    <img
                      src={task.imageUrl}
                      alt="Captured"
                      className={`w-full h-full object-contain rounded-md transition-all duration-300 ${photoRevealed ? 'blur-0 opacity-100' : 'blur-sm scale-105 opacity-80'}`}
                    />
                    {!photoRevealed && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white text-[11px] bg-black/30">
                        <div className="px-3 py-1 bg-black/60 rounded-full border border-white/15">
                          Blurred for privacy
                        </div>
                        <div className="text-gray-300">
                          Tap to reveal full photo
                        </div>
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
              {task.imageUrl && !photoRevealed && (
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
  );
};

