import React, { useState, useContext, useRef } from "react";
import { ActiveProjectContext } from "../../app";
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import TasksList from './list';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

export const TaskTypeContext = React.createContext();

export default function ColumnContainer({ taskType })
{
  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);
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

    axios.post('http://localhost:9000/task-create', [activeProjectCopy.id, taskType, newTask])
      .then(function(response) {console.log(response)})
      .catch(function(error) {console.log(error)})

    activeProjectCopy[taskType].push(newTask);
    setActiveProject(activeProjectCopy);
  }

  function handleInputChange(e) 
  {
    setInputValue(e.target.value);
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

  return (
    <div className="dashboard-tasks-item">
      <h2 className="tasks-item-header">{taskTypeName}</h2>
      <div className="tasks-item-options"><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      <TaskTypeContext.Provider value={taskType}>
        <TasksList tasks={ activeProject[taskType] }/>
      </TaskTypeContext.Provider>
      
      <div className="add-task-container">
        {
          editing ? (<input autoFocus type="text" ref={taskTextRef} value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown} />)
                  : (<button onClick={ () => {setEditing(true)} } className="btn-add-task"><FontAwesomeIcon icon={faPlus}/><span> Add task</span></button>)
        }
      </div>
    </div>
  )
}