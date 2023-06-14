import React, { useState, useContext, useEffect } from "react";
import { ProjectsContext, ReducerContext, FlagsContext } from "../../../app";
import axios from 'axios';

import ProjectCreator from './proj-creator/proj-creator';
import Screensaver from './screensaver/screensaver';
import Searchbar from './searchbar/searchbar';
import Taskbar from './taskbar/taskbar';
import Tasks from './tasks/tasks';

export default function Dashboard()
{
  const { activeProject, setActiveProject } = useContext(ProjectsContext);
  const {fetchTasks, setFetchTasks} = useContext(FlagsContext);
  const { state } = useContext(ReducerContext);

  useEffect(() => 
  {
    if (activeProject !== null && fetchTasks === true)
    {
      let activeProjectCopy = { ...activeProject };

      axios.get(`${process.env.REACT_APP_SERVER_ROUTE}/get-tasks?projectID=${activeProject.id}`)
        .then(res => {setActiveProject({ ...activeProjectCopy, tasks: res.data }); setFetchTasks(false);})
        .catch(err => {console.log(err)})
    }

  }, [activeProject]);

  function DashboardContent()
  {
    if (activeProject !== null)
    {
      return (
        <>
          <Searchbar/>
          <Taskbar/>
          <div className="tasks__container" id="tasks__container">
            <Tasks taskType="todo"/>
            <Tasks taskType="doing"/>
            <Tasks taskType="done"/>
          </div>
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