import { activityModel } from "../../../Database/models/activity.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

const addActivity = catchAsyncError(async (req, res, next) => {
  const {
    projectId,
    userId,
    mouseMovement,
    activeDuration,
    percentageActivity,
    screenshots,
  } = req.body;

  console.log(req.body.projectId)
  console.log(req.body.userId)
  console.log(req.body.mouseMovement)
  console.log(req.body.activeDuration)
  console.log(req.body.percentageActivity)

  if (
    !projectId ||
    !userId ||
    !mouseMovement ||
    !activeDuration ||
    !percentageActivity
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const newActivity = new activityModel({
      projectId,
      userId,
      mouseMovement,
      activeDuration,
      percentageActivity,
      screenshots,
    });

    const savedActivity = await newActivity.save();
    res.status(201).json({
      message: "Activity saved successfully",
      data: savedActivity,
    });
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({
      error: "Failed to save activity",
      details: error.message,
    });
  }
});


export { addActivity };
