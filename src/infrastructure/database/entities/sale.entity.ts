import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClientEntity } from './client.entity';
import { SaleItemEntity } from './sale-item.entity';

@Entity('sales')
export class SaleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @ManyToOne(() => ClientEntity, client => client.sales, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'client_id' })
  clientId: number;

  @OneToMany(() => SaleItemEntity, saleItem => saleItem.sale, { cascade: true })
  items: SaleItemEntity[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}