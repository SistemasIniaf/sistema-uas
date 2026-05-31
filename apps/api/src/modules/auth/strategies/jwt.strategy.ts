import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Llamado automáticamente por Passport tras verificar la firma del token.
   * El objeto retornado se asigna a req.user.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, activo: true },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }

    return {
      sub: payload.sub,
      usuario: payload.usuario,
      rol: payload.rol,
      unidadId: payload.unidadId,
    };
  }
}
