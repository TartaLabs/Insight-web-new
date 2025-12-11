import { create } from 'zustand';
import type { Task } from '../services/model/types';
import { apiTask } from '../services/api';

interface TaskState {
  tasks: Task[];
  claimedAt: number;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchDailyTasks: () => Promise<void>;
  updateTasks: (tasks: Task[], claimedAt: number) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  claimedAt: 0,
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

  reset: () => set({ tasks: [], claimedAt: 0, loading: false, error: null, initialized: false }),
}));
