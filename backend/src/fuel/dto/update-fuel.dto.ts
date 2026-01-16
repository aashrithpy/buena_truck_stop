import { IsBoolean, IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateFuelDto {
  @IsIn(['diesel', 'gas', 'premium', 'off_road_diesel', 'propane'])
  type: 'diesel' | 'gas' | 'premium' | 'off_road_diesel' | 'propane';

  // price like "3.47"
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{2})$/, { message: 'price must look like 3.47' })
  price?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
