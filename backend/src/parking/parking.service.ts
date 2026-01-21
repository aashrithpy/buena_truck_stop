import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateParkingReservationDto } from "./dto/create-parking-reservation.dto";
import { ParkingReservationEntity } from "./parking.entity";

const DAILY_RATE = 15;

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingReservationEntity)
    private readonly repo: Repository<ParkingReservationEntity>,
  ) {}

  async createReservation(dto: CreateParkingReservationDto) {
    const trackingId = await this.generateTrackingId();
    const dailyRate = DAILY_RATE;
    const totalCost = dailyRate * dto.days;

    const reservation = this.repo.create({
      trackingId,
      name: dto.name,
      phone: dto.phone,
      arrivalDate: dto.arrivalDate,
      days: dto.days,
      truckNumber: dto.truckNumber ?? null,
      paymentMethod: dto.paymentMethod ?? "pay_on_arrival",
      paymentStatus: dto.paymentMethod === "online_pending" ? "pending" : "unpaid",
      dailyRate: dailyRate.toFixed(2),
      totalCost: totalCost.toFixed(2),
    });

    const saved = await this.repo.save(reservation);

    return {
      trackingId: saved.trackingId,
      dailyRate: saved.dailyRate,
      totalCost: saved.totalCost,
      paymentStatus: saved.paymentStatus,
      paymentMethod: saved.paymentMethod,
      arrivalDate: saved.arrivalDate,
      days: saved.days,
      truckNumber: saved.truckNumber,
    };
  }

  async findByTrackingId(trackingId: string) {
    return this.repo.findOne({ where: { trackingId } });
  }

  private async generateTrackingId() {
    const prefix = "BTS";
    let attempt = 0;

    while (attempt < 5) {
      const random = Math.random().toString(36).slice(2, 8).toUpperCase();
      const candidate = `${prefix}-${random}`;
      const exists = await this.repo.findOne({ where: { trackingId: candidate } });
      if (!exists) return candidate;
      attempt += 1;
    }

    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }
}
