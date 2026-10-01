import { useEffect, useState } from 'react';
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

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
        const data = await response.json();
        setTask(data);

        //pode passar só o (data) tbm
        reset({
          title: data?.title,
          time: data?.time,
          status: data?.status,
          description: data?.description,
        });
      } catch (error) {
        toast.error('Erro ao carregar os dados da tarefa.');
      }
    };

    fetchTask();
  }, [taskId, reset]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSaveClick = async (data) => {
    const { title, time, status, description } = data; //opcional, pois o "data" já retorna a estrutura completinha

    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, time, description, status }), //poderia passar só (data)
      });

      if (!response.ok) {
        return toast.error('Ocorreu um erro ao atualizar a tarefa!');
      }

      await delay(1000);

      const newTask = await response.json();
      setTask(newTask);
      toast.success('Tarefa atualizada com sucesso!');
      navigate(-1);
    } catch (error) {
      toast.error('Erro ao conectar ao servidor.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return toast.error('Ocorreu um erro ao deletar a tarefa!');
      }

      toast.success('Tarefa deletada com sucesso!');
      navigate(-1);
    } catch (error) {
      toast.error('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        {/* barra do topo */}
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
          >
            <TrashIcon />
            Deletar tarefa
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleSaveClick)}>
          {/* dados da tarefa */}
          {task && (
            <div className="space-y-6 rounded-xl bg-brand-white p-6">
              <div>
                <Input
                  id="title"
                  label="Título"
                  defaultValue={task.title}
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
                  defaultValue={task.time}
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
                  defaultValue={task.status || 'not_started'}
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
                  defaultValue={task.description}
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

          <div className="flex w-full justify-end gap-3">
            <Button size="medium" color="secondary" onClick={handleBackClick}>
              Cancelar
            </Button>
            <Button
              size="medium"
              color="primary"
              type="submit"
              className={'w-24'}
              disabled={isSubmitting}
            >
              {isSubmitting && <LoaderIcon className="animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
