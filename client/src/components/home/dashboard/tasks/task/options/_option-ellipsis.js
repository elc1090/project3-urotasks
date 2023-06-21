import { useContext } from 'react';
import { OptionsContext } from './options';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function OptionEllipsis({ toggleOptions })
{
  const { optionsShown } = useContext(OptionsContext);

  return (
    <>
      <div className={ `option option--ellipsis ${optionsShown ? 'option--ellipsis--shown' : ''}` } onClick={ toggleOptions }>
        <div className='option__icon'><FontAwesomeIcon icon={ faEllipsisVertical }/></div>
      </div>
    </>
  )
}