/** dependencies **/
import React, { useState, useEffect, useReducer } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './css/common.css';

import NotFoundPage from './pages/404'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import SettingsPage from './pages/settings'

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
    isMenuHidden: false,
    isDashboardMoved: false,
    isSearchbarSpaced: false,
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

  return (
    <div className="app" id='app'>
      <ProjectsContext.Provider value={{ projects, setProjects, activeProject, setActiveProject }}>
        <ReducerContext.Provider value={{ state, dispatch }}>
          <UserContext.Provider value={{ user, setUser }}>
            <Routes>
              <Route exact path='/' element={ <HomePage/> }/>
              <Route path='/login' element={ <LoginPage/> }/>
              <Route path='/register' element={ <RegisterPage/> }/>
              <Route path='/settings' element={ <SettingsPage/> }/>

              <Route path='/404' element={ <NotFoundPage/> }/>
              <Route path='*' element={ <Navigate to='/404'/> }/>
            </Routes>
          </UserContext.Provider>
        </ReducerContext.Provider>
      </ProjectsContext.Provider>
    </div>
  );
}
