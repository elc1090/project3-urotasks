import { useContext } from 'react';
import { ToggleMenuContext } from '../../../pages/home';

import ButtonClose from '../../utils/btn--close';

export default function MenuHeader()
{
  const { toggleMenu } = useContext(ToggleMenuContext);

  return (
    <div className='menu__header'>
      <a className='menu__logo' href='/'><img src='img/logo--dark_theme.svg' alt='urotasks_logo'/></a>  
      <ButtonClose onClick={ toggleMenu }/>
    </div>
  )
}