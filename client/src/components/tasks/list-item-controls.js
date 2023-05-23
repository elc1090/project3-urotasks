import React, { useState, useContext, useRef } from 'react';
import { ActiveProjectContext, ReducerContext } from '../../app';
import { TaskTypeContext } from './lists-container';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowsLeftRight, faMultiply, faTag } from '@fortawesome/free-solid-svg-icons';

export default function ListItemControls({ task })
{
  const [optionFocus, setOptionFocus] = useState(false);
  const [newLocation, setNewLocation] = useState('done');
  const moveLocationRef = useRef();

  const { state, dispatch } = useContext(ReducerContext);
  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);
  const taskType0 = useContext(TaskTypeContext);
  let taskType1, taskType2;

  switch (taskType0)
  {
    case 'todo': taskType1 = "doing"; taskType2 = "done"; break;
    case 'doing': taskType1 = "todo"; taskType2 = "done"; break;
    case 'done': taskType1 = "todo";  taskType2 = "doing"; break;
    default: break;
  }

  function formatTaskType(taskTypeName)
  {
    if (taskTypeName === 'todo')
      taskTypeName = taskTypeName.slice(0, 2) + '-' + taskTypeName.slice(2)

    return taskTypeName.toUpperCase();
  }

  function moveTask()
  {
    const moveLocation = moveLocationRef.current.value;
    const placeholderActiveProject = activeProject;
    const taskList = placeholderActiveProject[taskType0];

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const taskToMove = taskList.splice(taskIndex, 1)[0];

    placeholderActiveProject[moveLocation].push(taskToMove);
    placeholderActiveProject[taskType0] = taskList;
    setActiveProject(placeholderActiveProject);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-move`, [activeProject.id, task.id, taskType0, moveLocation ])
    console.log(`moved task ${task.id} from ${taskType0} to ${moveLocation}`);
    dispatch({ type: "taskUpdated" });
  }

  function deleteTask()
  {
    const placeholderActiveProject = activeProject;
    const taskList = placeholderActiveProject[taskType0];

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    taskList.splice(taskIndex, 1);
    
    placeholderActiveProject[taskType0] = taskList;
    setActiveProject(placeholderActiveProject);
    
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-delete`, [activeProject.id, task.id, taskType0])
    dispatch({ type: "taskUpdated" });
  }

  const optionEllipsis = 'option--ellipsis:' + task.id;
  const optionTags     = 'option--tag:'      + task.id;
  const optionMove     = 'option--move:'     + task.id;
  const optionRemove   = 'option--remove:'   + task.id;
  const moveSelect     = 'move__select:'     + task.id;
  const location1      = 'location--1:'      + task.id;
  const location2      = 'location--2:'      + task.id;

  function toggleOptions(toggle)
  {
    const optionEllipsisElement = document.getElementById(optionEllipsis);
    const optionTagsElement = document.getElementById(optionTags);
    const optionMoveElement = document.getElementById(optionMove);
    const optionRemoveElement = document.getElementById(optionRemove);
   
    const moveSelectElement = document.getElementById(moveSelect);
    moveSelectElement.classList.remove('options__select--shown');

    if (toggle === 'show')
    {
      optionEllipsisElement.classList.toggle('options__ellipsis--shown');
      optionTagsElement.classList.toggle('options__tags--shown');
      optionMoveElement.classList.toggle('options__move--shown');
      optionRemoveElement.classList.toggle('options__remove--shown');
    }

    else
    {
      optionEllipsisElement.classList.remove('options__ellipsis--shown');
      optionTagsElement.classList.remove('options__tags--shown');
      optionMoveElement.classList.remove('options__move--shown');
      optionRemoveElement.classList.remove('options__remove--shown');
    }
  }

  function toggleMoveOptions()
  {
    const moveSelectElement = document.getElementById(moveSelect);
    moveSelectElement.classList.toggle('options__select--shown');
  
    setOptionFocus(!optionFocus);
  }

  function changeLocation(location, input)
  {
    const location1Element = document.getElementById(location1);
    const location2Element = document.getElementById(location2);

    if (input === 'location--1')
    {
      location1Element.classList.add('options__location--selected');
      location2Element.classList.remove('options__location--selected');
    }

    else
    {
      location1Element.classList.remove('options__location--selected');
      location2Element.classList.add('options__location--selected');
    }

    setNewLocation(location);
  }

  return (
    <div className='list-item-options' onMouseLeave={optionFocus ? () => {} : () => {toggleOptions('hide')}}>
      <div className=' option options__ellipsis' id={ optionEllipsis } onClick={ () => {toggleOptions('show')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
      
      <div className='option options__tags' id={ optionTags }>
        <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      </div>

      <div className='option options__move' id={ optionMove }>
        <div className='option__icon' onClick={toggleMoveOptions}><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
        
        <div className='options__select' id={moveSelect}>
          <input className='move__input' type='hidden' value={ newLocation } ref={ moveLocationRef } readOnly/>
          <div className='options__location' id={location1} onClick={ () => {changeLocation(taskType1, 'location--1')}}>{ formatTaskType(taskType1) }</div>
          <div className='options__location' id={location2} onClick={ () => {changeLocation(taskType2, 'location--2')}}>{ formatTaskType(taskType2) }</div>
          <button className='options__submit' onClick={moveTask}>MOVE</button>
        </div>

      </div>

      <div className='option options__remove' id={ optionRemove } onClick={deleteTask}>
        <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
      </div>
    </div>

  )
}