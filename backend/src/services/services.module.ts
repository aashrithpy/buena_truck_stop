import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceEntity } from './service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule implements OnModuleInit {
  constructor(private readonly servicesService: ServicesService) {}

  async onModuleInit() {
    await this.servicesService.seedIfEmpty();
  }
}
