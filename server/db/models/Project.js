import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const idSchema = 
{
  type: String, 
  default: uuid,
  required: true,
  unique: true,
  validate: 
  { 
    validator: function(v) { return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v); },
    message: props => `${props.value} is not a valid uuid v4!`
  }
}

const taskSchema = 
{
  id: idSchema,
    
  content:
  {
    type: String,
    maxlength: 512
  }
}

const projectSchema = new mongoose.Schema(
{
  id: idSchema,
  
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
    type: [taskSchema],
    default: [{ id: uuid(), content: "" }]
  },

  doing: 
  {
    type: [taskSchema],
    default: [{ id: uuid(), content: "" }]
  },

  done: 
  {
    type: [taskSchema],
    default: [{ id: uuid(), content: "" }]
  }
});


export default mongoose.model("Project", projectSchema);