import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';

import { toast } from 'sonner';
import { LoaderIcon } from '../assets/icons';
import './AddTaskDialog.css';
import Button from './Button';
import Input from './Input';
import InputLabel from './InputLabel';
import TimeSelect from './TimeSelect';

const AddTaskDialog = ({ isOpen, handleClose }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['addTask'],
    mutationFn: async (newTask) => {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      return response.json();
    },
  });
  const nodeRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: '',
      title: '',
      time: 'morning',
      description: '',
      status: 'not_started',
    },
  });

  const handleCloseAndReset = () => {
    handleClose();
    reset();
  };

  const handleSaveClick = async (data) => {
    const { title, time, status, description } = data;

    const newTaskData = {
      title,
      time,
      status,
      description,
    };

    try {
      mutate(newTaskData, {
        onSuccess: (savedTask) => {
          queryClient.setQueryData(['tasks'], (currentTasks) => {
            return [...currentTasks, savedTask];
          });

          handleCloseAndReset();
          toast.success('Tarefa adicionada com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao adicionar uma nova tarefa.');
        },
      });
    } catch (error) {
      toast.error('Erro ao adicionar uma nova tarefa.');
    }
  };

  return (
    <CSSTransition
      in={isOpen}
      timeout={500}
      classNames="add-task-dialog"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef}>
        {createPortal(
          <div
            className="fixed bottom-0 left-0 top-0 flex h-screen w-screen flex-col items-center justify-center backdrop-blur-sm"
            onMouseDown={handleCloseAndReset}
          >
            <div
              className="w-[336px] rounded-xl border-2 bg-white p-5 text-center shadow"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div>
                <h2 className="text-lg font-semibold text-brand-dark-blue">
                  Nova Tarefa
                </h2>
                <p className="mt-1 text-sm text-brand-text-gray">
                  Insira as informações abaixo
                </p>
              </div>

              <form onSubmit={handleSubmit(handleSaveClick)}>
                <div className="flex flex-col">
                  <Input
                    id="title"
                    label="Título"
                    placeholder="Título da tarefa"
                    errorMessage={errors?.title?.message}
                    disabled={isSubmitting}
                    {...register('title', {
                      required: 'O título da tarefa é obrigatório.',
                      validate: (value) => {
                        if (!value.trim())
                          return 'O título da tarefa não pode ser vazio.';
                      },
                    })}
                  />

                  <TimeSelect
                    errorMessage={errors?.time?.message}
                    {...register('time', {
                      required: 'O período da tarefa é obrigatório.',
                      validate: (value) => {
                        if (!value.trim())
                          return 'O período da tarefa não pode ser vazio.';
                      },
                    })}
                  />

                  <div className="flex flex-col space-y-1 text-start">
                    <InputLabel
                      htmlFor="status"
                      className="mt-4 text-sm font-semibold text-brand-dark-blue"
                    >
                      Status
                    </InputLabel>
                    <select
                      id="status"
                      defaultValue="not_started"
                      disabled={isSubmitting}
                      className="border-dark-gray rounded-lg border border-solid bg-white px-4 py-3 text-sm outline-brand-primary"
                      {...register('status', {
                        required: 'O período da tarefaé obrigatório.',
                        validate: (value) => {
                          if (!value.trim())
                            return 'O período da tarefa não pode ser vazio.';
                        },
                      })}
                    >
                      <option value="not_started">Não iniciada</option>
                      <option value="in_progress">Em progresso</option>
                      <option value="done">Concluída</option>
                    </select>
                  </div>

                  <Input
                    id="description"
                    label="Descrição"
                    placeholder="Descreva a tarefa"
                    errorMessage={errors?.description?.message}
                    {...register('description', {
                      required: 'A descrição da tarefa é obrigatória.',
                      validate: (value) => {
                        if (!value.trim())
                          return 'A descrição da tarefa não pode ser vazia.';
                      },
                    })}
                  />

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      className="w-full"
                      size="medium"
                      color="secondary"
                      onClick={handleCloseAndReset}
                    >
                      Cancelar
                    </Button>
                    <Button className="w-full" size="medium" type="submit">
                      {isSubmitting && (
                        <LoaderIcon className="h-6 w-6 animate-spin" />
                      )}
                      Salvar
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </CSSTransition>
  );
};

AddTaskDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddTaskDialog;
