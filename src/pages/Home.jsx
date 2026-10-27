import DashboardCards from '../components/DashboardCards';
import DashboardGrid from '../components/DashboardGrid';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskItem from '../components/TaskItem';
import { useGetTasks } from '../hooks/data/use-get-tasks';

const HomePage = () => {
  const { data: tasks } = useGetTasks();
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full space-y-6 px-8 py-16">
        <Header title="Início" subtitle="Minhas tarefas" />
        <DashboardCards />
        <div className="grid grid-cols-2">
          <DashboardGrid
            title="Tarefas"
            subtitle="Resumo das tarefas disponíveis"
          >
            <div className="space-y-3">
              {tasks?.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </div>
          </DashboardGrid>
          <DashboardGrid title="Frases motivacionais">Tasks</DashboardGrid>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
