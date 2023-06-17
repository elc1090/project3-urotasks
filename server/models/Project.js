import mongoose from "mongoose";
import idSchema from './_id.js';

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

  tasks: [String],

  activeTasks:
  {
    type: Number,
    default: -1
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