import express from 'express';

import Project from './models/Project.js';
import Task from './models/Task.js';
import User from './models/User.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();

/********************************************************************************************/
/*** general routes ***/
router.get('/initial-load', async (req, res) =>  
{
  try
  {
    const user = await User.findOne({ id: "1d33e9a5-697b-4d80-b2fb-d854fb2f7fa2" });
    const projectsMeta = await Project.find().lean().select('-created_at -updated_at -_id -__v');
    
    await Promise.all (projectsMeta.map(async project => 
    {
      if (project.activeTasks === -1)
      {
        await Task.countDocuments({ id: { $in: project.tasks }, type: { $in: ['todo', 'doing'] } })
        .then(async count => 
        {
          await Project.updateOne({ id: project.id }, { activeTasks: count });
          project.activeTasks = count;
        })
        .catch( err => {console.log(err)} )
      }

      delete project.tasks;
      return project;
    }))
    
    const data = [user, projectsMeta];

    res.status(200).send(data);
    console.log(`${new Date()}: successfully sent data to client`)
  }
  catch (err)
  {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

/********************************************************************************************/
/*** project routes ***/
router.post('/project-create', async (req, res) => 
{
  const project = req.body;
  
  await projectController.create(project);
  res.sendStatus(201);
});

router.post('/project-update', async (req, res) => 
{
  const type = req.query.type;

  if (type === 'name')
  {
    const [projectID, newName] = [req.body[0], req.body[1]];
    await projectController.updateName(projectID, newName);
  }
  
  else if (type === 'color')
  {
    const [projectID, newColor] = [req.body[0], req.body[1]];
    await projectController.updateColor(projectID, newColor);
  }

  res.sendStatus(200);
})

router.post('/project-delete', async (req, res) => 
{
  const projectID = req.body[0];
  
  await projectController.delete(projectID);
  res.sendStatus(200);
});

/********************************************************************************************/
/*** task routes ***/
router.get('/tasks-get', async (req, res) => 
{
  const projectID = req.query.projectID;
  const project = await Project.findOne({ id: projectID }).select('tasks -_id');
  
  const taskIDs = project.tasks;
  const tasks = await Task.find({ id: { $in: taskIDs } }).lean().select('-_id -__v');

  res.status(200).send(tasks);
});

router.post('/task-create', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskData] = [data[0], data[1]];

  await taskController.create(projectID, taskData);
  res.sendStatus(201);
});

router.post('/task-update', async (req, res) => 
{
  const type = req.query.type;
  
  if (type === 'content')
  {
    const [taskID, newContent] = [req.body[0], req.body[1]];
    await taskController.updateContent(taskID, newContent);
  }

  else if (type === 'type')
  {
    const [projectID, taskID, locations, positions] = [req.body[0], req.body[1], req.body[2], req.body[3]]
    await taskController.updateType(projectID, taskID, locations, positions);
  }

  else if (type === 'position')
  {
    const [updatedTaskID, otherTaskID, direction] = [req.body[0], req.body[1], req.body[2]];
    await taskController.updatePosition(updatedTaskID, otherTaskID, direction);
  }

  res.sendStatus(200);
});

router.post('/task-delete', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType, location] = [data[0], data[1], data[2], data[3]]

  await taskController.delete(projectID, taskID, taskType, location);
  res.sendStatus(200);
});

/********************************************************************************************/
/*** user routes ***/
router.post('/user-create', async (req, res) => 
{
  const userData = req.body[0];
  
  await userController.create(userData);
  res.sendStatus(201);
});

router.post('/user-update', async (req, res) => 
{
  const type = req.query.type;
  
  if (type === 'activeProject')
  {
    const [userID, projectID] = [req.body[0], req.body[1]];
    await userController.updateActiveProject(userID, projectID);
  }
  
  res.sendStatus(200);
});

export default router;