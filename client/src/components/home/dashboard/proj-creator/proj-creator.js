import { useContext, useRef, useState } from 'react';
import { ProjectsContext, ReducerContext, UserContext } from "../../../../app";
import { ToggleMenuContext } from '../../../../pages/home';
import { v4 as uuid } from 'uuid';
import axios from 'axios';


import { ButtonGlow } from '../../../utils/buttons';
import { ChromePicker } from 'react-color';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ProjCreator()
{
  const projectNameRef = useRef();
  
  const { toggleMenu } = useContext(ToggleMenuContext);
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
      toggleMenu();

    dispatch({ type: 'projCreatorShown' }); 

    projectNameRef.current.value = '';
  }

  function ColorPicker()
  {
    return (
      <>
        <div onClick={ () => {setPickerActive(!pickerActive)} } className='chrome-picker__bg'/>
        <ChromePicker color={ color } onChangeComplete={ (color) => {setColor(color.hex)} }/> 
      </>
    )
  }

  function ColorInput()
  {
    const colorStyle = {backgroundColor: color, color: color, borderRadius: "3px",};
    return <div className='input-color' style={colorStyle}>.</div>
  }

  function toggleProjectCreator()
  {
    if (state.isMenuHidden === false)
      toggleMenu();

    dispatch({ type: 'projCreatorShown' })
  }

  return (
    <>
      <div className={`proj-creator__bg ${state.isProjCreatorShown ? 'proj-creator__bg--shown' : 'proj-creator__bg--hidden'}`} onClick={ toggleProjectCreator }/>

      <div className={`proj-creator ${state.isProjCreatorShown ? 'proj-creator--shown' : 'proj-creator--hidden'}`}>
        <h2 className="proj-creator__title">CREATE PROJECT <FontAwesomeIcon icon={ faBarsProgress }/> </h2>
        <ButtonGlow onClick={ toggleProjectCreator } icon={ faXmark }/>
        
        <input className="proj-creator__input" id="input-1" ref={ projectNameRef } type="text" placeholder="Name of the project" autoFocus/>
        <button className="proj-creator__input" id="input-2" onClick={ () => {setPickerActive(!pickerActive)} }><ColorInput/></button>
        {pickerActive ? <ColorPicker/> : null}
        
        <button className="proj-creator__submit" onClick={ createProject }>CONFIRM</button>
      </div>
    </>
  )
}