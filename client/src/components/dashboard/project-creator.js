import { useContext, useRef, useState } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from "../../app";
import axios from 'axios';

import { v4 as uuid } from 'uuid';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBarsProgress } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { user, setUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ReducerContext);
  const { projects, setProjects } = useContext(ProjectsContext);

  const [color, setColor] = useState('#0FE19E');
  const [pickerActive, setPickerActive] = useState(false);

  async function createProject()
  {
    let name = projectNameRef.current.value;
    if (name === '') return;

    const newProject = 
    { 
      id: uuid(), 
      name: name,
      color: color,
      todo:  [{ id: uuid(), content: "" }],
      doing: [{ id: uuid(), content: "" }],
      done:  [{ id: uuid(), content: "" }]
    };

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/project-create`, newProject)
      .then(res => {console.log(res);})
      .catch(err => {console.log(err)})

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/user-update`, [user.id, newProject.id, 'activeProject'])
      .then(res => {console.log(res)})
      .catch(err => {console.log(err)})
    
    const userCopy = { ...user };
    userCopy.activeProject = newProject.id;
    setUser(userCopy);

    // gambiarra
    delete newProject.todo; 
    delete newProject.doing; 
    delete newProject.done;

    const newProjects = [...projects, newProject];
    setProjects(newProjects);
    
    if (state.isMenuHidden === false)
    {
      dispatch({ type: 'menuHidden'      });
      dispatch({ type: 'dashboardMoved'  });
      dispatch({ type: 'searchbarSpaced' }); 
    }

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
        <div onClick={ toggleColorPicker } className='chrome-picker__bg'/>
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
    <div className={`proj-creator__bg ${state.isProjCreatorShown ? 'proj-creator__bg--shown' : 'proj-creator__bg--hidden'}`}>
      <div className={`proj-creator ${state.isProjCreatorShown ? 'proj-creator--shown' : 'proj-creator--hidden'}`}>
        <h2 className="proj-creator__title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <div className='btn-close' onClick={ () => {dispatch({ type: 'projCreatorShown' })} }> <FontAwesomeIcon icon={ faXmark }/> </div>

        <input className="proj-creator__input" id="input-1" ref={ projectNameRef } type="text" placeholder="Name of the project" autoFocus/>
        <button className="proj-creator__input" id="input-2" onClick={toggleColorPicker}><ColorInput/></button>
        {pickerActive ? <ColorPicker/> : null}
        
        <button className="creator__submit" onClick={ createProject }>CONFIRM</button>
      </div>
    </div>
  )
}