import { useContext } from 'react';
import { ProjectsContext } from "../../../../app";

import TaskbarTitle from './header/header-title';
import TaskbarProjectColor from './header/header-color';
import TaskbarDelete from './options/options-delete';

export default function UpperSection()
{
  const { activeProject } = useContext(ProjectsContext);

  return (
    <div className="taskbar">
      <h1 className="taskbar__header" id="task__header">
        <TaskbarProjectColor/>
        <TaskbarTitle value={ activeProject?.name }/>
      </h1>
      
      <TaskbarDelete/>
    </div>
  )
}