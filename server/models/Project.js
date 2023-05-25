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
  }
});


export default mongoose.model("Project", projectSchema);