import mongoose, { model } from "mongoose";

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 255,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Draft", "Planned", "Started", "Blocked", "Complete", "Deferred"],
    default: "Draft",
  },
  priority: {
    type: String,
    enum: ["P1", "P2", "P3"],
    default: "P3",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  completionDate: {
    type: Date,
  },
  percentageComplete: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  actualHours: {
    type: Number,
    default: 0,
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  isMilestone: {
    type: Boolean,
    default: false,
  },
  attachments: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  comments: [
    {
      text: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add pre-save middleware to update the updatedAt field
TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const taskModel = model("Task", TaskSchema);
