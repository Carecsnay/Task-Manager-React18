import { useQuery } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useDetailsTask = (taskId) => {
  return useQuery({
    queryKey: taskQueriesKey.getTask(taskId),
    queryFn: async () => {
      const { data: task } = await api.get(`/tasks/${taskId}`);
      return task;
    },
  });
};
