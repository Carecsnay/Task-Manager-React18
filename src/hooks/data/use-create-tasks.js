import { useMutation } from '@tanstack/react-query';

export const useCreateTasks = () => {
  const queryClient = queryClient();
  return useMutation({
    mutationKey: ['addTask'],
    mutationFn: async (newTask) => {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar uma nova tarefa');
      }
      const createdTask = await response.json();
      return createdTask;
    },
    onSuccess: (createdTask) => {
      queryClient.setQueryData(['tasks'], (currentTasks) => {
        return [...currentTasks, createdTask];
      });
    },
  });
};
