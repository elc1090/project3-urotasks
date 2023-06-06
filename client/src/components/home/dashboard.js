import React, { useContext } from "react";
import { ProjectsContext, ReducerContext } from "../../app";

import '../../css/dashboard.css';

import ProjectCreator from '../dashboard/project-creator';
import Searchbar from '../dashboard/searchbar';
import Taskbar from '../dashboard/taskbar';
import Tasks from '../dashboard/tasks';

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
          <Tasks/>
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