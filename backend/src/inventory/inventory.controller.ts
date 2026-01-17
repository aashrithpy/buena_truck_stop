import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory') 
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Public: GET /inventory?category=Snacks
  @Get()
  async list(@Query('category') category?: string) {
    return this.inventoryService.list(category);
  }

  // Public: GET /inventory/categories
  @Get('categories')
  async categories() {
    return this.inventoryService.categories();
  }

  @Get("featured")
  async featured(@Query("limit") limit?: string) {
    const n = limit ? Math.min(Number(limit) || 6, 24) : 6;
    return this.inventoryService.getFeatured(n);
  }

  // Admin: POST /inventory
  @Post()
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  // Admin: PATCH /inventory/:id
  @Patch(':id')
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    const updated = await this.inventoryService.updateById(id, dto);
    if (!updated) {
      return { message: 'Not found' };
    }
    return updated;
  }
}
