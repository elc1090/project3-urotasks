import React, { useState, useContext } from 'react'
import { ReducerContext, FlagsContext } from '../app';

import Menu from '../components/home/menu/menu';
import Dashboard from '../components/home/dashboard/dashboard';
import ProjCreator from '../components/home/proj-creator/proj-creator';
import EditableTask from '../components/home/editable-task/editable-task';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export const TaskEditorContext = React.createContext();
export const ToggleMenuContext = React.createContext();

export default function HomePage()
{
  const { dispatch } = useContext(ReducerContext);
  const { loading } = useContext(FlagsContext);

  const [editorParams, setEditorParams] = useState({ x: 0, y: 0, w: 0, taskData: null });
  const [editorShown, setEditorShown] = useState(false);

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  if (loading)
    return <div className='loading'>loading...</div>

  else
  {
    return (
      <>
        <div className='dashboard__burger' id="dashboard__burger" onClick={ toggleMenu }>
          <FontAwesomeIcon icon={ faBars }/>
        </div>
  
        <ToggleMenuContext.Provider value={{ toggleMenu }}>
          <ProjCreator/>
          <Menu/>

           <TaskEditorContext.Provider value={{ editorShown, setEditorShown, editorParams, setEditorParams }}>
            <Dashboard/>
            <EditableTask/>
          </TaskEditorContext.Provider>
        </ToggleMenuContext.Provider>
      </>
    )
  }
}