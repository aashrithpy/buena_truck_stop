import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateParkingReservationDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsString()
  @MaxLength(40)
  phone: string;

  @IsDateString()
  arrivalDate: string;

  @IsInt()
  @Min(1)
  @Max(30)
  days: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  truckNumber?: string;

  @IsOptional()
  @IsIn(["pay_on_arrival", "online_pending"])
  paymentMethod?: "pay_on_arrival" | "online_pending";
}
