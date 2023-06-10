import TaskText from './_task-text';
import TaskOptions from './_task-options';

export default function TasksItem({ itemData })
{
  return (
    <li className="task" id={ itemData?.id }>
      <TaskText value={ itemData?.content } taskID={ itemData?.id }/>
      <TaskOptions task={ itemData }/>
    </li>
  )
}