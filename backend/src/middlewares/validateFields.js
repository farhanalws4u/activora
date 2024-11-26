// middleware/validateRequest.js
import { AppError } from "../utils/AppError.js";

export const validateFields = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return next(new AppError({ errors }, 400));
    }

    next();
  };
};
