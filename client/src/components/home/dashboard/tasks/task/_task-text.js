import { useState, useContext, useRef } from 'react';
import { ProjectsContext, ReducerContext } from '../../../../../app';
import axios from 'axios';

export default function ItemText({ value, taskID }) 
{
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const { dispatch } = useContext(ReducerContext);
  const { activeProject, setActiveProject } = useContext(ProjectsContext);

  const taskTextRef = useRef();

  function handleContentChange(newContent)
  {
    if (newContent === "")
      return;

    const oldTaskList = JSON.parse(JSON.stringify(activeProject.tasks));
    
    const taskList = activeProject.tasks.map(taskObj => 
    {
      if (taskObj.id === taskID && taskObj.content !== newContent)
      {
        taskObj.content = newContent;

        axios.post(`${process.env.REACT_APP_SERVER_ROUTE}/task-update?type=content`, [taskID, newContent])
          .then( res => {console.log(res)} )
          .catch(err => 
          {
            console.log(err);
            setActiveProject({ ...activeProject, tasks: oldTaskList });
          })
      }

      return taskObj;
    });

    setActiveProject({ ...activeProject, tasks: taskList });
  }

  async function handleEdit() 
  {
    await setEditing(true);

    const textArea = document.getElementById('text-area');
    const end = textArea.value.length;
    
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
    
    textArea.setSelectionRange(end, end);
    textArea.focus();
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
    <div className='task__text'>
      {
        editing 
        ? <textarea 
            style={{ width: '100%', overflow: 'hidden' }} 
            id='text-area' 
            ref={ taskTextRef } 
            value={ inputValue } 
            onChange={ e => {setInputValue(e.target.value);} } 
            onBlur={ handleSave } 
            onKeyDown={ handleKeyDown }
            onInput={ handleInputGrowth }
          />
   
        : (<div style={{width: '100%'}} onClick={handleEdit}>{value}</div>)
      }
    </div>
  );
}