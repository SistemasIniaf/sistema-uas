import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre!: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
