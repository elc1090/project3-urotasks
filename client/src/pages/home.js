import { useContext } from 'react'
import { ReducerContext } from '../app';

import Menu from '../components/menu';
import Dashboard from '../components/dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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
      <div className='dashboard__burger' id="dashboard__burger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars}/>
      </div>

      <Menu/>
      <Dashboard/>
    </>
  )
}