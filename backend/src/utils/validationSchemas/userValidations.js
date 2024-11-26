import Joi from "joi";

export const userValidation = {
  // Authentication Validations
  signUp: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),
    email: Joi.string().email().trim().required().messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    role: Joi.string().valid("admin", "user").default("user"),
    designation: Joi.string().trim(),
    department: Joi.string().trim(),
  }),

  signIn: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),

  // Profile Update Validation
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),
    designation: Joi.string().trim(),
    department: Joi.string().trim(),
    profilePicture: Joi.string().uri().messages({
      "string.uri": "Profile picture must be a valid URL",
    }),
  }),

  // Password Management Validations
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Current password is required",
    }),
    newPassword: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
      .messages({
        "string.min": "New password must be at least 8 characters",
        "string.pattern.base":
          "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
    }),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "Reset token is required",
    }),
    newPassword: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
      .messages({
        "string.min": "New password must be at least 8 characters",
        "string.pattern.base":
          "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  }),

  // Admin User Management Validations
  addUser: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)")),
    role: Joi.string().valid("admin", "user").default("user"),
    designation: Joi.string().trim(),
    department: Joi.string().trim(),
    profilePicture: Joi.string().uri(),
  }),
};
