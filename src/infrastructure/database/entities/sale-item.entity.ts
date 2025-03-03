import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { SaleEntity } from './sale.entity';

@Entity('sale_items')
export class SaleItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SaleEntity, sale => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: SaleEntity;

  @Column({ name: 'sale_id' })
  saleId: number;

  @ManyToOne(() => ProductEntity, product => product.saleItems)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;
}