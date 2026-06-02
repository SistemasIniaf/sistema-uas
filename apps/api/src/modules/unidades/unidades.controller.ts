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
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { QueryUnidadDto } from './dto/query-unidad.dto';
import { UnidadesService } from './unidades.service';

@Controller('unidades')
export class UnidadesController {
  constructor(private unidadesService: UnidadesService) {}

  // Solo administrador puede crear unidades.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateUnidadDto) {
    return this.unidadesService.create(dto);
  }

  // -Todos los roles autenticados pueden listar unidades. ?activo=true → filtra solo las activas.
  @Get()
  findAll(@Query() query: QueryUnidadDto) {
    return this.unidadesService.findAll(query);
  }

  // Lista completa sin paginar
  @Get('all')
  findAllNoPaginated(@Query('activo') activo?: string) {
    const activos = activo === undefined ? true : activo === 'true';
    return this.unidadesService.findAllNoPaginated(activos);
  }

  // Incluye la lista de usuarios asignados.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.findOne(id);
  }

  // Solo administrador puede editar.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUnidadDto) {
    return this.unidadesService.update(id, dto);
  }

  // Activa o desactiva la unidad.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.toggleActivo(id);
  }

  // Solo si no tiene usuarios asignados.
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.remove(id);
  }
}
