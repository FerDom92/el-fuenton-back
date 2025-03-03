import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ClientEntity } from './entities/client.entity';
import { ProductEntity } from './entities/product.entity';
import { SaleItemEntity } from './entities/sale-item.entity';
import { SaleEntity } from './entities/sale.entity';
import { UserEntity } from './entities/user.entity';
import { InitialMigration1741025002357 } from './migrations/1741025002357-InitialMigration';
import { CreateDefaultClient1741025057266 } from './migrations/1741025057266-CreateDefaultClient';
import { CreateUsersTable1741027684617 } from './migrations/1741027684617-CreateUsersTable';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'el_fuenton',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
  entities: [ProductEntity, ClientEntity, SaleEntity, SaleItemEntity, UserEntity],
  migrations: [InitialMigration1741025002357, CreateDefaultClient1741025057266, CreateUsersTable1741027684617],
  subscribers: [],
});