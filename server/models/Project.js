import mongoose from "mongoose";
import _id from './_id.js';

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
  }
}, { strict: false });


export default mongoose.model("Project", projectSchema);