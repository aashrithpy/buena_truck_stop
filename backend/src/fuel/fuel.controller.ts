import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  async list() {
    return this.fuelService.list();
  }

  @Patch()
  @UseGuards(JwtGuard, new RolesGuard(['admin']))
  async update(@Body() dto: UpdateFuelDto) {
    return this.fuelService.upsert(dto.type, dto.price, dto.available);
  }
}
