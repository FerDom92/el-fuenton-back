import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProductService } from '../../../application/services/ProductService';
import { ProductRepositoryImpl } from '../../../infrastructure/repositories/ProductRepositoryImpl';

const productRepository = new ProductRepositoryImpl();
const productService = new ProductService(productRepository);

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await productService.getAllProducts({ page, limit, search });

      res.json({
        items: result.items,
        total: result.total,
        totalPages: result.totalPages
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await productService.createProduct({
        name: req.body.name,
        price: req.body.price,
        detail: req.body.detail
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const product = await productService.updateProduct(id, {
        name: req.body.name,
        price: req.body.price,
        detail: req.body.detail
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const success = await productService.deleteProduct(id);

      if (!success) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();