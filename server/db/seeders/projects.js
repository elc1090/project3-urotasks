import express from 'express';
import mongoose from 'mongoose';

import Project from '../../models/Project.js';
import projectSeeds from './projects.json' assert { type: "json" };

const seedProjects = async () =>
{
  await Project.deleteMany({});
  await Project.insertMany(projectSeeds);
};

mongoose.connect('mongodb://127.0.0.1:27017/urotasks');
seedProjects().then(() => {mongoose.connection.close();});