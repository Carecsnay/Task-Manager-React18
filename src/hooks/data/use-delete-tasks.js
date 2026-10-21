import { useMutation } from '@tanstack/react-query';

export const useDeleteTask = (taskId) => {
  return useMutation({
    mutationKey: ['deleteTask', taskId],
    mutationFn: async () => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar tarefa no servidor.');
      }
    },
  });
};
