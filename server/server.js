import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import User from './db/models/User.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log(`server started runnig on port ${PORT}`)});
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/urotasks')

async function storeUser()
{
  const user = new User({ name: "sexo da silva", age: 69, email: "email@gmail.com" });
  await user.save();
  console.log(user);
}

storeUser();