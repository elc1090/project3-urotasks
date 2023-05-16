import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    email: 
    {
      type: String,
      required: true,
      lowercase: true
    },
    
    createdAt: 
    {
      type: Date,
      immutable: true,
      default: () => Date.now()
    },

    updatedAt:
    {
      type: Date,
      default: () => Date.now()
    }
  }
)

export default mongoose.model("User", userSchema)