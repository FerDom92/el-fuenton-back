import dotenv from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from './infrastructure/database/data-source';
import { logger } from './infrastructure/logger';
import { createApp } from './infrastructure/web/app';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    const app = createApp();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();