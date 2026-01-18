import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(120)
  password?: string;

  @IsOptional()
  @IsArray()
  receipts?: string[];

  @IsOptional()
  enabled?: boolean;
}
