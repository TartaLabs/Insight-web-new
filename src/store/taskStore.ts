import { create } from 'zustand';
import type { Task } from '../services/model/types';
import type { TaskRecord, EmotionType } from '../types';
import { apiTask } from '../services/api';

// 统一的任务流状态：当用户正在进行任务时，此对象存在
// apiTask 和 draft 互斥：新任务时只有 apiTask，恢复草稿时只有 draft
export interface ActiveTaskFlow {
  apiTask?: Task; // 新任务时存在
  draft?: TaskRecord; // 恢复草稿时存在
}

// 从 activeTaskFlow 获取 emotion（供组件使用）
// 现在 EmotionType 与 API 类型统一，无需映射
export const getEmotionFromTaskFlow = (flow: ActiveTaskFlow): EmotionType => {
  if (flow.draft) return flow.draft.emotion;
  if (flow.apiTask) return flow.apiTask.emotion_type;
  throw new Error('Invalid ActiveTaskFlow: neither draft nor apiTask exists');
};

interface TaskState {
  // API Tasks (from server)
  tasks: Task[];
  claimedAt: number;

  // Local Task Records (drafts, submitted, etc.)
  taskRecords: TaskRecord[];

  // Active task flow state (简化为单一状态)
  activeTaskFlow: ActiveTaskFlow | null;

  // Loading state
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // API methods
  fetchDailyTasks: () => Promise<void>;
  updateTasks: (tasks: Task[], claimedAt: number) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Task flow handlers
  startTask: (task: Task) => void;
  resumeTask: (task: TaskRecord) => void;
  cancelTask: () => void;
  saveDraft: (record: TaskRecord) => void;
  submitTask: (record: TaskRecord, onRewardIssued?: (amount: number) => void) => void;
  deleteTaskRecord: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // API Tasks
  tasks: [],
  claimedAt: 0,

  // Local Task Records
  taskRecords: [],

  // Active task flow state (简化为单一状态)
  activeTaskFlow: null,

  // Loading state
  loading: false,
  error: null,
  initialized: false,

  fetchDailyTasks: async () => {
    // 避免重复请求
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const response = await apiTask.getDailyTasks();
      set({
        tasks: response.data.tasks,
        claimedAt: response.data.claimed_at,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch daily tasks';
      set({ error: errorMessage, loading: false, initialized: true });
    }
  },

  updateTasks: (tasks: Task[], claimedAt: number) => set({ tasks, claimedAt }),

  addTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId: string, updates: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    })),

  removeTask: (taskId: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  reset: () =>
    set({
      tasks: [],
      claimedAt: 0,
      taskRecords: [],
      activeTaskFlow: null,
      loading: false,
      error: null,
      initialized: false,
    }),

  // Task flow handlers
  startTask: (task: Task) => {
    set({ activeTaskFlow: { apiTask: task } });
  },

  resumeTask: (draft: TaskRecord) => {
    set({ activeTaskFlow: { draft } });
  },

  cancelTask: () => {
    set({ activeTaskFlow: null });
  },

  saveDraft: (record: TaskRecord) => {
    set((state) => {
      const existing = state.taskRecords.findIndex((t) => t.id === record.id);
      if (existing !== -1) {
        const updated = [...state.taskRecords];
        updated[existing] = record;
        return {
          taskRecords: updated,
          activeTaskFlow: null,
        };
      }
      return {
        taskRecords: [record, ...state.taskRecords],
        activeTaskFlow: null,
      };
    });
  },

  submitTask: (record: TaskRecord, onRewardIssued?: (amount: number) => void) => {
    set((state) => {
      // Update task records
      const filtered = state.taskRecords.filter((t) => t.id !== record.id);
      const updatedRecords = [{ ...record, status: 'AUDITING' as const }, ...filtered];

      return {
        taskRecords: updatedRecords,
        activeTaskFlow: null,
      };
    });

    // Simulate audit process
    setTimeout(() => {
      const passed = Math.random() > 0.2;

      set((state) => ({
        taskRecords: state.taskRecords.map((t) => {
          if (t.id === record.id) {
            return {
              ...t,
              status: passed ? ('LABELED' as const) : ('REJECTED' as const),
              failReason: passed ? undefined : 'Blurry or Incorrect Emotion',
            };
          }
          return t;
        }),
      }));

      if (passed && onRewardIssued) {
        onRewardIssued(record.reward);
      }
    }, 5000);
  },

  deleteTaskRecord: (id: string) => {
    set((state) => ({
      taskRecords: state.taskRecords.filter((t) => t.id !== id),
    }));
  },
}));
