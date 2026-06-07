import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVariedadDto {
  @IsString()
  @MinLength(1, { message: 'El nombre debe tener al menos 1 caracter' })
  nombre!: string;

  @IsInt({ message: 'El productoId debe ser un número entero' })
  productoId!: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
