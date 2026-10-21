import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['addTask'],
    mutationFn: async (newTask) => {
      //data é um pacote do axio com as informações inseridas.
      const { data: createdTask } = await axios.post(
        'http://localhost:8000/tasks',
        newTask,
        {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        }
      );

      return createdTask;
    },
    onSuccess: (createdTask) => {
      queryClient.setQueryData(['tasks'], (currentTasks) => {
        return [...currentTasks, createdTask];
      });
    },
  });
};
