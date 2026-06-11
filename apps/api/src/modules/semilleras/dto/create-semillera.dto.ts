import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSemilleraDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsString()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  telefono!: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  /**
   * Requerido solo para ADMINISTRADOR.
   * RESPONSABLE/OPERADOR/AUDITOR lo ignoran — se toma del JWT.
   */
  @IsInt({ message: 'El unidadId debe ser un número entero' })
  @IsOptional()
  unidadId?: number;
}
