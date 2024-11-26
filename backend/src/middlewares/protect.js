// middleware/auth.js
import jwt from "jsonwebtoken";
import { userModel } from '../../Database/models/user.model.js'
import { AppError } from "../utils/AppError.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const protect = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("Please log in to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat < changedTimestamp) {
        return next(
          new AppError(
            "User recently changed password. Please log in again",
            401
          )
        );
      }
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
});
