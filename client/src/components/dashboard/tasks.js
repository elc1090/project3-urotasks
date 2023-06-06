 import TasksContainer from '../tasks/tasks-container';

export default function Tasks()
{
  return (
    <div className="dashboard-tasks" id="dashboard-tasks">
      <TasksContainer taskType="todo"/>
      <TasksContainer taskType="doing"/>
      <TasksContainer taskType="done"/>
    </div>
  )
}