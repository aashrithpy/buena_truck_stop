import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly users: UsersService) {}

  // Seed an initial admin user if none exist
  async onModuleInit() {
    const count = await this.users.count();
    if (count > 0) return;

    const email = process.env.INIT_ADMIN_EMAIL || 'admin@buena.local';
    const password = process.env.INIT_ADMIN_PASSWORD || 'ChangeMe123!';

    const passwordHash = await bcrypt.hash(password, 10);
    await this.users.create(email, passwordHash, 'admin');

    // Print once in console so you can log in
    // (ok for local dev; remove before production)
    // eslint-disable-next-line no-console
    console.log(`Seeded admin user: ${email} / ${password}`);
  }
}
