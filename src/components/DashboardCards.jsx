import { LoaderIcon, Tasks2Icon, TasksIcon } from '../assets/icons';
import { useGetTasks } from '../hooks/data/use-get-tasks';
import DashboardCard from './DashboardCard';

const DashboardCards = () => {
  const { data: tasks } = useGetTasks();

  const inProgressTasks = tasks?.filter(
    (task) => task.status === 'in_progress'
  ).length;
  const notStartedTasks = tasks?.filter(
    (task) => task.status === 'not_started'
  ).length;
  const finishedTasks = tasks?.filter((task) => task.status === 'done').length;

  return (
    <div className="grid grid-cols-4 gap-9">
      <DashboardCard
        icon={<Tasks2Icon />}
        count={tasks?.length}
        contentText="Tarefas disponíveis"
      />
      <DashboardCard
        icon={<TasksIcon />}
        count={finishedTasks}
        contentText="Tarefas concluídas"
      />
      <DashboardCard
        icon={<LoaderIcon />}
        count={inProgressTasks}
        contentText="Tarefas em andamento"
      />
      <DashboardCard
        icon={<LoaderIcon />}
        count={notStartedTasks}
        contentText="Tarefas não iniciadas"
      />
    </div>
  );
};

export default DashboardCards;
