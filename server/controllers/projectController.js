import Project from '../models/Project.js';

const projectController = {};

/*****************************************************************************************************************/
projectController.create = async (projectData) =>
{
  const project = new Project(projectData);
  await project.save();

  console.log(`${new Date()}: successfully created project: ${projectData.name}`);
}

/*****************************************************************************************************************/
projectController.read = async (req, res) =>
{
  try
  {
    const projects = await Project.find();
    res.status(200).send(projects);

    console.log(`${new Date()}: successfully sent projects data to client`)
  }

  catch (err)
  {
    console.log(err);
    res.status(500).send("Internal server error");
  }
}

/*****************************************************************************************************************/
projectController.update = async (projectData, updateType) =>
{
  if (updateType === 'name')
  {
    await Project.updateOne({ id: projectData.id }, { name: projectData.name });
    console.log(`${new Date()}: successfully updated project name to: ${projectData.name}`);
  }

  else if (updateType === 'color')
  {
    await Project.updateOne({ id: projectData.id }, { color: projectData.color });
    console.log(`${new Date()}: successfully updated project color to: ${projectData.color}`);
  }
}

/*****************************************************************************************************************/
projectController.delete = async projectID =>
{
  await Project.deleteOne({ id: projectID });
  console.log(`${new Date()}: successfully deleted project: ${projectID}`);
}

export default projectController;