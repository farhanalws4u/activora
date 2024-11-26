// validation/projectValidation.js
import Joi from "joi";
import mongoose from "mongoose";

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const projectValidation = {
  // Create Project
  addProject: Joi.object({
    name: Joi.string().required().trim().max(255).messages({
      "string.empty": "Project name is required",
      "string.max": "Project name cannot exceed 255 characters",
    }),
    description: Joi.string().trim(),
    status: Joi.string()
      .valid("Planning", "Active", "On Hold", "Completed")
      .default("Planning"),
    priority: Joi.string().valid("Low", "Medium", "High").default("Medium"),
    startDate: Joi.date().required().messages({
      "date.base": "Start date must be a valid date",
    }),
    endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
      "date.greater": "End date must be after start date",
    }),
    category: Joi.string()
      .valid("Development", "Design", "Marketing", "Other")
      .default("Other"),
  }),

  // Update Project
  updateProject: Joi.object({
    name: Joi.string().trim().max(255),
    description: Joi.string().trim(),
    status: Joi.string().valid("Planning", "Active", "On Hold", "Completed"),
    priority: Joi.string().valid("Low", "Medium", "High"),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref("startDate")),
    category: Joi.string().valid("Development", "Design", "Marketing", "Other"),
    progress: Joi.number().min(0).max(100),
  }),

  // Add Members
  addMembers: Joi.object({
    userId: Joi.string().custom(isValidObjectId).required().messages({
      "any.invalid": "Invalid user ID format",
      "any.required": "User ID is required",
    }),
    role: Joi.string().valid("Admin", "Member").default("Member"),
  }),

  // Add Comment
  addComment: Joi.object({
    text: Joi.string().required().trim().messages({
      "string.empty": "Comment text is required",
    }),
  }),

  // Add Milestone
  addMilestone: Joi.object({
    name: Joi.string().required().trim().messages({
      "string.empty": "Milestone name is required",
    }),
    dueDate: Joi.date().required().messages({
      "date.base": "Due date must be a valid date",
    }),
  }),

  // Update Progress
  updateProgress: Joi.object({
    progress: Joi.number().min(0).max(100).required().messages({
      "number.min": "Progress cannot be less than 0",
      "number.max": "Progress cannot exceed 100",
    }),
  }),

  // ID Parameter Validation
  idParam: Joi.object({
    id: Joi.string().custom(isValidObjectId).required().messages({
      "any.invalid": "Invalid project ID format",
      "any.required": "Project ID is required",
    }),
  }),
};
