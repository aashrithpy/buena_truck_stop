import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly repo: Repository<ServiceEntity>,
  ) {}

  async list() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async seedIfEmpty() {
    const count = await this.repo.count();
    if (count > 0) return;

    const rows: Partial<ServiceEntity>[] = [
      { name: 'ATM', description: null, enabled: true },
      { name: 'Truck Overnight Parking', description: null, enabled: true },
      { name: 'Convenience Store', description: 'All basic convenience store items.', enabled: true },
    ];

    await this.repo.save(rows.map((r) => this.repo.create(r)));
  }
}
