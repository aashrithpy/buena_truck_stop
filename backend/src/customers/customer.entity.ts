import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 120, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 240, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 200 })
  passwordHash: string;

  @Column({ type: 'jsonb', nullable: true })
  receipts: string[] | null;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;
}
