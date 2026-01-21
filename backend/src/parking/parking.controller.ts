import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateParkingReservationDto } from "./dto/create-parking-reservation.dto";
import { ParkingService } from "./parking.service";

@Controller("parking")
export class ParkingController {
  constructor(private readonly parking: ParkingService) {}

  @Post("reservations")
  async createReservation(@Body() dto: CreateParkingReservationDto) {
    return this.parking.createReservation(dto);
  }

  @Get("reservations/:trackingId")
  async getReservation(@Param("trackingId") trackingId: string) {
    const reservation = await this.parking.findByTrackingId(trackingId);
    if (!reservation) return { message: "Not found" };

    return {
      trackingId: reservation.trackingId,
      name: reservation.name,
      phone: reservation.phone,
      arrivalDate: reservation.arrivalDate,
      days: reservation.days,
      truckNumber: reservation.truckNumber,
      paymentMethod: reservation.paymentMethod,
      paymentStatus: reservation.paymentStatus,
      dailyRate: reservation.dailyRate,
      totalCost: reservation.totalCost,
    };
  }
}
