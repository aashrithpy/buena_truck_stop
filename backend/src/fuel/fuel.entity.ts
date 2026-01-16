import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type FuelType = 'diesel' | 'gas' | 'premium' | 'off_road_diesel' | 'propane';

@Entity('fuel_prices')
export class FuelPriceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  type: FuelType;

  // Postgres numeric comes back as string in Node pg driver
  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  price: string | null;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;
}
