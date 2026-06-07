import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { transformBoolean } from 'src/common/helpers/transform-boolean.helper';

export class QueryProductoDto extends PaginationDto {
  @IsOptional()
  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    transformBoolean(obj, 'activo'),
  )
  activo?: boolean;
}
