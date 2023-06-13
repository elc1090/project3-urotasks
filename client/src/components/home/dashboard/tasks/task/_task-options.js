import React, { useState, useContext, useRef } from 'react';
import { ProjectsContext, ReducerContext } from '../../../../../app';
import { TaskTypeContext } from '../tasks';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowsLeftRight, faMultiply, faTag } from '@fortawesome/free-solid-svg-icons';

export default function ListItemControls({ task })
{
  const [moveOpen, setMoveOpen] = useState(false);
  const [optionsShown, setOptionsShown] = useState(false);

  const [newLocation, setNewLocation] = useState('');
  const moveLocationRef = useRef();

  const { dispatch } = useContext(ReducerContext);
  const { activeProject, setActiveProject } = useContext(ProjectsContext);
  
  const taskType = useContext(TaskTypeContext);
  let moveLocation0, moveLocation1;

  switch (taskType)
  {
    case 'todo' : moveLocation0 = "doing"; moveLocation1 = "done" ; break;
    case 'doing': moveLocation0 = "todo" ; moveLocation1 = "done" ; break;
    case 'done' : moveLocation0 = "todo" ; moveLocation1 = "doing"; break;
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
    const taskList = placeholderActiveProject.tasks;

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const taskToMove = taskList.splice(taskIndex, 1)[0];
    taskToMove.type = moveLocation;
    taskList.push(taskToMove);

    placeholderActiveProject.tasks = taskList;
    setActiveProject(placeholderActiveProject);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-move`, [activeProject.id, task.id, moveLocation ])
      .then(res => {console.log(res)})
      .catch(err => {console.log(err)})

    dispatch({ type: "taskUpdated" });
  }

  function deleteTask()
  {
    const placeholderActiveProject = activeProject;
    const taskList = placeholderActiveProject.tasks;

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    taskList.splice(taskIndex, 1);
    
    placeholderActiveProject[taskType] = taskList;
    setActiveProject(placeholderActiveProject);
    
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-delete`, [activeProject.id, task.id])
      .then(res => {console.log(res)})
      .catch(err => {console.log(err)})

    dispatch({ type: "taskUpdated" });
  }

  function toggleOptions(toggle)
  {
    if (toggle === 'toggle')
    {
      setOptionsShown(!optionsShown);

      if (moveOpen === true)
      {
        setMoveOpen(false);
        setNewLocation('');
      }
    }

    else
      setOptionsShown(false);
  }

  const optionsCol = 'options-col:' + task.id;
  if (optionsShown === true)
  {
    document.addEventListener('click', e => 
    {
      const optionsElement = document.getElementById(optionsCol);
  
      if (e.target !== optionsElement && !optionsElement?.contains(e.target))
      {
        setOptionsShown(false);
        setMoveOpen(false);
      }
    })
  }

  return (
    <div className='options' id={ optionsCol } onMouseLeave={ moveOpen ? null : () => {toggleOptions('hide')} } >
      <div className={ `option options--ellipsis ${optionsShown ? 'options--ellipsis--shown' : ''}` } onClick={ () => {toggleOptions('toggle')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
      
      <div className={ `option options--tags ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      </div>

      <div className={ `option options--move ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon' onClick={ () => {setMoveOpen(!moveOpen);} }><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
        
        <div className={ `options__select ${moveOpen ? 'options__select--shown' : ''}` }>
          <input className='move__input' type='hidden' value={ newLocation } ref={ moveLocationRef }/>
          <div className={`options__location ${newLocation === moveLocation0 ? 'options__location--selected' : ''}` } onClick={ () => {setNewLocation(moveLocation0)} }>{ formatTaskType(moveLocation0) }</div>
          <div className={`options__location ${newLocation === moveLocation1 ? 'options__location--selected' : ''}` } onClick={ () => {setNewLocation(moveLocation1)} }>{ formatTaskType(moveLocation1) }</div>
          <button className='options__submit' onClick={moveTask}>MOVE</button>
        </div>
      </div>

      <div className={ `option options--remove ${optionsShown ? 'option--shown' : ''}` } onClick={deleteTask}>
        <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
      </div>
    </div>

  )
}