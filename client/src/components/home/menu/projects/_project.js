import { useContext } from "react";
import { ReducerContext, UserContext, FlagsContext } from "../../../../app";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function Project({ itemData })
{
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { setFetchTasks } = useContext(FlagsContext);

  function activateProject()
  {
    if (itemData.id !== user.activeProject)
    {
      setFetchTasks(true);

      const userCopy = { ...user };
      setUser({ ...userCopy, activeProject: itemData.id });

      if (window.innerWidth < 1337 && state.isMenuHidden === false)
      {
        dispatch({ type: 'menuHidden'      });
        dispatch({ type: 'dashboardMoved'  });
        dispatch({ type: 'searchbarSpaced' });  
      }  
  
      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update`, [user.id, itemData.id, 'activeProject'])
        .catch(err => {console.log(err)})
    }
  }

  return (
    <li className='projects__item' onClick={ activateProject }>
      <div className='item__data'>
        <span style={{ color: itemData?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='item__name'>{ itemData?.name }</div>
      </div> 
  
      <div className='item__total-tasks'>{ itemData?.activeTasks }</div>
    </li>
  )
}