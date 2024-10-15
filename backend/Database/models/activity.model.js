import mongoose, { model } from "mongoose";

const ActivitySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mouseMovement: [
    {
      x: Number,
      y: Number,
      timestamp: Date,
    },
  ],
  activeDuration: {
    type: Number, 
    default: 0,
  },
  percentageActivity: {
    type: Number, 
    default: 0,
  },
  screenshots: [
    {
      type: String, 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const activityModel = model("Activity", ActivitySchema);
