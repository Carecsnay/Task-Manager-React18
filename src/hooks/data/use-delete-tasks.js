import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export const useDeleteTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: ['deleteTask', taskId],
    mutationFn: async () => {
      const { data: deletedTask } = await api.delete(`/tasks/${taskId}`);
      await delay(1000);
      return deletedTask;
    },
    onSuccess: async () => {
      queryClient.setQueryData(['tasks'], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.filter((task) => String(task.id) !== String(taskId));
      });
    },
  });
};
