import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCatalogoServicioDto {
  @IsOptional()
  @IsString()
  service_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  orden_id?: number;
}
