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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryUsuarioDto } from './dto/query-usuario.dto';

import { Rol } from 'src/common/enums/rol.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  // Solo administrador puede crear usuarios.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  // Solo administrador puede listar todos los usuarios. ?soloActivos=true → filtra solo los activos.
  @Get()
  @Roles(Rol.ADMINISTRADOR)
  findAll(@Query() query: QueryUsuarioDto) {
    return this.usuariosService.findAll(query);
  }

  @Get('all')
  @Roles(Rol.ADMINISTRADOR)
  findAllNoPaginated(
    @Query('soloActivos') soloActivos?: string,
    @Query('rol') rol?: Rol,
  ) {
    const activos = soloActivos === undefined ? true : soloActivos === 'true';
    return this.usuariosService.findAllNoPaginated(activos, rol);
  }

  // Cualquier usuario autenticado puede ver su propio perfil.
  @Get('perfil')
  getPerfil(@CurrentUser() user: JwtPayload) {
    return this.usuariosService.findOne(user.sub);
  }

  // Solo administrador puede ver el detalle de cualquier usuario.
  @Get(':id')
  @Roles(Rol.ADMINISTRADOR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  //Cualquier usuario autenticado puede cambiar su propia contraseña.
  @Patch('perfil/password')
  @HttpCode(HttpStatus.OK)
  changeMyPassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usuariosService.changePassword(user.sub, dto);
  }

  // Solo administrador puede editar cualquier usuario.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  // Solo administrador puede activar/desactivar usuarios.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.toggleActivo(id);
  }

  // Solo administrador puede eliminar usuarios.
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
