import React, { useContext } from "react";
import { ProjectsContext, ReducerContext } from "../../../app";

import './_style/dashboard.css';

import ProjectCreator from './proj-creator/proj-creator';
import Searchbar from './searchbar/searchbar';
import Taskbar from './taskbar/taskbar';
import Tasks from './tasks/tasks';

export default function Dashboard()
{
  const { projects } = useContext(ProjectsContext);
  const { state } = useContext(ReducerContext);

  function DashboardContent()
  {
    if (projects.length > 0)
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
      return <p>no projects found</p>
  }

  return (
    <div className={`dashboard ${state.isDashboardMoved ? 'dashboard--moved' : ''}`} id="dashboard">
      <ProjectCreator/>
      <DashboardContent/>
    </div>
  )
}