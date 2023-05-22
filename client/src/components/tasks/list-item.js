import TaskText from './list-item-text';
import TaskControls from './list-item-controls';

export default function ProjectsItem({ tasksItem })
{
  return (
    <li className="tasks-list-item" id={tasksItem.id}>
      <TaskText value={ tasksItem.content } taskID={ tasksItem.id }/>
      <TaskControls task={ tasksItem }/>
    </li>
  )
}