import { useContext } from 'react';
import { ProjectsContext, ActiveProjectContext, UserContext } from "../../app";
import axios from 'axios';

import TaskbarTitle from './taskbar-title';
import TaskbarProjectColor from './taskbar-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownWideShort, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function UpperSection()
{
  const { user, setUser } = useContext(UserContext);
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

      const userCopy = { ...user };
      userCopy.activeProject = projects[0].id;
      setUser(userCopy);

      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update`, [user.id, projects[0].id, 'activeProject'])
        .then(res => {console.log(res)})
        .catch(err => {console.log(err)})
    }

    else
      setProjects([]);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-delete`, { id: activeProject.id })
      .then(res => {console.log(res)})
      .catch(err => console.log(err))
  }

  return (
    <div className="taskbar">
      <h1 className="taskbar__title" id="task__title">
        <TaskbarProjectColor/>
        <TaskbarTitle value={ activeProject?.name }/>
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