import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{2})$/, { message: 'price must look like 3.47' })
  price?: string;

  @IsOptional()
  @IsIn(['in_stock', 'limited', 'out_of_stock'])
  status?: 'in_stock' | 'limited' | 'out_of_stock';

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  imageUrl?: string;
}
