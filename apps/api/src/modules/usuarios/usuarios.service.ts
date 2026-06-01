import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Rol } from 'src/common/enums/rol.enum';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryUsuarioDto } from './dto/query-usuario.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

const SALT_ROUNDS = 10;

/** Campos seguros para devolver al cliente (sin password) */
const safeSelect = {
  id: true,
  nombre: true,
  usuario: true,
  rol: true,
  activo: true,
  unidadId: true,
  createdAt: true,
  updatedAt: true,
  unidad: {
    select: { id: true, nombre: true },
  },
};

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // ─── Helpers privados ────────────────────────────────────────────────────────
  private async validarUnidad(rol: Rol, unidadId?: number) {
    if (rol === Rol.ADMINISTRADOR) {
      if (unidadId) {
        throw new BadRequestException(
          'El administrador no puede tener unidad asignada',
        );
      }
      return;
    }

    // Todos los demás roles requieren unidad
    if (!unidadId) {
      throw new BadRequestException(
        `El rol "${rol}" requiere tener una unidad asignada`,
      );
    }

    const unidad = await this.prisma.unidad.findUnique({
      where: { id: unidadId },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${unidadId} no encontrada`);
    }

    if (!unidad.activo) {
      throw new BadRequestException(
        `La unidad "${unidad.nombre}" está inactiva y no puede asignarse`,
      );
    }
  }

  private async verificarUsuarioUnico(usuario: string, excludeId?: number) {
    const existe = await this.prisma.usuario.findFirst({
      where: { usuario, NOT: excludeId ? { id: excludeId } : undefined },
    });

    if (existe) {
      throw new ConflictException(
        `El nombre de usuario "${usuario}" ya está en uso`,
      );
    }
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────
  async create(dto: CreateUsuarioDto) {
    await this.verificarUsuarioUnico(dto.usuario);
    await this.validarUnidad(dto.rol, dto.unidadId);

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        usuario: dto.usuario,
        password: hash,
        rol: dto.rol,
        activo: dto.activo ?? true,
        unidadId: dto.unidadId ?? null,
      },
      select: safeSelect,
    });
  }

  async findAll(query: QueryUsuarioDto) {
    const { page = 1, limit = 10, search, rol, soloActivos } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(soloActivos !== undefined ? { activo: soloActivos } : {}),
      ...(rol ? { rol } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' as const } },
              { usuario: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: safeSelect,
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(soloActivos = true, rol?: Rol) {
    return this.prisma.usuario.findMany({
      where: {
        ...(soloActivos ? { activo: true } : {}),
        ...(rol ? { rol } : {}),
      },
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        rol: true,
        activo: true,
        unidad: { select: { id: true, nombre: true } },
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: safeSelect,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const actual = await this.findOne(id);

    if (dto.usuario) {
      await this.verificarUsuarioUnico(dto.usuario, id);
    }

    const rolFinal = (dto.rol ?? actual.rol) as Rol;
    const unidadFinal =
      dto.unidadId !== undefined
        ? dto.unidadId
        : (actual.unidadId ?? undefined);
    await this.validarUnidad(rolFinal, unidadFinal);

    const data: Record<string, any> = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    if (rolFinal === Rol.ADMINISTRADOR) {
      data.unidadId = null;
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
      select: safeSelect,
    });
  }

  async toggleActivo(id: number) {
    const usuario = await this.findOne(id);

    return this.prisma.usuario.update({
      where: { id },
      data: { activo: !usuario.activo },
      select: { id: true, nombre: true, usuario: true, activo: true },
    });
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const passwordValido = await bcrypt.compare(
      dto.passwordActual,
      usuario.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const hash = await bcrypt.hash(dto.passwordNuevo, SALT_ROUNDS);

    await this.prisma.usuario.update({
      where: { id },
      data: { password: hash },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.usuario.delete({
      where: { id },
      select: { id: true, nombre: true, usuario: true },
    });
  }
}
