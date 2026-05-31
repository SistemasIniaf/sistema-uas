import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { CreateUsuarioDto } from './create-usuario.dto';

// Omitimos password del PartialType y lo redefinimos como opcional explícito
// para dejar claro que cambiar la contraseña es intencional
export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ['password'] as const),
) {
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsOptional()
  password?: string;
}
