import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { role: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('Required Roles: ', requiredRoles);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    console.log('User Role: ', user?.role);
    if (!user || !user.role)
      throw new ForbiddenException('You do not have the required role');
    return requiredRoles.includes(user.role);
  }
}
