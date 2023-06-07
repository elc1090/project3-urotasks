import React, { useContext } from 'react'
import { ReducerContext } from '../app';

import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const ToggleMenuContext = React.createContext();

export default function HomePage()
{
  const { dispatch } = useContext(ReducerContext);

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  return (
    <>
      <div className='dashboard__burger' id="dashboard__burger" onClick={ toggleMenu }>
        <FontAwesomeIcon icon={ faBars }/>
      </div>

      <ToggleMenuContext.Provider value={{ toggleMenu }}>
        <Menu/>
        <Dashboard/>
      </ToggleMenuContext.Provider>
    </>
  )
}