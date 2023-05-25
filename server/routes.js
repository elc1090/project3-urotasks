import express from 'express';

import User from './models/User.js';
import Project from './models/Project.js';

import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';

const router = express.Router();

router.get('/data-read', async (req, res) =>  
{
  try
  {
    const projects = await Project.find();
    const user = await User.findOne({ id: "1d33e9a5-697b-4d80-b2fb-d854fb2f7fa2" });
    const data = [user, projects];

    res.send(data);
    console.log(`${new Date()} successfully sent data to client`)
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
  res.send("project received!");
});

/*router.get('/project-read', async (req, res) => 
{
  await projectController.read(req, res);
  console.log(`${new Date()}: successfully sent projects data to client`)
});*/

router.post('/project-update', async (req, res) => 
{
  const [project, updateType] = [req.body[0], req.body[1]]
  await projectController.update(project, updateType);
  res.send("project received!");
})

router.post('/project-delete', async (req, res) => 
{
  const project = req.body;
  await projectController.delete(project);
  res.send("project received!");
});

/********************************************************************************************/
/*** task routes ***/
router.post('/task-create', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskType, taskData] = [data[0], data[1], data[2]];

  await taskController.create(projectID, taskType, taskData);
  res.send("task received!");
});

router.post('/task-update', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskType, taskID, newContent] = [data[0], data[1], data[2], data[3]];

  await taskController.update(projectID, taskType, taskID, newContent);
  res.send("data received!");
})

router.post('/task-move', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType, moveLocation] = [data[0], data[1], data[2], data[3]]

  await taskController.move(projectID, taskID, taskType, moveLocation);
  res.send("data received!");
});

router.post('/task-delete', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType] = [data[0], data[1], data[2]]

  await taskController.delete(projectID, taskID, taskType);
  res.send("data received!");
})

/********************************************************************************************/
/*** user routes ***/
router.post('/user-create', async (req, res) => 
{
  await userController.create();
  console.log(`${new Date()}: successfully created user`)
});

/*router.get('/user-read', async (req, res) =>
{
  await userController.read(req, res);
  console.log(`${new Date()}: successfully sent user data to client`)
})*/


router.post('/user-update-active-project', async (req, res) => 
{
  const data = req.body;
  const [userID, projectID, updateType] = [data[0], data[1], data[2]];
  
  await userController.update(userID, projectID, updateType);
  console.log(`${new Date()}: successfully updated user |${userID}|`);
});

export default router;