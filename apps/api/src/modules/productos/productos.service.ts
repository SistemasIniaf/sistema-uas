import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductoDto } from './dto/query-producto.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

const listSelect = {
  id: true,
  nombre: true,
  activo: true,
  _count: { select: { variedades: true } },
} as const;

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductoDto) {
    const existe = await this.prisma.producto.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException(
        `Ya existe un producto con el nombre "${dto.nombre}"`,
      );
    }

    return this.prisma.producto.create({
      data: {
        nombre: dto.nombre,
        activo: dto.activo ?? true,
      },
    });
  }

  async findAll(query: QueryProductoDto) {
    const { page = 1, limit = 10, search, activo } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(activo !== undefined ? { activo } : {}),
      ...(search
        ? { nombre: { contains: search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        where,
        orderBy: { nombre: 'asc' },
        skip,
        take: limit,
        select: listSelect,
      }),
      this.prisma.producto.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(activo = true) {
    return this.prisma.producto.findMany({
      where: activo ? { activo: true } : undefined,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        activo: true,
      },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        variedades: {
          orderBy: { nombre: 'asc' },
          select: {
            id: true,
            nombre: true,
            activo: true,
          },
        },
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    return producto;
  }

  async update(id: number, dto: UpdateProductoDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const duplicado = await this.prisma.producto.findFirst({
        where: { nombre: dto.nombre, NOT: { id } },
      });

      if (duplicado) {
        throw new BadRequestException(
          `Ya existe otro producto con el nombre "${dto.nombre}"`,
        );
      }
    }

    return this.prisma.producto.update({
      where: { id },
      data: dto,
      select: listSelect,
    });
  }

  async toggleActivo(id: number) {
    const producto = await this.findOne(id);

    return this.prisma.producto.update({
      where: { id },
      data: { activo: !producto.activo },
      select: { id: true, nombre: true, activo: true },
    });
  }

  async remove(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { _count: { select: { variedades: true } } },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    if (producto._count.variedades > 0) {
      throw new BadRequestException(
        `No se puede eliminar el producto "${producto.nombre}" porque tiene ${producto._count.variedades} variedad(es) registrada(s). Desactívalo en su lugar.`,
      );
    }

    return this.prisma.producto.delete({ where: { id } });
  }
}
