import React, { useState, useContext, useRef } from "react";
import { ProjectsContext } from "../../../../app";
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import Task from './task/task'
import List from '../../../utils/list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

export const TaskTypeContext = React.createContext();

export default function TasksContainer({ taskType })
{
  const { activeProject, setActiveProject } = useContext(ProjectsContext);
  const tasksArray = activeProject?.tasks.filter(task => task.type === taskType);

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

  function handleTextChange(content) 
  { 
    let greatestPosition = 0;
    for (let i = 0; i < activeProject.tasks.length; i++)
      if (activeProject.tasks[i].type === taskType && activeProject.tasks[i].position > greatestPosition)
        greatestPosition = activeProject.tasks[i].position

    const newPosition = greatestPosition + 1;

    const newTask = 
    { 
      id: uuid(), 
      type: taskType,
      position: newPosition,
      content: content, 
      created_at: new Date(), 
      updated_at: new Date() 
    }

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-create`, [activeProject.id, newTask])
      .then(res => {console.log(res)})
      .catch(err => {console.log(err)})

    const activeProjectCopy = { ...activeProject }

    if (!Array.isArray(activeProjectCopy.tasks))
      activeProjectCopy.tasks = [];

    activeProjectCopy.tasks.push(newTask);
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
    <div className="tasks">
      <h2 className="tasks__header">{taskTypeName}</h2>
      <div className="tasks__options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      
      <TaskTypeContext.Provider value={ taskType }>
      {
        activeProject?.tasks
          ? <List elements={ tasksArray.sort((a, b) => {return a.position - b.position}) } ListItem={ Task } classes='tasks__list'/> 
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
          
          : (<button onClick={ () => {setEditing(true)} }><FontAwesomeIcon icon={faPlus}/><span> Add task</span></button>)
      }
      </div>
    </div>
  )
}