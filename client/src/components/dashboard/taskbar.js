import { useContext } from 'react';
import { ProjectsContext, ActiveProjectContext } from "../../app";
import axios from 'axios';

import TaskbarTitle from './taskbar-title';
import TaskbarProjectColor from './taskbar-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function UpperSection()
{
  const { activeProject } = useContext(ActiveProjectContext);
  const { projects, setProjects } = useContext(ProjectsContext);

  function deleteProject()
  {
    let placeholderProjects;

    if (projects.length > 1)
    {
      placeholderProjects = projects.filter(project => project.id !== activeProject.id);
      placeholderProjects[0].active = true;
      
      setProjects(placeholderProjects);
    }

    else
      setProjects([]);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-delete`, { id: activeProject.id })
  }

  return (
    <div className="taskbar">
      <h1 className="taskbar__title" id="task__title">
        <TaskbarProjectColor/>
        <TaskbarTitle value={ activeProject.name }/>
      </h1>
      
      <div className="taskbar__sort">
        <FontAwesomeIcon icon={ faArrowDownWideShort }/>
        <span className='controls-big'> Sort</span>
        <span className='controls-small'></span>
      </div>

      <div className="taskbar__delete" onClick={ deleteProject }>
        <FontAwesomeIcon icon={ faTrashCan }/> 
        <span className='controls-big'> Delete</span>
        <span className='controls-small'></span>
      </div>
    </div>
  )
}