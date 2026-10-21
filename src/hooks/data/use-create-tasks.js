import { useMutation } from '@tanstack/react-query';

export const useCreateTasks = () => {
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
  });
};
