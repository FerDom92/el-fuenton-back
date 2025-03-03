import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SaleEntity } from './sale.entity';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ name: 'last_name', length: 100, nullable: false })
  lastName: string;

  @Column({ length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SaleEntity, sale => sale.client)
  sales: SaleEntity[];
}