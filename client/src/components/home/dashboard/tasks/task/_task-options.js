import React, { useState, useContext, useRef } from 'react';
import { ProjectsContext, ReducerContext } from '../../../../../app';
import { TaskTypeContext } from '../tasks';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTag, faArrowsLeftRight, faArrowUp, faArrowDown, faMultiply } from '@fortawesome/free-solid-svg-icons';

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
    default: break;
  }

  function formatTaskType(taskTypeName)
  {
    if (taskTypeName === 'todo')
      taskTypeName = taskTypeName.slice(0, 2) + '-' + taskTypeName.slice(2)

    return taskTypeName.toUpperCase();
  }

  function updateTaskType()
  {
    const newLocation = moveLocationRef.current.value;
    const activeProjectCopy = activeProject;
    const taskList = activeProjectCopy.tasks;

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const taskToMove = taskList.splice(taskIndex, 1)[0];
    
    let greatestPosition = 0;
    for (let i = 0; i < activeProject.tasks.length; i++)
      if (activeProject.tasks[i].type === newLocation && activeProject.tasks[i].position > greatestPosition)
        greatestPosition = activeProject.tasks[i].position

    const locations = { old: taskType, new: newLocation };
    const positions = { old: taskToMove.position, new: greatestPosition + 1 };
    
    taskToMove.type = locations.new;
    taskToMove.position = positions.new;
    taskList.push(taskToMove);

    for (let i = 0; i < taskList.length ; i++)
      if (taskList[i].type === taskType && taskList[i].position > positions.old)
        taskList[i].position = taskList[i].position - 1;

    activeProjectCopy.tasks = taskList;
    setActiveProject(activeProjectCopy);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update-type`, [activeProject.id, task.id, locations, positions])
      .then( res => {console.log(res)} )
      .catch( err => {console.log(err) })

    dispatch({ type: "taskUpdated" });
  }

  function updateTaskPosition(direction)
  { 
    const filteredTaskList = activeProject.tasks.filter(taskObj => taskObj.type === taskType);
    const updatedTask = filteredTaskList.find(taskObj => taskObj.id === task.id);
    const lastTaskPos = Math.max(...filteredTaskList.map(taskObj => taskObj.position));
   
    if (direction === 'up')
    {
      if (updatedTask.position === 1)
        return
      
      const otherTask = filteredTaskList.find(taskObj => taskObj.position === updatedTask.position - 1);
    
      const taskList = activeProject.tasks.map(taskObj => 
      {
        if (taskObj.id === updatedTask.id)
          taskObj.position--;

        else if (taskObj.id === otherTask.id)
          taskObj.position++;
        
        return taskObj;
      })

      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update-position`, [updatedTask.id, otherTask.id, 'up'])
        .then(res => 
        {
          console.log(res);
          setActiveProject({ ...activeProject, tasks: taskList });
        })
        .catch( err => {console.log(err)} );
    }

    else if (direction === 'down')
    {
      if (updatedTask.position === lastTaskPos)
        return;

      const otherTask = filteredTaskList.find(taskObj => taskObj.position === updatedTask.position + 1);
      
      const taskList = activeProject.tasks.map(taskObj => 
      {
        if (taskObj.id === updatedTask.id)
          taskObj.position++;

        else if (taskObj.id === otherTask.id)
          taskObj.position--;
        
        return taskObj;
      })

      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update-position`, [updatedTask.id, otherTask.id, 'down'])
        .then(res => 
        {
          console.log(res);
          setActiveProject({ ...activeProject, tasks: taskList });
        })
        .catch( err => {console.log(err)} );
    }

    setOptionsShown(false);
    setMoveOpen(false);
    setNewLocation('');
  }

  function deleteTask()
  {
    const activeProjectCopy = activeProject;
    const taskList = activeProjectCopy.tasks;

    const taskIndex = taskList.findIndex(taskItem => taskItem.id === task.id);
    const position = taskList[taskIndex].position;
    taskList.splice(taskIndex, 1);
    
    activeProjectCopy[taskType] = taskList;
    setActiveProject(activeProjectCopy);
    
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-delete`, [activeProject.id, task.id, taskType, position])
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

  const options = 'options-col:' + task.id;
  if (optionsShown === true)
  {
    document.addEventListener('click', e => 
    {
      const optionsElement = document.getElementById(options);
  
      if (e.target !== optionsElement && !optionsElement?.contains(e.target))
      {
        setOptionsShown(false);
        setMoveOpen(false);
      }
    })
  }

  return (
    <div className='options' id={ options } onMouseLeave={ !moveOpen ? () => {toggleOptions('hide')} : null  } >
      <div className={ `option option--ellipsis ${optionsShown ? 'option--ellipsis--shown' : ''}` } onClick={ () => {toggleOptions('toggle')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
      
      <div className={ `option option--tags ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      </div>

      <div className={ `option option--type ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon' onClick={ () => {setMoveOpen(!moveOpen);} }><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
        
        <div className={ `options__select ${moveOpen ? 'options__select--shown' : ''}` }>
          <input className='move__input' type='hidden' value={ newLocation } ref={ moveLocationRef }/>
          <div className={`options__location ${newLocation === moveLocation0 ? 'options__location--selected' : ''}` } onClick={ () => {setNewLocation(moveLocation0)} }>{ formatTaskType(moveLocation0) }</div>
          <div className={`options__location ${newLocation === moveLocation1 ? 'options__location--selected' : ''}` } onClick={ () => {setNewLocation(moveLocation1)} }>{ formatTaskType(moveLocation1) }</div>
          <button className='options__submit' onClick={updateTaskType}>MOVE</button>
        </div>
      </div>

      <div className={ `option option--position option--position--up ${optionsShown ? 'option--shown' : ''}` } onClick={() => {updateTaskPosition('up')}}>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowUp }/></div>
      </div>

      <div className={ `option option--position option--position--down ${optionsShown ? 'option--shown' : ''}` } onClick={() => {updateTaskPosition('down')}}>
        <div className='option__icon'><FontAwesomeIcon icon={ faArrowDown }/></div>
      </div>

      <div className={ `option option--remove ${optionsShown ? 'option--shown' : ''}` } onClick={deleteTask}>
        <div className='option__icon'><FontAwesomeIcon icon={ faMultiply }/></div>
      </div>
    </div>

  )
}