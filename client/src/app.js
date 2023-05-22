/** dependencies **/
import React, { useState, useEffect } from 'react';
import { state, dispatch } from './reducer';
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

  // quick fix
  function removeFirstTask(projects)
  {
    projects.forEach(project => 
    {
      if (project.todo[0].content === "")
        project.todo.shift();

      if (project.doing[0].content === "")
        project.doing.shift();

      if (project.done[0].content === "")
        project.done.shift();
    })

    return projects;
  }

  useEffect(() => 
  {
    axios.get("/project-read")
      .then(res => {setProjects(removeFirstTask(res.data)); setActiveProject(res.data[0])})
      .catch(err => {console.log(err)});
  }, []);

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
