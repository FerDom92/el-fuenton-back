import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SaleItemEntity } from './sale-item.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ length: 500, nullable: false })
  detail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SaleItemEntity, saleItem => saleItem.product)
  saleItems: SaleItemEntity[];
}