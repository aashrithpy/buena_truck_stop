import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelPriceEntity } from './fuel.entity';

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(FuelPriceEntity)
    private readonly repo: Repository<FuelPriceEntity>,
  ) {}

  async list() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async seedIfEmpty() {
    const count = await this.repo.count();
    if (count > 0) return;

    const rows: Partial<FuelPriceEntity>[] = [
      { type: 'diesel', price: '3.47', available: true },
      { type: 'gas', price: '2.69', available: true },
      { type: 'premium', price: '3.49', available: true },
      { type: 'off_road_diesel', price: null, available: true },
      { type: 'propane', price: null, available: true },
    ];

    await this.repo.save(rows.map((r) => this.repo.create(r)));
  }

  // ✅ THIS IS THE IMPORTANT PART
  async upsert(
    type: FuelPriceEntity['type'],
    price?: string,
    available?: boolean,
  ) {
    const existing = await this.repo.findOne({ where: { type } });

    if (!existing) {
      const created = this.repo.create({
        type,
        price: price ?? null,
        available: available ?? true,
        updatedAt: new Date(),
      });
      return this.repo.save(created);
    }

    if (price !== undefined) existing.price = price;
    if (available !== undefined) existing.available = available;
    existing.updatedAt = new Date();

    return this.repo.save(existing);
  }
}
