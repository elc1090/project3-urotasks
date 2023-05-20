import Project from '../models/Project.js';

const taskController = {};

taskController.create = async (projectID, taskType, taskData) => 
{
  switch (taskType)
  {
    case 'todo' : await Project.updateOne({ id: projectID }, { $push: { todo : taskData } }); break;
    case 'doing': await Project.updateOne({ id: projectID }, { $push: { doing: taskData } }); break;
    case 'done' : await Project.updateOne({ id: projectID }, { $push: { done : taskData } }); break;
  }

  console.log(`********** ${new Date()}: successfully inserted task |${taskData.id}| to project |${projectID}|`)
}

taskController.update = async (projectID, taskType, taskID, newContent) => 
{
  const project = await Project.findOne({ id: projectID });

  for (let i = 0; i < project[taskType].length; i++)
  {
    if (project[taskType][i].id === taskID)
    {
      project[taskType][i].content = newContent;
      project[taskType][i].updated_at = new Date();
    }
  }

  await project.save();
  console.log(`********** ${new Date()}: successfuly updated task |${taskID}|`);
}

export default taskController;