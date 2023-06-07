import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ButtonGlow({ onClick, icon })
{
  return (
    <div className='btn btn--glow' onClick={ onClick }>
      <FontAwesomeIcon icon={ icon }/>
    </div>
  )
}

export { ButtonGlow };