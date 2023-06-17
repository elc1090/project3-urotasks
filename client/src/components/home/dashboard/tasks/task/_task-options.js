import React, { useState, useContext, useRef } from 'react';
import { ProjectsContext, ReducerContext } from '../../../../../app';
import { TaskTypeContext } from '../tasks';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTag, faArrowsLeftRight, faArrowUp, faArrowDown, faMultiply } from '@fortawesome/free-solid-svg-icons';

export default function ListItemControls({ task })
{
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [optionsShown, setOptionsShown] = useState(false);

  const [newType, setNewType] = useState('');
  const newTypeRef = useRef();

  const { dispatch } = useContext(ReducerContext);
  const { activeProject, setActiveProject } = useContext(ProjectsContext);
  
  const taskType = useContext(TaskTypeContext);
  let otherTaskType0, otherTaskType1;

  switch (taskType)
  {
    case 'todo' : otherTaskType0 = "doing"; otherTaskType1 = "done" ; break;
    case 'doing': otherTaskType0 = "todo" ; otherTaskType1 = "done" ; break;
    case 'done' : otherTaskType0 = "todo" ; otherTaskType1 = "doing"; break;
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
    const newType = newTypeRef.current.value;
    
    const taskList = activeProject.tasks;
    const taskToMove = taskList.find(taskItem => taskItem.id === task.id);
    
    const filteredTaskList = taskList.filter(taskObj => taskObj.type === newType);
    const lastTaskPos = Math.max(...filteredTaskList.map(taskObj => taskObj.position));

    const types = { old: taskType, new: newType };
    const positions = { old: taskToMove.position, new: lastTaskPos + 1 };
    
    taskList.map(taskObj => 
    {
      if (taskObj.id === taskToMove.id)
      {
        taskObj.type = types.new;
        taskObj.position = positions.new;
      }

      else if (taskObj.type === taskType && taskObj.position > positions.old)
        taskObj.position = taskObj.position - 1;
        
      return taskObj;
    })

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update-type`, [activeProject.id, task.id, types, positions])
      .then(res => 
      {
        console.log(res);
        setActiveProject({ ...activeProject, tasks: taskList });
        dispatch({ type: "taskUpdated" });
      })
      .catch( err => {console.log(err)} )
  }

  function updateTaskPosition(direction)
  { 
    
    const filteredTaskList = activeProject.tasks.filter(taskObj => taskObj.type === taskType);
    const updatedTask = filteredTaskList.find(taskObj => taskObj.id === task.id);
    const lastTaskPos = Math.max(...filteredTaskList.map(taskObj => taskObj.position));
  
    if (direction === 'up' && updatedTask.position === 1)
      return

    if (direction == 'down' && updatedTask.position === lastTaskPos) 
      return 

    const offset = direction === 'up' ? -1 : 1; 
    const otherOffset = offset * -1;

    const otherTask = filteredTaskList.find(taskObj => taskObj.position === updatedTask.position + offset);
    
    const taskList = activeProject.tasks.map(taskObj => 
    {
      if (taskObj.id === updatedTask.id)
        taskObj.position = taskObj.position + offset;

      else if (taskObj.id === otherTask.id)
        taskObj.position = taskObj.position + otherOffset;
      
      return taskObj;
    })

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update-position`, [updatedTask.id, otherTask.id, direction])
      .then(res => 
      {
        console.log(res);
        setActiveProject({ ...activeProject, tasks: taskList });
        setOptionsShown(false);
        setChangeTypeOpen(false);
        setNewType('');
      })
      .catch( err => {console.log(err)} );
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

      if (changeTypeOpen === true)
      {
        setChangeTypeOpen(false);
        setNewType('');
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
        setChangeTypeOpen(false);
      }
    })
  }

  return (
    <div className='options' id={ options } onMouseLeave={ !changeTypeOpen ? () => {toggleOptions('hide')} : null  } >
      <div className={ `option option--ellipsis ${optionsShown ? 'option--ellipsis--shown' : ''}` } onClick={ () => {toggleOptions('toggle')} }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
      
      <div className={ `option option--tags ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
      </div>

      <div className={ `option option--type ${optionsShown ? 'option--shown' : ''}` }>
        <div className='option__icon' onClick={ () => {setChangeTypeOpen(!changeTypeOpen);} }><FontAwesomeIcon icon={ faArrowsLeftRight }/></div>
        
        <div className={ `options__select ${changeTypeOpen ? 'options__select--shown' : ''}` }>
          <input className='move__input' type='hidden' value={ newType } ref={ newTypeRef }/>
          <div className={`options__location ${newType === otherTaskType0 ? 'options__location--selected' : ''}` } onClick={ () => {setNewType(otherTaskType0)} }>{ formatTaskType(otherTaskType0) }</div>
          <div className={`options__location ${newType === otherTaskType1 ? 'options__location--selected' : ''}` } onClick={ () => {setNewType(otherTaskType1)} }>{ formatTaskType(otherTaskType1) }</div>
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