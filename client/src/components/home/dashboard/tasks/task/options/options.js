import React, { useState } from 'react';

import OptionEllipsis from './_option-ellipsis';
import OptionTags from './_option-tags';
import OptionType from './_option-type';
import OptionLocation from './_option-location';
import OptionDelete from './_option-delete';

export const OptionsContext = React.createContext();

export default function TaskOptions({ task })
{
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [optionsShown, setOptionsShown] = useState(false);
  
  const options = 'options-col:' + task.id;
  const optionsElement = document.getElementById(options);


  function toggleOptions()
  { 
    if (!optionsShown)
    {
      setOptionsShown(true)
      document.addEventListener('click', checkClickLocation);
    }

    else
    {
      if (changeTypeOpen === true)
        setChangeTypeOpen(false);

      setOptionsShown(false)
      document.removeEventListener('click', checkClickLocation);
    }
  }

  function checkClickLocation(e)
  {
    console.log('e')
    if (e.target !== optionsElement && !optionsElement?.contains(e.target))
      toggleOptions();
  }

  return (
    <div className='options' id={ options }>
      <OptionsContext.Provider value={{ optionsShown, setOptionsShown, changeTypeOpen, setChangeTypeOpen }}>
        <OptionDelete task={ task } toggleOptions={ toggleOptions }/>
        <OptionLocation task={ task }/>
        <OptionType task={ task }/>
        <OptionTags task={ task }/>
        <OptionEllipsis toggleOptions={ toggleOptions }/>
      </OptionsContext.Provider>
    </div>
  )
}