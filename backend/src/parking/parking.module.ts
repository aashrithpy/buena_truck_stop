import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParkingController } from "./parking.controller";
import { ParkingReservationEntity } from "./parking.entity";
import { ParkingService } from "./parking.service";

@Module({
  imports: [TypeOrmModule.forFeature([ParkingReservationEntity])],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
