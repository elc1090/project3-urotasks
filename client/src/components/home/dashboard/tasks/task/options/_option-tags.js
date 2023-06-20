import { useContext } from 'react';
import { OptionsContext } from './options';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

export default function OptionTags({ task })
{
  const { optionsShown } = useContext(OptionsContext);

  return (
    <div className={ `option option--tags ${optionsShown ? 'option--shown' : ''}` }>
      <div className='option__icon'><FontAwesomeIcon icon={ faTag }/></div>
    </div>
  )
}