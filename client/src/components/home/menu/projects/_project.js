import { useContext } from "react";
import { ReducerContext, UserContext } from "../../../../app";
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function Project({ itemData })
{
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);

  // quick fix, refactor
  function activeTasksAmount()
  {
    if (!Array.isArray(itemData.todo))
      itemData.todo = [];

    if (!Array.isArray(itemData.doing))
      itemData.doing = [];
  
    return itemData.todo.length + itemData.doing.length;
  }

  function activateProject()
  {
    const userCopy = { ...user };
    userCopy.activeProject = itemData.id;
    setUser(userCopy);

    if (window.innerWidth < 1337 && state.isMenuHidden === false)
    {
      dispatch({ type: 'menuHidden'      });
      dispatch({ type: 'dashboardMoved'  });
      dispatch({ type: 'searchbarSpaced' });  
    }  

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update`, [user.id, itemData.id, 'activeProject']);
  }

  return (
    <li className='projects__item' onClick={ activateProject }>
      <div className='item__data'>
        <span style={{ color: itemData?.color }}><FontAwesomeIcon icon={ faSquare }/></span> 
        <div className='item__name'>{ itemData?.name }</div>
      </div> 
  
      <div className='item__total-tasks'>{ activeTasksAmount() }</div>
    </li>
  )
}