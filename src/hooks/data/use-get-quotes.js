import { useQuery } from '@tanstack/react-query';
import { taskQueriesKey } from '../../keys/queries';
import { api } from '../../lib/axios';

export const useGetQuotes = () => {
  return useQuery({
    queryKey: taskQueriesKey.getAllQuotes(),
    queryFn: async () => {
      const { data } = await api.get('/quotes');
      return data;
    },
  });
};
