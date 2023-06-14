import express from 'express';

import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();

router.get('/initial-load', async (req, res) =>  
{
  try
  {
    const user = await User.findOne({ id: "1d33e9a5-697b-4d80-b2fb-d854fb2f7fa2" });
    const projectsMeta = await Project.find().lean().select('-tasks -created_at -updated_at -_id -__v');
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

router.get('/get-tasks', async (req, res) => 
{
  const projectID = req.query.projectID;
  const project = await Project.findOne({ id: projectID }).select('tasks -_id');
  
  const taskIDs = project.tasks;
  const tasks = await Task.find({ id: { $in: taskIDs } }).lean().select('-_id -__v');

  res.status(200).send(tasks);
});

/********************************************************************************************/
/*** project routes ***/
router.post('/project-create', async (req, res) => 
{
  const project = req.body;
  await projectController.create(project);
  res.sendStatus(201);
});

router.get('/project-read', async (req, res) => 
{
  await projectController.read(req, res);
  console.log(`${new Date()}: successfully sent projects data to client`)
});

router.post('/project-update', async (req, res) => 
{
  const [project, updateType] = [req.body[0], req.body[1]]
  await projectController.update(project, updateType);
  res.sendStatus(201);
})

router.post('/project-delete', async (req, res) => 
{
  const projectID = req.body.projectID;
  await projectController.delete(projectID);
  res.sendStatus(200);
});

/********************************************************************************************/
/*** task routes ***/
router.post('/task-create', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskData] = [data[0], data[1]];

  await taskController.create(projectID, taskData);
  res.sendStatus(201);
});

router.post('/task-update', async (req, res) => 
{
  const data = req.body;
  const [taskID, newContent] = [data[0], data[1]];

  await taskController.update(taskID, newContent);
  res.sendStatus(200);
})

router.post('/task-move', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, locations, positions] = [data[0], data[1], data[2], data[3]]

  await taskController.move(projectID, taskID, locations, positions);
  res.sendStatus(200);
});

router.post('/task-delete', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType, location] = [data[0], data[1], data[2], data[3]]

  await taskController.delete(projectID, taskID, taskType, location);
  res.sendStatus(200);
})

/********************************************************************************************/
/*** user routes ***/
router.post('/user-create', async (req, res) => 
{
  await userController.create();
  console.log(`${new Date()}: successfully created user`)
  res.sendStatus(201);
});

/*router.get('/user-read', async (req, res) =>
{
  await userController.read(req, res);
  console.log(`${new Date()}: successfully sent user data to client`)
})*/


router.post('/user-update', async (req, res) => 
{
  const data = req.body;
  const [userID, projectID, updateType] = [data[0], data[1], data[2]];
  
  await userController.update(userID, projectID, updateType);
  res.sendStatus(200);
});

export default router;