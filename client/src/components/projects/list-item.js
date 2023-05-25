import { useContext } from "react";
import { ReducerContext, UserContext } from "../../app";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function ProjectsItem({ projectsItem })
{
  const { user, setUser } = useContext(UserContext);
  const { dispatch } = useContext(ReducerContext);

  let todoLength = projectsItem.todo ? projectsItem.todo.length : 0;
  let doingLength = projectsItem.doing ? projectsItem.doing.length : 0;

  function activateProject()
  {
    const userCopy = { ...user };
    userCopy.activeProject = projectsItem.id;
    setUser(userCopy);

    if (window.innerWidth < 1337)
    {
      dispatch({ type: 'menuHidden'      });
      dispatch({ type: 'dashboardMoved'  });
      dispatch({ type: 'searchbarSpaced' });  
    }  

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update-active-project`, [user.id, projectsItem.id, 'activeProject']);
  }

  return (
    <li className='menu-projects-list-item' onClick={ activateProject }>
      <div className='item-data'>
        <span style={{ color: projectsItem?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='item-name'>{ projectsItem?.name }</div>
      </div> 
  
      <div className='total-tasks'>{ todoLength + doingLength }</div>
    </li>
  )
}