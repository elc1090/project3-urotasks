import mongoose from "mongoose";
import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,

  type: String,
  
  position: Number,

  /*owned: 
  {
    type: Boolean,
    default: true
  },*/

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
}, { strict: false });

export default mongoose.model("Task", taskSchema);