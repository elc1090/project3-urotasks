import React, { useContext, useState } from 'react';
import { ProjectsContext, ActiveProjectContext } from '../../app';
import axios from 'axios';

import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarProjectColor()
{
  const { projects, setProjects } = useContext(ProjectsContext); 
  const { activeProject } = useContext(ActiveProjectContext);

  const [color, setColor] = useState(activeProject.color);
  const [pickerActive, setPickerActive] = useState(false);

  function toggleColorPicker()
  {
    if (pickerActive)
    {
      const placeholderProjects = projects.map(project => 
        {
          if (project.id === activeProject.id)
            return { ...project, color: color }
  
          return project;
        });

      setProjects(placeholderProjects);
    }

    setPickerActive(!pickerActive);

    // make it call only when closing color picker
    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-update`, [{ id: activeProject.id, color: color }, 'color'])
    .then(function(response) {console.log(response)})
    .catch(function(error) {console.log(error)});
  }

  function ColorPicker()
  {
    return (
      <div>
        <div onClick={ toggleColorPicker } className='color-picker-background'/>
        <ChromePicker color={ color } onChangeComplete={ (color) => {setColor(color.hex)} }/> 
      </div>
    )
  }

  return (
    <>
      <div className='title-color' onClick={ toggleColorPicker } style={{ color: color }}><FontAwesomeIcon icon={ faSquare }/></div>
      {pickerActive ? <ColorPicker/> : null}
    </>
  )
}