import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type ParkingPaymentMethod = "pay_on_arrival" | "online_pending";
export type ParkingPaymentStatus = "unpaid" | "paid" | "pending";

@Entity("parking_reservations")
export class ParkingReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 32 })
  trackingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "varchar", length: 40 })
  phone: string;

  @Column({ type: "date" })
  arrivalDate: string;

  @Column({ type: "int" })
  days: number;

  @Column({ type: "varchar", length: 40, nullable: true })
  truckNumber: string | null;

  @Column({ type: "varchar", length: 20, default: "pay_on_arrival" })
  paymentMethod: ParkingPaymentMethod;

  @Column({ type: "varchar", length: 16, default: "unpaid" })
  paymentStatus: ParkingPaymentStatus;

  @Column({ type: "numeric", precision: 8, scale: 2, default: 15 })
  dailyRate: string;

  @Column({ type: "numeric", precision: 8, scale: 2 })
  totalCost: string;
}
