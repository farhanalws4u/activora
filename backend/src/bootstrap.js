import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import activityRouter from "./modules/activity/activity.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import projectRouter from "./modules/project/project.routes.js";
import taskRouter from "./modules/tasks/tasks.routes.js";
import userRouter from "./modules/user/user.routes.js";

import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {

  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/project", projectRouter);
  app.use("/api/v1/activity", activityRouter);
  app.use("/api/v1/task", taskRouter);

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  });


  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint was not found", 404));
  });

  app.use(globalErrorHandling);
}
