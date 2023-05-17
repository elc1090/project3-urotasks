/** dependencies **/
import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import './css/common.css';

/** components **/
import Menu from './components/menu';
import Dashboard from './components/dashboard';

/** font-awesome **/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/** contexts **/
export const ReducerContext = React.createContext();
export const ProjectsContext = React.createContext();
export const ActiveProjectContext = React.createContext();

export default function App() 
{
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(projects[0]);

  useEffect(() => 
  {
    axios.get("/project-read")
      .then(res => {setProjects(res.data); setActiveProject(res.data[0])})
      .catch(err => {console.log(err)});
  }, []);


  function reducer(state, action)
  {
    switch (action.type)
    {
      case 'menuHidden'      : return { ...state, isMenuHidden      : !state.isMenuHidden       };
      case 'dashboardMoved'  : return { ...state, isDashboardMoved  : !state.isDashboardMoved   };
      case 'searchbarSpaced' : return { ...state, isSearchbarSpaced : !state.isSearchbarSpaced  };
      case 'projCreatorShown': return { ...state, isProjCreatorShown: !state.isProjCreatorShown };
      
      default: return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, 
  {
    isMenuHidden: false,
    isDashboardMoved: false,
    isSearchbarSpaced: false,
    isProjCreatorShown: false
  });

  function toggleMenu()
  { 
    dispatch({ type: 'menuHidden'      });
    dispatch({ type: 'dashboardMoved'  });
    dispatch({ type: 'searchbarSpaced' });  
  }

  return (
    <div className="app" id='app'>
      <div className='dashboard-burguer-btn' id="dashboard-burguer-btn" onClick={toggleMenu}><FontAwesomeIcon icon={faBars}/></div>
      
      <ActiveProjectContext.Provider value={{ activeProject, setActiveProject }}>
        <ProjectsContext.Provider value={{ projects, setProjects }}>
          <ReducerContext.Provider value={{ state, dispatch }}>
            <Menu/>
            <Dashboard/>
          </ReducerContext.Provider>
        </ProjectsContext.Provider>
      </ActiveProjectContext.Provider>
    </div>
  );
}
