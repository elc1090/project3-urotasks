import OptionTags from './_option-tags';
import OptionType from './_option-type';
import OptionLocation from './_option-location';
import OptionDelete from './_option-delete';

export default function TaskOptions({ task })
{
  return (
    <div className='options'>
      <OptionTags task={ task }/>
      <OptionType task={ task }/>
      <OptionLocation task={ task }/>
      <OptionDelete task={ task }/>
    </div>
  )
}