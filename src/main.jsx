import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import TaskDetailsPage from './pages/TaskDetails.jsx';
import TasksPage from './pages/Tasks.jsx';
import HomePage from './pages/home.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/tasks',
    element: <TasksPage />,
  },
  {
    path: `/task/:taskId`,
    element: <TaskDetailsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            color: '#35383E',
          },
        }}
      />
      <RouterProvider router={router} />
    </React.StrictMode>
  </QueryClientProvider>
);
