import React, { useContext, useState } from 'react';
import { ProjectsContext } from '../../../../../app';
import axios from 'axios';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarProjectColor()
{
  const { projects, setProjects, activeProject, setActiveProject } = useContext(ProjectsContext); 
  
  const [newColor, setNewColor] = useState(activeProject?.color);
  const [pickerActive, setPickerActive] = useState(false);

  function toggleColorPicker()
  {
    if (pickerActive && newColor !== activeProject.color)
    {
      // not setting the activeProject directly makes the color flicker when changing
      const oldColor = activeProject.color;
      setActiveProject({ ...activeProject, color: newColor });

      const projectsCopy = projects.map(project => 
      {
        if (project.id === activeProject.id)
          return { ...project, color: newColor, tasks: activeProject.tasks }

        return project;
      });

      axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update`, [{ id: activeProject.id, color: newColor }, 'color'])
        .then(res => 
        {
          console.log(res);
          setProjects(projectsCopy);
        })
        .catch(err => 
        {
          console.log(err);
          setActiveProject({ ...activeProject, color: oldColor })
        })
    }

    setPickerActive(!pickerActive);
  }

  function ColorPicker()
  {
    return (
      <div>
        <div onClick={ toggleColorPicker } className='chrome-picker__bg'/>
        <ChromePicker color={ newColor } onChangeComplete={ (color) => {setNewColor(color.hex)} }/> 
      </div>
    )
  }

  return (
    <>
      <div className='header__color' onClick={ toggleColorPicker } style={{ color: newColor }}><FontAwesomeIcon icon={ faSquare }/></div>
      {pickerActive ? <ColorPicker/> : null}
    </>
  )
}