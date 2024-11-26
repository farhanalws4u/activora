import { taskModel } from "../../../Database/models/task.model.js";
import { projectModel } from "../../../Database/models/project.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

// Create Task
const createTask = catchAsyncError(async (req, res, next) => {
  const project = await projectModel.findById(req.body.projectId);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const task = new taskModel({
    ...req.body,
    createdBy: req.user._id,
  });
  await task.save();

  res.status(201).json({ message: "success", task });
});

// Get All Tasks
const getAllTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await taskModel
    .find()
    .populate("projectId", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("parentTask", "name")
    .sort("-createdAt");

  res.status(200).json({ message: "success", tasks });
});

// Get Project Tasks
const getProjectTasks = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.params;
  const tasks = await taskModel
    .find({ projectId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("parentTask", "name")
    .sort("-createdAt");

  res.status(200).json({ message: "success", tasks });
});

// Get Single Task
const getTaskById = catchAsyncError(async (req, res, next) => {
  const task = await taskModel
    .findById(req.params.id)
    .populate("projectId", "name")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("parentTask", "name")
    .populate("comments.author", "name email");

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json({ message: "success", task });
});

// Update Task
const updateTask = catchAsyncError(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  const updatedTask = await taskModel
    .findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate("assignedTo", "name email");

  res.status(200).json({ message: "success", task: updatedTask });
});

// Delete Task
const deleteTask = catchAsyncError(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  await task.remove();
  res.status(200).json({ message: "Task deleted successfully" });
});

// Add Comment to Task
const addTaskComment = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const task = await taskModel.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  task.comments.push({ text, author: req.user._id });
  await task.save();

  res.status(200).json({ message: "Comment added successfully", task });
});

// Update Task Status
const updateTaskStatus = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const task = await taskModel.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  task.status = status;
  if (status === "Complete") {
    task.completionDate = new Date();
    task.percentageComplete = 100;
  }
  await task.save();

  res.status(200).json({ message: "Status updated successfully", task });
});

// Update Task Progress
const updateTaskProgress = catchAsyncError(async (req, res, next) => {
  const { percentageComplete } = req.body;
  const task = await taskModel.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  task.percentageComplete = percentageComplete;
  if (percentageComplete === 100) {
    task.status = "Complete";
    task.completionDate = new Date();
  }
  await task.save();

  res.status(200).json({ message: "Progress updated successfully", task });
});

// Get User's Assigned Tasks
const getUserTasks = catchAsyncError(async (req, res, next) => {
  const tasks = await taskModel
    .find({ assignedTo: req.user._id })
    .populate("projectId", "name")
    .populate("createdBy", "name email")
    .sort("-createdAt");

  res.status(200).json({ message: "success", tasks });
});

// Add Task Attachments
const addTaskAttachments = catchAsyncError(async (req, res, next) => {
  const { attachments } = req.body;
  const task = await taskModel.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  task.attachments.push(...attachments);
  await task.save();

  res.status(200).json({ message: "Attachments added successfully", task });
});

// Task Search and Filter
const searchTasks = catchAsyncError(async (req, res, next) => {
  const { query, status, priority, projectId } = req.query;

  const filter = {};
  if (query) {
    filter.name = { $regex: query, $options: "i" };
  }
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (projectId) filter.projectId = projectId;

  const tasks = await taskModel
    .find(filter)
    .populate("projectId", "name")
    .populate("assignedTo", "name email")
    .sort("-createdAt");

  res.status(200).json({ message: "success", tasks });
});

// Get Task Statistics
const getTaskStats = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.query;

  const matchStage = projectId
    ? { projectId: mongoose.Types.ObjectId(projectId) }
    : {};

  const stats = await taskModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgProgress: { $avg: "$percentageComplete" },
        totalEstimatedHours: { $sum: "$estimatedHours" },
        totalActualHours: { $sum: "$actualHours" },
      },
    },
  ]);

  res.status(200).json({ message: "success", stats });
});

export {
  createTask,
  getAllTasks,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment,
  updateTaskStatus,
  updateTaskProgress,
  getUserTasks,
  addTaskAttachments,
  searchTasks,
  getTaskStats,
};
