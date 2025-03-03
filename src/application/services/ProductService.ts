import { CreateProductDto, Product, UpdateProductDto } from '../../domain/entities/Product';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async getAllProducts(options: PaginationOptions): Promise<PaginatedResult<Product>> {
    if (options.search) {
      return this.productRepository.search(options.search, options);
    }
    return this.productRepository.findAll(options);
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return this.productRepository.create(data);
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}