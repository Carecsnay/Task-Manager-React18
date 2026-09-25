import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import { LoaderIcon } from '../assets/icons';
import './AddTaskDialog.css';
import Button from './Button';
import Input from './Input';
import TimeSelect from './TimeSelect';

const AddTaskDialog = ({
  isOpen,
  handleClose,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs para acessar os elementos HTML
  const nodeRef = useRef(null);
  const titleRef = useRef(null);
  const decriptionRef = useRef(null);
  const timeRef = useRef(null);

  // Função para limpar os inputs e erros
  const clearForm = () => {
    setErrors([]);
    if (titleRef.current) titleRef.current.value = '';
    if (decriptionRef.current) decriptionRef.current.value = '';
    if (timeRef.current) timeRef.current.value = '';
  };

  const handleCloseAndReset = () => {
    clearForm();
    handleClose();
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    const newErrors = [];
    const title = titleRef.current?.value || '';
    const description = decriptionRef.current?.value || '';
    const time = timeRef.current?.value || '';

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
      setIsLoading(false);
      return;
    }

    const newTask = {
      id: uuidv4(),
      title,
      time,
      description,
      status: 'not_started',
    };

    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        setIsLoading(false);
        return onSubmitError();
      }

      const savedTask = await response.json();

      setIsLoading(false);
      clearForm();
      onSubmitSuccess(savedTask);
      handleClose();
    } catch (error) {
      setIsLoading(false);
      onSubmitError();
    }
  };

  const titleError = errors.find((error) => error.inputError === 'title');
  const timeError = errors.find((error) => error.inputError === 'time');
  const descriptionError = errors.find(
    (error) => error.inputError === 'description'
  );

  return (
    <CSSTransition
      in={isOpen}
      nodeRef={nodeRef}
      timeout={500}
      classNames="add-task-dialog"
      unmountOnExit
    >
      <div>
        {createPortal(
          <div
            ref={nodeRef}
            className="fixed bottom-0 left-0 top-0 flex h-screen w-screen flex-col items-center justify-center backdrop-blur-sm"
            onClick={handleCloseAndReset}
          >
            <div
              className="w-[336px] rounded-xl border-2 bg-white p-5 text-center shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h2 className="text-lg font-semibold text-brand-dark-blue">
                  Nova Tarefa
                </h2>
                <p className="mt-1 text-sm text-brand-text-gray">
                  Insira as informações abaixo
                </p>
              </div>

              <div className="flex flex-col">
                <Input
                  id="title"
                  label="Título"
                  placeholder="Título da tarefa"
                  errorMessage={titleError?.message}
                  disabled={isLoading}
                  ref={titleRef}
                />

                <TimeSelect errorMessage={timeError?.message} ref={timeRef} />

                <Input
                  id="description"
                  label="Descrição"
                  placeholder="Descreva a tarefa"
                  disabled={isLoading}
                  errorMessage={descriptionError?.message}
                  ref={decriptionRef}
                />

                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button
                    className="w-full"
                    size="medium"
                    color="secondary"
                    onClick={handleCloseAndReset}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="w-full"
                    size="medium"
                    onClick={handleSaveClick}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <LoaderIcon className="h-6 w-6 animate-spin" />
                    )}
                    Salvar
                  </Button>
                </div>
              </div>
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
  onSubmitSuccess: PropTypes.func.isRequired,
  onSubmitError: PropTypes.func.isRequired,
};

export default AddTaskDialog;
