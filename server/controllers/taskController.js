import Project from '../models/Project.js';
import { Task } from '../models/Task.js';
const taskController = {};

/*****************************************************************************************************************/
taskController.create = async (projectID, taskData) => 
{
  const newTask = new Task(taskData);
  await Project.updateOne({ id: projectID }, { $push: { tasks: newTask } });
  console.log(`${new Date()}: successfully inserted task to project |${projectID}|`)
}

/*****************************************************************************************************************/
taskController.update = async (projectID, taskID, newContent) => 
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project.tasks;

  for (let i = 0; i < taskList.length; i++)
  {
    if (taskList[i].id === taskID)
    {
      taskList[i].content = newContent;
      taskList[i].updated_at = new Date();
    }
  }

  await Project.updateOne({ id: projectID }, { tasks: taskList });
  console.log(`${new Date()}: successfully updated task |${taskID}|`);
}

/*****************************************************************************************************************/
taskController.move = async (projectID, taskID, locations, positions) => 
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project.tasks;

  const taskIndex = taskList.findIndex(task => task.id === taskID);
  
  taskList[taskIndex].type = locations.new;
  taskList[taskIndex].position = positions.new;
  taskList[taskIndex].updated_at = new Date();

  for (let i = 0; i < taskList.length ; i++)
    if (taskList[i].type === locations.old && taskList[i].position > positions.old)
      taskList[i].position = taskList[i].position - 1;

  await Project.updateOne({ id: projectID }, { tasks: taskList })
  console.log(`${new Date()}: successfully moved task to |${locations.new}|`);
}

/*****************************************************************************************************************/
taskController.delete = async (projectID, taskID) =>
{
  const project = await Project.findOne({ id: projectID });
  const taskList = project.tasks;

  if (taskList.length <= 1)
  {
    taskList[0].content = "";
    taskList[0].type = "todo";
    taskList[0].position = 0;
  }

  else
  {
    const taskIndex = taskList.findIndex(task => task.id === taskID);
    taskList.splice(taskIndex, 1);
  }

  await Project.updateOne({ id: projectID }, { $set: { tasks: taskList } });
  console.log(`${new Date()}: successfully deleted task |${taskID}|`);
}

export default taskController;