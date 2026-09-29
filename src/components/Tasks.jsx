import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AddIcon,
  CloudSunIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
} from '../assets/icons';
import AddTaskDialog from './AddTaskDialog';
import Button from './Button';
import TaskItem from './TaskItem';
import TasksSeparator from './TasksSeparator';

const Tasks = () => {
  //atualiza parcialmente o cache de data com o cache mais atual salvo local.
  const queryClient = useQueryClient();
  const { data: tasks } = useQuery({
    queryKey: 'tasks', //id único
    //função chamada assim que o useQuery é "montado" similar ao useEffect.
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/tasks');
      const tasks = await response.json();
      return tasks; //data recebe o que eu retornar aqui.
    },
  });
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const morningTasks = tasks?.filter((task) => task.time === 'morning');
  const afternoonTasks = tasks?.filter((task) => task.time === 'afternoon');
  const eveningTasks = tasks?.filter((task) => task.time === 'evening');

  const handleTaskCheckBoxClick = async (taskId) => {
    const currentTask = tasks.find((task) => task.id === taskId);
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
        message: 'Tarefa marcada como não iniciada!',
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

      tasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );

      toast.success(message);
    } catch (error) {
      toast.error('Erro de conexão ao atualizar tarefa.');
    }
  };

  const onTaskSubmitSuccess = async (task) => {
    //atualizar o cache da queryKey
    await queryClient.setQueriesData('tasks', (currentTasks) => {
      return [...currentTasks, task];
    });
    toast.success('Tarefa adicionada com sucesso!');
  };

  const onTaskSubmitError = () => {
    return toast.error('Não foi possível adicionar a tarefa, tente novamente!');
  };

  const onDeleteTaskSuccess = async (taskId) => {
    //atualizar o cache da queryKey filter
    await queryClient.setQueriesData('tasks', (currentTasks) => {
      return currentTasks.filter((task) => task.id !== taskId);
    });
    toast.success('A tarefa foi removida com sucesso!');
  };

  const handleCleanTasks = async () => {
    await Promise.all(
      tasks.map((task) =>
        fetch(`http://localhost:8000/tasks/${task.id}`, {
          method: 'DELETE',
        })
      )
    );
  };

  return (
    <div className="w-full space-y-6 px-8 py-16">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand-primary">Início</h2>
          <span className="text-sm font-semibold">Minhas tarefas</span>
        </div>
        <div className="flex items-center gap-3">
          <Button color="ghost" icon={<TrashIcon />} onClick={handleCleanTasks}>
            Limpar Tarefas
          </Button>
          <Button icon={<AddIcon />} onClick={() => setDialogIsOpen(true)}>
            Nova Tarefa
          </Button>
          <AddTaskDialog
            isOpen={dialogIsOpen}
            handleClose={() => setDialogIsOpen(false)}
            onSubmitSuccess={onTaskSubmitSuccess}
            onSubmitError={onTaskSubmitError}
          />
        </div>
      </div>

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
              onDeleteClick={onDeleteTaskSuccess}
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
              onDeleteClick={onDeleteTaskSuccess}
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
              onDeleteClick={onDeleteTaskSuccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
