import TaskText from './_task-text';
import TaskOptions from './_task-options';

export default function TasksItem({ itemData })
{
  return (
    <li className="task" id={ itemData?.id }>
      <div className='task__position'>{itemData?.position}</div>
      <TaskText value={ itemData?.content } taskID={ itemData?.id }/>
      <TaskOptions task={ itemData }/>
    </li>
  )
}