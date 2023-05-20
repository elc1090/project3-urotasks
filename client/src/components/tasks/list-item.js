import TaskText from './list-item-text';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ tasksItem })
{
  return (
    <li className="tasks-list-item">
      <TaskText value={ tasksItem.content } taskID={ tasksItem.id }/>
      <div className="list-item-options"><FontAwesomeIcon icon={ faPencil }/></div>
    </li>
  )
}