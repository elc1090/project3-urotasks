import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Project from './db/models/Project.js';

const app = express();
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {console.log(`server started runnig on port ${PORT}`)});
app.use(cors());

// mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/urotasks');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "could not establish connection with mongdb"))
db.once("open", () => {console.log("connected to mongodb")});

// seeder
async function storeProject()
{
  const project = new Project(
  {
    name: "ONLINE BUSINESS",
    color: "#a269ff",
    todo:  [{ content: "online business" }, { content: "todo" }], 
    doing: [{ content: "online business" }, { content: "doing" }], 
    done:  [{ content: "online business" }, { content: "done" }]
  });

  await project.save();
  console.log(project);
}

// send data to frontend
app.get('/app', async (req, res) => 
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