/** dependencies **/
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import './css/common.css';

/** components **/
import Menu from './components/menu';
import Dashboard from './components/dashboard';

/** font-awesome **/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** contexts **/
export const UserContext = React.createContext();
export const ReducerContext = React.createContext();
export const ProjectsContext = React.createContext();

export default function App() 
{
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => 
  {
    if (user !== null && projects.length > 0)
    {
      let activeProjectIndex = -1;

      for (let i = 0; i < projects.length; i++)
        if (projects[i].id === user.activeProject)
          activeProjectIndex = i;

      activeProjectIndex === -1 
        ? setActiveProject(projects[0]) 
        : setActiveProject(projects[activeProjectIndex]);
    }
  }, [user, projects]);

  useEffect(() => 
  {
    axios.get('/data-read')
      .then(res => {setUser(res.data[0]); setProjects(res.data[1])})
      .catch(err => {console.log(err)})
  }, [])

  const [state, dispatch] = useReducer(reducer, 
  {
    isMenuHidden: true,
    isDashboardMoved: true,
    isSearchbarSpaced: true,
    isProjCreatorShown: false,
    isOptionOnFocus: false,
    isTaskUpdated: false
  });
      
  function reducer(state, action)
  {
    switch (action.type)
    {
      // ui
      case 'menuHidden': return { ...state, isMenuHidden: !state.isMenuHidden };
      case 'dashboardMoved': return { ...state, isDashboardMoved: !state.isDashboardMoved };
      case 'searchbarSpaced': return { ...state, isSearchbarSpaced: !state.isSearchbarSpaced };
      case 'projCreatorShown': return { ...state, isProjCreatorShown: !state.isProjCreatorShown };
      case 'optionOnFocus': return { ...state,  isOptionOnFocus: !state.isOptionOnFocus };
      case 'taskUpdated': return { ...state, isTaskUpdated: !state.isTaskUpdated };
      default: return state;
    }
  }

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard__burger' id="dashboard__burger" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
        <ReducerContext.Provider value={{ state, dispatch }}>
          <UserContext.Provider value={{ user, setUser }}>
            <Menu/>
            {activeProject !== null ? <Dashboard/> : <div className='dashboard'>no active project</div>}
          </UserContext.Provider>
        </ReducerContext.Provider>
      </ProjectsContext.Provider>
    </div>
  );
}
