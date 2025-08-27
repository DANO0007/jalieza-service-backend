import { IsString, MinLength } from 'class-validator';

export class SearchCiudadanoDto {
  @IsString()
  @MinLength(2, { message: 'La búsqueda debe tener al menos 2 caracteres' })
  query: string;
}
