import mongoose from "mongoose";
import _id from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: _id,

  created_at:
  {
    type: Date,
    default: new Date()
  }, 

  updated_at:
  {
    type: Date,
    default: new Date()
  }, 

  content:
  {
    type: String,
    maxlength: 512
  }
});

export default mongoose.model("Task", taskSchema);