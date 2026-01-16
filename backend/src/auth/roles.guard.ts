import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowed: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const role = req.user?.role;

    if (!role || !this.allowed.includes(role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
