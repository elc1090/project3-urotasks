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
    const user = await User.findOne({ id: "1d33e9a5-697b-4d80-b2fb-d854fb2f7fa2" });
    const projects = await Project.find();

    for (let i = 0; i < projects.length; i++)
    {
      if (projects[i].todo[0].content === "") projects[i].todo.splice(0, 1);
      if (projects[i].doing[0].content === "") projects[i].doing.splice(0, 1);
      if (projects[i].done[0].content === "") projects[i].done.splice(0, 1);
    }
 
    const data = [user, projects];

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
  const project = req.body;
  await projectController.delete(project);
  res.sendStatus(200);
});

/********************************************************************************************/
/*** task routes ***/
router.post('/task-create', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskType, taskData] = [data[0], data[1], data[2]];

  await taskController.create(projectID, taskType, taskData);
  res.sendStatus(201);
});

router.post('/task-update', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskType, taskID, newContent] = [data[0], data[1], data[2], data[3]];

  await taskController.update(projectID, taskType, taskID, newContent);
  res.sendStatus(200);
})

router.post('/task-move', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType, moveLocation] = [data[0], data[1], data[2], data[3]]

  await taskController.move(projectID, taskID, taskType, moveLocation);
  res.sendStatus(200);
});

router.post('/task-delete', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, taskType] = [data[0], data[1], data[2]]

  await taskController.delete(projectID, taskID, taskType);
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