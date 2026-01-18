import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CustomerLoginDto {
  @IsEmail()
  @MaxLength(120)
  email: string;

  @IsString()
  @MaxLength(120)
  password: string;
}
