import React, { useContext } from 'react'
import { ReducerContext, LoadingContext } from '../app';

import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const ToggleMenuContext = React.createContext();

export default function HomePage()
{
  const { dispatch } = useContext(ReducerContext);
  const { loading } = useContext(LoadingContext);

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  if (loading)
    return <p className='sexo'>loading...</p>

  else
  {
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
}