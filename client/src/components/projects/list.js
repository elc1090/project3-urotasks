import { useContext } from 'react';
import { ProjectsContext } from '../../app';

import ProjectsItem from '../projects/list-item';

function ProjectsItemsList({ projects })
{
  return projects.map(project => {return <ProjectsItem projectsItem={ project } key={ project.id ? project.id : Math.random() }/>})
}

export default function ProjectsList()
{
  const { projects } = useContext(ProjectsContext);

  return (
    <ul className='menu__projects__list' id='projects__list'>
      <ProjectsItemsList projects={ projects }/>
    </ul>
  )
}