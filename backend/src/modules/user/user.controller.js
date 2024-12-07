import { userModel } from "../../../Database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import {generateJwtToken} from '../../utils/generateJwtToken.js'
import jwt from 'jsonwebtoken'

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(userModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();

  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const users = await apiFeature.mongooseQuery;

  res.status(200).json({ page: PAGE_NUMBER, message: "success", users });
});

const getCurrentUser = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({ message: "success", user });
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
});

const updateProfile = catchAsyncError(async (req, res, next) => {
  const allowedUpdates = [
    "name",
    "designation",
    "department",
    "profilePicture",
  ];
  const updates = Object.keys(req.body)
    .filter((key) => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  const user = await userModel.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "success", user });
});

const addUser = catchAsyncError(async (req, res, next) => {
  const user = new userModel(req.body);
  await user.save();
  res.status(201).json({ message: "success", user });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ message: "success", user });
});

const deleteUser = deleteOne(userModel, "user");

const changePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError("Current password is incorrect", 401));
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  const token = generateJwtToken(user);
  res.status(200).json({ message: "Password updated successfully", token });
});

export {
  getAllUsers,
  getCurrentUser,
  updateProfile,
  addUser,
  updateUser,
  deleteUser,
  changePassword,
};
