 import TasksContainer from '../tasks/tasks-container';

export default function Tasks()
{
  return (
    <div className="tasks" id="tasks">
      <TasksContainer taskType="todo"/>
      <TasksContainer taskType="doing"/>
      <TasksContainer taskType="done"/>
    </div>
  )
}