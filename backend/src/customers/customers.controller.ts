import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import * as bcrypt from 'bcrypt';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customers: CustomersService,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  async login(@Body() dto: CustomerLoginDto) {
    const customer = await this.customers.findByEmail(dto.email);
    if (!customer || !customer.enabled) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, customer.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwt.signAsync({
      sub: customer.id,
      email: customer.email,
      role: 'customer',
    });

    return { accessToken };
  }

  @Get('me')
  @UseGuards(JwtGuard, new RolesGuard(['customer']))
  async me(@Req() req: any) {
    const id = Number(req.user?.sub);
    const customer = await this.customers.findById(id);
    if (!customer) return { message: 'Not found' };
    return sanitizeCustomer(customer);
  }

  @Get()
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async list() {
    const customers = await this.customers.list();
    return customers.map((c) => sanitizeCustomer(c));
  }

  @Get(':id')
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async detail(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customers.findById(id);
    if (!customer) return { message: 'Not found' };
    return sanitizeCustomer(customer);
  }

  @Post()
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.customers.create(dto);
    return sanitizeCustomer(customer);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto) {
    const customer = await this.customers.update(id, dto);
    if (!customer) return { message: 'Not found' };
    return sanitizeCustomer(customer);
  }
}

function sanitizeCustomer(customer: any) {
  const { passwordHash, ...rest } = customer;
  return rest;
}
