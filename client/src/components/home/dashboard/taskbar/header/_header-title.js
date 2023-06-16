import { useState, useContext } from 'react';
import { ProjectsContext } from '../../../../../app';
import axios from 'axios';

export default function ItemText({ value }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext);

  function handleNameChange(newName) 
  { 
    setActiveProject({ ...activeProject, name: newName });

    const projectsCopy = projects.map(project => 
    {
      if (project.id === activeProject.id)
        return { ...project, name: newName, tasks: activeProject.tasks }

      return project;
    });

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update`, [{ id: activeProject.id, name: newName }, 'name'])
    .then(res => 
    {
      console.log(res);
      setProjects(projectsCopy);
    })
    .catch( err => {console.log(err)} )
  }

  function handleInputChange(e) 
  {
    setInputValue(e.target.value);
  }

  function handleEdit() 
  {
    setEditing(true);
  }

  function handleSave() 
  {
    setEditing(false);
    handleNameChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  return (
    <div className='header__text'>
      {
        editing 
          ? <input style={{width: '100%'}} autoFocus type="text" value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown}/>
          : <div style={{width: '100%'}} onClick={handleEdit}>{value}</div>
      }
    </div>
  );
}