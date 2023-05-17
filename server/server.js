import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Project from './db/models/Project.js';
import { createProject, updateProject, deleteProject } from './db/operations/op-project.js';

// ***************************************************************************************
// server settings
const app = express();
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {console.log(`server started runnig on port ${PORT}`)});
app.use(express.json());
app.use(cors());

// ***************************************************************************************
// mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/urotasks');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "could not establish connection with mongdb"))
db.once("open", () => {console.log("connected to mongodb")});

// ***************************************************************************************
// operations
app.post('/project-create', async (req, res) => 
{
  const project = req.body;
  await createProject(project);

  res.send("project received!");
});

app.get('/project-read', async (req, res) => 
{
  try
  {
    const data = await Project.find();
    res.send(data);
  }

  catch (err)
  {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.post('/project-update', async (req, res) => 
{
  const [project, updateType] = [req.body[0], req.body[1]]
  await updateProject(project, updateType);

  res.send("project received!");
})

app.post('/project-delete', async (req, res) => 
{
  const project = req.body;
  await deleteProject(project);

  res.send("project received!");
});





















app.post('/task', async (req, res) => 
{
  const data = req.body;
  const [projId, taskType, task] = [data[0], data[1], data[2]]

  switch (taskType)
  {
    case 'todo' : await Project.updateOne({ id: projId }, { $push: { todo : task } }); break;
    case 'doing': await Project.updateOne({ id: projId }, { $push: { doing: task } }); break;
    case 'done' : await Project.updateOne({ id: projId }, { $push: { done : task } }); break;
  }

  console.log(`project: ${projId}`);
  console.log(`task type: ${taskType}`);
  console.log(`task details: id(${task.id}) content(${task.content})`);

  res.send("data received!");
});
