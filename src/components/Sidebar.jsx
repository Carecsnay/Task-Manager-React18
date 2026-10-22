import HomeIcon from '../assets/icons/home.svg?react';
import TasksIcon from '../assets/icons/tasks.svg?react';
import SidebarButton from './SidebarButton';

const Sidebar = () => {
  return (
    <div className="bg-whitetext-xl h-screen w-72 min-w-72">
      <div className="space-y-4 px-8 py-6">
        <h1 className="text-xl font-semibold text-brand-primary">
          Task Manager
        </h1>
        <p>
          Um simples{' '}
          <span className="text-brand-primary">organizador de tarefas</span>
        </p>
      </div>

      <div className="flex flex-col space-y-2 px-2">
        <SidebarButton color="unselected" href="/">
          <HomeIcon />
          Início
        </SidebarButton>
        <SidebarButton color="selected" href="/tasks">
          <TasksIcon />
          Minhas Tarefas
        </SidebarButton>
      </div>
    </div>
  );
};

export default Sidebar;
