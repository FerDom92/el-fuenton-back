// src/interfaces/http/validators/auth.validator.ts
import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 100 }).withMessage('Username must be between 3 and 100 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['admin', 'user']).withMessage('Role must be either "admin" or "user"')
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
];