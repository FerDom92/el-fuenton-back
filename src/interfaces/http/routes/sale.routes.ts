import { Router } from 'express';
import { saleController } from '../controllers/sale.controller';
import { createSaleValidator, updateSaleValidator } from '../validators/sale.validator';

export const saleRouter = Router();

saleRouter.get('/', saleController.getAll);
saleRouter.get('/:id', saleController.getById);
saleRouter.post('/', createSaleValidator, saleController.create);
saleRouter.put('/:id', updateSaleValidator, saleController.update);
saleRouter.delete('/:id', saleController.delete);
saleRouter.get('/reports/by-date', saleController.getByDateRange);
saleRouter.get('/reports/top-products', saleController.getTopSellingProducts);