import mongoose from "mongoose";
import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,
  type: String,
  position: Number,

  content:
  {
    type: String,
    maxlength: 1024
  },

  created_at:
  {
    type: Date,
    default: new Date()
  }, 

  updated_at:
  {
    type: Date,
    default: new Date()
  }
}, { _id: false });

const taskModel = mongoose.model("Task", taskSchema);
export { taskSchema, taskModel as Task }