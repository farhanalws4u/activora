import express from "express";
import * as project from "./project.controller.js";
import { protect } from "../../middlewares/protect.js";
import {validateFields} from '../../middlewares/validateFields.js'
import {projectValidation} from '../../utils/validationSchemas/projectValidation.js'

const projectRouter = express.Router();

projectRouter.use(protect);

// Project Routes
projectRouter.post("/",
  validateFields(projectValidation.addProject),
  project.addProject
);

projectRouter.get("/", project.getAllProjects);

projectRouter.get("/user-projects", project.getUserProjects);

projectRouter.get("/:id",
  validateFields(projectValidation.idParam, 'params'),
  project.getProjectById
);

projectRouter.put("/:id",
  validateFields(projectValidation.idParam, 'params'),
  validateFields(projectValidation.updateProject),
  project.updateProject
);

projectRouter.delete("/:id",
  validateFields(projectValidation.idParam, 'params'),
  project.deleteProject
);

// Member Management
projectRouter.post("/:id/members",
  validateFields(projectValidation.idParam, 'params'),
  validateFields(projectValidation.addMembers),
  project.addMembers
);

projectRouter.delete("/:id/members/:memberId",
  validateFields(projectValidation.idParam, 'params'),
  project.removeMember
);

// Project Features
projectRouter.post("/:id/comments",
  validateFields(projectValidation.idParam, 'params'),
  validateFields(projectValidation.addComment),
  project.addComment
);

projectRouter.post("/:id/milestones",
  validateFields(projectValidation.idParam, 'params'),
  validateFields(projectValidation.addMilestone),
  project.addMilestone
);

projectRouter.patch("/:id/progress",
  validateFields(projectValidation.idParam, 'params'),
  validateFields(projectValidation.updateProgress),
  project.updateProgress
);

export default projectRouter;
