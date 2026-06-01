import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Rol } from 'src/common/enums/rol.enum';
import { transformBoolean } from 'src/common/helpers/transform-boolean.helper';

export class QueryUsuarioDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Rol, {
    message: `El rol debe ser uno de: ${Object.values(Rol).join(', ')}`,
  })
  rol?: Rol;

  @IsOptional()
  @Transform(({ obj }: { obj: Record<string, unknown> }) =>
    transformBoolean(obj, 'soloActivos'),
  )
  soloActivos?: boolean;
}
