import { useEffect, useRef, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const titleRef = useRef();
  const decriptionRef = useRef();
  const timeRef = useRef();
  const statusRef = useRef();

  const navigate = useNavigate();

  const titleError = errors.find((error) => error.inputError === 'title');
  const timeError = errors.find((error) => error.inputError === 'time');
  const descriptionError = errors.find(
    (error) => error.inputError === 'description'
  );

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    const newErrors = [];
    const title = titleRef.current.value;
    const time = timeRef.current.value;
    const description = decriptionRef.current.value;
    const status = statusRef.current.value;

    if (!title.trim()) {
      newErrors.push({
        inputError: 'title',
        message: 'O campo título é obrigatório.',
      });
    }

    if (!time.trim()) {
      newErrors.push({
        inputError: 'time',
        message: 'O campo horário é obrigatório.',
      });
    }

    if (!description.trim()) {
      newErrors.push({
        inputError: 'description',
        message: 'O campo descrição é obrigatório.',
      });
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return setIsLoading(false);
    }

    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, time, description, status }),
      });

      if (!response.ok) {
        toast.error('Ocorreu um erro ao atualizar a tarefa!');
        return setIsLoading(false);
      }

      setIsLoading(false);
      const newTask = await response.json();
      setTask(newTask);
      toast.success('Tarefa atualizada com sucesso!');

      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      toast.error('Erro ao conectar ao servidor.');
      setIsLoading(false);
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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`);
        const data = await response.json();
        setTask(data);
      } catch (error) {
        toast.error('Erro ao carregar os dados da tarefa.');
      }
    };

    fetchTask();
  }, [taskId]);

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

        {/* dados da tarefa */}
        {task && (
          <div className="space-y-6 rounded-xl bg-brand-white p-6">
            <div>
              <Input
                id="title"
                label="Título"
                defaultValue={task.title}
                errorMessage={titleError?.message}
                ref={titleRef}
              />
            </div>

            <div>
              <TimeSelect
                defaultValue={task.time}
                errorMessage={timeError?.message}
                ref={timeRef}
              />
            </div>

            <div>
              <Input
                id="status"
                label="Status"
                type="select"
                defaultValue={task.status || 'not_started'}
                ref={statusRef}
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
                defaultValue={task.description}
                errorMessage={descriptionError?.message}
                ref={decriptionRef}
              />
            </div>
          </div>
        )}

        <div className="flex w-full justify-end gap-3">
          <Button
            size="medium"
            color="secondary"
            disabled={isLoading}
            onClick={handleBackClick}
          >
            Cancelar
          </Button>
          <Button
            size="medium"
            color="primary"
            disabled={isLoading}
            onClick={handleSaveClick}
          >
            {isLoading && <LoaderIcon className="h-6 w-6 animate-spin" />}
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
