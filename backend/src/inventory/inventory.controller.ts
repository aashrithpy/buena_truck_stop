import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import type { Multer } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
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

  // Admin: POST /inventory/upload
  @Post('upload')
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dest = 'uploads/inventory';
          mkdirSync(dest, { recursive: true });
          cb(null, dest);
        },
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image uploads are allowed'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Multer.File, @Req() req: any) {
    if (!file) {
      return { message: 'No file uploaded' };
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/inventory/${file.filename}`;
    return { url, filename: file.filename, size: file.size };
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
