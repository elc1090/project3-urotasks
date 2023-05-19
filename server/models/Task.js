import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,

  content:
  {
    type: String,
    maxlength: 512
  }
}, { timestamps: true });

export default taskSchema;