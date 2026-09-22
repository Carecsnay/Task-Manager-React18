import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TaskDetailsPage = () => {
  const [task, setTask] = useState();

  const { taskId } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'GET',
      });

      const data = await response.json();
      setTask(data);
    };
    fetchTask();
  }, [taskId]);
  return (
    <div>
      <h1>{task?.title}</h1>
      <p>{task?.description}</p>
    </div>
  );
};

export default TaskDetailsPage;
