import { useState, useContext } from 'react';
import { ProjectsContext, UserContext } from "../../../../../app";
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarDelete()
{
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);

  const [confirmationShown, setConfirmationShown] = useState(false);

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

  if (confirmationShown === true)
  {
    document.addEventListener('click', e => 
    {
      const confirmationElement = document.querySelector('.confirmation');
      const deleteBtnElement = document.querySelector('.taskbar__delete');
  
      if (e.target !== confirmationElement && e.target !== deleteBtnElement)
        setConfirmationShown(false);
    })
  }

  return (
    <>
      <div className={`taskbar__delete ${confirmationShown ? 'taskbar__delete--active' : ''}`} onClick={ () =>  {setConfirmationShown(!confirmationShown)} }>
        <FontAwesomeIcon icon={ faTrashCan }/>  
      </div>

      <div className={`confirmation ${confirmationShown ? 'confirmation--shown' : 'confirmation--hidden'}`}>
        <h3 className='confirmation__header'>Are you sure you want to delete this project?</h3>
        
        <div className='confirmation__btns'>
          <div className='btn--confirmation' id='confirmation--cancel' onClick={ () =>  {setConfirmationShown(!confirmationShown)} }>CANCEL</div>
          <div className='btn--confirmation' id='confirmation--confirm' onClick={ deleteProject }>DELETE</div>
        </div>
      </div>
    </>
  )
}