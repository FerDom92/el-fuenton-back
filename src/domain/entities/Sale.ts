import { Client } from './Client';
import { Product } from './Product';

export interface SaleItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class Sale {
  constructor(
    public id: number,
    public date: Date,
    public client: Client,
    public items: SaleItem[],
    public total: number
  ) {}
}

export interface CreateSaleDto {
  clientId?: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  total?: number;
}

export interface UpdateSaleDto {
  clientId?: number;
  items?: {
    productId: number;
    quantity: number;
  }[];
  total?: number;
}