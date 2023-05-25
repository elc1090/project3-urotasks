import mongoose from "mongoose";
import _id from './_id.js';

const userSchema = new mongoose.Schema(
{
  id: _id,
  activeProject: _id,

  name: 
  { 
    type: String, 
    required: true,
    maxlength: 64
  }
});

export default mongoose.model("User", userSchema);
