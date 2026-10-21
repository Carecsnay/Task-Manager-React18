import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
  ArrowLeftIcon,
  ChevronRightIcon,
  LoaderIcon,
  TrashIcon,
} from '../assets/icons';
import Button from '../components/Button';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar';
import TimeSelect from '../components/TimeSelect';
import { useDeleteTask } from '../hooks/data/use-delete-tasks';

const TaskDetailsPage = () => {
  const queryClient = useQueryClient();
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
      if (!response.ok) throw new Error('Erro ao buscar tarefa');
      return await response.json();
    },
  });

  // Preenche o formulário quando o task é carregado
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        time: task.time,
        status: task.status,
        description: task.description,
      });
    }
  }, [task, reset]);

  const { mutate: deleteTask, isPending: deleteTaskisLoading } =
    useDeleteTask(taskId);

  const { mutate: updateTask, isPending: updateTaskIsLoading } = useMutation({
    mutationKey: ['updateTask', taskId],
    mutationFn: async (data) => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar a tarefa');
      }

      return await response.json();
    },
    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(['tasks'], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.map((t) => (t.id === taskId ? updatedTask : t));
      });

      queryClient.invalidateQueries({ queryKey: ['task', taskId] });

      toast.success('Tarefa atualizada com sucesso!');
      await delay(1000);
      handleBackClick();
    },
    onError: () => {
      toast.error('Erro ao atualizar tarefa!');
    },
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDeleteClick = () => {
    deleteTask();
  };

  const handleSaveClick = (data) => {
    updateTask(data);
  };

  const isWorking = updateTaskIsLoading || deleteTaskisLoading;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        {/* Barra do topo */}
        <div className="flex w-full justify-between">
          <div>
            <button
              onClick={handleBackClick}
              className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex items-center gap-1 text-xs">
              <Link className="cursor-pointer text-brand-text-gray" to="/">
                Minhas tarefas
              </Link>
              <ChevronRightIcon className="text-brand-text-gray" />
              <span className="font-semibold text-brand-primary">
                {task?.title}
              </span>
            </div>

            <h1 className="mt-2 text-xl font-semibold">{task?.title}</h1>
          </div>

          <Button
            className="h-fit self-end"
            color="danger"
            onClick={handleDeleteClick}
            disabled={isWorking}
          >
            <TrashIcon />
            Deletar tarefa
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSaveClick)}>
          {/* Dados da tarefa */}
          {task && (
            <div className="space-y-6 rounded-xl bg-brand-white p-6">
              <div>
                <Input
                  id="title"
                  label="Título"
                  {...register('title', {
                    required: 'O título da tarefa é obrigatório.',
                    validate: (value) => {
                      if (!value.trim())
                        return 'O título da tarefa não pode ser vazio.';
                    },
                  })}
                  errorMessage={errors?.title?.message}
                />
              </div>

              <div>
                <TimeSelect
                  {...register('time', {
                    required: 'O período da tarefa é obrigatório.',
                    validate: (value) => {
                      if (!value.trim())
                        return 'O período da tarefa não pode ser vazio.';
                    },
                  })}
                  errorMessage={errors?.time?.message}
                />
              </div>

              <div>
                <Input
                  id="status"
                  label="Status"
                  type="select"
                  {...register('status', {
                    required: 'O status da tarefa é obrigatório.',
                    validate: (value) => {
                      if (!value.trim())
                        return 'O status da tarefa não pode ser vazio.';
                    },
                  })}
                  errorMessage={errors?.status?.message}
                >
                  <option value="not_started">Não iniciada</option>
                  <option value="in_progress">Em progresso</option>
                  <option value="done">Concluída</option>
                </Input>
              </div>

              <div>
                <Input
                  id="description"
                  label="Descrição"
                  type="textarea"
                  rows={10}
                  {...register('description', {
                    required: 'A descrição da tarefa é obrigatória.',
                    validate: (value) => {
                      if (!value.trim())
                        return 'A descrição da tarefa não pode ser vazia.';
                    },
                  })}
                  errorMessage={errors?.description?.message}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex w-full justify-end gap-3">
            <Button
              size="medium"
              color="secondary"
              onClick={handleBackClick}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              size="medium"
              color="primary"
              type="submit"
              className="w-24"
              disabled={isWorking}
            >
              <div className="flex items-center justify-center gap-2">
                {isWorking ? <LoaderIcon className="animate-spin" /> : 'Salvar'}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
