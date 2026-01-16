import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { FuelModule } from './fuel/fuel.module';
import { ServicesModule } from './services/services.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DATABASE_HOST'),
        port: Number(cfg.get<string>('DATABASE_PORT')),
        username: cfg.get<string>('DATABASE_USER'),
        password: cfg.get<string>('DATABASE_PASSWORD'),
        database: cfg.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,

        // SSL for RDS
        ssl: true,
        extra: {
          ssl: { rejectUnauthorized: false },
        },
      }),
    }),

    UsersModule,
    AuthModule,
    ServicesModule,
    InventoryModule,
    FuelModule,
  ],
})
export class AppModule {}
