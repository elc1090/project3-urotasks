import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
{
  name: String,
  age: Number,
  email: 
  {
    type: String,
    required: true,
    tolowercase: true
  }
});

export default mongoose.model("User", userSchema);