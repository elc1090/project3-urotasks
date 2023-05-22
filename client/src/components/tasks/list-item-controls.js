import React, { useState, useContext, useRef } from 'react';
import { ActiveProjectContext } from '../../app';
import { TaskTypeContext } from './lists-container';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function ListItemControls({ task })
{
  const { activeProject } = useContext(ActiveProjectContext);
  const taskType = useContext(TaskTypeContext);
  const otherTaskType0 = { type: "", name: "" };
  const otherTaskType1 = { type: "", name: "" };

  switch (taskType)
  {
    case 'todo':
      otherTaskType0.type = "doing"; otherTaskType0.name = "DOING";
      otherTaskType1.type = "done"; otherTaskType1.name = "DONE";
      break;

    case 'doing':
      otherTaskType0.type = "todo"; otherTaskType0.name = "TO-DO";
      otherTaskType1.type = "done"; otherTaskType1.name = "DONE";
      break;

    case 'done':
      otherTaskType0.type = "todo"; otherTaskType0.name = "TO-DO";
      otherTaskType1.type = "doing"; otherTaskType1.name = "DOING";
      break;

    default:
      break;
  }

  const moveLocationRef = useRef();

  function moveTask()
  {
    const moveLocation = moveLocationRef.current.value;
    console.log(`moved task ${task.id} from ${taskType} to ${moveLocation}`);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-move`, [activeProject.id, task.id, taskType, moveLocation ])
      .then(function(response) {console.log(response);})
      .catch(function(error) {console.log(error)});
  }

  function deleteTask()
  {
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-delete`, [activeProject.id, task.id, taskType])
    .then(function(response) {console.log(response);})
    .catch(function(error) {console.log(error)});

    console.log(`task ${task.id} deleted`);
  }

  const optionEllipsis = 'option--ellipsis:' + task.id;
  const optionMove = 'option--move:' + task.id;
  const optionRemove = 'option--remove:' + task.id;

  function toggleOptions(toggle)
  {
    const optionMoveElement = document.getElementById(optionMove);
    const optionRemoveElement = document.getElementById(optionRemove);

    if (toggle === 'show')
    {
      optionMoveElement.classList.toggle('options__move--shown');
      optionRemoveElement.classList.toggle('options__remove--shown');
    }

    else
    {
      optionMoveElement.classList.remove('options__move--shown');
      optionRemoveElement.classList.remove('options__remove--shown');
    }
  }

  return (
    <div className='list-item-options' onMouseLeave={ () => {toggleOptions('hide')} }>
      <div className=' option options__ellipsis' id={ optionEllipsis } onClick={ () => {toggleOptions('show')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
      
      <div className='option options__move' id={ optionMove }>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowRight }/></div>
        
        <select className='move__child' defaultValue={ otherTaskType1.type } ref={moveLocationRef} >
          <option value={ otherTaskType0.type }>{ otherTaskType0.name }</option>
          <option value={ otherTaskType1.type } >{ otherTaskType1.name }</option>
        </select>

        <button className='move__child' onClick={moveTask}>MOVE</button>
      </div>

      <div className='option options__remove' id={ optionRemove } onClick={deleteTask}>
        <div className='option__icon'><FontAwesomeIcon icon={ faTrashCan }/></div>
      </div>
    </div>

  )
}