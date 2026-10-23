import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskMutationKeys } from '../../keys/mutations';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useDeleteAllTasks = () => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: taskMutationKeys.deleteAllTasks(),
    mutationFn: async (tasks) => {
      await Promise.all(tasks.map((task) => api.delete(`/tasks/${task.id}`)));
      await delay(1000);
    },
    onSuccess: () => {
      queryClient.setQueryData(taskQueriesKey.getAllTasks(), []);
    },
  });
};
