import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTask = (taskId) => {
  const queryClient = useQueryClient();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  return useMutation({
    mutationKey: ['deleteTask', taskId],
    mutationFn: async () => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar a tarefa.');
      }
      return true;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await delay(1000);
    },
  });
};
