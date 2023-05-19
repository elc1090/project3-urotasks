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

export default taskController;