import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import authRouter from "./modules/auth/auth.routes.js";

import userRouter from "./modules/user/user.routes.js";

import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {

  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);


  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint was not found", 404));
  });

  app.use(globalErrorHandling);
}
