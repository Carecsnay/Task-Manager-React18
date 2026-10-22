import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    //função chamada assim que o useQuery é "montado" similar ao useEffect.
    queryFn: async () => {
      const { data: tasks } = await api.get('/tasks');
      return tasks;
    },
  });
};
