import { useEffect, useState } from 'react';
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
  const [tasks, setTasks] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:8000/tasks');
      const tasks = await response.json();
      setTasks(tasks);
    };

    fetchTasks();
  }, []);

  const morningTasks = tasks.filter((task) => task.time === 'morning');
  const afternoonTasks = tasks.filter((task) => task.time === 'afternoon');
  const eveningTasks = tasks.filter((task) => task.time === 'evening');

  const handleTaskCheckBoxClick = (taskId) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;

      if (task.status === 'done') {
        toast.success('Tarefa não iniciada!');
        return { ...task, status: 'not_started' };
      }

      if (task.status === 'not_started') {
        toast.success('A tarefa está em progresso!');
        return { ...task, status: 'in_progress' };
      }

      if (task.status === 'in_progress') {
        toast.success('A tarefa foi finalizada!');
        return { ...task, status: 'done' };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const onTaskSubmitSuccess = async (task) => {
    setTasks([...tasks, task]);
    toast.success('Tarefa adicionada com sucesso!');
  };

  const onTaskSubmitError = () => {
    return toast.error('Não foi possível adicionar a tarefa, tente novamente!');
  };

  const onDeleteTaskSuccess = async (taskId) => {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(newTasks);
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
    setTasks([]);
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
          {morningTasks.map((task) => (
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
          {afternoonTasks.map((task) => (
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
          {eveningTasks.map((task) => (
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
