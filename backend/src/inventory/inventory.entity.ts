import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type InventoryStatus = 'in_stock' | 'limited' | 'out_of_stock';

@Entity('inventory_items')
export class InventoryItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  category: string;

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  price: string | null;

  @Column({ type: 'varchar', length: 20, default: 'in_stock' })
  status: InventoryStatus;

  @Column({ type: 'varchar', length: 400, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;
}
