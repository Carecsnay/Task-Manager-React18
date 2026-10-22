import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useUpdateTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: taskQueriesKey.updateTask(),
    mutationFn: async (data) => {
      const { data: updatedTask } = await api.patch(`/tasks/${taskId}`, data, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return updatedTask;
    },
    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(taskQueriesKey.getAllTasks(), (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map((t) => (t.id === taskId ? updatedTask : t));
      });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      await delay(1000);
    },
  });
};
