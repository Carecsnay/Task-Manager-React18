import { useQuery } from '@tanstack/react-query';

export const useGetTasks = () => {
  return useQuery({
    //id único, recomenda-se colocar em colchetes
    queryKey: ['tasks'],
    //função chamada assim que o useQuery é "montado" similar ao useEffect.
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'GET',
      });
      const tasks = await response.json();
      //data recebe o que eu retornar aqui.
      return tasks;
    },
  });
};
