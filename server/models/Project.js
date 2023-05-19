import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

import _id from './_id.js';
import Task from './Task.js';

const projectSchema = new mongoose.Schema(
{
  id: _id,
  
  active:
  {
    type: Boolean,
    default: true
  },

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
    type: [Task],
    required: false,
    default: [/*{ id: uuid(), content: "" }*/]
  },

  doing: 
  {
    type: [Task],
    required: false,
    default: [/*{ id: uuid(), content: "" }*/]
  },

  done: 
  {
    type: [Task],
    required: false,
    default: [/*{ id: uuid(), content: "" }*/]
  }
});


export default mongoose.model("Project", projectSchema);