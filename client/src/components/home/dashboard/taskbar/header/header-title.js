import { useState, useContext } from 'react';
import { ProjectsContext } from '../../../../../app';
import axios from 'axios';

export default function ItemText({ value }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  const { projects, setProjects, activeProject } = useContext(ProjectsContext);

  function handleNameChange(newName) 
  { 
    const placeholderProjects = projects.map(project => 
      {
        if (project.id === activeProject.id)
          return { ...project, name: newName }

        return project;
      });

    setProjects(placeholderProjects);

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update`, [{ id: activeProject.id, name: newName }, 'name'])
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
    <div className='taskbar__header__text'>
      {
        editing 
          ? (<input style={{width: '100%'}} autoFocus type="text" value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown}/>) 
          : (<div style={{width: '100%'}} onClick={handleEdit}>{value}</div>)
      }
    </div>
  );
}