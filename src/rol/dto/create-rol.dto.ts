import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateRolDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'El nombre del rol debe ser un texto' })
  @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
  role_name: string;
}
