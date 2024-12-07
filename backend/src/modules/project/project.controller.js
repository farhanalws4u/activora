import { projectModel } from "../../../Database/models/project.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

// Create Project
const addProject = catchAsyncError(async (req, res, next) => {
  const project = new projectModel({
    ...req.body,
    admin: req.user._id,
  });
  await project.save();
  res.status(201).json({ message: "success", project });
});

// Get All Projects
const getAllProjects = catchAsyncError(async (req, res, next) => {
  const projects = await projectModel
    .find()
  res.status(200).json({ message: "success", projects });
});

// Get Single Project
const getProjectById = catchAsyncError(async (req, res, next) => {
  const project = await projectModel
    .findById(req.params.id)
    .populate("admin", "name email")
    .populate("members.user", "name email")
    .populate("comments.author", "name email");

  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  res.status(200).json({ message: "success", project });
});

// Update Project
const updateProject = catchAsyncError(async (req, res, next) => {
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  const updatedProject = await projectModel.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "success", project: updatedProject });
});

// Delete Project
const deleteProject = catchAsyncError(async (req, res, next) => {
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  await project.remove();
  res.status(200).json({ message: "Project deleted successfully" });
});

// Add Members
const addMembers = catchAsyncError(async (req, res, next) => {
  const { userId, role } = req.body;
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  if (project.members.some((member) => member.user.toString() === userId)) {
    return next(new AppError("User already a member", 400));
  }

  project.members.push({ user: userId, role: role || "Member" });
  await project.save();

  res.status(200).json({ message: "Member added successfully", project });
});

// Remove Member
const removeMember = catchAsyncError(async (req, res, next) => {
  const { memberId } = req.params;
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  project.members = project.members.filter(
    (member) => member.user.toString() !== memberId
  );
  await project.save();

  res.status(200).json({ message: "Member removed successfully", project });
});

// Add Comment
const addComment = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isMember(req.user._id) && !project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  project.comments.push({ text, author: req.user._id });
  await project.save();

  res.status(200).json({ message: "Comment added successfully", project });
});

// Add Milestone
const addMilestone = catchAsyncError(async (req, res, next) => {
  const { name, dueDate } = req.body;
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  project.milestones.push({ name, dueDate });
  await project.save();

  res.status(200).json({ message: "Milestone added successfully", project });
});

// Update Project Progress
const updateProgress = catchAsyncError(async (req, res, next) => {
  const { progress } = req.body;
  const project = await projectModel.findById(req.params.id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  if (!project.isAdmin(req.user._id)) {
    return next(new AppError("Not authorized", 403));
  }

  project.progress = progress;
  await project.save();

  res.status(200).json({ message: "Progress updated successfully", project });
});

// Get User's Projects
const getUserProjects = catchAsyncError(async (req, res, next) => {
  const projects = await projectModel
    .find({
      $or: [{ admin: req.user._id }, { "members.user": req.user._id }],
    })
    .populate("admin", "name email")
    .populate("members.user", "name email")
    .sort("-createdAt");

  res.status(200).json({ message: "success", projects });
});

export {
  addProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
  addComment,
  addMilestone,
  updateProgress,
  getUserProjects,
};
