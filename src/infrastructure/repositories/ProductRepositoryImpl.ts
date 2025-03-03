import { Like, Repository } from 'typeorm';
import { CreateProductDto, Product, UpdateProductDto } from '../../domain/entities/Product';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { AppDataSource } from '../database/data-source';
import { ProductEntity } from '../database/entities/product.entity';

export class ProductRepositoryImpl implements ProductRepository {
  private repository: Repository<ProductEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProductEntity);
  }

  private mapEntityToDomain(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      Number(entity.price),
      entity.detail
    );
  }

  async findById(id: number): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Product>> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async search(query: string, options: PaginationOptions): Promise<PaginatedResult<Product>> {
    const [entities, total] = await this.repository.findAndCount({
      where: [
        { name: Like(`%${query}%`) },
        { detail: Like(`%${query}%`) },
      ],
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const items = entities.map(entity => this.mapEntityToDomain(entity));
    const totalPages = Math.ceil(total / options.limit);

    return {
      items,
      total,
      totalPages,
    };
  }

  async create(data: CreateProductDto): Promise<Product> {
    const productEntity = this.repository.create({
      name: data.name,
      price: data.price,
      detail: data.detail,
    });

    const savedEntity = await this.repository.save(productEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.repository.findOne({ where: { id } });

    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const updatedEntity = this.repository.merge(existingProduct, {
      name: data.name !== undefined ? data.name : existingProduct.name,
      price: data.price !== undefined ? data.price : existingProduct.price,
      detail: data.detail !== undefined ? data.detail : existingProduct.detail,
    });

    const savedEntity = await this.repository.save(updatedEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

}