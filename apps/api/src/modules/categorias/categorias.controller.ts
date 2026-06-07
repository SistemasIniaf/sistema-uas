import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Rol } from 'src/common/enums/rol.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { QueryCategoriaDto } from './dto/query-categoria.dto';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  // Solo administrador puede crear categorías.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  // Todos los roles autenticados pueden listar categorías.
  @Get()
  findAll(@Query() query: QueryCategoriaDto) {
    return this.categoriasService.findAll(query);
  }

  // Lista completa sin paginar — para selects/dropdowns.
  @Get('all')
  findAllNoPaginated(@Query('activo') activo?: string) {
    const activos = activo === undefined ? true : activo === 'true';
    return this.categoriasService.findAllNoPaginated(activos);
  }

  // Detalle de una categoría.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  // Solo administrador puede editar.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, dto);
  }

  // Activa o desactiva la categoría.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.toggleActivo(id);
  }

  // Elimina una categoría.
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }
}
