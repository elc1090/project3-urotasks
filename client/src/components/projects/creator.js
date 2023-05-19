import { useContext, useRef, useState } from 'react';
import { ProjectsContext, ReducerContext } from "../../app";
import axios from 'axios';

import { v4 as uuid } from 'uuid';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { projects, setProjects } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  const [color, setColor] = useState('#0FE19E');
  const [pickerActive, setPickerActive] = useState(false);

  function removeFirst(projects)
  {
    projects.forEach(project => 
    {
      if (project.todo.length > 0 && project.todo[0].content === "")
      {
        project.todo.shift();
        project.doing.shift();
        project.done.shift();
      }
    })

    return projects;
  }

  function createProject()
  {
    let name = projectNameRef.current.value;
    if (name === '') return;

    const newProject = 
    { 
      id: uuid(), 
      active: false, 
      name: name, 
      color: color, 
      todo : [{ id: uuid(), content: "" }], 
      doing: [{ id: uuid(), content: "" }], 
      done : [{ id: uuid(), content: "" }]
    };

    if (projects.length === 0)
      newProject.active = true;

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-create`, newProject)
      .then(function(response) {console.log(response); })
      .catch(function(error) {console.log(error)});
      
    const newProjects = [...projects, newProject];
    setProjects(removeFirst(newProjects));
    
    dispatch({ type: 'projCreatorShown' });
    projectNameRef.current.value = '';
  }

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
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

  function ColorInput()
  {
    const colorStyle = {backgroundColor: color, color: color, borderRadius: "3px",};
    return <div className='input-color' style={colorStyle}>.</div>
  }

  return (
    <div className={`projects-creator-background ${state.isProjCreatorShown ? 'bg-shown' : 'bg-hidden'}`}>
      <div className={`projects-creator ${state.isProjCreatorShown ? 'shown' : 'hidden'}`}>
        <h2 className="creator-title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <div className='btn-close' onClick={ () => {dispatch({ type: 'projCreatorShown' })} }> <FontAwesomeIcon icon={ faXmark }/> </div>

        <input className="creator-input" id="input-1" ref={ projectNameRef } type="text" placeholder="Name of the project"/>
        <button className="creator-input" id="input-2" onClick={toggleColorPicker}><ColorInput/></button>
        {pickerActive ? <ColorPicker/> : null}
        
        <button className="creator-btn" onClick={ createProject }>CONFIRM</button>
      </div>
    </div>
  )
}