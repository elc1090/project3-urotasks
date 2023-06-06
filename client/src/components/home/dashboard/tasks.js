import React, { useState, useContext, useRef } from "react";
import { ProjectsContext } from "../../../app";
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import Task from './tasks/task'
import List from '../../utils/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

export const TaskTypeContext = React.createContext();

export default function ColumnContainer({ taskType })
{
  const { activeProject, setActiveProject } = useContext(ProjectsContext);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const taskTextRef = useRef();

  let taskTypeName;
  switch(taskType)
  {
    case "todo":  taskTypeName = "TO-DO"; break;
    case "doing": taskTypeName = "DOING"; break;
    case "done":  taskTypeName = "DONE";  break;
    default: break;
  }

  function handleTextChange(newContent) 
  { 
    const activeProjectCopy = { ...activeProject }
    const newTask = { id: uuid(), content: newContent, created_at: new Date(), updated_at: new Date() }

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-create`, [activeProjectCopy.id, taskType, newTask])
      .then(res => {console.log(res)})
      .catch(err => {console.log(err)})

    activeProjectCopy[taskType].push(newTask);
    setActiveProject(activeProjectCopy);
  }

  function handleSave() 
  {
    setEditing(false);

    if (taskTextRef.current.value !== '')
      handleTextChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
    
    else if (e.key === "Escape")
    {
      setEditing(false);
      setInputValue('');
    }
  }

  function handleInputGrowth()
  {
    const textArea = document.getElementById('text-area');

    textArea.addEventListener('input', () => 
    {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    });
  }

  return (
    <div className="tasks__container">
      <h2 className="tasks__container__header">{taskTypeName}</h2>
      <div className="tasks__container__options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      
      <TaskTypeContext.Provider value={taskType}>
      {
        activeProject?.[taskType] 
          ? <List elements={ activeProject[taskType] } ListItem={ Task } classes='tasks__list'/> 
          : null
      }
      </TaskTypeContext.Provider>
      
      <div className="tasks__add">
      {
        editing 
          ? <textarea 
              style={{ width: '100%', overflow: 'hidden' }} 
              id='text-area' 
              ref={ taskTextRef } 
              value={ inputValue } 
              onChange={ e => {setInputValue(e.target.value)} } 
              onBlur={ handleSave } 
              onKeyDown={ handleKeyDown }
              onInput={ handleInputGrowth }
              autoFocus
            />
          
          : (<button onClick={ () => {setEditing(true)} } className="btn--add-task"><FontAwesomeIcon icon={faPlus}/><span> Add task</span></button>)
      }
      </div>
    </div>
  )
}