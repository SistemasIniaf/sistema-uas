import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateSemilleraDto } from './dto/create-semillera.dto';
import { UpdateSemilleraDto } from './dto/update-semillera.dto';
import { QuerySemilleraDto } from './dto/query-semillera.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Rol } from 'src/common/enums/rol.enum';

const listSelect = {
  id: true,
  nombre: true,
  telefono: true,
  direccion: true,
  activo: true,
  unidadId: true,
  unidad: { select: { id: true, nombre: true } },
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SemillerasService {
  constructor(private prisma: PrismaService) {}

  // ─── Helper: resuelve la unidad según el rol ──────────────────────────────

  private async resolverUnidad(
    rol: Rol,
    unidadIdJwt: number | null,
    unidadIdBody?: number,
  ): Promise<number> {
    if (rol === Rol.ADMINISTRADOR) {
      if (!unidadIdBody) {
        throw new BadRequestException(
          'El administrador debe especificar el campo "unidadId" en el body',
        );
      }
      await this.validarUnidadExistente(unidadIdBody);
      return unidadIdBody;
    }

    // Roles no-admin: usan su unidad del JWT, ignoran lo que venga en body
    if (!unidadIdJwt) {
      throw new ForbiddenException(
        'Tu usuario no tiene una unidad asignada. Contacta al administrador.',
      );
    }

    return unidadIdJwt;
  }

  private async validarUnidadExistente(unidadId: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id: unidadId },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${unidadId} no encontrada`);
    }

    if (!unidad.activo) {
      throw new BadRequestException(
        `La unidad "${unidad.nombre}" está inactiva`,
      );
    }
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async create(dto: CreateSemilleraDto, currentUser: JwtPayload) {
    const unidadId = await this.resolverUnidad(
      currentUser.rol,
      currentUser.unidadId,
      dto.unidadId,
    );

    return this.prisma.semillera.create({
      data: {
        nombre: dto.nombre,
        telefono: dto.telefono,
        direccion: dto.direccion ?? null,
        activo: dto.activo ?? true,
        unidadId,
      },
      select: listSelect,
    });
  }

  async findAll(query: QuerySemilleraDto, currentUser: JwtPayload) {
    const { page = 1, limit = 10, search, activo } = query;
    const skip = (page - 1) * limit;

    // Admin puede filtrar por cualquier unidad desde el query param.
    // Los demás roles siempre ven solo su propia unidad.
    const unidadId =
      currentUser.rol === Rol.ADMINISTRADOR
        ? query.unidadId
        : (currentUser.unidadId ?? undefined);

    const where = {
      ...(unidadId ? { unidadId } : {}),
      ...(activo !== undefined ? { activo } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' as const } },
              { telefono: { contains: search, mode: 'insensitive' as const } },
              {
                direccion: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.semillera.findMany({
        where,
        orderBy: { nombre: 'asc' },
        skip,
        take: limit,
        select: listSelect,
      }),
      this.prisma.semillera.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(currentUser: JwtPayload, unidadIdQuery?: number) {
    // Admin puede pedir por unidad específica o todas.
    // No-admin siempre filtra por su unidad.
    const unidadId =
      currentUser.rol === Rol.ADMINISTRADOR
        ? unidadIdQuery
        : (currentUser.unidadId ?? undefined);

    return this.prisma.semillera.findMany({
      where: {
        ...(unidadId ? { unidadId } : {}),
        activo: true,
      },
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        direccion: true,
        activo: true,
        unidadId: true,
        unidad: { select: { id: true, nombre: true } },
      },
    });
  }

  async findOne(id: number, currentUser: JwtPayload) {
    const semillera = await this.prisma.semillera.findUnique({
      where: { id },
      select: listSelect,
    });

    if (!semillera) {
      throw new NotFoundException(`Semillera con id ${id} no encontrada`);
    }

    // No-admin solo puede ver semilleras de su propia unidad
    if (
      currentUser.rol !== Rol.ADMINISTRADOR &&
      semillera.unidadId !== currentUser.unidadId
    ) {
      throw new ForbiddenException('No tienes acceso a esta semillera');
    }

    return semillera;
  }

  async update(id: number, dto: UpdateSemilleraDto, currentUser: JwtPayload) {
    // findOne ya valida acceso por unidad
    await this.findOne(id, currentUser);

    // Si admin intenta cambiar la unidad, validar que exista
    if (dto.unidadId && currentUser.rol === Rol.ADMINISTRADOR) {
      await this.validarUnidadExistente(dto.unidadId);
    }

    // No-admin no puede cambiar la unidad de una semillera
    if (dto.unidadId && currentUser.rol !== Rol.ADMINISTRADOR) {
      throw new ForbiddenException(
        'No tienes permiso para cambiar la unidad de una semillera',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { unidadId: _unidadId, ...restDto } = dto;

    const data = {
      ...restDto,
      ...(currentUser.rol === Rol.ADMINISTRADOR && dto.unidadId
        ? { unidadId: dto.unidadId }
        : {}),
    };

    return this.prisma.semillera.update({
      where: { id },
      data,
      select: listSelect,
    });
  }

  async toggleActivo(id: number, currentUser: JwtPayload) {
    const semillera = await this.findOne(id, currentUser);

    return this.prisma.semillera.update({
      where: { id },
      data: { activo: !semillera.activo },
      select: {
        id: true,
        nombre: true,
        activo: true,
        unidadId: true,
      },
    });
  }

  async remove(id: number, currentUser: JwtPayload) {
    // findOne valida acceso
    await this.findOne(id, currentUser);

    return this.prisma.semillera.delete({
      where: { id },
      select: { id: true, nombre: true },
    });
  }
}
