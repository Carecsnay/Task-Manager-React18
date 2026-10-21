import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: ['updateTask', taskId],
    mutationFn: async (data) => {
      const { data: updatedTask } = await axios.patch(
        `http://localhost:8000/tasks/${taskId}`,
        data,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return updatedTask;
    },
    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(['tasks'], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map((t) => (t.id === taskId ? updatedTask : t));
      });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      await delay(1000);
    },
  });
};
