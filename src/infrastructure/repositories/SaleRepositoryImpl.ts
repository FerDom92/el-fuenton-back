import { Between, Repository } from 'typeorm';
import { Client } from '../../domain/entities/Client';
import { Product } from '../../domain/entities/Product';
import { CreateSaleDto, Sale, SaleItem, UpdateSaleDto } from '../../domain/entities/Sale';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';
import { SaleRepository } from '../../domain/repositories/SaleRepository';
import { AppDataSource } from '../database/data-source';
import { ClientEntity } from '../database/entities/client.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { SaleItemEntity } from '../database/entities/sale-item.entity';
import { SaleEntity } from '../database/entities/sale.entity';

export class SaleRepositoryImpl implements SaleRepository {
  private saleRepository: Repository<SaleEntity>;
  private saleItemRepository: Repository<SaleItemEntity>;
  private clientRepository: Repository<ClientEntity>;
  private productRepository: Repository<ProductEntity>;

  constructor() {
    this.saleRepository = AppDataSource.getRepository(SaleEntity);
    this.saleItemRepository = AppDataSource.getRepository(SaleItemEntity);
    this.clientRepository = AppDataSource.getRepository(ClientEntity);
    this.productRepository = AppDataSource.getRepository(ProductEntity);
  }

  private mapEntityToDomain(entity: SaleEntity): Sale {
    const client = new Client(
      entity.client.id,
      entity.client.name,
      entity.client.lastName,
      entity.client.email
    );

    const items: SaleItem[] = entity.items.map(item => {
      const product = new Product(
        item.product.id,
        item.product.name,
        Number(item.product.price),
        item.product.detail
      );

      return {
        product,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total)
      };
    });

    return new Sale(
      entity.id,
      entity.date,
      client,
      items,
      Number(entity.total)
    );
  }

  async findById(id: number): Promise<Sale | null> {
    const entity = await this.saleRepository.findOne({
      where: { id },
      relations: ['client', 'items', 'items.product']
    });

    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Sale>> {
    const [entities, total] = await this.saleRepository.findAndCount({
      relations: ['client', 'items', 'items.product'],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { date: 'DESC' },
      select: {
        items: {
          id: true,
          productId: true,
          quantity: true,
          unitPrice: true,
          total: true,
        }
      }
    });

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async search(query: string, options: PaginationOptions): Promise<PaginatedResult<Sale>> {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.client', 'client')
      .leftJoinAndSelect('sale.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('CAST(sale.id AS TEXT) LIKE :query', { query: `%${query}%` })
      .orWhere('client.name LIKE :query', { query: `%${query}%` })
      .orWhere('client.lastName LIKE :query', { query: `%${query}%` })
      .orderBy('sale.date', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async create(data: CreateSaleDto): Promise<Sale> {
    return AppDataSource.transaction(async transactionalEntityManager => {
      const saleEntity = transactionalEntityManager.create(SaleEntity, {
        clientId: data.clientId,
        total: data.total || 0,
        date: new Date()
      });

      const savedSale = await transactionalEntityManager.save(saleEntity);

      for (const item of data.items) {
        const product = await transactionalEntityManager.findOne(ProductEntity, {
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const unitPrice = Number(product.price);
        const itemTotal = unitPrice * item.quantity;

        const saleItemEntity = transactionalEntityManager.create(SaleItemEntity, {
          saleId: savedSale.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          total: itemTotal
        });

        await transactionalEntityManager.save(saleItemEntity);
      }

      const completeSale = await transactionalEntityManager.findOne(SaleEntity, {
        where: { id: savedSale.id },
        relations: ['client', 'items', 'items.product']
      });

      if (!completeSale) {
        throw new Error('Failed to retrieve created sale');
      }

      return this.mapEntityToDomain(completeSale);
    });
  }

  async update(id: number, data: UpdateSaleDto): Promise<Sale> {
    return AppDataSource.transaction(async transactionalEntityManager => {
      const existingSale = await transactionalEntityManager.findOne(SaleEntity, {
        where: { id },
        relations: ['items']
      });

      if (!existingSale) {
        throw new Error(`Sale with ID ${id} not found`);
      }

      if (data.clientId) {
        existingSale.clientId = data.clientId;
      }

      if (data.items && data.items.length > 0) {
        await transactionalEntityManager.delete(SaleItemEntity, { saleId: id });

        let calculatedTotal = 0;

        for (const item of data.items) {
          const product = await transactionalEntityManager.findOne(ProductEntity, {
            where: { id: item.productId }
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          const unitPrice = Number(product.price);
          const itemTotal = unitPrice * item.quantity;
          calculatedTotal += itemTotal;

          const saleItemEntity = transactionalEntityManager.create(SaleItemEntity, {
            saleId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice,
            total: itemTotal
          });

          await transactionalEntityManager.save(saleItemEntity);
        }

        existingSale.total = data.total !== undefined ? data.total : calculatedTotal;
      } else if (data.total !== undefined) {
        existingSale.total = data.total;
      }

      await transactionalEntityManager.save(existingSale);

      const updatedSale = await transactionalEntityManager.findOne(SaleEntity, {
        where: { id },
        relations: ['client', 'items', 'items.product']
      });

      if (!updatedSale) {
        throw new Error('Failed to retrieve updated sale');
      }

      return this.mapEntityToDomain(updatedSale);
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.saleRepository.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const entities = await this.saleRepository.find({
      where: {
        date: Between(startDate, endDate)
      },
      relations: ['client', 'items', 'items.product'],
      order: { date: 'ASC' },
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async getTopSellingProducts(limit: number): Promise<{ productId: number; productName: string; totalSold: number }[]> {
    const queryResult = await this.saleItemRepository
      .createQueryBuilder('saleItem')
      .select('saleItem.product_id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(saleItem.quantity)', 'total_sold')
      .innerJoin('products', 'product', 'product.id = saleItem.product_id')
      .groupBy('saleItem.product_id')
      .addGroupBy('product.name')
      .orderBy('total_sold', 'DESC')
      .limit(limit)
      .getRawMany();

    return queryResult.map(item => ({
      productId: Number(item.productId),
      productName: item.productName,
      totalSold: Number(item.total_sold)
    }));
  }

  async getTopClients(limit: number): Promise<{ clientId: number; clientName: string; totalSpent: number }[]> {
    const queryResult = await this.saleRepository
      .createQueryBuilder('sale')
      .select('sale.client_id', 'clientId')
      .addSelect('client.name', 'clientName')
      .addSelect('client.last_name', 'clientLastName')
      .addSelect('SUM(sale.total)', 'total_spent')
      .innerJoin('clients', 'client', 'client.id = sale.client_id')
      .groupBy('sale.client_id')
      .addGroupBy('client.name')
      .addGroupBy('client.last_name')
      .orderBy('total_spent', 'DESC')
      .limit(limit)
      .getRawMany();

    return queryResult.map(item => ({
      clientId: Number(item.clientId),
      clientName: `${item.clientName} ${item.clientLastName}`,
      totalSpent: Number(item.total_spent)
    }));
  }
}