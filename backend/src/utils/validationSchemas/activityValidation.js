// validation/activityValidation.js
import Joi from 'joi';
import mongoose from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const activityValidation = {
  // Add/Update Activity
  addActivity: Joi.object({
    projectId: Joi.string().custom(isValidObjectId).required()
      .messages({
        'any.invalid': 'Invalid project ID format',
        'any.required': 'Project ID is required'
      }),
    mouseMovement: Joi.array().items(
      Joi.object({
        x: Joi.number().required(),
        y: Joi.number().required(),
        timestamp: Joi.date().default(Date.now)
      })
    ).required()
      .messages({
        'array.base': 'Mouse movement must be an array',
        'any.required': 'Mouse movement data is required'
      }),
    activeDuration: Joi.number().min(0).required()
      .messages({
        'number.min': 'Active duration cannot be negative',
        'any.required': 'Active duration is required'
      }),
    percentageActivity: Joi.number().min(0).max(100).required()
      .messages({
        'number.min': 'Activity percentage cannot be less than 0',
        'number.max': 'Activity percentage cannot exceed 100',
        'any.required': 'Activity percentage is required'
      }),
    screenshots: Joi.array().items(
      Joi.string().uri()
        .messages({
          'string.uri': 'Screenshot must be a valid URL'
        })
    )
  }),

  // Get User Activity Query
  getUserActivityQuery: Joi.object({
    startDate: Joi.date()
      .messages({
        'date.base': 'Start date must be a valid date'
      }),
    endDate: Joi.date().min(Joi.ref('startDate'))
      .messages({
        'date.min': 'End date must be after start date'
      }),
    projectId: Joi.string().custom(isValidObjectId)
      .messages({
        'any.invalid': 'Invalid project ID format'
      })
  }),

  // Get Project Activity Query
  getProjectActivityQuery: Joi.object({
    startDate: Joi.date()
      .messages({
        'date.base': 'Start date must be a valid date'
      }),
    endDate: Joi.date().min(Joi.ref('startDate'))
      .messages({
        'date.min': 'End date must be after start date'
      })
  }),

  // Activity Stats Query
  activityStatsQuery: Joi.object({
    projectId: Joi.string().custom(isValidObjectId)
      .messages({
        'any.invalid': 'Invalid project ID format'
      })
  }),

  // ID Parameter Validation
  idParam: Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
      .messages({
        'any.invalid': 'Invalid activity ID format',
        'any.required': 'Activity ID is required'
      }),
    projectId: Joi.string().custom(isValidObjectId).required()
      .messages({
        'any.invalid': 'Invalid project ID format',
        'any.required': 'Project ID is required'
      })
  })
}