import mongoose from "mongoose";

import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,

  created_at: Date,
  updated_at: Date,

  content:
  {
    type: String,
    maxlength: 512
  }
});

export default taskSchema;