import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { TaskRecord } from '../../../types';
import { TaskDetailModal } from '../../modals/TaskDetailModal';

interface ContributionsTabProps {
  tasks: TaskRecord[];
  onResumeTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
}

const UPLOAD_PAGE_SIZE = 10;

/**
 * 贡献记录 Tab 组件
 * 显示草稿和已提交任务列表
 */
export const ContributionsTab: React.FC<ContributionsTabProps> = ({
  tasks,
  onResumeTask,
  onDeleteTask,
}) => {
  const [uploadPage, setUploadPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);

  const drafts = tasks.filter((t) => t.status === 'DRAFT');
  const submittedTasks = tasks.filter((t) => t.status !== 'DRAFT');
  const uploadTotalPages = Math.max(
    1,
    Math.ceil(submittedTasks.length / UPLOAD_PAGE_SIZE),
  );

  return (
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
                uploadPage * UPLOAD_PAGE_SIZE,
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-12 items-center text-xs px-4 py-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="col-span-2 font-mono text-gray-400">
                    {new Date(task.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="col-span-3 font-bold text-white">
                    {task.emotion}
                  </div>
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
                onClick={() =>
                  setUploadPage((p) => Math.min(uploadTotalPages, p + 1))
                }
                disabled={uploadPage === uploadTotalPages}
                className={`px-3 py-1 text-[11px] font-mono rounded border border-white/10 ${uploadPage === uploadTotalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:border-tech-blue/50 hover:text-tech-blue'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

