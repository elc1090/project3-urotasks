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
      let activeTasks = 0;
    
      if (projects[i].tasks[0].content === "") 
        projects[i].tasks.splice(0, 1);
      
      for (let j = 0; j < projects[i].tasks.length; j++)
      {
        if (projects[i].tasks[j].type === 'todo' || projects[i].tasks[j].type === 'doing')
          activeTasks++;
      }

      projects[i].set('activeTasks', activeTasks);
      console.log(projects[i]);
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
  const [projectID, taskData] = [data[0], data[1]];

  await taskController.create(projectID, taskData);
  res.sendStatus(201);
});

router.post('/task-update', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, newContent] = [data[0], data[1], data[2]];

  await taskController.update(projectID, taskID, newContent);
  res.sendStatus(200);
})

router.post('/task-move', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID, moveLocation] = [data[0], data[1], data[2]]

  await taskController.move(projectID, taskID, moveLocation);
  res.sendStatus(200);
});

router.post('/task-delete', async (req, res) => 
{
  const data = req.body;
  const [projectID, taskID] = [data[0], data[1]]

  await taskController.delete(projectID, taskID);
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