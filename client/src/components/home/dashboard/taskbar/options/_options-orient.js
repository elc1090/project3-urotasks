import { useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function TaskbarOrient()
{
  const [tasksColumn, setTasksColumn] = useState(true);

  function setOrientation()
  {
    const orientButton = document.querySelector('.option--orient .fa-bars');
    const tasksContainer = document.getElementById('tasks__container');

    if (tasksColumn)
    {
      setTasksColumn(false);
      orientButton.style.transform = 'rotate(0deg)';
      tasksContainer.style.gridTemplateColumns = '1fr';
    }

    else
    {
      setTasksColumn(true);
      orientButton.style.transform = 'rotate(90deg)';
      tasksContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  }

  return (
    <div className='option option--orient' onClick={ setOrientation }>
      <FontAwesomeIcon icon={ faBars }/>  
    </div>
  )
}