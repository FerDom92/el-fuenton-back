import { endOfMonth, startOfMonth, subDays, subMonths } from 'date-fns';
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
    if (options.search) {
      return this.saleRepository.search(options.search, options);
    }
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

  async getTopClients(limit: number = 10): Promise<{ clientId: number; clientName: string; totalSpent: number }[]> {
    const allClients = await this.saleRepository.getTopClients(limit + 1);

    return allClients.filter(client => client.clientId !== 1);
  }

  async getProductSalesByDate(startDate: Date, endDate: Date): Promise<any[]> {
    const sales = await this.saleRepository.getSalesByDateRange(startDate, endDate);

    const dateMap = new Map<string, any>();

    for (const sale of sales) {
      const dateKey = sale.date.toISOString().split('T')[0];

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          totalQuantity: 0,
          productCounts: new Map<number, { productId: number, name: string, quantity: number }>()
        });
      }

      const dateData = dateMap.get(dateKey);

      for (const item of sale.items) {
        dateData.totalQuantity += item.quantity;

        const productId = item.product.id;
        if (!dateData.productCounts.has(productId)) {
          dateData.productCounts.set(productId, {
            productId,
            name: item.product.name,
            quantity: 0
          });
        }

        const productCount = dateData.productCounts.get(productId);
        productCount.quantity += item.quantity;
      }
    }
    const result = Array.from(dateMap.values()).map(dateData => {
      let topProduct = null;
      let maxQuantity = 0;

      for (const productData of dateData.productCounts.values()) {
        if (productData.quantity > maxQuantity) {
          maxQuantity = productData.quantity;
          topProduct = productData;
        }
      }

      return {
        date: dateData.date,
        totalQuantity: dateData.totalQuantity,
        topProduct: topProduct
      };
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getDashboardStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = subDays(today, 1);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const currentMonthStart = startOfMonth(today);

    const lastMonthStart = startOfMonth(subMonths(today, 1));
    const lastMonthEnd = endOfMonth(subMonths(today, 1));

    const [
      todaySales,
      yesterdaySales,
      currentMonthSales,
      lastMonthSales
    ] = await Promise.all([
      this.getSalesByDateRange(today, todayEnd),
      this.getSalesByDateRange(yesterday, yesterdayEnd),
      this.getSalesByDateRange(currentMonthStart, today),
      this.getSalesByDateRange(lastMonthStart, lastMonthEnd)
    ]);

    const calculateTotal = (sales: Sale[]) =>
      sales.reduce((sum, sale) => sum + sale.total, 0);

    const [clientsResult, productsResult] = await Promise.all([
      this.clientRepository.findAll({ page: 1, limit: 1 }),
      this.productRepository.findAll({ page: 1, limit: 1 })
    ]);

    return {
      todaySales: calculateTotal(todaySales),
      yesterdaySales: calculateTotal(yesterdaySales),
      currentMonthSales: calculateTotal(currentMonthSales),
      lastMonthSales: calculateTotal(lastMonthSales),
      totalClients: clientsResult.total,
      totalProducts: productsResult.total
    };
  }
}