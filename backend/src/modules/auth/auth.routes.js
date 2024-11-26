import express from "express";
import * as authController from "./auth.controller.js";
import { validateFields } from "../../middlewares/validateFields.js";
import {userValidation} from '../../utils/validationSchemas/userValidations.js'


const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateFields(userValidation.signUp),
  authController.signUp
);

authRouter.post(
  "/signin",
  validateFields(userValidation.signIn),
  authController.signIn
);

authRouter.post(
  "/forgot-password",
  validateFields(userValidation.forgotPassword),
  authController.forgotPassword
);

authRouter.post(
  "/reset-password",
  validateFields(userValidation.resetPassword),
  authController.resetPassword
);

authRouter.post("/signout", authController.signOut);

export default authRouter;
