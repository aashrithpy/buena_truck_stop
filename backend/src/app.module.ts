import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { FuelModule } from "./fuel/fuel.module";
import { ServicesModule } from "./services/services.module";
import { InventoryModule } from "./inventory/inventory.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CustomersModule } from "./customers/customers.module";
import { ParkingModule } from "./parking/parking.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get<string>("NODE_ENV") === "production";

        return {
          type: "postgres",
          host: cfg.get<string>("DATABASE_HOST"),
          port: Number(cfg.get<string>("DATABASE_PORT")),
          username: cfg.get<string>("DATABASE_USER"),
          password: cfg.get<string>("DATABASE_PASSWORD"),
          database: cfg.get<string>("DATABASE_NAME"),
          autoLoadEntities: true,
          synchronize: true,

          // ✅ Local: no SSL. Prod (RDS): SSL.
          ssl: isProd ? { rejectUnauthorized: false } : false,

          // Some drivers read this instead; safe to include
          extra: isProd ? { ssl: { rejectUnauthorized: false } } : {},
        };
      },
    }),

    UsersModule,
    AuthModule,
    CustomersModule,
    ServicesModule,
    InventoryModule,
    FuelModule,
    ParkingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
