import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  @MaxLength(80)
  category: string;

  // optional, "3.49"
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
