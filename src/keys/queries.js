export const taskQueriesKey = {
  addNewTask: () => ['addTask'],
  getAllTasks: () => ['tasks'],
  getTask: (taskId) => ['task', taskId],
  updateTask: () => ['updateTask'],
  deleteTask: (taskId) => ['deleteTask', taskId],
};
