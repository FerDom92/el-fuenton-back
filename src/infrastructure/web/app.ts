import cors from 'cors';
import express, { Application } from 'express';
import { authRouter } from '../../interfaces/http/routes/auth.routes';
import { clientRouter } from '../../interfaces/http/routes/client.routes';
import { productRouter } from '../../interfaces/http/routes/product.routes';
import { saleRouter } from '../../interfaces/http/routes/sale.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/product', productRouter);
  app.use('/api/v1/client', clientRouter);
  app.use('/api/v1/sale', saleRouter);

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Error handling middleware
  app.use(errorMiddleware);

  return app;
}