import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';
import { QueryVariedadDto } from './dto/query-variedad.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

const listSelect = {
  id: true,
  nombre: true,
  activo: true,
  productoId: true,
  producto: {
    select: { id: true, nombre: true },
  },
} as const;

@Injectable()
export class VariedadesService {
  constructor(private prisma: PrismaService) {}

  private async validarProducto(productoId: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      throw new NotFoundException(
        `Producto con id ${productoId} no encontrado`,
      );
    }

    if (!producto.activo) {
      throw new BadRequestException(
        `El producto "${producto.nombre}" está inactivo y no puede tener nuevas variedades`,
      );
    }

    return producto;
  }

  async create(dto: CreateVariedadDto) {
    await this.validarProducto(dto.productoId);

    const duplicado = await this.prisma.variedad.findUnique({
      where: {
        productoId_nombre: {
          productoId: dto.productoId,
          nombre: dto.nombre,
        },
      },
    });

    if (duplicado) {
      throw new BadRequestException(
        `Ya existe una variedad "${dto.nombre}" para este producto`,
      );
    }

    return this.prisma.variedad.create({
      data: {
        nombre: dto.nombre,
        productoId: dto.productoId,
        activo: dto.activo ?? true,
      },
      select: listSelect,
    });
  }

  async findAll(query: QueryVariedadDto) {
    const { page = 1, limit = 10, search, productoId, activo } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(activo !== undefined ? { activo } : {}),
      ...(productoId ? { productoId } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' as const } },
              {
                producto: {
                  nombre: { contains: search, mode: 'insensitive' as const },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.variedad.findMany({
        where,
        orderBy: [{ producto: { nombre: 'asc' } }, { nombre: 'asc' }],
        skip,
        take: limit,
        select: listSelect,
      }),
      this.prisma.variedad.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(productoId?: number, activo = true) {
    return this.prisma.variedad.findMany({
      where: {
        ...(activo ? { activo: true } : {}),
        ...(productoId ? { productoId } : {}),
      },
      orderBy: [{ producto: { nombre: 'asc' } }, { nombre: 'asc' }],
      select: {
        id: true,
        nombre: true,
        activo: true,
        productoId: true,
        producto: { select: { id: true, nombre: true } },
      },
    });
  }

  async findOne(id: number) {
    const variedad = await this.prisma.variedad.findUnique({
      where: { id },
      select: listSelect,
    });

    if (!variedad) {
      throw new NotFoundException(`Variedad con id ${id} no encontrada`);
    }

    return variedad;
  }

  async update(id: number, dto: UpdateVariedadDto) {
    const actual = await this.findOne(id);

    const productoId = dto.productoId ?? actual.productoId;

    if (dto.productoId && dto.productoId !== actual.productoId) {
      await this.validarProducto(dto.productoId);
    }

    const nombreFinal = dto.nombre ?? actual.nombre;

    // Verificar unicidad productoId+nombre si algo cambió
    if (dto.nombre || dto.productoId) {
      const duplicado = await this.prisma.variedad.findFirst({
        where: {
          productoId,
          nombre: nombreFinal,
          NOT: { id },
        },
      });

      if (duplicado) {
        throw new BadRequestException(
          `Ya existe una variedad "${nombreFinal}" para este producto`,
        );
      }
    }

    return this.prisma.variedad.update({
      where: { id },
      data: dto,
      select: listSelect,
    });
  }

  async toggleActivo(id: number) {
    const variedad = await this.findOne(id);

    return this.prisma.variedad.update({
      where: { id },
      data: { activo: !variedad.activo },
      select: { id: true, nombre: true, activo: true, productoId: true },
    });
  }

  async remove(id: number) {
    const variedad = await this.prisma.variedad.findUnique({
      where: { id },
    });

    if (!variedad) {
      throw new NotFoundException(`Variedad con id ${id} no encontrada`);
    }

    return this.prisma.variedad.delete({ where: { id } });
  }
}
