import mongoose from 'mongoose';

import User from '../../models/User.js';
import userSeeds from './users.json' assert { type: "json" };

const seedProjects = async () =>
{
  await User.deleteMany({});
  await User.insertMany(userSeeds);
};

mongoose.connect('mongodb://127.0.0.1:27017/urotasks');
seedProjects().then(() => {mongoose.connection.close();});