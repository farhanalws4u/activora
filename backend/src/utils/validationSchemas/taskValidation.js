// validation/taskValidation.js
import Joi from 'joi';
import mongoose from 'mongoose';

const isValidObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const taskValidation = {
  // Create Task
  createTask: Joi.object({
    projectId: Joi.string().custom(isValidObjectId).required()
      .messages({
        'any.invalid': 'Invalid project ID format',
        'any.required': 'Project ID is required'
      }),
    name: Joi.string().required().max(255)
      .messages({
        'string.empty': 'Task name is required',
        'string.max': 'Task name cannot exceed 255 characters'
      }),
    description: Joi.string(),
    status: Joi.string()
      .valid('Draft', 'Planned', 'Started', 'Blocked', 'Complete', 'Deferred')
      .default('Draft'),
    priority: Joi.string().valid('P1', 'P2', 'P3').default('P3'),
    assignedTo: Joi.string().custom(isValidObjectId)
      .messages({
        'any.invalid': 'Invalid user ID format'
      }),
    startDate: Joi.date(),
    dueDate: Joi.date().greater(Joi.ref('startDate'))
      .messages({
        'date.greater': 'Due date must be after start date'
      }),
    estimatedHours: Joi.number().min(0),
    parentTask: Joi.string().custom(isValidObjectId)
      .messages({
        'any.invalid': 'Invalid parent task ID format'
      }),
    isMilestone: Joi.boolean().default(false),
    tags: Joi.array().items(Joi.string()),
  }),

  // Update Task
  updateTask: Joi.object({
    name: Joi.string().max(255),
    description: Joi.string(),
    status: Joi.string()
      .valid('Draft', 'Planned', 'Started', 'Blocked', 'Complete', 'Deferred'),
    priority: Joi.string().valid('P1', 'P2', 'P3'),
    assignedTo: Joi.string().custom(isValidObjectId),
    startDate: Joi.date(),
    dueDate: Joi.date().greater(Joi.ref('startDate')),
    estimatedHours: Joi.number().min(0),
    actualHours: Joi.number().min(0),
    percentageComplete: Joi.number().min(0).max(100),
    tags: Joi.array().items(Joi.string())
  }),

  // Add Comment
  addTaskComment: Joi.object({
    text: Joi.string().required()
      .messages({
        'string.empty': 'Comment text is required'
      })
  }),

  // Update Status
  updateTaskStatus: Joi.object({
    status: Joi.string()
      .valid('Draft', 'Planned', 'Started', 'Blocked', 'Complete', 'Deferred')
      .required()
      .messages({
        'any.required': 'Status is required',
        'any.only': 'Invalid status value'
      })
  }),

  // Update Progress
  updateTaskProgress: Joi.object({
    percentageComplete: Joi.number().min(0).max(100).required()
      .messages({
        'number.min': 'Progress cannot be less than 0',
        'number.max': 'Progress cannot exceed 100',
        'any.required': 'Progress percentage is required'
      })
  }),

  // Add Attachments
  addTaskAttachments: Joi.object({
    attachments: Joi.array().items(Joi.string().uri()).required()
      .messages({
        'array.base': 'Attachments must be an array',
        'string.uri': 'Attachment must be a valid URL'
      })
  }),

  // Search Query Parameters
  searchQuery: Joi.object({
    query: Joi.string(),
    status: Joi.string()
      .valid('Draft', 'Planned', 'Started', 'Blocked', 'Complete', 'Deferred'),
    priority: Joi.string().valid('P1', 'P2', 'P3'),
    projectId: Joi.string().custom(isValidObjectId)
  }),

  // ID Parameter Validation
  idParam: Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
      .messages({
        'any.invalid': 'Invalid task ID format',
        'any.required': 'Task ID is required'
      })
  })
}