import React, { useState } from 'react';

import TaskText from './_task-text';
import TaskOptions from './options/options';

export const EditingContext = React.createContext();

export default function TasksItem({ itemData })
{
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="task" id={ itemData?.id }>
      <div className='task__position'>{itemData?.position}</div>

      <EditingContext.Provider value={{ isEditing, setIsEditing }}>
        <TaskText value={ itemData?.content } taskID={ itemData?.id }/>
        <TaskOptions task={ itemData }/>
      </EditingContext.Provider>
    </li>
  )
}