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
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';
import { QueryVariedadDto } from './dto/query-variedad.dto';
import { VariedadesService } from './variedades.service';

@Controller('variedades')
export class VariedadesController {
  constructor(private variedadesService: VariedadesService) {}

  // Solo administrador puede crear variedades.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateVariedadDto) {
    return this.variedadesService.create(dto);
  }

  // Todos los roles autenticados pueden listar. ?productoId=1 filtra por producto.
  @Get()
  findAll(@Query() query: QueryVariedadDto) {
    return this.variedadesService.findAll(query);
  }

  // Lista completa sin paginar — para selects/dropdowns.
  @Get('all')
  findAllNoPaginated(
    @Query('productoId') productoId?: string,
    @Query('activo') activo?: string,
  ) {
    const productoIdNum = productoId ? Number(productoId) : undefined;
    const activoBool = activo === undefined ? true : activo === 'true';
    return this.variedadesService.findAllNoPaginated(productoIdNum, activoBool);
  }

  // Detalle de una variedad.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variedadesService.findOne(id);
  }

  // Solo administrador puede editar.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVariedadDto,
  ) {
    return this.variedadesService.update(id, dto);
  }

  // Activa o desactiva la variedad.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.variedadesService.toggleActivo(id);
  }

  // Elimina una variedad (sin restricción de relaciones).
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variedadesService.remove(id);
  }
}
