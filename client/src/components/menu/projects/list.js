import { useContext } from 'react';
import { ProjectsContext } from '../../../app';

import Project from '../projects/list-item';

export default function ProjectsList()
{
  const { projects } = useContext(ProjectsContext);
  
  return (
    <ul className='projects__list' id='projects__list'>
      { projects.map(project => {return <Project projectData={ project } key={ project.id }/>}) }
    </ul>
  )
}