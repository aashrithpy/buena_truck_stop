import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelController } from './fuel.controller';
import { FuelService } from './fuel.service';
import { FuelPriceEntity } from './fuel.entity';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([FuelPriceEntity]), AuthModule],
  controllers: [FuelController],
  providers: [FuelService],
})
export class FuelModule implements OnModuleInit {
  constructor(private readonly fuelService: FuelService) {}

  async onModuleInit() {
    await this.fuelService.seedIfEmpty();
  }
}
