import TaskText from './task-text';
import TaskControls from './task-controls';

export default function TasksItem({ itemData })
{
  return (
    <li className="tasks-list-item" id={ itemData?.id }>
      <TaskText value={ itemData?.content } taskID={ itemData?.id }/>
      <TaskControls task={ itemData }/>
    </li>
  )
}