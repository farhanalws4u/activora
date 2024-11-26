import express from "express";
import * as userController from './user.controller.js'
import { validateFields } from "../../middlewares/validateFields.js";
import { userValidation } from "../../utils/validationSchemas/userValidations.js";
import { protect } from "../../middlewares/protect.js";

const userRouter = express.Router();
userRouter.use(protect);

// User profile routes
userRouter.get("/profile", userController.getCurrentUser);
userRouter.put("/profile",
  validateFields(userValidation.updateProfile),
  userController.updateProfile
);
userRouter.post("/change-password",
  validateFields(userValidation.changePassword),
  userController.changePassword
);

// Admin routes
userRouter.get("/", userController.getAllUsers);
userRouter.post("/",
  validateFields(userValidation.addUser),
  userController.addUser
);
userRouter.put("/:id",
  validateFields(userValidation.updateUser),
  userController.updateUser
);
userRouter.delete("/:id", userController.deleteUser);
  

export default userRouter;
