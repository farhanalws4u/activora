import mongoose,{model} from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: String, 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const projectModel = model("Project", ProjectSchema);