import express from "express";
import * as activity from "./activity.controller.js";

const activityRouter = express.Router();

activityRouter.post("/", activity.addActivity);


export default activityRouter;
