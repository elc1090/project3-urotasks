import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

import idSchema from './_id.js';
import { taskSchema } from './Task.js';

const projectSchema = new mongoose.Schema(
{
  id: idSchema,
  
  name: 
  { 
    type: String, 
    required: true,
    maxlength: 128
  },
  
  color: 
  { 
    type: String, 
    require: true,
    maxlength: 7
  },

  tasks:
  {
    type: [taskSchema],
    default: [{id: uuid(), type: "todo", content: ""}]
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

export default mongoose.model("Project", projectSchema);