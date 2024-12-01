import { userModel } from "../../../Database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import crypto from "crypto";
import { generateJwtToken } from "../../utils/generateJwtToken.js";


const signUp = catchAsyncError(async (req, res, next) => {
  const isUserExist = await userModel.findOne({ email: req.body.email });
  if (isUserExist) {
    return next(new AppError("Email already exists", 409));
  }

  const user = new userModel(req.body);
  await user.save();

  const token = generateJwtToken(user);
  res.status(201).json({ message: "success", user, token });
});

const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  user.status = "online";
  await user.updateLastActive();

  const token = generateJwtToken(user);
  res.status(200).json({ message: "success", token, user });
});

const signOut = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  user.status = "offline";
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  res.status(200).json({
    message: "Password reset token sent to email",
    resetToken,
  });
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  const newToken = generateJwtToken(user);
  res
    .status(200)
    .json({ message: "Password reset successful", token: newToken });
});

export {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
};
