import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useDeleteTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: taskQueriesKey.deleteTask(taskId),
    mutationFn: async () => {
      const { data: deletedTask } = await api.delete(`/tasks/${taskId}`);
      await delay(1000);
      return deletedTask;
    },
    onSuccess: async () => {
      queryClient.setQueryData(taskQueriesKey.getAllTasks(), (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.filter((task) => String(task.id) !== String(taskId));
      });
    },
  });
};
