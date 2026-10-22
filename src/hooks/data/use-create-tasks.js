import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useCreateTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: taskQueriesKey.getAllTasks(),
    mutationFn: async (newTask) => {
      //data é um pacote do axio com as informações inseridas.
      const { data: createdTask } = await api.post('/tasks', newTask, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      return createdTask;
    },
    onSuccess: (createdTask) => {
      queryClient.setQueryData(taskQueriesKey.getAllTasks(), (currentTasks) => {
        return [...currentTasks, createdTask];
      });
    },
  });
};
