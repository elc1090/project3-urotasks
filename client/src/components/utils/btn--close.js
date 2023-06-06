import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ButtonClose({ onClick })
{
  return (
    <div className='btn--close' onClick={ onClick }>
      <FontAwesomeIcon icon={ faXmark }/>
    </div>
  )
}