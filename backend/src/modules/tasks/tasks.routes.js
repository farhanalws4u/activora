import express from "express";
import * as task from "./tasks.controller.js";
import { protect } from "../../middlewares/protect.js";
import { validateFields } from "../../middlewares/validateFields.js";
import { taskValidation } from "../../utils/validationSchemas/taskValidation.js";

const taskRouter = express.Router();

taskRouter.use(protect);

// Task CRUD Routes
taskRouter.post("/",
  validateFields(taskValidation.createTask),
  task.createTask
);

taskRouter.get("/", task.getAllTasks);

taskRouter.get("/search",
  validateFields(taskValidation.searchQuery, 'query'),
  task.searchTasks
);

taskRouter.get("/user-tasks", task.getUserTasks);

taskRouter.get("/stats", task.getTaskStats);

taskRouter.get("/project/:projectId",
  validateFields(taskValidation.idParam, 'params'),
  task.getProjectTasks
);

taskRouter.get("/:id",
  validateFields(taskValidation.idParam, 'params'),
  task.getTaskById
);

taskRouter.put("/:id",
  validateFields(taskValidation.idParam, 'params'),
  validateFields(taskValidation.updateTask),
  task.updateTask
);

taskRouter.delete("/:id",
  validateFields(taskValidation.idParam, 'params'),
  task.deleteTask
);

// Task Features Routes
taskRouter.post("/:id/comments",
  validateFields(taskValidation.idParam, 'params'),
  validateFields(taskValidation.addTaskComment),
  task.addTaskComment
);

taskRouter.patch("/:id/status",
  validateFields(taskValidation.idParam, 'params'),
  validateFields(taskValidation.updateTaskStatus),
  task.updateTaskStatus
);

taskRouter.patch("/:id/progress",
  validateFields(taskValidation.idParam, 'params'),
  validateFields(taskValidation.updateTaskProgress),
  task.updateTaskProgress
);

taskRouter.post("/:id/attachments",
  validateFields(taskValidation.idParam, 'params'),
  validateFields(taskValidation.addTaskAttachments),
  task.addTaskAttachments
);

export default taskRouter;