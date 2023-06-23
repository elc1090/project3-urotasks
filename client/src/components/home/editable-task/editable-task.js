import { useContext } from 'react';
import { TaskEditorContext } from '../../../pages/home';

export default function EditableTask()
{
  const { editorShown, setEditorShown, editorParams } = useContext(TaskEditorContext);

  const style = 
  {
    left: editorParams.x, 
    top: editorParams.y,
    width: editorParams.w
  }

  return (
    <>
      <div className={`editable__bg ${editorShown ? 'editable__bg--shown' : ''}`} onClick={ () => {setEditorShown(false)} }/>

      <div className={`editable ${editorShown ? 'editable--shown' : ''}`} style={style}>
        <p>{ editorParams.taskData?.id }</p>
        <p>{ editorParams.taskData?.content }</p>
        <p>{ editorParams.taskData?.content }</p>
        <p>{ editorParams.taskData?.content }</p>
      </div>
    </>
  )
}