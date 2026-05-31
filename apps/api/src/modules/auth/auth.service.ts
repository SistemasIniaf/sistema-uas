import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { Rol } from 'src/common/enums/rol.enum';
import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { usuario: dto.usuario },
      include: { unidad: { select: { id: true, nombre: true, sigla: true } } },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValido = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload: JwtPayload = {
      sub: usuario.id,
      usuario: usuario.usuario,
      rol: usuario.rol as Rol,
      unidadId: usuario.unidadId ?? null,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        rol: usuario.rol,
        unidad: usuario.unidad ?? null,
      },
    };
  }

  /**
   * Refresca los datos del usuario autenticado (útil para /auth/me).
   */
  async me(payload: JwtPayload) {
    const usuario = await this.prisma.usuario.findUniqueOrThrow({
      where: { id: payload.sub },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        rol: true,
        activo: true,
        unidad: { select: { id: true, nombre: true, sigla: true } },
      },
    });
    return usuario;
  }
}
