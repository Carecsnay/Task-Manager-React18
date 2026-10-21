import { useQuery } from '@tanstack/react-query';

export const useDetailsTask = (taskId) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
      if (!response.ok) throw new Error('Erro ao buscar tarefa');
      return await response.json();
    },
  });
};
