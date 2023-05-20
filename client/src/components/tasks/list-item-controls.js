import React, { useState, useContext, useRef } from 'react';
import { ActiveProjectContext } from '../../app';
import { TaskTypeContext } from './lists-container';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ListItemControls({ task })
{
  const { activeProject } = useContext(ActiveProjectContext);
  const taskType = useContext(TaskTypeContext);
  const otherTaskType0 = { type: "", name: "" };
  const otherTaskType1 = { type: "", name: "" };
  let currTaskType;

  switch (taskType)
  {
    case 'todo':
      otherTaskType0.type = "doing"; otherTaskType0.name = "DOING";
      otherTaskType1.type = "done"; otherTaskType1.name = "DONE";
      currTaskType = 'todo';
      break;

    case 'doing':
      otherTaskType0.type = "todo"; otherTaskType0.name = "TO-DO";
      otherTaskType1.type = "done"; otherTaskType1.name = "DONE";
      currTaskType = 'doing';
      break;

    case 'done':
      otherTaskType0.type = "todo"; otherTaskType0.name = "TO-DO";
      otherTaskType1.type = "doing"; otherTaskType1.name = "DOING";
      currTaskType = 'done';
      break;

    default:
      break;
  }

  const moveLocationRef = useRef();

  function moveTask()
  {
    const moveLocation = moveLocationRef.current.value;
    console.log(`moved task ${task.id} from ${currTaskType} to ${moveLocation}`);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-move`, [activeProject.id, task.id, currTaskType, moveLocation ])
      .then(function(response) {console.log(response); })
      .catch(function(error) {console.log(error)});
  }

  return (
    <div className='list-item-options'>
      <div className=' option options-ellipsis'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      
      <div className=' option options-move'>
        <div className='move-icon'><FontAwesomeIcon icon={ faArrowRight }/></div>
        
        <select defaultValue={ otherTaskType1.type } ref={moveLocationRef} >
          <option value={ otherTaskType0.type }>{ otherTaskType0.name }</option>
          <option value={ otherTaskType1.type } >{ otherTaskType1.name }</option>
        </select>

        <button onClick={moveTask}>MOVE</button>
      </div>
    </div>

  )
}