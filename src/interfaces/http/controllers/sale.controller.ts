import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SaleService } from '../../../application/services/SaleService';
import { ClientRepositoryImpl } from '../../../infrastructure/repositories/ClientRepositoryImpl';
import { ProductRepositoryImpl } from '../../../infrastructure/repositories/ProductRepositoryImpl';
import { SaleRepositoryImpl } from '../../../infrastructure/repositories/SaleRepositoryImpl';

const saleRepository = new SaleRepositoryImpl();
const clientRepository = new ClientRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const saleService = new SaleService(saleRepository, clientRepository, productRepository);

export class SaleController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await saleService.getAllSales({ page, limit });

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
      const sale = await saleService.getSaleById(id);

      if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      res.json(sale);
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

      const sale = await saleService.createSale({
        clientId: req.body.clientId,
        items: req.body.items,
        total: req.body.total
      });

      res.status(201).json(sale);
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
      const sale = await saleService.updateSale(id, {
        clientId: req.body.clientId,
        items: req.body.items,
        total: req.body.total
      });

      res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const success = await saleService.deleteSale(id);

      if (!success) {
        return res.status(404).json({ message: 'Sale not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getByDateRange(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const sales = await saleService.getSalesByDateRange(startDate, endDate);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async getTopSellingProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topProducts = await saleService.getTopSellingProducts(limit);
      res.json(topProducts);
    } catch (error) {
      next(error);
    }
  }
}

export const saleController = new SaleController();