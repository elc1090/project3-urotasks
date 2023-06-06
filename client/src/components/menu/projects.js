import { useContext } from 'react';
import { ReducerContext } from '../../app';
import { ToggleMenuContext } from '../../pages/home';

import ProjectsList from "./projects/list"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function MenuProjects()
{
  const { dispatch } = useContext(ReducerContext);
  const { toggleMenu } = useContext(ToggleMenuContext);

  function toggleProjCreator()
  {
    if (window.innerWidth < 1337)
      toggleMenu();
  
    dispatch({ type: 'projCreatorShown' });
  }
  
  function toggleProjectList()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');
  
    const projectsListElement = document.getElementById('projects__list');
    projectsListElement.classList.toggle('projects__list--hidden')
  }

  return (
    <div className='projects'>
      <h2 className='projects__header' onClick={ toggleProjectList }>Projects <FontAwesomeIcon icon={ faChevronUp }/></h2>
      <div className='projects__add' onClick={ toggleProjCreator }><FontAwesomeIcon icon={ faPlus }/></div>
      <ProjectsList />
    </div>
  )
}