import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useDetailsTask = (taskId) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const { data: task } = await axios.get(
        `http://localhost:8000/tasks/${taskId}`
      );
      return task;
    },
  });
};
