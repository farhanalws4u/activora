import mongoose, { model } from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
  },
  description: {
    type: String,
    trim: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Planning", "Active", "On Hold", "Completed"],
    default: "Planning",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["Admin", "Member"],
        default: "Member",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  category: {
    type: String,
    enum: ["Development", "Design", "Marketing", "Other"],
    default: "Other",
  },
  attachments: [
    {
      name: String,
      url: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  milestones: [
    {
      name: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.index({ name: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ "members.user": 1 });
ProjectSchema.index({ admin: 1 });

ProjectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

ProjectSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

ProjectSchema.methods.isAdmin = function (userId) {
  return this.admin.toString() === userId.toString();
};

export const projectModel = model("Project", ProjectSchema);
