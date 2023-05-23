import { useContext, useRef, useState } from 'react';
import { ProjectsContext, ActiveProjectContext, ReducerContext } from "../../app";
import axios from 'axios';

import { v4 as uuid } from 'uuid';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { setActiveProject } = useContext(ActiveProjectContext);
  const { projects, setProjects } = useContext(ProjectsContext);
  const { state, dispatch } = useContext(ReducerContext);

  const [color, setColor] = useState('#0FE19E');
  const [pickerActive, setPickerActive] = useState(false);

  function removeFirstTask(projects)
  {
    projects.forEach(project => 
    {
      if (project.todo[0].content === "")
        project.todo.shift();

      if (project.doing[0].content === "")
        project.doing.shift();

      if (project.done[0].content === "")
        project.done.shift();
    })

    return projects;
  }

  async function createProject()
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

    projectNameRef.current.value = '';

    if (projects.length === 0)
      newProject.active = true;

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-create`, newProject)
    
    // quick fix, see why the state is not updated by the time all components rerender
    // forcing to refresh the page to get new project data, instead of using state directly
    //if (newProject.active === true)
      window.location.reload(false);

    /*else
    {
      const newProjects = [...projects, newProject];
      await setProjects(removeFirstTask(newProjects));
      setActiveProject(projects[0]);
      
      dispatch({ type: 'projCreatorShown' });
    }*/
  }

  function toggleColorPicker()
  {
    setPickerActive(!pickerActive);
  }

  function ColorPicker()
  {
    return (
      <div>
        <div onClick={ toggleColorPicker } className='picker__bg'/>
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