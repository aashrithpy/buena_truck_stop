import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(120)
  password: string;

  @IsOptional()
  @IsArray()
  receipts?: string[];
}
