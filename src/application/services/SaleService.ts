import { CreateSaleDto, Sale, UpdateSaleDto } from '../../domain/entities/Sale';
import { ClientRepository } from '../../domain/repositories/ClientRepository';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/PaginationOptions';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { SaleRepository } from '../../domain/repositories/SaleRepository';

export class SaleService {
  constructor(
    private saleRepository: SaleRepository,
    private clientRepository: ClientRepository,
    private productRepository: ProductRepository
  ) { }

  async getSaleById(id: number): Promise<Sale | null> {
    return this.saleRepository.findById(id);
  }

  async getAllSales(options: PaginationOptions): Promise<PaginatedResult<Sale>> {
    return this.saleRepository.findAll(options);
  }

  async createSale(data: CreateSaleDto): Promise<Sale> {
    let client;

    if (data.clientId) {
      client = await this.clientRepository.findById(data.clientId);
      if (!client) {
        throw new Error(`Client with ID ${data.clientId} not found`);
      }
    } else {
      client = await this.clientRepository.findOrCreateDefault();
    }

    // Calculate total if not provided
    if (!data.total) {
      let calculatedTotal = 0;

      for (const item of data.items) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        calculatedTotal += product.price * item.quantity;
      }

      data.total = calculatedTotal;
    }

    return this.saleRepository.create(data);
  }

  async updateSale(id: number, data: UpdateSaleDto): Promise<Sale> {
    if (data.clientId) {
      const client = await this.clientRepository.findById(data.clientId);
      if (!client) {
        throw new Error(`Client with ID ${data.clientId} not found`);
      }
    }

    return this.saleRepository.update(id, data);
  }

  async deleteSale(id: number): Promise<boolean> {
    return this.saleRepository.delete(id);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.saleRepository.getSalesByDateRange(startDate, endDate);
  }

  async getTopSellingProducts(limit: number = 10): Promise<{ productId: number; productName: string; totalSold: number }[]> {
    return this.saleRepository.getTopSellingProducts(limit);
  }
}