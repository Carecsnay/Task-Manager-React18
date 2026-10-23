import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { toast } from 'sonner';

import { AddIcon, TrashIcon } from '../assets/icons';
import { useDeleteAllTasks } from '../hooks/data/use-delete-all-tasks';
import { taskQueriesKey } from '../keys/queries';
import AddTaskDialog from './AddTaskDialog';
import Button from './Button';

const Header = ({ title, subtitle }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteAllTasks, isPending: isDeletingAll } =
    useDeleteAllTasks();
  const handleCleanTasks = () => {
    const tasks = queryClient.getQueryData(taskQueriesKey.getAllTasks()) || [];
    if (tasks.length === 0) return;

    deleteAllTasks(tasks, {
      onSuccess: () => {
        toast.success('Todas as tarefas foram limpas com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao limpar as tarefas!');
      },
    });
  };

  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-xl font-semibold text-brand-primary">{title}</h2>
        <span className="text-sm font-semibold">{subtitle}</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          color="ghost"
          icon={<TrashIcon />}
          onClick={handleCleanTasks}
          disabled={isDeletingAll}
        >
          Limpar Tarefas
        </Button>
        <Button icon={<AddIcon />} onClick={() => setDialogIsOpen(true)}>
          Nova Tarefa
        </Button>
        <AddTaskDialog
          isOpen={dialogIsOpen}
          handleClose={() => setDialogIsOpen(false)}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default Header;
