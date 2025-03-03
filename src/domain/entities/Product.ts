export class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public detail: string
  ) {}
}

export interface CreateProductDto {
  name: string;
  price: number;
  detail: string;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  detail?: string;
}