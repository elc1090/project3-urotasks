import React, { useContext, useEffect } from "react";
import { ProjectsContext, ReducerContext } from "../../../app";
import axios from 'axios';

import ProjectCreator from './proj-creator/proj-creator';
import Screensaver from './screensaver/screensaver';
import Searchbar from './searchbar/searchbar';
import Taskbar from './taskbar/taskbar';
import Tasks from './tasks/tasks';

export default function Dashboard()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);
  const { state } = useContext(ReducerContext);

  useEffect(() => // create lastUpdate check
  {
    if (activeProject !== null && activeProject.tasks === undefined)
    {
      axios.get(`${process.env.REACT_APP_SERVER_ROUTE}/tasks-get?projectID=${activeProject.id}`)
        .then(res => 
        {
          const projectsCopy = projects.map(project => 
          {
            if (project.id === activeProject.id)
              project.tasks = res.data;

            return project;
          });
          
          console.log('project tasks fetched');
          setProjects(projectsCopy);
          setActiveProject({ ...activeProject, tasks: res.data });
        })
        .catch(err => 
        { console.log(err) })
    }

    // eslint-disable-next-line
  }, [activeProject]);

  function TasksContainer()
  {
    return (
      <div className="tasks__container" id="tasks__container">
        <Tasks taskType="todo"/>
        <Tasks taskType="doing"/>
        <Tasks taskType="done"/>
      </div>
    )
  }

  function DashboardContent()
  {
    if (activeProject !== null)
    {
      return (
        <>
          <Searchbar/>
          { 
            activeProject.tasks !== undefined
            ? <><Taskbar/> <TasksContainer/></>
            : null
          }
        </>
      )
    }

    else
      return <Screensaver/>
  }

  return (
    <div className={`dashboard ${state.isDashboardMoved ? 'dashboard--moved' : ''}`} id="dashboard">
      <ProjectCreator/>
      <DashboardContent/>
    </div>
  )
}