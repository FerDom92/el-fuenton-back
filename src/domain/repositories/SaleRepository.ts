import { CreateSaleDto, Sale, UpdateSaleDto } from '../entities/Sale';
import { PaginatedResult, PaginationOptions } from './PaginationOptions';

export interface SaleRepository {
  findById(id: number): Promise<Sale | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Sale>>;
  create(data: CreateSaleDto): Promise<Sale>;
  update(id: number, data: UpdateSaleDto): Promise<Sale>;
  delete(id: number): Promise<boolean>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  getTopSellingProducts(limit: number): Promise<{ productId: number; productName: string; totalSold: number }[]>;
}