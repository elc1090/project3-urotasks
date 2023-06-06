import { useContext } from 'react';
import { ReducerContext } from '../../app';

import '../../css/menu.css';

import MenuHeader from '../menu/header';
import MenuProjects from '../menu/projects'
import MenuUser from '../menu/user';

export default function Menu()
{
  const { state } = useContext(ReducerContext);

  return (
    <div className={`menu ${state.isMenuHidden ? 'menu--hidden' : ''}`} id='menu'>
      <MenuHeader/>
      <MenuProjects/>
      <MenuUser/>
    </div>
  )
}