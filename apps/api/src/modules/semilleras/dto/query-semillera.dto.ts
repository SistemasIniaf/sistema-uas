import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { transformBoolean } from 'src/common/helpers/transform-boolean.helper';

export class QuerySemilleraDto extends PaginationDto {
  @IsOptional()
  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    transformBoolean(obj, 'activo'),
  )
  activo?: boolean;

  /**
   * Solo ADMINISTRADOR puede filtrar por unidad desde query.
   * Para los demás roles se ignora y se usa el del JWT.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  unidadId?: number;
}
