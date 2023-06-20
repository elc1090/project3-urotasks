import { useContext } from 'react';
import { ProjectsContext } from '../../../../../../app';
import { OptionsContext } from './options';
import { TaskTypeContext } from '../../tasks';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionChangeType({ task })
{
  const taskType = useContext(TaskTypeContext);
  let taskTypeTop, taskTypeBottom, changeTypeIcon;

  switch (taskType)
  {
    case 'todo' : taskTypeTop = "doing"; taskTypeBottom = "done" ; changeTypeIcon = faArrowRight;      break;
    case 'doing': taskTypeTop = "todo" ; taskTypeBottom = "done" ; changeTypeIcon = faArrowsLeftRight; break;
    case 'done' : taskTypeTop = "todo" ; taskTypeBottom = "doing"; changeTypeIcon = faArrowLeft;       break;
    default: break;
  }

  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { optionsShown, changeTypeOpen, setChangeTypeOpen, newType, setNewType, newTypeRef } = useContext(OptionsContext);
 
  function formatTaskType(taskTypeName)
  {
    if (taskTypeName === undefined)
      return;

    if (taskTypeName === 'todo')
      taskTypeName = taskTypeName.slice(0, 2) + '-' + taskTypeName.slice(2)

    return taskTypeName.toUpperCase();
  }

  function updateTaskType()
  {
    const newType = newTypeRef.current.value;
    
    const taskList = activeProject.tasks;
    const taskToMove = taskList.find(taskItem => taskItem.id === task.id);
    
    const tasksFiltered = taskList.filter(taskObj => taskObj.type === newType);
    const lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));

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

    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        project.tasks = taskList;

      return project;
    })

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update?type=type`, [activeProject.id, task.id, types, positions])
      .then(res => 
      {
        console.log(res);
        setActiveProject({ ...activeProject, tasks: taskList });
        setProjects(projectsCopy);
      })
      .catch( err => {console.log(err)} )
  }

  return (
    <div className={ `option option--type ${optionsShown ? 'option--shown' : ''}` }>
    <div className='option__icon' onClick={ () => {setChangeTypeOpen(!changeTypeOpen)} }><FontAwesomeIcon icon={ changeTypeIcon }/></div>
    
    <div className={ `options__select ${changeTypeOpen ? 'options__select--shown' : ''}` }>
      <input className='move__input' type='hidden' value={ newType } ref={ newTypeRef }/>
      <div className={`options__location ${newType === taskTypeTop ? 'options__location--selected' : ''}` } onClick={ () => {setNewType(taskTypeTop)} }>{ formatTaskType(taskTypeTop) }</div>
      <div className={`options__location ${newType === taskTypeBottom ? 'options__location--selected' : ''}` } onClick={ () => {setNewType(taskTypeBottom)} }>{ formatTaskType(taskTypeBottom) }</div>
      <button className='options__submit' onClick={updateTaskType}>MOVE</button>
    </div>
  </div>
  )
}