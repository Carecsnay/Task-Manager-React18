export const taskMutationKeys = {
  addNewTask: () => ['addTask'],
  updateTask: (taskId) => ['updateTask', taskId],
  deleteTask: (taskId) => ['deleteTask', taskId],
};
