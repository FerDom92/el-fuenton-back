import { body } from 'express-validator';

export const createProductValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price must be a positive number'),

  body('detail')
    .notEmpty().withMessage('Detail is required')
    .isLength({ max: 500 }).withMessage('Detail must not exceed 500 characters')
];

export const updateProductValidator = [
  body('name')
    .optional()
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price must be a positive number'),

  body('detail')
    .optional()
    .isLength({ max: 500 }).withMessage('Detail must not exceed 500 characters')
];