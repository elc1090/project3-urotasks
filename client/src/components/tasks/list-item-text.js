import { useState, useContext, useRef } from 'react';
import { ActiveProjectContext, ReducerContext } from '../../app';
import { TaskTypeContext } from './lists-container';
import axios from 'axios';

export default function ItemText({ value, taskID }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const { activeProject, setActiveProject } = useContext(ActiveProjectContext);
  const taskType = useContext(TaskTypeContext);
  const { state, dispatch } = useContext(ReducerContext);

  const taskTextRef = useRef();

  function handleContentChange(newContent)
  {
    if (newContent === "")
      return;
    
    const placeholderActiveProject = activeProject;
    const taskList = placeholderActiveProject[taskType];

    for (let i = 0; i < taskList.length; i++)
      if (taskList[i].id === taskID)
        taskList[i].content = newContent;

    placeholderActiveProject[taskType] = taskList;
    setActiveProject(placeholderActiveProject);
    dispatch({ type: 'taskUpdated' });

    axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update`, [activeProject.id, taskType, taskID, newContent])
      .then(function(response) {console.log(response)})
      .catch(function(error) {console.log(error)});
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

    if (taskTextRef.current.value !== '')
      handleContentChange(inputValue);
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
      handleSave();
  }

  return (
    <div className='list-item-text'>
      {
        editing ? (<input style={{width: '100%'}} autoFocus type="text" ref={taskTextRef} value={inputValue} onChange={handleInputChange} onBlur={handleSave} onKeyDown={handleKeyDown}/>) 
                : (<div style={{width: '100%'}} onClick={handleEdit}>{value}</div>)
      }
    </div>
  );
}