import { activityModel } from "../../../Database/models/activity.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

// Create/Update Activity
const addActivity = catchAsyncError(async (req, res, next) => {
  const {
    projectId,
    mouseMovement,
    activeDuration,
    percentageActivity,
    screenshots,
  } = req.body;

  const existingActivity = await activityModel.findOne({
    projectId,
    userId: req.user._id,
    createdAt: {
      $gte: new Date().setHours(0, 0, 0, 0),
      $lt: new Date().setHours(23, 59, 59, 999),
    },
  });

  if (existingActivity) {
    existingActivity.mouseMovement.push(...mouseMovement);
    existingActivity.activeDuration += activeDuration;
    existingActivity.percentageActivity = percentageActivity;
    if (screenshots?.length) {
      existingActivity.screenshots.push(...screenshots);
    }
    await existingActivity.save();
    res.status(200).json({ message: "success", activity: existingActivity });
  } else {
    const activity = new activityModel({
      projectId,
      userId: req.user._id,
      mouseMovement,
      activeDuration,
      percentageActivity,
      screenshots,
    });
    await activity.save();
    res.status(201).json({ message: "success", activity });
  }
});

// Get User's Activity
const getUserActivity = catchAsyncError(async (req, res, next) => {
  const { startDate, endDate, projectId } = req.query;

  const query = {
    userId: req.user._id,
  };

  if (projectId) {
    query.projectId = projectId;
  }

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const activities = await activityModel
    .find(query)
    .populate("projectId", "name")
    .sort("-createdAt");

  res.status(200).json({ message: "success", activities });
});

// Get Project Activity
const getProjectActivity = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.params;
  const { startDate, endDate } = req.query;

  const query = {
    projectId,
  };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const activities = await activityModel
    .find(query)
    .populate("userId", "name email")
    .sort("-createdAt");

  res.status(200).json({ message: "success", activities });
});

// Get Activity Statistics
const getActivityStats = catchAsyncError(async (req, res, next) => {
  const { projectId } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const query = {
    createdAt: { $gte: startDate },
  };

  if (projectId) {
    query.projectId = projectId;
  }

  const stats = await activityModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: {
          userId: "$userId",
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalDuration: { $sum: "$activeDuration" },
        avgActivity: { $avg: "$percentageActivity" },
      },
    },
  ]);

  res.status(200).json({ message: "success", stats });
});

// Delete Activity
const deleteActivity = catchAsyncError(async (req, res, next) => {
  const activity = await activityModel.findById(req.params.id);

  if (!activity) {
    return next(new AppError("Activity not found", 404));
  }

  if (activity.userId.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized", 403));
  }

  await activity.remove();
  res.status(200).json({ message: "Activity deleted successfully" });
});

export {
  addActivity,
  getUserActivity,
  getProjectActivity,
  getActivityStats,
  deleteActivity,
};
