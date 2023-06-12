import OptionsOrient from './_options-orient';
import OptionsDelete from './_options-delete';

export default function TaskbarOptions()
{
  return (
    <div className="options">
      <OptionsOrient/>
      <OptionsDelete/>
    </div>
  )
}