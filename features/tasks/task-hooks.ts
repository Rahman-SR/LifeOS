import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';

import { cancelTaskReminder, scheduleTaskReminder } from '@/lib/notifications';

import {
  createTask,
  deleteTask,
  fetchTask,
  fetchTaskCategories,
  fetchTasks,
  fetchTodayTaskSummary,
  setTaskCompleted,
  updateTask,
} from './task-service';
import { taskKeys } from './task-query-keys';
import type {
  TaskFilter,
  TaskMutationResult,
  TaskMutationValues,
  TaskWithCategory,
} from './task-types';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

async function syncReminder(task: TaskWithCategory): Promise<string | null> {
  try {
    if (task.is_completed || !task.reminder_at || new Date(task.reminder_at).getTime() <= Date.now()) {
      await cancelTaskReminder(task.id);
    } else {
      await scheduleTaskReminder(task.id, task.title, task.reminder_at);
    }
    return null;
  } catch (error) {
    return errorMessage(error);
  }
}

async function clearFailedReminder(
  userId: string,
  task: TaskWithCategory,
  warning: string | null,
): Promise<TaskMutationResult> {
  if (!warning || !task.reminder_at) return { reminderWarning: warning, task };

  const updatedTask = await updateTask(userId, task.id, { reminder_at: null }).catch(() => ({
    ...task,
    reminder_at: null,
  }));
  return { reminderWarning: warning, task: updatedTask };
}

export function useTaskCategories(userId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchTaskCategories(userId!),
    queryKey: taskKeys.categories(userId ?? 'signed-out'),
  });
}

export function useTasks(userId: string | undefined, filter: TaskFilter) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchTasks(userId!, filter),
    queryKey: taskKeys.list(userId ?? 'signed-out', filter),
  });
}

export function useTodayTaskSummary(userId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => fetchTodayTaskSummary(userId!),
    queryKey: taskKeys.todaySummary(userId ?? 'signed-out'),
  });
}

export function useTask(userId: string | undefined, taskId: string | undefined) {
  return useQuery({
    enabled: Boolean(userId && taskId),
    queryFn: () => fetchTask(userId!, taskId!),
    queryKey: taskKeys.detail(userId ?? 'signed-out', taskId ?? 'missing'),
  });
}

export function useCreateTaskMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TaskMutationValues) => {
      const task = await createTask(userId, values);
      return clearFailedReminder(userId, task, await syncReminder(task));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(userId) }),
  });
}

export function useUpdateTaskMutation(userId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: TaskMutationValues) => {
      const task = await updateTask(userId, taskId, values);
      return clearFailedReminder(userId, task, await syncReminder(task));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(userId) }),
  });
}

type ToggleVariables = { completed: boolean; taskId: string };
type ToggleContext = { snapshots: Array<[QueryKey, unknown]> };

export function useToggleTaskMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation<TaskMutationResult, Error, ToggleVariables, ToggleContext>({
    mutationFn: async ({ completed, taskId }) => {
      const task = await setTaskCompleted(userId, taskId, completed);
      return { reminderWarning: await syncReminder(task), task };
    },
    onMutate: async ({ completed, taskId }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all(userId) });
      const snapshots = queryClient.getQueriesData({ queryKey: taskKeys.all(userId) });
      const completedAt = completed ? new Date().toISOString() : null;

      queryClient.setQueriesData({ queryKey: taskKeys.all(userId) }, (current: unknown) => {
        if (Array.isArray(current)) {
          return current.map((task: TaskWithCategory) =>
            task.id === taskId
              ? { ...task, completed_at: completedAt, is_completed: completed }
              : task,
          );
        }
        if (current && typeof current === 'object' && 'id' in current && current.id === taskId) {
          return { ...current, completed_at: completedAt, is_completed: completed };
        }
        return current;
      });

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(userId) }),
  });
}

export function useDeleteTaskMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      await deleteTask(userId, taskId);
      const reminderWarning = await cancelTaskReminder(taskId).then(
        () => null,
        (error: unknown) => errorMessage(error),
      );
      return { reminderWarning, taskId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all(userId) }),
  });
}
