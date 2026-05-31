import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  passwordActual!: string;

  @IsString()
  @MinLength(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  passwordNuevo!: string;
}
