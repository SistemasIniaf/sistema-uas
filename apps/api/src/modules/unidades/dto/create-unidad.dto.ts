import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUnidadDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsString()
  @MinLength(2, { message: 'La sigla debe tener al menos 2 caracteres' })
  @MaxLength(10, { message: 'La sigla no puede tener más de 10 caracteres' })
  sigla!: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
