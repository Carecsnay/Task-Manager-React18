import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: ['updateTask', taskId],
    mutationFn: async (data) => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar a tarefa');
      }
      const updatedTask = await response.json();
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
