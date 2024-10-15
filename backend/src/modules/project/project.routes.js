import express from "express";
import * as project from "./project.controller.js";

const projectRouter = express.Router();

projectRouter.post("/", project.addProject);
projectRouter.get("/", project.getAllProjects);
projectRouter.post("/:id/addMember", project.addMembers);

export default projectRouter;
