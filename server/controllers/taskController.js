import Project from '../models/Project.js';
import { Task } from '../models/Task.js';
const taskController = {};

/*****************************************************************************************************************/
taskController.create = async (projectID, taskType, taskData) => 
{
  const newTask = new Task(taskData);
  await Project.updateOne({ id: projectID }, { $push: { [taskType]: newTask } });
  console.log(`${new Date()}: successfully inserted task |${taskData.id}| to project |${projectID}|`)
}

/*****************************************************************************************************************/
taskController.update = async (projectID, taskType, taskID, newContent) => 
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project[taskType];

  for (let i = 0; i < taskList.length; i++)
  {
    if (taskList[i].id === taskID)
    {
      taskList[i].content = newContent;
      taskList[i].updated_at = new Date();
    }
  }

  await Project.updateOne({ id: projectID }, { [taskType]: taskList });
  console.log(`${new Date()}: successfuly updated task |${taskID}|`);
}

/*****************************************************************************************************************/
taskController.move = async (projectID, taskID, taskType, moveLocation) => 
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project[taskType];
  const moveLocationList = project[moveLocation];
  
  const taskIndex = taskList.findIndex(task => task.id === taskID);
  const task = taskList[taskIndex];
  
  task.updated_at = new Date();
  moveLocationList.push(task);

  if (taskList.length <= 1)
    taskList[0].content = "";

  else
    taskList.splice(taskIndex, 1);

  await Project.updateOne({ id: projectID }, { [taskType]: taskList, [moveLocation]: moveLocationList })
  console.log(`${new Date()}: successfuly moved task |${taskID}| from |${taskType}| to |${moveLocation}|`);
}

/*****************************************************************************************************************/
taskController.delete = async (projectID, taskID, taskType) =>
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project[taskType];

  if (taskList.length <= 1)
    taskList[0].content = "";

  else
  {
    const taskIndex = taskList.findIndex(task => task.id === taskID);
    taskList.splice(taskIndex, 1);
  }

  await Project.updateOne({ id: projectID }, { $set: { [taskType]: taskList } });
  console.log(`${new Date()}: successfully deleted task |${taskID}|`);
}

export default taskController;