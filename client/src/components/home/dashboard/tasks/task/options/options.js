import React, { useState, useRef } from 'react';

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
  const [newType, setNewType] = useState('');
  const newTypeRef = useRef();

  function toggleOptions(toggle)
  {
    if (toggle === 'toggle')
    {
      setOptionsShown(!optionsShown);

      if (changeTypeOpen === true)
      {
        setChangeTypeOpen(false);
        setNewType('');
      }
    }

    else
      setOptionsShown(false);
  }

  const options = 'options-col:' + task.id;
  if (optionsShown === true)
  {
    document.addEventListener('click', e => 
    {
      const optionsElement = document.getElementById(options);
  
      if (e.target !== optionsElement && !optionsElement?.contains(e.target))
      {
        setOptionsShown(false);
        setChangeTypeOpen(false);
      }
    })
  }

  return (
    <div className='options' id={ options } onMouseLeave={ !changeTypeOpen ? () => {toggleOptions('hide')} : null  } >
      <OptionsContext.Provider value={{ optionsShown, setOptionsShown, changeTypeOpen, setChangeTypeOpen, newType, setNewType, newTypeRef }}>
        <OptionEllipsis toggleOptions={ toggleOptions }/>
        <OptionTags task={ task }/>
        <OptionType task={ task }/>
        <OptionLocation task={ task }/>
        <OptionDelete task={ task }/>
      </OptionsContext.Provider>
    </div>
  )
}