import {
  GlassWaterIcon,
  LoaderIcon,
  Tasks2Icon,
  TasksIcon,
} from '../assets/icons';
import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useGetTasks } from '../hooks/data/use-get-tasks';

const HomePage = () => {
  const { data: tasks } = useGetTasks();

  const inProgressTasks = tasks?.filter(
    (task) => task.status === 'in_progress'
  ).length;
  const notStartedTasks = tasks?.filter(
    (task) => task.status === 'not_started'
  ).length;
  const finishedTasks = tasks?.filter((task) => task.status === 'done').length;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <Header title="Início" subtitle="Minhas tarefas" />
        <div className="grid grid-cols-5 gap-9">
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
            icon={'X'}
            count={notStartedTasks}
            contentText="Tarefas não iniciadas"
          />
          <DashboardCard
            icon={<GlassWaterIcon />}
            count={1}
            contentText="Água"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
