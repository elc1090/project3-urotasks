import express from 'express';
import mongoose from 'mongoose';

import Project from '../models/Project.js';

export async function createProject(projectData)
{
  const project = new Project(projectData);

  await project.save();
  console.log(project);
}

export async function updateProject(projectData, updateType)
{
  if (updateType === 'name')
  {
    await Project.updateOne({ id: projectData.id }, { name: projectData.name });
    console.log(`Project name successfully changed to ${projectData.name}`);
  }

  else if (updateType === 'color')
  {
    await Project.updateOne({ id: projectData.id }, { color: projectData.color });
    console.log(`Project color successfully changed to ${projectData.color}`);
  }
}

export async function deleteProject(projectData)
{
  await Project.deleteOne({ id: projectData.id });
  console.log(`deleted project: | ${projectData.id} | ${projectData.name} |`);
}