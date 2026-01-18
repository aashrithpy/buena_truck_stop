import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customers: Repository<CustomerEntity>,
  ) {}

  async create(dto: CreateCustomerDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const entity = this.customers.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? null,
      address: dto.address ?? null,
      passwordHash,
      receipts: dto.receipts ?? null,
      enabled: true,
    });
    return this.customers.save(entity);
  }

  async list() {
    return this.customers.find({ order: { id: 'DESC' } });
  }

  async findByEmail(email: string) {
    return this.customers.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: number) {
    return this.customers.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const existing = await this.findById(id);
    if (!existing) return null;

    if (dto.name !== undefined) existing.name = dto.name;
    if (dto.email !== undefined) existing.email = dto.email.toLowerCase();
    if (dto.phone !== undefined) existing.phone = dto.phone ?? null;
    if (dto.address !== undefined) existing.address = dto.address ?? null;
    if (dto.receipts !== undefined) existing.receipts = dto.receipts ?? null;
    if (dto.enabled !== undefined) existing.enabled = dto.enabled;
    if (dto.password) {
      existing.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.customers.save(existing);
  }
}
