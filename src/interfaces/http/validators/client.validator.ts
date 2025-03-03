import { body } from 'express-validator';

export const createClientValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 100 }).withMessage('Last name must not exceed 100 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 255 }).withMessage('Email must not exceed 255 characters')
];

export const updateClientValidator = [
  body('name')
    .optional()
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

  body('lastName')
    .optional()
    .isLength({ max: 100 }).withMessage('Last name must not exceed 100 characters'),

  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 255 }).withMessage('Email must not exceed 255 characters')
];