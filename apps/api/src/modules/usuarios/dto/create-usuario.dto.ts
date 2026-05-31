import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Rol } from 'src/common/enums/rol.enum';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsString()
  @MinLength(3, { message: 'El usuario debe tener al menos 3 caracteres' })
  usuario!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsEnum(Rol, {
    message: `El rol debe ser uno de: ${Object.values(Rol).join(', ')}`,
  })
  rol!: Rol;

  @IsInt({ message: 'El id de la unidad debe ser un número entero' })
  @IsOptional()
  unidadId?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
