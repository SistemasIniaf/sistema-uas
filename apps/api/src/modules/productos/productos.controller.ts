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
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductoDto } from './dto/query-producto.dto';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  // Solo administrador puede crear productos.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  // Todos los roles autenticados pueden listar productos.
  @Get()
  findAll(@Query() query: QueryProductoDto) {
    return this.productosService.findAll(query);
  }

  // Lista completa sin paginar — para selects/dropdowns.
  @Get('all')
  findAllNoPaginated(@Query('activo') activo?: string) {
    const activos = activo === undefined ? true : activo === 'true';
    return this.productosService.findAllNoPaginated(activos);
  }

  // Detalle de un producto con sus variedades.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // Solo administrador puede editar.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, dto);
  }

  // Activa o desactiva el producto.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.toggleActivo(id);
  }

  // Solo si no tiene variedades registradas.
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
