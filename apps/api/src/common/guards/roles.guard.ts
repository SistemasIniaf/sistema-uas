import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { Rol } from '../enums/rol.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Guard de autorización por roles.
 * Debe usarse SIEMPRE después de JwtAuthGuard (req.user ya debe existir).
 * Si no hay roles definidos en el handler, deja pasar.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Sin @Roles() → ruta autenticada pero sin restricción de rol
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de los roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
