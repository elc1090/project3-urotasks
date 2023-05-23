import express from 'express';
import projectController from './controllers/projectController.js'
import taskController from './controllers/taskController.js';

const router = express.Router();

/********************************************************************************************/
/*** project routes ***/
router.post('/project-create', async (req, res) => 
{
  const project = req.body;
  await projectController.create(project);
  res.send("project received!");
});

router.get('/project-read', async (req, res) => 
{
  await projectController.read(req, res);
  console.log(`********** ${new Date()}: successfully sent projects data to client`)
});

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

export default router;