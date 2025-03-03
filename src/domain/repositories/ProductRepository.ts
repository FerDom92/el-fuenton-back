import { CreateProductDto, Product, UpdateProductDto } from '../entities/Product';
import { PaginatedResult, PaginationOptions } from './PaginationOptions';

export interface ProductRepository {
  findById(id: number): Promise<Product | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Product>>;
  search(query: string, options: PaginationOptions): Promise<PaginatedResult<Product>>;
  create(data: CreateProductDto): Promise<Product>;
  update(id: number, data: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<boolean>;
}