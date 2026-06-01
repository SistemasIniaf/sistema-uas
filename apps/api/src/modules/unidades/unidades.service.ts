import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { QueryUnidadDto } from './dto/query-unidad.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

const listSelect = {
  id: true,
  nombre: true,
  descripcion: true,
  activo: true,
  _count: { select: { usuarios: true } },
} as const;

@Injectable()
export class UnidadesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUnidadDto) {
    const existe = await this.prisma.unidad.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException(
        `Ya existe una unidad con el nombre "${dto.nombre}"`,
      );
    }

    return this.prisma.unidad.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        activo: dto.activo ?? true,
      },
    });
  }

  async findAll(query: QueryUnidadDto) {
    const { page = 1, limit = 10, search, soloActivos } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(soloActivos !== undefined ? { activo: soloActivos } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' as const } },
              {
                descripcion: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.unidad.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: listSelect,
      }),
      this.prisma.unidad.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(soloActivos = true) {
    return this.prisma.unidad.findMany({
      where: soloActivos ? { activo: true } : undefined,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        activo: true,
      },
    });
  }

  async findOne(id: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true,
            activo: true,
          },
        },
      },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${id} no encontrada`);
    }

    return unidad;
  }

  async update(id: number, dto: UpdateUnidadDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const duplicado = await this.prisma.unidad.findFirst({
        where: { nombre: dto.nombre, NOT: { id } },
      });

      if (duplicado) {
        throw new BadRequestException(
          `Ya existe otra unidad con el nombre "${dto.nombre}"`,
        );
      }
    }

    return this.prisma.unidad.update({
      where: { id },
      data: dto,
    });
  }

  async toggleActivo(id: number) {
    const unidad = await this.findOne(id);

    return this.prisma.unidad.update({
      where: { id },
      data: { activo: !unidad.activo },
      select: { id: true, nombre: true, descripcion: true, activo: true },
    });
  }

  async remove(id: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id },
      include: { _count: { select: { usuarios: true } } },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${id} no encontrada`);
    }

    if (unidad._count.usuarios > 0) {
      throw new BadRequestException(
        `No se puede eliminar la unidad "${unidad.nombre}" porque tiene ${unidad._count.usuarios} usuario(s) asignado(s). Desactívala en su lugar.`,
      );
    }

    return this.prisma.unidad.delete({ where: { id } });
  }
}
