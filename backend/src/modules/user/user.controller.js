import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { userModel } from "../../../Database/models/user.model.js";
import {getUserFieldsFromToken} from "../../utils/getUserFieldsFromToken.js";

const addUser = catchAsyncError(async (req, res, next) => {
  const addUser = new userModel(req.body);
  await addUser.save();

  res.status(201).json({ message: "success", addUser });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(userModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  const getAllUsers = await apiFeature.mongooseQuery;

  res.status(201).json({ page: PAGE_NUMBER, message: "success", getAllUsers });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateUser = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateUser && res.status(201).json({ message: "success", updateUser });

  !updateUser && next(new AppError("User was not found", 404));
});

const getCurrentUser = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = getUserFieldsFromToken(req, ["id"]); 
   const foundUser = await userModel.findById(id);

   if (foundUser) {
     return res.status(200).json({ message: "success", foundUser });
   } else {
     return next(new AppError("User not found", 404));
   }
 } catch (error) {
   next(error);
 }
});

const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  console.log(req.body.passwordChangedAt);
  const changeUserPassword = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  changeUserPassword &&
    res.status(201).json({ message: "success", changeUserPassword });

  !changeUserPassword && next(new AppError("User was not found", 404));
});

const deleteUser = deleteOne(userModel, "user");

export {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  getCurrentUser,
};
