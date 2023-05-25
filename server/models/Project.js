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

  todo:
  {
    type: [taskSchema],
    default: [{id: uuid(), content: ""}]
  },

  doing:
  {
    type: [taskSchema],
    default: [{id: uuid(), content: ""}]
  },

  done:
  {
    type: [taskSchema],
    default: [{id: uuid(), content: ""}]
  }

});


export default mongoose.model("Project", projectSchema);