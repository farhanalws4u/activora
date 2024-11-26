import { userModel } from "../../../Database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

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
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ message: "success", user });
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

  const token = generateToken(user);
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
