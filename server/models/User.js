import mongoose from "mongoose";
import idSchema from './_id.js';

const userSchema = new mongoose.Schema(
{
  id: idSchema,
  activeProject: idSchema,

  name: 
  { 
    type: String, 
    required: true,
    maxlength: 64
  }
});

export default mongoose.model("User", userSchema);
