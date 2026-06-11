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

import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Rol } from 'src/common/enums/rol.enum';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

import { CreateSemilleraDto } from './dto/create-semillera.dto';
import { UpdateSemilleraDto } from './dto/update-semillera.dto';
import { QuerySemilleraDto } from './dto/query-semillera.dto';
import { SemillerasService } from './semilleras.service';

@Controller('semilleras')
export class SemillerasController {
  constructor(private semillerasService: SemillerasService) {}

  /**
   * Crea una semillera.
   * - Admin: debe enviar unidadId en el body.
   * - Otros roles: se usa la unidad del JWT automáticamente.
   */
  @Post()
  @Roles(Rol.ADMINISTRADOR, Rol.RESPONSABLE, Rol.OPERADOR)
  create(@Body() dto: CreateSemilleraDto, @CurrentUser() user: JwtPayload) {
    return this.semillerasService.create(dto, user);
  }

  /**
   * Lista paginada.
   * - Admin: ve todas, puede filtrar por ?unidadId=.
   * - Otros: ven solo las de su unidad.
   */
  @Get()
  findAll(@Query() query: QuerySemilleraDto, @CurrentUser() user: JwtPayload) {
    return this.semillerasService.findAll(query, user);
  }

  /**
   * Lista completa sin paginar — para selects/dropdowns.
   * Solo devuelve activas. Admin puede filtrar por ?unidadId=.
   */
  @Get('all')
  findAllNoPaginated(
    @Query('unidadId') unidadId: string | undefined,
    @CurrentUser() user: JwtPayload,
  ) {
    const unidadIdNum = unidadId ? Number(unidadId) : undefined;
    return this.semillerasService.findAllNoPaginated(user, unidadIdNum);
  }

  /**
   * Detalle de una semillera.
   * No-admin solo puede ver las de su propia unidad.
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.semillerasService.findOne(id, user);
  }

  /**
   * Edita una semillera.
   * - Admin puede cambiar la unidad.
   * - No-admin no puede cambiar la unidad.
   */
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.RESPONSABLE, Rol.OPERADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSemilleraDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.semillerasService.update(id, dto, user);
  }

  /**
   * Activa o desactiva una semillera.
   */
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR, Rol.RESPONSABLE, Rol.OPERADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.semillerasService.toggleActivo(id, user);
  }

  /**
   * Elimina una semillera.
   * Solo admin y responsable pueden eliminar.
   */
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR, Rol.RESPONSABLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.semillerasService.remove(id, user);
  }
}
