import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    //função chamada assim que o useQuery é "montado" similar ao useEffect.
    queryFn: async () => {
      const { data: tasks } = await axios.get('http://localhost:8000/tasks');
      return tasks;
    },
  });
};
