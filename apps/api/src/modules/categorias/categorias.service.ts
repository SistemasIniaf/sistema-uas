import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { QueryCategoriaDto } from './dto/query-categoria.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

const listSelect = {
  id: true,
  nombre: true,
  activo: true,
} as const;

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoriaDto) {
    const existe = await this.prisma.categoria.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new BadRequestException(
        `Ya existe una categoría con el nombre "${dto.nombre}"`,
      );
    }

    return this.prisma.categoria.create({
      data: {
        nombre: dto.nombre,
        activo: dto.activo ?? true,
      },
      select: listSelect,
    });
  }

  async findAll(query: QueryCategoriaDto) {
    const { page = 1, limit = 10, search, activo } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(activo !== undefined ? { activo } : {}),
      ...(search
        ? { nombre: { contains: search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.categoria.findMany({
        where,
        orderBy: { nombre: 'asc' },
        skip,
        take: limit,
        select: listSelect,
      }),
      this.prisma.categoria.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  findAllNoPaginated(activo = true) {
    return this.prisma.categoria.findMany({
      where: activo ? { activo: true } : undefined,
      orderBy: { nombre: 'asc' },
      select: listSelect,
    });
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      select: listSelect,
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }

    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const duplicado = await this.prisma.categoria.findFirst({
        where: { nombre: dto.nombre, NOT: { id } },
      });

      if (duplicado) {
        throw new BadRequestException(
          `Ya existe otra categoría con el nombre "${dto.nombre}"`,
        );
      }
    }

    return this.prisma.categoria.update({
      where: { id },
      data: dto,
      select: listSelect,
    });
  }

  async toggleActivo(id: number) {
    const categoria = await this.findOne(id);

    return this.prisma.categoria.update({
      where: { id },
      data: { activo: !categoria.activo },
      select: listSelect,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.categoria.delete({
      where: { id },
      select: listSelect,
    });
  }
}
