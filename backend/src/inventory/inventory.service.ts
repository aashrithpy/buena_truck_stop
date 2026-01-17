import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItemEntity } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private readonly repo: Repository<InventoryItemEntity>,
  ) {}

  async list(category?: string) {
    if (!category) return this.repo.find({ order: { category: 'ASC', name: 'ASC' } });
    return this.repo.find({ where: { category }, order: { name: 'ASC' } });
  }

  async categories() {
    const rows = await this.repo
      .createQueryBuilder('i')
      .select('DISTINCT i.category', 'category')
      .orderBy('i.category', 'ASC')
      .getRawMany<{ category: string }>();

    return rows.map((r) => r.category);
  }

  async seedIfEmpty() {
    const count = await this.repo.count();
    if (count > 0) return;

    // Seed examples — we will replace/expand with your real store inventory later
    const rows: Partial<InventoryItemEntity>[] = [
      { name: 'Bottled Water', category: 'Drinks', price: null, status: 'in_stock', description: null, imageUrl: null },
      { name: 'Energy Drink', category: 'Drinks', price: null, status: 'in_stock', description: null, imageUrl: null },
      { name: 'Chips', category: 'Snacks', price: null, status: 'in_stock', description: null, imageUrl: null },
      { name: 'Candy', category: 'Snacks', price: null, status: 'in_stock', description: null, imageUrl: null },
      { name: 'Windshield Washer Fluid', category: 'Automotive', price: null, status: 'limited', description: null, imageUrl: null },
      { name: 'Motor Oil (select types)', category: 'Automotive', price: null, status: 'in_stock', description: null, imageUrl: null },
    ];

    await this.repo.save(rows.map((r) => this.repo.create(r)));
  }

async create(dto: {
  name: string;
  category: string;
  price?: string;
  status?: "in_stock" | "limited" | "out_of_stock";
  description?: string;
  imageUrl?: string;
  featured?: boolean;
}) {
  const created = this.repo.create({
    name: dto.name,
    category: dto.category,
    price: dto.price ?? null,
    status: dto.status ?? "in_stock",
    description: dto.description ?? null,
    imageUrl: dto.imageUrl ?? null,
    featured: dto.featured ?? false,
  });

  return this.repo.save(created);
}

async updateById(
  id: number,
  patch: {
    name?: string;
    category?: string;
    price?: string;
    status?: "in_stock" | "limited" | "out_of_stock";
    description?: string;
    imageUrl?: string;
    featured?: boolean;
  }
) {
  const existing = await this.repo.findOne({ where: { id } });
  if (!existing) return null;

  if (patch.name !== undefined) existing.name = patch.name;
  if (patch.category !== undefined) existing.category = patch.category;
  if (patch.price !== undefined) existing.price = patch.price;
  if (patch.status !== undefined) existing.status = patch.status;
  if (patch.description !== undefined) existing.description = patch.description;
  if (patch.imageUrl !== undefined) existing.imageUrl = patch.imageUrl;
  if (patch.featured !== undefined) existing.featured = patch.featured;

  return this.repo.save(existing);
}

async getFeatured(limit = 6) {
  return this.repo.find({
    where: { featured: true },
    order: { updatedAt: "DESC" },
    take: limit,
  });
}



}
