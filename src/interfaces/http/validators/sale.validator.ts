import { body } from 'express-validator';

export const createSaleValidator = [
  body('clientId')
    .optional()
    .isInt().withMessage('Client ID must be an integer'),

  body('items')
    .isArray({ min: 1 }).withMessage('At least one item is required'),

  body('items.*.productId')
    .isInt().withMessage('Product ID must be an integer'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('total')
    .optional()
    .isNumeric().withMessage('Total must be a number')
    .custom(value => value >= 0).withMessage('Total must be a positive number')
];

export const updateSaleValidator = [
  body('clientId')
    .optional()
    .isInt().withMessage('Client ID must be an integer'),

  body('items')
    .optional()
    .isArray().withMessage('Items must be an array'),

  body('items.*.productId')
    .optional()
    .isInt().withMessage('Product ID must be an integer'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  body('total')
    .optional()
    .isNumeric().withMessage('Total must be a number')
    .custom(value => value >= 0).withMessage('Total must be a positive number')
];