import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';
import { createProductValidator, updateProductValidator } from '../validators/product.validator';

export const productRouter = Router();

// Public routes
productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.getById);

// Protected routes - require authentication
productRouter.post('/', authMiddleware, createProductValidator, productController.create);
productRouter.put('/:id', authMiddleware, updateProductValidator, productController.update);
productRouter.delete('/:id', authMiddleware, adminMiddleware, productController.delete); // Only admin can delete