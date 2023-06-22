import { useContext } from 'react';
import { ProjectsContext } from '../../../../../../app';
import { OptionsContext } from './options';
import { TaskTypeContext } from '../../tasks';
import { ScrollContext } from '../../../dashboard';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function OptionChangeType({ task })
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { optionsShown, changeTypeOpen, setChangeTypeOpen } = useContext(OptionsContext);
  const { setScrollTo } = useContext(ScrollContext);
  
  const taskType = useContext(TaskTypeContext);
  let taskTypeLeft, taskTypeRight, changeTypeIcon;

  switch (taskType)
  {
    case 'todo' : taskTypeLeft = "doing"; taskTypeRight = "done" ; changeTypeIcon = faArrowRight;      break;
    case 'doing': taskTypeLeft = "todo" ; taskTypeRight = "done" ; changeTypeIcon = faArrowsLeftRight; break;
    case 'done' : taskTypeLeft = "todo" ; taskTypeRight = "doing"; changeTypeIcon = faArrowLeft;       break;
    default: break;
  }
 
  function formatTaskType(taskTypeName)
  {
    if (taskTypeName === undefined)
      return;

    if (taskTypeName === 'todo')
      taskTypeName = taskTypeName.slice(0, 2) + '-' + taskTypeName.slice(2)

    return taskTypeName.toUpperCase();
  }

  function updateTaskType(newType)
  { 
    const scrollOffset = document.getElementById(taskType).offsetLeft;
    setScrollTo(scrollOffset);

    const taskList = activeProject.tasks;
    const taskToMove = taskList.find(taskItem => taskItem.id === task.id);
    
    const tasksFiltered = taskList.filter(taskObj => taskObj.type === newType);
    let lastTaskPos = Math.max(...tasksFiltered.map(taskObj => taskObj.position));

    if (lastTaskPos === -Infinity)
      lastTaskPos = 0;

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
      {
        if (types.new === 'done')
          project.activeTasks = project.activeTasks - 1;

        else if (types.old === 'done')
          project.activeTasks = project.activeTasks + 1;

        project.tasks = taskList;
      }

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
        <div className='options__location' onClick={ () => {updateTaskType(taskTypeLeft)} }>{ formatTaskType(taskTypeLeft) }</div>
        <div className='options__location' onClick={ () => {updateTaskType(taskTypeRight)} }>{ formatTaskType(taskTypeRight) }</div>
      </div>
    </div>
  )
}