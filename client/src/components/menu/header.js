import { useContext } from 'react';
import { ToggleMenuContext } from '../../pages/home';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MenuHeader()
{
  const { toggleMenu } = useContext(ToggleMenuContext);

  return (
    <div className='menu__header'>
      <a className='menu__logo' href='/'><img src='img/logo--dark_theme.svg' alt='urotasks_logo'/></a>  
      <div className='btn-close' onClick={ toggleMenu }><FontAwesomeIcon icon={ faXmark }/></div>
    </div>
  )
}