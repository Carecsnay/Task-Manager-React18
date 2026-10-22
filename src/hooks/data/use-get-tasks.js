import { useQuery } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useGetTasks = () => {
  return useQuery({
    queryKey: taskQueriesKey.getAllTasks(),
    //função chamada assim que o useQuery é "montado" similar ao useEffect.
    queryFn: async () => {
      const { data: tasks } = await api.get('/tasks');
      return tasks;
    },
  });
};
