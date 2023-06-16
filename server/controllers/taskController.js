import Project from '../models/Project.js';
import Task from '../models/Task.js';
const taskController = {};

/*********************************************************************************************************************************/
taskController.create = async (projectID, taskData) => 
{
  const newTask = new Task(taskData);

  await newTask.save();
  await Project.updateOne({ id: projectID }, { $push: { tasks: newTask.id } });

  console.log(`${new Date()}: successfully inserted task to project |${projectID}|`)
}

/*********************************************************************************************************************************/
taskController.updateContent = async (taskID, newContent) => 
{
  await Task.updateOne({ id: taskID }, { content: newContent, updated_at: new Date() });
  console.log(`${new Date()}: successfully updated task |${taskID}|`);
}

/*********************************************************************************************************************************/
taskController.updateType = async (projectID, taskID, locations, positions) => 
{
  const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');

  const taskIDs = project.tasks;
  const taskList = await Task.find({ id: { $in: taskIDs } });
  const taskIndex = taskList.findIndex(task => task.id === taskID);
  
  await Task.updateOne({ id: taskList[taskIndex].id }, { type: locations.new, position: positions.new, updated_at: new Date() });

  for (let i = 0; i < taskList.length ; i++) 
    if (taskList[i].type === locations.old && taskList[i].position > positions.old)
      await Task.updateOne({ id: taskList[i].id }, { $inc: { position: -1 } });
  
  console.log(`${new Date()}: successfully moved task to |${locations.new}|`);
}

taskController.updatePosition = async (updatedTaskID, otherTaskID, direction) =>
{
  if (direction === 'up')
  {
    await Task.updateOne({ id: updatedTaskID }, { $inc: { position: -1 } });
    await Task.updateOne({ id: otherTaskID }, { $inc: { position: +1 } });
  }

  else if (direction === 'down')
  {
    await Task.updateOne({ id: updatedTaskID }, { $inc: { position: +1 } });
    await Task.updateOne({ id: otherTaskID }, { $inc: { position: -1 } });
  }
}

/*********************************************************************************************************************************/
taskController.delete = async (projectID, taskID, taskType, position) =>
{
  const project = await Project.findOne({ id: projectID }).lean().select('tasks -_id');
  
  const taskIDs = project.tasks;
  const taskList = await Task.find({ id: { $in: taskIDs } });
  const taskIndex = taskIDs.findIndex(task => task === taskID);
  taskIDs.splice(taskIndex, 1);

  await Project.updateOne({ id: projectID }, { $set: { tasks: taskIDs } });
  await Task.deleteOne({ id: taskID });

  for (let i = 0; i < taskList.length ; i++) 
    if (taskList[i].type === taskType && taskList[i].position > position)
      await Task.updateOne({ id: taskList[i].id }, { $inc: { position: -1 } });
      console.log('updated task position');

  console.log(`${new Date()}: successfully deleted task |${taskID}|`);
}

export default taskController;