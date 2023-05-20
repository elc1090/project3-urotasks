import TaskText from './list-item-text';
import TaskControls from './list-item-controls';

export default function ProjectsItem({ tasksItem })
{
  return (
    <li className="tasks-list-item">
      <TaskText value={ tasksItem.content } taskID={ tasksItem.id }/>
      <TaskControls task={ tasksItem }/>
    </li>
  )
}