
import express from "express";
import * as activity from "./activity.controller.js";
import { protect } from "../../middlewares/protect.js";
import { validateFields } from "../../middlewares/validateFields.js";
import { activityValidation } from "../../utils/validationSchemas/activityValidation.js";

const activityRouter = express.Router();

activityRouter.use(protect);

activityRouter.post(
  "/",
  validateFields(activityValidation.addActivity),
  activity.addActivity
);

activityRouter.get(
  "/user",
  validateFields(activityValidation.getUserActivityQuery, "query"),
  activity.getUserActivity
);

activityRouter.get(
  "/project/:projectId",
  validateFields(activityValidation.idParam, "params"),
  validateFields(activityValidation.getProjectActivityQuery, "query"),
  activity.getProjectActivity
);

activityRouter.get(
  "/stats",
  validateFields(activityValidation.activityStatsQuery, "query"),
  activity.getActivityStats
);

activityRouter.delete(
  "/:id",
  validateFields(activityValidation.idParam, "params"),
  activity.deleteActivity
);

export default activityRouter;
