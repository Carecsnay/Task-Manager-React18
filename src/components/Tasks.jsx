import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CloudSunIcon, MoonIcon, SunIcon } from '../assets/icons';
import { useGetTasks } from '../hooks/data/use-get-tasks';
import Header from './Header';
import TaskItem from './TaskItem';
import TasksSeparator from './TasksSeparator';

const Tasks = () => {
  //atualiza parcialmente o cache de data com o cache mais atual salvo local.
  const queryClient = useQueryClient();
  const { data: tasks } = useGetTasks();

  const morningTasks = tasks?.filter((task) => task.time === 'morning');
  const afternoonTasks = tasks?.filter((task) => task.time === 'afternoon');
  const eveningTasks = tasks?.filter((task) => task.time === 'evening');

  const handleTaskCheckBoxClick = async (taskId) => {
    const currentTask = tasks?.find((task) => task.id === taskId);
    if (!currentTask) return;

    const statusTransitions = {
      not_started: {
        newStatus: 'in_progress',
        message: 'A tarefa está em progresso!',
      },
      in_progress: {
        newStatus: 'done',
        message: 'A tarefa foi finalizada!',
      },
      done: {
        newStatus: 'not_started',
        message: 'Tarefa não iniciada!',
      },
    };

    const transition = statusTransitions[currentTask.status];
    if (!transition) return;

    const { newStatus, message } = transition;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        toast.error('Erro ao atualizar o status da tarefa.');
        return;
      }

      const updatedTask = await response.json();

      queryClient.setQueryData(['tasks'], (oldTasks = []) => {
        return oldTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        );
      });

      toast.success(message);
    } catch (error) {
      toast.error('Erro ao atualizar tarefa.');
    }
  };

  return (
    <div className="w-full space-y-6 px-8 py-16">
      <Header title="Início" subtitle="Minhas tarefas" />
      <div className="rounded bg-white p-6">
        <div className="my-6 space-y-3">
          <TasksSeparator title="Manhã" icon={<SunIcon />} />
          {morningTasks?.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa foi cadastrada para o período da manhã.
            </p>
          )}
          {morningTasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckBoxClick}
            />
          ))}
        </div>

        <div className="my-6 space-y-3">
          <TasksSeparator title="Tarde" icon={<CloudSunIcon />} />
          {afternoonTasks?.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa foi cadastrada para o período da tarde.
            </p>
          )}
          {afternoonTasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckBoxClick}
            />
          ))}
        </div>

        <div className="my-6 space-y-3">
          <TasksSeparator title="Noite" icon={<MoonIcon />} />
          {eveningTasks?.length === 0 && (
            <p className="text-sm text-brand-text-gray">
              Nenhuma tarefa foi cadastrada para o período da noite.
            </p>
          )}
          {eveningTasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleCheckboxClick={handleTaskCheckBoxClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
