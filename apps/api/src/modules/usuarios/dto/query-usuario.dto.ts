import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Rol } from 'src/common/enums/rol.enum';

/**
 * Query params para GET /usuarios (paginado).
 *
 * Ejemplo:
 *   GET /usuarios?page=1&limit=10&search=juan&rol=auditor&soloActivos=true
 *
 * - search      → busca en nombre y usuario (case-insensitive)
 * - rol         → filtra por rol exacto
 * - soloActivos → filtra solo los usuarios activos
 */
export class QueryUsuarioDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Rol, {
    message: `El rol debe ser uno de: ${Object.values(Rol).join(', ')}`,
  })
  rol?: Rol;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  soloActivos?: boolean;
}
