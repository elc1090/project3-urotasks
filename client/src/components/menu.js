import { useContext } from 'react';
import { ReducerContext, UserContext } from '../app';

import ProjectsList from './projects/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronUp, faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Menu()
{
  const { user } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  function toggleMenu()
  {
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  function toggleProjects()
  {
    const chevronElement = document.querySelectorAll('.fa-chevron-up')[0];
    chevronElement.classList.toggle('chevron-rotate');

    const projectsListElement = document.getElementById('menu-projects-list');
    projectsListElement.classList.toggle('menu-projects-list-hidden')
  }

  return (
    <div className={`menu ${state.isMenuHidden ? 'menu-hidden' : ''}`} id='menu'>
      <div className='menu-header'>
        <a className='app-logo' href='/'><img src='img/logo--dark_theme.svg'/></a>  
        <div className='btn-close' onClick={ toggleMenu }><FontAwesomeIcon icon={ faXmark }/></div>
      </div>

      <div className='menu-projects'>
        <h2 className='menu-projects-header' onClick={ toggleProjects }>Projects <FontAwesomeIcon icon={ faChevronUp }/></h2>
        <div className='menu-projects-add' onClick={ () => {dispatch({ type: 'projCreatorShown' })} }><FontAwesomeIcon icon={ faPlus }/></div>
        
        <ProjectsList />
      </div>

      <div className='menu-user'>
        <a className='menu-user-data' href='/'>
          <div className='menu-user-pic'><img src='img/capybara.jpg' alt='user_pic'></img></div>
          <div className='menu-user-name'>{ user?.name }</div>
        </a>
        <div className='menu-user-signout'><FontAwesomeIcon icon={ faRightFromBracket }/></div>
      </div>
    </div>
  )
}