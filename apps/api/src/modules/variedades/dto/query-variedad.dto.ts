import { IsInt, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { transformBoolean } from 'src/common/helpers/transform-boolean.helper';

export class QueryVariedadDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productoId?: number;

  @IsOptional()
  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    transformBoolean(obj, 'activo'),
  )
  activo?: boolean;
}
